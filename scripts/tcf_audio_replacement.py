#!/usr/bin/env python3
"""Offline CO replacement inventory and reversible staging. Never writes production.

Default --plan writes reports only under work. --prepare stages complete replacement
files and backups, but never promotes/deletes them. Human evidence is not invented.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import copy
import datetime as dt
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
from urllib.parse import urlsplit

import tcf_audio_boundaries as boundaries

AUDIO_ROOT = '/lib/audio/tcf/co/'
BANK_GLOB = 'src/tcf/content/*/*.json'
INDEXES = ('src/tcf/content/audio-durations.json', 'src/tcf/content/co-reviewed-pools.json')
AUDIO_KEYS = {'audio', 'audios', 'audioSrc', 'audioParts', 'optionAudioSrcs', 'tcfAudioSlots'}
EXTENSIONS = {'.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'}


class ReplacementError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise ReplacementError(message)


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def sha256(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path):
    def invalid(value):
        raise ReplacementError('Nombre JSON non fini : ' + value)
    return json.loads(Path(path).read_text(encoding='utf-8'), parse_constant=invalid)


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('x', encoding='utf-8') as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2, allow_nan=False)
        handle.write('\n')


def pointer(path, key):
    return path + '/' + str(key).replace('~', '~0').replace('/', '~1')


def canonical_ref(value):
    if not isinstance(value, str) or not value.strip():
        return None
    value = value.strip()
    if value.startswith('data:'):
        return None
    if re.match(r'^https?://', value, re.I):
        return value if urlsplit(value).path.startswith(AUDIO_ROOT) else None
    if not value.startswith('/'):
        value = '/lib/audio/' + value
    return value if value.startswith(AUDIO_ROOT) else None


def local_ref(value):
    """Absolute URLs stay distinct: a matching pathname does not prove ownership."""
    value = canonical_ref(value)
    if value and not value.startswith('http'):
        return value.split('?', 1)[0].split('#', 1)[0]
    return None


def safe_ref(value):
    require(isinstance(value, str) and value.startswith(AUDIO_ROOT) and value.endswith('.mp3'),
            'new_ref doit rester sous /lib/audio/tcf/co/ et finir en .mp3.')
    require('\\' not in value and '%' not in value and '?' not in value and '#' not in value,
            'Chemin audio encodé ou ambigu interdit.')
    parts = value.split('/')
    require(all(part not in ('.', '..', '') for part in parts[1:]), 'Traversée ou composante vide dans new_ref.')
    return value


def safe_repo_path(repo, relative):
    path = repo / relative
    require(path.absolute() == path.resolve() and path.resolve().is_relative_to(repo),
            'Chemin de dépôt avec lien symbolique ou traversée interdit : ' + str(path))
    return path


def safe_work(repo, work):
    raw = Path(work).expanduser().absolute()
    require(raw == raw.resolve() and any(p == 'work' or p.startswith('work-') for p in raw.parts),
            'Utiliser un dossier work ou work-* sans lien symbolique/traversée.')
    require(not raw.is_relative_to(repo), 'Le dossier work doit être hors du dépôt de production.')
    require(not any(p in ('public', '.git') for p in raw.parts), 'Dossier de production interdit.')
    return raw


def probe(path, decode=False):
    path = Path(path)
    require(path.is_file() and not path.is_symlink(), 'Fichier audio absent ou symbolique : ' + str(path))
    with path.open('rb') as handle:
        require(not handle.read(140).startswith(b'version https://git-lfs.github.com/spec/v1'),
                'Pointeur Git LFS non hydraté : ' + str(path))
    try:
        out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
                              'stream=codec_name,sample_rate,channels,duration:format=duration,format_name',
                              '-of', 'json', str(path)], capture_output=True, text=True, check=True, timeout=30)
        data = json.loads(out.stdout)
        stream = data['streams'][0]
        seconds = float(stream.get('duration') or data['format']['duration'])
        require(math.isfinite(seconds) and seconds > 0, 'Durée audio invalide.')
        result = {'duration': seconds, 'sample_rate': int(stream['sample_rate']),
                  'channels': int(stream['channels']), 'codec': stream['codec_name'],
                  'format': data['format']['format_name'], 'full_decode_checked': decode}
        if decode:
            subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-xerror', '-i', str(path),
                            '-map', '0:a:0', '-f', 'null', '-'], capture_output=True, check=True, timeout=600)
        return result
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, KeyError, ValueError,
            IndexError, TypeError, FileNotFoundError) as exc:
        raise ReplacementError('Intégrité ffprobe/ffmpeg invalide : ' + str(path)) from exc


def json_refs(value, path='', exercise_id=None, field=''):
    """Exact values only; numeric question.audio is deliberately not a URL."""
    if isinstance(value, dict):
        if isinstance(value.get('id'), str) and 'support' in value and 'competence' in value:
            exercise_id = value['id']
        for key, item in value.items():
            yield from json_refs(item, pointer(path, key), exercise_id, key)
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from json_refs(item, pointer(path, index), exercise_id, field)
    elif isinstance(value, str):
        ref = canonical_ref(value)
        if ref and (field in AUDIO_KEYS or ref.startswith(AUDIO_ROOT)):
            yield {'pointer': path, 'ref': ref, 'exercise_id': exercise_id}


def inventory(repo):
    repo = Path(repo).resolve()
    audio_dir = safe_repo_path(repo, 'public/lib/audio/tcf/co')
    all_files = sorted(p for p in audio_dir.rglob('*') if p.is_file()) if audio_dir.exists() else []
    files = [path for path in all_files if path.suffix.lower() in EXTENSIONS]
    non_audio_files = [str(path.relative_to(repo)) for path in all_files if path.suffix.lower() not in EXTENSIONS]

    def inspect(path):
        if path.absolute() != path.resolve():
            return {'path': str(path.relative_to(repo)), 'ref': '/' + str(path.relative_to(repo / 'public')),
                    'integrity': 'invalid', 'error': 'Lien symbolique interdit ; cible non lue.'}
        result = {'path': str(path.relative_to(repo)), 'ref': '/' + str(path.relative_to(repo / 'public')),
                  'bytes': path.stat().st_size, 'sha256': sha256(path)}
        try:
            result.update(probe=probe(path), integrity='ffprobe-readable')
        except ReplacementError as exc:
            result.update(integrity='invalid', error=str(exc))
        return result

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        audio_files = list(pool.map(inspect, files))
    refs, banks, extra = [], [], []
    for path in sorted(repo.glob(BANK_GLOB)):
        relative = str(path.relative_to(repo))
        path = safe_repo_path(repo, relative)
        value = read_json(path)
        require(isinstance(value, list), 'Tableau de banque requis : ' + relative)
        if path.name == 'co.json':
            banks.append({'path': relative, 'sha256': sha256(path), 'exercises': len(value),
                          'exercise_ids': [item.get('id') for item in value]})
        for ref in json_refs(value):
            ref.update(file=relative, production=path.name == 'co.json')
            refs.append(ref)
    # Deliberately avoid environments, credentials, .git, installed packages.
    for dirname in ('src', 'scripts', 'docs', 'public/lib/images', 'tmp'):
        folder = repo / dirname
        if not folder.exists():
            continue
        for path in sorted(folder.rglob('*')):
            if not path.is_file() or path.suffix not in {'.ts', '.tsx', '.mjs', '.py', '.json', '.md'}:
                continue
            relative = str(path.relative_to(repo))
            if 'node_modules' in path.parts or any(p.startswith('.') for p in path.relative_to(repo).parts):
                continue
            if relative in {r['file'] for r in refs} or relative in INDEXES:
                continue
            if path.is_symlink():
                continue
            text = path.read_text(encoding='utf-8')
            category = ('runtime-source' if relative.startswith('src/') else
                        'media-metadata' if relative.startswith('public/') else
                        'historical-snapshot' if relative.startswith('tmp/') else 'archive-or-tooling')
            pattern = r'(?:/lib/audio/)?tcf/co/[^\s\'"`<>)\[\]{},;]+\.(?:mp3|wav|ogg|m4a|aac|flac)'
            found = sorted({canonical_ref(m.group(0)) for m in re.finditer(pattern, text)})
            if found:
                extra.append({'file': relative, 'category': category, 'refs': found, 'sha256': sha256(path)})
    try:
        head = subprocess.run(['git', '-C', str(repo), 'rev-parse', 'HEAD'], check=True,
                              capture_output=True, text=True).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        head = None
    index_refs = []
    for relative in INDEXES:
        path = safe_repo_path(repo, relative)
        if path.exists():
            value = read_json(path)
            require(isinstance(value, dict), 'Index audio objet requis : ' + relative)
            index_refs.extend({'file': relative, 'ref': ref} for key in value if (ref := canonical_ref(key)))
    co_refs = [r for r in refs if r['production']]
    by_audio = {}
    for ref in co_refs:
        by_audio.setdefault(ref['ref'], []).append({'file': ref['file'], 'pointer': ref['pointer'],
                                                    'exercise_id': ref['exercise_id']})
    return {'version': 1, 'created_at': now(), 'git_head': head, 'remote_database_inspected': False,
            'audio_root': AUDIO_ROOT, 'public_root': str(repo / 'public'), 'banks': banks,
            'summary': {'co_exercises': sum(b['exercises'] for b in banks), 'co_audio_references': len(co_refs),
                        'unique_co_urls': len(by_audio), 'audio_files': len(audio_files),
                        'invalid_audio_files': sum(f['integrity'] == 'invalid' for f in audio_files)},
            'files': audio_files, 'references': refs,
            'non_audio_files_preserve': non_audio_files,
            'runtime_index_references': index_refs,
            'orphan_audio_files': [row['ref'] for row in audio_files if row['ref'] not in by_audio],
            'shared_references': {key: rows for key, rows in by_audio.items() if len(rows) > 1},
            'extra_references': extra,
            'limits': ['ffprobe inventories container/stream integrity; staged new audio is fully decoded.',
                       'Extra source scan finds literals, not all dynamic consumers.',
                       'Repository and exported data are not live database observations.']}


def resolve_input(base, value):
    require(isinstance(value, str) and value, 'Chemin de fichier requis.')
    path = Path(value).expanduser()
    path = path if path.is_absolute() else base / path
    path = path.absolute()
    require(path == path.resolve() and path.is_file(), 'Fichier absent ou symbolique : ' + str(path))
    return path


def load_mapping(path):
    if path is None:
        return [], None
    path = Path(path).absolute()
    require(path == path.resolve() and path.is_file(), 'Mapping absent ou symbolique interdit.')
    value = read_json(path)
    require(isinstance(value, dict) and value.get('version') == 1 and isinstance(value.get('replacements'), list),
            'Mapping version:1 et replacements[] requis.')
    seen_old, seen_new, seen_ids = set(), set(), set()
    replacements = []
    for raw in value['replacements']:
        require(isinstance(raw, dict), 'Chaque remplacement doit être un objet.')
        require('new_refs' not in raw and isinstance(raw.get('new_ref'), str),
                'Découpage 1→N refusé : affectation explicite des questions et outil dédié requis.')
        identifier = raw.get('dialogue_id')
        require(isinstance(identifier, str) and re.fullmatch(r'[\w-]+', identifier) and identifier not in seen_ids,
                'dialogue_id unique sans traversée requis.')
        seen_ids.add(identifier)
        require(isinstance(raw.get('old_refs'), list) and raw['old_refs'] and
                all(isinstance(ref, str) and canonical_ref(ref) == ref for ref in raw['old_refs']),
                'old_refs doit contenir des références CO explicites normalisées.')
        require(len(set(raw['old_refs'])) == len(raw['old_refs']), 'old_refs contient un doublon.')
        require(not seen_old.intersection(raw['old_refs']), 'Une ancienne référence figure dans plusieurs remplacements (1→N ambigu).')
        seen_old.update(raw['old_refs'])
        target = safe_ref(raw['new_ref'])
        require(target not in seen_new, 'Collision de new_ref entre dialogues.')
        seen_new.add(target)
        text = raw.get('transcription')
        require(isinstance(text, str) and text.strip(), 'Transcription non vide requise.')
        tags = raw.get('tags')
        require(isinstance(tags, list) and tags and all(isinstance(tag, str) and tag.strip() for tag in tags),
                'Tags non vides requis.')
        remove_tags = raw.get('remove_tags', [])
        require(isinstance(remove_tags, list) and all(isinstance(tag, str) and tag.strip() for tag in remove_tags)
                and not set(tags).intersection(remove_tags), 'remove_tags doit lister seulement des tags obsolètes explicites, distincts des nouveaux tags.')
        item = copy.deepcopy(raw)
        item['transcription'] = ' '.join(text.split())
        item['staged_file'] = str(resolve_input(path.parent, raw.get('staged_file')))
        for key in ('validated_manifest', 'final_file_review'):
            if raw.get(key):
                item[key] = str(resolve_input(path.parent, raw[key]))
        replacements.append(item)
    # A chain A->B/B->C destroys the meaning of the intermediate URL.
    for item in replacements:
        require(item['new_ref'] not in seen_old or item['new_ref'] in item['old_refs'],
                'Chaîne de renommage/collision entre anciens et nouveaux chemins interdite.')
    return replacements, path


def validate_source(item):
    """Revalidate exact retained boundary artifacts and evidence, not status alone."""
    require(item.get('validated_manifest'), 'validated_manifest et preuves d’écoute requis.')
    path = Path(item['validated_manifest'])
    value = read_json(path)
    require(isinstance(value, dict) and value.get('status') == 'validated' and value.get('schema_version') == 1,
            'Manifeste de frontières validé requis.')
    original_path = path.parent / 'manifest.json'
    original = read_json(original_path)
    digest = sha256(original_path)
    validation = value.get('validation', {})
    require(validation.get('prepared_manifest_sha256') == digest, 'Manifeste initial différent de la validation.')
    try:
        boundaries.verify_integrity(original, path.parent)
        boundaries.validate_review(original, validation.get('human_evidence'), digest)
    except (boundaries.BoundaryError, TypeError, KeyError) as exc:
        raise ReplacementError('Preuves de frontières invalides : ' + str(exc)) from exc
    expected = copy.deepcopy(original)
    expected['status'] = 'validated'
    for segment in expected['segments']:
        segment['status'] = 'validated'
    expected['validation'] = validation
    require(value == expected, 'Manifeste validé modifié après validation.')
    matches = [segment for segment in value['segments'] if segment['id'] == item['dialogue_id']]
    require(len(matches) == 1, 'dialogue_id absent ou ambigu dans le manifeste validé.')
    segment = matches[0]
    require(' '.join(segment['transcript'].split()) == item['transcription'], 'Transcription différente du dialogue validé.')
    require(set(segment['tags']) == set(item['tags']), 'Tags différents du dialogue validé.')
    source = boundaries.safe_artifact(path.parent, segment['audio']['path'])
    require(sha256(source) == segment['audio']['sha256'], 'Audio validé modifié.')
    return {'validated_manifest': str(path), 'validated_manifest_sha256': sha256(path),
            'source_audio': str(source), 'source_audio_sha256': sha256(source),
            'reviewer': validation.get('reviewer'), 'segment': segment}


def encode_mp3(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    require(not target.exists(), 'Le fichier de staging existe déjà.')
    command = ['ffmpeg', '-nostdin', '-v', 'error', '-n', '-i', str(source), '-map', '0:a:0',
               '-map_metadata', '-1', '-vn', '-c:a', 'libmp3lame', '-q:a', '2',
               '-id3v2_version', '0', '-write_xing', '1', str(target)]
    try:
        subprocess.run(command, check=True, capture_output=True, timeout=600)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError) as exc:
        raise ReplacementError('Encodage MP3 impossible.') from exc


def validate_final_review(item, digest):
    require(item.get('final_file_review'), 'Écoute du MP3 final manquante.')
    review = read_json(item['final_file_review'])
    require(isinstance(review, dict) and review.get('version') == 1 and review.get('dialogue_id') == item['dialogue_id'] and
            review.get('audio_sha256') == digest, 'Revue finale liée à un autre MP3.')
    require(isinstance(review.get('reviewer'), str) and review['reviewer'].strip() and
            review.get('human_listening') is True and review.get('transcription_checked') is True and
            review.get('transcription') == item['transcription'] and
            isinstance(review.get('notes'), str) and review['notes'].strip(), 'Écoute/transcription du MP3 final non attestée.')
    require(isinstance(review.get('checks'), dict) and all(review['checks'].get(key) is True for key in boundaries.CHECKS), 'Contrôle final incomplet.')
    try:
        instant = dt.datetime.fromisoformat(review['listened_at'].replace('Z', '+00:00'))
        require(instant.tzinfo is not None and instant <= dt.datetime.now(dt.timezone.utc), 'Date de revue finale invalide.')
    except (KeyError, ValueError, TypeError) as exc:
        raise ReplacementError('Date de revue finale invalide.') from exc
    return {'path': item['final_file_review'], 'sha256': sha256(item['final_file_review']), 'reviewer': review['reviewer']}


def remap_tree(value, replacements, path='', conflicts=None, expected_transcriptions=None):
    """Patch embedded exercises and generic paths without replacing IDs or questions."""
    conflicts = conflicts if conflicts is not None else []
    lookup = {old: item for item in replacements for old in item['old_refs']}
    out = copy.deepcopy(value)
    def transcript(old_ref, old_text, entry, location):
        if expected_transcriptions is not None and old_text not in (None, ''):
            normalized = ' '.join(str(old_text).split())
            known = expected_transcriptions.get(old_ref, set())
            if normalized != entry['transcription'] and normalized not in known:
                conflicts.append({'pointer': location, 'reason': 'Transcription personnalisée différente de la banque ; conservée pour examen.', 'old_ref': old_ref})
                return old_text
        return entry['transcription']
    def visit(node, current):
        if isinstance(node, dict):
            if isinstance(node.get('support'), dict) and 'competence' in node:
                support = node['support']
                old_audios = support.get('audios')
                if isinstance(old_audios, list):
                    entries = [lookup.get(canonical_ref(audio)) for audio in old_audios]
                    touched = [entry for entry in entries if entry]
                    if touched:
                        trans = support.get('transcription')
                        if isinstance(trans, list) and len(trans) == len(old_audios):
                            support['transcription'] = [transcript(canonical_ref(old_audios[index]), text, entry, pointer(pointer(current, 'support'), 'transcription') + '/' + str(index)) if entry else text for index, (entry, text) in enumerate(zip(entries, trans))]
                        elif len(old_audios) == 1:
                            support['transcription'] = [transcript(canonical_ref(old_audios[0]), trans, touched[0], pointer(pointer(current, 'support'), 'transcription'))]
                        else:
                            conflicts.append({'pointer': pointer(current, 'support'), 'reason': 'Transcription multi-piste non alignée ; répartition manuelle requise.'})
                        # Tags live on the whole exercise, so merge all validated dialogue tags.
                        removed = {tag for entry in touched for tag in entry.get('remove_tags', [])}
                        node['tags'] = sorted((set(node.get('tags', [])) - removed) | {tag for entry in touched for tag in entry['tags']})
                elif isinstance(support.get('audio'), str):
                    entry = lookup.get(canonical_ref(support['audio']))
                    if entry:
                        support['transcription'] = transcript(canonical_ref(support['audio']), support.get('transcription'), entry, pointer(pointer(current, 'support'), 'transcription'))
                        node['tags'] = sorted((set(node.get('tags', [])) - set(entry.get('remove_tags', []))) | set(entry['tags']))
            for key, item in list(node.items()):
                node[key] = visit(item, pointer(current, key))
        elif isinstance(node, list):
            return [visit(item, pointer(current, index)) for index, item in enumerate(node)]
        elif isinstance(node, str):
            entry = lookup.get(canonical_ref(node))
            if entry:
                return entry['new_ref']
        return node
    return visit(out, path)


def deltas(before, after, path=''):
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        out = []
        for key in sorted(set(before) | set(after)):
            child = pointer(path, key)
            if key not in before:
                out.append({'op': 'add', 'path': child, 'value': after[key]})
            elif key not in after:
                out.append({'op': 'remove', 'path': child, 'old': before[key]})
            else:
                out.extend(deltas(before[key], after[key], child))
        return out
    if isinstance(before, list) and isinstance(after, list) and len(before) == len(after):
        return [change for index, (old, new) in enumerate(zip(before, after)) for change in deltas(old, new, pointer(path, index))]
    return [{'op': 'replace', 'path': path, 'old': before, 'value': after}]


def patch_export(value, replacements, expected_transcriptions=None):
    original = copy.deepcopy(value)
    changed = copy.deepcopy(value)
    serialized, conflicts, records = [], [], []
    def visit(node, path=''):
        if isinstance(node, dict):
            if 'recipe' in node:
                require(isinstance(node.get('id'), str), 'Une ligne de recette exportée doit conserver son ID.')
                raw = node['recipe']
                recipe = json.loads(raw) if isinstance(raw, str) else raw
                require(isinstance(recipe, dict), 'Recette JSON exportée invalide.')
                updated = remap_tree(recipe, replacements, '', conflicts, expected_transcriptions)
                patches = deltas(recipe, updated)
                record = {'fiche_id': node['id'], 'record_pointer': path, 'recipe_pointer': pointer(path, 'recipe'),
                          'serialized': isinstance(raw, str), 'updated_at': node.get('updated_at', node.get('updatedAt')),
                          'patches': patches,
                          'precondition': {'id': node['id'], 'recipe_sha256': hashlib.sha256((raw if isinstance(raw, str) else json.dumps(recipe, sort_keys=True)).encode()).hexdigest(),
                                           'updated_at': node.get('updated_at', node.get('updatedAt'))}}
                records.append(record)
                if isinstance(raw, str):
                    if patches:
                        node['recipe'] = json.dumps(updated, ensure_ascii=False, separators=(',', ':'))
                        serialized.append(record)
                else:
                    node['recipe'] = updated
                for key, child in node.items():
                    if key != 'recipe':
                        visit(child, pointer(path, key))
            else:
                for key, child in list(node.items()):
                    visit(child, pointer(path, key))
        elif isinstance(node, list):
            for index, child in enumerate(node):
                visit(child, pointer(path, index))
    visit(changed)
    if not records:
        # Direct browser recipe/exercise/history snapshot without a fiche envelope.
        changed = remap_tree(changed, replacements, '', conflicts, expected_transcriptions)
    def database_envelope(node):
        if isinstance(node, dict) and isinstance(node.get('fiches'), list):
            return all(isinstance(row, dict) and isinstance(row.get('id'), str) and 'recipe' in row for row in node['fiches'])
        if isinstance(node, dict) and isinstance(node.get('results'), list):
            return all(isinstance(row, dict) and isinstance(row.get('id'), str) and 'recipe' in row for row in node['results'])
        if isinstance(node, list):
            return not node or all((isinstance(row, dict) and isinstance(row.get('id'), str) and 'recipe' in row) or database_envelope(row) for row in node)
        return False
    return changed, {'json_patches': deltas(original, changed), 'serialized_recipe_deltas': serialized,
                     'database_export_envelope': database_envelope(original),
                     'records': records, 'conflicts': conflicts}


def verify_db_evidence(path, exports):
    require(path is not None, 'Export D1 distant complet et preuve de fraîcheur absents.')
    path = Path(path).absolute()
    require(path == path.resolve() and path.is_file(), 'Preuve D1 absente ou symbolique interdite.')
    evidence = read_json(path)
    require(isinstance(evidence, dict) and evidence.get('version') == 1 and evidence.get('kind') == 'cloudflare-d1-remote-export' and
            evidence.get('database') == 'clairfle-fiches' and evidence.get('complete') is True and
            isinstance(evidence.get('reviewer'), str) and evidence['reviewer'].strip(), 'Preuve D1 incomplète.')
    exported = resolve_input(path.parent, evidence.get('export_file'))
    matches = [entry for entry in exports if Path(entry['input']) == exported]
    require(len(matches) == 1 and evidence.get('export_sha256') == sha256(exported), 'Empreinte de l’export D1 incorrecte.')
    require(matches[0]['deltas'].get('database_export_envelope') is True, 'Enveloppe d’export D1/API complet non reconnue.')
    require(type(evidence.get('total_rows')) is int and evidence['total_rows'] == len(matches[0]['deltas']['records']), 'Nombre de lignes D1 différent.')
    identifiers = [row['fiche_id'] for row in matches[0]['deltas']['records']]
    require(len(identifiers) == len(set(identifiers)), 'IDs de fiches dupliqués dans export D1.')
    require(all(row.get('updated_at') for row in matches[0]['deltas']['records']), 'updated_at requis pour chaque garde D1.')
    try:
        exported_at = dt.datetime.fromisoformat(evidence['exported_at'].replace('Z', '+00:00'))
        age = (dt.datetime.now(dt.timezone.utc) - exported_at).total_seconds()
        require(exported_at.tzinfo is not None and 0 <= age <= 86400, 'Export D1 trop ancien ou daté du futur.')
    except (KeyError, TypeError, ValueError) as exc:
        raise ReplacementError('Date de preuve D1 invalide.') from exc
    return {'path': str(path), 'sha256': sha256(path), 'export': str(exported),
            'rows': evidence['total_rows'], 'attested_complete': True, 'remote_contact_by_tool': False}


def backup(run_dir, repo, relative, manifest):
    source = safe_repo_path(repo, relative)
    if not source.exists():
        return
    target = run_dir / 'backups' / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    require(not target.exists(), 'Sauvegarde déjà présente.')
    shutil.copy2(source, target)
    require(sha256(source) == sha256(target), 'Copie de sauvegarde différente.')
    manifest.append({'path': relative, 'backup': str(target.relative_to(run_dir)), 'sha256': sha256(target), 'bytes': target.stat().st_size})


def run(repo, work_dir, mapping_path=None, recipe_exports=(), db_evidence=None, prepare=False):
    repo = Path(repo).absolute()
    require(repo == repo.resolve(), 'Racine de dépôt symbolique interdite.')
    work = safe_work(repo, work_dir)
    require(shutil.which('ffprobe') and shutil.which('ffmpeg'), 'ffprobe et ffmpeg sont requis.')
    replacements, mapping_file = load_mapping(mapping_path)
    require(not prepare or mapping_file is not None, '--prepare exige --mapping.')
    inv = inventory(repo)
    work.mkdir(parents=True, exist_ok=True)
    run_dir = work / ('replacement-' + dt.datetime.now(dt.timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:10])
    run_dir.mkdir()
    write_json(run_dir / 'inventory.json', inv)
    blockers, source_failures, validated = [], [], {}
    if not replacements:
        blockers.append('Aucun nouveau dialogue fourni ; inventaire uniquement.')
    bank_refs = {row['ref'] for row in inv['references'] if row['production']}
    all_old = {ref for item in replacements for ref in item['old_refs']}
    uncovered = sorted(bank_refs - all_old)
    unknown = sorted(all_old - bank_refs)
    if uncovered:
        blockers.append(f'{len(uncovered)} références CO de banque non couvertes par le remplacement complet.')
    uncovered_indexes = sorted({row['ref'] for row in inv['runtime_index_references']} - all_old)
    if uncovered_indexes:
        blockers.append(f'{len(uncovered_indexes)} références des index runtime non couvertes.')
    if unknown:
        blockers.append(f'{len(unknown)} old_refs ne correspondent pas à la banque actuelle.')
    lookup = {ref: item for item in replacements for ref in item['old_refs']}
    protected = []
    for row in inv['references']:
        if not row['production'] and row['ref'] in lookup:
            protected.append(row)
    for source in inv['extra_references']:
        if source['category'] == 'runtime-source':
            for ref in source['refs']:
                if ref in lookup and lookup[ref]['new_ref'] != ref:
                    protected.append({'file': source['file'], 'ref': ref, 'reason': 'Littéral runtime non modifié automatiquement.'})
    if protected:
        blockers.append('Références partagées avec une autre fonctionnalité protégée ; réaffectation manuelle requise.')
    for item in replacements:
        new_path = safe_repo_path(repo, 'public' + item['new_ref'])
        if new_path.exists() and item['new_ref'] not in item['old_refs']:
            blockers.append('new_ref écraserait un fichier existant non désigné dans old_refs : ' + item['new_ref'])
        try:
            proof = validate_source(item)
            staged = Path(item['staged_file'])
            staged_info = probe(staged, decode=True)
            if sha256(staged) != proof['source_audio_sha256']:
                require(staged_info['codec'] == 'mp3', 'staged_file doit être le WAV validé exact ou son MP3 déterministe.')
                with tempfile.TemporaryDirectory(prefix='work-encoding-') as temporary:
                    encoded = Path(temporary) / 'canonical.mp3'
                    encode_mp3(proof['source_audio'], encoded)
                    require(sha256(encoded) == sha256(staged), 'MP3 sans dérivation déterministe du WAV validé.')
            proof['staged_info'] = staged_info
            validated[item['dialogue_id']] = proof
        except (ReplacementError, OSError, KeyError, TypeError, boundaries.BoundaryError) as exc:
            source_failures.append({'dialogue_id': item['dialogue_id'], 'reason': str(exc)})
    if source_failures:
        blockers.append('Sources/frontières/transcriptions non validées pour chaque dialogue.')
    if inv['summary']['invalid_audio_files']:
        blockers.append('Certains anciens fichiers sont non décodables/non hydratés ; sauvegarde réelle incomplète.')
    staged_json, all_deltas, bank_conflicts, expected_transcriptions = {}, {}, [], {}
    for bank in inv['banks']:
        original = read_json(repo / bank['path'])
        for exercise in original:
            support = exercise.get('support', {})
            audio_values = support.get('audios') or [support.get('audio')]
            texts = support.get('transcription')
            texts = texts if isinstance(texts, list) else [texts]
            if len(audio_values) == len(texts):
                for audio, text in zip(audio_values, texts):
                    if canonical_ref(audio) and isinstance(text, str) and text.strip():
                        expected_transcriptions.setdefault(canonical_ref(audio), set()).add(' '.join(text.split()))
        updated = remap_tree(original, replacements, '', bank_conflicts)
        patch = deltas(original, updated)
        if patch:
            staged_json[bank['path']] = updated
            all_deltas[bank['path']] = patch
    if bank_conflicts:
        blockers.append('Transcriptions de banque multi-pistes non alignées à résoudre.')
    exports = []
    for export in recipe_exports:
        path = Path(export).absolute()
        require(path == path.resolve() and path.is_file(), 'Export absent ou symbolique.')
        value = read_json(path)
        updated, patch = patch_export(value, replacements, expected_transcriptions)
        # Include original and patched refs, including recipes serialized as strings.
        remaining = []
        def collect(node):
            if isinstance(node, dict):
                if 'recipe' in node and isinstance(node['recipe'], str):
                    collect(json.loads(node['recipe']))
                for key, child in node.items():
                    if key != 'recipe' or not isinstance(child, str):
                        collect(child)
            elif isinstance(node, list):
                for child in node:
                    collect(child)
            elif isinstance(node, str):
                ref = canonical_ref(node)
                if ref and ref not in {item['new_ref'] for item in replacements}:
                    remaining.append(ref)
        collect(updated)
        if remaining:
            blockers.append(f'Références CO non couvertes dans export {path.name} : {len(set(remaining))}.')
        if patch['conflicts']:
            blockers.append('Copies de transcriptions multi-pistes exportées à résoudre : ' + path.name)
        entry = {'input': str(path), 'sha256': sha256(path), 'deltas': patch,
                 'remaining_unmapped_co_refs': sorted(set(remaining)), 'updated': updated}
        exports.append(entry)
    db_proof = None
    try:
        db_proof = verify_db_evidence(db_evidence, exports)
    except (ReplacementError, OSError, KeyError, TypeError) as exc:
        blockers.append('Base distante non validée : ' + str(exc))
    final_audio, backup_rows, staged_rows = [], [], []
    prepared = prepare and not source_failures and bool(replacements) and not bank_conflicts
    if prepared:
        # Reversible backups precede staging and never live in the served public root.
        for relative in sorted(set(staged_json) | set(INDEXES) | {row['path'] for row in inv['files'] if row['integrity'] != 'invalid'}):
            backup(run_dir, repo, relative, backup_rows)
        for item in replacements:
            proof = validated[item['dialogue_id']]
            target = run_dir / 'staged' / ('public' + item['new_ref'])
            target.parent.mkdir(parents=True, exist_ok=True)
            staged = Path(item['staged_file'])
            if probe(staged)['codec'] == 'mp3':
                shutil.copy2(staged, target)
            else:
                encode_mp3(staged, target)
            info = probe(target, decode=True)
            require(info['codec'] == 'mp3', 'Le fichier final .mp3 ne contient pas de MP3.')
            digest = sha256(target)
            final = {'dialogue_id': item['dialogue_id'], 'new_ref': item['new_ref'],
                     'name': proof['segment']['name'], 'tags': item['tags'], 'transcription': item['transcription'],
                     'path': str(target.relative_to(run_dir)), 'sha256': digest, 'probe': info,
                     'derived_from_validated_audio_sha256': proof['source_audio_sha256'],
                     'validated_manifest_sha256': proof['validated_manifest_sha256']}
            try:
                final['final_review'] = validate_final_review(item, digest)
            except (ReplacementError, OSError, KeyError, TypeError) as exc:
                final['final_review_blocker'] = str(exc)
                blockers.append(item['dialogue_id'] + ': ' + str(exc))
            final_audio.append(final)
            write_json(run_dir / 'final-review-templates' / (item['dialogue_id'] + '.json'), {
                'version': 1, 'dialogue_id': item['dialogue_id'], 'audio_sha256': digest,
                'reviewer': '', 'human_listening': False, 'listened_at': '', 'notes': '',
                'transcription_checked': False, 'transcription': item['transcription'],
                'checks': {key: False for key in boundaries.CHECKS},
                'instruction': 'Renseigner uniquement après écoute réelle de ce MP3 final. Conserver ce modèle et fournir une copie renseignée via final_file_review.'})
        duration_path = repo / INDEXES[0]
        duration_data = read_json(duration_path) if duration_path.exists() else {}
        reviewed_path = repo / INDEXES[1]
        reviewed = read_json(reviewed_path) if reviewed_path.exists() else {}
        for item, final in zip(replacements, final_audio):
            values = [reviewed[ref] for ref in item['old_refs'] if ref in reviewed]
            if values and any(value != values[0] for value in values):
                blockers.append(item['dialogue_id'] + ': plusieurs décisions de pool contradictoires fusionnées ; résolution manuelle requise.')
            for ref in item['old_refs']:
                duration_data.pop(ref, None)
                reviewed.pop(ref, None)
            duration_data[item['new_ref']] = round(final['probe']['duration'], 6)
            if values:
                reviewed[item['new_ref']] = values[0]
        staged_json[INDEXES[0]] = dict(sorted(duration_data.items()))
        staged_json[INDEXES[1]] = dict(sorted(reviewed.items()))
        for relative, value in staged_json.items():
            target = run_dir / 'staged' / relative
            write_json(target, value)
            staged_rows.append({'path': relative, 'staged': str(target.relative_to(run_dir)), 'sha256': sha256(target)})
        for index, entry in enumerate(exports):
            relative = f'exports/{index:03d}-{Path(entry["input"]).name}'
            target = run_dir / 'staged' / relative
            write_json(target, entry['updated'])
            copied = run_dir / 'backups' / relative
            copied.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(entry['input'], copied)
            require(sha256(copied) == entry['sha256'], 'Sauvegarde export différente.')
            backup_rows.append({'path': entry['input'], 'backup': str(copied.relative_to(run_dir)), 'sha256': sha256(copied)})
            staged_rows.append({'path': relative, 'staged': str(target.relative_to(run_dir)), 'sha256': sha256(target)})
        write_json(run_dir / 'recipe-deltas.json', [{key: value for key, value in entry.items() if key != 'updated'} for entry in exports])
        write_json(run_dir / 'bank-deltas.json', all_deltas)
        write_json(run_dir / 'rollback-manifest.json', {'version': 1, 'created_at': now(), 'git_head': inv['git_head'],
                   'production_was_modified': False, 'backups': backup_rows, 'staged_content': staged_rows,
                   'staged_audio': final_audio, 'never_delete_backups_or_historical_sources': True,
                   'restore_order': ['Restore required old audio bytes first.', 'Restore only recipes still matching applied after-hash; preserve concurrent user edits.', 'Restore bank JSON and runtime indexes.', 'Verify reference and playback audit.']})
    elif not prepare:
        blockers.append('Plan uniquement ; MP3 finaux et écoute des octets finaux non encore vérifiés.')
    # No command in this utility can promote or delete; readiness is a review gate.
    all_production_refs = {row['ref'] for row in inv['references'] if row['production']}
    deletion_candidates = sorted(row['ref'] for row in inv['files'] if row['ref'] not in {item['new_ref'] for item in replacements})
    plan = {'version': 1, 'created_at': now(), 'mode': 'prepare' if prepare else 'plan',
            'repo': str(repo), 'run_dir': str(run_dir), 'git_head': inv['git_head'],
            'production_public_root': str(repo / 'public'), 'production_audio_url_root': AUDIO_ROOT,
            'production_was_modified': False, 'promotion_supported': False, 'deletion_supported': False,
            'prepared': prepared, 'promotion_ready': prepared and not blockers,
            'blockers': list(dict.fromkeys(blockers)), 'source_validation_failures': source_failures,
            'mapping_file': str(mapping_file) if mapping_file else None,
            'mapping_sha256': sha256(mapping_file) if mapping_file else None,
            'replacement_count': len(replacements), 'uncovered_bank_refs': uncovered, 'unknown_old_refs': unknown,
            'uncovered_runtime_index_refs': uncovered_indexes,
            'protected_references': protected, 'bank_conflicts': bank_conflicts,
            'modified_bank_paths': sorted(staged_json), 'bank_deltas': all_deltas,
            'exports': [{key: value for key, value in entry.items() if key != 'updated'} for entry in exports],
            'database_export_evidence': db_proof, 'remote_database_contact_by_tool': False,
            'staged_audio': final_audio, 'deletion_candidates_do_not_delete': deletion_candidates,
            'all_bank_ref_count': len(all_production_refs),
            'stale_browser_writer_gate': 'Before real promotion, normalize stale browser history/exports on load/save or enforce server mapping; not implemented by this offline tool.',
            'atomicity': 'D1 and static files have no common transaction. New files must be available before reference switch; deletion only after complete audit.',
            'rollback': 'Keep backups and Git history; no cleanup command exists.'}
    if prepared:
        # These gates cannot be proved solely by source/export files.
        plan['promotion_ready'] = False
        plan['blockers'].append('Promotion hors outil : vérifier concurrence D1 actuelle, onglets anciens et bascule du site/cache.')
    write_json(run_dir / 'plan.json', plan)
    return {'run_dir': str(run_dir), 'plan': str(run_dir / 'plan.json'), 'prepared': prepared,
            'promotion_ready': plan['promotion_ready'], 'blockers': plan['blockers']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument('--work-dir', '--work', type=Path, default=Path('/workspace/work/tcf-audio-replacement'))
    parser.add_argument('--mapping', type=Path)
    parser.add_argument('--recipe-export', type=Path, action='append', default=[])
    parser.add_argument('--db-evidence', type=Path)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--plan', action='store_true')
    mode.add_argument('--prepare', action='store_true')
    args = parser.parse_args()
    try:
        result = run(args.repo, args.work_dir, args.mapping, args.recipe_export, args.db_evidence, args.prepare)
        print(json.dumps(result, ensure_ascii=False))
        return 2 if args.prepare and not result['prepared'] else 0
    except (ReplacementError, boundaries.BoundaryError, OSError, KeyError, TypeError, json.JSONDecodeError) as exc:
        print(json.dumps({'error': str(exc), 'production_was_modified': False}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())

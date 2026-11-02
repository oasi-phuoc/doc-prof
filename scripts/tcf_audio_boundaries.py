#!/usr/bin/env python3
"""Prepare word-boundary audio candidates and audit explicit human review.

Local only: ffmpeg/ffprobe decode, no ASR, network, production writes or deletion.
Run ``python scripts/tcf_audio_boundaries.py example`` for the input schemas.
All indices are zero based, inclusive; timestamps are seconds in the original.
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import hashlib
import html
import json
import math
import re
import subprocess
import sys
import uuid
import wave
from array import array
from decimal import Decimal, ROUND_CEILING, ROUND_FLOOR
from pathlib import Path


DEFAULT_WORK = Path('/workspace/work/tcf-audio-replacement')
CONTEXT_SECONDS = 2.0
MAX_MARGIN_MS = 250
WINDOWS = ('start_before', 'start_after', 'end_before', 'end_after')
CHECKS = ('first_word_complete', 'last_word_complete', 'no_numbering',
          'no_instructions', 'no_previous_dialogue', 'no_next_dialogue',
          'no_truncated_syllable', 'natural_silences', 'coherent_full_dialogue')
ATTESTATION = "J'ai écouté les fichiers indiqués et vérifié la transcription."


class BoundaryError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise BoundaryError(message)


def number(value, name):
    require(type(value) in (float, int) and math.isfinite(value),
            f'{name}: nombre fini requis (pas booléen).')
    return float(value)


def sha256(path):
    result = hashlib.sha256()
    with Path(path).open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            result.update(chunk)
    return result.hexdigest()


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def read_json(path):
    with Path(path).open(encoding='utf-8') as handle:
        return json.load(handle, parse_constant=lambda value: (_ for _ in ()).throw(
            BoundaryError(f'Nombre JSON interdit : {value}')))


def write_json(path, value):
    with Path(path).open('x', encoding='utf-8') as handle:
        json.dump(value, handle, ensure_ascii=False, indent=2, allow_nan=False)
        handle.write('\n')


def safe_work(path):
    """An explicit work directory must remain a work directory after resolution."""
    raw = Path(path).expanduser().absolute()
    resolved = raw.resolve()
    require(raw == resolved, 'Dossier de travail avec lien symbolique ou traversée interdit.')
    require(any(part == 'work' or part.startswith('work-') for part in resolved.parts),
            'Les sorties exigent un dossier explicitement nommé work ou work-….')
    require(not any(part in ('public', 'lib', 'audio', '.git') for part in resolved.parts),
            'Dossier de production interdit ; utiliser /workspace/work/tcf-audio-replacement.')
    require(len(resolved.parts) >= 3, 'Dossier de travail trop large.')
    return resolved


def safe_artifact(root, relative):
    require(isinstance(relative, str) and relative and '\\' not in relative,
            'Chemin relatif de contrôle invalide.')
    path = Path(relative)
    require(not path.is_absolute() and '..' not in path.parts,
            'Traversée de chemin interdite.')
    result = root / path
    require(result.absolute() == result.resolve(), 'Lien symbolique interdit dans les contrôles.')
    require(result.resolve().is_relative_to(root.resolve()), 'Sortie hors du dossier de travail.')
    return result


def probe(source):
    require(source.is_file(), f'Fichier source introuvable : {source}')
    command = ['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries',
               'stream=sample_rate,channels,duration:format=duration', '-of', 'json', str(source)]
    try:
        data = json.loads(subprocess.run(command, check=True, capture_output=True, text=True).stdout)
        stream = data['streams'][0]
        duration = float(stream.get('duration', data.get('format', {}).get('duration')))
        rate, channels = int(stream['sample_rate']), int(stream['channels'])
    except (subprocess.CalledProcessError, ValueError, KeyError, IndexError, TypeError) as exc:
        raise BoundaryError(f'ffprobe ne peut pas lire le premier flux audio : {source}') from exc
    require(math.isfinite(duration) and duration > 0, 'Durée source invalide.')
    require(8000 <= rate <= 192000 and 1 <= channels <= 2,
            'Source attendue : 8–192 kHz, mono ou stéréo ; convertir explicitement les autres formats.')
    return {'duration': duration, 'sample_rate': rate, 'channels': channels}


def normalized(text):
    require(isinstance(text, str), 'Transcription texte requise.')
    return ' '.join(text.split())


def frame_at(seconds, sample_rate, direction):
    """Decimal input timestamps avoid false sub-sample gaps at .07 * 44100."""
    return int((Decimal(str(seconds)) * sample_rate).to_integral_value(rounding=direction))


def plan_segments(plan, duration, sample_rate):
    require(isinstance(plan, dict) and plan.get('schema_version') == 1, 'Plan schema_version: 1 requis.')
    words, segments = plan.get('words'), plan.get('segments')
    require(isinstance(words, list) and words, 'Transcription horodatée mot par mot requise.')
    require(isinstance(segments, list) and segments, 'Au moins un segment est requis.')
    previous_end = 0.0
    for index, word in enumerate(words):
        require(isinstance(word, dict), f'Mot {index} invalide.')
        text = word.get('text')
        group = word.get('alignment_group')
        require(isinstance(text, str) and text.strip() and
                (not re.search(r'\s', text) or isinstance(group, list)),
                f'Mot {index} : un seul mot ou groupe de coarticulation documenté est requis.')
        if group is not None:
            require(isinstance(group, list) and len(group) >= 2 and
                    word.get('alignment_group_method') == 'native_dtw_zero_duration_coarticulation',
                    f'Mot {index}: groupe de coarticulation non documenté.')
            group_end = None
            for member in group:
                require(isinstance(member, dict) and isinstance(member.get('text'), str) and
                        member['text'] and not re.search(r'\s', member['text']),
                        f'Mot {index}: membre du groupe invalide.')
                first = number(member.get('start'), 'alignment_group.start')
                last = number(member.get('end'), 'alignment_group.end')
                require(first <= last and (group_end is None or first >= group_end),
                        f'Mot {index}: groupe de coarticulation non monotone.')
                group_end = last
            require(text == ' '.join(member['text'] for member in group) and
                    word.get('start') == group[0]['start'] and word.get('end') == group[-1]['end'] and
                    any(member['start'] == member['end'] for member in group),
                    f'Mot {index}: groupe différent des horodatages DTW natifs.')
        # A missing space cannot turn an announcement and dialogue into one cuttable word.
        web_token = bool(re.match(r'(?i)(?:https?://|www\.)', text) or '@' in text)
        require(web_token or re.fullmatch(r'\d+(?:[.,:/-]\d+)+[.,!?;:]?', text) or
                not re.search(r'[.!?;:…][\wÀ-ÿ]', text),
                f'Mot {index} fusionné ({text}) : séparer et réaligner les mots.')
        require(word.get('kind') in ('dialogue', 'announcement', 'instruction'),
                f'Mot {index} : kind dialogue/announcement/instruction requis.')
        start, end = number(word.get('start'), f'words[{index}].start'), number(word.get('end'), f'words[{index}].end')
        require(0 <= start < end <= duration, f'Mot {index} hors source ou de durée nulle.')
        require(start >= previous_end, f'Mot {index} chevauché : réalignement manuel requis.')
        require(type(word.get('uncertain', False)) is bool, f'Mot {index}: uncertain doit être booléen.')
        if 'confidence' in word:
            require(0 <= number(word['confidence'], f'words[{index}].confidence') <= 1,
                    f'Mot {index}: confiance hors [0,1].')
        previous_end = end
    result, used_ids, used_indices = [], set(), set()
    for item in segments:
        require(isinstance(item, dict), 'Segment invalide.')
        identifier = item.get('id')
        require(isinstance(identifier, str) and re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,99}', identifier),
                'ID segment invalide : lettres, chiffres, tirets et soulignements seulement.')
        require(identifier not in used_ids, f'ID segment répété : {identifier}')
        used_ids.add(identifier)
        first, last = item.get('first_word'), item.get('last_word')
        require(type(first) is int and type(last) is int and 0 <= first <= last < len(words),
                f'{identifier}: indices entiers inclusifs invalides.')
        selected = words[first:last + 1]
        require(all(word['kind'] == 'dialogue' for word in selected),
                f'{identifier}: consigne ou numérotation sélectionnée.')
        require(not used_indices.intersection(range(first, last + 1)),
                f'{identifier}: mots partagés par plusieurs segments ; découpage ambigu.')
        used_indices.update(range(first, last + 1))
        transcript = normalized(item.get('transcript'))
        require(transcript == normalized(' '.join(word['text'] for word in selected)),
                f'{identifier}: transcription différente des mots sélectionnés.')
        require(isinstance(item.get('name'), str) and item['name'].strip(), f'{identifier}: nom requis.')
        require(isinstance(item.get('tags'), list) and item['tags'] and
                all(isinstance(tag, str) and tag.strip() for tag in item['tags']), f'{identifier}: tags requis.')
        margins = [number(item.get(key, default), f'{identifier}.{key}') / 1000
                   for key, default in [('margin_before_ms', 80), ('margin_after_ms', 120)]]
        require(all(0 <= value <= MAX_MARGIN_MS / 1000 for value in margins),
                f'{identifier}: marges permises entre 0 et {MAX_MARGIN_MS} ms.')
        start_word, end_word = Decimal(str(selected[0]['start'])), Decimal(str(selected[-1]['end']))
        previous = Decimal(str(words[first - 1]['end'])) if first else Decimal(0)
        following = Decimal(str(words[last + 1]['start'])) if last + 1 < len(words) else Decimal(str(duration))
        exact_margins = [Decimal(str(item.get(key, default))) / 1000 for key, default in
                         [('margin_before_ms', 80), ('margin_after_ms', 120)]]
        # Decode once to PCM; integer frame slicing never seeks approximately in MP3.
        start = max(frame_at(max(0, start_word - exact_margins[0]), sample_rate, ROUND_FLOOR),
                    frame_at(previous, sample_rate, ROUND_CEILING))
        end = min(frame_at(min(Decimal(str(duration)), end_word + exact_margins[1]), sample_rate, ROUND_CEILING),
                  frame_at(following, sample_rate, ROUND_FLOOR))
        require(start <= frame_at(start_word, sample_rate, ROUND_FLOOR) and
                end >= frame_at(end_word, sample_rate, ROUND_CEILING),
                f'{identifier}: frontière entre mots inférieure à un échantillon ; réaligner manuellement.')
        require(start < end, f'{identifier}: coupe vide.')
        uncertain = item.get('boundary_uncertainty', [])
        require(isinstance(uncertain, list) and all(isinstance(note, str) and note.strip() for note in uncertain),
                f'{identifier}: boundary_uncertainty doit lister les incertitudes.')
        uncertain = list(uncertain)
        for index in range(max(0, first - 1), min(len(words), last + 2)):
            if words[index].get('uncertain') or words[index].get('confidence', 1) < .9:
                uncertain.append(f'Horodatage ou mot de frontière incertain à l’indice {index}.')
        result.append({'id': identifier, 'name': item['name'], 'tags': item['tags'],
                       'first_word': first, 'last_word': last, 'transcript': transcript,
                       'first_word_text': selected[0]['text'], 'last_word_text': selected[-1]['text'],
                       'start_frame': start, 'end_frame': end,
                       'start_seconds': start / sample_rate, 'end_seconds': end / sample_rate,
                       'requested_margins_ms': [value * 1000 for value in margins],
                       'actual_margins_ms': [float((start_word - Decimal(start) / sample_rate) * 1000),
                                             float((Decimal(end) / sample_rate - end_word) * 1000)],
                       'uncertainties': uncertain, 'status': 'candidate'})
    return result


def write_slice(source, destination, first, last):
    require(last > first >= 0, 'Fenêtre audio vide ou négative.')
    with wave.open(str(source), 'rb') as reader:
        require(last <= reader.getnframes(), 'Fenêtre après la fin réelle du PCM.')
        reader.setpos(first)
        with wave.open(str(destination), 'wb') as writer:
            writer.setparams(reader.getparams())
            remaining = last - first
            while remaining:
                count = min(65536, remaining)
                writer.writeframesraw(reader.readframes(count))
                remaining -= count


def waveform(source, destination, first, last, cut_start, cut_end):
    width, height = 1200, 180
    with wave.open(str(source), 'rb') as reader:
        channels, rate = reader.getnchannels(), reader.getframerate()
        reader.setpos(first)
        bins, total = [], last - first
        for index in range(width):
            count = ((index + 1) * total // width) - (index * total // width)
            samples = array('h', reader.readframes(count))
            if sys.byteorder != 'little':
                samples.byteswap()
            bins.append(max((abs(value) for value in samples), default=0) / 32768)
    bars = ''.join(f'<path d="M{x},90 v{-peak * 70:.2f} M{x},90 v{peak * 70:.2f}"/>'
                   for x, peak in enumerate(bins))
    lines = ''.join(f'<path stroke="{color}" d="M{(frame-first)/total*width:.3f},0 v180"/>'
                    for frame, color in [(cut_start, '#b91c1c'), (cut_end, '#b91c1c')])
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
           f'role="img" aria-label="Signal PCM de {first/rate:.3f} à {last/rate:.3f} secondes ; frontières rouges">'
           f'<rect width="1200" height="180" fill="#f8fafc"/><g stroke="#334155">{bars}</g>{lines}</svg>')
    destination.write_text(svg, encoding='utf-8')


def make_windows(start, end, total, rate):
    context = round(CONTEXT_SECONDS * rate)
    return dict(zip(WINDOWS, [(max(0, start-context), start), (start, min(total, start+context)),
                              (max(0, end-context), end), (end, min(total, end+context))]))


def review_template(manifest, manifest_hash):
    entries = {}
    for item in manifest['segments']:
        listening = {}
        for key, window in item.get('windows', {}).items():
            listening[key] = ({'human_listening': False, 'listened_at': '', 'notes': ''}
                              if window['available'] else
                              {'not_applicable': False, 'reason': window['reason'], 'checked_at': '', 'notes': ''})
        listening['full'] = {'human_listening': False, 'listened_at': '', 'notes': ''}
        entries[item['id']] = {'audio_sha256': item.get('audio', {}).get('sha256'),
                               'listening': listening,
                               'transcription': {'human_checked': False, 'checked_at': '', 'text': ''},
                               'checks': dict.fromkeys(CHECKS, False), 'uncertainties': []}
    return {'schema_version': 1, 'manifest_sha256': manifest_hash, 'reviewer': '',
            'attestation': '', 'segments': entries}


def review_page(manifest):
    sections = []
    for item in manifest['segments']:
        blocks = []
        for key, entry in [('full', item['audio']), *item['windows'].items()]:
            label = html.escape(key)
            if entry.get('available', True):
                blocks.append(f'<p>{label} <audio controls preload="none" src="{html.escape(entry["path"], quote=True)}"></audio></p>')
            else:
                blocks.append(f'<p>{label} : absent au bord physique de la source ({entry["reason"]}).</p>')
        warning = html.escape('; '.join(item['uncertainties']))
        sections.append(f'<section><h2>{html.escape(item["id"])} — {html.escape(item["name"])}</h2>'
                        f'<p>{html.escape(item["transcript"])}</p><p>Coupe : {item["start_seconds"]:.6f}–{item["end_seconds"]:.6f} s. '
                        f'Premier mot : {html.escape(item["first_word_text"])} ; dernier : {html.escape(item["last_word_text"])}.</p>'
                        f'<p>Incertitudes : {warning or "aucune déclarée ; écoute humaine requise"}.</p>'
                        f'<img width="100%" src="{html.escape(item["waveform"]["path"], quote=True)}" alt="Forme du signal et coupes en rouge">'
                        + ''.join(blocks) + '</section>')
    return ('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Contrôle des coupes TCF</title>'
            '<style>body{font:17px system-ui;max-width:1100px;margin:2rem auto;padding:1rem}section{border-top:1px solid #aaa;padding:1rem 0}audio{vertical-align:middle;width:75%}</style>'
            '<h1>Contrôle humain des frontières audio</h1><p>Écouter chaque fenêtre disponible, puis le fichier final en entier. '
            'Vérifier la transcription et tous les contrôles. Aucun événement du lecteur ne valide une écoute. '
            'Renseigner manuellement une copie de review-template.json après les écoutes réelles. '
            'En cas de doute, corriger le plan et préparer une nouvelle coupe.</p>' + ''.join(sections) + '</html>')


def prepare(source, plan_path, work=DEFAULT_WORK, candidate_only=False, compact=False):
    source, plan_path, work = Path(source).resolve(), Path(plan_path).resolve(), safe_work(work)
    info, plan = probe(source), read_json(plan_path)
    segments = plan_segments(plan, info['duration'], info['sample_rate'])
    work.mkdir(parents=True, exist_ok=True)
    run = work / ('run-' + dt.datetime.now(dt.timezone.utc).strftime('%Y%m%dT%H%M%S') + '-' + uuid.uuid4().hex[:10])
    run.mkdir()
    write_json(run / 'plan.json', plan)
    manifest = {'schema_version': 1, 'created_at': now(), 'status': 'candidate',
                'source': {'path': str(source), 'sha256': sha256(source), **info},
                'plan': {'path': 'plan.json', 'sha256': sha256(run / 'plan.json')},
                'audio_encoding': 'PCM signed 16-bit little-endian WAV, original sample rate and channels',
                'context_seconds': CONTEXT_SECONDS, 'segments': segments}
    if not candidate_only and compact:
        import tcf_audio_compact
        decoded = tcf_audio_compact.inspect_pcm(source, info)
        manifest['source'].update(decoded)
        segments = plan_segments(plan, decoded['decoded_duration'], info['sample_rate'])
        manifest['segments'] = segments
        manifest['decoded_source'] = tcf_audio_compact.prepare_compact(source, run, info, segments, decoded)
        manifest['audio_encoding'] = 'Lossless FLAC of exact signed 16-bit PCM, original sample rate and channels'
        manifest['status'] = 'needs_review'
        (run / 'review.html').write_text(review_page(manifest), encoding='utf-8')
    elif not candidate_only:
        decoded = run / 'source-pcm.wav'
        try:
            subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-n', '-i', str(source), '-map', '0:a:0',
                            '-vn', '-c:a', 'pcm_s16le', '-ar', str(info['sample_rate']), '-ac', str(info['channels']),
                            str(decoded)], check=True, capture_output=True)
        except subprocess.CalledProcessError as exc:
            raise BoundaryError('Échec du décodage ffmpeg. Le dossier de travail partiel est conservé.') from exc
        with wave.open(str(decoded), 'rb') as reader:
            total = reader.getnframes()
        require(total > 0, 'PCM source vide.')
        # A container duration may be approximate; the decoded source is authoritative.
        manifest['source']['decoded_frames'] = total
        manifest['source']['decoded_duration'] = total / info['sample_rate']
        segments = plan_segments(plan, total / info['sample_rate'], info['sample_rate'])
        manifest['segments'] = segments
        manifest['decoded_source'] = {'path': 'source-pcm.wav', 'sha256': sha256(decoded)}
        for item in segments:
            folder = run / item['id']
            folder.mkdir()
            first, last = item['start_frame'], item['end_frame']
            output = folder / 'candidate.wav'
            write_slice(decoded, output, first, last)
            item['audio'] = {'path': str(output.relative_to(run)), 'sha256': sha256(output), 'frames': last-first}
            item['windows'] = {}
            for key, (start, end) in make_windows(first, last, total, info['sample_rate']).items():
                entry = {'available': end > start, 'start_frame': start, 'end_frame': end}
                if end > start:
                    output = folder / f'{key}.wav'
                    write_slice(decoded, output, start, end)
                    entry.update(path=str(output.relative_to(run)), sha256=sha256(output))
                else:
                    entry['reason'] = 'source_start' if start == 0 else 'source_end'
                item['windows'][key] = entry
            output = folder / 'waveform.svg'
            waveform(decoded, output, max(0, first-round(CONTEXT_SECONDS*info['sample_rate'])),
                     min(total, last+round(CONTEXT_SECONDS*info['sample_rate'])), first, last)
            item['waveform'] = {'path': str(output.relative_to(run)), 'sha256': sha256(output)}
            item['status'] = 'needs_review'
        manifest['status'] = 'needs_review'
        (run / 'review.html').write_text(review_page(manifest), encoding='utf-8')
    write_json(run / 'manifest.json', manifest)
    if not candidate_only:
        write_json(run / 'review-template.json', review_template(manifest, sha256(run / 'manifest.json')))
    return run / 'manifest.json'


def check_time(value, label, created):
    try:
        timestamp = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
        baseline = dt.datetime.fromisoformat(created)
        require(timestamp.tzinfo is not None and baseline.tzinfo is not None, f'{label}: fuseau horaire requis.')
        require(baseline <= timestamp <= dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=5),
                f'{label}: date antérieure à la préparation ou future.')
    except (AttributeError, TypeError, ValueError) as exc:
        raise BoundaryError(f'{label}: horodatage ISO 8601 avec fuseau requis.') from exc


def compare_pcm_slice(decoded, artifact, first, last, rate, channels):
    with wave.open(str(decoded), 'rb') as reader, wave.open(str(artifact), 'rb') as segment:
        require(segment.getframerate() == rate and segment.getnchannels() == channels and
                segment.getsampwidth() == 2 and segment.getcomptype() == 'NONE' and
                segment.getnframes() == last - first, 'Encodage ou durée du contrôle incorrect.')
        reader.setpos(first)
        remaining = last - first
        while remaining:
            count = min(65536, remaining)
            require(reader.readframes(count) == segment.readframes(count), 'PCM contrôle différent de la coupe prévue.')
            remaining -= count


def verify_integrity(manifest, root):
    require(isinstance(manifest, dict) and manifest.get('schema_version') == 1 and manifest.get('status') == 'needs_review',
            'Seul un manifeste needs_review préparé avec les fichiers de contrôle peut être validé.')
    source = Path(manifest['source']['path'])
    require(sha256(source) == manifest['source']['sha256'], 'Source modifiée depuis la préparation.')
    plan_path = safe_artifact(root, manifest['plan']['path'])
    require(sha256(plan_path) == manifest['plan']['sha256'], 'Plan modifié depuis la préparation.')
    if manifest['decoded_source'].get('storage_mode') == 'compact_flac':
        import tcf_audio_compact
        info = manifest['source']
        frames, rate = info['decoded_frames'], info['sample_rate']
        expected = plan_segments(read_json(plan_path), frames / rate, rate)
        require(len(expected) == len(manifest['segments']), 'Liste des segments modifiée.')
        for wanted, item in zip(expected, manifest['segments']):
            require(item.get('status') == 'needs_review', 'Statut segment invalide.')
            for key, value in wanted.items():
                if key != 'status':
                    require(item.get(key) == value, f'{item.get("id")}: métadonnée {key} différente du plan.')
            windows = make_windows(item['start_frame'], item['end_frame'], frames, rate)
            require(set(item['windows']) == set(WINDOWS), 'Fenêtres de contrôle manquantes.')
            for key, (first, last) in windows.items():
                entry = item['windows'][key]
                require(entry['start_frame'] == first and entry['end_frame'] == last and
                        entry['available'] is (last > first), 'Fenêtre de contrôle modifiée.')
                if not entry['available']:
                    require(entry.get('reason') == ('source_start' if first == 0 else 'source_end'),
                            'Absence de fenêtre non justifiée par le bord source.')
        try:
            result = tcf_audio_compact.verify_compact(source, info, manifest['segments'], root,
                                                     manifest['decoded_source']['decoded_pcm_sha256'])
        except tcf_audio_compact.CompactAudioError as exc:
            raise BoundaryError(str(exc)) from exc
        require(result['decoded_frames'] == frames and
                result['decoded_pcm_sha256'] == info['decoded_pcm_sha256'], 'PCM source compact différent.')
        return
    decoded = safe_artifact(root, manifest['decoded_source']['path'])
    require(sha256(decoded) == manifest['decoded_source']['sha256'], 'PCM source modifié.')
    with wave.open(str(decoded), 'rb') as reader:
        rate, channels, frames = reader.getframerate(), reader.getnchannels(), reader.getnframes()
        require(reader.getsampwidth() == 2 and reader.getcomptype() == 'NONE', 'PCM source invalide.')
    require(rate == manifest['source']['sample_rate'] and channels == manifest['source']['channels'] and
            frames == manifest['source']['decoded_frames'], 'Format source modifié.')
    expected = plan_segments(read_json(plan_path), frames / rate, rate)
    require(len(expected) == len(manifest['segments']), 'Liste des segments modifiée.')
    for wanted, item in zip(expected, manifest['segments']):
        require(item.get('status') == 'needs_review', 'Statut segment invalide.')
        for key, value in wanted.items():
            if key != 'status':
                require(item.get(key) == value, f'{item.get("id")}: métadonnée {key} différente du plan.')
        require(item['audio']['frames'] == item['end_frame'] - item['start_frame'], 'Durée segment modifiée.')
        windows = make_windows(item['start_frame'], item['end_frame'], frames, rate)
        require(set(item['windows']) == set(WINDOWS), 'Fenêtres de contrôle manquantes.')
        for key, (first, last) in windows.items():
            entry = item['windows'][key]
            require(entry['start_frame'] == first and entry['end_frame'] == last and
                    entry['available'] is (last > first), 'Fenêtre de contrôle modifiée.')
            if not entry['available']:
                require(entry.get('reason') == ('source_start' if first == 0 else 'source_end'),
                        'Absence de fenêtre non justifiée par le bord source.')
        for artifact in [item['audio'], item['waveform'], *[window for window in item['windows'].values() if window['available']]]:
            path = safe_artifact(root, artifact['path'])
            require(sha256(path) == artifact['sha256'], f'Fichier de contrôle modifié : {path.name}')
        # The files actually heard must contain the exact expected source frames.
        compare_pcm_slice(decoded, safe_artifact(root, item['audio']['path']),
                          item['start_frame'], item['end_frame'], rate, channels)
        for window in item['windows'].values():
            if window['available']:
                compare_pcm_slice(decoded, safe_artifact(root, window['path']),
                                  window['start_frame'], window['end_frame'], rate, channels)


def validate_review(manifest, review, manifest_hash):
    require(isinstance(review, dict) and review.get('schema_version') == 1 and review.get('manifest_sha256') == manifest_hash,
            'La revue ne correspond pas au manifeste exact.')
    require(isinstance(review.get('reviewer'), str) and review['reviewer'].strip(), 'Nom du vérificateur humain requis.')
    require(review.get('attestation') == ATTESTATION, 'Attestation humaine explicite manquante.')
    require(isinstance(review.get('segments'), dict) and
            set(review['segments']) == {item['id'] for item in manifest['segments']}, 'Revue de chaque segment requise.')
    for item in manifest['segments']:
        identifier, evidence = item['id'], review['segments'][item['id']]
        require(isinstance(evidence, dict), f'{identifier}: objet de revue requis.')
        require(not item['uncertainties'], f'{identifier}: incertitude non résolue ; corriger le plan et refaire la coupe.')
        require(evidence.get('uncertainties') == [], f'{identifier}: incertitude signalée par la revue.')
        require(evidence.get('audio_sha256') == item['audio']['sha256'], f'{identifier}: revue d’un autre fichier audio.')
        listening = evidence.get('listening', {})
        require(isinstance(listening, dict) and set(listening) == set(WINDOWS) | {'full'},
                f'{identifier}: preuves des quatre frontières et écoute complète requises.')
        for key in (*WINDOWS, 'full'):
            entry = listening[key]
            require(isinstance(entry, dict), f'{identifier}.{key}: objet de preuve requis.')
            available = key == 'full' or item['windows'][key]['available']
            require(isinstance(entry.get('notes'), str) and entry['notes'].strip(), f'{identifier}.{key}: note d’observation requise.')
            if available:
                require(entry.get('human_listening') is True and not entry.get('not_applicable'), f'{identifier}.{key}: écoute humaine non attestée.')
                check_time(entry.get('listened_at'), f'{identifier}.{key}', manifest['created_at'])
            else:
                require(entry.get('not_applicable') is True and not entry.get('human_listening') and
                        entry.get('reason') == item['windows'][key]['reason'], f'{identifier}.{key}: bord source à constater explicitement.')
                check_time(entry.get('checked_at'), f'{identifier}.{key}', manifest['created_at'])
        transcription = evidence.get('transcription', {})
        require(isinstance(transcription, dict) and transcription.get('human_checked') is True and
                normalized(transcription.get('text')) == item['transcript'],
                f'{identifier}: transcription humaine manquante ou différente.')
        check_time(transcription.get('checked_at'), f'{identifier}.transcription', manifest['created_at'])
        require(isinstance(evidence.get('checks'), dict) and
                all(evidence['checks'].get(check) is True for check in CHECKS), f'{identifier}: contrôle qualité incomplet ou négatif.')


def validate(manifest_path, review_path):
    manifest_path = Path(manifest_path).absolute()
    root = safe_work(manifest_path.parent)
    require(manifest_path.resolve() == manifest_path, 'Manifeste avec lien symbolique interdit.')
    manifest, review = read_json(manifest_path), read_json(review_path)
    digest = sha256(manifest_path)
    verify_integrity(manifest, root)
    validate_review(manifest, review, digest)
    result = copy.deepcopy(manifest)
    result['status'] = 'validated'
    for item in result['segments']:
        item['status'] = 'validated'
    # Keep the original manifest and human review available for rollback/audit.
    result['validation'] = {'validated_at': now(), 'reviewer': review['reviewer'],
                            'prepared_manifest_sha256': digest, 'review_sha256': sha256(review_path),
                            'human_evidence': review}
    output = root / ('validated-manifest-' + uuid.uuid4().hex[:10] + '.json')
    write_json(output, result)
    return output


def example():
    return {'plan': {'schema_version': 1, 'words': [
        {'text': 'Document', 'start': 0.0, 'end': 0.4, 'kind': 'announcement'},
        {'text': 'deux.', 'start': 0.4, 'end': 0.8, 'kind': 'announcement'},
        {'text': 'Bonjour,', 'start': 0.8, 'end': 1.2, 'kind': 'dialogue'},
        {'text': 'madame.', 'start': 1.3, 'end': 1.7, 'kind': 'dialogue'},
        {'text': 'Document', 'start': 1.7, 'end': 2.1, 'kind': 'announcement'}],
        'segments': [{'id': 'dialogue-existant', 'name': 'Accueil', 'tags': ['accueil'],
                      'first_word': 2, 'last_word': 3, 'transcript': 'Bonjour, madame.',
                      'margin_before_ms': 80, 'margin_after_ms': 120, 'boundary_uncertainty': []}]},
        'review_instructions': 'Une revue vide est créée par prepare ; remplir seulement après les écoutes humaines réelles.',
        'required_attestation': ATTESTATION, 'statuses': ['candidate', 'needs_review', 'validated']}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    for name in ('plan', 'prepare'):
        command = commands.add_parser(name, help='Plan candidat sans audio' if name == 'plan' else 'Préparer PCM et contrôles humains')
        command.add_argument('--source', type=Path, required=True)
        command.add_argument('--plan', type=Path, required=True)
        command.add_argument('--work-dir', type=Path, default=DEFAULT_WORK)
        command.add_argument('--compact', action='store_true', help='FLAC sans perte, sans PCM source stocké sur disque')
    command = commands.add_parser('validate', help='Valider uniquement avec revue humaine complète et intégrité vérifiée')
    command.add_argument('--manifest', type=Path, required=True)
    command.add_argument('--review', type=Path, required=True)
    command = commands.add_parser('example', help='Afficher le schéma du plan et les règles de revue')
    command.add_argument('--plan-only', action='store_true', help='Émettre directement un plan JSON utilisable')
    args = parser.parse_args(argv)
    try:
        if args.command == 'example':
            data = example()
            print(json.dumps(data['plan'] if args.plan_only else data, ensure_ascii=False, indent=2))
        elif args.command in ('plan', 'prepare'):
            print(prepare(args.source, args.plan, args.work_dir, args.command == 'plan', args.compact))
        else:
            print(validate(args.manifest, args.review))
    except (BoundaryError, OSError, KeyError, TypeError, AttributeError, wave.Error, json.JSONDecodeError) as exc:
        print(f'REFUS : {exc}', file=sys.stderr)
        return 2
    return 0


if __name__ == '__main__':
    sys.exit(main())

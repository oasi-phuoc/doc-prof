"""Synchronise the finite gallery work list with reviewed files and report gaps."""
from collections import Counter
from datetime import datetime
import csv
import hashlib
import json
from pathlib import Path
import re
import subprocess
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / 'docs/gallery/extension-tcf-20261113.json'
CLASSES = ROOT / 'docs/gallery/classement-tcf-20261113.json'

def norm(value):
    import unicodedata
    value = ''.join(c for c in unicodedata.normalize('NFD', value.lower().replace('œ', 'oe')) if not unicodedata.combining(c))
    value = re.sub(r'^(un |une |le |la |les |des |du |de la |l[’\'])', '', value)
    value = re.sub('[^a-z0-9]+', ' ', value).strip()
    return {'mal de tete':'mal a la tete','mal de dos':'mal au dos','mal de dents':'mal aux dents','mal de ventre':'mal au ventre'}.get(value,value)

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def report():
    plan = json.loads(PLAN.read_text())
    classes = json.loads(CLASSES.read_text())
    reviewed = {r['path']: r for r in classes['images']}
    baseline = json.loads(subprocess.check_output(['git', 'show', plan['baseline_commit'] + ':src/gallery/catalog.generated.json'], cwd=ROOT, text=True))
    folders = {'Animal': re.compile(r'/vocabulaire/(?:animaux[^/]*|oiseaux|insectes[^/]*)/'),
               'Végétal': re.compile(r'/vocabulaire/(?:plantes|fruits[^/]*|legumes[^/]*)/'),
               'Métier': re.compile(r'/vocabulaire/metiers/'),
               'Maladie': re.compile(r'/vocabulaire/sante/')}
    originals = {r['src']: r for r in baseline}
    pending = []; progress = {}; failures = []; approved_ids = set(); inventory = []
    actions = [j for j in plan['jobs'] if j['type'] == 'Action'] + [dict(r, id='catalogue-20261113-action-telephoner') for r in plan['reuses'] if r['type'] == 'Action']
    for typ, targets in [('Action', actions)] + [(typ, [s for s in plan['subjects'] if s['type'] == typ]) for typ in folders]:
        counts = Counter()
        for target in targets:
            path = ROOT / 'docs/gallery/generation-20261113' / (target['id'] + '.json')
            state = json.loads(path.read_text()) if path.exists() else target
            if state.get('status') == 'visually_reviewed':
                asset = ROOT / 'public' / state['path'].lstrip('/')
                assert state['path'] in reviewed and sha(asset) == reviewed[state['path']]['sha256'] == state['sha256']
                counts['reviewed'] += 1
                counts['reused' if state.get('reuse') else 'generated'] += 1
                approved_ids.add(target['id'])
                inventory.append([target['id'], state['label'], typ, state.get('subtype', ''),
                                  state['path'], 'réemploi TCF' if state.get('reuse') else 'création', state['sha256']])
                target.update(status='visually_reviewed', path=state['path'], sha256=state['sha256'])
                # Archive only a same-concept legacy image within its real family.
                # An avocado fruit must never replace the lawyer or a rose swatch.
                if typ in folders:
                    for original in baseline:
                        if not folders[typ].search(original['src']) or norm(original['label']) != norm(target['label']):
                            continue
                        original_path = ROOT / original['id']
                        if original['src'] == state['path']:
                            continue
                        replacement = dict(original=original['src'], path=state['path'], original_sha256=sha(original_path), sha256=state['sha256'])
                        old = next((r for r in classes['replacements'] if r['original'] == original['src']), None)
                        assert not old or old['path'] == replacement['path'], original['src']
                        if not old:
                            classes['replacements'].append(replacement)
            else:
                counts['remaining'] += 1
                target['status'] = state.get('status', 'planned')
                if target['status'] == 'catalogue_subject_planned':
                    target['status'] = 'planned'
                note = state.get('review_note', '')
                previous_attempt = ROOT / 'docs/gallery/generation-20261113' / (target['id'] + '-attempt1.json')
                if not note and state.get('revision', 1) > 1 and previous_attempt.exists():
                    note = json.loads(previous_attempt.read_text()).get('review_note', '')
                error = state.get('error', '')
                failure_category = ('quota' if 'usage_limit_reached' in error else
                                    'source PNG non reçue' if 'missing_generation_artifact' in error else
                                    'transport' if 'transport' in error else 'service' if error else '')
                pending.append(dict(id=target['id'], label=target['label'], type=typ, subtype=target.get('subtype', ''),
                                    status=target['status'], review_note=note, failure_category=failure_category))
                if state.get('error'):
                    failures.append(dict(id=target['id'], error=state['error']))
        progress[typ] = dict(planned=len(targets), reviewed=counts['reviewed'], generated=counts['generated'], reused=counts['reused'], remaining=counts['remaining'])
    for job in plan['jobs']:
        metadata = ROOT / 'docs/gallery/generation-20261113' / (job['id'] + '.json')
        if metadata.exists():
            state = json.loads(metadata.read_text())
            job['status'] = state['status']
            for field in ['prompt', 'reference_images', 'style_references', 'style_reference_commit',
                          'revision', 'source_reassignment', 'label']:
                if field in state:
                    job[field] = state[field]
    for replacement in classes['replacements']:
        assert sha(ROOT / 'public' / replacement['original'].lstrip('/')) == replacement['original_sha256']
        assert sha(ROOT / 'public' / replacement['path'].lstrip('/')) == replacement['sha256']
        assert replacement['original'] in originals
    blocker = next((r for r in failures if 'usage_limit_reached' in r['error']), None)
    plan['progress'] = progress
    plan['pending_subjects'] = pending
    if blocker:
        error = blocker['error'].replace('\\', '')
        match = re.search(r'"resets_at"\s*:\s*(\d+)', error)
        plan['generation_blocker'] = dict(code='usage_limit_reached', http_status=429, error=blocker['error'])
        if match:
            epoch = int(match[1]);plan['generation_blocker'].update(resets_at=epoch, timezone='Europe/Zurich', resets_at_local=datetime.fromtimestamp(epoch, ZoneInfo('Europe/Zurich')).isoformat())
    plan['status'] = 'complete' if not pending else ('blocked_image_generation_quota' if blocker else 'in_progress')
    PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    CLASSES.write_text(json.dumps(classes, ensure_ascii=False, indent=2) + '\n')
    with (ROOT / 'docs/gallery/catalogue-tcf-controle-20261113.csv').open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.writer(stream, delimiter=';')
        writer.writerow(['id', 'libellé', 'type', 'sous-thème', 'fichier', 'origine', 'sha256'])
        writer.writerows(sorted(inventory, key=lambda row: (row[2], row[1])))
    lines = ['# Extension du catalogue TCF — 13 novembre 2026', '',
             'L’inventaire général existe déjà dans `src/gallery/catalog.generated.json` et est reconstruit par `scripts/image-gallery-catalog.mjs`. Les classements précis et les correspondances avec les anciens fichiers sont dans `classement-tcf-20261113.json`.', '',
             'Les cinq types sont Action, Animal, Végétal, Métier et Maladie. Les maladies, symptômes et douleurs sont répartis en sous-thèmes. Les champignons alimentaires sont rangés avec les légumes dans le groupe culinaire ; les sous-thèmes précisent leur nature.', '',
             'Les originaux sont conservés et restent téléchargeables sous « Version antérieure » lorsqu’une correspondance TCF contrôlée existe. Les images prévues ou générées en attente de contrôle ne remplacent aucun original.', '',
             '| Type | Sujets prévus | Disponibles et contrôlés | Nouvelles images | Réemplois TCF | Restants |', '|---|---:|---:|---:|---:|---:|']
    for typ, counts in progress.items():
        lines.append('| ' + typ + ' | ' + ' | '.join(str(counts[k]) for k in ['planned', 'reviewed', 'generated', 'reused', 'remaining']) + ' |')
    lines += ['', 'Les nombres ci-dessus portent sur les concepts de ce lot et non sur la totalité des fichiers de la galerie. La liste de sujets est extensible : elle ne prétend pas épuiser les espèces, métiers ou maladies existants.', '',
              'Style : peinture numérique semi-réaliste douce du commit `48a753d8`, contours fins, sujets entiers, paysage 4:3, aucun montant ou date. Les métiers des derniers lots reprennent la première version d’architecture retenue dans `docs/tcf/choix-versions-metiers-20261113.json`. Les références effectivement fournies sont consignées pour chaque création.', '',
              'Le dépôt contient les WebP diffusés, les prompts, les références et les empreintes. Les PNG sources des créations de ce lot sont conservés dans l’environnement de travail, au chemin consigné dans chaque fiche ; ils ne sont pas versionnés. Les WebP sont encodés sans découpe ni redimensionnement.', '']
    if blocker:
        lines += ['Le service d’images a refusé la poursuite avec HTTP 429 `usage_limit_reached`. Réinitialisation annoncée : ' + plan['generation_blocker'].get('resets_at_local', 'non précisée') + ' (heure de Zurich). Les productions manquantes et échecs sont conservés pour la reprise.', '']
    health = [s for s in plan['subjects'] if s['type'] == 'Maladie']
    lines += ['Santé : ' + ' ; '.join(
        f"{sub} : {sum(s['status'] == 'visually_reviewed' for s in health if s['subtype'] == sub)}/{sum(s['subtype'] == sub for s in health)}"
        for sub in dict.fromkeys(s['subtype'] for s in health)) + '.', '',
        f"L’[inventaire CSV des {len(inventory)} sujets contrôlés](catalogue-tcf-controle-20261113.csv) donne les libellés, types, fichiers, réemplois et empreintes. La [liste des {len(pending)} sujets restants](images-restantes-20261113.md) distingue les productions à faire des corrections visuelles.", '',
        'La liste complète des sujets et statuts est dans `extension-tcf-20261113.json` ; les noms par famille sont dans `sujets-tcf-20261113.json`. `generation-file-sujets-20261113.json` est la file de reprise, reconstruite avec `scripts/prepare-gallery-subject-jobs.py` après ce rapport. Aucune image en attente ou rejetée ne doit être activée sans contrôle visuel.', '']
    (ROOT / 'docs/gallery/avancement-tcf-20261113.md').write_text('\n'.join(lines))
    remaining = ['# Images du catalogue TCF restant à préparer', '',
                 f'{len(pending)} sujets restent à produire ou à corriger. Les images rejetées ne sont pas publiées. Les prompts de correction sont conservés dans les fiches de génération et repris dans la file de préparation.', '',
                 '| Type | Sujet | État | Correction à appliquer |', '|---|---|---|---|']
    for item in pending:
        status = {'planned': 'À générer', 'generation_failed': 'Génération à reprendre',
                  'rejected_visual_review': 'Correction visuelle'}.get(item['status'], item['status'])
        if item['failure_category']:
            status += ' (' + item['failure_category'] + ')'
        remaining.append('| ' + ' | '.join(str(value).replace('|', '/').replace('\n', ' ') for value in
                                          [item['type'], item['label'], status, item['review_note']]) + ' |')
    (ROOT / 'docs/gallery/images-restantes-20261113.md').write_text('\n'.join(remaining) + '\n')
    print(json.dumps(progress, ensure_ascii=False))

if __name__ == '__main__':
    report()

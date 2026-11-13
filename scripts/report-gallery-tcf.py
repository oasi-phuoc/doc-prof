"""Synchronise the finite gallery work list with reviewed files and report gaps."""
from collections import Counter
from datetime import datetime
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
    pending = []; progress = {}; failures = []; approved_ids = set()
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
                pending.append(dict(id=target['id'], label=target['label'], type=typ, subtype=target.get('subtype', ''), status=target['status']))
                if state.get('error'):
                    failures.append(dict(id=target['id'], error=state['error']))
        progress[typ] = dict(planned=len(targets), reviewed=counts['reviewed'], generated=counts['generated'], reused=counts['reused'], remaining=counts['remaining'])
    for job in plan['jobs']:
        metadata = ROOT / 'docs/gallery/generation-20261113' / (job['id'] + '.json')
        if metadata.exists():
            state = json.loads(metadata.read_text())
            job['status'] = state['status']
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
            epoch = int(match[1]);plan['generation_blocker'].update(resets_at=epoch, resets_at_paris=datetime.fromtimestamp(epoch, ZoneInfo('Europe/Paris')).isoformat())
    plan['status'] = 'complete' if not pending else ('blocked_image_generation_quota' if blocker else 'in_progress')
    PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    CLASSES.write_text(json.dumps(classes, ensure_ascii=False, indent=2) + '\n')
    lines = ['# Extension du catalogue TCF — 13 novembre 2026', '',
             'L’inventaire général existe déjà dans `src/gallery/catalog.generated.json` et est reconstruit par `scripts/image-gallery-catalog.mjs`. Les classements précis et les correspondances avec les anciens fichiers sont dans `classement-tcf-20261113.json`.', '',
             'Les cinq types sont Action, Animal, Végétal, Métier et Maladie. Les maladies, symptômes et douleurs sont répartis en sous-thèmes. Les champignons alimentaires sont rangés avec les légumes dans le groupe culinaire ; les sous-thèmes précisent leur nature.', '',
             'Les originaux sont conservés et restent téléchargeables sous « Version antérieure » lorsqu’une correspondance TCF contrôlée existe. Les images prévues ou générées en attente de contrôle ne remplacent aucun original.', '',
             '| Type | Sujets prévus | Disponibles et contrôlés | Nouvelles images | Réemplois TCF | Restants |', '|---|---:|---:|---:|---:|---:|']
    for typ, counts in progress.items():
        lines.append('| ' + typ + ' | ' + ' | '.join(str(counts[k]) for k in ['planned', 'reviewed', 'generated', 'reused', 'remaining']) + ' |')
    lines += ['', 'Les nombres ci-dessus portent sur les concepts de ce lot et non sur la totalité des fichiers de la galerie. La liste de sujets est extensible : elle ne prétend pas épuiser les espèces, métiers ou maladies existants.', '',
              'Style : peinture numérique semi-réaliste douce du commit `48a753d8`, contours fins, sujets entiers, paysage 4:3, aucun montant ou date. Chaque publication conserve le prompt, les références, le PNG source et les empreintes. Les fichiers sont encodés en WebP sans découpe ou redimensionnement.', '']
    if blocker:
        lines += ['Le service d’images a refusé la poursuite avec HTTP 429 `usage_limit_reached`. Réinitialisation annoncée : ' + plan['generation_blocker'].get('resets_at_paris', 'non précisée') + ' (heure de Paris). Les productions manquantes et échecs sont conservés pour la reprise.', '']
    lines += ['La liste exacte de tous les sujets, statuts et productions manquantes est dans `extension-tcf-20261113.json` ; les noms par famille sont dans `sujets-tcf-20261113.json`.', '']
    (ROOT / 'docs/gallery/avancement-tcf-20261113.md').write_text('\n'.join(lines))
    print(json.dumps(progress, ensure_ascii=False))

if __name__ == '__main__':
    report()

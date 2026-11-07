"""Report progress against the immutable set of 573 image-trio candidates."""
from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
phase_path = ROOT / 'docs/tcf/extension-573-20261107.json'
phase = json.loads(phase_path.read_text())
review = json.loads((ROOT / 'docs/tcf/revue-763-20261107.json').read_text())
by_key = {q['key']: q for q in review['questions']}
assert len(phase['question_keys']) == len(set(phase['question_keys'])) == 573
rows = [by_key[key] for key in phase['question_keys']]
active = [q for q in rows if q['status'] == 'active_reviewed_trio']
text = [q for q in rows if q['status'].startswith('keep_text')]
pending = [q for q in rows if q['status'].startswith('artwork_needed')]
assert len(active) + len(text) + len(pending) == 573
jobs = {j['id']: j for j in phase['generation_jobs']}
for path in sorted((ROOT / 'docs/tcf/generation-extension573-20261107').glob('*.json')):
    item = json.loads(path.read_text())
    jobs[item['id']] = item
phase['generation_jobs'] = list(jobs.values())
phase['progress'] = dict(activated_trios=len(active), retained_text=len(text), pending_trios=len(pending),
                         pending_categories=dict(Counter(q['status'] for q in pending)),
                         generation_status=dict(Counter(j.get('status', 'planned') for j in jobs.values())))
phase['status'] = 'complete' if not pending else ('blocked_image_generation_quota' if phase.get('generation_blocker') else 'in_progress')
phase_path.write_text(json.dumps(phase, ensure_ascii=False, indent=2) + '\n')
lines = ['# Avancement des 573 trios TCF', '',
         f"État vérifié du lot initial : **{len(active)} trios activés**, **{len(text)} question(s) conservée(s) en texte**, **{len(pending)} trios à préparer**.", '',
         'Les trios activés comportent trois images distinctes approuvées et liées à leurs empreintes. Les choix et corrigés des questions sont conservés ; aucune nouvelle écoute audio n’est revendiquée.', '',
         'Les générations en attente de contrôle ne sont pas comptées comme des trios prêts. Une illustration seule peut servir à plusieurs questions, mais chaque trio est vérifié avant activation.', '',
         'Les 299 références audio nécessitant les fichiers originaux restent suivies séparément dans `remplacement-audio/correspondance-299-audios-20261107.csv`.', '',
         f"Blocage constaté : HTTP 429 `usage_limit_reached` du service d’images. Réinitialisation annoncée : {phase.get('generation_blocker', {}).get('resets_at_utc', 'non précisée')}. Les productions non lancées et les trois échecs sont conservés dans le registre JSON.", '',
         '## Répartition du travail restant', '', '| Catégorie | Trios |', '|---|---:|']
for category, number in phase['progress']['pending_categories'].items():
    label = {'artwork_needed_contextual_locations': 'Lieux et positions dans leur contexte',
             'artwork_needed_whole_answer_concepts': 'Concepts et réponses entières',
             'artwork_needed_distinct_document_types': 'Documents seuls ou composés'}.get(category, category)
    lines.append(f'| {label} | {number} |')
if text:
    lines += ['', '## Questions conservées en texte', '']
    lines += [f"- `{q['key']}` : {q['reason']}" for q in text]
lines += ['', '## Liste des trios restant à préparer', '', '| Question | Énoncé | Trois réponses |', '|---|---|---|']
for q in pending:
    cells = [q['key'], q['enonce'], ' / '.join(q['labels'])]
    lines.append('| ' + ' | '.join(c.replace('|', '\\|').replace('\n', ' ') for c in cells) + ' |')
(ROOT / 'docs/tcf/extension-573-20261107.md').write_text('\n'.join(lines) + '\n')
print(json.dumps(phase['progress'], ensure_ascii=False))

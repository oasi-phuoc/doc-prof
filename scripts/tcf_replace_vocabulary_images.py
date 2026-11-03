"""Replace vocabulary artwork in CE/CO using reviewed, complete answer images.

Only complete QCM trios are changed. The inventory also retains support and
association images, which require their own review before replacement.
"""
from __future__ import annotations

import argparse
import collections
import hashlib
import json
import re
import unicodedata
from pathlib import Path

from PIL import Image

from tcf_qcm_images import clock_time

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / 'docs/tcf/remplacement-images-vocabulaire.json'
PREFIX = '/lib/images/vocabulaire/'
BANKS = [ROOT / f'src/tcf/content/{level}/{skill}.json'
         for level in ('a0-a1', 'a1-a2', 'a2-b1') for skill in ('ce', 'co')]


def normalise(text):
    text = unicodedata.normalize('NFD', text.lower().replace('’', "'"))
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    text = re.sub(r'\s+', ' ', text).strip(' .!?')
    return re.sub(r"^(?:dans un |dans une |dans les |dans le |dans la |dans l'|en |au |a la |a l'|aux |le |la |les |l'|un |une |des |du |de la |de l'|de )", '', text).strip()


def vocabulary_paths(value, node=()):
    if isinstance(value, dict):
        for key, child in value.items():
            if isinstance(child, str) and child.startswith(PREFIX):
                yield node + (key,), child
            else:
                yield from vocabulary_paths(child, node + (key,))
    elif isinstance(value, list):
        for key, child in enumerate(value):
            yield from vocabulary_paths(child, node + (key,))


def checked_images(manifest):
    result = {}
    for row in manifest['images']:
        if row.get('status') != 'visually_reviewed':
            continue
        if row.get('style_review', {}).get('status') not in ('aligned', 'aligned_after_redraw'):
            continue
        path = ROOT / 'public' / row['path'].lstrip('/')
        if not path.is_file():
            continue
        with Image.open(path) as image:
            if image.width * 3 != image.height * 4:
                continue
        if row.get('sha256') == hashlib.sha256(path.read_bytes()).hexdigest():
            result[row['path']] = row
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    plan = json.loads(PLAN.read_text())
    manifest = json.loads((ROOT / 'docs/tcf/images-generees.json').read_text())
    registry = json.loads((ROOT / 'scripts/tcf-qcm-image-registry.json').read_text())
    checked = checked_images(manifest)
    aliases = collections.defaultdict(set)
    for row in registry:
        if row['path'] in checked:
            for label in row.get('aliases', []):
                aliases[normalise(label)].add(row['path'])
    for path, row in checked.items():
        if row.get('label'):
            aliases[normalise(row['label'])].add(path)
    for row in plan['approved_reuses']:
        if row['image'] in checked:
            for label in row['labels']:
                aliases[normalise(label)] = {row['image']}
    clocks = {row['clock_time']: path for path, row in checked.items()
              if row.get('clock_time')}

    def resolve(label, enonce):
        base, question = normalise(label), normalise(enonce)
        if 'combien' in question:
            return None
        time = clock_time(label, enonce)
        if time is not None:
            return clocks.get(f'{time[0]:02d}:{time[1]:02d}')
        if 'couleur' in question:
            base = {'bleue': 'bleu', 'bleus': 'bleu', 'bleues': 'bleu',
                    'verte': 'vert', 'verts': 'vert', 'vertes': 'vert',
                    'noire': 'noir', 'noirs': 'noir', 'noires': 'noir',
                    'blanche': 'blanc', 'blancs': 'blanc', 'blanches': 'blanc',
                    'rouges': 'rouge', 'jaunes': 'jaune'}.get(base, base)
        if base == 'cafe' and re.search(r'\bou\b|lieu|endroit|parfum|histoire', question):
            return None
        if base == 'film' and not re.search(r'dvd|emprunt|preter|mediatheque', question):
            return None
        if 'rayon' in question:
            department = plan['department_answers'].get(base)
            if department:
                return department if department in checked else None
        values = aliases.get(base, set())
        return next(iter(values)) if len(values) == 1 else None

    changes, banks = [], {}
    for bank in BANKS:
        content = json.loads(bank.read_text())
        dirty = False
        for exercise in content:
            for qi, question in enumerate(exercise.get('questions', []), 1):
                image_form = question if question.get('type_reponse') == 'qcm_image' else question.get('formes', {}).get('qcm_image')
                text_form = question if question.get('type_reponse') == 'qcm_texte' else question.get('formes', {}).get('qcm_texte')
                if not image_form or not text_form:
                    continue
                choices = image_form.get('choix', [])
                if len(choices) != 3 or not any(c.get('image', '').startswith(PREFIX) for c in choices):
                    continue
                texts = {c['id']: c.get('texte', '') for c in text_form.get('choix', [])}
                paths = []
                for choice in choices:
                    old = choice.get('image', '')
                    paths.append(resolve(texts.get(choice['id'], ''), question['enonce']) if old.startswith(PREFIX) else old)
                if not all(p in checked for p in paths) or len(set(paths)) != 3:
                    continue
                before = [c['image'] for c in choices]
                changes.append(dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'], question=qi,
                                    enonce=question['enonce'], labels=[texts[c['id']] for c in choices],
                                    before=before, after=paths,
                                    replaced_occurrences=sum(p.startswith(PREFIX) for p in before),
                                    review='Réutilisation de concepts entiers relus, trio distinct et contrôlé en 4:3 ; seuls les chemins image changent.'))
                for choice, path in zip(choices, paths):
                    choice['image'] = path
                dirty = True
        banks[bank] = content
        if args.apply and dirty:
            bank.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n')

    remaining = []
    for bank, content in banks.items():
        for exercise in content:
            for node, path in vocabulary_paths(exercise):
                remaining.append(dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'], node=list(node), image=path))
    if args.apply:
        plan['completed_question_trios'].extend(changes)
        plan['remaining_uses'] = remaining
        counts = collections.Counter(row['image'] for row in remaining)
        for asset in plan['assets']:
            asset['remaining_occurrences'] = counts[asset['image']]
            asset['status'] = 'replacement_complete' if counts[asset['image']] == 0 else 'pending_complete_reviewed_trios_or_support_review'
        plan['summary'].update(remaining_occurrences=len(remaining), remaining_original_images=len(counts),
                               replaced_occurrences=plan['summary']['original_occurrences'] - len(remaining),
                               completed_question_trios=len(plan['completed_question_trios']))
        PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(applied=args.apply, ready_question_trios=len(changes),
                          occurrences_replaced=sum(c['replaced_occurrences'] for c in changes),
                          remaining_occurrences=len(remaining)), ensure_ascii=False))


if __name__ == '__main__':
    main()

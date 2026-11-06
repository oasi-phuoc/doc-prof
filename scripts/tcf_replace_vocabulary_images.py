"""Replace vocabulary artwork in CE/CO using reviewed, complete answer images.

By default only complete reviewed QCM trios are changed. Incremental mode can
replace reviewed choices in existing image trios, keeping unresolved artwork.
Support and object-bank replacements require explicit source mappings.
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
PRESERVE_OBJECT_IMAGES = json.loads(PLAN.read_text())['policy'].get('preserve_csc_object_audio_images', True)
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


def preserve_object_audio_images(exercise):
    """CSC object listening exercises draw these five-image banks across levels."""
    return (PRESERVE_OBJECT_IMAGES
            and exercise.get('competence') == 'CO'
            and exercise.get('type_exercice') == 'images_a_reconnaitre')


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


def compatible_reuse(label, target, checked):
    """Reject context-specific aliases and singular/plural subject mismatches."""
    if target not in checked:
        return False
    blocked = {
        'creme': 'co306-creme-medicale-dessine.webp',
        'poulet': 'co306-pates-poulet-dessine.webp',
        'fromage': 'co306-pates-fromage-dessine.webp',
        'avion': 'passagers-d-avion.webp',
        'stade': 'co57-concert-stade.webp',
        'violon': '79c78f62683b.webp',
        'piano': '58eb70256485.webp',
    }
    if target.endswith(blocked.get(normalise(label), '\0')) and not label.lower().startswith('dans '):
        return False
    target_label = checked[target].get('label', '').lower()
    requested = label.lower()
    if re.match(r'^(un |une )', requested) and re.match(r'^(des |les )', target_label):
        return False
    # These reviewed scenes depict a plural group or a generic activity class.
    # Numerical questions remain excluded by resolve(); physical objects still
    # require their requested singular/plural composition.
    reviewed_plurals = {
        'co834-bouquet-fleurs-dessine.webp': {'fleurs'},
        'co57-voyage.webp': {'voyageurs'},
        'co834-concert-dessine.webp': {'concerts'},
        'co306-cours-cuisine-dessine.webp': {'cours de cuisine'},
    }
    plural_scene = any(target.endswith(filename) and normalise(label) in concepts
                       for filename, concepts in reviewed_plurals.items())
    if (re.match(r'^(des |les )', requested) and re.match(r'^(un |une )', target_label)
            and not plural_scene):
        return False
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--incremental', action='store_true',
                        help='Replace reviewed choices in existing complete image trios; retain unresolved images')
    parser.add_argument('--report', type=Path, help='Write complete proposed trios for editorial review')
    parser.add_argument('--pending-report', type=Path, help='List incomplete trios and missing whole answer concepts')
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
        # A noun match alone is insufficient for these homonyms. A pink swatch
        # does not illustrate an offered rose, nor contact lenses a food choice.
        if base == 'rose' and 'couleur' not in question:
            return None
        if base == 'lentilles' and re.search(r'manger|plat|repas|aliment|cuisin|menu|accompagnement', question):
            return None
        if base == 'ballon':
            # The registered generic alias currently depicts a rugby ball.
            # Football/basketball/handball contexts require their own review.
            return None
        if re.search(r'\bparfum\b|\bsaveur\b|\barome\b', question):
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
        if base == 'chocolat' and not re.search(r'ingredient|aliment|produit|fabriqu', question) and re.search(r'boisson|boire|tasse|chaud|commande', question):
            drink = '/lib/images/tcf/qcm-audit/co834-chocolat-chaud-dessine.webp'
            return drink if drink in checked else None
        if base == 'cafe' and 'ingredient' in question:
            return None
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

    changes, banks, pending = [], {}, []
    for bank in BANKS:
        content = json.loads(bank.read_text())
        dirty = False
        for exercise in content:
            if preserve_object_audio_images(exercise):
                continue
            for qi, question in enumerate(exercise.get('questions', []), 1):
                image_form = question if question.get('type_reponse') == 'qcm_image' else question.get('formes', {}).get('qcm_image')
                text_form = question if question.get('type_reponse') == 'qcm_texte' else question.get('formes', {}).get('qcm_texte')
                if not image_form or not text_form:
                    continue
                choices = image_form.get('choix', [])
                legacy_objects = '/lib/images/tcf/co/objets/'
                if len(choices) != 3 or not any(
                    c.get('image', '').startswith(PREFIX)
                    or (c.get('image', '').startswith(legacy_objects) and c['image'] not in checked)
                    for c in choices
                ):
                    continue
                texts = {c['id']: c.get('texte', '') for c in text_form.get('choix', [])}
                contextual = plan.get('question_image_overrides', {}).get(exercise['id'] + '#' + str(qi), {})
                paths = []
                for choice in choices:
                    old = choice.get('image', '')
                    label = texts.get(choice['id'], '')
                    override = contextual.get(label)
                    candidate = old if old in checked else override if override in checked else resolve(label, question['enonce'])
                    paths.append(candidate if old == candidate or compatible_reuse(label, candidate, checked) else None)
                def pending_entry(resolved):
                    return dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'], question=qi,
                                enonce=question['enonce'], labels=[texts[c['id']] for c in choices],
                                before=[c['image'] for c in choices], resolved=resolved,
                                missing_labels=[texts[c['id']] for c, p in zip(choices, resolved) if p not in checked])
                unresolved = not all(p in checked for p in paths)
                if args.incremental and unresolved:
                    pending.append(pending_entry(paths))
                if args.incremental:
                    paths = [new if new in checked else old['image'] for new, old in zip(paths, choices)]
                complete = all(p in checked or (args.incremental and (ROOT / 'public' / p.lstrip('/')).is_file())
                               for p in paths if p)
                if not all(paths) or not complete or len(set(paths)) != 3:
                    if not args.incremental or not unresolved:
                        pending.append(pending_entry(paths))
                    continue
                before = [c['image'] for c in choices]
                if before == paths:
                    continue
                changes.append(dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'], question=qi,
                                    enonce=question['enonce'], labels=[texts[c['id']] for c in choices],
                                    before=before, after=paths,
                                    replaced_occurrences=sum(old.startswith(PREFIX) and old != new for old, new in zip(before, paths)),
                                    incremental=args.incremental,
                                    review='Seuls les chemins des choix relus changent ; trio existant complet et distinct, choix non résolus conservés.' if args.incremental else 'Réutilisation de concepts entiers relus, trio distinct et contrôlé en 4:3 ; seuls les chemins image changent.'))
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
                remaining.append(dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'], node=list(node), image=path,
                                      excluded_object_audio=preserve_object_audio_images(exercise)))
    if args.report:
        args.report.write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n')
    if args.pending_report:
        args.pending_report.write_text(json.dumps(pending, ensure_ascii=False, indent=2) + '\n')
    if args.apply:
        plan['completed_question_trios'].extend(c for c in changes if all(p in checked for p in c['after']))
        plan.setdefault('incremental_question_updates', []).extend(c for c in changes if not all(p in checked for p in c['after']))
        plan['remaining_uses'] = remaining
        counts = collections.Counter(row['image'] for row in remaining)
        for asset in plan['assets']:
            asset['remaining_occurrences'] = counts[asset['image']]
            asset['status'] = 'replacement_complete' if counts[asset['image']] == 0 else 'pending_complete_reviewed_trios_or_support_review'
        plan['summary'].update(remaining_occurrences=len(remaining), remaining_original_images=len(counts),
                               replaced_occurrences=sum(row['replaced_occurrences'] for row in plan['completed_question_trios'] + plan['incremental_question_updates']),
                               excluded_object_audio_occurrences=sum(row['excluded_object_audio'] for row in remaining),
                               remaining_occurrences_to_harmonize=sum(not row['excluded_object_audio'] for row in remaining),
                               completed_question_trios=len(plan['completed_question_trios']))
        aligned = sum(all(path in checked for path in trio['after'])
                      for trio in plan['completed_question_trios'])
        plan['summary'].update(style_aligned_question_trios=aligned,
                               question_trios_awaiting_style_correction=len(plan['completed_question_trios']) - aligned)
        PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(applied=args.apply, ready_question_trios=len(changes),
                          occurrences_replaced=sum(c['replaced_occurrences'] for c in changes),
                          excluded_object_audio_occurrences=sum(row['excluded_object_audio'] for row in remaining),
                          remaining_occurrences_to_harmonize=sum(not row['excluded_object_audio'] for row in remaining),
                          remaining_occurrences=len(remaining)), ensure_ascii=False))


if __name__ == '__main__':
    main()

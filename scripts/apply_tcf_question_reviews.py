"""Applique uniquement des révisions relues dont les preuves existent dans le support."""
from __future__ import annotations
import argparse
import copy
import json
import re
import unicodedata
from pathlib import Path

from tcf_qcm_images import desired_form
from tcf_question_review_data import CE_REVIEWS, SOURCE_ISSUES
from tcf_co_question_review_data import CO_REVIEWS

ROOT = Path(__file__).resolve().parents[1]


def normalized(value):
    value = ''.join(c for c in unicodedata.normalize('NFD', value.lower())
                    if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', value).strip()


def support_text(exercise):
    support = exercise['support']
    return '\n'.join(value for key, value in support.items()
                     if key not in ('image', 'images', 'audio', 'audios') and isinstance(value, str))


def reviewed_question(old, row):
    fact, enonce, labels, evidence = row
    assert 3 <= len(labels) <= 4 and len(set(map(normalized, labels))) == len(labels)
    text = {'melanger': old.get('melanger', old.get('formes', {}).get('qcm_texte', {}).get('melanger', True)),
            'choix': [{'id': chr(97 + i), 'texte': label, **({'correct': True} if i == 0 else {})}
                      for i, label in enumerate(labels)]}
    lines = {'nb_lignes': 2 if len(labels[0]) > 70 or ';' in labels[0] else 1,
             'reponse_modele': labels[0]}
    base = {key: copy.deepcopy(value) for key, value in old.items()
            if key not in ('type_reponse', 'enonce', 'choix', 'melanger', 'formes',
                           'nb_lignes', 'reponse_modele', 'tableau')}
    base.update(enonce=enonce, type_reponse='qcm_texte', **text,
                formes={'lignes': lines})
    image = desired_form(base)
    if image and not all((ROOT / ('public' + c['image'])).is_file() for c in image['choix']):
        image = None
    if image:
        base['formes']['qcm_image'] = image
    # Conserver la forme active si elle reste pertinente après correction.
    if old['type_reponse'] == 'lignes':
        base.update(type_reponse='lignes', **lines)
        base.pop('choix'); base.pop('melanger')
        base['formes'].pop('lignes')
        base['formes']['qcm_texte'] = text
    elif old['type_reponse'] == 'qcm_image' and image:
        base.update(type_reponse='qcm_image', **image)
        base['formes'].pop('qcm_image')
        base['formes']['qcm_texte'] = text
    return base, bool(image)


def checked_rows(rows, source, context):
    assert len({r[0] for r in rows}) == len(rows), context
    assert len({normalized(r[2][0]) for r in rows}) == len(rows), context
    proofs = []
    for row in rows:
        for quote in row[3] if isinstance(row[3], list) else [row[3]]:
            assert normalized(quote) in normalized(source), (context, quote)
        proofs.append({'fact': row[0], 'question': row[1], 'correct_answer': row[2][0],
                       'evidence': row[3]})
    return proofs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    report = {'status': 'in-progress', 'reviewed_exercises': [], 'reviewed_audio': [], 'source_issues': SOURCE_ISSUES,
              'reviewed_questions': 0, 'image_variants': 0}
    seen = set()
    pending_writes = []
    for level in ('a0-a1', 'a1-a2', 'a2-b1'):
        path = ROOT / f'src/tcf/content/{level}/ce.json'
        bank = json.loads(path.read_text())
        changed = False
        for exercise in bank:
            rows = CE_REVIEWS.get(exercise['id'])
            if rows is None:
                continue
            seen.add(exercise['id'])
            assert len(rows) == len(exercise['questions']), exercise['id']
            proofs = checked_rows(rows, support_text(exercise), exercise['id'])
            revised = [reviewed_question(old, row) for old, row in zip(exercise['questions'], rows)]
            questions = [q for q, _ in revised]
            changed |= questions != exercise['questions']
            exercise['questions'] = questions
            report['reviewed_exercises'].append({'id': exercise['id'], 'level': level, 'facts': proofs})
            report['reviewed_questions'] += len(rows)
            report['image_variants'] += sum(image for _, image in revised)
        if changed:
            pending_writes.append((path, bank))
    assert seen == set(CE_REVIEWS), set(CE_REVIEWS) - seen
    seen_audio = set()
    pool_tags = {}
    for level in ('a0-a1', 'a1-a2', 'a2-b1'):
        path = ROOT / f'src/tcf/content/{level}/co.json'
        bank = json.loads(path.read_text())
        changed = False
        for exercise in bank:
            previous_exercise = copy.deepcopy(exercise)
            support = exercise['support']
            audios = support.get('audios') or [support.get('audio')]
            if not any(audio in CO_REVIEWS for audio in audios):
                continue
            assert exercise['type_exercice'] in ('complet', 'association_images'), exercise['id']
            old = exercise.get('questions', [])
            multi = len(audios) > 1
            updated = []
            for index, audio in enumerate(audios):
                previous = ([q for q in old if q.get('audio') == index + 1] if multi else old)
                if multi and not previous and len(old) == len(audios):
                    previous = [old[index]]
                review = CO_REVIEWS.get(audio)
                if not review:
                    updated.extend(previous)
                    continue
                rows, tag = review['rows'], review['tag']
                assert len(rows) == {'court': 2, 'moyen': 4, 'long': 10}[tag], audio
                transcript = support.get('transcription', '')
                source = transcript[index] if isinstance(transcript, list) else transcript
                for before, after in review.get('transcription_replacements', []):
                    assert before in source or after in source, (audio, before)
                    source = source.replace(before, after)
                if isinstance(transcript, list):
                    support['transcription'][index] = source
                else:
                    support['transcription'] = source
                proofs = checked_rows(rows, source, audio)
                revised = [reviewed_question(previous[i] if i < len(previous) else
                                              {'type_reponse': 'qcm_texte', 'points': 1, 'melanger': True}, row)
                           for i, row in enumerate(rows)]
                for q, _ in revised:
                    if multi:
                        q['audio'] = index + 1
                    updated.append(q)
                pool_tags[audio] = {'tag': tag, 'questions': len(rows)}
                if audio not in seen_audio:
                    report['reviewed_audio'].append({'audio': audio, 'tag': tag,
                        'scenario': review.get('scenario', False), 'facts': proofs,
                        'recording_checked': review.get('audio_verified', False)})
                    report['reviewed_questions'] += len(rows)
                    report['image_variants'] += sum(image for _, image in revised)
                seen_audio.add(audio)
            exercise['questions'] = updated
            changed |= exercise != previous_exercise
        if changed:
            pending_writes.append((path, bank))
    assert seen_audio == set(CO_REVIEWS), set(CO_REVIEWS) - seen_audio
    # Toutes les preuves sont contrôlées avant la première écriture.
    if args.apply:
        for path, bank in pending_writes:
            path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + '\n')
        (ROOT / 'scripts/tcf-question-semantic-review-report.json').write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + '\n')
        (ROOT / 'src/tcf/content/co-reviewed-pools.json').write_text(
            json.dumps(pool_tags, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'reviewed_exercises': len(seen), 'reviewed_questions': report['reviewed_questions'],
                      'reviewed_audio': len(seen_audio),
                      'image_variants': report['image_variants'], 'files_changed': len(pending_writes),
                      'applied': args.apply}))


if __name__ == '__main__':
    main()

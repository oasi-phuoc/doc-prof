"""Build new grammar listening questions from verified excerpts and selected TCF items."""

import csv
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CO = ROOT / 'docs/grammaire/co-import'
BANK = ROOT / 'src/grammaire/exercises/co-bank.json'
TCF = ROOT / 'src/tcf/content/a0-a1/co.json'
DATE = '20261127'
MEDIA = CO / f'illustrations-co-{DATE}.json'


def rows(name):
    with (CO / f'questions-{name}-{DATE}.tsv').open(encoding='utf-8', newline='') as handle:
        return [row for row in csv.reader(handle, delimiter='|') if row and not row[0].startswith('#')]


def normalized(text):
    plain = ''.join(c for c in unicodedata.normalize('NFKD', text.casefold()) if not unicodedata.combining(c))
    return ' ' + ' '.join(re.findall('[a-z0-9]+', plain)) + ' '


def transcript(exercise):
    value = exercise['support']['transcription']
    return normalized(''.join(value) if isinstance(value, list) else value)


def question(prompt, choices, correct):
    assert len(choices) == 3 and len({value for _, value in choices}) == 3
    assert sum(choice_id == correct for choice_id, _ in choices) == 1
    return dict(enonce=prompt, type_reponse='qcm_texte', points=1, melanger=True,
                choix=[dict(id=choice_id, texte=value, **({'correct': True} if choice_id == correct else {}))
                       for choice_id, value in choices],
                formes=dict(lignes=dict(nb_lignes=1, reponse_modele=dict(choices)[correct])))


def index_pistes(entries):
    return {(entry['level'], re.search(r'piste_?(\d+)$', entry['exercise']['id'])[1]): entry for entry in entries}


def authored_questions(entries):
    pistes = index_pistes(entries)
    result = defaultdict(list)
    for level in ('A1', 'A2'):
        for number, prompt, correct, wrong1, wrong2, evidence in rows(level.lower()):
            exercise = pistes[level, number]['exercise']
            assert normalized(evidence) in transcript(exercise), (exercise['id'], evidence)
            item = question(prompt, list(zip('abc', (correct, wrong1, wrong2))), 'a')
            result[exercise['id']].append((item, {'proof': evidence}))
    return result


def reused_questions(entries, tcf):
    piste = {entry['exercise']['id']: entry for entry in entries}
    result = {}
    for exercise_id, source_id, indexes, coverage, inclusion in rows('reemploi-tcf'):
        entry = piste[exercise_id]
        assert entry['level'] == 'A1' and float(coverage) >= .92 and float(inclusion) >= .64
        text = transcript(entry['exercise'])
        result[exercise_id] = []
        for index in map(int, indexes.split(',')):
            item = tcf[source_id]['questions'][index]
            assert item['type_reponse'] == 'qcm_texte'
            correct, = [value for value in item['choix'] if value.get('correct')]
            assert normalized(correct['texte']) in text, (exercise_id, index)
            assert not any(normalized(choice['texte']) in text for choice in item['choix'] if not choice.get('correct'))
            choices = [tuple(choice[field] for field in ('id', 'texte')) for choice in item['choix']]
            generated = question(item['enonce'], choices, correct['id'])
            result[exercise_id].append((generated, dict(proof=correct['texte'], source=source_id, index=index)))
    return result


def attach_media(exercise, media, assets, sources):
    for index, binding in media.get('questions', {}).items():
        question_ = exercise['questions'][int(index)]
        correct, = [choice['id'] for choice in question_['choix'] if choice.get('correct')]
        paths = binding['paths']
        assert len(set(paths)) == len(paths) == 3 and all(path in assets for path in paths)
        ids = [choice['id'] for choice in question_['choix']]
        if 'sourceQuestion' in binding:
            reference = binding['sourceQuestion']
            source = sources[reference['id']]['questions'][reference['index']]['formes']['qcm_image']['choix']
            assert [choice['image'] for choice in source] == paths
            assert {choice['id'] for choice in source} == set(ids)
            correct_image, = [choice['id'] for choice in source if choice.get('correct')]
            assert correct == correct_image
            order = [choice['id'] for choice in source]
        else:
            assert binding['answers'] == [choice['texte'] for choice in question_['choix']]
            order = ids
        question_['formes']['qcm_image'] = dict(melanger=True, choix=[
            dict(id=id_, image=path, **({'correct': True} if id_ == correct else {}))
            for id_, path in zip(order, paths)
        ])
    scene = media.get('scene')
    if scene:
        assert scene['path'] in assets and scene['interlocutors'] in (1, 2, 3)
        assert normalized(scene['proof']) in transcript(exercise), exercise['id']
        exercise['support']['image'] = scene['path']
    return bool(scene)


def build():
    entries = json.loads(BANK.read_text(encoding='utf-8'))
    tcf = {record['id']: record for record in json.loads(TCF.read_text(encoding='utf-8'))}
    authored = authored_questions(entries)
    reused = reused_questions(entries, tcf)
    assert set(authored).isdisjoint(reused)
    additions = {**authored, **reused}
    media = json.loads(MEDIA.read_text(encoding='utf-8'))
    bindings, assets = media['bindings'], media['assets']
    assert len(entries) == 252 and len(additions) == 233 and set(bindings) <= set(additions)
    for path, asset in assets.items():
        assert path.startswith('/lib/images/tcf/')
        assert 3 * asset['width'] == 4 * asset['height']
    summary = {level: Counter(pistes=0, questions=0, qcm_image=0, illustrative_scenes=0) for level in ('A1', 'A2')}
    trace = {}
    for entry in entries:
        exercise = entry['exercise']
        key = exercise['id']
        current = additions.get(key)
        if current:
            exercise['questions'] = [question_ for question_, _ in current]
            assert len({question_['enonce'] for question_ in exercise['questions']}) == len(current), key
            exercise['consigne'] = 'Écoutez et répondez aux questions.'
            entry['status'] = 'complete'
            trace[key] = [proof for _, proof in current]
        scene = attach_media(exercise, bindings.get(key, {}), assets, tcf)
        assert exercise['questions'] and entry['status'] == 'complete', key
        summary[entry['level']].update(pistes=1, questions=len(exercise['questions']),
                                      qcm_image=sum(bool(q.get('formes', {}).get('qcm_image')) for q in exercise['questions']),
                                      illustrative_scenes=int(scene))
    payload = dict(date='2026-11-27', questions_added=sum(len(items) for items in additions.values()),
                   by_level=summary, review_basis='transcriptions recoupées et passages TCF correspondants',
                   human_listening=False, teacher_approval=False, proof_by_track=trace)
    BANK.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (CO / f'questions-verification-{DATE}.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: payload[key] for key in ('questions_added', 'by_level')}, ensure_ascii=False))


if __name__ == '__main__':
    build()

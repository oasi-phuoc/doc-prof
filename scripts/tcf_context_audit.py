"""Bind every current CE/CO question to its source and editorial review.

An earlier review is reused only for the same question, choices, correct answer,
written model and source word sequence. Punctuation/case changes are harmless;
changed words or numbers require a fresh review. This is not a new audio listen.
"""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import subprocess
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
BANKS = [ROOT / f'src/tcf/content/{level}/{skill}.json'
         for level in ('a0-a1', 'a1-a2', 'a2-b1') for skill in ('ce', 'co')]
REFERENCE = 'c185786e96512947ac1b8c937834b29dbac6a3c8'
REPORT = ROOT / 'docs/tcf/audit-contextuel-20261106.json'


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def text_form(question):
    return question if question.get('type_reponse') == 'qcm_texte' else question.get('formes', {}).get('qcm_texte', {})


def semantic_question(question):
    text = text_form(question)
    return dict(enonce=question.get('enonce'),
                choices=[dict(id=c['id'], text=c.get('texte'), correct=bool(c.get('correct')))
                         for c in text.get('choix', [])],
                written_model=question.get('formes', {}).get('lignes', {}).get('reponse_modele'))


def source_for(exercise, question):
    support = exercise.get('support', {})
    content = support.get('texte') if exercise.get('competence') == 'CE' else support.get('transcription')
    number = question.get('audio', 1)
    if isinstance(content, list) and isinstance(number, int) and 1 <= number <= len(content):
        content = content[number-1]
    audios = support.get('audios') or []
    audio = audios[number-1] if isinstance(number, int) and 1 <= number <= len(audios) else support.get('audio')
    return content or '', audio


def source_words(value):
    value = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False)
    value = ''.join(c for c in unicodedata.normalize('NFD', value.lower().replace('œ', 'oe'))
                    if unicodedata.category(c) != 'Mn')
    return re.findall(r'[a-z0-9]+', value)


def prepare():
    prior = {}
    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        old = json.loads(subprocess.check_output(['git', 'show', f'{REFERENCE}:{relative}'], cwd=ROOT, text=True))
        for exercise in old:
            for index, question in enumerate(exercise.get('questions', []), 1):
                content, _ = source_for(exercise, question)
                key = (digest(semantic_question(question)), digest(source_words(content)))
                prior.setdefault(key, dict(bank=relative, exercise=exercise['id'], question=index))
    priorities = set(json.loads((ROOT / 'docs/tcf/demande-audit-ce-co-20261106.json').read_text())['priority_examples'])
    pending_audio = {r['ref']: r for r in json.loads((ROOT / 'docs/tcf/remplacement-audio/bascule-restant-20261105.json').read_text())['items']}
    rows, sources, grouped = [], {}, defaultdict(list)
    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        for exercise in json.loads(bank.read_text()):
            for index, question in enumerate(exercise.get('questions', []), 1):
                content, audio = source_for(exercise, question)
                source_id = digest(source_words(content))
                semantic = semantic_question(question)
                question_id = digest(semantic)
                key = f"{exercise['id']}#{index}"
                row = dict(key=key, bank=relative, exercise=exercise['id'], question=index,
                           semantic_sha256=question_id, source_sha256=digest(content),
                           source_words_sha256=source_id, audio=audio,
                           correct_choice_ids=[c['id'] for c in semantic['choices'] if c['correct']])
                evidence = prior.get((question_id, source_id))
                if exercise['id'] in priorities:
                    row.update(status='manually_reviewed_against_active_source',
                               note='Support et totalité des questions de cet exemple relus dans la session ; les corrections demandées sont consignées séparément.')
                elif evidence:
                    row.update(status='retained_editorial_review_exact_content', prior_evidence=evidence)
                else:
                    row['status'] = 'pending_fresh_context_review'
                    grouped[source_id].append(dict(row=row, semantic=semantic))
                rows.append(row)
                sources.setdefault(source_id, dict(text=content, audio_refs=[]))
                if audio and audio not in sources[source_id]['audio_refs']:
                    sources[source_id]['audio_refs'].append(audio)
                if audio in pending_audio:
                    row['audio_replacement_pending'] = pending_audio[audio]['reasons']
    groups = []
    for source_id, items in grouped.items():
        unique = {}
        for item in items:
            semantic_id = digest(item['semantic'])
            unique.setdefault(semantic_id, dict(semantic=item['semantic'], members=[]))['members'].append(item['row']['key'])
        groups.append(dict(id=len(groups)+1, source_words_sha256=source_id, source=sources[source_id],
                           questions=list(unique.values()), status='pending'))
    report = dict(date='2026-11-06', previous_editorial_reference=REFERENCE,
                  method='Relecture antérieure conservée uniquement pour une identité exacte de la question, des choix, du corrigé, de la réponse rédigée et de la séquence de mots du support ; les changements de sens, mots ou nombres restent à relire.',
                  human_audio_listening_performed=False,
                  summary=dict(total_questions=len(rows), statuses=dict(Counter(r['status'] for r in rows)),
                               fresh_review_groups=len(groups), fresh_unique_questions=sum(len(g['questions']) for g in groups)),
                  questions=rows, fresh_review_groups=groups)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(report['summary'], ensure_ascii=False))


def mark_groups(numbers):
    report = json.loads(REPORT.read_text())
    approved = set()
    for group in report['fresh_review_groups']:
        if group['id'] in numbers:
            group['status'] = 'manually_reviewed_against_active_source'
            approved.update(member for q in group['questions'] for member in q['members'])
    for row in report['questions']:
        if row['key'] in approved:
            row['status'] = 'manually_reviewed_against_active_source'
            row['note'] = 'Transcription ou texte complet et trois réponses relus ; corrections éventuelles enregistrées dans le journal des opérations.'
    report['summary']['statuses'] = dict(Counter(r['status'] for r in report['questions']))
    report['summary']['pending_fresh_review_groups'] = sum(g['status'] == 'pending' for g in report['fresh_review_groups'])
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(report['summary'], ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepare', action='store_true')
    parser.add_argument('--mark-groups', nargs='+', type=int)
    parser.add_argument('--show-groups', nargs='+', type=int)
    args = parser.parse_args()
    if args.prepare:
        if REPORT.exists():
            raise SystemExit('Review file already exists; preserve the recorded manual decisions.')
        prepare()
    elif args.mark_groups:
        mark_groups(set(args.mark_groups))
    elif args.show_groups:
        report = json.loads(REPORT.read_text())
        for group in report['fresh_review_groups']:
            if group['id'] in args.show_groups:
                print('\nGROUPE', group['id'], json.dumps(group['source'], ensure_ascii=False))
                for q in group['questions']:
                    print(','.join(q['members']), q['semantic']['enonce'],
                          ' | '.join(('*' if c['correct'] else '') + str(c['text']) for c in q['semantic']['choices']),
                          'MODÈLE', q['semantic']['written_model'])
    else:
        print(json.dumps(json.loads(REPORT.read_text())['summary'], ensure_ascii=False))


if __name__ == '__main__':
    main()

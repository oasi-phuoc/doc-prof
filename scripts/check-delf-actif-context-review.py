#!/usr/bin/env python3
"""Verify the frozen 1,021-question review, its edits and source-bound decisions."""
import argparse
from collections import Counter
import hashlib
import json
import subprocess
from tcf_context_audit import ROOT, BANKS, digest, semantic_question, source_for, source_words, text_form

DIRECTORY = 'docs/tcf/delf-actif-20261113'


def read(name):
    return json.loads((ROOT / DIRECTORY / name).read_text())


def verify(audit_only=False):
    review = read('revue-contexte-20261114.json')
    changes = read('corrections-contexte-20261114.json')
    plan = read('images-a-preparer.json')
    baseline = json.loads(subprocess.check_output(
        ['git', 'show', f"{review['baseline_commit']}:{DIRECTORY}/images-a-preparer.json"],
        cwd=ROOT, text=True))
    initial = {r['key']: r for r in baseline['questions'] if r['status'] == 'needs_context_review'}
    rows = {r['key']: r for r in review['questions']}
    assert len(review['questions']) == len(rows) == len(initial) == 1021
    assert review['completion_status'] == 'complete'
    assert review['human_audio_listening_performed'] is False
    assert review['image_generation_performed'] is review['image_activation_performed'] is False
    assert changes['human_audio_listening_performed'] is False
    assert changes['baseline_commit'] == review['baseline_commit']
    edits = {r['key']: r for r in changes['changes']}
    assert len(edits) == len(changes['changes']) == changes['summary']['questions'] == 41
    assert {r['ordinal'] for r in rows.values()} == set(range(1, 1022))
    assert set(rows) == set(initial)
    exercises = {e['id']: (str(p.relative_to(ROOT)), e) for p in BANKS for e in json.loads(p.read_text())}
    supports = {r['exercise']: r for r in review['supports']}
    assert len(supports) == len(review['supports']) == 323
    planned = {r['key']: r for r in plan['questions']}
    checked_audio = {}
    for key, row in rows.items():
        exercise_id, index = key.split('#')
        bank, exercise = exercises[exercise_id]
        question = exercise['questions'][int(index) - 1]
        source, audio = source_for(exercise, question)
        before = row['original_question']
        after = semantic_question(question)
        assert bank == row['bank'] == initial[key]['bank'], key
        assert row['level'] == exercise['niveau'] == initial[key]['level'], key
        assert row['review_status'] == 'reviewed' and row['answer_supported_by_transcription'] and row['three_choices_reviewed'], key
        assert row['reason'] and row['reason_category'] and len(source_words(row['evidence_quote'])) >= 1, key
        assert ' '.join(source_words(row['evidence_quote'])) in ' '.join(source_words(source)), key
        assert supports[exercise_id]['source'] == source and digest(source) == row['source_sha256'] == initial[key]['source_sha256'], key
        assert audio == row['audio'] == initial[key]['audio'] == supports[exercise_id]['audio'], key
        if audio not in checked_audio:
            checked_audio[audio] = hashlib.sha256((ROOT / 'public' / audio.lstrip('/')).read_bytes()).hexdigest()
        assert checked_audio[audio] == row['audio_sha256'] == initial[key]['audio_sha256'] == supports[exercise_id]['audio_sha256'], key
        assert digest(before) == row['semantic_sha256'] == initial[key]['semantic_sha256'], key
        assert after == row['reviewed_question'] and digest(after) == row['reviewed_semantic_sha256'], key
        assert before['enonce'] == row['enonce'], key
        assert [(c['id'], c['text'], c['correct']) for c in before['choices']] == [(c['id'], c['label'], c['correct']) for c in row['choices']], key
        assert len(after['choices']) == len({c['id'] for c in after['choices']}) == len({c['text'] for c in after['choices']}) == 3, key
        assert sum(c['correct'] for c in after['choices']) == 1, key
        assert [c['id'] for c in after['choices'] if c['correct']] == [c['id'] for c in before['choices'] if c['correct']], key
        assert after['written_model'] == next(c['text'] for c in after['choices'] if c['correct']), key
        assert row['correction_applied'] == (before != after) == (key in edits), key
        if key in edits:
            edit = edits[key]
            assert edit['ordinal'] == row['ordinal'] and edit['reason'] and edit['evidence_quote'] == row['evidence_quote'], key
            assert edit['before'] == before and edit['after'] == after, key
            assert edit['before_sha256'] == digest(before) and edit['after_sha256'] == digest(after), key
            assert edit['source_sha256'] == row['source_sha256'] and edit['audio_sha256'] == row['audio_sha256'], key
        entry = planned[key]
        proof = entry['context_review']
        assert proof['register'] == f'{DIRECTORY}/revue-contexte-20261114.json', key
        assert proof['decision'] == row['decision'] and proof['note'] == row['reason'] and proof['evidence_quote'] == row['evidence_quote'], key
        assert proof['semantic_sha256'] == entry['semantic_sha256'] == row['reviewed_semantic_sha256'], key
        assert row['decision'] in {'keep_text_contextual', 'candidate_visual_review'}, key
        if entry['status'] == 'active_reviewed_trio':
            assert row['decision'] == 'candidate_visual_review', key
        else:
            assert entry['status'] == row['decision'], key
            assert not question.get('formes', {}).get('qcm_image'), key
    actual = dict(Counter(r['decision'] for r in rows.values()))
    assert review['summary']['total'] == review['summary']['reviewed'] == 1021
    assert review['summary']['pending'] == 0 and review['summary']['decisions'] == actual
    assert review['summary']['corrected_questions'] == len(edits)
    assert plan['summary']['context_reviews'] == 1021
    for level in ('A0-A1', 'A1-A2', 'A2-B1'):
        assert review['summary']['by_level'][level] == dict(Counter(r['decision'] for r in rows.values() if r['level'] == level))
    assert review['summary']['corrections_by_level'] == changes['summary']['by_level'] == dict(Counter(r['level'] for r in rows.values() if r['correction_applied']))
    if audit_only:
        current_images = {r['key']: r['active_images'] for r in plan['questions']}
        assert current_images == {r['key']: r['active_images'] for r in baseline['questions']}, 'Une image a changé pendant la revue de contexte'
    print(f"1 021 questions relues sur 323 supports ; {len(edits)} corrections, {actual['candidate_visual_review']} candidatures, {actual['keep_text_contextual']} questions en texte ; sources, réponses et MP3 vérifiés.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--audit-only', action='store_true', help='Also require exactly the image trios present before the context audit.')
    verify(parser.parse_args().audit_only)

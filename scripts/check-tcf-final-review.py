#!/usr/bin/env python3
"""Check current production bytes and the published 87-review evidence."""
try:
    from scripts.audio_replacement.editorial_json import loads as editorial_json_loads
except ModuleNotFoundError:
    from audio_replacement.editorial_json import loads as editorial_json_loads

import hashlib
import json
from pathlib import Path
from tcf_context_audit import semantic_question, source_for

ROOT = Path(__file__).resolve().parents[1]
REPORTS = ROOT / 'docs/tcf/remplacement-audio'
read = lambda path: editorial_json_loads(path.read_text())
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
report = read(REPORTS / 'validation-87-20261111.json')
assert report['summary']['target_references'] == 87
assert report['summary']['validated'] == 87
assert report['summary']['pending'] == 0
ledger = {r['ref']: r for r in read(REPORTS / 'bascule-complete-20261105.json')['installed']}
exercises = {e['id']: e for path in (ROOT / 'src/tcf/content').glob('*/co.json') for e in read(path)}
assert len(report['items']) == len({r['ref'] for r in report['items']}) == 87
editorial = 0
updated_exercises = 0
for item in report['items']:
    ref, digest = item['ref'], item['candidate_sha256']
    assert item['status'] == 'validated'
    assert sha(ROOT / 'public' / ref.lstrip('/')) == digest == ledger[ref]['candidate_sha256'], ref
    assert not ledger[ref].get('final_transcript_review_pending'), ref
    assert len(item['recognitions']) >= 2, ref
    assert all(r['source_sha256'] == digest and r['text'] for r in item['recognitions'].values()), ref
    for context in item['contexts']:
        exercise = exercises[context['exercise']]
        current = hashlib.sha256(json.dumps(exercise, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
        if current != context['exercise_sha256']:
            # Later QCM illustration edits change the exercise hash. Check the
            # exact reviewed recording, transcript and questions for this track.
            index = context['audio']
            text, active_ref = source_for(exercise, {'audio': index})
            assert active_ref == ref and text == context['transcription'], (ref, exercise['id'])
            active_questions = [semantic_question(q) for q in exercise['questions'] if q.get('audio', 1) == index]
            reviewed_questions = [semantic_question(q) for q in context['questions']]
            assert active_questions == reviewed_questions, (ref, exercise['id'])
            updated_exercises += 1
    if len(item['qualified_recognitions']) < 2:
        editorial += 1
        path = REPORTS / item['editorial_adjudication_report']
        decision = next(r for r in read(path)['items'] if r['ref'] == ref)
        assert decision['source_sha256'] == digest and decision['raw_automatic_gate_met'] is False
        assert len(decision['review_notes']) > 100
        assert decision['human_listening_performed'] is False
    assert item['human_listening_performed'] is False
editions = read(REPORTS / 'corrections-4-editions-20261111.json')
assert editions['status'] == 'installed' and len(editions['corrections']) == 4
for correction in editions['corrections']:
    assert sha(ROOT / 'public' / correction['ref'].lstrip('/')) == correction['candidate_sha256']
    for change in correction['changes']:
        assert exercises[change['exercise']] == change['after']
retired = read(REPORTS / 'retrait-nouvelles-collections-20261111.json')
assert retired['active_library_files_deleted'] == retired['new_exercises_added'] == 0
assert retired['received_downloads_removed'] == 205
print(f'87 dossiers vérifiés, dont {editorial} relectures contextuelles explicites et {updated_exercises} comparaisons par piste ; 4 éditions et leurs MP3 vérifiés.')

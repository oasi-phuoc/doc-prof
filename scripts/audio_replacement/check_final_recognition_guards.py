#!/usr/bin/env python3
"""Regression checks for factual audio differences and file-bound ASR evidence."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

ASSESS=Path(__file__).with_name('assess_final_recognitions.py')
DIGEST='a'*64

def assess(expected, parakeet, whisper, ctc=None, ctc_digest=DIGEST, bad_resolution=False):
    with tempfile.TemporaryDirectory(prefix='tcf-evidence-') as temp:
        root=Path(temp)
        def write(path,value): path.write_text(json.dumps(value))
        for engine,text,digest in [('parakeet',parakeet,DIGEST),('whisper',whisper,DIGEST),('ctc',ctc,ctc_digest)]:
            (root/engine).mkdir()
            if text is not None:
                write(root/engine/'result.json',dict(status='transcribed',source_sha256=digest,text=text,engine=engine))
        decision=dict(selected_text=expected,reason='Fixture review')
        if bad_resolution:
            decision['numeric_resolution']=dict(candidate_sha256=DIGEST,evidence_file=str(root/'ctc/result.json'),evidence_sha256='0'*64,reviewed_numbers=['17','40'],verification_mode='span_review_across_three_recognitions',span_review_notes=['Fixture'])
        write(root/'editorial-decisions.json',{'/fixture.mp3':decision})
        write(root/'existing-recognitions.json',{})
        write(root/'review-queue.json',[dict(ref='/fixture.mp3',candidate_sha256=DIGEST,candidate_text=expected,contexts=[dict(transcription=expected,questions=[{},{}])])])
        write(root/'technical-checks.json',{DIGEST:dict(status='technical_integrity_passed',category='court',boundary_signal=dict(safe_quiet_margins=True))})
        subprocess.run([sys.executable,str(ASSESS),'--work',str(root)],check=True,capture_output=True,text=True)
        return json.loads((root/'readiness.json').read_text())['rows'][0]

assert not assess('Il fera moins cinq degrés.','Il fera cinq degrés.','Il fera cinq degrés.')['manual_review_ready']
assert not assess('Le train part à 15 h 40.','Le train part à 3 h 40.','Le train part à 3 h 40.')['manual_review_ready']
assert not assess('Le train part à 15 h 40.','Le train part à 3 h 40.','Le train part à 3 h 40.','Le train part à 15 h 40.',ctc_digest='b'*64)['manual_review_ready']
row=assess('Le train part à 15 h 40.','Le train part à 3 h 40.','Le train part à 15 h 40.','Le train part à quinze heures quarante.')
assert row['manual_review_ready'] and row['selected_recognition_engines']==['whisper','ctc']
assert not assess('Le train part à 17 h 40.','Le train part à 3 h 40.','Le train part à 3 h 40.','Le train part à 17 h 40.',bad_resolution=True)['manual_review_ready']
assert not assess('Le train part à 15 h 40.','Le train part à 15 h 40.','Page 1. Le train part à 15 h 40.')['manual_review_ready']
print('Six factual and provenance guard regressions passed.')

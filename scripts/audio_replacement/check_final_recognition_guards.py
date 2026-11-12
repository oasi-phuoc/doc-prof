#!/usr/bin/env python3
"""Regression checks for factual audio differences and file-bound ASR evidence."""
import json
import hashlib
import re
from pathlib import Path
import subprocess
import sys
import tempfile

ASSESS=Path(__file__).with_name('assess_final_recognitions.py')
DIGEST='a'*64

def assess(expected, parakeet, whisper, ctc=None, ctc_digest=DIGEST, bad_resolution=False, lexical_aliases=None, stale_lexical_evidence=False, numeric_approved_engines=None):
    with tempfile.TemporaryDirectory(prefix='tcf-evidence-') as temp:
        root=Path(temp)
        def write(path,value): path.write_text(json.dumps(value))
        for engine,text,digest in [('parakeet',parakeet,DIGEST),('whisper',whisper,DIGEST),('ctc',ctc,ctc_digest)]:
            (root/engine).mkdir()
            if text is not None:
                write(root/engine/'result.json',dict(status='transcribed',source_sha256=digest,text=text,engine=engine))
        decision=dict(selected_text=expected,reason='Fixture review')
        if lexical_aliases:
            evidence=root/'whisper/result.json'
            decision['lexical_resolution']=dict(candidate_sha256='b'*64 if stale_lexical_evidence else DIGEST,evidence_file=str(evidence),evidence_sha256=hashlib.sha256(evidence.read_bytes()).hexdigest(),review_notes='File-bound ASR fusion reviewed against the other recognition.',aliases={'parakeet':lexical_aliases})
        if numeric_approved_engines is not None:
            evidence=root/'ctc/result.json'
            decision['numeric_resolution']=dict(candidate_sha256=DIGEST,evidence_file=str(evidence),evidence_sha256=hashlib.sha256(evidence.read_bytes()).hexdigest(),reviewed_numbers=re.findall(r'\d+',expected),approved_engines=numeric_approved_engines,verification_mode='span_review_across_three_recognitions',span_review_notes=['Only the explicitly reviewed engine may use this resolution.'])
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
assert not assess('Astrid, tu veux réviser cet examen avec moi demain ?', 'Tu veux réviser cet examen avec moi demain ?', 'Tu veux réviser cet examen avec moi demain ?')['manual_review_ready']
assert not assess('Nous avons rendez-vous demain dans la bibliothèque.', 'Nous avons rendez-vous demain dans la', 'Nous avons rendez-vous demain dans la')['manual_review_ready']
assert assess('Salut Carine, tu viens avec moi au cinéma ?', 'Salucarine, tu viens avec moi au cinéma ?', 'Salut Carine, tu viens avec moi au cinéma ?')['manual_review_ready']
assert not assess('La remise est de 30 pour cent.', 'La remise est de 50 pour cent.', 'La remise est de 50 pour cent.')['manual_review_ready']
assert assess('On vous offre un beau stylo.', 'On vous offre un postilo.', 'On vous offre un beau stylo.', lexical_aliases={'postilo':'beau stylo'})['manual_review_ready']
assert not assess('On vous offre un beau stylo.', 'On vous offre un postilo.', 'On vous offre un beau stylo.', lexical_aliases={'postilo':'beau stylo'}, stale_lexical_evidence=True)['manual_review_ready']
assert not assess('On vous offre 30 euros.', 'On vous offre 50 euros.', 'On vous offre 50 euros.', lexical_aliases={'50 euros':'30 euros'})['manual_review_ready']
assert not assess('Le train part à 17 h 40.', 'Le train part à 3 h 40.', 'Le train part à 3 h 40.', 'Le train part à 17 h 40.', numeric_approved_engines=['ctc'])['manual_review_ready']
print('Fourteen factual, boundary, lexical-fusion and provenance guard regressions passed.')

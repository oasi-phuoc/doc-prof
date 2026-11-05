#!/usr/bin/env python3
"""Verify the user's protected CSC object listening artwork and its source files."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
snapshot = json.loads((ROOT / 'docs/tcf/images-objet-csc-a-conserver.json').read_text())
checked = 0
all_refs = 0
for saved in snapshot['exercises']:
    bank = json.loads((ROOT / saved['bank']).read_text())
    exercise = next(e for e in bank if e['id'] == saved['exercise'])
    assert exercise['images'] == saved['images'], saved['exercise']
    for ref in saved['protected_vocabulary_refs']:
        node = exercise
        for key in ref['node']:
            node = node[key]
        assert node == ref['image'], (saved['exercise'], ref['node'])
        assert hashlib.sha256((ROOT / 'public' / node.lstrip('/')).read_bytes()).hexdigest() == ref['sha256'], node
        all_refs += 1
    for image, digest in saved['image_sha256'].items():
        assert hashlib.sha256((ROOT / 'public' / image.lstrip('/')).read_bytes()).hexdigest() == digest, image
        checked += 1
print(f"CSC OBJET : {len(snapshot['exercises'])} banques, {checked} images principales et {all_refs} usages protégés, octets vérifiés.")

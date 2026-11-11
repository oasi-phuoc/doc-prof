#!/usr/bin/env python3
"""Verify the user's protected CSC object listening artwork and its source files."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
snapshot = json.loads((ROOT / 'docs/tcf/images-objet-csc-a-conserver.json').read_text())
report_path = ROOT / 'docs/tcf/reprise-images-20261106.json'
replacements = {}
context_ops = json.loads((ROOT / 'docs/tcf/operations-contexte-20261106.json').read_text())['operations'] if (ROOT / 'docs/tcf/operations-contexte-20261106.json').exists() else []
if report_path.exists():
    report = json.loads(report_path.read_text())
    replacements = {(r['bank'], r['exercise'], tuple(r['node'])): r for r in report['replacements']}


def expected(saved, node, original):
    """The Nov 6 request includes OBJET; only audited replacements are accepted."""
    row = replacements.get((saved['bank'], saved['exercise'], tuple(node)))
    if row is None:
        return original
    assert row['before'] == original, (saved['exercise'], node)
    target = ROOT / 'public' / row['after'].lstrip('/')
    assert hashlib.sha256(target.read_bytes()).hexdigest() == row['target_sha256'], target
    return row['after']


checked = 0
all_refs = 0
for saved in snapshot['exercises']:
    bank = json.loads((ROOT / saved['bank']).read_text())
    exercise = next(e for e in bank if e['id'] == saved['exercise'])
    expected_images = [dict(image, image=expected(saved, ['images', i, 'image'], image['image']))
                       for i, image in enumerate(saved['images'])]
    for op in context_ops:
        if op['bank'] == saved['bank'] and op['exercise'] == saved['exercise'] and op['node'][0] == 'images' and op['node'][-1] == 'correct':
            assert expected_images[op['node'][1]]['correct'] == op['before']
            expected_images[op['node'][1]]['correct'] = op['after']
    assert exercise['images'] == expected_images, saved['exercise']
    for ref in saved['protected_vocabulary_refs']:
        node = exercise
        for key in ref['node']:
            node = node[key]
        assert node == expected(saved, ref['node'], ref['image']), (saved['exercise'], ref['node'])
        assert hashlib.sha256((ROOT / 'public' / ref['image'].lstrip('/')).read_bytes()).hexdigest() == ref['sha256'], ref['image']
        all_refs += 1
    for image, digest in saved['image_sha256'].items():
        assert hashlib.sha256((ROOT / 'public' / image.lstrip('/')).read_bytes()).hexdigest() == digest, image
        checked += 1
print(f"CSC OBJET : {len(snapshot['exercises'])} banques, {checked} originaux principaux et {all_refs} usages vérifiés ; seules les nouvelles images auditées sont acceptées.")

"""Check completed batches against their immutable source and image receipts.

Pass later activation receipts too when their image forms postdate the baseline.
The raw-bank comparison also protects duplicated editorial JSON fragments.
"""
import argparse
from copy import deepcopy
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from audio_replacement.editorial_json import loads
from tcf_context_audit import BANKS, digest, semantic_question, source_for, text_form


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('receipts', nargs='+', type=Path)
    args = parser.parse_args()
    receipts = [json.loads(path.read_text()) for path in args.receipts]
    baseline = receipts[0]['baseline_commit']
    manifest = {r['path']: r for r in json.loads((ROOT / 'docs/tcf/images-generees.json').read_text())['images']}
    audit = {r['path']: r for r in json.loads((ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json').read_text())['images']}
    proofs = {}
    new_images = {}
    for receipt in receipts:
        packet = json.loads((ROOT / receipt['preparation_register']).read_text())
        assert packet['status'] == 'completed'
        assert receipt['summary']['added_trios'] == len(receipt['trios']) == packet['summary']['activated_trios']
        assert not packet['remaining_asset_ids']
        for proof in receipt['trios']:
            assert proof['key'] not in proofs
            assert proof['visual_review'] and proof['change_kind'] == 'added_image_form'
            proofs[proof['key']] = proof
        for row in receipt['new_images']:
            new_images[row['path']] = row
    checked = set()
    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        original_bytes = subprocess.check_output(['git', 'show', baseline + ':' + relative], cwd=ROOT)
        assert hashlib.sha256(original_bytes).hexdigest() == receipts[0]['source_bank_sha256'][relative]
        original = json.loads(original_bytes)
        current_text = bank.read_text()
        restored = json.loads(current_text)
        old_by_id = {e['id']: e for e in original}
        for exercise in restored:
            for number, question in enumerate(exercise.get('questions', []), 1):
                key = f"{exercise['id']}#{number}"
                if key not in proofs:
                    continue
                proof = proofs[key]
                assert proof['bank'] == relative
                assert question['formes']['qcm_image'] == proof['after_image_form']
                old = old_by_id[exercise['id']]['questions'][number - 1]
                assert not old.get('formes', {}).get('qcm_image'), key
                question['formes'].pop('qcm_image')
                if not question['formes'] and 'formes' not in old:
                    question.pop('formes')
        assert restored == original, relative + ': unregistered or non-image edit'
        for exercise in loads(current_text):
            for number, question in enumerate(exercise.get('questions', []), 1):
                key = f"{exercise['id']}#{number}"
                if key not in proofs:
                    continue
                proof = proofs[key]
                source, audio = source_for(exercise, question)
                assert source == proof['source'] and digest(source) == proof['source_sha256']
                assert digest(semantic_question(question)) == proof['semantic_sha256']
                assert audio == proof['audio']
                if audio:
                    assert sha(ROOT / 'public' / audio.lstrip('/')) == proof['audio_sha256']
                form = question['formes']['qcm_image']
                assert [(c['id'], bool(c.get('correct'))) for c in form['choix']] == [
                    (c['id'], bool(c.get('correct'))) for c in text_form(question)['choix']]
                assert [c['image'] for c in form['choix']] == proof['image_paths']
                assert len(set(proof['image_paths'])) == 3
                for image, expected in zip(proof['image_paths'], proof['image_sha256']):
                    assert sha(ROOT / 'public' / image.lstrip('/')) == expected == manifest[image]['sha256']
                    assert manifest[image]['status'] == audit[image]['status'] == 'visually_reviewed'
                    assert audit[image]['sha256'] == expected
                checked.add(key)
    assert checked == set(proofs)
    from PIL import Image
    for image, row in new_images.items():
        path = ROOT / 'public' / image.lstrip('/')
        with Image.open(path) as art:
            assert art.format == 'PNG' and art.size == (1448, 1086)
        assert sha(path) == row['sha256']
        assert manifest[image]['original_bytes_preserved']
        assert audit[image]['visual_label'] and audit[image]['visual_keywords']
    print(json.dumps(dict(checked_trios=len(checked), checked_new_images=len(new_images),
        raw_editorial_fragments_preserved=True, source_audio_and_answers_unchanged=True), ensure_ascii=False))


if __name__ == '__main__':
    main()

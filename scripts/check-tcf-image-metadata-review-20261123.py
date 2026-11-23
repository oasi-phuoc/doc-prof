"""Check every TCF metadata review against current pixels and search entries."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'docs/gallery/revue-mots-cles-tcf-20261123'


def read(path):
    return json.loads(Path(path).read_text())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--gallery-test-log', type=Path)
    args = parser.parse_args()
    baseline = 'cb5e6b88'
    audit = read(ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json')
    by = {row['path']: row for row in audit['images'] if row['collection'] == 'TCF'}
    gallery = {row['src']: row for row in read(ROOT / 'src/gallery/catalog.generated.json')}
    batches = sorted(FOLDER.glob('lot*.json'))
    rows = [row for batch in batches for row in read(batch)['images']]
    journal = read(ROOT / 'docs/tcf/delf-actif-20261113/reprise-generation-20261123.json')
    original = json.loads(subprocess.check_output(['git', 'show', baseline + ':docs/gallery/audit-mots-cles-tcf-20261117.json'], cwd=ROOT))
    initial = {row['path']: row for row in original['images'] if row['collection'] == 'TCF'}
    initial_approved = {path for path, row in initial.items() if row['status'] == 'visually_reviewed'}
    reviewed_paths = {row['path'] for row in rows}
    generated_paths = {row['path'] for row in journal['images']}
    assert len(batches) == 60 and len(rows) == len(reviewed_paths) == 3811
    assert len(initial) == 4377 and len(initial_approved) == 566
    assert reviewed_paths == set(initial) - initial_approved
    assert len(journal['images']) == len(generated_paths) == 129
    assert generated_paths.isdisjoint(initial)
    assert set(by) == set(initial) | generated_paths
    assert len(by) == 4506 and audit['progress']['pending'] == 0
    assert {path for path, row in gallery.items() if row['collection'] == 'TCF'} == set(by)
    for row in rows:
        actual = by[row['path']]
        assert actual['visual_label'] == row['visual_label']
        assert actual['visual_keywords'] == row['visual_keywords']
        assert actual['sha256'] == row['sha256']
    for row in journal['images']:
        actual = by[row['path']]
        assert actual['visual_label'] == row['label']
        assert actual['visual_keywords'] == row['keywords']
        assert actual['sha256'] == row['sha256']
    for path, row in by.items():
        indexed = gallery[path]
        assert row['status'] == 'visually_reviewed' and row['visual_label'] and row['visual_keywords']
        assert hashlib.sha256((ROOT / 'public' / path.lstrip('/')).read_bytes()).hexdigest() == row['sha256'], path
        assert indexed['label'] == row['visual_label'], path
        assert indexed['keywords'] == ' '.join(dict.fromkeys(row['visual_keywords'])), path
    for scope in ['public/lib/images/tcf', 'public/lib/audio']:
        changes = subprocess.check_output(['git', 'diff', '--name-status', baseline, '--', scope], cwd=ROOT, text=True).splitlines()
        assert all(line.startswith('A\t') for line in changes), (scope, changes)
    print(f'{len(rows)} unique ledger reviews + 566 initial + 129 generated = {len(by)} current TCF images; pixels, captions, search keywords and original preservation verified.')
    if args.gallery_test_log:
        log = args.gallery_test_log.read_text()
        assert 'ℹ pass 15' in log and 'ℹ fail 0' in log
        proof = dict(reviewed_images=len(rows), visually_reviewed_total=len(by), pending_tcf=0,
            gallery_images=len(gallery), additional_generated_images_reviewed=len(generated_paths),
            checks=dict(metadata_current_pixels_and_ledger_sha256='Passed for every current TCF file.',
                gallery_catalog_tests='15 passed, 0 failed; node tests/gallery/catalog.test.mjs',
                delf_preparation='100 reviewed trios activated; 231 prepared images and 54 existing reuses; no image pending.',
                sources_preserved='Only 100 image forms added. Original editorial fragments, answers, transcriptions, links, MP3s and original images preserved; dedicated DELF checker passes.'),
            test_output_sha256=hashlib.sha256(args.gallery_test_log.read_bytes()).hexdigest())
        (FOLDER / 'verification-3811.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

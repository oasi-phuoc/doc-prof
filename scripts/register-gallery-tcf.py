"""Publish only visually reviewed gallery artwork, retaining originals and proof.

Usage: python scripts/register-gallery-tcf.py reviewed-items.json
Each item supplies id, label, type, subtype, path, source_png, prompt,
reference_images and review_note. Reuses supply an existing path and SHA.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/tcf/images-generees.json'
CLASSIFICATION = ROOT / 'docs/gallery/classement-tcf-20261113.json'
STYLE_COMMIT = '48a753d8d6bd095e41968b39da88dbcb331fee11'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def register(items):
    manifest = json.loads(MANIFEST.read_text())
    classification = json.loads(CLASSIFICATION.read_text())
    by_path = {r['path']: r for r in manifest['images']}
    assert len({r['path'] for r in items}) == len(items), 'Duplicate targets'
    for item in items:
        assert item['status'] == 'visually_reviewed' and item['review_note']
        target = ROOT / 'public' / item['path'].lstrip('/')
        if item.get('reuse'):
            assert item['path'] in by_path
            assert by_path[item['path']]['status'] == 'visually_reviewed'
            assert sha(target) == item['sha256'] == by_path[item['path']]['sha256']
        else:
            assert item['path'].startswith('/lib/images/tcf/catalogue/')
            assert not target.exists() and item['path'] not in by_path
            assert not any(r['id'] == item['id'] for r in manifest['images'])
            with Image.open(item['source_png']) as source:
                assert source.width * 3 == source.height * 4, item['id']
        if item.get('original'):
            assert sha(ROOT / 'public' / item['original'].lstrip('/')) == item['original_sha256']
    for item in items:
        target = ROOT / 'public' / item['path'].lstrip('/')
        if not item.get('reuse'):
            target.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', item['source_png'],
                            '-c:v', 'libwebp', '-quality', '90', '-compression_level', '6',
                            '-frames:v', '1', str(target)], check=True)
            with Image.open(target) as image:
                width, height = image.size
            refs = item['style_references']
            entry = dict(id=item['id'], label=item['label'], path=item['path'],
                         status='visually_reviewed', domain='catalogue', batch='catalogue-20261113',
                         gallery_types=[item['type']], width=width, height=height, aspect_ratio='4:3',
                         bytes=target.stat().st_size, sha256=sha(target), source_png=item['source_png'],
                         source_sha256=sha(Path(item['source_png'])), prompt=item['prompt'],
                         reference_images=item['reference_images'], style_references=refs,
                         style_reference_commit=STYLE_COMMIT,
                         style_review=dict(status='aligned', reference_commit=STYLE_COMMIT, references=refs),
                         review_note=item['review_note'])
            manifest['images'].append(entry)
            by_path[item['path']] = entry
        proof = by_path[item['path']]
        previous = next((r for r in classification['images'] if r['path'] == item['path']), None)
        types = list(dict.fromkeys((previous or {}).get('types', []) + [item['type']]))
        row = dict(path=item['path'], label=item['label'], types=types,
                   themes=list(dict.fromkeys((previous or {}).get('themes', []) +
                                             [item['type'], item['subtype'], 'Style TCF validé'])),
                   sha256=proof['sha256'], review_note=item['review_note'])
        classification['images'] = [r for r in classification['images'] if r['path'] != item['path']] + [row]
        if item.get('original'):
            original = item['original']
            classification['replacements'] = [r for r in classification['replacements'] if r['original'] != original]
            classification['replacements'].append(dict(original=original, path=item['path'],
                                                        original_sha256=item['original_sha256'],
                                                        sha256=proof['sha256']))
        metadata = ROOT / 'docs/gallery/generation-20261113' / (item['id'] + '.json')
        metadata.parent.mkdir(parents=True, exist_ok=True)
        metadata.write_text(json.dumps(dict(item, sha256=proof['sha256']), ensure_ascii=False, indent=2) + '\n')
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    CLASSIFICATION.write_text(json.dumps(classification, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(items)} illustrations contrôlées intégrées au catalogue.')


if __name__ == '__main__':
    register(json.loads(Path(sys.argv[1]).read_text()))

"""Conserve une nouvelle image et publie les suites CSC uniquement lorsqu'elles sont complètes."""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'public/lib/images/tcf/po/illustrations-manifest.json'


def disk(path):
    assert path.startswith('/lib/images/tcf/po/') and '..' not in Path(path).parts
    return ROOT / ('public' + path)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(manifest):
    manifest['counts'] = dict(Counter(row['status'] for row in manifest['images']))
    manifest['status'] = 'complete' if manifest['counts'].get('generated') == len(manifest['images']) else 'partial'
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')


def publish(manifest):
    groups = defaultdict(list)
    for row in manifest['images']:
        groups[(row['level'], row['series'])].append(row)
    ready = []
    for (level, _), rows in groups.items():
        if not all(row['status'] == 'prepared' and row.get('prepared_visual_reviewed') for row in rows):
            continue
        assert len(rows) == (4 if level == 'a1' else 1)
        if level == 'a1':
            assert {row['step'] for row in rows} == {1, 2, 3, 4}
            assert len({row['casting'] for row in rows}) == 1
        for row in rows:
            assert digest(disk(row['prepared_path'])) == row['prepared_sha256']
        ready.extend(rows)
    # Validate every candidate before replacing any of the active files.
    for row in ready:
        disk(row['prepared_path']).replace(disk(row['path']))
        row.update(status='generated', visual_reviewed=True, sha256=row['prepared_sha256'],
                   width=row['prepared_width'], height=row['prepared_height'])
        if row['level'] == 'a1':
            row['sequence_reviewed'] = True
        for key in list(row):
            if key.startswith('prepared_'):
                del row[key]
    cfr = {row['exercise']: row for row in ready if row['level'] == 'a2'}
    if cfr:
        path = ROOT / 'src/tcf/content/a1-a2/po.json'
        bank = json.loads(path.read_text())
        for exercise in bank:
            if exercise['id'] not in cfr:
                continue
            support = exercise['support']
            support['description_modele'] = cfr[exercise['id']]['story']
            if exercise['id'] == 'tcf-a1a2-po-img-rendez-vous':
                support['questions'] = [question.replace(
                    'Qu’est-ce que la femme dans le cercle fait ?',
                    'Quels objets peut-elle utiliser pour noter son rendez-vous ?',
                ) for question in support['questions']]
        path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + '\n')
    save(manifest)
    print(f'{len(ready)} nouvelles images publiées ; {manifest["counts"]}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    stage = commands.add_parser('stage')
    stage.add_argument('key')
    stage.add_argument('source', type=Path)
    review = commands.add_parser('review')
    review.add_argument('keys', nargs='+')
    commands.add_parser('publish')
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text())
    by_key = {row['key']: row for row in manifest['images']}
    if args.command == 'publish':
        publish(manifest)
        return
    if args.command == 'review':
        rows = [by_key[key] for key in args.keys]
        assert all(row['status'] == 'prepared' for row in rows)
        for row in rows:
            assert digest(disk(row['prepared_path'])) == row['prepared_sha256']
            row['prepared_visual_reviewed'] = True
        save(manifest)
        print(f'{len(rows)} nouvelles images marquées comme relues')
        return
    from PIL import Image
    row = by_key[args.key]
    assert row['status'] in ('pending', 'prepared'), 'Image déjà publiée'
    prepared = row['path'].replace(f'/po/{row["level"]}/', f'/po/pending/{row["level"]}/')
    target = disk(prepared)
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(args.source) as image:
        assert image.width >= 1200 and image.width > image.height, 'Image horizontale de grand format requise'
        image.convert('RGB').save(target, 'WEBP', quality=91, method=6)
        row.update(prepared_width=image.width, prepared_height=image.height)
    assert digest(target) != row['original_sha256'], 'Une nouvelle génération est requise'
    row.update(status='prepared', prepared_path=prepared, prepared_sha256=digest(target),
               prepared_visual_reviewed=False)
    save(manifest)
    print(f'{args.key} conservée dans {prepared}, contrôle visuel requis avant publication')


if __name__ == '__main__':
    main()

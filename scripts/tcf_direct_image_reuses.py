"""Apply explicitly reviewed source replacements to object banks and supports.

Question choices are handled by tcf_replace_vocabulary_images.py so their full
answer labels and context are checked separately. Originals stay untouched.
"""
import argparse
import hashlib
import json
from pathlib import Path

from tcf_replace_vocabulary_images import BANKS, PLAN, ROOT, checked_images, vocabulary_paths


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    plan = json.loads(PLAN.read_text())
    checked = checked_images(json.loads((ROOT / 'docs/tcf/images-generees.json').read_text()))
    mappings = {r['source']: r for r in plan.get('approved_direct_reuses', [])}
    changes = []
    for bank in BANKS:
        data = json.loads(bank.read_text())
        dirty = False
        for exercise in data:
            for node, source in list(vocabulary_paths(exercise)):
                if node[0] == 'questions' or source not in mappings:
                    continue
                row = mappings[source]
                target = row['target']
                assert target in checked, target
                assert row['review_note'].strip(), source
                assert hashlib.sha256((ROOT / 'public' / source.lstrip('/')).read_bytes()).hexdigest() == row['source_sha256']
                if node[0] == 'images':
                    # Recognition banks must keep five distinct choices.
                    others = [r['image'] for i, r in enumerate(exercise['images']) if i != node[1]]
                    if target in others:
                        continue
                parent = exercise
                for key in node[:-1]:
                    parent = parent[key]
                parent[node[-1]] = target
                changes.append(dict(bank=str(bank.relative_to(ROOT)), exercise=exercise['id'],
                                    node=list(node), before=source, after=target,
                                    review_note=row['review_note']))
                dirty = True
        if args.apply and dirty:
            bank.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    if args.apply:
        plan.setdefault('direct_replacements', []).extend(changes)
        PLAN.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(applied=args.apply, replaced_occurrences=len(changes)), ensure_ascii=False))


if __name__ == '__main__':
    main()

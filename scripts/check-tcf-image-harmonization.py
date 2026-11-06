"""Verify and report the image-only migration against a saved Git baseline."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import subprocess

from tcf_replace_vocabulary_images import BANKS, ROOT, checked_images, vocabulary_paths


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--baseline', default='HEAD')
    parser.add_argument('--write-report', type=Path)
    args = parser.parse_args()
    baseline = subprocess.check_output(['git', 'rev-parse', args.baseline], cwd=ROOT, text=True).strip()
    reviewed = checked_images(json.loads((ROOT / 'docs/tcf/images-generees.json').read_text()))
    changes, remaining, original_counts = [], [], Counter()

    def compare(before, after, bank, exercise, node=()):
        if before == after:
            return
        if isinstance(before, dict) and isinstance(after, dict):
            assert before.keys() == after.keys(), (exercise, node)
            for key in before:
                compare(before[key], after[key], bank, exercise, node + (key,))
        elif isinstance(before, list) and isinstance(after, list):
            assert len(before) == len(after), (exercise, node)
            for i, (old, new) in enumerate(zip(before, after)):
                compare(old, new, bank, exercise, node + (i,))
        else:
            assert node[-1] == 'image', (exercise, node)
            assert isinstance(before, str) and before.startswith('/lib/images/'), (exercise, node)
            assert after in reviewed, (exercise, after)
            old_file = ROOT / 'public' / before.lstrip('/')
            old_bytes = subprocess.check_output(['git', 'show', f'{baseline}:public{before}'], cwd=ROOT)
            assert old_file.read_bytes() == old_bytes, before
            changes.append(dict(bank=bank, exercise=exercise, node=list(node), before=before, after=after,
                                source_sha256=hashlib.sha256(old_bytes).hexdigest(),
                                target_sha256=reviewed[after]['sha256']))

    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        before = json.loads(subprocess.check_output(['git', 'show', f'{baseline}:{relative}'], cwd=ROOT, text=True))
        after = json.loads(bank.read_text())
        assert [e['id'] for e in before] == [e['id'] for e in after], relative
        for old, new in zip(before, after):
            original_counts.update(path for _, path in vocabulary_paths(old))
            compare(old, new, relative, old['id'])
            for node, path in vocabulary_paths(new):
                remaining.append(dict(bank=relative, exercise=new['id'], node=list(node), image=path))
            if new.get('type_exercice') == 'images_a_reconnaitre':
                assert len(new['images']) == len({r['image'] for r in new['images']}), new['id']
    counts = Counter(r['image'] for r in remaining)
    targets = {r['after'] for r in changes}
    generated = {path for path, row in reviewed.items() if row.get('batch') == 'reprise-20261106-objets-inclus'}
    report = dict(date='2026-11-06', baseline_commit=baseline,
                  scope='CE/CO et banques OBJET, demande utilisateur du 6 novembre 2026',
                  summary=dict(initial_vocabulary_usages=sum(original_counts.values()),
                               replaced_vocabulary_usages=sum(r['before'].startswith('/lib/images/vocabulaire/') for r in changes),
                               total_changed_image_usages=len(changes),
                               object_bank_main_images=sum(r['node'][0] == 'images' for r in changes),
                               new_images_generated_and_reviewed=len(generated),
                               new_images_used=len(targets & generated),
                               existing_reviewed_images_reused=len(targets - generated),
                               usages_using_new_images=sum(r['after'] in generated for r in changes),
                               remaining_vocabulary_usages=len(remaining),
                               remaining_distinct_vocabulary_images=len(counts)),
                  invariants='Seuls les champs image changent ; questions, choix, réponses, ids, transcriptions et audios identiques au commit de référence. Tous les originaux conservés à l’octet près. Nouvelles cibles relues et vérifiées par empreinte en 4:3.',
                  replacements=changes, remaining_uses=remaining)
    if args.write_report:
        args.write_report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report['summary'], ensure_ascii=False))


if __name__ == '__main__':
    main()

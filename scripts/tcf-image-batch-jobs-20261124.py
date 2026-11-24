"""Print only pending image jobs whose actual seed has passed visual review."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('packet', type=Path)
parser.add_argument('--count', type=int, default=6)
parser.add_argument('--ids', nargs='*')
args = parser.parse_args()
packet = json.loads(args.packet.read_text())
jobs = {row['id']: row for row in packet['jobs']}
result = []
for row in jobs.values():
    if row['status'] != 'pending_generation' or (args.ids and row['id'] not in args.ids):
        continue
    refs = list(row['refs'])
    if row.get('seed'):
        seed = jobs[row['seed']]
        if seed['status'] != 'visually_reviewed':
            continue
        refs.insert(0, seed['source'])
    refs = [str(ROOT / 'public' / path.lstrip('/')) if path.startswith('/lib/') else str(ROOT / path) for path in refs]
    assert refs and all(Path(path).is_file() for path in refs)
    result.append(dict(row, refs=refs))
    if len(result) == args.count:
        break
print(json.dumps(result, ensure_ascii=False, indent=2))

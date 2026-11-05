#!/usr/bin/env python3
"""Verify installed audio bytes, linked edits and grammar source preservation."""
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    folder = ROOT / 'docs/tcf/remplacement-audio'
    durations = read(ROOT / 'src/tcf/content/audio-durations.json')
    pools = read(ROOT / 'src/tcf/content/co-reviewed-pools.json')
    banks = {str(p.relative_to(ROOT)): read(p)
             for p in (ROOT / 'src/tcf/content').glob('*/co.json')}
    paths = set()
    for name in ('complement-60-co-20261105.json',
                 'corrections-7-divergences-20261105.json'):
        report = read(folder / name)
        assert report['summary']['human_listening_performed'] is False
        for row in report['audio_changes']:
            ref = row['path']
            assert ref not in paths, ref
            paths.add(ref)
            assert sha(ROOT / 'public' / ref.lstrip('/')) == row['after_sha256'], ref
            seconds = float(subprocess.check_output([
                'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                '-of', 'default=nw=1:nk=1', str(ROOT / 'public' / ref.lstrip('/'))]))
            assert abs(seconds - durations[ref]) < .01, ref
            category = 'court' if seconds <= 15 else 'moyen' if seconds <= 45 else 'long'
            assert pools[ref]['tag'] == category == row['category'], ref
        for change in report['exercise_changes']:
            current = next(e for e in banks[change['bank']]
                           if e['id'] == change['exercise'])
            assert current == change['after'], change['exercise']
    grammar = read(ROOT / 'src/grammaire/exercises/co-bank.json')
    records = read(ROOT / 'docs/grammaire/co-import/transcriptions.json')['transcriptions']
    refinement = read(ROOT / 'docs/grammaire/co-import/revue-34-points-20261105.json')
    assert len(refinement['reviews']) == 34
    for row in refinement['reviews']:
        entry = next(e for e in grammar if e['exercise']['id'] == row['exercise_id'])
        record = next(r for r in records if r['exercise_id'] == row['exercise_id'])
        assert sha(ROOT / 'public' / row['audio'].lstrip('/')) == row['source_sha256']
        assert entry['exercise']['support']['transcription'] == record['selected_text'] == row['after_text']
        assert row['human_listening_performed'] is False
        if row['source_limitations']:
            assert 'numéro incomplet dans le fichier reçu' in row['after_text']
    print(f'{len(paths)} audio files verified; 34 grammar refinements bound to unchanged originals.')


if __name__ == '__main__':
    main()

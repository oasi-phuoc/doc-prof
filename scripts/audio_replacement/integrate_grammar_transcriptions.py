#!/usr/bin/env python3
"""Integrate explicitly reviewed A2 recognitions, preserving A1 and original audio."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from datetime import datetime, timezone


def read(path):
    return json.loads(Path(path).read_text())


def write(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def recognition_index(folder):
    return {r['source_sha256']: r for p in folder.glob('*.json')
            if (r := read(p)).get('status') == 'transcribed'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    repo, work = args.repo, args.work
    bank_path = repo / 'src/grammaire/exercises/co-bank.json'
    source_path = repo / 'docs/grammaire/co-import/sources.json'
    report_path = repo / 'docs/grammaire/co-import/transcriptions.json'
    bank, sources, report = read(bank_path), read(source_path), read(report_path)
    decisions = read(work / 'decisions.json')
    parakeet, whisper = recognition_index(work / 'parakeet'), recognition_index(work / 'whisper-fr')
    supplementary = recognition_index(work / 'whisper-timestamps')
    a1_before = [e for e in bank if e['level'] == 'A1']
    source_by_id = {s['exercise_id']: s for s in sources['sources']}
    records, blockers = [], []
    for entry in bank:
        if entry['level'] != 'A2':
            continue
        ident, digest = entry['exercise']['id'], entry['source']['sha256']
        decision = decisions.get(ident)
        if not decision or decision.get('reviewed') is not True or digest not in parakeet or digest not in whisper:
            blockers.append(ident)
            continue
        a, b = parakeet[digest], whisper[digest]
        audio = entry['exercise']['support']['audio']
        assert hashlib.sha256((repo / 'public' / audio.lstrip('/')).read_bytes()).hexdigest() == digest, ident
        assert source_by_id[ident]['sha256'] == digest and '/a2/' in audio, ident
        reading = decision['reading']
        assert reading in ('parakeet', 'whisper_fr'), ident
        text = a['text'] if reading == 'parakeet' else b['text']
        if decision.get('restore_header'):
            header = re.match(r'^(Page\s+\d+[.,]?\s*Exercice\s+\d+[. ]*)', a['text'], re.I)
            assert header, ident
            if not re.match(r'^page\b', text, re.I):
                text = header.group().rstrip(' .') + '.\n' + text
        corrections = []
        for old, new in decision.get('patches', []):
            assert old in text, (ident, old)
            text = text.replace(old, new)
            corrections.append(dict(before=old, after=new))
        text = re.sub(r'^(page)\b', 'Page', text)
        text = re.sub(r'(Document A)\.?\s*', r'\1.\n', text, count=1)
        text = re.sub(r'^(Page\s+\d+)[,. ]+(Exercice\s+\d+)[. ]*', r'\1. \2.\n', text, flags=re.I)
        assert text.strip() and entry['exercise']['questions'] == [], ident
        records.append(dict(exercise_id=ident, level='A2', source_sha256=digest, audio=audio,
                            selected_text=text.strip(), reading='editorial', selected_recognition=reading,
                            review_note=decision['note'], unresolved_points=decision.get('unresolved', []),
                            corrections=corrections, parakeet_text=a['text'], whisper_french_text=b['text'],
                            duration_seconds=a['duration_seconds'], human_listening_performed=False,
                            supplementary_whisper_timestamps_text=supplementary.get(digest, {}).get('text')))
    summary = dict(expected_a2=sources['a2_sources'], reviewed_a2=len(records), blockers=blockers,
                   audio_files_modified=0, a1_entries_modified=0, human_listening_performed=False)
    write(work / 'integration-plan.json', summary)
    print(json.dumps(summary, ensure_ascii=False))
    if not args.apply:
        return
    if blockers or len(records) != sources['a2_sources']:
        raise SystemExit('Complete and review all A2 recordings before integration.')
    selected = {row['exercise_id']: row for row in records}
    for entry in bank:
        if entry['level'] != 'A2':
            continue
        row = selected[entry['exercise']['id']]
        entry['exercise']['support']['transcription'] = row['selected_text']
        entry['status'] = 'transcribed'
        entry['transcriptionReview'] = dict(status='automatic_cross_check_and_text_review',
                                          sourceSha256=row['source_sha256'], reading='editorial', humanListening=False)
        source_by_id[row['exercise_id']]['transcription_status'] = 'transcribed_cross_checked_draft'
    assert a1_before == [e for e in bank if e['level'] == 'A1']
    now = datetime.now(timezone.utc).isoformat()
    report['transcriptions'] = [r for r in report['transcriptions'] if r['exercise_id'] not in selected] + records
    report['a2_parameters'] = dict(primary=next(iter(parakeet.values()))['parameters'],
                                   secondary=next(iter(whisper.values()))['parameters'], integrated_at=now,
                                   supplementary=next(iter(supplementary.values()))['parameters'] if supplementary else None,
                                   supplementary_recordings=len(supplementary))
    report['summary'].update(recordings=len(bank), transcripts_integrated=len(report['transcriptions']),
                             a1_recordings=sources['a1_sources'], a2_recordings=sources['a2_sources'],
                             entries_with_unresolved_points=sum(bool(r['unresolved_points']) for r in report['transcriptions']))
    sources['transcribed_sources'] = len(bank)
    sources['status'] = 'original_audio_transcribed_cross_checked'
    sources['transcriptions_and_questions'] = 'Transcriptions A1 et A2 intégrées et recoupées ; questions CO non ajoutées.'
    write(bank_path, bank)
    write(source_path, sources)
    write(report_path, report)


if __name__ == '__main__':
    main()

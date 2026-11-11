#!/usr/bin/env python3
"""Publish reproducible evidence and unresolved work for the full audio switch."""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import re


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[2])
    args = parser.parse_args()
    work, repo = args.work, args.repo
    output = repo / 'docs/tcf/remplacement-audio'
    ledger = read(output / 'bascule-complete-20261105.json')
    installed = {r['ref']: r for r in ledger['installed']}
    inventory = read(work / 'active-inventory.json')
    queue = {r['ref']: r for r in read(work / 'review-queue.json')}
    checks = read(work / 'technical-checks.json')
    decisions = read(work / 'editorial-decisions.json')
    readiness = read(work / 'readiness.json')
    states = {r['ref']: r for r in readiness['rows']}
    recognitions = {}
    for digest, engines in read(work / 'existing-recognitions.json').items():
        recognitions[digest] = {engine: Path(path) for engine, path in engines.items()}
    for engine in ('parakeet', 'whisper', 'ctc'):
        for path in (work / engine).glob('*.json'):
            data = read(path)
            if data.get('status') == 'transcribed' or (engine == 'ctc' and data.get('engine') and data.get('source_sha256') and isinstance(data.get('text'), str)):
                recognitions.setdefault(data['source_sha256'], {})[engine] = path
    evidence = {}
    pending = []
    for item in inventory:
        ref = item['ref']
        current = hashlib.sha256((repo / 'public' / ref.lstrip('/')).read_bytes()).hexdigest()
        expected = installed[ref]['candidate_sha256'] if ref in installed else item['current_sha256']
        assert current == expected, ('Unexpected production audio bytes', ref)
        if item['status'] == 'installed_previously_reviewed':
            continue
        digest = item['proposal']['candidate_sha256']
        records = {}
        for engine, path in recognitions.get(digest, {}).items():
            data = read(path)
            assert data['source_sha256'] == digest
            records[engine] = dict(
                file_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                source_sha256=digest, text=data['text'],
                parameters=data.get('parameters') or dict(engine=data.get('engine'), model_sha256=data.get('model_sha256')),
                provenance=data.get('provenance'))
        evidence[digest] = records
        if ref in installed:
            continue
        state, technical = states[ref], checks[digest]
        reasons = []
        if len(state['recognitions']) < 2:
            reasons.append('second_final_file_recognition_pending')
        if not (technical.get('boundary_signal', {}).get('safe_quiet_margins')
                or technical.get('boundary_vad', {}).get('safe_voiced_margins')):
            reasons.append('source_boundary_review_required')
        if not state['coverage_sufficient']:
            reasons.append('question_pool_below_minimum')
        reasons.extend(state['manual_flags'])
        if not state['exact_triple_transcript'] and ref not in decisions:
            reasons.append('editorial_transcript_and_question_review_required')
        if state['automatic_equivalence_ready'] or state['manual_review_ready']:
            reasons.append('checked_waiting_installation')
        pending.append(dict(ref=ref, source_id=item['proposal']['source_id'],
                            candidate_sha256=digest, reasons=reasons,
                            editorial_decision=decisions.get(ref),
                            exercises=[c['exercise'] for c in queue[ref]['contexts']]))
    write(output / 'bascule-preuves-reconnaissances-20261105.json', dict(
        human_listening_performed=False, candidates=evidence))
    write(output / 'bascule-restant-20261105.json', dict(
        summary=dict(remaining_references=len(pending),
                     reasons=dict(collections.Counter(r for p in pending for r in p['reasons'])),
                     recognition_progress=readiness['summary']),
        human_listening_performed=False, items=pending))
    summary = ledger['summary']
    assert len(pending) == summary['remaining_references']
    final_review = []
    for ref, record in installed.items():
        state = states[ref]
        deferred = record.get('final_transcript_review_pending', False)
        recheck = bool(state['editorial_decision_present'] and not state['manual_review_ready'])
        if deferred or recheck:
            final_review.append(dict(ref=ref, source_id=record['source_id'],
                                     candidate_sha256=record['candidate_sha256'],
                                     priority='deferred_final_transcript_validation' if deferred else 'targeted_recheck_with_latest_recognitions',
                                     reasons=state.get('manual_flags', []),
                                     exercises=[c['exercise'] for c in queue[ref]['contexts']]))
    write(output / 'bascule-relecture-finale-20261111.json', dict(
        audio_switch_complete=summary['full_switch_complete'],
        final_validation_complete=False, human_listening_performed=False,
        final_check_scope='All 1025 active audio references; priority list does not replace the complete final check with supplied transcripts.',
        total_active_references=1025,
        deferred_transcript_validations=sum(bool(r.get('final_transcript_review_pending')) for r in installed.values()),
        priority_items=final_review))
    progression_path = output / 'progression-unifiee.json'
    progression = read(progression_path)
    progression['audio_replacements_applied'] = summary['total_installed']
    progression['audio_switch_complete'] = summary['full_switch_complete']
    progression['final_validation_complete'] = False
    progression['final_transcript_reviews_pending'] = summary.get('final_transcript_reviews_pending', 0)
    progression['full_switch_progress'].update(
        installed_in_current_switch=summary['installed_this_switch'],
        remaining=summary['remaining_references'],
        pending_report='bascule-restant-20261105.json',
        recognition_evidence='bascule-preuves-reconnaissances-20261105.json')
    write(progression_path, progression)
    total, current, remaining = (summary['total_installed'],
                                 summary['installed_this_switch'],
                                 summary['remaining_references'])
    readme = output / 'README.md'
    text = readme.read_text()
    text = re.sub(r'atteint \d+ fichiers installés sur 1 025, dont \d+ dans la reprise actuelle ; \d+ références',
                  f'atteint {total} fichiers installés sur 1 025, dont {current} dans la reprise actuelle ; {remaining} références', text)
    readme.write_text(text)
    progress_note = repo / 'docs/tcf/avancement-images.md'
    text = progress_note.read_text()
    text = re.sub(r'\*\*\d+ fichiers installés sur 1 025\*\*, dont \d+ dans la reprise actuelle ; \*\*\d+ références restent à traiter\*\*',
                  f'**{total} fichiers installés sur 1 025**, dont {current} dans la reprise actuelle ; **{remaining} références restent à traiter**', text)
    text = re.sub(r'détail des \d+ références restantes', f'détail des {remaining} références restantes', text)
    text = re.sub(r'\*\*\d+ fichiers sur 1 025 sont maintenant remplacés\*\*, avec leurs transcriptions et corrections associées ; \d+ restent à traiter',
                  f'**{total} fichiers sur 1 025 sont maintenant remplacés**, avec leurs transcriptions et corrections associées ; {remaining} restent à traiter', text)
    progress_note.write_text(text)
    print(json.dumps(summary))


if __name__ == '__main__':
    main()

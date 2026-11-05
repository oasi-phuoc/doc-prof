#!/usr/bin/env python3
"""Install only hash-bound, checked cuts; retain the existing production URLs."""
import argparse
import copy
import hashlib
import json
from pathlib import Path
import shutil
import subprocess


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, required=True)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument('--limit', type=int, default=50)
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    repo, work = args.repo, args.work
    inventory = {r['ref']: r for r in read(work / 'active-inventory.json')}
    queue = {r['ref']: r for r in read(work / 'review-queue.json')}
    inputs = read(work / 'candidate-inputs.json')
    checks = read(work / 'technical-checks.json')
    readiness = read(work / 'readiness.json')
    decisions = read(work / 'editorial-decisions.json')
    destination = repo / 'docs/tcf/remplacement-audio/bascule-complete-20261105.json'
    ledger = read(destination) if destination.exists() else dict(
        schema_version=1, initially_installed=80, target_active_references=1025,
        original_pending_references=945, installed=[], batches=[],
        human_listening_performed=False, live_database_migrated=False,
        production_folder='/lib/audio/tcf/co/',
        policy='Existing exercise IDs and audio URLs retained. Received sources '
               'and git rollback objects preserved. Unchecked candidates are not installed.')
    done = {r['ref'] for r in ledger['installed']}
    eligible = [r for r in readiness['rows'] if r['ref'] not in done
                and (r['automatic_equivalence_ready'] or r['manual_review_ready'])]
    selected = eligible[:args.limit]
    print(json.dumps(dict(ready=len(eligible), selected=len(selected), apply=args.apply)))
    if not args.apply or not selected:
        return
    banks = {str(p.relative_to(repo)): read(p)
             for p in (repo / 'src/tcf/content').glob('*/co.json')}
    before = copy.deepcopy(banks)
    duration_path = repo / 'src/tcf/content/audio-durations.json'
    pool_path = repo / 'src/tcf/content/co-reviewed-pools.json'
    durations, pools = read(duration_path), read(pool_path)
    records, prepared = [], []
    for state in selected:
        ref = state['ref']
        assert ref.startswith('/lib/audio/tcf/co/') and '..' not in Path(ref).parts
        item, plan = inventory[ref], queue[ref]
        digest = item['proposal']['candidate_sha256']
        source, target = Path(inputs[digest]['source_file']), repo / 'public' / ref.lstrip('/')
        assert sha(source) == digest and sha(target) == item['current_sha256'], ref
        assert checks[digest]['status'] == 'technical_integrity_passed'
        # Background music can mask RMS silence. Speech VAD is supplementary
        # evidence alongside source provenance and two full-file recognitions.
        assert (checks[digest].get('boundary_signal', {}).get('safe_quiet_margins') is True
                or checks[digest].get('boundary_vad', {}).get('safe_voiced_margins') is True)
        manual = decisions.get(ref) if state['manual_review_ready'] else None
        edits = []
        for context in plan['contexts']:
            exercise = next(e for e in banks[context['bank']] if e['id'] == context['exercise'])
            support = exercise['support']
            ai = context['audio']
            current = support['transcription'][ai - 1] if isinstance(support['transcription'], list) else support['transcription']
            assert current == context['transcription'], (ref, exercise['id'])
            text = manual['selected_text'] if manual else current
            if isinstance(support['transcription'], list):
                support['transcription'][ai - 1] = text
            else:
                support['transcription'] = text
            if manual:
                exercise.update(manual.get('exercise_metadata', {}).get(exercise['id'], {}))
                for change in manual.get('question_changes', []):
                    if change['exercise'] != exercise['id']:
                        continue
                    question = exercise['questions'][change['question'] - 1]
                    old_question = copy.deepcopy(question)
                    if 'enonce' in change:
                        question['enonce'] = change['enonce']
                    if 'correct_answer' in change:
                        form = question if question['type_reponse'] == 'qcm_texte' else question['formes']['qcm_texte']
                        answer = next(c for c in form['choix'] if c.get('correct'))
                        answer['texte'] = change['correct_answer']
                        lines = question if question['type_reponse'] == 'lignes' else question.get('formes', {}).get('lignes')
                        if lines:
                            lines['reponse_modele'] = change['correct_answer']
                        if question['type_reponse'] == 'qcm_image':
                            question['type_reponse'] = 'qcm_texte'
                            question['choix'] = copy.deepcopy(form['choix'])
                            question['formes'].pop('qcm_texte', None)
                        question.get('formes', {}).pop('qcm_image', None)
                    edits.append(dict(exercise=exercise['id'], question=change['question'],
                                      before=old_question, after=copy.deepcopy(question)))
            scoped = [q for q in exercise['questions']
                      if not support.get('audios') or q.get('audio') == ai]
            minimum = dict(court=2, moyen=4, long=8)[checks[digest]['category']]
            assert len(scoped) >= minimum, (ref, len(scoped), minimum)
        # Write the pre-replacement bytes into Git's object database for rollback.
        blob = subprocess.check_output(['git', 'hash-object', '-w', str(target)],
                                       cwd=repo, text=True).strip()
        records.append(dict(ref=ref, previous_sha256=item['current_sha256'],
                            candidate_sha256=digest, rollback_git_blob=blob,
                            source_id=item['proposal']['source_id'],
                            source_sha256=item['proposal']['source_sha256'],
                            technical_check=checks[digest],
                            validation='editorial_review_and_two_final_file_recognitions' if manual
                                       else 'unchanged_text_and_two_exact_final_file_recognitions',
                            editorial_reason=manual['reason'] if manual else None,
                            previous_duration=durations.get(ref), previous_pool=pools.get(ref),
                            question_changes=edits, human_listening_performed=False))
        prepared.append((source, target))
        durations[ref] = round(checks[digest]['duration'], 3)
        count = max(len(c['questions']) for c in plan['contexts'])
        pools[ref] = dict(tag=checks[digest]['category'], questions=count)
    changes = []
    for name, content in banks.items():
        previous = {e['id']: e for e in before[name]}
        for entry in content:
            if previous[entry['id']] != entry:
                changes.append(dict(bank=name, exercise=entry['id'],
                                    before=previous[entry['id']], after=entry))
    batch_number = len(ledger['batches']) + 1
    batch_path = destination.parent / f'bascule-lot-{batch_number:03d}-20261105.json'
    assert not batch_path.exists()
    # Journal complete and reviewable before replacing any production bytes.
    write(batch_path, dict(batch=batch_number, audio_replacements=records,
                           exercise_changes=changes, status='prepared',
                           received_originals_modified=0, human_listening_performed=False))
    for source, target in prepared:
        shutil.copyfile(source, target)
    for name, content in banks.items():
        if content != before[name]:
            write(repo / name, content)
    write(duration_path, durations)
    write(pool_path, pools)
    batch = read(batch_path)
    batch['status'] = 'installed'
    write(batch_path, batch)
    ledger['installed'].extend(records)
    ledger['batches'].append(dict(batch=batch_number, report=batch_path.name, files=len(records)))
    ledger['summary'] = dict(installed_before_this_switch=80,
                             installed_this_switch=len(ledger['installed']),
                             total_installed=80 + len(ledger['installed']),
                             remaining_references=945 - len(ledger['installed']),
                             active_library_references=1025,
                             full_switch_complete=len(ledger['installed']) == 945)
    write(destination, ledger)
    print(json.dumps(ledger['summary']))


if __name__ == '__main__':
    main()

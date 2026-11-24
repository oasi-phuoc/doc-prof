"""Activate one complete source-bound packet; preserve editable JSON fragments."""
import argparse
from collections import Counter
from copy import deepcopy
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from audio_replacement.editorial_json import loads as editorial_loads
from tcf_context_audit import BANKS, digest, semantic_question, source_for, text_form


def module(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / filename)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('packet', type=Path)
    parser.add_argument('--historical', action='store_true')
    args = parser.parse_args()
    path = args.packet.resolve()
    packet = read(path)
    assert packet['summary']['activated_trios'] == 0
    assert not packet['remaining_asset_ids']
    sources = {row['key']: row for row in packet['selected_questions']}
    count = packet['summary']['target_trios']
    assert len(sources) == len(packet['planned_choices']) == len(packet['trio_review_notes']) == count
    manifest = {row['path']: row for row in read(ROOT / 'docs/tcf/images-generees.json')['images']}
    module('publish_batch', 'publish-tcf-image-batch-20261124.py').refresh(packet, manifest)
    assert len(packet['ready_trios']) == count
    ready = {row['key']: row for row in packet['ready_trios']}
    targets = {row['key']: row for row in packet['planned_choices']}
    register_path = path.with_name(path.stem.replace('-preparation', '-activation') + '.json')
    register = str(register_path.relative_to(ROOT))
    assert not register_path.exists()
    baseline = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    render = module('image_form_insertion', 'activate-delf-actif-lot2-20261123.py').add_forms_preserving_source
    banks, proofs, bank_sha = {}, [], {}
    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        original = bank.read_text()
        # Each completed packet is committed before another packet is activated.
        assert bank.read_bytes() == subprocess.check_output(['git', 'show', baseline + ':' + relative], cwd=ROOT)
        bank_sha[relative] = sha(bank)
        forms = {}
        for exercise in editorial_loads(original):
            for index, question in enumerate(exercise.get('questions', []), 1):
                key = f"{exercise['id']}#{index}"
                if key not in sources:
                    continue
                snapshot = sources[key]
                source, audio = source_for(exercise, question)
                assert question == snapshot['question_snapshot']
                assert digest(source) == snapshot['source_sha256']
                assert digest(semantic_question(question)) == snapshot['semantic_sha256']
                assert audio == snapshot['audio']
                if audio:
                    assert sha(ROOT / 'public' / audio.lstrip('/')) == snapshot['audio_sha256']
                assert not question.get('formes', {}).get('qcm_image')
                target, review = targets[key], ready[key]
                assert [c['texte'] for c in text_form(question)['choix']] == target['labels']
                image_form = review['preview_image_form']
                assert len(image_form['choix']) == len(set(target['paths'])) == 3
                assert [(c['id'], bool(c.get('correct'))) for c in image_form['choix']] == [
                    (c['id'], bool(c.get('correct'))) for c in text_form(question)['choix']]
                for image in target['paths']:
                    assert manifest[image]['status'] == 'visually_reviewed'
                    assert manifest[image].get('qcm_approval') != 'rejected_by_user', image
                    assert sha(ROOT / 'public' / image.lstrip('/')) == manifest[image]['sha256']
                forms[key] = image_form
                proofs.append(dict(key=key, bank=relative, level=exercise['niveau'], source=source,
                    source_sha256=snapshot['source_sha256'], semantic_sha256=snapshot['semantic_sha256'],
                    question=semantic_question(question), audio=audio, audio_sha256=snapshot['audio_sha256'],
                    image_ids=[manifest[image]['id'] for image in target['paths']], image_paths=target['paths'],
                    image_sha256=[manifest[image]['sha256'] for image in target['paths']],
                    reason='Trois réponses complètes relues avec le support actif et les illustrations.',
                    visual_review=review['visual_review'], change_kind='added_image_form',
                    before_image_form=None, after_image_form=deepcopy(image_form)))
        if forms:
            rendered = render(original, forms)
            restored = json.loads(rendered)
            for exercise in restored:
                for index, question in enumerate(exercise.get('questions', []), 1):
                    key = f"{exercise['id']}#{index}"
                    if key not in forms:
                        continue
                    question['formes'].pop('qcm_image')
                    if not question['formes'] and 'formes' not in sources[key]['question_snapshot']:
                        question.pop('formes')
            assert restored == json.loads(original), relative + ': non-image content changed'
            banks[bank] = rendered
    assert len(proofs) == count
    metadata = []
    if args.historical:
        from tcf_context_images import PLAN, JOURNAL
        ledger_path = ROOT / 'docs/tcf/revue-763-20261107.json'
        ledger, plan, journal = read(ledger_path), read(PLAN), read(JOURNAL)
        rows = {row['key']: row for row in ledger['questions']}
        planned = {row['key']: row for row in plan['questions']}
        for proof in proofs:
            key = proof['key']
            row = rows[key]
            assert row['status'].startswith('artwork_needed')
            assert row['source_sha256'] == proof['source_sha256'] and row['semantic_sha256'] == proof['semantic_sha256']
            row.update(status='active_reviewed_trio', selected_images=proof['image_paths'],
                selected_sha256=proof['image_sha256'], reason=proof['visual_review'], visual_review_register=register)
            planned[key].update(status='reviewed_trio', targets=proof['image_paths'],
                target_sha256=proof['image_sha256'], reason=proof['visual_review'],
                method='individual_763_candidate_review', review_763_decision='active_reviewed_trio',
                visual_review=dict(register=register, note=proof['visual_review']))
            snapshot = sources[key]
            node = ['questions', snapshot['question'] - 1, 'formes', 'qcm_image']
            source_bank = str(Path(snapshot['bank']).relative_to(ROOT)) if Path(snapshot['bank']).is_absolute() else snapshot['bank']
            operation = dict(bank=source_bank, exercise=snapshot['exercise'], question=snapshot['question'],
                node=node, before=None, after=deepcopy(proof['after_image_form']),
                source_sha256=proof['source_sha256'], reason=proof['visual_review'], review_ledger=register)
            prior = [op for op in journal['operations'] if op['bank'] == source_bank and op['exercise'] == snapshot['exercise'] and op['node'] == node]
            if prior:
                assert len(prior) == 1 and prior[0].get('source_refresh_note') and prior[0]['after'] is None
                prior[0].update(operation)
            else:
                journal['operations'].append(operation)
        ledger['summary'] = dict(Counter(row['status'] for row in ledger['questions']))
        ledger['activated_total'] = sum(row['status'] == 'active_reviewed_trio' for row in ledger['questions'])
        ledger['artwork_pending_total'] = sum(row['status'].startswith('artwork_needed') for row in ledger['questions'])
        plan['summary'] = dict(Counter(row['status'] for row in plan['questions']))
        metadata.extend([(ledger_path, ledger), (PLAN, plan), (JOURNAL, journal)])
    else:
        plan_path = ROOT / 'docs/tcf/delf-actif-20261113/images-a-preparer.json'
        plan = read(plan_path)
        planned = {row['key']: row for row in plan['questions']}
        for proof in proofs:
            assert planned[proof['key']]['status'] == 'candidate_visual_review'
            planned[proof['key']]['visual_review'] = dict(register=register, note=proof['visual_review'])
        metadata.append((plan_path, plan))
    timestamp = datetime.now(timezone.utc).isoformat()
    packet.update(status='completed', activated_at=timestamp, activation_register=register)
    packet['summary']['activated_trios'] = count
    for row in packet['ready_trios']:
        row['status'] = 'activated'
    for row in packet['planned_choices']:
        row.update(status='active_reviewed_trio', review_register=register)
    uses = [image for proof in proofs for image in proof['image_paths']]
    new_paths = {row['path'] for row in packet['published_images']}
    result = dict(date='2026-11-24', baseline_commit=baseline, source_bank_sha256=bank_sha,
        preparation_register=str(path.relative_to(ROOT)), human_audio_listening_performed=False,
        summary=dict(reviewed_trios=count, added_trios=count, new_images=len(new_paths),
            existing_distinct_images_reused=len(packet['existing_reuses']),
            new_image_usages=sum(image in new_paths for image in uses),
            reused_image_usages=sum(image not in new_paths for image in uses)),
        new_images=packet['published_images'], existing_reuses=packet['existing_reuses'], trios=proofs)
    # All source, answer, image and restoration checks precede any bank mutation.
    for bank, rendered in banks.items():
        bank.write_text(rendered)
    for dest, value in metadata + [(path, packet), (register_path, result)]:
        write(dest, value)
    print(json.dumps(result['summary'], ensure_ascii=False))


if __name__ == '__main__':
    main()

"""Validate a resumable packet without treating briefs as visual approvals."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from audio_replacement.editorial_json import loads
from tcf_context_audit import BANKS, digest, semantic_question, source_for


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('packet', type=Path)
    args = parser.parse_args()
    packet = json.loads(args.packet.read_text())
    assert packet['summary']['activated_trios'] == 0
    jobs = {j['id']: j for j in packet['jobs']}
    assert len(jobs) == len(packet['jobs'])
    manifest = {r['path']: r for r in json.loads((ROOT / 'docs/tcf/images-generees.json').read_text())['images']}
    audit = {r['path']: r for r in json.loads((ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json').read_text())['images']}
    published = {r['path']: r for r in packet['published_images']}
    pending = {j['id'] for j in jobs.values() if j['status'] == 'pending_generation'}
    assert len(packet['remaining_asset_ids']) == len(pending) and set(packet['remaining_asset_ids']) == pending
    assert len(published) == len(packet['published_images'])
    for job in jobs.values():
        seen = {job['id']}
        seed = job.get('seed')
        while seed:
            assert seed in jobs and seed not in seen
            seen.add(seed)
            seed = jobs[seed].get('seed')
        if job['id'] in pending:
            assert job['path'] not in manifest
        else:
            assert job['status'] == 'visually_reviewed'
            assert job['path'] in published and job['source'] == job['path']
    from PIL import Image
    for image, row in published.items():
        file = ROOT / 'public' / image.lstrip('/')
        assert sha(file) == row['sha256'] == manifest[image]['sha256'] == audit[image]['sha256']
        assert row['status'] == audit[image]['status'] == 'visually_reviewed'
        assert row.get('qcm_approval') == manifest[image].get('qcm_approval')
        assert row['original_bytes_preserved'] and row['review_note']
        assert audit[image]['visual_label'] and audit[image]['visual_keywords']
        with Image.open(file) as art:
            assert art.format == 'PNG' and art.size == (1448, 1086)
    for row in packet['existing_reuses']:
        assert row['path'] not in published
        assert sha(ROOT / 'public' / row['path'].lstrip('/')) == row['sha256'] == manifest[row['path']]['sha256']
        assert row['status'] == 'visually_reviewed' and row['review_note']
    selected = {r['key']: r for r in packet['selected_questions']}
    checked = set()
    for bank in BANKS:
        for exercise in loads(bank.read_text()):
            for index, question in enumerate(exercise.get('questions', []), 1):
                key = f"{exercise['id']}#{index}"
                if key not in selected:
                    continue
                row = selected[key]
                source, audio = source_for(exercise, question)
                assert question == row['question_snapshot'], key + ': question edited or activated too early'
                assert not question.get('formes', {}).get('qcm_image')
                assert source == row['source'] and digest(source) == row['source_sha256']
                assert digest(semantic_question(question)) == row['semantic_sha256'] and audio == row['audio']
                if audio:
                    assert sha(ROOT / 'public' / audio.lstrip('/')) == row['audio_sha256']
                checked.add(key)
    assert checked == set(selected)
    spec = importlib.util.spec_from_file_location('publish_batch', ROOT / 'scripts/publish-tcf-image-batch-20261124.py')
    publisher = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(publisher)
    recorded_ready = packet['ready_trios']
    publisher.refresh(packet, manifest)
    assert recorded_ready == packet['ready_trios']
    assert packet['summary']['prepared_trios'] == len(recorded_ready)
    print(json.dumps(dict(source_bound_questions=len(checked), proposed_trios=len(packet['planned_choices']),
        prepared_trios=len(recorded_ready), published_new_images=len(published),
        published_images_rejected_by_user=sum(row.get('qcm_approval') == 'rejected_by_user' for row in published.values()),
        pending_images=len(pending),
        activated_trios=0, human_audio_listening_performed=False), ensure_ascii=False))


if __name__ == '__main__':
    main()

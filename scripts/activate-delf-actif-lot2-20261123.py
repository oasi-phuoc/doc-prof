"""Activate the complete, visually reviewed second DELF Actif batch only."""
import hashlib
import json
import subprocess
import sys
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from audio_replacement.editorial_json import loads as editorial_loads
from tcf_context_audit import BANKS, digest, semantic_question, source_for, text_form

DIRECTORY = ROOT / 'docs/tcf/delf-actif-20261113'
REGISTER = 'docs/tcf/delf-actif-20261113/revue-lot2-100-20261123.json'


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def add_forms_preserving_source(source, forms):
    """Insert image forms without rewriting editorial fragments or whitespace."""
    decoder = json.JSONDecoder()

    def skip(index):
        while source[index].isspace():
            index += 1
        return index

    def parse(index):
        index = skip(index)
        node = dict(start=index, properties={}, items=[])
        char = source[index]
        if char in '[{':
            closing = '}' if char == '{' else ']'
            index = skip(index + 1)
            while source[index] != closing:
                if char == '{':
                    key, index = decoder.raw_decode(source, index)
                    index = skip(index)
                    assert source[index] == ':'
                    child = parse(index + 1)
                    node['properties'][key] = child
                else:
                    child = parse(index)
                    node['items'].append(child)
                index = skip(child['end'])
                if source[index] == ',':
                    index = skip(index + 1)
                else:
                    assert source[index] == closing
            node['end'] = index + 1
        else:
            node['value'], node['end'] = decoder.raw_decode(source, index)
        return node

    tree = parse(0)
    edits, seen = [], set()
    for exercise in tree['items']:
        ident = exercise['properties']['id']['value']
        for index, question in enumerate(exercise['properties'].get('questions', {}).get('items', []), 1):
            key = f'{ident}#{index}'
            if key not in forms:
                continue
            seen.add(key)
            column = question['start'] - source.rfind('\n', 0, question['start']) - 1
            parent = question['properties'].get('formes', question)
            name = 'qcm_image' if parent is not question else 'formes'
            value = forms[key] if parent is not question else dict(qcm_image=forms[key])
            assert name not in parent['properties']
            position = max((child['end'] for child in parent['properties'].values()), default=parent['start'] + 1)
            indentation = ' ' * (column + (4 if parent is not question else 2))
            encoded = json.dumps(value, ensure_ascii=False, indent=2).replace('\n', '\n' + indentation)
            addition = (',' if parent['properties'] else '') + '\n' + indentation + json.dumps(name) + ': ' + encoded
            edits.append((position, addition))
    assert seen == set(forms)
    for position, addition in sorted(edits, reverse=True):
        source = source[:position] + addition + source[position:]
    return source


def main():
    packet_path = DIRECTORY / 'lot2-100-20261123-preparation.json'
    packet = read(packet_path)
    assert packet['summary']['activated_trios'] == 0, 'Batch already activated'
    assert not packet['remaining_asset_ids'] and not packet['retakes']
    assert len(packet['ready_trios']) == len(packet['trio_review_notes']) == 100
    preflight = subprocess.check_output(
        [sys.executable, 'scripts/check-delf-actif-lot2-preparation-20261123.py'],
        cwd=ROOT, text=True).strip()
    sources = {row['key']: row for row in packet['selected_questions']}
    targets = {row['key']: row for row in packet['planned_choices']}
    ready = {row['key']: row for row in packet['ready_trios']}
    manifest = {row['path']: row for row in read(ROOT / 'docs/tcf/images-generees.json')['images']}
    plan_path = DIRECTORY / 'images-a-preparer.json'
    plan = read(plan_path)
    planned = {row['key']: row for row in plan['questions']}
    banks, proofs, bank_hashes = {}, [], {}
    for bank in BANKS:
        relative = str(bank.relative_to(ROOT))
        bank_hashes[relative] = sha(bank)
        original = editorial_loads(bank.read_text())
        data = deepcopy(original)
        changed = False
        for exercise in data:
            for index, question in enumerate(exercise.get('questions', []), 1):
                key = f"{exercise['id']}#{index}"
                if key not in sources:
                    continue
                before, target, review = sources[key], targets[key], ready[key]
                source, audio = source_for(exercise, question)
                assert question == before['question_snapshot']
                assert digest(source) == before['source_sha256']
                assert digest(semantic_question(question)) == before['semantic_sha256']
                assert audio == before['audio']
                assert sha(ROOT / 'public' / audio.lstrip('/')) == before['audio_sha256']
                assert not question.get('formes', {}).get('qcm_image')
                assert planned[key]['status'] == 'candidate_visual_review'
                paths = target['paths']
                assert len(paths) == len(set(paths)) == 3
                assert [c['texte'] for c in text_form(question)['choix']] == target['labels']
                for path in paths:
                    row = manifest[path]
                    assert row['status'] == 'visually_reviewed'
                    assert row['sha256'] == sha(ROOT / 'public' / path.lstrip('/'))
                assert review['visual_review'] == packet['trio_review_notes'][str(target['index'])]
                image_form = deepcopy(review['preview_image_form'])
                assert [c['image'] for c in image_form['choix']] == paths
                assert [(c['id'], bool(c.get('correct'))) for c in image_form['choix']] == [
                    (c['id'], bool(c.get('correct'))) for c in text_form(question)['choix']]
                question.setdefault('formes', {})['qcm_image'] = image_form
                changed = True
                proofs.append(dict(key=key, bank=relative, level=exercise['niveau'],
                    source=source, source_sha256=before['source_sha256'],
                    semantic_sha256=before['semantic_sha256'], question=semantic_question(question),
                    audio=audio, audio_sha256=before['audio_sha256'],
                    image_ids=[manifest[path]['id'] for path in paths], image_paths=paths,
                    image_sha256=[manifest[path]['sha256'] for path in paths],
                    reason='Trois choix entiers, distincts et relus contre la transcription active.',
                    visual_review=review['visual_review'], change_kind='added_image_form',
                    before_image_form=None, after_image_form=deepcopy(image_form)))
                planned[key]['visual_review'] = dict(register=REGISTER, note=review['visual_review'])
        if changed:
            restored = deepcopy(data)
            for exercise in restored:
                for index, question in enumerate(exercise.get('questions', []), 1):
                    key = f"{exercise['id']}#{index}"
                    if key not in sources:
                        continue
                    question['formes'].pop('qcm_image')
                    if not question['formes'] and 'formes' not in sources[key]['question_snapshot']:
                        question.pop('formes')
            assert restored == original, relative + ': unintended mutation'
            bank_forms = {row['key']: row['after_image_form'] for row in proofs if row['bank'] == relative}
            rendered = add_forms_preserving_source(bank.read_text(), bank_forms)
            assert editorial_loads(rendered) == data
            banks[bank] = rendered
    assert len(proofs) == 100 and {row['key'] for row in proofs} == set(sources)
    uses = [path for row in proofs for path in row['image_paths']]
    new_paths = {row['path'] for row in packet['published_images']}
    timestamp = datetime.now(timezone.utc).isoformat()
    packet['preactivation_validation'] = dict(at=timestamp, result=preflight,
        bank_sha256=bank_hashes, human_audio_listening_performed=False)
    packet['status'] = 'completed'
    packet['activated_at'] = timestamp
    packet['summary'].update(activated_trios=100, remaining_candidates_in_bank=21)
    for row in packet['ready_trios']:
        row['status'] = 'activated'
    for row in packet['planned_choices']:
        row.update(status='active_reviewed_trio', review_register=REGISTER)
    result = dict(date='2026-11-23', activated_at=timestamp,
        baseline_commit=packet['baseline_commit'], human_audio_listening_performed=False,
        style_reference_commit='48a753d8d6bd095e41968b39da88dbcb331fee11',
        preparation_register=str(packet_path.relative_to(ROOT)),
        summary=dict(reviewed_trios=100, added_trios=100, new_images=len(new_paths),
            native_images=packet['summary']['native_png'], procedural_clocks=8,
            existing_distinct_images_reused=len(packet['existing_reuses']),
            new_image_usages=sum(path in new_paths for path in uses),
            reused_image_usages=sum(path not in new_paths for path in uses)),
        new_images=packet['published_images'], existing_reuses=packet['existing_reuses'],
        background_review=packet['background_review'], generation=packet['generation'], trios=proofs)
    lots_path = DIRECTORY / 'lots-de-100-20261122.json'
    lots = read(lots_path)
    lots['batches'][1]['status'] = 'completed'
    lots['batches'][1]['review_register'] = REGISTER
    lots['second_batch_preparation'] = packet['summary']
    journal_path = DIRECTORY / 'reprise-generation-20261123.json'
    journal = read(journal_path)
    journal['summary'] = packet['summary']
    journal['activation_register'] = REGISTER
    journal['status'] = 'completed'
    # No mutation until the complete batch and every bank comparison pass.
    for bank, rendered in banks.items():
        bank.write_text(rendered)
    for path, data in [(plan_path, plan), (ROOT / REGISTER, result), (packet_path, packet),
                       (lots_path, lots), (journal_path, journal)]:
        write(path, data)
    print(json.dumps(result['summary'], ensure_ascii=False))


if __name__ == '__main__':
    main()

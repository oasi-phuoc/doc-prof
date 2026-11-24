"""Publish manually reviewed native PNGs in a resumable TCF packet."""
import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STYLE = '48a753d8d6bd095e41968b39da88dbcb331fee11'


def read(path):
    return json.loads(Path(path).read_text())


def write(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def resolve(path):
    return ROOT / 'public' / path.lstrip('/') if path.startswith('/lib/') else ROOT / path


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def refresh(packet, manifest):
    sources = {row['key']: row for row in packet['selected_questions']}
    ready = []
    for target in packet['planned_choices']:
        if not all(path in manifest and manifest[path]['status'] == 'visually_reviewed' for path in target['paths']):
            continue
        note = packet['trio_review_notes'].get(str(target['index']))
        if not note:
            continue
        question = sources[target['key']]['question_snapshot']
        form = question.get('formes', {}).get('qcm_texte', question)
        assert [choice['texte'] for choice in form['choix']] == target['labels']
        image_form = dict(melanger=form.get('melanger', question.get('melanger', True)),
            choix=[dict(id=choice['id'], image=path, **({'correct': True} if choice.get('correct') else {}))
                   for choice, path in zip(form['choix'], target['paths'])])
        ready.append(dict(index=target['index'], key=target['key'], image_paths=target['paths'],
            status='prepared_not_activated', visual_review=note, preview_image_form=image_form))
    packet['ready_trios'] = ready
    packet['summary'].update(prepared_trios=len(ready), published_images=len(packet['published_images']),
        images_still_to_finalize=len(packet['remaining_asset_ids']),
        existing_distinct_reuses=len(packet['existing_reuses']))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('packet', type=Path)
    parser.add_argument('reviews', type=Path)
    args = parser.parse_args()
    packet_path = args.packet.resolve()
    register = str(packet_path.relative_to(ROOT))
    packet = read(packet_path)
    assert packet['summary']['activated_trios'] == 0
    inputs = read(args.reviews)
    paths = dict(manifest=ROOT / 'docs/tcf/images-generees.json',
        classification=ROOT / 'docs/gallery/classement-tcf-20261113.json',
        registry=ROOT / 'scripts/tcf-qcm-image-registry.json',
        audit=ROOT / 'docs/gallery/audit-mots-cles-tcf-20261117.json')
    data = {name: read(path) for name, path in paths.items()}
    manifest = {row['path']: row for row in data['manifest']['images']}
    jobs = {row['id']: row for row in packet['jobs']}
    timestamp = datetime.now(timezone.utc).isoformat()
    copies, archives = [], {}

    def portable(ref):
        if ref.startswith(str(ROOT / 'public') + '/'):
            return ref[len(str(ROOT / 'public')):]
        if ref.startswith(str(ROOT) + '/'):
            return ref[len(str(ROOT)) + 1:]
        if ref.startswith('/workspace/generated_images/'):
            source = Path(ref)
            dest = packet_path.parent / (packet_path.stem + '-sources') / source.name
            assert source.is_file()
            if dest.exists():
                assert sha(dest) == sha(source)
            archives[source] = dest
            return str(dest.relative_to(ROOT))
        return ref

    assert len({row['id'] for row in inputs}) == len(inputs)
    for review in inputs:
        job = jobs[review['id']]
        path, source = job['path'], Path(review['source']).resolve()
        assert job['id'] in packet['remaining_asset_ids']
        assert path not in manifest and not resolve(path).exists()
        assert source.parent == Path('/workspace/generated_images') and source.is_file()
        assert review['label'].strip() and review['keywords'] and review['review_note'].strip()
        with Image.open(source) as image:
            assert image.format == 'PNG' and image.size == (1448, 1086), (job['id'], image.size)
            pixels = np.asarray(image.convert('RGB'))
        background = None
        if job['type'] == 'Objet':
            medians = [np.median(corner.reshape(-1, 3), axis=0).tolist() for corner in
                [pixels[:30, :30], pixels[:30, -30:], pixels[-30:, :30], pixels[-30:, -30:]]]
            delta = float(np.max(np.abs(np.asarray(medians) - [253, 242, 225])))
            assert delta <= 3, (job['id'], 'ivory background outside tolerance', medians)
            background = dict(median_rgb=medians, reference_rgb=[253, 242, 225], maximum_channel_delta=delta)
        refs = review['reference_images']
        assert refs and all(resolve(ref).is_file() for ref in refs)
        refs = [portable(ref) for ref in refs]
        style_refs = review.get('style_references', [ref for ref in refs if ref.startswith('/lib/')])
        assert style_refs
        checksum = sha(source)
        row = dict(id=job['id'], label=review['label'], path=path, prompt=review['prompt'],
            source_png=str(source), source_sha256=checksum, sha256=checksum, bytes=source.stat().st_size,
            width=1448, height=1086, aspect_ratio='4:3', original_bytes_preserved=True,
            status='visually_reviewed', domain='ce-co', batch=packet_path.stem,
            style_reference_commit=STYLE, style_references=style_refs, reference_images=refs,
            review_note=review['review_note'], style_review=dict(status='aligned', reference_commit=STYLE, references=style_refs),
            gallery_types=[job['type']], gallery_themes=['Style TCF validé'])
        if background:
            row['background_review'] = background
        rejected = [dict(source=portable(item['source']), reason=item['reason'])
                    for item in review.get('rejected_generations', [])]
        packet['published_images'].append(row)
        packet.setdefault('publication_journal', []).append(dict(row, visual_keywords=review['keywords'],
            reviewed_at=timestamp, rejected_generations=rejected))
        packet['remaining_asset_ids'].remove(job['id'])
        job.update(status='visually_reviewed', source=path, sha256=checksum)
        data['manifest']['images'].append(row)
        manifest[path] = row
        data['classification']['images'].append(dict(path=path, label=row['label'], types=row['gallery_types'],
            themes=row['gallery_themes'], sha256=checksum, review_note=row['review_note']))
        data['registry'].append(dict(slug=job['id'], aliases=[row['label']], prompt=row['prompt'], path=path,
            kind='object' if job['type'] == 'Objet' else 'scene', source_batch=row['batch'], review_register=register))
        data['audit']['images'].append(dict(path=path, sha256=checksum, collection='TCF', status='visually_reviewed',
            previous_label=row['label'], previous_keywords=', '.join(review['keywords']),
            current_label=row['label'], current_keywords=', '.join(review['keywords']),
            visual_label=row['label'], visual_keywords=review['keywords'], review_note=row['review_note'],
            visual_review_register=register))
        copies.append((source, resolve(path)))
    refresh(packet, manifest)
    packet['last_updated'] = timestamp
    # Validate everything before copying or editing any repository file.
    for source, dest in archives.items():
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            shutil.copyfile(source, dest)
        packet.setdefault('working_source_archive', []).append(dict(path=str(dest.relative_to(ROOT)), sha256=sha(source)))
    for source, dest in copies:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
    for name, path in paths.items():
        write(path, data[name])
    write(packet_path, packet)
    print(json.dumps(packet['summary'], ensure_ascii=False))


if __name__ == '__main__':
    main()

"""Publish explicitly reviewed generated PNGs; never activate an incomplete batch."""
import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PACKET = 'docs/tcf/delf-actif-20261113/lot2-100-20261123-preparation.json'
STYLE = '48a753d8d6bd095e41968b39da88dbcb331fee11'


def read(path):
    return json.loads(Path(path).read_text())


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def resolve(path):
    return ROOT / 'public' / path.lstrip('/') if path.startswith('/lib/') else ROOT / path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('reviews', help='JSON array with source, id, label, keywords and concrete review_note')
    args = parser.parse_args()
    inputs = read(args.reviews)
    packet = read(ROOT / PACKET)
    files = {
        'manifest': 'docs/tcf/images-generees.json',
        'classification': 'docs/gallery/classement-tcf-20261113.json',
        'registry': 'scripts/tcf-qcm-image-registry.json',
        'audit': 'docs/gallery/audit-mots-cles-tcf-20261117.json',
        'lots': 'docs/tcf/delf-actif-20261113/lots-de-100-20261122.json',
    }
    data = {key: read(ROOT / path) for key, path in files.items()}
    queue = {row['id']: row for row in packet['generation_queue']}
    manifest = {row['path']: row for row in data['manifest']['images']}
    timestamp = datetime.now(timezone.utc).isoformat()
    additions = []
    archive_copies = {}

    def portable(ref):
        if ref.startswith(str(ROOT / 'public') + '/'):
            return ref[len(str(ROOT / 'public')):]
        if ref.startswith(str(ROOT) + '/'):
            return ref[len(str(ROOT)) + 1:]
        if ref.startswith('/workspace/generated_images/'):
            source = Path(ref)
            dest = ROOT / 'docs/tcf/delf-actif-20261113/lot2-sources-20261123' / source.name
            assert source.is_file()
            if dest.exists():
                assert sha(dest) == sha(source)
            archive_copies[source] = dest
            return str(dest.relative_to(ROOT))
        return ref
    for review in inputs:
        ident = review['id']
        path = '/lib/images/tcf/qcm-audit/' + ident + '.png'
        source = Path(review['source']).resolve()
        target = resolve(path)
        assert ident in packet['remaining_asset_ids'], ident
        assert source.parent == Path('/workspace/generated_images') and source.is_file(), source
        assert path not in manifest and not target.exists(), path
        assert review['label'].strip() and review['keywords'] and review['review_note'].strip(), ident
        original = queue[ident]
        with Image.open(source) as image:
            assert image.format == 'PNG' and image.size == (1448, 1086), (ident, image.size)
            pixels = np.asarray(image.convert('RGB'))
        refs = review.get('reference_images', original['refs'])
        assert refs and all(resolve(ref).is_file() for ref in refs), ident
        for ref in refs:
            if ref.startswith('/lib/') and ref in manifest:
                assert sha(resolve(ref)) == manifest[ref]['sha256'], ref
        background = None
        if 'FDF2E1' in original['desc']:
            corners = [pixels[:30, :30], pixels[:30, -30:], pixels[-30:, :30], pixels[-30:, -30:]]
            medians = [np.median(corner.reshape(-1, 3), axis=0).tolist() for corner in corners]
            delta = float(np.max(np.abs(np.asarray(medians) - [253, 242, 225])))
            assert delta <= 3, (ident, 'ivory background outside tolerance', medians)
            background = dict(id=ident, source_sha256=sha(source), background_sample='four_corners_30px',
                              median_rgb=medians, maximum_channel_delta=delta,
                              reference_rgb=[253, 242, 225], status='aligned')
        refs = [portable(ref) for ref in refs]
        note = review['review_note'] + ' Fichier final examiné visuellement ; image préparée, sans activation du lot incomplet.'
        style_refs = review.get('style_references', [ref for ref in refs if ref.startswith('/lib/')])
        assert style_refs, ident
        row = dict(id=ident, label=review['label'], path=path, prompt=review.get('prompt', original['prompt']),
                   source_png=str(source), source_sha256=sha(source), sha256=sha(source), bytes=source.stat().st_size,
                   width=1448, height=1086, aspect_ratio='4:3', original_bytes_preserved=True,
                   status='visually_reviewed', domain='ce-co', batch='delf-actif-lot2-100-20261123-preparation',
                   style_reference_commit=STYLE, style_references=style_refs, reference_images=refs,
                   review_note=note, style_review=dict(status='aligned', reference_commit=STYLE, references=style_refs),
                   gallery_types=[original['type']], gallery_themes=['Style TCF validé'])
        generation = dict(original, source=path, status='visually_reviewed', seed_reviewed=True,
                          visual_review_sha256=row['sha256'], prompt=row['prompt'], refs=refs)
        if review.get('rejected_generations'):
            generation['rejected_generations'] = [dict(item, source=portable(item['source']))
                                                  for item in review['rejected_generations']]
        old = next((r for r in packet['generation'] if r['id'] == ident), None)
        if old:
            generation['rejected_generations'] = generation.get('rejected_generations', []) + old.get('rejected_generations', []) + [
                dict(source=old['source'], reason=packet['retakes'][ident.removeprefix('qcm-delf2-')])]
            packet['generation'].remove(old)
        packet['generation'].append(generation)
        packet['seen_source_sha256'][ident] = row['sha256']
        packet['retakes'].pop(ident.removeprefix('qcm-delf2-'), None)
        packet['remaining_asset_ids'].remove(ident)
        packet['published_images'].append(row)
        if background:
            packet['background_review'].append(background)
        data['manifest']['images'].append(row)
        manifest[path] = row
        data['classification']['images'].append(dict(path=path, label=row['label'], types=row['gallery_types'],
            themes=row['gallery_themes'], sha256=row['sha256'], review_note=note))
        data['registry'].append(dict(slug=ident, aliases=[row['label']], prompt=row['prompt'], path=path,
            kind='scene' if original['type'] in ['Scène', 'Scénario', 'Action', 'Lieu', 'Personnage'] else 'object',
            source_batch=row['batch'], review_register=PACKET))
        data['audit']['images'].append(dict(path=path, sha256=row['sha256'], collection='TCF', status='visually_reviewed',
            previous_label=row['label'], previous_keywords=', '.join(review['keywords']),
            current_label=row['label'], current_keywords=', '.join(review['keywords']),
            visual_label=row['label'], visual_keywords=review['keywords'], review_note=note,
            visual_review_register=PACKET))
        additions.append(dict(review, sha256=row['sha256'], path=path, reviewed_at=timestamp))
    assert len({r['id'] for r in inputs}) == len(inputs)
    sources = {row['key']: row for row in packet['selected_questions']}
    ready = []
    for target in packet['planned_choices']:
        if not all(path in manifest and manifest[path]['status'] == 'visually_reviewed' for path in target['paths']):
            continue
        question = sources[target['key']]['question_snapshot']
        form = question.get('formes', {}).get('qcm_texte', question)
        choices = form['choix']
        assert [choice['texte'] for choice in choices] == target['labels']
        note = packet['trio_review_notes'].get(str(target['index']))
        if not note:
            continue  # The trio still needs an explicit comparative review.
        ready.append(dict(index=target['index'], key=target['key'], bank=sources[target['key']]['bank'],
            enonce=target['enonce'], labels=target['labels'], image_paths=target['paths'],
            status='prepared_not_activated', visual_review=note,
            preview_image_form=dict(melanger=form.get('melanger', question.get('melanger', True)),
                choix=[dict(id=choice['id'], image=path, **({'correct': True} if choice.get('correct') else {}))
                       for choice, path in zip(choices, target['paths'])])))
    packet['ready_trios'] = ready
    summary = packet['summary']
    summary.update(prepared_trios=len(ready), unfinished_trios=100-len(ready), published_images=len(packet['published_images']),
        native_png=sum(not row.get('generation_method') for row in packet['published_images']),
        images_still_to_finalize=len(packet['remaining_asset_ids']), retakes_pending=len(packet['retakes']),
        new_images_still_to_generate=len(packet['remaining_asset_ids'])-len(packet['retakes']))
    packet['status'] = 'in_progress_image_generation'
    packet['last_generation_resume'] = dict(at=timestamp, additional_reviewed_assets=len(additions),
        journal='docs/tcf/delf-actif-20261113/reprise-generation-20261123.json')
    packet['generation_limit']['status'] = 'generation_resumed'
    packet['generation_limit']['last_success_at'] = timestamp
    data['lots']['second_batch_preparation'] = summary
    data['lots']['batches'][1]['status'] = packet['status']
    journal_path = ROOT / 'docs/tcf/delf-actif-20261113/reprise-generation-20261123.json'
    journal = read(journal_path) if journal_path.exists() else dict(date='2026-11-23', initial_pending=129, images=[])
    journal['images'].extend(additions)
    journal['summary'] = summary
    journal['last_updated'] = timestamp
    # All validation above precedes publication; original generated PNGs are kept.
    for source, dest in archive_copies.items():
        dest.parent.mkdir(parents=True, exist_ok=True)
        if not dest.exists():
            shutil.copyfile(source, dest)
        if not any(item['path'] == str(dest.relative_to(ROOT)) for item in packet['working_source_archive']):
            packet['working_source_archive'].append(dict(path=str(dest.relative_to(ROOT)), sha256=sha(source),
                bytes=source.stat().st_size, purpose='Raw working source only; excluded from the image catalogue.'))
    for review in additions:
        shutil.copyfile(review['source'], resolve(review['path']))
    for key, path in files.items():
        (ROOT/path).write_text(json.dumps(data[key], ensure_ascii=False, indent=2)+'\n')
    (ROOT/PACKET).write_text(json.dumps(packet, ensure_ascii=False, indent=2)+'\n')
    journal_path.write_text(json.dumps(journal, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main()

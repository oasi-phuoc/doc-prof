#!/usr/bin/env python3
"""Apply explicit textual range corrections, preserving native timings and IDs."""
import argparse
import copy
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import now, plan_segments, safe_work, sha256


def revise(plan, change):
    if not change.get('reason', '').strip() or not change.get('ranges'):
        raise ValueError('Explicit useful-word ranges and textual reason required')
    result = copy.deepcopy(plan)
    previous = {segment['id']: segment for segment in plan['segments']}
    segments, selected = [], set()
    for number, bounds in enumerate(change['ranges'], 1):
        first, last = bounds['first_word'], bounds['last_word']
        if not (type(first) is int and type(last) is int and 0 <= first <= last < len(result['words'])):
            raise ValueError('Reviewed word indices outside plan')
        occupied = set(range(first, last+1))
        if selected & occupied:
            raise ValueError('Reviewed ranges overlap')
        selected |= occupied
        identifier = bounds.get('id', plan['segments'][0]['id'].rsplit('-d', 1)[0]+'-d'+str(number))
        segment = copy.deepcopy(previous.get(identifier, plan['segments'][0]))
        segment.update(id=identifier, first_word=first, last_word=last,
            transcript=' '.join(word['text'] for word in result['words'][first:last+1]))
        segment['boundary_uncertainty'] = list(dict.fromkeys(segment.get('boundary_uncertainty', []) +
            [change['reason'], 'Limites relues dans la transcription ; écoute réelle encore requise.']))
        segments.append(segment)
    excluded = []
    for index, word in enumerate(result['words']):
        if index in selected:
            word['kind'] = 'dialogue'
        else:
            if word['kind'] == 'dialogue':
                word['kind'] = 'instruction'
            if excluded and excluded[-1]['last_word'] == index-1 and excluded[-1]['kind'] == word['kind']:
                excluded[-1]['last_word'] = index
            else:
                excluded.append({'first_word': index, 'last_word': index, 'kind': word['kind'],
                                 'reason': change['reason']})
    result['segments'] = segments
    result['provenance'].update(excluded_ranges=excluded,
        classification_method='explicit_textual_range_review_no_listening',
        range_review={'reason':change['reason'], 'previous_plan':change['plan_path'],
                      'previous_plan_sha256':change['plan_sha256'], 'listening_performed':False},
        listening_performed=False, production_modified=False)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--index', type=Path, required=True)
    parser.add_argument('--catalogue', type=Path, required=True)
    parser.add_argument('--changes', type=Path, required=True)
    parser.add_argument('--output-dir', type=Path, required=True)
    args = parser.parse_args()
    output = safe_work(args.output_dir)
    if output.exists():
        raise ValueError('Retain earlier versions; choose a new output directory')
    index = json.loads(args.index.read_text())
    sources = {r['source_id']:r for r in json.loads(args.catalogue.read_text())['sources']}
    changes = {r['source_id']:r for r in json.loads(args.changes.read_text())['changes']}
    unknown = set(changes) - {r['source_id'] for r in index['sources']}
    if unknown:
        raise ValueError('Unknown source in range review: '+str(unknown))
    revised = []
    for row in index['sources']:
        change = changes.get(row['source_id'])
        if not change:
            continue
        original = Path(row['plan_path'])
        if str(original) != change['plan_path'] or sha256(original) != change['plan_sha256']:
            raise ValueError('Earlier plan changed since textual review')
        plan = revise(json.loads(original.read_text()), change)
        source = sources[row['source_id']]
        plan_segments(plan, source['duration_seconds'], source['sample_rate'])
        revised.append((row, plan))
    output.mkdir(parents=True)
    for row, plan in revised:
        folder = output / Path(row['plan_path']).parent.name
        folder.mkdir()
        path = folder / 'candidate-plan.json'
        path.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
        row.update(plan_path=str(path),segments=plan['segments'],
                   excluded_ranges=plan['provenance']['excluded_ranges'],
                   classification_method=plan['provenance']['classification_method'],
                   plan_integrity='passed',status='candidate')
        row.pop('manifest_path', None)
        row.pop('blocker', None)
        (folder/'source-segments.json').write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n')
    index.update(created_at=now(), previous_index=str(args.index),
        range_review_path=str(args.changes), range_review_sha256=sha256(args.changes),
        segments=sum(len(r['segments']) for r in index['sources']),
        plans_passed=sum(r['plan_integrity']=='passed' for r in index['sources']),
        plans_requiring_correction=sum(r['plan_integrity'] not in ('passed','not_applicable_no_dialogue') for r in index['sources']),
        sources_prepared=sum('manifest_path' in r for r in index['sources']))
    (output/'segmentation-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'sources_revised':len(revised), 'segments':index['segments'],
                     'plans_requiring_correction':index['plans_requiring_correction'],
                     'listening_performed':False, 'production_modified':False}))


if __name__ == '__main__':
    main()

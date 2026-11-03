#!/usr/bin/env python3
"""Export canonical plan indices for matching, never as a new ASR transcript.

DTW coarticulation groups and exact-byte reference plans can have different word
indices from a receipt's raw ASR. Matching and segmentation must use one basis.
"""
import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from tcf_audio_boundaries import plan_segments, safe_work, sha256


def word_view(row, source):
    plan_path = Path(row['plan_path'])
    plan = json.loads(plan_path.read_text())
    if row['source_sha256'] != source['sha256'] or plan['provenance']['source_sha256'] != source['sha256']:
        raise ValueError('Plan/source checksums differ')
    plan_segments(plan,source['duration_seconds'],source['sample_rate'])
    return {'schema_version':1,'source_id':row['source_id'],'source_sha256':source['sha256'],
        'status':'plan_matching_view','purpose':'canonical_plan_words_for_matching_only_not_asr_input',
        'plan_path':str(plan_path),'plan_sha256':sha256(plan_path),
        'word_index_basis':'exact_candidate_plan_words_including_native_coarticulation_groups',
        'text':' '.join(w['text'] for w in plan['words']),
        'words':[{'word':w['text'],'start':w['start'],'end':w['end'],'kind':w['kind']} for w in plan['words']],
        'listening_performed':False,'production_modified':False}


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan-index',type=Path,required=True)
    parser.add_argument('--catalogue',type=Path,required=True)
    parser.add_argument('--output-dir',type=Path,required=True)
    args=parser.parse_args()
    output=safe_work(args.output_dir)
    if output.exists():
        raise ValueError('Choose a new directory to preserve the earlier matching basis')
    sources={r['source_id']:r for r in json.loads(args.catalogue.read_text())['sources']}
    rows=json.loads(args.plan_index.read_text())['sources']
    output.mkdir(parents=True)
    count=0
    for row in rows:
        if row['plan_integrity']!='passed':
            continue
        view=word_view(row,sources[row['source_id']])
        (output/(row['source_id']+'.json')).write_text(json.dumps(view,ensure_ascii=False,indent=2)+'\n')
        count+=1
    print(json.dumps({'matching_views':count,'listening_performed':False}))


if __name__=='__main__':
    main()

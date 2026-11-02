#!/usr/bin/env python3
"""Join lexical + waveform evidence to real prepared MP3s without promoting them."""
import argparse
import collections
import copy
import json
from pathlib import Path
import sys

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from tcf_audio_replacement import remap_tree
from tcf_audio_boundaries import sha256


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work',type=Path,default=Path('/workspace/work/tcf-audio-replacement'))
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
    args=parser.parse_args();work=args.work;out=work/'proposed-replacements-work';out.mkdir(exist_ok=True)
    signals={(r['old_ref'],r['source_id']):r for r in read(work/'acoustic-source-evidence.json')['evidence']
             if r['status']=='signal_source_confirmed'}
    prepared={r['source_id']:r for r in read(work/'staged-boundaries-work/batch-progress.json')['sources']
              if r.get('manifest')}
    mp3={r['source_id']:r for r in read(work/'staged-boundaries-work/mp3-index.json')['sources']}
    matches=read(work/'source-dialogue-candidates.json')['matches']
    assignment_path=work/'refinement-work/assignment-overrides.json'
    overrides=read(assignment_path).get('assignments',{}) if assignment_path.exists() else {}
    assembly_path=work/'refinement-work/assembled-candidates.json'
    assemblies={r['source_id']:r for r in read(assembly_path)['assemblies']} if assembly_path.exists() else {}
    proposals=[];replacements=[]
    for match in matches:
        confirmed=[(c,signals[(match['old_ref'],c['source_id'])]) for c in match['candidates']
                   if (match['old_ref'],c['source_id']) in signals]
        if not confirmed:continue
        candidate,signal=confirmed[0];sid=candidate['source_id']
        row={'old_ref':match['old_ref'],'dialogue_id':match['dialogue_id'],'exercise_ids':match['exercise_ids'],
             'source_id':sid,'source_sha256':candidate['source_sha256'],'signal_status':signal['status'],
             'proposed_ref':match['old_ref'],'lexical_score':candidate['score'],
             'review_flags':candidate['review_flags'],'question_answer_review':candidate['question_answer_review'],
             'status':'requires_segmentation_or_timing_correction','listening_performed':False}
        if sid in prepared and sid in mp3:
            manifest=read(prepared[sid]['manifest']);choices=[]
            for segment in manifest['segments']:
                first,last=candidate['matched_word_first'],candidate['matched_word_last']
                intersection=max(0,min(last,segment['last_word'])-max(first,segment['first_word'])+1)
                coverage=intersection/max(1,last-first+1)
                duration=segment['end_seconds']-segment['start_seconds']
                old_duration=signal['old_duration_decoded']
                if coverage>=.9 and duration<=old_duration*1.6+3:
                    choices.append(segment)
            explicit=overrides.get(match['old_ref'])
            if explicit:
                if explicit['source_id']!=sid:
                    raise ValueError('Reviewed assignment points to another source')
                if explicit.get('assembly'):
                    delivery=assemblies[sid]
                    segment={'id':delivery['id'],'transcript':delivery['transcription'],
                             'start_seconds':delivery['parts'][0]['source_start_seconds'],
                             'end_seconds':delivery['parts'][-1]['source_end_seconds']}
                else:
                    segment=next(s for s in manifest['segments'] if s['id']==explicit['candidate_cut_id'])
                    delivery=next(r for r in mp3[sid]['segments'] if r['id']==segment['id'])
                if sha256(delivery['file'])!=delivery['sha256']:
                    raise ValueError('Reviewed candidate bytes have changed')
                row['assignment_method']=explicit['reason']
                if explicit.get('assembly'):
                    row['source_ranges']=delivery['parts']
            elif len(choices)==1:
                segment=choices[0];delivery=next(r for r in mp3[sid]['segments'] if r['id']==segment['id'])
            else:
                segment=None
            if segment is not None:
                row.update(status='prepared_candidate_requires_listening_and_question_review',
                           candidate_cut_id=segment['id'],candidate_mp3=delivery['file'],
                           candidate_sha256=delivery['sha256'],proposed_name=delivery['name'],
                           proposed_tags=delivery['tags'],proposed_transcription=segment['transcript'],
                           source_start=segment['start_seconds'],source_end=segment['end_seconds'])
                replacements.append({'dialogue_id':match['dialogue_id'],'old_refs':[match['old_ref']],
                                     'new_ref':match['old_ref'],'transcription':segment['transcript'],
                                     'tags':[tag for tag in delivery['tags'] if tag not in ('a-verifier','source-native')]})
        proposals.append(row)
    groups=collections.defaultdict(list)
    for row in proposals:
        if row.get('candidate_sha256'):groups[row['candidate_sha256']].append(row['old_ref'])
    aliases=[{'candidate_sha256':key,'old_refs':values,'status':'same_candidate_review_aliases_before_promotion'}
             for key,values in groups.items() if len(values)>1]
    summary={'schema_version':1,'purpose':'review-only, not an executable production mapping',
             'signal_confirmed_refs':len(proposals),'references_with_prepared_candidate':len(replacements),
             'references_requiring_more_segmentation':len(proposals)-len(replacements),
             'candidate_alias_groups':len(aliases),'listening_performed':False,'production_modified':False}
    result={**summary,'aliases_to_review':aliases,'proposals':proposals}
    (out/'proposals.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    for bank in sorted((args.repo/'src/tcf/content').glob('*/co.json')):
        before=read(bank);conflicts=[];after=remap_tree(before,replacements,conflicts=conflicts)
        if conflicts:raise ValueError(str(conflicts))
        assert [r['id'] for r in before]==[r['id'] for r in after]
        assert [r.get('questions') for r in before]==[r.get('questions') for r in after]
        folder=out/bank.parent.name;folder.mkdir(exist_ok=True)
        (folder/'co.json').write_text(json.dumps(after,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(summary,ensure_ascii=False))


if __name__=='__main__':
    main()

#!/usr/bin/env python3
"""Prune retired question requests while retaining reusable illustrations and source receipts."""
import argparse
import collections
import json
from pathlib import Path
import shutil
import subprocess
import sys

from tcf_replace_vocabulary_images import vocabulary_paths


def read(path):return json.loads(Path(path).read_text())
def write(path,data):Path(path).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[1])
    parser.add_argument('--image-work',type=Path,required=True)
    args=parser.parse_args();repo=args.repo;work=args.image_work;docs=repo/'docs/tcf'
    retirement=read(docs/'remplacement-audio/retrait-297-references-20261104.json')
    retired={e['id'] for e in retirement['removed_exercises']}
    banks={e['id']:(str(bank.relative_to(repo)),e) for bank in (repo/'src/tcf/content').glob('*/*.json')
        if bank.name in ('ce.json','co.json') for e in read(bank)}
    backup=work/'before-retirement-297';backup.mkdir(exist_ok=True)
    proposals=read(docs/'remplacement-audio/liaisons-unifiees.json')['proposals'];byref={}
    for p in proposals:
        for ref in {p['old_ref'],p.get('proposed_ref',p['old_ref'])}:byref[ref]=p
    for filename in ['phase306-snapshot.json','generation-plan.json']:
        file=work/filename
        if not (backup/filename).exists():shutil.copyfile(file,backup/filename)
        data=read(file);questions=data if isinstance(data,list) else data['questions'];kept=[]
        for q in questions:
            if q['exercise'] in retired:continue
            if q['exercise'] not in banks:raise ValueError('Unknown question outside the authorized retirement')
            _,exercise=banks[q['exercise']];actual=exercise['questions'][q['question']-1]
            if actual['enonce']!=q['enonce']:raise ValueError('Question was rewritten; review images explicitly: '+q['exercise'])
            refs=exercise['support'].get('audios') or [exercise['support'].get('audio')]
            index=actual.get('audio');refs=[refs[index-1]] if index else refs
            links=[byref[ref] for ref in refs if ref in byref]
            if links:
                q['source_links']=[dict(old_ref=p['old_ref'],source_id=p['source_id'],candidate_cut_id=p['candidate_cut_id'],transcription=p['proposed_transcription']) for p in links]
                q['linked_source_ids']=list(dict.fromkeys([*q.get('linked_source_ids',[]),*[p['source_id'] for p in links]]))
            kept.append(q)
        if isinstance(data,list):data=kept
        else:
            data['questions']=kept;live={(q['exercise'],q['question']) for q in kept};assets=[]
            for a in data['assets']:
                a['references']=[r for r in a['references'] if (r['exercise'],r['question']) in live]
                if a['references']:assets.append(a)
            data['assets']=assets
        write(file,data)
    # The vocabulary library itself stays intact. Count uses in the retained banks.
    file=docs/'remplacement-images-vocabulaire.json';vocab=read(file)
    uses=[dict(bank=bank,exercise=eid,node=list(node),image=image) for eid,(bank,e) in banks.items() for node,image in vocabulary_paths(e)]
    byimage=collections.defaultdict(list)
    for u in uses:byimage[u['image']].append(u)
    vocab['remaining_uses']=uses
    vocab['completed_question_trios']=[r for r in vocab['completed_question_trios'] if r['exercise'] in banks]
    for asset in vocab['assets']:
        asset['uses']=[u for u in asset.get('uses',[]) if u['exercise'] in banks]
        asset['remaining_occurrences']=len(byimage[asset['image']])
        if not asset['remaining_occurrences']:asset['status']='no_remaining_usage_in_current_banks'
    summary=vocab['summary'];summary.update(remaining_occurrences=len(uses),remaining_original_images=len(byimage),
        completed_question_trios=len(vocab['completed_question_trios']),
        style_aligned_question_trios=len(vocab['completed_question_trios']),
        replaced_occurrences=sum(r['replaced_occurrences'] for r in vocab['completed_question_trios']))
    summary['retired_occurrences']=summary['original_occurrences']-summary['remaining_occurrences']-summary['replaced_occurrences']
    write(file,vocab)
    # Keep historical evidence, but do not offer deleted exercises for activation.
    file=docs/'images-generees.json';manifest=read(file)
    for name in ['activated_questions','activated_association_scenes']:
        manifest[name]=[r for r in manifest.get(name,[]) if r['exercise'] in banks]
    write(file,manifest)
    file=docs/'images-306-prochain-lot.json';jobs=read(file)
    checked={r['path']:r for r in manifest['images'] if r.get('status')=='visually_reviewed'}
    for job in jobs['images']:
        if all(r['exercise'] in retired for r in job['references']):job['status']='retired_question_removed'
        elif job['path'] in checked:job['status']='generated_and_visually_reviewed'
        else:job['status']='pending_generation'
    live=[j for j in jobs['images'] if j['status']!='retired_question_removed']
    jobs['status']='in_progress';jobs['scope']='Lot A1/A2 conservé après retrait des 297 anciennes références ; seules les questions encore présentes sont illustrées.'
    jobs['summary'].update(pending_images=sum(j['status']=='pending_generation' for j in live),
        pending_question_trios=len({(r['exercise'],r['question']) for j in live if j['status']=='pending_generation' for r in j['references']}),
        generated_images_in_this_file=sum(j['status']=='generated_and_visually_reviewed' for j in live),retired_image_requests=len(jobs['images'])-len(live))
    write(file,jobs)
    print(json.dumps(dict(active_phase_questions=len(read(work/'phase306-snapshot.json')),retired_phase_questions=306-len(read(work/'phase306-snapshot.json')),
        current_vocabulary_occurrences=len(uses),retained_reusable_image_files=len(manifest['images'])),ensure_ascii=False))


if __name__=='__main__':main()

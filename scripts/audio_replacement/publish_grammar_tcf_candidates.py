#!/usr/bin/env python3
"""Publish source-bound TCF cut evidence from the grammar originals, without listening claims."""
import argparse
import hashlib
import json
from pathlib import Path
import re


def read(path):return json.loads(Path(path).read_text())
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def write(path,data):Path(path).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')


def useful_text(text,number):
    if number>=227:
        heads={227:'Mais regarde',228:'Alors',229:'Bonjour',230:'Salut',231:'Allô',232:'alors',233:'Alors'}
        match=re.search(re.escape(heads[number]),text,re.I)
        if not match:raise ValueError('Missing reviewed bilan boundary')
        return text[match.start():]
    if re.search(r'Documents? A\.',text,re.I):
        text=re.split(r'Documents? A\.\s*',text,maxsplit=1,flags=re.I)[1]
    else:
        text=re.sub(r'^Pages?\s+.*?Exercices?\s+(?:\d+|quatre)\.?\s*','',text,flags=re.I)
    if number==44:text=re.sub(r'\s*Nous sommes ouverts.*$','',text)
    return text.strip()


def select_cut(link,cuts,filename):
    """Five rule references need their own numbered passage, never the whole list."""
    if filename=='piste067.mp3':
        match=re.search(r'vie-quotidienne-objet-4-([1-5])\.mp3$',link['old_ref'])
        if not match or len(cuts)!=5:raise ValueError('Unreviewed rule mapping')
        return cuts[int(match.group(1))-1]
    if len(cuts)!=1:raise ValueError('Ambiguous source passages')
    return cuts[0]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2])
    parser.add_argument('--work',type=Path,required=True)
    args=parser.parse_args();repo=args.repo;work=args.work
    folder=repo/'docs/tcf/remplacement-audio/rapprochement-432/extension-127'
    links=read(folder/'liaisons-a-decouper.json')['links']
    catalogue={s['source_id']:s for s in read(work/'source-catalogue.json')['sources']}
    transcript={r['exercise_id']:r for r in read(repo/'docs/grammaire/co-import/transcriptions.json')['transcriptions']}
    progress=read(work/'staged-boundaries-work/batch-progress.json')
    if not progress['complete'] or progress['blocked_sources']:raise ValueError('Finish every cut before publishing')
    manifests={r['source_id']:r for r in progress['sources']}
    prepared={r['source_id']:r for r in read(work/'staged-boundaries-work/mp3-index.json')['sources']}
    proposals=[];details=[]
    for link in links:
        sid=link['source_id'];source=catalogue[sid];row=manifests[sid];delivery=prepared[sid]
        if sha(source['source_file'])!=source['sha256'] or source['sha256']!=link['source_sha256']:
            raise ValueError('Original recording mismatch')
        if sha(row['manifest'])!=delivery['boundary_manifest_sha256']:raise ValueError('Boundary manifest changed')
        cut=select_cut(link,delivery['segments'],source['original_filename'])
        if sha(cut['file'])!=cut['sha256'] or not cut['probe']['full_decode_checked']:
            raise ValueError('Candidate file changed or incomplete decode')
        record=transcript[source['original_receipt']['exercise_id']]
        number=int(re.search(r'\d+',source['original_filename']).group())
        text=cut['transcription'] if number==67 else useful_text(record['selected_text'],number)
        if not text or re.search(r'(?i)\b(?:page\s+\d+|exercice\s+\d+)\b',text):
            raise ValueError('Instruction retained in proposed transcript')
        proof=link['signal_evidence']
        if len([a for a in proof['anchors'] if a['correlation']>=.8])<3 or proof['offset_spread_seconds']>.04:
            raise ValueError('Insufficient source identity evidence')
        proposal=dict(old_ref=link['old_ref'],exercise_ids=link['exercise_ids'],source_id=sid,
            source_sha256=source['sha256'],signal_status='signal_source_confirmed',
            proposed_ref=link['old_ref'],status='prepared_candidate_requires_listening_and_question_review',
            listening_performed=False,candidate_cut_id=cut['id'],candidate_sha256=cut['sha256'],
            proposed_name=cut['name'],proposed_tags=cut['tags'],proposed_transcription=text,
            source_start=cut['source_start_seconds'],source_end=cut['source_end_seconds'],
            source_batch='grammar-20261104',candidate_work_file=str(Path(cut['file']).relative_to(work)),
            review_flags=['source_cut_technically_checked_not_human_listening',
                          *(['transcript_has_documented_uncertainties'] if record['unresolved_points'] else [])],
            reconciliation_batch='20261104_grammar_131')
        proposals.append(proposal)
        details.append(dict(**proposal,original_filename=source['original_filename'],
            old_sha256=link['old_sha256'],boundary_manifest=str(Path(row['manifest']).relative_to(work)),
            boundary_manifest_sha256=delivery['boundary_manifest_sha256'],
            original_integrity=row['integrity'],probe=cut['probe'],
            source_identity_evidence=proof,transcript_unresolved_points=record['unresolved_points'],
            human_listening_performed=False,production_modified=False))
    if len(proposals)!=131 or len({p['old_ref'] for p in proposals})!=131:raise ValueError('Unexpected reference count')
    result=dict(schema_version=1,source_count=127,reference_count=131,lossless_cuts=131,
        mp3_candidates=131,geometrically_blocked_sources=0,work_root=str(work),
        preferred_plan_index=progress['plan_index'],
        human_listening_performed=False,production_modified=False,proposals=proposals)
    write(work/'prepared-grammar-proposals.json',result)
    write(folder/'decoupes-preparees.json',{k:v for k,v in result.items() if k!='proposals'}|dict(cuts=details))
    current_overrides=work/'segmentation-overrides-v3.json'
    write(folder/'segmentation-overrides.json',read(current_overrides if current_overrides.exists() else work/'segmentation-overrides-v2.json'))
    print(json.dumps({k:v for k,v in result.items() if k!='proposals'},ensure_ascii=False))


if __name__=='__main__':main()

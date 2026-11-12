#!/usr/bin/env python3
"""Bind the user's 433-trio backlog to current questions and reviewed reuse candidates.

Candidates are suggestions only. Full source context and visual review are still
required before activation; this report never writes to an exercise bank.
"""
from collections import Counter,defaultdict
import json,subprocess
from pathlib import Path
from tcf_context_audit import ROOT,BANKS,source_for,digest,semantic_question,text_form
from tcf_replace_vocabulary_images import checked_images,normalise

baseline='5e16eb69'
original=json.loads(subprocess.check_output(['git','show',baseline+':docs/tcf/revue-763-20261107.json'],cwd=ROOT))
initial=[r['key'] for r in original['questions'] if r['status'].startswith('artwork_needed')]
assert len(initial)==len(set(initial))==433
review=json.loads((ROOT/'docs/tcf/revue-763-20261107.json').read_text());reviews={r['key']:r for r in review['questions']}
banks={ex['id']:(path,ex) for path in BANKS for ex in json.loads(path.read_text())}
manifest=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()));labels=defaultdict(list)
for path,r in manifest.items():
 if r.get('label'):labels[normalise(r['label'])].append(dict(path=path,sha256=r['sha256'],label=r['label']))
phase=json.loads((ROOT/'docs/tcf/extension-573-20261107.json').read_text());jobs=defaultdict(list)
for job in phase['generation_jobs']:
 jobs[normalise(job['label'])].append({k:job[k] for k in ['id','status','source'] if k in job})

def prepare(key):
 r=reviews[key];path,ex=banks[r['exercise']];q=ex['questions'][r['question']-1];source,audio=source_for(ex,q);sem=semantic_question(q)
 assert digest(source)==r['source_sha256'] and digest(sem)==r['semantic_sha256'],key
 choices=[]
 for choice in text_form(q)['choix']:
  label=choice['texte'];choices.append(dict(id=choice['id'],label=label,correct=bool(choice.get('correct')),exact_label_reuse_candidates=labels.get(normalise(label),[]),generation_jobs=jobs.get(normalise(label),[])))
 return dict(key=key,bank=str(path.relative_to(ROOT)),exercise=ex['id'],question=r['question'],level=ex['niveau'],enonce=q['enonce'],source=source,audio=audio,source_sha256=r['source_sha256'],semantic_sha256=r['semantic_sha256'],current_status=r['status'],decision=r['reason'],choices=choices,active_images=r.get('selected_images',[]),constraints=r.get('brief',{}).get('constraints',[]),candidate_review_required=r['status']!='active_reviewed_trio',note='Une correspondance de libellé ne prouve pas la relation spatiale, le rôle, le compte ou la composition entière ; relire le support et contrôler les trois images avant activation.')

rows=[prepare(key) for key in initial]
extra=[prepare(r['key']) for r in review['questions'] if r['status'].startswith('artwork_needed') and r['key'] not in initial]
order={'A0-A1':0,'A1-A2':1,'A2-B1':2}
rows.sort(key=lambda r:(order.get(r['level'],3),r['bank'],r['exercise'],r['question']))
summary=dict(initial_trios=433,activated_since_baseline=sum(r['current_status']=='active_reviewed_trio' for r in rows),initial_pending=sum(r['current_status'].startswith('artwork_needed') for r in rows),additional_pending=len(extra),total_pending=sum(r['current_status'].startswith('artwork_needed') for r in rows)+len(extra),pending_by_level=dict(Counter(r['level'] for r in rows+extra if r['current_status'].startswith('artwork_needed'))))
report=dict(date='2026-11-12',baseline_commit=baseline,scope='433 trios demandés, réemplois proposés liés aux questions actuelles ; reprise supplémentaire d’un ancien trio invalidé par une correction audio.',summary=summary,questions=rows,additional_questions=extra)
(ROOT/'docs/tcf/preparation-433-trios-20261112.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False))

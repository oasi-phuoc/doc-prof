"""Activate only the complete, source-bound trios approved in the 763-question review."""
from collections import Counter
import argparse
from copy import deepcopy
import json
from tcf_context_audit import ROOT,BANKS,source_for,digest,semantic_question,text_form
from tcf_context_images import PLAN,JOURNAL
from tcf_replace_vocabulary_images import checked_images

ledger_path=ROOT/'docs/tcf/revue-763-20261107.json';ledger=json.loads(ledger_path.read_text())
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--key', action='append', help='Apply only these individually reviewed question keys.')
args=parser.parse_args()
selected=set(args.key or [])
assert ledger['initial_review_complete'] and ledger['review_pending']==0
reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
rows={r['key']:r for r in ledger['questions']};assert len(rows)==763
assert not selected-set(rows), 'Unknown review key'
plan=json.loads(PLAN.read_text());plans={r['key']:r for r in plan['questions']}
journal=json.loads(JOURNAL.read_text());ops=journal['operations'];changed=0
for bank in BANKS:
 data=json.loads(bank.read_text());dirty=False;rel=str(bank.relative_to(ROOT))
 for ex in data:
  for i,q in enumerate(ex.get('questions',[]),1):
   key=f"{ex['id']}#{i}";row=rows.get(key)
   if not row:continue
   if selected and key not in selected:continue
   source,_=source_for(ex,q);assert digest(source)==row['source_sha256'];assert digest(semantic_question(q))==row['semantic_sha256']
   assert row['reviewed'];p=plans[key];p['review_763_decision']=row['status'];p['review_763_reason']=row['reason']
   if row['status'] not in ['ready_reviewed_trio','active_reviewed_trio']:
    assert not q.get('formes',{}).get('qcm_image'),key
    p['status']='reviewed_763_keep_text' if row['status'].startswith('keep_text') else 'reviewed_763_artwork_pending'
    continue
   targets=row['selected_images'];assert len(set(targets))==3
   assert all(t in reviewed and reviewed[t]['sha256']==s for t,s in zip(targets,row['selected_sha256']))
   text=text_form(q);form=dict(melanger=text.get('melanger',q.get('melanger',True)),choix=[dict(id=c['id'],image=t,**({'correct':True} if c.get('correct') else {})) for c,t in zip(text['choix'],targets)])
   old=deepcopy(q.get('formes',{}).get('qcm_image'))
   p.update(status='reviewed_trio',targets=targets,target_sha256=row['selected_sha256'],reason=row['reason'],method='individual_763_candidate_review',review_763_decision='active_reviewed_trio')
   if old!=form:
    assert old is None,key
    node=['questions',i-1,'formes','qcm_image']
    prior=[o for o in ops if o['bank']==rel and o['exercise']==ex['id'] and o['node']==node]
    operation=dict(bank=rel,exercise=ex['id'],question=i,node=node,before=None,after=deepcopy(form),source_sha256=row['source_sha256'],reason=row['reason'],review_ledger='docs/tcf/revue-763-20261107.json')
    if prior:
     # A corrected source can explicitly deactivate an earlier trio. Its
     # unique journal entry remains, with the refresh note and old reason.
     assert len(prior)==1 and prior[0].get('source_refresh_note'),key
     assert prior[0]['before'] is None and prior[0]['after'] is None,key
     assert prior[0]['source_sha256']==row['source_sha256'],key
     prior[0]['previous_activation_reason']=prior[0]['reason']
     prior[0].update(operation)
    else:ops.append(operation)
    q.setdefault('formes',{})['qcm_image']=form;dirty=True;changed+=1
   row['status']='active_reviewed_trio'
 if dirty:bank.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
ledger['summary']=dict(Counter(r['status'] for r in ledger['questions']));ledger['activated_total']=sum(r['status']=='active_reviewed_trio' for r in ledger['questions'])
ledger['retained_text_total']=sum(r['status'].startswith('keep_text') for r in ledger['questions']);ledger['artwork_pending_total']=sum(r['status'].startswith('artwork_needed') for r in ledger['questions'])
ledger_path.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
plan['summary']=dict(Counter(r['status'] for r in plan['questions']));PLAN.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');JOURNAL.write_text(json.dumps(journal,ensure_ascii=False,indent=2)+'\n')
print('Activated',changed,'new trios;',ledger['activated_total'],'active;',ledger['retained_text_total'],'text;',ledger['artwork_pending_total'],'await artwork.')

"""Apply only the individually reviewed replacements in the 254-use review ledger."""
from collections import Counter
from copy import deepcopy
import hashlib,json
from tcf_context_audit import ROOT,BANKS,source_for,digest
from tcf_context_images import PLAN,JOURNAL
from tcf_replace_vocabulary_images import checked_images

ledger_path=ROOT/'docs/tcf/revue-254-usages-20261107.json'
ledger=json.loads(ledger_path.read_text())
reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
replacements={}
for row in ledger['images']:
 if row['decision']=='retain_existing_after_visual_review':continue
 target=row.get('target')
 if row.get('job_id'):target='/lib/images/tcf/qcm-audit/'+row['job_id']+'.webp'
 assert target in reviewed,(row['image'],target)
 original=ROOT/'public'/row['image'].lstrip('/')
 assert hashlib.sha256(original.read_bytes()).hexdigest()==row['sha256'],row['image']
 replacements[row['image']]=target
 if row.get('job_id'):row['decision']='redrawn_reviewed_and_applied'
 row['target']=target;row['target_sha256']=reviewed[target]['sha256'];row['status']='visually_reviewed_and_applied'
plan=json.loads(PLAN.read_text());plans={r['key']:r for r in plan['questions']}
journal=json.loads(JOURNAL.read_text());ops=journal['operations'];changes=[]

def replace(value,node=()):
 if isinstance(value,dict):
  for k,v in value.items():
   if isinstance(v,str) and v in replacements:
    value[k]=replacements[v];changes.append(dict(node=list(node+(k,)),before=v,after=value[k]))
   else:replace(v,node+(k,))
 elif isinstance(value,list):
  for i,v in enumerate(value):
   if isinstance(v,str) and v in replacements:
    value[i]=replacements[v];changes.append(dict(node=list(node+(i,)),before=v,after=value[i]))
   else:replace(v,node+(i,))

for bank in BANKS:
 data=json.loads(bank.read_text());dirty=False;rel=str(bank.relative_to(ROOT))
 for ex in data:
  original=deepcopy(ex);start=len(changes);replace(ex)
  if len(changes)==start:continue
  dirty=True
  for c in changes[start:]:c.update(bank=rel,exercise=ex['id'])
  for i,(q,old) in enumerate(zip(ex.get('questions',[]),original.get('questions',[])),1):
   form=q.get('formes',{}).get('qcm_image');before=old.get('formes',{}).get('qcm_image')
   if form==before:continue
   row=plans[f"{ex['id']}#{i}"];row['targets']=[c['image'] for c in form['choix']];row['target_sha256']=[reviewed[p]['sha256'] if p in reviewed else None for p in row['targets']]
   row['status']='reviewed_trio' if all(row['target_sha256']) else 'existing_variant_partial_reviewed_reuse'
   node=['questions',i-1,'formes','qcm_image'];op=next((o for o in ops if o['bank']==rel and o['exercise']==ex['id'] and o['node']==node),None)
   if op:op['after']=deepcopy(form)
   else:
    source,_=source_for(ex,q);ops.append(dict(bank=rel,exercise=ex['id'],question=i,node=node,before=before,after=deepcopy(form),source_sha256=digest(source),reason='Revue des 254 usages : sujet et sens conservés, illustration validée en 4:3.'))
  for c in changes[start:]:
   if c['node'][0]=='questions':continue
   op=next((o for o in ops if o['bank']==rel and o['exercise']==ex['id'] and o['node']==c['node']),None)
   if op:op['after']=c['after']
   else:ops.append(dict(**c,source_binding='whole_support_transcription',source_sha256=digest(ex.get('support',{}).get('transcription','')),reason='Revue des 254 usages : remplacement exact de la scène ou du support, sans modifier le texte ni la piste.'))
 if dirty:bank.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
plan['summary']=dict(Counter(r['status'] for r in plan['questions']))
PLAN.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');JOURNAL.write_text(json.dumps(journal,ensure_ascii=False,indent=2)+'\n')
ledger['summary']=dict(retained_existing=sum(r['decision']=='retain_existing_after_visual_review' for r in ledger['images']),reused_reviewed=sum(r['decision']=='reuse_reviewed_whole_meaning' for r in ledger['images']),redrawn_reviewed=sum(r.get('job_id') is not None for r in ledger['images']),pending=0)
if changes:ledger['applied_changes']=changes;ledger['changed_usages']=len(changes)
ledger_path.write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
print(ledger['summary'],len(changes),'usages remplacés')

"""Install the four pictograms explicitly requested on 7 November 2026."""
from collections import Counter
from copy import deepcopy
import json
from tcf_context_audit import ROOT,BANKS,source_for,digest
from tcf_context_images import PLAN,JOURNAL
from tcf_replace_vocabulary_images import checked_images

folder='/lib/images/tcf/qcm-audit/'
replacements={folder+'vocab-par-telephone.webp':folder+'communication-appeler.webp',folder+'audit-context-envoyer-texto.webp':folder+'communication-message.webp',folder+'audit-context-ecrire-courriel.webp':folder+'communication-courriel.webp',folder+'audit-context-ecrire-lettre.webp':folder+'communication-lettre.webp'}
manifest_path=ROOT/'docs/tcf/images-generees.json';manifest=json.loads(manifest_path.read_text());reviewed=checked_images(manifest)
assert all(p in reviewed for p in replacements.values())
plan=json.loads(PLAN.read_text());rows={r['key']:r for r in plan['questions']};journal=json.loads(JOURNAL.read_text());ops=journal['operations'];changes=[]

def replace(value,node=()):
 if isinstance(value,dict):
  for k,v in value.items():
   if k=='image' and v in replacements:
    value[k]=replacements[v];changes.append(dict(node=list(node+(k,)),before=v,after=value[k]))
   else:replace(v,node+(k,))
 elif isinstance(value,list):
  for i,v in enumerate(value):replace(v,node+(i,))

for bank in BANKS:
 data=json.loads(bank.read_text());dirty=False
 for ex in data:
  originals=deepcopy(ex);start=len(changes);replace(ex)
  if len(changes)==start:continue
  dirty=True
  for c in changes[start:]:c.update(bank=str(bank.relative_to(ROOT)),exercise=ex['id'])
  for i,(q,old) in enumerate(zip(ex.get('questions',[]),originals.get('questions',[])),1):
   form=q.get('formes',{}).get('qcm_image');before=old.get('formes',{}).get('qcm_image')
   if form==before:continue
   row=rows[f"{ex['id']}#{i}"];row['targets']=[c['image'] for c in form['choix']];row['target_sha256']=[reviewed[p]['sha256'] if p in reviewed else None for p in row['targets']]
   row['status']='reviewed_trio' if all(row['target_sha256']) else 'existing_variant_partial_reviewed_reuse'
   row['communication_icons_review']='Correction pictographique explicite du 7 novembre ; même modèle pour les deux téléphones et les deux enveloppes.'
   node=['questions',i-1,'formes','qcm_image'];op=next((o for o in ops if o['bank']==str(bank.relative_to(ROOT)) and o['exercise']==ex['id'] and o['node']==node),None)
   if op:op['after']=deepcopy(form)
   else:
    source,_=source_for(ex,q);ops.append(dict(bank=str(bank.relative_to(ROOT)),exercise=ex['id'],question=i,node=node,before=before,after=deepcopy(form),source_sha256=digest(source),reason=row['communication_icons_review']))
  for c in changes[start:]:
   if c['node'][0]=='questions':continue
   op=next((o for o in ops if o['bank']==c['bank'] and o['exercise']==ex['id'] and o['node']==c['node']),None)
   if op:op['after']=c['after']
   else:
    source,_=source_for(ex,{});ops.append(dict(**c,source_sha256=digest(source),reason='Pictogramme de communication corrigé selon la demande du 7 novembre.'))
 if dirty:bank.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
for r in manifest['images']:
 if r['path'] in replacements:r['superseded_for_communication_action_by']=replacements[r['path']]
for name in ['remplacement-images-vocabulaire.json']:
 path=ROOT/'docs/tcf'/name;data2=json.loads(path.read_text())
 for r in data2.get('approved_reuses',[]):
  if r['image'] in replacements:r['image']=replacements[r['image']]
 data2['communication_icon_overrides']=replacements;path.write_text(json.dumps(data2,ensure_ascii=False,indent=2)+'\n')
plan['summary']=dict(Counter(r['status'] for r in plan['questions']));PLAN.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');JOURNAL.write_text(json.dumps(journal,ensure_ascii=False,indent=2)+'\n');manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
report=dict(date='2026-11-07',request='Téléphone avec combiné pour appeler ; même téléphone avec bulle pour un message ; enveloppe ouverte avec @ pour le courriel ; même enveloppe avec feuille lignée pour la lettre.',review='Quatre images contrôlées visuellement ; aucun personnage, aucune scène supplémentaire.',replacements=replacements,summary=dict(changed_usages=len(changes)),changes=changes)
(ROOT/'docs/tcf/communication-pictogrammes-20261107.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(report['summary'])

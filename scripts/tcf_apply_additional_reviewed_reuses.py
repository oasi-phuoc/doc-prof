"""Apply the supplementary whole-place visual review without replaying the plan."""
from collections import Counter
from copy import deepcopy
import json
from tcf_context_audit import ROOT,BANKS,source_for,digest,text_form
from tcf_context_images import PLAN,JOURNAL
from tcf_replace_vocabulary_images import checked_images,normalise

manifest=json.loads((ROOT/'docs/tcf/images-generees.json').read_text());checked=checked_images(manifest);ids={r['id']:p for p,r in checked.items()}
# Reviewed on contact sheets: the sea, mountains and countryside remain clearly
# distinct; a sports lesson uses the teacher scene, not the empty gymnasium.
reuses={
 'co306-mer-plages-dessine':['À la mer','De la plage','À la plage','Au bord de la mer','La plage','La mer'],
 'co306-montagnes-forets-dessine':['La montagne','À la montagne','Les montagnes','De la montagne'],
 'co306-campagne-rivieres-dessine':['La campagne','À la campagne'],
 'co306-gymnase-municipal-dessine':['Dans le gymnase','Le gymnase','Au gymnase'],
 'co306-professeure-sport-dessine':['Un cours de sport','Le cours de sport'],
 'co834-aller-stade-dessine':['Au stade','Un stade','Le stade','Le stade de foot'],
 'vocab-chambre-simple':['La chambre','Dans la chambre'],
 'co306-bureau-poste-dessine':['À la poste','La poste'],
 'co306-centre-sportif-dessine':['Dans un club sportif','Un club sportif','Le club de sport','Le club sportif'],
 'co306-grande-salle-fetes-dessine':['Dans la salle des fêtes','À la salle des fêtes'],
 'co306-professeure-musique-dessine':['Le cours de musique','La salle de musique','Dans la salle de musique','Un cours de musique'],
 'co834-rayon-vetements-dessine':['Une boutique de vêtements','Un magasin de vêtements','Le magasin de vêtements'],
 'audit-context-cour-ecole':['Dans la cour'],
 'co834-seance-cinema-dessinee':['Aller au cinéma'],
 'co306-musee-dessine':['Aller au musée'],
 'co306-theatre-dessine':['Aller au théâtre'],
 'co306-restaurant-dessine':['Aller au restaurant','Un repas au restaurant'],
 'co834-concert-dessine':['À un concert','Aller au concert'],
 'co834-tablette-dessinee':['Une tablette tactile'],
 'vocab-serviette':['Une serviette de bain'],
 'co834-legumes-dessines':['Des légumes'],
 'audit-context-paire-patins':['Des patins'],
 'co306-mairie-dessine':["L'hôtel de ville"],
}
aliases={normalise(label):ids[key] for key,labels in reuses.items() for label in labels}
plan=json.loads(PLAN.read_text());rows={r['key']:r for r in plan['questions']};journal=json.loads(JOURNAL.read_text());ops=journal['operations'];count=0
for bank in BANKS:
 data=json.loads(bank.read_text());dirty=False
 for ex in data:
  for i,q in enumerate(ex.get('questions',[]),1):
   image=q.get('formes',{}).get('qcm_image')
   if not image:continue
   original=deepcopy(image);labels={c['id']:c['texte'] for c in text_form(q).get('choix',[])}
   changed=[]
   for c in image['choix']:
    if c['image'] in checked:continue
    target=aliases.get(normalise(labels[c['id']]))
    if target and target not in {x['image'] for x in image['choix']}:
     changed.append(dict(choice=c['id'],label=labels[c['id']],before=c['image'],after=target,sha256=checked[target]['sha256']))
     c['image']=target;count+=1
   if not changed:continue
   dirty=True;key=f"{ex['id']}#{i}";r=rows[key];r['targets']=[c['image'] for c in image['choix']];r['target_sha256']=[checked[p]['sha256'] if p in checked else None for p in r['targets']]
   r['status']='reviewed_trio' if all(r['target_sha256']) else 'existing_variant_partial_reviewed_reuse';r.setdefault('supplementary_visual_reviews',[]).extend(changed)
   source,_=source_for(ex,q);node=['questions',i-1,'formes','qcm_image'];op=next((o for o in ops if o['bank']==str(bank.relative_to(ROOT)) and o['exercise']==ex['id'] and o['node']==node),None)
   if op:op['after']=deepcopy(image)
   else:ops.append(dict(bank=str(bank.relative_to(ROOT)),exercise=ex['id'],question=i,node=node,before=original,after=deepcopy(image),source_sha256=digest(source),reason='Réutilisations supplémentaires de lieux et activités, relues visuellement dans leur sens entier.'))
 if dirty:bank.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
plan['summary']=dict(Counter(r['status'] for r in plan['questions']));PLAN.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n');JOURNAL.write_text(json.dumps(journal,ensure_ascii=False,indent=2)+'\n');print('Additional image uses replaced:',count)

"""Inventory every CE/CO image use and distinguish concrete gaps from text tasks."""
from collections import Counter
import json
from pathlib import Path
import re
from tcf_context_audit import ROOT,BANKS,digest,source_for,text_form
from tcf_context_images import PLAN
from tcf_replace_vocabulary_images import checked_images,normalise

reviewed=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
plan=json.loads(PLAN.read_text());plans={r['key']:r for r in plan['questions']}
priorities=set(json.loads((ROOT/'docs/tcf/demande-audit-ce-co-20261106.json').read_text())['priority_examples'])
images=[];text_tasks=[];priority=[];unresolved=[]
def paths(value,node=()):
    if isinstance(value,dict):
        for k,v in value.items():yield from paths(v,node+(k,))
    elif isinstance(value,list):
        for i,v in enumerate(value):yield from paths(v,node+(i,))
    elif isinstance(value,str) and value.startswith('/lib/images/'):yield node,value

def text_status(q):
    question=normalise(q['enonce']);labels=[normalise(c['texte']) for c in text_form(q).get('choix',[])]
    if re.search(r'quel jour|quand |date|quel mois|quelle annee|prenom|quel age|nationalite|quelle langue|a quelle frequence|quel numero|quelle adresse',question):return 'text_required_calendar_identity_or_language'
    if re.search(r'combien.*(?:coute|prix|euro|franc|reduction|ans|annees|kilo|gramme)',question) or any(re.search(r'euro|franc|\bchf\b|\bkg\b|\bg\b|%',l) for l in labels):return 'text_required_amount_measure_or_rate'
    if re.search(r'^qui |avec qui|a qui |chez qui|lien.*famille|quelle maladie',question):return 'text_required_person_role_or_diagnosis'
    if re.search(r'quel(?:s|le|les)? (?:objet|animal|sport|fruit|legume|vetement|aliment|document|appareil|meuble|cadeau|dessert|plat|metier|accessoire|boisson|produit|ustensile|recipient|moyen de transport)|(?:quel|quelle|quels) .*couleur|ou .*|quel lieu|quel type de (?:commerce|magasin|lieu|logement)|combien.*(?:oeufs|œufs|livres|dvd|poires|tomates)|combien de temps',question):return 'concrete_visual_trio_to_prepare_or_review'
    return 'editorial_visual_screening_needed'

for bank in BANKS:
    relative=str(bank.relative_to(ROOT))
    for ex in json.loads(bank.read_text()):
        for node,path in paths(ex):
            item=dict(bank=relative,exercise=ex['id'],node=list(node),image=path,
                      status='reviewed_style_and_file' if path in reviewed else 'style_or_semantic_visual_review_required')
            if node[0]=='questions':
                q=ex['questions'][node[1]];source,audio=source_for(ex,q);item.update(question=node[1]+1,enonce=q['enonce'],source_sha256=digest(source),audio=audio)
                if len(node)>4 and node[2:4]==('formes','qcm_image'):
                    try:
                        choice=q['formes']['qcm_image']['choix'][node[5]]
                        item['label']=next(c['texte'] for c in text_form(q)['choix'] if c['id']==choice['id'])
                    except (KeyError,IndexError,StopIteration):pass
            images.append(item)
            if path not in reviewed:unresolved.append(item)
        for i,q in enumerate(ex.get('questions',[]),1):
            if len(text_form(q).get('choix',[]))!=3:continue
            key=f"{ex['id']}#{i}";p=plans[key]
            if not q.get('formes',{}).get('qcm_image'):
                source,audio=source_for(ex,q)
                status=text_status(q)
                item=dict(key=key,bank=relative,exercise=ex['id'],question=i,enonce=q['enonce'],labels=[c['texte'] for c in text_form(q)['choix']],status=status,source_sha256=digest(source),audio=audio)
                text_tasks.append(item)
            if ex['id'] in priorities:
                priority.append(dict(key=key,enonce=q['enonce'],labels=[c['texte'] for c in text_form(q)['choix']],image_variant_active=bool(q.get('formes',{}).get('qcm_image')),review_decision=p['status']))
summary=dict(total_active_image_usages=len(images),reviewed_image_usages=sum(r['status']=='reviewed_style_and_file' for r in images),remaining_image_usages=len(unresolved),remaining_distinct_images=len({r['image'] for r in unresolved}),text_questions_by_review_category=dict(Counter(r['status'] for r in text_tasks)),priority_questions=len(priority),priority_active_image_variants=sum(r['image_variant_active'] for r in priority))
report=dict(date='2026-11-06',summary=summary,method='Contrôle de tous les chemins CE/CO contre le manifeste des images relues et leurs empreintes. Les catégories des questions textuelles servent au tri éditorial : elles ne constituent pas un nombre ferme d’images à générer. Réutiliser la banque avant toute génération et activer seulement un trio entier distinguable.',remaining_image_uses=unresolved,text_question_inventory=text_tasks,priority_examples=priority)
(ROOT/'docs/tcf/images-restantes-contextuelles-20261106.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False))

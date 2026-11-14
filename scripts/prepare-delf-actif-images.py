#!/usr/bin/env python3
"""Track all new DELF Actif questions; propose reusable art without activating it."""
from collections import Counter,defaultdict
import importlib.util
import json
from pathlib import Path
import re
from tcf_context_audit import ROOT,digest,source_for,semantic_question,text_form,source_words
from tcf_replace_vocabulary_images import checked_images,normalise,compatible_reuse
from tcf_qcm_images import clock_time,resolve_image

DOCS=ROOT/'docs/tcf/delf-actif-20261113'
STYLE='48a753d8d6bd095e41968b39da88dbcb331fee11'
CONSTRAINTS=[
 'Relire la transcription et les trois réponses ; ne dessiner que les détails utiles effectivement décrits.',
 'Quand les trois réponses sont illustrables, réemployer les images adaptées et générer les manquantes ; intégrer le trio après contrôle visuel.',
 'Réemployer une image seulement après examen visuel de son sens entier, couleur, quantité, action et contexte.',
 'Trois images distinctes ; mêmes identifiants et mêmes bonnes réponses que le QCM texte, conservé avec sa réponse écrite.',
 'Peinture semi-réaliste douce du commit 48a753d8, contours fins, couleurs naturelles ; objets sur crème.',
 'Paysage 4:3 exact, sujets entiers ; préserver les PNG originaux sans conversion.',
 'Pas de montant, date, jour ou mois. Les heures sont possibles sur des cadrans exacts et distincts.',
 'Personnages différents entre scènes : origines, genres, âges, morphologies et handicaps variés, sans clichés ni nationalité déduite du visage.',
 'Ne pas activer un trio incomplet ou dont la source, les choix ou le corrigé ont changé.'
]

def load_visual():
 spec=importlib.util.spec_from_file_location('legacy_visual_proposals',ROOT/'scripts/plan-tcf-qcm-images.py')
 module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module.visual


def candidate_allowed(label,question,path,manifest,source=''):
 if not compatible_reuse(label,path,manifest):return False
 base=normalise(label)
 if base=='orange' and 'couleur' in normalise(question) and ('extension573-orange.webp' in path or 'vocab-oranges' in path):return False
 context=normalise(question+' '+source)
 if base=='creme' and re.search(r'parfum|cosmet|soin',context) and 'creme-alimentaire' in path:return False
 if base=='creme' and re.search(r'recette|cuisine|aliment',context) and 'creme-cosmetique' in path:return False
 if base=='patisserie' and re.search(r'magasin|entrer|habite|en face',normalise(question)) and path.endswith('/vocab-patisserie.webp'):return False
 if base=='chocolat' and 'boisson' in normalise(question) and (path.endswith('/co834-chocolat-dessine.webp') or 'chocolat-tablette' in path):return False
 if base in {'feuille','feuilles'} and re.search(r'papier|cahier|papeterie|dessin|crayon|stylo',context) and re.search(r'/vocab-feuilles?\.webp$',path):return False
 if base in {'fromage','legumes','poulet'} and 'pates-' in path:return False
 if 'marche' in label.casefold() and 'marché' not in label.casefold() and re.search(r'deplacement|transport',normalise(question)) and path.endswith('/bg/marche.webp'):return False
 if base=='film' and re.search(r'spectacle|sortie',normalise(question)) and 'dvd' in path:return False
 return True


def classify(question,labels,visual):
 stem=normalise(question)
 joined=' '.join(normalise(s) for s in labels)
 if re.search(r'\b(?:prix|tarif|montant|pourcentage|reduction|salaire|valeur du bon)\b',stem) or re.search(r'euros?|francs?|centimes?|\bchf\b|[€$£%]',joined):
  return 'keep_text_amount','La distinction porte sur un montant ou une réduction ; ne pas produire de prix en image.'
 times=[clock_time(s,question) for s in labels]
 if all(t is not None for t in times):
  return 'candidate_visual_review','Trois horaires précis à représenter. Vérifier notamment que les cadrans distinguent toutes les heures, y compris matin/soir.'
 if re.search(r'quel(?:le)?(?:s)? (?:jour|date|mois|annee)|quel age|quelle frequence|combien de temps|dans combien de temps|combien.*(?:jours?|semaines?|mois|annees?|ans|heures?|minutes?)',stem) or re.search(r'\b(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\b',joined):
  return 'keep_text_calendar_or_duration','Date, âge, fréquence ou durée : conserver la réponse textuelle ; une horloge isolée ne prouve pas cette portée temporelle.'
 if re.search(r'quel(?:le)? (?:ville|pays|nationalite|marque|modele|numero|prenom|langue)|comment.*appelle|qui.*(?:anniversaire|laisse le message|attend ses parents)',stem):
  return 'keep_text_named_identity_or_code','Nom propre, pays, identité, langue ou identifiant ; ne pas remplacer par un visage, un drapeau ou un code arbitraire.'
 if all(visual(label,question) for label in labels):
  return 'candidate_visual_review','Les trois réponses ont une représentation concrète proposée ; contexte et images doivent encore être relus individuellement.'
 return 'needs_context_review','Examiner chaque réponse entière avant de décider : action, relation, abstraction ou composition peuvent rendre une illustration ambiguë. Aucune exclusion définitive sur ce seul tri automatique.'


def main():
 visual=load_visual();manifest=checked_images(json.loads((ROOT/'docs/tcf/images-generees.json').read_text()))
 aliases=defaultdict(set)
 for path,row in manifest.items():
  if row.get('label'):aliases[normalise(row['label'])].add(path)
 for row in json.loads((ROOT/'scripts/tcf-qcm-image-registry.json').read_text()):
  if row['path'] in manifest:
   for alias in row.get('aliases',[]):aliases[normalise(alias)].add(row['path'])
 installation=json.loads((DOCS/'installation.json').read_text())
 legacy_pending=json.loads((ROOT/'docs/tcf/revue-763-20261107.json').read_text())['artwork_pending_total']
 installed={r['exercise_id']:r for r in installation['units']}
 existing={}
 p=DOCS/'images-a-preparer.json'
 if p.exists():existing={r['key']:r for r in json.loads(p.read_text())['questions']}
 review_path=DOCS/'revue-contexte-20261114.json'
 review_data=json.loads(review_path.read_text()) if review_path.exists() else {}
 reviews={r['key']:r for r in review_data.get('questions',[]) if r.get('review_status')=='reviewed'}
 supports=[];questions=[];assets={}
 for folder in ['a0-a1','a1-a2','a2-b1']:
  bank=ROOT/f'src/tcf/content/{folder}/co.json'
  for ex in json.loads(bank.read_text()):
   if ex['id'] not in installed:continue
   record=installed[ex['id']];source,audio=source_for(ex,{})
   supports.append(dict(exercise=ex['id'],level=ex['niveau'],title=ex.get('scene'),audio=audio,audio_sha256=record['audio_sha256'],source=source,source_sha256=digest(source)))
   for index,q in enumerate(ex['questions'],1):
    key=f"{ex['id']}#{index}";labels=[c['texte'] for c in text_form(q)['choix']]
    status,reason=classify(q['enonce'],labels,visual);choices=[]
    context=reviews.get(key)
    if context:
     assert context['source_sha256']==digest(source),f'{key}: transcription modifiée depuis la relecture'
     assert context['audio']==audio and context['audio_sha256']==record['audio_sha256'],f'{key}: audio modifié depuis la relecture'
     assert context['reviewed_semantic_sha256']==digest(semantic_question(q)),f'{key}: question modifiée depuis la relecture'
     assert ' '.join(source_words(context['evidence_quote'])) in ' '.join(source_words(source)),key
     assert context['decision'] in {'candidate_visual_review','keep_text_contextual'},key
     status,reason=context['decision'],context['reason']
    for c in text_form(q)['choix']:
     candidates=set(aliases[normalise(c['texte'])]);resolved=resolve_image(c['texte'],q['enonce'])
     if normalise(c['texte'])=='orange' and 'couleur' in normalise(q['enonce']):
      candidates.update(p for p in manifest if 'extension573-couleur-orange' in p)
     if resolved in manifest:candidates.add(resolved)
     if normalise(c['texte'])=='creme' and re.search(r'parfum|cosmet|soin',normalise(q['enonce']+' '+source)):
      candidates.update(p for p in manifest if 'extension573-creme-cosmetique' in p)
     if normalise(c['texte'])=='patisserie' and re.search(r'magasin|entrer|habite|en face',normalise(q['enonce'])):
      candidates.update(p for p in manifest if p.endswith('/co/bg/patisserie.webp'))
     if normalise(c['texte'])=='chocolat' and 'boisson' in normalise(q['enonce']):
      candidates.update(p for p in manifest if p.endswith('/co834-chocolat-chaud-dessine.webp'))
     if normalise(c['texte']) in {'feuille','feuilles'} and re.search(r'papier|cahier|papeterie|dessin|crayon|stylo',normalise(q['enonce']+' '+source)):
      paper='/vocab-papiers.webp' if normalise(c['texte'])=='feuilles' else '/vocab-feuille-papier.webp'
      candidates.update(p for p in manifest if p.endswith(paper))
     options=[dict(path=p,sha256=manifest[p]['sha256'],label=manifest[p].get('label'),visual_review_required=True) for p in sorted(candidates) if candidate_allowed(c['texte'],q['enonce'],p,manifest,source)]
     asset=digest(dict(label=normalise(c['texte']),question_context=normalise(q['enonce']) if re.search(r'\b(?:cafe|bureau|carte|casque|cuisiniere)\b',normalise(c['texte'])) else ''))[:16]
     brief=f"Représenter entièrement « {c['texte']} » pour « {q['enonce']} ». Vérifier la transcription du support {ex['id']} avant génération ; conserver quantité, couleur et relations exprimées, sans inventer de détail d’identité."
     if context:brief+=' Relecture du trio : '+context['reason']
     choices.append(dict(id=c['id'],label=c['texte'],correct=bool(c.get('correct')),reuse_candidates=options,asset=asset,brief=brief))
     if status=='candidate_visual_review':assets.setdefault(asset,dict(id=asset,label=c['texte'],reuse_candidates=options,references=[]))['references'].append(dict(key=key,choice=c['id']))
    form=q.get('formes',{}).get('qcm_image');active=[]
    if form:
     assert len(form['choix'])==3 and len({c['image'] for c in form['choix']})==3,key
     for c,t in zip(form['choix'],text_form(q)['choix']):
      assert c['id']==t['id'] and bool(c.get('correct'))==bool(t.get('correct')),key
      assert c['image'] in manifest,key
      active.append(dict(id=c['id'],path=c['image'],sha256=manifest[c['image']]['sha256']))
     status,reason='active_reviewed_trio','Trio complet relu et activé ; voir le registre de relecture visuelle lié à cette question.'
    previous=existing.get(key,{})
    row=dict(key=key,bank=str(bank.relative_to(ROOT)),exercise=ex['id'],question=index,level=ex['niveau'],enonce=q['enonce'],source_sha256=digest(source),semantic_sha256=digest(semantic_question(q)),audio=audio,audio_sha256=record['audio_sha256'],status=status,reason=reason,choices=choices,active_images=active,candidate_review_required=status not in ['active_reviewed_trio'],constraints=CONSTRAINTS)
    if context:
     row['context_review']=dict(register=str(review_path.relative_to(ROOT)),decision=context['decision'],evidence_quote=context['evidence_quote'],semantic_sha256=context['reviewed_semantic_sha256'],note=context['reason'])
    if previous.get('visual_review'):
     assert previous['source_sha256']==row['source_sha256'] and previous['semantic_sha256']==row['semantic_sha256'],key
     row['visual_review']=previous['visual_review']
    questions.append(row)
 assert len(supports)==346 and len(questions)==1663
 statuses=Counter(r['status'] for r in questions)
 summary=dict(supports=346,questions=1663,statuses=dict(statuses),by_level={level:dict(Counter(r['status'] for r in questions if r['level']==level)) for level in ['A0-A1','A1-A2','A2-B1']},candidate_distinct_assets=len(assets),context_reviews=len(reviews),context_review_corrected_questions=review_data.get('summary',{}).get('corrected_questions',0))
 data=dict(date='2026-11-14',user_request='Ajouter aux tâches les illustrations possibles des nouveaux audios A1/A2/B1 ; priorité A1 puis A2, réemploi de la banque et style 4:3 validé.',style_reference_commit=STYLE,scope='Extension distincte du suivi historique ; couvre toutes les questions des 346 nouveaux supports sans remplacer les anciens suivis.',method='Décisions de contexte relues individuellement conservées tant que source, audio et sens restent identiques ; tri conservateur pour les autres questions. Les candidats et correspondances de libellés ne constituent pas une validation visuelle ; aucune mutation des banques.',summary=summary,supports=supports,questions=questions,assets=list(assets.values()))
 p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 lines=['# Illustrations des nouveaux audios DELF Actif','',f"346 supports audio et 1 663 questions suivis. {statuses['candidate_visual_review']} trios concrets proposés à vérifier, {statuses['active_reviewed_trio']} trios activés, {statuses['needs_context_review']} questions à examiner plus précisément.",'', 'La génération des illustrations fait partie des tâches de ces nouveaux audios dès que les trois réponses sont illustrables : réutiliser les images adaptées, générer celles qui manquent, puis intégrer le trio contrôlé. Le tri automatique ne vaut pas relecture visuelle.','', f'Cette extension complète les {legacy_pending} anciens trios en attente sans les fusionner dans un compteur de questions déjà illustrables. Les dates, montants, noms et durées restent en texte quand une image ne prouve pas la réponse.','', 'Ordre : A1, puis A2, puis B1. Réutiliser la banque avant toute génération. Trois réponses entières et distinctes, images 4:3 dans le style 48a753d8 ; personnages variés et inclusifs.','', 'Le JSON conserve chaque support et son empreinte, les trois réponses, les candidats de réemploi, les briefs et les statuts de préparation. Aucune variante image incomplète n’est activée.','', '```sh','python3 scripts/prepare-delf-actif-images.py','python3 scripts/check-delf-actif-images.py','```','']
 if reviews:lines[3:3]=[f"Les {len(reviews):,} questions en attente de contexte ont été relues avec leur transcription complète et leurs trois réponses ; {summary['context_review_corrected_questions']} ont été corrigées. Les décisions individuelles et citations sont dans [la revue contextuelle](revue-contexte-20261114.md). Une candidature reste à vérifier visuellement ; elle n’est pas une image livrée.",'']
 (DOCS/'images-a-preparer.md').write_text('\n'.join(lines))
 print(json.dumps(summary,ensure_ascii=False))

if __name__=='__main__':main()

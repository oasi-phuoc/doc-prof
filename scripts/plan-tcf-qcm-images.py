#!/usr/bin/env python3
"""Prépare des briefs de reprise, sans générer d'image ni créer de lien vers un fichier absent."""
from __future__ import annotations
import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from tcf_qcm_images import ROOT, BANKS, REGISTRY, norm, noun, text_form, desired_form, resolve_image, clock_time

FORBIDDEN=re.compile(r"\b(?:lundis?|mardis?|mercredis?|jeudis?|vendredis?|samedis?|dimanches?|janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|euros?|francs?|chf|dollars?|centimes?|pour\s+cent)\b|[€$£%]",re.I)
ABSTRACT=re.compile(r"\b(?:loi|droit|obligation|possibilite|autorisation|raison|cause|consequence|opinion|avis|choix|liberte|identite|qualite|quantite|information|informations|programme|reponse|question|message|numero|adresse|inscription|reservation|examen|diplome|reunion|conseil|projet|etude|regle|conditions|technique|regime|mot|phrase|verbe|temps|annee|mois|jour|semaine|minute|heure|quotidien|succes|moyen|but|resultat|texte|annonce|habitude|taux|prix|salaire|budget|point|points|anonymat|rechauffement|pollution|biodiversite|protection|dependance|culpabilite|transmission|relation|sensations|metamorphose|statut|edition|fabrication|amelioration|reduction|annulation|changement|delai|retard|avance|scenario|article|amour|parents|voisins|amis|camarades|collegues|directeur|client|clients|vendeurs)\b",re.I)
QUESTION_TEXT=re.compile(r"\b(?:prenom|nomme|appelle|nom|ville|pays|nationalite|langue|numero|adresse|site|telephone|mot|verbe|phrase|comment s.ecrit|sigle|pourcentage|avenue|rue|arret|porte|salle)\b",re.I)
VISUAL_START=re.compile(r"^(?:un |une |des |du |de la |de l'|le |la |les |l'|au |aux |a la |a l'|dans |sur |sous |en |a pied|a velo|prendre |aller |faire |acheter |vendre |lire |ecrire |reparer |boire |manger |courir |nager |danser |chanter |dessiner |peindre |jouer |regarder |ecouter |travailler |cuisiner |ranger |porter |attendre |entrer |sortir |marcher |chercher |montrer |ramasser |sauter |se lever|se coucher|se laver|se brosser)")
VISUAL_ADJECTIVE={'content','contente','triste','heureux','heureuse','fatigue','fatiguee','en colere','surpris','surprise','inquiet','inquiete','blond','blonde','brun','brune','rouge','vert','bleu','jaune','noir','blanc','rose','violet','orange','gris'}
CONCRETE_CATEGORIES={'accessoires','aliments','animaux-aquatiques','animaux-ferme-compagnie','animaux-sauvages','boissons','ciel-espace','corps','couleurs','cuisine','desserts','ecole-bureau','electromenager','epices-herbes','formes','fruits','hygiene','insectes-petites-betes','legumes','maison','materiaux','meteo','metiers','musique','nature','objets','oiseaux','outils','plantes','sante','sports','technologie','transports','vetements','ville','voyage'}
CONCRETE_HEADS={norm(p.stem).split()[0].rstrip('s') for category in CONCRETE_CATEGORIES for p in (ROOT/'public/lib/images/vocabulaire'/category).glob('*.webp')}
CONCRETE_HEADS.update(norm(label).split()[0].rstrip('s') for row in REGISTRY for label in row.get('aliases',[]) if label)
CONCRETE_HEADS.update({'cheque','espece','imprimer','recopier','renvoyer','materiel','cremaillere','canoe','canoe-kayak','carte','papie','ordonnance','vol','rayon','spectacle','soiree','jeu','sortie','fete','piece','boite','cahier'})
CONCRETE_HEADS.difference_update({'le','la','l','les','un','une','de','du','des','au','aux','a','en','dans','sur','sous','chez','pour','par','et','ou','avec','sans'})
ACTION_START=re.compile(r"^(?:prendre |aller |faire |acheter |vendre |lire |ecrire |reparer |boire |manger |courir |nager |danser |chanter |dessiner |peindre |jouer |regarder |ecouter |travailler |cuisiner |ranger |porter |attendre |entrer |sortir |marcher |chercher |montrer |ramasser |sauter |se lever|se coucher|se laver|se brosser)")

def visual(label,enonce):
    t=norm(label)
    if FORBIDDEN.search(t):return False
    if re.search(r'\b\w+\.(?:fr|com|org|ch|net)\b',t):return False
    if clock_time(label,enonce) is not None:return True
    if re.search(r'\d',t) or ABSTRACT.search(t) or len(t.split())>12:return False
    if t in VISUAL_ADJECTIVE:return True
    if resolve_image(label,enonce):return True
    # Une image sans légende ne distingue ni une adresse ni deux personnes nommées.
    if re.search(r'\bchez\b',t):return False
    if re.search(r'\b[A-ZÀ-Ÿ][a-zà-ÿ]+',label[1:]):return False
    if re.search(r"\b(?:pas|jamais|sans|seulement|uniquement|parce|pourquoi|si|ni|plus|moins)\b",t):return False
    if ACTION_START.match(t):return True
    base=noun(t)
    base=re.sub(r'^(?:petit[e]?s? |grand[e]?s? |beau[x]? |belle[s]? )','',base)
    head=base.split()[0].rstrip('s') if base.split() else ''
    return bool(VISUAL_START.match(t)) and head in CONCRETE_HEADS

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',type=Path,default=ROOT/'docs/tcf');args=parser.parse_args()
    assets={};questions=[];excluded=Counter()
    for bank in BANKS:
        for ex in json.loads(bank.read_text()):
            for index,q in enumerate(ex.get('questions',[]),1):
                text=text_form(q)
                if not text or len(text.get('choix',[]))!=3:continue
                if desired_form(q):continue
                if QUESTION_TEXT.search(norm(q['enonce'])):excluded['identité, langue, lieu nommé ou code textuel']+=1;continue
                if re.search(r'\b(?:tarif|prix|cout|montant|budget|salaire|proportion)\b',norm(q['enonce'])):
                    excluded['montant ou information chiffrée abstraite']+=1;continue
                labels=[c['texte'] for c in text['choix']]
                if not all(visual(label,q['enonce']) for label in labels):excluded['choix non entièrement illustrables sans texte']+=1;continue
                known=[resolve_image(label,q['enonce']) for label in labels]
                if len([p for p in known if p])!=len({p for p in known if p}):
                    excluded['concepts visuels existants identiques entre plusieurs réponses']+=1;continue
                if re.match(r'^(?:Qui|Auprès de qui|Quel genre|Quel type de (?:texte|document|message))',q['enonce']):
                    excluded['identité ou catégorie abstraite']+=1;continue
                times=[clock_time(label,q['enonce']) for label in labels]
                if all(t is not None for t in times) and len({(t[0]%12,t[1]) for t in times})!=3:
                    excluded['cadrans analogiques identiques']+=1;continue
                ref={'bank':str(bank.relative_to(ROOT)),'exercise':ex['id'],'question':index,'enonce':q['enonce'],'audio':q.get('audio'),'choices':[],'status':'À relire avant génération : vérifier les trois contrastes et la fidélité de chaque scène.'}
                for choice in text['choix']:
                    existing=resolve_image(choice['texte'],q['enonce'])
                    # Un même objet ou une même scène est réutilisable d'une question à l'autre.
                    meaning=norm(choice['texte'])
                    if meaning in {'un cafe','le cafe','un bureau','le bureau','une cuisiniere','un serveur'}:
                        meaning+='|'+norm(q['enonce'])
                    key=hashlib.sha256(meaning.encode()).hexdigest()[:12]
                    target=f'/lib/images/tcf/qcm-audit/{key}.webp'
                    option={'id':choice['id'],'texte':choice['texte'],'correct':bool(choice.get('correct')),'existing_image':existing,'asset':None if existing else key}
                    ref['choices'].append(option)
                    if existing:continue
                    clock=clock_time(choice['texte'],q['enonce'])
                    brief=(f"Horloge analogique montrant exactement {clock[0]:02d} h {clock[1]:02d}, aiguilles cohérentes, cadran très lisible, sans texte." if clock else
                           f"Illustration pédagogique représentant exactement cette proposition : « {choice['texte']} ». Montrer tous les éléments utiles de la proposition, sans ajouter de précision absente. Ne pas réduire une action à un objet isolé ni une scène à un décor vide si les personnages sont nécessaires.")
                    assets.setdefault(key,{'id':key,'label':choice['texte'],'path_after_generation':target,'prompt':brief+' Style cohérent entre les trois choix : illustration réaliste simple, cadrage clair, sans légende, sans logo, sans montant, sans date, sans jour ni mois.','status':'à générer après validation éditoriale','references':[]})['references'].append({'exercise':ex['id'],'question':index,'choice':choice['id']})
                questions.append(ref)
    out=args.output_dir;out.mkdir(parents=True,exist_ok=True)
    data={'instructions':['Ne lancer aucune génération tant que le quota est épuisé.','Relire les trois propositions et le support indiqué avant de générer.','Les candidats sont un plan de reprise, pas une certification visuelle automatique.','Réutiliser les images existantes indiquées ; générer seulement les assets manquants.','Garder montants, dates, jours et mois en texte. Les horloges doivent avoir trois cadrans distincts.','Ne lier formes.qcm_image qu’après création et contrôle des trois fichiers, avec mêmes id et correct que le QCM texte.','Conserver le QCM texte et le corrigé rédigé.'],
          'summary':{'question_candidates':len(questions),'missing_assets':len(assets),'exclusions':dict(excluded)},'questions':questions,'assets':list(assets.values())}
    (out/'images-a-generer.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    lines=['# Images QCM à préparer à la prochaine session','',f"{len(questions)} questions candidates ; {len(assets)} images manquantes. Aucun fichier image n’a été généré.",'',*['- '+s for s in data['instructions']],'','Le fichier `images-a-generer.json` contient les références exactes, les trois réponses, les images réutilisables, les chemins prévus et tous les prompts.','']
    for ref in questions:
        lines.extend([f"## {ref['exercise']} — question {ref['question']}",'',ref['enonce'],''])
        for choice in ref['choices']:
            status=('réutiliser '+choice['existing_image']) if choice['existing_image'] else ('générer '+choice['asset'])
            lines.append(f"- {choice['id'].upper()}. {choice['texte']} — {status}")
        lines.append('')
    (out/'images-a-generer.md').write_text('\n'.join(lines)+'\n')
    print(json.dumps(data['summary'],ensure_ascii=False))

if __name__=='__main__':main()

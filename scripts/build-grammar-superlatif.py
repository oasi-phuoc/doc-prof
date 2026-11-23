"""Compile 100 authored comparisons of three candidates, with checked numerical extrema."""
import csv, json, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REV='superlatif-2026-11-23-v1'
def rows(level):
 r=[x for x in csv.reader((ROOT/f'scripts/grammar_curriculum/superlatif-f13-{level.lower()}.tsv').read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==12 for x in r),(level,len(r),[(x[0],len(x)) for x in r if len(x)!=12]);return r
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def forms(article,degree,adjective):
 if adjective in ['bon','bonne','bons','bonnes'] and degree=='plus':return [article+' '+{'bon':'meilleur','bonne':'meilleure','bons':'meilleurs','bonnes':'meilleures'}[adjective]]
 if adjective in ['mauvais','mauvaise','mauvaises'] and degree=='plus':return [article+' '+('pires' if article=='les' else 'pire'),article+' plus '+adjective]
 return [article+' '+degree+' '+adjective]
banks=[]
for level in ['A1','A2']:
 for mechanic,label in [('q','Former le superlatif'),('t','Transformer une phrase'),('e','Produire à l’écrit'),('p','S’exprimer à l’oral')]:
  aid='gram-ex-f13-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,row in enumerate(rows(level)):
   slug,setting,encoded,metric,extreme,subject,lemma,adjective,article,degree,group,reply=row
   values=[(n,float(v)) for n,v in (s.rsplit('=',1) for s in encoded.split(';'))];assert len(values)==3 and len(set(n for n,v in values))==3
   value=(max if extreme=='max' else min)(v for n,v in values);winners=[n for n,v in values if v==value];assert winners==[subject],(slug,winners)
   facts=metric[0].upper()+metric[1:]+' — '+' ; '.join(n+' : '+str(int(v) if v.is_integer() else v) for n,v in values)+'.'
   context=setting+'\n'+facts
   answer=forms(article,degree,adjective);opposite=article+' '+('moins' if degree=='plus' else 'plus')+' '+adjective
   distractor=degree+' '+adjective
   assert all(a not in [opposite,distractor] for a in answer)
   prompt=subject+(' sont ' if article=='les' else ' est ')+'___ '+group+'.';models=[prompt.replace('___',a) for a in answer]
   target='Avec « '+lemma+' », décrivez « '+subject+' » au superlatif. Précisez le groupe comparé.'
   common=dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/superlatif-f13-{level.lower()}.tsv',typeId=aid,position=i,partition=level.lower()))
   explanation='Les trois valeurs déterminent le classement. Modèle : '+models[0]+(' « Le/la/les pire(s) » et « le/la/les plus mauvais(es) » sont recevables pour ce sens.' if lemma=='mauvais' else ' Bon devient meilleur, avec l’accord requis.' if lemma=='bon' else '')
   if mechanic=='q':u=dict(**common,kind='completion',prompt=prompt,cue=context+'\n'+target,answers=answer,options=[dict(id='forme-'+hashlib.sha256((slug+'|'+a).encode()).hexdigest()[:10],text=a) for a in [answer[0],opposite,distractor]],explanation=explanation)
   elif mechanic=='t':u=dict(**common,kind='transform',prompt=context,answers=models,directive=target+' Écrivez une phrase complète et précisez le groupe de comparaison.',responseLines=2,explanation=explanation+' Les formulations équivalentes respectant le classement sont recevables.')
   else:
    oral=mechanic=='p';task=target+(' Puis choisissez une option adaptée aux conditions et justifiez ce choix.' if level=='A2' else ' Faites une phrase complète.')
    if oral:task=target+' Partenaire : « '+('Quel choix faites-vous, et pourquoi ?' if level=='A2' else 'Quel choix faites-vous ?')+' » Répondez'+(' selon les conditions' if level=='A2' else '')+' puis échangez les rôles.'
    u=dict(**common,kind='production',prompt=context,answers=[models[0]+('\n'+reply if oral or level=='A2' else '')],mode='oral' if oral else 'written',task=task,writeLines=0 if oral else 6 if level=='A2' else 3,rubric=rubric(['Classement conforme aux trois valeurs.','Superlatif accordé et groupe comparé précisé.','Réponse compréhensible à la relance.' if oral else 'Phrase compréhensible.']+(['Choix justifié selon les conditions.'] if level=='A2' else [])),explanation='Modèle non exclusif ; les décisions respectant les faits sont recevables.'+(' Pire ou plus mauvais sont recevables.' if lemma=='mauvais' else ''))
   units.append(u)
  instructions={'q':{'choice':'Comparez les trois propositions et choisissez le superlatif qui convient.','gap':'Écrivez le superlatif de l’adjectif indiqué selon les trois valeurs.'},'t':{'transform':'Transformez les informations en une phrase au superlatif. Précisez le groupe comparé.'},'e':{'open-written':'Décrivez au superlatif selon les données.'+(' Choisissez ensuite une option et justifiez votre choix selon les conditions.' if level=='A2' else '')},'p':{'open-oral':'Décrivez au superlatif puis répondez à la relance.'+(' Tenez compte des conditions pour justifier votre choix.' if level=='A2' else '')}}[mechanic]
  banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='f13',topic='gram-decrire',level=level,label=label,objective='Former le plus ou le moins avec un adjectif accordé dans un groupe de trois propositions.' if level=='A1' else 'Exprimer un classement, préciser le groupe comparé et justifier une décision selon plusieurs critères.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='100 situations distinctes A1/A2, extrêmes numériques contrôlés ; sens bon/mauvais et modèles ouverts non exclusifs. Une source est réemployée entre les mécaniques. Validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units))
(ROOT/'src/grammaire/curriculum/data/f13.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),offerings=10,units=400,variants=500,authoredSituations=100)))

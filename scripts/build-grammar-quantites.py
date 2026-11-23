"""Compile authored quantity/action comparisons, preserving elision and numerical equality."""
import csv,json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REV='quantites-2026-11-23-v1'
def rows(level):
 r=[x for x in csv.reader((ROOT/f'scripts/grammar_curriculum/quantites-f14-{level.lower()}.tsv').read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==8 for x in r),(level,len(r));return r
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
banks=[]
for level in ['A1','A2']:
 for mechanic,label in [('q','Comparer une quantité ou une action'),('t','Transformer une phrase'),('e','Produire à l’écrit')]:
  aid='gram-ex-f14-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,(slug,context,left,right,kind,elision,prompt,reply) in enumerate(rows(level)):
   a,b=float(left),float(right);term='plus' if a>b else 'moins' if a<b else 'autant'
   suffix='' if kind=='verbe' else ' d’' if elision=='oui' else ' de';answer=term+suffix
   assert kind in ['nom','verbe'] and (kind!='verbe' or elision=='non')
   if elision=='oui':assert '___ ' not in prompt
   model=prompt.replace('___',answer);others=[x+suffix for x in ['plus','moins','autant'] if x!=term]
   target='Comparez les quantités avec un nom : employez plus de, moins de ou autant de, avec l’élision si nécessaire.' if kind=='nom' else 'Comparez l’action avec plus, moins ou autant, sans ajouter de devant que.'
   common=dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/quantites-f14-{level.lower()}.tsv',typeId=aid,position=i,partition=level.lower()))
   explanation=f'La première quantité ({left}) est '+('supérieure à' if a>b else 'inférieure à' if a<b else 'égale à')+f' la seconde ({right}). '+('Devant un nom, le comparatif comporte de ou d’.' if kind=='nom' else 'Pour comparer cette action, plus, moins ou autant est placé après le verbe, sans de.')+' Phrase : '+model
   if mechanic=='q':u=dict(**common,kind='completion',prompt=prompt,cue=context,answers=[answer],options=[dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in [answer,*others]],explanation=explanation)
   elif mechanic=='t':u=dict(**common,kind='transform',prompt=context,answers=[model],directive=target+' Écrivez une phrase complète en comparant les éléments dans cet ordre : '+prompt.replace('___','[comparatif]'),responseLines=2,explanation=explanation+' Les phrases équivalentes conservant les faits et l’ordre des éléments sont recevables.')
   else:u=dict(**common,kind='production',prompt=context,answers=[model+('\n'+reply if level=='A2' else '')],mode='written',task=target+' '+('Choisissez une solution conforme aux conditions et justifiez ce choix.' if level=='A2' else 'Écrivez une phrase complète en conservant les éléments dans l’ordre : '+prompt.replace('___','[comparatif]')),writeLines=6 if level=='A2' else 3,rubric=rubric(['Quantités et sens de comparaison conformes aux données.','Structure adaptée au nom ou au verbe ; élision et que corrects.','Phrase compréhensible.']+(['Choix cohérent et justifié par les conditions.'] if level=='A2' else [])),explanation='Modèle non exclusif. Les comparaisons inversées mais équivalentes sont recevables à l’écrit libre, ainsi que les autres choix réellement compatibles avec les contraintes.')
   units.append(u)
  instructions={'q':{'choice':'Comparez selon les faits et choisissez le groupe qui complète la phrase.','gap':'Complétez avec plus, moins ou autant et ajoutez de ou d’ devant un nom.'},'t':{'transform':'Réunissez les informations en une comparaison de quantités ou d’actions selon l’indication.'},'e':{'open-written':'Comparez selon les données.'+(' Puis justifiez un choix en tenant compte des conditions.' if level=='A2' else '')}}[mechanic]
  banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='f14',topic='gram-decrire',level=level,label=label,objective='Comparer deux quantités ou durées avec plus de, moins de, autant de ou plus, moins, autant après un verbe.' if level=='A1' else 'Comparer des quantités et des activités en contexte puis justifier un choix selon plusieurs contraintes.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='100 contextes A1/A2, inégalité et égalité contrôlées, de/d’ devant le nom et absence de de après le verbe. Une source est réemployée entre les mécaniques ; modèles non exclusifs. Validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units))
(ROOT/'src/grammaire/curriculum/data/f14.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),offerings=8,units=300,variants=400,authoredSituations=100)))

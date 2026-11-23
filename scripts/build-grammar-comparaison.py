"""Compile authored F9 A1/A2 situations; preserve all other banks and media."""
import csv,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REV='comparaison-2026-11-23-v1'
def read(level):
 p=ROOT/f'scripts/grammar_curriculum/comparaison-f9-{level.lower()}.tsv'
 rows=[r for r in csv.reader(p.read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(rows)==50 and all(len(r)==11 for r in rows),(level,len(rows));assert len({r[0] for r in rows})==50
 return rows
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def options(a,d1,d2,slug):
 vals=[a,d1,d2];assert len(set(vals))==3
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+v).encode()).hexdigest()[:10],text=v) for v in vals]
banks=[]
for level in ['A1','A2']:
 for mechanic,label in [('q','Comparer une qualité'),('t','Transformer une phrase'),('e','Produire à l’écrit'),('p','S’exprimer à l’oral')]:
  aid='gram-ex-f9-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,(slug,domain,context,p,a,alts,d1,d2,target,follow,reply) in enumerate(read(level)):
   answers=[a]+[v for v in alts.split(';') if v];assert d1 not in answers and d2 not in answers
   models=[p.replace('___',v) for v in answers]
   common=dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/comparaison-f9-{level.lower()}.tsv',typeId=aid,position=i,partition=level.lower()))
   if mechanic=='q':
    u=dict(**common,kind='completion',prompt=p,cue=context+' '+target,answers=answers,options=options(a,d1,d2,slug+'-'+level),explanation='Les faits donnés déterminent le sens de la comparaison. Phrase : '+models[0]+(' Autre formulation recevable : '+models[1] if len(models)>1 else '')+' Avec bon, on emploie meilleur pour la supériorité ; pire et plus mauvais peuvent convenir avec mauvais.')
   elif mechanic=='t':u=dict(**common,kind='transform',prompt=context,answers=models,directive=target+' Écrivez une phrase complète, sans changer les faits.',responseLines=2,explanation='Modèle possible. Gardez les éléments comparés, le sens de chaque comparaison et les accords. Les formulations équivalentes sont appréciées par l’enseignant.'+(' Pire et plus mauvais sont tous deux recevables ici.' if alts else ''))
   else:
    oral=mechanic=='p'
    if oral:task=target+' Partenaire : « '+follow+' »'+(' Justifiez le choix.' if level=='A2' else '')+' Échangez les rôles.'
    else:task=target+' Écrivez une phrase complète.'+(' Puis choisissez une option qui respecte les conditions et justifiez ce choix.' if level=='A2' else '')
    # A free production needs one non-exclusive model, not duplicated paragraphs for synonyms.
    final=[models[0]+'\n'+reply] if oral or level=='A2' else [models[0]]
    u=dict(**common,kind='production',prompt=context,answers=final,mode='oral' if oral else 'written',task=task,writeLines=0 if oral else 6 if level=='A2' else 2,rubric=rubric(['Faits et conditions respectés.','Comparatif, que et accords corrects.','Réponse compréhensible à la relance.' if oral else 'Phrases compréhensibles.']+(['Choix justifié avec les données.'] if level=='A2' else [])),explanation='Modèle non exclusif ; appréciation enseignante.'+(' Pire et plus mauvais sont recevables ici, avec les accords adaptés.' if alts else ''))
   units.append(u)
  instructions={'q':{'choice':'Lisez les faits et choisissez la comparaison qui convient.','gap':'Complétez la comparaison selon les faits et les adjectifs indiqués.'},'t':{'transform':'Transformez les informations en une comparaison selon l’indication.'},'e':{'open-written':'Comparez les éléments selon les données.'+(' Puis choisissez une option et justifiez votre choix.' if level=='A2' else '')},'p':{'open-oral':'Comparez les éléments puis répondez à la relance.'+(' Justifiez votre choix selon les conditions données.' if level=='A2' else '')}}[mechanic]
  banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='f9',topic='gram-decrire',level=level,label=label,objective='Comparer deux personnes ou objets avec plus, aussi ou moins… que et accorder les adjectifs.' if level=='A1' else 'Comparer plusieurs options, articuler deux critères et justifier un choix à partir des informations données.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Situations et variantes relues. Sources distinctes A1/A2 ; chaque situation est réemployée entre Q/L/T/E/P sans multiplier les histoires revendiquées. Modèles ouverts non exclusifs, validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units))
p=ROOT/'src/grammaire/curriculum/data/f9.json';p.write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),activities=len({b['activityId'] for b in banks}),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),authoredSituations=100)))

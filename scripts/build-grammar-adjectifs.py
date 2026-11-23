"""Compile authored F12 noun-group tasks without changing other banks or media."""
import csv,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REV='adjectifs-2026-11-23-v1'
def rows(level):
 r=[x for x in csv.reader((ROOT/f'scripts/grammar_curriculum/adjectifs-f12-{level.lower()}.tsv').read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==(11 if level=='A1' else 12) for x in r);assert len({x[0] for x in r})==50;return r
def words(tagged,slug):return [dict(id=slug+f'-m{i+1}',text=s.rsplit('~',1)[0],category=s.rsplit('~',1)[1]) for i,s in enumerate(tagged.split(';'))]
def phrase(tokens):return ' '.join(t['text'] for t in tokens).replace('’ ','’')
def choices(a,d1,d2,slug):
 assert len({a,d1,d2})==3
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+s).encode()).hexdigest()[:10],text=s) for s in [a,d1,d2]]
banks=[]
for level in ['A1','A2']:
 for mechanic,label in [('q','Placer l’adjectif'),('o','Mots dans l’ordre')]+([('c','Corriger l’erreur'),('t','Transformer une phrase')] if level=='A2' else []):
  aid='gram-ex-f12-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,row in enumerate(rows(level)):
   slug,adjective,context,p,tagged,alts,inverse,bad,bad_inverse,position,meaning=row[:11];tokens=words(tagged,slug);group=phrase(tokens);answers=[group]+[x for x in alts.split(';') if x]
   assert len(tokens)>=3 and len(set(answers))==len(answers) and all(x not in answers for x in [bad,bad_inverse]);assert inverse!=group
   placed=f'Place demandée dans cette construction : {position} le nom. Adjectif : {adjective}.'
   cue=context+' '+(placed if level=='A1' else 'Sens demandé : '+meaning+'.')
   common=dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/adjectifs-f12-{level.lower()}.tsv',typeId=aid,position=i,partition=level.lower()))
   explanation=('Place demandée : '+position+'. Modèle : '+group+'.' if level=='A1' else 'Sens demandé : '+meaning+'. Modèle : '+group+'.')
   if level=='A1' and any(t['text'] in ['bel','vieil','nouvel'] for t in tokens):explanation+=' Cette forme précède un nom masculin singulier commençant par une voyelle ou un h muet.'
   if level=='A1' and slug in ['beau-heros','vieux-heros']:explanation+=' Le h de héros est aspiré : beau et vieux gardent leur forme.'
   if mechanic=='q':
    d1=bad if inverse in answers else inverse;d2=bad_inverse if inverse in answers else bad
    u=dict(**common,kind='completion',prompt=p,cue=cue,answers=answers,options=choices(group,d1,d2,slug+'-'+level),explanation=explanation)
   elif mechanic=='o':u=dict(**common,kind='order',orderScope='noun-group',prompt='Construisez le groupe nominal avec tous les mots.',cue=context+' '+placed,answers=[group],tokens=tokens,responseLines=1,explanation='Ordre attendu avec la place indiquée. Le groupe nominal ne contient pas de verbe et n’est pas une phrase affirmative ou négative. D’autres placements peuvent convenir à d’autres consignes ou contextes.')
   elif mechanic=='c':
    start=p.index('___');u=dict(**common,kind='correct',prompt=p.replace('___',bad_inverse),cue=cue,answers=[p.replace('___',x) for x in answers],responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(bad_inverse),text=bad_inverse),explanation='Le groupe comporte une erreur d’accord. Corrigez-le en conservant le sens demandé. '+explanation)
   else:u=dict(**common,kind='transform',prompt=p.replace('___',row[11]),cue=context,answers=[p.replace('___',x) for x in answers],directive='Remplacez l’expression descriptive par un groupe nominal avec « '+adjective+' », au sens de « '+meaning+' ». Gardez le reste de la phrase.',responseLines=2,explanation='Modèle possible : '+p.replace('___',group)+' Les formulations équivalentes qui gardent le sens sont appréciées par l’enseignant.')
   units.append(u)
  instructions={'q':{'choice':'Choisissez le groupe nominal qui respecte le sens, l’accord'+(' et la place indiquée.' if level=='A1' else ' dans ce contexte.'),'gap':'Écrivez le groupe nominal avec l’adjectif adapté au sens'+(' et à la place indiquée.' if level=='A1' else '. Les variantes équivalentes sont recevables.')},'o':{'order':'Déplacez les mots pour former un groupe nominal. Respectez la place de l’adjectif indiquée dans la situation.'},'c':{'correct':'Corrigez le groupe signalé : accord de l’adjectif et place adaptée au sens. Réécrivez la phrase.'},'t':{'transform':'Reformulez avec l’adjectif demandé en conservant le sens et le reste de la phrase.'}}[mechanic]
  banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='f12',topic='gram-decrire',level=level,label=label,objective='Placer et accorder un adjectif usuel avant ou après le nom selon une indication.' if level=='A1' else 'Choisir la place de l’adjectif selon le sens et reconnaître les variantes équivalentes en contexte.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Sens, accords et variantes relus. Les corrections comportent une erreur d’accord véritable, sans déclarer automatiquement fautive toute inversion. Groupes nominaux guidés pour l’ordre ; modèles non exclusifs pour les reformulations. Validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units))
(ROOT/'src/grammaire/curriculum/data/f12.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=4,banks=len(banks),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),authoredSituations=100)))

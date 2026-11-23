"""Compile the complete c4 A1/A2 pilot from 100 individually authored scenes."""
import csv,json,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/grammar_curriculum'
REV='exclamation-2026-11-23-v1'
RUBRIC=[{'id':str(i+1),'label':t} for i,t in enumerate(['Exclamation adaptée à la situation.','Construction et accords compréhensibles.','Intonation expressive et respectueuse.','Réponse cohérente avec le rôle et les faits.','Raison simple donnée lorsque la consigne la demande.'])]
def rows(name,width):
 result=list(csv.reader((SOURCE/name).read_text().splitlines(),delimiter='|'))
 result=[r for r in result if r and not r[0].startswith('#')]
 assert len(result)==50 and len({r[0] for r in result})==50
 assert all(len(r)==width for r in result)
 return result
A1=rows('exclamation-a1.tsv',4);A2=rows('exclamation-a2.tsv',6)
def unit(aid,level,slug,index,prompt,answers,explanation,**extra):
 return dict(id=f'{aid}-{level.lower()}-{slug}',prompt=prompt,answers=answers,explanation=explanation,source=dict(path=f'scripts/grammar_curriculum/exclamation-{level.lower()}.tsv',typeId=aid,position=index,partition=level.lower()),**extra)
def make_bank(aid,level,label,forms,instructions,units):
 assert len(units)==50
 return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='c4',topic='gram-exclamation',level=level,label=label,objective='Reconnaître l’exclamation, accorder quel et réagir avec une formule simple.' if level=='A1' else 'Reformuler pour exprimer une émotion, choisir une construction et expliquer sa réaction.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='100 scènes rédigées, variantes comme/que admises, erreur initiale unique et modèles non exclusifs. Validation enseignante en attente.'),presentations=forms,instructions=instructions,units=units)
def options(answer,others,identity):
 # IDs carry no fixed correct-answer position across the bank.
 return [dict(id='forme-'+hashlib.sha256((identity+'|'+t).encode()).hexdigest()[:10],text=t) for t in [answer]+[t for t in others if t!=answer]]
def a2_forms(expr):
 if expr.startswith('Comme '):
  rest=expr[len('Comme '):];alt=('Qu’' if rest[0].lower() in 'aàâeéèêëiîïoôuùûh' else 'Que ')+rest
  return 'Comme ',rest,[expr,alt],'comme'
 if expr.startswith('Que '):
  rest=expr[len('Que '):];return 'Que ',rest,[expr,'Comme '+rest],'que'
 if expr.startswith('Qu’'):
  rest=expr[len('Qu’'):];return 'Qu’',rest,[expr,'Comme '+rest],'que'
 lead,rest=expr.split(' ',1);return lead+' ',rest,[expr],'quel'
banks=[]
for level,source in [('A1',A1),('A2',A2)]:
 aid='gram-ex-c4-qcm-verbe';units=[]
 for index,row in enumerate(source):
  slug,context=row[:2]
  if level=='A1':
   tokens=[dict(text=p.split('~')[0],category=p.split('~')[1]) for p in row[2].split(';')]
   answer=tokens[0]['text'];suffix=' '.join(p['text'] for p in tokens[1:])+' !';prompt='___ '+suffix;answers=[answer]
   others=['Quel','Quelle','Quels','Quelles'];explanation='Le déterminant exclamatif s’accorde avec le nom : '+answer.lower()+'.'
  else:
   neutral,expr=row[2:4];lead,rest,models,family=a2_forms(expr)
   if family=='quel':answer=lead.strip();prompt='___ '+rest;answers=[answer];others=['Quel','Quelle','Quels','Quelles']
   else:
    # Comme and que are often both valid: never put both in one single-key QCM.
    answer='Comme' if lead=='Qu’' else lead.strip();answers=[answer]+[x for x in ['Comme','Qu’' if rest[0].lower() in 'aàâeéèêëiîïoôuùûh' else 'Que'] if x!=answer]
    prompt='___ '+rest;others=['Comment','Quel','Quelle'];
   explanation=('Accordez la forme de quel avec le nom « '+row[5]+' ».' if family=='quel' else 'Formulations recevables : '+' / '.join(models)+' Que devient qu’ devant une voyelle ; l’apostrophe reste attachée au mot suivant.')
  units.append(unit(aid,level,slug,index,prompt,answers,explanation,kind='completion',cue=context,options=options(answer,others,level+'-'+slug)))
 banks.append(make_bank(aid,level,'Former une exclamation',['choice','gap'],{'choice':'Choisissez la forme qui convient pour une exclamation avec quel, comme ou que.','gap':'Complétez l’exclamation avec une forme de quel, comme ou que. Faites les accords et les élisions nécessaires.'},units))
aid='gram-ex-c4-curriculum-o';units=[]
for index,(slug,context,tagged,reason) in enumerate(A1):
 tokens=[dict(id=f'mot-{j+1}',text=p.split('~')[0],category=p.split('~')[1]) for j,p in enumerate(tagged.split(';'))]
 expression=' '.join(t['text'] for t in tokens)+' !'
 units.append(unit(aid,'A1',slug,index,'Formez une exclamation.',[expression],'Tous les mots sont utilisés ; terminez par un point d’exclamation.',kind='order',tokens=tokens,cue=context))
banks.append(make_bank(aid,'A1','Mots dans l’ordre',['order'],{'order':'Remettez les mots dans l’ordre pour former une exclamation. Écrivez-la avec le point d’exclamation.'},units))
for kind in ['transform','correct']:
 aid='gram-ex-c4-curriculum-'+('t' if kind=='transform' else 'c');units=[]
 for index,(slug,context,neutral,expr,reason,noun) in enumerate(A2):
  lead,rest,models,family=a2_forms(expr)
  if kind=='transform':
   directive=('Commencez par une forme de [[em]]quel[[/em]] et utilisez le nom « '+noun+' ».' if family=='quel' else 'Commencez par [[em]]comme[[/em]].' if family=='comme' else 'Commencez par [[em]]que[[/em]], avec l’élision si nécessaire.')
   units.append(unit(aid,'A2',slug,index,neutral,[expr],'Modèle possible : conservez les faits, les personnes et la construction demandée. Une intensité équivalente est recevable.',kind='transform',directive=directive,responseLines=2))
  else:
   if family=='comme':bad='Comment '
   elif lead=='Que ':bad='Qu’'
   elif lead=='Qu’':bad='Que '
   else:bad={'Quel ':'Quelle ','Quelle ':'Quel ','Quels ':'Quelles ','Quelles ':'Quels '}[lead]
   prompt=bad+rest
   units.append(unit(aid,'A2',slug,index,prompt,models,'Corrigez le début de l’exclamation : accord du déterminant, comme au lieu de comment, ou élision de que. Les formulations équivalentes indiquées sont recevables.',kind='correct',responseLines=2,error=dict(segmentId='prompt',start=0,end=len(bad),text=bad)))
 banks.append(make_bank(aid,'A2','Transformer une phrase' if kind=='transform' else 'Corriger l’erreur',[kind],{kind:'Transformez la phrase neutre en exclamation selon l’indication.' if kind=='transform' else 'Corrigez le début de l’exclamation avec comme, que/qu’ ou une forme de quel, puis réécrivez la phrase entière.'},units))
for level,source in [('A1',A1),('A2',A2)]:
 aid='gram-ex-c4-curriculum-p';units=[]
 for index,row in enumerate(source):
  slug,context=row[:2]
  expression=(' '.join(p.split('~')[0] for p in row[2].split(';'))+' !') if level=='A1' else row[3]
  reason=row[3] if level=='A1' else row[4]
  task='Réagissez par une exclamation simple. Votre partenaire demande pourquoi : donnez une raison courte.' if level=='A1' else 'Réagissez par une exclamation adaptée, puis expliquez votre émotion. Votre partenaire propose une autre réaction ; répondez-lui.'
  units.append(unit(aid,level,slug,index,context,[expression+'\n'+reason],'Exemple possible ; d’autres réactions pertinentes et respectueuses sont recevables. Échangez ensuite les rôles.',kind='production',mode='oral',task=task,rubric=RUBRIC,writeLines=0))
 banks.append(make_bank(aid,level,'S’exprimer à l’oral',['open-oral'],{'open-oral':'Jouez la situation à deux. Exprimez votre réaction avec une exclamation, puis répondez à votre partenaire.'},units))
(ROOT/'src/grammaire/curriculum/data/c4.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),units=sum(len(b['units']) for b in banks),offerings=sum(len(b['presentations']) for b in banks),variants=sum(len(b['units'])*len(b['presentations']) for b in banks))))

"""Compile authored advice and imperative tasks, keeping teacher models non-exclusive."""
import csv,json,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REV='conseiller-2026-11-24-v1'
def rows(name,width):
 r=[x for x in csv.reader((ROOT/f'scripts/grammar_curriculum/{name}.tsv').read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==width for x in r),(name,len(r));assert len({x[0] for x in r})==50
 assert all(unicodedata.normalize('NFC',v)==v for x in r for v in x);return r
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def options(vals,slug):
 assert len(vals)==len(set(vals))
 return [dict(id=slug+f'-choix-{i+1}',text=v) for i,v in enumerate(vals)]
def base(aid,level,slug,i,source):return dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/{source}',typeId=aid,position=i,partition=level.lower()))
def bank(aid,sub,level,label,instructions,units):return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-conseiller',level=level,label=label,objective='Donner un conseil poli avec devoir ou pouvoir au conditionnel présent, puis répondre à une relance.' if sub=='f10' else 'Construire une consigne simple à l’impératif selon tu, nous ou vous.' if level=='A1' else 'Former des consignes affirmatives et négatives, placer les pronoms et respecter l’adresse et les traits d’union.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-24',humanReview='pending',note='Situations fictives, formes et variantes relues ; mêmes situations réemployées entre mécaniques. Modèles de production non exclusifs. Révision pédagogique enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units)
F10=rows('conseiller-f10-a2',7);banks=[]
forms={'tu':{'devoir':['devrais','devais','devras'],'pouvoir':['pourrais','pouvais','pourras']},'vous':{'devoir':['devriez','deviez','devrez'],'pouvoir':['pourriez','pouviez','pourrez']}}
advice_rubric=rubric(['Conseil adapté aux faits du rôle.','Conditionnel + infinitif ; adresse correcte.','Réponse cohérente à la relance.'])
for mechanic,label in [('q','Donner un conseil poli'),('pe','Écrire une phrase utile'),('po','Dire une phrase utile'),('s','Jouer une situation')]:
 aid='gram-ex-f10-'+('qcm-conj' if mechanic=='q' else 'curriculum-s' if mechanic=='s' else 'communication-'+mechanic);units=[]
 for i,(slug,context,address,verb,prompt,follow,reply) in enumerate(F10):
  answer=forms[address][verb][0];model=prompt.replace('___',answer);common=base(aid,'A2',slug,i,'conseiller-f10-a2.tsv');cue='Rôle fictif du demandeur : « '+context+' » Adresse : '+address+'.'
  if mechanic=='q':u=dict(**common,kind='completion',prompt=prompt,cue=cue,givenVerb=verb,answers=[answer],options=options(forms[address][verb],slug),explanation='Le conditionnel présent de '+verb+' adoucit le conseil. Le verbe qui suit reste à l’infinitif. Phrase : '+model)
  elif mechanic=='s':u=dict(**common,kind='scenario',contract='open',prompt='Donner un conseil poli',situation=context,answers=['Conseiller : '+model+'\nDemandeur : '+follow+'\nConseiller : '+reply],roles=[dict(id='a',label='Demandeur',goal='Exposez la situation puis posez la relance.'),dict(id='b',label='Conseiller',goal='Conseillez en '+('tutoyant.' if address=='tu' else 'vouvoyant.'))],turns=[dict(id='question',roleId='a',text='Quel conseil me proposes-tu ?' if address=='tu' else 'Quel conseil pouvez-vous me donner ?')],task='Conseillez avec '+verb+' au conditionnel, répondez à la relance puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=advice_rubric,explanation='Exemple non exclusif ; conservez le conditionnel et les faits.')
  else:
   oral=mechanic=='po';task=('Conseillez oralement' if oral else 'Écrivez un conseil')+' avec '+verb+' au conditionnel, en '+('tutoyant' if address=='tu' else 'vouvoyant')+'. '+('Partenaire : « '+follow+' » Répondez puis échangez les rôles.' if oral else 'Ajoutez une justification ou une précision utile selon la situation.')
   u=dict(**common,kind='production',prompt=cue,answers=[model+'\n'+reply],mode='oral' if oral else 'written',task=task,writeLines=0 if oral else 4,rubric=advice_rubric if oral else rubric(['Conseil adapté aux faits du rôle.','Conditionnel + infinitif ; adresse correcte.','Justification ou précision utile et compréhensible.']),explanation='Modèle non exclusif ; les autres conseils compatibles avec les faits sont recevables.')
  units.append(u)
 instructions={'q':{'choice':'Choisissez le verbe indiqué au conditionnel présent pour donner un conseil poli.','gap':'Complétez avec le verbe indiqué au conditionnel présent.'},'pe':{'open-written':'Écrivez un conseil poli avec le verbe demandé, puis une précision ou une justification.'},'po':{'open-oral':'Donnez un conseil poli avec le verbe demandé puis répondez à votre partenaire.'},'s':{'scenario-set':'Jouez la demande de conseil, le conseil poli et la relance à deux.'}}[mechanic]
 banks.append(bank(aid,'f10','A2',label,instructions,units))
aid='gram-ex-f10-communication-ce';units=[]
for i,d in enumerate(json.loads((ROOT/'scripts/grammar_curriculum/conseiller-lectures-a2.json').read_text())):
 text=' '.join(d['text']).replace(' » Conseiller :',' »\nConseiller :').replace(' » Demandeur :',' »\nDemandeur :');qs=[]
 for j,c in enumerate(d['questions']):
  assert c['evidence'] in text,(d['id'],c['evidence']);q=dict(id=aid+'-'+d['id']+f'-q{j+1}',prompt=c['prompt'],answers=[c['answer']],evidence=[c['evidence']],explanation='Le dialogue précise : « '+c['evidence']+' ». Une reformulation fidèle est recevable.',response='choice' if 'distractors' in c else 'short')
  if 'distractors' in c:q['options']=options([c['answer'],*c['distractors']],d['id']+str(j))
  qs.append(q)
 units.append(dict(**base(aid,'A2',d['id'],i,'conseiller-lectures-a2.json'),kind='reading',prompt=d['title'],genre=d['genre'],text=text,answers=[],questions=qs,explanation='Distinguez le conseil poli et les informations utiles du dialogue.'))
banks.append(bank(aid,'f10','A2','Lire une situation',{'document-set':'Lisez chaque dialogue de conseil et répondez à ses trois questions.'},units))
def words(tagged,slug):return [dict(id=slug+f'-mot-{i+1}',text=t.rsplit('~',1)[0],category=t.rsplit('~',1)[1]) for i,t in enumerate(tagged.split(';'))]
def phrase(tokens):return ' '.join(t['text'] for t in tokens).replace('’ ','’')
variants={'places-vous':['Assoyez-vous'],'chaise-negative':['Ne t’assois pas']}
for level in ['A1','A2']:
 for mechanic,label in [('q','Donner une consigne'),('o','Mots dans l’ordre'),('p','S’exprimer à l’oral')]+([('t','Transformer une phrase'),('c','Corriger l’erreur')] if level=='A2' else []):
  aid='gram-ex-f11-'+('qcm-conj' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,(slug,address,verb,context,prompt,a,d1,d2,neutral,tagged,follow,reply) in enumerate(rows('conseiller-f11-'+level.lower(),12)):
   tokens=words(tagged,slug);model=prompt.replace('___',a);assert phrase(tokens)==model,(slug,phrase(tokens),model)
   negative=any(t['category']=='negation' for t in tokens);answers=[a]+variants.get(slug,[]);models=[prompt.replace('___',v) for v in answers]
   cue=context+' Adresse : '+address+'. Verbe : '+verb+'. Forme '+('négative.' if negative else 'affirmative.')
   common=base(aid,level,slug,i,'conseiller-f11-'+level.lower()+'.tsv')
   explanation='Pas de pronom sujet devant le verbe à l’impératif.'
   if negative:explanation+=' Ne/n’ et pas encadrent les pronoms compléments et le verbe. Aucun trait d’union ne les relie.'
   elif '-' in a:explanation+=' Les pronoms suivent le verbe et sont reliés par des traits d’union.'
   else:explanation+=' Respectez la personne demandée et la forme du verbe.'
   if a in ['Vas-y','Manges-en','Parles-en','Achètes-en']:explanation+=' Ici, le s devant y ou en est requis à l’affirmatif.'
   if slug in ['bureau-negative','soupe-negative','attente-negative']:explanation+=' À la négation, va et mange ne prennent pas ce s de liaison.'
   if slug=='gateau-men':explanation+=' Moi devient m’ devant en : donne-m’en.'
   if slug in variants:explanation+=' Autre forme recevable : '+variants[slug][0]+'.'
   if mechanic=='q':u=dict(**common,kind='completion',prompt=prompt,cue=cue,givenVerb=verb,answers=answers,options=options([a,d1,d2],slug),explanation=explanation+' Modèle : '+model)
   elif mechanic=='o':u=dict(**common,kind='order',prompt='Construisez la consigne avec toutes les étiquettes.',cue=cue,answers=[model],tokens=tokens,responseLines=2 if level=='A2' else 1,explanation='Ordre possible selon les mots et la situation. Les autres ordres grammaticaux qui gardent le sens sont appréciés par l’enseignant. '+explanation)
   elif mechanic=='p':u=dict(**common,kind='production',prompt=cue,answers=[model+'\n'+reply],mode='oral',task='Donnez la consigne avec '+verb+'. Partenaire : « '+follow+' » Répondez puis échangez les rôles.',writeLines=0,rubric=rubric(['Consigne et réponse conformes aux faits.','Impératif selon l’adresse et la forme demandées.','Pronoms et négation correctement placés.' if level=='A2' else 'Consigne compréhensible, sans sujet exprimé.']),explanation='Modèle non exclusif, à apprécier par l’enseignant.'+(' Les variantes asseyez/assoyez ou assieds/assois sont recevables.' if slug in variants else ''))
   elif mechanic=='t':u=dict(**common,kind='transform',prompt=neutral,cue=cue,answers=models,directive='Transformez en consigne à l’impératif '+('négatif' if negative else 'affirmatif')+', à l’adresse « '+address+' ». Reprenez les compléments comme indiqué dans la situation.',responseLines=2,explanation=explanation+' Modèle : '+models[0])
   else:
    start=prompt.index('___');u=dict(**common,kind='correct',prompt=prompt.replace('___',d1),cue=cue,answers=models,error=dict(segmentId='prompt',start=start,end=start+len(d1),text=d1),responseLines=2,explanation=explanation+' Modèle : '+models[0])
   units.append(u)
  instructions={'q':{'choice':'Choisissez la forme de l’impératif selon l’adresse et la situation.','gap':'Écrivez l’impératif du verbe indiqué, avec les pronoms et la négation demandés.' if level=='A2' else 'Écrivez le verbe indiqué à l’impératif selon tu, nous ou vous.'},'o':{'order':'Remettez toutes les étiquettes dans l’ordre pour donner la consigne. Les formes avec traits d’union restent sur une étiquette.'},'p':{'open-oral':'Donnez la consigne dans le rôle indiqué puis répondez à votre partenaire.'},'t':{'transform':'Transformez la phrase en consigne selon l’adresse, la forme et les pronoms demandés.'},'c':{'correct':'Corrigez l’impératif et réécrivez la consigne selon la situation.'}}[mechanic]
  banks.append(bank(aid,'f11',level,label,instructions,units))
for sub in ['f10','f11']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=10,banks=len(banks),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),variants=810,authoredSituations=150,documents=20,readingQuestions=60)))

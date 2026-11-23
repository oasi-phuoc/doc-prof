"""Compile reviewed authored communication situations, without remote operations."""
import csv,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];SOURCE=ROOT/'scripts/grammar_curriculum';REV='demander-2026-11-23-v1'
def rows(name,width,count=50):
 r=[x for x in csv.reader((SOURCE/(name+'.tsv')).read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==count and all(len(x)==width for x in r),(name,len(r));assert len({x[0] for x in r})==count;return r
def unit(aid,slug,index,prompt,answers,source,**kw):return dict(id=f'{aid}-a1-{slug}',prompt=prompt,answers=answers,source=dict(path=f'scripts/grammar_curriculum/{source}.tsv',typeId=aid,position=index,partition='a1'),**kw)
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def bank(aid,sub,label,instructions,units):return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-demander',level='A1',label=label,objective={'f1':'Choisir ce, cet, cette ou ces selon le nom montré, son genre, son nombre et son début.','f2':'Formuler une demande, une proposition, un souhait ou une obligation avec pouvoir, devoir et vouloir au présent.','f3':'Accepter ou refuser poliment une proposition selon le rôle et les faits de la situation.'}[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Situations, formes et variantes relues ; modèles ouverts non exclusifs. Rôles fictifs, sans imposer une préférence personnelle. Approbation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units)
def options(a,others,slug,limit=3):
 vals=[a]+[x for x in dict.fromkeys(others) if x!=a][:limit-1];assert len(vals)==limit and len(set(vals))==limit,(slug,vals)
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in vals]
def fill(p,a):return p.replace('___',a)
def words(tagged,slug):return [dict(id=slug+f'-m{i+1}',text=t.rsplit('~',1)[0],category=t.rsplit('~',1)[1]) for i,t in enumerate(tagged.split(';'))]
def sentence(tokens):return ' '.join(t['text'] for t in tokens).replace('’ ','’')
F1=rows('demander-f1-a1',7);F2=rows('demander-f2-a1',9);F3=rows('demander-f3-a1',8);READ=rows('demander-lectures-a1',15,20)
banks=[]
def demo(row):
 slug,noun,gender,number,onset,p,context=row;answer='Ces' if number=='pluriel' else 'Cette' if gender=='féminin' else 'Cet' if onset in ['voyelle','h-muet'] else 'Ce'
 return answer
for mechanic,label in [('q','Choisir ce, cet, cette, ces'),('a','Associer'),('c','Corriger l’erreur')]:
 aid='gram-ex-f1-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,row in enumerate(F1):
  slug,noun,gender,number,onset,p,context=row;a=demo(row);cue=context+' Nom : '+noun+' ('+gender+' '+number+').'
  if mechanic=='q':u=unit(aid,slug,i,p,[a],'demander-f1-a1',kind='completion',cue=cue,options=options(a,['Ce','Cet','Cette','Ces'],slug,4),explanation='La forme dépend du genre, du nombre et du début du nom. Cet s’emploie au masculin singulier devant une voyelle ou un h muet, pas devant un h aspiré. Phrase : '+fill(p,a))
  elif mechanic=='c':
   wrong={'Ce':'Cette','Cet':'Ce','Cette':'Cet','Ces':'Cette'}[a]
   u=unit(aid,slug,i,fill(p,wrong),[fill(p,a)],'demander-f1-a1',kind='correct',cue=cue,responseLines=2,error=dict(segmentId='prompt',start=p.index('___'),end=p.index('___')+len(wrong),text=wrong),explanation='Remplacez seulement le déterminant par « '+a+' ». Conservez le nom et les autres informations.')
  else:
   # Directed cycle through distinct forms: 50 unique grouped problems, not repeated/reversed pairs.
   other=next(F1[(i+offset)%50] for offset in range(7,51) if demo(F1[(i+offset)%50])!=a)
   pairs=[dict(id=slug+f'-p{j+1}',left=r[5],right=demo(r),sourceId='demander-f1-a1:'+r[0]) for j,r in enumerate([row,other])]
   prompt='Situation 1 : '+cue+'\nSituation 2 : '+other[6]+' Nom : '+other[1]+' ('+other[2]+' '+other[3]+').'
   u=unit(aid,slug,i,prompt,[fill(p,a)+'\n'+fill(other[5],demo(other))],'demander-f1-a1',kind='match',pairs=pairs,explanation='Chaque phrase garde son nom et sa situation. Associez les deux déterminants selon le genre, le nombre et le début des noms.')
  units.append(u)
 banks.append(bank(aid,'f1',label,{'q':{'choice':'Choisissez ce, cet, cette ou ces selon le nom. Au début de la phrase, mettez une majuscule.','gap':'Complétez avec ce, cet, cette ou ces, avec une majuscule en début de phrase.'},'a':{'match':'Associez chaque phrase à son déterminant. Les deux situations précisent les noms montrés.'},'c':{'correct':'Corrigez le déterminant démonstratif puis réécrivez la phrase entière.'}}[mechanic],units))
forms={'pouvoir':['peux','peut','pouvons','pouvez','peuvent'],'devoir':['dois','doit','devons','devez','doivent'],'vouloir':['veux','veut','voulons','voulez','veulent']}
for mechanic,label in [('q','Demander et proposer'),('s','Jouer une situation'),('p','S’exprimer à l’oral')]:
 aid='gram-ex-f2-'+('qcm-conj' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,verb,person,context,p,a,opening,follow,reply) in enumerate(F2):
  model=fill(p,a)
  if mechanic=='q':u=unit(aid,slug,i,p,[a],'demander-f2-a1',kind='completion',cue=context,givenVerb=verb,options=options(a,forms[verb],slug),explanation='Conjuguez '+verb+' au présent selon le sujet. Le groupe qui suit garde sa forme. Phrase : '+model)
  elif mechanic=='p':u=unit(aid,slug,i,context,[model+'\n'+reply],'demander-f2-a1',kind='production',mode='oral',task='Formulez la demande, la proposition, le souhait ou l’obligation avec « '+verb+' » au présent. Votre partenaire demande : « '+follow+' » Répondez, puis échangez les rôles.',writeLines=0,rubric=rubric(['Intention, rôles et faits de la situation respectés.','Pouvoir, devoir ou vouloir adapté et conjugué.','Infinitif ou groupe nominal correctement construit.','Phrase compréhensible et réponse cohérente à la relance.']),explanation='Exemple possible. Des formulations équivalentes et les accords adaptés au rôle sont recevables. Appréciation enseignante, sans verdict automatique.')
  else:u=unit(aid,slug,i,'Demander, proposer ou expliquer une obligation',['Personne A : '+model+'\nPersonne B : '+follow+'\nPersonne A : '+reply],'demander-f2-a1',kind='scenario',contract='open',situation=context,roles=[dict(id='a',label='Personne A',goal='Exprimez l’intention donnée avec '+verb+' au présent.'),dict(id='b',label='Personne B',goal='Ouvrez l’échange puis posez la relance proposée.')],turns=[dict(id='debut',roleId='b',text=opening)],task='Personne A : répondez selon la situation avec '+verb+'. Personne B : posez la relance. Personne A : répondez, puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Intention et faits respectés.','Verbe modal et personne correctement choisis.','Demande ou explication compréhensible.','Réponse cohérente à la relance.']),explanation='Exemple de suite possible après la question initiale. Les réponses cohérentes sont appréciées par l’enseignant ; les faits du rôle ne sont pas des informations personnelles réelles.')
  units.append(u)
 banks.append(bank(aid,'f2',label,{'q':{'choice':'Choisissez la forme du verbe indiqué au présent selon la situation et le sujet.','gap':'Complétez avec le verbe indiqué au présent pour formuler la demande, le souhait ou l’obligation.'},'s':{'scenario-set':'Jouez l’échange à deux avec pouvoir, devoir ou vouloir au présent, puis répondez à la relance.'},'p':{'open-oral':'Exprimez l’intention de votre rôle avec le verbe indiqué, puis répondez à votre partenaire.'}}[mechanic],units))
F=[(slug,intent,context,offer,words(tagged,slug),[x for x in alts.split(';') if x],follow,reply) for slug,intent,context,offer,tagged,alts,follow,reply in F3]
for mechanic,label in [('q','Accepter ou refuser'),('a','Associer'),('o','Mots dans l’ordre'),('s','Jouer une situation'),('pe','Écrire une phrase utile'),('po','Dire une phrase utile')]:
 aid='gram-ex-f3-'+('qcm-verbe' if mechanic=='q' else 'communication-'+mechanic if mechanic in ['pe','po'] else 'curriculum-'+mechanic);units=[]
 for i,(slug,intent,context,offer,tokens,alts,follow,reply) in enumerate(F):
  model=sentence(tokens);answers=list(dict.fromkeys([model]+alts));explanation='Modèle possible. Toute réponse polie qui respecte l’intention et les faits est recevable ; accords selon le rôle, appréciation enseignante.'
  if mechanic=='q':u=unit(aid,slug,i,'Proposition : « '+offer+' »\nVotre réponse : ___',answers,'demander-f3-a1',kind='completion',cue=context+' Intention demandée : '+intent+'.',options=options(model,['Non merci.','Désolé, je ne peux pas.'] if intent=='accepter' else ['Oui, avec plaisir.','D’accord, merci.'],slug),explanation='La situation fixe l’intention, sans imposer votre préférence personnelle. '+explanation)
  elif mechanic=='o':u=unit(aid,slug,i,'Remettez les mots dans l’ordre pour répondre.',[model],'demander-f3-a1',kind='order',cue=context+' Proposition : « '+offer+' »',tokens=tokens,responseLines=2,explanation='Ordre possible, sans ordre unique imposé lorsque d’autres phrases correctes conservent tous les mots et la même intention. Évaluation enseignante.')
  elif mechanic=='a':
   j=25+i if i<25 else (i-25+1)%25;other=F[j];pairs=[dict(id=slug+f'-p{k+1}',left=f'Situation {k+1} : « '+r[3]+' »',right=sentence(r[4]),sourceId='demander-f3-a1:'+r[0]) for k,r in enumerate([F[i],other])]
   prompt='Situation 1 : '+context+' Intention : '+intent+'.\nSituation 2 : '+other[2]+' Intention : '+other[1]+'.'
   u=unit(aid,slug,i,prompt,[offer+' → '+model+'\n'+other[3]+' → '+sentence(other[4])],'demander-f3-a1',kind='match',pairs=pairs,explanation='Les deux rôles imposent deux intentions différentes. Associez chaque proposition à la réponse compatible avec son contexte.')
  elif mechanic=='s':u=unit(aid,slug,i,'Répondre à une proposition',['Personne A : '+model+'\nPersonne B : '+follow+'\nPersonne A : '+reply],'demander-f3-a1',kind='scenario',contract='open',situation=context,roles=[dict(id='a',label='Personne A',goal='Répondez poliment en respectant l’intention du rôle : '+intent+'.'),dict(id='b',label='Personne B',goal='Faites la proposition puis posez la relance.')],turns=[dict(id='debut',roleId='b',text=offer)],task='Personne A : acceptez ou refusez selon votre rôle. Personne B : posez la relance. Personne A : répondez, puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Intention et faits du rôle respectés.','Acceptation ou refus clairement exprimé.','Formule polie et phrase compréhensible.','Réponse cohérente à la relance.']),explanation=explanation)
  else:u=unit(aid,slug,i,context,answers,'demander-f3-a1',kind='production',mode='written' if mechanic=='pe' else 'oral',task='Proposition : « '+offer+' » '+('Écrivez' if mechanic=='pe' else 'Dites')+' une seule phrase pour '+intent+' poliment selon ce rôle.',writeLines=2 if mechanic=='pe' else 0,rubric=rubric(['Intention et faits du rôle respectés.','Acceptation ou refus clairement exprimé.','Formule polie et phrase compréhensible.']),explanation=explanation)
  units.append(u)
 instructions={'q':{'choice':'Selon le rôle, choisissez une réponse qui accepte ou refuse poliment la proposition.','gap':'Écrivez une réponse polie selon l’intention du rôle. Plusieurs formulations sont possibles.'},'a':{'match':'Lisez les deux situations. Associez chaque proposition à la réponse qui respecte l’intention du rôle.'},'o':{'order':'Remettez tous les mots dans l’ordre pour répondre poliment selon le rôle.'},'s':{'scenario-set':'Jouez la proposition, la réponse polie et la relance à deux.'},'pe':{'open-written':'Écrivez une seule phrase adaptée à la proposition et à l’intention du rôle.'},'po':{'open-oral':'Dites une seule phrase adaptée à la proposition et à l’intention du rôle.'}}[mechanic]
 banks.append(bank(aid,'f3',label,instructions,units))
aid='gram-ex-f3-communication-ce';units=[]
for i,(slug,genre,title,text,q,a,e,d1,d2,q2,a2,e2,q3,a3,e3) in enumerate(READ):
 text=text.replace('\\n','\n');qs=[]
 for j,(question,answer,evidence) in enumerate([(q,a,e),(q2,a2,e2),(q3,a3,e3)]):
  assert evidence in text,(slug,evidence);child=dict(id=slug+f'-q{j+1}',prompt=question,answers=[answer],evidence=[evidence],explanation='Le document indique : « '+evidence+' ». Une reformulation fidèle est recevable.',response='choice' if j==0 else 'short')
  if j==0:child['options']=options(answer,[d1,d2],slug)
  qs.append(child)
 units.append(unit(aid,slug,i,title,[],'demander-lectures-a1',kind='reading',genre=genre,text=text,questions=qs,explanation='Les réponses reposent sur le document ; distinguez l’intention et les renseignements pratiques.'))
banks.append(bank(aid,'f3','Lire une situation',{'document-set':'Lisez chaque document et répondez à ses trois questions. Repérez la réponse à la proposition et les informations pratiques.'},units))
for sub in ['f1','f2','f3']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),activities=len({b['activityId'] for b in banks}),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks))))

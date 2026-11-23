"""Compile authored activity/tonic-pronoun sources; reuse reviewed daily banks separately."""
import csv, hashlib, json, shutil
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'scripts/grammar_curriculum'
REV='activite-2026-11-23-v1'
MANIFEST='docs/grammaire/implementation/activite-media-manifest.json'
def rows(name,width,count=50):
 r=[r for r in csv.reader((SOURCE/name).read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(r)==count,(name,len(r));assert all(len(x)==width for x in r),[(x[0],len(x)) for x in r if len(x)!=width]
 assert len({x[0] for x in r})==count
 return r
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def unit(aid,level,slug,index,prompt,answers,source,**kw):
 return dict(id=f'{aid}-{level.lower()}-{slug}',prompt=prompt,answers=answers,source=dict(path=f'scripts/grammar_curriculum/{source}.tsv',typeId=aid,position=index,partition=level.lower()),**kw)
def bank(aid,sub,level,label,instructions,units):
 return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-activite',level=level,label=label,objective={'d1':'Parler de loisirs avec faire du, de la ou de l’.','d3':'Choisir un pronom tonique dont le référent est explicite, avec préposition ou comparaison.'}[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Sources contextuelles relues, modèles non exclusifs pour les productions ; validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units)
def options(answer,others,slug):
 values=[answer]+[x for x in others if x!=answer][:3]
 assert len(values)==len(set(values))
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in values]
media={}
def support(name):
 group='sports' if name in ['cyclisme','natation','escalade','gymnastique','yoga'] else 'loisirs'
 source=f'/lib/images/vocabulaire/{group}/{name}.webp';p=ROOT/'public'/source.lstrip('/')
 digest=hashlib.sha256(p.read_bytes()).hexdigest();w,h=Image.open(p).size
 dest=f'/lib/images/grammaire/curriculum/sha256/{digest}.webp';out=ROOT/'public'/dest.lstrip('/');out.parent.mkdir(exist_ok=True,parents=True)
 if out.exists():assert out.read_bytes()==p.read_bytes()
 else:shutil.copyfile(p,out)
 alt={'cyclisme':'Une personne se déplace à vélo.','natation':'Une personne nage.','escalade':'Une personne grimpe sur un mur d’escalade.','gymnastique':'Une personne pratique la gymnastique.','yoga':'Une personne pratique le yoga.','jardinage':'Une personne s’occupe de plantes.','danse':'Une personne danse.','bricolage':'Une personne bricole avec un outil.','couture':'Une machine et du matériel de couture.','peinture':'Une palette et des pinceaux.','dessin':'Un carnet et des crayons de dessin.'}[name]
 s=dict(id='activite-'+name,src=dest,sha256=digest,width=w,height=h,alt=alt,source=dict(path=source,manifest=MANIFEST,rights='permitted-reuse',note='Réemploi interne de la banque propriétaire. Support de l’activité uniquement : les personnes, lieux, dates et intentions de la situation sont fictifs et donnés par le texte.'))
 media[name]=s;return s
A=rows('activite-a1.tsv',6);B=rows('toniques-a1.tsv',4);C=rows('toniques-a2.tsv',8);D=rows('activite-lectures.tsv',15,20)
d1=[];aid='gram-ex-d1-qcm-verbe';units=[]
for i,(slug,image,prompt,answer,context,task) in enumerate(A):
 units.append(unit(aid,'A1',slug,i,prompt,[answer],'activite-a1',kind='completion',cue=context,options=options(answer,['du','de la','de l’','des'],slug),imageSupports=[support(image)],explanation='Avec faire : du + nom masculin, de la + nom féminin, de l’ + voyelle. Phrase : '+prompt.replace('___',answer)))
d1.append(bank(aid,'d1','A1','Parler de ses activités',{'choice':'Choisissez du, de la ou de l’ pour compléter la phrase. Le texte précise la situation ; l’image illustre seulement l’activité.','gap':'Complétez avec du, de la ou de l’. Le texte précise la situation ; l’image illustre seulement l’activité.'},units))
for mode in ['written','oral']:
 aid='gram-ex-d1-communication-'+('pe' if mode=='written' else 'po');units=[]
 for i,(slug,image,prompt,answer,context,task) in enumerate(A):
  units.append(unit(aid,'A1',slug,i,context,[prompt.replace('___',answer)],'activite-a1',kind='production',mode=mode,task=task+' '+('Écrivez' if mode=='written' else 'Dites')+' une seule phrase adaptée à la situation.',writeLines=2 if mode=='written' else 0,rubric=rubric(['Intention et personne demandées respectées.','Faire conjugué selon le sujet.','Du, de la ou de l’ adapté à l’activité.','Phrase compréhensible et cohérente avec les faits.']),explanation='Exemple possible. Une autre phrase correcte répondant à la situation est recevable ; appréciation par l’enseignant.'))
 d1.append(bank(aid,'d1','A1','Écrire une phrase utile' if mode=='written' else 'Dire une phrase utile',{'open-written' if mode=='written' else 'open-oral':('Écrivez' if mode=='written' else 'Dites')+' une seule phrase adaptée à chaque situation.'},units))
aid='gram-ex-d1-communication-ce';units=[]
for i,row in enumerate(D):
 slug,genre,title,text,q,a,e,distr1,distr2,q2,a2,e2,q3,a3,e3=row;text=text.replace('\\n','\n')
 questions=[]
 for j,(question,answer,evidence) in enumerate([(q,a,e),(q2,a2,e2),(q3,a3,e3)]):
  assert evidence in text,(slug,evidence)
  qq=dict(id=f'{slug}-q{j+1}',prompt=question,answers=[answer],evidence=[evidence],explanation='Le document indique : « '+evidence+' ».',response='choice' if j==0 else 'short')
  if j==0:qq['options']=options(answer,[distr1,distr2],slug)
  questions.append(qq)
 units.append(unit(aid,'A1',slug,i,title,[],'activite-lectures',kind='reading',genre=genre,text=text,questions=questions,explanation='Chaque réponse est justifiée par un passage du document.'))
d1.append(bank(aid,'d1','A1','Lire une situation',{'document-set':'Lisez chaque document et répondez à ses trois questions. Cochez une réponse ou écrivez une réponse courte selon la question.'},units))
TONICS=['moi','toi','lui','elle','nous','vous','eux','elles']
d3=[];aid='gram-ex-d3-qcm-verbe';units=[]
for i,(slug,person,prompt,answer) in enumerate(B):
 others=[x.capitalize() if answer[0].isupper() else x for x in TONICS]
 units.append(unit(aid,'A1',slug,i,prompt,[answer],'toniques-a1',kind='completion',cue='Personne à reprendre : '+person+'.',options=options(answer,others,slug),explanation='Le pronom tonique correspondant à « '+person+' » est « '+answer.lower()+' ».'))
d3.append(bank(aid,'d3','A1','Choisir le pronom tonique',{'choice':'Choisissez le pronom tonique correspondant à la personne indiquée.','gap':'Complétez avec le pronom tonique correspondant à la personne indiquée.'},units))
def group_candidates(target):
 for prefix in ['à côté de ','près de ','avec ','sans ','chez ','pour ','à ','contre ','devant ','derrière ','que ','sur ']:
  if target.startswith(prefix):
   def join(p):
    if p in ['elle','eux','elles'] and prefix=='que ':return 'qu’'+p
    if p in ['elle','eux','elles'] and prefix.endswith('de '):return prefix[:-3]+'d’'+p
    return prefix+p
   return [join(p) for p in TONICS]
 raise AssertionError(target)
units=[]
for i,(slug,phrase,target,answer,context,opening,followup,reply) in enumerate(C):
 assert phrase.count(target)==1
 units.append(unit(aid,'A2',slug,i,phrase.replace(target,'___'),[answer],'toniques-a2',kind='completion',cue=context+' Groupe à reprendre : « '+target+' ».',options=options(answer,group_candidates(target),slug),explanation='Reprise de « '+target+' » : « '+answer+' ». La préposition ou que appartient au groupe ; de et que s’élident devant elle, eux et elles.'))
d3.append(bank(aid,'d3','A2','Choisir le pronom tonique',{'choice':'Choisissez le groupe complet avec un pronom tonique. Respectez le référent, la préposition et les élisions.','gap':'Reprenez le groupe indiqué avec un pronom tonique. Écrivez aussi la préposition ou que/qu’, avec les élisions nécessaires.'},units))
aid='gram-ex-d3-curriculum-t';units=[]
for i,(slug,phrase,target,answer,context,opening,followup,reply) in enumerate(C):
 units.append(unit(aid,'A2',slug,i,phrase,[phrase.replace(target,answer)],'toniques-a2',kind='transform',cue=context,directive='Reprenez « '+target+' » par un groupe avec un pronom tonique. Conservez le reste de la phrase.',responseLines=2,explanation='Le groupe devient « '+answer+' ». Conservez les informations, la préposition ou la comparaison, et faites l’élision si nécessaire.'))
d3.append(bank(aid,'d3','A2','Transformer une phrase',{'transform':'Réécrivez chaque phrase en reprenant le groupe indiqué par un pronom tonique. Le contexte précise qui parle et à qui.'},units))
aid='gram-ex-d3-curriculum-s';units=[]
for i,(slug,phrase,target,answer,context,opening,followup,reply) in enumerate(C):
 units.append(unit(aid,'A2',slug,i,'Pronoms toniques en situation',['A : '+phrase.replace(target,answer)+'\nB : '+followup+'\nA : '+reply],'toniques-a2',kind='scenario',contract='open',situation=context,roles=[dict(id='a',label='Personne A',goal='Répondez selon votre rôle et les faits de la situation.'),dict(id='b',label='Personne B',goal='Posez la question initiale, puis la relance proposée.')],turns=[dict(id='debut',roleId='b',text=opening)],task='Personne A : répondez en reprenant « '+target+' » avec un pronom tonique. Poursuivez l’échange, puis inversez les rôles.',followUps=[followup],writeLines=0,rubric=rubric(['Rôles et faits de la situation respectés.','Pronom tonique avec un référent clair.','Préposition ou comparaison et élisions correctes.','Relance et réponse cohérentes.']),explanation='Exemple possible de suite après la question initiale. D’autres réponses cohérentes sont recevables ; évaluation humaine.'))
d3.append(bank(aid,'d3','A2','Jouer une situation',{'scenario-set':'Préparez puis jouez le dialogue à deux. Reprenez les personnes par des pronoms toniques et répondez à la relance.'},units))
for name,banks in [('d1',d1),('d3',d3)]:
 (ROOT/f'src/grammaire/curriculum/data/{name}.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
manifest=dict(obligationId='IMG-d1-A1',hostActivityId='gram-ex-d1-qcm-verbe',reviewedIllustratedSituations=50,distinctImages=len(media),humanApproval='pending',images=[dict(**s,unitIds=[u['id'] for u in d1[0]['units'] if u['imageSupports'][0]['id']==s['id']]) for s in media.values()],note='50 situations illustrées ; images réemployées sans génération, originaux inchangés. Aucune identité ou donnée contextuelle déduite de l’image.')
(ROOT/MANIFEST).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(d1+d3),units=sum(len(b['units']) for b in d1+d3),distinctImages=len(media))))

"""Compile authored temporal situations. No generated paraphrase multiplier or remote writes."""
import csv,hashlib,json,shutil
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SOURCE=ROOT/'scripts/grammar_curriculum';REV='temps-2026-11-23-v1';MANIFEST='docs/grammaire/implementation/temps-media-manifest.json'
def rows(name,width,count=50):
 r=[r for r in csv.reader((SOURCE/(name+'.tsv')).read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(r)==count and all(len(x)==width for x in r),(name,len(r),[len(x) for x in r]);assert len({x[0] for x in r})==count
 return r
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def unit(aid,level,slug,index,prompt,answers,source,**kw):return dict(id=f'{aid}-{level.lower()}-{slug}',prompt=prompt,answers=answers,source=dict(path=f'scripts/grammar_curriculum/{source}.tsv',typeId=aid,position=index,partition=level.lower()),**kw)
def bank(aid,sub,level,label,instructions,units):return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-temps',level=level,label=label,objective={'e2':'Préciser une heure, un jour, une date, un mois ou une saison.','e3':'Distinguer la durée en cours, la durée terminée, la durée prévue et le moment passé.','e4':'Décrire une habitude avec toujours, souvent, parfois, rarement et ne… jamais.','e5':'Organiser trois étapes avec d’abord, puis et enfin.' if level=='A1' else 'Organiser quatre étapes avec des connecteurs et avant de / après avoir.'}[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Repères et variantes relus. Modèles ouverts non exclusifs, appréciation enseignante en attente. Les étapes entières ne constituent pas un classement par nature grammaticale.'),presentations=list(instructions),instructions=instructions,units=units)
def options(answer,others,slug):
 vals=[answer]+[x for x in others if x!=answer][:2];assert len(vals)==3 and len(set(vals))==3,(slug,vals)
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in vals]
def fill(p,a):return p.replace('___',a)
def cap(s):return s[0].upper()+s[1:]
E2=rows('temps-e2-a1',6);E3={l:rows('temps-e3-'+l.lower(),5 if l=='A1' else 9) for l in ['A1','A2']};E4=rows('temps-e4-a1',6);E5={l:rows('temps-e5-'+l.lower(),7 if l=='A1' else 11) for l in ['A1','A2']};READ=rows('temps-lectures-a1',20,20)
media={};uses={}
def register_support(path,image_id,alt,note,aid,uid):
 p=ROOT/'public'/path.lstrip('/');data=p.read_bytes();sha=hashlib.sha256(data).hexdigest()
 with Image.open(p) as image:w,h=image.size
 src=f'/lib/images/grammaire/curriculum/sha256/{sha}.webp';out=ROOT/'public'/src.lstrip('/');out.parent.mkdir(exist_ok=True,parents=True)
 if out.exists():assert out.read_bytes()==data
 else:shutil.copyfile(p,out)
 s=dict(id=image_id,src=src,sha256=sha,width=w,height=h,alt=alt,source=dict(path=path,manifest=MANIFEST,rights='permitted-reuse',note=note))
 media[image_id]=s;uses.setdefault(image_id,[]).append(dict(activityId=aid,unitId=uid));return s
def support(name,aid,uid):
 label={'huit-heures':'8 heures','douze-heures':'12 heures','quatorze-heures-trente':'2 heures 30 sur un cadran de douze heures','dix-huit-heures':'6 heures sur un cadran de douze heures','lundi':'le mot lundi','calendrier':'un calendrier symbolique','printemps':'un arbre en fleurs au printemps','été':'un paysage ensoleillé en été','automne':'un arbre aux feuilles rouges en automne','hiver':'un paysage enneigé en hiver'}[name.split('/')[-1]]
 return register_support('/lib/images/vocabulaire/'+name+'.webp','temps-'+name.replace('/','-'),'Illustration montrant '+label+'.','Réemploi interne sans modification. Le texte fixe la date et distingue matin et après-midi sur les cadrans de douze heures. Le calendrier et les saisons sont symboliques.',aid,uid)
banks=[];aid='gram-ex-e2-qcm-verbe';units=[]
for i,(slug,image,context,p,a,task) in enumerate(E2):
 others={'à':['en','le'],'en':['à','le'],'au':['en','à'],'le':['en','au'],'vers':['en','au']}[a]
 u=unit(aid,'A1',slug,i,p,[a],'temps-e2-a1',kind='completion',cue=context,options=options(a,others,slug),explanation='Le texte précise le repère temporel. Phrase : '+fill(p,a));u['imageSupports']=[support(image,aid,u['id'])];units.append(u)
banks.append(bank(aid,'e2','A1','Situer dans le temps',{'choice':'Lisez la situation et observez l’illustration. Choisissez la forme temporelle correcte.','gap':'Complétez selon la situation avec à, en, au, le ou vers.'},units))
for mode in ['written','oral']:
 aid='gram-ex-e2-communication-'+('pe' if mode=='written' else 'po');units=[]
 for i,(slug,image,context,p,a,task) in enumerate(E2):units.append(unit(aid,'A1',slug,i,context,[fill(p,a)],'temps-e2-a1',kind='production',mode=mode,task=task+' '+('Écrivez' if mode=='written' else 'Dites')+' une seule phrase.',writeLines=2 if mode=='written' else 0,rubric=rubric(['Repère temporel conforme à la situation.','Expression de temps adaptée.','Une phrase compréhensible et utile.']),explanation='Exemple possible ; toute phrase correcte respectant le repère et la demande est recevable, y compris les accords adaptés à la personne. Appréciation enseignante.'))
 banks.append(bank(aid,'e2','A1','Écrire une phrase utile' if mode=='written' else 'Dire une phrase utile',{'open-written' if mode=='written' else 'open-oral':('Écrivez' if mode=='written' else 'Dites')+' une seule phrase adaptée à la demande et au repère temporel.'},units))
aid='gram-ex-e2-communication-ce';units=[]
for i,(slug,genre,title,text,q,a,e,d1,d2,q2,a2,e2,q3,a3,e3,q4,a4,e4,image,alt) in enumerate(READ):
 text=text.replace('\\n','\n');qs=[]
 for j,(question,answer,evidence) in enumerate([(q,a,e),(q2,a2,e2),(q3,a3,e3),(q4,a4,e4)]):
  assert evidence in text,(slug,evidence)
  child=dict(id=slug+f'-q{j+1}',prompt=question,answers=[answer],evidence=[evidence],explanation='Le document indique : « '+evidence+' ».',response='choice' if j==0 else 'short')
  if j==0:child['options']=options(answer,[d1,d2],slug)
  qs.append(child)
 u=unit(aid,'A1',slug,i,title,[],'temps-lectures-a1',kind='reading',genre=genre,text=text,questions=qs,explanation='Les réponses courtes équivalentes sont recevables si elles conservent l’information du document.')
 assert bool(image)==bool(alt),slug
 if image:u['imageSupports']=[register_support(image,'temps-lecture-'+slug,alt,'Illustration TCF réemployée à l’identique pour situer le document.',aid,u['id'])]
 units.append(u)
reading_bank=bank(aid,'e2','A1','Lire une situation',{'document-set':'Lisez chaque document. Cochez une réponse, puis écrivez trois réponses courtes.'},units)
reading_bank['revision']='temps-2026-11-27-v2'
reading_bank['review'].update(date='2026-11-27',note='Questions de lecture relues avec leurs preuves textuelles. L’appréciation enseignante est en attente.')
banks.append(reading_bank)
for level,source in E3.items():
 aid='gram-ex-e3-qcm-verbe';units=[]
 for i,row in enumerate(source):
  slug,context,p,a,alts=row[:5];answers=[a]+[x for x in alts.split(';') if x]
  # Planned duration admits pendant as well as pour. Never present them as competing keys.
  others={'depuis':['pendant','il y a'],'pendant':['depuis','il y a'],'pour':['depuis','il y a'],'il y a':['pendant','pour']}[a]
  units.append(unit(aid,level,slug,i,p,answers,'temps-e3-'+level.lower(),kind='completion',cue=context,options=options(a,others,slug),explanation='Le repère distingue une durée en cours, terminée ou prévue et un moment passé. Phrase : '+fill(p,a)+(' Autre forme recevable pour cette durée prévue : '+fill(p,answers[1]) if len(answers)>1 else '')))
 banks.append(bank(aid,'e3',level,'Exprimer une durée',{'choice':'Lisez les repères. Choisissez la forme qui convient au déroulement de l’action.','gap':'Complétez avec depuis, pendant, pour ou il y a. Pour une durée prévue, pour et pendant peuvent convenir.'},units))
for mechanic,label in [('t','Transformer une phrase'),('c','Corriger l’erreur'),('s','Jouer une situation')]:
 aid='gram-ex-e3-curriculum-'+mechanic;units=[]
 for i,(slug,context,p,a,alts,neutral,opening,follow,reply) in enumerate(E3['A2']):
  models=[fill(p,x) for x in [a]+[x for x in alts.split(';') if x]]
  if mechanic=='t':u=unit(aid,'A2',slug,i,neutral,models,'temps-e3-a2',kind='transform',cue=context,directive='Réunissez les informations en une phrase avec « '+a+' ». Gardez le repère temporel et le déroulement de l’action.',responseLines=2,explanation='Modèle possible. Les autres phrases respectant les faits, le temps verbal et l’expression demandée sont recevables.')
  elif mechanic=='c':
   wrong={'depuis':'il y a','pendant':'depuis','pour':'il y a','il y a':'pendant'}[a];start=p.index('___')
   u=unit(aid,'A2',slug,i,fill(p,wrong),models,'temps-e3-a2',kind='correct',cue=context,responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(wrong),text=wrong),explanation='Corrigez le groupe temporel sans modifier les autres faits. La durée prévue peut aussi être introduite par pendant.')
  else:u=unit(aid,'A2',slug,i,'Préciser une durée ou un moment',['Personne interrogée : '+models[0]+'\nPartenaire : '+follow+'\nPersonne interrogée : '+reply],'temps-e3-a2',kind='scenario',contract='open',situation=context,roles=[dict(id='questionneur',label='Partenaire',goal='Demandez le repère puis la précision proposée.'),dict(id='repondant',label='Personne interrogée',goal='Répondez en respectant les repères de temps.')],turns=[dict(id='debut',roleId='questionneur',text=opening)],task='Répondez à la question. Votre partenaire pose ensuite la relance ; répondez puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Faits et repères temporels respectés.','Expression de durée ou de moment adaptée.','Temps verbal et phrase compréhensibles.','Réponse cohérente à la relance.']),explanation='Exemple de suite possible, sans réponse unique ni verdict automatique. Les formulations équivalentes sont appréciées par l’enseignant.')
  units.append(u)
 banks.append(bank(aid,'e3','A2',label,{'t':{'transform':'Réunissez les informations avec l’expression temporelle demandée, sans changer les repères.'},'c':{'correct':'Corrigez le groupe temporel, puis réécrivez la phrase entière.'},'s':{'scenario-set':'Jouez l’échange à deux en distinguant la durée et le moment de l’action.'}}[mechanic],units))
def frequency(row):
 slug,context,tagged,a,follow,reply=row;tokens=[dict(id=slug+f'-m{i+1}',text=t.split('~')[0],category=t.split('~')[1]) for i,t in enumerate(tagged.split(';'))];sentence=' '.join(t['text'] for t in tokens)+'.';assert sentence.count(a)==1
 return slug,context,tokens,sentence,sentence.replace(a,'___'),a,follow,reply
F=[frequency(row) for row in E4]
for mechanic,label in [('q','Dire la fréquence'),('a','Associer'),('o','Mots en ordre'),('p','S’exprimer à l’oral')]:
 aid='gram-ex-e4-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,context,tokens,sentence,p,a,follow,reply) in enumerate(F):
  if mechanic=='q':u=unit(aid,'A1',slug,i,p,[a],'temps-e4-a1',kind='completion',cue=context,options=options(a,[x for x in ['toujours','souvent','parfois','rarement','jamais'] if x!=a],slug),explanation='La situation fixe la fréquence. Phrase : '+sentence+' Avec jamais, la négation complète est ne… jamais.')
  elif mechanic=='o':u=unit(aid,'A1',slug,i,'Remettez les mots dans l’ordre.',[sentence],'temps-e4-a1',kind='order',cue=context,tokens=tokens,explanation='Ordre possible. Les autres positions correctes de l’adverbe sont recevables ; conservez ne… jamais pour la négation.')
  elif mechanic=='a':
   other=F[(i+10)%len(F)];pairs=[dict(id=slug+f'-p{j+1}',left=row[4],right=row[5],sourceId='temps-e4-a1:'+row[0]) for j,row in enumerate([F[i],other])]
   u=unit(aid,'A1',slug,i,'Situation 1 : '+context+'\nSituation 2 : '+other[1],[sentence+'\n'+other[3]],'temps-e4-a1',kind='match',pairs=pairs,explanation='Les deux situations fixent deux fréquences différentes. Associez chaque phrase au mot qui conserve son sens.')
  else:u=unit(aid,'A1',slug,i,context,[sentence+'\n'+reply],'temps-e4-a1',kind='production',mode='oral',task='Décrivez l’habitude dans ce rôle. Votre partenaire demande : « '+follow+' » Répondez puis échangez les rôles.',writeLines=0,rubric=rubric(['Habitude et fréquence conformes au rôle.','Adverbe adapté ; ne… jamais si nécessaire.','Phrase compréhensible.','Réponse cohérente à la relance.']),explanation='Exemple possible, sans imposer une habitude personnelle réelle. Autres formulations cohérentes acceptées par l’enseignant.')
  units.append(u)
 instructions={'q':{'choice':'Selon la situation, choisissez l’adverbe de fréquence correct.','gap':'Complétez selon la situation avec toujours, souvent, parfois, rarement ou jamais.'},'a':{'match':'Associez chaque phrase à son adverbe selon les deux situations.'},'o':{'order':'Remettez les mots dans l’ordre pour décrire l’habitude. Conservez tous les mots.'},'p':{'open-oral':'Décrivez l’habitude du rôle fictif et répondez à la relance.'}}[mechanic]
 banks.append(bank(aid,'e4','A1',label,instructions,units))
for level,source in E5.items():
 for mechanic,label in [('q','Organiser les étapes'),('o','Remettre les étapes dans l’ordre'),('p','S’exprimer à l’oral')]+([('t','Transformer une phrase'),('e','Rédiger une procédure')] if level=='A2' else []):
  aid='gram-ex-e5-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
  for i,row in enumerate(source):
   slug=row[0];context=row[1] if level=='A1' else row[2];steps=row[2:5] if level=='A1' else row[3:7];follow,reply=row[-2:];links=['D’abord','Puis','Enfin'] if level=='A1' else ['D’abord','Puis','Ensuite','Enfin'];chunks=[x+', '+s+'.' for x,s in zip(links,steps)];model=' '.join(chunks)
   if mechanic=='q':
    mode=i%(3 if level=='A1' else 5);cue=context+' Étapes données dans leur ordre : '+' ; '.join(steps)+'.'
    if mode<3:
     cue+=' '+['Signalez explicitement la première étape.','Signalez une étape intermédiaire.','Signalez explicitement la dernière étape.'][mode]
     pos=0 if mode==0 else len(steps)-1 if mode==2 else 1;a='D’abord' if mode==0 else 'Enfin' if mode==2 else 'Puis';p='___, '+steps[pos]+'.';alts=['Ensuite'] if mode==1 else [];others=['Enfin','Avant de'] if mode==1 else ['Puis','Enfin' if mode==0 else 'D’abord']
    else:
     inf,pp=row[7:9]
     if mode==3:a='Avant d’' if inf[0].lower() in 'aàâeéèêiîoôuùûh' else 'Avant de ';p='___'+inf+', '+steps[0]+'.';alts=[];others=['Après avoir ','Pendant ']
     else:a='Après avoir ';p='___'+pp+', '+steps[1]+'.';alts=[];others=['Avant de ','Depuis ']
    # Keep grammatical spacing in the prompt; choice labels never carry invisible spaces.
    if a.endswith(' '):a=a.rstrip();p=p.replace('___','___ ')
    others=[x.rstrip() for x in others]
    u=unit(aid,level,slug,i,p,[a]+alts,'temps-e5-'+level.lower(),kind='completion',cue=cue,options=options(a,others,slug),explanation='Respectez l’ordre des étapes et la construction grammaticale. Phrase : '+fill(p,a)+(' Ensuite convient aussi pour cette étape intermédiaire.' if alts else ''))
   elif mechanic=='o':u=unit(aid,level,slug,i,'Remettez les étapes dans l’ordre.',[model],'temps-e5-'+level.lower(),kind='order',tokenUnit='clause',cue=context,tokens=[dict(id=slug+f'-etape{j+1}',text=s,category='verbe') for j,s in enumerate(chunks)],responseLines=2,explanation='Modèle de suite cohérente. Déplacez les étapes entières ; les jetons ne représentent pas des natures de mots. Autres suites cohérentes appréciées par l’enseignant.')
   elif mechanic=='t':u=unit(aid,level,slug,i,' '.join(cap(s)+'.' for s in steps),['Après avoir '+row[8]+', '+steps[1]+'. Ensuite, '+steps[2]+'. Enfin, '+steps[3]+'.'],'temps-e5-a2',kind='transform',cue=context,directive='Réunissez les deux premières étapes avec « après avoir ». Puis ajoutez les deux dernières étapes avec ensuite et enfin. Conservez les quatre actions.',responseLines=2,explanation='Modèle possible ; toute formulation correcte respectant la construction demandée, les quatre actions et leur ordre est recevable.')
   else:u=unit(aid,level,slug,i,context,[model+('\n'+reply if mechanic=='p' else '')],'temps-e5-'+level.lower(),kind='production',mode='oral' if mechanic=='p' else 'written',task='Actions à organiser : '+' ; '.join(steps)+'. '+('Présentez les étapes avec des connecteurs, puis répondez à votre partenaire : « '+follow+' »' if mechanic=='p' else 'Rédigez quatre phrases reliées par des connecteurs, en conservant les actions et leur ordre.'),writeLines=0 if mechanic=='p' else 6,rubric=rubric(['Toutes les actions présentes.','Ordre chronologique et contraintes respectés.','Connecteurs adaptés.','Phrases compréhensibles.']+(['Réponse cohérente à la relance.'] if mechanic=='p' else [])),explanation='Exemple possible. Les autres formulations cohérentes sont appréciées par l’enseignant ; pas de correction automatique.')
   units.append(u)
  instructions={'q':{'choice':'Lisez l’ordre des actions. Choisissez le connecteur qui convient à l’étape ou à la construction demandée.','gap':'Complétez avec un connecteur adapté à l’ordre et à la construction de la phrase.'},'o':{'order':'Déplacez les étapes entières pour former une suite cohérente.'},'p':{'open-oral':'Présentez les étapes dans un ordre cohérent, puis répondez à la relance.'},'t':{'transform':'Reliez les quatre actions en respectant les constructions demandées.'},'e':{'open-written':'Rédigez une courte procédure en quatre étapes avec des connecteurs.'}}[mechanic]
  banks.append(bank(aid,'e5',level,label,instructions,units))
aid='gram-ex-e5-curriculum-d';units=[]
for i,row in enumerate(E5['A2'][:20]):
 slug,genre,context=row[:3];steps=row[3:7];body='\n'.join(x+', '+s+'.' for x,s in zip(['D’abord','Puis','Ensuite','Enfin'],steps));title='Les étapes : '+slug.replace('-',' ')
 text=('Bonjour,\nVoici comment je procède.\n'+body+'\nÀ bientôt.' if genre in ['courriel','message'] else ('Mon récit\n' if genre=='récit' else 'Ma méthode\n')+body);qs=[]
 for j,(question,answer) in enumerate([('Quelle action est présentée en premier ?',steps[0]),('Quelle action suit immédiatement « '+steps[1]+' » ?',steps[2]),('Quelle est la dernière action ?',steps[3])]):
  child=dict(id=slug+f'-q{j+1}',prompt=question,answers=[answer],evidence=[answer],explanation='Le document indique : « '+answer+' ». Une reformulation fidèle est recevable.',response='choice' if j==0 else 'short')
  if j==0:child['options']=options(answer,[steps[1],steps[3]],slug)
  qs.append(child)
 units.append(unit(aid,'A2',slug,i,title,[],'temps-e5-a2',kind='reading',genre=genre,text=text,questions=qs,explanation='Les réponses doivent conserver l’ordre explicite du texte.'))
banks.append(bank(aid,'e5','A2','Lire une chronologie',{'document-set':'Lisez chaque document. Repérez la première action, l’action suivante et la dernière action.'},units))
for sub in ['e2','e3','e4','e5']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
b=next(b for b in banks if b['activityId']=='gram-ex-e2-qcm-verbe')
completion_image_count=len({s['sha256'] for u in b['units'] for s in u['imageSupports']})
ob=dict(obligationId='IMG-e2-A1',hostActivityId=b['activityId'],level='A1',reviewedIllustratedSituations=50,distinctImages=completion_image_count,unitIds=[u['id'] for u in b['units']],humanReview='pending')
(ROOT/MANIFEST).write_text(json.dumps(dict(obligations=[ob],distinctImages=len({s['sha256'] for s in media.values()}),humanReview='pending',images=[dict(**s,uses=uses[n]) for n,s in media.items()],note='Dix images illustrent les 50 situations à compléter. Quatre illustrations TCF situent des documents de lecture A1.'),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),activities=len({b['activityId'] for b in banks}),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks))))

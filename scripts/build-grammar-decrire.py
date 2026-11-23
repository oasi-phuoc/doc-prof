"""Compile the first five authored Décrire notions. No remote writes or quota multiplier."""
import csv, hashlib, json, shutil
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]; SOURCE=ROOT/'scripts/grammar_curriculum'
REV='decrire-2026-11-23-v1'; MANIFEST='docs/grammaire/implementation/decrire-media-manifest.json'
def rows(sub,width):
 name='decrire-'+sub+'-a1'; r=[x for x in csv.reader((SOURCE/(name+'.tsv')).read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==width for x in r),(name,len(r)); assert len({x[0] for x in r})==50
 return r
def unit(aid,sub,slug,i,prompt,answers,**kw):return dict(id=f'{aid}-a1-{slug}',prompt=prompt,answers=answers,source=dict(path=f'scripts/grammar_curriculum/decrire-{sub}-a1.tsv',typeId=aid,position=i,partition='a1'),**kw)
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def bank(aid,sub,label,instructions,units):return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-decrire',level='A1',label=label,objective={'f4':'Décrire le temps avec il fait, il y a, il pleut et il neige selon un bulletin illustré.','f5':'Identifier avec c’est, reprendre une personne ou une chose avec il est / elle est, annoncer une présence avec il y a.','f6':'Choisir un déterminant possessif selon le possesseur et le nom, sans confondre leur genre.','f7':'Accorder un adjectif qualificatif attribut selon le genre et le nombre du sujet.','f8':'Identifier et présenter un métier à partir d’une activité et d’un rôle fictifs.'}[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Situations et variantes relues, modèles ouverts non exclusifs. Rôles fictifs ; validation enseignante en attente. Les situations sont réemployées entre les mécaniques, sans multiplier les histoires revendiquées.'),presentations=list(instructions),instructions=instructions,units=units)
def options(a,others,slug,limit=3):
 vals=[a]+[x for x in dict.fromkeys(others) if x!=a][:limit-1]; assert len(vals)==limit and len(set(vals))==limit,(slug,vals)
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in vals]
def fill(p,a):return p.replace('___',a)
def cap(s):return s[0].upper()+s[1:]
F4=rows('f4',8); F5=rows('f5',6); F6=rows('f6',8); F7=rows('f7',11); F8=rows('f8',9)
media={}; uses={}
def support(name,aid,uid):
 path='/lib/images/vocabulaire/meteo/'+name+'.webp'; p=ROOT/'public'/path.lstrip('/'); data=p.read_bytes(); sha=hashlib.sha256(data).hexdigest(); w,h=Image.open(p).size
 src=f'/lib/images/grammaire/curriculum/sha256/{sha}.webp'; out=ROOT/'public'/src.lstrip('/'); out.parent.mkdir(exist_ok=True,parents=True)
 if out.exists():assert out.read_bytes()==data
 else:shutil.copyfile(p,out)
 label={'soleil':'un soleil','pluie':'un nuage et des gouttes de pluie','neige':'un nuage et des flocons','vent':'du vent et des feuilles emportées','brouillard':'un paysage dans le brouillard','ciel-couvert':'un ciel couvert de nuages','orage':'un nuage sombre avec un éclair','éclaircie':'le soleil entre les nuages'}[name]
 s=dict(id='decrire-meteo-'+name,src=src,sha256=sha,width=w,height=h,alt='Illustration montrant '+label+'.',source=dict(path=path,manifest=MANIFEST,rights='permitted-reuse',note='Réemploi interne sans modification. Symbole météo vérifié ; les températures, lieux, durées et horaires sont donnés par le texte et ne sont pas déduits de l’image.'))
 media[name]=s;uses.setdefault(name,[]).append(dict(activityId=aid,unitId=uid));return s
banks=[]
for mechanic,label in [('q','Décrire la météo'),('a','Associer'),('p','S’exprimer à l’oral')]:
 aid='gram-ex-f4-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,image,context,p,a,alts,follow,reply) in enumerate(F4):
  model=fill(p,a);explanation='Le bulletin fixe le temps et les repères. Phrase : '+model
  if mechanic=='q':
   low=a[0].islower(); other=['il est','il y a'] if a.lower()=='il fait' else ['il fait','il est'] if a.lower()=='il y a' else ['Il neige','Il fait beau'] if a.lower()=='il pleut' else ['Il pleut','Il fait beau']
   other=[x.lower() if low else cap(x) for x in other]
   u=unit(aid,'f4',slug,i,p,[a]+[x for x in alts.split(';') if x],kind='completion',cue=context,options=options(a,other,slug),explanation=explanation)
  elif mechanic=='a':
   other=next(F4[(i+o)%50] for o in range(7,51) if F4[(i+o)%50][4].lower()!=a.lower())
   pairs=[dict(id=slug+f'-p{j+1}',left=r[3],right=r[4],sourceId='decrire-f4-a1:'+r[0]) for j,r in enumerate([F4[i],other])]
   u=unit(aid,'f4',slug,i,'Situation 1 : '+context+'\nSituation 2 : '+other[2],[model+'\n'+fill(other[3],other[4])],kind='match',pairs=pairs,explanation='Associez les deux formes selon leurs bulletins. L’image illustre seulement la situation 1 ; la situation 2 est décrite dans le texte.')
  else:u=unit(aid,'f4',slug,i,context,[model+'\n'+reply],kind='production',mode='oral',task='Présentez la météo de ce bulletin. Votre partenaire demande : « '+follow+' » Répondez puis échangez les rôles.',writeLines=0,rubric=rubric(['Temps et repères conformes au bulletin.','Expression météo adaptée.','Phrase compréhensible.','Réponse cohérente à la relance.']),explanation='Exemple possible. Les formulations équivalentes sont appréciées par l’enseignant, sans verdict automatique.')
  if mechanic in ['q','a']:u['imageSupports']=[support(image,aid,u['id'])]
  units.append(u)
 banks.append(bank(aid,'f4',label,{'q':{'choice':'Lisez le bulletin et observez l’image. Choisissez l’expression météo adaptée.','gap':'Complétez avec il fait, il y a, il pleut ou il neige selon le bulletin.'},'a':{'match':'Associez chaque phrase à son expression météo selon les deux bulletins. L’image concerne la situation 1.'},'p':{'open-oral':'Présentez le temps du bulletin puis répondez à la relance.'}}[mechanic],units))
for mechanic,label in [('q','Identifier ou décrire'),('t','Transformer une phrase'),('c','Corriger l’erreur')]:
 aid='gram-ex-f5-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,intent,context,p,a,neutral) in enumerate(F5):
  model=fill(p,a);cue=context
  if mechanic=='q':u=unit(aid,'f5',slug,i,p,[a],kind='completion',cue=cue,options=options(a,['C’est','Il est','Elle est','il y a'] if a[0].isupper() else ['c’est','il est','elle est','il y a'],slug,4),explanation='La consigne précise l’acte : identifier, reprendre par un pronom personnel ou annoncer une présence. Phrase : '+model)
  elif mechanic=='t':
   model=model.split('—')[-1].strip() if intent=='identifier' else model.split('? ',1)[-1] if intent=='qualifier' else model
   directive={'identifier':'Identifiez avec « c’est ».','qualifier':'Reprenez le nom par un pronom personnel et indiquez sa caractéristique ou son métier avec « il est » ou « elle est ».','presence':'Annoncez la présence avec « il y a ».'}[intent]
   u=unit(aid,'f5',slug,i,neutral,[model],kind='transform',cue=cue,directive=directive+' Écrivez une phrase en conservant les informations.',responseLines=2,explanation='Modèle possible pour l’acte demandé. « C’est » peut aussi servir à qualifier dans d’autres contextes ; ici la consigne impose un pronom personnel pour la reprise.')
  else:
   wrong={'C’est':'Ce est','Il est':'Il sont','Elle est':'Elle sont','il y a':'il y as'}[a];start=p.index('___')
   u=unit(aid,'f5',slug,i,fill(p,wrong),[fill(p,a)],kind='correct',cue=cue,responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(wrong),text=wrong),explanation={'C’est':'Écrivez c’est avec une apostrophe : ce s’élide devant est.','Il est':'Avec il au singulier, la forme du verbe être est « est ».','Elle est':'Avec elle au singulier, la forme du verbe être est « est ».','il y a':'Dans il y a, a s’écrit sans s.'}[a]+' Conservez les autres informations.')
  units.append(u)
 banks.append(bank(aid,'f5',label,{'q':{'choice':'Choisissez selon la situation : c’est, il est, elle est ou il y a. Pour qualifier, la consigne demande ici un pronom personnel.','gap':'Complétez selon l’acte demandé avec c’est, il est, elle est ou il y a.'},'t':{'transform':'Reformulez les informations avec l’expression demandée dans chaque situation.'},'c':{'correct':'Corrigez le groupe signalé et réécrivez la phrase ou le dialogue.'}}[mechanic],units))
def possessive(r):
 _,owner,gender,number,onset,*_=r;forms={'je':['mon','ma','mes'],'tu':['ton','ta','tes'],'il-elle':['son','sa','ses'],'nous':['notre','notre','nos'],'vous':['votre','votre','vos'],'ils-elles':['leur','leur','leurs']}[owner]
 return cap(forms[2] if number=='pluriel' else forms[0] if gender=='masculin' or onset in ['voyelle','h-muet'] else forms[1])
for mechanic,label in [('q','Indiquer à qui cela appartient'),('a','Associer'),('t','Transformer une phrase')]:
 aid='gram-ex-f6-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,row in enumerate(F6):
  slug,owner,gender,number,onset,p,neutral,context=row;a=possessive(row);model=fill(p,a);cue=context+' Nom : '+gender+' '+number+'.'
  if mechanic=='q':
   family={'je':['Mon','Ma','Mes'],'tu':['Ton','Ta','Tes'],'il-elle':['Son','Sa','Ses'],'nous':['Notre','Nos','Leur'],'vous':['Votre','Vos','Leur'],'ils-elles':['Leur','Leurs','Notre']}[owner]
   u=unit(aid,'f6',slug,i,p,[a],kind='completion',cue=cue,options=options(a,family,slug),explanation='Le possesseur fixe la famille du déterminant ; le nom fixe le genre et le nombre. Devant un nom féminin singulier commençant par une voyelle ou un h muet, on emploie mon, ton ou son. Phrase : '+model)
  elif mechanic=='t':u=unit(aid,'f6',slug,i,neutral,[model],kind='transform',cue=cue,directive='Réunissez les informations en une phrase avec un déterminant possessif adapté au rôle et au nom. Conservez le fait donné.',responseLines=2,explanation='Modèle possible. Pour une relation (amie, école, activité), le possessif n’indique pas la propriété d’une personne. Le genre du possesseur ne détermine pas mon/ma ou son/sa.')
  else:
   other=next(F6[(i+o)%50] for o in range(7,51) if possessive(F6[(i+o)%50])!=a)
   pairs=[dict(id=slug+f'-p{j+1}',left=r[5],right=possessive(r),sourceId='decrire-f6-a1:'+r[0]) for j,r in enumerate([row,other])]
   u=unit(aid,'f6',slug,i,'Situation 1 : '+cue+'\nSituation 2 : '+other[7]+' Nom : '+other[2]+' '+other[3]+'.',[model+'\n'+fill(other[5],possessive(other))],kind='match',pairs=pairs,explanation='Chaque phrase garde son possesseur et son nom. Associez les déterminants en tenant compte des deux situations.')
  units.append(u)
 banks.append(bank(aid,'f6',label,{'q':{'choice':'Choisissez le déterminant possessif selon le rôle, le nom et son début.','gap':'Complétez avec le déterminant possessif adapté. Mettez une majuscule en début de phrase.'},'a':{'match':'Associez chaque phrase à son possessif selon les deux situations.'},'t':{'transform':'Réunissez les informations avec un possessif sans changer le rôle ni les faits.'}}[mechanic],units))
for mechanic,label in [('q','Accorder l’adjectif'),('t','Transformer une phrase'),('e','Produire à l’écrit'),('p','S’exprimer à l’oral')]:
 aid='gram-ex-f7-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,ms,fs,mp,fp,subject,gender,number,original,context,second) in enumerate(F7):
  forms=[ms,fs,mp,fp];a=forms[(2 if number=='pluriel' else 0)+(1 if gender=='féminin' else 0)];p=subject+(' sont ' if number=='pluriel' else ' est ')+'___.';model=fill(p,a);cue=context+' Sujet : '+gender+' '+number+'.'
  if mechanic=='q':u=unit(aid,'f7',slug,i,p,[a],kind='completion',cue=cue,givenVerb=None,options=options(a,forms,slug,min(4,len(set(forms)))),explanation='L’adjectif attribut s’accorde avec le sujet, en genre et en nombre. Il reste après être. Phrase : '+model)
  elif mechanic=='t':u=unit(aid,'f7',slug,i,original,[model],kind='transform',targetSubject=subject,responseLines=2,explanation='Remplacez le sujet par le groupe demandé et accordez être et l’adjectif attribut. Phrase : '+model)
  else:u=unit(aid,'f7',slug,i,context,[model+'\n'+second],kind='production',mode='written' if mechanic=='e' else 'oral',task=('Écrivez' if mechanic=='e' else 'Dites')+' deux phrases : décrivez « '+subject+' » avec l’adjectif « '+ms+' » accordé, puis ajoutez l’autre information donnée.'+(' Votre partenaire demande : « Que pouvez-vous ajouter ? » Donnez alors la seconde information.' if mechanic=='p' else ''),writeLines=4 if mechanic=='e' else 0,rubric=rubric(['Sujet et deux informations conformes à la situation.','Être et adjectif accordés avec le sujet.','Deux phrases compréhensibles.']),explanation='Exemple possible. Les autres formulations conservant les faits et les accords sont appréciées par l’enseignant ; aucun jugement réel sur une personne n’est demandé.')
  # Do not emit nullable metadata into the strict runtime schema.
  u={k:v for k,v in u.items() if v is not None};units.append(u)
 banks.append(bank(aid,'f7',label,{'q':{'choice':'Choisissez l’adjectif attribut accordé avec le sujet indiqué.','gap':'Accordez l’adjectif donné dans la situation avec le sujet de la phrase.'},'t':{'transform':'Remplacez le sujet par le groupe demandé. Accordez le verbe et l’adjectif.'},'e':{'open-written':'Écrivez deux phrases pour décrire selon les informations données.'},'p':{'open-oral':'Décrivez avec un adjectif accordé puis répondez à la relance.'}}[mechanic],units))
for mechanic,label in [('q','Nommer une profession'),('s','Jouer une situation'),('p','S’exprimer à l’oral')]:
 aid='gram-ex-f8-'+('qcm-verbe' if mechanic=='q' else 'curriculum-'+mechanic);units=[]
 for i,(slug,domain,pronoun,job,alts,activity,place,follow,reply) in enumerate(F8):
  p=pronoun+' est ___.';model='Je suis '+job+'.';context=activity+' Lieu de travail : '+place+'.'
  if mechanic=='q':
   distractors=[r[3] for r in F8 if r[1]!=domain and r[2]==pronoun and r[3] not in alts.split(';') and r[3]!=job]
   # Select remote work domains, not overlapping descriptions of the same trade.
   anchors=['boulanger','mécanicienne','infirmier','factrice','plombier','bibliothécaire','photographe','caissier','électricienne','musicien']
   distractors=sorted(distractors,key=lambda x:anchors.index(x) if x in anchors else 100)
   u=unit(aid,'f8',slug,i,p,[job]+[x for x in alts.split(';') if x],kind='completion',cue=context,options=options(job,distractors,slug),explanation='L’activité décrite permet d’identifier le métier du personnage fictif. La phrase emploie être suivi du métier sans article. Phrase : '+fill(p,job))
  elif mechanic=='p':u=unit(aid,'f8',slug,i,context,[model+'\n'+reply],kind='production',mode='oral',task='Incarnez ce personnage et présentez son métier en disant « je ». Votre partenaire demande : « '+follow+' » Répondez puis échangez les rôles.',writeLines=0,rubric=rubric(['Métier et faits conformes au personnage fictif.','Présentation à la première personne.','Phrase compréhensible.','Réponse cohérente à la relance.']),explanation='Exemple possible pour ce rôle fictif, sans demander votre profession réelle. Les désignations équivalentes du métier et formulations cohérentes sont appréciées par l’enseignant.')
  else:u=unit(aid,'f8',slug,i,'Présenter un métier',['Personnage : '+model+'\nPartenaire : '+follow+'\nPersonnage : '+reply],kind='scenario',contract='open',situation=context,roles=[dict(id='a',label='Personnage',goal='Incarnez le personnage et présentez son métier en disant je.'),dict(id='b',label='Partenaire',goal='Demandez son métier puis posez la relance.')],turns=[dict(id='debut',roleId='b',text='Quel est votre métier ?')],task='Personnage : présentez votre métier à la première personne. Partenaire : posez la relance. Répondez puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Rôle et métier respectés.','Présentation à la première personne.','Réponse compréhensible et cohérente à la relance.']),explanation='Exemple de suite possible. Le modèle ne constitue pas une réponse unique ; appréciation enseignante, sans verdict automatique.')
  units.append(u)
 banks.append(bank(aid,'f8',label,{'q':{'choice':'Selon l’activité décrite, choisissez le métier du personnage.','gap':'Écrivez le métier correspondant à l’activité du personnage.'},'s':{'scenario-set':'Jouez l’entretien à deux en incarnant le personnage et en parlant à la première personne.'},'p':{'open-oral':'Présentez le métier de ce personnage en disant je, puis répondez à la relance.'}}[mechanic],units))
for sub in ['f4','f5','f6','f7','f8']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
b=next(b for b in banks if b['activityId']=='gram-ex-f4-qcm-verbe');ob=dict(obligationId='IMG-f4-A1',hostActivityId=b['activityId'],level='A1',reviewedIllustratedSituations=50,distinctImages=len(media),unitIds=[u['id'] for u in b['units']],humanReview='pending')
(ROOT/MANIFEST).write_text(json.dumps(dict(obligations=[ob],distinctImages=len(media),humanReview='pending',images=[dict(**s,uses=uses[n]) for n,s in media.items()],note='50 bulletins illustrés par huit images internes vérifiées ; les mêmes situations sont réemployées entre les mécaniques. Aucun quota de 50 nouvelles images ou de nouvelles histoires par mécanique revendiqué.'),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),activities=len({b['activityId'] for b in banks}),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks))))

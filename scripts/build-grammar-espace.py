"""Compile the three space notions from authored scenes and immutable existing media."""
import csv,hashlib,json,shutil
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SOURCE=ROOT/'scripts/grammar_curriculum'
REV='espace-2026-11-23-v1';MANIFEST='docs/grammaire/implementation/espace-media-manifest.json'
def rows(name,width,count=50):
 r=[r for r in csv.reader((SOURCE/name).read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(r)==count,(name,len(r));assert all(len(x)==width for x in r),[(x[0],len(x)) for x in r if len(x)!=width];assert len({x[0] for x in r})==count
 return r
def rubric(labels):return [dict(id=f'r{i+1}',label=s) for i,s in enumerate(labels)]
def unit(aid,level,slug,index,prompt,answers,source,**kw):
 return dict(id=f'{aid}-{level.lower()}-{slug}',prompt=prompt,answers=answers,source=dict(path=f'scripts/grammar_curriculum/{source}.tsv',typeId=aid,position=index,partition=level.lower()),**kw)
def bank(aid,sub,level,label,instructions,units):
 return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-espace',level=level,label=label,objective={'e1':'Situer un objet avec sur, sous, dans, devant, derrière ou entre.','e6':'Préciser la proximité d’un lieu.' if level=='A1' else 'Donner des indications précises de position et de trajet, depuis un point de vue explicite.','e7':'Choisir au, aux, du, des et les formes à la, à l’, de la, de l’.'}[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='Situations et corrections relues. Images internes réemployées ; modèles ouverts non exclusifs. Validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units)
def options(answer,others,slug):
 vals=[answer]+[x for x in others if x!=answer][:2];assert len(vals)==len(set(vals)) and len(vals)==3,(slug,vals)
 return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in vals]
def fill(prompt,answer):return prompt.replace('___',answer)
media={};uses={}
ALTS={'sur':'Une balle rouge repose sur la face supérieure d’une boîte.','sous':'Une balle rouge se trouve sous le plateau d’une table, entre ses pieds.','dans':'Une balle rouge est à l’intérieur d’une boîte ouverte.','devant':'Une balle rouge est visible devant la face avant d’une boîte.','derrière':'Une boîte masque presque entièrement une balle rouge placée derrière elle.','entre':'Une balle rouge se trouve dans l’espace entre deux boîtes.','à-côté-de':'Une balle rouge et une boîte sont immédiatement voisines.','la-bas':'Un trajet en pointillé rejoint un point éloigné dans les montagnes.','droite':'Un schéma montre une route qui tourne vers la droite.','gauche':'Un schéma montre une route qui tourne vers la gauche.','tout-droit':'Une flèche indique de continuer tout droit sur la route.','au-bout-de':'Une route se termine au niveau d’un repère orange.','jusqu-a':'Un repère indique le point à atteindre sur une route.','en-haut':'La balle rouge occupe la partie supérieure d’une étagère.','en-bas':'La balle rouge occupe la partie inférieure d’une étagère.'}
def support(name,aid,uid):
 path=f'/lib/images/vocabulaire/orientation/{name}.webp';p=ROOT/'public'/path.lstrip('/');data=p.read_bytes();sha=hashlib.sha256(data).hexdigest();w,h=Image.open(p).size
 src=f'/lib/images/grammaire/curriculum/sha256/{sha}.webp';out=ROOT/'public'/src.lstrip('/');out.parent.mkdir(exist_ok=True,parents=True)
 if out.exists():assert out.read_bytes()==data
 else:shutil.copyfile(p,out)
 s=dict(id='espace-'+name,src=src,sha256=sha,width=w,height=h,alt=ALTS[name],source=dict(path=path,manifest=MANIFEST,rights='permitted-reuse',note='Réemploi interne de la bibliothèque propriétaire, sans modification. Schéma de la relation spatiale ; les lieux, personnes et trajets fictifs sont définis par le texte. Le schéma n’est pas un plan géographique.'))
 media[name]=s;uses.setdefault(name,[]).append(dict(activityId=aid,unitId=uid));return s
E1=rows('espace-e1-a1.tsv',6);E6A1=rows('espace-e6-a1.tsv',8);E6A2=rows('espace-e6-a2.tsv',11);E7=rows('espace-e7-a1.tsv',7);READ=rows('espace-lectures-a1.tsv',15,20)
banks=[];aid='gram-ex-e1-qcm-verbe';units=[]
e1others={'sur':['sous','dans'],'sous':['sur','dans'],'dans':['sur','sous'],'devant':['derrière','dans'],'derrière':['devant','dans'],'entre':['sur','sous']}
for i,(slug,image,prompt,answer,context,task) in enumerate(E1):
 u=unit(aid,'A1',slug,i,prompt,[answer],'espace-e1-a1',kind='completion',cue=context,options=options(answer,e1others[answer],slug),explanation='L’illustration et le texte fixent le repère. Phrase : '+fill(prompt,answer));u['imageSupports']=[support(image,aid,u['id'])];units.append(u)
banks.append(bank(aid,'e1','A1','Situer un objet',{'choice':'Observez l’image et lisez la situation. Choisissez la préposition qui convient.','gap':'Observez l’image et complétez avec sur, sous, dans, devant, derrière ou entre.'},units))
for mode in ['written','oral']:
 aid='gram-ex-e1-communication-'+('pe' if mode=='written' else 'po');units=[]
 for i,(slug,image,prompt,answer,context,task) in enumerate(E1):
  u=unit(aid,'A1',slug,i,context,[fill(prompt,answer)],'espace-e1-a1',kind='production',mode=mode,task=task+' '+('Écrivez' if mode=='written' else 'Dites')+' une seule phrase.',writeLines=2 if mode=='written' else 0,rubric=rubric(['Position et repère conformes à l’image.','Préposition adaptée.','Phrase compréhensible et adaptée à la demande.']),explanation='Exemple possible. Toute autre phrase correcte et cohérente avec la demande et la position est recevable ; appréciation par l’enseignant.');u['imageSupports']=[support(image,aid,u['id'])];units.append(u)
 banks.append(bank(aid,'e1','A1','Écrire une phrase utile' if mode=='written' else 'Dire une phrase utile',{'open-written' if mode=='written' else 'open-oral':('Écrivez' if mode=='written' else 'Dites')+' une seule phrase pour situer la balle selon chaque demande et son illustration.'},units))
aid='gram-ex-e1-curriculum-a';units=[]
# A second textual fact gives a distinct relation, not a second interpretation of the image.
other_facts={'sur':('Un crayon se trouve à l’intérieur d’une trousse.','Le crayon est ___ la trousse.','dans'),'sous':('Un cahier repose sur le plateau du bureau.','Le cahier est ___ le bureau.','sur'),'dans':('Un sac se trouve plus bas que le siège, entre les pieds de la chaise.','Le sac est ___ la chaise.','sous'),'devant':('Un livre se trouve à l’intérieur d’un sac.','Le livre est ___ le sac.','dans'),'derrière':('Une plante occupe l’espace qui sépare le canapé et le bureau.','La plante est ___ le canapé et le bureau.','entre'),'entre':('Un chapeau repose sur la face supérieure d’une caisse.','Le chapeau est ___ la caisse.','sur')}
for i,(slug,image,prompt,answer,context,task) in enumerate(E1):
 fact,phrase2,answer2=other_facts[answer];pairs=[dict(id=f'{slug}-p{j+1}',left=p,right=a,sourceId=f'espace-e1-a1:{slug}') for j,(p,a) in enumerate([(prompt,answer),(phrase2,answer2)])]
 u=unit(aid,'A1',slug,i,context+'\nAutre situation : '+fact,[fill(prompt,answer)+'\n'+fill(phrase2,answer2)],'espace-e1-a1',kind='match',pairs=pairs,explanation='La première relation est montrée par l’image ; la seconde est donnée explicitement par le texte. Une préposition pour chaque phrase.');u['imageSupports']=[support(image,aid,u['id'])];units.append(u)
banks.append(bank(aid,'e1','A1','Associer',{'match':'Associez chaque phrase à sa préposition. Pour la balle, observez l’image ; pour l’autre objet, utilisez le texte.'},units))
aid='gram-ex-e1-communication-ce';units=[]
for i,row in enumerate(READ):
 slug,genre,title,text,q,a,e,d1,d2,q2,a2,e2,q3,a3,e3=row;text=text.replace('\\n','\n');qs=[]
 for j,(question,answer,evidence) in enumerate([(q,a,e),(q2,a2,e2),(q3,a3,e3)]):
  assert evidence in text,(slug,evidence)
  child=dict(id=slug+f'-q{j+1}',prompt=question,answers=[answer],evidence=[evidence],explanation='Le document indique : « '+evidence+' ».',response='choice' if j==0 else 'short')
  if j==0:child['options']=options(answer,[d1,d2],slug)
  qs.append(child)
 units.append(unit(aid,'A1',slug,i,title,[],'espace-lectures-a1',kind='reading',genre=genre,text=text,questions=qs,explanation='Chaque réponse s’appuie sur un passage du document.'))
banks.append(bank(aid,'e1','A1','Lire une situation',{'document-set':'Lisez chaque document et répondez à ses trois questions. Cochez une réponse ou écrivez une réponse courte.'},units))
def contract(prompt,expr):
 for article,ending in [('le','du'),('les','des')]:
  if '___ '+article+' ' in prompt and expr.endswith(' de'):
   return prompt.replace('___ '+article+' ','___ '),expr[:-3]+' '+ending
 return prompt,expr
A1=[]
for slug,image,context,prompt,answer,alts,follow,reply in E6A1:
 p,a=contract(prompt,answer);alternatives=[contract(prompt,x)[1] for x in alts.split(';') if x]
 A1.append((slug,image,context,p,a,alternatives,follow,reply))
def a1distractors(prompt,answer):
 stem='loin de' if answer.startswith(('près','à côté')) else 'près de'
 # The two alternatives are never near-synonyms of the correct relation.
 out=[]
 for s in [stem,'au-dessus de']:
  if answer.endswith(' du'):out.append(s[:-3]+' du')
  elif answer.endswith(' des'):out.append(s[:-3]+' des')
  else:out.append(s)
 return out
for level,source in [('A1',A1),('A2',E6A2)]:
 aid='gram-ex-e6-qcm-verbe';units=[]
 for i,row in enumerate(source):
  slug,image,context,prompt,answer=row[:5];alts=row[5] if level=='A1' else [x for x in row[5].split(';') if x]
  if level=='A1':others=a1distractors(prompt,answer)
  elif image in ['droite','gauche']:
   lead='à droite' if image=='droite' else 'à gauche';opposite='à gauche' if image=='droite' else 'à droite';tail=answer[len(lead):]
   others=[opposite+tail,('à l’intérieur'+tail if tail else 'tout droit')]
  elif image=='tout-droit':others=['à droite','à gauche']
  elif image=='au-bout-de':others=[answer.replace('au bout','au début'),answer.replace('au bout','au milieu')]
  elif image=='jusqu-a':others=['jusqu’au musée','jusqu’au port']
  elif image in ['en-haut','en-bas']:others=['en bas de l’escalier' if image=='en-haut' else 'en haut de l’escalier','à côté de l’escalier']
  elif image=='à-côté-de':others=[answer.replace('à côté','loin'),answer.replace('à côté','à l’intérieur')]
  elif image=='dans':others=['devant '+answer[len('dans '):],'derrière '+answer[len('dans '):]]
  elif image=='devant':others=['derrière '+answer[len('devant '):],'dans '+answer[len('devant '):]]
  elif image=='derrière':others=['devant '+answer[len('derrière '):],'dans '+answer[len('derrière '):]]
  else:raise AssertionError(image)
  assert not set(others)&set([answer]+alts),(slug,others)
  u=unit(aid,level,slug,i,prompt,[answer]+alts,'espace-e6-'+level.lower(),kind='completion',cue=context,options=options(answer,others,slug),explanation='Le texte fixe la relation et les repères ; le schéma illustre cette relation. Phrase : '+fill(prompt,answer)+(' Autre formulation recevable : '+' / '.join(fill(prompt,x) for x in alts) if alts else ''));u['imageSupports']=[support(image,aid,u['id'])];units.append(u)
 banks.append(bank(aid,'e6',level,'Préciser le lieu ou la direction',{'choice':'Lisez les repères puis choisissez l’indication qui convient. Le schéma illustre la relation, sans représenter les lieux réels.','gap':'Complétez selon les repères. '+('Utilisez près de, loin de ou à côté de, avec les contractions nécessaires.' if level=='A1' else 'Donnez une indication précise et faites les contractions nécessaires.')},units))
 aid='gram-ex-e6-curriculum-p';units=[]
 for i,row in enumerate(source):
  slug,image,context,prompt,answer=row[:5];follow,reply=row[-2:]
  u=unit(aid,level,slug,i,context,[fill(prompt,answer)+'\n'+reply],'espace-e6-'+level.lower(),kind='production',mode='oral',task='Précisez le lieu ou le trajet à votre partenaire. Votre partenaire demande : « '+follow+' » Répondez, puis échangez les rôles.',writeLines=0,rubric=rubric(['Repères et faits de la situation respectés.','Expression de lieu ou de direction adaptée.','Contractions et phrase compréhensibles.','Réponse cohérente à la relance.']),explanation='Exemple de réponse possible. Les formulations équivalentes sont appréciées par l’enseignant, sans correction automatique.');units.append(u)
 banks.append(bank(aid,'e6',level,'S’exprimer à l’oral',{'open-oral':'Jouez l’échange à deux : donnez une indication, puis répondez à la relance. Le texte fixe les lieux ; l’image est un schéma de relation.'},units))
aid='gram-ex-e6-curriculum-t';units=[]
for i,(slug,image,context,prompt,answer,alts,neutral,target,opening,follow,reply) in enumerate(E6A2):
 assert neutral.count(target)==1 and neutral.replace(target,answer)==fill(prompt,answer),(slug,neutral,target)
 models=[fill(prompt,x) for x in [answer]+[x for x in alts.split(';') if x] if fill(prompt,x)!=neutral]
 units.append(unit(aid,'A2',slug,i,neutral,models,'espace-e6-a2',kind='transform',cue=context,directive='Remplacez « '+target+' » par une autre expression de lieu ou de direction. Conservez les autres informations.',responseLines=2,explanation='Formulation possible : '+fill(prompt,answer)+' Les formulations équivalentes sont recevables si elles conservent le point de vue, les lieux et les limites du trajet.'))
banks.append(bank(aid,'e6','A2','Transformer une phrase',{'transform':'Reformulez l’indication en remplaçant le groupe indiqué. Gardez le même sens, les mêmes repères et le même point de vue.'},units))
aid='gram-ex-e6-curriculum-s';units=[]
for i,(slug,image,context,prompt,answer,alts,neutral,target,opening,follow,reply) in enumerate(E6A2):
 units.append(unit(aid,'A2',slug,i,'Demander et donner une indication', ['Guide : '+fill(prompt,answer)+'\nVisiteur : '+follow+'\nGuide : '+reply],'espace-e6-a2',kind='scenario',contract='open',situation=context,roles=[dict(id='guide',label='Guide',goal='Donnez l’indication selon les faits et le point de vue précisés.'),dict(id='visiteur',label='Visiteur',goal='Posez la question, puis demandez la précision proposée.')],turns=[dict(id='debut',roleId='visiteur',text=opening)],task='Guide : répondez par une indication précise. Visiteur : demandez la précision proposée. Guide : répondez, puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Point de vue et repères respectés.','Expression de lieu ou de trajet précise.','Contractions et phrases compréhensibles.','Relance et réponse cohérentes avec les faits.']),explanation='Modèle possible de suite après la question initiale. Les autres échanges cohérents sont recevables ; appréciation humaine.'))
banks.append(bank(aid,'e6','A2','Jouer une situation',{'scenario-set':'Jouez la situation à deux : demandez une indication, guidez la personne puis précisez votre réponse.'},units))
MAIN=[]
for i,(slug,context,prompt,a,wrong,other,b) in enumerate(E7):
 if i%2:prompt,other,a,b=other,prompt,b,a;wrong={'du':'de le','des':'de les','de la':'du','de l’':'de la'}[a]
 MAIN.append((slug,context,prompt,a,wrong,other,b))
aid='gram-ex-e7-qcm-verbe';units=[]
for i,(slug,context,prompt,a,wrong,other,b) in enumerate(MAIN):
 others=[x for x in ['au','aux','du','des','à la','de la','à l’','de l’'] if x!=a and x!=b]
 units.append(unit(aid,'A1',slug,i,prompt,[a],'espace-e7-a1',kind='completion',cue=context,options=options(a,others,slug),explanation='À + le = au ; à + les = aux ; de + le = du ; de + les = des. À la, de la, à l’ et de l’ gardent leur forme. Phrase : '+fill(prompt,a)))
banks.append(bank(aid,'e7','A1','Contracter à et de',{'choice':'Choisissez la forme de lieu correcte : au, aux, du, des, à la, à l’, de la ou de l’.','gap':'Complétez avec la forme de lieu correcte : au, aux, du, des, à la, à l’, de la ou de l’.'},units))
aid='gram-ex-e7-curriculum-a';units=[]
for i,(slug,context,prompt,a,wrong,other,b) in enumerate(MAIN):
 pairs=[dict(id=slug+f'-p{j+1}',left=p,right=answer,sourceId=f'espace-e7-a1:{slug}') for j,(p,answer) in enumerate([(prompt,a),(other,b)])]
 units.append(unit(aid,'A1',slug,i,context,[fill(prompt,a)+'\n'+fill(other,b)],'espace-e7-a1',kind='match',pairs=pairs,explanation='La première phrase et la seconde distinguent la destination et le point de départ. Respectez à/de, le genre, le nombre et l’élision.'))
banks.append(bank(aid,'e7','A1','Associer',{'match':'Associez chaque phrase à la bonne forme de lieu. Les deux phrases concernent le même lieu, à l’aller ou au retour.'},units))
aid='gram-ex-e7-curriculum-c';units=[]
for i,(slug,context,prompt,a,wrong,other,b) in enumerate(MAIN):
 after=prompt.split('___')[1];bad=wrong+(' ' if after and not after[0].isspace() and not wrong.endswith('’') else '');start=prompt.index('___');error=fill(prompt,bad)
 units.append(unit(aid,'A1',slug,i,error,[fill(prompt,a)],'espace-e7-a1',kind='correct',cue=context,responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(bad),text=bad),explanation='Corrigez uniquement le groupe de lieu : « '+a+' ». Gardez le verbe, le lieu et le sens de la phrase.'))
banks.append(bank(aid,'e7','A1','Corriger l’erreur',{'correct':'Corrigez le groupe de lieu, puis réécrivez la phrase entière avec la bonne forme.'},units))
for sub in ['e1','e6','e7']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
obligations=[]
for sub,level in [('e1','A1'),('e6','A1'),('e6','A2')]:
 b=next(b for b in banks if b['activityId']==f'gram-ex-{sub}-qcm-verbe' and b['level']==level)
 obligations.append(dict(obligationId=f'IMG-{sub}-{level}',hostActivityId=b['activityId'],level=level,reviewedIllustratedSituations=len(b['units']),distinctImages=len({s['sha256'] for u in b['units'] for s in u['imageSupports']}),unitIds=[u['id'] for u in b['units']],humanReview='pending'))
manifest=dict(obligations=obligations,distinctImages=len(media),humanReview='pending',images=[dict(**s,uses=uses[n]) for n,s in media.items()],note='Réemploi de schémas existants sans génération ou modification d’image. Les obligations comptent les situations illustrées, pas un quota d’images nouvelles.')
(ROOT/MANIFEST).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(banks=len(banks),units=sum(len(b['units']) for b in banks),offerings=sum(len(b['presentations']) for b in banks),distinctImages=len(media))))

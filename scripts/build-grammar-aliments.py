"""Compile the whole food theme from authored rows, reusing existing image bytes."""
import csv,json,re,hashlib,shutil,unicodedata
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];REV='aliments-2026-11-24-v1';MANIFEST='docs/grammaire/implementation/aliments-media-manifest.json'
def rows(sub,level,width):
 r=[x for x in csv.reader((ROOT/f'scripts/grammar_curriculum/aliments-{sub}-{level.lower()}.tsv').read_text().splitlines(),delimiter='|') if x and not x[0].startswith('#')]
 assert len(r)==50 and all(len(x)==width for x in r),(sub,level,len(r));assert len({x[0] for x in r})==50
 assert all(unicodedata.normalize('NFC',s)==s for x in r for s in x);return r
R={('g1','A1'):rows('g1','A1',6),('g2','A1'):rows('g2','A1',7),('g3','A1'):rows('g3','A1',10),('g4','A1'):rows('g4','A1',8),('g5','A2'):rows('g5','A2',7),('g6','A1'):rows('g6','A1',5),('g6','A2'):rows('g6','A2',8)}
def fill(p,a):
 before,after=p.split('___');after=after.lstrip()
 return before+a+('' if a.endswith('’') or not after or after[0] in '.,;:!?' else ' ')+after
def options(a,others,slug):
 vals=[a]+[s for s in dict.fromkeys(others) if s!=a];assert 2<=len(vals)<=6
 return [dict(id=slug+f'-choix-{i+1}',text=s) for i,s in enumerate(vals)]
def rubric(labels):return [dict(id=f'r{i+1}',label=s) for i,s in enumerate(labels)]
def base(aid,sub,level,slug,i):return dict(id=f'{aid}-{level.lower()}-{slug}',source=dict(path=f'scripts/grammar_curriculum/aliments-{sub}-{level.lower()}.tsv',typeId=aid,position=i,partition=level.lower()))
def aid_for(sub,mechanic):return f'gram-ex-{sub}-'+('qcm-verbe' if mechanic=='q' else 'communication-'+mechanic if mechanic in ['ce','pe','po'] else 'curriculum-'+mechanic)
objects={};uses={}
def image(name,aid,uid):
 path='/lib/images/'+(name if name.startswith('tcf/') else 'vocabulaire/'+name)+'.webp';p=ROOT/'public'/path.lstrip('/');data=p.read_bytes();sha=hashlib.sha256(data).hexdigest();w,h=Image.open(p).size
 src=f'/lib/images/grammaire/curriculum/sha256/{sha}.webp';out=ROOT/'public'/src.lstrip('/');out.parent.mkdir(parents=True,exist_ok=True)
 if out.exists():assert out.read_bytes()==data
 else:shutil.copyfile(p,out)
 label='compote' if name.startswith('tcf/') else name.rsplit('/',1)[-1].replace('-',' ')
 obj=dict(id='aliments-'+name.replace('/','-'),src=src,sha256=sha,width=w,height=h,alt='Illustration du produit : '+label+'. Le nombre et la quantité demandés sont indiqués dans le texte.',source=dict(path=path,manifest=MANIFEST,rights='permitted-reuse',note='Image interne réemployée sans modification et relue visuellement. Support lexical : ni le nombre exact ni le conditionnement ne sont déduits de l’image ; le texte donne les quantités.'))
 objects[name]=obj;uses.setdefault(name,[]).append(dict(activityId=aid,unitId=uid));return obj
def fact_context(s):return ' '.join(t for t in re.split(r'(?<=[.!?])\s+',s) if not re.match(r'(Employez|Utilisez|Le mot|L’expression demandée)',t))
objectives={'g1':'Choisir un, une ou des selon le genre et le nombre dans une situation illustrée.','g2':'Employer le, la, l’ ou les pour une référence connue ou une catégorie générale ; respecter l’élision et le h aspiré.','g3':'Exprimer une quantité non dénombrée avec du, de la, de l’ et employer de/d’ dans la négation générale.','g4':'Formuler une quantité avec un nombre, une mesure, un contenant ou une expression suivie de/d’.','g5':'Employer et accorder le déterminant indéfini demandé selon la quantité, la totalité ou la distribution.','g6':'Former les groupes de préposition et d’article selon leur contexte.'}
q_labels={'g1':'Choisir un, une ou des','g2':'Choisir le, la, l’ ou les','g3':'Choisir un partitif','g4':'Exprimer une quantité','g5':'Préciser une quantité indéfinie','g6':'Partitif ou article contracté'}
instructions={
 'g1':{'q':{'choice':'Observez le produit. Choisissez un, une ou des selon le nom et le nombre indiqués.','gap':'Écrivez un, une ou des selon le nom et le nombre indiqués.'},'a':{'match':'Associez chaque phrase à l’article indéfini adapté à son nom et à son nombre.'}},
 'g2':{'q':{'choice':'Choisissez l’article défini adapté au nom, à son début et à son nombre.','gap':'Complétez avec le, la, l’ ou les selon la situation.'},'t':{'transform':'Reformulez avec un article défini selon l’indication de chaque situation.'},'c':{'correct':'Corrigez l’article et réécrivez la phrase entière.'}},
 'g3':{'q':{'choice':'Choisissez le partitif, ou de/d’ à la négation générale, selon la situation.','gap':'Complétez avec le partitif adapté, ou de/d’ à la négation générale.'},'s':{'scenario-set':'Jouez la demande ou le refus d’un produit, puis la relance à deux.'}},
 'g4':{'ce':{'document-set':'Lisez chaque échange et répondez aux trois questions sur le produit, la quantité et la situation.'},'q':{'choice':'Choisissez la quantité imposée avec un produit non désigné à l’avance.','gap':'Écrivez le groupe de quantité imposé, avec de/d’ si nécessaire.'},'a':{'match':'Associez chaque phrase au groupe qui respecte la quantité donnée.'},'s':{'scenario-set':'Jouez la commande ou l’information de quantité et répondez à la relance.'},'pe':{'open-written':'Écrivez une phrase qui indique le produit et la quantité.'},'po':{'open-oral':'Exprimez la quantité donnée puis répondez à votre partenaire.'}},
 'g5':{'q':{'choice':'Employez le mot demandé avec la forme et l’accord adaptés au contexte.','gap':'Écrivez le déterminant demandé en respectant la famille et l’accord.'},'t':{'transform':'Reformulez avec le déterminant demandé en conservant les faits et les accords.'},'c':{'correct':'Corrigez la forme du déterminant sans changer sa famille, puis réécrivez la phrase.'}},
 'g6':{'q':{'choice':'Choisissez la forme qui réunit la préposition et l’article donnés.','gap':'Réunissez la préposition et l’article donnés, avec une contraction si nécessaire.'},'t':{'transform':'Reformulez selon l’indication, en conservant les faits.'},'c':{'correct':'Corrigez le groupe d’article et réécrivez la phrase entière.'}}
}
banks=[]
def emit(sub,level,mechanic,units):
 ins=instructions[sub][mechanic];label=q_labels[sub] if mechanic=='q' else {'a':'Associer','t':'Transformer une phrase','c':'Corriger l’erreur','s':'Jouer une situation','pe':'Écrire une phrase utile','po':'Dire une phrase utile','ce':'Lire une situation'}[mechanic]
 if sub=='g6' and level=='A2' and mechanic=='q':ins={'choice':'Dans chaque contexte, identifiez la nature de l’article ou du groupe indiqué.','gap':'Écrivez la nature du groupe indiqué : article partitif, contracté ou indéfini.'}
 banks.append(dict(schemaVersion=1,revision=REV,activityId=aid_for(sub,mechanic),subthemeId=sub,topic='gram-aliments',level=level,label=label,objective=objectives[sub]+(' En A2, distinguer du/des selon la référence et le rôle syntaxique.' if sub=='g6' and level=='A2' else ''),editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-24',humanReview='pending',note='Sources, formes et contextes relus ; réemploi explicite entre mécaniques. Images existantes conservées sous empreinte immuable. Modèles ouverts non exclusifs ; approbation enseignante en attente.'),presentations=list(ins),instructions=ins,units=units))
def gender_number(g,n):return ('masculin' if g=='m' else 'féminin')+' '+('singulier' if n=='s' else 'pluriel')
def indef(r):return 'des' if r[3]=='p' else 'un' if r[2]=='m' else 'une'
for mechanic in ['q','a']:
 aid=aid_for('g1',mechanic);units=[];data=R['g1','A1']
 for i,r in enumerate(data):
  slug,img,g,n,context,p=r;a=indef(r);common=base(aid,'g1','A1',slug,i);model=fill(p,a)
  if mechanic=='q':u=dict(**common,kind='completion',prompt=p,cue=context+' Nom : '+gender_number(g,n)+'.',answers=[a],options=options(a,['un','une','des'],slug),explanation='Un/une : singulier ; des : pluriel. Modèle : '+model,imageSupports=[image(img,aid,common['id'])])
  else:
   other=next(data[(i+k)%50] for k in range(1,50) if indef(data[(i+k)%50])!=a)
   u=dict(**common,kind='match',prompt='Deux situations indépendantes.',pairs=[dict(id=slug+f'-paire-{j+1}',left=row[4]+' Nom : '+gender_number(row[2],row[3])+'. '+row[5],right=indef(row),sourceId='g1:'+row[0]) for j,row in enumerate([r,other])],answers=[model+'\n'+fill(other[5],indef(other))],explanation='Chaque phrase garde son genre et son nombre ; associez les articles correspondants.')
  units.append(u)
 emit('g1','A1',mechanic,units)
def definite(r):return 'les' if r[2]=='p' else 'l’' if r[3] in ['v','h-muet'] else 'le' if r[1]=='m' else 'la'
for mechanic in ['q','t','c']:
 aid=aid_for('g2',mechanic);units=[]
 for i,r in enumerate(R['g2','A1']):
  slug,g,n,onset,context,p,demo=r;a=definite(r);common=base(aid,'g2','A1',slug,i);model=fill(p,a);cue=context+' Nom : '+gender_number(g,n)+'.'
  explanation='Article défini adapté à la référence et au nom.'+(' Élision devant la voyelle ou le h muet.' if a=='l’' else ' Le h de haricot est aspiré : pas d’élision.' if onset=='h-aspire' else '')+' Modèle : '+model
  if mechanic=='q':u=dict(**common,kind='completion',prompt=p,cue=cue,answers=[a],options=options(a,['le','la','l’','les'],slug),explanation=explanation)
  elif mechanic=='t':u=dict(**common,kind='transform',prompt=fill(p,demo),cue=cue,answers=[model],directive='Remplacez le démonstratif par un article défini pour parler de la catégorie en général.' if 'général' in context else 'Remplacez le démonstratif par l’article défini pour reprendre le même élément connu.',responseLines=2,explanation=explanation)
  else:
   bad='le' if a in ['la','les'] else 'la' if a=='le' else 'le' if g=='m' else 'la';start=p.index('___');u=dict(**common,kind='correct',prompt=fill(p,bad),cue=cue,answers=[model],error=dict(segmentId='prompt',start=start,end=start+len(bad)+(1 if a.endswith('’') else 0),text=bad+(' ' if a.endswith('’') else '')),responseLines=2,explanation=explanation)
  units.append(u)
 emit('g2','A1',mechanic,units)
def partitive(r):return ('d’' if r[3] in ['v','h-muet'] else 'de') if r[4]=='-' else 'de l’' if r[3] in ['v','h-muet'] else 'du' if r[2]=='m' else 'de la'
def scenario(common,context,model,opening,follow,reply,quantity=False):
 return dict(**common,kind='scenario',contract='open',prompt='Parler d’une quantité' if quantity else 'Demander ou refuser un produit',situation=context,answers=['Personne A : '+model+'\nPersonne B : '+follow+'\nPersonne A : '+reply],roles=[dict(id='a',label='Personne A',goal='Exprimez le besoin ou l’information du rôle.'),dict(id='b',label='Personne B',goal='Posez la question puis la relance.')],turns=[dict(id='debut',roleId='b',text=opening)],task='Exprimez la quantité ou le refus selon la situation, répondez à la relance puis inversez les rôles.',followUps=[follow],writeLines=0,rubric=rubric(['Quantité ou refus conforme aux faits.','Groupe de quantité correct ; phrase compréhensible.' if quantity else 'Partitif ou de/d’ adapté à la phrase.','Réponse cohérente à la relance.']),explanation='Exemple non exclusif ; les formulations respectant la consigne sont recevables.')
for mechanic in ['q','s']:
 aid=aid_for('g3',mechanic);units=[]
 for i,r in enumerate(R['g3','A1']):
  slug,img,g,onset,pol,context,p,opening,follow,reply=r;a=partitive(r);common=base(aid,'g3','A1',slug,i);model=fill(p,a)
  if mechanic=='q':u=dict(**common,kind='completion',prompt=p,cue=context,answers=[a],options=options(a,[s for s in ['du','de la','de l’','de','d’'] if s!=a][:2],slug),explanation=('À la négation générale de quantité, on emploie de/d’. Les contrastes et les phrases avec être ne sont pas visés ici.' if pol=='-' else 'La phrase exprime une quantité non dénombrée : partitif selon le genre et le début du nom.')+' Modèle : '+model,imageSupports=[image(img,aid,common['id'])])
  else:u=scenario(common,context,model,opening,follow,reply)
  units.append(u)
 emit('g3','A1',mechanic,units)
def quantity_base(a):return a[:-3] if a.endswith(' d’') or a.endswith(' de') else a
def quantity_options(a):
 base=quantity_base(a)
 return [a+' de',a+' des'] if base==a else [base+' de',base+' de la'] if a.endswith('d’') else [base+' du',base+' des']
for mechanic in ['q','a','s','pe','po']:
 aid=aid_for('g4',mechanic);units=[];data=R['g4','A1']
 for i,r in enumerate(data):
  slug,img,a,context,p,opening,follow,reply=r;common=base(aid,'g4','A1',slug,i);model=fill(p,a)
  if mechanic=='q':u=dict(**common,kind='completion',prompt=p,cue=context+' Le produit n’est pas un lot déjà identifié.',answers=[a],options=options(a,quantity_options(a),slug),explanation='Une mesure ou une expression de quantité est suivie de de/d’. Un nombre compte directement les objets. Modèle : '+model,imageSupports=[image(img,aid,common['id'])])
  elif mechanic=='a':
   other=next(data[(i+k)%50] for k in range(1,50) if data[(i+k)%50][2]!=a)
   u=dict(**common,kind='match',prompt='Deux informations de quantité.',pairs=[dict(id=slug+f'-paire-{j+1}',left='Quantité donnée : '+quantity_base(row[2])+'. '+row[4],right=row[2],sourceId='g4:'+row[0]) for j,row in enumerate([r,other])],answers=[model+'\n'+fill(other[4],other[2])],explanation='Respectez la quantité donnée et de/d’ devant le produit ; pas de de après un nombre seul.')
  elif mechanic=='s':u=scenario(common,context,model,opening,follow,reply,True)
  else:
   oral=mechanic=='po';u=dict(**common,kind='production',prompt=context,answers=[model+'\n'+reply] if oral else [model],mode='oral' if oral else 'written',task='Exprimez la quantité donnée.'+(' Partenaire : « '+follow+' » Répondez puis échangez les rôles.' if oral else ' Écrivez une phrase complète qui indique le produit et la quantité. Vous pouvez ajouter une précision cohérente.'),writeLines=0 if oral else 3,rubric=rubric(['Quantité conforme aux faits.','Mesure ou nombre et de/d’ adaptés.','Réponse à la relance compréhensible.' if oral else 'Produit indiqué et phrase compréhensible.']),explanation='Modèle non exclusif, à apprécier selon la consigne.')
  units.append(u)
 emit('g4','A1',mechanic,units)
for mechanic in ['q','t','c']:
 aid=aid_for('g5',mechanic);units=[]
 for i,(slug,lemma,a,bad,context,p,neutral) in enumerate(R['g5','A2']):
  common=base(aid,'g5','A2',slug,i);model=fill(p,a);facts=fact_context(context);cap=lambda s:s[0].upper()+s[1:] if a[0].isupper() else s
  families={'tout':['tout','toute','tous','toutes'],'certain':['certain','certaine','certains','certaines'],'aucun':['aucun','aucune','plusieurs'],'chaque':['chaque','plusieurs','tous'],'quelque':['quelques','chaque','tout'],'plusieurs':['plusieurs','chaque','toute']}
  explanation={'tout':'Tout s’accorde avec le nom de l’ensemble décrit.','certain':'Certain s’accorde en genre et en nombre avec le nom.','aucun':'Dans ces phrases, aucun/aucune accompagne un nom singulier et s’emploie avec ne, sans pas.','chaque':'Chaque est invariable et accompagne un nom singulier.','quelque':'Ici, quelques est un déterminant au pluriel.','plusieurs':'Plusieurs est invariable et accompagne un nom pluriel.'}[lemma]+' Modèle : '+model
  if mechanic=='q':u=dict(**common,kind='completion',prompt=p,cue=facts+' Mot demandé : '+lemma+'.',answers=[a],options=options(a,[cap(s) for s in families[lemma]],slug),explanation=explanation)
  elif mechanic=='t':u=dict(**common,kind='transform',prompt=neutral,cue=facts,answers=[model],directive='Reformulez avec la famille de « '+lemma+' » en conservant les faits. Accordez le nom, le verbe et le déterminant si nécessaire.',responseLines=2,explanation=explanation)
  else:
   start=p.index('___');u=dict(**common,kind='correct',prompt=fill(p,bad),cue=facts,answers=[model],responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(bad),text=bad),explanation=explanation)
  units.append(u)
 emit('g5','A2',mechanic,units)
def contract(prep,article):return {('à','le'):'au',('à','les'):'aux',('de','le'):'du',('de','les'):'des'}.get((prep,article),prep+' '+article)
aid=aid_for('g6','q');units=[]
for i,(slug,prep,art,context,p) in enumerate(R['g6','A1']):
 a=contract(prep,art);bad={('à','le'):['à le','aux'],('à','les'):['à les','au'],('de','le'):['de le','des'],('de','les'):['de les','du'],('à','la'):['au','à le'],('à','l’'):['à le','au'],('de','la'):['du','des'],('de','l’'):['de le','du']}[prep,art]
 units.append(dict(**base(aid,'g6','A1',slug,i),kind='completion',prompt=p,cue=context+' Groupe de départ : '+prep+' + '+art+'.',answers=[a],options=options(a,bad,slug),explanation='Groupe attendu : '+prep+' + '+art+' → '+a+'.'+(' Il n’y a pas de contraction avec la ou l’.' if art in ['la','l’'] else '')+' Modèle : '+fill(p,a)))
emit('g6','A1','q',units)
natures={'partitif':'un article partitif','contracte':'un article contracté','indefini':'un article indéfini'}
for mechanic in ['q','t','c']:
 aid=aid_for('g6',mechanic);units=[]
 for i,(slug,nature,a,prep,art,context,p,neutral) in enumerate(R['g6','A2']):
  common=base(aid,'g6','A2',slug,i);model=fill(p,a)
  if nature=='contracte':
   assert contract(prep,art)==a;demo='ce' if art=='le' else 'ces';old=prep+' '+demo;assert neutral.count(old+' ')==1;assert neutral.replace(old+' ',a+' ',1)==model
   explanation=a+' résulte de '+prep+' + '+art+' et reprend une référence définie.';directive='Remplacez « '+old+' » par une forme avec l’article défini « '+art+' ». Gardez le reste de la phrase.'
  elif nature=='partitif':explanation='Du indique ici une quantité de produit non mesurée ; ce n’est pas de + le.';directive='Reformulez avec un article partitif pour exprimer la quantité non mesurée.'
  else:explanation='Des présente ici plusieurs éléments comptables non identifiés : article indéfini pluriel.';directive='Reformulez avec des pour présenter plusieurs éléments non identifiés.'
  if mechanic=='q':u=dict(**common,kind='completion',prompt='Dans « '+model+' », le groupe « '+a+' » est ___.',cue=context,answers=[natures[nature]],options=options(natures[nature],list(natures.values()),slug),explanation=explanation)
  elif mechanic=='t':u=dict(**common,kind='transform',prompt=neutral,cue=context,answers=[model],directive=directive,responseLines=2,explanation=explanation+' Modèle : '+model)
  else:
   bad={'du':'de le','des':'de les','au':'à le','aux':'à les'}[a];start=p.index('___');u=dict(**common,kind='correct',prompt=fill(p,bad),cue=context,answers=[model],responseLines=2,error=dict(segmentId='prompt',start=start,end=start+len(bad),text=bad),explanation=explanation+' Modèle : '+model)
  units.append(u)
 emit('g6','A2',mechanic,units)
aid=aid_for('g4','ce');units=[]
for i,d in enumerate(json.loads((ROOT/'scripts/grammar_curriculum/aliments-lectures-a1.json').read_text())):
 text=' '.join(d['text']).replace(' Partenaire :','\nPartenaire :').replace(' Personne :','\nPersonne :');qs=[]
 for j,c in enumerate(d['questions']):
  assert c['evidence'] in text;child=dict(id=aid+'-'+d['id']+f'-q{j+1}',prompt=c['prompt'],answers=[c['answer']],evidence=[c['evidence']],explanation='Le document indique : « '+c['evidence']+' ». Une reformulation fidèle est recevable.',response='choice' if 'distractors' in c else 'short')
  if 'distractors' in c:child['options']=options(c['answer'],c['distractors'],d['id']+str(j))
  qs.append(child)
 units.append(dict(id=aid+'-a1-'+d['id'],source=dict(path='scripts/grammar_curriculum/aliments-lectures-a1.json',typeId=aid,position=i,partition='a1'),kind='reading',prompt=d['title'],genre=d['genre'],text=text,answers=[],questions=qs,explanation='Distinguez le produit, la quantité et l’information de situation.'))
emit('g4','A1','ce',units)
for sub in ['g1','g2','g3','g4','g5','g6']:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
obligations=[]
for sub in ['g1','g3','g4']:
 b=next(b for b in banks if b['activityId']==aid_for(sub,'q'));obligations.append(dict(obligationId='IMG-'+sub+'-A1',hostActivityId=b['activityId'],level='A1',reviewedIllustratedSituations=50,distinctImages=len({u['imageSupports'][0]['sha256'] for u in b['units']}),unitIds=[u['id'] for u in b['units']],humanReview='pending'))
(ROOT/MANIFEST).write_text(json.dumps(dict(obligations=obligations,distinctImages=len(objects),humanReview='pending',images=[dict(**obj,uses=uses[name]) for name,obj in objects.items()],note='150 situations hôtes illustrées. Les images montrent les produits, les quantités proviennent du texte. Réemploi interne sans génération, nouvelle édition ni modification de média.'),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=len({b['activityId'] for b in banks}),banks=len(banks),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),variants=1360,sourceRows=350,readingDocuments=20,readingQuestions=60,images=len(objects))))

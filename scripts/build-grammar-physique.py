"""Compile visible portrait details and twenty authored reading documents; reuse media verbatim."""
import csv,hashlib,json,shutil
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];REV='physique-2026-11-23-v1';MANIFEST='docs/grammaire/implementation/physique-media-manifest.json'
rows=[r for r in csv.reader((ROOT/'scripts/grammar_curriculum/physique-description-physique-a1.tsv').read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
assert len(rows)==50 and all(len(r)==8 for r in rows)
docs=json.loads((ROOT/'scripts/grammar_curriculum/physique-lectures-a1.json').read_text());assert len(docs)==20
media={};uses={}
def rubric(labels):return [dict(id=f'r{i+1}',label=x) for i,x in enumerate(labels)]
def detail(row):
 for word,label in [('col ','le col'),('cheveux','les cheveux'),('lunettes','les lunettes'),('chemisier','le chemisier'),('chemise','la chemise'),('bouche','la bouche au moment de la photo'),('visage','le visage'),('veste','la veste'),('barbe','la barbe'),('tablier','le tablier'),('pull','le pull'),('tee-shirt','le tee-shirt'),('vêtement','le vêtement'),('haut','le haut')]:
  if word in row[3]:return label+' (« '+row[4]+' »)'
 raise ValueError(row)
def options(a,others,slug):return [dict(id='forme-'+hashlib.sha256((slug+'|'+x).encode()).hexdigest()[:10],text=x) for x in dict.fromkeys([a,*others])]
def support(name,aid,uid):
 path='/lib/images/vocabulaire/presenter/portrait-'+name+'.webp';p=ROOT/'public'/path.lstrip('/');data=p.read_bytes();sha=hashlib.sha256(data).hexdigest();w,h=Image.open(p).size
 src=f'/lib/images/grammaire/curriculum/sha256/{sha}.webp';out=ROOT/'public'/src.lstrip('/');out.parent.mkdir(parents=True,exist_ok=True)
 if out.exists():assert out.read_bytes()==data
 else:shutil.copyfile(p,out)
 s=dict(id='physique-portrait-'+name,src=src,sha256=sha,width=w,height=h,alt='Portrait fictif servant à observer les cheveux et les vêtements. Les caractéristiques à accorder sont indiquées dans la consigne.',source=dict(path=path,manifest=MANIFEST,rights='permitted-reuse',note='Portrait interne réemployé sans modification ; cheveux, barbe et vêtements relus visuellement. Aucun âge, métier, origine, nationalité, taille ou caractère ne sont déduits du portrait.'))
 media[name]=s;uses.setdefault(name,[]).append(dict(activityId=aid,unitId=uid));return s
def base(aid,slug,i,path='scripts/grammar_curriculum/physique-description-physique-a1.tsv'):return dict(id=aid+'-a1-'+slug,source=dict(path=path,typeId=aid,position=i,partition='a1'))
def make_bank(aid,label,instructions,units):return dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='description-physique',topic='gram-decrire',level='A1',label=label,objective='Reconnaître et décrire des détails visibles de personnages fictifs, avec avoir, être et porter, sans jugement ni information déduite sur leur origine ou leur caractère.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-23',humanReview='pending',note='50 observations distinctes de dix portraits vérifiés et 20 lectures de trois questions. Réemploi entre mécaniques, modèles non exclusifs ; accord et détails visibles relus. Validation enseignante en attente.'),presentations=list(instructions),instructions=instructions,units=units)
banks=[]
for mechanic,label in [('q','Décrire une personne'),('a','Associer'),('e','Écrire une phrase utile'),('p','Dire une phrase utile')]:
 aid='gram-ex-description-physique-'+{'q':'qcm-verbe','a':'curriculum-a','e':'communication-pe','p':'communication-po'}[mechanic];units=[]
 for i,(slug,portrait,context,prompt,lemma,answer,d1,d2) in enumerate(rows):
  common=base(aid,slug,i);model=prompt.replace('___',answer)
  # A second distinct target on the same portrait makes both associations and productions explicit.
  same=[r for r in rows if r[1]==portrait];index=same.index(rows[i]);other=next(same[(index+offset)%len(same)] for offset in range(1,len(same)) if same[(index+offset)%len(same)][5]!=answer and same[(index+offset)%len(same)][3]!=prompt)
  second=other[3].replace('___',other[5]);alternates=[answer]
  explanation='Accordez l’adjectif avec le nom décrit. Modèle : '+model+(' Orange et bordeaux restent invariables comme couleurs.' if lemma in ['orange','bordeaux'] else '')
  if mechanic=='q':u=dict(**common,kind='completion',prompt=prompt,cue=context,agreementHint=lemma,answers=alternates,options=options(answer,[x for x in [d1,d2] if not x.endswith('ee')],slug),explanation=explanation)
  elif mechanic=='a':u=dict(**common,kind='match',prompt=context,answers=[model+'\n'+second],pairs=[dict(id=slug+f'-p{j+1}',left=r[3]+' ('+r[4]+')',right=r[5],sourceId='physique-observation:'+r[0]) for j,r in enumerate([rows[i],other])],explanation='Chaque indice entre parenthèses impose l’adjectif à accorder. '+model+' '+second)
  else:
   oral=mechanic=='p';task=('Décrivez oralement' if oral else 'Écrivez deux phrases pour décrire')+' ce personnage fictif. Deux cibles : '+detail(rows[i])+' ; '+detail(other)+'. Accordez les adjectifs.'
   if oral:task='Décrivez '+detail(rows[i])+'. Partenaire : « Quel autre détail voyez-vous ? » Répondez sur '+detail(other)+', puis échangez les rôles. Accordez les adjectifs.'
   u=dict(**common,kind='production',prompt='Portrait fictif\n'+context,answers=[model+'\n'+second],mode='oral' if oral else 'written',task=task,writeLines=0 if oral else 4,rubric=rubric(['Deux détails visibles conformes aux indices.','Phrases compréhensibles avec être, avoir ou porter.','Adjectifs accordés ; orange et bordeaux invariables.','Description neutre, limitée aux détails visibles.']),explanation='Modèle non exclusif, à apprécier par l’enseignant.')
  u['imageSupports']=[support(portrait,aid,u['id'])];units.append(u)
 instructions={'q':{'choice':'Observez le portrait et choisissez l’adjectif indiqué, correctement accordé.','gap':'Observez le portrait et écrivez l’adjectif indiqué avec l’accord nécessaire.'},'a':{'match':'Associez chaque groupe à l’adjectif indiqué, accordé selon le nom. Observez le portrait.'},'e':{'open-written':'Décrivez le personnage fictif en deux phrases, selon les détails indiqués.'},'p':{'open-oral':'Décrivez le personnage puis répondez à la relance avec un second détail visible.'}}[mechanic]
 banks.append(make_bank(aid,label,instructions,units))
aid='gram-ex-description-physique-communication-ce';units=[]
for i,d in enumerate(docs):
 text=' '.join(d['text']) if isinstance(d['text'],list) else d['text']
 questions=[]
 for j,q in enumerate(d['questions']):
  assert q['evidence'] in text;child=dict(id=d['id']+f'-q{j+1}',prompt=q['prompt'],answers=[q['answer']],explanation='Le texte précise : « '+q['evidence']+' ». Les formulations équivalentes sont recevables.',evidence=[q['evidence']],response='choice' if 'distractors' in q else 'short')
  if 'distractors' in q:child['options']=options(q['answer'],q['distractors'],d['id']+str(j))
  questions.append(child)
 u=dict(**base(aid,d['id'],i,'scripts/grammar_curriculum/physique-lectures-a1.json'),kind='reading',prompt=d['title'],answers=[],genre=d['genre'],text=text,questions=questions,supportLayout='image-left',explanation='Réponses fondées sur le texte, portrait lié au même personnage fictif. Aucune description ne permet de déduire le caractère, l’origine ou la profession.')
 u['imageSupports']=[support(d['portrait'],aid,u['id'])];units.append(u)
banks.append(make_bank(aid,'Lire une situation',{'document-set':'Lisez le document, observez le portrait et répondez aux trois questions.'},units))
(ROOT/'src/grammaire/curriculum/data/description-physique.json').write_text(json.dumps(banks,ensure_ascii=False,indent=2)+'\n')
q=banks[0];ob=dict(obligationId='IMG-description-physique-A1',hostActivityId=q['activityId'],level='A1',reviewedIllustratedSituations=50,distinctImages=len(media),unitIds=[u['id'] for u in q['units']],humanReview='pending')
(ROOT/MANIFEST).write_text(json.dumps(dict(obligations=[ob],distinctImages=len(media),humanReview='pending',images=[dict(**s,uses=uses[n]) for n,s in media.items()],note='50 observations distinctes de dix portraits : cinq cibles différentes par portrait ; 20 lectures originales, trois questions chacune. Aucun quota de 50 images ou de nouvelles histoires par mécanique revendiqué.'),ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=5,banks=5,offerings=6,units=220,variants=310,documents=20,documentQuestions=60,images=len(media))))

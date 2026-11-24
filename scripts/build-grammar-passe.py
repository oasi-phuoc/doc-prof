"""Compile the authored past-tense curriculum, preserving the existing h8 banks."""
import csv,json,re,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];REV='passe-2026-11-24-v1'
FILES={'pc-avoir-a1':'passe-pc-avoir-a1','pc-etre-a1':'passe-pc-etre-a1','pc-etre-a2':'passe-pc-etre-a2','imparfait-a2':'passe-imparfait-a2','pqp-b1':'passe-pqp-b1','double-aux':'passe-double-aux','pc-pronominaux-a2':'passe-pc-pronominaux-a2','accord-pp-b1':'passe-accord-pp-b1'}
def read(key):
 path='scripts/grammar_curriculum/'+FILES[key]+'.tsv';raw=[r for r in csv.reader((ROOT/path).read_text().splitlines(),delimiter='|') if r and not r[0].startswith('#')]
 assert len(raw)==50 and len({r[0] for r in raw})==50,(path,len(raw))
 assert all(len(r)==(10 if key=='imparfait-a2' else 8) and all(unicodedata.normalize('NFC',s)==s for s in r) for r in raw)
 return [dict(zip(['slug','context','verb','prompt','answer','wrong1','wrong2','neutral','follow','reply'],r),path=path,position=i) for i,r in enumerate(raw)]
R={key:read(key) for key in FILES}
def model(r):return r['prompt'].replace('___',r['answer'])
def opts(answer,others,slug):
 vals=list(dict.fromkeys([answer,*others]));assert 2<=len(vals)<=6
 return [dict(id=f'{slug}-choix-{i+1}',text=s) for i,s in enumerate(vals)]
def rubric(labels):return [dict(id=f'r{i+1}',label=s) for i,s in enumerate(labels)]
def common(aid,level,r):return dict(id=f'{aid}-{level.lower()}-{r["slug"]}',source=dict(path=r['path'],typeId=aid,position=r['position'],partition=level.lower()))
def aid_for(sub,m):return f'gram-ex-{sub}-'+('qcm-conj' if m=='q' and sub in ['pc-avoir','pc-etre','imparfait','pqp'] else 'qcm-verbe' if m=='q' else 'curriculum-'+m)
OBJECTIVES={'pc-idee':'Reconnaître le passé composé comme temps d’un événement achevé, puis construire une phrase.','pc-avoir':'Former le passé composé avec avoir et un participe régulier ou fréquent.','pc-etre':'Employer être et accorder le participe avec un sujet dont le genre et le nombre sont explicites.','imparfait':'Décrire une habitude, un état ou une action en cours dans le passé ; former les radicaux et terminaisons.','pqp':'Marquer une action antérieure à un repère passé, en conservant la chronologie et les faits.','double-aux':'Choisir l’auxiliaire selon la construction transitive ou intransitive et le sens du verbe.','pc-pronominaux':'Placer le pronom et la négation au passé composé ; distinguer les accords usuels du COD et du COI.','accord-pp':'Accorder le participe selon l’auxiliaire, le COD et sa position, sans déduire l’accord du seul sujet.'}
LABELS={'pc-idee':'Reconnaître une action achevée','pc-avoir':'Former le passé composé avec avoir','pc-etre':'Former le passé composé avec être','imparfait':'Décrire une situation à l’imparfait','pqp':'Situer une action antérieure','double-aux':'Choisir l’auxiliaire selon la construction','pc-pronominaux':'Former le passé composé pronominal','accord-pp':'Accorder le participe passé'}
PLANS={'pc-idee':{'A1':['q','a','o']},'pc-avoir':{'A1':['q','t','c']},'pc-etre':{'A1':['q'],'A2':['q','t','c','e']},'imparfait':{'A2':['q','t','e','p']},'pqp':{'B1':['q','t','d','e']},'double-aux':{'A2':['q'],'B1':['q','c','t']},'pc-pronominaux':{'A2':['q','o','t','c']},'accord-pp':{'A2':['q'],'B1':['q','c','t','e']}}
def data(sub,level):
 if sub in ['pc-idee','pc-avoir']:return R['pc-avoir-a1']
 if sub=='double-aux':return R[sub]
 if sub=='accord-pp' and level=='A2':
  values=[]
  roots={'aller':'allé','rentrer':'rentré','arriver':'arrivé','entrer':'entré','sortir':'sorti','revenir':'revenu','partir':'parti','rester':'resté','venir':'venu','monter':'monté','descendre':'descendu','tomber':'tombé','passer':'passé','naître':'né'}
  for source in ['pc-avoir-a1','pc-etre-a1']:
   for r in R[source][:25]:
    pp=r['answer'].split()[-1];aux=r['answer'][:-len(pp)].rstrip();root=pp if source=='pc-avoir-a1' else roots[r['verb']]
    family=list(dict.fromkeys([root,root+'e',root if root.endswith('s') else root+'s',root+'es']))
    wrong=[x for x in family if x!=pp];assert len(wrong)>=2
    values.append(dict(r,slug=source+'-'+r['slug'],prompt=r['prompt'].replace('___',aux+' ___'),answer=pp,wrong1=wrong[0],wrong2=wrong[1],auxiliary='avoir' if source=='pc-avoir-a1' else 'être'))
  return values
 return R[sub+'-'+level.lower()]
def direct(r):return r['answer'].split()[0] in ['ai','as','a','avons','avez','ont']
def facts(r):
 # The A2 cue may name the COD as scaffolding. B1 analysis uses only the facts.
 return ' '.join(s for s in re.split(r'(?<=[.!?])\s+',r['context']) if not any(t in s for t in ['COD','COI','pas un COD']))
def reason(sub,level,r):
 if sub=='double-aux':return 'Avoir : le verbe est transitif direct ; le complément désigne l’objet déplacé, transmis ou traité.' if direct(r) else 'Être : le verbe est intransitif dans cette phrase ; il décrit le déplacement du sujet, sans COD.'
 if sub=='pc-avoir':return 'Avoir au présent + participe passé. Dans ces phrases, aucun COD ne précède : pas d’accord avec le sujet.'
 if sub=='pc-etre':return 'Être au présent + participe passé accordé avec le sujet précisé dans la situation. Vous peut désigner une seule personne.'
 if sub=='imparfait':
  return {'étudier':'Nous étudiions : radical étudi- et terminaison -ions ; les deux i sont nécessaires.','rire':'Vous riiez : radical ri- et terminaison -iez ; les deux i sont nécessaires.','crier':'Nous criions : radical cri- et terminaison -ions ; les deux i sont nécessaires.','manger':'Mangeais/mangeait garde e devant a ; mangiez n’ajoute pas de e devant i.','commencer':'Commençait prend ç devant a ; commencions garde c devant i.','être':'Être a le radical ét- à l’imparfait.'}.get(r['verb'],'L’imparfait présente ici une habitude, un état ou une action en cours. Respectez le radical et la terminaison du sujet.')
 if sub=='pqp':return 'Auxiliaire à l’imparfait + participe passé. Le contexte place ce fait, ou son absence à la négation, avant le repère passé.'
 if sub=='pc-pronominaux':
  if r['verb'] in ['se parler','se téléphoner']:return 'Le pronom est COI : parler/téléphoner à quelqu’un. Le participe reste invariable, avec être.'
  if any(x in r['prompt'] for x in ['les mains','les cheveux']):return 'Le COD (mains/cheveux) suit le verbe ; le pronom est COI. Le participe reste invariable.'
  return 'Le pronom précède être ; à la négation, ne/n’ précède le pronom et pas suit l’auxiliaire. Dans ce cas, accord du participe avec le sujet indiqué.'
 if sub=='accord-pp':
  if level=='B1':return r['context']
  return 'Avec avoir, le COD est ici placé après : pas d’accord avec le sujet.' if r['auxiliary']=='avoir' else 'Avec être, le participe s’accorde avec le sujet indiqué en genre et en nombre.'
 return 'Le passé composé présente ici le fait comme un événement achevé : auxiliaire au présent et participe passé.'

# Explicit vocabulary for the two order tasks. A word absent from this lexical
# review fails the build rather than receiving a guessed grammatical category.
LEX={}
for category,words in {
 'pronom':'je j’ tu il elle nous vous ils elles me m’ te t’ se s’',
 'negation':'ne n’ pas',
 'determinant':'le la l’ les un une des mon ma mes ton ta tes sa ses son ce cette cinq sept six deux dix',
 'preposition':'sous à au aux de d’ du en dans sur pour après avant pendant près autour avec jusqu’ chez',
 'conjonction':'et',
 'adjectif':'propre',
 'verbe':'prendre sortir',
 'adverbe':'ensemble tôt',
 'nom':'document repas porte billets bus message match soupe clé film lettre fenêtre livre eau travail tarte exercice consigne vélos table dessin chanson carte horaires colis courses secrétariat photo musée sacs jardin question ticket minutes paquet adresse total aide places plan pain chaises spectacle solution voisin ordinateur couleurs kilomètres heures sonnerie sortie trajet entretien train numéro code lac fontaine banc randonnée cours fête mains cheveux atelier centre tournoi nuit test pluie départ quai terrasse gare rivière course distance jeu théâtre barrière uniforme journal radio entrée cahier cube cercle cercle',
}.items():
 for word in words.split():LEX[word]=category
def tokens(r,slug):
 sentence=model(r);verb_words={s.lower().rstrip('.,;:!?') for s in re.findall(r'[^\s’]+’|[^\s]+',r['answer'])}
 out=[]
 for i,word in enumerate(re.findall(r'[^\s’]+’|[^\s]+',sentence)):
  key=word.lower().rstrip('.,;:!?');category=LEX.get(key)
  if key in verb_words and key not in LEX:category='verbe'
  assert category,(slug,word,'add a reviewed lexical category')
  out.append(dict(id=f'{slug}-mot-{i+1}',text=word,category=category))
 assert ' '.join(t['text'] for t in out).replace('’ ','’')==sentence
 return out

banks=[]
for sub,levels in PLANS.items():
 for level,mechanics in levels.items():
  for mechanic in mechanics:
   if mechanic=='d':continue
   aid=aid_for(sub,mechanic);units=[]
   for i,r in enumerate(data(sub,level)):
    base=common(aid,level,r);sentence=model(r);why=reason(sub,level,r);cue=r['context'];a=r['answer'];p=r['prompt']
    if sub=='double-aux' and level=='B1':cue=facts(r)
    if mechanic=='q':
     others=[r['wrong1'],r['wrong2']]
     if sub=='pc-idee':a=sentence;others=[r['neutral']];p='Phrase de départ : « '+r['neutral']+' » → ___.'
     elif sub=='double-aux' and level=='B1':
      a='transitive directe' if direct(r) else 'intransitive';others=['intransitive' if direct(r) else 'transitive directe','pronominale'];p='Dans « '+sentence+' », « '+r['verb']+' » est employé dans une construction ___.'
     u=dict(**base,kind='completion',prompt=p,cue=cue,answers=[a],options=opts(a,others,r['slug']),explanation=why+(' Modèle : '+sentence if sub!='double-aux' or level!='B1' else ''),**({} if sub=='pc-idee' or sub=='double-aux' and level=='B1' else {'givenVerb':r['verb']}))
    elif mechanic=='a':
     other=data(sub,level)[(i+17)%50];u=dict(**base,kind='match',prompt='Deux situations indépendantes.',pairs=[dict(id=r['slug']+f'-paire-{j+1}',left=x['context'],right=model(x),sourceId=x['path']+':'+x['slug']) for j,x in enumerate([r,other])],answers=[sentence+'\n'+model(other)],explanation='Chaque phrase au passé composé reprend la situation correspondante, sans changer les faits.')
    elif mechanic=='o':u=dict(**base,kind='order',prompt='Formez la phrase avec toutes les étiquettes.',cue=cue,answers=[sentence],tokens=tokens(r,r['slug']),responseLines=2,explanation='Ordre possible : '+sentence+' Les autres ordres grammaticaux qui conservent tous les mots et les faits sont appréciés par l’enseignant. '+why)
    elif mechanic in ['t','c']:
     answers=[sentence+('\n'+why if sub=='double-aux' else '')]
     if mechanic=='t':
      directive='Racontez le fait au passé composé. Conservez les faits, la personne et la forme indiqués.'
      if sub=='imparfait':directive='Décrivez la situation à l’imparfait, selon le repère passé indiqué.'
      elif sub=='pqp':directive='Réécrivez le récit avec le plus-que-parfait pour le fait antérieur et un repère au passé, selon la chronologie donnée.'
      elif sub=='double-aux':directive='Mettez le verbe au passé composé, puis expliquez le choix de l’auxiliaire selon la construction.'
      elif sub=='pc-pronominaux':directive='Mettez le verbe pronominal au passé composé. Conservez le pronom, la négation et les faits du rôle.'
      elif sub=='accord-pp':directive='Mettez le groupe verbal indiqué au passé composé. Gardez les reprises, la place du COD, les faits et le reste de la phrase.'
      u=dict(**base,kind='transform',prompt=r['neutral'],cue=cue,answers=answers,directive=directive,responseLines=2,explanation=why+' Modèle : '+sentence)
     else:
      bad=r['wrong1'];start=p.index('___');u=dict(**base,kind='correct',prompt=p.replace('___',bad),cue=cue,answers=answers,error=dict(segmentId='prompt',start=start,end=start+len(bad),text=bad),responseLines=2,explanation=why+' Modèle : '+sentence)
    else:
     oral=mechanic=='p';task='Racontez le fait au passé composé en une phrase complète. Vous pouvez ajouter un détail cohérent.';stimulus=cue+'\nAction à raconter : '+p.replace('___','('+r['verb']+')')
     answers=[sentence];criteria=['Fait, sujet et rôle respectés.','Auxiliaire et accord du participe corrects.','Phrase complète et compréhensible.']
     if sub=='imparfait':
      task='Décrivez cette habitude ou situation à l’imparfait, selon les faits.';criteria=['Faits et repère passé respectés.','Imparfait correctement formé.','Description compréhensible.']
      if oral:task+=' Partenaire : « '+r['follow']+' » Répondez, puis échangez les rôles.';answers=[sentence+'\n'+r['reply']];criteria[-1]='Réponse compréhensible et cohérente à la relance.'
     elif sub=='pqp':task='Racontez les deux faits selon leur chronologie : le fait antérieur au plus-que-parfait et le repère au passé. D’autres formulations fidèles aux faits sont possibles.';stimulus=cue+'\nFaits : '+r['neutral'];criteria=['Chronologie et deux faits respectés.','Plus-que-parfait et repère passé corrects.','Récit compréhensible.']
     elif sub=='accord-pp':task='Racontez le fait au passé composé avec la reprise ou le pronom indiqué. Ajoutez une phrase pour expliquer l’accord du participe.';stimulus=cue+'\nFait à raconter : '+r['neutral'];answers=[sentence+'\n'+why];criteria=['Faits, reprise du complément ou pronom conservés.','Participe et auxiliaire correctement formés.','Explication de l’accord adaptée au cas.']
     u=dict(**base,kind='production',prompt=stimulus,answers=answers,mode='oral' if oral else 'written',task=task,writeLines=0 if oral else 4 if sub in ['pqp','accord-pp'] else 3,rubric=rubric(criteria),explanation='Modèle non exclusif ; les autres formulations qui respectent les faits et les contraintes sont recevables. '+why)
    units.append(u)
   if mechanic=='q':
    if sub=='pc-idee':ins={'choice':'Choisissez la phrase qui raconte le fait au passé composé.','gap':'Réécrivez la phrase au passé composé.'}
    elif sub=='double-aux' and level=='B1':ins={'choice':'Identifiez la construction du verbe et expliquez oralement le choix de l’auxiliaire.','gap':'Écrivez transitive directe ou intransitive, puis expliquez oralement le choix de l’auxiliaire.'}
    else:ins={'choice':'Choisissez '+('le participe correctement accordé.' if sub=='accord-pp' else 'le groupe verbal au plus-que-parfait.' if sub=='pqp' else 'la forme de l’imparfait.' if sub=='imparfait' else 'le groupe verbal au passé composé selon la situation.'),'gap':'Écrivez '+('le participe correctement accordé.' if sub=='accord-pp' else 'le groupe verbal au plus-que-parfait.' if sub=='pqp' else 'la forme de l’imparfait.' if sub=='imparfait' else 'le groupe verbal complet au passé composé, selon la situation.')}
   else:ins={ {'a':'match','o':'order','t':'transform','c':'correct','e':'open-written','p':'open-oral'}[mechanic]:{'a':'Associez les situations aux phrases qui racontent les faits au passé composé.','o':'Remettez toutes les étiquettes dans l’ordre pour construire la phrase au passé composé.','t':'Réécrivez la phrase selon le temps, la construction et les faits demandés.','c':'Corrigez le groupe verbal et réécrivez la phrase entière.'+(' Expliquez ensuite le choix de l’auxiliaire.' if sub=='double-aux' else ''),'e':'Écrivez selon les faits et les contraintes de la situation. Le corrigé propose un modèle possible.','p':'Décrivez la situation passée puis répondez à votre partenaire.'}[mechanic]}
   label=LABELS[sub] if mechanic=='q' else {'a':'Associer','o':'Mots dans l’ordre','t':'Transformer une phrase','c':'Corriger l’erreur','e':'Écrire une situation passée','p':'Décrire un souvenir à l’oral'}[mechanic]
   banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId=sub,topic='gram-passe',level=level,label=label,objective=OBJECTIVES[sub],editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-24',humanReview='pending',note='Sources et variantes relues. Réemploi explicite des situations entre mécaniques et niveaux ; aucune approbation pédagogique humaine déclarée.'),presentations=list(ins),instructions=ins,units=units))

aid=aid_for('pqp','d');units=[]
for i,d in enumerate(json.loads((ROOT/'scripts/grammar_curriculum/passe-pqp-lectures-b1.json').read_text())):
 text=' '.join(d['text']);questions=[]
 for j,t in enumerate(d['targets']):
  assert t['evidence'] in text
  questions.append(dict(id=aid+'-'+d['id']+f'-q{j+1}',prompt='Information à interroger : '+t['information']+'.',answers=[t['model']],explanation='Exemple de question ; les formulations grammaticales visant la même information sont recevables.',evidence=[t['evidence']],response='short',writingTask=dict(information=t['information'],form='open',rubric=rubric(['Question grammaticale et temps adaptés.','Information ciblée et mots interrogatifs pertinents.','Fidélité au document et aux référents.']))))
 units.append(dict(id=aid+'-b1-'+d['id'],source=dict(path='scripts/grammar_curriculum/passe-pqp-lectures-b1.json',typeId=aid,position=i,partition='b1'),kind='reading',prompt=d['title'],genre=d['genre'],text=text,answers=[],questions=questions,explanation='Distinguez les actions antérieures, le repère passé et les autres informations ; plusieurs questions sont possibles.'))
banks.append(dict(schemaVersion=1,revision=REV,activityId=aid,subthemeId='pqp',topic='gram-passe',level='B1',label='Lire et écrire des questions sur le récit',objective='Interroger les faits et leur chronologie dans un récit au passé.',editorialStatus='reviewed',review=dict(reviewer='Codex — revue linguistique et fonctionnelle',date='2026-11-24',humanReview='pending',note='Vingt documents originaux et soixante cibles distinctes ; modèles de questions non exclusifs.'),presentations=['document-set'],instructions={'document-set':'Lisez le document. Pour chaque information ciblée, écrivez une question ouverte. Respectez les temps et les faits du récit.'},units=units))
assert len(banks)==32
for sub in PLANS:(ROOT/f'src/grammaire/curriculum/data/{sub}.json').write_text(json.dumps([b for b in banks if b['subthemeId']==sub],ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(activities=len({b['activityId'] for b in banks}),banks=len(banks),offerings=sum(len(b['presentations']) for b in banks),units=sum(len(b['units']) for b in banks),variants=sum(sum(len(u['questions']) if u['kind']=='reading' else 1 for u in b['units'])*len(b['presentations']) for b in banks),authoredSourceRows=400,readingDocuments=20,writingTargets=60)))

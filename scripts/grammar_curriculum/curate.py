"""Final editorial adjustments: elision, semantics and targeted rule coverage."""
from bank_common import *
from banks_nominal import PLACE_NOUNS

def lesson(s):return next(x for x in LESSONS if x['subId']==s)

# Negation changes indefinite articles before a direct object into de/d’.
for row in lesson('a8')['items']:
 row['prompt']=re.sub(r'\b(?:un|une|des) ([aàâeéèêiîoôuùhœ])',r'd’\1',row['prompt'])
 row['prompt']=re.sub(r'\b(?:un|une|des) ', 'de ',row['prompt'])
# A whole infinitive action, rather than a fragment, follows pour.
for i,row in enumerate(lesson('a9')['items']):
 v,comp=__import__('banks_verbs').AVOIR_ONLY[i]
 if i%5==3:row['prompt']=sentence(SUBJECTS[(i*3)%8][0],row['answer'],'avant de '+v+' '+comp,'oublier')[:-1]+' (aucune chose).'
# No ambiguity about self/other subjects in a tonic-pronoun exercise.
for row in lesson('d3')['items']:
 row['prompt']=re.sub(r'^(?:Je|Tu|Lina|Paul|Nous|Vous|Les voisins|Les voisines) ', 'La formatrice ',row['prompt'])
 # The main verb is now third person singular.
 for v,comp in REGULAR:
  if comp in row['prompt']:
   for f in sorted(present(v),key=len,reverse=True):
    if row['prompt'].startswith('La formatrice '+f+' '):
     row['prompt']='La formatrice '+present(v)[2]+' '+row['prompt'][len('La formatrice '+f+' '):];break
   break
# Weather choices are all real expressions from the same grammatical category.
for row in lesson('f4')['items']:
 row['options']=distinct([row['answer'],'pleut','neige','fait froid','fait chaud','y a du vent'])[:3]
# Proper apostrophes in a nominal subject.
for sub in ('l4','l5','f7','l14'):
 for row in lesson(sub)['items']:
  row['prompt']=re.sub(r'^(?:Le|La) ([aàâeéèêiîoôuùhœ])',r'L’\1',row['prompt'])
# "Je" before en and y.
for row in lesson('i7')['items']:row['prompt']=row['prompt'].replace('Je ___ pense','J’___ pense')
# Preserve every real multiword subject in the original noun frames.
verbs=['prends','portes','visite','notons','empruntez','déplace','nettoie','installe','réserve','présentes','rechargeons','remplit','ouvre','retrouvez','complète','regarde','prêtes','lisons','répare','gare','arrosons','aérez','prépare','lave','remplit','poses','rangeons','met','allumez','ferme','signe','ouvres','lisons','accroche','choisit','prépare','utilise','éteins','essayons','règle','accroche','fermez','composte','plies','suivons','cherche','observent','posez','soigne','raconte']
for i,row in enumerate(lesson('i4')['items']):
 before,after=NOUN_FRAMES[i].split('{d} {n}');verb=verbs[i];subject=before[:before.index(verb)].rstrip();tail=after
 noun,plural,g=NOUNS[i];ispl=i%3==0;n=plural if ispl else noun;a=noun_article(n,g,ispl);phrase=a+('' if a.endswith('’') else ' ')+n
 answer='les' if ispl else 'l’' if vowel(verb) else 'la' if g=='f' else 'le'
 lesson('i4')['items'][i]=item(f'{subject} ___ {verb}{tail[:-1]} (remplacez « {phrase} »).',answer,['le','la','l’','les'])
# A meaningful contrast between background habit and a completed fact.
for row in lesson('imparfait-ou-pc')['items']:
 row['prompt']=row['prompt'].replace('Autrefois, chaque semaine,','Autrefois, d’habitude,')
# Let the finite subject/verb elision follow the same rule in indirect statements.
for i,row in enumerate(lesson('j7')['items']):
 if i%3==0:
  v,comp=REGULAR[i];s,p=SUBJECTS[i%8]
  s=s.lower() if s in ('Je','Tu','Nous','Vous','Les voisins','Les voisines') else s
  row['prompt']='Lina dit que '+sentence(s,present(v)[p],comp,v)
# Parce que elides before a vowel, including il and elle.
for row in lesson('k3')['items']:
 after=row['prompt'].split('___ ',1)[1]
 if vowel(after):row['answer']='parce qu’';row['options']=['parce qu’','pour que','bien que']
# A few irregular comparatives/superlatives are explicitly practised.
for sub in ('f9','f13'):
 bank=lesson(sub)['items']
 for offset,(noun,adj,correct,options) in enumerate([
  ('repas','bon','meilleur',['meilleur','plus bon','mieux']),
  ('soupe','bonne','meilleure',['meilleure','plus bonne','mieux']),
  ('résultats','bons','meilleurs',['meilleurs','plus bons','mieux']),
  ('recettes','bonnes','meilleures',['meilleures','plus bonnes','mieux']),
  ('travail','bien','mieux',['mieux','plus bien','meilleur'])]):
  if sub=='f9':
   prompt=f'Ce {noun} est ___ que l’autre ({adj}, supériorité).' if offset not in (1,2,3,4) else f'Cette {noun} est ___ que l’autre ({adj}, supériorité).' if offset==1 else f'Ces {noun} sont ___ que les autres ({adj}, supériorité).' if offset in (2,3) else 'Paul travaille ___ que moi (bien, supériorité).'
  else:
   prompt=f'De tous les {plural_noun(noun)}, celui-ci est le ___ ({adj}, supériorité).' if offset==0 else f'De toutes les soupes, celle-ci est la ___ (bonne, supériorité).' if offset==1 else f'De tous les résultats, ceux-ci sont les ___ (bons, supériorité).' if offset==2 else f'De toutes les recettes, celles-ci sont les ___ (bonnes, supériorité).' if offset==3 else 'De toute l’équipe, Paul travaille le ___ (bien, supériorité).'
  bank[offset]=item(prompt,correct,options)
# Include countries as well as places in the merged destination subtheme.
COUNTRIES=[('France','en'),('Canada','au'),('Italie','en'),('États-Unis','aux'),('Suisse','en'),('Maroc','au'),('Iran','en'),('Pays-Bas','aux'),('Allemagne','en'),('Japon','au'),('Espagne','en'),('Portugal','au'),('Belgique','en'),('Brésil','au'),('Algérie','en'),('Mexique','au'),('Tunisie','en'),('Sénégal','au'),('Autriche','en'),('Chili','au'),('Argentine','en'),('Vietnam','au'),('Grèce','en'),('Pérou','au'),('Australie','en')]
for i,(country,answer) in enumerate(COUNTRIES):lesson('aller-destination')['items'][i]=item('Nous allons ___ '+country+'.',answer,['en','au','aux'])
# Ambiguous demonstrative/possessive homophones get an explicit cue.
for row in lesson('l11')['items']:
 if row['answer'] in ('mes','ses','leurs'):row['prompt']=row['prompt'][:-1]+' (possessif).'
# A syntactically good additional indefinite-pronoun example is retained in every row.
for row in lesson('l9')['items']:
 if row['answer']=='interjection':row['prompt']=row['prompt'].replace('une ___','une ___')
# Duration needs a situation whose actual meaning supports the expression.
DURATION=[
('J’habite dans ce quartier ___ deux ans (situation toujours vraie).','depuis'),('Lina travaille à la pharmacie ___ six mois (situation toujours vraie).','depuis'),('Nous attendons le bus ___ dix minutes (attente toujours en cours).','depuis'),('Paul apprend le français ___ septembre (apprentissage toujours en cours).','depuis'),('Cette boutique est fermée ___ lundi (fermeture toujours en cours).','depuis'),('Je connais ma voisine ___ mon arrivée ici (relation toujours actuelle).','depuis'),('Le bébé dort ___ une heure (sommeil toujours en cours).','depuis'),('Vous faites partie de l’équipe ___ janvier (situation toujours vraie).','depuis'),('La pluie tombe ___ ce matin (pluie toujours en cours).','depuis'),('Les élèves sont en classe ___ neuf heures (présence toujours actuelle).','depuis'),
('Hier, nous avons marché ___ trois heures (durée totale terminée).','pendant'),('Lina a travaillé au musée ___ deux étés (période terminée).','pendant'),('Paul a attendu au guichet ___ vingt minutes (attente terminée).','pendant'),('J’ai gardé le chat ___ le week-end dernier (période terminée).','pendant'),('Le film a duré et nous sommes restés assis ___ deux heures (durée terminée).','pendant'),('Vous avez suivi cette formation ___ six mois (formation terminée).','pendant'),('La route a été fermée ___ toute la nuit (fermeture terminée).','pendant'),('Les enfants ont joué dehors ___ une heure (activité terminée).','pendant'),('Nous avons loué ce chalet ___ une semaine l’an dernier (séjour terminé).','pendant'),('Elle a porté une attelle ___ quinze jours (période terminée).','pendant'),
('J’ai rempli le formulaire ___ cinq minutes (temps nécessaire pour finir).','en'),('Le mécanicien a réparé le vélo ___ une heure (temps nécessaire pour finir).','en'),('Nous avons préparé le repas ___ trente minutes (temps nécessaire pour finir).','en'),('Lina a lu le roman ___ trois jours (temps nécessaire pour finir).','en'),('Vous avez traversé le lac ___ vingt minutes (temps nécessaire pour finir).','en'),('Le peintre a repeint la pièce ___ deux jours (temps nécessaire pour finir).','en'),('Paul a monté le meuble ___ quarante minutes (temps nécessaire pour finir).','en'),('Les élèves ont terminé le puzzle ___ une heure (temps nécessaire pour finir).','en'),('J’ai rangé les dossiers ___ dix minutes (temps nécessaire pour finir).','en'),('Nous avons parcouru cinq kilomètres ___ cinquante minutes (temps nécessaire pour finir).','en'),
('Le train partira ___ dix minutes (délai avant le départ).','dans'),('Le médecin vous recevra ___ un quart d’heure (délai avant le rendez-vous).','dans'),('Le cours commencera ___ deux jours (délai avant le début).','dans'),('Votre passeport sera prêt ___ trois semaines (délai avant sa remise).','dans'),('Les invités arriveront ___ une heure (délai avant leur arrivée).','dans'),('Le repas sera servi ___ vingt minutes (délai avant le service).','dans'),('Le magasin ouvrira ___ un mois (délai avant l’ouverture).','dans'),('Nous déménagerons ___ six semaines (délai avant le déménagement).','dans'),('L’exposition débutera ___ quinze jours (délai avant son ouverture).','dans'),('Je vous rappellerai ___ cinq minutes (délai avant mon appel).','dans'),
('Je loue une voiture ___ trois jours (durée prévue au contrat).','pour'),('Nous réservons le chalet ___ une semaine (durée prévue du séjour).','pour'),('Lina part en formation ___ deux mois (durée prévue).','pour'),('Paul est engagé ___ six mois (durée prévue au contrat).','pour'),('Vous empruntez ces livres ___ trois semaines (durée autorisée prévue).','pour'),('La mairie prête la salle ___ une soirée (durée prévue).','pour'),('Je prends un abonnement ___ un an (durée prévue).','pour'),('Nous accueillons une correspondante ___ quinze jours (durée prévue).','pour'),('Le médecin prescrit ce traitement ___ dix jours (durée prévue).','pour'),('Elle réserve une chambre ___ deux nuits (durée prévue).','pour')]
lesson('e3')['items']=[item(p,a,['depuis','pendant','en','dans','pour']) for p,a in DURATION]
# The correct option is placed first; include the other meaningful durations as distractors.
for i,row in enumerate(lesson('e4')['items']):
 v,comp=REGULAR[i];s,p=SUBJECTS[(i*3)%8];f=present(v)[p];adverb=row['answer'];clue=row['prompt'].split('(fréquence : ',1)[1]
 group=(('n’' if vowel(f) else 'ne ')+f+' ___') if adverb=='jamais' else f+' ___'
 row['prompt']=sentence(s,group,comp).replace('___',group,1)
 # sentence emits one blank for the verbal group, now replaced by f + the frequency blank.
 row['prompt']=row['prompt'][:-1]+' (fréquence : '+clue
for row in lesson('accord-pp')['items'][:20]:
 if '(sortir)' in row['prompt']:row['prompt']=row['prompt'].replace('au rendez-vous','du cours')
 if '(partir)' in row['prompt']:row['prompt']=row['prompt'].replace('au rendez-vous','en vacances')
for row in lesson('c1')['items']:row['prompt']=row['prompt'].replace('___','___ ',1)
# Infinitive pronominal cues use the same apostrophe as the final sentence.
for l in LESSONS:
 for row in l['items']:
  row['prompt']=re.sub(r'\(se ([aàâeéèêiîoôuùhœ])',r'(s’\1',row['prompt'])
  if row['prompt'].startswith('___'):
   row['answer']=row['answer'][0].upper()+row['answer'][1:]
   row['options']=[o[0].upper()+o[1:] for o in row['options']]
# Practise all three question structures, not just est-ce que.
rows=[]
for i,(v,comp) in enumerate(REGULAR):
 pro,p=[('tu',1),('il',2),('elle',2),('nous',3),('vous',4),('ils',5),('elles',5)][i%7]
 form=present(v)[p]
 declarative=pro[0].upper()+pro[1:]+' '+form+' '+comp
 intonation=declarative+' ?'
 estce=('Est-ce qu’' if vowel(pro) else 'Est-ce que ')+pro+' '+form+' '+comp+' ?'
 bridge='-t-' if pro in ('il','elle') and not form.endswith(('t','d')) else '-'
 inversion=form[0].upper()+form[1:]+bridge+pro+' '+comp+' ?'
 mode=i%3;answer=[intonation,estce,inversion][mode];name=['l’intonation','est-ce que','l’inversion'][mode]
 rows.append(item(f'Question avec {name} : ___ (idée : « {declarative} »).',answer,[intonation,estce,inversion]))
lesson('c1').update(label='Trois façons de questionner',instruction='Formez une question avec la construction indiquée.',items=rows)
# Closed questions practise oui/non/si as well as open questions.
for i in range(10):
 v,comp=REGULAR[i];neg=i%3==2;yes=i%3==0
 q=f'Tu ne {present(v)[1]} pas {comp} ?' if neg else f'Tu {present(v)[1]} {comp} ?'
 q=q.replace('ne aime','n’aimes').replace('ne écoute','n’écoutes')
 ans='Si' if neg else 'Oui' if yes else 'Non'
 prompt=f'À « {q} », je réponds « ___ » ('+('affirmation' if yes or neg else 'réponse négative')+').'
 lesson('c2')['items'][i]=item(prompt,ans,['Oui','Non','Si'])
lesson('c2').update(label='Questions ouvertes ou fermées',instruction='Complétez le mot interrogatif ou la réponse selon l’information demandée.')
# Correct complete location phrases in each option, not fragments missing an article.
from banks_usage import SPATIAL
for sub,offset in [('e1',0),('e6',23)]:
 rows=[]
 for obj,ref,prep,clue in SPATIAL[offset:]+SPATIAL[:offset]:
  article='le' if ref.startswith('le ') else 'la' if ref.startswith('la ') else 'les' if ref.startswith('les ') else 'l’'
  bare=ref[3:] if article in ('le','la') else ref[4:] if article=='les' else ref[2:]
  def combine(p):
   if p.endswith(' de'):
    a={'le':'du','la':'de la','les':'des','l’':'de l’'}[article];return p[:-2]+a
   return p+' '+article
  answer=combine(prep);opts=[answer]+[combine(p) for p in ('sur','sous','devant','derrière','dans') if p!=prep]
  rows.append(item(f'{obj} '+('sont' if obj.startswith('Les ') else 'est')+f' ___ {bare} (position : {clue} ce repère).',answer,opts))
 lesson(sub)['items']=rows
# Location and time relative où; the other relative items still work qui/que.
for i,(noun,g) in enumerate(PLACE_NOUNS[:10]):
 art='les ' if g=='p' else 'l’' if vowel(noun) else 'le ' if g=='m' else 'la '
 lesson('i1')['items'][i]=item(f'Voici {art}{noun} ___ nous avons rendez-vous.','où',['où','que','dont'])
lesson('i1')['label']='Choisir qui, que ou où'
for i,row in enumerate(lesson('i8')['items']):
 row['prompt']=row['prompt'].replace('nous parlons','j’ai besoin' if i%3==1 else 'je me souviens' if i%3==2 else 'nous parlons')
for i,row in enumerate(lesson('i9')['items']):
 if i%2:
  n,pl,g=NOUNS[i];plural=i%3==0
  answer=('auxquelles' if g=='f' else 'auxquels') if plural else ('à laquelle' if g=='f' else 'auquel')
  row['prompt']=row['prompt'].split(' sans ___')[0]+' ___ je tiens beaucoup.'
  row['answer']=answer;row['options']=distinct([answer,'auquel','à laquelle','auxquels','auxquelles'])[:3]
lesson('i9')['instruction']='Accordez le pronom relatif avec le nom repris, avec la préposition nécessaire.'
for row in lesson('i7')['items']:
 row['prompt']=row['prompt'].replace('de le ','du ').replace('de les ','des ').replace('à le ','au ').replace('à les ','aux ')
# The connector bank covers justification, consequence, opposition and succession.
from banks_links import CAUSE,CONCESSIONS
for i,(effect,cause) in enumerate(CAUSE):
 if i<10:continue
 elif i<20:row=item(f'{cause[0].upper()+cause[1:]} ; ___, {effect[0].lower()+effect[1:]} (conséquence).','donc',['donc','pourtant','d’abord'])
 elif i<30:
  obstacle,action=CONCESSIONS[i];row=item(f'{obstacle[0].upper()+obstacle[1:]} ; ___, {action} (résultat inattendu).','pourtant',['pourtant','donc','car'])
 elif i<40:
  v,comp=REGULAR[i];row=item(f'___, je {present(v)[0]} {comp} (première étape).','D’abord',['D’abord','Ensuite','Enfin'])
 else:
  v,comp=REGULAR[i];row=item(f'___, je {present(v)[0]} {comp} (dernière étape).','Enfin',['D’abord','Ensuite','Enfin'])
 lesson('k2')['items'][i]=row
lesson('k2').update(label='Relier et organiser les idées',instruction='Complétez avec le connecteur correspondant au lien ou à l’étape indiqués.')
# Reported past announcements also practise time agreement.
for i in range(10):
 v,comp=REGULAR[i];isfuture=i%2==1
 ans=future(v,True)[2] if isfuture else imparfait(v)[2]
 lesson('j7')['items'][i]=item(f'Lina a dit qu’elle ___ ({v}) {comp} (discours direct : « Je '+(future(v)[0] if isfuture else present(v)[0])+f' {comp} »).',ans,[ans,present(v)[2],future(v)[2]])
# Standard subject elision in these connector and reported-speech sentences.
for sub in ('k2','j7'):
 for row in lesson(sub)['items']:
  row['prompt']=re.sub(r'\bje ([aàâeéèêiîoôuùhœ])',r'j’\1',row['prompt'])
# Make the type of a quoted grammatical word easy to read in the explanations.
# Elision also applies in quoted questions, where the subject has a capital J.
for l in LESSONS:
 for row in l['items']:
  row['prompt']=re.sub(r'\b([Jj])e ([aàâeéèêiîoôuùhœ])',r'\1’\2',row['prompt'])
  row['prompt']=re.sub(r'\bne ([aàâeéèêiîoôuùhœ])',r'n’\1',row['prompt'])
# Do not mark a spelling admitted by the orthographic rectifications as incorrect.
for row in lesson('l8')['items']:
 if row['answer']=='goût':row['options']=['goût','goùt','goüt']
for row in lesson('l13')['items']:
 if row['answer']=='assidûment':row['options']=['assidûment','assiduement','assidemment']
for row in lesson('l12')['items']:
 singular=row['prompt'].split('« ',1)[1].split(' »',1)[0];bare=singular.split(' ',1)[1]
 row['options']=distinct([row['answer'],'des '+bare,'des '+bare+'x','des '+bare+'es'])[:3]
# Give a grammatical person, rather than an ambiguous social hint, for imperatives.
for row in lesson('f11')['items']:
 row['prompt']=row['prompt'].replace('(à un ami)','(tu)').replace('(avec nous)','(nous)').replace('(à plusieurs personnes)','(vous)')
# The subjunctive pool includes visible irregular forms, not only regular -er forms.
for sub in ('k10','k13'):
 bank=[]
 for i,(v,comp) in enumerate(RE_CONTEXT):
  s,p=SUBJECTS[(i*3)%8];s=s.lower() if s in ('Je','Tu','Nous','Vous') else s
  trigger,smode=[('Il faut que ',True),('Il est certain que ',False),('Je souhaite que ',True),('Je sais que ',False),('Il est possible que ',True)][i%5] if sub=='k13' else ('Il faut que ',True)
  forms=subj(v) if smode else present(v);ans=forms[p]
  bank.append(item(trigger+sentence(s,ans,comp,v),ans,distinct([ans,present(v)[p],subj(v)[p],imparfait(v)[p],future(v)[p]])))
 lesson(sub)['items']=bank
# A gerund must accompany a credible simultaneous action by the same subject.
MAINS=[('faire','connaissance'),('prendre','des notes'),('choisir','mes vêtements'),('comparer','les annonces'),('apprendre','de nouveaux mots'),('découvrir','mon quartier'),('discuter','avec ma famille'),('vérifier','les pièces du dossier'),('consulter','le panneau des départs'),('profiter','de ma visite'),('découvrir','des sentiers'),('utiliser','des crayons'),('écouter','la radio'),('couper','l’électricité'),('éviter','le courant d’air'),('préparer','le repas'),('garder','les mains libres'),('admirer','les tableaux'),('nettoyer','l’atelier'),('montrer','le plan'),('revoir','les bases du cours'),('noter','des exemples'),('apprendre','à jouer en équipe'),('suivre','le rythme'),('écouter','la musique'),('préparer','ma visite'),('demander','le prix'),('discuter','avec mes amis'),('préparer','la fête'),('faire','rire le groupe'),('vérifier','le nom des rues'),('présenter','ma carte de lecteur'),('remercier','la bibliothécaire'),('prévoir','de quoi boire'),('indiquer','la direction'),('préparer','mon voyage'),('éviter','d’oublier l’information'),('confirmer','mon inscription'),('regarder','les affiches'),('surveiller','les voitures'),('suivre','le plan'),('profiter','du beau temps'),('faire','de l’exercice'),('libérer','mes mains'),('présenter','une pièce d’identité'),('préparer','mon examen'),('vérifier','un mot'),('rester','en silence'),('écouter','les avis'),('préparer','le programme')]
IRREG['apprendre']=['apprends','apprends','apprend','apprenons','apprenez','apprennent']
IRREG.update({'découvrir':['dé'+f for f in IRREG['ouvrir']],'revoir':['re'+f for f in IRREG['voir']],'prévoir':['pré'+f for f in IRREG['voir']],'suivre':['suis','suis','suit','suivons','suivez','suivent']})
for i,((v,comp),(main,maincomp)) in enumerate(zip(REGULAR,MAINS)):
 s,p=SUBJECTS[(i*3)%8];poss=('mon','ton','son','notre','votre','leur')[p];poss_f=('ma','ta','sa','notre','votre','leur')[p];poss_pl=('mes','tes','ses','nos','vos','leurs')[p]
 maincomp=maincomp.replace('mes ',poss_pl+' ').replace('mon ',poss+' ').replace('ma ',poss_f+' ')
 ger='en '+present(v)[3][:-3]+'ant';f=present(main)[p];start='J’' if s=='Je' and vowel(f) else s+' '
 lesson('j3')['items'][i]=item(start+f+' '+maincomp+' ___ ('+v+') '+comp+'.',ger,[ger,'en '+pp(v),'en '+v])
# Agreement with a reflexive pronoun includes indirect objects and reciprocal verbs.
REFLEXIVE_CASES=[
('Les voisines ___ (se parler) après le cours.','se sont parlé','se sont parlées','ont parlé'),
('Lina et Nadia ___ (se téléphoner) hier.','se sont téléphoné','se sont téléphonées','ont téléphoné'),
('Les voisins ___ (se sourire) dans le bus.','se sont souri','se sont souris','ont souri'),
('Les sœurs ___ (s’écrire) pendant les vacances.','se sont écrit','se sont écrites','ont écrit'),
('Les amies ___ (se donner) des conseils.','se sont donné','se sont données','ont donné'),
('Les voisines ___ (s’envoyer) des messages.','se sont envoyé','se sont envoyées','ont envoyé'),
('Les frères ___ (se rendre) les clés.','se sont rendu','se sont rendus','ont rendu'),
('Lina ___ (se laver) les mains avant le repas.','s’est lavé','s’est lavée','a lavé'),
('Paul ___ (se couper) le doigt.','s’est coupé','s’est coupés','a coupé'),
('Lina et Nadia ___ (se retrouver) devant la gare.','se sont retrouvées','se sont retrouvé','ont retrouvé')]
for i,(prompt,a,b,c) in enumerate(REFLEXIVE_CASES):lesson('pc-pronominaux')['items'][40+i]=item(prompt,a,[a,b,c])
# Advanced locations: direction, distance, depth, and an adverb without a repeated noun.
rows=[]
ROOMS=['garage','couloir','jardin','salon','bureau','parking','tiroir','placard','sac','carton']
for i,(noun,plur,g) in enumerate(NOUNS):
 noun,g={2:('plan','m'),3:('feuille','f'),20:('arrosoir','m'),21:('photo de classe','f'),22:('plat','m'),44:('cahier','m'),45:('maquette','f'),46:('peluche','f'),47:('fiche','f'),48:('jouet','m'),49:('album','m')}.get(i,(noun,g))
 a=noun_article(noun,g);subject=(a+('' if a.endswith('’') else ' ')+noun);subject=subject[0].upper()+subject[1:]
 mode=i%5
 if mode<2:
  direction='gauche' if mode==0 else 'droite';opposite='droite' if mode==0 else 'gauche';ref='le miroir' if g=='m' else 'la fenêtre'
  answer=f'à {direction} '+('du' if ref.startswith('le ') else 'de la');bare=ref.split(' ',1)[1]
  prompt=f'{subject} est ___ {bare} (côté opposé à la {opposite}).'
  opts=[answer,f'à {opposite} '+('du' if ref.startswith('le ') else 'de la'),'au-dessus '+('du' if ref.startswith('le ') else 'de la')]
 elif mode==2:
  answer='au-dessous du';prompt=f'{subject} est ___ repère (plus bas, sans contact).';opts=[answer,'au-dessus du','à côté du']
 elif mode==3:
  room=ROOMS[i//5];answer='au fond du';prompt=f'{subject} est ___ {room} (dans la partie la plus éloignée de l’entrée).';opts=[answer,'devant le','à côté du']
 else:
  inside=i%2==0;answer='dedans' if inside else 'dehors';prompt=f'{subject} est '+('à l’intérieur du' if inside else 'à l’extérieur du')+' local, donc '+('il' if g=='m' else 'elle')+' est ___ (sans répéter le lieu).';opts=['dedans','dehors','au-dessus']
 rows.append(item(prompt,answer,opts))
lesson('e6').update(label='Préciser le lieu ou la direction',items=rows)
# Quantified comparison elides de before a vowel.
for i,row in enumerate(lesson('f14')['items']):
 plural=NOUNS[i][1]
 if vowel(plural):
  row['answer']=row['answer'].replace(' de',' d’');row['options']=[o.replace(' de',' d’') for o in row['options']]
# Standard elision throughout the written prompts, including infinitive cues.
for l in LESSONS:
 for row in l['items']:
  row['prompt']=re.sub(r'\bde ([aàâeéèêiîoôuùœ]|h(?!aricot|aut|éros|onte))',r'd’\1',row['prompt'],flags=re.I)
  row['prompt']=re.sub(r'\bque ([aàâeéèêiîoôuùœ]|h(?!aricot|aut|éros|onte))',r'qu’\1',row['prompt'],flags=re.I)
# A written apostrophe joins the following word in the inline form.
for l in LESSONS:
 for row in l['items']:
  if row['answer'].endswith('’'):row['prompt']=row['prompt'].replace('___ ','___',1)

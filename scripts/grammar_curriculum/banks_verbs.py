from bank_common import *

present_bank('etre','Conjuguer être',ETRE_CONTEXT,'être')
present_bank('avoir','Conjuguer avoir',AVOIR_CONTEXT,'avoir')
present_bank('er','Conjuguer en -er',REGULAR)
present_bank('er-particuliers','Les formes particulières',SPECIAL)
present_bank('ir','Conjuguer en -ir',IR_CONTEXT)
present_bank('re-oir','Conjuguer en -re et -oir',RE_CONTEXT)
MODAL_CONTEXT=[( ('pouvoir','devoir','vouloir')[i%3],v+' '+comp) for i,(v,comp) in enumerate(REGULAR)]
present_bank('modaux','Conjuguer les trois verbes',MODAL_CONTEXT)
present_bank('f2','Demander et proposer',MODAL_CONTEXT[17:]+MODAL_CONTEXT[:17])

REFLEXIVE_BASE=[('lever','à sept heures'),('préparer','pour le cours'),('habiller','avant de sortir'),('laver','les mains'),('coucher','avant minuit'),
('reposer','après le travail'),('promener','près du lac'),('présenter','au groupe'),('installer','près de la fenêtre'),('réveiller','sans réveil'),
('brosser','les dents'),('coiffer','devant le miroir'),('dépêcher','pour prendre le train'),('arrêter','à la boulangerie'),('occuper','du jardin'),
('lever','avant le soleil'),('préparer','pour l’entretien'),('habiller','pour la fête'),('laver','le visage'),('coucher','après la lecture'),
('reposer','dans le salon'),('promener','en forêt'),('présenter','à la réception'),('installer','dans la nouvelle chambre'),('réveiller','avec la lumière'),
('brosser','les cheveux'),('coiffer','pour la photo'),('dépêcher','à la sortie du cours'),('arrêter','devant la poste'),('occuper','du chat'),
('lever','le dimanche matin'),('préparer','pour la visite'),('habiller','avec un manteau'),('laver','les pieds'),('coucher','plus tôt ce soir'),
('reposer','pendant la pause'),('promener','dans le quartier'),('présenter','au nouveau collègue'),('installer','dans le bus'),('réveiller','à huit heures'),
('brosser','les dents après le déjeuner'),('coiffer','avec un peigne'),('dépêcher','dans le couloir'),('arrêter','au marché'),('occuper','des plantes'),
('lever','sans faire de bruit'),('préparer','pour la randonnée'),('habiller','dans la chambre'),('laver','les bras'),('coucher','dans la petite chambre')]
for sub,label,offset in [('pronominaux','Conjuguer avec le pronom',0),('d2','Les gestes du quotidien',11)]:
 rows=[]
 for i,(v,comp) in enumerate(REFLEXIVE_BASE[offset:]+REFLEXIVE_BASE[:offset]):
  subject,person=SUBJECTS[(i*3)%8];answer=reflexive(v,person,present(v)[person]);forms=[reflexive(v,k,f) for k,f in enumerate(present(v))]
  rows.append(item(sentence(subject,answer,comp,'se '+v),answer,forms))
 add(sub,label,'Conjuguez le verbe pronominal au présent.',rows,'qcm-conj')

# Every prompt asks for one complete negative verbal group.
rows=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,person=SUBJECTS[(i*3)%8];f=present(v)[person];answer=('n’' if vowel(f) else 'ne ')+f+' pas'
 rows.append(item(sentence(subject,answer,comp,v),answer,[f, 'pas '+f,answer]))
add('a8','Former la négation','Complétez à la forme négative avec ne… pas.',rows)

AVOIR_ONLY=[r for r in REGULAR if r[0] not in ('arriver','rester')]+RE_CONTEXT[:2]
ETRE_ACTIONS=[('arriver','à la gare'),('partir','avant le déjeuner'),('entrer','dans la salle'),('rester','chez sa sœur'),('venir','à la réunion'),
('retourner','au bureau'),('rentrer','avant la nuit'),('sortir','du musée'),('monter','au premier étage'),('descendre','à la cave')]
ETRE_SUBJECTS=[('Lina','f',False,2),('Paul','m',False,2),('Les voisines','f',True,5),('Les voisins','m',True,5),
('Nous, les deux étudiantes,','f',True,3),('Vous, les deux frères,','m',True,4)]
for sub,label,tense in [('pc-avoir','Le passé composé avec avoir','pc'),('pqp','Former le plus-que-parfait','pqp'),
                      ('futur-anterieur','Former le futur antérieur','fa'),('j10','Former le conditionnel passé','cp')]:
 rows=[]
 for i,(v,comp) in enumerate(AVOIR_ONLY):
  subject,person=SUBJECTS[(i*3)%8];forms=past_forms(v,tense);answer=forms[person]
  prefix='Hier, ' if tense=='pc' else 'La veille, ' if tense=='pqp' else 'Avant votre arrivée, ' if tense=='fa' else 'Avec votre aide, '
  rows.append(item(sentence(subject,answer,comp,v,leading=prefix),answer,forms))
 add(sub,label,'Conjuguez le verbe indiqué '+{'pc':'au passé composé avec avoir','pqp':'au plus-que-parfait','fa':'au futur antérieur','cp':'au conditionnel passé'}[tense]+'.',rows,'qcm-conj')

ETRE_COMPLEMENTS={
'arriver':['à la gare','chez le médecin','au cours','au rendez-vous','à l’aéroport'],
'partir':['en vacances','en formation','pour la promenade','avant ses collègues','avec une valise'],
'entrer':['dans la mairie','au musée','dans le bureau','par la porte latérale','dans la salle de concert'],
'rester':['à la maison','près de l’enfant','dans la salle d’attente','chez ses parents','au chalet'],
'venir':['à l’anniversaire','en voiture','chez le coiffeur','au marché','chez un ami'],
'retourner':['à la bibliothèque','dans son village','au guichet','à la réception','à l’épicerie'],
'rentrer':['de l’école','à vélo','après la randonnée','du travail','à l’appartement'],
'sortir':['du cinéma','du parking','du garage','du logement','du théâtre'],
'monter':['au premier étage','dans le bus','sur le balcon','au chalet','à la montagne'],
'descendre':['à la cave','du train','du vélo','au rez-de-chaussée','vers le lac']}
rows=[]
for i in range(50):
 v,basecomp=ETRE_ACTIONS[i%10];subject,gender,plural,person=ETRE_SUBJECTS[(i*5)%6]
 comp=ETRE_COMPLEMENTS[v][i//10]
 forms=past_forms(v,aux='être',gender=gender,plural=plural);answer=forms[person]
 other_gender=past_forms(v,aux='être',gender='m' if gender=='f' else 'f',plural=plural)[person]
 rows.append(item(sentence(subject,answer,comp,v),answer,[other_gender,forms[0] if person!=0 else forms[3]]))
add('pc-etre','Le passé composé avec être','Conjuguez au passé composé avec être et accordez le participe.',rows,'qcm-conj')

for sub,label,tense in [('imparfait','Conjuguer à l’imparfait','imp'),('futur-simple','Conjuguer au futur simple','fut'),
                      ('j8','Conjuguer au conditionnel','cond')]:
 rows=[]
 for i,(v,comp) in enumerate(REGULAR):
  subject,person=SUBJECTS[(i*3)%8];forms=imparfait(v) if tense=='imp' else future(v,tense=='cond');answer=forms[person]
  rows.append(item(sentence(subject,answer,comp,v),answer,forms))
 add(sub,label,'Conjuguez le verbe indiqué '+{'imp':'à l’imparfait','fut':'au futur simple','cond':'au conditionnel présent'}[tense]+'.',rows,'qcm-conj')

for sub,label,helper,group in [('futur-proche','Annoncer un projet','aller','futur'),('j1','Une action en cours','être','progressif'),('j2','Une action juste terminée','venir','recent')]:
 rows=[]
 for i,(v,comp) in enumerate(REGULAR):
  subject,person=SUBJECTS[(i*3)%8];middle=' en train de ' if group=='progressif' else ' de ' if group=='recent' else ' '
  if vowel(v) and group!='futur':middle=middle.replace('de ','d’')
  forms=[f+middle+v for f in present(helper)];answer=forms[person]
  rows.append(item(sentence(subject,answer,comp,v),answer,forms))
 add(sub,label,'Complétez avec '+{'futur':'aller au présent + infinitif','progressif':'être en train de + infinitif','recent':'venir de + infinitif'}[group]+'.',rows)

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,person=SUBJECTS[(i*3)%8];ger='en '+('étant' if v=='être' else present(v)[3][:-3]+'ant')
 if v in ('parler','chanter','raconter','discuter','expliquer'):
  main=present('prendre')[person]+' des notes'
 else:
  possessive=('ma','ta','sa','notre','votre','leur')[person]
  main=present('raconter')[person]+' '+possessive+' journée'
 prompt=f'{subject} {main} ___ ({v}) {comp}.'
 rows.append(item(prompt,ger,[ger,'en '+pp(v),'en '+v]))
add('j3','Former le gérondif','Complétez avec en et le participe présent du verbe indiqué.',rows)

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,person=SUBJECTS[(i*3)%8];forms=subj(v);answer=forms[person]
 lead=('Il faut que ','Je souhaite que ','Je suis content que ','Il est important que ')[i%4]
 if subject=='Je':subject='je'
 elif subject[0].isupper() and subject in ('Tu','Nous','Vous'):subject=subject.lower()
 if vowel(subject):lead=lead[:-1]+'’'
 rows.append(item(lead+sentence(subject,answer,comp,v),answer,forms))
add('k10','Employer le subjonctif','Conjuguez le verbe indiqué au subjonctif présent.',rows,'qcm-conj')

rows=[]
for i,(v,comp) in enumerate(AVOIR_ONLY):
 subject,person=SUBJECTS[(i*3)%8];subject=subject.lower() if subject in ('Je','Tu','Nous','Vous') else subject
 forms=[a+' '+pp(v) for a in subj('avoir')];answer=forms[person]
 lead='Il est important que '
 rows.append(item(lead+sentence(subject,answer,comp,v),answer,forms))
add('k12','Former le subjonctif passé','Conjuguez au subjonctif passé avec avoir.',rows,'qcm-conj')

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 person=(1,3,4)[i%3];form=present(v)[person]
 if person==1 and v.endswith('er'):form=form[:-1] if form.endswith('s') else form
 options=[present(v)[person],present(v)[0],present(v)[4],v]
 rows.append(item('___ ('+v+') '+comp+(' (à un ami).' if person==1 else ' (avec nous).' if person==3 else ' (à plusieurs personnes).'),form,options))
add('f11','Donner une consigne','Conjuguez à l’impératif selon la personne indiquée.',rows,'qcm-conj')

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,person=SUBJECTS[(i*3)%8];modal=('devoir','pouvoir')[i%2];forms=future(modal,True);answer=forms[person]
 rows.append(item(sentence(subject,answer,v+' '+comp,modal),answer,forms))
add('f10','Donner un conseil poli','Conjuguez devoir ou pouvoir au conditionnel présent.',rows,'qcm-conj')

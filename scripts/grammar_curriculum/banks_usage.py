from bank_common import *

# Fifty independent questions, with a specified construction.
rows=[];openrows=[]
Q_CONTEXT=[('Où','le lieu'),('Quand','le moment'),('Comment','la manière'),('Pourquoi','la raison'),('Avec qui','la personne qui accompagne')]
for i,(v,comp) in enumerate(REGULAR):
 subject,person=SUBJECTS[(i*3)%8];f=present(v)[person]
 # Est-ce que is the single requested structure, not an arbitrary preferred question.
 nextsub=subject.lower() if subject in ('Je','Tu','Nous','Vous','Les voisins','Les voisines') else subject
 q='Est-ce qu’' if vowel(nextsub) else 'Est-ce que '
 rows.append(item(f'___{nextsub} {f} {comp} ?',q.rstrip(),['Est-ce que','Est-ce qu’','Est que']))
 wh,meaning=Q_CONTEXT[i%5]
 # Do not ask "où habiter près du marché": remove location complement for where questions.
 rest='' if wh=='Où' and v in ('habiter','arriver','travailler','rester') else ' '+comp
 openrows.append(item(f'___ est-ce que {nextsub} {f}{rest} (demandez {meaning}) ?',wh,[r[0] for r in Q_CONTEXT]))
add('c1','Poser une question','Complétez avec est-ce que ou est-ce qu’ selon le mot suivant.',rows)
add('c2','Choisir le mot interrogatif','Complétez avec le mot interrogatif qui demande l’information indiquée.',openrows)

ACTIVITIES=[('du','vélo'),('de la','natation'),('de l’','escalade'),('des','étirements'),('du','football'),('de la','danse'),('de l’','aviron'),('des','exercices de respiration'),('du','tennis'),('de la','gymnastique'),('de l’','équitation'),('des','promenades'),('du','jogging'),('de la','randonnée'),('de l’','aquagym'),('des','puzzles'),('du','ski'),('de la','peinture'),('de l’','athlétisme'),('des','travaux manuels'),('du','yoga'),('de la','couture'),('de l’','aïkido'),('des','mots croisés'),('du','basket'),('de la','poterie'),('de l’','haltérophilie'),('des','maquettes'),('du','judo'),('de la','boxe'),('de l’','improvisation théâtrale'),('des','jeux de société'),('du','karaté'),('de la','marche'),('de l’','aérobic'),('des','exercices d’équilibre'),('du','patinage'),('de la','plongée'),('de l’','escrime'),('des','activités créatives'),('du','chant'),('de la','cuisine'),('de l’','origami'),('des','dessins'),('du','jardinage'),('de la','photographie'),('de l’','accrobranche'),('des','recherches historiques'),('du','bricolage'),('de la','musique')]
rows=[]
for i,(a,n) in enumerate(ACTIVITIES):
 subject,p=SUBJECTS[i%8];rows.append(item(f'{subject} {present("faire")[p]} ___ {n}.',a,['du','de la','de l’','des']))
add('d1','Parler de ses activités','Complétez faire avec du, de la, de l’ ou des.',rows)

rows=[]
for i,(v,comp) in enumerate(REGULAR):
 who=('moi','toi','lui','elle','nous','vous','eux','elles')[i%8];cue=('je','tu','Paul','Lina','nous','vous','les voisins','les voisines')[i%8]
 subject,p=SUBJECTS[(i+3)%8]
 rows.append(item(f'{subject} {present(v)[p]} {comp} avec ___ ({cue}).',who,['moi','toi','lui','elle','nous','vous','eux','elles']))
add('d3','Choisir le pronom tonique','Remplacez l’indication entre parenthèses par un pronom tonique.',rows)

SPATIAL=[('Le sac','la table','sous','plus bas que'),('La veste','la chaise','sur','en contact avec le dessus de'),('Le vélo','le garage','dans','à l’intérieur de'),('Le chat','la porte','devant','du côté de l’entrée de'),('Le jardin','la maison','derrière','du côté opposé à l’entrée de'),('Le cinéma','la poste','à côté de','juste à droite de'),('Le banc','les arbres','entre','au milieu des deux'),('La lampe','le lit','au-dessus de','plus haut que'),('Le parking','la gare','en face de','de l’autre côté de la rue par rapport à'),('Le miroir','la fenêtre','près de','à une petite distance de'),('Les chaussures','le meuble','sous','plus bas que'),('Le vase','la commode','sur','en contact avec le dessus de'),('Le passeport','le tiroir','dans','à l’intérieur de'),('Le bus','la mairie','devant','du côté de l’entrée de'),('La cour','l’école','derrière','du côté opposé à l’entrée de'),('La pharmacie','la banque','à côté de','juste à gauche de'),('La valise','les fauteuils','entre','au milieu des deux'),('L’horloge','le tableau','au-dessus de','plus haut que'),('Le café','le musée','en face de','de l’autre côté de la rue par rapport à'),('L’arrêt','l’hôpital','près de','à une petite distance de'),('Le tapis','le bureau','sous','plus bas que'),('Le téléphone','le canapé','sur','en contact avec le dessus de'),('Le fromage','le réfrigérateur','dans','à l’intérieur de'),('La file','le guichet','devant','du côté de l’entrée de'),('Le potager','l’immeuble','derrière','du côté opposé à l’entrée de'),('Le théâtre','le restaurant','à côté de','juste à droite de'),('La fontaine','les statues','entre','au milieu des deux'),('L’étagère','le lavabo','au-dessus de','plus haut que'),('La librairie','la crèche','en face de','de l’autre côté de la rue par rapport à'),('Le chalet','le lac','près de','à une petite distance de'),('La caisse','le comptoir','sous','plus bas que'),('Le livre','le tabouret','sur','en contact avec le dessus de'),('Les clés','le sac à main','dans','à l’intérieur de'),('Le taxi','l’hôtel','devant','du côté de l’entrée de'),('Le local à vélos','la résidence','derrière','du côté opposé à l’entrée de'),('La boulangerie','l’épicerie','à côté de','juste à gauche de'),('La cuisine','les chambres','entre','au milieu des deux'),('La pendule','la cheminée','au-dessus de','plus haut que'),('La piscine','le stade','en face de','de l’autre côté de la rue par rapport à'),('La station','l’aéroport','près de','à une petite distance de'),('Le chien','le fauteuil','sous','plus bas que'),('Le journal','le buffet','sur','en contact avec le dessus de'),('La lettre','l’enveloppe','dans','à l’intérieur de'),('Le livreur','le portail','devant','du côté de l’entrée de'),('Le verger','la ferme','derrière','du côté opposé à l’entrée de'),('Le parking à vélos','la réception','à côté de','juste à droite de'),('Le passage','les bâtiments','entre','au milieu des deux'),('Le balcon','la terrasse','au-dessus de','plus haut que'),('Le kiosque','la sortie','en face de','de l’autre côté de la rue par rapport à'),('Le refuge','le sommet','près de','à une petite distance de')]
def contract_de(noun):
 return 'du '+noun[3:] if noun.startswith('le ') else 'des '+noun[4:] if noun.startswith('les ') else 'de '+noun
for sub,label,offset in [('e1','Situer un objet',0),('e6','Préciser une position',23)]:
 rows=[]
 for obj,ref,prep,clue in SPATIAL[offset:]+SPATIAL[:offset]:
  tail=contract_de(ref) if prep.endswith('de') else ref
  prep2=prep[:-3] if prep.endswith(' de') else prep
  # Contractions belong to the answer, so the visible reference remains a bare noun.
  article=ref.split(' ',1)[0] if ' ' in ref else ref
  if prep.endswith('de'):
   bare=ref[3:] if ref.startswith(('le ','la ')) else ref[4:] if ref.startswith('les ') else ref[2:] if ref.startswith('l’') else ref
   end='du' if ref.startswith('le ') else 'des' if ref.startswith('les ') else 'de la' if ref.startswith('la ') else 'de l’'
   answer=prep[:-2]+end
   prompt=f'{obj} '+('sont' if obj.startswith('Les ') else 'est')+f' ___ {bare} (position : {clue} ce repère).'
  else:
   answer=prep;prompt=f'{obj} '+('sont' if obj.startswith('Les ') else 'est')+f' ___ {ref} (position : {clue} ce repère).'
  rows.append(item(prompt,answer,[answer,'loin de' if prep!='près de' else 'au-dessous de','autour de']))
 add(sub,label,'Complétez avec la position décrite entre parenthèses, en ajoutant l’article nécessaire.',rows)

# Explicit calendar expressions vary by structure, not random dates.
MOMENTS=[('à','huit heures'),('en','janvier'),('au','printemps'),('en','été'),('en','automne'),('en','hiver'),('le','lundi'),('en','février'),('à','midi'),('le','matin'),('en','mars'),('le','soir'),('en','avril'),('à','minuit'),('en','mai'),('le','mardi'),('en','juin'),('le','mercredi'),('en','juillet'),('à','neuf heures et demie'),('en','août'),('le','jeudi'),('en','septembre'),('le','vendredi'),('en','octobre'),('le','samedi'),('en','novembre'),('le','dimanche'),('en','décembre'),('le','week-end'),('à','dix heures'),('en','2027'),('en','2030'),('au','mois de juin'),('à','la fin du cours'),('au','début du repas'),('en','fin de journée'),('à','la pause'),('au','milieu de la nuit'),('en','début de semaine'),('le','lendemain'),('le','jour du départ'),('à','la rentrée'),('au','lever du soleil'),('au','coucher du soleil'),('à','la tombée de la nuit'),('en','début de matinée'),('à','l’aube'),('en','fin d’après-midi'),('à','la sortie de l’école')]
rows=[]
for i,(a,n) in enumerate(MOMENTS):
 v,comp=REGULAR[i];subject,p=SUBJECTS[i%8];rows.append(item(f'{subject} {present(v)[p]} {comp} ___ {n}.',a,['à','en','au','le']))
add('e2','Situer dans le temps','Complétez l’expression du moment avec à, en, au ou le.',rows)

rows=[];freq=[];order=[]
for i,(v,comp) in enumerate(REGULAR):
 subject,p=SUBJECTS[(i*3)%8];f=present(v)[p];key=i%5
 cue=[('depuis','action commencée et toujours en cours'),('pendant','durée totale d’une action terminée'),('en','temps nécessaire pour finir'),('dans','délai avant une action future'),('pour','durée prévue')][key]
 # Use an appropriate tense and exact time span for each use.
 forms=past_forms(v) if key in (1,2) else future(v) if key==3 else present(v)
 if v in ('arriver','rester') and key in (1,2):forms=past_forms(v,aux='être',gender='f' if subject in ('Lina','Les voisines') else 'm',plural=p==5)
 f=forms[p];span=('deux mois','deux heures','une heure','trois jours','une semaine')[key]
 if key==4:
  prompt=f'Le programme prévoit que {subject.lower() if subject in ("Je","Tu","Nous","Vous") else subject} {f} {comp} ___ {span} (durée prévue).'
 else:prompt=sentence(subject,f,comp).replace('___',f)[:-1]+f' ___ {span} ({cue[1]}).'
 rows.append(item(prompt,cue[0],['depuis','pendant','en','dans','pour']))
 adverb,clue=[('toujours','à chaque occasion'),('souvent','de nombreuses fois'),('parfois','de temps en temps'),('rarement','très peu souvent'),('jamais','à aucune occasion')][key]
 neg='ne ' if not vowel(f) else 'n’'
 # Clear frequency cue makes inline response determinate.
 if adverb=='jamais':prompt=sentence(subject,'ne '+present(v)[p],comp).replace('___','ne '+present(v)[p]+' ___')
 else:prompt=sentence(subject,present(v)[p],comp).replace('___',present(v)[p]+' ___')
 freq.append(item(prompt[:-1]+f' (fréquence : {clue}).',adverb,['toujours','souvent','parfois','rarement','jamais']))
 link,clue=[('D’abord','première étape'),('Ensuite','étape qui suit'),('Enfin','dernière étape'),('Avant de','action à faire auparavant'),('Après avoir','action déjà terminée')][key]
 if key<3:prompt=f'___, {subject.lower() if subject in ("Je","Tu","Nous","Vous","Les voisins","Les voisines") else subject} {present(v)[p]} {comp} ({clue}).'
 elif key==3:prompt=f'___ {v} {comp}, je vérifie le programme ({clue}).'
 else:prompt=f'___ {pp(v)} {comp}, je note le résultat ({clue}).' if v not in ('arriver','rester') else f'___ terminé le trajet vers la gare, je vérifie le programme ({clue}).'
 order.append(item(prompt,link,['D’abord','Ensuite','Enfin','Avant de','Après avoir']))
add('e3','Exprimer une durée','Complétez selon le sens de la durée indiqué entre parenthèses.',rows)
add('e4','Dire la fréquence','Complétez avec l’adverbe correspondant à la fréquence indiquée.',freq)
add('e5','Organiser les étapes','Complétez avec le repère correspondant à l’étape indiquée.',order)

rows=[];agree=[]
for i,(v,comp) in enumerate(REGULAR):
 acceptance=i%2==0
 answer='Avec plaisir' if acceptance else 'Non merci'
 rows.append(item(f'Pour '+('accepter' if acceptance else 'refuser')+f' l’invitation à {v} {comp}, je réponds « ___ ».',answer,['Avec plaisir','Non merci','De rien']))
 yes=i%2==0;answer='d’accord' if yes else 'pas d’accord'
 agree.append(item(f'Concernant l’idée de {v} {comp}, je suis ___ (avis '+('favorable' if yes else 'défavorable')+').',answer,['d’accord','pas d’accord','en retard']))
add('f3','Accepter ou refuser','Complétez avec une réponse qui correspond à votre intention.',rows)
add('k1','Donner son avis','Complétez pour exprimer l’avis indiqué.',agree)

WEATHER=[('Les gouttes tombent sur les vitres','pleut'),('Les flocons couvrent les toits','neige'),('Le ciel est sans nuages et les rayons brillent','fait soleil'),('Les arbres se plient sous les rafales','y a du vent'),('On ne voit pas la route à cause d’un nuage au sol','y a du brouillard'),('Le thermomètre indique trente-cinq degrés','fait chaud'),('Le thermomètre indique moins dix degrés','fait froid'),('Des éclairs illuminent le ciel','y a de l’orage'),('De petits morceaux de glace tombent sur le jardin','grêle'),('Une couche de glace se forme sur les flaques','gèle'),('Les parapluies sont mouillés à la sortie de l’école','pleut'),('Les enfants fabriquent un bonhomme avec les flocons','neige'),('Nous mettons de la crème pour nous protéger des rayons','fait soleil'),('Le chapeau de Paul s’envole','y a du vent'),('La brume cache les bateaux','y a du brouillard'),('Les habitants cherchent de l’ombre pour se rafraîchir','fait chaud'),('Nous gardons nos gants malgré le chauffage du bus','fait froid'),('Le tonnerre fait trembler les fenêtres','y a de l’orage'),('Des billes de glace frappent la voiture','grêle'),('L’eau du bassin devient solide pendant la nuit','gèle'),('L’eau coule des gouttières pendant l’averse','pleut'),('La poudre blanche recouvre la piste de ski','neige'),('Les ombres des arbres sont nettes sur le chemin','fait soleil'),('Les feuilles volent autour de la fontaine','y a du vent'),('Les conducteurs allument les feux antibrouillard','y a du brouillard'),('Nous ouvrons toutes les fenêtres pour chercher de la fraîcheur','fait chaud'),('Les passants portent une écharpe et un bonnet','fait froid'),('Les éclairs sont suivis de coups de tonnerre','y a de l’orage'),('Les fruits sont abîmés par des grains de glace','grêle'),('Le pare-brise se couvre de gel','gèle'),('Une pluie fine mouille les bancs du parc','pleut'),('Les flocons fondent sur mon manteau','neige'),('Le ciel bleu permet aux panneaux solaires de bien fonctionner','fait soleil'),('Les volets claquent sous les rafales','y a du vent'),('Le sommet disparaît dans une brume épaisse','y a du brouillard'),('La chaleur oblige les sportifs à boire très souvent','fait chaud'),('Nous avons besoin de vêtements épais dehors','fait froid'),('Un éclair frappe un arbre près de la ferme','y a de l’orage'),('Les grêlons rebondissent sur la terrasse','grêle'),('Le sol humide durcit sous le gel','gèle'),('Les essuie-glaces chassent les gouttes sur l’autoroute','pleut'),('La neige tombe sans s’arrêter sur le village','neige'),('Le soleil éclaire les tables de la terrasse','fait soleil'),('Les drapeaux flottent fortement sur la place','y a du vent'),('Un voile blanc empêche de voir le phare','y a du brouillard'),('La température élevée fait fondre les glaces très vite','fait chaud'),('Le froid nous pousse à rentrer nous réchauffer','fait froid'),('Le ciel noir est traversé d’éclairs','y a de l’orage'),('Une averse de grêle frappe le toit de la serre','grêle'),('Une fine pellicule de glace couvre l’étang','gèle')]
rows=[item(f'{clue} : il ___.',ans,[ans,'fait de la neige','est la pluie']) for clue,ans in WEATHER]
add('f4','Décrire la météo','Complétez la phrase avec l’expression météorologique correspondant à l’indice.',rows)

rows=[]
for i,(noun,plur,g) in enumerate(NOUNS):
 mode=i%3
 if mode==0:prompt=f'___ un {noun} près de la porte (présence).';answer='Il y a';prompt=prompt.replace('un '+noun,('une ' if g=='f' else 'un ')+noun)
 elif mode==1:prompt=f'___ '+('la' if g=='f' else 'le')+f' {noun} de Paul (identification).';answer='C’est';prompt=prompt.replace(('la' if g=='f' else 'le')+' '+noun,'l’'+noun) if vowel(noun) else prompt
 else:prompt=f'Ce {noun}' if g=='m' and not vowel(noun) else f'Cet {noun}' if g=='m' else f'Cette {noun}';prompt+=', ___ '+('utile' if i%2 else 'disponible')+' (description avec un pronom).';answer='il est' if g=='m' else 'elle est'
 rows.append(item(prompt,answer,[answer,'C’est' if mode!=1 else 'Il est','Il y a' if mode!=0 else 'Il est']))
add('f5','Identifier ou décrire','Choisissez c’est, il est, elle est ou il y a selon l’indication.',rows)

# Physical description: all fifty cues concern a person, body, hair or clothing.
PHYSICAL=[('les cheveux','brun','bruns'),('les yeux','vert','verts'),('la barbe','court','courte'),('la moustache','fin','fine'),('la silhouette','mince','mince'),('le visage','rond','rond'),('la peau','clair','claire'),('les sourcils','épais','épais'),('les mains','petit','petites'),('les bras','long','longs'),('les cheveux','blond','blonds'),('les yeux','bleu','bleus'),('la barbe','blanc','blanche'),('la moustache','noir','noire'),('la silhouette','sportif','sportive'),('le visage','ovale','ovale'),('la peau','bronzé','bronzée'),('les sourcils','fin','fins'),('les mains','grand','grandes'),('les jambes','long','longues'),('les cheveux','court','courts'),('les yeux','noir','noirs'),('la barbe','long','longue'),('la frange','droit','droite'),('la taille','moyen','moyenne'),('le sourire','doux','doux'),('la peau','foncé','foncée'),('les cheveux','bouclé','bouclés'),('les épaules','large','larges'),('les lunettes','rond','rondes'),('les cheveux','raide','raides'),('les yeux','marron','marron'),('la coiffure','simple','simple'),('la voix','grave','grave'),('la posture','droit','droite'),('le front','large','large'),('les joues','rose','roses'),('les cheveux','roux','roux'),('les bottes','haut','hautes'),('les boucles d’oreilles','doré','dorées'),('les cheveux','gris','gris'),('les yeux','clair','clairs'),('la barbe','épais','épaisse'),('la tresse','long','longue'),('la démarche','lent','lente'),('le menton','pointu','pointu'),('les lèvres','fin','fines'),('les cheveux','ondulé','ondulés'),('les baskets','blanc','blanches'),('les vêtements','sombre','sombres')]
rows=[]
for n,adj,ans in PHYSICAL:
 rows.append(item('Cette personne a '+n+' ___ ('+adj+').',ans,[ans,adj+'s',adj+'e',adj+'es',adj]))
add('description-physique','Décrire une personne','Accordez l’adjectif qui décrit la personne.',rows)

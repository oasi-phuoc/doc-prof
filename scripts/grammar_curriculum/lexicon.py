"""Authored contexts and explicit French forms for the new sentence banks."""
SUBJECTS=[('Je',0),('Tu',1),('Lina',2),('Paul',2),('Nous',3),('Vous',4),('Les voisins',5),('Les voisines',5)]
IRREG={
'être':['suis','es','est','sommes','êtes','sont'], 'avoir':['ai','as','a','avons','avez','ont'],
'aller':['vais','vas','va','allons','allez','vont'], 'faire':['fais','fais','fait','faisons','faites','font'],
'dire':['dis','dis','dit','disons','dites','disent'],'venir':['viens','viens','vient','venons','venez','viennent'],
'tenir':['tiens','tiens','tient','tenons','tenez','tiennent'],'lire':['lis','lis','lit','lisons','lisez','lisent'],
'écrire':['écris','écris','écrit','écrivons','écrivez','écrivent'],'boire':['bois','bois','boit','buvons','buvez','boivent'],
'savoir':['sais','sais','sait','savons','savez','savent'],'voir':['vois','vois','voit','voyons','voyez','voient'],
'pouvoir':['peux','peux','peut','pouvons','pouvez','peuvent'],'vouloir':['veux','veux','veut','voulons','voulez','veulent'],
'devoir':['dois','dois','doit','devons','devez','doivent'],'prendre':['prends','prends','prend','prenons','prenez','prennent'],
'mettre':['mets','mets','met','mettons','mettez','mettent'],'sortir':['sors','sors','sort','sortons','sortez','sortent'],
'partir':['pars','pars','part','partons','partez','partent'],'dormir':['dors','dors','dort','dormons','dormez','dorment'],
'ouvrir':['ouvre','ouvres','ouvre','ouvrons','ouvrez','ouvrent'],'offrir':['offre','offres','offre','offrons','offrez','offrent'],
'couvrir':['couvre','couvres','couvre','couvrons','couvrez','couvrent'],'accueillir':['accueille','accueilles','accueille','accueillons','accueillez','accueillent'],
'courir':['cours','cours','court','courons','courez','courent'],'vivre':['vis','vis','vit','vivons','vivez','vivent'],
'connaître':['connais','connais','connaît','connaissons','connaissez','connaissent'],'croire':['crois','crois','croit','croyons','croyez','croient'],
'recevoir':['reçois','reçois','reçoit','recevons','recevez','reçoivent'],
'envoyer':['envoie','envoies','envoie','envoyons','envoyez','envoient'],'appeler':['appelle','appelles','appelle','appelons','appelez','appellent'],
'jeter':['jette','jettes','jette','jetons','jetez','jettent'],'acheter':['achète','achètes','achète','achetons','achetez','achètent'],
'préférer':['préfère','préfères','préfère','préférons','préférez','préfèrent'],'payer':['paie','paies','paie','payons','payez','paient'],
'manger':['mange','manges','mange','mangeons','mangez','mangent'],'nager':['nage','nages','nage','nageons','nagez','nagent'],
'commencer':['commence','commences','commence','commençons','commencez','commencent'],
'placer':['place','places','place','plaçons','placez','placent'],'lever':['lève','lèves','lève','levons','levez','lèvent'],
'promener':['promène','promènes','promène','promenons','promenez','promènent'],'nettoyer':['nettoie','nettoies','nettoie','nettoyons','nettoyez','nettoient'],
'espérer':['espère','espères','espère','espérons','espérez','espèrent'],'geler':['gèle','gèles','gèle','gelons','gelez','gèlent'],
}
FUTURE={'être':'ser','avoir':'aur','aller':'ir','faire':'fer','venir':'viendr','tenir':'tiendr','voir':'verr',
'savoir':'saur','pouvoir':'pourr','vouloir':'voudr','devoir':'devr','recevoir':'recevr','envoyer':'enverr',
'appeler':'appeller','jeter':'jetter','acheter':'achèter','préférer':'préférer','lever':'lèver','promener':'promèner','nettoyer':'nettoier'}
PP={'être':'été','avoir':'eu','faire':'fait','dire':'dit','prendre':'pris','mettre':'mis','voir':'vu','savoir':'su',
'pouvoir':'pu','vouloir':'voulu','devoir':'dû','venir':'venu','tenir':'tenu','lire':'lu','écrire':'écrit','boire':'bu',
'vivre':'vécu','connaître':'connu','croire':'cru','recevoir':'reçu','ouvrir':'ouvert','offrir':'offert','couvrir':'couvert',
'courir':'couru','partir':'parti','sortir':'sorti','dormir':'dormi','naître':'né','mourir':'mort'}
SUBJ={'être':['sois','sois','soit','soyons','soyez','soient'],'avoir':['aie','aies','ait','ayons','ayez','aient'],
'aller':['aille','ailles','aille','allions','alliez','aillent'],'faire':['fasse','fasses','fasse','fassions','fassiez','fassent'],
'pouvoir':['puisse','puisses','puisse','puissions','puissiez','puissent'],'savoir':['sache','saches','sache','sachions','sachiez','sachent'],
'vouloir':['veuille','veuilles','veuille','voulions','vouliez','veuillent']}

def present(v):
 if v in IRREG:return IRREG[v]
 if v.endswith('er'):
  stem=v[:-2];forms=[stem+s for s in ('e','es','e','ons','ez','ent')]
  if v.endswith('ger'):forms[3]=stem+'eons'
  if v.endswith('cer'):forms[3]=stem[:-1]+'çons'
  return forms
 if v in ('finir','choisir','réussir','grandir','rougir','agir','remplir','réfléchir','réunir','obéir','ralentir','bâtir','avertir'):
  return [v[:-2]+s for s in ('is','is','it','issons','issez','issent')]
 if v.endswith('re'):return [v[:-2]+s for s in ('s','s','','ons','ez','ent')]
 raise ValueError('Missing present forms '+v)

def imparfait(v):
 stem='ét' if v=='être' else present(v)[3][:-3]
 out=[]
 for ending in ('ais','ais','ait','ions','iez','aient'):
  base=stem
  if ending.startswith('i') and v.endswith('ger') and base.endswith('ge'):base=base[:-1]
  if ending.startswith('i') and v.endswith('cer') and base.endswith('ç'):base=base[:-1]+'c'
  out.append(base+ending)
 return out

def future(v,conditionnel=False):
 stem=FUTURE.get(v,v[:-1] if v.endswith('re') else v)
 return [stem+s for s in (('ais','ais','ait','ions','iez','aient') if conditionnel else ('ai','as','a','ons','ez','ont'))]

def pp(v):
 if v in PP:return PP[v]
 if v.endswith('er'):return v[:-2]+'é'
 if v.endswith('ir'):return v[:-2]+'i'
 if v.endswith('re'):return v[:-2]+'u'
 raise ValueError('Missing participle '+v)

def subj(v):
 if v in SUBJ:return SUBJ[v]
 forms=present(v);stem=forms[5][:-3];plural=forms[3][:-3]
 if v.endswith('ger') and plural.endswith('ge'):plural=plural[:-1]
 if v.endswith('cer') and plural.endswith('ç'):plural=plural[:-1]+'c'
 return [stem+'e',stem+'es',stem+'e',plural+'ions',plural+'iez',stem+'ent']

REGULAR=[
('parler','avec le voisin'),('écouter','les consignes'),('regarder','la météo'),('chercher','un logement'),('travailler','à la bibliothèque'),
('habiter','près du marché'),('préparer','la salade'),('demander','une attestation'),('arriver','à la gare'),('rester','chez ma sœur'),
('aimer','la randonnée'),('dessiner','un paysage'),('cuisiner','un repas simple'),('réparer','la sonnette'),('fermer','la fenêtre'),
('laver','les légumes'),('porter','un sac léger'),('visiter','le musée'),('ranger','les outils'),('expliquer','le trajet'),
('aider','la nouvelle élève'),('étudier','le vocabulaire'),('jouer','au basket'),('chanter','avec la chorale'),('danser','à la fête'),
('réserver','une place'),('commander','un sandwich'),('partager','le dessert'),('inviter','les collègues'),('raconter','une anecdote'),
('dessiner','le plan du quartier'),('emprunter','un roman'),('rapporter','le livre'),('apporter','une gourde'),('montrer','la sortie'),
('demander','le prix du billet'),('noter','la nouvelle adresse'),('signer','le formulaire'),('patienter','devant le guichet'),('traverser','la rue'),
('tourner','à droite'),('marcher','jusqu’au parc'),('monter','les cartons'),('poser','la valise'),('déposer','le colis'),
('réviser','les verbes'),('utiliser','le dictionnaire'),('observer','les oiseaux'),('discuter','du projet'),('organiser','une sortie')]
SPECIAL=[
('acheter','du pain'),('manger','une pomme'),('commencer','le cours'),('appeler','le secrétariat'),('jeter','le papier'),
('préférer','le train'),('payer','la facture'),('envoyer','un message'),('nettoyer','la table'),('placer','les chaises'),
('nager','dans le bassin'),('espérer','une réponse'),('acheter','un billet'),('manger','au restaurant'),('commencer','une formation'),
('appeler','le médecin'),('jeter','les emballages'),('préférer','la marche'),('payer','le loyer'),('envoyer','une invitation'),
('nettoyer','les vitres'),('placer','le fauteuil'),('nager','avec le club'),('espérer','une amélioration'),('lever','la main'),
('promener','le chien'),('acheter','des cahiers'),('manger','des légumes'),('commencer','la visite'),('appeler','la réception'),
('jeter','le vieux journal'),('préférer','la soupe'),('payer','les achats'),('envoyer','une carte'),('nettoyer','la cuisine'),
('placer','les livres'),('nager','le mercredi'),('espérer','un retour rapide'),('lever','le drapeau'),('promener','les enfants'),
('acheter','une écharpe'),('manger','en famille'),('commencer','le travail'),('appeler','un collègue'),('jeter','les déchets'),
('préférer','le chocolat noir'),('payer','la réservation'),('envoyer','le dossier'),('nettoyer','le tableau'),('placer','les assiettes')]
IR_CONTEXT=[
('finir','le dossier'),('choisir','un livre'),('réussir','l’examen'),('réfléchir','à la question'),('remplir','la bouteille'),
('agir','avec prudence'),('grandir','rapidement'),('rougir','de timidité'),('partir','avant midi'),('sortir','du bureau'),
('dormir','dans la chambre'),('ouvrir','la porte'),('offrir','des fleurs'),('couvrir','le plat'),('accueillir','les visiteurs'),
('finir','le repas'),('choisir','une activité'),('réussir','la recette'),('réfléchir','au problème'),('remplir','le formulaire'),
('agir','avec calme'),('ralentir','près de l’école'),('réunir','les documents'),('partir','en vacances'),('sortir','du magasin'),
('dormir','jusqu’à huit heures'),('ouvrir','la fenêtre'),('offrir','un cadeau'),('couvrir','le canapé'),('accueillir','un client'),
('finir','la leçon'),('choisir','un logement'),('réussir','la présentation'),('réfléchir','à la réponse'),('remplir','le verre'),
('agir','rapidement'),('obéir','aux règles'),('avertir','le responsable'),('partir','à la montagne'),('sortir','avec des amis'),
('dormir','à l’hôtel'),('ouvrir','le courrier'),('offrir','de l’aide'),('couvrir','la casserole'),('accueillir','la voisine'),
('finir','le dessin'),('choisir','une couleur'),('réussir','le permis'),('réfléchir','à une solution'),('remplir','le questionnaire')]
RE_CONTEXT=[
('prendre','le bus'),('mettre','le manteau'),('lire','le courrier'),('écrire','un message'),('boire','de l’eau'),
('voir','le panneau'),('savoir','la réponse'),('connaître','le quartier'),('attendre','le médecin'),('répondre','au client'),
('vendre','un vélo'),('recevoir','un colis'),('vivre','en ville'),('croire','cette information'),('dire','la vérité'),
('prendre','rendez-vous'),('mettre','la table'),('lire','une annonce'),('écrire','une adresse'),('boire','un café'),
('voir','le lac'),('savoir','nager'),('connaître','cette personne'),('attendre','le train'),('répondre','à une question'),
('vendre','des légumes'),('recevoir','la facture'),('vivre','avec ma famille'),('croire','le témoin'),('dire','bonjour'),
('prendre','les clés'),('mettre','les lunettes'),('lire','le journal'),('écrire','une lettre'),('boire','du thé'),
('voir','la sortie'),('savoir','conduire'),('connaître','le règlement'),('attendre','la livraison'),('répondre','au téléphone'),
('vendre','une armoire'),('recevoir','des amis'),('vivre','près de la gare'),('croire','cette explication'),('dire','merci'),
('prendre','une douche'),('mettre','les chaussures'),('lire','la consigne'),('écrire','une invitation'),('boire','un chocolat chaud')]
ETRE_CONTEXT='en avance|en retard|à la maison|au travail|à la gare|en formation|en vacances|à l’accueil|dans le jardin|sur le balcon|en classe|à la bibliothèque|au musée|à l’arrêt du bus|chez le médecin|chez une amie|près de la poste|devant la pharmacie|derrière la mairie|en face du parc|à côté du bureau|dans la cuisine|au deuxième étage|en réunion|en pause|de bonne humeur|d’accord avec toi|sans nouvelles|à l’heure|au cinéma|en déplacement|en congé|dans le train|au guichet|à la piscine|chez le coiffeur|dans le quartier|sur la place|à la montagne|au bord du lac|en visite|au téléphone|en sécurité|en route|à l’abri|dans le salon|à la boulangerie|dans la salle d’attente|au marché|en promenade'.split('|')
AVOIR_CONTEXT='une question|un rendez-vous|besoin d’aide|faim|soif|froid|chaud|du temps|de la chance|une idée|un vélo|un billet|une réservation|un problème|un enfant|des voisins|un sac|une carte de bus|une ordonnance|une adresse|des nouvelles|un message|une clé|un stylo|des devoirs|un cours|une formation|un entretien|une réunion|des lunettes|une valise|un parapluie|une bouteille|un panier|un abonnement|une réduction|un reçu|une facture|un projet|une visite|mal à la tête|mal au dos|peur du bruit|envie de marcher|le droit d’entrer|raison de demander|tort de partir|l’habitude de lire|vingt ans|un peu de monnaie'.split('|')

# Every row gives the singular, plural and grammatical gender explicitly.
NOUNS=[
('sac','sacs','m'),('veste','vestes','f'),('appartement','appartements','m'),('adresse','adresses','f'),('livre','livres','m'),
('chaise','chaises','f'),('bureau','bureaux','m'),('table','tables','f'),('billet','billets','m'),('carte','cartes','f'),
('téléphone','téléphones','m'),('bouteille','bouteilles','f'),('parapluie','parapluies','m'),('clé','clés','f'),('dossier','dossiers','m'),
('photo','photos','f'),('stylo','stylos','m'),('lettre','lettres','f'),('vélo','vélos','m'),('voiture','voitures','f'),
('jardin','jardins','m'),('chambre','chambres','f'),('repas','repas','m'),('assiette','assiettes','f'),('verre','verres','m'),
('tasse','tasses','f'),('cahier','cahiers','m'),('écharpe','écharpes','f'),('ordinateur','ordinateurs','m'),('armoire','armoires','f'),
('document','documents','m'),('enveloppe','enveloppes','f'),('journal','journaux','m'),('affiche','affiches','f'),('cadeau','cadeaux','m'),
('invitation','invitations','f'),('outil','outils','m'),('lampe','lampes','f'),('chapeau','chapeaux','m'),('horloge','horloges','f'),
('manteau','manteaux','m'),('fenêtre','fenêtres','f'),('ticket','tickets','m'),('serviette','serviettes','f'),('cours','cours','m'),
('école','écoles','f'),('animal','animaux','m'),('question','questions','f'),('cheval','chevaux','m'),('histoire','histoires','f')]
ADJECTIVES=[
('grand','grande','grands','grandes'),('petit','petite','petits','petites'),('vert','verte','verts','vertes'),('bleu','bleue','bleus','bleues'),
('noir','noire','noirs','noires'),('blanc','blanche','blancs','blanches'),('gris','grise','gris','grises'),('long','longue','longs','longues'),
('court','courte','courts','courtes'),('rond','ronde','ronds','rondes'),('chaud','chaude','chauds','chaudes'),('froid','froide','froids','froides'),
('lourd','lourde','lourds','lourdes'),('léger','légère','légers','légères'),('propre','propre','propres','propres'),('sale','sale','sales','sales'),
('neuf','neuve','neufs','neuves'),('vieux','vieille','vieux','vieilles'),('nouveau','nouvelle','nouveaux','nouvelles'),('beau','belle','beaux','belles'),
('bon','bonne','bons','bonnes'),('mauvais','mauvaise','mauvais','mauvaises'),('doux','douce','doux','douces'),('frais','fraîche','frais','fraîches'),
('sec','sèche','secs','sèches'),('cher','chère','chers','chères'),('gratuit','gratuite','gratuits','gratuites'),('ouvert','ouverte','ouverts','ouvertes'),
('fermé','fermée','fermés','fermées'),('plein','pleine','pleins','pleines'),('vide','vide','vides','vides'),('utile','utile','utiles','utiles'),
('simple','simple','simples','simples'),('difficile','difficile','difficiles','difficiles'),('facile','facile','faciles','faciles'),('rapide','rapide','rapides','rapides'),
('lent','lente','lents','lentes'),('calme','calme','calmes','calmes'),('bruyant','bruyante','bruyants','bruyantes'),('ancien','ancienne','anciens','anciennes'),
('moderne','moderne','modernes','modernes'),('public','publique','publics','publiques'),('principal','principale','principaux','principales'),('local','locale','locaux','locales'),
('normal','normale','normaux','normales'),('heureux','heureuse','heureux','heureuses'),('attentif','attentive','attentifs','attentives'),('sportif','sportive','sportifs','sportives'),
('actif','active','actifs','actives'),('gentil','gentille','gentils','gentilles')]
JOBS=[('vendeur','vendeuse'),('infirmier','infirmière'),('cuisinier','cuisinière'),('boulanger','boulangère'),('conducteur','conductrice'),
('serveur','serveuse'),('coiffeur','coiffeuse'),('enseignant','enseignante'),('étudiant','étudiante'),('employé','employée'),
('directeur','directrice'),('facteur','factrice'),('acteur','actrice'),('chanteur','chanteuse'),('danseur','danseuse'),
('musicien','musicienne'),('technicien','technicienne'),('informaticien','informaticienne'),('pharmacien','pharmacienne'),('électricien','électricienne'),
('mécanicien','mécanicienne'),('jardinier','jardinière'),('caissier','caissière'),('policier','policière'),('pompier','pompière'),
('agriculteur','agricultrice'),('éleveur','éleveuse'),('ouvrier','ouvrière'),('gardien','gardienne'),('concierge','concierge'),
('médecin','médecin'),('dentiste','dentiste'),('architecte','architecte'),('journaliste','journaliste'),('artiste','artiste'),
('secrétaire','secrétaire'),('comptable','comptable'),('libraire','libraire'),('photographe','photographe'),('vétérinaire','vétérinaire'),
('assistant','assistante'),('aide-soignant','aide-soignante'),('éducateur','éducatrice'),('traducteur','traductrice'),('interprète','interprète'),
('formateur','formatrice'),('animateur','animatrice'),('entraîneur','entraîneuse'),('livreur','livreuse'),('chauffeur','chauffeuse')]

NOUN_FRAMES=[
'Je prends {d} {n} avant de sortir.','Tu portes {d} {n} pour la promenade.','Lina visite {d} {n} près de la gare.',
'Nous notons {d} {n} sur le formulaire.','Vous empruntez {d} {n} à la bibliothèque.','Le concierge déplace {d} {n} dans la salle.',
'Paul nettoie {d} {n} avant le rendez-vous.','La voisine installe {d} {n} dans le jardin.','Je réserve {d} {n} pour le concert.',
'Tu présentes {d} {n} au contrôleur.','Nous rechargeons {d} {n} avant le départ.','Elle remplit {d} {n} à la fontaine.',
'Il ouvre {d} {n} quand il pleut.','Vous retrouvez {d} {n} sous le journal.','Je complète {d} {n} pour mon inscription.',
'Lina regarde {d} {n} de la fête.','Tu prêtes {d} {n} à ton collègue.','Nous lisons {d} {n} du propriétaire.',
'Le mécanicien répare {d} {n} dans son atelier.','Elle gare {d} {n} devant la maison.','Nous arrosons {d} {n} le soir.',
'Vous aérez {d} {n} chaque matin.','Paul prépare {d} {n} pour ses invités.','Je lave {d} {n} après le déjeuner.',
'Elle remplit {d} {n} avec de l’eau.','Tu poses {d} {n} sur le plateau.','Nous rangeons {d} {n} dans le cartable.',
'Il met {d} {n} autour de son cou.','Vous allumez {d} {n} pour travailler.','La locataire ferme {d} {n} dans le couloir.',
'Je signe {d} {n} à la réception.','Tu ouvres {d} {n} avec précaution.','Nous lisons {d} {n} du quartier.',
'Le responsable accroche {d} {n} à l’entrée.','Elle choisit {d} {n} pour son ami.','Je prépare {d} {n} pour samedi.',
'Le jardinier utilise {d} {n} pour son travail.','Tu éteins {d} {n} avant de dormir.','Nous essayons {d} {n} dans le magasin.',
'Paul règle {d} {n} dans la cuisine.','Elle accroche {d} {n} près de la porte.','Vous fermez {d} {n} avant de partir.',
'Je composte {d} {n} à la gare.','Tu plies {d} {n} après la douche.','Nous suivons {d} {n} de français.',
'La famille cherche {d} {n} dans le quartier.','Les enfants observent {d} {n} à la ferme.','Vous posez {d} {n} au secrétariat.',
'Le vétérinaire soigne {d} {n} dans l’écurie.','Ma grand-mère raconte {d} {n} aux enfants.']

ADJ_NOUNS=[('bâtiment','salle'),('sac','valise'),('bonnet','veste'),('classeur','chemise'),('chat','chaussure'),
('mur','nappe'),('nuage','voiture'),('chemin','route'),('texte','phrase'),('miroir','table'),
('thé','soupe'),('vent','eau'),('paquet','boîte'),('bagage','veste'),('bol','assiette'),
('sol','main'),('vélo','voiture'),('livre','armoire'),('cours','école'),('jardin','photo'),
('repas','recette'),('résultat','habitude'),('pull','laine'),('pain','salade'),('sable','terre'),
('billet','réservation'),('parking','entrée'),('magasin','porte'),('bureau','fenêtre'),('verre','boîte'),
('tiroir','bouteille'),('outil','information'),('exercice','consigne'),('dossier','question'),('trajet','recette'),
('bus','réponse'),('service','marche'),('quartier','salle'),('atelier','rue'),('bâtiment','maison'),
('musée','cuisine'),('parc','bibliothèque'),('bâtiment','entrée'),('produit','association'),('résultat','situation'),
('garçon','fille'),('élève','voisine'),('homme','femme'),('employé','employée'),('collègue','collègue')]

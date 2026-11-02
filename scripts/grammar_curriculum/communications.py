"""Ten authored everyday situations for each communicative grammar theme."""
import json
from pathlib import Path
GROUPS={
'modaux':('Demander une possibilité',[
('Le billet','Lina','à la gare','ce matin','changer son billet','un billet de train','Je voudrais changer mon billet.'),
('La consultation','Paul','au cabinet médical','lundi matin','prendre un rendez-vous','une carte d’assurance','Je voudrais prendre un rendez-vous.'),
('Le livre','Nadia','à la bibliothèque','mercredi','emprunter un roman','une carte de lecteur','Est-ce que je peux emprunter ce roman ?'),
('La salle','Omar','à la mairie','vendredi','réserver une salle','un formulaire de réservation','Je voudrais réserver une salle.'),
('Le repas','Sofia','à la cantine','à midi','demander un plat végétarien','le menu du jour','Est-ce que je peux avoir un plat végétarien ?'),
('La formation','Kenji','au centre de formation','mardi soir','suivre un cours de français','un dossier d’inscription','Je voudrais suivre un cours de français.'),
('La livraison','Mei','au magasin de meubles','samedi','faire livrer une table','un bon de commande','Est-ce que vous pouvez livrer cette table ?'),
('Le passeport','Karim','au consulat','jeudi matin','renouveler son passeport','une photo d’identité','Je voudrais renouveler mon passeport.'),
('Le vélo','Emma','à l’atelier de réparation','demain','faire réparer un frein','un vélo rouge','Est-ce que vous pouvez réparer ce frein ?'),
('Le congé','Marco','au bureau','cet après-midi','demander un jour de congé','le planning de travail','Je voudrais prendre un jour de congé.')]),
'c2':('Demander une information',[
('La sortie','Lina','au musée','samedi matin','visiter une exposition','un billet gratuit','À quelle heure commence la visite ?'),
('Le bus','Paul','à l’arrêt de bus','à huit heures','aller à l’hôpital','le plan du réseau','Quel bus va à l’hôpital ?'),
('Le formulaire','Nadia','au secrétariat','lundi','s’inscrire au cours','un formulaire papier','Où dois-je déposer le formulaire ?'),
('La piscine','Omar','à la piscine','dimanche','nager avec ses enfants','des billets familiaux','Quand la piscine ferme-t-elle ?'),
('Le logement','Sofia','à l’agence immobilière','mardi','visiter un appartement','une annonce de location','Combien coûte le loyer ?'),
('La pharmacie','Kenji','à la pharmacie','ce soir','acheter un médicament','une ordonnance','Comment dois-je prendre ce médicament ?'),
('Le marché','Mei','sur la place du village','mercredi matin','acheter des légumes','un panier','Où se trouve le stand de légumes ?'),
('Le téléphone','Karim','à la boutique de téléphones','vendredi','choisir un abonnement','une carte SIM','Quel abonnement convient à mes besoins ?'),
('La crèche','Emma','à la crèche','jeudi','rencontrer une éducatrice','le dossier de son enfant','Avec qui puis-je parler de l’inscription ?'),
('Le colis','Marco','à la poste','à midi','retirer un colis','un avis de passage','Quel document dois-je présenter ?')]),
'd1':('Proposer une activité',[
('La promenade','Lina','au bord du lac','dimanche','faire une promenade','des chaussures de marche','Nous faisons une promenade au bord du lac.'),
('La natation','Paul','à la piscine municipale','mardi soir','faire de la natation','un bonnet de bain','Je fais de la natation le mardi.'),
('Le jardin partagé','Nadia','au jardin du quartier','samedi','faire du jardinage','un petit arrosoir','Je fais du jardinage avec les voisins.'),
('Le bricolage','Omar','à la maison de quartier','mercredi','faire du bricolage','une boîte à outils','Nous faisons du bricolage ensemble.'),
('Le vélo','Sofia','dans le parc','vendredi matin','faire du vélo','un casque','Je fais du vélo dans le parc.'),
('La danse','Kenji','à la salle des fêtes','jeudi soir','faire de la danse','des chaussures souples','Nous faisons de la danse le jeudi.'),
('Le dessin','Mei','à l’atelier municipal','lundi','faire des dessins','un carnet','Je fais des dessins dans mon carnet.'),
('La randonnée','Karim','en forêt','dimanche matin','faire de la randonnée','une gourde','Nous faisons de la randonnée en forêt.'),
('La cuisine','Emma','au centre associatif','samedi midi','faire la cuisine','un tablier','Je fais la cuisine avec le groupe.'),
('Le yoga','Marco','au centre sportif','mercredi soir','faire du yoga','un tapis','Je fais du yoga pour me détendre.')]),
'e1':('Indiquer un lieu',[
('Les clés','Lina','dans l’entrée','ce matin','retrouver ses clés','le tiroir sous le miroir','Les clés sont dans le tiroir sous le miroir.'),
('Le guichet','Paul','à la gare','à neuf heures','acheter un billet','le guichet à côté de la sortie','Le guichet est à côté de la sortie.'),
('La salle de cours','Nadia','au centre de formation','lundi','trouver sa salle','la salle devant l’escalier','La salle est devant l’escalier.'),
('Le colis','Omar','à la réception','à midi','récupérer un colis','le paquet derrière le comptoir','Le paquet est derrière le comptoir.'),
('La pharmacie','Sofia','dans le quartier','cet après-midi','chercher une pharmacie','la pharmacie en face de la banque','La pharmacie est en face de la banque.'),
('Le vélo','Kenji','dans le parking','ce soir','garer son vélo','la place entre les deux piliers','La place est entre les deux piliers.'),
('Le livre','Mei','à la bibliothèque','mercredi','ranger un dictionnaire','l’étagère au-dessus du bureau','Le dictionnaire est sur l’étagère au-dessus du bureau.'),
('Le rendez-vous','Karim','à l’hôpital','jeudi matin','aller au service d’accueil','le bureau près de l’ascenseur','Le bureau est près de l’ascenseur.'),
('Le sac','Emma','dans la salle d’attente','vendredi','retrouver son sac','le sac sous la chaise','Le sac est sous la chaise.'),
('La fontaine','Marco','dans le parc','dimanche','remplir sa gourde','la fontaine à gauche du kiosque','La fontaine est à gauche du kiosque.')]),
'e2':('Fixer un moment',[
('Le dentiste','Lina','au cabinet dentaire','lundi à neuf heures','faire contrôler ses dents','une carte de rendez-vous','Mon rendez-vous est lundi à neuf heures.'),
('Le repas partagé','Paul','à la maison de quartier','samedi à midi','rencontrer ses voisins','une invitation','Le repas commence samedi à midi.'),
('Le cours du soir','Nadia','à l’école de langues','mardi à dix-huit heures','commencer son cours','un emploi du temps','Le cours commence mardi à dix-huit heures.'),
('La visite','Omar','au musée','dimanche après-midi','suivre une visite guidée','un billet réservé','La visite a lieu dimanche après-midi.'),
('Le chantier','Sofia','dans son immeuble','en septembre','laisser entrer les ouvriers','un avis de travaux','Les travaux commencent en septembre.'),
('Le marché','Kenji','sur la place centrale','le mercredi matin','acheter des fruits','une liste de courses','Le marché a lieu le mercredi matin.'),
('La randonnée','Mei','au départ du sentier','au printemps','découvrir la montagne','le programme du club','La randonnée est prévue au printemps.'),
('Le train','Karim','à la gare centrale','à huit heures et demie','prendre le train','un billet de transport','Mon train part à huit heures et demie.'),
('Les vacances','Emma','à l’agence de voyages','en juillet','préparer son séjour','une brochure','Nous partons en vacances en juillet.'),
('La permanence','Marco','au centre social','le vendredi soir','rencontrer un conseiller','une affiche','La permanence est ouverte le vendredi soir.')]),
'f3':('Répondre à une proposition',[
('Le café','Lina','à la cafétéria','pendant la pause','accepter un café','une tasse','Oui, un café avec plaisir.'),
('Le cinéma','Paul','devant le cinéma','samedi soir','refuser une invitation','une affiche de film','Merci, mais je ne suis pas disponible samedi.'),
('Le repas','Nadia','chez sa voisine','dimanche midi','accepter une invitation à déjeuner','une invitation','Merci, je viendrai avec plaisir.'),
('La sortie','Omar','au centre sportif','mercredi','refuser une sortie à vélo','un vélo','Merci, mais je préfère me reposer.'),
('Le dessert','Sofia','au restaurant','à la fin du repas','refuser un dessert','la carte des desserts','Non merci, je n’ai plus faim.'),
('Le covoiturage','Kenji','sur le parking','demain matin','accepter une place en voiture','une voiture','Oui, merci de m’emmener.'),
('L’aide','Mei','à la bibliothèque','cet après-midi','accepter de l’aide pour chercher un livre','un catalogue','Oui, votre aide me serait utile.'),
('La réunion','Karim','au bureau','vendredi','refuser un nouvel horaire','un calendrier','Désolé, cet horaire ne me convient pas.'),
('La marche','Emma','à l’entrée du parc','ce soir','accepter une promenade','un plan du parc','Bonne idée, je viens avec vous.'),
('Le gâteau','Marco','dans la salle commune','pendant la fête','refuser une part de gâteau','un gâteau','Non merci, j’en ai déjà mangé.')]),
'description-physique':('Décrire pour reconnaître',[
('Au rendez-vous','Lina','devant la mairie','à dix heures','retrouver sa collègue','une femme aux cheveux courts','Ma collègue a les cheveux courts.'),
('À la sortie','Paul','devant l’école','à seize heures','reconnaître le père de son ami','un homme avec des lunettes rondes','Le père de mon ami porte des lunettes rondes.'),
('Au guichet','Nadia','à la gare','ce matin','retrouver une voyageuse','une femme avec une veste rouge','La voyageuse porte une veste rouge.'),
('Au stade','Omar','à l’entrée du stade','samedi','repérer son entraîneur','un homme grand et brun','Mon entraîneur est grand et brun.'),
('Dans le hall','Sofia','dans le hall du centre','à midi','accueillir sa sœur','une femme aux cheveux bouclés','Ma sœur a les cheveux bouclés.'),
('Au marché','Kenji','sur la place','mercredi','retrouver son voisin','un homme avec une barbe blanche','Mon voisin a une barbe blanche.'),
('À la bibliothèque','Mei','près du bureau d’accueil','cet après-midi','reconnaître une bénévole','une femme avec une écharpe bleue','La bénévole porte une écharpe bleue.'),
('Au concert','Karim','devant la salle de concert','ce soir','retrouver un ami','un homme avec un manteau noir','Mon ami porte un manteau noir.'),
('À la piscine','Emma','dans le hall de la piscine','dimanche','retrouver sa cousine','une femme aux yeux verts','Ma cousine a les yeux verts.'),
('À l’aéroport','Marco','dans le hall des arrivées','vendredi','accueillir son frère','un homme aux cheveux roux','Mon frère a les cheveux roux.')]),
'f10':('Donner un conseil',[
('Le sommeil','Lina','au centre de santé','lundi','mieux dormir','un carnet de sommeil','Vous devriez vous coucher plus tôt.'),
('Le français','Paul','à la bibliothèque','mercredi','progresser en français','un livre facile','Vous pourriez lire un livre facile.'),
('Le trajet','Nadia','à la gare','demain','éviter les embouteillages','un billet de train','Vous pourriez prendre le train.'),
('La chaleur','Omar','au centre sportif','cet après-midi','se protéger de la chaleur','une gourde','Vous devriez boire de l’eau régulièrement.'),
('Le logement','Sofia','au centre social','vendredi','chercher un appartement','une liste d’agences','Vous pourriez contacter une agence.'),
('L’examen','Kenji','à l’école','mardi','préparer son examen','un planning de révision','Vous devriez réviser un peu chaque jour.'),
('La facture','Mei','au guichet','ce matin','comprendre une facture','une facture','Vous pourriez demander une explication.'),
('Le jardin','Karim','dans le jardin partagé','ce soir','garder ses plantes en bonne santé','un arrosoir','Vous devriez arroser vos plantes.'),
('Le travail','Emma','au bureau','jeudi','faire une pause','un agenda','Vous devriez prévoir une pause.'),
('Le vélo','Marco','à l’atelier','samedi','rouler avec un vélo sûr','un casque','Vous devriez porter un casque.')]),
'g4':('Demander une quantité',[
('La boulangerie','Lina','à la boulangerie','ce matin','acheter du pain','deux baguettes','Je voudrais deux baguettes.'),
('Le marché','Paul','au marché','mercredi','acheter des pommes','un kilo de pommes','Je voudrais un kilo de pommes.'),
('La fromagerie','Nadia','à la fromagerie','samedi','acheter du fromage','deux cents grammes de fromage','Je voudrais deux cents grammes de fromage.'),
('Le café','Omar','au café du quartier','à midi','commander de l’eau','une bouteille d’eau','Je voudrais une bouteille d’eau.'),
('L’épicerie','Sofia','à l’épicerie','ce soir','acheter du riz','un paquet de riz','Je voudrais un paquet de riz.'),
('Le restaurant','Kenji','au restaurant','dimanche midi','commander de la soupe','un bol de soupe','Je voudrais un bol de soupe.'),
('La pâtisserie','Mei','à la pâtisserie','vendredi','acheter du gâteau','une part de gâteau','Je voudrais une part de gâteau.'),
('La boucherie','Karim','à la boucherie','samedi matin','acheter du poulet','deux filets de poulet','Je voudrais deux filets de poulet.'),
('La cantine','Emma','à la cantine','pendant la pause','demander de la salade','un peu de salade','Je voudrais un peu de salade.'),
('Le supermarché','Marco','au supermarché','lundi','acheter du lait','une bouteille de lait','Je voudrais une bouteille de lait.')]),
'imparfait-ou-pc':('Raconter un événement',[
('La panne','Lina','sur la route du travail','hier matin','raconter une panne','un bus en panne','Hier, le bus est tombé en panne.'),
('La rencontre','Paul','à la bibliothèque','samedi','raconter une rencontre','un ancien collègue','Samedi, j’ai rencontré un ancien collègue.'),
('La chute','Nadia','dans l’escalier','lundi soir','raconter une chute','une marche glissante','Lundi soir, je suis tombée dans l’escalier.'),
('Le déménagement','Omar','dans son nouvel appartement','le mois dernier','raconter son déménagement','des cartons','Le mois dernier, j’ai déménagé.'),
('Le portefeuille','Sofia','dans le bus','hier','raconter la perte de son portefeuille','un portefeuille','Hier, j’ai perdu mon portefeuille dans le bus.'),
('La sortie scolaire','Kenji','au musée','vendredi','raconter une visite','une exposition','Vendredi, nous avons visité une exposition.'),
('La fête','Mei','dans la salle commune','dimanche','raconter une fête','un gâteau partagé','Dimanche, nous avons partagé un gâteau.'),
('Le retard','Karim','à la gare','mardi','raconter un retard','un train retardé','Mardi, mon train est arrivé en retard.'),
('La réparation','Emma','à l’atelier','samedi matin','raconter une réparation','un frein neuf','Samedi matin, le mécanicien a remplacé le frein.'),
('La promenade','Marco','au bord du lac','hier après-midi','raconter une promenade','un sentier','Hier après-midi, nous avons marché au bord du lac.')]),
'i4':('Éviter une répétition',[
('Le dossier','Lina','au secrétariat','lundi','déposer son dossier','le dossier','Je le dépose au secrétariat.'),
('La clé','Paul','à l’accueil','ce matin','rendre la clé','la clé','Je la rends à l’accueil.'),
('Les livres','Nadia','à la bibliothèque','mercredi','rapporter les livres','les livres','Je les rapporte à la bibliothèque.'),
('Le billet','Omar','à la gare','à neuf heures','montrer son billet','le billet','Je le montre au contrôleur.'),
('La facture','Sofia','au bureau','vendredi','vérifier la facture','la facture','Je la vérifie avec ma collègue.'),
('Les légumes','Kenji','à la cuisine collective','à midi','laver les légumes','les légumes','Je les lave avant le repas.'),
('Le vélo','Mei','à l’atelier','samedi','réparer son vélo','le vélo','Je le répare à l’atelier.'),
('La photo','Karim','au guichet','mardi','donner la photo','la photo','Je la donne à l’employée.'),
('Les chaussures','Emma','au magasin','cet après-midi','essayer les chaussures','les chaussures','Je les essaie au magasin.'),
('Le formulaire','Marco','à la mairie','jeudi','compléter le formulaire','le formulaire','Je le complète à la mairie.')]),
'j1':('Dire ce qui se passe',[
('La cuisine','Lina','dans la cuisine','en ce moment','préparer une soupe','une casserole','Lina est en train de préparer une soupe.'),
('Le jardin','Paul','dans le jardin','maintenant','arroser les fleurs','un arrosoir','Paul est en train d’arroser les fleurs.'),
('Le cours','Nadia','dans la salle de classe','à cet instant','lire une consigne','une fiche','Nadia est en train de lire une consigne.'),
('L’atelier','Omar','dans l’atelier','en ce moment','réparer une chaise','un tournevis','Omar est en train de réparer une chaise.'),
('Le repas','Sofia','à la cantine','maintenant','servir le repas','un plateau','Sofia est en train de servir le repas.'),
('Le magasin','Kenji','dans le magasin','à cet instant','ranger les boîtes','une étagère','Kenji est en train de ranger les boîtes.'),
('Le parc','Mei','dans le parc','en ce moment','dessiner le paysage','un carnet','Mei est en train de dessiner le paysage.'),
('Le bureau','Karim','au bureau','maintenant','écrire un message','un ordinateur','Karim est en train d’écrire un message.'),
('La gare','Emma','dans le hall de la gare','à cet instant','acheter un billet','un distributeur','Emma est en train d’acheter un billet.'),
('La maison','Marco','dans le salon','en ce moment','monter un meuble','une boîte à outils','Marco est en train de monter un meuble.')]),
'futur-proche':('Annoncer un projet',[
('Le déménagement','Lina','dans son nouvel immeuble','samedi','déménager','des cartons','Je vais déménager samedi.'),
('Le cours','Paul','au centre de langues','lundi','commencer un cours','un cahier','Je vais commencer un cours lundi.'),
('Le repas','Nadia','chez sa sœur','dimanche','préparer le déjeuner','des légumes','Je vais préparer le déjeuner dimanche.'),
('La visite','Omar','au musée','demain','visiter une exposition','un billet','Je vais visiter une exposition demain.'),
('La réparation','Sofia','à l’atelier','mardi','faire réparer son vélo','un vélo','Je vais faire réparer mon vélo mardi.'),
('La randonnée','Kenji','en montagne','ce week-end','faire une randonnée','un sac à dos','Je vais faire une randonnée ce week-end.'),
('Le rendez-vous','Mei','au cabinet médical','jeudi','consulter le médecin','une carte d’assurance','Je vais consulter le médecin jeudi.'),
('Le travail','Karim','à l’entreprise','le mois prochain','commencer un nouveau travail','un contrat','Je vais commencer un nouveau travail le mois prochain.'),
('La bibliothèque','Emma','à la bibliothèque','mercredi','emprunter un roman','une carte de lecteur','Je vais emprunter un roman mercredi.'),
('Le voyage','Marco','à la gare','vendredi','prendre le train','une valise','Je vais prendre le train vendredi.')]),
'j7':('Transmettre une information',[
('Le retard','Lina','à l’accueil','ce matin','transmettre un message de Paul','un message de retard','Paul dit qu’il arrive en retard.'),
('La fermeture','Paul','à la mairie','lundi','annoncer une fermeture','un avis de fermeture','L’employée dit que la mairie ferme à midi.'),
('La réunion','Nadia','au bureau','mardi','rapporter une demande de sa collègue','une invitation à la réunion','Ma collègue demande si je viens à la réunion.'),
('Le médecin','Omar','au cabinet médical','mercredi','transmettre une consigne du médecin','une ordonnance','Le médecin dit que je dois me reposer.'),
('Le colis','Sofia','à la poste','jeudi','rapporter une information du facteur','un avis de passage','Le facteur dit que le colis est à la poste.'),
('Le cours','Kenji','au centre de formation','vendredi','rapporter une annonce du professeur','un nouvel horaire','Le professeur dit que le cours commence à neuf heures.'),
('La visite','Mei','au musée','samedi','transmettre une question du guide','un billet de visite','Le guide demande si nous comprenons.'),
('Le repas','Karim','à la cantine','à midi','rapporter une demande de la cuisinière','un menu','La cuisinière demande si je mange de la viande.'),
('La sortie','Emma','à l’école','dimanche','transmettre une information de l’enseignant','le programme de la sortie','L’enseignant dit que la sortie est annulée.'),
('Le rendez-vous','Marco','au secrétariat','demain','rapporter une question de l’employée','une carte de rendez-vous','L’employée demande à quelle heure je suis disponible.')]),
'k2':('Organiser une explication',[
('Le trajet','Lina','à la gare','demain','expliquer son choix de transport','un billet de train','Je prends le train car le trajet est direct.'),
('Le logement','Paul','à l’agence immobilière','lundi','expliquer son choix de logement','une annonce','Je choisis cet appartement car il est près de mon travail.'),
('L’activité','Nadia','au centre sportif','mardi soir','expliquer son choix d’activité','le programme des cours','Je choisis la natation car j’aime l’eau.'),
('Le repas','Omar','à la cantine','à midi','expliquer son choix de plat','un menu','Je prends la salade car je veux un repas léger.'),
('Le livre','Sofia','à la bibliothèque','mercredi','expliquer son choix de livre','un roman facile','Je prends ce roman car il est facile à lire.'),
('Le téléphone','Kenji','au magasin','jeudi','expliquer son choix de téléphone','un modèle simple','Je choisis ce téléphone car il est simple à utiliser.'),
('Le cours','Mei','à l’école','vendredi','expliquer son choix d’horaire','un planning','Je choisis le cours du soir car je travaille le matin.'),
('La sortie','Karim','à la maison de quartier','samedi','expliquer son choix de sortie','une affiche de randonnée','Je propose la randonnée car elle est gratuite.'),
('Le travail','Emma','au centre de formation','lundi matin','expliquer son projet professionnel','une brochure de formation','Je suis cette formation car je veux travailler avec des enfants.'),
('Le jardin','Marco','au jardin partagé','dimanche','expliquer son engagement','une parcelle','Je participe au jardin car j’aime cultiver des légumes.')]),
'k3':('Expliquer une raison',[
('Le rendez-vous manqué','Lina','au cabinet médical','hier','expliquer son absence','un bus en panne','Je suis arrivée en retard parce que le bus était en panne.'),
('La fenêtre','Paul','dans son appartement','ce matin','expliquer un geste','une fenêtre ouverte','J’ouvre la fenêtre parce qu’il fait chaud.'),
('Le médecin','Nadia','au centre de santé','lundi','expliquer sa visite','une ordonnance','Je consulte parce que j’ai de la fièvre.'),
('Le trajet','Omar','à la gare','mardi','expliquer son choix de transport','un vélo abîmé','Je prends le train parce que mon vélo est abîmé.'),
('Le repas','Sofia','au restaurant','à midi','expliquer un refus de dessert','une carte de desserts','Je ne prends pas de dessert parce que je n’ai plus faim.'),
('La bibliothèque','Kenji','à la bibliothèque','mercredi','expliquer une demande d’aide','un catalogue difficile','Je demande de l’aide parce que je ne comprends pas le catalogue.'),
('La réparation','Mei','à l’atelier','jeudi','expliquer le problème de son vélo','un frein cassé','Je viens à l’atelier parce que mon frein est cassé.'),
('Le repos','Karim','à la maison','vendredi','expliquer son besoin de repos','un agenda chargé','Je fais une pause parce que je suis fatigué.'),
('Le jardin','Emma','dans le jardin','samedi','expliquer un arrosage','une terre sèche','J’arrose les plantes parce que la terre est sèche.'),
('La sortie','Marco','au centre associatif','dimanche','expliquer une annulation','un avis d’orage','Nous annulons la sortie parce qu’un orage est annoncé.')]),
}

# Questions always refer to an explicit fact in the support.
ALL=[]
for sub,(goal,rows) in GROUPS.items():
 assert len(rows)==10
 variants=[]
 for i,(title,who,place,time,action,obj,model) in enumerate(rows):
  # Five short sentences, one fact per question. No unavailable picture is used as evidence.
  text=f'{who} est {place}. Le moment prévu est {time}. Son objectif est de {action}. Le document mentionne {obj}. Voici une phrase utile : « {model} ».'
  text=text.replace('de accepter','d’accepter').replace('de emprunter','d’emprunter').replace('de annoncer','d’annoncer').replace('de expliquer','d’expliquer').replace('de éviter','d’éviter').replace('de accueillir','d’accueillir').replace('de arroser','d’arroser')
  facts=[('Qui est au centre de cette situation ?',who),('Où se trouve cette personne ?',place),('Quel est le moment prévu ?',time),('Quel est son objectif ?',action),('Quel objet ou élément le document mentionne-t-il ?',obj)]
  questions=[]
  for q,(enonce,answer) in enumerate(facts):
   others=[r[(1,2,3,4,5)[q]] for j,r in enumerate(rows) if j!=i and r[(1,2,3,4,5)[q]]!=answer]
   options=list(dict.fromkeys([answer]+others))[:3]
   assert len(options)==3,(sub,title,q)
   questions.append(dict(enonce=enonce,answer=answer,options=options))
  # A single useful phrase, not a multi-part written or oral task.
  pe=f'{who} veut {action} : écrivez une phrase utile pour cette situation.'
  po=f'Vous êtes à la place de {who} : dites une phrase utile pour {action}.'
  # Third-person description and reported speech are instructions in their own right.
  if sub=='j1':pe=f'Écrivez une phrase avec être en train de pour décrire {who}.';po=f'Dites une phrase avec être en train de pour décrire {who}.'
  if sub=='i4':pe=f'Écrivez une phrase avec un pronom COD pour parler de « {obj} ».';po=f'Dites une phrase avec un pronom COD pour parler de « {obj} ».'
  if sub=='futur-proche':pe=f'À la place de {who}, écrivez une phrase au futur proche pour annoncer le projet.';po=f'À la place de {who}, annoncez le projet en une phrase au futur proche.'
  if sub=='f10':pe=f'Écrivez un conseil à {who} avec devoir ou pouvoir au conditionnel.';po=f'Donnez un conseil à {who} avec devoir ou pouvoir au conditionnel.'
  if sub=='c2':pe=f'Écrivez une question utile à {who} pour cette situation.';po=f'Posez une question utile à {who} pour cette situation.'
  if sub=='j7':pe=f'Écrivez une phrase pour {action} au discours indirect.';po=f'Dites une phrase pour {action} au discours indirect.'
  image_obj=obj
  if any(word in obj for word in ('calendrier','planning','horaire','agenda','emploi du temps')):image_obj='un carnet fermé'
  if sub=='g4':image_obj={'un kilo de pommes':'des pommes','deux cents grammes de fromage':'du fromage','un peu de salade':'de la salade'}.get(obj,obj)
  variants.append(dict(id=f'{sub}-{i+1:02d}',title=title,text=text,questions=questions,pe=pe,po=po,model=model,imageDescription=f'Scène quotidienne : {who} {place}, pour {action} ; élément visible : {image_obj}. Aucun texte, montant, calendrier ou date dans l’image.'))
 ALL.append(dict(subId=sub,goal=goal,variants=variants))

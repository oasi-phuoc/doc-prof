"""Questions CO relues, ancrées dans des faits distincts du dialogue.

Une entrée = chemin audio stable, tag voulu, questions et extraits justificatifs.
Les scénarios conservent leur tag scénario et un pool court de deux questions.
"""

CO_REVIEWS = {}


def scenario(folder, filename, rows):
    CO_REVIEWS[f'/lib/audio/tcf/co/{folder}/{filename}.mp3'] = {
        'tag': 'court', 'scenario': True, 'rows': rows,
    }


scenario('vie-quotidienne', 'la-famille-2-1', [
    ('objet', 'Quel objet Sophie demande-t-elle à Martin ?', ['Son téléphone', 'Son ordinateur', 'Son appareil photo'], 'tu me prêtes ton téléphone'),
    ('destinataire', 'Qui Sophie veut-elle appeler ?', ['Sa sœur', 'Sa mère', 'Sa cousine'], 'Je voudrais appeler ma sœur'),
])
scenario('vie-quotidienne', 'la-famille-2-2', [
    ('douleur', 'Où le jeune a-t-il mal ce matin ?', ['À la tête', 'Au dos', 'Au ventre'], 'mal à la tête ce matin'),
    ('depart', 'À quelle heure prévoit-il d’aller au lycée ?', ['À 13 h', 'À 10 h', 'À 14 h'], 'je vais au lycée à 13 heures'),
])
scenario('vie-quotidienne', 'la-famille-2-3', [
    ('cours', 'À quel cours Mehmet ne veut-il pas aller ?', ['Au cours de musique', 'Au cours de mathématiques', 'Au cours de français'], 'je ne viens pas en musique'),
    ('raison', 'Pourquoi Mehmet ne veut-il pas y aller ?', ['Il n’a rien préparé', 'Il a perdu son instrument', 'Il est malade'], "Je n'ai rien préparé"),
])
scenario('vie-quotidienne', 'la-famille-2-4', [
    ('repas', 'Quel repas le petit-fils a-t-il oublié ?', ['Le déjeuner', 'Le dîner', 'Le petit-déjeuner'], 'Tu as oublié notre déjeuner'),
    ('incident', 'Quel véhicule a eu un accident ?', ['Le bus', 'Le train', 'La voiture'], 'le bus a eu un accident'),
])
scenario('vie-quotidienne', 'la-famille-d-accueil-1', [
    ('sport', 'Quel sport vont-ils pratiquer avec leurs amis ?', ['Le football', 'Le basket', 'Le tennis'], 'jouer au foot avec mes amis'),
    ('repas', 'Que vont-ils manger après le sport ?', ['Une pizza', 'Un hamburger', 'Une soupe'], 'on va manger une pizza'),
])
scenario('vie-quotidienne', 'la-famille-d-accueil-2', [
    ('tache', 'Que Jonathan doit-il faire avant de sortir ?', ['Ranger sa chambre', 'Faire la vaisselle', 'Préparer le repas'], 'tu ne sors pas avant d’avoir rangé ta chambre'),
    ('rendez_vous', 'Avec qui Jonathan a-t-il rendez-vous ?', ['Ses amis', 'Son professeur', 'Sa grand-mère'], 'j’ai rendez-vous avec mes amis'),
])
scenario('vie-quotidienne', 'la-famille-d-accueil-3', [
    ('objet', 'Quel appareil la personne demande-t-elle à Paul ?', ['Son ordinateur', 'Son téléphone', 'Sa télévision'], 'me prêter ton ordinateur'),
    ('matiere', 'Pour quel cours doit-elle faire des recherches ?', ['L’histoire', 'La géographie', 'Les sciences'], 'pour mon cours d’histoire'),
])
scenario('vie-quotidienne', 'la-famille-d-accueil-4', [
    ('longueur', 'Combien mesure la piscine en longueur ?', ['50 mètres', '20 mètres', '25 mètres'], '50 mètres de long'),
    ('eau', 'Comment est l’eau de cette piscine ?', ['Chaude', 'Froide', 'Glacée'], 'L’eau est chaude'),
])
scenario('loisirs', 'la-sortie-entre-amis-1', [
    ('sortie', 'Quelle sortie est proposée ?', ['Une exposition', 'Un concert', 'Une séance de cinéma'], 'voir la nouvelle exposition'),
    ('theme', 'Sur quel thème porte cette exposition ?', ['Les mangas', 'La photographie', 'La musique'], 'exposition sur les mangas'),
])
scenario('loisirs', 'la-sortie-entre-amis-2', [
    ('support', 'Sur quel appareil se trouve le programme de la fête ?', ['Un téléphone', 'Un ordinateur', 'Une tablette'], 'sur mon téléphone'),
    ('ordre', 'Quel événement précède le concert de hip-hop ?', ['Le concours de chansons', 'Le spectacle de danse', 'La pièce de théâtre'], 'après le concours de chansons'),
])
scenario('loisirs', 'la-sortie-entre-amis-3', [
    ('matiere', 'Dans quelle matière la personne fait-elle des exercices ?', ['Les mathématiques', 'L’histoire', 'Le français'], 'Mes exercices de mathématiques'),
    ('aide', 'Quelle aide son ami lui propose-t-il ?', ['Lui expliquer les exercices', 'Lui prêter un livre', 'L’accompagner chez le professeur'], 'regarder avec toi et t’expliquer'),
])
scenario('loisirs', 'la-sortie-entre-amis-4', [
    ('occasion', 'À quelle occasion cherchent-ils un cadeau pour Juliette ?', ['Son anniversaire', 'Sa réussite à un examen', 'Son départ à l’étranger'], 'l’anniversaire de Juliette'),
    ('cadeau', 'Quel cadeau est finalement proposé ?', ['Une place de concert', 'Un disque', 'Un instrument de musique'], 'Pourquoi pas une place de concert'),
])
scenario('magasins', 'les-achats-1', [
    ('objet', 'Quel objet la personne est-elle en train de choisir ?', ['Un sac', 'Un manteau', 'Un pantalon'], 'Le sac vert ou le sac noir'),
    ('couleur', 'De quelle couleur est l’objet qu’elle préfère ?', ['Vert', 'Noir', 'Bleu'], "j'aime mieux le vert"),
])
scenario('magasins', 'les-achats-2', [
    ('achat', 'Quel appareil vient d’être acheté ?', ['Un aspirateur', 'Un réfrigérateur', 'Un lave-linge'], 'ton nouvel aspirateur'),
    ('prix', 'Combien cet appareil a-t-il coûté ?', ['78 euros', '68 euros', '88 euros'], '78 euros'),
])
scenario('magasins', 'les-achats-3', [
    ('dessert', 'Quel dessert la personne a-t-elle raté ?', ['Une crème au chocolat', 'Une tarte aux pommes', 'Un gâteau au citron'], "J'ai raté ma crème au chocolat"),
    ('aide', 'Que propose l’autre personne pour l’aider ?', ['Lui montrer comment faire', 'Acheter un dessert', 'Appeler un pâtissier'], 'Attends, je te montre'),
])
scenario('magasins', 'les-achats-4', [
    ('resultat', 'Quel résultat Emma a-t-elle obtenu à ses examens ?', ['Elle a réussi', 'Elle a échoué', 'Elle attend encore les résultats'], "j'ai réussi"),
    ('emotion', 'Comment Emma se sent-elle ?', ['Très contente', 'Déçue', 'Inquiète'], 'je suis trop contente'),
])
scenario('radio', 'les-annonces-1', [
    ('produit', 'Quels articles sont soldés ?', ['Les chaussures', 'Les sacs', 'Les manteaux'], 'les chaussures sont soldées'),
    ('duree', 'Combien de temps cette promotion dure-t-elle ?', ['Une heure', 'Deux heures', 'Une journée'], 'pendant une heure'),
])
scenario('radio', 'les-annonces-2', [
    ('vehicule', 'Dans quel moyen de transport cette annonce est-elle faite ?', ['Un avion', 'Un train', 'Un bateau'], "attendre l'arrêt de l'avion"),
    ('consigne', 'Que doivent faire les voyageurs avant l’arrêt ?', ['Rester assis', 'Se lever', 'Sortir leurs bagages'], 'Veuillez rester assis'),
])
scenario('radio', 'les-annonces-3', [
    ('tache', 'Que doivent faire les personnes qui écoutent ?', ['Un exercice', 'Une pause', 'Un repas'], 'faire cet exercice'),
    ('duree', 'Combien de temps ont-elles pour le faire ?', ['Cinq minutes', 'Dix minutes', 'Quinze minutes'], 'cinq minutes'),
])
scenario('radio', 'les-annonces-4', [
    ('evenement', 'Quel événement va commencer ?', ['Une réunion', 'Un concert', 'Un cours de sport'], 'la réunion va commencer'),
    ('consigne', 'Que peuvent faire les participants dans la salle ?', ['S’asseoir', 'Manger', 'Danser'], 'Vous pouvez vous asseoir'),
])
scenario('vie-quotidienne', 'les-dialogues-du-quotidien-1', [
    ('ligne', 'Quel numéro de bus la personne doit-elle prendre ?', ['Le 15', 'Le 5', 'Le 50'], 'le bus 15'),
    ('direction', 'De quel côté doit-elle tourner après avoir traversé la place ?', ['À droite', 'À gauche', 'Elle doit continuer tout droit'], 'la première rue à droite'),
])
scenario('vie-quotidienne', 'les-dialogues-du-quotidien-2', [
    ('meteo', 'Quel temps est prévu le matin ?', ['De la pluie', 'Du soleil', 'De la neige'], "il va pleuvoir le matin"),
    ('sortie', 'Quelle sortie choisissent-ils finalement ?', ['Le cinéma', 'La piscine', 'Le restaurant'], 'alors on va au cinéma'),
])
scenario('vie-quotidienne', 'les-dialogues-du-quotidien-3', [
    ('lieu', 'Où se trouve Jules ?', ['Dans sa chambre', 'Dans la cuisine', 'Dans le jardin'], 'Il est dans sa chambre'),
    ('preparation', 'Que prépare Jules ?', ['Une surprise', 'Un repas', 'Un examen'], 'Il te prépare une surprise'),
])
scenario('vie-quotidienne', 'les-dialogues-du-quotidien-4', [
    ('service', 'Quel animal a été gardé pendant le week-end ?', ['Un chien', 'Un chat', 'Un lapin'], "gardé mon chien"),
    ('bilan', 'Comment Hélène décrit-elle son week-end ?', ['Très agréable', 'Ennuyeux', 'Difficile'], 'Ah oui, super'),
])
scenario('ecole', 'les-etudes-1-1', [
    ('evenement', 'À quel événement les personnes sont-elles accueillies ?', ['Une formation', 'Un mariage', 'Une compétition'], 'bienvenue à la formation'),
    ('boisson', 'Quelle boisson est mise à leur disposition ?', ['De l’eau', 'Du café', 'Du jus d’orange'], 'petites bouteilles d’eau'),
])
scenario('ecole', 'les-etudes-2-1', [
    ('lieu', 'Quel restaurant la personne n’aime-t-elle pas ?', ['Celui de l’université', 'Celui de son hôtel', 'Celui de son quartier'], "le restaurant de l'université"),
    ('repas', 'Comment préfère-t-elle organiser ses repas ?', ['Les préparer elle-même', 'Commander des plats livrés', 'Manger chez ses parents'], 'Je préfère me préparer mes repas'),
])
scenario('ecole', 'les-etudes-1-2', [
    ('debut', 'À quelle heure Dorian commence-t-il ?', ['À 8 h 30', 'À 9 h', 'À 8 h'], 'je commence à 8 h 30'),
    ('meteo', 'Quel temps fait-il aujourd’hui ?', ['Il pleut beaucoup', 'Il neige', 'Il fait soleil'], 'Il pleut beaucoup aujourd’hui'),
])
scenario('ecole', 'les-etudes-2-2', [
    ('interlocuteur', 'À qui l’enfant demande-t-il de l’aide ?', ['À son père', 'À sa mère', 'À son professeur'], "Papa, est-ce que tu peux m'aider"),
    ('matiere', 'Dans quelle matière sont ses exercices ?', ['Les mathématiques', 'Le français', 'L’histoire'], 'exercices de mathématiques'),
])
scenario('ecole', 'les-etudes-1-3', [
    ('profession', 'Quel est le métier de monsieur Duquesnes ?', ['Professeur', 'Médecin', 'Comptable'], 'Je suis le professeur Duquesnes'),
    ('salle', 'Quel numéro de salle cherche-t-il ?', ['33', '13', '30'], 'Où est la salle 33'),
])
scenario('ecole', 'les-etudes-2-3', [
    ('lieu', 'Où Éric va-t-il ?', ['À la bibliothèque', 'À la librairie', 'À l’école'], 'Je vais à la bibliothèque'),
    ('action', 'Que veut-il faire avec les livres ?', ['Les emprunter', 'Les acheter', 'Les vendre'], 'Je dois emprunter des livres'),
])
scenario('ecole', 'les-etudes-1-4', [
    ('peintre', 'Quel peintre est cité dans la conversation ?', ['Monet', 'Picasso', 'Van Gogh'], 'j’adore le peintre Monet'),
    ('retour', 'Avec qui la personne veut-elle revenir au musée ?', ['Les enfants', 'Ses collègues', 'Ses parents'], 'revenir avec les enfants'),
])
scenario('ecole', 'les-etudes-2-4', [
    ('identite', 'Comment s’appelle la nouvelle professeure ?', ['Madame Vega', 'Madame Laurent', 'Madame Martin'], 'madame Vega'),
    ('matiere', 'Quelle matière enseigne-t-elle ?', ['Le français', 'Les mathématiques', 'La musique'], 'professeur de français'),
])
scenario('ecole', 'les-etudes-1-5', [
    ('objet', 'Quel objet la personne ne retrouve-t-elle pas ?', ['Son stylo', 'Son cahier', 'Son téléphone'], 'Tu n’as pas de stylo'),
    ('aide', 'Comment son interlocuteur l’aide-t-il ?', ['En lui prêtant le sien', 'En l’accompagnant au magasin', 'En cherchant chez elle'], 'prends celui-ci'),
])
scenario('vie-quotidienne', 'les-nouvelles-1', [
    ('destination', 'Où Kate a-t-elle voyagé ?', ['En Guyane', 'Au Canada', 'Au Japon'], 'ton voyage en Guyane'),
    ('meteo', 'Quel temps a-t-elle eu pendant son voyage ?', ['Du soleil', 'De la pluie', 'De la neige'], "du soleil tout le temps"),
])
scenario('vie-quotidienne', 'les-nouvelles-2', [
    ('ouverture', 'À quelle heure le magasin ouvre-t-il, selon l’interlocuteur ?', ['À 15 h', 'À 12 h', 'À 14 h'], 'À 15 heures je crois'),
    ('verification', 'Comment conseille-t-il de vérifier cet horaire ?', ['Sur Internet', 'Par téléphone', 'Dans le journal'], 'vérifie sur internet'),
])
scenario('vie-quotidienne', 'les-nouvelles-3', [
    ('sortie', 'Quel type de lieu est proposé pour la sortie avec Marc ?', ['Un musée', 'Un cinéma', 'Un théâtre'], "venir avec moi au musée d'histoire"),
    ('billets', 'Combien de billets la personne possède-t-elle ?', ['Deux', 'Un', 'Trois'], "J'ai 2 billets"),
])
scenario('vie-quotidienne', 'les-nouvelles-4', [
    ('famille', 'Quel est le lien entre Thomas et Sophie ?', ['Il est son frère', 'Il est son cousin', 'Il est son père'], 'Le frère de Sophie'),
    ('motif', 'Pourquoi Thomas a-t-il déménagé à Lyon ?', ['Pour ses études', 'Pour son travail', 'Pour rejoindre ses parents'], 'à Lyon pour ses études'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-1-1', [
    ('boisson', 'Quelle boisson Marine est-elle en train de boire ?', ['Du jus d’orange', 'De l’eau', 'Du lait'], 'boire mon jus d’orange'),
    ('reaction', 'Que fait Marine quand elle comprend son erreur ?', ['Elle s’excuse', 'Elle se fâche', 'Elle commande à boire'], 'Je suis désolée'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-2-1', [
    ('objet', 'Quel nouvel objet est montré ?', ['Un sac', 'Un manteau', 'Une valise'], 'mon nouveau sac'),
    ('qualite', 'Pourquoi la personne trouve-t-elle cet objet pratique ?', ['Elle peut y mettre beaucoup de choses', 'Il est imperméable', 'Il a des roulettes'], 'mettre beaucoup de choses à l’intérieur'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-1-2', [
    ('produit', 'Quel produit le client cherche-t-il ?', ['Des yaourts', 'Du pain', 'Des pommes'], 'Où sont les yaourts'),
    ('emplacement', 'Où ce produit se trouve-t-il dans le magasin ?', ['Au fond, au rayon frais', 'À l’entrée, près des caisses', 'À l’étage, près des vêtements'], 'Dans le rayon frais, au fond du magasin'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-2-2', [
    ('cours', 'Pour quel cours la personne cherche-t-elle une salle ?', ['L’italien', 'L’anglais', 'L’espagnol'], 'le cours d’italien'),
    ('etage', 'À quel étage se trouve cette salle ?', ['Au premier étage', 'Au deuxième étage', 'Au rez-de-chaussée'], 'au premier étage'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-1-3', [
    ('temperature', 'Quelle température est annoncée ?', ['30 degrés', '20 degrés', '25 degrés'], 'Il va faire 30 degrés'),
    ('sortie', 'Où la personne décide-t-elle d’aller ?', ['À la piscine', 'Au cinéma', 'À la bibliothèque'], 'Je vais aller à la piscine'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-2-3', [
    ('horaire', 'À quelle heure la personne a-t-elle rendez-vous ?', ['À 11 h', 'À 9 h', 'À 10 h'], 'rendez-vous avec le docteur Charpentier à 11 heures'),
    ('attente', 'Que lui propose-t-on de faire en attendant ?', ['S’asseoir', 'Revenir demain', 'Aller à la pharmacie'], 'Vous pouvez vous asseoir'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-1-4', [
    ('distance', 'Quelle distance la personne veut-elle courir ?', ['10 kilomètres', '5 kilomètres', '20 kilomètres'], 'Je veux courir 10 km'),
    ('etat', 'Comment dit-elle se sentir aujourd’hui ?', ['En forme', 'Fatiguée', 'Malade'], 'Je suis en forme aujourd’hui'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-2-4', [
    ('celia_metier', 'Quel est le métier de Célia Leblanc ?', ['Secrétaire', 'Comptable', 'Enseignante'], 'Célia Leblanc.\nJe suis la nouvelle secrétaire'),
    ('charlotte_metier', 'Quel est le métier de Charlotte Colombe ?', ['Comptable', 'Infirmière', 'Cuisinière'], 'Charlotte Colombe, je suis la comptable'),
])
scenario('vie-quotidienne', 'les-situations-du-quotidien-2-5', [
    ('livre', 'Quel type de livre la personne souhaite-t-elle prendre ?', ['Un roman', 'Un dictionnaire', 'Un livre de recettes'], 'Je peux prendre un roman'),
    ('quantite', 'Combien de livres peut-elle prendre, si elle le souhaite ?', ['Deux', 'Un', 'Trois'], 'prends deux livres si tu veux'),
])

CO_REVIEWS['/lib/audio/tcf/co/radio/a-l-aeroport-1.mp3'] = {
    'tag': 'moyen', 'rows': [
        ('attente', 'Où les passagers doivent-ils attendre ?', ['En salle 4', 'En salle 2', 'À la porte 5'], 'salle 4'),
        ('retard', 'Combien de temps de retard l’avion a-t-il ?', ['Deux heures', 'Une heure', 'Trois heures'], 'retard de 2 heures'),
        ('cause', 'Quel phénomène météo provoque le retard ?', ['La neige', 'La pluie', 'Le vent'], 'à cause de la neige'),
        ('gratuit', 'Que peut-on obtenir gratuitement en attendant ?', ['Des journaux', 'Des boissons', 'Des sandwiches'], 'journaux gratuits'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/hotel/01-hôtel-réservation-chambres-Langloi.mp3'] = {
    'tag': 'long', 'rows': [
        ('chambres_nombre', 'Combien de chambres Madame Langlois veut-elle réserver ?', ['Deux chambres', 'Une chambre', 'Quatre chambres'], 'deux chambres doubles'),
        ('chambres_type', 'Quel type de chambres souhaite-t-elle ?', ['Des chambres doubles', 'Des chambres simples', 'Des chambres familiales'], 'deux chambres doubles'),
        ('personnes', 'Pour combien de personnes réserve-t-elle ?', ['Quatre personnes', 'Deux personnes', 'Six personnes'], 'pour quatre personnes'),
        ('arrivee', 'À quelle date le séjour commence-t-il ?', ['Le 5 juin', 'Le 7 juin', 'Le 15 juin'], 'du 5 au 7 juin'),
        ('depart', 'À quelle date le séjour se termine-t-il ?', ['Le 7 juin', 'Le 5 juin', 'Le 9 juin'], 'du 5 au 7 juin'),
        ('repas', 'Quel repas souhaite-t-elle inclure dans le prix ?', ['Le petit-déjeuner', 'Le déjeuner', 'Le dîner'], 'avec petits déjeunés'),
        ('equipement', 'Quel équipement cherche-t-elle dans les chambres ?', ['Une baignoire', 'Une douche', 'Un ordinateur'], 'une bénouare dans les chambres'),
        ('paiement', 'Comment souhaite-t-elle payer ?', ['Par chèque', 'En espèces', 'Par carte bancaire'], 'régler par chèque'),
        ('transport', 'Comment les voyageurs viendront-ils à l’hôtel ?', ['En voiture', 'En train', 'En bus'], 'Nous viendrons en voiture'),
        ('contact', 'Comment demande-t-elle à l’hôtel de la contacter ?', ['Par téléphone', 'Par courriel', 'Par courrier postal'], 'Merci de me rappeler'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/magasins/achats-annonce-2.mp3'] = {
    'tag': 'long', 'rows': [
        ('enseigne', 'Quel est le nom du magasin qui diffuse l’annonce ?', ['Autoprix', 'Superprix', 'Miniprix'], 'supermarché Autoprix'),
        ('type_magasin', 'Dans quel type de magasin les promotions sont-elles proposées ?', ['Un supermarché', 'Une pharmacie', 'Une parfumerie'], 'votre supermarché'),
        ('produit', 'Quel produit, en plus du savon, bénéficie de l’offre « deuxième offert » ?', ['Le gel douche', 'Le shampoing', 'Le dentifrice'], 'un gel douche ou un savon'),
        ('offre', 'Quel avantage obtient-on en achetant l’un de ces produits ?', ['Le deuxième est offert', 'Le troisième est offert', 'Le premier est remboursé'], 'le deuxième est offert'),
        ('fin_offre', 'Jusqu’à quelle date cette offre est-elle valable ?', ['Le 30 avril', 'Le 1er mai', 'Le 31 mai'], 'jusqu’au 30 avril'),
        ('lot', 'Quels produits peut-on gagner au jeu ?', ['Des parfums', 'Des télévisions', 'Des savons'], 'gagner des parfums'),
        ('jeu', 'À quel jeu faut-il participer pour tenter de gagner ?', ['Une loterie', 'Un concours de chansons', 'Un quiz sur Internet'], 'jouer à la loterie'),
        ('lieu_jeu', 'Où ce jeu est-il organisé ?', ['Dans l’allée centrale', 'À l’entrée du magasin', 'Devant les caisses'], 'dans l’allée centrale du magasin'),
        ('debut_tv', 'Quand les promotions sur les télévisions commencent-elles ?', ['Le 1er mai', 'Le 30 avril', 'Le 1er juin'], 'à partir du 1er mai'),
        ('reduction', 'Quelle réduction maximale est annoncée sur les télévisions ?', ['40 %', '20 %', '50 %'], '40 % de réduction'),
    ],
    # Retranscription locale intégrale : date exacte absente de l’ancienne transcription.
    'transcription_replacements': [('jusqu’en avril', 'jusqu’au 30 avril')],
    'audio_verified': True,
}

CO_REVIEWS['/lib/audio/tcf/co/bibliotheque/02-bibliothèque-fermeture-exceptionnelle.mp3'] = {
    'tag': 'court', 'rows': [
        ('motif', 'Pourquoi le lieu est-il fermé ?', ['Pour une fermeture exceptionnelle', 'Parce que c’est dimanche', 'Parce qu’il n’y a plus de livres'], 'une fermeture exceptionnelle'),
        ('retour', 'Quand la personne compte-t-elle revenir ?', ['Demain', 'Ce soir', 'La semaine prochaine'], 'Je reviendrai demain'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/fetes/25-invitation-fête-d-anniversaire.mp3'] = {
    'tag': 'court', 'rows': [
        ('occasion', 'À quelle occasion cette fête est-elle organisée ?', ['Un anniversaire', 'Un mariage', 'Un départ à la retraite'], 'Tu fêtes ton anniversaire'),
        ('horaire', 'À quelle heure la fête commence-t-elle ?', ['À 20 h', 'À 18 h', 'À 21 h'], 'à 20 h'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/loisirs/moyen-a2__annonce-2.3.mp3'] = {
    'tag': 'moyen', 'rows': [
        ('lieu', 'Quel établissement est concerné par cette annonce ?', ['La bibliothèque', 'La piscine', 'Le musée'], 'la bibliothèque ferme'),
        ('horaire', 'À quelle heure cet établissement ferme-t-il ?', ['À 15 h 30', 'À 15 h', 'À 16 h'], 'à 15h30'),
        ('attente', 'Combien de temps reste-t-il avant la fermeture ?', ['Quinze minutes', 'Trente minutes', 'Une heure'], 'Il vous reste 15 minutes'),
        ('caractere', 'Comment cette fermeture est-elle présentée ?', ['Comme exceptionnelle', 'Comme définitive', 'Comme quotidienne'], 'ferme exceptionnellement'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/magasins/04-magasin-annonce-fermeture-de-la-poste.mp3'] = {
    'tag': 'moyen', 'rows': [
        ('etablissement', 'Quel établissement va fermer ?', ['La poste', 'La banque', 'La mairie'], 'la poste sera fermée'),
        ('motif', 'Pourquoi cet établissement va-t-il fermer ?', ['Pour des travaux', 'Pour les vacances du personnel', 'À cause d’une panne informatique'], 'en raison de travaux'),
        ('duree', 'Combien de temps la fermeture doit-elle durer ?', ['Une semaine', 'Une journée', 'Un mois'], 'pour une semaine'),
        ('debut', 'Quand la fermeture commence-t-elle ?', ['Demain', 'Aujourd’hui', 'La semaine prochaine'], 'à partir de demain'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/transports/moyen-a2__annonce-1.1.mp3'] = {
    'tag': 'moyen', 'rows': [
        ('ligne', 'Quelle ligne de métro est concernée ?', ['La ligne 1', 'La ligne 2', 'La ligne 3'], 'la ligne 1 du métro'),
        ('heure', 'À quelle heure la ligne ferme-t-elle les jours concernés ?', ['À 22 h 30', 'À 21 h', 'À 23 h'], 'à partir de 22h30'),
        ('frequence', 'À quelle fréquence la fermeture est-elle prévue ?', ['Tous les soirs', 'Un soir par semaine', 'Uniquement le lundi soir'], 'tous les soirs'),
        ('motif', 'Pourquoi la ligne doit-elle fermer ?', ['Pour réparer les voies', 'Pour nettoyer les stations', 'Pour former les conducteurs'], 'pour réparer les voies'),
    ],
}
CO_REVIEWS['/lib/audio/tcf/co/scènes courtes/10-fêtes-annonce-fête-de-la-nature.mp3'] = {
    'tag': 'moyen', 'rows': [
        ('evenement', 'Quelle activité est organisée pour la fête de la nature ?', ['Un pique-nique géant', 'Un concert', 'Une course à pied'], 'un pique-nique géant'),
        ('lieu', 'Où cette activité a-t-elle lieu ?', ['Au parc des Fleurs', 'Sur la plage', 'Sur la place de la mairie'], 'au parc des Fleurs'),
        ('panier', 'Que contient le panier-repas proposé ?', ['Un sandwich, une salade et une boisson', 'Une soupe, du pain et un fruit', 'Une pizza, un gâteau et du café'], 'sandwich, salade, boisson'),
        ('materiel', 'Que faut-il apporter en plus des couverts jetables ?', ['Des assiettes', 'Des chaises', 'Une nappe'], 'Apportez vos assiettes, des couverts jetables'),
    ],
}

CO_REVIEWS.update({
    '/lib/audio/tcf/co/radio/la-fete-des-meres.mp3': {'tag': 'moyen', 'rows': [
        ('occasion', 'À quelle occasion le magasin propose-t-il ces offres ?', ['La fête des mères', 'La fête des pères', 'La fête des grands-parents'], 'c’est la fête des mères'),
        ('ouverture', 'À quelle heure le magasin ouvre-t-il ?', ['À 10 h', 'À 9 h', 'À 11 h'], 'ouverts de 10 h à 19 h'),
        ('remise', 'Quelle réduction s’applique à tous les produits ?', ['15 %', '25 %', '10 %'], '15 % de réduction sur tous les produits'),
        ('chapeaux', 'Combien les chapeaux coûtent-ils pendant cette offre ?', ['25 euros', '15 euros', '35 euros'], '25 euros sur tous les chapeaux'),
    ]},
    '/lib/audio/tcf/co/actualite/03-actualité-la-fête-des-voisins.mp3': {'tag': 'moyen', 'rows': [
        ('evenement', 'Quelle fête est présentée dans cette annonce ?', ['La Fête des voisins', 'La Fête de la musique', 'La Fête du travail'], 'la Fête des voisins'),
        ('public', 'Qui est invité à organiser cette fête ?', ['Les Français', 'Les touristes étrangers', 'Les élèves uniquement'], 'les Français sont invités à organiser la fête'),
        ('date', 'À quelle date est-elle prévue cette année ?', ['Le vendredi 29 mai', 'Le vendredi 22 mai', 'Le samedi 30 mai'], 'le vendredi 29 mai'),
        ('buffet', 'Que les voisins doivent-ils apporter pour le buffet ?', ['Des plats à partager', 'Des fleurs', 'Des instruments de musique'], 'des plats chauds ou froids à partager'),
    ]},
    '/lib/audio/tcf/co/loisirs/la-fete-du-sport.mp3': {'tag': 'moyen', 'rows': [
        ('public', 'À quelle tranche d’âge cette annonce s’adresse-t-elle ?', ['De 12 à 17 ans', 'De 6 à 11 ans', 'De 18 à 25 ans'], 'entre 12 et 17 ans'),
        ('lieu', 'Où peut-on essayer les sports ?', ['Place de la Mairie', 'Au stade municipal', 'Dans le gymnase du collège'], 'place de la Mairie'),
        ('horaire', 'À quelle heure le tennis est-il proposé ?', ['À 10 h', 'À 9 h', 'À 14 h'], 'tennis à 10 h'),
        ('lot', 'Quel objet peut-on gagner ?', ['Un ballon', 'Une raquette', 'Un vélo'], 'gagner un ballon'),
    ]},
    '/lib/audio/tcf/co/travail/04-travail-confirmation-cours-d-informatique.mp3': {'tag': 'long', 'rows': [
        ('appelant', 'Comment la personne qui appelle se prénomme-t-elle ?', ['Jérôme', 'Julien', 'Jacques'], 'c’est Jérôme'),
        ('organisme', 'Quel organisme organise la formation ?', ['Formation ABC', 'Formation Plus', 'Institut Formation'], 'de Formation ABC'),
        ('but', 'Pourquoi cette personne appelle-t-elle ?', ['Pour confirmer une inscription', 'Pour annuler un cours', 'Pour annoncer un changement de prix'], 'pour confirmer votre inscription'),
        ('sujet', 'Sur quel sujet porte la formation ?', ['L’informatique', 'La comptabilité', 'Les langues'], 'la formation d’informatique'),
        ('debut', 'Quel jour la formation commence-t-elle ?', ['Lundi', 'Mardi', 'Jeudi'], 'nous organisons lundi'),
        ('duree', 'Combien de jours la formation dure-t-elle ?', ['Quatre jours', 'Trois jours', 'Cinq jours'], 'pendant 4 jours'),
        ('matin', 'À quelle heure les cours commencent-ils le matin ?', ['À 9 h', 'À 8 h', 'À 10 h'], 'le matin de 9h à midi'),
        ('apres_midi', 'À quelle heure les cours reprennent-ils après le déjeuner ?', ['À 13 h 15', 'À 13 h 30', 'À 14 h'], 'de 13h15 à 16h15'),
        ('materiel', 'Quel matériel sera remis le premier jour ?', ['Un stylo et du papier', 'Un ordinateur portable', 'Un manuel et une clé USB'], 'un stylo et du papier'),
        ('document', 'Quel document faut-il apporter ?', ['Une pièce d’identité', 'Un diplôme', 'Un justificatif de domicile'], 'N’oubliez pas votre pièce d’identité'),
    ]},
    '/lib/audio/tcf/co/travail/la-formation-professionnelle.mp3': {'tag': 'long', 'rows': [
        ('service', 'Dans quel service Marie travaille-t-elle ?', ['Les ressources humaines', 'La comptabilité', 'Le service commercial'], 'Marie du service des ressources humaines'),
        ('langue', 'Quelle langue les cours permettent-ils d’apprendre ?', ['L’espagnol', 'L’anglais', 'L’allemand'], "cours d'espagnol professionnel"),
        ('lieu', 'Où les cours doivent-ils avoir lieu pour obtenir l’accord de la directrice ?', ['Dans l’entreprise', 'Chez le professeur', 'Dans une école de langues'], "si les cours ont lieu dans l'entreprise"),
        ('nationalite', 'Quelle est la nationalité du professeur ?', ['Argentine', 'Espagnole', 'Mexicaine'], 'Le professeur est argentin'),
        ('debut', 'À quelle heure le cours commence-t-il ?', ['À 13 h', 'À 12 h', 'À 14 h'], 'de 13 heures à 14h30'),
        ('fin', 'À quelle heure le cours se termine-t-il ?', ['À 14 h 30', 'À 14 h', 'À 15 h'], 'de 13 heures à 14h30'),
        ('jour', 'Quel jour le professeur vient-il ?', ['Le mardi', 'Le lundi', 'Le jeudi'], 'tous les mardi'),
        ('contact', 'Comment faut-il signaler son intérêt à Marie ?', ['Par courriel', 'Par téléphone', 'Par courrier postal'], "tu dois m'envoyer un mail"),
        ('entretien', 'Avec qui faut-il passer un entretien ensuite ?', ['Le professeur', 'La directrice', 'La comptable'], 'un petit entretien avec le professeur'),
        ('objectif', 'À quoi cet entretien sert-il ?', ['À connaître son niveau', 'À fixer le prix des cours', 'À choisir le lieu de formation'], 'pour connaître ton niveau'),
    ]},
    '/lib/audio/tcf/co/transports/moyen-a2__radio-14.3.mp3': {'tag': 'moyen', 'rows': [
        ('reseau', 'Quel réseau de transport connaît des perturbations ?', ['Le métro parisien', 'Les bus de Lyon', 'Les trains de Marseille'], 'dans le métro parisien'),
        ('cause', 'Quelle est la cause des perturbations ?', ['Une grève du personnel', 'Une panne de courant', 'Des travaux sur les voies'], 'Le personnel organise une grève'),
        ('periode', 'Quand ces perturbations sont-elles prévues ?', ['Aujourd’hui et demain', 'Demain seulement', 'Toute la semaine prochaine'], 'aujourd’hui et demain'),
        ('proportion', 'Quelle proportion des trains doit circuler ?', ['Deux trains sur quatre', 'Un train sur quatre', 'Trois trains sur quatre'], 'Seuls 2 trains sur 4'),
    ]},
    '/lib/audio/tcf/co/actualite/02-actualité-la-grève-hôtesse-de-l-air.mp3': {'tag': 'moyen', 'rows': [
        ('profession', 'Quelle profession est en grève ?', ['Les hôtesses de l’air', 'Les conducteurs de train', 'Les contrôleurs de métro'], 'grève à prévoir chez les hôtesses de l’air'),
        ('duree', 'Quelle nouvelle durée de grève est annoncée ?', ['Une semaine', 'Une journée', 'Un mois'], 'une nouvelle semaine de grève'),
        ('demandes', 'Quelles améliorations les grévistes demandent-elles ?', ['Un meilleur salaire et davantage de congés', 'Des journées plus longues et moins de congés', 'Une nouvelle formation et un nouvel uniforme'], 'un meilleur salaire et des jours de congés supplémentaires'),
        ('reponse', 'Quelle est la réaction du ministère des Transports à ce stade ?', ['Il n’a pas encore répondu', 'Il a accepté les demandes', 'Il a refusé les demandes'], 'n’a pas encore répondu'),
    ]},
    '/lib/audio/tcf/co/transports/moyen-a2__radio-17.2.mp3': {'tag': 'moyen', 'rows': [
        ('heure', 'À quelle heure ce bulletin est-il diffusé ?', ['À 8 h', 'À 9 h', 'À 7 h'], 'il est 8h'),
        ('etendue', 'Quelle zone est concernée par la grève ?', ['Toute la France', 'La région parisienne seulement', 'Le sud de la France seulement'], 'dans toute la France'),
        ('trains', 'Quelle proportion des trains circulera ?', ['Un train sur cinq', 'Un train sur deux', 'Quatre trains sur cinq'], '1 train sur 5 circulera'),
        ('information', 'Où faut-il consulter le programme des trains ?', ['Sur le site Internet de la SNCF', 'À la mairie', 'Sur le site de l’aéroport'], 'consultez le site internet de la SNCF'),
    ]},
    '/lib/audio/tcf/co/magasins/05-magasin-annonce-journée-de-la-femme.mp3': {'tag': 'moyen', 'rows': [
        ('occasion', 'À quelle occasion cette offre est-elle proposée ?', ['La journée de la femme', 'La fête des mères', 'La fête des pères'], 'à l’occasion de la journée de la femme'),
        ('condition', 'Que faut-il acheter pour bénéficier de la remise ?', ['Deux vêtements', 'Deux bijoux', 'Un sac à main'], 'pour deux vêtements achetés'),
        ('remise', 'Quel pourcentage de réduction est annoncé sur les bijoux ?', ['70 %', '50 %', '30 %'], 'une remise de 70% sur nos bijoux'),
        ('nouveaute', 'Quels nouveaux articles le magasin invite-t-il à découvrir ?', ['Des sacs à main', 'Des chaussures', 'Des montres'], 'nos nouveaux sacs à main'),
    ]},
    '/lib/audio/tcf/co/radio/06-radio-promotion-fleurs-grands-parents.mp3': {'tag': 'moyen', 'rows': [
        ('occasion', 'À quelle occasion cette publicité est-elle diffusée ?', ['La journée des grands-parents', 'La Saint-Valentin', 'La fête de la musique'], 'la journée des grands-parents'),
        ('remise', 'Quelle réduction la publicité annonce-t-elle ?', ['25 %', '15 %', '35 %'], 'une remise exceptionnelle de 25 %'),
        ('produit', 'Sur quels produits cette réduction s’applique-t-elle ?', ['Les bouquets de fleurs', 'Les chocolats', 'Les parfums'], 'sur tous nos bouquets de fleurs'),
        ('code', 'Quel code faut-il utiliser pour profiter de l’offre ?', ['FLEURSENFÊTE', 'BONNEFÊTE', 'FLEURSPRINTEMPS'], 'le code FLEURSENFÊTE'),
    ]},
    '/lib/audio/tcf/co/poste/01-poste-envoyer-lettre-recommandée.mp3': {'tag': 'moyen', 'rows': [
        ('envoi', 'Quel type d’envoi la personne souhaite-t-elle effectuer ?', ['Une lettre recommandée', 'Une lettre simple', 'Un colis express'], 'envoyer une lettre recommandée'),
        ('document', 'Quel document reçoit-on après cet envoi ?', ['Un accusé de réception', 'Une carte postale', 'Un bon de réduction'], 'vous recevez chez vous un accusé de réception'),
        ('preuve', 'Que permet de prouver ce document ?', ['Que le destinataire a reçu la lettre', 'Que le destinataire a répondu', 'Que la lettre a été lue'], 'la preuve que le destinataire a bien reçu votre lettre'),
        ('prix', 'Combien cet envoi coûte-t-il ?', ['4,55 euros', '5,45 euros', '4,05 euros'], '4,55 euros'),
    ]},
    '/lib/audio/tcf/co/radio/la-meteo.mp3': {'tag': 'moyen', 'rows': [
        ('pays', 'Pour quel pays ce bulletin météo donne-t-il des prévisions ?', ['La Belgique', 'La France', 'La Suisse'], 'sur la Belgique'),
        ('vent', 'Quelle vitesse du vent est annoncée ?', ['Environ 25 km/h', 'Environ 15 km/h', 'Environ 35 km/h'], 'environ 25 km par heure'),
        ('nuages', 'Dans quelle partie du pays y a-t-il des nuages ?', ['À l’est', 'À l’ouest', 'Au sud'], 'des nuages à l’est'),
        ('air', 'Comment est la qualité de l’air ?', ['Bonne', 'Mauvaise', 'Très mauvaise'], 'La qualité de l’air est bonne'),
    ]},
    '/lib/audio/tcf/co/radio/11-radio-prévision-météo-2.mp3': {'tag': 'moyen', 'rows': [
        ('sud', 'Quel temps fait-il dans le sud aujourd’hui ?', ['Chaud et beau', 'Froid et pluvieux', 'Froid et neigeux'], 'il fait chaud et beau'),
        ('nord_matin', 'Quel temps est prévu dans le nord le matin ?', ['De la pluie', 'De la neige', 'Du soleil'], 'il va pleuvoir le matin'),
        ('nord_apres_midi', 'Que prévoit-on dans le nord l’après-midi ?', ['Le retour du soleil', 'Un orage', 'Du brouillard'], 'le soleil revient l’après-midi'),
        ('demain', 'Quel phénomène est annoncé dans toute la France demain ?', ['Du vent', 'De la neige', 'Du brouillard'], 'demain, du vent sur toute la France'),
    ]},
})

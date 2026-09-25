import type { ComprehensionEcritedoc } from './comprehension-ecrite'

export const COMPREHENSION_ECRITE_DOCS: ComprehensionEcritedoc[] = [
  // ——— A1 ———
  {
    id: 'a1-01',
    level: 'a1',
    themes: ['fr-presenter', 'fr-journee'],
    title: 'Message d\'Amira',
    text:
      'Salut Léo,\nC\'est Amira. Je suis étudiante à Lausanne. J\'ai vingt ans. Ma mère habite à Berne. Aujourd\'hui je vais à la bibliothèque. Je lis un livre en français. Le cours commence à dix heures demain.\nAmira',
    questions: [
      {
        prompt: 'Où habite la mère d\'Amira ?',
        options: ['À Berne', 'À Lausanne', 'À Genève'],
        answer: 'À Berne',
      },
      {
        prompt: 'Où va Amira aujourd\'hui ?',
        options: ['À la bibliothèque', 'Au parc', 'Au cinéma'],
        answer: 'À la bibliothèque',
      },
      {
        prompt: 'À quelle heure commence le cours demain ?',
        options: ['À dix heures', 'À huit heures', 'À quatorze heures'],
        answer: 'À dix heures',
      },
    ],
  },
  {
    id: 'a1-02',
    level: 'a1',
    themes: ['fr-famille', 'fr-nourriture'],
    title: 'Le matin à la maison',
    text:
      'Il est sept heures. Papa prépare le petit déjeuner. Ma sœur Mina boit du thé. Moi, je mange du pain et de la confiture. Ma grand-mère arrive à huit heures. Nous parlons français à table. Puis Mina part à l\'école.',
    questions: [
      {
        prompt: 'Qui boit du thé ?',
        options: ['Mina', 'Papa', 'La grand-mère'],
        answer: 'Mina',
      },
      {
        prompt: 'Qu\'est-ce que l\'auteur mange ?',
        options: ['Du pain et de la confiture', 'Du riz', 'De la soupe'],
        answer: 'Du pain et de la confiture',
      },
      {
        prompt: 'À quelle heure arrive la grand-mère ?',
        options: ['À huit heures', 'À sept heures', 'À neuf heures'],
        answer: 'À huit heures',
      },
    ],
  },
  {
    id: 'a1-03',
    level: 'a1',
    themes: ['fr-logement', 'fr-description'],
    title: 'Annonce : chambre à louer',
    text:
      'Chambre à Martigny, centre-ville. La chambre est petite et lumineuse. Il y a un lit, un bureau et une armoire. La cuisine est commune. Le loyer est de quatre cent cinquante francs par mois. Contact : Mme Dubois, téléphone zéro sept neuf trois deux un zéro huit.',
    questions: [
      {
        prompt: 'Où se trouve la chambre ?',
        options: ['À Martigny', 'À Sion', 'À Genève'],
        answer: 'À Martigny',
      },
      {
        prompt: 'Qu\'est-ce qu\'il y a dans la chambre ?',
        options: ['Un lit, un bureau et une armoire', 'Un canapé et une télé', 'Une douche privée'],
        answer: 'Un lit, un bureau et une armoire',
      },
      {
        prompt: 'Combien coûte le loyer par mois ?',
        options: ['Quatre cent cinquante francs', 'Trois cent francs', 'Six cent francs'],
        answer: 'Quatre cent cinquante francs',
      },
    ],
  },
  {
    id: 'a1-04',
    level: 'a1',
    themes: ['fr-achats', 'fr-journee'],
    title: 'Marché du samedi',
    text:
      'Annonce à Vevey : le marché ouvre samedi à huit heures. Vous trouvez des fruits, des légumes et du fromage. Les stands sont place du Marché. Apportez un sac réutilisable. Le marché ferme à treize heures. Entrée gratuite pour tous.',
    questions: [
      {
        prompt: 'Quand ouvre le marché ?',
        options: ['Samedi à huit heures', 'Dimanche à dix heures', 'Vendredi à midi'],
        answer: 'Samedi à huit heures',
      },
      {
        prompt: 'Qu\'est-ce qu\'on peut acheter ?',
        options: ['Des fruits, des légumes et du fromage', 'Des chaussures', 'Des livres'],
        answer: 'Des fruits, des légumes et du fromage',
      },
      {
        prompt: 'À quelle heure ferme le marché ?',
        options: ['À treize heures', 'À dix-huit heures', 'À vingt heures'],
        answer: 'À treize heures',
      },
    ],
  },
  {
    id: 'a1-05',
    level: 'a1',
    themes: ['fr-vetements', 'fr-achats'],
    title: 'Soldes en ville',
    text:
      'Brève : la boutique Lina Mode à Neuchâtel fait les soldes cette semaine. Les manteaux coûtent cinquante francs. Les pulls coûtent vingt-cinq francs. La boutique est rue du Seyon. Elle ouvre de dix heures à dix-huit heures. Paiement en espèces ou par carte.',
    questions: [
      {
        prompt: 'Où est la boutique ?',
        options: ['À Neuchâtel', 'À Lausanne', 'À Fribourg'],
        answer: 'À Neuchâtel',
      },
      {
        prompt: 'Combien coûte un manteau ?',
        options: ['Cinquante francs', 'Cent francs', 'Dix francs'],
        answer: 'Cinquante francs',
      },
      {
        prompt: 'Jusqu\'à quelle heure la boutique est-elle ouverte ?',
        options: ['Dix-huit heures', 'Midi', 'Vingt et une heures'],
        answer: 'Dix-huit heures',
      },
    ],
  },
  {
    id: 'a1-06',
    level: 'a1',
    themes: ['fr-nourriture'],
    title: 'Faire une salade',
    text:
      'Mode d\'emploi simple. Prenez une salade verte. Lavez la salade avec de l\'eau froide. Coupez une tomate et un concombre. Mettez les légumes dans un bol. Ajoutez un peu d\'huile et de sel. Mélangez avec une cuillère. Servez la salade fraîche.',
    questions: [
      {
        prompt: 'Que faut-il laver ?',
        options: ['La salade verte', 'Le pain', 'La viande'],
        answer: 'La salade verte',
      },
      {
        prompt: 'Quels légumes faut-il couper ?',
        options: ['Une tomate et un concombre', 'Une pomme et une poire', 'Du fromage'],
        answer: 'Une tomate et un concombre',
      },
      {
        prompt: 'Avec quoi mélange-t-on la salade ?',
        options: ['Avec une cuillère', 'Avec un fouet', 'Avec les mains seulement'],
        answer: 'Avec une cuillère',
      },
    ],
  },
  {
    id: 'a1-07',
    level: 'a1',
    themes: ['fr-sante'],
    title: 'SMS au médecin',
    text:
      'Bonjour,\nC\'est Youssef. J\'ai rendez-vous mardi à quinze heures trente. J\'ai mal à la gorge depuis hier. Est-ce que je dois apporter ma carte d\'assurance ? Merci pour la réponse.\nYoussef',
    questions: [
      {
        prompt: 'Quand est le rendez-vous ?',
        options: ['Mardi à quinze heures trente', 'Lundi à neuf heures', 'Mercredi à midi'],
        answer: 'Mardi à quinze heures trente',
      },
      {
        prompt: 'Quel est le problème de Youssef ?',
        options: ['Mal à la gorge', 'Mal au pied', 'Mal aux dents'],
        answer: 'Mal à la gorge',
      },
      {
        prompt: 'Depuis quand Youssef a mal ?',
        options: ['Depuis hier', 'Depuis un mois', 'Depuis ce matin seulement'],
        answer: 'Depuis hier',
      },
    ],
  },
  {
    id: 'a1-08',
    level: 'a1',
    themes: ['fr-transports'],
    title: 'Horaires du bus 5',
    text:
      'Notice : bus numéro cinq, ligne Sion – Conthey. Le premier bus part de Sion à six heures quinze. Un bus passe toutes les vingt minutes le matin. Le dernier bus quitte Conthey à vingt-deux heures. Un billet coûte deux francs soixante. Les enfants de moins de six ans voyagent gratis.',
    questions: [
      {
        prompt: 'Quelle ligne est décrite ?',
        options: ['Sion – Conthey', 'Lausanne – Genève', 'Neuchâtel – Bienne'],
        answer: 'Sion – Conthey',
      },
      {
        prompt: 'À quelle heure part le premier bus de Sion ?',
        options: ['À six heures quinze', 'À huit heures', 'À midi'],
        answer: 'À six heures quinze',
      },
      {
        prompt: 'Combien coûte un billet ?',
        options: ['Deux francs soixante', 'Cinq francs', 'Un franc'],
        answer: 'Deux francs soixante',
      },
    ],
  },
  {
    id: 'a1-09',
    level: 'a1',
    themes: ['fr-inviter', 'fr-famille'],
    title: 'Invitation anniversaire',
    text:
      'Chère voisine,\nMon fils Kenji a dix ans samedi prochain. La fête est à quinze heures chez nous, rue des Lilas à Yverdon. Il y aura un gâteau au chocolat et des jeux dans le jardin. Merci de confirmer avant jeudi.\nCordialement,\nMei Lin',
    questions: [
      {
        prompt: 'Quel âge a Kenji ?',
        options: ['Dix ans', 'Huit ans', 'Douze ans'],
        answer: 'Dix ans',
      },
      {
        prompt: 'À quelle heure commence la fête ?',
        options: ['À quinze heures', 'À dix-neuf heures', 'À midi'],
        answer: 'À quinze heures',
      },
      {
        prompt: 'Où a lieu la fête ?',
        options: ['Rue des Lilas à Yverdon', 'À l\'école', 'Au parc de Lausanne'],
        answer: 'Rue des Lilas à Yverdon',
      },
    ],
  },
  {
    id: 'a1-10',
    level: 'a1',
    themes: ['fr-travail'],
    title: 'Job d\'été au café',
    text:
      'Offre : le Café Central à Montreux cherche une personne pour l\'été. Le travail est du lundi au vendredi. Les horaires sont de huit heures à quatorze heures. Vous servez des boissons et vous lavez des tasses. Envoyez un e-mail avec votre nom et votre téléphone.',
    questions: [
      {
        prompt: 'Où est le café ?',
        options: ['À Montreux', 'À Berne', 'À Zurich'],
        answer: 'À Montreux',
      },
      {
        prompt: 'Quels jours travaille-t-on ?',
        options: ['Du lundi au vendredi', 'Seulement le samedi', 'Tous les jours'],
        answer: 'Du lundi au vendredi',
      },
      {
        prompt: 'Que faut-il envoyer pour postuler ?',
        options: ['Un e-mail avec nom et téléphone', 'Une lettre par la poste', 'Rien'],
        answer: 'Un e-mail avec nom et téléphone',
      },
    ],
  },
  {
    id: 'a1-11',
    level: 'a1',
    themes: ['fr-loisirs', 'fr-journee'],
    title: 'Après-midi au parc',
    text:
      'Samedi après-midi, Omar va au parc avec son chien Néo. Il fait beau et il y a du soleil. Omar lit un journal sur un banc. Néo court près du lac. À seize heures, Omar rentre à la maison. Il prépare le dîner avec sa femme Aïcha.',
    questions: [
      {
        prompt: 'Avec qui Omar va au parc ?',
        options: ['Avec son chien Néo', 'Avec sa sœur', 'Seul'],
        answer: 'Avec son chien Néo',
      },
      {
        prompt: 'Qu\'est-ce qu\'Omar fait sur le banc ?',
        options: ['Il lit un journal', 'Il dort', 'Il nage'],
        answer: 'Il lit un journal',
      },
      {
        prompt: 'À quelle heure Omar rentre ?',
        options: ['À seize heures', 'À huit heures', 'À vingt heures'],
        answer: 'À seize heures',
      },
    ],
  },
  {
    id: 'a1-12',
    level: 'a1',
    themes: ['fr-loisirs', 'fr-inviter'],
    title: 'Cinéma ce soir',
    text:
      'Salut Inès,\nLe film commence à vingt heures au Rex à Fribourg. C\'est une comédie en français. Mon billet coûte quinze francs. Tu viens avec moi ? Réponds avant dix-sept heures. On peut boire un thé après le film.\nNadia',
    questions: [
      {
        prompt: 'À quelle heure commence le film ?',
        options: ['À vingt heures', 'À dix-huit heures', 'À midi'],
        answer: 'À vingt heures',
      },
      {
        prompt: 'Quel type de film est-ce ?',
        options: ['Une comédie', 'Un documentaire', 'Un film d\'horreur'],
        answer: 'Une comédie',
      },
      {
        prompt: 'Où se passe la séance ?',
        options: ['Au Rex à Fribourg', 'À Lausanne', 'À Genève'],
        answer: 'Au Rex à Fribourg',
      },
    ],
  },
  {
    id: 'a1-13',
    level: 'a1',
    themes: ['fr-description', 'fr-journee'],
    title: 'Mon cartable',
    text:
      'Voici mon cartable bleu. Il est grand et lourd. Il y a trois cahiers, deux stylos et une règle. J\'ai aussi une pomme pour la récréation. Le cartable a deux poches devant. Je le mets près de la porte chaque soir.',
    questions: [
      {
        prompt: 'De quelle couleur est le cartable ?',
        options: ['Bleu', 'Rouge', 'Vert'],
        answer: 'Bleu',
      },
      {
        prompt: 'Qu\'est-ce qu\'il y a pour la récréation ?',
        options: ['Une pomme', 'Un sandwich', 'Du chocolat'],
        answer: 'Une pomme',
      },
      {
        prompt: 'Où met-on le cartable le soir ?',
        options: ['Près de la porte', 'Sous le lit', 'Dans la cuisine'],
        answer: 'Près de la porte',
      },
    ],
  },
  {
    id: 'a1-14',
    level: 'a1',
    themes: ['fr-presenter', 'fr-travail'],
    title: 'E-mail à la professeure',
    text:
      'Bonjour Madame Keller,\nJe m\'appelle Diego. Je suis dans votre cours de français le mardi matin. Je ne viens pas demain car je vais chez le médecin. Pouvez-vous me donner les devoirs par e-mail ? Merci beaucoup.\nDiego Ramirez',
    questions: [
      {
        prompt: 'Comment s\'appelle l\'élève ?',
        options: ['Diego Ramirez', 'Keller Diego', 'Ramirez Keller'],
        answer: 'Diego Ramirez',
      },
      {
        prompt: 'Pourquoi Diego ne vient pas demain ?',
        options: ['Il va chez le médecin', 'Il part en vacances', 'Il travaille'],
        answer: 'Il va chez le médecin',
      },
      {
        prompt: 'Quand a lieu le cours de Diego ?',
        options: ['Le mardi matin', 'Le jeudi soir', 'Le samedi'],
        answer: 'Le mardi matin',
      },
    ],
  },
  {
    id: 'a1-15',
    level: 'a1',
    themes: ['fr-famille'],
    title: 'Chez grand-père',
    text:
      'Dimanche, Lina visite son grand-père à Sierre. Il habite une maison avec un grand jardin. Ils plantent des tomates ensemble. Le grand-père raconte des histoires du village. Lina mange une soupe chaude à midi. Elle rentre en train à dix-sept heures.',
    questions: [
      {
        prompt: 'Où habite le grand-père ?',
        options: ['À Sierre', 'À Berne', 'À Paris'],
        answer: 'À Sierre',
      },
      {
        prompt: 'Qu\'est-ce qu\'ils plantent ?',
        options: ['Des tomates', 'Des roses', 'Des pommes de terre'],
        answer: 'Des tomates',
      },
      {
        prompt: 'Comment Lina rentre-t-elle ?',
        options: ['En train', 'En avion', 'À vélo'],
        answer: 'En train',
      },
    ],
  },
  {
    id: 'a1-16',
    level: 'a1',
    themes: ['fr-nourriture', 'fr-achats'],
    title: 'Avis sur la boulangerie',
    text:
      'Forum : j\'achète du pain chez Boulangerie du Pont à Nyon. Le pain est chaud le matin. Les croissants coûtent un franc cinquante. La vendeuse est très gentille. La boulangerie ferme le lundi. Je recommande cette adresse aux voisins.',
    questions: [
      {
        prompt: 'Où est la boulangerie ?',
        options: ['À Nyon', 'À Sion', 'À Bâle'],
        answer: 'À Nyon',
      },
      {
        prompt: 'Combien coûtent les croissants ?',
        options: ['Un franc cinquante', 'Trois francs', 'Cinq francs'],
        answer: 'Un franc cinquante',
      },
      {
        prompt: 'Quel jour la boulangerie est-elle fermée ?',
        options: ['Le lundi', 'Le samedi', 'Le jeudi'],
        answer: 'Le lundi',
      },
    ],
  },
  {
    id: 'a1-17',
    level: 'a1',
    themes: ['fr-logement'],
    title: 'Studio meublé',
    text:
      'À louer : studio meublé à La Chaux-de-Fonds. Le studio a une kitchenette et une salle de bain. Le loyer est de six cent francs par mois. Les charges sont incluses. Pas d\'animaux. Visite possible mercredi après-midi. Téléphone : zéro trois deux zéro zéro un deux trois.',
    questions: [
      {
        prompt: 'Quelle ville est mentionnée ?',
        options: ['La Chaux-de-Fonds', 'Lausanne', 'Lugano'],
        answer: 'La Chaux-de-Fonds',
      },
      {
        prompt: 'Combien coûte le loyer ?',
        options: ['Six cent francs par mois', 'Quatre cent francs', 'Mille francs'],
        answer: 'Six cent francs par mois',
      },
      {
        prompt: 'Est-ce que les animaux sont acceptés ?',
        options: ['Non, pas d\'animaux', 'Oui, tous les animaux', 'Seulement les chats'],
        answer: 'Non, pas d\'animaux',
      },
    ],
  },
  {
    id: 'a1-18',
    level: 'a1',
    themes: ['fr-sante', 'fr-loisirs'],
    title: 'Course le matin',
    text:
      'Chaque matin, Paula court trente minutes près du Rhône à Genève. Elle porte des chaussures de sport bleues. Elle boit de l\'eau après la course. Le médecin dit que la course est bonne pour le cœur. Paula court avec son amie Fatou le samedi.',
    questions: [
      {
        prompt: 'Combien de temps Paula court-elle ?',
        options: ['Trente minutes', 'Cinq minutes', 'Deux heures'],
        answer: 'Trente minutes',
      },
      {
        prompt: 'Où court Paula ?',
        options: ['Près du Rhône à Genève', 'Dans la montagne', 'À la piscine'],
        answer: 'Près du Rhône à Genève',
      },
      {
        prompt: 'Avec qui Paula court-elle le samedi ?',
        options: ['Avec son amie Fatou', 'Avec son frère', 'Seule'],
        answer: 'Avec son amie Fatou',
      },
    ],
  },
  {
    id: 'a1-19',
    level: 'a1',
    themes: ['fr-transports'],
    title: 'Métro à Lausanne',
    text:
      'Brève locale : le métro m2 à Lausanne relie Ouchy au centre. Un train passe toutes les six minutes en journée. Le billet coûte le même prix qu\'un bus. Les vélos sont interdits aux heures de pointe. Le service commence à cinq heures du matin.',
    questions: [
      {
        prompt: 'Quelle ligne est mentionnée ?',
        options: ['Le métro m2', 'Le bus 5', 'Le train IC'],
        answer: 'Le métro m2',
      },
      {
        prompt: 'Où va le métro depuis Ouchy ?',
        options: ['Vers le centre', 'Vers Berne', 'Vers l\'aéroport seulement'],
        answer: 'Vers le centre',
      },
      {
        prompt: 'Quand les vélos sont-ils interdits ?',
        options: ['Aux heures de pointe', 'Le dimanche', 'Jamais'],
        answer: 'Aux heures de pointe',
      },
    ],
  },
  {
    id: 'a1-20',
    level: 'a1',
    themes: ['fr-loisirs', 'fr-inviter'],
    title: 'Atelier poterie',
    text:
      'Invitation : atelier poterie samedi à dix heures à Delémont. Vous fabriquez un bol en argile. Le cours dure deux heures. Apportez un tablier. Le prix est de trente-cinq francs par personne. Inscription par message avant vendredi soir. Places limitées.',
    questions: [
      {
        prompt: 'Où a lieu l\'atelier ?',
        options: ['À Delémont', 'À Zurich', 'À Martigny'],
        answer: 'À Delémont',
      },
      {
        prompt: 'Qu\'est-ce que les participants fabriquent ?',
        options: ['Un bol en argile', 'Un tableau', 'Un gâteau'],
        answer: 'Un bol en argile',
      },
      {
        prompt: 'Que faut-il apporter ?',
        options: ['Un tablier', 'Un marteau', 'Un ordinateur'],
        answer: 'Un tablier',
      },
    ],
  },
  // ——— A2 ———
  {
    id: 'a2-01',
    level: 'a2',
    themes: ['fr-presenter', 'fr-travail'],
    title: 'Lettre de motivation courte',
    text:
      'Madame, Monsieur,\nJe m\'appelle Hana Benali. J\'habite à Bienne et je cherche un stage en hôtellerie. J\'ai terminé un cours de français l\'année dernière. Je parle arabe, français et un peu allemand. Je suis ponctuelle et j\'aime travailler en équipe. J\'ai déjà aidé deux week-ends dans un hôtel familial à Neuchâtel. Je suis disponible dès le premier juin pour trois mois. Je joins mon CV.\nRespectueusement,\nHana Benali',
    questions: [
      {
        prompt: 'Pour combien de temps Hana cherche-t-elle un stage ?',
        options: ['Trois mois', 'Une semaine', 'Deux ans'],
        answer: 'Trois mois',
      },
      {
        prompt: 'Quelles langues Hana parle-t-elle ?',
        options: ['Arabe, français et un peu allemand', 'Seulement français', 'Français et italien couramment'],
        answer: 'Arabe, français et un peu allemand',
      },
      {
        prompt: 'Quand Hana peut-elle commencer ?',
        options: ['Dès le premier juin', 'En janvier', 'Elle ne précise pas de date'],
        answer: 'Dès le premier juin',
      },
    ],
  },
  {
    id: 'a2-02',
    level: 'a2',
    themes: ['fr-famille', 'fr-journee'],
    title: 'Un dimanche chez les parents',
    text:
      'Le dimanche dernier, Karim est allé chez ses parents à Morges. Sa mère a préparé un repas avec du poulet et du riz. Son père a raconté son voyage en train dans les Alpes. Le petit frère de Karim, Sami, a dessiné des montagnes. Après le déjeuner, la famille a marché au bord du lac. Karim est rentré chez lui à dix-huit heures. Demain, il va rappeler sa sœur à l\'étranger.',
    questions: [
      {
        prompt: 'Où Karim a-t-il mangé le poulet et le riz ?',
        options: ['Chez ses parents à Morges', 'Au restaurant', 'À l\'école'],
        answer: 'Chez ses parents à Morges',
      },
      {
        prompt: 'Qu\'a fait Sami pendant la visite ?',
        options: ['Il a dessiné des montagnes', 'Il a nagé dans le lac', 'Il a travaillé'],
        answer: 'Il a dessiné des montagnes',
      },
      {
        prompt: 'Que fera Karim demain ?',
        options: ['Il va rappeler sa sœur', 'Il part en vacances', 'Il déménage'],
        answer: 'Il va rappeler sa sœur',
      },
    ],
  },
  {
    id: 'a2-03',
    level: 'a2',
    themes: ['fr-description', 'fr-logement'],
    title: 'Visite d\'appartement',
    text:
      'Annonce suivie d\'un compte rendu : l\'appartement à Renens a deux chambres et un balcon. Les fenêtres donnent sur une cour calme. Le loyer est de mille cent francs, charges comprises. Le locataire précédent a laissé des étagères dans le salon. La visite a eu lieu mardi ; les candidats doivent envoyer leurs documents avant vendredi. Un dépôt de garantie est demandé.',
    questions: [
      {
        prompt: 'Combien de chambres a l\'appartement ?',
        options: ['Deux chambres', 'Une chambre', 'Quatre chambres'],
        answer: 'Deux chambres',
      },
      {
        prompt: 'Que regardent les fenêtres ?',
        options: ['Une cour calme', 'Une autoroute', 'Un parking bruyant'],
        answer: 'Une cour calme',
      },
      {
        prompt: 'Que doivent faire les candidats avant vendredi ?',
        options: ['Envoyer leurs documents', 'Déménager', 'Payer le loyer d\'un an'],
        answer: 'Envoyer leurs documents',
      },
    ],
  },
  {
    id: 'a2-04',
    level: 'a2',
    themes: ['fr-achats', 'fr-nourriture'],
    title: 'Courses au supermarché',
    text:
      'Hier, Élodie est allée au supermarché Coop près de la gare de Sion. Elle a acheté du lait, des pâtes et des tomates pour la semaine. Elle a aussi pris du savon parce que la bouteille à la maison est vide. À la caisse, elle a payé soixante-deux francs avec sa carte. Aujourd\'hui, elle va préparer une sauce tomate pour ses enfants. Demain, elle retournera acheter du pain frais.',
    questions: [
      {
        prompt: 'Pourquoi Élodie a-t-elle acheté du savon ?',
        options: ['La bouteille à la maison est vide', 'C\'était en promotion', 'Ses enfants l\'ont demandé'],
        answer: 'La bouteille à la maison est vide',
      },
      {
        prompt: 'Combien Élodie a-t-elle payé à la caisse ?',
        options: ['Soixante-deux francs', 'Vingt francs', 'Cent francs'],
        answer: 'Soixante-deux francs',
      },
      {
        prompt: 'Que va-t-elle faire aujourd\'hui avec les tomates ?',
        options: ['Préparer une sauce pour ses enfants', 'Les planter', 'Les donner au voisin'],
        answer: 'Préparer une sauce pour ses enfants',
      },
    ],
  },
  {
    id: 'a2-05',
    level: 'a2',
    themes: ['fr-vetements', 'fr-achats'],
    title: 'Échange en magasin',
    text:
      'Brève consommation : Marco a acheté un pull gris la semaine dernière à Payerne. Chez lui, la taille est trop petite au niveau des épaules. Il est retourné au magasin avec le ticket. La vendeuse a proposé un modèle plus large en bleu marine. Marco a accepté l\'échange sans frais supplémentaires. Il portera le nouveau pull au bureau lundi. Le magasin ferme à dix-neuf heures ce soir.',
    questions: [
      {
        prompt: 'Quel était le problème avec le premier pull ?',
        options: ['Trop petit aux épaules', 'Trop long', 'Déchiré'],
        answer: 'Trop petit aux épaules',
      },
      {
        prompt: 'Quelle couleur Marco a-t-il choisie en échange ?',
        options: ['Bleu marine', 'Gris', 'Rouge'],
        answer: 'Bleu marine',
      },
      {
        prompt: 'Quand Marco portera-t-il le pull au bureau ?',
        options: ['Lundi', 'Samedi', 'Il ne le portera pas'],
        answer: 'Lundi',
      },
    ],
  },
  {
    id: 'a2-06',
    level: 'a2',
    themes: ['fr-nourriture', 'fr-loisirs'],
    title: 'Dîner entre amis',
    text:
      'Invitation par e-mail : ce vendredi, Clara reçoit des amis dans son studio à Lausanne. Chacun apporte un plat : Salim une salade, Jo une tarte aux pommes. Clara prépare une soupe de légumes. Le dîner commence à dix-neuf heures trente. Après le repas, ils joueront à un jeu de société. Clara demande de prévenir si quelqu\'un est végétarien. Elle enverra l\'adresse exacte jeudi.',
    questions: [
      {
        prompt: 'Qu\'est-ce que Jo apporte ?',
        options: ['Une tarte aux pommes', 'Une soupe', 'Du poulet'],
        answer: 'Une tarte aux pommes',
      },
      {
        prompt: 'À quelle heure commence le dîner ?',
        options: ['Dix-neuf heures trente', 'Midi', 'Vingt-deux heures'],
        answer: 'Dix-neuf heures trente',
      },
      {
        prompt: 'Que feront-ils après le repas ?',
        options: ['Jouer à un jeu de société', 'Aller au cinéma', 'Travailler'],
        answer: 'Jouer à un jeu de société',
      },
    ],
  },
  {
    id: 'a2-07',
    level: 'a2',
    themes: ['fr-sante'],
    title: 'Rappel à la pharmacie',
    text:
      'Message laissé à la pharmacie de Nendaz : Monsieur Conti a oublié ses gouttes pour les yeux hier soir. La pharmacienne les garde au comptoir jusqu\'à samedi midi. Monsieur Conti doit apporter une pièce d\'identité pour les récupérer. Il a aussi demandé des pansements pour une petite coupure au doigt. La pharmacie ouvre à huit heures demain matin. Monsieur Conti passera avant son rendez-vous chez le médecin à onze heures.',
    questions: [
      {
        prompt: 'Qu\'est-ce que Monsieur Conti a oublié ?',
        options: ['Ses gouttes pour les yeux', 'Son téléphone', 'Ses clés de voiture'],
        answer: 'Ses gouttes pour les yeux',
      },
      {
        prompt: 'Jusqu\'à quand la pharmacienne garde-t-elle les gouttes ?',
        options: ['Samedi midi', 'Ce soir seulement', 'Un mois'],
        answer: 'Samedi midi',
      },
      {
        prompt: 'À quelle heure Monsieur Conti a-t-il rendez-vous chez le médecin ?',
        options: ['Onze heures', 'Huit heures', 'Seize heures'],
        answer: 'Onze heures',
      },
    ],
  },
  {
    id: 'a2-08',
    level: 'a2',
    themes: ['fr-transports', 'fr-journee'],
    title: 'Retard de train',
    text:
      'Hier matin, le train IC de Lausanne à Genève a eu vingt minutes de retard à cause d\'un problème technique. Julie devait arriver au travail à huit heures trente. Elle est arrivée à huit heures cinquante-cinq et a prévenu sa chef par message. Sa chef a accepté le retard parce que d\'autres collègues étaient aussi en retard. Julie a pris un café à la gare en attendant. Ce matin, le train est à l\'heure selon l\'application.',
    questions: [
      {
        prompt: 'Pourquoi le train a-t-il eu du retard ?',
        options: ['Un problème technique', 'La neige', 'Une grève'],
        answer: 'Un problème technique',
      },
      {
        prompt: 'À quelle heure Julie est-elle arrivée au travail ?',
        options: ['Huit heures cinquante-cinq', 'Huit heures trente', 'Neuf heures trente'],
        answer: 'Huit heures cinquante-cinq',
      },
      {
        prompt: 'Qu\'est-ce que Julie a fait en attendant à la gare ?',
        options: ['Elle a pris un café', 'Elle a dormi', 'Elle a nagé'],
        answer: 'Elle a pris un café',
      },
    ],
  },
  {
    id: 'a2-09',
    level: 'a2',
    themes: ['fr-inviter', 'fr-loisirs'],
    title: 'Concert en plein air',
    text:
      'Affiche : concert gratuit samedi au parc de l\'Indépendance à Genève. Le groupe joue à dix-sept heures. Vous pouvez apporter une couverture et une boisson sans alcool. En cas de pluie, le concert déménage à la salle communale voisine. Les bénévoles cherchent deux personnes pour aider au rangement après vingt heures. Inscrivez-vous sur le site de la ville avant jeudi.',
    questions: [
      {
        prompt: 'Où aura lieu le concert si le temps est beau ?',
        options: ['Au parc de l\'Indépendance', 'Dans un stade', 'À la gare'],
        answer: 'Au parc de l\'Indépendance',
      },
      {
        prompt: 'Que se passe-t-il en cas de pluie ?',
        options: ['Le concert va à la salle communale', 'Le concert est annulé', 'Le concert commence plus tôt'],
        answer: 'Le concert va à la salle communale',
      },
      {
        prompt: 'Que cherchent les bénévoles ?',
        options: ['Deux personnes pour le rangement', 'Un chanteur', 'Un bus'],
        answer: 'Deux personnes pour le rangement',
      },
    ],
  },
  {
    id: 'a2-10',
    level: 'a2',
    themes: ['fr-travail'],
    title: 'Premier jour au bureau',
    text:
      'Récit : ce matin, Priya a commencé son emploi à une agence de traduction à Neuchâtel. Sa collègue lui a montré le bureau et le code du badge. À dix heures, elles ont bu un café avec l\'équipe. L\'après-midi, Priya a traduit un texte court du français vers l\'anglais. Sa responsable a dit que le travail était clair et bien présenté. Demain, Priya télétravaillera de chez elle le matin.',
    questions: [
      {
        prompt: 'Où Priya a-t-elle commencé à travailler ?',
        options: ['À une agence de traduction à Neuchâtel', 'Dans un café', 'À l\'hôpital'],
        answer: 'À une agence de traduction à Neuchâtel',
      },
      {
        prompt: 'Qu\'a fait Priya l\'après-midi ?',
        options: ['Traduit un texte vers l\'anglais', 'Nettoyé les bureaux', 'Vendu des badges'],
        answer: 'Traduit un texte vers l\'anglais',
      },
      {
        prompt: 'Que fera Priya demain matin ?',
        options: ['Elle télétravaillera de chez elle', 'Elle ira à Genève', 'Elle sera en congé'],
        answer: 'Elle télétravaillera de chez elle',
      },
    ],
  },
  {
    id: 'a2-11',
    level: 'a2',
    themes: ['fr-journee', 'fr-transports'],
    title: 'Trajet domicile–école',
    text:
      'Chaque matin, Théo prend le bus numéro trois à Aigle. Il descend à l\'arrêt « Collège » à huit heures vingt. Ensuite, il marche cinq minutes jusqu\'à la cour de l\'école. Le cours commence à huit heures quarante-cinq. Le mercredi, il n\'y a pas de cours l\'après-midi ; Théo reste à la bibliothèque municipale. Le soir, il rentre à dix-sept heures avec sa mère en voiture.',
    questions: [
      {
        prompt: 'À quel arrêt Théo descend-il ?',
        options: ['Collège', 'Gare', 'Hôpital'],
        answer: 'Collège',
      },
      {
        prompt: 'Que fait Théo le mercredi après-midi ?',
        options: ['Il reste à la bibliothèque', 'Il travaille au café', 'Il va au cinéma'],
        answer: 'Il reste à la bibliothèque',
      },
      {
        prompt: 'Comment Théo rentre-t-il le soir ?',
        options: ['En voiture avec sa mère', 'En bus seul', 'À vélo'],
        answer: 'En voiture avec sa mère',
      },
    ],
  },
  {
    id: 'a2-12',
    level: 'a2',
    themes: ['fr-loisirs', 'fr-description'],
    title: 'Club de lecture',
    text:
      'Forum bibliothèque : le club de lecture de Romainmôtier se réunit une fois par mois le jeudi soir. Le livre de mars parle d\'une famille qui déménage à la campagne. Les membres discutent pendant une heure, puis boivent du thé. La bibliothèque prête dix exemplaires du livre. La prochaine réunion est le vingt-deux mars à dix-huit heures. Les nouveaux membres peuvent s\'inscrire à l\'accueil.',
    questions: [
      {
        prompt: 'De quoi parle le livre de mars ?',
        options: ['Une famille qui déménage à la campagne', 'Un voyage sur Mars', 'Une recette de cuisine'],
        answer: 'Une famille qui déménage à la campagne',
      },
      {
        prompt: 'Quand le club se réunit-il habituellement ?',
        options: ['Le jeudi soir, une fois par mois', 'Chaque matin', 'Le dimanche midi'],
        answer: 'Le jeudi soir, une fois par mois',
      },
      {
        prompt: 'Combien d\'exemplaires la bibliothèque prête-t-elle ?',
        options: ['Dix exemplaires', 'Un seul', 'Cent exemplaires'],
        answer: 'Dix exemplaires',
      },
    ],
  },
  {
    id: 'a2-13',
    level: 'a2',
    themes: ['fr-presenter', 'fr-famille'],
    title: 'Arrivée en Suisse',
    text:
      'E-mail à un ami : nous sommes arrivés à Biel/Bienne la semaine passée. Mon mari travaille dans une clinique et moi je cherche un cours de français. Nos jumeaux vont à l\'école primaire près du lac. Nous louons un appartement avec une petite terrasse. Le voisin nous a invités pour un apéritif samedi. La semaine prochaine, nous allons ouvrir un compte bancaire.',
    questions: [
      {
        prompt: 'Où le mari travaille-t-il ?',
        options: ['Dans une clinique', 'Dans une ferme', 'À la poste'],
        answer: 'Dans une clinique',
      },
      {
        prompt: 'Combien d\'enfants vont à l\'école primaire ?',
        options: ['Deux jumeaux', 'Un seul enfant', 'Trois enfants'],
        answer: 'Deux jumeaux',
      },
      {
        prompt: 'Que feront-ils la semaine prochaine ?',
        options: ['Ouvrir un compte bancaire', 'Partir en vacances', 'Acheter une voiture'],
        answer: 'Ouvrir un compte bancaire',
      },
    ],
  },
  {
    id: 'a2-14',
    level: 'a2',
    themes: ['fr-logement', 'fr-travail'],
    title: 'Colocation étudiante',
    text:
      'Annonce colocation : chambre libre dans un appartement à Yverdon, proche de l\'université appliquée. Les colocataires sont deux étudiantes en informatique. Le loyer est de cinq cent francs ; internet est inclus. La chambre donne sur une cour intérieure calme. La cuisine et le salon sont partagés. Chaque personne nettoie une semaine sur trois. Visite possible dimanche après-midi. Envoyer une brève présentation par e-mail.',
    questions: [
      {
        prompt: 'Pourquoi l\'appartement est-il pratique pour les étudiants ?',
        options: ['Il est proche de l\'université appliquée', 'Il est au bord de la mer', 'Il a un jardin privé'],
        answer: 'Il est proche de l\'université appliquée',
      },
      {
        prompt: 'Qu\'est-ce qui est inclus dans le loyer ?',
        options: ['Internet', 'L\'électricité seule', 'Le parking'],
        answer: 'Internet',
      },
      {
        prompt: 'Comment fonctionne le ménage ?',
        options: ['Chaque personne nettoie une semaine sur trois', 'Une femme de ménage passe chaque jour', 'Personne ne nettoie'],
        answer: 'Chaque personne nettoie une semaine sur trois',
      },
    ],
  },
  {
    id: 'a2-15',
    level: 'a2',
    themes: ['fr-achats', 'fr-vetements'],
    title: 'Commande en ligne',
    text:
      'Message client : j\'ai commandé des chaussures de randonnée sur le site SportAlp lundi. Le colis est arrivé hier à Martigny, au bureau de poste. La pointure quarante-deux convient bien, mais la couleur est plus foncée que sur la photo. Je vais garder les chaussures parce que je pars en randonnée samedi. Si je retourne le colis, je paierai les frais de port. Le service client a répondu en moins de vingt-quatre heures.',
    questions: [
      {
        prompt: 'Où le client a-t-il récupéré le colis ?',
        options: ['Au bureau de poste à Martigny', 'À la gare', 'Chez le voisin'],
        answer: 'Au bureau de poste à Martigny',
      },
      {
        prompt: 'Pourquoi le client garde-t-il les chaussures ?',
        options: ['Il part en randonnée samedi', 'Elles sont trop petites', 'Il n\'a pas ouvert le colis'],
        answer: 'Il part en randonnée samedi',
      },
      {
        prompt: 'Quel problème le client signale-t-il ?',
        options: ['La couleur est plus foncée que sur la photo', 'La pointure est fausse', 'Le colis est vide'],
        answer: 'La couleur est plus foncée que sur la photo',
      },
    ],
  },
  {
    id: 'a2-16',
    level: 'a2',
    themes: ['fr-nourriture', 'fr-sante'],
    title: 'Menu à la cantine',
    text:
      'Note cantine scolaire à Pully : lundi, menu végétarien avec lentilles et carottes. Mardi, poisson et pommes de terre. Mercredi, pas de service à cause d\'une inspection. Les menus sont affichés une semaine à l\'avance au hall d\'entrée. Jeudi, pâtes bolognaise ; alternative sans viande sur demande. Les élèves allergiques au gluten doivent s\'inscrire à l\'accueil. Le repas coûte huit francs ; le dessert est une pomme ou un yaourt.',
    questions: [
      {
        prompt: 'Pourquoi il n\'y a pas de service mercredi ?',
        options: ['À cause d\'une inspection', 'Parce que c\'est un jour férié', 'Par manque de personnel seulement le soir'],
        answer: 'À cause d\'une inspection',
      },
      {
        prompt: 'Quel est le menu du lundi ?',
        options: ['Lentilles et carottes', 'Poisson', 'Pâtes bolognaise'],
        answer: 'Lentilles et carottes',
      },
      {
        prompt: 'Que doivent faire les élèves allergiques au gluten ?',
        options: ['S\'inscrire à l\'accueil', 'Apporter leur médecin', 'Ne pas manger'],
        answer: 'S\'inscrire à l\'accueil',
      },
    ],
  },
  {
    id: 'a2-17',
    level: 'a2',
    themes: ['fr-inviter', 'fr-famille'],
    title: 'Mariage civil',
    text:
      'Carte invitation : Léa et Tomas célèbrent leur mariage civil le douze avril à la maison communale de Sion. La cérémonie commence à quatorze heures. Après, un apéritif sera servi sur la place du Rhône. Les enfants sont les bienvenus ; un coin jeux sera prévu. Merci de confirmer votre présence avant le vingt-huit mars par SMS. Tenue correcte demandée, sans couleur imposée.',
    questions: [
      {
        prompt: 'Où aura lieu la cérémonie ?',
        options: ['Maison communale de Sion', 'Église de Martigny', 'Plage du lac'],
        answer: 'Maison communale de Sion',
      },
      {
        prompt: 'Où se déroule l\'apéritif ?',
        options: ['Sur la place du Rhône', 'Dans un restaurant fermé', 'Chez les parents de Léa'],
        answer: 'Sur la place du Rhône',
      },
      {
        prompt: 'Comment confirmer sa présence ?',
        options: ['Par SMS avant le vingt-huit mars', 'Par courrier postal seulement', 'En arrivant sans prévenir'],
        answer: 'Par SMS avant le vingt-huit mars',
      },
    ],
  },
  {
    id: 'a2-18',
    level: 'a2',
    themes: ['fr-description', 'fr-loisirs'],
    title: 'Musée local',
    text:
      'Article : le musée d\'histoire de Vevey rouvre après travaux le premier mai. Les salles montrent des objets de la vie quotidienne au vingtième siècle. Une nouvelle salle présente des photos du lac et des vignobles. L\'entrée coûte huit francs ; les moins de seize ans entrent gratuitement. Le dimanche, des guides proposent une visite de quarante-cinq minutes à quatorze heures. Le café du musée sert des boissons chaudes jusqu\'à dix-sept heures.',
    questions: [
      {
        prompt: 'Quand le musée rouvre-t-il ?',
        options: ['Le premier mai', 'En janvier', 'Le jour de Noël'],
        answer: 'Le premier mai',
      },
      {
        prompt: 'Combien coûte l\'entrée pour un adulte ?',
        options: ['Huit francs', 'Gratuit pour tous', 'Vingt francs'],
        answer: 'Huit francs',
      },
      {
        prompt: 'Que propose-t-on le dimanche à quatorze heures ?',
        options: ['Une visite guidée de quarante-cinq minutes', 'Un concert', 'Un marché'],
        answer: 'Une visite guidée de quarante-cinq minutes',
      },
    ],
  },
  {
    id: 'a2-19',
    level: 'a2',
    themes: ['fr-travail', 'fr-transports'],
    title: 'Mission chez un client',
    text:
      'E-mail interne : demain, Luis se rend chez un client à Fribourg pour installer un logiciel. Il prend le train de huit heures dix depuis Lausanne. Son collègue Anna reste au bureau pour répondre au téléphone. Luis doit emporter le câble numéro sept et la clé USB bleue. Le client a demandé que l\'installation finisse avant midi. Luis enverra un rapport par e-mail l\'après-midi.',
    questions: [
      {
        prompt: 'Pourquoi Luis va-t-il à Fribourg ?',
        options: ['Installer un logiciel chez un client', 'Suivre un cours', 'Visiter sa famille'],
        answer: 'Installer un logiciel chez un client',
      },
      {
        prompt: 'Que doit Luis emporter ?',
        options: ['Le câble numéro sept et la clé USB bleue', 'Un marteau', 'Des chaussures'],
        answer: 'Le câble numéro sept et la clé USB bleue',
      },
      {
        prompt: 'Qui reste au bureau ?',
        options: ['Anna', 'Luis', 'Le client'],
        answer: 'Anna',
      },
    ],
  },
  {
    id: 'a2-20',
    level: 'a2',
    themes: ['fr-journee', 'fr-sante'],
    title: 'Journée équilibrée',
    text:
      'Blog bien-être : ce matin, Noémie s\'est levée à six heures trente. Elle a fait quinze minutes de yoga avant le petit déjeuner. Au travail, elle a marché jusqu\'au parc à la pause déjeuner. L\'après-midi, elle a bu deux grands verres d\'eau. Le soir, elle a cuisiné des légumes et évité les boissons sucrées. Demain, elle prendra rendez-vous pour un contrôle dentaire. Elle veut garder cette routine toute l\'année.',
    questions: [
      {
        prompt: 'Qu\'a fait Noémie avant le petit déjeuner ?',
        options: ['Quinze minutes de yoga', 'Une heure de course', 'Rien'],
        answer: 'Quinze minutes de yoga',
      },
      {
        prompt: 'Où Noémie est-elle allée à la pause déjeuner ?',
        options: ['Au parc', 'Au cinéma', 'À l\'aéroport'],
        answer: 'Au parc',
      },
      {
        prompt: 'Quel rendez-vous Noémie prendra-t-elle demain ?',
        options: ['Un contrôle dentaire', 'Un examen de conduite', 'Une visite au zoo'],
        answer: 'Un contrôle dentaire',
      },
    ],
  },
  // ——— B1 ———
  {
    id: 'b1-01',
    level: 'b1',
    themes: ['fr-presenter', 'fr-travail'],
    title: 'Entretien d\'embauche',
    text:
      'Madame, Monsieur,\n\nJe vous écris suite à votre annonce pour un poste d\'assistant administratif à Genève. Je m\'appelle Rania El Amrani ; j\'ai quarante-deux ans et j\'habite à Carouge. Depuis cinq ans, je gère les agendas et la correspondance dans une ONG. Je maîtrise le français et l\'anglais écrit ; mon allemand est encore modeste, mais je suis inscrite à un cours du soir. Avant cela, j\'ai accueilli du public dans une bibliothèque, ce qui m\'a habituée aux demandes urgentes.\n\nJe serais heureuse de vous rencontrer pour expliquer comment j\'organise les dossiers et les factures. Je peux commencer le premier octobre si vous le souhaitez. En pièce jointe, vous trouverez deux références récentes et mon CV détaillé.\n\nCordialement,\nRania El Amrani',
    questions: [
      {
        prompt: 'Quel poste Rania vise-t-elle ?',
        options: ['Assistant administratif', 'Médecin', 'Vendeuse en boulangerie'],
        answer: 'Assistant administratif',
      },
      {
        prompt: 'Pourquoi mentionne-t-elle un cours du soir ?',
        options: ['Pour améliorer son allemand', 'Pour apprendre le piano', 'Pour obtenir un permis de conduire'],
        answer: 'Pour améliorer son allemand',
      },
      {
        prompt: 'À partir de quand Rania pourrait-elle commencer ?',
        options: ['Le premier octobre', 'Immédiatement demain', 'Dans deux ans'],
        answer: 'Le premier octobre',
      },
      {
        prompt: 'Où Rania habite-t-elle actuellement ?',
        options: ['À Carouge', 'À Zurich', 'À Paris'],
        answer: 'À Carouge',
      },
    ],
  },
  {
    id: 'b1-02',
    level: 'b1',
    themes: ['fr-famille', 'fr-journee'],
    title: 'Grands-parents et petits-enfants',
    text:
      'Chaque mercredi, les jumeaux Zara et Milo passent l\'après-midi chez leurs grands-parents à Estavayer-le-Lac. Leur grand-mère, qui était couturière, leur apprend à coudre un bouton. Leur grand-père prépare le goûter : des crêpes sans sucre ajouté, parce que Milo surveille sa consommation de bonbons.\n\nL\'été dernier, la famille a loué un pédalo sur le lac. Zara avait peur au début, mais elle a ri quand les vagues ont touché le bateau. Cet hiver, les grands-parents espèrent les emmener voir une pièce de théâtre à Fribourg, si les horaires de l\'école le permettent.\n\nLes parents des jumeaux disent que ces visites aident les enfants à parler français avec confiance. Le soir, ils écoutent souvent un conte lu par la grand-mère, ce qui enrichit leur vocabulaire avant de dormir.',
    questions: [
      {
        prompt: 'Quelle activité la grand-mère enseigne-t-elle ?',
        options: ['Coudre un bouton', 'Conduire une voiture', 'Jouer du violon'],
        answer: 'Coudre un bouton',
      },
      {
        prompt: 'Pourquoi les crêpes sont-elles sans sucre ajouté ?',
        options: ['Parce que Milo limite les bonbons', 'Parce qu\'il n\'y a pas de farine', 'Parce que c\'est l\'hiver'],
        answer: 'Parce que Milo limite les bonbons',
      },
      {
        prompt: 'Que souhaitent faire les grands-parents cet hiver ?',
        options: ['Emmener les jumeaux au théâtre', 'Déménager au bord de la mer', 'Arrêter les visites du mercredi'],
        answer: 'Emmener les jumeaux au théâtre',
      },
    ],
  },
  {
    id: 'b1-03',
    level: 'b1',
    themes: ['fr-description', 'fr-logement'],
    title: 'Rénovation d\'un logement',
    text:
      'Lettre au propriétaire : nous habitons l\'appartement du deuxième étage, rue du Collège à Sierre, depuis deux ans. La peinture du salon s\'écaille près de la fenêtre, et une fuite légère a taché le plafond de la salle de bain. Nous avons pris des photos et gardé le numéro du plombier que vous aviez indiqué.\n\nNous serions disponibles pour une visite technique mardi ou jeudi après seize heures. Nous préférons rester chez nous pendant les travaux si possible, car notre fille prépare un examen. Si une relocation temporaire est nécessaire, nous aimerions connaître les options avant de signer quoi que ce soit.\n\nMerci de nous indiquer la procédure pour déclarer le sinistre à l\'assurance. Nous pouvons transmettre les photos par e-mail dès demain matin si vous le souhaitez.',
    questions: [
      {
        prompt: 'Quels problèmes les locataires décrivent-ils ?',
        options: ['Peinture abîmée et fuite au plafond', 'Porte cassée et ascenseur bloqué', 'Cuisine sans électricité'],
        answer: 'Peinture abîmée et fuite au plafond',
      },
      {
        prompt: 'Pourquoi les locataires veulent-ils rester pendant les travaux ?',
        options: ['Leur fille prépare un examen', 'Ils n\'ont pas d\'assurance', 'Ils partent en vacances'],
        answer: 'Leur fille prépare un examen',
      },
      {
        prompt: 'Quand sont-ils disponibles pour une visite ?',
        options: ['Mardi ou jeudi après seize heures', 'Uniquement le matin', 'Le week-end seulement'],
        answer: 'Mardi ou jeudi après seize heures',
      },
    ],
  },
  {
    id: 'b1-04',
    level: 'b1',
    themes: ['fr-achats', 'fr-nourriture'],
    title: 'Consommer local',
    text:
      'Article association : à Bulle, le marché hebdomadaire propose désormais un stand « panier surprise ». Les producteurs y placent des légumes invendus mais encore frais ; les clients paient un prix fixe et découvrent le contenu sur place. L\'objectif est de réduire le gaspillage alimentaire et de faire connaître des variétés anciennes de carottes ou de pommes de terre.\n\nUne participante explique qu\'elle adapte ses recettes après le marché : soupe, gratin ou salade selon ce qu\'elle reçoit. Les communes voisines observent l\'expérience ; si les ventes restent stables cet automne, elles pourraient copier le modèle. Le stand refuse cependant les demandes de choix à l\'avance, pour rester équitable envers tous.\n\nChaque samedi matin, une vingtaine de paniers part en moins d\'une heure, preuve d\'un intérêt croissant des habitants.',
    questions: [
      {
        prompt: 'Quel est l\'objectif principal du stand « panier surprise » ?',
        options: ['Réduire le gaspillage et faire découvrir des variétés', 'Vendre uniquement de la viande', 'Remplacer le supermarché'],
        answer: 'Réduire le gaspillage et faire découvrir des variétés',
      },
      {
        prompt: 'Comment la participante utilise-t-elle son panier ?',
        options: ['Elle adapte soupe, gratin ou salade', 'Elle jette ce qu\'elle ne connaît pas', 'Elle le revend en ligne'],
        answer: 'Elle adapte soupe, gratin ou salade',
      },
      {
        prompt: 'Pourquoi le stand refuse-t-il les choix à l\'avance ?',
        options: ['Pour rester équitable', 'Par manque de clients', 'Parce que les légumes sont congelés'],
        answer: 'Pour rester équitable',
      },
    ],
  },
  {
    id: 'b1-05',
    level: 'b1',
    themes: ['fr-vetements', 'fr-travail'],
    title: 'Tenue professionnelle',
    text:
      'Note interne hôtel : à partir du mois prochain, l\'accueil portera une tenue unifiée : chemisier blanc, pantalon noir et badge avec prénom. Les chaussures doivent être fermées pour des raisons de sécurité. Les employés peuvent demander une taille différente au responsable du personnel avant le quinze du mois.\n\nPlusieurs personnes avaient suggéré d\'autoriser des couleurs vives ; la direction a rappelé que l\'hôtel accueille aussi des conférences formelles. Un vestiaire sera aménagé pour laisser les manteaux personnels. Si un vêtement est abîmé au travail, l\'entreprise le remplace une fois par an.\n\nUne séance d\'essayage collective est prévue mardi prochain au sous-sol, avec la couturière partenaire de l\'hôtel. Chaque employé recevra un document récapitulatif des règles avant la fin du mois.',
    questions: [
      {
        prompt: 'Quelle partie de la tenue concerne la sécurité ?',
        options: ['Les chaussures fermées', 'Le badge', 'Le manteau personnel'],
        answer: 'Les chaussures fermées',
      },
      {
        prompt: 'Pourquoi la direction refuse-t-elle les couleurs vives ?',
        options: ['L\'hôtel accueille des conférences formelles', 'Les clients détestent le blanc', 'Il n\'y a pas de budget'],
        answer: 'L\'hôtel accueille des conférences formelles',
      },
      {
        prompt: 'Que se passe-t-il si un vêtement professionnel est abîmé au travail ?',
        options: ['L\'entreprise le remplace une fois par an', 'L\'employé doit démissionner', 'Rien n\'est prévu'],
        answer: 'L\'entreprise le remplace une fois par an',
      },
    ],
  },
  {
    id: 'b1-06',
    level: 'b1',
    themes: ['fr-nourriture', 'fr-loisirs'],
    title: 'Festival gastronomique',
    text:
      'Brève culture : le festival « Saveurs du Léman » revient à Montreux du huit au onze juin. Des chefs régionaux proposent des assiettes à taille réduite, ce qui permet de comparer plusieurs spécialités sans gaspiller. Un atelier pour enfants montre comment rouler des sushis végétariens ; les parents doivent réserver une place, car les groupes sont limités à douze participants.\n\nLes organisateurs rappellent que les goûts épicés sont signalés par un pictogramme, utile aux personnes sensibles. En soirée, des concerts gratuits ont lieu sur le quai ; l\'entrée au festival elle-même reste payante. Si la pluie tombe, les stands se replient sous la halle couverte, sans changer les horaires.\n\nL\'édition précédente avait attiré plus de huit mille visiteurs, dont beaucoup de familles du canton de Vaud.',
    questions: [
      {
        prompt: 'Quel avantage offrent les assiettes à taille réduite ?',
        options: ['Comparer plusieurs spécialités sans gaspiller', 'Manger gratuitement', 'Eviter toute réserve'],
        answer: 'Comparer plusieurs spécialités sans gaspiller',
      },
      {
        prompt: 'Pourquoi faut-il réserver l\'atelier enfants ?',
        options: ['Les groupes sont limités à douze', 'Il n\'y a pas de nourriture', 'L\'atelier est en allemand seulement'],
        answer: 'Les groupes sont limités à douze',
      },
      {
        prompt: 'Que se passe-t-il en cas de pluie ?',
        options: ['Les stands vont sous la halle couverte', 'Le festival est annulé', 'Les concerts deviennent payants'],
        answer: 'Les stands vont sous la halle couverte',
      },
    ],
  },
  {
    id: 'b1-07',
    level: 'b1',
    themes: ['fr-sante'],
    title: 'Prévention au quotidien',
    text:
      'Brochure clinique : beaucoup de patients attendent d\'avoir mal avant de consulter, alors que des contrôles simples détectent tôt l\'hypertension ou le diabète. La brochure conseille de noter son poids et sa tension une fois par mois si l\'on a plus de quarante ans ou des antécédents familiaux.\n\nElle insiste aussi sur le sommeil : écrans éteints une heure avant le coucher, chambre aérée, horaires réguliers. En cas de stress durable au travail, parler à un médecin ou à une infirmière conseillère évite l\'isolement. Les rendez-vous de prévention sont pris en ligne ; en cas d\'urgence, il faut composer le numéro d\'urgence national, pas envoyer un e-mail.\n\nDes affiches rappellent ces conseils dans la salle d\'attente, disponibles aussi en arabe et en portugais.',
    questions: [
      {
        prompt: 'Que recommande la brochure aux personnes de plus de quarante ans ?',
        options: ['Noter poids et tension chaque mois', 'Arrêter tout sport', 'Prendre des vitamines au hasard'],
        answer: 'Noter poids et tension chaque mois',
      },
      {
        prompt: 'Quel conseil concerne le sommeil ?',
        options: ['Eteindre les écrans une heure avant le coucher', 'Dormir avec la télé allumée', 'Boire du café le soir'],
        answer: 'Eteindre les écrans une heure avant le coucher',
      },
      {
        prompt: 'Comment prendre un rendez-vous de prévention ?',
        options: ['En ligne', 'Par e-mail en cas d\'urgence', 'Uniquement par courrier'],
        answer: 'En ligne',
      },
    ],
  },
  {
    id: 'b1-08',
    level: 'b1',
    themes: ['fr-transports', 'fr-journee'],
    title: 'Mobilité douce',
    text:
      'Enquête ville de Lausanne : depuis l\'élargissement des pistes cyclables, le nombre de trajets domicile–travail à vélo a augmenté de dix-huit pour cent. Les répondants disent gagner du temps aux heures de pointe, surtout sur les distances inférieures à cinq kilomètres. Cependant, l\'hiver, la neige réduit l\'usage ; la ville teste donc un service de salage ciblé sur trois axes principaux.\n\nLes transports publics restent essentiels pour les collines et les nuits tardives. Une ligne de bus nocturne a été prolongée jusqu\'à minuit trente les vendredis. Les habitants demandent surtout des abris vélos sécurisés près de la gare ; un projet pilote ouvrirait cent places couvertes au printemps prochain.\n\nLa municipalité publiera un bilan complet après l\'hiver, avec les retours des associations de cyclistes.',
    questions: [
      {
        prompt: 'Quand le vélo est-il surtout avantageux selon l\'enquête ?',
        options: ['Sur des trajets de moins de cinq kilomètres aux heures de pointe', 'Pour les longues distances de nuit', 'Uniquement en hiver'],
        answer: 'Sur des trajets de moins de cinq kilomètres aux heures de pointe',
      },
      {
        prompt: 'Pourquoi la ville teste-t-elle un salage ciblé ?',
        options: ['La neige réduit l\'usage du vélo', 'Les bus sont en grève', 'Il n\'y a plus de pistes'],
        answer: 'La neige réduit l\'usage du vélo',
      },
      {
        prompt: 'Quelle demande concerne la gare ?',
        options: ['Des abris vélos sécurisés', 'Supprimer les bus nocturnes', 'Fermer les pistes cyclables'],
        answer: 'Des abris vélos sécurisés',
      },
    ],
  },
  {
    id: 'b1-09',
    level: 'b1',
    themes: ['fr-inviter', 'fr-famille'],
    title: 'Réunion de famille',
    text:
      'Message vocal transcrit : chers cousins, nous fêtons les soixante ans de tante Aline le dimanche vingt-quatre septembre à Cressier. La maison est petite ; merci de confirmer avant le dix si vous venez avec des enfants, pour prévoir les chaises. Chacun apporte un plat froid ou un dessert ; nous fournissons boissons et café.\n\nSi vous arrivez en train, prévenez-nous de l\'heure : quelqu\'un pourra vous chercher à la gare de Neuchâtel. Nous éviterons les cadeaux encombrants ; un album photo partagé en ligne suffira. En cas de mauvaise météo, la tente dans le jardin restera montée, mais le repas principal passera au sous-sol aménagé.\n\nMerci aussi de signaler toute allergie alimentaire lors de votre message de confirmation. Nous préparerons alors des assiettes séparées sans problème.',
    questions: [
      {
        prompt: 'Pourquoi faut-il confirmer la présence d\'enfants ?',
        options: ['Pour prévoir les chaises', 'Pour interdire les jeux', 'Pour réserver un hôtel'],
        answer: 'Pour prévoir les chaises',
      },
      {
        prompt: 'Que propose l\'organisateur pour les arrivées en train ?',
        options: ['Une prise en charge possible depuis la gare de Neuchâtel', 'Un billet gratuit', 'Un taxi payé par la ville'],
        answer: 'Une prise en charge possible depuis la gare de Neuchâtel',
      },
      {
        prompt: 'Où se fera le repas principal s\'il pleut ?',
        options: ['Au sous-sol aménagé', 'Annulé', 'Dehors sans tente'],
        answer: 'Au sous-sol aménagé',
      },
    ],
  },
  {
    id: 'b1-10',
    level: 'b1',
    themes: ['fr-travail', 'fr-loisirs'],
    title: 'Équilibre vie pro–perso',
    text:
      'Forum emploi : Marc, technicien à Bienne, raconte qu\'il a négocié un jour de télétravail fixe le vendredi. Il consacre la matinée aux tâches silencieuses, comme la rédaction de rapports, et garde l\'après-midi pour le vélo ou la musique. Son employeur a accepté à condition que Marc reste joignable par chat et participe aux réunions en visio.\n\nMarc précise que ce n\'est pas une solution pour tout le monde : chez lui, la connexion est stable et il vit seul. Une collègue, en revanche, préfère le bureau parce qu\'elle évite ainsi les interruptions de ses enfants. Marc conseille de tester un mois avant de demander un arrangement durable.\n\nIl ajoute qu\'il note ses heures avec honnêteté, car la confiance reste la base de l\'accord.',
    questions: [
      {
        prompt: 'Quelle condition l\'employeur a-t-il imposée ?',
        options: ['Rester joignable et assister aux visios', 'Travailler sept jours sur sept', 'Ne plus écrire de rapports'],
        answer: 'Rester joignable et assister aux visios',
      },
      {
        prompt: 'Pourquoi la collègue préfère-t-elle le bureau ?',
        options: ['Pour éviter les interruptions de ses enfants', 'Parce qu\'elle n\'a pas d\'ordinateur', 'Parce qu\'elle déteste le vélo'],
        answer: 'Pour éviter les interruptions de ses enfants',
      },
      {
        prompt: 'Quel conseil Marc donne-t-il ?',
        options: ['Tester un mois avant de demander un arrangement durable', 'Démissionner tout de suite', 'Refuser toute visio'],
        answer: 'Tester un mois avant de demander un arrangement durable',
      },
    ],
  },
  {
    id: 'b1-11',
    level: 'b1',
    themes: ['fr-journee', 'fr-description'],
    title: 'Une journée de télétravail',
    text:
      'Journal intime (extrait) : je me lève à la même heure qu\'au bureau, sinon la journée dérape. Après un café, j\'ouvre l\'ordinateur dans la pièce calme ; la table de la cuisine est trop bruyante quand les voisins passent le balai. À midi, je fais une vraie pause : souvent une omelette et dix minutes dehors, même s\'il pleut un peu.\n\nL\'après-midi, je coupe les notifications une heure pour avancer sur un dossier complexe. Si je reste connecté en permanence, je finis tard sans être plus productif. Le soir, je range le bureau ; voir des papiers le lendemain matin me stresse. Demain, je retournerai sur site pour une réunion en personne.\n\nCe rituel simple m\'aide à séparer vie professionnelle et temps libre, même dans un petit logement.',
    questions: [
      {
        prompt: 'Pourquoi l\'auteur évite la table de la cuisine ?',
        options: ['Elle est trop bruyante', 'Il n\'y a pas de lumière', 'Il n\'a pas de chaise'],
        answer: 'Elle est trop bruyante',
      },
      {
        prompt: 'Que fait l\'auteur une heure l\'après-midi ?',
        options: ['Il coupe les notifications pour avancer', 'Il regarde la télévision', 'Il fait les courses'],
        answer: 'Il coupe les notifications pour avancer',
      },
      {
        prompt: 'Pourquoi range-t-il le bureau le soir ?',
        options: ['Voir des papiers le matin le stresse', 'Son employeur l\'oblige', 'Il part en vacances'],
        answer: 'Voir des papiers le matin le stresse',
      },
    ],
  },
  {
    id: 'b1-12',
    level: 'b1',
    themes: ['fr-loisirs', 'fr-transports'],
    title: 'Randonnée en groupe',
    text:
      'Compte rendu club : la sortie du dimanche à Leysin a réuni quatorze marcheurs. Nous avons pris le train depuis Aigle à huit heures cinq, puis monté jusqu\'au lac de retour en deux heures quarante. Un participant débutant a ralenti le groupe ; le guide a proposé un raccourci moins raide, ce qui a évité une tension inutile.\n\nAu sommet, le vent était fort ; nous avons mangé rapidement avant de redescendre. Plusieurs personnes ont oublié des gants ; la prochaine fois, la liste de matériel sera envoyée trois jours avant. Tout le monde est rentré sain et sauf à seize heures trente, avec l\'envie de réserver une cabane pour une nuit en été.\n\nLe club remercie la gare d\'Aigle pour les tarifs de groupe accordés ce week-end.',
    questions: [
      {
        prompt: 'Pourquoi le guide a-t-il proposé un raccourci ?',
        options: ['Un débutant ralentissait le groupe', 'Le train était annulé', 'Il neigeait au sommet'],
        answer: 'Un débutant ralentissait le groupe',
      },
      {
        prompt: 'Pourquoi le pique-nique au sommet a-t-il été court ?',
        options: ['Le vent était fort', 'Il n\'y avait pas de nourriture', 'La cabane était fermée'],
        answer: 'Le vent était fort',
      },
      {
        prompt: 'Quelle amélioration est prévue pour la prochaine sortie ?',
        options: ['Envoyer la liste de matériel trois jours avant', 'Interdire les débutants', 'Raccourcir le train'],
        answer: 'Envoyer la liste de matériel trois jours avant',
      },
    ],
  },
  {
    id: 'b1-13',
    level: 'b1',
    themes: ['fr-presenter', 'fr-logement'],
    title: 'Déménagement transfrontalier',
    text:
      'E-mail à la régie : bonjour, je suis Elena Kovacs, locataire au quatrième étage depuis mars. Je vous informe que je quitterai l\'appartement le trente et un août. Mon contrat de travail à Lausanne se termine ; j\'accepte un poste à Annecy et je déménagerai donc en France.\n\nJe propose une visite d\'état des lieux le vingt-huit août, après avoir nettoyé les surfaces et repeint la chambre où un accroc léger est visible. Je souhaite récupérer ma caution dans les délais légaux ; merci de confirmer la procédure et l\'adresse pour renvoyer les clés. Je reste joignable par téléphone jusqu\'au dix septembre.\n\nJe joins déjà des photos de la chambre repeinte pour faciliter votre dossier. Je laisserai l\'appartement vide et propre le jour du départ.',
    questions: [
      {
        prompt: 'Pourquoi Elena quitte-t-elle l\'appartement ?',
        options: ['Elle accepte un poste à Annecy', 'Elle veut une maison plus grande à Lausanne', 'La régie la expulse'],
        answer: 'Elle accepte un poste à Annecy',
      },
      {
        prompt: 'Qu\'a-t-elle prévu avant l\'état des lieux ?',
        options: ['Nettoyer et repeindre une chambre', 'Laisser les clés sans prévenir', 'Garder le mobilier'],
        answer: 'Nettoyer et repeindre une chambre',
      },
      {
        prompt: 'Jusqu\'à quand reste-t-elle joignable ?',
        options: ['Jusqu\'au dix septembre', 'Uniquement en juin', 'Elle ne donne pas de contact'],
        answer: 'Jusqu\'au dix septembre',
      },
    ],
  },
  {
    id: 'b1-14',
    level: 'b1',
    themes: ['fr-achats', 'fr-vetements'],
    title: 'Mode durable',
    text:
      'Chronique : une boutique à Fribourg propose la location de tenues de cérémonie plutôt que la vente systématique. La gérante explique que beaucoup de robes ne servent qu\'une soirée ; les louer réduit l\'espace de rangement chez les clients et limite la production textile. Les tailles sont ajustables grâce à des pinces temporaires.\n\nSi un vêtement est déchiré, la boutique le répare avant la location suivante. Certains clients achètent finalement une pièce qu\'ils ont d\'abord louée, surtout les costumes classiques. La gérante prévoit un corner en ligne, mais insiste sur l\'importance de l\'essayage pour éviter les retours coûteux en transport.\n\nElle collabore avec une association locale qui récupère les tissus invendus pour en faire des accessoires. Cette démarche attire des clients sensibles au gaspillage textile.',
    questions: [
      {
        prompt: 'Quel avantage la location offre-t-elle aux clients ?',
        options: ['Moins de rangement et moins d\'achats inutiles', 'Des robes gratuites', 'Uniquement des tailles uniques'],
        answer: 'Moins de rangement et moins d\'achats inutiles',
      },
      {
        prompt: 'Que fait la boutique si un vêtement est abîmé ?',
        options: ['Elle le répare avant la prochaine location', 'Elle le jette', 'Elle augmente tous les prix'],
        answer: 'Elle le répare avant la prochaine location',
      },
      {
        prompt: 'Pourquoi la gérante insiste-t-elle sur l\'essayage ?',
        options: ['Pour limiter les retours coûteux', 'Parce qu\'il n\'y a pas de miroir', 'Parce que les tailles n\'existent pas'],
        answer: 'Pour limiter les retours coûteux',
      },
    ],
  },
  {
    id: 'b1-15',
    level: 'b1',
    themes: ['fr-nourriture', 'fr-famille'],
    title: 'Héritage culinaire',
    text:
      'Récit : quand ma mère est arrivée de Portugal, elle ne trouvait pas les mêmes poivrons au supermarché de Genève. Elle a commencé à cultiver des plants sur le balcon, puis a échangé des boutures avec des voisins. Aujourd\'hui, nos dimanches sentent l\'ail rôti et le cumin ; mes neveux appellent cela « la cuisine du balcon ».\n\nMa mère note les recettes dans un carnet, mais elle change les quantités selon les convives. Si quelqu\'un est végétarien, elle remplace la chorizo par des pois chiches grillés. Elle dit que cuisiner ensemble vaut mieux qu\'un cadeau acheté vite. L\'hiver prochain, elle voudrait organiser un atelier au centre communautaire, si la salle est disponible.\n\nLes voisins apportent parfois leur propre huile d\'olive, et la table devient un petit marché amical.',
    questions: [
      {
        prompt: 'Comment la mère a-t-elle résolu le problème des ingrédients ?',
        options: ['Elle cultive et échange des plants', 'Elle arrête de cuisiner', 'Elle commande uniquement en ligne'],
        answer: 'Elle cultive et échange des plants',
      },
      {
        prompt: 'Que fait-elle pour un convive végétarien ?',
        options: ['Elle remplace la chorizo par des pois chiches grillés', 'Elle sert de la viande quand même', 'Elle annule le repas'],
        answer: 'Elle remplace la chorizo par des pois chiches grillés',
      },
      {
        prompt: 'Quel projet la mère envisage-t-elle ?',
        options: ['Un atelier au centre communautaire', 'Ouvrir un restaurant', 'Vendre le balcon'],
        answer: 'Un atelier au centre communautaire',
      },
    ],
  },
  {
    id: 'b1-16',
    level: 'b1',
    themes: ['fr-sante', 'fr-travail'],
    title: 'Retour après arrêt',
    text:
      'Courrier RH : Monsieur Duval reprendra ses fonctions le lundi dix mars, à temps partiel quatre-vingts pour cent pendant un mois. Son médecin recommande des pauses courtes et un éclairage adapté ; le service informatique installera un filtre sur son écran. Ses collègues recevront un rappel sur la confidentialité : aucune question intrusive sur sa santé.\n\nMonsieur Duval participera d\'abord aux réunions en visio, puis progressivement sur place. Si la reprise est trop fatigante, un entretien avec les ressources humaines permettra d\'ajuster la charge. L\'entreprise rappelle que les rendez-vous médicaux liés à l\'arrêt ne doivent pas être planifiés sur les heures de travail sans accord.\n\nUn plan de retour écrit sera signé par Monsieur Duval et son responsable d\'équipe. Ce document précisera les tâches adaptées la première semaine.',
    questions: [
      {
        prompt: 'Quelle mesure technique est prévue pour Monsieur Duval ?',
        options: ['Un filtre sur l\'écran', 'Un nouveau téléphone', 'Suppression du télétravail'],
        answer: 'Un filtre sur l\'écran',
      },
      {
        prompt: 'Quel rappel est adressé aux collègues ?',
        options: ['Ne pas poser de questions intrusives sur la santé', 'Organiser une fête surprise', 'Publier son dossier médical'],
        answer: 'Ne pas poser de questions intrusives sur la santé',
      },
      {
        prompt: 'Comment commencera-t-il à participer aux réunions ?',
        options: ['D\'abord en visio, puis sur place', 'Uniquement sur place dès le premier jour', 'Il ne participera plus'],
        answer: 'D\'abord en visio, puis sur place',
      },
    ],
  },
  {
    id: 'b1-17',
    level: 'b1',
    themes: ['fr-inviter', 'fr-loisirs'],
    title: 'Soirée jeux',
    text:
      'Invitation Facebook (texte) : bonsoir les amis du quartier, je lance une soirée jeux de société chez moi, rue de la Gare à Yverdon, samedi à dix-neuf heures. Apportez une boisson ; je prépare des chips et une soupe. Nous commencerons par un jeu coopératif facile, puis un quiz si les gens veulent rester.\n\nMerci de m\'écrire si vous venez avec des allergies ; j\'utilise parfois des noix. Je peux accueillir huit personnes maximum ; au-delà, ce n\'est pas confortable. Si vous ne trouvez pas de place pour garer, utilisez le parking de la gare, à cinq minutes à pied. En cas de grippe, restez chez vous : nous reprogrammerons.\n\nJe prêterai aussi des jeux pour enfants si des familles se joignent à nous.',
    questions: [
      {
        prompt: 'Que doivent apporter les invités ?',
        options: ['Une boisson', 'Un jeu obligatoire', 'Un cadeau'],
        answer: 'Une boisson',
      },
      {
        prompt: 'Pourquoi l\'hôte demande-t-il de signaler les allergies ?',
        options: ['Il utilise parfois des noix', 'Il ne sert que de la viande', 'Il interdit la soupe'],
        answer: 'Il utilise parfois des noix',
      },
      {
        prompt: 'Que conseille-t-il en cas de grippe ?',
        options: ['Rester chez soi et reprogrammer', 'Venir avec un masque seulement', 'Arriver plus tôt'],
        answer: 'Rester chez soi et reprogrammer',
      },
    ],
  },
  {
    id: 'b1-18',
    level: 'b1',
    themes: ['fr-description', 'fr-loisirs'],
    title: 'Bibliothèque vivante',
    text:
      'Article municipal : la bibliothèque de Payerne expérimente un « coin silence » rénové : lampes douces, prises pour ordinateurs, panneaux acoustiques. Les usagers avaient critiqué le bruit des discussions près de l\'accueil ; la direction a donc déplacé les groupes de conversation vers une salle séparée l\'après-midi.\n\nLes emprunts de livres en langue facile à lire ont augmenté, surtout auprès des nouveaux arrivants. Une médiatrice propose désormais des visites guidées de trente minutes pour présenter les rayons numériques. Si l\'expérience convainc, d\'autres succursales du canton reproduiront l\'aménagement l\'année prochaine, budget permettant.\n\nDes questionnaires recueillent les suggestions avant la réunion du conseil municipal de juin. Les usagers peuvent aussi proposer des horaires de silence plus longs le samedi matin, dès l\'ouverture.',
    questions: [
      {
        prompt: 'Pourquoi la direction a-t-elle déplacé les groupes de conversation ?',
        options: ['Le bruit près de l\'accueil dérangeait', 'Il n\'y avait plus de livres', 'La salle était trop grande'],
        answer: 'Le bruit près de l\'accueil dérangeait',
      },
      {
        prompt: 'Quels emprunts ont augmenté ?',
        options: ['Livres en langue facile à lire', 'Bandes dessinées uniquement', 'Manuels de médecine'],
        answer: 'Livres en langue facile à lire',
      },
      {
        prompt: 'Que fera peut-être le canton l\'année prochaine ?',
        options: ['Reproduire l\'aménagement dans d\'autres succursales', 'Fermer le coin silence', 'Supprimer les prises électriques'],
        answer: 'Reproduire l\'aménagement dans d\'autres succursales',
      },
    ],
  },
  {
    id: 'b1-19',
    level: 'b1',
    themes: ['fr-travail', 'fr-transports'],
    title: 'Grève des transports',
    text:
      'Info service : en raison d\'un préavis de grève régionale mardi, les trains entre Lausanne et Berne circuleront au rythme d\'un départ sur deux entre six heures et dix heures. Les bus de substitution accepteront les abonnements général, mais pas les places réservées sur les trains supprimés.\n\nLes employeurs sont invités à assouplir les horaires si possible ; plusieurs entreprises publiques l\'ont déjà annoncé. Les voyageurs doivent consulter l\'application avant de partir, car la situation peut évoluer mardi matin. En soirée, le trafic devrait revenir à la normale, sauf décision contraire du syndicat. Les CFF rappellent que les remboursements ne concernent pas les retards inférieurs à soixante minutes.\n\nDes agents seront présents aux gares de Lausanne et Berne pour orienter les voyageurs.',
    questions: [
      {
        prompt: 'Quel service est prévu mardi matin entre Lausanne et Berne ?',
        options: ['Un train sur deux', 'Aucun train', 'Des trains plus rapides'],
        answer: 'Un train sur deux',
      },
      {
        prompt: 'Que se passe-t-il avec les places réservées sur un train supprimé ?',
        options: ['Elles ne sont pas valables sur le bus de substitution', 'Elles donnent droit à un taxi', 'Elles sont remboursées automatiquement'],
        answer: 'Elles ne sont pas valables sur le bus de substitution',
      },
      {
        prompt: 'Quand le trafic devrait-il revenir à la normale ?',
        options: ['En soirée, sauf décision contraire', 'Dans un mois', 'Jamais mardi'],
        answer: 'En soirée, sauf décision contraire',
      },
    ],
  },
  {
    id: 'b1-20',
    level: 'b1',
    themes: ['fr-journee', 'fr-nourriture'],
    title: 'Pause déjeuner réinventée',
    text:
      'Chronique lifestyle : pendant des mois, j\'ai mangé devant l\'écran, pensant gagner du temps. Résultat : je grignotais encore à seize heures et j\'avais mal au dos. J\'ai testé une règle simple : vingt minutes minimum loin du clavier, idéalement dehors. Au début, c\'était gênant avec mes collègues, mais deux d\'entre eux m\'ont suivie.\n\nNous avons alterné : salade maison, soupe du traiteur, parfois un plat chaud au self. J\'ai remarqué que je revenais plus concentrée l\'après-midi. Ce n\'est pas une solution miracle ; les journées de réunions enchaînées existent toujours. Mais je protège au moins trois pauses par semaine, même courtes, et je refuse les appels pendant la bouchée.\n\nMon dos se sent mieux depuis que je marche cinq minutes après chaque repas.',
    questions: [
      {
        prompt: 'Quel problème l\'auteur avait-il avec l\'ancienne habitude ?',
        options: ['Grignotage l\'après-midi et mal au dos', 'Trop de sport', 'Insomnie uniquement le week-end'],
        answer: 'Grignotage l\'après-midi et mal au dos',
      },
      {
        prompt: 'Quelle règle l\'auteur a-t-elle testée ?',
        options: ['Vingt minutes minimum loin du clavier', 'Ne plus manger le midi', 'Travailler debout toute la journée'],
        answer: 'Vingt minutes minimum loin du clavier',
      },
      {
        prompt: 'Que protège l\'auteur maintenant ?',
        options: ['Au moins trois pauses par semaine', 'Toutes les réunions du matin', 'Ses week-ends entiers'],
        answer: 'Au moins trois pauses par semaine',
      },
    ],
  },
]

export function writtenDocsFor(
  topic: string,
  level: 'a1' | 'a2' | 'b1',
): ComprehensionEcritedoc[] {
  const matched = COMPREHENSION_ECRITE_DOCS.filter(
    (doc) => doc.level === level && doc.themes.includes(topic),
  )
  if (matched.length > 0) return matched
  return COMPREHENSION_ECRITE_DOCS.filter((doc) => doc.level === level)
}

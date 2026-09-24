export type FrHole = { prompt: string; answer: string }
export type FrChoice = { prompt: string; options: string[]; answer: string }
export type FrOral = {
  title: string
  transcript: string
  audioSrc?: string
  questions: FrChoice[]
}
export type FrWritten = { title: string; text: string; questions: FrChoice[] }

export type ThemeBank = {
  vocHoles: FrHole[]
  vocChoices: FrChoice[]
  vocIntrus: FrChoice[]
  gramHoles: FrHole[]
  gramConj: FrHole[]
  gramChoices: FrChoice[]
  oral: FrOral[]
  written: FrWritten[]
  dialogue: FrHole[]
}

const banks: Record<string, ThemeBank> = {
  'fr-presenter': {
    vocHoles: [
      { prompt: 'Bonjour, je ___ Léa.', answer: 'm’appelle' },
      { prompt: 'Je ___ de Sion.', answer: 'viens' },
      { prompt: 'J’___ vingt-huit ans.', answer: 'ai' },
      { prompt: 'Je ___ formateur.', answer: 'suis' },
      { prompt: 'Enchanté, et vous, comment vous ___-vous ?', answer: 'appelez' },
      { prompt: 'Au revoir, à ___ !', answer: 'bientôt' },
    ],
    vocChoices: [
      { prompt: 'Pour dire son prénom, on dit :', options: ['Je m’appelle…', 'Je mange…', 'Je dors…'], answer: 'Je m’appelle…' },
      { prompt: 'Pour dire son âge, on dit :', options: ['J’ai … ans', 'Je suis … ans', 'Je vais … ans'], answer: 'J’ai … ans' },
      { prompt: 'Pour saluer le matin :', options: ['Bonjour', 'Bonne nuit', 'À plus tard'], answer: 'Bonjour' },
      { prompt: 'Pour quitter quelqu’un :', options: ['Au revoir', 'S’il vous plaît', 'Merci beaucoup'], answer: 'Au revoir' },
      { prompt: '« Nationalité » : je suis…', options: ['suisse', 'table', 'lundi'], answer: 'suisse' },
      { prompt: 'On habite dans une :', options: ['ville', 'chaise', 'phrase'], answer: 'ville' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['bonjour', 'salut', 'chaise', 'au revoir'], answer: 'chaise' },
      { prompt: 'Entourez l’intrus.', options: ['prénom', 'âge', 'nationalité', 'fourchette'], answer: 'fourchette' },
      { prompt: 'Entourez l’intrus.', options: ['Suisse', 'France', 'Italie', 'mardi'], answer: 'mardi' },
      { prompt: 'Entourez l’intrus.', options: ['enchanté', 'merci', 's’il vous plaît', 'escalier'], answer: 'escalier' },
    ],
    gramHoles: [
      { prompt: 'Je ___ étudiante.', answer: 'suis' },
      { prompt: 'Tu ___ un frère.', answer: 'as' },
      { prompt: 'Il ___ de Lausanne.', answer: 'est' },
      { prompt: 'Nous ___ contents.', answer: 'sommes' },
      { prompt: 'Vous ___ vingt ans.', answer: 'avez' },
      { prompt: 'Elles ___ s’appellent Nora et Inès.', answer: 'se' },
    ],
    gramConj: [
      { prompt: 'Je ___ (être) en classe.', answer: 'suis' },
      { prompt: 'Tu ___ (avoir) raison.', answer: 'as' },
      { prompt: 'Elle ___ (s’appeler) Maya.', answer: 's’appelle' },
      { prompt: 'Nous ___ (être) prêts.', answer: 'sommes' },
      { prompt: 'Vous ___ (avoir) un enfant.', answer: 'avez' },
      { prompt: 'Ils ___ (s’appeler) Paul et Yanis.', answer: 's’appellent' },
    ],
    gramChoices: [
      { prompt: 'Je ___ suisse.', options: ['suis', 'es', 'sont'], answer: 'suis' },
      { prompt: 'Tu ___ un appartement.', options: ['as', 'ai', 'ont'], answer: 'as' },
      { prompt: 'Comment ___-vous ?', options: ['vous appelez', 'appelez vous', 'vous êtes'], answer: 'vous appelez' },
      { prompt: 'Nous ___ de Genève.', options: ['sommes', 'êtes', 'sont'], answer: 'sommes' },
    ],
    oral: [
      {
        title: 'Faire connaissance',
        transcript:
          'Léa : Bonjour, je m’appelle Léa. Je viens de Sion.\nOmar : Enchanté, Léa. Moi, c’est Omar. J’ai vingt-six ans.\nLéa : Vous êtes étudiant ?\nOmar : Oui, je suis étudiant à Lausanne. Et vous ?\nLéa : Je suis formatrice. J’habite à Sion.',
        questions: [
          { prompt: 'Comment s’appelle la femme ?', options: ['Léa', 'Nora', 'Inès'], answer: 'Léa' },
          { prompt: 'D’où vient Léa ?', options: ['Sion', 'Genève', 'Fribourg'], answer: 'Sion' },
          { prompt: 'Quel âge a Omar ?', options: ['26 ans', '22 ans', '30 ans'], answer: '26 ans' },
          { prompt: 'Où étudie Omar ?', options: ['à Lausanne', 'à Sion', 'à Berne'], answer: 'à Lausanne' },
        ],
      },
      {
        title: 'Au cours de français',
        transcript:
          'Prof : Bonjour tout le monde. Je m’appelle Madame Keller.\nNour : Bonjour. Je m’appelle Nour. J’ai trente ans et je viens du Valais.\nProf : Bienvenue, Nour. Vous habitez où ?\nNour : J’habite à Martigny. Je suis aide-soignante.',
        questions: [
          { prompt: 'Comment s’appelle la professeure ?', options: ['Madame Keller', 'Madame Nour', 'Madame Valais'], answer: 'Madame Keller' },
          { prompt: 'Quel âge a Nour ?', options: ['30 ans', '26 ans', '18 ans'], answer: '30 ans' },
          { prompt: 'Où habite Nour ?', options: ['Martigny', 'Sion', 'Lausanne'], answer: 'Martigny' },
          { prompt: 'Quel est le métier de Nour ?', options: ['aide-soignante', 'étudiante', 'formatrice'], answer: 'aide-soignante' },
        ],
      },
    ],
    written: [
      {
        title: 'Carte de présentation',
        text: 'Je m’appelle Adam Rossi. J’ai 34 ans. Je suis italien et j’habite à Fribourg depuis deux ans. Je suis cuisinier dans un restaurant du centre. Le soir, je suis un cours de français.',
        questions: [
          { prompt: 'Quel est le prénom de l’homme ?', options: ['Adam', 'Rossi', 'Fribourg'], answer: 'Adam' },
          { prompt: 'Quelle est sa nationalité ?', options: ['italienne', 'suisse', 'française'], answer: 'italienne' },
          { prompt: 'Où habite-t-il ?', options: ['Fribourg', 'Sion', 'Rome'], answer: 'Fribourg' },
          { prompt: 'Que fait-il le soir ?', options: ['un cours de français', 'du sport', 'rien'], answer: 'un cours de français' },
        ],
      },
      {
        title: 'Message du groupe',
        text: 'Bonjour, je m’appelle Sofia. Je viens du Tessin. J’ai 22 ans et je suis étudiante. J’habite à Neuchâtel, près de la gare. Enchantée de vous rencontrer.',
        questions: [
          { prompt: 'D’où vient Sofia ?', options: ['du Tessin', 'de Neuchâtel', 'de Genève'], answer: 'du Tessin' },
          { prompt: 'Quel âge a-t-elle ?', options: ['22 ans', '32 ans', '12 ans'], answer: '22 ans' },
          { prompt: 'Que fait Sofia ?', options: ['elle est étudiante', 'elle est professeure', 'elle est cuisinière'], answer: 'elle est étudiante' },
          { prompt: 'Où habite-t-elle ?', options: ['près de la gare', 'à la montagne', 'à l’hôtel'], answer: 'près de la gare' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Bonjour, comment vous ___-vous ?', answer: 'appelez' },
      { prompt: 'B : Je ___ Inès. Et vous ?', answer: 'm’appelle' },
      { prompt: 'A : Enchanté. Vous ___ d’où ?', answer: 'venez' },
      { prompt: 'B : Je viens de Berne. J’___ 25 ans.', answer: 'ai' },
    ],
  },
  'fr-famille': {
    vocHoles: [
      { prompt: 'Le père de mon père est mon ___.', answer: 'grand-père' },
      { prompt: 'La sœur de ma mère est ma ___.', answer: 'tante' },
      { prompt: 'Le fils de mon frère est mon ___.', answer: 'neveu' },
      { prompt: 'La femme de mon fils est ma ___.', answer: 'belle-fille' },
      { prompt: 'Les parents de mes parents sont mes ___.', answer: 'grands-parents' },
      { prompt: 'Le frère de mon père est mon ___.', answer: 'oncle' },
    ],
    vocChoices: [
      { prompt: 'La mère de mon père est ma :', options: ['grand-mère', 'tante', 'cousine'], answer: 'grand-mère' },
      { prompt: 'Les enfants de ma sœur sont mes :', options: ['neveux et nièces', 'oncles', 'beaux-parents'], answer: 'neveux et nièces' },
      { prompt: 'Mon frère et moi, nous sommes :', options: ['des frères', 'des cousins', 'des voisins'], answer: 'des frères' },
      { prompt: 'Le mari de ma sœur est mon :', options: ['beau-frère', 'oncle', 'neveu'], answer: 'beau-frère' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['mère', 'oncle', 'table', 'sœur'], answer: 'table' },
      { prompt: 'Entourez l’intrus.', options: ['fils', 'fille', 'cousin', 'bus'], answer: 'bus' },
      { prompt: 'Entourez l’intrus.', options: ['grand-père', 'tante', 'cuisine', 'nièce'], answer: 'cuisine' },
    ],
    gramHoles: [
      { prompt: 'C’est ___ livre. (je)', answer: 'mon' },
      { prompt: 'Voici ___ sœur. (tu)', answer: 'ta' },
      { prompt: '___ parents habitent ici. (nous)', answer: 'Nos' },
      { prompt: 'Elle range ___ affaires. (elle)', answer: 'ses' },
      { prompt: '___ maison est petite. (vous)', answer: 'Votre' },
      { prompt: 'Ils aiment ___ travail. (ils)', answer: 'leur' },
    ],
    gramConj: [
      { prompt: 'J’aime ___ (mon/ma) frère.', answer: 'mon' },
      { prompt: 'Tu présentes ___ (ton/ta) mère.', answer: 'ta' },
      { prompt: 'Elle cherche ___ (son/sa) clés.', answer: 'ses' },
      { prompt: 'Nous visitons ___ (notre/nos) cousins.', answer: 'nos' },
    ],
    gramChoices: [
      { prompt: 'Voici ___ enfants.', options: ['mes', 'mon', 'ma'], answer: 'mes' },
      { prompt: 'C’est ___ tante.', options: ['ma', 'mon', 'mes'], answer: 'ma' },
      { prompt: 'Ils parlent de ___ père.', options: ['leur', 'leurs', 'ses'], answer: 'leur' },
      { prompt: 'Vous aimez ___ famille.', options: ['votre', 'vos', 'notre'], answer: 'votre' },
    ],
    oral: [
      {
        title: 'Présenter sa famille',
        transcript:
          'Inès : Voici une photo de ma famille. Voici mon père et ma mère.\nYanis : Tu as des frères et sœurs ?\nInès : Oui, j’ai un frère, Karim, et une sœur, Lina. Ils habitent encore chez mes parents.\nYanis : Et tes grands-parents ?\nInès : Ils habitent à Sierre.',
        questions: [
          { prompt: 'Combien de frères et sœurs a Inès ?', options: ['deux', 'un', 'trois'], answer: 'deux' },
          { prompt: 'Comment s’appelle son frère ?', options: ['Karim', 'Yanis', 'Lina'], answer: 'Karim' },
          { prompt: 'Où habitent les grands-parents ?', options: ['à Sierre', 'à Sion', 'chez Inès'], answer: 'à Sierre' },
          { prompt: 'Karim et Lina habitent :', options: ['chez leurs parents', 'seuls', 'à l’hôtel'], answer: 'chez leurs parents' },
        ],
      },
    ],
    written: [
      {
        title: 'Un message familial',
        text: 'Je m’appelle Nora. J’habite avec mon mari et nos deux enfants. Ma sœur habite dans le même immeuble. Le dimanche, nous déjeunons chez mes parents. Mon oncle vient parfois avec ses trois cousins.',
        questions: [
          { prompt: 'Avec qui Nora habite-t-elle ?', options: ['son mari et ses enfants', 'sa sœur seule', 'son oncle'], answer: 'son mari et ses enfants' },
          { prompt: 'Où habite sa sœur ?', options: ['dans le même immeuble', 'à l’étranger', 'chez les parents'], answer: 'dans le même immeuble' },
          { prompt: 'Que font-ils le dimanche ?', options: ['ils déjeunent chez les parents', 'ils voyagent', 'ils travaillent'], answer: 'ils déjeunent chez les parents' },
          { prompt: 'Qui vient parfois ?', options: ['son oncle', 'sa voisine', 'son professeur'], answer: 'son oncle' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Tu as une grande ___ ?', answer: 'famille' },
      { prompt: 'B : Oui, j’ai deux ___ et une sœur.', answer: 'frères' },
      { prompt: 'A : Tes parents habitent ___ toi ?', answer: 'avec' },
      { prompt: 'B : Non, ils ont ___ propre appartement.', answer: 'leur' },
    ],
  },
  'fr-logement': {
    vocHoles: [
      { prompt: 'On dort dans la ___.', answer: 'chambre' },
      { prompt: 'On prépare le repas dans la ___.', answer: 'cuisine' },
      { prompt: 'On se lave dans la ___.', answer: 'salle de bain' },
      { prompt: 'L’___ mène à l’étage.', answer: 'escalier' },
      { prompt: 'On range le vélo dans le ___.', answer: 'garage' },
      { prompt: 'Le ___ donne sur la rue.', answer: 'balcon' },
    ],
    vocChoices: [
      { prompt: 'On mange dans :', options: ['la salle à manger', 'la cave', 'le grenier'], answer: 'la salle à manger' },
      { prompt: 'On regarde la télé dans :', options: ['le salon', 'la cave', 'la douche'], answer: 'le salon' },
      { prompt: 'Les affaires d’hiver sont souvent :', options: ['au grenier', 'dans l’assiette', 'à la gare'], answer: 'au grenier' },
      { prompt: 'Un appartement a souvent :', options: ['un hall d’entrée', 'un quai', 'un préau'], answer: 'un hall d’entrée' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['chambre', 'cuisine', 'banane', 'salon'], answer: 'banane' },
      { prompt: 'Entourez l’intrus.', options: ['évier', 'four', 'frigo', 'billet'], answer: 'billet' },
      { prompt: 'Entourez l’intrus.', options: ['balcon', 'cave', 'grenier', 'pantalon'], answer: 'pantalon' },
    ],
    gramHoles: [
      { prompt: '___ cuisine est grande.', answer: 'La' },
      { prompt: 'Il y a ___ balcon.', answer: 'un' },
      { prompt: 'Nous avons ___ chambres.', answer: 'des' },
      { prompt: '___ salon donne sur le parc.', answer: 'Le' },
      { prompt: 'Elle cherche ___ appartement.', answer: 'un' },
      { prompt: '___ escalier est à gauche.', answer: 'L’' },
    ],
    gramConj: [
      { prompt: 'Je ___ (habiter) au deuxième étage.', answer: 'habite' },
      { prompt: 'Tu ___ (chercher) un studio.', answer: 'cherches' },
      { prompt: 'Nous ___ (louer) un appartement.', answer: 'louons' },
      { prompt: 'Ils ___ (déménager) en juin.', answer: 'déménagent' },
    ],
    gramChoices: [
      { prompt: 'Il y a ___ table dans la cuisine.', options: ['une', 'un', 'des'], answer: 'une' },
      { prompt: '___ enfants jouent dans le salon.', options: ['Les', 'Le', 'La'], answer: 'Les' },
      { prompt: 'Nous prenons ___ ascenseur.', options: ['l’', 'la', 'une'], answer: 'l’' },
      { prompt: 'C’est ___ jolie maison.', options: ['une', 'un', 'des'], answer: 'une' },
    ],
    oral: [
      {
        title: 'Visiter un appartement',
        transcript:
          'Agence : Bonjour, je vous montre le trois-pièces.\nMaya : Il y a une cuisine séparée ?\nAgence : Oui. La cuisine est petite, mais le salon est grand. Il y a aussi un balcon.\nMaya : Et la cave ?\nAgence : Oui, une cave au sous-sol. Le loyer est de 1 450 francs, charges comprises.',
        questions: [
          { prompt: 'Combien de pièces a l’appartement ?', options: ['trois', 'deux', 'cinq'], answer: 'trois' },
          { prompt: 'La cuisine est :', options: ['petite', 'grande', 'absente'], answer: 'petite' },
          { prompt: 'Y a-t-il un balcon ?', options: ['oui', 'non', 'on ne sait pas'], answer: 'oui' },
          { prompt: 'Quel est le loyer ?', options: ['1 450 francs', '450 francs', '2 450 francs'], answer: '1 450 francs' },
        ],
      },
    ],
    written: [
      {
        title: 'Annonce de location',
        text: 'À louer : 4 pièces à Sion, 92 m², 2e étage avec ascenseur. Cuisine équipée, salon, deux chambres, salle de bain et balcon. Cave et place de parc. Loyer : 1 780 francs par mois, charges en plus. Disponible le 1er octobre.',
        questions: [
          { prompt: 'Où se trouve l’appartement ?', options: ['à Sion', 'à Sierre', 'à Martigny'], answer: 'à Sion' },
          { prompt: 'À quel étage est-il ?', options: ['2e étage', 'rez-de-chaussée', '4e étage'], answer: '2e étage' },
          { prompt: 'Y a-t-il un balcon ?', options: ['oui', 'non', 'seulement une cave'], answer: 'oui' },
          { prompt: 'Quand est-il disponible ?', options: ['le 1er octobre', 'le 1er janvier', 'tout de suite'], answer: 'le 1er octobre' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Vous habitez dans une maison ou un ___ ?', answer: 'appartement' },
      { prompt: 'B : Un appartement. Il y a deux ___.', answer: 'chambres' },
      { prompt: 'A : Il y a un ___ ?', answer: 'balcon' },
      { prompt: 'B : Oui, et une ___ au sous-sol.', answer: 'cave' },
    ],
  },
  'fr-achats': {
    vocHoles: [
      { prompt: 'Je paie à la ___.', answer: 'caisse' },
      { prompt: 'Le ___ indique le prix.', answer: 'ticket' },
      { prompt: 'Je cherche un produit moins ___.', answer: 'cher' },
      { prompt: 'Elle rend la ___ si le pull est trop petit.', answer: 'monnaie' },
      { prompt: 'Nous faisons les ___ le samedi.', answer: 'courses' },
      { prompt: 'Il y a une ___ de 20 %.', answer: 'réduction' },
    ],
    vocChoices: [
      { prompt: 'Pour payer, on peut utiliser :', options: ['une carte', 'une casserole', 'un oreiller'], answer: 'une carte' },
      { prompt: 'Un magasin qui vend de tout :', options: ['un supermarché', 'une pharmacie', 'une gare'], answer: 'un supermarché' },
      { prompt: 'Le contraire de cher :', options: ['bon marché', 'lourd', 'froid'], answer: 'bon marché' },
      { prompt: 'On met les achats dans :', options: ['un sac', 'un lit', 'un train'], answer: 'un sac' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['caisse', 'prix', 'ticket', 'nuage'], answer: 'nuage' },
      { prompt: 'Entourez l’intrus.', options: ['client', 'vendeur', 'rayon', 'nuage'], answer: 'nuage' },
      { prompt: 'Entourez l’intrus.', options: ['promo', 'solde', 'réduction', 'fenêtre'], answer: 'fenêtre' },
    ],
    gramHoles: [
      { prompt: 'C’est une robe ___. (couleur)', answer: 'bleue' },
      { prompt: 'J’achète un sac ___. (qualité)', answer: 'solide' },
      { prompt: 'Nous voulons des chaussures ___.', answer: 'confortables' },
      { prompt: 'Il y a trop ___ monde.', answer: 'de' },
      { prompt: 'Elle n’a pas ___ monnaie.', answer: 'de' },
      { prompt: 'Je voudrais ___ kilo de pommes.', answer: 'un' },
    ],
    gramConj: [
      { prompt: 'Je ___ (acheter) du pain.', answer: 'achète' },
      { prompt: 'Tu ___ (payer) par carte.', answer: 'paies' },
      { prompt: 'Nous ___ (chercher) le rayon.', answer: 'cherchons' },
      { prompt: 'Ils ___ (prendre) un panier.', answer: 'prennent' },
    ],
    gramChoices: [
      { prompt: 'C’est un manteau ___.', options: ['chaud', 'chaude', 'chauds'], answer: 'chaud' },
      { prompt: 'Ce sont des tomates ___.', options: ['fraîches', 'frais', 'fraîche'], answer: 'fraîches' },
      { prompt: 'Je n’ai pas ___ sac.', options: ['de', 'du', 'des'], answer: 'de' },
      { prompt: 'Elle achète ___ eau.', options: ['de l’', 'du', 'des'], answer: 'de l’' },
    ],
    oral: [
      {
        title: 'À la caisse',
        transcript:
          'Caissière : Ça fait 27 francs 50.\nClient : Je paie par carte, s’il vous plaît. Vous avez un sac ?\nCaissière : Oui, 20 centimes. Vous avez la carte de fidélité ?\nClient : Non, pas aujourd’hui. Merci, au revoir.',
        questions: [
          { prompt: 'Quel est le total ?', options: ['27,50 francs', '20 francs', '50 francs'], answer: '27,50 francs' },
          { prompt: 'Comment le client paie-t-il ?', options: ['par carte', 'en espèces', 'par chèque'], answer: 'par carte' },
          { prompt: 'Le sac coûte :', options: ['20 centimes', '2 francs', 'il est gratuit'], answer: '20 centimes' },
          { prompt: 'Le client a-t-il une carte de fidélité ?', options: ['non', 'oui', 'on ne sait pas'], answer: 'non' },
        ],
      },
    ],
    written: [
      {
        title: 'Ticket de caisse',
        text: 'Marché de Sierre — 12 mars. Pain 3,20 · Lait 1,80 · Pommes 4,50 · Fromage 6,90. Total 16,40 francs. Payé en espèces. Rendu 3,60 francs. Merci de votre visite.',
        questions: [
          { prompt: 'Où a lieu l’achat ?', options: ['à Sierre', 'à Sion', 'à Sion gare'], answer: 'à Sierre' },
          { prompt: 'Combien coûte le fromage ?', options: ['6,90 francs', '4,50 francs', '3,20 francs'], answer: '6,90 francs' },
          { prompt: 'Quel est le total ?', options: ['16,40 francs', '13,60 francs', '20 francs'], answer: '16,40 francs' },
          { prompt: 'Comment le client a-t-il payé ?', options: ['en espèces', 'par carte', 'par bon'], answer: 'en espèces' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Vous avez ce pull en taille ___ ?', answer: 'M' },
      { prompt: 'B : Oui. Il est en ___, 39 francs.', answer: 'promo' },
      { prompt: 'A : Je peux ___ par carte ?', answer: 'payer' },
      { prompt: 'B : Bien sûr. Voici votre ___.', answer: 'ticket' },
    ],
  },
  'fr-vetements': {
    vocHoles: [
      { prompt: 'On met un ___ quand il fait froid.', answer: 'manteau' },
      { prompt: 'Les ___ protègent les pieds.', answer: 'chaussures' },
      { prompt: 'Un ___ se porte sur une chemise.', answer: 'pull' },
      { prompt: 'Une ___ couvre les jambes.', answer: 'jupe' },
      { prompt: 'On met une ___ s’il pleut.', answer: 'veste' },
      { prompt: 'Un ___ tient chaud au cou.', answer: 'écharpe' },
    ],
    vocChoices: [
      { prompt: 'On porte sur la tête :', options: ['un bonnet', 'une chaussette', 'une ceinture'], answer: 'un bonnet' },
      { prompt: 'Pour le sport, on met :', options: ['un survêtement', 'un smoking', 'des talons'], answer: 'un survêtement' },
      { prompt: 'Les mains sont dans :', options: ['les gants', 'les chaussures', 'le col'], answer: 'les gants' },
      { prompt: 'Une taille plus grande que M :', options: ['L', 'XS', 'S'], answer: 'L' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['pull', 'jupe', 'pantalon', 'fourchette'], answer: 'fourchette' },
      { prompt: 'Entourez l’intrus.', options: ['bottes', 'baskets', 'sandales', 'assiette'], answer: 'assiette' },
      { prompt: 'Entourez l’intrus.', options: ['ceinture', 'bouton', 'poche', 'train'], answer: 'train' },
    ],
    gramHoles: [
      { prompt: 'Je ___ un autre coloris, s’il vous plaît.', answer: 'voudrais' },
      { prompt: '___-vous m’aider ?', answer: 'Pourriez' },
      { prompt: 'Nous ___ essayer ce manteau.', answer: 'aimerions' },
      { prompt: '___-je voir la taille S ?', answer: 'Pourrais' },
    ],
    gramConj: [
      { prompt: 'Je ___ (vouloir) ce pull.', answer: 'voudrais' },
      { prompt: 'Vous ___ (pouvoir) m’aider ?', answer: 'pourriez' },
      { prompt: 'Nous ___ (aimer) l’essayer.', answer: 'aimerions' },
      { prompt: 'Elle ___ (désirer) un échange.', answer: 'désirerait' },
    ],
    gramChoices: [
      { prompt: '___-vous un sac ?', options: ['Voudriez', 'Voudrais', 'Veux'], answer: 'Voudriez' },
      { prompt: 'Je ___ payer par carte.', options: ['voudrais', 'voudriez', 'veulent'], answer: 'voudrais' },
      { prompt: 'Cette jupe est trop ___.', options: ['petite', 'petit', 'petits'], answer: 'petite' },
      { prompt: 'Ces gants sont ___.', options: ['chauds', 'chaude', 'chaud'], answer: 'chauds' },
    ],
    oral: [
      {
        title: 'Dans la boutique',
        transcript:
          'Vendeuse : Bonjour, je peux vous aider ?\nClient : Oui, je cherche un manteau, taille L, pas trop cher.\nVendeuse : Celui-ci est à 89 francs. Vous voulez l’essayer ?\nClient : Oui, s’il vous plaît. Il est un peu grand. Vous avez du M ?\nVendeuse : Oui, au rayon du fond.',
        questions: [
          { prompt: 'Que cherche le client ?', options: ['un manteau', 'un pull', 'une jupe'], answer: 'un manteau' },
          { prompt: 'Quelle taille demande-t-il d’abord ?', options: ['L', 'M', 'S'], answer: 'L' },
          { prompt: 'Quel est le prix du manteau ?', options: ['89 francs', '19 francs', '189 francs'], answer: '89 francs' },
          { prompt: 'Le manteau L est :', options: ['un peu grand', 'trop petit', 'parfait'], answer: 'un peu grand' },
        ],
      },
    ],
    written: [
      {
        title: 'Étiquette de vêtement',
        text: 'Pull col V, 100 % coton. Couleur : bleu marine. Tailles : S, M, L, XL. Prix : 34,90 francs. Lavage à 30 °. Promotion jusqu’au 30 avril : −20 %.',
        questions: [
          { prompt: 'De quel vêtement s’agit-il ?', options: ['un pull', 'un manteau', 'une jupe'], answer: 'un pull' },
          { prompt: 'Quelle est la matière ?', options: ['coton', 'laine', 'cuir'], answer: 'coton' },
          { prompt: 'Quel est le prix affiché ?', options: ['34,90 francs', '20 francs', '30 francs'], answer: '34,90 francs' },
          { prompt: 'Jusqu’à quand dure la promo ?', options: ['30 avril', '30 mars', '30 mai'], answer: '30 avril' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Je ___ essayer ce pantalon.', answer: 'voudrais' },
      { prompt: 'B : Bien sûr. La cabine est à ___.', answer: 'droite' },
      { prompt: 'A : Il est trop ___. Vous avez du 40 ?', answer: 'long' },
      { prompt: 'B : Oui. Je vous l’___ tout de suite.', answer: 'apporte' },
    ],
  },
  'fr-nourriture': {
    vocHoles: [
      { prompt: 'Le matin, je prends le ___.', answer: 'petit-déjeuner' },
      { prompt: 'On commande la ___ au restaurant.', answer: 'carte' },
      { prompt: 'L’eau est dans une ___.', answer: 'carafe' },
      { prompt: 'Le ___ arrive après le plat.', answer: 'dessert' },
      { prompt: 'Je voudrais une ___ de pain.', answer: 'tranche' },
      { prompt: 'Le serveur apporte l’___.', answer: 'addition' },
    ],
    vocChoices: [
      { prompt: 'On boit :', options: ['de l’eau', 'du pain', 'du riz'], answer: 'de l’eau' },
      { prompt: 'Un repas du soir :', options: ['le dîner', 'le goûter', 'le réveil'], answer: 'le dîner' },
      { prompt: 'On mange la soupe avec :', options: ['une cuillère', 'une fourchette', 'un couteau'], answer: 'une cuillère' },
      { prompt: 'Un menu comprend souvent :', options: ['entrée, plat, dessert', 'billet, quai, train', 'lit, oreiller, drap'], answer: 'entrée, plat, dessert' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['pomme', 'poire', 'chaise', 'banane'], answer: 'chaise' },
      { prompt: 'Entourez l’intrus.', options: ['riz', 'pâtes', 'pain', 'bus'], answer: 'bus' },
      { prompt: 'Entourez l’intrus.', options: ['sel', 'poivre', 'huile', 'fenêtre'], answer: 'fenêtre' },
    ],
    gramHoles: [
      { prompt: 'Je mange ___ pain.', answer: 'du' },
      { prompt: 'Elle boit ___ eau.', answer: 'de l’' },
      { prompt: 'Nous prenons ___ salade.', answer: 'de la' },
      { prompt: 'Il n’y a pas ___ fromage.', answer: 'de' },
      { prompt: 'Vous voulez ___ fruits ?', answer: 'des' },
      { prompt: 'Je ne bois pas ___ café.', answer: 'de' },
    ],
    gramConj: [
      { prompt: 'Je ___ (manger) une pomme.', answer: 'mange' },
      { prompt: 'Tu ___ (boire) de l’eau.', answer: 'bois' },
      { prompt: 'Nous ___ (prendre) le menu.', answer: 'prenons' },
      { prompt: 'Ils ___ (commander) un dessert.', answer: 'commandent' },
    ],
    gramChoices: [
      { prompt: 'Je voudrais ___ riz.', options: ['du', 'de la', 'des'], answer: 'du' },
      { prompt: 'Elle n’achète pas ___ viande.', options: ['de', 'du', 'de la'], answer: 'de' },
      { prompt: 'Nous buvons ___ thé.', options: ['du', 'de la', 'des'], answer: 'du' },
      { prompt: 'Il y a ___ fraises.', options: ['des', 'du', 'de la'], answer: 'des' },
    ],
    oral: [
      {
        title: 'Au restaurant',
        transcript:
          'Serveur : Bonsoir. Vous avez choisi ?\nCliente : Oui. En entrée, une salade, et ensuite le poisson. Comme boisson, une carafe d’eau.\nServeur : Très bien. Et comme dessert ?\nCliente : Une tarte aux pommes, s’il vous plaît.\nServeur : Parfait. Ça arrive.',
        questions: [
          { prompt: 'Que prend la cliente en entrée ?', options: ['une salade', 'une soupe', 'rien'], answer: 'une salade' },
          { prompt: 'Quel plat commande-t-elle ?', options: ['le poisson', 'la viande', 'les pâtes'], answer: 'le poisson' },
          { prompt: 'Que boit-elle ?', options: ['de l’eau', 'du vin', 'un soda'], answer: 'de l’eau' },
          { prompt: 'Quel dessert veut-elle ?', options: ['une tarte aux pommes', 'une glace', 'un café'], answer: 'une tarte aux pommes' },
        ],
      },
    ],
    written: [
      {
        title: 'Menu du jour',
        text: 'Menu 18 francs. Entrée : soupe ou salade. Plat : poulet-riz ou filet de perche. Dessert : yogourt ou fruit. Boisson non comprise. Service jusqu’à 14 h. Cuisine fermée le lundi.',
        questions: [
          { prompt: 'Quel est le prix du menu ?', options: ['18 francs', '14 francs', '8 francs'], answer: '18 francs' },
          { prompt: 'Le poulet est servi avec :', options: ['du riz', 'des frites', 'des pâtes'], answer: 'du riz' },
          { prompt: 'La boisson est :', options: ['non comprise', 'comprise', 'gratuite toujours'], answer: 'non comprise' },
          { prompt: 'Quel jour la cuisine est-elle fermée ?', options: ['lundi', 'dimanche', 'mardi'], answer: 'lundi' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Je voudrais ___ café, s’il vous plaît.', answer: 'un' },
      { prompt: 'B : Avec ___ lait ?', answer: 'du' },
      { prompt: 'A : Non, sans ___ sucre.', answer: 'de' },
      { prompt: 'B : Et l’___ tout de suite ?', answer: 'addition' },
    ],
  },
  'fr-sante': {
    vocHoles: [
      { prompt: 'J’ai mal à la ___.', answer: 'tête' },
      { prompt: 'Elle a de la ___.', answer: 'fièvre' },
      { prompt: 'On prend rendez-vous chez le ___.', answer: 'médecin' },
      { prompt: 'La ___ vend les médicaments.', answer: 'pharmacie' },
      { prompt: 'Il tousse et il a un ___.', answer: 'rhume' },
      { prompt: 'On met un ___ sur la plaie.', answer: 'pansement' },
    ],
    vocChoices: [
      { prompt: 'On écoute le cœur avec :', options: ['un stéthoscope', 'une fourchette', 'un ticket'], answer: 'un stéthoscope' },
      { prompt: 'Un médicament se prend souvent :', options: ['avec de l’eau', 'avec un manteau', 'à la gare'], answer: 'avec de l’eau' },
      { prompt: 'Si on se coupe, on a :', options: ['une plaie', 'un loyer', 'un quai'], answer: 'une plaie' },
      { prompt: 'Le contraire de malade :', options: ['en forme', 'en retard', 'en solde'], answer: 'en forme' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['fièvre', 'toux', 'rhume', 'balai'], answer: 'balai' },
      { prompt: 'Entourez l’intrus.', options: ['médecin', 'infirmier', 'pharmacien', 'conducteur'], answer: 'conducteur' },
      { prompt: 'Entourez l’intrus.', options: ['ordonnance', 'comprimé', 'sirop', 'valise'], answer: 'valise' },
    ],
    gramHoles: [
      { prompt: 'Il ___ rester au lit.', answer: 'faut' },
      { prompt: 'Tu ___ prendre ce sirop.', answer: 'dois' },
      { prompt: 'Nous ___ aller chez le médecin.', answer: 'devons' },
      { prompt: 'Il ne ___ pas trop d’efforts.', answer: 'faut' },
    ],
    gramConj: [
      { prompt: 'Je ___ (devoir) me reposer.', answer: 'dois' },
      { prompt: 'Tu ___ (prendre) un comprimé.', answer: 'prends' },
      { prompt: 'Elle ___ (aller) à la pharmacie.', answer: 'va' },
      { prompt: 'Vous ___ (devoir) boire de l’eau.', answer: 'devez' },
    ],
    gramChoices: [
      { prompt: 'Il ___ appeler le médecin.', options: ['faut', 'fautes', 'falloir'], answer: 'faut' },
      { prompt: 'Tu ___ rester à la maison.', options: ['dois', 'doit', 'doivent'], answer: 'dois' },
      { prompt: 'Nous ___ ces médicaments.', options: ['prenons', 'prenez', 'prend'], answer: 'prenons' },
      { prompt: 'Vous ___ chez le dentiste.', options: ['allez', 'va', 'vont'], answer: 'allez' },
    ],
    oral: [
      {
        title: 'Chez le médecin',
        transcript:
          'Médecin : Bonjour. Qu’est-ce qui ne va pas ?\nPatient : J’ai mal à la gorge depuis deux jours. J’ai un peu de fièvre.\nMédecin : Ouvrez la bouche. Oui, c’est une angine. Il faut du repos et ce médicament trois fois par jour.\nPatient : Je peux aller au travail ?\nMédecin : Non, restez à la maison jusqu’à jeudi.',
        questions: [
          { prompt: 'Où le patient a-t-il mal ?', options: ['à la gorge', 'au dos', 'aux dents'], answer: 'à la gorge' },
          { prompt: 'Depuis quand ?', options: ['deux jours', 'deux semaines', 'deux heures'], answer: 'deux jours' },
          { prompt: 'Quel est le diagnostic ?', options: ['une angine', 'une grippe', 'rien'], answer: 'une angine' },
          { prompt: 'Peut-il aller au travail ?', options: ['non', 'oui', 'seulement le matin'], answer: 'non' },
        ],
      },
    ],
    written: [
      {
        title: 'Ordonnance',
        text: 'Dr Morel, Sion. Patient : Elias Haddad. Repos trois jours. Sirop pour la toux : 1 cuillère le matin et le soir. Paracétamol si fièvre, 1 comprimé toutes les 6 heures. Revenir vendredi si ça ne va pas mieux.',
        questions: [
          { prompt: 'Combien de jours de repos ?', options: ['trois', 'six', 'un'], answer: 'trois' },
          { prompt: 'Quand prendre le sirop ?', options: ['matin et soir', 'seulement le soir', 'toutes les heures'], answer: 'matin et soir' },
          { prompt: 'Le paracétamol est pour :', options: ['la fièvre', 'la toux', 'le dos'], answer: 'la fièvre' },
          { prompt: 'Quand revenir si ça ne va pas mieux ?', options: ['vendredi', 'lundi', 'dimanche'], answer: 'vendredi' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : J’ai mal au ___.', answer: 'ventre' },
      { prompt: 'B : Depuis ___ ?', answer: 'quand' },
      { prompt: 'A : Depuis hier. Il ___ que je me repose.', answer: 'faut' },
      { prompt: 'B : Oui, et tu ___ boire beaucoup d’eau.', answer: 'dois' },
    ],
  },
  'fr-transports': {
    vocHoles: [
      { prompt: 'Je prends le ___ à 8 h 12.', answer: 'train' },
      { prompt: 'Le bus s’arrête à l’___.', answer: 'arrêt' },
      { prompt: 'Mon ___ est valable une heure.', answer: 'billet' },
      { prompt: 'Le ___ part du quai 4.', answer: 'train' },
      { prompt: 'Nous changeons à la ___.', answer: 'gare' },
      { prompt: 'Il y a des ___ le dimanche.', answer: 'travaux' },
    ],
    vocChoices: [
      { prompt: 'Pour aller en ville, on peut prendre :', options: ['le tram', 'le lit', 'la casserole'], answer: 'le tram' },
      { prompt: 'On valide le billet :', options: ['dans le bus', 'dans le frigo', 'sous l’oreiller'], answer: 'dans le bus' },
      { prompt: 'Un horaire indique :', options: ['les heures de départ', 'les prix des pulls', 'les recettes'], answer: 'les heures de départ' },
      { prompt: 'Le contraire de arriver :', options: ['partir', 'acheter', 'dormir'], answer: 'partir' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['train', 'bus', 'vélo', 'fourchette'], answer: 'fourchette' },
      { prompt: 'Entourez l’intrus.', options: ['quai', 'voie', 'horaire', 'coussin'], answer: 'coussin' },
      { prompt: 'Entourez l’intrus.', options: ['billet', 'abonnement', 'correspondance', 'yaourt'], answer: 'yaourt' },
    ],
    gramHoles: [
      { prompt: 'Je ___ à la gare.', answer: 'vais' },
      { prompt: 'Tu ___ en bus.', answer: 'vas' },
      { prompt: 'Elle ___ au travail à vélo.', answer: 'va' },
      { prompt: 'Nous ___ à Lausanne.', answer: 'allons' },
      { prompt: 'Vous ___ à pied ?', answer: 'allez' },
      { prompt: 'Ils ___ à l’aéroport.', answer: 'vont' },
    ],
    gramConj: [
      { prompt: 'Je ___ (aller) à Sion.', answer: 'vais' },
      { prompt: 'Tu ___ (prendre) le bus 3.', answer: 'prends' },
      { prompt: 'Nous ___ (descendre) à la gare.', answer: 'descendons' },
      { prompt: 'Ils ___ (changer) à Martigny.', answer: 'changent' },
    ],
    gramChoices: [
      { prompt: 'Je ___ en train.', options: ['vais', 'vas', 'vont'], answer: 'vais' },
      { prompt: 'Vous ___ où ?', options: ['allez', 'va', 'allons'], answer: 'allez' },
      { prompt: 'Nous ___ à l’arrêt.', options: ['allons', 'allez', 'vont'], answer: 'allons' },
      { prompt: 'Elle ___ le tram.', options: ['prend', 'prends', 'prenez'], answer: 'prend' },
    ],
    oral: [
      {
        title: 'À la gare',
        transcript:
          'Voyageur : Pardon, le train pour Brigue part de quel quai ?\nEmployée : Du quai 4, à 8 h 12. Il y a une correspondance à Viège.\nVoyageur : Le billet est valable combien de temps ?\nEmployée : Deux heures. Attention, il y a des travaux dimanche : bus de remplacement.',
        questions: [
          { prompt: 'De quel quai part le train ?', options: ['quai 4', 'quai 2', 'quai 8'], answer: 'quai 4' },
          { prompt: 'À quelle heure part-il ?', options: ['8 h 12', '8 h 04', '12 h 08'], answer: '8 h 12' },
          { prompt: 'Où se fait la correspondance ?', options: ['à Viège', 'à Sion', 'à Brigue seulement'], answer: 'à Viège' },
          { prompt: 'Que se passe-t-il dimanche ?', options: ['un bus de remplacement', 'aucun train jamais', 'un vol'], answer: 'un bus de remplacement' },
        ],
      },
    ],
    written: [
      {
        title: 'Horaire affiché',
        text: 'Ligne Sion → Genève. Départ 7 h 04, quai 2, arrivée 9 h 11. Train direct. Billet 2e classe : 36 francs. Abonnement demi-tarif accepté. Dimanche : premier train à 8 h 04.',
        questions: [
          { prompt: 'Où va le train ?', options: ['à Genève', 'à Sion', 'à Brigue'], answer: 'à Genève' },
          { prompt: 'De quel quai part-il en semaine ?', options: ['quai 2', 'quai 4', 'quai 7'], answer: 'quai 2' },
          { prompt: 'Quel est le prix en 2e classe ?', options: ['36 francs', '7 francs', '9 francs'], answer: '36 francs' },
          { prompt: 'Le dimanche, le premier train est à :', options: ['8 h 04', '7 h 04', '9 h 11'], answer: '8 h 04' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Je ___ à la gare. Tu viens ?', answer: 'vais' },
      { prompt: 'B : Oui. On ___ le bus ou le train ?', answer: 'prend' },
      { prompt: 'A : Le train. Il ___ à 10 h 20.', answer: 'part' },
      { prompt: 'B : D’accord. J’achète les ___.', answer: 'billets' },
    ],
  },
  'fr-inviter': {
    vocHoles: [
      { prompt: 'Tu ___ venir samedi ?', answer: 'veux' },
      { prompt: 'La fête ___ à dix-neuf heures.', answer: 'commence' },
      { prompt: 'Je t’___ chez moi.', answer: 'invite' },
      { prompt: 'Tu ___ un gâteau ?', answer: 'apportes' },
      { prompt: 'On se retrouve à l’___.', answer: 'entrée' },
      { prompt: 'Merci pour l’___.', answer: 'invitation' },
    ],
    vocChoices: [
      { prompt: 'Pour proposer une sortie :', options: ['Tu es libre samedi ?', 'Tu as mal ?', 'C’est combien ?'], answer: 'Tu es libre samedi ?' },
      { prompt: 'On apporte souvent :', options: ['un dessert', 'un lit', 'un train'], answer: 'un dessert' },
      { prompt: 'Le contraire d’accepter :', options: ['refuser', 'acheter', 'dormir'], answer: 'refuser' },
      { prompt: 'Une fête a souvent :', options: ['des invités', 'des quais', 'des ordonnances'], answer: 'des invités' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['fête', 'invitation', 'gâteau', 'ordonnance'], answer: 'ordonnance' },
      { prompt: 'Entourez l’intrus.', options: ['samedi', 'dimanche', 'vendredi', 'fièvre'], answer: 'fièvre' },
      { prompt: 'Entourez l’intrus.', options: ['accepter', 'venir', 'apporter', 'tousser'], answer: 'tousser' },
    ],
    gramHoles: [
      { prompt: '___ tu viens samedi ?', answer: 'Est-ce que' },
      { prompt: 'Tu viens ___, ce soir ?', answer: 'demain' },
      { prompt: '___-vous libres vendredi ?', answer: 'Êtes' },
      { prompt: 'On se retrouve ___ ?', answer: 'où' },
    ],
    gramConj: [
      { prompt: 'Tu ___ (vouloir) venir ?', answer: 'veux' },
      { prompt: 'Vous ___ (pouvoir) passer à 19 h ?', answer: 'pouvez' },
      { prompt: 'Nous ___ (organiser) une fête.', answer: 'organisons' },
      { prompt: 'Ils ___ (accepter) l’invitation.', answer: 'acceptent' },
    ],
    gramChoices: [
      { prompt: '___ tu es libre ?', options: ['Est-ce que', 'Qu’est-ce que', 'Où est-ce'], answer: 'Est-ce que' },
      { prompt: '___-vous d’accord ?', options: ['Êtes', 'Es', 'Sommes'], answer: 'Êtes' },
      { prompt: 'On se voit ___ ?', options: ['quand', 'qui', 'quoi'], answer: 'quand' },
      { prompt: 'Tu peux ___ un gâteau ?', options: ['apporter', 'apporte', 'apportes'], answer: 'apporter' },
    ],
    oral: [
      {
        title: 'Une invitation',
        transcript:
          'Samir : Tu es libre samedi soir ? On fête l’anniversaire de Nora chez moi.\nLéa : Super ! Ça commence à quelle heure ?\nSamir : À 19 h. Tu peux apporter une salade ?\nLéa : Oui, pas de problème. Il y a beaucoup de monde ?\nSamir : Une dizaine de personnes. Voici l’adresse : rue du Rhône 12.',
        questions: [
          { prompt: 'Quel jour est la fête ?', options: ['samedi', 'vendredi', 'dimanche'], answer: 'samedi' },
          { prompt: 'À quelle heure commence-t-elle ?', options: ['19 h', '12 h', '9 h'], answer: '19 h' },
          { prompt: 'Que peut apporter Léa ?', options: ['une salade', 'un gâteau', 'rien'], answer: 'une salade' },
          { prompt: 'Combien d’invités ?', options: ['une dizaine', 'deux', 'cinquante'], answer: 'une dizaine' },
        ],
      },
    ],
    written: [
      {
        title: 'Message d’invitation',
        text: 'Salut ! On organise un pique-nique dimanche à 12 h au parc des Îles. Amenez quelque chose à partager. S’il pleut, on se retrouve chez moi, impasse des Prés 4. Répondez avant vendredi, s’il vous plaît.',
        questions: [
          { prompt: 'Quel jour est le pique-nique ?', options: ['dimanche', 'vendredi', 'samedi'], answer: 'dimanche' },
          { prompt: 'Où a-t-il lieu s’il fait beau ?', options: ['au parc des Îles', 'à la gare', 'au restaurant'], answer: 'au parc des Îles' },
          { prompt: 'Que doivent faire les invités ?', options: ['amener quelque chose', 'acheter un billet', 'rester à la maison'], answer: 'amener quelque chose' },
          { prompt: 'Quand faut-il répondre ?', options: ['avant vendredi', 'le jour même', 'lundi'], answer: 'avant vendredi' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Tu es ___ samedi ?', answer: 'libre' },
      { prompt: 'B : Oui. Tu ___ quelque chose ?', answer: 'proposes' },
      { prompt: 'A : On peut ___ au cinéma.', answer: 'aller' },
      { prompt: 'B : D’accord. ___ se retrouve-t-on ?', answer: 'Où' },
    ],
  },
  'fr-travail': {
    vocHoles: [
      { prompt: 'Je commence à ___ heures.', answer: 'huit' },
      { prompt: 'Elle travaille à ___-temps.', answer: 'temps' },
      { prompt: 'Le ___ dure une heure à midi.', answer: 'pause' },
      { prompt: 'Nous avons une ___ lundi.', answer: 'réunion' },
      { prompt: 'Il cherche un ___.', answer: 'emploi' },
      { prompt: 'Le ___ ferme à 17 h.', answer: 'bureau' },
    ],
    vocChoices: [
      { prompt: 'Une personne qui soigne :', options: ['un infirmier', 'un boulanger', 'un chauffeur'], answer: 'un infirmier' },
      { prompt: 'On envoie un :', options: ['courriel', 'coussin', 'quai'], answer: 'courriel' },
      { prompt: 'Le contraire de commencer :', options: ['finir', 'acheter', 'inviter'], answer: 'finir' },
      { prompt: 'Un horaire de travail indique :', options: ['les heures', 'les desserts', 'les tailles'], answer: 'les heures' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['bureau', 'réunion', 'collègue', 'oreiller'], answer: 'oreiller' },
      { prompt: 'Entourez l’intrus.', options: ['contrat', 'salaire', 'horaire', 'tarte'], answer: 'tarte' },
      { prompt: 'Entourez l’intrus.', options: ['secrétaire', 'cuisinier', 'mécanicien', 'fenêtre'], answer: 'fenêtre' },
    ],
    gramHoles: [
      { prompt: 'Elle est une collègue ___.', answer: 'sérieuse' },
      { prompt: 'C’est un travail ___.', answer: 'intéressant' },
      { prompt: 'Nous sommes ___.', answer: 'occupés' },
      { prompt: 'Les réunions sont ___.', answer: 'courtes' },
    ],
    gramConj: [
      { prompt: 'Je ___ (travailler) le matin.', answer: 'travaille' },
      { prompt: 'Tu ___ (finir) à 17 h.', answer: 'finis' },
      { prompt: 'Nous ___ (chercher) un stage.', answer: 'cherchons' },
      { prompt: 'Ils ___ (commencer) tôt.', answer: 'commencent' },
    ],
    gramChoices: [
      { prompt: 'C’est une équipe ___.', options: ['motivée', 'motivé', 'motivés'], answer: 'motivée' },
      { prompt: 'Ils sont ___.', options: ['ponctuels', 'ponctuelle', 'ponctuel'], answer: 'ponctuels' },
      { prompt: 'Le bureau est ___.', options: ['calme', 'calmes', 'calmee'], answer: 'calme' },
      { prompt: 'Elle est ___.', options: ['fatiguée', 'fatigué', 'fatigués'], answer: 'fatiguée' },
    ],
    oral: [
      {
        title: 'À l’accueil',
        transcript:
          'Réception : Bonjour, vous avez rendez-vous ?\nVisiteur : Oui, avec Madame Favre, à 10 h. Je m’appelle Kenji Mori.\nRéception : Prenez l’ascenseur, 3e étage. Elle est un peu en retard, cinq minutes.\nVisiteur : Pas de problème. Je peux attendre ici ?\nRéception : Oui, il y a des chaises près de la fenêtre.',
        questions: [
          { prompt: 'Avec qui le visiteur a-t-il rendez-vous ?', options: ['Madame Favre', 'Kenji Mori', 'la réception'], answer: 'Madame Favre' },
          { prompt: 'À quelle heure ?', options: ['10 h', '3 h', '5 h'], answer: '10 h' },
          { prompt: 'À quel étage monter ?', options: ['3e étage', 'rez-de-chaussée', '5e étage'], answer: '3e étage' },
          { prompt: 'Madame Favre est :', options: ['en retard de cinq minutes', 'absente', 'en avance'], answer: 'en retard de cinq minutes' },
        ],
      },
    ],
    written: [
      {
        title: 'Annonce d’emploi',
        text: 'Nous cherchons un·e employé·e de commerce à 80 %, à Sion. Horaires : lundi-vendredi, 8 h–16 h 30. Bon français exigé. Salaire selon convention. Envoyez un CV avant le 15 mai à emploi@atelier-sion.ch.',
        questions: [
          { prompt: 'Quel est le taux de travail ?', options: ['80 %', '100 %', '50 %'], answer: '80 %' },
          { prompt: 'Où se trouve le poste ?', options: ['à Sion', 'à Sierre', 'à Lausanne'], answer: 'à Sion' },
          { prompt: 'Quels jours travaille-t-on ?', options: ['lundi-vendredi', 'week-end', 'nuit seulement'], answer: 'lundi-vendredi' },
          { prompt: 'Quand envoyer le CV ?', options: ['avant le 15 mai', 'après juin', 'le jour même'], answer: 'avant le 15 mai' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Vous ___ dans quel service ?', answer: 'travaillez' },
      { prompt: 'B : À l’accueil. Je ___ à 8 h.', answer: 'commence' },
      { prompt: 'A : Il y a une ___ aujourd’hui ?', answer: 'réunion' },
      { prompt: 'B : Oui, à 14 h, dans le petit ___.', answer: 'bureau' },
    ],
  },
  'fr-journee': {
    vocHoles: [
      { prompt: 'Je me ___ à 6 h 30.', answer: 'lève' },
      { prompt: 'Elle se ___ les dents.', answer: 'brosse' },
      { prompt: 'Nous ___ le petit-déjeuner.', answer: 'prenons' },
      { prompt: 'Il se ___ à 22 h 30.', answer: 'couche' },
      { prompt: 'Le ___ sonne à 7 h.', answer: 'réveil' },
      { prompt: 'Après le travail, je fais les ___.', answer: 'courses' },
    ],
    vocChoices: [
      { prompt: 'Le matin, on :', options: ['se lève', 'se couche', 'rêve seulement'], answer: 'se lève' },
      { prompt: 'Avant de sortir, on :', options: ['s’habille', 's’endort', 'se couche'], answer: 's’habille' },
      { prompt: 'À midi, on :', options: ['déjeune', 'prend le petit-déjeuner', 'soupe le soir'], answer: 'déjeune' },
      { prompt: 'Le soir, on :', options: ['se couche', 'se lève', 'commence l’école'], answer: 'se couche' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['matin', 'midi', 'soir', 'balcon'], answer: 'balcon' },
      { prompt: 'Entourez l’intrus.', options: ['réveil', 'douche', 'petit-déjeuner', 'quai'], answer: 'quai' },
      { prompt: 'Entourez l’intrus.', options: ['lundi', 'mardi', 'avril', 'jeudi'], answer: 'avril' },
    ],
    gramHoles: [
      { prompt: 'Je ___ lève tôt.', answer: 'me' },
      { prompt: 'Tu te ___ à 7 h.', answer: 'lèves' },
      { prompt: 'Elle ___ habille vite.', answer: 's’' },
      { prompt: 'Nous nous ___ les dents.', answer: 'brossons' },
      { prompt: 'Vous vous ___ à quelle heure ?', answer: 'couchez' },
      { prompt: 'Ils ___ réveillent tard.', answer: 'se' },
    ],
    gramConj: [
      { prompt: 'Je ___ (se lever) à 6 h.', answer: 'me lève' },
      { prompt: 'Tu ___ (se laver).', answer: 'te laves' },
      { prompt: 'Nous ___ (se coucher) tôt.', answer: 'nous couchons' },
      { prompt: 'Ils ___ (s’habiller) vite.', answer: 's’habillent' },
    ],
    gramChoices: [
      { prompt: 'Je ___ à 7 h.', options: ['me lève', 'se lève', 'te lèves'], answer: 'me lève' },
      { prompt: 'Elle ___ les cheveux.', options: ['se lave', 'me lave', 'nous lavons'], answer: 'se lave' },
      { prompt: 'Vous ___ trop tard.', options: ['vous couchez', 'se couchent', 'me couche'], answer: 'vous couchez' },
      { prompt: 'Nous ___ ensemble.', options: ['nous levons', 'se lèvent', 'te lèves'], answer: 'nous levons' },
    ],
    oral: [
      {
        title: 'Une journée typique',
        transcript:
          'Journaliste : Vous vous levez à quelle heure ?\nAmira : À 6 h. Je prends le bus à 7 h et je commence à 8 h.\nJournaliste : Et le soir ?\nAmira : Je rentre à 17 h 30. Je prépare le dîner, puis je me couche vers 22 h.\nJournaliste : Vous avez le temps de vous reposer le week-end ?\nAmira : Oui, le dimanche surtout.',
        questions: [
          { prompt: 'À quelle heure Amira se lève-t-elle ?', options: ['6 h', '7 h', '8 h'], answer: '6 h' },
          { prompt: 'Comment va-t-elle au travail ?', options: ['en bus', 'à pied', 'en train'], answer: 'en bus' },
          { prompt: 'À quelle heure rentre-t-elle ?', options: ['17 h 30', '8 h', '22 h'], answer: '17 h 30' },
          { prompt: 'Quand se repose-t-elle surtout ?', options: ['le dimanche', 'le lundi', 'le matin'], answer: 'le dimanche' },
        ],
      },
    ],
    written: [
      {
        title: 'Emploi du temps',
        text: 'Lundi au vendredi : réveil 6 h 15, douche, petit-déjeuner, départ 7 h 10. Cours de 8 h à 11 h 45. Pause déjeuner. Après-midi : stage de 13 h 30 à 16 h 30. Soir : courses ou sport. Coucher vers 22 h 30.',
        questions: [
          { prompt: 'À quelle heure est le réveil ?', options: ['6 h 15', '7 h 10', '8 h'], answer: '6 h 15' },
          { prompt: 'Quand commencent les cours ?', options: ['8 h', '7 h 10', '13 h 30'], answer: '8 h' },
          { prompt: 'Que fait la personne l’après-midi ?', options: ['un stage', 'du sport seulement', 'rien'], answer: 'un stage' },
          { prompt: 'Vers quelle heure se couche-t-elle ?', options: ['22 h 30', '16 h 30', '11 h 45'], answer: '22 h 30' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Tu te ___ à quelle heure ?', answer: 'lèves' },
      { prompt: 'B : À 7 h. Après, je me ___.', answer: 'douche' },
      { prompt: 'A : Tu ___ le petit-déjeuner à la maison ?', answer: 'prends' },
      { prompt: 'B : Oui, puis je ___ à 7 h 40.', answer: 'pars' },
    ],
  },
  'fr-loisirs': {
    vocHoles: [
      { prompt: 'Le week-end, je fais du ___.', answer: 'sport' },
      { prompt: 'Elle aime ___ la radio.', answer: 'écouter' },
      { prompt: 'Nous allons au ___.', answer: 'cinéma' },
      { prompt: 'Il joue de la ___.', answer: 'guitare' },
      { prompt: 'On se promène dans le ___.', answer: 'parc' },
      { prompt: 'Ils regardent un ___.', answer: 'film' },
    ],
    vocChoices: [
      { prompt: 'Un loisir en salle :', options: ['le cinéma', 'le ski de fond', 'la randonnée'], answer: 'le cinéma' },
      { prompt: 'On emprunte des livres :', options: ['à la bibliothèque', 'à la pharmacie', 'à la gare seulement'], answer: 'à la bibliothèque' },
      { prompt: 'Un instrument :', options: ['un piano', 'un ticket', 'un loyer'], answer: 'un piano' },
      { prompt: 'Le contraire de s’ennuyer :', options: ['s’amuser', 'se coucher', 'se taire'], answer: 's’amuser' },
    ],
    vocIntrus: [
      { prompt: 'Entourez l’intrus.', options: ['cinéma', 'musée', 'concert', 'ordonnance'], answer: 'ordonnance' },
      { prompt: 'Entourez l’intrus.', options: ['football', 'natation', 'course', 'fièvre'], answer: 'fièvre' },
      { prompt: 'Entourez l’intrus.', options: ['livre', 'film', 'chanson', 'caisse'], answer: 'caisse' },
    ],
    gramHoles: [
      { prompt: 'Je ___ écoute le soir. (la radio)', answer: 'l’' },
      { prompt: 'Tu ___ regardes souvent. (ce film)', answer: 'le' },
      { prompt: 'Nous ___ aimons beaucoup. (ces sorties)', answer: 'les' },
      { prompt: 'Elle ___ invite samedi. (son ami)', answer: 'l’' },
    ],
    gramConj: [
      { prompt: 'Je ___ (aimer) danser.', answer: 'aime' },
      { prompt: 'Tu ___ (jouer) au foot.', answer: 'joues' },
      { prompt: 'Nous ___ (regarder) un film.', answer: 'regardons' },
      { prompt: 'Ils ___ (écouter) de la musique.', answer: 'écoutent' },
    ],
    gramChoices: [
      { prompt: 'Tu aimes ce livre ? Oui, je ___ aime.', options: ['l’', 'le', 'la'], answer: 'l’' },
      { prompt: 'Vous voyez mes amis ? Oui, nous ___ voyons.', options: ['les', 'leur', 'la'], answer: 'les' },
      { prompt: 'Elle prend la photo. Elle ___ prend.', options: ['la', 'le', 'les'], answer: 'la' },
      { prompt: 'J’invite Paul. Je ___ invite.', options: ['l’', 'la', 'les'], answer: 'l’' },
    ],
    oral: [
      {
        title: 'Parler de ses loisirs',
        transcript:
          'Nour : Qu’est-ce que tu fais le week-end ?\nPavel : Le samedi, je joue au foot. Le dimanche, je vais à la bibliothèque ou au cinéma.\nNour : Tu aimes les films d’action ?\nPavel : Pas trop. Je préfère les comédies. Et toi ?\nNour : Moi, je fais de la natation et je joue de la guitare.',
        questions: [
          { prompt: 'Que fait Pavel le samedi ?', options: ['il joue au foot', 'il nage', 'il travaille'], answer: 'il joue au foot' },
          { prompt: 'Où va-t-il le dimanche ?', options: ['à la bibliothèque ou au cinéma', 'à la gare', 'à l’hôpital'], answer: 'à la bibliothèque ou au cinéma' },
          { prompt: 'Quel type de films préfère-t-il ?', options: ['les comédies', 'les films d’action', 'aucun'], answer: 'les comédies' },
          { prompt: 'Quel instrument joue Nour ?', options: ['la guitare', 'le piano', 'le violon'], answer: 'la guitare' },
        ],
      },
    ],
    written: [
      {
        title: 'Programme du centre',
        text: 'Centre culturel de Martigny. Mardi 18 h 30 : atelier photo. Mercredi 19 h : chorale. Samedi 14 h : sortie vélo, départ devant la gare. Inscription à l’accueil avant mercredi. Tarif : 10 francs par activité.',
        questions: [
          { prompt: 'Quel jour est l’atelier photo ?', options: ['mardi', 'mercredi', 'samedi'], answer: 'mardi' },
          { prompt: 'À quelle heure est la chorale ?', options: ['19 h', '18 h 30', '14 h'], answer: '19 h' },
          { prompt: 'Où commence la sortie vélo ?', options: ['devant la gare', 'au musée', 'à la piscine'], answer: 'devant la gare' },
          { prompt: 'Quel est le tarif ?', options: ['10 francs', '14 francs', '19 francs'], answer: '10 francs' },
        ],
      },
    ],
    dialogue: [
      { prompt: 'A : Tu aimes le ___ ?', answer: 'cinéma' },
      { prompt: 'B : Oui, je ___ aime beaucoup.', answer: 'l’' },
      { prompt: 'A : On peut ___ un film samedi.', answer: 'regarder' },
      { prompt: 'B : D’accord. Je ___ invite à 18 h.', answer: 't’' },
    ],
  },
}

export function frenchBank(topic: string): ThemeBank | null {
  return banks[topic] ?? null
}

export function parseFrenchType(typeId: string): { topic: string; track: 'voc' | 'gram' | 'com'; kind: string } | null {
  const match = /^(fr-[a-z]+)-(voc|gram|com)-([a-z-]+)$/.exec(typeId)
  if (!match) return null
  return { topic: match[1]!, track: match[2] as 'voc' | 'gram' | 'com', kind: match[3]! }
}

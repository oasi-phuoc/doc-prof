import type { SocieteImage, SocieteUnite } from '../types'
import { choix, reponse, vraiFaux } from './questions'
import { MAPS } from '../atlas'

const frontieres: SocieteImage = {
  src: '/lib/images/societe/suisse-voisins.webp',
  alt: 'Carte de la Suisse. La France est à l’ouest, l’Allemagne au nord, l’Autriche et le Liechtenstein à l’est, et l’Italie au sud.',
  caption: 'Suis le trait autour de la Suisse. Il marque la frontière.',
}

const cantons: SocieteImage = {
  src: '/lib/images/societe/cantons-villes.webp',
  alt: 'Carte des limites cantonales avec les sigles et les villes de Genève, Lausanne, Berne, Sion et Zurich.',
  caption: 'Les traits séparent les cantons. Les points indiquent des villes.',
}

const eaux: SocieteImage = {
  src: '/lib/images/societe/lacs-fleuves.webp',
  alt: 'Carte schématique des lacs Léman, de Neuchâtel et de Constance avec le Rhône, le Rhin et l’Aar.',
  caption: 'Une flèche montre le sens suivi par chaque cours d’eau.',
}

export const unitesA1: SocieteUnite[] = [
  {
    id: 'voisins', niveau: 'A1', titre: 'La Suisse et ses voisins',
    objectif: 'Je peux montrer la Suisse et nommer ses pays voisins.',
    situation: 'Tu regardes la carte avant un voyage en France.',
    explication: [
      'La Suisse est un pays en Europe.',
      'Un pays voisin touche un autre pays.',
      'La France et l’Allemagne touchent la Suisse.',
      'L’Italie, l’Autriche et le Liechtenstein touchent aussi la Suisse.',
    ],
    lexique: [
      ['le pays', 'Un territoire avec ses autorités.'],
      ['la frontière', 'La limite entre deux pays.'],
      ['le pays voisin', 'Un pays qui touche un autre pays.'],
      ['la carte', 'Un dessin qui montre un lieu vu de dessus.'],
    ],
    image: frontieres,
    document: {
      titre: 'Une carte pour préparer la sortie',
      lignes: ['Départ le matin à Genève, en Suisse.', 'Arrivée à Annemasse, en France.'],
      image: frontieres,
      questions: [
        choix('Dans quel pays est le départ ?', ['En France', 'En Suisse', 'En Italie'], 1),
        vraiFaux('La France touche la Suisse.', true),
        reponse('Quel pays se trouve au nord de la Suisse sur la carte ?', 'L’Allemagne.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour. Notre groupe part de Genève. Genève est en Suisse. Aujourd’hui, nous allons à Annemasse, en France. Le départ est à neuf heures. Prenez la carte avec vous.',
      questions: [
        choix('D’où part le groupe ?', ['De Genève', 'De Berne', 'De Lausanne'], 0),
        vraiFaux('Le groupe va en Italie.', false),
        reponse('À quelle heure est le départ ?', 'À 9 h.'),
      ],
    },
    oral: {
      consigne: 'Votre partenaire prépare une sortie. Regardez une carte et aidez-le à situer le départ et l’arrivée.',
      actions: ['Demandez où se trouve la ville de départ.', 'Nommez le pays et un pays voisin.'],
      exemple: '— Où est Genève ? — Genève est en Suisse. La France est un pays voisin.',
    },
    ecrit: {
      consigne: 'Vous allez à Annemasse. Écrivez un petit message à un ami.',
      actions: ['Écrivez votre ville de départ.', 'Indiquez le pays de destination et l’heure du départ.'],
      exemple: 'Salut ! Je pars de Genève à 9 heures. Je vais à Annemasse, en France.',
    },
  },
  {
    id: 'cantons', niveau: 'A1', titre: 'Cantons et villes',
    objectif: 'Je peux trouver un canton et une ville sur une carte.',
    situation: 'Tu vois VD sur une adresse. VD signifie Vaud.',
    explication: [
      'La Suisse compte 26 cantons.',
      'Un canton est une partie de la Suisse.',
      'Un sigle utilise des lettres courtes. VD signifie Vaud.',
      'Lausanne est le chef-lieu du canton de Vaud.',
    ],
    lexique: [
      ['le canton', 'Une partie de la Suisse avec ses autorités.'],
      ['la commune', 'Le territoire géré par des autorités locales.'],
      ['le sigle', 'Des lettres courtes qui représentent un nom.'],
      ['le chef-lieu', 'La ville où se trouvent les autorités d’un canton.'],
    ],
    image: MAPS.sigles,
    document: {
      titre: 'Les étapes du groupe',
      lignes: ['Lundi · Genève (GE)', 'Mardi · Lausanne, canton de Vaud (VD)', 'Jeudi · Sion, canton du Valais (VS)'],
      image: cantons,
      questions: [
        choix('Quelle ville est dans le canton de Vaud ?', ['Genève', 'Sion', 'Lausanne'], 2),
        vraiFaux('VS est le sigle du canton du Valais.', true),
        reponse('Quel jour le groupe va-t-il à Genève ?', 'Lundi.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour, je m’appelle Lina. Je suis à Sion. Sion est une ville du canton du Valais. Sur la carte, le Valais est près du bord sud de la Suisse. Demain, je vais à Lausanne.',
      questions: [
        choix('Où est Lina maintenant ?', ['À Sion', 'À Lausanne', 'À Genève'], 0),
        vraiFaux('Lina est dans le canton du Valais.', true),
        reponse('Dans quelle ville va-t-elle demain ?', 'À Lausanne.'),
      ],
    },
    oral: {
      consigne: 'Présentez votre lieu de vie à une nouvelle personne. Utilisez une carte si besoin.',
      actions: ['Dites votre ville ou votre village.', 'Nommez votre canton et posez la même question à votre partenaire.'],
      exemple: 'J’habite à Lausanne, dans le canton de Vaud. Et vous, dans quel canton habitez-vous ?',
    },
    ecrit: {
      consigne: 'Écrivez deux phrases pour une carte de présentation. Vous pouvez utiliser le modèle.',
      actions: ['Indiquez une ville et son canton.', 'Écrivez le sigle du canton.'],
      exemple: 'J’habite à Sion, dans le canton du Valais. Le sigle du canton est VS.',
    },
  },
  {
    id: 'paysages', niveau: 'A1', titre: 'Les paysages suisses',
    objectif: 'Je peux reconnaître le Jura, le Plateau et les Alpes.',
    situation: 'Sur une carte, tu vois le Jura, le Plateau et les Alpes.',
    explication: [
      'Le Jura se trouve au nord-ouest.',
      'Le Plateau se trouve entre le Jura et les Alpes.',
      'Les Alpes occupent surtout le sud et l’est.',
      'Dans les Alpes, on voit des montagnes et des vallées.',
    ],
    lexique: [
      ['le paysage', 'Ce que tu vois autour de toi.'],
      ['la vallée', 'Un espace plus bas entre des montagnes.'],
      ['le plateau', 'Une région qui peut avoir des collines et des zones plates.'],
      ['le col', 'Un passage entre des montagnes.'],
    ],
    image: {
      src: '/lib/images/societe/jura-plateau-alpes.webp',
      alt: 'Profil illustré du Jura, du Plateau et des Alpes.',
      caption: 'Le dessin montre la différence de relief.',
    },
    document: {
      titre: 'Trois idées de sorties',
      lignes: ['Le Sentier · Une randonnée dans le Jura.', 'Berne · Une visite de ville sur le Plateau.', 'Zermatt · Une promenade dans les Alpes.'],
      questions: [
        choix('Où aller pour une promenade dans les Alpes ?', ['À Berne', 'À Zermatt', 'Au Sentier'], 1),
        vraiFaux('Berne est sur le Plateau.', true),
        reponse('Dans quelle région est la sortie au Sentier ?', 'Dans le Jura.'),
      ],
    },
    ecoute: {
      transcription: 'Samedi, nous allons à Zermatt, dans les Alpes. Nous allons voir les montagnes. Le groupe se retrouve à la gare à dix heures. Prenez de bonnes chaussures.',
      questions: [
        choix('De quelle région parle le message ?', ['Du Plateau', 'Du Jura', 'Des Alpes'], 2),
        vraiFaux('Le groupe se retrouve à la gare.', true),
        reponse('Que faut-il prendre ?', 'De bonnes chaussures.'),
      ],
    },
    oral: {
      consigne: 'Choisissez une sortie avec votre partenaire.',
      actions: ['Dites où vous voulez aller.', 'Nommez une chose que vous voulez voir.'],
      exemple: 'Je veux aller dans les Alpes. Je veux voir les montagnes.',
    },
    ecrit: {
      consigne: 'Écrivez deux phrases pour proposer une sortie.',
      actions: ['Nommez le lieu et sa région.', 'Indiquez une activité que vous voulez faire.'],
      exemple: 'Je propose une sortie à Berne, sur le Plateau. Nous pouvons visiter la ville.',
    },
  },
  {
    id: 'eaux', niveau: 'A1', titre: 'Lacs et cours d’eau',
    objectif: 'Je peux lire le nom d’un lac et suivre un cours d’eau.',
    situation: 'Tu regardes où le Rhône entre dans le Léman.',
    explication: [
      'Un lac est une grande étendue d’eau.',
      'Un cours d’eau coule dans un sens.',
      'Le Rhône arrive du Valais et traverse le Léman.',
      'Le Rhin traverse le lac de Constance. L’Aar rejoint le Rhin.',
    ],
    lexique: [
      ['le lac', 'Une grande étendue d’eau entourée de terres.'],
      ['le cours d’eau', 'De l’eau qui coule dans un lit.'],
      ['la rive', 'Le bord d’un lac ou d’un cours d’eau.'],
      ['la source', 'Le lieu où commence un cours d’eau.'],
    ],
    image: eaux,
    document: {
      titre: 'Deux promenades au bord de l’eau',
      lignes: ['Genève · Promenade au bord du Léman. Le Rhône sort du lac.', 'Romanshorn · Promenade au bord du lac de Constance.'],
      image: eaux,
      questions: [
        choix('Quel lac voit-on à Genève ?', ['Le lac de Constance', 'Le lac de Neuchâtel', 'Le Léman'], 2),
        vraiFaux('Le Rhône sort du Léman à Genève.', true),
        reponse('De quel lac est proche Romanshorn ?', 'Du lac de Constance.'),
      ],
    },
    ecoute: {
      transcription: 'Aujourd’hui, nous marchons au bord du Léman, à Genève. Nous voyons le Rhône. À cet endroit, le Rhône sort du lac. Notre rendez-vous est près du pont.',
      questions: [
        choix('Quel lac est près du groupe ?', ['Le Léman', 'Le lac de Zurich', 'Le lac de Constance'], 0),
        vraiFaux('Le groupe voit le Rhône.', true),
        reponse('Où est le rendez-vous ?', 'Près du pont.'),
      ],
    },
    oral: {
      consigne: 'Montrez un lac sur la carte et proposez une promenade.',
      actions: ['Nommez le lac et une ville proche.', 'Proposez un lieu où retrouver votre partenaire.'],
      exemple: 'Voici le Léman. On peut se retrouver à Genève, près du pont.',
    },
    ecrit: {
      consigne: 'Écrivez une invitation courte pour une promenade au bord d’un lac.',
      actions: ['Écrivez le nom du lac et de la ville.', 'Indiquez le lieu ou l’heure du rendez-vous.'],
      exemple: 'Venez au bord du Léman, à Genève. Rendez-vous près du pont à 14 heures.',
    },
  },
  {
    id: 'langues', niveau: 'A1', titre: 'Les langues et l’adresse',
    objectif: 'Je peux lire une adresse et demander la langue d’un service.',
    situation: 'Tu lis la carte d’un service où on parle français.',
    explication: [
      'La Suisse a quatre langues nationales.',
      'Ce sont l’allemand, le français, l’italien et le romanche.',
      'On utilise plusieurs langues dans certaines villes.',
      'Une adresse indique une rue, un numéro et une localité.',
    ],
    lexique: [
      ['la langue', 'Les mots que tu parles ou que tu écris.'],
      ['l’adresse', 'Les indications pour trouver un lieu.'],
      ['le code postal', 'Les chiffres écrits avant le nom de la localité.'],
      ['l’accueil', 'Le lieu où un service reçoit les personnes.'],
    ],
    document: {
      titre: 'Carte fictive d’un point d’accueil',
      lignes: ['Point d’accueil des cours', 'Rue des Ateliers 8', '2502 Bienne', 'Accueil en français et en allemand.'],
      questions: [
        choix('Dans quelle ville est le point d’accueil ?', ['À Berne', 'À Bienne', 'À Neuchâtel'], 1),
        vraiFaux('Le service accueille en français.', true),
        reponse('Quel est le code postal ?', '2502.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour. Le point d’accueil est à Bienne, rue des Ateliers, au numéro huit. Vous pouvez parler français ou allemand. Nous ouvrons à neuf heures.',
      questions: [
        choix('Quel est le numéro dans la rue ?', ['6', '8', '9'], 1),
        vraiFaux('Le service ouvre à neuf heures.', true),
        reponse('Nommez une langue utilisée à l’accueil.', 'Le français ou l’allemand.'),
      ],
    },
    oral: {
      consigne: 'Vous cherchez le point d’accueil. Demandez des informations.',
      actions: ['Demandez l’adresse.', 'Demandez si vous pouvez parler français.'],
      exemple: 'Bonjour, quelle est votre adresse ? Est-ce que je peux parler français à l’accueil ?',
    },
    ecrit: {
      consigne: 'Recopiez l’adresse du point d’accueil pour votre partenaire.',
      actions: ['Gardez le numéro de rue et le code postal.', 'Ajoutez une phrase sur la langue utilisée à l’accueil.'],
      exemple: 'Rue des Ateliers 8, 2502 Bienne. À l’accueil, on parle français et allemand.',
    },
  },
]

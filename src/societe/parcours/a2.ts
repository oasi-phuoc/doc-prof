import type { SocieteUnite } from '../types'
import { choix, reponse, vraiFaux } from './questions'

export const unitesA2: SocieteUnite[] = [
  {
    id: 'histoire', niveau: 'A2', titre: 'Quelques repères d’histoire',
    objectif: 'Je peux lire une frise et dire ce qui a changé.',
    situation: 'Tu cherches la date de la création de l’État fédéral.',
    explication: [
      'En 1291, des communautés concluent un pacte.',
      'En 1848, la Suisse devient un État fédéral.',
      'En 1971, les femmes obtiennent le droit de vote fédéral.',
      'En 1979, le Jura devient un canton.',
    ],
    lexique: [
      ['le pacte', 'Un accord entre plusieurs groupes.'],
      ['la frise', 'Un dessin qui range les événements dans le temps.'],
      ['la Constitution', 'Le texte qui fixe les règles principales d’un État.'],
      ['le droit de vote', 'La possibilité de voter selon certaines règles.'],
    ],
    document: {
      titre: 'Quatre repères pour une visite',
      lignes: [
        '1291 · Des communautés concluent un pacte. Cette date devient un symbole.',
        '1848 · Une Constitution crée l’État fédéral moderne.',
        '1971 · Les femmes peuvent voter et être élues au niveau fédéral.',
        '1979 · Le Jura devient le 26e canton.',
      ],
      questions: [
        choix('Quel événement date de 1848 ?', ['Un pacte', 'La naissance de l’État fédéral moderne', 'La création du canton du Jura'], 1),
        vraiFaux('Le Jura devient canton après 1971.', true),
        reponse('Qu’est-ce qui change en 1971 au niveau fédéral ?', 'Les femmes obtiennent le droit de vote et d’éligibilité.'),
      ],
    },
    ecoute: {
      transcription: 'Dans la prochaine salle, vous verrez deux dates. La première est mille huit cent quarante-huit. C’est l’année où la Suisse devient un État fédéral. La deuxième est mille neuf cent soixante et onze. Cette année-là, les femmes obtiennent le droit de vote au niveau fédéral.',
      questions: [
        choix('Quelle date est citée en premier ?', ['1291', '1848', '1971'], 1),
        vraiFaux('Le message parle du droit de vote des femmes.', true),
        reponse('Que devient la Suisse en 1848 ?', 'Un État fédéral.'),
      ],
    },
    oral: {
      consigne: 'Votre partenaire ne connaît pas encore la frise. Choisissez une date et expliquez-la.',
      actions: ['Dites l’année et racontez le changement.', 'Demandez à votre partenaire de choisir un autre repère.'],
      exemple: 'En 1848, la Suisse devient un État fédéral. Et en 1979, quel changement voyez-vous sur la frise ?',
    },
    ecrit: {
      consigne: 'Écrivez deux ou trois phrases pour le panneau d’une exposition.',
      actions: ['Présentez deux repères dans l’ordre.', 'Indiquez ce qui change à chaque date.'],
      exemple: 'En 1848, la Suisse devient un État fédéral. En 1971, les femmes obtiennent le droit de vote au niveau fédéral.',
    },
  },
  {
    id: 'commune', niveau: 'A2', titre: 'À la commune',
    objectif: 'Je peux demander comment annoncer un changement d’adresse.',
    situation: 'Tu as déménagé. Tu cherches le service des habitants.',
    explication: [
      'La commune gère des services près de chez toi.',
      'Le service des habitants peut enregistrer ton adresse.',
      'Regarde les horaires et prépare les documents demandés.',
      'Vérifie la démarche sur le site de ta commune.',
    ],
    lexique: [
      ['le guichet', 'Le lieu où tu parles à une personne du service.'],
      ['la pièce d’identité', 'Un document officiel qui confirme ton identité.'],
      ['le justificatif', 'Un document qui permet de vérifier une information.'],
      ['le rendez-vous', 'Une rencontre prévue à un jour et une heure.'],
    ],
    document: {
      titre: 'Confirmation fictive de rendez-vous',
      lignes: ['Service des habitants · Commune des Tilleuls', 'Rendez-vous jeudi, 14 h, guichet 2.', 'Préparez une pièce d’identité et le justificatif demandé dans le message.'],
      questions: [
        choix('À quel service faut-il aller ?', ['Au service des habitants', 'À la régie', 'À la pharmacie'], 0),
        vraiFaux('Le rendez-vous a lieu jeudi matin.', false),
        reponse('Quel est le numéro du guichet ?', 'Le guichet 2.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour, ici le service des habitants. Votre rendez-vous de jeudi est confirmé à quatorze heures. Présentez-vous au guichet deux. Apportez votre carte d’identité. Si vous avez une question sur les autres documents, vous pouvez nous rappeler demain matin.',
      questions: [
        choix('Quel jour a lieu le rendez-vous ?', ['Mercredi', 'Jeudi', 'Vendredi'], 1),
        vraiFaux('Il faut se présenter au guichet deux.', true),
        reponse('Quel document est cité ?', 'La carte d’identité.'),
      ],
    },
    oral: {
      consigne: 'Vous venez de déménager. Appelez le service des habitants.',
      actions: ['Expliquez que vous avez changé d’adresse.', 'Demandez les documents à apporter et une heure de rendez-vous.'],
      exemple: 'Bonjour, j’ai déménagé et je voudrais annoncer ma nouvelle adresse. Quels documents dois-je apporter ? Avez-vous un rendez-vous jeudi ?',
    },
    ecrit: {
      consigne: 'Écrivez au service des habitants avant le rendez-vous.',
      actions: ['Confirmez le jour et l’heure.', 'Vérifiez quel justificatif apporter. Signez avec un nom fictif.'],
      exemple: 'Bonjour, je confirme mon rendez-vous de jeudi à 14 h. Pouvez-vous me préciser quel document apporter pour justifier mon adresse ? Merci. Lina Roy',
    },
  },
  {
    id: 'transports', niveau: 'A2', titre: 'Se déplacer',
    objectif: 'Je peux lire un horaire et annoncer un retard.',
    situation: 'Ton train arrive après le départ du premier bus.',
    explication: ['L’horaire indique le départ et l’arrivée.', 'Une correspondance permet de continuer le trajet.', 'Vérifie l’heure du prochain départ et le quai.'],
    lexique: [
      ['le départ', 'Le moment où le véhicule part.'],
      ['la correspondance', 'Le véhicule que tu prends pour continuer le trajet.'],
      ['le quai', 'Le lieu où tu attends le train ou le bus.'],
      ['le retard', 'Le temps ajouté à l’heure prévue.'],
    ],
    document: {
      titre: 'Horaire fictif · Samedi matin',
      lignes: ['Train · Arrivée à Bienne à 9 h 20.', 'Bus 4 · Départs de la gare à 9 h 18 et à 9 h 38.', 'Arrivée du bus au centre à 9 h 50 avec le départ de 9 h 38.'],
      questions: [
        choix('Quel bus peut-on prendre après le train ?', ['Celui de 9 h 38', 'Celui de 9 h 18', 'Celui de 9 h 20'], 0),
        vraiFaux('Le bus de 9 h 18 est déjà parti.', true),
        reponse('À quelle heure arrive-t-on au centre ?', 'À 9 h 50.'),
      ],
    },
    ecoute: {
      transcription: 'Votre train arrive à neuf heures vingt à Bienne. Le bus quatre de neuf heures dix-huit est déjà parti. Le prochain bus quitte la gare à neuf heures trente-huit, au quai B. Il arrive au centre à neuf heures cinquante.',
      questions: [
        choix('Quel bus faut-il prendre ?', ['Le 2', 'Le 3', 'Le 4'], 2),
        vraiFaux('Le prochain bus part à 9 h 38.', true),
        reponse('À quel quai faut-il aller ?', 'Au quai B.'),
      ],
    },
    oral: {
      consigne: 'Demandez la prochaine correspondance à un agent, puis confirmez ce que vous avez compris.',
      actions: ['Précisez votre destination.', 'Répétez l’heure et le quai.'],
      exemple: 'Pour aller au centre, je prends le bus de 9 h 38 au quai B, c’est bien ça ?',
    },
    ecrit: {
      consigne: 'Envoyez un message à la personne qui vous attend au centre.',
      actions: ['Expliquez pourquoi vous arrivez plus tard.', 'Donnez l’heure d’arrivée prévue.'],
      exemple: 'Bonjour, j’ai raté la première correspondance. Je prends le bus suivant et je serai au centre à 9 h 50.',
    },
  },
  {
    id: 'logement', niveau: 'A2', titre: 'Le logement et le voisinage',
    objectif: 'Je peux lire un avis et signaler un problème à la régie.',
    situation: 'Une affiche indique quand la buanderie sera fermée.',
    explication: ['La buanderie peut être utilisée par plusieurs habitants.', 'Un avis indique le lieu, la date et la raison.', 'Pour un problème, décris le lieu et ce que tu observes.'],
    lexique: [
      ['la régie', 'Le service qui gère un logement ou un immeuble.'],
      ['la buanderie', 'La pièce où on lave le linge.'],
      ['la fuite', 'De l’eau qui sort d’un endroit de façon anormale.'],
      ['l’entretien', 'Le travail qui garde un lieu en bon état.'],
    ],
    document: {
      titre: 'Avis fictif aux habitants',
      lignes: ['La buanderie est fermée mardi de 8 h à 11 h.', 'Une équipe intervient sur le tuyau près de la machine 2.', 'En cas de fuite après 11 h, contactez la régie.'],
      questions: [
        choix('Quelle pièce est fermée ?', ['L’entrée', 'La buanderie', 'Le local à vélos'], 1),
        vraiFaux('Le travail concerne un tuyau près de la machine 2.', true),
        reponse('Qui faut-il contacter si la fuite revient ?', 'La régie.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour. La buanderie rouvre mardi à onze heures. L’équipe doit réparer un tuyau. Si vous voyez de l’eau par terre après la réouverture, appelez la régie et indiquez le numéro de la machine.',
      questions: [
        choix('À quelle heure rouvre la buanderie ?', ['À 8 h', 'À 10 h', 'À 11 h'], 2),
        vraiFaux('Il faut appeler la régie si on voit une fuite.', true),
        reponse('Quelle information faut-il donner à la régie ?', 'Le numéro de la machine.'),
      ],
    },
    oral: {
      consigne: 'Appelez la régie. De l’eau coule encore près de la machine 2.',
      actions: ['Indiquez le lieu et le numéro de la machine.', 'Expliquez le problème et demandez quoi faire.'],
      exemple: 'Bonjour, il y a de l’eau par terre près de la machine 2, à la buanderie. Que dois-je faire ?',
    },
    ecrit: {
      consigne: 'Écrivez un message court à la régie.',
      actions: ['Précisez où et quand vous avez observé la fuite.', 'Demandez une intervention.'],
      exemple: 'Bonjour, mardi à midi, j’ai vu de l’eau près de la machine 2 de la buanderie. Pouvez-vous faire vérifier le tuyau ? Merci.',
    },
  },
  {
    id: 'formation', niveau: 'A2', titre: 'École et formation',
    objectif: 'Je peux lire une invitation et demander un renseignement.',
    situation: 'Tu reçois une invitation pour découvrir un cours.',
    explication: ['Une invitation donne un lieu et une heure.', 'Une séance d’information présente le cours.', 'Tu peux demander les horaires avant de t’inscrire.'],
    lexique: [
      ['la formation', 'Des cours qui aident à apprendre.'],
      ['la séance d’information', 'Une rencontre pour présenter un cours ou un projet.'],
      ['l’inscription', 'La démarche pour participer à un cours.'],
      ['le niveau', 'Une indication de ce que tu sais déjà faire.'],
    ],
    document: {
      titre: 'Invitation fictive · Découvrir un cours de français',
      lignes: ['Jeudi, 18 h 30, salle 3.', 'Présentation des horaires et entretien de niveau.', 'Confirmez votre présence avant mercredi soir.'],
      questions: [
        choix('Dans quelle salle a lieu la rencontre ?', ['Salle 2', 'Salle 3', 'Salle 4'], 1),
        vraiFaux('On peut poser des questions sur les horaires.', true),
        reponse('Avant quand faut-il confirmer ?', 'Avant mercredi soir.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour. La séance d’information est jeudi à dix-huit heures trente. Nous présenterons le cours dans la salle trois. Après la présentation, un enseignant vous posera quelques questions pour connaître votre niveau. Merci de confirmer votre présence avant mercredi soir.',
      questions: [
        choix('De quoi parle le message ?', ['D’une séance d’information', 'D’un changement d’adresse', 'D’un déplacement'], 0),
        vraiFaux('Il y a un entretien après la présentation.', true),
        reponse('Que faut-il faire avant mercredi soir ?', 'Confirmer sa présence.'),
      ],
    },
    oral: {
      consigne: 'Jouez un appel à l’accueil du cours de français.',
      actions: ['Confirmez votre présence ou demandez un autre rendez-vous.', 'Posez une question sur les horaires du cours.'],
      exemple: 'Bonjour, je viendrai jeudi à la séance. Y a-t-il un cours de français le soir ?',
    },
    ecrit: {
      consigne: 'Écrivez un message pour demander un autre rendez-vous.',
      actions: ['Donnez une raison de votre absence.', 'Proposez deux moments où vous êtes disponible.'],
      exemple: 'Bonjour, je travaille jeudi soir et je ne peux pas venir. Je suis disponible vendredi matin ou lundi après 16 h. Est-ce possible de prendre rendez-vous ?',
    },
  },
]

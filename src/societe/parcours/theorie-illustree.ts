import type { SocieteImage } from '../types'

type TheorieIllustree = {
  contexte: readonly SocieteImage[]
  exemple: readonly SocieteImage[]
  essai: string
  reponse: string
}

function visuel(file: string, alt: string, caption: string): SocieteImage {
  return { src: `/lib/images/societe/theorie/${file}.webp`, alt, caption }
}

function scene(file: string, alt: string, caption: string): SocieteImage {
  return { src: `/lib/images/tcf/po/a2/${file}.webp`, alt, caption }
}

export const theoriesIllustrees: Record<string, TheorieIllustree> = {
  voisins: {
    contexte: [
      scene('a2j-017', 'À l’office du tourisme, une employée montre un plan à des visiteurs.', 'Tu regardes une carte avant de partir.'),
    ],
    exemple: [
      visuel('franchir-frontiere', 'Le trajet part de Genève, en Suisse, puis traverse une frontière. Il arrive à Annemasse, en France.', 'La frontière sépare les pays. Le trajet passe d’un pays à l’autre.'),
    ],
    essai: 'Tu pars de Genève pour Annemasse. Dans quel pays vas-tu ?',
    reponse: 'Tu vas en France.',
  },
  cantons: {
    contexte: [],
    exemple: [
      visuel('lire-sigle-vd', 'VD est le sigle de Vaud. Lausanne est une ville dans ce canton.', 'Vaud est le canton. Lausanne est une ville. VD est le sigle du canton.'),
      visuel('canton-ville-carte', 'Sur une carte, un trait sépare deux cantons et un point indique une ville.', 'Observe les signes. Tu peux les retrouver sur une carte des cantons.'),
    ],
    essai: 'Tu lis VD. Quel est le nom du canton ?',
    reponse: 'Le canton de Vaud.',
  },
  paysages: {
    contexte: [],
    exemple: [
      visuel('sorties-jura-plateau-alpes', 'Au Sentier dans le Jura, on peut se promener. Berne est une ville du Plateau. À Zermatt dans les Alpes, on voit de hautes montagnes.', 'Compare trois idées de sortie. Cherche le lieu et sa région.'),
      visuel('relief-vallee-col', 'Le col est un passage en hauteur. La vallée est plus basse, entre des montagnes.', 'Monte jusqu’au col. Descends vers la vallée.'),
    ],
    essai: 'Tu pars à Zermatt. Dans quelle région vas-tu ?',
    reponse: 'Dans les Alpes.',
  },
  eaux: {
    contexte: [],
    exemple: [
      visuel('lac-ou-cours-eau', 'Sur la carte, le lac occupe une surface. Le cours d’eau forme une ligne avec une flèche.', 'Repère d’abord la forme de l’eau. La flèche indique dans quel sens elle coule.'),
      visuel('suivre-rhone', 'Le Rhône arrive du Valais, entre dans le Léman et sort du lac à Genève.', 'Suis les flèches du Rhône, du Valais jusqu’à Genève.'),
    ],
    essai: 'Le Rhône sort du Léman. Dans quelle ville ?',
    reponse: 'À Genève.',
  },
  langues: {
    contexte: [
      visuel('quatre-langues', 'Les quatre langues nationales sont le français, l’allemand, l’italien et le romanche.', 'Plusieurs langues sont utilisées en Suisse. Des services utilisent deux langues ou plus.'),
    ],
    exemple: [
      visuel('lire-adresse', 'Adresse fictive. Rue des Ateliers est le nom de la rue, 8 est le numéro, 2502 est le code postal, Bienne est la ville.', 'Dans une adresse, cherche la rue, le numéro, le code postal et la ville.'),
      visuel('choisir-langue-accueil', 'Un accueil fictif indique deux langues possibles, le français et l’allemand.', 'La langue du service et l’adresse sont deux informations différentes.'),
    ],
    essai: 'Tu lis « 2502 Bienne ». Quel est le code postal ?',
    reponse: '2502.',
  },
  histoire: {
    contexte: [
      visuel('frise-histoire', 'De gauche à droite, 1291 un pacte, 1848 l’État fédéral, 1971 le droit de vote fédéral des femmes, 1979 le canton du Jura.', 'Lis la frise de gauche à droite. Chaque date correspond à un changement.'),
    ],
    exemple: [
      visuel('pacte-etat-federal', 'En 1291, des communautés concluent un pacte. En 1848, une Constitution crée l’État fédéral moderne.', 'Sur la frise, les deux dates désignent des événements différents.'),
      visuel('droit-vote-1971', 'En 1971, les femmes obtiennent le droit d’élire et d’être élues au niveau fédéral.', 'Au niveau fédéral, le droit de vote change en 1971.'),
    ],
    essai: 'Le Jura devient canton avant ou après 1971 ?',
    reponse: 'Après 1971. Le Jura devient canton en 1979.',
  },
  commune: {
    contexte: [
      scene('formulaire-admin', 'Au guichet de la commune, une employée montre une ligne du formulaire à une personne.', 'Au guichet, tu peux demander où écrire et quels documents montrer.'),
    ],
    exemple: [
      visuel('rendez-vous-commune', 'Rendez-vous fictif au service des habitants jeudi à 14 h au guichet 2. Il faut apporter une pièce d’identité.', 'Entoure le jour et l’heure. Repère aussi le guichet et le document à apporter.'),
      visuel('demarche-commune', 'Pour annoncer un changement d’adresse, vérifier les consignes, préparer les documents demandés puis se rendre au guichet ou suivre la procédure en ligne.', 'Commence par vérifier les consignes de ta commune.'),
    ],
    essai: 'Où vas-tu jeudi à 14 h dans cet exemple ?',
    reponse: 'Au guichet 2 du service des habitants.',
  },
  transports: {
    contexte: [
      scene('a2r-014', 'À la gare, une personne tient un billet et un agent lui indique une direction.', 'À la gare, tu peux vérifier le quai avant la correspondance.'),
    ],
    exemple: [
      visuel('lire-horaire', 'Horaire fictif. Le train arrive à 9 h 20. Le bus 4 quitte la gare à 9 h 38, quai B, et arrive au centre à 9 h 50.', 'Lis dans l’ordre. D’abord l’arrivée du train. Ensuite le départ du bus.'),
      visuel('bus-suivant', 'Le bus de 9 h 18 part avant l’arrivée du train à 9 h 20. Le prochain bus est à 9 h 38.', 'La flèche montre le temps. Le bus de 9 h 18 est déjà parti.'),
    ],
    essai: 'Ton train arrive à 9 h 20. Quel bus peux-tu prendre ?',
    reponse: 'Le bus 4 de 9 h 38, au quai B.',
  },
  logement: {
    contexte: [
      scene('laverie', 'Deux personnes utilisent des machines à laver et plient du linge.', 'On lave le linge dans une buanderie. Des habitants peuvent partager les machines.'),
    ],
    exemple: [
      visuel('lire-avis-immeuble', 'Avis fictif. La buanderie est fermée mardi de 8 h à 11 h. La réparation concerne le tuyau près de la machine 2.', 'Cherche le lieu, l’heure de réouverture et la raison.'),
      visuel('signaler-fuite', 'Exemple de signalement à la régie. Le lieu est la buanderie, la machine porte le numéro 2, et de l’eau est visible au sol.', 'Pour obtenir de l’aide, dis où tu as vu l’eau et précise la machine.'),
    ],
    essai: 'Tu vois de l’eau près de la machine 2 après 11 h. Qui appelles-tu ?',
    reponse: 'Tu appelles la régie.',
  },
  formation: {
    contexte: [
      scene('a2r-019', 'Dans une école de langue, une personne se renseigne auprès d’un employé en consultant un document.', 'À l’accueil, tu peux demander les horaires et parler de ton niveau.'),
    ],
    exemple: [
      visuel('lire-invitation-cours', 'Invitation fictive à une séance jeudi à 18 h 30, salle 3. Il faut confirmer avant mercredi soir.', 'Le jour de la séance et le jour limite pour répondre sont différents.'),
      visuel('repondre-invitation-cours', 'Message fictif. Bonjour, je confirme ma présence jeudi à 18 h 30. Merci.', 'Dans ton message, répète le jour et l’heure que tu confirmes.'),
    ],
    essai: 'Jusqu’à quand peux-tu confirmer ta présence ?',
    reponse: 'Avant mercredi soir, comme indiqué dans l’invitation.',
  },
  'assurance-maladie': {
    contexte: [
      visuel('scene-caisse-maladie', 'Emplacement réservé à une illustration. Une personne demande une explication sur son décompte à la caisse.', 'Tu peux montrer le décompte et demander une explication sur une ligne.'),
      visuel('deux-documents-caisse', 'Dans l’exemple, le bulletin de prime indique 280 francs par mois. Le décompte de soins indique 115 francs à la charge de la personne.', 'La prime est le prix de ton assurance. Le décompte détaille les frais liés aux soins.'),
    ],
    exemple: [
      visuel('decompte-annote', 'Sur le décompte fictif A17, 100 francs de franchise et 15 francs de quote-part font un total à charge de 115 francs.', 'Suis les deux lignes jusqu’au total. La prime se trouve sur un autre document.'),
    ],
    essai: 'Les 15 CHF correspondent à quelle ligne du décompte ?',
    reponse: 'À la quote-part.',
  },
  'trois-piliers': {
    contexte: [
      visuel('schema-trois-piliers', 'Le premier pilier est public, par exemple AVS et AI. Le deuxième est professionnel, par exemple la caisse de pension. Le troisième est privé, par exemple un compte 3a.', 'Trois piliers peuvent aider à préparer la retraite. Le troisième est facultatif.'),
    ],
    exemple: [
      visuel('reconnaitre-documents-piliers', 'Un extrait AVS correspond au premier pilier, un certificat de caisse de pension au deuxième et une attestation 3a au troisième.', 'Sur chaque document, cherche le mot qui indique le pilier.'),
      visuel('contacts-piliers', 'Pour un extrait AVS, contacter une caisse de compensation AVS. Pour un certificat de prévoyance professionnelle, contacter sa caisse de pension.', 'Le service du personnel peut t’indiquer le nom de ta caisse de pension.'),
    ],
    essai: 'Tu cherches ton certificat de prévoyance professionnelle. À qui le demandes-tu ?',
    reponse: 'À ta caisse de pension.',
  },
  pouvoirs: {
    contexte: [
      visuel('trois-niveaux-suisse', 'La Confédération agit à l’échelle de la Suisse, un canton agit sur son territoire, une commune s’occupe de services locaux.', 'Les niveaux disent à quelle échelle on agit.'),
    ],
    exemple: [
      visuel('trois-pouvoirs-federaux', 'Le pouvoir législatif adopte les lois. Le pouvoir exécutif gouverne. Le pouvoir judiciaire juge, par exemple au Tribunal fédéral.', 'Les pouvoirs disent ce que font les autorités.'),
      visuel('trouver-le-bon-service', 'Pour un chantier de quartier, contacter le service communal. Pour les règles scolaires cantonales, contacter le service cantonal.', 'Lis d’abord le sujet. Cherche ensuite le service qui peut te répondre.'),
    ],
    essai: 'Qui peut renseigner sur les horaires du chantier de ta rue ?',
    reponse: 'Le service communal des travaux, dans cet exemple.',
  },
  participer: {
    contexte: [
      visuel('scene-consultation', 'Emplacement réservé à une illustration. Des habitants échangent lors d’une séance de quartier.', 'À une séance ouverte, tu peux écouter les propositions et poser des questions.'),
      visuel('election-ou-votation', 'Dans une élection, on choisit des personnes. Dans une votation, on répond à une question soumise au vote.', 'Regarde l’objet du choix. Une personne ou une question.'),
    ],
    exemple: [
      visuel('initiative-ou-referendum', 'Au niveau fédéral, une initiative populaire propose de modifier la Constitution. Un référendum facultatif peut soumettre une loi au vote.', 'Cherche le texte concerné. Cela aide à comprendre la démarche.'),
      visuel('avis-place-quartier', 'Consultation fictive. Une association souhaite des arbres pour avoir de l’ombre. Les commerces souhaitent garder un accès pour les livraisons.', 'Compare les besoins. Tu peux par exemple proposer des arbres et un accès le matin.'),
    ],
    essai: 'Tu veux proposer plus d’ombre. Quel aménagement peux-tu demander ?',
    reponse: 'Par exemple planter des arbres près des bancs.',
  },
  salaire: {
    contexte: [
      scene('a2r-022', 'Un employé rencontre un collègue dans les bureaux de son nouvel emploi.', 'Quand tu travailles, ton employeur te remet une fiche de salaire.'),
    ],
    exemple: [
      visuel('lire-fiche-salaire', 'Sur la fiche fictive de juin, le brut est de 4 000 francs, le total des déductions est de 350 francs, et le net est de 3 650 francs.', 'Repère les trois lignes. Le net est le montant après les déductions indiquées.'),
      visuel('du-brut-au-net', 'Le brut de 4 000 francs, moins 350 francs de déductions, donne un net de 3 650 francs. Il s’agit d’un exemple.', 'Tu peux relire la fiche dans cet ordre. Brut, déductions, net.'),
    ],
    essai: 'Sur la fiche de juin, quel montant reste après les déductions ?',
    reponse: '3 650 CHF. C’est le salaire net de cet exemple.',
  },
}

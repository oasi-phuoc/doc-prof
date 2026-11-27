import type { SocieteUnite } from '../types'
import { choix, reponse, vraiFaux } from './questions'

export const unitesB1: SocieteUnite[] = [
  {
    id: 'assurance-maladie', niveau: 'B1', titre: 'La caisse maladie',
    objectif: 'Je peux demander une explication sur mon décompte.',
    situation: 'Tu paies une prime. Tu reçois aussi un décompte de soins.',
    explication: [
      'La prime est le prix de ton assurance.',
      'La franchise est une somme à payer chaque année sur certains soins.',
      'Après la franchise, tu paies encore une part de certains frais.',
      'Cette part s’appelle la quote-part.',
      'Le canton peut aider certaines personnes à payer leurs primes.',
    ],
    lexique: [
      ['l’assurance de base', 'L’assurance obligatoire des soins, sous réserve des exceptions prévues.'],
      ['la complémentaire', 'Une assurance facultative pour certaines prestations supplémentaires.'],
      ['la prime', 'Le prix régulier à payer pour être assuré.'],
      ['la franchise', 'Le montant annuel que tu paies d’abord sur les frais concernés.'],
      ['la quote-part', 'La part des frais concernés que tu paies après la franchise.'],
      ['la réduction des primes', 'Une aide dont les conditions sont fixées par le canton.'],
    ],
    tableau: { entetes: ['Document', 'Exemple'], lignes: [['Bulletin de prime', 'La prime du mois'], ['Décompte de soins', 'La franchise et la quote-part']] },
    document: {
      titre: 'Décompte fictif · Référence A17',
      lignes: [
        'Prime du mois · 280 CHF, sur un bulletin séparé.',
        'Frais de soins pris en compte · 250 CHF.',
        'Part de la franchise imputée sur ces soins · 100 CHF.',
        'Quote-part imputée sur ces soins · 15 CHF.',
        'Montant à votre charge sur ce décompte · 115 CHF.',
      ],
      questions: [
        choix('Quelle somme concerne uniquement ce décompte de soins ?', ['280 CHF', '250 CHF', '115 CHF'], 2),
        vraiFaux('La prime du mois est comprise dans les 115 CHF.', false),
        reponse('Quelles lignes expliquent les 115 CHF ?', '100 CHF de franchise et 15 CHF de quote-part.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour Madame, je vous appelle au sujet du décompte A dix-sept. Le montant de cent quinze francs concerne les soins du mois dernier. Votre prime mensuelle figure sur un bulletin séparé. Si vous souhaitez que nous vérifiions le calcul de la quote-part, envoyez-nous la référence du décompte avec votre question. Pour une réduction des primes, consultez le service de votre canton.',
      questions: [
        choix('Quel est le sujet principal du message ?', ['L’ouverture d’un compte', 'Un décompte de soins', 'Une nouvelle prescription'], 1),
        vraiFaux('Le même bulletin indique la prime et le montant des soins.', false),
        reponse('Quelle information faut-il envoyer pour faire vérifier le calcul ?', 'La référence du décompte, accompagnée de la question.'),
      ],
    },
    oral: {
      consigne: 'Vous téléphonez à la caisse au sujet du décompte A17. Votre partenaire joue la personne à l’accueil.',
      actions: ['Identifiez le décompte et la ligne qui vous pose problème.', 'Demandez la différence entre la franchise et la quote-part.', 'Reformulez la prochaine étape avant de terminer l’appel.'],
      exemple: 'Bonjour, je vous appelle au sujet du décompte A17. Les 15 francs correspondent-ils à la quote-part ? Si je comprends bien, je dois joindre la référence à ma demande écrite.',
    },
    ecrit: {
      consigne: 'Rédigez un message au service des décomptes au sujet de la référence A17.',
      actions: ['Indiquez l’objet et la référence.', 'Citez un montant et posez deux questions précises.', 'Terminez par une formule de politesse.'],
      exemple: 'Objet · Décompte A17. Bonjour, j’ai reçu un décompte de 115 CHF. Pourriez-vous m’expliquer comment les 15 CHF de quote-part ont été calculés ? Où puis-je consulter le montant de franchise déjà utilisé cette année ? Merci pour votre aide. Avec mes salutations, Lina Roy.',
    },
  },
  {
    id: 'trois-piliers', niveau: 'B1', titre: 'Les trois piliers',
    objectif: 'Je peux expliquer les trois piliers en termes simples.',
    situation: 'Tu vois AVS et caisse de pension sur ta fiche de salaire.',
    explication: [
      'Le premier pilier comprend notamment l’AVS et l’AI.',
      'L’AVS verse notamment des rentes de vieillesse.',
      'L’AI aide les personnes selon les règles de l’assurance-invalidité.',
      'Le deuxième pilier correspond à la prévoyance professionnelle.',
      'Le troisième pilier est une prévoyance privée facultative.',
    ],
    lexique: [
      ['la prévoyance', 'Une protection organisée pour l’avenir, par exemple la retraite.'],
      ['l’AVS', 'L’assurance-vieillesse et survivants.'],
      ['l’AI', 'L’assurance-invalidité.'],
      ['la caisse de pension', 'Une institution qui gère une prévoyance professionnelle.'],
      ['le 3a et le 3b', 'Deux formes de prévoyance privée. Leurs conditions diffèrent.'],
      ['la cotisation', 'Une somme versée à une assurance ou à une institution.'],
    ],
    tableau: { entetes: ['Pilier', 'Exemple'], lignes: [['1 · Prévoyance publique', 'L’AVS et l’AI'], ['2 · Prévoyance professionnelle', 'La caisse de pension'], ['3 · Prévoyance privée', 'Un compte 3a']] },
    document: {
      titre: 'Trois documents fictifs à classer',
      lignes: [
        'Document A · Extrait du compte individuel AVS.',
        'Document B · Certificat de prévoyance de la caisse de pension de l’employeur.',
        'Document C · Attestation d’un versement volontaire sur un compte 3a.',
      ],
      questions: [
        choix('Quel document concerne le deuxième pilier ?', ['Le document A', 'Le document B', 'Le document C'], 1),
        vraiFaux('Le 3a relève de la prévoyance professionnelle.', false),
        reponse('Quel est le document du premier pilier ? Donnez un indice.', 'Le document A. Il mentionne l’AVS.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour, ici le service du personnel. Votre certificat de prévoyance professionnelle est disponible auprès de notre caisse de pension. Pour obtenir votre extrait de compte individuel AVS, adressez-vous à une caisse de compensation AVS. Le troisième pilier est une démarche privée et facultative. Vous pouvez nous rappeler si vous avez besoin des coordonnées de la caisse de pension.',
      questions: [
        choix('Qui peut fournir le certificat de prévoyance professionnelle ?', ['La caisse de pension', 'La commune', 'La caisse maladie'], 0),
        vraiFaux('L’extrait du compte individuel AVS se demande à une caisse de compensation AVS.', true),
        reponse('Quel renseignement le service du personnel propose-t-il ?', 'Les coordonnées de la caisse de pension.'),
      ],
    },
    oral: {
      consigne: 'Un nouveau collègue confond les lignes AVS et caisse de pension. Expliquez-lui la différence.',
      actions: ['Nommez le premier et le deuxième pilier avec un exemple.', 'Dites où demander l’un des deux documents.', 'Répondez à une question sur le troisième pilier.'],
      exemple: 'L’AVS fait partie du premier pilier. La caisse de pension concerne le deuxième, qui est lié au travail. Le troisième pilier est privé et facultatif.',
    },
    ecrit: {
      consigne: 'Demandez au service du personnel comment obtenir votre certificat de prévoyance.',
      actions: ['Nommez le document et expliquez pourquoi vous le demandez.', 'Demandez le nom de la caisse et la marche à suivre.'],
      exemple: 'Bonjour, je voudrais mieux comprendre la ligne « caisse de pension » de ma fiche de salaire. À quelle caisse suis-je affilié ? Pourriez-vous me dire comment obtenir mon certificat de prévoyance ? Merci pour votre aide.',
    },
  },
  {
    id: 'pouvoirs', niveau: 'B1', titre: 'Les niveaux et les pouvoirs',
    objectif: 'Je peux expliquer qui s’occupe de quoi en Suisse.',
    situation: 'Tu cherches le service qui peut répondre à ta question.',
    explication: [
      'Il y a trois niveaux politiques en Suisse.',
      'Ce sont la Confédération, les cantons et les communes.',
      'Le Parlement fédéral adopte les lois fédérales.',
      'Le Conseil fédéral dirige le gouvernement.',
      'Les tribunaux jugent et appliquent le droit.',
    ],
    lexique: [
      ['la Confédération', 'Le niveau fédéral, pour l’ensemble de la Suisse.'],
      ['le Parlement fédéral', 'Le Parlement suisse. Il comprend le Conseil national et le Conseil des États.'],
      ['le pouvoir législatif', 'La fonction qui consiste à élaborer et adopter les lois.'],
      ['le pouvoir exécutif', 'La fonction qui consiste à gouverner et mettre en œuvre les décisions.'],
      ['le pouvoir judiciaire', 'La fonction qui consiste à juger selon le droit.'],
    ],
    tableau: { entetes: ['Fonction', 'Exemple au niveau fédéral'], lignes: [['Législatif', 'Le Parlement fédéral'], ['Exécutif', 'Le Conseil fédéral'], ['Judiciaire', 'Le Tribunal fédéral']] },
    document: {
      titre: 'Qui peut vous répondre ?',
      lignes: [
        'Service communal · Informations sur un chantier du quartier.',
        'Office cantonal · Renseignements sur l’organisation de l’école dans le canton.',
        'Assemblée fédérale · Conseil national et Conseil des États.',
        'Tribunaux · Juger des litiges selon les règles applicables.',
      ],
      questions: [
        choix('Quel service indique les horaires du chantier de quartier ?', ['Le service communal', 'Le tribunal', 'L’Assemblée fédérale'], 0),
        vraiFaux('Le Conseil des États est l’une des deux chambres du Parlement fédéral.', true),
        reponse('Quelle fonction remplit un tribunal ?', 'Le pouvoir judiciaire. Il juge les litiges selon le droit.'),
      ],
    },
    ecoute: {
      transcription: 'Vous êtes au service d’information de la commune. Pour le chantier de la rue des Saules, adressez-vous au service communal des travaux. Pour connaître les règles scolaires qui s’appliquent à tout le canton, contactez le service cantonal de l’enseignement. Pour un litige déjà porté devant un tribunal, adressez-vous au greffe dont le nom figure sur votre courrier.',
      questions: [
        choix('À quel service faut-il demander des informations sur le chantier ?', ['Au service cantonal de l’enseignement', 'Au service communal des travaux', 'Au Parlement fédéral'], 1),
        vraiFaux('Le greffe cité concerne un litige déjà porté devant un tribunal.', true),
        reponse('Où trouver le nom du greffe ?', 'Sur le courrier.'),
      ],
    },
    oral: {
      consigne: 'Votre partenaire devrait contacter deux services différents. Expliquez à qui s’adresser et pour quelle raison.',
      actions: ['Proposez un service pour le chantier et un service pour les règles scolaires.', 'Expliquez la différence entre niveau communal et niveau cantonal.', 'Demandez à votre partenaire de reformuler.'],
      exemple: 'Le service des travaux de la commune connaît le chantier. Pour une règle qui vaut dans tout le canton, je contacterais le service cantonal de l’enseignement.',
    },
    ecrit: {
      consigne: 'Vous avez reçu un avis de chantier communal. Rédigez un message au bon service.',
      actions: ['Nommez la rue et expliquez votre difficulté.', 'Demandez les horaires et proposez une mesure pour l’accès des piétons.'],
      exemple: 'Bonjour, je vous écris au sujet du chantier de la rue des Saules. Pourriez-vous me confirmer les horaires ? Je propose d’indiquer un passage piéton temporaire pour que les habitants puissent rejoindre la gare à pied.',
    },
  },
  {
    id: 'participer', niveau: 'B1', titre: 'Voter et participer',
    objectif: 'Je peux expliquer une manière de participer et donner mon avis.',
    situation: 'Ta commune invite les habitants à parler d’un projet.',
    explication: [
      'Dans une élection, on choisit des personnes.',
      'Dans une votation, on répond à une question.',
      'Une initiative fédérale propose de modifier la Constitution.',
      'Un référendum peut soumettre une loi fédérale au vote.',
      'Au niveau fédéral, il faut notamment être suisse et majeur.',
      'Les règles locales du droit de vote peuvent varier.',
      'Une séance ouverte permet de parler d’un projet.',
    ],
    lexique: [
      ['l’élection', 'Le choix de personnes pour remplir une fonction.'],
      ['la votation', 'Un vote sur une question ou un texte.'],
      ['l’initiative populaire fédérale', 'Une proposition de modifier la Constitution fédérale.'],
      ['le référendum facultatif fédéral', 'Une procédure qui permet de soumettre certaines décisions fédérales au vote.'],
      ['la consultation', 'Une démarche qui permet de recueillir des avis.'],
    ],
    document: {
      titre: 'Consultation fictive · Réaménagement de la place des Saules',
      lignes: [
        'La commune invite les habitants à une séance ouverte mercredi à 19 h.',
        'L’association de quartier souhaite ajouter des bancs et des arbres pour créer de l’ombre.',
        'Plusieurs commerçants demandent de garder un accès pour les livraisons.',
        'Les avis écrits sont acceptés jusqu’à vendredi.',
      ],
      questions: [
        choix('Quel est le motif proposé pour planter des arbres ?', ['Créer de l’ombre', 'Augmenter la vitesse des voitures', 'Fermer les commerces'], 0),
        vraiFaux('Les commerçants veulent garder un accès pour les livraisons.', true),
        reponse('Comment participer sans aller à la séance ?', 'Envoyer un avis écrit jusqu’à vendredi.'),
      ],
    },
    ecoute: {
      transcription: 'La commune souhaite recueillir des avis sur le projet de la place des Saules. La réunion de mercredi est ouverte aux habitants. Vous pourrez écouter la présentation puis poser vos questions. Si vous ne pouvez pas venir, envoyez votre avis par écrit jusqu’à vendredi. Cette réunion sert à recueillir des propositions pour le projet.',
      questions: [
        choix('Quel est le but du message ?', ['Annoncer une élection', 'Inviter à donner son avis', 'Présenter les résultats d’une votation'], 1),
        vraiFaux('Les habitants peuvent poser des questions lors de la réunion.', true),
        reponse('Quelle est la limite pour envoyer un avis écrit ?', 'Vendredi.'),
      ],
    },
    oral: {
      consigne: 'Jouez une discussion à la séance du quartier. Un participant défend les arbres, l’autre souhaite préserver l’accès de livraison.',
      actions: ['Exposez une raison pour votre proposition.', 'Résumez un argument de votre partenaire.', 'Proposez un compromis.'],
      exemple: 'Les arbres donneraient de l’ombre. Je comprends que les commerces ont besoin d’un accès. On pourrait garder un accès le matin et réserver une autre partie de la place aux bancs.',
    },
    ecrit: {
      consigne: 'Rédigez un avis pour la commune au sujet de la place des Saules.',
      actions: ['Présentez votre choix et deux raisons.', 'Tenez compte de la demande de livraison.', 'Terminez par une proposition concrète.'],
      exemple: 'Je soutiens l’ajout de bancs et d’arbres. En été, les arbres apporteront de l’ombre et les bancs permettront de faire une pause. Pour respecter les besoins des commerces, je propose de garder un accès de livraison le matin.',
    },
  },
  {
    id: 'salaire', niveau: 'B1', titre: 'Travailler et lire sa fiche de salaire',
    objectif: 'Je peux lire une fiche de salaire et poser une question.',
    situation: 'Tu compares le salaire brut et le montant versé.',
    explication: [
      'Le salaire brut est le salaire avant certaines déductions.',
      'Chaque déduction correspond à une ligne de la fiche.',
      'Le salaire net est le montant après les déductions.',
      'Tu peux demander au service du personnel de vérifier une ligne.',
    ],
    lexique: [
      ['le brut', 'Le salaire avant les déductions.'],
      ['le net', 'Le salaire après les déductions indiquées.'],
      ['la déduction', 'Une somme retirée du montant de départ.'],
      ['le décompte', 'Un document qui montre comment un montant est calculé.'],
    ],
    document: {
      titre: 'Fiche fictive · Mois de juin · Montants d’exercice',
      lignes: ['Salaire brut · 4 000 CHF.', 'Cotisations sociales et prévoyance · −350 CHF au total.', 'Salaire net · 3 650 CHF.', 'Contact pour une question · Service du personnel.'],
      questions: [
        choix('Quel est le salaire net de cet exemple ?', ['4 000 CHF', '350 CHF', '3 650 CHF'], 2),
        vraiFaux('Le salaire brut est le montant après les déductions.', false),
        reponse('Que représentent les 350 CHF ?', 'Le total des cotisations sociales et de prévoyance dans cet exemple.'),
      ],
    },
    ecoute: {
      transcription: 'Bonjour, votre fiche de salaire de juin est disponible. Vous trouverez le salaire brut dans la première partie, puis les déductions. Le montant net se trouve en bas. Si vous avez une question sur une déduction, écrivez au service du personnel en indiquant le mois et le nom de la ligne à vérifier.',
      questions: [
        choix('De quel mois est la fiche ?', ['De mai', 'De juin', 'De juillet'], 1),
        vraiFaux('Le montant net figure en bas de la fiche.', true),
        reponse('Quelles deux informations faut-il envoyer ?', 'Le mois et le nom de la ligne à vérifier.'),
      ],
    },
    oral: {
      consigne: 'Appelez le service du personnel au sujet d’une déduction sur votre fiche de salaire.',
      actions: ['Identifiez la fiche et la ligne.', 'Demandez à quoi correspond la déduction.', 'Vérifiez comment obtenir une explication écrite.'],
      exemple: 'Bonjour, sur ma fiche de juin, je vois une ligne pour la prévoyance. Pourriez-vous me dire à quoi elle correspond ? Est-ce possible de recevoir une explication par écrit ?',
    },
    ecrit: {
      consigne: 'Écrivez au service du personnel pour faire vérifier la fiche de juin.',
      actions: ['Indiquez le mois et la ligne qui pose question.', 'Citez le montant et formulez une demande claire.'],
      exemple: 'Bonjour, ma fiche de juin indique 350 CHF de cotisations et de prévoyance au total. Pourriez-vous me transmettre le détail des déductions et m’indiquer lesquelles concernent la prévoyance ? Merci pour votre aide.',
    },
  },
]

import { blank, choice, picture, word } from './lecon-supports'
import type { SchoolLesson } from './types'

const devoirs = [
  picture('devoirs/noter-un-devoir', 'Je note le travail et la date.'),
  picture('devoirs/demander-une-explication', 'Je montre la ligne que je ne comprends pas.'),
  picture('devoirs/reviser-a-deux', 'Nous relisons nos notes ensemble.'),
] as const
const inscription = [
  picture('inscription/preparer-son-dossier', 'Je rassemble les documents de mon dossier.'),
  picture('inscription/deposer-le-dossier', 'Je dépose mon dossier au guichet.'),
  picture('inscription/recevoir-sa-carte', 'Je reçois ma carte d’étudiante.'),
] as const
const papeterie = [
  picture('papeterie/chercher-un-cahier', 'Je regarde le format des cahiers.'),
  picture('papeterie/demander-au-vendeur', 'Je demande le prix au vendeur.'),
  picture('papeterie/verifier-le-ticket', 'Je compare ma liste et le ticket.'),
] as const
const foyer = [
  picture('foyer/ranger-une-piece', 'Je range les objets dans le salon.'),
  picture('foyer/faire-la-vaisselle', 'Je lave les assiettes après le repas.'),
  picture('foyer/repartir-les-taches', 'Nous choisissons qui fait chaque tâche.'),
] as const
const immeuble = [
  picture('immeuble/lire-lavis', 'Je lis un avis dans le hall.'),
  picture('immeuble/garder-le-passage-libre', 'Je déplace un carton pour laisser le passage libre.'),
  picture('immeuble/ranger-le-velo', 'Je range mon vélo dans le local.'),
  picture('immeuble/parler-avec-un-voisin', 'Je parle du problème avec un voisin.'),
] as const
const clubs = [
  picture('clubs/atelier-dessin', 'Des élèves dessinent ensemble à l’atelier.'),
  picture('clubs/atelier-theatre', 'Une troupe répète une scène.'),
  picture('clubs/demander-une-seance-dessai', 'Je demande quand je peux essayer un cours.'),
] as const
const sport = [
  picture('sport/preparer-la-tenue', 'Je prépare ma tenue et ma gourde.'),
  picture('sport/echauffement', 'Nous bougeons doucement avant l’entraînement.'),
  picture('sport/attendre-son-tour', 'J’attends que la personne termine son tour.'),
  picture('sport/prevenir-son-equipe', 'Je préviens l’équipe de mon absence.'),
] as const
const weekend = [
  picture('week-end/faire-les-courses', 'Samedi matin, je fais les courses.'),
  picture('week-end/jouer-en-salle', 'Samedi après-midi, je joue en salle.'),
  picture('week-end/se-promener-au-parc', 'Dimanche, je me promène avec ma sœur.'),
  picture('week-end/se-reposer-a-la-maison', 'Je prends un moment pour lire à la maison.'),
] as const
const vacances = [
  picture('vacances/preparer-le-sac', 'Je prépare les affaires pour la sortie.'),
  picture('vacances/sortie-pres-du-lac', 'Nous marchons au bord du lac.'),
  picture('vacances/atelier-en-cas-de-pluie', 'Quand il pleut, nous faisons un atelier.'),
  picture('vacances/attendre-au-rendez-vous', 'J’attends le groupe au point de rendez-vous.'),
] as const

export const SCHOOL_A2_LESSONS: readonly SchoolLesson[] = [
  {
    id: 'devoirs', level: 'A2', title: 'Les devoirs et les révisions',
    objective: 'Je lis mon agenda. Je demande de l’aide pour un devoir.',
    situation: 'Amel ouvre son agenda. Elle cherche la date de son devoir de maths.',
    pictures: devoirs,
    steps: [
      'Je note la matière, la page et la date.',
      'Je vérifie où écrire ou déposer mon travail.',
      'Réviser, c’est revoir le cours avant une évaluation.',
      'Si je bloque, je montre le passage difficile.',
    ],
    example: {
      kind: 'table', headers: ['Matière', 'Travail', 'Pour quand ?'],
      rows: [['Maths', 'Ex. 4, p. 18', 'Mercredi'], ['Français', 'Lire les pages 6 à 8', 'Jeudi']],
    },
    practice: { prompt: 'Que dois-tu faire en maths pour mercredi ?', answer: 'L’exercice 4, page 18.', explanation: 'La ligne de maths donne le numéro et la page.' },
    words: [
      { label: 'un agenda', clue: 'Un carnet pour noter le travail et les rendez-vous.', image: '/lib/images/vocabulaire/ecole-bureau/agenda.webp' },
      word('un devoir', 'Un travail à faire pour le cours.', devoirs[0], true),
      word('une consigne', 'Une phrase qui dit ce qu’il faut faire.'),
      word('réviser', 'Revoir le cours pour mieux le retenir.', devoirs[2], true),
      word('la date limite', 'Le dernier jour pour rendre un travail.'),
      word('une explication', 'Une réponse qui aide à comprendre.', devoirs[1], true),
    ],
    completion: [
      blank('Je note les devoirs dans mon ___.', 'agenda', 'ticket', 'diplôme', 'L’agenda sert à garder les dates et les tâches.'),
      blank('La date limite, c’est le ___ jour pour rendre le travail.', 'dernier', 'second', 'premier', 'Après la date limite, le travail est en retard.'),
      blank('Je relis le cours avant le contrôle. Je ___.', 'révise', 'rends', 'imprime', 'Réviser aide à retrouver ce que j’ai appris.'),
    ],
    read: {
      title: 'Deux devoirs dans l’agenda', picture: devoirs[0],
      lines: ['Maths · Pour mercredi : exercice 4, page 18. Écris la réponse dans ton cahier.', 'Français · Pour jeudi : lis les pages 6 à 8. Note trois mots difficiles sur une feuille.', 'Mardi à 16 h, tu peux demander de l’aide à la bibliothèque.'],
      questions: [
        choice('Quel travail rendre en premier ?', 'L’exercice de maths', 'La liste de mots', 'La lecture de français'),
        choice('Où écrire la réponse de maths ?', 'Dans le cahier', 'Sur une feuille', 'Sur le livre'),
        choice('Quand demander de l’aide ?', 'Mardi à 16 h', 'Mercredi à 16 h', 'Jeudi à 16 h'),
      ],
    },
    speak: { prompt: 'Tu bloques sur l’exercice 4. Explique ce que tu comprends déjà. Demande une explication et vérifie la date du devoir.', model: 'J’ai trouvé la page 18. Je ne comprends pas la première consigne. Vous pouvez me montrer un exemple ? Le devoir est bien pour mercredi ?', picture: devoirs[1] },
    write: { prompt: 'Écris à un camarade pour réviser ensemble. Donne la matière, le lieu et l’heure. Dis quelle partie te pose problème.', model: 'Salut Noé, tu veux réviser les maths avec moi mardi à 16 h à la bibliothèque ? J’ai du mal avec l’exercice 4, page 18. On peut commencer par celui-là. À bientôt !', picture: devoirs[2] },
  },
  {
    id: 'inscription', level: 'A2', title: 'S’inscrire à l’école ou à l’université',
    objective: 'Je vérifie les documents et la date. Je demande la suite.',
    situation: 'Lou doit s’inscrire à un cours. Il relit le message du secrétariat.',
    pictures: inscription,
    steps: [
      'Le formulaire demande des informations à écrire.',
      'Une pièce justificative prouve une information.',
      'Je vérifie la liste des pièces et la date limite.',
      'Après l’envoi, je cherche le message de confirmation.',
    ],
    example: 'J’ai mon formulaire et ma pièce d’identité. Il me manque une photo. Je demande quand je peux l’apporter.',
    practice: { prompt: 'Ton dossier est envoyé. Quel message attends-tu ?', answer: 'Le message de confirmation.', explanation: 'Il t’indique si le secrétariat a accepté ton dossier ou s’il manque une pièce.' },
    words: [
      word('un formulaire', 'Les cases à remplir pour faire une demande.', inscription[0], true),
      word('un justificatif', 'Un document qui prouve une information.'),
      word('un dossier', 'Le formulaire et toutes les pièces demandées.'),
      word('un guichet', 'L’endroit où une personne reçoit les demandes.', inscription[1], true),
      word('une confirmation', 'Un message qui précise que la demande est reçue ou acceptée.'),
      word('une carte d’étudiant', 'Une carte qui montre que tu étudies dans un établissement.', inscription[2], true),
    ],
    completion: [
      blank('Pour faire une demande, je remplis le ___.', 'formulaire', 'couloir', 'vestiaire', 'Le formulaire sert à donner les informations demandées.'),
      blank('La copie de ma pièce d’identité est un ___.', 'justificatif', 'horaire', 'cours', 'Elle prouve mon identité.'),
      blank('Le secrétariat m’écrit que le dossier est accepté. Ce message est une ___.', 'confirmation', 'inscription', 'convocation', 'La confirmation donne le résultat de la démarche.'),
    ],
    read: {
      title: 'École des Cèdres · Inscription au cours du soir', picture: inscription[0],
      lines: ['Écris ton prénom, ton nom et ton adresse électronique sur le formulaire.', 'Ajoute une copie de ta pièce d’identité et une photo.', 'Dépose le dossier au secrétariat avant le 12 septembre, à 16 h.', 'Nous t’envoyons un message quand ton dossier est accepté.'],
      questions: [
        choice('Quel élément va avec la copie de la pièce d’identité ?', 'Une photo', 'Un relevé de notes', 'Un chèque'),
        choice('Pour respecter le délai, quand peut-on déposer le dossier ?', 'Le 12 septembre à 14 h', 'Le 12 septembre à 18 h', 'Le 13 septembre à 10 h'),
        choice('À quel moment le secrétariat envoie-t-il un message ?', 'Quand le dossier est accepté', 'Avant le dépôt du dossier', 'Le premier jour de cours'),
      ],
    },
    speak: { prompt: 'Tu es au guichet. Demande les pièces à apporter et la date limite. Répète la prochaine étape pour vérifier.', model: 'Bonjour, je voudrais m’inscrire au cours du soir. Quels documents faut-il apporter ? Jusqu’à quelle date ? D’accord, je dépose le formulaire, la copie et la photo au secrétariat avant le 12 septembre à 16 h.', picture: inscription[1] },
    write: { prompt: 'Écris au secrétariat avec un nom fictif. Indique le cours souhaité et la pièce manquante. Demande si tu peux la déposer un autre jour.', model: 'Bonjour, je m’appelle Lou Simon. Je souhaite m’inscrire au cours du soir. Mon formulaire et ma copie sont prêts. Il me manque une photo. Puis-je l’apporter demain matin ? Merci et bonne journée.', picture: inscription[2] },
  },
  {
    id: 'papeterie', level: 'A2', title: 'À la papeterie',
    objective: 'Je compare les formats et les prix. Je vérifie mon ticket.',
    situation: 'Mina a besoin de deux grands cahiers. Elle regarde les étiquettes.',
    pictures: papeterie,
    steps: [
      'Sur ma liste, je regarde le format et la quantité.',
      'Le prix à l’unité est le prix d’un article.',
      'Pour trouver le total, j’additionne les prix des articles.',
      'Après l’achat, je compare les quantités sur le ticket.',
    ],
    example: {
      kind: 'table', headers: ['Article', 'Quantité', 'Prix à l’unité', 'Total'],
      rows: [['Cahier A4', '2', '3,50 CHF', '7 CHF'], ['Colle', '1', '2 CHF', '2 CHF'], ['Total', '', '', '9 CHF']],
    },
    practice: { prompt: 'Le ticket affiche un seul cahier. Que demandes-tu ?', answer: 'Pouvez-vous vérifier la quantité ? J’ai pris deux cahiers A4.', explanation: 'Tu peux montrer les articles et la ligne du ticket.' },
    words: [
      { label: 'un cahier', clue: 'Un objet avec des pages pour écrire.', image: '/lib/images/vocabulaire/ecole-bureau/cahier.webp' },
      word('le format', 'La taille d’un article. A4 est plus grand que A5.'),
      word('le prix à l’unité', 'Le montant pour un seul article.'),
      word('la quantité', 'Combien d’articles tu prends.'),
      { label: 'un ticket de caisse', clue: 'Le reçu avec les articles que tu as payés.', image: '/lib/images/vocabulaire/argent-administration/ticket-de-caisse.webp' },
      word('le total', 'La somme à payer pour tous les articles.'),
    ],
    completion: [
      blank('Un cahier coûte 3,50 CHF. C’est son prix à l’___.', 'unité', 'heure', 'école', 'Le prix à l’unité concerne un seul cahier.'),
      blank('Je prends deux cahiers. Deux indique la ___.', 'quantité', 'couleur', 'taille', 'La quantité indique combien d’articles sont achetés.'),
      blank('Après avoir payé, je vérifie mon ___ de caisse.', 'ticket', 'agenda', 'catalogue', 'Le ticket indique ce qui a été payé.'),
    ],
    read: {
      title: 'La liste de Mina et son ticket', picture: papeterie[2],
      lines: ['Liste : 2 cahiers A4 et 1 tube de colle.', 'Étiquettes : cahier A4, 3,50 CHF. Cahier A5, 2,50 CHF. Colle, 2 CHF.', 'Ticket : 1 cahier A4 à 3,50 CHF. 1 tube de colle à 2 CHF. Total payé : 5,50 CHF.'],
      questions: [
        choice('Quel article manque sur le ticket ?', 'Un cahier A4', 'Un cahier A5', 'Un tube de colle'),
        choice('Quel est le prix d’un cahier A4 ?', '3,50 CHF', '2 CHF', '2,50 CHF'),
        choice('Combien la liste complète doit-elle coûter ?', '9 CHF', '5,50 CHF', '7 CHF'),
      ],
    },
    speak: { prompt: 'Demande deux cahiers A4 et un tube de colle. Si le cahier A4 manque, demande le prix d’une autre taille. Vérifie le total avec le vendeur.', model: 'Bonjour, avez-vous deux cahiers A4 et un tube de colle ? Vous n’avez plus de cahiers A4 ? Je peux prendre des A5. Combien coûtent les deux cahiers et la colle ?', picture: papeterie[1] },
    write: { prompt: 'Écris à la papeterie. Demande deux articles, précise le format et la quantité, puis propose un moment pour les retirer.', model: 'Bonjour, avez-vous deux cahiers A4 à petits carreaux et un tube de colle ? Je voudrais venir demain entre 16 h et 17 h. Pouvez-vous les mettre de côté et m’indiquer le total ? Merci.' },
  },
  {
    id: 'foyer', level: 'A2', title: 'Les tâches domestiques',
    objective: 'Je partage le travail à la maison. Je propose un échange.',
    situation: 'Imane ne peut pas faire la cuisine mardi. Elle regarde le tableau avec Sam.',
    pictures: foyer,
    steps: [
      'Une tâche domestique est un travail à faire à la maison.',
      'Je note le nom, le travail et le moment.',
      'Quand je ne peux pas, je préviens les autres.',
      'Je propose un échange et nous confirmons les tâches.',
    ],
    example: {
      kind: 'table', headers: ['Personne', 'Tâche', 'Moment'],
      rows: [['Imane', 'Préparer le repas', 'Mardi'], ['Alex', 'Sortir la poubelle', 'Mardi à 19 h'], ['Sam', 'Laver le linge', 'Mercredi']],
    },
    practice: { prompt: 'Imane est absente mardi. Propose un échange à Sam.', answer: 'Tu peux préparer le repas mardi ? Je lave le linge mercredi.', explanation: 'Cette proposition donne une tâche et un moment à chacun.' },
    words: [
      word('ranger', 'Remettre des objets à leur place.', foyer[0], true),
      word('faire la vaisselle', 'Laver les assiettes, les verres et les couverts.', foyer[1], true),
      word('le linge', 'Les vêtements et les tissus à laver.'),
      { label: 'un aspirateur', clue: 'Un appareil qui aspire la poussière.', image: '/lib/images/vocabulaire/electromenager/aspirateur.webp' },
      { label: 'une poubelle', clue: 'Le récipient pour les déchets.', image: '/lib/images/vocabulaire/objets/poubelle.webp' },
      word('un échange', 'Chacun prend la tâche de l’autre.', foyer[2], true),
    ],
    completion: [
      blank('Après le repas, je lave les assiettes. Je fais la ___.', 'vaisselle', 'lessive', 'cuisine', 'Faire la vaisselle, c’est laver ce qui a servi au repas.'),
      blank('Les vêtements sales vont dans le panier à ___.', 'linge', 'papier', 'fruits', 'Le linge se lave avant d’être rangé.'),
      blank('Tu fais ma tâche, je fais la tienne. C’est un ___.', 'échange', 'horaire', 'appel', 'Dans un échange, chacun prend la tâche de l’autre.'),
    ],
    read: {
      title: 'Le tableau des tâches et le message d’Imane', picture: foyer[2],
      lines: ['Mardi : Imane prépare le repas. Alex sort la poubelle à 19 h.', 'Mercredi : Sam lave le linge.', 'Message d’Imane : « Je serai absente mardi. Sam, tu peux préparer le repas ? Je laverai le linge mercredi. »'],
      questions: [
        choice('Qui doit sortir la poubelle ?', 'Alex', 'Imane', 'Sam'),
        choice('Que demande Imane à Sam ?', 'De préparer le repas mardi', 'De sortir la poubelle mardi', 'De laver le linge mardi'),
        choice('Si Sam accepte, que fera Imane mercredi ?', 'Elle lavera le linge', 'Elle fera le repas', 'Elle prendra son tour pour la poubelle'),
      ],
    },
    speak: { prompt: 'Tu ne peux pas faire la vaisselle ce soir. Propose un échange à la personne qui doit ranger demain. Mettez-vous d’accord.', model: 'Tu peux faire la vaisselle ce soir ? Je peux ranger le salon demain après les cours. D’accord ? Alors je fais le salon et tu fais la vaisselle.', picture: foyer[1] },
    write: { prompt: 'Laisse un message à la maison. Dis ce que tu as déjà fait, ce qui reste et quand tu proposes de le faire.', model: 'Salut, j’ai lavé les assiettes et rangé la table. Le linge est encore dans le panier. Je le laverai demain après les cours. Si tu dois utiliser la machine, écris-moi.', picture: foyer[2] },
  },
  {
    id: 'immeuble', level: 'A2', title: 'Le règlement de l’immeuble',
    objective: 'Je lis un avis. Je propose une solution à un voisin.',
    situation: 'Un vélo bloque le passage dans le hall. Deux voisins cherchent où le ranger.',
    pictures: immeuble,
    steps: [
      'Les espaces communs servent à plusieurs personnes.',
      'Je peux lire le règlement dans le hall.',
      'Je laisse libre le passage dans les couloirs.',
      'Je décris le lieu et je propose une solution calme.',
    ],
    example: '« Un vélo bloque le passage devant l’escalier. Est-ce qu’on peut le ranger dans le local à vélos ? »',
    practice: { prompt: 'Un carton bloque l’escalier. Que peux-tu dire ?', answer: 'Le carton bloque l’escalier. Peut-on le déplacer ?', explanation: 'La phrase dit ce qui gêne et propose une action.' },
    words: [
      word('le hall', 'L’espace à l’entrée d’un bâtiment.', immeuble[0], true),
      word('le passage', 'L’espace qui permet de circuler.', immeuble[1], true),
      word('un local à vélos', 'Une pièce où les vélos peuvent être rangés.', immeuble[2], true),
      word('un espace commun', 'Un endroit utilisé par plusieurs habitants.'),
      word('le calme', 'Un moment ou un lieu avec peu de bruit.'),
      word('la régie', 'Le service qui s’occupe de la gestion de l’immeuble.'),
    ],
    completion: [
      blank('À l’entrée de l’immeuble, je passe par le ___.', 'hall', 'grenier', 'balcon', 'Le hall est juste après l’entrée.'),
      blank('Je range mon vélo dans le ___ à vélos.', 'local', 'couloir', 'jardin', 'Le local est une pièce prévue pour ranger les vélos.'),
      blank('Pour laisser le passage libre, je ___ le carton.', 'déplace', 'ajoute', 'empile', 'Je retire l’objet du passage pour dégager l’accès.'),
    ],
    read: {
      title: 'Avis de cet immeuble', picture: immeuble[0],
      lines: ['Les vélos vont dans le local au sous-sol. Demandez la clé à la régie.', 'Dans le hall et les escaliers, laissez le passage libre.', 'Mettez les bouteilles en verre dans le bac de la cour.', 'Dès 22 h, gardez le calme pour les autres habitants.'],
      questions: [
        choice('Où ranger un vélo et où demander la clé ?', 'Au sous-sol. À la régie.', 'Dans le hall. Au concierge.', 'Dans la cour. À la régie.'),
        choice('Où mettre une bouteille en verre ?', 'Dans le bac de la cour', 'Dans le local à vélos', 'Sur le palier'),
        choice('À partir de quelle heure l’avis demande-t-il le calme ?', '22 h', '20 h', '23 h'),
      ],
    },
    speak: { prompt: 'Un vélo bloque l’entrée. Parle calmement au voisin. Montre le problème, propose le local et indique où demander une clé.', model: 'Bonjour, le vélo bloque l’entrée. Est-ce qu’on peut le déplacer dans le local au sous-sol ? Vous pouvez demander la clé à la régie. Merci !', picture: immeuble[3] },
    write: { prompt: 'Écris à la régie. Décris un passage encombré avec le lieu. Demande comment résoudre le problème ou obtenir la clé du local.', model: 'Bonjour, plusieurs vélos bloquent le passage dans le hall. Le local à vélos est fermé. Pouvez-vous m’indiquer où récupérer la clé ? Je pourrai proposer aux voisins de ranger les vélos au sous-sol. Merci.', picture: immeuble[3] },
  },
  {
    id: 'clubs', level: 'A2', title: 'Les activités après l’école',
    objective: 'Je compare des activités. Je demande une séance d’essai.',
    situation: 'Sofia est libre le mercredi. Elle cherche une activité pour débuter.',
    pictures: clubs,
    steps: [
      'Je compare l’activité, le jour, le lieu et le prix.',
      'Le niveau dit à qui s’adresse l’activité.',
      'Une séance d’essai sert à découvrir l’activité.',
      'Je demande si je dois réserver et apporter du matériel.',
    ],
    example: {
      kind: 'table', headers: ['Atelier', 'Jour et heure', 'Niveau', 'Inscription'],
      rows: [['Dessin', 'Mercredi à 16 h', 'Débutant', 'Essai gratuit'], ['Théâtre', 'Jeudi à 17 h', 'Tous niveaux', 'Sur inscription']],
    },
    practice: { prompt: 'Tu débutes et tu es libre seulement mercredi. Quelle offre choisis-tu ?', answer: 'L’atelier de dessin.', explanation: 'Le dessin accepte les débutants et a lieu le mercredi.' },
    words: [
      word('un atelier', 'Un moment où un groupe pratique une activité.', clubs[0], true),
      word('un débutant', 'Une personne qui commence une activité.'),
      word('un niveau', 'Ce qu’une personne sait déjà faire.'),
      word('une séance d’essai', 'Un cours pour découvrir une activité.', clubs[2], true),
      word('une inscription', 'La démarche qui réserve ta place.'),
      word('gratuit', 'Qui ne coûte rien.'),
    ],
    completion: [
      blank('Je pratique le dessin dans un ___.', 'atelier', 'horaire', 'ticket', 'L’atelier est le moment où le groupe dessine.'),
      blank('Pour découvrir le cours, je demande une séance d’___.', 'essai', 'absence', 'examen', 'Un essai permet de découvrir le cours avant de s’inscrire.'),
      blank('Je n’ai jamais joué de guitare. Je suis ___.', 'débutant', 'confirmé', 'entraîné', 'Une personne qui commence est débutante.'),
    ],
    read: {
      title: 'Deux ateliers après les cours', picture: clubs[0],
      lines: ['Dessin · Mercredi à 16 h · Salle 3 · Débutants · Premier essai gratuit.', 'Théâtre · Jeudi à 17 h · Salle 4 · Tous niveaux · 8 CHF la séance.', 'Pour les deux ateliers, inscris-toi avant mardi à midi.'],
      questions: [
        choice('Quelle activité convient à une personne libre seulement mercredi ?', 'Le dessin', 'Le théâtre', 'Les deux ateliers'),
        choice('Quelle offre permet de venir essayer sans payer ?', 'Le dessin', 'Le théâtre', 'Aucune des deux'),
        choice('Une personne veut faire du théâtre. Quelle information doit-elle vérifier ?', 'L’inscription avant mardi à midi', 'Le prix de 8 CHF à payer mercredi', 'Le numéro de la salle 3'),
      ],
    },
    speak: { prompt: 'Appelle un club de musique. Explique que tu débutes. Demande le jour, le prix de l’essai et le matériel à prendre.', model: 'Bonjour, je débute en guitare. Quand peut-on essayer le cours ? Est-ce que la première séance est gratuite ? Est-ce que vous prêtez un instrument ? D’accord, je viens jeudi à 17 h.', picture: clubs[2] },
    write: { prompt: 'Écris au club pour demander un essai. Indique l’activité et le jour qui t’arrange. Pose une question sur le matériel ou le prix.', model: 'Bonjour, j’aimerais essayer l’atelier de théâtre. Je débute et je suis disponible le jeudi. Y a-t-il encore une place cette semaine ? Pouvez-vous me dire le prix de la séance et ce qu’il faut apporter ?', picture: clubs[1] },
  },
  {
    id: 'sport', level: 'A2', title: 'Faire du sport',
    objective: 'Je prépare une séance de sport. Je préviens si je suis absent.',
    situation: 'Noam lit le message de son équipe. Il vérifie la tenue et l’heure.',
    pictures: sport,
    steps: [
      'Je repère le lieu et l’heure du rendez-vous.',
      'Le début de la séance peut être plus tard.',
      'Je prépare la tenue, les chaussures et de l’eau.',
      'Je m’échauffe doucement et j’attends mon tour.',
      'Si je manque une séance, je préviens l’équipe.',
    ],
    example: 'Rendez-vous à 17 h 15 devant la salle. La séance commence à 17 h 30. J’ai 15 minutes pour me changer.',
    practice: { prompt: 'La séance commence à 17 h 30. À quelle heure arrives-tu au rendez-vous ?', answer: 'À 17 h 15.', explanation: 'Le rendez-vous est prévu avant le début de la séance.' },
    words: [
      word('une tenue de sport', 'Les vêtements à porter pour pratiquer.', sport[0], true),
      { label: 'une gourde', clue: 'Une bouteille qu’on peut remplir et emporter.', image: '/lib/images/tcf/catalogue/objets/ecole/gourde.webp' },
      word('un vestiaire', 'Une pièce où l’on change de vêtements.'),
      word('un échauffement', 'Des mouvements pour préparer le corps à l’effort.', sport[1], true),
      word('une équipe', 'Des personnes qui jouent ensemble.'),
      word('prévenir', 'Donner une information avant ou dès que possible.', sport[3], true),
    ],
    completion: [
      blank('Pour boire à l’entraînement, je prends ma ___.', 'gourde', 'raquette', 'casquette', 'La gourde contient de l’eau.'),
      blank('Je me change dans le ___.', 'vestiaire', 'terrain', 'parking', 'Le vestiaire est prévu pour se changer.'),
      blank('Je bouge doucement avant le match. Je m’___.', 'échauffe', 'inscris', 'arrête', 'Je prépare mon corps à l’effort.'),
    ],
    read: {
      title: 'Message du club de basket', picture: sport[0],
      lines: ['Mardi · Rendez-vous à 17 h 15 devant la salle. Début à 17 h 30.', 'Apporte des chaussures propres et une gourde.', 'Si tu es absent, préviens le club avant 16 h par message.'],
      questions: [
        choice('À quelle heure faut-il se retrouver devant la salle ?', 'À 17 h 15', 'À 17 h 30', 'À 16 h'),
        choice('Quels objets faut-il apporter ?', 'Des chaussures propres et une gourde', 'Un ballon et une veste', 'Un sac et une raquette'),
        choice('Si tu ne peux pas venir mardi, que fais-tu ?', 'J’écris au club avant 16 h', 'J’appelle après le début', 'J’arrive à 17 h 30'),
      ],
    },
    speak: { prompt: 'Tu ne peux pas venir mardi. Appelle ton entraîneur. Indique la séance et demande le lieu et l’heure de la prochaine.', model: 'Bonjour, c’est Noam. Je ne pourrai pas venir à la séance de basket de mardi. Est-ce que la prochaine est à la même salle ? À quelle heure dois-je arriver ?', picture: sport[3] },
    write: { prompt: 'Écris à ton équipe. Préviens de ton absence, précise le jour et indique quand tu penses revenir.', model: 'Salut l’équipe, je ne pourrai pas venir mardi à l’entraînement. Je vous préviens pour que vous puissiez faire les groupes. Je pense revenir vendredi. Pouvez-vous me confirmer l’heure du rendez-vous ?', picture: sport[3] },
  },
  {
    id: 'weekend', level: 'A2', title: 'Raconter son week-end',
    objective: 'Je raconte deux actions dans l’ordre. Je pose une question.',
    situation: 'Eden raconte son week-end à une camarade. Elle lui demande ce qu’il a préféré.',
    pictures: weekend,
    steps: [
      'Je nomme le jour et le moment de la journée.',
      'Je dis ce que j’ai fait au passé.',
      'Je peux dire « d’abord », « ensuite » et « enfin ».',
      'Je dis ce qui m’a plu ou déplu.',
    ],
    example: {
      kind: 'table', headers: ['Samedi', 'Dimanche'],
      rows: [['Le matin, j’ai fait les courses.', 'Je suis allé au parc avec ma sœur.'], ['L’après-midi, j’ai joué au gymnase.', 'Le soir, je me suis reposé.']],
    },
    practice: { prompt: 'Écris deux actions, une pour samedi et une pour dimanche.', answer: 'Samedi, j’ai fait les courses. Dimanche, je suis allé au parc.', explanation: 'Le jour permet de placer les deux actions dans l’ordre.' },
    words: [
      word('le week-end', 'Les deux jours du samedi et du dimanche.'),
      word('faire les courses', 'Aller acheter ce dont on a besoin.', weekend[0], true),
      word('se promener', 'Marcher pour le plaisir.', weekend[2], true),
      word('se reposer', 'Prendre du temps pour retrouver des forces.', weekend[3], true),
      word('ensuite', 'Après ce qui vient d’être raconté.'),
      word('ça m’a plu', 'C’est une chose que j’ai aimée.'),
    ],
    completion: [
      blank('Samedi, j’___ fait les courses.', 'ai', 'suis', 'vais', 'On dit « j’ai fait ».'),
      blank('Dimanche, je ___ allé au parc.', 'suis', 'ai', 'fais', 'On dit « je suis allé » ou « je suis allée ».'),
      blank('J’ai aimé ma sortie. Elle m’a ___.', 'plu', 'dit', 'pris', 'Quelque chose qui nous plaît nous fait plaisir.'),
    ],
    read: {
      title: 'Message d’Eden', picture: weekend[2],
      lines: ['Samedi matin, j’ai fait les courses. L’après-midi, j’ai joué au gymnase avec mes voisins.', 'Dimanche, je me suis promené au parc avec ma sœur. Il faisait frais, mais la promenade m’a plu.', 'Le soir, j’ai lu tranquillement. Et toi, comment s’est passé ton week-end ?'],
      questions: [
        choice('Que fait Eden après les courses samedi ?', 'Il joue au gymnase', 'Il se promène au parc', 'Il lit à la maison'),
        choice('Avec qui va-t-il au parc ?', 'Avec sa sœur', 'Avec ses voisins', 'Avec son groupe de sport'),
        choice('Qu’est-ce qui lui a plu malgré le temps frais ?', 'La promenade', 'Les courses', 'La lecture du soir'),
      ],
    },
    speak: { prompt: 'Raconte deux événements de ton week-end. Dis quel jour tu les as faits et ce que tu as aimé. Pose une question à ton camarade.', model: 'Samedi, j’ai fait les courses. Dimanche, je suis allé au parc avec ma sœur. J’ai adoré la promenade. Et toi, qu’est-ce que tu as fait dimanche ?', picture: weekend[1] },
    write: { prompt: 'Écris à un camarade. Raconte un moment de samedi et un moment de dimanche. Dis ce que tu as aimé et pose une question.', model: 'Salut Maya, samedi j’ai joué au gymnase avec des voisins. Dimanche je suis allé au parc avec ma sœur. J’ai aimé marcher au calme. Et toi, qu’est-ce qui t’a plu ce week-end ?', picture: weekend[3] },
  },
  {
    id: 'vacances', level: 'A2', title: 'Les vacances',
    objective: 'Je lis un programme. Je prépare une sortie et une autre idée.',
    situation: 'Aïcha invite une amie à passer la journée au lac. La météo annonce de la pluie.',
    pictures: vacances,
    steps: [
      'Je cherche le jour, l’heure et le lieu du rendez-vous.',
      'Je vérifie si je dois réserver une place.',
      'Je prépare mon sac selon l’activité et la météo.',
      'Si le temps change, je vérifie le programme prévu.',
    ],
    example: {
      kind: 'table', headers: ['Jour', 'Programme', 'S’il pleut'],
      rows: [['Mardi', '10 h · Balade au lac et pique-nique', 'Atelier à la maison de quartier'], ['Jeudi', '13 h 30 · Visite au musée', 'Visite au musée']],
    },
    practice: { prompt: 'Il pleut mardi. Où va le groupe ?', answer: 'À la maison de quartier.', explanation: 'La dernière colonne indique ce qui est prévu en cas de pluie.' },
    words: [
      word('un programme', 'La liste des activités avec les jours et les heures.'),
      word('réserver', 'Demander à garder une place avant de venir.'),
      { label: 'un pique-nique', clue: 'Un repas que tu emportes pour manger dehors.', image: '/lib/images/vocabulaire/loisirs/pique-nique.webp' },
      { label: 'un maillot de bain', clue: 'Le vêtement prévu pour se baigner.', image: '/lib/images/vocabulaire/vetements/maillot-de-bain.webp' },
      word('la météo', 'Le temps annoncé pour un lieu et un moment.'),
      word('le point de rendez-vous', 'L’endroit où le groupe se retrouve.', vacances[3], true),
    ],
    completion: [
      blank('Pour garder une place, je dois ___.', 'réserver', 'annuler', 'revenir', 'Réserver sert à garder une place.'),
      blank('Je mange mon repas dehors. C’est un ___.', 'pique-nique', 'guichet', 'vestiaire', 'On emporte un pique-nique pour manger dehors.'),
      blank('Le temps annoncé dans ma région, c’est la ___.', 'météo', 'pause', 'nature', 'La météo aide à choisir la tenue et l’activité.'),
    ],
    read: {
      title: 'Programme du centre de loisirs', picture: vacances[1],
      lines: ['Mardi : rendez-vous à 10 h devant le centre pour la balade au lac. Apporte ton pique-nique.', 'S’il pleut mardi, l’atelier a lieu au centre à la même heure.', 'Jeudi : visite au musée. Rendez-vous à 13 h 30 devant le musée. Réserve avant mercredi soir.'],
      questions: [
        choice('Quelle activité est prévue mardi s’il fait beau ?', 'Une balade au lac', 'Un atelier au centre', 'Une visite au musée'),
        choice('Où aller mardi à 10 h s’il pleut ?', 'Au centre de loisirs', 'Au musée', 'Au lac'),
        choice('Pour voir le musée, que faut-il faire ?', 'Réserver avant mercredi soir', 'Venir sans réserver mardi', 'Emporter un pique-nique jeudi soir'),
      ],
    },
    speak: { prompt: 'Propose à un ami la balade du mardi. Mettez-vous d’accord sur l’heure, le lieu et le repas. Vérifiez le programme s’il pleut.', model: 'On se retrouve mardi à 10 h devant le centre ? Je prends de l’eau et un pique-nique pour le lac. S’il pleut, on vient quand même au centre pour l’atelier.', picture: vacances[3] },
    write: { prompt: 'Écris une invitation pour la balade du mardi. Précise le lieu, l’heure, les affaires à prendre et le programme s’il pleut.', model: 'Salut Léo, viens à la balade mardi. On se retrouve à 10 h devant le centre de loisirs. Prends ton pique-nique et de l’eau. S’il pleut, on fera l’atelier au centre à la même heure.', picture: vacances[2] },
  },
]

import { blank, choice, picture, word } from './lecon-supports'
import type { SchoolLesson } from './types'

const examens = [
  picture('examens/lire-la-convocation', 'Je vérifie l’heure et la salle sur ma convocation.'),
  picture('examens/se-presenter-a-lecrit', 'Je montre ma convocation à l’entrée de la salle.'),
  picture('examens/poser-une-question-sur-le-resultat', 'Je demande la démarche après un résultat.'),
] as const
const vieDeClasse = [
  picture('vie-de-classe/lire-au-calme', 'Une personne lit une fiche dans l’espace calme.'),
  picture('vie-de-classe/pratiquer-a-loral', 'Deux personnes s’entraînent à parler ensemble.'),
  picture('vie-de-classe/discuter-dune-regle', 'Le groupe examine une proposition.'),
] as const
const sortie = [
  picture('sortie/comparer-deux-offres', 'Nous comparons les programmes et leur coût.'),
  picture('sortie/visiter-un-musee', 'Le groupe peut entrer au musée sans prendre l’escalier.'),
  picture('sortie/choisir-la-balade', 'Le groupe regarde le chemin au départ de la balade.'),
  picture('sortie/accueillir-le-groupe', 'Au rendez-vous, je vérifie qui est déjà arrivé.'),
] as const

export const SCHOOL_B1_LESSONS: readonly SchoolLesson[] = [
  {
    id: 'examens', level: 'B1', title: 'Examens et résultats',
    objective: 'Je lis une convocation et un avis de résultat. Je vérifie la suite.',
    situation: 'Nadia a deux épreuves. Elle reçoit un changement de salle pour l’oral.',
    pictures: examens,
    steps: [
      'Je lis le jour, l’heure, la salle et la durée de chaque épreuve.',
      'Un nouvel avis peut changer une seule information.',
      'Passer un examen, c’est y participer. Réussir, c’est obtenir le résultat demandé.',
      'Après un résultat, je vérifie les démarches et leurs délais.',
    ],
    example: {
      kind: 'table', headers: ['Document', 'Ce que je repère'],
      rows: [['Convocation', 'Écrit mardi, 9 h, salle 4'], ['Dernier avis', 'L’oral de jeudi se déroule en salle 12. L’heure reste la même.'], ['Résultat', 'Rattrapage proposé. Contacter le secrétariat avant lundi.']],
    },
    practice: { prompt: 'Le résultat propose un rattrapage. Que vérifies-tu en premier ?', answer: 'La démarche d’inscription et son délai.', explanation: 'Le dernier jour pour s’inscrire peut être différent du jour de l’épreuve.' },
    words: [
      word('une convocation', 'Un document qui demande de venir à une épreuve.', examens[0], true),
      word('une épreuve', 'Une partie d’un examen, à l’écrit ou à l’oral.'),
      { label: 'une pièce d’identité', clue: 'Un document officiel qui donne ton identité.', image: '/lib/images/tcf/qcm-audit/vocab-carte-identite.webp' },
      word('une note', 'Un résultat chiffré.'),
      word('un rattrapage', 'Une possibilité de repasser une épreuve si le règlement le prévoit.'),
      word('un délai', 'Le temps accordé pour faire une démarche.'),
    ],
    completion: [
      blank('Le document qui indique où et quand me présenter est ma ___.', 'convocation', 'correction', 'note', 'La convocation indique les conditions pour se présenter.'),
      blank('On me propose une autre épreuve après un échec. C’est un ___.', 'rattrapage', 'vestiaire', 'bulletin', 'Le rattrapage donne une nouvelle possibilité selon le règlement.'),
      blank('Pour m’inscrire à temps, je vérifie le ___.', 'délai', 'trajet', 'barème', 'Le délai indique le temps accordé pour l’inscription.'),
    ],
    read: {
      title: 'Convocation, changement et résultat', picture: examens[0],
      lines: [
        'Convocation · Écrit mardi à 9 h, salle 4, 60 minutes. Oral jeudi à 14 h, salle 8, 15 minutes. Apporte ta pièce d’identité.',
        'Mise à jour · L’oral du jeudi a lieu en salle 12. Les heures prévues et la salle de l’écrit restent les mêmes.',
        'Résultat · Écrit réussi. Oral à repasser. Pour demander un rattrapage, écris au secrétariat avant lundi à midi.',
      ],
      questions: [
        choice('Où et quand se présenter à l’oral après la mise à jour ?', 'Jeudi à 14 h en salle 12', 'Jeudi à 14 h en salle 8', 'Mardi à 9 h en salle 12'),
        choice('Quelle information reste valable après la mise à jour ?', 'L’écrit a lieu mardi à 9 h en salle 4', 'L’oral dure désormais 60 minutes', 'La pièce d’identité est devenue facultative'),
        choice('Quelle démarche faut-il faire et dans quel délai ?', 'Écrire au secrétariat avant lundi à midi', 'Aller en salle 12 lundi à midi', 'Écrire après le rattrapage'),
      ],
    },
    speak: { prompt: 'Appelle le secrétariat. Tu as deux documents qui indiquent des salles différentes pour l’oral. Demande quelle salle suivre, reformule la réponse et vérifie le document à apporter.', model: 'Bonjour, la convocation indique la salle 8 et le nouvel avis la salle 12. Quelle salle dois-je suivre ? Donc, je viens jeudi à 14 h en salle 12. Dois-je apporter ma pièce d’identité en plus de la convocation ?', picture: examens[1] },
    write: { prompt: 'Écris au secrétariat après le résultat. Indique l’épreuve, explique pourquoi tu écris et demande la date du rattrapage et les pièces à apporter.', model: 'Bonjour, je vous écris au sujet de l’examen de français. J’ai réussi l’écrit et l’avis indique que je dois repasser l’oral. Je souhaite m’inscrire au rattrapage avant lundi. Pouvez-vous me confirmer la date de cette nouvelle épreuve et m’indiquer les documents à apporter ? Merci pour votre aide. Cordialement, Nadia Berger.', picture: examens[2] },
  },
  {
    id: 'respect', level: 'B1', title: 'Mieux vivre ensemble en classe',
    objective: 'Je comprends deux avis. Je propose une règle qui tient compte des besoins.',
    situation: 'Une personne veut lire au calme. Deux autres souhaitent s’entraîner à parler.',
    pictures: vieDeClasse,
    steps: [
      'Un fait décrit ce qui se passe.',
      'Un avis dit ce qu’une personne pense.',
      'Je demande une raison pour comprendre le besoin.',
      'Je propose une règle, avec un lieu et un moment.',
      'Si des moqueries se répètent, je peux en parler à une personne de confiance.',
    ],
    example: '« Je comprends que Léa a besoin de silence. Je propose un coin calme et une table pour le travail oral. »',
    practice: { prompt: 'Les personnes qui travaillent à l’oral gênent la lecture. Que proposes-tu ?', answer: 'Les personnes qui lisent gardent le coin calme. Les échanges à voix basse se font à l’autre table.', explanation: 'La règle donne une place aux deux activités.' },
    words: [
      word('un fait', 'Ce qui s’est passé et peut être vérifié.'),
      word('un avis', 'Ce qu’une personne pense.'),
      word('un besoin', 'Ce qui est nécessaire pour une personne.'),
      word('une raison', 'Ce qui explique un avis ou une action.'),
      word('une proposition', 'Une idée que l’on présente pour trouver une solution.', vieDeClasse[2], true),
      word('reformuler', 'Redire une idée avec ses propres mots.'),
    ],
    completion: [
      blank('« Trois groupes parlent. » On peut le vérifier. C’est un ___.', 'fait', 'avis', 'conseil', 'On peut vérifier combien de groupes parlent.'),
      blank('« Je préfère le silence. » La personne donne son ___.', 'avis', 'horaire', 'adresse', 'La phrase dit ce que la personne pense.'),
      blank('Je redis son idée avec mes propres mots. Je la ___.', 'reformule', 'refuse', 'remplace', 'Reformuler aide à vérifier que j’ai compris.'),
    ],
    read: {
      title: 'Deux avis sur le travail en classe', picture: vieDeClasse[0],
      lines: [
        'Avis de Léa · « Quand plusieurs groupes parlent, je perds le fil de ma lecture. J’ai besoin d’un endroit calme. »',
        'Avis de Milan · « À deux, on peut s’entraîner à parler et s’aider quand on oublie un mot. »',
        'Note du groupe · « Nous pouvons utiliser la table près de la porte pour les binômes. Nous pouvons garder le fond de la classe pour la lecture calme. Nous essayons cette règle pendant une semaine. »',
      ],
      questions: [
        choice('Pourquoi Léa demande-t-elle du calme ?', 'Pour rester concentrée sur sa lecture', 'Pour prendre la parole plus fort', 'Pour quitter la classe plus tôt'),
        choice('Quel avantage Milan voit-il dans le travail à deux ?', 'S’aider en parlant', 'Éviter de lire toutes les consignes', 'Faire les exercices plus vite sans parler'),
        choice('Quelle règle répond aux deux besoins ?', 'Un lieu pour chaque activité', 'Le silence partout pour toute la semaine', 'Le travail oral dans toute la classe'),
      ],
    },
    speak: { prompt: 'Vous discutez en classe. Reformule les deux besoins. Propose une règle qui indique le lieu et le moment. Tu peux expliquer comment l’essayer pendant une semaine.', model: 'Léa a besoin de calme pour lire. Milan veut s’entraîner avec quelqu’un. Je propose de mettre les binômes près de la porte et les lecteurs au fond. On teste pendant une semaine et on regarde si chacun peut travailler.', picture: vieDeClasse[1] },
    write: { prompt: 'Écris une proposition à l’enseignante. Décris le problème, propose une règle et explique comment elle aidera les deux groupes.', model: 'Bonjour, pendant les exercices, certains élèves ont du mal à lire quand plusieurs personnes parlent. D’autres ont besoin de s’entraîner à l’oral. Je propose de mettre les binômes près de la porte et les lecteurs au fond de la classe. Ainsi, les deux activités peuvent continuer. Pourrions-nous essayer cette organisation pendant une semaine ?', picture: vieDeClasse[2] },
  },
  {
    id: 'sortie', level: 'B1', title: 'Organiser une sortie',
    objective: 'Je compare deux offres. J’explique mon choix et je l’annonce au groupe.',
    situation: 'La classe cherche une sortie qui coûte au maximum 9 CHF. Le groupe veut pouvoir sortir même s’il pleut.',
    pictures: sortie,
    steps: [
      'Je note le budget et les besoins du groupe.',
      'Je compare le coût, le trajet et les conditions.',
      'Pour justifier mon choix, je donne deux raisons.',
      'Après la décision, je vérifie le délai et j’informe le groupe.',
    ],
    example: {
      kind: 'table', headers: ['Critère', 'Balade', 'Musée'],
      rows: [['Coût par personne', '4 CHF', '8 CHF'], ['Par forte pluie', 'À reporter', 'Visite maintenue'], ['Accès', 'Chemin avec une montée', 'Entrée sans escalier'], ['Démarche', 'Aucune réservation', 'Réservation avant jeudi']],
    },
    practice: { prompt: 'Il peut pleuvoir et le budget est de 9 CHF. Que choisis-tu ?', answer: 'Le musée. Il coûte 8 CHF et la visite peut avoir lieu quand il pleut.', explanation: 'Deux conditions sont remplies : le prix et la météo.' },
    words: [
      word('un budget', 'La somme qu’on peut dépenser.'),
      word('le trajet', 'Le chemin à faire pour arriver au lieu.'),
      word('l’accessibilité', 'La possibilité d’accéder à un lieu selon ses besoins.', sortie[1], true),
      word('une autorisation', 'Un accord pour pouvoir participer ou faire une action.'),
      word('reporter', 'Décaler à une autre date.'),
      word('justifier', 'Donner des raisons pour expliquer un choix.'),
    ],
    completion: [
      blank('Le ___ est de 9 CHF par personne. On peut dépenser jusqu’à 9 CHF.', 'budget', 'trajet', 'délai', 'Le budget fixe la somme disponible.'),
      blank('En cas de forte pluie, on va ___ la balade à samedi prochain.', 'reporter', 'réserver', 'annuler', 'Reporter garde l’activité à une autre date.'),
      blank('J’explique pourquoi je préfère le musée. Je ___ mon choix.', 'justifie', 'oublie', 'inverse', 'Je donne des raisons pour expliquer mon choix.'),
    ],
    read: {
      title: 'Deux idées de sortie pour la classe', picture: sortie[0],
      lines: [
        'Le groupe dispose de 9 CHF au maximum par personne. Il cherche une activité possible par temps de pluie et une entrée sans escalier.',
        'Balade : transport 4 CHF. Le chemin comprend une montée. En cas de forte pluie, la balade est reportée.',
        'Musée : entrée 8 CHF. Visite maintenue s’il pleut. Entrée sans escalier. Réserver les places avant jeudi.',
      ],
      questions: [
        choice('Quelle offre respecte le budget, la météo et l’accès demandés ?', 'Le musée', 'La balade', 'Les deux offres'),
        choice('Pourquoi la balade est-elle moins adaptée s’il pleut fort ?', 'Elle sera reportée', 'Elle coûtera plus de 9 CHF', 'Le groupe devra réserver jeudi'),
        choice('Quel geste faut-il faire pour confirmer la visite ?', 'Réserver avant jeudi', 'Acheter le billet de transport à 4 CHF', 'Attendre la pluie avant de réserver'),
        { prompt: 'Donne deux raisons pour lesquelles le musée convient au groupe.', answer: 'Par exemple : il coûte 8 CHF, l’entrée est sans escalier et la visite est possible s’il pleut. Deux raisons suffisent.' },
      ],
    },
    speak: { prompt: 'Présente les deux offres au groupe. Écoute une contrainte proposée par ton camarade. Choisis une sortie, donne deux raisons et annonce la prochaine démarche.', model: 'La balade est moins chère, mais elle sera reportée s’il pleut fort. Tu dis aussi que l’entrée doit être sans escalier. Je propose le musée : il coûte 8 CHF et l’entrée convient. Je peux réserver avant jeudi.', picture: sortie[2] },
    write: { prompt: 'Écris au groupe après le choix. Annonce la sortie, donne deux raisons, indique le rendez-vous et la prochaine action. Ajoute un moyen de prévenir le groupe en cas d’imprévu.', model: 'Bonjour à toutes et tous. Nous avons choisi le musée. La visite coûte 8 CHF par personne et reste possible s’il pleut. Nous nous retrouvons vendredi à 13 h 30 devant l’entrée sans escalier. Je réserverai les places avant jeudi. Si l’heure change, je vous enverrai un message dans le groupe de la classe.', picture: sortie[3] },
  },
]

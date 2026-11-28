import { SCHOOL_A2_LESSONS } from './lecons-a2'
import { SCHOOL_B1_LESSONS } from './lecons-b1'
import { blank, choice, picture, word } from './lecon-supports'
import type { SchoolLesson, SchoolWord } from './types'

function clock(time: string, caption: string, description: string) {
  return picture(`cadrans/${time}`, caption, description)
}
function object(label: string, clue: string, path: string): SchoolWord {
  return { label, clue, image: `/lib/images/vocabulaire/ecole-bureau/${path}.webp` }
}
const Regles = [
  picture('reglement/attendre-son-tour', 'Je lève la main et j’attends.'),
  picture('reglement/ecouter-un-camarade', 'J’écoute la personne qui parle.'),
  picture('reglement/manger-pendant-la-pause', 'Je mange pendant la pause.'),
  picture('reglement/ranger-le-telephone', 'Je range mon téléphone dans mon sac.'),
  picture('reglement/demander-de-repeter', 'Je demande de répéter.'),
  picture('reglement/conversation-en-francais', 'Je parle en français pendant l’activité.'),
  picture('reglement/ranger-sa-place', 'Je range ma place après le cours.'),
  picture('reglement/marcher-dans-le-couloir', 'Je marche dans le couloir.'),
] as const
const Consignes = [
  picture('consignes/ecouter', 'Écoute.'),
  picture('consignes/regarder', 'Regarde.'),
  picture('consignes/repeter', 'Répète.'),
  picture('consignes/lire', 'Lis.'),
  picture('consignes/ouvrir-le-cahier', 'Ouvre le cahier.'),
  picture('consignes/copier', 'Copie.'),
  picture('consignes/completer', 'Complète.'),
  picture('consignes/ranger-la-feuille', 'Range la feuille.'),
] as const
const Traces = [
  picture('documents/trace-cocher', 'Coche la case.', 'Une case cochée à côté du mot école.'),
  picture('documents/trace-entourer', 'Entoure le mot.', 'Un trait fait le tour du mot école.'),
  picture('documents/trace-souligner', 'Souligne le mot.', 'Un trait est placé sous le mot école.'),
  picture('documents/trace-relier', 'Relie les deux mots identiques.', 'Un trait relie deux fois le mot sac.'),
] as const
const Materiel = [
  picture('materiel/preparer-le-cartable', 'Je prépare mon cartable.'),
  picture('materiel/preter-une-regle', 'On me prête une règle.'),
  picture('materiel/rendre-le-materiel', 'Je rends la règle.'),
] as const
const Heures = [
  clock('08-00', '8 h · huit heures', 'La petite aiguille montre le 8 et la grande aiguille montre le 12.'),
  clock('08-30', '8 h 30 · huit heures et demie', 'La petite aiguille est entre le 8 et le 9 et la grande aiguille montre le 6.'),
  clock('10-15', '10 h 15 · dix heures et quart', 'La petite aiguille vient de dépasser le 10 et la grande aiguille montre le 3.'),
  clock('15-45', '15 h 45 · quatre heures moins le quart', 'La petite aiguille est près du 4 et la grande aiguille montre le 9. Le soleil est visible.'),
  clock('16-00', '16 h · quatre heures de l’après-midi', 'La petite aiguille montre le 4 et la grande aiguille montre le 12. Le soleil est visible.'),
  clock('12-00', '12 h · midi', 'Les deux aiguilles montrent le 12. Le soleil est visible.'),
  clock('00-00', '0 h · minuit', 'Les deux aiguilles montrent le 12. La lune est visible.'),
  clock('20-00', '20 h · huit heures du soir', 'La petite aiguille montre le 8 et la grande aiguille montre le 12. La lune est visible.'),
] as const
const Heure = [
  picture('heure/regarder-lhorloge', 'Je regarde l’horloge.'),
  picture('heure/fixer-un-rendez-vous', 'Nous choisissons une heure et un lieu.'),
] as const
const Horaires = [
  picture('horaires/lire-lemploi-du-temps', 'Je trouve le jour et l’heure.'),
  picture('horaires/arriver-en-classe', 'J’arrive avant le début du cours.'),
  picture('horaires/pause-et-reprise', 'Après la pause, je retourne en classe.'),
  picture('horaires/prevenir-le-secretariat', 'Je préviens le secrétariat.'),
] as const
const Lieux = [
  picture('lieux/chercher-une-salle', 'Je repère le numéro de la salle.'),
  picture('lieux/demander-au-secretariat', 'Je demande où aller.'),
  picture('lieux/entrer-a-la-bibliotheque', 'Je vais à la bibliothèque.'),
] as const
const Routine = [
  picture('quotidien/se-lever', 'Je me lève le matin.'),
  picture('quotidien/prendre-le-petit-dejeuner', 'Je prends mon petit déjeuner.'),
  picture('quotidien/preparer-les-affaires-du-lendemain', 'Le soir, je prépare mes affaires.'),
] as const

const a1Lessons: readonly SchoolLesson[] = [
  {
    id: 'reglement', level: 'A1', title: 'Règlement de l’école', objective: 'Je comprends et j’applique les règles de ma classe.',
    situation: 'En classe, Malik veut poser une question. Il lève la main. Il attend que sa camarade termine.',
    pictures: Regles,
    steps: [
      'Je lève la main pour parler. J’attends mon tour.',
      'J’écoute quand une autre personne parle.',
      'Je mange pendant la pause. En classe, je range mon téléphone.',
      'Pendant le cours de français, j’essaie de parler en français. Si je ne comprends pas, je demande de répéter.',
      'Dans le couloir, je marche. Après le cours, je range ma place.',
    ],
    example: 'Je lève la main. La professeure me donne la parole. Je dis : « Vous pouvez répéter, s’il vous plaît ? »',
    practice: { prompt: 'Tu as faim pendant la leçon. Quand peux-tu manger ?', answer: 'Pendant la pause.', explanation: 'Pendant le cours, je garde ma collation dans mon sac.' },
    words: [
      { label: 'lever la main', clue: 'Faire ce geste pour demander la parole.', image: '/lib/images/vocabulaire/actions/lever-la-main.webp' },
      word('écouter', 'Faire attention à ce qu’une personne dit.', Regles[1], true),
      word('la pause', 'Un moment court entre deux cours.', Regles[2], true),
      word('ranger', 'Mettre un objet à sa place.', Regles[3], true),
      word('répéter', 'Dire encore une fois.', Regles[4], true),
      word('le couloir', 'Le passage qui mène aux salles.', Regles[7], true),
    ],
    completion: [
      blank('Pour parler, je ___ la main.', 'lève', 'ferme', 'mange', 'Lever la main permet de demander la parole.'),
      blank('Quand mon camarade parle, je l’___.', 'écoute', 'ouvre', 'range', 'J’attends la fin de sa phrase avant de parler.'),
      blank('Je mange pendant la ___.', 'pause', 'porte', 'chaise', 'Dans cette école, on mange pendant la pause.'),
      blank('Dans le couloir, je ___.', 'marche', 'cours', 'crie', 'Marcher laisse le passage libre et évite les chocs.'),
    ],
    read: {
      title: 'Dans notre classe', picture: Regles[2],
      lines: ['Je lève la main pour parler.', 'Je laisse mon téléphone dans mon sac.', 'Je mange dans la cour pendant la pause.', 'Je marche dans les couloirs.'],
      questions: [
        choice('Où faut-il laisser le téléphone ?', 'Dans son sac', 'Sur le tableau', 'Sur sa table'),
        choice('Où peut-on manger pendant la pause ?', 'Dans la cour', 'Dans le couloir', 'En classe'),
        choice('Que fait-on avant de parler ?', 'On lève la main', 'On ouvre la porte', 'On range la table'),
      ],
    },
    speak: { prompt: 'Une nouvelle élève arrive dans ta classe. Explique deux règles. Montre comment demander la parole en français.', model: 'Dans notre classe, on lève la main avant de parler. On mange pendant la pause. Madame, je peux poser une question ?', picture: Regles[0] },
    write: { prompt: 'Écris deux règles pour ta classe. Une règle explique quand manger. Une règle explique comment demander la parole.', model: 'Je mange pendant la pause. Je lève la main avant de parler.' },
  },
  {
    id: 'consignes', level: 'A1', title: 'Consignes de classe', objective: 'Je comprends les verbes qui disent quoi faire.',
    situation: 'Le professeur dit « Ouvrez votre cahier ». Les élèves ouvrent leur cahier.',
    pictures: [Consignes[4], Consignes[6], ...Traces],
    steps: [
      'Une consigne dit quoi faire. Je repère le mot qui indique l’action.',
      'Écoute, regarde, répète et lis sont des actions différentes.',
      'Coche : fais une marque dans une case. Entoure : fais un trait autour.',
      'Souligne : trace un trait dessous. Relie : trace un trait entre deux éléments.',
      'Complète : écris ce qui manque. Copie : écris la même chose que le modèle.',
    ],
    example: '« Souligne le mot école. » Je trouve le mot école. Je trace un trait sous le mot.',
    practice: { prompt: 'La consigne dit « Coche une case ». Que fais-tu ?', answer: 'Je fais une marque dans une case.', explanation: 'La marque reste dans la case.' },
    words: [
      word('écouter', 'Faire attention à ce qu’on entend.', Consignes[0], true),
      word('regarder', 'Porter les yeux sur une chose.', Consignes[1], true),
      word('répéter', 'Dire la même chose une nouvelle fois.', Consignes[2], true),
      word('lire', 'Comprendre des mots écrits.', Consignes[3], true),
      word('ouvrir le cahier', 'Écarter sa couverture pour voir les pages.', Consignes[4], true),
      word('copier', 'Écrire la même chose que le modèle.', Consignes[5], true),
      word('compléter', 'Ajouter l’élément qui manque.', Consignes[6], true),
      word('ranger la feuille', 'Mettre la feuille à sa place.', Consignes[7], true),
      word('cocher', 'Faire une marque dans une case.', Traces[0]),
      word('entourer', 'Faire un trait autour de quelque chose.', Traces[1]),
      word('souligner', 'Tracer un trait sous quelque chose.', Traces[2]),
      word('relier', 'Tracer un trait entre deux éléments.', Traces[3]),
    ],
    completion: [
      blank('Je trace un trait sous le mot. Je ___ le mot.', 'souligne', 'entoure', 'lis', 'Pour souligner, je place un trait sous le mot.'),
      blank('Je fais une marque dans une case. Je ___ la case.', 'coche', 'range', 'relie', 'Pour cocher, je fais une marque dans la case.'),
      blank('Il manque un mot. Je ___ la phrase.', 'complète', 'ferme', 'relie', 'Pour compléter, j’écris ce qui manque.'),
      blank('Je trace un trait entre les deux mots. Je les ___.', 'relie', 'écoute', 'repère', 'Je pars d’un mot et je trace un trait jusqu’à l’autre.'),
    ],
    read: {
      title: 'Les consignes de la fiche',
      lines: ['1. Écris ton prénom en haut de la feuille.', '2. Lis la phrase.', '3. Entoure le mot école.', '4. Range la feuille dans ton classeur.'],
      questions: [
        choice('Que faut-il écrire en haut ?', 'Son prénom', 'Le jour', 'Le nom de la professeure'),
        choice('Que faut-il faire avec le mot école ?', 'L’entourer', 'Le souligner', 'Le recopier'),
        choice('Quelle consigne correspond à cette image ?', 'Relie les deux mots', 'Coche une case', 'Entoure un mot', Traces[3]),
      ],
    },
    speak: { prompt: 'Donne deux consignes à ton camarade. Il ou elle fait les gestes. Inversez les rôles. Demande de répéter si tu ne comprends pas.', model: 'Ouvre ton cahier. Écris ton prénom. Tu peux répéter, s’il te plaît ?', picture: Consignes[4] },
    write: { prompt: 'Écris deux consignes pour une activité. Utilise deux verbes parmi les mots « lire », « entourer » et « souligner ».', model: 'Lis la phrase. Entoure le mot école.' },
  },
  {
    id: 'materiel', level: 'A1', title: 'Matériel scolaire', objective: 'Je nomme les objets de la classe. Je demande à emprunter un objet.',
    situation: 'Nora a oublié sa règle. Elle demande une règle à un camarade.',
    pictures: Materiel,
    steps: [
      'Le matériel scolaire, ce sont les objets que j’utilise en classe.',
      'J’écris avec un crayon ou un stylo. J’efface le crayon avec une gomme.',
      'Je mesure avec une règle. Je découpe avec des ciseaux. Je colle avec de la colle.',
      'J’écris sur une feuille ou dans un cahier. Je lis un livre.',
      'J’emprunte un objet pour un moment. Après, je rends l’objet.',
    ],
    example: '« Tu peux me prêter une règle, s’il te plaît ? » Je l’utilise et je la rends après l’exercice.',
    practice: { prompt: 'Avec quel objet peux-tu mesurer la longueur de ta feuille ?', answer: 'Une règle.', explanation: 'Les petits traits et les nombres sur la règle servent à mesurer.' },
    words: [
      object('un cahier', 'J’écris plusieurs leçons dans cet objet.', 'cahier'),
      object('un livre', 'Je lis ses pages imprimées.', 'livre'),
      object('une feuille', 'Un seul morceau de papier pour écrire.', 'feuille-de-papier'),
      object('un crayon', 'J’écris avec sa mine. Je peux effacer les traits.', 'crayon'),
      object('un stylo', 'J’écris avec son encre.', 'stylo'),
      object('une gomme', 'J’efface les traces de crayon avec cet objet.', 'gomme'),
      object('une règle', 'Je mesure ou je fais un trait droit.', 'règle'),
      object('des ciseaux', 'Je découpe du papier avec cet objet.', 'ciseaux'),
      object('de la colle', 'Je fixe deux morceaux de papier.', 'colle'),
      object('un surligneur', 'Je mets une couleur sur un mot important.', 'surligneur'),
      object('une trousse', 'Je range mes stylos dans ce petit étui.', 'trousse'),
      object('un cartable', 'Je porte mes cahiers sur mon dos.', 'cartable'),
    ],
    completion: [
      blank('Je découpe le papier avec des ___.', 'ciseaux', 'cahiers', 'stylos', 'Les ciseaux coupent le papier.'),
      blank('J’efface le trait de crayon avec une ___.', 'gomme', 'trousse', 'règle', 'La gomme efface les marques de crayon.'),
      blank('Je mesure mon dessin avec une ___.', 'règle', 'gomme', 'feuille', 'La règle porte des graduations.'),
      blank('Je rends à Nora l’objet qu’elle m’a ___.', 'prêté', 'découpé', 'dessiné', 'Un objet prêté revient à la personne qui le possède.'),
    ],
    read: {
      title: 'La liste pour le cours de dessin', picture: Materiel[0],
      lines: ['Mardi, apporte un grand cahier.', 'Mets des crayons de couleur, des ciseaux et de la colle dans ton sac.', 'La professeure donne le papier.'],
      questions: [
        choice('Quel cahier faut-il apporter ?', 'Un grand cahier', 'Un petit cahier', 'Un cahier déjà rempli'),
        choice('Que donne la professeure ?', 'Le papier', 'Les ciseaux', 'Les crayons'),
        choice('Quel jour faut-il apporter le matériel ?', 'Mardi', 'Lundi', 'Jeudi'),
      ],
    },
    speak: { prompt: 'Tu n’as pas de règle. Demande une règle à ton camarade. Dis quand tu vas la rendre. Le camarade répond.', model: 'Tu peux me prêter ta règle, s’il te plaît ? Je te la rends après l’exercice. Merci !', picture: Materiel[1] },
    write: { prompt: 'Tu ne trouves plus ton cahier. Écris un message au secrétariat. Donne la couleur de ton cahier et le lieu où tu penses l’avoir laissé.', model: 'Bonjour, je cherche mon cahier rouge. Je pense qu’il est en salle 8. Merci.' },
  },
  {
    id: 'heure', level: 'A1', title: 'Lire et dire l’heure', objective: 'Je lis une horloge. Je dis l’heure d’un rendez-vous.',
    situation: 'Le cours commence à 8 h. Je regarde l’horloge pour savoir si c’est le moment d’entrer.',
    pictures: [Heure[0], Heures[0], Heures[1], Heures[2], Heures[3], Heures[4], Heures[5], Heures[6]],
    steps: [
      'La petite aiguille montre les heures. La grande aiguille montre les minutes.',
      'Grande aiguille sur le 12 : zéro minute. Sur le 3 : 15 minutes, ou « et quart ».',
      'Grande aiguille sur le 6 : 30 minutes, ou « et demie ». Sur le 9 : 45 minutes.',
      '15 h 45, c’est quatre heures moins le quart. Il reste 15 minutes avant 16 h.',
      'Midi, c’est 12 h. Minuit, c’est 0 h. 8 h le matin et 20 h le soir se ressemblent sur le cadran.',
    ],
    example: 'La petite aiguille est entre le 8 et le 9. La grande aiguille montre le 6. Il est 8 h 30.',
    practice: { prompt: 'Il est dix heures et quart. Écris l’heure en chiffres.', answer: '10 h 15.', explanation: 'Un quart d’heure correspond à 15 minutes.' },
    words: [
      { label: 'une horloge', clue: 'Elle indique l’heure au mur.', image: '/lib/images/vocabulaire/heure-horloge/horloge.webp' },
      word('une aiguille', 'Une tige qui tourne sur le cadran.'),
      word('midi', 'Le milieu de la journée.', Heures[5]),
      word('minuit', 'Le moment où commence une nouvelle journée.', Heures[6]),
      word('un quart d’heure', 'Une durée de 15 minutes.'),
      word('une demi-heure', 'Une durée de 30 minutes.'),
    ],
    completion: [
      blank('La grande aiguille indique les ___.', 'minutes', 'jours', 'étages', 'La grande aiguille montre les minutes passées après l’heure.'),
      blank('Huit heures et demie, c’est ___.', '8 h 30', '8 h 15', '8 h 45', 'La moitié d’une heure fait 30 minutes.'),
      blank('Douze heures en journée, c’est ___.', 'midi', 'minuit', 'le soir', 'Le jour et la nuit ont deux lectures différentes du cadran 12.'),
      blank('Quatre heures de l’après-midi, c’est ___.', '16 h', '14 h', '20 h', 'On ajoute 12 heures à quatre heures pour l’après-midi.'),
    ],
    read: {
      title: 'Le rendez-vous', lines: ['Le club commence à 16 h.', 'Le point de rendez-vous est devant la salle de sport.'],
      questions: [
        choice('Quelle heure montre le cadran ?', '8 h 30', '8 h', '10 h 30', Heures[1]),
        choice('Quelle heure du soir montre le cadran ?', '20 h', '18 h', '22 h', Heures[7]),
        choice('À quelle heure commence le club ?', '16 h', '15 h 45', '20 h'),
      ],
    },
    speak: { prompt: 'Propose un rendez-vous à 16 h devant la salle de sport. Ton camarade arrive à 16 h 15. Choisissez une heure qui convient aux deux personnes.', model: 'On se voit à quatre heures devant la salle de sport ? Tu arrives à quatre heures et quart ? D’accord, rendez-vous à 16 h 15.', picture: Heure[1] },
    write: { prompt: 'Écris un petit message pour proposer un rendez-vous samedi. Indique une heure et un lieu.', model: 'Bonjour, on se voit samedi à 10 h 15 devant l’école ? À bientôt !', picture: Heure[1] },
  },
  {
    id: 'horaires', level: 'A1', title: 'Horaires de l’école', objective: 'Je trouve le jour, le début et la fin d’un cours. Je préviens en cas de retard.',
    situation: 'Lundi, Ada regarde son emploi du temps. Elle cherche l’heure du cours de français.',
    pictures: Horaires,
    steps: [
      'Un emploi du temps dit quand les cours ont lieu.',
      'Je cherche le jour. Sur la ligne du cours, je lis l’heure de début et l’heure de fin.',
      'Une pause est un moment sans cours. Après la pause, le cours reprend.',
      'Un avis peut changer un horaire. Je lis aussi la date du changement.',
      'Si je suis en retard ou absent, je préviens la personne indiquée par l’école.',
    ],
    example: {
      kind: 'table',
      headers: ['Lundi', 'Début', 'Fin'],
      rows: [['Français', '8 h 30', '10 h'], ['Pause', '10 h', '10 h 15'], ['Maths', '10 h 15', '11 h 45']],
    },
    practice: { prompt: 'La pause finit à 10 h 15. À quelle heure faut-il revenir ?', answer: 'À 10 h 15.', explanation: 'L’heure de fin de la pause indique quand le cours reprend.' },
    words: [
      word('un emploi du temps', 'Un tableau avec les jours, heures et cours.', Horaires[0], true),
      word('le début', 'Le moment où le cours commence.'),
      word('la fin', 'Le moment où le cours se termine.'),
      word('la pause', 'Un moment court sans cours.', Horaires[2], true),
      word('un retard', 'Une arrivée après l’heure prévue.'),
      word('prévenir', 'Donner une information à quelqu’un avant ou dès que possible.', Horaires[3], true),
    ],
    completion: [
      blank('Le cours commence à 8 h 30. C’est l’heure du ___.', 'début', 'retour', 'dîner', 'Début veut dire « le moment où le cours commence ».'),
      blank('Entre deux cours, je fais une ___.', 'pause', 'fin', 'salle', 'Une pause est un court moment sans cours.'),
      blank('J’arrive après l’heure. Je suis en ___.', 'retard', 'avance', 'vacances', 'Un retard est une arrivée après l’heure.'),
      blank('Je téléphone au secrétariat pour le ___.', 'prévenir', 'fermer', 'dessiner', 'Je donne une information au secrétariat.'),
    ],
    read: {
      title: 'Lundi · Emploi du temps', picture: Horaires[0],
      lines: ['8 h 30 – 10 h : français, salle 3.', '10 h – 10 h 15 : pause.', '10 h 15 – 11 h 45 : maths, salle 5.', 'Mardi, le cours de français commence exceptionnellement à 9 h.'],
      questions: [
        choice('À quelle heure commencent les maths lundi ?', '10 h 15', '10 h', '11 h 45'),
        choice('Dans quelle salle a lieu le cours de maths ?', 'Salle 5', 'Salle 3', 'Salle 9'),
        choice('Quel jour le français commence à 9 h ?', 'Mardi', 'Lundi', 'Vendredi'),
      ],
    },
    speak: { prompt: 'Tu arrives quinze minutes en retard. Téléphone au secrétariat. Donne ton prénom et dis quand tu arrives.', model: 'Bonjour, je m’appelle Ada. Je suis en retard. J’arrive à 8 h 45. Merci.', picture: Horaires[3] },
    write: { prompt: 'Écris un message au secrétariat pour annoncer un retard. Indique ton nom, ton cours et ton heure d’arrivée.', model: 'Bonjour, je suis Ada Diallo, du cours de français. Mon bus est en retard. J’arriverai à 8 h 45. Merci.', picture: Horaires[3] },
  },
  {
    id: 'lieux', level: 'A1', title: 'Se repérer dans l’école', objective: 'Je demande où se trouve une salle. Je suis des indications simples.',
    situation: 'Sam cherche la salle 12. Il demande son chemin au secrétariat.',
    pictures: Lieux,
    steps: [
      'Le rez-de-chaussée est le niveau de l’entrée. Le premier étage est au-dessus.',
      'À gauche et à droite indiquent un côté. Tout droit veut dire continuer dans la même direction.',
      'À côté de veut dire tout près. En face de veut dire de l’autre côté, juste devant.',
      'Je peux demander « Où est la salle 12, s’il vous plaît ? »',
      'Je note l’étage, le numéro et un repère. Le repère peut être l’escalier ou la bibliothèque.',
    ],
    example: 'La salle 12 est au premier étage. Après l’escalier, tourne à droite. La salle est près de la bibliothèque.',
    practice: { prompt: 'La salle est près de la bibliothèque. Quel lieu t’aide à la trouver ?', answer: 'La bibliothèque.', explanation: 'La bibliothèque sert de repère pour trouver la salle.' },
    words: [
      word('le rez-de-chaussée', 'Le niveau de l’entrée.'),
      word('le premier étage', 'Le niveau juste au-dessus de l’entrée.'),
      word('le secrétariat', 'Le bureau où je peux demander des informations.', Lieux[1], true),
      word('une salle', 'Une pièce où un groupe suit un cours.', Lieux[0], true),
      word('la bibliothèque', 'Le lieu où lire ou emprunter un livre.', Lieux[2], true),
      word('à côté de', 'Tout près d’une autre chose.'),
    ],
    completion: [
      blank('Le niveau de l’entrée est le ___.', 'rez-de-chaussée', 'premier étage', 'toit', 'On entre dans l’école au rez-de-chaussée.'),
      blank('La salle est au-dessus de l’entrée, au premier ___.', 'étage', 'devoir', 'horaire', 'Un étage est un niveau du bâtiment.'),
      blank('Pour dire où est la salle, je donne un ___.', 'repère', 'retard', 'ticket', 'Un repère est une chose facile à trouver sur le chemin.'),
      blank('Pour continuer sans tourner, je vais tout ___.', 'droit', 'gauche', 'droite', 'Tout droit veut dire continuer dans la même direction.'),
    ],
    read: {
      title: 'Les salles du bâtiment', picture: Lieux[1],
      lines: ['Rez-de-chaussée : secrétariat, près de l’entrée.', 'Premier étage : salle 12, à droite de l’escalier.', 'Premier étage : bibliothèque, en face de la salle 12.'],
      questions: [
        choice('Où est le secrétariat ?', 'Près de l’entrée', 'À droite de l’escalier au premier étage', 'En face de la salle 12'),
        choice('À quel étage est la salle 12 ?', 'Au premier étage', 'Au rez-de-chaussée', 'Au deuxième étage'),
        choice('Qu’y a-t-il en face de la salle 12 ?', 'La bibliothèque', 'L’entrée', 'Le secrétariat'),
      ],
    },
    speak: { prompt: 'Tu cherches la salle 12. Demande ton chemin au secrétariat. Ton camarade répond en donnant l’étage et le côté.', model: 'Bonjour, où est la salle 12, s’il vous plaît ? Montez au premier étage. La salle est à droite de l’escalier.', picture: Lieux[0] },
    write: { prompt: 'Un camarade cherche la salle 12. Écris un message. Donne l’étage et un repère.', model: 'Salut, la salle 12 est au premier étage, en face de la bibliothèque.' },
  },
  {
    id: 'quotidien', level: 'A1', title: 'Une journée à la maison', objective: 'Je décris ce que je fais le matin, après l’école et le soir.',
    situation: 'Le matin, Ilyes s’habille et prend son petit déjeuner. Le soir, il prépare son sac pour le lendemain.',
    pictures: Routine,
    steps: [
      'Quand je me réveille, j’ouvre les yeux. Quand je me lève, je sors du lit.',
      'Le matin, je peux me laver, m’habiller et prendre mon petit déjeuner.',
      'Après l’école, je peux faire mes devoirs, goûter ou jouer.',
      'Le soir, je peux préparer mes affaires, dîner et me coucher.',
      'Pour raconter dans l’ordre, je peux dire « d’abord », « puis » et « enfin ».',
    ],
    example: 'D’abord, je me lève. Puis, je m’habille. Enfin, je prends mon petit déjeuner.',
    practice: { prompt: 'Qu’est-ce que tu peux préparer le soir pour l’école ?', answer: 'Mon sac et mes affaires.', explanation: 'Le lendemain matin, mes affaires sont déjà prêtes.' },
    words: [
      word('se lever', 'Sortir du lit après le réveil.', Routine[0], true),
      word('s’habiller', 'Mettre ses vêtements.'),
      word('prendre son petit déjeuner', 'Manger le premier repas de la journée.', Routine[1], true),
      word('faire ses devoirs', 'Faire à la maison le travail demandé à l’école.'),
      word('préparer son sac', 'Mettre dans son sac les affaires nécessaires.', Routine[2], true),
      word('se coucher', 'Aller au lit pour dormir.'),
    ],
    completion: [
      blank('Je sors du lit. Je me ___.', 'lève', 'couche', 'coiffe', 'Se lever, c’est sortir du lit.'),
      blank('Je mets mon pantalon. Je m’___.', 'habille', 'écoute', 'arrête', 'S’habiller, c’est mettre des vêtements.'),
      blank('Après l’école, je fais mes ___.', 'devoirs', 'horaires', 'matins', 'Les devoirs sont le travail demandé pour la maison.'),
      blank('Avant de dormir, je me ___.', 'couche', 'lève', 'réveille', 'Se coucher, c’est aller au lit.'),
    ],
    read: {
      title: 'La journée d’Ilyes', picture: Routine[1],
      lines: ['À 7 h, Ilyes se lève.', 'À 7 h 15, il prend son petit déjeuner.', 'Après l’école, il fait ses devoirs.', 'Le soir, il prépare son sac pour le lendemain.'],
      questions: [
        choice('À quelle heure Ilyes se lève ?', '7 h', '7 h 15', '8 h'),
        choice('Que fait-il après l’école ?', 'Ses devoirs', 'Son petit déjeuner', 'Ses courses'),
        choice('Que prépare-t-il le soir ?', 'Son sac', 'Son déjeuner', 'Son vélo'),
      ],
    },
    speak: { prompt: 'Raconte trois choses que tu fais un jour d’école. Demande à ton camarade ce qu’il fait le soir.', model: 'Le matin, je prends mon petit déjeuner. Après l’école, je fais mes devoirs. Le soir, je lis. Et toi, que fais-tu le soir ?', picture: Routine[2] },
    write: { prompt: 'Écris trois phrases sur ta journée. Commence par « Le matin », « Après l’école » et « Le soir ».', model: 'Le matin, je me lève à 7 h. Après l’école, je joue dehors. Le soir, je prépare mon sac.', picture: Routine[2] },
  },
]

export const SCHOOL_LESSONS = [...a1Lessons, ...SCHOOL_A2_LESSONS, ...SCHOOL_B1_LESSONS]

import { pick, type Rng } from '@/math/rng'
import { filledForms, switchQuestionForm } from './formes'
import { tcfExerciseById } from './loader'
import { tpfPlacementTask } from './tpf-placement'
import type { TcfExercise, TcfPeFormulaire, TcfPeQuestionTexte, TcfPoDialogue, TcfPoLecture } from './types'

const FORMULAIRE: TcfPeFormulaire = {
  id: 'tpf-formulaire-atelier',
  competence: 'PE',
  type_exercice: 'formulaire',
  niveau: 'A0-A1',
  consigne: 'Vous inscrivez Lina Morel à un atelier de dessin. Lina est née le 12 septembre 2010. Son téléphone est le 079 555 12 34. Elle choisit l’atelier du mercredi.',
  questions: [],
  support: {
    titre: 'Inscription à un atelier de dessin',
    champs: [
      { label: 'Prénom', type: 'texte', corrige: 'Lina' },
      { label: 'Nom', type: 'texte', corrige: 'Morel' },
      { label: 'Date de naissance', type: 'date', corrige: '12.09.2010' },
      { label: 'Téléphone', type: 'texte', corrige: '079 555 12 34' },
      { label: 'Jour de l’atelier', type: 'choix', options: ['Mardi', 'Mercredi', 'Vendredi'], corrige: 'Mercredi' },
    ],
  },
}

function texte(id: string, niveau: TcfPeQuestionTexte['niveau'], min: number, max: number,
  consigne: string, reponse_modele: string): TcfPeQuestionTexte {
  return {
    id: `tpf-redaction-${id}`,
    competence: 'PE',
    type_exercice: 'question_texte',
    niveau,
    questions: [],
    support: { consigne, nb_mots: { min, max }, reponse_modele },
  }
}

const TEXTES_COURTS = [
  texte('invitation', 'A1-A2', 40, 50,
    'Vous organisez un pique-nique. Écrivez à un ami pour l’inviter. Indiquez le lieu, le jour et l’heure. Dites ce qu’il peut apporter et demandez-lui de confirmer.',
    'Salut Hugo ! Samedi, je fais un pique-nique au parc près de la gare. On se retrouve à midi devant l’entrée principale. Tu peux apporter une boisson ou des fruits. Il y aura aussi quelques amis de la classe. Dis-moi si tu peux venir. À bientôt !'),
  texte('absence', 'A1-A2', 40, 50,
    'Vous ne pouvez pas venir au cours de français demain. Écrivez à votre professeur. Expliquez votre absence, demandez ce qu’il faut préparer et dites quand vous pourrez revenir.',
    'Bonjour Madame, je ne pourrai pas venir au cours demain parce que j’ai un rendez-vous chez le médecin. Pourriez-vous me dire quels exercices je dois préparer à la maison ? Je pense revenir jeudi matin. Merci pour votre aide et bonne journée. À jeudi, Lina.'),
]

const REDACTIONS = [
  texte('entraide', 'A2-B1', 60, 80,
    'Vous avez participé à une activité d’entraide dans votre quartier. Racontez ce que vous avez fait, décrivez une difficulté et expliquez pourquoi vous recommanderiez ou non cette activité.',
    'Samedi dernier, j’ai aidé des voisins à préparer un repas pour les habitants du quartier. Au début, nous manquions de chaises et certaines personnes devaient rester debout. J’ai proposé d’en emprunter à la bibliothèque, qui nous en a prêté dix. Ensuite, tout le monde a pu s’asseoir et discuter. Je recommande cette activité parce qu’elle permet de rencontrer des personnes que l’on croise souvent sans leur parler.'),
  texte('sortie', 'A2-B1', 60, 80,
    'Votre classe cherche une idée de sortie. Proposez un lieu, présentez deux activités possibles et expliquez pourquoi votre proposition conviendrait au groupe. Mentionnez une solution en cas de mauvais temps.',
    'Je propose une sortie au bord du lac vendredi prochain. Le matin, nous pourrions suivre le chemin jusqu’au port pour observer les oiseaux. Après le repas, chacun pourrait prendre une photo et la présenter à la classe. Ce lieu convient au groupe, car le bus s’arrête tout près et la promenade est gratuite. S’il pleut, nous pourrions visiter le petit musée du port, qui propose des activités à l’intérieur.'),
]

const LECTURES: TcfPoLecture[] = [
  {
    id: 'tpf-lecture-bibliotheque',
    niveau: 'A2-B1',
    competence: 'PO',
    type_exercice: 'lecture_progressive',
    questions: [],
    support: {
      titre: 'Un mercredi à la bibliothèque',
      texte: 'Je m’appelle Nina. J’habite près de la bibliothèque. Le mercredi, j’y vais avec mon frère. Nous aimons lire et choisir des livres.\n\nMercredi dernier, il pleuvait. Nous sommes entrés pour nous mettre à l’abri et la bibliothécaire nous a proposé de découvrir un nouveau coin lecture. Nous sommes restés plus longtemps que prévu.\n\nDepuis cette visite, je comprends mieux pourquoi un lieu comme celui-ci est important. Même si nous pouvons trouver beaucoup de choses sur Internet, une bibliothèque nous permet de rencontrer d’autres personnes et de découvrir des livres que nous n’aurions pas choisis seuls.',
    },
  },
  {
    id: 'tpf-lecture-jardin',
    niveau: 'A2-B1',
    competence: 'PO',
    type_exercice: 'lecture_progressive',
    questions: [],
    support: {
      titre: 'Le jardin de notre école',
      texte: 'Dans mon école, il y a un petit jardin. Nous avons des fleurs et des tomates. Chaque mardi, deux élèves donnent de l’eau aux plantes.\n\nLa semaine dernière, il a fait très chaud et certaines plantes ont séché. Avec mon voisin de classe, j’ai fabriqué une petite réserve d’eau. Nous l’avons installée près des tomates.\n\nAu début, je pensais que le projet servait seulement à cultiver des légumes. Maintenant, je me rends compte qu’il nous apprend aussi à nous organiser. Si personne n’accepte de s’occuper du jardin pendant les vacances, il sera difficile de garder nos plantes en bonne santé.',
    },
  },
]

function argumentation(id: string, sujet: string, relance: string, exemple: string): TcfPoDialogue {
  return {
    id: `tpf-argumentation-${id}`,
    niveau: 'A2-B1',
    competence: 'PO',
    type_exercice: 'dialogue',
    tags: ['point-de-vue'],
    questions: [],
    support: {
      situation: sujet,
      repliques_au_corrige: true,
      repliques: [
        { locuteur: 'examinateur', texte: 'Êtes-vous pour ou contre cette idée ? Pourquoi ?' },
        { locuteur: 'eleve', texte: exemple },
        { locuteur: 'examinateur', texte: relance },
        { locuteur: 'examinateur', texte: 'Pouvez-vous donner un exemple dans votre vie quotidienne ?' },
      ],
    },
  }
}

const ARGUMENTATIONS = [
  argumentation('telephone',
    'Votre école envisage d’interdire les téléphones pendant toute la journée, même à la récréation. Êtes-vous pour ou contre cette règle ?',
    'Que dites-vous à quelqu’un qui a besoin d’appeler sa famille après le cours ?',
    'Je suis contre une interdiction pendant toute la journée. À la récréation, un téléphone peut servir à joindre sa famille. Il permet aussi de consulter son trajet. Par exemple, si mon bus est annulé, je peux chercher un autre itinéraire.'),
  argumentation('devoirs',
    'Votre école propose de supprimer les devoirs pour le week-end. Êtes-vous pour ou contre cette idée ?',
    'Comment les élèves pourraient-ils réviser avant un contrôle le lundi ?',
    'Je suis pour, car on a besoin de se reposer et de passer du temps avec sa famille. On pourrait commencer à réviser en classe le vendredi, par exemple en reprenant les exercices difficiles à deux.'),
  argumentation('repas',
    'La cantine propose de servir un repas végétarien chaque semaine. Êtes-vous pour ou contre cette proposition ?',
    'Que pourrait faire la cantine pour convaincre les personnes qui hésitent ?',
    'Je suis pour, parce qu’on peut découvrir de nouveaux plats. Ce serait aussi l’occasion de manger davantage de légumes. Par exemple, la cantine pourrait proposer un curry de légumes et demander l’avis des élèves.'),
  argumentation('transports',
    'Votre ville pense rendre les bus gratuits pour les jeunes le samedi et le dimanche. Êtes-vous pour ou contre cette idée ?',
    'Quels pourraient être les inconvénients si les bus deviennent plus fréquentés ?',
    'Je suis pour, parce que certains jeunes vivent loin du centre et que les trajets coûtent cher. Avec le bus gratuit, mes amis et moi pourrions aller à la bibliothèque sans demander une voiture à nos parents.'),
]

function bankEntries(ids: readonly string[]): TcfExercise[] {
  return ids.flatMap((id) => {
    const exercise = tcfExerciseById(id)
    return exercise ? [exercise] : []
  })
}

export function tpfPlacementExercises(typeId: string): TcfExercise[] {
  const task = tpfPlacementTask(typeId)
  if (!task) return []
  if ('ids' in task) {
    return bankEntries(task.ids).flatMap((exercise) => {
      // Garder des questions en prise directe sur le document et dotées d’un corrigé texte.
      const questions = exercise.questions
        .filter((question) => filledForms(question).includes('qcm_texte'))
        .slice(0, task.questionPoints.length)
        .map((question, index) => ({ ...switchQuestionForm(question, 'qcm_texte'), points: task.questionPoints[index] }))
      return questions.length === task.questionPoints.length ? [{ ...exercise, questions }] : []
    })
  }
  switch (typeId) {
    case 'tpf-pe-formulaire': return [FORMULAIRE]
    case 'tpf-pe-texte-court': return TEXTES_COURTS
    case 'tpf-pe-redaction': return REDACTIONS
    case 'tpf-po-entretien': return bankEntries(['tcf-a0a1-po-entretien', 'tcf-a1a2-po-entretien'])
    case 'tpf-po-lecture': return LECTURES
    case 'tpf-po-trois-themes': return bankEntries(['tcf-a1a2-po-trois-themes'])
    case 'tpf-po-argumentation': return ARGUMENTATIONS
    case 'tpf-po-description-dialogue':
      return bankEntries([
        'tcf-a1a2-po-img-bibliotheque',
        'tcf-a1a2-po-img-boulangerie',
        'tcf-a1a2-po-img-boucherie',
      ]).filter((exercise) => exercise.type_exercice === 'image_interaction' && exercise.support.images.length === 1)
    default: return []
  }
}

export function drawTpfPlacementExercise(typeId: string, rng: Rng, bankId?: string): TcfExercise | undefined {
  const task = tpfPlacementTask(typeId)
  const pool = tpfPlacementExercises(typeId)
  if (!task || pool.length === 0) return undefined
  const exercise = pool.find((entry) => entry.id === bankId) ?? pick(rng, pool)
  const result = {
    ...exercise,
    consigne: task.instruction,
    ...('points' in task ? { points: task.points } : {}),
  }
  if (result.type_exercice === 'formulaire') return { ...result, consigne: exercise.consigne }
  if (result.type_exercice === 'image_interaction') {
    const role = `Situation · ${result.support.lieu}\nVous voulez ${result.support.vous_voulez}.`
    return { ...result, consigne: `${task.instruction}\n${role}` }
  }
  return result
}

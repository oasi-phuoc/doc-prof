import type { WorksheetPage } from '@/math/types'
import type { TcfPeExercise } from './types'

export type PeCriterion = {
  title: string
  levels: Array<{ points: number; description: string }>
}
export type PeEvaluation = {
  id: string
  title: string
  task: string
  reference: string
  referencePoints: number
  points: number
  criteria: PeCriterion[]
}

function criterion(title: string, descriptions: string[]): PeCriterion {
  return { title, levels: descriptions.map((description, i) => ({ points: descriptions.length - i - 1, description })) }
}

/** Les trois références ISA servent de barèmes, sans imposer leur sujet aux autres tâches. */
export function peEvaluation(ex: TcfPeExercise, total: number, instruction?: string): PeEvaluation {
  const form = ex.type_exercice === 'formulaire'
  const words = ex.type_exercice === 'texte_images'
  const dialogue = ex.type_exercice === 'dialogue_a_completer'
  const short = dialogue || ex.type_exercice === 'sms_reponse' || ex.type_exercice === 'image_question'
  const task = ex.type_exercice === 'dialogue_a_completer' && ex.support.situation?.trim()
    ? [instruction ?? ex.consigne, ex.support.situation.trim()].filter(Boolean).join('\n\n')
    : 'consigne' in ex.support ? ex.support.consigne : ex.consigne ?? ''
  const format = dialogue ? 'dialogue' : ex.type_exercice === 'email_reponse' || (ex.type_exercice === 'question_texte' && ex.support.email)
    ? 'e-mail' : 'message'
  const expected = 'nb_mots' in ex.support ? ex.support.nb_mots : undefined
  const length = expected?.min && expected?.max ? `Longueur attendue : ${expected.min} à ${expected.max} mots.`
    : expected?.min ? `Longueur attendue : au moins ${expected.min} mots.`
      : expected?.max ? `Longueur attendue : ${expected.max} mots maximum.` : ''
  let criteria: PeCriterion[]
  let referencePoints: number
  let reference: string
  if (form) {
    referencePoints = 5
    reference = 'ISA · Ex1 — formulaire'
    criteria = [
      criterion('Respect de la consigne', ['Toutes les rubriques demandées sont complétées.', 'Une ou plusieurs rubriques demandées sont vides.']),
      criterion('Compréhension du formulaire', ['Les réponses correspondent aux rubriques et à la situation.', 'Les réponses ne correspondent pas aux rubriques.']),
      criterion('Adéquation sociolinguistique', ['Réponses brèves, neutres et adaptées à ce formulaire.', 'Contenu ou présentation inadaptés à un formulaire.']),
      { title: 'Lexique / Orthographe', levels: [{ points: 0.5, description: 'Mots appropriés et compréhensibles ; erreurs mineures acceptées.' }, { points: 0, description: 'Mots difficilement lisibles ou incompréhensibles.' }] },
      { title: 'Morphosyntaxe', levels: [{ points: 0.5, description: 'Formes simples et informations correctement structurées (dates, nombres, etc.).' }, { points: 0, description: 'Structures incorrectes gênant la compréhension.' }] },
      criterion('Lisibilité / Clarté', ['Informations lisibles et placées dans les rubriques prévues.', 'Écriture illisible ou informations mal placées.']),
    ]
  } else if (words) {
    referencePoints = ex.support.mots.length
    reference = 'Barème des mots à compléter'
    criteria = ex.support.mots.map((word, i) => ({
      title: `Mot ${i + 1} : ${word.mot}`,
      levels: [{ points: 1, description: 'Mot correctement écrit.' }, { points: 0.5, description: 'Orthographe incorrecte, mais prononciation correcte.' }, { points: 0, description: 'Mot absent ou incorrect.' }],
    }))
  } else {
    referencePoints = 10
    reference = short ? 'ISA · Ex3 — texte communicatif adapté' : 'ISA · Ex2 — rédaction adaptée'
    const register = `Registre adapté au destinataire et à la situation (${format}) : tu/vous, salutations ou politesse selon la consigne.`
    const lexicon = criterion('Lexique / Orthographe lexicale', ['Vocabulaire adapté au sujet ; erreurs mineures sans gêne pour la compréhension.', 'Vocabulaire limité ou erreurs gênant parfois la compréhension.', 'Vocabulaire inadapté ou incompréhensible.'])
    const coherence = ['Idées ordonnées et liées par des connecteurs simples adaptés.', 'Organisation absente ou texte difficile à suivre.']
    criteria = short ? [
      criterion('Respect de la consigne', [`Tous les éléments demandés dans la consigne sont présents. ${length}`, 'Un élément demandé manque ou est très peu développé.', 'Plusieurs éléments demandés manquent ou sont incomplets.', 'La consigne n’est pas respectée.']),
      criterion('Correction sociolinguistique', [register, 'Registre inadapté à la situation ou au destinataire.']),
      criterion('Réalisation de la tâche / Compréhensibilité', [`${dialogue ? 'Répliques pertinentes et échange' : 'Message'} clair ; objectif communicatif atteint malgré quelques erreurs.`, 'Objectif partiellement atteint ; contenu partiellement clair.', 'Objectif non atteint ou contenu difficile à comprendre.']),
      lexicon,
      criterion('Morphosyntaxe / Orthographe', ['Structures et temps adaptés à la tâche, globalement corrects.', 'Erreurs de structure gênant la compréhension.']),
      criterion('Cohérence et cohésion', coherence),
    ] : [
      criterion('Réalisation de la tâche', [`Tous les éléments de la consigne sont développés de manière claire. ${length}`, 'Une partie seulement des éléments demandés est développée.', 'Réponse très partielle ; informations très limitées.', 'La réponse ne respecte pas la consigne.']),
      criterion('Cohérence et cohésion', [coherence[0], 'Certaines idées sont liées, mais le texte reste parfois décousu.', coherence[1]]),
      criterion('Adéquation sociolinguistique', [register, 'Ton ou registre inadapté au destinataire.']),
      lexicon,
      criterion('Morphosyntaxe', ['Phrases et temps adaptés à la tâche ; erreurs mineures sans gêne pour la compréhension.', 'Plusieurs erreurs, mais le sens reste compréhensible.', 'Phrases incorrectes ou très difficiles à comprendre.']),
    ]
  }
  // Répartir les centièmes conserve exactement le total, même avec un barème personnalisé.
  const points = Number.isFinite(total) && total >= 0 ? total : referencePoints
  let used = 0
  let weight = 0
  criteria = criteria.map((c) => {
    const max = c.levels[0].points
    weight += max
    const end = Math.round(points * weight / (referencePoints || 1) * 100)
    const scaled = (end - used) / 100
    used = end
    return { ...c, levels: c.levels.map((l) => ({ ...l, points: max ? Math.round(l.points / max * scaled * 100) / 100 : 0 })) }
  })
  return { id: ex.id, title: ex.scene || ex.theme || 'Production écrite', task, reference, referencePoints, points, criteria }
}

export function peEvaluationsOf(page: WorksheetPage | undefined): PeEvaluation[] {
  if (!page) return []
  if (page.blocks?.length) return page.blocks.flatMap((block) => block.items.flatMap((item) =>
    item.tcfPeEvaluation ? [{ ...item.tcfPeEvaluation, title: `Exercice ${block.exerciseIndex} — ${item.tcfPeEvaluation.title}` }] : [],
  ))
  return page.items.flatMap((item) => item.tcfPeEvaluation ? [item.tcfPeEvaluation] : [])
}

import { createRng } from '@/math/rng'
import type { Difficulty, MathItem } from '@/math/types'

export const logistiqueStoryModules = ['303', '312', '601'] as const
type StoryModule = (typeof logistiqueStoryModules)[number]

export const logistiqueBloomLevels = {
  memoriser: 'Mémoriser', comprendre: 'Comprendre', appliquer: 'Appliquer',
  analyser: 'Analyser', evaluer: 'Évaluer', creer: 'Créer',
} as const

export type LogistiqueAssessment = {
  bloom?: keyof typeof logistiqueBloomLevels
  difficulty?: Difficulty
  minutes?: number
  objective?: string
  criteria?: string
  pointsLocked?: boolean
}

export type LogistiqueStory = {
  company: string
  article: string
  expected: number
  received: number
  held: number
  ordered: number
  introduction?: string
  introductionLocked?: boolean
  passages?: Partial<Record<StoryModule, { text: string; locked?: boolean }>>
}

export type LogistiqueEvaluation = {
  mode: 'histoire' | 'independantes'
  story?: LogistiqueStory
  targetMinutes?: number
  targetPoints?: number
  readingMinutes?: number
  reviewMinutes?: number
}

export const initialLogistiqueStory: LogistiqueStory = {
  company: 'EnterSite', article: 'bacs de pièces', expected: 60, received: 56, held: 5, ordered: 44,
}

export function validLogistiqueStory(value: unknown): value is LogistiqueStory {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const { company, article, expected, received, held, ordered, introduction, introductionLocked, passages } = value as LogistiqueStory
  const text = (input: unknown, maximum: number) => typeof input === 'string' && input.trim() && input.length <= maximum
  return Boolean(text(company, 70) && text(article, 70)) &&
    [expected, received, held, ordered].every((quantity) =>
      Number.isSafeInteger(quantity) && quantity >= 0 && quantity <= 1_000_000) &&
    held <= received &&
    (introduction === undefined || (typeof introduction === 'string' && introduction.length <= 500)) &&
    (introductionLocked === undefined || typeof introductionLocked === 'boolean') &&
    (passages === undefined || (passages !== null && typeof passages === 'object' && !Array.isArray(passages) &&
      Object.entries(passages).every(([code, passage]) => logistiqueStoryModules.some((module) => module === code) &&
        passage !== null && typeof passage === 'object' && typeof passage.text === 'string' && passage.text.length <= 500 &&
        (passage.locked === undefined || typeof passage.locked === 'boolean'))))
}

export function validLogistiqueEvaluation(value: unknown): value is LogistiqueEvaluation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const { mode, story, targetMinutes, targetPoints, readingMinutes, reviewMinutes } = value as LogistiqueEvaluation
  const validTime = (minutes?: number) => minutes === undefined ||
    (typeof minutes === 'number' && Number.isInteger(minutes * 2) && minutes >= 0 && minutes <= 120)
  return (mode === 'histoire' || mode === 'independantes') &&
    (story === undefined ? mode === 'independantes' : validLogistiqueStory(story)) &&
    validTime(readingMinutes) && validTime(reviewMinutes) &&
    (targetMinutes === undefined || (Number.isInteger(targetMinutes) && targetMinutes >= 1 && targetMinutes <= 480)) &&
    (targetPoints === undefined || (Number.isFinite(targetPoints) && targetPoints > 0 && targetPoints <= 1000 && targetPoints * 2 % 1 === 0))
}

export function validLogistiqueAssessment(value: unknown): value is LogistiqueAssessment {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const { bloom, difficulty, minutes, objective, criteria, pointsLocked } = value as LogistiqueAssessment
  return (bloom === undefined || Object.hasOwn(logistiqueBloomLevels, bloom)) &&
    (difficulty === undefined || ['facile', 'moyen', 'avance'].includes(difficulty)) &&
    (minutes === undefined || (Number.isFinite(minutes) && minutes >= 0.5 && minutes <= 120 && minutes * 2 % 1 === 0)) &&
    (objective === undefined || (typeof objective === 'string' && objective.length <= 100)) &&
    (pointsLocked === undefined || typeof pointsLocked === 'boolean') &&
    (criteria === undefined || (typeof criteria === 'string' && criteria.length <= 400))
}

export function logistiqueQuestionMinutes(item: MathItem, diploma: 'CFC' | 'AFP'): number {
  if (item.logistiqueAssessment?.minutes !== undefined) return item.logistiqueAssessment.minutes
  if (item.calcAnswer !== undefined) return item.calcAnswer.split('\n').length > 2 ? 5 : 3
  if (item.logistiqueChoice?.kind === 'true-false') return item.logistiqueChoice.justification === undefined ? 1 : 2
  if (item.logistiqueChoice?.kind === 'multiple') return 1.5
  if (item.layout === 'select') return 1
  if (item.logistiqueTable?.questions) return item.logistiqueTable.questions.length * (diploma === 'AFP' ? 1.5 : 1) + 1
  if (item.logistiqueTable || item.logistiqueResponseLines?.kind === 'numbered') return diploma === 'AFP' ? 4 : 3
  return diploma === 'AFP' ? 3 : 2.5
}

export function logistiqueDuration(items: readonly MathItem[], evaluation: LogistiqueEvaluation, diploma: 'CFC' | 'AFP') {
  const questions = items.reduce((total, item) => total + logistiqueQuestionMinutes(item, diploma), 0)
  const reading = evaluation.readingMinutes ?? (evaluation.mode === 'histoire' ? 2 : 0)
  const review = evaluation.reviewMinutes ?? Math.ceil((questions + reading) * 0.2) / 2
  return { questions, reading, review, total: Math.ceil(questions + reading + review) }
}

export function logistiqueStorySelectionCompatible(
  modules: readonly string[],
  quantities?: Record<string, number>,
): boolean {
  return modules.length > 0 && modules.every((code) =>
    logistiqueStoryModules.some((module) => module === code) && (!quantities || quantities[code] === 1))
}

export function logistiqueStoryIntro(story: LogistiqueStory): string {
  return story.introduction?.trim() ||
    `Chez ${story.company.trim()}, vous suivez une livraison de ${story.article.trim()}.`
}

export function logistiqueStoryQuestions(story: LogistiqueStory, modules: readonly string[]): MathItem[] {
  const gap = story.received - story.expected
  const available = story.received - story.held
  const served = Math.min(available, story.ordered)
  const remaining = available - served
  const unmet = story.ordered - served
  const units = (quantity: number) => `${quantity} unité${quantity === 1 ? '' : 's'}`
  const difference = gap < 0 ? `${units(Math.abs(gap))} de moins que prévu.`
    : gap > 0 ? `${units(gap)} de plus que prévu.` : 'Les quantités reçue et annoncée concordent.'
  const steps: Record<StoryModule, { passage: string; prompt: string; calculation: string; answer: string;
    points: number; assessment: LogistiqueAssessment }> = {
    '303': {
      passage: 'Au quai, vous vérifiez le bon de livraison.',
      prompt: `Le bon annonce ${units(story.expected)}. Vous en comptez ${story.received}. Calculez et interprétez l’écart selon la règle « quantité reçue moins quantité annoncée ».`,
      calculation: `${story.received} − ${story.expected} = ${gap}`,
      answer: difference,
      points: 3,
      assessment: { bloom: 'appliquer', difficulty: 'facile', minutes: 3, objective: '303 — Rapprocher la réception du bon',
        criteria: 'Écart signé exact et interprétation cohérente.' },
    },
    '312': {
      passage: 'Vous vérifiez ensuite la quantité qui peut être utilisée.',
      prompt: `Parmi les ${story.received} unités réceptionnées, ${story.held} sont bloquées. Aucune unité n’est réservée. Calculez le nombre d’unités disponibles pour la commande.`,
      calculation: `${story.received} − ${story.held} = ${available}`,
      answer: `Stock disponible de ${units(available)}.`,
      points: 2,
      assessment: { bloom: 'appliquer', difficulty: 'facile', minutes: 2.5, objective: '312 — Calculer le stock disponible',
        criteria: 'Quantité bloquée déduite et résultat exprimé en unités.' },
    },
    '601': {
      passage: 'Vous passez à la préparation de la commande.',
      prompt: `La commande demande ${story.ordered} unités. Les ${story.received} unités reçues comprennent ${story.held} unités bloquées. Vous préparez le maximum autorisé. Calculez la quantité préparée, le reste disponible et le nombre d’unités restant à livrer.`,
      calculation: `Disponible = ${story.received} − ${story.held} = ${available}\nPréparé = le plus petit de ${available} et ${story.ordered}, soit ${served}\nReste disponible = ${available} − ${served} = ${remaining}\nReste à livrer = ${story.ordered} − ${served} = ${unmet}`,
      answer: `Vous préparez ${units(served)}. Stock restant de ${units(remaining)}, avec ${units(unmet)} encore à livrer.`,
      points: 4,
      assessment: { bloom: 'appliquer', difficulty: 'moyen', minutes: 5, objective: '601 — Préparer et suivre une commande',
        criteria: 'Disponible exact, quantité préparée réaliste et chacun des deux restes correct.' },
    },
  }
  return logistiqueStoryModules.filter((module) => modules.includes(module)).map((module, index) => {
    const step = steps[module]
    const passage = story.passages?.[module]?.text.trim() || step.passage
    return {
      layout: 'text', prompt: step.prompt, calcAnswer: step.calculation, answer: step.answer, responseAnswer: step.answer,
      points: step.points, logistiqueAssessment: step.assessment,
      logistiqueNarrative: index === 0 ? `${logistiqueStoryIntro(story)}\n${passage}` : passage,
      logistiqueSource: { id: `log-histoire-${module}-v010`, module, revision: 'evaluation-v010' },
    }
  })
}

export function logistiqueStoryVariant(story: LogistiqueStory, seed: number): LogistiqueStory {
  const rng = createRng(seed)
  const expected = 30 + 5 * Math.floor(rng() * 15)
  const received = expected - 6 + Math.floor(rng() * 13)
  const held = 2 + Math.floor(rng() * 8)
  const ordered = received - held - 7 + Math.floor(rng() * 15)
  return { ...story, expected, received, held, ordered }
}

export function applyLogistiqueStoryChange(
  before: LogistiqueStory, after: LogistiqueStory, modules: readonly string[], items?: readonly MathItem[],
): { items?: MathItem[]; conflict?: string } {
  const generalChange = before.company !== after.company || before.article !== after.article
  const expectedChanged = before.expected !== after.expected
  const receivedChanged = before.received !== after.received
  const heldChanged = before.held !== after.held
  const orderedChanged = before.ordered !== after.ordered
  if (before.introductionLocked && after.introductionLocked &&
    (generalChange || expectedChanged || receivedChanged || heldChanged || orderedChanged)) {
    return { conflict: 'Déverrouillez l’introduction pour modifier les données de la trame.' }
  }
  const affected = new Map<StoryModule, boolean>([
    ['303', generalChange || expectedChanged || receivedChanged],
    ['312', generalChange || receivedChanged || heldChanged],
    ['601', generalChange || receivedChanged || heldChanged || orderedChanged],
  ])
  for (const module of logistiqueStoryModules) {
    if (affected.get(module) && before.passages?.[module]?.locked && after.passages?.[module]?.locked) {
      return { conflict: `Déverrouillez le passage du module ${module} pour modifier les données liées.` }
    }
  }
  if (!items) return {}
  const baseline = new Map(logistiqueStoryQuestions(before, modules).map((item) => [item.logistiqueSource!.id, item]))
  const updated = new Map(logistiqueStoryQuestions(after, modules).map((item) => [item.logistiqueSource!.id, item]))
  const sameContent = (first: MathItem, second: MathItem) =>
    first.prompt === second.prompt && first.answer === second.answer && first.calcAnswer === second.calcAnswer &&
    first.responseAnswer === second.responseAnswer && first.logistiqueNarrative === second.logistiqueNarrative
  const next: MathItem[] = []
  for (const item of items) {
    const id = item.logistiqueSource?.id
    const source = id ? baseline.get(id) : undefined
    const candidate = id ? updated.get(id) : undefined
    if (!source || !candidate || sameContent(source, candidate)) {
      next.push(item)
      continue
    }
    if (item.libreLocked || !sameContent(source, item)) {
      return { conflict: `La question du module ${item.logistiqueSource?.module} est verrouillée ou retouchée. Restaurez son texte et son calcul pour appliquer cette modification.` }
    }
    next.push({
      ...item, prompt: candidate.prompt, answer: candidate.answer, calcAnswer: candidate.calcAnswer,
      responseAnswer: candidate.responseAnswer, logistiqueNarrative: candidate.logistiqueNarrative,
    })
  }
  return { items: next }
}

export function allocateLogistiquePoints(
  items: readonly MathItem[], target: number, fallback: number,
): { items: MathItem[] } | { conflict: string } {
  if (!fallback) return { conflict: 'Rétablissez un barème actif dans les paramètres de l’activité.' }
  if (!Number.isFinite(target) || target < 0.5 || target > 1000 || !Number.isInteger(target * 2)) {
    return { conflict: 'Indiquez un total compris entre 0,5 et 1 000 points, par demi-point.' }
  }
  const scored = items.flatMap((item, index) => item.noPoints || item.layout === 'theory'
    ? [] : [{ item, index, points: item.points ?? fallback }])
  if (scored.some(({ points }) => !Number.isFinite(points) || points < 0)) {
    return { conflict: 'Corrigez les valeurs invalides du barème avant la répartition.' }
  }
  const adjustable = scored.filter(({ item, points }) => points > 0 && !item.libreLocked && !item.logistiqueAssessment?.pointsLocked)
  if (!adjustable.length) return { conflict: 'Aucune question notée ne possède de barème modifiable.' }
  const allPoints = scored.reduce((sum, entry) => sum + entry.points, 0)
  const adjustablePoints = adjustable.reduce((sum, entry) => sum + entry.points, 0)
  const units = (target - (allPoints - adjustablePoints)) * 2
  if (!Number.isInteger(units)) return { conflict: 'Les points protégés empêchent d’atteindre la cible par demi-point.' }
  if (units < adjustable.length) {
    return { conflict: 'La cible ne laisse pas un demi-point par question modifiable après déduction des points protégés.' }
  }
  const shares = adjustable.map(({ index, points }) => {
    const share = (units - adjustable.length) * points / adjustablePoints
    return { index, units: 1 + Math.floor(share), remainder: share - Math.floor(share) }
  })
  shares.sort((left, right) => right.remainder - left.remainder || left.index - right.index)
  const extra = units - shares.reduce((sum, entry) => sum + entry.units, 0)
  const distribution = new Map(shares.map((entry, index) => [entry.index, (entry.units + Number(index < extra)) / 2]))
  return { items: items.map((item, index) => {
    const points = distribution.get(index)
    return points === undefined || points === (item.points ?? fallback)
      ? item : { ...item, points, logistiqueRetained: true }
  }) }
}

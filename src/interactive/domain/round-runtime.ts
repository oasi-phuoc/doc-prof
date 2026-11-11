import { createRng, shuffle } from '@/math/rng'
import { questionsForRound, roundsFor } from './plan'
import { assignChoicePositions, choiceOrderPolicy } from './slots'
import { deriveSeed, hash } from './seeds'
import type { Game, Question, RoundRuntime, Session } from './types'

export const sequenceLength = (question: Question) => question.words?.length ?? question.images.length

export function copyRuntime(value: RoundRuntime): RoundRuntime {
  return { ...value, selections: { ...value.selections }, hintsShown: { ...value.hintsShown }, imageOrders: Object.fromEntries(Object.entries(value.imageOrders).map(([id, order]) => [id, [...order]])) }
}

export function runtimeFor(game: Game, state: Session, index = state.index): RoundRuntime {
  const round = roundsFor(game)[index]
  const saved = round ? state.roundStates?.[round.id] : undefined
  const base: RoundRuntime = saved ?? { phase: 'thinking', selections: {}, attempt: 0, hintsShown: {}, imageOrders: {}, audioComplete: false, audioOverride: false }
  if (index === state.index && !state.finished) return { ...base, phase: state.phase, selections: state.selections, revealedAt: state.revealedAt }
  if (saved) return saved
  const questions = questionsForRound(game, index)
  const answered = questions.length > 0 && questions.every((q) => state.history.some((a) => a.questionId === q.id && !a.skipped))
  return answered ? { ...base, phase: 'revealed', selections: Object.fromEntries(state.history.filter((a) => questions.some((q) => q.id === a.questionId) && a.selected !== undefined).map((a) => [a.questionId, a.selected!])) } : base
}

export function captureRound(game: Game, state: Session): Session {
  const round = roundsFor(game)[state.index]
  return !round || state.finished ? state : { ...state, roundStates: { ...state.roundStates, [round.id]: runtimeFor(game, state) } }
}

export function navigateToRound(game: Game, state: Session, index: number): Session {
  if (!Number.isInteger(index) || index < 0 || index >= roundsFor(game).length || index === state.index && !state.finished) return state
  const captured = captureRound(game, state)
  const target = runtimeFor(game, captured, index)
  return { ...captured, index, finished: false, phase: target.phase, selections: { ...target.selections }, selected: target.selections[questionsForRound(game, index)[0]?.id ?? ''], revealedAt: target.revealedAt }
}

/** New attempts move shuffled cards, while fixed / numeric / aggregate policies remain valid. */
export function questionsForAttempt(game: Game, index: number, attempt: number) {
  const questions = questionsForRound(game, index)
  if (attempt === 0) return questions
  const seed = game.seed ?? hash(game.id)
  const sourceKey = roundsFor(game)[index]!.id
  const next = assignChoicePositions({ ...game, seed: deriveSeed({ originalSeed: seed, sourceKey, purpose: 'replay', attempt }) }, questions)
  return next.map((q, i) => {
    if (q.mode !== 'choice' || choiceOrderPolicy(q) !== 'shuffle') return q
    const original = questions[i]!
    const correctId = game.corrections[q.id]!.choiceId
    const cycle = shuffle(createRng(deriveSeed({ originalSeed: seed, sourceKey: q.id, purpose: 'replay' })), original.choices.map((_, slot) => slot))
    const firstSlot = original.choices.findIndex((choice) => choice.id === correctId)
    const target = cycle[(cycle.indexOf(firstSlot) + attempt) % cycle.length]!
    const choices = q.choices.filter((choice) => choice.id !== correctId)
    choices.splice(target, 0, q.choices.find((choice) => choice.id === correctId)!)
    return { ...q, choices }
  })
}

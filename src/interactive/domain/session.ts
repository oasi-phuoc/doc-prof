import type { Action, Game, Session } from './types'
import { questionsForRound, roundsFor } from './plan'

export function startSession(game: Game): Session {
  return {
    gameId: game.id,
    index: 0,
    phase: 'thinking',
    paused: false,
    finished: false,
    history: [],
    selections: {},
  }
}

/** The only transition that reveals an answer is the teacher's REVEAL action. */
export function transition(
  game: Game,
  state: Session,
  action: Action,
): Session {
  if (state.finished) return state
  if (action.type === 'PAUSE') return { ...state, paused: true }
  if (action.type === 'RESUME') return { ...state, paused: false }
  if (state.paused) return state
  const questions = questionsForRound(game, state.index)
  const question = questions[0]
  const count = roundsFor(game).length
  if (!question) return state
  switch (action.type) {
    case 'CARDS_UP':
      return state.phase === 'thinking'
        ? { ...state, phase: 'cards-up' }
        : state
    case 'SELECT': {
      const target = questions.find(
        (q) => q.id === (action.questionId ?? question.id),
      )
      if (
        !['cards-up', 'selected'].includes(state.phase) ||
        !target?.choices.some((c) => c.id === action.choiceId)
      )
        return state
      const selections = { ...state.selections, [target.id]: action.choiceId }
      return {
        ...state,
        selections,
        selected: selections[question.id],
        phase: questions.every((q) => q.mode !== 'choice' || selections[q.id])
          ? 'selected'
          : 'cards-up',
      }
    }
    case 'DISCUSS':
      return state.phase === 'selected' ||
        (question.mode !== 'choice' && state.phase === 'cards-up')
        ? { ...state, phase: 'discussion' }
        : state
    case 'REVEAL': {
      if (state.phase !== 'discussion') return state
      const attempts = questions.map((q) => {
        const selected =
          state.selections[q.id] ??
          (q.id === question.id ? state.selected : undefined)
        const correctId = game.corrections[q.id]?.choiceId
        return {
          questionId: q.id,
          selected,
          correct:
            q.mode === 'choice' && correctId && selected
              ? selected === correctId
              : undefined,
        }
      })
      return {
        ...state,
        phase: 'revealed',
        history: [
          ...state.history.filter(
            (a) => !questions.some((q) => q.id === a.questionId),
          ),
          ...attempts,
        ],
      }
    }
    case 'ASSESS':
      return state.phase === 'revealed' && question.mode !== 'choice'
        ? {
            ...state,
            history: state.history.map((a) =>
              a.questionId === (action.questionId ?? question.id)
                ? { ...a, manual: action.value }
                : a,
            ),
          }
        : state
    case 'NEXT':
      if (state.phase !== 'revealed') return state
      return {
        ...state,
        index: Math.min(state.index + 1, count - 1),
        finished: state.index + 1 >= count,
        phase: 'thinking',
        selected: undefined,
        selections: {},
      }
    case 'PREVIOUS':
      return state.index > 0
        ? {
            ...state,
            index: state.index - 1,
            phase: 'thinking',
            selected: undefined,
            selections: {},
          }
        : state
    case 'SKIP':
      if (state.phase === 'revealed') return state
      return {
        ...state,
        history: [
          ...state.history.filter(
            (a) => !questions.some((q) => q.id === a.questionId),
          ),
          ...questions.map(
            (q) =>
              state.history.find(
                (a) => a.questionId === q.id && !a.skipped,
              ) ?? { questionId: q.id, skipped: true },
          ),
        ],
        index: Math.min(state.index + 1, count - 1),
        finished: state.index + 1 >= count,
        phase: 'thinking',
        selected: undefined,
        selections: {},
      }
    default:
      return state
  }
}

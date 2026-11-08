import type { Action, Game, Session } from './types'

export function startSession(game: Game): Session {
  return {
    gameId: game.id,
    index: 0,
    phase: 'thinking',
    paused: false,
    finished: false,
    history: [],
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
  const question = game.questions[state.index]
  if (!question) return state
  switch (action.type) {
    case 'CARDS_UP':
      return state.phase === 'thinking'
        ? { ...state, phase: 'cards-up' }
        : state
    case 'SELECT':
      return (state.phase === 'cards-up' || state.phase === 'selected') &&
        question.choices.some((c) => c.id === action.choiceId)
        ? { ...state, selected: action.choiceId, phase: 'selected' }
        : state
    case 'DISCUSS':
      return state.phase === 'selected' ||
        (question.mode !== 'choice' && state.phase === 'cards-up')
        ? { ...state, phase: 'discussion' }
        : state
    case 'REVEAL': {
      if (state.phase !== 'discussion') return state
      const correction = game.corrections[question.id]
      const attempt = {
        questionId: question.id,
        selected: state.selected,
        correct:
          question.mode === 'choice' && correction?.choiceId && state.selected
            ? state.selected === correction.choiceId
            : undefined,
      }
      return {
        ...state,
        phase: 'revealed',
        history: [
          ...state.history.filter((a) => a.questionId !== question.id),
          attempt,
        ],
      }
    }
    case 'ASSESS':
      return state.phase === 'revealed' && question.mode !== 'choice'
        ? {
            ...state,
            history: state.history.map((a) =>
              a.questionId === question.id ? { ...a, manual: action.value } : a,
            ),
          }
        : state
    case 'NEXT':
      if (state.phase !== 'revealed') return state
      return {
        ...state,
        index: Math.min(state.index + 1, game.questions.length - 1),
        finished: state.index + 1 >= game.questions.length,
        phase: 'thinking',
        selected: undefined,
      }
    case 'PREVIOUS':
      return state.index > 0
        ? {
            ...state,
            index: state.index - 1,
            phase: 'thinking',
            selected: undefined,
          }
        : state
    case 'SKIP':
      if (state.phase === 'revealed') return state
      return {
        ...state,
        history: state.history.some(
          (a) => a.questionId === question.id && !a.skipped,
        )
          ? state.history
          : [
              ...state.history.filter((a) => a.questionId !== question.id),
              { questionId: question.id, skipped: true },
            ],
        index: Math.min(state.index + 1, game.questions.length - 1),
        finished: state.index + 1 >= game.questions.length,
        phase: 'thinking',
        selected: undefined,
      }
    default:
      return state
  }
}

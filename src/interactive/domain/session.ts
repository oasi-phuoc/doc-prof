import type { Action, Game, Session, PlayMode } from './types'
import { questionsForRound, roundsFor } from './plan'
import { validateManualVote } from './votes'
import { retractionRemaining } from './teacher'

export function startSession(game: Game, mode: PlayMode = 'class'): Session {
  return {
    gameId: game.id,
    mode,
    index: 0,
    phase: 'thinking',
    paused: false,
    finished: false,
    history: [],
    selections: {},
    manualVotes: {},
    teacherMarks: {},
    note: '',
  }
}

/** Classe: teacher reveal only. Solo: selection or timeout reveals the answer. */
export function transition(
  game: Game,
  state: Session,
  action: Action,
  at?: number,
): Session {
  if (action.type === 'TEACHER_LOCK_SET') return state.mode === 'class' && !state.finished && typeof action.locked === 'boolean' && !!state.teacherLocked !== action.locked ? { ...state, teacherLocked: action.locked } : state
  if (state.teacherLocked) return state
  if (action.type === 'SESSION_NOTE_SET') return state.mode === 'class' && typeof action.note === 'string' && action.note.length <= 2000 && state.note !== action.note ? { ...state, note: action.note } : state
  if (action.type === 'TEACHER_MARK_SET') {
    const allowed = state.mode === 'class' && !state.paused && ['success', 'review', 'unassessed'].includes(action.value) &&
      game.questions.some((q) => q.id === action.questionId) &&
      (state.finished || state.phase === 'revealed' && questionsForRound(game, state.index).some((q) => q.id === action.questionId))
    return allowed && state.teacherMarks[action.questionId] !== action.value ? { ...state, teacherMarks: { ...state.teacherMarks, [action.questionId]: action.value } } : state
  }
  if (state.finished) return state
  if (action.type === 'FINISH') {
    if (state.mode !== 'class' || !game.questions.length) return state
    return {
      ...state, finished: true, paused: false, index: roundsFor(game).length - 1,
      phase: 'thinking', selected: undefined, selections: {}, revealedAt: undefined,
      history: game.questions.map((q) => state.history.find((attempt) => attempt.questionId === q.id) ?? { questionId: q.id, skipped: true }),
    }
  }
  if (action.type === 'PAUSE') return { ...state, paused: true }
  if (action.type === 'RESUME') return { ...state, paused: false }
  if (state.paused) return state
  const questions = questionsForRound(game, state.index)
  const question = questions[0]
  const count = roundsFor(game).length
  if (!question) return state
  switch (action.type) {
    case 'MANUAL_VOTE_SET': {
      if (state.mode !== 'class' || !['cards-up', 'selected', 'discussion', 'revealed'].includes(state.phase)) return state
      const target = questions.find((q) => q.id === action.questionId)
      if (!target) return state
      const validated = validateManualVote(target, action.vote)
      if (!validated.ok) return state
      const manualVotes = { ...state.manualVotes }
      if (validated.vote) manualVotes[target.id] = validated.vote
      else delete manualVotes[target.id]
      return { ...state, manualVotes }
    }
    case 'CARDS_UP':
      if (state.mode === 'solo') return state
      return state.phase === 'thinking'
        ? { ...state, phase: 'cards-up' }
        : state
    case 'SELECT': {
      const target = questions.find(
        (q) => q.id === (action.questionId ?? question.id),
      )
      if (
        state.mode !== 'solo' || state.phase !== 'thinking' ||
        !target?.choices.some((c) => c.id === action.choiceId)
      )
        return state
      const selections = { ...state.selections, [target.id]: action.choiceId }
      return revealRound(game, { ...state, selections, selected: selections[question.id] })
    }
    case 'TIMEOUT':
      return state.mode === 'solo' && state.phase === 'thinking' ? revealRound(game, state) : state
    case 'DISCUSS':
      return state.mode === 'class' && (state.phase === 'selected' ||
        state.phase === 'cards-up')
        ? { ...state, phase: 'discussion' }
        : state
    case 'REVEAL': {
      if (state.phase !== 'discussion') return state
      return revealRound(game, state, at)
    }
    case 'UNREVEAL': {
      if (state.mode !== 'class' || state.phase !== 'revealed' || action.roundId !== roundsFor(game)[state.index]?.id || at === undefined || retractionRemaining(state.revealedAt, at) <= 0) return state
      const retractions = { ...state.revealRetractions }
      for (const q of questions) retractions[q.id] = Math.min(Number.MAX_SAFE_INTEGER, (retractions[q.id] ?? 0) + 1)
      return { ...state, phase: 'discussion', revealedAt: undefined,
        history: state.history.filter((attempt) => !questions.some((q) => q.id === attempt.questionId)),
        revealRetractions: retractions }
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
        revealedAt: undefined,
      }
    case 'PREVIOUS':
      return state.index > 0
        ? {
            ...state,
            index: state.index - 1,
            phase: 'thinking',
            selected: undefined,
            selections: {},
            revealedAt: undefined,
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
        revealedAt: undefined,
      }
    default:
      return state
  }
}

function revealRound(game: Game, state: Session, at?: number): Session {
  const questions = questionsForRound(game, state.index)
  const attempts = questions.map((q) => {
    const selected = state.selections[q.id]
    const correctId = game.corrections[q.id]?.choiceId
    return {
      questionId: q.id, selected,
      correct: state.mode === 'solo' && q.mode === 'choice' && correctId ? selected === correctId : undefined,
    }
  })
  return { ...state, phase: 'revealed', revealedAt: state.mode === 'class' && at !== undefined && Number.isFinite(at) && at >= 0 ? at : undefined, history: [...state.history.filter((a) => !questions.some((q) => q.id === a.questionId)), ...attempts] }
}

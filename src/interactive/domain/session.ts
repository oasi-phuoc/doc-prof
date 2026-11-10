import type { Action, Game, Session, PlayMode } from './types'
import { questionsForRound, roundsFor } from './plan'
import { validateManualVote } from './votes'
import { retractionRemaining } from './teacher'
import { captureRound, navigateToRound, runtimeFor } from './round-runtime'

export function startSession(game: Game, mode: PlayMode = 'class'): Session {
  return captureRound(game, {
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
  })
}

/** Classe: teacher reveal only. Solo: selection or timeout reveals the answer. */
export function transition(
  game: Game,
  state: Session,
  action: Action,
  at?: number,
): Session {
  const next = reduce(game, state, action, at)
  return next === state ? state : captureRound(game, next)
}

function reduce(game: Game, state: Session, action: Action, at?: number): Session {
  if (action.roundId !== undefined && action.roundId !== roundsFor(game)[state.index]?.id) return state
  if (action.type === 'TEACHER_LOCK_SET') return state.mode === 'class' && !state.finished && typeof action.locked === 'boolean' && !!state.teacherLocked !== action.locked ? { ...state, teacherLocked: action.locked } : state
  if (state.teacherLocked) return state
  if (action.type === 'SESSION_NOTE_SET') return state.mode === 'class' && typeof action.note === 'string' && action.note.length <= 2000 && state.note !== action.note ? { ...state, note: action.note } : state
  if (action.type === 'TEACHER_MARK_SET') {
    const allowed = state.mode === 'class' && !state.paused && ['success', 'review', 'unassessed'].includes(action.value) &&
      game.questions.some((q) => q.id === action.questionId) &&
      (state.finished || state.phase === 'revealed' && questionsForRound(game, state.index).some((q) => q.id === action.questionId))
    return allowed && state.teacherMarks[action.questionId] !== action.value ? { ...state, teacherMarks: { ...state.teacherMarks, [action.questionId]: action.value } } : state
  }
  if (action.type === 'REOPEN') return state.finished && state.mode === 'class' ? navigateToRound(game, state, action.index) : state
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
  const roundId = roundsFor(game)[state.index]!.id
  const runtime = runtimeFor(game, state)
  const updateRuntime = (next: typeof runtime) => ({ ...state, roundStates: { ...state.roundStates, [roundId]: next } })
  switch (action.type) {
    case 'NAVIGATE':
      return navigateToRound(game, state, action.index)
    case 'HINT_SHOW': {
      const q = questions.find((entry) => entry.id === action.questionId)
      const count = runtime.hintsShown[action.questionId] ?? 0
      return !q || state.phase === 'thinking' || state.phase === 'revealed' || count >= (q.hints?.length ?? 0) ? state : updateRuntime({ ...runtime, hintsShown: { ...runtime.hintsShown, [q.id]: count + 1 } })
    }
    case 'IMAGE_ORDER_SET': {
      const q = questions.find((entry) => entry.id === action.questionId)
      if (!q || q.mode !== 'sequence' || state.phase === 'revealed' || !Array.isArray(action.order) || action.order.length !== q.images.length || new Set(action.order).size !== q.images.length || action.order.some((n) => !Number.isInteger(n) || n < 0 || n >= q.images.length)) return state
      return updateRuntime({ ...runtime, imageOrders: { ...runtime.imageOrders, [q.id]: [...action.order] } })
    }
    case 'AUDIO_STATE':
      return action.roundId !== roundId || !roundsFor(game)[state.index]?.audio || !['started', 'ended', 'override'].includes(action.status) ? state : updateRuntime({ ...runtime, audioComplete: action.status === 'ended', audioOverride: action.status === 'override' })
    case 'RETRY_QUESTION': {
      if (state.mode !== 'class' || action.roundId !== roundId || !['discussion', 'revealed'].includes(state.phase) || (state.previousAttempts?.length ?? 0) >= 5000) return state
      const ids = new Set(questions.map((q) => q.id))
      const previous = { roundId, attempt: runtime.attempt, results: state.history.filter((a) => ids.has(a.questionId)).map((a) => ({ ...a })), manualVotes: Object.fromEntries(Object.entries(state.manualVotes).filter(([id]) => ids.has(id)).map(([id, vote]) => [id, { ...vote, counts: { ...vote.counts } }])), teacherMarks: Object.fromEntries(Object.entries(state.teacherMarks).filter(([id]) => ids.has(id))) }
      return { ...state, phase: 'thinking', selections: {}, selected: undefined, revealedAt: undefined,
        history: state.history.filter((a) => !ids.has(a.questionId)),
        manualVotes: Object.fromEntries(Object.entries(state.manualVotes).filter(([id]) => !ids.has(id))), teacherMarks: Object.fromEntries(Object.entries(state.teacherMarks).filter(([id]) => !ids.has(id))),
        previousAttempts: [...state.previousAttempts ?? [], previous],
        roundStates: { ...state.roundStates, [roundId]: { phase: 'thinking', selections: {}, attempt: runtime.attempt + 1, hintsShown: {}, imageOrders: {}, audioComplete: false, audioOverride: false } } }
    }
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
      return state.index + 1 < count ? navigateToRound(game, state, state.index + 1) : { ...state, finished: true, phase: 'thinking', selected: undefined, selections: {}, revealedAt: undefined }
    case 'PREVIOUS':
      return state.index > 0 ? navigateToRound(game, state, state.index - 1) : state
    case 'SKIP':
      if (state.phase === 'revealed') return state
      return navigateAfterSkip(game, {
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
      })
    default:
      return state
  }
}

function navigateAfterSkip(game: Game, state: Session): Session {
  return state.index + 1 < roundsFor(game).length ? navigateToRound(game, state, state.index + 1) : { ...state, finished: true, phase: 'thinking', selected: undefined, selections: {}, revealedAt: undefined }
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

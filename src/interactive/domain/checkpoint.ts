import { questionsForRound, roundsFor } from './plan'
import { validateManualVote } from './votes'
import type { Game, PlayMode, Session, RoundRuntime } from './types'
import { copyRuntime, sequenceLength } from './round-runtime'
import { maxListensFor } from './listening'

export type SessionCheckpoint = { state: Session; lastEventId?: string }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const stateFields = ['gameId', 'mode', 'index', 'phase', 'selected', 'selections', 'paused', 'finished', 'history', 'manualVotes', 'teacherMarks', 'note', 'teacherLocked', 'revealedAt', 'revealRetractions', 'roundStates', 'previousAttempts']
const copyVotes = (votes: Session['manualVotes']) => Object.fromEntries(Object.entries(votes).map(([id, vote]) => [id, { ...vote, counts: { ...vote.counts } }]))
function validListening(value: Record<string, unknown>, questions: Game['questions'], mode: PlayMode, hasAudio: boolean): boolean {
  const maximum = maxListensFor(questions)
  const listens = value.audioListens ?? 0, extra = value.extraListens ?? 0
  return typeof listens === 'number' && Number.isInteger(listens) && listens >= 0 && listens <= 10_000 &&
    typeof extra === 'number' && Number.isInteger(extra) && extra >= 0 && extra <= 1000 &&
    (hasAudio || listens === 0 && extra === 0) && (mode === 'class' || extra === 0) &&
    (maximum === undefined ? extra === 0 : listens <= maximum + extra)
}

/** Copy only session data. No question text or answer key enters a checkpoint. */
export function copySession(state: Session): Session {
  return { gameId: state.gameId, mode: state.mode, index: state.index, phase: state.phase,
    ...('selected' in state ? { selected: state.selected } : {}), paused: state.paused, finished: state.finished, note: state.note,
    selections: { ...state.selections }, history: state.history.map((attempt) => ({ ...attempt })),
    manualVotes: copyVotes(state.manualVotes),
    teacherMarks: { ...state.teacherMarks },
    ...('teacherLocked' in state ? { teacherLocked: state.teacherLocked } : {}),
    ...('revealedAt' in state ? { revealedAt: state.revealedAt } : {}),
    ...(state.revealRetractions ? { revealRetractions: { ...state.revealRetractions } } : {}),
    ...(state.roundStates ? { roundStates: Object.fromEntries(Object.entries(state.roundStates).map(([id, runtime]) => [id, copyRuntime(runtime)])) } : {}),
    ...(state.previousAttempts ? { previousAttempts: state.previousAttempts.map((attempt) => ({ ...attempt, results: attempt.results.map((result) => ({ ...result })), manualVotes: copyVotes(attempt.manualVotes), teacherMarks: { ...attempt.teacherMarks } })) } : {}) }
}

function validAttempt(game: Game, value: unknown, mode: PlayMode, ids = game.questions.map((q) => q.id)): boolean {
  if (!object(value) || Object.keys(value).some((key) => !['questionId', 'selected', 'correct', 'skipped', 'manual'].includes(key)) || typeof value.questionId !== 'string' || !ids.includes(value.questionId)) return false
  const question = game.questions.find((q) => q.id === value.questionId)
  return !!question && !(value.selected !== undefined && (mode !== 'solo' || !question.choices.some((choice) => choice.id === value.selected)) ||
    value.correct !== undefined && (typeof value.correct !== 'boolean' || mode !== 'solo' || question.mode !== 'choice') ||
    value.skipped !== undefined && typeof value.skipped !== 'boolean' ||
    value.manual !== undefined && (question.mode === 'choice' || !['acquired', 'retry'].includes(value.manual as string)) ||
    value.skipped && (value.selected !== undefined || value.correct !== undefined || value.manual !== undefined))
}

function validRuntime(game: Game, id: string, value: unknown, mode: PlayMode): value is RoundRuntime {
  const round = roundsFor(game).find((round) => round.id === id)
  if (!round || !object(value) || Object.keys(value).some((key) => !['phase', 'selections', 'revealedAt', 'attempt', 'hintsShown', 'imageOrders', 'audioComplete', 'audioOverride', 'audioListens', 'extraListens'].includes(key)) ||
    !['thinking', 'cards-up', 'selected', 'discussion', 'revealed'].includes(value.phase as string) || !object(value.selections) || !object(value.hintsShown) || !object(value.imageOrders) ||
    typeof value.attempt !== 'number' || !Number.isInteger(value.attempt) || value.attempt < 0 || value.attempt > 5000 ||
    typeof value.audioComplete !== 'boolean' || typeof value.audioOverride !== 'boolean' || !round.audio && (value.audioComplete || value.audioOverride) ||
    value.revealedAt !== undefined && (mode !== 'class' || value.phase !== 'revealed' || typeof value.revealedAt !== 'number' || !Number.isFinite(value.revealedAt) || value.revealedAt < 0)) return false
  const questions = game.questions.filter((q) => round.questionIds.includes(q.id))
  if (!validListening(value, questions, mode, !!round.audio)) return false
  if (Object.entries(value.selections).some(([id, selected]) => mode !== 'solo' || !questions.some((q) => q.id === id && q.choices.some((choice) => choice.id === selected)))) return false
  if (Object.entries(value.hintsShown).some(([id, count]) => typeof count !== 'number' || !Number.isInteger(count) || count < 0 || !questions.some((q) => q.id === id && count <= (q.hints?.length ?? 0)))) return false
  if (Object.entries(value.imageOrders).some(([id, order]) => !questions.some((q) => q.id === id && q.mode === 'sequence' && Array.isArray(order) && order.length === sequenceLength(q) && new Set(order).size === order.length && order.every((n) => Number.isInteger(n) && n >= 0 && n < sequenceLength(q))))) return false
  return true
}

function validState(game: Game, raw: unknown, mode: PlayMode): raw is Session {
  if (!object(raw) || Object.keys(raw).some((key) => !stateFields.includes(key)) || raw.gameId !== game.id || raw.mode !== mode ||
    typeof raw.index !== 'number' || !Number.isInteger(raw.index) || raw.index < 0 || raw.index >= roundsFor(game).length ||
    !['thinking', 'cards-up', 'selected', 'discussion', 'revealed'].includes(raw.phase as string) ||
    typeof raw.paused !== 'boolean' || typeof raw.finished !== 'boolean' || typeof raw.note !== 'string' || raw.note.length > 2000 ||
    !object(raw.selections) || !object(raw.manualVotes) || !object(raw.teacherMarks) || !Array.isArray(raw.history) || raw.history.length > game.questions.length) return false
  const current = questionsForRound(game, raw.index)
  const history = raw.history
  const selections = raw.selections
  if (raw.teacherLocked !== undefined && (typeof raw.teacherLocked !== 'boolean' || mode !== 'class' || raw.finished && raw.teacherLocked) ||
    raw.revealedAt !== undefined && (mode !== 'class' || raw.phase !== 'revealed' || typeof raw.revealedAt !== 'number' || !Number.isFinite(raw.revealedAt) || raw.revealedAt < 0) ||
    raw.revealRetractions !== undefined && (mode !== 'class' || !object(raw.revealRetractions) || Object.entries(raw.revealRetractions).some(([id, count]) => !game.questions.some((q) => q.id === id) || typeof count !== 'number' || !Number.isSafeInteger(count) || count < 1))) return false
  if (Object.entries(selections).some(([id, selected]) => !current.some((q) => q.id === id && q.choices.some((choice) => choice.id === selected))) ||
    raw.selected !== selections[current[0]?.id ?? ''] ||
    mode === 'class' && (Object.keys(selections).length > 0 || raw.selected !== undefined)) return false
  const seen = new Set<string>()
  for (const attempt of history) {
    if (!object(attempt) || typeof attempt.questionId !== 'string' || seen.has(attempt.questionId) || !validAttempt(game, attempt, mode)) return false
    seen.add(attempt.questionId)
  }
  if (raw.finished && (raw.index !== roundsFor(game).length - 1 || raw.phase !== 'thinking' || raw.paused || seen.size !== game.questions.length)) return false
  if (raw.phase === 'revealed' && current.some((q) => !history.some((attempt) => attempt.questionId === q.id && !attempt.skipped))) return false
  for (const [id, vote] of Object.entries(raw.manualVotes)) {
    const question = game.questions.find((q) => q.id === id)
    if (!question || mode !== 'class') return false
    const validation = validateManualVote(question, vote)
    if (!validation.ok || !validation.vote) return false
  }
  if (Object.entries(raw.teacherMarks).some(([id, mark]) => mode !== 'class' || !game.questions.some((q) => q.id === id) || !['success', 'review', 'unassessed'].includes(mark as string))) return false
  if (raw.roundStates !== undefined) {
    if (!object(raw.roundStates) || Object.entries(raw.roundStates).some(([id, value]) => !validRuntime(game, id, value, mode))) return false
    for (const [id, value] of Object.entries(raw.roundStates)) {
      const runtime = value as RoundRuntime
      const ids = roundsFor(game).find((round) => round.id === id)!.questionIds
      if (runtime.phase === 'revealed' && ids.some((id) => !history.some((attempt) => object(attempt) && attempt.questionId === id && !attempt.skipped))) return false
      if (runtime.phase === 'revealed' && mode === 'solo' && ids.some((id) => history.find((attempt) => object(attempt) && attempt.questionId === id)?.selected !== runtime.selections[id])) return false
      if (!raw.finished && roundsFor(game)[raw.index]!.id === id && (runtime.phase !== raw.phase || runtime.revealedAt !== raw.revealedAt || Object.keys({ ...runtime.selections, ...selections }).some((id) => runtime.selections[id] !== selections[id]))) return false
    }
  }
  if (raw.previousAttempts !== undefined) {
    if (!Array.isArray(raw.previousAttempts) || raw.previousAttempts.length > 5000 || mode !== 'class') return false
    const previousByRound = new Map<string, number>()
    for (const attempt of raw.previousAttempts) {
      if (!object(attempt) || Object.keys(attempt).some((key) => !['roundId', 'attempt', 'results', 'manualVotes', 'teacherMarks', 'audioListens', 'extraListens'].includes(key)) || typeof attempt.roundId !== 'string' || attempt.attempt !== (previousByRound.get(attempt.roundId) ?? 0) || !Array.isArray(attempt.results) || !object(attempt.manualVotes) || !object(attempt.teacherMarks)) return false
      const round = roundsFor(game).find((round) => round.id === attempt.roundId)
      if (!round || !validListening(attempt, game.questions.filter((q) => round.questionIds.includes(q.id)), mode, !!round.audio) || attempt.results.length > round.questionIds.length || !attempt.results.every((result) => validAttempt(game, result, mode, round.questionIds)) || new Set(attempt.results.map((a) => a.questionId)).size !== attempt.results.length ||
        Object.entries(attempt.manualVotes).some(([id, vote]) => { if (!round.questionIds.includes(id)) return true; const checked = validateManualVote(game.questions.find((q) => q.id === id)!, vote); return !checked.ok || !checked.vote }) ||
        Object.entries(attempt.teacherMarks).some(([id, mark]) => !round.questionIds.includes(id) || !['success', 'review', 'unassessed'].includes(mark as string))) return false
      previousByRound.set(attempt.roundId, (attempt.attempt as number) + 1)
    }
    for (const [id, count] of previousByRound) if (!object(raw.roundStates) || (raw.roundStates[id] as RoundRuntime | undefined)?.attempt !== count) return false
    if (object(raw.roundStates) && Object.entries(raw.roundStates).some(([id, value]) => (value as RoundRuntime).attempt !== (previousByRound.get(id) ?? 0))) return false
  }
  if (raw.previousAttempts === undefined && object(raw.roundStates) && Object.values(raw.roundStates).some((value) => (value as RoundRuntime).attempt > 0)) return false
  return mode === 'class' || raw.note === ''
}

export function readCheckpoint(game: Game, value: unknown, mode: PlayMode): SessionCheckpoint | undefined {
  if (value === undefined) return undefined
  if (!object(value) || Object.keys(value).some((key) => !['state', 'lastEventId'].includes(key)) ||
    value.lastEventId !== undefined && (typeof value.lastEventId !== 'string' || !value.lastEventId || value.lastEventId.length > 128) || !validState(game, value.state, mode)) throw new Error('Instantané de séance invalide. La sauvegarde est conservée.')
  return { state: copySession(value.state), ...(value.lastEventId ? { lastEventId: value.lastEventId as string } : {}) }
}

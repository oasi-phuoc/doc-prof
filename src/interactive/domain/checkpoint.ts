import { questionsForRound, roundsFor } from './plan'
import { validateManualVote } from './votes'
import type { Game, PlayMode, Session } from './types'

export type SessionCheckpoint = { state: Session; lastEventId?: string }
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const stateFields = ['gameId', 'mode', 'index', 'phase', 'selected', 'selections', 'paused', 'finished', 'history', 'manualVotes', 'teacherMarks', 'note', 'teacherLocked', 'revealedAt', 'revealRetractions']

/** Copy only session data. No question text or answer key enters a checkpoint. */
export function copySession(state: Session): Session {
  return { gameId: state.gameId, mode: state.mode, index: state.index, phase: state.phase,
    ...('selected' in state ? { selected: state.selected } : {}), paused: state.paused, finished: state.finished, note: state.note,
    selections: { ...state.selections }, history: state.history.map((attempt) => ({ ...attempt })),
    manualVotes: Object.fromEntries(Object.entries(state.manualVotes).map(([id, vote]) => [id, { ...vote, counts: { ...vote.counts } }])),
    teacherMarks: { ...state.teacherMarks },
    ...('teacherLocked' in state ? { teacherLocked: state.teacherLocked } : {}),
    ...('revealedAt' in state ? { revealedAt: state.revealedAt } : {}),
    ...(state.revealRetractions ? { revealRetractions: { ...state.revealRetractions } } : {}) }
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
    if (!object(attempt) || Object.keys(attempt).some((key) => !['questionId', 'selected', 'correct', 'skipped', 'manual'].includes(key)) || typeof attempt.questionId !== 'string' || seen.has(attempt.questionId)) return false
    const question = game.questions.find((q) => q.id === attempt.questionId)
    if (!question || attempt.selected !== undefined && (mode !== 'solo' || !question.choices.some((choice) => choice.id === attempt.selected)) ||
      attempt.correct !== undefined && (typeof attempt.correct !== 'boolean' || mode !== 'solo' || question.mode !== 'choice') ||
      attempt.skipped !== undefined && typeof attempt.skipped !== 'boolean' ||
      attempt.manual !== undefined && (question.mode === 'choice' || !['acquired', 'retry'].includes(attempt.manual as string)) ||
      attempt.skipped && (attempt.selected !== undefined || attempt.correct !== undefined || attempt.manual !== undefined)) return false
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
  return mode === 'class' || raw.note === ''
}

export function readCheckpoint(game: Game, value: unknown, mode: PlayMode): SessionCheckpoint | undefined {
  if (value === undefined) return undefined
  if (!object(value) || Object.keys(value).some((key) => !['state', 'lastEventId'].includes(key)) ||
    value.lastEventId !== undefined && (typeof value.lastEventId !== 'string' || !value.lastEventId || value.lastEventId.length > 128) || !validState(game, value.state, mode)) throw new Error('Instantané de séance invalide. La sauvegarde est conservée.')
  return { state: copySession(value.state), ...(value.lastEventId ? { lastEventId: value.lastEventId as string } : {}) }
}

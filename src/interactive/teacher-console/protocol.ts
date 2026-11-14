import { PALETTE, defaultShapes, type ShapeId } from '../domain/palette'
import { roundsFor } from '../domain/plan'
import { questionsForAttempt, runtimeFor } from '../domain/round-runtime'
import { retractionRemaining, type ToolbarGuard } from '../domain/teacher'
import type { Action, Game, Phase, Session } from '../domain/types'

export const CONSOLE_PROTOCOL = 'clairfle.teacher-console.v1'
export const CONSOLE_HEARTBEAT_MS = 1000
export const CONSOLE_DISCONNECTED_MS = 4500
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export type ConsoleAddress = { session: string; token: string }
export function consoleAddress(hash: string): ConsoleAddress | undefined {
  const parts = hash.replace(/^#/, '').split('/')
  return parts.length === 2 && parts.every(part => UUID.test(part)) ? { session: parts[0]!, token: parts[1]! } : undefined
}
export const consoleChannel = ({ session, token }: ConsoleAddress) => `clairfle:teacher:${session}:${token}`
export type ConsoleCommand =
  | { name: 'cards-up' | 'discuss' | 'reveal' | 'reveal-start' | 'reveal-cancel' | 'confirm-cancel' | 'next' | 'pause' | 'resume' | 'lock' | 'unlock' | 'unreveal' | 'skip' | 'finish' | 'retry' }
  | { name: 'confirm-start'; action: 'skip' | 'finish' | 'retry' }
  | { name: 'navigate'; index: number }
  | { name: 'hint'; questionId: string }
  | { name: 'assess'; questionId: string; value: 'acquired' | 'retry' }
export type ConsoleRequest = { protocol: typeof CONSOLE_PROTOCOL; session: string; type: 'command'; id: string; revision: number; command: ConsoleCommand }
export type ConsoleView = { available: boolean; blocked: boolean; guard: ToolbarGuard; colors: string[]; shapes: ShapeId[] }
export type ConsoleQuestion = {
  id: string; prompt: string; instruction: string; context?: string; model: string; transcript?: string
  answer?: { letter: string; text: string; color: string; shape: ShapeId; image?: string }
  hints: string[]; shownHints: number; mode: 'choice' | 'oral' | 'sequence'; assessment?: 'acquired' | 'retry'
}
export type ConsoleSnapshot = {
  protocol: typeof CONSOLE_PROTOCOL; type: 'snapshot'; session: string; revision: number
  title: string; available: boolean; blocked: boolean; finished: boolean; paused: boolean; locked: boolean
  phase: Phase; guard: ToolbarGuard; progress: string; index: number; roundId?: string; attempt: number
  questions: ConsoleQuestion[]; navigation: { index: number; label: string; status: string }[]
  commands: ConsoleCommand['name'][]; remaining: number
}
export type ConsoleMessage = ConsoleSnapshot
  | { protocol: typeof CONSOLE_PROTOCOL; session: string; type: 'closed' }
  | { protocol: typeof CONSOLE_PROTOCOL; session: string; type: 'ack'; id: string; accepted: boolean; message?: string }
export const consoleEnvelope = (session: string) => ({ protocol: CONSOLE_PROTOCOL, session } as const)
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function validConsoleEnvelope(value: unknown, session: string): value is Record<string, unknown> {
  return record(value) && value.protocol === CONSOLE_PROTOCOL && value.session === session
}
/** Commands are a small protocol, never an arbitrary reducer action or replacement state. */
export function readConsoleRequest(value: unknown, session: string): ConsoleRequest | undefined {
  if (!validConsoleEnvelope(value, session) || value.type !== 'command' || typeof value.id !== 'string' || !UUID.test(value.id) || !Number.isSafeInteger(value.revision) || Number(value.revision) < 1 || !record(value.command)) return
  if (Object.keys(value).some(key => !['protocol', 'session', 'type', 'id', 'revision', 'command'].includes(key))) return
  const command = value.command
  if (typeof command.name !== 'string') return
  const simple = ['cards-up', 'discuss', 'reveal', 'reveal-start', 'reveal-cancel', 'confirm-cancel', 'next', 'pause', 'resume', 'lock', 'unlock', 'unreveal', 'skip', 'finish', 'retry']
  if (simple.includes(command.name) && Object.keys(command).length === 1) return value as ConsoleRequest
  if (command.name === 'confirm-start' && Object.keys(command).length === 2 && ['skip', 'finish', 'retry'].includes(String(command.action))) return value as ConsoleRequest
  const question = typeof command.questionId === 'string' && command.questionId.length > 0 && command.questionId.length <= 1000
  if (command.name === 'navigate' && Object.keys(command).length === 2 && Number.isSafeInteger(command.index) && Number(command.index) >= 0) return value as ConsoleRequest
  if (command.name === 'hint' && Object.keys(command).length === 2 && question) return value as ConsoleRequest
  if (command.name === 'assess' && Object.keys(command).length === 3 && question && ['acquired', 'retry'].includes(String(command.value))) return value as ConsoleRequest
}

/** Private DTO: this is sent only to the explicitly opened teacher window. */
export function teacherSnapshot(game: Game, state: Session, view: ConsoleView, session: string, revision: number, now: number): ConsoleSnapshot {
  const rounds = roundsFor(game), runtime = runtimeFor(game, state)
  const available = view.available && state.mode === 'class'
  const active = available && !state.finished
  const questions = active ? questionsForAttempt(game, state.index, runtime.attempt) : []
  const first = rounds.slice(0, state.index).reduce((n, round) => n + round.questionIds.length, 0) + 1
  const commands: ConsoleCommand['name'][] = []
  if (active && !view.blocked) {
    if (state.teacherLocked) commands.push('unlock')
    else {
      commands.push('lock', state.paused ? 'resume' : 'pause')
      if (!state.paused) {
        commands.push('navigate', 'finish', 'confirm-start')
        if (state.phase !== 'revealed') commands.push('skip')
        if (state.phase === 'thinking') commands.push('cards-up')
        if (state.phase === 'cards-up' || state.phase === 'selected') commands.push('discuss')
        if (state.phase === 'discussion') commands.push(view.guard === 'hold-to-reveal' ? 'reveal-start' : 'reveal')
        if (state.phase === 'revealed') commands.push('next')
        if (state.phase === 'revealed' && retractionRemaining(state.revealedAt, now) > 0) commands.push('unreveal')
        if (state.phase === 'discussion' || state.phase === 'revealed') commands.push('retry')
        if (state.phase !== 'thinking' && state.phase !== 'revealed' && questions.some(q => (runtime.hintsShown[q.id] ?? 0) < (q.hints?.length ?? 0))) commands.push('hint')
        if (state.phase === 'revealed' && questions.some(q => q.mode !== 'choice')) commands.push('assess')
      }
    }
  }
  return {
    ...consoleEnvelope(session), type: 'snapshot', revision, title: game.title, available, blocked: view.blocked,
    finished: state.finished, paused: state.paused, locked: !!state.teacherLocked, phase: state.phase, guard: view.guard,
    progress: questions.length > 1 ? `Questions ${first} et ${first + 1} / ${game.questions.length}` : `Question ${first} / ${game.questions.length}`,
    index: state.index, roundId: rounds[state.index]?.id, attempt: runtime.attempt, commands,
    remaining: game.questions.filter(q => !state.history.some(attempt => attempt.questionId === q.id && !attempt.skipped)).length,
    questions: questions.map((q, i) => {
      const correction = game.corrections[q.id], slot = q.choices.findIndex(c => c.id === correction?.choiceId)
      const offset = questions.length === 2 ? i * 3 : 0, choice = q.choices[slot], position = offset + slot
      return { id: q.id, prompt: q.prompt, instruction: q.instruction, context: q.context,
        model: correction?.text ?? 'Aucun corrigé fourni par la source.', transcript: correction?.transcript,
        ...(slot >= 0 && choice ? { answer: { letter: PALETTE[position]?.letter ?? '', text: choice.text, image: choice.image, color: view.colors[position] ?? PALETTE[position]?.color ?? '#ffffff', shape: view.shapes[position] ?? defaultShapes[position]! } } : {}),
        hints: [...q.hints ?? []], shownHints: runtime.hintsShown[q.id] ?? 0, mode: q.mode,
        assessment: state.history.find(attempt => attempt.questionId === q.id)?.manual,
      }
    }),
    navigation: available ? rounds.map((round, index) => ({ index, label: `${index + 1}. ${game.questions.find(q => q.id === round.questionIds[0])?.prompt ?? 'Question'}`, status: round.questionIds.every(id => state.history.some(attempt => attempt.questionId === id && !attempt.skipped)) ? 'Corrigée' : round.questionIds.some(id => state.history.some(attempt => attempt.questionId === id && attempt.skipped)) ? 'Passée' : 'À travailler' })) : [],
  }
}

export function consoleAction(command: ConsoleCommand, snapshot: ConsoleSnapshot): Action | undefined {
  if (!snapshot.commands.includes(command.name)) return
  const roundId = snapshot.roundId
  switch (command.name) {
    case 'cards-up': return { type: 'CARDS_UP', roundId }
    case 'discuss': return { type: 'DISCUSS', roundId }
    case 'reveal': return { type: 'REVEAL', roundId }
    case 'next': return { type: 'NEXT', roundId }
    case 'pause': return { type: 'PAUSE', roundId }
    case 'resume': return { type: 'RESUME', roundId }
    case 'lock': case 'unlock': return { type: 'TEACHER_LOCK_SET', locked: command.name === 'lock', roundId }
    case 'unreveal': return roundId ? { type: 'UNREVEAL', roundId } : undefined
    case 'skip': return { type: 'SKIP', roundId }
    case 'finish': return { type: 'FINISH', roundId }
    case 'retry': return roundId ? { type: 'RETRY_QUESTION', roundId } : undefined
    case 'navigate': return snapshot.navigation.some(q => q.index === command.index) ? { type: 'NAVIGATE', index: command.index, roundId } : undefined
    case 'hint': return snapshot.questions.some(q => q.id === command.questionId && q.shownHints < q.hints.length) ? { type: 'HINT_SHOW', questionId: command.questionId, roundId } : undefined
    case 'assess': return snapshot.questions.some(q => q.id === command.questionId && q.mode !== 'choice') ? { type: 'ASSESS', questionId: command.questionId, value: command.value, roundId } : undefined
  }
}

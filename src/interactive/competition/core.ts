import type { Game, Question } from '../domain/types'
import { PALETTE, defaultShapes, SHAPES, type ShapeId } from '../domain/palette'
import { validAvatar, type CompetitionAvatar } from './avatars'

export type CompetitionQuestion = Pick<Question, 'id' | 'prompt' | 'context' | 'audio' | 'images' | 'choices' | 'figure'>
export type CompetitionQuiz = { id: string; title: string; items: { question: CompetitionQuestion; correctChoiceId: string }[] }
export type CompetitionSettings = { enabled: boolean; seconds: number; feedbackSeconds: number; speedPoints: boolean }
export type CompetitionPhase = 'lobby' | 'handoff' | 'question' | 'correction' | 'finished'
type Answer = { questionId: string; choiceId?: string; elapsedMs: number }
export type CompetitionPlayer = { id: string; seat: number; avatarId: CompetitionAvatar; score: number; lastPoints: number; lastCorrect?: boolean; scoredThrough: number; answers: Answer[] }
export type CompetitionRoom = {
  version: 1; code: string; mode: 'online' | 'local'; quiz: CompetitionQuiz; settings: CompetitionSettings;
  colors: string[]; shapes: ShapeId[]; players: CompetitionPlayer[]; nextSeat: number;
  phase: CompetitionPhase; index: number; turn: number; paused: boolean; deadline?: number; remainingMs?: number;
  createdAt: number; expiresAt: number; revision: number;
}
export type CompetitionAction =
  | { type: 'join'; avatarId: CompetitionAvatar }
  | { type: 'remove'; playerId: string }
  | { type: 'start' | 'begin-turn' | 'tick' | 'pause' | 'resume' | 'next' | 'finish' }
  | { type: 'answer'; playerId: string; questionId: string; choiceId?: string }
export type RoomView = {
  code: string; title: string; mode: CompetitionRoom['mode']; phase: CompetitionPhase; index: number; total: number;
  paused: boolean; deadline?: number; remainingMs?: number; serverNow: number; revision: number;
  settings: CompetitionSettings; colors: string[]; shapes: ShapeId[]; question?: CompetitionQuestion; correctChoiceId?: string;
  turnPlayerId?: string; answered: number;
  players: { id: string; seat: number; avatarId: CompetitionAvatar; score: number; lastPoints: number; lastCorrect?: boolean; rank: number }[];
  self?: { id: string; answered: boolean; selected?: string; correct?: boolean; points?: number };
}
export class CompetitionError extends Error {
  status: number
  constructor(message: string, status = 409) { super(message); this.status = status }
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const string = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
export const ROOM_LIFETIME = 2 * 60 * 60 * 1000

export function competitionQuiz(game: Game, origin: string): CompetitionQuiz {
  const media = (value: string) => value.startsWith('/') ? new URL(value, origin).href : value
  return { id: game.id, title: game.title, items: game.questions.flatMap((q) => {
    const correctChoiceId = game.corrections[q.id]?.choiceId
    if (q.mode !== 'choice' || !correctChoiceId || !q.choices.some((choice) => choice.id === correctChoiceId)) return []
    return [{ correctChoiceId, question: { id: q.id, prompt: q.prompt, ...(q.context ? { context: q.context } : {}), ...(q.audio ? { audio: media(q.audio) } : {}),
      images: q.images.map(media), choices: q.choices.map((choice) => ({ id: choice.id, text: choice.text, ...(choice.image ? { image: media(choice.image) } : {}) })), ...(q.figure ? { figure: structuredClone(q.figure) } : {}) } }]
  }) }
}

/** Explicit public fields only: extra keys, including any student name, are never copied. */
export function parseCompetitionQuiz(value: unknown, mediaOrigins: string[] = []): CompetitionQuiz {
  if (!record(value) || !string(value.id, 160) || !string(value.title, 200) || !Array.isArray(value.items) || !value.items.length || value.items.length > 100) throw new CompetitionError('Choisissez entre 1 et 100 questions à réponse vérifiable.', 400)
  const media = (value: unknown): string => {
    if (typeof value !== 'string' || value.length > 250_000) throw new CompetitionError('Une image ou une piste est invalide.', 400)
    if (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(value)) return value
    let url: URL
    try { url = new URL(value) } catch { throw new CompetitionError('Un média doit avoir une adresse complète.', 400) }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || mediaOrigins.length && !mediaOrigins.includes(url.origin)) throw new CompetitionError('Cette origine de média n’est pas autorisée pour la salle.', 400)
    return url.href
  }
  const ids = new Set<string>()
  const items = value.items.map((entry, questionIndex) => {
    if (!record(entry) || !record(entry.question)) throw new CompetitionError('Question invalide.', 400)
    const q = entry.question
    if (!string(q.id, 160) || ids.has(q.id) || !string(q.prompt, 3000) || !Array.isArray(q.images) || q.images.length > 6 || !Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 6 || q.context !== undefined && !string(q.context, 30_000)) throw new CompetitionError('Question ou propositions invalides.', 400)
    ids.add(q.id)
    const choiceIds = new Set<string>()
    const originalChoiceIds: string[] = []
    const choices = q.choices.map((choice, choiceIndex) => {
      if (!record(choice) || !string(choice.id, 160) || choiceIds.has(choice.id) || typeof choice.text !== 'string' || choice.text.length > 2000 || !choice.text.trim() && !choice.image) throw new CompetitionError('Proposition invalide.', 400)
      choiceIds.add(choice.id)
      originalChoiceIds.push(choice.id)
      return { id: `c${choiceIndex}`, text: choice.text, ...(choice.image ? { image: media(choice.image) } : {}) }
    })
    if (typeof entry.correctChoiceId !== 'string' || !choiceIds.has(entry.correctChoiceId)) throw new CompetitionError('La bonne réponse n’est pas vérifiable.', 400)
    let figure: CompetitionQuestion['figure']
    if (q.figure !== undefined) {
      if (!record(q.figure) || !string(q.figure.type, 60) || q.figure.dims !== undefined && (!record(q.figure.dims) || Object.keys(q.figure.dims).length > 20 || Object.values(q.figure.dims).some((n) => typeof n !== 'number' || !Number.isFinite(n) || Math.abs(n) > 1e12))) throw new CompetitionError('Figure invalide.', 400)
      figure = { type: q.figure.type as NonNullable<CompetitionQuestion['figure']>['type'], ...(q.figure.dims ? { dims: { ...q.figure.dims as Record<string, number> } } : {}) }
    }
    return { correctChoiceId: `c${originalChoiceIds.indexOf(entry.correctChoiceId)}`, question: { id: `q${questionIndex + 1}`, prompt: q.prompt, images: q.images.map(media), choices, ...(q.context ? { context: q.context as string } : {}), ...(q.audio ? { audio: media(q.audio) } : {}), ...(figure ? { figure } : {}) } }
  })
  return { id: value.id, title: value.title, items }
}

export function parseCompetitionSettings(value: unknown): CompetitionSettings {
  if (!record(value) || typeof value.enabled !== 'boolean' || typeof value.speedPoints !== 'boolean' || !Number.isInteger(value.seconds) || Number(value.seconds) < 5 || Number(value.seconds) > 600 || !Number.isInteger(value.feedbackSeconds) || Number(value.feedbackSeconds) < 1 || Number(value.feedbackSeconds) > 10) throw new CompetitionError('Réglages de la compétition invalides.', 400)
  return { enabled: value.enabled, seconds: Number(value.seconds), feedbackSeconds: Number(value.feedbackSeconds), speedPoints: value.speedPoints }
}
export function createCompetition(quiz: CompetitionQuiz, settings: CompetitionSettings, mode: CompetitionRoom['mode'], code: string, now: number, colors: string[] = PALETTE.map((entry) => entry.color), shapes = defaultShapes): CompetitionRoom {
  if (!Array.isArray(colors) || colors.length !== 6 || colors.some((color) => typeof color !== 'string' || !/^#[0-9a-f]{6}$/i.test(color)) || !Array.isArray(shapes) || shapes.length !== 6 || shapes.some((shape) => !SHAPES.some((entry) => entry.id === shape))) throw new CompetitionError('Palette invalide.', 400)
  return { version: 1, code, mode, quiz: structuredClone(quiz), settings: parseCompetitionSettings(settings), colors: [...colors], shapes: [...shapes], players: [], nextSeat: 1,
    phase: 'lobby', index: 0, turn: 0, paused: false, createdAt: now, expiresAt: now + ROOM_LIFETIME, revision: 0 }
}
export function pointsFor(correct: boolean, elapsedMs: number, settings: CompetitionSettings): number {
  if (!correct) return 0
  return settings.enabled && settings.speedPoints ? 500 + Math.round(500 * (1 - clamp(elapsedMs / (settings.seconds * 1000), 0, 1))) : 1000
}
function startQuestion(room: CompetitionRoom, now: number) {
  room.turn = 0; room.paused = false; room.remainingMs = undefined
  room.phase = room.mode === 'local' ? 'handoff' : 'question'
  room.deadline = room.mode === 'online' && room.settings.enabled ? now + room.settings.seconds * 1000 : undefined
}
function correctQuestion(room: CompetitionRoom, now: number) {
  const item = room.quiz.items[room.index]!
  for (const player of room.players) {
    if (player.scoredThrough >= room.index) continue
    const answer = player.answers.find((answer) => answer.questionId === item.question.id)
    player.lastCorrect = answer?.choiceId === item.correctChoiceId
    player.lastPoints = pointsFor(player.lastCorrect, answer?.elapsedMs ?? room.settings.seconds * 1000, room.settings)
    player.score += player.lastPoints; player.scoredThrough = room.index
  }
  room.phase = 'correction'; room.paused = false; room.remainingMs = undefined; room.deadline = now + room.settings.feedbackSeconds * 1000
}
function answeredTurn(room: CompetitionRoom, now: number) {
  if (room.mode === 'local' && room.turn < room.players.length - 1) { room.turn++; room.phase = 'handoff'; room.deadline = undefined; room.paused = false }
  else correctQuestion(room, now)
}
function nextQuestion(room: CompetitionRoom, now: number) {
  if (room.index + 1 >= room.quiz.items.length) { room.phase = 'finished'; room.deadline = undefined; room.paused = false }
  else { room.index++; startQuestion(room, now) }
}
export function competitionStep(original: CompetitionRoom, action: CompetitionAction, now: number): CompetitionRoom {
  if (!Number.isFinite(now) || now < original.createdAt) throw new CompetitionError('Horloge invalide.', 400)
  if (now >= original.expiresAt) throw new CompetitionError('Cette salle a expiré. Créez une nouvelle partie.', 410)
  if (action.type === 'tick' && (original.paused || original.deadline === undefined || now < original.deadline)) return original
  const room = structuredClone(original)
  const currentId = room.quiz.items[room.index]!.question.id
  if (!room.paused && room.deadline !== undefined && now >= room.deadline) {
    if (room.phase === 'question') {
      if (room.mode === 'local') { room.players[room.turn]!.answers.push({ questionId: currentId, elapsedMs: room.settings.seconds * 1000 }); answeredTurn(room, now) }
      else correctQuestion(room, now)
    } else if (room.phase === 'correction') nextQuestion(room, now)
    room.revision++
  }
  const changedByClock = room.revision !== original.revision
  if (action.type === 'tick') return changedByClock ? room : original
  switch (action.type) {
    case 'join': {
      if (room.phase !== 'lobby') throw new CompetitionError('La partie a commencé. Rejoignez la prochaine salle.')
      if (!validAvatar(action.avatarId)) throw new CompetitionError('Choisissez une mascotte proposée.', 400)
      if (room.players.length >= 60 || room.nextSeat > 240) throw new CompetitionError('Cette salle est complète.')
      const seat = room.nextSeat++
      room.players.push({ id: `p${seat}`, seat, avatarId: action.avatarId, score: 0, lastPoints: 0, scoredThrough: -1, answers: [] }); break
    }
    case 'remove': {
      if (room.phase !== 'lobby') throw new CompetitionError('Les joueurs sont fixés après le départ.')
      room.players = room.players.filter((player) => player.id !== action.playerId); break
    }
    case 'start':
      if (room.phase !== 'lobby' || !room.players.length) throw new CompetitionError('Ajoutez au moins un joueur avant de commencer.')
      startQuestion(room, now); break
    case 'begin-turn':
      if (room.mode !== 'local' || room.phase !== 'handoff') throw new CompetitionError('Ce tour n’est pas disponible.')
      room.phase = 'question'; room.deadline = room.settings.enabled ? now + room.settings.seconds * 1000 : undefined; break
    case 'answer': {
      const player = room.players.find((player) => player.id === action.playerId)
      if (!player) throw new CompetitionError('Joueur introuvable.', 401)
      const previous = player.answers.find((answer) => answer.questionId === action.questionId)
      if (previous) {
        if (previous.choiceId === action.choiceId) return changedByClock ? room : original
        throw new CompetitionError('La réponse est déjà envoyée.')
      }
      if (room.phase !== 'question' || room.paused || action.questionId !== currentId || room.mode === 'local' && room.players[room.turn]?.id !== player.id) throw new CompetitionError('Le temps de réponse est terminé ou en pause.')
      if (action.choiceId === undefined && room.mode !== 'local' || action.choiceId !== undefined && !room.quiz.items[room.index]!.question.choices.some((choice) => choice.id === action.choiceId)) throw new CompetitionError('Cette réponse n’est pas proposée.', 400)
      const elapsedMs = room.settings.enabled && room.deadline !== undefined ? room.settings.seconds * 1000 - clamp(room.deadline - now, 0, room.settings.seconds * 1000) : 0
      player.answers.push({ questionId: currentId, ...(action.choiceId !== undefined ? { choiceId: action.choiceId } : {}), elapsedMs })
      if (room.mode === 'local') answeredTurn(room, now)
      else if (room.players.every((player) => player.answers.some((answer) => answer.questionId === currentId))) correctQuestion(room, now)
      break
    }
    case 'pause':
      if (!['question', 'correction'].includes(room.phase) || room.paused) return changedByClock ? room : original
      room.remainingMs = room.deadline === undefined ? undefined : Math.max(0, room.deadline - now); room.deadline = undefined; room.paused = true; break
    case 'resume':
      if (!room.paused) return changedByClock ? room : original
      room.deadline = room.remainingMs === undefined ? undefined : now + room.remainingMs; room.remainingMs = undefined; room.paused = false; break
    case 'next':
      if (room.paused) throw new CompetitionError('Reprenez la compétition pour continuer.')
      if (room.phase === 'question') correctQuestion(room, now)
      else if (room.phase === 'correction') nextQuestion(room, now)
      else throw new CompetitionError('Cette étape n’est pas disponible.')
      break
    case 'finish':
      if (room.phase === 'question' || room.phase === 'handoff') correctQuestion(room, now)
      room.phase = 'finished'; room.deadline = undefined; room.paused = false; break
  }
  room.revision++
  return room
}

/** A learner gets this view only: no future question, answer key or other vote. */
export function competitionView(room: CompetitionRoom, now: number, playerId?: string): RoomView {
  const item = room.quiz.items[room.index]!, revealed = room.phase === 'correction'
  const ranked = [...room.players].sort((a, b) => b.score - a.score || a.seat - b.seat)
  const players = ranked.map((player, index) => ({ id: player.id, seat: player.seat, avatarId: player.avatarId, score: player.score, lastPoints: player.lastPoints,
    ...(revealed || room.phase === 'finished' ? { lastCorrect: player.lastCorrect } : {}), rank: ranked.findIndex((other) => other.score === player.score) + 1 || index + 1 }))
  const self = room.players.find((player) => player.id === playerId)
  const answer = self?.answers.find((answer) => answer.questionId === item.question.id)
  return { code: room.code, title: room.quiz.title, mode: room.mode, phase: room.phase, index: room.index, total: room.quiz.items.length,
    paused: room.paused, deadline: room.deadline, remainingMs: room.remainingMs, serverNow: now, revision: room.revision, settings: { ...room.settings }, colors: [...room.colors], shapes: [...room.shapes],
    ...(['question', 'correction'].includes(room.phase) ? { question: structuredClone(item.question) } : {}), ...(revealed ? { correctChoiceId: item.correctChoiceId } : {}),
    ...(room.mode === 'local' ? { turnPlayerId: room.players[room.turn]?.id } : {}), answered: room.players.filter((player) => player.answers.some((answer) => answer.questionId === item.question.id)).length, players,
    ...(self ? { self: { id: self.id, answered: !!answer, ...(answer?.choiceId ? { selected: answer.choiceId } : {}), ...(revealed ? { correct: self.lastCorrect, points: self.lastPoints } : {}) } } : {}) }
}

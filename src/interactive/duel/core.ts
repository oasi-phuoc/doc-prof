import { createRng, shuffle } from '@/math/rng'
import { hash } from '../domain/seeds'
import { validAvatar, type CompetitionAvatar } from '../competition/avatars'
import type { CompetitionQuiz } from '../competition/core'
import type { TimerSettings } from '../domain/settings'

export type Side = 'left' | 'right'
export type DuelMode = 'duel' | 'teams'
export type DuelConfig = { mode: DuelMode; seed: number; left: CompetitionAvatar[]; right: CompetitionAvatar[] }
export type Fighter = { avatarId: CompetitionAvatar; seat: number }
export type DuelPair = { left: Fighter; right: Fighter }
export type DuelPhase = 'ready' | 'question' | 'feedback' | 'finished'
export type DuelResolution = { at: number; side?: Side; choiceId?: string; correct?: boolean; victim?: Side; damage: number; critical: boolean; winner?: Side }
export type DuelState = {
  version: 1; quizId: string; config: DuelConfig; timer: TimerSettings; pairs: DuelPair[];
  pairIndex: number; turn: number; phase: DuelPhase; hp: Record<Side, number>; wins: Record<Side, number>;
  results: { pairIndex: number; winner: Side; hp: Record<Side, number> }[];
  resolution?: DuelResolution; paused: boolean; deadline?: number; remainingMs?: number;
  createdAt: number; revision: number; aborted?: boolean;
}
export type DuelAction =
  | { type: 'start'; pairIndex: number }
  | { type: 'answer'; roundId: string; side: Side; choiceId: string }
  | { type: 'pause' | 'resume'; roundId: string; phase: DuelPhase }
  | { type: 'tick' | 'finish' }
export const CRITICAL_CHANCE = .25
export const DUEL_LIFETIME = 24 * 60 * 60 * 1000
export const otherSide = (side: Side): Side => side === 'left' ? 'right' : 'left'
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

export function parseDuelConfig(value: unknown): DuelConfig {
  if (!object(value) || Object.keys(value).some(key => !['mode', 'seed', 'left', 'right'].includes(key)) || !['duel', 'teams'].includes(value.mode as string) || !Number.isSafeInteger(value.seed) || Number(value.seed) < 0 || Number(value.seed) > 0xffffffff || !Array.isArray(value.left) || !Array.isArray(value.right) || value.left.length < 1 || value.left.length > 30 || value.left.length !== value.right.length || value.mode === 'duel' && value.left.length !== 1 || [...value.left, ...value.right].some(avatar => !validAvatar(avatar))) throw new Error('Choisissez le même nombre de mascottes dans les deux équipes, sans nom ni pseudo.')
  return { mode: value.mode as DuelMode, seed: Number(value.seed), left: [...value.left] as CompetitionAvatar[], right: [...value.right] as CompetitionAvatar[] }
}
export function parseDuelTimer(value: unknown): TimerSettings {
  if (!object(value) || Object.keys(value).some(key => !['enabled', 'seconds', 'feedbackSeconds'].includes(key)) || typeof value.enabled !== 'boolean' || !Number.isInteger(value.seconds) || Number(value.seconds) < 5 || Number(value.seconds) > 600 || !Number.isInteger(value.feedbackSeconds) || Number(value.feedbackSeconds) < 1 || Number(value.feedbackSeconds) > 10) throw new Error('Minuteur du duel invalide.')
  return { enabled: value.enabled, seconds: Number(value.seconds), feedbackSeconds: Number(value.feedbackSeconds) }
}
export function duelPairs(config: DuelConfig): DuelPair[] {
  const team = (side: Side) => config[side].map((avatarId, index) => ({ avatarId, seat: index + 1 }))
  const left = config.mode === 'teams' ? shuffle(createRng(hash(`${config.seed}:left-pairs`)), team('left')) : team('left')
  const right = config.mode === 'teams' ? shuffle(createRng(hash(`${config.seed}:right-pairs`)), team('right')) : team('right')
  return left.map((fighter, index) => ({ left: fighter, right: right[index]! }))
}
export const duelRoundId = (state: DuelState) => `${state.config.seed}:${state.pairIndex}:${state.turn}`
export function duelRound(quiz: CompetitionQuiz, state: DuelState) {
  const cycle = Math.floor(state.turn / quiz.items.length)
  const order = shuffle(createRng(hash(`${state.config.seed}:${state.pairIndex}:${cycle}:questions`)), quiz.items.map((_, index) => index))
  const item = quiz.items[order[state.turn % quiz.items.length]!]!
  const critical = createRng(hash(`${state.config.seed}:${state.pairIndex}:${state.turn}:critical`))() < CRITICAL_CHANCE
  return { id: duelRoundId(state), item, critical, damage: critical ? 20 : 10 }
}
export function createDuel(quiz: CompetitionQuiz, config: DuelConfig, timer: TimerSettings, at: number): DuelState {
  if (!Number.isFinite(at) || at < 0 || !quiz.items.length || quiz.items.length > 100 || quiz.items.some(item => !item.question.choices.some(choice => choice.id === item.correctChoiceId))) throw new Error('Le duel demande des questions à réponse vérifiée.')
  const checked = parseDuelConfig(config)
  return { version: 1, quizId: quiz.id, config: checked, timer: parseDuelTimer(timer), pairs: duelPairs(checked), pairIndex: 0, turn: 0, phase: 'ready', hp: { left: 100, right: 100 }, wins: { left: 0, right: 0 }, results: [], paused: false, createdAt: at, revision: 0 }
}
export function isDuelAction(value: unknown): value is DuelAction {
  if (!object(value) || typeof value.type !== 'string') return false
  const only = (keys: string[]) => Object.keys(value).every(key => keys.includes(key))
  if (value.type === 'start') return only(['type', 'pairIndex']) && Number.isInteger(value.pairIndex) && Number(value.pairIndex) >= 0 && Number(value.pairIndex) < 30
  if (value.type === 'answer') return only(['type', 'roundId', 'side', 'choiceId']) && typeof value.roundId === 'string' && value.roundId.length <= 100 && ['left', 'right'].includes(value.side as string) && typeof value.choiceId === 'string' && value.choiceId.length > 0 && value.choiceId.length <= 160
  if (value.type === 'pause' || value.type === 'resume') return only(['type', 'roundId', 'phase']) && typeof value.roundId === 'string' && value.roundId.length <= 100 && ['ready', 'question', 'feedback', 'finished'].includes(value.phase as string)
  return only(['type']) && ['tick', 'finish'].includes(value.type)
}
function beginQuestion(state: DuelState, at: number) {
  state.phase = 'question'; state.paused = false; delete state.remainingMs; delete state.resolution
  state.deadline = state.timer.enabled ? at + state.timer.seconds * 1000 : undefined
}
function feedback(state: DuelState, resolution: DuelResolution, at: number) {
  state.phase = 'feedback'; state.resolution = resolution; state.deadline = at + state.timer.feedbackSeconds * 1000; state.paused = false; delete state.remainingMs
}
function advance(state: DuelState, at: number) {
  if (state.resolution?.winner) {
    if (state.pairIndex + 1 >= state.pairs.length) { state.phase = 'finished'; delete state.deadline }
    else { state.pairIndex++; state.turn = 0; state.phase = 'ready'; state.hp = { left: 100, right: 100 }; delete state.deadline; delete state.resolution }
  } else { state.turn++; beginQuestion(state, at) }
}
/** One accepted answer resolves the whole turn. A stale second click cannot
 * apply damage to either the same turn or a subsequent question. */
export function stepDuel(quiz: CompetitionQuiz, original: DuelState, action: DuelAction, at: number): DuelState {
  if (!isDuelAction(action) || !Number.isFinite(at) || at < original.createdAt || at >= original.createdAt + DUEL_LIFETIME || original.quizId !== quiz.id) throw new Error('Action ou reprise du duel invalide.')
  const state = structuredClone(original)
  let changed = false
  if (!state.paused && state.deadline !== undefined && at >= state.deadline) {
    if (state.phase === 'question') feedback(state, { at, damage: 0, critical: duelRound(quiz, state).critical }, at)
    else if (state.phase === 'feedback') advance(state, at)
    changed = true
  }
  const done = () => { if (!changed) return original; state.revision++; return state }
  switch (action.type) {
    case 'tick': return done()
    case 'start':
      if (state.phase !== 'ready' || action.pairIndex !== state.pairIndex) return done()
      beginQuestion(state, at); changed = true; break
    case 'answer': {
      if (state.phase !== 'question' || state.paused || action.roundId !== duelRoundId(state)) return done()
      const round = duelRound(quiz, state)
      if (!round.item.question.choices.some(choice => choice.id === action.choiceId)) throw new Error('Cette carte n’est pas proposée.')
      const correct = action.choiceId === round.item.correctChoiceId, victim = correct ? otherSide(action.side) : action.side
      state.hp[victim] = Math.max(0, state.hp[victim] - round.damage)
      const winner = state.hp[victim] === 0 ? otherSide(victim) : undefined
      if (winner) { state.wins[winner]++; state.results.push({ pairIndex: state.pairIndex, winner, hp: { ...state.hp } }) }
      feedback(state, { at, side: action.side, choiceId: action.choiceId, correct, victim, damage: round.damage, critical: round.critical, ...(winner ? { winner } : {}) }, at)
      changed = true; break
    }
    case 'pause':
      if (state.paused || !['question', 'feedback'].includes(state.phase) || action.roundId !== duelRoundId(state) || action.phase !== state.phase) return done()
      state.remainingMs = state.deadline === undefined ? undefined : Math.max(0, state.deadline - at); delete state.deadline; state.paused = true; changed = true; break
    case 'resume':
      if (!state.paused || action.roundId !== duelRoundId(state) || action.phase !== state.phase) return done()
      state.deadline = state.remainingMs === undefined ? undefined : at + state.remainingMs; delete state.remainingMs; state.paused = false; changed = true; break
    case 'finish':
      if (state.phase === 'finished') return done()
      state.aborted = state.results.length < state.pairs.length; state.phase = 'finished'; state.paused = false; delete state.deadline; delete state.remainingMs; changed = true; break
  }
  return done()
}

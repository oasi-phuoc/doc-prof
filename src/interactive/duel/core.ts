import { createRng, shuffle } from '@/math/rng'
import { hash } from '../domain/seeds'
import { validAvatar, type CompetitionAvatar } from '../competition/avatars'
import type { CompetitionQuiz } from '../competition/core'
import type { TimerSettings } from '../domain/settings'
import { validEffects, type DuelEffects } from './effects'
import {feedbackDuration} from './vfx/catalog'
import {parseDuelRules,LEGACY_DUEL_RULES,type DuelRules} from './rules'

export type Side = 'left' | 'right'
export type DuelMode = 'duel' | 'teams'
export type DuelConfig = { mode: DuelMode; seed: number; left: CompetitionAvatar[]; right: CompetitionAvatar[]; effects?:DuelEffects;combat?:DuelRules }
export type Fighter = { avatarId: CompetitionAvatar; seat: number }
export type DuelPair = { left: Fighter; right: Fighter }
export type DuelPhase = 'ready' | 'question' | 'feedback' | 'finished'
export type DamageMultiplier = 1 | 2 | 3 | 4
export type DuelResolution = { at: number; side?: Side; choiceId?: string; correct?: boolean; victim?: Side; damage: number; critical: boolean; multiplier?: DamageMultiplier; timeout?: boolean; winner?: Side; draw?: true;previousHp?:Record<Side,number> }
export type DuelState = {
  version: 2|3|4; quizId: string; config: DuelConfig; timer: TimerSettings; pairs: DuelPair[];
  pairIndex: number; turn: number; phase: DuelPhase; hp: Record<Side, number>; wins: Record<Side, number>;
  results: { pairIndex: number; winner?: Side; draw?: true; hp: Record<Side, number> }[];
  resolution?: DuelResolution; paused: boolean; deadline?: number; remainingMs?: number;
  createdAt: number; revision: number; aborted?: boolean;
}
export type DuelAction =
  | { type: 'start'; pairIndex: number }
  | { type: 'reshuffle'; pairIndex: number; seed: number }
  | { type: 'answer'; roundId: string; side: Side; choiceId: string }
  | { type: 'pause' | 'resume'; roundId: string; phase: DuelPhase }
  | { type: 'tick' | 'finish' }
export const CRITICAL_CHANCE = .25
export const SUPER_CRITICAL_CHANCE = .10
export const DUEL_LIFETIME = 24 * 60 * 60 * 1000
export const otherSide = (side: Side): Side => side === 'left' ? 'right' : 'left'
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

export function parseDuelConfig(value: unknown): DuelConfig {
  if (!object(value) || Object.keys(value).some(key => !['mode', 'seed', 'left', 'right', 'effects','combat'].includes(key)) || !['duel', 'teams'].includes(value.mode as string) || !Number.isSafeInteger(value.seed) || Number(value.seed) < 0 || Number(value.seed) > 0xffffffff || !Array.isArray(value.left) || !Array.isArray(value.right) || value.left.length < 1 || value.left.length > 15 || value.left.length !== value.right.length || value.mode === 'duel' && value.left.length !== 1 || [...value.left, ...value.right].some(avatar => !validAvatar(avatar)) || new Set([...value.left,...value.right]).size!==value.left.length+value.right.length || value.effects!==undefined&&!validEffects(value.effects)) throw new Error('Choisissez autant de mascottes dans chaque équipe, avec une mascotte différente par joueur (15 par équipe au maximum).')
  return { mode: value.mode as DuelMode, seed: Number(value.seed), left: [...value.left] as CompetitionAvatar[], right: [...value.right] as CompetitionAvatar[], ...(value.effects!==undefined?{effects:{...value.effects as DuelEffects}}:{}),...(value.combat!==undefined?{combat:parseDuelRules(value.combat)}:{}) }
}
export const duelRules=(config:DuelConfig)=>config.combat??LEGACY_DUEL_RULES
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
/** A new draw changes the visible schedule when at least two matches exist. */
export function nextDuelSeed(config:DuelConfig,draw:number):number {
  const previous=JSON.stringify(duelPairs(config));let seed=draw>>>0
  for(let attempt=0;attempt<1024;attempt++,seed=(seed+1)>>>0)if(seed!==config.seed&&(config.left.length<2||JSON.stringify(duelPairs({...config,seed}))!==previous))return seed
  throw new Error('Le tirage des matchs est indisponible.')
}
function reshuffleRemaining(state:DuelState,seed:number) {
  const remaining=state.pairs.slice(state.pairIndex)
  const left=shuffle(createRng(hash(`${seed}:left-remaining`)),remaining.map(pair=>pair.left))
  const right=shuffle(createRng(hash(`${seed}:right-remaining`)),remaining.map(pair=>pair.right))
  let pairs=left.map((fighter,index)=>({left:fighter,right:right[index]!}))
  if(JSON.stringify(pairs)===JSON.stringify(remaining))pairs=[...pairs.slice(1),pairs[0]!]
  state.pairs=[...state.pairs.slice(0,state.pairIndex),...pairs];state.config.seed=seed
}
export const duelRoundId = (state: DuelState) => `${state.config.seed}:${state.pairIndex}:${state.turn}`
export function duelRound(quiz: CompetitionQuiz, state: DuelState) {
  const cycle = Math.floor(state.turn / quiz.items.length)
  const order = shuffle(createRng(hash(`${state.config.seed}:${state.pairIndex}:${cycle}:questions`)), quiz.items.map((_, index) => index))
  const item = quiz.items[order[state.turn % quiz.items.length]!]!
  const roll = createRng(hash(`${state.config.seed}:${state.pairIndex}:${state.turn}:critical`))()
  const rules=duelRules(state.config),quad=rules.critical4/100,triple=rules.critical3/100,double=rules.critical2/100
  const multiplier:DamageMultiplier=roll<quad?4:roll<quad+triple?3:roll<quad+triple+double?2:1
  return { id: duelRoundId(state), item, critical:multiplier>1, multiplier, damage:10*multiplier }
}
export function createDuel(quiz: CompetitionQuiz, config: DuelConfig, timer: TimerSettings, at: number,version:2|3|4=config.combat?4:3): DuelState {
  if (!Number.isFinite(at) || at < 0 || !quiz.items.length || quiz.items.length > 100 || quiz.items.some(item => !item.question.choices.some(choice => choice.id === item.correctChoiceId))) throw new Error('Le duel demande des questions à réponse vérifiée.')
  const checked = parseDuelConfig(config)
  if(version<4&&checked.combat||version===4&&!checked.combat)throw new Error('La version de la partie ne correspond pas aux paramètres de combat.')
  const maxHp=duelRules(checked).maxHp
  return { version, quizId: quiz.id, config: checked, timer: parseDuelTimer(timer), pairs: duelPairs(checked), pairIndex: 0, turn: 0, phase: 'ready', hp: { left: maxHp, right: maxHp }, wins: { left: 0, right: 0 }, results: [], paused: false, createdAt: at, revision: 0 }
}
export function isDuelAction(value: unknown): value is DuelAction {
  if (!object(value) || typeof value.type !== 'string') return false
  const only = (keys: string[]) => Object.keys(value).every(key => keys.includes(key))
  if (value.type === 'start') return only(['type', 'pairIndex']) && Number.isInteger(value.pairIndex) && Number(value.pairIndex) >= 0 && Number(value.pairIndex) < 30
  if(value.type==='reshuffle')return only(['type','pairIndex','seed'])&&Number.isInteger(value.pairIndex)&&Number(value.pairIndex)>=0&&Number(value.pairIndex)<15&&Number.isSafeInteger(value.seed)&&Number(value.seed)>=0&&Number(value.seed)<=0xffffffff
  if (value.type === 'answer') return only(['type', 'roundId', 'side', 'choiceId']) && typeof value.roundId === 'string' && value.roundId.length <= 100 && ['left', 'right'].includes(value.side as string) && typeof value.choiceId === 'string' && value.choiceId.length > 0 && value.choiceId.length <= 160
  if (value.type === 'pause' || value.type === 'resume') return only(['type', 'roundId', 'phase']) && typeof value.roundId === 'string' && value.roundId.length <= 100 && ['ready', 'question', 'feedback', 'finished'].includes(value.phase as string)
  return only(['type']) && ['tick', 'finish'].includes(value.type)
}
function beginQuestion(state: DuelState, at: number) {
  state.phase = 'question'; state.paused = false; delete state.remainingMs; delete state.resolution
  state.deadline = state.timer.enabled ? at + state.timer.seconds * 1000 : undefined
}
function feedback(state: DuelState, resolution: DuelResolution, at: number) {
  const id=state.pairs[state.pairIndex]![resolution.side??'left'].avatarId
  const duration=state.version===2?state.timer.feedbackSeconds*1000:feedbackDuration(state.timer.feedbackSeconds,id,resolution.multiplier??1,resolution.timeout)
  state.phase = 'feedback'; state.resolution = resolution; state.deadline = at + duration; state.paused = false; delete state.remainingMs
}
function advance(state: DuelState, at: number) {
  if (state.resolution?.winner||state.resolution?.draw) {
    if (state.pairIndex + 1 >= state.pairs.length) { state.phase = 'finished'; delete state.deadline }
    else { const maxHp=duelRules(state.config).maxHp;state.pairIndex++; state.turn = 0; state.phase = 'ready'; state.hp = { left: maxHp, right: maxHp }; delete state.deadline; delete state.resolution }
  } else { state.turn++; beginQuestion(state, at) }
}
function pairResult(state:DuelState):{winner?:Side;draw?:true} {
  const draw=state.hp.left===0&&state.hp.right===0,winner:Side|undefined=draw?undefined:state.hp.left===0?'right':state.hp.right===0?'left':undefined
  if(winner)state.wins[winner]++
  if(winner||draw)state.results.push({pairIndex:state.pairIndex,...(winner?{winner}:{draw:true as const}),hp:{...state.hp}})
  return winner?{winner}:draw?{draw:true}:{}
}
/** One accepted answer resolves the whole turn. A stale second click cannot
 * apply damage to either the same turn or a subsequent question. */
export function stepDuel(quiz: CompetitionQuiz, original: DuelState, action: DuelAction, at: number): DuelState {
  if (!isDuelAction(action) || !Number.isFinite(at) || at < original.createdAt || at >= original.createdAt + DUEL_LIFETIME || original.quizId !== quiz.id) throw new Error('Action ou reprise du duel invalide.')
  const state = structuredClone(original)
  let changed = false
  if (!state.paused && state.deadline !== undefined && at >= state.deadline) {
    if (state.phase === 'question') {
      const previousHp={...state.hp}
      state.hp.left=Math.max(0,state.hp.left-10);state.hp.right=Math.max(0,state.hp.right-10)
      feedback(state,{at,damage:10,critical:false,multiplier:1,timeout:true,...(state.version===4?{previousHp}:{}),...pairResult(state)},at)
    }
    else if (state.phase === 'feedback') advance(state, at)
    changed = true
  }
  const done = () => { if (!changed) return original; state.revision++; return state }
  switch (action.type) {
    case 'tick': return done()
    case 'start':
      if (state.phase !== 'ready' || action.pairIndex !== state.pairIndex) return done()
      beginQuestion(state, at); changed = true; break
    case 'reshuffle':
      if(state.phase!=='ready'||state.config.mode!=='teams'||action.pairIndex!==state.pairIndex||state.pairs.length-state.pairIndex<2||action.seed===state.config.seed)return done()
      reshuffleRemaining(state,action.seed);changed=true;break
    case 'answer': {
      if (state.phase !== 'question' || state.paused || action.roundId !== duelRoundId(state)) return done()
      const round = duelRound(quiz, state)
      if (!round.item.question.choices.some(choice => choice.id === action.choiceId)) throw new Error('Cette carte n’est pas proposée.')
      const correct = action.choiceId === round.item.correctChoiceId, victim = correct ? otherSide(action.side) : action.side
      const previousHp={...state.hp}
      state.hp[victim] = Math.max(0, state.hp[victim] - round.damage)
      feedback(state, { at, side: action.side, choiceId: action.choiceId, correct, victim, damage: round.damage, critical: round.critical, multiplier:round.multiplier,...(state.version===4?{previousHp}:{}), ...pairResult(state) }, at)
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

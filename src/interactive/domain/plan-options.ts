import { createRng, shuffle } from '@/math/rng'
import { canonicalJson, deriveSeed, hash } from './seeds'
import { choiceOrderPolicy } from './slots'
import { sourcePosition, positionOf } from './source-position'
export { positionOf } from './source-position'
import type { Game } from './types'

export type PlanOptions = { orderMode: 'source' | 'shuffled' | 'custom'; customOrder: string[]; maxChoices: 2 | 3 | 4 | 5 | 6; numericOrder: boolean }
export const DEFAULT_PLAN_OPTIONS: PlanOptions = { orderMode: 'source', customOrder: [], maxChoices: 6, numericOrder: false }
export function readPlanOptions(raw: unknown): PlanOptions {
  if (raw === undefined) return { ...DEFAULT_PLAN_OPTIONS, customOrder: [] }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Options de préparation invalides.')
  const value = raw as Record<string, unknown>
  if (Object.keys(value).some((key) => !['orderMode', 'customOrder', 'maxChoices', 'numericOrder'].includes(key)) || !['source', 'shuffled', 'custom'].includes(value.orderMode as string) || ![2, 3, 4, 5, 6].includes(value.maxChoices as number) || typeof value.numericOrder !== 'boolean' ||
    !Array.isArray(value.customOrder) || value.customOrder.length > 5000 || new Set(value.customOrder).size !== value.customOrder.length || value.customOrder.some((id) => typeof id !== 'string' || !sourcePosition.test(id))) throw new Error('Options de préparation invalides.')
  return { orderMode: value.orderMode as PlanOptions['orderMode'], customOrder: [...value.customOrder] as string[], maxChoices: value.maxChoices as PlanOptions['maxChoices'], numericOrder: value.numericOrder }
}

/** Changes only order and verified source choices; never manufactures an option. */
export function applyPlanOptions(game: Game, options: PlanOptions): Game {
  const effective = { ...options, customOrder: options.orderMode === 'custom' ? options.customOrder : [] }
  if (canonicalJson(effective) === canonicalJson(DEFAULT_PLAN_OPTIONS)) return game
  const issues = [...game.issues]
  let questions = game.questions.map((q) => {
    if (q.mode !== 'choice') return q
    const policy = choiceOrderPolicy(q)
    const fixed = policy === 'fixed' || policy === 'pin-last'
    let choices = q.choices
    if (choices.length > options.maxChoices) {
      if (fixed) issues.push({ source: q.prompt, reason: 'Les choix de cette question restent complets pour préserver leurs références et leur ordre fixe.' })
      else {
        const correctId = game.corrections[q.id]?.choiceId
        const correct = choices.find((choice) => choice.id === correctId)
        if (!correct) throw new Error('Le corrigé de cette question ne peut pas être vérifié.')
        const others = [...choices].filter((choice) => choice.id !== correctId).sort((a, b) => hash(`${q.id}:${a.id}`) - hash(`${q.id}:${b.id}`)).slice(0, options.maxChoices - 1)
        const retained = new Set([correctId, ...others.map((choice) => choice.id)])
        choices = choices.filter((choice) => retained.has(choice.id))
        issues.push({ source: q.prompt, reason: `${choices.length} choix source conservés sur ${q.choices.length}, avec la bonne réponse.` })
      }
    }
    return { ...q, choices, ...(!fixed && options.numericOrder && choices.every((choice) => /^n-?\d+$/.test(choice.id)) ? { choiceOrderPolicy: 'ascending' as const } : {}) }
  })
  if (options.orderMode === 'shuffled') questions = shuffle(createRng(deriveSeed({ originalSeed: game.seed ?? hash(game.id), sourceKey: 'questions', purpose: 'order' })), questions)
  if (options.orderMode === 'custom') {
    const ranks = new Map(options.customOrder.map((id, index) => [id, index]))
    questions = [...questions].sort((a, b) => (ranks.get(positionOf(a)) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(positionOf(b)) ?? Number.MAX_SAFE_INTEGER))
  }
  return { ...game, id: `${game.id}-options-${hash(canonicalJson(effective))}`, questions, issues }
}

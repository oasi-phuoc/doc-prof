import type { FicheRecipe } from '@/fiches/recipe'
import { hash } from './domain/convert'
import type { Question } from './domain/types'

export type GameSource = {
  name: string
  recipe: FicheRecipe
  template: FicheRecipe
  sourceKey: string
  selectedKeys: string[] | null
}
type RunMetadata = { seed: number; selectedKeys: string[] | null }
const prefix = 'clairfle.interactive.run.v1.'
export const questionSourceKey = (question: Question) => [question.source.page, question.source.block, question.source.item, question.source.part].join(':')

/** A play seed is separate from the server's immutable worksheet recipe. */
export function nextGameSeed(previous: number): number {
  let seed: number
  if (typeof globalThis.crypto !== 'undefined') seed = crypto.getRandomValues(new Uint32Array(1))[0]!
  else seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0
  return seed === (previous >>> 0) ? (seed + 0x9e3779b9) >>> 0 : seed
}
function readMetadata(key: string): RunMetadata | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(prefix + key) ?? 'null')
    if (!value || typeof value !== 'object') return null
    const data = value as Record<string, unknown>
    if (typeof data.seed !== 'number' || !Number.isInteger(data.seed) || data.seed < 0 || data.seed > 0xffffffff) return null
    if (data.selectedKeys !== null && (!Array.isArray(data.selectedKeys) || data.selectedKeys.length > 5000 || data.selectedKeys.some((key) => typeof key !== 'string' || !/^\d+:\d+:\d+:\d+$/.test(key)))) return null
    return { seed: data.seed, selectedKeys: data.selectedKeys as string[] | null }
  } catch { return null }
}
export function createGameSource(value: { recipe: FicheRecipe; name: string }, kind: 'demo' | 'draft' | 'saved', sourceId = ''): GameSource {
  const sourceKey = `${kind}-${hash(JSON.stringify({ recipe: value.recipe, sourceId }))}`
  const metadata = readMetadata(sourceKey)
  const seed = metadata?.seed ?? (kind === 'saved' ? nextGameSeed(value.recipe.seed) : value.recipe.seed)
  return { name: value.name, template: value.recipe, recipe: { ...value.recipe, seed }, sourceKey, selectedKeys: metadata?.selectedKeys ?? null }
}
export function renewGameSource(source: GameSource, selectedKeys: string[] | null): GameSource {
  return { ...source, recipe: { ...source.template, seed: nextGameSeed(source.recipe.seed) }, selectedKeys }
}
export function saveGameRun(source: GameSource, selectedKeys: string[] | null): boolean {
  try { sessionStorage.setItem(prefix + source.sourceKey, JSON.stringify({ seed: source.recipe.seed, selectedKeys })); return true }
  catch { return false }
}

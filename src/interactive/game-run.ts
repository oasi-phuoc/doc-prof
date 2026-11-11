import type { FicheRecipe } from '@/fiches/recipe'
import { canonicalJson, hash } from './domain/seeds'
import type { PlayMode } from './domain/types'
import type { SessionSource, SourceReference } from './domain/source'
import { latestRun } from './local-runs'
import { readPlanOptions, type PlanOptions } from './domain/plan-options'
import { positionOf } from './domain/source-position'

export type GameSource = {
  name: string
  recipe: FicheRecipe
  template: FicheRecipe
  sourceKey: string
  selectedKeys: string[] | null
  replay: number
  reference?: SourceReference
  restoredMode?: PlayMode
  restoredTimer?: SessionSource['timer']
  sessionId?: string
  restoredGameId?: string
  storageWarning?: string
  options: PlanOptions
  presetId?: string
  resolvedKeys?: string[]
}
type RunMetadata = { seed: number; selectedKeys: string[] | null; replay?: number; options?: PlanOptions; presetId?: string }
const prefix = 'clairfle.interactive.run.v1.'
export const questionSourceKey = positionOf

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
    if (data.replay !== undefined && (typeof data.replay !== 'number' || !Number.isInteger(data.replay) || data.replay < 0 || data.replay > 5000)) return null
    return { seed: data.seed, selectedKeys: data.selectedKeys as string[] | null, replay: data.replay as number | undefined, options: readPlanOptions(data.options), ...(typeof data.presetId === 'string' && data.presetId.length <= 100 ? { presetId: data.presetId } : {}) }
  } catch { return null }
}
export function createGameSource(value: { recipe: FicheRecipe; name: string }, kind: 'demo' | 'draft' | 'saved', sourceId = ''): GameSource {
  const sourceKey = `${kind}-${hash(canonicalJson({ recipe: value.recipe, sourceId }))}`
  const metadata = readMetadata(sourceKey)
  const seed = metadata?.seed ?? (kind === 'saved' ? nextGameSeed(value.recipe.seed) : value.recipe.seed)
  return { name: value.name, template: value.recipe, recipe: { ...value.recipe, seed }, sourceKey, selectedKeys: metadata?.selectedKeys ?? null, replay: metadata?.replay ?? 0, options: readPlanOptions(metadata?.options), presetId: metadata?.presetId, ...(sourceId || kind === 'demo' ? { reference: { kind, id: sourceId || 'demo' } } : {}) }
}
export async function loadGameSource(value: { recipe: FicheRecipe; name: string }, kind: 'demo' | 'draft' | 'saved', sourceId = ''): Promise<GameSource> {
  const source = createGameSource(value, kind, sourceId)
  const cached = readMetadata(source.sourceKey)
  if (cached || !source.reference) return source
  try {
    const saved = await latestRun(source.sourceKey)
    if (!saved || saved.source.reference.kind !== source.reference.kind || saved.source.reference.id !== source.reference.id) return source
    return { ...source, recipe: { ...source.recipe, seed: saved.source.seed }, selectedKeys: saved.source.selectedKeys, replay: saved.source.replay, options: readPlanOptions(saved.source.options), presetId: saved.source.presetId, resolvedKeys: saved.source.resolvedKeys, restoredMode: saved.mode, restoredTimer: saved.source.timer, sessionId: saved.sessionId, restoredGameId: saved.gameId }
  } catch (error) { return { ...source, storageWarning: error instanceof Error ? error.message : 'Reprise locale indisponible. Le jeu peut continuer.' } }
}
export function renewGameSource(source: GameSource, selectedKeys: string[] | null): GameSource {
  return { ...source, recipe: { ...source.template, seed: nextGameSeed(source.recipe.seed) }, selectedKeys, replay: 0, sessionId: undefined, restoredGameId: undefined, resolvedKeys: undefined }
}
export function saveGameRun(source: GameSource, selectedKeys: string[] | null): boolean {
  try { sessionStorage.setItem(prefix + source.sourceKey, JSON.stringify({ seed: source.recipe.seed, selectedKeys, replay: source.replay, options: source.options, presetId: source.presetId })); return true }
  catch { return false }
}

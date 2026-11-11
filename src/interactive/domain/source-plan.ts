import type { FicheRecipe } from '@/fiches/recipe'
import { convertRecipe } from './convert'
import { deriveSeed, hash, canonicalJson } from './seeds'
import { applyPlanOptions, readPlanOptions } from './plan-options'
import { positionOf } from './source-position'
import { prepareGame, excludeQuestions } from './plan'
import type { SessionSource } from './source'
import type { PlayMode } from './types'
import { PLAN_CHANGED } from './persistence'

/** Rebuild from the authorized current worksheet; no recipe or answer key comes from an import. */
export function sourcePlan(template: FicheRecipe, title: string, source: SessionSource, mode: PlayMode) {
  const expected = `${source.reference.kind}-${hash(canonicalJson({ recipe: template, sourceId: source.reference.id }))}`
  if (source.sourceKey !== expected) throw new Error(PLAN_CHANGED)
  const converted = convertRecipe({ ...template, seed: source.seed }, title)
  const replayed = source.replay ? { ...converted, id: `${converted.id}-replay-${source.replay}`, seed: deriveSeed({ originalSeed: source.seed, sourceKey: source.sourceKey, purpose: 'replay', attempt: source.replay }) } : converted
  const configured = applyPlanOptions(replayed, readPlanOptions(source.options))
  const prepared = prepareGame(configured, configured.questions.filter((q) => source.selectedKeys.includes(positionOf(q))).map((q) => q.id), mode)
  return source.resolvedKeys ? excludeQuestions(prepared, new Set(prepared.questions.filter((q) => !source.resolvedKeys!.includes(positionOf(q))).map((q) => q.id))) : prepared
}

import { createRng, shuffle } from '@/math/rng'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'
import { isLogistiqueDomain } from './catalog'
import { generateLogistique } from './generate'

export function availableLogistiqueQuestions(candidates: readonly MathItem[], existing: readonly MathItem[]): MathItem[] {
  const ids = new Set<string>()
  const legacyPrompts = new Set<string>()
  for (const item of existing) {
    if (item.logistiqueSource) ids.add(item.logistiqueSource.id)
    else if (item.prompt) legacyPrompts.add(item.prompt)
  }
  return candidates.filter((item) => item.logistiqueSource &&
    !ids.has(item.logistiqueSource.id) && !legacyPrompts.has(item.prompt ?? ''))
}

export function selectLogistiqueLot(candidates: MathItem[], count: number, seed: number): MathItem[] {
  return shuffle(createRng(seed), candidates).slice(0, count)
}

export function retainLogistiqueQuestions(config: PageConfig, seed: number, evaluation: boolean): Partial<ExerciseBlock> {
  if (!isLogistiqueDomain(config.domain)) return {}
  const retained = config.libreItems?.filter((item) => item.logistiqueRetained)
  if (!retained?.length) return {}
  const excluded = new Set(retained.flatMap((item) => item.logistiqueSource ? [item.logistiqueSource.id] : []))
  const draw = generateLogistique(evaluation ? config : { ...config, logistiqueSelection: undefined }, seed, undefined, excluded)
  return { libreItems: [...draw.items, ...retained], libreInstruction: config.libreInstruction }
}

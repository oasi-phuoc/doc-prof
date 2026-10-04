/**
 * Tirage des formes fractionnaires — porté depuis
 * soutien-scolaire PlacementExercises16to27 (`genFracItems`).
 */
import type { ShapeKind } from '@/components/math/FractionShape'
import { int, pick, shuffle, type Rng } from './rng'

export type FracShapeItem = {
  kind: ShapeKind
  d: number
  n: number
  copies: number
  multi: boolean
}

function pickSingleShapeCfg(rng: Rng): { kind: ShapeKind; d: number } {
  const pickers: Array<() => { kind: ShapeKind; d: number }> = [
    () => ({ kind: 'rect', d: int(rng, 2, 12) }),
    () => ({ kind: 'square', d: pick(rng, [2, 4, 9, 16] as const) }),
    () => ({ kind: 'triangle', d: pick(rng, [2, 3, 4, 6, 9] as const) }),
    () => ({ kind: 'circle', d: int(rng, 2, 10) }),
    () => ({ kind: 'semicircle', d: int(rng, 2, 8) }),
    () => ({ kind: 'quartercircle', d: int(rng, 2, 8) }),
    () => ({ kind: 'hexagon', d: pick(rng, [2, 3, 4, 6, 12] as const) }),
  ]
  return shuffle(rng, pickers)[0]!()
}

function pickMultiShapeCfg(rng: Rng): { kind: ShapeKind; d: number } {
  const pickers: Array<() => { kind: ShapeKind; d: number }> = [
    () => ({ kind: 'rect', d: int(rng, 2, 5) }),
    () => ({ kind: 'square', d: pick(rng, [2, 4] as const) }),
    () => ({ kind: 'triangle', d: pick(rng, [2, 3, 4] as const) }),
    () => ({ kind: 'circle', d: int(rng, 2, 5) }),
    () => ({ kind: 'semicircle', d: int(rng, 2, 4) }),
    () => ({ kind: 'quartercircle', d: int(rng, 2, 4) }),
    () => ({ kind: 'hexagon', d: pick(rng, [2, 3, 4, 6] as const) }),
  ]
  return shuffle(rng, pickers)[0]!()
}

/** Première moitié : formes simples ; seconde : multi-formes (comme soutien). */
export function genFracItems(rng: Rng, count: number): FracShapeItem[] {
  const items: FracShapeItem[] = []
  const usedConfigs = new Set<string>()
  const singles = Math.ceil(count / 2)

  for (let i = 0; i < count; i++) {
    const isSingle = i < singles
    let cfg = isSingle ? pickSingleShapeCfg(rng) : pickMultiShapeCfg(rng)
    let tries = 0
    while (usedConfigs.has(`${cfg.kind}-${cfg.d}`) && tries < 40) {
      cfg = isSingle ? pickSingleShapeCfg(rng) : pickMultiShapeCfg(rng)
      tries++
    }
    usedConfigs.add(`${cfg.kind}-${cfg.d}`)
    if (isSingle) {
      items.push({ ...cfg, n: int(rng, 1, cfg.d - 1), copies: 1, multi: false })
    } else {
      const copies = int(rng, 2, 3)
      items.push({ ...cfg, n: int(rng, cfg.d + 1, copies * cfg.d - 1), copies, multi: true })
    }
  }

  return items
}

import type { Difficulty } from './types'
import type { Rng } from './rng'
import { int } from './rng'

export type { Difficulty }

export type NumberRange = {
  min: number
  max: number
  decimals: boolean
}

export function numberRangeFrom(config: {
  numberLibre?: boolean
  numberMin?: number
  numberMax?: number
  numberDecimals?: boolean
}): NumberRange | undefined {
  if (!config.numberLibre) return undefined
  let min = Number(config.numberMin)
  let max = Number(config.numberMax)
  if (!Number.isFinite(min)) min = 1
  if (!Number.isFinite(max)) max = 100
  if (max < min) {
    const swap = min
    min = max
    max = swap
  }
  return { min, max, decimals: !!config.numberDecimals }
}

export function pickInRange(rng: Rng, range: NumberRange): number {
  if (range.decimals) {
    const factor = 10
    const a = Math.round(range.min * factor)
    const b = Math.round(range.max * factor)
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    return int(rng, lo, hi) / factor
  }
  const lo = Math.ceil(range.min)
  const hi = Math.floor(range.max)
  if (hi < lo) return range.min
  return int(rng, lo, hi)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'avance', label: 'Avancé' },
]

export function upperBound(difficulty: Difficulty, range?: NumberRange): number {
  if (range) return range.max
  return calcBound(difficulty)
}

/** Borne supérieure pour les opérandes des calculs simples (+ −). */
export function calcBound(difficulty: Difficulty): number {
  if (difficulty === 'facile') return 100
  if (difficulty === 'moyen') return 1000
  return 10_000
}

/** Bornes pour les calculs posés en colonnes. */
export function columnBounds(difficulty: Difficulty): { min: number; max: number } {
  if (difficulty === 'facile') return { min: 10, max: 99 }
  if (difficulty === 'moyen') return { min: 100, max: 999 }
  return { min: 1000, max: 9999 }
}

export function mulBound(difficulty: Difficulty): number {
  if (difficulty === 'facile') return 10
  if (difficulty === 'moyen') return 12
  return 25
}

export function divQuotientBound(difficulty: Difficulty): { qMax: number; dMax: number } {
  if (difficulty === 'facile') return { qMax: 12, dMax: 9 }
  if (difficulty === 'moyen') return { qMax: 50, dMax: 12 }
  return { qMax: 200, dMax: 25 }
}

export function nombreBound(difficulty: Difficulty): number {
  return calcBound(difficulty)
}

export function pairAdd(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const a = pickInRange(rng, range)
    const b = pickInRange(rng, range)
    return { a, b, result: round2(a + b) }
  }
  const max = calcBound(difficulty)
  const a = int(rng, 1, max)
  const b = int(rng, 1, max)
  return { a, b, result: a + b }
}

export function pairSub(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const hi = pickInRange(rng, range)
    const loBound = range.decimals ? range.min : Math.max(range.min, 0)
    const span: NumberRange = { min: loBound, max: hi, decimals: range.decimals }
    let b = pickInRange(rng, span)
    if (b >= hi) b = range.decimals ? round2(Math.max(loBound, hi - 0.1)) : Math.max(loBound, hi - 1)
    return { a: hi, b, result: round2(hi - b) }
  }
  const max = calcBound(difficulty)
  const a = int(rng, 2, max)
  const b = int(rng, 1, a - 1)
  return { a, b, result: a - b }
}

export function pairMul(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const a = Math.max(1, pickInRange(rng, range))
    const b = Math.max(1, pickInRange(rng, range))
    return { a, b, result: round2(a * b) }
  }
  const max = mulBound(difficulty)
  const a = int(rng, 2, max)
  const b = int(rng, 2, difficulty === 'avance' ? max : Math.min(max, 12))
  return { a, b, result: a * b }
}

export function pairDiv(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const intRange: NumberRange = { ...range, decimals: false }
    const result = Math.max(2, Math.round(pickInRange(rng, intRange)))
    const b = Math.max(2, Math.round(pickInRange(rng, intRange)))
    return { a: result * b, b, result }
  }
  const { qMax, dMax } = divQuotientBound(difficulty)
  const result = int(rng, 2, qMax)
  const b = int(rng, 2, dMax)
  return { a: result * b, b, result }
}

export function columnAddPair(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const lo = Math.max(1, Math.ceil(range.min))
    const hi = Math.max(lo, Math.floor(range.max))
    const a = int(rng, lo, hi)
    const b = int(rng, lo, hi)
    return { a, b, result: a + b }
  }
  const { min, max } = columnBounds(difficulty)
  const a = int(rng, min, max)
  const b = int(rng, min, max)
  return { a, b, result: a + b }
}

export function columnSubPair(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    const lo = Math.max(1, Math.ceil(range.min))
    const hi = Math.max(lo + 1, Math.floor(range.max))
    let a = int(rng, lo, hi)
    let b = int(rng, lo, hi)
    if (b >= a) {
      const t = a
      a = Math.max(a, b)
      b = Math.min(t, b)
      if (b >= a) b = Math.max(lo, a - 1)
    }
    return { a, b, result: a - b }
  }
  const { min, max } = columnBounds(difficulty)
  let a = int(rng, min, max)
  let b = int(rng, min, max)
  if (b >= a) {
    const t = a
    a = Math.max(a, b)
    b = Math.min(t, b)
    if (b >= a) b = Math.max(1, a - 1)
  }
  return { a, b, result: a - b }
}

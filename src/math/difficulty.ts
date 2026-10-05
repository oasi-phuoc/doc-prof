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

export function roundToPlaces(n: number, places: number): number {
  const factor = 10 ** Math.max(0, places)
  return Math.round(n * factor) / factor
}

/** Nombre dans [min, max] avec exactement `places` chiffres après la virgule (0 = entier). */
export function pickWithPlaces(rng: Rng, min: number, max: number, places: number): number {
  const p = Math.max(0, places)
  const factor = 10 ** p
  let lo = Math.ceil(min * factor - 1e-9)
  let hi = Math.floor(max * factor + 1e-9)
  if (hi < lo) return roundToPlaces(min, p)
  if (p === 0) return int(rng, lo, hi)
  // Dernier chiffre non nul → exactement `p` décimales (évite 14,0 ou 1,50).
  for (let attempt = 0; attempt < 40; attempt++) {
    const scaled = int(rng, lo, hi)
    if (scaled % 10 !== 0) return scaled / factor
  }
  // Repli déterministe : force un dixième non nul.
  const base = int(rng, lo, hi)
  const forced = base - (base % 10) + int(rng, 1, 9)
  const clamped = Math.min(hi, Math.max(lo, forced))
  return (clamped % 10 === 0 ? clamped + 1 : clamped) / factor
}

export function pickInRange(rng: Rng, range: NumberRange): number {
  if (range.decimals) {
    // Par défaut 1 décimale (ligne / usages génériques) ; les colonnes ont leurs propres tirages.
    return pickWithPlaces(rng, range.min, range.max, 1)
  }
  const lo = Math.ceil(range.min)
  const hi = Math.floor(range.max)
  if (hi < lo) return range.min
  return int(rng, lo, hi)
}

/** Places pour +/− : 0–3 chacun, au moins un des deux > 0. */
function pickAddSubPlaces(rng: Rng): [number, number] {
  let pa = int(rng, 0, 3)
  let pb = int(rng, 0, 3)
  if (pa === 0 && pb === 0) {
    if (rng() < 0.5) pa = int(rng, 1, 3)
    else pb = int(rng, 1, 3)
  }
  return [pa, pb]
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
    if (range.decimals) return columnAddPair(rng, difficulty, range)
    const a = pickInRange(rng, range)
    const b = pickInRange(rng, range)
    return { a, b, result: a + b }
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
    if (range.decimals) return columnSubPair(rng, difficulty, range)
    const hi = pickInRange(rng, range)
    const loBound = Math.max(range.min, 0)
    const span: NumberRange = { min: loBound, max: hi, decimals: false }
    let b = pickInRange(rng, span)
    if (b >= hi) b = Math.max(loBound, hi - 1)
    return { a: hi, b, result: hi - b }
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
    if (range.decimals) {
      const pa = int(rng, 1, 2)
      const a = pickWithPlaces(rng, Math.max(range.min, 0.1), range.max, pa)
      const b = pickWithPlaces(rng, Math.max(range.min, 0.1), range.max, 1)
      return { a, b, result: roundToPlaces(a * b, pa + 1) }
    }
    const a = Math.max(1, pickInRange(rng, range))
    const b = Math.max(1, pickInRange(rng, range))
    return { a, b, result: a * b }
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
    if (range.decimals) return columnDivPair(rng, range)
    return intDivInRange(rng, range, 12)
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
    if (range.decimals) {
      const [pa, pb] = pickAddSubPlaces(rng)
      const a = pickWithPlaces(rng, range.min, range.max, pa)
      const b = pickWithPlaces(rng, range.min, range.max, pb)
      const places = Math.max(pa, pb)
      return { a, b, result: roundToPlaces(a + b, places) }
    }
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
    if (range.decimals) {
      const [pa, pb] = pickAddSubPlaces(rng)
      let a = pickWithPlaces(rng, range.min, range.max, pa)
      let b = pickWithPlaces(rng, range.min, range.max, pb)
      if (b > a) {
        const t = a
        a = b
        b = t
      }
      if (b >= a) {
        const step = 10 ** -Math.max(pa, pb, 1)
        b = roundToPlaces(Math.max(range.min, a - step), Math.max(pb, 1))
        if (b >= a) b = roundToPlaces(Math.max(range.min, a - step), Math.max(pa, pb, 1))
      }
      const places = Math.max(pa, pb, 1)
      return { a, b, result: roundToPlaces(a - b, places) }
    }
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

/**
 * Multiplication en colonnes.
 * Avec décimales : les deux facteurs sont décimaux ;
 * le 2ᵉ est toujours dans [1,1 ; 9,9] à 1 décimale ;
 * le 1ᵉ a 1, 2 ou 3 décimales.
 */
export function columnMulPair(
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
): { a: number; b: number; result: number } {
  if (range) {
    if (range.decimals) {
      const placesA = int(rng, 1, 3)
      const aMin = Math.max(range.min, 10 ** -placesA)
      const a = pickWithPlaces(rng, aMin, range.max, placesA)
      const b = pickWithPlaces(rng, 1.1, 9.9, 1)
      return { a, b, result: roundToPlaces(a * b, placesA + 1) }
    }
    const a = Math.max(1, pickInRange(rng, range))
    const bMax = Math.min(9, Math.max(2, Math.floor(range.max)))
    const b = int(rng, 2, Math.max(2, bMax))
    return { a, b, result: a * b }
  }
  const aMax = difficulty === 'facile' ? 99 : difficulty === 'moyen' ? 999 : 9999
  const bMax = difficulty === 'avance' ? 12 : 9
  const a = int(rng, 12, aMax)
  const b = int(rng, 2, bMax)
  return { a, b, result: a * b }
}

/**
 * Dividende à exactement `places` décimales, diviseur entier, quotient exact
 * (dividende mis à l’échelle divisible par le diviseur).
 */
function decimalDivExact(
  rng: Rng,
  min: number,
  max: number,
  bMax = 9,
): { a: number; b: number; result: number } {
  const places = int(rng, 1, 3)
  const factor = 10 ** places
  const bHi = Math.min(9, Math.max(2, Math.floor(bMax)))
  const lo = Math.max(1, Math.ceil(min * factor - 1e-9))
  const hi = Math.max(lo, Math.floor(max * factor + 1e-9))

  for (let attempt = 0; attempt < 60; attempt++) {
    const b = int(rng, 2, bHi)
    const minMult = Math.ceil(lo / b)
    const maxMult = Math.floor(hi / b)
    if (maxMult < minMult) continue
    const mult = int(rng, minMult, maxMult)
    const scaled = mult * b
    // Dernier chiffre non nul → exactement `places` décimales sur le dividende.
    if (scaled < lo || scaled > hi || scaled % 10 === 0) continue
    const a = scaled / factor
    const result = mult / factor
    return { a, b, result }
  }

  // Repli déterministe : construire un dividende exact.
  const b = int(rng, 2, bHi)
  const placesF = places
  const factorF = 10 ** placesF
  let mult = Math.max(1, Math.round(((min + max) / 2) * factorF / b))
  let scaled = mult * b
  if (scaled % 10 === 0) {
    mult += 1
    scaled = mult * b
    if (scaled % 10 === 0) {
      mult += 1
      scaled = mult * b
    }
  }
  const a = scaled / factorF
  return { a, b, result: mult / factorF }
}

/**
 * Division en colonnes pour valeurs libres.
 * Avec décimales : diviseur entier ; dividende à 1, 2 ou 3 décimales (exact).
 * Sans : quotient entier exact (reste 0) dans la plage.
 */
export function columnDivPair(
  rng: Rng,
  range: NumberRange,
): { a: number; b: number; result: number } {
  if (range.decimals) {
    return decimalDivExact(rng, range.min, range.max, Math.min(9, range.max))
  }
  return intDivInRange(rng, range, 9)
}

/** Division entière exacte : le dividende reste dans la plage libre ; diviseur 2…bMax. */
function intDivInRange(
  rng: Rng,
  range: NumberRange,
  bMax: number,
): { a: number; b: number; result: number } {
  const lo = Math.max(2, Math.ceil(range.min))
  const hi = Math.max(lo, Math.floor(range.max))
  const bHi = Math.max(2, Math.min(bMax, Math.floor(hi / 2)))
  for (let attempt = 0; attempt < 40; attempt++) {
    const b = int(rng, 2, bHi)
    const qMin = Math.max(1, Math.ceil(lo / b))
    const qMax = Math.floor(hi / b)
    if (qMax < qMin) continue
    const result = int(rng, qMin, qMax)
    return { a: result * b, b, result }
  }
  const b = 2
  const result = Math.max(1, Math.floor(hi / b))
  return { a: result * b, b, result }
}

/** Tirage +/− décimal hors valeurs libres (thème Décimaux). */
export function decimalAddPair(
  rng: Rng,
  maxInt = 40,
): { a: number; b: number; result: number } {
  const [pa, pb] = pickAddSubPlaces(rng)
  const a = pickWithPlaces(rng, 10 ** -Math.max(pa, 1), maxInt, pa)
  const b = pickWithPlaces(rng, 10 ** -Math.max(pb, 1), maxInt, pb)
  const places = Math.max(pa, pb)
  return { a, b, result: roundToPlaces(a + b, places) }
}

export function decimalSubPair(
  rng: Rng,
  maxInt = 40,
): { a: number; b: number; result: number } {
  const [pa, pb] = pickAddSubPlaces(rng)
  let a = pickWithPlaces(rng, 10 ** -Math.max(pa, 1), maxInt, pa)
  let b = pickWithPlaces(rng, 10 ** -Math.max(pb, 1), maxInt, pb)
  if (b > a) {
    const t = a
    a = b
    b = t
  }
  if (b >= a) {
    const step = 10 ** -Math.max(pa, pb, 1)
    b = roundToPlaces(Math.max(step, a - step), Math.max(pb, 1))
  }
  const places = Math.max(pa, pb, 1)
  return { a, b, result: roundToPlaces(a - b, places) }
}

/** × décimal : a à 1–3 décimales, b ∈ [1,1 ; 9,9] à 1 décimale. */
export function decimalMulPair(
  rng: Rng,
  maxInt = 20,
): { a: number; b: number; result: number } {
  const placesA = int(rng, 1, 3)
  const a = pickWithPlaces(rng, 10 ** -placesA, maxInt, placesA)
  const b = pickWithPlaces(rng, 1.1, 9.9, 1)
  return { a, b, result: roundToPlaces(a * b, placesA + 1) }
}

/** ÷ décimal : diviseur entier, dividende à 1–3 décimales (exact). */
export function decimalDivPair(
  rng: Rng,
  maxDividend = 40,
): { a: number; b: number; result: number } {
  return decimalDivExact(rng, 10 ** -3, maxDividend, 9)
}

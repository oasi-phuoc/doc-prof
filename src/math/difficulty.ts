import type { Difficulty } from './types'
import type { Rng } from './rng'
import { int } from './rng'

export type { Difficulty }

export const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'avance', label: 'Avancé' },
]

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

export function pairAdd(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
  const max = calcBound(difficulty)
  const a = int(rng, 1, max)
  const b = int(rng, 1, max)
  return { a, b, result: a + b }
}

export function pairSub(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
  const max = calcBound(difficulty)
  const a = int(rng, 2, max)
  const b = int(rng, 1, a - 1)
  return { a, b, result: a - b }
}

export function pairMul(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
  const max = mulBound(difficulty)
  const a = int(rng, 2, max)
  const b = int(rng, 2, difficulty === 'avance' ? max : Math.min(max, 12))
  return { a, b, result: a * b }
}

export function pairDiv(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
  const { qMax, dMax } = divQuotientBound(difficulty)
  const result = int(rng, 2, qMax)
  const b = int(rng, 2, dMax)
  return { a: result * b, b, result }
}

export function columnAddPair(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
  const { min, max } = columnBounds(difficulty)
  const a = int(rng, min, max)
  const b = int(rng, min, max)
  return { a, b, result: a + b }
}

export function columnSubPair(rng: Rng, difficulty: Difficulty): { a: number; b: number; result: number } {
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

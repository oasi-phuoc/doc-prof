import { int, pick, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

const LENGTH = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km']
const AREA = ['mm²', 'cm²', 'dm²', 'm²', 'dam²', 'hm²', 'km²']
const VOLUME = ['mm³', 'cm³', 'dm³', 'm³', 'dam³', 'hm³', 'km³']
const CAPACITY = ['mL', 'cL', 'dL', 'L']
const MASS = ['mg', 'g', 'kg']
const TIME = ['s', 'min', 'h']

function fmt(n: number): string {
  const r = Math.round(n * 1000) / 1000
  return String(r).replace('.', ',')
}

function item(value: number, from: string, to: string, answer: number, toUnit: string): MathItem {
  return {
    layout: 'inline',
    prompt: `${fmt(value)} ${from} =`,
    convert: { value: fmt(value), from, to },
    answer: `${fmt(answer)} ${toUnit}`,
  }
}

function stepFactor(kind: 'length' | 'area' | 'volume' | 'capacity' | 'mass' | 'time'): number {
  if (kind === 'area') return 100
  if (kind === 'volume' || kind === 'mass') return 1000
  if (kind === 'time') return 60
  return 10
}

function convert(
  rng: Rng,
  difficulty: Difficulty,
  units: string[],
  factor: number,
): MathItem {
  if (difficulty === 'facile') {
    const fromIdx = int(rng, 1, units.length - 1)
    const toIdx = fromIdx - 1
    const value = int(rng, 1, 12)
    return item(value, units[fromIdx]!, units[toIdx]!, value * factor, units[toIdx]!)
  }
  if (difficulty === 'moyen') {
    const fromIdx = int(rng, 0, units.length - 2)
    const toIdx = fromIdx + 1
    const value = int(rng, 2, 25)
    return item(value, units[fromIdx]!, units[toIdx]!, value / factor, units[toIdx]!)
  }
  const fromIdx = int(rng, 0, units.length - 1)
  const neighbors = [fromIdx - 1, fromIdx + 1].filter((n) => n >= 0 && n < units.length)
  const toIdx = pick(rng, neighbors)
  const towardSmaller = toIdx < fromIdx
  const value = int(rng, 11, 99) / 10
  const answer = towardSmaller ? value * factor : value / factor
  return item(value, units[fromIdx]!, units[toIdx]!, answer, units[toIdx]!)
}

/** Paires adjacentes dirigées (ex. mm→cm, cm→mm) — jamais deux fois la même. */
function adjacentDirectedPairs(units: string[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = []
  for (let i = 0; i < units.length; i++) {
    if (i > 0) pairs.push([i, i - 1])
    if (i < units.length - 1) pairs.push([i, i + 1])
  }
  return pairs
}

/**
 * Lot de conversions de longueur :
 * - chaque couple d’unités (from→to) est unique dans le lot ;
 * - les deux dernières questions (5 et 6 si count ≥ 5) sont en décimal.
 */
export function generateLengthConversionBatch(rng: Rng, count: number): MathItem[] {
  const n = Math.max(1, count)
  const factor = stepFactor('length')
  const pairs = shuffle(rng, adjacentDirectedPairs(LENGTH))
  const chosen = pairs.slice(0, Math.min(n, pairs.length))
  while (chosen.length < n) {
    // Repli très rare : ajouter une paire non encore utilisée si le pool est insuffisant.
    const extra = adjacentDirectedPairs(LENGTH).find(
      ([a, b]) => !chosen.some(([x, y]) => x === a && y === b),
    )
    if (!extra) break
    chosen.push(extra)
  }

  return chosen.map(([fromIdx, toIdx], index) => {
    const from = LENGTH[fromIdx]!
    const to = LENGTH[toIdx]!
    const towardSmaller = toIdx < fromIdx
    const decimal = index >= n - 2 && n >= 5
    let value: number
    if (decimal) {
      let tenths = int(rng, 11, 99)
      while (tenths % 10 === 0) tenths = int(rng, 11, 99)
      value = tenths / 10
    } else {
      value = int(rng, 2, 25)
    }
    const answer = towardSmaller ? value * factor : value / factor
    return item(value, from, to, answer, to)
  })
}

export function tryGenerateConversion(
  typeId: string,
  rng: Rng,
  difficulty: Difficulty,
): MathItem | null {
  switch (typeId) {
    case 'conversions-longueur':
      return convert(rng, difficulty, LENGTH, stepFactor('length'))
    case 'conversions-aire':
      return convert(rng, difficulty, AREA, stepFactor('area'))
    case 'conversions-volume':
      return convert(rng, difficulty, VOLUME, stepFactor('volume'))
    case 'conversions-capacite':
      return convert(rng, difficulty, CAPACITY, stepFactor('capacity'))
    case 'conversions-masse':
      return convert(rng, difficulty, MASS, stepFactor('mass'))
    case 'conversions-temps':
      return convert(rng, difficulty, TIME, stepFactor('time'))
    default:
      return null
  }
}

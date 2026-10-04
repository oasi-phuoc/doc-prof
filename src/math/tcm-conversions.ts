/**
 * TCM ex. 35 — conversions mixtes (4 questions, une par famille) :
 * masse (kg), capacité (L), temps (h), aire (m²) ou volume (m³) au hasard.
 * Valeur entière ou décimale tirée au sort pour chaque question.
 */
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'

type UnitPair = {
  from: string
  to: string
  /** from → to : value × multiply */
  multiply: number
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '0'
  // Jusqu’à 6 décimales utiles, sans zéros inutiles.
  const r = Math.round(n * 1_000_000) / 1_000_000
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r))
  return String(r)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.$/, '')
    .replace('.', ',')
}

function makeItem(value: number, from: string, to: string, answer: number): MathItem {
  return {
    layout: 'inline',
    prompt: `${fmt(value)} ${from} =`,
    convert: { value: fmt(value), from, to },
    answer: `${fmt(answer)} ${to}`,
  }
}

/** Paires scolaires impliquant l’unité phare (évite les facteurs extrêmes). */
const MASS_PAIRS: UnitPair[] = [
  { from: 'kg', to: 'g', multiply: 1000 },
  { from: 'g', to: 'kg', multiply: 1 / 1000 },
]

const CAPACITY_PAIRS: UnitPair[] = [
  { from: 'L', to: 'dL', multiply: 10 },
  { from: 'dL', to: 'L', multiply: 1 / 10 },
  { from: 'L', to: 'cL', multiply: 100 },
  { from: 'cL', to: 'L', multiply: 1 / 100 },
  { from: 'L', to: 'mL', multiply: 1000 },
  { from: 'mL', to: 'L', multiply: 1 / 1000 },
]

const TIME_PAIRS: UnitPair[] = [
  { from: 'h', to: 'min', multiply: 60 },
  { from: 'min', to: 'h', multiply: 1 / 60 },
  { from: 'h', to: 's', multiply: 3600 },
]

const AREA_PAIRS: UnitPair[] = [
  { from: 'm²', to: 'dm²', multiply: 100 },
  { from: 'dm²', to: 'm²', multiply: 1 / 100 },
  { from: 'm²', to: 'cm²', multiply: 10_000 },
  { from: 'cm²', to: 'm²', multiply: 1 / 10_000 },
  { from: 'dam²', to: 'm²', multiply: 100 },
  { from: 'm²', to: 'dam²', multiply: 1 / 100 },
]

const VOLUME_PAIRS: UnitPair[] = [
  { from: 'm³', to: 'dm³', multiply: 1000 },
  { from: 'dm³', to: 'm³', multiply: 1 / 1000 },
  { from: 'm³', to: 'cm³', multiply: 1_000_000 },
  { from: 'dam³', to: 'm³', multiply: 1000 },
  { from: 'm³', to: 'dam³', multiply: 1 / 1000 },
]

function randomValue(rng: Rng, decimal: boolean, pair: UnitPair): number {
  if (pair.multiply < 1) {
    // Vers une unité plus grande : partir d’un multiple pour une réponse lisible.
    const den = Math.round(1 / pair.multiply)
    if (decimal) {
      const places = rng() < 0.55 ? 1 : 2
      if (places === 1) {
        let tenths = int(rng, 1, 9)
        return den * (int(rng, 1, 8) + tenths / 10)
      }
      let hundredths = int(rng, 1, 99)
      while (hundredths % 10 === 0) hundredths = int(rng, 1, 99)
      return den * (int(rng, 1, 5) + hundredths / 100)
    }
    return den * int(rng, 1, 12)
  }
  // Vers une unité plus petite
  if (!decimal) {
    if (pair.multiply >= 10_000) return int(rng, 1, 12)
    if (pair.multiply >= 1000) return int(rng, 1, 25)
    return int(rng, 1, 40)
  }
  const places = rng() < 0.55 ? 1 : 2
  if (places === 1) {
    let tenths = int(rng, 11, 99)
    while (tenths % 10 === 0) tenths = int(rng, 11, 99)
    return tenths / 10
  }
  let hundredths = int(rng, 101, 999)
  while (hundredths % 10 === 0) hundredths = int(rng, 101, 999)
  return hundredths / 100
}

function cleanAnswer(value: number, multiply: number): number {
  return Math.round(value * multiply * 1_000_000) / 1_000_000
}

function generateOne(rng: Rng, pairs: UnitPair[]): MathItem {
  const pair = pick(rng, pairs)
  const decimal = rng() < 0.5
  const value = randomValue(rng, decimal, pair)
  const answer = cleanAnswer(value, pair.multiply)
  return makeItem(value, pair.from, pair.to, answer)
}

/** Lot TCM ex. 35 : masse, capacité, temps, aire|volume. */
export function generateTcmConversionsBatch(rng: Rng): MathItem[] {
  // Masse / capacité / temps d’abord : consomme le RNG (évite le biais LCG
  // du premier tirage sur les petites graines, qui favorisait toujours l’aire).
  const mass = generateOne(rng, MASS_PAIRS)
  const capacity = generateOne(rng, CAPACITY_PAIRS)
  const time = generateOne(rng, TIME_PAIRS)
  const spatialPairs = pick(rng, [AREA_PAIRS, VOLUME_PAIRS])
  const spatial = generateOne(rng, spatialPairs)
  return [mass, capacity, time, spatial]
}

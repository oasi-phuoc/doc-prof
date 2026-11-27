import { fmt } from './column-arith'
import { int, pick, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

const quantities = [
  { kind: 'mass', title: 'Balance', unit: 'kg', smaller: 'g', factor: 1000, steps: [0.2, 0.5, 1] },
  { kind: 'capacity', title: 'Verre doseur', unit: 'mL', smaller: 'L', factor: 0.001, steps: [25, 50, 100] },
  { kind: 'duration', title: 'Minuteur', unit: 'min', smaller: 's', factor: 60, steps: [1, 2, 5] },
] as const

function readMeasurement(rng: Rng, index: number, difficulty: Difficulty): MathItem {
  const { kind, title, unit, steps } = quantities[index % quantities.length]!
  const step = difficulty === 'facile' ? steps[1] : pick(rng, steps)
  const tick = pick(rng, difficulty === 'facile' ? [2, 4, 6, 8] : [1, 3, 5, 7])
  return {
    layout: 'text',
    measureScale: { kind, unit, step, tick },
    prompt: `${title}. Lisez la graduation indiquée.`,
    answer: `${fmt(tick * step)} ${unit}`,
  }
}

function compareMeasurement(rng: Rng, index: number, difficulty: Difficulty): MathItem {
  const { unit, smaller, factor, steps } = quantities[index % quantities.length]!
  const step = difficulty === 'facile' ? steps[1] : pick(rng, steps)
  const a = int(rng, 2, 8)
  const b = int(rng, 2, 8)
  const left = `${fmt(a * step)} ${unit}`
  const right = `${fmt(b * step * factor)} ${smaller}`
  const answer = a === b ? '=' : a < b ? '<' : '>'
  return rng() < 0.5
    ? { layout: 'compare', left, right, answer }
    : { layout: 'compare', left: right, right: left, answer: answer === '=' ? '=' : answer === '<' ? '>' : '<' }
}

export function tryGenerateMeasurementPractice(
  typeId: string, rng: Rng, count: number, difficulty: Difficulty,
): MathItem[] | undefined {
  if (typeId !== 'mesures-lire-instrument' && typeId !== 'mesures-comparer-grandeurs') return undefined
  const generate = typeId === 'mesures-lire-instrument' ? readMeasurement : compareMeasurement
  const start = int(rng, 0, quantities.length - 1)
  return shuffle(rng, Array.from({ length: count }, (_, index) => generate(rng, index + start, difficulty)))
}

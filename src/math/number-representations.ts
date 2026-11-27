import { fmt } from './column-arith'
import { pickInRange, type NumberRange } from './difficulty'
import { int, pick, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

function generateNumberLine(rng: Rng, difficulty: Difficulty, range?: NumberRange): MathItem {
  const intervals = 5
  const target = int(rng, 1, intervals - 1)
  const labelAt = pick(rng, [intervals, target === 2 ? 3 : 2])
  const steps = difficulty === 'facile' ? [1, 2, 5] : [2, 5, 10, 20, 25, 50, 100]
  let step = pick(rng, steps)
  let start = int(rng, 0, difficulty === 'facile' ? 8 : 25) * step

  if (range) {
    const scale = range.decimals ? 100 : 1
    const min = Math.ceil(range.min * scale)
    const max = Math.floor(range.max * scale)
    const maxStep = Math.floor((max - min) / intervals)
    if (maxStep >= 1) {
      const preferred = steps.map((value) => range.decimals ? value * 10 : value)
        .filter((value) => value <= maxStep)
      const scaledStep = preferred.length ? pick(rng, preferred) : int(rng, 1, maxStep)
      step = scaledStep / scale
      start = int(rng, min, max - scaledStep * intervals) / scale
    }
  }
  return {
    layout: 'text',
    numberLine: { start, step, intervals, target, labelAt },
    answer: fmt(start + target * step),
  }
}

function generateRepeatedAddition(rng: Rng, difficulty: Difficulty, range?: NumberRange): MathItem {
  const copies = int(rng, 2, difficulty === 'facile' ? 4 : 6)
  const value = range ? pickInRange(rng, range) : int(rng, 2, difficulty === 'facile' ? 5 : 12)
  const term = value < 0 ? `(${fmt(value)})` : fmt(value)
  return {
    layout: 'inline',
    prompt: `${Array.from({ length: copies }, () => term).join(' + ')} =`,
    answer: `${copies} × ${term} = ${fmt(copies * value)}`,
  }
}

function generateFunctionRule(rng: Rng, difficulty: Difficulty): MathItem {
  const slope = int(rng, 2, difficulty === 'avance' ? 9 : 5) * (
    difficulty !== 'facile' && rng() < 0.5 ? -1 : 1
  )
  const offset = difficulty === 'facile' ? 0 : int(rng, -9, 9)
  const start = int(rng, -3, 1)
  const inputStep = difficulty === 'avance' ? int(rng, 2, 4) : 1
  const inputs = [start, start + inputStep, start + inputStep * 3]
  const intercept = offset === 0 ? '' : offset < 0 ? ` − ${-offset}` : ` + ${offset}`
  return {
    layout: 'text',
    functionPairs: inputs.map((x) => ({ x, y: slope * x + offset })),
    answer: `y = ${String(slope).replace('-', '−')}x${intercept}`,
  }
}

export function tryGenerateNumberRepresentations(
  typeId: string,
  rng: Rng,
  count: number,
  difficulty: Difficulty,
  range?: NumberRange,
): MathItem[] | null {
  switch (typeId) {
    case 'nombres-droite-graduee':
      return Array.from({ length: count }, () => generateNumberLine(rng, difficulty, range))
    case 'multiplication-addition-iteree':
      return Array.from({ length: count }, () => generateRepeatedAddition(rng, difficulty, range))
    case 'fonctions-regle':
      return Array.from({ length: count }, () => generateFunctionRule(rng, difficulty))
    default:
      return null
  }
}

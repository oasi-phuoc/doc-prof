import { columnItem, fmt } from './column-arith'
import { int, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

export const ADDITION_CARRY_TYPE = 'addition-retenue-guidee'
export const RULER_SEGMENT_TYPE = 'mesures-lire-segment'

function additionWithCarry(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const guided = index === 0
  const twoCarries = difficulty === 'avance' || (difficulty === 'moyen' && !guided)
  const tensA = guided ? int(rng, 3, 4) : int(rng, 5, 6)
  const tensB = twoCarries ? int(rng, 9 - tensA, 9) : int(rng, 1, 8 - tensA)
  const unitsA = int(rng, 2, 9)
  const unitsB = int(rng, 10 - unitsA, 9)
  const a = tensA * 10 + unitsA
  const b = tensB * 10 + unitsB

  return {
    ...columnItem('+', a, b, a + b, false),
    additionCarryPractice: guided ? 'guided' : 'independent',
    prompt: guided ? 'Commencez par les unités.' : 'Écrivez la somme et les retenues.',
  }
}

function measureSegment(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const guided = index === 0
  const unit = difficulty === 'avance' ? 'mm' : 'cm'
  const startCm = guided && difficulty === 'facile' ? 0 : guided ? int(rng, 1, 2) : int(rng, 3, 5)
  const startMm = startCm * 10 + (unit === 'mm' ? int(rng, 1, 4) : 0)
  const endMm = (startCm + int(rng, 2, 4)) * 10 + (unit === 'mm' ? int(rng, 5, 9) : 0)
  const divisor = unit === 'cm' ? 10 : 1
  const start = fmt(startMm / divisor)
  const end = fmt(endMm / divisor)
  const length = fmt((endMm - startMm) / divisor)

  return {
    layout: 'text',
    rulerSegment: { startMm, endMm, guided },
    prompt: guided
      ? `Lisez les graduations sous les deux points.\nCalculez la longueur en ${unit}.`
      : `Écrivez la longueur du segment en ${unit}.`,
    answer: `${end} − ${start} = ${length} ${unit}.`,
  }
}

export function tryGenerateGuidedPractice(
  typeId: string, rng: Rng, count: number, difficulty: Difficulty,
): MathItem[] | undefined {
  if (typeId === ADDITION_CARRY_TYPE) {
    return Array.from({ length: count }, (_, index) => additionWithCarry(rng, difficulty, index))
  }
  if (typeId === RULER_SEGMENT_TYPE) {
    return Array.from({ length: count }, (_, index) => measureSegment(rng, difficulty, index))
  }
  return undefined
}

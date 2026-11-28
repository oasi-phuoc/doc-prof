import { columnItem, fmt } from './column-arith'
import { int, type Rng } from './rng'
import { DEFAULT_REAL_MAP_ID, realMapPlan } from './real-map-catalog'
import { isCfrGuidedType, tryGenerateCfrGuided } from './cfr-guided-practice'
import type { Difficulty, MathItem } from './types'

export { SION_GRID, SION_PLACES } from './real-map-catalog'

export const ADDITION_CARRY_TYPE = 'addition-retenue-guidee'
export const SUBTRACTION_EXCHANGE_TYPE = 'soustraction-echange-guide'
export const RULER_SEGMENT_TYPE = 'mesures-lire-segment'
export const RECTANGLE_MEASURES_TYPE = 'aires-perimetre-rectangle-guide'
export const TRANSLATION_PRACTICE_TYPE = 'transformations-translation-guidee'
export const REAL_MAP_TYPE = 'reperage-plan-sion'

export function isGuidedColumnType(typeId: string): boolean {
  return typeId === ADDITION_CARRY_TYPE || typeId === SUBTRACTION_EXCHANGE_TYPE
}

export function isSingleColumnPractice(typeId: string): boolean {
  return typeId === RULER_SEGMENT_TYPE || typeId === RECTANGLE_MEASURES_TYPE ||
    typeId === TRANSLATION_PRACTICE_TYPE || typeId === REAL_MAP_TYPE || isCfrGuidedType(typeId)
}

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

export function subtractionExchangeItem(a: number, b: number, guided: boolean): MathItem {
  const item = columnItem('−', a, b, a - b, false)
  const top = item.digitsA!.map(Number)
  const bottom = item.digitsB!.map(Number)
  for (let column = top.length - 1; column > 0; column--) {
    if (top[column]! < bottom[column]!) {
      let source = column - 1
      while (top[source] === 0) source--
      top[source] = top[source]! - 1
      for (let crossed = source + 1; crossed < column; crossed++) top[crossed] = 9
      top[column] = top[column]! + 10
    }
  }
  return {
    ...item,
    subtractionExchange: {
      guided,
      digits: top.map((digit, index) => digit === Number(item.digitsA![index]) ? '' : String(digit)),
    },
    prompt: guided ? 'Échangez en commençant par les unités.' : 'Écrivez la différence.',
  }
}

function subtractionWithExchange(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const withZero = difficulty === 'avance' || (difficulty === 'moyen' && index > 0)
  const topUnits = int(rng, 1, 6)
  const bottomUnits = int(rng, topUnits + 1, 9)
  const topTens = int(rng, 5, 9)
  const bottomTens = int(rng, 1, withZero ? 8 : topTens - 1)
  const a = (withZero ? int(rng, 2, 8) * 100 : topTens * 10) + topUnits
  const b = bottomTens * 10 + bottomUnits
  return subtractionExchangeItem(a, b, index === 0)
}

function rectangleMeasures(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const guided = index === 0
  const length = guided ? int(rng, 3, 4) : int(rng, 6, 8)
  const width = int(rng, 2, Math.min(length - 1, difficulty === 'facile' ? 3 : 5))
  return {
    layout: 'text',
    rectangleMeasures: { length, width, guided },
    answer: `${2 * (length + width)} cm · ${length * width} cm²`,
  }
}

type GridPoint = readonly [x: number, y: number]

export const TRANSLATION_GRID = { columns: 11, rows: 7 } as const

export function translatePoint([x, y]: GridPoint, [dx, dy]: GridPoint): GridPoint {
  return [x + dx, y + dy]
}

function translationPractice(rng: Rng, difficulty: Difficulty): MathItem {
  const guided = difficulty === 'facile'
  const left = difficulty === 'avance'
  const x = left ? int(rng, 6, 7) : int(rng, 1, 2)
  const y = guided ? 4 : int(rng, 2, 3)
  const figure: GridPoint[] = [[x, y], [x, y + 2], [x + 2, y + 2]]
  const vector: GridPoint = [left ? -int(rng, 4, 5) : int(rng, 4, 5), guided ? -1 : int(rng, 1, 2)]
  return { layout: 'text', translationPractice: { figure, vector, guided }, answer: figure.map((point, index) => {
    const [imageX, imageY] = translatePoint(point, vector)
    return `${'ABC'[index]}′ (${imageX} ; ${TRANSLATION_GRID.rows - imageY})`
  }).join(' · ') }
}

function readRealMap(rng: Rng, difficulty: Difficulty, id?: string): MathItem {
  const plan = realMapPlan(id)
  const target = int(rng, 0, plan.places.length - 1)
  const place = plan.places[target]!
  const reverse = difficulty === 'avance'
  return {
    layout: 'text',
    sionMap: { target, ...(plan.id !== DEFAULT_REAL_MAP_ID ? { planId: plan.id } : {}) },
    prompt: reverse ? `Quel lieu est dans la case ${place.code} ?` : `Dans quelle case se trouve ce lieu ?\n${place.name}`,
    answer: reverse ? place.name : place.code,
  }
}

export function tryGenerateGuidedPractice(
  typeId: string, rng: Rng, count: number, difficulty: Difficulty, realMapId?: string,
): MathItem[] | undefined {
  if (typeId === ADDITION_CARRY_TYPE) {
    return Array.from({ length: count }, (_, index) => additionWithCarry(rng, difficulty, index))
  }
  if (typeId === RULER_SEGMENT_TYPE) {
    return Array.from({ length: count }, (_, index) => measureSegment(rng, difficulty, index))
  }
  if (typeId === SUBTRACTION_EXCHANGE_TYPE) {
    return Array.from({ length: count }, (_, index) => subtractionWithExchange(rng, difficulty, index))
  }
  if (typeId === RECTANGLE_MEASURES_TYPE) {
    return Array.from({ length: count }, (_, index) => rectangleMeasures(rng, difficulty, index))
  }
  if (typeId === TRANSLATION_PRACTICE_TYPE) return [translationPractice(rng, difficulty)]
  if (typeId === REAL_MAP_TYPE) return [readRealMap(rng, difficulty, realMapId)]
  return tryGenerateCfrGuided(typeId, rng, count, difficulty)
}

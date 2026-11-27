import { fmt } from './column-arith'
import { int, shuffle, type Rng } from './rng'
import type { Difficulty, MathItem } from './types'

export const PLACE_VALUE_PRACTICE = 'nombres-groupements-guide'
export const DECIMAL_LINE_PRACTICE = 'decimaux-droite-guide'
export const SHAPE_PRACTICE = 'figures-nommer-guide'
export const LENGTH_PRACTICE = 'mesures-addition-longueurs'

export function isFundamentalPractice(typeId: string): boolean {
  return typeId === PLACE_VALUE_PRACTICE || typeId === DECIMAL_LINE_PRACTICE ||
    typeId === SHAPE_PRACTICE || typeId === LENGTH_PRACTICE
}

function placeValue(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const guided = index === 0
  const hundreds = int(rng, 1, difficulty === 'facile' ? 3 : 5)
  const tens = guided && difficulty === 'facile' ? int(rng, 1, 4) : 0
  const ones = int(rng, 1, 6)
  return {
    layout: 'text', baseTen: { hundreds, tens, ones },
    prompt: guided ? 'Comptez les groupes.\nÉcrivez le nombre.' : 'Écrivez le nombre. Pensez à la colonne vide.',
    answer: `${hundreds * 100 + tens * 10 + ones} = ${hundreds * 100} + ${tens * 10} + ${ones}`,
  }
}

function decimalLine(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const guided = index === 0
  const denominator = difficulty === 'avance' ? 100 : 10
  const intervals = guided ? 5 : 10
  const whole = int(rng, 1, 6)
  const startUnits = whole * denominator + (difficulty === 'facile' ? 0 : int(rng, 1, 7) * (denominator / 10))
  const target = guided ? int(rng, 2, 4) : int(rng, 1, 9)
  const labelAt = guided ? 1 : intervals
  const start = startUnits / denominator
  const step = 1 / denominator

  return {
    layout: 'text', numberLine: { start, step, intervals, target, labelAt },
    prompt: guided ? 'Comptez les pas depuis le premier nombre.\nLisez le nombre sous la flèche.' : 'Écrivez le nombre indiqué par la flèche.',
    answer: `${fmt((startUnits + target) / denominator)}. Un pas vaut ${fmt(step)}.`,
  }
}

const shapes = [
  { kind: 'triangle', name: 'Triangle', properties: '3 côtés' },
  { kind: 'carre', name: 'Carré', properties: '4 côtés égaux et 4 angles droits' },
  { kind: 'rectangle', name: 'Rectangle', properties: '4 angles droits, deux côtés longs et deux côtés courts' },
] as const

function identifyShapes(rng: Rng, difficulty: Difficulty, count: number): MathItem[] {
  const ordered = shuffle(rng, shapes)
  return Array.from({ length: count }, (_, index) => {
    const { kind, name, properties } = ordered[index % ordered.length]!
    const angle = difficulty === 'facile' && index === 0 ? 0 : int(rng, 2, 7) * 11
    return {
      layout: 'text', shapePractice: { kind, angle },
      prompt: index === 0 ? 'Comptez les côtés.\nNommez la forme.' : 'Écrivez le nom de la forme tournée.',
      answer: `${name}. ${properties}.`,
    }
  })
}

function sumLengths(rng: Rng, difficulty: Difficulty, index: number): MathItem {
  const cm = int(rng, 2, difficulty === 'facile' ? 5 : 8)
  const mm = int(rng, 1, difficulty === 'avance' ? 19 : 9)
  return {
    layout: 'text', lengthPractice: { cm, mm },
    prompt: index === 0 ? 'Changez les cm en mm.\nAdditionnez les deux longueurs.' : 'Écrivez la longueur totale en mm.',
    answer: `${cm * 10} mm + ${mm} mm = ${cm * 10 + mm} mm.`,
  }
}

export function tryGenerateFundamentalPractice(typeId: string, rng: Rng, count: number, difficulty: Difficulty): MathItem[] | undefined {
  if (typeId === SHAPE_PRACTICE) return identifyShapes(rng, difficulty, count)
  if (typeId === PLACE_VALUE_PRACTICE) return Array.from({ length: count }, (_, i) => placeValue(rng, difficulty, i))
  if (typeId === DECIMAL_LINE_PRACTICE) return Array.from({ length: count }, (_, i) => decimalLine(rng, difficulty, i))
  if (typeId === LENGTH_PRACTICE) return Array.from({ length: count }, (_, i) => sumLengths(rng, difficulty, i))
  return undefined
}

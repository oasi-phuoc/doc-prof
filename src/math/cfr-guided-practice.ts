import { int, shuffle, type Rng } from './rng'
import type { Difficulty, ExerciseType, MathItem } from './types'

const FRACTION = 'fractions-quantite-guidee'
const GRAPH = 'fonctions-lire-graphique-guide'
const EQUATION = 'equations-isoler-guide'
const ROTATION = 'transformations-rotation-guidee'
const REFLECTION = 'transformations-axiale-guidee'
const HALF_TURN = 'transformations-centrale-guidee'

const types = [
  [FRACTION, 'fractions', 'Fraction d’une quantité, pas à pas', 'Partagez la quantité en parts égales.'],
  [GRAPH, 'fonctions', 'Lire un graphique, pas à pas', 'Lisez les valeurs sur le graphique.'],
  [EQUATION, 'equations', 'Trouver x, pas à pas', 'Faites le même calcul des deux côtés du signe égal.'],
  [ROTATION, 'transformations', 'Rotation, pas à pas', 'Tournez le triangle autour du point O.'],
  [REFLECTION, 'transformations', 'Symétrie axiale, pas à pas', 'Tracez le reflet du triangle de l’autre côté de l’axe.'],
  [HALF_TURN, 'transformations', 'Symétrie centrale, pas à pas', 'Faites un demi-tour autour du point O.'],
] as const

export const CFR_GUIDED_TYPES: ExerciseType[] = types.map(([id, topic, label, instruction]) => ({
  id, topic, label, instruction, description: instruction, visual: 'texte',
  preferredCount: 2, maxCount: 2, preferredColumns: 1, supportsNumberRange: false,
}))

export function isCfrGuidedType(typeId: string): boolean {
  return types.some(([id]) => id === typeId)
}

type Point = readonly [x: number, y: number]
type FractionPractice = { kind: 'fraction'; total: number; numerator: number; denominator: number }
type GraphPractice = { kind: 'graph'; context: 'temperature' | 'livres'; values: number[]; step: number; day: number; compareWith?: number }
type EquationPractice = { kind: 'equation'; coefficient: number; offset: number; solution: number }
type TransformPractice = { kind: 'rotation' | 'axiale' | 'centrale'; points: Point[]; clockwise: boolean; horizontal: boolean }
export type CfrGuidedPractice = { guided: boolean } & (FractionPractice | GraphPractice | EquationPractice | TransformPractice)

export const CFR_DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi'] as const
export const CFR_GRID = { columns: 10, rows: 8, center: [5, 4] as Point }

export function transformedPoint([x, y]: Point, practice: TransformPractice): Point {
  const [cx, cy] = CFR_GRID.center
  const dx = x - cx
  const dy = y - cy
  if (practice.kind === 'axiale') return practice.horizontal ? [x, cy - dy] : [cx - dx, y]
  if (practice.kind === 'centrale') return [cx - dx, cy - dy]
  return practice.clockwise ? [cx - dy, cy + dx] : [cx + dy, cy - dx]
}

export function equationText({ coefficient, offset, solution }: EquationPractice): string {
  const term = coefficient === 1 ? 'x' : `${coefficient}x`
  const change = offset === 0 ? '' : ` ${offset > 0 ? '+' : '−'} ${Math.abs(offset)}`
  return `${term}${change} = ${coefficient * solution + offset}`
}

export function equationHelp({ coefficient, offset }: EquationPractice): string {
  if (offset > 0) return `Soustrayez ${offset} des deux côtés.`
  if (offset < 0) return `Ajoutez ${-offset} des deux côtés.`
  return `Divisez les deux côtés par ${coefficient}.`
}

function graphUnit(practice: GraphPractice): string {
  return practice.context === 'temperature' ? '°C' : 'livres'
}

export function cfrSolution(practice: CfrGuidedPractice): string[] {
  switch (practice.kind) {
    case 'fraction': {
      const { total, numerator, denominator } = practice
      const part = total / denominator
      return [`${total} ÷ ${denominator} = ${part} jetons par part.`, `${numerator} × ${part} = ${numerator * part} jetons.`]
    }
    case 'graph': {
      const { values, day, compareWith } = practice
      const unit = graphUnit(practice)
      const value = values[day]!
      if (compareWith === undefined) {
        const label = unit === 'livres' && value === 1 ? 'livre' : unit
        return [`Le ${CFR_DAYS[day]}, je lis ${value} ${label}.`]
      }
      const other = values[compareWith]!
      return [
        `${CFR_DAYS[day]} : ${value} ${unit}. ${CFR_DAYS[compareWith]} : ${other} ${unit}.`,
        `${Math.max(value, other)} − ${Math.min(value, other)} = ${Math.abs(value - other)} ${unit}.`,
      ]
    }
    case 'equation': {
      const { coefficient, offset, solution } = practice
      const beforeDivision = coefficient * solution
      return [
        equationHelp(practice),
        ...(coefficient > 1 && offset !== 0 ? [`${coefficient}x = ${beforeDivision}.`, `Divisez les deux côtés par ${coefficient}.`] : []),
        `x = ${solution}.`,
      ]
    }
    default:
      return practice.points.map((point, index) => {
        const [x, row] = transformedPoint(point, practice)
        return `${'ABC'[index]}′ (${x} ; ${CFR_GRID.rows - row})`
      })
  }
}

export function cfrTransformationHelp(practice: TransformPractice): string {
  const { kind, clockwise, horizontal } = practice
  if (kind === 'axiale') return `Gardez la même ${horizontal ? 'colonne' : 'ligne'}. Reportez la distance de l’autre côté de l’axe.`
  if (kind === 'centrale') return 'Alignez le sommet, O et son image. O est au milieu.'
  return `Faites un quart de tour ${clockwise ? 'dans le sens des aiguilles d’une montre' : 'dans le sens inverse des aiguilles d’une montre'}.`
}

export function cfrPrompt(practice: CfrGuidedPractice): string {
  switch (practice.kind) {
    case 'fraction': return `Combien font ${practice.numerator}/${practice.denominator} de ${practice.total} jetons ?`
    case 'equation': return 'Trouvez le nombre x.'
    case 'graph': {
      const { day, compareWith, context } = practice
      if (compareWith !== undefined) return `Quel écart lisez-vous entre ${CFR_DAYS[day]} et ${CFR_DAYS[compareWith]} ?`
      return context === 'temperature'
        ? `Quelle température fait-il ${CFR_DAYS[day]} à midi ?`
        : `Combien de livres ont été empruntés ${CFR_DAYS[day]} ?`
    }
    default: return practice.kind === 'rotation' ? cfrTransformationHelp(practice) : 'Placez les images de A, B et C.'
  }
}

export function cfrExample(practice: CfrGuidedPractice): CfrGuidedPractice {
  switch (practice.kind) {
    case 'fraction': return { ...practice, total: 6, numerator: 2, denominator: 3 }
    case 'graph': return { ...practice, values: [0, 4, 3, 5].map(v => v * practice.step), day: 1, compareWith: practice.compareWith === undefined ? undefined : 0 }
    case 'equation': return { ...practice, coefficient: practice.coefficient === 1 ? 1 : 3, offset: Math.sign(practice.offset) * 4, solution: 4 }
    default: return { ...practice, points: [[2, 1], [2, 3], [4, 3]] }
  }
}

function generatePractice(typeId: string, rng: Rng, difficulty: Difficulty, index: number): CfrGuidedPractice | undefined {
  const guided = index === 0
  if (typeId === FRACTION) {
    const denominator = int(rng, 2, difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 6 : 8)
    return {
      kind: 'fraction', denominator, guided,
      numerator: difficulty === 'facile' ? 1 : int(rng, 1, denominator - 1),
      total: denominator * (guided ? int(rng, 3, 6) : int(rng, 7, difficulty === 'avance' ? 12 : 9)),
    }
  }
  if (typeId === GRAPH) {
    const step = difficulty === 'facile' ? 1 : difficulty === 'moyen' ? 2 : 5
    const values = shuffle(rng, [1, 2, 3, 4, 5]).slice(0, 4).map(value => value * step)
    const day = int(rng, 0, 3)
    return {
      kind: 'graph', context: index % 2 === 0 ? 'temperature' : 'livres',
      values, step, day, guided, compareWith: difficulty === 'avance' ? (day + int(rng, 1, 3)) % 4 : undefined,
    }
  }
  if (typeId === EQUATION) {
    const coefficient = difficulty === 'avance' || (difficulty === 'moyen' && !guided) ? int(rng, 2, 6) : 1
    const solution = guided ? int(rng, 5, 8) : int(rng, 9, 12)
    const change = int(rng, 1, 4)
    const offset = difficulty === 'facile' ? change : difficulty === 'moyen' ? (guided ? -change : 0) : (int(rng, 0, 1) ? change : -change)
    return { kind: 'equation', coefficient, offset, solution, guided }
  }
  const kind = typeId === ROTATION ? 'rotation' : typeId === REFLECTION ? 'axiale' : typeId === HALF_TURN ? 'centrale' : undefined
  if (!kind) return undefined
  const x = int(rng, 2, 3)
  const y = guided ? 1 : 2
  return {
    kind, guided, clockwise: difficulty === 'facile' || int(rng, 0, 1) === 1,
    horizontal: difficulty === 'avance' && index > 0,
    points: [[x, y], [x, y + 1], [x + 1, y + 1]],
  }
}

export function tryGenerateCfrGuided(typeId: string, rng: Rng, count: number, difficulty: Difficulty): MathItem[] | undefined {
  if (!isCfrGuidedType(typeId)) return undefined
  return Array.from({ length: count }, (_, index) => {
    const practice = generatePractice(typeId, rng, difficulty, index)!
    return {
      layout: 'text', cfrGuided: practice,
      prompt: cfrPrompt(practice), answer: cfrSolution(practice).join('\n'),
    }
  })
}

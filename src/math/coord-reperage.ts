import { shuffle, type Rng } from './rng'
import type {
  CoordAxis,
  CoordMark,
  CoordQuestion,
  CoordScene,
  CoordShape,
  Difficulty,
  MathItem,
  PageConfig,
} from './types'

export function isReperageFormes(typeId: string): boolean {
  return typeId === 'reperage-lire' || typeId === 'reperage-placer'
}

export const COORD_SHAPES: CoordShape[] = [
  'circle',
  'triangle',
  'square',
  'diamond',
  'star',
  'plus',
  'heart',
  'pentagon',
  'point',
]

export const COORD_SHAPE_LABEL: Record<CoordShape, string> = {
  point: 'point',
  circle: 'disque',
  triangle: 'triangle',
  square: 'carré',
  diamond: 'losange',
  star: 'étoile',
  plus: 'plus',
  heart: 'cœur',
  pentagon: 'pentagone',
}

export function coordSizeFor(difficulty: Difficulty): { cols: number; rows: number } {
  if (difficulty === 'facile') return { cols: 5, rows: 5 }
  if (difficulty === 'moyen') return { cols: 7, rows: 7 }
  return { cols: 10, rows: 10 }
}

export function clampCoordSize(n: number): number {
  return Math.max(3, Math.min(12, Math.round(n) || 5))
}

export function columnLetter(index: number): string {
  return String.fromCharCode(64 + index)
}

export function formatCellCoord(x: number, y: number, axis: CoordAxis): string {
  if (axis === 'letters') return `(${columnLetter(x)} ; ${y})`
  return `(${x} ; ${y})`
}

export function formatPolarCoord(ray: number, ring: number): string {
  return `(${columnLetter(ray)} ; ${ring})`
}

function uniqueCells(rng: Rng, cols: number, rows: number, count: number): Array<{ x: number; y: number }> {
  const cells: Array<{ x: number; y: number }> = []
  for (let x = 1; x <= cols; x++) {
    for (let y = 1; y <= rows; y++) cells.push({ x, y })
  }
  return shuffle(rng, cells).slice(0, Math.min(count, cells.length))
}

function questionsFromMarks(marks: CoordMark[], axis: CoordAxis, variant: CoordScene['variant']): CoordQuestion[] {
  const totals = new Map<string, number>()
  for (const mark of marks) {
    const key = mark.label ?? COORD_SHAPE_LABEL[mark.kind]
    totals.set(key, (totals.get(key) ?? 0) + 1)
  }
  const seen = new Map<string, number>()
  return marks.map((mark) => {
    const base = mark.label ? `Point ${mark.label}` : COORD_SHAPE_LABEL[mark.kind]
    const key = mark.label ?? COORD_SHAPE_LABEL[mark.kind]
    let prompt = base
    if (!mark.label && (totals.get(key) ?? 0) > 1) {
      const n = (seen.get(key) ?? 0) + 1
      seen.set(key, n)
      prompt = `${base} ${n}`
    }
    return {
      prompt,
      answer: variant === 'polar' ? formatPolarCoord(mark.x, mark.y) : formatCellCoord(mark.x, mark.y, axis),
      kind: mark.kind,
    }
  })
}

function itemFromScene(
  scene: CoordScene,
  questions: CoordQuestion[],
  prompt: string,
  task: 'read' | 'place',
): MathItem {
  return {
    layout: 'coord',
    prompt,
    coordScene: scene,
    coordQuestions: questions,
    coordTask: task,
    answer: questions.map((q) => `${q.prompt} : ${q.answer}`).join(' · '),
  }
}

function generateCells(rng: Rng, cols: number, rows: number, count: number, axis: CoordAxis): {
  scene: CoordScene
  questions: CoordQuestion[]
} {
  const kinds = shuffle(rng, COORD_SHAPES.filter((k) => k !== 'point'))
  const cells = uniqueCells(rng, cols, rows, count)
  const marks: CoordMark[] = cells.map((cell, i) => ({
    x: cell.x,
    y: cell.y,
    kind: kinds[i % kinds.length]!,
  }))
  const scene: CoordScene = { variant: 'cells', cols, rows, axis, marks }
  return { scene, questions: questionsFromMarks(marks, axis, 'cells') }
}

export function sceneFromLibre(config: PageConfig): CoordScene {
  const cols = clampCoordSize(config.coordCols ?? 7)
  const rows = clampCoordSize(config.coordRows ?? 7)
  const axis = config.coordAxis === 'numeric' ? 'numeric' : 'letters'
  const marks = (config.coordMarks ?? []).filter((mark) => mark.x >= 1 && mark.x <= cols && mark.y >= 1 && mark.y <= rows)
  return { variant: 'cells', cols, rows, axis, marks }
}

export function tryGenerateReperage(
  config: PageConfig,
  rng: Rng,
): { items: MathItem[]; instruction: string } | null {
  if (!isReperageFormes(config.exerciseType)) return null
  const difficulty = config.difficulty ?? 'moyen'
  const task = config.exerciseType === 'reperage-placer' ? 'place' : 'read'
  const instruction =
    task === 'place'
      ? 'Dessinez chaque forme à l’emplacement indiqué.'
      : 'Écrivez les coordonnées de chaque forme.'

  if (config.coordLibre) {
    const scene = sceneFromLibre(config)
    const limited = { ...scene, marks: scene.marks.slice(0, Math.max(1, config.count || scene.marks.length || 1)) }
    const questions = questionsFromMarks(limited.marks, limited.axis, limited.variant)
    return {
      instruction,
      items: [itemFromScene(limited, questions, instruction, task)],
    }
  }

  const { cols, rows } = coordSizeFor(difficulty)
  const markCount = Math.max(1, Math.min(config.count || 5, cols * rows))
  const axis: CoordAxis = difficulty === 'avance' || (difficulty === 'moyen' && rng() < 0.45) ? 'numeric' : 'letters'
  const cells = generateCells(rng, cols, rows, markCount, axis)
  return {
    instruction,
    items: [itemFromScene(cells.scene, cells.questions, instruction, task)],
  }
}

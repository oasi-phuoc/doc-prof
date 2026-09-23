import { pick, shuffle, type Rng } from './rng'
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

export function isReperageCadrans(typeId: string): boolean {
  return (
    typeId === 'reperage-cadrans-lire' ||
    typeId === 'reperage-cadrans-placer' ||
    typeId === 'reperage-cadrans-libre'
  )
}

export function isReperagePage(typeId: string): boolean {
  return isReperageFormes(typeId) || isReperageCadrans(typeId)
}

export function axesRangeFor(difficulty: Difficulty): number {
  if (difficulty === 'facile') return 4
  if (difficulty === 'moyen') return 6
  return 6
}

export function axesStepFor(difficulty: Difficulty): number {
  return difficulty === 'avance' ? 0.5 : 1
}

export function clampCoordRange(n: number): number {
  return Math.max(3, Math.min(10, Math.round(n) || 5))
}

export function formatAxesNum(n: number): string {
  const sign = n < 0 ? '−' : ''
  const abs = Math.abs(n)
  const body = Number.isInteger(abs) ? String(abs) : String(abs).replace('.', ',')
  return `${sign}${body}`
}

export function formatAxesCoord(x: number, y: number): string {
  return `(${formatAxesNum(x)} ; ${formatAxesNum(y)})`
}

export function nextPointLabel(marks: CoordMark[]): string {
  const used = new Set(marks.map((mark) => mark.label).filter(Boolean))
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i)
    if (!used.has(letter)) return letter
  }
  return 'A'
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

function questionsFromAxes(marks: CoordMark[]): CoordQuestion[] {
  return marks.map((mark) => ({
    prompt: mark.label ?? 'A',
    answer: formatAxesCoord(mark.x, mark.y),
    kind: 'point',
  }))
}

function ticks(range: number, step: number): number[] {
  const values: number[] = []
  const n = Math.round((2 * range) / step)
  for (let i = 0; i <= n; i++) {
    values.push(Math.round((-range + i * step) * 1000) / 1000)
  }
  return values
}

function generateAxesPoints(rng: Rng, range: number, step: number, count: number): CoordMark[] {
  const xs = ticks(range, step)
  const ys = ticks(range, step)
  const pool: Array<{ x: number; y: number }> = []
  const quads: Array<Array<{ x: number; y: number }>> = [[], [], [], []]
  for (const x of xs) {
    for (const y of ys) {
      if (x === 0 && y === 0) continue
      const pt = { x, y }
      pool.push(pt)
      if (x > 0 && y > 0) quads[0]!.push(pt)
      else if (x < 0 && y > 0) quads[1]!.push(pt)
      else if (x < 0 && y < 0) quads[2]!.push(pt)
      else if (x > 0 && y < 0) quads[3]!.push(pt)
    }
  }
  const chosen: Array<{ x: number; y: number }> = []
  if (count >= 4) {
    for (const quad of quads) {
      if (quad.length) chosen.push(pick(rng, quad))
    }
  }
  const rest = shuffle(
    rng,
    pool.filter((pt) => !chosen.some((c) => c.x === pt.x && c.y === pt.y)),
  )
  const points = [...chosen, ...rest].slice(0, Math.min(count, pool.length))
  return points.map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    kind: 'point',
    label: String.fromCharCode(65 + i),
  }))
}

export function sceneFromAxesLibre(config: PageConfig, difficulty: Difficulty): CoordScene {
  const range = clampCoordRange(config.coordRange ?? axesRangeFor(difficulty))
  const step = axesStepFor(difficulty)
  const marks = (config.coordMarks ?? []).filter((mark) => Math.abs(mark.x) <= range && Math.abs(mark.y) <= range)
  return {
    variant: 'axes',
    cols: range * 2,
    rows: range * 2,
    axis: 'numeric',
    range,
    step,
    marks,
  }
}

export function tryGenerateReperage(
  config: PageConfig,
  rng: Rng,
): { items: MathItem[]; instruction: string } | null {
  if (isReperageCadrans(config.exerciseType)) {
    const difficulty = config.difficulty ?? 'moyen'
    const task = config.exerciseType === 'reperage-cadrans-placer' ? 'place' : 'read'
    const instruction =
      task === 'place'
        ? 'Placez chaque point à l’emplacement indiqué.'
        : 'Écrivez les coordonnées de chaque point.'
    const libre = Boolean(config.coordLibre) || config.exerciseType === 'reperage-cadrans-libre'
    if (libre) {
      const scene = sceneFromAxesLibre(config, difficulty)
      const limited = { ...scene, marks: scene.marks.slice(0, Math.max(0, config.count || scene.marks.length)) }
      return {
        instruction,
        items: [itemFromScene(limited, questionsFromAxes(limited.marks), instruction, task)],
      }
    }
    const range = axesRangeFor(difficulty)
    const step = axesStepFor(difficulty)
    const maxPts = ticks(range, step).length ** 2 - 1
    const markCount = Math.max(1, Math.min(config.count || 6, maxPts))
    const marks = generateAxesPoints(rng, range, step, markCount)
    const scene: CoordScene = {
      variant: 'axes',
      cols: range * 2,
      rows: range * 2,
      axis: 'numeric',
      range,
      step,
      marks,
    }
    return {
      instruction,
      items: [itemFromScene(scene, questionsFromAxes(marks), instruction, task)],
    }
  }

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

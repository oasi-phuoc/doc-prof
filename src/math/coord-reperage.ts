import { int, pick, shuffle, type Rng } from './rng'
import type {
  CoordAxis,
  CoordMark,
  CoordQuestion,
  CoordScene,
  CoordShape,
  CoordVertex,
  Difficulty,
  MathItem,
  PageConfig,
} from './types'

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
  return marks.map((mark) => ({
    prompt: mark.label
      ? `Point ${mark.label}`
      : COORD_SHAPE_LABEL[mark.kind],
    answer: variant === 'polar' ? formatPolarCoord(mark.x, mark.y) : formatCellCoord(mark.x, mark.y, axis),
    kind: mark.kind,
  }))
}

function questionsFromVertices(vertices: CoordVertex[]): CoordQuestion[] {
  return vertices.map((vertex) => ({
    prompt: `Sommet ${vertex.label}`,
    answer: `(${vertex.x} ; ${vertex.y})`,
  }))
}

function itemFromScene(scene: CoordScene, questions: CoordQuestion[], prompt: string): MathItem {
  return {
    layout: 'coord',
    prompt,
    coordScene: scene,
    coordQuestions: questions,
    answer: questions.map((q) => `${q.prompt} : ${q.answer}`).join(' · '),
  }
}

function generatePolygon(rng: Rng, cols: number, rows: number): CoordVertex[] {
  const kind = pick(rng, ['l', 'house', 'steps', 'rect'] as const)
  const ox = int(rng, 1, Math.max(1, cols - 6))
  const oy = int(rng, 1, Math.max(1, rows - 6))
  const raw: Array<{ x: number; y: number }> =
    kind === 'l'
      ? [
          { x: 0, y: 0 },
          { x: 4, y: 0 },
          { x: 4, y: 2 },
          { x: 2, y: 2 },
          { x: 2, y: 5 },
          { x: 0, y: 5 },
        ]
      : kind === 'house'
        ? [
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 4, y: 3 },
            { x: 2, y: 5 },
            { x: 0, y: 3 },
          ]
        : kind === 'steps'
          ? [
              { x: 0, y: 0 },
              { x: 6, y: 0 },
              { x: 6, y: 2 },
              { x: 4, y: 2 },
              { x: 4, y: 4 },
              { x: 2, y: 4 },
              { x: 2, y: 6 },
              { x: 0, y: 6 },
            ]
          : [
              { x: 0, y: 0 },
              { x: 5, y: 0 },
              { x: 5, y: 3 },
              { x: 0, y: 3 },
            ]
  const maxX = Math.max(...raw.map((p) => p.x))
  const maxY = Math.max(...raw.map((p) => p.y))
  const scale = Math.min((cols - ox) / maxX, (rows - oy) / maxY, 1)
  return raw.map((p, i) => ({
    x: Math.round((ox + p.x * scale) * 10) / 10,
    y: Math.round((oy + p.y * scale) * 10) / 10,
    label: String.fromCharCode(65 + i),
  }))
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

function generatePolar(rng: Rng, count: number): { scene: CoordScene; questions: CoordQuestion[] } {
  const rays = 6
  const rings = 4
  const kinds = shuffle(rng, COORD_SHAPES.filter((k) => k !== 'point'))
  const cells = uniqueCells(rng, rays, rings, count)
  const marks: CoordMark[] = cells.map((cell, i) => ({
    x: cell.x,
    y: cell.y,
    kind: kinds[i % kinds.length]!,
  }))
  const scene: CoordScene = { variant: 'polar', cols: rays, rows: rings, axis: 'letters', marks }
  return { scene, questions: questionsFromMarks(marks, 'letters', 'polar') }
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
  if (config.exerciseType !== 'reperage-lire') return null
  const difficulty = config.difficulty ?? 'moyen'

  if (config.coordLibre) {
    const scene = sceneFromLibre(config)
    const questions = questionsFromMarks(scene.marks, scene.axis, scene.variant)
    return {
      instruction: 'Écrivez les coordonnées de chaque forme.',
      items: [itemFromScene(scene, questions, 'Écrivez les coordonnées de chaque forme.')],
    }
  }

  const { cols, rows } = coordSizeFor(difficulty)
  const markCount = Math.max(3, Math.min(config.count || 5, cols * rows, 10))

  if (difficulty === 'avance' && rng() < 0.34) {
    const polar = generatePolar(rng, markCount)
    return {
      instruction: 'Écrivez le rayon et le cercle de chaque forme, sous la forme (rayon ; cercle).',
      items: [itemFromScene(polar.scene, polar.questions, 'Écrivez les coordonnées de chaque forme.')],
    }
  }

  if (difficulty !== 'facile' && rng() < (difficulty === 'avance' ? 0.4 : 0.28)) {
    const vertices = generatePolygon(rng, cols, rows)
    const scene: CoordScene = {
      variant: 'polygon',
      cols,
      rows,
      axis: 'numeric',
      marks: [],
      vertices,
    }
    return {
      instruction: 'Écrivez les coordonnées de chaque sommet.',
      items: [itemFromScene(scene, questionsFromVertices(vertices), 'Écrivez les coordonnées de chaque sommet.')],
    }
  }

  const axis: CoordAxis = difficulty === 'avance' || (difficulty === 'moyen' && rng() < 0.45) ? 'numeric' : 'letters'
  const cells = generateCells(rng, cols, rows, markCount, axis)
  return {
    instruction: 'Écrivez les coordonnées de chaque forme.',
    items: [itemFromScene(cells.scene, cells.questions, 'Écrivez les coordonnées de chaque forme.')],
  }
}

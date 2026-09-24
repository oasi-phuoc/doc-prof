import { int, pick, shuffle, type Rng } from './rng'
import type {
  CoordAxis,
  CoordAxesCellMm,
  CoordCellMm,
  CoordFormesCellMm,
  CoordMark,
  CoordQuestion,
  CoordScene,
  CoordShape,
  CoordUnitSquares,
  Difficulty,
  MathItem,
  PageConfig,
} from './types'

export const AXES_DEFAULT_COLS = 32
export const AXES_DEFAULT_ROWS = 18
export const DEFAULT_CELL_MM: CoordAxesCellMm = 5
export const DEFAULT_FORMES_CELL_MM: CoordFormesCellMm = 8
export const DEFAULT_UNIT_SQUARES: CoordUnitSquares = 1
export const CELL_MM_OPTIONS: CoordAxesCellMm[] = [3, 4, 5]
export const FORMES_CELL_MM_OPTIONS: CoordFormesCellMm[] = [6, 8, 10]
export const AXES_MAX_COLS = 56
export const AXES_MAX_ROWS = 36
const AXES_MAX_COLS_BY_MM: Record<CoordAxesCellMm, number> = { 3: 56, 4: 42, 5: 34 }

export type AxesGrid = {
  cols: number
  rows: number
  cellMm: CoordAxesCellMm
  unitSquares: CoordUnitSquares
  rangeX: number
  rangeY: number
  step: number
}

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

export function isReperageComposer(typeId: string): boolean {
  return typeId === 'reperage-cadrans-libre'
}

export function isReperageDroites(typeId: string): boolean {
  return typeId === 'reperage-droites'
}

export function isReperageConstruire(typeId: string): boolean {
  return typeId === 'reperage-construire'
}

export function isReperagePage(typeId: string): boolean {
  return (
    isReperageFormes(typeId) ||
    isReperageCadrans(typeId) ||
    isReperageDroites(typeId) ||
    isReperageConstruire(typeId)
  )
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
  return Math.max(3, Math.min(20, Math.round(n) || 5))
}

function evenBetween(n: number, min: number, max: number): number {
  const raw = Math.round(n) || min
  const even = raw % 2 === 0 ? raw : raw + (raw < min ? 1 : -1)
  return Math.max(min, Math.min(max, even < min ? min : even))
}

export function clampCellMm(n: number | undefined): CoordAxesCellMm {
  if (n === 3 || n === 4 || n === 5) return n
  return DEFAULT_CELL_MM
}

export function clampFormesCellMm(n: number | undefined): CoordFormesCellMm {
  if (n === 6 || n === 8 || n === 10) return n
  if (n === 3) return 6
  if (n === 4) return 8
  if (n === 5) return 10
  return DEFAULT_FORMES_CELL_MM
}

export function clampUnitSquares(n: number | undefined): CoordUnitSquares {
  return n === 2 ? 2 : 1
}

export function maxAxesColsForCell(cellMm: CoordCellMm): number {
  const axesMm = cellMm === 3 || cellMm === 4 || cellMm === 5 ? cellMm : DEFAULT_CELL_MM
  return AXES_MAX_COLS_BY_MM[axesMm]
}

export function maxAxesRowsForCell(cellMm: CoordCellMm): number {
  const axesMm = cellMm === 3 || cellMm === 4 || cellMm === 5 ? cellMm : DEFAULT_CELL_MM
  const max = evenBetween(Math.floor(190 / axesMm), 2, AXES_MAX_ROWS)
  return max
}

export function clampAxesCols(n: number, cellMm: CoordCellMm = DEFAULT_CELL_MM): number {
  return evenBetween(n, 2, maxAxesColsForCell(cellMm))
}

export function clampAxesRows(n: number, cellMm: CoordCellMm = DEFAULT_CELL_MM): number {
  return evenBetween(n, 2, maxAxesRowsForCell(cellMm))
}

export function axesExtent(cols: number, rows: number, unitSquares: CoordUnitSquares): {
  rangeX: number
  rangeY: number
} {
  return {
    rangeX: cols / 2 / unitSquares,
    rangeY: rows / 2 / unitSquares,
  }
}

export function resolveAxesGrid(config: Pick<PageConfig, 'coordCols' | 'coordRows' | 'coordRange' | 'coordCellMm' | 'coordUnitSquares' | 'difficulty'>, difficulty?: Difficulty): AxesGrid {
  const level = difficulty ?? config.difficulty ?? 'moyen'
  const cellMm = clampCellMm(config.coordCellMm)
  const unitSquares = clampUnitSquares(config.coordUnitSquares)
  const fallbackFromRange =
    config.coordRange != null ? clampCoordRange(config.coordRange) * 2 * unitSquares : undefined
  const fallbackCols = fallbackFromRange ?? AXES_DEFAULT_COLS
  const fallbackRows = fallbackFromRange ?? AXES_DEFAULT_ROWS
  const cols = clampAxesCols(config.coordCols ?? fallbackCols, cellMm)
  const rows = clampAxesRows(config.coordRows ?? fallbackRows, cellMm)
  const { rangeX, rangeY } = axesExtent(cols, rows, unitSquares)
  return {
    cols,
    rows,
    cellMm,
    unitSquares,
    rangeX,
    rangeY,
    step: axesStepFor(level),
  }
}

/** Maximum largeur × hauteur du tableau de formes, selon le côté du carré. */
export const FORMES_MAX_BY_MM: Record<CoordFormesCellMm, { cols: number; rows: number }> = {
  6: { cols: 26, rows: 20 },
  8: { cols: 21, rows: 15 },
  10: { cols: 16, rows: 12 },
}

export function maxFormesColsForCell(cellMm: CoordCellMm): number {
  return FORMES_MAX_BY_MM[clampFormesCellMm(cellMm)].cols
}

export function maxFormesRowsForCell(cellMm: CoordCellMm): number {
  return FORMES_MAX_BY_MM[clampFormesCellMm(cellMm)].rows
}

export function clampFormesCols(n: number, cellMm: CoordCellMm = DEFAULT_FORMES_CELL_MM): number {
  return Math.max(3, Math.min(maxFormesColsForCell(cellMm), Math.round(n) || 5))
}

export function clampFormesRows(n: number, cellMm: CoordCellMm = DEFAULT_FORMES_CELL_MM): number {
  return Math.max(3, Math.min(maxFormesRowsForCell(cellMm), Math.round(n) || 5))
}

export function resolveFormesGrid(
  config: Pick<PageConfig, 'coordCols' | 'coordRows' | 'coordCellMm' | 'difficulty'>,
  difficulty?: Difficulty,
): { cols: number; rows: number; cellMm: CoordFormesCellMm } {
  const level = difficulty ?? config.difficulty ?? 'moyen'
  const fallback = coordSizeFor(level)
  const cellMm = clampFormesCellMm(config.coordCellMm)
  return {
    cols: clampFormesCols(config.coordCols ?? fallback.cols, cellMm),
    rows: clampFormesRows(config.coordRows ?? fallback.rows, cellMm),
    cellMm,
  }
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
  'hexagon',
  'oval',
  'crescent',
  'arrow',
  'cross',
  'trapezoid',
  'house',
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
  hexagon: 'hexagone',
  oval: 'ovale',
  crescent: 'lune',
  arrow: 'flèche',
  cross: 'croix',
  trapezoid: 'trapèze',
  house: 'maison',
}

export function axisTickLabel(index: number, axis: CoordAxis, which: 'x' | 'y'): string {
  if (axis === 'letters' && which === 'x') return columnLetter(index)
  if (axis === 'letters-y' && which === 'y') return columnLetter(index)
  return String(index)
}

export function coordSizeFor(difficulty: Difficulty): { cols: number; rows: number } {
  if (difficulty === 'facile') return { cols: 6, rows: 6 }
  if (difficulty === 'moyen') return { cols: 8, rows: 8 }
  return { cols: 12, rows: 12 }
}

export const COORD_LETTER_MAX = 26

export function clampCoordSize(n: number): number {
  return clampFormesCols(n, 6)
}

export function centeredOrigin(cols: number, rows: number): { col: number; row: number } {
  return { col: cols / 2, row: rows / 2 }
}

export function clampOrigin(col: number, row: number, cols: number, rows: number): { col: number; row: number } {
  return {
    col: Math.max(0, Math.min(cols, Math.round(col))),
    row: Math.max(0, Math.min(rows, Math.round(row))),
  }
}

export function pickRandomOrigin(rng: Rng, cols: number, rows: number): { col: number; row: number } {
  const maxC = Math.max(0, cols)
  const maxR = Math.max(0, rows)
  if (maxC <= 2 || maxR <= 2) return centeredOrigin(cols, rows)
  const marginC = Math.max(1, Math.min(Math.floor(cols / 6), Math.floor(cols / 2) - 1))
  const marginR = Math.max(1, Math.min(Math.floor(rows / 6), Math.floor(rows / 2) - 1))
  return {
    col: int(rng, marginC, cols - marginC),
    row: int(rng, marginR, rows - marginR),
  }
}

export function remapMarksToOrigin(
  marks: CoordMark[],
  from: { col: number; row: number },
  to: { col: number; row: number },
  unit: number,
): CoordMark[] {
  return marks.map((mark) => ({
    ...mark,
    x: Math.round(((from.col + mark.x * unit - to.col) / unit) * 1000) / 1000,
    y: Math.round(((from.row + mark.y * unit - to.row) / unit) * 1000) / 1000,
  }))
}

export function markOnGrid(
  mark: CoordMark,
  origin: { col: number; row: number },
  cols: number,
  rows: number,
  unit: number,
): boolean {
  const gx = origin.col + mark.x * unit
  const gy = origin.row + mark.y * unit
  return gx >= -1e-8 && gx <= cols + 1e-8 && gy >= -1e-8 && gy <= rows + 1e-8
}

export function ensureGivenMark(marks: CoordMark[]): CoordMark[] {
  if (!marks.length) return marks
  if (marks.some((mark) => mark.given)) {
    return marks.map((mark) => (mark.given ? { ...mark, showCoord: true } : { ...mark, given: false }))
  }
  return [{ ...marks[0]!, given: true, showCoord: true }, ...marks.slice(1).map((mark) => ({ ...mark, given: false }))]
}

export function columnLetter(index: number): string {
  return String.fromCharCode(64 + index)
}

export function formatCellCoord(x: number, y: number, axis: CoordAxis): string {
  if (axis === 'letters') return `(${columnLetter(x)} ; ${y})`
  if (axis === 'letters-y') return `(${x} ; ${columnLetter(y)})`
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
      reply: 'pair',
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

function generateCells(
  rng: Rng,
  cols: number,
  rows: number,
  count: number,
  axis: CoordAxis,
  cellMm: CoordFormesCellMm,
): {
  scene: CoordScene
  questions: CoordQuestion[]
} {
  const kinds = shuffle(rng, COORD_SHAPES).slice(0, count)
  const cells = uniqueCells(rng, cols, rows, kinds.length)
  const marks: CoordMark[] = cells.map((cell, i) => ({
    x: cell.x,
    y: cell.y,
    kind: kinds[i]!,
  }))
  const scene: CoordScene = { variant: 'cells', cols, rows, axis, marks, cellMm }
  return { scene, questions: questionsFromMarks(marks, axis, 'cells') }
}

export function sceneFromLibre(config: PageConfig): CoordScene {
  const { cols, rows, cellMm } = resolveFormesGrid(config)
  const axis = config.coordAxis ?? 'letters'
  const seen = new Set<CoordShape>()
  const marks = (config.coordMarks ?? []).filter((mark) => {
    if (mark.x < 1 || mark.y < 1 || mark.x > cols || mark.y > rows) return false
    if (seen.has(mark.kind)) return false
    seen.add(mark.kind)
    return true
  })
  return { variant: 'cells', cols, rows, axis, marks, cellMm }
}

function questionsFromAxes(marks: CoordMark[]): CoordQuestion[] {
  return marks.map((mark) => ({
    prompt: mark.label ?? 'A',
    answer: formatAxesCoord(mark.x, mark.y),
    kind: 'point',
    reply: 'pair',
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

function generateAxesPoints(rng: Rng, rangeX: number, rangeY: number, step: number, count: number): CoordMark[] {
  const xs = ticks(rangeX, step)
  const ys = ticks(rangeY, step)
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
  const points = [...chosen, ...rest].slice(0, Math.min(count, pool.length, COORD_LETTER_MAX))
  return points.map((pt, i) => ({
    x: pt.x,
    y: pt.y,
    kind: 'point',
    label: String.fromCharCode(65 + i),
  }))
}

function generateComposerPoints(
  rng: Rng,
  cols: number,
  rows: number,
  origin: { col: number; row: number },
  unit: number,
  count: number,
): CoordMark[] {
  const pool: Array<{ x: number; y: number }> = []
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      if (c === origin.col && r === origin.row) continue
      pool.push({
        x: Math.round(((c - origin.col) / unit) * 1000) / 1000,
        y: Math.round(((r - origin.row) / unit) * 1000) / 1000,
      })
    }
  }
  const picked = shuffle(rng, pool).slice(0, Math.min(count, pool.length, COORD_LETTER_MAX))
  return ensureGivenMark(
    picked.map((pt, i) => ({
      x: pt.x,
      y: pt.y,
      kind: 'point' as const,
      label: String.fromCharCode(65 + i),
    })),
  )
}

export function sceneFromAxesLibre(config: PageConfig, difficulty: Difficulty): CoordScene {
  const grid = resolveAxesGrid(config, difficulty)
  const composer = isReperageComposer(config.exerciseType)
  const origin = composer
    ? clampOrigin(
        config.coordOriginCol ?? grid.cols / 2,
        config.coordOriginRow ?? grid.rows / 2,
        grid.cols,
        grid.rows,
      )
    : centeredOrigin(grid.cols, grid.rows)
  const raw = (config.coordMarks ?? []).filter((mark) =>
    markOnGrid(mark, origin, grid.cols, grid.rows, grid.unitSquares),
  )
  const marks = composer ? ensureGivenMark(raw) : raw
  return {
    variant: 'axes',
    cols: grid.cols,
    rows: grid.rows,
    axis: 'numeric',
    range: Math.max(grid.rangeX, grid.rangeY),
    rangeX: grid.rangeX,
    rangeY: grid.rangeY,
    cellMm: grid.cellMm,
    unitSquares: grid.unitSquares,
    originCol: origin.col,
    originRow: origin.row,
    hideAxes: composer,
    showOrigin: composer && Boolean(config.coordLibre),
    step: grid.step,
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
    const composer = isReperageComposer(config.exerciseType)
    if (composer && !config.coordLibre) {
      const grid = resolveAxesGrid(config, difficulty)
      const origin = pickRandomOrigin(rng, grid.cols, grid.rows)
      const findCount = Math.max(1, Math.min(config.count || 5, COORD_LETTER_MAX - 1))
      const marks = generateComposerPoints(rng, grid.cols, grid.rows, origin, grid.unitSquares, findCount + 1)
      const questions = questionsFromAxes(marks.filter((mark) => !mark.given))
      const scene: CoordScene = {
        variant: 'axes',
        cols: grid.cols,
        rows: grid.rows,
        axis: 'numeric',
        range: Math.max(grid.rangeX, grid.rangeY),
        rangeX: grid.rangeX,
        rangeY: grid.rangeY,
        cellMm: grid.cellMm,
        unitSquares: grid.unitSquares,
        originCol: origin.col,
        originRow: origin.row,
        hideAxes: true,
        showOrigin: false,
        step: grid.step,
        marks,
      }
      return {
        instruction:
          'Un point est donné avec ses coordonnées. Trouvez l’origine du repère, puis écrivez les coordonnées des autres points.',
        items: [itemFromScene(scene, questions, scene.marks[0] ? `Point ${scene.marks[0].label}` : instruction, 'read')],
      }
    }
    if (config.coordLibre) {
      const scene = sceneFromAxesLibre(config, difficulty)
      const given = composer ? scene.marks.filter((mark) => mark.given) : []
      const others = composer ? scene.marks.filter((mark) => !mark.given) : scene.marks
      const visible = [...given, ...others.slice(0, Math.max(0, config.count || others.length))]
      const limited = { ...scene, marks: visible, hideAxes: composer, showOrigin: false }
      const questions = questionsFromAxes(composer ? limited.marks.filter((mark) => !mark.given) : limited.marks)
      return {
        instruction: composer
          ? 'Un point est donné avec ses coordonnées. Trouvez l’origine du repère, puis écrivez les coordonnées des autres points.'
          : instruction,
        items: [itemFromScene(limited, questions, instruction, composer ? 'read' : task)],
      }
    }
    const grid = resolveAxesGrid(config, difficulty)
    const maxPts = ticks(grid.rangeX, grid.step).length * ticks(grid.rangeY, grid.step).length - 1
    const markCount = Math.max(1, Math.min(config.count || 6, maxPts))
    const marks = generateAxesPoints(rng, grid.rangeX, grid.rangeY, grid.step, markCount)
    const scene: CoordScene = {
      variant: 'axes',
      cols: grid.cols,
      rows: grid.rows,
      axis: 'numeric',
      range: Math.max(grid.rangeX, grid.rangeY),
      rangeX: grid.rangeX,
      rangeY: grid.rangeY,
      cellMm: grid.cellMm,
      unitSquares: grid.unitSquares,
      step: grid.step,
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
    const questions = questionsFromMarks(scene.marks, scene.axis, scene.variant)
    return {
      instruction,
      items: [itemFromScene(scene, questions, instruction, task)],
    }
  }

  const { cols, rows, cellMm } = resolveFormesGrid(config, difficulty)
  const markCount = Math.max(1, Math.min(config.count || 5, cols * rows, COORD_SHAPES.length))
  const axis: CoordAxis = config.coordAxis ?? (difficulty === 'avance' ? 'numeric' : 'letters')
  const cells = generateCells(rng, cols, rows, markCount, axis, cellMm)
  return {
    instruction,
    items: [itemFromScene(cells.scene, cells.questions, instruction, task)],
  }
}

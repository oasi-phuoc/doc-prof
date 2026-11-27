import { pickInRange, type NumberRange } from './difficulty'
import { int, pick, type Rng } from './rng'
import type { Difficulty, Figure, FigureDims, MathItem } from './types'

const PI = 3.14

export const PERI_QUAD_FIGURES: Figure[] = ['square', 'rectangle', 'parallelogram', 'rhombus', 'trapezoid']
export const AREA_QUAD_FIGURES: Figure[] = ['square', 'rectangle', 'parallelogram', 'rhombus', 'trapezoid']
export const VOLUME_QUAD_FIGURES: Figure[] = ['cube', 'cuboid']

export const QUAD_SHAPE_LABELS: Partial<Record<Figure, string>> = {
  square: 'Carré',
  rectangle: 'Rectangle',
  parallelogram: 'Parallélogramme',
  rhombus: 'Losange',
  trapezoid: 'Trapèze',
  cube: 'Cube',
  cuboid: 'Pavé',
}

function val(rng: Rng, difficulty: Difficulty, range?: NumberRange): number {
  if (range) {
    const n = pickInRange(rng, range)
    if (n > 0) return n
    return range.decimals ? 0.1 : 1
  }
  if (difficulty === 'facile') return int(rng, 1, 10)
  if (difficulty === 'moyen') return int(rng, 10, 1000)
  return int(rng, 10, 1000) / 10
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100
  const text = Number.isInteger(r) ? String(r) : String(r)
  return text.replace('.', ',')
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function geo(partial: {
  prompt: string
  figure: Figure
  dims: FigureDims
  calc: string
  response: string
}): MathItem {
  return {
    layout: 'geo',
    prompt: partial.prompt,
    figure: partial.figure,
    dims: partial.dims,
    calcAnswer: partial.calc,
    responseAnswer: partial.response,
    answer: partial.response,
  }
}

function triangleSides(rng: Rng, difficulty: Difficulty, range?: NumberRange): [number, number, number] {
  for (let i = 0; i < 24; i++) {
    const sides = [val(rng, difficulty, range), val(rng, difficulty, range), val(rng, difficulty, range)].sort((a, b) => a - b)
    if (sides[0]! + sides[1]! > sides[2]!) return [sides[0]!, sides[1]!, sides[2]!]
  }
  return difficulty === 'facile' ? [3, 4, 5] : [30, 40, 50]
}

const perimeterTools = {
  square: { keys: ['side'], unknown: 'side', factor: 4 },
  rectangle: { keys: ['length', 'width'], unknown: 'width', factor: 2 },
  triangle: { keys: ['a', 'b', 'c'], unknown: 'c', factor: 1 },
  parallelogram: { keys: ['base', 'side'], unknown: 'side', factor: 2 },
  rhombus: { keys: ['side'], unknown: 'side', factor: 4 },
  trapezoid: { keys: ['top', 'bottom', 'a', 'b'], unknown: 'b', factor: 1 },
  circle: { keys: ['radius'], unknown: 'radius', factor: 2 },
} satisfies Partial<Record<Figure, { keys: (keyof FigureDims)[]; unknown: FigureDims['ask']; factor: number }>>

type PlanarMeasureFigure = keyof typeof perimeterTools
type PerimeterDimension = (typeof perimeterTools)[PlanarMeasureFigure]['keys'][number]
type PerimeterKey = PerimeterDimension | 'perimeter' | 'perimeterPi'
type PerimeterValues = Partial<Record<PerimeterKey, number>> & { unit?: string }
const perimeterNames: Record<PerimeterKey, string> = {
  side: 'Côté', length: 'Longueur', width: 'Largeur', a: 'Côté A', b: 'Côté B', c: 'Côté C',
  base: 'Base', top: 'Base supérieure', bottom: 'Base inférieure', radius: 'Rayon',
  perimeter: 'Périmètre donné', perimeterPi: 'Valeur de π',
}

export function isPerimeterExercise(type: string): boolean {
  return /^perimetres-(?:carre|rectangle|triangle|parallelogramme|losange|trapeze|quadrilatere|cercle)(?:-manquant)?$/.test(type) ||
    type === 'perimetres-melange'
}

function planarMeasureFigure(item: MathItem): PlanarMeasureFigure | undefined {
  const figure = item.figure
  return item.layout === 'geo' && figure && Object.hasOwn(perimeterTools, figure) ? figure as PlanarMeasureFigure : undefined
}

function perimeterGiven(item: MathItem): number {
  const match = item.prompt?.match(/Le périmètre mesure ([0-9]+(?:[,.][0-9]+)?)/u)
  return item.dims?.perimeter ?? Number(match?.[1]?.replace(',', '.'))
}

export function perimeterInputs(item: MathItem): { key: PerimeterKey; label: string; value: number }[] {
  const figure = planarMeasureFigure(item)
  const dims = item.dims
  if (!figure || !dims) return []
  const keys: PerimeterKey[] = perimeterTools[figure].keys.filter((key) => key !== dims.ask)
  if (dims.ask) keys.unshift('perimeter')
  if (figure === 'circle') keys.push('perimeterPi')
  return keys.map((key) => ({
    key, label: perimeterNames[key],
    value: key === 'perimeter' ? perimeterGiven(item) : key === 'perimeterPi' ? dims.perimeterPi ?? PI : dims[key]!,
  }))
}

function perimeterItem(figure: PlanarMeasureFigure, dims: FigureDims, missing: boolean, given?: number): MathItem {
  const { keys, unknown, factor } = perimeterTools[figure]
  const pi = dims.perimeterPi ?? PI
  const unit = dims.unit ?? 'cm'
  const circle = figure === 'circle'
  const coefficient = factor * (circle ? pi : 1)
  const piLabel = String(pi).replace('.', ',')
  const known = keys.filter((key) => key !== unknown)
  const sum = (dimensions: PerimeterDimension[]) => dimensions.map((key) => fmt(dims[key]!)).join(' + ')
  const fixed = known.reduce((total, key) => total + (dims[key] ?? 0), 0)
  const size = given === undefined ? dims[unknown]! : given / coefficient - fixed
  const total = given ?? round2((fixed + size) * coefficient)
  const piText = circle ? ` Prenez π = ${piLabel}.` : ''
  const result = missing ? size : total
  const labeled: FigureDims = { ...dims, unit }
  if (figure === 'triangle') labeled.triangleKind = 'scalene'
  let calculation: string
  let prompt: string
  if (missing) {
    delete labeled[unknown]
    labeled.ask = unknown
    const base = coefficient === 1 ? fmt(total) : `${fmt(total)} ÷ ${circle ? `(2 × ${piLabel})` : factor}`
    calculation = [base, ...known.map((key) => fmt(dims[key]!))].join(' − ')
    const directive = figure === 'rectangle' ? `La longueur mesure ${fmt(dims.length!)} ${unit}. Calculez la largeur.`
      : figure === 'parallelogram' ? `La base mesure ${fmt(dims.base!)} ${unit}. Calculez l’autre côté.`
      : circle ? 'Calculez le rayon.'
      : known.length ? 'Calculez le côté marqué ?.'
      : 'Calculez le côté.'
    prompt = `Le périmètre mesure ${fmt(total)} ${unit}. ${directive}${piText}`
  } else {
    const parts = sum(keys)
    calculation = circle ? `2 × ${piLabel} × ${parts}`
      : factor === 1 ? parts : `${factor} × ${keys.length > 1 ? `(${parts})` : parts}`
    prompt = `Calculez le périmètre.${piText}`
  }
  return geo({ prompt, figure, dims: labeled, calc: calculation, response: `${fmt(result)} ${unit}` })
}

export function editPerimeter(item: MathItem, values: PerimeterValues): MathItem | undefined {
  const figure = planarMeasureFigure(item)
  if (!figure || !item.dims) return undefined
  const { keys, unknown, factor } = perimeterTools[figure]
  const missing = Boolean(item.dims.ask)
  const dims = { ...item.dims, ...values }
  const given = missing ? values.perimeter ?? perimeterGiven(item) : undefined
  if (Object.keys(values).length === 1 && values.unit !== undefined) {
    return { ...item, ...perimeterItem(figure, dims, missing, given) }
  }
  const pi = dims.perimeterPi ?? PI
  if (figure === 'circle' && !(pi >= 3 && pi <= 4)) return undefined
  const fixed = keys.filter((key) => key !== unknown).reduce((total, key) => total + (dims[key] ?? 0), 0)
  const dimensions = keys.map((key) => key === unknown && given !== undefined
    ? given / (factor * (figure === 'circle' ? pi : 1)) - fixed : dims[key]!)
  if (dimensions.some((value) => !Number.isFinite(value) || round2(value) <= 0)) return undefined
  if (figure === 'triangle' && Math.max(...dimensions) * 2 >= dimensions.reduce((sum, value) => sum + value, 0)) return undefined
  if (figure === 'trapezoid') {
    const [top, bottom, left, right] = dimensions as [number, number, number, number]
    const difference = Math.abs(top - bottom)
    if (difference >= left + right || difference < Math.abs(left - right) || (difference > 0 && difference === Math.abs(left - right))) return undefined
  }
  return { ...item, ...perimeterItem(figure, dims, missing, given) }
}

function periSquare(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return perimeterItem('square', { side: val(rng, difficulty, range) }, missing)
}

function periRectangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const length = val(rng, difficulty, range)
  let width = val(rng, difficulty, range)
  if (width === length) width = round2(width + (difficulty === 'avance' ? 0.5 : 1))
  return perimeterItem('rectangle', { length, width }, missing)
}

function periTriangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const [a, b, c] = triangleSides(rng, difficulty, range)
  return perimeterItem('triangle', { a, b, c }, missing)
}

function periParallelogram(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const base = val(rng, difficulty, range)
  const side = val(rng, difficulty, range)
  return perimeterItem('parallelogram', { base, side }, missing)
}

function periRhombus(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return perimeterItem('rhombus', { side: val(rng, difficulty, range) }, missing)
}

function periTrapezoid(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const top = val(rng, difficulty, range)
  const bottom = val(rng, difficulty, range)
  const a = val(rng, difficulty, range)
  const b = val(rng, difficulty, range)
  return perimeterItem('trapezoid', { top, bottom, a, b }, missing)
}

function periCircle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return perimeterItem('circle', { radius: val(rng, difficulty, range) }, missing)
}

const areaTools = {
  square: { keys: ['side'], unknown: 'side' },
  rectangle: { keys: ['length', 'width'], unknown: 'width' },
  triangle: { keys: ['base', 'height'], unknown: 'height' },
  parallelogram: { keys: ['base', 'height'], unknown: 'height' },
  rhombus: { keys: ['side', 'height'], unknown: 'height' },
  trapezoid: { keys: ['top', 'bottom', 'height'], unknown: 'height' },
  circle: { keys: ['radius'], unknown: 'radius' },
} satisfies Record<PlanarMeasureFigure, { keys: (keyof FigureDims)[]; unknown: FigureDims['ask'] }>

type AreaKey = (typeof areaTools)[PlanarMeasureFigure]['keys'][number] | 'area' | 'areaPi'
type AreaValues = Partial<Record<AreaKey, number>> & { unit?: string }
export type FigureMeasureValues = PerimeterValues & AreaValues

const areaNames: Record<AreaKey, string> = {
  side: 'Côté', length: 'Longueur', width: 'Largeur', base: 'Base', height: 'Hauteur',
  radius: 'Rayon', top: 'Base supérieure', bottom: 'Base inférieure', area: 'Aire donnée', areaPi: 'Valeur de π',
}

export function isAreaExercise(type: string): boolean {
  return /^aires-(?:carre|rectangle|triangle|parallelogramme|losange|trapeze|quadrilatere|disque)(?:-manquant)?$/.test(type) ||
    type === 'aires-melange'
}

function areaGiven(item: MathItem): number {
  const match = item.prompt?.match(/L’aire mesure ([0-9]+(?:[,.][0-9]+)?)/u)
  return item.dims?.area ?? Number(match?.[1]?.replace(',', '.'))
}

export function areaInputs(item: MathItem): { key: AreaKey; label: string; value: number }[] {
  const figure = planarMeasureFigure(item)
  const dims = item.dims
  if (!figure || !dims) return []
  const keys: AreaKey[] = areaTools[figure].keys.filter((key) => key !== dims.ask)
  if (dims.ask) keys.unshift('area')
  if (figure === 'circle') keys.push('areaPi')
  return keys.map((key) => ({
    key, label: areaNames[key],
    value: key === 'area' ? areaGiven(item) : key === 'areaPi' ? dims.areaPi ?? PI : dims[key]!,
  }))
}

function areaTerms(figure: PlanarMeasureFigure, dims: FigureDims) {
  if (figure === 'square') return { base: 1, text: '', divisor: 1 }
  if (figure === 'circle') {
    const pi = dims.areaPi ?? PI
    return { base: pi, text: String(pi).replace('.', ','), divisor: 1 }
  }
  if (figure === 'trapezoid') {
    return { base: dims.top! + dims.bottom!, text: `(${fmt(dims.top!)} + ${fmt(dims.bottom!)})`, divisor: 2 }
  }
  const first = areaTools[figure].keys[0]!
  return { base: dims[first]!, text: fmt(dims[first]!), divisor: figure === 'triangle' ? 2 : 1 }
}

function areaSize(figure: PlanarMeasureFigure, dims: FigureDims, given?: number): number {
  if (given === undefined) return dims[areaTools[figure].unknown]!
  const { base, divisor } = areaTerms(figure, dims)
  const size = given * divisor / base
  return figure === 'square' || figure === 'circle' ? Math.sqrt(size) : size
}

function areaItem(figure: PlanarMeasureFigure, dims: FigureDims, missing: boolean, given?: number): MathItem {
  const { unknown } = areaTools[figure]
  const unit = dims.unit ?? 'cm'
  const { base, text, divisor } = areaTerms(figure, dims)
  const size = areaSize(figure, dims, given)
  const square = figure === 'square'
  const circle = figure === 'circle'
  const total = given ?? round2((square || circle ? base * size * size : base * size) / divisor)
  const piText = circle ? ` Prenez π = ${text}.` : ''
  const labeled: FigureDims = { ...dims, unit }
  if (figure === 'triangle') labeled.triangleKind = 'scalene'
  let calculation: string
  let prompt: string
  if (missing) {
    delete labeled[unknown]
    labeled.ask = unknown
    calculation = square ? `√${fmt(total)}`
      : circle ? `√(${fmt(total)} ÷ ${text})`
      : divisor === 2 ? `(${fmt(total)} × 2) ÷ ${text}` : `${fmt(total)} ÷ ${text}`
    const directive = square ? 'Calculez le côté.'
      : circle ? 'Calculez le rayon.'
      : figure === 'rectangle' ? `La longueur mesure ${text} ${unit}. Calculez la largeur.`
      : figure === 'rhombus' ? `Le côté mesure ${text} ${unit}. Calculez la hauteur.`
      : figure === 'trapezoid' ? `Les bases mesurent ${fmt(dims.top!)} ${unit} et ${fmt(dims.bottom!)} ${unit}. Calculez la hauteur.`
      : `La base mesure ${text} ${unit}. Calculez la hauteur.`
    prompt = `L’aire mesure ${fmt(total)} ${unit}². ${directive}${piText}`
  } else {
    const product = `${text} × ${fmt(size)}`
    calculation = square ? `${fmt(size)} × ${fmt(size)}`
      : circle ? `${product}²`
      : figure === 'triangle' ? `(${product}) ÷ 2`
      : divisor === 2 ? `${product} ÷ 2` : product
    prompt = `Calculez l’aire.${piText}`
  }
  return geo({ prompt, figure, dims: labeled, calc: calculation, response: missing ? `${fmt(size)} ${unit}` : `${fmt(total)} ${unit}²` })
}

export function editArea(item: MathItem, values: AreaValues): MathItem | undefined {
  const figure = planarMeasureFigure(item)
  if (!figure || !item.dims) return undefined
  const missing = Boolean(item.dims.ask)
  const dims = { ...item.dims, ...values }
  const given = missing ? values.area ?? areaGiven(item) : undefined
  if (Object.keys(values).length === 1 && values.unit !== undefined) {
    return { ...item, ...areaItem(figure, dims, missing, given) }
  }
  const pi = dims.areaPi ?? PI
  const { unknown, keys } = areaTools[figure]
  const size = areaSize(figure, dims, given)
  const dimensions = keys.map((key) => key === unknown ? size : dims[key]!)
  if (figure === 'circle' && !(pi >= 3 && pi <= 4)) return undefined
  if (dimensions.some((value) => !Number.isFinite(value) || round2(value) <= 0)) return undefined
  if (figure === 'rhombus' && size > dims.side!) return undefined
  return { ...item, ...areaItem(figure, dims, missing, given) }
}

function areaSquare(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('square', { side: val(rng, difficulty, range) }, missing)
}

function areaRectangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('rectangle', { length: val(rng, difficulty, range), width: val(rng, difficulty, range) }, missing)
}

function areaTriangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('triangle', { base: val(rng, difficulty, range), height: val(rng, difficulty, range) }, missing)
}

function areaParallelogram(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('parallelogram', { base: val(rng, difficulty, range), height: val(rng, difficulty, range) }, missing)
}

function areaRhombus(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('rhombus', { side: val(rng, difficulty, range), height: val(rng, difficulty, range) }, missing)
}

function areaTrapezoid(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('trapezoid', {
    top: val(rng, difficulty, range), bottom: val(rng, difficulty, range), height: val(rng, difficulty, range),
  }, missing)
}

function areaDisk(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  return areaItem('circle', { radius: val(rng, difficulty, range) }, missing)
}

function volCube(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const s = val(rng, difficulty, range)
  const v = round2(s * s * s)
  if (!missing) {
    return geo({
      prompt: 'Calculez le volume.',
      figure: 'cube',
      dims: { side: s, unit: 'cm' },
      calc: `${fmt(s)}³`,
      response: `${fmt(v)} cm³`,
    })
  }
  return geo({
    prompt: `Le volume mesure ${fmt(v)} cm³. Calculez l’arête.`,
    figure: 'cube',
    dims: { ask: 'side', unit: 'cm' },
    calc: `∛${fmt(v)}`,
    response: `${fmt(s)} cm`,
  })
}

function volCuboid(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const length = val(rng, difficulty, range)
  const width = val(rng, difficulty, range)
  const height = val(rng, difficulty, range)
  const v = round2(length * width * height)
  if (!missing) {
    return geo({
      prompt: 'Calculez le volume.',
      figure: 'cuboid',
      dims: { length, width, height, unit: 'cm' },
      calc: `${fmt(length)} × ${fmt(width)} × ${fmt(height)}`,
      response: `${fmt(v)} cm³`,
    })
  }
  return geo({
    prompt: `Le volume mesure ${fmt(v)} cm³. La longueur mesure ${fmt(length)} cm et la largeur ${fmt(width)} cm. Calculez la hauteur.`,
    figure: 'cuboid',
    dims: { length, width, ask: 'height', unit: 'cm' },
    calc: `${fmt(v)} ÷ (${fmt(length)} × ${fmt(width)})`,
    response: `${fmt(height)} cm`,
  })
}

function volCylinder(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const r = val(rng, difficulty, range)
  const h = val(rng, difficulty, range)
  const v = round2(PI * r * r * h)
  if (!missing) {
    return geo({
      prompt: 'Calculez le volume. Prenez π = 3,14.',
      figure: 'cylinder',
      dims: { radius: r, height: h, unit: 'cm' },
      calc: `3,14 × ${fmt(r)}² × ${fmt(h)}`,
      response: `${fmt(v)} cm³`,
    })
  }
  return geo({
    prompt: `Le volume mesure ${fmt(v)} cm³. Le rayon mesure ${fmt(r)} cm. Calculez la hauteur. Prenez π = 3,14.`,
    figure: 'cylinder',
    dims: { radius: r, ask: 'height', unit: 'cm' },
    calc: `${fmt(v)} ÷ (3,14 × ${fmt(r)}²)`,
    response: `${fmt(h)} cm`,
  })
}

function volCone(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const r = val(rng, difficulty, range)
  const h = val(rng, difficulty, range)
  const v = round2((PI * r * r * h) / 3)
  if (!missing) {
    return geo({
      prompt: 'Calculez le volume. Prenez π = 3,14.',
      figure: 'cone',
      dims: { radius: r, height: h, unit: 'cm' },
      calc: `(3,14 × ${fmt(r)}² × ${fmt(h)}) ÷ 3`,
      response: `${fmt(v)} cm³`,
    })
  }
  return geo({
    prompt: `Le volume mesure ${fmt(v)} cm³. Le rayon mesure ${fmt(r)} cm. Calculez la hauteur. Prenez π = 3,14.`,
    figure: 'cone',
    dims: { radius: r, ask: 'height', unit: 'cm' },
    calc: `(${fmt(v)} × 3) ÷ (3,14 × ${fmt(r)}²)`,
    response: `${fmt(h)} cm`,
  })
}

function volSphere(rng: Rng, difficulty: Difficulty, range?: NumberRange): MathItem {
  const r = val(rng, difficulty, range)
  const v = round2((4 / 3) * PI * r * r * r)
  return geo({
    prompt: 'Calculez le volume. Prenez π = 3,14.',
    figure: 'sphere',
    dims: { radius: r, unit: 'cm' },
    calc: `(4 ÷ 3) × 3,14 × ${fmt(r)}³`,
    response: `${fmt(v)} cm³`,
  })
}

const perimeterGenerators: Record<PlanarMeasureFigure, MeasureFn> = {
  square: periSquare, rectangle: periRectangle, triangle: periTriangle, parallelogram: periParallelogram,
  rhombus: periRhombus, trapezoid: periTrapezoid, circle: periCircle,
}

const areaGenerators: Record<PlanarMeasureFigure, MeasureFn> = {
  square: areaSquare, rectangle: areaRectangle, triangle: areaTriangle, parallelogram: areaParallelogram,
  rhombus: areaRhombus, trapezoid: areaTrapezoid, circle: areaDisk,
}

const VOL = [volCube, volCuboid, volCylinder, volCone] as const

type MeasureFn = (rng: Rng, d: Difficulty, missing: boolean, range?: NumberRange) => MathItem

export function perimeterChoices(type: string): { figure: Figure; label: string }[] {
  const figures = type === 'perimetres-melange' ? Object.keys(perimeterGenerators) as PlanarMeasureFigure[]
    : type.startsWith('perimetres-quadrilatere') ? PERI_QUAD_FIGURES : []
  return figures.map((figure) => ({ figure, label: QUAD_SHAPE_LABELS[figure] ?? (figure === 'triangle' ? 'Triangle' : 'Cercle') }))
}

export function withPerimeterFigure(item: MathItem, figure: Figure, rng: Rng, difficulty: Difficulty): MathItem {
  if (!Object.hasOwn(perimeterGenerators, figure) || figure === item.figure) return item
  const next = perimeterGenerators[figure as PlanarMeasureFigure](rng, difficulty, Boolean(item.dims?.ask))
  return { ...item, ...(editPerimeter(next, { unit: item.dims?.unit ?? 'cm' }) ?? next) }
}

export function areaChoices(type: string): { figure: Figure; label: string }[] {
  const figures = type === 'aires-melange' ? Object.keys(areaGenerators) as PlanarMeasureFigure[]
    : type.startsWith('aires-quadrilatere') ? AREA_QUAD_FIGURES : []
  return figures.map((figure) => ({ figure, label: QUAD_SHAPE_LABELS[figure] ?? (figure === 'triangle' ? 'Triangle' : 'Disque') }))
}

export function withAreaFigure(item: MathItem, figure: Figure, rng: Rng, difficulty: Difficulty): MathItem {
  if (!Object.hasOwn(areaGenerators, figure) || figure === item.figure) return item
  const next = areaGenerators[figure as PlanarMeasureFigure](rng, difficulty, Boolean(item.dims?.ask))
  return { ...item, ...(editArea(next, { unit: item.dims?.unit ?? 'cm' }) ?? next) }
}

const VOL_QUAD: Partial<Record<Figure, MeasureFn>> = {
  cube: volCube,
  cuboid: volCuboid,
}

function allowedFigures(all: Figure[], chosen?: Figure[]): Figure[] {
  if (!chosen?.length) return all
  const keep = chosen.filter((figure) => all.includes(figure))
  return keep.length ? keep : all
}

function pickQuad(
  rng: Rng,
  table: Partial<Record<Figure, MeasureFn>>,
  all: Figure[],
  chosen: Figure[] | undefined,
  d: Difficulty,
  missing: boolean,
  range?: NumberRange,
): MathItem {
  const figure = pick(rng, allowedFigures(all, chosen))
  const make = table[figure] ?? table[all[0]!]
  return make!(rng, d, missing, range)
}

export function tryGenerateMesure(
  typeId: string,
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
  shapes?: Figure[],
): MathItem | null {
  const d = difficulty
  if (typeId === 'perimetres-quadrilatere' || typeId === 'perimetres-quadrilatere-manquant') {
    return pickQuad(rng, perimeterGenerators, PERI_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'aires-quadrilatere' || typeId === 'aires-quadrilatere-manquant') {
    return pickQuad(rng, areaGenerators, AREA_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'volumes-quadrilatere' || typeId === 'volumes-quadrilatere-manquant') {
    return pickQuad(rng, VOL_QUAD, VOLUME_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'perimetres-melange') {
    const fn = pick(rng, Object.values(perimeterGenerators))
    return fn(rng, d, rng() < 0.45, range)
  }
  if (typeId === 'aires-melange') {
    const fn = pick(rng, Object.values(areaGenerators))
    return fn(rng, d, rng() < 0.45, range)
  }
  if (typeId === 'volumes-melange') {
    if (rng() < 0.15) return volSphere(rng, d, range)
    const fn = pick(rng, [...VOL])
    return fn(rng, d, rng() < 0.45, range)
  }

  const table: Record<string, (missing: boolean) => MathItem> = {
    'perimetres-carre': (m) => periSquare(rng, d, m, range),
    'perimetres-rectangle': (m) => periRectangle(rng, d, m, range),
    'perimetres-triangle': (m) => periTriangle(rng, d, m, range),
    'perimetres-parallelogramme': (m) => periParallelogram(rng, d, m, range),
    'perimetres-losange': (m) => periRhombus(rng, d, m, range),
    'perimetres-trapeze': (m) => periTrapezoid(rng, d, m, range),
    'perimetres-cercle': (m) => periCircle(rng, d, m, range),
    'aires-carre': (m) => areaSquare(rng, d, m, range),
    'aires-rectangle': (m) => areaRectangle(rng, d, m, range),
    'aires-triangle': (m) => areaTriangle(rng, d, m, range),
    'aires-parallelogramme': (m) => areaParallelogram(rng, d, m, range),
    'aires-losange': (m) => areaRhombus(rng, d, m, range),
    'aires-trapeze': (m) => areaTrapezoid(rng, d, m, range),
    'aires-disque': (m) => areaDisk(rng, d, m, range),
    'volumes-cube': (m) => volCube(rng, d, m, range),
    'volumes-pave': (m) => volCuboid(rng, d, m, range),
    'volumes-cylindre': (m) => volCylinder(rng, d, m, range),
    'volumes-cone': (m) => volCone(rng, d, m, range),
  }
  if (typeId === 'volumes-sphere') return volSphere(rng, d, range)
  const base = typeId.endsWith('-manquant') ? typeId.slice(0, -'-manquant'.length) : typeId
  const make = table[base]
  if (!make) return null
  return make(typeId.endsWith('-manquant'))
}

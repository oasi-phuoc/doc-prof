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

function periSquare(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const s = val(rng, difficulty, range)
  const p = round2(4 * s)
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'square',
      dims: { side: s, unit: 'cm' },
      calc: `4 × ${fmt(s)}`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. Calculez le côté.`,
    figure: 'square',
    dims: { ask: 'side', unit: 'cm' },
    calc: `${fmt(p)} ÷ 4`,
    response: `${fmt(s)} cm`,
  })
}

function periRectangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const length = val(rng, difficulty, range)
  let width = val(rng, difficulty, range)
  if (width === length) width = round2(width + (difficulty === 'avance' ? 0.5 : 1))
  const p = round2(2 * (length + width))
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'rectangle',
      dims: { length, width, unit: 'cm' },
      calc: `2 × (${fmt(length)} + ${fmt(width)})`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. La longueur mesure ${fmt(length)} cm. Calculez la largeur.`,
    figure: 'rectangle',
    dims: { length, ask: 'width', unit: 'cm' },
    calc: `${fmt(p)} ÷ 2 − ${fmt(length)}`,
    response: `${fmt(width)} cm`,
  })
}

function periTriangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const [a, b, c] = triangleSides(rng, difficulty, range)
  const p = round2(a + b + c)
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'triangle',
      dims: { a, b, c, triangleKind: 'scalene', unit: 'cm' },
      calc: `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. Calculez le côté marqué ?.`,
    figure: 'triangle',
    dims: { a, b, ask: 'c', triangleKind: 'scalene', unit: 'cm' },
    calc: `${fmt(p)} − ${fmt(a)} − ${fmt(b)}`,
    response: `${fmt(c)} cm`,
  })
}

function periParallelogram(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const base = val(rng, difficulty, range)
  const side = val(rng, difficulty, range)
  const p = round2(2 * (base + side))
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'parallelogram',
      dims: { base, side, unit: 'cm' },
      calc: `2 × (${fmt(base)} + ${fmt(side)})`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. La base mesure ${fmt(base)} cm. Calculez l’autre côté.`,
    figure: 'parallelogram',
    dims: { base, ask: 'side', unit: 'cm' },
    calc: `${fmt(p)} ÷ 2 − ${fmt(base)}`,
    response: `${fmt(side)} cm`,
  })
}

function periRhombus(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const s = val(rng, difficulty, range)
  const p = round2(4 * s)
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'rhombus',
      dims: { side: s, unit: 'cm' },
      calc: `4 × ${fmt(s)}`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. Calculez le côté.`,
    figure: 'rhombus',
    dims: { ask: 'side', unit: 'cm' },
    calc: `${fmt(p)} ÷ 4`,
    response: `${fmt(s)} cm`,
  })
}

function periTrapezoid(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const top = val(rng, difficulty, range)
  const bottom = val(rng, difficulty, range)
  const left = val(rng, difficulty, range)
  const right = val(rng, difficulty, range)
  const p = round2(top + bottom + left + right)
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre.',
      figure: 'trapezoid',
      dims: { top, bottom, a: left, b: right, unit: 'cm' },
      calc: `${fmt(top)} + ${fmt(bottom)} + ${fmt(left)} + ${fmt(right)}`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. Calculez le côté marqué ?.`,
    figure: 'trapezoid',
    dims: { top, bottom, a: left, ask: 'b', unit: 'cm' },
    calc: `${fmt(p)} − ${fmt(top)} − ${fmt(bottom)} − ${fmt(left)}`,
    response: `${fmt(right)} cm`,
  })
}

function periCircle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const r = val(rng, difficulty, range)
  const p = round2(2 * PI * r)
  if (!missing) {
    return geo({
      prompt: 'Calculez le périmètre. Prenez π = 3,14.',
      figure: 'circle',
      dims: { radius: r, unit: 'cm' },
      calc: `2 × 3,14 × ${fmt(r)}`,
      response: `${fmt(p)} cm`,
    })
  }
  return geo({
    prompt: `Le périmètre mesure ${fmt(p)} cm. Calculez le rayon. Prenez π = 3,14.`,
    figure: 'circle',
    dims: { ask: 'radius', unit: 'cm' },
    calc: `${fmt(p)} ÷ (2 × 3,14)`,
    response: `${fmt(r)} cm`,
  })
}

function areaSquare(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const s = val(rng, difficulty, range)
  const a = round2(s * s)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'square',
      dims: { side: s, unit: 'cm' },
      calc: `${fmt(s)} × ${fmt(s)}`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². Calculez le côté.`,
    figure: 'square',
    dims: { ask: 'side', unit: 'cm' },
    calc: `√${fmt(a)}`,
    response: `${fmt(s)} cm`,
  })
}

function areaRectangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const length = val(rng, difficulty, range)
  const width = val(rng, difficulty, range)
  const a = round2(length * width)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'rectangle',
      dims: { length, width, unit: 'cm' },
      calc: `${fmt(length)} × ${fmt(width)}`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². La longueur mesure ${fmt(length)} cm. Calculez la largeur.`,
    figure: 'rectangle',
    dims: { length, ask: 'width', unit: 'cm' },
    calc: `${fmt(a)} ÷ ${fmt(length)}`,
    response: `${fmt(width)} cm`,
  })
}

function areaTriangle(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const base = val(rng, difficulty, range)
  const height = val(rng, difficulty, range)
  const a = round2((base * height) / 2)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'triangle',
      dims: { base, height, triangleKind: 'scalene', unit: 'cm' },
      calc: `(${fmt(base)} × ${fmt(height)}) ÷ 2`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². La base mesure ${fmt(base)} cm. Calculez la hauteur.`,
    figure: 'triangle',
    dims: { base, ask: 'height', triangleKind: 'scalene', unit: 'cm' },
    calc: `(${fmt(a)} × 2) ÷ ${fmt(base)}`,
    response: `${fmt(height)} cm`,
  })
}

function areaParallelogram(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const base = val(rng, difficulty, range)
  const height = val(rng, difficulty, range)
  const a = round2(base * height)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'parallelogram',
      dims: { base, height, unit: 'cm' },
      calc: `${fmt(base)} × ${fmt(height)}`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². La base mesure ${fmt(base)} cm. Calculez la hauteur.`,
    figure: 'parallelogram',
    dims: { base, ask: 'height', unit: 'cm' },
    calc: `${fmt(a)} ÷ ${fmt(base)}`,
    response: `${fmt(height)} cm`,
  })
}

function areaRhombus(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const s = val(rng, difficulty, range)
  const height = val(rng, difficulty, range)
  const a = round2(s * height)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'rhombus',
      dims: { side: s, height, unit: 'cm' },
      calc: `${fmt(s)} × ${fmt(height)}`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². Le côté mesure ${fmt(s)} cm. Calculez la hauteur.`,
    figure: 'rhombus',
    dims: { side: s, ask: 'height', unit: 'cm' },
    calc: `${fmt(a)} ÷ ${fmt(s)}`,
    response: `${fmt(height)} cm`,
  })
}

function areaTrapezoid(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const top = val(rng, difficulty, range)
  const bottom = val(rng, difficulty, range)
  const height = val(rng, difficulty, range)
  const a = round2(((top + bottom) * height) / 2)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire.',
      figure: 'trapezoid',
      dims: { top, bottom, height, unit: 'cm' },
      calc: `(${fmt(top)} + ${fmt(bottom)}) × ${fmt(height)} ÷ 2`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². Les bases mesurent ${fmt(top)} cm et ${fmt(bottom)} cm. Calculez la hauteur.`,
    figure: 'trapezoid',
    dims: { top, bottom, ask: 'height', unit: 'cm' },
    calc: `(${fmt(a)} × 2) ÷ (${fmt(top)} + ${fmt(bottom)})`,
    response: `${fmt(height)} cm`,
  })
}

function areaDisk(rng: Rng, difficulty: Difficulty, missing: boolean, range?: NumberRange): MathItem {
  const r = val(rng, difficulty, range)
  const a = round2(PI * r * r)
  if (!missing) {
    return geo({
      prompt: 'Calculez l’aire. Prenez π = 3,14.',
      figure: 'circle',
      dims: { radius: r, unit: 'cm' },
      calc: `3,14 × ${fmt(r)}²`,
      response: `${fmt(a)} cm²`,
    })
  }
  return geo({
    prompt: `L’aire mesure ${fmt(a)} cm². Calculez le rayon. Prenez π = 3,14.`,
    figure: 'circle',
    dims: { ask: 'radius', unit: 'cm' },
    calc: `√(${fmt(a)} ÷ 3,14)`,
    response: `${fmt(r)} cm`,
  })
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

const PERI = [
  periSquare,
  periRectangle,
  periTriangle,
  periParallelogram,
  periRhombus,
  periTrapezoid,
  periCircle,
] as const

const AREA = [areaSquare, areaRectangle, areaTriangle, areaParallelogram, areaRhombus, areaTrapezoid, areaDisk] as const

const VOL = [volCube, volCuboid, volCylinder, volCone] as const

type MeasureFn = (rng: Rng, d: Difficulty, missing: boolean, range?: NumberRange) => MathItem

const PERI_QUAD: Partial<Record<Figure, MeasureFn>> = {
  square: periSquare,
  rectangle: periRectangle,
  parallelogram: periParallelogram,
  rhombus: periRhombus,
  trapezoid: periTrapezoid,
}

const AREA_QUAD: Partial<Record<Figure, MeasureFn>> = {
  square: areaSquare,
  rectangle: areaRectangle,
  parallelogram: areaParallelogram,
  rhombus: areaRhombus,
  trapezoid: areaTrapezoid,
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
    return pickQuad(rng, PERI_QUAD, PERI_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'aires-quadrilatere' || typeId === 'aires-quadrilatere-manquant') {
    return pickQuad(rng, AREA_QUAD, AREA_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'volumes-quadrilatere' || typeId === 'volumes-quadrilatere-manquant') {
    return pickQuad(rng, VOL_QUAD, VOLUME_QUAD_FIGURES, shapes, d, typeId.endsWith('-manquant'), range)
  }
  if (typeId === 'perimetres-melange') {
    const fn = pick(rng, [...PERI])
    return fn(rng, d, rng() < 0.45, range)
  }
  if (typeId === 'aires-melange') {
    const fn = pick(rng, [...AREA])
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

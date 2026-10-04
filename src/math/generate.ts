import {
  generateSystemAddition,
  generateSystemSubstitution,
  tryGenerateAlgebraBatch,
} from './algebra'
import { exerciseTypeById, topicById } from './catalog'
import {
  columnAddPair,
  columnDivPair,
  columnMulPair,
  columnSubPair,
  decimalAddPair,
  decimalDivPair,
  decimalMulPair,
  decimalSubPair,
  nombreBound,
  numberRangeFrom,
  pairAdd,
  pairDiv,
  pairMul,
  pairSub,
  pickWithPlaces,
  roundToPlaces,
  upperBound,
  type NumberRange,
} from './difficulty'
import { numberToFrench } from '@/francais/french-numbers'
import { generatePerimetreCompose } from './perimetre-compose'
import { generateConstruire } from './coord-construire'
import { generateDroites } from './coord-droites'
import { tryGenerateReperage } from './coord-reperage'
import { generateTransformations, isTransformationExercise } from './coord-transformations'
import { tryGenerateSoutienBatch } from '@/francais/soutien/generate'
import { ALGEBRA_GLOSSARY, GEOMETRY_GLOSSARY } from './glossary-banks'
import { tryGenerateLectureBatch } from '@/francais/lecture'
import { tryGeneratePhraseBatch } from '@/francais/phrase'
import { generateLengthConversionBatch, tryGenerateConversion } from './conversions'
import { generateTcmPrioriteBatch } from './tcm-priorite'
import { generateTcmProportionKgBatch } from './tcm-proportion-kg'
import { generateTcmReduireBatch } from './tcm-reduire'
import { generateTcmEvaluerBatch } from './tcm-evaluer'
import { tryGenerateFigure } from './figures-school'
import { tryGenerateFrancaisBlock } from '@/francais/francais'
import { tryGenerateCalligraphieBatch } from '@/calligraphie/generate'
import { tryGenerateJeuxBatch } from '@/jeux/generate'
import { tryGenerateMesure } from './mesures'
import { pageAsConfig, pageBlocks } from './page-model'
import { makeWordProblem } from './problems'
import { genFracItems } from './fraction-shapes'
import { createRng, int, pick, shuffle, type Rng } from './rng'
import type {
  AlgebraGiven,
  ArithOp,
  CountIconKind,
  CountIconToken,
  Difficulty,
  DivisionStep,
  Figure,
  MathItem,
  MissingPos,
  PageConfig,
  WorksheetBlock,
  WorksheetDocument,
  WorksheetPage,
} from './types'

const COUNT_ICON_TARGETS: readonly {
  kind: CountIconKind
  label: string
}[] = [
  { kind: 'note', label: 'notes' },
  { kind: 'notes', label: 'notes' },
  { kind: 'star', label: 'étoiles' },
  { kind: 'heart', label: 'cœurs' },
  { kind: 'leaf', label: 'feuilles' },
  { kind: 'moon', label: 'lunes' },
  { kind: 'bolt', label: 'éclairs' },
  { kind: 'flower', label: 'fleurs' },
]

function generateCountIcons(rng: Rng): MathItem {
  const target = pick(rng, COUNT_ICON_TARGETS)
  const targetCount = int(rng, 10, 20)
  const circleCount = int(rng, 4, 10)
  const triangleCount = int(rng, 4, 10)
  const total = targetCount + circleCount + triangleCount

  // Grille irrégulière : positions mélangées, tailles variées.
  const cols = Math.ceil(Math.sqrt(total * 1.35))
  const rows = Math.ceil(total / cols)
  const cells: Array<{ c: number; r: number }> = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ c, r })
  }
  const slots = shuffle(rng, cells).slice(0, total)

  const kinds: Array<CountIconKind | 'circle' | 'triangle'> = [
    ...Array.from({ length: targetCount }, () => target.kind),
    ...Array.from({ length: circleCount }, () => 'circle' as const),
    ...Array.from({ length: triangleCount }, () => 'triangle' as const),
  ]
  const orderedKinds = shuffle(rng, kinds)

  const tokens: CountIconToken[] = slots.map((slot, i) => {
    const padX = 8
    const padY = 10
    const cellW = (100 - padX * 2) / cols
    const cellH = (100 - padY * 2) / rows
    const x = padX + slot.c * cellW + cellW * (0.25 + rng() * 0.5)
    const y = padY + slot.r * cellH + cellH * (0.25 + rng() * 0.5)
    return {
      kind: orderedKinds[i]!,
      x: Math.max(6, Math.min(94, x)),
      y: Math.max(8, Math.min(92, y)),
      size: int(rng, 11, 20),
      rot: int(rng, -28, 28),
    }
  })

  return {
    layout: 'count-icons',
    prompt: `Il y a ____ ${target.label}`,
    answer: String(targetCount),
    countIcons: {
      label: target.label,
      targetKind: target.kind,
      targetCount,
      tokens,
    },
  }
}

function generateTcmComparerBatch(rng: Rng, count: number): MathItem[] {
  const n = Math.max(1, count)
  // Garantir au moins une occurrence de chaque symbole si n ≥ 3 ; sinon tirage libre.
  const relations: Array<'<' | '=' | '>'> =
    n >= 3 ? ['=', '>', '<'] : Array.from({ length: n }, () => pick(rng, ['<', '=', '>'] as const))
  while (relations.length < n) {
    relations.push(pick(rng, ['<', '=', '>'] as const))
  }
  const ordered = shuffle(rng, relations).slice(0, n)
  return ordered.map((rel) => {
    if (rel === '=') {
      const a = int(rng, 10, 100)
      return { layout: 'compare' as const, left: String(a), right: String(a), answer: '=' }
    }
    let a = int(rng, 10, 100)
    let b = int(rng, 10, 100)
    while (a === b) b = int(rng, 10, 100)
    if (rel === '<') {
      const lo = Math.min(a, b)
      const hi = Math.max(a, b)
      return { layout: 'compare' as const, left: String(lo), right: String(hi), answer: '<' }
    }
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    return { layout: 'compare' as const, left: String(hi), right: String(lo), answer: '>' }
  })
}

/** Suites TCM : Q1 = deux blancs consécutifs ; Q2 = motif `n _ n _ n` (index 1 et 3). */
function generateTcmSuiteBatch(rng: Rng, count: number): MathItem[] {
  const length = 5
  const n = Math.max(1, count)
  return Array.from({ length: n }, (_, qi) => {
    const step = int(rng, 2, 10)
    const maxStart = Math.max(1, 100 - (length - 1) * step)
    const start = int(rng, 1, maxStart)
    const seq = Array.from({ length }, (_, k) => start + k * step)
    // Q1 : deux blancs consécutifs ; Q2+ : motif 1 _ 3 _ 5 (blancs aux index 1 et 3).
    const blanks: number[] =
      qi === 0
        ? (() => {
            const first = int(rng, 0, length - 2)
            return [first, first + 1]
          })()
        : [1, 3]
    return {
      layout: 'sequence' as const,
      sequence: seq.map((v, k) => (blanks.includes(k) ? '□' : String(v))),
      blankIndexes: blanks,
      answer: blanks.map((k) => String(seq[k]!)).join(' ; '),
    }
  })
}

function generateTcmSuite(rng: Rng): MathItem {
  return generateTcmSuiteBatch(rng, 1)[0]!
}

/**
 * Calcul mixte TCM (fusion ex. 7–8–9) : templates + / − / × / ÷.
 * Ordre fixe : + trou, − trou, ×(6|7), ×(8|9), ÷(3|4|5), ÷(11|12).
 */
function generateTcmQuatreOpsBatch(rng: Rng): MathItem[] {
  const mkAdd = (): MathItem => {
    const a = int(rng, 75, 450)
    const b = int(rng, 75, Math.max(75, 500 - a))
    return inlineOp('+', a, b, a + b, 'result')
  }
  const mkSub = (): MathItem => {
    const b = int(rng, 75, 425)
    const result = int(rng, 75, Math.max(75, 500 - b))
    const a = b + result
    return inlineOp('−', a, b, result, 'result')
  }
  const mkMul = (factors: readonly number[]): MathItem => {
    const b = pick(rng, factors)
    const a = int(rng, 3, 12)
    return inlineOp('×', a, b, a * b, 'result')
  }
  const mkDiv = (divisors: readonly number[], quotMax: number): MathItem => {
    const b = pick(rng, divisors)
    const result = int(rng, 2, quotMax)
    return inlineOp('÷', b * result, b, result, 'result')
  }
  const makers = [
    mkAdd,
    mkSub,
    () => mkMul([6, 7]),
    () => mkMul([8, 9]),
    () => mkDiv([3, 4, 5], 12),
    () => mkDiv([11, 12], 9),
  ]
  return makers.map((make) => make())
}

/** Force une largeur fixe de chiffres (ex. 4 colonnes pour des 3 chiffres). */
function withFixedColumnWidth(item: MathItem, width: number): MathItem {
  return {
    ...item,
    digitsA: padDigitRow(item.digitsA, width),
    digitsB: padDigitRow(item.digitsB, width),
    digitsResult: padDigitRow(item.digitsResult, width),
    carries: padDigitRow(item.carries ?? [], width),
    digitsPartials: item.digitsPartials?.map((row) => padDigitRow(row, width)),
  }
}

/**
 * Division posée à largeurs fixes : dividende / travail / reste = `dividendWidth`,
 * quotient = `quotientWidth`. Le reste est aligné sous les unités (dernière colonne).
 */
function withFixedDivisionWidth(
  item: MathItem,
  dividendWidth: number,
  quotientWidth: number,
): MathItem {
  const rem = Math.round(Math.abs(Number(item.remainder ?? 0)))
  return {
    ...item,
    digitsA: padDigitRow(item.digitsA, dividendWidth),
    digitsPartials: (item.digitsPartials ?? []).map((row) => padDigitRow(row, dividendWidth)),
    digitsResult: padDigitRow(item.digitsResult, quotientWidth),
    digitsRemainder: digits(rem, dividendWidth),
  }
}

/** TCM ex. 12 / 19 : toujours 8 lignes sous le dividende (9 avec le dividende). */
const TCM_DIV_WORK_ROWS = 8

function withFixedDivisionWorkRows(item: MathItem, workRows = TCM_DIV_WORK_ROWS): MathItem {
  const width = Math.max(1, item.digitsA?.length ?? 1)
  const work = item.digitsPartials ?? []
  const n = Math.max(workRows, work.length)
  return {
    ...item,
    digitsPartials: Array.from({ length: n }, (_, i) =>
      padDigitRow(work[i] ?? Array.from({ length: width }, () => ''), width),
    ),
  }
}

/**
 * TCM : une addition + une soustraction en colonnes (ordre aléatoire).
 * `digitCount` 3 → grille à 4 colonnes ; 4 → grille à 5 colonnes.
 */
function generateTcmAddSubColBatch(rng: Rng, digitCount: 3 | 4): MathItem[] {
  const width = digitCount === 3 ? 4 : 5
  const min = digitCount === 3 ? 100 : 1000
  const max = digitCount === 3 ? 999 : 9999
  const aAdd = int(rng, min, max)
  const bAdd = int(rng, min, max)
  let aSub = int(rng, min, max)
  let bSub = int(rng, min, max)
  if (bSub > aSub) [aSub, bSub] = [bSub, aSub]
  while (aSub === bSub) {
    aSub = int(rng, min, max)
    bSub = int(rng, min, max)
    if (bSub > aSub) [aSub, bSub] = [bSub, aSub]
  }
  const add = withFixedColumnWidth(columnItem('+', aAdd, bAdd, aAdd + bAdd, false), width)
  const sub = withFixedColumnWidth(columnItem('−', aSub, bSub, aSub - bSub, false), width)
  return rng() < 0.5 ? [add, sub] : [sub, add]
}

/** TCM : décomposition 11–99 (dizaines + unités). */
function generateTcmDecompose99Batch(rng: Rng, count: number): MathItem[] {
  const n = Math.max(1, count)
  return Array.from({ length: n }, () => {
    let value = int(rng, 11, 99)
    while (value % 10 === 0) value = int(rng, 11, 99)
    const d = Math.floor(value / 10)
    const u = value % 10
    const placeParts = [String(d * 10), String(u)]
    return {
      layout: 'place-value' as const,
      prompt: String(value),
      labels: ['dizaines', 'unités'],
      placeParts,
      answer: placeParts.join(' + '),
    }
  })
}

/**
 * TCM grandes suites (1 colonne) :
 * Q1 max 999, écart 100–200, multiple de 5, pas une centaine ronde ;
 * Q2 max 9999, écart 200–400, multiple de 5, pas une centaine ronde.
 */
function generateTcmGrandesSuitesBatch(rng: Rng): MathItem[] {
  const length = 5
  const roundHundreds = new Set([100, 200, 300, 400, 500])
  const pickStep = (lo: number, hi: number): number => {
    const candidates: number[] = []
    for (let s = lo; s <= hi; s += 5) {
      if (!roundHundreds.has(s)) candidates.push(s)
    }
    return pick(rng, candidates)
  }
  const makeSeq = (step: number, maxVal: number): MathItem => {
    const span = step * (length - 1)
    const maxStart = Math.max(1, maxVal - span)
    const start = int(rng, 1, maxStart)
    const seq = Array.from({ length }, (_, k) => start + k * step)
    const first = int(rng, 0, length - 2)
    const blanks = [first, first + 1]
    return {
      layout: 'sequence',
      sequence: seq.map((v, k) => (blanks.includes(k) ? '□' : String(v))),
      blankIndexes: blanks,
      sequenceDigits: 5,
      answer: blanks.map((k) => String(seq[k]!)).join(' ; '),
    }
  }
  return [makeSeq(pickStep(100, 200), 999), makeSeq(pickStep(200, 400), 9999)]
}

/** TCM : décomposition 1000–9999 avec un 0 aux centaines ou aux dizaines. */
function generateTcmDecompose9999Batch(rng: Rng, count: number): MathItem[] {
  const n = Math.max(1, count)
  return Array.from({ length: n }, () => {
    let value = 0
    for (let guard = 0; guard < 40; guard++) {
      const m = int(rng, 1, 9)
      const zeroInHundreds = rng() < 0.5
      const c = zeroInHundreds ? 0 : int(rng, 1, 9)
      const d = zeroInHundreds ? int(rng, 0, 9) : 0
      // Au moins un 0 en C ou D ; éviter 0 partout sur C et D si on veut de la variété.
      const u = int(rng, 0, 9)
      value = m * 1000 + c * 100 + d * 10 + u
      if (value >= 1000 && value <= 9999 && (c === 0 || d === 0)) break
    }
    const u = value % 10
    const d = Math.floor((value % 100) / 10)
    const c = Math.floor((value % 1000) / 100)
    const m = Math.floor(value / 1000)
    const placeParts = [String(m * 1000), String(c * 100), String(d * 10), String(u)]
    return {
      layout: 'place-value' as const,
      prompt: value.toLocaleString('fr-CH'),
      labels: ['milliers', 'centaines', 'dizaines', 'unités'],
      placeParts,
      answer: placeParts.join(' + '),
    }
  })
}

/**
 * TCM ex. 12 : une multiplication (3 ch × 3–9, grille 5 col)
 * + une division (4 ch ÷ 3–9, dividende 5 col / quotient 4 col).
 */
function generateTcmMulDivColBatch(rng: Rng): MathItem[] {
  const mulB = int(rng, 3, 9)
  const mulA = int(rng, 100, 999)
  const mul = withFixedColumnWidth(columnItem('×', mulA, mulB, mulA * mulB, false), 5)
  const divB = int(rng, 3, 9)
  const qMin = Math.ceil(1000 / divB)
  const qMax = Math.floor(9999 / divB)
  const quot = int(rng, qMin, qMax)
  const dividend = divB * quot
  const div = withFixedDivisionWorkRows(
    withFixedDivisionWidth(divisionColumnItem(dividend, divB, false), 5, 4),
  )
  return rng() < 0.5 ? [mul, div] : [div, mul]
}

/** TCM ex. 13 : rectangle — périmètre et aire, deux cadres. */
function generateTcmRectPeriAire(rng: Rng): MathItem {
  const length = int(rng, 3, 18)
  let width = int(rng, 2, 14)
  if (width === length) width = Math.max(2, width - 1)
  const peri = 2 * (length + width)
  const area = length * width
  return {
    layout: 'geo',
    figure: 'rectangle',
    dims: { length, width, unit: 'cm' },
    geoDualPads: true,
    calcAnswer: `2 × (${fmt(length)} + ${fmt(width)})`,
    calcAnswerSecondary: `${fmt(length)} × ${fmt(width)}`,
    propertyLines: [
      { label: 'Périmètre', answer: `${fmt(peri)} cm` },
      { label: 'Aire', answer: `${fmt(area)} cm²` },
    ],
    answer: `Périmètre = ${fmt(peri)} cm ; Aire = ${fmt(area)} cm²`,
  }
}

/** Décimal à 1 chiffre après la virgule (placement soutien). */
function tcmOneDecimal(rng: Rng, loTenths: number, hiTenths: number): number {
  let t = int(rng, loTenths, hiTenths)
  while (t % 10 === 0) t = int(rng, loTenths, hiTenths)
  return t / 10
}

function tcmDualGeo(
  figure: MathItem['figure'],
  dims: NonNullable<MathItem['dims']>,
  periExpr: string,
  areaExpr: string,
  peri: number,
  area: number,
): MathItem {
  return {
    layout: 'geo',
    figure,
    dims: { ...dims, unit: dims.unit ?? 'cm' },
    geoDualPads: true,
    calcAnswer: periExpr,
    calcAnswerSecondary: areaExpr,
    propertyLines: [
      { label: 'Périmètre', answer: `${fmt(peri)} cm` },
      { label: 'Aire', answer: `${fmt(area)} cm²` },
    ],
    answer: `Périmètre = ${fmt(peri)} cm ; Aire = ${fmt(area)} cm²`,
  }
}

/** TCM : parallélogramme — base, côté et hauteur (SVG placement). */
function generateTcmParaPeriAire(rng: Rng): MathItem {
  const base = int(rng, 8, 16)
  const side = tcmOneDecimal(rng, 40, 100)
  const height = int(rng, 3, Math.max(3, Math.floor(side - 1)))
  const peri = Math.round(2 * (base + side) * 10) / 10
  const area = base * height
  return tcmDualGeo(
    'parallelogram',
    { base, side, height },
    `2 × (${fmt(base)} + ${fmt(side)})`,
    `${fmt(base)} × ${fmt(height)}`,
    peri,
    area,
  )
}

/** TCM : triangle quelconque — a, b, c et h (SVG placement). */
function generateTcmTriPeriAire(rng: Rng): MathItem {
  const a = int(rng, 8, 14)
  let b = int(rng, 6, 12)
  while (b === a) b = int(rng, 6, 12)
  let c = tcmOneDecimal(rng, 50, 110)
  while (c === a || c === b) c = tcmOneDecimal(rng, 50, 110)
  let h = int(rng, 4, 8)
  if ((a * h) % 2 !== 0) h += 1
  const peri = Math.round((a + b + c) * 10) / 10
  const area = (a * h) / 2
  return tcmDualGeo(
    'triangle',
    { a, b, c, height: h, triangleKind: 'scalene' },
    `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`,
    `(${fmt(a)} × ${fmt(h)}) ÷ 2`,
    peri,
    area,
  )
}

/** TCM : losange — côté c et diagonales d₁, d₂ (SVG placement). */
function generateTcmRhombusPeriAire(rng: Rng): MathItem {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
  ] as const
  const [pa, pb, pc] = pick(rng, [...triples])
  const k = int(rng, 1, 2)
  const d1 = pa * k * 2
  const d2 = pb * k * 2
  const side = pc * k + int(rng, 1, 9) / 10
  const peri = Math.round(4 * side * 10) / 10
  const area = (d1 * d2) / 2
  return tcmDualGeo(
    'rhombus',
    { side, d1, d2 },
    `4 × ${fmt(side)}`,
    `(${fmt(d1)} × ${fmt(d2)}) ÷ 2`,
    peri,
    area,
  )
}

/** TCM : trapèze isocèle — a, b, c et h (SVG placement). */
function generateTcmTrapPeriAire(rng: Rng): MathItem {
  const top = int(rng, 4, 10)
  const bottom = top + int(rng, 2, 6)
  const height = int(rng, 3, 8)
  const leg = tcmOneDecimal(rng, 30, 80)
  const peri = Math.round((top + bottom + 2 * leg) * 10) / 10
  const area = ((top + bottom) * height) / 2
  return tcmDualGeo(
    'trapezoid',
    { top, bottom, c: leg, height, trapezoidKind: 'isosceles' },
    `${fmt(top)} + ${fmt(bottom)} + 2 × ${fmt(leg)}`,
    `(${fmt(top)} + ${fmt(bottom)}) × ${fmt(height)} ÷ 2`,
    peri,
    area,
  )
}

/** TCM : cercle — diamètre, π = 3,14 (SVG placement). */
function generateTcmCirclePeriAire(rng: Rng): MathItem {
  const diameter = pick(rng, [3, 5, 7, 9, 11, 13, 15, 17])
  const r = diameter / 2
  const pi = 3.14
  const peri = Math.round(pi * diameter * 100) / 100
  const area = Math.round(pi * r * r * 1000) / 1000
  return {
    layout: 'geo',
    figure: 'circle',
    dims: { diameter, unit: 'cm' },
    geoDualPads: true,
    calcAnswer: `3,14 × ${fmt(diameter)}`,
    calcAnswerSecondary: `3,14 × ${fmt(r)}²`,
    propertyLines: [
      { label: 'Périmètre', answer: `${fmt(peri)} cm` },
      { label: 'Aire', answer: `${fmt(area)} cm²` },
    ],
    answer: `Périmètre = ${fmt(peri)} cm ; Aire = ${fmt(area)} cm²`,
  }
}

/**
 * TCM ex. 15 : suites 6 termes, 4 trous, 2 visibles consécutifs.
 * Q1 : 10 000–99 999, écart 500–900 ×5 hors centaines.
 * Q2 : 0–9,99, écart 0,05–0,95 ×0,05 hors dixièmes ronds.
 */
function generateTcmSuites6Batch(rng: Rng): MathItem[] {
  const length = 6
  const makeBlanks = (): number[] => {
    const pairStart = int(rng, 0, length - 2)
    const visible = new Set([pairStart, pairStart + 1])
    return Array.from({ length }, (_, k) => k).filter((k) => !visible.has(k))
  }
  const makeInt = (): MathItem => {
    const candidates: number[] = []
    for (let s = 500; s <= 900; s += 5) {
      if (s % 100 !== 0) candidates.push(s)
    }
    const step = pick(rng, candidates)
    const span = step * (length - 1)
    const maxStart = Math.max(10_000, 99_999 - span)
    const start = int(rng, 10_000, maxStart)
    const seq = Array.from({ length }, (_, k) => start + k * step)
    const blanks = makeBlanks()
    return {
      layout: 'sequence',
      sequence: seq.map((v, k) => (blanks.includes(k) ? '□' : String(v))),
      blankIndexes: blanks,
      sequenceDigits: 5,
      answer: blanks.map((k) => String(seq[k]!)).join(' ; '),
    }
  }
  const makeDec = (): MathItem => {
    // Multiples impairs de 0,05 (évite 0,10 ; 0,20…).
    const oddK = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    const stepK = pick(rng, oddK)
    const spanK = stepK * (length - 1)
    const startMaxK = Math.max(1, 199 - spanK)
    const startK = int(rng, 1, startMaxK)
    const seq = Array.from({ length }, (_, k) => {
      const u = startK + k * stepK
      return Math.round(u * 5) / 100 // u × 0,05
    })
    const blanks = makeBlanks()
    const show = (n: number) => fmt(n)
    return {
      layout: 'sequence',
      sequence: seq.map((v, k) => (blanks.includes(k) ? '□' : show(v))),
      blankIndexes: blanks,
      sequenceDigits: 5,
      answer: blanks.map((k) => show(seq[k]!)).join(' ; '),
    }
  }
  return [makeInt(), makeDec()]
}

/**
 * TCM ex. 17 : + et − décimaux à poser (grille vide 6 col, calcul au-dessus).
 * Soustraction : 1er nombre 1 ou 2 déc. ; 2e nombre = 1 décimale de plus.
 */
function generateTcmDecAddSubBatch(rng: Rng): MathItem[] {
  const addP = decimalAddPair(rng, 40)
  const placesA = pick(rng, [1, 2] as const)
  const placesB = placesA + 1
  const subA = pickWithPlaces(rng, 5, 40, placesA)
  const subBMax = Math.max(10 ** -placesB, subA - 10 ** -placesB)
  let subB = pickWithPlaces(rng, 10 ** -placesB, subBMax, placesB)
  if (subB >= subA) {
    subB = pickWithPlaces(rng, 10 ** -placesB, Math.max(10 ** -placesB, subA / 2), placesB)
  }
  if (subB >= subA) {
    subB = roundToPlaces(Math.max(10 ** -placesB, subA - 10 ** -placesB), placesB)
  }
  const subResult = roundToPlaces(subA - subB, placesB)
  const add = withFixedColumnWidth(columnItem('+', addP.a, addP.b, addP.result, true), 6)
  const sub = withFixedColumnWidth(columnItem('−', subA, subB, subResult, true), 6)
  return rng() < 0.5 ? [add, sub] : [sub, add]
}

/**
 * TCM ex. 18 : multiplications à poser (grille vide 6 col, calcul au-dessus).
 * Entier 100–999 × 11–99 ; décimal 4 chiffres (2–3 déc.) × [1,1 ; 9,9].
 */
function generateTcmMulMixteBatch(rng: Rng): MathItem[] {
  // D’abord le décimal (plusieurs tirages) pour éviter le biais LCG du 1er int(100,999).
  const placesA = pick(rng, [2, 3] as const)
  // 4 chiffres au total : 2 déc. → 2 entiers ; 3 déc. → 1 entier.
  const intDigits = 4 - placesA
  const intPart =
    intDigits === 1 ? int(rng, 1, 9) : int(rng, 10, 99)
  const fracMax = 10 ** placesA - 1
  const fracMin = placesA === 2 ? 10 : 100 // pas de zéro leading inutile côté décimal
  let frac = int(rng, fracMin, fracMax)
  // Éviter une queue de zéros qui réduirait le nombre de décimales affichées.
  while (frac % 10 === 0) frac = int(rng, fracMin, fracMax)
  const aDec = intPart + frac / 10 ** placesA
  // 1,1 … 9,9 — exclure les ×,0 (2,0 · 3,0…) qui sont des entiers.
  let bTenths = int(rng, 11, 99)
  while (bTenths % 10 === 0) bTenths = int(rng, 11, 99)
  const bDec = bTenths / 10
  const product = Math.round(aDec * bDec * 10 ** (placesA + 1)) / 10 ** (placesA + 1)
  const mulDec = withFixedColumnWidth(columnItem('×', aDec, bDec, product, true), 6)

  const aInt = int(rng, 100, 999)
  const bInt = int(rng, 11, 99)
  const mulInt = withFixedColumnWidth(columnItem('×', aInt, bInt, aInt * bInt, true), 6)

  return rng() < 0.5 ? [mulInt, mulDec] : [mulDec, mulInt]
}

/**
 * TCM ex. 19 : deux divisions posées (4 col dividende / 4 col quotient).
 * Gauche : entier 1 000–9 999 ÷ 12–19 (exact).
 * Droite : décimal 4 chiffres (2–3 décimales, avec un 0) ÷ 3–9 (exact).
 */
function generateTcmDivMixteBatch(rng: Rng): MathItem[] {
  const dInt = int(rng, 12, 19)
  const qMin = Math.ceil(1_000 / dInt)
  const qMax = Math.floor(9_999 / dInt)
  const qInt = int(rng, qMin, qMax)
  const left = withFixedDivisionWorkRows(
    withFixedDivisionWidth(divisionColumnItem(dInt * qInt, dInt, false), 4, 4),
  )

  let dDec = int(rng, 3, 9)
  let dividendDec = 0
  for (let guard = 0; guard < 120; guard++) {
    const places = pick(rng, [2, 3] as const)
    // 4 chiffres au total : 2 déc. → 2 entiers ; 3 déc. → 1 entier.
    const digs =
      places === 2
        ? [int(rng, 1, 9), int(rng, 0, 9), int(rng, 0, 9), int(rng, 1, 9)]
        : [int(rng, 1, 9), int(rng, 0, 9), int(rng, 0, 9), int(rng, 1, 9)]
    if (!digs.includes(0)) digs[int(rng, 1, digs.length - 2)] = 0
    const scaled = digs.reduce((acc, d) => acc * 10 + d, 0)
    if (scaled % dDec !== 0) continue
    const value = scaled / 10 ** places
    if (decimalPlacesOf(value) !== places) continue
    dividendDec = value
    break
  }
  if (dividendDec <= 0) {
    // Repli déterministe : 12,06 ÷ 3 = 4,02 (4 chiffres, 2 déc., un 0).
    dividendDec = 12.06
    dDec = 3
  }
  const right = withFixedDivisionWorkRows(
    withFixedDivisionWidth(divisionColumnItem(dividendDec, dDec, false), 4, 4),
  )
  return [left, right]
}

const TCM_POW_SUP = ['', '¹', '²', '³', '⁴'] as const

/**
 * TCM ex. 27 — quatre questions :
 * 1) base 1–9 à la puissance 2, 3 ou 4 (puissance 4 → base 1–5) ;
 * 2) √n avec n ≤ 144 et racine entière ;
 * 3) décimal ∈ ]1 ; 10[ × 10^p (p = 1…4) ;
 * 4) entier 100–9999 ÷ 10^p (p = 1…4).
 */
function generateTcmPuissancesMixteBatch(rng: Rng): MathItem[] {
  const exp = pick(rng, [2, 3, 4] as const)
  const base = exp === 4 ? int(rng, 1, 5) : int(rng, 1, 9)
  const powerItem: MathItem = {
    layout: 'inline',
    prompt: `${base}${TCM_POW_SUP[exp]} =`,
    answer: String(base ** exp),
  }

  const root = int(rng, 2, 12) // √4 … √144
  const rootItem: MathItem = {
    layout: 'inline',
    prompt: `√${root * root} =`,
    answer: String(root),
  }

  const pMul = int(rng, 1, 4)
  let tenths = int(rng, 11, 99) // 1,1 … 9,9
  while (tenths % 10 === 0) tenths = int(rng, 11, 99)
  const dec = tenths / 10
  // tenths/10 × 10^p = tenths × 10^(p-1) — exact, sans bruit flottant.
  const mulItem: MathItem = {
    layout: 'inline',
    prompt: `${fmt(dec)} × 10${TCM_POW_SUP[pMul]} =`,
    answer: fmt(tenths * 10 ** (pMul - 1)),
  }

  const pDiv = int(rng, 1, 4)
  const whole = int(rng, 100, 9999)
  const divItem: MathItem = {
    layout: 'inline',
    prompt: `${whole} ÷ 10${TCM_POW_SUP[pDiv]} =`,
    answer: fmt(Number((whole / 10 ** pDiv).toFixed(pDiv))),
  }

  return [powerItem, rootItem, mulItem, divItem]
}

/** Affiche un relatif : (+4) ou (−4). */
function fmtRelatif(n: number): string {
  if (n >= 0) return `(+${n})`
  return `(−${Math.abs(n)})`
}

function fmtRelatifAnswer(n: number): string {
  if (Math.abs(n - Math.round(n)) < 1e-8) {
    const r = Math.round(n)
    return r >= 0 ? `(+${r})` : `(−${Math.abs(r)})`
  }
  const t = fmt(n)
  return n >= 0 ? `(+${t})` : `(−${t.replace(/^-/, '').replace(/^−/, '')})`
}

/** Paire de signes opposés, ordre aléatoire (+ puis −, ou − puis +). */
function tcmOppositeSignedPair(rng: Rng, lo: number, hi: number): [number, number] {
  const pos = int(rng, lo, hi)
  const neg = -int(rng, lo, hi)
  return rng() < 0.5 ? [pos, neg] : [neg, pos]
}

/**
 * TCM ex. 29 — quatre opérations sur relatifs :
 * 1) + et 2) − : magnitudes 10–99, signes opposés (+/− ou −/+) ;
 * 3) × et 4) ÷ : 1er facteur 10–25 (2 chiffres), 2e 1–9 (1 chiffre), signes libres ;
 * positifs toujours écrits (+n) ; quotient ÷ éventuellement décimal.
 */
function generateTcmRelatifsOpsBatch(rng: Rng): MathItem[] {
  const [addA, addB] = tcmOppositeSignedPair(rng, 10, 99)
  const [subA, subB] = tcmOppositeSignedPair(rng, 10, 99)

  const signed = (mag: number) => (rng() < 0.5 ? mag : -mag)
  const mulA = signed(int(rng, 10, 25))
  const mulB = signed(int(rng, 1, 9))
  const divA = signed(int(rng, 10, 25))
  let divB = signed(int(rng, 1, 9))
  while (divB === 0) divB = signed(int(rng, 1, 9))

  const divRaw = divA / divB
  const divAns = Number(divRaw.toFixed(3))

  return [
    {
      layout: 'inline',
      prompt: `${fmtRelatif(addA)} + ${fmtRelatif(addB)} =`,
      answer: fmtRelatifAnswer(addA + addB),
    },
    {
      layout: 'inline',
      prompt: `${fmtRelatif(subA)} − ${fmtRelatif(subB)} =`,
      answer: fmtRelatifAnswer(subA - subB),
    },
    {
      layout: 'inline',
      prompt: `${fmtRelatif(mulA)} × ${fmtRelatif(mulB)} =`,
      answer: fmtRelatifAnswer(mulA * mulB),
    },
    {
      layout: 'inline',
      prompt: `${fmtRelatif(divA)} ÷ ${fmtRelatif(divB)} =`,
      answer: fmtRelatifAnswer(divAns),
    },
  ]
}

/** Fraction affichable (dénominateur > 0 ; numérateur éventuellement négatif). */
function fracSigned(n: number, d: number): string {
  let num = n
  let den = d
  if (den < 0) {
    num = -num
    den = -den
  }
  if (den === 0) den = 1
  return num < 0 ? `-${Math.abs(num)}/${den}` : `${num}/${den}`
}

function fracAnswer(n: number, d: number): string {
  const [sn, sd] = simplify(n, d)
  if (sd === 1) return String(sn)
  return fracSigned(sn, sd)
}

/** Fraction réductible (k ≥ 2) et sa forme simplifiée (num et den > 1). */
function tcmReducibleFraction(rng: Rng): { n: number; d: number; sn: number; sd: number } {
  for (let attempt = 0; attempt < 40; attempt++) {
    const sn = int(rng, 2, 9)
    const sd = int(rng, sn + 1, 14)
    const g = gcd(sn, sd)
    const a = sn / g
    const b = sd / g
    if (a <= 1 || b <= 1) continue
    const k = int(rng, 2, 6)
    return { n: a * k, d: b * k, sn: a, sd: b }
  }
  return { n: 4, d: 6, sn: 2, sd: 3 }
}

/** Deux fractions pour ×/÷ : au moins un numérateur relatif (négatif) ; parfois les deux. */
function tcmSignedFracPair(rng: Rng): [{ n: number; d: number }, { n: number; d: number }] {
  const one = (): { n: number; d: number } => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const n = int(rng, 1, 6)
      const d = int(rng, 2, 9)
      if (n !== d) return { n, d }
    }
    return { n: 2, d: 5 }
  }
  const a = one()
  const b = one()

  const both = rng() < 0.4
  if (both) {
    return [
      { n: -a.n, d: a.d },
      { n: -b.n, d: b.d },
    ]
  }
  if (rng() < 0.5) return [{ n: -a.n, d: a.d }, b]
  return [a, { n: -b.n, d: b.d }]
}

/**
 * TCM ex. 30 — six questions fractions :
 * 1) réduire avec num ou den déjà affiché (□) ;
 * 2) réduire sans trou partiel ;
 * 3) +  4) −  (fractions positives) ;
 * 5) ×  6) ÷  avec ≥ 1 nombre relatif (numérateur signé ; parfois deux).
 */
function generateTcmFractionsMixteBatch(rng: Rng): MathItem[] {
  const r1 = tcmReducibleFraction(rng)
  const missNum = rng() < 0.5
  const reducePartial: MathItem = {
    layout: 'inline',
    prompt: missNum
      ? `${frac(r1.n, r1.d)} = □/${r1.sd}`
      : `${frac(r1.n, r1.d)} = ${r1.sn}/□`,
    answer: missNum ? String(r1.sn) : String(r1.sd),
  }

  const r2 = tcmReducibleFraction(rng)
  const reduceFull: MathItem = {
    layout: 'inline',
    prompt: `${frac(r2.n, r2.d)} =`,
    answer: fracAnswer(r2.sn, r2.sd),
  }

  // + : même dénominateur
  const dAdd = int(rng, 4, 12)
  const nAdd1 = int(rng, 1, dAdd - 2)
  const nAdd2 = int(rng, 1, dAdd - nAdd1)
  const addItem: MathItem = {
    layout: 'inline',
    prompt: `${frac(nAdd1, dAdd)} + ${frac(nAdd2, dAdd)} =`,
    answer: fracAnswer(nAdd1 + nAdd2, dAdd),
  }

  // − : dénominateurs différents (dénominateur commun via produit)
  const dSub1 = int(rng, 3, 9)
  let dSub2 = int(rng, 3, 9)
  while (dSub2 === dSub1) dSub2 = int(rng, 3, 9)
  const nSub1 = int(rng, 1, dSub1 - 1)
  const nSub2 = int(rng, 1, dSub2 - 1)
  // Garantir résultat positif : comparer n1/d1 et n2/d2
  const leftBigger = nSub1 * dSub2 >= nSub2 * dSub1
  const sn1 = leftBigger ? nSub1 : nSub2
  const sd1 = leftBigger ? dSub1 : dSub2
  const sn2 = leftBigger ? nSub2 : nSub1
  const sd2 = leftBigger ? dSub2 : dSub1
  const subItem: MathItem = {
    layout: 'inline',
    prompt: `${frac(sn1, sd1)} − ${frac(sn2, sd2)} =`,
    answer: fracAnswer(sn1 * sd2 - sn2 * sd1, sd1 * sd2),
  }

  const [m1, m2] = tcmSignedFracPair(rng)
  const mulItem: MathItem = {
    layout: 'inline',
    prompt: `${fracSigned(m1.n, m1.d)} × ${fracSigned(m2.n, m2.d)} =`,
    answer: fracAnswer(m1.n * m2.n, m1.d * m2.d),
  }

  const [v1, v2] = tcmSignedFracPair(rng)
  const divItem: MathItem = {
    layout: 'inline',
    prompt: `${fracSigned(v1.n, v1.d)} ÷ ${fracSigned(v2.n, v2.d)} =`,
    answer: fracAnswer(v1.n * v2.d, v1.d * v2.n),
  }

  return [reducePartial, reduceFull, addItem, subItem, mulItem, divItem]
}

/** Facteurs décimaux TCM ex. 26 (× / ÷ → résultat entier côté « facteur »). */
const TCM_DEC_FACTORS = [0.01, 0.1, 0.2, 0.25, 0.5] as const

/** Décimal avec partie fractionnaire visible (1–2 décimales), dans ]0 ; maxInt]. */
function tcmDecOperand(rng: Rng, maxInt = 40): number {
  const places = pick(rng, [1, 2] as const)
  const scale = 10 ** places
  let scaled = int(rng, 1, maxInt * scale)
  while (scaled % 10 === 0) scaled = int(rng, 1, maxInt * scale)
  return scaled / scale
}

/**
 * TCM ex. 26 : six opérations en ligne —
 * + et − (deux décimaux) ;
 * × (100–999 × facteur 0,01…0,5, résultat entier) et × (1 déc. 10–99 × 3–9) ;
 * ÷ (100–999 ÷ facteur, résultat entier) et ÷ (1 déc. 10–99 ÷ 3–9, exact).
 */
function generateTcmOpsDecimalesBatch(rng: Rng): MathItem[] {
  const addA = tcmDecOperand(rng, 40)
  const addB = tcmDecOperand(rng, 40)
  const addPlaces = Math.max(decimalPlacesOf(addA), decimalPlacesOf(addB))
  const addResult = Math.round((addA + addB) * 10 ** addPlaces) / 10 ** addPlaces

  let subA = tcmDecOperand(rng, 40)
  let subB = tcmDecOperand(rng, 40)
  if (subB > subA) [subA, subB] = [subB, subA]
  if (subB >= subA) subB = tcmDecOperand(rng, Math.max(1, Math.floor(subA)))
  if (subB >= subA) {
    subA = Math.round((subB + tcmDecOperand(rng, 10)) * 100) / 100
  }
  const subPlaces = Math.max(decimalPlacesOf(subA), decimalPlacesOf(subB))
  const subResult = Math.round((subA - subB) * 10 ** subPlaces) / 10 ** subPlaces

  // × et ÷ « facteur » : deux facteurs distincts (0,01…0,5).
  const factorMul = pick(rng, [...TCM_DEC_FACTORS])
  const factorDivPool = TCM_DEC_FACTORS.filter((f) => f !== factorMul)
  const factorDiv = pick(rng, [...factorDivPool])

  const mulFactor = (() => {
    const factor = factorMul
    const kMin = Math.max(1, Math.ceil(100 * factor))
    const kMax = Math.floor(999 * factor)
    const k = int(rng, kMin, Math.max(kMin, kMax))
    const n = Math.round(k / factor)
    return inlineOp('×', n, factor, k, 'result')
  })()

  const mulDec = (() => {
    let tenths = int(rng, 101, 989)
    while (tenths % 10 === 0) tenths = int(rng, 101, 989)
    const a = tenths / 10
    const b = int(rng, 3, 9)
    const result = Math.round(a * b * 10) / 10
    return inlineOp('×', a, b, result, 'result')
  })()

  const divFactor = (() => {
    const factor = factorDiv
    const n = int(rng, 100, 999)
    const result = Math.round(n / factor)
    return inlineOp('÷', n, factor, result, 'result')
  })()

  const divDec = (() => {
    const b = int(rng, 3, 9)
    const candidates: number[] = []
    for (let t = 101; t <= 989; t++) {
      if (t % 10 === 0) continue
      if (t % b === 0) candidates.push(t)
    }
    const tenths = candidates.length ? pick(rng, candidates) : b * int(rng, 15, 90) + (b % 10 || 1)
    const a = tenths / 10
    // Exact : a ÷ b = tenths / (10 × b)
    const exact = tenths / (10 * b)
    return inlineOp('÷', a, b, exact, 'result')
  })()

  return [
    inlineOp('+', addA, addB, addResult, 'result'),
    inlineOp('−', subA, subB, subResult, 'result'),
    mulFactor,
    mulDec,
    divFactor,
    divDec,
  ]
}

/**
 * TCM ex. 16 : trier.
 * Q1 : 5 nombres 10 000–99 999 (5 chiffres ; paires début / fin + 1 centre).
 * Q2 : 5 décimaux motifs x,0x · x,x · x,xx · x,xx · x,x0.
 */
function generateTcmRangerBatch(rng: Rng): MathItem[] {
  const orderItem = (
    ascending: boolean,
    sequence: string[],
    ordered: string[],
  ): MathItem => ({
    layout: 'order',
    sequence,
    placeParts: ordered,
    orderOp: ascending ? '<' : '>',
    prompt: ascending ? 'Du plus petit au plus grand :' : 'Du plus grand au plus petit :',
    answer: ordered.join(ascending ? ' < ' : ' > '),
  })

  // Q1 — 5 grands nombres (mélanger d’abord, puis tirer l’ordre).
  const first = int(rng, 1, 9)
  let firstB = int(rng, 1, 9)
  while (firstB === first) firstB = int(rng, 1, 9)
  const a1 = first * 10_000 + int(rng, 1_000, 9_999)
  let a2 = first * 10_000 + int(rng, 1_000, 9_999)
  while (a2 % 100 === a1 % 100 || a2 === a1) a2 = first * 10_000 + int(rng, 1_000, 9_999)
  const end2 = int(rng, 10, 99)
  const b1 = firstB * 10_000 + int(rng, 10, 99) * 100 + end2
  let b2Head = int(rng, 1, 9)
  while (b2Head === firstB || b2Head === first) b2Head = int(rng, 1, 9)
  const b2 = b2Head * 10_000 + int(rng, 10, 99) * 100 + end2
  const mid = int(rng, 10, 99)
  let cHead = int(rng, 1, 9)
  while (cHead === first || cHead === firstB || cHead === b2Head) cHead = int(rng, 1, 9)
  const cEnd = int(rng, 10, 99)
  const c1 = cHead * 10_000 + mid * 100 + cEnd
  const intNumbers = shuffle(rng, [a1, a2, b1, b2, c1])

  // Une Q croissant, une Q décroissant (tirage après brassage — pas le 1er rng()).
  const intAscending = rng() < 0.5
  const intOrdered = [...intNumbers].sort((x, y) => (intAscending ? x - y : y - x))
  const intItem = orderItem(
    intAscending,
    intNumbers.map(String),
    intOrdered.map(String),
  )

  // Q2 — 5 décimaux, ordre opposé.
  const x = int(rng, 1, 9)
  const d1 = int(rng, 1, 9)
  const d2 = int(rng, 1, 9)
  let t1 = int(rng, 1, 9)
  let h1 = int(rng, 1, 9)
  let t2 = int(rng, 1, 9)
  let h2 = int(rng, 1, 9)
  while (t1 === t2 && h1 === h2) {
    t2 = int(rng, 1, 9)
    h2 = int(rng, 1, 9)
  }
  let t0 = int(rng, 1, 9)
  while (t0 === d2) t0 = int(rng, 1, 9)
  const values = [
    x + d1 / 100,
    x + d2 / 10,
    x + t1 / 10 + h1 / 100,
    x + t2 / 10 + h2 / 100,
    x + t0 / 10,
  ]
  const show = (n: number, kind: '0x' | 'x' | 'xx' | 'x0'): string => {
    if (kind === '0x') return `${x},0${Math.round((n - x) * 100)}`
    if (kind === 'x') return `${x},${Math.round((n - x) * 10)}`
    if (kind === 'x0') return `${x},${Math.round((n - x) * 10)}0`
    const cents = Math.round((n - x) * 100)
    return `${x},${String(cents).padStart(2, '0')}`
  }
  const kinds: Array<'0x' | 'x' | 'xx' | 'x0'> = ['0x', 'x', 'xx', 'xx', 'x0']
  const labeled = values.map((v, i) => ({ v, text: show(v, kinds[i]!) }))
  const shuffled = shuffle(rng, labeled)
  const decAscending = !intAscending
  const decOrdered = [...shuffled].sort((a, b) =>
    decAscending ? a.v - b.v : b.v - a.v,
  )
  const decItem = orderItem(
    decAscending,
    shuffled.map((e) => e.text),
    decOrdered.map((e) => e.text),
  )

  return [intItem, decItem]
}

/** 3 additions + 3 soustractions (templates résultat / trou), opérandes 10–100. */
function generateTcmOperationsBatch(rng: Rng): MathItem[] {
  type Kind =
    | { op: '+'; missing: 'result' }
    | { op: '+'; missing: 'a' }
    | { op: '+'; missing: 'b' }
    | { op: '−'; missing: 'result' }
    | { op: '−'; missing: 'a' }
    | { op: '−'; missing: 'b' }
  const kinds: Kind[] = [
    { op: '+', missing: 'result' },
    { op: '+', missing: 'b' },
    { op: '+', missing: 'a' },
    { op: '−', missing: 'result' },
    { op: '−', missing: 'b' },
    { op: '−', missing: 'a' },
  ]
  return shuffle(rng, kinds).map((kind) => {
    if (kind.op === '+') {
      // Opérandes et somme dans 10–100.
      const a = int(rng, 10, 90)
      const b = int(rng, 10, 100 - a)
      return inlineOp('+', a, b, a + b, kind.missing)
    }
    // Soustraction : opérandes 10–100, résultat ≥ 0.
    const b = int(rng, 10, 100)
    const a = int(rng, b, 100)
    return inlineOp('−', a, b, a - b, kind.missing)
  })
}

function fmt(n: number): string {
  return String(n).replace('.', ',')
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

function decimalPlacesOf(n: number): number {
  if (!Number.isFinite(n)) return 0
  for (let places = 0; places <= 3; places++) {
    const factor = 10 ** places
    if (Math.abs(n * factor - Math.round(n * factor)) < 1e-8) return places
  }
  return 3
}

function scaleInt(n: number, places: number): number {
  return Math.round(Math.abs(n) * 10 ** places)
}

/** Chiffres d’un entier (parties déjà mises à l’échelle). */
function digits(n: number, width: number): string[] {
  const s = String(Math.abs(Math.trunc(n))).padStart(width, ' ')
  return s.split('').map((ch) => (ch === ' ' ? '' : ch))
}

/**
 * Chiffres d’un nombre décimal : partie entière + décimales.
 * La case des unités garde un 0 si besoin (ex. 0,5).
 */
function digitsDecimal(n: number, intWidth: number, places: number): string[] {
  const scaled = scaleInt(n, places)
  const factor = 10 ** places
  const intPart = places > 0 ? Math.floor(scaled / factor) : scaled
  const fracPart = places > 0 ? scaled % factor : 0
  const intDigits = String(intPart)
    .padStart(intWidth, ' ')
    .split('')
    .map((ch) => (ch === ' ' ? '' : ch))
  if (places > 0 && intPart === 0) intDigits[intWidth - 1] = '0'
  if (places <= 0) return intDigits
  const fracDigits = String(fracPart).padStart(places, '0').split('')
  return [...intDigits, ...fracDigits]
}

function widthOf(...nums: number[]): number {
  return Math.max(1, ...nums.map((n) => String(Math.abs(Math.trunc(n))).length))
}

function intWidthOf(n: number, places: number): number {
  const scaled = scaleInt(n, places)
  const intPart = places > 0 ? Math.floor(scaled / 10 ** places) : scaled
  return Math.max(1, String(intPart).length)
}

/** Retenues (addition / × 1 chiffre) ou emprunts (soustraction) alignés sur les colonnes. */
function computeCarries(op: ArithOp, scaledA: number, scaledB: number, width: number): string[] {
  const da = digits(scaledA, width).map((d) => (d === '' ? 0 : Number(d)))
  const db = digits(scaledB, width).map((d) => (d === '' ? 0 : Number(d)))
  const carries = Array.from({ length: width }, () => '')
  if (op === '+') {
    let carry = 0
    for (let i = width - 1; i >= 0; i--) {
      if (carry > 0) carries[i] = String(carry)
      const sum = da[i]! + db[i]! + carry
      carry = Math.floor(sum / 10)
    }
  } else if (op === '−') {
    let borrow = 0
    for (let i = width - 1; i >= 0; i--) {
      const top = da[i]! - borrow
      const bottom = db[i]!
      if (top < bottom) {
        carries[i] = '1'
        borrow = 1
      } else {
        borrow = 0
      }
    }
  } else if (op === '×') {
    let carry = 0
    const mul = scaledB % 10
    for (let i = width - 1; i >= 0; i--) {
      if (carry > 0) carries[i] = String(carry)
      const prod = da[i]! * mul + carry
      carry = Math.floor(prod / 10)
    }
  }
  return carries
}

/** Chiffres d’un entier mis à l’échelle, avec 0 forcé dans la case des unités. */
function digitsScaledAligned(scaled: number, width: number, places: number): string[] {
  const cells = digits(scaled, width)
  if (places > 0) {
    const unitsIdx = width - places - 1
    if (unitsIdx >= 0 && cells[unitsIdx] === '') cells[unitsIdx] = '0'
  }
  return cells
}

/** × décimal × décimal (b à 1 décimale, 1,1–9,9) : produits partiels sur entiers mis à l’échelle. */
function columnMulDecimalItem(a: number, b: number, result: number, empty: boolean): MathItem {
  const placesA = Math.max(1, decimalPlacesOf(a))
  const placesB = Math.max(1, decimalPlacesOf(b))
  const places = placesA + placesB
  const sa = scaleInt(a, placesA)
  const sb = scaleInt(b, placesB)
  const units = sb % 10
  const tens = Math.floor(sb / 10)
  const partialUnits = sa * units
  const partialTens = sa * tens * 10
  const product = sa * sb
  const aScaled = sa * 10 ** (places - placesA)
  const bScaled = sb * 10 ** (places - placesB)
  const w = Math.max(
    1,
    String(product).length,
    String(aScaled).length,
    String(bScaled).length,
    String(partialUnits).length,
    String(partialTens).length,
  )
  return {
    layout: empty ? 'column-empty' : 'column',
    prompt: empty ? `${fmt(a)} × ${fmt(b)}` : undefined,
    op: '×',
    a,
    b,
    result,
    digitsA: digitsScaledAligned(aScaled, w, places),
    digitsB: digitsScaledAligned(bScaled, w, places),
    digitsPartials: [digits(partialUnits, w), digits(partialTens, w)],
    digitsResult: digitsScaledAligned(product, w, places),
    carries: computeCarries('×', aScaled, units, w),
    decimalPlaces: places,
    blankOperands: empty,
    answer: fmt(result),
  }
}

function columnItem(op: ArithOp, a: number, b: number, result: number, empty: boolean): MathItem {
  if (op === '×' && (decimalPlacesOf(a) > 0 || decimalPlacesOf(b) > 0) && decimalPlacesOf(b) > 0) {
    return columnMulDecimalItem(a, b, result, empty)
  }
  const places =
    op === '×'
      ? Math.max(decimalPlacesOf(a), decimalPlacesOf(result))
      : Math.max(decimalPlacesOf(a), decimalPlacesOf(b), decimalPlacesOf(result))
  const sa = scaleInt(a, places)
  const sb = op === '×' ? Math.round(Math.abs(b)) : scaleInt(b, places)
  const intW = Math.max(
    intWidthOf(a, places),
    op === '×' ? String(Math.round(Math.abs(b))).length : intWidthOf(b, places),
    intWidthOf(result, places),
  )
  const w = intW + places
  return {
    layout: empty ? 'column-empty' : 'column',
    prompt: empty ? `${fmt(a)} ${op} ${fmt(b)}` : undefined,
    op,
    a,
    b,
    result,
    digitsA: digitsDecimal(a, intW, places),
    // × entier : multiplicateur aligné à droite.
    digitsB: op === '×' ? digits(sb, w) : digitsDecimal(b, intW, places),
    digitsResult: digitsDecimal(result, intW, places),
    carries: computeCarries(op, sa, sb, w),
    decimalPlaces: places > 0 ? places : undefined,
    blankOperands: empty,
    answer: fmt(result),
  }
}

function padDigitRow(row: string[] | undefined, width: number): string[] {
  const src = row ?? []
  if (src.length >= width) return src
  return [...Array.from({ length: width - src.length }, () => ''), ...src]
}

/** Pad à droite (décimales) puis à gauche (partie entière) pour aligner la virgule. */
function padDecimalRow(
  row: string[] | undefined,
  places: number,
  targetPlaces: number,
  totalWidth: number,
): string[] {
  const src = row ?? []
  const p = Math.max(0, places)
  const frac = p > 0 ? src.slice(Math.max(0, src.length - p)) : []
  const intPart = p > 0 ? src.slice(0, Math.max(0, src.length - p)) : [...src]
  while (frac.length < targetPlaces) frac.push(p > 0 || targetPlaces > 0 ? '0' : '')
  return padDigitRow([...intPart, ...frac], totalWidth)
}

/** Aligne tous les tableaux en colonnes d’une fiche sur la même largeur (et ligne de retenues). */
function normalizeColumnLayouts(items: MathItem[]): MathItem[] {
  const columnItems = items.filter(
    (item) => item.layout === 'column' || item.layout === 'column-empty',
  )
  if (columnItems.length === 0) return items
  const maxPlaces = Math.max(0, ...columnItems.map((item) => item.decimalPlaces ?? 0))
  const maxIntWidth = Math.max(
    1,
    ...columnItems.map((item) => {
      const places = item.decimalPlaces ?? 0
      const len = Math.max(
        item.digitsA?.length ?? 0,
        item.digitsB?.length ?? 0,
        item.digitsResult?.length ?? 0,
        item.carries?.length ?? 0,
        ...(item.digitsPartials?.map((row) => row.length) ?? [0]),
      )
      return Math.max(1, len - places)
    }),
  )
  const maxWidth = maxIntWidth + maxPlaces
  const maxPartials = Math.max(0, ...columnItems.map((item) => item.digitsPartials?.length ?? 0))
  return items.map((item) => {
    if (item.layout !== 'column' && item.layout !== 'column-empty') return item
    const places = item.decimalPlaces ?? 0
    const partials = item.digitsPartials ?? []
    const padRow = (row: string[] | undefined) =>
      maxPlaces > 0 || places > 0
        ? padDecimalRow(row, places, maxPlaces, maxWidth)
        : padDigitRow(row, maxWidth)
    const paddedPartials =
      maxPartials > 0
        ? Array.from({ length: maxPartials }, (_, i) => padRow(partials[i]))
        : undefined
    const bIsDecimal =
      item.op === '×' && typeof item.b === 'number' && decimalPlacesOf(item.b) > 0
    return {
      ...item,
      digitsA: padRow(item.digitsA),
      // × entier : aligné à droite ; × décimal : même alignement de virgule.
      digitsB:
        item.op === '×' && !bIsDecimal ? padDigitRow(item.digitsB, maxWidth) : padRow(item.digitsB),
      digitsResult: padRow(item.digitsResult),
      carries: padRow(item.carries ?? Array.from({ length: maxWidth }, () => '')),
      digitsPartials: paddedPartials,
      decimalPlaces: maxPlaces > 0 ? maxPlaces : undefined,
    }
  })
}

function buildDivisionSteps(digitsStr: string, divisor: number): DivisionStep[] {
  const steps: DivisionStep[] = []
  let current = 0
  for (let i = 0; i < digitsStr.length; i++) {
    current = current * 10 + Number(digitsStr[i] || 0)
    if (current < divisor && steps.length === 0 && i < digitsStr.length - 1) continue
    const qDigit = Math.floor(current / divisor)
    const product = qDigit * divisor
    const rem = current - product
    steps.push({
      bringDown: String(current),
      product: String(product),
      remainder: String(rem),
      endCol: i,
    })
    current = rem
  }
  return steps
}

function placeDigitsAtEnd(value: string, width: number, endCol: number): string[] {
  const row = Array.from({ length: width }, () => '')
  const start = Math.max(0, endCol - value.length + 1)
  for (let k = 0; k < value.length; k++) {
    const col = start + k
    if (col >= 0 && col < width) row[col] = value[k]!
  }
  return row
}

function divisionColumnItem(dividend: number, divisor: number, empty: boolean): MathItem {
  const places = Math.max(decimalPlacesOf(dividend), decimalPlacesOf(dividend / divisor))
  const scale = 10 ** places
  const scaledDividend = scaleInt(dividend, places)
  const scaledQuotient = Math.floor(scaledDividend / divisor)
  const remainder = scaledDividend % divisor
  const quotient = places > 0 ? scaledQuotient / scale : scaledQuotient
  const intW = intWidthOf(dividend, places)
  const digitsA = digitsDecimal(dividend, intW, places)
  const width = digitsA.length
  const digitsStr = digitsA.map((d) => (d === '' ? '0' : d)).join('')
  const steps = buildDivisionSteps(digitsStr, divisor)
  const workRows: string[][] = []
  for (const step of steps) {
    workRows.push(placeDigitsAtEnd(step.product, width, step.endCol))
    workRows.push(placeDigitsAtEnd(step.remainder, width, step.endCol))
  }
  // Au moins 2 lignes de travail (1 étape) pour la fiche élève.
  while (workRows.length < 2) {
    workRows.push(Array.from({ length: width }, () => ''))
  }
  const qIntW = Math.max(1, String(Math.floor(Math.abs(quotient))).length)
  return {
    layout: 'division-column',
    op: '÷',
    prompt: empty ? `${fmt(dividend)} ÷ ${fmt(divisor)}` : undefined,
    dividend,
    divisor,
    quotient,
    remainder: places > 0 ? remainder / scale : remainder,
    digitsA,
    digitsB: String(divisor).split(''),
    digitsResult: digitsDecimal(quotient, qIntW, places),
    digitsPartials: workRows,
    digitsRemainder: digits(remainder, Math.max(1, String(remainder).length)),
    divisionSteps: steps,
    decimalPlaces: places > 0 ? places : undefined,
    blankOperands: empty,
    answer:
      remainder && places === 0
        ? `${scaledQuotient} reste ${remainder}`
        : fmt(quotient),
  }
}

/** Aligne les divisions posées d’une fiche (même largeur / même nb de lignes de travail). */
function normalizeDivisionLayouts(items: MathItem[]): MathItem[] {
  const divItems = items.filter((item) => item.layout === 'division-column')
  if (divItems.length === 0) return items
  const maxWidth = Math.max(1, ...divItems.map((item) => item.digitsA?.length ?? 0))
  const maxWork = Math.max(2, ...divItems.map((item) => item.digitsPartials?.length ?? 0))
  const maxDivisor = Math.max(1, ...divItems.map((item) => item.digitsB?.length ?? 0))
  const maxQuotient = Math.max(1, ...divItems.map((item) => item.digitsResult?.length ?? 0))
  const maxRem = Math.max(1, ...divItems.map((item) => item.digitsRemainder?.length ?? 0))
  return items.map((item) => {
    if (item.layout !== 'division-column') return item
    const work = item.digitsPartials ?? []
    return {
      ...item,
      digitsA: padDigitRow(item.digitsA, maxWidth),
      digitsB: padDigitRow(item.digitsB, maxDivisor),
      digitsResult: padDigitRow(item.digitsResult, maxQuotient),
      digitsRemainder: padDigitRow(item.digitsRemainder, maxRem),
      digitsPartials: Array.from({ length: maxWork }, (_, i) =>
        padDigitRow(work[i] ?? Array.from({ length: maxWidth }, () => ''), maxWidth),
      ),
    }
  })
}

function inlineOp(op: ArithOp, a: number, b: number, result: number, missing: MissingPos = 'result'): MathItem {
  const leftA = missing === 'a' ? '□' : fmt(a)
  const leftB = missing === 'b' ? '□' : fmt(b)
  const right = missing === 'result' ? '□' : fmt(result)
  const answer = missing === 'a' ? fmt(a) : missing === 'b' ? fmt(b) : fmt(result)
  return {
    layout: missing === 'result' ? 'inline' : 'inline',
    prompt: `${leftA} ${op} ${leftB} = ${right}`,
    op,
    a,
    b,
    result,
    missing,
    answer,
  }
}

function roundTo(n: number, unit: number): number {
  return Math.round(n / unit) * unit
}

function frac(n: number, d: number): string {
  return `${n}/${d}`
}

function simplify(n: number, d: number): [number, number] {
  const g = gcd(n, d)
  return [n / g, d / g]
}

function dec(rng: Rng, maxInt = 20, places = 2): number {
  const scale = 10 ** places
  return int(rng, 1, maxInt * scale) / scale
}

function decStr(n: number): string {
  return n.toFixed(2).replace('.', ',').replace(/,0+$/, '').replace(/,(\d)0$/, ',$1')
}

const PLACE = ['unités', 'dizaines', 'centaines', 'milliers'] as const

function generateItems(
  typeId: string,
  count: number,
  rng: Rng,
  difficulty: Difficulty,
  range?: NumberRange,
  shapes?: Figure[],
): MathItem[] {
  if (typeId === 'tcm-comparer') {
    return generateTcmComparerBatch(rng, count)
  }
  if (typeId === 'tcm-suite') {
    return generateTcmSuiteBatch(rng, count)
  }
  if (typeId === 'tcm-operations') {
    return generateTcmOperationsBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-quatre-ops') {
    return generateTcmQuatreOpsBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-add-sub-col-3') {
    return normalizeColumnLayouts(generateTcmAddSubColBatch(rng, 3).slice(0, Math.max(1, count)))
  }
  if (typeId === 'tcm-add-sub-col-4') {
    return normalizeColumnLayouts(generateTcmAddSubColBatch(rng, 4).slice(0, Math.max(1, count)))
  }
  if (typeId === 'tcm-decompose-99') {
    return generateTcmDecompose99Batch(rng, count)
  }
  if (typeId === 'tcm-grandes-suites') {
    return generateTcmGrandesSuitesBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-decompose-9999') {
    return generateTcmDecompose9999Batch(rng, count)
  }
  if (typeId === 'tcm-mul-div-col') {
    // Largeurs imposées (× 5 col · ÷ 5/5) : pas de normalize qui les élargirait.
    return generateTcmMulDivColBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-rect-peri-aire') {
    return [generateTcmRectPeriAire(rng)]
  }
  if (typeId === 'tcm-para-peri-aire') {
    return [generateTcmParaPeriAire(rng)]
  }
  if (typeId === 'tcm-tri-peri-aire') {
    return [generateTcmTriPeriAire(rng)]
  }
  if (typeId === 'tcm-rhombus-peri-aire') {
    return [generateTcmRhombusPeriAire(rng)]
  }
  if (typeId === 'tcm-trap-peri-aire') {
    return [generateTcmTrapPeriAire(rng)]
  }
  if (typeId === 'tcm-circle-peri-aire') {
    return [generateTcmCirclePeriAire(rng)]
  }
  if (typeId === 'tcm-suites-6') {
    return generateTcmSuites6Batch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-ranger') {
    return generateTcmRangerBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-dec-add-sub') {
    // Largeur imposée à 6 : ne pas ré-aligner via normalize (sinon > 6 col).
    return generateTcmDecAddSubBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-mul-mixte') {
    return generateTcmMulMixteBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-div-mixte') {
    return generateTcmDivMixteBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-frac-color') {
    return genFracItems(rng, Math.max(1, count)).map((item) => ({
      layout: 'fraction-shape' as const,
      fracShape: { ...item, mode: 'color' as const },
      answer: `${item.n}/${item.d}`,
    }))
  }
  if (typeId === 'tcm-frac-read') {
    return genFracItems(rng, Math.max(1, count)).map((item) => ({
      layout: 'fraction-shape' as const,
      fracShape: { ...item, mode: 'read' as const },
      answer: `${item.n}/${item.d}`,
    }))
  }
  if (typeId === 'tcm-ops-decimales') {
    return generateTcmOpsDecimalesBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-puissances-mixte') {
    return generateTcmPuissancesMixteBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-priorite-ops') {
    return generateTcmPrioriteBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-relatifs-ops') {
    return generateTcmRelatifsOpsBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-fractions-mixte') {
    return generateTcmFractionsMixteBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-expressions-reduire') {
    return generateTcmReduireBatch(rng).slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-expressions-evaluer') {
    return generateTcmEvaluerBatch(rng).items.slice(0, Math.max(1, count))
  }
  if (typeId === 'tcm-proportion-kg') {
    return generateTcmProportionKgBatch(rng, count)
  }
  if (typeId === 'conversions-longueur' && count >= 2) {
    // Lot unique (pas deux fois mm→cm) ; Q5–Q6 en décimal si count ≥ 5.
    return generateLengthConversionBatch(rng, count)
  }
  const items: MathItem[] = []
  for (let i = 0; i < count; i++) {
    items.push(generateOne(typeId, rng, i, difficulty, range, shapes))
  }
  return normalizeDivisionLayouts(normalizeColumnLayouts(items))
}

function generateOne(
  typeId: string,
  rng: Rng,
  index: number,
  difficulty: Difficulty,
  range?: NumberRange,
  shapes?: Figure[],
): MathItem {
  const routed =
    tryGenerateFigure(typeId, index) ??
    tryGenerateConversion(typeId, rng, difficulty) ??
    tryGenerateMesure(typeId, rng, difficulty, range, shapes)
  if (routed) return routed
  const max = upperBound(difficulty, range)
  const nMax = range ? range.max : nombreBound(difficulty)
  switch (typeId) {
    case 'nombres-chiffres': {
      const n = int(rng, 0, Math.min(999, nMax))
      return { layout: 'text', prompt: numberToFrench(n), answer: String(n) }
    }
    case 'nombres-lettres': {
      const n = int(rng, 0, Math.min(999, nMax))
      return { layout: 'text', prompt: String(n), answer: numberToFrench(n) }
    }
    case 'nombres-compter-formes': {
      return generateCountIcons(rng)
    }
    case 'tcm-comparer': {
      // Lot complet généré dans generateItems ; repli unitaire.
      const [item] = generateTcmComparerBatch(rng, 1)
      return item!
    }
    case 'tcm-suite': {
      return generateTcmSuite(rng)
    }
    case 'tcm-operations': {
      const [item] = generateTcmOperationsBatch(rng)
      return item!
    }
    case 'tcm-quatre-ops': {
      const [item] = generateTcmQuatreOpsBatch(rng)
      return item!
    }
    case 'tcm-add-sub-col-3': {
      return generateTcmAddSubColBatch(rng, 3)[0]!
    }
    case 'tcm-add-sub-col-4': {
      return generateTcmAddSubColBatch(rng, 4)[0]!
    }
    case 'tcm-decompose-99': {
      return generateTcmDecompose99Batch(rng, 1)[0]!
    }
    case 'tcm-grandes-suites': {
      return generateTcmGrandesSuitesBatch(rng)[0]!
    }
    case 'tcm-decompose-9999': {
      return generateTcmDecompose9999Batch(rng, 1)[0]!
    }
    case 'tcm-mul-div-col': {
      return generateTcmMulDivColBatch(rng)[0]!
    }
    case 'tcm-rect-peri-aire': {
      return generateTcmRectPeriAire(rng)
    }
    case 'tcm-para-peri-aire': {
      return generateTcmParaPeriAire(rng)
    }
    case 'tcm-tri-peri-aire': {
      return generateTcmTriPeriAire(rng)
    }
    case 'tcm-rhombus-peri-aire': {
      return generateTcmRhombusPeriAire(rng)
    }
    case 'tcm-trap-peri-aire': {
      return generateTcmTrapPeriAire(rng)
    }
    case 'tcm-circle-peri-aire': {
      return generateTcmCirclePeriAire(rng)
    }
    case 'tcm-suites-6': {
      return generateTcmSuites6Batch(rng)[0]!
    }
    case 'tcm-ranger': {
      return generateTcmRangerBatch(rng)[0]!
    }
    case 'tcm-dec-add-sub': {
      return generateTcmDecAddSubBatch(rng)[0]!
    }
    case 'tcm-mul-mixte': {
      return generateTcmMulMixteBatch(rng)[0]!
    }
    case 'tcm-div-mixte': {
      return generateTcmDivMixteBatch(rng)[0]!
    }
    case 'tcm-frac-color': {
      const item = genFracItems(rng, 1)[0]!
      return {
        layout: 'fraction-shape',
        fracShape: { ...item, mode: 'color' },
        answer: `${item.n}/${item.d}`,
      }
    }
    case 'tcm-frac-read': {
      const item = genFracItems(rng, 1)[0]!
      return {
        layout: 'fraction-shape',
        fracShape: { ...item, mode: 'read' },
        answer: `${item.n}/${item.d}`,
      }
    }
    case 'tcm-ops-decimales': {
      return generateTcmOpsDecimalesBatch(rng)[0]!
    }
    case 'tcm-puissances-mixte': {
      return generateTcmPuissancesMixteBatch(rng)[0]!
    }
    case 'tcm-priorite-ops': {
      return generateTcmPrioriteBatch(rng)[0]!
    }
    case 'tcm-relatifs-ops': {
      return generateTcmRelatifsOpsBatch(rng)[0]!
    }
    case 'tcm-fractions-mixte': {
      return generateTcmFractionsMixteBatch(rng)[0]!
    }
    case 'tcm-expressions-reduire': {
      return generateTcmReduireBatch(rng)[0]!
    }
    case 'tcm-expressions-evaluer': {
      return generateTcmEvaluerBatch(rng).items[0]!
    }
    case 'tcm-proportion-kg': {
      return generateTcmProportionKgBatch(rng, 1)[0]!
    }
    case 'nombres-position': {
      const n = int(rng, 100, 9999)
      const place = PLACE[int(rng, 0, Math.min(3, String(n).length - 1))]!
      const idx = { unités: 0, dizaines: 1, centaines: 2, milliers: 3 }[place]
      const digit = Math.floor(n / 10 ** idx) % 10
      return {
        layout: 'text',
        prompt: `Dans ${n.toLocaleString('fr-CH')}, le chiffre des ${place} est`,
        answer: String(digit),
      }
    }
    case 'nombres-decompose': {
      const digits = index % 2 === 0 ? 3 : 4
      const n =
        digits === 3
          ? (() => {
              let v = int(rng, 111, 999)
              while (v % 10 === 0) v = int(rng, 111, 999)
              return v
            })()
          : (() => {
              let v = int(rng, 1111, 9999)
              while (v % 10 === 0) v = int(rng, 1111, 9999)
              return v
            })()
      const u = n % 10
      const d = Math.floor((n % 100) / 10)
      const c = Math.floor((n % 1000) / 100)
      const m = Math.floor(n / 1000)
      const placeParts =
        digits === 4
          ? [String(m * 1000), String(c * 100), String(d * 10), String(u)]
          : [String(c * 100), String(d * 10), String(u)]
      const labels =
        digits === 4
          ? ['milliers', 'centaines', 'dizaines', 'unités']
          : ['centaines', 'dizaines', 'unités']
      return {
        layout: 'place-value',
        prompt: n.toLocaleString('fr-CH'),
        labels,
        placeParts,
        answer: placeParts.join(' + '),
      }
    }
    case 'nombres-comparer': {
      const a = int(rng, 1, 999)
      let b = int(rng, 1, 999)
      if (index % 5 === 0) b = a
      const answer = a < b ? '<' : a > b ? '>' : '='
      return { layout: 'compare', left: String(a), right: String(b), answer }
    }
    case 'nombres-encadrer-10':
    case 'nombres-encadrer-100': {
      const unit = typeId === 'nombres-encadrer-10' ? 10 : 100
      const hi = Math.max(unit * 2 + 1, max)
      let n = int(rng, unit + 1, hi)
      while (n % unit === 0) n = int(rng, unit + 1, hi)
      const lo = Math.floor(n / unit) * unit
      return {
        layout: 'encadrement',
        prompt: String(n),
        a: lo,
        b: lo + unit,
        answer: `${lo} < ${n} < ${lo + unit}`,
      }
    }
    case 'nombres-pair': {
      const n = int(rng, 1, Math.min(999, max))
      return {
        layout: 'select',
        prompt: String(n),
        options: ['pair', 'impair'],
        answer: n % 2 === 0 ? 'pair' : 'impair',
      }
    }
    case 'nombres-ranger': {
      const pool = [
        int(rng, 1, Math.min(50, max)),
        int(rng, 10, Math.min(99, max)),
        int(rng, 10, Math.min(99, max)),
        int(rng, Math.min(100, max), Math.min(999, max)),
        int(rng, Math.min(100, max), Math.min(999, max)),
      ].map((n) => Math.min(n, max))
      const numbers = shuffle(rng, pool)
      const ascending = rng() < 0.5
      const ordered = [...numbers].sort((a, b) => (ascending ? a - b : b - a))
      return {
        layout: 'order',
        sequence: numbers.map(String),
        placeParts: ordered.map(String),
        orderOp: ascending ? '<' : '>',
        prompt: ascending ? 'Du plus petit au plus grand :' : 'Du plus grand au plus petit :',
        answer: ordered.join(ascending ? ' < ' : ' > '),
      }
    }
    case 'nombres-suite': {
      const stepMax = difficulty === 'facile' ? 5 : difficulty === 'moyen' ? 9 : 15
      const step = int(rng, 2, stepMax)
      const start = int(rng, 1, difficulty === 'facile' ? 30 : 80)
      const length = 8
      const seq = Array.from({ length }, (_, k) => start + k * step)
      const blankCount = 3
      const indexes = shuffle(
        rng,
        Array.from({ length }, (_, k) => k),
      ).slice(0, blankCount)
      const blanks = [...indexes].sort((a, b) => a - b)
      return {
        layout: 'sequence',
        sequence: seq.map((n, k) => (blanks.includes(k) ? '□' : String(n))),
        blankIndexes: blanks,
        answer: blanks.map((k) => String(seq[k]!)).join(' ; '),
      }
    }
    case 'addition-ligne': {
      const p = pairAdd(rng, difficulty, range)
      return inlineOp('+', p.a, p.b, p.result)
    }
    case 'addition-trou': {
      const p = pairAdd(rng, difficulty, range)
      return inlineOp('+', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'addition-colonne':
    case 'addition-colonne-poser': {
      const p = columnAddPair(rng, difficulty, range)
      return columnItem('+', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'addition-comparer': {
      const p = pairAdd(rng, difficulty, range)
      const q = pairAdd(rng, difficulty, range)
      const left = p.result
      const right = q.result
      return {
        layout: 'compare',
        left: `${p.a} + ${p.b}`,
        right: `${q.a} + ${q.b}`,
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'soustraction-ligne': {
      const p = pairSub(rng, difficulty, range)
      return inlineOp('−', p.a, p.b, p.result)
    }
    case 'soustraction-trou': {
      const p = pairSub(rng, difficulty, range)
      return inlineOp('−', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'soustraction-colonne':
    case 'soustraction-colonne-poser': {
      const p = columnSubPair(rng, difficulty, range)
      return columnItem('−', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'soustraction-comparer': {
      const p = pairSub(rng, difficulty, range)
      const q = pairSub(rng, difficulty, range)
      const left = p.result
      const right = q.result
      return {
        layout: 'compare',
        left: `${p.a} − ${p.b}`,
        right: `${q.a} − ${q.b}`,
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'estimation-dizaine': {
      let n = int(rng, 11, Math.min(99, max))
      while (n % 10 === 0) n = int(rng, 11, Math.min(99, max))
      return { layout: 'inline', prompt: `${n} ≈`, answer: String(roundTo(n, 10)) }
    }
    case 'estimation-centaine': {
      const hi = Math.max(101, Math.min(999, max))
      let n = int(rng, 101, hi)
      while (n % 100 === 0) n = int(rng, 101, hi)
      return { layout: 'inline', prompt: `${n} ≈`, answer: String(roundTo(n, 100)) }
    }
    case 'estimation-somme': {
      const p = pairAdd(rng, difficulty === 'facile' ? 'facile' : 'moyen', range)
      return { layout: 'inline', prompt: `${p.a} + ${p.b} ≈`, answer: String(roundTo(p.a, 10) + roundTo(p.b, 10)) }
    }
    case 'estimation-difference': {
      const p = pairSub(rng, difficulty === 'facile' ? 'facile' : 'moyen', range)
      return { layout: 'inline', prompt: `${p.a} − ${p.b} ≈`, answer: String(roundTo(p.a, 10) - roundTo(p.b, 10)) }
    }
    case 'multiplication-ligne': {
      const p = pairMul(rng, difficulty, range)
      return inlineOp('×', p.a, p.b, p.result)
    }
    case 'multiplication-trou': {
      const p = pairMul(rng, difficulty, range)
      return inlineOp('×', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'multiplication-colonne':
    case 'multiplication-colonne-poser': {
      const p = columnMulPair(rng, difficulty, range)
      return columnItem('×', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'multiplication-2chiffres': {
      const aMax = difficulty === 'facile' ? 49 : difficulty === 'moyen' ? 99 : 999
      const a = int(rng, 12, aMax)
      let b = int(rng, 12, difficulty === 'facile' ? 29 : 99)
      while (b % 10 === 0) b = int(rng, 12, difficulty === 'facile' ? 29 : 99)
      const units = b % 10
      const tens = Math.floor(b / 10)
      const partialUnits = a * units
      const partialTens = a * tens * 10
      const result = a * b
      const w = widthOf(a, b, partialUnits, partialTens, result)
      return {
        layout: 'column',
        op: '×',
        a,
        b,
        result,
        digitsA: digits(a, w),
        digitsB: digits(b, w),
        digitsPartials: [digits(partialUnits, w), digits(partialTens, w)],
        digitsResult: digits(result, w),
        carries: computeCarries('×', a, units, w),
        answer: String(result),
      }
    }
    case 'division-ligne': {
      const p = pairDiv(rng, difficulty, range)
      return inlineOp('÷', p.a, p.b, p.result)
    }
    case 'division-trou': {
      const p = pairDiv(rng, difficulty, range)
      return inlineOp('÷', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'division-colonne':
    case 'division-colonne-poser': {
      if (range) {
        const p = columnDivPair(rng, range)
        return divisionColumnItem(p.a, p.b, typeId.endsWith('poser'))
      }
      const divisor = int(rng, 2, difficulty === 'avance' ? 12 : 9)
      const quotient = int(
        rng,
        difficulty === 'facile' ? 4 : 12,
        difficulty === 'facile' ? 20 : difficulty === 'moyen' ? 99 : 250,
      )
      const remainder = int(rng, 0, divisor - 1)
      const dividend = divisor * quotient + remainder
      return divisionColumnItem(dividend, divisor, typeId.endsWith('poser'))
    }
    case 'problemes-addition':
      return makeWordProblem(rng, difficulty, 'addition')
    case 'problemes-soustraction':
      return makeWordProblem(rng, difficulty, 'soustraction')
    case 'problemes-add-sub':
      return makeWordProblem(rng, difficulty, 'add-sub')
    case 'problemes-multiplication':
      return makeWordProblem(rng, difficulty, 'multiplication')
    case 'problemes-division':
      return makeWordProblem(rng, difficulty, 'division')
    case 'problemes-melange':
      return makeWordProblem(rng, difficulty, 'melange')
    case 'multiples-reconnaitre': {
      const base = int(rng, 2, 9)
      const yes = rng() < 0.5
      const n = yes ? base * int(rng, 2, 12) : base * int(rng, 2, 12) + int(rng, 1, base - 1)
      return { layout: 'inline', prompt: `${n} est-il un multiple de ${base} ?`, answer: n % base === 0 ? 'oui' : 'non' }
    }
    case 'multiples-diviseurs': {
      const n = pick(rng, [12, 18, 20, 24, 30, 36, 42, 48])
      const list: number[] = []
      for (let d = 1; d <= n; d++) if (n % d === 0) list.push(d)
      return { layout: 'text', prompt: `Quels sont les diviseurs de ${n} ?`, answer: list.join(' ; ') }
    }
    case 'multiples-pgcd': {
      const gMin = difficulty === 'facile' ? 2 : difficulty === 'moyen' ? 4 : 8
      const gMax = difficulty === 'facile' ? 8 : difficulty === 'moyen' ? 24 : 48
      const fMin = difficulty === 'facile' ? 2 : 3
      const fMax = difficulty === 'facile' ? 9 : difficulty === 'moyen' ? 18 : 30
      const g = int(rng, gMin, gMax)
      const k1 = int(rng, fMin, fMax)
      let k2 = int(rng, fMin, fMax)
      while (k2 === k1) k2 = int(rng, fMin, fMax)
      const a = g * k1
      const b = g * k2
      return { layout: 'inline', prompt: `PGCD(${a} ; ${b}) =`, answer: String(gcd(a, b)) }
    }
    case 'multiples-ppcm': {
      const gMin = difficulty === 'facile' ? 1 : difficulty === 'moyen' ? 2 : 4
      const gMax = difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 12 : 24
      const fMin = difficulty === 'facile' ? 2 : 3
      const fMax = difficulty === 'facile' ? 8 : difficulty === 'moyen' ? 16 : 28
      const g = int(rng, gMin, gMax)
      const k1 = int(rng, fMin, fMax)
      let k2 = int(rng, fMin, fMax)
      while (k2 === k1) k2 = int(rng, fMin, fMax)
      const a = g * k1
      const b = g * k2
      return { layout: 'inline', prompt: `PPCM(${a} ; ${b}) =`, answer: String(lcm(a, b)) }
    }
    case 'fractions-identifier': {
      const n = int(rng, 1, 9)
      const d = int(rng, n + 1, 12)
      const ask = rng() < 0.5 ? 'numérateur' : 'dénominateur'
      return { layout: 'inline', prompt: `Dans ${frac(n, d)}, le ${ask} est`, answer: ask === 'numérateur' ? String(n) : String(d) }
    }
    case 'fractions-equivalentes': {
      const n = int(rng, 1, 6)
      const d = int(rng, n + 1, 9)
      const k = int(rng, 2, 5)
      const missNum = rng() < 0.5
      return {
        layout: 'inline',
        prompt: missNum ? `${frac(n, d)} = □/${d * k}` : `${frac(n, d)} = ${n * k}/□`,
        answer: missNum ? String(n * k) : String(d * k),
      }
    }
    case 'fractions-simplifier': {
      const k = int(rng, 2, 6)
      const n = int(rng, 1, 8) * k
      const d = int(rng, 2, 9) * k
      const [sn, sd] = simplify(n, d)
      return { layout: 'inline', prompt: `${frac(n, d)} =`, answer: frac(sn, sd) }
    }
    case 'fractions-comparer': {
      const d = int(rng, 3, 12)
      const n1 = int(rng, 1, d - 1)
      let n2 = int(rng, 1, d - 1)
      if (index % 4 === 0) n2 = n1
      const left = n1 / d
      const right = n2 / d
      return {
        layout: 'compare',
        left: frac(n1, d),
        right: frac(n2, d),
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'fractions-add': {
      const d = int(rng, 4, 12)
      const n1 = int(rng, 1, d - 2)
      const n2 = int(rng, 1, d - n1)
      const op: ArithOp = rng() < 0.5 ? '+' : '−'
      const raw = op === '+' ? n1 + n2 : n1 - n2
      const [sn, sd] = simplify(raw, d)
      return { layout: 'inline', prompt: `${frac(n1, d)} ${op} ${frac(n2, d)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'fractions-mul': {
      const n1 = int(rng, 1, 5)
      const d1 = int(rng, 2, 8)
      const n2 = int(rng, 1, 5)
      const d2 = int(rng, 2, 8)
      const [sn, sd] = simplify(n1 * n2, d1 * d2)
      return { layout: 'inline', prompt: `${frac(n1, d1)} × ${frac(n2, d2)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'fractions-div': {
      const n1 = int(rng, 1, 5)
      const d1 = int(rng, 2, 8)
      const n2 = int(rng, 1, 5)
      const d2 = int(rng, 2, 8)
      const [sn, sd] = simplify(n1 * d2, d1 * n2)
      return { layout: 'inline', prompt: `${frac(n1, d1)} ÷ ${frac(n2, d2)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'decimaux-comparer': {
      const a = dec(rng, 9, 2)
      let b = dec(rng, 9, 2)
      if (index % 5 === 0) b = a
      return {
        layout: 'compare',
        left: decStr(a),
        right: decStr(b),
        answer: a < b ? '<' : a > b ? '>' : '=',
      }
    }
    case 'decimaux-add-colonne':
    case 'decimaux-add-colonne-poser': {
      const p = decimalAddPair(rng, 40)
      return columnItem('+', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'decimaux-sub-colonne':
    case 'decimaux-sub-colonne-poser': {
      const p = decimalSubPair(rng, 40)
      return columnItem('−', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'decimaux-mul-colonne':
    case 'decimaux-mul-colonne-poser': {
      const p = decimalMulPair(rng, 20)
      return columnItem('×', p.a, p.b, p.result, typeId.endsWith('poser'))
    }
    case 'decimaux-div-colonne':
    case 'decimaux-div-colonne-poser': {
      const p = decimalDivPair(rng, difficulty === 'facile' ? 40 : difficulty === 'moyen' ? 120 : 400)
      return divisionColumnItem(p.a, p.b, typeId.endsWith('poser'))
    }
    case 'decimaux-mul-ligne': {
      const factors = [
        { label: '0,5', div: 2 },
        { label: '0,25', div: 4 },
        { label: '0,2', div: 5 },
        { label: '0,125', div: 8 },
        { label: '0,1', div: 10 },
        { label: '0,01', div: 100 },
        { label: '0,001', div: 1000 },
      ] as const
      const pickF = pick(rng, [...factors])
      const maxK = difficulty === 'facile' ? 12 : difficulty === 'moyen' ? 40 : 120
      const k = int(rng, 2, maxK)
      const n = k * pickF.div
      return {
        layout: 'inline',
        prompt: `${fmt(n)} × ${pickF.label} =`,
        answer: fmt(k),
      }
    }
    case 'decimaux-div-ligne': {
      const factors = [
        { label: '0,5', mul: 2 },
        { label: '0,25', mul: 4 },
        { label: '0,2', mul: 5 },
        { label: '0,125', mul: 8 },
        { label: '0,1', mul: 10 },
        { label: '0,01', mul: 100 },
        { label: '0,001', mul: 1000 },
      ] as const
      const pickF = pick(rng, [...factors])
      const maxN = difficulty === 'facile' ? 20 : difficulty === 'moyen' ? 80 : 200
      const n = int(rng, 1, maxN)
      const result = n * pickF.mul
      return {
        layout: 'inline',
        prompt: `${fmt(n)} ÷ ${pickF.label} =`,
        answer: fmt(result),
      }
    }
    case 'proportion-notion': {
      const pairs = [
        ['1/2', '50 %'],
        ['1/4', '25 %'],
        ['3/4', '75 %'],
        ['1/5', '20 %'],
        ['1/10', '10 %'],
      ] as const
      const pair = pick(rng, pairs)
      const askPct = rng() < 0.5
      return { layout: 'inline', prompt: askPct ? `${pair[0]} =` : `${pair[1]} =`, answer: askPct ? pair[1] : pair[0] }
    }
    case 'proportion-de': {
      const pct = pick(rng, [10, 20, 25, 50])
      const n = pct === 25 ? int(rng, 2, 8) * 4 : int(rng, 2, 12) * 10
      return { layout: 'inline', prompt: `${pct} % de ${n} =`, answer: String((pct * n) / 100) }
    }
    case 'proportion-var': {
      const n = int(rng, 2, 12) * 10
      const pct = pick(rng, [10, 20, 25])
      const up = rng() < 0.5
      const result = up ? n * (1 + pct / 100) : n * (1 - pct / 100)
      return {
        layout: 'inline',
        prompt: up ? `${n} augmenté de ${pct} % =` : `${n} diminué de ${pct} % =`,
        answer: String(result),
      }
    }
    case 'proportion-problemes': {
      const n = int(rng, 4, 12) * 10
      const pct = pick(rng, [10, 20, 25, 50])
      const result = n - (pct * n) / 100
      return {
        layout: 'text',
        prompt: `Un article coûte ${n} CHF. Pendant les soldes, il est réduit de ${pct} %. Quel est le nouveau prix ?`,
        calcAnswer: `${n} − ${pct} %`,
        responseAnswer: `${result} CHF`,
        answer: `${result} CHF`,
      }
    }
    case 'relatifs-comparer': {
      const a = int(rng, -20, 20)
      let b = int(rng, -20, 20)
      if (index % 5 === 0) b = a
      return { layout: 'compare', left: String(a), right: String(b), answer: a < b ? '<' : a > b ? '>' : '=' }
    }
    case 'relatifs-add': {
      const a = int(rng, -15, 15)
      const b = int(rng, -15, 15)
      const op: ArithOp = rng() < 0.5 ? '+' : '−'
      const result = op === '+' ? a + b : a - b
      return { layout: 'inline', prompt: `(${a}) ${op} (${b}) =`, answer: String(result) }
    }
    case 'relatifs-mul': {
      const a = int(rng, -9, 9) || 2
      const b = int(rng, -9, 9) || 3
      const mul = rng() < 0.6
      const result = mul ? a * b : a / b
      if (!mul && a % b !== 0) {
        const bb = pick(rng, [-4, -3, -2, 2, 3, 4])
        const aa = bb * int(rng, -6, 6) || bb * 2
        return { layout: 'inline', prompt: `(${aa}) ÷ (${bb}) =`, answer: String(aa / bb) }
      }
      return { layout: 'inline', prompt: mul ? `(${a}) × (${b}) =` : `(${a}) ÷ (${b}) =`, answer: String(result) }
    }
    case 'puissances-calcul': {
      const a = int(rng, 2, 9)
      const p = pick(rng, [2, 3])
      const result = a ** p
      return { layout: 'inline', prompt: `${a}${p === 2 ? '²' : '³'} =`, answer: String(result) }
    }
    case 'puissances-10': {
      const p = int(rng, 1, 4)
      return { layout: 'inline', prompt: `10${['¹', '²', '³', '⁴'][p - 1]} =`, answer: String(10 ** p) }
    }
    case 'puissances-racine': {
      const a = int(rng, 2, 12)
      return { layout: 'inline', prompt: `√${a * a} =`, answer: String(a) }
    }
    case 'puissances-priorite': {
      const a = int(rng, 2, 6)
      const b = int(rng, 2, 5)
      const c = int(rng, 2, 4)
      return { layout: 'inline', prompt: `${a} + ${b} × ${c} =`, answer: String(a + b * c) }
    }
    case 'expressions-substituer': {
      const n = int(rng, 2, 6)
      const k = int(rng, 1, 9)
      const x = int(rng, 2, 8)
      return { layout: 'inline', prompt: `Calculez ${n}x + ${k} pour x = ${x}`, answer: String(n * x + k) }
    }
    case 'expressions-reduire': {
      const a = int(rng, 2, 8)
      const b = int(rng, 2, 8)
      return { layout: 'inline', prompt: `Réduisez : ${a}x + ${b}x`, answer: `${a + b}x` }
    }
    case 'expressions-developper': {
      const n = int(rng, 2, 8)
      const k = int(rng, 1, 9)
      return { layout: 'inline', prompt: `Développez : ${n}(x + ${k})`, answer: `${n}x + ${n * k}` }
    }
    case 'expressions-factoriser': {
      const n = int(rng, 2, 6)
      const a = n * int(rng, 2, 6)
      const b = n * int(rng, 1, 6)
      return { layout: 'inline', prompt: `Factorisez : ${a}x + ${b}`, answer: `${n}(${a / n}x + ${b / n})` }
    }
    case 'equations-simple': {
      const x = int(rng, 2, 20)
      const b = int(rng, 2, 15)
      return { layout: 'inline', prompt: `x + ${b} = ${x + b}    x =`, answer: String(x) }
    }
    case 'equations-deux-cotes': {
      const x = int(rng, 2, 12)
      const a = int(rng, 3, 6)
      const c = int(rng, 1, a - 1)
      const b = int(rng, 1, 10)
      const d = a * x + b - c * x
      return { layout: 'inline', prompt: `${a}x + ${b} = ${c}x + ${d}    x =`, answer: String(x) }
    }
    case 'equations-fractions': {
      const x = int(rng, 2, 16)
      if (x % 2 !== 0) {
        const xx = x + 1
        return { layout: 'inline', prompt: `x/2 = ${xx / 2}    x =`, answer: String(xx) }
      }
      return { layout: 'inline', prompt: `x/2 = ${x / 2}    x =`, answer: String(x) }
    }
    case 'equations-systeme':
      return generateSystemSubstitution(rng)
    case 'equations-systeme-add':
      return generateSystemAddition(rng)
    case 'perimetres-composees': {
      return generatePerimetreCompose(rng, difficulty, range)
    }
    case 'reperage-lire': {
      const x = int(rng, -4, 5)
      const y = int(rng, -4, 5)
      return {
        layout: 'coord',
        prompt: 'Écrivez les coordonnées du point A.',
        point: { x, y, label: 'A' },
        answer: `(${x} ; ${y})`,
      }
    }
    default:
      return { layout: 'inline', prompt: 'Calculez 1 + 1 =', answer: '2' }
  }
}

function generateTcmConsignes(): MathItem[] {
  const levels: Array<[string, string]> = [
    ['CSC', 'Additions et soustractions'],
    ['CFR', 'Multiplications, divisions, périmètre et aire du rectangle'],
    ['CAF', 'Nombres décimaux, fractions, périmètre et aire'],
    ['CAP', 'Puissances et racines, relatifs, fractions et équations, périmètre et aire'],
  ]
  return [
    {
      layout: 'theory',
      prompt: 'Informations',
      answer: '',
      theoryBlock: { kind: 'heading', text: 'Informations' },
    },
    {
      layout: 'theory',
      prompt: 'niveaux',
      answer: '',
      theoryBlock: {
        kind: 'table',
        headers: ['Niveau', 'Contenu évalué'],
        rows: levels.map(([niveau, contenu]) => [niveau, contenu]),
      },
    },
    {
      layout: 'theory',
      prompt: 'couverture',
      answer: '',
      theoryBlock: {
        kind: 'list',
        title: 'Organisation du test',
        items: [
          '35 exercices couvrant tous les niveaux de CSC jusqu’à CAP',
          '90 minutes pour compléter le test',
          'Score maximum : 100 points',
        ],
      },
    },
    {
      layout: 'theory',
      prompt: 'consignes',
      answer: '',
      theoryBlock: { kind: 'heading', text: 'Consignes', sub: true },
    },
    {
      layout: 'theory',
      prompt: 'consignes-liste',
      answer: '',
      theoryBlock: {
        kind: 'list',
        items: [
          'Lisez chaque consigne attentivement avant de répondre.',
          'Répondez directement sur la fiche, dans les espaces prévus.',
          'Vous pouvez utiliser un brouillon ; reportez ensuite vos réponses sur la fiche.',
          'Si vous ne savez pas répondre, passez à la question suivante et revenez-y plus tard.',
          'Les exercices progressent du plus simple au plus avancé : continuez aussi loin que possible.',
          'Vérifiez vos calculs quand vous avez terminé.',
        ],
      },
    },
    {
      layout: 'theory',
      prompt: 'materiel',
      answer: '',
      theoryBlock: {
        kind: 'note',
        text: 'Matériel autorisé : stylo, crayon, gomme et règle. Pas de calculatrice, sauf indication contraire.',
      },
    },
  ]
}

function buildSingleBlock(
  config: PageConfig,
  seed: number,
): {
  title: string
  instruction: string
  items: MathItem[]
  givens?: AlgebraGiven[]
  document?: WorksheetDocument
  bankQuestionCap?: number
} {
  const rng = createRng(seed)
  const topic = topicById[config.topic]
  const type = exerciseTypeById[config.exerciseType]
  const difficulty = config.difficulty ?? 'moyen'
  const fallbackTitle = type?.label ?? topic?.label ?? 'Exercices'
  if (config.exerciseType === 'tcm-consignes') {
    return {
      title: 'Consignes',
      instruction: type?.instruction ?? 'Lisez les consignes avant de commencer le test.',
      items: generateTcmConsignes(),
    }
  }
  if (config.exerciseType === 'reperage-droites') {
    const droites = generateDroites(config, rng)
    return { title: fallbackTitle, instruction: droites.instruction, items: droites.items }
  }
  if (config.exerciseType === 'reperage-construire') {
    const construire = generateConstruire(config, rng)
    return { title: fallbackTitle, instruction: construire.instruction, items: construire.items }
  }
  if (isTransformationExercise(config.exerciseType)) {
    const tr = generateTransformations(config, rng)
    return { title: fallbackTitle, instruction: tr.instruction, items: tr.items }
  }
  if (config.exerciseType === 'glossaire-algebre-mots' || config.exerciseType === 'glossaire-geometrie-mots') {
    const bank = config.exerciseType === 'glossaire-algebre-mots' ? ALGEBRA_GLOSSARY : GEOMETRY_GLOSSARY
    const count = Math.max(1, Math.min(config.count || 8, bank.length))
    const picked = shuffle(rng, [...bank]).slice(0, count)
    return {
      title: fallbackTitle,
      instruction: type?.instruction ?? 'Lisez chaque mot, sa définition et le schéma.',
      items: picked.map((entry) => ({
        layout: 'glossary' as const,
        prompt: entry.term,
        glossary: {
          term: entry.term,
          definition: entry.definition,
          figure: entry.figure,
        },
        answer: entry.definition,
      })),
    }
  }
  const reperage = tryGenerateReperage(config, rng)
  if (reperage) {
    return { title: fallbackTitle, instruction: reperage.instruction, items: reperage.items }
  }
  const soutien = tryGenerateSoutienBatch(config.exerciseType, config.count, rng, difficulty, {
    soutienMotsLibre: config.soutienMotsLibre,
    soutienMotsEntries: config.soutienMotsEntries,
    columns: config.columns,
    soutienCompleterLibre: config.soutienCompleterLibre,
    soutienCompleterEntries: config.soutienCompleterEntries,
  })
  if (soutien) {
    return {
      title: fallbackTitle,
      instruction: soutien.instruction ?? type?.instruction ?? 'Complétez.',
      items: soutien.items,
    }
  }
  const lecture = tryGenerateLectureBatch(config.exerciseType, config.count, rng, difficulty)
  if (lecture) {
    return {
      title: fallbackTitle,
      instruction: lecture.instruction ?? type?.instruction ?? 'Complétez.',
      items: lecture.items,
    }
  }
  const phrase = tryGeneratePhraseBatch(
    config.exerciseType,
    config.count,
    rng,
    difficulty,
    config.verbGroup ?? 'er',
  )
  if (phrase) {
    const libre =
      config.verbGroup === 'libre' &&
      Array.isArray(config.phraseItems) &&
      config.phraseItems.length > 0
    return {
      title: fallbackTitle,
      instruction: libre
        ? (config.phraseInstruction ?? phrase.instruction ?? type?.instruction ?? 'Complétez.')
        : (phrase.instruction ?? type?.instruction ?? 'Complétez.'),
      items: libre ? config.phraseItems! : phrase.items,
    }
  }
  const algebra = tryGenerateAlgebraBatch(config.exerciseType, config.count, rng, difficulty)
  if (algebra) {
    return {
      title: fallbackTitle,
      instruction: algebra.instruction ?? type?.instruction ?? 'Calculez.',
      items: algebra.items,
      givens: algebra.givens,
    }
  }
  const francais = tryGenerateFrancaisBlock(config.exerciseType, config.count, rng, {
    vocabRows: config.vocabRows,
    vocabCols: config.vocabCols,
    vocabSelected: config.vocabSelected,
    vocabSubgroup: config.vocabSubgroup,
    vocabCustomEntries: config.vocabCustomEntries,
    vocabLineCh: config.vocabLineCh,
    difficulty: config.difficulty,
  })
  if (francais) {
    return {
      title: fallbackTitle,
      instruction: francais.instruction ?? type?.instruction ?? 'Complétez.',
      items: francais.items,
      document: francais.document,
      bankQuestionCap: francais.bankQuestionCap,
    }
  }
  const jeux = tryGenerateJeuxBatch(config.exerciseType, rng, {
    gameEntries: config.gameEntries,
    gameBackColor: config.gameBackColor,
    gameTopic: config.gameTopic,
    gameSeriesName: config.gameSeriesName,
    gameBorderId: config.gameBorderId,
    gameBorderRectoId:
      config.gameBorderRectoId !== undefined
        ? config.gameBorderRectoId
        : config.gameBorderId,
    gameBorderVersoId:
      config.gameBorderVersoId !== undefined
        ? config.gameBorderVersoId
        : config.gameBorderId,
    gameFontSize: config.gameFontSize,
    gameAlpha: config.gameAlpha,
  })
  if (jeux) {
    return {
      title: fallbackTitle,
      instruction: jeux.instruction,
      items: jeux.items,
    }
  }
  const calligraphie = tryGenerateCalligraphieBatch(
    config.exerciseType,
    config.calliText,
    config.calliFont,
    config.calliSize,
  )
  if (calligraphie) {
    return {
      title: fallbackTitle,
      instruction: calligraphie.instruction,
      items: calligraphie.items,
    }
  }
  return {
    title: fallbackTitle,
    instruction: type?.instruction ?? 'Calculez, complète ou simplifiez chaque expression.',
    items: generateItems(
      config.exerciseType,
      config.count,
      rng,
      difficulty,
      numberRangeFrom(config),
      config.quadLibre ? config.quadShapes : undefined,
    ),
  }
}

export function buildPage(config: PageConfig, seed: number, startExercise = 1): WorksheetPage {
  const blocksIn = pageBlocks(config)
  let exerciseCursor = startExercise
  const built: WorksheetBlock[] = blocksIn.map((block, index) => {
    const single = pageAsConfig(config, block)
    const local = block.contentSeed ?? 0
    const result = buildSingleBlock(single, seed + index * 10007 + local)
    const isTheory = /gram-theorie-\d+$/.test(block.exerciseType)
    const isJeux = block.exerciseType.startsWith('jeux-')
    const isTcmConsignes = block.exerciseType === 'tcm-consignes'
    let exerciseIndex = 0
    if (!isTcmConsignes) {
      if (block.exerciseNo != null) {
        exerciseIndex = block.exerciseNo
        exerciseCursor = Math.max(exerciseCursor, block.exerciseNo + 1)
      } else {
        exerciseIndex = exerciseCursor++
      }
    }
    return {
      exerciseIndex,
      title: isTcmConsignes
        ? 'Consignes'
        : isTheory
          ? (result.instruction?.replace(/^Théorie — /, '') || `Théorie`)
          : isJeux
            ? (exerciseTypeById[block.exerciseType]?.label ?? `Jeu ${exerciseIndex}`)
            : `Exercice ${exerciseIndex}`,
      instruction: result.instruction,
      items: result.items,
      columns: block.columns,
      exerciseType: block.exerciseType,
      pointsPerQuestion: block.pointsPerQuestion,
      givens: result.givens,
      document: result.document,
      problemDraftGrids: block.problemDraftGrids,
      oralAnswerModes: block.oralAnswerModes,
      bankQuestionCap: result.bankQuestionCap,
    }
  })
  const first = built[0]
  const topic = topicById[config.topic]
  const type = exerciseTypeById[config.exerciseType]
  const isTheoryPage = /gram-theorie-\d+$/.test(config.exerciseType)
  const isTcmConsignesPage = config.exerciseType === 'tcm-consignes'
  return {
    ...config,
    title: isTcmConsignesPage
      ? 'Consignes'
      : isTheoryPage
        ? (first?.title ?? type?.label ?? 'Théorie')
        : built.length > 1
          ? (topic?.label ?? 'Exercices')
          : (type?.label ?? topic?.label ?? 'Exercices'),
    instruction: first?.instruction ?? type?.instruction ?? 'Complétez.',
    items: built.flatMap((block) => block.items),
    blocks: built,
    givens: first?.givens,
  }
}

export function buildWorksheets(pages: PageConfig[], seed: number): WorksheetPage[] {
  let exerciseNo = 1
  const out: WorksheetPage[] = []

  pages.forEach((page, index) => {
    const worksheet = buildPage(page, seed + index * 7919, exerciseNo)
    const scoredBlocks = worksheet.blocks.filter((block) => block.exerciseType !== 'tcm-consignes')
    if (scoredBlocks.length) {
      exerciseNo = Math.max(...scoredBlocks.map((block) => block.exerciseIndex)) + 1
    }

    const isCom =
      page.exerciseType.includes('-com-orale') || page.exerciseType.includes('-com-ecrite')
    const isTheory = /gram-theorie-\d+$/.test(page.exerciseType)
    const isJeuxDuplex =
      page.exerciseType === 'jeux-vocabulaire' ||
      page.exerciseType === 'jeux-devinettes' ||
      page.exerciseType === 'jeux-memory' ||
      page.exerciseType === 'jeux-intrus' ||
      page.exerciseType === 'jeux-dominos'
    // Jeux recto-verso : une feuille A4 par grille (recto puis verso).
    // Pas « suite » : ce sont deux faces d’une même fiche, pas un débordement.
    if (isJeuxDuplex && worksheet.items.length >= 2) {
      const block = worksheet.blocks[0]
      worksheet.items.forEach((item, part) => {
        const side = part === 0 ? 'Recto' : 'Verso'
        out.push({
          ...worksheet,
          title: `${worksheet.title} — ${side}`,
          instruction: '',
          items: [item],
          blocks: block
            ? [
                {
                  ...block,
                  title: side,
                  instruction: '',
                  items: [item],
                },
              ]
            : worksheet.blocks,
          configIndex: index,
          isContinuation: false,
        })
      })
      return
    }
    // Loto : paires (page grilles + verso thème), puis lot animateur.
    if (page.exerciseType === 'jeux-loto' && worksheet.items.length > 0) {
      const block = worksheet.blocks[0]
      const pushSheet = (item: (typeof worksheet.items)[number], side: string) => {
        out.push({
          ...worksheet,
          title: side ? `${worksheet.title} — ${side}` : worksheet.title,
          instruction: '',
          items: [item],
          blocks: block
            ? [{ ...block, title: side || block.title, instruction: '', items: [item] }]
            : worksheet.blocks,
          configIndex: index,
          isContinuation: false,
        })
      }
      let i = 0
      while (i < worksheet.items.length) {
        const cur = worksheet.items[i]!
        const next = worksheet.items[i + 1]
        const kind = cur.gameBoard?.kind
        if (kind === 'loto-page' && next?.gameBoard?.kind === 'loto-back') {
          pushSheet(cur, 'Recto')
          pushSheet(next, 'Verso')
          i += 2
          continue
        }
        pushSheet(cur, kind === 'loto-call' ? 'Lot animateur' : '')
        i += 1
      }
      return
    }
    // Théorie : ~6 blocs par feuille A4 (titres + tableaux densent vite).
    const pageCap = isTheory ? 6 : 4
    const totalItems = worksheet.items.length
    if (!page.continueOnNextPage || !(isCom || isTheory) || totalItems <= pageCap) {
      out.push({ ...worksheet, configIndex: index, isContinuation: false })
      return
    }

    const suiteInstruction = isTheory
      ? 'Suite de la théorie.'
      : 'Continuez. Répondez aux questions suivantes.'
    const suiteTitleSuffix = isTheory ? 'Suite de la théorie.' : 'Suite des questions.'

    let offset = 0
    let part = 0
    while (offset < totalItems) {
      const sliceEnd = offset + pageCap
      const headBlocks = worksheet.blocks
        .map((block) => ({
          ...block,
          title: part === 0 ? block.title : `${block.title.replace(/ \(suite\)$/, '')} (suite)`,
          instruction: part === 0 ? block.instruction : suiteInstruction,
          document: part === 0 ? block.document : undefined,
          items: block.items.slice(offset, sliceEnd),
          oralAnswerModes: block.oralAnswerModes?.slice(offset, sliceEnd),
          problemDraftGrids: block.problemDraftGrids?.slice(offset, sliceEnd),
        }))
        .filter((block) => block.items.length > 0)

      out.push({
        ...worksheet,
        title: part === 0 ? worksheet.title : `${worksheet.title} — suite`,
        instruction: part === 0 ? worksheet.instruction : suiteTitleSuffix,
        items: headBlocks.flatMap((block) => block.items),
        blocks: headBlocks,
        configIndex: index,
        isContinuation: part > 0,
      })
      offset = sliceEnd
      part++
    }
  })

  return out
}

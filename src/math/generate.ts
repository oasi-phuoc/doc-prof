import {
  generateSystemAddition,
  generateSystemSubstitution,
  tryGenerateAlgebraBatch,
} from './algebra'
import { exerciseTypeById, topicById } from './catalog'
import {
  columnAddPair,
  columnSubPair,
  nombreBound,
  numberRangeFrom,
  pairAdd,
  pairDiv,
  pairMul,
  pairSub,
  upperBound,
  type NumberRange,
} from './difficulty'
import { numberToFrench } from '@/francais/french-numbers'
import { generatePerimetreCompose } from './perimetre-compose'
import { generateConstruire } from './coord-construire'
import { generateDroites } from './coord-droites'
import { tryGenerateReperage } from './coord-reperage'
import { tryGenerateLectureBatch } from '@/francais/lecture'
import { tryGeneratePhraseBatch } from '@/francais/phrase'
import { tryGenerateConversion } from './conversions'
import { tryGenerateFigure } from './figures-school'
import { tryGenerateFrancaisBlock } from '@/francais/francais'
import { tryGenerateJeuxBatch } from '@/jeux/generate'
import { tryGenerateMesure } from './mesures'
import { pageAsConfig, pageBlocks } from './page-model'
import { makeWordProblem } from './problems'
import { createRng, int, pick, shuffle, type Rng } from './rng'
import type {
  AlgebraGiven,
  ArithOp,
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

function digits(n: number, width: number): string[] {
  const s = String(Math.abs(Math.trunc(n))).padStart(width, ' ')
  return s.split('').map((ch) => (ch === ' ' ? '' : ch))
}

function widthOf(...nums: number[]): number {
  return Math.max(1, ...nums.map((n) => String(Math.abs(Math.trunc(n))).length))
}

/** Retenues (addition / × 1 chiffre) ou emprunts (soustraction) alignés sur les colonnes. */
function computeCarries(op: ArithOp, a: number, b: number, width: number): string[] {
  const da = digits(a, width).map((d) => (d === '' ? 0 : Number(d)))
  const db = digits(b, width).map((d) => (d === '' ? 0 : Number(d)))
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
      let top = da[i]! - borrow
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
    for (let i = width - 1; i >= 0; i--) {
      if (carry > 0) carries[i] = String(carry)
      const prod = da[i]! * (b % 10) + carry
      carry = Math.floor(prod / 10)
    }
  }
  return carries
}

function columnItem(op: ArithOp, a: number, b: number, result: number, empty: boolean): MathItem {
  const w = widthOf(a, b, result)
  return {
    layout: empty ? 'column-empty' : 'column',
    prompt: empty ? `${fmt(a)} ${op} ${fmt(b)}` : undefined,
    op,
    a,
    b,
    result,
    digitsA: digits(a, w),
    digitsB: digits(b, w),
    digitsResult: digits(result, w),
    carries: computeCarries(op, a, b, w),
    blankOperands: empty,
    answer: fmt(result),
  }
}

function padDigitRow(row: string[] | undefined, width: number): string[] {
  const src = row ?? []
  if (src.length >= width) return src
  return [...Array.from({ length: width - src.length }, () => ''), ...src]
}

/** Aligne tous les tableaux en colonnes d’une fiche sur la même largeur (et ligne de retenues). */
function normalizeColumnLayouts(items: MathItem[]): MathItem[] {
  const columnItems = items.filter(
    (item) => item.layout === 'column' || item.layout === 'column-empty',
  )
  if (columnItems.length === 0) return items
  const maxWidth = Math.max(
    1,
    ...columnItems.flatMap((item) => [
      item.digitsA?.length ?? 0,
      item.digitsB?.length ?? 0,
      item.digitsResult?.length ?? 0,
      item.carries?.length ?? 0,
      ...(item.digitsPartials?.map((row) => row.length) ?? []),
    ]),
  )
  const maxPartials = Math.max(0, ...columnItems.map((item) => item.digitsPartials?.length ?? 0))
  return items.map((item) => {
    if (item.layout !== 'column' && item.layout !== 'column-empty') return item
    const partials = item.digitsPartials ?? []
    const paddedPartials =
      maxPartials > 0
        ? Array.from({ length: maxPartials }, (_, i) =>
            padDigitRow(partials[i] ?? Array.from({ length: maxWidth }, () => ''), maxWidth),
          )
        : undefined
    return {
      ...item,
      digitsA: padDigitRow(item.digitsA, maxWidth),
      digitsB: padDigitRow(item.digitsB, maxWidth),
      digitsResult: padDigitRow(item.digitsResult, maxWidth),
      carries: padDigitRow(item.carries ?? Array.from({ length: maxWidth }, () => ''), maxWidth),
      digitsPartials: paddedPartials,
    }
  })
}

function buildDivisionSteps(dividend: number, divisor: number): DivisionStep[] {
  const steps: DivisionStep[] = []
  const digitsStr = String(dividend)
  let current = 0
  for (let i = 0; i < digitsStr.length; i++) {
    current = current * 10 + Number(digitsStr[i])
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
  const quotient = Math.floor(dividend / divisor)
  const remainder = dividend % divisor
  const width = String(dividend).length
  const steps = buildDivisionSteps(dividend, divisor)
  const workRows: string[][] = []
  for (const step of steps) {
    workRows.push(placeDigitsAtEnd(step.product, width, step.endCol))
    workRows.push(placeDigitsAtEnd(step.remainder, width, step.endCol))
  }
  // Au moins 2 lignes de travail (1 étape) pour la fiche élève.
  while (workRows.length < 2) {
    workRows.push(Array.from({ length: width }, () => ''))
  }
  return {
    layout: 'division-column',
    op: '÷',
    prompt: empty ? `${fmt(dividend)} ÷ ${fmt(divisor)}` : undefined,
    dividend,
    divisor,
    quotient,
    remainder,
    digitsA: digits(dividend, width),
    digitsB: String(divisor).split(''),
    digitsResult: String(quotient).split(''),
    digitsPartials: workRows,
    digitsRemainder: digits(remainder, Math.max(1, String(remainder).length)),
    divisionSteps: steps,
    blankOperands: empty,
    answer: remainder ? `${quotient} reste ${remainder}` : String(quotient),
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
      const aMax = difficulty === 'facile' ? 99 : difficulty === 'moyen' ? 999 : 9999
      const bMax = difficulty === 'avance' ? 12 : 9
      const a = int(rng, 12, aMax)
      const b = int(rng, 2, bMax)
      return columnItem('×', a, b, a * b, typeId.endsWith('poser'))
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
      const a = Math.round(dec(rng, 40, 2) * 100)
      const b = Math.round(dec(rng, 40, 2) * 100)
      const result = a + b
      const item = columnItem('+', a, b, result, typeId.endsWith('poser'))
      item.prompt = `${decStr(a / 100)} + ${decStr(b / 100)}`
      item.answer = decStr(result / 100)
      item.a = a / 100
      item.b = b / 100
      return item
    }
    case 'decimaux-sub-colonne':
    case 'decimaux-sub-colonne-poser': {
      let a = Math.round(dec(rng, 40, 2) * 100)
      let b = Math.round(dec(rng, 40, 2) * 100)
      if (b > a) [a, b] = [b, a]
      const result = a - b
      const item = columnItem('−', a, b, result, typeId.endsWith('poser'))
      item.prompt = `${decStr(a / 100)} − ${decStr(b / 100)}`
      item.answer = decStr(result / 100)
      item.a = a / 100
      item.b = b / 100
      return item
    }
    case 'decimaux-mul-colonne':
    case 'decimaux-mul-colonne-poser': {
      const a = Math.round(dec(rng, 20, 1) * 10)
      const b = int(rng, 2, difficulty === 'avance' ? 12 : 9)
      const result = a * b
      const item = columnItem('×', a, b, result, typeId.endsWith('poser'))
      item.prompt = `${decStr(a / 10)} × ${b}`
      item.answer = decStr(result / 10)
      item.a = a / 10
      item.b = b
      return item
    }
    case 'decimaux-div-colonne':
    case 'decimaux-div-colonne-poser': {
      const divisor = int(rng, 2, difficulty === 'avance' ? 12 : 9)
      const quotient = int(rng, 2, difficulty === 'facile' ? 20 : 80)
      const dividend = divisor * quotient
      const item = divisionColumnItem(dividend, divisor, typeId.endsWith('poser'))
      item.prompt = `${decStr(dividend / 10)} ÷ ${divisor}`
      item.answer = decStr(quotient / 10)
      return item
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
    case 'transformations-axiale': {
      const x = int(rng, 1, 4)
      const y = int(rng, 1, 4)
      return {
        layout: 'coord',
        prompt: 'Image de A par la symétrie d’axe des ordonnées.',
        point: { x, y, label: 'A' },
        pointImage: { x: -x, y, label: "A'" },
        answer: `(${-x} ; ${y})`,
      }
    }
    case 'transformations-centrale': {
      const x = int(rng, 1, 4)
      const y = int(rng, 1, 4)
      return {
        layout: 'coord',
        prompt: 'Image de A par la symétrie de centre O(0 ; 0).',
        point: { x, y, label: 'A' },
        pointImage: { x: -x, y: -y, label: "A'" },
        answer: `(${-x} ; ${-y})`,
      }
    }
    case 'transformations-translation': {
      const x = int(rng, 1, 3)
      const y = int(rng, 1, 3)
      const vx = int(rng, 1, 2)
      const vy = int(rng, -2, 2)
      return {
        layout: 'coord',
        prompt: `Image de A par la translation de vecteur (${vx} ; ${vy}).`,
        point: { x, y, label: 'A' },
        pointImage: { x: x + vx, y: y + vy, label: "A'" },
        answer: `(${x + vx} ; ${y + vy})`,
      }
    }
    case 'transformations-rotation': {
      const x = int(rng, 1, 3)
      const y = int(rng, 1, 3)
      return {
        layout: 'coord',
        prompt: 'Image de A par la rotation de 90° (sens direct) autour de O.',
        point: { x, y, label: 'A' },
        pointImage: { x: -y, y: x, label: "A'" },
        answer: `(${-y} ; ${x})`,
      }
    }
    default:
      return { layout: 'inline', prompt: 'Calculez 1 + 1 =', answer: '2' }
  }
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
  if (config.exerciseType === 'reperage-droites') {
    const droites = generateDroites(config, rng)
    return { title: fallbackTitle, instruction: droites.instruction, items: droites.items }
  }
  if (config.exerciseType === 'reperage-construire') {
    const construire = generateConstruire(config, rng)
    return { title: fallbackTitle, instruction: construire.instruction, items: construire.items }
  }
  const reperage = tryGenerateReperage(config, rng)
  if (reperage) {
    return { title: fallbackTitle, instruction: reperage.instruction, items: reperage.items }
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
    return {
      title: fallbackTitle,
      instruction: phrase.instruction ?? type?.instruction ?? 'Complétez.',
      items: phrase.items,
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
  })
  if (jeux) {
    return {
      title: fallbackTitle,
      instruction: jeux.instruction,
      items: jeux.items,
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
  const built: WorksheetBlock[] = blocksIn.map((block, index) => {
    const single = pageAsConfig(config, block)
    const result = buildSingleBlock(single, seed + index * 10007)
    const isTheory = /gram-theorie-\d+$/.test(block.exerciseType)
    const isJeux = block.exerciseType.startsWith('jeux-')
    return {
      exerciseIndex: startExercise + index,
      title: isTheory
        ? (result.instruction?.replace(/^Théorie — /, '') || `Théorie`)
        : isJeux
          ? (exerciseTypeById[block.exerciseType]?.label ?? `Jeu ${startExercise + index}`)
          : `Exercice ${startExercise + index}`,
      instruction: result.instruction,
      items: result.items,
      columns: block.columns,
      exerciseType: block.exerciseType,
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
  return {
    ...config,
    title: isTheoryPage
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
    exerciseNo += worksheet.blocks.length

    const isCom =
      page.exerciseType.includes('-com-orale') || page.exerciseType.includes('-com-ecrite')
    const isTheory = /gram-theorie-\d+$/.test(page.exerciseType)
    const isJeuxDuplex =
      page.exerciseType === 'jeux-vocabulaire' || page.exerciseType === 'jeux-devinettes'
    // Jeux recto-verso : une feuille A4 par grille (recto puis verso).
    if (isJeuxDuplex && worksheet.items.length >= 2) {
      const block = worksheet.blocks[0]
      worksheet.items.forEach((item, part) => {
        const side = part === 0 ? 'Recto' : 'Verso'
        out.push({
          ...worksheet,
          title: part === 0 ? worksheet.title : `${worksheet.title} — ${side.toLowerCase()}`,
          instruction:
            part === 0
              ? worksheet.instruction
              : 'Verso — retournez la feuille pour faire correspondre mot et image.',
          items: [item],
          blocks: block
            ? [
                {
                  ...block,
                  title: side,
                  instruction:
                    part === 0
                      ? block.instruction
                      : 'Imprimez en recto-verso (bord long). Les numéros indiquent les paires.',
                  items: [item],
                },
              ]
            : worksheet.blocks,
          configIndex: index,
          isContinuation: part > 0,
        })
      })
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

import { createRng, int, pick, shuffle, type Rng } from '@/math/rng'
import type { Figure, MathItem, PageConfig } from '@/math/types'
import { columnItem, withFixedColumnWidth } from '@/tpm/items'
import { numberAudioParts, SILENCE_6S_AUDIO } from '@/tcm-cfr/audio-nombres'
import { pickSymmetryTemplate } from '@/tcm-cfr/symetrie'
import { buildCountIconsItem } from '@/math/count-icons'
import { tryGenerateReperage } from '@/math/coord-reperage'
import { logiqueItemById, tryGenerateLogiqueBlock } from '@/logique/generate'
import { CSC_DEFAULT_PROBLEMS, rollCscProblem } from './problems'
import { numberDecomposition } from '@/tcm-cfr/items'
import { cscDeniseOperator } from './denise-recordings'

export const CSC_FIGURES: readonly { value: Figure; label: string }[] = [
  { value: 'square', label: 'carré' }, { value: 'rectangle', label: 'rectangle' },
  { value: 'triangle', label: 'triangle' }, { value: 'circle', label: 'cercle' },
  { value: 'rhombus', label: 'losange' }, { value: 'parallelogram', label: 'parallélogramme' },
  { value: 'trapezoid', label: 'trapèze' }, { value: 'pentagon', label: 'pentagone' },
  { value: 'oval', label: 'ovale' },
]
export const CSC_PLUS_AUDIO = cscDeniseOperator('plus')
export const CSC_MINUS_AUDIO = cscDeniseOperator('moins')
export const CSC_SIGN_NAMES = { '+': 'plus', '−': 'moins', '=': 'égal' } as const
export const cscNumberParts = (value: number) => value === 0 ? ['/lib/audio/vocabulaire/objets/zéro.mp3'] : numberAudioParts(value)
export const cscCalculationParts = (a: number, b: number, operation: '+' | '−') => [...numberAudioParts(a), operation === '+' ? CSC_PLUS_AUDIO : CSC_MINUS_AUDIO, ...numberAudioParts(b)]
const uniqueNumbers = (rng: Rng, count: number, min: number, max: number) => shuffle(rng, Array.from({ length: max - min + 1 }, (_, i) => i + min)).slice(0, count)

function audioNumber(value: number): MathItem {
  const parts = numberAudioParts(value)
  return { layout: 'audio-dictation', answer: String(value), audioSrc: parts[0], audioParts: parts }
}
/** Au moins deux + et deux −. Pour cinq calculs : trois d’un signe et deux de l’autre, dans n’importe quel ordre. */
function calculationSigns(rng: Rng, count: number): Array<'+' | '−'> {
  const signs: Array<'+' | '−'> = []
  for (let i = 0; i < Math.min(2, count); i++) signs.push('+')
  for (let i = 0; i < Math.min(2, count - signs.length); i++) signs.push('−')
  const mixed = shuffle(rng, signs)
  while (mixed.length < count) mixed.push(pick(rng, ['+', '−']))
  return shuffle(rng, mixed)
}
function calculations(rng: Rng, count: number): MathItem[] {
  return calculationSigns(rng, count).map((operation) => {
    const a = int(rng, 10, 90), b = int(rng, 1, operation === '+' ? 100 - a : a - 1)
    const parts = cscCalculationParts(a, b, operation)
    return { layout: 'audio-dictation', answer: String(operation === '+' ? a + b : a - b), audioSrc: parts[0], audioParts: parts, cscTask: { kind: 'calculation-audio', a, b, operation } }
  })
}
function numberGrid(rng: Rng, count: number): MathItem {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1), heard = uniqueNumbers(rng, Math.max(1, Math.min(12, count)), 1, 100)
  const parts = heard.flatMap((n, i) => [...(i ? [SILENCE_6S_AUDIO] : []), ...numberAudioParts(n)])
  return { layout: 'csc-task', answer: heard.join(' ; '), audioParts: parts, cscTask: { kind: 'number-grid', numbers, heard } }
}
function sequences(rng: Rng, count: number, help: boolean): MathItem[] {
  const length = help ? 6 : 8
  return Array.from({ length: count }, (_, i) => {
    const step = int(rng, 2, 10) * (i % 2 ? -1 : 1), span = (length - 1) * Math.abs(step)
    const start = step < 0 ? int(rng, span, 100) : int(rng, 0, 100 - span)
    const sequence = Array.from({ length }, (_, j) => String(start + j * step))
    const shown = help ? 2 : 3
    const blankIndexes = shuffle(rng, Array.from({ length }, (_, j) => j)).slice(0, length - shown).sort((a, b) => a - b)
    return { layout: 'sequence', prompt: help ? `${step > 0 ? '+' : '−'}${Math.abs(step)}` : undefined, ...(help ? { cscTask: { kind: 'sequence-hint' as const, step } } : {}), sequence, blankIndexes, answer: blankIndexes.map((j) => sequence[j]).join(' ; ') }
  })
}
export function cscOrderAscending(typeId: string, seed: number): boolean {
  const pageSeed = typeId === 'tcm-csc-ex25' ? seed - 10007 : seed
  const smallFirst = ((pageSeed % 2) + 2) % 2 === 0
  return typeId === 'tcm-csc-ex06' ? smallFirst : !smallFirst
}
export function cscOrderInstruction(ascending: boolean): string {
  return `Écrivez les nombres ${ascending ? 'du plus petit au plus grand' : 'du plus grand au plus petit'}.`
}
function order(rng: Rng, count: number, ascending: boolean): MathItem[] {
  return Array.from({ length: count }, () => {
    const numbers = uniqueNumbers(rng, 7, 0, 100), ordered = [...numbers].sort((a, b) => ascending ? a - b : b - a)
    return { layout: 'order', sequence: numbers.map(String), placeParts: ordered.map(String), orderBoxed: true, orderCompact: true, orderOp: ascending ? '<' : '>', answer: ordered.join(ascending ? ' < ' : ' > ') }
  })
}
function comparisons(rng: Rng, count: number, large: boolean): MathItem[] {
  const signs = shuffle(rng, Array.from({ length: count }, (_, i) => ['<', '>', '='][i % 3]!))
  return signs.map((sign, i) => {
    const max = large && i % 2 ? 999 : large ? 99 : 100
    const a = int(rng, 0, max - 1), b = int(rng, a + 1, max)
    return { layout: 'compare', left: String(sign === '>' ? b : a), right: String(sign === '=' ? a : sign === '>' ? a : b), answer: sign }
  })
}
function signNames(rng: Rng, count: number): MathItem[] {
  return shuffle(rng, ['+', '−', '='] as const).slice(0, count).map(symbol => ({layout:'inline',prompt:symbol,answer:CSC_SIGN_NAMES[symbol],cscTask:{kind:'sign-name',symbol}}))
}
function columnOperations(rng: Rng, count: number, empty: boolean): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / 2), digits = empty ? row === 0 ? 2 : 3 : row === 3 ? 3 : 2
    const lo = digits === 3 ? 100 : 10, hi = digits === 3 ? 999 : 99, small = !empty && row === 0
    const operation = i % 2 ? '−' : '+'
    let a = int(rng, lo, operation === '+' ? hi - (small ? 1 : lo) : hi)
    let b = int(rng, small ? 1 : lo, small ? 9 : operation === '+' ? hi - a : a)
    if (operation === '−' && b > a) [a, b] = [b, a]
    return withFixedColumnWidth(columnItem(operation, a, b, operation === '+' ? a + b : a - b, empty), 5)
  }).sort((a,b)=>a.op===b.op?0:a.op==='+'?-1:1)
}
function lengthTable(rng: Rng, count: number): MathItem {
  const n = Math.max(2, Math.min(6, count))
  const band = (120 - 25) / n
  const lengths = shuffle(rng, Array.from({ length: n }, (_, index) => int(rng, Math.round(25 + index * band), Math.max(Math.round(25 + index * band), Math.round(25 + (index + 1) * band) - 1))))
  const units: Array<'cm' | 'mm'> = Array.from({ length: n }, () => (rng() < 0.5 ? 'cm' : 'mm'))
  if (!units.includes('cm')) units[0] = 'cm'
  if (!units.includes('mm')) units[n - 1] = 'mm'
  const mixed = shuffle(rng, units)
  const palette = shuffle(rng, [0, 1, 2, 3])
  return { layout: 'segment-measure', cscTask: { kind: 'length-table', colors: Array.from({ length: n }, (_, index) => palette[index % palette.length]!) }, segments: lengths.map((mm, index) => ({ mm, unit: mixed[index]!, display: String(mixed[index] === 'cm' ? mm / 10 : mm).replace('.', ','), slope: (rng() < 0.5 ? -1 : 1) * (5 + int(rng, 0, 20)) / 100 })), answer: `${String.fromCharCode(65 + lengths.indexOf(Math.max(...lengths)))} ; ${String.fromCharCode(65 + lengths.indexOf(Math.min(...lengths)))}` }
}
function coordinates(rng: Rng, place: boolean, count: number): MathItem[] {
  const config: PageConfig = { domain: 'géométrie', topic: 'reperage', exerciseType: place ? 'reperage-placer' : 'reperage-lire', difficulty: 'facile', count: Math.max(1, Math.min(15, count)), columns: 1, coordCols: 8, coordRows: 8, coordCellMm: 8 }
  const items=tryGenerateReperage(config,rng)?.items??[]
  const xDirection=rng()<.5?'left-to-right':'right-to-left',yDirection=rng()<.5?'bottom-to-top':'top-to-bottom'
  return items.map((item) => ({ ...item, cscTask: { kind: 'coordinates-left', xDirection, yDirection } }))
}

export const CSC_CONNECT_COLORS = [
  { name: 'rouge', ink: '#c02030' },
  { name: 'bleu', ink: '#174eae' },
  { name: 'vert', ink: '#23723b' },
  { name: 'orange', ink: '#c05612' },
  { name: 'violet', ink: '#6d28d9' },
] as const

export function cscConnectFrame(pairs: number): { width: number; height: number } {
  const n = Math.max(1, Math.min(5, pairs))
  return { width: 160, height: n <= 2 ? 80 : 48 + n * 22 }
}

export function cscConnectAnswer(pairs: number): string {
  return Array.from({ length: pairs }, (_, index) => {
    const from = String.fromCharCode(65 + index * 2)
    const to = String.fromCharCode(66 + index * 2)
    return `${from} à ${to} en ${CSC_CONNECT_COLORS[index]!.name}`
  }).join(' ; ')
}

function connectingPoints(rng: Rng, pairs: number): MathItem {
  const n = Math.max(1, Math.min(5, pairs))
  const frame = cscConnectFrame(n)
  const minDist = n >= 5 ? 12 : 16
  const points: { label: string; x: number; y: number }[] = []
  for (let index = 0; index < n * 2; index++) {
    let x = 8, y = 8, guard = 0
    do {
      x = int(rng, 8, frame.width - 12)
      y = int(rng, 8, frame.height - 12)
      guard += 1
    } while (guard < 80 && points.some((point) => Math.hypot(point.x - x, point.y - y) < minDist))
    points.push({ label: '', x, y })
  }
  const labeled = shuffle(rng, points).map((point, index) => ({ ...point, label: String.fromCharCode(65 + index) }))
  return { layout: 'csc-task', answer: cscConnectAnswer(n), cscTask: { kind: 'connect-points', points: labeled, frame } }
}

function countIconSplit(rng: Rng, total: number): { targetCount: number; distractorACount: number; distractorBCount: number; exact: true } {
  const sum = Math.max(12, Math.min(80, Math.round(total)))
  const targetCount = Math.max(4, Math.min(sum - 8, Math.round(sum * (0.34 + rng() * 0.12))))
  const rest = sum - targetCount
  const distractorACount = Math.max(4, Math.min(rest - 4, Math.round(rest * (0.4 + rng() * 0.2))))
  return { targetCount, distractorACount, distractorBCount: rest - distractorACount, exact: true }
}

export function tryGenerateTcmCscItems(typeId: string, count: number, rng: Rng, seed = 0, logiqueIds?: string[], countShapeScale?: 1 | 2 | 3, countIconTotal?: number): MathItem[] | null {
  if (!typeId.startsWith('tcm-csc-ex')) return null
  const n = Math.max(1, Math.min(100, count)), exercise = Number(typeId.slice(-2))
  if (exercise === 1) return uniqueNumbers(rng, n, 1, 100).map(audioNumber)
  if (exercise === 2) return calculations(rng, n)
  if (exercise === 3) return [numberGrid(rng, n)]
  if (exercise === 4 || exercise === 5) return sequences(rng, n, exercise === 4)
  if (exercise === 6 || exercise === 25) return order(rng, n, cscOrderAscending(typeId, seed))
  if (exercise === 7) return comparisons(rng, n, false).map((item) => ({ ...item, cscTask: { kind: 'compare-line' as const } }))
  if (exercise === 8) return Array.from({length:n},(_,i)=>({ ...numberDecomposition(i%4<2?int(rng,11,99):int(rng,101,999)), cscTask: { kind: 'place-plain' as const } }))
  if (exercise === 9) return signNames(rng, n)
  if (exercise === 10 || exercise === 11) return columnOperations(rng, n, exercise === 11)
  if (exercise === 12 || exercise === 13) return [{ layout: 'symmetry-grid', symmetryFigure: pickSymmetryTemplate(rng), cscTask: { kind: 'copy', scale: exercise === 13 ? 2 : 1 }, answer: 'Figure reproduite dans le même sens.' }]
  if (exercise === 14) return [lengthTable(rng, n)]
  if (exercise === 15) return [connectingPoints(rng, n)]
  if (exercise === 16) {
    const random = tryGenerateLogiqueBlock({ domain: 'logique', topic: 'logique', exerciseType: 'logique-suite-graphique', difficulty: 'moyen', count: Math.min(2, n), columns: 1 }, seed)?.items ?? []
    if (!logiqueIds?.some(Boolean)) return random
    return Array.from({ length: Math.min(2, n) }, (_, index) => logiqueIds[index] ? logiqueItemById('logique-suite-graphique', logiqueIds[index], rng) : random[index]).filter((item): item is MathItem => Boolean(item))
  }
  if (exercise === 17) {
    const classic = CSC_FIGURES.filter((entry) => ['square', 'rectangle', 'circle', 'triangle'].includes(entry.value))
    const pool = n <= classic.length ? classic : CSC_FIGURES
    const figures = shuffle(rng, [...pool]).slice(0, Math.max(1, Math.min(pool.length, n)))
    return [{ layout: 'csc-task', cscTask: { kind: 'shape-names', figures: figures.map((entry) => entry.value) }, answer: figures.map((entry) => entry.label).join(' ; ') }]
  }
  if (exercise === 18) {
    const split = countIconTotal ? countIconSplit(rng, countIconTotal) : undefined
    return [{ ...buildCountIconsItem(rng, split), cscTask: { kind: 'large-count', scale: countShapeScale ?? 2 } }]
  }
  if (exercise === 19 || exercise === 20) return coordinates(rng, exercise === 20, n)
  if (exercise >= 22 && exercise <= 24) return Array.from({ length: n }, () => {
    const p = rollCscProblem(CSC_DEFAULT_PROBLEMS[exercise - 22]!, rng)
    return { layout: 'algebra', prompt: p.statement, answer: p.answer, cscTask: { kind: 'problem', templateId: p.templateId, a: p.a, b: p.b } }
  })
  return []
}

/** Same generator for an explicit re-roll in the free editor. */
export function generateCscExercise(typeId: string, count: number, seed: number, logiqueIds?: string[], countShapeScale?: 1 | 2 | 3, countIconTotal?: number) { return tryGenerateTcmCscItems(typeId, count, createRng(seed), seed, logiqueIds, countShapeScale, countIconTotal) ?? [] }

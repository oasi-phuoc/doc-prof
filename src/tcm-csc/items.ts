import { createRng, int, shuffle, type Rng } from '@/math/rng'
import type { Figure, MathItem, PageConfig } from '@/math/types'
import { columnItem, withFixedColumnWidth } from '@/tpm/items'
import { numberAudioParts, SILENCE_6S_AUDIO } from '@/tcm-cfr/audio-nombres'
import { pickSymmetryTemplate } from '@/tcm-cfr/symetrie'
import { buildCountIconsItem } from '@/math/count-icons'
import { tryGenerateReperage } from '@/math/coord-reperage'
import { tryGenerateLogiqueBlock } from '@/logique/generate'
import { CSC_DEFAULT_PROBLEMS, rollCscProblem } from './problems'

export const CSC_FIGURES: readonly { value: Figure; label: string }[] = [
  { value: 'square', label: 'carré' }, { value: 'rectangle', label: 'rectangle' },
  { value: 'triangle', label: 'triangle' }, { value: 'circle', label: 'cercle' },
  { value: 'rhombus', label: 'losange' }, { value: 'parallelogram', label: 'parallélogramme' },
  { value: 'trapezoid', label: 'trapèze' }, { value: 'pentagon', label: 'pentagone' },
  { value: 'oval', label: 'ovale' },
]
export const CSC_PLUS_AUDIO = '/lib/audio/nombre/plus.mp3'
export const CSC_MINUS_AUDIO = '/lib/audio/nombre/moins.mp3'
export const cscNumberParts = (value: number) => value === 0 ? ['/lib/audio/vocabulaire/objets/zéro.mp3'] : numberAudioParts(value)
export const cscCalculationParts = (a: number, b: number, operation: '+' | '−') => [...numberAudioParts(a), operation === '+' ? CSC_PLUS_AUDIO : CSC_MINUS_AUDIO, ...numberAudioParts(b)]
const uniqueNumbers = (rng: Rng, count: number, min: number, max: number) => shuffle(rng, Array.from({ length: max - min + 1 }, (_, i) => i + min)).slice(0, count)

function audioNumber(value: number): MathItem {
  const parts = numberAudioParts(value)
  return { layout: 'audio-dictation', answer: String(value), audioSrc: parts[0], audioParts: parts }
}
function calculations(rng: Rng, count: number): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const operation = i % 2 ? '−' : '+', a = int(rng, 10, 90), b = int(rng, 1, operation === '+' ? 100 - a : a - 1)
    const parts = cscCalculationParts(a, b, operation)
    return { layout: 'audio-dictation', answer: String(operation === '+' ? a + b : a - b), audioSrc: parts[0], audioParts: parts, cscTask: { kind: 'calculation-audio', a, b, operation } }
  })
}
function numberGrid(rng: Rng): MathItem {
  const numbers = uniqueNumbers(rng, 30, 0, 100), heard = shuffle(rng, numbers.filter((n) => n > 0)).slice(0, 5)
  const parts = heard.flatMap((n, i) => [...(i ? [SILENCE_6S_AUDIO] : []), ...numberAudioParts(n)])
  return { layout: 'csc-task', answer: heard.join(' ; '), audioParts: parts, cscTask: { kind: 'number-grid', numbers, heard } }
}
function sequences(rng: Rng, count: number, help: boolean): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const step = int(rng, 2, 10) * (i % 2 ? -1 : 1), start = step < 0 ? int(rng, -4 * step, 100) : int(rng, 0, 100 - 4 * step)
    const sequence = Array.from({ length: 5 }, (_, j) => String(start + j * step)), blankIndexes = i % 2 ? [1, 3] : [3, 4]
    return { layout: 'sequence', prompt: help ? `Aide : ${step > 0 ? '+' : '−'}${Math.abs(step)}` : undefined, sequence, blankIndexes, answer: blankIndexes.map((j) => sequence[j]).join(' ; ') }
  })
}
function order(rng: Rng, count: number): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const numbers = uniqueNumbers(rng, 7, 0, 100), ascending = i % 2 === 0, ordered = [...numbers].sort((a, b) => ascending ? a - b : b - a)
    return { layout: 'order', sequence: numbers.map(String), placeParts: ordered.map(String), orderBoxed: true, orderCompact: true, orderOp: ascending ? '<' : '>', prompt: ascending ? 'Du plus petit au plus grand :' : 'Du plus grand au plus petit :', answer: ordered.join(ascending ? ' < ' : ' > ') }
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
function operators(rng: Rng, count: number): MathItem[] {
  return shuffle(rng, Array.from({ length: count }, (_, i) => {
    const operation = i % 3 === 1 || i % 3 === 2 && i % 2 ? '−' : '+', a = int(rng, 10, 90), b = int(rng, 1, operation === '+' ? 100 - a : a - 1)
    const blank = i % 3 === 2 ? 'equals' : 'operator'
    return { layout: 'csc-task', answer: blank === 'equals' ? '=' : operation, cscTask: { kind: 'operator', a, b, operation, blank } } as MathItem
  }))
}
function columnOperations(rng: Rng, count: number, empty: boolean): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / 2), digits = empty ? row === 0 ? 2 : 3 : row === 3 ? 3 : 2
    const lo = digits === 3 ? 100 : 10, hi = digits === 3 ? 999 : 99, small = !empty && row === 0
    const operation = i % 2 ? '−' : '+'
    let a = int(rng, lo, operation === '+' ? hi - (small ? 1 : lo) : hi)
    let b = int(rng, small ? 1 : lo, small ? 9 : operation === '+' ? hi - a : a)
    if (operation === '−' && b > a) [a, b] = [b, a]
    return withFixedColumnWidth(columnItem(operation, a, b, operation === '+' ? a + b : a - b, empty), 3)
  })
}
function lengthTable(rng: Rng): MathItem {
  const lengths = shuffle(rng, [int(rng, 25, 40), int(rng, 50, 75), int(rng, 90, 120)])
  return { layout: 'segment-measure', cscTask: { kind: 'length-table' }, segments: lengths.map((mm) => ({ mm, unit: 'cm', display: String(mm / 10).replace('.', ',') })), answer: `${String.fromCharCode(65 + lengths.indexOf(Math.max(...lengths)))} ; ${String.fromCharCode(65 + lengths.indexOf(Math.min(...lengths)))}` }
}
function coordinates(rng: Rng, place: boolean): MathItem[] {
  const config: PageConfig = { domain: 'géométrie', topic: 'reperage', exerciseType: place ? 'reperage-placer' : 'reperage-lire', difficulty: 'facile', count: 6, columns: 1, coordCols: 8, coordRows: 8, coordCellMm: 8 }
  return (tryGenerateReperage(config, rng)?.items ?? []).map((item) => ({ ...item, cscTask: { kind: 'coordinates-left' } }))
}

export function tryGenerateTcmCscItems(typeId: string, count: number, rng: Rng, seed = 0): MathItem[] | null {
  if (!typeId.startsWith('tcm-csc-ex')) return null
  const n = Math.max(1, Math.min(100, count)), exercise = Number(typeId.slice(-2))
  if (exercise === 1) return uniqueNumbers(rng, n, 1, 100).map(audioNumber)
  if (exercise === 2) return calculations(rng, n)
  if (exercise === 3) return [numberGrid(rng)]
  if (exercise === 4 || exercise === 5) return sequences(rng, n, exercise === 4)
  if (exercise === 6) return order(rng, n)
  if (exercise === 7 || exercise === 8) return comparisons(rng, n, exercise === 8)
  if (exercise === 9) return operators(rng, n)
  if (exercise === 10 || exercise === 11) return columnOperations(rng, n, exercise === 11)
  if (exercise === 12 || exercise === 13) return [{ layout: 'symmetry-grid', symmetryFigure: pickSymmetryTemplate(rng), cscTask: { kind: 'copy', scale: exercise === 13 ? 2 : 1 }, answer: 'Figure reproduite dans le même sens.' }]
  if (exercise === 14) return [lengthTable(rng)]
  if (exercise === 15) return [{ layout: 'csc-task', answer: 'AB en rouge ; CD en bleu.', cscTask: { kind: 'connect-points', points: ['A', 'B', 'C', 'D'].map((label, i) => ({ label, x: i % 2 ? int(rng, 95, 140) : int(rng, 15, 50), y: i < 2 ? int(rng, 12, 27) : int(rng, 45, 65) })) } }]
  if (exercise === 16) return tryGenerateLogiqueBlock({ domain: 'logique', topic: 'logique', exerciseType: 'logique-suite-graphique', difficulty: 'moyen', count: Math.min(2, n), columns: 1 }, seed)?.items ?? []
  if (exercise === 17) return Array.from({ length: n }, () => {
    const figures = shuffle(rng, [...CSC_FIGURES]).slice(0, 4)
    return { layout: 'csc-task', cscTask: { kind: 'shape-names', figures: figures.map((entry) => entry.value) }, answer: figures.map((entry) => entry.label).join(' ; ') }
  })
  if (exercise === 18) return [{ ...buildCountIconsItem(rng), cscTask: { kind: 'large-count' } }]
  if (exercise === 19 || exercise === 20) return coordinates(rng, exercise === 20)
  if (exercise >= 22 && exercise <= 24) return Array.from({ length: n }, () => {
    const p = rollCscProblem(CSC_DEFAULT_PROBLEMS[exercise - 22]!, rng)
    return { layout: 'algebra', prompt: p.statement, answer: p.answer, cscTask: { kind: 'problem', templateId: p.templateId, a: p.a, b: p.b } }
  })
  return []
}

/** Same generator for an explicit re-roll in the free editor. */
export function generateCscExercise(typeId: string, count: number, seed: number) { return tryGenerateTcmCscItems(typeId, count, createRng(seed), seed) ?? [] }

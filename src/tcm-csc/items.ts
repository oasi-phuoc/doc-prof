import { createRng, int, shuffle, type Rng } from '@/math/rng'
import type { Figure, MathItem, PageConfig } from '@/math/types'
import { columnItem, withFixedColumnWidth } from '@/tpm/items'
import { numberAudioParts, SILENCE_6S_AUDIO } from '@/tcm-cfr/audio-nombres'
import { pickSymmetryTemplate } from '@/tcm-cfr/symetrie'
import { buildCountIconsItem } from '@/math/count-icons'
import { tryGenerateReperage } from '@/math/coord-reperage'
import { tryGenerateLogiqueBlock } from '@/logique/generate'
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
function calculations(rng: Rng, count: number): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const operation = i % 2 ? '−' : '+', a = int(rng, 10, 90), b = int(rng, 1, operation === '+' ? 100 - a : a - 1)
    const parts = cscCalculationParts(a, b, operation)
    return { layout: 'audio-dictation', answer: String(operation === '+' ? a + b : a - b), audioSrc: parts[0], audioParts: parts, cscTask: { kind: 'calculation-audio', a, b, operation } }
  })
}
function numberGrid(rng: Rng): MathItem {
  const numbers = uniqueNumbers(rng, 36, 0, 100), heard = shuffle(rng, numbers.filter((n) => n > 0)).slice(0, 5)
  const parts = heard.flatMap((n, i) => [...(i ? [SILENCE_6S_AUDIO] : []), ...numberAudioParts(n)])
  return { layout: 'csc-task', answer: heard.join(' ; '), audioParts: parts, cscTask: { kind: 'number-grid', numbers, heard } }
}
function sequences(rng: Rng, count: number, help: boolean): MathItem[] {
  return Array.from({ length: count }, (_, i) => {
    const step = int(rng, 2, 10) * (i % 2 ? -1 : 1), start = step < 0 ? int(rng, -4 * step, 100) : int(rng, 0, 100 - 4 * step)
    const sequence = Array.from({ length: 5 }, (_, j) => String(start + j * step)), blankIndexes = i % 2 ? [1, 3] : [3, 4]
    return { layout: 'sequence', prompt: help ? `${step > 0 ? '+' : '−'}${Math.abs(step)}` : undefined, ...(help ? { cscTask: { kind: 'sequence-hint' as const, step } } : {}), sequence, blankIndexes, answer: blankIndexes.map((j) => sequence[j]).join(' ; ') }
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
function lengthTable(rng: Rng): MathItem {
  const lengths = shuffle(rng, [int(rng, 25, 40), int(rng, 50, 75), int(rng, 90, 120)])
  const units=shuffle(rng,['cm','mm',rng()<.5?'cm':'mm'] as const)
  return { layout: 'segment-measure', cscTask: { kind: 'length-table', colors: shuffle(rng,[0,1,2,3]).slice(0,3) }, segments: lengths.map((mm,index) => ({ mm, unit: units[index]!, display: String(units[index]==='cm'?mm/10:mm).replace('.', ',') })), answer: `${String.fromCharCode(65 + lengths.indexOf(Math.max(...lengths)))} ; ${String.fromCharCode(65 + lengths.indexOf(Math.min(...lengths)))}` }
}
function coordinates(rng: Rng, place: boolean): MathItem[] {
  const config: PageConfig = { domain: 'géométrie', topic: 'reperage', exerciseType: place ? 'reperage-placer' : 'reperage-lire', difficulty: 'facile', count: 6, columns: 1, coordCols: 8, coordRows: 8, coordCellMm: 8 }
  const items=tryGenerateReperage(config,rng)?.items??[]
  const xDirection=rng()<.5?'left-to-right':'right-to-left',yDirection=rng()<.5?'bottom-to-top':'top-to-bottom'
  return items.map((item) => ({ ...item, cscTask: { kind: 'coordinates-left', xDirection, yDirection } }))
}

function connectingPoints(rng: Rng): MathItem {
  const points: {label:string;x:number;y:number}[] = []
  for (const label of ['A','B','C','D']) {
    let x: number, y: number
    do { x = int(rng,8,148); y = int(rng,8,72) } while (points.some(p => Math.hypot(p.x-x,p.y-y) < 16))
    points.push({label,x,y})
  }
  const labeled = shuffle(rng,points).map((point,index)=>({...point,label:'ABCD'[index]!}))
  return {layout:'csc-task',answer:'AB en rouge ; CD en bleu.',cscTask:{kind:'connect-points',points:labeled}}
}

export function tryGenerateTcmCscItems(typeId: string, count: number, rng: Rng, seed = 0): MathItem[] | null {
  if (!typeId.startsWith('tcm-csc-ex')) return null
  const n = Math.max(1, Math.min(100, count)), exercise = Number(typeId.slice(-2))
  if (exercise === 1) return uniqueNumbers(rng, n, 1, 100).map(audioNumber)
  if (exercise === 2) return calculations(rng, n)
  if (exercise === 3) return [numberGrid(rng)]
  if (exercise === 4 || exercise === 5) return sequences(rng, n, exercise === 4)
  if (exercise === 6) return order(rng, n)
  if (exercise === 7) return comparisons(rng, n, false)
  if (exercise === 8) return Array.from({length:n},(_,i)=>numberDecomposition(i%4<2?int(rng,11,99):int(rng,101,999)))
  if (exercise === 9) return signNames(rng, n)
  if (exercise === 10 || exercise === 11) return columnOperations(rng, n, exercise === 11)
  if (exercise === 12 || exercise === 13) return [{ layout: 'symmetry-grid', symmetryFigure: pickSymmetryTemplate(rng), cscTask: { kind: 'copy', scale: exercise === 13 ? 2 : 1 }, answer: 'Figure reproduite dans le même sens.' }]
  if (exercise === 14) return [lengthTable(rng)]
  if (exercise === 15) return [connectingPoints(rng)]
  if (exercise === 16) return tryGenerateLogiqueBlock({ domain: 'logique', topic: 'logique', exerciseType: 'logique-suite-graphique', difficulty: 'moyen', count: Math.min(2, n), columns: 1 }, seed)?.items ?? []
  if (exercise === 17) return Array.from({ length: n }, () => {
    const figures = shuffle(rng, CSC_FIGURES.filter(entry => ['square','rectangle','circle','triangle'].includes(entry.value)))
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

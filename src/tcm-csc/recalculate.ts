import type { MathItem } from '@/math/types'
import { SILENCE_6S_AUDIO } from '@/tcm-cfr/audio-nombres'
import { cscCalculationParts, cscNumberParts, CSC_FIGURES } from './items'
import { buildCscProblem } from './problems'

const integers = (values: number[], min: number, max: number) => values.every((n) => Number.isInteger(n) && n >= min && n <= max)
export function hasCscFields(item: MathItem, typeId: string): boolean {
  return typeId.startsWith('tcm-csc-') && (!!item.logique || ['calculation-audio', 'number-grid', 'operator', 'copy', 'connect-points', 'shape-names', 'problem'].includes(item.cscTask?.kind ?? '') || ['tcm-csc-ex04', 'tcm-csc-ex05'].includes(typeId))
}
/** Returns null for the standard TPM editors; errors never invent a replacement answer. */
export function recalculateCsc(item: MathItem, typeId: string): MathItem | null {
  if (!typeId.startsWith('tcm-csc-')) return null
  const task = item.cscTask
  try {
    if (['tcm-csc-ex07', 'tcm-csc-ex08'].includes(typeId) && item.layout === 'compare') {
      const a = Number(item.left), b = Number(item.right), max = typeId.endsWith('ex07') ? 100 : 999
      if (!item.left?.trim() || !item.right?.trim() || !integers([a, b], 0, max)) throw new Error(`Choisissez des entiers entre 0 et ${max}, sans décimales.`)
      return { ...item, answer: a === b ? '=' : a < b ? '<' : '>', libreError: undefined }
    }
    if (typeId === 'tcm-csc-ex06' && item.layout === 'order') {
      const values = (item.sequence ?? []).map(Number)
      if (values.length !== 7 || new Set(values).size !== 7 || !integers(values, 0, 100)) throw new Error('Choisissez sept entiers distincts de 0 à 100.')
      const sorted = [...values].sort((a, b) => item.orderOp === '>' ? b - a : a - b)
      return { ...item, placeParts: sorted.map(String), answer: sorted.join(item.orderOp === '>' ? ' > ' : ' < '), libreError: undefined }
    }
    if (task?.kind === 'problem') {
      const p = buildCscProblem(task.templateId, task.a, task.b)
      return { ...item, prompt: p.statement, answer: p.answer, libreError: undefined }
    }
    if (task?.kind === 'calculation-audio' || task?.kind === 'operator') {
      if (!integers([task.a, task.b], task.kind === 'operator' ? 0 : 1, 100) || task.operation === '−' && task.b > task.a || task.operation === '+' && task.a + task.b > 100) throw new Error('Choisissez des entiers dont le résultat reste entre 0 et 100.')
      const result = task.operation === '+' ? task.a + task.b : task.a - task.b
      if (task.kind === 'operator') return { ...item, answer: task.blank === 'equals' ? '=' : task.operation, libreError: undefined }
      const parts = cscCalculationParts(task.a, task.b, task.operation)
      return { ...item, answer: String(result), audioParts: parts, audioSrc: parts[0], libreError: undefined }
    }
    if (task?.kind === 'number-grid') {
      if (task.numbers.length !== 30 || new Set(task.numbers).size !== 30 || !integers(task.numbers, 0, 100)) throw new Error('La grille doit contenir 30 entiers distincts de 0 à 100.')
      if (task.heard.length !== 5 || new Set(task.heard).size !== 5 || !task.heard.every((n) => task.numbers.includes(n))) throw new Error('Choisissez cinq nombres différents présents dans la grille.')
      const parts = task.heard.flatMap((n, i) => [...(i ? [SILENCE_6S_AUDIO] : []), ...cscNumberParts(n)])
      return { ...item, answer: task.heard.join(' ; '), audioParts: parts, audioSrc: undefined, libreError: undefined }
    }
    if (task?.kind === 'shape-names') {
      if (task.figures.length !== 4 || !task.figures.every((figure) => CSC_FIGURES.some((entry) => entry.value === figure))) throw new Error('Choisissez quatre formes de la liste.')
      return { ...item, answer: task.figures.map((figure) => CSC_FIGURES.find((entry) => entry.value === figure)!.label).join(' ; '), libreError: undefined }
    }
    if (task?.kind === 'connect-points') {
      if (task.points.length !== 4 || task.points.some((p, i) => p.label !== 'ABCD'[i] || !integers([p.x], 8, 152) || !integers([p.y], 8, 72)) || new Set(task.points.map((p) => `${p.x}:${p.y}`)).size !== 4) throw new Error('Placez quatre points distincts à l’intérieur du cadre.')
      return { ...item, answer: 'AB en rouge ; CD en bleu.', libreError: undefined }
    }
    if ((typeId.endsWith('ex04') || typeId.endsWith('ex05')) && item.layout === 'sequence') {
      const values = (item.sequence ?? []).map(Number), step = values[1]! - values[0]!
      if (values.length !== 5 || !integers(values, 0, 100) || !step || values.some((n, i) => i > 0 && n - values[i - 1]! !== step)) throw new Error('La suite doit progresser régulièrement et rester entre 0 et 100.')
      return { ...item, prompt: typeId.endsWith('ex04') ? `Aide : ${step > 0 ? '+' : '−'}${Math.abs(step)}` : undefined, answer: (item.blankIndexes ?? []).map((i) => values[i]).join(' ; '), libreError: undefined }
    }
    if (typeId.endsWith('ex14') && item.segments?.length) {
      const lengths = item.segments.map((segment) => segment.mm)
      if (lengths.length !== 3 || new Set(lengths).size !== 3 || !integers(lengths, 10, 160)) throw new Error('Choisissez trois longueurs distinctes entre 10 et 160 mm.')
      return { ...item, cscTask: { kind: 'length-table' }, segments: item.segments.map((segment) => ({ ...segment, display: String(segment.unit === 'cm' ? segment.mm / 10 : segment.mm).replace('.', ',') })), answer: `${String.fromCharCode(65 + lengths.indexOf(Math.max(...lengths)))} ; ${String.fromCharCode(65 + lengths.indexOf(Math.min(...lengths)))}`, libreError: undefined }
    }
    return null
  } catch (error) { return { ...item, libreError: error instanceof Error ? error.message : 'Vérifiez les données de cet exercice.', answer: '' } }
}

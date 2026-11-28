import type { MathItem } from '@/math/types'

export type LogistiqueChoice =
  | { kind: 'multiple'; correct: string[] }
  | { kind: 'true-false'; justification?: string }

export const logistiqueVerdicts = ['Vrai', 'Faux'] as const

export function validLogistiqueChoice(item: MathItem): boolean {
  const choice = item.logistiqueChoice
  const options = item.options
  if (item.layout !== 'select' || item.logistiqueGaps || item.logistiqueTable || item.logistiqueResponseLines ||
      !choice || !Array.isArray(options) || options.length < 2 || options.length > 12 ||
      !options.every((option) => typeof option === 'string')) return false
  if (choice.kind === 'multiple') {
    return Array.isArray(choice.correct) && new Set(choice.correct).size === choice.correct.length &&
      choice.correct.every((answer) => typeof answer === 'string' && Boolean(answer.trim()) && options.includes(answer)) &&
      item.answer === choice.correct.join('\n')
  }
  return choice.kind === 'true-false' && options.length === logistiqueVerdicts.length &&
    logistiqueVerdicts.every((value, index) => options[index] === value) && (item.answer === '' || options.includes(item.answer)) &&
    (choice.justification === undefined || (typeof choice.justification === 'string' && choice.justification.length <= 400))
}

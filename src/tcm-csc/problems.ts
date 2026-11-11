import { int, type Rng } from '@/math/rng'
import { CSC_DEFAULT_PROBLEMS, CSC_PROBLEM_BANK } from './problem-bank'

export { CSC_DEFAULT_PROBLEMS, CSC_PROBLEM_BANK }
export type CscProblem = { templateId: string; a: number; b: number; statement: string; result: number; answer: string }
const singular = (unit: string) => unit === 'vis' ? unit : unit.replace(/s$/, '')
export function buildCscProblem(templateId: string, a: number, b: number): CscProblem {
  const template = CSC_PROBLEM_BANK.find((entry) => entry.id === templateId)
  if (!template) throw new Error('Choisissez un problème de la banque CSC.')
  if (![a, b].every((value) => Number.isInteger(value) && value >= 1 && value <= 999)) throw new Error('Les nombres du problème doivent être des entiers de 1 à 999.')
  if (template.operation === '−' && b > a) throw new Error('La quantité retirée ne peut pas dépasser la quantité de départ.')
  let story = template.story.replaceAll('{a}', String(a)).replaceAll('{b}', String(b))
  if (a === 1 || b === 1) {
    story = story.replace(new RegExp(`\\b1 ${template.unit}\\b`, 'g'), `1 ${singular(template.unit)}`)
    story = story.replaceAll('1 personne arrivent', '1 personne arrive').replaceAll('1 personne descendent', '1 personne descend').replaceAll('1 personne entrent', '1 personne entre')
    story = story.replaceAll('1 élève absents', '1 élève absent')
  }
  const result = template.operation === '+' ? a + b : a - b
  return { templateId, a, b, statement: `${story}\n\n${template.question}`, result, answer: `${result} ${result === 1 ? singular(template.unit) : template.unit}` }
}
export function rollCscProblem(templateId: string, rng: Rng): CscProblem {
  const template = CSC_PROBLEM_BANK.find((entry) => entry.id === templateId)
  if (!template) throw new Error('Choisissez un problème de la banque CSC.')
  const a = int(rng, 20, 90), b = int(rng, 2, template.operation === '+' ? 100 - a : a - 1)
  return buildCscProblem(templateId, a, b)
}

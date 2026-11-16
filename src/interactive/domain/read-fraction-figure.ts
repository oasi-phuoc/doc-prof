import type { MathItem } from '@/math/types'
import { validFractionFigure, type FractionFigure } from './fraction-figure'
import { exactExpression, compareExact } from './exact-math'
import { fractionChoices } from './fractions'
import type { Choice } from './types'

type Reading = { figure: FractionFigure; choices: Choice[]; correctId: string; model: string } | { reason: string }
const types = new Set(['tpm-frac-read', 'tcm-cfr-ex13'])

export function readFractionFigure(item: MathItem, exerciseType: string, seed: number): Reading | undefined {
  if (!types.has(exerciseType) || item.layout !== 'fraction-shape') return undefined
  const fail = (reason: string): Reading => ({ reason: `Fraction illustrée : ${reason}` })
  const source = item.fracShape
  if (!source || source.mode !== 'read' || source.copies !== 1 || source.multi !== false ||
    !Number.isInteger(source.d) || source.d < 1 || source.d > 20 || !Number.isInteger(source.n) || source.n < 0 || source.n > source.d) return fail('une seule figure partagée en parts égales est nécessaire.')
  const figure = { kind: source.kind, colored: Array.from({ length: source.d }, (_, index) => index < source.n) }
  if (!validFractionFigure(figure)) return fail('ce découpage de la figure n’est pas pris en charge.')
  if (typeof item.answer !== 'string' || !/^\d{1,2}\s*\/\s*\d{1,2}$/.test(item.answer.trim())) return fail('la fraction du corrigé est absente ou invalide.')
  const value = exactExpression(`${source.n}/${source.d}`)!, answer = exactExpression(item.answer)
  if (!answer || compareExact(value, answer) !== '=') return fail('la partie coloriée et le corrigé ne correspondent plus.')
  const model = item.answer.trim()
  return { figure, model, ...fractionChoices(value, model, seed, false, [], true) }
}

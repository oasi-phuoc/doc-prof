import type { MathItem } from '@/math/types'
import { exactDecimal, exactExpression, formatDecimal, scaledDecimal, type Decimal, type Rational } from './exact-math'

type Atom = Decimal | 'blank'
type Verified = { prompt: string; model: string; value: Decimal; correctText: string; signed: boolean } | { reason: string }
const operator = (text: string) => text.replace('-', '−').replace(/[*·]/, '×').replace('/', '÷')
const same = (left: Decimal, right: Decimal) => scaledDecimal(left, Math.max(left.precision, right.precision)) === scaledDecimal(right, Math.max(left.precision, right.precision))
const display = (number: Decimal) => number.units < 0n ? `(${formatDecimal(number.units, number.precision)})` : formatDecimal(number.units, number.precision)

function schoolNumber(text: string): Decimal | null {
  if (typeof text !== 'string' || text.length > 82) return null
  text = text.trim()
  if (text.startsWith('(') && text.endsWith(')')) text = text.slice(1, -1).trim()
  return exactDecimal(text)
}

function finiteDecimal(value: Rational): Decimal | null {
  for (let precision = 0; precision <= 6; precision++) {
    const units = value.numerator * 10n ** BigInt(precision)
    if (units % value.denominator === 0n) return exactDecimal(formatDecimal(units / value.denominator, precision))
  }
  return null
}

/** A single binary equation, with optional parentheses around signed constants.
 * No general expression substitution: each operand and the blank are verified. */
function readEquation(prompt: string): { operands: Atom[]; op: string; emptyResult: boolean } | null {
  if (prompt.length > 512) return null
  let rest = prompt.trim()
  const atom = (): Atom | null => {
    rest = rest.trimStart()
    if (rest.startsWith('□')) { rest = rest.slice(1); return 'blank' }
    if (rest.startsWith('(')) {
      const close = rest.indexOf(')')
      if (close < 0) return null
      const value = schoolNumber(rest.slice(0, close + 1))
      rest = rest.slice(close + 1)
      return value
    }
    const text = /^[+−-]?(?:\d{1,3}(?:['’\u0020\u00a0\u202f]\d{3})+|\d+)(?:[.,]\d{1,6})?/.exec(rest)?.[0]
    if (!text) return null
    rest = rest.slice(text.length)
    return schoolNumber(text)
  }
  const left = atom()
  rest = rest.trimStart()
  const op = rest[0]
  if (!left || !op || !'+−-×*·÷/'.includes(op)) return null
  rest = rest.slice(1)
  const right = atom()
  rest = rest.trimStart()
  if (!right || !rest.startsWith('=')) return null
  rest = rest.slice(1).trim()
  const emptyResult = !rest
  const result = emptyResult ? 'blank' : atom()
  return result && !rest.trim() ? { operands: [left, right, result], op: operator(op), emptyResult } : null
}

/** Complements the unchanged legacy integer-result adapter with exact written
 * calculations, one missing operand, finite division and signed decimals. */
export function verifiedWrittenArithmetic(item: MathItem): Verified | undefined {
  if (!['inline', 'column'].includes(item.layout) || item.a === undefined || item.b === undefined || !item.op || !['+', '−', '×', '÷'].includes(item.op)) return undefined
  if (item.blankOperands) return { reason: 'Ce calcul masque plusieurs opérandes : une activité spécifique est nécessaire.' }
  const missing = item.missing ?? 'result'
  if (!['a', 'b', 'result'].includes(missing) || item.layout === 'column' && missing !== 'result') return { reason: 'La position du nombre à compléter ne permet pas une question à réponse unique.' }
  if (![item.a, item.b].every((n) => Number.isFinite(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER)) return { reason: 'Les opérandes du calcul dépassent la précision prise en charge.' }
  const a = exactDecimal(String(item.a)), b = exactDecimal(String(item.b))
  if (!a || !b) return { reason: 'Les opérandes doivent être des nombres entiers ou des décimaux de six chiffres au maximum.' }
  if (item.op === '÷' && b.units === 0n) return { reason: 'Une division par zéro ne peut pas devenir une question de jeu.' }
  if (item.op === '×' && (missing === 'a' && b.units === 0n || missing === 'b' && a.units === 0n) || item.op === '÷' && missing === 'b' && a.units === 0n) return { reason: 'Ce calcul à trou possède plusieurs réponses possibles : aucune correction automatique n’est proposée.' }
  const exact = exactExpression(`${item.a} ${item.op} ${item.b}`)
  const result = exact && finiteDecimal(exact)
  if (!result) return { reason: 'Le résultat exact n’est pas un décimal fini de six chiffres au maximum. Les quotients arrondis et les restes demandent une autre activité.' }
  if (item.result !== undefined) {
    const shown = schoolNumber(String(item.result))
    if (!shown || !same(shown, result)) return { reason: 'Le résultat affiché et les opérandes ne correspondent plus. Validez la fiche avant de jouer.' }
  }
  const target = missing === 'a' ? a : missing === 'b' ? b : result
  const answer = schoolNumber(item.answer)
  if (!answer || !same(answer, target)) return { reason: 'Le calcul et son corrigé ne correspondent plus. Validez les modifications dans la fiche.' }
  const position = missing === 'a' ? 0 : missing === 'b' ? 1 : 2
  const expected: Atom[] = [a, b, result].map((value, index) => index === position ? 'blank' : value)
  const generated = `${position === 0 ? '□' : display(a)} ${item.op} ${position === 1 ? '□' : display(b)} = ${position === 2 ? '□' : display(result)}`
  let prompt = generated
  if (item.prompt?.trim()) {
    const equation = readEquation(item.prompt)
    if (!equation || equation.op !== item.op || equation.operands.some((value, index) => {
      const wanted = expected[index]!
      return value === 'blank' || wanted === 'blank' ? value !== wanted : !same(value, wanted)
    })) return { reason: 'L’énoncé, la case manquante et les données du calcul ne correspondent plus. Validez la fiche avant de jouer.' }
    prompt = item.prompt.trim() + (equation.emptyResult ? ' □' : '')
  } else if (missing !== 'result' && item.result === undefined) return { reason: 'Le résultat donné doit être visible dans la fiche pour compléter un opérande.' }
  const precision = Math.max(target.precision, answer.precision)
  return { prompt, model: `${display(a)} ${item.op} ${display(b)} = ${display(result)}`, value: { units: scaledDecimal(target, precision), precision }, correctText: item.answer.trim(), signed: a.units < 0n || b.units < 0n || !!item.labels?.includes('relatif') }
}

import type { MathItem } from '@/math/types'
import type { Choice, NumberSequence } from './types'
import { compareExact, exactDecimal, exactExpression, scaledDecimal, formatDecimal } from './exact-math'
import { decimalChoices } from './decimal-choices'

type Adaptation = { part: number; prompt: string; choices: Choice[]; correctId: string; model: string; numberSequence?: NumberSequence; compatibility: 'auto' | 'assisted' }
type Result = { items: Adaptation[]; issues: string[] }
const reject = (message: string): Result => ({ items: [], issues: [message] })

/** Verify the worksheet itself before creating any answer or masking its blanks. */
export function adaptNumeracy(item: MathItem, seedFor: (part: number) => number): Result | undefined {
  if (item.layout === 'place-value') {
    const number = exactDecimal(item.prompt ?? '')
    if (!number || number.precision !== 0 || number.units < 10n || number.units > 9999n) return reject('La décomposition doit porter sur un entier de deux à quatre chiffres.')
    const digits = number.units.toString(), labels = ['milliers','centaines','dizaines','unités'].slice(4-digits.length)
    const values = [...digits].map((digit,index)=>BigInt(digit)*10n**BigInt(digits.length-1-index))
    const answers = item.answer.split(' + ')
    if (!Array.isArray(item.placeParts) || item.placeParts.length !== values.length || !Array.isArray(item.labels) ||
      JSON.stringify(item.labels) !== JSON.stringify(labels) || answers.length !== values.length || values.some((value,index)=>{
        const part=exactDecimal(item.placeParts![index]!),answer=exactDecimal(answers[index]!)
        return !part || part.precision !== 0 || part.units !== value || !answer || answer.precision !== 0 || answer.units !== value
      })) return reject('Le nombre, les positions et les termes de la décomposition ne correspondent plus. Validez la fiche avant de jouer.')
    const show = (value:bigint)=>formatDecimal(value,0)
    return {items:values.map((value,part)=>({part,prompt:`Décompose ${show(number.units)} : quelle valeur pour les ${labels[part]} ?`,...decimalChoices(value,0,10n**BigInt(values.length-1-part),show(value),seedFor(part)),model:`${labels[part]} : ${show(value)}. ${show(number.units)} = ${values.map(show).join(' + ')}`,compatibility:'assisted'})),issues:[]}
  }
  if (item.layout === 'compare') {
    const left = exactExpression(item.left ?? ''), right = exactExpression(item.right ?? '')
    if (!left || !right) return reject('Comparaison non vérifiable : utilisez des nombres, fractions ou calculs simples sans parenthèses.')
    const correct = compareExact(left, right)
    if (item.answer !== correct) return reject('La comparaison et le corrigé de la fiche ne correspondent plus. Validez les modifications dans la fiche.')
    const choices = ['<', '=', '>'].map((text, index) => ({ id: `compare${index}`, text }))
    return { items: [{ part: 0, prompt: `Compare : ${item.left} □ ${item.right}`, choices, correctId: choices.find((choice) => choice.text === correct)!.id, model: `${item.left} ${correct} ${item.right}`, compatibility: 'auto' }], issues: [] }
  }
  if (item.layout !== 'sequence') return undefined
  const terms = item.sequence
  if (!Array.isArray(terms) || terms.length < 3 || terms.length > 12 || terms.some((term) => typeof term !== 'string')) return reject('Suite numérique absente ou trop longue pour cette activité.')
  const indexes = item.blankIndexes ?? []
  if (!Array.isArray(indexes) || new Set(indexes).size !== indexes.length || indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= terms.length)) return reject('Les positions des cases manquantes ne sont pas valides.')
  const blanks = [...new Set([...indexes, ...terms.flatMap((term, index) => term === '□' ? [index] : [])])].sort((a, b) => a - b)
  if (!blanks.length || blanks.length > 6 || terms.length - blanks.length < 2) return reject('La suite doit montrer au moins deux nombres et contenir de une à six cases manquantes.')
  const answers = item.answer.split(' ; ')
  if (answers.length !== blanks.length || answers.some((answer) => !exactDecimal(answer))) return reject('Le corrigé doit donner une valeur numérique pour chaque case manquante, dans l’ordre de la fiche.')
  const reconstructed = [...terms]
  for (const [index, position] of blanks.entries()) {
    if (terms[position] !== '□') {
      const term = exactDecimal(terms[position]!), answer = exactDecimal(answers[index]!)
      if (!term || !answer || scaledDecimal(term, Math.max(term.precision, answer.precision)) !== scaledDecimal(answer, Math.max(term.precision, answer.precision))) return reject('Une case de la suite et son corrigé ne correspondent plus.')
    }
    reconstructed[position] = answers[index]!
  }
  const parsed = reconstructed.map(exactDecimal)
  if (parsed.some((value) => !value)) return reject('Cette suite ne contient pas uniquement des entiers ou décimaux vérifiables.')
  const decimals = parsed.filter((value) => value !== null), precision = Math.max(...decimals.map((value) => value.precision))
  const values = decimals.map((value) => scaledDecimal(value, precision)), step = values[1]! - values[0]!
  if (values.some((value, index) => index > 0 && value - values[index - 1]! !== step)) return reject('Cette suite n’a pas un pas constant : elle demande une autre activité ou une vérification enseignante.')
  if (item.prompt?.trim()) {
    const hint = /^Aide\s*:\s*(.+)$/.exec(item.prompt.trim())?.[1] ?? (item.cscTask?.kind === 'sequence-hint' ? item.prompt.trim() : undefined), delta = hint ? exactDecimal(hint) : null
    if (!delta || scaledDecimal(delta, Math.max(delta.precision, precision)) !== step * 10n ** BigInt(Math.max(delta.precision, precision) - precision)) return reject('L’aide de la suite ne correspond pas à son pas. Validez la fiche avant de jouer.')
  }
  const masked = terms.map((term, index) => blanks.includes(index) ? null : term)
  return { items: blanks.map((position, index) => ({ part: position, prompt: `Quel nombre manque à la position ${position + 1} ?`, ...decimalChoices(values[position]!, precision, step, answers[index]!, seedFor(position)), model: `Position ${position + 1} : ${answers[index]}.`, compatibility: 'assisted', numberSequence: { terms: [...masked], target: position, ...(item.prompt?.trim() ? { hint: item.prompt.trim() } : {}) } })), issues: [] }
}

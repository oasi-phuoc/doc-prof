import type { MathItem } from '@/math/types'
import { createRng, shuffle } from '@/math/rng'
import { compareExact, type Rational } from './exact-math'
import type { Choice } from './types'

const TYPES = new Set(['fractions-identifier', 'fractions-equivalentes', 'fractions-simplifier', 'fractions-add', 'fractions-mul', 'fractions-div'])
type Fraction = Rational & { rawNumerator: bigint; rawDenominator: bigint }
type Verified = { prompt: string; model: string; value: Rational; correctText: string; integer: boolean; distractors: Rational[] } | { reason: string }

function reduced(numerator: bigint, denominator = 1n): Rational | null {
  if (!denominator) return null
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator }
  let a = numerator < 0n ? -numerator : numerator, b = denominator
  while (b) [a, b] = [b, a % b]
  return { numerator: numerator / a, denominator: denominator / a }
}

/** Only bounded school fractions and integers; no expression evaluation. */
function fraction(text: string, integer = false): Fraction | null {
  const match = /^([+−-]?\d{1,18})(?:\s*\/\s*(\d{1,18}))?$/.exec(text.trim())
  if (!match || integer && match[2] !== undefined) return null
  const rawNumerator = BigInt(match[1]!.replace('−', '-')), rawDenominator = BigInt(match[2] ?? '1')
  const value = reduced(rawNumerator, rawDenominator)
  return value ? { ...value, rawNumerator, rawDenominator } : null
}

const format = ({ numerator, denominator }: Rational) => `${numerator < 0n ? '−' : ''}${numerator < 0n ? -numerator : numerator}${denominator === 1n ? '' : `/${denominator}`}`
const key = ({ numerator, denominator }: Rational) => `${numerator}_${denominator}`
const add = (a: Rational, b: Rational, sign = 1n) => reduced(a.numerator * b.denominator + sign * b.numerator * a.denominator, a.denominator * b.denominator)!
const multiply = (a: Rational, b: Rational) => reduced(a.numerator * b.numerator, a.denominator * b.denominator)!
const divide = (a: Rational, b: Rational) => reduced(a.numerator * b.denominator, a.denominator * b.numerator)

/** Verify the meaning of the source prompt as well as its answer. In particular,
 * a/b ÷ c/d divides by the entire second fraction, never by c and then by d. */
export function verifiedFractions(item: MathItem, exerciseType: string): Verified | undefined {
  if (exerciseType === 'tpm-fractions-mixte' && item.layout === 'inline') {
    const label = item.labels?.length === 1 ? item.labels[0] : undefined
    const type = label === 'frac-reduce-partial' ? 'fractions-equivalentes' : label === 'frac-reduce' ? 'fractions-simplifier' : label === 'frac-op'
      ? item.op === '+' || item.op === '−' ? 'fractions-add' : item.op === '×' ? 'fractions-mul' : item.op === '÷' ? 'fractions-div' : undefined
      : undefined
    return type ? verifiedFractions(item, type) : { reason: 'Fractions : cette variante TPM doit préciser une réduction ou une opération prise en charge.' }
  }
  if (!TYPES.has(exerciseType) || item.layout !== 'inline') return undefined
  const fail = (reason: string): Verified => ({ reason: `Fractions : ${reason}` })
  if (typeof item.prompt !== 'string' || item.prompt.length > 256 || typeof item.answer !== 'string' || item.answer.length > 100) return fail('énoncé absent ou format à adapter.')
  const prompt = item.prompt.trim(), correctText = item.answer.trim()
  const integer = exerciseType === 'fractions-identifier' || exerciseType === 'fractions-equivalentes'
  const answer = fraction(correctText, integer)
  if (!answer) return fail('le corrigé doit être un entier ou une fraction à dénominateur positif non nul.')
  let value: Rational, model: string, question = prompt, distractors: Rational[] = []
  if (exerciseType === 'fractions-identifier') {
    const match = /^Dans (.+), le (numérateur|dénominateur) est$/.exec(prompt)
    const given = match && fraction(match[1]!)
    if (!given || !match![1]!.includes('/')) return fail('la fraction et le terme demandé ne sont pas identifiables.')
    const numerator = match![2] === 'numérateur'
    value = reduced(numerator ? given.rawNumerator : given.rawDenominator)!
    distractors = [reduced(numerator ? given.rawDenominator : given.rawNumerator)!]
    question = `${prompt}…`
    model = `${prompt} ${correctText}.`
  } else if (exerciseType === 'fractions-equivalentes') {
    const match = /^(.+?)\s*=\s*(□|[+−-]?\d{1,18})\s*\/\s*(□|\d{1,18})$/.exec(prompt)
    const left = match && fraction(match[1]!)
    if (!left || !match![1]!.includes('/') || (match![2] === '□') === (match![3] === '□')) return fail('une seule case doit compléter une égalité de deux fractions.')
    const missingNumerator = match![2] === '□'
    const given = BigInt(match![missingNumerator ? 3 : 2]!.replace('−', '-'))
    if (missingNumerator && given <= 0n || !missingNumerator && left.numerator === 0n) return fail('cette égalité ne possède pas de réponse unique à dénominateur positif.')
    const target = missingNumerator ? reduced(left.numerator * given, left.denominator) : reduced(given * left.denominator, left.numerator)
    if (!target || target.denominator !== 1n || !missingNumerator && target.numerator <= 0n) return fail('la case ne peut pas être complétée par un entier valide.')
    value = target
    distractors = [reduced(given)!, reduced(missingNumerator ? left.rawNumerator : left.rawDenominator)!]
    model = prompt.replace('□', correctText)
  } else if (exerciseType === 'fractions-simplifier') {
    const match = /^(.+?)\s*=\s*□?$/.exec(prompt)
    const given = match && fraction(match[1]!)
    if (!given || !match![1]!.includes('/')) return fail('la fraction à simplifier n’est pas identifiable.')
    value = given
    distractors = [reduced(given.rawDenominator, given.rawNumerator), reduced(given.rawNumerator)].filter((v): v is Rational => !!v)
    question = `Simplifie : ${prompt.replace(/\s*□?$/, '').trim()} □`
    model = `${match![1]!.trim()} = ${correctText}`
  } else {
    const match = /^([+−-]?\d{1,18}\s*\/\s*\d{1,18})\s*([+−\-×÷])\s*([+−-]?\d{1,18}\s*\/\s*\d{1,18})\s*=\s*□?$/.exec(prompt)
    const left = match && fraction(match[1]!), right = match && fraction(match[3]!)
    const op = match?.[2]?.replace('-', '−')
    if (!left || !right || !(exerciseType === 'fractions-add' ? op === '+' || op === '−' : op === (exerciseType === 'fractions-mul' ? '×' : '÷'))) return fail('les deux fractions et l’opération doivent correspondre à cet exercice.')
    const result = op === '+' || op === '−' ? add(left, right, op === '+' ? 1n : -1n) : op === '×' ? multiply(left, right) : divide(left, right)
    if (!result) return fail('une division par zéro ne peut pas devenir une question de jeu.')
    value = result
    distractors = [
      add(left, right), add(left, right, -1n), multiply(left, right), divide(left, right), divide(right, left),
      reduced(left.rawNumerator + right.rawNumerator, left.rawDenominator + right.rawDenominator),
      reduced(left.rawNumerator * right.rawNumerator, left.rawDenominator + right.rawDenominator),
    ].filter((v): v is Rational => !!v)
    question = `${prompt.replace(/\s*□?$/, '').trim()} □`
    model = `${match![1]!.trim()} ${op} ${match![3]!.trim()} = ${correctText}`
  }
  if (compareExact(answer, value) !== '=') return fail('l’énoncé et le corrigé ne correspondent plus. Validez la fiche avant de jouer.')
  if (!integer && (answer.rawNumerator !== answer.numerator || answer.rawDenominator !== answer.denominator)) return fail('le corrigé doit donner une fraction simplifiée.')
  return { prompt: question, model, value, correctText, integer, distractors }
}

/** Every card has a different exact value, including equivalent fractions.
 * Stable rational IDs also allow exact ascending order without float rounding. */
export function fractionChoices(value: Rational, correctText: string, seed: number, integer = false, distractors: Rational[] = [], withinWhole = false): { choices: Choice[]; correctId: string } {
  const n = value.numerator, d = value.denominator
  const candidates = [value, ...distractors, reduced(d, n), reduced(-n, d), reduced(n + 1n, d), reduced(n - 1n, d), reduced(n, d + 1n), d > 1n ? reduced(n, d - 1n) : null, reduced(n + 2n, d), reduced(n - 2n, d)]
  const unique = new Map<string, Rational>()
  for (const candidate of candidates) {
    if (!candidate) continue
    const normalized = reduced(candidate.numerator, candidate.denominator)
    if (normalized && (value.numerator < 0n || normalized.numerator >= 0n) && (!integer || normalized.denominator === 1n) && (!withinWhole || normalized.numerator <= normalized.denominator)) unique.set(key(normalized), normalized)
  }
  // Zero or a small integer has fewer nearby distinct nonnegative candidates.
  // Extend only until five wrong answers exist, instead of drawing far offsets.
  for (let offset = 1n; unique.size < 6; offset++) {
    const candidate = withinWhole ? reduced(1n, offset + 1n)! : reduced(n + offset * d, d)!
    unique.set(key(candidate), candidate)
  }
  const rng = createRng(seed), correctKey = key(value)
  const values = shuffle(rng, [value, ...shuffle(rng, [...unique.values()].filter(candidate => key(candidate) !== correctKey)).slice(0, 5)])
  const id = (candidate: Rational) => integer ? `n${candidate.numerator}` : `f${key(candidate)}`
  return { correctId: id(value), choices: values.map(candidate => ({ id: id(candidate), text: key(candidate) === correctKey ? correctText : format(candidate) })) }
}

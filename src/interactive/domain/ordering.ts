import type { MathItem } from '@/math/types'
import { createRng, shuffle } from '@/math/rng'
import type { Choice } from './types'
import { exactDecimal, scaledDecimal } from './exact-math'

type Adaptation = { part: number; prompt: string; context: string; choices: Choice[]; correctId: string; model: string }
type Result = { items: Adaptation[]; issues: string[] }
const reject = (message: string): Result => ({ items: [], issues: [message] })
const key = (text: string) => text.trim().normalize('NFC').replace(/\s+/g, ' ').toLocaleLowerCase('fr')
const sourceTerms = (value: unknown): value is string[] => Array.isArray(value) && value.length >= 2 && value.length <= 12 && Array.from(value).every((term) => typeof term === 'string' && term.trim().length > 0 && term.length <= 80)

/** Only source alternatives, even when the original list has more than six
 * elements. The complete unordered list remains visible for every rank. */
function cards(choices: Choice[], correctId: string, seed: number): Choice[] {
  const rng = createRng(seed), correct = choices.find((choice) => choice.id === correctId)!
  return shuffle(rng, [correct, ...shuffle(rng, choices.filter((choice) => choice.id !== correctId)).slice(0, 5)])
}

/** Strict numeric/alphabetic order is recomputed; the printed key is checked
 * before turning each position into an independently selectable question. */
export function adaptOrdering(item: MathItem, seedFor: (part: number) => number): Result | undefined {
  if (item.layout !== 'order') return undefined
  if (!sourceTerms(item.sequence)) return reject('La liste à ranger doit contenir de deux à douze éléments lisibles.')
  const terms = item.sequence, decimals = terms.map(exactDecimal)
  const numeric = decimals.every((number) => number !== null)
  const alphabet = terms.every((term) => /^[A-Za-z]$/.test(term)) && /alphabétique/i.test(item.prompt ?? '')
  // Sentence ordering is handled by the existing teacher-led word activity.
  if (!numeric && !alphabet && item.orderOp === undefined) return undefined
  if (!numeric && !alphabet) return reject('Ce classement ne comporte pas uniquement des nombres vérifiables ou des lettres de l’alphabet latin.')
  if (!sourceTerms(item.placeParts) || item.placeParts.length !== terms.length || typeof item.answer !== 'string' || item.answer.length > 2000) return reject('La liste ordonnée et le corrigé doivent reprendre tous les éléments de la fiche.')
  let values: bigint[], expected: string[], choices: Choice[], context: string, promptFor: (position: number) => string
  if (numeric) {
    if (!['<', '>'].includes(item.orderOp ?? '')) return reject('Indiquez un ordre croissant ou décroissant avant de jouer.')
    const descending = item.orderOp === '>'
    const instruction = descending ? 'du plus grand au plus petit' : 'du plus petit au plus grand'
    if (item.prompt?.trim() && key(item.prompt).replace(/[.:]$/, '').trim() !== instruction) return reject('La consigne et le sens du classement ne correspondent plus. Validez la fiche avant de jouer.')
    const precision = Math.max(...decimals.map((number) => number!.precision))
    values = decimals.map((number) => scaledDecimal(number!, precision))
    const parse = (term: string) => {
      const value = exactDecimal(term)
      if (!value) return undefined
      const scale = Math.max(value.precision, precision)
      const units = scaledDecimal(value, scale)
      return values.findIndex((candidate) => candidate * 10n ** BigInt(scale - precision) === units)
    }
    const ordered = [...values.keys()].sort((a, b) => values[a] === values[b] ? 0 : (values[a]! < values[b]! ? -1 : 1) * (descending ? -1 : 1))
    const answer = item.answer.split(item.orderOp!)
    if (new Set(values.map(String)).size !== values.length) return reject('La liste répète un même nombre alors que la fiche demande un ordre strict (< ou >). Vérifiez cette fiche avant de jouer.')
    if (answer.length !== terms.length || item.placeParts.some((term, index) => parse(term) !== ordered[index]) || answer.some((term, index) => parse(term) !== ordered[index])) return reject('La liste ordonnée et le corrigé ne correspondent plus aux nombres à ranger. Validez la fiche avant de jouer.')
    choices = terms.map((text, index) => ({ id: `n${values[index]}`, text }))
    expected = ordered.map((index) => choices[index]!.id)
    context = `Nombres à ranger : ${terms.join(' · ')}\nOrdre ${descending ? 'décroissant' : 'croissant'}.`
    promptFor = (position) => position === 0 ? `Quel est le plus ${descending ? 'grand' : 'petit'} nombre ?` : `Quel est le ${position + 1}e plus ${descending ? 'grand' : 'petit'} nombre ?`
  } else {
    if (item.orderOp !== '<' || !/^classez ces lettres par ordre alphabétique[.:]?$/i.test(key(item.prompt ?? ''))) return reject('La consigne d’ordre alphabétique doit être validée avant de jouer.')
    const normalized = terms.map((term) => term.toUpperCase()), ordered = [...normalized].sort()
    const answer = item.answer.trim().split(/\s+/)
    if (new Set(normalized).size !== terms.length || item.placeParts.some((term, index) => term.toUpperCase() !== ordered[index]) || answer.length !== terms.length || answer.some((term, index) => term.toUpperCase() !== ordered[index])) return reject('Les lettres, leur ordre et le corrigé ne correspondent plus, ou une lettre est répétée.')
    choices = terms.map((text, index) => ({ id: `l${index}`, text }))
    expected = ordered.map((letter) => choices[normalized.indexOf(letter)]!.id)
    context = `Lettres à ranger : ${terms.join(' · ')}\nOrdre alphabétique.`
    promptFor = (position) => position === 0 ? 'Quelle est la première lettre ?' : `Quelle lettre est à la ${position + 1}e place ?`
  }
  return { items: expected.map((correctId, part) => ({ part, prompt: promptFor(part), context, choices: cards(choices, correctId, seedFor(part)), correctId, model: `${part === 0 ? '1re' : `${part + 1}e`} place : ${choices.find((choice) => choice.id === correctId)!.text}.` })), issues: [] }
}

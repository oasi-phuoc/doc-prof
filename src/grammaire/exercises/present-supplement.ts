import { pick, shuffle, type Rng } from '@/math/rng'
import type { MathItem, PhraseCategory } from '@/math/types'
import { PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories, type PhrasePolarity } from '@/francais/phrase-themes'
import type { GramLesson } from './types'
import { parseGramExerciseType } from './subthemes'
import data from './present-supplement-data.json'

export const PRESENT_SUPPLEMENT_DATA = data
export type PresentSupplementSubId = keyof typeof data
export const PRESENT_SUPPLEMENT_SUBTHEMES = Object.keys(data) as PresentSupplementSubId[]
type PresentOrderRow = (typeof data)[PresentSupplementSubId]['a1'][number]

export function isPresentSupplementSubtheme(subId: string): subId is PresentSupplementSubId {
  return Object.hasOwn(data, subId)
}

function isPresentOrderKind(kindId: string): boolean {
  return kindId === 'ordre' || kindId === 'ordre-a1' || kindId === 'ordre-a2'
}

export function isPresentSupplementOrderType(typeId: string): boolean {
  const parsed = parseGramExerciseType(typeId)
  return Boolean(parsed && isPresentSupplementSubtheme(parsed.subId) && isPresentOrderKind(parsed.kindId))
}

export function presentVerbHint(subId: string, verb: string): string | undefined {
  return ['etre', 'avoir', 'aller-destination'].includes(subId) ? undefined : verb
}

const verbLabel = (subId: string) => subId === 'etre' ? 'le verbe être' : subId === 'avoir' ? 'le verbe avoir' : subId === 'aller-destination' ? 'le verbe aller' : 'les verbes indiqués'

function isNegativeOrderRow(row: PresentOrderRow): boolean {
  return row.tokens.some((token) => token.category === 'negation')
}

function presentOrderRows(
  subId: PresentSupplementSubId,
  polarity?: PhrasePolarity,
  categories?: PhraseCategories,
): PresentOrderRow[] {
  const unique = new Map<string, PresentOrderRow>()
  for (const row of [...data[subId].a1, ...data[subId].a2]) {
    if (!unique.has(row.answer)) unique.set(row.answer, row)
  }
  return [...unique.values()].filter((row) => {
    if (row.tokens.some((token) =>
      PHRASE_OPTIONAL_CATEGORIES.some(({ category }) =>
        category === token.category && categories?.[category] === false,
      ),
    )) return false
    const negative = isNegativeOrderRow(row)
    if (polarity === 'positive' && negative) return false
    if (polarity === 'negative' && !negative) return false
    return true
  })
}

export function presentOrderQuestionCap(
  typeId: string,
  polarity?: PhrasePolarity,
  categories?: PhraseCategories,
): number {
  const parsed = parseGramExerciseType(typeId)
  if (!parsed || !isPresentSupplementSubtheme(parsed.subId) || !isPresentOrderKind(parsed.kindId)) return 0
  return presentOrderRows(parsed.subId, polarity, categories).length
}

export const PRESENT_SUPPLEMENT_LESSONS: GramLesson[] = PRESENT_SUPPLEMENT_SUBTHEMES.flatMap(subId => [
  {
    subId, kindId: 'corriger-erreur', label: 'Corriger l’erreur',
    instruction: `Corrigez la conjugaison au présent et réécrivez la phrase entière.`,
    items: data[subId].corrections,
  },
  {
    subId, kindId: 'ordre', label: 'Mots dans l’ordre',
    instruction: `Remettez les mots dans l’ordre pour écrire une phrase avec ${verbLabel(subId)} au présent.`,
    items: presentOrderRows(subId).map(row => ({ prompt: row.answer, answer: row.answer })),
  },
])

function samplePresentOrderRows(
  rows: PresentOrderRow[],
  count: number,
  rng: Rng,
  polarity: PhrasePolarity,
): PresentOrderRow[] {
  const target = Math.min(Math.max(1, count), rows.length)
  if (target === 0) return []
  if (polarity !== 'mixed') return shuffle(rng, rows).slice(0, target)

  const negative = shuffle(rng, rows.filter(isNegativeOrderRow))
  const positive = shuffle(rng, rows.filter((row) => !isNegativeOrderRow(row)))
  const negativeCount = target === 1 && negative.length && positive.length
    ? (pick(rng, [true, false]) ? 1 : 0)
    : Math.ceil(target / 2)
  const selected = [
    ...negative.slice(0, negativeCount),
    ...positive.slice(0, target - negativeCount),
  ]
  if (selected.length < target) {
    const remaining = shuffle(rng, rows.filter((row) => !selected.includes(row)))
    selected.push(...remaining.slice(0, target - selected.length))
  }
  return shuffle(rng, selected)
}

export function buildPresentOrder(opts: {
  subId: string
  kindId: string
  count: number
  rng: Rng
  polarity?: PhrasePolarity
  categories?: PhraseCategories
}): MathItem[] | null {
  const { subId, kindId, count, rng, categories } = opts
  if (!isPresentSupplementSubtheme(subId) || !isPresentOrderKind(kindId)) return null
  const rows = presentOrderRows(subId, opts.polarity ?? 'positive', categories)
  return samplePresentOrderRows(rows, count, rng, opts.polarity ?? 'positive').map(row => {
    const ordered = row.tokens.map(token => ({ text: token.text, category: token.category as PhraseCategory }))
    const mixed = shuffle(rng, ordered)
    // Even an unlucky shuffle must leave a real ordering task.
    if (mixed.every((token, index) => token.text === ordered[index]!.text)) mixed.push(mixed.shift()!)
    return {
      layout: 'phrase-order', tokens: mixed,
      labels: ordered.map(token => token.text),
      responseAnswer: row.answer, answer: row.answer,
      responseVerb: presentVerbHint(subId, row.verb),
    }
  })
}

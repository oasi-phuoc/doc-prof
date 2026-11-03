import { shuffle, type Rng } from '@/math/rng'
import type { MathItem, PhraseCategory } from '@/math/types'
import type { GramLesson } from './types'
import data from './present-supplement-data.json'

export const PRESENT_SUPPLEMENT_DATA = data
export type PresentSupplementSubId = keyof typeof data
export const PRESENT_SUPPLEMENT_SUBTHEMES = Object.keys(data) as PresentSupplementSubId[]

export function isPresentSupplementSubtheme(subId: string): subId is PresentSupplementSubId {
  return Object.hasOwn(data, subId)
}

export function presentVerbHint(subId: string, verb: string): string | undefined {
  return ['etre', 'avoir', 'aller-destination'].includes(subId) ? undefined : verb
}

const verbLabel = (subId: string) => subId === 'etre' ? 'le verbe être' : subId === 'avoir' ? 'le verbe avoir' : subId === 'aller-destination' ? 'le verbe aller' : 'les verbes indiqués'

export const PRESENT_SUPPLEMENT_LESSONS: GramLesson[] = PRESENT_SUPPLEMENT_SUBTHEMES.flatMap(subId => [
  {
    subId, kindId: 'corriger-erreur', label: 'Corriger l’erreur',
    instruction: `Corrigez la conjugaison au présent et réécrivez la phrase entière.`,
    items: data[subId].corrections,
  },
  ...(['a1', 'a2'] as const).map(level => ({
    subId,
    kindId: level === 'a1' ? 'ordre-a1' as const : 'ordre-a2' as const,
    label: `Mots dans l’ordre (${level.toUpperCase()})`,
    instruction: `Remettez les mots dans l’ordre pour écrire une phrase avec ${verbLabel(subId)} au présent.`,
    items: data[subId][level].map(row => ({ prompt: row.answer, answer: row.answer })),
  })),
])

export function buildPresentOrder(opts: { subId: string; kindId: string; count: number; rng: Rng }): MathItem[] | null {
  const { subId, kindId, count, rng } = opts
  if (!isPresentSupplementSubtheme(subId) || (kindId !== 'ordre-a1' && kindId !== 'ordre-a2')) return null
  const level = kindId === 'ordre-a1' ? 'a1' : 'a2'
  return shuffle(rng, data[subId][level]).slice(0, Math.max(1, count)).map(row => {
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

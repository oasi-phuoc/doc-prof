import { framesForTheme, tagged } from './phrase-sentences'
import { affirmativePhraseTheme, PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories, type PhraseOptionalCategory, type PhraseThemeId } from './phrase-themes'
import type { PhraseVerbGroup } from '@/math/types'

/** Select complete predicates: never remove a verb's necessary complement. */
export function phraseSelection(theme: PhraseThemeId, group: PhraseVerbGroup, categories?: PhraseCategories) {
  let effectiveTheme = affirmativePhraseTheme(theme)
  const coreCategory: Partial<Record<PhraseThemeId, PhraseOptionalCategory>> = {
    'phrase-adjectif': 'adjectif',
    'phrase-preposition': 'preposition',
    'phrase-adverbe': 'adverbe',
    'phrase-conjonctions': 'conjonction',
  }
  const core = coreCategory[effectiveTheme]
  if (core && categories?.[core] === false) effectiveTheme = 'phrase-simple'
  const excluded = new Set<string>(PHRASE_OPTIONAL_CATEGORIES.filter(({ category }) => categories?.[category] === false).map(({ category }) => category))
  const accepts = (pred: string) => tagged(pred).every(token => !excluded.has(token.category))
  const frames = framesForTheme(effectiveTheme, group).flatMap(frame => {
    const preds = frame.preds.filter(accepts)
    const rightPreds = frame.rightPreds?.filter(accepts)
    if (!preds.length || (rightPreds && !rightPreds.length)) return []
    return [{ ...frame, preds, ...(rightPreds ? { rightPreds } : {}) }]
  })
  return { theme: effectiveTheme, frames }
}

import { framesForTheme, tagged } from './phrase-sentences'
import { combinationFrames } from './phrase-combinations'
import { affirmativePhraseTheme, PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories, type PhraseOptionalCategory, type PhraseThemeId } from './phrase-themes'
import type { PhraseVerbGroup } from '@/math/types'
import type { ThemedFrame } from './phrase-theme-frames'

type Selection = { theme: PhraseThemeId; frames: readonly ThemedFrame[] }
const selections = new Map<string, Selection>()
const banks = new Map<string, readonly ThemedFrame[]>()

/** Select complete predicates: never remove a verb's necessary complement. */
export function phraseSelection(theme: PhraseThemeId, group: PhraseVerbGroup, categories?: PhraseCategories): Selection {
  let effectiveTheme = affirmativePhraseTheme(theme)
  const coreCategory: Partial<Record<PhraseThemeId, PhraseOptionalCategory>> = {
    'phrase-adjectif': 'adjectif',
    'phrase-preposition': 'preposition',
    'phrase-adverbe': 'adverbe',
    'phrase-conjonctions': 'conjonction',
  }
  const core = coreCategory[effectiveTheme]
  if (core && categories?.[core] === false) effectiveTheme = 'phrase-simple'
  const bank = group === 'autres' ? 'autres' : 'er'
  const allowed = PHRASE_OPTIONAL_CATEGORIES.reduce((mask,{category},bit)=>categories?.[category]===false?mask:mask|(1<<bit),0)
  const key = `${effectiveTheme}:${bank}:${allowed}`
  const cached = selections.get(key)
  if (cached) return cached
  const excluded = new Set<string>(PHRASE_OPTIONAL_CATEGORIES.filter(({ category }) => categories?.[category] === false).map(({ category }) => category))
  const accepts = (pred: string) => tagged(pred).every(token => !excluded.has(token.category))
  const bankKey = `${effectiveTheme}:${bank}`
  let source = banks.get(bankKey)
  if (!source) {
    source = combinationFrames(effectiveTheme, bank, framesForTheme(effectiveTheme, group))
    banks.set(bankKey,source)
  }
  const frames = source.flatMap(frame => {
    if (frame.contexts) {
      const contexts = frame.contexts.filter(context => accepts(context.pred) && (!context.rightPred || (categories?.conjonction !== false && accepts(context.rightPred))))
      return contexts.length ? [{...frame,preds:[...new Set(contexts.map(context=>context.pred))],contexts}] : []
    }
    const preds = frame.preds.filter(accepts)
    const rightPreds = frame.rightPreds?.filter(accepts)
    if (!preds.length || (rightPreds && !rightPreds.length)) return []
    return [{ ...frame, preds, ...(rightPreds ? { rightPreds } : {}) }]
  })
  const result = { theme: effectiveTheme, frames }
  selections.set(key,result)
  return result
}

import { framesForTheme, tagged } from './phrase-sentences'
import { combinationFrames } from './phrase-combinations'
import { affirmativePhraseTheme, PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories, type PhraseOptionalCategory, type PhraseThemeId } from './phrase-themes'
import type { PhraseVerbGroup } from '@/math/types'
import type { PhraseContext, ThemedFrame } from './phrase-theme-frames'
import { phraseVerbGroupOf } from './phrase-verb-groups'

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
  const bank = group === 'libre' ? 'er' : group
  const allowed = PHRASE_OPTIONAL_CATEGORIES.reduce((mask,{category},bit)=>categories?.[category]===false?mask:mask|(1<<bit),0)
  const key = `${effectiveTheme}:${bank}:${allowed}`
  const cached = selections.get(key)
  if (cached) return cached
  const excluded = new Set<string>(PHRASE_OPTIONAL_CATEGORIES.filter(({ category }) => categories?.[category] === false).map(({ category }) => category))
  const accepts = (pred: string) => tagged(pred).every(token => !excluded.has(token.category))
  const sourceFor = (sourceGroup: 'er' | 'autres') => {
    const bankKey = `${effectiveTheme}:${sourceGroup}`
    let source = banks.get(bankKey)
    if (!source) {
      source = combinationFrames(effectiveTheme, sourceGroup, framesForTheme(effectiveTheme, sourceGroup))
      banks.set(bankKey, source)
    }
    return source
  }
  const frames = (['er', 'autres'] as const)
    .flatMap((sourceGroup) => sourceFor(sourceGroup))
    .filter((frame) => bank === 'mixte' || phraseVerbGroupOf(frame.id) === bank)
    .flatMap((frame) => {
      if (frame.contexts) {
        const contexts = frame.contexts.filter(
          (context) =>
            accepts(context.pred) &&
            (!context.rightPred || (categories?.conjonction !== false && accepts(context.rightPred) &&
              (bank === 'mixte' || (context.rightId && phraseVerbGroupOf(context.rightId) === bank)))),
        )
        return contexts.length ? [{ ...frame, preds: [...new Set(contexts.map((context) => context.pred))], contexts }] : []
      }
      const preds = frame.preds.filter(accepts)
      const rightPreds = frame.rightPreds?.filter(accepts)
      if (!preds.length || (rightPreds && !rightPreds.length)) return []
      return [{ ...frame, preds, ...(rightPreds ? { rightPreds } : {}) }]
    })
  // A legacy bank can store the same infinitive in two places (e.g. perdre).
  // Consolidate it before imposing the one-verb-per-worksheet rule.
  const unique = new Map<string, ThemedFrame>()
  for (const frame of frames) {
    const previous = unique.get(frame.id)
    if (!previous) { unique.set(frame.id,frame); continue }
    const contexts: PhraseContext[] = [...(previous.contexts ?? previous.preds.map(pred=>({pred}))), ...(frame.contexts ?? frame.preds.map(pred=>({pred})))]
    const distinct = [...new Map(contexts.map(context=>[JSON.stringify([context.pred,context.rightId,context.rightPred]),context])).values()]
    unique.set(frame.id,{id:frame.id,preds:[...new Set(distinct.map(context=>context.pred))],contexts:distinct})
  }
  const result = { theme: effectiveTheme, frames:[...unique.values()] }
  selections.set(key,result)
  return result
}

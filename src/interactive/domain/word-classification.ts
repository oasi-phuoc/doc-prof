import {phraseSentence,interrogativePrefix} from '@/francais/phrase-forms'
import type { MathItem, PhraseCategory } from '@/math/types'
import { PHRASE_CATEGORY_LABELS } from '@/francais/phrase-banks'
import type { Choice, WordClassification } from './types'

type Entry = { part: number; prompt: string; classification: WordClassification; choices: Choice[]; correctId?: string; model: string; teacherLed: boolean }

/** Use explicit bank tags and their printed key, never infer a category from
 * spelling, a colour, a dictionary or another occurrence of the same word. */
export function adaptWordClassification(item: MathItem): { items: Entry[]; issues: string[] } | undefined {
  if (item.layout !== 'phrase-color') return undefined
  const tokens = item.tokens
  if (!Array.isArray(tokens) || tokens.length < 2 || tokens.length > 64 || tokens.some(token => !token || typeof token.text !== 'string' || !token.text.trim() || token.text.length > 120 || !Object.hasOwn(PHRASE_CATEGORY_LABELS, token.category)) || tokens.reduce((size, token) => size + token.text.length, 0) > 3000 || item.answer !== tokens.map(token => token.category).join(' · ') || item.prompt?.trim()) {
    return { items: [], issues: ['Tri Gattegno : les éléments, leurs catégories et le corrigé doivent être cohérents avec la fiche.'] }
  }
  const words = tokens.map((token,index)=>item.phraseQuestion&&index===0&&token.category!=='nom'?token.text[0]!.toLowerCase()+token.text.slice(1):token.text)
  const categories = (Object.keys(PHRASE_CATEGORY_LABELS) as PhraseCategory[]).filter(category => tokens.some(token => token.category === category))
  const teacherLed = categories.length < 2 || categories.length > 6
  const choices = teacherLed ? [] : categories.map(category => ({ id: `category-${category}`, text: PHRASE_CATEGORY_LABELS[category] }))
  const sentence = phraseSentence(tokens,item.phraseQuestion)
  return {
    items: tokens.map((token, part) => ({ part, prompt: `Quelle catégorie pour « ${token.text} » ?`, classification: { tokens: [...words], target: part,...(item.phraseQuestion?{prefix:interrogativePrefix(tokens),ending:' ?'}:{}) }, choices: choices.map(choice => ({ ...choice })), ...(teacherLed ? {} : { correctId: `category-${token.category}` }), model: `Élément ${part + 1}/${tokens.length} : ${token.text} → ${PHRASE_CATEGORY_LABELS[token.category]}\nPhrase : ${sentence}`, teacherLed })),
    issues: teacherLed ? [`Tri Gattegno : ${categories.length} catégorie(s) dans cette phrase. L’activité reste guidée sans choix automatique ; les cartes de vote demandent deux à six catégories.`] : [],
  }
}

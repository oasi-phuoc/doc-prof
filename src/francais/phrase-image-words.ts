import type { PhraseCategory } from '@/math/types'

export function showsPhraseImageWord(category: PhraseCategory, labels?: boolean, shown?: readonly PhraseCategory[]): boolean {
  return labels === true && (!shown || shown.includes(category))
}

export function phraseImageWordFields(labels?: boolean, shown?: readonly PhraseCategory[]) {
  const on = labels === true
  return { phraseImageLabels: on, phraseImageShownCategories: on && shown ? [...shown] : undefined }
}

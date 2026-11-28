import type { MathItem } from '@/math/types'

export function gridCells(item: MathItem): string[] {
  if (item.layout === 'text') return [item.readingText ? item.prompt ?? item.answer : item.answer]
  if (item.layout === 'mark-letter') return item.markLetterWords ?? []
  if (item.layout === 'dictee-grid') return item.dicteeWords ?? []
  if (item.layout === 'read-phrases') return item.readPhrases ?? []
  return item.options ?? []
}

export function withGridCells(item: MathItem, cells: string[]): MathItem {
  if (item.layout === 'text') {
    const text = cells[0] ?? ''
    return { ...item, ...(item.readingText ? { prompt: text } : {}), answer: text }
  }
  if (item.letterGridPurpose === 'reading') return { ...item, options: cells, labels: cells, answer: cells.join(' · ') }
  if (item.layout === 'mark-letter') return { ...item, markLetterWords: cells, answer: cells.join(' · ') }
  if (item.layout === 'dictee-grid') return { ...item, dicteeWords: cells, answer: cells.join(' · ') }
  if (item.layout === 'read-phrases') return { ...item, readPhrases: cells, answer: cells.join(' · ') }
  return { ...item, options: cells, answer: item.layout === 'syllable-table' ? cells.join(' · ') : item.answer }
}

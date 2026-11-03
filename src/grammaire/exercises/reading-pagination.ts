import type { WorksheetBlock, WorksheetPage } from '@/math/types'
import { isGrammarReadingType } from './reading-types'

/** Split existing items without drawing a different text or resetting question numbers. */
export function splitGrammarReadingPages(page: WorksheetPage): WorksheetPage[] | null {
  if (!page.blocks.some(block => isGrammarReadingType(block.exerciseType) && block.tcfPageBreakAfter?.some((on, i) => on && i < block.items.length - 1))) return null
  const groups: WorksheetBlock[][] = []
  let current: WorksheetBlock[] = []
  page.blocks.forEach((block, sourceBlockIndex) => {
    let start = 0
    const cuts = isGrammarReadingType(block.exerciseType)
      ? block.items.flatMap((_, i) => block.tcfPageBreakAfter?.[i] && i < block.items.length - 1 ? [i + 1] : [])
      : []
    for (const end of [...cuts, block.items.length]) {
      current.push({
        ...block,
        sourceBlockIndex,
        items: block.items.slice(start, end),
        itemOffset: start,
        title: start ? `${block.title} (suite)` : block.title,
        instruction: start ? 'Continuez. Répondez aux questions suivantes.' : block.instruction,
      })
      if (end < block.items.length) {
        groups.push(current)
        current = []
      }
      start = end
    }
  })
  if (current.length) groups.push(current)
  return groups.map((blocks, index) => ({
    ...page,
    title: index ? `${page.title} — suite` : page.title,
    blocks,
    items: blocks.flatMap(block => block.items),
    isContinuation: index > 0,
  }))
}

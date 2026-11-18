import type {WorksheetBlock,WorksheetPage} from '@/math/types'
import {headingForSlice} from '@/math/page-break-heading'

/** Feuille avec en-tête institutionnel. Les suivantes n’ont que le pied. */
const PHRASE_IMAGE_HEADER_CAPACITY = 3
/** Suite sans en-tête : la rangée d’images et la ligne d’écriture restent ensemble. */
const PHRASE_IMAGE_FOLLOW_CAPACITY = 5

export function splitPhraseImagePages(
  page: WorksheetPage,
  options?: { firstPageHasHeader?: boolean },
): WorksheetPage[] | null {
  if (!page.blocks.some(block => block.items.some(item => item.layout === 'phrase-images'))) return null
  const pages: WorksheetPage[] = []
  const pending: WorksheetBlock[] = []
  const firstPageHasHeader = options?.firstPageHasHeader !== false
  const flush = () => {
    if (!pending.length) return
    const blocks = pending.splice(0)
    pages.push({
      ...page,
      blocks,
      items: blocks.flatMap(block => block.items),
      isContinuation: pages.length > 0,
    })
  }
  page.blocks.forEach((block, index) => {
    if (!block.items.length || !block.items.every(item => item.layout === 'phrase-images')) {
      pending.push({ ...block, sourceBlockIndex: index })
      return
    }
    flush()
    let offset = 0
    while (offset < block.items.length) {
      const hasHeader = firstPageHasHeader && pages.length === 0
      const capacity = hasHeader ? PHRASE_IMAGE_HEADER_CAPACITY : PHRASE_IMAGE_FOLLOW_CAPACITY
      const items = block.items.slice(offset, offset + capacity)
      pages.push({
        ...page,
        items,
        blocks: [{
          ...block,
          ...headingForSlice(block, offset, block.items),
          items,
          itemOffset: offset,
          sourceBlockIndex: index,
        }],
        isContinuation: pages.length > 0,
      })
      offset += items.length
    }
  })
  flush()
  return pages.length > 1 ? pages : null
}

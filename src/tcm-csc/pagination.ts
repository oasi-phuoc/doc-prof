import type { WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'

/** Doubled writing cells need at most two rows of operations per A4 page. */
export function splitCscColumnPages(page: WorksheetPage): WorksheetPage[] | null {
  const block = page.blocks[0]
  if (page.blocks.length !== 1 || !block || !/^tcm-csc-ex(?:10|11)$/.test(block.exerciseType) || block.items.length <= 4) return null
  const pages: WorksheetPage[] = []
  for (let offset = 0; offset < block.items.length; offset += 4) {
    const items = block.items.slice(offset,offset+4)
    pages.push({...page,items,blocks:[{...block,...headingForSlice(block,offset,block.items),items,itemOffset:offset,sourceBlockIndex:0}],isContinuation:offset>0})
  }
  return pages
}

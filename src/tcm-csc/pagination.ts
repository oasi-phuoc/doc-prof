import type { WorksheetPage } from '@/math/types'
import { headingForSlice } from '@/math/page-break-heading'

/** Eight operations grouped in two shared frames fit on one A4 page. */
export function splitCscColumnPages(page: WorksheetPage): WorksheetPage[] | null {
  const block = page.blocks[0]
  if (page.blocks.length !== 1 || !block || !/^tcm-csc-ex(?:10|11)$/.test(block.exerciseType) || block.items.length <= 8) return null
  const pages: WorksheetPage[] = []
  for (let offset = 0; offset < block.items.length; offset += 8) {
    const items = block.items.slice(offset,offset+8)
    pages.push({...page,items,blocks:[{...block,...headingForSlice(block,offset,block.items),items,itemOffset:offset,sourceBlockIndex:0}],isContinuation:offset>0})
  }
  return pages
}

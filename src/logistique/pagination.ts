import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import { headingForSlice } from '@/math/page-break-heading'
import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'

const CONTENT_BUDGET = 660
const ACTIVITY_HEADING = 72

function lineCount(text: string, width = 66): number {
  return text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / width)), 0)
}

function theoryHeight(block: GrammarTheoryBlock): number {
  switch (block.kind) {
    case 'heading':
      return 42 + (lineCount(block.text) - 1) * 33
    case 'image':
      return 226
    case 'paragraph':
    case 'note':
    case 'rule':
    case 'notice':
    case 'attention':
    case 'astuce':
      return 14 + lineCount(block.text) * 25
    case 'list':
      return 20 + block.items.reduce((sum, item) => sum + lineCount(item, 59) * 25, 0)
    case 'table':
      return 20 + [block.headers, ...block.rows].reduce((sum, row) => sum + 20 +
        Math.max(...row.map((cell) => lineCount(cell, Math.floor(58 / row.length)))) * 25, 0)
    case 'section':
      return 58 + block.blocks.reduce((sum, child) => sum + theoryHeight(child), 0)
    case 'examples':
      return 30 + block.items.reduce((sum, item) => sum + lineCount(typeof item === 'string' ? item : item.text) * 25, 0)
    case 'tab':
      return 30 + block.rows.length * 32
    case 'page':
      return 0
  }
}

function height(item: MathItem): number {
  if (item.theoryBlock) return theoryHeight(item.theoryBlock)
  const prompt = lineCount(item.prompt ?? '') * 25
  if (item.calcAnswer) return 160 + prompt + lineCount(item.calcAnswer) * 22
  return 49 + prompt + lineCount(item.answer) * 25 + (item.options?.length ?? 0) * 18
}

/** Uses the existing worksheet blocks and user cuts, with a conservative A4 budget for content. */
export function splitLogistiquePages(page: WorksheetPage): WorksheetPage[] {
  const pages: WorksheetPage[] = []
  let blocks: WorksheetBlock[] = []
  let used = 0
  const flush = () => {
    if (!blocks.length) return
    pages.push({ ...page, blocks, items: blocks.flatMap((block) => block.items), isContinuation: pages.length > 0 })
    blocks = []
    used = 0
  }
  for (const [blockIndex, block] of page.blocks.entries()) {
    let start = 0
    let overhead = ACTIVITY_HEADING
    const append = (end: number) => {
      blocks.push({
        ...block,
        ...headingForSlice(block, start, block.items),
        sourceBlockIndex: blockIndex,
        itemOffset: start,
        items: block.items.slice(start, end),
        problemDraftGrids: block.problemDraftGrids?.slice(start, end),
      })
      start = end
      overhead = 0
    }
    for (const [index, item] of block.items.entries()) {
      const itemHeight = height(item)
      const following = block.items[index + 1]
      const keepWithFollowing = item.theoryBlock?.kind === 'heading' && following ? height(following) : 0
      if (used > 0 && used + overhead + itemHeight + keepWithFollowing > CONTENT_BUDGET) {
        if (index > start) append(index)
        flush()
      }
      used += overhead + itemHeight
      overhead = 0
      if (block.tcfPageBreakAfter?.[index] || item.theoryPageBreakAfter) {
        append(index + 1)
        flush()
      }
    }
    if (start < block.items.length || block.items.length === 0) append(block.items.length)
  }
  flush()
  return pages.length ? pages : [page]
}

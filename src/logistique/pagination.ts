import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import { headingForSlice } from '@/math/page-break-heading'
import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'

export type LogistiquePageLayout = {
  a5?: boolean
  hideChrome?: boolean
  fontScale?: number
}

// Espace imprimable après marges, pied de page et réserve de bas de page.
const A4_CONTENT = 946
const A4_HEADER = 287
const A5_CONTENT = 695
const A5_HEADER = 275

function lineCount(text: string, width: number): number {
  return text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / width)), 0)
}

function wrappedFigureHeight(image: GrammarTheoryBlock, prose: GrammarTheoryBlock, a5: boolean, scale: number) {
  if (image.kind !== 'image' || prose.kind !== 'paragraph') return undefined
  if (!/-photo-v\d+\.webp$/i.test(image.src)) return undefined
  const text = prose.text.replace(/\{\/?g\}/g, '')
  if (text.length < 85 || (a5 && scale > 1.15)) return undefined
  const width = (a5 ? 53 : 72) / scale
  const figure = (a5 ? 132 : 155) + lineCount(image.caption, width * 0.45) * 19 * scale
  const lineHeight = 26 * scale
  const beside = Math.floor(figure / lineHeight)
  const narrowWidth = width * 0.6
  const below = Math.max(0, text.length - beside * narrowWidth)
  const flow = below
    ? beside + lineCount(text.slice(-below), width)
    : lineCount(text, narrowWidth)
  return 12 + Math.max(figure, Math.max(flow, lineCount(text, width)) * lineHeight)
}

function theoryHeight(block: GrammarTheoryBlock, width: number, scale: number): number {
  const lines = (text: string, columns = width) => lineCount(text.replace(/\{\/?g\}/g, ''), columns) * 26 * scale
  switch (block.kind) {
    case 'heading':
      return 12 + (block.sub ? 28 : 32) * scale * lineCount(block.text, width * 0.8)
    case 'image':
      return 184 + lines(block.caption)
    case 'image-row': {
      const cellWidth = width * 0.9 / block.cells.length
      return 143 + Math.max(...block.cells.map(({ caption, description }) =>
        lines(caption, cellWidth) + (description ? lines(description, cellWidth) : 0)))
    }
    case 'paragraph':
    case 'note':
    case 'rule':
    case 'notice':
    case 'attention':
    case 'astuce':
      return 12 + lines(block.text)
    case 'list':
      return 16 + block.items.reduce((sum, item) => sum + lines(item, width * 0.9), 0)
    case 'table':
      return 18 + [block.headers, ...block.rows].reduce((sum, row) => sum + 14 +
        Math.max(...row.map((cell) => lines(cell, width * 0.84 / row.length))), 0)
    case 'section':
      return 58 + block.blocks.reduce((sum, child) => sum + theoryHeight(child, width, scale), 0)
    case 'examples':
      return 30 + block.items.reduce((sum, item) => sum + lines(typeof item === 'string' ? item : item.text), 0)
    case 'tab':
      return 30 + block.rows.length * 32
    case 'page':
      return 0
  }
}

function height(item: MathItem, a5: boolean, scale: number): number {
  const width = (a5 ? 53 : 72) / scale
  if (item.theoryBlock) return theoryHeight(item.theoryBlock, width, scale)
  const prompt = lineCount(item.prompt ?? '', width * 1.2) * 24 * scale
  const answer = lineCount(item.answer, width * 0.84) * 27 * scale
  if (item.calcAnswer) {
    // Même un énoncé court conserve la grille, le trait et leurs espacements.
    const minimum = (a5 ? 183 : 240) + (scale - 1) * 56
    return Math.max(minimum, (a5 ? 145 : 174) + prompt + answer)
  }
  return 48 + prompt + answer + (item.options?.length ?? 0) * 22 * scale
}

/** Enchaîne les questions dans l’espace disponible et respecte les sauts manuels. */
export function splitLogistiquePages(
  page: WorksheetPage,
  { a5 = false, hideChrome = false, fontScale = 1, firstPageHasHeader = true }:
    LogistiquePageLayout & { firstPageHasHeader?: boolean } = {},
): WorksheetPage[] {
  const pages: WorksheetPage[] = []
  let blocks: WorksheetBlock[] = []
  let used = 0
  const budget = (pageIndex = pages.length) => {
    const hasHeader = !hideChrome && (a5 || (firstPageHasHeader && pageIndex === 0))
    return (a5 ? A5_CONTENT : A4_CONTENT) + (hideChrome ? 45 : 0)
      - (hasHeader ? (a5 ? A5_HEADER : A4_HEADER) + (fontScale - 1) * 92 : 0)
  }
  const flush = () => {
    if (!blocks.length) return
    pages.push({ ...page, blocks, items: blocks.flatMap((block) => block.items), isContinuation: pages.length > 0 })
    blocks = []
    used = 0
  }
  for (const [blockIndex, block] of page.blocks.entries()) {
    let start = 0
    let overhead = block.items.some((item) => item.layout === 'theory') ? 16 : 84 * fontScale
    const append = (end: number) => {
      blocks.push({
        ...block,
        ...headingForSlice(block, start, block.items),
        sourceBlockIndex: blockIndex,
        itemOffset: start,
        items: block.items.slice(start, end),
        ...(wrappedFigures.size ? {
          logistiqueWrappedFigures: [...wrappedFigures].filter((index) => index >= start && index + 1 < end)
            .map((index) => index - start),
        } : {}),
        problemDraftGrids: block.problemDraftGrids?.slice(start, end),
      })
      start = end
      overhead = 0
    }
    const heights = block.items.map((item) => height(item, a5, fontScale))
    const wrappedFigures = new Set<number>()
    for (let index = 0; index + 1 < block.items.length; index++) {
      const item = block.items[index]!
      const next = block.items[index + 1]!
      if (!item.theoryBlock || !next.theoryBlock || item.theoryPageBreakAfter || block.tcfPageBreakAfter?.[index]) continue
      const wrapped = wrappedFigureHeight(item.theoryBlock, next.theoryBlock, a5, fontScale)
      if (wrapped === undefined) continue
      wrappedFigures.add(index)
      heights[index] = wrapped
      heights[++index] = 0
    }
    const withFollowing = [...heights]
    for (let index = block.items.length - 2; index >= 0; index--) {
      if (block.items[index]?.theoryBlock?.kind === 'heading' && !block.tcfPageBreakAfter?.[index]) {
        withFollowing[index]! += withFollowing[index + 1]!
      }
    }
    for (const [index, item] of block.items.entries()) {
      const itemHeight = heights[index]!
      if (!wrappedFigures.has(index - 1) && used > 0 && used + overhead + withFollowing[index]! > budget()) {
        const previousHeight = heights[index - 1] ?? 0
        const balanceLastQuestion = !item.theoryBlock && index === block.items.length - 1 && index - start >= 3
          && previousHeight + itemHeight <= budget(pages.length + 1)
        if (index > start) append(balanceLastQuestion ? index - 1 : index)
        flush()
        if (balanceLastQuestion) used = previousHeight
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

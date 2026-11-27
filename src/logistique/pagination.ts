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
const A5_CONTENT = 665
const A5_HEADER = 275

function lineCount(text: string, width: number): number {
  return text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / width)), 0)
}

type A5TheoryBlock = Extract<GrammarTheoryBlock, { kind: 'table' | 'list' }>
type TheoryLayoutSlice = { item: MathItem; sourceIndex: number; theoryBlock?: A5TheoryBlock; isLast: boolean }

function a5TheoryHeight(block: A5TheoryBlock, scale: number) {
  if (block.kind === 'list') {
    return 40 + block.items.reduce((sum, text) => sum + 8 +
      27 * scale * lineCount(text.replace(/\{\/?g\}/g, ''), 47 / scale), 0)
  }
  const columns = Math.max(block.headers.length, ...block.rows.map((row) => row.length), 1)
  const width = Math.max(1, 52 / scale / columns - 2)
  const rows = block.colHeader !== false && block.headers.some(Boolean) ? [block.headers, ...block.rows] : block.rows
  return 14 + rows.reduce((sum, row) => sum + 8 +
    24 * scale * Math.max(1, ...row.map((cell) => lineCount(cell.replace(/\{\/?g\}/g, ''), width))), 0)
}

function splitA5Theory(block: A5TheoryBlock, maxHeight: number, scale: number): A5TheoryBlock[] {
  const count = block.kind === 'table' ? block.rows.length : block.items.length
  if (count < 2 || a5TheoryHeight(block, scale) <= maxHeight) return [block]
  const segment = (start: number, end: number) => block.kind === 'table'
    ? { ...block, rows: block.rows.slice(start, end) }
    : { ...block, items: block.items.slice(start, end) }
  const fragments: A5TheoryBlock[] = []
  let start = 0
  for (let end = 2; end <= count; end++) {
    if (a5TheoryHeight(segment(start, end), scale) <= maxHeight) continue
    fragments.push(segment(start, end - 1))
    start = end - 1
  }
  fragments.push(segment(start, count))
  return fragments
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
  if (a5 && (item.theoryBlock?.kind === 'table' || item.theoryBlock?.kind === 'list')) {
    return a5TheoryHeight(item.theoryBlock, scale)
  }
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
  const a5ItemLimit = budget(0) - 56
  for (const [blockIndex, block] of page.blocks.entries()) {
    const slices = block.items.flatMap<TheoryLayoutSlice>((item, sourceIndex) => {
      const theory = item.theoryBlock
      if (a5 && (theory?.kind === 'table' || theory?.kind === 'list')) {
        const fragments = splitA5Theory(theory, a5ItemLimit, fontScale)
        if (fragments.length > 1) {
          return fragments.map((theoryBlock, index) => ({ item, sourceIndex, theoryBlock, isLast: index === fragments.length - 1 }))
        }
      }
      return [{ item, sourceIndex, theoryBlock: undefined, isLast: true }]
    })
    const hasSlices = slices.length !== block.items.length
    const breakAfter = ({ item, sourceIndex, isLast }: TheoryLayoutSlice) =>
      isLast && (item.theoryPageBreakAfter || block.tcfPageBreakAfter?.[sourceIndex])
    let start = 0
    let overhead = block.items.some((item) => item.layout === 'theory') ? 16 : 84 * fontScale
    const append = (end: number) => {
      const slice = slices.slice(start, end)
      const offset = slice[0]?.sourceIndex ?? 0
      blocks.push({
        ...block,
        ...headingForSlice(block, start, block.items),
        sourceBlockIndex: blockIndex,
        itemOffset: offset,
        items: slice.map(({ item }) => item),
        ...(hasSlices ? {
          logistiqueTheorySlices: slice.map(({ sourceIndex, theoryBlock, isLast }) => ({ sourceIndex, theoryBlock, isLast })),
        } : {}),
        ...(wrappedFigures.size ? {
          logistiqueWrappedFigures: [...wrappedFigures].filter((index) => index >= start && index + 1 < end)
            .map((index) => index - start),
        } : {}),
        problemDraftGrids: block.problemDraftGrids?.slice(offset, (slice.at(-1)?.sourceIndex ?? -1) + 1),
      })
      start = end
      overhead = 0
    }
    const heights = slices.map(({ item, theoryBlock }) => height(theoryBlock ? { ...item, theoryBlock } : item, a5, fontScale))
    const wrappedFigures = new Set<number>()
    for (let index = 0; index + 1 < slices.length; index++) {
      const slice = slices[index]!
      const image = slice.item.theoryBlock
      const prose = slices[index + 1]!.item.theoryBlock
      if (!image || !prose || breakAfter(slice)) continue
      const wrapped = wrappedFigureHeight(image, prose, a5, fontScale)
      if (wrapped === undefined || (a5 && wrapped > a5ItemLimit)) continue
      wrappedFigures.add(index)
      heights[index] = wrapped
      heights[++index] = 0
    }
    const withFollowing = [...heights]
    for (let index = slices.length - 2; index >= 0; index--) {
      const slice = slices[index]!
      if (slice.item.theoryBlock?.kind === 'heading' && !breakAfter(slice)) {
        withFollowing[index]! += withFollowing[index + 1]!
      }
    }
    for (const [index, slice] of slices.entries()) {
      const itemHeight = heights[index]!
      if (!wrappedFigures.has(index - 1) && used > 0 && used + overhead + withFollowing[index]! > budget()) {
        const previousHeight = heights[index - 1] ?? 0
        const balanceLastQuestion = !slice.item.theoryBlock && index === slices.length - 1 && index - start >= 3
          && previousHeight + itemHeight <= budget(pages.length + 1)
        if (index > start) append(balanceLastQuestion ? index - 1 : index)
        flush()
        if (balanceLastQuestion) used = previousHeight
      }
      used += overhead + itemHeight
      overhead = 0
      if (breakAfter(slice)) {
        append(index + 1)
        flush()
      }
    }
    if (start < slices.length || slices.length === 0) append(slices.length)
  }
  flush()
  return pages.length ? pages : [page]
}

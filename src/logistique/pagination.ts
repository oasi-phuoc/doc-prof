import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import { headingForSlice } from '@/math/page-break-heading'
import type { MathItem, WorksheetBlock, WorksheetPage } from '@/math/types'

export type LogistiquePageLayout = {
  a5?: boolean
  hideChrome?: boolean
  fontScale?: number
  evaluation?: boolean
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
  const table = item.logistiqueTable
  if (a5 && table) scale = Math.min(1.125, scale)
  const width = (a5 ? 53 : 72) / scale
  const glossaryFigure = item.logistiqueGlossaryFigure
  const entry = item.logistiqueGlossaryEntry
  if (entry) {
    const lines = (text: string, columns: number) => lineCount(text.replace(/\{\/?g\}/g, ''), columns / scale)
    const termHeight = lines(entry.term, a5 ? 15 : 17) * (a5 ? 20 : 23) * scale
    const definitionHeight = lines(entry.definition, a5 ? 33 : 42) * (a5 ? 20 : 23) * scale
    const caption = glossaryFigure?.caption
    const captionHeight = caption ? 4 + lines(caption, a5 ? 18 : 21) * (a5 ? 14 : 16) * scale : 0
    const wrappingReserve = Math.max(0, scale - 1) * 24
    return (a5 ? 10 : 11) + wrappingReserve + Math.max(termHeight, definitionHeight, (a5 ? 61 : 76) + captionHeight)
  }
  if (glossaryFigure && item.theoryBlock) {
    const diagram = glossaryFigure.src.includes('-schema-')
    const textHeight = theoryHeight(item.theoryBlock, width * (diagram ? 1 : 0.67), scale)
    const caption = glossaryFigure.caption
    const captionHeight = caption ? lineCount(caption, width * (diagram ? 0.65 : 0.24)) * 18 * scale : 0
    return diagram ? 153 + textHeight + captionHeight : Math.max(a5 ? 84 : 105, textHeight) + captionHeight
  }
  if (a5 && (item.theoryBlock?.kind === 'table' || item.theoryBlock?.kind === 'list')) {
    return a5TheoryHeight(item.theoryBlock, scale)
  }
  if (item.theoryBlock) return theoryHeight(item.theoryBlock, width, scale)
  const image = item.logistiqueImage
  const captionColumns = image ? Math.max(8, (image.width - 12) / (7 * scale)) : 1
  const imageHeight = image ? (a5 ? 99 : 136) + (image.caption ? lineCount(image.caption, captionColumns) * 17 * scale : 0) : 0
  if (item.logistiqueGaps) {
    const prompt = lineCount((item.prompt ?? '').replace(/_{3,}|_ _ _/g, '                 '), width) * 26 * scale
    const words = item.logistiqueGaps.words
    return imageHeight + 32 + prompt + (words?.length ? 34 + lineCount(words.join(' · '), width * 0.87) * 26 * scale : 0)
  }
  const promptWidth = a5 || item.calcAnswer || table ? width * 1.2 : width
  const prompt = lineCount(item.prompt ?? '', promptWidth) * 24 * scale
  const answer = lineCount(item.answer, width * 0.84) * 27 * scale
  const columnWidth = table ? Math.max(4, width / table.headers.length - 2) : 1
  const tableHeight = table ? 8 + [table.headers, ...table.rows].reduce((sum, row) => {
    const lines = row.map((cell) => lineCount(typeof cell === 'string' ? cell : cell.answer, columnWidth))
    return sum + (a5 ? 5 : 9) + (a5 ? 20 : 23) * scale * Math.max(...lines)
  }, 0) + (a5 ? 0 : Math.max(0, scale - 1) * 100) : 0
  if (item.calcAnswer) {
    // Même un énoncé court conserve la grille, le trait et leurs espacements.
    const minimum = (a5 ? 183 : 248) + (scale - 1) * 56
    const calculations = table ? lineCount(item.calcAnswer, width) * 18 * scale : 0
    return imageHeight + tableHeight + Math.max(minimum, (a5 ? 145 : 174) + prompt + answer, calculations + prompt + answer + 36)
  }
  const spacing = a5 || table ? 48 : 58
  return imageHeight + tableHeight + spacing + prompt + answer + (item.options?.length ?? 0) * 22 * scale
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
    const glossary = block.items.length > 0 && block.items.every((item) => item.logistiqueGlossaryEntry)
    const glossaryHeadingHeight = glossary ? (a5 ? 29 : 34) + (fontScale - 1) * 45 : 0
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
    let overhead = glossary ? glossaryHeadingHeight : block.items.some((item) => item.layout === 'theory') ? 16 : 84 * fontScale
    const append = (end: number) => {
      const slice = slices.slice(start, end)
      const offset = slice[0]?.sourceIndex ?? 0
      blocks.push({
        ...block,
        ...headingForSlice(block, start, block.items),
        sourceBlockIndex: blockIndex,
        itemOffset: offset,
        items: slice.map(({ item }) => item),
        ...(glossary ? { logistiqueGlossaryLength: block.items.length } : {}),
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
        overhead = glossary ? glossaryHeadingHeight : overhead
        if (balanceLastQuestion) used = previousHeight
      }
      used += overhead + itemHeight
      overhead = 0
      if (breakAfter(slice)) {
        append(index + 1)
        flush()
        overhead = glossaryHeadingHeight
      }
    }
    if (start < slices.length || slices.length === 0) append(slices.length)
  }
  flush()
  return pages.length ? pages : [page]
}

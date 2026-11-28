import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import { headingForSlice } from '@/math/page-break-heading'
import { isWrittenProblem } from '@/math/problem-help'
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
const A5_CONTENT = 654
const A5_HEADER = 275

function lineCount(text: string, width: number): number {
  return text.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / width)), 0)
}

function splitNarrative(text: string, width: number, limit: number): string[] {
  const chunks: string[] = []
  let chunk = ''
  for (const part of text.match(/[^\s]{1,64}[^\S\n]*|\n|[^\S\n]+/g) ?? []) {
    if (chunk.trim() && lineCount((chunk + part).trim(), width) > limit) {
      chunks.push(chunk.trim())
      chunk = ''
    }
    chunk += part
  }
  if (chunk.trim()) chunks.push(chunk.trim())
  return chunks
}

type A5TheoryBlock = Extract<GrammarTheoryBlock, { kind: 'table' | 'list' | 'examples' }>
type TheoryLayoutSlice = { item: MathItem; sourceIndex: number; theoryBlock?: A5TheoryBlock; isLast: boolean }

function a5TheoryHeight(block: A5TheoryBlock, scale: number) {
  if (block.kind === 'list') {
    return 40 + block.items.reduce((sum, text) => sum + 8 +
      27 * scale * lineCount(text.replace(/\{\/?g\}/g, ''), 47 / scale), 0)
  }
  if (block.kind === 'examples') {
    return theoryHeight(block, 47.7 / scale, scale, true)
  }
  const columns = Math.max(block.headers.length, ...block.rows.map((row) => row.length), 1)
  const width = 52 / scale
  const rows = block.colHeader !== false && block.headers.some(Boolean) ? [block.headers, ...block.rows] : block.rows
  return 14 + rows.reduce((sum, row) => sum + 8 +
    24 * scale * Math.max(1, ...row.map((cell, index) => {
      const column = block.widths?.[index]
      const percentage = typeof column === 'number' ? column
        : typeof column === 'string' && /^\d+(?:\.\d+)?%$/.test(column) ? Number.parseFloat(column) : 100 / columns
      return lineCount(cell.replace(/\{\/?g\}/g, ''), Math.max(5, width * percentage / 100 - 2))
    })), 0)
}

function splitA5Theory(block: A5TheoryBlock, maxHeight: number, scale: number): A5TheoryBlock[] {
  const count = block.kind === 'table' ? block.rows.length : block.items.length
  if (count < 2 || a5TheoryHeight(block, scale) <= maxHeight) return [block]
  const segment = (start: number, end: number): A5TheoryBlock => {
    if (block.kind === 'table') return { ...block, rows: block.rows.slice(start, end) }
    if (block.kind === 'list') return { ...block, items: block.items.slice(start, end) }
    return { ...block, items: block.items.slice(start, end) }
  }
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

function measureWrappedFigure(caption: string, paragraphs: string[], a5: boolean, scale: number) {
  const width = (a5 ? 53 : 72) / scale
  const figure = (a5 ? 127 : 149) + lineCount(caption, width * 0.39) * 17 * scale
  const lineHeight = 26 * scale
  const narrowWidth = width * 0.64
  let textHeight = 0
  paragraphs.forEach((text, index) => {
    if (index > 0) textHeight += 6 * scale
    const remainingLines = Math.max(0, Math.ceil((figure - textHeight) / lineHeight))
    const beside = Math.min(remainingLines, lineCount(text, narrowWidth))
    const below = text.slice(Math.floor(beside * narrowWidth))
    textHeight += (beside + (below ? lineCount(below, width) : 0)) * lineHeight
  })
  return { height: 12 + Math.max(figure, textHeight), roomBeside: textHeight < figure + lineHeight }
}

function theoryHeight(block: GrammarTheoryBlock, width: number, scale: number, a5 = false): number {
  const lines = (text: string, columns = width) => lineCount(text.replace(/\{\/?g\}/g, ''), columns) * 26 * scale
  switch (block.kind) {
    case 'heading':
      return 12 + (block.sub ? 28 : 32) * scale * lineCount(block.text, width * 0.8)
    case 'image':
      if (block.src.includes('log-103-objectifs-schema-')) return (a5 ? 250 : 295) + lines(block.caption)
      return (block.src.includes('-carte-') ? (a5 ? 219 : 265) : a5 ? 190 : 184) + lines(block.caption, a5 ? width * 0.9 : width)
    case 'image-row': {
      const cellWidth = width * 0.9 / block.cells.length
      const captionHeight = block.caption ? 4 + lines(block.caption) : 0
      return (a5 ? 151 : 143) + captionHeight + Math.max(...block.cells.map(({ caption, description, example }) =>
        lines(caption, cellWidth) + (description ? lines(description, cellWidth) : 0) + (example ? lines(example, cellWidth) : 0)))
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
    case 'practice':
      return 22 + lines(block.instruction) + block.items.reduce((sum, item) => sum +
        lines(item.prompt, width * 0.9) + lines(item.explanation, width * 0.9), 0)
    case 'table':
      return 18 + [block.headers, ...block.rows].reduce((sum, row) => sum + 14 +
        Math.max(...row.map((cell) => lines(cell, width * 0.84 / row.length))), 0)
    case 'section':
      return 58 + block.blocks.reduce((sum, child) => sum + theoryHeight(child, width, scale, a5), 0)
    case 'examples':
      return 30 + block.items.reduce((sum, item) => sum + (typeof item === 'string' ? lines(item) :
        lines(item.text) + (a5 && item.wrong ? lines(item.wrong) : 0)), 0)
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
    const photo = glossaryFigure?.src.includes('-photo-')
    const imageHeight = a5 ? (photo ? 86 : 61) : (photo ? 116 : 76)
    return (a5 ? 10 : 11) + wrappingReserve + Math.max(termHeight, definitionHeight, imageHeight + captionHeight)
  }
  if (glossaryFigure && item.theoryBlock) {
    const diagram = glossaryFigure.src.includes('-schema-')
    const textHeight = theoryHeight(item.theoryBlock, width * (diagram ? 1 : 0.67), scale, a5)
    const caption = glossaryFigure.caption
    const captionHeight = caption ? lineCount(caption, width * (diagram ? 0.65 : 0.24)) * 18 * scale : 0
    return diagram ? 153 + textHeight + captionHeight : Math.max(a5 ? 84 : 105, textHeight) + captionHeight
  }
  const theory = item.theoryBlock
  if (a5 && (theory?.kind === 'table' || theory?.kind === 'list' || theory?.kind === 'examples')) {
    return a5TheoryHeight(theory, scale)
  }
  if (item.theoryBlock) return theoryHeight(item.theoryBlock, a5 ? width * 0.9 : width, scale, a5)
  const image = item.logistiqueImage
  const captionColumns = image ? Math.max(8, (image.width - 12) / (7 * scale)) : 1
  const imageHeight = image ? (a5 ? 99 : 136) + (image.caption ? lineCount(image.caption, captionColumns) * 17 * scale : 0) : 0
  const narrativeHeight = item.logistiqueNarrative
    ? 8 + lineCount(item.logistiqueNarrative, width * 1.2) * 18 * scale : 0
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
  if (isWrittenProblem(item)) {
    // Même un énoncé court conserve la grille, le trait et leurs espacements.
    const minimum = (a5 ? 183 : 248) + (scale - 1) * 56
    const calculations = item.calcAnswer && (!a5 || table || item.logistiqueLocalModule)
      ? lineCount(item.calcAnswer, width) * 18 * scale : 0
    return imageHeight + tableHeight + narrativeHeight +
      Math.max(minimum, (a5 ? 145 : 174) + prompt + answer, calculations + prompt + answer + 36)
  }
  const spacing = a5 || table ? 48 : 58
  const choice = item.logistiqueChoice
  if (choice?.kind === 'multiple') {
    const choicesHeight = item.options?.reduce((total, text) => total + (13 + 19 * lineCount(text, width * 0.8)) * scale, 0) ?? 0
    return imageHeight + spacing + prompt + choicesHeight + 21 * scale
  }
  if (choice?.kind === 'true-false') {
    const justification = choice.justification === undefined ? 0
      : Math.max(3, lineCount(choice.justification, width)) * 25 * scale
    return imageHeight + spacing + prompt + 37 * scale + justification
  }
  const lines = item.logistiqueResponseLines
  const responseHeight = lines?.kind === 'numbered'
    ? lines.answers.reduce((total, text) => total + (8 + 26 * lineCount(text, width * 0.83)) * scale, 0)
    : lines?.kind === 'simple' ? Math.max(lines.count * 27 * scale, answer) : answer
  const choicesHeight = item.options?.reduce((total, text) => total + (9 + 23 * lineCount(text, width * 0.8)) * scale, 0) ?? 0
  return imageHeight + tableHeight + narrativeHeight + spacing + prompt + responseHeight + choicesHeight
}

/** Enchaîne les questions dans l’espace disponible et respecte les sauts manuels. */
export function splitLogistiquePages(
  page: WorksheetPage,
  { a5 = false, hideChrome = false, fontScale = 1, evaluation = false, firstPageHasHeader = true }:
    LogistiquePageLayout & { firstPageHasHeader?: boolean } = {},
): WorksheetPage[] {
  if (a5 && evaluation && page.items.some((item) => item.logistiqueNarrative)) {
    fontScale = Math.min(fontScale, 1)
  }
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
      if (a5 && (theory?.kind === 'table' || theory?.kind === 'list' || theory?.kind === 'examples' && theory.marker !== 'numeros')) {
        const fragments = splitA5Theory(theory, a5ItemLimit, fontScale)
        if (fragments.length > 1) {
          return fragments.map((theoryBlock, index) => ({ item, sourceIndex, theoryBlock, isLast: index === fragments.length - 1 }))
        }
      }
      return [{ item, sourceIndex, theoryBlock: undefined, isLast: true }]
    })
    const hasSlices = slices.length !== block.items.length
    const detachedNarratives = new Map<number, string[]>()
    if (evaluation) {
      for (const { item, sourceIndex } of slices) {
        const text = item.logistiqueNarrative
        const width = (a5 ? 53 : 65) / fontScale
        if (text && lineCount(text, width) > (a5 ? 3 : 9)) {
          detachedNarratives.set(sourceIndex, splitNarrative(text, width, a5 ? 8 : 16))
        }
      }
    }
    // L’estimation par caractères laisse une marge aux retours réels et au corrigé imprimé.
    const questionReserve = block.items.some((item) => item.layout !== 'theory')
      ? 12 + (!a5 ? Math.max(0, fontScale - 1) * 200 : 0)
      : 0
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
        logistiqueSourceItemCount: block.items.length,
        itemOffset: offset,
        items: slice.map(({ item }) => item),
        ...(detachedNarratives.size ? {
          logistiqueDetachedNarratives: slice.flatMap(({ sourceIndex }) => detachedNarratives.has(sourceIndex) ? [sourceIndex] : []),
        } : {}),
        ...(glossary ? { logistiqueGlossaryLength: block.items.length } : {}),
        ...(hasSlices ? {
          logistiqueTheorySlices: slice.map(({ sourceIndex, theoryBlock, isLast }) => ({ sourceIndex, theoryBlock, isLast })),
        } : {}),
        ...(wrappedFigures.length ? {
          logistiqueWrappedFigures: wrappedFigures.filter((figure) => figure.start >= start && figure.end <= end)
            .map((figure) => ({ start: figure.start - start, end: figure.end - start })),
        } : {}),
        problemDraftGrids: block.problemDraftGrids?.slice(offset, (slice.at(-1)?.sourceIndex ?? -1) + 1),
      })
      start = end
      overhead = 0
    }
    const heights = slices.map(({ item, sourceIndex, theoryBlock }) => {
      const printable = theoryBlock ? { ...item, theoryBlock }
        : detachedNarratives.has(sourceIndex) ? { ...item, logistiqueNarrative: undefined } : item
      const base = height(printable, a5, fontScale)
      if (!evaluation || item.layout === 'theory' || item.noPoints) return base
      const criteria = item.logistiqueAssessment?.criteria
      return base + (criteria ? lineCount(criteria, (a5 ? 48 : 65) / fontScale) * 19 * fontScale + 7 : 0) + 16 * fontScale
    })
    const wrappedFigures: { start: number; end: number }[] = []
    const wrappedParagraphs = new Set<number>()
    for (let index = 0; index + 1 < slices.length; index++) {
      const slice = slices[index]!
      const image = slice.item.theoryBlock
      if (image?.kind !== 'image' || !/-photo-v\d+\.webp$/i.test(image.src) || breakAfter(slice) || (a5 && fontScale > 1.15)) continue
      const paragraphs: string[] = []
      let estimate: number | undefined
      for (let next = index + 1; next < slices.length && !breakAfter(slices[next - 1]!); next++) {
        const prose = slices[next]!.item.theoryBlock
        if (prose?.kind !== 'paragraph') break
        paragraphs.push(prose.text.replace(/\{\/?g\}/g, ''))
        const measure = measureWrappedFigure(image.caption, paragraphs, a5, fontScale)
        if (a5 && measure.height > a5ItemLimit) {
          paragraphs.pop()
          break
        }
        estimate = measure.height
        if (!measure.roomBeside) break
      }
      if (estimate === undefined || paragraphs.join('').length < 85) continue
      const end = index + 1 + paragraphs.length
      wrappedFigures.push({ start: index, end })
      heights[index] = estimate
      for (let next = index + 1; next < end; next++) {
        wrappedParagraphs.add(next)
        heights[next] = 0
      }
      index = end - 1
    }
    const withFollowing = [...heights]
    for (let index = slices.length - 2; index >= 0; index--) {
      const slice = slices[index]!
      if (slice.item.theoryBlock?.kind === 'heading' && !breakAfter(slice)) {
        withFollowing[index]! += withFollowing[index + 1]!
      }
    }
    for (const [index, slice] of slices.entries()) {
      const narrative = detachedNarratives.get(slice.sourceIndex)
      if (narrative) {
        if (index > start) append(index)
        flush()
        for (const [part, text] of narrative.entries()) {
          blocks.push({
            ...block, sourceBlockIndex: blockIndex, itemOffset: slice.sourceIndex,
            title: part === 0 ? 'Contexte de l’histoire' : 'Contexte de l’histoire, suite',
            instruction: '', items: [], pointsPerQuestion: 0, pointsWeights: undefined,
            document: { kind: 'written', text },
            logistiqueDetachedNarratives: [slice.sourceIndex],
          })
          flush()
        }
      }
      const itemHeight = heights[index]!
      if (!wrappedParagraphs.has(index) && used > 0 && used + overhead + withFollowing[index]! + questionReserve > budget()) {
        const previousHeight = heights[index - 1] ?? 0
        const balanceLastQuestion = !slice.item.theoryBlock && index === slices.length - 1 && index - start >= 3
          && previousHeight + itemHeight + questionReserve <= budget(pages.length + 1)
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

import type { ExerciseBlock, PageConfig } from './types'

export function blockFromPage(page: PageConfig): ExerciseBlock {
  return {
    topic: page.topic,
    exerciseType: page.exerciseType,
    difficulty: page.difficulty,
    count: page.count,
    columns: page.columns,
    track: page.track,
    verbGroup: page.verbGroup,
    problemDraftGrids: page.problemDraftGrids,
    oralAnswerModes: page.oralAnswerModes,
    continueOnNextPage: page.continueOnNextPage,
    coordLibre: page.coordLibre,
    coordCols: page.coordCols,
    coordRows: page.coordRows,
    coordAxis: page.coordAxis,
    coordMarks: page.coordMarks,
    coordRange: page.coordRange,
    coordCellMm: page.coordCellMm,
    coordUnitSquares: page.coordUnitSquares,
    coordOriginCol: page.coordOriginCol,
    coordOriginRow: page.coordOriginRow,
    numberLibre: page.numberLibre,
    numberMin: page.numberMin,
    numberMax: page.numberMax,
    numberDecimals: page.numberDecimals,
    quadLibre: page.quadLibre,
    quadShapes: page.quadShapes,
    vocabRows: page.vocabRows,
    vocabCols: page.vocabCols,
    vocabSelected: page.vocabSelected,
    vocabSubgroup: page.vocabSubgroup,
    vocabCustomEntries: page.vocabCustomEntries,
    vocabLineCh: page.vocabLineCh,
    gameEntries: page.gameEntries,
    gameText: page.gameText,
    gameSource: page.gameSource,
    gameTopic: page.gameTopic,
    gameSelectedIds: page.gameSelectedIds,
    gameBackColor: page.gameBackColor,
    gameSeriesName: page.gameSeriesName,
  }
}

export function pageBlocks(page: PageConfig): ExerciseBlock[] {
  return [blockFromPage(page), ...(page.extraBlocks ?? [])]
}

export function pageAsConfig(page: PageConfig, block: ExerciseBlock): PageConfig {
  return { ...page, ...block, extraBlocks: undefined }
}

export function setPageBlock(page: PageConfig, blockIndex: number, patch: Partial<ExerciseBlock>): PageConfig {
  if (blockIndex <= 0) {
    const next = { ...page, ...patch }
    if (patch.topic != null || patch.exerciseType != null) {
      return next
    }
    return next
  }
  const extra = [...(page.extraBlocks ?? [])]
  const index = blockIndex - 1
  const current = extra[index]
  if (!current) return page
  extra[index] = { ...current, ...patch }
  return { ...page, extraBlocks: extra }
}

export function replacePageBlock(page: PageConfig, blockIndex: number, block: ExerciseBlock): PageConfig {
  if (blockIndex <= 0) {
    return { ...page, ...block }
  }
  const extra = [...(page.extraBlocks ?? [])]
  extra[blockIndex - 1] = block
  return { ...page, extraBlocks: extra }
}

export function addPageBlock(page: PageConfig, block: ExerciseBlock): PageConfig {
  return { ...page, extraBlocks: [...(page.extraBlocks ?? []), block] }
}

export function removePageBlock(page: PageConfig, blockIndex: number): PageConfig {
  const blocks = pageBlocks(page)
  if (blocks.length <= 1 || blockIndex < 0 || blockIndex >= blocks.length) return page
  const remaining = blocks.filter((_, index) => index !== blockIndex)
  const [first, ...extra] = remaining
  if (!first) return page
  return { ...page, ...first, extraBlocks: extra.length ? extra : undefined }
}

export function exerciseStartIndex(pages: PageConfig[], pageIndex: number): number {
  return pages.slice(0, pageIndex).reduce((sum, page) => sum + pageBlocks(page).length, 1)
}

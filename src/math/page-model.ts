import type { ExerciseBlock, PageConfig } from './types'

export function blockFromPage(page: PageConfig): ExerciseBlock {
  return {
    libreId: page.libreId,
    a5RightLibre: page.a5RightLibre,
    logistiqueBankRevision: page.logistiqueBankRevision,
    logistiqueTheoryView: page.logistiqueTheoryView,
    logistiqueSelection: page.logistiqueSelection,
    logistiqueEvaluation: page.logistiqueEvaluation,
    logistiqueGapMode: page.logistiqueGapMode,
    logistiquePresentation: page.logistiquePresentation,
    topic: page.topic,
    exerciseType: page.exerciseType,
    mathTheoryStepNumbering: page.mathTheoryStepNumbering,
    difficulty: page.difficulty,
    count: page.count,
    columns: page.columns,
    questionGapPx: page.questionGapPx,
    columnGapPx: page.columnGapPx,
    exerciseNo: page.exerciseNo,
    pointsPerQuestion: page.pointsPerQuestion,
    track: page.track,
    verbGroup: page.verbGroup,
    phrasePolarity: page.phrasePolarity,
    phraseSentenceType: page.phraseSentenceType,
    phraseVoice: page.phraseVoice,
    phraseCategories: page.phraseCategories,
    phraseImageLabels: page.phraseImageLabels,
    phraseImageShownCategories: page.phraseImageShownCategories,
    contentSeed: page.contentSeed,
    contentSeedTwin: page.contentSeedTwin,
    phraseItems: page.phraseItems,
    phraseInstruction: page.phraseInstruction,
    problemDraftGrids: page.problemDraftGrids,
    problemHelp: page.problemHelp,
    sionMapBackground: page.sionMapBackground,
    realMapId: page.realMapId,
    formulaireLetterGrid: page.formulaireLetterGrid,
    inlineBlankPx: page.inlineBlankPx,
    oralAnswerModes: page.oralAnswerModes,
    grammarCoLevel: page.grammarCoLevel,
    grammarCoAudioId: page.grammarCoAudioId,
    grammarCoFormat: page.grammarCoFormat,
    grammarVocabRecall: page.grammarVocabRecall,
    completionPresentation: page.completionPresentation,
    grammarLevel: page.grammarLevel,
    grammarActivityId: page.grammarActivityId,
    grammarPresentation: page.grammarPresentation,
    grammarBankRevision: page.grammarBankRevision,
    grammarSnapshot: page.grammarSnapshot,
    grammarPreview: page.grammarPreview,
    grammarDocumentCount: page.grammarDocumentCount,
    grammarPageBreakAfterQuestionIds: page.grammarPageBreakAfterQuestionIds,
    tcfFormModes: page.tcfFormModes,
    tcfPageBreakAfter: page.tcfPageBreakAfter,
    tcfQuestionPageBreakBefore: page.tcfQuestionPageBreakBefore,
    continueOnNextPage: page.continueOnNextPage,
    coordLibre: page.coordLibre,
    coordQuestionsLibre: page.coordQuestionsLibre,
    coordCols: page.coordCols,
    coordRows: page.coordRows,
    coordAxis: page.coordAxis,
    coordSymmetryAxis: page.coordSymmetryAxis,
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
    numberDecimalPlaces: page.numberDecimalPlaces,
    numberSecondDecimalPlaces: page.numberSecondDecimalPlaces,
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
    gameBorderId: page.gameBorderId,
    gameBorderRectoId: page.gameBorderRectoId,
    gameBorderVersoId: page.gameBorderVersoId,
    gameFontSize: page.gameFontSize,
    gameAlpha: page.gameAlpha,
    soutienMotsLibre: page.soutienMotsLibre,
    soutienMotsEntries: page.soutienMotsEntries,
    soutienCompleterLibre: page.soutienCompleterLibre,
    soutienCompleterEntries: page.soutienCompleterEntries,
    calliText: page.calliText,
    calliFont: page.calliFont,
    calliSize: page.calliSize,
    tcfExercise: page.tcfExercise,
    tcfBankId: page.tcfBankId,
    tcfCeFormat: page.tcfCeFormat,
    tcfCeTextFont: page.tcfCeTextFont,
    tcfScenario: page.tcfScenario,
    tcfAudioSlots: page.tcfAudioSlots,
    tcfQuestionCount: page.tcfQuestionCount,
    tcfQuestionPoints: page.tcfQuestionPoints,
    tcfAudioPickMode: page.tcfAudioPickMode,
    tcfPointsDetail: page.tcfPointsDetail,
    libreItems: page.libreItems,
    libreInstruction: page.libreInstruction,
    logiqueIds: page.logiqueIds,
    countShapeScale: page.countShapeScale,
    countIconTotal: page.countIconTotal,
    geoFigureHelp: page.geoFigureHelp,
    deniseRate: page.deniseRate,
  }
}

export function pageBlocks(page: PageConfig): ExerciseBlock[] {
  return [blockFromPage(page), ...(page.extraBlocks ?? [])]
}

export function pageAsConfig(page: PageConfig, block: ExerciseBlock): PageConfig {
  return { ...page, ...block, logistiqueBankRevision: block.logistiqueBankRevision, logistiqueTheoryView: block.logistiqueTheoryView, logistiqueSelection: block.logistiqueSelection, logistiqueEvaluation: block.logistiqueEvaluation, logistiqueGapMode: block.logistiqueGapMode, logistiquePresentation: block.logistiquePresentation, phraseCategories: block.phraseCategories, phraseImageLabels:block.phraseImageLabels, phraseImageShownCategories:block.phraseImageShownCategories, phraseSentenceType:block.phraseSentenceType, phraseVoice:block.phraseVoice, grammarCoLevel: block.grammarCoLevel, grammarCoAudioId: block.grammarCoAudioId,
    grammarCoFormat: block.grammarCoFormat, grammarVocabRecall: block.grammarVocabRecall, completionPresentation: block.completionPresentation,
    grammarLevel:block.grammarLevel,grammarActivityId:block.grammarActivityId,grammarPresentation:block.grammarPresentation,
    grammarBankRevision:block.grammarBankRevision,grammarSnapshot:block.grammarSnapshot,grammarPreview:block.grammarPreview,
    grammarDocumentCount:block.grammarDocumentCount,grammarPageBreakAfterQuestionIds:block.grammarPageBreakAfterQuestionIds,
    realMapId: block.realMapId, mathTheoryStepNumbering: block.mathTheoryStepNumbering, extraBlocks:undefined }
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

/** Fige les numéros affichés (1, 2, 3…) pour qu’un retrait ne décale pas les autres. */
export function stampExerciseNumbers(page: PageConfig, numbers: number[]): PageConfig {
  const blocks = pageBlocks(page).map((block, index) => {
    const exerciseNo = numbers[index] ?? block.exerciseNo
    return exerciseNo != null ? { ...block, exerciseNo } : block
  })
  const [first, ...extra] = blocks
  if (!first) return page
  return { ...page, ...first, domain: page.domain, extraBlocks: extra.length ? extra : undefined }
}

export function removePageBlock(
  page: PageConfig,
  blockIndex: number,
  /** Numéros affichés, pour que les exercices restants gardent le leur. */
  numbers?: number[],
): PageConfig {
  const blocks = numbers ? pageBlocks(stampExerciseNumbers(page, numbers)) : pageBlocks(page)
  if (blocks.length <= 1 || blockIndex < 0 || blockIndex >= blocks.length) return page
  const remaining = blocks.filter((_, index) => index !== blockIndex)
  const [first, ...extra] = remaining
  if (!first) return page
  const next: PageConfig = {
    ...page,
    ...first,
    domain: page.domain,
    extraBlocks: extra.length ? extra : undefined,
  }
  // Ne pas laisser les réglages de l’exercice retiré (mode libre, etc.) sur celui qui prend sa place.
  const owned = blockFromPage(page)
  for (const key of Object.keys(owned) as (keyof ExerciseBlock)[]) {
    if (first[key] === undefined) delete next[key]
  }
  return next
}

export function exerciseStartIndex(pages: PageConfig[], pageIndex: number): number {
  return pages.slice(0, pageIndex).reduce((sum, page) => sum + pageBlocks(page).length, 1)
}

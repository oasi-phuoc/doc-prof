import { grammarPageBreakQuestionId } from '@/grammaire/curriculum/pagination'
import { generateGrammarSelection, grammarCutIds, grammarRequestKey, grammarSelectionCount, withGrammarQuestions } from '@/grammaire/curriculum/generate'
import { GrammarCurriculumError } from '@/grammaire/curriculum/types'
import { useEffect, type Dispatch, type SetStateAction } from 'react'
import {
  clearLibreContentFreeze,
  cycleOralMode,
  isOralComprehensionExercise,
  isProblemExercise,
  resizeDraftGrids,
  resizeOralAnswerModes,
} from '@/components/generator/page-helpers'
import { isInlineArithmetic, isIndependentListProfile, liveEditorProfile, opensWithoutOverlay, writesNativePayload } from '@/components/generator/libre/profiles'
import { hasLockedItems, identifyItems, trimUnlockedItems } from '@/components/generator/libre/flat-items'
import { gridCells, withGridCells } from '@/components/generator/libre/word-list'
import { listenRows, replaceListenRows, resizeListenRows } from '@/components/generator/libre/listen-rows'
import { syllableRows, replaceSyllableRows } from '@/components/generator/libre/syllable-rows'
import {
  countSoundRows,
  determinantRows,
  phraseScrambleRows,
  replaceCountSoundRows,
  replaceDeterminantRows,
  replacePhraseScrambleRows,
} from '@/components/generator/libre/soutien-phrase-rows'
import type { SpacingPreferences } from '@/components/generator/libre/preferences'
import { blockItemsForConfig } from '@/components/generator/sheet-items'
import { defaultCoordQuestionReply } from '@/components/generator/WorksheetSheet'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import {
  resizeCoordQuestionsLibre,
} from '@/math/CoordQuestionsLibreEditor'
import {
  isReperageCadrans,
  isReperageComposer,
  isReperageConstruire,
  isReperageDroites,
  resolveAxesGrid,
} from '@/math/coord-reperage'
import {
  isTransformationExercise,
  resizeTransformationPoints,
  transformationAxis,
  transformationPoints,
} from '@/math/coord-transformations'
import { buildPage } from '@/math/generate'
import { mathGlossaryBank } from '@/math/glossary-banks'
import { createRng } from '@/math/rng'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { parseSoutienType } from '@/francais/soutien/kinds'
import { soutienBankById } from '@/francais/soutien/banks'
import { SOUTIEN_LISTEN_MAX, SOUTIEN_SYLLABLE_PAIR_MAX } from '@/francais/soutien/gen-kind-helpers'
import { syllableMatchOrder, withSyllablePairs } from '@/francais/soutien/syllable-match'
import { addAudioOrderSeries, audioOrderKind } from '@/francais/soutien/audio-order'
import { isDraftPadExercise } from '@/math/catalog'
import {
  blockFromPage,
  pageBlocks,
  pageAsConfig,
  setPageBlock,
} from '@/math/page-model'
import { isTpmDomain } from '@/tpm/test'
import { isTcmCfrDomain } from '@/tcm-cfr/test'
import type { TcfTypeReponse } from '@/tcf/types'
import type {
  ExerciseBlock,
  MathItem,
  PageConfig,
  WorksheetPage,
} from '@/math/types'

export type UsePageConfigParams = {
  pageIndex: number
  safeBlockIndex: number
  safeSheetIndex: number
  setPages: Dispatch<SetStateAction<PageConfig[]>>
  activeBlock: ExerciseBlock
  activeSheet: WorksheetPage | undefined
  worksheets: WorksheetPage[]
  seed: number
  libreMode: boolean
  inlineArithmetic: boolean
  doubleA5: boolean
  editorProfile: ReturnType<typeof liveEditorProfile>
  spacingForType: (type: string) => SpacingPreferences
  isPhraseDomain: boolean
  isCalliDomain: boolean
  isJeuxDomain: boolean
  isTcf: boolean
}

export function usePageConfig({
  pageIndex,
  safeBlockIndex,
  safeSheetIndex,
  setPages,
  activeBlock,
  activeSheet,
  worksheets,
  seed,
  libreMode,
  inlineArithmetic,
  doubleA5,
  editorProfile,
  spacingForType,
  isPhraseDomain,
  isCalliDomain,
  isJeuxDomain,
  isTcf,
}: UsePageConfigParams) {
  const updatePage = (change: Partial<PageConfig>) => {
    let patch = writesNativePayload(editorProfile, change)
      ? { ...change, libreItems: undefined, libreInstruction: undefined }
      : change
    const releasesTcf = Object.hasOwn(patch, 'tcfExercise') && patch.tcfExercise === undefined
    if (hasLockedItems(activeBlock) && (patch.exerciseType !== undefined || releasesTcf)) {
      if (!window.confirm('Remplacer cette activité et ses questions verrouillées ?')) return
    }
    const count = patch.count
    if (count !== undefined && !patch.exerciseType && !Object.hasOwn(patch, 'coordMarks') &&
        activeBlock.coordLibre && isTransformationExercise(activeBlock.exerciseType)) {
      const item = blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)?.items[0]
      if (item?.coordScene && activeSheet) {
        const points = transformationPoints(item.coordScene)
        const axis = transformationAxis(activeBlock.exerciseType, item)
        const grid = resolveAxesGrid(pageAsConfig(activeSheet, activeBlock))
        const next = resizeTransformationPoints(points, count, axis, grid)
        if (!next) {
          window.alert('Cette quantité ne permet pas de garder une figure valide et son image dans le repère.')
          return
        }
        if (next.length < points.length && !window.confirm('Retirer les derniers sommets de la figure ?')) return
        patch = { ...patch, coordMarks: next, coordSymmetryAxis: axis, libreItems: undefined, libreInstruction: undefined }
      }
    }
    const rightGrid = doubleA5 ? activeBlock.a5RightLibre : undefined
    if (editorProfile === 'association-audio' && activeSheet && count !== undefined &&
      !patch.exerciseType && !patch.libreItems && (activeBlock.libreItems?.length || rightGrid?.items.length)) {
      const parsed = activeSheet.domain === 'alphabetisation' ? parseAlphaType(activeBlock.exerciseType) : parseSoutienType(activeBlock.exerciseType)
      const bank = parsed && soutienBankById(parsed.bankId)
      if (bank && parsed && audioOrderKind(parsed.kind)) {
        const kind = parsed.kind
        const pool = { type1Words: activeBlock.soutienType1Words, excludeWords: activeBlock.soutienExcludeWords }
        const base = seed + pageIndex * 7919 + safeBlockIndex * 10007
        const original = activeBlock.libreItems
        const previousCount = Math.max(original?.length ?? 0, rightGrid?.items.length ?? 0)
        if (count < previousCount && !window.confirm('Retirer les dernières séries d’associations ?')) return
        const primarySeed = activeBlock.contentSeed ?? 0
        const left = original && addAudioOrderSeries(original, count, bank, kind, createRng(base + primarySeed), pool)
        const right = rightGrid && addAudioOrderSeries(rightGrid.items, count, bank, kind,
          createRng(base + (activeBlock.contentSeedTwin ?? primarySeed)), pool)
        if (left === null || right === null) {
          window.alert('La banque ne fournit pas assez d’associations distinctes pour atteindre cette quantité.')
          return
        }
        patch = { ...patch, ...(left ? { libreItems: activeBlock.libreId ? identifyItems(left, activeBlock.libreId) : left } : {}),
          ...(right && rightGrid ? { a5RightLibre: { ...rightGrid, items: identifyItems(right, rightGrid.id) } } : {}) }
      }
    }
    if (isIndependentListProfile(editorProfile) &&
      activeSheet && (activeBlock.libreItems?.length || rightGrid?.items.length) && !patch.libreItems && !patch.exerciseType &&
      (count !== undefined || patch.columns !== undefined)) {
      const nextBlock = { ...activeBlock, ...patch, libreItems: undefined }
      const pageSeed = seed + pageIndex * 7919 + safeBlockIndex * 10007
      const config = pageAsConfig(activeSheet, nextBlock)
      function resizeGrid(previous: MathItem[], localSeed: number) {
        if (editorProfile === 'syllabes-a-relier' && previous[0]?.layout === 'vocab-match') {
          const existing = previous[0]
          const pairs = existing.vocabPairs ?? []
          const target = count ?? pairs.length
          const draw = target > pairs.length ? { ...config, count: SOUTIEN_SYLLABLE_PAIR_MAX } : config
          const next = buildPage(draw, pageSeed + localSeed, 1, seed).items[0]
          if (!next) return { items: previous, removed: false, unavailable: true }
          const kept = pairs.slice(0, target)
          const keys = new Set(kept.map(({ left, right }) => `${left}\0${right}`.toLocaleLowerCase('fr')))
          for (const pair of next.vocabPairs ?? []) {
            if (kept.length >= target) break
            const key = `${pair.left}\0${pair.right}`.toLocaleLowerCase('fr')
            if (keys.has(key)) continue
            keys.add(key)
            kept.push(pair)
          }
          const columns = next.letterGridCols ?? 1
          const order = pairs.length === kept.length && columns === existing.letterGridCols
            ? syllableMatchOrder(existing) : undefined
          return {
            items: [withSyllablePairs(existing, kept, columns, order)],
            removed: target < pairs.length, unavailable: kept.length < target,
          }
        }
        if (editorProfile === 'ecoute-de-mots' && previous[0]?.layout === 'listen-check') {
          const existing = previous[0]
          const rows = listenRows(existing)
          const target = count ?? rows.length
          const draw = target > rows.length ? { ...config, count: SOUTIEN_LISTEN_MAX } : config
          const next = buildPage(draw, pageSeed + localSeed, 1, seed).items[0]
          if (!next) return { items: previous, removed: false, unavailable: true }
          const kept = resizeListenRows(rows, listenRows(next), target)
          return {
            items: [replaceListenRows({ ...existing, letterGridCols: next.letterGridCols }, kept)],
            removed: target < rows.length, unavailable: kept.length < target,
          }
        }
        const generated = buildPage(config, pageSeed + localSeed, 1, seed).items
        const readRows = editorProfile === 'syllabes-audio' ? syllableRows
          : editorProfile === 'sons-a-compter' ? countSoundRows
          : editorProfile === 'determinants' ? determinantRows
          : editorProfile === 'lettres-dans-phrase' ? phraseScrambleRows : gridCells
        const removed = previous.some((item, index) => readRows(item).length > (generated[index] ? readRows(generated[index]!).length : 0))
        const items = generated.map((item, index) => {
          const old = previous[index]
          if (!old || item.layout !== old.layout) return item
          const retained = old
          function keepRows<Row>(read: (value: MathItem) => Row[], replace: (value: MathItem, rows: Row[]) => MathItem) {
            const existing = read(retained)
            return replace({ ...retained, letterGridCols: item.letterGridCols }, read(item).map((row, position) => existing[position] ?? row))
          }
          if (editorProfile === 'syllabes-audio') return keepRows(syllableRows, replaceSyllableRows)
          if (editorProfile === 'sons-a-compter') return keepRows(countSoundRows, replaceCountSoundRows)
          if (editorProfile === 'determinants') return keepRows(determinantRows, replaceDeterminantRows)
          if (editorProfile === 'lettres-dans-phrase') return keepRows(phraseScrambleRows, replacePhraseScrambleRows)
          return keepRows(gridCells, withGridCells)
        })
        return { items, removed }
      }
      const localSeed = nextBlock.contentSeed ?? 0
      const left = activeBlock.libreItems?.length ? resizeGrid(activeBlock.libreItems, localSeed) : undefined
      const right = rightGrid ? resizeGrid(rightGrid.items, nextBlock.contentSeedTwin ?? localSeed) : undefined
      if (left?.unavailable || right?.unavailable) {
        window.alert(editorProfile === 'syllabes-a-relier'
          ? 'La banque ne fournit pas assez de paires distinctes pour atteindre cette quantité.'
          : 'La banque ne fournit pas assez de mots distincts pour atteindre cette quantité.')
        return
      }
      if ((left?.removed || right?.removed) && !window.confirm('Réduire la grille et retirer les dernières cases ?')) return
      patch = { ...patch,
        ...(left ? { libreItems: left.items } : {}),
        ...(rightGrid && right ? { a5RightLibre: { ...rightGrid, items: right.items } } : {}),
      }
    }
    const grammar = activeBlock.grammarSnapshot
    if (editorProfile === 'grammaire-graduee' && grammar?.editedInLibre &&
      Object.keys(patch).length === 1 && (count !== undefined || patch.grammarDocumentCount !== undefined)) {
      const nextBlock = { ...activeBlock, ...patch, grammarSnapshot: undefined }
      const target = grammarSelectionCount(nextBlock)
      const locked = new Set(grammar.libreLockedQuestionIds)
      if (target < locked.size) {
        window.alert(`Il reste ${locked.size} unités verrouillées. Choisissez une quantité compatible ou retirez un verrou.`)
        return
      }
      if (target < grammar.questions.length && !window.confirm('Retirer les dernières unités de grammaire ?')) return
      const removeCount = grammar.questions.length - target
      const removed = new Set(removeCount > 0
        ? grammar.questions.filter(({ id }) => !locked.has(id)).slice(-removeCount).map(({ id }) => id)
        : [])
      const questions = grammar.questions.filter(({ id }) => !removed.has(id))
      if (questions.length < target) {
        try {
          const generated = generateGrammarSelection(nextBlock, grammar.seed)
          const existing = new Set(questions.map(({ id }) => id))
          questions.push(...generated.questions.filter(({ id }) => !existing.has(id)).slice(0, target - questions.length))
        } catch (error) {
          if (!(error instanceof GrammarCurriculumError)) throw error
          window.alert(error.message)
          return
        }
      }
      if (questions.length !== target) {
        window.alert('Cette banque ne fournit pas assez de nouvelles questions pour conserver la sélection actuelle.')
        return
      }
      const snapshot = withGrammarQuestions({ ...grammar, requestKey: grammarRequestKey(nextBlock) }, questions)
      const cutIds = grammarCutIds(snapshot)
      patch = { ...patch, grammarSnapshot: snapshot,
        grammarPageBreakAfterQuestionIds: activeBlock.grammarPageBreakAfterQuestionIds?.filter((id) => cutIds.has(id)) }
    }
    const glossaryBank = mathGlossaryBank(activeBlock.exerciseType)
    const resizesAppliedItems = glossaryBank || inlineArithmetic || editorProfile === 'question-simple' ||
      editorProfile === 'logique-visuelle' || editorProfile === 'mots-dans-l-ordre'
    if (resizesAppliedItems && count != null && patch.libreItems === undefined) {
      const lists = [activeBlock.libreItems ?? [], (doubleA5 ? activeBlock.a5RightLibre?.items : undefined) ?? []]
      const locked = Math.max(...lists.map((items) => items.filter(({ libreLocked }) => libreLocked).length))
      if (count < locked) {
        window.alert(`Il reste ${locked} questions verrouillées. Choisissez au moins ${locked} questions ou déverrouillez-en.`)
        return
      }
      if (lists.some((items) => count < items.length) &&
        !window.confirm(glossaryBank ? 'Retirer les dernières notions de ce glossaire ?' :
          'Retirer les dernières questions déverrouillées de cette activité ?')) return
    }

    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        if (patch.domain != null && patch.exerciseType != null) {
          return { ...page, ...patch, extraBlocks: undefined }
        }
        if (patch.exerciseGapPx !== undefined && Object.keys(patch).length === 1) {
          return { ...page, exerciseGapPx: patch.exerciseGapPx, extraBlocks: page.extraBlocks?.map((block) => ({ ...block, exerciseGapPx: undefined })) }
        }
        const mergedBlock = setPageBlock(
          page,
          safeBlockIndex,
          patch.tcfExercise != null ? { ...patch, tcfFormModes: undefined } : patch,
        )
        const merged =
          patch.tcfExercise != null ? { ...mergedBlock, tcfFormModes: undefined } : mergedBlock
        const nextBlock = pageBlocks(merged)[safeBlockIndex] ?? blockFromPage(merged)
        let fixed = nextBlock
        if (
          patch.exerciseType != null &&
          patch.exerciseType.startsWith('equations-') &&
          !activeBlock.exerciseType.startsWith('equations-') &&
          patch.count == null
        ) {
          fixed = { ...fixed, count: Math.min(fixed.count, 2) }
        }
        if (patch.count != null || patch.exerciseType != null) {
          const count = patch.count ?? fixed.count
          fixed = {
            ...fixed,
            // Changement de type → lever le contenu figé (sinon refresh / type restent bloqués après le mode libre).
            ...(patch.exerciseType != null ? {
              ...clearLibreContentFreeze(), libreId: undefined, questionGapPx: undefined, columnGapPx: undefined,
              coordSymmetryAxis: undefined,
              ...spacingForType(patch.exerciseType),
            } : {}),
            phraseItems: patch.phraseItems!==undefined ? patch.phraseItems : undefined,
            phraseInstruction:
              patch.phraseInstruction!==undefined ? patch.phraseInstruction : patch.phraseItems!==undefined ? fixed.phraseInstruction : undefined,
            problemDraftGrids: isProblemExercise(fixed.exerciseType)
              ? resizeDraftGrids(fixed.problemDraftGrids, count, true)
              : undefined,
            oralAnswerModes: isOralComprehensionExercise(fixed.exerciseType)
              ? resizeOralAnswerModes(fixed.oralAnswerModes, count)
              : undefined,
          }
        }
        if (isReperageCadrans(fixed.exerciseType) && fixed.coordMarks) {
          if (isReperageComposer(fixed.exerciseType)) {
            const given = fixed.coordMarks.filter((mark) => mark.given)
            const others = fixed.coordMarks.filter((mark) => !mark.given).slice(0, Math.max(0, fixed.count))
            fixed = { ...fixed, coordMarks: [...given, ...others] }
          } else {
            fixed = { ...fixed, coordMarks: fixed.coordMarks.slice(0, Math.max(0, fixed.count)) }
          }
        }
        if (
          fixed.coordLibre &&
          (isReperageDroites(fixed.exerciseType) || isReperageConstruire(fixed.exerciseType)) &&
          (patch.count != null || patch.coordLibre != null)
        ) {
          fixed = {
            ...fixed,
            coordQuestionsLibre: resizeCoordQuestionsLibre(
              fixed.coordQuestionsLibre,
              fixed.count,
              defaultCoordQuestionReply(fixed.exerciseType),
            ),
          }
        }
        if (resizesAppliedItems && count != null) {
          const baseSeed = seed + pageIndex * 7919 + safeBlockIndex * 10007
          const config = pageAsConfig(page, { ...fixed, libreItems: undefined })
          function resize(items: MathItem[], localSeed: number, id?: string) {
            const kept = trimUnlockedItems(items, fixed.count)
            if (kept.length < fixed.count) {
              if (glossaryBank) {
                const sourceIds = new Set(kept.map(({ glossary }) => glossary?.sourceId ??
                  glossaryBank.find(({ term }) => term === glossary?.term)?.id))
                const generated = buildPage({ ...config, count: glossaryBank.length }, baseSeed + localSeed, 1, seed).items
                kept.push(...generated.filter(({ glossary }) => !sourceIds.has(glossary?.sourceId)).slice(0, fixed.count - kept.length))
              } else {
                const generated = buildPage(config, baseSeed + localSeed, 1, seed).items
                kept.push(...generated.slice(kept.length, fixed.count))
              }
            }
            return id ? identifyItems(kept, id) : kept
          }
          if (patch.libreItems === undefined && fixed.libreItems?.length) {
            fixed = { ...fixed, libreItems: resize(fixed.libreItems, fixed.contentSeed ?? 0, fixed.libreId) }
          }
          const right = fixed.a5RightLibre
          if (doubleA5 && right?.items.length) {
            fixed = { ...fixed, a5RightLibre: { ...right, items: resize(right.items, fixed.contentSeedTwin ?? fixed.contentSeed ?? 0, right.id) } }
          }
        }
        return setPageBlock(merged, safeBlockIndex, fixed)
      }),
    )
  }

  // Mode libre Gattegno : synchronise le brouillon éditable après un nouveau tirage.
  useEffect(() => {
    if (activeBlock.verbGroup !== 'libre') return
    if (!isPhraseLibreEditable(activeBlock.exerciseType)) return
    if (activeBlock.phraseItems && activeBlock.phraseItems.length > 0) return
    const block = activeSheet?.blocks[safeBlockIndex]
    if (!block) return
    const items = block.items
    const instruction = block.instruction
    setPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? setPageBlock(page, safeBlockIndex, {
              phraseItems: items,
              phraseInstruction: instruction,
            })
          : page,
      ),
    )
  }, [
    activeBlock.verbGroup,
    activeBlock.exerciseType,
    activeBlock.phraseItems,
    activeBlock.count,
    seed,
    activeSheet,
    safeBlockIndex,
    pageIndex,
  ])

  // Mode libre droites / construire : initialise les questions depuis le tirage courant.
  useEffect(() => {
    if (!activeBlock.coordLibre) return
    if (!isReperageDroites(activeBlock.exerciseType) && !isReperageConstruire(activeBlock.exerciseType)) {
      return
    }
    if (activeBlock.coordQuestionsLibre && activeBlock.coordQuestionsLibre.length > 0) return
    const block = activeSheet?.blocks[safeBlockIndex]
    const fromSheet = block?.items[0]?.coordQuestions
    if (!fromSheet?.length) return
    setPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? setPageBlock(page, safeBlockIndex, {
              coordQuestionsLibre: resizeCoordQuestionsLibre(
                fromSheet,
                activeBlock.count,
                defaultCoordQuestionReply(activeBlock.exerciseType),
              ),
            })
          : page,
      ),
    )
  }, [
    activeBlock.coordLibre,
    activeBlock.exerciseType,
    activeBlock.coordQuestionsLibre,
    activeBlock.count,
    seed,
    activeSheet,
    safeBlockIndex,
    pageIndex,
  ])

  const toggleDraftGrid = (itemIndex: number, targetBlock = safeBlockIndex) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const grids = resizeDraftGrids(block.problemDraftGrids, block.count, true)
        grids[itemIndex] = !(grids[itemIndex] ?? true)
        return setPageBlock(page, targetBlock, { problemDraftGrids: grids })
      }),
    )
  }

  const cycleOralAnswerMode = (itemIndex: number, targetBlock = safeBlockIndex, sheetAt = safeSheetIndex) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const modes = resizeOralAnswerModes(block.oralAnswerModes, block.count)
        const sheet = worksheets[sheetAt]
        const sheetBlock = sheet?.blocks.find((entry, i) => (entry.sourceBlockIndex ?? i) === targetBlock)
        const item = sheetBlock?.items[itemIndex]
        const imagesAvailable = Boolean(item?.imagesAvailable)
        const offset = sheetBlock?.itemOffset ?? (sheet?.isContinuation ? 4 : 0)
        const modeIndex = itemIndex + offset
        modes[modeIndex] = cycleOralMode(modes[modeIndex] ?? 'qcm', imagesAvailable)
        return setPageBlock(page, targetBlock, { oralAnswerModes: modes })
      }),
    )
  }

  const selectTcfForm = (itemIndex: number, form: TcfTypeReponse, targetBlock = safeBlockIndex, renderedSheet?: WorksheetPage) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const sheet = renderedSheet ?? worksheets[safeSheetIndex]
        const sheetBlock = sheet?.blocks.find((entry, i) => (entry.sourceBlockIndex ?? i) === targetBlock)
        const offset = sheetBlock?.itemOffset ?? 0
        const modeIndex = itemIndex + offset
        const len = Math.max(block.tcfFormModes?.length ?? 0, modeIndex + 1, sheetBlock?.items.length ?? 0)
        const modes: Array<TcfTypeReponse | undefined> = Array.from({ length: len }, (_, i) => block.tcfFormModes?.[i])
        modes[modeIndex] = form
        return setPageBlock(page, targetBlock, { tcfFormModes: modes })
      }),
    )
  }

  /** Applique la même forme (QCM / texte) à toutes les questions de l’exercice. */
  const selectTcfFormForExercise = (form: TcfTypeReponse, targetBlock = safeBlockIndex, renderedSheet?: WorksheetPage) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const sheet = renderedSheet ?? worksheets[safeSheetIndex]
        const sheetBlock = sheet?.blocks.find((entry, i) => (entry.sourceBlockIndex ?? i) === targetBlock)
        const offset = sheetBlock?.itemOffset ?? 0
        const items = sheetBlock?.items ?? []
        const len = Math.max(block.tcfFormModes?.length ?? 0, items.length + offset, 1)
        const modes: Array<TcfTypeReponse | undefined> = Array.from(
          { length: len },
          (_, i) => block.tcfFormModes?.[i],
        )
        items.forEach((item, itemIndex) => {
          if (item.layout === 'tcf' && (item.tcf?.kind === 'qcm' || item.tcf?.kind === 'lignes')) {
            modes[itemIndex + offset] = form
          }
        })
        return setPageBlock(page, targetBlock, { tcfFormModes: modes })
      }),
    )
  }

  const toggleFormulaireLetterGrid = (targetBlock = safeBlockIndex) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        return setPageBlock(page, targetBlock, {
          formulaireLetterGrid: !block.formulaireLetterGrid,
        })
      }),
    )
  }

  const toggleTcfPageBreak = (itemIndex: number, targetBlock = safeBlockIndex, sheetAt = safeSheetIndex, questionModeIndex?: number, renderedSheet?: WorksheetPage) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const sheet = renderedSheet ?? worksheets[sheetAt]
        const sheetBlock = sheet?.blocks.find((entry, i) => (entry.sourceBlockIndex ?? i) === targetBlock)
        if (questionModeIndex != null && questionModeIndex > 1) {
          const breaks = block.tcfQuestionPageBreakBefore ?? []
          return setPageBlock(page, targetBlock, { tcfQuestionPageBreakBefore: breaks.includes(questionModeIndex)
            ? breaks.filter(value => value !== questionModeIndex) : [...breaks, questionModeIndex].sort((a, b) => a - b) })
        }
        const grammarItem=sheetBlock?.items[itemIndex],questionId=grammarItem?grammarPageBreakQuestionId(grammarItem):undefined
        if (questionId) {
          const ids=block.grammarPageBreakAfterQuestionIds??[]
          return setPageBlock(page,targetBlock,{grammarPageBreakAfterQuestionIds:ids.includes(questionId)?ids.filter(id=>id!==questionId):[...ids,questionId]})
        }
        const offset = sheetBlock?.itemOffset ?? 0
        // Saut avant la question = coupure après l’item précédent.
        const modeIndex = sheetBlock?.logistiqueTheorySlices?.[itemIndex - 1]?.sourceIndex ?? itemIndex + offset - 1
        if (modeIndex < 0) return page
        const totalItems = Math.max(
          block.tcfPageBreakAfter?.length ?? 0, sheetBlock?.logistiqueSourceItemCount ?? 0,
          sheetBlock?.tcfPageBreakAfter?.length ?? 0,
          modeIndex + 1,
          sheetBlock?.items.length ?? 0,
        )
        const breaks = Array.from(
          { length: totalItems },
          (_, i) => block.tcfPageBreakAfter?.[i] ?? sheetBlock?.tcfPageBreakAfter?.[i] ?? false,
        )
        breaks[modeIndex] = !breaks[modeIndex]
        return setPageBlock(page, targetBlock, { tcfPageBreakAfter: breaks })
      }),
    )
  }

  const setAllDraftGrids = (value: boolean) => {
    updatePage({
      problemDraftGrids: Array.from({ length: activeBlock.count }, () => value),
    })
  }

  /** TPM : afficher ou masquer toutes les grilles de calcul de toutes les pages. */
  const setAllTpmDraftGrids = (value: boolean) => {
    setPages((current) =>
      current.map((page) => {
        if (!isTpmDomain(page.domain) && !isTcmCfrDomain(page.domain)) return page
        let next = page
        pageBlocks(page).forEach((block, bi) => {
          if (!isDraftPadExercise(block.exerciseType)) return
          next = setPageBlock(next, bi, {
            problemDraftGrids: Array.from({ length: block.count }, () => value),
          })
        })
        return next
      }),
    )
  }

  // Mode libre générique : reprend le tirage dans libreItems après Générer / Valider.
  useEffect(() => {
    if (!libreMode || (activeSheet && isInlineArithmetic(activeSheet.domain, activeBlock.exerciseType))) return
    if (opensWithoutOverlay(editorProfile)) return
    if (isPhraseDomain && isPhraseLibreEditable(activeBlock.exerciseType)) return
    if (isCalliDomain || isJeuxDomain || isTcf) return
    if (activeBlock.libreItems && activeBlock.libreItems.length > 0) return
    const full = blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)
    const block = activeSheet?.blocks[safeBlockIndex]
    const items = full?.items?.length ? full.items : block?.items
    if (!items?.length) return
    const instruction = full?.instruction || block?.instruction || ''
    setPages((current) =>
      current.map((page, index) =>
        index === pageIndex
          ? setPageBlock(page, safeBlockIndex, {
              libreItems: items,
              libreInstruction: instruction,
            })
          : page,
      ),
    )
  }, [
    libreMode,
    editorProfile,
    isPhraseDomain,
    isCalliDomain,
    isJeuxDomain,
    isTcf,
    activeBlock.exerciseType,
    activeBlock.libreItems,
    activeBlock.contentSeed,
    seed,
    activeSheet,
    worksheets,
    safeBlockIndex,
    pageIndex,
    setPages,
  ])

  return {
    updatePage,
    toggleDraftGrid,
    cycleOralAnswerMode,
    selectTcfForm,
    selectTcfFormForExercise,
    toggleFormulaireLetterGrid,
    toggleTcfPageBreak,
    setAllDraftGrids,
    setAllTpmDraftGrids,
  }
}

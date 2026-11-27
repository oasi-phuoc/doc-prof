import { isLogistiqueDomain, isLogistiqueReferenceType } from '@/logistique/catalog'
import { Fragment, useMemo, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { useWorksheetImageSources, WorksheetPrintImages } from '@/components/WorksheetImage'
import { PeEvaluationSheet } from '@/components/tcf/PeEvaluationSheet'
import { peEvaluationsOf, type PeEvaluation } from '@/tcf/pe-evaluation'
import { isGrammarReadingType } from '@/grammaire/exercises/reading-types'
import { isGrammarTheoryType } from '@/francais/grammar-theory'
import { isGrammaireTheoryType } from '@/grammaire/types'
import { A4Frame } from '@/components/generator/A4Frame'
import { FormesPalette } from '@/components/generator/FormesPalette'
import type { A5WorksheetPair } from '@/components/generator/sheet-format'
import { DualA5Sheet, WorksheetSheet } from '@/components/generator/WorksheetSheet'
import { InteractionCorrigeSheet } from '@/components/tcf/InteractionCorrigeSheet'
import { TranscriptionAppendixSheet } from '@/components/tcf/TranscriptionAppendixSheet'
import { imageInteractionsOf } from '@/tcf/interaction-lines'
import type { TcfPoImageInteraction } from '@/tcf/types'
import {
  collectWorksheetTranscriptions,
  paginateTranscriptions,
} from '@/tcf/transcriptions'
import { isOralComprehensionExercise, isProblemExercise } from '@/components/generator/page-helpers'
import type { InstitutionalHeader } from '@/components/math/PrintDocumentChrome'
import type {
  CoordShape,
  ExerciseBlock,
  PreviewMode,
  WorksheetPage,
} from '@/math/types'
import type { TcfTypeReponse } from '@/tcf/types'

export type ResultPanelProps = {
  libreMode: boolean
  settingsTarget?: HTMLElement | null
  settingsBlockIndex: number
  correctionsToReview?: boolean
  isTcf: boolean
  isGrammaireExercise?: boolean
  isTcmCfr: boolean
  isTcmCsc?: boolean
  cscAudioBusy?: boolean
  cscAudioError?: string
  downloadActiveTcmCscAudios: () => void | Promise<void>
  isSoutienFr: boolean
  isAlphabetisation: boolean
  isSoutienMots: boolean
  isSoutienCompleter: boolean
  isSoutienEcouter: boolean
  soutienKind: string | undefined
  downloadActiveTcfAudios: () => void | Promise<void>
  downloadActiveTcmCfrAudios: () => void | Promise<void>
  downloadActiveSoutienCompleterAudio: () => void | Promise<void>
  downloadActiveSoutienEcouterAudio: () => void | Promise<void>
  downloadActiveSoutienMotsAudio: () => void | Promise<void>
  downloadActiveSoutienPhrases: () => void
  drawTcfTest: () => void
  drawSoutienSeries: () => void
  drawAlphaSeries: () => void
  generate: () => void
  printAll: (includesCorrections: boolean, capture: (studentOnly: boolean) => () => void) => Promise<void>
  printCorrections: boolean
  onSaveFiche: () => void
  onOpenBook: () => void
  isCalliDomain: boolean
  isJeuxDomain: boolean
  jeuxPreviewSheets: Array<{ sheet: WorksheetPage; index: number }> | null
  previewFrameRef: RefObject<HTMLDivElement | null>
  seed: number
  previewWorksheets: WorksheetPage[]
  sheetProps: {
    mode: PreviewMode
    institutional: InstitutionalHeader
    evalMode: boolean
    documentTotalPoints: number
    pointsPerQuestion: number
    onRegenerateBlock: (targetBlock: number, half?: 'left' | 'right') => void
    showExerciseRefresh?: boolean
    hideChrome?: boolean
  }
  chromeProps: {
    institutional: InstitutionalHeader
    evalMode: boolean
    documentTotalPoints: number
    pointsPerQuestion: number
    hideChrome?: boolean
  }
  a5Pairs: A5WorksheetPair[] | null
  previewSheet: WorksheetPage | undefined
  safeSheetIndex: number
  pageExerciseBlocks: ExerciseBlock[]
  activeBlock: ExerciseBlock
  toggleDraftGrid: (itemIndex: number, targetBlock?: number) => void
  cycleOralAnswerMode: (itemIndex: number, targetBlock?: number, sheetIndex?: number) => void
  selectTcfForm: (itemIndex: number, form: TcfTypeReponse, targetBlock?: number, sheetIndex?: number) => void
  selectTcfFormForExercise: (form: TcfTypeReponse, targetBlock?: number, sheetIndex?: number) => void
  toggleFormulaireLetterGrid: (targetBlock?: number) => void
  toggleTcfPageBreak: (itemIndex: number, targetBlock?: number, sheetIndex?: number, questionModeIndex?: number, renderedSheet?: WorksheetPage) => void
  isFormes: boolean
  isCadrans: boolean
  isTransform: boolean
  isComposer: boolean
  coordTool: string
  selectedCoordShape: CoordShape | null
  setSelectedCoordShape: (kind: CoordShape | null) => void
  placeCoordMark: (x: number, y: number, kind: CoordShape) => void
  placeOrigin: (col: number, row: number) => void
  removeCoordMark: (x: number, y: number) => void
}

export function ResultPanel({
  libreMode,
  settingsTarget,
  settingsBlockIndex,
  correctionsToReview,
  isTcf,
  isGrammaireExercise,
  isTcmCfr,
  isTcmCsc,
  cscAudioBusy,
  cscAudioError,
  downloadActiveTcmCscAudios,
  isSoutienFr,
  isAlphabetisation,
  isSoutienMots,
  isSoutienCompleter,
  isSoutienEcouter,
  soutienKind,
  downloadActiveTcfAudios,
  downloadActiveTcmCfrAudios,
  downloadActiveSoutienCompleterAudio,
  downloadActiveSoutienEcouterAudio,
  downloadActiveSoutienMotsAudio,
  downloadActiveSoutienPhrases,
  drawTcfTest,
  drawSoutienSeries,
  drawAlphaSeries,
  generate,
  printAll,
  printCorrections,
  onSaveFiche,
  onOpenBook,
  isCalliDomain,
  isJeuxDomain,
  jeuxPreviewSheets,
  previewFrameRef,
  seed,
  previewWorksheets,
  a5Pairs,
  sheetProps,
  chromeProps,
  previewSheet,
  safeSheetIndex,
  pageExerciseBlocks,
  activeBlock,
  toggleDraftGrid,
  cycleOralAnswerMode,
  selectTcfForm,
  selectTcfFormForExercise,
  toggleFormulaireLetterGrid,
  toggleTcfPageBreak,
  isFormes,
  isCadrans,
  isTransform,
  isComposer,
  coordTool,
  selectedCoordShape,
  setSelectedCoordShape,
  placeCoordMark,
  placeOrigin,
  removeCoordMark,
}: ResultPanelProps) {
  const renderedSheets = useMemo(() => a5Pairs
    ? a5Pairs.flatMap(({ left, right }) => [left, right].filter((sheet) => sheet !== undefined))
    : previewWorksheets, [a5Pairs, previewWorksheets])
  const transcriptionPacks = useMemo(
    () => paginateTranscriptions(collectWorksheetTranscriptions(renderedSheets)),
    [renderedSheets],
  )
  const unavailableLogistique = renderedSheets.some((sheet) =>
    isLogistiqueDomain(sheet.domain) && sheet.blocks.some((block) => block.bankQuestionCap === 0),
  )
  const unavailableActivity = Boolean(previewSheet?.blocks.length && previewSheet.blocks.every(
    (block) => block.items.length === 0 && !block.document,
  ))
  const unavailableDocument = unavailableLogistique || renderedSheets.every((sheet) =>
    sheet.blocks.every((block) => block.items.length === 0 && !block.document),
  )
  const logisticsReferenceOnly = renderedSheets.length > 0 && renderedSheets.every((sheet) =>
    isLogistiqueDomain(sheet.domain) && sheet.blocks.every((block) => isLogistiqueReferenceType(block.exerciseType)),
  )
  const physicalPageCount = a5Pairs?.length ?? previewWorksheets.length
  const answersBaseCount = isCalliDomain || isJeuxDomain || logisticsReferenceOnly ? 0 : physicalPageCount
  /** Corrigé PO : une page pour l’interaction, après la dernière feuille. */
  const correctionFollow = useMemo(() => {
    const seen = new Set<string>()
    const pages: Array<
      { kind: 'pe'; evaluation: PeEvaluation } | { kind: 'po'; exercise: TcfPoImageInteraction }
    > = []
    for (const sheet of renderedSheets) {
      for (const evaluation of peEvaluationsOf(sheet)) {
        const key = `pe:${evaluation.id}:${evaluation.title}`
        if (seen.has(key)) continue
        seen.add(key)
        pages.push({ kind: 'pe', evaluation })
      }
      for (const exercise of imageInteractionsOf(sheet)) {
        const key = `po:${exercise.id}`
        if (seen.has(key)) continue
        seen.add(key)
        pages.push({ kind: 'po', exercise })
      }
    }
    return pages
  }, [renderedSheets])
  /** Corrigé : pages exercices + pages PE/PO + transcriptions. */
  const corrigeTotalPages = answersBaseCount + correctionFollow.length + transcriptionPacks.length
  const [printCapture, setPrintCapture] = useState<ReactNode>(null)
  const imageSources = useWorksheetImageSources()
  const includeCorrections = printCorrections && !isCalliDomain && !isJeuxDomain && !logisticsReferenceOnly
  const printLabel = includeCorrections ? 'Imprimer la fiche et le corrigé' : 'Imprimer la fiche'
  const activePreviewIndex = Math.min(safeSheetIndex, Math.max(0, previewWorksheets.length - 1))
  const activePreview = previewWorksheets[activePreviewIndex]
  const activeConfig = activePreview?.configIndex ?? activePreviewIndex
  /** Feuilles physiques du bouton de page (principale, puis sauts de page). */
  const pageGroup = previewWorksheets
    .map((sheet, index) => ({ sheet, index }))
    .filter(({ sheet, index }) => (sheet.configIndex ?? index) === activeConfig)
  const a5Group = a5Pairs?.map((pair, index) => ({ pair, index }))
    .filter(({ pair }) => pair.configIndex === activeConfig)
  const showPageStack = a5Group ? a5Group.length > 1 : pageGroup.some(({ sheet }) => sheet.isContinuation)
  const lastPreview = previewWorksheets[previewWorksheets.length - 1]
  const onLastPage =
    previewWorksheets.length > 0 &&
    (lastPreview?.configIndex ?? previewWorksheets.length - 1) === activeConfig
  const showCorrectionFollow = sheetProps.mode === 'answers' && onLastPage && correctionFollow.length > 0
  const showTranscriptionPreview =
    sheetProps.mode === 'answers' && transcriptionPacks.length > 0 && onLastPage
  const coordEdit =
    (isFormes && activeBlock.coordLibre) ||
    (isCadrans && activeBlock.coordLibre) ||
    (isTransform && activeBlock.coordLibre)
      ? {
          selectedKind: selectedCoordShape,
          placingOrigin: isComposer && coordTool === 'origin',
          onPlace: placeCoordMark,
          onPlaceOrigin: placeOrigin,
          onRemove: removeCoordMark,
        }
      : undefined
  const renderEditableSheet = (sheet: WorksheetPage, index: number) => (
    <WorksheetSheet
      page={sheet}
      pageNumber={index + 1}
      sheetIndex={index + 1}
      total={previewWorksheets.length}
      settingsTarget={settingsTarget}
      settingsBlockIndex={settingsBlockIndex}
      interactiveDraftGrids={pageExerciseBlocks.some((block) => isProblemExercise(block.exerciseType))}
      onToggleDraftGrid={toggleDraftGrid}
      interactiveOralModes={isOralComprehensionExercise(activeBlock.exerciseType)}
      onCycleOralAnswerMode={(itemIndex, block) => cycleOralAnswerMode(itemIndex, block, index)}
      interactiveTcfOptions={
        isTcf || (Boolean(isGrammaireExercise) && activeBlock.tcfExercise == null)
      }
      interactiveTcfPageBreaks={
        sheet.domain==='grammaire' || isLogistiqueDomain(sheet.domain) || isTcf ||
        pageExerciseBlocks.some(
          (block) =>
            block.grammarPresentation==='document-set' || block.grammarPresentation==='scenario-set' ||
            isGrammarReadingType(block.exerciseType) ||
            isGrammarTheoryType(block.exerciseType) ||
            isGrammaireTheoryType(block.exerciseType) ||
            block.exerciseType === 'tcm-cfr-ex28',
        )
      }
      onSelectTcfForm={(itemIndex, form, block) => selectTcfForm(itemIndex, form, block, index)}
      onSelectTcfFormForExercise={(form, block) => selectTcfFormForExercise(form, block, index)}
      onToggleFormulaireLetterGrid={toggleFormulaireLetterGrid}
      onToggleTcfPageBreak={(itemIndex, block, question) => toggleTcfPageBreak(itemIndex, block, index, question)}
      coordEdit={coordEdit}
      {...sheetProps}
    />
  )

  function renderPrintSheets(withCorrections: boolean, style?: CSSProperties) {
    return (
      <div className="sheet-stage print-only-sheets" style={style} aria-hidden>
        {a5Pairs
          ? a5Pairs.map(({ left, right }, index) => (
              <DualA5Sheet
                key={`print-student-a5-${seed}-${index}`}
                leftPage={left}
                rightPage={right}
                pageNumber={index + 1}
                sheetIndex={index + 1}
                total={physicalPageCount}
                {...chromeProps}
                mode="student"
              />
            ))
          : previewWorksheets.map((page, index) => (
              <WorksheetSheet
                key={`print-student-${page.exerciseType}-${seed}-${index}`}
                page={page}
                pageNumber={index + 1}
                sheetIndex={index + 1}
                total={previewWorksheets.length}
                {...chromeProps}
                mode="student"
              />
            ))}
        {withCorrections ? (
          <>
            {a5Pairs
              ? a5Pairs.map(({ left, right }, index) => (
                  <DualA5Sheet
                    key={`print-answers-a5-${seed}-${index}`}
                    leftPage={left}
                    rightPage={right}
                    pageNumber={index + 1}
                    sheetIndex={physicalPageCount + index + 1}
                    total={physicalPageCount}
                    {...chromeProps}
                    mode="answers"
                  />
                ))
              : previewWorksheets.map((page, index) => (
                <Fragment key={`print-answers-${page.exerciseType}-${seed}-${index}`}>
                  <WorksheetSheet
                    page={page}
                    pageNumber={index + 1}
                    sheetIndex={previewWorksheets.length + index + 1}
                    total={previewWorksheets.length}
                    {...chromeProps}
                    mode="answers"
                  />
                </Fragment>
                ))}
            {correctionFollow.map((page, i) =>
              page.kind === 'pe' ? (
                <PeEvaluationSheet key={`print-pe-${page.evaluation.id}-${i}`} evaluation={page.evaluation} />
              ) : (
                <InteractionCorrigeSheet key={`print-po-${page.exercise.id}`} exercise={page.exercise} />
              ),
            )}
            {transcriptionPacks.map((entries, i) => (
              <TranscriptionAppendixSheet
                key={`print-transcription-${i}`}
                entries={entries}
                pageNumber={answersBaseCount + correctionFollow.length + i + 1}
                totalPages={corrigeTotalPages}
                institutional={chromeProps.institutional}
                appendixIndex={i + 1}
                appendixTotal={transcriptionPacks.length}
              />
            ))}
          </>
        ) : null}
      </div>
    )
  }

  function printCurrentRevision() {
    void printAll(includeCorrections, (studentOnly) => {
      const computed = getComputedStyle(document.documentElement)
      const style = Object.fromEntries(Array.from(computed).filter((name) => name.startsWith('--')).map((name) =>
        [name, computed.getPropertyValue(name)]))
      flushSync(() => setPrintCapture(
        <WorksheetPrintImages sources={imageSources}>
          {renderPrintSheets(includeCorrections && !studentOnly, style)}
        </WorksheetPrintImages>,
      ))
      return () => setPrintCapture(null)
    })
  }

  return (
          <section className="result-panel" id="activity-preview" tabIndex={-1}>
            {isTcmCsc && cscAudioBusy && <p role="status" className="no-print">Préparation des audios CSC…</p>}
            {isTcmCsc && cscAudioError && <p role="alert" className="no-print">{cscAudioError}</p>}
            <div className="result-head">
              <div>
                <p className="eyebrow">Aperçu</p>
                <h2>
                  {unavailableLogistique ? 'Contenu à compléter.'
                    : unavailableActivity ? 'Aucun contenu disponible pour cette activité.'
                    : 'Votre activité est prête.'}
                </h2>
                {correctionsToReview && <p role="status" className="no-print">Corrigé à vérifier</p>}
              </div>
              <div className="result-head-actions no-print">
                <button
                  className="print-chip is-icon"
                  type="button"
                  onClick={onSaveFiche}
                  disabled={unavailableDocument}
                  aria-label="Enregistrer"
                  title="Enregistrer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM15 5v4H7V5h8z"
                    />
                  </svg>
                </button>
                {isTcf ||
                isGrammaireExercise ||
                isTcmCfr ||
                isTcmCsc ||
                ((isSoutienFr || isAlphabetisation) &&
                  (isSoutienMots || isSoutienCompleter || isSoutienEcouter)) ? (
                  <button
                    className="print-chip is-icon is-generate"
                    type="button"
                    onClick={() =>
                      void (isTcf || isGrammaireExercise
                        ? downloadActiveTcfAudios()
                        : isTcmCsc
                          ? downloadActiveTcmCscAudios()
                        : isTcmCfr
                          ? downloadActiveTcmCfrAudios()
                          : isSoutienCompleter
                            ? downloadActiveSoutienCompleterAudio()
                            : isSoutienEcouter
                              ? downloadActiveSoutienEcouterAudio()
                              : downloadActiveSoutienMotsAudio())
                    }
                    aria-label="Télécharger tous les audios de la fiche"
                    disabled={!!isTcmCsc && cscAudioBusy}
                    aria-busy={!!isTcmCsc && cscAudioBusy}
                    title={
                      isTcf || isGrammaireExercise
                        ? 'Télécharger les pistes groupées (consignes + audios)'
                        : isTcmCsc
                          ? 'Télécharger les audios CSC : nombres, calculs et nombres à entourer'
                        : isTcmCfr
                          ? 'Télécharger les audios (nombres et multiplications)'
                          : isSoutienCompleter
                            ? 'Télécharger l’audio (Écoutez et complétez + mots, 6 s)'
                            : isSoutienEcouter
                              ? soutienKind === 'syllabe-son' ||
                                soutienKind === 'syllabe-son-qr'
                                ? 'Télécharger l’audio (syllabe du son + Numéro + mots, 6 s)'
                                : soutienKind === 'lettres-phrase'
                                  ? 'Télécharger l’audio (phrases + Numéro, 6 s)'
                                  : 'Télécharger l’audio (consigne + Numéro + mots, 6 s)'
                              : 'Télécharger l’audio (consigne + mots, 6 s)'
                    }
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M12 3a9 9 0 0 0-9 9v6a3 3 0 0 0 6 0v-4a3 3 0 0 0-4-2.83V12a7 7 0 0 1 14 0v-.83A3 3 0 0 0 15 14v4a3 3 0 0 0 6 0v-6a9 9 0 0 0-9-9zM5 14a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0zm12 0a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0z"
                      />
                    </svg>
                  </button>
                ) : null}
                {isSoutienFr &&
                (soutienKind === 'lettres-phrase' ||
                  soutienKind === 'determinants' ||
                  soutienKind === 'compter' ||
                  soutienKind === 'lire') ? (
                  <button
                    className="print-chip is-icon is-generate"
                    type="button"
                    onClick={downloadActiveSoutienPhrases}
                    aria-label="Télécharger les phrases (JSON)"
                    title={
                      soutienKind === 'lettres-phrase'
                        ? 'Télécharger les phrases type 9 (JSON à corriger)'
                        : soutienKind === 'determinants'
                          ? 'Télécharger les phrases type 10 (JSON à corriger)'
                          : soutienKind === 'compter'
                            ? 'Télécharger les phrases type 12 (JSON à corriger)'
                            : 'Télécharger les phrases type 14 (JSON à corriger)'
                    }
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L18.5 9H15zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"
                      />
                    </svg>
                  </button>
                ) : null}
                {libreMode ? null : (
                  <button
                    className="print-chip is-icon is-generate"
                    type="button"
                    onClick={
                      isTcf
                        ? drawTcfTest
                        : isSoutienFr
                          ? drawSoutienSeries
                          : isAlphabetisation
                            ? drawAlphaSeries
                            : generate
                    }
                    aria-label={
                      isTcf
                        ? 'Tirer un test au hasard'
                        : isSoutienFr || isAlphabetisation
                          ? 'Préparer toutes les fiches du son'
                          : 'Générer'
                    }
                    title={
                      isTcf
                        ? 'Tirer un test au hasard'
                        : isSoutienFr || isAlphabetisation
                          ? 'Préparer toutes les fiches du son'
                          : 'Générer'
                    }
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.75 10h-2.1A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  className="print-chip is-icon is-generate"
                  type="button"
                  onClick={printCurrentRevision}
                  disabled={unavailableDocument || printCapture !== null}
                  aria-label={printLabel}
                  title={printLabel}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                    <path
                      fill="currentColor"
                    d="M18 3H6v4h12V3zm1 6H5a3 3 0 0 0-3 3v5h4v4h12v-4h4v-5a3 3 0 0 0-3-3zm-3 11H8v-5h8v5zm3-7.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                  />
                </svg>
                </button>
                {isAlphabetisation || isSoutienFr ? (
                  <button
                    className="print-chip is-icon is-generate"
                    type="button"
                    onClick={onOpenBook}
                    aria-label={isAlphabetisation ? 'Générer le livre alphabétisation' : 'Générer le livre soutien'}
                    title={isAlphabetisation ? 'Générer le livre alphabétisation' : 'Générer le livre soutien'}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                      <path
                        fill="currentColor"
                        d="M5 4.5A2.5 2.5 0 0 1 7.5 2H12v18H7.5A2.5 2.5 0 0 0 5 22.5v-18zM19 4.5A2.5 2.5 0 0 0 16.5 2H12v18h4.5a2.5 2.5 0 0 1 2.5 2.5v-18z"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>
            <div className="sheet-preview-wrap no-print-nav">
              <div className="sheet-preview-cluster">
                <div className={`sheet-preview-row${jeuxPreviewSheets && jeuxPreviewSheets.length > 1 ? ' is-jeux-duplex' : ''}${showCorrectionFollow || showTranscriptionPreview ? ' is-po-stack' : ''}${showPageStack ? ' is-page-stack' : ''}`}>
                  {jeuxPreviewSheets && jeuxPreviewSheets.length > 1 ? (
                    <div className="sheet-stage is-jeux-stack">
                      {jeuxPreviewSheets.map(({ sheet, index }, stackIdx) => (
                        <A4Frame
                          key={`jeux-prev-${sheet.exerciseType}-${seed}-${index}`}
                          ref={stackIdx === 0 ? previewFrameRef : undefined}
                        >
                          <WorksheetSheet
                            page={sheet}
                            pageNumber={index + 1}
                            sheetIndex={index + 1}
                            total={previewWorksheets.length}
                            {...sheetProps}
                          />
                        </A4Frame>
                      ))}
                    </div>
                  ) : (
                  <div className={`sheet-stage${a5Pairs ? ' is-a5-double' : ''}${showPageStack ? ' is-page-stack' : ''}`}>
                    {a5Group ? a5Group.map(({ pair: { left, right }, index }, stackIndex) => {
                      const domain = (left ?? right)?.domain
                      return (
                        <A4Frame key={`a5-${activeConfig}-${seed}-${index}`}
                          ref={stackIndex === 0 ? previewFrameRef : undefined} className="is-landscape">
                          <DualA5Sheet
                            leftPage={left}
                            rightPage={right}
                            pageNumber={index + 1}
                            sheetIndex={index + 1}
                            total={physicalPageCount}
                            settingsTarget={settingsTarget}
                            settingsBlockIndex={settingsBlockIndex}
                            interactiveDraftGrids={pageExerciseBlocks.some((block) => isProblemExercise(block.exerciseType))}
                            onToggleDraftGrid={toggleDraftGrid}
                            interactiveOralModes={isOralComprehensionExercise(activeBlock.exerciseType)}
                            onCycleOralAnswerMode={cycleOralAnswerMode}
                            interactiveTcfOptions={isTcf || (Boolean(isGrammaireExercise) && activeBlock.tcfExercise == null)}
                            interactiveTcfPageBreaks={domain === 'grammaire' || (domain != null && isLogistiqueDomain(domain)) ||
                              isTcf || pageExerciseBlocks.some((block) => block.grammarPresentation === 'document-set' ||
                                block.grammarPresentation === 'scenario-set' || isGrammarReadingType(block.exerciseType) ||
                                block.exerciseType === 'tcm-cfr-ex28')}
                            onSelectTcfForm={selectTcfForm}
                            onSelectTcfFormForExercise={selectTcfFormForExercise}
                            onToggleFormulaireLetterGrid={toggleFormulaireLetterGrid}
                            onToggleTcfPageBreak={(itemIndex, block, question, sheet) =>
                              toggleTcfPageBreak(itemIndex, block, undefined, question, sheet)}
                            coordEdit={coordEdit}
                            {...sheetProps}
                          />
                        </A4Frame>
                      )
                    }) : showPageStack ? (
                      pageGroup.map(({ sheet, index }, stackIdx) => (
                        <A4Frame
                          key={`page-stack-${sheet.exerciseType}-${seed}-${index}`}
                          ref={stackIdx === 0 ? previewFrameRef : undefined}
                        >
                          {renderEditableSheet(sheet, index)}
                        </A4Frame>
                      ))
                    ) : (
                      <A4Frame
                        ref={previewFrameRef}
                        key={`${previewSheet?.exerciseType}-${seed}-${safeSheetIndex}-${pageExerciseBlocks.length}`}
                      >
                        {previewSheet ? renderEditableSheet(previewSheet, safeSheetIndex) : null}
                      </A4Frame>
                    )}
                    {showCorrectionFollow
                      ? correctionFollow.map((page, i) => (
                          <A4Frame
                            key={
                              page.kind === 'pe'
                                ? `pe-follow-${page.evaluation.id}-${i}`
                                : `${page.kind}-follow-${page.exercise.id}`
                            }
                          >
                            {page.kind === 'pe' ? (
                              <PeEvaluationSheet evaluation={page.evaluation} />
                            ) : (
                              <InteractionCorrigeSheet exercise={page.exercise} />
                            )}
                          </A4Frame>
                        ))
                      : null}
                    {showTranscriptionPreview
                      ? transcriptionPacks.map((entries, i) => (
                          <A4Frame key={`transcription-prev-${i}`}>
                            <TranscriptionAppendixSheet
                              entries={entries}
                              pageNumber={answersBaseCount + correctionFollow.length + i + 1}
                              totalPages={corrigeTotalPages}
                              institutional={chromeProps.institutional}
                              appendixIndex={i + 1}
                              appendixTotal={transcriptionPacks.length}
                            />
                          </A4Frame>
                        ))
                      : null}
                  </div>
                  )}
                  {!libreMode && isFormes && activeBlock.coordLibre ? (
                    <aside className="coord-page-palette no-print">
                      <b>Formes</b>
                      <FormesPalette
                        marks={activeBlock.coordMarks ?? []}
                        selectedKind={selectedCoordShape}
                        onSelect={setSelectedCoordShape}
                      />
                    </aside>
                  ) : null}
                </div>
              </div>
            </div>
            {printCapture ?? renderPrintSheets(includeCorrections)}
          </section>

  )
}

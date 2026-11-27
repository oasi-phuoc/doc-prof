import { flushSync } from 'react-dom'
import { isLogistiqueDomain } from '@/logistique/catalog'
import { logistiqueDocumentTitle } from '@/logistique/generate'
import { AudioProgressDialog } from '@/components/AudioProgressDialog'
import { openInteractive } from '@/interactive/navigation'
import { GrammarCurriculumError } from '@/grammaire/curriculum/types'
import { waitForGrammarPrintImages } from '@/components/grammar/print-media'
import { WorksheetImageProvider } from '@/components/WorksheetImage'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  accountCanAccessDomain,
  domainsForAccount,
  readAccessAccount,
} from '@/access'
import { SaveFicheDialog } from '@/components/generator/SaveFicheDialog'
import { TopbarTools } from '@/components/generator/TopbarTools'
import { FooterSidePanel } from '@/components/generator/FooterSidePanel'
import { Header } from '@/components/generator/Header'
import { LibreSidePanel } from '@/components/generator/LibreSidePanel'
import { ActivitySettings, SettingsPanel } from '@/components/generator/SettingsPanel'
import { ResultPanel } from '@/components/generator/ResultPanel'
import { contrastOnTheme, readThemeColor, theorySectionColors } from '@/components/generator/theme'
import { applyBaseFontSize, DEFAULT_BASE_FONT_SIZE, readBaseFontSize } from '@/components/generator/typography'
import {
  applySheetChrome,
  isTestSheetDomain,
  readPageBorder,
  readSheetMargin,
  storePageBorder,
  storeSheetMargin,
} from '@/components/generator/page-border'
import { applySheetFont, readSheetFont } from '@/components/generator/sheet-font'
import {
  isA5DoubleFormat,
  pageForA5Half,
  type SheetFormat,
} from '@/components/generator/sheet-format'
import { blockItemsForConfig, tcfExerciseOnConfig } from '@/components/generator/sheet-items'
import {
  ALPHA_SOUTIEN_REFERENCE,
  isAlphaSoutienDomain,
} from '@/components/math/PrintDocumentChrome'
import {
  sheetTotalPoints as computeSheetTotalPoints,
  topicsForDomain,
  typeChoicesForBlock,
} from '@/components/generator/generator-derived'
import { deriveBlockContext } from '@/components/generator/generator-block-context'
import { useQuestionsOverflow } from '@/components/generator/useQuestionsOverflow'
import { useGeneratorAudio } from '@/components/generator/useGeneratorAudio'
import { useGenerateActions } from '@/components/generator/useGenerateActions'
import { useCoordEditing } from '@/components/generator/useCoordEditing'
import { additionActivityId } from '@/components/generator/libre/flat-items'
import { liveEditorProfile } from '@/components/generator/libre/profiles'
import { hasTcfCorrectionsToReview, isTcfSubjectIncomplete } from '@/tcf/libre-questions'
import { DraftRecovery } from '@/components/generator/libre/DraftRecovery'
import { useLibreDraft } from '@/components/generator/libre/useLibreDraft'
import { useLibreHistory } from '@/components/generator/libre/useLibreHistory'
import type { LibreRevision } from '@/components/generator/libre/history'
import { usePageConfig } from '@/components/generator/usePageConfig'
import { usePageNavigation } from '@/components/generator/usePageNavigation'
import {
  DEFAULT_INSTITUTIONAL,
  type InstitutionalHeader,
} from '@/components/math/PrintDocumentChrome'
import { defaultPage, exerciseTypeById } from '@/math/catalog'
import { joinCalliLines } from '@/calligraphie/defaults'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import { phraseSelection } from '@/francais/phrase-options'
import { isPhraseThemeId } from '@/francais/phrase-themes'
import type { VocabWordEntry } from '@/francais/vocab-learn'
import { createFiche, storeSyncPassword, updateFiche } from '@/fiches/api'
import { readSessionUser } from '@/fiches/session'
import { buildFicheRecipe, readStagedFiche, rememberFicheOnHistory } from '@/fiches/recipe'
import { BookStudio, type BookRequest } from '@/livres/BookStudio'
import { buildWorksheets } from '@/math/generate'
import {
  blockFromPage,
  exerciseStartIndex,
  pageAsConfig,
  pageBlocks,
  replacePageBlock,
} from '@/math/page-model'
import { randomSeed } from '@/math/rng'
import type {
  CoordShape,
  PageConfig,
  PhraseVerbGroup,
  PreviewMode,
} from '@/math/types'

export function GeneratorPage({
  onLogout,
}: {
  onLogout: () => void
}) {
  const accessAccount = readAccessAccount()
  const draftOwner = readSessionUser()?.id
  const allowedDomains = useMemo(() => domainsForAccount(accessAccount), [accessAccount])
  const firstAllowedDomain = allowedDomains[0] ?? 'algèbre'
  const [openedFiche] = useState(readStagedFiche)
  const initial = defaultPage(
    accountCanAccessDomain(accessAccount, 'algèbre') ? 'algèbre' : firstAllowedDomain,
  )
  const [pages, setPages] = useState<PageConfig[]>(() => openedFiche?.recipe.pages ?? [initial])
  const initialDomain = openedFiche?.recipe.pages[0]?.domain ?? initial.domain
  const [sheetIndex, setSheetIndex] = useState(0)
  const [blockIndex, setBlockIndex] = useState(0)
  const [mode, setMode] = useState<PreviewMode>('student')
  const [institutional, setInstitutional] = useState<InstitutionalHeader>(() =>
    openedFiche
      ? { ...DEFAULT_INSTITUTIONAL, ...openedFiche.recipe.institutional }
      : DEFAULT_INSTITUTIONAL,
  )
  const [evalMode, setEvalMode] = useState(() => openedFiche?.recipe.evalMode ?? false)
  const [pointsPerQuestion, setPointsPerQuestion] = useState(
    () => openedFiche?.recipe.pointsPerQuestion ?? 1,
  )
  const [seed, setSeed] = useState(() => openedFiche?.recipe.seed ?? randomSeed())
  const [selectedCoordShape, setSelectedCoordShape] = useState<CoordShape | null>('triangle')
  const [themeColor, setThemeColor] = useState(readThemeColor)
  const [fontSizes, setFontSizes] = useState(() => ({default:readBaseFontSize(),csc:readBaseFontSize('tcm-csc'),cfr:readBaseFontSize('tcm-cfr')}))
  const [sheetFont, setSheetFont] = useState(() => openedFiche?.recipe.sheetFont ?? readSheetFont())
  useEffect(() => { applySheetFont(sheetFont, false) }, [sheetFont])
  const [sheetFormat, setSheetFormat] = useState<SheetFormat>(
    () => openedFiche?.recipe.sheetFormat ?? 'a4-portrait',
  )
  const [hideChrome, setHideChrome] = useState(
    () => openedFiche?.recipe.hideChrome ?? false,
  )
  const [printStudentOnly, setPrintStudentOnly] = useState(false)
  const [printCorrections, setPrintCorrections] = useState(
    () => openedFiche?.recipe.printCorrections ?? true,
  )
  const [pageBorder, setPageBorder] = useState(() => readPageBorder(initialDomain))
  const [sheetMargin, setSheetMargin] = useState(() => readSheetMargin(initialDomain))
  useLayoutEffect(() => {
    applySheetChrome(pageBorder, sheetMargin)
    return () => {
      document.documentElement.classList.remove('has-page-border', 'is-margin-facing', 'is-margin-symmetric')
    }
  }, [pageBorder, sheetMargin])
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>(() => openedFiche?.recipe.imageOverrides ?? {})
  const theoryColors = theorySectionColors(themeColor)
  const [footerPanelOpen, setFooterPanelOpen] = useState(false)
  const [libreMode, setLibreMode] = useState(() => openedFiche?.recipe.libreMode ?? false)
  const [libreView, setLibreView] = useState<'editor' | 'preview'>('editor')
  const editorFocusRef = useRef<HTMLElement | null>(null)
  const changeLibreView = (view: 'editor' | 'preview') => {
    if (view === libreView) return
    setLibreView(view)
    requestAnimationFrame(() => {
      const panel = document.getElementById(view === 'editor' ? 'activity-editor' : 'activity-preview')
      const lastField = editorFocusRef.current
      if (view === 'editor' && lastField && panel?.contains(lastField) && lastField.getClientRects().length) {
        lastField.focus({ preventScroll: true })
      } else {
        panel?.focus({ preventScroll: true })
      }
    })
  }
  const [ficheRef, setFicheRef] = useState<{ id: string; name: string } | null>(() =>
    openedFiche ? { id: openedFiche.id, name: openedFiche.name } : null,
  )
  const [saveOpen, setSaveOpen] = useState(false)
  const [transientFields, setTransientFields] = useState<Record<string, string>>({})
  function writeTransientField(key: string, text: string | null) {
    setTransientFields((current) => {
      if (text === null) {
        if (!Object.hasOwn(current, key)) return current
        const next = { ...current }
        delete next[key]
        return next
      }
      return current[key] === text ? current : { ...current, [key]: text }
    })
  }
  const [bookRequest, setBookRequest] = useState<BookRequest | null>(null)
  const previewFrameRef = useRef<HTMLDivElement>(null)

  const applyThemeColor = (color: string) => {
    setThemeColor(color)
  }

  const changeFontSize = (size: number) => {
    const value=applyBaseFontSize(size,true,activePage.domain)
    setFontSizes(current=>({...current,[activePage.domain==='tcm-csc'?'csc':activePage.domain==='tcm-cfr'?'cfr':'default']:value}))
  }
  const changeExerciseGap = (value: number) => {
    if (!Number.isInteger(value) || value < 0 || value > 80) return
    setPages((current) => current.map((page) => {
      if (page.domain !== 'tcm-csc') return page
      const extraBlocks = page.extraBlocks?.some((block) => block.exerciseGapPx != null)
        ? page.extraBlocks.map((block) => (block.exerciseGapPx == null ? block : { ...block, exerciseGapPx: undefined }))
        : page.extraBlocks
      return page.exerciseGapPx === value && extraBlocks === page.extraBlocks ? page : { ...page, exerciseGapPx: value, extraBlocks }
    }))
  }

  const logisticsLayout = useMemo(() => ({
    a5: isA5DoubleFormat(sheetFormat),
    hideChrome,
    fontScale: fontSizes.default / DEFAULT_BASE_FONT_SIZE,
    evaluation: evalMode,
  }), [sheetFormat, hideChrome, fontSizes.default, evalMode])
  const worksheets = useMemo(() => buildWorksheets(pages, seed, pointsPerQuestion, logisticsLayout), [pages, seed, pointsPerQuestion, logisticsLayout])
  const logistiqueItemsOnSheet = useMemo(() =>
    worksheets[0] && isLogistiqueDomain(worksheets[0].domain) ? worksheets.flatMap((sheet) => sheet.items) : undefined,
  [worksheets])
  const [libreSnapshot, setLibreSnapshot] = useState<PageConfig[] | null>(
    () => openedFiche?.recipe.libreSnapshot ?? null,
  )
  const revision = useMemo<LibreRevision>(() => ({
    pages, seed, institutional, evalMode, pointsPerQuestion, libreSnapshot,
    sheetFormat, sheetFont, hideChrome, printCorrections, imageOverrides,
  }), [
    pages, seed, institutional, evalMode, pointsPerQuestion, libreSnapshot,
    sheetFormat, sheetFont, hideChrome, printCorrections, imageOverrides,
  ])
  function restoreRevision(previous: LibreRevision) {
    setPages(previous.pages)
    setSeed(previous.seed)
    setInstitutional(previous.institutional)
    setEvalMode(previous.evalMode)
    setPointsPerQuestion(previous.pointsPerQuestion)
    setLibreSnapshot(previous.libreSnapshot)
    if (previous.sheetFormat) setSheetFormat(previous.sheetFormat)
    if (previous.sheetFont) setSheetFont(previous.sheetFont)
    setHideChrome(previous.hideChrome ?? false)
    setPrintCorrections(previous.printCorrections ?? true)
    setImageOverrides(previous.imageOverrides ?? {})
  }
  const libreHistory = useLibreHistory(revision, libreMode, restoreRevision)
  const draftSnapshot = useMemo(() => ({
    revision, libreMode, sheetIndex, blockIndex, fields: transientFields, fiche: ficheRef,
  }), [revision, libreMode, sheetIndex, blockIndex, transientFields, ficheRef])
  const libreDraft = useLibreDraft({
    owner: draftOwner,
    savedId: ficheRef?.id,
    allowedDomains,
    snapshot: draftSnapshot,
    restore: (next) => {
      libreHistory.clearHistory()
      restoreRevision(next.revision)
      setLibreMode(next.libreMode)
      setLibreView('editor')
      setSheetIndex(next.sheetIndex)
      setBlockIndex(next.blockIndex)
      setTransientFields(next.fields)
      setFicheRef(next.fiche ?? null)
      setFooterPanelOpen(false)
    },
  })
  const safeSheetIndex = Math.min(sheetIndex, Math.max(0, worksheets.length - 1))
  const activeSheet = worksheets[safeSheetIndex] ?? worksheets[0]
  const pageIndex = activeSheet?.configIndex ?? Math.min(sheetIndex, Math.max(0, pages.length - 1))
  const activePage = pages[pageIndex] ?? pages[0]!
  const chromeFamily = isTestSheetDomain(activePage.domain) ? 'test' : 'other'
  useLayoutEffect(() => {
    setPageBorder(readPageBorder(activePage.domain))
    setSheetMargin(readSheetMargin(activePage.domain))
  }, [chromeFamily, activePage.domain])
  const fontSize = activePage.domain === 'tcm-csc' ? fontSizes.csc : activePage.domain === 'tcm-cfr' ? fontSizes.cfr : fontSizes.default
  const referenceLocked = isAlphaSoutienDomain(activePage.domain)
  useEffect(() => {
    if (!referenceLocked) return
    setInstitutional((current) =>
      current.reference === ALPHA_SOUTIEN_REFERENCE
        ? current
        : { ...current, reference: ALPHA_SOUTIEN_REFERENCE },
    )
  }, [referenceLocked])
  const pageExerciseBlocks = pageBlocks(activePage)
  const safeBlockIndex = Math.min(blockIndex, Math.max(0, pageExerciseBlocks.length - 1))
  const activeBlock = pageExerciseBlocks[safeBlockIndex] ?? blockFromPage(activePage)
  const isAdditionPilot = activePage.domain === 'algèbre' && activeBlock.exerciseType === 'addition-ligne'
  const activeProfile = liveEditorProfile(activePage.domain, activeBlock.exerciseType, sheetFormat)
  const additionA4 = activeProfile === 'addition'
  const liveAddition = libreMode && additionA4
  const liveTcf = libreMode && (activeProfile === 'document' || activeProfile === 'audio-qcm')

  /** Les exercices encore ouverts avec validation conservent leur dernière version appliquée. */
  const previewSource = useMemo(() => {
    if (!libreMode || activeBlock.coordLibre || !libreSnapshot || libreSnapshot.length !== pages.length) return null
    return libreSnapshot.map((page, index) => {
      const live = pages[index] ?? page
      if (live.domain !== page.domain) return live
      const liveBlocks = pageBlocks(live)
      if (liveBlocks.some((block) => block.exerciseType === 'tcm-csc-ex18')) return live
      const oldBlocks = pageBlocks(page)
      const liveEditor = ({ exerciseType }: { exerciseType: string }) =>
        Boolean(liveEditorProfile(live.domain, exerciseType, sheetFormat))
      if (liveBlocks.some(liveEditor) || oldBlocks.some(liveEditor)) {
        if (oldBlocks.length !== liveBlocks.length || liveBlocks.every(liveEditor)) return live
        return liveBlocks.reduce<PageConfig>((applied, block, index) =>
          liveEditor(block) || (oldBlocks[index] && liveEditor(oldBlocks[index]))
            ? replacePageBlock(applied, index, block)
            : applied,
        page)
      }
      return live.domain === 'tcm-csc' && live.exerciseGapPx !== page.exerciseGapPx
        ? { ...page, exerciseGapPx: live.exerciseGapPx }
        : page
    })
  }, [libreMode, activeBlock.coordLibre, libreSnapshot, pages, sheetFormat])
  const previewWorksheets = useMemo(
    () => (previewSource ? buildWorksheets(previewSource, seed, pointsPerQuestion, logisticsLayout) : worksheets),
    [previewSource, seed, worksheets, pointsPerQuestion, logisticsLayout],
  )
  const a5SourcePages = previewSource ?? pages
  const a5LeftWorksheets = useMemo(() => {
    if (!isA5DoubleFormat(sheetFormat)) return null
    return buildWorksheets(
      a5SourcePages.map((page) => pageForA5Half(page, 'left')),
      seed,
      pointsPerQuestion,
      logisticsLayout,
    )
  }, [sheetFormat, a5SourcePages, seed, pointsPerQuestion, logisticsLayout])
  const a5RightWorksheets = useMemo(() => {
    if (!isA5DoubleFormat(sheetFormat)) return null
    return buildWorksheets(
      a5SourcePages.map((page) => pageForA5Half(page, 'right')),
      seed,
      pointsPerQuestion,
      logisticsLayout,
    )
  }, [sheetFormat, a5SourcePages, seed, pointsPerQuestion, logisticsLayout])
  const previewSheet = previewWorksheets[Math.min(safeSheetIndex, previewWorksheets.length - 1)]
  const a5LeftSheet = a5LeftWorksheets?.[Math.min(safeSheetIndex, a5LeftWorksheets.length - 1)]
  const a5RightSheet = a5RightWorksheets?.[Math.min(safeSheetIndex, a5RightWorksheets.length - 1)]
  /** Jeux : aperçu de toutes les feuilles de la config (recto + verso) côte à côte / empilées. */
  const jeuxPreviewSheets = useMemo(() => {
    if (activePage.domain !== 'jeux') return null
    const related = previewWorksheets
      .map((sheet, index) => ({ sheet, index }))
      .filter(({ sheet }) => (sheet.configIndex ?? 0) === pageIndex)
    return related.length > 0 ? related : null
  }, [activePage.domain, previewWorksheets, pageIndex])

  const available = topicsForDomain(activePage.domain)
  const typeChoices = typeChoicesForBlock(activePage.domain, activeBlock)
  const firstExerciseNo = exerciseStartIndex(pages, pageIndex)
  const sheetTotalPoints = useMemo(
    () => computeSheetTotalPoints(previewWorksheets, pointsPerQuestion),
    [previewWorksheets, pointsPerQuestion],
  )

  const questionsOverflow = useQuestionsOverflow({
    previewFrameRef,
    previewWorksheets,
    pageIndex,
    sheetIndex,
    mode,
    seed,
    activeBlock,
    extraBlocks: activePage.extraBlocks,
    evalMode,
    institutional,
  })

  const ctx = deriveBlockContext(
    activePage,
    activeBlock,
    worksheets,
    safeSheetIndex,
    safeBlockIndex,
    questionsOverflow,
  )


  const {
    updatePage,
    toggleDraftGrid,
    cycleOralAnswerMode,
    selectTcfForm,
    selectTcfFormForExercise,
    toggleFormulaireLetterGrid,
    toggleTcfPageBreak,
    setAllDraftGrids,
    setAllTpmDraftGrids,
  } = usePageConfig({
    pageIndex,
    safeBlockIndex,
    safeSheetIndex,
    setPages,
    activeBlock,
    activeSheet,
    worksheets,
    seed,
    libreMode,
    additionA4,
    isPhraseDomain: ctx.isPhraseDomain,
    isCalliDomain: ctx.isCalliDomain,
    isJeuxDomain: ctx.isJeuxDomain,
    isTcf: ctx.isTcf,
  })

  const activeAsPage = pageAsConfig(activePage, activeBlock)

  const {
    coordTool,
    setCoordTool,
    axesGrid,
    updateAxesGrid,
    placeOrigin,
    placeCoordMark,
    removeCoordMark,
  } = useCoordEditing({
    activeBlock,
    activeAsPage,
    updatePage,
    isCadrans: ctx.isCadrans,
    isComposer: ctx.isComposer,
    isTransform: ctx.isTransform,
    isTransformCentrale: ctx.isTransformCentrale,
  })

  const {
    addPage,
    removePage,
    addExerciseOnPage,
    changeDomain,
    changeTopic,
    changeSoutienLetter,
    changeSoutienSound,
    changeGramSubtheme,
  } = usePageNavigation({
    accessAccount,
    allowedDomains,
    pages,
    activePage,
    activeBlock,
    pageIndex,
    pageExerciseBlocks,
    worksheets,
    soutienSelection: ctx.soutienSelection,
    soutienParsed: ctx.soutienParsed,
    updatePage,
    setPages,
    setSheetIndex,
    setBlockIndex,
    setEvalMode,
    setPointsPerQuestion,
    setMode,
    setInstitutional,
    setSeed,
  })

  const audio = useGeneratorAudio({
    activeBlock,
    activeSheet,
    worksheets,
    safeBlockIndex,
    pageIndex,
    firstExerciseNo,
    tcfNiveau: ctx.tcfNiveau,
    domain: activePage.domain,
    soutienType1Words: ctx.soutienType1Words,
  })

  const {
    validateManual,
    drawTcfTest,
    drawSoutienSeries,
    drawAlphaSeries,
    generate,
    regenerateBlock,
  } = useGenerateActions({
    pages,
    setPages,
    setSeed,
    setMode,
    setEvalMode,
    setSheetIndex,
    setBlockIndex,
    setInstitutional,
    setLibreSnapshot,
    pageIndex,
    safeBlockIndex,
    seed,
    evalMode,
    libreMode,
    activeBlock,
    calliFieldsLength: ctx.calliFields.length,
    isPhraseDomain: ctx.isPhraseDomain,
    isCalliDomain: ctx.isCalliDomain,
    isJeuxDomain: ctx.isJeuxDomain,
    isTcf: ctx.isTcf,
    isGrammaireExercise: ctx.isGrammaireExercise,
    updatePage,
  })

  function setVerbGroup(next: PhraseVerbGroup) {
    const current = activeBlock.verbGroup ?? 'er'
    if (current === next) return
    if (next === 'libre') {
      const block = activeSheet?.blocks[safeBlockIndex]
      updatePage({
        verbGroup: 'libre',
        phraseItems: block?.items,
        phraseInstruction: block?.instruction,
      })
      return
    }
    const cap = isPhraseThemeId(activeBlock.topic)
      ? phraseSelection(activeBlock.topic, next, activeBlock.phraseCategories).frames.length
      : activeBlock.count
    updatePage({
      verbGroup: next,
      count: Math.max(1, Math.min(activeBlock.count, cap)),
      phraseItems: undefined,
      phraseInstruction: undefined,
    })
    setSeed(randomSeed())
  }

  function setCalliFieldAt(index: number, value: string) {
    const next = [...ctx.calliFields]
    next[index] = value
    updatePage({ calliText: joinCalliLines(next) })
  }

  function addCalliExtraWord(entry: VocabWordEntry) {
    const word = entry.label.trim()
    if (!word) return
    const base = ctx.calliFields.filter((line) => line.trim().length > 0)
    updatePage({ calliText: joinCalliLines([...base, word]) })
  }

  function removeCalliField(index: number) {
    if (ctx.calliFields.length <= 1) {
      updatePage({ calliText: '' })
      return
    }
    updatePage({ calliText: joinCalliLines(ctx.calliFields.filter((_, i) => i !== index)) })
  }

  function confirmAdditionOutput(action: 'imprimer' | 'enregistrer') {
    if (!liveAddition) return true
    const field = document.querySelector<HTMLInputElement>('#activity-editor input[data-applied-value][aria-invalid="true"]')
    if (!field) return true
    const calculation = field.closest('[role="group"]')?.getAttribute('aria-label')
    const label = [calculation, field.getAttribute('aria-label')].filter(Boolean).join(' · ')
    if (window.confirm(`${label} contient une saisie invalide. Voulez-vous ${action} la fiche avec la dernière valeur valide (${field.dataset.appliedValue}) ?`)) {
      return true
    }
    setLibreView('editor')
    setFooterPanelOpen(false)
    requestAnimationFrame(() => field.focus())
    return false
  }

  const correctionsToReview = pages.some((page) => pageBlocks(page)
    .some(({ tcfExercise }) => hasTcfCorrectionsToReview(tcfExercise)))

  async function printAll() {
    if (!confirmAdditionOutput('imprimer')) return
    if (pages.some((page) => pageBlocks(page).some(({ tcfExercise }) => isTcfSubjectIncomplete(tcfExercise)))) {
      window.alert('Une question ou un support est incomplet. Complétez le contenu concerné avant d’imprimer.')
      return
    }
    const studentOnly = correctionsToReview && printCorrections
    if (studentOnly && !window.confirm('Un corrigé est à vérifier. Voulez-vous imprimer la fiche élève seule ?')) return
    if (studentOnly) flushSync(() => setPrintStudentOnly(true))
    try {
      const printRoot = document.querySelector<HTMLElement>('.print-only-sheets')
      if (printRoot) await waitForGrammarPrintImages(printRoot)
      window.print()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Les images de la fiche ne sont pas prêtes pour l’impression.')
    } finally {
      if (studentOnly) setPrintStudentOnly(false)
    }
  }

  function playWithClass() {
    try {
      const recipe = buildFicheRecipe({ pages, seed, institutional, evalMode, pointsPerQuestion, libreMode, libreSnapshot, sheetFormat, sheetFont, hideChrome, printCorrections, imageOverrides })
      openInteractive(recipe, ficheRef?.name ?? 'Ma fiche')
    } catch (error) {
      if (!(error instanceof GrammarCurriculumError)) throw error
      window.alert(error.message)
    }
  }

  async function persistFiche(input: { name: string; savedBy: string; asNew: boolean; password: string }) {
    if (input.password) storeSyncPassword(input.password)
    const recipe = buildFicheRecipe({
      savedBy: input.savedBy,
      pages,
      seed,
      institutional,
      evalMode,
      pointsPerQuestion,
      libreMode,
      libreSnapshot,
      sheetFormat,
      sheetFont,
      hideChrome,
      printCorrections,
      imageOverrides,
    })
    const saved =
      !input.asNew && ficheRef
        ? await updateFiche(ficheRef.id, input.name, recipe)
        : await createFiche(input.name, recipe)
    const next = { id: saved.id, name: saved.name }
    setFicheRef(next)
    rememberFicheOnHistory({ ...next, recipe: saved.recipe })
    await libreDraft.finishSave(next)
  }

  const printInstitutional = isLogistiqueDomain(pages[0]?.domain ?? activePage.domain) && !institutional.documentTitle.trim()
    ? { ...institutional, documentTitle: logistiqueDocumentTitle(previewSource ?? pages, evalMode, evalMode) }
    : institutional
  const chromeProps = {
    institutional: printInstitutional,
    evalMode,
    // TPM : total = somme des barèmes de la fiche (plus de plafond fixe à 100).
    documentTotalPoints: sheetTotalPoints,
    pointsPerQuestion,
    hideChrome,
  } as const

  const sheetProps = {
    mode,
    ...chromeProps,
    hideChrome,
    onRegenerateBlock: regenerateBlock,
    // En mode libre : refresh sous la numérotation du panneau (pas sur le titre Exercice).
    showExerciseRefresh: !libreMode,
  } as const

  const settingsPanelProps = {
    recovery: draftOwner ? (
      <DraftRecovery
        drafts={libreDraft.available}
        message={libreDraft.message}
        error={libreDraft.error}
        onResume={libreDraft.choose}
        onDiscard={libreDraft.discard}
      />
    ) : undefined,
    ...ctx,
    worksheets,
    pages,
    safeSheetIndex,
    setSheetIndex,
    setBlockIndex,
    setPages,
    pageIndex,
    pageExerciseBlocks,
    safeBlockIndex,
    activeSheet,
    firstExerciseNo,
    addPage,
    addExerciseOnPage,
    removePage,
    evalMode,
    setEvalMode,
    institutional,
    setInstitutional,
    pointsPerQuestion,
    setPointsPerQuestion,
    sheetTotalPoints,
    activePage,
    changeDomain,
    allowedDomains,
    accessAccount,
    activeBlock,
    changeTopic,
    available,
    changeSoutienLetter,
    changeSoutienSound,
    changeGramSubtheme,
    isAlphabetisation: ctx.isAlphabetisation,
    libreMode,
    setVerbGroup,
    updatePage,
    typeChoices,
    activeAsPage,
    setCalliFieldAt,
    removeCalliField,
    addCalliExtraWord,
    soutienBankSound: ctx.soutienBank?.sound,
    soutienCompletes: ctx.soutienBank?.completes ?? [],
    soutienBankWords: ctx.soutienBank?.words ?? [],
    questionsOverflow,
    axesGrid,
    updateAxesGrid,
    coordTool,
    setCoordTool,
    placeCoordMark,
    placeOrigin,
    removeCoordMark,
    setAllTpmDraftGrids,
    setAllDraftGrids,
  }

  const footerPanel = footerPanelOpen ? (
    <FooterSidePanel
      institutional={institutional}
      setInstitutional={setInstitutional}
      evalMode={evalMode}
      activeExerciseLabel={exerciseTypeById[activeBlock.exerciseType]?.label ?? ''}
      referenceLocked={referenceLocked}
      onClose={() => setFooterPanelOpen(false)}
    />
  ) : null

  const resultPanelProps = {
    ...ctx,
    libreMode,
    validateManual: liveAddition || liveTcf ? undefined : validateManual,
    correctionsToReview,
    downloadActiveTcfAudios: audio.downloadActiveTcfAudios,
    downloadActiveTcmCfrAudios: audio.downloadActiveTcmCfrAudios,
    downloadActiveTcmCscAudios: audio.downloadActiveTcmCscAudios,
    cscAudioBusy: audio.cscAudioBusy,
    cscAudioError: audio.cscAudioError,
    downloadActiveSoutienCompleterAudio: audio.downloadActiveSoutienCompleterAudio,
    downloadActiveSoutienEcouterAudio: audio.downloadActiveSoutienEcouterAudio,
    downloadActiveSoutienMotsAudio: audio.downloadActiveSoutienMotsAudio,
    downloadActiveSoutienPhrases: audio.downloadActiveSoutienPhrases,
    drawTcfTest,
    drawSoutienSeries,
    drawAlphaSeries,
    generate,
    printAll,
    printCorrections: printCorrections && !printStudentOnly,
    onSaveFiche: () => {
      if (confirmAdditionOutput('enregistrer')) setSaveOpen(true)
    },
    onOpenBook: () =>
      setBookRequest({
        kind: activePage.domain === 'alphabetisation' ? 'alpha' : 'soutien',
        institutional,
        evalMode,
        pointsPerQuestion,
        saveCopy: true,
      }),
    jeuxPreviewSheets,
    previewFrameRef,
    seed,
    previewWorksheets,
    sheetFormat,
    a5LeftWorksheets,
    a5RightWorksheets,
    a5LeftSheet,
    a5RightSheet,
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
    coordTool,
    selectedCoordShape,
    setSelectedCoordShape,
    placeCoordMark,
    placeOrigin,
    removeCoordMark,

  }

  return (
    <div
      className={`app-shell${isA5DoubleFormat(sheetFormat) ? ' is-a5-double' : ''}`}
      style={
        {
          '--purple': themeColor,
          '--lavender': `color-mix(in srgb, ${themeColor} 14%, #fff)`,
          '--theme-on': contrastOnTheme(themeColor),
          '--theory-regarder': theoryColors.regarder,
          '--theory-expliquer': theoryColors.expliquer,
          '--theory-retenir': theoryColors.retenir,
        } as CSSProperties
      }
    >
      <AudioProgressDialog progress={audio.audioProgress} onCancel={audio.cancelAudio} />
      <Header
        onCreate={() => undefined}
        generator
        rightSlot={
          <>
            {!isLogistiqueDomain(activePage.domain) && (
              <button type="button" className="button small" onClick={playWithClass}>Jouer cette fiche</button>
            )}
            <TopbarTools
            themeColor={themeColor}
            onThemeColor={applyThemeColor}
            fontSize={fontSize}
            onFontSizeChange={changeFontSize}
            sheetFont={sheetFont}
            onSheetFontChange={font => setSheetFont(applySheetFont(font))}
            sheetFormat={sheetFormat}
            onSheetFormatChange={setSheetFormat}
            printCorrections={printCorrections}
            onPrintCorrectionsChange={setPrintCorrections}
            hideChrome={hideChrome}
            onHideChromeChange={setHideChrome}
            exerciseGap={activePage.domain === 'tcm-csc' ? activePage.exerciseGapPx ?? 50 : undefined}
            onExerciseGapChange={changeExerciseGap}
            pageBorder={pageBorder}
            onPageBorderChange={(on) => {
              setPageBorder(on)
              storePageBorder(on, activePage.domain)
            }}
            sheetMargin={sheetMargin}
            onSheetMarginChange={(margin) => {
              setSheetMargin(margin)
              storeSheetMargin(margin, activePage.domain)
            }}
            footerOpen={footerPanelOpen}
            onToggleFooter={() => {
              setFooterPanelOpen((open) => !open)
              if (libreMode) setLibreView('editor')
            }}
            libreOpen={libreMode}
            onToggleLibre={() => {
              setLibreView('editor')
              setLibreMode((prev) => {
                const next = !prev
                setLibreSnapshot(next ? pages : null)
                if (next) {
                  const sheetBlock = activeSheet?.blocks[safeBlockIndex]
                  const full = blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)
                  const seedItems = activeBlock.libreItems?.length
                    ? activeBlock.libreItems
                    : (full?.items ?? sheetBlock?.items ?? [])
                  const seedInstruction =
                    activeBlock.libreInstruction ?? full?.instruction ?? sheetBlock?.instruction ?? ''
                  // TCF / grammaire : l’éditeur porte l’exercice entier. Figer la feuille
                  // visible (souvent la suite) effaçait la page des premières questions.
                  const patch: Partial<typeof activeBlock> =
                    ctx.isTcf || ctx.isGrammaireExercise
                      ? { libreItems: undefined, libreInstruction: undefined }
                      : isAdditionPilot
                        ? {}
                        : { libreItems: seedItems, libreInstruction: seedInstruction }
                  if (ctx.isFormes || ctx.isCadrans || ctx.isDroites || ctx.isConstruire || ctx.isTransform) {
                    patch.coordLibre = true
                  }
                  if (ctx.isNumberLibreDomain && !isAdditionPilot) patch.numberLibre = true
                  if (ctx.isPhraseDomain && isPhraseLibreEditable(activeBlock.exerciseType)) {
                    patch.verbGroup = 'libre'
                    patch.phraseItems = activeBlock.phraseItems ?? sheetBlock?.items
                    patch.phraseInstruction =
                      activeBlock.phraseInstruction ?? sheetBlock?.instruction
                  }
                  if (ctx.soutienKind === 'mots') patch.soutienMotsLibre = true
                  if (ctx.soutienKind === 'completer') patch.soutienCompleterLibre = true
                  if (Object.keys(patch).length) updatePage(patch)
                }
                // Fermeture : on garde le contenu libre (pas de régénération de la fiche).
                return next
              })
            }}
            previewMode={mode}
            onTogglePreviewMode={() =>
              setMode((m) => (m === 'student' ? 'answers' : 'student'))
            }
            showPreviewToggle={!(ctx.isCalliDomain || ctx.isJeuxDomain)}
            onLogout={() => { void libreDraft.flush().finally(onLogout) }}
          />
          </>
        }
      />
      <main className="generator-page" id="top">
        <div className="generator-intro">
          <a className="back-link" href="/">
            ← Retour à l’accueil
          </a>
          <p className="eyebrow">Boîte de génération · Mathématiques</p>
          <h1>
            Créez votre fiche
            <br />
            <em>à votre façon.</em>
          </h1>
          <p className="hero-text">Chaque génération crée une nouvelle série d’exercices aléatoires.</p>
        </div>
        <div
          className={`workspace${libreMode ? ' has-libre-panel' : ''}${!libreMode && footerPanelOpen ? ' has-footer-panel' : ''}`}
          data-libre-view={libreMode ? libreView : undefined}
          onInputCapture={libreHistory.onInputCapture}
          onBlurCapture={libreHistory.stopInputGroup}
          onPointerDownCapture={libreHistory.stopInputGroup}
        >
          {libreMode && (
            <div className="libre-mobile-switch mode-toggle is-2 no-print" role="group" aria-label="Afficher en mode libre">
              <button
                type="button"
                className={libreView === 'editor' ? 'active' : undefined}
                aria-pressed={libreView === 'editor'}
                aria-controls="activity-editor"
                onClick={() => changeLibreView('editor')}
              >
                Édition
              </button>
              <button
                type="button"
                className={libreView === 'preview' ? 'active' : undefined}
                aria-pressed={libreView === 'preview'}
                aria-controls="activity-preview"
                onClick={() => changeLibreView('preview')}
              >
                Aperçu
              </button>
            </div>
          )}
          {libreMode ? (
            <LibreSidePanel
              settings={<ActivitySettings {...settingsPanelProps} />}
              history={libreHistory}
              footer={footerPanel}
              onFocusCapture={(event) => { editorFocusRef.current = event.target }}
              activeBlock={activeBlock}
              activeSheet={activeSheet}
              logistiqueItemsOnSheet={logistiqueItemsOnSheet}
              logistiqueActiveItems={logistiqueItemsOnSheet
                ? blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)?.items : undefined}
              safeBlockIndex={safeBlockIndex}
              isPhraseDomain={ctx.isPhraseDomain}
              isNumberLibreDomain={ctx.isNumberLibreDomain}
              liveAddition={liveAddition}
              liveTcf={liveTcf}
              evalMode={evalMode}
              additionId={additionActivityId(activeBlock, seed, pageIndex, safeBlockIndex)}
              maxQuestions={ctx.maxQuestions}
              transientFields={transientFields}
              onTransientField={writeTransientField}
              isCalliDomain={ctx.isCalliDomain}
              isJeuxDomain={ctx.isJeuxDomain}
              isTcf={ctx.isTcf}
              isGrammaireExercise={ctx.isGrammaireExercise}
              isTpmLike={ctx.isTpmLike}
              isDroites={ctx.isDroites}
              isConstruire={ctx.isConstruire}
              soutienKind={ctx.soutienKind}
              soutienType1Words={ctx.soutienType1Words}
              soutienType1WordPool={ctx.soutienType1WordPool}
              soutienCompletes={ctx.soutienBank?.completes ?? []}
              soutienBankWords={ctx.soutienBank?.words ?? []}
              calliIsPhrases={ctx.calliIsPhrases}
              calliFields={ctx.calliFields}
              setCalliFieldAt={setCalliFieldAt}
              removeCalliField={removeCalliField}
              addCalliExtraWord={addCalliExtraWord}
              jeuxTemplate={ctx.jeuxTemplate}
              jeuxText={ctx.jeuxText}
              tcfNiveau={ctx.tcfNiveau}
              renderedExercise={tcfExerciseOnConfig(worksheets, pageIndex)}
              updatePage={updatePage}
              onRegenerateBlock={regenerateBlock}
              onClose={() => {
                // Ferme le panneau sans effacer le contenu libre ni régénérer la fiche.
                setLibreMode(false)
                setLibreSnapshot(null)
              }}
            />
          ) : <SettingsPanel {...settingsPanelProps} />}
          <WorksheetImageProvider enabled={libreMode} overrides={imageOverrides} onChange={setImageOverrides}>
            <ResultPanel {...resultPanelProps} />
          </WorksheetImageProvider>
          {!libreMode && footerPanel}
        </div>
      </main>
      {saveOpen ? (
        <SaveFicheDialog
          initialName={ficheRef?.name ?? ''}
          canUpdate={ficheRef != null}
          onClose={() => setSaveOpen(false)}
          onSubmit={persistFiche}
        />
      ) : null}
      <BookStudio request={bookRequest} onClose={() => setBookRequest(null)} />
    </div>
  )
}

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import './App.css'
import { CoordEditorBoard, CoordGrid, CoordShapeButton } from '@/components/math/CoordGrid'
import { MathItemView, tokenizeAlgebra } from '@/components/math/MathItemView'
import {
  CLASS_LEVELS,
  CLASS_NUMBERS,
  COURSES,
  CustomDocumentHeader,
  DEFAULT_INSTITUTIONAL,
  DocumentFooter,
  InstitutionalDocumentHeader,
  SheetBody,
  type CustomHeader,
  type HeaderStyle,
  type InstitutionalHeader,
} from '@/components/math/PrintDocumentChrome'
import {
  algebraTopics,
  defaultPage,
  exerciseTypeById,
  firstTypeFor,
  FRENCH_TRACKS,
  frenchTopics,
  geometryTopics,
  isDraftPadExercise,
  lectureTopics,
  typesForTopic,
} from '@/math/catalog'
import { constructRangeFor } from '@/math/coord-construire'
import {
  COORD_SHAPES,
  COORD_SHAPE_LABEL,
  axesRangeFor,
  clampCoordRange,
  clampCoordSize,
  coordSizeFor,
  isReperageCadrans,
  isReperageConstruire,
  isReperageDroites,
  isReperageFormes,
  isReperagePage,
  nextPointLabel,
  sceneFromAxesLibre,
  sceneFromLibre,
} from '@/math/coord-reperage'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { buildWorksheets } from '@/math/generate'
import {
  addPageBlock,
  blockFromPage,
  exerciseStartIndex,
  pageAsConfig,
  pageBlocks,
  removePageBlock,
  setPageBlock,
} from '@/math/page-model'
import { randomSeed } from '@/math/rng'
import type {
  CoordAxis,
  CoordShape,
  Difficulty,
  Domain,
  ExerciseBlock,
  ExerciseType,
  FrenchTrack,
  PageConfig,
  PreviewMode,
  WorksheetBlock,
  WorksheetPage,
} from '@/math/types'

function fallbackBlocks(page: WorksheetPage): WorksheetBlock[] {
  return [
    {
      exerciseIndex: 1,
      title: 'Exercice 1',
      instruction: page.instruction,
      items: page.items,
      columns: page.columns,
      exerciseType: page.exerciseType,
      givens: page.givens,
      problemDraftGrids: page.problemDraftGrids,
    },
  ]
}

function WorksheetSheet({
  page,
  mode,
  headerStyle,
  institutional,
  custom,
  evalMode,
  pageNumber,
  total,
  sheetIndex,
  documentTotalPoints,
  pointsPerQuestion = 1,
  interactiveDraftGrids = false,
  onToggleDraftGrid,
  coordEdit,
}: {
  page: WorksheetPage
  mode: PreviewMode
  headerStyle: HeaderStyle
  institutional: InstitutionalHeader
  custom: CustomHeader
  evalMode: boolean
  pageNumber: number
  total: number
  /** Rang physique dans la pile imprimée (1 = première feuille). Sert aux marges miroir. */
  sheetIndex: number
  /** Total de points de toute la fiche (toutes les pages). */
  documentTotalPoints: number
  pointsPerQuestion?: number
  /** Affiche le bouton grille / sans grille sur chaque problème (aperçu seulement). */
  interactiveDraftGrids?: boolean
  onToggleDraftGrid?: (index: number, blockIndex?: number) => void
  coordEdit?: {
    selectedKind: CoordShape | null
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onRemove: (x: number, y: number) => void
  }
}) {
  const showHeader = pageNumber === 1
  const parity = sheetIndex % 2 === 1 ? 'sheet-odd' : 'sheet-even'
  const isDraftPadPage = page.items.some(
    (item) =>
      item.layout === 'equation' ||
      (item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)) ||
      (item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)),
  )
  return (
    <article
      className={`worksheet-sheet ${parity}`}
      style={{ '--sheet-columns': page.columns } as CSSProperties}
    >
      {showHeader &&
        (headerStyle === 'institutionnel' ? (
          <InstitutionalDocumentHeader
            config={institutional}
            evalMode={evalMode}
            totalPoints={evalMode ? documentTotalPoints : undefined}
            fallbackTitle={page.title}
          />
        ) : (
          <CustomDocumentHeader config={custom} pageTitle={page.title} domain={page.domain} />
        ))}
      <SheetBody>
        {(page.blocks.length > 0 ? page.blocks : fallbackBlocks(page)).map((block, blockIndex) => {
          const algebraItems = block.items.filter((item) => item.layout === 'algebra')
          const maxTokens =
            algebraItems.length > 0
              ? Math.max(...algebraItems.map((item) => tokenizeAlgebra(item.prompt ?? '').length))
              : 0
          const blockDraft = block.items.some(
            (item) =>
              item.layout === 'equation' ||
              (item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)) ||
              (item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)),
          )
          return (
            <section className="exercise-block" key={`${block.exerciseType}-${block.exerciseIndex}`}>
              <header className="exercise-heading">
                <div className="exercise-heading-main">
                  <h3>{block.title}</h3>
                  <p>{block.instruction}</p>
                  {block.givens && block.givens.length > 0 ? (
                    <p className="sheet-givens" aria-label="Valeurs des variables">
                      {block.givens.map((given, index) => (
                        <span key={given.letter}>
                          {index > 0 ? <span className="given-sep"> · </span> : null}
                          <span className="given-letter">{given.letter}</span>
                          {' = '}
                          <span className="given-value">{String(given.value).replace('.', ',')}</span>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
                {evalMode ? (
                  <span className="instruction-points">{block.items.length * pointsPerQuestion} points</span>
                ) : null}
              </header>
              {block.document ? (
                <div className={`exercise-document is-${block.document.kind}`}>
                  {block.document.title ? <p className="exercise-document-title">{block.document.title}</p> : null}
                  {block.document.audioSrc ? (
                    <audio className="oral-audio" controls preload="none" src={block.document.audioSrc}>
                      Écoutez l’enregistrement.
                    </audio>
                  ) : null}
                  {block.document.kind === 'written' || mode === 'answers' ? (
                    <p className="exercise-document-text">{block.document.text}</p>
                  ) : (
                    <p className="exercise-document-listen">Écoutez le dialogue. La transcription figure au corrigé.</p>
                  )}
                </div>
              ) : null}
              <div
                className={`exercise-grid${
                  block.items.every((item) => item.layout === 'algebra')
                    ? ' algebra-grid'
                    : blockDraft || isDraftPadPage
                      ? ' problem-grid'
                      : ''
                }`}
                style={{ '--sheet-columns': block.columns } as CSSProperties}
              >
                {block.items.map((item, index) => {
                  const padLeft =
                    item.layout === 'algebra' ? Math.max(0, maxTokens - tokenizeAlgebra(item.prompt ?? '').length) : 0
                  const draftGrid = block.problemDraftGrids?.[index] ?? page.problemDraftGrids?.[index] ?? true
                  return (
                    <MathItemView
                      key={`${block.exerciseType}-${block.exerciseIndex}-${index}-${item.answer}`}
                      item={item}
                      mode={mode}
                      index={index}
                      algebraPadLeft={padLeft}
                      draftGrid={draftGrid}
                      onToggleDraftGrid={
                        interactiveDraftGrids && onToggleDraftGrid
                          ? () => onToggleDraftGrid(index, blockIndex)
                          : undefined
                      }
                      coordEdit={coordEdit}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </SheetBody>
      <DocumentFooter pageNumber={pageNumber} total={total} />
    </article>
  )
}

type SelectOption = { value: string; label: string; disabled?: boolean }

function optionsFromChildren(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') return []
    const el = child as ReactElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>
    return [
      {
        value: String(el.props.value ?? ''),
        label: Children.toArray(el.props.children).join(''),
        disabled: Boolean(el.props.disabled),
      },
    ]
  })
}

function SelectBox({
  label,
  value,
  children,
  onChange,
}: {
  label: string
  value: string
  children: ReactNode
  onChange: (value: string) => void
}) {
  const options = useMemo(() => optionsFromChildren(children), [children])
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="select-shell" ref={rootRef}>
      <span id={`${listId}-label`}>{label}</span>
      <div className={`select-box ${open ? 'open' : ''}`}>
        <button
          type="button"
          className="select-control"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${listId}-label`}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="select-control-value">{selected?.label ?? '—'}</span>
          <span className="select-caret" aria-hidden />
        </button>
        {open && (
          <ul className="select-menu" role="listbox" id={listId} aria-labelledby={`${listId}-label`}>
            {options.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  className={`select-option ${option.value === value ? 'selected' : ''}`}
                  aria-selected={option.value === value}
                  disabled={option.disabled}
                  onClick={() => {
                    if (option.disabled) return
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Header({ onCreate, generator = false }: { onCreate: () => void; generator?: boolean }) {
  return (
    <header className="topbar no-print">
      <a className="brand" href={generator ? '/' : '#top'}>
        <span className="brand-mark">
          <i />
          <i />
          <i />
        </span>
        Clair<span className="brand-accent">FLE</span>
      </a>
      {!generator && (
        <button className="button small" type="button" onClick={onCreate}>
          Créer une fiche <span>→</span>
        </button>
      )}
    </header>
  )
}

/** Mot de passe pour ouvrir le générateur de fiches. */
const FICHE_ACCESS_PASSWORD = 'jebosseplus'

/** Remettre à `true` pour réafficher Lecture dans le sélecteur Domaine. */
const SHOW_LECTURE_DOMAIN = false

function Landing({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="landing-page">
      <Header onCreate={onCreate} />
      <main id="top">
        <section className="hero landing-hero no-print">
          <div className="hero-copy">
            <p className="eyebrow">Des fiches qui font avancer</p>
            <h1>
              Le français devient
              <br />
              <em>plus clair.</em>
            </h1>
            <p className="hero-text">
              Composez en quelques minutes des fiches simples, respectueuses et prêtes à imprimer pour vos
              apprenant·e·s.
            </p>
            <div className="hero-actions">
              <button className="button" type="button" onClick={onCreate}>
                Créer une fiche <span>→</span>
              </button>
            </div>
            <p className="microcopy">
              <span className="check">✓</span> Gratuit, sans compte, vos fiches restent à vous.
            </p>
          </div>
          <div className="landing-art">
            <span>Français</span>
            <span>Mathématiques</span>
            <span>Algèbre</span>
            <span>Géométrie</span>
            <span>Lecture</span>
            <div className="art-card">
              <b>Fiches claires</b>
              <small>à imprimer et partager</small>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer no-print" id="aide">
        <span>
          Clair<span className="brand-accent">FLE</span>
        </span>
        <span>Fiches pour la classe.</span>
        <span>Essai local · sans compte</span>
      </footer>
    </div>
  )
}

function applyType(type: ExerciseType): Partial<ExerciseBlock> {
  const isProblem = type.id.includes('problemes')
  const isEquation = type.id.startsWith('equations-')
  const isLongMul = type.id === 'multiplication-2chiffres'
  const isDivisionCol = type.id.startsWith('division-colonne')
  const isLectureDense = type.id.endsWith('-entourer') || type.id.endsWith('-cocher')
  const isLecture = type.topic === 'alphabet' || type.topic.startsWith('voyelle-')
  const isFormes = isReperageFormes(type.id)
  const isCadrans = isReperageCadrans(type.id)
  const isDroites = isReperageDroites(type.id)
  const isConstruire = isReperageConstruire(type.id)
  const isGeoCalc = isDraftPadExercise(type.id) && !isProblem && !isEquation
  const isFrenchCom = type.track === 'com'
  const isFrenchLang = type.track === 'voc' || type.track === 'gram'
  const coordSize = coordSizeFor('moyen')
  return {
    exerciseType: type.id,
    topic: type.topic,
    track: type.track,
    columns: type.preferredColumns ?? 2,
    ...(isProblem || isEquation
      ? { count: 2 }
      : isDivisionCol
        ? { count: 3 }
        : isLongMul
          ? { count: 4 }
          : isLectureDense
            ? { count: 4 }
            : isLecture
              ? { count: 6 }
              : isGeoCalc
                ? { count: 2 }
              : isFrenchCom
                ? { count: 4 }
              : isFrenchLang
                ? { count: 6 }
              : isFormes
                ? { count: 5 }
                : isCadrans
                  ? { count: 6 }
                  : isDroites || isConstruire
                    ? { count: 5 }
                    : {}),
    ...(isFormes
      ? {
          coordLibre: false,
          coordCols: coordSize.cols,
          coordRows: coordSize.rows,
          coordAxis: 'letters' as const,
          coordMarks: [],
          coordRange: undefined,
        }
      : isCadrans
        ? {
            coordLibre: type.id === 'reperage-cadrans-libre',
            coordRange: axesRangeFor('moyen'),
            coordMarks: [],
            coordCols: undefined,
            coordRows: undefined,
            coordAxis: undefined,
          }
        : isDroites
          ? {
              coordLibre: undefined,
              coordCols: undefined,
              coordRows: undefined,
              coordAxis: undefined,
              coordMarks: undefined,
              coordRange: axesRangeFor('moyen'),
            }
          : isConstruire
            ? {
                coordLibre: undefined,
                coordCols: undefined,
                coordRows: undefined,
                coordAxis: undefined,
                coordMarks: undefined,
                coordRange: constructRangeFor('moyen'),
              }
            : {
                coordLibre: undefined,
                coordCols: undefined,
                coordRows: undefined,
                coordAxis: undefined,
                coordMarks: undefined,
                coordRange: undefined,
              }),
  }
}

function resizeDraftGrids(prev: boolean[] | undefined, count: number): boolean[] {
  return Array.from({ length: count }, (_, i) => prev?.[i] ?? true)
}

function isProblemExercise(typeId: string): boolean {
  return isDraftPadExercise(typeId)
}

function GeneratorPage() {
  const initial = defaultPage('algèbre')
  const [pages, setPages] = useState<PageConfig[]>([initial])
  const [pageIndex, setPageIndex] = useState(0)
  const [blockIndex, setBlockIndex] = useState(0)
  const [mode, setMode] = useState<PreviewMode>('student')
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>('institutionnel')
  const [institutional, setInstitutional] = useState<InstitutionalHeader>(DEFAULT_INSTITUTIONAL)
  const [custom, setCustom] = useState<CustomHeader>({
    title: '',
    subtitle: '',
    logo: 'ClairFLE',
    footer: 'ClairFLE · Support imprimable',
  })
  const [evalMode, setEvalMode] = useState(false)
  const [pointsPerQuestion, setPointsPerQuestion] = useState(1)
  const [seed, setSeed] = useState(randomSeed)
  const [questionsOverflow, setQuestionsOverflow] = useState(false)
  const [selectedCoordShape, setSelectedCoordShape] = useState<CoordShape | null>('triangle')
  const previewFrameRef = useRef<HTMLDivElement>(null)

  const activePage = pages[pageIndex] ?? pages[0]!
  const pageExerciseBlocks = pageBlocks(activePage)
  const safeBlockIndex = Math.min(blockIndex, Math.max(0, pageExerciseBlocks.length - 1))
  const activeBlock = pageExerciseBlocks[safeBlockIndex] ?? blockFromPage(activePage)
  const available =
    activePage.domain === 'français'
      ? frenchTopics
      : activePage.domain === 'algèbre'
        ? algebraTopics
        : activePage.domain === 'géométrie'
          ? geometryTopics
          : lectureTopics
  const typeChoices = typesForTopic(
    activeBlock.topic,
    activePage.domain === 'français' ? (activeBlock.track ?? 'voc') : undefined,
  )
  const worksheets = useMemo(() => buildWorksheets(pages, seed), [pages, seed])
  const firstExerciseNo = exerciseStartIndex(pages, pageIndex)
  const sheetTotalPoints = useMemo(
    () => worksheets.reduce((sum, page) => sum + page.items.length * pointsPerQuestion, 0),
    [worksheets, pointsPerQuestion],
  )

  useEffect(() => {
    const frame = previewFrameRef.current
    if (!frame) return

    const measure = () => {
      const sheet = frame.querySelector('.worksheet-sheet') as HTMLElement | null
      const body = frame.querySelector('.sheet-body') as HTMLElement | null
      const grid = frame.querySelector('.exercise-grid') as HTMLElement | null
      const footer = frame.querySelector('.doc-footer') as HTMLElement | null
      if (!sheet || !body || !grid) {
        setQuestionsOverflow(false)
        return
      }

      // Hauteur naturelle du contenu (sans compression) vs place disponible sous l'en-tête.
      const contentHeight = Math.max(grid.scrollHeight, grid.offsetHeight)
      const bodyLimit = body.clientHeight
      const sheetOverflow = sheet.scrollHeight > sheet.clientHeight + 2
      const bodyOverflow = body.scrollHeight > body.clientHeight + 2
      const gridOverflow = contentHeight > bodyLimit + 2

      // Pied chevauché / poussé hors feuille si le corps déborde.
      let footerClash = false
      if (footer) {
        const sheetBox = sheet.getBoundingClientRect()
        const footerBox = footer.getBoundingClientRect()
        footerClash = footerBox.bottom > sheetBox.bottom + 1
      }

      setQuestionsOverflow(sheetOverflow || bodyOverflow || gridOverflow || footerClash)
    }

    measure()
    const raf = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    const sheet = frame.querySelector('.worksheet-sheet')
    const body = frame.querySelector('.sheet-body')
    const grid = frame.querySelector('.exercise-grid')
    if (sheet) observer.observe(sheet)
    if (body) observer.observe(body)
    if (grid) observer.observe(grid)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [
    worksheets,
    pageIndex,
    mode,
    seed,
    activeBlock.count,
    activeBlock.columns,
    activeBlock.exerciseType,
    activeBlock.coordLibre,
    activeBlock.coordCols,
    activeBlock.coordRows,
    activeBlock.coordAxis,
    activeBlock.coordRange,
    activeBlock.coordMarks,
    activePage.extraBlocks,
    evalMode,
    headerStyle,
    institutional,
    custom,
  ])

  const updatePage = (patch: Partial<PageConfig>) =>
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        if (patch.domain != null && patch.exerciseType != null) {
          return { ...page, ...patch, extraBlocks: undefined }
        }
        const merged = setPageBlock(page, safeBlockIndex, patch)
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
            problemDraftGrids: isProblemExercise(fixed.exerciseType)
              ? resizeDraftGrids(fixed.problemDraftGrids, count)
              : undefined,
          }
        }
        if (isReperageCadrans(fixed.exerciseType) && fixed.coordMarks) {
          fixed = { ...fixed, coordMarks: fixed.coordMarks.slice(0, Math.max(0, fixed.count)) }
        }
        return setPageBlock(merged, safeBlockIndex, fixed)
      }),
    )

  const toggleDraftGrid = (itemIndex: number, targetBlock = safeBlockIndex) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const grids = resizeDraftGrids(block.problemDraftGrids, block.count)
        grids[itemIndex] = !(grids[itemIndex] ?? true)
        return setPageBlock(page, targetBlock, { problemDraftGrids: grids })
      }),
    )
  }

  const setAllDraftGrids = (value: boolean) => {
    updatePage({
      problemDraftGrids: Array.from({ length: activeBlock.count }, () => value),
    })
  }

  const isReperage = isReperagePage(activeBlock.exerciseType)
  const isCadrans = isReperageCadrans(activeBlock.exerciseType)
  const isFormes = isReperageFormes(activeBlock.exerciseType)
  const isDroites = isReperageDroites(activeBlock.exerciseType)
  const isConstruire = isReperageConstruire(activeBlock.exerciseType)
  const activeAsPage = pageAsConfig(activePage, activeBlock)

  const placeCoordMark = (x: number, y: number, kind: CoordShape) => {
    if (isCadrans) {
      const range = clampCoordRange(activeBlock.coordRange ?? axesRangeFor(activeBlock.difficulty))
      if (Math.abs(x) > range || Math.abs(y) > range) return
      const without = (activeBlock.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y))
      const current = (activeBlock.coordMarks ?? []).find((mark) => mark.x === x && mark.y === y)
      if (!current && without.length >= activeBlock.count) return
      updatePage({
        coordLibre: true,
        coordRange: range,
        coordMarks: [...without, { x, y, kind: 'point', label: current?.label ?? nextPointLabel(without) }],
      })
      return
    }
    const cols = clampCoordSize(activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty).cols)
    const rows = clampCoordSize(activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty).rows)
    if (x < 1 || y < 1 || x > cols || y > rows) return
    const without = (activeBlock.coordMarks ?? []).filter(
      (mark) => !(mark.x === x && mark.y === y) && mark.kind !== kind,
    )
    if (without.length >= COORD_SHAPES.length) return
    const nextMarks = [...without, { x, y, kind }]
    updatePage({
      coordLibre: true,
      coordCols: cols,
      coordRows: rows,
      coordAxis: activeBlock.coordAxis ?? 'letters',
      coordMarks: nextMarks,
      count: Math.max(activeBlock.count, nextMarks.length),
    })
  }

  const removeCoordMark = (x: number, y: number) => {
    updatePage({
      coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y)),
    })
  }

  const addPage = () => {
    const first = blockFromPage(activePage)
    const next: PageConfig = {
      domain: activePage.domain,
      ...first,
      extraBlocks: activePage.extraBlocks?.map((block) => ({ ...block })),
    }
    setPages((current) => [...current, next])
    setPageIndex(pages.length)
    setBlockIndex(0)
  }

  const addExerciseOnPage = () => {
    const currentTypes = typesForTopic(
      activeBlock.topic,
      activePage.domain === 'français' ? (activeBlock.track ?? 'voc') : undefined,
    )
    const currentIdx = currentTypes.findIndex((type) => type.id === activeBlock.exerciseType)
    const nextType =
      currentTypes[(currentIdx + 1) % Math.max(currentTypes.length, 1)] ??
      currentTypes[0] ??
      firstTypeFor(activePage.domain, activeBlock.topic, activeBlock.track)
    if (!nextType) return
    const fields = applyType(nextType)
    const count = Math.min(fields.count ?? 4, 4)
    const newBlock: ExerciseBlock = {
      topic: nextType.topic,
      exerciseType: nextType.id,
      difficulty: activeBlock.difficulty,
      count,
      columns: fields.columns ?? nextType.preferredColumns ?? 2,
      track: nextType.track,
      problemDraftGrids: isProblemExercise(nextType.id)
        ? Array.from({ length: count }, () => true)
        : undefined,
      coordLibre: fields.coordLibre,
      coordCols: fields.coordCols,
      coordRows: fields.coordRows,
      coordAxis: fields.coordAxis,
      coordMarks: fields.coordMarks,
      coordRange: fields.coordRange,
    }
    setPages((current) =>
      current.map((page, index) => (index === pageIndex ? addPageBlock(page, newBlock) : page)),
    )
    setBlockIndex(pageExerciseBlocks.length)
  }

  function changeDomain(next: Domain) {
    const type = firstTypeFor(next)
    setBlockIndex(0)
    updatePage({ domain: next, ...applyType(type) })
    if (next === 'français' || next === 'lecture') {
      setInstitutional((current) =>
        current.course === 'Mathématiques' ? { ...current, course: 'Français' } : current,
      )
    }
  }

  function changeTopic(topic: string) {
    const type =
      typesForTopic(topic, activePage.domain === 'français' ? (activeBlock.track ?? 'voc') : undefined)[0] ??
      firstTypeFor(activePage.domain, topic, activeBlock.track)
    updatePage({ topic, ...applyType(type) })
  }

  function changeTrack(track: FrenchTrack) {
    const type = typesForTopic(activeBlock.topic, track)[0] ?? firstTypeFor('français', activeBlock.topic, track)
    updatePage({ track, ...applyType(type) })
  }

  function generate() {
    setSeed(randomSeed())
    setMode('student')
  }

  function printAll() {
    window.print()
  }

  const chromeProps = {
    headerStyle,
    institutional,
    custom,
    evalMode,
    documentTotalPoints: sheetTotalPoints,
    pointsPerQuestion,
  } as const

  const sheetProps = {
    mode,
    ...chromeProps,
  } as const


  return (
    <div className="app-shell">
      <Header onCreate={() => undefined} generator />
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
        <div className="workspace">
          <aside className="settings-panel no-print">
            <div className="panel-title">
              <h3>Paramètres de l’activité</h3>
              <span>
                {pages.length} page{pages.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="page-tabs">
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={pageIndex === index ? 'active' : ''}
                  onClick={() => {
                    setPageIndex(index)
                    setBlockIndex(0)
                  }}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              <button className="add-page" type="button" onClick={addPage} aria-label="Nouvelle page">
                +
              </button>
            </div>
            {pageExerciseBlocks.length > 1 ? (
              <div className="page-tabs exercise-tabs" role="tablist" aria-label="Exercices de la page">
                {pageExerciseBlocks.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={safeBlockIndex === index ? 'active' : ''}
                    onClick={() => setBlockIndex(index)}
                    aria-label={`Exercice ${firstExerciseNo + index}`}
                  >
                    {firstExerciseNo + index}
                    {pageExerciseBlocks.length > 1 && index === safeBlockIndex ? (
                      <span
                        className="exercise-tab-remove"
                        role="button"
                        tabIndex={0}
                        aria-label="Retirer cet exercice"
                        onClick={(event) => {
                          event.stopPropagation()
                          setPages((current) =>
                            current.map((page, pageIdx) =>
                              pageIdx === pageIndex ? removePageBlock(page, index) : page,
                            ),
                          )
                          setBlockIndex(Math.max(0, index - 1))
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          event.preventDefault()
                          event.stopPropagation()
                          setPages((current) =>
                            current.map((page, pageIdx) =>
                              pageIdx === pageIndex ? removePageBlock(page, index) : page,
                            ),
                          )
                          setBlockIndex(Math.max(0, index - 1))
                        }}
                      >
                        ×
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="field-group">
              <div className="mode-toggle-block">
                <b>Mode de la fiche</b>
                <div className="mode-toggle">
                  <button
                    type="button"
                    className={!evalMode ? 'active' : ''}
                    onClick={() => setEvalMode(false)}
                  >
                    Exercice
                  </button>
                  <button
                    type="button"
                    className={evalMode ? 'active' : ''}
                    onClick={() => {
                      setEvalMode(true)
                      if (!institutional.documentTitle.trim()) {
                        setInstitutional((current) => ({ ...current, documentTitle: 'Évaluation' }))
                      }
                    }}
                  >
                    Évaluation
                  </button>
                </div>
                {evalMode && (
                  <label>
                    Points par question
                    <input
                      className="pill-input"
                      type="number"
                      min={1}
                      max={20}
                      value={pointsPerQuestion}
                      onChange={(event) =>
                        setPointsPerQuestion(Math.max(1, Math.min(20, Number(event.target.value) || 1)))
                      }
                    />
                    <small className="muted">
                      Total document : {sheetTotalPoints} pts
                      {pages.length > 1
                        ? ` (${pages.length} pages × points par question)`
                        : ` (${worksheets[pageIndex]?.items.length ?? 0} × ${pointsPerQuestion})`}
                    </small>
                  </label>
                )}
              </div>

              <SelectBox label="Domaine" value={activePage.domain} onChange={(value) => changeDomain(value as Domain)}>
                <option value="français">Français</option>
                <option value="algèbre">Algèbre</option>
                <option value="géométrie">Géométrie</option>
                {SHOW_LECTURE_DOMAIN ? <option value="lecture">Lecture</option> : null}
              </SelectBox>
              <SelectBox label="Thème" value={activeBlock.topic} onChange={changeTopic}>
                {available.map((topic) => (
                  <option value={topic.id} key={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </SelectBox>
              {activePage.domain === 'français' ? (
                <div className="mode-toggle-block">
                  <b>Voc · Gram · Com</b>
                  <div className="mode-toggle is-3" role="group" aria-label="Vocabulaire, grammaire ou communication">
                    {FRENCH_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        className={(activeBlock.track ?? 'voc') === track.id ? 'active' : ''}
                        onClick={() => changeTrack(track.id)}
                      >
                        {track.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <SelectBox
                label="Type d’exercice"
                value={activeBlock.exerciseType}
                onChange={(value) => {
                  const type = exerciseTypeById[value]
                  if (!type) return
                  if (
                    (isReperageFormes(value) && isReperageFormes(activeBlock.exerciseType)) ||
                    (isReperageCadrans(value) && isReperageCadrans(activeBlock.exerciseType))
                  ) {
                    updatePage({
                      exerciseType: value,
                      topic: type.topic,
                      track: type.track,
                      coordLibre: value === 'reperage-cadrans-libre' ? true : activeBlock.coordLibre,
                    })
                    return
                  }
                  updatePage(applyType(type))
                }}
              >
                {typeChoices.map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.label}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                label="Niveau"
                value={activeBlock.difficulty ?? 'moyen'}
                onChange={(value) => updatePage({ difficulty: value as Difficulty })}
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option value={opt.value} key={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SelectBox>
              <label className="select-shell">
                <span>{isReperage ? 'Questions' : 'QUESTIONS'}</span>
                <input
                  className={`pill-input${questionsOverflow ? ' is-overflow' : ''}`}
                  aria-label="Nombre de questions"
                  aria-invalid={questionsOverflow}
                  title={
                    questionsOverflow
                      ? 'Trop de questions pour une seule fiche A4. Réduisez le nombre ou ajoutez une page.'
                      : undefined
                  }
                  type="number"
                  min={1}
                  max={isFormes ? COORD_SHAPES.length : 30}
                  value={activeBlock.count}
                  onChange={(event) =>
                    updatePage({
                      count: Math.max(
                        1,
                        Math.min(isFormes ? COORD_SHAPES.length : 30, Number(event.target.value) || 1),
                      ),
                    })
                  }
                />
                {questionsOverflow ? (
                  <p className="questions-overflow-hint" role="status">
                    Les questions suivantes dépassent de la fiche. Réduisez le nombre ou ajoutez une page.
                  </p>
                ) : null}
              </label>
              <div className="mode-toggle-block">
                <b>Colonnes</b>
                <div className="mode-toggle is-3" role="group" aria-label="Nombre de colonnes">
                  {[1, 2, 3].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={activeBlock.columns === value ? 'active' : ''}
                      onClick={() => updatePage({ columns: value })}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              {isFormes ? (
                <div className="coord-libre-panel">
                  <b>Composition du tableau</b>
                  <div className="mode-toggle" role="group" aria-label="Mode du tableau">
                    <button
                      type="button"
                      className={!activeBlock.coordLibre ? 'active' : ''}
                      onClick={() => updatePage({ coordLibre: false })}
                    >
                      Automatique
                    </button>
                    <button
                      type="button"
                      className={activeBlock.coordLibre ? 'active' : ''}
                      onClick={() => {
                        const size = coordSizeFor(activeBlock.difficulty)
                        const empty = !activeBlock.coordMarks?.length
                        updatePage({
                          coordLibre: true,
                          coordCols: empty ? size.cols : (activeBlock.coordCols ?? size.cols),
                          coordRows: empty ? size.rows : (activeBlock.coordRows ?? size.rows),
                          coordAxis: activeBlock.coordAxis ?? 'letters',
                          coordMarks: activeBlock.coordMarks ?? [],
                        })
                      }}
                    >
                      Libre
                    </button>
                    </div>
                  <SelectBox
                    label="Axes"
                    value={activeBlock.coordAxis ?? 'letters'}
                    onChange={(value) => updatePage({ coordAxis: value as CoordAxis })}
                  >
                    <option value="letters">Lettres en bas</option>
                    <option value="letters-y">Lettres à gauche</option>
                    <option value="numeric">Nombres seulement</option>
                  </SelectBox>
                  <div className="coord-size-row">
                    <label>
                      Largeur
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={20}
                        value={activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty).cols}
                        onChange={(event) => {
                          const cols = clampCoordSize(Number(event.target.value))
                          updatePage({
                            coordCols: cols,
                            coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => mark.x <= cols),
                          })
                        }}
                      />
                    </label>
                    <label>
                      Hauteur
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={20}
                        value={activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty).rows}
                        onChange={(event) => {
                          const rows = clampCoordSize(Number(event.target.value))
                          updatePage({
                            coordRows: rows,
                            coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => mark.y <= rows),
                          })
                        }}
                      />
                    </label>
                  </div>
                  {activeBlock.coordLibre ? (
                    <>
                      <div className="coord-palette" role="listbox" aria-label="Formes à placer">
                        {COORD_SHAPES.map((kind) => {
                          const used = (activeBlock.coordMarks ?? []).some((mark) => mark.kind === kind)
                          return (
                          <button
                            key={kind}
                            type="button"
                            role="option"
                            draggable
                            aria-selected={selectedCoordShape === kind}
                            className={`coord-palette-item${selectedCoordShape === kind ? ' selected' : ''}${used ? ' used' : ''}`}
                            title={used ? `${COORD_SHAPE_LABEL[kind]} (déjà sur le tableau)` : COORD_SHAPE_LABEL[kind]}
                            onClick={() => setSelectedCoordShape(kind)}
                            onDragStart={(event) => {
                              event.dataTransfer.setData('coord-kind', kind)
                              event.dataTransfer.effectAllowed = 'copy'
                              setSelectedCoordShape(kind)
                            }}
                          >
                            <CoordShapeButton kind={kind} />
                            <span>{COORD_SHAPE_LABEL[kind]}</span>
                          </button>
                          )
                        })}
                      </div>
                      <CoordEditorBoard
                        scene={sceneFromLibre(activeAsPage)}
                        selectedKind={selectedCoordShape}
                        onPlace={placeCoordMark}
                        onRemove={removeCoordMark}
                      />
                      <p className="type-hint muted">
                        Vous pouvez placer toutes les formes, une seule fois chacune. Glissez une forme sur une case,
                        ou cliquez une forme puis une case. Largeur et hauteur règlent la taille du tableau, jusqu’à
                        20 × 20.
                      </p>
                      <p className="type-hint muted">
                        {(activeBlock.coordMarks?.length ?? 0)} / {COORD_SHAPES.length} forme
                        {COORD_SHAPES.length > 1 ? 's' : ''}
                      </p>
                      {(activeBlock.coordMarks?.length ?? 0) > 0 ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => updatePage({ coordMarks: [] })}
                        >
                          Vider le tableau
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="type-hint muted">
                      Une seule grille. Chaque forme n’apparaît qu’une fois. Le champ Questions ajoute des formes.
                      Largeur et hauteur règlent la taille du tableau, indépendamment du nombre de questions. Vous
                      pouvez afficher les questions sur 1, 2 ou 3 colonnes.
                    </p>
                  )}
                </div>
              ) : isCadrans ? (
                <div className="coord-libre-panel">
                  <b>Repère (4 cadrans)</b>
                  {activeBlock.exerciseType !== 'reperage-cadrans-libre' ? (
                    <div className="mode-toggle" role="group" aria-label="Mode du repère">
                      <button
                        type="button"
                        className={!activeBlock.coordLibre ? 'active' : ''}
                        onClick={() => updatePage({ coordLibre: false })}
                      >
                        Automatique
                      </button>
                      <button
                        type="button"
                        className={activeBlock.coordLibre ? 'active' : ''}
                        onClick={() =>
                          updatePage({
                            coordLibre: true,
                            coordRange: activeBlock.coordRange ?? axesRangeFor(activeBlock.difficulty),
                            coordMarks: activeBlock.coordMarks ?? [],
                          })
                        }
                      >
                        Libre
                      </button>
                    </div>
                  ) : null}
                  <label>
                    Étendue (−n à +n)
                    <input
                      className="pill-input"
                      type="number"
                      min={3}
                      max={20}
                      value={activeBlock.coordRange ?? axesRangeFor(activeBlock.difficulty)}
                      onChange={(event) => {
                        const range = clampCoordRange(Number(event.target.value))
                        updatePage({
                          coordRange: range,
                          coordMarks: (activeBlock.coordMarks ?? []).filter(
                            (mark) => Math.abs(mark.x) <= range && Math.abs(mark.y) <= range,
                          ),
                        })
                      }}
                    />
                  </label>
                  {activeBlock.coordLibre || activeBlock.exerciseType === 'reperage-cadrans-libre' ? (
                    <>
                      <div className="coord-axes-editor">
                        <CoordGrid
                          scene={sceneFromAxesLibre(activeAsPage, activeBlock.difficulty)}
                          editable
                          onPlace={(x, y) => placeCoordMark(x, y, 'point')}
                          onRemove={removeCoordMark}
                        />
                      </div>
                      <p className="type-hint muted">
                        Cliquez une intersection pour poser A, B, C… Le champ Questions limite le nombre de points.
                        Cliquez un point pour le retirer. L’étendue va jusqu’à −20 / +20.
                      </p>
                      <p className="type-hint muted">
                        {(activeBlock.coordMarks?.length ?? 0)} / {activeBlock.count} point
                        {activeBlock.count > 1 ? 's' : ''}
                      </p>
                      {(activeBlock.coordMarks?.length ?? 0) > 0 ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() => updatePage({ coordMarks: [] })}
                        >
                          Vider le repère
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="type-hint muted">
                      Une seule grille à 4 cadrans. Le champ Questions ajoute des points. L’étendue (−n à +n) règle la
                      taille du repère, jusqu’à −20 / +20. Avancé : demi-unités.
                    </p>
                  )}
                </div>
              ) : isDroites ? (
                <div className="coord-libre-panel">
                  <b>Repère (droites)</b>
                  <label>
                    Étendue (−n à +n)
                    <input
                      className="pill-input"
                      type="number"
                      min={3}
                      max={20}
                      value={activeBlock.coordRange ?? axesRangeFor(activeBlock.difficulty)}
                      onChange={(event) => updatePage({ coordRange: clampCoordRange(Number(event.target.value)) })}
                    />
                  </label>
                  <p className="type-hint muted">
                    Une seule grille centrée. Le champ Questions fixe le nombre de questions. L’étendue règle la taille
                    du repère, jusqu’à −20 / +20. Chaque droite a une couleur et un tracé distinct, lisible en noir et
                    blanc.
                  </p>
                </div>
              ) : isConstruire ? (
                <div className="coord-libre-panel">
                  <b>Repère (construction)</b>
                  <label>
                    Étendue (−n à +n)
                    <input
                      className="pill-input"
                      type="number"
                      min={3}
                      max={20}
                      value={activeBlock.coordRange ?? constructRangeFor(activeBlock.difficulty)}
                      onChange={(event) => updatePage({ coordRange: clampCoordRange(Number(event.target.value)) })}
                    />
                  </label>
                  <p className="type-hint muted">
                    Une grille vide centrée, avec deux points donnés. Le champ Questions fixe le nombre de consignes.
                    L’étendue règle la taille du repère, jusqu’à −20 / +20. Le corrigé montre les tracés.
                  </p>
                </div>
              ) : null}
              {isProblemExercise(activeBlock.exerciseType) ? (
                <div className="mode-toggle draft-grid-page-toggle" role="group" aria-label="Grille de brouillon">
                  {(() => {
                    const grids = resizeDraftGrids(activeBlock.problemDraftGrids, activeBlock.count)
                    const allOn = grids.every(Boolean)
                    const allOff = grids.every((v) => !v)
                    return (
                      <>
                        <button
                          type="button"
                          className={allOn ? 'active' : ''}
                          onClick={() => setAllDraftGrids(true)}
                        >
                          Grille 4×4
                        </button>
                        <button
                          type="button"
                          className={allOff ? 'active' : ''}
                          onClick={() => setAllDraftGrids(false)}
                        >
                          Cadre seul
                        </button>
                      </>
                    )
                  })()}
                </div>
              ) : null}

              <details className="header-editor">
                <summary className="header-editor-summary">
                  <span>En-tête et pied de page</span>
                  <span className="header-editor-hint">Modifier</span>
                </summary>
                <div className="custom-header-form">
                  <div className="mode-toggle">
                    <button
                      type="button"
                      className={headerStyle === 'institutionnel' ? 'active' : ''}
                      onClick={() => setHeaderStyle('institutionnel')}
                    >
                      Institutionnel
                    </button>
                    <button
                      type="button"
                      className={headerStyle === 'personnalise' ? 'active' : ''}
                      onClick={() => setHeaderStyle('personnalise')}
                    >
                      Personnalisé
                    </button>
                  </div>
                  {headerStyle === 'institutionnel' ? (
                    <>
                      <label>
                        Établissement
                        <input className="pill-input" value={institutional.schoolName}
                          onChange={(event) => setInstitutional({ ...institutional, schoolName: event.target.value })}
                        />
                      </label>
                      <label>
                        Année
                        <input className="pill-input" value={institutional.schoolYear}
                          onChange={(event) => setInstitutional({ ...institutional, schoolYear: event.target.value })}
                        />
                      </label>
                      <label>
                        Mention
                        <input className="pill-input" value={institutional.schoolTagline}
                          onChange={(event) => setInstitutional({ ...institutional, schoolTagline: event.target.value })}
                        />
                      </label>
                      <label>
                        Organisation (ligne 1)
                        <input className="pill-input" value={institutional.orgLine1}
                          onChange={(event) => setInstitutional({ ...institutional, orgLine1: event.target.value })}
                        />
                      </label>
                      <label>
                        Organisation (ligne 2)
                        <input className="pill-input" value={institutional.orgLine2}
                          onChange={(event) => setInstitutional({ ...institutional, orgLine2: event.target.value })}
                        />
                      </label>
                      <label>
                        Organisation (ligne 3)
                        <input className="pill-input" value={institutional.orgLine3}
                          onChange={(event) => setInstitutional({ ...institutional, orgLine3: event.target.value })}
                        />
                      </label>
                      <SelectBox
                        label="Classe"
                        value={institutional.classLevel}
                        onChange={(value) => setInstitutional({ ...institutional, classLevel: value })}
                      >
                        {CLASS_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </SelectBox>
                      <SelectBox
                        label="N° de classe"
                        value={institutional.classNumber}
                        onChange={(value) => setInstitutional({ ...institutional, classNumber: value })}
                      >
                        {CLASS_NUMBERS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </SelectBox>
                      <SelectBox
                        label="Cours"
                        value={institutional.course}
                        onChange={(value) => setInstitutional({ ...institutional, course: value })}
                      >
                        {COURSES.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </SelectBox>
                      <label>
                        Titre du document
                        <input className="pill-input" value={institutional.documentTitle}
                          onChange={(event) =>
                            setInstitutional({ ...institutional, documentTitle: event.target.value })
                          }
                          placeholder={evalMode ? 'Évaluation' : activeBlock.topic}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        Logo ou nom
                        <input className="pill-input" value={custom.logo} onChange={(event) => setCustom({ ...custom, logo: event.target.value })} />
                      </label>
                      <label>
                        Titre personnalisé
                        <input className="pill-input" value={custom.title}
                          onChange={(event) => setCustom({ ...custom, title: event.target.value })}
                          placeholder="Ex. Collège des Tilleuls"
                        />
                      </label>
                      <label>
                        Sous-titre
                        <input className="pill-input" value={custom.subtitle}
                          onChange={(event) => setCustom({ ...custom, subtitle: event.target.value })}
                          placeholder="Ex. Groupe 7H · Mathématiques"
                        />
                      </label>
                    </>
                  )}
                </div>
              </details>
              <p className="type-hint muted">
                {exerciseTypeById[activeBlock.exerciseType]?.description ??
                  'Choisissez un thème, puis un type d’exercice.'}
              </p>
              <button className="button full" type="button" onClick={generate}>
                Générer une nouvelle fiche <span>→</span>
              </button>
            </div>
          </aside>
          <section className="result-panel">
            <div className="result-head">
              <div>
                <p className="eyebrow">Aperçu</p>
                <h2>Votre activité est prête.</h2>
              </div>
              <div className="result-head-actions no-print">
                <div className="preview-tabs" role="tablist" aria-label="Mode d’aperçu">
                  <button type="button" className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>
                    Fiche élève
                  </button>
                  <button type="button" className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>
                    Corrigé
                  </button>
                </div>
                <button className="print-chip" type="button" onClick={printAll} aria-label="Imprimer la fiche et le corrigé">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M7 3h10v4H7V3zm-3 6h16a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zm2 8v2h8v-2H6zm12-5.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM7 14h10v1H7v-1z"
                    />
                  </svg>
                  Imprimer
                </button>
              </div>
            </div>
            <div className="sheet-preview-wrap no-print-nav">
              <div className="sheet-preview-cluster">
                <div className="sheet-preview-row">
                  <div className="sheet-stage">
                    <div className="a4-frame" ref={previewFrameRef}>
                      <WorksheetSheet
                        key={`${worksheets[pageIndex]?.exerciseType}-${seed}-${pageIndex}-${pageExerciseBlocks.length}`}
                        page={worksheets[pageIndex]!}
                        pageNumber={pageIndex + 1}
                        sheetIndex={pageIndex + 1}
                        total={worksheets.length}
                        interactiveDraftGrids={isProblemExercise(activeBlock.exerciseType)}
                        onToggleDraftGrid={toggleDraftGrid}
                        coordEdit={
                          (isFormes && activeBlock.coordLibre) ||
                          (isCadrans && (activeBlock.coordLibre || activeBlock.exerciseType === 'reperage-cadrans-libre'))
                            ? {
                                selectedKind: selectedCoordShape,
                                onPlace: placeCoordMark,
                                onRemove: removeCoordMark,
                              }
                            : undefined
                        }
                        {...sheetProps}
                      />
                    </div>
                  </div>
                  <button
                    className="sheet-add-fab no-print"
                    type="button"
                    onClick={addPage}
                    aria-label="Ajouter une page"
                    title="Ajouter une page"
                  >
                    +
                  </button>
                </div>
                <button
                  className="sheet-add-fab is-below no-print"
                  type="button"
                  onClick={addExerciseOnPage}
                  aria-label="Ajouter un exercice sur cette page"
                  title="Ajouter un exercice sur cette page"
                >
                  +
                </button>
              </div>
            </div>
            {/* Impression : toutes les fiches élèves, puis tous les corrigés */}
            <div className="sheet-stage print-only-sheets" aria-hidden>
              {worksheets.map((page, index) => (
                <WorksheetSheet
                  key={`print-student-${page.exerciseType}-${seed}-${index}`}
                  page={page}
                  pageNumber={index + 1}
                  sheetIndex={index + 1}
                  total={worksheets.length}
                  {...chromeProps}
                  mode="student"
                />
              ))}
              {worksheets.map((page, index) => (
                <WorksheetSheet
                  key={`print-answers-${page.exerciseType}-${seed}-${index}`}
                  page={page}
                  pageNumber={index + 1}
                  sheetIndex={worksheets.length + index + 1}
                  total={worksheets.length}
                  {...chromeProps}
                  mode="answers"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [generator, setGenerator] = useState(window.location.pathname === '/generateur')
  const openGenerator = () => {
    const typed = window.prompt('Mot de passe pour créer une fiche')
    if (typed !== FICHE_ACCESS_PASSWORD) {
      if (typed != null) window.alert('Mot de passe incorrect.')
      return
    }
    window.history.pushState({}, '', '/generateur')
    setGenerator(true)
  }
  return generator ? <GeneratorPage /> : <Landing onCreate={openGenerator} />
}

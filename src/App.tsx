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
  geometryTopics,
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
import { buildPage } from '@/math/generate'
import { randomSeed } from '@/math/rng'
import type { CoordAxis, CoordShape, Difficulty, Domain, ExerciseType, PageConfig, PreviewMode, WorksheetPage } from '@/math/types'

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
  /** Affiche le bouton grille / sans grille sur chaque problème (aperçu seulement). */
  interactiveDraftGrids?: boolean
  onToggleDraftGrid?: (index: number) => void
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
        <div className="sheet-instruction">
          <div className="sheet-instruction-main">
            <b>Consigne</b>
            <p>{page.instruction}</p>
            {page.givens && page.givens.length > 0 ? (
              <p className="sheet-givens" aria-label="Valeurs des variables">
                {page.givens.map((given, index) => (
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
            <span className="instruction-points">{documentTotalPoints} points</span>
          ) : null}
        </div>
        <div
          className={`exercise-grid${
            page.items.every((item) => item.layout === 'algebra')
              ? ' algebra-grid'
              : isDraftPadPage
                ? ' problem-grid'
                : ''
          }`}
        >
          {(() => {
            const algebraItems = page.items.filter((item) => item.layout === 'algebra')
            const maxTokens =
              algebraItems.length > 0
                ? Math.max(...algebraItems.map((item) => tokenizeAlgebra(item.prompt ?? '').length))
                : 0
            return page.items.map((item, index) => {
              const padLeft =
                item.layout === 'algebra' ? Math.max(0, maxTokens - tokenizeAlgebra(item.prompt ?? '').length) : 0
              const draftGrid = page.problemDraftGrids?.[index] ?? true
              return (
                <MathItemView
                  key={`${page.exerciseType}-${index}-${item.answer}`}
                  item={item}
                  mode={mode}
                  index={index}
                  algebraPadLeft={padLeft}
                  draftGrid={draftGrid}
                  onToggleDraftGrid={
                    interactiveDraftGrids && onToggleDraftGrid
                      ? () => onToggleDraftGrid(index)
                      : undefined
                  }
                  coordEdit={coordEdit}
                />
              )
            })
          })()}
        </div>
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

function applyType(type: ExerciseType): Partial<PageConfig> {
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
  const coordSize = coordSizeFor('moyen')
  return {
    exerciseType: type.id,
    topic: type.topic,
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
              : isFormes
                ? { count: 5 }
                : isCadrans
                  ? { count: 6 }
                  : isDroites || isConstruire
                    ? { count: 5 }
                    : type.id === 'perimetres-composees'
                      ? { count: 4 }
                      : type.id === 'perimetres-melange'
                        ? { count: 6 }
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

function isDraftPadExercise(typeId: string): boolean {
  return typeId.includes('problemes') || typeId.startsWith('equations-')
}

function isProblemExercise(typeId: string): boolean {
  return isDraftPadExercise(typeId)
}

function GeneratorPage() {
  const initial = defaultPage('algèbre')
  const [pages, setPages] = useState<PageConfig[]>([initial])
  const [pageIndex, setPageIndex] = useState(0)
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
  const available =
    activePage.domain === 'algèbre'
      ? algebraTopics
      : activePage.domain === 'géométrie'
        ? geometryTopics
        : lectureTopics
  const worksheets = useMemo(
    () => pages.map((page, index) => buildPage(page, seed + index * 7919)),
    [pages, seed],
  )
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
    activePage.count,
    activePage.columns,
    activePage.exerciseType,
    activePage.coordLibre,
    activePage.coordCols,
    activePage.coordRows,
    activePage.coordAxis,
    activePage.coordRange,
    activePage.coordMarks,
    evalMode,
    headerStyle,
    institutional,
    custom,
  ])

  const updatePage = (patch: Partial<PageConfig>) =>
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const next = { ...page, ...patch }
        if (
          patch.exerciseType != null &&
          patch.exerciseType.startsWith('equations-') &&
          !page.exerciseType.startsWith('equations-') &&
          patch.count == null
        ) {
          next.count = Math.min(next.count, 2)
        }
        if (patch.count != null || patch.exerciseType != null) {
          const count = patch.count ?? next.count
          next.problemDraftGrids = isProblemExercise(next.exerciseType)
            ? resizeDraftGrids(next.problemDraftGrids, count)
            : undefined
        }
        if (isReperageCadrans(next.exerciseType) && next.coordMarks) {
          next.coordMarks = next.coordMarks.slice(0, Math.max(0, next.count))
        }
        return next
      }),
    )

  const toggleDraftGrid = (itemIndex: number) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const grids = resizeDraftGrids(page.problemDraftGrids, page.count)
        grids[itemIndex] = !(grids[itemIndex] ?? true)
        return { ...page, problemDraftGrids: grids }
      }),
    )
  }

  const setAllDraftGrids = (value: boolean) => {
    updatePage({
      problemDraftGrids: Array.from({ length: activePage.count }, () => value),
    })
  }

  const isReperage = isReperagePage(activePage.exerciseType)
  const isCadrans = isReperageCadrans(activePage.exerciseType)
  const isFormes = isReperageFormes(activePage.exerciseType)
  const isDroites = isReperageDroites(activePage.exerciseType)
  const isConstruire = isReperageConstruire(activePage.exerciseType)

  const placeCoordMark = (x: number, y: number, kind: CoordShape) => {
    if (isCadrans) {
      const range = clampCoordRange(activePage.coordRange ?? axesRangeFor(activePage.difficulty))
      if (Math.abs(x) > range || Math.abs(y) > range) return
      const without = (activePage.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y))
      const current = (activePage.coordMarks ?? []).find((mark) => mark.x === x && mark.y === y)
      if (!current && without.length >= activePage.count) return
      updatePage({
        coordLibre: true,
        coordRange: range,
        coordMarks: [...without, { x, y, kind: 'point', label: current?.label ?? nextPointLabel(without) }],
      })
      return
    }
    const cols = clampCoordSize(activePage.coordCols ?? coordSizeFor(activePage.difficulty).cols)
    const rows = clampCoordSize(activePage.coordRows ?? coordSizeFor(activePage.difficulty).rows)
    if (x < 1 || y < 1 || x > cols || y > rows) return
    const without = (activePage.coordMarks ?? []).filter(
      (mark) => !(mark.x === x && mark.y === y) && mark.kind !== kind,
    )
    if (without.length >= COORD_SHAPES.length) return
    const nextMarks = [...without, { x, y, kind }]
    updatePage({
      coordLibre: true,
      coordCols: cols,
      coordRows: rows,
      coordAxis: activePage.coordAxis ?? 'letters',
      coordMarks: nextMarks,
      count: Math.max(activePage.count, nextMarks.length),
    })
  }

  const removeCoordMark = (x: number, y: number) => {
    updatePage({
      coordMarks: (activePage.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y)),
    })
  }

  const addPage = () => {
    const next: PageConfig = {
      domain: activePage.domain,
      topic: activePage.topic,
      exerciseType: activePage.exerciseType,
      difficulty: activePage.difficulty,
      count: activePage.count,
      columns: activePage.columns,
      ...(activePage.problemDraftGrids
        ? { problemDraftGrids: [...activePage.problemDraftGrids] }
        : isProblemExercise(activePage.exerciseType)
          ? { problemDraftGrids: Array.from({ length: activePage.count }, () => true) }
          : {}),
      ...(isReperagePage(activePage.exerciseType)
        ? {
            coordLibre: activePage.coordLibre,
            coordCols: activePage.coordCols,
            coordRows: activePage.coordRows,
            coordAxis: activePage.coordAxis,
            coordRange: activePage.coordRange,
            coordMarks: activePage.coordMarks ? [...activePage.coordMarks] : [],
          }
        : {}),
    }
    setPages((current) => [...current, next])
    setPageIndex(pages.length)
  }

  function changeDomain(next: Domain) {
    const type = firstTypeFor(next)
    updatePage({ domain: next, ...applyType(type) })
    if (next === 'lecture') {
      setInstitutional((current) =>
        current.course === 'Mathématiques' ? { ...current, course: 'Français' } : current,
      )
    }
  }

  function changeTopic(topic: string) {
    const type = typesForTopic(topic)[0] ?? firstTypeFor(activePage.domain, topic)
    updatePage({ topic, ...applyType(type) })
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
                  onClick={() => setPageIndex(index)}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
              <button className="add-page" type="button" onClick={addPage} aria-label="Nouvelle page">
                +
              </button>
            </div>
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
                <option value="algèbre">Algèbre</option>
                <option value="géométrie">Géométrie</option>
                <option value="lecture">Lecture</option>
              </SelectBox>
              <SelectBox label="Thème" value={activePage.topic} onChange={changeTopic}>
                {available.map((topic) => (
                  <option value={topic.id} key={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                label="Type d’exercice"
                value={activePage.exerciseType}
                onChange={(value) => {
                  const type = exerciseTypeById[value]
                  if (!type) return
                  if (
                    (isReperageFormes(value) && isReperageFormes(activePage.exerciseType)) ||
                    (isReperageCadrans(value) && isReperageCadrans(activePage.exerciseType))
                  ) {
                    updatePage({
                      exerciseType: value,
                      topic: type.topic,
                      coordLibre: value === 'reperage-cadrans-libre' ? true : activePage.coordLibre,
                    })
                    return
                  }
                  updatePage(applyType(type))
                }}
              >
                {typesForTopic(activePage.topic).map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.label}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                label="Niveau"
                value={activePage.difficulty ?? 'moyen'}
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
                  value={activePage.count}
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
              <SelectBox
                label="Colonnes"
                value={String(activePage.columns)}
                onChange={(value) => updatePage({ columns: Number(value) })}
              >
                <option value="1">1 colonne</option>
                <option value="2">2 colonnes</option>
                <option value="3">3 colonnes</option>
              </SelectBox>
              {isFormes ? (
                <div className="coord-libre-panel">
                  <b>Composition du tableau</b>
                  <div className="mode-toggle" role="group" aria-label="Mode du tableau">
                    <button
                      type="button"
                      className={!activePage.coordLibre ? 'active' : ''}
                      onClick={() => updatePage({ coordLibre: false })}
                    >
                      Automatique
                    </button>
                    <button
                      type="button"
                      className={activePage.coordLibre ? 'active' : ''}
                      onClick={() => {
                        const size = coordSizeFor(activePage.difficulty)
                        const empty = !activePage.coordMarks?.length
                        updatePage({
                          coordLibre: true,
                          coordCols: empty ? size.cols : (activePage.coordCols ?? size.cols),
                          coordRows: empty ? size.rows : (activePage.coordRows ?? size.rows),
                          coordAxis: activePage.coordAxis ?? 'letters',
                          coordMarks: activePage.coordMarks ?? [],
                        })
                      }}
                    >
                      Libre
                    </button>
                    </div>
                  <SelectBox
                    label="Axes"
                    value={activePage.coordAxis ?? 'letters'}
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
                        value={activePage.coordCols ?? coordSizeFor(activePage.difficulty).cols}
                        onChange={(event) => {
                          const cols = clampCoordSize(Number(event.target.value))
                          updatePage({
                            coordCols: cols,
                            coordMarks: (activePage.coordMarks ?? []).filter((mark) => mark.x <= cols),
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
                        value={activePage.coordRows ?? coordSizeFor(activePage.difficulty).rows}
                        onChange={(event) => {
                          const rows = clampCoordSize(Number(event.target.value))
                          updatePage({
                            coordRows: rows,
                            coordMarks: (activePage.coordMarks ?? []).filter((mark) => mark.y <= rows),
                          })
                        }}
                      />
                    </label>
                  </div>
                  {activePage.coordLibre ? (
                    <>
                      <div className="coord-palette" role="listbox" aria-label="Formes à placer">
                        {COORD_SHAPES.map((kind) => {
                          const used = (activePage.coordMarks ?? []).some((mark) => mark.kind === kind)
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
                        scene={sceneFromLibre(activePage)}
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
                        {(activePage.coordMarks?.length ?? 0)} / {COORD_SHAPES.length} forme
                        {COORD_SHAPES.length > 1 ? 's' : ''}
                      </p>
                      {(activePage.coordMarks?.length ?? 0) > 0 ? (
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
                  {activePage.exerciseType !== 'reperage-cadrans-libre' ? (
                    <div className="mode-toggle" role="group" aria-label="Mode du repère">
                      <button
                        type="button"
                        className={!activePage.coordLibre ? 'active' : ''}
                        onClick={() => updatePage({ coordLibre: false })}
                      >
                        Automatique
                      </button>
                      <button
                        type="button"
                        className={activePage.coordLibre ? 'active' : ''}
                        onClick={() =>
                          updatePage({
                            coordLibre: true,
                            coordRange: activePage.coordRange ?? axesRangeFor(activePage.difficulty),
                            coordMarks: activePage.coordMarks ?? [],
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
                      value={activePage.coordRange ?? axesRangeFor(activePage.difficulty)}
                      onChange={(event) => {
                        const range = clampCoordRange(Number(event.target.value))
                        updatePage({
                          coordRange: range,
                          coordMarks: (activePage.coordMarks ?? []).filter(
                            (mark) => Math.abs(mark.x) <= range && Math.abs(mark.y) <= range,
                          ),
                        })
                      }}
                    />
                  </label>
                  {activePage.coordLibre || activePage.exerciseType === 'reperage-cadrans-libre' ? (
                    <>
                      <div className="coord-axes-editor">
                        <CoordGrid
                          scene={sceneFromAxesLibre(activePage, activePage.difficulty)}
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
                        {(activePage.coordMarks?.length ?? 0)} / {activePage.count} point
                        {activePage.count > 1 ? 's' : ''}
                      </p>
                      {(activePage.coordMarks?.length ?? 0) > 0 ? (
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
                      value={activePage.coordRange ?? axesRangeFor(activePage.difficulty)}
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
                      value={activePage.coordRange ?? constructRangeFor(activePage.difficulty)}
                      onChange={(event) => updatePage({ coordRange: clampCoordRange(Number(event.target.value)) })}
                    />
                  </label>
                  <p className="type-hint muted">
                    Une grille vide centrée, avec deux points donnés. Le champ Questions fixe le nombre de consignes.
                    L’étendue règle la taille du repère, jusqu’à −20 / +20. Le corrigé montre les tracés.
                  </p>
                </div>
              ) : null}
              {isProblemExercise(activePage.exerciseType) ? (
                <div className="mode-toggle draft-grid-page-toggle" role="group" aria-label="Grille de brouillon">
                  {(() => {
                    const grids = resizeDraftGrids(activePage.problemDraftGrids, activePage.count)
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
                          placeholder={evalMode ? 'Évaluation' : activePage.topic}
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
                {exerciseTypeById[activePage.exerciseType]?.description ??
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
              <div className="sheet-stage">
                <div className="a4-frame" ref={previewFrameRef}>
                  <WorksheetSheet
                    key={`${worksheets[pageIndex]?.exerciseType}-${seed}-${pageIndex}`}
                    page={worksheets[pageIndex]!}
                    pageNumber={pageIndex + 1}
                    sheetIndex={pageIndex + 1}
                    total={worksheets.length}
                    interactiveDraftGrids={isProblemExercise(activePage.exerciseType)}
                    onToggleDraftGrid={toggleDraftGrid}
                    coordEdit={
                      (isFormes && activePage.coordLibre) ||
                      (isCadrans && (activePage.coordLibre || activePage.exerciseType === 'reperage-cadrans-libre'))
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

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
import { CoordGrid, CoordShapeButton } from '@/components/math/CoordGrid'
import { ItemView, tokenizeAlgebra } from '@/components/ItemView'
import {
  CLASS_LEVELS,
  CLASS_NUMBERS,
  COURSES,
  CustomDocumentHeader,
  DEFAULT_INSTITUTIONAL,
  DEFAULT_INSTITUTIONAL_LOGO,
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
  isQuadExercise,
  lectureTopics,
  phraseTopics,
  typesForTopic,
} from '@/math/catalog'
import { defaultVocabSelected, isVocabLearnType, isVocabPoolType, isVocabProductionType, vocabLearnWordsFor } from '@/francais/vocab-learn'
import { isGrammarTheoryType } from '@/francais/grammar-theory'
import {
  AXES_DEFAULT_COLS,
  AXES_DEFAULT_ROWS,
  CELL_MM_OPTIONS,
  COORD_SHAPES,
  COORD_SHAPE_LABEL,
  DEFAULT_CELL_MM,
  DEFAULT_FORMES_CELL_MM,
  DEFAULT_UNIT_SQUARES,
  FORMES_CELL_MM_OPTIONS,
  clampAxesCols,
  clampAxesRows,
  clampFormesCellMm,
  clampFormesCols,
  clampFormesRows,
  clampOrigin,
  centeredOrigin,
  COORD_LETTER_MAX,
  coordSizeFor,
  FORMES_MAX_BY_MM,
  ensureGivenMark,
  isReperageCadrans,
  isReperageComposer,
  isReperageConstruire,
  isReperageDroites,
  isReperageFormes,
  isReperagePage,
  markOnGrid,
  remapMarksToOrigin,
  maxAxesColsForCell,
  maxAxesRowsForCell,
  maxFormesColsForCell,
  maxFormesRowsForCell,
  nextPointLabel,
  resolveAxesGrid,
  sceneFromAxesLibre,
} from '@/math/coord-reperage'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import {
  AREA_QUAD_FIGURES,
  PERI_QUAD_FIGURES,
  QUAD_SHAPE_LABELS,
  VOLUME_QUAD_FIGURES,
} from '@/math/mesures'
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
  CoordCellMm,
  CoordShape,
  CoordUnitSquares,
  Difficulty,
  Domain,
  ExerciseBlock,
  ExerciseType,
  FrenchTrack,
  PageConfig,
  PhraseVerbGroup,
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
      oralAnswerModes: page.oralAnswerModes,
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
  interactiveOralModes = false,
  onCycleOralAnswerMode,
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
  /** Pastille QCM / texte / images pour la compréhension orale. */
  interactiveOralModes?: boolean
  onCycleOralAnswerMode?: (index: number, blockIndex?: number) => void
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
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
                    : block.items.every((item) => item.layout === 'theory')
                      ? ' theory-grid'
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
                  const oralAnswerMode =
                    block.oralAnswerModes?.[index] ?? page.oralAnswerModes?.[index] ?? item.answerMode ?? 'qcm'
                  return (
                    <ItemView
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
                      oralAnswerMode={item.selectVariant === 'oral' ? oralAnswerMode : undefined}
                      onCycleOralAnswerMode={
                        interactiveOralModes && onCycleOralAnswerMode && item.selectVariant === 'oral'
                          ? () => onCycleOralAnswerMode(index, blockIndex)
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

const THEME_STORAGE_KEY = 'clairfle-theme-color'
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/
/** Arc-en-ciel — tokens `:root` (`--red` … `--purple`). */
const THEME_COLORS = [
  { id: 'rouge', color: '#b42318', label: 'Rouge' },
  { id: 'orange', color: '#c45c12', label: 'Orange' },
  { id: 'jaune', color: '#a16207', label: 'Jaune' },
  { id: 'vert', color: '#18a66a', label: 'Vert' },
  { id: 'bleu', color: '#2563eb', label: 'Bleu' },
  { id: 'indigo', color: '#4338ca', label: 'Indigo' },
  { id: 'violet', color: '#7c3aed', label: 'Violet' },
] as const
const THEME_TONES = [
  { id: 'pastel', label: 'Pastel', s: 48, l: 78 },
  { id: 'doux', label: 'Doux', s: 58, l: 64 },
  { id: 'vif', label: 'Vif', s: 84, l: 48 },
  { id: 'profond', label: 'Profond', s: 76, l: 38 },
  { id: 'sombre', label: 'Sombre', s: 72, l: 28 },
] as const

function readThemeColor(): string {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && HEX_COLOR.test(stored)) return stored
  } catch {
    /* ignore */
  }
  return THEME_COLORS[THEME_COLORS.length - 1].color
}

function contrastOnTheme(hex: string): string {
  const value = Number.parseInt(hex.slice(1), 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  const luma = (r * 299 + g * 587 + b * 114) / 1000
  return luma > 160 ? '#28252f' : '#fff'
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100
  const light = l / 100
  const chroma = sat * Math.min(light, 1 - light)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    const mix = light - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * mix)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

function hexToHue(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16)
  const r = ((value >> 16) & 255) / 255
  const g = ((value >> 8) & 255) / 255
  const b = (value & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  if (delta === 0) return 0
  let hue = 0
  if (max === r) hue = ((g - b) / delta) % 6
  else if (max === g) hue = (b - r) / delta + 2
  else hue = (r - g) / delta + 4
  hue *= 60
  if (hue < 0) hue += 360
  return hue
}

function hueFromPointer(el: HTMLElement, clientX: number, clientY: number): number {
  const rect = el.getBoundingClientRect()
  const x = clientX - rect.left - rect.width / 2
  const y = clientY - rect.top - rect.height / 2
  let deg = (Math.atan2(x, -y) * 180) / Math.PI
  if (deg < 0) deg += 360
  return deg
}

function ThemeColorPicker({
  themeColor,
  onChange,
}: {
  themeColor: string
  onChange: (color: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hue, setHue] = useState(() => hexToHue(themeColor))
  const [toneId, setToneId] = useState<(typeof THEME_TONES)[number]['id']>('vif')
  const boxRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLButtonElement>(null)
  const dragging = useRef(false)
  const toneRef = useRef(toneId)
  const onChangeRef = useRef(onChange)
  const isPreset = THEME_COLORS.some((swatch) => swatch.color === themeColor)

  useEffect(() => {
    toneRef.current = toneId
  }, [toneId])
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const applyHueTone = (nextHue: number, nextTone: (typeof THEME_TONES)[number]['id']) => {
    const tone = THEME_TONES.find((item) => item.id === nextTone) ?? THEME_TONES[2]
    onChangeRef.current(hslToHex(nextHue, tone.s, tone.l))
  }

  const pickFromPointer = (clientX: number, clientY: number) => {
    const wheel = wheelRef.current
    if (!wheel) return
    const nextHue = hueFromPointer(wheel, clientX, clientY)
    setHue(nextHue)
    applyHueTone(nextHue, toneRef.current)
  }

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const move = (event: PointerEvent) => {
      if (!dragging.current) return
      pickFromPointer(event.clientX, event.clientY)
    }
    const stop = () => {
      dragging.current = false
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerup', stop)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerup', stop)
    }
  }, [])

  const knobStyle = {
    left: `${50 + 38 * Math.sin((hue * Math.PI) / 180)}%`,
    top: `${50 - 38 * Math.cos((hue * Math.PI) / 180)}%`,
    background: hslToHex(hue, 84, 48),
  } as CSSProperties

  return (
    <div className="theme-color-block" ref={boxRef}>
      <b>Modifier la couleur du thème</b>
      <div className="theme-color-choices" role="listbox" aria-label="Couleur du thème">
        {THEME_COLORS.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            role="option"
            aria-selected={themeColor === swatch.color}
            aria-label={swatch.label}
            className={`theme-color-swatch${themeColor === swatch.color ? ' active' : ''}`}
            style={{ background: swatch.color }}
            onClick={() => {
              setOpen(false)
              onChange(swatch.color)
            }}
          />
        ))}
        <button
          type="button"
          role="option"
          aria-selected={!isPreset}
          aria-expanded={open}
          aria-label="Autre, cercle chromatique"
          className={`theme-color-swatch theme-color-other${!isPreset ? ' active' : ''}`}
          style={!isPreset ? { background: themeColor } : undefined}
          onClick={() => {
            setHue(hexToHue(themeColor))
            setOpen((current) => !current)
          }}
        />
        <span className="theme-color-other-label">Autre</span>
      </div>
      {open ? (
        <div className="theme-color-picker" role="dialog" aria-label="Cercle chromatique">
          <button
            ref={wheelRef}
            type="button"
            className="theme-hue-wheel"
            aria-label="Choisir une teinte"
            onPointerDown={(event) => {
              dragging.current = true
              event.currentTarget.setPointerCapture(event.pointerId)
              pickFromPointer(event.clientX, event.clientY)
            }}
          >
            <span className="theme-hue-knob" style={knobStyle} />
          </button>
          <div className="theme-tone-row" role="group" aria-label="Ton de la couleur">
            {THEME_TONES.map((tone) => (
              <button
                key={tone.id}
                type="button"
                className={`theme-tone-chip${toneId === tone.id ? ' active' : ''}`}
                style={{
                  background: hslToHex(hue, tone.s, tone.l),
                  color: contrastOnTheme(hslToHex(hue, tone.s, tone.l)),
                }}
                onClick={() => {
                  setToneId(tone.id)
                  applyHueTone(hue, tone.id)
                }}
              >
                {tone.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

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
            <span>Phrase</span>
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

function TabRemoveButton({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="tab-remove"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onRemove()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        event.stopPropagation()
        onRemove()
      }}
    >
      ×
    </span>
  )
}

function FormesPalette({
  marks,
  selectedKind,
  onSelect,
}: {
  marks: { kind: string }[]
  selectedKind: CoordShape | null
  onSelect: (kind: CoordShape) => void
}) {
  return (
    <div className="coord-palette" role="listbox" aria-label="Formes à placer">
      {COORD_SHAPES.map((kind) => {
        const used = marks.some((mark) => mark.kind === kind)
        return (
          <button
            key={kind}
            type="button"
            role="option"
            draggable
            aria-selected={selectedKind === kind}
            className={`coord-palette-item${selectedKind === kind ? ' selected' : ''}${used ? ' used' : ''}`}
            title={used ? `${COORD_SHAPE_LABEL[kind]} (déjà sur le tableau)` : COORD_SHAPE_LABEL[kind]}
            onClick={() => onSelect(kind)}
            onDragStart={(event) => {
              event.dataTransfer.setData('coord-kind', kind)
              event.dataTransfer.effectAllowed = 'copy'
              onSelect(kind)
            }}
          >
            <CoordShapeButton kind={kind} />
            <span>{COORD_SHAPE_LABEL[kind]}</span>
          </button>
        )
      })}
    </div>
  )
}

function ReperageAxesFields({
  cols,
  rows,
  cellMm,
  unitSquares,
  onChange,
  onLiveCols,
  onLiveRows,
}: {
  cols: number
  rows: number
  cellMm: CoordCellMm
  unitSquares: CoordUnitSquares
  onChange: (patch: Partial<ExerciseBlock>) => void
  onLiveCols?: (n: number) => void
  onLiveRows?: (n: number) => void
}) {
  const maxCols = maxAxesColsForCell(cellMm)
  const maxRows = maxAxesRowsForCell(cellMm)
  return (
    <>
      <div className="coord-size-row">
        <label>
          Colonnes · max {maxCols}
          <input
            className="pill-input"
            type="number"
            min={2}
            max={maxCols}
            step={2}
            value={cols}
            title={`Maximum ${maxCols} colonnes à ${cellMm} mm`}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(2, Math.min(maxCols, Math.round(raw)))
              if (onLiveCols) onLiveCols(next)
              else onChange({ coordCols: next })
            }}
            onBlur={() => onChange({ coordCols: clampAxesCols(cols, cellMm) })}
          />
        </label>
        <label>
          Lignes
          <input
            className="pill-input"
            type="number"
            min={2}
            max={maxRows}
            step={2}
            value={rows}
            onChange={(event) => {
              const raw = Number(event.target.value)
              if (!Number.isFinite(raw)) return
              const next = Math.max(2, Math.min(maxRows, Math.round(raw)))
              if (onLiveRows) onLiveRows(next)
              else onChange({ coordRows: next })
            }}
            onBlur={() => onChange({ coordRows: clampAxesRows(rows, cellMm) })}
          />
        </label>
      </div>
      <div className="coord-param-label">
        Graduation
        <div className="mode-toggle" role="group" aria-label="Graduation">
          <button
            type="button"
            className={unitSquares === 1 ? 'active' : ''}
            onClick={() => onChange({ coordUnitSquares: 1 })}
          >
            1 carré = 1 unité
          </button>
          <button
            type="button"
            className={unitSquares === 2 ? 'active' : ''}
            onClick={() => onChange({ coordUnitSquares: 2 })}
          >
            2 carrés = 1 unité
          </button>
        </div>
      </div>
      <div className="coord-param-label">
        Côté du carré
        <div className="mode-toggle is-3" role="group" aria-label="Côté du carré">
          {CELL_MM_OPTIONS.map((mm) => (
            <button
              key={mm}
              type="button"
              className={cellMm === mm ? 'active' : ''}
              onClick={() =>
                onChange({
                  coordCellMm: mm,
                  coordCols: clampAxesCols(cols, mm),
                  coordRows: clampAxesRows(rows, mm),
                })
              }
            >
              {mm} mm
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function applyType(type: ExerciseType, prev?: ExerciseBlock): Partial<ExerciseBlock> {
  const isProblem = type.id.includes('problemes')
  const isEquation = type.id.startsWith('equations-')
  const isLongMul = type.id === 'multiplication-2chiffres'
  const isDivisionCol = type.id.startsWith('division-colonne')
  const isLectureDense = type.id.endsWith('-entourer') || type.id.endsWith('-cocher')
  const isLecture = type.topic === 'alphabet' || type.topic.startsWith('voyelle-')
  const isPhrase = type.topic.startsWith('phrase-')
  const isPhraseChart = type.id.startsWith('phrase-tableau-')
  const isFormes = isReperageFormes(type.id)
  const isCadrans = isReperageCadrans(type.id)
  const isDroites = isReperageDroites(type.id)
  const isConstruire = isReperageConstruire(type.id)
  const isGeoCalc = isDraftPadExercise(type.id) && !isProblem && !isEquation
  const isFrenchCom = type.track === 'com'
  const isComQcm =
    type.id.includes('-com-orale') || type.id.includes('-com-ecrite')
  const isTheory = isGrammarTheoryType(type.id)
  const isFrenchLang = type.track === 'voc' || type.track === 'gram'
  const isVocabLearn = isVocabLearnType(type.id)
  const isVocabPool = isVocabPoolType(type.id)
  const isVocabProd = isVocabProductionType(type.id)
  const bankIds = new Set(vocabLearnWordsFor(type.topic).map((word) => word.id))
  const preservedSelected =
    prev?.topic === type.topic && prev.vocabSelected?.length
      ? prev.vocabSelected.filter((id) => bankIds.has(id))
      : []
  const vocabSelected =
    preservedSelected.length > 0 ? preservedSelected : defaultVocabSelected(type.topic, 3, 3)
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
          : isPhraseChart
            ? { count: 1 }
            : isVocabLearn
              ? { count: 1 }
              : isVocabPool
                ? { count: Math.min(6, Math.max(2, vocabSelected.length)) }
                : isPhrase
                  ? { count: 6 }
                  : isLectureDense
                    ? { count: 4 }
                    : isLecture
                      ? { count: 6 }
                      : isGeoCalc
                        ? { count: 2 }
                        : isTheory
                          ? { count: 1 }
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
    ...(isVocabPool
      ? {
          columns: 1,
          vocabSelected,
          vocabRows: isVocabLearn ? (prev?.vocabRows ?? 3) : undefined,
          vocabCols: isVocabLearn ? (prev?.vocabCols ?? 3) : undefined,
          vocabLineCh: isVocabProd
            ? (prev?.vocabLineCh ?? (type.id.includes('phrase') || type.id.includes('dictee') ? 32 : 12))
            : undefined,
        }
      : {
          vocabRows: undefined,
          vocabCols: undefined,
          vocabSelected: undefined,
          vocabLineCh: undefined,
        }),
    ...(isFormes
      ? {
          coordLibre: false,
          coordCols: coordSize.cols,
          coordRows: coordSize.rows,
          coordAxis: 'letters' as const,
          coordMarks: [],
          coordRange: undefined,
          coordCellMm: DEFAULT_FORMES_CELL_MM,
          coordUnitSquares: undefined,
        }
      : isCadrans || isDroites || isConstruire
        ? {
            coordLibre: isCadrans ? false : undefined,
            coordCols: AXES_DEFAULT_COLS,
            coordRows: AXES_DEFAULT_ROWS,
            coordAxis: undefined,
            coordMarks: isCadrans ? [] : undefined,
            coordRange: undefined,
            coordCellMm: DEFAULT_CELL_MM,
            coordUnitSquares: DEFAULT_UNIT_SQUARES,
            coordOriginCol: undefined,
            coordOriginRow: undefined,
          }
        : {
            coordLibre: undefined,
            coordCols: undefined,
            coordRows: undefined,
            coordAxis: undefined,
            coordMarks: undefined,
            coordRange: undefined,
            coordCellMm: undefined,
            coordUnitSquares: undefined,
          }),
    continueOnNextPage: isComQcm || isTheory ? (prev?.continueOnNextPage ?? isTheory) : undefined,
    oralAnswerModes: type.id.includes('-com-orale')
      ? resizeOralAnswerModes(prev?.oralAnswerModes, 4)
      : undefined,
  }
}

function resizeDraftGrids(prev: boolean[] | undefined, count: number): boolean[] {
  return Array.from({ length: count }, (_, i) => prev?.[i] ?? true)
}

function resizeOralAnswerModes(
  prev: Array<'qcm' | 'text' | 'images'> | undefined,
  count: number,
): Array<'qcm' | 'text' | 'images'> {
  return Array.from({ length: count }, (_, i) => prev?.[i] ?? 'qcm')
}

function isProblemExercise(typeId: string): boolean {
  return isDraftPadExercise(typeId)
}

function isOralComprehensionExercise(typeId: string): boolean {
  return typeId.includes('-com-orale')
}

function cycleOralMode(
  current: 'qcm' | 'text' | 'images',
  imagesAvailable: boolean,
): 'qcm' | 'text' | 'images' {
  if (current === 'qcm') return 'text'
  if (current === 'text') return imagesAvailable ? 'images' : 'qcm'
  return 'qcm'
}

function GeneratorPage() {
  const initial = defaultPage('algèbre')
  const [pages, setPages] = useState<PageConfig[]>([initial])
  const [sheetIndex, setSheetIndex] = useState(0)
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
  const [coordTool, setCoordTool] = useState<'origin' | 'given' | 'points'>('origin')
  const [themeColor, setThemeColor] = useState(readThemeColor)
  const previewFrameRef = useRef<HTMLDivElement>(null)

  const applyThemeColor = (color: string) => {
    setThemeColor(color)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, color)
    } catch {
      /* ignore */
    }
  }

  const worksheets = useMemo(() => buildWorksheets(pages, seed), [pages, seed])
  const safeSheetIndex = Math.min(sheetIndex, Math.max(0, worksheets.length - 1))
  const activeSheet = worksheets[safeSheetIndex] ?? worksheets[0]
  const pageIndex = activeSheet?.configIndex ?? Math.min(sheetIndex, Math.max(0, pages.length - 1))
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
          : activePage.domain === 'phrase'
            ? phraseTopics
            : lectureTopics
  const typeChoices = typesForTopic(
    activeBlock.topic,
    activePage.domain === 'français' ? (activeBlock.track ?? 'voc') : undefined,
  )
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
    sheetIndex,
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
    activeBlock.coordCellMm,
    activeBlock.coordUnitSquares,
    activeBlock.coordOriginCol,
    activeBlock.coordOriginRow,
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

  const cycleOralAnswerMode = (itemIndex: number, targetBlock = safeBlockIndex) => {
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock] ?? blockFromPage(page)
        const modes = resizeOralAnswerModes(block.oralAnswerModes, block.count)
        const sheet = worksheets[safeSheetIndex]
        const sheetBlock = sheet?.blocks[targetBlock]
        const item = sheetBlock?.items[itemIndex]
        const imagesAvailable = Boolean(item?.imagesAvailable)
        const offset = sheet?.isContinuation ? 4 : 0
        const modeIndex = itemIndex + offset
        modes[modeIndex] = cycleOralMode(modes[modeIndex] ?? 'qcm', imagesAvailable)
        return setPageBlock(page, targetBlock, { oralAnswerModes: modes })
      }),
    )
  }

  const setAllDraftGrids = (value: boolean) => {
    updatePage({
      problemDraftGrids: Array.from({ length: activeBlock.count }, () => value),
    })
  }

  const isReperage = isReperagePage(activeBlock.exerciseType)
  const isPhraseChart =
    activeBlock.topic === 'phrase-tableaux' || activeBlock.exerciseType.startsWith('phrase-tableau-')
  const isVocabLearn = isVocabLearnType(activeBlock.exerciseType)
  const isVocabPool = isVocabPoolType(activeBlock.exerciseType)
  const isVocabProd = isVocabProductionType(activeBlock.exerciseType)
  const isGramTheory = isGrammarTheoryType(activeBlock.exerciseType)
  const vocabLearnWords = isVocabPool ? vocabLearnWordsFor(activeBlock.topic) : []
  const vocabSelectedIds =
    activeBlock.vocabSelected ??
    (isVocabPool
      ? defaultVocabSelected(activeBlock.topic, activeBlock.vocabRows ?? 3, activeBlock.vocabCols ?? 3)
      : [])
  const usesCefrLevel =
    (isVocabPool && !isVocabLearn) ||
    activeBlock.exerciseType.includes('-com-ecrite') ||
    activeBlock.exerciseType.includes('-com-orale')
  const vocabDifficultyOptions = usesCefrLevel
    ? [
        { value: 'facile' as const, label: 'A1 · Facile' },
        { value: 'moyen' as const, label: 'A2 · Moyen' },
        { value: 'avance' as const, label: 'B1 · Avancé' },
      ]
    : DIFFICULTY_OPTIONS
  const isPhraseDomain = activePage.domain === 'phrase'
  const isCadrans = isReperageCadrans(activeBlock.exerciseType)
  const isComposer = isReperageComposer(activeBlock.exerciseType)
  const isFormes = isReperageFormes(activeBlock.exerciseType)
  const isDroites = isReperageDroites(activeBlock.exerciseType)
  const isConstruire = isReperageConstruire(activeBlock.exerciseType)
  const maxQuestions = isComposer
    ? COORD_LETTER_MAX - 1
    : isFormes
      ? COORD_SHAPES.length
      : isReperage
        ? COORD_LETTER_MAX
        : 30
  const activeSheetBlock = worksheets[safeSheetIndex]?.blocks[safeBlockIndex]
  const bankQuestionCap = activeSheetBlock?.bankQuestionCap
  const bankOverflow =
    Boolean(bankQuestionCap != null) &&
    (isOralComprehensionExercise(activeBlock.exerciseType) ||
      activeBlock.exerciseType.includes('-com-ecrite')) &&
    activeBlock.count > (bankQuestionCap ?? 0)
  const questionsInputOverflow = questionsOverflow || bankOverflow
  const isQuadType = isQuadExercise(activeBlock.exerciseType)
  const isNumberLibreDomain = activePage.domain === 'algèbre' || activePage.domain === 'géométrie'
  const quadPool = activeBlock.exerciseType.startsWith('volumes-')
    ? VOLUME_QUAD_FIGURES
    : activeBlock.exerciseType.startsWith('aires-')
      ? AREA_QUAD_FIGURES
      : PERI_QUAD_FIGURES
  const activeAsPage = pageAsConfig(activePage, activeBlock)
  const axesGrid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
  const updateAxesGrid = (patch: Partial<ExerciseBlock>) => {
    const next = { ...activeBlock, ...patch }
    const grid = resolveAxesGrid({ ...activeAsPage, ...next }, next.difficulty)
    updatePage({
      ...patch,
      coordCols: grid.cols,
      coordRows: grid.rows,
      coordCellMm: grid.cellMm,
      coordUnitSquares: grid.unitSquares,
      coordMarks: isCadrans
        ? (next.coordMarks ?? []).filter((mark) =>
            markOnGrid(
              mark,
              {
                col: next.coordOriginCol ?? grid.cols / 2,
                row: next.coordOriginRow ?? grid.rows / 2,
              },
              grid.cols,
              grid.rows,
              grid.unitSquares,
            ),
          )
        : next.coordMarks,
    })
  }

  const placeOrigin = (col: number, row: number) => {
    const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
    const from = {
      col: activeBlock.coordOriginCol ?? grid.cols / 2,
      row: activeBlock.coordOriginRow ?? grid.rows / 2,
    }
    const to = clampOrigin(col, row, grid.cols, grid.rows)
    const remapped = remapMarksToOrigin(activeBlock.coordMarks ?? [], from, to, grid.unitSquares).filter((mark) =>
      markOnGrid(mark, to, grid.cols, grid.rows, grid.unitSquares),
    )
    updatePage({
      coordLibre: true,
      coordOriginCol: to.col,
      coordOriginRow: to.row,
      coordCols: grid.cols,
      coordRows: grid.rows,
      coordCellMm: grid.cellMm,
      coordUnitSquares: grid.unitSquares,
      coordMarks: isComposer ? ensureGivenMark(remapped) : remapped,
    })
  }

  const placeCoordMark = (x: number, y: number, kind: CoordShape) => {
    if (isCadrans) {
      const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
      const origin = {
        col: activeBlock.coordOriginCol ?? grid.cols / 2,
        row: activeBlock.coordOriginRow ?? grid.rows / 2,
      }
      if (!markOnGrid({ x, y, kind: 'point' }, origin, grid.cols, grid.rows, grid.unitSquares)) return
      if (x === 0 && y === 0 && isComposer) return
      const without = (activeBlock.coordMarks ?? []).filter((mark) => !(mark.x === x && mark.y === y))
      const current = (activeBlock.coordMarks ?? []).find((mark) => mark.x === x && mark.y === y)
      const others = without.filter((mark) => !mark.given)
      const asGiven = isComposer && (coordTool === 'given' || !without.some((mark) => mark.given))
      if (!current && !asGiven && others.length >= activeBlock.count) return
      if (!current && asGiven && without.length + 1 > COORD_LETTER_MAX) return
      const nextMarks = [
        ...without.map((mark) => (asGiven ? { ...mark, given: false, showCoord: false } : mark)),
        {
          x,
          y,
          kind: 'point' as const,
          label: current?.label ?? nextPointLabel(without),
          given: asGiven,
          showCoord: asGiven,
        },
      ]
      updatePage({
        coordLibre: true,
        coordCols: grid.cols,
        coordRows: grid.rows,
        coordCellMm: grid.cellMm,
        coordUnitSquares: grid.unitSquares,
        coordOriginCol: isComposer ? origin.col : activeBlock.coordOriginCol,
        coordOriginRow: isComposer ? origin.row : activeBlock.coordOriginRow,
        coordMarks: isComposer ? ensureGivenMark(nextMarks) : nextMarks,
      })
      return
    }
    const cellMm = clampFormesCellMm(activeBlock.coordCellMm)
    const cols = clampFormesCols(activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty).cols, cellMm)
    const rows = clampFormesRows(activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty).rows, cellMm)
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
      coordCellMm: cellMm,
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
    setSheetIndex(worksheets.length) // will clamp after recompute; prefer end
    setBlockIndex(0)
  }

  const removePage = (configIdx: number) => {
    setPages((current) => {
      if (current.length <= 1) return current
      return current.filter((_, pageIdx) => pageIdx !== configIdx)
    })
    setSheetIndex(0)
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
    const fields = applyType(nextType, activeBlock)
    const count = Math.min(fields.count ?? 4, 4)
    const newBlock: ExerciseBlock = {
      topic: nextType.topic,
      exerciseType: nextType.id,
      difficulty: activeBlock.difficulty,
      count,
      columns: fields.columns ?? nextType.preferredColumns ?? 2,
      track: nextType.track,
      verbGroup: activeBlock.verbGroup,
      problemDraftGrids: isProblemExercise(nextType.id)
        ? Array.from({ length: count }, () => true)
        : undefined,
      oralAnswerModes: isOralComprehensionExercise(nextType.id)
        ? Array.from({ length: count }, () => 'qcm' as const)
        : undefined,
      continueOnNextPage:
        nextType.id.includes('-com-orale') || nextType.id.includes('-com-ecrite')
          ? (activeBlock.continueOnNextPage ?? false)
          : undefined,
      vocabSelected: fields.vocabSelected,
      vocabRows: fields.vocabRows,
      vocabCols: fields.vocabCols,
      vocabLineCh: fields.vocabLineCh,
      coordLibre: fields.coordLibre,
      coordCols: fields.coordCols,
      coordRows: fields.coordRows,
      coordAxis: fields.coordAxis,
      coordMarks: fields.coordMarks,
      coordRange: fields.coordRange,
      coordCellMm: fields.coordCellMm,
      coordUnitSquares: fields.coordUnitSquares,
      coordOriginCol: fields.coordOriginCol,
      coordOriginRow: fields.coordOriginRow,
      numberLibre: activeBlock.numberLibre,
      numberMin: activeBlock.numberMin,
      numberMax: activeBlock.numberMax,
      numberDecimals: activeBlock.numberDecimals,
      quadLibre: isQuadExercise(nextType.id) ? activeBlock.quadLibre : undefined,
      quadShapes: isQuadExercise(nextType.id) ? activeBlock.quadShapes : undefined,
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
    if (next === 'français' || next === 'lecture' || next === 'phrase') {
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
    updatePage({ track, ...applyType(type, activeBlock) })
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
    <div
      className="app-shell"
      style={{ '--purple': themeColor, '--theme-on': contrastOnTheme(themeColor) } as CSSProperties}
    >
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
                {worksheets.length} feuille{worksheets.length > 1 ? 's' : ''}
                {pages.length !== worksheets.length ? ` · ${pages.length} config.` : ''}
              </span>
            </div>
            <div className="mode-toggle is-tabs page-tabs" role="tablist" aria-label="Feuilles">
              {worksheets.map((sheet, index) => (
                <button
                  key={`${sheet.configIndex ?? index}-${sheet.isContinuation ? 'suite' : 'main'}-${index}`}
                  type="button"
                  className={safeSheetIndex === index ? 'active' : ''}
                  onClick={() => {
                    setSheetIndex(index)
                    setBlockIndex(0)
                  }}
                  aria-label={
                    sheet.isContinuation ? `Page ${index + 1} (suite)` : `Page ${index + 1}`
                  }
                >
                  <span className="tab-number">{index + 1}</span>
                  {sheet.isContinuation ? <span className="tab-suite">suite</span> : null}
                  {pages.length > 1 &&
                  !sheet.isContinuation &&
                  (sheet.configIndex ?? index) === pageIndex &&
                  safeSheetIndex === index ? (
                    <TabRemoveButton
                      label="Retirer cette page"
                      onRemove={() => removePage(sheet.configIndex ?? index)}
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <div className="page-structure-actions">
              <button className="button secondary" type="button" onClick={addPage}>
                + Page
              </button>
              <button className="button secondary" type="button" onClick={addExerciseOnPage}>
                + Exercice
              </button>
            </div>
            {pageExerciseBlocks.length > 1 ? (
              <div className="mode-toggle is-tabs page-tabs exercise-tabs" role="tablist" aria-label="Exercices de la page">
                {pageExerciseBlocks.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={safeBlockIndex === index ? 'active' : ''}
                    onClick={() => setBlockIndex(index)}
                    aria-label={`Exercice ${firstExerciseNo + index}`}
                  >
                    <span className="tab-number">{firstExerciseNo + index}</span>
                    {pageExerciseBlocks.length > 1 && index === safeBlockIndex ? (
                      <TabRemoveButton
                        label="Retirer cet exercice"
                        onRemove={() => {
                          setPages((current) =>
                            current.map((page, pageIdx) =>
                              pageIdx === pageIndex ? removePageBlock(page, index) : page,
                            ),
                          )
                          setBlockIndex(Math.max(0, index - 1))
                        }}
                      />
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
                        : ` (${worksheets[safeSheetIndex]?.items.length ?? 0} × ${pointsPerQuestion})`}
                    </small>
                  </label>
                )}
              </div>

              <SelectBox label="Domaine" value={activePage.domain} onChange={(value) => changeDomain(value as Domain)}>
                <option value="français">Français</option>
                <option value="algèbre">Algèbre</option>
                <option value="géométrie">Géométrie</option>
                <option value="phrase">Phrase</option>
                {SHOW_LECTURE_DOMAIN ? <option value="lecture">Lecture</option> : null}
              </SelectBox>
              <SelectBox label="Thème" value={activeBlock.topic} onChange={changeTopic}>
                {available.map((topic) => (
                  <option value={topic.id} key={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </SelectBox>
              {isPhraseDomain && !isPhraseChart ? (
                <div className="mode-toggle-block">
                  <b>Verbes</b>
                  <div className="mode-toggle" role="group" aria-label="Groupe de verbes">
                    <button
                      type="button"
                      className={(activeBlock.verbGroup ?? 'er') === 'er' ? 'active' : ''}
                      onClick={() => {
                        if ((activeBlock.verbGroup ?? 'er') === 'er') return
                        updatePage({ verbGroup: 'er' as PhraseVerbGroup })
                        setSeed(randomSeed())
                      }}
                    >
                      -er, être, avoir
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'autres' ? 'active' : ''}
                      onClick={() => {
                        if (activeBlock.verbGroup === 'autres') return
                        updatePage({ verbGroup: 'autres' as PhraseVerbGroup })
                        setSeed(randomSeed())
                      }}
                    >
                      2e et 3e groupes
                    </button>
                  </div>
                </div>
              ) : null}
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
                    const fromComposer = isReperageComposer(activeBlock.exerciseType)
                    const toComposer = isReperageComposer(value)
                    if (fromComposer !== toComposer && isReperageCadrans(value)) {
                      const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
                      const unit = grid.unitSquares
                      const stored = {
                        col: activeBlock.coordOriginCol ?? grid.cols / 2,
                        row: activeBlock.coordOriginRow ?? grid.rows / 2,
                      }
                      const center = centeredOrigin(grid.cols, grid.rows)
                      const remapped = fromComposer
                        ? remapMarksToOrigin(activeBlock.coordMarks ?? [], stored, center, unit)
                        : activeBlock.coordMarks
                      updatePage({
                        exerciseType: value,
                        topic: type.topic,
                        track: type.track,
                        coordLibre: activeBlock.coordLibre,
                        coordMarks: remapped,
                        coordOriginCol: toComposer ? center.col : undefined,
                        coordOriginRow: toComposer ? center.row : undefined,
                      })
                      return
                    }
                    updatePage({
                      exerciseType: value,
                      topic: type.topic,
                      track: type.track,
                      coordLibre: activeBlock.coordLibre,
                    })
                    return
                  }
                  updatePage(applyType(type, activeBlock))
                }}
              >
                {typeChoices.map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.label}
                  </option>
                ))}
              </SelectBox>
              {isReperage || isPhraseDomain || isVocabLearn || isGramTheory ? null : (
              <>
              <div className={`niveau-row${activeBlock.numberLibre ? ' is-libre' : ''}`}>
                <SelectBox
                  label="Niveau"
                  value={activeBlock.difficulty ?? 'moyen'}
                  onChange={(value) => updatePage({ difficulty: value as Difficulty })}
                >
                  {vocabDifficultyOptions.map((opt) => (
                    <option value={opt.value} key={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </SelectBox>
                {isNumberLibreDomain ? (
                  <button
                    type="button"
                    className={`niveau-libre-btn${activeBlock.numberLibre ? ' active' : ''}`}
                    aria-pressed={!!activeBlock.numberLibre}
                    aria-label="Saisir les valeurs"
                    title="Saisir les valeurs à la place du niveau"
                    onClick={() =>
                      updatePage({
                        numberLibre: !activeBlock.numberLibre,
                        numberMin: activeBlock.numberMin ?? 1,
                        numberMax: activeBlock.numberMax ?? 100,
                      })
                    }
                  >
                    Valeurs
                  </button>
                ) : null}
              </div>
              {isNumberLibreDomain && activeBlock.numberLibre ? (
                <div className="number-libre-fields">
                  <label className="select-shell">
                    <span>De</span>
                    <input
                      className="pill-input"
                      type="number"
                      inputMode="decimal"
                      step={activeBlock.numberDecimals ? 0.1 : 1}
                      value={activeBlock.numberMin ?? 1}
                      onChange={(event) => updatePage({ numberMin: Number(event.target.value) })}
                    />
                  </label>
                  <label className="select-shell">
                    <span>À</span>
                    <input
                      className="pill-input"
                      type="number"
                      inputMode="decimal"
                      step={activeBlock.numberDecimals ? 0.1 : 1}
                      value={activeBlock.numberMax ?? 100}
                      onChange={(event) => updatePage({ numberMax: Number(event.target.value) })}
                    />
                  </label>
                  <div className="mode-toggle-block">
                    <b>Décimales</b>
                    <div className="mode-toggle">
                      <button
                        type="button"
                        className={!activeBlock.numberDecimals ? 'active' : ''}
                        onClick={() => updatePage({ numberDecimals: false })}
                      >
                        Sans
                      </button>
                      <button
                        type="button"
                        className={activeBlock.numberDecimals ? 'active' : ''}
                        onClick={() => updatePage({ numberDecimals: true })}
                      >
                        Avec
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              </>
              )}
              {isVocabPool ? (
                <>
                  {isVocabLearn ? (
                    <>
                  <div className="mode-toggle-block">
                    <b>Lignes</b>
                    <div className="mode-toggle is-4" role="group" aria-label="Nombre de lignes">
                      {[1, 2, 3, 4].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={(activeBlock.vocabRows ?? 3) === value ? 'active' : ''}
                          onClick={() => updatePage({ vocabRows: value })}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mode-toggle-block">
                    <b>Colonnes</b>
                    <div className="mode-toggle is-4" role="group" aria-label="Nombre de colonnes du tableau">
                      {[1, 2, 3, 4].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={(activeBlock.vocabCols ?? 3) === value ? 'active' : ''}
                          onClick={() => updatePage({ vocabCols: value })}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                    </>
                  ) : null}
                  {isVocabProd ? (
                    <label className="select-shell">
                      <span>Longueur du trait</span>
                      <input
                        className="pill-input"
                        type="number"
                        min={4}
                        max={48}
                        value={activeBlock.vocabLineCh ?? 12}
                        onChange={(event) =>
                          updatePage({
                            vocabLineCh: Math.max(4, Math.min(48, Number(event.target.value) || 12)),
                          })
                        }
                      />
                    </label>
                  ) : null}
                  {vocabLearnWords.length > 0 ? (
                    <div className="quad-libre-block">
                      <b>Mots</b>
                      <div className="vocab-word-list" role="group" aria-label="Mots à afficher">
                        {vocabLearnWords.map((word) => {
                          const selected = vocabSelectedIds.includes(word.id)
                          return (
                            <label key={word.id} className={selected ? 'is-on' : ''}>
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => {
                                  const next = selected
                                    ? vocabSelectedIds.filter((id) => id !== word.id)
                                    : [...vocabSelectedIds, word.id]
                                  updatePage({
                                    vocabSelected: next.length
                                      ? next
                                      : vocabLearnWords.slice(0, 1).map((item) => item.id),
                                  })
                                }}
                              />
                              {word.label}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="questions-overflow-hint" role="status">
                      Aucun mot n’est encore défini pour ce thème.
                    </p>
                  )}
                </>
              ) : null}
              {isQuadType ? (
                <div className="quad-libre-block">
                  <div className="mode-toggle-block">
                    <b>Formes</b>
                    <div className="mode-toggle">
                      <button
                        type="button"
                        className={!activeBlock.quadLibre ? 'active' : ''}
                        onClick={() => updatePage({ quadLibre: false, quadShapes: undefined })}
                      >
                        Hasard
                      </button>
                      <button
                        type="button"
                        className={activeBlock.quadLibre ? 'active' : ''}
                        onClick={() =>
                          updatePage({
                            quadLibre: true,
                            quadShapes: activeBlock.quadShapes?.length ? activeBlock.quadShapes : [...quadPool],
                          })
                        }
                      >
                        Choisir
                      </button>
                    </div>
                  </div>
                  {activeBlock.quadLibre ? (
                    <div className="quad-shape-list">
                      {quadPool.map((figure) => {
                        const selected = (activeBlock.quadShapes ?? quadPool).includes(figure)
                        return (
                          <button
                            key={figure}
                            type="button"
                            className={selected ? 'active' : ''}
                            aria-pressed={selected}
                            onClick={() => {
                              const current = activeBlock.quadShapes ?? [...quadPool]
                              const next = selected
                                ? current.filter((item) => item !== figure)
                                : [...current, figure]
                              updatePage({ quadShapes: next.length ? next : [figure] })
                            }}
                          >
                            {QUAD_SHAPE_LABELS[figure] ?? figure}
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
              {isPhraseChart || isVocabLearn || isGramTheory ? null : (
              <label className="select-shell">
                <span>{isReperage ? 'Questions' : 'QUESTIONS'}</span>
                <input
                  className={`pill-input${questionsInputOverflow ? ' is-overflow' : ''}`}
                  aria-label="Nombre de questions"
                  aria-invalid={questionsInputOverflow}
                  title={
                    bankOverflow
                      ? `La banque de cet enregistrement ne contient que ${bankQuestionCap} questions.`
                      : questionsOverflow
                        ? 'Trop de questions pour une seule fiche A4. Réduisez le nombre ou ajoutez une page.'
                        : undefined
                  }
                  type="number"
                  min={1}
                  max={maxQuestions}
                  value={activeBlock.count}
                  onChange={(event) =>
                    updatePage({
                      count: Math.max(1, Math.min(maxQuestions, Number(event.target.value) || 1)),
                    })
                  }
                />
                {bankOverflow ? (
                  <p className="questions-overflow-hint" role="status">
                    La banque ne contient que {bankQuestionCap} question
                    {(bankQuestionCap ?? 0) > 1 ? 's' : ''} pour cet enregistrement. Réduisez le
                    nombre ou générez une nouvelle fiche.
                  </p>
                ) : questionsOverflow && !activeBlock.continueOnNextPage ? (
                  <p className="questions-overflow-hint" role="status">
                    Les questions suivantes dépassent de la fiche. Réduisez le nombre, activez le
                    saut de page, ou ajoutez une page.
                  </p>
                ) : null}
              </label>
              )}
              {isOralComprehensionExercise(activeBlock.exerciseType) ||
              activeBlock.exerciseType.includes('-com-ecrite') ||
              isGramTheory ? (
                <div className="mode-toggle-block">
                  <b>Saut de page</b>
                  <div className="mode-toggle" role="group" aria-label="Saut de page pour les questions">
                    <button
                      type="button"
                      className={!activeBlock.continueOnNextPage ? 'active' : ''}
                      onClick={() => updatePage({ continueOnNextPage: false })}
                    >
                      Une fiche
                    </button>
                    <button
                      type="button"
                      className={activeBlock.continueOnNextPage ? 'active' : ''}
                      onClick={() => updatePage({ continueOnNextPage: true })}
                      title={
                        isGramTheory
                          ? 'La suite de la théorie passe sur la feuille suivante'
                          : 'Les questions au-delà de 4 passent sur la feuille suivante'
                      }
                    >
                      Suite auto
                    </button>
                  </div>
                  {activeBlock.continueOnNextPage ? (
                    <small className="muted">
                      {isGramTheory
                        ? 'Si la théorie dépasse, une feuille « suite » est ajoutée automatiquement.'
                        : 'Au-delà de 4 questions, une feuille « suite » est ajoutée automatiquement.'}
                    </small>
                  ) : null}
                </div>
              ) : null}
              {isPhraseChart || isVocabLearn || isVocabPool || isGramTheory ? null : (
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
              )}
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
                      Largeur · max {maxFormesColsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={maxFormesColsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                        value={activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty).cols}
                        onChange={(event) => {
                          const cols = clampFormesCols(
                            Number(event.target.value),
                            clampFormesCellMm(activeBlock.coordCellMm),
                          )
                          updatePage({
                            coordCols: cols,
                            coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => mark.x <= cols),
                          })
                        }}
                      />
                    </label>
                    <label>
                      Hauteur · max {maxFormesRowsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                      <input
                        className="pill-input"
                        type="number"
                        min={3}
                        max={maxFormesRowsForCell(clampFormesCellMm(activeBlock.coordCellMm))}
                        value={activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty).rows}
                        onChange={(event) => {
                          const rows = clampFormesRows(
                            Number(event.target.value),
                            clampFormesCellMm(activeBlock.coordCellMm),
                          )
                          updatePage({
                            coordRows: rows,
                            coordMarks: (activeBlock.coordMarks ?? []).filter((mark) => mark.y <= rows),
                          })
                        }}
                      />
                    </label>
                  </div>
                  <div className="coord-param-label">
                    Côté du carré
                    <div className="mode-toggle is-3" role="group" aria-label="Côté du carré">
                      {FORMES_CELL_MM_OPTIONS.map((mm) => (
                        <button
                          key={mm}
                          type="button"
                          className={clampFormesCellMm(activeBlock.coordCellMm) === mm ? 'active' : ''}
                          onClick={() => {
                            const cols = clampFormesCols(
                              activeBlock.coordCols ?? coordSizeFor(activeBlock.difficulty).cols,
                              mm,
                            )
                            const rows = clampFormesRows(
                              activeBlock.coordRows ?? coordSizeFor(activeBlock.difficulty).rows,
                              mm,
                            )
                            updatePage({
                              coordCellMm: mm,
                              coordCols: cols,
                              coordRows: rows,
                              coordMarks: (activeBlock.coordMarks ?? []).filter(
                                (mark) => mark.x <= cols && mark.y <= rows,
                              ),
                            })
                          }}
                        >
                          {mm} mm
                        </button>
                      ))}
                    </div>
                  </div>
                  {activeBlock.coordLibre ? (
                    <>
                      <p className="type-hint muted">
                        Les formes sont à droite de la fiche. Cliquez une forme puis une case, ou glissez-la sur le
                        tableau. Chaque forme n’apparaît qu’une fois.
                      </p>
                      <p className="type-hint muted">
                        {(activeBlock.coordMarks?.length ?? 0)} / {COORD_SHAPES.length} forme
                        {COORD_SHAPES.length > 1 ? 's' : ''}
                        {' · '}
                        {FORMES_MAX_BY_MM[clampFormesCellMm(activeBlock.coordCellMm)].cols} ×{' '}
                        {FORMES_MAX_BY_MM[clampFormesCellMm(activeBlock.coordCellMm)].rows} au plus à{' '}
                        {clampFormesCellMm(activeBlock.coordCellMm)} mm.
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
                      Une seule grille centrée. Chaque forme n’apparaît qu’une fois. Le champ Questions ajoute des
                      formes. Maximum : 16 × 12 à 10 mm, 21 × 15 à 8 mm, 26 × 20 à 6 mm. Les colonnes 1 / 2 / 3
                      séparent les questions, pas le tableau.
                    </p>
                  )}
                </div>
              ) : isCadrans ? (
                <div className="coord-libre-panel">
                  <b>{isComposer ? 'Composer les points' : 'Repère (4 cadrans)'}</b>
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
                      onClick={() => {
                        const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
                        updatePage({
                          coordLibre: true,
                          coordCols: grid.cols,
                          coordRows: grid.rows,
                          coordCellMm: grid.cellMm,
                          coordUnitSquares: grid.unitSquares,
                          coordMarks: activeBlock.coordMarks ?? [],
                          coordOriginCol: activeBlock.coordOriginCol ?? Math.round(grid.cols / 2),
                          coordOriginRow: activeBlock.coordOriginRow ?? Math.round(grid.rows / 2),
                        })
                      }}
                    >
                      Libre
                    </button>
                  </div>
                  <ReperageAxesFields
                    cols={activeBlock.coordCols ?? axesGrid.cols}
                    rows={activeBlock.coordRows ?? axesGrid.rows}
                    cellMm={axesGrid.cellMm}
                    unitSquares={axesGrid.unitSquares}
                    onChange={updateAxesGrid}
                    onLiveCols={(n) => updatePage({ coordCols: n })}
                    onLiveRows={(n) => updatePage({ coordRows: n })}
                  />
                  {activeBlock.coordLibre ? (
                    <>
                      {isComposer ? (
                        <div className="mode-toggle is-3" role="group" aria-label="Outil de placement">
                          <button
                            type="button"
                            className={coordTool === 'origin' ? 'active' : ''}
                            onClick={() => setCoordTool('origin')}
                          >
                            Origine
                          </button>
                          <button
                            type="button"
                            className={coordTool === 'given' ? 'active' : ''}
                            onClick={() => setCoordTool('given')}
                          >
                            Point donné
                          </button>
                          <button
                            type="button"
                            className={coordTool === 'points' ? 'active' : ''}
                            onClick={() => setCoordTool('points')}
                          >
                            Autres points
                          </button>
                        </div>
                      ) : null}
                      <div className="coord-axes-editor">
                        <CoordGrid
                          scene={sceneFromAxesLibre(activeAsPage, activeBlock.difficulty)}
                          editable
                          placingOrigin={isComposer && coordTool === 'origin'}
                          onPlace={(x, y) => placeCoordMark(x, y, 'point')}
                          onPlaceOrigin={placeOrigin}
                          onRemove={removeCoordMark}
                        />
                      </div>
                      <p className="type-hint muted">
                        {isComposer
                          ? 'Placez l’origine (invisible sur la fiche), un point donné avec ses coordonnées, puis les autres points à lire. Le champ Questions limite les points à compléter (26 lettres au plus).'
                          : 'Cliquez une intersection pour poser A, B, C… Le champ Questions limite le nombre de points. Cliquez un point pour le retirer. Colonnes et lignes restent paires.'}
                      </p>
                      <p className="type-hint muted">
                        {isComposer
                          ? `${(activeBlock.coordMarks ?? []).filter((mark) => !mark.given).length} / ${activeBlock.count} point${activeBlock.count > 1 ? 's' : ''} à lire`
                          : `${activeBlock.coordMarks?.length ?? 0} / ${activeBlock.count} point${activeBlock.count > 1 ? 's' : ''}`}
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
                      {isComposer
                        ? 'Une grille sans axes x / y. L’origine est placée au hasard. Un point est donné avec ses coordonnées ; les autres se complètent comme pour lire les cadrans.'
                        : 'Une seule grille à 4 cadrans, centrée. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Les colonnes 1 / 2 / 3 séparent les questions, pas le tableau.'}
                    </p>
                  )}
                </div>
              ) : isDroites || isConstruire ? (
                <div className="coord-libre-panel">
                  <b>{isDroites ? 'Repère (droites)' : 'Repère (construction)'}</b>
                  <ReperageAxesFields
                    cols={activeBlock.coordCols ?? axesGrid.cols}
                    rows={activeBlock.coordRows ?? axesGrid.rows}
                    cellMm={axesGrid.cellMm}
                    unitSquares={axesGrid.unitSquares}
                    onChange={updateAxesGrid}
                    onLiveCols={(n) => updatePage({ coordCols: n })}
                    onLiveRows={(n) => updatePage({ coordRows: n })}
                  />
                  <p className="type-hint muted">
                    {isDroites
                      ? 'Une seule grille centrée. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Chaque droite a une couleur et un tracé distinct, lisible en noir et blanc.'
                      : 'Une grille vide centrée, avec deux points donnés. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Le corrigé montre les tracés.'}
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
                        Logo
                        <input
                          className="pill-input"
                          value={institutional.logoSrc}
                          onChange={(event) =>
                            setInstitutional({ ...institutional, logoSrc: event.target.value })
                          }
                          placeholder="/lib/logos/etat-du-valais.webp"
                        />
                        <input
                          className="pill-input"
                          type="file"
                          accept="image/*"
                          aria-label="Remplacer le logo"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onload = () =>
                              setInstitutional({
                                ...institutional,
                                logoSrc: String(reader.result ?? DEFAULT_INSTITUTIONAL_LOGO),
                              })
                            reader.readAsDataURL(file)
                          }}
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
                      <label>
                        Organisation (ligne 4)
                        <input className="pill-input" value={institutional.orgLine4}
                          onChange={(event) => setInstitutional({ ...institutional, orgLine4: event.target.value })}
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
              <ThemeColorPicker themeColor={themeColor} onChange={applyThemeColor} />
            </div>
          </aside>
          <section className="result-panel">
            <div className="result-head">
              <div>
                <p className="eyebrow">Aperçu</p>
                <h2>Votre activité est prête.</h2>
              </div>
              <div className="result-head-actions no-print">
                <div className="mode-toggle preview-mode-toggle" role="tablist" aria-label="Mode d’aperçu">
                  <button type="button" className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>
                    Fiche élève
                  </button>
                  <button type="button" className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>
                    Corrigé
                  </button>
                </div>
                <button className="print-chip is-generate" type="button" onClick={generate}>
                  Générer une nouvelle fiche
                </button>
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
                        key={`${worksheets[safeSheetIndex]?.exerciseType}-${seed}-${safeSheetIndex}-${pageExerciseBlocks.length}`}
                        page={worksheets[safeSheetIndex]!}
                        pageNumber={safeSheetIndex + 1}
                        sheetIndex={safeSheetIndex + 1}
                        total={worksheets.length}
                        interactiveDraftGrids={isProblemExercise(activeBlock.exerciseType)}
                        onToggleDraftGrid={toggleDraftGrid}
                        interactiveOralModes={isOralComprehensionExercise(activeBlock.exerciseType)}
                        onCycleOralAnswerMode={cycleOralAnswerMode}
                        coordEdit={
                          (isFormes && activeBlock.coordLibre) || (isCadrans && activeBlock.coordLibre)
                            ? {
                                selectedKind: selectedCoordShape,
                                placingOrigin: isComposer && coordTool === 'origin',
                                onPlace: placeCoordMark,
                                onPlaceOrigin: placeOrigin,
                                onRemove: removeCoordMark,
                              }
                            : undefined
                        }
                        {...sheetProps}
                      />
                    </div>
                  </div>
                  {isFormes && activeBlock.coordLibre ? (
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

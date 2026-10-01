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
  DEFAULT_INSTITUTIONAL,
  DEFAULT_INSTITUTIONAL_LOGO,
  DocumentFooter,
  InstitutionalDocumentHeader,
  SheetBody,
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
  calligraphieTopics,
  jeuxTopics,
  lectureTopics,
  soutienFrTopics,
  gattegnoTopics,
  typesForTopic,
} from '@/math/catalog'
import {
  defaultCalliPhraseCount,
  defaultCalliWordCount,
  isCalliPhrasesType,
  joinCalliLines,
  normalizeCalliFields,
  parseCalliLines,
} from '@/calligraphie/defaults'
import {
  CALLI_FONTS,
  CALLI_SIZES,
  DEFAULT_CALLI_FONT,
  DEFAULT_CALLI_SIZE,
} from '@/calligraphie/fonts'
import {
  initialCalliText,
  isCalligraphieType,
  reshuffleCalliContent,
} from '@/calligraphie/generate'
import { frTopicFromCalliTopic, isCalliLibreTopic } from '@/calligraphie/topics'
import { frTopicFromJeuxTopic, isJeuxLibreTopic } from '@/jeux/topics'
import {
  defaultVocabSelected,
  defaultVocabSubgroup,
  isVocabLearnType,
  isVocabPoolType,
  isVocabProductionType,
  makeCustomVocabWord,
  vocabLearnWordsFor,
  vocabSubgroupsFor,
  type VocabWordEntry,
} from '@/francais/vocab-learn'
import { readGameImageFile, GAME_IMAGE_ACCEPT } from '@/jeux/image'
import { isGrammarTheoryType } from '@/francais/grammar-theory'
import { isPhraseLibreEditable, PhraseLibreEditor } from '@/francais/PhraseLibreEditor'
import { soutienBankByTopic } from '@/francais/soutien/banks'
import { type1Words } from '@/francais/soutien/generate'
import { parseSoutienType } from '@/francais/soutien/kinds'
import {
  defaultSoutienMotsEntries,
  SoutienMotsLibreEditor,
} from '@/francais/soutien/SoutienMotsLibreEditor'
import {
  defaultSoutienCompleterEntries,
  SoutienCompleterLibreEditor,
} from '@/francais/soutien/SoutienCompleterLibreEditor'
import {
  CoordQuestionsLibreEditor,
  resizeCoordQuestionsLibre,
} from '@/math/CoordQuestionsLibreEditor'
import { defaultThemeGameContent, isGameBankType, reshuffleGameContent } from '@/jeux/bank'
import { defaultEntriesFor } from '@/jeux/defaults'
import { GameContentPanel } from '@/jeux/GameContentPanel'
import { DEFAULT_GAME_FONT_SIZE } from '@/jeux/font-size'
import { entriesToText } from '@/jeux/parse'
import { isJeuxType, templateFor } from '@/jeux/templates'
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
import {
  isTransformationCentrale,
  isTransformationExercise,
  isTransformationPlacer,
  TRANSFORM_LABELS,
  TRANSFORM_MAX_POINTS,
} from '@/math/coord-transformations'
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
  CoordReply,
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

function defaultCoordQuestionReply(exerciseType: string): CoordReply {
  return isReperageConstruire(exerciseType) ? 'draw' : 'text'
}

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

/** Consigne type 10 : l’ / le / la / les en gras + couleur thème. */
function renderSoutienInstruction(text: string): ReactNode {
  const marker = 'Complétez avec les déterminants '
  if (!text.startsWith(marker)) return text
  return (
    <>
      {marker}
      <span className="det-choice">l’</span>, <span className="det-choice">le</span>,{' '}
      <span className="det-choice">la</span> ou <span className="det-choice">les</span>.
    </>
  )
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M13.5 2.5a.75.75 0 0 0-1.5 0v1.2A5.5 5.5 0 1 0 13.4 10a.75.75 0 1 0-1.3-.75 4 4 0 1 1-1.05-3.7H9.25a.75.75 0 0 0 0 1.5h3.5A.75.75 0 0 0 13.5 6V2.5Z"
      />
    </svg>
  )
}

function WorksheetSheet({
  page,
  mode,
  institutional,
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
  onRegenerateBlock,
  coordEdit,
}: {
  page: WorksheetPage
  mode: PreviewMode
  institutional: InstitutionalHeader
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
  /** Bouton refresh : régénère uniquement cet exercice. */
  onRegenerateBlock?: (blockIndex: number) => void
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
    onRemove: (x: number, y: number) => void
  }
}) {
  const sheetTitle = institutional.documentTitle.trim()
  const isJeuxSheet = page.domain === 'jeux'
  const showHeader = pageNumber === 1 && !isJeuxSheet
  const parity = sheetIndex % 2 === 1 ? 'sheet-odd' : 'sheet-even'
  const isDraftPadPage = page.items.some(
    (item) =>
      item.layout === 'equation' ||
      (item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)) ||
      (item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)),
  )
  /** Soutien FR : Colonnes = grille interne ; la feuille A4 reste 1 colonne. */
  const sheetColumns = page.items.some((item) =>
    [
      'vocab-table',
      'letter-grid',
      'syllable-table',
      'vocab-match',
      'syllable-complete',
      'listen-check',
      'syllable-sound',
      'phrase-scramble',
      'determinant-fill',
      'dictee-grid',
      'count-sound',
      'read-phrases',
      'audio-match',
      'word-search',
    ].includes(item.layout),
  )
    ? 1
    : page.columns
  return (
    <article
      className={`worksheet-sheet ${parity}${isJeuxSheet ? ' is-jeux' : ''}`}
      style={{ '--sheet-columns': sheetColumns } as CSSProperties}
    >
      {showHeader ? (
        <InstitutionalDocumentHeader
          config={institutional}
          evalMode={evalMode}
          totalPoints={evalMode ? documentTotalPoints : undefined}
          fallbackTitle={page.title}
        />
      ) : null}
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
          const blockHeading = sheetTitle || block.title
          return (
            <section className="exercise-block" key={`${block.exerciseType}-${block.exerciseIndex}`}>
              {isJeuxSheet ? null : (
              <header className="exercise-heading">
                <div className="exercise-heading-main">
                  <div className="exercise-heading-title-row">
                    <h3>{blockHeading}</h3>
                    {onRegenerateBlock ? (
                      <button
                        type="button"
                        className="no-print exercise-refresh-btn"
                        aria-label="Régénérer cet exercice"
                        title="Régénérer cet exercice"
                        onClick={() => onRegenerateBlock(blockIndex)}
                      >
                        <RefreshIcon />
                      </button>
                    ) : null}
                  </div>
                  <p>{renderSoutienInstruction(block.instruction)}</p>
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
              )}
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
                style={
                  {
                    /* Soutien FR : Colonnes = grille interne ; la feuille reste 1 col. */
                    '--sheet-columns': block.items.some((item) =>
                      [
                        'vocab-table',
                        'letter-grid',
                        'syllable-table',
                        'vocab-match',
                        'syllable-complete',
                        'listen-check',
                        'syllable-sound',
                        'phrase-scramble',
                        'determinant-fill',
                        'dictee-grid',
                        'count-sound',
                        'read-phrases',
                        'audio-match',
                        'word-search',
                      ].includes(item.layout),
                    )
                      ? 1
                      : block.columns,
                  } as CSSProperties
                }
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
      {isJeuxSheet ? null : (
        <DocumentFooter
          pageNumber={pageNumber}
          total={total}
          reference={institutional.reference}
        />
      )}
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
          aria-label="Autre couleur"
          className={`theme-color-swatch theme-color-other${!isPreset ? ' active' : ''}`}
          style={!isPreset ? { background: themeColor } : undefined}
          onClick={() => {
            setHue(hexToHue(themeColor))
            setOpen((current) => !current)
          }}
        />
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

function VocabAddWordRow({
  onAdd,
  withImage = true,
  placeholder = 'Nouveau mot',
}: {
  onAdd: (entry: VocabWordEntry) => void
  withImage?: boolean
  placeholder?: string
}) {
  const [label, setLabel] = useState('')
  const [imageSrc, setImageSrc] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPick(file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      setImageSrc(dataUrl)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  return (
    <div className={`vocab-add-row${withImage ? '' : ' is-text-only'}`}>
      {withImage ? (
        <>
          <button
            type="button"
            className={`vocab-add-thumb${imageSrc ? ' has-image' : ''}`}
            aria-label="Image du nouveau mot"
            onClick={() => fileRef.current?.click()}
          >
            {imageSrc ? <img src={imageSrc} alt="" /> : <span aria-hidden>+</span>}
          </button>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept={GAME_IMAGE_ACCEPT}
            onChange={(event) => {
              void onPick(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </>
      ) : null}
      <input
        className="pill-input"
        type="text"
        value={label}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setLabel(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return
          event.preventDefault()
          const word = label.trim()
          if (!word) return
          onAdd(makeCustomVocabWord(word, withImage ? imageSrc : undefined))
          setLabel('')
          setImageSrc(undefined)
          setError(null)
        }}
      />
      <button
        type="button"
        className="vocab-add-btn"
        aria-label="Ajouter"
        title="Ajouter"
        disabled={!label.trim()}
        onClick={() => {
          const word = label.trim()
          if (!word) return
          onAdd(makeCustomVocabWord(word, withImage ? imageSrc : undefined))
          setLabel('')
          setImageSrc(undefined)
          setError(null)
        }}
      >
        +
      </button>
      {error ? (
        <p className="questions-overflow-hint" role="alert">
          {error}
        </p>
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
            <span>Gattegno</span>
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
  const isSoutienFr = type.topic.startsWith('soutien-')
  const soutienKind = isSoutienFr ? parseSoutienType(type.id)?.kind : undefined
  const isPhrase = type.topic.startsWith('phrase-')
  const isPhraseChart = type.id.startsWith('phrase-tableau-')
  const isFormes = isReperageFormes(type.id)
  const isCadrans = isReperageCadrans(type.id)
  const isDroites = isReperageDroites(type.id)
  const isConstruire = isReperageConstruire(type.id)
  const isTransform = isTransformationExercise(type.id)
  const isGeoCalc = isDraftPadExercise(type.id) && !isProblem && !isEquation
  const isFrenchCom = type.track === 'com'
  const isComQcm =
    type.id.includes('-com-orale') || type.id.includes('-com-ecrite')
  const isTheory = isGrammarTheoryType(type.id)
  const isFrenchLang = type.track === 'voc' || type.track === 'gram'
  const isVocabLearn = isVocabLearnType(type.id)
  const isVocabPool = isVocabPoolType(type.id)
  const isVocabProd = isVocabProductionType(type.id)
  const isJeux = isJeuxType(type.id)
  const isCalli = isCalligraphieType(type.id)
  const vocabSubgroup =
    prev?.topic === type.topic && prev.vocabSubgroup
      ? prev.vocabSubgroup
      : defaultVocabSubgroup(type.topic)
  const bankIds = new Set(
    vocabLearnWordsFor(type.topic, vocabSubgroup).map((word) => word.id),
  )
  const preservedSelected =
    prev?.topic === type.topic && prev.vocabSelected?.length
      ? prev.vocabSelected.filter((id) => bankIds.has(id) || id.startsWith('custom-'))
      : []
  const vocabSelected =
    preservedSelected.length > 0
      ? preservedSelected
      : defaultVocabSelected(type.topic, 3, 3, vocabSubgroup)
  const vocabCustomEntries =
    prev?.topic === type.topic ? prev.vocabCustomEntries : undefined
  const preservedGame =
    prev?.exerciseType === type.id && prev.gameEntries?.length
      ? prev.gameEntries
      : undefined
  const jeuxFrTopic = isJeux ? frTopicFromJeuxTopic(type.topic) : undefined
  const themeGame =
    isJeux && isGameBankType(type.id) && jeuxFrTopic
      ? defaultThemeGameContent(type.id, jeuxFrTopic)
      : isJeux && isGameBankType(type.id) && isJeuxLibreTopic(type.topic)
        ? null
        : isJeux && isGameBankType(type.id)
          ? defaultThemeGameContent(type.id)
          : null
  const gameEntries =
    preservedGame ??
    (themeGame?.gameEntries ?? (isJeux ? defaultEntriesFor(type.id) : undefined))
  const gameText =
    prev?.exerciseType === type.id && prev.gameText != null
      ? prev.gameText
      : gameEntries
        ? entriesToText(type.id, gameEntries)
        : undefined
  const gameSource =
    prev?.exerciseType === type.id && prev.gameSource
      ? prev.gameSource
      : isJeux && isJeuxLibreTopic(type.topic)
        ? 'libre'
        : themeGame?.gameSource
  const gameTopic =
    prev?.exerciseType === type.id && prev.gameTopic
      ? prev.gameTopic
      : jeuxFrTopic ?? themeGame?.gameTopic
  const gameSelectedIds =
    prev?.exerciseType === type.id && prev.gameSelectedIds?.length
      ? prev.gameSelectedIds
      : themeGame?.gameSelectedIds
  const seriesDefaults: Record<string, string> = {
    'jeux-vocabulaire': 'Vocabulaire',
    'jeux-devinettes': 'Devinettes',
    'jeux-memory': 'Mémory',
    'jeux-intrus': 'Intrus',
    'jeux-loto': 'Loto',
    'jeux-dominos': 'Dominos',
  }
  const usesSeriesIdentity =
    type.id === 'jeux-memory' ||
    type.id === 'jeux-intrus' ||
    type.id === 'jeux-loto' ||
    type.id === 'jeux-vocabulaire' ||
    type.id === 'jeux-devinettes' ||
    type.id === 'jeux-dominos'
  const gameBackColor =
    prev?.exerciseType === type.id ? prev.gameBackColor : undefined
  const gameSeriesName =
    prev?.exerciseType === type.id && prev.gameSeriesName
      ? prev.gameSeriesName
      : seriesDefaults[type.id]
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
          : isPhraseChart || isVocabLearn || isJeux || isCalli || isTheory
            ? { count: 1 }
            : isVocabPool
              ? { count: Math.min(6, Math.max(2, vocabSelected.length)) }
              : isPhrase
                ? { count: 6 }
                : isLectureDense
                  ? { count: 4 }
                  : soutienKind === 'lettres'
                    ? { count: 5 }
                    : soutienKind === 'syllabes'
                      ? { count: 4 }
                      : soutienKind === 'relier' ||
                          soutienKind === 'completer' ||
                          soutienKind === 'ecouter' ||
                          soutienKind === 'ecouter-image' ||
                          soutienKind === 'syllabe-son' ||
                          soutienKind === 'lettres-phrase' ||
                          soutienKind === 'determinants' ||
                          soutienKind === 'dictee' ||
                          soutienKind === 'compter'
                        ? {
                            count:
                              soutienKind === 'lettres-phrase'
                                ? 6
                                : soutienKind === 'ecouter-image'
                                  ? 9
                                  : soutienKind === 'compter'
                                    ? 5
                                    : 8,
                          }
                        : isLecture || isSoutienFr
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
                                    : isTransform
                                      ? { count: 4 }
                                      : {}),
    ...(isVocabPool
      ? {
          columns: 1,
          vocabSelected,
          vocabSubgroup,
          vocabCustomEntries,
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
          vocabSubgroup: undefined,
          vocabCustomEntries: undefined,
          vocabLineCh: undefined,
        }),
    ...(isJeux
      ? {
          columns: 1,
          gameEntries,
          gameText,
          gameSource,
          gameTopic,
          gameSelectedIds,
          gameBackColor: usesSeriesIdentity ? gameBackColor : undefined,
          gameSeriesName: usesSeriesIdentity ? gameSeriesName : undefined,
          gameBorderId:
            prev?.exerciseType === type.id
              ? (prev.gameBorderRectoId ?? prev.gameBorderId)
              : undefined,
          gameBorderRectoId:
            prev?.exerciseType === type.id
              ? (prev.gameBorderRectoId ?? prev.gameBorderId)
              : undefined,
          gameBorderVersoId:
            prev?.exerciseType === type.id
              ? (prev.gameBorderVersoId ?? prev.gameBorderId)
              : undefined,
          gameFontSize:
            prev?.exerciseType === type.id
              ? (prev.gameFontSize ?? DEFAULT_GAME_FONT_SIZE)
              : DEFAULT_GAME_FONT_SIZE,
          gameAlpha:
            type.id === 'jeux-vocabulaire'
              ? prev?.exerciseType === type.id
                ? Boolean(prev.gameAlpha)
                : false
              : undefined,
        }
      : {
          gameEntries: undefined,
          gameText: undefined,
          gameSource: undefined,
          gameTopic: undefined,
          gameSelectedIds: undefined,
          gameBackColor: undefined,
          gameSeriesName: undefined,
          gameBorderId: undefined,
          gameBorderRectoId: undefined,
          gameBorderVersoId: undefined,
          gameFontSize: undefined,
          gameAlpha: undefined,
        }),
    ...(soutienKind === 'mots'
      ? {
          soutienMotsLibre:
            prev?.exerciseType === type.id ? Boolean(prev.soutienMotsLibre) : false,
          soutienMotsEntries:
            prev?.exerciseType === type.id ? prev.soutienMotsEntries : undefined,
        }
      : {
          soutienMotsLibre: undefined,
          soutienMotsEntries: undefined,
        }),
    ...(soutienKind === 'completer'
      ? {
          soutienCompleterLibre:
            prev?.exerciseType === type.id ? Boolean(prev.soutienCompleterLibre) : false,
          soutienCompleterEntries:
            prev?.exerciseType === type.id ? prev.soutienCompleterEntries : undefined,
        }
      : {
          soutienCompleterLibre: undefined,
          soutienCompleterEntries: undefined,
        }),
    ...(soutienKind === 'relier'
      ? {
          columns:
            prev?.exerciseType === type.id
              ? Math.min(2, Math.max(1, prev.columns ?? 1))
              : 1,
        }
      : soutienKind === 'completer' ||
          soutienKind === 'ecouter' ||
          soutienKind === 'syllabe-son'
        ? {
            columns:
              prev?.exerciseType === type.id
                ? Math.min(3, Math.max(1, prev.columns ?? 3))
                : soutienKind === 'completer'
                  ? 2
                  : 3,
          }
        : soutienKind === 'ecouter-image'
          ? {
              columns:
                prev?.exerciseType === type.id
                  ? Math.min(5, Math.max(3, prev.columns ?? 3))
                  : 3,
            }
          : {}),
    ...(isCalli
      ? (() => {
          const topic = type.topic.startsWith('calli-')
            ? type.topic
            : prev?.topic?.startsWith('calli-')
              ? prev.topic
              : type.topic
          const frTopic = frTopicFromCalliTopic(topic)
          const subgroup =
            prev?.topic === topic && prev.vocabSubgroup
              ? prev.vocabSubgroup
              : frTopic
                ? defaultVocabSubgroup(frTopic)
                : undefined
          const sameKind =
            prev != null &&
            isCalligraphieType(prev.exerciseType) &&
            isCalliPhrasesType(prev.exerciseType) === isCalliPhrasesType(type.id)
          const keepText =
            sameKind && prev.topic === topic && prev.calliText != null && prev.calliText !== ''
          return {
            columns: 1,
            topic,
            vocabSubgroup: subgroup,
            calliText: keepText
              ? prev.calliText
              : initialCalliText({
                  exerciseType: type.id,
                  topic,
                  difficulty: prev?.difficulty ?? 'moyen',
                  calliSize: prev?.calliSize ?? DEFAULT_CALLI_SIZE,
                  vocabSubgroup: subgroup,
                }),
            calliFont:
              prev != null && isCalligraphieType(prev.exerciseType) && prev.calliFont
                ? prev.calliFont
                : DEFAULT_CALLI_FONT,
            calliSize:
              prev != null && isCalligraphieType(prev.exerciseType) && prev.calliSize
                ? prev.calliSize
                : DEFAULT_CALLI_SIZE,
          }
        })()
      : { calliText: undefined, calliFont: undefined, calliSize: undefined }),
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
      : isCadrans || isDroites || isConstruire || isTransform
        ? {
            coordLibre:
              isCadrans || isTransform || isDroites || isConstruire ? false : undefined,
            coordQuestionsLibre: undefined,
            coordCols: AXES_DEFAULT_COLS,
            coordRows: AXES_DEFAULT_ROWS,
            coordAxis: undefined,
            coordMarks: isCadrans || isTransform ? [] : undefined,
            coordRange: undefined,
            coordCellMm: DEFAULT_CELL_MM,
            coordUnitSquares: DEFAULT_UNIT_SQUARES,
            coordOriginCol: undefined,
            coordOriginRow: undefined,
          }
        : {
            coordLibre: undefined,
            coordQuestionsLibre: undefined,
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
  const [institutional, setInstitutional] = useState<InstitutionalHeader>(DEFAULT_INSTITUTIONAL)
  const [evalMode, setEvalMode] = useState(false)
  const [pointsPerQuestion, setPointsPerQuestion] = useState(1)
  const [seed, setSeed] = useState(randomSeed)
  const [questionsOverflow, setQuestionsOverflow] = useState(false)
  const [selectedCoordShape, setSelectedCoordShape] = useState<CoordShape | null>('triangle')
  const [coordTool, setCoordTool] = useState<'origin' | 'given' | 'points' | 'center'>('origin')
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
  /** Jeux : aperçu de toutes les feuilles de la config (recto + verso) côte à côte / empilées. */
  const jeuxPreviewSheets = useMemo(() => {
    if (activePage.domain !== 'jeux') return null
    const related = worksheets
      .map((sheet, index) => ({ sheet, index }))
      .filter(({ sheet }) => (sheet.configIndex ?? 0) === pageIndex)
    return related.length > 0 ? related : null
  }, [activePage.domain, worksheets, pageIndex])
  const available =
    activePage.domain === 'français'
      ? frenchTopics
      : activePage.domain === 'algèbre'
        ? algebraTopics
        : activePage.domain === 'géométrie'
          ? geometryTopics
          : activePage.domain === 'gattegno'
            ? gattegnoTopics
            : activePage.domain === 'jeux'
              ? jeuxTopics
              : activePage.domain === 'calligraphie'
                ? calligraphieTopics
                : activePage.domain === 'soutien-fr'
                  ? soutienFrTopics
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
    institutional,
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
            // Nouveau type / nombre de questions → retirer le brouillon libre pour retirer.
            phraseItems:
              patch.exerciseType != null || patch.count != null ? undefined : fixed.phraseItems,
            phraseInstruction:
              patch.exerciseType != null || patch.count != null
                ? undefined
                : fixed.phraseInstruction,
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
        if (
          fixed.coordLibre &&
          isTransformationExercise(fixed.exerciseType) &&
          patch.count != null &&
          fixed.coordMarks?.length
        ) {
          const omega = fixed.coordMarks.find((mark) => mark.label === 'Ω')
          const figure = fixed.coordMarks
            .filter((mark) => mark.label !== 'Ω')
            .slice(0, Math.min(fixed.count, TRANSFORM_MAX_POINTS))
          fixed = {
            ...fixed,
            coordMarks: omega ? [...figure, omega] : figure,
          }
        }
        return setPageBlock(merged, safeBlockIndex, fixed)
      }),
    )

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
  const isPhraseDomain = activePage.domain === 'gattegno'
  const isJeuxDomain = activePage.domain === 'jeux'
  const isCalliDomain = activePage.domain === 'calligraphie'
  const isSoutienFr = activePage.domain === 'soutien-fr'
  const soutienKind = isSoutienFr ? parseSoutienType(activeBlock.exerciseType)?.kind : undefined
  const isSoutienMots = soutienKind === 'mots'
  const isSoutienCompleter = soutienKind === 'completer'
  const isSoutienRelier = soutienKind === 'relier'
  const isSoutienLignes = soutienKind === 'lettres' || soutienKind === 'syllabes'
  /** Types 4–11 : le champ compte des mots (pas des « questions » génériques). */
  const isSoutienMotsCount =
    soutienKind === 'relier' ||
    soutienKind === 'completer' ||
    soutienKind === 'ecouter' ||
    soutienKind === 'ecouter-image' ||
    soutienKind === 'syllabe-son' ||
    soutienKind === 'lettres-phrase' ||
    soutienKind === 'determinants' ||
    soutienKind === 'dictee'
  /** Type 5 de la fiche (même thème) — fixe le nb de questions du type 10. */
  const soutienType5Count = (() => {
    if (!isSoutienFr) return undefined
    for (const page of pages) {
      for (const block of pageBlocks(page)) {
        if (
          parseSoutienType(block.exerciseType)?.kind === 'completer' &&
          block.topic === activeBlock.topic
        ) {
          return block.count
        }
      }
    }
    return undefined
  })()
  const isSoutienDetLocked =
    soutienKind === 'determinants' && soutienType5Count != null
  /** Aligne le type 10 sur le nombre de mots du type 5 (même thème). */
  const soutienDetSyncKey = useMemo(() => {
    if (!isSoutienFr) return ''
    return pages
      .flatMap((page) =>
        pageBlocks(page).map((block) => {
          const kind = parseSoutienType(block.exerciseType)?.kind
          if (kind === 'completer' || kind === 'determinants') {
            return `${block.topic}:${kind}:${block.count}`
          }
          return ''
        }),
      )
      .filter(Boolean)
      .join('|')
  }, [isSoutienFr, pages])
  useEffect(() => {
    if (!soutienDetSyncKey) return
    setPages((current) => {
      const type5ByTopic = new Map<string, number>()
      for (const page of current) {
        for (const block of pageBlocks(page)) {
          if (parseSoutienType(block.exerciseType)?.kind !== 'completer') continue
          if (!type5ByTopic.has(block.topic)) {
            type5ByTopic.set(block.topic, block.count)
          }
        }
      }
      if (type5ByTopic.size === 0) return current
      let changed = false
      const next = current.map((page) => {
        const blocks = pageBlocks(page)
        let updated = page
        blocks.forEach((block, bi) => {
          if (parseSoutienType(block.exerciseType)?.kind !== 'determinants') return
          const want = type5ByTopic.get(block.topic)
          if (want == null || block.count === want) return
          changed = true
          updated = setPageBlock(updated, bi, { ...block, count: want })
        })
        return updated
      })
      return changed ? next : current
    })
  }, [soutienDetSyncKey])
  /** Types 5 / 6 / 8 : grille 1–3 colonnes. */
  const isSoutienCols123 =
    soutienKind === 'completer' ||
    soutienKind === 'ecouter' ||
    soutienKind === 'syllabe-son'
  /** Type 7 : grille images 3–5 colonnes (fluide). */
  const isSoutienCols345 = soutienKind === 'ecouter-image'
  const soutienBank = isSoutienFr ? soutienBankByTopic(activeBlock.topic) : undefined
  const soutienType1Words = soutienBank ? type1Words(soutienBank) : []
  const calliFrTopic = isCalliDomain ? frTopicFromCalliTopic(activeBlock.topic) : undefined
  const calliIsLibre = isCalliDomain && isCalliLibreTopic(activeBlock.topic)
  const calliIsPhrases = isCalliDomain && isCalliPhrasesType(activeBlock.exerciseType)
  const vocabSubgroups = isVocabPool
    ? vocabSubgroupsFor(activeBlock.topic)
    : calliFrTopic
      ? vocabSubgroupsFor(calliFrTopic)
      : []
  const activeVocabSubgroup =
    activeBlock.vocabSubgroup ??
    vocabSubgroups[0]?.id ??
    (calliFrTopic ? defaultVocabSubgroup(calliFrTopic) : defaultVocabSubgroup(activeBlock.topic))
  const vocabBankWords = isVocabPool
    ? vocabLearnWordsFor(activeBlock.topic, activeVocabSubgroup)
    : calliFrTopic
      ? vocabLearnWordsFor(calliFrTopic, activeVocabSubgroup)
      : []
  const vocabCustomWords = (activeBlock.vocabCustomEntries ?? []) as VocabWordEntry[]
  const vocabLearnWords = [...vocabBankWords, ...vocabCustomWords].sort((a, b) =>
    a.label.localeCompare(b.label, 'fr'),
  )
  const vocabSelectedIds =
    activeBlock.vocabSelected ??
    (isVocabPool
      ? defaultVocabSelected(
          activeBlock.topic,
          activeBlock.vocabRows ?? 3,
          activeBlock.vocabCols ?? 3,
          activeVocabSubgroup,
        )
      : [])
  const usesCefrLevel =
    (isVocabPool && !isVocabLearn) ||
    isCalliDomain ||
    activeBlock.exerciseType.includes('-com-ecrite') ||
    activeBlock.exerciseType.includes('-com-orale')
  const vocabDifficultyOptions = usesCefrLevel
    ? [
        { value: 'facile' as const, label: 'A1 · Simple' },
        { value: 'moyen' as const, label: 'A2 · Moyen' },
        { value: 'avance' as const, label: 'B1 · Avancé' },
      ]
    : DIFFICULTY_OPTIONS
  const calliDefaultCount = calliIsPhrases
    ? defaultCalliPhraseCount(activeBlock.calliSize)
    : defaultCalliWordCount(activeBlock.calliSize)
  const calliFields = normalizeCalliFields(parseCalliLines(activeBlock.calliText), calliDefaultCount)
  const jeuxTemplate = isJeuxDomain ? templateFor(activeBlock.exerciseType) : null
  const jeuxText =
    activeBlock.gameText ??
    entriesToText(activeBlock.exerciseType, activeBlock.gameEntries ?? defaultEntriesFor(activeBlock.exerciseType))
  const isCadrans = isReperageCadrans(activeBlock.exerciseType)
  const isComposer = isReperageComposer(activeBlock.exerciseType)
  const isFormes = isReperageFormes(activeBlock.exerciseType)
  const isDroites = isReperageDroites(activeBlock.exerciseType)
  const isConstruire = isReperageConstruire(activeBlock.exerciseType)
  const isTransform = isTransformationExercise(activeBlock.exerciseType)
  const isTransformCentrale = isTransformationCentrale(activeBlock.exerciseType)
  const isTransformPlacer = isTransformationPlacer(activeBlock.exerciseType)
  const maxQuestions = isComposer
    ? COORD_LETTER_MAX - 1
    : isFormes
      ? COORD_SHAPES.length
      : isTransform
        ? TRANSFORM_MAX_POINTS
        : isReperage
          ? COORD_LETTER_MAX
          : soutienKind === 'lettres'
            ? 15
            : soutienKind === 'syllabes'
              ? 10
              : soutienKind === 'relier' || soutienKind === 'completer'
                ? 16
                : soutienKind === 'ecouter' || soutienKind === 'syllabe-son'
                  ? 18
                  : soutienKind === 'ecouter-image'
                    ? 20
                    : soutienKind === 'lettres-phrase' ||
                        soutienKind === 'determinants' ||
                        soutienKind === 'dictee'
                      ? 16
                      : soutienKind === 'compter'
                        ? 12
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
    if (isTransform && activeBlock.coordLibre) {
      const grid = resolveAxesGrid(activeAsPage, activeBlock.difficulty)
      const origin = { col: grid.cols / 2, row: grid.rows / 2 }
      if (!markOnGrid({ x, y, kind: 'point' }, origin, grid.cols, grid.rows, grid.unitSquares)) return
      const current = activeBlock.coordMarks ?? []
      const omega = current.find((mark) => mark.label === 'Ω')
      const figure = current.filter((mark) => mark.label !== 'Ω')
      const maxPts = Math.min(activeBlock.count, TRANSFORM_MAX_POINTS)
      const placeCenter = isTransformCentrale && coordTool === 'center'

      if (placeCenter) {
        const withoutOmega = figure.filter((mark) => !(mark.x === x && mark.y === y))
        updatePage({
          coordLibre: true,
          coordCols: grid.cols,
          coordRows: grid.rows,
          coordCellMm: grid.cellMm,
          coordUnitSquares: grid.unitSquares,
          coordMarks: [
            ...withoutOmega,
            { x, y, kind: 'point', label: 'Ω', given: true, showCoord: true },
          ],
        })
        return
      }

      const hit = current.find((mark) => mark.x === x && mark.y === y)
      if (hit) {
        updatePage({
          coordLibre: true,
          coordMarks: current.filter((mark) => !(mark.x === x && mark.y === y)),
        })
        return
      }
      if (figure.length >= maxPts) return
      const used = new Set(figure.map((mark) => mark.label))
      const label = TRANSFORM_LABELS.find((name) => !used.has(name)) ?? `P${figure.length + 1}`
      const nextFigure = [...figure, { x, y, kind: 'point' as const, label }]
      updatePage({
        coordLibre: true,
        coordCols: grid.cols,
        coordRows: grid.rows,
        coordCellMm: grid.cellMm,
        coordUnitSquares: grid.unitSquares,
        coordMarks: omega ? [...nextFigure, omega] : nextFigure,
        count: Math.max(activeBlock.count, nextFigure.length),
      })
      return
    }
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
      vocabSubgroup: fields.vocabSubgroup,
      vocabCustomEntries: fields.vocabCustomEntries,
      vocabRows: fields.vocabRows,
      vocabCols: fields.vocabCols,
      vocabLineCh: fields.vocabLineCh,
      gameEntries: fields.gameEntries,
      gameText: fields.gameText,
      gameSource: fields.gameSource,
      gameTopic: fields.gameTopic,
      gameSelectedIds: fields.gameSelectedIds,
      gameBackColor: fields.gameBackColor,
      gameSeriesName: fields.gameSeriesName,
      gameBorderId:
        (fields.gameBorderRectoId || fields.gameBorderVersoId || fields.gameBorderId) || undefined,
      // '' = aucune bordure explicite (ne pas replier sur gameBorderId).
      gameBorderRectoId:
        fields.gameBorderRectoId !== undefined
          ? fields.gameBorderRectoId
          : fields.gameBorderId,
      gameBorderVersoId:
        fields.gameBorderVersoId !== undefined
          ? fields.gameBorderVersoId
          : fields.gameBorderId,
      gameFontSize: fields.gameFontSize ?? DEFAULT_GAME_FONT_SIZE,
      gameAlpha: fields.gameAlpha,
      soutienMotsLibre: fields.soutienMotsLibre,
      soutienMotsEntries: fields.soutienMotsEntries,
      soutienCompleterLibre: fields.soutienCompleterLibre,
      soutienCompleterEntries: fields.soutienCompleterEntries,
      calliText: fields.calliText,
      calliFont: fields.calliFont,
      calliSize: fields.calliSize,
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
    if (
      next === 'français' ||
      next === 'lecture' ||
      next === 'soutien-fr' ||
      next === 'gattegno' ||
      next === 'jeux' ||
      next === 'calligraphie'
    ) {
      setInstitutional((current) =>
        current.course === 'Mathématiques' ? { ...current, course: 'Français' } : current,
      )
    }
    if (next === 'jeux' || next === 'calligraphie') {
      setEvalMode(false)
      setMode('student')
    }
  }

  function changeTopic(topic: string) {
    if (activePage.domain === 'calligraphie') {
      const kind = isCalliPhrasesType(activeBlock.exerciseType) ? 'calli-phrases' : 'calli-mots'
      const type = { ...exerciseTypeById[kind]!, topic }
      const frTopic = frTopicFromCalliTopic(topic)
      const subgroup = frTopic ? defaultVocabSubgroup(frTopic) : undefined
      updatePage({
        topic,
        ...applyType(type, { ...activeBlock, topic, vocabSubgroup: subgroup, calliText: undefined }),
        vocabSubgroup: subgroup,
      })
      return
    }
    if (activePage.domain === 'jeux') {
      const kind = isJeuxType(activeBlock.exerciseType) ? activeBlock.exerciseType : 'jeux-vocabulaire'
      const type = { ...exerciseTypeById[kind]!, topic }
      updatePage({
        topic,
        ...applyType(type, { ...activeBlock, topic, gameTopic: undefined, gameEntries: undefined, gameText: undefined, gameSelectedIds: undefined }),
      })
      return
    }
    if (activePage.domain === 'soutien-fr') {
      const parsed = parseSoutienType(activeBlock.exerciseType)
      const kind = parsed?.kind ?? 'mots'
      const nextId = `soutien-${topic.replace(/^soutien-/, '')}-${kind}`
      const type = exerciseTypeById[nextId] ?? firstTypeFor('soutien-fr', topic)
      // Changer de voyelle : repartir de la banque (ne pas garder les mots libres de l’autre son).
      updatePage({
        topic,
        ...applyType(type, {
          ...activeBlock,
          topic,
          soutienMotsLibre: false,
          soutienMotsEntries: undefined,
          soutienCompleterLibre: false,
          soutienCompleterEntries: undefined,
        }),
      })
      return
    }
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
    const nextSeed = randomSeed()
    setSeed(nextSeed)
    setMode('student')
    if (isCalligraphieType(activeBlock.exerciseType)) {
      const nextText = reshuffleCalliContent(nextSeed, {
        exerciseType: activeBlock.exerciseType,
        topic: activeBlock.topic,
        difficulty: activeBlock.difficulty,
        calliText: activeBlock.calliText,
        calliFont: activeBlock.calliFont,
        calliSize: activeBlock.calliSize,
        vocabSubgroup: activeBlock.vocabSubgroup,
        countHint: Math.max(parseCalliLines(activeBlock.calliText).length, calliFields.length),
      })
      updatePage({ calliText: nextText, contentSeed: nextSeed })
      return
    }
    if (activeBlock.verbGroup === 'libre' && isPhraseLibreEditable(activeBlock.exerciseType)) {
      // Nouveau tirage banque → l’effet resynchronise phraseItems.
      updatePage({ phraseItems: undefined, phraseInstruction: undefined, contentSeed: nextSeed })
      return
    }
    if (!isJeuxType(activeBlock.exerciseType)) return
    const reshuffled = reshuffleGameContent(activeBlock.exerciseType, nextSeed, {
      gameSource: activeBlock.gameSource,
      gameTopic: activeBlock.gameTopic,
      gameSelectedIds: activeBlock.gameSelectedIds,
      gameEntries: activeBlock.gameEntries,
    })
    updatePage({
      gameEntries: reshuffled.gameEntries,
      gameText: reshuffled.gameText,
      gameSelectedIds: reshuffled.gameSelectedIds,
      contentSeed: nextSeed,
    })
  }

  /** Régénère uniquement l’exercice ciblé (les autres blocs / pages restent inchangés). */
  function regenerateBlock(targetBlock: number) {
    const nextSeed = randomSeed()
    setMode('student')
    setBlockIndex(targetBlock)
    setPages((current) =>
      current.map((page, index) => {
        if (index !== pageIndex) return page
        const block = pageBlocks(page)[targetBlock]
        if (!block) return page
        let patch: Partial<ExerciseBlock> = { contentSeed: nextSeed }
        if (isCalligraphieType(block.exerciseType)) {
          patch = {
            ...patch,
            calliText: reshuffleCalliContent(nextSeed, {
              exerciseType: block.exerciseType,
              topic: block.topic,
              difficulty: block.difficulty,
              calliText: block.calliText,
              calliFont: block.calliFont,
              calliSize: block.calliSize,
              vocabSubgroup: block.vocabSubgroup,
              countHint: Math.max(parseCalliLines(block.calliText).length, 1),
            }),
          }
        } else if (block.verbGroup === 'libre' && isPhraseLibreEditable(block.exerciseType)) {
          patch = {
            ...patch,
            phraseItems: undefined,
            phraseInstruction: undefined,
          }
        } else if (isJeuxType(block.exerciseType)) {
          const reshuffled = reshuffleGameContent(block.exerciseType, nextSeed, {
            gameSource: block.gameSource,
            gameTopic: block.gameTopic,
            gameSelectedIds: block.gameSelectedIds,
            gameEntries: block.gameEntries,
          })
          patch = {
            ...patch,
            gameEntries: reshuffled.gameEntries,
            gameText: reshuffled.gameText,
            gameSelectedIds: reshuffled.gameSelectedIds,
          }
        }
        return setPageBlock(page, targetBlock, patch)
      }),
    )
  }

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
    updatePage({
      verbGroup: next,
      phraseItems: undefined,
      phraseInstruction: undefined,
    })
    setSeed(randomSeed())
  }

  function setCalliFieldAt(index: number, value: string) {
    const next = [...calliFields]
    next[index] = value
    updatePage({ calliText: joinCalliLines(next) })
  }

  function addCalliExtraWord(entry: VocabWordEntry) {
    const word = entry.label.trim()
    if (!word) return
    const base = calliFields.filter((line) => line.trim().length > 0)
    updatePage({ calliText: joinCalliLines([...base, word]) })
  }

  function removeCalliField(index: number) {
    if (calliFields.length <= 1) {
      updatePage({ calliText: '' })
      return
    }
    updatePage({ calliText: joinCalliLines(calliFields.filter((_, i) => i !== index)) })
  }

  function printAll() {
    window.print()
  }

  const chromeProps = {
    institutional,
    evalMode,
    documentTotalPoints: sheetTotalPoints,
    pointsPerQuestion,
  } as const

  const sheetProps = {
    mode,
    ...chromeProps,
    onRegenerateBlock: regenerateBlock,
  } as const


  return (
    <div
      className="app-shell"
      style={
        {
          '--purple': themeColor,
          '--lavender': `color-mix(in srgb, ${themeColor} 14%, #fff)`,
          '--theme-on': contrastOnTheme(themeColor),
        } as CSSProperties
      }
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
              {worksheets.map((sheet, index) => {
                const sideLabel = sheet.title?.includes('—')
                  ? sheet.title.split('—').pop()?.trim()
                  : undefined
                const tabLabel =
                  sheet.domain === 'jeux' && sideLabel
                    ? sideLabel
                    : sheet.isContinuation
                      ? 'suite'
                      : String(index + 1)
                return (
                <button
                  key={`${sheet.configIndex ?? index}-${sheet.isContinuation ? 'suite' : 'main'}-${index}`}
                  type="button"
                  className={safeSheetIndex === index ? 'active' : ''}
                  onClick={() => {
                    setSheetIndex(index)
                    setBlockIndex(0)
                  }}
                  aria-label={
                    sheet.domain === 'jeux' && sideLabel
                      ? sideLabel
                      : sheet.isContinuation
                        ? `Page ${index + 1} (suite)`
                        : `Page ${index + 1}`
                  }
                >
                  <span className="tab-number">{tabLabel}</span>
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
                )
              })}
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
              {isJeuxDomain || isCalliDomain ? null : (
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
              )}

              <SelectBox label="Domaine" value={activePage.domain} onChange={(value) => changeDomain(value as Domain)}>
                <option value="français">Français</option>
                <option value="algèbre">Algèbre</option>
                <option value="géométrie">Géométrie</option>
                <option value="gattegno">Gattegno</option>
                <option value="jeux">Grilles de cartes</option>
                <option value="calligraphie">Calligraphie</option>
                <option value="soutien-fr">Soutien FR</option>
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
                  <div className="mode-toggle is-3" role="group" aria-label="Groupe de verbes">
                    <button
                      type="button"
                      className={(activeBlock.verbGroup ?? 'er') === 'er' ? 'active' : ''}
                      onClick={() => setVerbGroup('er')}
                    >
                      Simple
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'autres' ? 'active' : ''}
                      onClick={() => setVerbGroup('autres')}
                    >
                      Autres
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'libre' ? 'active' : ''}
                      onClick={() => setVerbGroup('libre')}
                    >
                      Libre
                    </button>
                  </div>
                </div>
              ) : null}
              {isPhraseDomain &&
              !isPhraseChart &&
              activeBlock.verbGroup === 'libre' &&
              isPhraseLibreEditable(activeBlock.exerciseType) ? (
                <PhraseLibreEditor
                  exerciseType={activeBlock.exerciseType}
                  items={activeBlock.phraseItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []}
                  instruction={
                    activeBlock.phraseInstruction ??
                    activeSheet?.blocks[safeBlockIndex]?.instruction ??
                    ''
                  }
                  onChangeItems={(phraseItems) => updatePage({ phraseItems })}
                  onChangeInstruction={(phraseInstruction) => updatePage({ phraseInstruction })}
                />
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
              {isCalliDomain ? (
                <>
                  <div className="mode-toggle-block">
                    <b>Écriture</b>
                    <div className="mode-toggle" role="group" aria-label="Police d’écriture">
                      {CALLI_FONTS.map((font) => (
                        <button
                          key={font.id}
                          type="button"
                          className={(activeBlock.calliFont ?? DEFAULT_CALLI_FONT) === font.id ? 'active' : ''}
                          onClick={() => updatePage({ calliFont: font.id })}
                        >
                          {font.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mode-toggle-block">
                    <b>Taille</b>
                    <div className="mode-toggle is-3" role="group" aria-label="Taille d’écriture">
                      {CALLI_SIZES.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          className={(activeBlock.calliSize ?? DEFAULT_CALLI_SIZE) === size.id ? 'active' : ''}
                          onClick={() => {
                            const nextText = initialCalliText({
                              exerciseType: activeBlock.exerciseType,
                              topic: activeBlock.topic,
                              difficulty: activeBlock.difficulty,
                              calliSize: size.id,
                              vocabSubgroup: activeBlock.vocabSubgroup,
                            })
                            updatePage({ calliSize: size.id, calliText: nextText })
                          }}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                    <small className="muted">
                      {calliIsPhrases
                        ? 'Phrases : Petit 6 · Moyen 5 · Grand 4 blocs (vous pouvez en ajouter).'
                        : `Mots : Petit ${defaultCalliWordCount('petit')} · Moyen ${defaultCalliWordCount('moyen')} · Grand ${defaultCalliWordCount('grand')} (hauteur d’une bande 4 lignes).`}
                    </small>
                  </div>
                  {calliIsPhrases ? (
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
                  ) : null}
                  {!calliIsLibre && vocabSubgroups.length > 1 ? (
                    <SelectBox
                      label="Liste"
                      value={activeVocabSubgroup ?? ''}
                      onChange={(value) => {
                        const nextText = initialCalliText({
                          exerciseType: activeBlock.exerciseType,
                          topic: activeBlock.topic,
                          difficulty: activeBlock.difficulty,
                          calliSize: activeBlock.calliSize,
                          vocabSubgroup: value,
                          countHint: calliFields.length,
                        })
                        updatePage({ vocabSubgroup: value, calliText: nextText })
                      }}
                    >
                      {vocabSubgroups.map((group) => (
                        <option value={group.id} key={group.id}>
                          {group.label}
                        </option>
                      ))}
                    </SelectBox>
                  ) : null}
                  <div className="quad-libre-block">
                    <b>{calliIsPhrases ? 'Phrases' : 'Mots'}</b>
                    <ul
                      className="calli-fields"
                      aria-label={calliIsPhrases ? 'Phrases à recopier' : 'Mots ou phrases à recopier'}
                    >
                      {calliFields.map((value, index) => (
                        <li className="calli-field-row" key={`calli-field-${index}`}>
                          <span className="calli-field-num">{index + 1}.</span>
                          <input
                            className="pill-input"
                            type="text"
                            value={value}
                            spellCheck
                            aria-label={
                              calliIsPhrases
                                ? `Phrase ${index + 1}`
                                : `Mot ou phrase ${index + 1}`
                            }
                            placeholder={calliIsPhrases ? 'Phrase' : 'Mot ou phrase'}
                            onChange={(event) => setCalliFieldAt(index, event.target.value)}
                          />
                          <button
                            type="button"
                            className="calli-field-remove"
                            aria-label={`Supprimer la ligne ${index + 1}`}
                            onClick={() => removeCalliField(index)}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="game-extra-words">
                      <b>{calliIsPhrases ? 'Phrases supplémentaires' : 'Lignes supplémentaires'}</b>
                      <VocabAddWordRow
                        withImage={false}
                        placeholder={calliIsPhrases ? 'Nouvelle phrase' : 'Mot ou phrase'}
                        onAdd={addCalliExtraWord}
                      />
                      <small className="muted">
                        Hors liste · les ajouts dépassent le nombre par défaut.
                      </small>
                    </div>
                    <small className="muted">
                      {calliIsPhrases
                        ? calliIsLibre
                          ? 'Petit 6 · Moyen 5 · Grand 4 blocs · Générer tire dans tout le vocabulaire.'
                          : 'Petit 6 · Moyen 5 · Grand 4 blocs · Générer tire des phrases du thème (A1 / A2 / B1).'
                        : calliIsLibre
                          ? `Petit ${defaultCalliWordCount('petit')} · Moyen ${defaultCalliWordCount('moyen')} · Grand ${defaultCalliWordCount('grand')} · Générer tire des mots ; vous pouvez saisir une phrase.`
                          : `Petit ${defaultCalliWordCount('petit')} · Moyen ${defaultCalliWordCount('moyen')} · Grand ${defaultCalliWordCount('grand')} · Générer tire des mots du thème ; vous pouvez saisir une phrase.`}
                    </small>
                  </div>
                </>
              ) : null}
              {isJeuxDomain && jeuxTemplate ? (
                <GameContentPanel
                  typeId={activeBlock.exerciseType}
                  template={jeuxTemplate}
                  entries={activeBlock.gameEntries}
                  text={jeuxText}
                  gameSource={activeBlock.gameSource}
                  gameTopic={activeBlock.gameTopic}
                  gameSelectedIds={activeBlock.gameSelectedIds}
                  gameBackColor={activeBlock.gameBackColor}
                  gameSeriesName={activeBlock.gameSeriesName}
                  gameBorderId={activeBlock.gameBorderId}
                  gameBorderRectoId={
                    activeBlock.gameBorderRectoId !== undefined
                      ? activeBlock.gameBorderRectoId
                      : activeBlock.gameBorderId
                  }
                  gameBorderVersoId={
                    activeBlock.gameBorderVersoId !== undefined
                      ? activeBlock.gameBorderVersoId
                      : activeBlock.gameBorderId
                  }
                  gameFontSize={activeBlock.gameFontSize ?? DEFAULT_GAME_FONT_SIZE}
                  gameAlpha={activeBlock.gameAlpha}
                  onChange={(next) => updatePage(next)}
                />
              ) : null}
              {isReperage || isPhraseDomain || isJeuxDomain || isCalliDomain || isVocabLearn || isGramTheory || isSoutienFr ? null : (
              <>
              <div className={`niveau-row${activeBlock.numberLibre ? ' is-libre' : ''}`}>
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
              {isSoutienMots ? (
                <div className="mode-toggle-block">
                  <b>Contenu</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Source des mots">
                    <button
                      type="button"
                      className={!activeBlock.soutienMotsLibre ? 'active' : ''}
                      onClick={() =>
                        updatePage({ soutienMotsLibre: false, soutienMotsEntries: undefined })
                      }
                    >
                      Banque
                    </button>
                    <button
                      type="button"
                      className={activeBlock.soutienMotsLibre ? 'active' : ''}
                      onClick={() => {
                        const seeded =
                          activeBlock.soutienMotsEntries?.some((e) => e.label.trim())
                            ? activeBlock.soutienMotsEntries
                            : defaultSoutienMotsEntries(soutienType1Words)
                        updatePage({
                          soutienMotsLibre: true,
                          soutienMotsEntries: seeded,
                        })
                      }}
                    >
                      Libre
                    </button>
                  </div>
                  <small className="muted">
                    Libre : ajoutez des mots ou changez le mot et l’image.
                  </small>
                  {activeBlock.soutienMotsLibre ? (
                    <SoutienMotsLibreEditor
                      entries={
                        activeBlock.soutienMotsEntries?.length
                          ? activeBlock.soutienMotsEntries
                          : defaultSoutienMotsEntries(soutienType1Words)
                      }
                      onChange={(next) => updatePage({ soutienMotsEntries: next })}
                    />
                  ) : null}
                </div>
              ) : null}
              {isSoutienCompleter ? (
                <div className="mode-toggle-block">
                  <b>Contenu</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Source des mots à compléter">
                    <button
                      type="button"
                      className={!activeBlock.soutienCompleterLibre ? 'active' : ''}
                      onClick={() =>
                        updatePage({
                          soutienCompleterLibre: false,
                          soutienCompleterEntries: undefined,
                        })
                      }
                    >
                      Banque
                    </button>
                    <button
                      type="button"
                      className={activeBlock.soutienCompleterLibre ? 'active' : ''}
                      onClick={() => {
                        const seeded =
                          activeBlock.soutienCompleterEntries?.some((e) => e.word.trim())
                            ? activeBlock.soutienCompleterEntries
                            : defaultSoutienCompleterEntries(soutienBank?.completes ?? [])
                        updatePage({
                          soutienCompleterLibre: true,
                          soutienCompleterEntries: seeded.length
                            ? seeded
                            : defaultSoutienCompleterEntries(soutienBank?.completes ?? []),
                        })
                      }}
                    >
                      Libre
                    </button>
                  </div>
                  <small className="muted">
                    Libre : choisissez la partie à cacher, ou ajoutez mot + image.
                  </small>
                  {activeBlock.soutienCompleterLibre ? (
                    <SoutienCompleterLibreEditor
                      entries={
                        activeBlock.soutienCompleterEntries?.length
                          ? activeBlock.soutienCompleterEntries
                          : defaultSoutienCompleterEntries(soutienBank?.completes ?? [])
                      }
                      suggestedWords={soutienBank?.words ?? []}
                      onChange={(next) => updatePage({ soutienCompleterEntries: next })}
                    />
                  ) : null}
                </div>
              ) : null}
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
                  {vocabSubgroups.length > 1 ? (
                    <SelectBox
                      label="Liste"
                      value={activeVocabSubgroup ?? ''}
                      onChange={(value) => {
                        const nextSelected = defaultVocabSelected(
                          activeBlock.topic,
                          activeBlock.vocabRows ?? 3,
                          activeBlock.vocabCols ?? 3,
                          value,
                        )
                        updatePage({ vocabSubgroup: value, vocabSelected: nextSelected })
                      }}
                    >
                      {vocabSubgroups.map((group) => (
                        <option value={group.id} key={group.id}>
                          {group.label}
                        </option>
                      ))}
                    </SelectBox>
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
                              <span className="vocab-word-label">{word.label}</span>
                            </label>
                          )
                        })}
                      </div>
                      <VocabAddWordRow
                        onAdd={(entry) => {
                          const customs = [...vocabCustomWords, entry]
                          updatePage({
                            vocabCustomEntries: customs,
                            vocabSelected: [...vocabSelectedIds, entry.id],
                          })
                        }}
                      />
                    </div>
                  ) : (
                    <div className="quad-libre-block">
                      <p className="questions-overflow-hint" role="status">
                        Aucun mot dans cette liste. Ajoutez-en un ci-dessous.
                      </p>
                      <VocabAddWordRow
                        onAdd={(entry) => {
                          updatePage({
                            vocabCustomEntries: [...vocabCustomWords, entry],
                            vocabSelected: [...vocabSelectedIds, entry.id],
                          })
                        }}
                      />
                    </div>
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
              {isPhraseChart || isVocabLearn || isGramTheory || isJeuxDomain || isCalliDomain ? null : (
              <label className="select-shell">
                <span>
                  {isTransform
                    ? 'Points'
                    : isReperage
                      ? 'Questions'
                      : isSoutienLignes
                        ? 'Lignes'
                        : isSoutienMotsCount
                          ? 'Mots'
                          : 'QUESTIONS'}
                </span>
                <input
                  className={`pill-input${questionsInputOverflow ? ' is-overflow' : ''}`}
                  aria-label={
                    isSoutienLignes
                      ? 'Nombre de lignes'
                      : isSoutienMotsCount
                        ? 'Nombre de mots'
                        : 'Nombre de questions'
                  }
                  aria-invalid={questionsInputOverflow}
                  title={
                    isSoutienDetLocked
                      ? 'Aligné sur le nombre de mots du type 5 (même thème).'
                      : bankOverflow
                        ? `La banque de cet enregistrement ne contient que ${bankQuestionCap} questions.`
                        : questionsOverflow
                          ? 'Trop de questions pour une seule fiche A4. Réduisez le nombre ou ajoutez une page.'
                          : undefined
                  }
                  type="number"
                  min={soutienKind === 'syllabes' ? 2 : 1}
                  max={maxQuestions}
                  step={soutienKind === 'syllabes' ? 2 : 1}
                  value={
                    isSoutienDetLocked ? (soutienType5Count as number) : activeBlock.count
                  }
                  readOnly={isSoutienDetLocked}
                  onChange={(event) => {
                    if (isSoutienDetLocked) return
                    let next = Math.max(
                      soutienKind === 'syllabes' ? 2 : 1,
                      Math.min(maxQuestions, Number(event.target.value) || 1),
                    )
                    // Type 3 : toujours un nombre pair de lignes (les deux blocs).
                    if (soutienKind === 'syllabes' && next % 2 !== 0) {
                      next = Math.min(maxQuestions, next + 1)
                    }
                    updatePage({ count: next })
                  }}
                />
                {soutienKind === 'lettres' ? (
                  <small className="muted">
                    Nombre de lignes du tableau (10 lettres par ligne, max. 15).
                  </small>
                ) : null}
                {soutienKind === 'syllabes' ? (
                  <small className="muted">
                    Lignes paires pour les deux tableaux (5 syllabes par ligne · moitié CV, moitié
                    doubles).
                  </small>
                ) : null}
                {isSoutienRelier ? (
                  <small className="muted">Jusqu’à 16 mots (selon la banque du son).</small>
                ) : null}
                {isSoutienCompleter && !activeBlock.soutienCompleterLibre ? (
                  <small className="muted">Nombre de mots à compléter (max. 16).</small>
                ) : null}
                {soutienKind === 'ecouter' ? (
                  <small className="muted">Mots à écouter / écrire (max. 18).</small>
                ) : null}
                {soutienKind === 'ecouter-image' ? (
                  <small className="muted">Images à écouter / cocher (max. 20).</small>
                ) : null}
                {soutienKind === 'syllabe-son' ? (
                  <small className="muted">Nombre de cartes (max. 18).</small>
                ) : null}
                {soutienKind === 'lettres-phrase' ? (
                  <small className="muted">
                    Nombre de phrases (max. 16 · lettres remélangées à chaque tirage).
                  </small>
                ) : null}
                {soutienKind === 'determinants' ? (
                  <small className="muted">
                    {isSoutienDetLocked
                      ? 'Nombre de phrases aligné sur les mots du type 5 (même thème).'
                      : 'Nombre de phrases (max. 16 · ajoutez un type 5 pour l’aligner).'}
                  </small>
                ) : null}
                {soutienKind === 'dictee' ? (
                  <small className="muted">Nombre de mots à écrire (max. 16).</small>
                ) : null}
                {soutienKind === 'compter' ? (
                  <small className="muted">Nombre de phrases à compter (max. 12).</small>
                ) : null}
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
              {isSoutienRelier ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Nombre de colonnes">
                    {[1, 2].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={(activeBlock.columns ?? 1) === value ? 'active' : ''}
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <small className="muted">
                    En 2 colonnes, chaque colonne mélange ses propres mots (sans mélange croisé).
                  </small>
                </div>
              ) : null}
              {isSoutienCols123 ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-3" role="group" aria-label="Nombre de colonnes">
                    {[1, 2, 3].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          (activeBlock.columns ?? (soutienKind === 'completer' ? 2 : 3)) ===
                          value
                            ? 'active'
                            : ''
                        }
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <small className="muted">Grille fluide : 1, 2 ou 3 colonnes.</small>
                </div>
              ) : null}
              {isSoutienCols345 ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-3" role="group" aria-label="Nombre de colonnes">
                    {[3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={(activeBlock.columns ?? 3) === value ? 'active' : ''}
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <small className="muted">
                    Grille fluide (pas un tableau fixe) : 3, 4 ou 5 colonnes.
                  </small>
                </div>
              ) : null}
              {isPhraseChart || isVocabLearn || isVocabPool || isGramTheory || isJeuxDomain || isCalliDomain || isSoutienFr ? null : (
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
              ) : isDroites || isConstruire || isTransform ? (
                <div className="coord-libre-panel">
                  <b>
                    {isDroites
                      ? 'Repère (droites)'
                      : isTransform
                        ? 'Repère (transformations)'
                        : 'Repère (construction)'}
                  </b>
                  {isTransform || isDroites || isConstruire ? (
                    <div
                      className="mode-toggle"
                      role="group"
                      aria-label={
                        isTransform
                          ? 'Mode de la figure'
                          : 'Mode des questions'
                      }
                    >
                      <button
                        type="button"
                        className={!activeBlock.coordLibre ? 'active' : ''}
                        onClick={() =>
                          updatePage({
                            coordLibre: false,
                            coordMarks: isTransform ? [] : activeBlock.coordMarks,
                            coordQuestionsLibre: undefined,
                          })
                        }
                      >
                        Automatique
                      </button>
                      <button
                        type="button"
                        className={activeBlock.coordLibre ? 'active' : ''}
                        onClick={() => {
                          if (isTransform) {
                            const sceneMarks =
                              activeSheet?.blocks[safeBlockIndex]?.items[0]?.coordScene?.marks ?? []
                            const fromScene = sceneMarks
                              .filter(
                                (mark) =>
                                  mark.kind === 'point' &&
                                  mark.label &&
                                  !String(mark.label).endsWith('′'),
                              )
                              .map((mark) => ({
                                x: mark.x,
                                y: mark.y,
                                kind: 'point' as const,
                                label: mark.label,
                                given: mark.label === 'Ω' ? true : undefined,
                                showCoord: mark.label === 'Ω' ? true : undefined,
                              }))
                            const seed =
                              activeBlock.coordMarks?.length ? activeBlock.coordMarks : fromScene
                            const hasOmega = seed.some((mark) => mark.label === 'Ω')
                            updatePage({
                              coordLibre: true,
                              coordMarks:
                                isTransformCentrale && !hasOmega
                                  ? [
                                      ...seed,
                                      {
                                        x: 0,
                                        y: 0,
                                        kind: 'point',
                                        label: 'Ω',
                                        given: true,
                                        showCoord: true,
                                      },
                                    ]
                                  : seed,
                              count: Math.max(
                                3,
                                Math.min(
                                  TRANSFORM_MAX_POINTS,
                                  seed.filter((mark) => mark.label !== 'Ω').length ||
                                    activeBlock.count,
                                ),
                              ),
                            })
                            setCoordTool(isTransformCentrale ? 'points' : 'points')
                            return
                          }
                          const fromSheet =
                            activeSheet?.blocks[safeBlockIndex]?.items[0]?.coordQuestions
                          updatePage({
                            coordLibre: true,
                            coordQuestionsLibre: resizeCoordQuestionsLibre(
                              activeBlock.coordQuestionsLibre?.length
                                ? activeBlock.coordQuestionsLibre
                                : fromSheet,
                              activeBlock.count,
                              defaultCoordQuestionReply(activeBlock.exerciseType),
                            ),
                          })
                        }}
                      >
                        Libre
                      </button>
                    </div>
                  ) : null}
                  <ReperageAxesFields
                    cols={activeBlock.coordCols ?? axesGrid.cols}
                    rows={activeBlock.coordRows ?? axesGrid.rows}
                    cellMm={axesGrid.cellMm}
                    unitSquares={axesGrid.unitSquares}
                    onChange={updateAxesGrid}
                    onLiveCols={(n) => updatePage({ coordCols: n })}
                    onLiveRows={(n) => updatePage({ coordRows: n })}
                  />
                  {isTransform && activeBlock.coordLibre ? (
                    <>
                      {isTransformCentrale ? (
                        <div className="mode-toggle" role="group" aria-label="Outil de placement">
                          <button
                            type="button"
                            className={coordTool === 'points' ? 'active' : ''}
                            onClick={() => setCoordTool('points')}
                          >
                            Points
                          </button>
                          <button
                            type="button"
                            className={coordTool === 'center' ? 'active' : ''}
                            onClick={() => setCoordTool('center')}
                          >
                            Centre Ω
                          </button>
                        </div>
                      ) : null}
                      <p className="type-hint muted">
                        {isTransformCentrale
                          ? 'Cliquez sur l’aperçu pour placer les sommets (A, B, C…) ou le centre Ω. Cliquez un point pour le retirer. Jusqu’à 10 points.'
                          : 'Cliquez sur l’aperçu pour placer les sommets de la figure (A, B, C…). Cliquez un point pour le retirer. Jusqu’à 10 points.'}
                      </p>
                      <p className="type-hint muted">
                        {(activeBlock.coordMarks ?? []).filter((mark) => mark.label !== 'Ω').length} /{' '}
                        {Math.min(activeBlock.count, TRANSFORM_MAX_POINTS)} point
                        {activeBlock.count > 1 ? 's' : ''}
                        {isTransformCentrale
                          ? (activeBlock.coordMarks ?? []).some((mark) => mark.label === 'Ω')
                            ? ' · centre Ω placé'
                            : ' · centre Ω manquant'
                          : ''}
                      </p>
                      {(activeBlock.coordMarks?.length ?? 0) > 0 ? (
                        <button
                          type="button"
                          className="button secondary"
                          onClick={() =>
                            updatePage({
                              coordMarks: isTransformCentrale
                                ? [
                                    {
                                      x: 0,
                                      y: 0,
                                      kind: 'point',
                                      label: 'Ω',
                                      given: true,
                                      showCoord: true,
                                    },
                                  ]
                                : [],
                            })
                          }
                        >
                          Vider les points
                        </button>
                      ) : null}
                    </>
                  ) : null}
                  {(isDroites || isConstruire) && activeBlock.coordLibre ? (
                    <CoordQuestionsLibreEditor
                      questions={
                        activeBlock.coordQuestionsLibre ??
                        resizeCoordQuestionsLibre(
                          undefined,
                          activeBlock.count,
                          defaultCoordQuestionReply(activeBlock.exerciseType),
                        )
                      }
                      defaultReply={defaultCoordQuestionReply(activeBlock.exerciseType)}
                      maxCount={isConstruire ? 8 : 10}
                      onChange={(next) => {
                        const capped = next.slice(0, isConstruire ? 8 : 10)
                        updatePage({
                          coordQuestionsLibre: capped,
                          count: Math.max(1, capped.length),
                        })
                      }}
                    />
                  ) : null}
                  <p className="type-hint muted">
                    {isDroites
                      ? activeBlock.coordLibre
                        ? 'Mode libre : le repère (droites) reste généré ; vous rédigez ou modifiez les questions et les réponses du corrigé.'
                        : 'Une seule grille centrée. Colonnes et lignes (nombres pairs) font grandir le tableau ; les carrés restent à 3, 4 ou 5 mm (56, 42 ou 34 colonnes au plus). Chaque droite a une couleur et un tracé distinct, lisible en noir et blanc.'
                      : isTransform
                        ? activeBlock.coordLibre
                          ? isTransformPlacer
                            ? 'Mode libre : placez jusqu’à 10 sommets. Sur la fiche : colonne 1 = points à placer, colonne 2 = coordonnées des images. Pas de bloc questions.'
                            : 'Mode libre : placez les sommets de la figure (et Ω en symétrie centrale). Pas de bloc questions : la consigne suffit.'
                          : isTransformPlacer
                            ? 'Types 3 et 4 : un point est donné sur le repère. Colonne 1 = points à placer, colonne 2 = coordonnées des nouveaux points. Jusqu’à 10 sommets.'
                            : 'Types 1 et 2 : figure fermée déjà tracée. Construisez l’image (pas de liste de questions).'
                        : activeBlock.coordLibre
                          ? 'Mode libre : la figure du repère reste générée ; vous rédigez ou modifiez les questions et les réponses du corrigé.'
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
                    Titre de la fiche
                    <input
                      className="pill-input"
                      value={institutional.documentTitle}
                      onChange={(event) =>
                        setInstitutional({ ...institutional, documentTitle: event.target.value })
                      }
                      placeholder={
                        evalMode
                          ? 'Évaluation'
                          : (exerciseTypeById[activeBlock.exerciseType]?.label ?? 'Nom du type d’exercice')
                      }
                    />
                    <small className="muted">Vide = nom du type d’exercice partout sur la fiche.</small>
                  </label>
                  <label>
                    Référence
                    <input
                      className="pill-input"
                      value={institutional.reference}
                      onChange={(event) =>
                        setInstitutional({ ...institutional, reference: event.target.value })
                      }
                      placeholder="Ex. FICHE-12"
                    />
                    <small className="muted">Pied de page, à gauche. Vide = rien.</small>
                  </label>
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
                {isCalliDomain || isJeuxDomain ? null : (
                  <div className="mode-toggle preview-mode-toggle" role="tablist" aria-label="Mode d’aperçu">
                    <button type="button" className={mode === 'student' ? 'active' : ''} onClick={() => setMode('student')}>
                      Fiche élève
                    </button>
                    <button type="button" className={mode === 'answers' ? 'active' : ''} onClick={() => setMode('answers')}>
                      Corrigé
                    </button>
                  </div>
                )}
                <button className="print-chip is-generate" type="button" onClick={generate}>
                  Générer
                </button>
                <button
                  className="print-chip is-generate"
                  type="button"
                  onClick={printAll}
                  aria-label={isCalliDomain || isJeuxDomain ? 'Imprimer la fiche' : 'Imprimer la fiche et le corrigé'}
                >
                  Imprimer
                </button>
              </div>
            </div>
            <div className="sheet-preview-wrap no-print-nav">
              <div className="sheet-preview-cluster">
                <div className={`sheet-preview-row${jeuxPreviewSheets && jeuxPreviewSheets.length > 1 ? ' is-jeux-duplex' : ''}`}>
                  {jeuxPreviewSheets && jeuxPreviewSheets.length > 1 ? (
                    <div className="sheet-stage is-jeux-stack">
                      {jeuxPreviewSheets.map(({ sheet, index }, stackIdx) => (
                        <div
                          className="a4-frame"
                          key={`jeux-prev-${sheet.exerciseType}-${seed}-${index}`}
                          ref={stackIdx === 0 ? previewFrameRef : undefined}
                        >
                          <WorksheetSheet
                            page={sheet}
                            pageNumber={index + 1}
                            sheetIndex={index + 1}
                            total={worksheets.length}
                            {...sheetProps}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
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
                        }
                        {...sheetProps}
                      />
                    </div>
                  </div>
                  )}
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
            {/* Impression : fiches élèves ; corrigés seulement s’il y en a */}
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
              {isCalliDomain || isJeuxDomain
                ? null
                : worksheets.map((page, index) => (
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

import {PhraseSvcBlock} from './item-view/phrase-svc'
import type { CoordShape, MathItem, PreviewMode } from '@/math/types'
import type { GlossaryFigureId } from '@/math/glossary-banks'
import type { TcfTypeReponse } from '@/tcf/types'
import { TcfFormMarginIcons } from '@/components/tcf/TcfFormIcons'
import { CardGrid } from '@/jeux/CardGrid'
import type { GameBoard } from '@/jeux/types'
import { CalligraphyView } from './math/CalligraphyView'
import { GattegnoChart } from './math/GattegnoChart'
import { GlossaryFigure } from './math/GlossaryFigure'
import { LogiqueBlock } from './item-view/logique'
import { ExerciseFrame } from './math/ExerciseFrame'
import { TcfItemView } from './tcf/TcfItemView'
import { GrammarQuestionView } from './item-view/grammar'
import { isGrammarQuestion } from '@/grammaire/curriculum/validation'
import { AlgebraRow } from './item-view/algebra'
import { ColumnOp, DivisionColumn } from './item-view/columns'
import { DecomposeBlock } from './item-view/decompose'
import { CscTaskBlock, CscProblemBlock } from './item-view/tcm-csc'
import { OpTableBlock } from './item-view/op-table'
import { CompareRow, EncadrementRow, OrderRow, SequenceRow } from './item-view/compare'
import { CoordBlock, GeoBlock } from './item-view/geo-coord'
import {
  AudioDictationBlock,
  MetroMapBlock,
  SegmentMeasureBlock,
  SymmetryGridBlock,
} from './item-view/tcm-cfr'
import {
  ConvertRow,
  FractionShapeBlock,
  InlinePrompt,
  PlaceValueRow,
  ProblemBlock,
  SelectPillsRow,
  StackedPrompt,
  TheoryBlockView,
  EquationBlock,
} from './item-view/problems'
import {
  PhraseBuildBlock,
  PhraseColorBlock,
  PhraseOrderBlock,
  PhraseWriteBlock,
} from './item-view/phrase'
import {PhraseImagesBlock} from './item-view/phrase-images'
import {
  AudioOrderBlock,
  MarkLetterBlock,
  SyllablePronounceBlock,
  CountIconsBlock,
  CountSoundBlock,
  DeterminantFillBlock,
  DicteeGridBlock,
  ListenCheckBlock,
  PhraseScrambleBlock,
  ReadPhrasesBlock,
  SyllableCompleteBlock,
  SyllableSoundBlock,
} from './item-view/soutien'
import {
  AudioMatchBlock,
  LetterGridRow,
  SyllableTableBlock,
  VocabMatch,
  VocabTable,
  VocabWrite,
  WordSearchBlock,
} from './item-view/vocab'

export type { AlgebraFracToken, AlgebraTokenPart } from './item-view/algebra'
export { AlgebraRow, tokenizeAlgebra } from './item-view/algebra'

export function ItemView({
  item,
  mode,
  index,
  itemLabel,
  seriesNumber,
  hideNumber: hideNumberOverride = false,
  algebraPadLeft = 0,
  draftGrid = true,
  onToggleDraftGrid,
  oralAnswerMode,
  onCycleOralAnswerMode,
  tcfFormMode,
  tcfFormModes,
  onSelectTcfForm,
  onSelectTcfFormAt,
  tcfPageBreakBefore,
  onToggleTcfPageBreak,
  theoryPageBreakAfter,
  onToggleTheoryPageBreakAfter,
  hideTcfFormIcons = false,
  formulaireLetterGrid = false,
  onToggleFormulaireLetterGrid,
  hideMotsBanque = false,
  coordEdit,
}: {
  item: MathItem
  mode: PreviewMode
  index: number
  itemLabel?: string
  /** Bandeau de série pour le rangement et la logique du TCM CSC. */
  seriesNumber?: number
  hideNumber?: boolean
  /** Cases vides à gauche pour aligner verticalement les atomes entre questions. */
  algebraPadLeft?: number
  /** Zone de brouillon avec grille 4×4 mm (problèmes). */
  draftGrid?: boolean
  onToggleDraftGrid?: () => void
  oralAnswerMode?: 'qcm' | 'text' | 'images'
  onCycleOralAnswerMode?: () => void
  /** TCF : forme active Texte / Image / Phrase. */
  tcfFormMode?: TcfTypeReponse
  /** Modes par index global (cadres multi-questions). */
  tcfFormModes?: Array<TcfTypeReponse | undefined>
  onSelectTcfForm?: (form: TcfTypeReponse) => void
  /** TCF : sélection de forme par index global (ex. questions dans un cadre Audio). */
  onSelectTcfFormAt?: (modeIndex: number, form: TcfTypeReponse) => void
  /** TCF : cette question (et les suivantes) commence une nouvelle page. */
  tcfPageBreakBefore?: boolean
  onToggleTcfPageBreak?: () => void
  /** Théorie : la section suivante commence sur une nouvelle page. */
  theoryPageBreakAfter?: boolean
  onToggleTheoryPageBreakAfter?: () => void
  /** Masquer les icônes de forme en marge (ex. dual form sur le titre). */
  hideTcfFormIcons?: boolean
  formulaireLetterGrid?: boolean
  onToggleFormulaireLetterGrid?: () => void
  hideMotsBanque?: boolean
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
    onRemove: (x: number, y: number) => void
  }
}) {
  const isProblem = item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)
  const isEquation = item.layout === 'equation'
  const isGeoCalc = item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)
  const isAlgebraDraft = item.layout === 'algebra'
  /** Inline (ex. substitution) : brouillon seulement si le chip grille est branché. */
  const isInlineDraft = item.layout === 'inline' && Boolean(onToggleDraftGrid)
  const isDraftPad = isProblem || isEquation || isGeoCalc || isAlgebraDraft || isInlineDraft
  const isStackedText = item.layout === 'text' && !isProblem
  const isOralSelect = item.layout === 'select' && item.selectVariant === 'oral'
  const resolvedOralMode = oralAnswerMode ?? item.answerMode ?? 'qcm'
  const oralItem = isOralSelect ? { ...item, answerMode: resolvedOralMode } : item
  const oralModeLabel =
    resolvedOralMode === 'text' ? 'Texte' : resolvedOralMode === 'images' ? 'Images' : 'QCM'
  const tcfFormSelect =
    item.layout === 'tcf' && (item.tcf?.kind === 'qcm' || item.tcf?.kind === 'lignes')
      ? item.tcf.formSelect
      : undefined
  const tcfActiveForm = tcfFormMode ?? tcfFormSelect?.active
  /** Comme Page : en marge sauf si le sélecteur est sur le titre d’exercice. */
  const showTcfFormIcons = Boolean(
    !hideTcfFormIcons && tcfFormSelect && onSelectTcfForm && tcfActiveForm,
  )
  const isFormulaire =
    item.layout === 'tcf' && item.tcf?.kind === 'formulaire'
  /** Support / production : pleine largeur ; QCM / lignes suivent les colonnes. */
  const tcfFullWidth =
    item.layout === 'tcf' &&
    item.tcf != null &&
    item.tcf.kind !== 'qcm' &&
    item.tcf.kind !== 'lignes'
  const showTcfPageChip = Boolean(
    onToggleTcfPageBreak &&
      item.layout === 'tcf' &&
      (item.tcf?.kind === 'qcm' ||
        item.tcf?.kind === 'lignes' ||
        item.tcf?.kind === 'audio_cadre' ||
        item.tcf?.kind === 'ce_association_answers' ||
        item.tcf?.kind === 'dialogue'),
  )
  const grammarPart=item.grammar?.readingPart??item.grammar?.scenarioPart
  const showTheoryPageChip = Boolean(
    onToggleTheoryPageBreakAfter && (item.layout === 'theory' && item.theoryBlock?.kind === 'section' || item.layout==='grammar'&&grammarPart?.kind==='question'),
  )
  const pageBreakChipLabel = showTheoryPageChip
    ? item.layout==='grammar' ? theoryPageBreakAfter?'Annuler le saut de page après cette question':'Ajouter un saut de page après cette question' : theoryPageBreakAfter
      ? 'Annuler le saut de page après cette section'
      : 'Passer la section suivante sur une nouvelle page'
    : tcfPageBreakBefore
      ? 'Remettre cette question et les suivantes sur la page précédente'
      : 'Passer cette question et les suivantes sur une nouvelle page'
  const hideNumber =
    hideNumberOverride ||
    Boolean(item.hideItemNumber) ||
    item.cscTask?.kind === 'large-count' ||
    item.layout === 'gattegno-chart' ||
    item.layout === 'phrase-write' ||
    item.layout === 'vocab-table' ||
    item.layout === 'vocab-match' ||
    item.layout === 'letter-grid' ||
    item.layout === 'syllable-complete' ||
    item.layout === 'syllable-table' ||
    item.layout === 'listen-check' ||
    item.layout === 'syllable-sound' ||
    item.layout === 'syllable-pronounce' ||
    item.layout === 'mark-letter' ||
    item.layout === 'phrase-scramble' ||
    item.layout === 'determinant-fill' ||
    item.layout === 'dictee-grid' ||
    item.layout === 'count-sound' ||
    item.layout === 'read-phrases' ||
    item.layout === 'audio-match' ||
    item.layout === 'audio-order' ||
    item.layout === 'word-search' ||
    item.layout === 'theory' ||
    item.layout === 'glossary' ||
    item.layout === 'card-grid' ||
    item.layout === 'calligraphy' ||
    item.layout === 'tcf' ||
    item.layout === 'metro-map' ||
    item.layout === 'symmetry-grid' ||
    item.layout === 'segment-measure' ||
    item.layout === 'audio-dictation'
    || item.layout === 'csc-task' && item.cscTask?.kind !== 'operator'
  return (
    <div
      className={`exercise-item layout-${item.layout}${isDraftPad ? ' is-problem' : ''}${
        isOralSelect ? ' is-oral' : ''
      }${tcfFullWidth ? ' is-tcf-full' : ''}`}
    >
      {isDraftPad && onToggleDraftGrid ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin ${draftGrid ? 'on' : 'off'}`}
          onClick={onToggleDraftGrid}
          aria-pressed={draftGrid}
        >
          {draftGrid ? 'Grille' : 'Sans'}
        </button>
      ) : null}
      {isFormulaire && onToggleFormulaireLetterGrid ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin ${
            formulaireLetterGrid ? 'on' : 'off'
          }`}
          onClick={onToggleFormulaireLetterGrid}
          aria-pressed={formulaireLetterGrid}
          title={
            formulaireLetterGrid
              ? 'Cases lettre / chiffre (une par case)'
              : 'Lignes de réponse classiques'
          }
        >
          Grille
        </button>
      ) : null}
      {isOralSelect && onCycleOralAnswerMode ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin oral-mode-chip ${
            resolvedOralMode === 'qcm' ? 'on' : 'off'
          }`}
          onClick={onCycleOralAnswerMode}
          aria-label={`Mode de réponse : ${oralModeLabel}. Cliquer pour changer.`}
          title={
            item.imagesAvailable
              ? 'QCM → texte libre → images'
              : 'QCM → texte libre (images indisponibles pour cette question)'
          }
        >
          {oralModeLabel}
        </button>
      ) : null}
      {showTcfFormIcons && tcfFormSelect && tcfActiveForm && onSelectTcfForm ? (
        <TcfFormMarginIcons
          filled={tcfFormSelect.filled}
          active={tcfActiveForm}
          onSelect={onSelectTcfForm}
        />
      ) : null}
      {showTcfPageChip || showTheoryPageChip ? (
        <button
          type="button"
          className={`no-print draft-grid-chip draft-grid-chip-margin tcf-page-chip ${
            (showTheoryPageChip ? theoryPageBreakAfter : tcfPageBreakBefore) ? 'on' : 'off'
          }`}
          aria-pressed={Boolean(showTheoryPageChip ? theoryPageBreakAfter : tcfPageBreakBefore)}
          aria-label={pageBreakChipLabel}
          title={pageBreakChipLabel}
          onClick={showTheoryPageChip ? onToggleTheoryPageBreakAfter : onToggleTcfPageBreak}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden>
            <path
              d="M4 2.5h5.2L12 5.3V13.5H4Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9.2 2.5V5.3H12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M6 8.2h4M6 10.8h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
      {item.coordScene || (hideNumber && itemLabel===undefined) || seriesNumber!==undefined ? null : <div className="item-number">{itemLabel ?? (grammarPart?.kind==='question'?grammarPart.number:index + 1)}.</div>}
      <div className="item-content">
        {item.layout==='grammar' ? isGrammarQuestion(item.grammar) ? <GrammarQuestionView question={item.grammar} mode={mode}/> : <p>Question grammaticale à vérifier.</p> : null}
        {(item.layout === 'column' || item.layout === 'column-empty') && <ColumnOp item={item} mode={mode} />}
        {item.layout === 'division-column' && <DivisionColumn item={item} mode={mode} />}
        {item.layout === 'op-table' && <OpTableBlock item={item} mode={mode} />}
        {item.layout === 'decompose' && <DecomposeBlock item={item} mode={mode} />}
        {item.layout === 'csc-task' && <CscTaskBlock item={item} mode={mode} />}
        {item.layout === 'compare' && <CompareRow item={item} mode={mode} />}
        {item.layout === 'encadrement' && <EncadrementRow item={item} mode={mode} />}
        {item.layout === 'select' && <SelectPillsRow item={oralItem} mode={mode} />}
        {item.layout === 'theory' && <TheoryBlockView item={item} />}
        {item.layout === 'glossary' && item.glossary ? (
          <div className="glossary-card">
            <div className="glossary-figure-wrap">
              <GlossaryFigure id={item.glossary.figure as GlossaryFigureId} />
            </div>
            <div className="glossary-text">
              <p className="glossary-term">{item.glossary.term}</p>
              <p className="glossary-definition">{item.glossary.definition}</p>
            </div>
          </div>
        ) : null}
        {item.layout === 'letter-grid' && <LetterGridRow item={item} mode={mode} />}
        {item.layout === 'syllable-table' && <SyllableTableBlock item={item} />}
        {item.layout === 'order' && <OrderRow item={item} mode={mode} series={seriesNumber} />}
        {item.layout === 'sequence' && <SequenceRow item={item} mode={mode} />}
        {item.layout === 'fraction-shape' && <FractionShapeBlock item={item} mode={mode} />}
        {item.layout === 'geo' && <GeoBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.layout === 'coord' && <CoordBlock item={item} mode={mode} coordEdit={coordEdit} />}
        {item.layout === 'algebra' && item.cscTask?.kind === 'problem' && <CscProblemBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.layout === 'algebra' && item.cscTask?.kind !== 'problem' && (
          <AlgebraRow item={item} mode={mode} padLeft={algebraPadLeft} draftGrid={draftGrid} />
        )}
        {item.layout === 'equation' && <EquationBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.layout === 'place-value' && <PlaceValueRow item={item} mode={mode} />}
        {item.layout === 'phrase-svc' && <PhraseSvcBlock item={item} mode={mode} />}
        {item.layout === 'phrase-color' && <PhraseColorBlock item={item} mode={mode} />}
        {item.layout === 'phrase-order' && <PhraseOrderBlock item={item} mode={mode} />}
        {item.layout === 'phrase-build' && <PhraseBuildBlock item={item} mode={mode} />}
        {item.layout === 'phrase-write' && <PhraseWriteBlock item={item} mode={mode} />}
        {item.layout === 'phrase-images' && <PhraseImagesBlock item={item} mode={mode} />}
        {item.layout === 'gattegno-chart' && <GattegnoChart mode={item.chartMode ?? 'labels'} />}
        {item.layout === 'vocab-table' && <VocabTable item={item} />}
        {item.layout === 'vocab-match' && <VocabMatch item={item} mode={mode} />}
        {item.layout === 'vocab-write' && <VocabWrite item={item} mode={mode} />}
        {item.layout === 'syllable-complete' && (
          <SyllableCompleteBlock item={item} mode={mode} />
        )}
        {item.layout === 'listen-check' && <ListenCheckBlock item={item} mode={mode} />}
        {item.layout === 'syllable-sound' && (
          <SyllableSoundBlock item={item} mode={mode} />
        )}
        {item.layout === 'mark-letter' && <MarkLetterBlock item={item} mode={mode} />}
        {item.layout === 'syllable-pronounce' && (
          <SyllablePronounceBlock item={item} />
        )}
        {item.layout === 'phrase-scramble' && (
          <PhraseScrambleBlock item={item} mode={mode} />
        )}
        {item.layout === 'determinant-fill' && (
          <DeterminantFillBlock item={item} mode={mode} />
        )}
        {item.layout === 'dictee-grid' && (
          <DicteeGridBlock item={item} mode={mode} />
        )}
        {item.layout === 'count-sound' && (
          <CountSoundBlock item={item} mode={mode} />
        )}
        {item.layout === 'read-phrases' && <ReadPhrasesBlock item={item} />}
        {item.layout === 'audio-match' && (
          <AudioMatchBlock item={item} mode={mode} />
        )}
        {item.layout === 'audio-order' && (
          <AudioOrderBlock item={item} mode={mode} />
        )}
        {item.layout === 'word-search' && (
          <WordSearchBlock item={item} mode={mode} />
        )}
        {item.layout === 'card-grid' && item.gameBoard ? (
          <CardGrid board={item.gameBoard as GameBoard} />
        ) : null}
        {item.layout === 'calligraphy' && item.calligraphy ? (
          <CalligraphyView item={item} />
        ) : null}
        {item.layout === 'count-icons' && <CountIconsBlock item={item} mode={mode} />}
        {item.layout === 'tcf' && (
          <TcfItemView
            item={item}
            mode={mode}
            tcfFormMode={tcfActiveForm}
            tcfFormModes={tcfFormModes}
            onSelectTcfFormAt={onSelectTcfFormAt}
            formulaireLetterGrid={formulaireLetterGrid}
            hideMotsBanque={hideMotsBanque}
          />
        )}
        {item.layout === 'logique' && (seriesNumber===undefined ? <LogiqueBlock item={item} mode={mode} /> : <ExerciseFrame title={`Série ${seriesNumber}`} className="csc-logic-series"><LogiqueBlock item={item} mode={mode}/></ExerciseFrame>)}
        {item.layout === 'audio-dictation' && <AudioDictationBlock item={item} mode={mode} />}
        {item.layout === 'symmetry-grid' && <SymmetryGridBlock item={item} mode={mode} />}
        {item.layout === 'segment-measure' && <SegmentMeasureBlock item={item} mode={mode} />}
        {item.layout === 'metro-map' && <MetroMapBlock item={item} mode={mode} />}
        {isProblem && <ProblemBlock item={item} mode={mode} draftGrid={draftGrid} />}
        {item.audioSrc && item.layout !== 'audio-dictation' ? (
          <audio className="oral-audio" controls preload="none" src={item.audioSrc}>
            Écoutez l’enregistrement.
          </audio>
        ) : null}
        {isStackedText && !item.convert && <StackedPrompt item={item} mode={mode} />}
        {!isProblem &&
          !isStackedText &&
          item.layout === 'inline' &&
          (item.convert ? <ConvertRow item={item} mode={mode} /> : <InlinePrompt item={item} mode={mode} />)}
        {isInlineDraft ? (
          <div
            className={`draft-pad draft-pad-short ${draftGrid ? 'with-grid' : 'plain'}`}
            aria-label="Zone de brouillon"
          />
        ) : null}
      </div>
    </div>
  )
}

import { type CSSProperties } from 'react'
import { renderSheetCopy } from '@/components/sheet-copy'
import { ItemView, tokenizeAlgebra } from '@/components/ItemView'
import {
  ALPHA_SOUTIEN_REFERENCE,
  DocumentFooter,
  InstitutionalDocumentHeader,
  isAlphaSoutienDomain,
  SheetBody,
  type InstitutionalHeader,
} from '@/components/math/PrintDocumentChrome'
import { DecomposeExample } from '@/components/item-view/decompose'
import { isDraftPadExercise } from '@/math/catalog'
import { blockPointsTotal, formatPointsLabel, sumPointWeights } from '@/tpm/test'
import { isReperageConstruire } from '@/math/coord-reperage'
import type {
  CoordReply,
  CoordShape,
  PreviewMode,
  WorksheetBlock,
  WorksheetPage,
} from '@/math/types'
import type { TcfTypeReponse } from '@/tcf/types'
import { collectCorrigeAudioSrcs } from '@/tcf/download-audios'
import { hasMathAudioPrompts } from '@/math/audio-prompts'
import { MathExerciseAudio } from '@/components/math/MathExerciseAudio'
import { TcfFormMarginIcons } from '@/components/tcf/TcfFormIcons'
import {
  isGramDualFormExercise,
  isGramMarginFormExercise,
} from '@/grammaire/exercises/qui-suis-je-ui'
import { parseGramExerciseType } from '@/grammaire/exercises/subthemes'
import { clampInlineBlankPx } from '@/tcf/inline-blank'
import { tcfPeSlotDefaults } from '@/tcf/pe-defaults'

/** Audios du corrigé : figés sur le bloc, sinon recalculés depuis les items. */
function blockCorrigeAudios(block: WorksheetBlock): string[] {
  if (block.corrigeAudios?.length) return block.corrigeAudios
  return collectCorrigeAudioSrcs(block.items, block.document?.audioSrc)
}

/** CO à bandeaux Audio N : le lecteur du corrigé est dans le bandeau, pas à côté du titre. */
function coAudioInBanner(block: WorksheetBlock): boolean {
  return block.items.some((item) => {
    const tcf = item.tcf
    if (!tcf) return false
    if (tcf.kind === 'audio_cadre') return true
    if (tcf.kind === 'association' && tcf.situations.some((situation) => situation.audioSrc)) return true
    if ((tcf.kind === 'qcm' || tcf.kind === 'lignes') && tcf.audioFrame) return true
    if (tcf.kind === 'support' && tcf.exercise.competence === 'CO') {
      const type = tcf.exercise.type_exercice
      return type === 'six_courts' || type === 'trois_moyens' || type === 'complet'
    }
    return false
  })
}

export function defaultCoordQuestionReply(exerciseType: string): CoordReply {
  return isReperageConstruire(exerciseType) ? 'draw' : 'text'
}

export function fallbackBlocks(page: WorksheetPage): WorksheetBlock[] {
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
      formulaireLetterGrid: page.formulaireLetterGrid,
      inlineBlankPx: page.inlineBlankPx,
      oralAnswerModes: page.oralAnswerModes,
    },
  ]
}

export function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M13.5 2.5a.75.75 0 0 0-1.5 0v1.2A5.5 5.5 0 1 0 13.4 10a.75.75 0 1 0-1.3-.75 4 4 0 1 1-1.05-3.7H9.25a.75.75 0 0 0 0 1.5h3.5A.75.75 0 0 0 13.5 6V2.5Z"
      />
    </svg>
  )
}

export type WorksheetSheetProps = {
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
  /** Affiche les icônes de formats disponibles sur les questions TCF. */
  interactiveTcfOptions?: boolean
  /** Affiche le contrôle de saut de page réservé aux fiches TCF. */
  interactiveTcfPageBreaks?: boolean
  onSelectTcfForm?: (index: number, form: TcfTypeReponse, blockIndex?: number) => void
  /** Qui suis-je Infos/Verbe : bascule QCM ↔ texte pour tout l’exercice. */
  onSelectTcfFormForExercise?: (form: TcfTypeReponse, blockIndex?: number) => void
  onToggleTcfPageBreak?: (index: number, blockIndex?: number) => void
  onToggleFormulaireLetterGrid?: (blockIndex: number) => void
  /** Bouton refresh : régénère uniquement cet exercice (et éventuellement une moitié A5). */
  onRegenerateBlock?: (blockIndex: number, half?: 'left' | 'right') => void
  /** Afficher le refresh à côté du titre (désactivé en mode libre). */
  showExerciseRefresh?: boolean
  /**
   * Force l’en-tête même si pageNumber > 1.
   * Les moitiés A5 l’activent toujours (chaque mini-fiche est autonome).
   */
  forceHeader?: boolean
  /** Masque en-tête et pied : exercices seulement. */
  hideChrome?: boolean
  /** Moitié A5 : racine en `.a5-half` au lieu de `.worksheet-sheet`. */
  asHalf?: 'left' | 'right'
  coordEdit?: {
    selectedKind: CoordShape | null
    placingOrigin?: boolean
    onPlace: (x: number, y: number, kind: CoordShape) => void
    onPlaceOrigin?: (col: number, row: number) => void
    onRemove: (x: number, y: number) => void
  }
}

export function WorksheetSheet({
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
  interactiveTcfOptions = false,
  interactiveTcfPageBreaks = false,
  onSelectTcfForm,
  onSelectTcfFormForExercise,
  onToggleTcfPageBreak,
  onToggleFormulaireLetterGrid,
  onRegenerateBlock,
  showExerciseRefresh = true,
  forceHeader = false,
  hideChrome = false,
  asHalf,
  coordEdit,
}: WorksheetSheetProps) {
  const isJeuxSheet = page.domain === 'jeux'
  /** A5 : chaque moitié a toujours son en-tête (mini-contrôle autonome), sauf chrome masqué. */
  const showHeader =
    !hideChrome && !isJeuxSheet && (Boolean(asHalf) || forceHeader || pageNumber === 1)
  const showFooter = !hideChrome && !isJeuxSheet
  const parity = sheetIndex % 2 === 1 ? 'sheet-odd' : 'sheet-even'
  const isDraftPadPage = page.items.some(
    (item) =>
      item.layout === 'equation' ||
      item.layout === 'algebra' ||
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
      'syllable-pronounce',
      'mark-letter',
      'phrase-scramble',
      'determinant-fill',
      'dictee-grid',
      'count-sound',
      'read-phrases',
      'audio-match',
      'audio-order',
      'word-search',
    ].includes(item.layout),
  )
    ? 1
    : page.columns
  const isSoutienFr = page.domain === 'soutien-fr'
  const isAlphabetisation = page.domain === 'alphabetisation'
  const domainClass = page.domain === 'tcm-csc' ? ' is-tcm-csc' : ''
  const Root = asHalf ? 'div' : 'article'
  const rootClass = asHalf
    ? `a5-half is-${asHalf}${isJeuxSheet ? ' is-jeux' : ''}${isSoutienFr ? ' is-soutien-fr' : ''}${isAlphabetisation ? ' is-alphabetisation' : ''}${evalMode ? ' is-eval' : ''}`
    : `worksheet-sheet ${parity}${isJeuxSheet ? ' is-jeux' : ''}${isSoutienFr ? ' is-soutien-fr' : ''}${isAlphabetisation ? ' is-alphabetisation' : ''}${evalMode ? ' is-eval' : ''}`
  return (
    <Root
      className={rootClass + domainClass}
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
        {(page.blocks.length > 0 ? page.blocks : fallbackBlocks(page)).map((block, renderedBlockIndex) => {
          const blockIndex = block.sourceBlockIndex ?? renderedBlockIndex
          const algebraItems = block.items.filter((item) => item.layout === 'algebra')
          const maxTokens =
            algebraItems.length > 0
              ? Math.max(...algebraItems.map((item) => tokenizeAlgebra(item.prompt ?? '').length))
              : 0
          const blockDraft = block.items.some(
            (item) =>
              item.layout === 'equation' ||
              item.layout === 'algebra' ||
              (item.layout === 'geo' && Boolean(item.calcAnswer || item.responseAnswer)) ||
              (item.layout === 'text' && Boolean(item.calcAnswer || item.responseAnswer)),
          )
          const blockHeading = block.title
          const isTheoryBlock = block.items.some((item) => item.layout === 'theory')
          const perQ = block.pointsPerQuestion ?? pointsPerQuestion
          const blockPts = block.pointsWeights
            ? sumPointWeights(block.pointsWeights, perQ)
            : blockPointsTotal(block.items, perQ)
          const pointsBadge = formatPointsLabel(blockPts)
          const continuedSlice = (block.itemOffset ?? 0) > 0
          const dualForm = isGramDualFormExercise(block.exerciseType)
          const marginForm = isGramMarginFormExercise(block.exerciseType)
          const firstQuestion = block.items.find(
            (item) =>
              item.layout === 'tcf' && (item.tcf?.kind === 'qcm' || item.tcf?.kind === 'lignes'),
          )
          const dualFormSelect =
            dualForm && firstQuestion?.layout === 'tcf'
              ? firstQuestion.tcf &&
                (firstQuestion.tcf.kind === 'qcm' || firstQuestion.tcf.kind === 'lignes')
                ? firstQuestion.tcf.formSelect
                : undefined
              : undefined
          const dualActive =
            dualFormSelect &&
            (block.tcfFormModes?.[
              block.items.findIndex(
                (item) =>
                  item.layout === 'tcf' &&
                  (item.tcf?.kind === 'qcm' || item.tcf?.kind === 'lignes'),
              ) + (block.itemOffset ?? 0)
            ] ??
              dualFormSelect.active)
          const hideBanque =
            parseGramExerciseType(block.exerciseType)?.kindId === 'verbe-pastilles' &&
            (dualActive === 'qcm_texte' ||
              (dualActive == null && dualFormSelect?.active === 'qcm_texte'))
          const peBlank = tcfPeSlotDefaults(block.exerciseType)?.inlineBlankPx
          const blankPx =
            block.inlineBlankPx != null
              ? clampInlineBlankPx(block.inlineBlankPx)
              : peBlank != null
                ? clampInlineBlankPx(peBlank)
                : undefined
          return (
            <section
              className="exercise-block"
              data-exercise-type={block.exerciseType}
              key={`${block.exerciseType}-${block.exerciseIndex}`}
              style={
                blankPx != null
                  ? ({ '--tcf-blank-inline-px': `${blankPx}px` } as CSSProperties)
                  : undefined
              }
            >
              {isJeuxSheet || isTheoryBlock || continuedSlice ? null : (
              <header className="exercise-heading">
                <div className="exercise-heading-main">
                  <div className="exercise-heading-title-row">
                    <h3>{blockHeading}</h3>
                    {mode === 'answers' && !coAudioInBanner(block) && !hasMathAudioPrompts(block.exerciseType)
                      ? blockCorrigeAudios(block).map((src) => (
                          <audio
                            key={src}
                            className="oral-audio exercise-heading-audio no-print"
                            controls
                            preload="none"
                            src={src}
                          >
                            Écoutez l’enregistrement.
                          </audio>
                        ))
                      : null}
                    {onRegenerateBlock && showExerciseRefresh ? (
                      <button
                        type="button"
                        className="no-print exercise-refresh-btn"
                        aria-label={
                          asHalf
                            ? asHalf === 'left'
                              ? 'Régénérer la mini-fiche de gauche'
                              : 'Régénérer la mini-fiche de droite'
                            : 'Régénérer cet exercice'
                        }
                        title={
                          asHalf
                            ? asHalf === 'left'
                              ? 'Régénérer la mini-fiche de gauche'
                              : 'Régénérer la mini-fiche de droite'
                            : 'Régénérer cet exercice'
                        }
                        onClick={() => onRegenerateBlock(blockIndex, asHalf)}
                      >
                        <RefreshIcon />
                      </button>
                    ) : null}
                    {dualForm &&
                    dualFormSelect &&
                    dualActive &&
                    onSelectTcfFormForExercise ? (
                      <TcfFormMarginIcons
                        filled={dualFormSelect.filled.filter(
                          (f) => f === 'qcm_texte' || f === 'lignes',
                        )}
                        active={dualActive}
                        forms={['qcm_texte', 'lignes']}
                        layout="inline"
                        onSelect={(form) => onSelectTcfFormForExercise(form, blockIndex)}
                      />
                    ) : null}
                    {parseGramExerciseType(block.exerciseType)?.kindId === 'formulaire' &&
                    onToggleFormulaireLetterGrid ? (
                      <button
                        type="button"
                        className={`no-print draft-grid-chip ${
                          block.formulaireLetterGrid ? 'on' : 'off'
                        }`}
                        onClick={() => onToggleFormulaireLetterGrid(blockIndex)}
                        aria-pressed={Boolean(block.formulaireLetterGrid)}
                        title={
                          block.formulaireLetterGrid
                            ? 'Cases lettre / chiffre (une par case)'
                            : 'Lignes de réponse classiques'
                        }
                      >
                        Grille
                      </button>
                    ) : null}
                    {evalMode && blockPts > 0 ? (
                      <span className="instruction-points">{pointsBadge}</span>
                    ) : null}
                  </div>
                  {mode==='answers' && hasMathAudioPrompts(block.exerciseType) && <MathExerciseAudio block={block}/>}
                  {block.instruction ? (
                    <p className="exercise-instruction">{renderSheetCopy(block.instruction)}</p>
                  ) : null}
                  {block.exerciseType === 'addition-decompose' ? <DecomposeExample op="+" /> : null}
                  {block.exerciseType === 'soustraction-decompose' ? <DecomposeExample op="−" /> : null}
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
                    <p className="exercise-document-text">{renderSheetCopy(block.document.text)}</p>
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
      'syllable-pronounce',
      'mark-letter',
                        'phrase-scramble',
                        'determinant-fill',
                        'dictee-grid',
                        'count-sound',
                        'read-phrases',
                        'audio-match',
                        'audio-order',
                        'word-search',
                      ].includes(item.layout),
                    )
                      ? 1
                      : (block.columns ?? 1),
                  } as CSSProperties
                }
              >
                {block.items.map((item, index) => {
                  const padLeft =
                    item.layout === 'algebra' ? Math.max(0, maxTokens - tokenizeAlgebra(item.prompt ?? '').length) : 0
                  const draftGrid = block.problemDraftGrids?.[index] ?? page.problemDraftGrids?.[index] ?? !/^tcm-csc-ex(?:22|23|24)$/.test(block.exerciseType)
                  const oralAnswerMode =
                    block.oralAnswerModes?.[index] ?? page.oralAnswerModes?.[index] ?? item.answerMode ?? 'qcm'
                  const sourceIndex = index + (block.itemOffset ?? 0)
                  const tcfFormMode =
                    block.tcfFormModes?.[sourceIndex] ?? page.tcfFormModes?.[sourceIndex]
                  const tcfPageBreakBefore =
                    sourceIndex > 0 &&
                    Boolean(
                      block.tcfPageBreakAfter?.[sourceIndex - 1] ?? page.tcfPageBreakAfter?.[sourceIndex - 1],
                    )
                  const theoryBreakCount =
                    block.tcfPageBreakAfter?.length ??
                    page.tcfPageBreakAfter?.length ??
                    block.items.length + (block.itemOffset ?? 0)
                  const isTheoryPageBreakable =
                    item.layout === 'theory' &&
                    item.theoryBlock?.kind === 'section' &&
                    sourceIndex < theoryBreakCount - 1
                  const readingPart=item.grammar?.readingPart
                  const isGrammarPageBreakable=item.layout==='grammar'&&readingPart?.kind==='question'
                  const theoryPageBreakAfter = isGrammarPageBreakable ? Boolean(block.grammarPageBreakAfterQuestionIds?.includes(readingPart.questionId)) : Boolean(
                    block.tcfPageBreakAfter?.[sourceIndex] ??
                      page.tcfPageBreakAfter?.[sourceIndex] ??
                      item.theoryPageBreakAfter,
                  )
                  const blockAllowsDraftGrid = isDraftPadExercise(block.exerciseType)
                  const isTcfQuestion =
                    item.layout === 'tcf' &&
                    (item.tcf?.kind === 'qcm' || item.tcf?.kind === 'lignes')
                  const isTcfAudioCadre =
                    item.layout === 'tcf' && item.tcf?.kind === 'audio_cadre'
                  const isTcfPageBreakable =
                    isTcfQuestion ||
                    isTcfAudioCadre ||
                    (item.layout === 'tcf' && (item.tcf?.kind === 'dialogue' || item.tcf?.kind === 'ce_association_answers'))
                  const showMarginForms =
                    interactiveTcfOptions &&
                    isTcfQuestion &&
                    !dualForm &&
                    (marginForm || !parseGramExerciseType(block.exerciseType))
                  const showCadreForms =
                    interactiveTcfOptions &&
                    isTcfAudioCadre &&
                    !dualForm &&
                    (marginForm || !parseGramExerciseType(block.exerciseType))
                  const isFormulaireItem = item.layout === 'tcf' && item.tcf?.kind === 'formulaire'
                  const itemOffset = block.itemOffset ?? 0
                  return (
                    <ItemView
                      key={`${block.exerciseType}-${block.exerciseIndex}-${index}-${item.answer}-${tcfFormMode ?? ''}`}
                      item={item}
                      mode={mode}
                      itemLabel={/^tcm-(?:csc|cfr)-ex0[12]$/.test(block.exerciseType)?String.fromCharCode(65+index+itemOffset):undefined}
                      seriesNumber={/^tcm-csc-ex(?:06|16)$/.test(block.exerciseType)?index+itemOffset+1:undefined}
                      index={index + (/^tcm-csc-ex(?:10|11)$/.test(block.exerciseType) ? block.itemOffset ?? 0 : 0)}
                      algebraPadLeft={padLeft}
                      draftGrid={draftGrid}
                      onToggleDraftGrid={
                        interactiveDraftGrids && blockAllowsDraftGrid && onToggleDraftGrid
                          ? () => onToggleDraftGrid(index, blockIndex)
                          : undefined
                      }
                      oralAnswerMode={item.selectVariant === 'oral' ? oralAnswerMode : undefined}
                      onCycleOralAnswerMode={
                        interactiveOralModes && onCycleOralAnswerMode && item.selectVariant === 'oral'
                          ? () => onCycleOralAnswerMode(index, blockIndex)
                          : undefined
                      }
                      tcfFormMode={isTcfQuestion ? tcfFormMode : undefined}
                      tcfFormModes={
                        isTcfAudioCadre
                          ? (block.tcfFormModes ?? page.tcfFormModes)
                          : undefined
                      }
                      hideTcfFormIcons={dualForm || !showMarginForms}
                      onSelectTcfForm={
                        showMarginForms && onSelectTcfForm
                          ? (form) => onSelectTcfForm(index, form, blockIndex)
                          : undefined
                      }
                      onSelectTcfFormAt={
                        showCadreForms && onSelectTcfForm
                          ? (modeIndex, form) =>
                              onSelectTcfForm(modeIndex - itemOffset, form, blockIndex)
                          : undefined
                      }
                      tcfPageBreakBefore={isTcfPageBreakable ? tcfPageBreakBefore : undefined}
                      onToggleTcfPageBreak={
                        interactiveTcfPageBreaks &&
                        isTcfPageBreakable &&
                        sourceIndex > 0 &&
                        onToggleTcfPageBreak
                          ? () => onToggleTcfPageBreak(index, blockIndex)
                          : undefined
                      }
                      theoryPageBreakAfter={isTheoryPageBreakable||isGrammarPageBreakable ? theoryPageBreakAfter : undefined}
                      onToggleTheoryPageBreakAfter={
                        interactiveTcfPageBreaks && (isTheoryPageBreakable||isGrammarPageBreakable) && onToggleTcfPageBreak
                          ? () => onToggleTcfPageBreak(index + (isGrammarPageBreakable?0:1), blockIndex)
                          : undefined
                      }
                      formulaireLetterGrid={Boolean(block.formulaireLetterGrid)}
                      onToggleFormulaireLetterGrid={
                        isFormulaireItem && onToggleFormulaireLetterGrid
                          ? () => onToggleFormulaireLetterGrid(blockIndex)
                          : undefined
                      }
                      hideMotsBanque={hideBanque}
                      coordEdit={coordEdit}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </SheetBody>
      {showFooter ? (
        <DocumentFooter
          pageNumber={pageNumber}
          total={total}
          reference={
            isAlphaSoutienDomain(page.domain) ? ALPHA_SOUTIEN_REFERENCE : institutional.reference
          }
        />
      ) : null}
    </Root>
  )
}

/** Feuille A4 paysage coupée en deux mini-fiches A5 (même exercice, graines indépendantes). */
export function DualA5Sheet({
  leftPage,
  rightPage,
  ...sheetProps
}: Omit<WorksheetSheetProps, 'page' | 'asHalf' | 'forceHeader'> & {
  leftPage: WorksheetPage
  rightPage: WorksheetPage
}) {
  const isJeuxSheet = leftPage.domain === 'jeux'
  const parity = sheetProps.sheetIndex % 2 === 1 ? 'sheet-odd' : 'sheet-even'
  return (
    <article
      className={`worksheet-sheet is-a5-double ${parity}${isJeuxSheet ? ' is-jeux' : ''}${sheetProps.evalMode ? ' is-eval' : ''}`}
    >
      <WorksheetSheet
        {...sheetProps}
        page={leftPage}
        asHalf="left"
        forceHeader={!sheetProps.hideChrome}
      />
      <div className="a5-cut-guide" aria-hidden="true">
        <span className="a5-cut-mark" />
      </div>
      <WorksheetSheet
        {...sheetProps}
        page={rightPage}
        asHalf="right"
        forceHeader={!sheetProps.hideChrome}
      />
    </article>
  )
}

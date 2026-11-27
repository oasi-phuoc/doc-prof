import { exerciseTypeById } from '@/math/catalog'
import { FreeNumberControls } from './FreeNumberControls'
import type { FocusEventHandler, KeyboardEventHandler, ReactNode } from 'react'
import type { ExerciseBlock, MathItem, WorksheetPage } from '@/math/types'
import type { GameTemplate } from '@/jeux/templates'
import { PhraseLibreEditor, isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import type { SoutienComplete } from '@/francais/soutien/banks'
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
import { GameContentPanel } from '@/jeux/GameContentPanel'
import { DEFAULT_GAME_FONT_SIZE } from '@/jeux/font-size'
import { TcfExerciseEditor } from '@/tcf/TcfExerciseEditor'
import type { TcfExercise, TcfNiveau } from '@/tcf/types'
import { isLogistiqueReferenceType, logistiqueType } from '@/logistique/catalog'
import { logistiqueQuestionPhotos } from '@/logistique/generate'
import { LogistiqueLibreBank } from './LogistiqueLibreBank'

function tcfSupportExercise(items: MathItem[] | undefined): TcfExercise | undefined {
  const tcf = items?.find((item) => item.tcf?.kind === 'support')?.tcf
  return tcf?.kind === 'support' ? tcf.exercise : undefined
}
import { GenericLibreEditor } from '@/components/generator/GenericLibreEditor'
import { identifyItems } from '@/components/generator/libre/flat-items'
import { TpmLibreEditor } from '@/components/generator/TpmLibreEditor'
import { VocabAddWordRow } from '@/components/generator/VocabAddWordRow'
import type { VocabWordEntry } from '@/francais/vocab-learn'

export type LibreSidePanelProps = {
  settings: ReactNode
  history: {
    canUndo: boolean
    canRedo: boolean
    undo: () => void
    redo: () => void
    onKeyDown: KeyboardEventHandler<HTMLElement>
  }
  footer: ReactNode
  onFocusCapture: FocusEventHandler<HTMLElement>
  activeBlock: ExerciseBlock
  activeSheet: WorksheetPage | undefined
  safeBlockIndex: number
  isPhraseDomain: boolean
  isNumberLibreDomain: boolean
  liveAddition: boolean
  additionId: string
  maxQuestions: number
  transientFields: Record<string, string>
  onTransientField: (id: string, text: string | null) => void
  isCalliDomain: boolean
  isJeuxDomain: boolean
  isTcf: boolean
  isGrammaireExercise: boolean
  isTpmLike: boolean
  isDroites: boolean
  isConstruire: boolean
  soutienKind: string | undefined
  soutienType1Words: readonly string[]
  soutienType1WordPool: readonly string[]
  soutienCompletes: readonly SoutienComplete[]
  soutienBankWords: readonly string[]
  calliIsPhrases: boolean
  calliFields: string[]
  setCalliFieldAt: (index: number, value: string) => void
  removeCalliField: (index: number) => void
  addCalliExtraWord: (entry: VocabWordEntry) => void
  jeuxTemplate: GameTemplate | null | undefined
  jeuxText: string
  tcfNiveau: TcfNiveau
  /** Exercice réellement affiché, même s’il est sur une autre feuille de la suite. */
  renderedExercise?: TcfExercise
  logistiqueItemsOnSheet?: MathItem[]
  logistiqueActiveItems?: MathItem[]
  updatePage: (patch: Partial<ExerciseBlock>) => void
  onClose: () => void
  /** Régénère l’exercice actif (autres nombres / autre tirage banque). */
  onRegenerateBlock?: (blockIndex: number, half?: 'left' | 'right', itemId?: string) => void
}

export function LibreSidePanel({
  settings,
  history,
  footer,
  onFocusCapture,
  activeBlock,
  activeSheet,
  safeBlockIndex,
  isPhraseDomain,
  isNumberLibreDomain,
  liveAddition,
  additionId,
  maxQuestions,
  transientFields,
  onTransientField,
  isCalliDomain,
  isJeuxDomain,
  isTcf,
  isGrammaireExercise,
  isTpmLike,
  isDroites,
  isConstruire,
  soutienKind,
  soutienType1Words,
  soutienType1WordPool,
  soutienCompletes,
  soutienBankWords,
  calliIsPhrases,
  calliFields,
  setCalliFieldAt,
  removeCalliField,
  addCalliExtraWord,
  jeuxTemplate,
  jeuxText,
  tcfNiveau,
  renderedExercise,
  logistiqueItemsOnSheet,
  logistiqueActiveItems,
  updatePage,
  onRegenerateBlock,
  onClose,
}: LibreSidePanelProps) {
  const logistics = logistiqueType(activeBlock.exerciseType)
  const genericItems = activeBlock.libreItems ?? logistiqueActiveItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []
  const logistiquePhotos = logistics && !isLogistiqueReferenceType(logistics.id) ? {
    defaultModule: logistics.module,
    byModule: logistiqueQuestionPhotos(logistics,
      [...new Set(genericItems.map((item) => item.logistiqueSource?.module ?? logistics.module))],
      activeBlock.logistiqueBankRevision),
  } : undefined
  const activeItems = activeBlock.libreItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []
  const arithmeticItems = liveAddition ? identifyItems(activeItems, additionId) : activeItems
  return (
    <aside
      className="side-tool-panel is-libre no-print"
      id="activity-editor"
      aria-label="Mode libre"
      tabIndex={-1}
      onFocusCapture={onFocusCapture}
      onKeyDown={history.onKeyDown}
    >
      <div className="side-tool-panel-head is-libre-head">
        <button
          type="button"
          className="side-tool-close is-theme"
          aria-label="Fermer le mode libre"
          title="Fermer le mode libre"
          onClick={onClose}
        >
          ×
        </button>
        <h3>Mode libre</h3>
        <div className="libre-history" role="group" aria-label="Historique des modifications">
          <button type="button" className="side-tool-close" title="Annuler" aria-label="Annuler" disabled={!history.canUndo} onClick={history.undo}>
            <span aria-hidden="true">↶</span>
          </button>
          <button type="button" className="side-tool-close" title="Rétablir" aria-label="Rétablir" disabled={!history.canRedo} onClick={history.redo}>
            <span aria-hidden="true">↷</span>
          </button>
        </div>
      </div>
      {footer}
      <div className="side-tool-panel-body" hidden={Boolean(footer)}>
        <div className="activity-settings">{settings}</div>
        {isNumberLibreDomain && activeBlock.numberLibre &&
          exerciseTypeById[activeBlock.exerciseType]?.supportsNumberRange !== false ? (
          <div className="libre-number-generation">
            <FreeNumberControls activeBlock={activeBlock} updatePage={updatePage} />
            {onRegenerateBlock && (
              <button type="button" className="button small secondary" onClick={() => onRegenerateBlock(safeBlockIndex)}>
                Générer avec ces valeurs
              </button>
            )}
          </div>
        ) : null}
        {isPhraseDomain &&
        isPhraseLibreEditable(activeBlock.exerciseType) ? (
          <PhraseLibreEditor
            exerciseType={activeBlock.exerciseType}
            items={
              activeBlock.phraseItems ??
              activeSheet?.blocks[safeBlockIndex]?.items ??
              []
            }
            instruction={
              activeBlock.phraseInstruction ??
              activeSheet?.blocks[safeBlockIndex]?.instruction ??
              ''
            }
            onChangeItems={(phraseItems) => updatePage({ phraseItems })}
            onChangeInstruction={(phraseInstruction) =>
              updatePage({ phraseInstruction })
            }
          />
        ) : null}
        {isNumberLibreDomain && !((isDroites || isConstruire) && activeBlock.coordLibre) ? (
          <TpmLibreEditor
            liveArithmetic={liveAddition}
            exerciseType={activeBlock.exerciseType}
            instruction={
              activeBlock.libreInstruction ??
              activeSheet?.blocks[safeBlockIndex]?.instruction ??
              ''
            }
            items={arithmeticItems}
            maxQuestions={maxQuestions}
            transient={liveAddition ? { fields: transientFields, write: onTransientField } : undefined}
            onRegenerate={liveAddition ? (id) => onRegenerateBlock?.(safeBlockIndex, undefined, id) : undefined}
            onChangeInstruction={(libreInstruction) => {
              updatePage(liveAddition ? { libreId: additionId, libreInstruction, libreItems: arithmeticItems } : { libreInstruction })
            }}
            onChangeItems={(libreItems) => updatePage(liveAddition
              ? { libreId: additionId, libreItems, ...(libreItems.length === activeBlock.count ? {} : { count: libreItems.length }) }
              : { libreItems })}
          />
        ) : null}
        {soutienKind === 'mots' ? (
          <SoutienMotsLibreEditor
            entries={
              activeBlock.soutienMotsEntries ??
              defaultSoutienMotsEntries(soutienType1Words)
            }
            suggestedWords={soutienType1WordPool}
            onChange={(soutienMotsEntries) => updatePage({ soutienMotsEntries })}
          />
        ) : null}
        {soutienKind === 'completer' ? (
          <SoutienCompleterLibreEditor
            entries={
              activeBlock.soutienCompleterEntries?.length
                ? activeBlock.soutienCompleterEntries
                : defaultSoutienCompleterEntries(soutienCompletes)
            }
            suggestedWords={soutienBankWords}
            onChange={(soutienCompleterEntries) =>
              updatePage({ soutienCompleterEntries })
            }
          />
        ) : null}
        {(isDroites || isConstruire) && activeBlock.coordLibre ? (
          <CoordQuestionsLibreEditor
            questions={
              activeBlock.coordQuestionsLibre ??
              resizeCoordQuestionsLibre([], activeBlock.count)
            }
            maxCount={isConstruire ? 8 : 10}
            onChange={(coordQuestionsLibre) => {
              const capped = coordQuestionsLibre.slice(0, isConstruire ? 8 : 10)
              updatePage({
                coordQuestionsLibre: capped,
                count: capped.length || activeBlock.count,
              })
            }}
          />
        ) : null}
        {isCalliDomain ? (
          <div className="quad-libre-block">
            <b>{calliIsPhrases ? 'Phrases à recopier' : 'Mots à recopier'}</b>
            <p className="type-hint muted">
              Une ligne par modèle. L’ordre ici est l’ordre sur la fiche.
            </p>
            <ul
              className="calli-fields"
              aria-label={calliIsPhrases ? 'Phrases à recopier' : 'Mots ou phrases à recopier'}
            >
              {calliFields.map((value, index) => (
                <li className="calli-field-row" key={`calli-libre-${index}`}>
                  <span className="calli-field-num">{index + 1}.</span>
                  <input
                    className="pill-input"
                    type="text"
                    value={value}
                    spellCheck
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
              <VocabAddWordRow
                withImage={false}
                placeholder={calliIsPhrases ? 'Nouvelle phrase' : 'Mot ou phrase'}
                onAdd={addCalliExtraWord}
              />
            </div>
          </div>
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
        {isTcf ? (
          <TcfExerciseEditor
            niveau={tcfNiveau}
            typeId={activeBlock.exerciseType}
            exercise={activeBlock.tcfExercise}
            bankId={activeBlock.tcfBankId}
            shownId={activeSheet?.blocks[safeBlockIndex]?.items.find((item) => item.tcfExerciseId)?.tcfExerciseId}
            questionCount={activeBlock.tcfQuestionCount}
            fallbackExercise={renderedExercise ?? tcfSupportExercise(activeSheet?.blocks[safeBlockIndex]?.items)}
            onChange={(patch) => updatePage(patch)}
          />
        ) : null}
        {isGrammaireExercise ? (
          <TcfExerciseEditor
            variant="grammaire"
            niveau={tcfNiveau}
            typeId={activeBlock.exerciseType}
            exercise={activeBlock.tcfExercise}
            fallbackExercise={
              renderedExercise ?? tcfSupportExercise(activeSheet?.blocks[safeBlockIndex]?.items)
            }
            onChange={(patch) => updatePage(patch)}
            onReroll={() => onRegenerateBlock?.(safeBlockIndex)}
          />
        ) : null}
        {/* TPM / TCM CFR / CSC : éditeur spécialisé (sélecteurs + recalcul). */}
        {isTpmLike &&
        !isPhraseDomain &&
        !isCalliDomain &&
        !isJeuxDomain &&
        !isTcf ? (
          <TpmLibreEditor
            exerciseType={activeBlock.exerciseType}
            instruction={
              activeBlock.libreInstruction ??
              activeSheet?.blocks[safeBlockIndex]?.instruction ??
              ''
            }
            items={
              activeBlock.libreItems ??
              activeSheet?.blocks[safeBlockIndex]?.items ??
              []
            }
            onChangeInstruction={(libreInstruction) =>
              updatePage({ libreInstruction })
            }
            onChangeItems={(libreItems) => updatePage({ libreItems })}
          />
        ) : null}
        {/* Un seul éditeur générique — évite le doublon (ex. domaines nombres). */}
        {!isTpmLike &&
        !isNumberLibreDomain &&
        !isPhraseDomain &&
        !isCalliDomain &&
        !isJeuxDomain &&
        !isTcf &&
        !isGrammaireExercise &&
        soutienKind !== 'mots' &&
        soutienKind !== 'completer' &&
        !(isDroites || isConstruire) ? (
          <>
            {logistics && !isLogistiqueReferenceType(logistics.id) && (
              <LogistiqueLibreBank key={logistics.id} type={logistics} revision={activeBlock.logistiqueBankRevision}
                gapMode={activeBlock.logistiqueGapMode}
                items={logistiqueItemsOnSheet ?? genericItems}
                onReroll={onRegenerateBlock ? () => onRegenerateBlock(safeBlockIndex) : undefined}
                onAdd={(items) => updatePage({ libreItems: [...genericItems, ...items] })} />
            )}
            <GenericLibreEditor
              instruction={
                activeBlock.libreInstruction ??
                activeSheet?.blocks[safeBlockIndex]?.instruction ??
                ''
              }
              items={genericItems}
              editableCalculation={logistics?.kind === 'maths'}
              logistiquePhotos={logistiquePhotos}
              onChangeInstruction={(libreInstruction) => updatePage({ libreInstruction })}
              onChangeItems={(libreItems) => updatePage({ libreItems })}
            />
          </>
        ) : null}
      </div>
    </aside>

  )
}

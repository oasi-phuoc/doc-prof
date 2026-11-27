import { FreeNumberControls } from './FreeNumberControls'
import { supportsActivityNumberRange } from './activity-settings'
import type { ExerciseBlock, MathItem, WorksheetPage } from '@/math/types'
import type { GameTemplate } from '@/jeux/templates'
import { PhraseLibreEditor, isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import type { SoutienComplete, SoutienVowelBank } from '@/francais/soutien/banks'
import {
  defaultSoutienMotsEntries,
  SoutienMotsLibreEditor,
} from '@/francais/soutien/SoutienMotsLibreEditor'
import {
  defaultSoutienCompleterEntries,
  SOUTIEN_COMPLETER_MAX,
  SoutienCompleterLibreEditor,
} from '@/francais/soutien/SoutienCompleterLibreEditor'
import { GameContentPanel } from '@/jeux/GameContentPanel'
import { DEFAULT_GAME_FONT_SIZE } from '@/jeux/font-size'
import { TcfExerciseEditor } from '@/tcf/TcfExerciseEditor'
import type { TcfExercise, TcfNiveau } from '@/tcf/types'
import { isLogistiqueReferenceType, logistiqueModules, logistiquePresentationFor, logistiqueType } from '@/logistique/catalog'
import { logistiqueQuestionItems, logistiqueQuestionPhotos } from '@/logistique/generate'
import { LogistiqueLibreBank } from './LogistiqueLibreBank'

function tcfSupportExercise(items: MathItem[] | undefined): TcfExercise | undefined {
  const tcf = items?.find((item) => item.tcf?.kind === 'support')?.tcf
  return tcf?.kind === 'support' ? tcf.exercise : undefined
}
import { GenericLibreEditor } from '@/components/generator/GenericLibreEditor'
import { identifyItems } from '@/components/generator/libre/flat-items'
import { TheoryEditor } from '@/components/generator/libre/TheoryEditor'
import { LetterGridEditor } from '@/components/generator/libre/LetterGridEditor'
import { LogicEditor } from '@/components/generator/libre/LogicEditor'
import { SyllableEditor } from '@/components/generator/libre/SyllableEditor'
import { ListenCheckEditor } from '@/components/generator/libre/ListenCheckEditor'
import { SyllableMatchEditor } from '@/components/generator/libre/SyllableMatchEditor'
import { SoutienPhraseRowsEditor } from '@/components/generator/libre/SoutienPhraseRowsEditor'
import { AudioOrderEditor } from '@/components/generator/libre/AudioOrderEditor'
import { audioOrderKind } from '@/francais/soutien/audio-order'
import { GrammarEditor } from '@/components/generator/libre/GrammarEditor'
import type { GrammarSnapshot } from '@/grammaire/curriculum/types'
import type { SheetBlockItems } from '@/components/generator/sheet-items'
import { TpmLibreEditor } from '@/components/generator/TpmLibreEditor'
import { VocabAddWordRow } from '@/components/generator/VocabAddWordRow'
import type { VocabWordEntry } from '@/francais/vocab-learn'

type LibreActivityEditorProps = {
  activeBlock: ExerciseBlock
  activeSheet: WorksheetPage | undefined
  safeBlockIndex: number
  isPhraseDomain: boolean
  isNumberLibreDomain: boolean
  liveArithmetic: boolean
  liveTcf: boolean
  evalMode: boolean
  livePhrase: boolean
  theory: SheetBlockItems | null
  textExercise: SheetBlockItems | null
  letterGrid: SheetBlockItems | null
  logic: SheetBlockItems | null
  phraseOrder: SheetBlockItems | null
  syllableContent: SheetBlockItems | null
  listenContent: SheetBlockItems | null
  syllableMatchContent: SheetBlockItems | null
  soutienPhrases: SheetBlockItems | null
  audioOrderContent: SheetBlockItems | null
  syllableBank: SoutienVowelBank | null | undefined
  grammarSelection: GrammarSnapshot | null
  grammarCanRegenerate: boolean
  arithmeticId: string
  halfEditor?: { value: 'left' | 'right'; setValue: (half: 'left' | 'right') => void; content: SheetBlockItems | null; id: string }
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
  liveWords: boolean
  alphaWords: boolean
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
  /** Régénère l’exercice actif (autres nombres / autre tirage banque). */
  onRegenerateBlock?: (blockIndex: number, half?: 'left' | 'right', target?: string | readonly string[]) => void
}

export function LibreActivityEditor({
  activeBlock,
  activeSheet,
  safeBlockIndex,
  isPhraseDomain,
  isNumberLibreDomain,
  liveArithmetic,
  liveTcf,
  evalMode,
  livePhrase,
  theory,
  textExercise,
  letterGrid,
  logic,
  phraseOrder,
  syllableContent,
  listenContent,
  syllableMatchContent,
  soutienPhrases,
  audioOrderContent,
  syllableBank,
  grammarSelection,
  grammarCanRegenerate,
  arithmeticId,
  halfEditor,
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
  liveWords,
  alphaWords,
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
}: LibreActivityEditorProps) {
  const logistics = logistiqueType(activeBlock.exerciseType)
  const logistiqueQuestionType = logistics && !isLogistiqueReferenceType(logistics.id) ? logistics : undefined
  const genericItems = activeBlock.libreItems ?? logistiqueActiveItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []
  const logistiquePhotos = logistiqueQuestionType ? {
    defaultModule: logistiqueQuestionType.module,
    byModule: logistiqueQuestionPhotos(logistiqueQuestionType,
      [...new Set(genericItems.map((item) => item.logistiqueSource?.module ?? item.logistiqueLocalModule ?? logistiqueQuestionType.module))],
      activeBlock.logistiqueBankRevision),
  } : undefined
  const allowedModules = evalMode ? activeBlock.logistiqueSelection?.modules : undefined
  const logistiqueEditor = logistiqueQuestionType ? {
    kind: logistiqueQuestionType.kind,
    defaultModule: logistiqueQuestionType.module,
    modules: logistiqueModules(logistiqueQuestionType.domain).filter(({ code }) =>
      !allowedModules?.length || allowedModules.includes(code)),
    original(item: MathItem) {
      const source = item.logistiqueSource
      if (!source) return undefined
      const presentation = item.logistiqueTable?.presentation ??
        (item.logistiqueGaps ? item.logistiqueGaps.words ? 'avec-liste' : 'sans-liste' : undefined)
      return logistiqueQuestionItems(logistiqueQuestionType, [source.module], activeBlock.logistiqueBankRevision, presentation)
        .find((entry) => entry.logistiqueSource?.id === source.id)
    },
  } : undefined
  const activeItems = activeBlock.libreItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []
  const phraseItems = activeBlock.phraseItems ?? activeSheet?.blocks[safeBlockIndex]?.items ?? []
  const rightHalf = halfEditor?.value === 'right'
  const editedActivityId = halfEditor?.id ?? arithmeticId
  const arithmeticItems = liveArithmetic ? identifyItems(halfEditor?.content?.items ?? activeItems, editedActivityId) : activeItems
  const logicContent = logic && (halfEditor?.content ?? logic)
  const questions = textExercise ? halfEditor?.content ?? textExercise :
    logistiqueQuestionType ? { items: genericItems, instruction: logistiqueQuestionType.instruction } : null
  const questionInstruction = questions?.items.length || !logistiqueQuestionType
    ? questions?.instruction ?? ''
    : activeBlock.libreInstruction ?? logistiqueQuestionType.instruction
  const wordListContent = letterGrid && (halfEditor?.content ?? letterGrid)
  const orderedPhrases = phraseOrder && (halfEditor?.content ?? phraseOrder)
  const syllables = syllableContent && (halfEditor?.content ?? syllableContent)
  const listening = listenContent && (halfEditor?.content ?? listenContent)
  const syllableMatches = syllableMatchContent && (halfEditor?.content ?? syllableMatchContent)
  const soutienPhraseContent = soutienPhrases && (halfEditor?.content ?? soutienPhrases)
  const audioSeries = audioOrderContent && (halfEditor?.content ?? audioOrderContent)
  const arithmeticInstruction = halfEditor?.content?.instruction ?? activeBlock.libreInstruction ??
    activeSheet?.blocks[safeBlockIndex]?.instruction ?? ''
  function editActivityItems(items: MathItem[], instruction: string, keepCount = false) {
    if (rightHalf) {
      updatePage({ a5RightLibre: { id: editedActivityId, items, instruction } })
      return
    }
    const breaks = logistiqueEditor && activeBlock.tcfPageBreakAfter && questions
      ? new Set(identifyItems(questions.items, editedActivityId).flatMap(({ libreId }, index) =>
        activeBlock.tcfPageBreakAfter?.[index] ? [libreId] : []))
      : undefined
    const count = logistiqueEditor ? Math.max(1, items.length) : items.length
    updatePage({
      libreId: editedActivityId, libreItems: items, libreInstruction: instruction,
      ...(breaks ? { tcfPageBreakAfter: items.map(({ libreId }) => breaks.has(libreId)) } : {}),
      ...(!halfEditor && !isTpmLike && !keepCount && count !== activeBlock.count ? { count } : {}),
    })
  }
  const renderedWords = liveWords ? activeItems.find((item) => item.layout === 'vocab-table')?.vocabEntries
    ?.map(({ id, label, imageSrc }) => ({ id, label, imageSrc })) : undefined
  const renderedCompletes = liveWords ? activeItems.find((item) => item.layout === 'syllable-complete')?.syllableCompletes
    ?.map(({ article, word, before, blank, after, imageSrc }, index) => ({
      id: `soutien-comp-occurrence-${index}`, article, word, before, blank, after, imageSrc,
    })) : undefined
  return (
    <>
      {isNumberLibreDomain && supportsActivityNumberRange(activeBlock.exerciseType) && (
        <details className="libre-theory-block libre-number-generation">
          <summary>Valeurs du prochain tirage</summary>
          <label className="libre-field">
            <input type="checkbox" checked={Boolean(activeBlock.numberLibre)} onChange={(event) =>
              updatePage({ numberLibre: event.target.checked })} />
            Utiliser des valeurs personnalisées
          </label>
          {activeBlock.numberLibre && <FreeNumberControls activeBlock={activeBlock} updatePage={updatePage} />}
          {activeBlock.numberLibre && onRegenerateBlock && (
            <button type="button" className="button small secondary" onClick={() => onRegenerateBlock(safeBlockIndex)}>
              Générer avec ces valeurs
            </button>
          )}
        </details>
      )}
      {halfEditor && (
        <div className="mode-toggle is-2" role="group" aria-label="Demi-feuille à modifier">
          {(['left', 'right'] as const).map((half) => (
            <button key={half} type="button" className={halfEditor.value === half ? 'active' : ''}
              aria-pressed={halfEditor.value === half} onClick={() => halfEditor.setValue(half)}>
              {half === 'left' ? 'Gauche' : 'Droite'}
            </button>
          ))}
        </div>
      )}
      {theory ? (
        <TheoryEditor exerciseType={activeBlock.exerciseType} items={theory.items} onChange={(libreItems) => updatePage({ libreItems })} />
      ) : null}
      {wordListContent?.items.length ? (
        <LetterGridEditor items={wordListContent.items} instruction={wordListContent.instruction}
          activityId={`${editedActivityId}:${activeBlock.exerciseType}`} fields={transientFields} writeField={onTransientField}
          onChange={(items) => halfEditor ? editActivityItems(items, wordListContent.instruction)
            : updatePage({ libreItems: items, libreInstruction: wordListContent.instruction })}
          onInstruction={(instruction) => halfEditor ? editActivityItems(wordListContent.items, instruction)
            : updatePage({ libreInstruction: instruction, libreItems: wordListContent.items })} />
      ) : null}
      {logicContent?.items.length ? (
        <LogicEditor type={activeBlock.exerciseType} items={identifyItems(logicContent.items, editedActivityId)} instruction={logicContent.instruction}
          onChange={(items) => editActivityItems(items, logicContent.instruction)}
          onInstruction={(instruction) => editActivityItems(identifyItems(logicContent.items, editedActivityId), instruction)}
          onRegenerate={(id) => onRegenerateBlock?.(safeBlockIndex, halfEditor?.value, id)} />
      ) : null}
      {orderedPhrases?.items.length ? (
        <PhraseLibreEditor key={editedActivityId} reviewOrder exerciseType={activeBlock.exerciseType} instruction={orderedPhrases.instruction}
          items={identifyItems(orderedPhrases.items, editedActivityId)}
          onChangeItems={(items) => editActivityItems(items, orderedPhrases.instruction)}
          onChangeInstruction={(instruction) => editActivityItems(identifyItems(orderedPhrases.items, editedActivityId), instruction)} />
      ) : null}
      {syllables && syllableBank && syllables.items.map((item, index) => (
        <SyllableEditor key={`${editedActivityId}:${index}`} item={item} bank={syllableBank}
          activityId={`${editedActivityId}:${activeBlock.exerciseType}:${index}`} fields={transientFields} writeField={onTransientField}
          onChange={(next) => {
            const items = syllables.items.map((current, position) => position === index ? next : current)
            if (halfEditor) editActivityItems(items, syllables.instruction)
            else updatePage({ libreItems: items, libreInstruction: syllables.instruction })
          }} />
      ))}
      {listening && syllableBank && listening.items.map((item, index) => (
        <ListenCheckEditor key={`${editedActivityId}:${index}`} item={item} bank={syllableBank}
          id={`${editedActivityId}:${activeBlock.exerciseType}:${index}`} fields={transientFields} writeField={onTransientField}
          onChange={(next) => editActivityItems(listening.items.map((current, position) =>
            position === index ? next : current), listening.instruction, true)} />
      ))}
      {syllableMatches?.items.map((item, index) => (
        <SyllableMatchEditor key={`${editedActivityId}:${index}`} item={item}
          id={`${editedActivityId}:${activeBlock.exerciseType}:${index}`} fields={transientFields} writeField={onTransientField}
          onChange={(next) => editActivityItems(syllableMatches.items.map((current, position) =>
            position === index ? next : current), syllableMatches.instruction, true)} />
      ))}
      {soutienPhraseContent && syllableBank && soutienPhraseContent.items.map((item, index) => (
        <SoutienPhraseRowsEditor key={`${editedActivityId}:${index}`} item={item} bank={syllableBank}
          id={`${editedActivityId}:${activeBlock.exerciseType}:${index}`} fields={transientFields} writeField={onTransientField}
          onChange={(next) => editActivityItems(identifyItems(soutienPhraseContent.items.map((current, position) =>
            position === index ? next : current), editedActivityId), soutienPhraseContent.instruction, true)} />
      ))}
      {audioSeries?.items.length && syllableBank && audioOrderKind(soutienKind) ? (
        <AudioOrderEditor items={identifyItems(audioSeries.items, editedActivityId)} bank={syllableBank} kind={soutienKind}
          preferred={soutienType1Words} excluded={activeBlock.soutienExcludeWords}
          onChange={(items) => editActivityItems(items, audioSeries.instruction, true)} />
      ) : null}
      {logistics && !isLogistiqueReferenceType(logistics.id) && (
        <LogistiqueLibreBank key={logistics.id} type={logistics} revision={activeBlock.logistiqueBankRevision}
          presentation={logistiquePresentationFor(activeBlock)}
          items={logistiqueItemsOnSheet ?? genericItems}
          onReroll={onRegenerateBlock ? () => onRegenerateBlock(safeBlockIndex) : undefined}
          onAdd={(added) => {
            if (questions) editActivityItems(identifyItems([...questions.items, ...added], editedActivityId), questionInstruction)
            else updatePage({ libreItems: [...genericItems, ...added] })
          }} />
      )}
      {questions && (questions.items.length > 0 || logistiqueEditor) ? (
        <GenericLibreEditor
          key={editedActivityId}
          direct
          instruction={questionInstruction}
          items={identifyItems(questions.items, editedActivityId)}
          editableCalculation={logistics?.kind === 'maths'}
          logistique={logistiqueEditor}
          logistiquePhotos={logistiquePhotos}
          fields={transientFields}
          writeField={onTransientField}
          onChangeInstruction={(instruction) => editActivityItems(identifyItems(questions.items, editedActivityId), instruction)}
          onChangeItems={(items) => editActivityItems(items, questionInstruction)}
          onRegenerate={(id) => onRegenerateBlock?.(safeBlockIndex, halfEditor?.value, id)}
        />
      ) : null}
      {isPhraseDomain &&
      isPhraseLibreEditable(activeBlock.exerciseType) ? (
        <PhraseLibreEditor
          exerciseType={activeBlock.exerciseType}
          items={phraseItems}
          instruction={
            activeBlock.phraseInstruction ??
            activeSheet?.blocks[safeBlockIndex]?.instruction ??
            ''
          }
          onChangeItems={(items) => updatePage(livePhrase
            ? { verbGroup: 'libre', phraseItems: items, count: items.length || activeBlock.count }
            : { phraseItems: items })}
          onChangeInstruction={(phraseInstruction) => updatePage(livePhrase
            ? { verbGroup: 'libre', phraseInstruction, phraseItems }
            : { phraseInstruction })}
        />
      ) : null}
      {!theory && (isNumberLibreDomain || isTpmLike) && !isDroites && !isConstruire ? (
        <TpmLibreEditor
          key={editedActivityId}
          liveArithmetic={liveArithmetic}
          fixedTest={isTpmLike}
          exerciseType={activeBlock.exerciseType}
          instruction={arithmeticInstruction}
          items={arithmeticItems}
          maxQuestions={maxQuestions}
          transient={liveArithmetic ? { fields: transientFields, write: onTransientField } : undefined}
          onRegenerate={liveArithmetic ? (id) => onRegenerateBlock?.(safeBlockIndex, halfEditor?.value, id) : undefined}
          onChangeInstruction={(libreInstruction) => {
            if (liveArithmetic) editActivityItems(arithmeticItems, libreInstruction)
            else updatePage({ libreInstruction })
          }}
          onChangeItems={(libreItems) => liveArithmetic
            ? editActivityItems(libreItems, arithmeticInstruction)
            : updatePage({ libreItems })}
        />
      ) : null}
      {soutienKind === 'mots' ? (
        <SoutienMotsLibreEditor
          key={`${arithmeticId}-${activeBlock.exerciseType}`}
          entries={
            (liveWords && !activeBlock.soutienMotsLibre ? undefined : activeBlock.soutienMotsEntries) ??
            renderedWords ??
            defaultSoutienMotsEntries(soutienType1Words)
          }
          suggestedWords={soutienType1WordPool}
          onChange={(soutienMotsEntries) => updatePage(liveWords ? {
            soutienMotsLibre: true,
            soutienMotsEntries,
            ...(alphaWords ? { count: soutienMotsEntries.length } : {}),
          } : { soutienMotsEntries })}
        />
      ) : null}
      {soutienKind === 'completer' ? (
        <SoutienCompleterLibreEditor
          key={`${arithmeticId}-${activeBlock.exerciseType}`}
          entries={
            (!liveWords || activeBlock.soutienCompleterLibre) && activeBlock.soutienCompleterEntries?.length
              ? activeBlock.soutienCompleterEntries
              : renderedCompletes ?? defaultSoutienCompleterEntries(soutienCompletes)
          }
          suggestedWords={soutienBankWords}
          max={liveWords ? 18 : SOUTIEN_COMPLETER_MAX}
          onChange={(soutienCompleterEntries) =>
            updatePage(liveWords ? {
              soutienCompleterLibre: true,
              soutienCompleterEntries,
              count: soutienCompleterEntries.length,
            } : { soutienCompleterEntries })
          }
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
                {calliIsPhrases ? <textarea
                  className="pill-input"
                  rows={2}
                  value={value}
                  aria-label={`Modèle ${index + 1}`}
                  spellCheck
                  onChange={(event) => setCalliFieldAt(index, event.target.value)}
                /> : <input
                  className="pill-input"
                  type="text"
                  value={value}
                  aria-label={`Modèle ${index + 1}`}
                  spellCheck
                  onChange={(event) => setCalliFieldAt(index, event.target.value)}
                />}
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
          live={liveTcf}
          scored={evalMode}
          niveau={tcfNiveau}
          typeId={activeBlock.exerciseType}
          exercise={activeBlock.tcfExercise}
          bankId={activeBlock.tcfBankId}
          shownId={activeSheet?.blocks[safeBlockIndex]?.items.find((item) => item.tcfExerciseId)?.tcfExerciseId}
          questionCount={activeBlock.tcfQuestionCount}
          fallbackExercise={renderedExercise ?? tcfSupportExercise(activeSheet?.blocks[safeBlockIndex]?.items)}
          onReroll={() => onRegenerateBlock?.(safeBlockIndex)}
          onChange={(patch) => updatePage(patch)}
        />
      ) : null}
      {grammarSelection ? (
        <GrammarEditor key={arithmeticId} selection={grammarSelection} activityId={arithmeticId}
          fields={transientFields} writeField={onTransientField}
          onRegenerate={grammarCanRegenerate ? (id) => onRegenerateBlock?.(safeBlockIndex, undefined, id) : undefined}
          onChange={(grammarSnapshot) => updatePage({ grammarSnapshot, libreItems: undefined, libreInstruction: undefined })} />
      ) : isGrammaireExercise ? (
        <TcfExerciseEditor
          variant="grammaire"
          live={liveTcf}
          scored={evalMode}
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
      {/* Un seul éditeur générique — évite le doublon (ex. domaines nombres). */}
      {!isTpmLike &&
      !isNumberLibreDomain &&
      !isPhraseDomain &&
      !isCalliDomain &&
      !isJeuxDomain &&
      !isTcf &&
      !isGrammaireExercise &&
      !theory &&
      !textExercise &&
      !letterGrid &&
      !logic &&
      !phraseOrder &&
      !syllableContent &&
      !listenContent &&
      !syllableMatchContent &&
      !soutienPhrases &&
      !audioOrderContent &&
      soutienKind !== 'mots' &&
      soutienKind !== 'completer' &&
      !(isDroites || isConstruire) ? (
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
      ) : null}
    </>
  )
}

export function LibrePanelHeader({ history, onClose }: {
  history: { canUndo: boolean; canRedo: boolean; undo: () => void; redo: () => void }
  onClose: () => void
}) {
  return (
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
      <h3>Paramètres de l’activité <span>Mode libre</span></h3>
      <div className="libre-history" role="group" aria-label="Historique des modifications">
        <button type="button" className="side-tool-close" title="Annuler" aria-label="Annuler" disabled={!history.canUndo} onClick={history.undo}>
          <span aria-hidden="true">↶</span>
        </button>
        <button type="button" className="side-tool-close" title="Rétablir" aria-label="Rétablir" disabled={!history.canRedo} onClick={history.redo}>
          <span aria-hidden="true">↷</span>
        </button>
      </div>
    </div>
  )
}

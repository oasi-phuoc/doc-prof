import { isWordVocabType } from '@/grammaire/exercises/word-vocab'
import { grammarCoStatements } from '@/grammaire/exercises/co-true-false'
import { mathTheoryTopic } from '@/math/theory-lessons'
import { isMathProblemHelpType } from '@/math/problem-help'
import { grammarOrderHasSentenceFilters } from '@/grammaire/curriculum/types'
import { TcfCeFormatControl, TcfCeTextFontControl } from './TcfCeFormatControl'
import { PhrasePolarityControl } from './PhrasePolarityControl'
import {PhraseFormControls} from './PhraseFormControls'
import { PhraseCategoryControls } from './PhraseCategoryControls'
import { PhraseImageLabelControls } from './PhraseImageLabelControls'
import { GrammarCoLevelControl } from './GrammarCoLevelControl'
import { GrammarLevelControl } from './GrammarLevelControl'
import { grammarBankFor } from '@/grammaire/curriculum/registry'
import { grammarEligibleCount } from '@/grammaire/curriculum/generate'
import { grammarCoThemeForType } from '@/grammaire/exercises/co-themes'
import { defaultGrammarCoLevel, grammarCoEntries, hasGrammarCoTheme } from '@/grammaire/exercises/co-bank'
import { isNegativePhraseTheme, isPhraseThemeId } from '@/francais/phrase-themes'
import { phraseSelection } from '@/francais/phrase-options'
import {newPictureSentence} from '@/francais/phrase-images'
import {blockItemsForConfig} from './sheet-items'
import {
  ACCESS_DOMAIN_OPTIONS,
} from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import { applyType, clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { FreeNumberControls } from './FreeNumberControls'
import { isLogistiqueDomain, isLogistiqueReferenceType, logistiqueSubthemes, logistiqueType, logistiqueTypeForSubtheme } from '@/logistique/catalog'
import { logistiqueEligibleCount } from '@/logistique/generate'
import { LogistiqueEvaluationFields } from './LogistiqueEvaluationFields'
import { exerciseTypeById } from '@/math/catalog'
import {
  centeredOrigin,
  isReperageCadrans,
  isReperageComposer,
  isReperageFormes,
  remapMarksToOrigin,
  resolveAxesGrid,
} from '@/math/coord-reperage'
import { QUAD_SHAPE_LABELS } from '@/math/mesures'
import { isPhraseLibreEditable, PhraseLibreEditor } from '@/francais/PhraseLibreEditor'
import { GameContentPanel } from '@/jeux/GameContentPanel'
import { DEFAULT_GAME_FONT_SIZE } from '@/jeux/font-size'
import type { GameTemplate } from '@/jeux/templates'
import { TcfCoAudioSlotsPicker, tcfCoAudioSlotCount } from '@/tcf/co-audio-slots'
import { TcfBankPicker } from '@/tcf/TcfExerciseEditor'
import { tcfMenuLabel, tcfSlotShownInMenu } from '@/tcf/catalog'
import { TcfTaggedExercisePicker, tcfTaggedSlotKind } from '@/tcf/tagged-picker'
import type { TcfNiveau } from '@/tcf/types'
import type { Dispatch, SetStateAction } from 'react'
import type {
  Difficulty,
  Domain,
  ExerciseBlock,
  Figure,
  PageConfig,
  PhraseVerbGroup,
  WorksheetPage,
} from '@/math/types'
import { resolveAlphaSelection } from '@/alphabetisation/themes'
import { resolveSoutienSelection } from '@/francais/soutien/themes'
import type { InstitutionalHeader } from '@/components/math/PrintDocumentChrome'

export type DomainThemeTypeFieldsProps = {
  isJeuxDomain: boolean
  isCalliDomain: boolean
  evalMode: boolean
  setEvalMode: Dispatch<SetStateAction<boolean>>
  institutional: InstitutionalHeader
  setInstitutional: Dispatch<SetStateAction<InstitutionalHeader>>
  pointsPerQuestion: number
  setPointsPerQuestion: Dispatch<SetStateAction<number>>
  sheetTotalPoints: number
  pages: PageConfig[]
  worksheets: WorksheetPage[]
  safeSheetIndex: number
  isTpmLike: boolean
  activePage: PageConfig
  changeDomain: (next: Domain) => void
  allowedDomains: Domain[]
  accessAccount: string | null
  isTcf: boolean
  tcfNiveau: TcfNiveau
  soutienSelection:
    | ReturnType<typeof resolveSoutienSelection>
    | ReturnType<typeof resolveAlphaSelection>
  activeBlock: ExerciseBlock
  changeTopic: (topic: string) => void
  available: Array<{ id: string; label: string }>
  isSoutienFr: boolean
  isAlphabetisation: boolean
  changeSoutienLetter: (letterId: string) => void
  changeSoutienSound: (soundId: string) => void
  isGrammaireDomain: boolean
  isLogique: boolean
  gramSubthemes: Array<{ id: string; label: string }>
  gramSubtheme: { id: string; label: string } | undefined
  changeGramSubtheme: (subId: string) => void
  isPhraseDomain: boolean
  isPhraseChart: boolean
  libreMode: boolean
  setVerbGroup: (next: PhraseVerbGroup) => void
  activeSheet: WorksheetPage | undefined
  safeBlockIndex: number
  updatePage: (patch: Partial<ExerciseBlock>) => void
  typeChoices: Array<{ id: string; label: string }>
  activeAsPage: PageConfig
  jeuxTemplate: GameTemplate | null | undefined
  jeuxText: string
  isReperage: boolean
  isVocabLearn: boolean
  isGramTheory: boolean
  isNumberLibreDomain: boolean
  isQuadType: boolean
  quadPool: Figure[]
}

export function DomainThemeTypeFields(p: DomainThemeTypeFieldsProps) {
  const {
    isJeuxDomain,
    isCalliDomain,
    evalMode,
    setEvalMode,
    institutional,
    setInstitutional,
    pointsPerQuestion,
    setPointsPerQuestion,
    sheetTotalPoints,
    pages,
    worksheets,
    safeSheetIndex,
    isTpmLike,
    activePage,
    changeDomain,
    allowedDomains,
    isTcf,
    tcfNiveau,
    soutienSelection,
    activeBlock,
    changeTopic,
    available,
    isSoutienFr,
    isAlphabetisation,
    changeSoutienLetter,
    changeSoutienSound,
    isGrammaireDomain,
    isLogique,
    gramSubthemes,
    gramSubtheme,
    changeGramSubtheme,
    isPhraseDomain,
    isPhraseChart,
    libreMode,
    setVerbGroup,
    activeSheet,
    safeBlockIndex,
    updatePage,
    typeChoices,
    activeAsPage,
    jeuxTemplate,
    jeuxText,
    isReperage,
    isVocabLearn,
    isGramTheory,
    isNumberLibreDomain,
    isQuadType,
    quadPool,
  } = p
  const showNumberRange = !libreMode && isNumberLibreDomain &&
    exerciseTypeById[activeBlock.exerciseType]?.supportsNumberRange !== false
  const readingQuestionCount = isGrammaireDomain && activeBlock.grammarPresentation === 'document-set'
    ? blockItemsForConfig(worksheets, pages.indexOf(activePage), safeBlockIndex)?.items
      .filter(item => item.grammar?.readingPart?.kind === 'question').length
    : undefined
  const logisticsDomain = isLogistiqueDomain(activePage.domain)
  const logisticsSubthemes = logisticsDomain ? logistiqueSubthemes(activeBlock.topic) : []
  const logisticsType = logistiqueType(activeBlock.exerciseType)
  const logisticsModule = logisticsType?.module
  const mixedActivity = logisticsDomain && evalMode && logisticsType && !isLogistiqueReferenceType(logisticsType.id)
  const subthemes = logisticsDomain ? logisticsSubthemes : gramSubthemes
  const subthemeId = logisticsDomain
    ? logisticsSubthemes.find((entry) => entry.code === logisticsModule)?.id
    : gramSubtheme?.id
  const changeSubtheme = (id: string) => {
    if (!logisticsDomain) {
      changeGramSubtheme(id)
      return
    }
    const type = logistiqueTypeForSubtheme(id, activeBlock.exerciseType)
    if (type?.domain !== activePage.domain || type.topic !== activeBlock.topic) return
    if (activeBlock.libreItems?.length && !window.confirm('Changer de sous-thème remplacera les modifications de cette activité. Continuer ?')) return
    updatePage(applyType(type, activeBlock))
  }
  const grammarCoTheme = grammarCoThemeForType(activeBlock.exerciseType)
  const grammarOrderBank=activeBlock.grammarLevel?grammarBankFor(activeBlock.exerciseType,activeBlock.grammarLevel):undefined
  const isGrammarOrder = isGrammaireDomain && activeBlock.grammarPresentation==='order' && (!grammarOrderBank||grammarOrderHasSentenceFilters(grammarOrderBank.units))
  const showPhraseParameters = (isPhraseDomain && !isPhraseChart) || isGrammarOrder
  const showGrammarCoLevel = grammarCoTheme && (activeBlock.exerciseType.endsWith('-co-theme') || hasGrammarCoTheme(grammarCoTheme.id))
  const grammarCoLevel = activeBlock.grammarCoLevel ?? (grammarCoTheme ? defaultGrammarCoLevel(grammarCoTheme.id) : 'A1')
  const grammarCoAudios = grammarCoTheme ? grammarCoEntries(grammarCoTheme.id,grammarCoLevel) : []
  const selectedGrammarCoAudio = grammarCoAudios.find(entry => entry.exercise.id === activeBlock.grammarCoAudioId) ?? grammarCoAudios[0]
  const availableTrueFalse = selectedGrammarCoAudio ? grammarCoStatements(selectedGrammarCoAudio.exercise.id).length : 0
  return (
    <>
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
                      if (!logisticsDomain && !institutional.documentTitle.trim()) {
                        setInstitutional((current) => ({ ...current, documentTitle: 'Évaluation' }))
                      }
                    }}
                  >
                    Évaluation
                  </button>
                </div>
                {evalMode && !isTpmLike && !isTcf && (
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
                {ACCESS_DOMAIN_OPTIONS.filter((domain) => allowedDomains.includes(domain.id)).map(
                  (domain) => (
                    <option value={domain.id} key={domain.id}>
                      {domain.label}
                    </option>
                  ),
                )}
              </SelectBox>
              {mixedActivity ? (
                <LogistiqueEvaluationFields key={logisticsType.id} type={logisticsType}
                  themes={available} activeBlock={activeBlock} updatePage={updatePage} />
              ) : isTpmLike ? null : (
                <SelectBox
                  label={isTcf ? 'Compétence' : 'Thème'}
                  value={soutienSelection?.theme.id ?? activeBlock.topic}
                  onChange={changeTopic}
                >
                  {available.map((topic) => (
                    <option value={topic.id} key={topic.id}>
                      {topic.label}
                    </option>
                  ))}
                </SelectBox>
              )}
              {(isSoutienFr || isAlphabetisation) && soutienSelection ? (
                <SelectBox
                  label={
                    isAlphabetisation && activePage.topic === 'alpha-phrases'
                      ? 'Histoire'
                      : isAlphabetisation && activePage.topic === 'alpha-mots'
                        ? 'Leçon'
                        : 'Lettre'
                  }
                  value={soutienSelection.letter.id}
                  onChange={changeSoutienLetter}
                >
                  {soutienSelection.theme.letters.map((letter) => (
                    <option value={letter.id} key={letter.id}>
                      {isAlphabetisation ? letter.label : letter.letterUpper}
                    </option>
                  ))}
                </SelectBox>
              ) : null}
              {!mixedActivity && (isGrammaireDomain || logisticsDomain) && subthemes.length > 0 ? (
                <SelectBox
                  label="Sous-thème"
                  value={subthemeId ?? subthemes[0]!.id}
                  onChange={changeSubtheme}
                >
                  {subthemes.map((sub) => (
                    <option value={sub.id} key={sub.id}>
                      {sub.label}
                    </option>
                  ))}
                </SelectBox>
              ) : null}
              {(isSoutienFr || isAlphabetisation) &&
              soutienSelection &&
              soutienSelection.letter.sounds.length > 1 ? (
                <div className="mode-toggle-block">
                  <b>Son</b>
                  <div
                    className={`mode-toggle is-${Math.min(4, soutienSelection.letter.sounds.length)}`}
                    role="group"
                    aria-label="Son de la lettre"
                  >
                    {soutienSelection.letter.sounds.map((sound) => (
                      <button
                        key={sound.id}
                        type="button"
                        className={soutienSelection.sound.id === sound.id ? 'active' : ''}
                        onClick={() => changeSoutienSound(sound.id)}
                      >
                        {sound.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {isPhraseDomain && !isPhraseChart ? (
                <div className="mode-toggle-block">
                  <b>Verbes</b>
                  <div className="mode-toggle is-4" role="group" aria-label="Groupe de verbes">
                    <button
                      type="button"
                      className={(!activeBlock.verbGroup || activeBlock.verbGroup === 'er' || activeBlock.verbGroup === 'libre') ? 'active' : ''}
                      onClick={() => setVerbGroup('er')}
                    >
                      1er
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'ir' ? 'active' : ''}
                      onClick={() => setVerbGroup('ir')}
                    >
                      2e
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'autres' ? 'active' : ''}
                      onClick={() => setVerbGroup('autres')}
                    >
                      3e
                    </button>
                    <button
                      type="button"
                      className={activeBlock.verbGroup === 'mixte' ? 'active' : ''}
                      onClick={() => setVerbGroup('mixte')}
                    >
                      Mixte
                    </button>
                  </div>
                </div>
              ) : null}
              {showPhraseParameters ? (
                <PhrasePolarityControl
                  value={activeBlock.phrasePolarity ?? (isPhraseDomain && isNegativePhraseTheme(activeBlock.topic) ? 'negative' : 'positive')}
                  canSelect={isGrammarOrder ? phrasePolarity => grammarEligibleCount({...activeBlock,phrasePolarity}) > 0 : undefined}
                  onChange={phrasePolarity => {
                    if (activeBlock.grammarLevel && activeBlock.libreItems?.length && !window.confirm('Ces filtres remplaceront les modifications manuelles de cet exercice. Continuer ?')) return
                    const countCap = isGrammarOrder
                      ? grammarEligibleCount({...activeBlock,phrasePolarity})
                      : activeBlock.count
                    updatePage({
                      ...clearLibreContentFreeze(),
                      phrasePolarity,
                      ...(activeBlock.grammarLevel?{grammarSnapshot:undefined}:{}),
                      count: isGrammarOrder ? Math.max(1, Math.min(activeBlock.count, countCap)) : activeBlock.count,
                      ...(isPhraseDomain ? { phraseItems: undefined, phraseInstruction: undefined } : {}),
                    })
                  }}
                />
              ) : null}
              {isPhraseDomain&&!isPhraseChart&&<PhraseFormControls sentenceType={activeBlock.phraseSentenceType??'declarative'} voice={activeBlock.phraseVoice??'active'} onSentenceType={phraseSentenceType=>updatePage({...clearLibreContentFreeze(),phraseSentenceType,verbGroup:activeBlock.verbGroup==='libre'?'er':activeBlock.verbGroup,phraseItems:undefined,phraseInstruction:undefined})} onVoice={phraseVoice=>updatePage({...clearLibreContentFreeze(),phraseVoice,verbGroup:activeBlock.verbGroup==='libre'?'er':activeBlock.verbGroup,phraseItems:undefined,phraseInstruction:undefined})}/>}
              {showPhraseParameters ? (
                <PhraseCategoryControls
                  value={activeBlock.phraseCategories}
                  onChange={phraseCategories => {
                    if (activeBlock.grammarLevel && activeBlock.libreItems?.length && !window.confirm('Ces filtres remplaceront les modifications manuelles de cet exercice. Continuer ?')) return
                    const cap = isPhraseThemeId(activeBlock.topic)
                      ? phraseSelection(activeBlock.topic, activeBlock.verbGroup ?? 'er', phraseCategories).frames.length
                      : isGrammarOrder
                        ? grammarEligibleCount({...activeBlock,phraseCategories})
                        : activeBlock.count
                    updatePage({
                      ...clearLibreContentFreeze(),
                      phraseCategories,
                      ...(activeBlock.grammarLevel?{grammarSnapshot:undefined}:{}),
                      count: Math.max(1, Math.min(activeBlock.count, cap)),
                      ...(isPhraseDomain ? { phraseItems: undefined, phraseInstruction: undefined } : {}),
                    })
                  }}
                />
              ) : null}
              {isPhraseDomain&&activeBlock.exerciseType.endsWith('-images')&&<PhraseImageLabelControls labels={activeBlock.phraseImageLabels} shown={activeBlock.phraseImageShownCategories} onLabels={phraseImageLabels=>updatePage({phraseImageLabels})} onShown={phraseImageShownCategories=>updatePage({phraseImageShownCategories})}/>}
              {isPhraseDomain&&activeBlock.exerciseType.endsWith('-images')&&!libreMode&&activeBlock.verbGroup!=='libre'&&<button type="button" onClick={()=>{const block=blockItemsForConfig(worksheets,activeSheet?.configIndex??safeSheetIndex,safeBlockIndex);updatePage({verbGroup:'libre',phraseItems:block?.items.length?block.items:[newPictureSentence()],phraseInstruction:block?.items.length?block.instruction:'Écrivez une phrase à partir des images. Ajoutez les mots nécessaires.'})}}>Personnaliser les images</button>}
              {!libreMode &&
              isPhraseDomain &&
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
                  onChangeItems={(phraseItems) => updatePage({ phraseItems,...(activeBlock.exerciseType.endsWith('-images')?{count:phraseItems.length}:{}) })}
                  onChangeInstruction={(phraseInstruction) => updatePage({ phraseInstruction })}
                />
              ) : null}
              {isTpmLike || typeChoices.length <= 1 ? null : (
              <SelectBox
                label={isTcf ? 'Exercice' : 'Type d’exercice'}
                value={activeBlock.exerciseType}
                onChange={(value) => {
                  const type = exerciseTypeById[value]
                  if (!type || value === activeBlock.exerciseType) return
                  if (logisticsDomain && activeBlock.libreItems?.length &&
                      !window.confirm('Changer de type remplacera les modifications de cette activité. Continuer ?')) return
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
                        ...clearLibreContentFreeze(),
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
                      ...clearLibreContentFreeze(),
                      exerciseType: value,
                      topic: type.topic,
                      track: type.track,
                      coordLibre: activeBlock.coordLibre,
                    })
                    return
                  }
                  const patch = applyType(type, activeBlock)
                  if (mixedActivity && !isLogistiqueReferenceType(value) && activeBlock.logistiqueSelection) {
                    patch.logistiqueSelection = { modules: activeBlock.logistiqueSelection.modules }
                  }
                  updatePage(patch)
                }}
              >
                {typeChoices
                  .filter((type) => !isTcf || tcfSlotShownInMenu(type.id, tcfNiveau))
                  .map((type) => {
                    const pending = logisticsDomain && logistiqueEligibleCount(type.id) === 0
                    return (
                      <option value={type.id} key={type.id} disabled={pending}>
                        {tcfMenuLabel(type.id, tcfNiveau) ?? type.label}{pending ? ' (à compléter)' : ''}
                      </option>
                    )
                  })}
              </SelectBox>
              )}
              {!libreMode && isJeuxDomain && jeuxTemplate ? (
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
              {isGrammaireDomain && showGrammarCoLevel ? (
                <GrammarCoLevelControl
                  value={grammarCoLevel}
                  a1Available={grammarCoEntries(grammarCoTheme.id,'A1').length>0}
                  a2Available={grammarCoEntries(grammarCoTheme.id,'A2').length>0}
                  onChange={grammarCoLevel=>updatePage({
                    ...clearLibreContentFreeze(),grammarCoLevel,grammarCoAudioId:undefined,grammarCoFormat:undefined,tcfExercise:undefined,
                    tcfBankId:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
                  })}
                />
              ) : null}
              {isGrammaireDomain ? <GrammarLevelControl block={activeBlock} readingQuestionCount={readingQuestionCount} onChange={updatePage}/> : null}
              {isGrammaireDomain && showGrammarCoLevel && grammarCoAudios.length>0 ? (
                <SelectBox label="Audio" value={activeBlock.grammarCoAudioId??grammarCoAudios[0]!.exercise.id}
                  onChange={grammarCoAudioId=>updatePage({
                    ...clearLibreContentFreeze(),grammarCoAudioId,grammarCoFormat:undefined,tcfExercise:undefined,
                    tcfBankId:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
                  })}>
                  {grammarCoAudios.map(entry=>(
                    <option key={entry.exercise.id} value={entry.exercise.id}>{entry.source.filename.replace('.mp3','').replace(/^piste_?/,'Piste ')}</option>
                  ))}
                </SelectBox>
              ) : null}
              {isGrammaireDomain && isWordVocabType(activeBlock.exerciseType) ? (
                <SelectBox label="Présentation" value={activeBlock.grammarVocabRecall ? 'recall' : 'learn'}
                  onChange={(value) => updatePage({ ...clearLibreContentFreeze(), grammarVocabRecall: value === 'recall' })}>
                  <option value="learn">Lire les mots</option>
                  <option value="recall">Retrouver les mots</option>
                </SelectBox>
              ) : null}
              {isGrammaireDomain && availableTrueFalse > 0 ? (
                <SelectBox label="Présentation" value={activeBlock.grammarCoFormat ?? 'questions'}
                  onChange={(value) => updatePage({
                    ...clearLibreContentFreeze(),
                    grammarCoFormat: value === 'true-false' ? 'true-false' : 'questions',
                    count: Math.min(activeBlock.count, value === 'true-false' ? availableTrueFalse : (selectedGrammarCoAudio?.exercise.questions.length ?? 1)),
                    tcfPageBreakAfter: undefined,
                  })}>
                  <option value="questions">Questions</option>
                  <option value="true-false">Vrai/Faux</option>
                </SelectBox>
              ) : null}
              {isTcf && activeBlock.exerciseType.startsWith('tcf-ce') ? <TcfCeTextFontControl value={activeBlock.tcfCeTextFont ?? 'arial'} onChange={tcfCeTextFont => updatePage({ tcfCeTextFont })} /> : null}
              {activePage.domain === 'tcf-csc' && activeBlock.exerciseType.startsWith('tcf-ce') ? (
                <TcfCeFormatControl value={activeBlock.tcfCeFormat ?? 'texte'}
                  onChange={(tcfCeFormat) => updatePage({ tcfCeFormat, libreItems: undefined })} />
              ) : null}
              {isTcf && tcfCoAudioSlotCount(activeBlock.exerciseType) != null ? (
                <TcfCoAudioSlotsPicker
                  niveau={tcfNiveau}
                  typeId={activeBlock.exerciseType}
                  slots={activeBlock.tcfAudioSlots}
                  questionCount={activeBlock.tcfQuestionCount}
                  pickMode={activeBlock.tcfAudioPickMode ?? 'aleatoire'}
                  onChange={(patch) => updatePage(patch)}
                />
              ) : null}
              {isTcf && tcfTaggedSlotKind(activeBlock.exerciseType) != null ? (
                <TcfTaggedExercisePicker
                  niveau={tcfNiveau}
                  typeId={activeBlock.exerciseType}
                  bankId={activeBlock.tcfBankId}
                  pickMode={activeBlock.tcfAudioPickMode ?? 'aleatoire'}
                  questionCount={activeBlock.tcfQuestionCount}
                  onChange={(patch) => updatePage(patch)}
                />
              ) : null}
              {isTcf &&
              tcfCoAudioSlotCount(activeBlock.exerciseType) == null &&
              tcfTaggedSlotKind(activeBlock.exerciseType) == null ? (
                <TcfBankPicker
                  niveau={tcfNiveau}
                  typeId={activeBlock.exerciseType}
                  scenario={activeBlock.tcfScenario}
                  bankId={activeBlock.tcfBankId}
                  edited={activeBlock.tcfExercise != null}
                  onChange={(patch) => updatePage(patch)}
                />
              ) : null}
              {isReperage ||
              isPhraseDomain ||
              isJeuxDomain ||
              isCalliDomain ||
              isVocabLearn ||
              isGramTheory ||
              mathTheoryTopic(activeBlock.exerciseType) ||
              isGrammaireDomain ||
              logisticsDomain ||
              isLogique ||
              isSoutienFr ||
              isAlphabetisation ||
              isTcf ||
              isTpmLike ? null : (
              <>
              <div className={`niveau-row${showNumberRange && activeBlock.numberLibre ? ' is-libre' : ''}`}>
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
                {showNumberRange ? (
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
              {showNumberRange && activeBlock.numberLibre ? (
                <FreeNumberControls activeBlock={activeBlock} updatePage={updatePage} />
              ) : null}
              </>
              )}
              {isNumberLibreDomain && isMathProblemHelpType(activeBlock.exerciseType) && (
                <button
                  type="button"
                  className="button small secondary"
                  aria-pressed={Boolean(activeBlock.problemHelp)}
                  onClick={() => updatePage({ problemHelp: !activeBlock.problemHelp })}
                >
                  {activeBlock.problemHelp ? 'Masquer l’aide illustrée' : 'Afficher l’aide illustrée'}
                </button>
              )}
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

    </>
  )
}

import { isWordVocabType } from '@/grammaire/exercises/word-vocab'
import { grammarCoStatements } from '@/grammaire/exercises/co-true-false'
import { hasSocieteAtlasQuestions } from '@/societe/atlas'
import { isSocieteCoType, isSocieteVocabType } from '@/societe/types'
import { isMathReferenceType } from '@/math/theory-lessons'
import { isTransformationExercise } from '@/math/coord-transformations'
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
import { ACCESS_DOMAIN_OPTIONS, ACTIVE_DOMAIN_OPTIONS } from '@/access'
import { SelectBox } from '@/components/generator/SelectBox'
import { applyType, clearLibreContentFreeze } from '@/components/generator/page-helpers'
import { DIFFICULTY_OPTIONS } from '@/math/difficulty'
import { isLogistiqueDomain, isLogistiqueReferenceType, logistiquePresentationFor, logistiqueSubthemes, logistiqueType, logistiqueTypeForSubtheme } from '@/logistique/catalog'
import { logistiqueEligibleCount } from '@/logistique/generate'
import { initialLogistiqueStory, logistiqueStorySelectionCompatible } from '@/logistique/evaluation'
import { LogistiqueEvaluationFields } from './LogistiqueEvaluationFields'
import { exerciseTypeById } from '@/math/catalog'
import { santeActivityLevel, santeLevelsForTopic } from '@/sante/catalog'
import {
  centeredOrigin,
  isReperageCadrans,
  isReperageComposer,
  isReperageFormes,
  remapMarksToOrigin,
  resolveAxesGrid,
} from '@/math/coord-reperage'
import { QUAD_SHAPE_LABELS } from '@/math/mesures'
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
import { supportsActivityDifficulty } from './activity-settings'
import { ceArtFor } from '@/tcf/ce-art'
import { blockItemsForConfig } from './sheet-items'

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
  worksheets: WorksheetPage[]
  pageIndex: number
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
  safeBlockIndex: number
  updatePage: (patch: Partial<ExerciseBlock>) => void
  typeChoices: Array<{ id: string; label: string }>
  activeAsPage: PageConfig
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
    worksheets,
    pageIndex,
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
    safeBlockIndex,
    updatePage,
    typeChoices,
    activeAsPage,
    isReperage,
    isVocabLearn,
    isGramTheory,
    isNumberLibreDomain,
    isQuadType,
    quadPool,
  } = p
  const readingQuestionCount = isGrammaireDomain && activeBlock.grammarPresentation === 'document-set'
    ? blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)?.items
      .filter(item => item.grammar?.readingPart?.kind === 'question').length
    : undefined
  const santeLevels = activePage.domain === 'santé' ? santeLevelsForTopic(activeBlock.topic) : []
  const santeLevel = santeActivityLevel(activeBlock.exerciseType) ?? santeLevels[0]
  const visibleTypeChoices = santeLevel
    ? typeChoices.filter((type) => santeActivityLevel(type.id) === santeLevel)
    : typeChoices
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
    if ((activeBlock.libreItems?.length || activeBlock.logistiqueEvaluation?.story) &&
      !window.confirm('Changer de sous-thème remplacera les modifications de cette activité. Continuer ?')) return
    updatePage(applyType(type, activeBlock))
  }
  const grammarCoTheme = grammarCoThemeForType(activeBlock.exerciseType)
  const societyListening = isSocieteCoType(activeBlock.exerciseType)
  const grammarOrderBank=activeBlock.grammarLevel?grammarBankFor(activeBlock.exerciseType,activeBlock.grammarLevel):undefined
  const isGrammarOrder = isGrammaireDomain && activeBlock.grammarPresentation==='order' && (!grammarOrderBank||grammarOrderHasSentenceFilters(grammarOrderBank.units))
  const showPhraseParameters = (isPhraseDomain && !isPhraseChart) || isGrammarOrder
  const showGrammarCoLevel = grammarCoTheme && (activeBlock.exerciseType.endsWith('-co-theme') || hasGrammarCoTheme(grammarCoTheme.id))
  const grammarCoLevel = activeBlock.grammarCoLevel ?? (grammarCoTheme ? defaultGrammarCoLevel(grammarCoTheme.id) : 'A1')
  const grammarCoAudios = grammarCoTheme ? grammarCoEntries(grammarCoTheme.id,grammarCoLevel) : []
  const ceSupport = isTcf && activeBlock.exerciseType.startsWith('tcf-ce')
    ? blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)?.items.find((item) => item.tcf?.kind === 'support')?.tcf
    : undefined
  const ceCanUseImage = ceSupport?.kind === 'support' && ceSupport.exercise.competence === 'CE' && Boolean(ceArtFor(ceSupport.exercise))
  const ceShowsImage = activePage.domain === 'tcf-csc' && ceCanUseImage && activeBlock.tcfCeFormat === 'image'
  const showDocumentPoints = evalMode && !isTpmLike && !isTcf && worksheets.some(({ blocks }) =>
    blocks.some(({ items, pointsPerQuestion }) => pointsPerQuestion == null && items.some((item) =>
      item.layout !== 'theory' && !item.noPoints && item.points == null)))
  const selectedGrammarCoAudio = grammarCoAudios.find(entry => entry.exercise.id === activeBlock.grammarCoAudioId) ?? grammarCoAudios[0]
  const availableTrueFalse = selectedGrammarCoAudio ? grammarCoStatements(selectedGrammarCoAudio.exercise).length : 0
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
                      const modules = activeBlock.logistiqueSelection?.modules ?? (logisticsType ? [logisticsType.module] : [])
                      if (!evalMode && logisticsType?.kind === 'maths' && !activeBlock.logistiqueEvaluation &&
                        !activeBlock.libreItems?.length && !logistiquePresentationFor(activeBlock) &&
                        logistiqueStorySelectionCompatible(modules, activeBlock.logistiqueSelection?.quantities)) {
                        updatePage({
                          logistiqueEvaluation: { mode: 'histoire', story: initialLogistiqueStory },
                          logistiqueSelection: { modules, quantities: Object.fromEntries(modules.map((code) => [code, 1])) },
                          count: modules.length,
                        })
                      }
                      setEvalMode(true)
                      if (!logisticsDomain && !institutional.documentTitle.trim()) {
                        setInstitutional((current) => ({ ...current, documentTitle: 'Évaluation' }))
                      }
                    }}
                  >
                    Évaluation
                  </button>
                </div>
                {showDocumentPoints && (
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
                    <small className="muted">Total document {sheetTotalPoints} pts</small>
                  </label>
                )}
              </div>
              )}

              {allowedDomains.length > 1 && <SelectBox label="Domaine" value={activePage.domain} onChange={(value) => changeDomain(value as Domain)}>
                {(activePage.domain === 'vocabulaire' ? ACCESS_DOMAIN_OPTIONS : ACTIVE_DOMAIN_OPTIONS)
                  .filter((domain) => allowedDomains.includes(domain.id)).map(
                  (domain) => (
                    <option value={domain.id} key={domain.id} disabled={domain.id === 'vocabulaire'}>
                      {domain.label}
                    </option>
                  ),
                )}
              </SelectBox>}
              {mixedActivity ? (
                <LogistiqueEvaluationFields key={logisticsType.id} type={logisticsType}
                  themes={available} activeBlock={activeBlock} updatePage={updatePage} defaultPoints={pointsPerQuestion}
                  items={blockItemsForConfig(worksheets, pageIndex, safeBlockIndex)?.items ?? []} />
              ) : isTpmLike || available.length < 2 ? null : (
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
              {(isSoutienFr || isAlphabetisation) && soutienSelection && soutienSelection.theme.letters.length > 1 ? (
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
              {!mixedActivity && (isGrammaireDomain || logisticsDomain) && subthemes.length > 1 ? (
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
              {santeLevels.length > 0 ? (
                <SelectBox
                  label="Niveau"
                  value={santeLevel ?? ''}
                  onChange={(level) => {
                    const next = typeChoices.find((type) => santeActivityLevel(type.id) === level)
                    const type = next && exerciseTypeById[next.id]
                    if (type) updatePage(applyType(type, activeBlock))
                  }}
                >
                  {santeLevels.map((level) => <option key={level} value={level}>{level}</option>)}
                </SelectBox>
              ) : null}
              {isTpmLike || visibleTypeChoices.length <= 1 ? null : (
              <SelectBox
                label={isTcf ? 'Exercice' : 'Type d’exercice'}
                value={activeBlock.exerciseType}
                onChange={(value) => {
                  const type = exerciseTypeById[value]
                  if (!type || value === activeBlock.exerciseType) return
                  const editedReference = (logisticsDomain || isMathReferenceType(activeBlock.exerciseType)) &&
                    (activeBlock.libreItems?.length || activeBlock.logistiqueEvaluation?.story)
                  const editedFigure = isTransformationExercise(activeBlock.exerciseType) && activeBlock.coordLibre && activeBlock.coordMarks?.length
                  if ((editedReference || editedFigure) &&
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
                {visibleTypeChoices
                  .filter((type) => !isTcf || tcfSlotShownInMenu(type.id, tcfNiveau))
                  .map((type) => {
                    const pending = logisticsDomain && logistiqueEligibleCount(type.id) === 0
                    return (
                      <option value={type.id} key={type.id} disabled={pending && isLogistiqueReferenceType(type.id)}>
                        {tcfMenuLabel(type.id, tcfNiveau) ?? type.label}{pending ? ' (à compléter)' : ''}
                      </option>
                    )
                  })}
              </SelectBox>
              )}
              {isGrammaireDomain && showGrammarCoLevel ? (
                <GrammarCoLevelControl
                  value={grammarCoLevel}
                  a1Available={grammarCoEntries(grammarCoTheme.id,'A1').length>0}
                  a2Available={grammarCoEntries(grammarCoTheme.id,'A2').length>0}
                  onChange={grammarCoLevel=>updatePage({
                    ...clearLibreContentFreeze(),grammarCoLevel,grammarCoAudioId:undefined,tcfExercise:undefined,
                    tcfBankId:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
                  })}
                />
              ) : null}
              {isGrammaireDomain ? <GrammarLevelControl block={activeBlock} readingQuestionCount={readingQuestionCount} onChange={updatePage}/> : null}
              {isGrammaireDomain && showGrammarCoLevel && grammarCoAudios.length > 1 ? (
                <SelectBox label="Audio" value={activeBlock.grammarCoAudioId??grammarCoAudios[0]!.exercise.id}
                  onChange={grammarCoAudioId=>updatePage({
                    ...clearLibreContentFreeze(),grammarCoAudioId,tcfExercise:undefined,
                    tcfBankId:undefined,tcfFormModes:undefined,tcfPageBreakAfter:undefined,
                  })}>
                  {grammarCoAudios.map(entry=>(
                    <option key={entry.exercise.id} value={entry.exercise.id}>{entry.source.filename.replace('.mp3','').replace(/^piste_?/,'Piste ')}</option>
                  ))}
                </SelectBox>
              ) : null}
              {(isGrammaireDomain && isWordVocabType(activeBlock.exerciseType)) || isSocieteVocabType(activeBlock.exerciseType) ? (
                <SelectBox label="Présentation" value={activeBlock.grammarVocabRecall ? 'recall' : 'learn'}
                  onChange={(value) => updatePage({ ...clearLibreContentFreeze(), grammarVocabRecall: value === 'recall' })}>
                  <option value="learn">Lire les mots</option>
                  <option value="recall">Retrouver les mots</option>
                </SelectBox>
              ) : null}
              {hasSocieteAtlasQuestions(activeBlock.exerciseType) ? (
                <SelectBox label="Présentation" value={activeBlock.completionPresentation ?? 'choice'}
                  onChange={(value) => updatePage({ ...clearLibreContentFreeze(), completionPresentation: value === 'gap' ? 'gap' : 'choice' })}>
                  <option value="choice">QCM</option>
                  <option value="gap">Lacune</option>
                </SelectBox>
              ) : null}
              {(isGrammaireDomain && availableTrueFalse > 0) || societyListening ? (
                <SelectBox label="Présentation" value={activeBlock.grammarCoFormat ?? 'questions'}
                  onChange={(value) => updatePage({
                    ...clearLibreContentFreeze(),
                    grammarCoFormat: value === 'true-false' ? 'true-false' : 'questions',
                    count: societyListening ? activeBlock.count : Math.min(activeBlock.count, value === 'true-false' ? availableTrueFalse : (selectedGrammarCoAudio?.exercise.questions.length ?? 1)),
                    tcfPageBreakAfter: undefined,
                  })}>
                  <option value="questions">Questions</option>
                  <option value="true-false">Vrai ou faux</option>
                </SelectBox>
              ) : null}
              {libreMode && ceSupport && !ceShowsImage ? <TcfCeTextFontControl value={activeBlock.tcfCeTextFont ?? 'arial'} onChange={tcfCeTextFont => updatePage({ tcfCeTextFont })} /> : null}
              {activePage.domain === 'tcf-csc' && ceCanUseImage ? (
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
              {activePage.domain === 'santé' ||
              isReperage ||
              isPhraseDomain ||
              isJeuxDomain ||
              isCalliDomain ||
              isVocabLearn ||
              isGramTheory ||
              isMathReferenceType(activeBlock.exerciseType) ||
              isGrammaireDomain ||
              logisticsDomain ||
              isLogique ||
              isSoutienFr ||
              isAlphabetisation ||
              isTcf ||
              isTpmLike ||
              (!libreMode && (activeBlock.libreItems?.length || activeBlock.numberLibre)) ||
              !supportsActivityDifficulty(activeBlock.exerciseType, activeBlock.count) ? null : (
                <SelectBox label={activeBlock.libreItems?.length ? 'Niveau du prochain tirage' : 'Niveau'} value={activeBlock.difficulty ?? 'moyen'}
                  onChange={(value) => updatePage({ difficulty: value as Difficulty })}>
                  {DIFFICULTY_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                </SelectBox>
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

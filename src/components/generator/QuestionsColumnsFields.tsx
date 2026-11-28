import { mathTheoryTopic } from '@/math/theory-lessons'
import { mathGlossaryBank } from '@/math/glossary-banks'
import { isGuidedColumnType, isSingleColumnPractice, REAL_MAP_TYPE } from '@/math/guided-practice'
import { isFundamentalPractice, SHAPE_PRACTICE } from '@/math/fundamental-practice'
import { realMapPlan, realMapPlans } from '@/math/real-map-catalog'
import { isLogistiqueReferenceType, logistiquePresentationFor, logistiqueType } from '@/logistique/catalog'
import { logistiqueHasSummary, logistiqueModuleCapacities } from '@/logistique/generate'
import { SelectBox } from './SelectBox'
import { supportsActivityQuestionCount } from './activity-settings'
import { isSocieteType } from '@/societe/types'
import { isSanteType } from '@/sante/types'
import {
  blockPointsTotal,
  formatPointsLabel,
  isTpmConsignesType,
} from '@/tpm/test'
import { isAudioOnlyGrammarCo } from '@/grammaire/exercises/co-bank'
import { isTcmCfrConsignesType } from '@/tcm-cfr/test'
import { isTcmCscConsignesType } from '@/tcm-csc/test'
import { logiqueBankOptions } from '@/logique/generate'
import {
  isTcfConsignesType,
  tcfNiveauFromDifficulty,
  tcfSlotByTypeId,
} from '@/tcf/catalog'
import {
  tcfCoAudioSlotCount,
  tcfCoCanDifferentiatePoints,
  tcfCoComposeQuestionCount,
  tcfCoPointsRowLabel,
} from '@/tcf/co-audio-slots'
import { tcfPeTagsForSlot, TCF_PE_TAG_MOTS_CLES } from '@/tcf/content-tags'
import { TCF_PE_TEXTE_IMAGES_BLANK_PX } from '@/tcf/pe-defaults'
import {
  tcfCeCanDifferentiatePoints,
  tcfCeQuestionCountHint,
  tcfIsPeTaggedSlot,
} from '@/tcf/tagged-picker'
import { isOralComprehensionExercise } from '@/components/generator/page-helpers'
import { useEffect, useState } from 'react'
import type { ExerciseBlock, WorksheetPage } from '@/math/types'
import { SOUTIEN_LEVEL_FILTERS } from '@/francais/soutien/phrases-data'
import {
  clampInlineBlankPx,
  hasInlineBlank,
  INLINE_BLANK_PX_DEFAULT,
  INLINE_BLANK_PX_MAX,
  INLINE_BLANK_PX_MIN,
} from '@/tcf/inline-blank'

/** Total de formes CSC : la saisie reste libre, la valeur n’est retenue qu’entre 12 et 80. */
function CountIconTotalField({
  value,
  onChange,
}: {
  value: number | undefined
  onChange: (total: number | undefined) => void
}) {
  const [draft, setDraft] = useState(value == null ? '' : String(value))
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (!focused) setDraft(value == null ? '' : String(value))
  }, [focused, value])
  return (
    <input
      className="pill-input"
      type="number"
      inputMode="numeric"
      min={12}
      max={80}
      step={1}
      aria-label="Nombre total de formes dans le cadre"
      value={draft}
      placeholder="Au hasard"
      onFocus={() => setFocused(true)}
      onChange={(event) => {
        const raw = event.target.value
        setDraft(raw)
        if (raw.trim() === '') {
          onChange(undefined)
          return
        }
        const total = Number(raw)
        if (Number.isInteger(total) && total >= 12 && total <= 80) onChange(total)
      }}
      onBlur={(event) => {
        setFocused(false)
        const raw = event.currentTarget.value.trim()
        if (raw === '') {
          onChange(undefined)
          setDraft('')
          return
        }
        const total = Math.max(12, Math.min(80, Math.round(Number(raw) || 12)))
        onChange(total)
        setDraft(String(total))
      }}
    />
  )
}

/** Champ points : vide → `undefined` (effectif 1) ; sinon demi-points ≥ 0.5. */
function parsePointsInput(raw: string): number | undefined {
  const text = raw.trim().replace(',', '.')
  if (text === '') return undefined
  const n = Number(text)
  if (!Number.isFinite(n)) return undefined
  return Math.max(0.5, Math.min(20, Math.round(n * 2) / 2))
}

export type QuestionsColumnsFieldsProps = {
  libreMode: boolean
  activeBlock: ExerciseBlock
  updatePage: (patch: Partial<ExerciseBlock>) => void
  isTransform: boolean
  isReperage: boolean
  isSoutienLignes: boolean
  isSoutienMotsCount: boolean
  isSoutienRelier: boolean
  isSoutienCompleter: boolean
  isSoutienCols123: boolean
  isSoutienCols345: boolean
  isAlphaMotsCols: boolean
  isAlphaSyllabeTableCols: boolean
  isAlphaPrononcerCols: boolean
  hideColumnsOption: boolean
  isAlphabetisation: boolean
  soutienKind: string | undefined
  questionsInputOverflow: boolean
  bankOverflow: boolean
  bankQuestionCap: number | undefined
  questionsOverflow: boolean
  maxQuestions: number
  isPhraseChart: boolean
  isVocabLearn: boolean
  isVocabPool: boolean
  isGramTheory: boolean
  isGrammaireDomain: boolean
  isGrammaireExercise: boolean
  isLogique: boolean
  isJeuxDomain: boolean
  isCalliDomain: boolean
  isSoutienFr: boolean
  isTcf: boolean
  isTpmInfoPage: boolean
  isSoutienMots: boolean
  isSoutienMotsMeles: boolean
  isTpmLike: boolean
  evalMode: boolean
  activeSheet: WorksheetPage | undefined
  safeBlockIndex: number
  firstExerciseNo: number
  sheetTotalPoints: number
}

export function QuestionsColumnsFields(props: QuestionsColumnsFieldsProps) {
  const {
    libreMode,
    activeBlock,
    updatePage,
    isTransform,
    isReperage,
    isSoutienLignes,
    isSoutienMotsCount,
    isSoutienRelier,
    isSoutienCompleter,
    isSoutienCols123,
    isSoutienCols345,
    isAlphaMotsCols,
    isAlphaSyllabeTableCols,
    isAlphaPrononcerCols,
    hideColumnsOption,
    isAlphabetisation,
    soutienKind,
    questionsInputOverflow,
    bankOverflow,
    bankQuestionCap,
    questionsOverflow,
    maxQuestions,
    isPhraseChart,
    isVocabLearn,
    isVocabPool,
    isGramTheory,
    isGrammaireDomain,
    isGrammaireExercise,
    isLogique,
    isJeuxDomain,
    isCalliDomain,
    isSoutienFr,
    isTcf,
    isTpmInfoPage,
    isSoutienMots,
    isSoutienMotsMeles,
    isTpmLike,
    evalMode,
    activeSheet,
    safeBlockIndex,
    firstExerciseNo,
    sheetTotalPoints,
  } = props
  if (isSanteType(activeBlock.exerciseType)) return null
  const grammarAudioOnly = isAudioOnlyGrammarCo(activeBlock.exerciseType,activeBlock.grammarCoLevel,activeBlock.grammarCoAudioId)
  const questionMin = isTransform ? 3 : activeBlock.exerciseType === 'tcm-csc-ex14' ? 2 : 1
  const cscQuestionHint = activeBlock.exerciseType === 'tcm-csc-ex03' ? 'Nombres à entourer, 1 point chacun.'
    : activeBlock.exerciseType === 'tcm-csc-ex14' ? 'Segments à mesurer. Le tableau ajoute une colonne par segment.'
    : activeBlock.exerciseType === 'tcm-csc-ex15' ? 'Paires de points, 5 au plus.'
    : activeBlock.exerciseType === 'tcm-csc-ex17' ? 'Formes à nommer, 1 point chacune.'
    : activeBlock.exerciseType === 'tcm-csc-ex19' ? 'Formes dont on écrit les coordonnées.'
    : activeBlock.exerciseType === 'tcm-csc-ex20' ? 'Formes à placer, 1 point chacune.'
    : null
  const hideTcmCscColumns = activeBlock.exerciseType.startsWith('tcm-csc-') && !['tcm-csc-ex07', 'tcm-csc-ex10', 'tcm-csc-ex11'].includes(activeBlock.exerciseType)
  const grammarSituations=activeBlock.grammarPresentation==='scenario-set'
  const isMathGlossary = Boolean(mathGlossaryBank(activeBlock.exerciseType))
  const isAlphaPhraseOrder = soutienKind === 'ordre-phrases'
  const isAlphaWordGrid = soutienKind === 'lire-grille' || soutienKind === 'lire-cursive' || soutienKind === 'entourer'
  const sheetBlock = activeSheet?.blocks.find((block, index) => (block.sourceBlockIndex ?? index) === safeBlockIndex)
  const sheetItems = sheetBlock?.items ?? []
  const hasOuterColumns = sheetItems.length > 1 &&
    (!sheetItems.some(({ layout }) => layout === 'coord') || activeBlock.exerciseType === 'transformations-tracer-axes')
  const hasTcfQuestionColumns = sheetItems.some(({ tcf }) => tcf?.kind === 'qcm' || tcf?.kind === 'lignes')
  const sheetHasInlineBlank = sheetItems?.some((item) => {
    if (!item.tcf) return false
    if (item.tcf.kind === 'texte_images') return hasInlineBlank(item.tcf.texte)
    if (item.tcf.kind === 'lignes') {
      return hasInlineBlank(item.tcf.enonce)
    }
    return false
  })
  const peMotsClesSlot = tcfPeTagsForSlot(tcfSlotByTypeId[activeBlock.exerciseType]?.numero).includes(
    TCF_PE_TAG_MOTS_CLES,
  )
  const showInlineBlankWidth = libreMode && sheetHasInlineBlank &&
    ((isGrammaireExercise && !isGramTheory) || (isTcf && peMotsClesSlot))
  const logistics = logistiqueType(activeBlock.exerciseType)
  const isLogistiqueTheory = logistics?.kind === 'theorie'
  const theoryView = activeBlock.logistiqueTheoryView ?? 'complet'
  const hasSummary = isLogistiqueTheory && logistiqueHasSummary(activeBlock.exerciseType, activeBlock.logistiqueBankRevision)
  const presentation = logistiquePresentationFor(activeBlock)
  const supportsPresentation = (logistics?.kind === 'verification' || logistics?.kind === 'maths' || logistics?.kind === 'situation') &&
    !(evalMode && activeBlock.logistiqueEvaluation?.mode === 'histoire')
  const selectedModules = supportsPresentation
    ? (evalMode ? activeBlock.logistiqueSelection?.modules : undefined) ?? [logistics.module] : []
  const presentations = supportsPresentation ? ([
    ...(logistics.kind === 'verification' ? [
      { id: 'qcm', label: 'QCM à réponse unique' },
      { id: 'qcm-multiple', label: 'QCM à réponses multiples' },
      { id: 'vrai-faux', label: 'Vrai ou faux' },
      { id: 'associer-textes', label: 'Associations de termes et définitions' },
      { id: 'lignes-simples', label: 'Lignes simples' },
      { id: 'lignes-numerotees', label: 'Lignes numérotées' },
      { id: 'sans-liste', label: 'Texte à trous sans liste' },
      { id: 'avec-liste', label: 'Texte à trous avec liste' },
    ] as const : []),
    { id: 'tableau-donnees', label: 'Tableau de données à compléter' },
    { id: 'tableau-dates', label: 'Tableau de dates à compléter' },
    ...(logistics.kind !== 'maths' ? [
      { id: 'tableau-comparaison', label: 'Tableau de comparaison' },
      { id: 'tableau-classement', label: 'Classement par catégorie' },
      { id: 'tableau-ordre', label: 'Ordre des étapes' },
      { id: 'lire-document', label: 'Lecture de document professionnel' },
      { id: 'corriger-erreurs', label: 'Repérage et correction d’erreurs' },
    ] as const : []),
  ] as const).map(({ id, label }) => ({
    id, label, capacity: [...logistiqueModuleCapacities(
      logistics, selectedModules, activeBlock.logistiqueBankRevision, id,
    ).values()].reduce((total, stock) => total + stock, 0),
  })) : []
  return (
    <>
              {activeBlock.exerciseType === REAL_MAP_TYPE && (
                <>
                  <SelectBox label="Lieu du plan" value={realMapPlan(activeBlock.realMapId).id}
                    onChange={(value) => updatePage({ realMapId: realMapPlan(value).id, libreItems: undefined, libreInstruction: undefined })}>
                    {realMapPlans.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
                  </SelectBox>
                  <SelectBox label="Fond du plan" value={activeBlock.sionMapBackground ?? 'photo'}
                    onChange={(value) => updatePage({ sionMapBackground: value === 'annotated' || value === 'simplified' ? value : 'photo' })}>
                    <option value="photo">Photo aérienne réelle</option>
                    <option value="annotated">Photo avec routes et chemins</option>
                    <option value="simplified">Plan simplifié en noir et blanc</option>
                  </SelectBox>
                </>
              )}
              {supportsPresentation && (presentations.some(({ capacity }) => capacity > 0) || presentation) ? (
                <SelectBox label="Présentation des questions" value={presentation ?? 'questions'} onChange={(value) => {
                  const option = presentations.find(({ id }) => id === value)
                  const next = option?.id
                  if (next === presentation) return
                  if (activeBlock.libreItems?.length &&
                      !window.confirm('Changer de présentation remplacera le contenu libre de cette activité. Continuer ?')) return
                  const sameGaps = (presentation === 'sans-liste' || presentation === 'avec-liste') &&
                    (next === 'sans-liste' || next === 'avec-liste')
                  updatePage({
                    logistiqueGapMode: undefined,
                    logistiquePresentation: next,
                    libreItems: undefined,
                    libreInstruction: undefined,
                    ...(option && activeBlock.count > option.capacity ? { count: Math.max(1, option.capacity) } : {}),
                    ...(sameGaps ? {} : { tcfPageBreakAfter: undefined }),
                  })
                }}>
                  <option value="questions">Questions habituelles</option>
                  {presentations.map(({ id, label, capacity }) => (
                    <option key={id} value={id} disabled={!capacity}>{label}{!capacity ? ' (indisponible)' : ''}</option>
                  ))}
                </SelectBox>
              ) : null}
              {!supportsActivityQuestionCount(activeBlock.exerciseType, questionMin, maxQuestions) ||
              activeBlock.grammarPresentation==='document-set' || grammarAudioOnly || isPhraseChart ||
              isVocabLearn ||
              isGramTheory ||
              mathTheoryTopic(activeBlock.exerciseType) ||
              isSocieteType(activeBlock.exerciseType) ||
              isLogistiqueReferenceType(activeBlock.exerciseType) ||
              (evalMode && activeBlock.logistiqueSelection &&
                (!activeBlock.logistiqueSelection.modules.length || activeBlock.logistiqueSelection.quantities)) ||
              isJeuxDomain ||
              isCalliDomain ||
              isSoutienMots ||
              isTcf ||
              isTpmInfoPage ||
              isSoutienMotsMeles ? null : (
              <label className="select-shell">
                <span>
                  {grammarSituations?'SITUATIONS':isTransform
                    ? 'Sommets'
                    : isReperage
                      ? 'Questions'
                      : isSoutienLignes
                        ? 'Lignes'
                        : isSoutienMotsCount
                          ? 'Mots'
                          : isMathGlossary ? 'Notions' : isAlphaPhraseOrder ? 'Phrases' : isAlphaWordGrid ? 'Grilles' : 'QUESTIONS'}
                </span>
                <input
                  className={`pill-input${questionsInputOverflow ? ' is-overflow' : ''}`}
                  aria-label={
                    isTransform ? 'Nombre de sommets' : grammarSituations?'Nombre de situations':isSoutienLignes
                      ? 'Nombre de lignes'
                      : isSoutienMotsCount
                        ? 'Nombre de mots'
                        : isMathGlossary ? 'Nombre de notions' : isAlphaPhraseOrder ? 'Nombre de phrases'
                          : isAlphaWordGrid ? 'Nombre de grilles' : 'Nombre de questions'
                  }
                  aria-invalid={questionsInputOverflow}
                  title={
                    bankOverflow
                      ? activeBlock.grammarLevel ? `Ces paramètres permettent ${bankQuestionCap} ${grammarSituations?'situations':'questions'}.` : `La banque de cet enregistrement ne contient que ${bankQuestionCap} questions.`
                      : questionsOverflow
                        ? 'Le contenu dépasse la place disponible. Réduisez le nombre ou ajoutez une page.'
                        : undefined
                  }
                  type="number"
                  min={questionMin}
                  max={maxQuestions}
                  step={1}
                  value={activeBlock.count}
                  onChange={(event) => {
                    const next = Math.max(
                      questionMin,
                      Math.min(maxQuestions, Math.trunc(Number(event.target.value)) || questionMin),
                    )
                    updatePage({ count: next })
                  }}
                />
                {cscQuestionHint ? <small className="muted">{cscQuestionHint}</small> : null}
                {soutienKind === 'lettres' ? (
                  <small className="muted">
                    Nombre de lignes du tableau (8 lettres par ligne, max. 15 · défaut 5).
                  </small>
                ) : null}
                {soutienKind === 'syllabes' ? (
                  <small className="muted">
                    Lignes par bloc (script et Playwrite · 5 syllabes par ligne · défaut 3).
                  </small>
                ) : null}
                {isSoutienRelier ? (
                  <small className="muted">
                    Mots du type 1 uniquement (max. 16 · défaut 12 · 2 colonnes).
                  </small>
                ) : null}
                {isSoutienCompleter && !activeBlock.soutienCompleterLibre ? (
                  <small className="muted">
                    Nombre de mots à compléter (défaut 12 · 2 colonnes · max. 18).
                  </small>
                ) : null}
                {soutienKind === 'syllabe-son' ? (
                  <small className="muted">
                    Cartes (défaut 18 · mots ≥ 2 syllabes · max. 18 · audio téléchargeable).
                  </small>
                ) : null}
                {soutienKind === 'lettres-phrase' ? (
                  <small className="muted">
                    Nombre de phrases (défaut 8 · max. 16). Téléchargez le JSON pour corriger.
                  </small>
                ) : null}
                {soutienKind === 'determinants' ? (
                  <small className="muted">
                    Nombre de phrases (défaut 8 · max. 16) — mots type 5 dans banque 9+12 ([sing]/[plur], ≥ 5 / ≥ 2).
                  </small>
                ) : null}
                {soutienKind === 'dictee' ? (
                  <small className="muted">Nombre de mots à écrire (défaut 8 · max. 16).</small>
                ) : null}
                {soutienKind === 'compter' ? (
                  <small className="muted">
                    Nombre de phrases (défaut 9 · max. 12) — banque commune, ≥ 3 fois le son.
                  </small>
                ) : null}
                {soutienKind === 'ordre' ? (
                  <small className="muted">
                    Nombre de phrases à remettre en ordre (défaut 9 · max. 12).
                  </small>
                ) : null}
                {soutienKind === 'lire' ? (
                  <small className="muted">
                    Nombre de phrases (défaut 19 · max. 20) — banque commune, ≥ 3 fois le son.
                  </small>
                ) : null}
                {soutienKind === 'associer-audio' ? (
                  <small className="muted">
                    Nombre de séries (4 QR + 4 mots cadrés · défaut 2 · max. 3).
                  </small>
                ) : null}
                {soutienKind === 'associer-image' ? (
                  <small className="muted">
                    Nombre de séries (4 QR + 4 images type 1 · défaut 2 · max. 3).
                  </small>
                ) : null}
                {bankOverflow ? (
                  <p className="questions-overflow-hint" role="status">
                    La banque ne contient que {bankQuestionCap} question
                    {(bankQuestionCap ?? 0) > 1 ? 's' : ''} {activeBlock.grammarLevel?'avec ces paramètres. Modifiez les filtres ou le nombre demandé.':'pour cet enregistrement. Réduisez le nombre ou générez une nouvelle fiche.'}
                  </p>
                ) : questionsOverflow && !activeBlock.continueOnNextPage ? (
                  <p className="questions-overflow-hint" role="status">
                    Les questions suivantes dépassent de la fiche. Réduisez le nombre, activez le
                    saut de page, ou ajoutez une page.
                  </p>
                ) : null}
              </label>
              )}
              {isTpmLike && evalMode && blockPointsTotal(sheetItems, 1) > 0 &&
              !(
                isTpmConsignesType(activeBlock.exerciseType) ||
                isTcmCfrConsignesType(activeBlock.exerciseType) ||
                isTcmCscConsignesType(activeBlock.exerciseType)
              ) ? (
                <label className="select-shell">
                  <span>Points par question</span>
                  <input
                    className="pill-input"
                    type="number"
                    inputMode="decimal"
                    min={0.5}
                    max={20}
                    step={0.5}
                    aria-label="Points par question de l’exercice sélectionné"
                    value={activeBlock.pointsPerQuestion ?? ''}
                    placeholder="1"
                    onChange={(event) => {
                      updatePage({ pointsPerQuestion: parsePointsInput(event.target.value) })
                    }}
                  />
                  <small className="muted">
                    Exercice{' '}
                    {activeSheet?.blocks?.[safeBlockIndex]?.exerciseIndex ?? firstExerciseNo + safeBlockIndex} :{' '}
                    {formatPointsLabel(
                      blockPointsTotal(
                        activeSheet?.blocks?.[safeBlockIndex]?.items ?? [],
                        activeBlock.pointsPerQuestion ?? 1,
                      ),
                    )}{' '}
                    · total du test : {formatPointsLabel(sheetTotalPoints)}
                  </small>
                </label>
              ) : null}
              {activeBlock.exerciseType === 'tcm-cfr-ex25' || activeBlock.exerciseType === 'tcm-cfr-ex26' ? (
                <div className="mode-toggle-block">
                  <b>Forme</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Afficher la forme">
                    <button
                      type="button"
                      className={activeBlock.geoFigureHelp !== false ? 'active' : undefined}
                      aria-pressed={activeBlock.geoFigureHelp !== false}
                      onClick={() => updatePage({ geoFigureHelp: true })}
                    >
                      Affichée
                    </button>
                    <button
                      type="button"
                      className={activeBlock.geoFigureHelp === false ? 'active' : undefined}
                      aria-pressed={activeBlock.geoFigureHelp === false}
                      onClick={() => updatePage({ geoFigureHelp: false })}
                    >
                      Masquée
                    </button>
                  </div>
                  <small className="muted">La forme sert d’aide. Vous pouvez la masquer.</small>
                </div>
              ) : null}
              {activeBlock.exerciseType === 'tcm-csc-ex01' || activeBlock.exerciseType === 'tcm-csc-ex02' || activeBlock.exerciseType === 'tcm-csc-ex03' ? (
                <div className="mode-toggle-block">
                  <b>Vitesse de Denise</b>
                  <div className="mode-toggle is-3" role="group" aria-label="Vitesse de la consigne">
                    {(['-25%', '-35%', '-50%'] as const).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        className={(activeBlock.deniseRate ?? '-25%') === rate ? 'active' : undefined}
                        aria-pressed={(activeBlock.deniseRate ?? '-25%') === rate}
                        onClick={() => updatePage({ deniseRate: rate })}
                      >
                        {rate.replace('-', '−').replace('%', ' %')}
                      </button>
                    ))}
                  </div>
                  <small className="muted">Vitesse de la consigne et de la lecture des nombres.</small>
                </div>
              ) : null}
              {activeBlock.exerciseType === 'tcm-csc-ex18' ? (
                <label className="select-shell">
                  <span>Taille des formes</span>
                  <select
                    aria-label="Taille des formes"
                    value={String(activeBlock.countShapeScale ?? 2)}
                    onChange={(event) => {
                      const scale = Number(event.target.value)
                      if (scale !== 1 && scale !== 2 && scale !== 3) return
                      const libreItems = activeBlock.libreItems?.map((item) =>
                        item.cscTask?.kind === 'large-count'
                          ? { ...item, cscTask: { ...item.cscTask, scale } }
                          : item,
                      )
                      updatePage({
                        countShapeScale: scale,
                        ...(libreItems ? { libreItems } : {}),
                      })
                    }}
                  >
                    <option value="1">Taille simple</option>
                    <option value="2">Taille double</option>
                    <option value="3">Taille triple</option>
                  </select>
                  <small className="muted">Le cadre ne change pas.</small>
                </label>
              ) : null}
              {activeBlock.exerciseType === 'tcm-csc-ex18' ? (
                <label className="select-shell">
                  <span>Formes dans le cadre</span>
                  <CountIconTotalField
                    value={activeBlock.countIconTotal}
                    onChange={(countIconTotal) => updatePage({ countIconTotal })}
                  />
                  <small className="muted">Nombre total de formes dessinées dans le cadre, de 12 à 80. Laissez vide pour un tirage.</small>
                </label>
              ) : null}
              {activeBlock.exerciseType === 'tcm-csc-ex16' ? (
                <>
                  {[0, 1].map((index) => (
                    <label className="select-shell" key={index}>
                      <span>Série {index + 1}</span>
                      <select
                        aria-label={`Série ${index + 1}`}
                        value={activeBlock.logiqueIds?.[index] ?? ''}
                        onChange={(event) => {
                          const next = [activeBlock.logiqueIds?.[0] ?? '', activeBlock.logiqueIds?.[1] ?? '']
                          next[index] = event.target.value
                          updatePage({ logiqueIds: next.some(Boolean) ? next : undefined })
                        }}
                      >
                        <option value="">Au hasard</option>
                        {logiqueBankOptions('logique-suite-graphique').map((choice) => {
                          const match = /p(\d+)-e(\d+)/.exec(choice.id)
                          const label = match ? `Planche ${Number(match[1])}, série ${Number(match[2])}` : choice.id
                          return <option key={choice.id} value={choice.id}>{label}</option>
                        })}
                      </select>
                    </label>
                  ))}
                </>
              ) : null}
              {isTcf &&
              evalMode &&
              !isTcfConsignesType(activeBlock.exerciseType) &&
              tcfIsPeTaggedSlot(activeBlock.exerciseType) ? (
                <div className="tcf-question-points">
                  <label className="select-shell">
                    <span>Points (total de l’exercice)</span>
                    <input
                      className="pill-input"
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      max={50}
                      step={0.5}
                      aria-label="Points total de l’exercice"
                      value={activeBlock.pointsPerQuestion ?? ''}
                      placeholder="1"
                      onChange={(event) => {
                        updatePage({
                          pointsPerQuestion: parsePointsInput(event.target.value),
                          tcfQuestionPoints: undefined,
                        })
                      }}
                    />
                  </label>
                  <label className="select-shell">
                    <span>Détail du barème</span>
                    <textarea
                      className="pill-input tcf-textarea"
                      rows={3}
                      value={activeBlock.tcfPointsDetail ?? ''}
                      placeholder="Ex. : 4 × 1 pt (une réplique) + 2 pts (formule de politesse)"
                      onChange={(event) =>
                        updatePage({ tcfPointsDetail: event.target.value || undefined })
                      }
                    />
                  </label>
                  <small className="muted">
                    Exercice{' '}
                    {activeSheet?.blocks?.[safeBlockIndex]?.exerciseIndex ??
                      firstExerciseNo + safeBlockIndex}{' '}
                    : {formatPointsLabel(activeBlock.pointsPerQuestion ?? 1)} · total du test :{' '}
                    {formatPointsLabel(sheetTotalPoints)}
                  </small>
                </div>
              ) : null}
              {isTcf &&
              evalMode &&
              !isTcfConsignesType(activeBlock.exerciseType) &&
              !tcfIsPeTaggedSlot(activeBlock.exerciseType) &&
              (tcfCoAudioSlotCount(activeBlock.exerciseType) != null ||
                tcfCeCanDifferentiatePoints(activeBlock.exerciseType)) ? (
                <div className="tcf-question-points">
                  {(() => {
                    const typeId = activeBlock.exerciseType
                    const isCo = tcfCoAudioSlotCount(typeId) != null
                    const n = isCo
                      ? tcfCoComposeQuestionCount(typeId, activeBlock.tcfQuestionCount)
                      : tcfCeQuestionCountHint(
                          typeId,
                          tcfNiveauFromDifficulty(activeBlock.difficulty),
                          activeBlock.tcfBankId,
                          activeBlock.tcfExercise,
                          activeBlock.tcfQuestionCount,
                        )
                    const canDiff = isCo
                      ? tcfCoCanDifferentiatePoints(typeId)
                      : tcfCeCanDifferentiatePoints(typeId)
                    const byImage = isCo && tcfCoPointsRowLabel(typeId, 0).startsWith('Image')
                    const pointsLabel = byImage ? 'Points par image' : 'Points par question'
                    const differentiated =
                      canDiff &&
                      Array.isArray(activeBlock.tcfQuestionPoints) &&
                      activeBlock.tcfQuestionPoints.length > 0
                    const uniform = activeBlock.pointsPerQuestion ?? 1
                    const exNo =
                      activeSheet?.blocks?.[safeBlockIndex]?.exerciseIndex ??
                      firstExerciseNo + safeBlockIndex
                    const totalHint = (
                      <small className="muted">
                        Exercice {exNo} :{' '}
                        {formatPointsLabel(
                          blockPointsTotal(
                            activeSheet?.blocks?.[safeBlockIndex]?.items ?? [],
                            uniform,
                          ),
                        )}{' '}
                        · total du test : {formatPointsLabel(sheetTotalPoints)}
                      </small>
                    )
                    return (
                      <>
                        {canDiff ? (
                          <div className="mode-toggle-block">
                            <b>{pointsLabel}</b>
                            <div
                              className="mode-toggle"
                              role="group"
                              aria-label={`${pointsLabel} : identiques ou différents`}
                            >
                              <button
                                type="button"
                                className={!differentiated ? 'active' : undefined}
                                aria-pressed={!differentiated}
                                onClick={() =>
                                  updatePage({
                                    tcfQuestionPoints: undefined,
                                    pointsPerQuestion: activeBlock.pointsPerQuestion,
                                  })
                                }
                              >
                                Identiques
                              </button>
                              <button
                                type="button"
                                className={differentiated ? 'active' : undefined}
                                aria-pressed={differentiated}
                                onClick={() => {
                                  if (n <= 0) return
                                  updatePage({
                                    tcfQuestionPoints: Array.from({ length: n }, () => uniform),
                                    pointsPerQuestion: activeBlock.pointsPerQuestion,
                                  })
                                }}
                              >
                                Différents
                              </button>
                            </div>
                          </div>
                        ) : (
                          <b>{pointsLabel}</b>
                        )}
                        {differentiated ? (
                          Array.from({ length: n }, (_, i) => {
                            const stored = activeBlock.tcfQuestionPoints?.[i]
                            const rowLabel = isCo
                              ? tcfCoPointsRowLabel(typeId, i)
                              : `Question ${i + 1}`
                            return (
                              <label className="select-shell" key={`q-pts-${i}`}>
                                <span>{rowLabel}</span>
                                <input
                                  className="pill-input"
                                  type="number"
                                  inputMode="decimal"
                                  min={0.5}
                                  max={20}
                                  step={0.5}
                                  aria-label={`Points de ${rowLabel.toLowerCase()}`}
                                  value={stored == null ? '' : stored}
                                  placeholder="1"
                                  onChange={(event) => {
                                    const nextPts = parsePointsInput(event.target.value)
                                    const next: Array<number | null> = Array.from(
                                      { length: n },
                                      (_, k) =>
                                        k === i
                                          ? (nextPts ?? null)
                                          : (activeBlock.tcfQuestionPoints?.[k] ?? uniform),
                                    )
                                    updatePage({ tcfQuestionPoints: next })
                                  }}
                                />
                              </label>
                            )
                          })
                        ) : (
                          <label className="select-shell">
                            <span className="visually-hidden">{pointsLabel}</span>
                            <input
                              className="pill-input"
                              type="number"
                              inputMode="decimal"
                              min={0.5}
                              max={20}
                              step={0.5}
                              aria-label={pointsLabel}
                              value={activeBlock.pointsPerQuestion ?? ''}
                              placeholder="1"
                              onChange={(event) => {
                                updatePage({
                                  pointsPerQuestion: parsePointsInput(event.target.value),
                                  tcfQuestionPoints: undefined,
                                })
                              }}
                            />
                          </label>
                        )}
                        {totalHint}
                      </>
                    )
                  })()}
                </div>
              ) : null}
              {isTcf &&
              evalMode &&
              !isTcfConsignesType(activeBlock.exerciseType) &&
              tcfCoAudioSlotCount(activeBlock.exerciseType) == null &&
              !tcfCeCanDifferentiatePoints(activeBlock.exerciseType) &&
              !tcfIsPeTaggedSlot(activeBlock.exerciseType) ? (
                <label className="select-shell">
                  <span>Points par question</span>
                  <input
                    className="pill-input"
                    type="number"
                    inputMode="decimal"
                    min={0.5}
                    max={20}
                    step={0.5}
                    aria-label="Points par question de l’exercice sélectionné"
                    value={activeBlock.pointsPerQuestion ?? ''}
                    placeholder="1"
                    onChange={(event) => {
                      updatePage({ pointsPerQuestion: parsePointsInput(event.target.value) })
                    }}
                  />
                  <small className="muted">
                    Exercice{' '}
                    {activeSheet?.blocks?.[safeBlockIndex]?.exerciseIndex ?? firstExerciseNo + safeBlockIndex} :{' '}
                    {formatPointsLabel(
                      blockPointsTotal(
                        activeSheet?.blocks?.[safeBlockIndex]?.items ?? [],
                        activeBlock.pointsPerQuestion ?? 1,
                      ),
                    )}{' '}
                    · total du test : {formatPointsLabel(sheetTotalPoints)}
                  </small>
                </label>
              ) : null}
              {isOralComprehensionExercise(activeBlock.exerciseType) ||
              activeBlock.exerciseType.includes('-com-ecrite') ? (
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
                          ? 'Un bloc page ajoute une feuille sur le même bouton'
                          : 'Les questions au-delà de 4 passent sur une feuille du même bouton'
                      }
                    >
                      {isGramTheory ? 'Blocs page' : 'Suite auto'}
                    </button>
                  </div>
                  {activeBlock.continueOnNextPage ? (
                    <small className="muted">
                      {isGramTheory
                        ? 'La théorie tient sur une feuille. Un bloc page ajoute une feuille sur le même bouton.'
                        : 'Au-delà de 4 questions, une feuille s’ajoute sur le même bouton de page.'}
                    </small>
                  ) : null}
                </div>
              ) : null}
              {soutienKind === 'lettres-phrase' ||
              soutienKind === 'determinants' ||
              soutienKind === 'compter' ||
              soutienKind === 'lire' ? (
                <div className="mode-toggle-block">
                  <b>Niveau des phrases</b>
                  <div className="mode-toggle is-4" role="group" aria-label="Niveau des phrases">
                    {SOUTIEN_LEVEL_FILTERS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={(activeBlock.soutienLevel ?? 'all') === opt.id ? 'active' : ''}
                        onClick={() => updatePage({ soutienLevel: opt.id })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <small className="muted">
                    Tous = mélange A1 / A2 / B1 (A1 : 5–7 mots · A2 : 8–12 · B1 : 13–15).
                  </small>
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
              {isAlphaMotsCols ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Nombre de colonnes">
                    {[3, 4].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={(activeBlock.columns ?? 3) === value ? 'active' : ''}
                        onClick={() =>
                          updatePage({
                            columns: value,
                            ...(activeBlock.soutienMotsLibre ? {} : { count: value === 3 ? 9 : 12 }),
                          })
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  {!activeBlock.soutienMotsLibre ? (
                    <small className="muted">3 colonnes = 9 mots · 4 colonnes = 12 mots.</small>
                  ) : null}
                </div>
              ) : null}
              {isAlphaSyllabeTableCols ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-3" role="group" aria-label="Nombre de colonnes">
                    {[4, 5, 6].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={(activeBlock.columns ?? 5) === value ? 'active' : ''}
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {isAlphaPrononcerCols ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Nombre de colonnes">
                    {[1, 2].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={(activeBlock.columns ?? 2) === value ? 'active' : ''}
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {isSoutienCols123 &&
              !isAlphaMotsCols &&
              !isAlphaSyllabeTableCols &&
              !isAlphaPrononcerCols &&
              !hideColumnsOption ? (
                <div className="mode-toggle-block">
                  <b>Colonnes</b>
                  <div
                    className={`mode-toggle${soutienKind === 'ecouter' ? ' is-2' : ' is-3'}`}
                    role="group"
                    aria-label="Nombre de colonnes"
                  >
                    {(soutienKind === 'ecouter' ? [2, 3] : [1, 2, 3]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          (activeBlock.columns ??
                            (soutienKind === 'completer'
                              ? 2
                              : soutienKind === 'ecouter'
                                ? 2
                                : 3)) === value
                            ? 'active'
                            : ''
                        }
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
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
                        className={(activeBlock.columns ?? 4) === value ? 'active' : ''}
                        onClick={() => updatePage({ columns: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {isGrammaireExercise && !isGramTheory && !hideColumnsOption && hasOuterColumns && hasTcfQuestionColumns ? (
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
                </div>
              ) : null}
              {showInlineBlankWidth ? (
                <label className="select-shell">
                  <span>Longueur du trait</span>
                  <input
                    className="pill-input"
                    type="number"
                    inputMode="numeric"
                    min={INLINE_BLANK_PX_MIN}
                    max={INLINE_BLANK_PX_MAX}
                    step={5}
                    aria-label="Longueur du trait de réponse dans la phrase, en pixels"
                    value={clampInlineBlankPx(
                      activeBlock.inlineBlankPx ??
                        (peMotsClesSlot ? TCF_PE_TEXTE_IMAGES_BLANK_PX : undefined),
                    )}
                    onChange={(event) => {
                      const next = clampInlineBlankPx(Number(event.target.value))
                      // PE texte à images : toujours stocker (défaut 150 ≠ défaut grammaire 200).
                      if (peMotsClesSlot) {
                        updatePage({ inlineBlankPx: next })
                        return
                      }
                      updatePage({
                        inlineBlankPx: next === INLINE_BLANK_PX_DEFAULT ? undefined : next,
                      })
                    }}
                  />
                  <small className="muted">
                    Traits dans la phrase ({INLINE_BLANK_PX_MIN}–{INLINE_BLANK_PX_MAX} px ·
                    défaut{' '}
                    {peMotsClesSlot ? TCF_PE_TEXTE_IMAGES_BLANK_PX : INLINE_BLANK_PX_DEFAULT}
                    ). En QCM, le blanc reste « . . . ».
                  </small>
                </label>
              ) : null}
              {isLogistiqueTheory && (hasSummary || libreMode && theoryView === 'resume') && (
                <div className="mode-toggle-block">
                  <b>Version de la théorie</b>
                  <div className="mode-toggle is-2" role="group" aria-label="Version de la théorie">
                    {(['complet', 'resume'] as const).map((view) => (
                      <button
                        key={view}
                        type="button"
                        className={theoryView === view ? 'active' : ''}
                        aria-pressed={theoryView === view}
                        disabled={view === 'resume' && !hasSummary}
                        onClick={() => {
                          if (view === theoryView) return
                          if (activeBlock.libreItems?.length &&
                            !window.confirm('Changer de version et remplacer le contenu personnalisé de cette activité ?')) return
                          updatePage({
                            logistiqueTheoryView: view,
                            columns: 1,
                            libreItems: undefined,
                            libreInstruction: undefined,
                            tcfPageBreakAfter: undefined,
                          })
                        }}
                      >
                        {view === 'complet' ? 'Complet' : 'Résumé'}
                      </button>
                    ))}
                  </div>
                  {!hasSummary && <small className="muted">Résumé indisponible dans cette révision.</small>}
                </div>
              )}
              {!hasOuterColumns || isLogistiqueTheory ||
              isPhraseChart ||
              isVocabLearn ||
              isVocabPool ||
              isGramTheory ||
              mathTheoryTopic(activeBlock.exerciseType) ||
              isSingleColumnPractice(activeBlock.exerciseType) ||
              (isFundamentalPractice(activeBlock.exerciseType) && activeBlock.exerciseType !== SHAPE_PRACTICE) ||
              isGrammaireDomain ||
              isLogique ||
              isJeuxDomain ||
              isCalliDomain ||
              isSoutienFr ||
              isAlphabetisation ||
              isTcf ||
              isTpmInfoPage ||
              hideColumnsOption ||
              hideTcmCscColumns ||
              isSoutienCols123 ||
              isSoutienCols345 ||
              isAlphaMotsCols ||
              isAlphaSyllabeTableCols ||
              isAlphaPrononcerCols ? null : (
              <div className="mode-toggle-block">
                <b>Colonnes</b>
                <div className="mode-toggle is-3" role="group" aria-label="Nombre de colonnes">
                  {(isGuidedColumnType(activeBlock.exerciseType) || activeBlock.exerciseType === SHAPE_PRACTICE ? [1, 2] : [1, 2, 3]).map((value) => (
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

    </>
  )
}

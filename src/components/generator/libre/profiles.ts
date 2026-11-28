import { isCalligraphieType } from '@/calligraphie/generate'
import { isJeuxType } from '@/jeux/templates'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import { isGrammarTheoryType } from '@/francais/grammar-theory'
import { isTpfFamilyDomain, tcfSlotByTypeId } from '@/tcf/catalog'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { parseSoutienType } from '@/francais/soutien/kinds'
import { audioOrderKind } from '@/francais/soutien/audio-order'
import { isGrammaireExerciseType, isGrammaireTheoryType } from '@/grammaire/types'
import { isProtectedGrammarCo, type GrammarPresentation } from '@/grammaire/curriculum/types'
import { logistiqueType, isLogistiqueReferenceType } from '@/logistique/catalog'
import { isSocieteTheoryType, isSocieteType } from '@/societe/types'
import { isSanteTheoryType } from '@/sante/catalog'
import { isLogiqueType } from '@/logique/types'
import { isReperageCadrans, isReperageConstruire, isReperageDroites, isReperageFormes } from '@/math/coord-reperage'
import { isTransformationExercise } from '@/math/coord-transformations'
import { isAreaExercise, isPerimeterExercise, isVolumeExercise } from '@/math/mesures'
import { isMathReferenceType } from '@/math/theory-lessons'
import type { Domain } from '@/math/types'
import type { SheetFormat } from '../sheet-format'

const INLINE_TYPES = new Set([
  'addition-ligne', 'addition-trou', 'soustraction-ligne', 'soustraction-trou',
  'multiplication-ligne', 'multiplication-trou', 'division-ligne', 'division-trou',
])
const COLUMN_TYPES = new Set([
  'addition-colonne', 'addition-colonne-poser', 'soustraction-colonne', 'soustraction-colonne-poser',
  'multiplication-colonne', 'multiplication-colonne-poser', 'multiplication-2chiffres', 'multiplication-2chiffres-poser',
  'division-colonne', 'division-colonne-poser', 'decimaux-add-colonne', 'decimaux-add-colonne-poser',
  'decimaux-sub-colonne', 'decimaux-sub-colonne-poser', 'decimaux-mul-colonne', 'decimaux-mul-colonne-poser',
  'decimaux-div-colonne', 'decimaux-div-colonne-poser',
])
const CONVERSION_TYPES = new Set([
  'conversions-longueur', 'conversions-aire', 'conversions-volume',
  'conversions-capacite', 'conversions-masse', 'conversions-temps',
])
const NUMERIC_ORDER_TYPES = new Set(['nombres-comparer', 'nombres-ranger', 'decimaux-comparer', 'relatifs-comparer'])
const NUMBER_NOTATION_TYPES = new Set([
  'nombres-chiffres', 'nombres-lettres', 'nombres-position', 'nombres-decompose',
  'nombres-encadrer-10', 'nombres-encadrer-100', 'nombres-pair',
])

export function isInlineArithmetic(domain: Domain, exerciseType: string): boolean {
  return (domain === 'algèbre' || domain === 'tpm') && INLINE_TYPES.has(exerciseType)
}

export function liveEditorProfile(domain: Domain, exerciseType: string, format: SheetFormat, grammarPresentation?: GrammarPresentation) {
  const geometry = domain === 'géométrie' || domain === 'tpm'
  if (geometry && isPerimeterExercise(exerciseType)) return 'perimetre'
  if (geometry && isAreaExercise(exerciseType)) return 'aire'
  if (geometry && isVolumeExercise(exerciseType)) return 'volume'
  if (isInlineArithmetic(domain, exerciseType)) return 'calcul-en-ligne'
  if ((domain === 'algèbre' || domain === 'tpm') && COLUMN_TYPES.has(exerciseType)) return 'calcul-en-colonnes'
  if (geometry && CONVERSION_TYPES.has(exerciseType)) return 'conversion'
  if (domain === 'algèbre' && NUMERIC_ORDER_TYPES.has(exerciseType)) return 'ordre-numerique'
  if ((domain === 'algèbre' || domain === 'tpm') && NUMBER_NOTATION_TYPES.has(exerciseType) ||
    domain === 'tpm' && (exerciseType === 'tpm-decompose-99' || exerciseType === 'tpm-decompose-9999')) return 'notation-numerique'
  if ((domain === 'algèbre' || domain === 'tpm') && exerciseType === 'nombres-suite' ||
    domain === 'tpm' && ['tpm-suite', 'tpm-grandes-suites', 'tpm-suites-6'].includes(exerciseType) ||
    domain === 'tcm-csc' && ['tcm-csc-ex04', 'tcm-csc-ex05'].includes(exerciseType)) return 'suite-numerique'
  const logistics = logistiqueType(exerciseType)
  if (domain === 'grammaire' && isGrammaireTheoryType(exerciseType) ||
    domain === 'français' && isGrammarTheoryType(exerciseType) ||
    domain === 'santé' && isSanteTheoryType(exerciseType) ||
    (domain === 'algèbre' || geometry) && isMathReferenceType(exerciseType) ||
    domain === 'société' && (isSocieteTheoryType(exerciseType) || exerciseType.endsWith('-lexique')) ||
    logistics?.domain === domain && isLogistiqueReferenceType(exerciseType)) return 'theorie'
  if (domain === 'logique' && isLogiqueType(exerciseType)) return 'logique-visuelle'
  const wordKind = domain === 'alphabetisation' ? parseAlphaType(exerciseType)?.kind
    : domain === 'soutien-fr' ? parseSoutienType(exerciseType)?.kind : undefined
  if (wordKind === 'lettres' || wordKind === 'lettres-maj' || wordKind === 'lettres-min' ||
    wordKind === 'souligner-maj' || wordKind === 'souligner-min') return 'lettres-et-graphèmes'
  if (wordKind === 'syllabes' || wordKind === 'syllabes-cv' || wordKind === 'syllabes-long') return 'grille-syllabique'
  if (wordKind === 'dictee' || wordKind === 'dictee-mots') return 'dictee-de-mots'
  if (wordKind === 'lire' || wordKind === 'lire-phrases') return 'lecture-de-phrases'
  if (wordKind === 'ordre' || wordKind === 'ordre-phrases') return 'mots-dans-l-ordre'
  if (wordKind === 'compter') return 'sons-a-compter'
  if (wordKind === 'determinants') return 'determinants'
  if (wordKind === 'lettres-phrase') return 'lettres-dans-phrase'
  if (wordKind === 'relier') return 'syllabes-a-relier'
  if (wordKind === 'mots-meles') return 'mots-meles'
  if (audioOrderKind(wordKind)) return 'association-audio'
  if (wordKind === 'syllabe-son' || wordKind === 'syllabe-son-qr' || wordKind === 'syllabes-prononcer') return 'syllabes-audio'
  if (wordKind === 'ecouter' || wordKind === 'ecouter-image') return 'ecoute-de-mots'
  if (logistics?.domain === domain || domain === 'société' && isSocieteType(exerciseType)) return 'question-simple'
  if (domain === 'grammaire' && isGrammaireExerciseType(exerciseType)) {
    if (isProtectedGrammarCo(exerciseType)) return 'audio-grammaire'
    if (grammarPresentation) return 'grammaire-graduee'
  }
  if (isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[exerciseType]
    if (slot?.competence === 'CE') return 'document'
    if (slot?.competence === 'CO') return 'audio-qcm'
    if (slot?.competence === 'PE') return 'production-ecrite'
    if (slot?.competence === 'PO') return 'production-orale'
  }
  if (wordKind === 'mots') return 'mots-illustres'
  if (wordKind === 'completer') return 'mot-a-trou'
  if (domain === 'gattegno' && isPhraseLibreEditable(exerciseType)) return 'phrase'
  if (domain === 'tpm' && (NUMERIC_ORDER_TYPES.has(exerciseType) || exerciseType === 'tpm-comparer' || exerciseType === 'tpm-ranger') ||
    domain === 'tcm-csc' && ['tcm-csc-ex06', 'tcm-csc-ex07', 'tcm-csc-ex25'].includes(exerciseType) ||
    domain === 'tcm-cfr' && (exerciseType === 'tcm-cfr-ex03' || exerciseType === 'tcm-cfr-ex04')) return 'ordre-numerique'
  if (format === 'a4-portrait') {
    if (geometry && (isReperageConstruire(exerciseType) || isReperageDroites(exerciseType))) return 'questions-de-reperage'
    if (geometry && (isReperageFormes(exerciseType) || isReperageCadrans(exerciseType))) return 'points-de-reperage'
    if (geometry && isTransformationExercise(exerciseType)) return 'symetrie'
    if (domain === 'calligraphie' && isCalligraphieType(exerciseType)) return 'calligraphie'
    if (domain === 'jeux' && isJeuxType(exerciseType)) return 'cartes'
  }
  return null
}

type LiveEditorProfile = ReturnType<typeof liveEditorProfile>

export function isTcfLiveProfile(profile: LiveEditorProfile): boolean {
  return profile === 'document' || profile === 'audio-qcm' || profile === 'audio-grammaire' ||
    profile === 'production-ecrite' || profile === 'production-orale'
}

export function isCalculationProfile(profile: LiveEditorProfile): boolean {
  return profile === 'calcul-en-ligne' || profile === 'calcul-en-colonnes' || profile === 'conversion' ||
    profile === 'ordre-numerique' || profile === 'notation-numerique' || profile === 'suite-numerique'
}

export function isFigureMeasureProfile(profile: LiveEditorProfile): boolean {
  return profile === 'perimetre' || profile === 'aire' || profile === 'volume'
}

export function hasFlatRegeneration(profile: LiveEditorProfile): boolean {
  return isCalculationProfile(profile) || profile === 'logique-visuelle' || profile === 'question-simple' ||
    profile === 'mots-dans-l-ordre' || isFigureMeasureProfile(profile)
}

export function usesIndependentHalves(profile: LiveEditorProfile): boolean {
  return hasFlatRegeneration(profile) || isIndependentListProfile(profile) || profile === 'association-audio'
}

export function opensWithoutOverlay(profile: LiveEditorProfile): boolean {
  return isTcfLiveProfile(profile) || hasFlatRegeneration(profile) || profile === 'calligraphie' || profile === 'cartes' || profile === 'phrase' ||
    profile === 'mots-illustres' || profile === 'mot-a-trou' || profile === 'theorie' ||
    profile === 'question-simple' || profile === 'grammaire-graduee' || profile === 'questions-de-reperage' || profile === 'mots-dans-l-ordre' ||
    isIndependentListProfile(profile) || profile === 'association-audio' || profile === 'symetrie' || profile === 'points-de-reperage'
}

export function isWordListProfile(profile: LiveEditorProfile): boolean {
  return profile === 'lettres-et-graphèmes' || profile === 'grille-syllabique' ||
    profile === 'dictee-de-mots' || profile === 'lecture-de-phrases'
}

export function isIndependentListProfile(profile: LiveEditorProfile): boolean {
  return isWordListProfile(profile) || profile === 'syllabes-audio' || profile === 'sons-a-compter' ||
    profile === 'determinants' || profile === 'ecoute-de-mots' || profile === 'lettres-dans-phrase' ||
    profile === 'syllabes-a-relier' || profile === 'mots-meles'
}

export function writesNativePayload(profile: LiveEditorProfile, patch: object): boolean {
  if (isTcfLiveProfile(profile)) return Object.hasOwn(patch, 'tcfExercise')
  if (profile === 'calligraphie') return Object.hasOwn(patch, 'calliText')
  if (profile === 'cartes') return Object.hasOwn(patch, 'gameEntries') || Object.hasOwn(patch, 'gameText') ||
    Object.hasOwn(patch, 'gameSeriesName') || Object.hasOwn(patch, 'gameSource')
  if (profile === 'mots-illustres') return Object.hasOwn(patch, 'soutienMotsEntries')
  if (profile === 'mot-a-trou') return Object.hasOwn(patch, 'soutienCompleterEntries')
  if (profile === 'questions-de-reperage') return Object.hasOwn(patch, 'coordQuestionsLibre')
  if (profile === 'points-de-reperage') return Object.hasOwn(patch, 'coordMarks') || Object.hasOwn(patch, 'coordLibre')
  if (profile === 'symetrie') return Object.hasOwn(patch, 'coordMarks')
  return profile === 'phrase' && (Object.hasOwn(patch, 'phraseItems') || Object.hasOwn(patch, 'phraseInstruction'))
}

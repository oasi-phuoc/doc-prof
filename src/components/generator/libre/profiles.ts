import { isCalligraphieType } from '@/calligraphie/generate'
import { isJeuxType } from '@/jeux/templates'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import { isTpfFamilyDomain, tcfSlotByTypeId } from '@/tcf/catalog'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { parseSoutienType } from '@/francais/soutien/kinds'
import { isGrammaireExerciseType, isGrammaireTheoryType } from '@/grammaire/types'
import type { GrammarPresentation } from '@/grammaire/curriculum/types'
import { logistiqueType, isLogistiqueReferenceType } from '@/logistique/catalog'
import { isSocieteType } from '@/societe/types'
import { isLogiqueType } from '@/logique/types'
import { isReperageConstruire, isReperageDroites } from '@/math/coord-reperage'
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

export function isInlineArithmetic(domain: Domain, exerciseType: string): boolean {
  return domain === 'algèbre' && INLINE_TYPES.has(exerciseType)
}

export function liveEditorProfile(domain: Domain, exerciseType: string, format: SheetFormat, grammarPresentation?: GrammarPresentation) {
  if (isInlineArithmetic(domain, exerciseType)) return 'calcul-en-ligne'
  if (domain === 'algèbre' && COLUMN_TYPES.has(exerciseType)) return 'calcul-en-colonnes'
  if (domain === 'géométrie' && CONVERSION_TYPES.has(exerciseType)) return 'conversion'
  if (domain === 'algèbre' && NUMERIC_ORDER_TYPES.has(exerciseType)) return 'ordre-numerique'
  const logistics = logistiqueType(exerciseType)
  if (domain === 'grammaire' && isGrammaireTheoryType(exerciseType) ||
    domain === 'société' && exerciseType.startsWith('societe-suisse-theorie-') ||
    logistics?.domain === domain && isLogistiqueReferenceType(exerciseType)) return 'theorie'
  if (domain === 'logique' && isLogiqueType(exerciseType)) return 'logique-visuelle'
  const wordKind = domain === 'alphabetisation' ? parseAlphaType(exerciseType)?.kind
    : domain === 'soutien-fr' ? parseSoutienType(exerciseType)?.kind : undefined
  if (wordKind === 'lettres' || wordKind === 'lettres-maj' || wordKind === 'lettres-min' ||
    wordKind === 'souligner-maj' || wordKind === 'souligner-min') return 'lettres-et-graphèmes'
  if (wordKind === 'syllabes' || wordKind === 'syllabes-cv' || wordKind === 'syllabes-long') return 'grille-syllabique'
  if (wordKind === 'dictee') return 'dictee-de-mots'
  if (wordKind === 'lire') return 'lecture-de-phrases'
  if (logistics?.domain === domain || domain === 'société' && isSocieteType(exerciseType)) return 'question-simple'
  if (format === 'a4-portrait') {
    if (domain === 'tpm' && (NUMERIC_ORDER_TYPES.has(exerciseType) || exerciseType === 'tpm-comparer' || exerciseType === 'tpm-ranger') ||
      domain === 'tcm-csc' && ['tcm-csc-ex06', 'tcm-csc-ex07', 'tcm-csc-ex25'].includes(exerciseType) ||
      domain === 'tcm-cfr' && (exerciseType === 'tcm-cfr-ex03' || exerciseType === 'tcm-cfr-ex04')) return 'ordre-numerique'
    if (domain === 'géométrie' && (isReperageConstruire(exerciseType) || isReperageDroites(exerciseType))) return 'questions-de-reperage'
    if (domain === 'calligraphie' && isCalligraphieType(exerciseType)) return 'calligraphie'
    if (domain === 'jeux' && isJeuxType(exerciseType)) return 'cartes'
    if (domain === 'gattegno' && isPhraseLibreEditable(exerciseType)) return 'phrase'
    if (domain === 'grammaire' && isGrammaireExerciseType(exerciseType) && grammarPresentation) return 'grammaire-graduee'
    if (wordKind === 'mots') return 'mots-illustres'
    if (wordKind === 'completer') return 'mot-a-trou'
    if (wordKind === 'ordre') return 'mots-dans-l-ordre'
    if (wordKind === 'syllabe-son' || wordKind === 'syllabe-son-qr' || wordKind === 'syllabes-prononcer') return 'syllabes-audio'
  }
  if (format === 'a4-portrait' && isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[exerciseType]
    if (slot?.competence === 'CE') return 'document'
    if (slot?.competence === 'CO' && slot.numero != null && slot.numero <= 4) return 'audio-qcm'
    if (slot?.competence === 'PE' && slot.numero === 4) return 'production-ecrite'
  }
  return null
}

type LiveEditorProfile = ReturnType<typeof liveEditorProfile>

export function isCalculationProfile(profile: LiveEditorProfile): boolean {
  return profile === 'calcul-en-ligne' || profile === 'calcul-en-colonnes' || profile === 'conversion' || profile === 'ordre-numerique'
}

export function hasFlatRegeneration(profile: LiveEditorProfile): boolean {
  return isCalculationProfile(profile) || profile === 'logique-visuelle' || profile === 'question-simple'
}

export function usesIndependentHalves(profile: LiveEditorProfile): boolean {
  return hasFlatRegeneration(profile) || isWordListProfile(profile)
}

export function opensWithoutOverlay(profile: LiveEditorProfile): boolean {
  return hasFlatRegeneration(profile) || profile === 'calligraphie' || profile === 'cartes' || profile === 'phrase' ||
    profile === 'mots-illustres' || profile === 'mot-a-trou' || profile === 'theorie' ||
    profile === 'question-simple' || profile === 'grammaire-graduee' || profile === 'questions-de-reperage' || profile === 'mots-dans-l-ordre' ||
    profile === 'syllabes-audio' || isWordListProfile(profile)
}

export function isWordListProfile(profile: LiveEditorProfile): boolean {
  return profile === 'lettres-et-graphèmes' || profile === 'grille-syllabique' ||
    profile === 'dictee-de-mots' || profile === 'lecture-de-phrases'
}

export function writesNativePayload(profile: LiveEditorProfile, patch: object): boolean {
  if (profile === 'calligraphie') return Object.hasOwn(patch, 'calliText')
  if (profile === 'cartes') return Object.hasOwn(patch, 'gameEntries') || Object.hasOwn(patch, 'gameText') ||
    Object.hasOwn(patch, 'gameSeriesName') || Object.hasOwn(patch, 'gameSource')
  if (profile === 'mots-illustres') return Object.hasOwn(patch, 'soutienMotsEntries')
  if (profile === 'mot-a-trou') return Object.hasOwn(patch, 'soutienCompleterEntries')
  if (profile === 'questions-de-reperage') return Object.hasOwn(patch, 'coordQuestionsLibre')
  return profile === 'phrase' && (Object.hasOwn(patch, 'phraseItems') || Object.hasOwn(patch, 'phraseInstruction'))
}

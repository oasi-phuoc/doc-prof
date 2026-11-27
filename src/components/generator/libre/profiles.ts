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

export function isInlineArithmetic(domain: Domain, exerciseType: string): boolean {
  return domain === 'algèbre' && INLINE_TYPES.has(exerciseType)
}

export function liveEditorProfile(domain: Domain, exerciseType: string, format: SheetFormat, grammarPresentation?: GrammarPresentation) {
  if (isInlineArithmetic(domain, exerciseType)) return 'calcul-en-ligne'
  if (format === 'a4-portrait') {
    if (domain === 'algèbre' && COLUMN_TYPES.has(exerciseType)) return 'calcul-en-colonnes'
    if (domain === 'géométrie' && CONVERSION_TYPES.has(exerciseType)) return 'conversion'
    if (domain === 'calligraphie' && isCalligraphieType(exerciseType)) return 'calligraphie'
    if (domain === 'jeux' && isJeuxType(exerciseType)) return 'cartes'
    if (domain === 'gattegno' && isPhraseLibreEditable(exerciseType)) return 'phrase'
    if (domain === 'grammaire' && isGrammaireTheoryType(exerciseType)) return 'theorie'
    if (domain === 'grammaire' && isGrammaireExerciseType(exerciseType) &&
      (grammarPresentation === 'choice' || grammarPresentation === 'gap')) return 'grammaire-lacune'
    if (logistiqueType(exerciseType)?.domain === domain) {
      return isLogistiqueReferenceType(exerciseType) ? 'theorie' : 'question-simple'
    }
    if (domain === 'société' && isSocieteType(exerciseType)) {
      return exerciseType.startsWith('societe-suisse-theorie-') ? 'theorie' : 'question-simple'
    }
    if (domain === 'logique' && isLogiqueType(exerciseType)) return 'logique-visuelle'
    const wordKind = domain === 'alphabetisation' ? parseAlphaType(exerciseType)?.kind
      : domain === 'soutien-fr' ? parseSoutienType(exerciseType)?.kind : undefined
    if (wordKind === 'mots') return 'mots-illustres'
    if (wordKind === 'completer') return 'mot-a-trou'
    if (wordKind === 'lettres' || wordKind === 'lettres-maj' || wordKind === 'lettres-min' ||
      wordKind === 'souligner-maj' || wordKind === 'souligner-min') return 'lettres-et-graphèmes'
    if (wordKind === 'syllabes' || wordKind === 'syllabes-cv' || wordKind === 'syllabes-long') return 'grille-syllabique'
    if (wordKind === 'dictee') return 'dictee-de-mots'
    if (wordKind === 'lire') return 'lecture-de-phrases'
  }
  if (format === 'a4-portrait' && isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[exerciseType]
    if (slot?.competence === 'CE') return 'document'
    if (slot?.competence === 'CO' && slot.numero != null && slot.numero <= 4) return 'audio-qcm'
  }
  return null
}

type LiveEditorProfile = ReturnType<typeof liveEditorProfile>

export function isCalculationProfile(profile: LiveEditorProfile): boolean {
  return profile === 'calcul-en-ligne' || profile === 'calcul-en-colonnes' || profile === 'conversion'
}

export function hasFlatRegeneration(profile: LiveEditorProfile): boolean {
  return isCalculationProfile(profile) || profile === 'logique-visuelle'
}

export function opensWithoutOverlay(profile: LiveEditorProfile): boolean {
  return hasFlatRegeneration(profile) || profile === 'calligraphie' || profile === 'cartes' || profile === 'phrase' ||
    profile === 'mots-illustres' || profile === 'mot-a-trou' || profile === 'theorie' ||
    profile === 'question-simple' || profile === 'grammaire-lacune' ||
    isWordListProfile(profile)
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
  return profile === 'phrase' && (Object.hasOwn(patch, 'phraseItems') || Object.hasOwn(patch, 'phraseInstruction'))
}

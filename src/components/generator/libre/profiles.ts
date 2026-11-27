import { isCalligraphieType } from '@/calligraphie/generate'
import { isJeuxType } from '@/jeux/templates'
import { isPhraseLibreEditable } from '@/francais/PhraseLibreEditor'
import { isTpfFamilyDomain, tcfSlotByTypeId } from '@/tcf/catalog'
import { parseAlphaType } from '@/alphabetisation/kinds'
import { parseSoutienType } from '@/francais/soutien/kinds'
import { isGrammaireTheoryType } from '@/grammaire/types'
import { logistiqueType, isLogistiqueReferenceType } from '@/logistique/catalog'
import { isSocieteType } from '@/societe/types'
import type { Domain } from '@/math/types'
import type { SheetFormat } from '../sheet-format'

const INLINE_TYPES = new Set([
  'addition-ligne', 'addition-trou', 'soustraction-ligne', 'soustraction-trou',
  'multiplication-ligne', 'multiplication-trou', 'division-ligne', 'division-trou',
])

export function isInlineArithmetic(domain: Domain, exerciseType: string): boolean {
  return domain === 'algèbre' && INLINE_TYPES.has(exerciseType)
}

export function liveEditorProfile(domain: Domain, exerciseType: string, format: SheetFormat) {
  if (isInlineArithmetic(domain, exerciseType)) return 'calcul-en-ligne'
  if (format === 'a4-portrait') {
    if (domain === 'calligraphie' && isCalligraphieType(exerciseType)) return 'calligraphie'
    if (domain === 'jeux' && isJeuxType(exerciseType)) return 'cartes'
    if (domain === 'gattegno' && isPhraseLibreEditable(exerciseType)) return 'phrase'
    if (domain === 'grammaire' && isGrammaireTheoryType(exerciseType)) return 'theorie'
    if (logistiqueType(exerciseType)?.domain === domain) {
      return isLogistiqueReferenceType(exerciseType) ? 'theorie' : 'question-simple'
    }
    if (domain === 'société' && isSocieteType(exerciseType)) {
      return exerciseType.startsWith('societe-suisse-theorie-') ? 'theorie' : 'question-simple'
    }
    const wordKind = domain === 'alphabetisation' ? parseAlphaType(exerciseType)?.kind
      : domain === 'soutien-fr' ? parseSoutienType(exerciseType)?.kind : undefined
    if (wordKind === 'mots') return 'mots-illustres'
    if (wordKind === 'completer') return 'mot-a-trou'
  }
  if (isTpfFamilyDomain(domain)) {
    const slot = tcfSlotByTypeId[exerciseType]
    if (slot?.competence === 'CE') return 'document'
    if (slot?.competence === 'CO' && slot.numero === 1) return 'audio-qcm'
  }
  return null
}

type LiveEditorProfile = ReturnType<typeof liveEditorProfile>

export function opensWithoutOverlay(profile: LiveEditorProfile): boolean {
  return profile === 'calligraphie' || profile === 'cartes' || profile === 'phrase' ||
    profile === 'mots-illustres' || profile === 'mot-a-trou' || profile === 'theorie' || profile === 'question-simple'
}

export function writesNativePayload(profile: LiveEditorProfile, patch: object): boolean {
  if (profile === 'calligraphie') return Object.hasOwn(patch, 'calliText')
  if (profile === 'cartes') return Object.hasOwn(patch, 'gameEntries') || Object.hasOwn(patch, 'gameText') ||
    Object.hasOwn(patch, 'gameSeriesName') || Object.hasOwn(patch, 'gameSource')
  if (profile === 'mots-illustres') return Object.hasOwn(patch, 'soutienMotsEntries')
  if (profile === 'mot-a-trou') return Object.hasOwn(patch, 'soutienCompleterEntries')
  return profile === 'phrase' && (Object.hasOwn(patch, 'phraseItems') || Object.hasOwn(patch, 'phraseInstruction'))
}

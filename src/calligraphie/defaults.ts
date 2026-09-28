/** Contenus démo et helpers de lignes pour la calligraphie. */
import { calliSizeById, type CalliSizeId } from './fonts'

export const DEFAULT_CALLI_WORDS = [
  'le',
  'la',
  'un',
  'une',
  'et',
  'est',
  'il',
  'elle',
  'nous',
  'vous',
  'ami',
  'école',
  'livre',
  'chat',
  'maison',
]

export const DEFAULT_CALLI_PHRASES = [
  'Le chat dort.',
  'Elle lit un livre.',
  'Nous allons à l’école.',
  'Bonjour les amis.',
  'Il fait beau.',
  'Léa mange une pomme.',
  'Noah boit de l’eau.',
  'Où est ton sac ?',
  'Papa lit le journal.',
]

/** Écart fixe entre deux blocs (mm). */
export const CALLI_BLOCK_GAP_MM = 4
/** Écart modèle / bande vide dans un bloc phrases (mm). */
export const CALLI_ENTRY_INNER_GAP_MM = 2
/** Padding sous le dernier bloc, avant le pied de page (mm). */
export const CALLI_FOOTER_PAD_MM = 8
/**
 * Hauteur utile pour les bandes (mm) : zone sous en-tête / titre / consigne,
 * avant le pied de page (page A4 297 mm − marges − chrome).
 */
export const CALLI_USABLE_HEIGHT_MM = 188

/** Fallback si la taille n’est pas connue (taille moyenne). */
export const DEFAULT_CALLI_WORD_COUNT = 10
export const DEFAULT_CALLI_PHRASE_COUNT = 5

/** Hauteur d’une bande à 4 lignes (= un bloc mots), en mm. */
export function calliFourLineBandHeightMm(unitMm: number): number {
  return 3 * unitMm
}

/**
 * Blocs phrases par défaut selon la taille.
 * Grand → 4 · Moyen → 5 · Petit → 6.
 */
export function defaultCalliPhraseCount(sizeId: string | undefined): number {
  if (sizeId === 'grand') return 4
  if (sizeId === 'petit') return 6
  return 5
}

/**
 * Nombre de blocs mots : même hauteur qu’une bande 4 lignes des phrases,
 * autant que la page en accueille (en-tête + pied compris).
 */
export function defaultCalliWordCount(sizeId: string | undefined): number {
  const unitMm = calliSizeById(sizeId).unitMm
  const band = calliFourLineBandHeightMm(unitMm)
  const usable = CALLI_USABLE_HEIGHT_MM - CALLI_FOOTER_PAD_MM
  const n = Math.floor((usable + CALLI_BLOCK_GAP_MM) / (band + CALLI_BLOCK_GAP_MM))
  return Math.max(1, n)
}

/** Plafond dur A4 (ajouts manuels au-delà du défaut). */
export function hardMaxCalliEntries(mode: 'same-line' | 'copy-below', sizeId: string | undefined): number {
  if (mode === 'copy-below') return defaultCalliPhraseCount(sizeId) + 1
  return defaultCalliWordCount(sizeId) + 2
}

/** Longueur max pour rester sur une seule ligne d’écriture cursive (espaces compris). */
export const MAX_CALLI_LINE_CHARS = 50

export function isCalliPhrasesType(typeId: string): boolean {
  return (
    typeId === 'calli-phrases' ||
    typeId === 'calli-4-lignes' ||
    typeId === 'calli-3-lignes' ||
    typeId.endsWith('-phrases')
  )
}

export function isCalliMotsType(typeId: string): boolean {
  return (
    typeId === 'calli-mots' ||
    typeId === 'calli-6-lignes' ||
    typeId === 'calli-5-lignes' ||
    typeId.endsWith('-mots')
  )
}

export function defaultCalliText(typeId: string, sizeId?: CalliSizeId | string): string {
  if (isCalliPhrasesType(typeId)) {
    return DEFAULT_CALLI_PHRASES.slice(0, defaultCalliPhraseCount(sizeId)).join('\n')
  }
  return DEFAULT_CALLI_WORDS.slice(0, defaultCalliWordCount(sizeId)).join('\n')
}

export function parseCalliLines(text: string | undefined): string[] {
  if (!text?.trim()) return []
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function joinCalliLines(lines: string[]): string {
  return lines.join('\n')
}

/** Normalise une liste de champs (garde les vides pour l’édition UI). */
export function normalizeCalliFields(fields: string[], minCount: number): string[] {
  const next = fields.map((f) => f)
  while (next.length < minCount) next.push('')
  return next
}

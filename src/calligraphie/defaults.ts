/** Contenus démo et helpers de lignes pour la calligraphie. */
import type { CalliSizeId } from './fonts'

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

/** Fallback si la taille n’est pas connue (taille moyenne). */
export const DEFAULT_CALLI_WORD_COUNT = 5
export const DEFAULT_CALLI_PHRASE_COUNT = 5

/**
 * Blocs par défaut selon la taille (phrases et mots partagent le carreau).
 * Grand → 4 · Moyen → 5 · Petit → 6.
 */
export function defaultCalliWordCount(sizeId: string | undefined): number {
  if (sizeId === 'grand') return 4
  if (sizeId === 'petit') return 6
  return 5
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

/** Plafond dur A4 (ajouts manuels au-delà du défaut). */
export function hardMaxCalliEntries(mode: 'same-line' | 'copy-below', sizeId: string | undefined): number {
  void mode
  if (sizeId === 'grand') return 5
  if (sizeId === 'petit') return 7
  return 6
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

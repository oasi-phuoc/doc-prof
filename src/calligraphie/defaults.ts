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
]

export const DEFAULT_CALLI_PHRASES = [
  'Le chat dort.',
  'Elle lit un livre.',
  'Nous allons à l’école.',
  'Bonjour les amis.',
]

/** Fallback si la taille n’est pas connue (taille moyenne). */
export const DEFAULT_CALLI_WORD_COUNT = 9
export const DEFAULT_CALLI_PHRASE_COUNT = 4

/**
 * Nombre de mots tirés par défaut selon la taille d’écriture.
 * Grand → 8 · Moyen → 9 · Petit → 10.
 * L’enseignant·e peut en ajouter au-delà.
 */
export function defaultCalliWordCount(sizeId: string | undefined): number {
  if (sizeId === 'grand') return 8
  if (sizeId === 'petit') return 10
  return 9
}

export function defaultCalliPhraseCount(sizeId: string | undefined): number {
  if (sizeId === 'grand') return 3
  if (sizeId === 'petit') return 5
  return 4
}

/** Plafond dur A4 (au-delà du défaut, pour les ajouts manuels). */
export function hardMaxCalliEntries(mode: 'same-line' | 'copy-below', sizeId: string | undefined): number {
  if (mode === 'copy-below') {
    if (sizeId === 'grand') return 6
    if (sizeId === 'petit') return 8
    return 7
  }
  if (sizeId === 'grand') return 14
  if (sizeId === 'petit') return 16
  return 15
}

/** Longueur max pour rester sur une seule ligne d’écriture cursive. */
export const MAX_CALLI_LINE_CHARS = 36

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

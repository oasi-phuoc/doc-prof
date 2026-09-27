/** Contenus démo et helpers de lignes pour la calligraphie. */

export const DEFAULT_CALLI_WORDS = [
  'le',
  'la',
  'un',
  'une',
  'et',
  'est',
]

export const DEFAULT_CALLI_PHRASES = [
  'Le chat dort.',
  'Elle lit un livre.',
  'Nous allons à l’école.',
  'Bonjour les amis.',
]

export const DEFAULT_CALLI_WORD_COUNT = 6
export const DEFAULT_CALLI_PHRASE_COUNT = 4

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

export function defaultCalliText(typeId: string): string {
  if (isCalliPhrasesType(typeId)) {
    return DEFAULT_CALLI_PHRASES.join('\n')
  }
  return DEFAULT_CALLI_WORDS.join('\n')
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

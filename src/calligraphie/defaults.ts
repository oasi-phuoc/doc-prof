/** Contenus démo originaux (pas de copie d’une fiche externe). */

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
]

export const DEFAULT_CALLI_PHRASES = [
  'Le chat dort.',
  'Elle lit un livre.',
  'Nous allons à l’école.',
  'Bonjour les amis.',
  'Il fait beau.',
]

export function defaultCalliText(typeId: string): string {
  if (typeId === 'calli-4-lignes' || typeId === 'calli-3-lignes') {
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

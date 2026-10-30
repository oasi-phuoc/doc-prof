/** Blanc dans l’énoncé : `___` (banques) ou `_ _ _` (saisie libre). */

/** Largeur par défaut du trait inline (px). */
export const INLINE_BLANK_PX_DEFAULT = 200
/** Largeur minimale réglable (px). */
export const INLINE_BLANK_PX_MIN = 25
/** Largeur maximale réglable (px). */
export const INLINE_BLANK_PX_MAX = 500

export function clampInlineBlankPx(value: number | undefined | null): number {
  if (value == null || !Number.isFinite(value)) return INLINE_BLANK_PX_DEFAULT
  return Math.max(INLINE_BLANK_PX_MIN, Math.min(INLINE_BLANK_PX_MAX, Math.round(value)))
}

export function hasInlineBlank(text: string): boolean {
  return /_{3,}|_ _ _/.test(text)
}

export function countInlineBlanks(text: string): number {
  return text.match(/_{3,}|_ _ _/g)?.length ?? 0
}

/** Réponses à poser dans les blancs : une seule case garde le texte entier (y compris « a / b »). */
export function answersForInlineBlanks(modele: string | undefined, blankCount: number): string[] {
  const raw = modele?.trim() ?? ''
  if (!raw || blankCount <= 0) return []
  if (blankCount === 1) return [raw]
  const parts = raw
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length === blankCount) return parts
  return [raw]
}

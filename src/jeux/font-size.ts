/** Taille des mots sur les grilles de cartes. */

export type GameFontSizeId = 'petit' | 'moyen' | 'grand'

export type GameFontSize = {
  id: GameFontSizeId
  label: string
  /** Corps de base (px) — Vocabulaire, Devinettes, Mémory, Loto. */
  px: number
  /** Corps compact (px) — Intrus et Dominos. */
  compactPx: number
}

export const GAME_FONT_SIZES: GameFontSize[] = [
  { id: 'petit', label: 'Petit', px: 20, compactPx: 15 },
  { id: 'moyen', label: 'Moyen', px: 30, compactPx: 20 },
  { id: 'grand', label: 'Grand', px: 40, compactPx: 25 },
]

export const DEFAULT_GAME_FONT_SIZE: GameFontSizeId = 'moyen'

const COMPACT_KINDS = new Set(['intrus', 'dominos'])

export function gameFontSizeById(id: string | undefined): GameFontSize {
  return GAME_FONT_SIZES.find((s) => s.id === id) ?? GAME_FONT_SIZES[1]!
}

export function gameFontSizePx(id: string | undefined, kind?: string): number {
  const size = gameFontSizeById(id)
  return kind && COMPACT_KINDS.has(kind) ? size.compactPx : size.px
}

export function usesCompactGameFont(typeId: string | undefined): boolean {
  return typeId === 'jeux-intrus' || typeId === 'jeux-dominos'
}

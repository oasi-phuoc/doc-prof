/** Taille des mots sur les grilles de cartes. */

export type GameFontSizeId = 'petit' | 'moyen' | 'grand'

export type GameFontSize = {
  id: GameFontSizeId
  label: string
  /** Corps de base des mots (px) — Vocabulaire, Devinettes, Mémory, Loto, Dominos. */
  px: number
  /** Corps Intrus (mots éparpillés, plus petit pour éviter les chevauchements). */
  intrusPx: number
}

export const GAME_FONT_SIZES: GameFontSize[] = [
  { id: 'petit', label: 'Petit', px: 20, intrusPx: 15 },
  { id: 'moyen', label: 'Moyen', px: 30, intrusPx: 20 },
  { id: 'grand', label: 'Grand', px: 40, intrusPx: 25 },
]

export const DEFAULT_GAME_FONT_SIZE: GameFontSizeId = 'moyen'

export function gameFontSizeById(id: string | undefined): GameFontSize {
  return GAME_FONT_SIZES.find((s) => s.id === id) ?? GAME_FONT_SIZES[1]!
}

export function gameFontSizePx(id: string | undefined, kind?: string): number {
  const size = gameFontSizeById(id)
  return kind === 'intrus' ? size.intrusPx : size.px
}

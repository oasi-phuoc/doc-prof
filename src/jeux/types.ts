/** Contenu saisi (ou démo) pour un template Jeux. */
export type GameEntry = {
  text: string
  imageSrc?: string
  clues?: string[]
  category?: string
  isIntrus?: boolean
  isTrue?: boolean
}

/** Carte imprimable produite par le générateur. */
export type GameCard = {
  id: string
  text?: string
  imageSrc?: string
  /** Lignes secondaires (indices, moitié domino…). */
  lines?: string[]
  /** Variante visuelle. */
  variant?:
    | 'default'
    | 'image'
    | 'word'
    | 'true'
    | 'false'
    | 'clue'
    | 'category'
    | 'intrus'
    | 'domino'
    | 'band'
    | 'family-head'
    | 'face'
  /** Badge / coin (V, F, n°, paire…). */
  badge?: string
  /** Moitié droite d’un domino. */
  textRight?: string
}

export type GameBoard = {
  title?: string
  cols: number
  rows: number
  cards: GameCard[]
  /** Style de grille. */
  kind?: 'cards' | 'loto' | 'bands' | 'plateau' | 'die'
}

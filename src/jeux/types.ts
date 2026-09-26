/** Contenu saisi (ou démo) pour un template Jeux. */
export type GameEntry = {
  text: string
  imageSrc?: string
  clues?: string[]
  /** Mots de la catégorie (Intrus : 4 mots + text = intrus). */
  words?: string[]
  category?: string
  isIntrus?: boolean
  isTrue?: boolean
}

/** Mot placé librement dans une carte Intrus. */
export type ScatterWord = {
  text: string
  rotate: number
  /** Position en % dans la carte. */
  x: number
  y: number
}

/** Carte imprimable produite par le générateur. */
export type GameCard = {
  id: string
  text?: string
  imageSrc?: string
  /** Lignes secondaires (indices, moitié domino…). */
  lines?: string[]
  /** Mots éparpillés (Intrus recto). */
  scatter?: ScatterWord[]
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
    | 'back'
    | 'scatter'
    | 'intrus-answer'
  /** Badge / coin (V, F, n°, paire…). */
  badge?: string
  /** Moitié droite d’un domino. */
  textRight?: string
  /** Couleur de fond (dos de carte mémory). */
  backColor?: string
  /** Cadre épais de série (verso Intrus). */
  frameColor?: string
}

/** Sous-grille (loto : 3 grilles par page). */
export type GamePanel = {
  title?: string
  cols: number
  rows: number
  cards: GameCard[]
  /** Libellé thème / série (verso loto). */
  themeLabel?: string
  themeSub?: string
}

export type GameBoard = {
  title?: string
  cols: number
  rows: number
  cards: GameCard[]
  /** Style de grille. */
  kind?:
    | 'cards'
    | 'loto'
    | 'bands'
    | 'plateau'
    | 'die'
    | 'devinettes'
    | 'memory'
    | 'loto-page'
    | 'loto-back'
    | 'loto-call'
    | 'intrus'
    | 'dominos'
    | 'tri'
  /** Couleur de dos (mémory verso), blanc si absent. */
  backColor?: string
  /** Plusieurs grilles encadrées sur une même feuille (loto). */
  panels?: GamePanel[]
  /** Thème / série du loto (verso). */
  themeLabel?: string
  /** Couleur du cadre de série (verso Intrus / Tri). */
  frameColor?: string
}

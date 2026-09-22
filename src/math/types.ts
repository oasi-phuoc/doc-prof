export type Domain = 'algèbre' | 'géométrie' | 'lecture'
export type PreviewMode = 'student' | 'answers'
export type Difficulty = 'facile' | 'moyen' | 'avance'
export type Figure =
  | 'rectangle'
  | 'square'
  | 'triangle'
  | 'cube'
  | 'circle'
  | 'parallelogram'
  | 'trapezoid'
  | 'rhombus'
  | 'cuboid'
  | 'cylinder'
  | 'cone'
  | 'sphere'

export type Layout =
  | 'inline'
  | 'column'
  | 'column-empty'
  | 'division-column'
  | 'text'
  | 'compare'
  | 'sequence'
  | 'select'
  | 'place-value'
  | 'geo'
  | 'coord'
  | 'algebra'
  | 'equation'
  | 'encadrement'
  | 'order'
  | 'letter-grid'

export type AlgebraGiven = { letter: string; value: number }

export type ArithOp = '+' | '−' | '×' | '÷'
export type MissingPos = 'a' | 'b' | 'result'

export type Topic = {
  id: string
  label: string
  domain: Domain
}

export type ExerciseType = {
  id: string
  topic: string
  label: string
  description: string
  instruction: string
  visual: 'ligne' | 'trou' | 'colonne' | 'colonne-vide' | 'texte' | 'geo' | 'suite'
  figure?: Figure
  preferredColumns?: number
}

export type FigureDims = {
  side?: number
  length?: number
  width?: number
  height?: number
  base?: number
  radius?: number
  top?: number
  bottom?: number
  a?: number
  b?: number
  c?: number
  unit?: string
  triangleKind?: 'equilateral' | 'isosceles' | 'scalene' | 'right'
}

export type DivisionStep = {
  bringDown: string
  product: string
  remainder: string
  /** Colonne de fin (0-based) sous le dividende pour aligner le produit. */
  endCol: number
}

export type MathItem = {
  layout: Layout
  answer: string
  prompt?: string
  figure?: Figure
  dims?: FigureDims
  op?: ArithOp
  a?: number
  b?: number
  c?: number
  result?: number
  missing?: MissingPos
  digitsA?: string[]
  digitsB?: string[]
  digitsResult?: string[]
  /** Produits partiels (× 2 chiffres) ou lignes de travail (division). */
  digitsPartials?: string[][]
  /** Retenues / emprunts alignés sur les colonnes (même largeur que digitsA). */
  carries?: string[]
  /** Chiffres du reste (division posée). */
  digitsRemainder?: string[]
  dividend?: number
  divisor?: number
  quotient?: number
  remainder?: number
  divisionSteps?: DivisionStep[]
  left?: string
  right?: string
  sequence?: string[]
  blankIndexes?: number[]
  options?: string[]
  labels?: string[]
  /** Grille vide à remplir (poser soi-même les nombres). */
  blankOperands?: boolean
  /** Point pour repérage / transformations. */
  point?: { x: number; y: number; label?: string }
  /** Image du point (corrigé ou second point). */
  pointImage?: { x: number; y: number; label?: string }
  /** Direction pour le rangement : ___ < ___ < ___ ou ___ > ___ > ___. */
  orderOp?: '<' | '>'
  calcAnswer?: string
  responseAnswer?: string
  /** Inconnues à afficher sur les lignes de réponse (équations). */
  unknowns?: string[]
  /** Lignes de développement (corrigé équations, style soutien-scolaire). */
  development?: string[]
  /** Opérations en marge gauche, alignées sur development. */
  operations?: string[]
  /** Afficher le système avec I / II et accolade. */
  systemBrace?: boolean
  /** Valeurs par case pour la décomposition (layout place-value). */
  placeParts?: string[]
}

export type PageConfig = {
  domain: Domain
  topic: string
  exerciseType: string
  difficulty: Difficulty
  count: number
  columns: number
  /**
   * Pour les problèmes : grille de brouillon 4×4 mm par question.
   * `true` = avec grille, `false` = cadre blanc seul. Index = n° de question.
   */
  problemDraftGrids?: boolean[]
}

export type WorksheetPage = PageConfig & {
  title: string
  instruction: string
  items: MathItem[]
  /** Valeurs partagées (ex. t = 3) pour les évaluations d'expressions. */
  givens?: AlgebraGiven[]
}

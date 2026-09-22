export type Domain = 'algèbre' | 'géométrie'
export type PreviewMode = 'student' | 'answers'
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
  a?: number
  b?: number
  c?: number
  unit?: string
}

export type DivisionStep = {
  bringDown: string
  product: string
  remainder: string
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
  /** Retenues / emprunts alignés sur les colonnes (même largeur que digitsA). */
  carries?: string[]
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
  calcAnswer?: string
  responseAnswer?: string
}

export type PageConfig = {
  domain: Domain
  topic: string
  exerciseType: string
  count: number
  columns: number
}

export type WorksheetPage = PageConfig & {
  title: string
  instruction: string
  items: MathItem[]
}

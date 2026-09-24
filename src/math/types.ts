export type Domain = 'français' | 'algèbre' | 'géométrie' | 'lecture' | 'phrase'

/** Catégories grammaire en couleur (Gattegno). */
export type PhraseCategory =
  | 'pronom'
  | 'verbe'
  | 'nom'
  | 'determinant'
  | 'adjectif'
  | 'adverbe'
  | 'preposition'
  | 'conjonction'
  | 'negation'
  | 'interjection'

export type PhraseToken = {
  text: string
  category: PhraseCategory
}

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
  | 'oval'

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
  | 'phrase-color'
  | 'phrase-order'
  | 'phrase-build'
  | 'phrase-write'
  | 'gattegno-chart'

export type CoordShape =
  | 'point'
  | 'circle'
  | 'triangle'
  | 'square'
  | 'diamond'
  | 'star'
  | 'plus'
  | 'heart'
  | 'pentagon'
  | 'hexagon'
  | 'oval'
  | 'crescent'
  | 'arrow'
  | 'cross'
  | 'trapezoid'
  | 'house'

export type CoordVariant = 'cells' | 'polygon' | 'polar' | 'axes'
export type CoordAxis = 'letters' | 'letters-y' | 'numeric'

export type CoordMark = {
  x: number
  y: number
  kind: CoordShape
  label?: string
  /** `answer` : visible seulement au corrigé. */
  reveal?: 'always' | 'answer'
}

export type CoordVertex = {
  x: number
  y: number
  label: string
}

export type CoordScene = {
  variant: CoordVariant
  cols: number
  rows: number
  axis: CoordAxis
  marks: CoordMark[]
  vertices?: CoordVertex[]
  /** Étendue du repère (−range à +range) pour le variant `axes`. */
  range?: number
  /** Pas de la grille (1 ou 0,5). */
  step?: number
  /** Droites colorées (repérage). */
  lines?: CoordLine[]
  /** Traits et polygones à construire (corrigé). */
  paths?: CoordPath[]
  /** Quadrillage fin type papier millimétré. */
  fineGrid?: boolean
}

export type CoordLineColor = 'violet' | 'orange' | 'green' | 'blue' | 'red' | 'muted' | 'rose'
export type CoordLineStroke = 'solid' | 'dashed' | 'dotted' | 'dashdot' | 'longdash' | 'dense' | 'doubledash'
export type CoordReply = 'pair' | 'text' | 'draw'

export type CoordPath = {
  id: string
  kind: 'line' | 'segment' | 'polygon'
  a?: number
  b?: number
  c?: number
  points?: Array<{ x: number; y: number }>
  stroke?: 'solid' | 'dashed'
}

export type CoordLine = {
  id: string
  name: string
  color: CoordLineColor
  stroke: CoordLineStroke
  /** Droite ax + by + c = 0. */
  a: number
  b: number
  c: number
}

export type CoordQuestion = {
  prompt: string
  answer: string
  kind?: CoordShape
  reply?: CoordReply
}

export type AlgebraGiven = { letter: string; value: number }

export type ArithOp = '+' | '−' | '×' | '÷'
export type MissingPos = 'a' | 'b' | 'result'

export type Topic = {
  id: string
  label: string
  domain: Domain
}

export type FrenchTrack = 'voc' | 'gram' | 'com'

export type ExerciseType = {
  id: string
  topic: string
  label: string
  description: string
  instruction: string
  visual: 'ligne' | 'trou' | 'colonne' | 'colonne-vide' | 'texte' | 'geo' | 'suite'
  figure?: Figure
  preferredColumns?: number
  /** Filtre Voc / Gram / Com du domaine français. */
  track?: FrenchTrack
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
  trapezoidKind?: 'rectangle' | 'isosceles' | 'scalene'
  /** Cote à trouver : affichée « ? » sur la figure. */
  ask?: 'side' | 'length' | 'width' | 'height' | 'radius' | 'a' | 'b' | 'c' | 'base' | 'top'
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
  /** Grille de repérage (formes, polygone ou polaire). */
  coordScene?: CoordScene
  /** Questions de lecture de coordonnées liées à coordScene. */
  coordQuestions?: CoordQuestion[]
  /** `place` : tableau vide côté élève, formes visibles au corrigé. */
  coordTask?: 'read' | 'place' | 'construct'
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
  /** Figure composée cotée (périmètre). */
  compositeScene?: CompositeScene
  /** Lignes « libellé : réponse » sans bordure (propriétés des figures). */
  propertyLines?: { label: string; answer: string }[]
  /** Conversion d’unités : valeur et unités de part et d’autre du signe =. */
  convert?: { value: string; from: string; to: string }
  /** Enregistrement à écouter (compréhension orale). */
  audioSrc?: string
  /** Mots étiquetés (grammaire en couleur). */
  tokens?: PhraseToken[]
  /** Séquence de pastilles (type 3). */
  pastilles?: PhraseCategory[]
  /** Nombre de lignes d’écriture (type 4). */
  writeLines?: number
  /** Variante du tableau Gattegno. */
  chartMode?: 'labels' | 'words' | 'outline'
}

export type CompositeLabel = {
  x: number
  y: number
  text: string
  anchor?: 'start' | 'middle' | 'end'
}

export type CompositeTick = {
  x: number
  y: number
  angle: number
  n: 1 | 2 | 3
}

export type CompositeRight = {
  x: number
  y: number
  ax: number
  ay: number
  bx: number
  by: number
}

export type CompositeScene = {
  outline: string
  helpers?: Array<{ d: string; dashed?: boolean }>
  labels: CompositeLabel[]
  ticks?: CompositeTick[]
  rights?: CompositeRight[]
}

export type ExerciseBlock = {
  topic: string
  exerciseType: string
  difficulty: Difficulty
  count: number
  columns: number
  /** Voc / Gram / Com — domaine français uniquement. */
  track?: FrenchTrack
  /**
   * Grille de brouillon (problèmes, équations, périmètres / aires / volumes).
   * `true` = avec grille, `false` = cadre blanc seul. Index = n° de question.
   */
  problemDraftGrids?: boolean[]
  /** Mode libre : l’enseignant·e compose le tableau de repérage. */
  coordLibre?: boolean
  coordCols?: number
  coordRows?: number
  coordAxis?: CoordAxis
  coordMarks?: CoordMark[]
  /** Étendue du repère à 4 cadrans (−n à +n). */
  coordRange?: number
}

export type PageConfig = ExerciseBlock & {
  domain: Domain
  /** Types d’exercices supplémentaires sur la même feuille A4. */
  extraBlocks?: ExerciseBlock[]
}

export type WorksheetDocument = {
  kind: 'oral' | 'written'
  title?: string
  text: string
  audioSrc?: string
}

export type WorksheetBlock = {
  exerciseIndex: number
  title: string
  instruction: string
  items: MathItem[]
  columns: number
  exerciseType: string
  givens?: AlgebraGiven[]
  document?: WorksheetDocument
  problemDraftGrids?: boolean[]
}

export type WorksheetPage = PageConfig & {
  title: string
  instruction: string
  items: MathItem[]
  blocks: WorksheetBlock[]
  /** Valeurs partagées (ex. t = 3) pour les évaluations d'expressions. */
  givens?: AlgebraGiven[]
}

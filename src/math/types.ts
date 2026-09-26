export type Domain = 'français' | 'algèbre' | 'géométrie' | 'lecture' | 'phrase' | 'jeux'

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
  | 'vocab-table'
  | 'vocab-match'
  | 'vocab-write'
  | 'theory'
  | 'card-grid'

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
/** Côté physique d’un carré du tableau, en millimètres. */
export type CoordCellMm = 3 | 4 | 5 | 6 | 8 | 10
/** Carrés des repères à cadrans / droites / construction. */
export type CoordAxesCellMm = 3 | 4 | 5
/** Carrés des tableaux de formes (lire / placer). */
export type CoordFormesCellMm = 6 | 8 | 10
/** Nombre de carrés pour une unité de graduation. */
export type CoordUnitSquares = 1 | 2

export type CoordMark = {
  x: number
  y: number
  kind: CoordShape
  label?: string
  /** `answer` : visible seulement au corrigé. */
  reveal?: 'always' | 'answer'
  /** Point donné : coordonnées affichées sur le tableau. */
  given?: boolean
  /** Afficher (x ; y) à côté du point. */
  showCoord?: boolean
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
  /** Étendue du repère (−range à +range) pour le variant `axes` (carré). */
  range?: number
  /** Demi-largeur en unités (repère rectangulaire). */
  rangeX?: number
  /** Demi-hauteur en unités (repère rectangulaire). */
  rangeY?: number
  /** Côté d’un carré, en millimètres (le tableau grandit avec les cases). */
  cellMm?: CoordCellMm
  /** 1 carré = 1 unité, ou 2 carrés = 1 unité. */
  unitSquares?: CoordUnitSquares
  /** Origine : nombre de carrés depuis le bord gauche. */
  originCol?: number
  /** Origine : nombre de carrés depuis le bord bas. */
  originRow?: number
  /** Masquer axes, labels x/y et graduations (origine à deviner). */
  hideAxes?: boolean
  /** Afficher l’origine (éditeur / corrigé). */
  showOrigin?: boolean
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
export type PhraseVerbGroup = 'er' | 'autres'

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
  /** Variante de rendu pour les QCM (orale empilée, cartes vocabulaire). */
  selectVariant?: 'pills' | 'oral' | 'cards'
  /** Bloc de théorie grammaticale (fiche lecture seule). */
  theoryBlock?: {
    kind: 'heading' | 'paragraph' | 'note' | 'rule' | 'list' | 'table'
    text?: string
    sub?: boolean
    title?: string
    items?: string[]
    headers?: string[]
    rows?: string[][]
    examples?: Array<{ correct: string; wrong?: string }>
  }
  /** Mode de réponse orale : QCM texte, trait libre, ou QCM images. */
  answerMode?: 'qcm' | 'text' | 'images'
  /** Images des choix (même ordre que `options`) pour le QCM images. */
  optionImages?: string[]
  /** true si un QCM images est possible pour cette question. */
  imagesAvailable?: boolean
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
  /** Tableau de mots à apprendre (image + libellé). */
  vocabEntries?: Array<{ id: string; label: string; imageSrc?: string }>
  vocabRows?: number
  vocabCols?: number
  /** Association Voc : mode image ou texte. */
  vocabMatchMode?: 'image' | 'text'
  /** Paires correctes pour le corrigé (association). */
  vocabPairs?: Array<{ left: string; right: string }>
  /** Longueur du trait de réponse Voc (en caractères approximatifs). */
  vocabLineCh?: number
  /** Mot cible (phrase / dictée). */
  vocabWriteHint?: string
  /** Phrase lue à voix haute (dictée), affichée au corrigé. */
  vocabDictee?: string
  /** Domaine Jeux : une grille de cartes / bandes / plateau. */
  gameBoard?: {
    title?: string
    cols: number
    rows: number
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
    backColor?: string
    frameColor?: string
    themeLabel?: string
    panels?: Array<{
      title?: string
      cols: number
      rows: number
      themeLabel?: string
      themeSub?: string
      cards: Array<{
        id: string
        text?: string
        imageSrc?: string
        lines?: string[]
        scatter?: Array<{ text: string; rotate: number; x: number; y: number }>
        variant?: string
        badge?: string
        textRight?: string
        backColor?: string
        frameColor?: string
      }>
    }>
    cards: Array<{
      id: string
      text?: string
      imageSrc?: string
      lines?: string[]
      scatter?: Array<{ text: string; rotate: number; x: number; y: number }>
      variant?: string
      badge?: string
      textRight?: string
      backColor?: string
      frameColor?: string
    }>
  }
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
  /** Phrase : verbes en -er + être + avoir, ou 2e / 3e groupes. */
  verbGroup?: PhraseVerbGroup
  /**
   * Grille de brouillon (problèmes, équations, périmètres / aires / volumes).
   * `true` = avec grille, `false` = cadre blanc seul. Index = n° de question.
   */
  problemDraftGrids?: boolean[]
  /** Modes de réponse par question (compréhension orale) : QCM / texte / images. */
  oralAnswerModes?: Array<'qcm' | 'text' | 'images'>
  /**
   * Compréhension orale / écrite : les questions qui ne tiennent pas sur la fiche
   * continuent sur la page suivante (saut de page automatique).
   */
  continueOnNextPage?: boolean
  /** Mode libre : l’enseignant·e compose le tableau de repérage. */
  coordLibre?: boolean
  coordCols?: number
  coordRows?: number
  coordAxis?: CoordAxis
  coordMarks?: CoordMark[]
  /** Étendue du repère à 4 cadrans (−n à +n), conservée pour les anciennes fiches. */
  coordRange?: number
  /** Côté du carré (3/4/5 mm cadrans, 6/8/10 mm formes). */
  coordCellMm?: CoordCellMm
  /** Graduation : 1 ou 2 carrés pour une unité. */
  coordUnitSquares?: CoordUnitSquares
  /** Origine du repère (carrés depuis la gauche / le bas). */
  coordOriginCol?: number
  coordOriginRow?: number
  /** Bornes de nombres libres à la place du niveau. */
  numberLibre?: boolean
  numberMin?: number
  numberMax?: number
  numberDecimals?: boolean
  /** Choix des quadrilatères (sinon tirage au hasard parmi toutes les formes). */
  quadLibre?: boolean
  quadShapes?: Figure[]
  /** Mots à apprendre : lignes du tableau (chaque ligne = images + mots). */
  vocabRows?: number
  /** Mots à apprendre : colonnes du tableau. */
  vocabCols?: number
  /** Ids des mots cochés pour le tableau « Mots à apprendre » et le pool Voc. */
  vocabSelected?: string[]
  /** Sous-groupe de vocabulaire (liste déroulante). */
  vocabSubgroup?: string
  /** Mots ajoutés par l’enseignant·e (hors banque). */
  vocabCustomEntries?: Array<{
    id: string
    label: string
    imageSrc?: string
    definition: string
    syllables: string[]
    synonym?: string
    antonym?: string
    masculine?: string
    feminine?: string
    subgroup?: string
    sentences: {
      trous: { a1: string[]; a2: string[]; b1: string[] }
      phrase: { a1: string[]; a2: string[]; b1: string[] }
      dictee: { a1: string[]; a2: string[]; b1: string[] }
    }
  }>
  /** Longueur du trait de réponse (production écrite Voc), en caractères. */
  vocabLineCh?: number
  /** Domaine Jeux : contenu saisi (mots, affirmations, phrases…). */
  gameEntries?: Array<{
    text: string
    imageSrc?: string
    clues?: string[]
    words?: string[]
    category?: string
    isIntrus?: boolean
    isTrue?: boolean
  }>
  /** Domaine Jeux : texte brut du panneau (resync → gameEntries). */
  gameText?: string
  /** Source du contenu Jeux vocabulaire : thème FR, banque lecture, ou libre. */
  gameSource?: 'theme' | 'lecture' | 'libre'
  /** Thème français pour filtrer la banque (mode thème / lecture). */
  gameTopic?: string
  /** Ids cochés dans la banque (mode thème / lecture). */
  gameSelectedIds?: string[]
  /** Couleur du dos des cartes Mémory (vide = blanc). */
  gameBackColor?: string
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
  oralAnswerModes?: Array<'qcm' | 'text' | 'images'>
  /** Nombre max de questions distinctes dans la banque du document tiré (CO/CE). */
  bankQuestionCap?: number
}

export type WorksheetPage = PageConfig & {
  title: string
  instruction: string
  items: MathItem[]
  blocks: WorksheetBlock[]
  /** Valeurs partagées (ex. t = 3) pour les évaluations d'expressions. */
  givens?: AlgebraGiven[]
  /** Index de la PageConfig d’origine (aperçu multi-feuilles / suite). */
  configIndex?: number
  /** Feuille de suite (questions débordantes). */
  isContinuation?: boolean
}

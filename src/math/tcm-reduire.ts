/**
 * TCM ex. 32 — réduction d’expressions.
 * Q1 : pool actuel (termes à regrouper, sans · ni parenthèses).
 * Q2 : 50 modèles avec · et ( ), ≥ 5 « pièces », coeffs 1–9, puissances possibles.
 */
import { generateReduce } from './algebra'
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'

const SUPER: Record<number, string> = { 1: '', 2: '²', 3: '³' }

type Mono = { coefficient: number; literal: string }

function monomialText(coefficient: number, literal: string): string {
  if (!literal) return String(coefficient)
  if (coefficient === 1) return literal
  if (coefficient === -1) return `−${literal}`
  return `${coefficient < 0 ? '−' : ''}${Math.abs(coefficient)}${literal}`
}

function polynomialText(terms: Mono[]): string {
  const grouped = new Map<string, number>()
  for (const { coefficient, literal } of terms) {
    grouped.set(literal, (grouped.get(literal) ?? 0) + coefficient)
  }
  const entries = [...grouped.entries()]
    .filter(([, coefficient]) => coefficient !== 0)
    .sort(([left], [right]) => right.length - left.length || left.localeCompare(right))
  if (entries.length === 0) return '0'
  return entries
    .map(([literal, coefficient], index) => {
      const term = monomialText(Math.abs(coefficient), literal)
      if (index === 0) return coefficient < 0 ? `−${term}` : term
      return `${coefficient < 0 ? '−' : '+'} ${term}`
    })
    .join(' ')
}

function lit(letter: string, power: number): string {
  if (!letter) return ''
  return `${letter}${SUPER[power] ?? ''}`
}

function coef1to9(rng: Rng): number {
  return int(rng, 1, 9)
}

/** Une pièce affichable : monôme ou constante (coeff 1–9, signe ±). */
type Piece =
  | { kind: 'mono'; letter: string; power: 1 | 2 | 3 }
  | { kind: 'const' }

type InnerKind = 'x+y' | 'x-y' | 'x2+y' | 'x+y2' | 'x2+y2' | 'x+x2' | 'x2-y' | 'x-y2' | 'x+c' | 'x2+c'

type OuterKind =
  | 'ax-b'
  | 'ax+b-c'
  | 'ax2-b'
  | 'ax+by-c'
  | 'ax2+by-c'

type DotPos = 'left' | 'mid'

export type ReduireParenTemplate = {
  id: string
  inner: InnerKind
  outer: OuterKind
  dotPos: DotPos
  /** Paire de lettres (défaut x,y). */
  letters?: readonly [string, string]
}

function innerPieces(kind: InnerKind, L1: string, L2: string): Array<Piece & { sign: 1 | -1 }> {
  switch (kind) {
    case 'x+y':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: 1 },
      ]
    case 'x-y':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: -1 },
      ]
    case 'x2+y':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: 1 },
      ]
    case 'x+y2':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L2, power: 2, sign: 1 },
      ]
    case 'x2+y2':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'mono', letter: L2, power: 2, sign: 1 },
      ]
    case 'x+x2':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
      ]
    case 'x2-y':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: -1 },
      ]
    case 'x-y2':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L2, power: 2, sign: 1 },
      ]
    case 'x+c':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'const', sign: 1 },
      ]
    case 'x2+c':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'const', sign: 1 },
      ]
  }
}

function outerPieces(kind: OuterKind, L1: string, L2: string): Array<Piece & { sign: 1 | -1 }> {
  switch (kind) {
    case 'ax-b':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'const', sign: -1 },
      ]
    case 'ax+b-c':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'const', sign: 1 },
        { kind: 'const', sign: -1 },
      ]
    case 'ax2-b':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'const', sign: -1 },
      ]
    case 'ax+by-c':
      return [
        { kind: 'mono', letter: L1, power: 1, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: 1 },
        { kind: 'const', sign: -1 },
      ]
    case 'ax2+by-c':
      return [
        { kind: 'mono', letter: L1, power: 2, sign: 1 },
        { kind: 'mono', letter: L2, power: 1, sign: 1 },
        { kind: 'const', sign: -1 },
      ]
  }
}

const INNER_KINDS: readonly InnerKind[] = [
  'x+y',
  'x-y',
  'x2+y',
  'x+y2',
  'x2+y2',
  'x+x2',
  'x2-y',
  'x-y2',
  'x+c',
  'x2+c',
]

const OUTER_KINDS: readonly OuterKind[] = ['ax-b', 'ax+b-c', 'ax2-b', 'ax+by-c', 'ax2+by-c']

const LETTER_PAIRS: readonly (readonly [string, string])[] = [
  ['x', 'y'],
  ['a', 'b'],
  ['m', 'n'],
  ['p', 'q'],
  ['x', 'a'],
]

/** 50 modèles = 10 inners × 5 outers (dot à gauche) — tous ≥ 5 pièces (k + 2 inner + ≥2 outer). */
export const TCM_REDUIRE_PAREN_TEMPLATES: readonly ReduireParenTemplate[] = INNER_KINDS.flatMap((inner, ii) =>
  OUTER_KINDS.map((outer, oi) => ({
    id: `r${String(ii * 5 + oi + 1).padStart(2, '0')}`,
    inner,
    outer,
    dotPos: (ii + oi) % 3 === 0 ? ('mid' as const) : ('left' as const),
    letters: LETTER_PAIRS[(ii + oi) % LETTER_PAIRS.length],
  })),
)

function fillPiece(rng: Rng, piece: Piece & { sign: 1 | -1 }): { display: string; mono: Mono; firstDisplay: string } {
  const coef = coef1to9(rng)
  const signed = piece.sign * coef
  if (piece.kind === 'const') {
    return {
      display: String(coef),
      firstDisplay: signed < 0 ? `−${coef}` : String(coef),
      mono: { coefficient: signed, literal: '' },
    }
  }
  const literal = lit(piece.letter, piece.power)
  return {
    display: monomialText(coef, literal),
    firstDisplay: monomialText(signed, literal),
    mono: { coefficient: signed, literal },
  }
}

export function fillReduireParenTemplate(
  tpl: ReduireParenTemplate,
  rng: Rng,
): { prompt: string; answer: string } {
  const [L1, L2] = tpl.letters ?? ['x', 'y']
  const k = coef1to9(rng)
  const innerSpecs = innerPieces(tpl.inner, L1, L2)
  const outerSpecs = outerPieces(tpl.outer, L1, L2)

  const innerFilled = innerSpecs.map((p) => fillPiece(rng, p))
  // Pour l’affichage intérieur, le 1er terme garde son signe « naturel » positif sauf si négatif
  const innerSigns = innerSpecs.map((p) => p.sign)
  // Recalcule l’affichage intérieur : premier sans + ; suivants selon sign du spec
  const innerStr = innerFilled
    .map((f, i) => {
      if (i === 0) {
        return innerSigns[0]! < 0 ? `−${f.display}` : f.display
      }
      return `${innerSigns[i]! < 0 ? '−' : '+'} ${f.display}`
    })
    .join(' ')

  const outerFilled = outerSpecs.map((p) => fillPiece(rng, p))

  const expanded: Mono[] = [
    ...innerFilled.map((f) => ({
      coefficient: k * f.mono.coefficient,
      literal: f.mono.literal,
    })),
    ...outerFilled.map((f) => f.mono),
  ]

  const outerStr = outerFilled
    .map((f, i) => {
      const sign = outerSpecs[i]!.sign
      return `${sign < 0 ? '−' : '+'} ${f.display}`
    })
    .join(' ')

  const dotted = `${k} · (${innerStr})`
  let expr: string
  if (tpl.dotPos === 'left') {
    expr = `${dotted} ${outerStr}`
  } else {
    // Premier outer devant, puis ·( ), puis le reste
    const first = outerFilled[0]!
    const firstSign = outerSpecs[0]!.sign
    const head = firstSign < 0 ? `−${first.display}` : first.display
    const rest = outerFilled
      .slice(1)
      .map((f, i) => {
        const sign = outerSpecs[i + 1]!.sign
        return `${sign < 0 ? '−' : '+'} ${f.display}`
      })
      .join(' ')
    expr = rest ? `${head} + ${dotted} ${rest}` : `${head} + ${dotted}`
    // Si first était négatif et mid, on a déjà le signe dans head
  }

  return { prompt: expr, answer: polynomialText(expanded) }
}

/** Lot TCM ex. 32 : Q1 réduction classique ; Q2 modèle · ( ) parmi 50. */
export function generateTcmReduireBatch(rng: Rng): MathItem[] {
  // Remplir d’abord Q2 (beaucoup de tirages) pour éviter le biais du 1er int(0,40) de generateReduce.
  const tpl = pick(rng, TCM_REDUIRE_PAREN_TEMPLATES)
  const filled = fillReduireParenTemplate(tpl, rng)
  const q1 = generateReduce(rng, 1).items[0]!

  return [
    { ...q1, layout: 'algebra' },
    { layout: 'algebra', prompt: filled.prompt, answer: filled.answer },
  ]
}

/** Nombre de modèles (tests / catalogue). */
export const TCM_REDUIRE_PAREN_COUNT = TCM_REDUIRE_PAREN_TEMPLATES.length

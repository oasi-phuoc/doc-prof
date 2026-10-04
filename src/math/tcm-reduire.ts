/**
 * TCM ex. 32 — réduction d’expressions.
 * Q1 : termes à regrouper, sans · ni parenthèses, sans puissances.
 * Q2 : au moins deux · ; facteurs monômes ou (binomes) ; pas de puissance dans l’énoncé
 *      (les puissances peuvent apparaître dans la réponse après réduction).
 */
import { int, pick, shuffle, type Rng } from './rng'
import type { MathItem } from './types'

const SUPER: Record<number, string> = { 1: '', 2: '²', 3: '³', 4: '⁴' }
const LETTERS = ['a', 'b', 'c', 'm', 'n', 'p', 't', 'v', 'x', 'y'] as const

type Mono = { coefficient: number; powers: Record<string, number> }

function monomialText(coefficient: number, literal: string): string {
  if (!literal) return String(coefficient)
  if (coefficient === 1) return literal
  if (coefficient === -1) return `−${literal}`
  return `${coefficient < 0 ? '−' : ''}${Math.abs(coefficient)}${literal}`
}

function literalFromPowers(powers: Record<string, number>): string {
  return Object.keys(powers)
    .filter((letter) => (powers[letter] ?? 0) > 0)
    .sort()
    .map((letter) => `${letter}${SUPER[powers[letter]!] ?? `^${powers[letter]}`}`)
    .join('')
}

function monoDisplay(m: Mono, abs = false): string {
  const coef = abs ? Math.abs(m.coefficient) : m.coefficient
  return monomialText(coef, literalFromPowers(m.powers))
}

function multiplyMonos(a: Mono, b: Mono): Mono {
  const powers: Record<string, number> = { ...a.powers }
  for (const [letter, exp] of Object.entries(b.powers)) {
    powers[letter] = (powers[letter] ?? 0) + exp
  }
  return { coefficient: a.coefficient * b.coefficient, powers }
}

function addMonos(terms: Mono[]): Mono[] {
  const grouped = new Map<string, number>()
  for (const term of terms) {
    const key = literalFromPowers(term.powers)
    grouped.set(key, (grouped.get(key) ?? 0) + term.coefficient)
  }
  return [...grouped.entries()]
    .filter(([, coefficient]) => coefficient !== 0)
    .map(([literal, coefficient]) => {
      const powers: Record<string, number> = {}
      // Reparse literal into powers for consistency
      for (const letter of literal.replace(/[²³⁴]/g, '')) {
        if (/[a-z]/.test(letter)) {
          const idx = literal.indexOf(letter)
          const after = literal[idx + 1]
          const exp = after === '²' ? 2 : after === '³' ? 3 : after === '⁴' ? 4 : 1
          powers[letter] = exp
        }
      }
      // Safer: store powers alongside — rebuild from key pattern
      return { coefficient, powers: powersFromLiteralKey(literal) }
    })
}

function powersFromLiteralKey(literal: string): Record<string, number> {
  const powers: Record<string, number> = {}
  let i = 0
  while (i < literal.length) {
    const letter = literal[i]!
    if (!/[a-z]/.test(letter)) {
      i++
      continue
    }
    const next = literal[i + 1]
    if (next === '²') {
      powers[letter] = 2
      i += 2
    } else if (next === '³') {
      powers[letter] = 3
      i += 2
    } else if (next === '⁴') {
      powers[letter] = 4
      i += 2
    } else {
      powers[letter] = 1
      i += 1
    }
  }
  return powers
}

function polynomialText(terms: Mono[]): string {
  const merged = addMonos(terms)
  if (merged.length === 0) return '0'
  const sorted = [...merged].sort((a, b) => {
    const la = literalFromPowers(a.powers)
    const lb = literalFromPowers(b.powers)
    return lb.length - la.length || la.localeCompare(lb)
  })
  return sorted
    .map((term, index) => {
      const body = monoDisplay({ ...term, coefficient: Math.abs(term.coefficient) })
      if (index === 0) return term.coefficient < 0 ? `−${body}` : body
      return `${term.coefficient < 0 ? '−' : '+'} ${body}`
    })
    .join(' ')
}

function coef1to9(rng: Rng): number {
  return int(rng, 1, 9)
}

function pickLetters(rng: Rng, n: number): string[] {
  const pool = shuffle(rng, [...LETTERS])
  return pool.slice(0, n)
}

/** Monôme degré ≤ 1 (pas de puissance dans l’énoncé). */
function randomMono(rng: Rng, letters: string[]): Mono {
  const coef = coef1to9(rng)
  if (rng() < 0.25) return { coefficient: coef, powers: {} }
  const letter = pick(rng, letters)
  return { coefficient: coef, powers: { [letter]: 1 } }
}

type Factor =
  | { kind: 'mono'; mono: Mono }
  | { kind: 'paren'; left: Mono; right: Mono; op: '+' | '−' }

function factorDisplay(f: Factor): string {
  if (f.kind === 'mono') return monoDisplay(f.mono)
  const l = monoDisplay(f.left)
  const r = monoDisplay({ ...f.right, coefficient: Math.abs(f.right.coefficient) })
  // right coeff stored positive; op carries the sign
  return `(${l} ${f.op} ${r})`
}

function expandFactor(f: Factor): Mono[] {
  if (f.kind === 'mono') return [f.mono]
  const rightCoef = f.op === '−' ? -Math.abs(f.right.coefficient) : Math.abs(f.right.coefficient)
  return [f.left, { coefficient: rightCoef, powers: { ...f.right.powers } }]
}

function expandProduct(factors: Factor[]): Mono[] {
  let acc: Mono[] = [{ coefficient: 1, powers: {} }]
  for (const factor of factors) {
    const next: Mono[] = []
    const pieces = expandFactor(factor)
    for (const a of acc) {
      for (const b of pieces) next.push(multiplyMonos(a, b))
    }
    acc = next
  }
  return acc
}

function randomParen(rng: Rng, letters: string[]): Factor {
  const left = randomMono(rng, letters)
  // Right: prefer a different shape (const or other letter)
  let right = randomMono(rng, letters)
  if (rng() < 0.4) right = { coefficient: coef1to9(rng), powers: {} }
  const op: '+' | '−' = rng() < 0.5 ? '+' : '−'
  return { kind: 'paren', left, right, op }
}

function randomFactor(rng: Rng, letters: string[], allowParen: boolean): Factor {
  if (allowParen && rng() < 0.55) return randomParen(rng, letters)
  return { kind: 'mono', mono: randomMono(rng, letters) }
}

/**
 * Q2 : trois facteurs reliés par deux · (tous ordres : mono/paren).
 * Ex. 5x · 6c · 2 , 5x · (4x − v) · 3 , 4 · (5 + 4x) · y , (6y − t) · 5v · 2
 */
function generateDotProductItem(rng: Rng): MathItem {
  const letters = pickLetters(rng, 4)
  // Au moins une parenthèse parmi les trois, pour coller aux exemples variés.
  const patterns: Array<[boolean, boolean, boolean]> = [
    [false, false, false], // 5x · 6c · 2
    [false, true, false], // 5x · (4x − v) · 3
    [true, false, false], // (6y − t) · 5v · 2
    [false, false, true],
    [true, false, true],
    [false, true, true],
  ]
  const [p0, p1, p2] = pick(rng, patterns)
  const factors: Factor[] = [
    randomFactor(rng, letters, p0),
    randomFactor(rng, letters, p1),
    randomFactor(rng, letters, p2),
  ]
  // Garantir au moins un monôme littéral et éviter 1 · 1 · 1 trivial.
  if (factors.every((f) => f.kind === 'mono' && Object.keys(f.mono.powers).length === 0)) {
    factors[0] = {
      kind: 'mono',
      mono: { coefficient: coef1to9(rng), powers: { [letters[0]!]: 1 } },
    }
  }
  const prompt = factors.map(factorDisplay).join(' · ')
  const answer = polynomialText(expandProduct(factors))
  return { layout: 'algebra', prompt, answer }
}

/** Q1 : somme de monômes degré ≤ 1 (pas de puissance, pas de ·). */
function generateReduceNoPower(rng: Rng): MathItem {
  const letters = pickLetters(rng, 2)
  const termCount = int(rng, 4, 7)
  const terms: Mono[] = []
  for (let i = 0; i < termCount; i++) {
    const isConst = i > 0 && rng() < 0.28
    const letter = isConst ? '' : letters[i % letters.length]!
    const magnitude = coef1to9(rng)
    const coefficient = rng() < 0.3 ? -magnitude : magnitude
    terms.push({
      coefficient,
      powers: letter ? { [letter]: 1 } : {},
    })
  }
  // Au moins deux littéraux pour avoir quelque chose à regrouper.
  if (terms.filter((t) => Object.keys(t.powers).length > 0).length < 2) {
    terms[0] = { coefficient: coef1to9(rng), powers: { [letters[0]!]: 1 } }
    terms[1] = { coefficient: coef1to9(rng), powers: { [letters[0]!]: 1 } }
  }
  const display = terms
    .map((term, index) => {
      const body = monoDisplay({ ...term, coefficient: Math.abs(term.coefficient) })
      if (index === 0) return term.coefficient < 0 ? `−${body}` : body
      return `${term.coefficient < 0 ? '−' : '+'} ${body}`
    })
    .join(' ')
  return { layout: 'algebra', prompt: display, answer: polynomialText(terms) }
}

/** Lot TCM ex. 32 : Q1 sans puissance ; Q2 produit avec ≥ 2 ·, sans puissance dans l’énoncé. */
export function generateTcmReduireBatch(rng: Rng): MathItem[] {
  // Q2 d’abord (plus de tirages) pour ne pas biaiser le RNG de Q1.
  const q2 = generateDotProductItem(rng)
  const q1 = generateReduceNoPower(rng)
  return [q1, q2]
}

/** Conservé pour compat catalogue / tests éventuels. */
export const TCM_REDUIRE_PAREN_COUNT = 50

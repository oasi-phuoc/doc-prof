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
    .map(([literal, coefficient]) => ({
      coefficient,
      powers: powersFromLiteralKey(literal),
    }))
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
function randomMono(rng: Rng, letters: string[], opts?: { allowConst?: boolean; minCoef?: number }): Mono {
  const minCoef = opts?.minCoef ?? 1
  const coef = int(rng, Math.max(1, minCoef), 9)
  const allowConst = opts?.allowConst ?? true
  if (allowConst && rng() < 0.22) return { coefficient: Math.max(2, coef), powers: {} }
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
  // Binôme avec au moins un littéral : (5 + 4x), (4x − v), (6y − t)…
  const shape = pick(rng, ['lit-const', 'const-lit', 'lit-lit'] as const)
  let left: Mono
  let right: Mono
  if (shape === 'lit-const') {
    left = randomMono(rng, letters, { allowConst: false })
    right = { coefficient: int(rng, 2, 9), powers: {} }
  } else if (shape === 'const-lit') {
    left = { coefficient: int(rng, 2, 9), powers: {} }
    right = randomMono(rng, letters, { allowConst: false })
  } else {
    left = randomMono(rng, letters, { allowConst: false })
    right = randomMono(rng, letters, { allowConst: false })
    const l0 = Object.keys(left.powers)[0]
    const r0 = Object.keys(right.powers)[0]
    if (l0 && r0 && l0 === r0) {
      const other = letters.find((l) => l !== l0) ?? letters[0]!
      right = { coefficient: right.coefficient, powers: { [other]: 1 } }
    }
  }
  const op: '+' | '−' = rng() < 0.5 ? '+' : '−'
  return { kind: 'paren', left, right, op }
}

function randomLiteralMono(rng: Rng, letters: string[]): Factor {
  return { kind: 'mono', mono: randomMono(rng, letters, { allowConst: false }) }
}

function randomConstMono(rng: Rng): Factor {
  return { kind: 'mono', mono: { coefficient: int(rng, 2, 9), powers: {} } }
}

/**
 * Q2 : au moins deux · (trois facteurs), formes inspirées des exemples :
 * 5x · 6c · 2 , 5x · (4x − v) · 3 , 4 · (5 + 4x) · y , (6y − t) · 5v · 2
 * Tous ordres mono / constante / parenthèse ; pas de puissance dans l’énoncé.
 */
function generateDotProductItem(rng: Rng): MathItem {
  const letters = pickLetters(rng, 4)
  type Slot = 'lit' | 'const' | 'paren'
  const patterns: Array<[Slot, Slot, Slot]> = [
    ['lit', 'lit', 'const'], // 5x · 6c · 2
    ['lit', 'paren', 'const'], // 5x · (4x − v) · 3
    ['const', 'paren', 'lit'], // 4 · (5 + 4x) · y
    ['paren', 'lit', 'const'], // (6y − t) · 5v · 2
    ['lit', 'const', 'paren'],
    ['paren', 'const', 'lit'],
    ['const', 'lit', 'paren'],
    ['lit', 'paren', 'lit'],
    ['paren', 'lit', 'lit'],
  ]
  const slots = pick(rng, patterns)
  const make = (slot: Slot): Factor => {
    if (slot === 'paren') return randomParen(rng, letters)
    if (slot === 'const') return randomConstMono(rng)
    return randomLiteralMono(rng, letters)
  }
  const factors = slots.map(make)
  const prompt = factors.map(factorDisplay).join(' · ')
  // Sécurité : exactement / au moins deux ·
  if ((prompt.match(/·/g) ?? []).length < 2) {
    return generateDotProductItem(rng)
  }
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

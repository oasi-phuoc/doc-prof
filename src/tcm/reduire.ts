/**
 * TCM ex. 32 — réduction d’expressions.
 * Q1 : somme de monômes, sans · ni puissance.
 * Q2 : exactement deux · (trois facteurs) ; pas de puissance dans l’énoncé
 *      (puissances possibles dans la réponse). 50 modèles.
 */
import { int, pick, shuffle, type Rng } from '@/math/rng'
import type { MathItem } from '@/math/types'

const SUPER: Record<number, string> = { 1: '', 2: '²', 3: '³', 4: '⁴' }
const LETTERS = ['a', 'b', 'c', 'm', 'n', 'p', 't', 'v', 'x', 'y'] as const

export const TCM_REDUIRE_Q2_COUNT = 50
/** Conservé pour compat catalogue / tests éventuels. */
export const TCM_REDUIRE_PAREN_COUNT = TCM_REDUIRE_Q2_COUNT

type Mono = { coefficient: number; powers: Record<string, number> }

type Factor =
  | { kind: 'mono'; mono: Mono }
  | { kind: 'paren'; left: Mono; right: Mono; op: '+' | '−' }

/** Gabarit Q2 : trois slots → exactement deux « · ». */
type SlotKind = 'lit' | 'const' | 'paren'
type Q2Template = { id: string; slots: [SlotKind, SlotKind, SlotKind] }

/**
 * 50 modèles — chaque expression = facteur · facteur · facteur.
 * Ex. 5x · 6c · 2 , 5x · (4x − v) · 3 , 4 · (5 + 4x) · y , (6y − t) · 5v · 2
 */
const Q2_TEMPLATES: Q2Template[] = [
  { id: 'd01', slots: ['lit', 'lit', 'const'] },
  { id: 'd02', slots: ['lit', 'paren', 'const'] },
  { id: 'd03', slots: ['const', 'paren', 'lit'] },
  { id: 'd04', slots: ['paren', 'lit', 'const'] },
  { id: 'd05', slots: ['lit', 'const', 'paren'] },
  { id: 'd06', slots: ['paren', 'const', 'lit'] },
  { id: 'd07', slots: ['const', 'lit', 'paren'] },
  { id: 'd08', slots: ['lit', 'paren', 'lit'] },
  { id: 'd09', slots: ['paren', 'lit', 'lit'] },
  { id: 'd10', slots: ['lit', 'lit', 'paren'] },
  { id: 'd11', slots: ['const', 'lit', 'lit'] },
  { id: 'd12', slots: ['lit', 'const', 'lit'] },
  { id: 'd13', slots: ['paren', 'paren', 'const'] },
  { id: 'd14', slots: ['const', 'paren', 'paren'] },
  { id: 'd15', slots: ['paren', 'const', 'paren'] },
  { id: 'd16', slots: ['lit', 'paren', 'const'] },
  { id: 'd17', slots: ['paren', 'lit', 'const'] },
  { id: 'd18', slots: ['const', 'paren', 'lit'] },
  { id: 'd19', slots: ['lit', 'lit', 'const'] },
  { id: 'd20', slots: ['lit', 'const', 'paren'] },
  { id: 'd21', slots: ['paren', 'const', 'lit'] },
  { id: 'd22', slots: ['const', 'lit', 'paren'] },
  { id: 'd23', slots: ['lit', 'paren', 'lit'] },
  { id: 'd24', slots: ['paren', 'lit', 'lit'] },
  { id: 'd25', slots: ['lit', 'lit', 'paren'] },
  { id: 'd26', slots: ['const', 'lit', 'lit'] },
  { id: 'd27', slots: ['lit', 'const', 'lit'] },
  { id: 'd28', slots: ['paren', 'paren', 'lit'] },
  { id: 'd29', slots: ['lit', 'paren', 'paren'] },
  { id: 'd30', slots: ['paren', 'lit', 'paren'] },
  { id: 'd31', slots: ['lit', 'paren', 'const'] },
  { id: 'd32', slots: ['paren', 'lit', 'const'] },
  { id: 'd33', slots: ['const', 'paren', 'lit'] },
  { id: 'd34', slots: ['lit', 'lit', 'const'] },
  { id: 'd35', slots: ['lit', 'const', 'paren'] },
  { id: 'd36', slots: ['paren', 'const', 'lit'] },
  { id: 'd37', slots: ['const', 'lit', 'paren'] },
  { id: 'd38', slots: ['lit', 'paren', 'lit'] },
  { id: 'd39', slots: ['paren', 'lit', 'lit'] },
  { id: 'd40', slots: ['lit', 'lit', 'paren'] },
  { id: 'd41', slots: ['const', 'paren', 'const'] },
  { id: 'd42', slots: ['paren', 'const', 'const'] },
  { id: 'd43', slots: ['const', 'const', 'paren'] },
  { id: 'd44', slots: ['lit', 'paren', 'const'] },
  { id: 'd45', slots: ['paren', 'lit', 'const'] },
  { id: 'd46', slots: ['const', 'paren', 'lit'] },
  { id: 'd47', slots: ['lit', 'const', 'paren'] },
  { id: 'd48', slots: ['paren', 'const', 'lit'] },
  { id: 'd49', slots: ['lit', 'paren', 'lit'] },
  { id: 'd50', slots: ['paren', 'lit', 'paren'] },
]

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

function monoDisplay(m: Mono): string {
  return monomialText(m.coefficient, literalFromPowers(m.powers))
}

function multiplyMonos(a: Mono, b: Mono): Mono {
  const powers: Record<string, number> = { ...a.powers }
  for (const [letter, exp] of Object.entries(b.powers)) {
    powers[letter] = (powers[letter] ?? 0) + exp
  }
  return { coefficient: a.coefficient * b.coefficient, powers }
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
  return shuffle(rng, [...LETTERS]).slice(0, n)
}

function factorDisplay(f: Factor): string {
  if (f.kind === 'mono') return monoDisplay(f.mono)
  const l = monoDisplay(f.left)
  const r = monoDisplay({ ...f.right, coefficient: Math.abs(f.right.coefficient) })
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
  const shape = pick(rng, ['lit-const', 'const-lit', 'lit-lit'] as const)
  let left: Mono
  let right: Mono
  if (shape === 'lit-const') {
    left = { coefficient: int(rng, 2, 9), powers: { [pick(rng, letters)]: 1 } }
    right = { coefficient: int(rng, 2, 9), powers: {} }
  } else if (shape === 'const-lit') {
    left = { coefficient: int(rng, 2, 9), powers: {} }
    right = { coefficient: int(rng, 2, 9), powers: { [pick(rng, letters)]: 1 } }
  } else {
    const l0 = pick(rng, letters)
    const r0 = letters.find((l) => l !== l0) ?? pick(rng, letters)
    left = { coefficient: int(rng, 2, 9), powers: { [l0]: 1 } }
    right = { coefficient: int(rng, 2, 9), powers: { [r0]: 1 } }
  }
  const op: '+' | '−' = rng() < 0.5 ? '+' : '−'
  return { kind: 'paren', left, right, op }
}

function makeSlot(rng: Rng, slot: SlotKind, letters: string[]): Factor {
  if (slot === 'paren') return randomParen(rng, letters)
  if (slot === 'const') return { kind: 'mono', mono: { coefficient: int(rng, 2, 9), powers: {} } }
  return {
    kind: 'mono',
    mono: { coefficient: int(rng, 2, 9), powers: { [pick(rng, letters)]: 1 } },
  }
}

/**
 * Q2 : exactement deux · (trois facteurs), 50 modèles, sans puissance dans l’énoncé.
 */
function generateDotProductItem(rng: Rng): MathItem {
  const letters = pickLetters(rng, 4)
  const order = shuffle(rng, [...Q2_TEMPLATES])
  for (const tpl of order) {
    const factors = tpl.slots.map((slot) => makeSlot(rng, slot, letters))
    // Toujours joindre par « · » — garantit exactement deux occurrences.
    const prompt = `${factorDisplay(factors[0]!)} · ${factorDisplay(factors[1]!)} · ${factorDisplay(factors[2]!)}`
    const dots = (prompt.match(/·/g) ?? []).length
    if (dots !== 2) continue
    if (/[²³⁴]/.test(prompt)) continue
    const answer = polynomialText(expandProduct(factors))
    return { layout: 'algebra', prompt, answer }
  }
  // Repli sûr : 5x · 6c · 2
  const [u, v] = letters
  const a = int(rng, 2, 9)
  const b = int(rng, 2, 9)
  const c = int(rng, 2, 9)
  const factors: Factor[] = [
    { kind: 'mono', mono: { coefficient: a, powers: { [u!]: 1 } } },
    { kind: 'mono', mono: { coefficient: b, powers: { [v!]: 1 } } },
    { kind: 'mono', mono: { coefficient: c, powers: {} } },
  ]
  const prompt = `${factorDisplay(factors[0]!)} · ${factorDisplay(factors[1]!)} · ${factorDisplay(factors[2]!)}`
  return { layout: 'algebra', prompt, answer: polynomialText(expandProduct(factors)) }
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

/** Lot TCM ex. 32 : Q1 sans puissance ; Q2 avec exactement deux ·. */
export function generateTcmReduireBatch(rng: Rng): MathItem[] {
  const q2 = generateDotProductItem(rng)
  const q1 = generateReduceNoPower(rng)
  return [q1, q2]
}

export function tcmReduireTemplateCounts(): { q2: number } {
  return { q2: Q2_TEMPLATES.length }
}

/**
 * TCM ex. 31 — deux questions :
 * 1) Pourcentage d’un nombre : « p % de n est égale à … »
 *    p ∈ {10, 20, 25, 40, 60, 75, 80} ; n ∈ [101 ; 999], pas multiple de 10.
 * 2) Règle de trois à trois nombres : a → b / c = …
 *    a, c ∈ [3 ; 9] ; b ∈ [11 ; 99] ; distincts ; aucun ne divise un autre ;
 *    réponse entière.
 */
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'

const PCT_CHOICES = [10, 20, 25, 40, 60, 75, 80] as const

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function divides(a: number, b: number): boolean {
  return a !== 0 && b % a === 0
}

/** Aucune paire où l’un divise l’autre. */
function noPairDivides(a: number, b: number, c: number): boolean {
  const pairs: [number, number][] = [
    [a, b],
    [b, a],
    [a, c],
    [c, a],
    [b, c],
    [c, b],
  ]
  return pairs.every(([x, y]) => !divides(x, y))
}

function fmtAnswer(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return String(Math.round(n * 1000) / 1000).replace('.', ',')
}

/** n ∈ [101 ; 999], non multiple de 10 (pas une « dizaine » ronde). */
function pickPercentBase(rng: Rng, pct: number): number {
  for (let attempt = 0; attempt < 200; attempt++) {
    const n = int(rng, 101, 999)
    if (n % 10 === 0) continue
    const raw = (pct * n) / 100
    const rounded = Math.round(raw * 100) / 100
    if (Math.abs(raw - rounded) < 1e-9) return n
  }
  return pct === 25 ? 248 : 245
}

function generatePercentItem(rng: Rng): MathItem {
  const pct = pick(rng, [...PCT_CHOICES])
  const n = pickPercentBase(rng, pct)
  const value = (pct * n) / 100
  return {
    layout: 'text',
    prompt: `${pct} % de ${n} est égale à`,
    answer: fmtAnswer(value),
  }
}

/**
 * Triple (a, b, c) : a → b ; c = ?
 * b doit être multiple de a/gcd(a,c) pour que b·c / a soit entier.
 */
function pickTriple(rng: Rng): { a: number; b: number; c: number; x: number } {
  for (let attempt = 0; attempt < 300; attempt++) {
    const a = int(rng, 3, 9)
    let c = int(rng, 3, 9)
    while (c === a) c = int(rng, 3, 9)
    if (divides(a, c) || divides(c, a)) continue

    const step = a / gcd(a, c)
    const minK = Math.ceil(11 / step)
    const maxK = Math.floor(99 / step)
    if (minK > maxK) continue
    const k = int(rng, minK, maxK)
    const b = k * step
    if (b < 11 || b > 99) continue
    if (b === a || b === c) continue
    if (!noPairDivides(a, b, c)) continue
    if ((b * c) % a !== 0) continue
    const x = (b * c) / a
    if (!Number.isInteger(x) || x <= 0) continue
    return { a, b, c, x }
  }
  // Repli valide : 6 → 15 ; 4 → 10 (aucun ne divise un autre).
  return { a: 6, b: 15, c: 4, x: 10 }
}

function generateTripleItem(rng: Rng): MathItem {
  const { a, b, c, x } = pickTriple(rng)
  return {
    layout: 'text',
    prompt: `${a} → ${b}\n${c} =`,
    answer: String(x),
  }
}

/** Lot TCM ex. 31 : Q1 pourcentage, Q2 règle de trois (3 nombres). */
export function generateTcmProportionKgBatch(rng: Rng, count = 2): MathItem[] {
  const items = [generatePercentItem(rng), generateTripleItem(rng)]
  return items.slice(0, Math.max(1, Math.min(count, 2)))
}

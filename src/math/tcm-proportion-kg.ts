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

function divides(a: number, b: number): boolean {
  return a !== 0 && b % a === 0
}

function fmtAnswer(n: number): string {
  if (Number.isInteger(n)) return String(n)
  return String(Math.round(n * 1000) / 1000).replace('.', ',')
}

/** n ∈ [101 ; 999], non multiple de 10 (pas une « dizaine » ronde). */
function pickPercentBase(rng: Rng, pct: number): number {
  for (let attempt = 0; attempt < 200; attempt++) {
    let n = int(rng, 101, 999)
    if (n % 10 === 0) continue
    // Résultat exact (entier ou au plus 2 décimales propres).
    const raw = (pct * n) / 100
    const rounded = Math.round(raw * 100) / 100
    if (Math.abs(raw - rounded) < 1e-9) return n
  }
  // Repli : 25 % de 248 = 62.
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
 * a,c ∈ [3;9], b ∈ [11;99], tous distincts, sans relation multiple/diviseur,
 * et b·c divisible par a.
 */
function pickTriple(rng: Rng): { a: number; b: number; c: number; x: number } {
  for (let attempt = 0; attempt < 250; attempt++) {
    const a = int(rng, 3, 9)
    let c = int(rng, 3, 9)
    while (c === a) c = int(rng, 3, 9)
    if (divides(a, c) || divides(c, a)) continue

    let b = int(rng, 11, 99)
    // Distinct de a et c (automatique si b≥11, mais garde la règle).
    if (b === a || b === c) continue
    if (divides(a, b) || divides(b, a) || divides(c, b) || divides(b, c)) continue
    if ((b * c) % a !== 0) continue
    const x = (b * c) / a
    if (!Number.isInteger(x) || x <= 0) continue
    return { a, b, c, x }
  }
  // Repli : 4 → 15 ; 7 → 105/4 impossible — 4 → 21 ; 5 → 26,25 non ;
  // 4 → 15 interdit (4∤15, 15∤4) mais 15×5/4 non entier.
  // 5 → 14 ; 6 → ?  5∤14,14∤5,5∤6,6∤5,14∤6,6∤14 ; 14×6/5 non entier.
  // 5 → 18 ; 6 : 5∤18… ; 18×6/5 non.
  // 5 → 21 ; 6 : 21×6/5 non.
  // 5 → 28 ; 6 : 28×6/5 non ; 5 → 16 ; 6 : 16×6/5 non.
  // 4 → 21 ; 5 : 21×5/4 non ; 4 → 25 ; 7 : 25×7/4 non ; 4 → 15 ; 7 : 15×7/4 non.
  // 4 → 22 ; 7 : 22×7/4 = 38.5 ; 4 → 26 ; 7 = 45.5 ; 4 → 30 interdit (4|30).
  // 4 → 14 ; 7 interdit (7|14).
  // 5 → 12 ; 8 : 5∤12,12∤5,5∤8,8∤5,12∤8,8∤12 ; 12×8/5 non.
  // 5 → 14 ; 8 : 14×8/5 non ; 5 → 16 ; 8 interdit (8|16)? 8 divides 16 — skip.
  // 5 → 18 ; 8 : 18×8/5 non ; 5 → 22 ; 8 : 22×8/5 non ; 5 → 24 ; 7 : 24×7/5 non.
  // 5 → 26 ; 8 : 26×8/5 non ; 5 → 28 ; 8 : 28×8/5 non ; 5 → 32 ; 7 : 32×7/5 non.
  // 5 → 36 ; 8 interdit?  8∤36,36∤8 ; 36×8/5 non.
  // Use known good: 4 → 18 ; 5 → 22.5 no ; 4 → 22 ; 5 → 27.5 ;
  // 6 → 25 ; 5 : 6∤25… ; 25×5/6 non ; 6 → 35 ; 5 : 35×5/6 non ;
  // 6 → 25 ; 4 : 6∤25,25∤6,6∤4,4∤6,25∤4,4∤25 ; 25×4/6 non ;
  // 6 → 35 ; 4 : 35×4/6 non ; 6 → 14 ; 5 interdit (…14 et  ?); 7|14.
  // 8 → 15 ; 3 : 8∤15… 3|15 — skip ; 8 → 15 ; 5 : ok pairs ; 15×5/8 non.
  // 8 → 15 ; 7 : 15×7/8 non ; 8 → 21 ; 5 : 21×5/8 non ; 8 → 25 ; 3 : 25×3/8 non.
  // 8 → 35 ; 3 : 35×3/8 non ; 8 → 45 ; 7?  45×7/8 non.
  // Classic: 4 → 10 forbidden (4| ? 10 no divides either way) 10×5/4=12.5.
  // 3 → 14 ; 5 : 3∤14,14∤3,3∤5,5∤3,14∤5,5∤14 ; 14×5/3 non.
  // 3 → 16 ; 5 : 16×5/3 non ; 3 → 20 interdit ( ? 20%3); 3∤20,20∤3 ; 20×5/3 non.
  // 3 → 22 ; 5 : 22×5/3 non ; 3 → 25 ; 4 : 25×4/3 non ; 3 → 28 ; 5 : 28×5/3 non.
  // 3 → 14 ; 8 : 14×8/3 non ; 3 → 16 ; 8? 8 and ? ; 16×8/3 non.
  // Integer: need b*c ≡ 0 (mod a). Try a=4, c=5, b=18 → 90/4 no; b=12 → 60/4=15
  // but 4|12 — forbidden. b=28 → 140/4=35 ; 4∤28,28∤4,4∤5,5∤4,28∤5,5∤28. OK!
  return { a: 4, b: 28, c: 5, x: 35 }
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

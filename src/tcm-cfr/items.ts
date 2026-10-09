/**
 * Générateurs d’items TCM CFR (types `tcm-cfr-*`).
 */
import { genFracSingleItems } from '@/math/fraction-shapes'
import { createRng, int, pick, shuffle, type Rng } from '@/math/rng'
import type { ArithOp, Figure, MathItem } from '@/math/types'
import {
  columnItem,
  divisionColumnItem,
  withFixedColumnWidth,
  withFixedDivisionWidth,
  withFixedDivisionWorkRows,
} from '@/tcm/items'
import { mulAudioParts, numberAudioParts } from './audio-nombres'
import { generateMetroQuestions, pickMetroMap } from './metro'
import { pickSymmetryTemplate } from './symetrie'
import { isTcmCfrType } from './types'

function fmt(n: number): string {
  return String(n).replace('.', ',')
}

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

function oneDecimal(rng: Rng, loTenths: number, hiTenths: number): number {
  let t = int(rng, loTenths, hiTenths)
  while (t % 10 === 0) t = int(rng, loTenths, hiTenths)
  return t / 10
}

/** Ex. 1 — 5 nombres audio 11–99. */
function genEx01(rng: Rng, count: number): MathItem[] {
  const used = new Set<number>()
  return Array.from({ length: Math.max(1, count) }, () => {
    let n = int(rng, 11, 99)
    let guard = 0
    while (used.has(n) && guard < 40) {
      n = int(rng, 11, 99)
      guard++
    }
    used.add(n)
    const parts = numberAudioParts(n)
    return {
      layout: 'audio-dictation' as const,
      prompt: '',
      audioParts: parts,
      audioSrc: parts[0],
      answer: String(n),
    }
  })
}

/** Ex. 2 — 5 multiplications orales 2–12 × 2–12. */
function genEx02(rng: Rng, count: number): MathItem[] {
  return Array.from({ length: Math.max(1, count) }, () => {
    const a = int(rng, 2, 12)
    const b = int(rng, 2, 12)
    const parts = mulAudioParts(a, b)
    return {
      layout: 'audio-dictation' as const,
      prompt: '',
      audioParts: parts,
      audioSrc: parts[0],
      answer: String(a * b),
    }
  })
}

/** Ex. 3 — ranger 7 nombres (Q1 mixtes 10–100 ; Q2 même unité, décimales variables). */
function genEx03(rng: Rng): MathItem[] {
  const orderItem = (
    ascending: boolean,
    sequence: string[],
    ordered: string[],
  ): MathItem => ({
    layout: 'order',
    sequence,
    placeParts: ordered,
    orderBoxed: true,
    /** Cadres / traits compacts (max. 3 chiffres) pour tenir sur une ligne. */
    orderCompact: true,
    orderOp: ascending ? '<' : '>',
    prompt: ascending ? 'Du plus petit au plus grand :' : 'Du plus grand au plus petit :',
    answer: ordered.join(ascending ? ' < ' : ' > '),
  })

  // Q1 — 7 nombres 10–100, 0 ou 1 décimale.
  const q1vals: number[] = []
  while (q1vals.length < 7) {
    const withDec = rng() < 0.5
    const v = withDec ? oneDecimal(rng, 100, 1000) : int(rng, 10, 100)
    if (v < 10 || v > 100) continue
    if (q1vals.some((x) => Math.abs(x - v) < 1e-9)) continue
    q1vals.push(v)
  }
  const q1Asc = rng() < 0.5
  const q1Shuf = shuffle(rng, q1vals)
  const q1Ord = [...q1Shuf].sort((a, b) => (q1Asc ? a - b : b - a))

  // Q2 — même partie entière, décimales variables (6 · 6,1 · 6,01 · 6,11…).
  const unit = int(rng, 2, 9)
  const kinds: Array<() => number> = [
    () => unit,
    () => unit + int(rng, 1, 9) / 10,
    () => unit + int(rng, 1, 9) / 100,
    () => unit + int(rng, 1, 9) / 10 + int(rng, 1, 9) / 100,
    () => unit + int(rng, 1, 9) / 10,
    () => unit + int(rng, 10, 99) / 100,
    () => unit + int(rng, 1, 9) / 100,
  ]
  const q2vals: number[] = []
  const seen = new Set<string>()
  for (const make of shuffle(rng, kinds)) {
    let v = make()
    let key = fmt(v)
    let g = 0
    while (seen.has(key) && g < 20) {
      v = make()
      key = fmt(v)
      g++
    }
    if (!seen.has(key)) {
      seen.add(key)
      q2vals.push(v)
    }
    if (q2vals.length >= 7) break
  }
  while (q2vals.length < 7) {
    const v = unit + int(rng, 0, 99) / 100
    const key = fmt(v)
    if (!seen.has(key)) {
      seen.add(key)
      q2vals.push(v)
    }
  }
  const q2Asc = !q1Asc
  const q2Shuf = shuffle(rng, q2vals)
  const q2Ord = [...q2Shuf].sort((a, b) => (q2Asc ? a - b : b - a))

  return [
    orderItem(q1Asc, q1Shuf.map(fmt), q1Ord.map(fmt)),
    orderItem(q2Asc, q2Shuf.map(fmt), q2Ord.map(fmt)),
  ]
}

/** Ex. 4 — comparer décimaux (style 4,7 / 7,4 · 8,10 / 8,1…). */
function genEx04(rng: Rng, count: number): MathItem[] {
  const makers: Array<() => { left: string; right: string; answer: string }> = [
    () => {
      const a = oneDecimal(rng, 11, 99)
      const b = oneDecimal(rng, 11, 99)
      if (a === b) return { left: fmt(a), right: fmt(a), answer: '=' }
      return a < b
        ? { left: fmt(a), right: fmt(b), answer: '<' }
        : { left: fmt(a), right: fmt(b), answer: '>' }
    },
    () => {
      // Même chiffres permutés (4,7 vs 7,4).
      const d1 = int(rng, 1, 9)
      let d2 = int(rng, 1, 9)
      while (d2 === d1) d2 = int(rng, 1, 9)
      const a = d1 + d2 / 10
      const b = d2 + d1 / 10
      return a < b
        ? { left: fmt(a), right: fmt(b), answer: '<' }
        : { left: fmt(a), right: fmt(b), answer: '>' }
    },
    () => {
      // 8,10 vs 8,1 (égalité écrite différente).
      const u = int(rng, 2, 12)
      const t = int(rng, 1, 9)
      return { left: `${u},${t}0`, right: `${u},${t}`, answer: '=' }
    },
    () => {
      // 12,1 vs 12,01.
      const u = int(rng, 10, 20)
      const a = u + 1 / 10
      const b = u + 1 / 100
      return { left: fmt(a), right: fmt(b), answer: '>' }
    },
  ]
  const picked = shuffle(rng, makers).slice(0, Math.max(1, count))
  while (picked.length < count) picked.push(pick(rng, makers))
  return picked.map((make) => {
    const { left, right, answer } = make()
    return { layout: 'compare' as const, left, right, answer }
  })
}

/** Ex. 5 — décomposer 101–999 et 1001–9999. */
function genEx05(rng: Rng): MathItem[] {
  const small = int(rng, 101, 999)
  const big = int(rng, 1001, 9999)
  const decomp = (value: number, four: boolean): MathItem => {
    const u = value % 10
    const d = Math.floor((value % 100) / 10)
    const c = Math.floor((value % 1000) / 100)
    const m = Math.floor(value / 1000)
    const placeParts = four
      ? [String(m * 1000), String(c * 100), String(d * 10), String(u)]
      : [String(c * 100), String(d * 10), String(u)]
    const labels = four
      ? ['milliers', 'centaines', 'dizaines', 'unités']
      : ['centaines', 'dizaines', 'unités']
    return {
      layout: 'place-value',
      prompt: value.toLocaleString('fr-CH'),
      labels,
      placeParts,
      answer: placeParts.join(' + '),
    }
  }
  return rng() < 0.5
    ? [decomp(small, false), decomp(big, true)]
    : [decomp(big, true), decomp(small, false)]
}

/** Ex. 6 — nommer + × ÷ − (signe encadré, trait sur la même ligne). */
function genEx06(rng: Rng): MathItem[] {
  const ops: Array<{ op: ArithOp; word: string }> = [
    { op: '+', word: 'plus' },
    { op: '−', word: 'moins' },
    { op: '×', word: 'fois' },
    { op: '÷', word: 'diviser' },
  ]
  return shuffle(rng, ops).map(({ op, word }) => ({
    layout: 'inline' as const,
    op,
    prompt: op,
    answer: word,
  }))
}

/** Ex. 7 / 8 — 2 + et 2 −, nombres 100–9999 dans la grille (7 colonnes). */
function genAddSubFour(rng: Rng): MathItem[] {
  const width = 7
  const mkAdd = (): MathItem => {
    const a = int(rng, 100, 9999)
    const b = int(rng, 100, 9999)
    return withFixedColumnWidth(columnItem('+', a, b, a + b, false), width)
  }
  const mkSub = (): MathItem => {
    let a = int(rng, 100, 9999)
    let b = int(rng, 100, 9999)
    if (b > a) [a, b] = [b, a]
    while (a === b) {
      a = int(rng, 100, 9999)
      b = int(rng, 100, Math.min(a, 9999))
    }
    return withFixedColumnWidth(columnItem('−', a, b, a - b, false), width)
  }
  return shuffle(rng, [mkAdd(), mkAdd(), mkSub(), mkSub()])
}

/** × 100–999 × 11–99 et ÷ 1000–9999 ÷ 2–9. */
function genMulDivPair(rng: Rng, empty: boolean): MathItem[] {
  const a = int(rng, 100, 999)
  const b = int(rng, 11, 99)
  const mul = withFixedColumnWidth(columnItem('×', a, b, a * b, empty), 7)
  const d = int(rng, 2, 9)
  const qMin = Math.ceil(1000 / d)
  const qMax = Math.floor(9999 / d)
  const quot = int(rng, qMin, qMax)
  const div = withFixedDivisionWorkRows(
    withFixedDivisionWidth(divisionColumnItem(d * quot, d, empty), 4, 4),
  )
  return rng() < 0.5 ? [mul, div] : [div, mul]
}

/** Ex. 9 — nombres dans la grille. */
function genEx09(rng: Rng): MathItem[] {
  return genMulDivPair(rng, false)
}

/** Ex. 10 — même structure que l’ex. 9, nombres hors grille. */
function genEx10(rng: Rng): MathItem[] {
  return genMulDivPair(rng, true)
}

const FRACTION_WORDS: Array<{ term: string; n: number; d: number }> = [
  { term: 'un demi', n: 1, d: 2 },
  { term: 'un tiers', n: 1, d: 3 },
  { term: 'deux tiers', n: 2, d: 3 },
  { term: 'un quart', n: 1, d: 4 },
  { term: 'trois quarts', n: 3, d: 4 },
  { term: 'un cinquième', n: 1, d: 5 },
  { term: 'deux cinquièmes', n: 2, d: 5 },
  { term: 'trois cinquièmes', n: 3, d: 5 },
  { term: 'un sixième', n: 1, d: 6 },
  { term: 'cinq sixièmes', n: 5, d: 6 },
  { term: 'un huitième', n: 1, d: 8 },
  { term: 'trois huitièmes', n: 3, d: 8 },
  { term: 'un dixième', n: 1, d: 10 },
  { term: 'sept dixièmes', n: 7, d: 10 },
]

/** Ex. 11 — termes → fraction verticale. */
function genEx11(rng: Rng, count: number): MathItem[] {
  return shuffle(rng, FRACTION_WORDS)
    .slice(0, Math.max(1, count))
    .map(({ term, n, d }) => ({
      layout: 'inline' as const,
      prompt: `${term} =`,
      answer: `${n}/${d}`,
    }))
}

/** Ex. 12 / 13 — formes simples distinctes. */
function genFracShapes(rng: Rng, count: number, mode: 'color' | 'read'): MathItem[] {
  return genFracSingleItems(rng, Math.max(1, count)).map((item) => ({
    layout: 'fraction-shape' as const,
    fracShape: { ...item, mode },
    answer: `${item.n}/${item.d}`,
  }))
}

type ProblemPart = {
  prompt: string
  calcAnswer: string
  responseAnswer: string
  answer: string
}

type ProblemTemplate = (rng: Rng) => [ProblemPart, ProblemPart]

function money(n: number): string {
  return fmt(Math.round(n * 100) / 100)
}

/** Ex. 14 — pool de 10 problèmes courses (2 parties, nombres variables). */
const EX14_TEMPLATES: readonly ProblemTemplate[] = [
  (rng) => {
    const a = oneDecimal(rng, 20, 60)
    const b = oneDecimal(rng, 30, 80)
    const c = oneDecimal(rng, 15, 50)
    const total = Math.round((a + b + c) * 100) / 100
    const d1 = oneDecimal(rng, 15, 35)
    const d2 = oneDecimal(rng, 20, 45)
    const drink = Math.min(d1, d2)
    const spent = Math.round((total + drink) * 100) / 100
    const budget = Math.ceil(spent) + pick(rng, [5, 10, 15, 20])
    const reste = Math.round((budget - spent) * 100) / 100
    return [
      {
        prompt: `Nadia va au magasin avec ${budget} francs dans son porte-monnaie. Dans son panier, elle prend du riz à ${money(a)} francs et du poulet à ${money(b)} francs. Elle ajoute des carottes à ${money(c)} francs. Elle se rend à la caisse.\n\nQuelle somme paye-t-elle ?`,
        calcAnswer: `${money(a)} + ${money(b)} + ${money(c)} = ${money(total)}`,
        responseAnswer: `Nadia paye ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Nadia sort du magasin mais elle a oublié d’acheter à boire. Elle retourne dans le magasin. Elle hésite entre un soda à ${money(d1)} francs et de l’eau gazeuse à ${money(d2)} francs. Elle prend la moins chère.\n\nCombien d’argent reste-t-il après ses courses ?`,
        calcAnswer: `${budget} − ${money(total)} − ${money(drink)} = ${money(reste)}`,
        responseAnswer: `Il reste ${money(reste)} francs.`,
        answer: money(reste),
      },
    ]
  },
  (rng) => {
    const pain = oneDecimal(rng, 12, 35)
    const fromage = oneDecimal(rng, 25, 70)
    const fruit = oneDecimal(rng, 15, 45)
    const total = Math.round((pain + fromage + fruit) * 100) / 100
    const bus = oneDecimal(rng, 20, 40)
    const spent = Math.round((total + bus) * 100) / 100
    const budget = Math.ceil(spent) + pick(rng, [5, 10, 15])
    const reste = Math.round((budget - spent) * 100) / 100
    return [
      {
        prompt: `Omar a ${budget} francs. Il achète du pain à ${money(pain)} francs, du fromage à ${money(fromage)} francs et des fruits à ${money(fruit)} francs.\n\nCombien paye-t-il à la caisse ?`,
        calcAnswer: `${money(pain)} + ${money(fromage)} + ${money(fruit)} = ${money(total)}`,
        responseAnswer: `Omar paye ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `En rentrant, Omar prend le bus. Le ticket coûte ${money(bus)} francs.\n\nCombien lui reste-t-il ?`,
        calcAnswer: `${budget} − ${money(total)} − ${money(bus)} = ${money(reste)}`,
        responseAnswer: `Il lui reste ${money(reste)} francs.`,
        answer: money(reste),
      },
    ]
  },
  (rng) => {
    const pull = oneDecimal(rng, 250, 450)
    const chaussettes = oneDecimal(rng, 50, 120)
    const total = Math.round((pull + chaussettes) * 100) / 100
    const reduction = oneDecimal(rng, 30, 80)
    const paye = Math.round((total - reduction) * 100) / 100
    const budget = Math.ceil(paye) + pick(rng, [10, 20, 30])
    const reste = Math.round((budget - paye) * 100) / 100
    return [
      {
        prompt: `Léa veut acheter un pull à ${money(pull)} francs et des chaussettes à ${money(chaussettes)} francs.\n\nQuel est le prix total avant réduction ?`,
        calcAnswer: `${money(pull)} + ${money(chaussettes)} = ${money(total)}`,
        responseAnswer: `Le total est ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Le magasin offre une réduction de ${money(reduction)} francs. Léa paie avec ${budget} francs.\n\nCombien lui reste-t-il ?`,
        calcAnswer: `${money(total)} − ${money(reduction)} = ${money(paye)} ; ${budget} − ${money(paye)} = ${money(reste)}`,
        responseAnswer: `Il lui reste ${money(reste)} francs.`,
        answer: money(reste),
      },
    ]
  },
  (rng) => {
    const n = int(rng, 3, 6)
    const prix = oneDecimal(rng, 12, 35)
    const total = Math.round(n * prix * 100) / 100
    const billet = total <= 20 ? 20 : total <= 50 ? 50 : 100
    const rendu = Math.round((billet - total) * 100) / 100
    return [
      {
        prompt: `Yanis achète ${n} cahiers à ${money(prix)} francs chacun.\n\nCombien doit-il payer ?`,
        calcAnswer: `${n} × ${money(prix)} = ${money(total)}`,
        responseAnswer: `Yanis doit payer ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Il donne un billet de ${billet} francs.\n\nCombien la caissière lui rend-elle ?`,
        calcAnswer: `${billet} − ${money(total)} = ${money(rendu)}`,
        responseAnswer: `On lui rend ${money(rendu)} francs.`,
        answer: money(rendu),
      },
    ]
  },
  (rng) => {
    const lait = oneDecimal(rng, 12, 25)
    const nLait = int(rng, 2, 4)
    const pain = oneDecimal(rng, 15, 30)
    const total = Math.round((lait * nLait + pain) * 100) / 100
    const budget = Math.max(1, Math.floor(total) - int(rng, 1, 3))
    const manque = Math.round((total - budget) * 100) / 100
    return [
      {
        prompt: `Sara achète ${nLait} briques de lait à ${money(lait)} francs chacune et un pain à ${money(pain)} francs.\n\nQuel est le montant des courses ?`,
        calcAnswer: `${nLait} × ${money(lait)} + ${money(pain)} = ${money(total)}`,
        responseAnswer: `Les courses coûtent ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Sara n’a que ${budget} francs sur elle.\n\nCombien lui manque-t-il ?`,
        calcAnswer: `${money(total)} − ${budget} = ${money(manque)}`,
        responseAnswer: `Il lui manque ${money(manque)} francs.`,
        answer: money(manque),
      },
    ]
  },
  (rng) => {
    const a = oneDecimal(rng, 40, 90)
    const b = oneDecimal(rng, 30, 70)
    const c = oneDecimal(rng, 20, 60)
    const total = Math.round((a + b + c) * 100) / 100
    const parts = 2
    const share = Math.round((total / parts) * 100) / 100
    return [
      {
        prompt: `Deux amies partagent l’addition d’un café. Les boissons coûtent ${money(a)} francs, les gâteaux ${money(b)} francs et les thés ${money(c)} francs.\n\nQuel est le total de l’addition ?`,
        calcAnswer: `${money(a)} + ${money(b)} + ${money(c)} = ${money(total)}`,
        responseAnswer: `L’addition est de ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Elles partagent la note en ${parts} parts égales.\n\nCombien chacune paie-t-elle ?`,
        calcAnswer: `${money(total)} ÷ ${parts} = ${money(share)}`,
        responseAnswer: `Chacune paie ${money(share)} francs.`,
        answer: money(share),
      },
    ]
  },
  (rng) => {
    const kg = oneDecimal(rng, 12, 25)
    const prixKg = oneDecimal(rng, 20, 40)
    const total = Math.round(kg * prixKg * 100) / 100
    const billet = total <= 20 ? 20 : total <= 50 ? 50 : 100
    const rendu = Math.round((billet - total) * 100) / 100
    return [
      {
        prompt: `À la market, Hugo achète ${money(kg)} kg de pommes à ${money(prixKg)} francs le kilo.\n\nCombien paie-t-il ?`,
        calcAnswer: `${money(kg)} × ${money(prixKg)} = ${money(total)}`,
        responseAnswer: `Hugo paie ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Il tend un billet de ${billet} francs.\n\nCombien lui rend-on ?`,
        calcAnswer: `${billet} − ${money(total)} = ${money(rendu)}`,
        responseAnswer: `On lui rend ${money(rendu)} francs.`,
        answer: money(rendu),
      },
    ]
  },
  (rng) => {
    const livre = oneDecimal(rng, 80, 160)
    const stylo = oneDecimal(rng, 15, 40)
    const nStylo = int(rng, 2, 5)
    const total = Math.round((livre + stylo * nStylo) * 100) / 100
    const budget = Math.ceil(total) + pick(rng, [5, 10, 15, 20])
    const reste = Math.round((budget - total) * 100) / 100
    return [
      {
        prompt: `Inès achète un livre à ${money(livre)} francs et ${nStylo} stylos à ${money(stylo)} francs chacun.\n\nCombien dépense-t-elle ?`,
        calcAnswer: `${money(livre)} + ${nStylo} × ${money(stylo)} = ${money(total)}`,
        responseAnswer: `Inès dépense ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Elle avait ${budget} francs.\n\nCombien lui reste-t-il ?`,
        calcAnswer: `${budget} − ${money(total)} = ${money(reste)}`,
        responseAnswer: `Il lui reste ${money(reste)} francs.`,
        answer: money(reste),
      },
    ]
  },
  (rng) => {
    const pizza = oneDecimal(rng, 120, 220)
    const n = int(rng, 2, 4)
    const boisson = oneDecimal(rng, 20, 50)
    const total = Math.round((pizza * n + boisson) * 100) / 100
    const personnes = n
    const share = Math.round((total / personnes) * 100) / 100
    return [
      {
        prompt: `Pour le repas, la famille commande ${n} pizzas à ${money(pizza)} francs chacune et une boisson à ${money(boisson)} francs.\n\nQuel est le prix total ?`,
        calcAnswer: `${n} × ${money(pizza)} + ${money(boisson)} = ${money(total)}`,
        responseAnswer: `Le total est ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Le montant est partagé également entre ${personnes} personnes.\n\nCombien chacune paie-t-elle ?`,
        calcAnswer: `${money(total)} ÷ ${personnes} = ${money(share)}`,
        responseAnswer: `Chacune paie ${money(share)} francs.`,
        answer: money(share),
      },
    ]
  },
  (rng) => {
    const a = oneDecimal(rng, 35, 80)
    const b = oneDecimal(rng, 40, 90)
    const c = oneDecimal(rng, 25, 70)
    const total = Math.round((a + b + c) * 100) / 100
    const plusCher = Math.max(a, b, c)
    const moinsCher = Math.min(a, b, c)
    const ecart = Math.round((plusCher - moinsCher) * 100) / 100
    return [
      {
        prompt: `Trois articles coûtent ${money(a)} francs, ${money(b)} francs et ${money(c)} francs.\n\nQuel est le prix total ?`,
        calcAnswer: `${money(a)} + ${money(b)} + ${money(c)} = ${money(total)}`,
        responseAnswer: `Le total est ${money(total)} francs.`,
        answer: money(total),
      },
      {
        prompt: `Quelle est la différence entre l’article le plus cher et le moins cher ?`,
        calcAnswer: `${money(plusCher)} − ${money(moinsCher)} = ${money(ecart)}`,
        responseAnswer: `La différence est ${money(ecart)} francs.`,
        answer: money(ecart),
      },
    ]
  },
]

/** Ex. 15 — pool de 10 problèmes salaire / partage (2 parties). */
const EX15_TEMPLATES: readonly ProblemTemplate[] = [
  (rng) => {
    const rate = int(rng, 6, 12)
    const hours = pick(rng, [4, 8])
    const gain = rate * hours
    const half = gain / 2
    const friends = 2
    const share = half / friends
    return [
      {
        prompt: `Karim est mécanicien. Il gagne ${rate} francs par heure. Aujourd’hui, il travaille pendant ${hours} heures.\n\nCombien d’argent a-t-il gagné aujourd’hui ?`,
        calcAnswer: `${rate} × ${hours} = ${gain}`,
        responseAnswer: `Karim a gagné ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Le jour suivant, Karim propose de donner la moitié de cet argent à ses amis Ahmed et Yeva. Danil refuse. La moitié est donc partagée également entre Ahmed et Yeva.\n\nCombien d’argent reçoit Yeva ?`,
        calcAnswer: `${gain} ÷ 2 = ${half} ; ${half} ÷ ${friends} = ${share}`,
        responseAnswer: `Yeva reçoit ${share} francs.`,
        answer: String(share),
      },
    ]
  },
  (rng) => {
    const rate = int(rng, 8, 15)
    const hours = pick(rng, [4, 6, 8])
    const gain = rate * hours
    const keep = gain / 2
    const save = gain - keep
    return [
      {
        prompt: `Maya travaille ${hours} heures et gagne ${rate} francs par heure.\n\nCombien gagne-t-elle ?`,
        calcAnswer: `${hours} × ${rate} = ${gain}`,
        responseAnswer: `Maya gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Elle garde la moitié de cet argent et place le reste à la banque.\n\nCombien place-t-elle à la banque ?`,
        calcAnswer: `${gain} − ${keep} = ${save}`,
        responseAnswer: `Elle place ${save} francs à la banque.`,
        answer: String(save),
      },
    ]
  },
  (rng) => {
    const days = int(rng, 3, 5)
    const perDay = int(rng, 40, 80)
    const gain = days * perDay
    const lunch = int(rng, 8, 15)
    const reste = gain - lunch * days
    return [
      {
        prompt: `Tom aide dans un magasin pendant ${days} jours. Il gagne ${perDay} francs par jour.\n\nCombien gagne-t-il en tout ?`,
        calcAnswer: `${days} × ${perDay} = ${gain}`,
        responseAnswer: `Tom gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Chaque jour, il dépense ${lunch} francs pour le repas.\n\nCombien lui reste-t-il à la fin ?`,
        calcAnswer: `${gain} − ${days} × ${lunch} = ${reste}`,
        responseAnswer: `Il lui reste ${reste} francs.`,
        answer: String(reste),
      },
    ]
  },
  (rng) => {
    const rate = int(rng, 10, 18)
    const hours = int(rng, 6, 10)
    const gain = rate * hours
    const gift = int(rng, 10, 25)
    const reste = gain - gift
    return [
      {
        prompt: `Amina donne des cours pendant ${hours} heures à ${rate} francs l’heure.\n\nCombien gagne-t-elle ?`,
        calcAnswer: `${hours} × ${rate} = ${gain}`,
        responseAnswer: `Amina gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Elle offre ${gift} francs à sa sœur.\n\nCombien lui reste-t-il ?`,
        calcAnswer: `${gain} − ${gift} = ${reste}`,
        responseAnswer: `Il lui reste ${reste} francs.`,
        answer: String(reste),
      },
    ]
  },
  (rng) => {
    const boxes = int(rng, 4, 9)
    const perBox = int(rng, 5, 12)
    const total = boxes * perBox
    const keep = int(rng, 2, 4)
    const sold = total - keep
    return [
      {
        prompt: `Un jardinier récolte ${boxes} caisses de ${perBox} pommes chacune.\n\nCombien de pommes a-t-il en tout ?`,
        calcAnswer: `${boxes} × ${perBox} = ${total}`,
        responseAnswer: `Il a ${total} pommes.`,
        answer: String(total),
      },
      {
        prompt: `Il en garde ${keep} et vend le reste.\n\nCombien de pommes vend-il ?`,
        calcAnswer: `${total} − ${keep} = ${sold}`,
        responseAnswer: `Il vend ${sold} pommes.`,
        answer: String(sold),
      },
    ]
  },
  (rng) => {
    const rate = int(rng, 7, 14)
    const hours = pick(rng, [3, 6, 9])
    const gain = rate * hours
    const third = gain / 3
    const reste = gain - third
    return [
      {
        prompt: `Luis travaille ${hours} heures à ${rate} francs l’heure.\n\nCombien gagne-t-il ?`,
        calcAnswer: `${hours} × ${rate} = ${gain}`,
        responseAnswer: `Luis gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Il donne le tiers de cet argent à ses parents et garde le reste.\n\nCombien garde-t-il ?`,
        calcAnswer: `${gain} ÷ 3 = ${third} ; ${gain} − ${third} = ${reste}`,
        responseAnswer: `Il garde ${reste} francs.`,
        answer: String(reste),
      },
    ]
  },
  (rng) => {
    const weeks = int(rng, 2, 4)
    const perWeek = int(rng, 50, 90)
    const gain = weeks * perWeek
    const buy = int(rng, 30, 70)
    const reste = gain - buy
    return [
      {
        prompt: `Nora range des rayons pendant ${weeks} semaines. Elle gagne ${perWeek} francs par semaine.\n\nCombien gagne-t-elle au total ?`,
        calcAnswer: `${weeks} × ${perWeek} = ${gain}`,
        responseAnswer: `Nora gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Avec cet argent, elle achète un livre à ${buy} francs.\n\nCombien lui reste-t-il ?`,
        calcAnswer: `${gain} − ${buy} = ${reste}`,
        responseAnswer: `Il lui reste ${reste} francs.`,
        answer: String(reste),
      },
    ]
  },
  (rng) => {
    const rate = int(rng, 9, 16)
    const hours = pick(rng, [4, 8])
    const gain = rate * hours
    const parts = 4
    const share = gain / parts
    return [
      {
        prompt: `Paul gagne ${rate} francs par heure et travaille ${hours} heures.\n\nCombien a-t-il gagné ?`,
        calcAnswer: `${rate} × ${hours} = ${gain}`,
        responseAnswer: `Paul a gagné ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Il partage cet argent également entre ${parts} personnes de sa famille.\n\nCombien chacune reçoit-elle ?`,
        calcAnswer: `${gain} ÷ ${parts} = ${share}`,
        responseAnswer: `Chacune reçoit ${share} francs.`,
        answer: String(share),
      },
    ]
  },
  (rng) => {
    const morning = int(rng, 3, 5)
    const afternoon = int(rng, 2, 4)
    const rate = int(rng, 8, 14)
    const hours = morning + afternoon
    const gain = hours * rate
    return [
      {
        prompt: `Rita travaille ${morning} heures le matin et ${afternoon} heures l’après-midi.\n\nCombien d’heures travaille-t-elle en tout ?`,
        calcAnswer: `${morning} + ${afternoon} = ${hours}`,
        responseAnswer: `Rita travaille ${hours} heures.`,
        answer: String(hours),
      },
      {
        prompt: `Elle est payée ${rate} francs par heure.\n\nCombien gagne-t-elle ce jour-là ?`,
        calcAnswer: `${hours} × ${rate} = ${gain}`,
        responseAnswer: `Elle gagne ${gain} francs.`,
        answer: String(gain),
      },
    ]
  },
  (rng) => {
    const rate = int(rng, 6, 11)
    const hours = int(rng, 6, 10)
    const gain = rate * hours
    const tip = int(rng, 5, 15)
    const total = gain + tip
    return [
      {
        prompt: `Sam aide au restaurant. Il travaille ${hours} heures à ${rate} francs l’heure.\n\nCombien gagne-t-il sans le pourboire ?`,
        calcAnswer: `${hours} × ${rate} = ${gain}`,
        responseAnswer: `Sam gagne ${gain} francs.`,
        answer: String(gain),
      },
      {
        prompt: `Un client lui laisse ${tip} francs de pourboire.\n\nCombien a-t-il en tout ?`,
        calcAnswer: `${gain} + ${tip} = ${total}`,
        responseAnswer: `Il a ${total} francs en tout.`,
        answer: String(total),
      },
    ]
  },
]

function partsToItems(parts: [ProblemPart, ProblemPart]): MathItem[] {
  return parts.map((p) => ({
    layout: 'text' as const,
    prompt: p.prompt,
    calcAnswer: p.calcAnswer,
    responseAnswer: p.responseAnswer,
    answer: p.answer,
  }))
}

function genEx14(rng: Rng): MathItem[] {
  return partsToItems(pick(rng, EX14_TEMPLATES)(rng))
}

function genEx15(rng: Rng): MathItem[] {
  return partsToItems(pick(rng, EX15_TEMPLATES)(rng))
}

type NamedFigure = {
  figure: Figure
  name: string
  props: [string, string]
  dims?: MathItem['dims']
}

const BARE = { bare: true } as const

const FIG_SQUARE: NamedFigure = {
  figure: 'square',
  name: 'carré',
  props: ['4 côtés égaux', '4 angles droits'],
  dims: { ...BARE },
}
const FIG_RECT: NamedFigure = {
  figure: 'rectangle',
  name: 'rectangle',
  props: ['côtés opposés égaux', '4 angles droits'],
  dims: { ...BARE },
}
const FIG_RHOMBUS: NamedFigure = {
  figure: 'rhombus',
  name: 'losange',
  props: ['4 côtés égaux', 'diagonales perpendiculaires'],
  dims: { ...BARE },
}
const FIG_PARA: NamedFigure = {
  figure: 'parallelogram',
  name: 'parallélogramme',
  props: ['côtés opposés parallèles', 'côtés opposés égaux'],
  dims: { ...BARE },
}
const FIG_RIGHT_TRI: NamedFigure = {
  figure: 'triangle',
  name: 'triangle rectangle',
  props: ['un angle droit', '3 côtés'],
  dims: { ...BARE, triangleKind: 'right' },
}
const FIG_EQUI: NamedFigure = {
  figure: 'triangle',
  name: 'triangle équilatéral',
  props: ['3 côtés égaux', '3 angles égaux'],
  dims: { ...BARE, triangleKind: 'equilateral' },
}
const FIG_ISO: NamedFigure = {
  figure: 'triangle',
  name: 'triangle isocèle',
  props: ['2 côtés égaux', '2 angles égaux'],
  dims: { ...BARE, triangleKind: 'isosceles' },
}
const FIG_CIRCLE: NamedFigure = {
  figure: 'circle',
  name: 'cercle',
  props: ['tous les points à égale distance du centre', 'pas de côté'],
  dims: { ...BARE },
}
const FIG_TRAP: NamedFigure = {
  figure: 'trapezoid',
  name: 'trapèze',
  props: ['une paire de côtés parallèles', '4 côtés'],
  dims: { ...BARE, trapezoidKind: 'isosceles' },
}
const FIG_PENTA: NamedFigure = {
  figure: 'pentagon',
  name: 'pentagone',
  props: ['5 côtés', '5 sommets'],
  dims: { ...BARE },
}

function namedFigureCard(fig: NamedFigure, withProps: boolean): MathItem {
  const lines = withProps
    ? [
        { label: 'Nom', answer: fig.name },
        { label: 'Propriété 1', answer: fig.props[0] },
        { label: 'Propriété 2', answer: fig.props[1] },
      ]
    : [{ label: 'Nom', answer: fig.name }]
  return {
    layout: 'geo',
    figure: fig.figure,
    dims: fig.dims,
    geoNameCard: true,
    propertyLines: lines,
    answer: withProps ? `${fig.name} ; ${fig.props[0]} ; ${fig.props[1]}` : fig.name,
  }
}

/** Choix lié ex. 16 / 17 : losange dans l’un, parallélogramme dans l’autre. */
function rhombusInEx16(worksheetSeed: number): boolean {
  return createRng(worksheetSeed ^ 0x16f17a)() < 0.5
}

/**
 * Ex. 16 — 3 formes : (carré|rectangle), (losange|parallélogramme),
 * (équilatéral|rectangle|isocèle). Ordre mélangé, cadres empilés.
 */
function genEx16(rng: Rng, worksheetSeed: number): MathItem[] {
  const form1 = pick(rng, [FIG_SQUARE, FIG_RECT])
  const form2 = rhombusInEx16(worksheetSeed) ? FIG_RHOMBUS : FIG_PARA
  const form3 = pick(rng, [FIG_EQUI, FIG_RIGHT_TRI, FIG_ISO])
  return shuffle(rng, [form1, form2, form3]).map((fig) => namedFigureCard(fig, true))
}

/**
 * Ex. 17 — cercle, (parallélogramme|losange inverse de 16), (trapèze|pentagone).
 */
function genEx17(rng: Rng, worksheetSeed: number): MathItem[] {
  const form1 = FIG_CIRCLE
  const form2 = rhombusInEx16(worksheetSeed) ? FIG_PARA : FIG_RHOMBUS
  const form3 = pick(rng, [FIG_TRAP, FIG_PENTA])
  return shuffle(rng, [form1, form2, form3]).map((fig) => namedFigureCard(fig, false))
}

/** Ex. 18 — symétrie axiale. */
function genEx18(rng: Rng): MathItem[] {
  const tpl = pickSymmetryTemplate(rng)
  return [
    {
      layout: 'symmetry-grid' as const,
      prompt: 'Reproduisez la figure par symétrie axiale par rapport à l’axe.',
      symmetryFigure: tpl,
      answer: tpl.id,
    },
  ]
}

/** Ex. 19 — mesurer 3 segments + QCM. */
function genEx19(rng: Rng): MathItem[] {
  const lengthsMm = shuffle(rng, [
    int(rng, 25, 45),
    int(rng, 50, 80),
    int(rng, 90, 120),
  ])
  const units: Array<'mm' | 'cm'> = shuffle(rng, ['mm', 'cm', pick(rng, ['mm', 'cm'] as const)])
  // Garantir au moins 1 cm et 1 mm.
  if (!units.includes('cm')) units[0] = 'cm'
  if (!units.includes('mm')) units[1] = 'mm'
  const segments = lengthsMm.map((mm, i) => ({
    mm,
    unit: units[i]!,
    display: units[i] === 'cm' ? fmt(mm / 10) : String(mm),
  }))
  const letters = ['a', 'b', 'c'] as const
  const longest = segments.reduce((best, s, i) => (s.mm > segments[best]!.mm ? i : best), 0)
  const shortest = segments.reduce((best, s, i) => (s.mm < segments[best]!.mm ? i : best), 0)
  const qLongFirst = rng() < 0.5
  return [
    {
      layout: 'segment-measure' as const,
      prompt: 'Mesurez les segments avec la règle.',
      segments,
      selectVariant: 'pills',
      options: qLongFirst
        ? [
            'Quel segment est le plus long ?',
            'Quel segment est le plus court ?',
          ]
        : [
            'Quel segment est le plus court ?',
            'Quel segment est le plus long ?',
          ],
      answer: qLongFirst
        ? `${letters[longest]} ; ${letters[shortest]}`
        : `${letters[shortest]} ; ${letters[longest]}`,
      labels: segments.map((s) => `${s.display} ${s.unit}`),
    },
  ]
}

/** Ex. 20 — conversions m/dm/cm/mm uniquement. */
function genEx20(rng: Rng, count: number): MathItem[] {
  const units = ['m', 'dm', 'cm', 'mm'] as const
  const factors: Record<(typeof units)[number], number> = { m: 1000, dm: 100, cm: 10, mm: 1 }
  const items: MathItem[] = []
  const usedPairs = new Set<string>()
  while (items.length < count) {
    const from = pick(rng, [...units])
    let to = pick(rng, [...units])
    while (to === from) to = pick(rng, [...units])
    const key = `${from}->${to}`
    if (usedPairs.has(key)) continue
    usedPairs.add(key)
    const valueMm = int(rng, 1, 50) * factors[from]
    // Valeur « ronde » dans l’unité de départ.
    const value = valueMm / factors[from]
    const result = valueMm / factors[to]
    items.push({
      layout: 'inline',
      convert: { value: fmt(value), from, to },
      prompt: `${fmt(value)} ${from} = □ ${to}`,
      answer: fmt(result),
    })
  }
  return items
}

/** Ex. 21 — fractions → décimaux, dénominateurs distincts, non entiers. */
function genEx21(rng: Rng, count: number): MathItem[] {
  const dens = shuffle(rng, [2, 4, 5, 8, 10]).slice(0, count)
  while (dens.length < count) dens.push(pick(rng, [2, 4, 5, 8, 10]))
  return dens.map((d) => {
    let n = int(rng, 1, d - 1)
    while (n % d === 0) n = int(rng, 1, d - 1)
    const g = gcd(n, d)
    // Garder une fraction non entière.
    const nn = n / g
    const dd = d / g
    const value = nn / dd
    return {
      layout: 'inline' as const,
      prompt: `${nn}/${dd} =`,
      answer: fmt(Math.round(value * 1000) / 1000),
    }
  })
}

function dualGeo(
  figure: Figure,
  dims: NonNullable<MathItem['dims']>,
  periExpr: string,
  areaExpr: string,
  peri: number,
  area: number,
): MathItem {
  return {
    layout: 'geo',
    figure,
    dims: { ...dims, unit: dims.unit ?? 'cm' },
    geoDualPads: true,
    geoDualTight: true,
    calcAnswer: periExpr,
    calcAnswerSecondary: areaExpr,
    propertyLines: [
      { label: 'Périmètre', answer: `${fmt(peri)} cm` },
      { label: 'Aire', answer: `${fmt(area)} cm²` },
    ],
    answer: `Périmètre = ${fmt(peri)} cm ; Aire = ${fmt(area)} cm²`,
  }
}

/** Ex. 22 — carré décimal. */
function genEx22(rng: Rng): MathItem[] {
  const side = oneDecimal(rng, 20, 90)
  const peri = Math.round(4 * side * 10) / 10
  const area = Math.round(side * side * 100) / 100
  return [
    dualGeo(
      'square',
      { side, length: side },
      `4 × ${fmt(side)}`,
      `${fmt(side)} × ${fmt(side)}`,
      peri,
      area,
    ),
  ]
}

/** Ex. 23 — rectangle décimal. */
function genEx23(rng: Rng): MathItem[] {
  const length = oneDecimal(rng, 30, 120)
  let width = oneDecimal(rng, 20, 90)
  while (Math.abs(width - length) < 0.05) width = oneDecimal(rng, 20, 90)
  const peri = Math.round(2 * (length + width) * 10) / 10
  const area = Math.round(length * width * 100) / 100
  return [
    dualGeo(
      'rectangle',
      { length, width },
      `2 × (${fmt(length)} + ${fmt(width)})`,
      `${fmt(length)} × ${fmt(width)}`,
      peri,
      area,
    ),
  ]
}

/** Ex. 24 — triangle (a, c, h décimaux ; b entier). */
function genEx24(rng: Rng): MathItem[] {
  const a = oneDecimal(rng, 50, 120)
  let b = int(rng, 4, 12)
  while (Math.abs(b - a) < 0.05) b = int(rng, 4, 12)
  let c = oneDecimal(rng, 40, 110)
  while (Math.abs(c - a) < 0.05 || Math.abs(c - b) < 0.05) c = oneDecimal(rng, 40, 110)
  const h = oneDecimal(rng, 20, 60)
  const peri = Math.round((a + b + c) * 10) / 10
  const area = Math.round(((a * h) / 2) * 100) / 100
  return [
    dualGeo(
      'triangle',
      { a, b, c, height: h, triangleKind: 'scalene' },
      `${fmt(a)} + ${fmt(b)} + ${fmt(c)}`,
      `(${fmt(a)} × ${fmt(h)}) ÷ 2`,
      peri,
      area,
    ),
  ]
}

/** Ex. 25 — aire du carré → côté (cote absente ; brouillon comme ex. 22). */
function genEx25(rng: Rng): MathItem[] {
  const side = int(rng, 3, 12)
  const area = side * side
  return [
    {
      layout: 'geo',
      figure: 'square',
      // Pas de cote affichée : c’est la valeur cherchée.
      dims: { unit: 'cm' },
      prompt: `L’aire de ce carré est ${area} cm². Quelle est la longueur d’un côté ?`,
      geoDualPads: true,
      geoDualTight: true,
      calcAnswer: `√${area} = ${side}`,
      propertyLines: [{ label: 'Côté', answer: `${side} cm` }],
      answer: `${side} cm`,
    },
  ]
}

/** Ex. 26 — aire rectangle + un côté → autre côté (cote cherchée masquée). */
function genEx26(rng: Rng): MathItem[] {
  const length = int(rng, 4, 14)
  let width = int(rng, 2, 10)
  while (width === length) width = int(rng, 2, 10)
  const area = length * width
  const giveLength = rng() < 0.5
  const known = giveLength ? length : width
  const unknown = giveLength ? width : length
  const knownLabel = giveLength ? 'longueur' : 'largeur'
  return [
    {
      layout: 'geo',
      figure: 'rectangle',
      // Afficher uniquement le côté connu ; masquer celui cherché.
      dims: giveLength ? { length, unit: 'cm' } : { width, unit: 'cm' },
      prompt: `L’aire de ce rectangle est ${area} cm². La ${knownLabel} mesure ${known} cm. Quelle est la longueur de l’autre côté ?`,
      geoDualPads: true,
      geoDualTight: true,
      calcAnswer: `${area} ÷ ${known} = ${unknown}`,
      propertyLines: [{ label: 'Côté', answer: `${unknown} cm` }],
      answer: `${unknown} cm`,
    },
  ]
}

/** Ex. 27 — cadran I : grille 20×20 visible, axes prolongés à 22 avec flèches. */
function genEx27(rng: Rng): MathItem[] {
  const ptsPlace: Array<{ x: number; y: number; label: string }> = []
  const ptsRead: Array<{ x: number; y: number; label: string }> = []
  const used = new Set<string>()
  const take = (bag: typeof ptsPlace, label: string) => {
    let x = int(rng, 1, 18)
    let y = int(rng, 1, 18)
    let g = 0
    while (used.has(`${x},${y}`) && g < 40) {
      x = int(rng, 1, 18)
      y = int(rng, 1, 18)
      g++
    }
    used.add(`${x},${y}`)
    bag.push({ x, y, label })
  }
  ;['A', 'B', 'C'].forEach((l) => take(ptsPlace, l))
  ;['D', 'E', 'F'].forEach((l) => take(ptsRead, l))
  return [
    {
      layout: 'coord',
      prompt:
        '1. Graduez et nommez les axes sur le plan.\n2. Placez les points suivants sur le plan.\n3. Écrivez les coordonnées des points suivants.',
      coordScene: {
        variant: 'axes',
        cols: 22,
        rows: 22,
        visibleCols: 20,
        visibleRows: 20,
        axis: 'numeric',
        rangeX: 22,
        rangeY: 22,
        originCol: 0,
        originRow: 0,
        hideAxes: false,
        hideAxisLabels: true,
        axisArrows: true,
        showOrigin: true,
        cellMm: 6,
        unitSquares: 1,
        marks: [
          ...ptsPlace.map((p) => ({
            x: p.x,
            y: p.y,
            kind: 'point' as const,
            label: p.label,
            reveal: 'answer' as const,
          })),
          ...ptsRead.map((p) => ({
            x: p.x,
            y: p.y,
            kind: 'point' as const,
            label: p.label,
            reveal: 'always' as const,
          })),
        ],
      },
      coordQuestions: [
        ...ptsPlace.map((p) => ({
          prompt: `Placez le point ${p.label}(${p.x} ; ${p.y}).`,
          answer: `(${p.x} ; ${p.y})`,
          reply: 'pair' as const,
        })),
        ...ptsRead.map((p) => ({
          prompt: `Écrivez les coordonnées du point ${p.label}.`,
          answer: `(${p.x} ; ${p.y})`,
          reply: 'pair' as const,
        })),
      ],
      answer: [...ptsPlace, ...ptsRead].map((p) => `${p.label}(${p.x};${p.y})`).join(' ; '),
    },
  ]
}

/** Ex. 28 — plan de métro. */
function genEx28(rng: Rng): MathItem[] {
  const map = pickMetroMap(rng)
  const questions = generateMetroQuestions(rng, map)
  return [
    {
      layout: 'metro-map' as const,
      prompt: 'Répondez aux questions. Écrivez uniquement les coordonnées.',
      metroMap: map,
      metroQuestions: questions,
      answer: questions.map((q) => q.answer).join(' ; '),
    },
  ]
}

export function tryGenerateTcmCfrItems(
  typeId: string,
  count: number,
  rng: Rng,
  worksheetSeed = 0,
): MathItem[] | null {
  if (!isTcmCfrType(typeId)) return null
  // Page Informations : générée via `generateTcmInformations` dans `math/generate.ts`.
  if (typeId === 'tcm-cfr-consignes') return []
  if (typeId === 'tcm-cfr-ex01') return genEx01(rng, count)
  if (typeId === 'tcm-cfr-ex02') return genEx02(rng, count)
  if (typeId === 'tcm-cfr-ex03') return genEx03(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex04') return genEx04(rng, count)
  if (typeId === 'tcm-cfr-ex05') return genEx05(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex06') return genEx06(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex07') return genAddSubFour(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex08') return genAddSubFour(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex09') return genEx09(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex10') return genEx10(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex11') return genEx11(rng, count)
  if (typeId === 'tcm-cfr-ex12') return genFracShapes(rng, count, 'color')
  if (typeId === 'tcm-cfr-ex13') return genFracShapes(rng, count, 'read')
  if (typeId === 'tcm-cfr-ex14') return genEx14(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex15') return genEx15(rng).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex16') return genEx16(rng, worksheetSeed).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex17') return genEx17(rng, worksheetSeed).slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex18') return genEx18(rng)
  if (typeId === 'tcm-cfr-ex19') return genEx19(rng)
  if (typeId === 'tcm-cfr-ex20') return genEx20(rng, count)
  if (typeId === 'tcm-cfr-ex21') return genEx21(rng, count)
  if (typeId === 'tcm-cfr-ex22') return genEx22(rng)
  if (typeId === 'tcm-cfr-ex23') return genEx23(rng)
  if (typeId === 'tcm-cfr-ex24') return genEx24(rng)
  if (typeId === 'tcm-cfr-ex25') return genEx25(rng)
  if (typeId === 'tcm-cfr-ex26') return genEx26(rng)
  if (typeId === 'tcm-cfr-ex27') return genEx27(rng)
  if (typeId === 'tcm-cfr-ex28') return genEx28(rng)
  return null
}

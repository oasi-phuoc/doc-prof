/**
 * Générateurs d’items TCM CFR (types `tcm-cfr-*`).
 */
import { genFracSingleItems } from '@/math/fraction-shapes'
import { int, pick, shuffle, type Rng } from '@/math/rng'
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

/** Ex. 7 / 8 — 2 + et 2 −, nombres 100–9999. */
function genAddSubFour(rng: Rng): MathItem[] {
  const width = 5
  const mkAdd = (): MathItem => {
    const a = int(rng, 100, 9999)
    const b = int(rng, 100, 9999)
    return withFixedColumnWidth(columnItem('+', a, b, a + b, true), width)
  }
  const mkSub = (): MathItem => {
    let a = int(rng, 100, 9999)
    let b = int(rng, 100, 9999)
    if (b > a) [a, b] = [b, a]
    while (a === b) {
      a = int(rng, 100, 9999)
      b = int(rng, 100, Math.min(a, 9999))
    }
    return withFixedColumnWidth(columnItem('−', a, b, a - b, true), width)
  }
  return shuffle(rng, [mkAdd(), mkAdd(), mkSub(), mkSub()])
}

/** Ex. 9 — × 100–999 × 11–99 et ÷ 1000–9999 ÷ 2–9. */
function genEx09(rng: Rng): MathItem[] {
  const a = int(rng, 100, 999)
  const b = int(rng, 11, 99)
  const mul = withFixedColumnWidth(columnItem('×', a, b, a * b, true), 6)
  const d = int(rng, 2, 9)
  const qMin = Math.ceil(1000 / d)
  const qMax = Math.floor(9999 / d)
  const quot = int(rng, qMin, qMax)
  const div = withFixedDivisionWorkRows(
    withFixedDivisionWidth(divisionColumnItem(d * quot, d, true), 4, 4),
  )
  return rng() < 0.5 ? [mul, div] : [div, mul]
}

/** Ex. 10 — comme TCM 18 : entier 100–999 × 11–99 + décimal. */
function genEx10(rng: Rng): MathItem[] {
  const placesA = pick(rng, [2, 3] as const)
  const intDigits = 4 - placesA
  const intPart = intDigits === 1 ? int(rng, 1, 9) : int(rng, 10, 99)
  const fracMax = 10 ** placesA - 1
  const fracMin = placesA === 2 ? 10 : 100
  let frac = int(rng, fracMin, fracMax)
  while (frac % 10 === 0) frac = int(rng, fracMin, fracMax)
  const aDec = intPart + frac / 10 ** placesA
  let bTenths = int(rng, 11, 99)
  while (bTenths % 10 === 0) bTenths = int(rng, 11, 99)
  const bDec = bTenths / 10
  const product = Math.round(aDec * bDec * 10 ** (placesA + 1)) / 10 ** (placesA + 1)
  const mulDec = withFixedColumnWidth(columnItem('×', aDec, bDec, product, true), 6)
  const aInt = int(rng, 100, 999)
  const bInt = int(rng, 11, 99)
  const mulInt = withFixedColumnWidth(columnItem('×', aInt, bInt, aInt * bInt, true), 6)
  return rng() < 0.5 ? [mulInt, mulDec] : [mulDec, mulInt]
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

/** Ex. 14 — problème Nadia (2 questions). */
function genEx14(): MathItem[] {
  const riz = 3.4
  const poulet = 8.2
  const carottes = 4.3
  const total = Math.round((riz + poulet + carottes) * 100) / 100
  const soda = 2.1
  const eau = 2.8
  const boisson = Math.min(soda, eau)
  const reste = Math.round((50 - total - boisson) * 100) / 100
  return [
    {
      layout: 'text',
      prompt:
        'Nadia va au magasin avec 50 francs dans son porte-monnaie. Dans son panier, elle prend du riz à 3,40 francs et du poulet à 8,20 francs. Elle ajoute des carottes à 4,30 francs dans son panier. Elle se rend à la caisse.\n\nQuelle somme paye-t-elle ?',
      calcAnswer: `${fmt(riz)} + ${fmt(poulet)} + ${fmt(carottes)} = ${fmt(total)}`,
      responseAnswer: `Nadia paye ${fmt(total)} francs.`,
      answer: fmt(total),
    },
    {
      layout: 'text',
      prompt:
        'Nadia sort du magasin mais elle a oublié d’acheter à boire. Elle retourne dans le magasin. Elle hésite entre 2 boissons, un soda à 2,10 francs ou de l’eau gazeuse à 2,80 francs. Elle prend la moins chère.\n\nCombien d’argent reste-t-il après ses courses ?',
      calcAnswer: `50 − ${fmt(total)} − ${fmt(boisson)} = ${fmt(reste)}`,
      responseAnswer: `Il reste ${fmt(reste)} francs.`,
      answer: fmt(reste),
    },
  ]
}

/** Ex. 15 — problème Karim. */
function genEx15(): MathItem[] {
  const gain = 7 * 8
  const half = gain / 2
  const share = half / 2 // Ahmed + Yeva (Danil refuse) → 2 amis
  return [
    {
      layout: 'text',
      prompt:
        'Karim est mécanicien. Il travaille dans un garage et gagne 7 francs par heure. Aujourd’hui, il travaille pendant 8 heures.\n\nAujourd’hui, combien d’argent a-t-il gagné ?',
      calcAnswer: `7 × 8 = ${gain}`,
      responseAnswer: `Karim a gagné ${gain} francs.`,
      answer: String(gain),
    },
    {
      layout: 'text',
      prompt:
        'Le jour suivant, Karim retrouve Ahmed, Yeva et Danil dans un parc. Il propose de donner la moitié de l’argent gagné à ses 3 amis. Danil refuse, il ne veut pas d’argent. La moitié de l’argent de Karim est donc partagée avec le reste de ses amis. Ils reçoivent le même montant.\n\nCombien d’argent reçoit Yeva ?',
      calcAnswer: `${gain} ÷ 2 = ${half} ; ${half} ÷ 2 = ${share}`,
      responseAnswer: `Yeva reçoit ${share} francs.`,
      answer: String(share),
    },
  ]
}

type NamedFigure = {
  figure: Figure
  name: string
  props: [string, string]
  dims?: MathItem['dims']
}

const FIG_SQUARE: NamedFigure = {
  figure: 'square',
  name: 'carré',
  props: ['4 côtés égaux', '4 angles droits'],
  dims: { side: 3, length: 3, unit: 'cm' },
}
const FIG_RECT: NamedFigure = {
  figure: 'rectangle',
  name: 'rectangle',
  props: ['côtés opposés égaux', '4 angles droits'],
  dims: { length: 5, width: 3, unit: 'cm' },
}
const FIG_RHOMBUS: NamedFigure = {
  figure: 'rhombus',
  name: 'losange',
  props: ['4 côtés égaux', 'diagonales perpendiculaires'],
  dims: { side: 4, d1: 6, d2: 4, unit: 'cm' },
}
const FIG_RIGHT_TRI: NamedFigure = {
  figure: 'triangle',
  name: 'triangle rectangle',
  props: ['un angle droit', '3 côtés'],
  dims: { a: 3, b: 4, c: 5, triangleKind: 'right', unit: 'cm' },
}
const FIG_EQUI: NamedFigure = {
  figure: 'triangle',
  name: 'triangle équilatéral',
  props: ['3 côtés égaux', '3 angles égaux'],
  dims: { a: 4, b: 4, c: 4, triangleKind: 'equilateral', unit: 'cm' },
}
const FIG_ISO: NamedFigure = {
  figure: 'triangle',
  name: 'triangle isocèle',
  props: ['2 côtés égaux', '2 angles égaux'],
  dims: { a: 5, b: 5, c: 3, triangleKind: 'isosceles', unit: 'cm' },
}
const FIG_CIRCLE: NamedFigure = {
  figure: 'circle',
  name: 'cercle',
  props: ['tous les points à égale distance du centre', 'pas de côté'],
  dims: { diameter: 4, unit: 'cm' },
}
const FIG_TRAP: NamedFigure = {
  figure: 'trapezoid',
  name: 'trapèze',
  props: ['une paire de côtés parallèles', '4 côtés'],
  dims: { top: 3, bottom: 6, c: 4, height: 3, trapezoidKind: 'isosceles', unit: 'cm' },
}
const FIG_PARA: NamedFigure = {
  figure: 'parallelogram',
  name: 'parallélogramme',
  props: ['côtés opposés parallèles', 'côtés opposés égaux'],
  dims: { base: 5, side: 3, height: 2, unit: 'cm' },
}
const FIG_PENTA: NamedFigure = {
  figure: 'pentagon',
  name: 'pentagone',
  props: ['5 côtés', '5 sommets'],
  dims: { side: 2, unit: 'cm' },
}

function namedFigureItem(fig: NamedFigure): MathItem {
  return {
    layout: 'geo',
    figure: fig.figure,
    dims: fig.dims,
    propertyLines: [
      { label: 'Nom', answer: fig.name },
      { label: 'Propriété 1', answer: fig.props[0] },
      { label: 'Propriété 2', answer: fig.props[1] },
    ],
    answer: `${fig.name} ; ${fig.props[0]} ; ${fig.props[1]}`,
  }
}

/** Ex. 16 — carré/rectangle, losange/triangle rectangle, équilatéral/isocèle. */
function genEx16(): MathItem[] {
  return [FIG_SQUARE, FIG_RECT, FIG_RHOMBUS, FIG_RIGHT_TRI, FIG_EQUI, FIG_ISO].map(namedFigureItem)
}

/** Ex. 17 — formes restantes. */
function genEx17(): MathItem[] {
  return [FIG_CIRCLE, FIG_RECT, FIG_RHOMBUS, FIG_TRAP, FIG_PARA, FIG_PENTA].map(namedFigureItem)
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

/** Ex. 27 — quadrant I 20×20, axes fléchés non gradués. */
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
        cols: 20,
        rows: 20,
        axis: 'numeric',
        rangeX: 20,
        rangeY: 20,
        originCol: 0,
        originRow: 0,
        hideAxes: false,
        showOrigin: true,
        cellMm: 3,
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

function consignesItem(): MathItem {
  return {
    layout: 'theory',
    noPoints: true,
    answer: '',
    theoryBlock: {
      kind: 'paragraph',
      text:
        'Ce test évalue vos connaissances en mathématiques. Lisez chaque consigne. Pour les exercices avec audio, écoutez puis écrivez. Montrez vos calculs lorsque c’est demandé. Bonne chance.',
    },
  }
}

export function tryGenerateTcmCfrItems(typeId: string, count: number, rng: Rng): MathItem[] | null {
  if (!isTcmCfrType(typeId)) return null
  if (typeId === 'tcm-cfr-consignes') return [consignesItem()]
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
  if (typeId === 'tcm-cfr-ex14') return genEx14().slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex15') return genEx15().slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex16') return genEx16().slice(0, Math.max(1, count))
  if (typeId === 'tcm-cfr-ex17') return genEx17().slice(0, Math.max(1, count))
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

import { exerciseTypeById, topicById } from './catalog'
import { numberToFrench } from './french-numbers'
import { createRng, int, pick, shuffle, type Rng } from './rng'
import type { ArithOp, MathItem, MissingPos, PageConfig, WorksheetPage } from './types'

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

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

function digits(n: number, width: number): string[] {
  const s = String(Math.abs(Math.trunc(n))).padStart(width, ' ')
  return s.split('').map((ch) => (ch === ' ' ? '' : ch))
}

function widthOf(...nums: number[]): number {
  return Math.max(1, ...nums.map((n) => String(Math.abs(Math.trunc(n))).length))
}

function columnItem(op: ArithOp, a: number, b: number, result: number, empty: boolean): MathItem {
  const w = widthOf(a, b, result)
  return {
    layout: empty ? 'column-empty' : 'column',
    prompt: empty ? `Posez et calculez : ${fmt(a)} ${op} ${fmt(b)}` : undefined,
    op,
    a,
    b,
    result,
    digitsA: digits(a, w),
    digitsB: digits(b, w),
    digitsResult: digits(result, w),
    blankOperands: empty,
    answer: fmt(result),
  }
}

function inlineOp(op: ArithOp, a: number, b: number, result: number, missing: MissingPos = 'result'): MathItem {
  const leftA = missing === 'a' ? '□' : fmt(a)
  const leftB = missing === 'b' ? '□' : fmt(b)
  const right = missing === 'result' ? '□' : fmt(result)
  const answer = missing === 'a' ? fmt(a) : missing === 'b' ? fmt(b) : fmt(result)
  return {
    layout: missing === 'result' ? 'inline' : 'inline',
    prompt: `${leftA} ${op} ${leftB} = ${right}`,
    op,
    a,
    b,
    result,
    missing,
    answer,
  }
}

function pairAdd(rng: Rng, max: number): { a: number; b: number; result: number } {
  const a = int(rng, 2, max)
  const b = int(rng, 2, max)
  return { a, b, result: a + b }
}

function pairSub(rng: Rng, max: number): { a: number; b: number; result: number } {
  const a = int(rng, 10, max)
  const b = int(rng, 1, a - 1)
  return { a, b, result: a - b }
}

function pairMul(rng: Rng): { a: number; b: number; result: number } {
  const a = int(rng, 2, 12)
  const b = int(rng, 2, 12)
  return { a, b, result: a * b }
}

function pairDiv(rng: Rng): { a: number; b: number; result: number } {
  const result = int(rng, 2, 12)
  const b = int(rng, 2, 12)
  return { a: result * b, b, result }
}

const ADD_PB = [
  (a: number, b: number) => `Lina a ${a} billes. Elle en gagne ${b}. Combien a-t-elle de billes ?`,
  (a: number, b: number) => `Il y a ${a} pommes. On ajoute ${b} pommes. Combien y a-t-il de pommes ?`,
  (a: number, b: number) => `${a} enfants jouent. ${b} enfants arrivent. Combien y a-t-il d’enfants ?`,
  (a: number, b: number) => `Noa a économisé ${a} CHF. On lui donne ${b} CHF. Combien a-t-il ?`,
  (a: number, b: number) => `Un bus compte ${a} passagers. ${b} personnes montent. Combien y a-t-il de passagers ?`,
]

const SUB_PB = [
  (a: number, b: number) => `Lina a ${a} billes. Elle en donne ${b}. Combien lui en reste-t-il ?`,
  (a: number, b: number) => `Il y a ${a} pommes. On en mange ${b}. Combien reste-t-il de pommes ?`,
  (a: number, b: number) => `${a} enfants jouent. ${b} enfants partent. Combien reste-t-il d’enfants ?`,
  (a: number, b: number) => `Noa a ${a} CHF. Il dépense ${b} CHF. Combien lui reste-t-il ?`,
  (a: number, b: number) => `Un bus compte ${a} passagers. ${b} personnes descendent. Combien reste-t-il de passagers ?`,
]

const MUL_PB = [
  (a: number, b: number) => `Une boîte contient ${a} crayons. Combien y a-t-il de crayons dans ${b} boîtes ?`,
  (a: number, b: number) => `Un cahier coûte ${a} CHF. Combien coûtent ${b} cahiers ?`,
  (a: number, b: number) => `Une rangée a ${a} chaises. Combien y a-t-il de chaises sur ${b} rangées ?`,
]

const DIV_PB = [
  (a: number, b: number) => `On partage ${a} billes entre ${b} enfants, équitablement. Combien chacun reçoit-il ?`,
  (a: number, b: number) => `${a} élèves forment des groupes de ${b}. Combien de groupes obtient-on ?`,
  (a: number, b: number) => `Un paquet de ${a} cartes est rangé dans des boîtes de ${b}. Combien de boîtes faut-il ?`,
]

function roundTo(n: number, unit: number): number {
  return Math.round(n / unit) * unit
}

function frac(n: number, d: number): string {
  return `${n}/${d}`
}

function simplify(n: number, d: number): [number, number] {
  const g = gcd(n, d)
  return [n / g, d / g]
}

function dec(rng: Rng, maxInt = 20, places = 2): number {
  const scale = 10 ** places
  return int(rng, 1, maxInt * scale) / scale
}

function decStr(n: number): string {
  return n.toFixed(2).replace('.', ',').replace(/,0+$/, '').replace(/,(\d)0$/, ',$1')
}

const PLACE = ['unités', 'dizaines', 'centaines', 'milliers'] as const

function generateItems(typeId: string, count: number, rng: Rng): MathItem[] {
  const items: MathItem[] = []
  for (let i = 0; i < count; i++) {
    items.push(generateOne(typeId, rng, i))
  }
  return items
}

function generateOne(typeId: string, rng: Rng, index: number): MathItem {
  switch (typeId) {
    case 'nombres-chiffres': {
      const n = int(rng, 0, 999)
      return { layout: 'text', prompt: numberToFrench(n), answer: String(n) }
    }
    case 'nombres-lettres': {
      const n = int(rng, 0, 999)
      return { layout: 'text', prompt: String(n), answer: numberToFrench(n) }
    }
    case 'nombres-position': {
      const n = int(rng, 100, 9999)
      const place = PLACE[int(rng, 0, Math.min(3, String(n).length - 1))]!
      const idx = { unités: 0, dizaines: 1, centaines: 2, milliers: 3 }[place]
      const digit = Math.floor(n / 10 ** idx) % 10
      return { layout: 'inline', prompt: `Dans ${n.toLocaleString('fr-CH')}, le chiffre des ${place} est`, answer: String(digit) }
    }
    case 'nombres-decompose': {
      const n = int(rng, 25, 999)
      const c = Math.floor(n / 100)
      const d = Math.floor((n % 100) / 10)
      const u = n % 10
      const parts = [c ? `${c}×100` : '', d ? `${d}×10` : '', u ? `${u}×1` : ''].filter(Boolean)
      return { layout: 'inline', prompt: `Décomposez ${n} =`, answer: parts.join(' + ') }
    }
    case 'nombres-comparer': {
      const a = int(rng, 1, 999)
      let b = int(rng, 1, 999)
      if (index % 5 === 0) b = a
      const answer = a < b ? '<' : a > b ? '>' : '='
      return { layout: 'compare', left: String(a), right: String(b), answer }
    }
    case 'nombres-encadrer': {
      const unit = pick(rng, [10, 100] as const)
      let n = int(rng, unit + 1, unit === 10 ? 999 : 9999)
      while (n % unit === 0) n = int(rng, unit + 1, 9999)
      const lo = Math.floor(n / unit) * unit
      return { layout: 'inline', prompt: `… < ${n} < …  (pas de ${unit})`, answer: `${lo} < ${n} < ${lo + unit}` }
    }
    case 'nombres-pair': {
      const n = int(rng, 1, 999)
      return { layout: 'inline', prompt: `${n} est un nombre`, answer: n % 2 === 0 ? 'pair' : 'impair' }
    }
    case 'nombres-ranger': {
      const numbers = shuffle(rng, [int(rng, 10, 99), int(rng, 10, 99), int(rng, 100, 999), int(rng, 100, 999), int(rng, 1, 50)])
      const ordered = [...numbers].sort((a, b) => a - b)
      return { layout: 'sequence', sequence: numbers.map(String), prompt: 'Du plus petit au plus grand :', answer: ordered.join(' ; ') }
    }
    case 'nombres-suite': {
      const step = int(rng, 2, 9)
      const start = int(rng, 1, 40)
      const seq = Array.from({ length: 6 }, (_, k) => start + k * step)
      const blanks = [2, 4]
      return {
        layout: 'sequence',
        sequence: seq.map((n, k) => (blanks.includes(k) ? '□' : String(n))),
        blankIndexes: blanks,
        answer: blanks.map((k) => String(seq[k])).join(' ; '),
      }
    }
    case 'addition-ligne': {
      const p = pairAdd(rng, index < 3 ? 20 : 80)
      return inlineOp('+', p.a, p.b, p.result)
    }
    case 'addition-trou': {
      const p = pairAdd(rng, 50)
      return inlineOp('+', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'addition-colonne':
    case 'addition-colonne-poser': {
      const a = int(rng, 100, 4999)
      const b = int(rng, 100, 9999 - a)
      return columnItem('+', a, b, a + b, typeId.endsWith('poser'))
    }
    case 'addition-comparer': {
      const p = pairAdd(rng, 40)
      const q = pairAdd(rng, 40)
      const left = p.a + p.b
      const right = q.a + q.b
      return {
        layout: 'compare',
        left: `${p.a} + ${p.b}`,
        right: `${q.a} + ${q.b}`,
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'addition-problemes': {
      const p = pairAdd(rng, 40)
      return { layout: 'text', prompt: pick(rng, ADD_PB)(p.a, p.b), answer: `${p.a} + ${p.b} = ${p.result}` }
    }
    case 'soustraction-ligne': {
      const p = pairSub(rng, index < 3 ? 20 : 90)
      return inlineOp('−', p.a, p.b, p.result)
    }
    case 'soustraction-trou': {
      const p = pairSub(rng, 80)
      return inlineOp('−', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'soustraction-colonne':
    case 'soustraction-colonne-poser': {
      const a = int(rng, 1000, 9999)
      const b = int(rng, 100, a - 1)
      return columnItem('−', a, b, a - b, typeId.endsWith('poser'))
    }
    case 'soustraction-comparer': {
      const p = pairSub(rng, 90)
      const q = pairSub(rng, 90)
      const left = p.result
      const right = q.result
      return {
        layout: 'compare',
        left: `${p.a} − ${p.b}`,
        right: `${q.a} − ${q.b}`,
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'soustraction-problemes': {
      const p = pairSub(rng, 50)
      return { layout: 'text', prompt: pick(rng, SUB_PB)(p.a, p.b), answer: `${p.a} − ${p.b} = ${p.result}` }
    }
    case 'estimation-dizaine': {
      let n = int(rng, 11, 99)
      while (n % 10 === 0) n = int(rng, 11, 99)
      return { layout: 'inline', prompt: `${n} ≈`, answer: String(roundTo(n, 10)) }
    }
    case 'estimation-centaine': {
      let n = int(rng, 101, 999)
      while (n % 100 === 0) n = int(rng, 101, 999)
      return { layout: 'inline', prompt: `${n} ≈`, answer: String(roundTo(n, 100)) }
    }
    case 'estimation-somme': {
      const a = int(rng, 21, 89)
      const b = int(rng, 21, 89)
      return { layout: 'inline', prompt: `${a} + ${b} ≈`, answer: String(roundTo(a, 10) + roundTo(b, 10)) }
    }
    case 'estimation-difference': {
      const a = int(rng, 40, 99)
      const b = int(rng, 11, a - 10)
      return { layout: 'inline', prompt: `${a} − ${b} ≈`, answer: String(roundTo(a, 10) - roundTo(b, 10)) }
    }
    case 'multiplication-ligne': {
      const p = pairMul(rng)
      return inlineOp('×', p.a, p.b, p.result)
    }
    case 'multiplication-trou': {
      const p = pairMul(rng)
      return inlineOp('×', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'multiplication-colonne':
    case 'multiplication-colonne-poser': {
      const a = int(rng, 12, 999)
      const b = int(rng, 2, 9)
      return columnItem('×', a, b, a * b, typeId.endsWith('poser'))
    }
    case 'multiplication-2chiffres': {
      const a = int(rng, 12, 99)
      let b = int(rng, 12, 99)
      while (b % 10 === 0) b = int(rng, 12, 99)
      const result = a * b
      return {
        layout: 'column',
        op: '×',
        a,
        b,
        result,
        digitsA: digits(a, widthOf(a, b, result)),
        digitsB: digits(b, widthOf(a, b, result)),
        digitsResult: digits(result, widthOf(a, b, result)),
        prompt: `Produits partiels : ${a} × ${b % 10} et ${a} × ${Math.floor(b / 10)}`,
        answer: String(result),
      }
    }
    case 'multiplication-problemes': {
      const p = pairMul(rng)
      return { layout: 'text', prompt: pick(rng, MUL_PB)(p.a, p.b), answer: `${p.a} × ${p.b} = ${p.result}` }
    }
    case 'division-ligne': {
      const p = pairDiv(rng)
      return inlineOp('÷', p.a, p.b, p.result)
    }
    case 'division-trou': {
      const p = pairDiv(rng)
      return inlineOp('÷', p.a, p.b, p.result, pick(rng, ['a', 'b'] as const))
    }
    case 'division-colonne':
    case 'division-colonne-poser': {
      const divisor = int(rng, 2, 9)
      const quotient = int(rng, 12, 99)
      const remainder = int(rng, 0, divisor - 1)
      const dividend = divisor * quotient + remainder
      return {
        layout: 'division-column',
        prompt: typeId.endsWith('poser') ? `Posez : ${dividend} ÷ ${divisor}` : undefined,
        dividend,
        divisor,
        quotient,
        remainder,
        blankOperands: typeId.endsWith('poser'),
        answer: remainder ? `${quotient} reste ${remainder}` : String(quotient),
      }
    }
    case 'division-reste': {
      const divisor = int(rng, 3, 9)
      const quotient = int(rng, 4, 20)
      const remainder = int(rng, 1, divisor - 1)
      const dividend = divisor * quotient + remainder
      return { layout: 'inline', prompt: `${dividend} ÷ ${divisor} =`, answer: `${quotient} reste ${remainder}` }
    }
    case 'division-problemes': {
      const p = pairDiv(rng)
      return { layout: 'text', prompt: pick(rng, DIV_PB)(p.a, p.b), answer: `${p.a} ÷ ${p.b} = ${p.result}` }
    }
    case 'multiples-reconnaitre': {
      const base = int(rng, 2, 9)
      const yes = rng() < 0.5
      const n = yes ? base * int(rng, 2, 12) : base * int(rng, 2, 12) + int(rng, 1, base - 1)
      return { layout: 'inline', prompt: `${n} est-il un multiple de ${base} ?`, answer: n % base === 0 ? 'oui' : 'non' }
    }
    case 'multiples-diviseurs': {
      const n = pick(rng, [12, 18, 20, 24, 30, 36, 42, 48])
      const list: number[] = []
      for (let d = 1; d <= n; d++) if (n % d === 0) list.push(d)
      return { layout: 'text', prompt: `Quels sont les diviseurs de ${n} ?`, answer: list.join(' ; ') }
    }
    case 'multiples-pgcd': {
      const g = int(rng, 2, 8)
      const a = g * int(rng, 2, 9)
      const b = g * int(rng, 2, 9)
      return { layout: 'inline', prompt: `PGCD(${a} ; ${b}) =`, answer: String(gcd(a, b)) }
    }
    case 'multiples-ppcm': {
      const a = int(rng, 4, 12)
      const b = int(rng, 4, 12)
      return { layout: 'inline', prompt: `PPCM(${a} ; ${b}) =`, answer: String(lcm(a, b)) }
    }
    case 'fractions-identifier': {
      const n = int(rng, 1, 9)
      const d = int(rng, n + 1, 12)
      const ask = rng() < 0.5 ? 'numérateur' : 'dénominateur'
      return { layout: 'inline', prompt: `Dans ${frac(n, d)}, le ${ask} est`, answer: ask === 'numérateur' ? String(n) : String(d) }
    }
    case 'fractions-equivalentes': {
      const n = int(rng, 1, 6)
      const d = int(rng, n + 1, 9)
      const k = int(rng, 2, 5)
      const missNum = rng() < 0.5
      return {
        layout: 'inline',
        prompt: missNum ? `${frac(n, d)} = □/${d * k}` : `${frac(n, d)} = ${n * k}/□`,
        answer: missNum ? String(n * k) : String(d * k),
      }
    }
    case 'fractions-simplifier': {
      const k = int(rng, 2, 6)
      const n = int(rng, 1, 8) * k
      const d = int(rng, 2, 9) * k
      const [sn, sd] = simplify(n, d)
      return { layout: 'inline', prompt: `${frac(n, d)} =`, answer: frac(sn, sd) }
    }
    case 'fractions-comparer': {
      const d = int(rng, 3, 12)
      const n1 = int(rng, 1, d - 1)
      let n2 = int(rng, 1, d - 1)
      if (index % 4 === 0) n2 = n1
      const left = n1 / d
      const right = n2 / d
      return {
        layout: 'compare',
        left: frac(n1, d),
        right: frac(n2, d),
        answer: left < right ? '<' : left > right ? '>' : '=',
      }
    }
    case 'fractions-add': {
      const d = int(rng, 4, 12)
      const n1 = int(rng, 1, d - 2)
      const n2 = int(rng, 1, d - n1)
      const op: ArithOp = rng() < 0.5 ? '+' : '−'
      const raw = op === '+' ? n1 + n2 : n1 - n2
      const [sn, sd] = simplify(raw, d)
      return { layout: 'inline', prompt: `${frac(n1, d)} ${op} ${frac(n2, d)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'fractions-mul': {
      const n1 = int(rng, 1, 5)
      const d1 = int(rng, 2, 8)
      const n2 = int(rng, 1, 5)
      const d2 = int(rng, 2, 8)
      const [sn, sd] = simplify(n1 * n2, d1 * d2)
      return { layout: 'inline', prompt: `${frac(n1, d1)} × ${frac(n2, d2)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'fractions-div': {
      const n1 = int(rng, 1, 5)
      const d1 = int(rng, 2, 8)
      const n2 = int(rng, 1, 5)
      const d2 = int(rng, 2, 8)
      const [sn, sd] = simplify(n1 * d2, d1 * n2)
      return { layout: 'inline', prompt: `${frac(n1, d1)} ÷ ${frac(n2, d2)} =`, answer: sd === 1 ? String(sn) : frac(sn, sd) }
    }
    case 'decimaux-lire': {
      const n = dec(rng, 20, 2)
      return { layout: 'text', prompt: `Écrivez ${decStr(n)} en lettres (on peut écrire « virgule »).`, answer: decStr(n) }
    }
    case 'decimaux-comparer': {
      const a = dec(rng, 9, 2)
      let b = dec(rng, 9, 2)
      if (index % 5 === 0) b = a
      return {
        layout: 'compare',
        left: decStr(a),
        right: decStr(b),
        answer: a < b ? '<' : a > b ? '>' : '=',
      }
    }
    case 'decimaux-arrondir': {
      const n = dec(rng, 20, 2)
      return { layout: 'inline', prompt: `Arrondissez ${decStr(n)} à l’unité`, answer: String(Math.round(n)) }
    }
    case 'decimaux-ligne': {
      const a = Math.round(dec(rng, 20, 2) * 100)
      const b = Math.round(dec(rng, 20, 2) * 100)
      const add = rng() < 0.5
      const result = add ? a + b : Math.max(a, b) - Math.min(a, b)
      const A = Math.max(a, b)
      const B = Math.min(a, b)
      return {
        layout: 'inline',
        prompt: add ? `${decStr(a / 100)} + ${decStr(b / 100)} =` : `${decStr(A / 100)} − ${decStr(B / 100)} =`,
        answer: decStr(result / 100),
      }
    }
    case 'decimaux-colonne':
    case 'decimaux-colonne-poser': {
      const a = Math.round(dec(rng, 40, 2) * 100)
      const b = Math.round(dec(rng, 40, 2) * 100)
      const result = a + b
      const item = columnItem('+', a, b, result, typeId.endsWith('poser'))
      item.prompt = typeId.endsWith('poser')
        ? `Posez (alignez les virgules) : ${decStr(a / 100)} + ${decStr(b / 100)}`
        : `${decStr(a / 100)} + ${decStr(b / 100)}`
      item.answer = decStr(result / 100)
      item.a = a / 100
      item.b = b / 100
      return item
    }
    case 'decimaux-mul': {
      const a = Math.round(dec(rng, 9, 1) * 10) / 10
      const b = int(rng, 2, 9)
      const result = Math.round(a * b * 10) / 10
      return { layout: 'inline', prompt: `${decStr(a)} × ${b} =`, answer: decStr(result) }
    }
    case 'proportion-notion': {
      const pairs = [
        ['1/2', '50 %'],
        ['1/4', '25 %'],
        ['3/4', '75 %'],
        ['1/5', '20 %'],
        ['1/10', '10 %'],
      ] as const
      const pair = pick(rng, pairs)
      const askPct = rng() < 0.5
      return { layout: 'inline', prompt: askPct ? `${pair[0]} =` : `${pair[1]} =`, answer: askPct ? pair[1] : pair[0] }
    }
    case 'proportion-de': {
      const pct = pick(rng, [10, 20, 25, 50])
      const n = pct === 25 ? int(rng, 2, 8) * 4 : int(rng, 2, 12) * 10
      return { layout: 'inline', prompt: `${pct} % de ${n} =`, answer: String((pct * n) / 100) }
    }
    case 'proportion-var': {
      const n = int(rng, 2, 12) * 10
      const pct = pick(rng, [10, 20, 25])
      const up = rng() < 0.5
      const result = up ? n * (1 + pct / 100) : n * (1 - pct / 100)
      return {
        layout: 'inline',
        prompt: up ? `${n} augmenté de ${pct} % =` : `${n} diminué de ${pct} % =`,
        answer: String(result),
      }
    }
    case 'proportion-problemes': {
      const n = int(rng, 4, 12) * 10
      const pct = pick(rng, [10, 20, 25, 50])
      return {
        layout: 'text',
        prompt: `Un article coûte ${n} CHF. Pendant les soldes, il est réduit de ${pct} %. Quel est le nouveau prix ?`,
        answer: `${n - (pct * n) / 100} CHF`,
      }
    }
    case 'relatifs-comparer': {
      const a = int(rng, -20, 20)
      let b = int(rng, -20, 20)
      if (index % 5 === 0) b = a
      return { layout: 'compare', left: String(a), right: String(b), answer: a < b ? '<' : a > b ? '>' : '=' }
    }
    case 'relatifs-add': {
      const a = int(rng, -15, 15)
      const b = int(rng, -15, 15)
      const op: ArithOp = rng() < 0.5 ? '+' : '−'
      const result = op === '+' ? a + b : a - b
      return { layout: 'inline', prompt: `(${a}) ${op} (${b}) =`, answer: String(result) }
    }
    case 'relatifs-mul': {
      const a = int(rng, -9, 9) || 2
      const b = int(rng, -9, 9) || 3
      const mul = rng() < 0.6
      const result = mul ? a * b : a / b
      if (!mul && a % b !== 0) {
        const bb = pick(rng, [-4, -3, -2, 2, 3, 4])
        const aa = bb * int(rng, -6, 6) || bb * 2
        return { layout: 'inline', prompt: `(${aa}) ÷ (${bb}) =`, answer: String(aa / bb) }
      }
      return { layout: 'inline', prompt: mul ? `(${a}) × (${b}) =` : `(${a}) ÷ (${b}) =`, answer: String(result) }
    }
    case 'puissances-calcul': {
      const a = int(rng, 2, 9)
      const p = pick(rng, [2, 3])
      const result = a ** p
      return { layout: 'inline', prompt: `${a}${p === 2 ? '²' : '³'} =`, answer: String(result) }
    }
    case 'puissances-10': {
      const p = int(rng, 1, 4)
      return { layout: 'inline', prompt: `10${['¹', '²', '³', '⁴'][p - 1]} =`, answer: String(10 ** p) }
    }
    case 'puissances-racine': {
      const a = int(rng, 2, 12)
      return { layout: 'inline', prompt: `√${a * a} =`, answer: String(a) }
    }
    case 'puissances-priorite': {
      const a = int(rng, 2, 6)
      const b = int(rng, 2, 5)
      const c = int(rng, 2, 4)
      return { layout: 'inline', prompt: `${a} + ${b} × ${c} =`, answer: String(a + b * c) }
    }
    case 'expressions-lire': {
      const n = int(rng, 2, 9)
      const k = int(rng, 1, 9)
      return { layout: 'text', prompt: `Écrivez l’expression : le produit de ${n} et d’un nombre x, augmenté de ${k}.`, answer: `${n}x + ${k}` }
    }
    case 'expressions-substituer': {
      const n = int(rng, 2, 6)
      const k = int(rng, 1, 9)
      const x = int(rng, 2, 8)
      return { layout: 'inline', prompt: `Calculez ${n}x + ${k} pour x = ${x}`, answer: String(n * x + k) }
    }
    case 'expressions-reduire': {
      const a = int(rng, 2, 8)
      const b = int(rng, 2, 8)
      return { layout: 'inline', prompt: `Réduisez : ${a}x + ${b}x`, answer: `${a + b}x` }
    }
    case 'expressions-developper': {
      const n = int(rng, 2, 8)
      const k = int(rng, 1, 9)
      return { layout: 'inline', prompt: `Développez : ${n}(x + ${k})`, answer: `${n}x + ${n * k}` }
    }
    case 'expressions-factoriser': {
      const n = int(rng, 2, 6)
      const a = n * int(rng, 2, 6)
      const b = n * int(rng, 1, 6)
      return { layout: 'inline', prompt: `Factorisez : ${a}x + ${b}`, answer: `${n}(${a / n}x + ${b / n})` }
    }
    case 'equations-simple': {
      const x = int(rng, 2, 20)
      const b = int(rng, 2, 15)
      return { layout: 'inline', prompt: `x + ${b} = ${x + b}    x =`, answer: String(x) }
    }
    case 'equations-deux-cotes': {
      const x = int(rng, 2, 12)
      const a = int(rng, 3, 6)
      const c = int(rng, 1, a - 1)
      const b = int(rng, 1, 10)
      const d = a * x + b - c * x
      return { layout: 'inline', prompt: `${a}x + ${b} = ${c}x + ${d}    x =`, answer: String(x) }
    }
    case 'equations-fractions': {
      const x = int(rng, 2, 16)
      if (x % 2 !== 0) {
        const xx = x + 1
        return { layout: 'inline', prompt: `x/2 = ${xx / 2}    x =`, answer: String(xx) }
      }
      return { layout: 'inline', prompt: `x/2 = ${x / 2}    x =`, answer: String(x) }
    }
    case 'equations-systeme': {
      const x = int(rng, 1, 8)
      const y = int(rng, 1, 8)
      return {
        layout: 'text',
        prompt: `Résolvez le système :\nx + y = ${x + y}\nx = ${x}\nMéthode : substitution.`,
        answer: `x = ${x} ; y = ${y}`,
      }
    }
    case 'equations-systeme-add': {
      const x = int(rng, 1, 8)
      const y = int(rng, 1, 8)
      return {
        layout: 'text',
        prompt: `Résolvez le système :\n${2}x + y = ${2 * x + y}\n${2}x − y = ${2 * x - y}\nMéthode : addition.`,
        answer: `x = ${x} ; y = ${y}`,
      }
    }
    case 'figures-nommer': {
      const names = [
        { figure: 'square' as const, answer: 'carré' },
        { figure: 'rectangle' as const, answer: 'rectangle' },
        { figure: 'triangle' as const, answer: 'triangle' },
        { figure: 'circle' as const, answer: 'cercle' },
        { figure: 'rhombus' as const, answer: 'losange' },
      ]
      const fig = names[index % names.length]!
      return { layout: 'text', prompt: 'Nommez cette figure.', figure: fig.figure, answer: fig.answer }
    }
    case 'figures-proprietes': {
      const q = pick(rng, [
        { prompt: 'Un carré a combien de côtés égaux ?', answer: '4', figure: 'square' as const },
        { prompt: 'Un triangle a combien de sommets ?', answer: '3', figure: 'triangle' as const },
        { prompt: 'Un rectangle a combien d’angles droits ?', answer: '4', figure: 'rectangle' as const },
      ])
      return { layout: 'text', prompt: q.prompt, figure: q.figure, answer: q.answer }
    }
    case 'conversions-longueur': {
      const m = int(rng, 1, 12)
      return rng() < 0.5
        ? { layout: 'inline', prompt: `${m} m = … cm`, answer: `${m * 100} cm` }
        : { layout: 'inline', prompt: `${m * 10} mm = … cm`, answer: `${m} cm` }
    }
    case 'conversions-aire': {
      const m = int(rng, 1, 8)
      return { layout: 'inline', prompt: `${m} m² = … cm²`, answer: `${m * 10_000} cm²` }
    }
    case 'conversions-volume': {
      const m = int(rng, 1, 5)
      return { layout: 'inline', prompt: `${m} dm³ = … L`, answer: `${m} L` }
    }
    case 'conversions-capacite': {
      const l = int(rng, 1, 8)
      return { layout: 'inline', prompt: `${l} L = … cL`, answer: `${l * 100} cL` }
    }
    case 'conversions-masse': {
      const kg = int(rng, 1, 8)
      return { layout: 'inline', prompt: `${kg} kg = … g`, answer: `${kg * 1000} g` }
    }
    case 'conversions-temps': {
      const h = int(rng, 1, 4)
      return { layout: 'inline', prompt: `${h} h = … min`, answer: `${h * 60} min` }
    }
    case 'perimetres-carre': {
      const c = int(rng, 2, 15)
      return { layout: 'text', prompt: `Périmètre d’un carré de côté ${c} cm`, figure: 'square', answer: `${4 * c} cm` }
    }
    case 'perimetres-rectangle': {
      const l = int(rng, 4, 16)
      const w = int(rng, 2, l - 1)
      return { layout: 'text', prompt: `Périmètre d’un rectangle de ${l} cm sur ${w} cm`, figure: 'rectangle', answer: `${2 * (l + w)} cm` }
    }
    case 'perimetres-triangle': {
      const a = int(rng, 3, 12)
      const b = int(rng, 3, 12)
      const c = int(rng, 3, 12)
      return { layout: 'text', prompt: `Périmètre d’un triangle de côtés ${a} cm, ${b} cm et ${c} cm`, figure: 'triangle', answer: `${a + b + c} cm` }
    }
    case 'perimetres-cercle': {
      const r = int(rng, 2, 10)
      const p = Math.round(2 * 3.14 * r * 100) / 100
      return { layout: 'text', prompt: `Périmètre d’un cercle de rayon ${r} cm (π = 3,14)`, figure: 'circle', answer: `${fmt(p)} cm` }
    }
    case 'aires-carre': {
      const c = int(rng, 2, 12)
      return { layout: 'text', prompt: `Aire d’un carré de côté ${c} cm`, figure: 'square', answer: `${c * c} cm²` }
    }
    case 'aires-rectangle': {
      const l = int(rng, 4, 16)
      const w = int(rng, 2, l - 1)
      return { layout: 'text', prompt: `Aire d’un rectangle de ${l} cm sur ${w} cm`, figure: 'rectangle', answer: `${l * w} cm²` }
    }
    case 'aires-triangle': {
      const b = int(rng, 4, 16)
      const h = int(rng, 2, 12)
      return { layout: 'text', prompt: `Aire d’un triangle de base ${b} cm et de hauteur ${h} cm`, figure: 'triangle', answer: `${(b * h) / 2} cm²` }
    }
    case 'aires-parallelogramme': {
      const b = int(rng, 5, 16)
      const h = int(rng, 3, 10)
      return { layout: 'text', prompt: `Aire d’un parallélogramme de base ${b} cm et de hauteur ${h} cm`, figure: 'parallelogram', answer: `${b * h} cm²` }
    }
    case 'aires-disque': {
      const r = int(rng, 2, 8)
      const a = Math.round(3.14 * r * r * 100) / 100
      return { layout: 'text', prompt: `Aire d’un disque de rayon ${r} cm (π = 3,14)`, figure: 'circle', answer: `${fmt(a)} cm²` }
    }
    case 'volumes-cube': {
      const c = int(rng, 2, 9)
      return { layout: 'text', prompt: `Volume d’un cube de côté ${c} cm`, figure: 'cube', answer: `${c ** 3} cm³` }
    }
    case 'volumes-pave': {
      const l = int(rng, 3, 10)
      const w = int(rng, 2, 8)
      const h = int(rng, 2, 7)
      return { layout: 'text', prompt: `Volume d’un pavé de ${l} × ${w} × ${h} cm`, figure: 'cuboid', answer: `${l * w * h} cm³` }
    }
    case 'volumes-cylindre': {
      const r = int(rng, 2, 6)
      const h = int(rng, 3, 10)
      const v = Math.round(3.14 * r * r * h * 100) / 100
      return { layout: 'text', prompt: `Volume d’un cylindre de rayon ${r} cm et de hauteur ${h} cm (π = 3,14)`, figure: 'cylinder', answer: `${fmt(v)} cm³` }
    }
    case 'reperage-lire': {
      const x = int(rng, -5, 8)
      const y = int(rng, -5, 8)
      return { layout: 'inline', prompt: `Les coordonnées du point A(${x} ; ${y}) sont`, answer: `(${x} ; ${y})` }
    }
    case 'reperage-abscisse': {
      const x = int(rng, -6, 8)
      const y = int(rng, -6, 8)
      const askX = rng() < 0.5
      return {
        layout: 'inline',
        prompt: askX ? `L’abscisse de A(${x} ; ${y}) est` : `L’ordonnée de A(${x} ; ${y}) est`,
        answer: String(askX ? x : y),
      }
    }
    case 'transformations-axiale': {
      const x = int(rng, 1, 6)
      const y = int(rng, 1, 6)
      return { layout: 'inline', prompt: `Image de A(${x} ; ${y}) par la symétrie d’axe des ordonnées :`, answer: `(${-x} ; ${y})` }
    }
    case 'transformations-centrale': {
      const x = int(rng, 1, 6)
      const y = int(rng, 1, 6)
      return { layout: 'inline', prompt: `Image de A(${x} ; ${y}) par la symétrie de centre O(0 ; 0) :`, answer: `(${-x} ; ${-y})` }
    }
    case 'transformations-translation': {
      const x = int(rng, 1, 6)
      const y = int(rng, 1, 6)
      const vx = int(rng, 1, 4)
      const vy = int(rng, -3, 3)
      return { layout: 'inline', prompt: `Image de A(${x} ; ${y}) par la translation de vecteur (${vx} ; ${vy}) :`, answer: `(${x + vx} ; ${y + vy})` }
    }
    case 'transformations-rotation': {
      const x = int(rng, 1, 5)
      const y = int(rng, 1, 5)
      return { layout: 'inline', prompt: `Image de A(${x} ; ${y}) par la rotation de 90° (sens direct) autour de O :`, answer: `(${-y} ; ${x})` }
    }
    default:
      return { layout: 'inline', prompt: 'Calculez 1 + 1 =', answer: '2' }
  }
}

export function buildPage(config: PageConfig, seed: number): WorksheetPage {
  const rng = createRng(seed)
  const topic = topicById[config.topic]
  const type = exerciseTypeById[config.exerciseType]
  return {
    ...config,
    title: type?.label ?? topic?.label ?? 'Exercices',
    instruction: type?.instruction ?? 'Calculez, complète ou simplifiez chaque expression.',
    items: generateItems(config.exerciseType, config.count, rng),
  }
}

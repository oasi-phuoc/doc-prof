/**
 * TCM ex. 28 — priorité des opérations.
 * 50 modèles uniques (≥ 5 termes chacun) : 25 avec () [] et + − × ÷ ;
 * 25 avec en plus fractions empilées (n/d) et puissances ¹–³.
 * `/` = fraction empilée uniquement ; division d’expressions = `÷`.
 */
import { int, pick, type Rng } from '@/math/rng'
import type { MathItem } from '@/math/types'

const SUP = ['', '¹', '²', '³'] as const

export type PrioriteKind = 'ops' | 'frac-pow'

export type PrioriteTemplate = {
  id: string
  kind: PrioriteKind
  /** Placeholders {a}…{j} (1–9) ; {p}/{q}/{r} exposants 1–3. */
  pattern: string
}

/** Compte les opérandes numériques d’un modèle (≥ 5 exigé). */
export function prioriteTermCount(pattern: string): number {
  return (pattern.match(/\{[a-j]\}/g) ?? []).length
}

/** 25 modèles sans fraction ni puissance (≥ 5 termes). */
export const TCM_PRIORITE_OPS: readonly PrioriteTemplate[] = [
  { id: 'o01', kind: 'ops', pattern: '[({a} + {b}) × {c}] − {d} + {e}' },
  { id: 'o02', kind: 'ops', pattern: '{a} + [({b} − {c}) × {d}] − {e}' },
  { id: 'o03', kind: 'ops', pattern: '[({a} × {b}) − {c}] + {d} − {e}' },
  { id: 'o04', kind: 'ops', pattern: '({a} + {b}) × [{c} − {d}] + {e}' },
  { id: 'o05', kind: 'ops', pattern: '[{a} × ({b} + {c})] − {d} + {e}' },
  { id: 'o06', kind: 'ops', pattern: '{a} × [({b} + {c}) − {d}] + {e}' },
  { id: 'o07', kind: 'ops', pattern: '[({a} − {b}) × {c}] + {d} − {e}' },
  { id: 'o08', kind: 'ops', pattern: '({a} − {b}) + [{c} × {d}] − {e}' },
  { id: 'o09', kind: 'ops', pattern: '[{a} + ({b} × {c})] − {d} + {e}' },
  { id: 'o10', kind: 'ops', pattern: '[({a} + {b}) − {c}] × {d} + {e}' },
  { id: 'o11', kind: 'ops', pattern: '{a} − [({b} × {c}) − {d}] + {e}' },
  { id: 'o12', kind: 'ops', pattern: '({a} × {b}) − [{c} + {d}] + {e}' },
  { id: 'o13', kind: 'ops', pattern: '[{a} × {b}] + ({c} − {d}) + {e}' },
  { id: 'o14', kind: 'ops', pattern: '[({a} + {b}) × ({c} − {d})] + {e}' },
  { id: 'o15', kind: 'ops', pattern: '{a} × ({b} + [{c} − {d}]) − {e}' },
  { id: 'o16', kind: 'ops', pattern: '({a} + [{b} × {c}]) − {d} + {e}' },
  { id: 'o17', kind: 'ops', pattern: '[{a} − ({b} + {c})] × {d} + {e}' },
  { id: 'o18', kind: 'ops', pattern: '[({a} × {b}) + {c}] − {d} + {e}' },
  { id: 'o19', kind: 'ops', pattern: '[{a} + {b}] ÷ ({c}) + {d} − {e}' },
  { id: 'o20', kind: 'ops', pattern: '({a} − {b}) × [{c} + {d}] − {e}' },
  { id: 'o21', kind: 'ops', pattern: '[{a} + {b}] × ({c} − {d}) + {e}' },
  { id: 'o22', kind: 'ops', pattern: '[({a} × {b}) ÷ {c}] + {d} − {e}' },
  { id: 'o23', kind: 'ops', pattern: '{a} × [{b} − ({c} − {d})] + {e}' },
  { id: 'o24', kind: 'ops', pattern: '({a} + {b}) − [{c} × {d} − {e}]' },
  { id: 'o25', kind: 'ops', pattern: '[{a} × ({b} − {c})] + ({d} ÷ {e})' },
]

/** 25 modèles avec fractions n/d (empilées) et puissances (≥ 5 termes). */
export const TCM_PRIORITE_FRAC_POW: readonly PrioriteTemplate[] = [
  { id: 'f01', kind: 'frac-pow', pattern: '[({a}/{b} + {c}) × {d}^{p}] − {e}' },
  { id: 'f02', kind: 'frac-pow', pattern: '({a} + {b}/{c}) × [{d}^{p} − {e}]' },
  { id: 'f03', kind: 'frac-pow', pattern: '[{a}^{p} × ({b} + {c}/{d})] − {e}' },
  { id: 'f04', kind: 'frac-pow', pattern: '[({a}/{b}) × {c}^{p}] + ({d} − {e})' },
  { id: 'f05', kind: 'frac-pow', pattern: '({a}^{p} − {b}) + [{c}/{d} × {e}]' },
  { id: 'f06', kind: 'frac-pow', pattern: '[{a} × ({b}/{c} + {d}^{p})] − {e}' },
  { id: 'f07', kind: 'frac-pow', pattern: '({a}/{b} + {c}^{p}) × [{d} − {e}]' },
  { id: 'f08', kind: 'frac-pow', pattern: '[{a} + {b}/{c}] × ({d}^{p} − {e})' },
  { id: 'f09', kind: 'frac-pow', pattern: '{a}^{p} × ({b}/{c} + {d}/{e})' },
  { id: 'f10', kind: 'frac-pow', pattern: '[{a}/{b} × ({c}^{p} − {d})] + {e}' },
  { id: 'f11', kind: 'frac-pow', pattern: '({a}^{p} + {b}/{c}) − [{d} × {e}]' },
  { id: 'f12', kind: 'frac-pow', pattern: '[({a} − {b}/{c}) × {d}^{p}] + {e}' },
  { id: 'f13', kind: 'frac-pow', pattern: '({a}/{b}) × [{c}^{p} + ({d} − {e})]' },
  { id: 'f14', kind: 'frac-pow', pattern: '[{a}^{p} − ({b}/{c})] × {d} + {e}' },
  { id: 'f15', kind: 'frac-pow', pattern: '[({a} + {b}) × {c}^{p}] ÷ {d} − {e}/{f}' },
  { id: 'f16', kind: 'frac-pow', pattern: '({a} × {b}/{c}) + [{d}^{p} − {e}]' },
  { id: 'f17', kind: 'frac-pow', pattern: '[{a}/{b} + {c}/{d}] × {e}^{p}' },
  { id: 'f18', kind: 'frac-pow', pattern: '({a}^{p} × {b}/{c}) − [{d} + {e}]' },
  { id: 'f19', kind: 'frac-pow', pattern: '[{a}/{b} × {c}^{p}] + {d} − {e}' },
  { id: 'f20', kind: 'frac-pow', pattern: '{a}/{b} × [({c}^{p} + {d}) ÷ {e}]' },
  { id: 'f21', kind: 'frac-pow', pattern: '[{a}^{p} + ({b} × {c}/{d})] − {e}' },
  { id: 'f22', kind: 'frac-pow', pattern: '({a}/{b} − {c}/{d}) × {e}^{p}' },
  { id: 'f23', kind: 'frac-pow', pattern: '[({a} × {b}^{p}) ÷ {c}] + {d}/{e}' },
  { id: 'f24', kind: 'frac-pow', pattern: '({a} + {b}/{c}) × {d}^{p} − {e}' },
  { id: 'f25', kind: 'frac-pow', pattern: '[{a}/{b} × {c}^{p}] − ({d}/{e})' },
]

export const TCM_PRIORITE_ALL: readonly PrioriteTemplate[] = [
  ...TCM_PRIORITE_OPS,
  ...TCM_PRIORITE_FRAC_POW,
]

function fmtNum(n: number): string {
  const r = Math.round(n * 1000) / 1000
  return String(r).replace('.', ',')
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

/** Évalue une expression scolaire déjà remplie (fractions n/d, exposants unicode, [] ()). */
export function evalPrioriteExpression(expr: string): number {
  const js = expr
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/(\d+)([¹²³])/g, (_, base: string, s: string) => {
      const p = '¹²³'.indexOf(s) + 1
      return `(${base}**${p})`
    })
    // Fractions empilées n/d → (n/d) ; après remplacement de ÷ donc pas de conflit.
    .replace(/(\d+)\/(\d+)/g, '($1/$2)')
  // Expressions issues uniquement de nos modèles + tirages 1–9.
  // eslint-disable-next-line no-new-func -- évaluation déterministe de modèles contrôlés
  return Function(`"use strict"; return (${js});`)() as number
}

function formatAnswer(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (Math.abs(value - Math.round(value)) < 1e-8) return String(Math.round(value))
  for (let den = 2; den <= 36; den++) {
    const num = Math.round(value * den)
    if (Math.abs(num / den - value) < 1e-8) {
      const g = gcd(num, den)
      const n = num / g
      const d = den / g
      return d === 1 ? String(n) : `${n}/${d}`
    }
  }
  return fmtNum(value)
}

function digit(rng: Rng): number {
  return int(rng, 1, 9)
}

function exponent(rng: Rng): number {
  return int(rng, 1, 3)
}

/**
 * Une étape de simplification : parenthèses/crochets les plus internes,
 * sinon puissances, sinon ×÷, sinon +− de gauche à droite.
 */
function simplifyOnePrioriteStep(expr: string): string | null {
  // Innermost [] or ()
  const bracket = /[\[(]([^\[\]()]+)[\])]/u.exec(expr)
  if (bracket && bracket.index != null) {
    const inner = bracket[1]!.trim()
    try {
      const value = evalPrioriteExpression(inner)
      const formatted = formatAnswer(value)
      return `${expr.slice(0, bracket.index)}${formatted}${expr.slice(bracket.index + bracket[0].length)}`
    } catch {
      /* continue */
    }
  }

  // Unicode powers: 2³ → 8
  const pow = /(\d+)([¹²³])/u.exec(expr)
  if (pow && pow.index != null) {
    const base = Number(pow[1])
    const e = '¹²³'.indexOf(pow[2]!) + 1
    const formatted = formatAnswer(base ** e)
    return `${expr.slice(0, pow.index)}${formatted}${expr.slice(pow.index + pow[0].length)}`
  }

  // Fraction n/d alone or in a product/sum context — resolve leftmost simple fraction
  const frac = /(^|[^\d])(\d+)\/(\d+)(?!\d)/u.exec(expr)
  if (frac && frac.index != null) {
    const prefix = frac[1] ?? ''
    const n = Number(frac[2])
    const d = Number(frac[3])
    if (d !== 0) {
      const formatted = formatAnswer(n / d)
      const start = frac.index + prefix.length
      return `${expr.slice(0, start)}${formatted}${expr.slice(start + frac[2]!.length + 1 + frac[3]!.length)}`
    }
  }

  // × or ÷ (leftmost)
  const mul = /(-?\d+(?:,\d+)?)(\s*[×÷]\s*)(-?\d+(?:,\d+)?)/u.exec(expr)
  if (mul && mul.index != null) {
    const a = Number(mul[1]!.replace(',', '.'))
    const op = mul[2]!.trim()
    const b = Number(mul[3]!.replace(',', '.'))
    const value = op === '×' ? a * b : a / b
    const formatted = formatAnswer(value)
    return `${expr.slice(0, mul.index)}${formatted}${expr.slice(mul.index + mul[0].length)}`
  }

  // + or − (leftmost, not unary)
  const add = /(-?\d+(?:,\d+)?)(\s*[+−]\s*)(-?\d+(?:,\d+)?)/u.exec(expr)
  if (add && add.index != null) {
    const a = Number(add[1]!.replace(',', '.'))
    const op = add[2]!.trim()
    const b = Number(add[3]!.replace(',', '.'))
    const value = op === '+' ? a + b : a - b
    const formatted = formatAnswer(value)
    return `${expr.slice(0, add.index)}${formatted}${expr.slice(add.index + add[0].length)}`
  }

  return null
}

/** Étapes intermédiaires pour le corrigé (priorité des opérations). */
export function developPrioriteSteps(prompt: string): string[] {
  let expr = prompt.replace(/\s*=\s*$/u, '').trim()
  if (!expr) return []
  const steps = [expr]
  for (let i = 0; i < 24; i++) {
    const next = simplifyOnePrioriteStep(expr)
    if (!next || next === expr) break
    expr = next.replace(/\s+/g, ' ').trim()
    if (steps[steps.length - 1] !== expr) steps.push(expr)
  }
  try {
    const final = formatAnswer(evalPrioriteExpression(steps[0]!))
    if (steps[steps.length - 1] !== final) steps.push(final)
  } catch {
    /* ignore */
  }
  return steps
}

/**
 * Remplit un modèle : lettres a–j → 1–9 ; p,q,r → exposants 1–3.
 * `{x}^{p}` devient `x¹`/`x²`/`x³` ; `{a}/{b}` reste pour le rendu empilé.
 */
export function fillPrioriteTemplate(
  template: PrioriteTemplate,
  rng: Rng,
): { prompt: string; answer: string; development: string[] } | null {
  for (let attempt = 0; attempt < 80; attempt++) {
    const vals: Record<string, number> = {}
    for (const ch of 'abcdefghij') vals[ch] = digit(rng)
    for (const ch of 'pqr') vals[ch] = exponent(rng)

    let prompt = template.pattern
    prompt = prompt.replace(/\{([a-j])\}\^\{([pqr])\}/g, (_, base: string, expKey: string) => {
      const b = vals[base]!
      const e = vals[expKey]!
      return `${b}${SUP[e]}`
    })
    prompt = prompt.replace(/\{([a-j])\}\^(\d)/g, (_, base: string, exp: string) => {
      const e = Number(exp)
      return `${vals[base]!}${SUP[e] ?? ''}`
    })
    prompt = prompt.replace(/\{([a-j])\}/g, (_, key: string) => String(vals[key]!))

    let value: number
    try {
      value = evalPrioriteExpression(prompt)
    } catch {
      continue
    }
    if (!Number.isFinite(value)) continue
    if (Math.abs(value) > 2000) continue
    if (template.kind === 'ops' && Math.abs(value - Math.round(value)) > 1e-8) continue

    const answer = formatAnswer(value)
    const development = developPrioriteSteps(prompt)
    return { prompt: `${prompt} =`, answer, development }
  }
  return null
}

function prioriteItem(prompt: string, answer: string, development?: string[]): MathItem {
  const steps = development?.length ? development : developPrioriteSteps(prompt)
  return {
    layout: 'algebra',
    prompt,
    answer,
    development: steps,
    calcAnswer: steps.join('\n'),
  }
}

/** Lot TCM ex. 28 : Q1 modèle ops, Q2 modèle frac+puissance. */
export function generateTcmPrioriteBatch(rng: Rng): MathItem[] {
  const opsTpl = pick(rng, TCM_PRIORITE_OPS)
  const fracTpl = pick(rng, TCM_PRIORITE_FRAC_POW)

  const q1 =
    fillPrioriteTemplate(opsTpl, rng) ??
    fillPrioriteTemplate(TCM_PRIORITE_OPS[0]!, rng) ?? {
      prompt: '[(2 + 3) × 4] − 1 + 5 =',
      answer: '24',
      development: developPrioriteSteps('[(2 + 3) × 4] − 1 + 5'),
    }
  const q2 =
    fillPrioriteTemplate(fracTpl, rng) ??
    fillPrioriteTemplate(TCM_PRIORITE_FRAC_POW[0]!, rng) ?? {
      prompt: '[(1/2 + 3) × 2²] − 1 =',
      answer: '13',
      development: developPrioriteSteps('[(1/2 + 3) × 2²] − 1'),
    }

  return [
    prioriteItem(q1.prompt, q1.answer, q1.development),
    prioriteItem(q2.prompt, q2.answer, q2.development),
  ]
}

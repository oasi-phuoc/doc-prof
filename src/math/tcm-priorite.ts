/**
 * TCM ex. 28 — priorité des opérations.
 * 50 modèles uniques (≥ 5 termes chacun) : 25 avec () [] et + − × ÷ ;
 * 25 avec en plus fractions empilées (n/d) et puissances ¹–³.
 * `/` = fraction empilée uniquement ; division d’expressions = `÷`.
 */
import { int, pick, type Rng } from './rng'
import type { MathItem } from './types'

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
 * Remplit un modèle : lettres a–j → 1–9 ; p,q,r → exposants 1–3.
 * `{x}^{p}` devient `x¹`/`x²`/`x³` ; `{a}/{b}` reste pour le rendu empilé.
 */
export function fillPrioriteTemplate(
  template: PrioriteTemplate,
  rng: Rng,
): { prompt: string; answer: string } | null {
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

    return { prompt: `${prompt} =`, answer: formatAnswer(value) }
  }
  return null
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
    }
  const q2 =
    fillPrioriteTemplate(fracTpl, rng) ??
    fillPrioriteTemplate(TCM_PRIORITE_FRAC_POW[0]!, rng) ?? {
      prompt: '[(1/2 + 3) × 2²] − 1 =',
      answer: '13',
    }

  return [
    { layout: 'algebra', prompt: q1.prompt, answer: q1.answer },
    { layout: 'algebra', prompt: q2.prompt, answer: q2.answer },
  ]
}

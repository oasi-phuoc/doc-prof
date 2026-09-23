import { pick, shuffle, type Rng } from './rng'
import { axesRangeFor, clampCoordRange, formatAxesCoord, formatAxesNum } from './coord-reperage'
import type {
  CoordLine,
  CoordLineColor,
  CoordLineStroke,
  CoordQuestion,
  CoordScene,
  Difficulty,
  MathItem,
  PageConfig,
} from './types'

type LineEq = { a: number; b: number; c: number }

export const LINE_PALETTE: Array<{
  name: string
  color: CoordLineColor
  stroke: CoordLineStroke
}> = [
  { name: 'violette', color: 'violet', stroke: 'solid' },
  { name: 'orange', color: 'orange', stroke: 'dashed' },
  { name: 'verte', color: 'green', stroke: 'dotted' },
  { name: 'bleue', color: 'blue', stroke: 'dashdot' },
  { name: 'rouge', color: 'red', stroke: 'longdash' },
  { name: 'grise', color: 'muted', stroke: 'dense' },
  { name: 'rose', color: 'rose', stroke: 'doubledash' },
]

export const STROKE_DASH: Record<CoordLineStroke, string | undefined> = {
  solid: undefined,
  dashed: '7 4',
  dotted: '1.6 2.8',
  dashdot: '8 3 1.8 3',
  longdash: '12 4',
  dense: '3.2 2.4',
  doubledash: '9 2.2 2.2 2.2',
}

export const STROKE_LABEL: Record<CoordLineStroke, string> = {
  solid: 'trait plein',
  dashed: 'tirets',
  dotted: 'pointillés',
  dashdot: 'traits-points',
  longdash: 'tirets longs',
  dense: 'tirets serrés',
  doubledash: 'double tiret',
}

function gcd(x: number, y: number): number {
  let a = Math.abs(x)
  let b = Math.abs(y)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a || 1
}

function normalize(a: number, b: number, c: number): LineEq {
  const scale = gcd(gcd(Math.round(a), Math.round(b)), Math.round(c))
  a = Math.round(a) / scale
  b = Math.round(b) / scale
  c = Math.round(c) / scale
  if (a < 0 || (a === 0 && b < 0)) {
    a = -a
    b = -b
    c = -c
  }
  return { a, b, c }
}

function fromSlopeIntercept(num: number, den: number, intercept: number): LineEq {
  return normalize(num, -den, den * intercept)
}

function vertical(x: number): LineEq {
  return normalize(1, 0, -x)
}

function horizontal(y: number): LineEq {
  return normalize(0, 1, -y)
}

function lineKey(line: LineEq): string {
  return `${line.a}/${line.b}/${line.c}`
}

function slopeKey(line: LineEq): string {
  if (line.b === 0) return 'inf'
  return `${-line.a}/${line.b}`
}

function isVertical(line: LineEq): boolean {
  return line.b === 0
}

function isHorizontal(line: LineEq): boolean {
  return line.a === 0
}

function passesOrigin(line: LineEq): boolean {
  return line.c === 0
}

function areParallel(a: LineEq, b: LineEq): boolean {
  return a.a * b.b - b.a * a.b === 0
}

function intersection(l1: LineEq, l2: LineEq): { x: number; y: number } | null {
  const det = l1.a * l2.b - l2.a * l1.b
  if (det === 0) return null
  return {
    x: (l2.c * l1.b - l1.c * l2.b) / det,
    y: (l2.a * l1.c - l1.a * l2.c) / det,
  }
}

function interceptX(line: LineEq): number | null {
  if (isHorizontal(line)) return null
  return -line.c / line.a
}

function interceptY(line: LineEq): number | null {
  if (isVertical(line)) return null
  return -line.c / line.b
}

function isNice(n: number, step: number): boolean {
  const q = n / step
  return Math.abs(q - Math.round(q)) < 1e-8
}

function inRange(n: number, range: number): boolean {
  return Math.abs(n) <= range + 1e-8
}

function onGrid(x: number, y: number, range: number, step: number): boolean {
  return inRange(x, range) && inRange(y, range) && isNice(x, step) && isNice(y, step)
}

function parallelGap(a: LineEq, b: LineEq): number {
  if (!areParallel(a, b)) return 0
  return Math.abs(a.c - b.c) / Math.hypot(a.a, a.b)
}

function orientationOf(line: LineEq): 'horizontale' | 'verticale' | 'oblique' {
  if (isHorizontal(line)) return 'horizontale'
  if (isVertical(line)) return 'verticale'
  return 'oblique'
}

function formatSlope(n: number): string {
  if (n === 1) return ''
  if (n === -1) return '−'
  if (n === 0.5) return '½'
  if (n === -0.5) return '−½'
  return formatAxesNum(n)
}

export function formatLineEquation(line: LineEq): string {
  if (isVertical(line)) return `x = ${formatAxesNum(-line.c / line.a)}`
  const slope = -line.a / line.b
  const inter = -line.c / line.b
  if (slope === 0) return `y = ${formatAxesNum(inter)}`
  const slopeStr = formatSlope(slope)
  if (inter === 0) return `y = ${slopeStr}x`
  const interStr = inter > 0 ? ` + ${formatAxesNum(inter)}` : ` − ${formatAxesNum(-inter)}`
  return `y = ${slopeStr}x${interStr}`
}

export function clipLineToRange(line: LineEq, range: number): { x1: number; y1: number; x2: number; y2: number } | null {
  const pts: Array<{ x: number; y: number }> = []
  const add = (x: number, y: number) => {
    if (inRange(x, range) && inRange(y, range)) {
      if (!pts.some((p) => Math.abs(p.x - x) < 1e-8 && Math.abs(p.y - y) < 1e-8)) {
        pts.push({ x, y })
      }
    }
  }
  if (line.b !== 0) {
    for (const x of [-range, range]) add(x, -(line.a * x + line.c) / line.b)
  }
  if (line.a !== 0) {
    for (const y of [-range, range]) add(-(line.b * y + line.c) / line.a, y)
  }
  if (pts.length < 2) return null
  let best = { i: 0, j: 1, d: -1 }
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = (pts[i]!.x - pts[j]!.x) ** 2 + (pts[i]!.y - pts[j]!.y) ** 2
      if (d > best.d) best = { i, j, d }
    }
  }
  const p = pts[best.i]!
  const q = pts[best.j]!
  return { x1: p.x, y1: p.y, x2: q.x, y2: q.y }
}

function latticeOnLine(line: LineEq, range: number, step: number): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = []
  const n = Math.round((2 * range) / step)
  for (let i = 0; i <= n; i++) {
    const x = Math.round((-range + i * step) * 1000) / 1000
    if (isVertical(line)) {
      const vx = -line.c / line.a
      if (Math.abs(x - vx) < 1e-8) {
        for (let j = 0; j <= n; j++) {
          const y = Math.round((-range + j * step) * 1000) / 1000
          pts.push({ x: vx, y })
        }
      }
      continue
    }
    const y = -(line.a * x + line.c) / line.b
    if (onGrid(x, y, range, step)) pts.push({ x, y })
  }
  return pts
}

function uniquePool(lines: LineEq[]): LineEq[] {
  const seen = new Set<string>()
  const out: LineEq[] = []
  for (const line of lines) {
    const key = lineKey(line)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(line)
  }
  return out
}

function candidatePool(range: number, difficulty: Difficulty): LineEq[] {
  const ks: number[] = []
  for (let k = -range + 1; k <= range - 1; k++) {
    if (k !== 0) ks.push(k)
  }
  const pool: LineEq[] = []
  for (const k of ks) {
    pool.push(horizontal(k))
    pool.push(vertical(k))
    pool.push(fromSlopeIntercept(1, 1, k))
    pool.push(fromSlopeIntercept(-1, 1, k))
  }
  if (difficulty !== 'facile') {
    for (const k of ks) {
      pool.push(fromSlopeIntercept(2, 1, k))
      pool.push(fromSlopeIntercept(-2, 1, k))
    }
    pool.push(fromSlopeIntercept(1, 1, 0))
    pool.push(fromSlopeIntercept(-1, 1, 0))
    pool.push(fromSlopeIntercept(2, 1, 0))
    pool.push(fromSlopeIntercept(-2, 1, 0))
  }
  if (difficulty === 'avance') {
    for (const k of ks) {
      pool.push(fromSlopeIntercept(1, 2, k))
      pool.push(fromSlopeIntercept(-1, 2, k))
    }
    pool.push(fromSlopeIntercept(1, 2, 0))
    pool.push(fromSlopeIntercept(-1, 2, 0))
  }
  return uniquePool(pool).filter((line) => clipLineToRange(line, range))
}

function interiorHits(lines: LineEq[], range: number, step: number): Array<{ i: number; j: number; x: number; y: number }> {
  const hits: Array<{ i: number; j: number; x: number; y: number }> = []
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const pt = intersection(lines[i]!, lines[j]!)
      if (!pt || !onGrid(pt.x, pt.y, range, step)) continue
      hits.push({ i, j, x: pt.x, y: pt.y })
    }
  }
  return hits
}

function decorate(eqs: LineEq[], styles: typeof LINE_PALETTE): CoordLine[] {
  return eqs.map((eq, i) => {
    const style = styles[i % styles.length]!
    return {
      id: style.name,
      name: style.name,
      color: style.color,
      stroke: style.stroke,
      a: eq.a,
      b: eq.b,
      c: eq.c,
    }
  })
}

function fallbackLines(range: number, count: number): LineEq[] {
  const r = Math.max(3, range)
  const k = Math.min(2, r - 1)
  const all = [
    fromSlopeIntercept(1, 1, 1),
    fromSlopeIntercept(1, 1, -k),
    fromSlopeIntercept(-1, 1, 1),
    vertical(-k),
    horizontal(k),
  ]
  return all.slice(0, Math.max(3, Math.min(count, all.length)))
}

function tryPickLines(rng: Rng, pool: LineEq[], count: number, range: number, step: number): LineEq[] | null {
  const bySlope = new Map<string, LineEq[]>()
  for (const line of pool) {
    const key = slopeKey(line)
    const list = bySlope.get(key) ?? []
    list.push(line)
    bySlope.set(key, list)
  }
  const parallelKeys = [...bySlope.entries()].filter(([, list]) => {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (parallelGap(list[i]!, list[j]!) >= 1) return true
      }
    }
    return false
  })
  if (!parallelKeys.length) return null
  const [, parallels] = pick(rng, parallelKeys)
  const pairs: Array<[LineEq, LineEq]> = []
  for (let i = 0; i < parallels.length; i++) {
    for (let j = i + 1; j < parallels.length; j++) {
      if (parallelGap(parallels[i]!, parallels[j]!) >= 1) pairs.push([parallels[i]!, parallels[j]!])
    }
  }
  if (!pairs.length) return null
  const [p1, p2] = pick(rng, pairs)
  const chosen = [p1, p2]
  const rest = shuffle(
    rng,
    pool.filter((line) => !chosen.some((c) => lineKey(c) === lineKey(line))),
  )
  for (const line of rest) {
    if (chosen.length >= count) break
    if (chosen.some((c) => areParallel(c, line) && parallelGap(c, line) < 1)) continue
    chosen.push(line)
  }
  if (chosen.length < Math.min(count, 3)) return null
  if (interiorHits(chosen, range, step).length < 1) return null
  return chosen.slice(0, count)
}

function lineCountFor(questionCount: number, difficulty: Difficulty): number {
  if (difficulty === 'facile') return questionCount <= 3 ? 3 : 4
  if (questionCount >= 8) return 5
  if (questionCount <= 3) return 3
  return 4
}

type DraftQuestion = CoordQuestion & { bucket: 'meet' | 'axis' | 'relation' | 'extra' }

function buildQuestions(lines: CoordLine[], range: number, step: number, difficulty: Difficulty): DraftQuestion[] {
  const qs: DraftQuestion[] = []
  const hits = interiorHits(lines, range, step)

  for (const hit of hits) {
    const a = lines[hit.i]!
    const b = lines[hit.j]!
    qs.push({
      bucket: 'meet',
      prompt: `La droite ${a.name} et la droite ${b.name} se croisent en`,
      answer: formatAxesCoord(hit.x, hit.y),
      reply: 'pair',
    })
  }

  for (const line of lines) {
    const x0 = interceptX(line)
    if (x0 !== null && onGrid(x0, 0, range, step)) {
      qs.push({
        bucket: 'axis',
        prompt: `La droite ${line.name} croise l’axe des x en`,
        answer: formatAxesCoord(x0, 0),
        reply: 'pair',
      })
    }
    const y0 = interceptY(line)
    if (y0 !== null && onGrid(0, y0, range, step)) {
      qs.push({
        bucket: 'axis',
        prompt: `La droite ${line.name} croise l’axe des y en`,
        answer: formatAxesCoord(0, y0),
        reply: 'pair',
      })
    }
  }

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const a = lines[i]!
      const b = lines[j]!
      qs.push({
        bucket: 'relation',
        prompt: `La droite ${a.name} et la droite ${b.name} sont`,
        answer: areParallel(a, b) ? 'parallèles' : 'sécantes',
        reply: 'text',
      })
    }
  }

  for (const line of lines) {
    qs.push({
      bucket: 'extra',
      prompt: `La droite ${line.name} passe par l’origine`,
      answer: passesOrigin(line) ? 'oui' : 'non',
      reply: 'text',
    })
    qs.push({
      bucket: 'extra',
      prompt: `La droite ${line.name} est`,
      answer: orientationOf(line),
      reply: 'text',
    })
  }

  const horizontals = lines.filter(isHorizontal)
  const verticals = lines.filter(isVertical)
  if (horizontals.length === 1) {
    qs.push({
      bucket: 'extra',
      prompt: 'Quelle droite est horizontale ?',
      answer: `la droite ${horizontals[0]!.name}`,
      reply: 'text',
    })
  }
  if (verticals.length === 1) {
    qs.push({
      bucket: 'extra',
      prompt: 'Quelle droite est verticale ?',
      answer: `la droite ${verticals[0]!.name}`,
      reply: 'text',
    })
  }

  const originCount = lines.filter(passesOrigin).length
  qs.push({
    bucket: 'extra',
    prompt: 'Combien de droites passent par l’origine ?',
    answer: String(originCount),
    reply: 'text',
  })

  if (difficulty !== 'facile') {
    for (const line of lines) {
      const on = latticeOnLine(line, range, step).filter((p) => !(p.x === 0 && p.y === 0))
      if (!on.length) continue
      const pt = on[Math.floor(on.length / 2)]!
      qs.push({
        bucket: 'extra',
        prompt: `Le point ${formatAxesCoord(pt.x, pt.y)} appartient à la droite ${line.name}`,
        answer: 'oui',
        reply: 'text',
      })
      const offX = pt.x === range ? pt.x - 1 : pt.x + 1
      if (onGrid(offX, pt.y, range, step) && Math.abs(line.a * offX + line.b * pt.y + line.c) > 1e-8) {
        qs.push({
          bucket: 'extra',
          prompt: `Le point ${formatAxesCoord(offX, pt.y)} appartient à la droite ${line.name}`,
          answer: 'non',
          reply: 'text',
        })
      }
    }
    for (const line of lines) {
      const others = lines.filter((other) => other.id !== line.id)
      const nSec = others.filter((other) => !areParallel(other, line)).length
      qs.push({
        bucket: 'extra',
        prompt: `Combien de droites sont sécantes à la droite ${line.name} ?`,
        answer: String(nSec),
        reply: 'text',
      })
    }
  }

  if (difficulty === 'avance') {
    for (const line of lines) {
      qs.push({
        bucket: 'extra',
        prompt: `Une équation de la droite ${line.name} est`,
        answer: formatLineEquation(line),
        reply: 'text',
      })
    }
  }

  return qs
}

function takeFrom(rng: Rng, list: DraftQuestion[], n: number): DraftQuestion[] {
  return shuffle(rng, list).slice(0, Math.max(0, n))
}

function pickQuestions(rng: Rng, all: DraftQuestion[], count: number, difficulty: Difficulty): CoordQuestion[] {
  const meet = all.filter((q) => q.bucket === 'meet')
  const axis = all.filter((q) => q.bucket === 'axis')
  const relation = all.filter((q) => q.bucket === 'relation')
  const extra = all.filter((q) => q.bucket === 'extra')
  const equations = extra.filter((q) => q.prompt.startsWith('Une équation'))

  const nMeet = Math.min(meet.length, count <= 3 ? 1 : count <= 5 ? 2 : 3)
  const nAxis = Math.min(axis.length, difficulty === 'avance' || count <= 4 ? 1 : 2)
  const nRel = Math.min(relation.length, count >= 4 ? (count >= 7 ? 2 : 1) : count >= 3 ? 1 : 0)

  const chosen = [
    ...takeFrom(rng, meet, nMeet),
    ...takeFrom(rng, axis, nAxis),
    ...takeFrom(rng, relation, nRel),
  ]
  if (difficulty === 'avance' && equations.length && chosen.length < count) {
    chosen.push(...takeFrom(rng, equations, 1))
  }
  const used = new Set(chosen.map((q) => q.prompt))
  const leftover = shuffle(
    rng,
    all.filter((q) => !used.has(q.prompt)),
  )
  const fill = leftover.slice(0, Math.max(0, count - chosen.length))
  const ordered = [...chosen, ...fill].slice(0, count)
  if (ordered.length < count) {
    ordered.push(...takeFrom(rng, extra, count - ordered.length))
  }
  return ordered.map(({ prompt, answer, reply }) => ({ prompt, answer, reply }))
}

function highlightsFrom(questions: CoordQuestion[]): CoordScene['marks'] {
  const marks: NonNullable<CoordScene['marks']> = []
  const seen = new Set<string>()
  for (const q of questions) {
    if (q.reply !== 'pair') continue
    const m = q.answer.match(/^\((−?[\d,]+) ; (−?[\d,]+)\)$/)
    if (!m) continue
    const parse = (s: string) => Number(s.replace('−', '-').replace(',', '.'))
    const x = parse(m[1]!)
    const y = parse(m[2]!)
    const key = `${x},${y}`
    if (seen.has(key)) continue
    seen.add(key)
    marks.push({ x, y, kind: 'point' })
  }
  return marks
}

export function generateDroites(
  config: PageConfig,
  rng: Rng,
): { items: MathItem[]; instruction: string } {
  const difficulty = config.difficulty ?? 'moyen'
  const range = clampCoordRange(config.coordRange ?? axesRangeFor(difficulty))
  const step = 1
  const questionCount = Math.max(1, Math.min(config.count || 5, 10))
  const nLines = lineCountFor(questionCount, difficulty)
  const pool = candidatePool(range, difficulty)
  let eqs: LineEq[] | null = null
  for (let attempt = 0; attempt < 28; attempt++) {
    eqs = tryPickLines(rng, pool, nLines, range, step)
    if (eqs) break
  }
  if (!eqs) eqs = fallbackLines(range, nLines)

  const styles = shuffle(rng, LINE_PALETTE).slice(0, eqs.length)
  const lines = decorate(eqs, styles)
  const questions = pickQuestions(rng, buildQuestions(lines, range, step, difficulty), questionCount, difficulty)
  const scene: CoordScene = {
    variant: 'axes',
    cols: range * 2,
    rows: range * 2,
    axis: 'numeric',
    range,
    step,
    marks: highlightsFrom(questions),
    lines,
  }
  const instruction = 'Observez les droites du repère. Répondez aux questions.'
  return {
    instruction,
    items: [
      {
        layout: 'coord',
        prompt: instruction,
        coordScene: scene,
        coordQuestions: questions,
        coordTask: 'read',
        answer: questions.map((q) => `${q.prompt} : ${q.answer}`).join(' · '),
      },
    ],
  }
}

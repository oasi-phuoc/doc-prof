import { int, pick, type Rng } from './rng'
import { clampCoordRange, formatAxesCoord } from './coord-reperage'
import type { CoordMark, CoordPath, CoordQuestion, CoordScene, Difficulty, MathItem, PageConfig } from './types'

export function constructRangeFor(difficulty: Difficulty): number {
  if (difficulty === 'facile') return 8
  if (difficulty === 'moyen') return 10
  return 12
}

type Pt = { x: number; y: number }
type LineEq = { a: number; b: number; c: number }

function add(p: Pt, q: Pt): Pt {
  return { x: p.x + q.x, y: p.y + q.y }
}
function sub(p: Pt, q: Pt): Pt {
  return { x: p.x - q.x, y: p.y - q.y }
}
function inside(p: Pt, range: number, margin = 0): boolean {
  return Math.abs(p.x) <= range - margin && Math.abs(p.y) <= range - margin
}
function same(p: Pt, q: Pt): boolean {
  return p.x === q.x && p.y === q.y
}
function keyOf(p: Pt): string {
  return `${p.x},${p.y}`
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

function lineThrough(p: Pt, q: Pt): LineEq {
  return normalize(q.y - p.y, p.x - q.x, q.x * p.y - p.x * q.y)
}

function parallelThrough(line: LineEq, p: Pt): LineEq {
  return normalize(line.a, line.b, -(line.a * p.x + line.b * p.y))
}

function perpThrough(line: LineEq, p: Pt): LineEq {
  return normalize(line.b, -line.a, -(line.b * p.x - line.a * p.y))
}

function intersect(l1: LineEq, l2: LineEq): Pt | null {
  const det = l1.a * l2.b - l2.a * l1.b
  if (det === 0) return null
  const x = (l2.c * l1.b - l1.c * l2.b) / det
  const y = (l2.a * l1.c - l1.a * l2.c) / det
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null
  return { x, y }
}

function interceptX(line: LineEq): Pt | null {
  if (line.a === 0) return null
  const x = -line.c / line.a
  if (!Number.isInteger(x)) return null
  return { x, y: 0 }
}

function interceptY(line: LineEq): Pt | null {
  if (line.b === 0) return null
  const y = -line.c / line.b
  if (!Number.isInteger(y)) return null
  return { x: 0, y }
}

function mark(p: Pt, label: string, reveal: 'always' | 'answer' = 'answer'): CoordMark {
  return { x: p.x, y: p.y, kind: 'point', label, reveal }
}

function linePath(id: string, eq: LineEq, dashed = false): CoordPath {
  return { id, kind: 'line', a: eq.a, b: eq.b, c: eq.c, stroke: dashed ? 'dashed' : 'solid' }
}

function segmentPath(id: string, pts: Pt[], dashed = false): CoordPath {
  return { id, kind: 'segment', points: pts, stroke: dashed ? 'dashed' : 'solid' }
}

function polyPath(id: string, pts: Pt[], dashed = false): CoordPath {
  return { id, kind: 'polygon', points: pts, stroke: dashed ? 'dashed' : 'solid' }
}

function drawQ(prompt: string, answer: string): CoordQuestion {
  return { prompt, answer, reply: 'draw' }
}
function pairQ(prompt: string, p: Pt): CoordQuestion {
  return { prompt, answer: formatAxesCoord(p.x, p.y), reply: 'pair' }
}
function textQ(prompt: string, answer: string): CoordQuestion {
  return { prompt, answer, reply: 'text' }
}

function flipY(p: Pt): Pt {
  return { x: -p.x, y: p.y }
}
function flipX(p: Pt): Pt {
  return { x: p.x, y: -p.y }
}
function flipO(p: Pt): Pt {
  return { x: -p.x, y: -p.y }
}

function nameQuad(A: Pt, B: Pt, C: Pt, D: Pt): string {
  const sides = [sub(B, A), sub(C, B), sub(D, C), sub(A, D)]
  const lens = sides.map((v) => v.x * v.x + v.y * v.y)
  const eq = (i: number, j: number) => lens[i] === lens[j]
  const dot = (u: Pt, v: Pt) => u.x * v.x + u.y * v.y
  const para = (u: Pt, v: Pt) => u.x * v.y - u.y * v.x === 0
  const abCd = para(sides[0]!, sides[2]!)
  const adBc = para(sides[3]!, sides[1]!)
  const right = dot(sides[0]!, sides[1]!) === 0
  if (abCd && adBc && eq(0, 1) && right) return 'un carré'
  if (abCd && adBc && right) return 'un rectangle'
  if (abCd && adBc && eq(0, 1)) return 'un losange'
  if (abCd && adBc) return 'un parallélogramme'
  if (abCd || adBc) return 'un trapèze'
  return 'un quadrilatère'
}

function uniquePts(pts: Pt[]): boolean {
  const keys = pts.map(keyOf)
  return new Set(keys).size === keys.length
}

function randomPoint(rng: Rng, range: number, used: Pt[], margin = 1): Pt | null {
  const pool: Pt[] = []
  for (let x = -range + margin; x <= range - margin; x++) {
    for (let y = -range + margin; y <= range - margin; y++) {
      if (x === 0 && y === 0) continue
      const p = { x, y }
      if (used.some((u) => same(u, p))) continue
      pool.push(p)
    }
  }
  return pool.length ? pick(rng, pool) : null
}

type Draft = {
  given: CoordMark[]
  marks: CoordMark[]
  paths: CoordPath[]
  questions: CoordQuestion[]
}

function familyDroites(rng: Rng, range: number): Draft | null {
  const A = randomPoint(rng, range, [], 2)
  if (!A) return null
  let D0: Pt | null = null
  for (let i = 0; i < 24; i++) {
    const cand = randomPoint(rng, range, [A], 2)
    if (!cand) break
    if (cand.x * A.x <= 0 || cand.y * A.y <= 0) {
      D0 = cand
      break
    }
    D0 = cand
  }
  if (!D0) return null

  let B: Pt | null = null
  let C: Pt | null = null
  let E: Pt | null = null
  for (let i = 0; i < 40; i++) {
    const b = randomPoint(rng, range, [A, D0], 1)
    const c = randomPoint(rng, range, [A, D0, b ?? A], 1)
    const e = randomPoint(rng, range, [A, D0, b ?? A, c ?? A], 1)
    if (!b || !c || !e) continue
    if (same(b, c) || same(b, e) || same(c, e)) continue
    const ab = lineThrough(A, b)
    const cd = lineThrough(c, D0)
    const ae = lineThrough(A, e)
    if (!clipable(ab) || !clipable(cd) || !clipable(ae)) continue
    B = b
    C = c
    E = e
    break
  }
  if (!B || !C || !E) {
    B = { x: Math.min(range - 1, A.x + 3), y: A.y === range ? A.y - 2 : A.y + 2 }
    if (same(B, A) || same(B, D0)) B = { x: D0.x === 0 ? 2 : -D0.x, y: A.y }
    C = { x: D0.x === range ? D0.x - 3 : D0.x + 2, y: Math.min(range - 1, D0.y + 3) }
    if (same(C, A) || same(C, D0) || same(C, B)) C = { x: -A.x || 2, y: -A.y || 3 }
    E = { x: A.x === 0 ? 3 : 0, y: A.y === 0 ? 4 : 0 }
    if (!inside(B, range) || !inside(C, range) || !inside(E, range)) return null
    if (!uniquePts([A, D0, B, C, E])) return null
  }

  const AB = lineThrough(A, B)
  const CD = lineThrough(C, D0)
  const AE = lineThrough(A, E)
  const par = parallelThrough(AB, D0)
  const per = perpThrough(CD, A)
  const meet = intersect(AB, CD)
  const yCut = interceptY(par)
  const xCut = interceptX(AE)

  const questions: CoordQuestion[] = [
    drawQ(
      `La droite (AB) passe par le point A et le point B ${formatAxesCoord(B.x, B.y)}. Tracez-la.`,
      `B ${formatAxesCoord(B.x, B.y)} et la droite (AB)`,
    ),
    drawQ(
      `La droite (CD) passe par le point C ${formatAxesCoord(C.x, C.y)} et le point D. Tracez-la.`,
      `C ${formatAxesCoord(C.x, C.y)} et la droite (CD)`,
    ),
    drawQ(
      `La droite (AE) passe par le point A et le point E ${formatAxesCoord(E.x, E.y)}. Tracez-la.`,
      `E ${formatAxesCoord(E.x, E.y)} et la droite (AE)`,
    ),
    drawQ('Tracez la droite parallèle à (AB) passant par le point D.', 'parallèle à (AB) par D'),
    drawQ('Tracez la droite perpendiculaire à (CD) passant par le point A.', 'perpendiculaire à (CD) par A'),
  ]
  if (meet && inside(meet, range)) {
    questions.push(pairQ('Les droites (AB) et (CD) se croisent en', meet))
  }
  if (yCut && inside(yCut, range)) {
    questions.push(pairQ('La parallèle à (AB) passant par D coupe l’axe des y en', yCut))
  }
  if (xCut && inside(xCut, range)) {
    questions.push(pairQ('La droite (AE) coupe l’axe des x en', xCut))
  }
  questions.push(textQ('Les droites (AB) et sa parallèle passant par D sont', 'parallèles'))

  return {
    given: [mark(A, 'A', 'always'), mark(D0, 'D', 'always')],
    marks: [
      mark(A, 'A', 'always'),
      mark(D0, 'D', 'always'),
      mark(B, 'B'),
      mark(C, 'C'),
      mark(E, 'E'),
    ],
    paths: [linePath('AB', AB), linePath('CD', CD), linePath('AE', AE), linePath('par', par, true), linePath('per', per, true)],
    questions,
  }
}

function clipable(line: LineEq): boolean {
  return !(line.a === 0 && line.b === 0)
}

function familyCarre(rng: Rng, range: number): Draft | null {
  const dirs: Pt[] = []
  for (let u = -5; u <= 5; u++) {
    for (let v = -5; v <= 5; v++) {
      if (u === 0 && v === 0) continue
      if (Math.abs(u) + Math.abs(v) < 3) continue
      if (Math.hypot(u, v) > 6) continue
      dirs.push({ x: u, y: v })
    }
  }
  for (let attempt = 0; attempt < 50; attempt++) {
    const A = randomPoint(rng, range, [], 2)
    if (!A) return null
    const v = pick(rng, dirs)
    const rot = rng() < 0.5 ? { x: -v.y, y: v.x } : { x: v.y, y: -v.x }
    const B = add(A, v)
    const D = add(A, rot)
    const C = add(B, rot)
    if (![B, C, D].every((p) => inside(p, range, 1))) continue
    if (!uniquePts([A, B, C, D])) continue

    const Ap = flipY(A)
    const Bp = flipY(B)
    const Cp = flipY(C)
    const Dp = flipY(D)
    if (![Ap, Bp, Cp, Dp].every((p) => inside(p, range))) continue

    const figure = nameQuad(A, Ap, Cp, C)
    const mid = { x: 0, y: D.y }
    const height = Math.abs(D.x)
    const E1 = { x: 0, y: D.y + height }
    const E2 = { x: 0, y: D.y - height }
    const E = inside(E1, range, 0) ? E1 : inside(E2, range, 0) ? E2 : mid

    return {
      given: [mark(A, 'A', 'always'), mark(B, 'B', 'always')],
      marks: [
        mark(A, 'A', 'always'),
        mark(B, 'B', 'always'),
        mark(C, 'C'),
        mark(D, 'D'),
        mark(Ap, "A′"),
        mark(Bp, "B′"),
        mark(Cp, "C′"),
        mark(Dp, "D′"),
        mark(E, 'E'),
      ],
      paths: [
        polyPath('sq', [A, B, C, D]),
        polyPath('sq2', [Ap, Bp, Cp, Dp], true),
        segmentPath('join', [A, Ap, Cp, C, A]),
        segmentPath('tri', [D, Dp, E, D]),
      ],
      questions: [
        drawQ(
          `Construisez le carré ABCD à partir des points A, B et C ${formatAxesCoord(C.x, C.y)}.`,
          `C ${formatAxesCoord(C.x, C.y)}, D ${formatAxesCoord(D.x, D.y)}`,
        ),
        pairQ('Où se trouve le point D ?', D),
        drawQ(
          'Construisez le carré A′B′C′D′, symétrique de ABCD par rapport à l’axe des y.',
          `A′ ${formatAxesCoord(Ap.x, Ap.y)}`,
        ),
        textQ('Reliez les points A, A′, C′ et C. Quelle figure avez-vous obtenue ?', figure),
        drawQ(
          `Tracez le triangle isocèle DD′E de sommet E ${formatAxesCoord(E.x, E.y)}.`,
          `E ${formatAxesCoord(E.x, E.y)}`,
        ),
        pairQ('Où se trouve le point A′ ?', Ap),
        textQ('Le segment [AA′] est', Ap.y === A.y ? 'horizontal' : 'oblique'),
      ],
    }
  }
  return null
}

function familyPara(rng: Rng, range: number): Draft | null {
  for (let attempt = 0; attempt < 50; attempt++) {
    const A = randomPoint(rng, range, [], 2)
    const B = A && randomPoint(rng, range, [A], 2)
    if (!A || !B) continue
    const C = randomPoint(rng, range, [A, B], 2)
    if (!C) continue
    const D = { x: B.x + C.x - A.x, y: B.y + C.y - A.y }
    if (!inside(D, range, 1) || !uniquePts([A, B, C, D])) continue
    if ((B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x) === 0) continue
    const figure = nameQuad(A, B, D, C)
    const Ap = flipX(A)
    const Bp = flipX(B)
    const Cp = flipX(C)
    const Dp = flipX(D)
    if (![Ap, Bp, Cp, Dp].every((p) => inside(p, range))) continue
    const AB = lineThrough(A, B)
    const AC = lineThrough(A, C)
    return {
      given: [mark(A, 'A', 'always'), mark(B, 'B', 'always')],
      marks: [
        mark(A, 'A', 'always'),
        mark(B, 'B', 'always'),
        mark(C, 'C'),
        mark(D, 'D'),
        mark(Ap, "A′"),
        mark(Bp, "B′"),
        mark(Cp, "C′"),
        mark(Dp, "D′"),
      ],
      paths: [
        linePath('parAB', parallelThrough(AB, C)),
        linePath('parAC', parallelThrough(AC, B)),
        polyPath('para', [A, B, D, C]),
        polyPath('para2', [Ap, Bp, Dp, Cp], true),
      ],
      questions: [
        drawQ(
          `Tracez la droite parallèle à (AB) passant par le point C ${formatAxesCoord(C.x, C.y)}.`,
          `C ${formatAxesCoord(C.x, C.y)}`,
        ),
        drawQ('Tracez la droite parallèle à (AC) passant par le point B.', 'parallèle à (AC) par B'),
        pairQ('Les deux droites se croisent en D', D),
        textQ('Reliez les points A, B, C et D. Quelle figure avez-vous obtenue ?', figure),
        drawQ(
          'Construisez A′B′C′D′, symétrique de ABCD par rapport à l’axe des x.',
          `A′ ${formatAxesCoord(Ap.x, Ap.y)}`,
        ),
        pairQ('Où se trouve le point C ?', C),
        textQ('Les côtés [AB] et [CD] sont', 'parallèles'),
      ],
    }
  }
  return null
}

function familyRectangle(rng: Rng, range: number): Draft | null {
  for (let attempt = 0; attempt < 40; attempt++) {
    const A = randomPoint(rng, range, [], 2)
    if (!A) return null
    const u = int(rng, 2, 5) * (rng() < 0.5 ? 1 : -1)
    const v = int(rng, 2, 5) * (rng() < 0.5 ? 1 : -1)
    const B = { x: A.x + u, y: A.y }
    const C = { x: B.x, y: B.y + v }
    const D = { x: A.x, y: A.y + v }
    if (![B, C, D].every((p) => inside(p, range, 1))) continue
    const Op = [A, B, C, D].map(flipO)
    if (!Op.every((p) => inside(p, range))) continue
    return {
      given: [mark(A, 'A', 'always'), mark(B, 'B', 'always')],
      marks: [mark(A, 'A', 'always'), mark(B, 'B', 'always'), mark(C, 'C'), mark(D, 'D'), ...['A′', 'B′', 'C′', 'D′'].map((lab, i) => mark(Op[i]!, lab))],
      paths: [polyPath('rect', [A, B, C, D]), polyPath('rect2', Op, true), linePath('h', { a: 0, b: 1, c: -C.y }, true), linePath('v', { a: 1, b: 0, c: -C.x }, true)],
      questions: [
        drawQ(
          `Tracez la perpendiculaire à (AB) passant par B, jusqu’au point C ${formatAxesCoord(C.x, C.y)}.`,
          `C ${formatAxesCoord(C.x, C.y)}`,
        ),
        drawQ('Tracez la perpendiculaire à (AB) passant par A.', 'perpendiculaire par A'),
        pairQ('Les deux perpendiculaires et la parallèle à (AB) passant par C se coupent : le point D est', D),
        textQ('Reliez les points A, B, C et D. Quelle figure avez-vous obtenue ?', 'un rectangle'),
        drawQ('Construisez A′B′C′D′, symétrique de ABCD par rapport à l’origine.', `A′ ${formatAxesCoord(Op[0]!.x, Op[0]!.y)}`),
        pairQ('Où se trouve le point C ?', C),
      ],
    }
  }
  return null
}

function familyMediatrice(rng: Rng, range: number): Draft | null {
  for (let attempt = 0; attempt < 40; attempt++) {
    const A = randomPoint(rng, range, [], 2)
    const B = A && randomPoint(rng, range, [A], 2)
    if (!A || !B) continue
    if ((A.x + B.x) % 2 !== 0 || (A.y + B.y) % 2 !== 0) continue
    const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
    if (!inside(M, range)) continue
    const med = perpThrough(lineThrough(A, B), M)
    const on = latticeOn(med, range).filter((p) => !same(p, M) && !same(p, A) && !same(p, B) && inside(p, range, 1))
    if (!on.length) continue
    const pickC = pick(rng, on)
    const Ap = flipY(A)
    if (!inside(Ap, range)) continue
    return {
      given: [mark(A, 'A', 'always'), mark(B, 'B', 'always')],
      marks: [mark(A, 'A', 'always'), mark(B, 'B', 'always'), mark(M, 'M'), mark(pickC, 'C'), mark(Ap, "A′")],
      paths: [segmentPath('ab', [A, B]), linePath('med', med, true), segmentPath('tri', [A, B, pickC, A])],
      questions: [
        pairQ('Placez le milieu M du segment [AB]. Il se trouve en', M),
        drawQ('Tracez la médiatrice du segment [AB].', 'médiatrice de [AB]'),
        drawQ(
          `Placez le point C ${formatAxesCoord(pickC.x, pickC.y)} sur la médiatrice.`,
          `C ${formatAxesCoord(pickC.x, pickC.y)}`,
        ),
        textQ('Quelle nature a le triangle ABC ?', 'isocèle'),
        pairQ('Tracez le symétrique A′ de A par rapport à l’axe des y. A′ se trouve en', Ap),
        textQ('Les points A et B sont', 'équidistants de M'),
      ],
    }
  }
  return null
}

function latticeOn(line: LineEq, range: number): Pt[] {
  const pts: Pt[] = []
  for (let x = -range; x <= range; x++) {
    if (line.b === 0) {
      const vx = -line.c / line.a
      if (vx === x) {
        for (let y = -range; y <= range; y++) pts.push({ x, y })
      }
      continue
    }
    const y = -(line.a * x + line.c) / line.b
    if (Number.isInteger(y) && Math.abs(y) <= range) pts.push({ x, y })
  }
  return pts
}

function familyTranslation(rng: Rng, range: number): Draft | null {
  for (let attempt = 0; attempt < 40; attempt++) {
    const A = randomPoint(rng, range, [], 2)
    const B = A && randomPoint(rng, range, [A], 2)
    if (!A || !B) continue
    const ux = int(rng, 2, 5) * (rng() < 0.5 ? 1 : -1)
    const uy = int(rng, 2, 5) * (rng() < 0.5 ? 1 : -1)
    const C = { x: A.x + ux, y: A.y + uy }
    const D = { x: B.x + ux, y: B.y + uy }
    if (!inside(C, range, 1) || !inside(D, range, 1) || !uniquePts([A, B, C, D])) continue
    const I = { x: (A.x + D.x) / 2, y: (A.y + D.y) / 2 }
    if (!Number.isInteger(I.x) || !Number.isInteger(I.y) || !inside(I, range)) continue
    const figure = nameQuad(A, B, D, C)
    return {
      given: [mark(A, 'A', 'always'), mark(B, 'B', 'always')],
      marks: [mark(A, 'A', 'always'), mark(B, 'B', 'always'), mark(C, 'C'), mark(D, 'D'), mark(I, 'I')],
      paths: [polyPath('tr', [A, B, D, C]), segmentPath('diag1', [A, D], true), segmentPath('diag2', [B, C], true)],
      questions: [
        pairQ(
          `Le point C est l’image de A par la translation de vecteur (${formatVec(ux)} ; ${formatVec(uy)}). C se trouve en`,
          C,
        ),
        pairQ('Placez D, image de B par la même translation. D se trouve en', D),
        textQ('Reliez les points A, B, D et C. Quelle figure avez-vous obtenue ?', figure),
        pairQ('Les diagonales [AD] et [BC] se coupent en', I),
        drawQ('Tracez les diagonales [AD] et [BC].', 'diagonales tracées'),
        textQ('La translation envoie le segment [AB] sur', '[CD]'),
      ],
    }
  }
  return null
}

function formatVec(n: number): string {
  return n < 0 ? `−${-n}` : String(n)
}

const FAMILIES = [familyDroites, familyCarre, familyPara, familyRectangle, familyMediatrice, familyTranslation]

export function generateConstruire(
  config: PageConfig,
  rng: Rng,
): { items: MathItem[]; instruction: string } {
  const difficulty = config.difficulty ?? 'moyen'
  const range = clampCoordRange(config.coordRange ?? constructRangeFor(difficulty))
  const questionCount = Math.max(1, Math.min(config.count || 5, 8))
  const makers = difficulty === 'facile' ? [familyDroites, familyPara, familyTranslation] : FAMILIES
  const start = Math.abs(Math.floor(rng() * 1e9)) % makers.length
  let draft: Draft | null = null
  for (let i = 0; i < makers.length; i++) {
    draft = makers[(start + i) % makers.length]!(rng, range)
    if (draft) break
  }
  if (!draft) draft = familyDroites(rng, range)
  if (!draft) {
    const A = { x: -4, y: -3 }
    const D = { x: 5, y: 4 }
    draft = {
      given: [mark(A, 'A', 'always'), mark(D, 'D', 'always')],
      marks: [mark(A, 'A', 'always'), mark(D, 'D', 'always')],
      paths: [linePath('AD', lineThrough(A, D))],
      questions: [drawQ('Tracez la droite (AD).', 'droite (AD)')],
    }
  }

  const questions = draft.questions.slice(0, questionCount)
  const scene: CoordScene = {
    variant: 'axes',
    cols: range * 2,
    rows: range * 2,
    axis: 'numeric',
    range,
    step: 1,
    fineGrid: true,
    marks: draft.marks,
    paths: draft.paths,
  }
  const instruction = 'Placez les points demandés. Tracez les droites et les figures.'
  return {
    instruction,
    items: [
      {
        layout: 'coord',
        prompt: instruction,
        coordScene: scene,
        coordQuestions: questions,
        coordTask: 'construct',
        answer: questions.map((q) => `${q.prompt} : ${q.answer}`).join(' · '),
      },
    ],
  }
}

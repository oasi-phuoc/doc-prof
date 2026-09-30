/**
 * Transformations géométriques sur le même repère que « Construire / Lire les droites ».
 * Type 1 : figure fermée + symétrie axiale (x ou y).
 * Type 2 : figure fermée + symétrie centrale (centre libre ou tiré).
 * Type 3 : comme 1, un seul point placé ; les autres à placer puis symétrie.
 * Type 4 : comme 2, un seul point placé ; les autres à placer puis symétrie.
 */
import { int, pick, type Rng } from './rng'
import { formatAxesCoord, resolveAxesGrid } from './coord-reperage'
import type {
  CoordLineColor,
  CoordMark,
  CoordPath,
  CoordQuestion,
  CoordScene,
  MathItem,
  PageConfig,
} from './types'

export function isTransformationExercise(typeId: string): boolean {
  return (
    typeId === 'transformations-axiale-figure' ||
    typeId === 'transformations-centrale-figure' ||
    typeId === 'transformations-axiale-placer' ||
    typeId === 'transformations-centrale-placer'
  )
}

export function isTransformationAxiale(typeId: string): boolean {
  return typeId === 'transformations-axiale-figure' || typeId === 'transformations-axiale-placer'
}

export function isTransformationCentrale(typeId: string): boolean {
  return typeId === 'transformations-centrale-figure' || typeId === 'transformations-centrale-placer'
}

export function isTransformationPlacer(typeId: string): boolean {
  return typeId === 'transformations-axiale-placer' || typeId === 'transformations-centrale-placer'
}

type Pt = { x: number; y: number }

const EDGE_COLORS: CoordLineColor[] = ['violet', 'orange', 'green', 'blue', 'red', 'rose']
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'] as const

function same(p: Pt, q: Pt): boolean {
  return p.x === q.x && p.y === q.y
}

function keyOf(p: Pt): string {
  return `${p.x},${p.y}`
}

function inside(p: Pt, range: number, margin = 0): boolean {
  return Math.abs(p.x) <= range - margin && Math.abs(p.y) <= range - margin
}

function flipX(p: Pt): Pt {
  return { x: p.x, y: -p.y }
}
function flipY(p: Pt): Pt {
  return { x: -p.x, y: p.y }
}
function flipCenter(p: Pt, c: Pt): Pt {
  return { x: 2 * c.x - p.x, y: 2 * c.y - p.y }
}

function mark(p: Pt, label: string, reveal: 'always' | 'answer' = 'always'): CoordMark {
  return { x: p.x, y: p.y, kind: 'point', label, reveal }
}

function segment(id: string, a: Pt, b: Pt, color: CoordLineColor, reveal: 'always' | 'answer' = 'always'): CoordPath {
  return { id, kind: 'segment', points: [a, b], stroke: 'solid', color, reveal }
}

function closedEdges(pts: Pt[], prefix: string, reveal: 'always' | 'answer'): CoordPath[] {
  return pts.map((p, i) => {
    const q = pts[(i + 1) % pts.length]!
    return segment(`${prefix}-${i}`, p, q, EDGE_COLORS[i % EDGE_COLORS.length]!, reveal)
  })
}

function randomPolygon(rng: Rng, range: number, n: number, avoid: Pt[] = []): Pt[] | null {
  const margin = 1
  const pool: Pt[] = []
  for (let x = -range + margin; x <= range - margin; x++) {
    for (let y = -range + margin; y <= range - margin; y++) {
      if (x === 0 && y === 0) continue
      const p = { x, y }
      if (avoid.some((u) => same(u, p))) continue
      pool.push(p)
    }
  }
  if (pool.length < n) return null
  for (let attempt = 0; attempt < 80; attempt++) {
    const chosen: Pt[] = []
    const left = [...pool]
    for (let i = 0; i < n; i++) {
      if (!left.length) break
      const idx = int(rng, 0, left.length - 1)
      chosen.push(left.splice(idx, 1)[0]!)
    }
    if (chosen.length !== n) continue
    if (new Set(chosen.map(keyOf)).size !== n) continue
    // Évite les points colinéaires grossiers (aire nulle).
    let area = 0
    for (let i = 0; i < n; i++) {
      const a = chosen[i]!
      const b = chosen[(i + 1) % n]!
      area += a.x * b.y - b.x * a.y
    }
    if (Math.abs(area) < 2) continue
    return chosen
  }
  return null
}

function ensureImagesInside(pts: Pt[], map: (p: Pt) => Pt, range: number): boolean {
  return pts.every((p) => inside(map(p), range))
}

function pickCenter(rng: Rng, range: number, libreCenter?: Pt): Pt {
  if (libreCenter && inside(libreCenter, range)) return libreCenter
  const pool: Pt[] = []
  for (let x = -Math.min(3, range - 2); x <= Math.min(3, range - 2); x++) {
    for (let y = -Math.min(3, range - 2); y <= Math.min(3, range - 2); y++) {
      pool.push({ x, y })
    }
  }
  return pick(rng, pool.length ? pool : [{ x: 0, y: 0 }])
}

function libreCenterFromConfig(config: PageConfig): Pt | undefined {
  if (!config.coordLibre) return undefined
  const markPt = (config.coordMarks ?? []).find((m) => m.kind === 'point')
  if (!markPt) return undefined
  return { x: markPt.x, y: markPt.y }
}

export function generateTransformations(
  config: PageConfig,
  rng: Rng,
): { items: MathItem[]; instruction: string } {
  const difficulty = config.difficulty ?? 'moyen'
  const grid = resolveAxesGrid(config, difficulty)
  const range = Math.min(grid.rangeX, grid.rangeY)
  const typeId = config.exerciseType
  const axiale = isTransformationAxiale(typeId)
  const placer = isTransformationPlacer(typeId)
  const n = difficulty === 'facile' ? 3 : difficulty === 'moyen' ? 4 : pick(rng, [3, 4, 5])

  const axis: 'x' | 'y' = pick(rng, ['x', 'y'])
  const center = pickCenter(rng, range, libreCenterFromConfig(config))
  const map = axiale
    ? axis === 'x'
      ? flipX
      : flipY
    : (p: Pt) => flipCenter(p, center)

  let pts: Pt[] | null = null
  for (let i = 0; i < 40; i++) {
    const cand = randomPolygon(rng, range, n, axiale ? [] : [center])
    if (!cand) continue
    if (!ensureImagesInside(cand, map, range)) continue
    // Images distinctes des sommets d’origine.
    const imgs = cand.map(map)
    if (imgs.some((ip, idx) => cand.some((op, j) => idx !== j && same(ip, op)))) continue
    if (imgs.some((ip) => cand.some((op) => same(ip, op)))) continue
    pts = cand
    break
  }
  if (!pts) {
    pts = [
      { x: 2, y: 3 },
      { x: 5, y: 2 },
      { x: 4, y: -1 },
    ]
  }

  const images = pts.map(map)
  const givenIndex = placer ? int(rng, 0, pts.length - 1) : -1

  const marks: CoordMark[] = []
  pts.forEach((p, i) => {
    const label = LABELS[i] ?? `P${i + 1}`
    const reveal: 'always' | 'answer' = placer && i !== givenIndex ? 'answer' : 'always'
    marks.push(mark(p, label, reveal))
  })
  images.forEach((p, i) => {
    const label = `${LABELS[i] ?? `P${i + 1}`}′`
    marks.push(mark(p, label, 'answer'))
  })
  if (!axiale) {
    marks.push({
      x: center.x,
      y: center.y,
      kind: 'point',
      label: 'Ω',
      reveal: 'always',
      showCoord: true,
      given: true,
    })
  }

  const paths: CoordPath[] = [
    ...closedEdges(pts, 'fig', placer ? 'answer' : 'always'),
    ...closedEdges(images, 'img', 'answer'),
  ]
  // En mode placer : montrer le segment depuis le point donné seulement côté élève.
  if (placer) {
    const g = pts[givenIndex]!
    const next = pts[(givenIndex + 1) % pts.length]!
    const prev = pts[(givenIndex - 1 + pts.length) % pts.length]!
    paths.push(
      segment('hint-next', g, next, EDGE_COLORS[0]!, 'answer'),
      segment('hint-prev', prev, g, EDGE_COLORS[1]!, 'answer'),
    )
  }

  const axisLabel = axis === 'x' ? 'l’axe des abscisses (Ox)' : 'l’axe des ordonnées (Oy)'
  const instruction = axiale
    ? placer
      ? `Un point de la figure est placé. Placez les autres sommets aux coordonnées indiquées, joignez-les pour former une figure fermée, puis construisez son image par la symétrie axiale par rapport à ${axisLabel}.`
      : `La figure fermée est donnée. Construisez son image par la symétrie axiale par rapport à ${axisLabel}.`
    : placer
      ? `Un point de la figure est placé. Placez les autres sommets aux coordonnées indiquées, joignez-les pour former une figure fermée, puis construisez son image par la symétrie centrale de centre Ω${formatAxesCoord(center.x, center.y)}.`
      : `La figure fermée est donnée. Construisez son image par la symétrie centrale de centre Ω${formatAxesCoord(center.x, center.y)}.`

  const questions: CoordQuestion[] = []
  if (placer) {
    pts.forEach((p, i) => {
      if (i === givenIndex) return
      const label = LABELS[i] ?? `P${i + 1}`
      questions.push({
        prompt: `Placez le point ${label}${formatAxesCoord(p.x, p.y)}`,
        answer: formatAxesCoord(p.x, p.y),
        reply: 'draw',
      })
    })
  }
  questions.push({
    prompt: axiale
      ? `Tracez l’image par symétrie axiale par rapport à ${axisLabel}`
      : `Tracez l’image par symétrie centrale de centre Ω`,
    answer: images.map((p, i) => `${LABELS[i] ?? 'P'}′${formatAxesCoord(p.x, p.y)}`).join(' · '),
    reply: 'draw',
  })
  images.forEach((p, i) => {
    const label = `${LABELS[i] ?? `P${i + 1}`}′`
    questions.push({
      prompt: `Coordonnées de ${label}`,
      answer: formatAxesCoord(p.x, p.y),
      reply: 'pair',
    })
  })

  const scene: CoordScene = {
    variant: 'axes',
    cols: grid.cols,
    rows: grid.rows,
    axis: 'numeric',
    range: Math.max(grid.rangeX, grid.rangeY),
    rangeX: grid.rangeX,
    rangeY: grid.rangeY,
    cellMm: grid.cellMm,
    unitSquares: grid.unitSquares,
    step: 1,
    fineGrid: false,
    marks,
    paths,
  }

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

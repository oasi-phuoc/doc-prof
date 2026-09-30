/**
 * Transformations géométriques sur le même repère que « Construire / Lire les droites ».
 * Type 1 : figure fermée + symétrie axiale (x ou y).
 * Type 2 : figure fermée + symétrie centrale (centre libre ou tiré).
 * Type 3 : comme 1, un seul point placé ; les autres à placer puis symétrie.
 * Type 4 : comme 2, un seul point placé ; les autres à placer puis symétrie.
 *
 * Pas de bloc « questions » : types 3–4 affichent deux colonnes de données
 * (points à placer / coordonnées des images).
 */
import { int, pick, type Rng } from './rng'
import { formatAxesCoord, resolveAxesGrid } from './coord-reperage'
import type {
  CoordLineColor,
  CoordMark,
  CoordPath,
  CoordScene,
  CoordTransformColumns,
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
/** Jusqu’à 10 sommets (types 3 et 4 en mode libre). */
export const TRANSFORM_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] as const
export const TRANSFORM_MAX_POINTS = 10

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
  const omega = (config.coordMarks ?? []).find((m) => m.label === 'Ω')
  if (omega) return { x: omega.x, y: omega.y }
  return undefined
}

/** Sommets de la figure posés en mode libre (hors Ω), dans l’ordre des labels. */
function libreFigureFromConfig(config: PageConfig): Pt[] | null {
  if (!config.coordLibre) return null
  const labeled = (config.coordMarks ?? []).filter(
    (m) => m.kind === 'point' && m.label && m.label !== 'Ω',
  )
  if (!labeled.length) return null
  const order = new Map(TRANSFORM_LABELS.map((label, index) => [label, index]))
  const sorted = [...labeled].sort((a, b) => {
    const ia = order.get(a.label as (typeof TRANSFORM_LABELS)[number]) ?? 99
    const ib = order.get(b.label as (typeof TRANSFORM_LABELS)[number]) ?? 99
    return ia - ib
  })
  return sorted.slice(0, TRANSFORM_MAX_POINTS).map((m) => ({ x: m.x, y: m.y }))
}

function pointCountFor(config: PageConfig, difficulty: string, placer: boolean): number {
  const maxN = TRANSFORM_MAX_POINTS
  const fallback = difficulty === 'facile' ? 3 : difficulty === 'moyen' ? 4 : 5
  const requested = config.count || fallback
  return Math.max(3, Math.min(requested, maxN, placer ? TRANSFORM_MAX_POINTS : TRANSFORM_MAX_POINTS))
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
  const n = pointCountFor(config, difficulty, placer)

  const axis: 'x' | 'y' = pick(rng, ['x', 'y'])
  const center = pickCenter(rng, range, libreCenterFromConfig(config))
  const map = axiale
    ? axis === 'x'
      ? flipX
      : flipY
    : (p: Pt) => flipCenter(p, center)

  const librePts = libreFigureFromConfig(config)
  let pts: Pt[] | null = librePts
  if (!pts) {
    for (let i = 0; i < 40; i++) {
      const cand = randomPolygon(rng, range, n, axiale ? [] : [center])
      if (!cand) continue
      if (!ensureImagesInside(cand, map, range)) continue
      const imgs = cand.map(map)
      if (imgs.some((ip, idx) => cand.some((op, j) => idx !== j && same(ip, op)))) continue
      if (imgs.some((ip) => cand.some((op) => same(ip, op)))) continue
      pts = cand
      break
    }
  }
  if (!pts) {
    pts = [
      { x: 2, y: 3 },
      { x: 5, y: 2 },
      { x: 4, y: -1 },
    ]
  }

  const images = pts.map(map)
  const givenIndex = placer ? 0 : -1

  const marks: CoordMark[] = []
  pts.forEach((p, i) => {
    const label = TRANSFORM_LABELS[i] ?? `P${i + 1}`
    const reveal: 'always' | 'answer' = placer && i !== givenIndex ? 'answer' : 'always'
    marks.push(mark(p, label, reveal))
  })
  images.forEach((p, i) => {
    const label = `${TRANSFORM_LABELS[i] ?? `P${i + 1}`}′`
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

  const paths: CoordPath[] = []
  if (pts.length >= 3) {
    paths.push(
      ...closedEdges(pts, 'fig', placer ? 'answer' : 'always'),
      ...closedEdges(images, 'img', 'answer'),
    )
  }
  if (placer && pts.length >= 2) {
    const g = pts[givenIndex]!
    const next = pts[(givenIndex + 1) % pts.length]!
    const prev = pts[(givenIndex - 1 + pts.length) % pts.length]!
    paths.push(
      segment('hint-next', g, next, EDGE_COLORS[0]!, 'answer'),
      segment('hint-prev', prev, g, EDGE_COLORS[1]!, 'answer'),
    )
  }

  const axisLabel = axis === 'x' ? 'l’axe des abscisses (Ox)' : 'l’axe des ordonnées (Oy)'
  const centerLabel = `Ω${formatAxesCoord(center.x, center.y)}`

  let instruction: string
  if (placer) {
    instruction = axiale
      ? `Colonne 1 : placez les points aux coordonnées indiquées et formez une figure fermée. Colonne 2 : écrivez les coordonnées des nouveaux points (images) après la symétrie axiale par rapport à ${axisLabel}.`
      : `Colonne 1 : placez les points aux coordonnées indiquées et formez une figure fermée. Colonne 2 : écrivez les coordonnées des nouveaux points (images) après la symétrie centrale de centre ${centerLabel}.`
  } else {
    instruction = axiale
      ? `La figure fermée est donnée. Construisez son image par la symétrie axiale par rapport à ${axisLabel}.`
      : `La figure fermée est donnée. Construisez son image par la symétrie centrale de centre ${centerLabel}.`
  }

  let coordColumns: CoordTransformColumns | undefined
  if (placer) {
    const toPlace = pts
      .map((p, i) => ({ p, i }))
      .filter(({ i }) => i !== givenIndex)
      .map(({ p, i }) => {
        const label = TRANSFORM_LABELS[i] ?? `P${i + 1}`
        return { label, text: `${label}${formatAxesCoord(p.x, p.y)}` }
      })
    const imageRows = images.map((p, i) => {
      const label = `${TRANSFORM_LABELS[i] ?? `P${i + 1}`}′`
      return { label, answer: formatAxesCoord(p.x, p.y) }
    })
    coordColumns = {
      leftTitle: 'Colonne 1 — Points à placer',
      left: toPlace,
      rightTitle: 'Colonne 2 — Nouveaux points',
      right: imageRows,
    }
  }

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

  const answer = images
    .map((p, i) => `${TRANSFORM_LABELS[i] ?? 'P'}′${formatAxesCoord(p.x, p.y)}`)
    .join(' · ')

  return {
    instruction,
    items: [
      {
        layout: 'coord',
        prompt: instruction,
        coordScene: scene,
        coordColumns,
        coordTask: 'construct',
        answer,
      },
    ],
  }
}

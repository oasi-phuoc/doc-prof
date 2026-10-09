/**
 * Figures de symétrie axiale (axe vertical) pour TCM CFR.
 * Quadrillage 20 × 10 cases, axe au milieu (x = 10), figure d’un seul côté.
 * Traits d’une case d’épaisseur (escaliers, lettres).
 */
import { pick, type Rng } from '@/math/rng'

export type GridPt = { x: number; y: number }

export type SymmetryTemplate = {
  id: string
  cols: number
  rows: number
  axisX: number
  side: 'left' | 'right'
  /** Polylignes fermées ou ouvertes ; la figure ne touche pas l’axe. */
  polylines: GridPt[][]
}

/** Grille 20 de long × 10 de haut, axe vertical au centre. */
const COLS = 20
const ROWS = 10
const AXIS = 10

function T(
  id: string,
  side: 'left' | 'right',
  polylines: GridPt[][],
): SymmetryTemplate {
  return { id, cols: COLS, rows: ROWS, axisX: AXIS, side, polylines }
}

/**
 * Silhouettes à 1 case d’épaisseur (géométrie originale).
 * Toutes définies à gauche de l’axe, sans le toucher (x max ≤ 9).
 */
export const SYMMETRY_TEMPLATES: readonly SymmetryTemplate[] = [
  // Escaliers (1 case)
  T('escaliers', 'left', [
    [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 8, y: 7 },
      { x: 8, y: 8 },
      { x: 9, y: 8 },
      { x: 9, y: 9 },
    ],
  ]),

  // Lettre E (contour 1 case)
  T('lettre-e', 'left', [
    [
      { x: 2, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 8 },
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 2, y: 9 },
      { x: 2, y: 1 },
    ],
  ]),

  // Lettre C
  T('lettre-c', 'left', [
    [
      { x: 8, y: 2 },
      { x: 8, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 8 },
      { x: 3, y: 9 },
      { x: 8, y: 9 },
      { x: 8, y: 8 },
      { x: 3, y: 8 },
      { x: 3, y: 2 },
      { x: 8, y: 2 },
    ],
  ]),

  // Lettre F
  T('lettre-f', 'left', [
    [
      { x: 2, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 4 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 9 },
      { x: 2, y: 9 },
      { x: 2, y: 1 },
    ],
  ]),

  // Lettre H
  T('lettre-h', 'left', [
    [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 4 },
      { x: 7, y: 4 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
      { x: 7, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 9 },
      { x: 2, y: 9 },
      { x: 2, y: 1 },
    ],
  ]),

  // Lettre I
  T('lettre-i', 'left', [
    [
      { x: 3, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 8 },
      { x: 7, y: 8 },
      { x: 7, y: 9 },
      { x: 3, y: 9 },
      { x: 3, y: 8 },
      { x: 4, y: 8 },
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
    ],
  ]),

  // Lettre L
  T('lettre-l', 'left', [
    [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 8 },
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 2, y: 9 },
      { x: 2, y: 1 },
    ],
  ]),

  // Lettre T
  T('lettre-t', 'left', [
    [
      { x: 1, y: 1 },
      { x: 9, y: 1 },
      { x: 9, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 9 },
      { x: 4, y: 9 },
      { x: 4, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ],
  ]),

  // Lettre U
  T('lettre-u', 'left', [
    [
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 7 },
      { x: 4, y: 8 },
      { x: 6, y: 8 },
      { x: 7, y: 7 },
      { x: 7, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 8 },
      { x: 7, y: 9 },
      { x: 3, y: 9 },
      { x: 2, y: 8 },
      { x: 2, y: 1 },
    ],
  ]),

  // Lettre Z
  T('lettre-z', 'left', [
    [
      { x: 2, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 2 },
      { x: 4, y: 2 },
      { x: 8, y: 8 },
      { x: 8, y: 9 },
      { x: 2, y: 9 },
      { x: 2, y: 8 },
      { x: 6, y: 8 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
    ],
  ]),
]

/** Symétrie orthogonale par rapport à la verticale x = axisX. */
export function mirrorPoint(p: GridPt, axisX: number): GridPt {
  return { x: 2 * axisX - p.x, y: p.y }
}

export function pickSymmetryTemplate(rng: Rng): SymmetryTemplate {
  const base = pick(rng, SYMMETRY_TEMPLATES)
  // Alterner gauche / droite pour varier les fiches.
  if (rng() < 0.5) return base
  return {
    ...base,
    id: `${base.id}-droite`,
    side: 'right',
    polylines: base.polylines.map((poly) => poly.map((p) => mirrorPoint(p, base.axisX))),
  }
}

/**
 * Figures de symétrie axiale (axe vertical) pour TCM CFR.
 * Quadrillage 20 × 10 cases, axe au milieu (x = 10), figure d’un seul côté.
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
 * Dix silhouettes reconnaissables (géométrie originale).
 * Toutes définies à gauche de l’axe, sans le toucher (x max ≤ 9).
 * `pickSymmetryTemplate` peut les retourner à droite par symétrie.
 */
export const SYMMETRY_TEMPLATES: readonly SymmetryTemplate[] = [
  // 1. Bateau à voile
  T('bateau', 'left', [
    [
      { x: 1, y: 2 },
      { x: 8, y: 2 },
      { x: 7, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 4, y: 2 },
      { x: 4, y: 9 },
    ],
    [
      { x: 1, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 9 },
      { x: 1, y: 3 },
    ],
    [
      { x: 4, y: 5 },
      { x: 7, y: 5 },
      { x: 4, y: 9 },
      { x: 4, y: 5 },
    ],
  ]),

  // 2. Maison
  T('maison', 'left', [
    [
      { x: 1, y: 1 },
      { x: 8, y: 1 },
      { x: 8, y: 5 },
      { x: 1, y: 5 },
      { x: 1, y: 1 },
    ],
    [
      { x: 1, y: 5 },
      { x: 4.5, y: 9 },
      { x: 8, y: 5 },
    ],
    [
      { x: 3, y: 1 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 1 },
    ],
    [
      { x: 6, y: 3 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 7, y: 3 },
      { x: 6, y: 3 },
    ],
  ]),

  // 3. Arbre
  T('arbre', 'left', [
    [
      { x: 4, y: 1 },
      { x: 4, y: 4 },
    ],
    [
      { x: 3, y: 1 },
      { x: 5, y: 1 },
    ],
    [
      { x: 1, y: 4 },
      { x: 7, y: 4 },
      { x: 6, y: 6 },
      { x: 4, y: 9 },
      { x: 2, y: 6 },
      { x: 1, y: 4 },
    ],
  ]),

  // 4. Flèche (pointe vers l’axe)
  T('fleche', 'left', [
    [
      { x: 1, y: 4 },
      { x: 5, y: 4 },
      { x: 5, y: 2 },
      { x: 9, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 6 },
      { x: 1, y: 6 },
      { x: 1, y: 4 },
    ],
  ]),

  // 5. Lettre E
  T('lettre-e', 'left', [
    [
      { x: 2, y: 1 },
      { x: 2, y: 9 },
      { x: 8, y: 9 },
    ],
    [
      { x: 2, y: 5 },
      { x: 6, y: 5 },
    ],
    [
      { x: 2, y: 1 },
      { x: 8, y: 1 },
    ],
  ]),

  // 6. Escaliers
  T('escaliers', 'left', [
    [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 5, y: 3 },
      { x: 5, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 7 },
      { x: 9, y: 7 },
      { x: 9, y: 9 },
    ],
  ]),

  // 7. Drapeau
  T('drapeau', 'left', [
    [
      { x: 2, y: 1 },
      { x: 2, y: 9 },
    ],
    [
      { x: 2, y: 9 },
      { x: 8, y: 9 },
      { x: 8, y: 6 },
      { x: 2, y: 6 },
    ],
  ]),

  // 8. Fusée
  T('fusee', 'left', [
    [
      { x: 3, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 7 },
      { x: 4.5, y: 9 },
      { x: 3, y: 7 },
      { x: 3, y: 2 },
    ],
    [
      { x: 3, y: 2 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
    ],
    [
      { x: 6, y: 2 },
      { x: 8, y: 1 },
      { x: 6, y: 1 },
    ],
    [
      { x: 4.5, y: 4 },
      { x: 4.5, y: 6 },
    ],
  ]),

  // 9. Poisson
  T('poisson', 'left', [
    [
      { x: 1, y: 5 },
      { x: 3, y: 7 },
      { x: 6, y: 8 },
      { x: 8, y: 6 },
      { x: 9, y: 5 },
      { x: 8, y: 4 },
      { x: 6, y: 2 },
      { x: 3, y: 3 },
      { x: 1, y: 5 },
    ],
    [
      { x: 1, y: 5 },
      { x: 0, y: 7 },
      { x: 0, y: 3 },
      { x: 1, y: 5 },
    ],
    [
      { x: 7, y: 5.5 },
      { x: 7.5, y: 5.5 },
    ],
  ]),

  // 10. Clé
  T('cle', 'left', [
    [
      { x: 2, y: 7 },
      { x: 4, y: 9 },
      { x: 6, y: 9 },
      { x: 8, y: 7 },
      { x: 8, y: 5 },
      { x: 6, y: 3 },
      { x: 4, y: 3 },
      { x: 2, y: 5 },
      { x: 2, y: 7 },
    ],
    [
      { x: 5, y: 3 },
      { x: 5, y: 1 },
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 1.5 },
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

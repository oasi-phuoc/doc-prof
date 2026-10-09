/**
 * Figures de symétrie axiale (axe vertical) pour TCM CFR.
 * Grille type transformations : ~12×7 cases, axe au milieu, figure d’un seul côté.
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

/** Grille alignée sur le bateau de référence (12×7 cases, axe en x = 6). */
const COLS = 12
const ROWS = 7
const AXIS = 6

function T(
  id: string,
  side: 'left' | 'right',
  polylines: GridPt[][],
): SymmetryTemplate {
  return { id, cols: COLS, rows: ROWS, axisX: AXIS, side, polylines }
}

/**
 * Dix silhouettes reconnaissables (géométrie originale, pas une copie pixel).
 * Toutes à gauche de l’axe, sans le toucher (x max ≤ 5).
 */
export const SYMMETRY_TEMPLATES: readonly SymmetryTemplate[] = [
  // 1. Bateau à voile
  T('bateau', 'left', [
    [
      { x: 1, y: 2 },
      { x: 5, y: 2 },
      { x: 4, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 3, y: 2 },
      { x: 3, y: 6 },
    ],
    [
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 6 },
      { x: 1, y: 3 },
    ],
    [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 6 },
      { x: 3, y: 4 },
    ],
  ]),

  // 2. Maison
  T('maison', 'left', [
    [
      { x: 1, y: 1 },
      { x: 5, y: 1 },
      { x: 5, y: 4 },
      { x: 1, y: 4 },
      { x: 1, y: 1 },
    ],
    [
      { x: 1, y: 4 },
      { x: 3, y: 6 },
      { x: 5, y: 4 },
    ],
    [
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 1 },
    ],
    [
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
      { x: 4, y: 2 },
    ],
  ]),

  // 3. Arbre
  T('arbre', 'left', [
    [
      { x: 3, y: 1 },
      { x: 3, y: 3 },
    ],
    [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
    ],
    [
      { x: 1, y: 3 },
      { x: 5, y: 3 },
      { x: 4, y: 5 },
      { x: 3, y: 6 },
      { x: 2, y: 5 },
      { x: 1, y: 3 },
    ],
  ]),

  // 4. Flèche (pointe à droite, vers l’axe)
  T('fleche', 'left', [
    [
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 2 },
      { x: 5, y: 4 },
      { x: 3, y: 6 },
      { x: 3, y: 5 },
      { x: 1, y: 5 },
      { x: 1, y: 3 },
    ],
  ]),

  // 5. Lettre F
  T('lettre-f', 'left', [
    [
      { x: 2, y: 1 },
      { x: 2, y: 6 },
      { x: 5, y: 6 },
    ],
    [
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ],
  ]),

  // 6. Escaliers
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
    ],
  ]),

  // 7. Drapeau
  T('drapeau', 'left', [
    [
      { x: 2, y: 1 },
      { x: 2, y: 6 },
    ],
    [
      { x: 2, y: 6 },
      { x: 5, y: 6 },
      { x: 5, y: 4 },
      { x: 2, y: 4 },
    ],
  ]),

  // 8. Fusée
  T('fusee', 'left', [
    [
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 4, y: 5 },
      { x: 3, y: 6 },
      { x: 2, y: 5 },
      { x: 2, y: 2 },
    ],
    [
      { x: 2, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 4, y: 2 },
      { x: 5, y: 1 },
      { x: 4, y: 1 },
    ],
    [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ],
  ]),

  // 9. Oiseau (profil)
  T('oiseau', 'left', [
    [
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 4 },
    ],
    [
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
    ],
    [
      { x: 1, y: 4 },
      { x: 0, y: 5 },
    ],
  ]),

  // 10. Chapeau (simple)
  T('chapeau', 'left', [
    [
      { x: 0, y: 2 },
      { x: 5, y: 2 },
    ],
    [
      { x: 1, y: 2 },
      { x: 1, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 4, y: 2 },
    ],
  ]),
]

export function pickSymmetryTemplate(rng: Rng): SymmetryTemplate {
  return pick(rng, SYMMETRY_TEMPLATES)
}

/** Symétrie orthogonale par rapport à la verticale x = axisX. */
export function mirrorPoint(p: GridPt, axisX: number): GridPt {
  return { x: 2 * axisX - p.x, y: p.y }
}

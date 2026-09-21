import type { GridPoint, G7SymAxis } from "./g7-reproduce-data";

export const G7_AXES_GRID = 10;

export type SymmetryAxesTask = {
  id: string;
  label: string;
  /** Polygones remplis (coords 0…10). */
  polygons: GridPoint[][];
  /** Axes de symétrie attendus (peut être vide). */
  axes: G7SymAxis[];
};

export function axisKey(a: G7SymAxis): string {
  if (a.kind === "vertical") return `v:${a.x}`;
  if (a.kind === "horizontal") return `h:${a.y}`;
  if (a.kind === "diag_main") return `dm:${a.c}`;
  return `da:${a.c}`;
}

/** Construit un axe à partir de deux points distincts (H / V / 45° uniquement). */
export function axisFromPoints(a: GridPoint, b: GridPoint): G7SymAxis | null {
  if (a.x === b.x && a.y === b.y) return null;
  if (a.x === b.x) return { kind: "vertical", x: a.x };
  if (a.y === b.y) return { kind: "horizontal", y: a.y };
  if (b.y - a.y === b.x - a.x) return { kind: "diag_main", c: a.y - a.x };
  if (b.y - a.y === a.x - b.x) return { kind: "diag_anti", c: a.y + a.x };
  return null;
}

/** Segment d'affichage d'un axe sur toute la grille 0…size. */
export function axisSpan(axis: G7SymAxis, size: number = G7_AXES_GRID): { x1: number; y1: number; x2: number; y2: number } {
  if (axis.kind === "vertical") {
    return { x1: axis.x, y1: 0, x2: axis.x, y2: size };
  }
  if (axis.kind === "horizontal") {
    return { x1: 0, y1: axis.y, x2: size, y2: axis.y };
  }
  if (axis.kind === "diag_main") {
    // y = x + c
    const pts: GridPoint[] = [];
    for (let x = 0; x <= size; x++) {
      const y = x + axis.c;
      if (y >= 0 && y <= size) pts.push({ x, y });
    }
    const a = pts[0]!;
    const b = pts[pts.length - 1]!;
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  }
  // y = -x + c
  const pts: GridPoint[] = [];
  for (let x = 0; x <= size; x++) {
    const y = axis.c - x;
    if (y >= 0 && y <= size) pts.push({ x, y });
  }
  const a = pts[0]!;
  const b = pts[pts.length - 1]!;
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

function p(...pairs: Array<[number, number]>): GridPoint[] {
  return pairs.map(([x, y]) => ({ x, y }));
}

const V = (x: number): G7SymAxis => ({ kind: "vertical", x });
const H = (y: number): G7SymAxis => ({ kind: "horizontal", y });
const DM = (c: number): G7SymAxis => ({ kind: "diag_main", c });
const DA = (c: number): G7SymAxis => ({ kind: "diag_anti", c });

/** Pool de 30 figures — une seule tirée par refresh. */
const AXES_TASKS: SymmetryAxesTask[] = [
  {
    id: "tri-up",
    label: "Triangle isocèle",
    polygons: [p([3, 8], [7, 8], [5, 2])],
    axes: [V(5)],
  },
  {
    id: "rect",
    label: "Rectangle",
    polygons: [p([3, 2], [7, 2], [7, 8], [3, 8])],
    axes: [V(5), H(5)],
  },
  {
    id: "square",
    label: "Carré",
    polygons: [p([3, 3], [7, 3], [7, 7], [3, 7])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "kite-h",
    label: "Cerf-volant",
    polygons: [p([1, 5], [4, 2], [9, 5], [4, 8])],
    axes: [H(5)],
  },
  {
    id: "trap-iso",
    label: "Trapèze isocèle",
    polygons: [p([2, 3], [8, 3], [7, 7], [3, 7])],
    axes: [V(5)],
  },
  {
    id: "cross",
    label: "Croix",
    polygons: [
      p([2, 4], [8, 4], [8, 6], [2, 6]),
      p([4, 2], [6, 2], [6, 8], [4, 8]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "house",
    label: "Maison",
    polygons: [p([2, 5], [5, 2], [8, 5], [8, 9], [2, 9])],
    axes: [V(5)],
  },
  {
    id: "arrow-up",
    label: "Flèche haut",
    polygons: [p([5, 1], [8, 4], [6, 4], [6, 9], [4, 9], [4, 4], [2, 4])],
    axes: [V(5)],
  },
  {
    id: "arrow-right",
    label: "Flèche droite",
    polygons: [p([1, 4], [6, 4], [6, 2], [9, 5], [6, 8], [6, 6], [1, 6])],
    axes: [H(5)],
  },
  {
    id: "rhombus",
    label: "Losange",
    polygons: [p([5, 1], [8, 5], [5, 9], [2, 5])],
    axes: [V(5), H(5)],
  },
  {
    id: "diamond",
    label: "Carré tourné",
    polygons: [p([5, 1], [9, 5], [5, 9], [1, 5])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "tri-right-angle",
    label: "Triangle rectangle isocèle",
    polygons: [p([2, 2], [8, 2], [2, 8])],
    axes: [DM(0)],
  },
  {
    id: "chevron-v",
    label: "Chevron",
    polygons: [p([2, 2], [5, 5], [8, 2], [8, 4], [5, 7], [2, 4])],
    axes: [V(5)],
  },
  {
    id: "arrowhead-h",
    label: "Pointe de flèche",
    polygons: [p([1, 2], [6, 2], [8, 5], [6, 8], [1, 8], [3, 5])],
    axes: [H(5)],
  },
  {
    id: "tri-tall",
    label: "Triangle effilé",
    polygons: [p([4, 9], [6, 9], [5, 1])],
    axes: [V(5)],
  },
  {
    id: "tri-right",
    label: "Triangle à droite",
    polygons: [p([2, 2], [2, 8], [8, 5])],
    axes: [H(5)],
  },
  {
    id: "trap-wide",
    label: "Trapèze large",
    polygons: [p([1, 4], [9, 4], [7, 7], [3, 7])],
    axes: [V(5)],
  },
  {
    id: "hexagon",
    label: "Hexagone",
    polygons: [p([3, 2], [7, 2], [9, 5], [7, 8], [3, 8], [1, 5])],
    axes: [V(5), H(5)],
  },
  {
    id: "letter-h",
    label: "Lettre H",
    polygons: [
      p([2, 2], [4, 2], [4, 8], [2, 8]),
      p([6, 2], [8, 2], [8, 8], [6, 8]),
      p([4, 4], [6, 4], [6, 6], [4, 6]),
    ],
    axes: [V(5), H(5)],
  },
  {
    id: "letter-t",
    label: "Lettre T",
    polygons: [
      p([2, 2], [8, 2], [8, 4], [2, 4]),
      p([4, 4], [6, 4], [6, 9], [4, 9]),
    ],
    axes: [V(5)],
  },
  {
    id: "letter-u",
    label: "Lettre U",
    polygons: [
      p([2, 2], [4, 2], [4, 7], [6, 7], [6, 2], [8, 2], [8, 9], [2, 9]),
    ],
    axes: [V(5)],
  },
  {
    id: "letter-x",
    label: "Lettre X",
    polygons: [
      p([2, 2], [3, 2], [8, 7], [8, 8], [7, 8], [2, 3]),
      p([7, 2], [8, 2], [8, 3], [3, 8], [2, 8], [2, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "parallelogram",
    label: "Parallélogramme",
    polygons: [p([2, 3], [7, 3], [8, 7], [3, 7])],
    axes: [],
  },
  {
    id: "trap-none",
    label: "Trapèze quelconque",
    polygons: [p([2, 3], [8, 3], [9, 7], [2, 7])],
    axes: [],
  },
  {
    id: "l-shape",
    label: "Équerre L",
    polygons: [p([2, 2], [5, 2], [5, 6], [8, 6], [8, 8], [2, 8])],
    axes: [],
  },
  {
    id: "l-diag",
    label: "L diagonal",
    polygons: [p([2, 2], [7, 2], [7, 4], [4, 4], [4, 7], [2, 7])],
    axes: [DM(0)],
  },
  {
    id: "rhombus-wide",
    label: "Losange large",
    polygons: [p([1, 5], [5, 2], [9, 5], [5, 8])],
    axes: [V(5), H(5)],
  },
  {
    id: "hourglass",
    label: "Sablier",
    polygons: [
      p([2, 1], [8, 1], [5, 5]),
      p([2, 9], [8, 9], [5, 5]),
    ],
    axes: [V(5), H(5)],
  },
  {
    id: "tree",
    label: "Sapin",
    polygons: [
      p([2, 5], [8, 5], [5, 1]),
      p([4, 5], [6, 5], [6, 9], [4, 9]),
    ],
    axes: [V(5)],
  },
  {
    id: "plus-thin",
    label: "Plus",
    polygons: [
      p([4, 1], [6, 1], [6, 9], [4, 9]),
      p([1, 4], [9, 4], [9, 6], [1, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },

  // ── 20 figures supplémentaires (> 2 axes, ici 4) ─────────────────────────
  {
    id: "square-sm",
    label: "Petit carré",
    polygons: [p([4, 4], [6, 4], [6, 6], [4, 6])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "square-lg",
    label: "Grand carré",
    polygons: [p([2, 2], [8, 2], [8, 8], [2, 8])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "octagon",
    label: "Octogone",
    polygons: [p([3, 1], [7, 1], [9, 3], [9, 7], [7, 9], [3, 9], [1, 7], [1, 3])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "frame-sq",
    label: "Carré bordé",
    polygons: [
      p([2, 2], [8, 2], [8, 8], [2, 8]),
      p([3, 3], [7, 3], [7, 7], [3, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "diamond-sm",
    label: "Petit losange",
    polygons: [p([5, 3], [7, 5], [5, 7], [3, 5])],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "diamond-ring",
    label: "Double losange",
    polygons: [
      p([5, 1], [9, 5], [5, 9], [1, 5]),
      p([5, 3], [7, 5], [5, 7], [3, 5]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "cross-thick",
    label: "Croix épaisse",
    polygons: [
      p([1, 3], [9, 3], [9, 7], [1, 7]),
      p([3, 1], [7, 1], [7, 9], [3, 9]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "plus-wide",
    label: "Plus large",
    polygons: [
      p([3, 1], [7, 1], [7, 9], [3, 9]),
      p([1, 3], [9, 3], [9, 7], [1, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "star4",
    label: "Étoile 4 branches",
    polygons: [p(
      [5, 0], [6, 4], [10, 5], [6, 6], [5, 10], [4, 6], [0, 5], [4, 4],
    )],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "petals4",
    label: "4 pétales",
    polygons: [
      p([5, 1], [6, 3], [5, 4], [4, 3]),
      p([5, 6], [6, 7], [5, 9], [4, 7]),
      p([1, 5], [3, 4], [4, 5], [3, 6]),
      p([6, 5], [7, 4], [9, 5], [7, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "corners4",
    label: "4 coins",
    polygons: [
      p([1, 1], [3, 1], [3, 3], [1, 3]),
      p([7, 1], [9, 1], [9, 3], [7, 3]),
      p([1, 7], [3, 7], [3, 9], [1, 9]),
      p([7, 7], [9, 7], [9, 9], [7, 9]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "window4",
    label: "Fenêtre 4 carreaux",
    polygons: [
      p([2, 2], [8, 2], [8, 8], [2, 8]),
      p([4, 2], [6, 2], [6, 8], [4, 8]),
      p([2, 4], [8, 4], [8, 6], [2, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "target-sq",
    label: "Cible carrée",
    polygons: [
      p([1, 1], [9, 1], [9, 9], [1, 9]),
      p([2, 2], [8, 2], [8, 8], [2, 8]),
      p([4, 4], [6, 4], [6, 6], [4, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "x-thick",
    label: "X épais",
    polygons: [
      p([1, 1], [3, 1], [9, 7], [9, 9], [7, 9], [1, 3]),
      p([7, 1], [9, 1], [9, 3], [3, 9], [1, 9], [1, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "plus-center-sq",
    label: "Plus à centre",
    polygons: [
      p([4, 0], [6, 0], [6, 10], [4, 10]),
      p([0, 4], [10, 4], [10, 6], [0, 6]),
      p([3, 3], [7, 3], [7, 7], [3, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "diamond-cross",
    label: "Losange croisé",
    polygons: [
      p([5, 1], [9, 5], [5, 9], [1, 5]),
      p([4, 4], [6, 4], [6, 6], [4, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "ring-oct",
    label: "Anneau octogonal",
    polygons: [
      p([3, 1], [7, 1], [9, 3], [9, 7], [7, 9], [3, 9], [1, 7], [1, 3]),
      p([4, 2], [6, 2], [8, 4], [8, 6], [6, 8], [4, 8], [2, 6], [2, 4]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "spokes4",
    label: "4 rayons",
    polygons: [
      p([4, 4], [6, 4], [6, 6], [4, 6]),
      p([4, 0], [6, 0], [6, 3], [4, 3]),
      p([4, 7], [6, 7], [6, 10], [4, 10]),
      p([0, 4], [3, 4], [3, 6], [0, 6]),
      p([7, 4], [10, 4], [10, 6], [7, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "bowtie4",
    label: "Nœud 4 directions",
    polygons: [
      p([5, 2], [7, 4], [5, 5], [3, 4]),
      p([5, 5], [7, 6], [5, 8], [3, 6]),
      p([2, 5], [4, 3], [5, 5], [4, 7]),
      p([5, 5], [6, 3], [8, 5], [6, 7]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
  {
    id: "hash",
    label: "Grille #",
    polygons: [
      p([2, 2], [8, 2], [8, 3], [2, 3]),
      p([2, 7], [8, 7], [8, 8], [2, 8]),
      p([2, 2], [3, 2], [3, 8], [2, 8]),
      p([7, 2], [8, 2], [8, 8], [7, 8]),
      p([4, 4], [6, 4], [6, 6], [4, 6]),
    ],
    axes: [V(5), H(5), DM(0), DA(10)],
  },
];

if (AXES_TASKS.length !== 50) {
  throw new Error(`G7.2 axes pool: attendu 50, got ${AXES_TASKS.length}`);
}

export function pickSymmetryAxesTask(seed: number): SymmetryAxesTask {
  return AXES_TASKS[Math.abs(seed) % AXES_TASKS.length]!;
}

export function listSymmetryAxesTasks(): SymmetryAxesTask[] {
  return [...AXES_TASKS];
}

export function symmetryAxesConsigne(): string {
  return "Dessinez tous les axes de symétrie de la figure. Cliquez deux intersections pour tracer un axe (horizontal, vertical ou diagonale à 45°). Cliquez à nouveau les mêmes points pour l'effacer. Certaines figures n'ont aucun axe.";
}

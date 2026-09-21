/** Point de grille (intersection) — coordonnées entières 0…size. */
export type GridPoint = { x: number; y: number };

export type GridSegment = { x1: number; y1: number; x2: number; y2: number };

export type G7SymAxis =
  | { kind: "vertical"; x: number }
  | { kind: "horizontal"; y: number }
  /** Diagonale y − x = c (pente +1). */
  | { kind: "diag_main"; c: number }
  /** Diagonale y + x = c (pente −1). */
  | { kind: "diag_anti"; c: number };

export type GridFigure = {
  /** Nombre de cases par côté (intersections de 0 à size). */
  size: number;
  dots: GridPoint[];
  segments: GridSegment[];
};

export type ReproduceTaskKind = "copy" | "scale_up" | "scale_down";

export type ReproduceTask = {
  id: string;
  kind: ReproduceTaskKind;
  label: string;
  reference: GridFigure;
  /**
   * Taille de la grille de travail (cases).
   * Ex1 copie : 10 · Ex2 réduction : 5 · Ex3 agrandissement : 10.
   */
  targetSize: number;
  hintDots?: GridPoint[];
  hintSegments?: GridSegment[];
};

/** Grille pleine G7.1 : 10×10 cases → intersections 0…10. */
export const G7_GRID_SIZE = 10;
/** Demi-grille 5×5 (ex.2 cible ÷2, ex.3 modèle ×2). */
export const G7_HALF_SIZE = 5;

export function pointKey(p: GridPoint): string {
  return `${p.x},${p.y}`;
}

export function segmentKey(s: GridSegment): string {
  const a = `${s.x1},${s.y1}`;
  const b = `${s.x2},${s.y2}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function scalePoint(p: GridPoint, k: number): GridPoint {
  return { x: Math.round(p.x * k), y: Math.round(p.y * k) };
}

export function scaleSegment(s: GridSegment, k: number): GridSegment {
  const p1 = scalePoint({ x: s.x1, y: s.y1 }, k);
  const p2 = scalePoint({ x: s.x2, y: s.y2 }, k);
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
}

export function expectedFromTask(task: ReproduceTask): { dots: Set<string>; segments: Set<string> } {
  const { reference, kind } = task;
  const k = kind === "scale_up" ? 2 : kind === "scale_down" ? 0.5 : 1;
  return {
    dots: new Set(reference.dots.map((p) => pointKey(scalePoint(p, k)))),
    segments: new Set(reference.segments.map((s) => segmentKey(scaleSegment(s, k)))),
  };
}

function dedupeSegments(segments: GridSegment[]): GridSegment[] {
  const seen = new Set<string>();
  const out: GridSegment[] = [];
  for (const s of segments) {
    if (s.x1 === s.x2 && s.y1 === s.y2) continue;
    const k = segmentKey(s);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function dedupeDots(dots: GridPoint[]): GridPoint[] {
  const seen = new Set<string>();
  const out: GridPoint[] = [];
  for (const d of dots) {
    const k = pointKey(d);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(d);
  }
  return out;
}

function fig(segments: GridSegment[], dots: GridPoint[], size: number = G7_GRID_SIZE): GridFigure {
  const d = dedupeDots(dots);
  if (d.length === 0) throw new Error("Chaque figure doit contenir au moins un point");
  return { size, dots: d, segments: dedupeSegments(segments) };
}

function poly(pts: Array<[number, number]>): GridSegment[] {
  const segs: GridSegment[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[(i + 1) % pts.length]!;
    segs.push({ x1, y1, x2, y2 });
  }
  return segs;
}

function line(...pts: Array<[number, number]>): GridSegment[] {
  const segs: GridSegment[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[i + 1]!;
    segs.push({ x1, y1, x2, y2 });
  }
  return segs;
}

function rect(x: number, y: number, w: number, h: number): GridSegment[] {
  return poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
}

function assertBounds(id: string, figure: GridFigure, max: number, evenOnly: boolean) {
  if (figure.dots.length < 1) throw new Error(`${id}: aucun point`);
  const vals: number[] = [];
  for (const s of figure.segments) vals.push(s.x1, s.y1, s.x2, s.y2);
  for (const d of figure.dots) vals.push(d.x, d.y);
  const bad = vals.filter((v) => !Number.isInteger(v) || v < 0 || v > max || (evenOnly && v % 2 !== 0));
  if (bad.length) throw new Error(`${id}: coords invalides (${evenOnly ? "paires " : ""}0…${max}): ${bad.join(",")}`);
}

// ── Exercice 1 — 50 figures copie (grille 10×10, ≥1 point) ─────────────────

/** Pool copie 10×10 — aussi réutilisé par G7.5 (rotation). */
export const G7_COPY_FIGURES: Array<{ id: string; label: string; figure: GridFigure }> = [
  // Conservées / améliorées
  { id: "house", label: "Maison", figure: fig([...poly([[2, 5], [5, 2], [8, 5]]), ...rect(2, 5, 6, 4), ...rect(4, 7, 2, 2), ...rect(3, 6, 1, 1), ...rect(6, 6, 1, 1)], [{ x: 5, y: 6 }]) },
  // Fusée (modèle fourni)
  { id: "rocket", label: "Fusée", figure: fig([
    ...poly([[5, 0], [3, 2], [7, 2]]),
    ...rect(3, 2, 4, 5),
    ...poly([[5, 3], [6, 4], [5, 5], [4, 4]]),
    ...poly([[3, 4], [2, 5], [2, 6], [1, 7], [3, 7]]),
    ...poly([[7, 4], [8, 5], [8, 6], [9, 7], [7, 7]]),
  ], [{ x: 5, y: 4 }]) },
  { id: "cat", label: "Chat", figure: fig([...poly([[2, 4], [3, 1], [4, 4], [6, 4], [7, 1], [8, 4], [9, 6], [8, 9], [2, 9], [1, 6]]), ...line([4, 7], [5, 8], [6, 7]), ...line([3, 9], [3, 10]), ...line([7, 9], [7, 10])], [{ x: 3, y: 5 }, { x: 7, y: 5 }]) },
  { id: "fish", label: "Poisson", figure: fig([...poly([[1, 5], [4, 2], [7, 3], [9, 5], [7, 7], [4, 8]]), ...poly([[9, 5], [10, 3], [10, 7]]), ...line([4, 4], [5, 5], [4, 6])], [{ x: 3, y: 4 }]) },
  { id: "tree", label: "Arbre", figure: fig([...poly([[5, 1], [1, 4], [3, 4], [0, 7], [10, 7], [7, 4], [9, 4]]), ...rect(4, 7, 2, 2), ...line([3, 9], [7, 9])], [{ x: 5, y: 3 }]) },
  { id: "boat", label: "Bateau", figure: fig([...poly([[1, 7], [3, 9], [8, 9], [9, 7]]), ...line([5, 7], [5, 2]), ...poly([[5, 2], [8, 6], [5, 6]]), ...line([0, 10], [10, 10])], [{ x: 5, y: 4 }]) },
  { id: "flower", label: "Fleur", figure: fig([...poly([[5, 1], [4, 2], [5, 3], [6, 2]]), ...poly([[5, 3], [3, 2], [2, 4], [4, 4]]), ...poly([[5, 3], [7, 2], [8, 4], [6, 4]]), ...poly([[5, 3], [3, 5], [4, 7], [6, 7], [7, 5]]), ...line([5, 7], [5, 10]), ...line([5, 9], [2, 8]), ...line([5, 9], [8, 8])], [{ x: 5, y: 4 }]) },
  { id: "castle", label: "Château", figure: fig([...rect(1, 4, 8, 5), ...line([1, 4], [1, 2], [2, 2], [2, 4]), ...line([4, 4], [4, 1], [6, 1], [6, 4]), ...line([8, 4], [8, 2], [9, 2], [9, 4]), ...poly([[4, 1], [5, 0], [6, 1]]), ...rect(4, 7, 2, 2)], [{ x: 5, y: 5 }]) },
  { id: "umbrella", label: "Parapluie", figure: fig([...poly([[1, 4], [5, 1], [9, 4]]), ...line([1, 4], [9, 4]), ...line([3, 4], [3, 3]), ...line([5, 4], [5, 2]), ...line([7, 4], [7, 3]), ...line([5, 4], [5, 9], [7, 10])], [{ x: 5, y: 3 }]) },
  // Papillon (modèle fourni)
  { id: "butterfly", label: "Papillon", figure: fig([
    ...rect(5, 2, 1, 6),
    ...poly([[6, 2], [9, 1], [10, 3], [8, 5], [10, 7], [8, 9], [6, 8]]),
    ...poly([[5, 2], [2, 1], [1, 3], [3, 5], [1, 7], [3, 9], [5, 8]]),
    ...line([5, 2], [4, 1]),
    ...line([6, 2], [7, 1]),
  ], [{ x: 2, y: 3 }, { x: 8, y: 3 }]) },
  { id: "star", label: "Étoile", figure: fig(poly([[5, 0], [6, 3], [10, 3], [7, 5], [8, 9], [5, 7], [2, 9], [3, 5], [0, 3], [4, 3]]), [{ x: 5, y: 4 }]) },
  { id: "heart", label: "Cœur", figure: fig(poly([[5, 9], [1, 5], [1, 2], [3, 0], [5, 2], [7, 0], [9, 2], [9, 5]]), [{ x: 5, y: 4 }]) },
  { id: "crown", label: "Couronne", figure: fig([...poly([[1, 7], [1, 3], [3, 5], [5, 1], [7, 5], [9, 3], [9, 7]]), ...line([1, 7], [9, 7]), ...line([2, 7], [2, 8], [8, 8], [8, 7])], [{ x: 3, y: 4 }, { x: 5, y: 3 }, { x: 7, y: 4 }]) },
  { id: "anchor", label: "Ancre", figure: fig([...poly([[4, 0], [6, 0], [6, 2], [4, 2]]), ...line([5, 2], [5, 8]), ...line([1, 5], [9, 5]), ...poly([[1, 5], [0, 7], [2, 8], [3, 6]]), ...poly([[9, 5], [10, 7], [8, 8], [7, 6]]), ...line([4, 8], [6, 8])], [{ x: 5, y: 1 }]) },
  { id: "lamp", label: "Lampe", figure: fig([...poly([[3, 0], [7, 0], [8, 3], [2, 3]]), ...line([5, 3], [5, 7]), ...rect(3, 7, 4, 1), ...line([2, 8], [8, 8]), ...line([3, 1], [7, 1])], [{ x: 5, y: 2 }]) },
  { id: "ice-cream", label: "Glace", figure: fig([...poly([[3, 4], [5, 0], [7, 4]]), ...poly([[2, 4], [8, 4], [5, 10]]), ...line([3, 4], [4, 2], [6, 2], [7, 4])], [{ x: 4, y: 2 }, { x: 6, y: 2 }]) },
  { id: "guitar", label: "Guitare", figure: fig([...poly([[3, 4], [5, 3], [7, 4], [8, 7], [5, 10], [2, 7]]), ...line([5, 3], [5, 0]), ...line([4, 0], [6, 0]), ...line([4, 1], [6, 1]), ...rect(4, 5, 2, 2)], [{ x: 5, y: 6 }]) },
  { id: "mountain", label: "Montagnes", figure: fig([...poly([[0, 9], [3, 2], [6, 9]]), ...poly([[4, 9], [7, 1], [10, 9]]), ...line([0, 9], [10, 9]), ...line([3, 2], [4, 4], [2, 4], [3, 2]), ...line([7, 1], [8, 3], [6, 3], [7, 1])], [{ x: 5, y: 5 }]) },
  { id: "sun", label: "Soleil", figure: fig([...poly([[3, 3], [5, 2], [7, 3], [8, 5], [7, 7], [5, 8], [3, 7], [2, 5]]), ...line([5, 2], [5, 0]), ...line([5, 8], [5, 10]), ...line([2, 5], [0, 5]), ...line([8, 5], [10, 5]), ...line([3, 3], [1, 1]), ...line([7, 3], [9, 1]), ...line([3, 7], [1, 9]), ...line([7, 7], [9, 9])], [{ x: 5, y: 5 }]) },
  { id: "moon", label: "Lune", figure: fig([...poly([[6, 0], [3, 1], [1, 4], [1, 7], [3, 10], [6, 10], [4, 8], [3, 5], [4, 2], [6, 1]])], [{ x: 7, y: 2 }, { x: 8, y: 4 }, { x: 7, y: 6 }]) },
  { id: "cup", label: "Tasse", figure: fig([...poly([[2, 2], [7, 2], [6, 8], [3, 8]]), ...line([7, 3], [9, 3], [9, 6], [7, 6]), ...line([2, 9], [7, 9])], [{ x: 4, y: 4 }]) },
  // Bonnet (modèle fourni)
  { id: "hat", label: "Bonnet", figure: fig([
    ...poly([[5, 0], [6, 1], [5, 2], [4, 1]]),
    ...line([2, 5], [5, 2], [8, 5]),
    ...line([2, 5], [2, 7]),
    ...line([8, 5], [8, 7]),
    ...line([2, 6], [3, 5], [4, 6], [5, 5], [6, 6], [7, 5], [8, 6]),
    ...rect(1, 7, 8, 2),
    ...line([2, 7], [2, 9]), ...line([3, 7], [3, 9]), ...line([4, 7], [4, 9]),
    ...line([5, 7], [5, 9]), ...line([6, 7], [6, 9]), ...line([7, 7], [7, 9]), ...line([8, 7], [8, 9]),
  ], [{ x: 5, y: 1 }]) },
  { id: "leaf", label: "Feuille", figure: fig([...poly([[5, 0], [2, 2], [1, 5], [3, 8], [5, 10], [7, 8], [9, 5], [8, 2]]), ...line([5, 0], [5, 10]), ...line([5, 3], [2, 2]), ...line([5, 3], [8, 2]), ...line([5, 6], [1, 5]), ...line([5, 6], [9, 5])], [{ x: 5, y: 4 }]) },
  { id: "tent", label: "Tente", figure: fig([...poly([[0, 9], [5, 1], [10, 9]]), ...line([0, 9], [10, 9]), ...line([5, 1], [5, 9]), ...line([3, 9], [3, 6], [7, 6], [7, 9])], [{ x: 5, y: 4 }]) },
  { id: "windmill", label: "Moulin", figure: fig([...poly([[3, 5], [5, 3], [7, 5], [7, 10], [3, 10]]), ...line([5, 3], [5, 0]), ...line([5, 3], [1, 1]), ...line([5, 3], [9, 1]), ...line([5, 3], [2, 6]), ...line([5, 3], [8, 6]), ...rect(4, 7, 2, 3)], [{ x: 5, y: 3 }]) },
  { id: "apple", label: "Pomme", figure: fig([...poly([[5, 2], [2, 3], [1, 6], [2, 9], [5, 10], [8, 9], [9, 6], [8, 3]]), ...line([5, 2], [5, 0], [7, 1]), ...line([5, 2], [4, 1])], [{ x: 5, y: 5 }]) },
  { id: "kite", label: "Cerf-volant", figure: fig([...poly([[5, 0], [8, 4], [5, 8], [2, 4]]), ...line([5, 0], [5, 8]), ...line([2, 4], [8, 4]), ...line([5, 8], [4, 10], [6, 9], [5, 10])], [{ x: 5, y: 4 }]) },
  { id: "clock", label: "Horloge", figure: fig([...poly([[3, 1], [7, 1], [9, 3], [9, 7], [7, 9], [3, 9], [1, 7], [1, 3]]), ...line([5, 5], [5, 2]), ...line([5, 5], [7, 6]), ...line([5, 1], [5, 0]), ...line([5, 9], [5, 10]), ...line([1, 5], [0, 5]), ...line([9, 5], [10, 5])], [{ x: 5, y: 5 }]) },
  { id: "owl", label: "Hibou", figure: fig([...poly([[2, 3], [3, 0], [4, 2], [6, 2], [7, 0], [8, 3], [9, 6], [7, 10], [3, 10], [1, 6]]), ...poly([[3, 4], [4, 3], [5, 4], [4, 5]]), ...poly([[5, 4], [6, 3], [7, 4], [6, 5]]), ...line([4, 7], [5, 8], [6, 7])], [{ x: 4, y: 4 }, { x: 6, y: 4 }]) },
  { id: "lighthouse", label: "Phare", figure: fig([...poly([[3, 9], [4, 2], [6, 2], [7, 9]]), ...rect(3, 0, 4, 2), ...line([2, 9], [8, 9]), ...line([1, 10], [9, 10]), ...rect(4, 4, 2, 1), ...rect(4, 6, 2, 1)], [{ x: 5, y: 1 }]) },
  { id: "crab", label: "Crabe", figure: fig([...poly([[2, 4], [4, 2], [6, 2], [8, 4], [8, 7], [6, 8], [4, 8], [2, 7]]), ...line([2, 4], [0, 2]), ...line([2, 5], [0, 4]), ...line([8, 4], [10, 2]), ...line([8, 5], [10, 4]), ...line([3, 8], [2, 10]), ...line([4, 8], [4, 10]), ...line([6, 8], [6, 10]), ...line([7, 8], [8, 10])], [{ x: 4, y: 4 }, { x: 6, y: 4 }]) },
  { id: "present", label: "Cadeau", figure: fig([...rect(1, 3, 8, 6), ...line([5, 3], [5, 9]), ...line([1, 6], [9, 6]), ...poly([[3, 3], [4, 1], [5, 3], [6, 1], [7, 3]])], [{ x: 5, y: 5 }]) },

  // Modèles fournis (nouveaux)
  { id: "towers", label: "Tours", figure: fig([
    ...rect(2, 5, 2, 5),
    ...line([3, 5], [3, 4]),
    ...poly([[3, 4], [4, 3], [3, 2], [2, 3]]),
    ...rect(5, 3, 2, 7),
    ...line([6, 3], [6, 2]),
    ...poly([[6, 2], [7, 1], [6, 0], [5, 1]]),
  ], [{ x: 1, y: 3 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 8, y: 1 }]) },
  { id: "fir-tree", label: "Sapin", figure: fig([
    ...poly([[5, 0], [7, 2], [6, 2], [8, 4], [7, 4], [9, 7], [1, 7], [3, 4], [2, 4], [4, 2], [3, 2]]),
    ...rect(4, 7, 2, 3),
  ], [{ x: 5, y: 1 }, { x: 3, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 }]) },
  { id: "fox-head", label: "Renard", figure: fig([
    ...poly([[3, 2], [1, 0], [1, 5], [3, 8], [7, 8], [9, 5], [9, 0], [7, 2]]),
    ...line([3, 2], [7, 2]),
    ...poly([[3, 8], [5, 10], [7, 8]]),
    ...line([1, 3], [2, 2]),
    ...line([9, 3], [8, 2]),
  ], [{ x: 3, y: 5 }, { x: 7, y: 5 }]) },

  // Compléments (mieux dessinés)
  { id: "sailboat", label: "Voilier", figure: fig([
    ...poly([[1, 8], [3, 10], [8, 10], [9, 8]]),
    ...line([5, 8], [5, 1]),
    ...poly([[5, 1], [8, 7], [5, 7]]),
    ...poly([[5, 3], [2, 7], [5, 7]]),
    ...line([0, 10], [10, 10]),
  ], [{ x: 5, y: 4 }]) },
  { id: "cactus", label: "Cactus", figure: fig([
    ...rect(4, 2, 2, 8),
    ...line([4, 4], [1, 4], [1, 7], [2, 7], [2, 5], [4, 5]),
    ...line([6, 5], [9, 5], [9, 8], [8, 8], [8, 6], [6, 6]),
    ...line([3, 10], [7, 10]),
  ], [{ x: 5, y: 3 }]) },
  { id: "snowman", label: "Bonhomme de neige", figure: fig([
    ...poly([[3, 6], [5, 5], [7, 6], [7, 9], [5, 10], [3, 9]]),
    ...poly([[4, 2], [5, 1], [6, 2], [6, 5], [5, 6], [4, 5]]),
    ...rect(3, 0, 4, 1),
    ...line([3, 1], [3, 2], [7, 2], [7, 1]),
    ...line([2, 7], [0, 6]),
    ...line([8, 7], [10, 6]),
  ], [{ x: 4, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 4 }]) },
  { id: "bell", label: "Cloche", figure: fig([
    ...poly([[3, 3], [5, 1], [7, 3], [8, 7], [2, 7]]),
    ...line([2, 7], [8, 7]),
    ...line([5, 1], [5, 0]),
    ...rect(4, 0, 2, 1),
    ...line([5, 7], [5, 9]),
    ...poly([[4, 9], [5, 10], [6, 9]]),
  ], [{ x: 5, y: 5 }]) },
  { id: "pencil", label: "Crayon", figure: fig([
    ...poly([[3, 1], [7, 1], [7, 8], [5, 10], [3, 8]]),
    ...line([3, 3], [7, 3]),
    ...line([3, 8], [7, 8]),
    ...line([5, 8], [5, 10]),
    ...rect(4, 4, 2, 2),
  ], [{ x: 5, y: 2 }]) },
  { id: "book", label: "Livre", figure: fig([
    ...poly([[1, 2], [5, 3], [9, 2], [9, 9], [5, 10], [1, 9]]),
    ...line([5, 3], [5, 10]),
    ...line([1, 4], [5, 5]),
    ...line([5, 5], [9, 4]),
    ...line([1, 6], [5, 7]),
    ...line([5, 7], [9, 6]),
  ], [{ x: 5, y: 6 }]) },
  { id: "shield", label: "Bouclier", figure: fig([
    ...poly([[2, 1], [8, 1], [9, 4], [5, 10], [1, 4]]),
    ...line([5, 1], [5, 10]),
    ...line([2, 1], [5, 4], [8, 1]),
    ...poly([[4, 3], [5, 2], [6, 3], [5, 4]]),
  ], [{ x: 5, y: 6 }]) },
  { id: "mushroom2", label: "Champignon", figure: fig([
    ...poly([[1, 5], [3, 2], [5, 1], [7, 2], [9, 5]]),
    ...line([1, 5], [9, 5]),
    ...rect(4, 5, 2, 4),
    ...line([3, 9], [7, 9]),
  ], [{ x: 3, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 4 }]) },
  { id: "house2", label: "Chalet", figure: fig([
    ...poly([[1, 5], [5, 1], [9, 5]]),
    ...rect(1, 5, 8, 4),
    ...rect(4, 7, 2, 2),
    ...rect(2, 6, 1, 1),
    ...rect(7, 6, 1, 1),
    ...line([5, 1], [5, 5]),
  ], [{ x: 5, y: 3 }]) },

  // Nouveaux modèles (remplacent palm / submarine / helicopter / igloo / bird2 / key2)
  { id: "corn", label: "Épi", figure: fig([
    ...poly([[4, 0], [6, 0], [7, 1], [7, 7], [3, 7], [3, 1]]),
    ...line([4, 1], [6, 1]),
    ...line([3, 2], [7, 2]), ...line([3, 3], [7, 3]), ...line([3, 4], [7, 4]),
    ...line([3, 5], [7, 5]), ...line([3, 6], [7, 6]),
    ...line([4, 1], [4, 7]), ...line([5, 0], [5, 7]), ...line([6, 1], [6, 7]),
    ...line([3, 7], [5, 10], [7, 7]),
    ...line([3, 5], [1, 5], [1, 3], [3, 2]),
    ...line([7, 5], [9, 5], [9, 3], [7, 2]),
    ...line([1, 5], [3, 7]),
    ...line([9, 5], [7, 7]),
  ], [{ x: 5, y: 3 }]) },
  { id: "cherries", label: "Cerises", figure: fig([
    ...poly([[1, 5], [2, 4], [4, 4], [5, 5], [5, 7], [4, 8], [2, 8], [1, 7]]),
    ...poly([[5, 3], [6, 2], [8, 2], [9, 3], [9, 5], [8, 6], [6, 6], [5, 5]]),
    ...line([3, 4], [5, 1]),
    ...line([7, 2], [5, 1]),
    ...poly([[5, 1], [3, 0], [3, 2]]),
    ...line([5, 1], [2, 1]),
  ], [{ x: 3, y: 6 }, { x: 7, y: 4 }]) },
  { id: "fish-geo", label: "Poisson angulaire", figure: fig([
    ...poly([[3, 4], [3, 2], [6, 5], [7, 5], [7, 7], [6, 7], [4, 6]]),
    ...poly([[6, 7], [7, 7], [7, 8], [6, 9], [5, 8]]),
    ...poly([[3, 2], [3, 0], [4, 0], [4, 1], [5, 1]]),
    ...poly([[3, 4], [2, 3], [3, 3]]),
    ...poly([[5, 4], [5, 2], [6, 4]]),
    ...poly([[4, 6], [4, 7], [5, 6]]),
    ...line([3, 2], [6, 5]),
    ...line([3, 3], [4, 4]),
    ...line([4, 4], [6, 5]),
    ...line([4, 4], [4, 6]),
  ], [{ x: 6, y: 8 }]) },
  { id: "vase", label: "Vase", figure: fig([
    ...line([3, 9], [5, 9]),
    ...line([3, 9], [2, 8]),
    ...line([5, 9], [6, 8]),
    ...line([2, 8], [6, 8]),
    ...rect(2, 7, 4, 1),
    ...line([2, 8], [3, 7]),
    ...line([3, 7], [4, 8]),
    ...line([4, 8], [5, 7]),
    ...line([5, 7], [6, 8]),
    ...line([2, 7], [3, 6]),
    ...line([6, 7], [5, 6]),
    ...line([3, 6], [2, 5]),
    ...line([5, 6], [6, 5]),
    ...line([2, 5], [6, 5]),
  ], [{ x: 4, y: 6 }]) },
  { id: "snowflake", label: "Flocon", figure: fig([
    ...rect(4, 4, 2, 2),
    ...line([4, 4], [6, 6]),
    ...line([6, 4], [4, 6]),
    ...poly([[6, 4], [6, 3], [7, 3], [7, 4]]),
    ...line([6, 4], [7, 3]),
    ...poly([[6, 6], [7, 6], [7, 7], [6, 7]]),
    ...line([6, 6], [7, 7]),
    ...poly([[4, 6], [4, 7], [3, 7], [3, 6]]),
    ...line([4, 6], [3, 7]),
    ...poly([[4, 4], [3, 4], [3, 3], [4, 3]]),
    ...line([4, 4], [3, 3]),
    ...line([4, 4], [5, 2], [6, 4]),
    ...line([6, 4], [8, 5], [6, 6]),
    ...line([6, 6], [5, 8], [4, 6]),
    ...line([4, 6], [2, 5], [4, 4]),
  ], [{ x: 5, y: 5 }]) },
  { id: "compass", label: "Rose des vents", figure: fig([
    ...rect(4, 4, 2, 2),
    ...poly([[4, 4], [2, 2], [4, 3], [3, 4]]),
    ...poly([[6, 4], [8, 2], [7, 4], [6, 3]]),
    ...poly([[6, 6], [8, 8], [6, 7], [7, 6]]),
    ...poly([[4, 6], [2, 8], [3, 6], [4, 7]]),
    ...poly([[4, 3], [6, 3], [7, 4], [7, 6], [6, 7], [4, 7], [3, 6], [3, 4]]),
    ...poly([[4, 2], [6, 2], [8, 4], [8, 6], [6, 8], [4, 8], [2, 6], [2, 4]]),
  ], [{ x: 5, y: 5 }]) },
  { id: "weave", label: "Entrelacs", figure: fig([
    ...rect(3, 3, 4, 4),
    ...rect(4, 2, 2, 2),
    ...rect(4, 6, 2, 2),
    ...rect(2, 4, 2, 2),
    ...rect(6, 4, 2, 2),
    ...line([3, 3], [5, 5]), ...line([5, 3], [3, 5]),
    ...line([5, 3], [7, 5]), ...line([7, 3], [5, 5]),
    ...line([3, 5], [5, 7]), ...line([5, 5], [3, 7]),
    ...line([5, 5], [7, 7]), ...line([7, 5], [5, 7]),
    ...line([4, 4], [6, 6]), ...line([6, 4], [4, 6]),
    ...line([5, 2], [5, 8]), ...line([2, 5], [8, 5]),
  ], [{ x: 5, y: 5 }]) },
  { id: "swan", label: "Cygne", figure: fig([
    ...poly([
      [3, 7], [3, 2], [1, 2], [3, 1], [4, 2], [4, 6],
      [5, 5], [7, 5], [8, 6], [9, 5], [9, 6], [10, 6],
      [8, 8], [4, 8],
    ]),
    ...line([5, 7], [6, 7], [8, 7]),
  ], [{ x: 3, y: 2 }]) },
  { id: "rabbit", label: "Lapin", figure: fig([
    ...line([1, 9], [7, 9]),
    ...line([7, 9], [8, 8]),
    ...rect(8, 7, 1, 1),
    ...line([8, 7], [6, 5]),
    ...line([6, 5], [5, 5]),
    ...line([5, 5], [6, 3], [5, 3], [4, 4]),
    ...line([4, 4], [5, 2], [4, 2], [3, 3]),
    ...line([3, 3], [2, 3], [1, 4], [1, 5], [2, 5]),
    ...line([2, 5], [2, 8], [4, 8]),
    ...line([2, 8], [1, 9]),
    ...line([2, 7], [3, 8]),
    ...line([2, 5], [0, 5]),
    ...line([2, 5], [0, 6]),
  ], [{ x: 2, y: 4 }]) },
  { id: "duck", label: "Canard", figure: fig([
    ...poly([
      [1, 3], [3, 1], [4, 1], [5, 2], [4, 5], [8, 5],
      [9, 4], [9, 6], [6, 9], [4, 9], [2, 8], [2, 5], [3, 4],
    ]),
    ...line([2, 3], [2, 4]),
    ...line([4, 6], [5, 7], [6, 8]),
  ], [{ x: 3, y: 2 }]) },
  { id: "plant", label: "Plante", figure: fig([
    ...poly([[4, 10], [3, 9], [3, 8], [4, 8], [5, 9], [6, 8], [6, 9], [5, 10]]),
    ...line([5, 9], [5, 7]),
    ...poly([[5, 7], [3, 6], [2, 6], [1, 7], [2, 7], [3, 7]]),
    ...poly([[5, 7], [7, 6], [8, 6], [9, 7], [8, 7], [7, 7]]),
    ...line([5, 7], [2, 7]),
    ...line([5, 7], [8, 7]),
    ...line([5, 7], [5, 4]),
    ...poly([[5, 4], [3, 3], [3, 2], [4, 1], [6, 1], [7, 2], [7, 3]]),
    ...line([5, 4], [5, 2]),
    ...line([3, 2], [5, 3], [7, 2]),
  ], [{ x: 5, y: 2 }]) },
  { id: "tangram", label: "Tangram", figure: fig([
    ...rect(0, 4, 1, 1),
    ...poly([[1, 5], [3, 5], [2, 6]]),
    ...poly([[2, 5], [4, 5], [4, 3]]),
    ...poly([[4, 3], [5, 3], [4, 2]]),
    ...poly([[4, 3], [6, 2], [5, 3]]),
    ...rect(6, 2, 1, 1),
    ...poly([[6, 3], [8, 3], [7, 4], [6, 4]]),
    ...poly([[7, 4], [9, 4], [8, 5], [7, 5]]),
    ...poly([[8, 4], [10, 4], [10, 5]]),
    ...line([3, 5], [4, 5], [4, 4]),
    ...line([5, 3], [6, 3], [6, 4]),
  ], [{ x: 4, y: 4 }]) },
  // Chien (nez carré + œil triangle)
  { id: "dog", label: "Chien", figure: fig([
    ...poly([
      [0, 5], [1, 5], [4, 1], [4, 3], [5, 4], [8, 4], [8, 0], [9, 0], [10, 1], [9, 2],
      [9, 6], [8, 7], [8, 10], [6, 10], [6, 9], [7, 9], [7, 7], [4, 7], [4, 10], [2, 10],
      [2, 9], [3, 9], [3, 7], [2, 6], [1, 6], [0, 6],
    ]),
    ...line([1, 5], [1, 6]),
    ...poly([[2, 5], [3, 5], [2, 4]]),
  ], [{ x: 2, y: 5 }, { x: 0, y: 5 }]) },
  // Poussin pixel (profil droit + bec + œil)
  { id: "chick-pixel", label: "Poussin", figure: fig([
    ...poly([
      [1, 8], [1, 5], [2, 5], [2, 4], [4, 4], [4, 3], [5, 3], [5, 2], [6, 2], [6, 1],
      [7, 1], [7, 2], [8, 2], [8, 3], [9, 3], [9, 4], [9, 5], [8, 5], [8, 6], [7, 6],
      [7, 8], [6, 8], [6, 7], [4, 7], [4, 9], [5, 9], [5, 10], [3, 10], [3, 8],
    ]),
    ...line([9, 4], [10, 3]),
    ...line([9, 4], [10, 5]),
    ...rect(6, 3, 1, 1),
  ], [{ x: 6, y: 4 }, { x: 9, y: 4 }]) },
];

// assertBounds + COPY_TASKS + SCALE_DOWN : après figures ×2 issues de l'ex.3 (voir plus bas)

// ── Seed figures 5×5 (injectées en ×2 dans l'ex.1 ; base des ex.2 / ex.3) ──

function sfig(segments: GridSegment[], dots: GridPoint[]): GridFigure {
  return fig(segments, dots, G7_HALF_SIZE);
}

const SCALE_UP_FIGURES: Array<{ id: string; label: string; figure: GridFigure }> = [
  // Poussin — corps + bec + pattes (œil = point)
  { id: "chick", label: "Poussin", figure: sfig([
    ...poly([[2, 1], [2, 2], [3, 3], [4, 3], [5, 2], [4, 2], [3, 1]]),
    ...poly([[1, 2], [2, 1], [2, 2]]),
    ...line([3, 3], [2, 4], [1, 4]),
    ...line([4, 3], [5, 4]),
  ], [{ x: 2, y: 1 }]) },

  // Aile-feuille (demi-cases arrondies à l'entier)
  { id: "leaf-wing", label: "Aile-feuille", figure: sfig([
    ...poly([[0, 2], [1, 2], [1, 0], [3, 2], [3, 3], [1, 3]]),
    ...poly([[3, 3], [4, 3], [4, 2]]),
    ...poly([[3, 4], [4, 4], [4, 3]]),
    ...line([3, 3], [4, 4]),
    ...line([4, 3], [3, 4]),
    ...poly([[2, 4], [3, 4], [3, 3]]),
  ], [{ x: 3, y: 3 }]) },

  // Moulinet / girouette (centre + tige + 4 pales)
  { id: "pinwheel", label: "Moulinet", figure: sfig([
    ...rect(1, 1, 2, 2),
    ...line([0, 2], [4, 2]),
    ...line([2, 0], [2, 5]),
    ...line([1, 1], [2, 0]),
    ...line([1, 1], [2, 2]),
    ...line([3, 1], [4, 2]),
    ...line([3, 1], [2, 2]),
    ...line([3, 3], [2, 4]),
    ...line([3, 3], [2, 2]),
    ...line([1, 3], [0, 2]),
    ...line([1, 3], [2, 2]),
    ...poly([[1, 1], [2, 1], [2, 0]]),
    ...poly([[3, 1], [3, 2], [4, 2]]),
    ...poly([[3, 3], [2, 3], [2, 4]]),
    ...poly([[1, 3], [1, 2], [0, 2]]),
  ], [{ x: 2, y: 2 }]) },

  // Tulipe symétrique (tige, feuilles, pétales, tête en W)
  { id: "tulip", label: "Tulipe", figure: sfig([
    ...line([2, 4], [2, 3]),
    ...poly([[2, 4], [1, 3], [1, 2], [2, 3]]),
    ...poly([[2, 4], [3, 3], [3, 2], [2, 3]]),
    ...poly([[2, 3], [0, 2], [1, 2]]),
    ...poly([[2, 3], [4, 2], [3, 2]]),
    ...poly([[2, 3], [1, 2], [1, 1], [3, 1], [3, 2]]),
    ...line([1, 1], [2, 2], [2, 1], [2, 2], [3, 1]),
  ], [{ x: 2, y: 2 }]) },

  // Oiseau à crête (bec à gauche, ailes en pente, pattes en L)
  { id: "crest-bird", label: "Oiseau", figure: sfig([
    ...line([2, 0], [2, 3]),
    ...line([3, 0], [3, 3]),
    ...line([2, 2], [3, 2]),
    ...line([2, 0], [3, 1], [3, 0]),
    ...poly([[1, 2], [2, 1], [2, 2]]),
    ...line([3, 1], [5, 3]),
    ...line([3, 2], [4, 3]),
    ...line([2, 3], [5, 3]),
    ...line([3, 3], [3, 4], [4, 4]),
    ...line([4, 3], [4, 4], [5, 4]),
  ], [{ x: 2, y: 1 }]) },

  // Étoile à 6 losanges
  { id: "star6", label: "Étoile 6", figure: sfig([
    ...poly([[2, 0], [3, 1], [4, 1], [3, 2], [4, 3], [3, 3], [2, 4], [1, 3], [0, 3], [1, 2], [0, 1], [1, 1]]),
    ...line([2, 2], [2, 0]),
    ...line([2, 2], [4, 1]),
    ...line([2, 2], [4, 3]),
    ...line([2, 2], [2, 4]),
    ...line([2, 2], [0, 3]),
    ...line([2, 2], [0, 1]),
    ...line([2, 2], [1, 1]),
    ...line([2, 2], [3, 1]),
    ...line([2, 2], [3, 2]),
    ...line([2, 2], [3, 3]),
    ...line([2, 2], [1, 3]),
    ...line([2, 2], [1, 2]),
  ], [{ x: 2, y: 2 }]) },

  // Tangram (assemblage polygones)
  { id: "tangram-up", label: "Tangram", figure: sfig([
    ...rect(1, 0, 1, 1),
    ...poly([[2, 0], [3, 0], [2, 1]]),
    ...poly([[1, 1], [2, 1], [1, 2]]),
    ...poly([[2, 1], [3, 1], [3, 2]]),
    ...poly([[3, 1], [4, 0], [4, 1], [3, 2]]),
    ...poly([[2, 2], [3, 2], [2, 3], [1, 3]]),
  ], [{ x: 2, y: 1 }]) },

  // Poisson (queue à gauche, tête à droite)
  { id: "fish-up", label: "Poisson", figure: sfig([
    ...poly([[0, 2], [0, 4], [1, 3]]),
    ...poly([[1, 3], [2, 2], [3, 2], [4, 3], [3, 4], [2, 4]]),
    ...line([2, 3], [3, 2]),
    ...line([2, 3], [3, 4]),
  ], [{ x: 3, y: 3 }]) },

  // Bateau (coque trapèze + voile + cabine)
  { id: "boat-up", label: "Bateau", figure: sfig([
    ...poly([[0, 4], [1, 5], [3, 5], [4, 4]]),
    ...line([2, 4], [2, 2]),
    ...poly([[1, 4], [2, 2], [2, 4]]),
    ...rect(2, 3, 1, 1),
    ...line([2, 3], [3, 4]),
  ], [{ x: 2, y: 3 }]) },

  // Tulipe haute (compressée sur 5×5)
  { id: "tulip-tall", label: "Tulipe haute", figure: sfig([
    ...line([2, 5], [2, 2]),
    ...poly([[2, 5], [3, 5], [4, 4], [4, 3], [3, 3], [2, 4]]),
    ...poly([[2, 3], [1, 3], [0, 2], [0, 1], [1, 1], [2, 2]]),
    ...poly([[2, 2], [1, 2], [0, 1], [1, 0], [2, 0], [3, 0], [4, 1], [3, 2]]),
    ...line([2, 0], [2, 1], [3, 1], [3, 2]),
  ], [{ x: 2, y: 1 }]) },

  // Plante à trois feuilles
  { id: "triple-leaf", label: "Plante", figure: sfig([
    ...line([2, 5], [2, 2]),
    ...line([2, 4], [1, 3]),
    ...line([2, 4], [3, 3]),
    ...poly([[2, 2], [1, 1], [1, 0], [2, 0], [3, 0], [3, 1]]),
    ...line([2, 2], [2, 1]),
    ...poly([[1, 3], [0, 3], [0, 2], [0, 1], [1, 1], [1, 2]]),
    ...line([1, 3], [0, 2]),
    ...poly([[3, 3], [4, 3], [5, 2], [5, 1], [4, 1], [3, 2]]),
    ...line([3, 3], [4, 2]),
  ], [{ x: 2, y: 1 }]) },

  // Cube en perspective cavalière
  { id: "cube", label: "Cube", figure: sfig([
    ...rect(2, 2, 2, 2),
    ...line([2, 2], [1, 1]),
    ...line([4, 2], [3, 1]),
    ...line([2, 4], [1, 3]),
    ...line([1, 1], [3, 1]),
    ...line([1, 1], [1, 3]),
  ], [{ x: 3, y: 3 }]) },

  // Carré → losange → carré intérieur
  { id: "nested-sq", label: "Carrés emboîtés", figure: sfig([
    ...rect(0, 0, 4, 4),
    ...poly([[2, 0], [4, 2], [2, 4], [0, 2]]),
    ...rect(1, 1, 2, 2),
  ], [{ x: 2, y: 2 }]) },

  // Coccinelle (corps octogonal, antennes, points)
  { id: "ladybug", label: "Coccinelle", figure: sfig([
    ...poly([[1, 4], [0, 3], [0, 2], [1, 1], [3, 1], [4, 2], [4, 3], [3, 4]]),
    ...line([2, 1], [2, 4]),
    ...line([1, 1], [0, 0]),
    ...line([3, 1], [4, 0]),
    ...line([1, 0], [2, 1], [3, 0]),
  ], [
    { x: 1, y: 2 }, { x: 3, y: 2 },
    { x: 1, y: 3 }, { x: 3, y: 3 },
    { x: 0, y: 2 }, { x: 4, y: 2 },
    { x: 0, y: 0 }, { x: 4, y: 0 },
  ]) },

  // Tour « M » (deux étages + base en M)
  { id: "tower-m", label: "Tour M", figure: sfig([
    ...rect(1, 1, 2, 2),
    ...line([1, 2], [3, 2]),
    ...line([1, 3], [1, 4]),
    ...line([3, 3], [3, 4]),
    ...line([1, 4], [2, 3], [3, 4]),
  ], [{ x: 2, y: 2 }]) },

  // Tour « V » (base + deux chevrons)
  { id: "tower-v", label: "Tour V", figure: sfig([
    ...line([1, 1], [1, 4]),
    ...line([3, 1], [3, 4]),
    ...line([1, 4], [3, 4]),
    ...line([1, 3], [3, 3]),
    ...line([1, 2], [2, 3], [3, 2]),
    ...line([1, 1], [2, 2], [3, 1]),
  ], [{ x: 2, y: 3 }]) },

  // Maison (corps, porte, toit trapèze)
  { id: "house-trap", label: "Maison", figure: sfig([
    ...rect(1, 2, 2, 2),
    ...line([2, 3], [2, 4]),
    ...poly([[0, 2], [4, 2], [3, 0], [1, 0]]),
  ], [{ x: 2, y: 3 }]) },
];

for (const { id, figure } of SCALE_UP_FIGURES) assertBounds(id, figure, G7_HALF_SIZE, false);

/** Agrandit une figure 5×5 → 10×10 (coords ×2) pour le pool copie ex.1. */
function scaleFigureUp(figure: GridFigure, k: number = 2): GridFigure {
  return fig(
    figure.segments.map((s) => scaleSegment(s, k)),
    figure.dots.map((p) => scalePoint(p, k)),
    figure.size * k,
  );
}

/** Réduit une figure 10×10 (coords paires) → modèle 5×5 pour l'ex.3. */
function scaleFigureDown(figure: GridFigure, k: number = 0.5): GridFigure {
  return fig(
    figure.segments.map((s) => scaleSegment(s, k)),
    figure.dots.map((p) => scalePoint(p, k)),
    Math.round(figure.size * k),
  );
}

// Ex.1 : injecter les figures seed agrandies ×2 dans le pool copie
for (const { id, label, figure } of SCALE_UP_FIGURES) {
  G7_COPY_FIGURES.push({
    id: `x2-${id}`,
    label,
    figure: scaleFigureUp(figure, 2),
  });
}

for (const { id, figure } of G7_COPY_FIGURES) assertBounds(id, figure, G7_GRID_SIZE, false);

const COPY_TASKS: ReproduceTask[] = G7_COPY_FIGURES.map(({ id, label, figure }) => ({
  id: `copy-${id}`,
  kind: "copy" as const,
  label,
  reference: figure,
  targetSize: G7_GRID_SIZE,
}));

/** True si toutes les coords sont entières paires 0…10 → réductible ÷2 vers grille 5×5. */
function canScaleDown(figure: GridFigure): boolean {
  const vals: number[] = [];
  for (const s of figure.segments) vals.push(s.x1, s.y1, s.x2, s.y2);
  for (const d of figure.dots) vals.push(d.x, d.y);
  return vals.every((v) => Number.isInteger(v) && v >= 0 && v <= G7_GRID_SIZE && v % 2 === 0);
}

const REDUCIBLE_COPY_FIGURES = G7_COPY_FIGURES.filter(({ figure }) => canScaleDown(figure));

// ── Exercice 2 — réduction ÷2 : modèle 10×10 → grille 5×5 ─────────────────

const SCALE_DOWN_TASKS: ReproduceTask[] = REDUCIBLE_COPY_FIGURES.map(({ id, label, figure }) => ({
  id: `scale-down-${id}`,
  kind: "scale_down" as const,
  label,
  reference: figure,
  targetSize: G7_HALF_SIZE,
}));

for (const task of SCALE_DOWN_TASKS) assertBounds(task.id, task.reference, G7_GRID_SIZE, true);

// ── Exercice 3 — agrandissement ×2 : mêmes figures, modèle 5×5 → 10×10 ────

const SCALE_UP_TASKS: ReproduceTask[] = REDUCIBLE_COPY_FIGURES.map(({ id, label, figure }) => ({
  id: `scale-up-${id}`,
  kind: "scale_up" as const,
  label,
  reference: scaleFigureDown(figure, 0.5),
  targetSize: G7_GRID_SIZE,
}));

for (const task of SCALE_UP_TASKS) assertBounds(task.id, task.reference, G7_HALF_SIZE, false);

export function pickReproduceTask(variant: 1 | 2 | 3, seed: number): ReproduceTask {
  const pool = variant === 1 ? COPY_TASKS : variant === 2 ? SCALE_DOWN_TASKS : SCALE_UP_TASKS;
  if (pool.length === 0) {
    throw new Error(`G7.1 variant ${variant}: aucune figure dans le pool`);
  }
  return pool[Math.abs(seed) % pool.length]!;
}

/** Liste stable des tâches d'un pool (pour audit / aperçu). */
export function listReproduceTasks(variant: 1 | 2 | 3): ReproduceTask[] {
  return variant === 1 ? [...COPY_TASKS] : variant === 2 ? [...SCALE_DOWN_TASKS] : [...SCALE_UP_TASKS];
}

export function taskConsigne(task: ReproduceTask): string {
  if (task.kind === "copy") {
    return "Reproduisez la figure à l'identique sur le quadrillage de droite. Cliquez deux points pour tracer un segment ; cliquez deux fois le même point pour placer un point.";
  }
  if (task.kind === "scale_up") {
    return "Le modèle est sur une grille 5×5. Reproduisez la figure en plus grand (×2) sur la grille 10×10 de droite.";
  }
  return "Reproduisez la figure en plus petit (rapport 2:1) sur la grille 5×5 de droite.";
}

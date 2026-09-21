/**
 * G7.3 — Symétrie centrale.
 * Figures de G7.1 ex.1 ; centre O toujours au milieu de la grille (10,10).
 * Le point d'exemple est un sommet de la figure ; le trait passe par O jusqu'à l'image.
 */
import type { GridFigure, GridPoint, GridSegment } from "./g7-reproduce-data";
import { G7_COPY_FIGURES, pointKey, segmentKey } from "./g7-reproduce-data";

export const G7_CENTRAL_WIDTH = 20;
export const G7_CENTRAL_HEIGHT = 20;
/** Centre de rotation / symétrie centrale — toujours au milieu de la grille. */
export const G7_CENTRAL_ORIGIN: GridPoint = { x: 10, y: 10 };

export type CentralSymmetryTask = {
  id: string;
  label: string;
  width: number;
  height: number;
  origin: GridPoint;
  sourceSegments: GridSegment[];
  sourceDots: GridPoint[];
  examplePoint: GridPoint;
};

export function centralPoint(p: GridPoint, origin: GridPoint = G7_CENTRAL_ORIGIN): GridPoint {
  return { x: 2 * origin.x - p.x, y: 2 * origin.y - p.y };
}

export function centralSegment(s: GridSegment, origin: GridPoint = G7_CENTRAL_ORIGIN): GridSegment {
  const a = centralPoint({ x: s.x1, y: s.y1 }, origin);
  const b = centralPoint({ x: s.x2, y: s.y2 }, origin);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

/** Côté source : au-dessus de O, ou sur y=10 à gauche de O. */
export function isSourceSide(p: GridPoint, origin: GridPoint = G7_CENTRAL_ORIGIN): boolean {
  if (p.x === origin.x && p.y === origin.y) return false;
  if (p.y < origin.y) return true;
  if (p.y > origin.y) return false;
  return p.x < origin.x;
}

export function isDrawSideCentral(p: GridPoint, origin: GridPoint = G7_CENTRAL_ORIGIN): boolean {
  if (p.x === origin.x && p.y === origin.y) return false;
  return !isSourceSide(p, origin);
}

export function expectedCentral(task: CentralSymmetryTask): {
  dots: Set<string>;
  segments: Set<string>;
} {
  const origin = task.origin;
  const exampleImg = pointKey(centralPoint(task.examplePoint, origin));
  const dots = new Set(
    task.sourceDots
      .map((p) => pointKey(centralPoint(p, origin)))
      .filter((k) => k !== exampleImg),
  );
  return {
    segments: new Set(task.sourceSegments.map((s) => segmentKey(centralSegment(s, origin)))),
    dots,
  };
}

function dedupeSegs(segs: GridSegment[]): GridSegment[] {
  const seen = new Set<string>();
  const out: GridSegment[] = [];
  for (const s of segs) {
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

function offsetSeg(s: GridSegment, dx: number, dy: number): GridSegment {
  return { x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
}

function offsetDot(p: GridPoint, dx: number, dy: number): GridPoint {
  return { x: p.x + dx, y: p.y + dy };
}

function inGrid(p: GridPoint): boolean {
  return (
    Number.isInteger(p.x) &&
    Number.isInteger(p.y) &&
    p.x >= 0 &&
    p.x <= G7_CENTRAL_WIDTH &&
    p.y >= 0 &&
    p.y <= G7_CENTRAL_HEIGHT
  );
}

function isOrigin(p: GridPoint, origin: GridPoint = G7_CENTRAL_ORIGIN): boolean {
  return p.x === origin.x && p.y === origin.y;
}

function collectVertices(segs: GridSegment[], dots: GridPoint[]): GridPoint[] {
  const pts: GridPoint[] = [...dots];
  for (const s of segs) {
    pts.push({ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 });
  }
  return dedupeDots(pts);
}

function dist2(a: GridPoint, b: GridPoint): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/**
 * Offsets pour placer la figure 10×10 sans toucher O ni sortir du côté source.
 * (0,0) convient presque toujours ; bateau / voilier ont un sommet en (10,10) → (0,-1).
 */
const PLACE_OFFSETS: Array<[number, number]> = [
  [0, 0],
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
  [-1, -1],
  [1, -1],
  [0, -2],
  [-2, 0],
];

function placementOk(segs: GridSegment[], dots: GridPoint[]): boolean {
  const verts = collectVertices(segs, dots);
  if (verts.length === 0) return false;
  for (const p of verts) {
    if (!inGrid(p) || isOrigin(p) || !isSourceSide(p)) return false;
    const img = centralPoint(p);
    if (!inGrid(img)) return false;
  }
  return true;
}

/**
 * Point d'exemple : toujours un sommet de la figure (le plus éloigné de O),
 * pour que le trait pointillé traverse clairement le centre jusqu'à l'image.
 */
function pickExamplePoint(
  segs: GridSegment[],
  dots: GridPoint[],
  origin: GridPoint = G7_CENTRAL_ORIGIN,
): GridPoint {
  const verts = collectVertices(segs, dots).filter((p) => isSourceSide(p, origin));
  if (verts.length === 0) {
    throw new Error("aucun sommet côté source pour le point d'exemple");
  }
  return [...verts].sort((a, b) => dist2(b, origin) - dist2(a, origin))[0]!;
}

function figureToCentralTask(
  id: string,
  label: string,
  figure: GridFigure,
): CentralSymmetryTask {
  let sourceSegments: GridSegment[] | null = null;
  let sourceDots: GridPoint[] | null = null;

  for (const [dx, dy] of PLACE_OFFSETS) {
    const segs = dedupeSegs(figure.segments.map((s) => offsetSeg(s, dx, dy)));
    const dots = dedupeDots(figure.dots.map((p) => offsetDot(p, dx, dy)));
    if (!placementOk(segs, dots)) continue;
    sourceSegments = segs;
    sourceDots = dots;
    break;
  }

  if (!sourceSegments || !sourceDots) {
    throw new Error(`G7.3: impossible de placer la figure ${id} sans toucher O`);
  }

  const examplePoint = pickExamplePoint(sourceSegments, sourceDots);
  return {
    id: `C-${id}`,
    label,
    width: G7_CENTRAL_WIDTH,
    height: G7_CENTRAL_HEIGHT,
    origin: G7_CENTRAL_ORIGIN,
    sourceSegments,
    sourceDots,
    examplePoint,
  };
}

/**
 * Mêmes figures que G7.1 ex.1.
 * Centre O toujours en (10,10) ; exemple = point de la figure aligné avec O et son image.
 */
const CENTRAL_TASKS: CentralSymmetryTask[] = G7_COPY_FIGURES.map(({ id, label, figure }) =>
  figureToCentralTask(id, label, figure),
);

if (CENTRAL_TASKS.length === 0) {
  throw new Error("G7.3 central pool: aucune figure (G7_COPY_FIGURES vide)");
}

export function pickCentralSymmetryTask(seed: number): CentralSymmetryTask {
  return CENTRAL_TASKS[Math.abs(seed) % CENTRAL_TASKS.length]!;
}

export function listCentralSymmetryTasks(): CentralSymmetryTask[] {
  return [...CENTRAL_TASKS];
}

export function centralConsigne(_task: CentralSymmetryTask): string {
  return "Complétez la figure par symétrie centrale. Le point bleu O est le centre (milieu de la grille). Le trait en pointillés montre un point de la figure, son image de l'autre côté, alignés avec O.";
}

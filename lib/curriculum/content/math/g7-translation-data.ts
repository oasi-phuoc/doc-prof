import type { GridFigure, GridPoint, GridSegment } from "./g7-reproduce-data";
import {
  G7_COPY_FIGURES,
  G7_GRID_SIZE,
  pointKey,
  segmentKey,
} from "./g7-reproduce-data";

/** Grille translation G7.4 : 20×20. */
export const G7_TRANSLATION_SIZE = 20;

/** Décalage pour centrer une figure 10×10 (coords 0…10) sur la grille 20×20. */
const CENTER_OFFSET = (G7_TRANSLATION_SIZE - G7_GRID_SIZE) / 2; // 5

export type TranslationVector = { dx: number; dy: number };

export type TranslationTask = {
  id: string;
  label: string;
  width: number;
  height: number;
  /** Vecteur de translation (cases). */
  vector: TranslationVector;
  /** Origine de la flèche bleue sur la grille. */
  arrowFrom: GridPoint;
  sourceSegments: GridSegment[];
  sourceDots: GridPoint[];
};

export function translatePoint(p: GridPoint, v: TranslationVector): GridPoint {
  return { x: p.x + v.dx, y: p.y + v.dy };
}

export function translateSegment(s: GridSegment, v: TranslationVector): GridSegment {
  const a = translatePoint({ x: s.x1, y: s.y1 }, v);
  const b = translatePoint({ x: s.x2, y: s.y2 }, v);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

export function expectedTranslation(task: TranslationTask): {
  dots: Set<string>;
  segments: Set<string>;
} {
  return {
    segments: new Set(task.sourceSegments.map((s) => segmentKey(translateSegment(s, task.vector)))),
    dots: new Set(task.sourceDots.map((p) => pointKey(translatePoint(p, task.vector)))),
  };
}

/** Zone de dessin : toute la grille (les points source restent verrouillés côté UI). */
export function isDrawSideTranslation(_p: GridPoint, _task: TranslationTask): boolean {
  return true;
}

function offsetSeg(s: GridSegment, dx: number, dy: number): GridSegment {
  return { x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
}

function offsetDot(p: GridPoint, dx: number, dy: number): GridPoint {
  return { x: p.x + dx, y: p.y + dy };
}

function fmtSigned(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

/** Vecteurs sûrs pour une figure centrée dans [5, 15] → image dans [0, 20]. */
const TRANSLATION_VECTORS: TranslationVector[] = [
  { dx: 4, dy: 0 },
  { dx: 0, dy: 4 },
  { dx: 5, dy: 2 },
  { dx: 3, dy: 3 },
  { dx: 4, dy: -2 },
  { dx: -4, dy: 0 },
  { dx: 0, dy: -4 },
  { dx: -3, dy: 2 },
  { dx: 4, dy: -3 },
  { dx: -5, dy: -2 },
  { dx: 2, dy: 5 },
  { dx: -2, dy: 4 },
  { dx: 5, dy: -1 },
  { dx: -4, dy: 3 },
  { dx: 1, dy: -5 },
  { dx: -5, dy: 1 },
  { dx: 3, dy: -4 },
  { dx: -1, dy: 5 },
  { dx: 5, dy: 0 },
  { dx: 0, dy: 5 },
  { dx: -5, dy: 0 },
  { dx: 0, dy: -5 },
  { dx: 2, dy: -4 },
  { dx: -3, dy: -3 },
  { dx: 4, dy: 2 },
];

/** Place la flèche pour que la pointe tombe dans un coin cohérent avec le vecteur. */
function makeArrowFrom(v: TranslationVector): GridPoint {
  const tipX = v.dx >= 0 ? G7_TRANSLATION_SIZE : 0;
  const tipY = v.dy >= 0 ? G7_TRANSLATION_SIZE : 0;
  return { x: tipX - v.dx, y: tipY - v.dy };
}

function collectCoords(segs: GridSegment[], dots: GridPoint[]): number[] {
  const vals: number[] = [];
  for (const s of segs) vals.push(s.x1, s.y1, s.x2, s.y2);
  for (const d of dots) vals.push(d.x, d.y);
  return vals;
}

function assertInGrid(id: string, segs: GridSegment[], dots: GridPoint[], v?: TranslationVector) {
  const checkSegs = v ? segs.map((s) => translateSegment(s, v)) : segs;
  const checkDots = v ? dots.map((p) => translatePoint(p, v)) : dots;
  const vals = collectCoords(checkSegs, checkDots);
  const bad = vals.filter((n) => !Number.isInteger(n) || n < 0 || n > G7_TRANSLATION_SIZE);
  if (bad.length) {
    throw new Error(`${id}: coords hors grille 0…${G7_TRANSLATION_SIZE}: ${bad.slice(0, 8).join(",")}`);
  }
}

function figureToTask(
  id: string,
  label: string,
  figure: GridFigure,
  vector: TranslationVector,
): TranslationTask {
  const sourceSegments = figure.segments.map((s) => offsetSeg(s, CENTER_OFFSET, CENTER_OFFSET));
  const sourceDots = figure.dots.map((p) => offsetDot(p, CENTER_OFFSET, CENTER_OFFSET));
  assertInGrid(`src-${id}`, sourceSegments, sourceDots);
  assertInGrid(`img-${id}`, sourceSegments, sourceDots, vector);
  const arrowFrom = makeArrowFrom(vector);
  if (
    arrowFrom.x < 0 || arrowFrom.x > G7_TRANSLATION_SIZE ||
    arrowFrom.y < 0 || arrowFrom.y > G7_TRANSLATION_SIZE ||
    arrowFrom.x + vector.dx < 0 || arrowFrom.x + vector.dx > G7_TRANSLATION_SIZE ||
    arrowFrom.y + vector.dy < 0 || arrowFrom.y + vector.dy > G7_TRANSLATION_SIZE
  ) {
    throw new Error(`${id}: flèche hors grille`);
  }
  return {
    id: `T-${id}`,
    label: `${label} (${fmtSigned(vector.dx)} ; ${fmtSigned(vector.dy)})`,
    width: G7_TRANSLATION_SIZE,
    height: G7_TRANSLATION_SIZE,
    vector,
    arrowFrom,
    sourceSegments,
    sourceDots,
  };
}

/**
 * Mêmes figures que G7.1 ex.1, centrées sur la grille 20×20.
 * L'élève effectue la translation indiquée par le vecteur (flèche bleue).
 */
const TRANSLATION_TASKS: TranslationTask[] = G7_COPY_FIGURES.map(({ id, label, figure }, i) => {
  const vector = TRANSLATION_VECTORS[i % TRANSLATION_VECTORS.length]!;
  return figureToTask(id, label, figure, vector);
});

if (TRANSLATION_TASKS.length === 0) {
  throw new Error("G7.4 translation pool: aucune figure (G7_COPY_FIGURES vide)");
}

export function pickTranslationTask(seed: number): TranslationTask {
  return TRANSLATION_TASKS[Math.abs(seed) % TRANSLATION_TASKS.length]!;
}

export function listTranslationTasks(): TranslationTask[] {
  return [...TRANSLATION_TASKS];
}

export function translationConsigne(task: TranslationTask): string {
  const { dx, dy } = task.vector;
  return `Effectuez la translation selon le vecteur (${fmtSigned(dx)} ; ${fmtSigned(dy)}). La figure modèle est au centre ; la flèche bleue indique le déplacement. Cliquez deux points pour tracer un segment ; deux fois le même point pour un point.`;
}

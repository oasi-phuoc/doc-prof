/**
 * G7.5 — Rotation sur quadrillage.
 * Figures de G7.1 ex.1.
 * Ex.1 : trait bleu à gauche sur le modèle → cible en haut / à droite / en bas.
 * Ex.2 : trait bleu à droite sur le modèle → cible en haut / à gauche / en bas.
 */
import {
  G7_COPY_FIGURES,
  G7_GRID_SIZE,
  pointKey,
  segmentKey,
  type GridFigure,
  type GridPoint,
  type GridSegment,
} from "./g7-reproduce-data";

/** Côté du trait bleu sur le modèle de base. */
export type RotationModelSide = "left" | "right";

/** Côté du trait bleu sur la grille de reproduction. */
export type RotationSide = "top" | "right" | "bottom" | "left";

export type RotationTask = {
  id: string;
  label: string;
  /** Trait bleu sur le modèle. */
  modelSide: RotationModelSide;
  /** Orientation du trait bleu sur la grille cible. */
  targetSide: RotationSide;
  /** Angle horaire correspondant (90 / 180 / 270). */
  angleCw: 90 | 180 | 270;
  reference: GridFigure;
  size: number;
};

/** Ex.1 : base gauche → haut / droite / bas. */
const TARGETS_FROM_LEFT: RotationSide[] = ["top", "right", "bottom"];
/** Ex.2 : base droite → haut / gauche / bas. */
const TARGETS_FROM_RIGHT: RotationSide[] = ["top", "left", "bottom"];

/** Rotation horaire du papier — origine en haut-gauche, n = taille (intersections 0…n). */
export function rotatePointCw(p: GridPoint, n: number, angleCw: 90 | 180 | 270): GridPoint {
  const { x, y } = p;
  if (angleCw === 90) return { x: n - y, y: x };
  if (angleCw === 180) return { x: n - x, y: n - y };
  return { x: y, y: n - x };
}

export function rotateSegmentCw(s: GridSegment, n: number, angleCw: 90 | 180 | 270): GridSegment {
  const a = rotatePointCw({ x: s.x1, y: s.y1 }, n, angleCw);
  const b = rotatePointCw({ x: s.x2, y: s.y2 }, n, angleCw);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

/**
 * Angle horaire pour amener le trait du côté modèle vers le côté cible.
 * Base gauche : haut=90°, droite=180°, bas=270°.
 * Base droite : bas=90°, gauche=180°, haut=270°.
 */
export function sideToAngle(modelSide: RotationModelSide, targetSide: RotationSide): 90 | 180 | 270 {
  if (modelSide === "left") {
    if (targetSide === "top") return 90;
    if (targetSide === "right") return 180;
    if (targetSide === "bottom") return 270;
    throw new Error(`rotation invalide: modèle gauche → ${targetSide}`);
  }
  // modelSide === "right"
  if (targetSide === "bottom") return 90;
  if (targetSide === "left") return 180;
  if (targetSide === "top") return 270;
  throw new Error(`rotation invalide: modèle droite → ${targetSide}`);
}

export function modelSideForEx(exNum: number): RotationModelSide {
  return exNum === 2 ? "right" : "left";
}

export function expectedFromRotation(task: RotationTask): { dots: Set<string>; segments: Set<string> } {
  const n = task.size;
  const angle = task.angleCw;
  return {
    dots: new Set(task.reference.dots.map((p) => pointKey(rotatePointCw(p, n, angle)))),
    segments: new Set(task.reference.segments.map((s) => segmentKey(rotateSegmentCw(s, n, angle)))),
  };
}

function sideLabelFr(side: RotationSide | RotationModelSide): string {
  if (side === "top") return "en haut";
  if (side === "right") return "à droite";
  if (side === "bottom") return "en bas";
  return "à gauche";
}

function sideLabelEn(side: RotationSide | RotationModelSide): string {
  if (side === "top") return "at the top";
  if (side === "right") return "on the right";
  if (side === "bottom") return "at the bottom";
  return "on the left";
}

/** Pool = figures G7.1 ex.1. */
const ROTATION_FIGURES = G7_COPY_FIGURES;

/**
 * @param seed — aléatoire figure / orientation
 * @param exNum — 1 = trait modèle à gauche ; 2 = trait modèle à droite
 */
export function pickRotationTask(seed: number, exNum: number = 1): RotationTask {
  const modelSide = modelSideForEx(exNum);
  const targets = modelSide === "left" ? TARGETS_FROM_LEFT : TARGETS_FROM_RIGHT;
  const figIdx = Math.abs(seed) % ROTATION_FIGURES.length;
  const sideIdx = Math.abs(Math.floor(seed / 17) + seed * 3) % targets.length;
  const { id, label, figure } = ROTATION_FIGURES[figIdx]!;
  const targetSide = targets[sideIdx]!;
  const angleCw = sideToAngle(modelSide, targetSide);
  return {
    id: `rot-${modelSide}-${id}-${targetSide}`,
    label,
    modelSide,
    targetSide,
    angleCw,
    reference: figure,
    size: G7_GRID_SIZE,
  };
}

export function rotationConsigne(task: RotationTask, lang?: string): string {
  const modelFr = sideLabelFr(task.modelSide);
  const targetFr = sideLabelFr(task.targetSide);
  if (lang === "en") {
    return `The blue mark is ${sideLabelEn(task.modelSide)} of the model. On the empty grid it is ${sideLabelEn(task.targetSide)}. Redraw the figure after the matching rotation (${task.angleCw}° clockwise).`;
  }
  if (lang === "ar") {
    return `العلامة الزرقاء ${modelFr} من النموذج. على الشبكة الفارغة هي ${targetFr}. أعد رسم الشكل بعد الدوران المناسب (${task.angleCw}° باتجاه عقارب الساعة).`;
  }
  if (lang === "fa") {
    return `علامت آبی ${modelFr} مدل است. روی شبکه خالی ${targetFr} است. شکل را پس از چرخش متناظر (${task.angleCw}° ساعت‌گرد) دوباره بکشید.`;
  }
  return `Le trait bleu est ${modelFr} du modèle. Sur la grille vide, il est ${targetFr}. Reproduisez la figure après la rotation correspondante (${task.angleCw}° dans le sens horaire).`;
}

export function listRotationFigures(): Array<{ id: string; label: string }> {
  return ROTATION_FIGURES.map(({ id, label }) => ({ id, label }));
}

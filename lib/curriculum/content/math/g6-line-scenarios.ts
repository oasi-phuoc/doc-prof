/** Générateur des 20 situations de droites pour G6.2 exercice 4 */

export type SegmentLine = {
  id: string;
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  /** Si true, prolonge le trait jusqu'aux bords du repère (droite). Sinon segment entre les deux points. */
  infinite?: boolean;
};

export type LineScenarioQuestion =
  | { type: "coord"; prompt: string; answer: [number, number] }
  | { type: "color_pair"; prompt: string; point: [number, number]; answer: [string, string] }
  | { type: "bool"; prompt: string; answer: boolean }
  | { type: "parallel_to"; prompt: string; lineId: string; answer: string }
  | { type: "perpendicular_to"; prompt: string; lineId: string; answer: string };

export type LineScenario = {
  id: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  lines: SegmentLine[];
  questions: LineScenarioQuestion[];
};

const GRID = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

type RawLine = { id: string; color: string; label: string; x1: number; y1: number; x2: number; y2: number };
type EntityId = string;

function dir(l: RawLine): [number, number] {
  return [l.x2 - l.x1, l.y2 - l.y1];
}

function intersect(l1: RawLine, l2: RawLine): [number, number] | null {
  const { x1, y1, x2, y2 } = l1;
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = l2;
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-9) return null;
  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
  return [Math.round(px), Math.round(py)];
}

function intersectLineAxis(l: RawLine, axis: "axis_x" | "axis_y"): [number, number] | null {
  const { x1, y1, x2, y2 } = l;
  if (axis === "axis_x") {
    if (Math.abs(y2 - y1) < 1e-9) return null;
    const t = -y1 / (y2 - y1);
    const x = x1 + t * (x2 - x1);
    const pt: [number, number] = [Math.round(x), 0];
    return inGrid(pt) ? pt : null;
  }
  if (Math.abs(x2 - x1) < 1e-9) return null;
  const t = -x1 / (x2 - x1);
  const y = y1 + t * (y2 - y1);
  const pt: [number, number] = [0, Math.round(y)];
  return inGrid(pt) ? pt : null;
}

function entityDir(id: EntityId, lines: RawLine[]): [number, number] {
  if (id === "axis_x") return [1, 0];
  if (id === "axis_y") return [0, 1];
  return dir(lines.find((l) => l.id === id)!);
}

function isParallelEntities(a: EntityId, b: EntityId, lines: RawLine[]): boolean {
  const [dx1, dy1] = entityDir(a, lines);
  const [dx2, dy2] = entityDir(b, lines);
  return Math.abs(dx1 * dy2 - dy1 * dx2) < 1e-6;
}

function isPerpendicularEntities(a: EntityId, b: EntityId, lines: RawLine[]): boolean {
  const [dx1, dy1] = entityDir(a, lines);
  const [dx2, dy2] = entityDir(b, lines);
  return Math.abs(dx1 * dx2 + dy1 * dy2) < 1e-6;
}

function parallelTarget(l: RawLine): "axis_x" | "axis_y" | string | null {
  const [dx, dy] = dir(l);
  if (Math.abs(dy) < 1e-6) return "axis_x";
  if (Math.abs(dx) < 1e-6) return "axis_y";
  return null;
}

function perpendicularTarget(l: RawLine): "axis_x" | "axis_y" | string | null {
  const [dx, dy] = dir(l);
  if (Math.abs(dy) < 1e-6) return "axis_y";
  if (Math.abs(dx) < 1e-6) return "axis_x";
  return null;
}

function inGrid([x, y]: [number, number]): boolean {
  return x >= GRID.xMin && x <= GRID.xMax && y >= GRID.yMin && y <= GRID.yMax;
}

function isIntegerCoord([x, y]: [number, number]): boolean {
  return Number.isInteger(x) && Number.isInteger(y);
}

function fmtCoord(x: number, y: number): string {
  const fx = Number.isInteger(x) ? String(x) : String(x).replace(".", ",");
  const fy = Number.isInteger(y) ? String(y) : String(y).replace(".", ",");
  return `(${fx} ; ${fy})`;
}

function lineLabel(id: string, lines: RawLine[]): string {
  return lines.find((l) => l.id === id)?.label ?? id;
}

export function entityLabel(id: EntityId, lines: RawLine[] | SegmentLine[]): string {
  if (id === "axis_x") return "l'axe des X";
  if (id === "axis_y") return "l'axe des Y";
  return `la droite ${lineLabel(id, lines as RawLine[])}`;
}

function allEntityPairs(lines: RawLine[]): Array<[EntityId, EntityId]> {
  const ents: EntityId[] = [...lines.map((l) => l.id), "axis_x", "axis_y"];
  const pairs: Array<[EntityId, EntityId]> = [];
  for (let i = 0; i < ents.length; i++) {
    for (let j = i + 1; j < ents.length; j++) pairs.push([ents[i]!, ents[j]!]);
  }
  return pairs;
}

function collectIntersectionPairs(lines: RawLine[]): Array<[EntityId, EntityId, [number, number]]> {
  const pairs: Array<[EntityId, EntityId, [number, number]]> = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const pt = intersect(lines[i]!, lines[j]!);
      if (pt && inGrid(pt) && isIntegerCoord(pt)) pairs.push([lines[i]!.id, lines[j]!.id, pt]);
    }
  }
  for (const l of lines) {
    for (const ax of ["axis_x", "axis_y"] as const) {
      const pt = intersectLineAxis(l, ax);
      if (pt && isIntegerCoord(pt)) pairs.push([l.id, ax, pt]);
    }
  }
  pairs.push(["axis_x", "axis_y", [0, 0]]);
  return pairs;
}

/**
 * 20 configurations : chaque situation contient une horizontale (// axe X),
 * une verticale (// axe Y) et deux obliques — au moins une parallèle et une
 * perpendiculaire (droite/droite ou droite/axe).
 */
const RAW_CONFIGS: RawLine[][] = [
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 3, x2: 10, y2: 3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 4, y1: -10, x2: 4, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: -6, x2: 6, y2: 8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 5, x2: 8, y2: -4 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -2, x2: 10, y2: -2 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -5, y1: -10, x2: -5, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -6, y1: 8, x2: 8, y2: -6 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -8, x2: 6, y2: 10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 4, x2: 10, y2: 4 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -3, y1: -10, x2: -3, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -4, y1: -10, x2: 6, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 8, x2: 10, y2: -6 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -4, x2: 10, y2: -4 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 6, y1: -10, x2: 6, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: 10, x2: 8, y2: -2 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -6, x2: 4, y2: 10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 2, x2: 10, y2: 2 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -7, y1: -10, x2: -7, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -10, y1: -4, x2: 6, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -6, y1: 10, x2: 10, y2: -8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -3, x2: 10, y2: -3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 2, y1: -10, x2: 2, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: -8, x2: 8, y2: 8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 6, x2: 8, y2: -10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 5, x2: 10, y2: 5 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -4, y1: -10, x2: -4, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -6, y1: -10, x2: 8, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 2, x2: 10, y2: -8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -5, x2: 10, y2: -5 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 3, y1: -10, x2: 3, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: 6, x2: 6, y2: -8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -10, x2: 8, y2: 6 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 3, x2: 10, y2: 3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -6, y1: -10, x2: -6, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -4, y1: -10, x2: 8, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 8, x2: 6, y2: -10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -2, x2: 10, y2: -2 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 5, y1: -10, x2: 5, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -10, y1: -6, x2: 10, y2: 4 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -8, y1: 10, x2: 8, y2: -8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 4, x2: 10, y2: 4 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 2, y1: -10, x2: 2, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -6, y1: 10, x2: 10, y2: -6 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -8, x2: 6, y2: 10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -3, x2: 10, y2: -3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -4, y1: -10, x2: -4, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: -10, x2: 2, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 6, x2: 10, y2: -4 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 2, x2: 10, y2: 2 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 7, y1: -10, x2: 7, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -10, y1: 8, x2: 8, y2: -10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -6, y1: -10, x2: 8, y2: 6 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -4, x2: 10, y2: -4 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -2, y1: -10, x2: -2, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: 8, x2: 6, y2: -8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -6, x2: 10, y2: 8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 5, x2: 10, y2: 5 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -5, y1: -10, x2: -5, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -4, y1: -10, x2: 6, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 4, x2: 10, y2: -6 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -5, x2: 10, y2: -5 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 4, y1: -10, x2: 4, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -10, y1: -8, x2: 8, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -6, y1: 10, x2: 10, y2: -8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 3, x2: 10, y2: 3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 3, y1: -10, x2: 3, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: -6, x2: 8, y2: 8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 8, x2: 6, y2: -10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -2, x2: 10, y2: -2 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -6, y1: -10, x2: -6, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -6, y1: -10, x2: 8, y2: 10 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: 6, x2: 10, y2: -8 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: 4, x2: 10, y2: 4 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: -7, y1: -10, x2: -7, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -8, y1: 10, x2: 8, y2: -2 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -10, y1: -4, x2: 6, y2: 10 },
  ],
  [
    { id: "rouge", color: "#dc2626", label: "rouge", x1: -10, y1: -3, x2: 10, y2: -3 },
    { id: "bleue", color: "#2563eb", label: "bleue", x1: 6, y1: -10, x2: 6, y2: 10 },
    { id: "verte", color: "#16a34a", label: "verte", x1: -10, y1: -6, x2: 8, y2: 8 },
    { id: "orange", color: "#ea580c", label: "orange", x1: -4, y1: -10, x2: 8, y2: 10 },
  ],
];

function boolQuestion(
  a: EntityId,
  b: EntityId,
  lines: RawLine[],
  kind: "parallel" | "perpendicular",
): LineScenarioQuestion {
  const rel = kind === "parallel" ? "parallèles" : "perpendiculaires";
  return {
    type: "bool",
    prompt: `${entityLabel(a, lines)} et ${entityLabel(b, lines)} sont ${rel}.`,
    answer: kind === "parallel"
      ? isParallelEntities(a, b, lines)
      : isPerpendicularEntities(a, b, lines),
  };
}

function parallelToQuestion(lines: RawLine[], seed: number): LineScenarioQuestion {
  const focus = lines[seed % lines.length]!;
  const axisTarget = parallelTarget(focus);
  const other = lines.find((l) => l.id !== focus.id && isParallelEntities(focus.id, l.id, lines));
  const answer = axisTarget ?? other?.id ?? "axis_x";
  return {
    type: "parallel_to",
    prompt: `La droite ${focus.label} est parallèle à`,
    lineId: focus.id,
    answer,
  };
}

function perpendicularToQuestion(lines: RawLine[], seed: number): LineScenarioQuestion {
  const focus = lines[(seed + 1) % lines.length]!;
  const axisTarget = perpendicularTarget(focus);
  const other = lines.find((l) => l.id !== focus.id && isPerpendicularEntities(focus.id, l.id, lines));
  const answer = axisTarget ?? other?.id ?? "axis_y";
  return {
    type: "perpendicular_to",
    prompt: `La droite ${focus.label} est perpendiculaire à`,
    lineId: focus.id,
    answer,
  };
}

function buildQuestions(lines: RawLine[], seed: number): LineScenarioQuestion[] {
  const intPairs = collectIntersectionPairs(lines);
  const lineLinePairs = intPairs.filter(
    ([a, b]) => !a.startsWith("axis") && !b.startsWith("axis"),
  );
  const axisIntPairs = intPairs.filter(
    ([a, b]) => a.startsWith("axis") || b.startsWith("axis"),
  );

  const p1 = lineLinePairs[seed % lineLinePairs.length] ?? intPairs[0]!;
  const q2Pool = axisIntPairs.length > 0 ? axisIntPairs : intPairs;
  const p2Candidates = q2Pool.filter(
    ([a, b]) => !(a === p1[0] && b === p1[1]) && !(a === p1[1] && b === p1[1]),
  );
  const p2 = p2Candidates[(seed + 1) % p2Candidates.length]
    ?? q2Pool[(seed + 1) % q2Pool.length]
    ?? intPairs[1]
    ?? intPairs[0]!;

  const q1: LineScenarioQuestion = {
    type: "coord",
    prompt: `Les droites ${lineLabel(p1[0], lines)} et ${lineLabel(p1[1], lines)} se croisent en`,
    answer: p1[2],
  };

  const q2: LineScenarioQuestion = {
    type: "color_pair",
    prompt: `se croisent en ${fmtCoord(p2[2][0], p2[2][1])}.`,
    point: p2[2],
    answer: [p2[0], p2[1]],
  };

  const entityPairs = allEntityPairs(lines);
  const case1 = seed % 2 === 0;
  const relPair = entityPairs[seed % entityPairs.length]!;
  const relPairAlt = entityPairs[(seed + 5) % entityPairs.length]!;
  const q3 = case1
    ? boolQuestion(relPair[0], relPair[1], lines, "parallel")
    : parallelToQuestion(lines, seed);
  const q4 = case1
    ? perpendicularToQuestion(lines, seed)
    : boolQuestion(relPairAlt[0], relPairAlt[1], lines, "perpendicular");

  return [q1, q2, q3, q4];
}

export const LINE_SCENARIOS: LineScenario[] = RAW_CONFIGS.map((lines, i) => ({
  id: `line-${i + 1}`,
  ...GRID,
  lines,
  questions: buildQuestions(lines, i),
}));

export function parallelToLabel(answer: string, lines: SegmentLine[]): string {
  return entityLabel(answer, lines);
}

// Parameterized A10 exercise generators — manual development steps per template shape.

import {
  type A10ExerciseLevel,
  pickByLevel,
  alignOps,
  formatSideOp,
  a102EasyGens,
  a102FracEasyGens,
  a103EasyGens,
  a103HardGens,
  a104EasyGens,
  a104HardGens,
} from "./a10-level-pools";

export type { A10ExerciseLevel };

export type EquationSolution =
  | { kind: "rational"; num: number; den: number }
  | { kind: "impossible" }
  | { kind: "infinite" };

export type EquationQuestion = {
  expr: string;
  solution: EquationSolution;
  development?: string[];
  operations?: string[];
};

export type SystemEquationQuestion = {
  equations: [string, string];
  answer: string;
  acceptable: string[];
  development: string[];
  operations?: string[];
};

const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function rat(n: number, d: number): EquationSolution {
  if (d === 0) return { kind: "impossible" };
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  n /= g;
  d /= g;
  if (Math.abs(n) >= 200 || Math.abs(d) >= 200) return { kind: "impossible" };
  return { kind: "rational", num: n, den: d };
}

const IMP: EquationSolution = { kind: "impossible" };
const INF: EquationSolution = { kind: "infinite" };

function fracMarkup(n: number | string, d: number | string): string {
  return `[[frac:${n}/${d}]]`;
}
const f = fracMarkup;

function solText(sol: EquationSolution): string {
  if (sol.kind === "impossible") return "∅";
  if (sol.kind === "infinite") return "infini";
  if (sol.den === 1) return `${sol.num}`;
  return `${sol.num}/${sol.den}`;
}

function okRat(s: EquationSolution): s is { kind: "rational"; num: number; den: number } {
  return s.kind === "rational" && Math.abs(s.num) < 200 && Math.abs(s.den) < 200;
}

function pickCoprimeNumDen(): { num: number; den: number } {
  for (let t = 0; t < 50; t++) {
    const den = ri(2, 12);
    const num = ri(-15, 15);
    if (num === 0) continue;
    if (gcd(Math.abs(num), den) !== 1) continue;
    return { num, den };
  }
  return { num: ri(1, 8), den: 1 };
}

function pickIntSolution(): number {
  const v = ri(-12, 12);
  return v === 0 ? 1 : v;
}

function retry<T>(fn: () => T | null, max = 40): T {
  for (let i = 0; i < max; i++) {
    const r = fn();
    if (r) return r;
  }
  throw new Error("retry exhausted");
}

function acceptPair(x: string, y: string): string[] {
  return [
    `${x};${y}`, `${x},${y}`, `(${x};${y})`, `(${x},${y})`,
    `{(${x};${y})}`, `{(${x},${y})}`, `s={(${x};${y})}`, `s={(${x},${y})}`,
  ];
}

function pairAnswer(x: string, y: string): string {
  return `{(${x} ; ${y})}`;
}

function commonOps(mult: number, more: string[], dev: string[]): string[] {
  return alignOps(dev, ["même dénominateur", `· ${mult}`, "réduire", ...more]);
}

function _pickFrom<T>(arr: Array<() => T>): T {
  return arr[ri(0, arr.length - 1)]!();
}

function _fracSol(n: number, d: number): string {
  const r = rat(n, d);
  if (!okRat(r)) return solText(r);
  if (r.den === 1) return `${r.num}`;
  return f(r.num, r.den);
}

function _signed(n: number): string {
  return n < 0 ? `-${-n}` : `${n}`;
}


const a102Gens: Array<() => EquationQuestion> = [
  // T1: mx·n - p(x+q) = rx - s + x
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const m = ri(2, 6), n = ri(2, 5), p = ri(2, 5), q = ri(1, 4), r = ri(3, 8);
    const mn = m * n;
    const coef = mn - p - r - 1;
    if (coef === 0) return null;
    const rhs = coef * xn / xd;
    if (!Number.isInteger(rhs)) return null;
    const s = p * q - rhs;
    if (Math.abs(s) > 80) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${m}x · ${n} - ${p}(x + ${q}) = ${r}x - ${s} + x`;
    const development = [
      `${mn}x - ${p}x - ${p * q} = ${r}x - ${s} + x`,
      `${mn - p}x - ${p * q} = ${r + 1}x - ${s}`,
      `${coef}x - ${p * q} = -${s}`,
      `${coef}x = ${rhs}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${r + 1}x`, `+ ${p * q}`, `: ${coef}`, ""]) };
  }),

  // T2: A - (B - Cx) = Dx + (Ex - F)·H
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const A = ri(4, 12), B = ri(5, 12), C = ri(2, 5), D = ri(4, 10), E = ri(2, 5), H = ri(2, 4);
    const leftCoef = C - D - E * H;
    if (leftCoef === 0) return null;
    const rhs = leftCoef * xn / xd;
    if (!Number.isInteger(rhs)) return null;
    const FH = -(A - B) - rhs;
    if (FH <= 0 || FH % H !== 0) return null;
    const F = FH / H;
    if (F < 1 || F > 12) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${A} - (${B} - ${C}x) = ${D}x + (${E}x - ${F}) · ${H}`;
    const development = [
      `${A} - ${B} + ${C}x = ${D}x + ${E * H}x - ${F * H}`,
      `${A - B} + ${C}x = ${D + E * H}x - ${F * H}`,
      `${A - B} - ${D + E * H - C}x = -${F * H}`,
      `${leftCoef}x = ${rhs}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${D + E * H}x`, `+ ${A - B}`, `: (${leftCoef})`, ""]) };
  }),

  // T3: k·x = -(a+b)
  () => retry(() => {
    const k = ri(8, 14);
    const a = ri(1, 5), b = ri(2, 6);
    const rhs = -(a + b);
    const xn = rhs, xd = k;
    const g = gcd(Math.abs(xn), xd);
    const sol = rat(xn / g, xd / g);
    if (!okRat(sol)) return null;
    const terms = Array(k - 2).fill("x + ").join("") + "x + x + x";
    const expr = `${terms} = (x - ${a}) - (x + ${b})`;
    const development = [
      `${k}x = x - ${a} - x - ${b}`,
      `${k}x = ${rhs}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `: ${k}`, ""]) };
  }),

  // T4: impossible — ax + b(x-c) = d(x-e) + fx, same x coef, diff constants
  () => {
    const a = ri(3, 7), b = ri(2, 4), c = ri(2, 6), d = ri(3, 6), e = ri(3, 8), f = ri(3, 6);
    const L = a + b, R = d + f;
    const lc = -b * c, rc = -d * e;
    if (L !== R || lc === rc) {
      const a2 = ri(4, 7), b2 = 2, c2 = ri(2, 5), d2 = 3, e2 = ri(5, 8), f2 = 4;
      const L2 = a2 + b2, lc2 = -b2 * c2, rc2 = -d2 * e2;
      const expr = `${a2}x + (x - ${c2}) · ${b2} = ${d2}(x - ${e2}) + ${f2}x`;
      const development = [
        `${L2}x - ${b2 * c2} = ${L2}x - ${d2 * e2}`,
        `${L2}x - ${b2 * c2} = ${L2}x - ${d2 * e2}`,
        `${lc2} = ${rc2}`,
        "impossible !",
      ];
      return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", `- ${L2}x`, "", ""]) };
    }
    const expr = `${a}x + (x - ${c}) · ${b} = ${d}(x - ${e}) + ${f}x`;
    const development = [
      `${L}x - ${b * c} = ${L}x - ${d * e}`,
      `${L}x - ${b * c} = ${L}x - ${d * e}`,
      `${lc} = ${rc}`,
      "impossible !",
    ];
    return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", `- ${L}x`, "", ""]) };
  },

  // T5: ax² + bx - c = ax(x-d) + e
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(2, 5), d = ri(2, 5), b = ri(3, 9);
    const coef = b + a * d;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const c = ri(1, 6);
    const e = num + c;
    if (Math.abs(e) > 40) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x² + ${b}x - ${c} = ${a}x(x - ${d}) + ${e}`;
    const development = [
      `${a}x² + ${b}x - ${c} = ${a}x² - ${a * d}x + ${e}`,
      `${b}x - ${c} = -${a * d}x + ${e}`,
      `${coef}x - ${c} = ${e}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "- x²", `+ ${a * d}x`, `+ ${c}`, `: ${coef}`, ""]) };
  }),

  // T6: ax·b - cx·(-d) + e = rhs  (minus negative → plus)
  () => retry(() => {
    const xn = pickIntSolution();
    const a = ri(2, 6), b = ri(2, 4), c = ri(2, 5), d = ri(2, 4), e = ri(1, 5);
    const coef = a * b + c * d;
    const rhs = coef * xn + e;
    if (rhs < 1 || rhs > 80) return null;
    const sol = rat(xn, 1);
    const expr = `${a}x · ${b} - ${c}x · (-${d}) + ${e} = ${rhs}`;
    const development = [
      `${a * b}x + ${c * d}x + ${e} = ${rhs}`,
      `${coef}x + ${e} = ${rhs}`,
      `${coef}x = ${rhs - e}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${e}`, `: ${coef}`, ""]) };
  }),

  // T7: infinite — a(x-c)+bd = e(x-f)+gx-h with matching coef & const
  () => retry(() => {
    const a = ri(4, 8), c = ri(2, 5), b = ri(2, 5), bd = ri(2, 6);
    const e = ri(2, 5), f = ri(2, 5);
    const g = a - e;
    if (g < 1) return null;
    const leftConst = -a * c + b * bd;
    const h = leftConst + e * f;
    const expr = `${a}(x - ${c}) + ${b} · ${bd} = ${e}(x - ${f}) + ${g}x - ${h}`;
    const G = a;
    const development = [
      `${a}x - ${a * c} + ${b * bd} = ${e}x - ${e * f} + ${g}x - ${h}`,
      `${G}x - ${leftConst} = ${G}x - ${leftConst}`,
      `-${leftConst} = -${leftConst}`,
      "infini",
    ];
    return { expr, solution: INF, development, operations: alignOps(development, ["effectuer", "réduire", `- ${G}x`, "", ""]) };
  }),

  // T8: ax·(x-b) - ax² = (c+dx)·e
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(2, 5), b = ri(2, 5), c = ri(3, 10), d = ri(2, 5), e = ri(5, 9);
    const coef = -(a * b + d * e);
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const ce = c * e;
    if (num !== ce) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x · (x - ${b}) - ${a}x² = (${c} + ${d}x) · ${e}`;
    const development = [
      `${a}x² - ${a * b}x - ${a}x² = ${ce} + ${d * e}x`,
      `-${a * b}x = ${ce} + ${d * e}x`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${d * e}x`, `: (${coef})`, ""]) };
  }),

  // T9: ax - b·(-cx) + d = ex·f - g
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(5, 12), b = ri(2, 4), c = ri(2, 4), d = ri(2, 8);
    const e = ri(4, 9), f = ri(2, 4), g = ri(2, 6);
    const leftCoef = a + b * c;
    const rightCoef = e * f;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    if (num + g - d !== num + g - d) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x - ${b} · (-${c}x) + ${d} = ${e}x · ${f} - ${g}`;
    const development = [
      `${a}x + ${b * c}x + ${d} = ${rightCoef}x - ${g}`,
      `${leftCoef}x + ${d} = ${rightCoef}x - ${g}`,
      `${coef}x + ${d} = -${g}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${rightCoef}x`, `- ${d}`, `: (${coef})`, ""]) };
  }),

  // T10: (x-a) - b(x+c) = d(x-e)
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(4, 9), b = ri(2, 4), c = ri(2, 4), d = ri(2, 4), e = ri(2, 6);
    const coef1 = 1 - b - d;
    const const1 = -a - b * c + d * e;
    if (coef1 === 0) return null;
    const num = coef1 * xn / xd;
    if (!Number.isInteger(num) || num !== const1) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `(x - ${a}) - ${b}(x + ${c}) = ${d}(x - ${e})`;
    const development = [
      `x - ${a} - ${b}x - ${b * c} = ${d}x - ${d * e}`,
      `${1 - b}x - ${a + b * c} = ${d}x - ${d * e}`,
      `${coef1}x - ${a + b * c} = -${d * e}`,
      `${coef1}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${d}x`, `+ ${a + b * c}`, `: (${coef1})`, ""]) };
  }),

  // T11: infinite — ax·b + c - x = d(1+ex) - f
  () => retry(() => {
    const a = ri(3, 8), b = ri(2, 4), f = ri(3, 8);
    const lc = a * b - 1;
    const d = ri(4, 9);
    const e = lc / d;
    if (!Number.isInteger(e) || e < 2 || e > 5) return null;
    const c = d - f;
    const expr = `${a}x · ${b} + ${c} - x = ${d}(1 + ${e}x) - ${f}`;
    const de = d * e;
    const development = [
      `${a * b}x + ${c} - x = ${d} + ${de}x - ${f}`,
      `${lc}x + ${c} = ${de}x + ${d - f}`,
      `${c} = ${c}`,
      "infini",
    ];
    return { expr, solution: INF, development, operations: alignOps(development, ["effectuer", "réduire", `- ${de}x`, ""]) };
  }),

  // T12: ax² + bx + c = ax² + dx (x² cancels)
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(2, 6), b = ri(8, 15), d = ri(2, 6);
    const coef = b - d;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const c = -num;
    if (Math.abs(c) > 20) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x² + ${b}x + ${c} = ${a}x² + ${d}x`;
    const development = [
      `${b}x + ${c} = ${d}x`,
      `${coef}x + ${c} = 0`,
      `${coef}x = ${-c}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "- x²", `- ${d}x`, `- ${c}`, `: ${coef}`, ""]) };
  }),

  // T13: impossible — (x+a)·b - c = x·b - d
  () => {
    const a = ri(2, 6), b = ri(2, 4), c = ri(1, 4);
    let d = ri(2, 10);
    while (d === a * b - c) d = ri(2, 10);
    const expr = `(x + ${a}) · ${b} - ${c} = x · ${b} - ${d}`;
    const development = [
      `${b}x + ${a * b} - ${c} = ${b}x - ${d}`,
      `${b}x + ${a * b - c} = ${b}x - ${d}`,
      `${a * b - c} = -${d}`,
      "impossible !",
    ];
    return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", `- ${b}x`, "", ""]) };
  },

  // T14: ax - (bx - c) + d = (x - e)·f
  () => retry(() => {
    const xn = pickIntSolution();
    const a = ri(5, 10), b = ri(2, 5), c = ri(1, 4), d = ri(1, 4), e = ri(2, 5), f = ri(3, 6);
    const leftCoef = a - b;
    const coef = leftCoef - f;
    if (coef === 0) return null;
    const constL = c + d;
    const constR = -e * f;
    const num = xn * coef;
    if (num !== constR - constL) return null;
    const sol = rat(xn, 1);
    const expr = `${a}x - (${b}x - ${c}) + ${d} = (x - ${e}) · ${f}`;
    const development = [
      `${a}x - ${b}x + ${c} + ${d} = ${f}x - ${e * f}`,
      `${leftCoef}x + ${constL} = ${f}x - ${e * f}`,
      `${coef}x + ${constL} = -${e * f}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${f}x`, `- ${constL}`, ""]) };
  }),

  // T15: 3x - a = (x+b) - (cx - d)
  () => retry(() => {
    const xn = pickIntSolution();
    const a = ri(2, 5), b = ri(2, 5), c = ri(3, 6), d = ri(5, 10);
    const rightCoef = 1 - c;
    const coef = 3 - rightCoef;
    if (coef === 0) return null;
    const constR = b + d;
    const num = xn * coef;
    if (num + a !== constR) return null;
    const sol = rat(xn, 1);
    const expr = `x + x + x - ${a} = (x + ${b}) - (${c}x - ${d})`;
    const development = [
      `3x - ${a} = x + ${b} - ${c}x + ${d}`,
      `3x - ${a} = ${rightCoef}x + ${constR}`,
      `${coef}x - ${a} = ${constR}`,
      `${coef}x = ${num + a}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `+ ${c}x`, `+ ${a}`, `: ${coef}`, ""]) };
  }),

  // T16: a(x-b) + c(d + ex) = 0
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(3, 7), b = ri(2, 5), c = ri(2, 4), d = ri(5, 12);
    const coef = a + c * ri(2, 4);
    const e = (coef - a) / c;
    if (!Number.isInteger(e) || e < 2) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const constL = -a * b + c * d;
    if (num !== -constL) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}(x - ${b}) + ${c}(${d} + ${e}x) = 0`;
    const development = [
      `${a}x - ${a * b} + ${c * d} + ${c * e}x = 0`,
      `${coef}x + ${constL} = 0`,
      `${coef}x = ${-constL}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${constL >= 0 ? constL : `(${constL})`}`, `: ${coef}`, ""]) };
  }),

  // T17: A - b(x-c) = (d + ex)·f
  () => retry(() => {
    const xn = pickIntSolution();
    const b = ri(2, 5), c = ri(1, 4), d = ri(2, 6), f = ri(2, 4);
    const e = ri(2, 5);
    const leftCoef = -b;
    const rightCoef = e * f;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const rhs = d * f;
    const A = rhs + b * c + b * xn - e * f * xn;
    if (A < 20 || A > 80) return null;
    const sol = rat(xn, 1);
    const expr = `${A} - ${b}(x - ${c}) = (${d} + ${e}x) · ${f}`;
    const development = [
      `${A} - ${b}x + ${b * c} = ${d * f} + ${e * f}x`,
      `${A + b * c} - ${b}x = ${rhs} + ${e * f}x`,
      `${A + b * c - rhs} - ${b + e * f}x = 0`,
      `-${b + e * f}x = ${-(A + b * c - rhs)}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${e * f}x`, `- ${A + b * c}`, `: (${-(b + e * f)})`, ""]) };
  }),

  // T18: ax·bx - c = dx² + e - x(x+f)  (x² cancels)
  () => retry(() => {
    const xn = pickIntSolution();
    const a = ri(2, 4), b = ri(2, 4), d = ri(5, 9), f = ri(1, 3);
    const leftQuad = a * b;
    const rightQuad = d - 1;
    if (leftQuad !== rightQuad) return null;
    const c = ri(5, 12);
    const e2 = f * xn - c;
    const expr2 = `${a}x · ${b}x - ${c} = ${d}x² + ${e2} - x(x + ${f})`;
    const development2 = [
      `${leftQuad}x² - ${c} = ${d}x² + ${e2} - x² - ${f}x`,
      `${leftQuad}x² - ${c} = ${d - 1}x² + ${e2} - ${f}x`,
      `-${c} = ${e2} - ${f}x`,
      `-${c - e2} = -${f}x`,
      `x = ${xn}`,
    ];
    development2[3] = `-${c - e2} = -${f}x`;
    development2[4] = `x = ${xn}`;
    const sol = rat(xn, 1);
    return { expr: expr2, solution: sol, development: development2, operations: alignOps(development2, ["effectuer", "réduire", "- x²", "- 2", "· (-1)", ""]) };
  }),

  // T19: impossible — (A - bx) - (C - bx) = D
  () => {
    const b = ri(2, 5), A = ri(6, 12), C = ri(4, 10);
    let D = ri(5, 15);
    while (D === A - C) D = ri(5, 15);
    const expr = `(${A} - ${b}x) - (${C} - ${b}x) = ${D}`;
    const development = [
      `${A} - ${b}x - ${C} + ${b}x = ${D}`,
      `${A - C} = ${D}`,
      "impossible !",
    ];
    return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", "", ""]) };
  },

  // T20: p·(-qx) - a(b + cx) = d(1 - x) + ex
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const p = ri(3, 7), q = ri(2, 5), a = ri(2, 4), b = ri(1, 4), c = ri(2, 5), d = ri(3, 6), e = ri(1, 4);
    const leftCoef = -p * q - a * c;
    const rightCoef = -d + e;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const leftConst = -a * b;
    const rightConst = d;
    if (num !== rightConst - leftConst) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${p} · (-${q}x) - ${a}(${b} + ${c}x) = ${d}(1 - x) + ${e}x`;
    const development = [
      `-${p * q}x - ${a * b} - ${a * c}x = ${d} - ${d}x + ${e}x`,
      `${leftCoef}x - ${a * b} = ${d} + ${rightCoef}x`,
      `${coef}x - ${a * b} = ${d}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `${formatSideOp(-(rightCoef))}x`, `+ ${a * b}`, `: (${coef})`, ""]) };
  }),

  // T21: A·(-B) + C·(-Dx) = E·(-F) - G·(-x)
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const A = ri(4, 9), B = ri(2, 5), C = ri(3, 6), D = ri(2, 4);
    const E = ri(3, 7), F = ri(1, 3), G = ri(2, 5);
    const leftCoef = -C * D;
    const rightCoef = G;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const leftConst = -A * B;
    const rightConst = -E * F;
    if (num !== rightConst - leftConst) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${A} · (-${B}) + ${C} · (-${D}x) = ${E} · (-${F}) - ${G} · (-x)`;
    const development = [
      `-${A * B} - ${C * D}x = -${E * F} + ${G}x`,
      `-${A * B} - ${C * D + G}x = -${E * F}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", `- ${G}x`, `+ ${A * B}`, `: (${coef})`, ""]) };
  }),

  // T22: A - (Bx - C) - D = Ex·F + G
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const B = ri(2, 4), E = ri(4, 9), F = ri(2, 4);
    const leftCoef = -B;
    const rightCoef = E * F;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const A = ri(5, 12), C = ri(1, 3), D = ri(1, 2), G = ri(2, 8);
    const leftConst = A + C - D;
    const rightConst = G;
    if (num !== rightConst - leftConst) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${A} - (${B}x - ${C}) - ${D} = ${E}x · ${F} + ${G}`;
    const development = [
      `${A} - ${B}x + ${C} - ${D} = ${E * F}x + ${G}`,
      `${leftConst} - ${B}x = ${E * F}x + ${G}`,
      `${leftConst} - ${B + E * F}x = ${G}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${E * F}x`, `- ${leftConst}`, `: (${coef})`, ""]) };
  }),

  // T23: infinite — ax·b + c·(d+x) = e·(f+gx) + h + ix
  () => retry(() => {
    const a = ri(6, 12), b = ri(2, 4), c = ri(4, 9), d = ri(1, 4);
    const e = ri(2, 4), f = ri(2, 6), g = ri(8, 12);
    const h = ri(1, 4), i = ri(4, 9);
    const lc = a * b + c;
    const rc = e * g + i;
    if (lc !== rc) return null;
    const leftK = c * d;
    const rightK = e * f + h;
    if (leftK !== rightK) return null;
    const expr = `${a}x · ${b} + ${c} · (${d} + x) = ${e} · (${f} + ${g}x) + ${h} + ${i}x`;
    const development = [
      `${a * b}x + ${c * d} + ${c}x = ${e * f} + ${e * g}x + ${h} + ${i}x`,
      `${lc}x + ${leftK} = ${rc}x + ${rightK}`,
      `${leftK} = ${rightK}`,
      "infini",
    ];
    return { expr, solution: INF, development, operations: alignOps(development, ["effectuer", "réduire", `- ${rc}x`, "", ""]) };
  }),

  // T24: impossible — (x-a)·b + c = d·(ex+f) - g
  () => retry(() => {
    const a = ri(2, 5), b = ri(6, 12), c = ri(1, 4);
    const d = ri(3, 7), e = ri(2, 4), g = ri(1, 3);
    const coef = b - d * e;
    if (coef !== 0) return null;
    const lc = -a * b + c;
    let f = ri(2, 6);
    while (lc === d * f - g) f = ri(2, 6);
    const rc2 = d * f - g;
    const expr = `(x - ${a}) · ${b} + ${c} = ${d} · (${e}x + ${f}) - ${g}`;
    const development = [
      `${b}x - ${a * b} + ${c} = ${d * e}x + ${d * f} - ${g}`,
      `${b}x - ${a * b - c} = ${d * e}x + ${d * f - g}`,
      `${lc} = ${rc2}`,
      "impossible !",
    ];
    return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", `- ${d * e}x`, "", ""]) };
  }),

  // T25: impossible — A - (B - cx) = d(x+e) - f
  () => retry(() => {
    const c = ri(2, 5), d = ri(2, 4);
    const coef = c - d;
    if (coef !== 0) return null;
    const A = ri(5, 12), B = ri(8, 14), e = ri(2, 6), f = ri(1, 4);
    const lc = A - B;
    const rc = d * e - f;
    if (lc === rc) return null;
    const expr = `${A} - (${B} - ${c}x) = ${d}(x + ${e}) - ${f}`;
    const development = [
      `${A} - ${B} + ${c}x = ${d}x + ${d * e} - ${f}`,
      `${lc} + ${c}x = ${d}x + ${rc}`,
      `${lc} = ${rc}`,
      "impossible !",
    ];
    return { expr, solution: IMP, development, operations: alignOps(development, ["effectuer", "réduire", `- ${d}x`, "", ""]) };
  }),

  // T26: (x-a) - (bx+c) = d·(-ex)
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(4, 9), b = ri(5, 10), c = ri(4, 8), d = ri(2, 4), e = ri(3, 6);
    const leftCoef = 1 - b;
    const rightCoef = -d * e;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const constL = -a - c;
    const num = coef * xn / xd;
    if (!Number.isInteger(num) || num !== -constL) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `(x - ${a}) - (${b}x + ${c}) = ${d} · (-${e}x)`;
    const development = [
      `x - ${a} - ${b}x - ${c} = -${d * e}x`,
      `${leftCoef}x - ${a + c} = -${d * e}x`,
      `-${a + c} = ${rightCoef - leftCoef}x`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `${formatSideOp(-(leftCoef))}x`, `: (${rightCoef - leftCoef})`, ""]) };
  }),

  // T27: infinite — ax·bx - x + c = ax(x-d)+ex + c (x² cancels)
  () => retry(() => {
    const a = ri(2, 4), b = ri(2, 4), d = ri(1, 3);
    const ab = a * b;
    const c = ri(1, 4);
    const inner = ab - a * d;
    const expr2 = `${a}x · ${b}x - x + ${c} = ${ab}x(x - ${d}) + ${inner}x + ${c}`;
    const development = [
      `${ab}x² - x + ${c} = ${ab}x² - ${a * d}x + ${inner}x + ${c}`,
      `${ab}x² - x + ${c} = ${ab}x² - x + ${c}`,
      `${c} = ${c}`,
      "infini",
    ];
    if (inner !== 1) return null;
    return { expr: expr2, solution: INF, development, operations: alignOps(development, ["effectuer", "réduire", "- x²", "+ x", ""]) };
  }),

  // T28: (x-a)·(-b) - c(d+x) = 0
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(2, 5), b = ri(2, 4), c = ri(3, 6), d = ri(3, 8);
    const coef = -b - c;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const constL = a * b - c * d;
    if (num !== -constL) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `(x - ${a}) · (-${b}) - ${c}(${d} + x) = 0`;
    const development = [
      `-${b}x + ${a * b} - ${c * d} - ${c}x = 0`,
      `${coef}x + ${constL} = 0`,
      `${coef}x = ${-constL}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", formatSideOp(-(constL)), `: (${coef})`, ""]) };
  }),

  // T29: (ax-b)·c - d(x+e) = f·(-g)
  () => retry(() => {
    const xn = pickIntSolution();
    if (xn === 0) return null;
    const a = ri(4, 9), c = ri(2, 4), d = ri(2, 4), e = ri(2, 6), f = ri(2, 4), g = ri(5, 10);
    const coef = a * c - d;
    if (coef === 0) return null;
    const rhs = f * g;
    const b = (coef * xn + d * e + rhs) / c;
    if (!Number.isInteger(b) || b < 2 || b > 20) return null;
    const sol = rat(xn, 1);
    const expr = `(${a}x - ${b}) · ${c} - ${d}(x + ${e}) = ${f} · (-${g})`;
    const development = [
      `${a * c}x - ${b * c} - ${d}x - ${d * e} = -${rhs}`,
      `${coef}x - ${b * c + d * e} = -${rhs}`,
      `${coef}x = ${coef * xn}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `+ ${b * c + d * e}`, `: ${coef}`, ""]) };
  }),

  // T30: (x-a)·(-b) - c = (x+d)·e + x
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(4, 9), b = ri(2, 4), d = ri(1, 4), e = ri(2, 4);
    const c = ri(1, 4);
    const leftCoef = -b;
    const rightCoef = e + 1;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const constL = a * b - c;
    const constR = d * e;
    const num = coef * xn / xd;
    if (!Number.isInteger(num) || num !== constR - constL) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `(x - ${a}) · (-${b}) - ${c} = (x + ${d}) · ${e} + x`;
    const development = [
      `-${b}x + ${a * b} - ${c} = ${e}x + ${d * e} + x`,
      `-${b}x + ${constL} = ${rightCoef}x + ${constR}`,
      `${coef}x + ${constL} = ${constR}`,
      `${coef}x = ${num + constL}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `- ${rightCoef}x`, `- ${constL}`, `: (${coef})`, ""]) };
  }),

  // T31: ax·b - c·dx = A - (B + ex)
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(2, 4), b = ri(2, 4), c = ri(2, 5), d = ri(3, 6);
    const e = ri(3, 6);
    const leftCoef = a * b - c * d;
    const rightCoef = -e;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const A = ri(6, 12), B = ri(2, 6);
    const constR = A - B;
    if (num !== constR) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x · ${b} - ${c} · ${d}x = ${A} - (${B} + ${e}x)`;
    const development = [
      `${a * b}x - ${c * d}x = ${A} - ${B} - ${e}x`,
      `${leftCoef}x = ${constR} - ${e}x`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `+ ${e}x`, `: (${coef})`, ""]) };
  }),

  // T32: ax·(-b) - cx = dx + e - fx + g
  () => retry(() => {
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(3, 7), b = ri(2, 4), c = ri(2, 5);
    const d = ri(1, 4), f = ri(4, 8), g = ri(2, 6);
    const leftCoef = -a * b - c;
    const rightCoef = d - f;
    const coef = leftCoef - rightCoef;
    if (coef === 0) return null;
    const num = coef * xn / xd;
    if (!Number.isInteger(num)) return null;
    const e = ri(4, 12);
    const constR = e + g;
    if (num !== constR) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${a}x · (-${b}) - ${c}x = ${d}x + ${e} - ${f}x + ${g}`;
    const development = [
      `-${a * b}x - ${c}x = ${d - f}x + ${e + g}`,
      `${leftCoef}x = ${rightCoef}x + ${constR}`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: alignOps(development, ["effectuer", "réduire", `${formatSideOp(-(rightCoef))}x`, `: (${coef})`, ""]) };
  }),
];


// ── A10.2 fraction equations (30 templates) ─────────────────────────────────

function pickXInt(): number {
  return pickIntSolution();
}

function intDiv(num: number, den: number): number | null {
  if (num % den !== 0) return null;
  return num / den;
}

/** q such that (xn-a)/d1 - 1 = (p·xn+q)/d2 */
function solveQ_T2(d1: number, d2: number, xn: number, a: number, p: number): number | null {
  return intDiv(d2 * (xn - a) - d1 * d2 - p * xn * d1, d1);
}

/** c such that (ax-b)/d1 = (c-dx)/d2 at x = x0 */
function solveC_T3(d1: number, d2: number, a: number, b: number, d: number, x0: number): number | null {
  return intDiv(d2 * (a * x0 - b) + d * x0 * d1, d1);
}

/** a such that (a-bx)/d1 + n/d2 = x/d3 at x = x0 */
function solveA_T5(d1: number, d2: number, d3: number, b: number, n: number, x0: number): number | null {
  return intDiv(b * x0 * d1 + x0 * d1 * d3 - n * d1 * d3, d3);
}

const _legacyA102FracGens: Array<() => EquationQuestion> = [
  // T1: -x/d1 + n2/d2 = n3/d3·x - n4/d2
  () => retry(() => {
    const d1 = ri(2, 5), d2 = ri(3, 7), d3 = ri(2, 5);
    const mult = lcm(lcm(d1, d2), d3);
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const n2 = ri(1, 6), n3 = ri(1, 4), n4 = ri(2, 8);
    const coef = -mult / d1 - (n3 * mult) / d3;
    if (coef === 0) return null;
    const xVal = xn / xd;
    const rhs = coef * xVal + (n4 * mult) / d2 - (n2 * mult) / d2;
    if (!Number.isInteger(rhs)) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `- ${f("x", d1)} + ${f(n2, d2)} = ${f(n3, d3)} x - ${f(n4, d2)}`;
    const development = [
      `${f(String(-mult / d1) + "x", mult)} + ${f(n2 * mult / d2, mult)} = ${f(String(n3 * mult / d3) + "x", mult)} - ${f(n4 * mult / d2, mult)}`,
      `${-mult / d1}x + ${n2 * mult / d2} = ${n3 * mult / d3}x - ${n4 * mult / d2}`,
      `${coef}x + ${n2 * mult / d2} = -${n4 * mult / d2}`,
      `${coef}x = ${rhs}`,
      `x = ${sol.den === 1 ? sol.num : f(sol.num, sol.den)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${n3 * mult / d3}x`, `- ${n2 * mult / d2}`, `: ${coef}`, ""], development) };
  }),

  // T2: (x-a)/d1 - 1 = (px+q)/d2
  () => retry(() => {
    const d1 = ri(2, 5), d2 = ri(3, 7), mult = lcm(d1, d2);
    const xn = pickXInt();
    const a = ri(2, 8), p = ri(1, 3);
    const q = solveQ_T2(d1, d2, xn, a, p);
    if (q === null || Math.abs(q) > 30) return null;
    const sol = rat(xn, 1);
    if (!okRat(sol)) return null;
    const expr = `${f("x - " + a, d1)} - 1 = ${f(p + "x + " + q, d2)}`;
    const lhsConst = d2 * a + d1;
    const coef = d2 - p * d2;
    const rhsConst = q * d2;
    const development = [
      `${f(d2 + "x - " + lhsConst, mult)} = ${f(p * d2 + "x + " + rhsConst, mult)}`,
      `${d2}x - ${lhsConst} = ${p * d2}x + ${rhsConst}`,
      `${coef}x - ${lhsConst} = ${rhsConst}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${p * d2}x`, `+ ${lhsConst}`, `: ${coef}`, ""], development) };
  }),

  // T3: (ax-b)/d1 - (c-dx)/d2 = 0
  () => retry(() => {
    const d1 = 2, d2 = ri(5, 9), mult = lcm(d1, d2);
    const x0 = pickXInt();
    const a = ri(1, 3), b = ri(2, 8), d = ri(2, 5);
    const c = solveC_T3(d1, d2, a, b, d, x0);
    if (c === null || c < 1 || c > 20) return null;
    const coef = (a * mult) / d1 + (d * mult) / d2;
    const constL = (-b * mult) / d1 - (c * mult) / d2;
    const num = coef * x0;
    if (!Number.isInteger(num) || num !== -constL) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(a + "x - " + b, d1)} - ${f(c + " - " + d + "x", d2)} = 0`;
    const development = [
      `${f(a * mult / d1 + "x - " + b * mult / d1, mult)} - ${f(c * mult / d2 + " - " + d * mult / d2 + "x", mult)} = ${f("0", mult)}`,
      `${a * mult / d1}x - ${b * mult / d1} - ${c * mult / d2} + ${d * mult / d2}x = 0`,
      `${coef}x - ${-constL} = 0`,
      `${coef}x = ${num}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [formatSideOp(-(constL)), `: ${coef}`, ""], development) };
  }),

  // T4: n1/d1·x - x/d2 = integer
  () => retry(() => {
    const d1 = 4, d2 = 2, mult = 4, n1 = 3;
    const xn = ri(8, 30);
    const sol = rat(xn, 1);
    const expr = `${f(n1, d1)} x - ${f("x", d2)} = ${xn}`;
    const development = [
      `${f(n1 + "x", mult)} - ${f("2x", mult)} = ${f(String(xn), mult)}`,
      `${n1}x - 2x = ${xn}`,
      `x = ${xn}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [""], development) };
  }),

  // T5: (a-bx)/d1 + n/d2 = x/d3
  () => retry(() => {
    const d1 = ri(7, 11), d2 = 2, d3 = 4, mult = lcm(lcm(d1, d2), d3);
    const x0 = pickXInt();
    const b = ri(5, 10), n = ri(1, 4);
    const a = solveA_T5(d1, d2, d3, b, n, x0);
    if (a === null || a < 10 || a > 40) return null;
    const coef = (-b * mult) / d1 - mult / d3;
    const constL = (a * mult) / d1 + (n * mult) / d2;
    const num = coef * x0;
    if (!Number.isInteger(num) || num !== -constL) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(a + " - " + b + "x", d1)} + ${f(n, d2)} = ${f("x", d3)}`;
    const development = [
      `${f(a * mult / d1 + " - " + b * mult / d1 + "x", mult)} + ${f(n * mult / d2, mult)} = ${f(mult / d3 + "x", mult)}`,
      `${a * mult / d1} - ${b * mult / d1}x + ${n * mult / d2} = ${mult / d3}x`,
      `${constL} = ${-coef}x`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`${formatSideOp(-(coef))}x`, `: ${-coef}`, ""], development) };
  }),

  // T6: kx + n/d1 = A - (B-cx)/d2
  () => retry(() => {
    const d1 = 5, d2 = 6, mult = 30;
    const x0 = pickXInt();
    const k = ri(6, 10), n = ri(1, 4), B = ri(5, 10), c = ri(2, 4);
    const A = Math.round(k * x0 + n / d1 + (B - c * x0) / d2);
    const coef = k * mult + (c * mult) / d2;
    const constR = A * mult - B * mult / d2 + n * mult / d1;
    const num = coef * x0;
    if (!Number.isInteger(num) || num !== constR) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${k}x + ${f(n, d1)} = ${A} - ${f(B + " - " + c + "x", d2)}`;
    const development = [
      `${f(k * mult + "x", mult)} + ${f(n * mult / d1, mult)} = ${f(A * mult, mult)} - ${f(B * mult / d2 + " - " + c * mult / d2 + "x", mult)}`,
      `${k * mult}x + ${n * mult / d1} = ${A * mult} - ${B * mult / d2} + ${c * mult / d2}x`,
      `${coef}x + ${n * mult / d1} = ${constR}`,
      `${coef}x = ${num - n * mult / d1}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${c * mult / d2}x`, `- ${n * mult / d1}`, `: ${coef}`, ""], development) };
  }),

  // T7: 1 - (px+q)/d1 = n/d2
  () => retry(() => {
    const d1 = 2, d2 = 2, mult = 2;
    const xn = pickIntSolution();
    const p = ri(1, 3), q = ri(2, 6);
    const n = 2 * (1 - (p * xn + q) / d1);
    if (!Number.isInteger(n)) return null;
    const sol = rat(xn, 1);
    const expr = `1 - ${f(p + "x + " + q, d1)} = ${f(n, d2)}`;
    const development = [
      `${f("2", d1)} - ${f(p + "x + " + q, d1)} = ${f(n, d2)}`,
      `2 - ${p}x - ${q} = ${n}`,
      `-${p}x = ${n - 2 + q}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["+ 1", `: (${-p})`, ""], development) };
  }),

  // T8: A = n/d1 - (px-q)/d2
  () => retry(() => {
    const d1 = 4, d2 = 5, mult = 20;
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const p = ri(6, 10), q = ri(2, 6), n = 3;
    const A = Math.round(n * mult / d1 - (p * mult / d2) * (xn / xd) + q * mult / d2);
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${A} = ${f(n, d1)} - ${f(p + "x - " + q, d2)}`;
    const development = [
      `${f(String(A), mult)} = ${f(n * mult / d1, mult)} - ${f(p * mult / d2 + "x - " + q * mult / d2, mult)}`,
      `${A} = ${n * mult / d1} - ${p * mult / d2}x + ${q * mult / d2}`,
      `${A - n * mult / d1 - q * mult / d2} = -${p * mult / d2}x`,
      `x = ${sol.den === 1 ? sol.num : f(sol.num, sol.den)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${n * mult / d1 + q * mult / d2}`, `: -${p * mult / d2}`, ""], development) };
  }),

  // T9: kx - (a-x)/d = (x+b)/d2 - c
  () => retry(() => {
    const d = 2, d2 = 3, mult = 6;
    const x0 = pickXInt();
    const k = ri(5, 8), b = ri(2, 6), c = 1;
    const a = Math.round(x0 + d * (k * x0 - (x0 + b) / d2 + c));
    const coef = k * mult + mult / d - mult / d2;
    const constL = (-a * mult) / d;
    const constR = (b * mult) / d2 - c * mult;
    const num = coef * x0;
    if (!Number.isInteger(num) || num !== constR - constL) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${k}x - ${f(a + " - x", d)} = ${f("x + " + b, d2)} - ${c}`;
    const development = [
      `${f(k * mult + "x", mult)} - ${f(a * mult / d + " - " + mult / d + "x", mult)} = ${f(mult / d2 + "x + " + b * mult / d2, mult)} - ${f(c * mult, mult)}`,
      `${k * mult}x - ${a * mult / d} + ${mult / d}x = ${mult / d2}x + ${b * mult / d2} - ${c * mult}`,
      `${constL} = ${-coef}x`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${k * mult}x`, `: (${-coef})`, ""], development) };
  }),

  // T10: (x-a)/d1 = (x+b)/d2
  () => retry(() => {
    const d1 = 3, d2 = 9, mult = 9;
    const x0 = pickXInt();
    const b = ri(1, 5);
    const a = intDiv(x0 * (d2 - d1) - d1 * b, d2);
    if (a === null || a < 1 || a > 12) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f("x - " + a, d1)} = ${f("x + " + b, d2)}`;
    const development = [
      `${f(d2 + "x - " + d2 * a, mult)} = ${f(d1 + "x + " + d1 * b, mult)}`,
      `${d2}x - ${d2 * a} = ${d1}x + ${d1 * b}`,
      `${d2 - d1}x - ${d2 * a} = ${d1 * b}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["- x", `+ ${d2 * a}`, `: ${d2 - d1}`, ""], development) };
  }),

  // T11: kx - n/d1·x = m/d2·x + c
  () => retry(() => {
    const d1 = 7, d2 = 4, mult = 28, k = 5, n = 1, m = 3;
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const coef = k * mult - (n * mult) / d1 - (m * mult) / d2;
    const c = coef * xn / xd;
    if (!Number.isInteger(c)) return null;
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${k}x - ${f(n, d1)} x = ${f(m, d2)} x + ${c}`;
    const development = [
      `${f(k * mult + "x", mult)} - ${f(n * mult / d1 + "x", mult)} = ${f(m * mult / d2 + "x", mult)} + ${f(c, mult)}`,
      `${k * mult}x - ${n * mult / d1}x = ${m * mult / d2}x + ${c}`,
      `${coef}x = ${c}`,
      `x = ${sol.den === 1 ? sol.num : f(sol.num, sol.den)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${m * mult / d2}x`, `: ${coef}`, ""], development) };
  }),

  // T12: (ax-b)/d1 = -x + n/d2
  () => retry(() => {
    const d1 = 3, d2 = 11, mult = 33, a = 2;
    const x0 = pickXInt();
    const n = ri(1, 8);
    const bPart = intDiv(d1 * n, d2);
    if (bPart === null) return null;
    const b = a * x0 + d1 * x0 - bPart;
    if (!Number.isInteger(b) || b < 5 || b > 20) return null;
    const coef = (a * mult) / d1 + mult;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(a + "x - " + b, d1)} = -x + ${f(n, d2)}`;
    const development = [
      `${f(a * mult / d1 + "x - " + b * mult / d1, mult)} = ${f("-33x", mult)} + ${f(n * mult / d2, mult)}`,
      `${a * mult / d1}x - ${b * mult / d1} = -${mult}x + ${n * mult / d2}`,
      `${coef}x - ${b * mult / d1} = ${n * mult / d2}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["+ 33x", `+ ${b * mult / d1}`, `: ${coef}`, ""], development) };
  }),

  // T13: (x-a)/d1 - (-b+cx)/d2 = n/d3·x
  () => retry(() => {
    const d1 = 7, d2 = 6, d3 = 2, mult = 42;
    const x0 = pickXInt();
    const a = ri(4, 10), b = ri(5, 10), c = ri(1, 3), n = 1;
    const coef = mult / d1 - (c * mult) / d2 - (n * mult) / d3;
    const constL = (-a * mult) / d1 + (b * mult) / d2;
    const num = coef * x0;
    if (!Number.isInteger(num) || num !== -constL) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f("x - " + a, d1)} - ${f("-" + b + " + " + c + "x", d2)} = ${f(n, d3)} x`;
    const development = [
      `${f(mult / d1 + "x - " + a * mult / d1, mult)} - ${f("-" + b * mult / d2 + " + " + c * mult / d2 + "x", mult)} = ${f(n * mult / d3 + "x", mult)}`,
      `${mult / d1}x - ${a * mult / d1} + ${b * mult / d2} - ${c * mult / d2}x = ${n * mult / d3}x`,
      `${constL} = ${-coef}x`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${mult / d1 - c * mult / d2 - n * mult / d3}x`, `: ${coef}`, ""], development) };
  }),

  // T14: A = B + (a-bx)/d
  () => retry(() => {
    const d = 3, mult = 3;
    const { num: xn, den: xd } = pickCoprimeNumDen();
    const a = ri(3, 8), b = ri(2, 5), B = ri(15, 30);
    const A = Math.round(B + (a - b * (xn / xd)));
    const sol = rat(xn, xd);
    if (!okRat(sol)) return null;
    const expr = `${A} = ${B} + ${f(a + " - " + b + "x", d)}`;
    const development = [
      `${f(String(A), mult)} = ${f(String(B), mult)} + ${f(a * mult / d + " - " + b * mult / d + "x", mult)}`,
      `${A} = ${B} + ${a} - ${b}x`,
      `${A - B - a} = -${b}x`,
      `x = ${sol.den === 1 ? sol.num : f(sol.num, sol.den)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${B}`, `: (-${b})`, ""], development) };
  }),

  // T15: n1/d1 - n2/d2·x = n3/d1 - n4/d2·x
  () => retry(() => {
    const d1 = 7, d2 = 2, mult = 14;
    const x0 = pickXInt();
    const n2 = 1, n3 = 3, n4 = 3;
    const coef = (-n2 * mult) / d2 + (n4 * mult) / d2;
    const n1 = n3 + intDiv(d1 * (n2 - n4) * x0, d2)!;
    if (!Number.isInteger(n1) || n1 < 5 || n1 > 30) return null;
    const constL = (n1 * mult) / d1;
    const constR = (n3 * mult) / d1;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} - ${f(n4, d2)} x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult / d1, mult)} - ${f(n4 * mult / d2 + "x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult / d1} - ${n4 * mult / d2}x`,
      `${constL} + ${coef}x = ${constR}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`${formatSideOp(-(coef))}x`, `- ${constL}`, `: ${coef}`, ""], development) };
  }),

  // T16: (x-a)/d1 = (b-cx)/d2
  () => retry(() => {
    const d1 = 3, d2 = 10, mult = 30;
    const x0 = pickXInt();
    const a = ri(1, 4), c = ri(2, 5);
    const b = intDiv(d2 * (x0 - a) + c * x0 * d1, d1);
    if (b === null || b < 5 || b > 20) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const coef = d2 + c * d1;
    const expr = `${f("x - " + a, d1)} = ${f(b + " - " + c + "x", d2)}`;
    const development = [
      `${f("10x - " + 10 * a, mult)} = ${f("3x + " + 3 * b + " - " + 3 * c + "x", mult)}`,
      `10x - ${10 * a} = ${3 * b} - ${3 * c}x`,
      `${coef}x - ${10 * a} = ${3 * b}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${3 * c}x`, `+ ${10 * a}`, `: ${coef}`, ""], development) };
  }),

  // T17: kx - n/d1 = n2/d2 + x
  () => retry(() => {
    const d1 = 8, d2 = 3, mult = 24, k = 5, n = 3;
    const x0 = pickXInt();
    const n2Num = d2 * (k - 1) * x0 * d1 - n * d2;
    const n2 = intDiv(n2Num, d1);
    if (n2 === null || n2 < 1 || n2 > 10) return null;
    const coef = (k - 1) * mult;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${k}x - ${f(n, d1)} = ${f(n2, d2)} + x`;
    const development = [
      `${f(k * mult + "x", mult)} - ${f(n * mult / d1, mult)} = ${f(n2 * mult / d2, mult)} + ${f("24x", mult)}`,
      `${k * mult}x - ${n * mult / d1} = ${n2 * mult / d2} + ${mult}x`,
      `${coef}x - ${n * mult / d1} = ${n2 * mult / d2}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["- 24x", `+ ${n * mult / d1}`, `: ${coef}`, ""], development) };
  }),

  // T18: (ax-b)/d1 = (x+c)/d2
  () => retry(() => {
    const d1 = 2, d2 = 8, mult = 8;
    for (let t = 0; t < 30; t++) {
      const xn = ri(2, 12);
      const a = ri(8, 15), c = ri(3, 10);
      const bNum = a * xn * d2 - (xn + c) * d1;
      if (bNum % d2 !== 0) continue;
      const b = bNum / d2;
      if (b < 1 || b > 25) continue;
      const sol = rat(xn, 1);
      if (!okRat(sol)) continue;
      const expr = `${f(a + "x - " + b, d1)} = ${f("x + " + c, d2)}`;
      const development = [
        `${f(a * mult / d1 + "x - " + b * mult / d1, mult)} = ${f("x + " + c, d2)}`,
        `${a * mult / d1}x - ${b * mult / d1} = x + ${c}`,
        `${a * mult / d1 - 1}x - ${b * mult / d1} = ${c}`,
        `x = ${solText(sol)}`,
      ];
      return { expr, solution: sol, development, operations: commonOps(mult, ["- x", `+ ${b * mult / d1}`, `: ${a * mult / d1 - 1}`, ""], development) };
    }
    return null;
  }),

  // T19: A - (px+q)/d1 = n/d2·x + c
  () => retry(() => {
    const d1 = 5, d2 = 4, mult = 20;
    const x0 = pickXInt();
    const p = 2, q = 3, n = 1, c = 2;
    const A = Math.round((p * x0 + q) / d1 + (n / d2) * x0 + c);
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const coef = -p * mult / d1 - n * mult / d2;
    const expr = `${A} - ${f(p + "x + " + q, d1)} = ${f(n, d2)} x + ${c}`;
    const development = [
      `${f(String(A * mult), mult)} - ${f(p * mult / d1 + "x + " + q * mult / d1, mult)} = ${f(n * mult / d2 + "x", mult)} + ${f(c * mult, mult)}`,
      `${A * mult} - ${p * mult / d1}x - ${q * mult / d1} = ${n * mult / d2}x + ${c * mult}`,
      `${A * mult - q * mult / d1 - c * mult} - ${p * mult / d1 + n * mult / d2}x = 0`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${n * mult / d2}x`, `- ${A * mult - q * mult / d1}`, `: (${coef})`, ""], development) };
  }),

  // T20: kx - n/d1 = n2/d2 + px
  () => retry(() => {
    const d1 = 2, d2 = 2, mult = 2, k = 5, n = 3, p = 2;
    const x0 = pickXInt();
    const n2Num = d2 * ((k - p) * x0 * d1 - n);
    const n2 = intDiv(n2Num, d1);
    if (n2 === null || n2 < 1 || n2 > 12) return null;
    const coef = k - p;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${k}x - ${f(n, d1)} = ${f(n2, d2)} + ${p}x`;
    const development = [
      `${f(k + "x", mult)} - ${f(n, mult)} = ${f(n2, mult)} + ${f(p + "x", mult)}`,
      `${k}x - ${n} = ${n2} + ${p}x`,
      `${coef}x - ${n} = ${n2}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${p}x`, `+ ${n}`, `: ${coef}`, ""], development) };
  }),

  // T21: n1/d1 - n2/d2·x = n3 + px
  () => retry(() => {
    const d1 = 5, d2 = 2, mult = 10, n2 = 3, n3 = 7, p = 5;
    const x0 = pickXInt();
    const n1Part = intDiv(n2 * d1 * x0, d2);
    if (n1Part === null) return null;
    const n1Num = d1 * n3 + d1 * p * x0 + n1Part;
    if (!Number.isInteger(n1Num)) return null;
    const n1 = n1Num;
    if (n1 < 5 || n1 > 40) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${n3} + ${p}x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult, mult)} + ${f(p + "x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult} + ${p * mult}x`,
      `-${n2 * mult / d2 + p * mult}x = ${n3 * mult - n1 * mult / d1}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${p * mult}x`, `- ${n1 * mult / d1}`, `: (-${Math.abs(n2 * mult / d2 + p * mult)})`, ""], development) };
  }),

  // T22: n1/d1 - n2/d2·x = n3/d1 + px
  () => retry(() => {
    const d1 = 7, d2 = 2, mult = 14, n2 = 14, n3 = 6, p = 7;
    const x0 = pickXInt();
    const n1Part = intDiv(n2 * x0 * d1, d2);
    if (n1Part === null) return null;
    const n1 = n3 + p * x0 * d1 + n1Part;
    if (n1 < 5 || n1 > 50) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} + ${p}x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult / d1, mult)} + ${f(p + "x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult / d1} + ${p * mult}x`,
      `-${n2 * mult / d2 + p * mult}x = ${n3 * mult / d1 - n1 * mult / d1}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${n2 * mult / d2}x`, `: ${-n2 * mult / d2 - p * mult}`, ""], development) };
  }),

  // T23: kx - n/d1 = n2/d2 + px (variant)
  () => retry(() => {
    const d1 = 5, d2 = 3, mult = 15, k = 4, n = 1, p = 1;
    const x0 = pickXInt();
    const n2Num = d2 * ((k - p) * x0 * d1 - n);
    const n2 = intDiv(n2Num, d1);
    if (n2 === null || n2 < 1 || n2 > 12) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${k}x - ${f(n, d1)} = ${f(n2, d2)} + x`;
    const development = [
      `${f(k * mult + "x", mult)} - ${f(n * mult / d1, mult)} = ${f(n2 * mult / d2, mult)} + ${f("15x", mult)}`,
      `${k * mult}x - ${n * mult / d1} = ${n2 * mult / d2} + ${mult}x`,
      `${(k - 1) * mult}x - ${n * mult / d1} = ${n2 * mult / d2}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["- 15x", `+ ${n * mult / d1}`, `: ${(k - 1) * mult}`, ""], development) };
  }),

  // T24: n1/d1 - n2/d2·x = n3/d1 + px (simplified shape)
  () => retry(() => {
    const d1 = 3, d2 = 2, mult = 6, n2 = 5, n3 = 2, p = 3;
    const x0 = pickXInt();
    const n1Part = intDiv(n2 * x0 * d1, d2);
    if (n1Part === null) return null;
    const n1 = n3 + p * x0 * d1 + n1Part;
    if (n1 < 2 || n1 > 30) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} + ${p}x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult / d1, mult)} + ${f(p + "x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult / d1} + ${p * mult}x`,
      `-${n2 * mult / d2 + p * mult}x = ${n3 * mult / d1 - n1 * mult / d1}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`- ${p * mult}x`, `- ${n1 * mult / d1}`, `: (-${Math.abs(n2 * mult / d2 + p * mult)})`, ""], development) };
  }),

  // T25: (ax-b)/d1 + n/d2 = rhs
  () => retry(() => {
    const d1 = 3, d2 = 4, mult = 12;
    const x0 = pickXInt();
    const a = 7, b = 2, n = 1;
    const rhsNum = (a * x0 - b) * mult / d1 + n * mult / d2;
    if (!Number.isInteger(rhsNum) || rhsNum % mult !== 0) return null;
    const rhs = rhsNum / mult;
    if (rhs < 1 || rhs > 15) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(a + "x - " + b, d1)} + ${f(n, d2)} = ${rhs}`;
    const development = [
      `${f(a * mult / d1 + "x - " + b * mult / d1, mult)} + ${f(n * mult / d2, mult)} = ${f(rhs * mult, mult)}`,
      `${a * mult / d1}x - ${b * mult / d1} + ${n * mult / d2} = ${rhs * mult}`,
      `${a * mult / d1}x - ${b * mult / d1 - n * mult / d2} = ${rhs * mult}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${b * mult / d1 - n * mult / d2}`, `: ${a * mult / d1}`, ""], development) };
  }),

  // T26: A - n/d1·x = n2/d2 + x
  () => retry(() => {
    const d1 = 5, d2 = 3, mult = 15, n = 1, n2 = 2;
    const x0 = pickXInt();
    const ANum = x0 * d1 * d2 + n2 * d1 + n * x0 * d2;
    if (ANum % (d1 * d2) !== 0) return null;
    const A = ANum / (d1 * d2);
    if (A < 2 || A > 20) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${A} - ${f(n, d1)} x = ${f(n2, d2)} + x`;
    const development = [
      `${f(A * mult, mult)} - ${f(n * mult / d1 + "x", mult)} = ${f(n2 * mult / d2, mult)} + ${f("15x", mult)}`,
      `${A * mult} - ${n * mult / d1}x = ${n2 * mult / d2} + ${mult}x`,
      `${A * mult - n2 * mult / d2} - ${n * mult / d1 + mult}x = 0`,
      `x = ${solText(sol)}`,
    ];
    const coef = -(n * mult / d1 + mult);
    return { expr, solution: sol, development, operations: commonOps(mult, ["- 15x", `- ${A * mult - n2 * mult / d2}`, `: (${coef})`, ""], development) };
  }),

  // T27: n1/d1 - n2/d2·x = n3/d1 - n4/d2·x (variant coef)
  () => retry(() => {
    const d1 = 3, d2 = 5, mult = 15, n2 = 5, n3 = 2, n4 = 3;
    const x0 = pickXInt();
    const n1Num = n3 * d2 + (n4 - n2) * x0 * d1;
    const n1 = intDiv(n1Num, d2);
    if (n1 === null || n1 < 3 || n1 > 30) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} - ${f(n4, d2)} x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult / d1, mult)} - ${f(n4 * mult / d2 + "x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult / d1} - ${n4 * mult / d2}x`,
      `${n1 * mult / d1 - n3 * mult / d1} = ${(n4 - n2) * mult / d2}x`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${n4 * mult / d2}x`, `- ${n1 * mult / d1 - n3 * mult / d1}`, `: ${(n4 - n2) * mult / d2}`, ""], development) };
  }),

  // T28: (x-a)/d1 + (bx-c)/d2 = 1
  () => retry(() => {
    const d1 = 3, d2 = 5, mult = 15;
    const x0 = pickXInt();
    const a = 2, b = 2;
    const cNum = b * x0 * d1 + (x0 - a) * d2 - d1 * d2;
    const c = intDiv(cNum, d1);
    if (c === null || c < 1 || c > 20) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f("x - " + a, d1)} + ${f(b + "x - " + c, d2)} = 1`;
    const development = [
      `${f("5x - " + 5 * a, mult)} + ${f("3x - " + 3 * c, mult)} = ${f("15", mult)}`,
      `5x - ${5 * a} + 3x - ${3 * c} = 15`,
      `${5 + 3 * b}x - ${5 * a + 3 * c} = 15`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${5 * a + 3 * c}`, `: ${5 + 3 * b}`, ""], development) };
  }),

  // T29: n1/d1 - n2/d2·x = n3/d1 + px (neg coef)
  () => retry(() => {
    const d1 = 5, d2 = 3, mult = 15, n2 = 3, n3 = 10;
    const x0 = pickXInt();
    const n1Part = intDiv(n2 * x0 * d1, d2);
    if (n1Part === null) return null;
    const n1 = n3 + d1 * x0 + n1Part;
    if (!Number.isInteger(n1) || n1 < 5 || n1 > 40) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} + x`;
    const development = [
      `${f(n1 * mult / d1, mult)} - ${f(n2 * mult / d2 + "x", mult)} = ${f(n3 * mult / d1, mult)} + ${f("15x", mult)}`,
      `${n1 * mult / d1} - ${n2 * mult / d2}x = ${n3 * mult / d1} + ${mult}x`,
      `-${n2 * mult / d2 + mult}x = ${n3 * mult / d1 - n1 * mult / d1}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, ["- 15x", `- ${n1 * mult / d1}`, `: (${-(n2 * mult / d2 + mult)})`, ""], development) };
  }),

  // T30: n1/d1 - n2/d2·x = n3/d1 - n4/d2·x + c  (same as balanced form)
  () => retry(() => {
    const d1 = 3, d2 = 5, mult = 15, n2 = 5, n3 = 2, n4 = 3;
    const x0 = pickXInt();
    const n1Num = n3 * d2 + (n4 - n2) * x0 * d1;
    const n1 = intDiv(n1Num, d2);
    if (n1 === null || n1 < 3 || n1 > 30) return null;
    const sol = rat(x0, 1);
    if (!okRat(sol)) return null;
    const expr = `${f(n1, d1)} - ${f(n2, d2)} x = ${f(n3, d1)} - ${f(n4, d2)} x`;
    const lhs1 = n1 * mult / d1;
    const lhs2 = n2 * mult / d2;
    const rhs1 = n3 * mult / d1;
    const rhs2 = n4 * mult / d2;
    const xCoef = lhs2 - rhs2;
    const constDiff = lhs1 - rhs1;
    const development = [
      `${f(String(lhs1), mult)} - ${f(String(lhs2) + "x", mult)} = ${f(String(rhs1), mult)} - ${f(String(rhs2) + "x", mult)}`,
      `${lhs1} - ${lhs2}x = ${rhs1} - ${rhs2}x`,
      `${xCoef}x = ${constDiff}`,
      `x = ${solText(sol)}`,
    ];
    return { expr, solution: sol, development, operations: commonOps(mult, [`+ ${rhs2}x`, `- ${constDiff}`, `: ${xCoef}`, ""], development) };
  }),
];


export function pickA102FracQuestion(level: A10ExerciseLevel = 1): EquationQuestion {
  return pickByLevel(a102FracEasyGens, _legacyA102FracGens, level);
}


// ── A10.3 substitution systems (20 templates) ─────────────────────────────

const IR_ACCEPT = ["ir", "s=ir", "infini", "infinité"];
const IMP_ACCEPT = ["impossible", "s=∅", "vide", "∅"];
const A103_PHASE_ISOLATE = "Isoler une inconnue";
const A103_PHASE_SUBSTITUTE = "Substituer sa valeur";
const A103_PHASE_OTHER = "Chercher l'autre inconnue";

function subSys(
  eq1: [number, number, number],
  eq2: [number, number, number],
  isolate: 1 | 2,
  varIso: "x" | "y",
  xSol: number, xDen: number,
  ySol: number, yDen: number,
  dev: string[],
  ops: string[],
): SystemEquationQuestion {
  const [a1, b1, c1] = eq1;
  const [a2, b2, c2] = eq2;
  const eqStr = (a: number, b: number, c: number): string => {
    const parts: string[] = [];
    if (a !== 0) parts.push(a === 1 ? "x" : a === -1 ? "-x" : `${a}x`);
    if (b !== 0) parts.push(b > 0 ? `+ ${b}y` : `- ${-b}y`);
    const lhs = parts.join(" ").replace(/^\+ /, "");
    return `${lhs} = ${c}`;
  };
  const xs = xDen === 1 ? `${xSol}` : `${xSol}/${xDen}`;
  const ys = yDen === 1 ? `${ySol}` : `${ySol}/${yDen}`;
  return {
    equations: [eqStr(a1, b1, c1), eqStr(a2, b2, c2)] as [string, string],
    answer: pairAnswer(xs, ys),
    acceptable: acceptPair(xs, ys),
    development: dev,
    operations: ops,
  };
}

const _legacyA103Gens: Array<() => SystemEquationQuestion> = [
  // T1: isolate y in I
  () => retry(() => {
    const x0 = pickIntSolution(), y0 = pickIntSolution();
    const a = ri(2, 5), b = 1, c = a * x0 + y0;
    const d = ri(3, 8), e = ri(3, 9), eqF = d * x0 - e * y0;
    if (e === 0) return null;
    const dev = [
      A103_PHASE_ISOLATE, `${a}x + y = ${c}`, `y = ${c} - ${a}x`, A103_PHASE_SUBSTITUTE,
      `${d}x - ${e}(${c} - ${a}x) = ${eqF}`, `${d}x - ${e * c} + ${e * a}x = ${eqF}`,
      `${d + e * a}x - ${e * c} = ${eqF}`, `${d + e * a}x = ${eqF + e * c}`, `x = ${x0}`,
      A103_PHASE_OTHER, `y = ${c} - ${a}x`, `y = ${c} - ${a} · (${x0}) = ${y0}`,
    ];
    const ops = ["", `- ${a}x`, "", "", "effectuer", "réduire", `+ ${e * c}`, `: ${d + e * a}`, "", "", "", ""];
    return subSys([a, b, c], [d, -e, eqF], 1, "y", x0, 1, y0, 1, dev, ops);
  }),

  // T2: isolate x in II
  () => retry(() => {
    const x0 = pickIntSolution(), y0 = pickIntSolution();
    const a = ri(2, 4), b = ri(3, 6), c = a * x0 + b * y0;
    const d = 1, e = ri(5, 10), eqF = -e * y0 - x0;
    const dev = [
      A103_PHASE_ISOLATE, `${e}y = ${-x0 - e * y0} - x`, `${e}y + ${-x0 - e * y0} = -x`, `- ${e}y - ${-x0 - e * y0} = x`,
      A103_PHASE_SUBSTITUTE, `${a}(-${e}y - ${-x0 - e * y0}) + ${b}y = ${c}`,
      `-${a * e}y - ${a * (-x0 - e * y0)} + ${b}y = ${c}`, `-${a * e + b}y - ${a * (-x0 - e * y0)} = ${c}`,
      `-${a * e + b}y = ${c + a * (-x0 - e * y0)}`, `y = ${y0}`,
      A103_PHASE_OTHER, `- ${e}y - ${-x0 - e * y0} = x`, `x = ${x0}`,
    ];
    return subSys([a, b, c], [-d, -e, eqF], 2, "x", x0, 1, y0, 1, dev, ["", "+ " + (-x0 - e * y0), "· (-1)", "", "", "effectuer", "réduire", "+ " + (a * (-x0 - e * y0)), `: (${-(a * e + b)})`, "", "", ""]);
  }),

  // T3: isolate y in I (negative constants)
  () => retry(() => {
    const x0 = ri(-10, -2), y0 = ri(-6, -1);
    const a = ri(2, 5), c = a * x0 - y0;
    const d = ri(3, 7), e = ri(2, 5), eqF = d * x0 + e * y0;
    const dev = [
      A103_PHASE_ISOLATE, `${a}x - y = ${c}`, `-y = ${c} - ${a}x`, `y = ${-c} + ${a}x`,
      A103_PHASE_SUBSTITUTE, `${d}x + ${e}(${-c} + ${a}x) = ${eqF}`,
      `${d}x + ${-e * c} + ${e * a}x = ${eqF}`, `${d + e * a}x + ${-e * c} = ${eqF}`,
      `${d + e * a}x = ${eqF - (-e * c)}`, `x = ${x0}`, A103_PHASE_OTHER,
      `y = ${-c} + ${a}x`, `y = ${-c} + ${a} · (${x0}) = ${y0}`,
    ];
    return subSys([a, -1, c], [d, e, eqF], 1, "y", x0, 1, y0, 1, dev, ["", `- ${a}x`, "· (-1)", "", "", "effectuer", "réduire", formatSideOp(e * c), `: ${d + e * a}`, "", "", ""]);
  }),

  // T4: x - (-2y) = c
  () => retry(() => {
    const x0 = pickIntSolution(), y0 = pickIntSolution();
    const c = x0 + 2 * y0;
    const a = ri(3, 6), b = ri(3, 6), d = a * x0 + b * y0;
    const dev = [
      A103_PHASE_ISOLATE, `x + 2y = ${c}`, `x = ${c} - 2y`, A103_PHASE_SUBSTITUTE,
      `${a}(${c} - 2y) + ${b}y = ${d}`, `${a * c} - ${2 * a}y + ${b}y = ${d}`,
      `${a * c} - ${2 * a - b}y = ${d}`, `-${2 * a - b}y = ${d - a * c}`, `y = ${y0}`,
      A103_PHASE_OTHER, `x = ${c} - 2y`, `x = ${c} - 2 · ${y0} = ${x0}`,
    ];
    return subSys([a, b, d], [1, 2, c], 2, "x", x0, 1, y0, 1, dev, ["", "- 2y", "", "", "effectuer", "réduire", `- ${a * c}`, `: (${-(2 * a - b)})`, "", "", ""]);
  }),

  // T5: fraction solution
  () => retry(() => {
    const xn = ri(20, 60), xd = ri(20, 50);
    const yn = ri(30, 80), yd = xd;
    if (gcd(xn, xd) !== 1 || gcd(yn, yd) !== 1) return null;
    const x0 = xn / xd, y0 = yn / yd;
    const a = ri(4, 9), b = ri(4, 9), c = Math.round(a * x0 + b * y0);
    const d = ri(3, 7), e = ri(3, 7);
    const eqF = Math.round(d * x0 - e * y0);
    const xs = `${xn}/${xd}`, ys = `${yn}/${yd}`;
    const dev = [
      A103_PHASE_ISOLATE, `${c - a}x = ${e}y + ${eqF}`, `y = ${-e}x + ${c}`, A103_PHASE_SUBSTITUTE,
      `${b}(${-e}x + ${c}) - ${d}x = ${Math.round(b * y0 - d * x0)}`,
      `-${b * e}x + ${b * c} - ${d}x = ${Math.round(b * y0 - d * x0)}`,
      `-${b * e + d}x + ${b * c} = ${Math.round(b * y0 - d * x0)}`,
      `-${b * e + d}x = ${Math.round(b * y0 - d * x0 - b * c)}`, `x = ${f(xn, xd)}`,
      A103_PHASE_OTHER, `y = -${e}x + ${c}`, `y = -${e} · ${f(xn, xd)} + ${c} = ${f(yn, yd)}`,
    ];
    return {
      equations: [`${b}y - ${d}x = ${Math.round(b * y0 - d * x0)}`, `${c - a} - y = ${e}x + ${eqF}`] as [string, string],
      answer: pairAnswer(xs, ys),
      acceptable: acceptPair(xs, ys),
      development: dev,
      operations: ["", "- " + (c - a), "· (-1)", "", "", "effectuer", "réduire", `- ${b * c}`, `: (${-(b * e + d)})`, "", ""],
    };
  }),

  // T6: infinite
  () => {
    const a = ri(3, 6);
    const d2 = -a * 4, c2 = ri(5, 15);
    const dev2 = [
      A103_PHASE_ISOLATE, A103_PHASE_SUBSTITUTE,
      `-4(${a}x + ${c2}) + 40 = ${d2}x`, `-${4 * a}x - ${4 * c2} + 40 = ${d2}x`, `-${4 * a}x = ${d2}x`, "0 = 0", "infini",
    ];
    return {
      equations: [`${a}x + y = ${c2}`, `-4y + 40 = ${d2}x`] as [string, string],
      answer: "IR",
      acceptable: IR_ACCEPT,
      development: dev2,
      operations: ["", "", "effectuer", "réduire", "+ " + (4 * a) + "x", "", ""],
    };
  },

  // T7-T20: simplified parameterized substitution systems
  ...Array.from({ length: 14 }, (_, i) => () => retry(() => {
    const useFrac = i % 3 === 0;
    let x0: number, y0: number, xn: number, xd: number, yn: number, yd: number;
    if (useFrac) {
      xn = ri(10, 40); xd = ri(10, 40); yn = ri(10, 40); yd = ri(10, 40);
      if (gcd(xn, xd) !== 1 || gcd(yn, yd) !== 1) return null;
      x0 = xn / xd; y0 = yn / yd;
    } else {
      x0 = pickIntSolution(); y0 = pickIntSolution();
      xn = x0; xd = 1; yn = y0; yd = 1;
    }
    const a = ri(2, 6), b = ri(1, 4), c = Math.round(a * x0 + b * y0);
    const d = ri(2, 6), e = ri(2, 6), eqF = Math.round(d * x0 + e * y0);
    const xs = xd === 1 ? `${xn}` : `${xn}/${xd}`;
    const ys = yd === 1 ? `${yn}` : `${yn}/${yd}`;
    const ansFrac = xd === 1 ? xs : f(xn, xd);
    const ansFracY = yd === 1 ? ys : f(yn, yd);
    const dev = [
      A103_PHASE_ISOLATE, `${a}x + ${b}y = ${c}`, `${b}y = ${c} - ${a}x`, `y = ${(c / b)} - ${a / b}x`.replace(`${(c / b)}`, `${Math.round(c / b)}`).replace(`${a / b}`, `${a}/${b}`),
      A103_PHASE_SUBSTITUTE, `${d}x + ${e}((${c} - ${a}x) / ${b}) = ${eqF}`,
      `${d}x + ${Math.round(e * c / b)} - ${Math.round(e * a / b)}x = ${eqF}`,
      `${d - Math.round(e * a / b)}x = ${eqF - Math.round(e * c / b)}`, `x = ${ansFrac}`,
      A103_PHASE_OTHER, `y = ${c} - ${a}x`, `y = ${c} - ${a} · ${ansFrac} = ${ansFracY}`,
    ];
    // Fix dev to use integer arithmetic
    const yIso = b === 1 ? `${c} - ${a}x` : `(${c} - ${a}x) / ${b}`;
    dev[2] = `${b}y = ${c} - ${a}x`;
    dev[3] = `y = ${yIso}`;
    const subExpr = b === 1 ? `${c} - ${a}x` : `(${c} - ${a}x) / ${b}`;
    dev[5] = `${d}x + ${e}(${subExpr}) = ${eqF}`;
    const coef = d - (b === 1 ? e * a : (e * a) / b);
    const rhs = eqF - (b === 1 ? e * c : (e * c) / b);
    if (!Number.isInteger(coef) || !Number.isInteger(rhs)) return null;
    dev[6] = `${d}x + ${e * c / b} - ${e * a / b}x = ${eqF}`.replace(`${e * c / b}`, `${e * c / b}`).replace(`${e * a / b}`, `${e * a / b}`);
    if (b !== 1 && (e * c) % b !== 0) return null;
    if (b !== 1 && (e * a) % b !== 0) return null;
    const ec = b === 1 ? e * c : (e * c) / b;
    const ea = b === 1 ? e * a : (e * a) / b;
    dev[6] = `${d}x + ${ec} - ${ea}x = ${eqF}`;
    dev[7] = `${d - ea}x + ${ec} = ${eqF}`;
    dev[8] = `${d - ea}x = ${eqF - ec}`;
    dev[9] = `x = ${ansFrac}`;
    dev[11] = `y = ${c} - ${a}x`;
    dev[12] = `y = ${c} - ${a} · ${ansFrac} = ${ansFracY}`;
    return {
      equations: [`${a}x + ${b}y = ${c}`, `${d}x + ${e}y = ${eqF}`] as [string, string],
      answer: pairAnswer(xs, ys),
      acceptable: acceptPair(xs, ys),
      development: dev,
      operations: ["", `- ${a}x`, "", "", "effectuer", "réduire", `- ${ec}`, `: ${d - ea}`, "", "", ""],
    };
  })),

  // impossible system
  () => {
    const a = ri(3, 6), b = ri(3, 6), c = ri(5, 15);
    const d = b * 5, e = -a * 5;
    const dev = [
      A103_PHASE_ISOLATE, `${b}y - x = ${c}`, `-x = ${c} - ${b}y`, `x = ${-c} + ${b}y`,
      A103_PHASE_SUBSTITUTE, `${d}(-${c} + ${b}y) - ${Math.abs(e)} = ${-a * 40}y`,
      `${-d * c} + ${d * b}y - ${Math.abs(e)} = ${-a * 40}y`, `${d * b}y = ${a * 40}y`, "-5 = 0", "impossible !",
    ];
    return {
      equations: [`${b}y - x = ${c}`, `${-a * 5}x - ${40 * a} = ${-40 * b}y`] as [string, string],
      answer: "impossible",
      acceptable: IMP_ACCEPT,
      development: dev,
      operations: ["", `- ${b}y`, "· (-1)", "", "", "effectuer", "+ 40y", ""],
    };
  },
];

export function pickA103SystemQuestion(level: A10ExerciseLevel = 1): SystemEquationQuestion {
  return pickByLevel(a103EasyGens, a103HardGens, level);
}


// ── A10.4 linear combination systems (20 templates) ───────────────────────

function combSys(
  eq1: [number, number, number],
  eq2: [number, number, number],
  m1: number, m2: number,
  xSol: number, xDen: number,
  ySol: number, yDen: number,
  dev: string[],
  ops: string[],
): SystemEquationQuestion {
  const fmt = (a: number, b: number, c: number) => {
    const p: string[] = [];
    if (a) p.push(a === 1 ? "x" : a === -1 ? "-x" : `${a}x`);
    if (b) p.push(b > 0 ? `+ ${b}y` : `- ${-b}y`);
    return `${p.join(" ").replace(/^\+ /, "")} = ${c}`;
  };
  const xs = xDen === 1 ? `${xSol}` : `${xSol}/${xDen}`;
  const ys = yDen === 1 ? `${ySol}` : `${ySol}/${yDen}`;
  return {
    equations: [fmt(...eq1), fmt(...eq2)] as [string, string],
    answer: pairAnswer(xs, ys),
    acceptable: acceptPair(xs, ys),
    development: dev,
    operations: ops,
  };
}

const _legacyA104Gens: Array<() => SystemEquationQuestion> = [
  // T1: I·2 + II
  () => retry(() => {
    const x0 = ri(2, 10), y0 = ri(2, 10);
    const a = 3, b = -2, c = a * x0 + b * y0;
    const d = 8, e = 4, eqF = d * x0 + e * y0;
    const m1 = 2;
    const dev = [
      `I · ${m1}`, `${a * m1}x - ${-b * m1}y = ${c * m1}`, "II", `${d}x + ${e}y = ${eqF}`,
      `${a * m1 + d}x = ${c * m1 + eqF}`, `x = ${x0}`, "dans I",
      `${a} · ${x0} - ${-b}y = ${c}`, `${a * x0} - ${-b}y = ${c}`, `${-b}y = ${c - a * x0}`, `y = ${y0}`,
    ];
    return combSys([a, b, c], [d, e, eqF], m1, 1, x0, 1, y0, 1, dev, [`· ${m1}`, "", "", `: ${a * m1 + d}`, "", "", "", `- ${a * x0}`, `: (${-b})`, "", ""]);
  }),

  // T2: I·3 + II·5
  () => retry(() => {
    const x0 = ri(-5, -1), y0 = ri(-5, -1);
    const a = -5, b = 3, c = a * x0 + b * y0;
    const d = 3, e = -5, eqF = d * x0 + e * y0;
    const m1 = 3, m2 = 5;
    const dev = [
      `I · ${m1}`, `${a * m1}x + ${b * m1}y = ${c * m1}`, `II · ${m2}`, `${d * m2}x + ${e * m2}y = ${eqF * m2}`,
      `${a * m1 + d * m2}y = ${c * m1 + eqF * m2}`, `y = ${y0}`, "dans II",
      `${d}x + ${e} · (${y0}) = ${eqF}`, `${d}x + ${e * y0} = ${eqF}`, `${d}x = ${eqF - e * y0}`, `x = ${x0}`,
    ];
    return combSys([a, b, c], [d, e, eqF], m1, m2, x0, 1, y0, 1, dev, [`· ${m1}`, "", `· ${m2}`, "", `: (${a * m1 + d * m2})`, "", "", "", `- ${e * y0}`, `: ${d}`, "", ""]);
  }),

  // T3: rearrange + II·2
  () => retry(() => {
    const x0 = ri(5, 15), y0 = 0;
    const a = 4, b = -5, c = a * x0 + b * y0;
    const d = -2, e = 8, eqF = d * x0 + e * y0;
    const dev = [
      "mettre I dans le même ordre", `I : ${a}x - ${-b}y = ${c}`, `II · 2 : ${d * 2}x + ${e * 2}y = ${eqF * 2}`,
      `${-b + e * 2}y = ${c + eqF * 2}`, `y = ${y0}`, "dans I", `${a}x - ${-b} · ${y0} = ${c}`, `${a}x = ${c}`, `x = ${x0}`,
    ];
    return combSys([a, b, c], [d, e, eqF], 1, 2, x0, 1, y0, 1, dev, ["- 5y", "", "· 2", `: ${-b + e * 2}`, "", "", "", `: ${a}`, "", ""]);
  }),

  // T4: reorder II + I·5, II·2
  () => retry(() => {
    const x0 = ri(-5, -1), y0 = ri(-6, -2);
    const a = -2, b = -3, c = a * x0 + b * y0;
    const d = -5, e = 7, eqF = d * x0 + e * y0;
    const dev = [
      "mettre II dans le même ordre", `II : ${d}x + ${e}y = ${eqF}`, `I · 5 : ${a * 5}x + ${b * 5}y = ${c * 5}`,
      `II · 2 : ${d * 2}x + ${e * 2}y = ${eqF * 2}`, `${b * 5 + e * 2}y = ${c * 5 + eqF * 2}`, `y = ${y0}`,
      "dans I", `${a}x + ${b} · (${y0}) = ${c}`, `${a}x + ${b * y0} = ${c}`, `${a}x = ${c - b * y0}`, `x = ${x0}`,
    ];
    return combSys([a, b, c], [d, e, eqF], 5, 2, x0, 1, y0, 1, dev, ["- 5x", "", "· 5", "· 2", `: (${b * 5 + e * 2})`, "", "", "", `- ${b * y0}`, `: ${a}`, "", ""]);
  }),

  // T5: fraction solution I·5
  () => retry(() => {
    const xn = ri(5, 20), xd = ri(20, 60), yn = ri(10, 40), yd = ri(20, 60);
    if (gcd(xn, xd) !== 1 || gcd(yn, yd) !== 1) return null;
    const x0 = xn / xd, y0 = yn / yd;
    const a = 4, b = 10, d = 20, e = 1;
    const c2 = Math.round(a * x0 + b * y0);
    const f2 = Math.round(d * x0 + e * y0);
    if (!Number.isInteger(c2 * 49) || !Number.isInteger(f2 * 49)) return null;
    const m1 = 5;
    const yf = f(yn, yd);
    const xf = f(xn, xd);
    const dev = [
      `I · ${m1}`, `${a * m1}x + ${b * m1}y = ${c2 * m1}`, "II", `${d}x + ${e}y = ${f2}`,
      `${b * m1 - e}y = ${c2 * m1 - f2}`.replace(`${b * m1 - e}`, `${b * m1 - e}`),
      `y = ${yf}`, "dans II", `${d}x + ${yf} = ${f2}`, `${d}x = ${f2} - ${yf}`, `x = ${xf}`,
    ];
    const yCoef = b * m1 - e;
    const yRhs = c2 * m1 - f2;
    dev[4] = `${yCoef}y = ${yRhs}`;
    dev[5] = `y = ${yf}`;
    return combSys([a, b, c2], [d, e, f2], m1, 1, xn, xd, yn, yd, dev, [`· ${m1}`, "", "", "", `: ${yCoef}`, "", "", "", `- ${yf}`, `: ${d}`, "", ""]);
  }),

  // T6-T17: generic combination templates
  ...Array.from({ length: 12 }, (_, i) => () => retry(() => {
    const useFrac = i % 4 === 0;
    let x0: number, y0: number, xn: number, xd: number, yn: number, yd: number;
    if (useFrac) {
      xn = ri(5, 30); xd = ri(10, 50); yn = ri(5, 30); yd = ri(10, 50);
      if (gcd(xn, xd) !== 1 || gcd(yn, yd) !== 1) return null;
      x0 = xn / xd; y0 = yn / yd;
    } else {
      x0 = pickIntSolution(); y0 = pickIntSolution();
      xn = x0; xd = 1; yn = y0; yd = 1;
    }
    const a = ri(2, 6), b = ri(2, 6), c = Math.round(a * x0 + b * y0);
    const d = ri(2, 6), e = ri(2, 6), eqF = Math.round(d * x0 + e * y0);
    const m1 = ri(2, 4), m2 = i % 2 === 0 ? 1 : ri(2, 4);
    const xCoef = a * m1 + d * m2;
    const yCoef = b * m1 + e * m2;
    if (xCoef === 0 || yCoef === 0) return null;
    const xs = xd === 1 ? `${xn}` : `${xn}/${xd}`;
    const ys = yd === 1 ? `${yn}` : `${yn}/${yd}`;
    const xf = xd === 1 ? xs : f(xn, xd);
    const yf = yd === 1 ? ys : f(yn, yd);
    const dev = [
      m1 > 1 ? `I · ${m1}` : "I", `${a * m1}x + ${b * m1}y = ${c * m1}`,
      m2 > 1 ? `II · ${m2}` : "II", `${d * m2}x + ${e * m2}y = ${eqF * m2}`,
      `${xCoef}x = ${c * m1 + eqF * m2 - yCoef * y0}`, `x = ${xf}`, "dans I",
      `${a}x + ${b} · ${yf} = ${c}`, `${a}x + ${b * y0} = ${c}`, `${a}x = ${c - b * y0}`, `x = ${xf}`,
    ];
    if (yCoef !== 0) {
      dev[4] = `${yCoef}y = ${c * m1 + eqF * m2 - xCoef * x0}`;
      dev[5] = `y = ${yf}`;
      dev[6] = "dans I";
      dev[7] = `${a}x + ${b} · ${yf} = ${c}`;
      dev[8] = `${a}x + ${Math.round(b * y0)} = ${c}`;
      dev[9] = `${a}x = ${c - Math.round(b * y0)}`;
      dev[10] = `x = ${xf}`;
    }
    const elimVar = Math.abs(xCoef) >= Math.abs(yCoef) ? "y" : "x";
    if (elimVar === "y" && yCoef !== 0) {
      dev[4] = `${yCoef}y = ${c * m1 + eqF * m2 - xCoef * x0}`;
      dev[5] = `y = ${yf}`;
    } else {
      dev[4] = `${xCoef}x = ${c * m1 + eqF * m2 - yCoef * y0}`;
      dev[5] = `x = ${xf}`;
    }
    return combSys([a, b, c], [d, e, eqF], m1, m2, xn, xd, yn, yd, dev,
      [`· ${m1}`, "", m2 > 1 ? `· ${m2}` : "", "", `: ${elimVar === "y" ? yCoef : xCoef}`, "", "", "", "", `: ${a}`, "", ""]);
  })),

  // T18: infinite
  () => {
    const a = -4, b = 7, c = -9;
    const d = -12, e = 21, eqF = -27;
    const dev = [
      "mettre dans le même ordre", `I : ${a}x + ${b}y = ${c}`, `II : ${d}x + ${e}y = ${eqF}`,
      `I · 3`, `${d}x + ${21}y = ${-27}`, "II", `${d}x + ${e}y = ${eqF}`, "0 = 0", "infini",
    ];
    return {
      equations: [`${b}y + ${-a}x = ${-c}`, `${-d}x + ${e}y = ${eqF}`] as [string, string],
      answer: "IR",
      acceptable: IR_ACCEPT,
      development: dev,
      operations: ["", "- 4x / - 9", "+ 21y / - 27", "· 3", "", "", "", "", ""],
    };
  },

  // T19: impossible I·4
  () => {
    const a = 10, b = 7, c = 1;
    const d = 40, e = 28, eqF = 10;
    const dev = [
      `I · 4`, `${a * 4}y + ${b * 4}x - ${c * 4} = 0`, "II", `${d}y + ${e}x - ${eqF} = 0`, "6 = 0", "impossible !",
    ];
    return {
      equations: [`${b}x + ${a}y - ${c} = 0`, `${e}x + ${d}y - ${eqF} = 0`] as [string, string],
      answer: "impossible",
      acceptable: IMP_ACCEPT,
      development: dev,
      operations: ["· 4", "", "", "", "", ""],
    };
  },

  // T20: effectuer then combine
  () => retry(() => {
    const xn = ri(20, 80), xd = ri(20, 80), yn = ri(-120, -40), yd = ri(20, 80);
    if (gcd(xn, xd) !== 1 || gcd(yn, yd) !== 1) return null;
    const xf = f(xn, xd), yf = f(yn, yd);
    const dev = [
      "mettre dans le même ordre", `I : ${-8}x + ${3}y = ${8}`, `II : ${5}x - ${7}y = ${-6}`,
      `I · 5`, `${-40}x + ${15}y = ${40}`, `II · 8`, `${40}x - ${56}y = ${-48}`,
      `${-41}y = ${-8}`, `y = ${yf}`, "dans I", `-8x + 3 · ${yf} = ${8}`, `-8x + ${f(24, 41)} = ${8}`, `x = ${xf}`,
    ];
    return combSys([-8, 3, 8], [5, -7, -6], 5, 8, xn, xd, yn, yd, dev,
      ["", "- 8x / + 7", "- 7y / - 1", "· 5", "", "· 8", "", ": (-41)", "", "", "", `- ${f(24, 41)}`, `: (-8)`, "", ""]);
  }),
];

export function pickA104SystemQuestion(level: A10ExerciseLevel = 1): SystemEquationQuestion {
  return pickByLevel(a104EasyGens, a104HardGens, level);
}

export function pickA102Question(level: A10ExerciseLevel = 1): EquationQuestion {
  return pickByLevel(a102EasyGens, a102Gens, level);
}

import { int, pick, type Rng } from './rng'
import type { CompositeLabel, CompositeRight, CompositeScene, CompositeTick, Difficulty, MathItem } from './types'

const PI = 3.14

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100
  return String(r).replace('.', ',')
}

function cm(n: number): string {
  return `${fmt(n)} cm`
}

function r2(n: number): number {
  return Math.round(n * 100) / 100
}

function nLen(rng: Rng, difficulty: Difficulty, min: number, max: number): number {
  if (difficulty === 'avance' && rng() < 0.35) {
    return Math.round(int(rng, min * 2, max * 2) * 5) / 10
  }
  return int(rng, min, max)
}

function tick(x1: number, y1: number, x2: number, y2: number, n: 1 | 2 | 3): CompositeTick {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
    angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    n,
  }
}

function right(x: number, y: number, ax: number, ay: number, bx: number, by: number): CompositeRight {
  return { x, y, ax, ay, bx, by }
}

function lab(x: number, y: number, text: string, anchor: CompositeLabel['anchor'] = 'middle'): CompositeLabel {
  return { x, y, text, anchor }
}

type Draft = {
  scene: CompositeScene
  calc: string
  value: number
  usesPi?: boolean
  hasX?: boolean
}

function itemOf(d: Draft): MathItem {
  const prompt = d.hasX
    ? d.usesPi
      ? 'Calculez x, puis le périmètre. Prenez π = 3,14.'
      : 'Calculez x, puis le périmètre.'
    : d.usesPi
      ? 'Calculez le périmètre. Prenez π = 3,14.'
      : 'Calculez le périmètre.'
  return {
    layout: 'geo',
    prompt,
    compositeScene: d.scene,
    calcAnswer: d.calc,
    responseAnswer: `${fmt(d.value)} cm`,
    answer: `${fmt(d.value)} cm`,
  }
}

/** Rectangle + carré en retrait + triangle (esprit « maison »). */
function houseAnnex(rng: Rng, difficulty: Difficulty): Draft {
  const a = nLen(rng, difficulty, 5, 8)
  const s = nLen(rng, difficulty, 3, 5)
  const c = nLen(rng, difficulty, 2, 4)
  const slant = nLen(rng, difficulty, 5, 8)
  const x0 = 28
  const y0 = 48
  const bw = 150
  const bh = 90
  const ww = 48
  const wh = 48
  const tw = 44
  const outline = `M ${x0} ${y0 + wh} H ${x0 + bw - ww} V ${y0} H ${x0 + bw} V ${y0 + wh} L ${x0 + bw + tw} ${y0 + wh + bh} H ${x0} Z`
  const bottom = r2(a + s + c)
  return {
    scene: {
      outline,
      helpers: [{ d: `M ${x0 + bw - ww} ${y0 + wh} H ${x0 + bw} V ${y0 + wh + bh}`, dashed: true }],
      labels: [
        lab(x0 + (bw - ww) / 2, y0 + wh - 8, cm(a)),
        lab(x0 + bw - ww / 2, y0 - 6, cm(s)),
        lab(x0 + bw + 8, y0 + 22, cm(c), 'start'),
        lab(x0 + bw + tw + 8, y0 + wh + bh / 2, cm(slant), 'start'),
      ],
      ticks: [
        tick(x0, y0 + wh, x0, y0 + wh + bh, 2),
        tick(x0 + bw - ww, y0, x0 + bw - ww, y0 + wh, 2),
        tick(x0 + bw - ww, y0, x0 + bw, y0, 2),
        tick(x0 + bw, y0, x0 + bw, y0 + wh, 2),
      ],
      rights: [
        right(x0, y0 + wh + bh, 1, 0, 0, -1),
        right(x0, y0 + wh, 1, 0, 0, 1),
        right(x0 + bw, y0 + wh, -1, 0, 0, 1),
        right(x0 + bw, y0, -1, 0, 0, 1),
      ],
    },
    calc: `${fmt(a)} + 3 × ${fmt(s)} + ${fmt(c)} + ${fmt(slant)} + (${fmt(a)} + ${fmt(s)} + ${fmt(c)}) + ${fmt(s)}`,
    value: r2(a + 3 * s + c + slant + bottom + s),
  }
}

/** Rectangle + triangle isocèle à droite. */
function flagRect(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 6, 10)
  const H = nLen(rng, difficulty, 3, 6)
  const side = nLen(rng, difficulty, 4, 7)
  const x0 = 36
  const y0 = 52
  const w = 130
  const h = 78
  const tip = 56
  const outline = `M ${x0} ${y0} H ${x0 + w} L ${x0 + w + tip} ${y0 + h / 2} L ${x0 + w} ${y0 + h} H ${x0} Z`
  return {
    scene: {
      outline,
      helpers: [{ d: `M ${x0 + w} ${y0} V ${y0 + h}`, dashed: true }],
      labels: [
        lab(x0 + w / 2, y0 - 8, cm(L)),
        lab(x0 - 10, y0 + h / 2, cm(H), 'end'),
        lab(x0 + w + tip / 2 + 10, y0 + 22, cm(side), 'start'),
        lab(x0 + w / 2, y0 + h + 14, cm(L)),
      ],
      ticks: [
        tick(x0 + w, y0, x0 + w + tip, y0 + h / 2, 1),
        tick(x0 + w, y0 + h, x0 + w + tip, y0 + h / 2, 1),
      ],
      rights: [
        right(x0, y0, 1, 0, 0, 1),
        right(x0, y0 + h, 1, 0, 0, -1),
        right(x0 + w, y0, -1, 0, 0, 1),
        right(x0 + w, y0 + h, -1, 0, 0, -1),
      ],
    },
    calc: `${fmt(L)} + ${fmt(H)} + ${fmt(side)} + ${fmt(side)} + ${fmt(L)}`,
    value: r2(2 * L + H + 2 * side),
  }
}

/** Losange / cerf-volant avec deux encoches en demi-cercle. */
function kiteBites(rng: Rng, difficulty: Difficulty): Draft {
  const a = nLen(rng, difficulty, 4, 7)
  const b = nLen(rng, difficulty, 3, 5)
  const r = nLen(rng, difficulty, 1, 2)
  const cx = 130
  const cy = 95
  const outline = `M 40 ${cy} L ${cx} 28 A 28 28 0 0 0 ${cx} 72 L 220 ${cy} L ${cx} 162 A 28 28 0 0 1 ${cx} 118 Z`
  const arc = r2(PI * r)
  return {
    scene: {
      outline,
      helpers: [{ d: `M 40 ${cy} H 220`, dashed: true }],
      labels: [
        lab(70, 52, cm(a)),
        lab(190, 52, cm(b)),
        lab(70, 150, cm(a)),
        lab(190, 150, cm(b)),
        lab(cx, 58, cm(r)),
        lab(cx, 140, cm(r)),
      ],
      ticks: [tick(40, cy, cx, 28, 1), tick(40, cy, cx, 162, 1)],
    },
    calc: `${fmt(a)} + ${fmt(b)} + ${fmt(a)} + ${fmt(b)} + 3,14 × ${fmt(r)} + 3,14 × ${fmt(r)}`,
    value: r2(2 * a + 2 * b + 2 * arc),
    usesPi: true,
  }
}

/** Rectangle écorné de quatre quarts de cercle (coussin). */
function cushion(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 8, 12)
  const H = nLen(rng, difficulty, 4, 7)
  const r = nLen(rng, difficulty, 2, 3)
  const x = 40
  const y = 40
  const w = 180
  const h = 110
  const rr = 36
  const outline = `M ${x + rr} ${y} A ${rr} ${rr} 0 0 1 ${x} ${y + rr} V ${y + h - rr} A ${rr} ${rr} 0 0 1 ${x + rr} ${y + h} H ${x + w - rr} A ${rr} ${rr} 0 0 1 ${x + w} ${y + h - rr} V ${y + rr} A ${rr} ${rr} 0 0 1 ${x + w - rr} ${y} Z`
  const straight = 2 * (L - 2 * r) + 2 * (H - 2 * r)
  const arcs = r2(2 * PI * r)
  return {
    scene: {
      outline,
      helpers: [
        { d: `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`, dashed: true },
        { d: `M ${x} ${y + h + 16} H ${x + w}`, dashed: false },
      ],
      labels: [
        lab(130, 22, cm(L)),
        lab(232, 95, cm(H), 'start'),
      ],
      ticks: [
        tick(x, y, x + w, y, 2),
        tick(x, y + h, x + w, y + h, 2),
        tick(x, y, x, y + h, 1),
        tick(x + w, y, x + w, y + h, 1),
      ],
    },
    calc: `2 × (${fmt(L)} − 2 × ${fmt(r)}) + 2 × (${fmt(H)} − 2 × ${fmt(r)}) + 2 × 3,14 × ${fmt(r)}`,
    value: r2(straight + arcs),
    usesPi: true,
  }
}

/** Grande arche moins deux petites encoches. */
function archBites(rng: Rng, difficulty: Difficulty): Draft {
  const R = nLen(rng, difficulty, 4, 7)
  const r = r2(R / 2)
  return {
    scene: {
      outline: `M 36 150 A 94 94 0 0 1 224 150 A 47 47 0 0 1 130 150 A 47 47 0 0 1 36 150 Z`,
      helpers: [{ d: 'M 36 150 H 224', dashed: true }],
      labels: [lab(83, 168, cm(R))],
      ticks: [tick(36, 150, 130, 150, 1), tick(130, 150, 224, 150, 1)],
    },
    calc: `3,14 × ${fmt(R)} + 3,14 × ${fmt(r)} + 3,14 × ${fmt(r)}`,
    value: r2(PI * R + 2 * PI * r),
    usesPi: true,
  }
}

/** Rectangle + demi-disque collé au-dessus. */
function chapel(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 6, 10)
  const H = nLen(rng, difficulty, 4, 7)
  const r = L / 2
  const x = 70
  const y = 88
  const w = 120
  const h = 70
  const outline = `M ${x} ${y} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y} V ${y + h} H ${x} Z`
  return {
    scene: {
      outline,
      helpers: [{ d: `M ${x} ${y} H ${x + w}`, dashed: true }],
      labels: [
        lab(x - 10, y + h / 2, cm(H), 'end'),
        lab(x + 36, y + 8, cm(r), 'start'),
        lab(x + w / 2, y + h + 14, cm(L)),
      ],
      ticks: [
        tick(x, y + h, x + w / 2, y + h, 1),
        tick(x + w / 2, y + h, x + w, y + h, 1),
        tick(x, y, x, y + h, 2),
        tick(x + w, y, x + w, y + h, 2),
      ],
      rights: [right(x, y + h, 1, 0, 0, -1), right(x + w, y + h, -1, 0, 0, -1)],
    },
    calc: `${fmt(H)} + ${fmt(H)} + ${fmt(L)} + 3,14 × ${fmt(r)}`,
    value: r2(2 * H + L + PI * r),
    usesPi: true,
  }
}

/** Rectangle avec un demi-disque ajouté sur un côté. */
function tub(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 6, 10)
  const H = nLen(rng, difficulty, 4, 6)
  const r = nLen(rng, difficulty, 2, 3)
  const x = 40
  const y = 36
  const w = 180
  const h = 88
  const outline = `M ${x} ${y} H ${x + w} V ${y + h} H ${x + w * 0.55} A ${40} ${40} 0 0 1 ${x} ${y + h} Z`
  return {
    scene: {
      outline,
      helpers: [{ d: `M ${x} ${y + h} H ${x + w * 0.55}`, dashed: true }],
      labels: [
        lab(x + w / 2, y - 8, cm(L)),
        lab(x + w + 10, y + h / 2, cm(H), 'start'),
        lab(x + w * 0.78, y + h + 14, cm(r)),
      ],
      rights: [
        right(x, y, 1, 0, 0, 1),
        right(x + w, y, -1, 0, 0, 1),
        right(x + w, y + h, -1, 0, 0, -1),
        right(x, y + h, 1, 0, 0, -1),
      ],
    },
    calc: `${fmt(L)} + ${fmt(H)} + ${fmt(L - 2 * r)} + ${fmt(H)} + 3,14 × ${fmt(r)}`,
    value: r2(L + 2 * H + (L - 2 * r) + PI * r),
    usesPi: true,
  }
}

/** Stade : rectangle + deux demi-disques. */
function stadium(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 5, 9)
  const H = nLen(rng, difficulty, 3, 5)
  const r = H / 2
  const x = 70
  const y = 55
  const w = 120
  const h = 80
  const outline = `M ${x} ${y} H ${x + w} A ${h / 2} ${h / 2} 0 0 1 ${x + w} ${y + h} H ${x} A ${h / 2} ${h / 2} 0 0 1 ${x} ${y} Z`
  return {
    scene: {
      outline,
      helpers: [
        { d: `M ${x} ${y} V ${y + h}`, dashed: true },
        { d: `M ${x + w} ${y} V ${y + h}`, dashed: true },
      ],
      labels: [lab(x + w / 2, y - 8, cm(L)), lab(x - 12, y + h / 2, cm(H), 'end')],
      rights: [
        right(x, y, 1, 0, 0, 1),
        right(x, y + h, 1, 0, 0, -1),
        right(x + w, y, -1, 0, 0, 1),
        right(x + w, y + h, -1, 0, 0, -1),
      ],
    },
    calc: `${fmt(L)} + ${fmt(L)} + 2 × 3,14 × ${fmt(r)}`,
    value: r2(2 * L + 2 * PI * r),
    usesPi: true,
  }
}

/** Trois quarts de disque. */
function threeQuarter(rng: Rng, difficulty: Difficulty): Draft {
  const r = nLen(rng, difficulty, 4, 8)
  const outline = `M 130 40 A 70 70 0 1 1 60 110 L 130 110 Z`
  return {
    scene: {
      outline,
      labels: [lab(168, 118, cm(r), 'start')],
      helpers: [{ d: 'M 130 110 L 200 110', dashed: false }],
    },
    calc: `(3/4) × 2 × 3,14 × ${fmt(r)} + ${fmt(r)} + ${fmt(r)}`,
    value: r2(1.5 * PI * r + 2 * r),
    usesPi: true,
  }
}

/** Rectangle à coin coupé : x est le petit côté restant (différence). */
function cutCorner(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 8, 12)
  const H = nLen(rng, difficulty, 5, 8)
  const cut = nLen(rng, difficulty, 2, 3)
  const x0 = 40
  const y0 = 40
  const w = 180
  const h = 110
  const outline = `M ${x0 + 40} ${y0} H ${x0 + w} V ${y0 + h} H ${x0} V ${y0 + 40} Z`
  return {
    scene: {
      outline,
      labels: [
        lab(x0 + w / 2 + 10, y0 - 8, cm(L - cut)),
        lab(x0 + w + 10, y0 + h / 2, cm(H), 'start'),
        lab(130, y0 + h + 16, cm(L)),
        lab(x0 - 10, y0 + h / 2 + 10, cm(H - cut), 'end'),
        lab(x0 + 14, y0 + 16, 'x', 'start'),
      ],
      rights: [
        right(x0 + w, y0, -1, 0, 0, 1),
        right(x0 + w, y0 + h, -1, 0, 0, -1),
        right(x0, y0 + h, 1, 0, 0, -1),
      ],
    },
    calc: `x = ${fmt(cut)} ; ${fmt(L - cut)} + ${fmt(H)} + ${fmt(L)} + ${fmt(H - cut)} + ${fmt(cut)} + ${fmt(cut)}`,
    value: r2(L - cut + H + L + H - cut + 2 * cut),
    hasX: true,
  }
}

/** Carré à deux encoches opposées, x = côté (traits). */
function notchedSquare(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 5, 8)
  const n = nLen(rng, difficulty, 1, 2)
  const outline = `M 80 40 L 150 40 L 180 70 L 180 95 L 155 95 L 155 115 L 180 115 L 180 140 L 150 170 L 80 170 L 50 140 L 50 115 L 75 115 L 75 95 L 50 95 L 50 70 Z`
  return {
    scene: {
      outline,
      labels: [
        lab(188, 82, cm(s), 'start'),
        lab(168, 108, cm(n), 'start'),
        lab(36, 70, 'x', 'end'),
      ],
      ticks: [tick(50, 70, 80, 40, 1), tick(150, 40, 180, 70, 1)],
    },
    calc: `x = ${fmt(s)} ; 4 × ${fmt(s)} + 4 × ${fmt(n)}`,
    value: r2(4 * s + 4 * n),
    hasX: true,
  }
}

/** Maison pentagonale, x égal au côté vertical (traits). */
function houseX(rng: Rng, difficulty: Difficulty): Draft {
  const base = nLen(rng, difficulty, 6, 10)
  const h = nLen(rng, difficulty, 4, 7)
  const roof = nLen(rng, difficulty, 4, 6)
  return {
    scene: {
      outline: `M 50 80 L 130 28 L 210 80 V 150 H 50 Z`,
      labels: [
        lab(130, 168, cm(base)),
        lab(222, 118, cm(h), 'start'),
        lab(86, 46, cm(roof)),
        lab(36, 118, 'x', 'end'),
      ],
      ticks: [tick(50, 80, 50, 150, 1), tick(210, 80, 210, 150, 1)],
    },
    calc: `x = ${fmt(h)} ; ${fmt(base)} + ${fmt(h)} + ${fmt(roof)} + ${fmt(roof)} + ${fmt(h)}`,
    value: r2(base + 2 * h + 2 * roof),
    hasX: true,
  }
}

/** Trapèze rectangle, x = petite base (différence visible + traits). */
function trapX(rng: Rng, difficulty: Difficulty): Draft {
  const B = nLen(rng, difficulty, 8, 12)
  const h = nLen(rng, difficulty, 4, 7)
  const side = nLen(rng, difficulty, 5, 8)
  const b = nLen(rng, difficulty, 5, 7)
  const outline = `M 50 150 H 210 L 180 50 H 50 Z`
  return {
    scene: {
      outline,
      labels: [
        lab(130, 168, cm(B)),
        lab(36, 100, cm(h), 'end'),
        lab(208, 96, cm(side), 'start'),
        lab(118, 40, 'x'),
        lab(195, 168, cm(B - b), 'start'),
      ],
      helpers: [{ d: 'M 180 50 V 150', dashed: true }],
    },
    calc: `x = ${fmt(B)} − ${fmt(B - b)} = ${fmt(b)} ; ${fmt(b)} + ${fmt(h)} + ${fmt(B)} + ${fmt(side)}`,
    value: r2(b + h + B + side),
    hasX: true,
  }
}

/** L, x = grande hauteur. */
function ellX(rng: Rng, difficulty: Difficulty): Draft {
  const a = nLen(rng, difficulty, 6, 9)
  const b = nLen(rng, difficulty, 3, 4)
  const t = nLen(rng, difficulty, 2, 3)
  const outline = `M 50 40 H 200 V 90 H 110 V 150 H 50 Z`
  return {
    scene: {
      outline,
      labels: [
        lab(125, 30, cm(a)),
        lab(210, 68, cm(b), 'start'),
        lab(156, 104, cm(t), 'start'),
        lab(36, 95, 'x', 'end'),
      ],
      ticks: [tick(50, 40, 50, 150, 1), tick(50, 40, 200, 40, 1)],
      rights: [
        right(50, 40, 1, 0, 0, 1),
        right(200, 40, -1, 0, 0, 1),
        right(200, 90, -1, 0, 0, -1),
        right(50, 150, 1, 0, 0, -1),
      ],
    },
    calc: `x = ${fmt(a)} ; 4 × ${fmt(a)}`,
    value: r2(4 * a),
    hasX: true,
  }
}

function uShape(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 7, 11)
  const H = nLen(rng, difficulty, 5, 8)
  const g = nLen(rng, difficulty, 2, 4)
  const outline = `M 40 40 H 90 V 120 H 170 V 40 H 220 V 150 H 40 Z`
  const top = r2((L - g) / 2)
  return {
    scene: {
      outline,
      labels: [
        lab(130, 168, cm(L)),
        lab(28, 95, cm(H), 'end'),
        lab(130, 110, cm(g)),
        lab(65, 30, cm(top)),
      ],
      ticks: [
        tick(40, 40, 40, 150, 1),
        tick(220, 40, 220, 150, 1),
        tick(90, 40, 90, 120, 1),
        tick(170, 40, 170, 120, 1),
        tick(40, 40, 90, 40, 2),
        tick(170, 40, 220, 40, 2),
      ],
      rights: [right(40, 150, 1, 0, 0, -1), right(220, 150, -1, 0, 0, -1)],
    },
    calc: `${fmt(L)} + 2 × ${fmt(H)} + ${fmt(g)} + 2 × ${fmt(H)} + 2 × ${fmt(top)}`,
    value: r2(2 * L + 4 * H),
  }
}

function tShape(rng: Rng, difficulty: Difficulty): Draft {
  const top = nLen(rng, difficulty, 8, 12)
  const stem = nLen(rng, difficulty, 3, 5)
  const h = nLen(rng, difficulty, 6, 9)
  const outline = `M 40 40 H 220 V 85 H 155 V 155 H 105 V 85 H 40 Z`
  return {
    scene: {
      outline,
      labels: [lab(130, 30, cm(top)), lab(28, 62, cm(stem), 'end'), lab(96, 120, cm(h), 'end')],
      rights: [right(40, 40, 1, 0, 0, 1), right(220, 40, -1, 0, 0, 1)],
    },
    calc: `${fmt(top)} + 2 × ${fmt(stem)} + 2 × ${fmt((top - stem) / 2)} + 2 × ${fmt(h - stem)} + ${fmt(stem)}`,
    value: r2(2 * top + 2 * h),
  }
}

function plusShape(rng: Rng, difficulty: Difficulty): Draft {
  const a = nLen(rng, difficulty, 6, 9)
  const t = nLen(rng, difficulty, 2, 3)
  const outline = `M 100 30 H 160 V 70 H 200 V 120 H 160 V 160 H 100 V 120 H 60 V 70 H 100 Z`
  return {
    scene: {
      outline,
      labels: [lab(130, 20, cm(t)), lab(48, 95, cm(a), 'end')],
      ticks: [tick(100, 30, 160, 30, 1), tick(60, 70, 60, 120, 1)],
    },
    calc: `4 × ${fmt(a)}`,
    value: r2(4 * a),
  }
}

function stairs2(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 3, 5)
  const outline = `M 40 150 H 220 V 100 H 150 V 50 H 40 Z`
  return {
    scene: {
      outline,
      labels: [lab(28, 100, cm(s), 'end'), lab(95, 40, cm(s)), lab(185, 90, cm(s))],
      ticks: [tick(40, 50, 40, 150, 2), tick(40, 150, 220, 150, 2)],
      rights: [right(40, 150, 1, 0, 0, -1), right(220, 150, -1, 0, 0, -1), right(40, 50, 1, 0, 0, 1)],
    },
    calc: `6 × ${fmt(s)}`,
    value: r2(6 * s),
  }
}

function stairs3(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 2, 4)
  const outline = `M 36 155 H 224 V 120 H 170 V 85 H 116 V 50 H 36 Z`
  return {
    scene: {
      outline,
      labels: [lab(24, 102, cm(s), 'end'), lab(200, 168, cm(s))],
      ticks: [tick(36, 50, 36, 155, 1), tick(36, 155, 224, 155, 1)],
    },
    calc: `8 × ${fmt(s)}`,
    value: r2(8 * s),
  }
}

function frameRect(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 8, 12)
  const H = nLen(rng, difficulty, 5, 8)
  const t = nLen(rng, difficulty, 1, 2)
  return {
    scene: {
      outline: `M 40 36 H 220 V 154 H 40 Z M 68 60 H 192 V 130 H 68 Z`,
      labels: [lab(130, 26, cm(L)), lab(230, 95, cm(H), 'start'), lab(78, 78, cm(t), 'start')],
    },
    calc: `2 × (${fmt(L)} + ${fmt(H)}) + 2 × (${fmt(L - 2 * t)} + ${fmt(H - 2 * t)})`,
    value: r2(2 * (L + H) + 2 * (L - 2 * t + H - 2 * t)),
  }
}

function halfRing(rng: Rng, difficulty: Difficulty): Draft {
  const R = nLen(rng, difficulty, 5, 7)
  const r = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 50 140 A 80 80 0 0 1 210 140 H 176 A 46 46 0 0 0 84 140 Z`,
      helpers: [{ d: 'M 50 140 H 210', dashed: true }],
      labels: [lab(130, 48, cm(R)), lab(130, 100, cm(r))],
    },
    calc: `3,14 × ${fmt(R)} + 3,14 × ${fmt(r)} + ${fmt(R - r)} + ${fmt(R - r)}`,
    value: r2(PI * R + PI * r + 2 * (R - r)),
    usesPi: true,
  }
}

function quarterFan(rng: Rng, difficulty: Difficulty): Draft {
  const r = nLen(rng, difficulty, 5, 9)
  return {
    scene: {
      outline: `M 60 150 H 200 A 140 140 0 0 0 60 10 Z`,
      labels: [lab(130, 168, cm(r)), lab(48, 80, cm(r), 'end')],
      rights: [right(60, 150, 1, 0, 0, -1)],
    },
    calc: `3,14 × ${fmt(r)} / 2 + ${fmt(r)} + ${fmt(r)}`,
    value: r2((PI * r) / 2 + 2 * r),
    usesPi: true,
  }
}

function iceCream(rng: Rng, difficulty: Difficulty): Draft {
  const r = nLen(rng, difficulty, 3, 5)
  const side = nLen(rng, difficulty, 6, 9)
  return {
    scene: {
      outline: `M 80 80 A 50 50 0 0 1 180 80 L 130 165 Z`,
      helpers: [{ d: 'M 80 80 H 180', dashed: true }],
      labels: [lab(130, 38, cm(r)), lab(200, 120, cm(side), 'start')],
      ticks: [tick(80, 80, 130, 165, 1), tick(180, 80, 130, 165, 1)],
    },
    calc: `3,14 × ${fmt(r)} + ${fmt(side)} + ${fmt(side)}`,
    value: r2(PI * r + 2 * side),
    usesPi: true,
  }
}

function arrowUp(rng: Rng, difficulty: Difficulty): Draft {
  const w = nLen(rng, difficulty, 4, 6)
  const h = nLen(rng, difficulty, 5, 8)
  const roof = nLen(rng, difficulty, 5, 7)
  return {
    scene: {
      outline: `M 90 80 L 130 28 L 170 80 V 155 H 90 Z`,
      labels: [lab(80, 118, cm(h), 'end'), lab(130, 168, cm(w)), lab(168, 46, cm(roof))],
      rights: [right(90, 155, 1, 0, 0, -1), right(170, 155, -1, 0, 0, -1)],
    },
    calc: `${fmt(w)} + ${fmt(h)} + ${fmt(h)} + ${fmt(roof)} + ${fmt(roof)}`,
    value: r2(w + 2 * h + 2 * roof),
  }
}

function hexagon(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 3, 6)
  return {
    scene: {
      outline: `M 130 28 L 200 62 L 200 128 L 130 162 L 60 128 L 60 62 Z`,
      labels: [lab(130, 18, cm(s))],
      ticks: [
        tick(130, 28, 200, 62, 1),
        tick(200, 62, 200, 128, 1),
        tick(200, 128, 130, 162, 1),
        tick(130, 162, 60, 128, 1),
        tick(60, 128, 60, 62, 1),
        tick(60, 62, 130, 28, 1),
      ],
    },
    calc: `6 × ${fmt(s)}`,
    value: r2(6 * s),
  }
}

function windowArch(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 5, 8)
  const H = nLen(rng, difficulty, 4, 6)
  const r = L / 2
  return {
    scene: {
      outline: `M 70 95 A 60 60 0 0 1 190 95 V 155 H 70 Z`,
      helpers: [{ d: 'M 70 95 H 190', dashed: true }],
      labels: [lab(58, 125, cm(H), 'end'), lab(130, 168, cm(L))],
      ticks: [tick(70, 95, 70, 155, 1), tick(190, 95, 190, 155, 1)],
    },
    calc: `${fmt(L)} + ${fmt(H)} + ${fmt(H)} + 3,14 × ${fmt(r)}`,
    value: r2(L + 2 * H + PI * r),
    usesPi: true,
  }
}

function bridge(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 8, 12)
  const H = nLen(rng, difficulty, 3, 5)
  const r = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 36 60 H 224 V 130 H 176 A 28 28 0 0 0 84 130 H 36 Z`,
      helpers: [{ d: 'M 84 130 H 176', dashed: true }],
      labels: [lab(130, 50, cm(L)), lab(28, 95, cm(H), 'end'), lab(130, 150, cm(2 * r))],
    },
    calc: `${fmt(L)} + ${fmt(H)} + ${fmt(H)} + ${fmt(L - 2 * r)} + 3,14 × ${fmt(r)}`,
    value: r2(L + 2 * H + (L - 2 * r) + PI * r),
    usesPi: true,
  }
}

function zBar(rng: Rng, difficulty: Difficulty): Draft {
  const a = nLen(rng, difficulty, 7, 10)
  const t = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 40 40 H 200 V 80 H 110 V 110 H 220 V 150 H 60 V 110 H 150 V 80 H 40 Z`,
      labels: [lab(120, 30, cm(a)), lab(28, 60, cm(t), 'end')],
      ticks: [tick(40, 40, 200, 40, 1), tick(60, 150, 220, 150, 1)],
    },
    calc: `2 × ${fmt(a)} + 6 × ${fmt(t)}`,
    value: r2(2 * a + 6 * t),
  }
}

function hShape(rng: Rng, difficulty: Difficulty): Draft {
  const H = nLen(rng, difficulty, 6, 9)
  const g = nLen(rng, difficulty, 3, 5)
  const t = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 50 36 H 95 V 78 H 165 V 36 H 210 V 154 H 165 V 112 H 95 V 154 H 50 Z`,
      labels: [lab(36, 95, cm(H), 'end'), lab(130, 70, cm(g)), lab(72, 26, cm(t))],
    },
    calc: `4 × ${fmt(H)} + 2 × ${fmt(g)} + 2 × ${fmt(t)}`,
    value: r2(4 * H + 2 * g + 2 * t),
  }
}

function flagTri(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 6, 9)
  const H = nLen(rng, difficulty, 4, 6)
  const s = nLen(rng, difficulty, 5, 7)
  return {
    scene: {
      outline: `M 40 50 H 150 L 230 95 L 150 140 H 40 Z`,
      helpers: [{ d: 'M 150 50 V 140', dashed: true }],
      labels: [lab(95, 40, cm(L)), lab(28, 95, cm(H), 'end'), lab(200, 64, cm(s))],
      ticks: [tick(150, 50, 230, 95, 1), tick(150, 140, 230, 95, 1)],
      rights: [right(40, 50, 1, 0, 0, 1), right(40, 140, 1, 0, 0, -1)],
    },
    calc: `${fmt(L)} + ${fmt(H)} + ${fmt(L)} + ${fmt(s)} + ${fmt(s)}`,
    value: r2(2 * L + H + 2 * s),
  }
}

function kiteTail(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 4, 6)
  const t = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 130 24 L 190 80 L 150 80 L 150 155 H 110 V 80 L 70 80 Z`,
      labels: [lab(88, 44, cm(s)), lab(100, 168, cm(t))],
      ticks: [tick(130, 24, 70, 80, 1), tick(130, 24, 190, 80, 1)],
    },
    calc: `4 × ${fmt(s)} + 2 × ${fmt(t)}`,
    value: r2(4 * s + 2 * t),
  }
}

function sectorThird(rng: Rng, difficulty: Difficulty): Draft {
  const r = nLen(rng, difficulty, 5, 8)
  return {
    scene: {
      outline: `M 130 110 L 210 70 A 90 90 0 0 0 50 70 Z`,
      labels: [lab(176, 100, cm(r), 'start'), lab(84, 100, cm(r), 'end')],
    },
    calc: `(1/3) × 2 × 3,14 × ${fmt(r)} + ${fmt(r)} + ${fmt(r)}`,
    value: r2((2 * PI * r) / 3 + 2 * r),
    usesPi: true,
  }
}

function rectQuarters(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 6, 9)
  const H = nLen(rng, difficulty, 4, 6)
  const r = H / 2
  return {
    scene: {
      outline: `M 70 50 H 190 A 40 40 0 0 1 190 130 H 70 A 40 40 0 0 1 70 50 Z`,
      labels: [lab(130, 40, cm(L)), lab(58, 90, cm(H), 'end')],
    },
    calc: `${fmt(L)} + ${fmt(L)} + 3,14 × ${fmt(r)} + 3,14 × ${fmt(r)}`,
    value: r2(2 * L + 2 * PI * r),
    usesPi: true,
  }
}

function foldedCorner(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 8, 11)
  const H = nLen(rng, difficulty, 5, 8)
  const c = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 50 40 H 180 L 210 70 V 150 H 50 Z`,
      labels: [
        lab(115, 30, cm(L - c)),
        lab(204, 52, cm(c), 'start'),
        lab(222, 110, cm(H - c), 'start'),
        lab(130, 168, cm(L)),
        lab(38, 95, cm(H), 'end'),
      ],
      rights: [right(50, 40, 1, 0, 0, 1), right(50, 150, 1, 0, 0, -1), right(210, 150, -1, 0, 0, -1)],
    },
    calc: `${fmt(L - c)} + ${fmt(c)} + ${fmt(H - c)} + ${fmt(L)} + ${fmt(H)}`,
    value: r2(L - c + c + H - c + L + H),
  }
}

function diamondCut(rng: Rng, difficulty: Difficulty): Draft {
  const s = nLen(rng, difficulty, 4, 7)
  const c = nLen(rng, difficulty, 2, 3)
  return {
    scene: {
      outline: `M 130 28 L 200 80 L 170 110 L 130 162 L 60 95 Z`,
      labels: [lab(86, 52, cm(s)), lab(196, 102, cm(c), 'start')],
      ticks: [tick(130, 28, 60, 95, 1), tick(60, 95, 130, 162, 1), tick(130, 162, 170, 110, 1)],
    },
    calc: `3 × ${fmt(s)} + ${fmt(c)} + ${fmt(c)}`,
    value: r2(3 * s + 2 * c),
  }
}

function doubleEll(rng: Rng, difficulty: Difficulty): Draft {
  const L = nLen(rng, difficulty, 5, 8)
  const s = nLen(rng, difficulty, 3, 5)
  return {
    scene: {
      outline: `M 40 95 L 80 40 H 180 L 220 95 L 180 150 H 80 Z`,
      labels: [lab(130, 30, cm(L)), lab(52, 60, cm(s))],
      ticks: [
        tick(40, 95, 80, 40, 1),
        tick(40, 95, 80, 150, 1),
        tick(180, 40, 220, 95, 1),
        tick(180, 150, 220, 95, 1),
        tick(80, 40, 180, 40, 2),
        tick(80, 150, 180, 150, 2),
      ],
    },
    calc: `2 × ${fmt(L)} + 4 × ${fmt(s)}`,
    value: r2(2 * L + 4 * s),
  }
}

function cutHex(rng: Rng, difficulty: Difficulty): Draft {
  const B = nLen(rng, difficulty, 7, 10)
  const h = nLen(rng, difficulty, 4, 6)
  const s = nLen(rng, difficulty, 3, 5)
  return {
    scene: {
      outline: `M 50 70 L 90 36 H 200 V 150 H 50 Z`,
      labels: [
        lab(130, 168, cm(B)),
        lab(222, 95, cm(h), 'start'),
        lab(145, 26, cm(s)),
        lab(60, 46, 'x'),
      ],
      ticks: [tick(50, 70, 90, 36, 1), tick(90, 36, 200, 36, 1)],
    },
    calc: `x = ${fmt(s)} ; ${fmt(B)} + ${fmt(h)} + ${fmt(B - s)} + ${fmt(s)} + ${fmt(h)} + ${fmt(s)}`,
    value: r2(B + h + B - s + s + h + s),
    hasX: true,
  }
}

const MAKERS: Array<(rng: Rng, difficulty: Difficulty) => Draft> = [
  houseAnnex,
  flagRect,
  kiteBites,
  cushion,
  archBites,
  chapel,
  tub,
  stadium,
  threeQuarter,
  cutCorner,
  notchedSquare,
  houseX,
  trapX,
  ellX,
  cutHex,
  uShape,
  tShape,
  plusShape,
  stairs2,
  stairs3,
  frameRect,
  halfRing,
  quarterFan,
  iceCream,
  arrowUp,
  hexagon,
  windowArch,
  bridge,
  zBar,
  hShape,
  flagTri,
  kiteTail,
  sectorThird,
  rectQuarters,
  foldedCorner,
  diamondCut,
  doubleEll,
]

export function generatePerimetreCompose(rng: Rng, difficulty: Difficulty): MathItem {
  return itemOf(pick(rng, MAKERS)(rng, difficulty))
}

export function compositeTemplateCount(): number {
  return MAKERS.length
}

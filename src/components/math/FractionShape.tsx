/** Couleurs SVG fractions (portées depuis soutien-scolaire A4ModuleContent). */
const FRACTION_FILL = 'var(--purple)'
const FRACTION_FILL_LIGHT = 'color-mix(in srgb, var(--purple) 12%, #fff)'
const FRACTION_STROKE = 'var(--purple)'
const FRACTION_STROKE_LIGHT = 'color-mix(in srgb, var(--purple) 45%, #fff)'

export type ShapeKind = "rect" | "grid" | "square" | "triangle" | "circle" | "semicircle" | "quartercircle" | "hexagon";

export function FractionShape({ kind, d, colored, onToggle, scale = 1, missSet, extraSet }: {
  kind: ShapeKind;
  d: number;
  colored: Set<number>;
  onToggle?: (i: number) => void;
  scale?: number;
  missSet?: Set<number>;
  extraSet?: Set<number>;
}) {
  const toggle = onToggle;
  const s = scale;

  function cellFill(i: number): string {
    if (colored.has(i)) return FRACTION_FILL;
    if (missSet?.has(i)) return "#fbbf24";
    return FRACTION_FILL_LIGHT;
  }

  function xMark(cx: number, cy: number, r: number, i: number) {
    if (!extraSet?.has(i)) return null;
    return (
      <g key={`x-${i}`} pointerEvents="none">
        <line x1={cx - r} y1={cy - r} x2={cx + r} y2={cy + r} stroke="#d97706" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={cx + r} y1={cy - r} x2={cx - r} y2={cy + r} stroke="#d97706" strokeWidth={1.5} strokeLinecap="round" />
      </g>
    );
  }

  if (kind === "grid") {
    const cols = 10, cellW = 13, cellH = 10;
    const W = cols * cellW, H = 10 * cellH;
    return (
      <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
        {Array.from({ length: 100 }, (_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          return (
            <rect key={i} x={c * cellW} y={r * cellH} width={cellW} height={cellH}
              fill={colored.has(i) ? FRACTION_FILL : FRACTION_FILL_LIGHT}
              stroke={FRACTION_STROKE_LIGHT} strokeWidth={0.5}
              style={toggle ? { cursor: "pointer" } : {}}
              onClick={toggle ? () => toggle(i) : undefined}
            />
          );
        })}
        <rect x={0} y={0} width={W} height={H} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
      </svg>
    );
  }
  if (kind === "square") {
    const S = 100;
    const sqrtD = Math.round(Math.sqrt(d));
    const isGrid = sqrtD * sqrtD === d && d >= 4;
    if (d === 2) {
      return (
        <svg width={Math.round(S * s)} height={Math.round(S * s)} viewBox={`0 0 ${S} ${S}`} className="fraction-shape-svg">
          {[0, 1].map(k => (
            <rect key={k} x={k * 50} y={0} width={50} height={S}
              fill={cellFill(k)}
              stroke={FRACTION_STROKE} strokeWidth={1}
              style={toggle ? { cursor: "pointer" } : {}}
              onClick={toggle ? () => toggle(k) : undefined}
            />
          ))}
          <rect x={0} y={0} width={S} height={S} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
          {[0, 1].map(k => xMark(k * 50 + 25, S / 2, 12, k))}
        </svg>
      );
    }
    if (isGrid) {
      const cellSize = S / sqrtD;
      return (
        <svg width={Math.round(S * s)} height={Math.round(S * s)} viewBox={`0 0 ${S} ${S}`} className="fraction-shape-svg">
          {Array.from({ length: d }, (_, k) => {
            const r = Math.floor(k / sqrtD), c = k % sqrtD;
            return (
              <rect key={k} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize}
                fill={cellFill(k)}
                stroke={FRACTION_STROKE} strokeWidth={1}
                style={toggle ? { cursor: "pointer" } : {}}
                onClick={toggle ? () => toggle(k) : undefined}
              />
            );
          })}
          <rect x={0} y={0} width={S} height={S} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
          {Array.from({ length: d }, (_, k) => {
            const r = Math.floor(k / sqrtD), c = k % sqrtD;
            return xMark((c + 0.5) * cellSize, (r + 0.5) * cellSize, cellSize * 0.28, k);
          })}
        </svg>
      );
    }
    const stripH = S / d;
    return (
      <svg width={Math.round(S * s)} height={Math.round(S * s)} viewBox={`0 0 ${S} ${S}`} className="fraction-shape-svg">
        {Array.from({ length: d }, (_, k) => (
          <rect key={k} x={0} y={k * stripH} width={S} height={stripH}
            fill={cellFill(k)}
            stroke={FRACTION_STROKE} strokeWidth={1}
            style={toggle ? { cursor: "pointer" } : {}}
            onClick={toggle ? () => toggle(k) : undefined}
          />
        ))}
        <rect x={0} y={0} width={S} height={S} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
        {Array.from({ length: d }, (_, k) => xMark(S / 2, (k + 0.5) * stripH, Math.min(stripH * 0.28, 10), k))}
      </svg>
    );
  }
  if (kind === "triangle") {
    const W = 150, H = 130;
    const Ax = 75,  Ay = 5;
    const BLx = 5,  BLy = 125;
    const BRx = 145, BRy = 125;
    const Gx = 75,  Gy = 85;
    const MBx = 75, MBy = 125;
    const MLx = 40, MLy = 65;
    const MRx = 110, MRy = 65;
    const P10x = 51.7,  P10y = 45;
    const P01x = 98.3,  P01y = 45;
    const P20x = 28.3,  P20y = 85;
    const P02x = 121.7, P02y = 85;
    const P21x = 51.7,  P21y = 125;
    const P12x = 98.3,  P12y = 125;
    type Poly = number[][];
    let polygons: Poly[];
    switch (d) {
      case 2: polygons = [[[Ax,Ay],[MBx,MBy],[BLx,BLy]],[[Ax,Ay],[BRx,BRy],[MBx,MBy]]]; break;
      case 3: polygons = [[[Ax,Ay],[BRx,BRy],[Gx,Gy]],[[BRx,BRy],[BLx,BLy],[Gx,Gy]],[[BLx,BLy],[Ax,Ay],[Gx,Gy]]]; break;
      case 4: polygons = [[[Ax,Ay],[MRx,MRy],[MLx,MLy]],[[MLx,MLy],[MBx,MBy],[BLx,BLy]],[[MLx,MLy],[MRx,MRy],[MBx,MBy]],[[MRx,MRy],[BRx,BRy],[MBx,MBy]]]; break;
      case 6: polygons = [[[Ax,Ay],[MRx,MRy],[Gx,Gy]],[[MRx,MRy],[BRx,BRy],[Gx,Gy]],[[Gx,Gy],[BRx,BRy],[MBx,MBy]],[[Gx,Gy],[MBx,MBy],[BLx,BLy]],[[BLx,BLy],[MLx,MLy],[Gx,Gy]],[[MLx,MLy],[Ax,Ay],[Gx,Gy]]]; break;
      case 9: polygons = [[[Ax,Ay],[P01x,P01y],[P10x,P10y]],[[P10x,P10y],[Gx,Gy],[P20x,P20y]],[[P10x,P10y],[P01x,P01y],[Gx,Gy]],[[P01x,P01y],[P02x,P02y],[Gx,Gy]],[[P20x,P20y],[P21x,P21y],[BLx,BLy]],[[P20x,P20y],[Gx,Gy],[P21x,P21y]],[[Gx,Gy],[P12x,P12y],[P21x,P21y]],[[Gx,Gy],[P02x,P02y],[P12x,P12y]],[[P02x,P02y],[BRx,BRy],[P12x,P12y]]]; break;
      default:
        polygons = Array.from({ length: d }, (_, k) => {
          const t0 = k / d, t1 = (k + 1) / d;
          const y0 = Ay + t0 * (BLy - Ay), y1 = Ay + t1 * (BLy - Ay);
          const hw0 = t0 * (BRx - Ax), hw1 = t1 * (BRx - Ax);
          return k === 0 ? [[Ax,Ay],[Ax+hw1,y1],[Ax-hw1,y1]] : [[Ax-hw0,y0],[Ax+hw0,y0],[Ax+hw1,y1],[Ax-hw1,y1]];
        });
    }
    return (
      <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
        {polygons.map((poly, k) => (
          <polygon key={k}
            points={poly.map(([x, y]) => `${x},${y}`).join(' ')}
            fill={cellFill(k)}
            stroke={FRACTION_STROKE} strokeWidth={1}
            style={toggle ? { cursor: "pointer" } : {}}
            onClick={toggle ? () => toggle(k) : undefined}
          />
        ))}
        {polygons.map((poly, k) => {
          const cx = poly.reduce((sum, [x]) => sum + x!, 0) / poly.length;
          const cy = poly.reduce((sum, [, y]) => sum + y!, 0) / poly.length;
          return xMark(cx, cy, 8, k);
        })}
      </svg>
    );
  }
  if (kind === "circle") {
    const W = 120, H = 120, cx = 60, cy = 60, r = 52;
    const sliceAngle = (2 * Math.PI) / d;
    return (
      <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
        {Array.from({ length: d }, (_, k) => {
          const a0 = -Math.PI / 2 + k * sliceAngle;
          const a1 = -Math.PI / 2 + (k + 1) * sliceAngle;
          const x1 = cx + r * Math.cos(a0), y1 = cy + r * Math.sin(a0);
          const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
          const largeArc = sliceAngle > Math.PI ? 1 : 0;
          const pathD = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
          return (
            <path key={k} d={pathD}
              fill={cellFill(k)}
              stroke={FRACTION_STROKE} strokeWidth={1}
              style={toggle ? { cursor: "pointer" } : {}}
              onClick={toggle ? () => toggle(k) : undefined}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
        {Array.from({ length: d }, (_, k) => {
          const midAngle = -Math.PI / 2 + (k + 0.5) * sliceAngle;
          return xMark(cx + r * 0.5 * Math.cos(midAngle), cy + r * 0.5 * Math.sin(midAngle), r * 0.2, k);
        })}
      </svg>
    );
  }
  if (kind === "semicircle") {
    // viewBox 0 0 100 56, R=48, center=(50,50) — flat edge at bottom
    const W = 100, H = 56, scx = 50, scy = 50, sr = 48;
    const sliceAngle = Math.PI / d;
    return (
      <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
        {Array.from({ length: d }, (_, k) => {
          // sectors go from right (angle=0) counter-clockwise through top to left (angle=π)
          const a0 = k * sliceAngle;
          const a1 = (k + 1) * sliceAngle;
          const x1 = scx + sr * Math.cos(a0), y1 = scy - sr * Math.sin(a0);
          const x2 = scx + sr * Math.cos(a1), y2 = scy - sr * Math.sin(a1);
          const pathD = `M ${scx} ${scy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${sr} ${sr} 0 0 0 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
          return (
            <path key={k} d={pathD}
              fill={cellFill(k)}
              stroke={FRACTION_STROKE} strokeWidth={1}
              style={toggle ? { cursor: "pointer" } : {}}
              onClick={toggle ? () => toggle(k) : undefined}
            />
          );
        })}
        {/* outline: semicircle arc + flat base */}
        <path d={`M ${scx - sr} ${scy} A ${sr} ${sr} 0 0 1 ${scx + sr} ${scy} Z`} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
        {Array.from({ length: d }, (_, k) => {
          const midA = (k + 0.5) * sliceAngle;
          return xMark(scx + sr * 0.55 * Math.cos(midA), scy - sr * 0.55 * Math.sin(midA), 6, k);
        })}
      </svg>
    );
  }
  if (kind === "quartercircle") {
    // viewBox 0 0 100 100, R=96, corner at bottom-left (2,98)
    const W = 100, H = 100, qcx = 2, qcy = 98, qr = 96;
    const sliceAngle = (Math.PI / 2) / d;
    return (
      <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
        {Array.from({ length: d }, (_, k) => {
          const a0 = k * sliceAngle;
          const a1 = (k + 1) * sliceAngle;
          const x1 = qcx + qr * Math.cos(a0), y1 = qcy - qr * Math.sin(a0);
          const x2 = qcx + qr * Math.cos(a1), y2 = qcy - qr * Math.sin(a1);
          const pathD = `M ${qcx} ${qcy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${qr} ${qr} 0 0 0 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
          return (
            <path key={k} d={pathD}
              fill={cellFill(k)}
              stroke={FRACTION_STROKE} strokeWidth={1}
              style={toggle ? { cursor: "pointer" } : {}}
              onClick={toggle ? () => toggle(k) : undefined}
            />
          );
        })}
        <path d={`M ${qcx} ${qcy} L ${qcx + qr} ${qcy} A ${qr} ${qr} 0 0 0 ${qcx} ${qcy - qr} Z`} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
        {Array.from({ length: d }, (_, k) => {
          const midA = (k + 0.5) * sliceAngle;
          return xMark(qcx + qr * 0.55 * Math.cos(midA), qcy - qr * 0.55 * Math.sin(midA), 6, k);
        })}
      </svg>
    );
  }
  if (kind === "hexagon") {
    // Regular hexagon, flat-top orientation, center (50,50), circumradius=46
    // Vertices: v0=(96,50), v1=(73,10), v2=(27,10), v3=(4,50), v4=(27,90), v5=(73,90)
    const hcx = 50, hcy = 50, hR = 46;
    const vx = (i: number) => hcx + hR * Math.cos((i * Math.PI) / 3);
    const vy = (i: number) => hcy - hR * Math.sin((i * Math.PI) / 3);
    // 6 vertices
    const V: [number, number][] = Array.from({ length: 6 }, (_, i) => [vx(i), vy(i)]);
    // edge midpoints
    const M: [number, number][] = Array.from({ length: 6 }, (_, i) => [(V[i]![0] + V[(i + 1) % 6]![0]) / 2, (V[i]![1] + V[(i + 1) % 6]![1]) / 2]);
    const C: [number, number] = [hcx, hcy];

    // Build polygon list per d
    let polygons: [number, number][][];
    if (d === 2) {
      polygons = [
        [V[0]!, V[1]!, V[2]!, V[3]!],
        [V[3]!, V[4]!, V[5]!, V[0]!],
      ];
    } else if (d === 3) {
      polygons = [
        [C, V[0]!, V[1]!, V[2]!],
        [C, V[2]!, V[3]!, V[4]!],
        [C, V[4]!, V[5]!, V[0]!],
      ];
    } else if (d === 4) {
      polygons = [
        [C, V[0]!, V[1]!, M[1]!],
        [C, M[1]!, V[2]!, V[3]!],
        [C, V[3]!, V[4]!, M[4]!],
        [C, M[4]!, V[5]!, V[0]!],
      ];
    } else if (d === 6) {
      polygons = Array.from({ length: 6 }, (_, i) => [C, V[i]!, V[(i + 1) % 6]!]);
    } else if (d === 9) {
      // 3 rhombuses (like d=3), each split into 3 equal parallelograms
      // by lines parallel to the rhombus's short diagonal
      polygons = [];
      const lerp = (p: [number,number], q: [number,number], f: number): [number,number] => [p[0]+(q[0]-p[0])*f, p[1]+(q[1]-p[1])*f];
      for (let r = 0; r < 3; r++) {
        const vi0 = V[(r * 2) % 6]!;
        const vi1 = V[(r * 2 + 1) % 6]!;
        const vi2 = V[(r * 2 + 2) % 6]!;
        // Rhombus vertices: C, vi0, vi1, vi2
        // Lines parallel to vi0–vi2 at 1/3 and 2/3 from C toward vi1
        const p0a = lerp(C, vi0, 1/3), p0b = lerp(C, vi0, 2/3);
        const p1a = lerp(C, vi1, 1/3), p1b = lerp(C, vi1, 2/3);
        const p2a = lerp(C, vi2, 1/3), p2b = lerp(C, vi2, 2/3);
        polygons.push([C,   p0a, p1a, p2a]);
        polygons.push([p0a, p0b, p1b, p2b, p2a, p1a]);
        polygons.push([p0b, vi0, vi1, vi2, p2b, p1b]);
      }
    } else if (d === 12) {
      // 12 triangles: center → each vertex and adjacent edge midpoint
      polygons = Array.from({ length: 6 }, (_, i) => [
        [C, V[i]!, M[i]!] as [number,number][],
        [C, M[i]!, V[(i + 1) % 6]!] as [number,number][],
      ]).flat();
    } else {
      // fallback: all 6 triangles (d=6)
      polygons = Array.from({ length: 6 }, (_, i) => [C, V[i]!, V[(i + 1) % 6]!]);
    }

    const polyPoints = (pts: [number,number][]) => pts.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const polyCx = (pts: [number,number][]) => pts.reduce((s,[x]) => s+x, 0) / pts.length;
    const polyCy = (pts: [number,number][]) => pts.reduce((s,[,y]) => s+y, 0) / pts.length;

    return (
      <svg width={Math.round(100 * s)} height={Math.round(100 * s)} viewBox="0 0 100 100" className="fraction-shape-svg">
        {polygons.map((poly, k) => (
          <polygon key={k}
            points={polyPoints(poly)}
            fill={cellFill(k)}
            stroke={FRACTION_STROKE} strokeWidth={1}
            style={toggle ? { cursor: "pointer" } : {}}
            onClick={toggle ? () => toggle(k) : undefined}
          />
        ))}
        <polygon points={V.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
        {polygons.map((poly, k) => xMark(polyCx(poly), polyCy(poly), 5, k))}
      </svg>
    );
  }
  // rect: d equal vertical strips
  const W = 220, H = 52;
  const cellW = W / d;
  return (
    <svg width={Math.round(W * s)} height={Math.round(H * s)} viewBox={`0 0 ${W} ${H}`} className="fraction-shape-svg">
      {Array.from({ length: d }, (_, i) => {
        const x = Math.round(i * cellW);
        const w = Math.round((i + 1) * cellW) - x;
        return (
          <rect key={i} x={x} y={0} width={w} height={H}
            fill={cellFill(i)}
            stroke={FRACTION_STROKE} strokeWidth={1}
            style={toggle ? { cursor: "pointer" } : {}}
            onClick={toggle ? () => toggle(i) : undefined}
          />
        );
      })}
      <rect x={0} y={0} width={W} height={H} fill="none" stroke={FRACTION_STROKE} strokeWidth={1.5} />
      {Array.from({ length: d }, (_, i) => {
        const x = Math.round(i * cellW);
        const w = Math.round((i + 1) * cellW) - x;
        return xMark(x + w / 2, H / 2, Math.min(w * 0.28, 10), i);
      })}
    </svg>
  );
}

// ── Multi-shape helpers ────────────────────────────────────────────────────────
export function naturalW(kind: ShapeKind): number {
  return { rect: 220, square: 100, triangle: 150, circle: 120, grid: 130, semicircle: 100, quartercircle: 100, hexagon: 100 }[kind] ?? 120;
}
export function computeScale(kind: ShapeKind, copies: number): number {
  if (copies <= 1) return 1;
  const available = 200;
  const gap = 8 * (copies - 1);
  const perShape = Math.floor((available - gap) / copies);
  return Math.min(1, perShape / naturalW(kind));
}
export function preColorFlat(n: number, d: number): Set<number> {
  const s = new Set<number>();
  let rem = n;
  let copy = 0;
  while (rem > 0) { for (let k = 0; k < Math.min(d, rem); k++) s.add(copy * d + k); rem -= Math.min(d, rem); copy++; }
  return s;
}

export function ShapesRow({ kind, d, copies, colored, onToggle, scale, missSet, extraSet }: {
  kind: ShapeKind; d: number; copies: number;
  colored: Set<number>;
  onToggle?: (flatIdx: number) => void;
  scale?: number;
  missSet?: Set<number>;
  extraSet?: Set<number>;
}) {
  return (
    <div className="fraction-shapes-row">
      {Array.from({ length: copies }, (_, copy) => {
        const copySet = new Set(Array.from({ length: d }, (_, k) => k).filter(k => colored.has(copy * d + k)));
        const copyMissSet = missSet ? new Set(Array.from({ length: d }, (_, k) => k).filter(k => missSet.has(copy * d + k))) : undefined;
        const copyExtraSet = extraSet ? new Set(Array.from({ length: d }, (_, k) => k).filter(k => extraSet.has(copy * d + k))) : undefined;
        const handleToggle = onToggle ? (ci: number) => onToggle(copy * d + ci) : undefined;
        return <FractionShape key={copy} kind={kind} d={d} colored={copySet} onToggle={handleToggle} scale={scale} missSet={copyMissSet} extraSet={copyExtraSet} />;
      })}
    </div>
  );
}

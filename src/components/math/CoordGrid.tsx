import { clipLineToRange, STROKE_DASH, STROKE_LABEL } from '@/math/coord-droites'
import { COORD_SHAPE_LABEL, axisTickLabel, columnLetter, formatAxesNum } from '@/math/coord-reperage'
import type { CoordLine, CoordScene, CoordShape } from '@/math/types'

type Pt = { x: number; y: number; label?: string }

const SIZE = 140
const PAD = 18
const RANGE = 5

function toSvg(x: number, y: number): { cx: number; cy: number } {
  const scale = (SIZE - 2 * PAD) / (2 * RANGE)
  return {
    cx: PAD + (x + RANGE) * scale,
    cy: PAD + (RANGE - y) * scale,
  }
}

export function CoordShapeGlyph({
  kind,
  x,
  y,
  size = 10,
}: {
  kind: CoordShape
  x: number
  y: number
  size?: number
}) {
  const r = size
  switch (kind) {
    case 'point':
      return <circle cx={x} cy={y} r={r * 0.38} />
    case 'circle':
      return <circle cx={x} cy={y} r={r * 0.55} fill="none" stroke="currentColor" strokeWidth={1.4} />
    case 'triangle':
      return (
        <polygon
          points={`${x},${y - r * 0.7} ${x + r * 0.68},${y + r * 0.52} ${x - r * 0.68},${y + r * 0.52}`}
        />
      )
    case 'square':
      return <rect x={x - r * 0.5} y={y - r * 0.5} width={r} height={r} />
    case 'diamond':
      return <polygon points={`${x},${y - r * 0.7} ${x + r * 0.55},${y} ${x},${y + r * 0.7} ${x - r * 0.55},${y}`} />
    case 'star': {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5
        const rad = i % 2 === 0 ? r * 0.74 : r * 0.32
        return `${x + Math.cos(a) * rad},${y + Math.sin(a) * rad}`
      })
      return <polygon points={pts.join(' ')} />
    }
    case 'plus':
      return (
        <path
          d={`M${x - r * 0.18} ${y - r * 0.7} h${r * 0.36} v${r * 0.52} h${r * 0.52} v${r * 0.36} h${-r * 0.52} v${r * 0.52} h${-r * 0.36} v${-r * 0.52} h${-r * 0.52} v${-r * 0.36} h${r * 0.52} z`}
        />
      )
    case 'heart':
      return (
        <path
          d={`M${x} ${y + r * 0.62} C${x - r} ${y - r * 0.05}, ${x - r * 0.15} ${y - r * 0.85}, ${x} ${y - r * 0.28} C${x + r * 0.15} ${y - r * 0.85}, ${x + r} ${y - r * 0.05}, ${x} ${y + r * 0.62}z`}
        />
      )
    case 'pentagon': {
      const pts = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
        return `${x + Math.cos(a) * r * 0.68},${y + Math.sin(a) * r * 0.68}`
      })
      return <polygon points={pts.join(' ')} />
    }
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 3
        return `${x + Math.cos(a) * r * 0.7},${y + Math.sin(a) * r * 0.7}`
      })
      return <polygon points={pts.join(' ')} />
    }
    case 'oval':
      return <ellipse cx={x} cy={y} rx={r * 0.42} ry={r * 0.68} />
    case 'crescent':
      return (
        <path
          d={`M${x + r * 0.12} ${y - r * 0.62} A ${r * 0.64} ${r * 0.64} 0 1 0 ${x + r * 0.12} ${y + r * 0.62} A ${r * 0.46} ${r * 0.46} 0 1 1 ${x + r * 0.12} ${y - r * 0.62}z`}
        />
      )
    case 'arrow':
      return (
        <polygon
          points={`${x},${y - r * 0.74} ${x + r * 0.54},${y - r * 0.06} ${x + r * 0.18},${y - r * 0.06} ${x + r * 0.18},${y + r * 0.7} ${x - r * 0.18},${y + r * 0.7} ${x - r * 0.18},${y - r * 0.06} ${x - r * 0.54},${y - r * 0.06}`}
        />
      )
    case 'cross':
      return (
        <polygon
          points={`${x - r * 0.55},${y - r * 0.7} ${x - r * 0.28},${y - r * 0.7} ${x},${y - r * 0.18} ${x + r * 0.28},${y - r * 0.7} ${x + r * 0.55},${y - r * 0.7} ${x + r * 0.22},${y} ${x + r * 0.55},${y + r * 0.7} ${x + r * 0.28},${y + r * 0.7} ${x},${y + r * 0.18} ${x - r * 0.28},${y + r * 0.7} ${x - r * 0.55},${y + r * 0.7} ${x - r * 0.22},${y}`}
        />
      )
    case 'trapezoid':
      return (
        <polygon
          points={`${x - r * 0.32},${y - r * 0.48} ${x + r * 0.32},${y - r * 0.48} ${x + r * 0.7},${y + r * 0.52} ${x - r * 0.7},${y + r * 0.52}`}
        />
      )
    case 'house':
      return (
        <polygon
          points={`${x},${y - r * 0.74} ${x + r * 0.68},${y - r * 0.1} ${x + r * 0.68},${y + r * 0.64} ${x - r * 0.68},${y + r * 0.64} ${x - r * 0.68},${y - r * 0.1}`}
        />
      )
    default:
      return <circle cx={x} cy={y} r={r * 0.4} />
  }
}

export function CoordShapeButton({ kind, size = 22 }: { kind: CoordShape; size?: number }) {
  return (
    <svg viewBox="0 0 22 22" width={size} height={size} aria-hidden>
      <g fill="currentColor" stroke="currentColor" strokeWidth={0.6} strokeLinejoin="round">
        <CoordShapeGlyph kind={kind} x={11} y={11} size={8} />
      </g>
    </svg>
  )
}

function mmPads() {
  return { padL: 7, padR: 5, padT: 5, padB: 7 }
}

function cellCenterMm(rows: number, x: number, y: number, padL: number, padT: number, cellMm: number) {
  return {
    cx: padL + (x - 0.5) * cellMm,
    cy: padT + (rows - y + 0.5) * cellMm,
  }
}

function CellsScene({
  scene,
  editable,
  onPlace,
  onRemove,
}: {
  scene: CoordScene
  editable?: boolean
  onPlace?: (x: number, y: number) => void
  onRemove?: (x: number, y: number) => void
}) {
  const cellMm = scene.cellMm ?? 5
  const { padL, padR, padT, padB } = mmPads()
  const gridW = scene.cols * cellMm
  const gridH = scene.rows * cellMm
  const svgW = padL + gridW + padR
  const svgH = padT + gridH + padB
  const markAt = (x: number, y: number) => scene.marks.find((m) => m.x === x && m.y === y)
  const glyph = Math.max(1.4, cellMm * 0.32)

  return (
    <svg
      className="coord-grid scene-cells is-fixed-mm"
      width={`${svgW}mm`}
      height={`${svgH}mm`}
      viewBox={`0 0 ${svgW} ${svgH}`}
      role="img"
      aria-label="Tableau de repérage"
    >
      {Array.from({ length: scene.rows }, (_, i) => {
        const y = scene.rows - i
        const gy = padT + i * cellMm
        return (
          <g key={`h-${y}`}>
            <line x1={padL} y1={gy} x2={padL + gridW} y2={gy} className="grid-line" />
            <text x={padL - 1.4} y={gy + cellMm / 2 + 0.8} className="axis-label" textAnchor="end">
              {axisTickLabel(y, scene.axis, 'y')}
            </text>
          </g>
        )
      })}
      <line x1={padL} y1={padT + gridH} x2={padL + gridW} y2={padT + gridH} className="grid-line" />
      {Array.from({ length: scene.cols }, (_, i) => {
        const x = i + 1
        const gx = padL + i * cellMm
        return (
          <g key={`v-${x}`}>
            <line x1={gx} y1={padT} x2={gx} y2={padT + gridH} className="grid-line" />
            <text x={gx + cellMm / 2} y={padT + gridH + 3.4} className="axis-label" textAnchor="middle">
              {axisTickLabel(x, scene.axis, 'x')}
            </text>
          </g>
        )
      })}
      <line x1={padL + gridW} y1={padT} x2={padL + gridW} y2={padT + gridH} className="grid-line" />
      {Array.from({ length: scene.rows }, (_, i) =>
        Array.from({ length: scene.cols }, (_, j) => {
          const x = j + 1
          const y = scene.rows - i
          const { cx, cy } = cellCenterMm(scene.rows, x, y, padL, padT, cellMm)
          const mark = markAt(x, y)
          return (
            <g key={`c-${x}-${y}`}>
              {editable ? (
                <rect
                  x={padL + j * cellMm}
                  y={padT + i * cellMm}
                  width={cellMm}
                  height={cellMm}
                  className="coord-hit"
                  onClick={() => (mark ? onRemove?.(x, y) : onPlace?.(x, y))}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    onPlace?.(x, y)
                  }}
                />
              ) : null}
              {mark ? (
                <g fill="currentColor" stroke="currentColor" strokeWidth={0.22} strokeLinejoin="round">
                  <CoordShapeGlyph kind={mark.kind} x={cx} y={cy} size={glyph} />
                  {mark.label ? (
                    <text x={cx + 1.8} y={cy - 1.6} className="point-label">
                      {mark.label}
                    </text>
                  ) : null}
                </g>
              ) : null}
            </g>
          )
        }),
      )}
    </svg>
  )
}

function PolygonScene({ scene }: { scene: CoordScene }) {
  const size = 240
  const pad = 28
  const inner = size - 2 * pad
  const to = (x: number, y: number) => ({
    cx: pad + (x / scene.cols) * inner,
    cy: pad + ((scene.rows - y) / scene.rows) * inner,
  })
  const vertices = scene.vertices ?? []
  const path = vertices.map((v, i) => {
    const p = to(v.x, v.y)
    return `${i === 0 ? 'M' : 'L'}${p.cx} ${p.cy}`
  }).join(' ')

  return (
    <svg className="coord-grid scene-polygon" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Figure sur quadrillage">
      {Array.from({ length: scene.rows + 1 }, (_, i) => {
        const y = scene.rows - i
        const gy = pad + (i / scene.rows) * inner
        return (
          <g key={`h-${y}`}>
            <line x1={pad} y1={gy} x2={size - pad} y2={gy} className="grid-line" />
            <text x={pad - 6} y={gy + 3} className="axis-label" textAnchor="end">
              {y}
            </text>
          </g>
        )
      })}
      {Array.from({ length: scene.cols + 1 }, (_, i) => {
        const gx = pad + (i / scene.cols) * inner
        return (
          <g key={`v-${i}`}>
            <line x1={gx} y1={pad} x2={gx} y2={size - pad} className="grid-line" />
            <text x={gx} y={size - pad + 14} className="axis-label" textAnchor="middle">
              {i}
            </text>
          </g>
        )
      })}
      {path ? <path d={`${path} Z`} className="coord-poly" /> : null}
      {vertices.map((v) => {
        const p = to(v.x, v.y)
        return (
          <g key={v.label}>
            <circle cx={p.cx} cy={p.cy} r={3} className="grid-point" />
            <text x={p.cx + 5} y={p.cy - 5} className="point-label">
              {v.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function PolarScene({ scene }: { scene: CoordScene }) {
  const size = 240
  const cx = 120
  const cy = 120
  const maxR = 88
  const rays = scene.cols
  const rings = scene.rows

  const pos = (ray: number, ring: number) => {
    const a = -Math.PI / 2 + ((ray - 1) * 2 * Math.PI) / rays
    const r = (ring / rings) * maxR
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
  }

  return (
    <svg className="coord-grid scene-polar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Repère polaire">
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={((i + 1) / rings) * maxR} className="grid-line" fill="none" />
      ))}
      {Array.from({ length: rays }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / rays
        const ex = cx + Math.cos(a) * (maxR + 16)
        const ey = cy + Math.sin(a) * (maxR + 16)
        return (
          <g key={`r-${i}`}>
            <line x1={cx} y1={cy} x2={cx + Math.cos(a) * maxR} y2={cy + Math.sin(a) * maxR} className="axis-line" />
            <text x={ex} y={ey + 4} className="axis-label" textAnchor="middle">
              {columnLetter(i + 1)}
            </text>
          </g>
        )
      })}
      {scene.marks.map((mark, i) => {
        const p = pos(mark.x, mark.y)
        return (
          <g key={`${mark.kind}-${i}`} fill="currentColor" stroke="currentColor" strokeWidth={0.7}>
            <CoordShapeGlyph kind={mark.kind} x={p.x} y={p.y} size={9} />
          </g>
        )
      })}
    </svg>
  )
}

function AxesScene({
  scene,
  editable,
  onPlace,
  onRemove,
}: {
  scene: CoordScene
  editable?: boolean
  onPlace?: (x: number, y: number) => void
  onRemove?: (x: number, y: number) => void
}) {
  const cellMm = scene.cellMm ?? 5
  const unit = scene.unitSquares ?? 1
  const rangeX = scene.rangeX ?? scene.range ?? 5
  const rangeY = scene.rangeY ?? scene.range ?? 5
  const cols = scene.cols || Math.round(2 * rangeX * unit)
  const rows = scene.rows || Math.round(2 * rangeY * unit)
  const step = scene.step ?? 1
  const { padL, padR, padT, padB } = mmPads()
  const gridW = cols * cellMm
  const gridH = rows * cellMm
  const svgW = padL + gridW + padR
  const svgH = padT + gridH + padB
  const to = (x: number, y: number) => ({
    cx: padL + ((x + rangeX) / (2 * rangeX)) * gridW,
    cy: padT + ((rangeY - y) / (2 * rangeY)) * gridH,
  })
  const squareXs = Array.from({ length: cols + 1 }, (_, i) => Math.round((-rangeX + i / unit) * 1000) / 1000)
  const squareYs = Array.from({ length: rows + 1 }, (_, i) => Math.round((-rangeY + i / unit) * 1000) / 1000)
  const tickX: number[] = []
  const tickY: number[] = []
  const nx = Math.round((2 * rangeX) / step)
  const ny = Math.round((2 * rangeY) / step)
  for (let i = 0; i <= nx; i++) tickX.push(Math.round((-rangeX + i * step) * 1000) / 1000)
  for (let i = 0; i <= ny; i++) tickY.push(Math.round((-rangeY + i * step) * 1000) / 1000)
  const markAt = (x: number, y: number) => scene.marks.find((m) => m.x === x && m.y === y)
  const fineN = scene.fineGrid ? 5 : 0
  const labelStepX = rangeX >= 12 ? 2 : 1
  const labelStepY = rangeY >= 12 ? 2 : 1
  const dashScale = cellMm / 5

  return (
    <svg
      className={`coord-grid scene-axes is-fixed-mm${scene.fineGrid ? ' is-fine' : ''}`}
      width={`${svgW}mm`}
      height={`${svgH}mm`}
      viewBox={`0 0 ${svgW} ${svgH}`}
      role="img"
      aria-label="Repère à quatre cadrans"
    >
      {fineN
        ? Array.from({ length: cols * fineN + 1 }, (_, i) => {
            const v = Math.round((-rangeX + i / (unit * fineN)) * 1000) / 1000
            if (Number.isInteger(v * unit)) return null
            const h = to(v, 0)
            return <line key={`fx-${v}`} x1={h.cx} y1={padT} x2={h.cx} y2={padT + gridH} className="grid-line-fine" />
          })
        : null}
      {fineN
        ? Array.from({ length: rows * fineN + 1 }, (_, i) => {
            const v = Math.round((-rangeY + i / (unit * fineN)) * 1000) / 1000
            if (Number.isInteger(v * unit)) return null
            const p = to(0, v)
            return <line key={`fy-${v}`} x1={padL} y1={p.cy} x2={padL + gridW} y2={p.cy} className="grid-line-fine" />
          })
        : null}
      {squareXs.map((v) => {
        const h = to(v, 0)
        return (
          <line
            key={`vx-${v}`}
            x1={h.cx}
            y1={padT}
            x2={h.cx}
            y2={padT + gridH}
            className={v === 0 ? 'axis-line' : 'grid-line'}
          />
        )
      })}
      {squareYs.map((v) => {
        const p = to(0, v)
        return (
          <line
            key={`hy-${v}`}
            x1={padL}
            y1={p.cy}
            x2={padL + gridW}
            y2={p.cy}
            className={v === 0 ? 'axis-line' : 'grid-line'}
          />
        )
      })}
      {tickX
        .filter((v) => Number.isInteger(v) && v !== 0 && v % labelStepX === 0)
        .map((v) => {
          const onX = to(v, 0)
          return (
            <text key={`lx-${v}`} x={onX.cx} y={onX.cy + 3.2} className="axis-label" textAnchor="middle">
              {formatAxesNum(v)}
            </text>
          )
        })}
      {tickY
        .filter((v) => Number.isInteger(v) && v !== 0 && v % labelStepY === 0)
        .map((v) => {
          const onY = to(0, v)
          return (
            <text key={`ly-${v}`} x={onY.cx - 1.4} y={onY.cy + 0.8} className="axis-label" textAnchor="end">
              {formatAxesNum(v)}
            </text>
          )
        })}
      <text x={padL + gridW + 1.2} y={to(0, 0).cy - 1.2} className="axis-label">
        x
      </text>
      <text x={to(0, 0).cx + 1.4} y={padT - 1} className="axis-label">
        y
      </text>
      {(scene.lines ?? []).map((line) => {
        const clip = clipLineToRange(line, rangeX, rangeY)
        if (!clip) return null
        const a = to(clip.x1, clip.y1)
        const b = to(clip.x2, clip.y2)
        const dash = STROKE_DASH[line.stroke]
        return (
          <line
            key={line.id}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            className={`coord-line line-${line.color}`}
            strokeDasharray={dash ? dash.split(' ').map((n) => Number(n) * dashScale * 0.35).join(' ') : undefined}
          />
        )
      })}
      {(scene.paths ?? []).map((path) => {
        if (path.kind === 'line' && path.a != null && path.b != null && path.c != null) {
          const clip = clipLineToRange({ a: path.a, b: path.b, c: path.c }, rangeX, rangeY)
          if (!clip) return null
          const a = to(clip.x1, clip.y1)
          const b = to(clip.x2, clip.y2)
          return (
            <line
              key={path.id}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              className={`coord-path${path.stroke === 'dashed' ? ' is-dashed' : ''}`}
            />
          )
        }
        const pts = path.points ?? []
        if (pts.length < 2) return null
        const d = pts
          .map((pt, i) => {
            const p = to(pt.x, pt.y)
            return `${i === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`
          })
          .join(' ')
        const closed = path.kind === 'polygon' ? `${d} Z` : d
        return (
          <path
            key={path.id}
            d={closed}
            className={`coord-path${path.kind === 'polygon' ? ' is-poly' : ''}${
              path.stroke === 'dashed' ? ' is-dashed' : ''
            }`}
          />
        )
      })}
      {editable
        ? tickX.map((x) =>
            tickY.map((y) => {
              const p = to(x, y)
              const found = markAt(x, y)
              return (
                <circle
                  key={`h-${x}-${y}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={Math.max(1.1, cellMm / 2.4)}
                  className="coord-hit"
                  onClick={() => (found ? onRemove?.(x, y) : onPlace?.(x, y))}
                />
              )
            }),
          )
        : null}
      {scene.marks.map((found, i) => {
        const p = to(found.x, found.y)
        return (
          <g key={`m-${found.label ?? i}-${found.x}-${found.y}`}>
            <circle cx={p.cx} cy={p.cy} r={Math.max(0.85, cellMm * 0.22)} className="grid-point" />
            {found.label ? (
              <text
                x={p.cx + (found.x >= 0 ? 1.4 : -1.4)}
                y={p.cy + (found.y >= 0 ? -1.4 : 2.8)}
                className="point-label"
                textAnchor={found.x >= 0 ? 'start' : 'end'}
              >
                {found.label}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

function CoordLineLegend({ lines }: { lines: CoordLine[] }) {
  return (
    <ul className="coord-line-legend">
      {lines.map((line) => (
        <li key={line.id}>
          <svg className="coord-line-swatch" viewBox="0 0 28 10" aria-hidden>
            <line
              x1="1"
              y1="5"
              x2="27"
              y2="5"
              className={`coord-line line-${line.color}`}
              strokeDasharray={STROKE_DASH[line.stroke]}
            />
          </svg>
          <span>
            droite {line.name}
            <small> · {STROKE_LABEL[line.stroke]}</small>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function CoordGrid({
  point,
  pointImage,
  showImage,
  scene,
  editable,
  onPlace,
  onRemove,
}: {
  point?: Pt
  pointImage?: Pt
  showImage?: boolean
  scene?: CoordScene
  editable?: boolean
  onPlace?: (x: number, y: number) => void
  onRemove?: (x: number, y: number) => void
}) {
  if (scene?.variant === 'polygon') return <PolygonScene scene={scene} />
  if (scene?.variant === 'polar') return <PolarScene scene={scene} />
  if (scene?.variant === 'axes') {
    const lines = scene.lines ?? []
    const construct = Boolean(scene.paths?.length || scene.fineGrid)
    return (
      <div className={`coord-axes-wrap${lines.length || construct ? ' has-lines' : ''}`}>
        <AxesScene scene={scene} editable={editable} onPlace={onPlace} onRemove={onRemove} />
        {lines.length ? <CoordLineLegend lines={lines} /> : null}
      </div>
    )
  }
  if (scene?.variant === 'cells') {
    return <CellsScene scene={scene} editable={editable} onPlace={onPlace} onRemove={onRemove} />
  }

  const ticks = Array.from({ length: 2 * RANGE + 1 }, (_, i) => i - RANGE)
  return (
    <svg className="coord-grid" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Repère orthonormé">
      {ticks.map((t) => {
        const h = toSvg(t, 0)
        const v = toSvg(0, t)
        return (
          <g key={t}>
            <line x1={h.cx} y1={PAD} x2={h.cx} y2={SIZE - PAD} className="grid-line" />
            <line x1={PAD} y1={v.cy} x2={SIZE - PAD} y2={v.cy} className="grid-line" />
          </g>
        )
      })}
      <line x1={PAD} y1={toSvg(0, 0).cy} x2={SIZE - PAD} y2={toSvg(0, 0).cy} className="axis-line" />
      <line x1={toSvg(0, 0).cx} y1={PAD} x2={toSvg(0, 0).cx} y2={SIZE - PAD} className="axis-line" />
      <text x={SIZE - PAD + 2} y={toSvg(0, 0).cy - 4} className="axis-label">
        x
      </text>
      <text x={toSvg(0, 0).cx + 4} y={PAD - 2} className="axis-label">
        y
      </text>
      {point && (
        <g>
          <circle cx={toSvg(point.x, point.y).cx} cy={toSvg(point.x, point.y).cy} r={3.5} className="grid-point" />
          <text x={toSvg(point.x, point.y).cx + 5} y={toSvg(point.x, point.y).cy - 5} className="point-label">
            {point.label ?? 'A'}
          </text>
        </g>
      )}
      {showImage && pointImage && (
        <g>
          <circle
            cx={toSvg(pointImage.x, pointImage.y).cx}
            cy={toSvg(pointImage.x, pointImage.y).cy}
            r={3.5}
            className="grid-point image"
          />
          <text
            x={toSvg(pointImage.x, pointImage.y).cx + 5}
            y={toSvg(pointImage.x, pointImage.y).cy - 5}
            className="point-label"
          >
            {pointImage.label ?? "A'"}
          </text>
        </g>
      )}
    </svg>
  )
}

export function CoordEditorBoard({
  scene,
  selectedKind,
  onPlace,
  onRemove,
}: {
  scene: CoordScene
  selectedKind: CoordShape | null
  onPlace: (x: number, y: number, kind: CoordShape) => void
  onRemove: (x: number, y: number) => void
}) {
  const markAt = (x: number, y: number) => scene.marks.find((m) => m.x === x && m.y === y)
  return (
    <div className="coord-editor" aria-label="Tableau à composer">
      <div
        className="coord-editor-grid"
        style={{ gridTemplateColumns: `auto repeat(${scene.cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: scene.rows }, (_, i) => {
          const y = scene.rows - i
          return (
            <div className="coord-editor-row" key={`row-${y}`} style={{ display: 'contents' }}>
              <span className="coord-editor-label">{axisTickLabel(y, scene.axis, 'y')}</span>
              {Array.from({ length: scene.cols }, (_, j) => {
                const x = j + 1
                const mark = markAt(x, y)
                return (
                  <button
                    key={`${x}-${y}`}
                    type="button"
                    className={`coord-editor-cell${mark ? ' filled' : ''}`}
                    aria-label={`Case ${formatAria(x, y, scene.axis)}${mark ? `, ${COORD_SHAPE_LABEL[mark.kind]}` : ''}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      const kind = (event.dataTransfer.getData('coord-kind') || selectedKind) as CoordShape | ''
                      if (kind) onPlace(x, y, kind)
                    }}
                    onClick={() => {
                      if (mark) onRemove(x, y)
                      else if (selectedKind) onPlace(x, y, selectedKind)
                    }}
                  >
                    {mark ? <CoordShapeButton kind={mark.kind} size={16} /> : null}
                  </button>
                )
              })}
            </div>
          )
        })}
        <span className="coord-editor-label" />
        {Array.from({ length: scene.cols }, (_, i) => (
          <span className="coord-editor-label axis" key={`ax-${i}`}>
            {axisTickLabel(i + 1, scene.axis, 'x')}
          </span>
        ))}
      </div>
    </div>
  )
}

function formatAria(x: number, y: number, axis: CoordScene['axis']): string {
  return `${axisTickLabel(x, axis, 'x')} ; ${axisTickLabel(y, axis, 'y')}`
}

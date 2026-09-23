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

function cellCenter(cols: number, rows: number, x: number, y: number, pad: number, size: number) {
  const inner = size - 2 * pad
  return {
    cx: pad + ((x - 0.5) / cols) * inner,
    cy: pad + ((rows - y + 0.5) / rows) * inner,
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
  const size = 240
  const pad = 28
  const inner = size - 2 * pad
  const markAt = (x: number, y: number) => scene.marks.find((m) => m.x === x && m.y === y)

  return (
    <svg
      className="coord-grid scene-cells"
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Tableau de repérage"
    >
      {Array.from({ length: scene.rows }, (_, i) => {
        const y = scene.rows - i
        const gy = pad + (i / scene.rows) * inner
        return (
          <g key={`h-${y}`}>
            <line x1={pad} y1={gy} x2={size - pad} y2={gy} className="grid-line" />
            <text x={pad - 6} y={gy + inner / scene.rows / 2 + 3} className="axis-label" textAnchor="end">
              {axisTickLabel(y, scene.axis, 'y')}
            </text>
          </g>
        )
      })}
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} className="grid-line" />
      {Array.from({ length: scene.cols }, (_, i) => {
        const x = i + 1
        const gx = pad + (i / scene.cols) * inner
        return (
          <g key={`v-${x}`}>
            <line x1={gx} y1={pad} x2={gx} y2={size - pad} className="grid-line" />
            <text x={gx + inner / scene.cols / 2} y={size - pad + 14} className="axis-label" textAnchor="middle">
              {axisTickLabel(x, scene.axis, 'x')}
            </text>
          </g>
        )
      })}
      <line x1={size - pad} y1={pad} x2={size - pad} y2={size - pad} className="grid-line" />
      {Array.from({ length: scene.rows }, (_, i) =>
        Array.from({ length: scene.cols }, (_, j) => {
          const x = j + 1
          const y = scene.rows - i
          const { cx, cy } = cellCenter(scene.cols, scene.rows, x, y, pad, size)
          const mark = markAt(x, y)
          return (
            <g key={`c-${x}-${y}`}>
              {editable ? (
                <rect
                  x={pad + (j / scene.cols) * inner}
                  y={pad + (i / scene.rows) * inner}
                  width={inner / scene.cols}
                  height={inner / scene.rows}
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
                <g fill="currentColor" stroke="currentColor" strokeWidth={0.7} strokeLinejoin="round">
                  <CoordShapeGlyph
                    kind={mark.kind}
                    x={cx}
                    y={cy}
                    size={Math.min(inner / scene.cols, inner / scene.rows) * 0.32}
                  />
                  {mark.label ? (
                    <text x={cx + 7} y={cy - 6} className="point-label">
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
  const range = scene.range ?? 5
  const step = scene.step ?? 1
  const size = 240
  const pad = 22
  const inner = size - 2 * pad
  const to = (x: number, y: number) => ({
    cx: pad + ((x + range) / (2 * range)) * inner,
    cy: pad + ((range - y) / (2 * range)) * inner,
  })
  const values: number[] = []
  const n = Math.round((2 * range) / step)
  for (let i = 0; i <= n; i++) values.push(Math.round((-range + i * step) * 1000) / 1000)
  const markAt = (x: number, y: number) => scene.marks.find((m) => m.x === x && m.y === y)
  const fineN = scene.fineGrid ? 5 : 0
  const labelStep = range >= 10 ? 2 : 1

  return (
    <svg
      className={`coord-grid scene-axes${scene.fineGrid ? ' is-fine' : ''}`}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Repère à quatre cadrans"
    >
      {fineN
        ? Array.from({ length: 2 * range * fineN + 1 }, (_, i) => {
            const v = Math.round((-range + i / fineN) * 1000) / 1000
            if (Number.isInteger(v)) return null
            const h = to(v, 0)
            const p = to(0, v)
            return (
              <g key={`f-${v}`}>
                <line x1={h.cx} y1={pad} x2={h.cx} y2={size - pad} className="grid-line-fine" />
                <line x1={pad} y1={p.cy} x2={size - pad} y2={p.cy} className="grid-line-fine" />
              </g>
            )
          })
        : null}
      {values.map((v) => {
        const h = to(v, 0)
        const p = to(0, v)
        return (
          <g key={`g-${v}`}>
            <line x1={h.cx} y1={pad} x2={h.cx} y2={size - pad} className={v === 0 ? 'axis-line' : 'grid-line'} />
            <line x1={pad} y1={p.cy} x2={size - pad} y2={p.cy} className={v === 0 ? 'axis-line' : 'grid-line'} />
          </g>
        )
      })}
      {values
        .filter((v) => Number.isInteger(v) && v !== 0 && v % labelStep === 0)
        .map((v) => {
          const onX = to(v, 0)
          const onY = to(0, v)
          return (
            <g key={`lab-${v}`}>
              <text x={onX.cx} y={onX.cy + 11} className="axis-label" textAnchor="middle">
                {formatAxesNum(v)}
              </text>
              <text x={onY.cx - 5} y={onY.cy + 3} className="axis-label" textAnchor="end">
                {formatAxesNum(v)}
              </text>
            </g>
          )
        })}
      <text x={size - pad + 2} y={to(0, 0).cy - 4} className="axis-label">
        x
      </text>
      <text x={to(0, 0).cx + 5} y={pad - 2} className="axis-label">
        y
      </text>
      {(scene.lines ?? []).map((line) => {
        const clip = clipLineToRange(line, range)
        if (!clip) return null
        const a = to(clip.x1, clip.y1)
        const b = to(clip.x2, clip.y2)
        return (
          <line
            key={line.id}
            x1={a.cx}
            y1={a.cy}
            x2={b.cx}
            y2={b.cy}
            className={`coord-line line-${line.color}`}
            strokeDasharray={STROKE_DASH[line.stroke]}
          />
        )
      })}
      {(scene.paths ?? []).map((path) => {
        if (path.kind === 'line' && path.a != null && path.b != null && path.c != null) {
          const clip = clipLineToRange({ a: path.a, b: path.b, c: path.c }, range)
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
        ? values.map((x) =>
            values.map((y) => {
              const p = to(x, y)
              const found = markAt(x, y)
              return (
                <circle
                  key={`h-${x}-${y}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={Math.max(3.5, inner / (2 * range) / 2.4)}
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
            <circle cx={p.cx} cy={p.cy} r={3.2} className="grid-point" />
            {found.label ? (
              <text
                x={p.cx + (found.x >= 0 ? 5 : -5)}
                y={p.cy + (found.y >= 0 ? -5 : 11)}
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

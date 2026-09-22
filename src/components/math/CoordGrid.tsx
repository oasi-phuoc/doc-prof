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

export function CoordGrid({
  point,
  pointImage,
  showImage,
}: {
  point?: Pt
  pointImage?: Pt
  showImage?: boolean
}) {
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
          <text
            x={toSvg(point.x, point.y).cx + 5}
            y={toSvg(point.x, point.y).cy - 5}
            className="point-label"
          >
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

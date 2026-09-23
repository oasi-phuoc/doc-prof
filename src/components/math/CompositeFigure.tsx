import type { CompositeRight, CompositeScene, CompositeTick } from '@/math/types'

function Tick({ tick }: { tick: CompositeTick }) {
  const rad = (tick.angle * Math.PI) / 180
  const tx = Math.cos(rad)
  const ty = Math.sin(rad)
  const nx = -ty
  const ny = tx
  const span = 3.6
  const gap = 3.4
  const start = -((tick.n - 1) * gap) / 2
  return (
    <g className="geo-tick" stroke="currentColor" strokeWidth="1.5" fill="none">
      {Array.from({ length: tick.n }, (_, i) => {
        const ox = tick.x + (start + i * gap) * tx
        const oy = tick.y + (start + i * gap) * ty
        return (
          <line
            key={i}
            x1={ox - nx * span}
            y1={oy - ny * span}
            x2={ox + nx * span}
            y2={oy + ny * span}
          />
        )
      })}
    </g>
  )
}

function Right({ r }: { r: CompositeRight }) {
  const na = Math.hypot(r.ax, r.ay) || 1
  const nb = Math.hypot(r.bx, r.by) || 1
  const s = 8
  const ax = (r.ax / na) * s
  const ay = (r.ay / na) * s
  const bx = (r.bx / nb) * s
  const by = (r.by / nb) * s
  return (
    <polyline
      className="geo-right"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      points={`${r.x + ax},${r.y + ay} ${r.x + ax + bx},${r.y + ay + by} ${r.x + bx},${r.y + by}`}
    />
  )
}

export function CompositeFigure({ scene }: { scene: CompositeScene }) {
  return (
    <svg className="geometry-figure cotee composite-figure" viewBox="0 0 260 190" role="img" aria-label="Figure composée">
      <path
        d={scene.outline}
        fill="currentColor"
        fillOpacity="0.11"
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {(scene.helpers ?? []).map((h, i) => (
        <path
          key={`h-${i}`}
          d={h.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeDasharray={h.dashed ? '5 4' : undefined}
          strokeOpacity={h.dashed ? 0.85 : 1}
        />
      ))}
      {(scene.rights ?? []).map((r, i) => (
        <Right key={`r-${i}`} r={r} />
      ))}
      {(scene.ticks ?? []).map((t, i) => (
        <Tick key={`t-${i}`} tick={t} />
      ))}
      {scene.labels.map((lab, i) => (
        <text
          key={`l-${i}`}
          x={lab.x}
          y={lab.y}
          textAnchor={lab.anchor ?? 'middle'}
          className="dim-label"
          fill="currentColor"
          stroke="none"
        >
          {lab.text}
        </text>
      ))}
    </svg>
  )
}

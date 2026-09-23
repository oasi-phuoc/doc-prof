import type { ReactNode } from 'react'
import type { Figure, FigureDims } from '@/math/types'

const ALL: Figure[] = [
  'rectangle',
  'square',
  'triangle',
  'circle',
  'rhombus',
  'parallelogram',
  'trapezoid',
  'cube',
  'cuboid',
  'cylinder',
  'cone',
  'sphere',
  'oval',
]

function u(dims?: FigureDims) {
  return dims?.unit ?? 'cm'
}

function fmt(n: number) {
  return String(n).replace('.', ',')
}

function L({
  x,
  y,
  children,
  anchor = 'middle',
  rotate,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  rotate?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className="dim-label"
      fill="currentColor"
      fillOpacity={1}
      stroke="none"
      transform={rotate != null ? `rotate(${rotate} ${x} ${y})` : undefined}
    >
      {children}
    </text>
  )
}

/**
 * Figures cotées — géométrie et placement des labels calqués sur
 * soutien-scolaire G2 (périmètre), G3 (aire), G5 (volume),
 * recalculés en SVG React, lisibles en N&B.
 */
export function GeometryFigure({ type, dims }: { type?: Figure; dims?: FigureDims }) {
  if (!type || !ALL.includes(type)) return null
  const d = dims ?? {}
  const unit = u(dims)
  const kind = d.triangleKind ?? 'scalene'
  const hasHeight = d.height != null
  const forArea = hasHeight || (type === 'triangle' && d.base != null && d.a == null)

  return (
    <svg
      className="geometry-figure cotee"
      viewBox="0 0 260 190"
      role="img"
      aria-label="Figure géométrique"
    >
      <g fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
        {type === 'square' && (
          <>
            <rect x="75" y="42" width="110" height="110" />
            {(d.side != null || d.ask === 'side') && (
              <L x={130} y={32}>
                {d.ask === 'side' ? '?' : `${fmt(d.side!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'rectangle' && (
          <>
            <rect x="40" y="48" width="170" height="82" />
            {(d.length != null || d.ask === 'length') && (
              <L x={125} y={38}>
                {d.ask === 'length' ? '?' : `${fmt(d.length!)} ${unit}`}
              </L>
            )}
            {(d.width != null || d.ask === 'width') && (
              <L x={222} y={92} anchor="start">
                {d.ask === 'width' ? '?' : `${fmt(d.width!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'triangle' && kind === 'right' && (
          <>
            <polygon points="48,152 210,152 48,42" />
            <polyline points="48,136 64,136 64,152" fill="none" strokeWidth="1.6" />
            {forArea && d.base != null && d.height != null ? (
              <>
                <line
                  x1="48"
                  y1="42"
                  x2="48"
                  y2="152"
                  fill="none"
                  strokeDasharray="5 4"
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                />
                <L x={130} y={172}>
                  {fmt(d.base)} {unit}
                </L>
                <L x={58} y={100} anchor="start">
                  h = {fmt(d.height)} {unit}
                </L>
              </>
            ) : (
              <>
                {d.a != null && (
                  <L x={36} y={100} anchor="end">
                    {fmt(d.a)} {unit}
                  </L>
                )}
                {d.b != null && (
                  <L x={130} y={172}>
                    {fmt(d.b)} {unit}
                  </L>
                )}
                {d.c != null && (
                  <L x={148} y={88} anchor="start">
                    {fmt(d.c)} {unit}
                  </L>
                )}
              </>
            )}
          </>
        )}

        {type === 'triangle' && kind === 'equilateral' && (
          <>
            <polygon points="130,32 220,152 40,152" />
            {forArea && (d.base != null || d.side != null) && d.height != null ? (
              <>
                <line
                  x1="130"
                  y1="32"
                  x2="130"
                  y2="152"
                  fill="none"
                  strokeDasharray="5 4"
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                />
                <L x={130} y={172}>
                  {fmt(d.base ?? d.side!)} {unit}
                </L>
                <L x={140} y={100} anchor="start">
                  h = {fmt(d.height)} {unit}
                </L>
              </>
            ) : (
              (d.side ?? d.a) != null && (
                <>
                  <L x={70} y={88} anchor="end">
                    {fmt(d.side ?? d.a!)} {unit}
                  </L>
                  <L x={196} y={88} anchor="start">
                    {fmt(d.side ?? d.b ?? d.a!)} {unit}
                  </L>
                  <L x={130} y={172}>
                    {fmt(d.side ?? d.c ?? d.a!)} {unit}
                  </L>
                </>
              )
            )}
          </>
        )}

        {type === 'triangle' && kind === 'isosceles' && (
          <>
            <polygon points="130,28 235,152 25,152" />
            {forArea && d.base != null && d.height != null ? (
              <>
                <line
                  x1="130"
                  y1="28"
                  x2="130"
                  y2="152"
                  fill="none"
                  strokeDasharray="5 4"
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                />
                <L x={130} y={172}>
                  {fmt(d.base)} {unit}
                </L>
                <L x={140} y={98} anchor="start">
                  h = {fmt(d.height)} {unit}
                </L>
              </>
            ) : (
              <>
                {(d.a ?? d.side) != null && (
                  <L x={60} y={86} anchor="end">
                    {fmt(d.a ?? d.side!)} {unit}
                  </L>
                )}
                {(d.b ?? d.side) != null && (
                  <L x={206} y={86} anchor="start">
                    {fmt(d.b ?? d.side!)} {unit}
                  </L>
                )}
                {(d.c ?? d.base) != null && (
                  <L x={130} y={172}>
                    {fmt(d.c ?? d.base!)} {unit}
                  </L>
                )}
              </>
            )}
          </>
        )}

        {type === 'triangle' && (kind === 'scalene' || !['right', 'equilateral', 'isosceles'].includes(kind)) && (
          <>
            <polygon points="135,28 246,152 42,152" />
            {forArea && d.base != null && (d.height != null || d.ask === 'height') ? (
              <>
                <line
                  x1="142"
                  y1="28"
                  x2="142"
                  y2="152"
                  fill="none"
                  strokeDasharray="5 4"
                  strokeWidth="1.4"
                  strokeOpacity="0.85"
                />
                <L x={144} y={172}>
                  {fmt(d.base)} {unit}
                </L>
                <L x={152} y={100} anchor="start">
                  {d.ask === 'height' ? 'h = ?' : `h = ${fmt(d.height!)} ${unit}`}
                </L>
                {d.side != null && (
                  <L x={72} y={92} anchor="end">
                    {fmt(d.side)} {unit}
                  </L>
                )}
              </>
            ) : (
              <>
                {d.a != null && (
                  <L x={68} y={82} anchor="middle">
                    {fmt(d.a)} {unit}
                  </L>
                )}
                {d.b != null && (
                  <L x={228} y={90} anchor="start">
                    {fmt(d.b)} {unit}
                  </L>
                )}
                {(d.c != null || d.ask === 'c') && (
                  <L x={144} y={172}>
                    {d.ask === 'c' ? '?' : `${fmt(d.c!)} ${unit}`}
                  </L>
                )}
              </>
            )}
          </>
        )}

        {type === 'parallelogram' && (
          <>
            <polygon points="70,40 220,40 185,145 35,145" />
            {hasHeight && (
              <line
                x1="220"
                y1="40"
                x2="220"
                y2="145"
                fill="none"
                strokeDasharray="5 4"
                strokeWidth="1.4"
                strokeOpacity="0.85"
              />
            )}
            {(d.base != null || d.length != null) && (
              <L x={110} y={168}>
                {fmt(d.base ?? d.length!)} {unit}
              </L>
            )}
            {(d.height != null || d.ask === 'height') && (
              <L x={230} y={96} anchor="start">
                {d.ask === 'height' ? 'h = ?' : `h = ${fmt(d.height!)} ${unit}`}
              </L>
            )}
            {(d.side != null || d.a != null || d.ask === 'side') && (
              <L x={42} y={92} anchor="end">
                {d.ask === 'side' ? '?' : `${fmt(d.side ?? d.a!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'trapezoid' && (
          <>
            <polygon
              points={
                d.trapezoidKind === 'rectangle'
                  ? '48,42 175,42 210,150 48,150'
                  : d.trapezoidKind === 'scalene'
                    ? '55,42 195,42 235,150 28,150'
                    : '85,42 185,42 225,150 45,150'
              }
            />
            {d.trapezoidKind === 'rectangle' && (
              <polyline points="48,134 64,134 64,150" fill="none" strokeWidth="1.6" />
            )}
            {hasHeight && (
              <line
                x1="185"
                y1="42"
                x2="185"
                y2="150"
                fill="none"
                strokeDasharray="5 4"
                strokeWidth="1.4"
                strokeOpacity="0.85"
              />
            )}
            {d.top != null && (
              <L x={135} y={30}>
                {fmt(d.top)} {unit}
              </L>
            )}
            {(d.bottom != null || d.base != null) && (
              <L x={135} y={172}>
                {fmt(d.bottom ?? d.base!)} {unit}
              </L>
            )}
            {(d.height != null || d.ask === 'height') && (
              <L x={196} y={100} anchor="start">
                {d.ask === 'height' ? 'h = ?' : `h = ${fmt(d.height!)} ${unit}`}
              </L>
            )}
            {d.a != null && (
              <L x={52} y={100} anchor="end">
                {fmt(d.a)} {unit}
              </L>
            )}
            {(d.b != null || d.ask === 'b') && (
              <L x={220} y={100} anchor="start">
                {d.ask === 'b' ? '?' : `${fmt(d.b!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'circle' && (
          <>
            <circle cx="130" cy="88" r="58" />
            <line x1="130" y1="88" x2="188" y2="88" fill="none" strokeWidth="2" />
            <line
              x1="130"
              y1="30"
              x2="130"
              y2="146"
              fill="none"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              strokeOpacity="0.7"
            />
            <circle cx="130" cy="88" r="2.4" fillOpacity="1" stroke="none" />
            {(d.radius != null || d.ask === 'radius') && (
              <L x={130} y={172}>
                {d.ask === 'radius' ? 'r = ?' : `r = ${fmt(d.radius!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'rhombus' && (
          <>
            <polygon points="130,28 200,95 130,162 60,95" />
            {(d.side != null || d.ask === 'side') && (
              <L x={130} y={180}>
                {d.ask === 'side' ? '?' : `${fmt(d.side!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'cube' && (
          <>
            <path d="M70 78 h76 v76 H70 Z" />
            <path d="M70 78 L102 48 h76 l-32 30" fill="none" />
            <path d="M178 48 v76 l-32 30" fill="none" />
            {(d.side != null || d.ask === 'side') && (
              <>
                <L x={108} y={172}>
                  {d.ask === 'side' ? '?' : `${fmt(d.side!)} ${unit}`}
                </L>
                <L x={58} y={120} anchor="end">
                  {d.ask === 'side' ? '?' : `${fmt(d.side!)} ${unit}`}
                </L>
                <L x={140} y={38}>
                  {d.ask === 'side' ? '?' : `${fmt(d.side!)} ${unit}`}
                </L>
              </>
            )}
          </>
        )}

        {type === 'cuboid' && (
          <>
            <path d="M55 82 h118 v62 H55 Z" />
            <path d="M55 82 L92 52 h118 l-37 30" fill="none" />
            <path d="M210 52 v62 l-37 30" fill="none" />
            {d.length != null && (
              <L x={114} y={168}>
                {fmt(d.length)} {unit}
              </L>
            )}
            {d.width != null && (
              <L x={220} y={86} anchor="start">
                {fmt(d.width)} {unit}
              </L>
            )}
            {(d.height != null || d.ask === 'height') && (
              <L x={42} y={118} anchor="end">
                {d.ask === 'height' ? '?' : `${fmt(d.height!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'cylinder' && (
          <>
            <ellipse cx="120" cy="48" rx="55" ry="18" />
            <path d="M65 48 v86" fill="none" />
            <path d="M175 48 v86" fill="none" />
            <ellipse cx="120" cy="134" rx="55" ry="18" fillOpacity="0.05" />
            <line x1="120" y1="48" x2="175" y2="48" fill="none" strokeWidth="2" />
            {d.radius != null && (
              <L x={148} y={40} anchor="start">
                r = {fmt(d.radius)} {unit}
              </L>
            )}
            {(d.height != null || d.ask === 'height') && (
              <L x={190} y={100} anchor="start">
                {d.ask === 'height' ? 'h = ?' : `h = ${fmt(d.height!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'oval' && <ellipse cx="130" cy="95" rx="78" ry="48" />}

        {type === 'cone' && (
          <>
            <ellipse cx="130" cy="150" rx="62" ry="16" />
            <path d="M68 150 L130 28 L192 150" fill="none" />
            {(d.radius != null || d.ask === 'radius') && (
              <L x={160} y={168}>
                {d.ask === 'radius' ? 'r = ?' : `r = ${fmt(d.radius!)} ${unit}`}
              </L>
            )}
            {(d.height != null || d.ask === 'height') && (
              <L x={210} y={90} anchor="start">
                {d.ask === 'height' ? 'h = ?' : `h = ${fmt(d.height!)} ${unit}`}
              </L>
            )}
          </>
        )}

        {type === 'sphere' && (
          <>
            <circle cx="130" cy="95" r="62" />
            <ellipse cx="130" cy="95" rx="62" ry="18" fill="none" />
            {(d.radius != null || d.ask === 'radius') && (
              <L x={130} y={176}>
                {d.ask === 'radius' ? 'r = ?' : `r = ${fmt(d.radius!)} ${unit}`}
              </L>
            )}
          </>
        )}
      </g>
    </svg>
  )
}

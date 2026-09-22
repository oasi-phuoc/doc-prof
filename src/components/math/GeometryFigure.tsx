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
]

function u(dims?: FigureDims) {
  return dims?.unit ?? 'cm'
}

function L({
  x,
  y,
  children,
  anchor = 'middle',
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="dim-label" fill="currentColor" stroke="none">
      {children}
    </text>
  )
}

/** Figures cotées inspirées de soutien-scolaire (formes + placement des labels hors traits). */
export function GeometryFigure({ type, dims }: { type?: Figure; dims?: FigureDims }) {
  if (!type || !ALL.includes(type)) return null
  const unit = u(dims)
  const kind = dims?.triangleKind ?? 'scalene'

  return (
    <svg className="geometry-figure cotee" viewBox="0 0 200 140" role="img" aria-label="Figure géométrique">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
        {type === 'square' && (
          <>
            <rect x="55" y="28" width="78" height="78" />
            {dims?.side != null && (
              <L x={94} y={124}>
                {dims.side} {unit}
              </L>
            )}
          </>
        )}

        {type === 'rectangle' && (
          <>
            <rect x="35" y="38" width="120" height="62" />
            {dims?.length != null && (
              <L x={95} y={118}>
                {dims.length} {unit}
              </L>
            )}
            {dims?.width != null && (
              <L x={168} y={72} anchor="start">
                {dims.width} {unit}
              </L>
            )}
          </>
        )}

        {type === 'triangle' && kind === 'right' && (
          <>
            {/* Triangle rectangle : angle droit en bas à gauche */}
            <polygon points="40,110 150,110 40,35" />
            <polyline points="40,95 55,95 55,110" strokeWidth="1.6" />
            {dims?.a != null && (
              <L x={28} y={78} anchor="end">
                {dims.a} {unit}
              </L>
            )}
            {dims?.b != null && (
              <L x={95} y={126}>
                {dims.b} {unit}
              </L>
            )}
            {dims?.c != null && (
              <L x={112} y={62} anchor="start">
                {dims.c} {unit}
              </L>
            )}
            {dims?.base != null && dims?.height != null && !dims?.a && (
              <>
                <line x1="40" y1="35" x2="40" y2="110" strokeDasharray="4 3" strokeWidth="1.3" />
                <L x={95} y={126}>
                  {dims.base} {unit}
                </L>
                <L x={52} y={72} anchor="start">
                  h={dims.height} {unit}
                </L>
              </>
            )}
          </>
        )}

        {type === 'triangle' && kind === 'equilateral' && (
          <>
            <polygon points="100,22 168,118 32,118" />
            {dims?.height != null && (dims?.base != null || dims?.side != null) ? (
              <>
                <line x1="100" y1="22" x2="100" y2="118" strokeDasharray="4 3" strokeWidth="1.3" />
                <L x={100} y={134}>
                  {dims.base ?? dims.side} {unit}
                </L>
                <L x={108} y={78} anchor="start">
                  h={dims.height} {unit}
                </L>
              </>
            ) : (
              <>
                {dims?.side != null && (
                  <>
                    <L x={100} y={134}>
                      {dims.side} {unit}
                    </L>
                    <L x={58} y={68} anchor="end">
                      {dims.side} {unit}
                    </L>
                    <L x={148} y={68} anchor="start">
                      {dims.side} {unit}
                    </L>
                  </>
                )}
                {dims?.a != null && dims?.side == null && (
                  <>
                    <L x={100} y={134}>
                      {dims.c ?? dims.a} {unit}
                    </L>
                    <L x={58} y={68} anchor="end">
                      {dims.a} {unit}
                    </L>
                    <L x={148} y={68} anchor="start">
                      {dims.b ?? dims.a} {unit}
                    </L>
                  </>
                )}
              </>
            )}
          </>
        )}

        {type === 'triangle' && kind === 'isosceles' && (
          <>
            <polygon points="100,24 175,118 25,118" />
            {(dims?.a != null || dims?.side != null) && (
              <L x={52} y={70} anchor="end">
                {dims.a ?? dims.side} {unit}
              </L>
            )}
            {(dims?.b != null || dims?.side != null) && (
              <L x={154} y={70} anchor="start">
                {dims.b ?? dims.side} {unit}
              </L>
            )}
            {(dims?.c != null || dims?.base != null) && (
              <L x={100} y={134}>
                {dims.c ?? dims.base} {unit}
              </L>
            )}
            {dims?.height != null && (
              <>
                <line x1="100" y1="24" x2="100" y2="118" strokeDasharray="4 3" strokeWidth="1.3" />
                <L x={108} y={78} anchor="start">
                  h={dims.height} {unit}
                </L>
              </>
            )}
          </>
        )}

        {type === 'triangle' && (kind === 'scalene' || !['right', 'equilateral', 'isosceles'].includes(kind)) && (
          <>
            {/* Scalène asymétrique — labels hors des côtés */}
            <polygon points="95,20 175,118 28,118" />
            {dims?.base != null && dims?.height != null && dims?.a == null ? (
              <>
                <line x1="95" y1="20" x2="95" y2="118" strokeDasharray="4 3" strokeWidth="1.3" />
                <L x={100} y={134}>
                  {dims.base} {unit}
                </L>
                <L x={105} y={72} anchor="start">
                  h={dims.height} {unit}
                </L>
              </>
            ) : (
              <>
                {dims?.a != null && (
                  <L x={52} y={66} anchor="end">
                    {dims.a} {unit}
                  </L>
                )}
                {dims?.b != null && (
                  <L x={152} y={62} anchor="start">
                    {dims.b} {unit}
                  </L>
                )}
                {dims?.c != null && (
                  <L x={100} y={134}>
                    {dims.c} {unit}
                  </L>
                )}
              </>
            )}
          </>
        )}

        {type === 'parallelogram' && (
          <>
            {/* Points soutien-scolaire proportionnels : 85,40 250,40 210,145 45,145 → scale to 200×140 */}
            <polygon points="52,28 155,28 130,100 27,100" />
            <line x1="155" y1="28" x2="155" y2="100" strokeDasharray="4 3" strokeWidth="1.3" />
            {(dims?.base != null || dims?.length != null) && (
              <L x={78} y={118}>
                {dims.base ?? dims.length} {unit}
              </L>
            )}
            {dims?.height != null && (
              <L x={164} y={68} anchor="start">
                h={dims.height} {unit}
              </L>
            )}
            {(dims?.side != null || dims?.a != null) && (
              <L x={32} y={62} anchor="end">
                {dims.side ?? dims.a} {unit}
              </L>
            )}
          </>
        )}

        {type === 'trapezoid' && (
          <>
            {/* Trapèze isocèle : top 105-225, bottom 55-270 → scaled */}
            <polygon points="62,28 138,28 168,105 30,105" />
            <line x1="138" y1="28" x2="138" y2="105" strokeDasharray="4 3" strokeWidth="1.3" />
            {dims?.top != null && (
              <L x={100} y={20}>
                {dims.top} {unit}
              </L>
            )}
            {(dims?.bottom != null || dims?.base != null) && (
              <L x={100} y={122}>
                {dims.bottom ?? dims.base} {unit}
              </L>
            )}
            {dims?.height != null && (
              <L x={148} y={70} anchor="start">
                h={dims.height} {unit}
              </L>
            )}
            {dims?.a != null && (
              <L x={38} y={68} anchor="end">
                {dims.a} {unit}
              </L>
            )}
            {dims?.b != null && (
              <L x={168} y={68} anchor="start">
                {dims.b} {unit}
              </L>
            )}
          </>
        )}

        {type === 'circle' && (
          <>
            <circle cx="100" cy="62" r="42" />
            <line x1="100" y1="62" x2="142" y2="62" strokeWidth="1.6" />
            <circle cx="100" cy="62" r="2.2" fill="currentColor" stroke="none" />
            {dims?.radius != null && (
              <L x={100} y={122}>
                r = {dims.radius} {unit}
              </L>
            )}
          </>
        )}

        {type === 'rhombus' && (
          <>
            <polygon points="100,18 160,70 100,122 40,70" />
            {dims?.side != null && (
              <L x={100} y={136}>
                {dims.side} {unit}
              </L>
            )}
          </>
        )}

        {type === 'cube' && (
          <>
            {/* Face avant + dessus + côté droit — ratios soutien G5 */}
            <path d="M48 55 h70 v70 H48 Z" />
            <path d="M48 55 L78 28 h70 l-30 27" />
            <path d="M148 28 v70 l-30 27" />
            {dims?.side != null && (
              <>
                <L x={83} y={142}>
                  {dims.side} {unit}
                </L>
                <L x={40} y={92} anchor="end">
                  {dims.side} {unit}
                </L>
                <L x={108} y={22}>
                  {dims.side} {unit}
                </L>
              </>
            )}
          </>
        )}

        {type === 'cuboid' && (
          <>
            <path d="M40 58 h100 v55 H40 Z" />
            <path d="M40 58 L72 30 h100 l-32 28" />
            <path d="M172 30 v55 l-32 28" />
            {dims?.length != null && (
              <L x={90} y={132}>
                {dims.length} {unit}
              </L>
            )}
            {dims?.width != null && (
              <L x={178} y={58} anchor="start">
                {dims.width} {unit}
              </L>
            )}
            {dims?.height != null && (
              <L x={32} y={88} anchor="end">
                {dims.height} {unit}
              </L>
            )}
          </>
        )}

        {type === 'cylinder' && (
          <>
            <ellipse cx="100" cy="32" rx="42" ry="12" />
            <path d="M58 32 v58" />
            <path d="M142 32 v58" />
            <ellipse cx="100" cy="90" rx="42" ry="12" />
            {dims?.radius != null && (
              <L x={158} y={62} anchor="start">
                r={dims.radius} {unit}
              </L>
            )}
            {dims?.height != null && (
              <L x={42} y={66} anchor="end">
                h={dims.height} {unit}
              </L>
            )}
          </>
        )}
      </g>
    </svg>
  )
}

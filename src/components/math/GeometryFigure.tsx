import type { ReactNode } from 'react'
import type { Figure, FigureDims } from '@/math/types'

const ALL: Figure[] = [
  'rectangle',
  'square',
  'triangle',
  'circle',
  'rhombus',
  'parallelogram',
  'cube',
  'cuboid',
  'cylinder',
]

function u(dims?: FigureDims) {
  return dims?.unit ?? 'cm'
}

function DimText({
  x,
  y,
  children,
  anchor = 'start',
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

export function GeometryFigure({ type, dims }: { type?: Figure; dims?: FigureDims }) {
  if (!type || !ALL.includes(type)) return null
  const unit = u(dims)
  return (
    <svg className="geometry-figure cotee" viewBox="0 0 160 110" role="img" aria-label="Figure géométrique">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {type === 'rectangle' && (
          <>
            <rect x="28" y="28" width="100" height="54" />
            {dims?.length != null && (
              <DimText x={78} y={100} anchor="middle">
                {dims.length} {unit}
              </DimText>
            )}
            {dims?.width != null && (
              <DimText x={136} y={58}>
                {dims.width} {unit}
              </DimText>
            )}
          </>
        )}
        {type === 'square' && (
          <>
            <rect x="42" y="22" width="70" height="70" />
            {dims?.side != null && (
              <DimText x={77} y={104} anchor="middle">
                {dims.side} {unit}
              </DimText>
            )}
          </>
        )}
        {type === 'triangle' && (
          <>
            <path d="M30 88 80 18l50 70Z" />
            {dims?.a != null && dims?.b != null && dims?.c != null ? (
              <>
                <DimText x={50} y={58}>
                  {dims.a}
                </DimText>
                <DimText x={102} y={58}>
                  {dims.b}
                </DimText>
                <DimText x={80} y={104} anchor="middle">
                  {dims.c} {unit}
                </DimText>
              </>
            ) : (
              <>
                {dims?.base != null && (
                  <DimText x={80} y={104} anchor="middle">
                    {dims.base} {unit}
                  </DimText>
                )}
                {dims?.height != null && (
                  <>
                    <line x1="80" y1="18" x2="80" y2="88" strokeDasharray="3 3" strokeWidth="1.2" />
                    <DimText x={86} y={58}>
                      h={dims.height}
                    </DimText>
                  </>
                )}
              </>
            )}
          </>
        )}
        {type === 'circle' && (
          <>
            <circle cx="78" cy="52" r="34" />
            <line x1="78" y1="52" x2="112" y2="52" strokeWidth="1.4" />
            <circle cx="78" cy="52" r="2" fill="currentColor" />
            {dims?.radius != null && (
              <DimText x={90} y={46}>
                r={dims.radius} {unit}
              </DimText>
            )}
          </>
        )}
        {type === 'rhombus' && <path d="M80 16 118 52 80 88 42 52Z" />}
        {type === 'parallelogram' && (
          <>
            <path d="M36 82 56 28h72L88 82Z" />
            {dims?.base != null && (
              <DimText x={88} y={100} anchor="middle">
                {dims.base} {unit}
              </DimText>
            )}
            {dims?.height != null && (
              <>
                <line x1="56" y1="28" x2="56" y2="82" strokeDasharray="3 3" strokeWidth="1.2" />
                <DimText x={60} y={58}>
                  h={dims.height}
                </DimText>
              </>
            )}
          </>
        )}
        {type === 'cube' && (
          <>
            <path d="M30 30 70 14l50 18-40 16Z" />
            <path d="M30 30v46l40 18V48M120 32v46L80 94M70 14v34" />
            {dims?.side != null && (
              <DimText x={80} y={106} anchor="middle">
                {dims.side} {unit}
              </DimText>
            )}
          </>
        )}
        {type === 'cuboid' && (
          <>
            <path d="M24 36 64 18h56L80 36Z" />
            <path d="M24 36v40l56 16V52M120 36v40L80 92M64 18v34" />
            {dims && (
              <DimText x={80} y={106} anchor="middle">
                {dims.length}×{dims.width}×{dims.height} {unit}
              </DimText>
            )}
          </>
        )}
        {type === 'cylinder' && (
          <>
            <ellipse cx="78" cy="28" rx="36" ry="12" />
            <path d="M42 28v44c0 7 16 12 36 12s36-5 36-12V28" />
            <ellipse cx="78" cy="72" rx="36" ry="12" />
            {dims?.radius != null && (
              <DimText x={118} y={52}>
                r={dims.radius}
              </DimText>
            )}
            {dims?.height != null && (
              <DimText x={8} y={56}>
                h={dims.height}
              </DimText>
            )}
          </>
        )}
      </g>
    </svg>
  )
}

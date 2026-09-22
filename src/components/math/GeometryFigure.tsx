import type { Figure } from '@/math/types'

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

export function GeometryFigure({ type }: { type?: Figure }) {
  if (!type || !ALL.includes(type)) return null
  return (
    <svg className="geometry-figure" viewBox="0 0 120 78" role="img" aria-label="Figure géométrique">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        {type === 'rectangle' && <rect x="16" y="18" width="72" height="42" />}
        {type === 'square' && <rect x="28" y="14" width="50" height="50" />}
        {type === 'triangle' && <path d="M16 60 52 12l36 48Z" />}
        {type === 'circle' && <circle cx="52" cy="39" r="27" />}
        {type === 'rhombus' && <path d="M52 12 88 39 52 66 16 39Z" />}
        {type === 'parallelogram' && <path d="M24 58 40 18h52L100 58Z" />}
        {type === 'cube' && (
          <>
            <path d="M16 18 46 7l42 15-30 12Z" />
            <path d="M16 18v42l42 15V34M88 22v38L58 75M46 7v27" />
          </>
        )}
        {type === 'cuboid' && (
          <>
            <path d="M14 24 48 10h44L58 24Z" />
            <path d="M14 24v34l44 14V38M102 24v34L58 72M48 10v28" />
          </>
        )}
        {type === 'cylinder' && (
          <>
            <ellipse cx="52" cy="18" rx="28" ry="10" />
            <path d="M24 18v36c0 6 12 10 28 10s28-4 28-10V18" />
            <ellipse cx="52" cy="54" rx="28" ry="10" />
          </>
        )}
      </g>
    </svg>
  )
}

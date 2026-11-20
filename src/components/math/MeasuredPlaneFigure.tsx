import type { Figure, FigureDims } from '@/math/types'
import { fmt } from '@/math/column-arith'

/** Les cotes HTML gardent la taille de lecture choisie, indépendamment du SVG. */
export function MeasuredPlaneFigure({ type, dims = {} }: { type?: Figure; dims?: FigureDims }) {
  const unit = dims.unit ?? 'cm'
  const measure = (value?: number) => value == null ? '' : `${fmt(value)} ${unit}`
  if (type === 'triangle') {
    return (
      <div className="cfr-measured-figure is-triangle">
        <div className="cfr-triangle-diagram">
          <svg className="cfr-measured-shape" viewBox="0 0 300 160" role="img" aria-label="Triangle scalène avec hauteur extérieure en pointillés">
            <polygon points="205,15 20,135 100,135" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <g className="cfr-external-height" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M205 15V135H100" strokeDasharray="5 4" />
              <path d="M198 135V128H205" />
            </g>
          </svg>
          <span className="cfr-measure-label is-side-c">{measure(dims.c)}</span>
          <span className="cfr-measure-label is-side-b">{measure(dims.b)}</span>
          <span className="cfr-measure-label is-base">{measure(dims.a)}</span>
          <span className="cfr-measure-label is-height">h = {measure(dims.height)}</span>
        </div>
      </div>
    )
  }
  const top = type === 'square' ? dims.side ?? dims.length : dims.length
  return (
    <div className={`cfr-measured-figure is-${type}`}>
      {top != null && <span className="cfr-measure-label is-top">{measure(top)}</span>}
      <svg className="cfr-measured-shape" viewBox={type === 'square' ? '0 0 120 120' : '0 0 190 110'} role="img" aria-label={type === 'square' ? 'Carré' : 'Rectangle'}>
        <g fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          {type === 'square' && <rect x="8" y="8" width="104" height="104" />}
          {type === 'rectangle' && <rect x="10" y="5" width="170" height="100" />}
        </g>
      </svg>
      {type === 'rectangle' && dims.width != null && <span className="cfr-measure-label is-right">{measure(dims.width)}</span>}
    </div>
  )
}

import type { Figure, FigureDims } from '@/math/types'
import { fmt } from '@/math/column-arith'

/** Les cotes HTML gardent la taille de lecture choisie, indépendamment du SVG. */
export function MeasuredPlaneFigure({ type, dims = {} }: { type?: Figure; dims?: FigureDims }) {
  const unit = dims.unit ?? 'cm'
  const measure = (value?: number) => value == null ? '' : `${fmt(value)} ${unit}`
  const triangle = type === 'triangle'
  const top = type === 'square' ? dims.side ?? dims.length : dims.length
  return (
    <div className={`cfr-measured-figure is-${type}`}>
      {!triangle && top != null && <span className="cfr-measure-label is-top">{measure(top)}</span>}
      {triangle && <span className="cfr-measure-label is-left">{measure(dims.c)}</span>}
      <svg className="cfr-measured-shape" viewBox={triangle ? '0 0 200 150' : type === 'square' ? '0 0 120 120' : '0 0 190 110'} role="img" aria-label={triangle ? 'Triangle avec hauteur en pointillés' : type === 'square' ? 'Carré' : 'Rectangle'}>
        <g fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          {type === 'square' && <rect x="8" y="8" width="104" height="104" />}
          {type === 'rectangle' && <rect x="10" y="5" width="170" height="100" />}
          {triangle && <><polygon points="100,10 20,130 180,130" /><path d="M100 10V130" fill="none" strokeDasharray="5 4" /><path d="M100 124H106V130" fill="none" strokeWidth="1" /></>}
        </g>
      </svg>
      {type === 'rectangle' && dims.width != null && <span className="cfr-measure-label is-right">{measure(dims.width)}</span>}
      {triangle && <><span className="cfr-measure-label is-right">{measure(dims.b)}</span><span className="cfr-measure-label is-bottom">{measure(dims.a)}</span><span className="cfr-measure-label is-height">h = {measure(dims.height)}</span></>}
    </div>
  )
}

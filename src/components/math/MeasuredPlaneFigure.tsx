import type { Figure, FigureDims } from '@/math/types'
import { fmt } from '@/math/column-arith'
import { RasterDiagram } from './RasterDiagram'

/** Les cotes HTML gardent la taille de lecture choisie. */
export function MeasuredPlaneFigure({ type, dims = {} }: { type?: Figure; dims?: FigureDims }) {
  const unit = dims.unit ?? 'cm'
  const measure = (value?: number) => value == null ? '' : `${fmt(value)} ${unit}`
  if (type === 'triangle') {
    const a = dims.a ?? 7, b = dims.b ?? 15, c = dims.c ?? 20
    const projection = (a * a + c * c - b * b) / (2 * a)
    const height = Math.sqrt(Math.max(0, c * c - projection * projection))
    // Une ancienne fiche invalide ne doit pas produire de coordonnées SVG non finies.
    const x = height > 0 ? projection : a * 1.6
    const h = height > 0 ? height : dims.height || a * 1.2
    const scale = Math.min(185 / Math.max(a, x), 115 / h)
    const left = 20, bottom = 132, right = left + a * scale
    const apexX = left + x * scale, apexY = bottom - h * scale
    const label = (x: number, y: number) => ({ left: `${x / 3}%`, top: `${y / 1.6}%` })
    const bLabelY = bottom - 28
    const bAnchorX = right + (apexX - right) * 28 / (bottom - apexY)
    return (
      <div className="cfr-measured-figure is-triangle">
        <div className="cfr-triangle-diagram">
          <RasterDiagram className="cfr-measured-shape" viewBox="0 0 300 160" role="img" aria-label="Triangle scalène avec hauteur extérieure en pointillés">
            <polygon points={`${apexX},${apexY} ${left},${bottom} ${right},${bottom}`} fill="#a7c9da" fillOpacity=".28" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <g className="cfr-external-height" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d={`M${apexX} ${apexY}V${bottom}H${right}`} strokeDasharray="5 4" />
              <path d={`M${apexX - 7} ${bottom}V${bottom - 7}H${apexX}`} />
            </g>
            <path d={`M${bAnchorX + 4} ${bLabelY}H${apexX + 8}`} fill="none" stroke="currentColor" strokeWidth=".8" />
          </RasterDiagram>
          <span className="cfr-measure-label is-side-c" style={label((left + apexX) / 2 - 20, (bottom + apexY) / 2 - 16)}>{measure(dims.c)}</span>
          <span className="cfr-measure-label is-side-b" style={label(apexX + 14, bLabelY)}>{measure(dims.b)}</span>
          <span className="cfr-measure-label is-base" style={label((left + right) / 2, bottom + 15)}>{measure(dims.a)}</span>
          <span className="cfr-measure-label is-height" style={label(apexX + 14, (bottom + apexY) / 2)}>h = {measure(dims.height)}</span>
        </div>
      </div>
    )
  }
  const top = type === 'square' ? dims.side ?? dims.length : dims.length
  return (
    <div className={`cfr-measured-figure is-${type}`}>
      {top != null && <span className="cfr-measure-label is-top">{measure(top)}</span>}
      <RasterDiagram className="cfr-measured-shape" viewBox={type === 'square' ? '0 0 120 120' : '0 0 190 110'} role="img" aria-label={type === 'square' ? 'Carré' : 'Rectangle'}>
        <g fill="#a7c9da" fillOpacity=".28" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          {type === 'square' && <rect x="8" y="8" width="104" height="104" />}
          {type === 'rectangle' && <rect x="10" y="5" width="170" height="100" />}
        </g>
      </RasterDiagram>
      {type === 'rectangle' && dims.width != null && <span className="cfr-measure-label is-right">{measure(dims.width)}</span>}
    </div>
  )
}

import { Children, cloneElement, isValidElement, type ReactNode } from 'react'
import { RasterDiagram } from './RasterDiagram'

type MeasureProps = {
  x: number; y: number; children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  baseline?: 'auto' | 'middle' | 'hanging'
  rotate?: number
}

/** Marqueur retiré du SVG : la cote est rendue en HTML, au corps du texte. */
export function FigureMeasure(_props: MeasureProps) { return null }

export function MeasuredDiagram({ children, viewBox, className = 'geometry-figure cotee', label, overlay = false }: {
  children: ReactNode; viewBox: string; className?: string; label: string; overlay?: boolean
}) {
  const measures: MeasureProps[] = []
  function extract(nodes: ReactNode): ReactNode {
    return Children.map(nodes, node => {
      if (!isValidElement<{ children?: ReactNode }>(node)) return node
      if (node.type === FigureMeasure) { measures.push(node.props as MeasureProps); return null }
      return node.props.children === undefined ? node : cloneElement(node, { children: extract(node.props.children) })
    })
  }
  const drawing = extract(children)
  if (!measures.length) return <RasterDiagram className={className} viewBox={viewBox} role="img" aria-label={label}>{drawing}</RasterDiagram>
  const [, , width, height] = viewBox.split(/\s+/).map(Number)
  const side = (m: MeasureProps) => m.y < 45 ? 'top' : m.y >= 145 ? 'bottom' : m.x < 130 ? 'left' : 'right'
  return (
    <div className={`${className} measured-diagram${overlay ? ' has-positioned-measures' : ''}`}>
      {overlay ? <div className="positioned-measures-plot" style={{aspectRatio:`${width} / ${height}`}}>
        <RasterDiagram className="measured-diagram-shape" viewBox={viewBox} role="img" aria-label={label}>{drawing}</RasterDiagram>
        {measures.map((m, i) => <span key={i} className="dim-label geometry-measure-label" style={{ left: `${m.x / width * 100}%`, top: `${m.y / height * 100}%`, transform: `translate(${m.anchor === 'start' ? '0' : m.anchor === 'end' ? '-100%' : '-50%'}, -50%)` }}>{m.children}</span>)}
      </div> : <>
        <RasterDiagram crop className="measured-diagram-shape" viewBox={viewBox} role="img" aria-label={label}>{drawing}</RasterDiagram>
        {(['top', 'left', 'right', 'bottom'] as const).map(s => <div key={s} className={`geometry-measures is-${s}`}>{measures.filter(m => side(m) === s).map((m, i) => <span key={i} className="dim-label geometry-measure-label">{m.children}</span>)}</div>)}
      </>}

    </div>
  )
}

import { lazy, Suspense } from 'react'
import { fractionFigureDescription, type FractionFigure } from '../domain/fraction-figure'
import { loadFractionDrawing } from '../media/fraction-drawing'
import './fraction-figure.css'
const Drawing = lazy(loadFractionDrawing)

export function FractionFigureView({ figure }: { figure: FractionFigure }) {
  return <div className="ci-fraction-figure" role="img" aria-label={fractionFigureDescription(figure)}>
    <Suspense fallback={<span className="ci-fraction-loading" aria-hidden="true">● ● ●</span>}><Drawing figure={figure}/></Suspense>
  </div>
}

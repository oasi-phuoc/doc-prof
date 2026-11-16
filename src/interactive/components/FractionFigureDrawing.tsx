import { FractionShape } from '@/components/math/FractionShape'
import type { FractionFigure } from '../domain/fraction-figure'

export default function FractionFigureDrawing({ figure }: { figure: FractionFigure }) {
  const colored = new Set(figure.colored.flatMap((part, index) => part ? [index] : []))
  return <FractionShape kind={figure.kind} d={figure.colored.length} colored={colored} />
}

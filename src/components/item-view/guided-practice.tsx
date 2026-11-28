import { columnItem, fmt } from '@/math/column-arith'
import { ADDITION_CARRY_TYPE, RULER_SEGMENT_TYPE, SUBTRACTION_EXCHANGE_TYPE, subtractionExchangeItem } from '@/math/guided-practice'
import type { MathItem } from '@/math/types'
import { ColumnOp } from './columns'
import { RasterDiagram } from '@/components/math/RasterDiagram'

const millimetreTicks = Array.from({ length: 101 }, (_, index) => index)
const rulerUnitsPerMm = 3.4
const rulerWidthMm = 113
const rulerHeight = 70
const rulerX = (millimetres: number) => 16 + rulerUnitsPerMm * millimetres

export function RulerSegmentFigure({ segment, showPositions = false }: {
  segment: NonNullable<MathItem['rulerSegment']>
  showPositions?: boolean
}) {
  const { startMm, endMm, guided } = segment
  const start = rulerX(startMm)
  const end = rulerX(endMm)
  return (
    <RasterDiagram
      className="math-ruler-segment"
      viewBox={`0 0 ${rulerUnitsPerMm * rulerWidthMm} ${rulerHeight}`}
      width={`${rulerWidthMm}mm`}
      height={`${rulerHeight / rulerUnitsPerMm}mm`}
      role="img"
      aria-label={`Sur la règle, le segment part de ${fmt(startMm / 10)} cm et arrive à ${fmt(endMm / 10)} cm.`}
    >
      <rect x="3" y="32" width="378" height="36" rx="3" fill="#f9efd9" stroke="currentColor" />
      {millimetreTicks.map((mm) => {
        const x = rulerX(mm)
        const wholeCm = mm % 10 === 0
        return (
          <g key={mm}>
            <line x1={x} x2={x} y1="32" y2={wholeCm ? 49 : mm % 5 === 0 ? 43 : 39} stroke="currentColor" />
            {wholeCm && <text x={x} y="62" textAnchor="middle">{mm / 10}</text>}
          </g>
        )
      })}
      <text x="375" y="24" textAnchor="end">cm</text>
      <line className="math-ruler-guide" x1={start} x2={end} y1="21" y2="21" strokeWidth="2.5" />
      {[start, end].map((x, index) => (
        <g key={x}>
          <line className="math-ruler-guide" x1={x} x2={x} y1="21" y2="37" strokeDasharray="2 2" />
          <circle className="math-ruler-end" cx={x} cy="21" r="2.7" />
          {guided && (
            <text className="math-ruler-label" x={x + (index === 0 ? 10 : 0)} y="12" textAnchor="middle">
              {index === 0 ? 'Départ' : 'Arrivée'}
              {showPositions && ` à ${fmt((index === 0 ? startMm : endMm) / 10)} cm`}
            </text>
          )}
        </g>
      ))}
    </RasterDiagram>
  )
}

const carryExample: MathItem = {
  ...columnItem('+', 27, 15, 27 + 15, false),
  additionCarryPractice: 'guided',
}
const exchangeExample = { ...subtractionExchangeItem(42, 17, true), prompt: undefined }
const exchangeAcrossZeroExample = { ...subtractionExchangeItem(302, 67, true), prompt: undefined }

export function MathWorkedExample({ exerciseType, subtractionAcrossZero = false }: { exerciseType: string; subtractionAcrossZero?: boolean }) {
  if (exerciseType === ADDITION_CARRY_TYPE) {
    return (
      <figure className="math-worked-example math-worked-addition">
        <ColumnOp item={carryExample} mode="answers" />
        <figcaption>
          <strong>Exemple</strong>
          <p>7 + 5 = 12 unités.</p>
          <p>J’écris 2 unités.</p>
          <p>Je reporte <b className="math-worked-step">1 dizaine</b>.</p>
          <p>C’est la <b className="math-worked-step">retenue</b>.</p>
          <p>La <b className="math-worked-result">somme</b> est 42.</p>
        </figcaption>
      </figure>
    )
  }
  if (exerciseType === RULER_SEGMENT_TYPE) {
    return (
      <figure className="math-worked-example math-worked-ruler">
        <figcaption><strong>Exemple</strong></figcaption>
        <RulerSegmentFigure segment={{ startMm: 20, endMm: 70, guided: true }} showPositions />
        <p><b className="math-worked-result">7 − 2 = 5 cm</b>.</p>
      </figure>
    )
  }
  if (exerciseType === SUBTRACTION_EXCHANGE_TYPE) {
    return (
      <figure className="math-worked-example math-worked-addition">
        <ColumnOp item={subtractionAcrossZero ? exchangeAcrossZeroExample : exchangeExample} mode="answers" />
        <figcaption>
          <strong>Exemple</strong>
          {subtractionAcrossZero ? <>
            <p>J’échange 1 centaine contre 10 dizaines.</p>
            <p>J’échange 1 dizaine contre 10 unités.</p>
            <p>J’écris <b className="math-worked-step">2 centaines, 9 dizaines et 12 unités</b>.</p>
            <p>La <b className="math-worked-result">différence</b> est 235.</p>
          </> : <>
            <p>Je prends <b className="math-worked-step">1 dizaine</b>.</p>
            <p>Je l’échange contre <b className="math-worked-step">10 unités</b>.</p>
            <p>Il reste 3 dizaines. J’ai 12 unités.</p>
            <p>La <b className="math-worked-result">différence</b> est 25.</p>
          </>}
        </figcaption>
      </figure>
    )
  }
  return null
}

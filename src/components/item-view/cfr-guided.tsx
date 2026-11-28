import { useId } from 'react'
import {
  CFR_DAYS, CFR_GRID, cfrExample, cfrPrompt, cfrSolution, cfrTransformationHelp,
  equationHelp, equationText, transformedPoint, type CfrGuidedPractice,
} from '@/math/cfr-guided-practice'
import type { PreviewMode } from '@/math/types'
import { RasterDiagram } from '@/components/math/RasterDiagram'
import './cfr-guided.css'

type Graph = Extract<CfrGuidedPractice, { kind: 'graph' }>
type Fraction = Extract<CfrGuidedPractice, { kind: 'fraction' }>
type Transformation = Extract<CfrGuidedPractice, { kind: 'rotation' | 'axiale' | 'centrale' }>

function FractionParts({ practice, show }: { practice: Fraction; show: boolean }) {
  const { denominator, numerator, total, guided } = practice
  const showParts = guided || show
  return (
    <figure className="math-cfr-fraction">
      <figcaption>{total} jetons en {denominator} parts égales</figcaption>
      <div className="math-cfr-parts">
        {Array.from({ length: denominator }, (_, i) => (
          <span key={i} className={showParts && i < numerator ? 'is-picked' : undefined}>
            {show ? total / denominator : '\u00a0'}
          </span>
        ))}
      </div>
      {showParts && <p>{numerator === 1 ? '1 part à prendre' : `${numerator} parts à prendre`}</p>}
    </figure>
  )
}

function CfrGraph({ practice, show }: { practice: Graph; show: boolean }) {
  const { context, day, compareWith, step, values, guided } = practice
  const description = context === 'temperature' ? 'Température à midi (°C)' : 'Livres empruntés'
  const accessibleValues = CFR_DAYS.map((dayName, index) => `${dayName}, ${values[index]}`).join('. ')
  const left = 34
  const base = 101
  const x = (dayIndex: number) => 63 + dayIndex * 49
  const y = (value: number) => base - 15 * value / step
  return (
    <figure className="math-cfr-graph">
      <figcaption>{description}</figcaption>
      <RasterDiagram className="math-cfr-chart" viewBox="0 0 248 125" role="img" aria-label={`${description}. ${accessibleValues}.`}>
        {Array.from({ length: 6 }, (_, index) => (
          <g key={index}>
            <text x="29" y={y(index * step) + 4} textAnchor="end">{index * step}</text>
            <line className="math-cfr-grid" x1={left} x2="239" y1={y(index * step)} y2={y(index * step)} />
          </g>
        ))}
        <path d={`M${left} 26V${base}H239`} fill="none" stroke="currentColor" />
        {values.map((value, i) => (
          <g key={i}>
            <rect x={x(i) - 10} y={y(value)} width="20" height={base - y(value)}
              className={(show || guided) && (i === day || i === compareWith) ? 'math-cfr-bar is-target' : 'math-cfr-bar'} />
            <text x={x(i)} y="119" textAnchor="middle">{CFR_DAYS[i]!.slice(0, 3)}.</text>
          </g>
        ))}
      </RasterDiagram>
    </figure>
  )
}

function CfrTransform({ practice, show }: { practice: Transformation; show: boolean }) {
  const marker = useId()
  const { kind, guided, points, horizontal, clockwise } = practice
  const { center: [cx, cy], columns, rows } = CFR_GRID
  const px = (step: number) => 11 + 18 * step
  const [x, y] = points[0]!
  const images = points.map(point => transformedPoint(point, practice))
  const [endX, endY] = images[0]!
  const [aX, aY, zX, zY] = [px(x), px(y), px(endX), px(endY)]
  const radius = Math.hypot(aX - px(cx), aY - px(cy))
  const path = kind === 'rotation'
    ? `M${aX} ${aY}A${radius} ${radius} 0 0 ${clockwise ? 1 : 0} ${zX} ${zY}`
    : `M${aX} ${aY}L${zX} ${zY}`
  const drawTriangle = (triangle: typeof points, image: boolean) => (
    <g className={image ? 'math-cfr-image' : 'math-cfr-original'}>
      <polygon points={triangle.map(([col, row]) => `${px(col)},${px(row)}`).join(' ')} />
      {triangle.map(([col, row], index) => (
        <text key={index} x={px(col) + 3} y={px(row) - 3}>{'ABC'[index]}{image ? '′' : ''}</text>
      ))}
    </g>
  )
  const describePoints = (triangle: typeof points, suffix = '') => triangle.map(([col, row], i) => (
    `${'ABC'[i]}${suffix} : colonne ${col}, ligne ${row} depuis le haut.`
  )).join(' ')

  return (
    <RasterDiagram className="math-cfr-transform" viewBox={`0 0 ${px(columns) + 11} ${px(rows) + 11}`}
      role="img" aria-label={`Triangle sur un quadrillage. ${describePoints(points)} ${show ? describePoints(images, '′') : ''}`}>
      <defs>
        <marker id={marker} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" fill="currentColor" />
        </marker>
      </defs>
      <g className="math-cfr-grid">
        {Array.from({ length: columns + 1 }, (_, i) => <line key={i} x1={px(i)} x2={px(i)} y1={px(0)} y2={px(rows)} />)}
        {Array.from({ length: rows + 1 }, (_, i) => <line key={i} x1={px(0)} x2={px(columns)} y1={px(i)} y2={px(i)} />)}
      </g>
      {kind === 'axiale' ? (
        <line className="math-cfr-axis"
          x1={px(horizontal ? 0 : cx)} x2={px(horizontal ? columns : cx)}
          y1={px(horizontal ? cy : 0)} y2={px(horizontal ? cy : rows)} />
      ) : (
        <g>
          <circle cx={px(cx)} cy={px(cy)} r="2.8" fill="currentColor" />
          <text x={px(cx) + 5} y={px(cy) - 5}>O</text>
        </g>
      )}
      {drawTriangle(points, false)}
      {(guided || show) && <path className="math-cfr-path" d={path} markerEnd={`url(#${marker})`} />}
      {guided && !show && (
        <g className="math-cfr-image">
          <circle cx={zX} cy={zY} r="2.2" fill="currentColor" />
          <text x={zX + 3} y={zY - 3}>A′</text>
        </g>
      )}
      {show && drawTriangle(images, true)}
    </RasterDiagram>
  )
}

export function CfrGuidedView({ practice, mode, example = false }: {
  practice: CfrGuidedPractice
  mode: PreviewMode
  example?: boolean
}) {
  const show = mode === 'answers'
  const transformation = practice.kind === 'rotation' || practice.kind === 'axiale' || practice.kind === 'centrale'
  const prompt = cfrPrompt(practice)
  return (
    <div className={practice.kind === 'equation' ? 'math-cfr-practice is-equation' : 'math-cfr-practice'}>
      <div className="math-cfr-visual">
        {practice.kind === 'fraction' && <FractionParts practice={practice} show={show} />}
        {practice.kind === 'graph' && <CfrGraph practice={practice} show={show} />}
        {practice.kind === 'equation' && <p className="math-cfr-equation">{equationText(practice)}</p>}
        {transformation && <CfrTransform practice={practice} show={show} />}
      </div>
      <div>
        {!transformation && !example && (!show || practice.kind !== 'equation') && <p>{prompt}</p>}
        {transformation ? (
          <>
            {(practice.kind === 'rotation' || example || (practice.guided && !show)) && <p>{cfrTransformationHelp(practice)}</p>}
            <p>{show ? 'L’image est le triangle A′B′C′.' : practice.guided ? 'A′ est placé. Placez B′ et C′. Reliez les points.' : 'Placez A′, B′ et C′. Reliez les points.'}</p>
          </>
        ) : show ? (
          cfrSolution(practice).map(line => <p className="math-worked-result" key={line}>{line}</p>)
        ) : (
          <>
            {practice.guided && <p className="math-cfr-hint">
              {practice.kind === 'fraction' ? 'Calculez d’abord le nombre de jetons dans une part.'
                : practice.kind === 'graph' ? 'Suivez la hauteur de la barre jusqu’à la graduation.'
                : practice.kind === 'equation' && equationHelp(practice)}
            </p>}
            <span className="answer-line-field">&nbsp;</span>
          </>
        )}
      </div>
    </div>
  )
}

export function CfrGuidedExample({ practice }: { practice: CfrGuidedPractice }) {
  return (
    <div className="math-worked-example math-cfr-example">
      <strong>Exemple</strong>
      <CfrGuidedView practice={cfrExample(practice)} mode="answers" example />
    </div>
  )
}

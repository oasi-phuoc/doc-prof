import { useId } from 'react'
import { RECTANGLE_MEASURES_TYPE, TRANSLATION_GRID, TRANSLATION_PRACTICE_TYPE, translatePoint } from '@/math/guided-practice'
import type { MathItem, PreviewMode } from '@/math/types'
import translationExample from '@/math/media/theory/falc/translation.png'
import { RasterDiagram } from '@/components/math/RasterDiagram'

function RectangleFigure({ length, width, hatched }: { length: number; width: number; hatched: boolean }) {
  const pattern = useId()
  const scale = 17
  const w = length * scale
  const h = width * scale
  return (
    <RasterDiagram className="math-rectangle-measures" viewBox={`0 0 ${w + 48} ${h + 29}`} role="img"
      aria-label={`Rectangle de ${length} cm sur ${width} cm. Les carreaux font 1 cm de côté.`}>
      <defs>
        <pattern id={pattern} width={scale} height={scale} patternUnits="userSpaceOnUse" x="8" y="20">
          <path d={`M${scale} 0H0V${scale}`} fill="none" stroke="#68788c" />
          {hatched && <path d="M4 13L13 4" className="math-dense-hatch" />}
        </pattern>
      </defs>
      <rect x="8" y="20" width={w} height={h} className={hatched ? 'math-perimeter-example' : undefined}
        fill={`url(#${pattern})`} strokeWidth={hatched ? 2.4 : 1.2} stroke="currentColor" />
      <text x={8 + w / 2} y="13" textAnchor="middle">{length} cm</text>
      <text x={w + 13} y={24 + h / 2}>{width} cm</text>
    </RasterDiagram>
  )
}

export function RectangleMeasuresPractice({ rectangle, mode }: {
  rectangle: NonNullable<MathItem['rectangleMeasures']>; mode: PreviewMode
}) {
  const { length, width, guided } = rectangle
  const show = mode === 'answers'
  return (
    <div className="math-geometry-pilot math-rectangle-question">
      <RectangleFigure length={length} width={width} hatched={false} />
      <div>
        <p>{guided ? 'Additionnez les quatre côtés.' : 'Calculez le périmètre.'}</p>
        <span className={`answer-line-field${show ? ' filled' : ''}`}>{show ? `${length} + ${width} + ${length} + ${width} = ${2 * (length + width)} cm` : '\u00a0'}</span>
        <p>{guided ? 'Comptez les carreaux à l’intérieur.' : 'Calculez l’aire.'}</p>
        <span className={`answer-line-field${show ? ' filled' : ''}`}>{show ? `${length} × ${width} = ${length * width} cm²` : '\u00a0'}</span>
      </div>
    </div>
  )
}

function moveText(vector: readonly [number, number], axis: 0 | 1) {
  const amount = Math.abs(vector[axis])
  const direction = axis === 0 ? (vector[axis] > 0 ? 'à droite' : 'à gauche') : (vector[axis] > 0 ? 'vers le bas' : 'vers le haut')
  return `${amount} ${amount === 1 ? 'case' : 'cases'} ${direction}`
}

export function TranslationPractice({ practice, mode }: {
  practice: NonNullable<MathItem['translationPractice']>; mode: PreviewMode
}) {
  const marker = useId()
  const { figure, vector, guided } = practice
  const images = figure.map((point) => translatePoint(point, vector))
  const [x, y] = figure[0]!
  const [endX, endY] = images[0]!
  const { columns, rows } = TRANSLATION_GRID
  const px = (coordinate: number) => coordinate * 22 + 14
  const show = mode === 'answers'
  const drawTriangle = (points: typeof figure, image: boolean) => (
    <g className={image ? 'math-translation-image' : 'math-translation-start'}>
      <polygon points={points.map(([col, row]) => `${px(col)},${px(row)}`).join(' ')} />
      {points.map(([col, row], index) => (
        <text key={index} x={px(col) + (index === 0 ? -9 : 3)} y={px(row) + (index === 0 ? -5 : 12)}>
          {'ABC'[index]}{image ? '′' : ''}
        </text>
      ))}
    </g>
  )
  return (
    <div className="math-geometry-pilot math-translation-practice">
      <p>Déplacez chaque sommet.</p>
      <p>Allez de {moveText(vector, 0)}, puis de {moveText(vector, 1)}.</p>
      <p>Reliez les trois nouveaux points.</p>
      <RasterDiagram className="math-translation-drawing" viewBox={`0 0 ${px(columns) + 14} ${px(rows) + 14}`} role="img" aria-label={`Triangle ABC sur quadrillage. Déplacement de ${moveText(vector, 0)} et de ${moveText(vector, 1)}.${show ? ' Le triangle A′B′C′ montre le résultat.' : ''}`}>
        <defs>
          <marker id={marker} markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
            <path d="M0 0L5 2.5L0 5Z" fill="#174a7e" />
          </marker>
        </defs>
        <g className="math-translation-grid">
          {Array.from({ length: columns + 1 }, (_, col) => <line key={col} x1={px(col)} x2={px(col)} y1={px(0)} y2={px(rows)} />)}
          {Array.from({ length: rows + 1 }, (_, row) => <line key={row} x1={px(0)} x2={px(columns)} y1={px(row)} y2={px(row)} />)}
        </g>
        {drawTriangle(figure, false)}
        {(guided || show) && (
          <g className="math-translation-guide">
            <line x1={px(x)} x2={px(endX)} y1={px(y)} y2={px(y)} markerEnd={`url(#${marker})`} />
            <line x1={px(endX)} x2={px(endX)} y1={px(y)} y2={px(endY)} markerEnd={`url(#${marker})`} />
          </g>
        )}
        {show && drawTriangle(images, true)}
      </RasterDiagram>
    </div>
  )
}

export function MathGeometryExample({ exerciseType }: { exerciseType: string }) {
  if (exerciseType === RECTANGLE_MEASURES_TYPE) {
    return (
      <figure className="math-worked-example math-rectangle-example">
        <RectangleFigure length={5} width={3} hatched />
        <figcaption>
          <strong>Exemple</strong>
          <p>Le <b className="math-worked-step">périmètre</b> mesure le tour.</p>
          <p>5 + 3 + 5 + 3 = <b>16 cm</b>.</p>
          <p>L’<b className="math-worked-result">aire</b> mesure la surface.</p>
          <p>5 × 3 = <b>15 cm²</b>.</p>
        </figcaption>
      </figure>
    )
  }
  if (exerciseType === TRANSLATION_PRACTICE_TYPE) {
    return (
      <figure className="math-worked-example math-translation-example">
        <figcaption><strong>Exemple.</strong> Je déplace chaque sommet de la même façon.</figcaption>
        <img src={translationExample} alt="Exemple : de A à A′, trois cases à droite puis une case vers le haut. Le triangle entier suit ce déplacement." />
      </figure>
    )
  }
  return null
}

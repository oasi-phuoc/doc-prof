import { useId } from 'react'
import { RECTANGLE_MEASURES_TYPE, TRANSLATION_GRID, TRANSLATION_PRACTICE_TYPE, translatePoint } from '@/math/guided-practice'
import type { MathItem, PreviewMode, SionMapBackground } from '@/math/types'
import { DEFAULT_REAL_MAP_ID, REAL_MAP_COLUMNS, realMapPlan, type RealMapPlan } from '@/math/real-map-catalog'
import sionPhoto from '@/math/media/spatial/sion-swissimage.webp'
import sionAnnotatedPhoto from '@/math/media/spatial/sion-photo-chemins.webp'
import sionSimplifiedMap from '@/math/media/spatial/sion-plan-simplifie.png'
import translationExample from '@/math/media/theory/falc/translation.png'
import { RasterDiagram } from '@/components/math/RasterDiagram'

const sionLabelOffsets = [
  { dx: -24, dy: 26, anchor: 'start' },
  { dx: 0, dy: -23, anchor: 'middle' },
  { dx: 0, dy: -12, anchor: 'middle' },
  { dx: -12, dy: 5, anchor: 'end' },
] as const

const sionBackgrounds: Record<SionMapBackground, { src: string; alt: string; caption: string }> = {
  photo: { src: sionPhoto, alt: 'Photo aérienne', caption: 'Sion · Photo aérienne © swisstopo' },
  annotated: { src: sionAnnotatedPhoto, alt: 'Photo aérienne avec les routes et les chemins', caption: 'Sion · Photo © swisstopo' },
  simplified: { src: sionSimplifiedMap, alt: 'Plan simplifié', caption: 'Sion · Dessin d’après © swisstopo' },
}

const townImages = import.meta.glob<string>('../../math/media/spatial/swiss/*.{png,webp}', {
  eager: true, import: 'default', query: '?url',
})

function labelCoordinates(plan: RealMapPlan, width: number, height: number) {
  const chosen: Array<{ x: number; y: number; width: number }> = []
  return plan.places.map(({ name, x, y }) => {
    const dotX = x * width
    const dotY = y * height
    const half = Math.min(name.length * 3.55, 143)
    const labelX = Math.max(half + 4, Math.min(width - half - 4, dotX))
    const candidates = [-11, 22, -29, 40, -48, 58].map(offset => Math.max(10, Math.min(height - 5, dotY + offset)))
    const labelY = candidates.find(y => !chosen.some(
      label => Math.abs(y - label.y) < 18 && Math.abs(labelX - label.x) < half + label.width + 5,
    )) ?? candidates[0]!
    chosen.push({ x: labelX, y: labelY, width: half })
    return { x: labelX, y: labelY, anchor: 'middle' as const }
  })
}

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

export function SionMapPractice({ item, mode }: { item: MathItem; mode: PreviewMode }) {
  const { target, background, planId } = item.sionMap!
  const plan = realMapPlan(planId)
  const historic = plan.id === DEFAULT_REAL_MAP_ID
  const variant = background === 'annotated' || background === 'simplified' ? background : 'photo'
  const map = sionBackgrounds[variant]
  const image = historic ? map.src : townImages[`../../math/media/spatial/swiss/${plan.id}-${variant}.${variant === 'simplified' ? 'png' : 'webp'}`]
  const model = plan.places[(target + 1) % plan.places.length]!
  const show = mode === 'answers'
  const { columns, rows } = plan.grid
  const w = 432
  const h = 288
  const left = 20
  const top = 22
  const labels = historic ? plan.places.map(({ x, y }, index) => {
    const offset = sionLabelOffsets[index]!
    return { x: x * w + offset.dx, y: y * h + offset.dy, anchor: offset.anchor }
  }) : labelCoordinates(plan, w, h)
  return (
    <div className={`math-geometry-pilot math-sion-map is-${variant}${historic ? '' : ' is-regional'}`}>
      <p className="math-sion-example"><strong>Exemple.</strong> {model.name} se trouve en {model.code}.</p>
      <figure>
        <div className="math-sion-plot">
          <img className="math-sion-background" src={image} alt="" style={{ left: `${100 * left / (w + left)}%`, top: `${100 * top / (h + top)}%`, width: `${100 * w / (w + left)}%`, height: `${100 * h / (h + top)}%` }} />
          <RasterDiagram className="math-sion-overlay" viewBox={`${-left} ${-top} ${w + left} ${h + top}`} role="img" aria-label={`${map.alt}. ${plan.label}. Colonnes A à ${REAL_MAP_COLUMNS[columns - 1]} et lignes 1 à ${rows}. ${plan.places.map(({ name, code }) => `${name}, case ${code}`).join('. ')}.`}>
          <g className="math-sion-grid">
            {Array.from({ length: columns - 1 }, (_, index) => <line key={index} x1={(index + 1) * w / columns} x2={(index + 1) * w / columns} y1="0" y2={h} />)}
            {Array.from({ length: rows - 1 }, (_, index) => <line key={index} x1="0" x2={w} y1={(index + 1) * h / rows} y2={(index + 1) * h / rows} />)}
          </g>
          <rect x="0" y="0" width={w} height={h} fill="none" stroke="currentColor" />
          {Array.from({ length: columns }, (_, index) => <text key={index} x={(index + 0.5) * w / columns} y="-6" textAnchor="middle">{REAL_MAP_COLUMNS[index]}</text>)}
          {Array.from({ length: rows }, (_, index) => <text key={index} x="-11" y={(index + 0.54) * h / rows} textAnchor="middle">{index + 1}</text>)}
          <g className="math-sion-north" aria-hidden="true">
            <path d="M409 39V12M405 17L409 12L413 17" />
            <text x="409" y="51" textAnchor="middle">N</text>
          </g>
          {plan.places.map(({ name, x, y, column, row }, index) => {
            const label = labels[index]!
            return (
              <g key={name} className="math-sion-place">
                {show && index === target && <rect x={column * w / columns} y={row * h / rows} width={w / columns} height={h / rows} className="math-sion-answer-cell" />}
                <line x1={x * w} y1={y * h} x2={historic ? x * w : label.x} y2={label.y - 4} />
                <circle cx={x * w} cy={y * h} r="4" />
                <text x={label.x} y={label.y} textAnchor={label.anchor}>{name}</text>
              </g>
            )
          })}
          </RasterDiagram>
        </div>
        <figcaption>
          {variant !== 'photo' && (
            <span className="math-sion-legend">
              <span className="math-sion-road-key">Route</span>
              <span className="math-sion-path-key">Chemin à pied</span>
            </span>
          )}
          <span>{historic ? map.caption : `${plan.label}${variant === 'simplified' ? '' : ' · © swisstopo'}`}</span>
          {!historic && variant !== 'photo' && <small className="math-region-attribution">Tracés © OpenStreetMap (ODbL) · openstreetmap.org/copyright</small>}
        </figcaption>
      </figure>
      <p className="math-sion-question">{item.prompt}</p>
      <span className={`answer-line-field${show ? ' filled' : ''}`}>{show ? item.answer : '\u00a0'}</span>
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

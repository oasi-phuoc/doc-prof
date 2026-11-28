import { RasterDiagram } from '@/components/math/RasterDiagram'
import { DEFAULT_REAL_MAP_ID, mapBackgroundLabels, REAL_MAP_COLUMNS, type MapPoint } from '@/math/real-map-catalog'
import { realMapPractice, type RealMapItem } from '@/math/real-map-practice'
import type { PreviewMode, SionMapBackground } from '@/math/types'
import sionPhoto from '@/math/media/spatial/sion-swissimage.webp'
import sionAnnotatedPhoto from '@/math/media/spatial/sion-photo-chemins.webp'
import sionSimplifiedMap from '@/math/media/spatial/sion-plan-simplifie.png'

const historicImages: Record<SionMapBackground, string> = {
  photo: sionPhoto, annotated: sionAnnotatedPhoto, simplified: sionSimplifiedMap,
}
const mapImages = import.meta.glob<string>('../../math/media/spatial/{swiss,world,imaginary}/*.{png,webp}', {
  eager: true, import: 'default', query: '?url',
})

function labelPositions(points: MapPoint[], width: number, height: number) {
  const labels = [16, 30, 45].map(y => ({ x: width - 14, y, half: 8 }))
  return points.map(({ name, x, y }) => {
    const half = name.length * 3.55
    const candidates = [-10, 20, -26, 36, -42, 52, -58, 68, -74, 84].flatMap(offset =>
      [0, -24, 24, -48, 48].map(shift => ({
        x: Math.max(half + 4, Math.min(width - half - 4, x * width + shift)),
        y: Math.max(13, Math.min(height - 4, y * height + offset)), half,
      })))
    const label = candidates.find(({ x, y }) =>
      !labels.some(label => Math.abs(y - label.y) < 15 && Math.abs(x - label.x) < half + label.half + 4) &&
      !points.some(point => Math.abs(y - 4 - point.y * height) < 8 && Math.abs(x - point.x * width) < half + 4),
    ) ?? candidates[0]!
    labels.push(label)
    return label
  })
}

export function RealMapFigure({ data, mode }: { data: RealMapItem; mode: PreviewMode }) {
  const { plan, posts, route } = realMapPractice(data)
  const { columns, rows } = plan.grid
  const axes = data.notation === 'coordinates'
  const show = mode === 'answers'
  const historic = plan.id === DEFAULT_REAL_MAP_ID
  const capitalMap = plan.family === 'europe' || plan.family === 'world'
  const illustrated = plan.family === 'imaginary'
  const imageFolder = capitalMap ? 'world' : plan.family
  const backgrounds = mapBackgroundLabels(plan.family)
  const variant = data.background === 'annotated' || data.background === 'simplified' ? data.background : 'photo'
  const image = historic ? historicImages[variant]
    : mapImages[`../../math/media/spatial/${imageFolder}/${plan.id}-${variant}.${variant === 'simplified' ? 'png' : 'webp'}`]
  const w = 432, h = 288, left = 23, top = axes ? 8 : 22, bottom = axes ? 23 : 0, right = axes ? 12 : 0
  const width = w + left + right, height = h + top + bottom
  const xAt = (index: number) => index * w / columns
  const yAt = (index: number) => index * h / rows
  const landmarks = [...plan.places, ...posts.filter(post => post.given || show)]
  const labels = labelPositions(landmarks, w, h)
  const path = `M${route.from.x * w} ${route.from.y * h}L${route.to.x * w} ${route.to.y * h}`
  return (
    <div className={`math-sion-map is-${variant}`}>
      <h3 className="real-map-title">{plan.label}</h3>
      <figure>
        <div className="math-sion-plot">
          <img className="math-sion-background" src={image} alt="" style={{ left: `${100 * left / width}%`, top: `${100 * top / height}%`, width: `${100 * w / width}%`, height: `${100 * h / height}%` }} />
          <RasterDiagram className="math-sion-overlay" viewBox={`${-left} ${-top} ${width} ${height}`} role="img"
            aria-label={`${backgrounds[variant]}. ${plan.label}. ${axes ? `Axe horizontal de 0 à ${columns}. Axe vertical de 0 à ${rows}.` : `Colonnes A à ${REAL_MAP_COLUMNS[columns - 1]} et lignes 1 à ${rows}.`} Repères visibles. ${landmarks.map(({ name }) => name).join(', ')}.`}>
            <g className="math-sion-grid">
              {Array.from({ length: columns - 1 }, (_, i) => <path key={`col-${i}`} d={`M${xAt(i + 1)} 0V${h}`} />)}
              {Array.from({ length: rows - 1 }, (_, i) => <path key={`row-${i}`} d={`M0 ${yAt(i + 1)}H${w}`} />)}
            </g>
            <rect className="math-sion-border" x="0" y="0" width={w} height={h} />
            {axes ? <>
              <path className="math-sion-axes" d={`M0 -6V${h}H${w + 8}M-4 -1L0 -6L4 -1M${w + 3} ${h - 4}L${w + 8} ${h}L${w + 3} ${h + 4}`} />
              {Array.from({ length: columns + 1 }, (_, i) => <text key={i} x={xAt(i)} y={h + 17} textAnchor="middle">{i}</text>)}
              {Array.from({ length: rows }, (_, i) => <text key={i} x="-11" y={h - yAt(i + 1) + 4} textAnchor="middle">{i + 1}</text>)}
            </> : <>
              {Array.from({ length: columns }, (_, i) => <text key={i} x={xAt(i + 0.5)} y="-6" textAnchor="middle">{REAL_MAP_COLUMNS[i]}</text>)}
              {Array.from({ length: rows }, (_, i) => <text key={i} x="-11" y={yAt(i + 0.5) + 4} textAnchor="middle">{i + 1}</text>)}
            </>}
            <g className="math-sion-north" aria-hidden="true" transform={`translate(${w - 14} 10)`}>
              <path d="M0 23V0M-4 6L0 0L4 6" /><text y="35" textAnchor="middle">N</text>
            </g>
            {show && <g className="math-map-route">
              <path d={path} stroke="#fff" strokeWidth="4.6" />
              <path d={path} stroke={route.color.ink} strokeWidth="2.8" />
            </g>}
            {landmarks.map(({ name, x, y }, i) => {
              const label = labels[i]!
              return <g key={i} className="math-sion-place">
                <line x1={x * w} y1={y * h} x2={label.x} y2={label.y - 4} />
                <circle cx={x * w} cy={y * h} r={i >= plan.places.length ? 4.2 : 3.6} />
                <text x={label.x} y={label.y} textAnchor="middle">{name}</text>
              </g>
            })}
          </RasterDiagram>
        </div>
        <figcaption>
          {variant !== 'photo' && <span className="math-sion-legend">
            {capitalMap ? <span className="math-sion-border-key">Frontière</span> : <><span className="math-sion-road-key">Route</span><span className="math-sion-path-key">Chemin à pied</span></>}
          </span>}
          {capitalMap ? <span>{variant === 'simplified' ? 'Natural Earth' : 'NASA Blue Marble · Natural Earth'}</span>
            : illustrated ? <span>Lieu imaginaire · Dessin original</span>
              : <>
                {(historic || variant !== 'simplified') && <span>{variant === 'simplified' ? 'Dessin d’après © swisstopo' : 'Photo © swisstopo'}</span>}
                <span>© OpenStreetMap (ODbL) · openstreetmap.org/copyright</span>
              </>}
        </figcaption>
      </figure>
      {capitalMap && <ul className="real-map-capitals" aria-label="Capitales et pays">
        {plan.places.map(({ name, country }) => <li key={name}><strong>{name}</strong> · {country}</li>)}
      </ul>}
    </div>
  )
}

export function RealMapQuestions({ data, mode }: { data: RealMapItem; mode: PreviewMode }) {
  const { plan, questions } = realMapPractice(data)
  const show = mode === 'answers'
  return (
    <div className="real-map-questions">
      <h3 className="real-map-title">Questions sur le plan <span>{plan.label}</span></h3>
      <p className="real-map-instruction">{data.notation === 'coordinates'
        ? 'Regardez le plan. Partez de 0. Lisez d’abord l’axe horizontal, puis l’axe vertical.'
        : 'Regardez le plan. Pour lire une case, lisez la lettre, puis le chiffre.'}</p>
      <ol>
        {questions.map((question, index) => (
          <li key={index}>
            <p>{question.prompt.split('**').map((part, i) => i % 2
              ? <strong key={i} style={question.kind === 'draw' && (part === question.color.name || part === `en ${question.color.name}`)
                ? { color: question.color.ink } : undefined}>{part}</strong> : part)}</p>
            {'hint' in question && question.hint && <small>{question.hint}</small>}
            {question.kind === 'text' && <div className={`real-map-answer${show ? ' is-corrected' : ''}`}>
              {show ? question.answer : <><span>Phrase</span><span aria-hidden="true" /></>}
            </div>}
            {question.kind === 'draw' && show && <div className="real-map-answer is-corrected">{question.answer}</div>}
            {question.kind === 'check' && <ul className="real-map-options">
              {question.choices.map(({ label, correct }) => <li key={label}>
                <span className="real-map-checkbox" role="img" aria-label={show && correct ? 'Case cochée' : 'Case à cocher'}>{show && correct ? '✓' : ''}</span>
                {label}
              </li>)}
            </ul>}
            {(question.kind === 'place' || question.kind === 'read') && <ul className="real-map-posts">
              {question.posts.map(({ name, column, row }) => <li key={name}>
                <strong>{name}</strong> {show || question.kind === 'place' ? `(${column} ; ${row})` : '(_____ ; _____)'}
              </li>)}
            </ul>}
          </li>
        ))}
      </ol>
    </div>
  )
}

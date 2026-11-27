import { solidImageUrl, SquareGrid } from './geometry-practice'
import { getSpatialMap, MAP_COLUMNS, MAP_ROWS } from '../../math/spatial-practice'
import type { PreviewMode, SpatialCamera, SpatialPoint, SpatialPractice } from '../../math/types'

const images = import.meta.glob<string>('../../math/media/spatial/*.png', {
  eager: true, import: 'default', query: '?url',
})

const directions: Record<SpatialCamera, string> = { A: '↓', B: '←', C: '↑', D: '→' }

function imageUrl(id: string) {
  return images[`../../math/media/spatial/${id}.png`]
}

function overlayAt({ x, y }: SpatialPoint) {
  return { left: `${(x + 0.5) / MAP_COLUMNS * 100}%`, top: `${(y + 0.5) / MAP_ROWS * 100}%` }
}

function RouteOverlay({ path }: { path: SpatialPoint[] }) {
  return (
    <div aria-hidden="true" className="math-spatial-overlay">
      {path.slice(1).map((to, i) => {
        const from = path[i]!
        const horizontal = from.y === to.y
        return <span
          key={i}
          className={`math-spatial-route ${horizontal ? 'horizontal' : 'vertical'}`}
          style={overlayAt({ x: Math.min(from.x, to.x), y: Math.min(from.y, to.y) })}
        />
      })}
      {[path[0]!, path[path.length - 1]!].map((cell, i) => (
        <span key={i} className="math-spatial-route-end" style={overlayAt(cell)} />
      ))}
    </div>
  )
}

function IllustratedMap({
  practice, answers,
}: { practice: Extract<SpatialPractice, { map: string }>; answers: boolean }) {
  const map = getSpatialMap(practice.map)
  if (!map) return null
  const blocked = map.blocked.map(([x, y]) => `${String.fromCharCode(65 + x!)}${y! + 1}`)
  return (
    <>
      <figure className="math-spatial-figure">
        <figcaption><strong>{map.title}</strong><span>↑ Nord</span></figcaption>
        <div className="math-spatial-map">
          <img src={imageUrl(map.id)} alt={`${map.title}. Cases hachurées : ${blocked.join(', ')}.`} />
          <div className="math-spatial-grid">
            {Array.from({ length: MAP_ROWS * MAP_COLUMNS }, (_, index) => {
              const x = index % MAP_COLUMNS
              const y = Math.floor(index / MAP_COLUMNS)
              const landmark = map.landmarks.find((place) => place.x === x && place.y === y)
              return <div key={index}>{landmark && (
                <span aria-label={`${landmark.name}, case ${String.fromCharCode(65 + x)}${y + 1}`}>{landmark.name}</span>
              )}</div>
            })}
          </div>
          <div className="math-spatial-cols" aria-hidden="true">{Array.from({ length: MAP_COLUMNS }, (_, x) => <span key={x}>{String.fromCharCode(65 + x)}</span>)}</div>
          <div className="math-spatial-rows" aria-hidden="true">{Array.from({ length: MAP_ROWS }, (_, y) => <span key={y}>{y + 1}</span>)}</div>
          {practice.cameras?.map((letter) => <span key={letter} className={`math-spatial-camera point-${letter}`} aria-label={`Point de vue ${letter}`}>{letter} {directions[letter]}</span>)}
          {answers && practice.path && <RouteOverlay path={practice.path} />}
          {answers && practice.mark && <strong className="math-spatial-mark" style={overlayAt(practice.mark)} aria-label="Croix">×</strong>}
        </div>
      </figure>
      {practice.views && <div className="math-spatial-view-list">
        {practice.views.map((view, index) => (
          <figure key={view}>
            <img src={imageUrl(`${map.id}-${view}`)} alt={`Objets de gauche à droite : ${map.views[view].join(', ')}.`} />
            <figcaption>Image {index + 1}</figcaption>
          </figure>
        ))}
      </div>}
    </>
  )
}

function StackTable({ stacks, footprint, answers }: { stacks: number[][]; footprint?: boolean; answers: boolean }) {
  return (
    <table className="math-spatial-stacks" aria-label={footprint ? 'Vue de dessus' : 'Plan des piles'}>
      <tbody>
        {stacks.map((row, y) => (
          <tr key={y}>{row.map((height, x) => (
            <td key={x} className={footprint && answers && height ? 'is-occupied' : ''}>
              {footprint ? (answers && height > 0 ? '×' : '') : height || ''}
            </td>
          ))}</tr>
        ))}
      </tbody>
    </table>
  )
}

function SolidFromViews({ practice }: { practice: Extract<SpatialPractice, { models: string[] }> }) {
  return (
    <>
      <div className="math-spatial-stack-list">
        {practice.projections.map(({ label, cells }) => (
          <figure key={label}>
            <SquareGrid cells={cells} label={`Vue ${label.toLowerCase()}`} />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="math-spatial-view-list is-solids">
        {practice.models.map((model, index) => {
          const label = String.fromCharCode(65 + index)
          return <figure key={model}>
            <img src={solidImageUrl(model)} alt={`Assemblage de cubes ${label}`} />
            <figcaption>{label}</figcaption>
          </figure>
        })}
      </div>
    </>
  )
}

export function SpatialPracticeView({ practice, mode }: { practice: SpatialPractice; mode: PreviewMode }) {
  const answers = mode === 'answers'
  return (
    <div className="math-spatial-practice">
      {'map' in practice ? <IllustratedMap practice={practice} answers={answers} /> :
        'models' in practice ? <SolidFromViews practice={practice} /> : (
        <div className="math-spatial-stack-list">
          <figure>
            <StackTable stacks={practice.stacks} answers={answers} />
            <figcaption>Plan des piles</figcaption>
          </figure>
          {practice.drawFootprint && <figure>
            <StackTable stacks={practice.stacks} footprint answers={answers} />
            <figcaption>Vue de dessus</figcaption>
          </figure>}
        </div>
      )}
      <div className="math-spatial-questions">
        {practice.questions.map((question, index) => {
          const drawing = 'map' in practice ? practice.mark && index === 2 : 'stacks' in practice && practice.drawFootprint && index === 2
          return <div key={question.prompt}>
            <p>{practice.questions.length > 1 && `${index + 1}. `}{question.prompt}</p>
            {(!drawing || answers) && <span className={`answer-line-field${answers ? ' filled' : ''}`}>{answers ? question.answer : '\u00a0'}</span>}
          </div>
        })}
      </div>
    </div>
  )
}

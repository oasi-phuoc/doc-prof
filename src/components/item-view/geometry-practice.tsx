import type { RectangleGrid, SolidViews } from '../../math/types'

const solidImages = import.meta.glob<string>('../../math/media/solid-views/*.png', {
  eager: true, import: 'default', query: '?url',
})

export function SquareGrid({ cells, label }: { cells: boolean[][]; label: string }) {
  return (
    <table className="math-square-grid" aria-label={label}>
      <tbody>
        {cells.map((row, y) => (
          <tr key={y}>
            {row.map((filled, x) => <td key={x} className={filled ? 'is-filled' : ''} aria-label={filled ? 'Case grisée' : 'Case vide'} />)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function AreaFigures({ figures }: { figures: RectangleGrid[] }) {
  return (
    <div className="math-square-figures">
      <div className="math-square-figures-row">
        {figures.map(({ width, height, cut }, i) => {
          const label = i === 0 ? 'A' : 'B'
          const cells = Array.from({ length: height }, (_, row) => Array.from(
            { length: width }, (_, col) => !cut || row >= cut.height || col < width - cut.width,
          ))
          return (
            <figure key={label}>
              <SquareGrid cells={cells} label={`Figure ${label}`} />
              {figures.length > 1 && <figcaption>{label}</figcaption>}
            </figure>
          )
        })}
      </div>
      <p>Chaque carreau mesure 1 cm de côté.</p>
    </div>
  )
}

export function solidImageUrl(id: string) {
  return solidImages[`../../math/media/solid-views/${id}.png`]
}

export function SolidViewChoices({ solid }: { solid: SolidViews }) {
  return (
    <div className="math-solid-choices">
      <img
        src={solidImageUrl(solid.image)}
        alt="Solide en cubes. La face est à droite du dessin et le côté est à gauche."
      />
      <div className="math-square-figures-row">
        {solid.views.map(({ label, cells }) => (
          <figure key={label}>
            <SquareGrid cells={cells} label={`Vue ${label}`} />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

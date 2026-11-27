import type { MathItem, PreviewMode } from '@/math/types'
import { formatMenuPrice } from '@/math/foundations-practice'
import plate from '@/math/media/base-ten/plaque.png'
import rod from '@/math/media/base-ten/barre.png'
import cube from '@/math/media/base-ten/cube.png'

export function BaseTenCollection({ collection }: { collection: NonNullable<MathItem['baseTen']> }) {
  const groups = [
    { label: 'Plaques', image: plate, style: 'plate', count: collection.hundreds },
    { label: 'Barres', image: rod, style: 'rod', count: collection.tens },
    { label: 'Cubes', image: cube, style: 'cube', count: collection.ones },
  ]
  return (
    <div className="math-base-ten">
      {groups.map(({ label, image, style, count }) => (
        <div key={label} className={`math-base-ten-group math-base-ten-${style}`}>
          <b>{label}</b>
          <div className="math-base-ten-tiles" role="img" aria-label={`${label} : ${count}`}>
            {count === 0 ? <span aria-hidden="true">–</span> : Array.from({ length: count }, (_, i) => (
              <img key={i} src={image} alt="" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function MenuPriceTable({ prices }: { prices: NonNullable<MathItem['menuPrices']> }) {
  return (
    <table className="math-menu-prices" aria-label="Menu">
      <thead>
        <tr><th scope="col">Article</th>{prices.map(({ label }) => <th key={label} scope="col">{label}</th>)}</tr>
      </thead>
      <tbody>
        <tr><th scope="row">Prix (CHF)</th>{prices.map(({ label, cents }) => <td key={label}>{formatMenuPrice(cents)}</td>)}</tr>
      </tbody>
    </table>
  )
}

export function LengthUnitComparison({
  lengths, mode,
}: { lengths: NonNullable<MathItem['lengthUnits']>; mode: PreviewMode }) {
  const rows = [
    { label: 'Étalon', units: 1 },
    { label: 'A', units: lengths.a },
    { label: 'B', units: lengths.b },
  ]
  return (
    <div className="math-length-units">
      {rows.map(({ label, units }) => (
        <div className="math-length-row" key={label}>
          <b>{label}</b>
          <div
            className="math-length-strip"
            style={{ width: `${units * 10}%`, gridTemplateColumns: `repeat(${units}, minmax(0, 1fr))` }}
            role="img"
            aria-label={`Bande ${label} à ${mode === 'answers' ? `${units} unité(s)` : 'reporter ou mesurer'}`}
          >
            {(mode === 'answers' || units === 1) && Array.from({ length: units }, (_, i) => <span key={i} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

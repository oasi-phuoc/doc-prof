import type { CSSProperties } from 'react'
import {
  PALETTE,
  SHAPES,
  defaultShapes,
  inkForColor,
  type ShapeId,
} from '../domain/palette'
import { CardBadge } from './CardBadge'

export function PaletteSettings({
  colors,
  shapes,
  onColors,
  onShapes,
}: {
  colors: string[]
  shapes: ShapeId[]
  onColors: (colors: string[]) => void
  onShapes: (shapes: ShapeId[]) => void
}) {
  return (
    <details className="ci-palette-settings">
      <summary>Palette de la classe</summary>
      <p>
        Les mêmes lettres, formes et couleurs sur le tableau et les cartes
        imprimées.
      </p>
      <div className="ci-palette-grid">
        {PALETTE.map((card, i) => (
          <div
            className="ci-palette-card"
            key={card.letter}
            style={
              {
                '--card-color': colors[i],
                '--card-ink': inkForColor(colors[i]!),
              } as CSSProperties
            }
          >
            <CardBadge letter={card.letter} shape={shapes[i]!} />
            <label>
              Couleur {card.letter}
              <input
                type="color"
                aria-label={`Couleur de la carte ${card.letter}`}
                value={colors[i]}
                onChange={(e) =>
                  onColors(
                    colors.map((c, index) =>
                      index === i ? e.target.value : c,
                    ),
                  )
                }
              />
            </label>
            <label>
              Forme {card.letter}
              <select
                aria-label={`Forme de la carte ${card.letter}`}
                value={shapes[i]}
                onChange={(e) => {
                  const next = [...shapes]
                  const other = next.indexOf(e.target.value as ShapeId)
                  if (other >= 0) next[other] = shapes[i]!
                  next[i] = e.target.value as ShapeId
                  onShapes(next)
                }}
              >
                {SHAPES.map((shape) => (
                  <option key={shape.id} value={shape.id}>
                    {shape.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          onColors(PALETTE.map((c) => c.color))
          onShapes([...defaultShapes])
        }}
      >
        Rétablir la palette
      </button>
    </details>
  )
}

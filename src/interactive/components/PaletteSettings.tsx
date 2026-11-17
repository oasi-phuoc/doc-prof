import { useState, type CSSProperties } from 'react'
import './palette-settings.css'
import {
  PALETTE,
  SHAPES,
  defaultShapes,
  inkForColor,
  type ShapeId,
} from '../domain/palette'
import { CardBadge, Shape } from './CardBadge'

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
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [activeEditor, setActiveEditor] = useState<'color' | 'shape' | null>(
    null,
  )

  return (
    <div className="ci-palette-settings">
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
            <button
              type="button"
              className="ci-palette-card-preview"
              aria-label={`Modifier la carte ${card.letter}`}
              aria-expanded={activeCard === i}
              aria-controls={
                activeCard === i
                  ? `ci-palette-editors-${card.letter}`
                  : undefined
              }
              onClick={() => {
                setActiveCard(activeCard === i ? null : i)
                setActiveEditor(null)
              }}
            >
              <CardBadge letter={card.letter} shape={shapes[i]!} />
            </button>
            {activeCard === i && (
              <>
                <div
                  className="ci-palette-card-split"
                  id={`ci-palette-editors-${card.letter}`}
                >
                  <button
                    type="button"
                    className="ci-palette-edit-trigger"
                    aria-label={`Changer la couleur de la carte ${card.letter}`}
                    aria-pressed={activeEditor === 'color'}
                    onClick={() =>
                      setActiveEditor(
                        activeEditor === 'color' ? null : 'color',
                      )
                    }
                  >
                    <span>Couleur</span>
                    <span
                      className="ci-palette-color-preview"
                      aria-hidden="true"
                      style={{ backgroundColor: colors[i] }}
                    />
                  </button>
                  <button
                    type="button"
                    className="ci-palette-edit-trigger"
                    aria-label={`Changer la forme de la carte ${card.letter}`}
                    aria-pressed={activeEditor === 'shape'}
                    onClick={() =>
                      setActiveEditor(
                        activeEditor === 'shape' ? null : 'shape',
                      )
                    }
                  >
                    <span>Forme</span>
                    <Shape shape={shapes[i]!} />
                  </button>
                </div>
                {activeEditor === 'color' && (
                  <div
                    className="ci-palette-choices ci-palette-color-choices"
                    role="group"
                    aria-label={`Couleurs de la carte ${card.letter}`}
                  >
                    {PALETTE.map((option) => (
                      <button
                        key={option.letter}
                        type="button"
                        className="ci-palette-color-choice"
                        aria-label={`${option.name} pour la carte ${card.letter}`}
                        aria-pressed={colors[i] === option.color}
                        style={{ backgroundColor: option.color }}
                        onClick={() => {
                          onColors(
                            colors.map((color, index) =>
                              index === i ? option.color : color,
                            ),
                          )
                          setActiveEditor(null)
                        }}
                      />
                    ))}
                    <label className="ci-palette-custom-color">
                      Autre couleur
                      <input
                        type="color"
                        aria-label={`Choisir une autre couleur pour la carte ${card.letter}`}
                        value={colors[i]}
                        onChange={(event) =>
                          onColors(
                            colors.map((color, index) =>
                              index === i ? event.target.value : color,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                )}
                {activeEditor === 'shape' && (
                  <div
                    className="ci-palette-choices ci-palette-shape-choices"
                    role="group"
                    aria-label={`Formes de la carte ${card.letter}`}
                  >
                    {SHAPES.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        className="ci-palette-shape-choice"
                        aria-label={shape.label}
                        aria-pressed={shapes[i] === shape.id}
                        onClick={() => {
                          const next = [...shapes]
                          const other = next.indexOf(shape.id)
                          if (other >= 0) next[other] = shapes[i]!
                          next[i] = shape.id
                          onShapes(next)
                          setActiveEditor(null)
                        }}
                      >
                        <Shape shape={shape.id} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          onColors(PALETTE.map((c) => c.color))
          onShapes([...defaultShapes])
          setActiveCard(null)
          setActiveEditor(null)
        }}
      >
        Rétablir la palette
      </button>
    </div>
  )
}

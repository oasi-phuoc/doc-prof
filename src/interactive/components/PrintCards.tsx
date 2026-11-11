import { useState, type CSSProperties } from 'react'
import {
  PALETTE,
  inkForColor,
  defaultShapes,
  type ShapeId,
} from '../domain/palette'
import { CardBadge } from './CardBadge'

export function PrintCards({
  colors,
  shapes = defaultShapes,
}: {
  colors: string[]
  shapes?: ShapeId[]
}) {
  const [sets, setSets] = useState(1)
  const [inkSaving, setInkSaving] = useState(false)
  const [duplexEdge, setDuplexEdge] = useState<'long' | 'short'>('long')
  // Mirror the positions, not the card artwork, across the printer's flip edge.
  const backOrder = duplexEdge === 'long' ? [1, 0, 3, 2, 5, 4] : [4, 5, 2, 3, 0, 1]
  return (
    <section className="ci-print-tool">
      <div className="ci-no-print">
        <h2>Les cartes de la classe</h2>
        <p>
          Un jeu contient six cartes carrées à découper, deux par ligne sur trois lignes.
          Les deux pages forment le recto et le verso d’une même feuille A4, avec la même
          couleur, lettre et forme des deux côtés.
        </p>
        <div className="ci-toolbar">
          <label>
            Retournement recto verso{' '}
            <select
              aria-label="Retournement recto verso"
              value={duplexEdge}
              onChange={(event) => setDuplexEdge(event.target.value === 'short' ? 'short' : 'long')}
            >
              <option value="long">Bord long</option>
              <option value="short">Bord court</option>
            </select>
          </label>
          <label>
            Jeux de cartes{' '}
            <input
              type="number"
              min="1"
              max="40"
              value={sets}
              onChange={(e) =>
                setSets(Math.max(1, Math.min(40, Number(e.target.value) || 1)))
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={inkSaving}
              onChange={(e) => setInkSaving(e.target.checked)}
            />{' '}
            Économiser l’encre
          </label>
          <button onClick={() => window.print()}>Imprimer les cartes</button>
        </div>
        <p>
          Dans la fenêtre d’impression, choisissez A4, taille réelle (100 %), recto verso
          sur le {duplexEdge === 'long' ? 'bord long' : 'bord court'} et activez les couleurs
          ou les arrière-plans. Désactivez les en-têtes et pieds de page.
        </p>
      </div>
      <div className={`ci-print-pages${inkSaving ? ' ci-ink-saving' : ''}`}>
        {Array.from({ length: sets }, (_, set) => ['front', 'back'].map((side) => (
          <div className="ci-card-sheet" key={`${set}-${side}`} data-set={set + 1} data-side={side}>
            {(side === 'front' ? [0, 1, 2, 3, 4, 5] : backOrder).map((i) => (
              <div
                key={PALETTE[i]!.letter}
                className="ci-paper-card"
                data-card-slot={PALETTE[i]!.letter}
                style={
                  {
                    '--card-color': colors[i],
                    '--card-ink': inkForColor(colors[i]!),
                  } as CSSProperties
                }
              >
                <CardBadge letter={PALETTE[i]!.letter} shape={shapes[i]!} />
              </div>
            ))}
          </div>
        )))}
      </div>
    </section>
  )
}

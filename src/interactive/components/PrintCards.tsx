import { useState, type CSSProperties } from 'react'
import { PALETTE, inkForColor } from '../domain/palette'

export function PrintCards({ colors }: { colors: string[] }) {
  const [sets, setSets] = useState(1)
  const [inkSaving, setInkSaving] = useState(false)
  return (
    <section className="ci-print-tool">
      <div className="ci-no-print">
        <h2>Les cartes de la classe</h2>
        <p>
          Une feuille A4, six cartes à découper par élève. Les lettres et les
          formes restent identiques à l’écran.
        </p>
        <div className="ci-toolbar">
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
      </div>
      <div className={`ci-print-pages${inkSaving ? ' ci-ink-saving' : ''}`}>
        {Array.from({ length: sets }, (_, set) => (
          <div className="ci-card-sheet" key={set}>
            {PALETTE.map((entry, i) => (
              <div
                key={entry.letter}
                className="ci-paper-card"
                style={
                  {
                    '--card-color': colors[i],
                    '--card-ink': inkForColor(colors[i]!),
                  } as CSSProperties
                }
              >
                <span className="ci-paper-symbol" aria-label={entry.shape}>
                  {entry.symbol}
                </span>
                <strong>{entry.letter}</strong>
                <small>CLAIRFLE · carte réponse</small>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

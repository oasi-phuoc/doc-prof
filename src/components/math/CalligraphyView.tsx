import type { CSSProperties } from 'react'
import type { MathItem } from '@/math/types'

/** Bande lignée scolaire (3 ou 5 traits) + texte cursif optionnel. */
function RuledBand({
  ruleLines,
  text,
  sameLine,
}: {
  ruleLines: 3 | 5
  text?: string
  /** Modèle à gauche, espace de copie à droite (même bande). */
  sameLine?: boolean
}) {
  const baselineIndex = ruleLines === 5 ? 3 : 2
  return (
    <div
      className={`calli-band is-${ruleLines}${sameLine ? ' is-same-line' : ''}${text ? ' has-model' : ' is-blank'}`}
      style={{ '--calli-n': ruleLines } as CSSProperties}
    >
      <div className="calli-rules" aria-hidden>
        {Array.from({ length: ruleLines }, (_, i) => (
          <span
            key={i}
            className={`calli-rule${i === baselineIndex ? ' is-base' : ''}${i === 0 ? ' is-top' : ''}`}
          />
        ))}
      </div>
      {text ? (
        <div className="calli-script-row">
          <span className="calli-script">{text}</span>
          {sameLine ? <span className="calli-copy-space" aria-hidden /> : null}
        </div>
      ) : null}
    </div>
  )
}

/** Fiche calligraphie : bandes 5 lignes (même ligne) ou 3 lignes (modèle + vide). */
export function CalligraphyView({ item }: { item: MathItem }) {
  const data = item.calligraphy
  if (!data) return null
  const { mode, ruleLines, entries } = data

  return (
    <div className={`calli-sheet is-${mode}`} aria-label="Lignes d’écriture cursive">
      {entries.map((text, index) =>
        mode === 'copy-below' ? (
          <div className="calli-entry" key={`calli-${index}-${text}`}>
            <RuledBand ruleLines={ruleLines} text={text} />
            <RuledBand ruleLines={ruleLines} />
          </div>
        ) : (
          <RuledBand
            key={`calli-${index}-${text}`}
            ruleLines={ruleLines}
            text={text}
            sameLine
          />
        ),
      )}
    </div>
  )
}

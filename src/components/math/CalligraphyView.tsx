import type { CSSProperties } from 'react'
import type { MathItem } from '@/math/types'

/** Bande lignée scolaire (4 ou 6 traits) + texte cursif lié optionnel. */
function RuledBand({
  ruleLines,
  text,
  sameLine,
}: {
  ruleLines: 4 | 6
  text?: string
  /** Modèle à gauche, espace de copie à droite (même bande). */
  sameLine?: boolean
}) {
  // 6 lignes → texte sur la 4e (index 3) ; 4 lignes → texte sur la 3e (index 2).
  const baselineIndex = ruleLines === 6 ? 3 : 2
  return (
    <div
      className={`calli-band is-${ruleLines}${sameLine ? ' is-same-line' : ''}${text ? ' has-model' : ' is-blank'}`}
      style={
        {
          '--calli-n': ruleLines,
          '--calli-base-i': baselineIndex,
        } as CSSProperties
      }
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

/** Fiche calligraphie : bandes 6 lignes (même ligne) ou 4 lignes (modèle + vide). */
export function CalligraphyView({ item }: { item: MathItem }) {
  const data = item.calligraphy
  if (!data) return null
  const { mode, ruleLines, entries } = data
  const lines = (ruleLines === 6 || ruleLines === 4 ? ruleLines : mode === 'same-line' ? 6 : 4) as
    | 4
    | 6

  return (
    <div className={`calli-sheet is-${mode}`} aria-label="Lignes d’écriture cursive">
      {entries.map((text, index) =>
        mode === 'copy-below' ? (
          <div className="calli-entry" key={`calli-${index}-${text}`}>
            <RuledBand ruleLines={lines} text={text} />
            <RuledBand ruleLines={lines} />
          </div>
        ) : (
          <RuledBand
            key={`calli-${index}-${text}`}
            ruleLines={lines}
            text={text}
            sameLine
          />
        ),
      )}
    </div>
  )
}

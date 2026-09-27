import type { CSSProperties } from 'react'
import type { MathItem } from '@/math/types'
import { calliFontById, calliSizeById } from '@/calligraphie/fonts'

/** Bande lignée (4 ou 6) — baseline en couleur thème ; texte SVG collé sur le trait. */
function RuledBand({
  ruleLines,
  text,
  sameLine,
  fontFamily,
  emPerUnit,
  unitMm,
}: {
  ruleLines: 4 | 6
  text?: string
  sameLine?: boolean
  fontFamily: string
  emPerUnit: number
  unitMm: number
}) {
  // 6 lignes → baseline 4e (index 3) ; 4 lignes → baseline 3e (index 2).
  const baselineIndex = ruleLines === 6 ? 3 : 2
  const gaps = ruleLines - 1
  const heightMm = gaps * unitMm
  const baselineY = baselineIndex * unitMm
  // En 4 lignes (1 carreau sous la baseline), un peu plus petit pour ne pas déborder.
  const sizeFactor = ruleLines === 4 ? 0.82 : 1
  const fontSizeMm = unitMm * emPerUnit * sizeFactor

  return (
    <div
      className={`calli-band is-${ruleLines}${sameLine ? ' is-same-line' : ''}${text ? ' has-model' : ' is-blank'}`}
      style={
        {
          height: `${heightMm}mm`,
          '--calli-n': ruleLines,
          '--calli-base-i': baselineIndex,
        } as CSSProperties
      }
    >
      <div className="calli-margin" aria-hidden />
      <div className="calli-rules" aria-hidden>
        {Array.from({ length: ruleLines }, (_, i) => (
          <span
            key={i}
            className={`calli-rule${i === baselineIndex ? ' is-base' : ''}${i === 0 ? ' is-top' : ''}`}
          />
        ))}
      </div>
      {text ? (
        <svg
          className="calli-text-svg"
          viewBox={`0 0 700 ${heightMm}`}
          width="100%"
          height={`${heightMm}mm`}
          preserveAspectRatio="xMinYMin meet"
          overflow="visible"
          aria-label={text}
        >
          <text
            className="calli-svg-text"
            x={16}
            y={baselineY}
            fontFamily={fontFamily}
            fontSize={fontSizeMm}
          >
            {text}
          </text>
        </svg>
      ) : null}
    </div>
  )
}

/** Fiche calligraphie : bandes 6 / 4 lignes, police et taille configurables. */
export function CalligraphyView({ item }: { item: MathItem }) {
  const data = item.calligraphy
  if (!data) return null
  const { mode, ruleLines, entries, fontId, sizeId } = data
  const lines = (ruleLines === 6 || ruleLines === 4 ? ruleLines : mode === 'same-line' ? 6 : 4) as
    | 4
    | 6
  const font = calliFontById(fontId)
  const size = calliSizeById(sizeId)

  return (
    <div className={`calli-sheet is-${mode}`} aria-label="Lignes d’écriture cursive">
      {entries.map((entry, index) =>
        mode === 'copy-below' ? (
          <div className="calli-entry" key={`calli-${index}-${entry}`}>
            <RuledBand
              ruleLines={lines}
              text={entry}
              fontFamily={font.family}
              emPerUnit={font.emPerUnit}
              unitMm={size.unitMm}
            />
            <RuledBand
              ruleLines={lines}
              fontFamily={font.family}
              emPerUnit={font.emPerUnit}
              unitMm={size.unitMm}
            />
          </div>
        ) : (
          <RuledBand
            key={`calli-${index}-${entry}`}
            ruleLines={lines}
            text={entry}
            sameLine
            fontFamily={font.family}
            emPerUnit={font.emPerUnit}
            unitMm={size.unitMm}
          />
        ),
      )}
    </div>
  )
}

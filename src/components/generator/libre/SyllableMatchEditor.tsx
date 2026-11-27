import { syllableMatchOrder, withSyllablePairs } from '@/francais/soutien/syllable-match'
import { randomSeed } from '@/math/rng'
import type { MathItem } from '@/math/types'

export function SyllableMatchEditor({ item, id, fields, writeField, onChange }: {
  item: MathItem
  id: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
  onChange: (item: MathItem) => void
}) {
  const pairs = item.vocabPairs ?? []
  const columns = item.letterGridCols ?? 1
  return (
    <div className="quad-libre-block" aria-label="Syllabes à relier">
      <b>Syllabes à relier</b>
      {pairs.map((pair, index) => (
        <fieldset key={index} className="libre-grid-fields">
          <legend>Paire {index + 1}</legend>
          {(['left', 'right'] as const).map((side) => {
            const key = `${id}:${index}:${side}`
            return (
              <div key={side}>
                <label className="libre-field is-line">
                  <span>{side === 'left' ? 'Partie gauche' : 'Partie droite'}</span>
                  <input className="libre-line-input" value={fields[key] ?? pair[side]}
                    aria-invalid={fields[key] !== undefined} data-applied-value={pair[side]}
                    onChange={(event) => {
                      const text = event.target.value
                      const part = text.trim()
                      const valid = /^\p{L}[\p{L}\p{M}’'-]*$/u.test(part)
                      writeField(key, valid ? null : text)
                      if (!valid) return
                      const next = pairs.map((entry, position) => position === index ? { ...entry, [side]: part } : entry)
                      onChange(withSyllablePairs(item, next, columns, syllableMatchOrder(item)))
                    }} />
                </label>
                {fields[key] !== undefined && <span className="libre-field-error" role="alert">Saisissez une syllabe.</span>}
              </div>
            )
          })}
        </fieldset>
      ))}
      {pairs.length > columns && (
        <button className="tcf-btn" type="button" onClick={() => onChange(withSyllablePairs(item, pairs, columns, undefined, randomSeed()))}>
          Mélanger les parties de droite
        </button>
      )}
    </div>
  )
}

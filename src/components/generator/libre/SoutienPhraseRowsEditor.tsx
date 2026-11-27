import type { SoutienVowelBank } from '@/francais/soutien/banks'
import { countSoundInPhrase } from '@/francais/soutien/gen-kind-helpers'
import type { MathItem } from '@/math/types'
import { countSoundRows, determinantRows, replaceCountSoundRows, replaceDeterminantRows, withDeterminantParts } from './soutien-phrase-rows'
import { PhraseScrambleEditor } from './PhraseScrambleEditor'

const DETERMINANTS = ['le', 'la', 'l’', 'les']

export function SoutienPhraseRowsEditor({ item, bank, id, fields, writeField, onChange }: {
  item: MathItem
  bank: SoutienVowelBank
  id: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
  onChange: (item: MathItem) => void
}) {
  if (item.layout === 'phrase-scramble') {
    return <PhraseScrambleEditor item={item} id={id} fields={fields} writeField={writeField} onChange={onChange} />
  }
  if (item.layout === 'count-sound') {
    const rows = countSoundRows(item)
    return (
      <fieldset className="quad-libre-block libre-grid-fields">
        <legend>Phrases pour compter les sons</legend>
        {rows.map(({ phrase, count }, index) => {
          const key = `${id}:phrase:${index}`
          return <label className="libre-field is-line" key={key}>
            <span>Phrase {index + 1}</span>
            <textarea className="libre-line-input is-textarea" rows={2} value={fields[key] ?? phrase}
              aria-label={`Phrase ${index + 1}`} aria-invalid={fields[key] !== undefined} data-applied-value={phrase}
              onChange={(event) => {
                const text = event.target.value
                const valid = /\p{L}/u.test(text)
                writeField(key, valid ? null : text)
                if (valid) onChange(replaceCountSoundRows(item, rows.map((row, position) => position === index
                  ? { phrase: text, count: countSoundInPhrase(text, bank) } : row)))
              }} />
            {fields[key] !== undefined && <span className="libre-field-error" role="alert">Saisissez une phrase.</span>}
            <output aria-label={`Occurrences du son pour la phrase ${index + 1}`}>{count}</output>
          </label>
        })}
      </fieldset>
    )
  }

  const rows = determinantRows(item)
  function changeRow(index: number, row: (typeof rows)[number]) {
    onChange(replaceDeterminantRows(item, rows.map((existing, position) => position === index ? row : existing)))
  }
  return (
    <div className="quad-libre-block">
      <b>Phrases à compléter</b>
      {rows.map((row, index) => {
        const key = `${id}:determinants:${index}`
        const blanks = row.parts.flatMap((part, partIndex) => 'blank' in part ? [{ part, partIndex }] : [])
        const text = row.parts.map((part) => 'blank' in part ? '___' : part.t).join('')
        return <fieldset key={key} className="libre-grid-fields">
          <legend>Phrase {index + 1}</legend>
          <label className="libre-field is-line">
            <span>Phrase avec des lacunes (___)</span>
            <textarea className="libre-line-input is-textarea" rows={2} value={fields[key] ?? text}
              aria-label="Phrase avec des lacunes (___)" aria-invalid={fields[key] !== undefined} data-applied-value={text}
              onChange={(event) => {
                const raw = event.target.value
                const segments = raw.split('___')
                const valid = segments.length === blanks.length + 1 && /\p{L}/u.test(segments.join(''))
                writeField(key, valid ? null : raw)
                if (valid) changeRow(index, withDeterminantParts(segments.flatMap((segment, position) =>
                  position < blanks.length ? [{ t: segment }, blanks[position]!.part] : [{ t: segment }])))
              }} />
            {fields[key] !== undefined && <span className="libre-field-error" role="alert">
              Conservez le nombre de lacunes et indiquez le reste de la phrase.
            </span>}
          </label>
          {blanks.map(({ part: { blank }, partIndex }, position) => (
            <label key={partIndex} className="libre-field is-line">
              <span>Déterminant {position + 1}</span>
              <select className="libre-line-input" value={blank} onChange={(event) => {
                changeRow(index, withDeterminantParts(row.parts.map((part, current) =>
                  current === partIndex ? { blank: event.target.value } : part)))
              }}>
                {[...new Set([blank, ...DETERMINANTS])].map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          ))}
          {row.correctionPending && <div className="libre-unit-actions">
            <span>Corrigé à vérifier</span>
            <button type="button" className="button" onClick={() => changeRow(index, { ...row, correctionPending: undefined })}>Corrigé vérifié</button>
          </div>}
        </fieldset>
      })}
    </div>
  )
}

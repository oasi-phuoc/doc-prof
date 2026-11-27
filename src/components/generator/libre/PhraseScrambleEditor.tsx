import { soutienImageFor } from '@/francais/soutien/images'
import { createRng, shuffle } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { ImageField } from '@/tcf/fields'
import { phraseScrambleRows, replacePhraseScrambleRows } from './soutien-phrase-rows'

type PhraseRow = NonNullable<MathItem['phraseScrambles']>[number]

function lettersOf(text: string): string[] {
  return [...text.normalize('NFC').toLocaleUpperCase('fr')].filter((letter) => /\p{L}/u.test(letter))
}

export function PhraseScrambleEditor({ item, id, fields, writeField, onChange }: {
  item: MathItem
  id: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
  onChange: (item: MathItem) => void
}) {
  const rows = phraseScrambleRows(item)
  function update(index: number, patch: Partial<PhraseRow>) {
    const current = rows[index]!
    const next = { ...current, ...patch }
    const sentence = `${next.before}${next.word}${next.after}`.trim()
    const original = current.sentence ?? `${current.before}${current.word}${current.after}`.trim()
    onChange(replacePhraseScrambleRows(item, rows.map((row, position) => position === index
      ? { ...next, sentence, audioSrc: sentence === original ? current.audioSrc : undefined }
      : row)))
  }

  return (
    <div className="quad-libre-block" aria-label="Mots à retrouver dans les phrases">
      <b>Mots à retrouver dans les phrases</b>
      {rows.map((row, index) => {
        const wordField = `${id}:mot:${index}`
        const lettersField = `${id}:lettres:${index}`
        return (
          <fieldset key={index} className="libre-grid-fields">
            <legend>Phrase {index + 1}</legend>
            <label className="libre-field is-line">
              <span>Texte avant le blanc</span>
              <input className="libre-line-input" value={row.before} onChange={(event) => update(index, { before: event.target.value })} />
            </label>
            <label className="libre-field is-line">
              <span>Mot à retrouver</span>
              <input className="libre-line-input" value={fields[wordField] ?? row.word}
                aria-invalid={fields[wordField] !== undefined} data-applied-value={row.word}
                onChange={(event) => {
                  const value = event.target.value
                  const word = value.trim()
                  const letters = lettersOf(word)
                  const valid = /^\p{L}[\p{L}\p{M}’'-]*$/u.test(word) && letters.length >= 2
                  writeField(wordField, valid ? null : value)
                  if (valid && word !== row.word) {
                    writeField(lettersField, null)
                    update(index, { word, letters: shuffle(createRng(index + 1), letters).join(' '), imageSrc: soutienImageFor(word) })
                  }
                }} />
            </label>
            {fields[wordField] !== undefined && <p role="alert" className="libre-field-error">Saisissez un mot d’au moins deux lettres.</p>}
            <label className="libre-field is-line">
              <span>Texte après le blanc</span>
              <input className="libre-line-input" value={row.after} onChange={(event) => update(index, { after: event.target.value })} />
            </label>
            <label className="libre-field is-line">
              <span>Lettres proposées</span>
              <input className="libre-line-input" value={fields[lettersField] ?? row.letters}
                aria-invalid={fields[lettersField] !== undefined} data-applied-value={row.letters}
                onChange={(event) => {
                  const value = event.target.value
                  const letters = lettersOf(value)
                  const valid = [...letters].sort().join('') === lettersOf(row.word).sort().join('')
                  writeField(lettersField, valid ? null : value)
                  if (valid) update(index, { letters: letters.join(' ') })
                }} />
            </label>
            {fields[lettersField] !== undefined && <p role="alert" className="libre-field-error">Reprenez exactement les lettres du mot à retrouver.</p>}
            <ImageField durable label={`Illustration de la phrase ${index + 1}`} value={row.imageSrc ?? ''}
              onChange={(imageSrc) => update(index, { imageSrc })} />
            {row.imageSrc && <button className="tcf-btn" type="button" onClick={() => update(index, { imageSrc: undefined })}>Retirer l’illustration</button>}
          </fieldset>
        )
      })}
    </div>
  )
}

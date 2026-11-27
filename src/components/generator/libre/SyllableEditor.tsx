import { displayVocabLabel } from '@/francais/display-vocab-label'
import { soutienAudioFor } from '@/francais/soutien/audio'
import type { SoutienVowelBank } from '@/francais/soutien/banks'
import { soutienImageFor } from '@/francais/soutien/images'
import { wordHasLessonLetter } from '@/francais/soutien/phoneme'
import { syllabifyFr } from '@/francais/soutien/syllabify-fr'
import { resolveGameImageSrc } from '@/jeux/image-resolve'
import type { MathItem } from '@/math/types'
import { syllableRows, replaceSyllableRows, type SyllableRow } from './syllable-rows'

const letters = (text: string) => text.normalize('NFC').toLocaleLowerCase('fr').replace(/[^\p{L}]/gu, '')

export function SyllableEditor({ item, bank, activityId, fields, writeField, onChange }: {
  item: MathItem
  bank: SoutienVowelBank
  activityId: string
  fields: Record<string, string>
  writeField: (id: string, text: string | null) => void
  onChange: (item: MathItem) => void
}) {
  const rows = syllableRows(item)
  const sound = item.layout === 'syllable-sound'
  function update(index: number, row: SyllableRow) {
    const hits = sound ? row.parts.flatMap((part, i) => wordHasLessonLetter(part, bank) ? [i] : []) : undefined
    const next = { ...row, hitIndex: hits?.[0] ?? -1, hitIndices: hits }
    onChange(replaceSyllableRows(item, rows.map((current, i) => i === index ? next : current)))
  }
  function changeWord(index: number, value: string) {
    const key = `${activityId}:${index}:mot`
    const raw = value.trim()
    const word = displayVocabLabel(raw)
    const parts = syllabifyFr(word)
    const audioSrc = soutienAudioFor(raw) ?? soutienAudioFor(word)
    const imageSrc = sound && !item.syllableSoundQrOnly
      ? resolveGameImageSrc(raw) || soutienImageFor(raw) || soutienImageFor(word)
      : undefined
    if (parts.length < 2 || (sound && (item.syllableSoundQrOnly ? !audioSrc : !imageSrc))) {
      writeField(key, value)
      return
    }
    writeField(key, null)
    writeField(`${activityId}:${index}:syllabes`, null)
    update(index, { word, parts, audioSrc, imageSrc })
  }
  return (
    <div className="quad-libre-block">
      <b>Mots et syllabes</b>
      {rows.map((row, index) => {
        const wordField = `${activityId}:${index}:mot`
        const partsField = `${activityId}:${index}:syllabes`
        return (
          <fieldset key={index} className="libre-grid-fields">
            <legend>Mot {index + 1}</legend>
            <label className="libre-field is-line">
              <span>Mot</span>
              <input className="libre-line-input" type="text" value={fields[wordField] ?? row.word}
                aria-label={`Mot ${index + 1}`} aria-invalid={fields[wordField] !== undefined} data-applied-value={row.word}
                onChange={(event) => changeWord(index, event.target.value)} />
            </label>
            {fields[wordField] !== undefined && (<p className="libre-field-error" role="alert">
              {item.syllableSoundQrOnly ? 'Choisissez un mot de plusieurs syllabes avec un audio de la banque.'
                : sound ? 'Choisissez un mot de plusieurs syllabes avec une illustration de la banque.' : 'Choisissez un mot de plusieurs syllabes.'}
            </p>)}
            <label className="libre-field is-line">
              <span>Syllabes séparées par un tiret</span>
              <input className="libre-line-input" type="text" value={fields[partsField] ?? row.parts.join('-')}
                aria-label={`Syllabes du mot ${index + 1}`} aria-invalid={fields[partsField] !== undefined} data-applied-value={row.parts.join('-')}
                onChange={(event) => {
                  const text = event.target.value
                  const parts = text.split('-').map((part) => part.trim())
                  if (parts.length < 2 || parts.some((part) => !letters(part)) || letters(parts.join('')) !== letters(row.word)) {
                    writeField(partsField, text)
                  } else {
                    writeField(partsField, null)
                    update(index, { ...row, parts })
                  }
                }} />
            </label>
            {fields[partsField] !== undefined && <p className="libre-field-error" role="alert">Le découpage doit reprendre toutes les lettres du mot.</p>}
            {row.audioSrc && <audio controls preload="none" src={row.audioSrc} aria-label={`Audio du mot ${index + 1}`} />}
            {sound && row.hitIndices?.length ? <p role="status">{row.hitIndices.map((hit) => row.parts[hit]).join(' · ')}</p> : null}
          </fieldset>
        )
      })}
    </div>
  )
}

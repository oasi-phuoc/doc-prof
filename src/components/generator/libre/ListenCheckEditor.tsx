import { useMemo } from 'react'
import { displayVocabLabel } from '@/francais/display-vocab-label'
import { soutienAudioFor } from '@/francais/soutien/audio'
import type { SoutienVowelBank } from '@/francais/soutien/banks'
import { soutienImageFor } from '@/francais/soutien/images'
import { lessonWordsBySound } from '@/francais/soutien/phoneme'
import { resolveGameImageSrc } from '@/jeux/image-resolve'
import type { MathItem } from '@/math/types'
import { ImageField } from '@/tcf/fields'
import { listenRows, listenWordKey, replaceListenRows, type ListenRow } from './listen-rows'

export function ListenCheckEditor({ item, bank, id, fields, writeField, onChange }: {
  item: MathItem
  bank: SoutienVowelBank
  id: string
  fields: Record<string, string>
  writeField: (id: string, text: string | null) => void
  onChange: (item: MathItem) => void
}) {
  const rows = listenRows(item)
  const illustrated = Boolean(item.optionImages?.length)
  const matchingWords = useMemo(() => new Set(lessonWordsBySound(bank).map((word) =>
    listenWordKey(displayVocabLabel(word)))), [bank])

  function apply(index: number, row: ListenRow) {
    onChange(replaceListenRows(item, rows.map((current, position) => position === index ? row : current)))
  }

  function changeWord(index: number, value: string) {
    const field = `${id}:mot:${index}`
    const word = displayVocabLabel(value)
    const key = listenWordKey(word)
    if (key === listenWordKey(rows[index]!.word)) {
      writeField(field, null)
      return
    }
    const audioSrc = soutienAudioFor(value) ?? soutienAudioFor(word) ?? ''
    const imageSrc = illustrated ? resolveGameImageSrc(value) || soutienImageFor(value) || soutienImageFor(word) || '' : ''
    if (!key || (illustrated ? !imageSrc : !audioSrc) || rows.some((row, position) =>
      position !== index && (listenWordKey(row.word) === key || (audioSrc && row.audioSrc === audioSrc)))) {
      writeField(field, value)
      return
    }
    writeField(field, null)
    apply(index, { word, audioSrc, imageSrc, hit: matchingWords.has(key) })
  }

  return (
    <div className="quad-libre-block" aria-label="Mots à écouter">
      <b>Mots à écouter</b>
      {rows.map((row, index) => {
        const field = `${id}:mot:${index}`
        return (
          <fieldset key={index} className="libre-grid-fields">
            <legend>Mot {index + 1}</legend>
            <label className="libre-field is-line">
              <span>Mot</span>
              <input type="text" className="libre-line-input" aria-label={`Mot ${index + 1}`}
                value={fields[field] ?? row.word} aria-invalid={fields[field] !== undefined}
                data-applied-value={row.word} onChange={(event) => changeWord(index, event.target.value)} />
            </label>
            {fields[field] !== undefined && <p className="libre-field-error" role="alert">
              {illustrated ? 'Choisissez un autre mot illustré de la banque.' : 'Choisissez un autre mot enregistré dans la banque.'}
            </p>}
            <label>
              <input type="checkbox" checked={row.hit}
                onChange={(event) => apply(index, { ...row, hit: event.target.checked })} />
              Le son {bank.sound} est présent
            </label>
            {row.audioSrc && <audio controls preload="none" src={row.audioSrc} aria-label={`Audio du mot ${index + 1}`} />}
            {illustrated && <ImageField durable label={`Illustration du mot ${index + 1}`}
              value={row.imageSrc} onChange={(imageSrc) => apply(index, { ...row, imageSrc })} />}
          </fieldset>
        )
      })}
    </div>
  )
}

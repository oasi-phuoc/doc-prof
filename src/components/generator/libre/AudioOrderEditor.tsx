import { useMemo } from 'react'
import type { SoutienVowelBank } from '@/francais/soutien/banks'
import { audioOrderChoices, audioOrderLetterKey, withAudioOrder, type AudioOrder, type AudioOrderKind } from '@/francais/soutien/audio-order'
import type { MathItem } from '@/math/types'

function exchange<T>(list: T[], index: number, target: number): T[] {
  return list.map((value, position) => position === index ? list[target]! : position === target ? list[index]! : value)
}

export function AudioOrderEditor({ items, bank, kind, preferred, excluded, onChange }: {
  items: MathItem[]
  bank: SoutienVowelBank
  kind: AudioOrderKind
  preferred?: readonly string[]
  excluded?: readonly string[]
  onChange: (items: MathItem[]) => void
}) {
  const choices = useMemo(() => audioOrderChoices(bank, kind, { type1Words: preferred, excludeWords: excluded }), [bank, kind, preferred, excluded])
  const used = new Set(items.flatMap(({ audioOrder }) => audioOrder?.clips.map(({ word }) => audioOrderLetterKey(word)) ?? []))
  const available = choices.filter(({ word }) => !used.has(audioOrderLetterKey(word)))
  return (
    <div className="quad-libre-block">
      <b>Associations audio</b>
      {items.map((item, index) => {
        const order = item.audioOrder
        if (!order) return null
        const initialOrder = order
        const apply = (next: AudioOrder) => onChange(items.map((current, position) => position === index ? withAudioOrder(item, next) : current))
        function moveClip(position: number, target: number) {
          const clipNumber = position + 1
          const targetNumber = target + 1
          apply({
            ...initialOrder, clips: exchange(initialOrder.clips, position, target),
            slots: initialOrder.slots.map((slot) => ({
              ...slot, correctNum: slot.correctNum === clipNumber ? targetNumber : slot.correctNum === targetNumber ? clipNumber : slot.correctNum,
            })),
          })
        }
        return (
          <fieldset key={item.libreId ?? index} className="libre-grid-fields">
            <legend>Série {index + 1}</legend>
            {order.clips.map((clip, position) => {
              const label = `Mot de la piste ${position + 1}`
              return <div key={position} className="libre-grid-fields">
                <label className="libre-field is-line">
                  <span>{label}</span>
                  <select className="libre-line-input" value="" disabled={!available.length}
                    onChange={(event) => {
                      const choice = available.find(({ word }) => audioOrderLetterKey(word) === event.target.value)
                      if (!choice) return
                      apply({
                        ...order, clips: order.clips.map((current, slot) => slot === position ? { word: choice.word, audioSrc: choice.audioSrc } : current),
                        slots: order.slots.map((slot) => slot.correctNum === position + 1
                          ? { ...slot, word: order.mode === 'words' ? choice.word : undefined,
                            imageSrc: order.mode === 'images' ? choice.imageSrc : undefined } : slot),
                      })
                    }}>
                    <option value="">{clip.word}</option>
                    {available.map(({ word }) => <option key={audioOrderLetterKey(word)} value={audioOrderLetterKey(word)}>{word}</option>)}
                  </select>
                </label>
                {clip.audioSrc && <audio controls preload="none" src={clip.audioSrc} aria-label={`Écouter la piste ${position + 1}`} />}
                <div className="libre-unit-actions">
                  <button type="button" className="button secondary small" disabled={position === 0}
                    onClick={() => moveClip(position, position - 1)} aria-label={`Avancer la piste ${position + 1}`}>Avancer</button>
                  <button type="button" className="button secondary small" disabled={position === order.clips.length - 1}
                    onClick={() => moveClip(position, position + 1)} aria-label={`Reculer la piste ${position + 1}`}>Reculer</button>
                </div>
              </div>
            })}
            <ol className="libre-item-list" aria-label="Ordre des options">
              {order.slots.map((slot, position) => (
                <li key={slot.correctNum} className="libre-unit-actions">
                  <span>{position + 1}. {slot.word ?? order.clips[slot.correctNum - 1]?.word}</span>
                  {slot.imageSrc && <img src={slot.imageSrc} alt="" width={44} height={44} />}
                  <button type="button" className="button secondary small" disabled={position === 0} aria-label={`Avancer l’option ${position + 1}`}
                    onClick={() => apply({ ...order, slots: exchange(order.slots, position, position - 1) })}>Avancer</button>
                  <button type="button" className="button secondary small" disabled={position === order.slots.length - 1}
                    aria-label={`Reculer l’option ${position + 1}`}
                    onClick={() => apply({ ...order, slots: exchange(order.slots, position, position + 1) })}>Reculer</button>
                </li>
              ))}
            </ol>
          </fieldset>
        )
      })}
    </div>
  )
}

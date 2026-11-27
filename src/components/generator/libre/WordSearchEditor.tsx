import { useState } from 'react'
import {
  buildEditedWordSearch,
  DEFAULT_WORD_SEARCH_DIRECTIONS,
  findWordSearchPositions,
  WORD_SEARCH_DIRECTIONS,
  WORD_SEARCH_WORD_COUNT,
  wordSearchHitCells,
  type WordSearchDirection,
  type WordSearchPlacement,
} from '@/francais/soutien/word-search'
import { createRng, randomSeed } from '@/math/rng'
import type { MathItem } from '@/math/types'
import { SelectBox } from '../SelectBox'

const labels: Record<WordSearchDirection, string> = {
  droite: 'Vers la droite', gauche: 'Vers la gauche', bas: 'Vers le bas', haut: 'Vers le haut',
}

type Fields = {
  id: string
  fields: Record<string, string>
  writeField: (key: string, value: string | null) => void
}

function PositionFields({ position, id, fields, writeField, size, directions, apply }: Fields & {
  position: WordSearchPlacement
  size: number
  directions: WordSearchDirection[]
  apply: (position: WordSearchPlacement) => boolean
}) {
  const current = directions.find((direction) => {
    const [dRow, dCol] = WORD_SEARCH_DIRECTIONS[direction]
    return position.dRow === dRow && position.dCol === dCol
  }) ?? directions[0]!
  const draft = {
    row: fields[`${id}:row`] ?? String(position.row + 1),
    col: fields[`${id}:col`] ?? String(position.col + 1),
    direction: (fields[`${id}:direction`] ?? current) as WordSearchDirection,
  }
  const invalid = ['row', 'col', 'direction'].some((field) => fields[`${id}:${field}`] !== undefined)

  function change(field: keyof typeof draft, value: string) {
    const next = { ...draft, [field]: value }
    const [dRow, dCol] = WORD_SEARCH_DIRECTIONS[next.direction] ?? WORD_SEARCH_DIRECTIONS[current]
    if (apply({ ...position, row: Number(next.row) - 1, col: Number(next.col) - 1, dRow, dCol })) {
      for (const key of ['row', 'col', 'direction']) writeField(`${id}:${key}`, null)
    } else {
      writeField(`${id}:${field}`, value)
    }
  }

  return (
    <fieldset className="libre-grid-fields">
      <legend>{position.word}</legend>
      {(['row', 'col'] as const).map((field) => (
        <label key={field} className="libre-field is-line">
          <span>{field === 'row' ? 'Ligne' : 'Colonne'}</span>
          <input className="libre-line-input" type="number" min={1} max={size} value={draft[field]}
            aria-invalid={fields[`${id}:${field}`] !== undefined} onChange={(event) => change(field, event.target.value)} />
        </label>
      ))}
      {directions.length > 1 && (
        <SelectBox label="Sens du mot" value={draft.direction} onChange={(value) => change('direction', value)}>
          {directions.map((direction) => <option key={direction} value={direction}>{labels[direction]}</option>)}
        </SelectBox>
      )}
      {invalid && <p className="libre-field-error" role="alert">Le mot doit tenir dans la grille sans croiser une lettre différente.</p>}
    </fieldset>
  )
}

export function WordSearchEditor({ item, id, fields, writeField, onChange }: Fields & {
  item: MathItem & { wordSearch: NonNullable<MathItem['wordSearch']> }
  onChange: (item: MathItem) => void
}) {
  const data = item.wordSearch
  const directions = data.directions ?? DEFAULT_WORD_SEARCH_DIRECTIONS
  const positions = data.placements ?? findWordSearchPositions(data.words, data.grid, data.hitCells ?? [])
  const appliedText = data.words.join('\n')
  const [input, setInput] = useState<{ original: string; text: string }>()
  const listField = `${id}:liste`
  const directionField = `${id}:directions`

  function apply(words: string[], senses: WordSearchDirection[], placements?: WordSearchPlacement[], seed = 810) {
    const puzzle = buildEditedWordSearch(createRng(seed), words, data.size, senses, placements)
    if (!puzzle) return false
    onChange({
      ...item,
      wordSearch: { ...puzzle, directions: senses, hitCells: [...wordSearchHitCells(puzzle.placements)] },
      answer: words.join(' · '),
    })
    return true
  }

  function clearPositionFields() {
    for (const field of Object.keys(fields)) {
      if (field.startsWith(`${id}:position:`)) writeField(field, null)
    }
  }

  return (
    <div className="quad-libre-block" aria-label="Grille de mots mêlés">
      <label className="libre-field is-line">
        <span>Mots à placer, un par ligne</span>
        <textarea className="libre-line-input is-textarea" rows={6}
          value={fields[listField] ?? (input?.original === appliedText ? input.text : appliedText)}
          aria-invalid={fields[listField] !== undefined} onBlur={() => setInput(undefined)}
          onChange={(event) => {
            const text = event.target.value
            const words = text.split('\n').map((word) => word.trim()).filter(Boolean)
            const joined = words.join('\n')
            const valid = words.every((word) => /^[\p{L}\p{M} ’'-]+$/u.test(word)) &&
              (joined === appliedText || apply(words, directions))
            writeField(listField, valid ? null : text)
            if (valid) {
              setInput({ original: joined, text })
              if (joined !== appliedText) clearPositionFields()
            }
          }} />
      </label>
      {fields[listField] !== undefined && <p className="libre-field-error" role="alert">
        Saisissez de 1 à {WORD_SEARCH_WORD_COUNT} mots distincts de 3 à {data.size} lettres.
      </p>}
      <fieldset className="libre-grid-fields">
        <legend>Sens autorisés</legend>
        {DEFAULT_WORD_SEARCH_DIRECTIONS.map((direction) => (
          <label key={direction}>
            <input type="checkbox" checked={directions.includes(direction)}
              disabled={directions.length === 1 && directions[0] === direction}
              onChange={(event) => {
                const next = event.target.checked ? [...directions, direction] : directions.filter((value) => value !== direction)
                if (apply(data.words, next)) {
                  writeField(directionField, null)
                  clearPositionFields()
                } else {
                  writeField(directionField, direction)
                }
              }} />
            {labels[direction]}
          </label>
        ))}
      </fieldset>
      {fields[directionField] !== undefined && <p className="libre-field-error" role="alert">Les mots ne tiennent pas dans la grille avec ces sens.</p>}
      <button type="button" className="tcf-btn" onClick={() => {
        if (apply(data.words, directions, undefined, randomSeed())) clearPositionFields()
        else writeField(listField, appliedText)
      }}>Recomposer la grille</button>
      {positions.length === data.words.length && (
        <details className="libre-theory-block">
          <summary>Position des mots</summary>
          {positions.map((position, index) => (
            <PositionFields key={index} position={position} id={`${id}:position:${index}`}
              fields={fields} writeField={writeField} size={data.size} directions={directions}
              apply={(next) => apply(data.words, directions, positions.map((value, row) => row === index ? next : value))} />
          ))}
        </details>
      )}
    </div>
  )
}

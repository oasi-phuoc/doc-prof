import { useId, useRef, useState } from 'react'
import { readGameImageFile, GAME_IMAGE_ACCEPT } from './image'
import { entriesToText, resolveEntries, textToEntries } from './parse'
import type { GameTemplate } from './templates'
import type { GameEntry } from './types'

function templateHasImages(template: GameTemplate): boolean {
  return template.fields.some((field) => field.type === 'image')
}

export function GameContentPanel({
  typeId,
  template,
  entries,
  text,
  onChange,
}: {
  typeId: string
  template: GameTemplate
  entries: GameEntry[] | undefined
  text: string
  onChange: (next: { gameText: string; gameEntries: GameEntry[] }) => void
}) {
  const baseId = useId()
  const fileRefs = useRef<Array<HTMLInputElement | null>>([])
  const [error, setError] = useState<string | null>(null)
  const withImages = templateHasImages(template)
  const resolved = resolveEntries(typeId, entries)
  const slots = withImages
    ? Array.from({ length: template.entryCount }, (_, i) => resolved[i] ?? { text: '' })
    : resolved

  function commit(nextEntries: GameEntry[]) {
    setError(null)
    onChange({
      gameEntries: nextEntries,
      gameText: entriesToText(typeId, nextEntries),
    })
  }

  function updateSlot(index: number, patch: Partial<GameEntry>) {
    const next = slots.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    commit(next)
  }

  async function onPickImage(index: number, file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      updateSlot(index, { imageSrc: dataUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  if (!withImages) {
    return (
      <label className="select-shell game-content-field">
        <span>Contenu</span>
        <textarea
          className="pill-input game-content-textarea"
          rows={Math.min(12, Math.max(4, template.entryCount + 1))}
          value={text}
          spellCheck
          aria-label="Contenu du jeu"
          placeholder={template.entryHint}
          onChange={(event) => {
            const nextText = event.target.value
            onChange({
              gameText: nextText,
              gameEntries: textToEntries(typeId, nextText, entries),
            })
          }}
        />
        <small className="muted">{template.entryHint}</small>
      </label>
    )
  }

  return (
    <div className="game-content-field">
      <span className="game-content-label">Contenu</span>
      <p className="muted game-content-hint">{template.entryHint}</p>
      <ul className="game-entry-list" aria-label="Cartes du jeu">
        {slots.map((entry, index) => {
          const inputId = `${baseId}-img-${index}`
          return (
            <li className="game-entry-row" key={`${typeId}-${index}`}>
              <button
                type="button"
                className={`game-entry-thumb${entry.imageSrc ? ' has-image' : ''}`}
                aria-label={
                  entry.imageSrc
                    ? `Changer l’image de la carte ${index + 1}`
                    : `Ajouter une image à la carte ${index + 1}`
                }
                onClick={() => fileRefs.current[index]?.click()}
              >
                {entry.imageSrc ? (
                  <img src={entry.imageSrc} alt="" />
                ) : (
                  <span aria-hidden>+</span>
                )}
              </button>
              <input
                ref={(el) => {
                  fileRefs.current[index] = el
                }}
                id={inputId}
                className="visually-hidden"
                type="file"
                accept={GAME_IMAGE_ACCEPT}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  void onPickImage(index, file)
                  event.target.value = ''
                }}
              />
              <input
                className="pill-input game-entry-text"
                type="text"
                maxLength={template.maxTextLen}
                value={entry.text}
                aria-label={`Mot carte ${index + 1}`}
                placeholder={`Mot ${index + 1}`}
                onChange={(event) => updateSlot(index, { text: event.target.value })}
              />
              {entry.imageSrc ? (
                <button
                  type="button"
                  className="game-entry-clear"
                  aria-label={`Retirer l’image de la carte ${index + 1}`}
                  title="Retirer l’image"
                  onClick={() => updateSlot(index, { imageSrc: undefined })}
                >
                  ×
                </button>
              ) : (
                <span className="game-entry-clear is-spacer" aria-hidden />
              )}
            </li>
          )
        })}
      </ul>
      {error ? (
        <p className="questions-overflow-hint" role="alert">
          {error}
        </p>
      ) : (
        <small className="muted">JPG, PNG, WebP ou SVG · max. 2,5 Mo · cadrage automatique</small>
      )}
    </div>
  )
}

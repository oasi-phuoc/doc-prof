import { useId, useRef, useState } from 'react'
import { GAME_IMAGE_ACCEPT, readGameImageFile } from '@/jeux/image'
import { soutienEntriesWithImages, soutienImageFor } from './images'

export type SoutienMotEntry = {
  id: string
  label: string
  imageSrc?: string
}

export const SOUTIEN_MOTS_MAX = 16

/** Préremplit le mode libre avec les mots de la banque (images résolues). */
export function defaultSoutienMotsEntries(words: readonly string[]): SoutienMotEntry[] {
  return soutienEntriesWithImages(words.slice(0, SOUTIEN_MOTS_MAX)).map((entry, index) => ({
    id: entry.id || `soutien-libre-${index}`,
    label: entry.label,
    imageSrc: entry.imageSrc,
  }))
}

function newEntryId(label: string): string {
  const slug = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `soutien-${slug || 'mot'}-${Date.now().toString(36)}`
}

/** Liste éditable mot + image pour Soutien FR type 1 (mode Libre). */
export function SoutienMotsLibreEditor({
  entries,
  onChange,
  max = SOUTIEN_MOTS_MAX,
}: {
  entries: SoutienMotEntry[]
  onChange: (next: SoutienMotEntry[]) => void
  max?: number
}) {
  const baseId = useId()
  const fileRefs = useRef<Array<HTMLInputElement | null>>([])
  const [error, setError] = useState<string | null>(null)
  const [draftLabel, setDraftLabel] = useState('')
  const [draftImage, setDraftImage] = useState<string | undefined>()
  const draftFileRef = useRef<HTMLInputElement | null>(null)

  async function pickImage(file: File | undefined, apply: (src: string) => void) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      apply(dataUrl)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  function updateAt(index: number, patch: Partial<SoutienMotEntry>) {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry))
    onChange(next)
  }

  function removeAt(index: number) {
    if (entries.length <= 1) return
    onChange(entries.filter((_, i) => i !== index))
  }

  function addDraft() {
    const label = draftLabel.trim()
    if (!label || entries.length >= max) return
    onChange([
      ...entries,
      {
        id: newEntryId(label),
        label,
        imageSrc: draftImage || soutienImageFor(label),
      },
    ])
    setDraftLabel('')
    setDraftImage(undefined)
    setError(null)
  }

  return (
    <div className="quad-libre-block soutien-mots-libre">
      <b>Mots ({entries.length}/{max})</b>
      <ul className="game-entry-list" aria-label="Mots et images du type 1">
        {entries.map((entry, index) => {
          const inputId = `${baseId}-img-${index}`
          return (
            <li className="game-entry-row" key={entry.id}>
              <button
                type="button"
                className={`game-entry-thumb${entry.imageSrc ? ' has-image' : ''}`}
                aria-label={
                  entry.imageSrc
                    ? `Changer l’image du mot ${index + 1}`
                    : `Ajouter une image au mot ${index + 1}`
                }
                onClick={() => fileRefs.current[index]?.click()}
              >
                {entry.imageSrc ? <img src={entry.imageSrc} alt="" /> : <span aria-hidden>+</span>}
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
                  void pickImage(event.target.files?.[0], (src) =>
                    updateAt(index, { imageSrc: src }),
                  )
                  event.target.value = ''
                }}
              />
              <input
                className="pill-input game-entry-text"
                type="text"
                value={entry.label}
                maxLength={40}
                aria-label={`Mot ${index + 1}`}
                placeholder={`Mot ${index + 1}`}
                onChange={(event) => {
                  const label = event.target.value
                  updateAt(index, {
                    label,
                    // Si pas d’image perso (data URL), retenter la banque sur le nouveau libellé.
                    imageSrc:
                      entry.imageSrc?.startsWith('data:')
                        ? entry.imageSrc
                        : soutienImageFor(label) ?? entry.imageSrc,
                  })
                }}
              />
              <button
                type="button"
                className="game-entry-clear"
                aria-label={`Retirer le mot ${index + 1}`}
                title="Retirer"
                disabled={entries.length <= 1}
                onClick={() => removeAt(index)}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>
      {entries.length < max ? (
        <div className="vocab-add-row">
          <button
            type="button"
            className={`vocab-add-thumb${draftImage ? ' has-image' : ''}`}
            aria-label="Image du nouveau mot"
            onClick={() => draftFileRef.current?.click()}
          >
            {draftImage ? <img src={draftImage} alt="" /> : <span aria-hidden>+</span>}
          </button>
          <input
            ref={draftFileRef}
            className="visually-hidden"
            type="file"
            accept={GAME_IMAGE_ACCEPT}
            onChange={(event) => {
              void pickImage(event.target.files?.[0], setDraftImage)
              event.target.value = ''
            }}
          />
          <input
            className="pill-input"
            type="text"
            value={draftLabel}
            maxLength={40}
            placeholder="Nouveau mot"
            aria-label="Nouveau mot"
            onChange={(event) => setDraftLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              addDraft()
            }}
          />
          <button
            type="button"
            className="vocab-add-btn"
            aria-label="Ajouter le mot"
            title="Ajouter"
            disabled={!draftLabel.trim()}
            onClick={addDraft}
          >
            +
          </button>
        </div>
      ) : (
        <small className="muted">Maximum {max} mots (grille 4×4).</small>
      )}
      {error ? (
        <p className="questions-overflow-hint" role="alert">
          {error}
        </p>
      ) : (
        <small className="muted">Libre : modifiez le mot ou l’image (+), ou ajoutez une ligne.</small>
      )}
    </div>
  )
}

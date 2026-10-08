import { useRef, useState } from 'react'
import {
  makeCustomVocabWord,
  type VocabWordEntry,
} from '@/francais/vocab-learn'
import { readGameImageFile, GAME_IMAGE_ACCEPT } from '@/jeux/image'

export function VocabAddWordRow({
  onAdd,
  withImage = true,
  placeholder = 'Nouveau mot',
}: {
  onAdd: (entry: VocabWordEntry) => void
  withImage?: boolean
  placeholder?: string
}) {
  const [label, setLabel] = useState('')
  const [imageSrc, setImageSrc] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPick(file: File | undefined) {
    if (!file) return
    try {
      const dataUrl = await readGameImageFile(file)
      setImageSrc(dataUrl)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image refusée.')
    }
  }

  return (
    <div className={`vocab-add-row${withImage ? '' : ' is-text-only'}`}>
      {withImage ? (
        <>
          <button
            type="button"
            className={`vocab-add-thumb${imageSrc ? ' has-image' : ''}`}
            aria-label="Image du nouveau mot"
            onClick={() => fileRef.current?.click()}
          >
            {imageSrc ? <img src={imageSrc} alt="" /> : <span aria-hidden>+</span>}
          </button>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept={GAME_IMAGE_ACCEPT}
            onChange={(event) => {
              void onPick(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </>
      ) : null}
      <input
        className="pill-input"
        type="text"
        value={label}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setLabel(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return
          event.preventDefault()
          const word = label.trim()
          if (!word) return
          onAdd(makeCustomVocabWord(word, withImage ? imageSrc : undefined))
          setLabel('')
          setImageSrc(undefined)
          setError(null)
        }}
      />
      <button
        type="button"
        className="vocab-add-btn"
        aria-label="Ajouter"
        title="Ajouter"
        disabled={!label.trim()}
        onClick={() => {
          const word = label.trim()
          if (!word) return
          onAdd(makeCustomVocabWord(word, withImage ? imageSrc : undefined))
          setLabel('')
          setImageSrc(undefined)
          setError(null)
        }}
      >
        +
      </button>
      {error ? (
        <p className="questions-overflow-hint" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

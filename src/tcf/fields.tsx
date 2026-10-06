import { useRef, useState } from 'react'
import { GAME_IMAGE_ACCEPT, readGameImageFile } from '@/jeux/image'
import { tcfAudioSrc, tcfImageSrc } from './media'

/** Champ texte (une ligne ou zone multiligne). */
export function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  placeholder?: string
  rows?: number
}) {
  return (
    <label className="tcf-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          className="pill-input tcf-textarea"
          value={value}
          rows={rows}
          placeholder={placeholder}
          spellCheck
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="pill-input"
          type="text"
          value={value}
          placeholder={placeholder}
          spellCheck
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

/** Liste « une entrée par ligne » (mots, variantes, options). */
export function LinesField({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}) {
  return (
    <TextField
      label={label}
      value={values.join('\n')}
      multiline
      rows={Math.max(2, Math.min(6, values.length + 1))}
      placeholder={placeholder}
      onChange={(text) => onChange(text.split('\n'))}
    />
  )
}

export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
}: {
  label: string
  value: number | undefined
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  return (
    <label className="tcf-field is-number">
      <span>{label}</span>
      <input
        className="pill-input"
        type="number"
        min={min}
        max={max}
        value={value ?? 0}
        onChange={(event) => {
          const n = Number(event.target.value)
          if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, Math.round(n))))
        }}
      />
    </label>
  )
}

/**
 * Image : import d’un fichier (data URL, stockée dans la fiche) ou nom de fichier
 * rangé dans `public/lib/tcf/images/` (à privilégier pour les banques JSON).
 */
export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const src = tcfImageSrc(value)
  return (
    <div className="tcf-field tcf-image-field">
      <span>{label}</span>
      <div className="tcf-image-row">
        <button
          type="button"
          className={`game-entry-thumb${src ? ' has-image' : ''}`}
          aria-label={src ? `Changer : ${label}` : `Importer : ${label}`}
          onClick={() => fileRef.current?.click()}
        >
          {src ? <img src={src} alt="" /> : <span aria-hidden>+</span>}
        </button>
        <input
          ref={fileRef}
          className="visually-hidden"
          type="file"
          accept={GAME_IMAGE_ACCEPT}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) return
            readGameImageFile(file)
              .then((dataUrl) => {
                onChange(dataUrl)
                setError(null)
              })
              .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Image refusée.'))
          }}
        />
        <input
          className="pill-input"
          type="text"
          value={value.startsWith('data:') ? '' : value}
          placeholder={value.startsWith('data:') ? 'Image importée' : 'pomme.webp ou /lib/…'}
          aria-label={`Fichier : ${label}`}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      {error ? <small className="questions-overflow-hint">{error}</small> : null}
    </div>
  )
}

/** Audio : nom du MP3 dans `public/lib/tcf/audio/` (ou chemin / URL), écoute à l’écran. */
export function AudioField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const src = tcfAudioSrc(value)
  return (
    <div className="tcf-field">
      <span>{label}</span>
      <input
        className="pill-input"
        type="text"
        value={value}
        placeholder="a0a1-co-001.mp3 ou /lib/…"
        onChange={(event) => onChange(event.target.value)}
      />
      {src ? <audio className="tcf-audio-player" controls preload="none" src={src} /> : null}
    </div>
  )
}

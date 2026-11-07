import { createContext, useContext, useState, type ImgHTMLAttributes, type ReactNode } from 'react'
import { VocabImagePicker } from '@/tcf/VocabImagePicker'
import { readGameImageFile } from '@/jeux/image'

type ImageEditor = {
  enabled: boolean
  replacements: Record<string, string>
  edit: (src: string, label: string) => void
}
const ImageContext = createContext<ImageEditor>({ enabled: false, replacements: {}, edit: () => {} })

/** Les choix de banque sont sauvegardables ; les fichiers locaux restent en mémoire. */
export function WorksheetImageProvider({ enabled, overrides, onChange, children }: {
  enabled: boolean
  overrides: Record<string, string>
  onChange: (next: Record<string, string>) => void
  children: ReactNode
}) {
  const [temporary, setTemporary] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<{ src: string; label: string } | null>(null)
  const [error, setError] = useState('')
  const close = () => { setSelected(null); setError('') }
  const withoutTemporary = (src: string) => setTemporary((current) => {
    const next = { ...current }; delete next[src]; return next
  })
  return (
    <ImageContext.Provider value={{ enabled, replacements: { ...overrides, ...temporary }, edit: (src, label) => { setError(''); setSelected({ src, label }) } }}>
      {children}
      <VocabImagePicker open={enabled && selected !== null} onClose={close}
        initialQuery={selected?.label && !/^(Image|Scène|Choix|Audio)\b/i.test(selected.label) ? selected.label : ''}
        onPick={(src) => {
          if (!selected) return
          withoutTemporary(selected.src)
          onChange({ ...overrides, [selected.src]: src })
        }}
        onUpload={async (file) => {
          if (!selected) return
          try {
            const image = await readGameImageFile(file)
            setTemporary((current) => ({ ...current, [selected.src]: image }))
            close()
          } catch (err) { setError(err instanceof Error ? err.message : 'Impossible de lire cette image.') }
        }}
        onReset={() => {
          if (!selected) return
          withoutTemporary(selected.src)
          const next = { ...overrides }; delete next[selected.src]; onChange(next); close()
        }}
        uploadError={error}
      />
    </ImageContext.Provider>
  )
}

/** Même balise img et mêmes dimensions : seule sa source change. */
export function WorksheetImage({ editable = true, src, alt, onClick, onKeyDown, className, ...props }: ImgHTMLAttributes<HTMLImageElement> & { editable?: boolean }) {
  const editor = useContext(ImageContext)
  const canEdit = editor.enabled && editable && Boolean(src) && !/^Audio\b/i.test(alt ?? '') && !/qr|game-card-border/.test(className ?? '')
  return <img {...props} src={src ? editor.replacements[src] ?? src : src} alt={alt}
    className={`${className ?? ''}${canEdit ? ' is-editable-word-image' : ''}`.trim() || undefined}
    tabIndex={canEdit ? 0 : props.tabIndex} role={canEdit ? 'button' : props.role}
    aria-label={canEdit ? `Modifier l’image${alt ? ` : ${alt}` : ''}` : props['aria-label']}
    title={canEdit ? 'Changer l’image : banque ou fichier de l’ordinateur' : props.title}
    onClick={(event) => {
      if (!canEdit || !src) { onClick?.(event); return }
      event.preventDefault(); event.stopPropagation(); editor.edit(src, alt ?? '')
    }}
    onKeyDown={(event) => {
      if (canEdit && src && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault(); event.stopPropagation(); editor.edit(src, alt ?? '')
      } else onKeyDown?.(event)
    }} />
}

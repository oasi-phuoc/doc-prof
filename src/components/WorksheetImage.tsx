import { createContext, useContext, useRef, useState, type Dispatch, type ImgHTMLAttributes, type ReactNode, type SetStateAction } from 'react'
import { VocabImagePicker } from '@/tcf/VocabImagePicker'
import { LIBRE_IMAGE_ACCEPT, readLibreImage } from '@/fiches/libre-media'
import { WorksheetSettings } from '@/components/generator/WorksheetSettings'

type ImageEditor = {
  enabled: boolean
  replacements: Record<string, string>
  edit: (src: string, label: string) => void
}
const ImageContext = createContext<ImageEditor>({ enabled: false, replacements: {}, edit: () => {} })

export function useWorksheetImageSources(): Record<string, string> {
  return useContext(ImageContext).replacements
}

export function WorksheetPrintImages({ sources, children }: { sources: Record<string, string>; children: ReactNode }) {
  return <ImageContext.Provider value={{ enabled: false, replacements: sources, edit: () => {} }}>{children}</ImageContext.Provider>
}

export function WorksheetImageProvider({ enabled, overrides, onChange, children }: {
  enabled: boolean
  overrides: Record<string, string>
  onChange: Dispatch<SetStateAction<Record<string, string>>>
  children: ReactNode
}) {
  const [selected, setSelected] = useState<{ src: string; label: string } | null>(null)
  const [error, setError] = useState('')
  const request = useRef(0)
  const close = () => {
    request.current += 1
    setSelected(null)
    setError('')
  }
  return (
    <ImageContext.Provider value={{ enabled, replacements: overrides, edit: (src, label) => {
      request.current += 1
      setError('')
      setSelected({ src, label })
    } }}>
      {children}
      <VocabImagePicker open={enabled && selected !== null} onClose={close}
        initialQuery={selected?.label && !/^(Image|Scène|Choix|Audio)\b/i.test(selected.label) ? selected.label : ''}
        onPick={(src) => {
          if (!selected) return
          request.current += 1
          onChange((current) => ({ ...current, [selected.src]: src }))
        }}
        onUpload={async (file) => {
          if (!selected) return
          const pending = ++request.current
          try {
            const image = await readLibreImage(file)
            if (request.current !== pending) return
            onChange((current) => ({ ...current, [selected.src]: image }))
            close()
          } catch (err) {
            if (request.current === pending) setError(err instanceof Error ? err.message : 'Impossible de lire cette image.')
          }
        }}
        onReset={() => {
          if (!selected) return
          onChange((current) => {
            const next = { ...current }
            delete next[selected.src]
            return next
          })
          close()
        }}
        uploadAccept={LIBRE_IMAGE_ACCEPT}
        uploadLabel="Importer une image"
        uploadError={error}
      />
    </ImageContext.Provider>
  )
}

/** Même balise img et mêmes dimensions : seule sa source change. */
export function WorksheetImage({ editable = true, applyOverrides = true, src, alt, onClick, onKeyDown, className, ...props }:
  ImgHTMLAttributes<HTMLImageElement> & { editable?: boolean; applyOverrides?: boolean }) {
  const editor = useContext(ImageContext)
  const canEdit = editor.enabled && editable && Boolean(src) && !/^Audio\b/i.test(alt ?? '') && !/qr|game-card-border/.test(className ?? '')
  return <><img {...props} src={src && applyOverrides ? editor.replacements[src] ?? src : src} alt={alt}
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
    {canEdit && src && (
      <WorksheetSettings onlyInPanel label={alt ? `Image · ${alt}` : 'Image'}>
        <button type="button" className="button small secondary" onClick={() => editor.edit(src, alt ?? '')}>
          Remplacer l’image
        </button>
      </WorksheetSettings>
    )}
  </>
}

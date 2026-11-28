import type { LogistiqueQuestionImage } from '@/math/types'
import { SelectBox } from './SelectBox'

export type LogistiquePhotoChoice = Pick<LogistiqueQuestionImage, 'src' | 'alt' | 'caption'>

export function LogistiqueImageFields({ photos, image, onChange, required }: {
  photos: readonly LogistiquePhotoChoice[]
  image?: LogistiqueQuestionImage
  onChange: (image: LogistiqueQuestionImage | undefined) => void
  required?: boolean
}) {
  if (!photos.length && !image) return null
  return (
    <details className="logistique-image-fields">
      <summary>Image de la question</summary>
      <SelectBox label="Photo de la bibliothèque" value={image?.src ?? ''} onChange={(src) => {
        if (!src) {
          if (!required) onChange(undefined)
          return
        }
        const photo = photos.find((entry) => entry.src === src)
        if (photo && src !== image?.src) onChange({
          src, alt: photo.alt.slice(0, 180), caption: '', width: image?.width ?? 140,
          placement: image?.placement ?? 'droite', visibility: image?.visibility ?? 'both',
        })
      }}>
        {!required && <option value="">Sans image</option>}
        {image && !photos.some(({ src }) => src === image.src) && <option value={image.src}>Photo de la question</option>}
        {photos.map((photo) => <option key={photo.src} value={photo.src}>{photo.caption || photo.alt}</option>)}
      </SelectBox>
      {image && (
        <>
          <img className="logistique-image-thumbnail" src={import.meta.env.BASE_URL + image.src.slice(1)} alt={image.alt} />
          <label className="libre-field is-line">
            <span>Description alternative</span>
            <input className="libre-line-input" maxLength={180} value={image.alt}
              onChange={(event) => onChange({ ...image, alt: event.target.value })} />
          </label>
          <label className="libre-field is-line">
            <span>Légende</span>
            <input className="libre-line-input" maxLength={160} value={image.caption}
              onChange={(event) => onChange({ ...image, caption: event.target.value })} />
          </label>
          <SelectBox label="Taille de l’image" value={String(image.width)} onChange={(width) => {
            onChange({ ...image, width: width === '100' ? 100 : width === '180' ? 180 : 140 })
          }}>
            <option value="100">Petite</option>
            <option value="140">Moyenne</option>
            <option value="180">Grande</option>
          </SelectBox>
          <SelectBox label="Placement de l’image" value={image.placement} onChange={(placement) => {
            if (placement === 'avant' || placement === 'apres' || placement === 'droite') onChange({ ...image, placement })
          }}>
            <option value="avant">Au-dessus de l’énoncé</option>
            <option value="apres">Sous l’énoncé</option>
            <option value="droite">À droite avec habillage</option>
          </SelectBox>
          {!required && <SelectBox label="Visibilité de l’image" value={image.visibility} onChange={(visibility) => {
            if (visibility === 'both' || visibility === 'answers') onChange({ ...image, visibility })
          }}>
            <option value="both">Élève et corrigé</option>
            <option value="answers">Corrigé seulement</option>
          </SelectBox>}
        </>
      )}
    </details>
  )
}

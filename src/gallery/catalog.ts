import data from './catalog.generated.json'
import decorsInedits from '../../docs/gallery/decors-inedits-100-20261123.json'
import { galleryAssetUrls } from './assets.generated'

export type GalleryImage = {
  id: string
  src: string
  label: string
  themes: string[]
  types: string[]
  collection: string
  keywords: string
  bytes: number
}
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/œ/g, 'oe').replace(/[’‘]/g, "'").trim()
const publishedDecors = decorsInedits.images.filter(image => image.status === 'visually_reviewed')
const decorById = new Map(publishedDecors.map(image => ['public' + image.path, image]))
const indexedIds = new Set(data.map(image => image.id))
const additionalDecors: GalleryImage[] = publishedDecors
  .filter(image => !indexedIds.has('public' + image.path))
  .map(image => ({
    id: 'public' + image.path,
    src: image.path,
    label: image.label,
    themes: ['Lieux et décors', image.category],
    types: ['Lieu et décor'],
    collection: 'TCF',
    keywords: image.keywords.join(' '),
    bytes: image.bytes ?? 0,
  }))
export const galleryImages: GalleryImage[] = [...data, ...additionalDecors].map(image => {
  const decor = decorById.get(image.id)
  return {
    ...image,
    label: decor?.label ?? image.label,
    themes: decor ? ['Lieux et décors', decor.category] : image.themes,
    types: decor ? ['Lieu et décor'] : image.types,
    keywords: decor ? decor.keywords.join(' ') : image.keywords,
    src: galleryAssetUrls[image.id] ?? `${import.meta.env.BASE_URL}${image.src.replace(/^\\//, '')}`,
  }
})
export function filterGallery(images: GalleryImage[], query: string, theme: string, type: string, collection: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean)
  return images.filter(image => {
    const filename = image.id.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
    return (!theme || image.themes.includes(theme)) && (!type || image.types.includes(type)) && (!collection || image.collection === collection) && terms.every(term => normalizeSearch([image.label, filename, image.keywords, ...image.types].join(' ')).includes(term))
  })
}
export function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toLocaleString('fr', { maximumFractionDigits: 1 })} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`
}

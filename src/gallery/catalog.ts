import data from './catalog.generated.json'
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
export const normalizeSearch = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
export const galleryImages: GalleryImage[] = data.map(image => ({
  ...image,
  src: galleryAssetUrls[image.id] ?? `${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`,
}))
export function filterGallery(images: GalleryImage[], query: string, theme: string, type: string, collection: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean)
  return images.filter(image => (!theme || image.themes.includes(theme)) && (!type || image.types.includes(type)) && (!collection || image.collection === collection) && terms.every(term => normalizeSearch([image.label, image.id, image.keywords, ...image.themes, ...image.types].join(' ')).includes(term)))
}
export function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toLocaleString('fr', { maximumFractionDigits: 1 })} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`
}

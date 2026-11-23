import data from './catalog.generated.json'
import newDecors from '../../docs/gallery/decors-20261123.json'
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
const generatedIds = new Set(data.map(image => image.id))
// Lot directement consultable, même avant la prochaine régénération du catalogue.
// Dès que gallery:index le répertorie, l'entrée n'est plus ajoutée en double.
const newDecorImages: GalleryImage[] = newDecors.images
  .filter(image => !generatedIds.has('public' + image.path))
  .map(image => ({
    id: 'public' + image.path,
    src: `${import.meta.env.BASE_URL}${image.path.replace(/^\//, '')}`,
    label: image.label,
    themes: [image.category, 'Décors inédits 2026'],
    types: ['Lieu et décor'],
    collection: 'TCF',
    keywords: image.keywords.join(' '),
    bytes: image.bytes,
  }))
export const galleryImages: GalleryImage[] = [
  ...data.map(image => ({
    ...image,
    src: galleryAssetUrls[image.id] ?? `${import.meta.env.BASE_URL}${image.src.replace(/^\//, '')}`,
  })),
  ...newDecorImages,
]
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

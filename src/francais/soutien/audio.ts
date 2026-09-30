import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import { soutienImageFor } from './images'

/** Origine publique des MP3 (QR imprimés). */
export const SOUTIEN_AUDIO_ORIGIN = 'https://doc-prof.vercel.app'

/** Index libellé → chemin audio vocabulaire. */
const AUDIO_BY_LABEL: Map<string, string> = (() => {
  const map = new Map<string, string>()
  for (const topic of VOCAB_TOPIC_BANKS) {
    for (const subgroup of topic.subgroups) {
      for (const word of subgroup.words) {
        const key = word.label.trim().toLowerCase()
        if (!key || map.has(key)) continue
        const imageSrc = word.imageSrc?.trim()
        if (imageSrc) {
          const m = imageSrc.match(/^\/lib\/images\/vocabulaire\/([^/]+)\/([^/]+)\.[^.]+$/i)
          if (m) {
            map.set(key, `/lib/audio/vocabulaire/${m[1]}/${stripExt(m[2]!)}.mp3`)
            continue
          }
        }
        // Repli : thème du topic catalogue
        const theme = topic.id.replace(/^fr-/, '') || 'vocabulaire'
        map.set(key, `/lib/audio/vocabulaire/${theme}/${slugLabel(key)}.mp3`)
      }
    }
  }
  return map
})()

function stripExt(name: string): string {
  return name.replace(/\.[^.]+$/, '')
}

function slugLabel(label: string): string {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Chemin relatif `/lib/audio/vocabulaire/...` pour un mot Soutien. */
export function soutienAudioFor(label: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  if (AUDIO_BY_LABEL.has(key)) return AUDIO_BY_LABEL.get(key)
  // Dériver du chemin image si connu
  const image = soutienImageFor(label)
  if (image) {
    const m = image.match(/^\/lib\/images\/vocabulaire\/([^/]+)\/([^/]+)\.[^.]+$/i)
    if (m) return `/lib/audio/vocabulaire/${m[1]}/${stripExt(m[2]!)}.mp3`
  }
  return undefined
}

/** URL absolue pour QR (téléphone). */
export function soutienAudioAbsoluteUrl(audioSrc: string): string {
  if (/^https?:\/\//i.test(audioSrc)) return audioSrc
  const path = audioSrc.startsWith('/') ? audioSrc : `/${audioSrc}`
  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    if (origin && !/localhost|127\.0\.0\.1/i.test(origin)) {
      return `${origin}${path}`
    }
  }
  return `${SOUTIEN_AUDIO_ORIGIN}${path}`
}

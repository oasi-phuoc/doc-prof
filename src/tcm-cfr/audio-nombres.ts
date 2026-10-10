/**
 * Composition d’audios de nombres 1–1000 à partir de
 * `public/lib/audio/nombre/{1..100}.mp3` + cent / mille (vocabulaire).
 *
 * Noms de fichiers : voir `@/francais/soutien/download-name`
 * (`TCM-CFR_Exercice-1_NOMBRE_Semestre-1.mp3`, …).
 */
import {
  tcmCfrAudioDownloadName,
  tcmCfrSemestre,
  type TcmCfrAudioKind,
} from '@/francais/soutien/download-name'

export {
  tcmCfrAudioDownloadName,
  tcmCfrSemestre,
  type TcmCfrAudioKind,
} from '@/francais/soutien/download-name'

const NOMBRE_DIR = '/lib/audio/nombre'
const MESURES_DIR = '/lib/audio/vocabulaire/nombres-mesures'

export const FOIS_AUDIO = `${NOMBRE_DIR}/fois.mp3`

/** Silence de 6 s entre chaque nombre / chaque calcul au téléchargement. */
export const SILENCE_6S_AUDIO = `${NOMBRE_DIR}/silence-6s.mp3`

/** Déduit NOMBRE / MULTIPLICATION à partir de la playlist (présence de `fois.mp3`). */
export function tcmCfrAudioKindFromParts(parts: readonly string[]): TcmCfrAudioKind {
  return parts.some((p) => p === FOIS_AUDIO || p.endsWith('/fois.mp3'))
    ? 'MULTIPLICATION'
    : 'NOMBRE'
}

/** Concatène des MP3 (mêmes paramètres TTS) en un Blob téléchargeable. */
export async function concatMp3(urls: string[]): Promise<Blob> {
  const buffers: ArrayBuffer[] = []
  for (const url of urls) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Audio introuvable : ${url}`)
    buffers.push(await res.arrayBuffer())
  }
  const total = buffers.reduce((n, b) => n + b.byteLength, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const buf of buffers) {
    out.set(new Uint8Array(buf), offset)
    offset += buf.byteLength
  }
  return new Blob([out], { type: 'audio/mpeg' })
}

/**
 * Enchaîne plusieurs playlists (un nombre ou un calcul chacune)
 * avec 6 secondes de silence entre elles.
 */
export async function concatPlaylistsWithGap(
  playlists: readonly (readonly string[])[],
  gapUrl = SILENCE_6S_AUDIO,
): Promise<Blob> {
  const urls: string[] = []
  for (let i = 0; i < playlists.length; i++) {
    urls.push(...playlists[i]!)
    if (i < playlists.length - 1) urls.push(gapUrl)
  }
  if (urls.length === 0) return new Blob([], { type: 'audio/mpeg' })
  if (urls.length === 1) {
    const res = await fetch(urls[0]!)
    if (!res.ok) throw new Error(`Audio introuvable : ${urls[0]}`)
    return res.blob()
  }
  return concatMp3(urls)
}

async function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}

/**
 * Télécharge les audios TCM CFR groupés :
 * 1 fichier nombres (6 s entre chaque) + 1 fichier multiplications (6 s entre chaque).
 */
export async function downloadTcmCfrAudios(
  playlists: readonly (readonly string[])[],
): Promise<number> {
  const nonEmpty = playlists.filter((p) => p.length > 0)
  if (nonEmpty.length === 0) return 0

  const byKind: Record<TcmCfrAudioKind, string[][]> = {
    NOMBRE: [],
    MULTIPLICATION: [],
  }
  for (const parts of nonEmpty) {
    byKind[tcmCfrAudioKindFromParts(parts)].push([...parts])
  }

  let downloaded = 0
  for (const kind of ['NOMBRE', 'MULTIPLICATION'] as const) {
    const group = byKind[kind]
    if (group.length === 0) continue
    const blob = await concatPlaylistsWithGap(group)
    await downloadBlob(blob, tcmCfrAudioDownloadName({ kind }))
    downloaded += 1
    if (kind === 'NOMBRE' && byKind.MULTIPLICATION.length > 0) {
      await new Promise((r) => setTimeout(r, 150))
    }
  }
  return downloaded
}

/** Chemins MP3 à enchaîner pour lire `n` (1–1000). */
export function numberAudioParts(n: number): string[] {
  const value = Math.max(1, Math.min(1000, Math.round(n)))
  if (value <= 100) return [`${NOMBRE_DIR}/${value}.mp3`]
  if (value === 1000) return [`${MESURES_DIR}/mille.mp3`]
  const hundreds = Math.floor(value / 100)
  const rest = value % 100
  const parts: string[] = []
  if (hundreds === 1) {
    parts.push(`${NOMBRE_DIR}/100.mp3`)
  } else {
    parts.push(`${NOMBRE_DIR}/${hundreds}.mp3`)
    parts.push(`${MESURES_DIR}/cent.mp3`)
  }
  if (rest > 0) parts.push(`${NOMBRE_DIR}/${rest}.mp3`)
  return parts
}

/** Playlist pour « a fois b ». */
export function mulAudioParts(a: number, b: number): string[] {
  return [...numberAudioParts(a), FOIS_AUDIO, ...numberAudioParts(b)]
}

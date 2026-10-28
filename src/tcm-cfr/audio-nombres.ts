/**
 * Composition d’audios de nombres 1–1000 à partir de
 * `public/lib/audio/nombre/{1..100}.mp3` + cent / mille (vocabulaire).
 *
 * Noms de fichiers : voir `@/francais/soutien/download-name`
 * (`TCM-CFR_NOMBRE-MULTIPLICATION_Semestre-1.zip` avec les deux WAV).
 *
 * Les playlists groupées sont décodées puis réencodées en un seul WAV :
 * coller des MP3 bout à bout casse durée / barre de progression.
 */
import {
  tcmCfrAudioDownloadName,
  tcmCfrAudioZipDownloadName,
  type TcmCfrAudioKind,
} from '@/francais/soutien/download-name'
import { zipStoreBlob } from '@/lib/zip-store'

export {
  tcmCfrAudioDownloadName,
  tcmCfrAudioZipDownloadName,
  tcmCfrSemestre,
  type TcmCfrAudioKind,
} from '@/francais/soutien/download-name'

export type TcmCfrAudioPlaylist = {
  parts: readonly string[]
  kind?: TcmCfrAudioKind
  exerciseNo?: number
}

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

function writeString(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
}

/** Encode un AudioBuffer en WAV PCM 16-bit. */
export function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const samples = buffer.length
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const dataSize = samples * blockAlign
  const ab = new ArrayBuffer(44 + dataSize)
  const view = new DataView(ab)
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bytesPerSample * 8, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  const channels: Float32Array[] = []
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c))
  let offset = 44
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c]![i]!))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }
  return new Blob([ab], { type: 'audio/wav' })
}

function createAudioContext(): AudioContext {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  return new AC()
}

/**
 * Concatène des fichiers audio (MP3 TTS) en un seul WAV continu.
 * Évite le collage binaire MP3 qui fait avancer / reculer la barre de progression.
 */
export async function concatMp3(urls: string[]): Promise<Blob> {
  if (urls.length === 0) return new Blob([], { type: 'audio/wav' })
  if (urls.length === 1) {
    const res = await fetch(urls[0]!)
    if (!res.ok) throw new Error(`Audio introuvable : ${urls[0]}`)
    const ab = await res.arrayBuffer()
    const ctx = createAudioContext()
    try {
      const decoded = await ctx.decodeAudioData(ab.slice(0))
      return encodeWav(decoded)
    } finally {
      await ctx.close().catch(() => undefined)
    }
  }

  const ctx = createAudioContext()
  try {
    const decoded: AudioBuffer[] = []
    for (const url of urls) {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Audio introuvable : ${url}`)
      const ab = await res.arrayBuffer()
      decoded.push(await ctx.decodeAudioData(ab.slice(0)))
    }
    const sampleRate = decoded[0]!.sampleRate
    const numChannels = Math.max(...decoded.map((b) => b.numberOfChannels))
    for (const buf of decoded) {
      if (buf.sampleRate !== sampleRate) {
        throw new Error(
          `Fréquences d’échantillonnage incompatibles (${buf.sampleRate} ≠ ${sampleRate}).`,
        )
      }
    }
    const totalLength = decoded.reduce((n, b) => n + b.length, 0)
    const out = ctx.createBuffer(numChannels, totalLength, sampleRate)
    let offset = 0
    for (const buf of decoded) {
      for (let c = 0; c < numChannels; c++) {
        const src = buf.getChannelData(Math.min(c, buf.numberOfChannels - 1))
        out.getChannelData(c).set(src, offset)
      }
      offset += buf.length
    }
    return encodeWav(out)
  } finally {
    await ctx.close().catch(() => undefined)
  }
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
  if (urls.length === 0) return new Blob([], { type: 'audio/wav' })
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

export type TcmCfrAudioGroup = {
  kind: TcmCfrAudioKind
  parts: string[][]
  exerciseNo?: number
}

function asPlaylist(
  input: readonly string[] | TcmCfrAudioPlaylist,
): TcmCfrAudioPlaylist | null {
  if (Array.isArray(input)) {
    return input.length > 0 ? { parts: input } : null
  }
  const row = input as TcmCfrAudioPlaylist
  return row.parts.length > 0 ? row : null
}

/** Groupe les playlists nombres / multiplications (type d’exercice ou `fois.mp3`). */
export function groupTcmCfrPlaylists(
  playlists: readonly (readonly string[] | TcmCfrAudioPlaylist)[],
): TcmCfrAudioGroup[] {
  const byKind: Record<TcmCfrAudioKind, TcmCfrAudioGroup> = {
    NOMBRE: { kind: 'NOMBRE', parts: [] },
    MULTIPLICATION: { kind: 'MULTIPLICATION', parts: [] },
  }
  for (const raw of playlists) {
    const row = asPlaylist(raw)
    if (!row) continue
    const kind = row.kind ?? tcmCfrAudioKindFromParts(row.parts)
    const group = byKind[kind]
    group.parts.push([...row.parts])
    if (group.exerciseNo == null && row.exerciseNo != null && row.exerciseNo > 0) {
      group.exerciseNo = row.exerciseNo
    }
  }
  return (['NOMBRE', 'MULTIPLICATION'] as const)
    .map((kind) => byKind[kind])
    .filter((group) => group.parts.length > 0)
}

/**
 * Télécharge les audios TCM CFR groupés :
 * nombres + multiplications dans un ZIP (un WAV chacun, 6 s entre les items).
 * Un seul fichier si un seul type est présent.
 */
export async function downloadTcmCfrAudios(
  playlists: readonly (readonly string[] | TcmCfrAudioPlaylist)[],
): Promise<number> {
  const groups = groupTcmCfrPlaylists(playlists)
  if (groups.length === 0) return 0

  const files: { name: string; blob: Blob }[] = []
  for (const group of groups) {
    try {
      const blob = await concatPlaylistsWithGap(group.parts)
      files.push({
        name: tcmCfrAudioDownloadName({ kind: group.kind, exerciseNo: group.exerciseNo }),
        blob,
      })
    } catch {
      // Un type manquant n’empêche pas l’autre (ex. `fois.mp3` illisible).
    }
  }
  if (files.length === 0) return 0
  if (files.length === 1) {
    await downloadBlob(files[0]!.blob, files[0]!.name)
    return 1
  }

  const zip = await zipStoreBlob(files.map((file) => ({ name: file.name, data: file.blob })))
  await downloadBlob(zip, tcmCfrAudioZipDownloadName())
  return files.length
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

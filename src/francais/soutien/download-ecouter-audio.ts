/**
 * Audio téléchargeable Soutien FR types 6 et 7 :
 * consigne (+ son) · 6 s · Numéro n · 2 s · mot · 6 s · …
 */
import { SILENCE_6S_AUDIO, concatMp3 } from '@/tcm-cfr/audio-nombres'
import { soutienAudioFor } from './audio'

const SOUTIEN_DIR = '/lib/audio/soutien'

export const SOUTIEN_SILENCE_6S = SILENCE_6S_AUDIO
export const SOUTIEN_SILENCE_2S = `${SOUTIEN_DIR}/silence-2s.mp3`
export const SOUTIEN_ECOUTER_CONSIGNE = `${SOUTIEN_DIR}/consigne-ecoutez-cochez.mp3`

/** Phonème banque → fichier `sons/{slug}.mp3`. */
const SOUND_SLUG: Record<string, string> = {
  '/a/': 'a',
  '/o/': 'o',
  '/i/': 'i',
  '/y/': 'u',
  '/ə/': 'e',
  '/b/': 'b',
  '/k/': 'k',
  '/s/': 's',
  '/d/': 'd',
  '/g/': 'g',
  '/ʒ/': 'j',
  '/p/': 'p',
  '/t/': 't',
  '/f/': 'f',
  '/l/': 'l',
  '/m/': 'm',
  '/n/': 'n',
  '/r/': 'r',
  '/v/': 'v',
  '/z/': 'z',
  '/w/': 'w',
  '/ks/': 'x',
  '/gz/': 'x',
  '/∅/': 'h-muet',
  '/ʃ/': 'ch',
  '/u/': 'ou',
  '/wa/': 'oi',
  '/ɑ̃/': 'an',
  '/ɛ̃/': 'in',
  '/ɔ̃/': 'on',
  '/ɲ/': 'gn',
  '/j/': 'ill',
}

export function soutienNumeroAudio(n: number): string {
  const i = Math.max(1, Math.min(30, Math.round(n)))
  return `${SOUTIEN_DIR}/numero-${i}.mp3`
}

export function soutienSonAudioFor(phoneme: string): string | undefined {
  const slug = SOUND_SLUG[phoneme.trim()]
  if (!slug) return undefined
  return `${SOUTIEN_DIR}/sons/${slug}.mp3`
}

function downloadName(opts: {
  kind: 'ecouter' | 'ecouter-image'
  bankId?: string
  date?: Date
}): string {
  const bank = opts.bankId?.replace(/[^a-z0-9-]/gi, '') || 'son'
  const label = opts.kind === 'ecouter-image' ? 'Ecouter-image' : 'Ecouter'
  const d = opts.date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `Soutien-FR_${label}_${bank}_${y}${m}${day}.mp3`
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
 * Playlist : consigne · [son] · 6 s · Numéro 1 · 2 s · mot1 · 6 s · Numéro 2 · 2 s · mot2 · 6 s · …
 * Retourne le nombre de mots inclus (0 si aucun audio).
 */
export async function downloadSoutienEcouterAudio(opts: {
  words: readonly string[]
  /** Chemins audio déjà résolus (fiche) ; sinon lookup par libellé. */
  audioSrcs?: readonly (string | undefined | null)[]
  phoneme?: string
  bankId?: string
  kind?: 'ecouter' | 'ecouter-image'
}): Promise<number> {
  const entries = opts.words
    .map((w, i) => {
      const fromSheet = opts.audioSrcs?.[i]?.trim()
      const audio = fromSheet || soutienAudioFor(w)
      return audio ? { word: w, audio } : null
    })
    .filter((e): e is { word: string; audio: string } => Boolean(e))
    .slice(0, 30)
  if (entries.length === 0) return 0

  const urls: string[] = [SOUTIEN_ECOUTER_CONSIGNE]
  const son = opts.phoneme ? soutienSonAudioFor(opts.phoneme) : undefined
  if (son) urls.push(son)

  for (let i = 0; i < entries.length; i++) {
    urls.push(SOUTIEN_SILENCE_6S)
    urls.push(soutienNumeroAudio(i + 1))
    urls.push(SOUTIEN_SILENCE_2S)
    urls.push(entries[i]!.audio)
  }
  urls.push(SOUTIEN_SILENCE_6S)

  const blob = await concatMp3(urls)
  await downloadBlob(
    blob,
    downloadName({ kind: opts.kind ?? 'ecouter', bankId: opts.bankId }),
  )
  return entries.length
}

/**
 * Téléchargement audio Soutien FR :
 * - type 1 : consigne vocabulaire + mots (6 s)
 * - type 5 : consigne « Écoutez et complétez les mots. » + mots (6 s)
 */
import { SILENCE_6S_AUDIO, concatMp3 } from '@/tcm-cfr/audio-nombres'
import { soutienAudioFor } from './audio'

/** Consigne type 1 (DeniseNeural −25 %). */
export const SOUTIEN_MOTS_CONSIGNE_AUDIO =
  '/lib/audio/soutien/consigne-vocabulaire-repetez.mp3'

/** Consigne type 5 (DeniseNeural −25 %). */
export const SOUTIEN_COMPLETER_CONSIGNE_AUDIO =
  '/lib/audio/soutien/consigne-ecoutez-completez.mp3'

export function soutienMotsAudioDownloadName(opts?: {
  bankId?: string
  date?: Date
  kind?: 'mots' | 'completer'
}): string {
  const bank = opts?.bankId?.replace(/[^a-z0-9-]/gi, '') || 'mots'
  const label = opts?.kind === 'completer' ? 'Completer' : 'Mots'
  const d = opts?.date ?? new Date()
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
 * Construit la playlist : consigne · 6 s · mot1 · 6 s · mot2 · …
 * Retourne le nombre de segments mot inclus (0 si aucun audio de mot).
 */
export async function downloadSoutienMotsAudio(opts: {
  words: readonly string[]
  bankId?: string
  /** Consigne audio (défaut type 1). */
  consigneSrc?: string
  kind?: 'mots' | 'completer'
}): Promise<number> {
  const wordAudios = opts.words
    .map((w) => soutienAudioFor(w))
    .filter((src): src is string => Boolean(src))
  if (wordAudios.length === 0) return 0

  const consigne = opts.consigneSrc ?? SOUTIEN_MOTS_CONSIGNE_AUDIO
  const urls: string[] = [consigne]
  for (const audio of wordAudios) {
    urls.push(SILENCE_6S_AUDIO, audio)
  }
  const blob = await concatMp3(urls)
  await downloadBlob(
    blob,
    soutienMotsAudioDownloadName({ bankId: opts.bankId, kind: opts.kind }),
  )
  return wordAudios.length
}

/** Audio type 5 : consigne « Écoutez et complétez… » + mots, 6 s d’intervalle. */
export async function downloadSoutienCompleterAudio(opts: {
  words: readonly string[]
  bankId?: string
}): Promise<number> {
  return downloadSoutienMotsAudio({
    words: opts.words,
    bankId: opts.bankId,
    consigneSrc: SOUTIEN_COMPLETER_CONSIGNE_AUDIO,
    kind: 'completer',
  })
}

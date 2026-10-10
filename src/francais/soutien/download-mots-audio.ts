/**
 * Téléchargement audio Soutien FR type 1 (mots et images) :
 * consigne « Vocabulaire. Répétez les mots. » puis chaque mot,
 * avec 6 s de silence entre consigne et mots.
 */
import { SILENCE_6S_AUDIO, concatMp3 } from '@/tcm-cfr/audio-nombres'
import { soutienAudioFor } from './audio'

/** Consigne enregistrée (DeniseNeural −25 %). */
export const SOUTIEN_MOTS_CONSIGNE_AUDIO =
  '/lib/audio/soutien/consigne-vocabulaire-repetez.mp3'

export function soutienMotsAudioDownloadName(opts?: {
  bankId?: string
  date?: Date
}): string {
  const bank = opts?.bankId?.replace(/[^a-z0-9-]/gi, '') || 'mots'
  const d = opts?.date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `Soutien-FR_Mots_${bank}_${y}${m}${day}.mp3`
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
}): Promise<number> {
  const wordAudios = opts.words
    .map((w) => soutienAudioFor(w))
    .filter((src): src is string => Boolean(src))
  if (wordAudios.length === 0) return 0

  const urls: string[] = [SOUTIEN_MOTS_CONSIGNE_AUDIO]
  for (const audio of wordAudios) {
    urls.push(SILENCE_6S_AUDIO, audio)
  }
  const blob = await concatMp3(urls)
  await downloadBlob(blob, soutienMotsAudioDownloadName({ bankId: opts.bankId }))
  return wordAudios.length
}

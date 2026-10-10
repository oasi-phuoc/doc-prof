/**
 * Nom de fichier audio Soutien FR :
 * SOUTIEN-FR_VOYELLES_A_Exercice-1_10.10.2026.mp3
 */

export type SoutienAudioDownloadNameOpts = {
  /** Libellé thème UI (ex. « Voyelles »). */
  themeLabel: string
  /** Lettre affichée (ex. « A », « CH »). */
  letterLabel: string
  /** Numéro d’exercice sur la fiche (1-based). */
  exerciseNo: number
  date?: Date
}

/** Normalise un segment de nom (majuscules, tirets, sans accents). */
export function soutienAudioNameSegment(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLocaleUpperCase('fr-FR')
}

/**
 * SOUTIEN-FR_{THEME}_{LETTRE}_Exercice-{n}_{JJ}.{MM}.{AAAA}.mp3
 */
export function soutienAudioDownloadName(opts: SoutienAudioDownloadNameOpts): string {
  const theme = soutienAudioNameSegment(opts.themeLabel) || 'THEME'
  const letter = soutienAudioNameSegment(opts.letterLabel) || 'X'
  const n = Math.max(1, Math.round(opts.exerciseNo) || 1)
  const d = opts.date ?? new Date()
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `SOUTIEN-FR_${theme}_${letter}_Exercice-${n}_${day}.${month}.${year}.mp3`
}

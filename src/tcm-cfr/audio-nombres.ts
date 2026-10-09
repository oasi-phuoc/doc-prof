/**
 * Composition d’audios de nombres 1–1000 à partir de
 * `public/lib/audio/nombre/{1..100}.mp3` + cent / mille (vocabulaire).
 */
const NOMBRE_DIR = '/lib/audio/nombre'
const MESURES_DIR = '/lib/audio/vocabulaire/nombres-mesures'

export const FOIS_AUDIO = `${NOMBRE_DIR}/fois.mp3`

export type TcmCfrAudioKind = 'NOMBRE' | 'MULTIPLICATION'

/** Semestre scolaire : 1 = août–décembre, 2 = janvier–juillet. */
export function tcmCfrSemestre(date = new Date()): 'Semestre-1' | 'Semestre-2' {
  const month = date.getMonth() // 0 = janv.
  return month >= 7 && month <= 11 ? 'Semestre-1' : 'Semestre-2'
}

/**
 * Nom de fichier au téléchargement, même esprit que TCF :
 * `TCM-CFR_Exercice-1_NOMBRE_Semestre-1.mp3`
 * `TCM-CFR_Exercice-2_MULTIPLICATION_Semestre-2.mp3`
 */
export function tcmCfrAudioDownloadName(opts: {
  kind: TcmCfrAudioKind
  date?: Date
}): string {
  const exerciseNo = opts.kind === 'MULTIPLICATION' ? 2 : 1
  return `TCM-CFR_Exercice-${exerciseNo}_${opts.kind}_${tcmCfrSemestre(opts.date)}.mp3`
}

/** Déduit NOMBRE / MULTIPLICATION à partir de la playlist (présence de `fois.mp3`). */
export function tcmCfrAudioKindFromParts(parts: readonly string[]): TcmCfrAudioKind {
  return parts.some((p) => p === FOIS_AUDIO || p.endsWith('/fois.mp3'))
    ? 'MULTIPLICATION'
    : 'NOMBRE'
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

/**
 * Chemins des médias TCF.
 * - data URL, URL http(s) ou chemin absolu (`/lib/...`) : utilisés tels quels ;
 * - chemin relatif (`vocabulaire/fruits/pomme.webp`) : sous `public/lib/images|audio/`.
 */
export const TCF_IMAGE_DIR = '/lib/images/'
export const TCF_AUDIO_DIR = '/lib/audio/'

function resolve(src: string, dir: string): string {
  const s = src.trim()
  if (!s) return ''
  if (/^(data:|https?:\/\/|\/)/i.test(s)) return s
  return `${dir}${s}`
}

export function tcfImageSrc(src: string | null | undefined): string {
  return src ? resolve(src, TCF_IMAGE_DIR) : ''
}

export function tcfAudioSrc(src: string | null | undefined): string {
  return src ? resolve(src, TCF_AUDIO_DIR) : ''
}

/** Audios des nombres : `public/lib/audio/nombre/{n}.mp3` (1 à 100, centaines, 1000). */
export const NOMBRE_AUDIO_DIR = `${TCF_AUDIO_DIR}nombre/`

/** Fichiers à enchaîner pour lire un entier de 1 à 9999 (ex. 345 → 300, 45 ; 2012 → 2, 1000, 12). */
export function nombreAudioParts(n: number): number[] {
  if (!Number.isInteger(n) || n < 1 || n > 9999) return []
  if (n <= 100) return [n]
  const parts: number[] = []
  const thousands = Math.floor(n / 1000)
  if (thousands) parts.push(...(thousands > 1 ? [thousands, 1000] : [1000]))
  const hundreds = Math.floor((n % 1000) / 100)
  const rest = n % 100
  if (hundreds) parts.push(hundreds * 100)
  if (rest) parts.push(rest)
  return parts
}

/**
 * Combinaison de nombres : `nombre/100-12` (ou `/lib/audio/nombre/100-12.mp3`) se lit
 * 100.mp3 puis 12.mp3. Retourne null si le chemin n’est pas une combinaison.
 */
export function tcfAudioSequence(src: string | null | undefined): string[] | null {
  const m = src?.trim().match(/(?:^|\/)nombre\/(\d+(?:-\d+)+)(?:\.mp3)?$/i)
  return m ? m[1].split('-').map((n) => `${NOMBRE_AUDIO_DIR}${Number(n)}.mp3`) : null
}

/** Chemin de combinaison pour un entier (ex. 112 → `nombre/100-12`). */
export function nombreAudioCombinaison(n: number): string {
  return `nombre/${nombreAudioParts(n).join('-')}`
}

/**
 * Chemins des médias TCF.
 * - data URL, URL http(s) ou chemin absolu (`/lib/...`) : utilisés tels quels ;
 * - nom de fichier seul (`pomme.png`) : rangé dans `public/lib/tcf/images|audio/`.
 */
export const TCF_IMAGE_DIR = '/lib/tcf/images/'
export const TCF_AUDIO_DIR = '/lib/tcf/audio/'

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

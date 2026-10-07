/**
 * Résout un chemin d’image Jeux : médiathèque /lib/images/vocabulaire (par thème).
 */
import { VOCAB_IMAGE_BY_LABEL } from './vocab-images'

function lookup(label: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  return (
    VOCAB_IMAGE_BY_LABEL[key] ??
    VOCAB_IMAGE_BY_LABEL[key.replace(/ /g, '-')] ??
    VOCAB_IMAGE_BY_LABEL[key.replace(/-/g, ' ')]
  )
}

/**
 * Chemin image pour un libellé.
 * Une image fournie (upload data:/blob:, http) est prioritaire.
 * Les anciens chemins /lib/images/vocabulaire/… ou /assets/words/lecture/… sont
 * réécrits via l’index actuel.
 */
export function resolveGameImageSrc(label: string, fallback?: string): string | undefined {
  const mapped = lookup(label)
  const fb = fallback?.trim()
  if (
    fb &&
    (fb.startsWith('data:') ||
      fb.startsWith('blob:') ||
      fb.startsWith('http://') ||
      fb.startsWith('https://'))
  ) {
    return fb
  }
  if (mapped) return mapped
  if (fb?.startsWith('/lib/')) return fb
  return fb || undefined
}

/**
 * Résout un chemin d’image Jeux : médiathèque /lib/images/vocabulaire (par thème).
 */
import { VOCAB_IMAGE_BY_LABEL } from './vocab-images'

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function lookup(label: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  const candidates = [
    key,
    key.replace(/ /g, '-'),
    key.replace(/-/g, ' '),
    stripAccents(key),
    stripAccents(key).replace(/ /g, '-'),
  ]
  // Singulier / pluriel simple (chaussure ↔ chaussures).
  if (key.endsWith('s') && key.length > 3) candidates.push(key.slice(0, -1), stripAccents(key.slice(0, -1)))
  else candidates.push(`${key}s`, `${stripAccents(key)}s`)
  // Typo fréquente banque U.
  if (key === 'alumette' || stripAccents(key) === 'alumette') candidates.push('allumette')
  for (const c of candidates) {
    const hit = VOCAB_IMAGE_BY_LABEL[c]
    if (hit) return hit
  }
  return undefined
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

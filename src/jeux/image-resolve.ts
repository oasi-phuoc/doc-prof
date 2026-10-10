/**
 * Résout un chemin d’image Jeux : médiathèque /lib/images/vocabulaire (par thème).
 */
import { VOCAB_IMAGE_BY_LABEL } from './vocab-images'

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Index sans accents → src (première occurrence). */
const VOCAB_IMAGE_BY_ASCII: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  for (const [label, src] of Object.entries(VOCAB_IMAGE_BY_LABEL)) {
    const ascii = stripAccents(label)
    if (!(ascii in map)) map[ascii] = src
    const dashed = ascii.replace(/ /g, '-')
    if (!(dashed in map)) map[dashed] = src
  }
  return map
})()

function lookup(label: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  const ascii = stripAccents(key)
  const candidates = [
    key,
    key.replace(/ /g, '-'),
    key.replace(/-/g, ' '),
    // « boucles d'oreilles » ↔ « boucles-d-oreilles »
    key.replace(/'/g, '-').replace(/ /g, '-').replace(/-+/g, '-'),
    key.replace(/'/g, ''),
    ascii,
    ascii.replace(/ /g, '-'),
    ascii.replace(/'/g, '-').replace(/ /g, '-').replace(/-+/g, '-'),
  ]
  // Singulier / pluriel simple (chaussure ↔ chaussures).
  if (key.endsWith('s') && key.length > 3) {
    candidates.push(key.slice(0, -1), stripAccents(key.slice(0, -1)))
  } else {
    candidates.push(`${key}s`, `${ascii}s`)
  }
  // Typo fréquente banque U.
  if (key === 'alumette' || ascii === 'alumette') candidates.push('allumette')
  // Alias pédagogiques Soutien ↔ Voc.
  const aliases: Record<string, string> = {
    boxer: 'boxeur',
    mixer: 'mixeur',
    yeux: 'œil',
    oeil: 'œil',
  }
  const alias = aliases[ascii] ?? aliases[key]
  if (alias) candidates.push(alias, stripAccents(alias))
  for (const c of candidates) {
    const hit = VOCAB_IMAGE_BY_LABEL[c] ?? VOCAB_IMAGE_BY_ASCII[c]
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

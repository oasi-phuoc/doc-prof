export const FONT_SIZE_STORAGE_KEY = 'clairfle-base-font-size'
export const DEFAULT_BASE_FONT_SIZE = 16
export const DEFAULT_CSC_FONT_SIZE = DEFAULT_BASE_FONT_SIZE + 2
export const MIN_BASE_FONT_SIZE = 10
export const MAX_BASE_FONT_SIZE = 24
/** Variable CSS : échelle du texte des feuilles imprimables uniquement. */
export const SHEET_FONT_SCALE_VAR = '--sheet-font-scale'
const CSC_FONT_SCALE_VAR = '--sheet-tcm-csc-font-scale'
const storageKey = (domain?: string) => domain === 'tcm-csc' ? `${FONT_SIZE_STORAGE_KEY}:tcm-csc` : FONT_SIZE_STORAGE_KEY

export function normalizeBaseFontSize(value: number): number {
  return Math.min(MAX_BASE_FONT_SIZE, Math.max(MIN_BASE_FONT_SIZE, Math.round(value)))
}

export function readBaseFontSize(domain?: string): number {
  const fallback = domain === 'tcm-csc' ? DEFAULT_CSC_FONT_SIZE : DEFAULT_BASE_FONT_SIZE
  try {
    const stored = window.localStorage.getItem(storageKey(domain))
    if (stored === null) return fallback
    const value = Number(stored)
    if (Number.isInteger(value)) return normalizeBaseFontSize(value)
    return fallback
  } catch (error) {
    console.warn('Impossible de lire la taille de police enregistrée.', error)
    return fallback
  }
}

export function applyBaseFontSize(value: number, persist = true, domain?: string): number {
  const size = normalizeBaseFontSize(value)
  const root = document.documentElement.style
  root.setProperty(domain === 'tcm-csc' ? CSC_FONT_SCALE_VAR : SHEET_FONT_SCALE_VAR, String(size / DEFAULT_BASE_FONT_SIZE))
  // Ancienne échelle globale : ne plus toucher l’UI hors fiche.
  root.removeProperty('--app-font-scale')
  if (persist) {
    try {
      window.localStorage.setItem(storageKey(domain), String(size))
    } catch (error) {
      console.warn('Impossible d’enregistrer la taille de police.', error)
    }
  }
  return size
}

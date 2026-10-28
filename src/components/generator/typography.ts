export const FONT_SIZE_STORAGE_KEY = 'clairfle-base-font-size'
export const DEFAULT_BASE_FONT_SIZE = 16
export const MIN_BASE_FONT_SIZE = 16
export const MAX_BASE_FONT_SIZE = 24
/** Variable CSS : échelle du texte des feuilles imprimables uniquement. */
export const SHEET_FONT_SCALE_VAR = '--sheet-font-scale'

export function normalizeBaseFontSize(value: number): number {
  return Math.min(MAX_BASE_FONT_SIZE, Math.max(MIN_BASE_FONT_SIZE, Math.round(value)))
}

export function readBaseFontSize(): number {
  try {
    const stored = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY)
    if (stored === null) return DEFAULT_BASE_FONT_SIZE
    const value = Number(stored)
    if (Number.isInteger(value)) return normalizeBaseFontSize(value)
    return DEFAULT_BASE_FONT_SIZE
  } catch (error) {
    console.warn('Impossible de lire la taille de police enregistrée.', error)
    return DEFAULT_BASE_FONT_SIZE
  }
}

export function applyBaseFontSize(value: number, persist = true): number {
  const size = normalizeBaseFontSize(value)
  const root = document.documentElement.style
  root.setProperty(SHEET_FONT_SCALE_VAR, String(size / DEFAULT_BASE_FONT_SIZE))
  // Ancienne échelle globale : ne plus toucher l’UI hors fiche.
  root.removeProperty('--app-font-scale')
  if (persist) {
    try {
      window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(size))
    } catch (error) {
      console.warn('Impossible d’enregistrer la taille de police.', error)
    }
  }
  return size
}

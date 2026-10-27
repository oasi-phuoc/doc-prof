export const FONT_SIZE_STORAGE_KEY = 'clairfle-base-font-size'
export const DEFAULT_BASE_FONT_SIZE = 16
export const MIN_BASE_FONT_SIZE = 12
export const MAX_BASE_FONT_SIZE = 20

export function normalizeBaseFontSize(value: number): number {
  return Math.min(MAX_BASE_FONT_SIZE, Math.max(MIN_BASE_FONT_SIZE, Math.round(value)))
}

export function readBaseFontSize(): number {
  try {
    const stored = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY)
    if (stored === null) return DEFAULT_BASE_FONT_SIZE
    const value = Number(stored)
    if (Number.isInteger(value) && value >= MIN_BASE_FONT_SIZE && value <= MAX_BASE_FONT_SIZE) {
      return value
    }
    return DEFAULT_BASE_FONT_SIZE
  } catch (error) {
    console.warn('Impossible de lire la taille de police enregistrée.', error)
    return DEFAULT_BASE_FONT_SIZE
  }
}

export function applyBaseFontSize(value: number, persist = true): number {
  const size = normalizeBaseFontSize(value)
  document.documentElement.style.setProperty(
    '--app-font-scale',
    String(size / DEFAULT_BASE_FONT_SIZE),
  )
  if (persist) {
    try {
      window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(size))
    } catch (error) {
      console.warn('Impossible d’enregistrer la taille de police.', error)
    }
  }
  return size
}

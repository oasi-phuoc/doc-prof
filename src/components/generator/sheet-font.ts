import { isSheetFontId, type SheetFontId } from '@/typography/font-ids'
import { textFontFamily } from '@/typography/font-families'

const FONT_FAMILY_STORAGE_KEY = 'clairfle-sheet-font'

export function readSheetFont(): SheetFontId {
  try {
    const value = window.localStorage.getItem(FONT_FAMILY_STORAGE_KEY)
    return isSheetFontId(value) ? value : 'arial'
  } catch { return 'arial' }
}

export function applySheetFont(font: SheetFontId, persist = true): SheetFontId {
  const value = isSheetFontId(font) ? font : 'arial'
  document.documentElement.style.setProperty('--sheet-font-family', textFontFamily(value))
  if (persist) {
    try { window.localStorage.setItem(FONT_FAMILY_STORAGE_KEY, value) } catch { /* Local preference remains optional. */ }
  }
  return value
}

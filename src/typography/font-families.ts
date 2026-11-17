export type SheetFontId = 'arial' | 'gothic'
export type CeTextFontId = SheetFontId | 'marelle' | 'playwrite'

export const SHEET_FONTS = [
  { id: 'arial', label: 'Classique (proche d’Arial)', family: "'DM Sans', Arial, sans-serif" },
  { id: 'gothic', label: 'Géométrique (proche de Century Gothic)', family: "'Didact Gothic', 'Century Gothic', sans-serif" },
] as const

export const CE_TEXT_FONTS = [
  ...SHEET_FONTS,
  { id: 'marelle', label: 'Marelle — cursive', family: "'Calli Marelle', cursive" },
  { id: 'playwrite', label: 'Playwrite — cursive', family: "'Calli Playwrite', cursive" },
] as const

export function textFontFamily(id: CeTextFontId = 'arial'): string {
  return CE_TEXT_FONTS.find(font => font.id === id)?.family ?? SHEET_FONTS[0].family
}

export function isSheetFontId(value: unknown): value is SheetFontId {
  return value === 'arial' || value === 'gothic'
}

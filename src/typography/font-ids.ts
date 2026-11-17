export type SheetFontId = 'arial' | 'gothic'
export type CeTextFontId = SheetFontId | 'marelle' | 'playwrite'

export function isSheetFontId(value: unknown): value is SheetFontId {
  return value === 'arial' || value === 'gothic'
}

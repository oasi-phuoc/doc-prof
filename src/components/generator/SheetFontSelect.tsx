import './font-controls.css'
import { SHEET_FONTS, type SheetFontId } from '@/typography/font-families'

export function SheetFontSelect({ value, onChange }: { value: SheetFontId; onChange: (font: SheetFontId) => void }) {
  return <label className="settings-sheet-font">Police de la fiche
    <select aria-label="Police de la fiche" value={value} onChange={event => onChange(event.target.value as SheetFontId)}>
      {SHEET_FONTS.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}
    </select>
  </label>
}

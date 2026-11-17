import { CE_TEXT_FONTS, type CeTextFontId } from '@/typography/font-families'

export function TcfCeTextFontControl({ value, onChange }: { value: CeTextFontId; onChange: (font: CeTextFontId) => void }) {
  return <label className="tcf-field"><span>Police du texte CE</span>
    <select className="pill-input" aria-label="Police du texte CE" value={value} onChange={event => onChange(event.target.value as CeTextFontId)}>
      {CE_TEXT_FONTS.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}
    </select>
    <small>Modifie le document au format Texte. Le titre de l’exercice et les questions gardent la police de la fiche.</small>
  </label>
}

export function TcfCeFormatControl({ value, onChange }: {
  value: 'texte' | 'image'
  onChange: (format: 'texte' | 'image') => void
}) {
  return (
    <div className="mode-toggle-block">
      <b>Format du document</b>
      <div className="mode-toggle" role="group" aria-label="Format du document de compréhension écrite">
        {(['texte', 'image'] as const).map((format) => (
          <button key={format} type="button" className={value === format ? 'active' : ''} aria-pressed={value === format} onClick={() => onChange(format)}>
            {format === 'texte' ? 'Texte' : 'Image'}
          </button>
        ))}
      </div>
      <small>Image : affiche, message, lettre ou autre document adapté au texte. Si son image n’est pas encore disponible, le texte est conservé.</small>
      {value === 'image' ? <small>Le document s’adapte à la largeur de la page portrait ; les questions suivent sous l’image. Le bouton « Page » permet de les déplacer sur une nouvelle page.</small> : null}
    </div>
  )
}

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

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
      <small>Image : le texte est accompagné d’illustrations.</small>
    </div>
  )
}

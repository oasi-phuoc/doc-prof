import { PHRASE_OPTIONAL_CATEGORIES, type PhraseCategories } from '@/francais/phrase-themes'

export function PhraseCategoryControls({ value, onChange }: {
  value?: PhraseCategories
  onChange: (value: PhraseCategories) => void
}) {
  return (
    <div className="mode-toggle-block" role="group" aria-label="Catégories autorisées">
      <b>Catégories autorisées</b>
      {PHRASE_OPTIONAL_CATEGORIES.map(({ category, label }) => (
        <div className="mode-toggle-block" key={category}>
          <b>{label}</b>
          <div className="mode-toggle" role="group" aria-label={label}>
            {[true, false].map(allowed => (
              <button
                key={String(allowed)}
                type="button"
                className={(value?.[category] !== false) === allowed ? 'active' : ''}
                aria-pressed={(value?.[category] !== false) === allowed}
                onClick={() => onChange({ ...value, [category]: allowed })}
              >
                {allowed ? 'Avec' : 'Sans'}
              </button>
            ))}
          </div>
        </div>
      ))}
      <small>« Avec » autorise la catégorie selon le thème. « Sans » l’exclut. La négation ne… pas reste disponible.</small>
      <small>Sans la catégorie du thème, des phrases simples sont proposées.</small>
    </div>
  )
}

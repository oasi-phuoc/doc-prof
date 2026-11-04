import type { PhrasePolarity } from '@/francais/phrase-themes'

export function PhrasePolarityControl({ value, onChange }: {
  value: PhrasePolarity
  onChange: (value: PhrasePolarity) => void
}) {
  return (
    <div className="mode-toggle-block">
      <b>Forme des phrases</b>
      <div className="mode-toggle is-3" role="group" aria-label="Forme des phrases">
        {(['positive', 'negative', 'mixed'] as const).map(mode => (
          <button
            key={mode}
            type="button"
            className={value === mode ? 'active' : ''}
            aria-pressed={value === mode}
            onClick={() => onChange(mode)}
          >
            {mode === 'positive' ? 'Positive' : mode === 'negative' ? 'Négative' : 'Mixte'}
          </button>
        ))}
      </div>
    </div>
  )
}

import type { PhrasePolarity } from '@/francais/phrase-themes'

export function PhrasePolarityControl({ value, onChange, canSelect }: {
  value: PhrasePolarity
  onChange: (value: PhrasePolarity) => void
  canSelect?: (value: PhrasePolarity) => boolean
}) {
  return (
    <div className="mode-toggle-block">
      <b>Forme des phrases</b>
      <div className="mode-toggle is-3 phrase-polarity-toggle" role="group" aria-label="Forme des phrases">
        {(['positive', 'negative', 'mixed'] as const).map(mode => (
          <button
            key={mode}
            type="button"
            className={value === mode ? 'active' : ''}
            aria-pressed={value === mode}
            disabled={canSelect?.(mode) === false}
            onClick={() => onChange(mode)}
          >
            {mode === 'positive' ? 'Positive' : mode === 'negative' ? 'Négative' : 'Mixte'}
          </button>
        ))}
      </div>
    </div>
  )
}

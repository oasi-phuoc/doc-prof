import { PHRASE_CATEGORY_LABELS, PHRASE_IMAGE_LABEL_CATEGORIES } from '@/francais/phrase-banks'
import type { PhraseCategory } from '@/math/types'

export function PhraseImageLabelControls({ labels, shown, onLabels, onShown }: {
  labels?: boolean
  shown?: readonly PhraseCategory[]
  onLabels: (value: boolean) => void
  onShown: (value: PhraseCategory[] | undefined) => void
}) {
  const on = labels === true
  const selected = new Set(shown ?? PHRASE_IMAGE_LABEL_CATEGORIES)
  return (
    <div className="mode-toggle-block">
      <b>Mots sous les images</b>
      <div className="mode-toggle" role="group" aria-label="Mots sous les images">
        <button type="button" className={!on ? 'active' : ''} aria-pressed={!on} onClick={() => onLabels(false)}>Sans les mots</button>
        <button type="button" className={on ? 'active' : ''} aria-pressed={on} onClick={() => onLabels(true)}>Avec les mots</button>
      </div>
      {on && (
        <div className="phrase-image-word-choices" role="group" aria-label="Natures de mots affichées">
          {PHRASE_IMAGE_LABEL_CATEGORIES.map(category => (
            <label className="phrase-image-label-option" key={category}>
              <input
                type="checkbox"
                checked={selected.has(category)}
                onChange={event => {
                  const next = new Set(selected)
                  if (event.target.checked) next.add(category)
                  else next.delete(category)
                  const list = PHRASE_IMAGE_LABEL_CATEGORIES.filter(item => next.has(item))
                  onShown(list.length === PHRASE_IMAGE_LABEL_CATEGORIES.length ? undefined : list)
                }}
              />
              <span>{PHRASE_CATEGORY_LABELS[category]}</span>
            </label>
          ))}
          <small>Cochez les natures à afficher. Les autres restent masquées.</small>
        </div>
      )}
    </div>
  )
}

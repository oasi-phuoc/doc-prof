import type { NumberSequence } from '../domain/types'
import './NumberSequenceView.css'

/** Missing terms stay hidden, including during correction. The answer cards reveal the key. */
export function NumberSequenceView({ sequence }: { sequence: NumberSequence }) {
  return <div className="ci-number-sequence">
    <ol aria-label="Suite de nombres">
      {sequence.terms.map((term, position) => <li key={position} className={position === sequence.target ? 'ci-number-target' : undefined} aria-current={position === sequence.target ? 'step' : undefined} aria-label={`Position ${position + 1} : ${term ?? (position === sequence.target ? 'nombre à trouver' : 'case vide')}`}>
        <small aria-hidden="true">{position + 1}</small>
        <b aria-hidden="true">{term ?? '□'}</b>
      </li>)}
    </ol>
    {sequence.hint && <p className="ci-number-hint">{sequence.hint}</p>}
  </div>
}

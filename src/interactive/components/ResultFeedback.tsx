import type { CSSProperties } from 'react'
import { Mascot } from './Mascot'

/** Decorative, finite animation. The verdict always remains readable as text. */
export function ResultFeedback({ correct }: { correct: boolean }) {
  return (
    <div className={`ci-result-portrait ${correct ? 'ci-result-correct' : 'ci-result-incorrect'}`} aria-hidden="true">
      <Mascot pose={correct ? 'correct' : 'incorrect'} label={correct ? 'Félicitations !' : 'Réponse fausse'} className="ci-result-face" />
      {correct ? (
        <div className="ci-confetti">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ '--i': i, '--x': `${Math.sin(i * 2.4) * 115}px`, '--y': `${-35 - (i % 5) * 24}px`, '--spin': `${(i % 2 ? 1 : -1) * (180 + i * 33)}deg`, '--confetti': ['#ffe27b', '#a6d7bc', '#c2b2ee', '#f7a1b9', '#91c5ee'][i % 5] } as CSSProperties} />
          ))}
        </div>
      ) : <div className="ci-tears"><i /><i /><i /><i /></div>}
    </div>
  )
}

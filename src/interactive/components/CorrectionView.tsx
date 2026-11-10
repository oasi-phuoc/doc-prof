import type { CSSProperties } from 'react'
import type { Correction, Question } from '../domain/types'
import { PALETTE, inkForColor, type ShapeId } from '../domain/palette'
import { CardBadge } from './CardBadge'
import { SafeImage } from './Media'
import { ResultFeedback } from './ResultFeedback'

/** Mounted only after the teacher reveals. Every proposed answer stays visible. */
export function CorrectionView({
  question,
  correction,
  selected,
  colors,
  shapes,
  offset,
  onAssess,
  assessment,
  placement = 'model',
  number,
  collective = false,
}: {
  collective?: boolean
  question: Question
  correction: Correction
  selected?: string
  colors: string[]
  shapes: ShapeId[]
  offset: number
  onAssess: (value: 'acquired' | 'retry') => void
  assessment?: 'acquired' | 'retry'
  placement?: 'left' | 'right' | 'model'
  number?: number
}) {
  const correct = question.choices.find(
    (choice) => choice.id === correction.choiceId,
  )
  if (question.mode === 'choice') {
    if (!correct) return null
    const isCorrect = correct.id === selected
    const slot = offset + question.choices.indexOf(correct)
    if (placement === 'left')
      return isCorrect ? null : (
        <div
          className="ci-margin-answer"
          style={
            {
              '--card-color': colors[slot],
              '--card-ink': inkForColor(colors[slot]!),
            } as CSSProperties
          }
        >
          <b>{number !== undefined ? `${number}. ` : ''}Bonne réponse</b>
          <div className="ci-correction-card">
            <CardBadge letter={PALETTE[slot]!.letter} shape={shapes[slot]!} />
            <div className="ci-correction-answer">
              {correct.image && (
                <SafeImage
                  key={correct.image}
                  src={correct.image}
                  alt={`Bonne réponse, carte ${PALETTE[slot]!.letter}`}
                />
              )}
              {correct.text && <p>{correct.text}</p>}
            </div>
          </div>
        </div>
      )
    if (placement === 'right')
      return collective ? null : (
        <div
          className="ci-correction-status"
          role="status"
          aria-label={`${number !== undefined ? `Question ${number} : ` : ''}${isCorrect ? 'Réponse correcte' : 'Réponse incorrecte'}`}
        >
          {number !== undefined && (
            <b className="ci-result-number">{number}.</b>
          )}
          <ResultFeedback correct={isCorrect} />
          <b>{isCorrect ? 'Félicitations, c’est juste !' : selected ? 'Faux · essaie encore' : 'Temps écoulé'}</b>
        </div>
      )
    return correction.text && correction.text !== correct.text ? (
      <p className="ci-explanation">{correction.text}</p>
    ) : null
  }
  if (placement !== 'model') return null
  return (
    <div className="ci-model-answer">
      <p>
        <b>Exemple de réponse</b>
      </p>
      <p>{correction.text}</p>
      <p>
        D’autres réponses peuvent convenir. L’enseignant apprécie la production.
      </p>
      <div className="ci-toolbar">
        <button
          aria-pressed={assessment === 'acquired'}
          onClick={() => onAssess('acquired')}
        >
          Acquis
        </button>
        <button
          aria-pressed={assessment === 'retry'}
          onClick={() => onAssess('retry')}
        >
          À retravailler
        </button>
      </div>
    </div>
  )
}

import type { CSSProperties } from 'react'
import type { Correction, Question } from '../domain/types'
import { PALETTE, inkForColor, type ShapeId } from '../domain/palette'
import { CardBadge } from './CardBadge'
import { SafeImage } from './Media'
import { Icon } from './Icons'

/** Only mounted after the teacher's reveal action. Vote components never receive a correction. */
export function CorrectionView({
  question,
  correction,
  selected,
  colors,
  shapes,
  offset,
  onAssess,
  assessment,
}: {
  question: Question
  correction: Correction
  selected?: string
  colors: string[]
  shapes: ShapeId[]
  offset: number
  onAssess: (value: 'acquired' | 'retry') => void
  assessment?: 'acquired' | 'retry'
}) {
  const [correct, chosen] = [correction.choiceId, selected].map((id) =>
    question.choices.find((c) => c.id === id),
  )
  const slot =
    offset +
    question.choices.findIndex((choice) => choice.id === correction.choiceId)
  const isCorrect = !!correct && correct.id === selected
  return (
    <section
      className="ci-reveal"
      aria-label={`Correction : ${question.prompt}`}
      aria-live="polite"
    >
      <h2>{question.prompt}</h2>
      {correct ? (
        <div className="ci-correction-row">
          <div
            className="ci-correction-card"
            style={
              {
                '--card-color': colors[slot],
                '--card-ink': inkForColor(colors[slot]!),
              } as CSSProperties
            }
          >
            <div className="ci-correction-band">
              <span>Bonne réponse</span>
              <CardBadge letter={PALETTE[slot]!.letter} shape={shapes[slot]!} />
            </div>
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
          <div className="ci-correction-status">
            <Icon name={isCorrect ? 'check' : 'wrong'} />
            <b>{isCorrect ? 'Réponse correcte' : 'À retravailler'}</b>
            {!isCorrect && chosen && (
              <div className="ci-selected-response">
                <span>Réponse au tableau</span>
                {chosen.image && (
                  <SafeImage
                    key={chosen.image}
                    src={chosen.image}
                    alt="Réponse choisie au tableau"
                  />
                )}
                {chosen.text && <p>{chosen.text}</p>}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="ci-model-answer">
          <p>
            <b>Exemple de réponse</b>
          </p>
          <p>{correction.text}</p>
          <p>
            D’autres réponses peuvent convenir. L’enseignant apprécie la
            production.
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
      )}
      {correct && correction.text && correction.text !== correct.text && (
        <p className="ci-explanation">{correction.text}</p>
      )}
    </section>
  )
}

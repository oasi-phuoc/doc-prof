import { useState, type CSSProperties } from 'react'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import { PALETTE, inkForColor } from '../domain/palette'
import type { Phase, Question } from '../domain/types'
import { AudioPlayer, SafeImage } from './Media'

/** Only public question data enters this projection component. */
export function QuestionStage({
  q,
  phase,
  selected,
  colors,
  onSelect,
}: {
  q: Question
  phase: Phase
  selected?: string
  colors: string[]
  onSelect: (id: string) => void
}) {
  const phaseLabels = {
    thinking: 'Je réfléchis',
    'cards-up': 'Levez vos cartes',
    selected: 'Un choix au tableau',
    discussion: 'Discutons de la réponse',
    revealed: 'La correction',
  }
  return (
    <>
      <section className="ci-question">
        <p className="ci-phase" role="status">
          {phaseLabels[phase]}
        </p>
        <h1>{q.prompt}</h1>
        {q.context && (
          <details className="ci-context">
            <summary>Lire le document</summary>
            <p>{q.context}</p>
          </details>
        )}
        {q.mode === 'sequence' && (
          <details className="ci-full-instruction">
            <summary>Consigne complète</summary>
            <p>{q.instruction}</p>
          </details>
        )}
        {q.audio && <AudioPlayer key={q.audio} src={q.audio} />}
        {q.figure && (
          <div className="ci-figure">
            <GeometryFigure type={q.figure.type} dims={q.figure.dims} />
          </div>
        )}
        {q.mode !== 'sequence' && !!q.images.length && (
          <div className="ci-stimulus-images">
            {q.images.map((image, i) => (
              <SafeImage key={image} src={image} alt={`Document ${i + 1}`} />
            ))}
          </div>
        )}
      </section>
      {q.mode === 'choice' ? (
        <div
          className={`ci-answer-grid ci-count-${q.choices.length}`}
          aria-label="Choix de réponse"
        >
          {q.choices.map((choice, i) => {
            const palette = PALETTE[i]!
            const chosen = selected === choice.id
            return (
              <button
                key={choice.id}
                className={`ci-answer${chosen ? ' ci-chosen' : ''}`}
                style={
                  {
                    '--card-color': colors[i],
                    '--card-ink': inkForColor(colors[i]!),
                  } as CSSProperties
                }
                disabled={phase !== 'cards-up' && phase !== 'selected'}
                aria-pressed={chosen}
                onClick={() => onSelect(choice.id)}
              >
                <span className="ci-answer-badge">
                  <b>{palette.letter}</b>
                  <span aria-label={palette.shape}>{palette.symbol}</span>
                </span>
                <span className="ci-answer-content">
                  {choice.image && (
                    <SafeImage
                      src={choice.image}
                      alt={`Choix ${palette.letter}`}
                    />
                  )}
                  {choice.text && <span>{choice.text}</span>}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <section className="ci-manual">
          {q.mode === 'sequence' ? (
            <Sequence key={q.id} question={q} />
          ) : (
            <p>
              Échange oral ou production libre. L’enseignant guide l’activité et
              apprécie la réponse.
            </p>
          )}
        </section>
      )}
    </>
  )
}

function Sequence({ question }: { question: Question }) {
  const [images, setImages] = useState(
    question.images.map((src, index) => ({ src, index })),
  )
  const move = (position: number, delta: number) =>
    setImages((current) => {
      const next = [...current]
      const target = position + delta
      if (target < 0 || target >= next.length) return current
      ;[next[position], next[target]] = [next[target]!, next[position]!]
      return next
    })
  return (
    <>
      <p>
        Racontez l’histoire. Vous pouvez déplacer les images pour expliquer
        votre proposition.
      </p>
      <div className="ci-sequence">
        {images.map((image, i) => (
          <div key={image.index}>
            <SafeImage src={image.src} alt={`Scène ${image.index + 1}`} />
            <div className="ci-toolbar">
              <button
                aria-label={`Déplacer la scène ${image.index + 1} à gauche`}
                disabled={!i}
                onClick={() => move(i, -1)}
              >
                ←
              </button>
              <span>{i + 1}</span>
              <button
                aria-label={`Déplacer la scène ${image.index + 1} à droite`}
                disabled={i === images.length - 1}
                onClick={() => move(i, 1)}
              >
                →
              </button>
            </div>
          </div>
        ))}
      </div>
      <p>Aucune note automatique pour cette activité orale.</p>
    </>
  )
}

import { useId, useState, type CSSProperties } from 'react'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import {
  PALETTE,
  defaultShapes,
  inkForColor,
  type ShapeId,
} from '../domain/palette'
import type { Phase, Question } from '../domain/types'
import { SafeImage } from './Media'
import { CardBadge } from './CardBadge'
import { IconButton } from './Icons'
import { Icon } from './Icons'

/** Only public question data enters this projection component. */
export function QuestionStage({
  q,
  phase,
  selected,
  colors,
  shapes = defaultShapes,
  slotOffset = 0,
  correctChoiceId,
  number,
  onSelect,
  canSelect = false,
  imageOrder,
  onImageOrder,
  interactionsDisabled = false,
}: {
  canSelect?: boolean
  imageOrder?: number[]
  onImageOrder?: (order: number[]) => void
  interactionsDisabled?: boolean
  q: Question
  phase: Phase
  selected?: string
  colors: string[]
  shapes?: ShapeId[]
  slotOffset?: number
  correctChoiceId?: string
  number?: number
  onSelect: (id: string) => void
}) {
  const showCorrection =
    phase === 'revealed' &&
    q.choices.some((entry) => entry.id === correctChoiceId)
  return (
    <>
      <section className="ci-question">
        <h1 tabIndex={-1} className={number !== undefined ? 'ci-numbered-heading' : undefined}>
          {number !== undefined && (
            <span className="ci-question-number">{number}.</span>
          )}
          <span className="ci-question-prompt">{q.prompt}</span>
        </h1>
        {q.context && <ReadingDocument text={q.context} />}
        {q.mode === 'sequence' && (
          <details className="ci-full-instruction">
            <summary>Consigne complète</summary>
            <p>{q.instruction}</p>
          </details>
        )}
        {q.figure && (
          <div className="ci-figure">
            <GeometryFigure type={q.figure.type} dims={q.figure.dims} />
          </div>
        )}
        {q.mode !== 'sequence' && !!q.images.length && (
          <div className="ci-stimulus-images">
            {q.images.map((image, i) => (
              <SafeImage
                key={image}
                src={image}
                alt={`Document ${i + 1}`}
                zoom
              />
            ))}
          </div>
        )}
      </section>
      {q.mode === 'choice' ? (
        <div
          className={`ci-answer-grid ci-count-${q.choices.length}`}
          role="group"
          aria-label="Choix de réponse"
        >
          {q.choices.map((choice, i) => {
            const slot = slotOffset + i
            const palette = PALETTE[slot]!
            const chosen = selected === choice.id
            const correctAnswer = showCorrection && choice.id === correctChoiceId
            const verdict =
              phase === 'revealed' && chosen
                ? choice.id === correctChoiceId
                  ? 'correct'
                  : 'incorrect'
                : undefined
            return (
              <button
                key={choice.id}
                className={`ci-answer${chosen ? ' ci-chosen' : ''}${verdict ? ` ci-answer-${verdict}` : ''}${showCorrection ? correctAnswer ? ' ci-answer-key' : ' ci-answer-muted' : ''}`}
                style={
                  {
                    '--card-color': colors[slot],
                    '--card-ink': inkForColor(colors[slot]!),
                  } as CSSProperties
                }
                disabled={!canSelect}
                aria-pressed={chosen}
                onClick={() => onSelect(choice.id)}
              >
                <CardBadge letter={palette.letter} shape={shapes[slot]!} />
                <span className="ci-answer-content">
                  {choice.image && (
                    <SafeImage
                      key={choice.image}
                      src={choice.image}
                      alt={`Choix ${palette.letter}`}
                      retryable={false}
                    />
                  )}
                  {choice.text && <span>{choice.text}</span>}
                </span>
                {(verdict || correctAnswer) && (
                  <span className="ci-answer-verdict">
                    <Icon name={correctAnswer ? 'check' : 'wrong'} />
                    <span className="ci-sr-only">
                      {correctAnswer
                        ? 'Bonne réponse'
                        : 'Réponse incorrecte'}
                    </span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <section className="ci-manual">
          {q.mode === 'sequence' ? (
            q.words ? <WordSequence key={q.id} words={q.words} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} /> : <Sequence key={q.id} question={q} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} />
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

function WordSequence({ words, order, onOrder, disabled }: { words: string[]; order?: number[]; onOrder?: (order: number[]) => void; disabled: boolean }) {
  const positions = order ?? words.map((_, index) => index)
  const [selected, setSelected] = useState<number | undefined>(undefined)
  const [previous, setPrevious] = useState<number[] | undefined>(undefined)
  const [announcement, setAnnouncement] = useState('')
  const help = useId()
  const update = (next: number[], message: string) => { setPrevious([...positions]); onOrder?.(next); setAnnouncement(message) }
  const choose = (index: number) => {
    if (disabled) return
    if (selected === undefined) { setSelected(index); setAnnouncement(`Mot sélectionné : ${words[index]}. Choisissez sa place.`); return }
    if (selected === index) { setSelected(undefined); return }
    const next = [...positions], from = next.indexOf(selected), to = next.indexOf(index)
    ;[next[from], next[to]] = [next[to]!, next[from]!]
    update(next, `Mot déplacé à la place ${to + 1}.`); setSelected(undefined)
  }
  const move = (index: number, delta: number) => {
    const next = [...positions], from = next.indexOf(index), to = from + delta
    if (disabled || to < 0 || to >= next.length) return
    ;[next[from], next[to]] = [next[to]!, next[from]!]
    update(next, `Mot déplacé à la place ${to + 1}.`); setSelected(undefined)
  }
  return <div className="ci-word-order">
    <p id={help}>Choisissez un mot, puis sa place. Au clavier, utilisez les flèches.</p>
    <div className="ci-word-sequence" role="group" aria-label="Mots à remettre dans l’ordre" aria-describedby={help}>{positions.map((index, position) => <button type="button" key={index} disabled={disabled} aria-label={`Mot ${position + 1} : ${words[index]}`} aria-pressed={selected === index} onClick={() => choose(index)} onKeyDown={(event) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(index, event.key === 'ArrowLeft' ? -1 : 1) } }}><small aria-hidden="true">{position + 1}</small><b>{words[index]}</b></button>)}</div>
    <button type="button" className="ci-word-undo" disabled={disabled || !previous} onClick={() => { if (previous) { onOrder?.(previous); setPrevious(undefined); setSelected(undefined); setAnnouncement('Dernier déplacement annulé.') } }}>Annuler le déplacement</button>
    <span className="ci-sr-only" role="status">{announcement}</span>
  </div>
}

function Sequence({ question, order, onOrder, disabled }: { question: Question; order?: number[]; onOrder?: (order: number[]) => void; disabled: boolean }) {
  const images = (order ?? question.images.map((_, index) => index)).map((index) => ({ src: question.images[index]!, index }))
  const move = (position: number, delta: number) => {
      const next = images.map((image) => image.index)
      const target = position + delta
      if (disabled || target < 0 || target >= next.length) return
      ;[next[position], next[target]] = [next[target]!, next[position]!]
      onOrder?.(next)
  }
  return (
    <>
      <p>
        Racontez l’histoire. Vous pouvez déplacer les images pour expliquer
        votre proposition.
      </p>
      <div className="ci-sequence">
        {images.map((image, i) => (
          <div key={image.index}>
            <SafeImage src={image.src} alt={`Scène ${image.index + 1}`} zoom />
            <div className="ci-toolbar">
              <button
                aria-label={`Déplacer la scène ${image.index + 1} à gauche`}
                disabled={disabled || !i}
                onClick={() => move(i, -1)}
              >
                ←
              </button>
              <span>{i + 1}</span>
              <button
                aria-label={`Déplacer la scène ${image.index + 1} à droite`}
                disabled={disabled || i === images.length - 1}
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

function ReadingDocument({ text }: { text: string }) {
  const [size, setSize] = useState(24)
  return (
    <section className="ci-context" aria-label="Document à lire">
      <div className="ci-document-toolbar">
        <span>Document à lire</span>
        <div className="ci-toolbar">
          <IconButton
            icon="minus"
            label="Réduire le texte du document"
            disabled={size <= 18}
            onClick={() => setSize((s) => s - 2)}
          />
          <output aria-label="Taille du texte">{size}</output>
          <IconButton
            icon="plus"
            label="Agrandir le texte du document"
            disabled={size >= 40}
            onClick={() => setSize((s) => s + 2)}
          />
        </div>
      </div>
      <p style={{ fontSize: `${size}px` }}>{text}</p>
    </section>
  )
}

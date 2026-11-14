import { useState, type CSSProperties } from 'react'
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
import { TextReadingDialog } from './TextReadingDialog'
import { NumberSequenceView } from './NumberSequenceView'
import { WordClassificationView } from './WordClassificationView'
import { ImageSequence } from './ImageSequence'
import { WordSequence } from './WordSequence'
import {PhraseImageRow} from '@/components/math/PhraseImageRow'
import './guided-oral.css'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'
import { useReadableQuestion } from '../layout/useReadableQuestion'
import '../layout/readability.css'

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
  unavailableChoiceIds = [],
}: {
  canSelect?: boolean
  imageOrder?: number[]
  onImageOrder?: (order: number[]) => void
  interactionsDisabled?: boolean
  unavailableChoiceIds?: string[]
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
  const { section, report } = useReadableQuestion(JSON.stringify([q.id, q.prompt, q.context, q.oralSituation, q.numberSequence, q.wordClassification, q.phraseImages, q.phraseImageLabels, q.phraseImagePrefix, q.choices, q.images, q.grammarImages, q.matchingGroup, unavailableChoiceIds, imageOrder, phase, number]))
  const [reading, setReading] = useState<number | 'question' | null>(null)
  const showCorrection =
    phase === 'revealed' &&
    q.choices.some((entry) => entry.id === correctChoiceId)
  const picturePair=q.mode==='choice'&&q.images.length===1&&q.choices.length>0&&q.choices.every(choice=>!choice.image)&&!q.context&&!q.figure
  const availableWords=q.choices.length-unavailableChoiceIds.length
  return (
    <>
      <section ref={section} className={`ci-question${picturePair?' ci-picture-pair':''}${q.matchingGroup?' ci-matching-question':''}`}>
        <div className="ci-question-body" tabIndex={report.questionScroll ? 0 : undefined} role={report.questionScroll ? 'region' : undefined} aria-label={report.questionScroll ? 'Question et document à faire défiler' : undefined}>
        <h1 tabIndex={-1} className={number !== undefined ? 'ci-numbered-heading' : undefined}>
          {number !== undefined && (
            <span className="ci-question-number">{number}.</span>
          )}
          <span className="ci-question-prompt">{q.prompt}</span>
        </h1>
        {q.matchingGroup && <p className="ci-matching-progress">Groupe {q.matchingGroup.number}/{q.matchingGroup.total} · {availableWords} {availableWords>1?'mots disponibles':'mot disponible'}<span className="ci-sr-only">. Les mots déjà associés sont grisés et indisponibles.</span></p>}
        {q.context && (q.figure && q.context.length <= 240
          ? <section className="ci-context ci-figure-context" aria-label="Mesures de la figure"><p>{q.context}</p></section>
          : <ReadingDocument text={q.context} />)}
        {q.numberSequence && <NumberSequenceView sequence={q.numberSequence} />}
        {q.wordClassification && <WordClassificationView classification={q.wordClassification} />}
        <GrammarImageSupports supports={q.grammarImages} zoom/>
        {q.oralSituation && <details className="ci-oral-situation"><summary>Situation et consigne</summary><p>{q.instruction}</p><p>{q.oralSituation}</p></details>}
        {(q.mode === 'sequence'||!!q.phraseImages) && !q.oralSituation && (
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
        {q.mode !== 'sequence' && q.mode !== 'oral' && !!q.images.length && (
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
        </div>
        {report.questionScroll && <button className="ci-read-more" onClick={() => setReading('question')}>Suite ▾ <span className="ci-sr-only">Lire la question et le document</span></button>}
      </section>
      {q.mode === 'choice' ? (
        <div
          className={`ci-answer-grid ci-count-${q.choices.length}`}
          role="group"
          aria-label={report.answersScroll ? 'Choix de réponse, faites défiler pour la suite' : 'Choix de réponse'}
          tabIndex={report.answersScroll ? 0 : undefined}
        >
          {q.choices.map((choice, i) => {
            const slot = slotOffset + i
            const palette = PALETTE[slot]!
            const chosen = selected === choice.id
            const used = unavailableChoiceIds.includes(choice.id)
            const correctAnswer = showCorrection && choice.id === correctChoiceId
            const verdict =
              phase === 'revealed' && chosen
                ? choice.id === correctChoiceId
                  ? 'correct'
                  : 'incorrect'
                : undefined
            return (
              <div key={choice.id} className="ci-answer-wrap">
              <button
                className={`ci-answer${chosen ? ' ci-chosen' : ''}${used ? ' ci-answer-used' : ''}${verdict ? ` ci-answer-${verdict}` : ''}${showCorrection ? correctAnswer ? ' ci-answer-key' : ' ci-answer-muted' : ''}`}
                style={
                  {
                    '--card-color': colors[slot],
                    '--card-ink': inkForColor(colors[slot]!),
                  } as CSSProperties
                }
                disabled={!canSelect || used}
                aria-label={used ? `${palette.letter}. ${choice.text} · déjà associé` : undefined}
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
              {report.answersScroll && <button className="ci-read-more" aria-label={`Lire la proposition ${palette.letter} en entier`} onClick={() => setReading(i)}>Suite ▾</button>}
              </div>
            )
          })}
        </div>
      ) : (
        <section className="ci-manual" tabIndex={report.manualScroll ? 0 : undefined} aria-label={report.manualScroll ? 'Activité à faire défiler' : undefined}>
          {q.phraseImages ? <>{q.phraseImagePrefix&&<p>{q.phraseImagePrefix}</p>}<PhraseImageRow clues={q.phraseImages} labels={q.phraseImageLabels} renderImage={clue=><SafeImage src={clue.imageSrc!} alt={clue.label} zoom/>}/></> : q.mode === 'sequence' ? (
            q.words ? <WordSequence key={q.id} words={q.words} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} /> : <ImageSequence key={q.id} images={q.images} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} />
          ) : q.mode==='oral'&&q.images.length ? (
            <div className={`ci-oral-gallery ci-oral-images-${q.images.length}`} role="group" aria-label="Images de la situation orale">{q.images.map((image,index)=><SafeImage key={`${index}:${image}`} src={image} alt={`Document ${index+1}`} zoom/>)}</div>
          ) : (
            <p>
              Échange oral ou production libre. L’enseignant guide l’activité et
              apprécie la réponse.
            </p>
          )}
        </section>
      )}
      {report.manualScroll && <button className="ci-read-more" onClick={() => setReading('question')}>Suite ▾ <span className="ci-sr-only">Lire la consigne complète</span></button>}
      {reading !== null && <TextReadingDialog title={reading === 'question' ? 'Question et document' : `Proposition ${PALETTE[slotOffset + reading]!.letter}`} text={reading === 'question' ? [q.prompt, q.context, q.oralSituation, q.phraseImagePrefix, q.phraseImages?.map(clue=>clue.label).join(' · '), q.mode === 'choice' ? '' : q.instruction].filter(Boolean).join('\n\n') : q.choices[reading]?.text ?? ''} images={reading === 'question' ? q.images : q.choices[reading]?.image ? [q.choices[reading]!.image!] : []} grammarImages={reading==='question'?q.grammarImages:undefined} figure={reading === 'question' ? q.figure : undefined} numberSequence={reading === 'question' ? q.numberSequence : undefined} wordClassification={reading === 'question' ? q.wordClassification : undefined} onClose={() => setReading(null)} />}
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

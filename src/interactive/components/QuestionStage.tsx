import { useState, type ReactNode, type CSSProperties } from 'react'
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
import {useWordDrop} from './useWordDrop'
import {WordBlankPrompt} from './WordBlankPrompt'
import {playPrompt} from '../domain/presentation'
import {SequenceDragGhost} from './SequenceDragGhost'
import {WordSortingBoard} from './WordSortingBoard'
import {sortingSentence} from '../domain/word-sorting'
import {PhraseImageRow} from '@/components/math/PhraseImageRow'
import './guided-oral.css'
import { GrammarImageSupports } from '@/components/grammar/GrammarImageSupports'
import { GrammarCountryPrompt } from '@/components/grammar/GrammarCountryPrompt'
import { FractionText } from './FractionText'
import { FractionFigureView } from './FractionFigureView'
import { isFractionQuestion } from '../domain/fraction-notation'
import { useReadableQuestion } from '../layout/useReadableQuestion'
import '../layout/readability.css'
import type {ImageAnnotationControls} from './ImageAnnotationEditor'

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
  wordPlacements,
  onWordPlacements,
  sortingTargets,
  wordDrop,
  onWordDrop,
  attempt=0,
  interactionsDisabled = false,
  unavailableChoiceIds = [],
  imageAnnotations,
  memoryContent,
  lotoContent,
}: {
  lotoContent?:ReactNode
  memoryContent?:ReactNode
  canSelect?: boolean
  imageOrder?: number[]
  onImageOrder?: (order: number[]) => void
  wordPlacements?: (string|null)[]
  onWordPlacements?: (placements:(string|null)[])=>void
  sortingTargets?: string[]
  wordDrop?: string
  onWordDrop?: (choiceId:string|null)=>void
  attempt?: number
  interactionsDisabled?: boolean
  unavailableChoiceIds?: string[]
  imageAnnotations?: (index:number)=>ImageAnnotationControls|undefined
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
  const { section, report } = useReadableQuestion(JSON.stringify([q.id, q.memoryBoard, q.lotoBoard, q.prompt, q.context, q.oralSituation, q.numberSequence, q.fractionFigure, q.wordClassification, q.wordSorting, wordPlacements, q.wordBlank, wordDrop, selected, q.phraseImages, q.phraseImageLabels, q.phraseImageShownCategories, q.phraseImagePrefix, q.choices, q.images, q.grammarImages, q.matchingGroup, unavailableChoiceIds, imageOrder, phase, number]))
  const drop=useWordDrop({question:q,canSelect,disabled:interactionsDisabled||phase==='revealed',onSelect,onPropose:onWordDrop})
  const proposed=q.choices.find(choice=>choice.id===(selected??wordDrop))
  const pending=q.choices.find(choice=>choice.id===drop.pending)
  const dragged=drop.drag?q.choices[drop.drag.source]:undefined
  const [reading, setReading] = useState<number | 'question' | null>(null)
  const showCorrection =
    phase === 'revealed' &&
    q.choices.some((entry) => entry.id === correctChoiceId)
  const picturePair=q.mode==='choice'&&q.images.length===1&&q.choices.length>0&&q.choices.every(choice=>!choice.image)&&!q.context&&!q.figure&&!q.fractionFigure
  const availableWords=q.choices.length-unavailableChoiceIds.length
  const fractions = !!q.fractionFigure || isFractionQuestion(q.prompt)
  return (
    <>
      <section ref={section} className={`ci-question${q.fractionFigure?' ci-fraction-reading':''}${picturePair?' ci-picture-pair':''}${q.matchingGroup?' ci-matching-question':''}`}>
        <div className="ci-question-body" tabIndex={report.questionScroll ? 0 : undefined} role={report.questionScroll ? 'region' : undefined} aria-label={report.questionScroll ? 'Question et document à faire défiler' : undefined}>
        <h1 tabIndex={-1} className={number !== undefined ? 'ci-numbered-heading' : undefined}>
          {number !== undefined && (
            <span className="ci-question-number">{number}.</span>
          )}
          <span className="ci-question-prompt">{drop.available?<WordBlankPrompt question={q} target={drop.target} value={proposed?.text} pending={pending?.text} hover={drop.drag?.target===0?dragged?.text:undefined} disabled={drop.blocked||!pending&&!proposed} onDeposit={drop.deposit} onEscape={drop.escape}/>:fractions?<FractionText text={playPrompt(q.prompt)}/>:<GrammarCountryPrompt text={playPrompt(q.prompt)} gender={q.grammarCountryGender} exerciseType={q.source.exerciseType}/>}</span>
        </h1>
        {drop.available&&phase!=='revealed'&&<p className="ci-word-drop-help">{canSelect?'Glissez une carte, ou touchez-la.':'Glissez une carte, ou touchez-la puis le blanc.'}</p>}
        {q.matchingGroup && !q.lotoBoard && <p className="ci-matching-progress">Groupe {q.matchingGroup.number}/{q.matchingGroup.total} · {availableWords} {availableWords>1?'mots disponibles':'mot disponible'}<span className="ci-sr-only">. Les mots déjà associés sont grisés et indisponibles.</span></p>}
        {q.context && (q.figure && q.context.length <= 240
          ? <section className="ci-context ci-figure-context" aria-label="Mesures de la figure"><p>{q.context}</p></section>
          : <ReadingDocument text={q.context} />)}
        {q.numberSequence && <NumberSequenceView sequence={q.numberSequence} />}
        {q.wordClassification && <WordClassificationView classification={q.wordClassification} />}
        {q.wordSorting&&<p className="ci-sorting-sentence">{sortingSentence(q.wordSorting.sentence)}</p>}
        <GrammarImageSupports supports={q.grammarImages} zoom/>
        {q.oralSituation && <details className="ci-oral-situation"><summary>Situation et consigne</summary><p>{q.instruction}</p><p>{q.oralSituation}</p></details>}
        {(q.mode === 'sequence'||!!q.phraseImages) && !q.oralSituation && !(q.words&&q.words.length>6) && (
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
        {q.fractionFigure && <FractionFigureView figure={q.fractionFigure} />}
        {q.mode !== 'memory' && q.mode !== 'sequence' && q.mode !== 'oral' && !!q.images.length && (
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
      {q.lotoBoard?lotoContent:q.mode === 'choice' ? (
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
            const prepared=drop.available&&drop.pending===choice.id
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
                className={`ci-answer${chosen ? ' ci-chosen' : ''}${used ? ' ci-answer-used' : ''}${verdict ? ` ci-answer-${verdict}` : ''}${showCorrection ? correctAnswer ? ' ci-answer-key' : ' ci-answer-muted' : ''}${drop.available?' ci-word-drop-source':''}${prepared?' ci-word-drop-pending':''}${drop.drag?.source===i?' ci-word-drop-dragging':''}`}
                {...(drop.available?drop.pointerProps(i):{})}
                style={
                  {
                    '--card-color': colors[slot],
                    '--card-ink': inkForColor(colors[slot]!),
                  } as CSSProperties
                }
                disabled={(drop.available?drop.blocked:!canSelect) || used}
                aria-label={used ? `${palette.letter}. ${choice.text} · déjà associé` : undefined}
                aria-pressed={drop.pending!==null?prepared:chosen}
                onClick={() => drop.available?drop.choose(choice.id):onSelect(choice.id)}
                onKeyDown={drop.available?event=>{if(event.key==='Escape'){event.preventDefault();drop.escape()}}:undefined}
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
                  {choice.text && <span><FractionText text={choice.text} enabled={fractions}/></span>}
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
          {q.mode==='memory'?memoryContent:q.wordSorting?<WordSortingBoard key={`${q.id}:${attempt}`} sorting={q.wordSorting} placements={wordPlacements} onPlacements={onWordPlacements} disabled={interactionsDisabled||phase==='revealed'} targets={phase==='revealed'?sortingTargets:undefined} onRead={()=>setReading('question')}/>:q.phraseImages ? <>{q.phraseImagePrefix&&<p>{q.phraseImagePrefix}</p>}<PhraseImageRow clues={q.phraseImages} labels={q.phraseImageLabels} shown={q.phraseImageShownCategories} renderImage={clue=><SafeImage src={clue.imageSrc!} alt={clue.label} zoom/>}/></> : q.mode === 'sequence' ? (
            q.words ? <WordSequence key={q.id} words={q.words} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} review={phase==='revealed'} onRead={()=>setReading('question')}/> : <ImageSequence key={q.id} images={q.images} order={imageOrder} onOrder={onImageOrder} disabled={interactionsDisabled || phase === 'revealed'} annotations={imageAnnotations} />
          ) : q.mode==='oral'&&q.images.length ? (
            <div className={`ci-oral-gallery ci-oral-images-${q.images.length}`} role="group" aria-label="Images de la situation orale">{q.images.map((image,index)=><SafeImage key={`${index}:${image}`} src={image} alt={`Document ${index+1}`} zoom annotations={imageAnnotations?.(index)}/>)}</div>
          ) : (
            <p>
              Échange oral ou production libre. L’enseignant guide l’activité et
              apprécie la réponse.
            </p>
          )}
        </section>
      )}
      {report.manualScroll && !q.wordSorting && q.mode!=='memory' && <button className="ci-read-more" onClick={() => setReading('question')}>Suite ▾ <span className="ci-sr-only">Lire la consigne complète</span></button>}
      {drop.available&&<><span className="ci-sr-only" role="status">{drop.announcement}</span><SequenceDragGhost drag={drop.drag}>{dragged&&drop.drag&&<div className="ci-word-drop-ghost" style={{background:colors[slotOffset+drop.drag.source],color:inkForColor(colors[slotOffset+drop.drag.source]!)}}><b>{PALETTE[slotOffset+drop.drag.source]!.letter}</b><span>{dragged.text}</span></div>}</SequenceDragGhost></>}
      {reading !== null && <TextReadingDialog fractionNotation={fractions} title={reading === 'question' ? 'Question et document' : `Proposition ${PALETTE[slotOffset + reading]!.letter}`} text={reading === 'question' ? [playPrompt(q.prompt), q.context, q.oralSituation, q.wordSorting?sortingSentence(q.wordSorting.sentence):undefined, q.wordSorting?`Catégories : ${q.wordSorting.categories.map(c=>c.label).join(' · ')}`:undefined, q.phraseImagePrefix, q.phraseImages?.map(clue=>clue.label).join(' · '), q.words?`Mots à déplacer : ${(imageOrder??q.words.map((_,i)=>i)).map(i=>q.words![i]).join(' · ')}`:undefined, q.mode === 'choice' ? '' : q.instruction].filter(Boolean).join('\n\n') : q.choices[reading]?.text ?? ''} images={reading === 'question' ? q.mode==='memory'&&phase!=='revealed'?[]:q.images : q.choices[reading]?.image ? [q.choices[reading]!.image!] : []} grammarImages={reading==='question'?q.grammarImages:undefined} figure={reading === 'question' ? q.figure : undefined} fractionFigure={reading === 'question' ? q.fractionFigure : undefined} numberSequence={reading === 'question' ? q.numberSequence : undefined} wordClassification={reading === 'question' ? q.wordClassification : undefined} onClose={() => setReading(null)} />}
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

import type { MathItem, PreviewMode } from '@/math/types'
import { wordVocabImage } from '@/grammaire/exercises/word-vocab'

const visuals = import.meta.glob<string>('../../grammaire/media/word-vocab/*.webp', {
  eager: true, import: 'default', query: '?url',
})

export function GrammarWordVocab({ card, mode }: { card: NonNullable<MathItem['grammarWordVocab']>; mode: PreviewMode }) {
  const reveal = !card.recall || mode === 'answers'
  const image = card.image ?? wordVocabImage(card.id) ?? visuals[`../../grammaire/media/word-vocab/${card.id}.webp`]
  return (
    <figure className="grammar-word-vocab">
      {image && <img src={image} alt={reveal ? card.label : 'Image à nommer'} />}
      {card.clue && <p className="grammar-word-clue">{card.clue}</p>}
      <figcaption className={card.recall ? `answer-line-field${reveal ? ' filled' : ''}` : undefined}>
        {reveal ? card.label : '\u00a0'}
      </figcaption>
    </figure>
  )
}

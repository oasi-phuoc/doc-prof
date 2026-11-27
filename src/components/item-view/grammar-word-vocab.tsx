import type { MathItem, PreviewMode } from '@/math/types'

const visuals = import.meta.glob<string>('../../grammaire/media/word-vocab/*.webp', {
  eager: true, import: 'default', query: '?url',
})

export function GrammarWordVocab({ card, mode }: { card: NonNullable<MathItem['grammarWordVocab']>; mode: PreviewMode }) {
  const reveal = !card.recall || mode === 'answers'
  return (
    <figure className="grammar-word-vocab">
      <img
        src={card.image ?? visuals[`../../grammaire/media/word-vocab/${card.id}.webp`]}
        alt={reveal ? card.label : 'Image à nommer'}
      />
      <figcaption className={card.recall ? `answer-line-field${reveal ? ' filled' : ''}` : undefined}>
        {reveal ? card.label : '\u00a0'}
      </figcaption>
    </figure>
  )
}

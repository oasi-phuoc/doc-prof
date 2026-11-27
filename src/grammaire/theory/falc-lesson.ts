import { normalizeTheoryBlocks, theorySpacerDivisor, type GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { GrammaireTheoryDoc } from '../types'
import { falcOpenings } from './falc-openings'
import { falcA4Cuts, falcA5Cuts } from './falc-pagination'
import { falcRevisions } from './falc-revisions'

const placeIllustration: GrammarTheoryBlock = {
  kind: 'image-row',
  label: 'Deux positions du vélo autour de la même maison',
  cells: [
    { src: '/lib/images/grammaire/theorie/velo-devant.png', alt: 'Le vélo est près de la porte, du côté de la rue.', caption: 'Le vélo est devant la maison.' },
    { src: '/lib/images/grammaire/theorie/velo-derriere.png', alt: 'La maison cache une partie du vélo.', caption: 'Le vélo est derrière la maison.' },
  ],
}

/** Les blocs de détail gardent leur ordre et chaque exemple garde sa forme. */
function readingBlocks(blocks: GrammarTheoryBlock[], revise: (text: string) => string): GrammarTheoryBlock[] {
  return blocks.flatMap<GrammarTheoryBlock>(block => {
    if (block.kind === 'section') return readingBlocks(block.blocks, revise)
    if (block.kind === 'paragraph') {
      if (theorySpacerDivisor(block.text)) return []
      const text = revise(block.text)
      const warning = /^\{c\}Attention\s*:\s*\{\/c\}\s*(.*)$/u.exec(text)
      if (warning) return [{ kind: 'attention', text: warning[1]! }]
      return [{ ...block, text }]
    }
    if (block.kind === 'examples') {
      return [{ ...block, items: block.items.map(item => typeof item === 'string' ? revise(item) : { ...item, text: revise(item.text) }) }]
    }
    if (block.kind === 'table') return [{ ...block, rows: block.rows.map(row => row.map(revise)) }]
    return normalizeTheoryBlocks([block])
  })
}

export function falcLessonBlocks(doc: GrammaireTheoryDoc, paper: 'a4' | 'a5' = 'a4'): GrammarTheoryBlock[] | undefined {
  const opening = falcOpenings[doc.id]
  const [title, ...source] = doc.blocks
  if (!opening || title?.kind !== 'heading') return undefined
  const revisions = falcRevisions[doc.id]

  const cuts = (paper === 'a5' ? falcA5Cuts : falcA4Cuts)[doc.id]
  const blocks: GrammarTheoryBlock[] = [
    title,
    doc.id === 'e6' ? placeIllustration : { kind: 'examples', items: opening.examples, marker: 'border' },
    { kind: 'paragraph', text: opening.lines.join('/n') },
    ...readingBlocks(source, text => revisions?.[text] ?? text).flatMap<GrammarTheoryBlock>(block => block.kind === 'page'
      ? [...(cuts ? [] : [block]), { kind: 'heading', text: opening.reference, sub: true }]
      : [block]),
  ]
  return cuts ? blocks.flatMap<GrammarTheoryBlock>((block, index) => cuts.includes(index)
    ? [{ kind: 'page' }, block]
    : [block]) : blocks
}

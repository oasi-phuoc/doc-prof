import type { GrammarTheoryBlock } from '@/francais/grammar-theory'
import type { MathItem, PageConfig } from '@/math/types'
import { theoryDocByTypeId } from './theory'
import { isGrammaireTheoryType } from './types'

function blockToItem(docTitle: string, block: GrammarTheoryBlock, index: number): MathItem {
  return {
    layout: 'theory',
    prompt: `${docTitle}-${index}`,
    answer: '',
    theoryBlock: block,
  }
}

/** Génère une fiche théorie FALC (déterministe ; pas de tirage). */
export function tryGenerateGrammaireBlock(
  config: PageConfig,
): { instruction: string; items: MathItem[] } | null {
  const typeId = config.exerciseType
  if (!isGrammaireTheoryType(typeId)) return null
  const doc = theoryDocByTypeId[typeId]
  if (!doc) {
    return {
      instruction: 'Théorie à compléter.',
      items: [
        {
          layout: 'theory',
          prompt: 'empty',
          answer: '',
          theoryBlock: { kind: 'paragraph', text: 'Contenu théorie manquant pour ce type.' },
        },
      ],
    }
  }
  return {
    instruction: `Théorie — ${doc.title}`,
    items: doc.blocks.map((block, index) => blockToItem(doc.title, block, index)),
  }
}

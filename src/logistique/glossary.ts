import type { LogistiqueGlossaryFigure, MathItem } from '@/math/types'
import visuals from './banks/glossaires-visuels-v006.json'

export const logistiqueGlossaryFigures: Readonly<Record<string, Readonly<Record<string, LogistiqueGlossaryFigure>>>> = visuals

export function completeLogistiqueGlossaryItem(item: MathItem, module: string, illustrations?: Readonly<Record<string, LogistiqueGlossaryFigure>>): MathItem {
  const block = item.theoryBlock
  if (block?.kind !== 'paragraph') return item
  const match = block.text.match(/^\{g\}(.+?)\{\/g\}\s*[—–-]\s*(.+)$/s)
  if (!match) return item
  const [, term = '', definition = ''] = match
  const figure = logistiqueGlossaryFigures[module]?.[term] ?? illustrations?.[term]
  return {
    ...item,
    logistiqueGlossaryEntry: { term, definition },
    ...(figure ? { logistiqueGlossaryFigure: { ...figure, src: import.meta.env.BASE_URL + figure.src.slice(1) } } : {}),
  }
}

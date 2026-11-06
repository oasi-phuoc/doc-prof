import type { MathItem, WorksheetBlock } from './types'
import { scoredPointWeights } from '@/tpm/test'

/**
 * Première tranche d’un saut de page : titre, consigne et barème de tout l’exercice.
 * Tranches suivantes : rien de tout cela (le rendu masque l’en-tête via itemOffset).
 */
export function headingForSlice(
  block: WorksheetBlock,
  start: number,
  fullItems: readonly MathItem[],
): Pick<WorksheetBlock, 'title' | 'instruction' | 'pointsWeights'> {
  if (start > 0) return { title: '', instruction: '' }
  return {
    title: block.title,
    instruction: block.instruction,
    pointsWeights: scoredPointWeights(fullItems),
  }
}

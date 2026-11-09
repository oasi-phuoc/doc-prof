import { defaultPage } from '@/math/catalog'
import type { PageConfig } from '@/math/types'
import type { FicheRecipe } from '@/fiches/recipe'
import { DEFAULT_INSTITUTIONAL } from '@/components/math/PrintDocumentChrome'

/** Real generator configurations, with two edited source items for the specified regression cases. */
export function demoRecipe(): FicheRecipe {
  const addition: PageConfig = {
    ...defaultPage('algèbre'),
    topic: 'addition',
    exerciseType: 'addition-ligne',
    count: 2,
    libreItems: [
      {
        layout: 'inline',
        op: '+',
        a: 788,
        b: 771,
        missing: 'result',
        answer: '1559',
      },
      {
        layout: 'inline',
        op: '+',
        a: 46,
        b: 37,
        missing: 'result',
        answer: '83',
      },
    ],
  }
  const square: PageConfig = {
    ...defaultPage('géométrie'),
    topic: 'aires',
    exerciseType: 'aire-carre',
    count: 1,
    libreInstruction: 'Calculez l’aire du carré.',
    libreItems: [
      {
        layout: 'geo',
        figure: 'square',
        dims: { side: 349, unit: 'cm' },
        prompt: 'Calculez l’aire.',
        answer: '121801 cm²',
      },
    ],
  }
  const audio: PageConfig = {
    ...defaultPage('tcf-csc'),
    topic: 'tcf-co',
    exerciseType: 'tcf-co-ex-1',
    count: 1,
  }
  const oral: PageConfig = {
    ...defaultPage('tcf-csc'),
    topic: 'tcf-po',
    exerciseType: 'tcf-po',
    tcfBankId: 'tcf-a0a1-po-img-accident-velo',
    count: 1,
  }
  return {
    version: 1,
    pages: [addition, square, audio, oral],
    seed: 20261107,
    institutional: { ...DEFAULT_INSTITUTIONAL },
    evalMode: false,
    pointsPerQuestion: 1,
    libreMode: true,
    libreSnapshot: null,
  }
}

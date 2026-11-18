/**
 * Page 1 « Consignes » partagée par TPM, TCM CFR et TCM CSC.
 * Le nombre d’exercices et le score suivent la recette de chaque test.
 */
import type { MathItem } from '@/math/types'
import { TCM_CSC_STEPS } from '@/tcm-csc/pages'
import { TCM_CFR_STEPS } from '@/tcm-cfr/test'
import { TPM_STEPS } from '@/tpm/test'

export type TpmInfoVariant = 'tpm' | 'tcm-cfr' | 'tcm-csc'

function scoreLabel(maxScore: number): string {
  return Number.isInteger(maxScore) ? String(maxScore) : String(maxScore).replace('.', ',')
}

function exerciseCount(variant: TpmInfoVariant): number {
  if (variant === 'tcm-csc') return TCM_CSC_STEPS.length
  if (variant === 'tcm-cfr') return TCM_CFR_STEPS.length
  return TPM_STEPS.length
}

function line(prompt: string, text: string): MathItem {
  return {
    layout: 'theory',
    prompt,
    answer: '',
    noPoints: true,
    theoryBlock: { kind: 'paragraph', text },
  }
}

/** Items théorie de la page Consignes (pas de questions ni de colonnes). */
export function generateTpmInformations(variant: TpmInfoVariant, maxScore: number): MathItem[] {
  const count = exerciseCount(variant)
  const points = scoreLabel(maxScore)
  const pointWord = maxScore === 1 ? 'point' : 'points'
  const lines = [
    count === 1 ? 'Il y a 1 exercice.' : `Il y a ${count} exercices.`,
    `Le score maximum est de ${points} ${pointWord}.`,
    'Lisez chaque consigne avant de répondre.',
    'Répondez sur la feuille de test.',
    'Si vous ne savez pas répondre, passez à la question suivante.',
    'Vérifiez vos calculs quand vous avez terminé.',
  ]
  return [
    {
      layout: 'theory',
      prompt: 'Consignes',
      answer: '',
      noPoints: true,
      theoryBlock: { kind: 'heading', text: 'Consignes' },
    },
    ...lines.map((text, index) => line(`consigne-${index}`, text)),
    line('espace', '{ligne}'),
    {
      layout: 'theory',
      prompt: 'brouillon',
      answer: '',
      noPoints: true,
      theoryBlock: {
        kind: 'notice',
        tone: 'info',
        text: 'Vous avez à disposition une feuille de brouillon.',
      },
    },
    {
      layout: 'theory',
      prompt: 'calculatrice',
      answer: '',
      noPoints: true,
      theoryBlock: {
        kind: 'notice',
        tone: 'attention',
        text: 'Il est interdit d’utiliser une calculatrice.',
      },
    },
  ]
}

export function isTpmFamilyConsignesType(exerciseType: string | undefined): boolean {
  return (
    exerciseType === 'tpm-consignes' ||
    exerciseType === 'tcm-cfr-consignes' ||
    exerciseType === 'tcm-csc-consignes'
  )
}

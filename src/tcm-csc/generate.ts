import type { MathItem, PageConfig } from '@/math/types'
import { generateTpmInformations } from '@/tpm/informations'
import { isTcmCscConsignesType, TCM_CSC_MAX_SCORE } from './test'
import { isTcmCscType } from './types'
import { TCM_CSC_EXERCISE_TYPES } from './catalog'
import { generateCscExercise } from './items'

export function tryGenerateTcmCscBlock(
  config: PageConfig,
  seed = 0,
): { instruction: string; items: MathItem[] } | null {
  if (!isTcmCscType(config.exerciseType)) return null
  if (isTcmCscConsignesType(config.exerciseType)) {
    return {
      instruction: 'Lisez les consignes avant de commencer le test.',
      items: generateTpmInformations('tcm-csc', TCM_CSC_MAX_SCORE),
    }
  }
  if (config.exerciseType === 'tcm-csc-placeholder') return { instruction: 'Ouvrez le domaine TCM CSC pour préparer le test complet.', items: [] }
  const type = TCM_CSC_EXERCISE_TYPES.find((entry) => entry.id === config.exerciseType)
  return { instruction: type?.instruction ?? '', items: generateCscExercise(config.exerciseType, config.count, seed) }
}

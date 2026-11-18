import type { MathItem, PageConfig } from '@/math/types'
import { generateTpmInformations } from '@/tpm/informations'
import { isTcmCscConsignesType, TCM_CSC_MAX_SCORE } from './test'
import { isTcmCscType } from './types'
import { TCM_CSC_EXERCISE_TYPES } from './catalog'
import { cscOrderAscending, cscOrderInstruction, generateCscExercise } from './items'

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
  const ascending = config.exerciseType === 'tcm-csc-ex06' || config.exerciseType === 'tcm-csc-ex25' ? cscOrderAscending(config.exerciseType, seed) : undefined
  const items = scoreCscQuestions(config.exerciseType, generateCscExercise(config.exerciseType, config.count, seed, config.logiqueIds, config.countShapeScale, config.countIconTotal), config.pointsPerQuestion)
  const heard = items[0]?.cscTask?.kind === 'number-grid' ? items[0].cscTask.heard.length : 0
  const instruction = config.exerciseType === 'tcm-csc-ex03'
    ? heard <= 1 ? 'Entourez le nombre entendu.' : `Entourez les ${heard} nombres entendus.`
    : ascending === undefined ? (type?.instruction ?? '') : cscOrderInstruction(ascending)
  return { instruction, items }
}

/** Un seul dessin peut valoir plusieurs questions : 1 point par nombre, paire, forme ou coordonnée. */
function scoreCscQuestions(typeId: string, items: MathItem[], perQuestion: number | undefined): MathItem[] {
  const item = items[0]
  if (!item || items.length !== 1 || perQuestion === 0) return items
  const units = typeId === 'tcm-csc-ex03' && item.cscTask?.kind === 'number-grid' ? item.cscTask.heard.length
    : typeId === 'tcm-csc-ex15' && item.cscTask?.kind === 'connect-points' ? item.cscTask.points.length / 2
    : typeId === 'tcm-csc-ex17' && item.cscTask?.kind === 'shape-names' ? item.cscTask.figures.length
    : (typeId === 'tcm-csc-ex19' || typeId === 'tcm-csc-ex20') && item.coordQuestions ? item.coordQuestions.length
    : 0
  return units > 1 ? [{ ...item, points: units * (perQuestion ?? 1) }] : items
}

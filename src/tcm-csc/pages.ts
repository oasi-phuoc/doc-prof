import type { ExerciseBlock, PageConfig } from '@/math/types'
import { exerciseTypeById } from '@/math/catalog'
import { cscSheetNumber, TCM_CSC_DOMAIN } from './catalog'

export const TCM_CSC_STEPS = [
  { number: 1, count: 5 }, { number: 2, count: 5 }, { number: 3, count: 1, points: 5 },
  { number: 4, count: 4 }, { number: 5, count: 4 }, { number: 6, count: 1 }, { number: 25, count: 1 },
  { number: 7, count: 10, columns: 2 }, { number: 8, count: 4 }, { number: 9, count: 3 },
  { number: 10, count: 8, columns: 2 }, { number: 11, count: 4, columns: 2 },
  { number: 12, count: 1 }, { number: 13, count: 1 }, { number: 14, count: 1, points: 2 },
  { number: 15, count: 1, points: 2 }, { number: 16, count: 2 }, { number: 17, count: 1, points: 4 },
  { number: 18, count: 1 }, { number: 19, count: 1, points: 6 }, { number: 20, count: 1, points: 6 },
  { number: 22, count: 1 }, { number: 23, count: 1 }, { number: 24, count: 1 },
] as const

function buildConsignesPage(): PageConfig {
  const type = exerciseTypeById['tcm-csc-consignes']
  if (!type) throw new Error('TCM CSC : type tcm-csc-consignes manquant')
  return { domain: TCM_CSC_DOMAIN, topic: type.topic, exerciseType: type.id, difficulty: 'moyen', count: 1, columns: 1, pointsPerQuestion: 0 }
}

const PAGE_GROUPS = [[1, 2], [3], [4, 5], [6, 25, 7], [8, 9], [10], [11], [12, 13], [14, 15], [16], [17], [18], [19], [20], [22, 23], [24]]

export function buildTcmCscTestPages(): PageConfig[] {
  return [buildConsignesPage(), ...PAGE_GROUPS.map((numbers): PageConfig => {
    const blocks = numbers.map((number): ExerciseBlock => {
      const spec = TCM_CSC_STEPS.find((step) => step.number === number)!
      const type = exerciseTypeById[`tcm-csc-ex${String(number).padStart(2, '0')}`]
      if (!type) throw new Error(`TCM CSC : exercice ${number} manquant.`)
      return { exerciseType: type.id, topic: type.topic, difficulty: 'moyen', count: spec.count, columns: 'columns' in spec ? spec.columns : 1, exerciseNo: cscSheetNumber(number), pointsPerQuestion: 'points' in spec ? spec.points : 1, ...(number >= 22 ? { problemDraftGrids: [true] } : {}) }
    })
    const [first, ...extraBlocks] = blocks
    return { domain: TCM_CSC_DOMAIN, ...first!, exerciseGapPx: 25, ...(extraBlocks.length ? { extraBlocks } : {}) }
  })]
}

/**
 * Test de connaissance de mathématiques — variante CFR (28 exercices).
 */
import type { Difficulty, Domain, ExerciseBlock, PageConfig } from '@/math/types'
import { exerciseTypeById, isDraftPadExercise } from '@/math/catalog'

export const TCM_CFR_DOMAIN: Domain = 'tcm-cfr'
export const TCM_CFR_DOCUMENT_TITLE = 'Test de connaissance de mathématiques — CFR'

type BlockSpec = {
  exerciseType: string
  count: number
  columns?: 1 | 2 | 3
  pointsPerQuestion?: number
  exerciseNo?: number
}

type StepSpec = {
  id: number
  label: string
  blocks: readonly BlockSpec[]
}

/** Recette chronologique TCM CFR (28 exercices). */
export const TCM_CFR_STEPS: readonly StepSpec[] = [
  { id: 1, label: 'Nombres entendus', blocks: [{ exerciseType: 'tcm-cfr-ex01', count: 5, columns: 1, pointsPerQuestion: 0.5 }] },
  { id: 2, label: 'Multiplications orales', blocks: [{ exerciseType: 'tcm-cfr-ex02', count: 5, columns: 1, pointsPerQuestion: 0.5 }] },
  { id: 3, label: 'Ranger', blocks: [{ exerciseType: 'tcm-cfr-ex03', count: 2, columns: 1, pointsPerQuestion: 2 }] },
  { id: 4, label: 'Comparer décimaux', blocks: [{ exerciseType: 'tcm-cfr-ex04', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 5, label: 'Décomposer', blocks: [{ exerciseType: 'tcm-cfr-ex05', count: 2, columns: 1, pointsPerQuestion: 1 }] },
  { id: 6, label: 'Nommer les opérations', blocks: [{ exerciseType: 'tcm-cfr-ex06', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 7, label: 'Colonnes + −', blocks: [{ exerciseType: 'tcm-cfr-ex07', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 8, label: 'Colonnes + − (suite)', blocks: [{ exerciseType: 'tcm-cfr-ex08', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 9, label: '× et ÷ posées', blocks: [{ exerciseType: 'tcm-cfr-ex09', count: 2, columns: 2, pointsPerQuestion: 1 }] },
  { id: 10, label: '× mixtes', blocks: [{ exerciseType: 'tcm-cfr-ex10', count: 2, columns: 2, pointsPerQuestion: 1 }] },
  { id: 11, label: 'Fractions en lettres', blocks: [{ exerciseType: 'tcm-cfr-ex11', count: 6, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 12, label: 'Colorier fractions', blocks: [{ exerciseType: 'tcm-cfr-ex12', count: 6, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 13, label: 'Lire fractions', blocks: [{ exerciseType: 'tcm-cfr-ex13', count: 6, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 14, label: 'Problème magasin', blocks: [{ exerciseType: 'tcm-cfr-ex14', count: 2, columns: 1, pointsPerQuestion: 3 }] },
  { id: 15, label: 'Problème mécanicien', blocks: [{ exerciseType: 'tcm-cfr-ex15', count: 2, columns: 1, pointsPerQuestion: 3 }] },
  { id: 16, label: 'Figures et propriétés', blocks: [{ exerciseType: 'tcm-cfr-ex16', count: 6, columns: 2, pointsPerQuestion: 1 }] },
  { id: 17, label: 'Nommer des formes', blocks: [{ exerciseType: 'tcm-cfr-ex17', count: 6, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 18, label: 'Symétrie axiale', blocks: [{ exerciseType: 'tcm-cfr-ex18', count: 1, columns: 1, pointsPerQuestion: 3 }] },
  { id: 19, label: 'Mesurer des segments', blocks: [{ exerciseType: 'tcm-cfr-ex19', count: 1, columns: 1, pointsPerQuestion: 4 }] },
  { id: 20, label: 'Conversions', blocks: [{ exerciseType: 'tcm-cfr-ex20', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 21, label: 'Fractions → décimaux', blocks: [{ exerciseType: 'tcm-cfr-ex21', count: 4, columns: 2, pointsPerQuestion: 0.5 }] },
  { id: 22, label: 'Carré décimal', blocks: [{ exerciseType: 'tcm-cfr-ex22', count: 1, columns: 1, pointsPerQuestion: 4 }] },
  { id: 23, label: 'Rectangle décimal', blocks: [{ exerciseType: 'tcm-cfr-ex23', count: 1, columns: 1, pointsPerQuestion: 4 }] },
  { id: 24, label: 'Triangle décimal', blocks: [{ exerciseType: 'tcm-cfr-ex24', count: 1, columns: 1, pointsPerQuestion: 4 }] },
  { id: 25, label: 'Côté du carré', blocks: [{ exerciseType: 'tcm-cfr-ex25', count: 1, columns: 1, pointsPerQuestion: 2 }] },
  { id: 26, label: 'Côté du rectangle', blocks: [{ exerciseType: 'tcm-cfr-ex26', count: 1, columns: 1, pointsPerQuestion: 2 }] },
  { id: 27, label: 'Repérage cadran I', blocks: [{ exerciseType: 'tcm-cfr-ex27', count: 1, columns: 1, pointsPerQuestion: 3 }] },
  { id: 28, label: 'Plan de métro', blocks: [{ exerciseType: 'tcm-cfr-ex28', count: 1, columns: 1, pointsPerQuestion: 5 }] },
]

const TCM_CFR_PACKED_PAGES: readonly (readonly number[])[] = [
  [1, 2],
  [3, 4, 5],
  [6, 7],
  [8, 9],
  [10, 11],
  [12, 13],
  [14],
  [15],
  [16, 17],
  [18, 19],
  [20, 21],
  [22, 23],
  [24, 25, 26],
  [27],
  [28],
]

function blockSpecPoints(spec: BlockSpec): number {
  return spec.count * (spec.pointsPerQuestion ?? 1)
}

export function computeTcmCfrMaxScore(steps: readonly StepSpec[] = TCM_CFR_STEPS): number {
  return steps.reduce(
    (sum, step) => sum + step.blocks.reduce((s, b) => s + blockSpecPoints(b), 0),
    0,
  )
}

export const TCM_CFR_MAX_SCORE = computeTcmCfrMaxScore()

function blockFromSpec(
  spec: BlockSpec,
  difficulty: Difficulty = 'moyen',
  exerciseNo?: number,
): ExerciseBlock {
  const type = exerciseTypeById[spec.exerciseType]
  if (!type) throw new Error(`TCM CFR : type inconnu « ${spec.exerciseType} »`)
  const columns = spec.columns ?? type.preferredColumns ?? 2
  return {
    topic: type.topic,
    exerciseType: type.id,
    difficulty,
    count: spec.count,
    columns: Math.max(1, Math.min(3, columns)) as 1 | 2 | 3,
    ...(isDraftPadExercise(type.id)
      ? { problemDraftGrids: Array.from({ length: spec.count }, () => false) }
      : {}),
    ...(spec.pointsPerQuestion != null ? { pointsPerQuestion: spec.pointsPerQuestion } : {}),
    ...(exerciseNo != null || spec.exerciseNo != null
      ? { exerciseNo: spec.exerciseNo ?? exerciseNo }
      : {}),
  }
}

function pageFromBlocks(blocks: ExerciseBlock[]): PageConfig {
  const [first, ...rest] = blocks
  if (!first) throw new Error('TCM CFR : page sans bloc')
  return {
    domain: TCM_CFR_DOMAIN,
    ...first,
    extraBlocks: rest.length ? rest : undefined,
  }
}

function buildConsignesPage(): PageConfig {
  const type = exerciseTypeById['tcm-cfr-consignes']
  if (!type) throw new Error('TCM CFR : type tcm-cfr-consignes manquant')
  return {
    domain: TCM_CFR_DOMAIN,
    topic: type.topic,
    exerciseType: type.id,
    difficulty: 'moyen',
    count: 1,
    columns: 1,
    pointsPerQuestion: 0,
  }
}

export function buildTcmCfrTestPages(): PageConfig[] {
  const byId = new Map(TCM_CFR_STEPS.map((step) => [step.id, step]))
  const packedPages = TCM_CFR_PACKED_PAGES.map((ids) => {
    const blocks = ids.flatMap((id) => {
      const step = byId.get(id)
      if (!step) throw new Error(`TCM CFR : étape ${id} introuvable`)
      return step.blocks.map((b) => blockFromSpec(b, 'moyen', id))
    })
    return pageFromBlocks(blocks)
  })
  return [buildConsignesPage(), ...packedPages]
}

export function isTcmCfrDomain(domain: Domain | undefined): boolean {
  return domain === TCM_CFR_DOMAIN
}

export function isTcmCfrConsignesType(exerciseType: string | undefined): boolean {
  return exerciseType === 'tcm-cfr-consignes'
}

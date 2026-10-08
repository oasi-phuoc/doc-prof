import type { ExerciseType, Topic } from '@/math/types'

export const TCM_CSC_DOMAIN = 'tcm-csc' as const

export const TCM_CSC_TOPICS: Topic[] = [
  { id: 'tcm-csc-a-venir', label: 'À venir', domain: 'tcm-csc' },
]

/**
 * Stub vide — Phuoc Van prépare le contenu.
 * Ce n’est pas une copie de la recette TCM ; plus tard, des exercices TCM pourront y être repris.
 */
export const TCM_CSC_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'tcm-csc-placeholder',
    topic: 'tcm-csc-a-venir',
    label: 'Contenu à venir',
    description: 'Domaine TCM CSC — fiches à venir.',
    instruction: 'Contenu pédagogique à venir.',
    visual: 'texte',
    preferredColumns: 1,
  },
]

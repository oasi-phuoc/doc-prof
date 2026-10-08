import type { ExerciseType, Topic } from '@/math/types'

export const TCM_CFR_DOMAIN = 'tcm-cfr' as const

export const TCM_CFR_TOPICS: Topic[] = [
  { id: 'tcm-cfr-a-venir', label: 'À venir', domain: 'tcm-cfr' },
]

/**
 * Stub vide — Phuoc Van prépare le contenu.
 * Ce n’est pas une copie de la recette TCM ; plus tard, des exercices TCM pourront y être repris.
 */
export const TCM_CFR_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'tcm-cfr-placeholder',
    topic: 'tcm-cfr-a-venir',
    label: 'Contenu à venir',
    description: 'Domaine TCM CFR — fiches à venir.',
    instruction: 'Contenu pédagogique à venir.',
    visual: 'texte',
    preferredColumns: 1,
  },
]

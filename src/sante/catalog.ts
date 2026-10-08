import type { ExerciseType, Topic } from '@/math/types'

export const SANTE_DOMAIN = 'santé' as const

export const SANTE_TOPICS: Topic[] = [
  { id: 'sante-a-venir', label: 'À venir', domain: 'santé' },
]

/** Squelette — types pédagogiques à ajouter ensuite. */
export const SANTE_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'sante-placeholder',
    topic: 'sante-a-venir',
    label: 'Contenu à venir',
    description: 'Domaine Sciences et santé — fiches à venir.',
    instruction: 'Contenu pédagogique à venir.',
    visual: 'texte',
    preferredColumns: 1,
  },
]

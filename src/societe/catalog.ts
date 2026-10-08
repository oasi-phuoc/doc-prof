import type { ExerciseType, Topic } from '@/math/types'

export const SOCIETE_DOMAIN = 'société' as const

export const SOCIETE_TOPICS: Topic[] = [
  { id: 'societe-a-venir', label: 'À venir', domain: 'société' },
]

/** Squelette — types pédagogiques à ajouter ensuite. */
export const SOCIETE_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'societe-placeholder',
    topic: 'societe-a-venir',
    label: 'Contenu à venir',
    description: 'Domaine Société — fiches à venir.',
    instruction: 'Contenu pédagogique à venir.',
    visual: 'texte',
    preferredColumns: 1,
  },
]

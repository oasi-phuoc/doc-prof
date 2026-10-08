import type { ExerciseType, Topic } from '@/math/types'

export const VOCABULAIRE_DOMAIN = 'vocabulaire' as const

export const VOCABULAIRE_TOPICS: Topic[] = [
  { id: 'vocabulaire-a-venir', label: 'À venir', domain: 'vocabulaire' },
]

/** Squelette — types pédagogiques à ajouter ensuite. */
export const VOCABULAIRE_EXERCISE_TYPES: ExerciseType[] = [
  {
    id: 'vocabulaire-placeholder',
    topic: 'vocabulaire-a-venir',
    label: 'Contenu à venir',
    description: 'Domaine Vocabulaire — fiches à venir.',
    instruction: 'Contenu pédagogique à venir.',
    visual: 'texte',
    preferredColumns: 1,
  },
]

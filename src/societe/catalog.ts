import type { ExerciseType, Topic } from '@/math/types'

export const SOCIETE_DOMAIN = 'société' as const
export const SOCIETE_TOPIC = 'societe-a-venir'
export const SOCIETE_PLACEHOLDER: ExerciseType = {
  id: 'societe-placeholder',
  topic: SOCIETE_TOPIC,
  label: 'Contenu à venir',
  description: 'Le domaine Société sera bientôt disponible.',
  instruction: 'Contenu pédagogique à venir.',
  visual: 'texte',
  preferredColumns: 1,
}

export const SOCIETE_TOPICS: Topic[] = [
  { id: SOCIETE_TOPIC, label: 'À venir', domain: SOCIETE_DOMAIN },
]

export const SOCIETE_EXERCISE_TYPES = [SOCIETE_PLACEHOLDER]

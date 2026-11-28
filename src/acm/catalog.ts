import type { ExerciseBlock, ExerciseType, Topic } from '@/math/types'
import activities from './activities.json'
import type { AcmActivity } from './types'

export const ACM_DOMAIN = 'acm' as const
export const ACM_DEFAULT_TOPIC = 'acm-origami'

export const ACM_TOPICS: Topic[] = [
  { id: ACM_DEFAULT_TOPIC, label: 'Origami', domain: ACM_DOMAIN },
  { id: 'acm-peinture', label: 'Peinture', domain: ACM_DOMAIN },
  { id: 'acm-collage', label: 'Collage', domain: ACM_DOMAIN },
  { id: 'acm-dessin', label: 'Dessin au crayon', domain: ACM_DOMAIN },
]

const acmActivities = activities as AcmActivity[]

export const ACM_EXERCISE_TYPES: ExerciseType[] = acmActivities.map((activity) => ({
  id: activity.id,
  topic: `acm-${activity.theme}`,
  label: activity.title,
  description: activity.description,
  instruction: activity.description,
  visual: 'texte',
  preferredColumns: 1,
}))

const activityById = new Map(acmActivities.map((activity) => [activity.id, activity]))

export function getAcmActivity(id: string): AcmActivity | undefined {
  return activityById.get(id === 'acm-placeholder' ? acmActivities[0]!.id : id)
}

export function normalizeLegacyAcmBlock<T extends ExerciseBlock>(block: T): T {
  if (block.exerciseType !== 'acm-placeholder') return block
  return {
    ...block,
    topic: ACM_DEFAULT_TOPIC,
    exerciseType: acmActivities[0]!.id,
    count: 1,
    columns: 1,
  }
}

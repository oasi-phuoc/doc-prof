import type { ExerciseBlock, ExerciseType, Topic } from '@/math/types'
import { santeSequenceActivities } from './sequences'
import type { SanteActivity, SanteLevel } from './types'

export const SANTE_DOMAIN = 'santé' as const
export const SANTE_DEFAULT_TOPIC = 'sante-soins'
const DEFAULT_TYPE = 'sante-soins-theorie-a1'

export const SANTE_TOPICS: Topic[] = [
  { id: 'sante-corps', label: 'Parties du corps', domain: SANTE_DOMAIN },
  { id: 'sante-douleurs', label: 'Blessures et douleurs', domain: SANTE_DOMAIN },
  { id: 'sante-maladies', label: 'Maladies, virus et symptômes', domain: SANTE_DOMAIN },
  { id: 'sante-specialistes', label: 'Spécialistes de la santé', domain: SANTE_DOMAIN },
  { id: SANTE_DEFAULT_TOPIC, label: 'Chez le médecin et à la pharmacie', domain: SANTE_DOMAIN },
  { id: 'sante-hygiene', label: 'Hygiène corporelle', domain: SANTE_DOMAIN },
  { id: 'sante-alimentation', label: 'Alimentation et habitudes alimentaires', domain: SANTE_DOMAIN },
  { id: 'sante-sante-mentale', label: 'Santé mentale', domain: SANTE_DOMAIN },
  { id: 'sante-bien-etre', label: 'Bien-être et mal-être', domain: SANTE_DOMAIN },
  { id: 'sante-stress', label: 'Gestion du stress', domain: SANTE_DOMAIN },
]

const activities: SanteActivity[] = [
  { id: 'corps-theorie-a1', topic: 'corps', label: 'Théorie — Les parties du corps', level: 'A1' },
  { id: 'douleurs-theorie-a1', topic: 'douleurs', label: 'Théorie — Dire où j’ai mal', level: 'A1' },
  {
    id: 'douleurs-co-ventre-a1', topic: 'douleurs', label: 'CO — Le mal de ventre', level: 'A1',
    sourceId: 'tcf-delf-actif-a1-030-02', instruction: 'Écoutez l’échange, puis répondez aux questions.',
  },
  { id: 'specialistes-theorie-a1', topic: 'specialistes', label: 'Théorie — Les professionnels de la santé', level: 'A1' },
  {
    id: 'specialistes-co-cabinet-a1', topic: 'specialistes', label: 'CO — Les professionnels du cabinet', level: 'A1',
    sourceId: 'gram-co-medecin-piste147', grammarCoSource: 'medecin',
    instruction: 'Écoutez le message du cabinet, puis répondez aux questions.',
  },
  { id: 'soins-theorie-a1', topic: 'soins', label: 'Théorie — Prendre rendez-vous', level: 'A1' },
  { id: 'soins-vocabulaire-a1', topic: 'soins', label: 'Vocabulaire — Le cabinet et la pharmacie', level: 'A1' },
  {
    id: 'soins-ce-adresse-a1', topic: 'soins', label: 'CE — La pharmacie déménage', level: 'A1',
    sourceId: 'delf-a1v-ce-032', questionIndexes: [0, 1, 5, 7], instruction: 'Lisez l’annonce, puis répondez aux questions.',
  },
  {
    id: 'soins-co-rendez-vous-a1', topic: 'soins', label: 'CO — Le rendez-vous est déplacé', level: 'A1',
    sourceId: 'tcf-delf-actif-a1-008-01', instruction: 'Écoutez le message, puis répondez aux questions.',
  },
  {
    id: 'soins-pe-pharmacie-a1', topic: 'soins', label: 'PE — Un échange à la pharmacie', level: 'A1',
    sourceId: 'tcf-a1-tpa-pe-3', instruction: 'Complétez les réponses du client ou de la cliente.',
  },
  {
    id: 'soins-po-rendez-vous-a1', topic: 'soins', label: 'PO — Appeler le cabinet', level: 'A1',
    sourceId: 'tcf-a0a1-po-img-prendre-rendez-vous', instruction: 'Décrivez les images, puis jouez l’appel.',
  },
  {
    id: 'soins-co-dentiste-a2', topic: 'soins', label: 'CO — Le dentiste annule un rendez-vous', level: 'A2',
    sourceId: 'tcf-a2j-s1-co-3', instruction: 'Écoutez le message, puis répondez aux questions.',
  },
  {
    id: 'soins-po-consultation-a2', topic: 'soins', label: 'PO — La consultation', level: 'A2',
    sourceId: 'tcf-a1a2-po-img-medecin', instruction: 'Décrivez l’image, puis jouez la consultation.',
  },
  ...santeSequenceActivities,
]

export const santeActivityByType = new Map(
  activities.map((activity) => [`sante-${activity.id}`, activity]),
)

export function isSanteTheoryType(typeId: string): boolean {
  return /-theorie-(?:a1|a2|b1)$/.test(typeId) && santeActivityByType.has(typeId)
}

export const SANTE_EXERCISE_TYPES: ExerciseType[] = Array.from(santeActivityByType, ([id, activity]) => ({
  id,
  topic: `sante-${activity.topic}`,
  label: `${activity.label} (${activity.level})`,
  description: activity.label,
  instruction: activity.instruction ?? '',
  visual: 'texte',
  preferredColumns: 1,
}))

export function normalizeLegacySanteBlock<T extends ExerciseBlock>(block: T): T {
  if (block.exerciseType !== 'sante-placeholder') return block
  return {
    ...block,
    topic: SANTE_DEFAULT_TOPIC,
    exerciseType: DEFAULT_TYPE,
    count: 1,
    columns: 1,
  }
}

export function santeLevelsForTopic(topic: string): SanteLevel[] {
  const levels = activities.filter((activity) => `sante-${activity.topic}` === topic).map((activity) => activity.level)
  return Array.from(new Set(levels)).sort()
}

export function santeActivityLevel(type: string): SanteLevel | undefined {
  return santeActivityByType.get(type)?.level
}

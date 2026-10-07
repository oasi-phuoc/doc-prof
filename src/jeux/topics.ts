/** Thèmes Grilles de cartes = dossiers d’images Voc + mode Libre. */
import type { Topic } from '@/math/types'
import { VOCAB_IMAGE_THEMES } from './vocab-images'

export const JEUX_LIBRE_TOPIC = 'jeux-libre'

/** Préfixe des thèmes jeux dérivés du français. */
export const JEUX_TOPIC_PREFIX = 'jeux-'

export function jeuxTopicIdFromFr(frTopicId: string): string {
  return `${JEUX_TOPIC_PREFIX}${frTopicId.replace(/^fr-/, '')}`
}

/** `jeux-fruits` → `fruits` (dossier d’images) ; libre → undefined. */
export function frTopicFromJeuxTopic(jeuxTopic: string): string | undefined {
  if (!jeuxTopic || jeuxTopic === JEUX_LIBRE_TOPIC) return undefined
  if (jeuxTopic.startsWith('fr-')) return jeuxTopic.slice(3)
  if (jeuxTopic.startsWith(JEUX_TOPIC_PREFIX)) {
    return jeuxTopic.slice(JEUX_TOPIC_PREFIX.length)
  }
  return jeuxTopic
}

export function isJeuxTopicId(topic: string): boolean {
  return topic === JEUX_LIBRE_TOPIC || topic.startsWith(JEUX_TOPIC_PREFIX)
}

export function isJeuxLibreTopic(topic: string): boolean {
  return topic === JEUX_LIBRE_TOPIC
}

/** Un thème par dossier d’images Voc. */
export const jeuxTopicsFromFr: Topic[] = [
  ...VOCAB_IMAGE_THEMES.map((theme) => ({
    id: jeuxTopicIdFromFr(theme.id),
    label: theme.label,
    domain: 'jeux' as const,
  })),
  { id: JEUX_LIBRE_TOPIC, label: 'Libre', domain: 'jeux' },
]

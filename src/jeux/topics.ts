/** Thèmes Grilles de cartes = thèmes français avec banque Voc + mode Libre. */
import type { Topic } from '@/math/types'
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'

export const JEUX_LIBRE_TOPIC = 'jeux-libre'

/** Préfixe des thèmes jeux dérivés du français. */
export const JEUX_TOPIC_PREFIX = 'jeux-'

export function jeuxTopicIdFromFr(frTopicId: string): string {
  return `${JEUX_TOPIC_PREFIX}${frTopicId.replace(/^fr-/, '')}`
}

/** `jeux-famille` → `fr-famille` ; libre → undefined. */
export function frTopicFromJeuxTopic(jeuxTopic: string): string | undefined {
  if (!jeuxTopic || jeuxTopic === JEUX_LIBRE_TOPIC) return undefined
  if (jeuxTopic.startsWith('fr-')) return jeuxTopic
  if (jeuxTopic.startsWith(JEUX_TOPIC_PREFIX)) {
    return `fr-${jeuxTopic.slice(JEUX_TOPIC_PREFIX.length)}`
  }
  return undefined
}

export function isJeuxTopicId(topic: string): boolean {
  return topic === JEUX_LIBRE_TOPIC || topic.startsWith(JEUX_TOPIC_PREFIX)
}

export function isJeuxLibreTopic(topic: string): boolean {
  return topic === JEUX_LIBRE_TOPIC
}

/** Thèmes avec lexique (Invitation / Quotidien / Travail exclus s’ils sont vides). */
export const jeuxTopicsFromFr: Topic[] = [
  ...VOCAB_TOPIC_BANKS.map((meta) => ({
    id: jeuxTopicIdFromFr(meta.id),
    label: meta.label,
    domain: 'jeux' as const,
  })).sort((a, b) => a.label.localeCompare(b.label, 'fr')),
  { id: JEUX_LIBRE_TOPIC, label: 'Libre', domain: 'jeux' },
]

/** Thèmes Calligraphie = thèmes français avec banque Voc + mode Libre. */
import type { Topic } from '@/math/types'
import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'

export const CALLI_LIBRE_TOPIC = 'calli-libre'

/** Préfixe des thèmes calligraphie dérivés du français. */
export const CALLI_TOPIC_PREFIX = 'calli-'

export function calliTopicIdFromFr(frTopicId: string): string {
  return `${CALLI_TOPIC_PREFIX}${frTopicId.replace(/^fr-/, '')}`
}

/** `calli-famille` → `fr-famille` ; libre → undefined. */
export function frTopicFromCalliTopic(calliTopic: string): string | undefined {
  if (!calliTopic || calliTopic === CALLI_LIBRE_TOPIC) return undefined
  if (calliTopic.startsWith('fr-')) return calliTopic
  if (calliTopic.startsWith(CALLI_TOPIC_PREFIX)) {
    return `fr-${calliTopic.slice(CALLI_TOPIC_PREFIX.length)}`
  }
  return undefined
}

export function isCalligraphieTopicId(topic: string): boolean {
  return topic === CALLI_LIBRE_TOPIC || topic.startsWith(CALLI_TOPIC_PREFIX)
}

export function isCalliLibreTopic(topic: string): boolean {
  return topic === CALLI_LIBRE_TOPIC
}

/** Thèmes avec lexique (Invitation / Quotidien / Travail exclus s’ils sont vides). */
export const calligraphieTopics: Topic[] = [
  ...VOCAB_TOPIC_BANKS.map((meta) => ({
    id: calliTopicIdFromFr(meta.id),
    label: meta.label,
    domain: 'calligraphie' as const,
  })).sort((a, b) => a.label.localeCompare(b.label, 'fr')),
  { id: CALLI_LIBRE_TOPIC, label: 'Libre', domain: 'calligraphie' },
]

import { VOCAB_TOPIC_BANKS } from '@/francais/vocab-registry'
import { resolveGameImageSrc } from '@/jeux/image-resolve'

/** Index libellé (minuscule) → image Voc / lecture. */
const IMAGE_BY_LABEL: Map<string, string> = (() => {
  const map = new Map<string, string>()
  for (const topic of VOCAB_TOPIC_BANKS) {
    for (const subgroup of topic.subgroups) {
      for (const word of subgroup.words) {
        const key = word.label.trim().toLowerCase()
        const src = resolveGameImageSrc(word.label, word.imageSrc)
        if (key && src && !map.has(key)) map.set(key, src)
      }
    }
  }
  return map
})()

/** Résout une image pour un mot Soutien FR (vocabulaire en priorité). */
export function soutienImageFor(label: string): string | undefined {
  const key = label.trim().toLowerCase()
  if (!key) return undefined
  return IMAGE_BY_LABEL.get(key) ?? resolveGameImageSrc(label)
}

export function soutienEntriesWithImages(words: readonly string[]): Array<{
  id: string
  label: string
  imageSrc?: string
}> {
  return words.map((label, index) => ({
    id: `soutien-${index}-${label}`,
    label,
    imageSrc: soutienImageFor(label),
  }))
}

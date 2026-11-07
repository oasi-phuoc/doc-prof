import catalogData from './object-images.json'
import type { TcfExercise } from './types'

export type TcfObjectImage = { id: string; label: string; image: string; aliases: string[]; family: string; sha256: string; variants?: { image: string; sha256: string; aliases: string[] }[] }
export type TcfObjectPool = { transcription: string; heard: TcfObjectImage[]; absent: TcfObjectImage[] }
export const tcfObjectImages: readonly TcfObjectImage[] = catalogData
const normalize = (s: string) => s.toLowerCase().replace(/œ/g, 'oe').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

/** Select the transcript belonging to this exact track, never another dialogue. */
export function tcfObjectTranscription(exercise: TcfExercise, audio: string): string {
  const support = exercise.support as { audio?: string; audios?: string[]; transcription?: string | string[] }
  const refs = support.audios?.length ? support.audios : support.audio ? [support.audio] : []
  const index = refs.indexOf(audio)
  if (index < 0) return ''
  const value = support.transcription
  if (Array.isArray(value)) return value[index] ?? ''
  // A shared transcript for several separate files cannot prove which nouns are heard.
  return refs.length === 1 && typeof value === 'string' ? value : ''
}

/** Conservative noun matching: synonyms count once and compound nouns win. */
const poolCache = new Map<string, TcfObjectPool | undefined>()
export function tcfObjectPool(transcription: string): TcfObjectPool | undefined {
  if (poolCache.has(transcription)) return poolCache.get(transcription)
  const result = computeObjectPool(transcription)
  if (poolCache.size >= 4096) poolCache.clear()
  poolCache.set(transcription, result)
  return result
}

function computeObjectPool(transcription: string): TcfObjectPool | undefined {
  const text = ` ${normalize(transcription)} `
  const matches: { object: TcfObjectImage; start: number; end: number }[] = []
  const named = new Set<string>()
  for (const object of tcfObjectImages) {
    for (const alias of object.aliases) {
      const needle = ` ${normalize(alias)} `
      let from = 0
      while (from < text.length) {
        const start = text.indexOf(needle, from)
        if (start < 0) break
        from = start + 1
        named.add(object.id) // Even ambiguous mentions are never distractors.
        const before = text.slice(Math.max(0, start - 40), start)
        const after = text.slice(start + needle.length - 1, start + needle.length + 35)
        const nounPrefix = /\b(un|une|le|la|les|des|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs|ce|cet|cette|ces|deux|trois|quatre|cinq|du|de)\s*$/.test(before)
        if (object.id === 'train' && /\ben$/.test(before) && /^ de\b/.test(after)) continue
        if (['telephone', 'montre', 'lit'].includes(object.id) && !nounPrefix && needle.trim().split(' ').length === 1) continue
        if (object.id === 'table' && /^ des matieres\b/.test(after)) continue
        if (object.id === 'lettre' && (/^ [a-z](?: |$)/.test(after) || /alphabet|epeler|majuscule|orthographe/.test(text))) continue
        if (object.id === 'orange' && !/\b(fruit|fruits|manger|mange|manges|mangez|acheter|achete|jus|dessert|salade)\b/.test(text)) continue
        if (object.id === 'chat' && /\b(chat en ligne|forum|messagerie)\b/.test(text)) continue
        if (object.id === 'glace' && /\b(patinoire|verglas|gele|neige)\b/.test(text) && !/\b(dessert|manger|mange|chocolat|vanille)\b/.test(text)) continue
        if (object.id === 'verre' && /\ben$/.test(before)) continue
        const variant = object.variants?.find((v) => v.aliases.includes(alias))
        matches.push({ object: variant ? { ...object, image: variant.image, sha256: variant.sha256 } : object, start, end: start + needle.length })
      }
    }
  }
  matches.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start)
  const accepted: typeof matches = []
  const heard: TcfObjectImage[] = []
  for (const match of matches) {
    // Spaces at adjacent word boundaries may overlap; word characters may not.
    if (accepted.some((m) => match.start + 1 < m.end - 1 && match.end - 1 > m.start + 1)) continue
    accepted.push(match)
    if (!heard.some((o) => o.id === match.object.id || o.image === match.object.image)) heard.push(match.object)
  }
  // A generic category and its named subtype cannot create a third object.
  for (const generic of ['medicament', 'bijou']) {
    const index = heard.findIndex((o) => o.id === generic)
    if (index >= 0 && heard.some((o) => o.id !== generic && o.family === heard[index]!.family)) heard.splice(index, 1)
  }
  const families = new Set(heard.map((o) => o.family))
  const absent = tcfObjectImages.filter((o) => !named.has(o.id) && !families.has(o.family) && !heard.some((h) => h.image === o.image))
  return heard.length >= 3 && absent.length >= 2 ? { transcription, heard, absent } : undefined
}

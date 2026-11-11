import type { Question } from '../domain/types'
import type { MediaAsset, MediaPolicy, MediaResult } from './types'
import { mediaUrl } from './policy'

/** Public question data only: URL order never depends on which choice is correct. */
export function collectMedia(
  questions: readonly Question[],
  policy: MediaPolicy,
): MediaAsset[] {
  const assets = new Map<string, MediaAsset>()
  for (const q of questions) {
    const add = (source: string | undefined, kind: MediaAsset['kind']) => {
      if (!source) return
      const url = mediaUrl(source, policy) ?? source
      const current = assets.get(url)
      if (current) {
        if (!current.questionIds.includes(q.id)) current.questionIds.push(q.id)
        if (current.kind !== kind) current.conflictingKinds = true
      } else assets.set(url, { id: url, url, kind, questionIds: [q.id] })
    }
    add(q.audio, 'audio')
    q.audioParts?.forEach((part) => add(part, 'audio'))
    q.images.forEach((image) => add(image, 'image'))
    q.choices.forEach((choice) => {
      add(choice.image, 'image')
      add(choice.audio, 'audio')
    })
  }
  return [...assets.values()]
}

export function unavailableQuestionIds(
  results: readonly MediaResult[],
): Set<string> {
  return new Set(
    results
      .filter((result) =>
        ['missing', 'blocked', 'invalid'].includes(result.status),
      )
      .flatMap((result) => result.asset.questionIds),
  )
}

export function mediaLabel(asset: MediaAsset): string {
  if (/^(data|blob):/i.test(asset.url))
    return `${asset.kind === 'image' ? 'Image' : 'Audio'} importé`
  try {
    return (
      decodeURIComponent(
        new URL(asset.url).pathname.split('/').pop() ?? '',
      ).slice(0, 100) || 'Document'
    )
  } catch {
    return 'Adresse de média non admise'
  }
}

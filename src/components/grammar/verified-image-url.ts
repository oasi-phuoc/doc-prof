import type { GrammarImageSupport } from '@/grammaire/curriculum/types'
import { loadGrammarImage, validGrammarImage } from '@/grammaire/curriculum/image-support'

type SharedImage = { references: number; url?: string; ready: Promise<string> }
const images = new Map<string, SharedImage>()

/** Share a decoded image between preview and print, then release it on unmount. */
export function acquireGrammarImageUrl(
  support: GrammarImageSupport,
  resolvedSource: string,
  fetchMedia: typeof fetch = globalThis.fetch.bind(globalThis),
): { ready: Promise<string>; release: () => void } {
  if (!validGrammarImage(support)) return { ready: Promise.reject(new Error('Référence d’image invalide.')), release() {} }
  const key = JSON.stringify([support.src, support.sha256, resolvedSource])
  let shared = images.get(key)
  if (!shared) {
    const entry: SharedImage = { references: 0, ready: Promise.resolve('') }
    entry.ready = loadGrammarImage(support, (_source, options) => fetchMedia(resolvedSource, options)).then(blob => {
      const url = URL.createObjectURL(blob)
      if (entry.references === 0) URL.revokeObjectURL(url)
      else entry.url = url
      return url
    })
    images.set(key, entry)
    shared = entry
  }
  const entry = shared
  entry.references += 1
  let released = false
  return {
    ready: entry.ready,
    release() {
      if (released) return
      released = true
      entry.references -= 1
      if (entry.references === 0) {
        if (entry.url) URL.revokeObjectURL(entry.url)
        if (images.get(key) === entry) images.delete(key)
      }
    },
  }
}

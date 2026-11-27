import { useLayoutEffect, useRef, useState } from 'react'
import { readLibreImage } from '@/fiches/libre-media'

export function useLibreImages<T extends { id: string; imageSrc?: string }>(entries: T[], onChange: (next: T[]) => void) {
  const latest = useRef({ entries, onChange })
  const pending = useRef(new Map<string | null, symbol>())
  const [error, setError] = useState<string | null>(null)
  useLayoutEffect(() => { latest.current = { entries, onChange } }, [entries, onChange])
  useLayoutEffect(() => {
    const operations = pending.current
    return () => operations.clear()
  }, [])

  async function pickImage(file: File | undefined, id: string | null, setDraft?: (src: string) => void) {
    if (!file) return
    const previous = latest.current.entries.find((entry) => entry.id === id)
    const operation = Symbol()
    pending.current.set(id, operation)
    try {
      const imageSrc = await readLibreImage(file)
      if (pending.current.get(id) !== operation) return
      if (id === null) {
        setDraft?.(imageSrc)
      } else {
        const current = latest.current.entries.find((entry) => entry.id === id)
        if (!current || current.imageSrc !== previous?.imageSrc) return
        latest.current.onChange(latest.current.entries.map((entry) => entry === current
          ? { ...entry, imageSrc, imageHidden: undefined, libreImage: true }
          : entry))
      }
      setError(null)
    } catch (cause) {
      if (pending.current.get(id) === operation) setError(cause instanceof Error ? cause.message : 'Image refusée.')
    } finally {
      if (pending.current.get(id) === operation) pending.current.delete(id)
    }
  }

  return { error, setError, pickImage, cancelDraftImage: () => pending.current.delete(null) }
}

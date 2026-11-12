import { useEffect, useState } from 'react'
import { composeAudioParts } from './compose-audio'

type Result = { key: string; status: 'ready'; src: string } | { key: string; status: 'error' }

/** Temporary WAV URLs stay in memory; stored plans retain the original clip URLs. */
export function useAudioSequence(src: string, parts: readonly string[] | undefined, attempt: number) {
  const serialized = JSON.stringify(parts ?? null), key = JSON.stringify([src, serialized, attempt])
  const [result, setResult] = useState<Result>()
  useEffect(() => {
    const clips = JSON.parse(serialized) as string[] | null
    if (!clips) return
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000)
    let alive = true, url: string | undefined
    void composeAudioParts(clips, { baseUrl: window.location.href }, controller.signal).then((blob) => {
      if (!alive || controller.signal.aborted) return
      url = URL.createObjectURL(blob)
      setResult({ key, status: 'ready', src: url })
    }).catch(() => { if (alive) setResult({ key, status: 'error' }) }).finally(() => clearTimeout(timeout))
    return () => { alive = false; clearTimeout(timeout); controller.abort(); if (url) URL.revokeObjectURL(url) }
  }, [src, serialized, attempt, key])
  if (!parts) return { key, status: 'ready' as const, src }
  return result?.key === key ? result : { key, status: 'loading' as const }
}

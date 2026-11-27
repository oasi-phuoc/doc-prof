import { useEffect, useMemo, useRef, useState } from 'react'
import { MediaManager } from './manager'
import { unavailableQuestionIds } from './assets'
import type { MediaResult, PublicMediaPlan } from './types'
import { originalMedia, type MediaResolver } from './prepared-context'

type Run = {
  key: string
  results: MediaResult[]
  complete: boolean
  error?: string
  stored: MediaResolver
}
const EMPTY_RESULTS: MediaResult[] = []
export function useMediaPreflight(
  plan: PublicMediaPlan | null,
  enabled: boolean,
  stored: MediaResolver = originalMedia,
) {
  const [manager] = useState(
    () => new MediaManager({ baseUrl: window.location.href }),
  )
  const [attempt, setAttempt] = useState(0)
  const retryRequested = useRef('')
  const [run, setRun] = useState<Run>({ key: '', results: [], complete: false, stored })
  const key = `${plan?.id ?? ''}:${attempt}`
  const assets = useMemo(
    () => (plan ? manager.assets(plan) : []),
    [plan, manager],
  )
  useEffect(() => {
    manager.useStored(stored)
    if (!plan || !enabled) return
    const controller = new AbortController()
    const force = retryRequested.current === key
    retryRequested.current = ''
    void Promise.resolve()
      .then(async () => {
        if (controller.signal.aborted) return
        setRun({ key, results: [], complete: false, stored })
        const results = await manager.preflight(
          plan,
          controller.signal,
          (result) => {
            setRun((current) => ({
              key,
              results: [
                ...(current.key === key && current.stored === stored ? current.results : []),
                result,
              ],
              complete: false,
              stored,
            }))
          },
          force,
        )
        if (!controller.signal.aborted) setRun({ key, results, complete: true, stored })
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setRun({
            key,
            results: [],
            complete: false,
            stored,
            error:
              'La vérification a été interrompue. Réessayez pour préparer la séance.',
          })
      })
    return () => controller.abort()
  }, [plan, enabled, manager, attempt, key, stored])
  const current = run.key === key && run.stored === stored
  const results = current ? run.results : EMPTY_RESULTS
  const complete = !assets.length || (current && run.complete)
  const excluded = useMemo(() => unavailableQuestionIds(results), [results])
  return {
    manager,
    assets,
    results,
    excluded,
    complete,
    error: current ? run.error : undefined,
    retry: () => {
      retryRequested.current = `${plan?.id ?? ''}:${attempt + 1}`
      setAttempt((n) => n + 1)
    },
  }
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { MediaManager } from './manager'
import { unavailableQuestionIds } from './assets'
import type { MediaResult, PublicMediaPlan } from './types'

type Run = {
  key: string
  results: MediaResult[]
  complete: boolean
  error?: string
}
const EMPTY_RESULTS: MediaResult[] = []
export function useMediaPreflight(
  plan: PublicMediaPlan | null,
  enabled: boolean,
) {
  const [manager] = useState(
    () => new MediaManager({ baseUrl: window.location.href }),
  )
  const [attempt, setAttempt] = useState(0)
  const retryRequested = useRef('')
  const [run, setRun] = useState<Run>({ key: '', results: [], complete: false })
  const key = `${plan?.id ?? ''}:${attempt}`
  const assets = useMemo(
    () => (plan ? manager.assets(plan) : []),
    [plan, manager],
  )
  useEffect(() => {
    if (!plan || !enabled) return
    const controller = new AbortController()
    const force = retryRequested.current === key
    retryRequested.current = ''
    void Promise.resolve()
      .then(async () => {
        if (controller.signal.aborted) return
        setRun({ key, results: [], complete: false })
        const results = await manager.preflight(
          plan,
          controller.signal,
          (result) => {
            setRun((current) => ({
              key,
              results: [
                ...(current.key === key ? current.results : []),
                result,
              ],
              complete: false,
            }))
          },
          force,
        )
        if (!controller.signal.aborted) setRun({ key, results, complete: true })
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setRun({
            key,
            results: [],
            complete: false,
            error:
              'La vérification a été interrompue. Réessayez pour préparer la séance.',
          })
      })
    return () => controller.abort()
  }, [plan, enabled, manager, attempt, key])
  const results = run.key === key ? run.results : EMPTY_RESULTS
  const complete = !assets.length || (run.key === key && run.complete)
  const excluded = useMemo(() => unavailableQuestionIds(results), [results])
  return {
    manager,
    assets,
    results,
    excluded,
    complete,
    error: run.key === key ? run.error : undefined,
    retry: () => {
      retryRequested.current = `${plan?.id ?? ''}:${attempt + 1}`
      setAttempt((n) => n + 1)
    },
  }
}

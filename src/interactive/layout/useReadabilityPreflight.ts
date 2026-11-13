import { useEffect, useState, useSyncExternalStore } from 'react'
import { inspectReadability, type ReadabilityOptions, type ReadabilityPlan, type ReadabilityResult } from './preflight'
import { originalMedia, type MediaResolver } from '../media/prepared-context'

type Run = { key: string; done: number; total: number; results: ReadabilityResult[]; complete: boolean; error?: string }
const cache = new Map<string, ReadabilityResult[]>()
const subscribe = (changed: () => void) => { window.addEventListener('resize', changed); return () => window.removeEventListener('resize', changed) }
const viewport = () => window.innerWidth <= 700 ? `${window.innerWidth}:${window.innerHeight}` : 'desktop'
export function useReadabilityPreflight(plan: ReadabilityPlan | null, options: ReadabilityOptions, enabled: boolean, resolve: MediaResolver = originalMedia) {
  const size = useSyncExternalStore(subscribe, viewport)
  const key = JSON.stringify([plan?.id, plan?.questions, plan?.rounds, options, size])
  const [run, setRun] = useState<Run>({ key: '', done: 0, total: 0, results: [], complete: false })
  useEffect(() => {
    if (!enabled || !plan?.questions.length) return
    const controller = new AbortController()
    const cached = cache.get(key)
    void Promise.resolve().then(async () => {
      if (controller.signal.aborted) return
      if (cached) { setRun({ key, done: 0, total: 0, results: cached, complete: true }); return }
      setRun({ key, done: 0, total: 0, results: [], complete: false })
      const results = await inspectReadability(plan, options, controller.signal, (done, total) => {
        if (!controller.signal.aborted) setRun({ key, done, total, results: [], complete: false })
      }, resolve)
      if (!controller.signal.aborted) {
        if (cache.size >= 6) cache.delete(cache.keys().next().value!)
        cache.set(key, results); setRun({ key, done: 0, total: 0, results, complete: true })
      }
    }).catch(() => { if (!controller.signal.aborted) setRun({ key, done: 0, total: 0, results: [], complete: true, error: 'Le contrôle de lisibilité n’a pas abouti. Vérifiez l’affichage des questions sur cet écran.' }) })
    return () => controller.abort()
  }, [key, enabled, plan, options, resolve])
  if (!plan?.questions.length) return { done: 0, total: 0, results: [], complete: true }
  return run.key === key ? { done: run.done, total: run.total, results: run.results, complete: run.complete, error: run.error } : { done: 0, total: 0, results: [], complete: false }
}

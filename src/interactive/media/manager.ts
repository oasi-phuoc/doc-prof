import { collectMedia } from './assets'
import { aborted } from './decode'
import { mediaUrl } from './policy'
import { browserDependencies, probeMedia } from './probe'
import type {
  MediaAsset,
  MediaProbeDependencies,
  MediaProbeOptions,
  MediaResult,
  PublicMediaPlan,
} from './types'
import type { MediaResolver } from './prepared-context'
import { originalMedia } from './prepared-context'
import { loadFractionDrawing } from './fraction-drawing'

type Cached = { result: MediaResult; checkedAt: number }
export class MediaManager {
  private readonly cache = new Map<string, Cached>()
  private readonly deps: MediaProbeDependencies
  private readonly options: MediaProbeOptions
  private prepared: MediaResolver = originalMedia
  private stored: MediaResolver = originalMedia
  private resolve: MediaResolver = source => {
    const temporary = this.prepared(source)
    return temporary === source ? this.stored(source) : temporary
  }
  constructor(options: MediaProbeOptions, deps?: MediaProbeDependencies) {
    this.options = options
    this.deps = deps ?? browserDependencies()
  }

  assets(plan: PublicMediaPlan): MediaAsset[] {
    return collectMedia(plan.questions, this.options)
  }

  usePrepared(resolve: MediaResolver): void {
    this.prepared = resolve
    this.cache.clear()
  }

  useStored(resolve: MediaResolver): void {
    if (this.stored === resolve) return
    this.stored = resolve
    this.cache.clear()
  }

  async preflight(
    plan: PublicMediaPlan,
    signal: AbortSignal,
    onResult?: (result: MediaResult) => void,
    retry = false,
  ): Promise<MediaResult[]> {
    if (plan.questions.some(question => question.fractionFigure)) await loadFractionDrawing()
    if (signal.aborted) throw aborted()
    const assets = this.assets(plan)
    const results: MediaResult[] = Array(assets.length)
    let next = 0
    const worker = async () => {
      while (next < assets.length) {
        if (signal.aborted) throw aborted()
        const index = next++
        const asset = assets[index]!
        const cached = this.cache.get(`${asset.kind}:${asset.url}`)
        const useCache =
          !retry &&
          !asset.conflictingKinds &&
          cached &&
          this.deps.now() - cached.checkedAt < 300000
        const source = mediaUrl(asset.url, this.options)
        const prepared = source ? mediaUrl(this.resolve(source), this.options) : null
        const target = prepared && prepared !== asset.url ? { ...asset, url: prepared } : asset
        const result = useCache
          ? { ...cached.result, asset }
          : { ...await probeMedia(target, this.options, signal, this.deps), asset }
        if (signal.aborted) throw aborted()
        results[index] = result
        if (!asset.conflictingKinds)
          this.cache.set(`${asset.kind}:${asset.url}`, {
            result,
            checkedAt: this.deps.now(),
          })
        onResult?.(result)
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(4, assets.length) }, worker),
    )
    return results
  }

  /** Warm every asset of the next screen equally. Never inspect a correction. */
  async preload(plan: PublicMediaPlan, signal: AbortSignal, resolve: MediaResolver = this.resolve): Promise<void> {
    const assets = this.assets(plan)
    let next = 0
    const worker = async () => {
      while (next < assets.length && !signal.aborted) {
        const asset = assets[next++]!
        const cached = this.cache.get(`${asset.kind}:${asset.url}`)
        if (cached && !['ok', 'slow'].includes(cached.result.status)) continue
        const source = mediaUrl(asset.url, this.options)
        const url = source ? mediaUrl(resolve(source), this.options) : null
        if (!url) continue
        const controller = new AbortController()
        const stop = () => controller.abort()
        signal.addEventListener('abort', stop, { once: true })
        const timeout = setTimeout(stop, this.options.timeoutMs ?? 8000)
        try {
          await (asset.kind === 'image'
            ? this.deps.decodeImage(url, controller.signal)
            : this.deps.decodeAudio(url, controller.signal))
        } catch {
          /* Runtime rendering supplies an explicit retry/skip fallback. */
        } finally {
          clearTimeout(timeout)
          signal.removeEventListener('abort', stop)
        }
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(4, assets.length) }, worker),
    )
  }
}

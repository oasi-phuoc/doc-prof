import { acceptableMime, mediaUrl } from './policy'
import { aborted, decodeAudio, decodeImage } from './decode'
import type {
  MediaAsset,
  MediaProbeDependencies,
  MediaProbeOptions,
  MediaResult,
  MediaStatus,
} from './types'

export const browserDependencies = (): MediaProbeDependencies => ({
  fetch: window.fetch.bind(window),
  decodeImage,
  decodeAudio,
  now: () => performance.now(),
})

export function responseBytes(headers: Headers): number | undefined {
  const range = headers.get('content-range')?.match(/\/(\d+)$/)?.[1]
  const value = range ?? headers.get('content-length')
  if (value === null || value === undefined) return undefined
  const bytes = Number(value)
  return Number.isSafeInteger(bytes) && bytes >= 0 ? bytes : undefined
}

function statusMessage(status: MediaStatus): string {
  return {
    ok: 'Disponible',
    slow: 'Disponible, chargement lent',
    missing: 'Fichier absent. Réessayez ou retirez les questions concernées.',
    blocked: 'Média inaccessible. Vérifiez la connexion ou l’accès au fichier.',
    invalid:
      'Fichier illisible ou format incorrect. Remplacez le média dans la fiche.',
    timeout:
      'Le contrôle a pris trop de temps. Vous pouvez réessayer ou continuer.',
  }[status]
}

/** One deadline covers the HTTP probe and the actual browser decoder. */
export async function probeMedia(
  asset: MediaAsset,
  options: MediaProbeOptions,
  external: AbortSignal,
  deps: MediaProbeDependencies = browserDependencies(),
): Promise<MediaResult> {
  const started = deps.now()
  const controller = new AbortController()
  let timedOut = false
  const stop = () => controller.abort()
  if (external.aborted) throw aborted()
  external.addEventListener('abort', stop, { once: true })
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, options.timeoutMs ?? 8000)
  const result = (
    status: MediaStatus,
    extra: Partial<MediaResult> = {},
  ): MediaResult => ({
    asset,
    status,
    message: statusMessage(status),
    elapsedMs: Math.max(0, deps.now() - started),
    ...extra,
  })
  const signal = controller.signal
  try {
    const url = mediaUrl(asset.url, options)
    if (!url)
      return result('blocked', {
        message:
          'Cette adresse de média n’est pas admise. Utilisez un fichier de la banque ou une image importée.',
      })
    if (asset.conflictingKinds) return result('invalid')
    const request = async (range: boolean) => {
      const response = await deps.fetch(url, {
        method: 'GET',
        headers: range ? { Range: 'bytes=0-0' } : undefined,
        credentials: 'same-origin',
        referrerPolicy: 'no-referrer',
        redirect: 'manual',
        signal,
      })
      await response.body?.cancel()
      return response
    }
    let response = await request(true)
    if ([400, 405, 416, 501].includes(response.status))
      response = await request(false)
    if ([404, 410].includes(response.status)) return result('missing')
    if (
      [401, 403].includes(response.status) ||
      ['opaque', 'opaqueredirect'].includes(response.type) ||
      [301, 302, 303, 307, 308].includes(response.status)
    )
      return result('blocked')
    if (!response.ok) return result('invalid')
    if (response.redirected && !mediaUrl(response.url, options))
      return result('blocked')
    const bytes = responseBytes(response.headers)
    const maximum = (asset.kind === 'image' ? 32 : 128) * 1024 * 1024
    if (
      !acceptableMime(asset.kind, response.headers.get('content-type')) ||
      bytes === 0 ||
      (bytes !== undefined && bytes > maximum)
    )
      return result('invalid', { bytes })
    let metadata
    try {
      metadata = await (asset.kind === 'image'
        ? deps.decodeImage(url, signal)
        : deps.decodeAudio(url, signal))
    } catch (error) {
      if (signal.aborted) throw error
      return result(
        error instanceof Error && error.message === 'blocked'
          ? 'blocked'
          : 'invalid',
        { bytes },
      )
    }
    if (signal.aborted) throw aborted()
    return result(
      deps.now() - started > (options.slowMs ?? 3000) ? 'slow' : 'ok',
      {
        ...metadata,
        bytes,
        large:
          bytes !== undefined &&
          bytes > (asset.kind === 'image' ? 2 : 10) * 1024 * 1024,
      },
    )
  } catch {
    if (external.aborted) throw aborted()
    return result(timedOut ? 'timeout' : 'blocked')
  } finally {
    clearTimeout(timeout)
    external.removeEventListener('abort', stop)
  }
}

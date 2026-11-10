import type { MediaKind, MediaPolicy } from './types'

// No remote origin is enabled by default. Extend this with the deployed media
// CSP allowlist when a reviewed remote bank is introduced; never use a wildcard.
export const MEDIA_ALLOWED_ORIGINS: readonly string[] = []
export const MAX_INLINE_BYTES = 2 * 1024 * 1024

export function mediaUrl(source: string, policy: MediaPolicy): string | null {
  try {
    const url = new URL(source, policy.baseUrl)
    if (url.username || url.password) return null
    if (url.protocol === 'data:') {
      if (
        !/^data:(?:image|audio)\/[a-z0-9.+-]+(?:;[a-z0-9=.+-]+)*,/i.test(source)
      )
        return null
      const payload = source.slice(source.indexOf(',') + 1)
      let bytes
      if (/;base64,/i.test(source)) {
        const compact = payload.replace(/\s/g, '')
        if (!/^[a-z0-9+/]*={0,2}$/i.test(compact) || compact.length % 4 === 1)
          return null
        bytes =
          Math.floor((compact.length * 3) / 4) -
          (compact.match(/=*$/)?.[0].length ?? 0)
      } else
        bytes = new TextEncoder().encode(decodeURIComponent(payload)).byteLength
      return bytes <= MAX_INLINE_BYTES ? source : null
    }
    const origin = new URL(policy.baseUrl).origin
    if (url.protocol === 'blob:') return url.origin === origin ? url.href : null
    if (!['http:', 'https:'].includes(url.protocol)) return null
    if (
      url.origin !== origin &&
      !(policy.allowedOrigins ?? MEDIA_ALLOWED_ORIGINS).includes(url.origin)
    )
      return null
    url.hash = ''
    return url.href
  } catch {
    return null
  }
}

export function browserMediaUrl(source: string): string | null {
  return mediaUrl(source, { baseUrl: window.location.href })
}

export function acceptableMime(kind: MediaKind, mime: string | null): boolean {
  const type = mime?.split(';')[0]?.trim().toLowerCase()
  return (
    !type || type === 'application/octet-stream' || type.startsWith(`${kind}/`)
  )
}

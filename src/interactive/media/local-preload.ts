import { requestLocal } from '../storage'
import { MAX_PRELOAD_BYTES, MAX_PRELOAD_FILE_BYTES } from './full-preload'
import { mediaUrl } from './policy'

const id = 'prepared-public-media'
const lifetime = 7 * 24 * 60 * 60 * 1000
export type LocalMediaFiles = ReadonlyMap<string, Blob>

function publicAsset(source: string, baseUrl: string): boolean {
  if (!source.startsWith('http') || mediaUrl(source, { baseUrl }) !== source) return false
  const url = new URL(source)
  return !url.search && /^\/(?:lib\/(?:audio|images)|assets)\/.+/.test(url.pathname)
}

export function canKeepMedia(files: LocalMediaFiles, baseUrl: string): boolean {
  let bytes = 0
  return files.size > 0 && files.size <= 1024 && [...files].every(([url, blob]) => {
    if (!publicAsset(url, baseUrl) || !(blob instanceof Blob) || !blob.size || blob.size > MAX_PRELOAD_FILE_BYTES ||
        !(/^(?:image|audio)\//.test(blob.type) || blob.type === 'application/octet-stream')) return false
    bytes += blob.size
    return bytes <= MAX_PRELOAD_BYTES
  })
}

function readFiles(value: unknown, baseUrl: string, now: number): LocalMediaFiles | undefined {
  if (!value || typeof value !== 'object') return undefined
  const row = value as { version?: unknown; savedAt?: unknown; files?: unknown }
  if (row.version !== 1 || typeof row.savedAt !== 'number' || !Number.isFinite(row.savedAt) || row.savedAt > now + 60_000 ||
      row.savedAt <= now - lifetime || !Array.isArray(row.files) || row.files.length > 1024) return undefined
  const files = new Map<string, Blob>()
  for (const entry of row.files) {
    if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string' || files.has(entry[0]) || !(entry[1] instanceof Blob)) return undefined
    files.set(entry[0], entry[1])
  }
  return canKeepMedia(files, baseUrl) ? files : undefined
}

export async function loadLocalMedia(baseUrl: string) {
  let files: LocalMediaFiles | undefined
  await requestLocal('settings', 'readwrite', store => {
    const request = store.get(id)
    request.onsuccess = () => {
      files = readFiles(request.result, baseUrl, Date.now())
      if (!files && request.result !== undefined) store.delete(id)
    }
    return request
  })
  return files
}

export async function keepLocalMedia(files: LocalMediaFiles, baseUrl: string) {
  if (!canKeepMedia(files, baseUrl)) throw new Error('La conservation locale est réservée aux médias publics du jeu.')
  await requestLocal('settings', 'readwrite', store => store.put({ id, version: 1, savedAt: Date.now(), files: [...files] }))
}

export function forgetLocalMedia() {
  return requestLocal('settings', 'readwrite', store => store.delete(id))
}

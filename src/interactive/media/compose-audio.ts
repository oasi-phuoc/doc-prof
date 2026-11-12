import { encodeWav } from '@/tcm-cfr/audio-nombres'
import { MAX_AUDIO_PARTS } from '../domain/audio'
import { aborted } from './decode'
import { acceptableMime, mediaUrl } from './policy'
import type { MediaPolicy } from './types'

export const MAX_SEQUENCE_BYTES = 32 * 1024 * 1024
export const MAX_SEQUENCE_SECONDS = 120
type Dependencies = { fetch: typeof fetch; createContext: () => AudioContext }

function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) { void promise.catch(() => {}); return Promise.reject(aborted()) }
  return new Promise((resolve, reject) => {
    const stop = () => reject(aborted())
    signal.addEventListener('abort', stop, { once: true })
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', stop))
  })
}
async function bytes(response: Response, remaining: number, signal: AbortSignal): Promise<ArrayBuffer> {
  if (Number(response.headers.get('content-length')) > remaining) throw new Error('Audio trop volumineux.')
  if (!response.body) {
    const data = await abortable(response.arrayBuffer(), signal)
    if (data.byteLength > remaining) throw new Error('Audio trop volumineux.')
    return data
  }
  const reader = response.body.getReader(), chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const chunk = await abortable(reader.read(), signal)
      if (chunk.done) break
      size += chunk.value.byteLength
      if (size > remaining) throw new Error('Audio trop volumineux.')
      chunks.push(chunk.value)
    }
  } catch (error) { void reader.cancel().catch(() => {}); throw error }
  finally { reader.releaseLock() }
  const data = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength }
  return data.buffer
}

/** Decode all clips before publishing a single, seekable recording. Never play a prefix. */
export async function composeAudioParts(parts: readonly string[], policy: MediaPolicy, signal: AbortSignal, dependencies?: Dependencies): Promise<Blob> {
  if (!Array.isArray(parts) || !parts.length || parts.length > MAX_AUDIO_PARTS) throw new Error('Séquence audio invalide.')
  const urls = parts.map((part) => typeof part === 'string' ? mediaUrl(part, policy) : null)
  if (urls.some((url) => !url)) throw new Error('Adresse audio non autorisée.')
  if (signal.aborted) throw aborted()
  const deps = dependencies ?? { fetch: globalThis.fetch.bind(globalThis), createContext: () => new AudioContext() }
  const context = deps.createContext(), decoded = new Map<string, AudioBuffer>(), sequence: AudioBuffer[] = []
  let size = 0, seconds = 0
  try {
    for (const url of urls as string[]) {
      if (signal.aborted) throw aborted()
      let buffer = decoded.get(url)
      if (!buffer) {
        const response = await abortable(deps.fetch(url, { signal, credentials: 'same-origin', redirect: 'error', cache: 'force-cache' }), signal)
        if (!response.ok || !acceptableMime('audio', response.headers.get('content-type'))) throw new Error('Extrait audio indisponible.')
        const data = await bytes(response, MAX_SEQUENCE_BYTES - size, signal)
        size += data.byteLength
        if (!data.byteLength) throw new Error('Extrait audio vide.')
        buffer = await abortable(context.decodeAudioData(data), signal)
        if (!Number.isFinite(buffer.duration) || buffer.duration <= 0 || buffer.duration > MAX_SEQUENCE_SECONDS || buffer.numberOfChannels < 1 || buffer.numberOfChannels > 2 || buffer.sampleRate !== context.sampleRate) throw new Error('Extrait audio invalide.')
        decoded.set(url, buffer)
      }
      seconds += buffer.duration
      if (seconds > MAX_SEQUENCE_SECONDS) throw new Error('Séquence audio trop longue.')
      sequence.push(buffer)
    }
    if (signal.aborted) throw aborted()
    const channels = Math.max(...sequence.map((buffer) => buffer.numberOfChannels))
    const output = context.createBuffer(channels, sequence.reduce((sum, buffer) => sum + buffer.length, 0), context.sampleRate)
    let offset = 0
    for (const buffer of sequence) {
      for (let channel = 0; channel < channels; channel++) output.getChannelData(channel).set(buffer.getChannelData(Math.min(channel, buffer.numberOfChannels - 1)), offset)
      offset += buffer.length
    }
    return encodeWav(output)
  } finally { await context.close().catch(() => {}) }
}

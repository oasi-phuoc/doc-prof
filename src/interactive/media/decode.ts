import type { MediaMetadata } from './types'

export function aborted(): DOMException {
  return new DOMException('Contrôle annulé', 'AbortError')
}

export function decodeImage(
  url: string,
  signal: AbortSignal,
): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(aborted())
      return
    }
    const image = new Image()
    const cleanup = () => {
      signal.removeEventListener('abort', stop)
      image.onload = null
      image.onerror = null
      image.removeAttribute('src')
    }
    const fail = (error: unknown) => {
      cleanup()
      reject(error)
    }
    const stop = () => fail(aborted())
    signal.addEventListener('abort', stop, { once: true })
    image.referrerPolicy = 'no-referrer'
    image.crossOrigin = 'anonymous'
    image.onerror = () => fail(new Error('invalid'))
    image.onload = () => {
      void image
        .decode()
        .then(() => {
          if (!image.naturalWidth || !image.naturalHeight)
            throw new Error('invalid')
          const metadata = {
            width: image.naturalWidth,
            height: image.naturalHeight,
          }
          cleanup()
          resolve(metadata)
        })
        .catch(fail)
    }
    image.src = url
  })
}

export function decodeAudio(
  url: string,
  signal: AbortSignal,
): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(aborted())
      return
    }
    const audio = document.createElement('audio')
    const cleanup = () => {
      signal.removeEventListener('abort', stop)
      audio.onloadedmetadata = null
      audio.onerror = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    const fail = (error: unknown) => {
      cleanup()
      reject(error)
    }
    const stop = () => fail(aborted())
    signal.addEventListener('abort', stop, { once: true })
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
    audio.onloadedmetadata = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        fail(new Error('invalid'))
        return
      }
      const metadata = { durationSec: audio.duration }
      cleanup()
      resolve(metadata)
    }
    audio.onerror = () =>
      fail(new Error(audio.error?.code === 2 ? 'blocked' : 'invalid'))
    audio.src = url
    audio.load()
  })
}

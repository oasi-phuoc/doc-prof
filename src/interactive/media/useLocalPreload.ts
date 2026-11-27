import { useEffect, useMemo, useState } from 'react'
import { canKeepMedia, forgetLocalMedia, keepLocalMedia, loadLocalMedia, type LocalMediaFiles } from './local-preload'
import { mediaUrl } from './policy'
import { originalMedia } from './prepared-context'

export function useLocalPreload() {
  const [files, setFiles] = useState<LocalMediaFiles | null | undefined>(undefined)
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')
  const [using, setUsing] = useState(() => !navigator.onLine)
  const origin = window.location.origin
  useEffect(() => {
    let active = true
    void loadLocalMedia(origin).then(
      value => { if (active) setFiles(value ?? null) },
      () => { if (active) setFiles(null) },
    )
    return () => { active = false }
  }, [origin])
  const urls = useMemo(() => new Map<string, string>(), [files])
  useEffect(() => () => {
    for (const url of urls.values()) URL.revokeObjectURL(url)
    urls.clear()
  }, [urls])
  const resolve = useMemo(() => files && using ? (source: string) => {
    const key = mediaUrl(source, { baseUrl: origin })
    const blob = key ? files.get(key) : undefined
    if (!key || !blob) return source
    let url = urls.get(key)
    if (!url) { url = URL.createObjectURL(blob); urls.set(key, url) }
    return url
  } : originalMedia, [files, origin, urls, using])

  async function keep(next: LocalMediaFiles) {
    const copy = new Map(next)
    setPending(true)
    setMessage('')
    try {
      await keepLocalMedia(copy, origin)
      setFiles(copy)
      setMessage('Médias conservés sur cet appareil pendant sept jours.')
    } catch {
      setMessage('Le stockage local est indisponible. La séance préchargée reste prête dans cette page.')
    } finally { setPending(false) }
  }

  async function forget() {
    setPending(true)
    setMessage('')
    try {
      await forgetLocalMedia()
      setFiles(null)
      setMessage('Les médias conservés ont été supprimés.')
    } catch { setMessage('Le navigateur a refusé de supprimer les médias conservés.') }
    finally { setPending(false) }
  }

  const useStoredMedia = () => {
    setUsing(true)
    setMessage('Les médias conservés sont utilisés pour cette visite.')
  }
  return { loading: files === undefined, stored: !!files, pending, message, using, useStoredMedia, resolve, keep, forget, canKeep: (next: LocalMediaFiles) => canKeepMedia(next, origin) }
}

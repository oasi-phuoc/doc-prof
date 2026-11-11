import { useLayoutEffect, useRef, useState } from 'react'
import { fitQuestion, naturalReadability, readabilitySignature, type Readability } from './fit'

export function useReadableQuestion(contentKey: string) {
  const section = useRef<HTMLElement>(null)
  const [report, setReport] = useState<Readability>(naturalReadability)
  useLayoutEffect(() => {
    const root = section.current?.parentElement
    if (!root) return
    let disposed = false, frame = 0, signature = ''
    const measure = (force = false) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (disposed || !root.isConnected || !root.getClientRects().length) return
        const next = readabilitySignature(root)
        if (!force && signature === next) return
        signature = next
        const result = fitQuestion(root)
        setReport((before) => JSON.stringify(before) === JSON.stringify(result) ? before : result)
      })
    }
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => measure()) : undefined
    observer?.observe(root)
    const footer = root.closest('.ci-session')?.querySelector('.ci-controls')
    if (footer) observer?.observe(footer)
    const loaded = () => measure(true)
    root.addEventListener('load', loaded, true)
    root.addEventListener('click', loaded)
    window.addEventListener('resize', loaded)
    void root.ownerDocument.fonts.ready.then(() => { if (!disposed) measure(true) })
    measure(true)
    return () => { disposed = true; cancelAnimationFrame(frame); observer?.disconnect(); root.removeEventListener('load', loaded, true); root.removeEventListener('click', loaded); window.removeEventListener('resize', loaded) }
  }, [contentKey])
  return { section, report }
}

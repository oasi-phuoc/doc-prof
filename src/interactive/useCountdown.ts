import { useEffect, useRef, useState } from 'react'

/** Counts active time only; pause, hidden tabs and reload preserve the remainder. */
export function useCountdown({
  durationMs,
  initialRemainingMs = durationMs,
  running,
  onElapsed,
  onRemaining,
}: {
  durationMs: number
  initialRemainingMs?: number
  running: boolean
  onElapsed?: () => void
  onRemaining?: (remainingMs: number) => void
}) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.min(durationMs, initialRemainingMs)),
  )
  const value = useRef(remaining)
  const notified = useRef(false)
  const callbacks = useRef({ onElapsed, onRemaining })
  useEffect(() => {
    callbacks.current = { onElapsed, onRemaining }
  }, [onElapsed, onRemaining])
  useEffect(() => {
    callbacks.current.onRemaining?.(value.current)
  }, [])
  useEffect(() => {
    if (!running || value.current <= 0) return
    let previous = performance.now()
    const tick = () => {
      if (value.current <= 0) return
      const now = performance.now()
      value.current = Math.max(0, value.current - (now - previous))
      previous = now
      setRemaining(value.current)
      callbacks.current.onRemaining?.(value.current)
      if (value.current === 0) window.clearInterval(id)
    }
    const id = window.setInterval(tick, 100)
    return () => {
      window.clearInterval(id)
      tick()
    }
  }, [running])
  useEffect(() => {
    if (!running || remaining > 0 || notified.current) return
    notified.current = true
    callbacks.current.onElapsed?.()
  }, [running, remaining])
  return remaining
}

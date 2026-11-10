import { useEffect, useRef, useState } from 'react'
import type { TimerSettings } from '../domain/settings'
export function ReflectionTimer({
  settings,
  running,
  waitingForAudio,
  audioFailed,
  onAudioOverride,
}: {
  settings: TimerSettings
  running: boolean
  waitingForAudio: boolean
  audioFailed: boolean
  onAudioOverride: () => void
}) {
  const [remaining, setRemaining] = useState(settings.seconds * 1000)
  const elapsed = useRef(0)
  useEffect(() => {
    if (!settings.enabled || !running || waitingForAudio) return
    let previous = performance.now()
    const tick = () => {
      const now = performance.now()
      elapsed.current += now - previous
      previous = now
      setRemaining(Math.max(0, settings.seconds * 1000 - elapsed.current))
    }
    const id = window.setInterval(tick, 100)
    return () => {
      window.clearInterval(id)
      tick()
    }
  }, [running, waitingForAudio, settings.enabled, settings.seconds])
  const seconds = Math.ceil(remaining / 1000)
  return (
    <div className="ci-timer">
      <output
        aria-label="Temps de réflexion restant"
        className="ci-timer-value"
      >
        {settings.enabled
          ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
          : 'Sans minuteur'}
      </output>
      {audioFailed && waitingForAudio && (
        <button onClick={onAudioOverride}>
          Démarrer le temps de réflexion
        </button>
      )}
    </div>
  )
}

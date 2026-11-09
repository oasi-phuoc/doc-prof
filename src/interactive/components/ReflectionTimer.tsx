import { useEffect, useRef, useState } from 'react'
import { Icon, IconButton } from './Icons'
import { validSeconds, type TimerSettings } from '../domain/settings'
export function ReflectionTimer({
  settings,
  running,
  waitingForAudio,
  audioFailed,
  onAudioOverride,
  onChange,
}: {
  settings: TimerSettings
  running: boolean
  waitingForAudio: boolean
  audioFailed: boolean
  onAudioOverride: () => void
  onChange: (settings: TimerSettings) => void
}) {
  const [remaining, setRemaining] = useState(settings.seconds * 1000)
  const [reset, setReset] = useState(0)
  const elapsed = useRef(0)
  const [configured, setConfigured] = useState(false)
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
  }, [running, waitingForAudio, settings.enabled, settings.seconds, reset])
  const seconds = Math.ceil(remaining / 1000)
  return (
    <div className="ci-timer">
      <Icon name="timer" />
      <output
        aria-label="Temps de réflexion restant"
        className="ci-timer-value"
      >
        {settings.enabled
          ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
          : 'Sans minuteur'}
      </output>
      <span className="ci-timer-status" role="status">
        {settings.enabled &&
          (waitingForAudio
            ? 'Après l’écoute'
            : seconds === 0
              ? 'Temps écoulé · à votre rythme'
              : running
                ? 'Temps de réflexion'
                : 'Minuteur en pause')}
      </span>
      <IconButton
        icon="reset"
        label="Relancer le minuteur"
        onClick={() => {
          elapsed.current = 0
          setRemaining(settings.seconds * 1000)
          setReset((n) => n + 1)
        }}
      />
      <button
        className="ci-timer-config"
        aria-expanded={configured}
        onClick={() => setConfigured((c) => !c)}
      >
        Régler
      </button>
      {configured && (
        <div className="ci-timer-options">
          <label>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                onChange({ ...settings, enabled: e.target.checked })
              }
            />{' '}
            Activer le minuteur
          </label>
          <label>
            Temps de réflexion (secondes){' '}
            <input
              type="number"
              min="5"
              max="600"
              value={settings.seconds}
              onChange={(e) => {
                const seconds = validSeconds(Number(e.target.value))
                elapsed.current = 0
                setRemaining(seconds * 1000)
                onChange({ ...settings, seconds })
              }}
            />
          </label>
        </div>
      )}
      {audioFailed && waitingForAudio && (
        <button onClick={onAudioOverride}>
          Démarrer le temps de réflexion
        </button>
      )}
    </div>
  )
}

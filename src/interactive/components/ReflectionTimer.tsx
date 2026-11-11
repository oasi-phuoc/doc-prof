import { useCountdown } from '../useCountdown'
import type { TimerSettings } from '../domain/settings'
export function ReflectionTimer({
  settings,
  running,
  waitingForAudio,
  audioFailed,
  onAudioOverride,
  onElapsed,
  initialRemainingMs,
  onRemaining,
  controlsDisabled = false,
}: {
  initialRemainingMs?: number
  onRemaining?: (remainingMs: number) => void
  controlsDisabled?: boolean
  onElapsed?: () => void
  settings: TimerSettings
  running: boolean
  waitingForAudio: boolean
  audioFailed: boolean
  onAudioOverride: () => void
}) {
  const remaining = useCountdown({
    durationMs: settings.seconds * 1000,
    initialRemainingMs,
    running: settings.enabled && running && !waitingForAudio,
    onElapsed,
    onRemaining,
  })
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
        <button disabled={controlsDisabled} onClick={onAudioOverride}>
          Démarrer le temps de réflexion
        </button>
      )}
    </div>
  )
}

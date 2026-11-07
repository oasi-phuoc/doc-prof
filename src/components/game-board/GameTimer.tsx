import { useEffect, useRef, useState } from 'react'

function formatTimer(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function playChime(ctx: AudioContext) {
  const now = ctx.currentTime
  for (const [index, freq] of [523.25, 659.25, 783.99].entries()) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const start = now + index * 0.18
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.75)
  }
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.trunc(value)))
}

/** Minuteur : on règle une durée, il compte à rebours, puis il sonne. */
export function GameTimer() {
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [leftMs, setLeftMs] = useState(0)
  const endsAt = useRef(0)
  const finished = useRef(false)
  const audio = useRef<AudioContext | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const duration = minutes * 60 + seconds

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!running) return
    const tick = () => {
      const left = endsAt.current - Date.now()
      if (left > 0) {
        setLeftMs(left)
        return
      }
      if (finished.current) return
      finished.current = true
      setLeftMs(0)
      setRunning(false)
      setDone(true)
      const ctx = audio.current
      if (ctx) void ctx.resume().then(() => playChime(ctx))
    }
    tick()
    const id = window.setInterval(tick, 200)
    return () => window.clearInterval(id)
  }, [running])

  const start = () => {
    if (duration <= 0) return
    const ctx = audio.current ?? new AudioContext()
    audio.current = ctx
    void ctx.resume()
    finished.current = false
    endsAt.current = Date.now() + duration * 1000
    setLeftMs(duration * 1000)
    setDone(false)
    setRunning(true)
    setOpen(false)
  }

  const stop = () => {
    finished.current = true
    setRunning(false)
    setDone(false)
    setLeftMs(0)
    setOpen(false)
  }

  const active = open || running || done
  const label = running ? 'Arrêter le minuteur' : done ? 'Effacer le minuteur' : 'Régler le minuteur'

  return (
    <div className="game-timer" ref={boxRef}>
      <button
        type="button"
        className={`topbar-icon-btn${active ? ' active' : ''}`}
        aria-pressed={active}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={label}
        title={label}
        onClick={() => {
          if (running || done) stop()
          else setOpen((value) => !value)
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path
            fill="currentColor"
            d="M9 2h6v2h-1.2v1.05A8 8 0 1 1 10.2 5.05V4H9V2zm3 5a6 6 0 1 0 .01 12.01A6 6 0 0 0 12 7zm-1 2h2v4.2l2.6 1.6-1 1.6L11 14V9z"
          />
        </svg>
      </button>
      {running || done ? (
        <p
          className={`game-score${done ? ' is-ringing' : ''}`}
          role="timer"
          aria-live={done ? 'assertive' : 'off'}
          aria-label={done ? 'Le minuteur est terminé.' : `Temps restant : ${formatTimer(leftMs)}`}
        >
          {formatTimer(leftMs)}
        </p>
      ) : null}
      {open ? (
        <div className="game-timer-panel" role="dialog" aria-label="Durée du minuteur">
          <div className="game-timer-fields">
            <label>
              Minutes
              <input
                type="number"
                min={0}
                max={99}
                inputMode="numeric"
                value={minutes}
                onChange={(event) => setMinutes(clamp(event.target.valueAsNumber, 0, 99))}
              />
            </label>
            <label>
              Secondes
              <input
                type="number"
                min={0}
                max={59}
                inputMode="numeric"
                value={seconds}
                onChange={(event) => setSeconds(clamp(event.target.valueAsNumber, 0, 59))}
              />
            </label>
          </div>
          <button type="button" className="game-timer-start" disabled={duration <= 0} onClick={start}>
            Démarrer
          </button>
        </div>
      ) : null}
    </div>
  )
}

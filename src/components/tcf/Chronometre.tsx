import { useEffect, useState } from 'react'

function format(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Mode chronométré : la durée est imprimée dans la consigne ;
 * le compte à rebours sert en classe (écran uniquement).
 */
export function Chronometre({
  minutes,
  onChangeMinutes,
}: {
  minutes: number | undefined
  onChangeMinutes: (minutes: number | undefined) => void
}) {
  const total = Math.max(0, (minutes ?? 0) * 60)
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const [forTotal, setForTotal] = useState(total)
  if (forTotal !== total) {
    setForTotal(total)
    setLeft(total)
    setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  return (
    <div className="tcf-chrono no-print">
      <label className="tcf-field is-number">
        <span>Durée (min)</span>
        <input
          className="pill-input"
          type="number"
          min={0}
          max={180}
          value={minutes ?? 0}
          aria-label="Durée de l’exercice en minutes (0 = sans chrono)"
          onChange={(event) => {
            const n = Math.max(0, Math.min(180, Math.round(Number(event.target.value) || 0)))
            onChangeMinutes(n > 0 ? n : undefined)
          }}
        />
      </label>
      {total > 0 ? (
        <div className="tcf-chrono-run">
          <span className={`tcf-chrono-time${left === 0 ? ' is-done' : ''}`} aria-live="polite">
            {format(left)}
          </span>
          <button type="button" className="tcf-btn" onClick={() => setRunning((r) => !r)} disabled={left === 0}>
            {running ? 'Pause' : 'Démarrer'}
          </button>
          <button
            type="button"
            className="tcf-btn"
            onClick={() => {
              setRunning(false)
              setLeft(total)
            }}
          >
            Remettre à zéro
          </button>
        </div>
      ) : (
        <small className="muted">0 = sans chronomètre.</small>
      )}
    </div>
  )
}

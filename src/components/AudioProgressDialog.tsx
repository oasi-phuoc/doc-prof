import { useEffect, useId, useRef } from 'react'

export type AudioProgress = { value?: number; label: string; finished?: boolean }

/** Native modal blocks pointer and keyboard access to the rest of the page. */
export function AudioProgressDialog({ progress, onCancel }: {
  progress: AudioProgress | null
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const title = useId()
  useEffect(() => {
    if (progress && !ref.current?.open) ref.current?.showModal()
    if (!progress && ref.current?.open) ref.current.close()
  }, [progress])
  return <dialog ref={ref} aria-labelledby={title} onCancel={event => { event.preventDefault(); onCancel() }}
    style={{ border: 0, borderRadius: 20, padding: 28, width: 'min(420px, 90vw)', boxShadow: '0 16px 80px #0005' }}>
    <h2 id={title}>Préparation audio</h2>
    <p role="status" aria-live="polite">{progress?.label}</p>
    {!progress?.finished && <progress aria-label="Progression audio" max={100} value={progress?.value} style={{ width: '100%' }} />}
    <button type="button" className="button" onClick={onCancel} style={{ marginTop: 20 }}>
      {progress?.finished ? 'Fermer' : 'Annuler'}
    </button>
  </dialog>
}

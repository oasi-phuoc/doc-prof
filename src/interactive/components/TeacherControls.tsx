import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { HOLD_TO_REVEAL_MS, REVEAL_RETRACTION_MS, retractionRemaining, type ToolbarGuard } from '../domain/teacher'
import { useCountdown } from '../useCountdown'
import { IconButton } from './Icons'

export function RevealButton({ guard, disabled, onReveal }: { guard: ToolbarGuard; disabled: boolean; onReveal: () => void }) {
  const [holding, setHolding] = useState(false)
  const active = useRef<{ timer: ReturnType<typeof setTimeout>; pointer?: number; key?: string } | null>(null)
  const callback = useRef(onReveal)
  const description = useId()
  useEffect(() => { callback.current = onReveal }, [onReveal])
  const cancel = useCallback(() => {
    if (active.current) clearTimeout(active.current.timer)
    active.current = null
    setHolding(false)
  }, [])
  useEffect(() => {
    const hide = () => { if (document.hidden) cancel() }
    window.addEventListener('blur', cancel)
    document.addEventListener('visibilitychange', hide)
    return () => { cancel(); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hide) }
  }, [cancel, disabled, guard])
  const begin = (input: { pointer?: number; key?: string }) => {
    if (disabled || active.current) return
    setHolding(true)
    active.current = { ...input, timer: setTimeout(() => {
      active.current = null
      setHolding(false)
      callback.current()
    }, HOLD_TO_REVEAL_MS) }
  }
  const hold = guard === 'hold-to-reveal'
  return <>
    <button type="button" className={`ci-primary ci-reveal-button${holding ? ' ci-holding' : ''}`} aria-label="Enseignant : révéler" aria-describedby={hold ? description : undefined} disabled={disabled}
      onClick={(event) => { if (hold) event.preventDefault(); else onReveal() }}
      onPointerDown={(event) => {
        if (!hold || !event.isPrimary || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.focus()
        event.currentTarget.setPointerCapture(event.pointerId)
        begin({ pointer: event.pointerId })
      }}
      onPointerUp={(event) => { if (active.current?.pointer === event.pointerId) cancel() }}
      onPointerCancel={cancel}
      onLostPointerCapture={cancel}
      onPointerLeave={() => { if (active.current?.pointer !== undefined) cancel() }}
      onBlur={cancel}
      onKeyDown={(event) => {
        if (!hold || !['Enter', ' '].includes(event.key)) return
        event.preventDefault(); event.stopPropagation()
        if (!event.repeat) begin({ key: event.key })
      }}
      onKeyUp={(event) => {
        if (!hold || !['Enter', ' '].includes(event.key)) return
        event.preventDefault(); event.stopPropagation()
        if (active.current?.key === event.key) cancel()
      }}
    >
      {hold && <svg className="ci-hold-ring" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength="1" /><circle className="ci-hold-progress" data-ci-motion cx="12" cy="12" r="9" pathLength="1" /></svg>}
      {hold ? 'Maintenir pour révéler' : 'Enseignant : révéler'}
    </button>
    {hold && <span className="ci-sr-only" id={description}>Maintenez le bouton, Entrée ou Espace pendant 600 millisecondes. Relâchez pour annuler.</span>}
  </>
}

export function RetractRevealButton({ revealedAt, disabled, onRetract }: { revealedAt: number; disabled: boolean; onRetract: () => void }) {
  const [initialRemainingMs] = useState(() => retractionRemaining(revealedAt, Date.now()))
  const remaining = useCountdown({ durationMs: REVEAL_RETRACTION_MS, initialRemainingMs, running: true })
  if (remaining <= 0) return null
  return <IconButton className="ci-teacher-action" icon="reset" label="Masquer à nouveau" aria-description={`Disponible encore ${Math.ceil(remaining / 1000)} secondes.`} disabled={disabled} onClick={onRetract} />
}

export function TeacherConfirmation({ action, remaining, questionCount, onConfirm, onCancel }: { action: 'skip' | 'finish' | 'retry'; remaining: number; questionCount: number; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const title = useId()
  const description = useId()
  useEffect(() => {
    const previous = document.activeElement
    dialog.current?.showModal()
    cancel.current?.focus()
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [])
  return <dialog className="ci-teacher-confirm" ref={dialog} aria-labelledby={title} aria-describedby={description} onCancel={(event) => { event.preventDefault(); onCancel() }}>
    <h2 id={title}>{action === 'retry' ? 'Réessayer cette question ?' : action === 'skip' ? questionCount === 2 ? 'Passer ces deux questions ?' : 'Passer cette question ?' : 'Terminer la séance ?'}</h2>
    <p id={description}>{action === 'retry' ? 'L’essai précédent est conservé. Les votes sont remis à zéro et les cartes mélangées changent de place. Les cartes à ordre fixe gardent leur ordre. La feuille enseignant imprimée correspond à la première tentative.' : action === 'skip' ? questionCount === 2 ? 'Les corrections ne seront pas affichées. Les deux questions de cet écran seront indiquées comme passées dans le bilan.' : 'La correction ne sera pas affichée. Cette question sera indiquée comme passée dans le bilan.' : `${remaining} question(s) restent sans correction. Elles seront indiquées comme passées. Les activités déjà corrigées et les observations seront conservées dans le bilan.`}</p>
    <div className="ci-toolbar"><button type="button" ref={cancel} onClick={onCancel}>Annuler</button><button type="button" className="ci-primary" onClick={onConfirm}>{action === 'retry' ? 'Nouvelle tentative' : action === 'skip' ? 'Passer sans correction' : 'Terminer et voir le bilan'}</button></div>
  </dialog>
}

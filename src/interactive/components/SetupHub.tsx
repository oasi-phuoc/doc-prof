import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icons'
import { Mascot } from './Mascot'
import { MASCOTS } from '../domain/mascot'
import { validSeconds, validFeedbackSeconds } from '../domain/settings'
import type { ClassroomHeaderProps } from './ClassroomHeader'
import '../setup.css'

export function SetupDialog({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null), heading = useRef<HTMLHeadingElement>(null), id = useId()
  useEffect(() => {
    const previous = document.activeElement, element = dialog.current
    const scrollY = window.scrollY, overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element?.showModal()
    heading.current?.focus()
    return () => {
      element?.close()
      document.body.style.overflow = overflow
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
      window.scrollTo(0, scrollY)
    }
  }, [])
  return <dialog ref={dialog} className={`ci-setup-dialog${wide ? ' ci-setup-dialog-wide' : ''}`} aria-labelledby={id} onCancel={event => {
    if (event.target !== event.currentTarget) return
    event.preventDefault(); onClose()
  }}>
    <div className="ci-setup-dialog-head ci-no-print"><h2 ref={heading} tabIndex={-1} id={id}>{title}</h2><button type="button" className="ci-icon-button" aria-label={`Fermer · ${title}`} onClick={onClose}><Icon name="close" /></button></div>
    <div className="ci-setup-dialog-body">{children}</div>
  </dialog>
}

export function SetupAction({ icon, title, detail, onClick, disabled = false, opensDialog = true }: { icon: IconName; title: string; detail?: string; onClick: () => void; disabled?: boolean; opensDialog?: boolean }) {
  return <button type="button" className="ci-setup-action" onClick={onClick} disabled={disabled} aria-haspopup={opensDialog ? 'dialog' : undefined}>
    <span className="ci-setup-action-icon"><Icon name={icon} /></span><span><b>{title}</b>{detail && <small>{detail}</small>}</span><span className="ci-setup-action-arrow" aria-hidden="true">›</span>
  </button>
}

type SettingsProps = Pick<ClassroomHeaderProps, 'mode' | 'onMode' | 'mascot' | 'onMascot' | 'timer' | 'onTimer' | 'contrast' | 'onContrast'> & { children?: ReactNode }
export function SessionSettings({ mode, onMode, mascot, onMascot, timer, onTimer, contrast, onContrast, children }: SettingsProps) {
  const [mascotsOpen, setMascotsOpen] = useState(false)
  return <div className="ci-session-settings">
    <fieldset><legend>Mode de jeu</legend><div className="ci-settings-modes"><button type="button" aria-pressed={mode === 'class'} onClick={() => onMode('class')}><Icon name="users" />Classe</button><button type="button" aria-pressed={mode === 'solo'} onClick={() => onMode('solo')}><Icon name="user" />Solo</button></div></fieldset>
    <fieldset><legend>Minuteur</legend><label className="ci-settings-toggle"><input type="checkbox" checked={timer.enabled} onChange={event => onTimer({ ...timer, enabled: event.target.checked })} />Activer le minuteur</label>
      <div className="ci-settings-fields"><label>Temps de réflexion (secondes)<input type="number" min="5" max="600" value={timer.seconds} onChange={event => onTimer({ ...timer, seconds: validSeconds(Number(event.target.value)) })} /></label><label>Temps entre les questions (secondes)<input type="number" min="1" max="10" value={timer.feedbackSeconds} onChange={event => onTimer({ ...timer, feedbackSeconds: validFeedbackSeconds(Number(event.target.value)) })} /></label></div>
      <small>Le passage à la question suivante est automatique en Solo.</small>
    </fieldset>
    <details className="ci-settings-mascots" onToggle={event => setMascotsOpen(event.currentTarget.open)}><summary><span>Mascotte</span><Mascot kind={mascot} pose="thinking" label={MASCOTS.find(item => item.id === mascot)?.label ?? 'Mascotte choisie'} /></summary>
      {mascotsOpen && <div className="ci-settings-mascot-grid">{MASCOTS.map(item => <button type="button" key={item.id} aria-label={item.label} aria-pressed={mascot === item.id} onClick={event => { onMascot(item.id); const details = event.currentTarget.closest('details'); if (details) details.open = false }}><Mascot kind={item.id} pose="thinking" label={item.label} /></button>)}</div>}
    </details>
    <label className="ci-settings-toggle"><input type="checkbox" checked={contrast} onChange={onContrast} />Contraste renforcé</label>
    {children}
  </div>
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from './Icons'
import { MASCOTS, type MascotKind } from '../domain/mascot'
import type { PlayMode } from '../domain/types'
import { validSeconds, type TimerSettings } from '../domain/settings'

export type ClassroomHeaderProps = {
  mascot: MascotKind
  onMascot: (mascot: MascotKind) => void
  mode: PlayMode
  onMode: (mode: PlayMode) => void
  contrast: boolean
  onContrast: () => void
  onFullscreen: () => void
  onFiches: () => void
  timer: TimerSettings
  onTimer: (settings: TimerSettings) => void
}
export function ClassroomHeader({
  mascot,
  onMascot,
  mode,
  onMode,
  contrast,
  onContrast,
  onFullscreen,
  onFiches,
  timer,
  onTimer,
  session,
}: ClassroomHeaderProps & {
  session?: {
    progress: string
    paused: boolean
    canSkip: boolean
    onSkip: () => void
    onPause: () => void
    onExit: () => void
    audio?: ReactNode
  }
}) {
  const [panel, setPanel] = useState<'mode' | 'mascot' | 'timer' | null>(null)
  const tools = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const closePanel = () => { setPanel(null); trigger.current?.focus() }
  useEffect(() => {
    if (!panel) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !tools.current?.contains(event.target)) setPanel(null)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [panel])
  return (
    <header className="ci-header ci-no-print" data-ci-toolbar>
      <div className="ci-header-start">
        <a href="/generateur" className="brand" aria-label="ClairFLE">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Clair<span className="brand-accent">FLE</span>
        </a>
        <a className="ci-primary ci-create-link" href="/generateur">
          Créer des fiches
        </a>
      </div>
      {session && (
        <>
          <p className="ci-progress">{session.progress}</p>
          <div
            className="ci-toolbar ci-session-actions"
            aria-label="Commandes de la séance"
          >
            <IconButton
              icon="skip"
              label="Passer"
              disabled={!session.canSkip || session.paused}
              onClick={session.onSkip}
            />
            <IconButton
              icon={session.paused ? 'play' : 'pause'}
              label={session.paused ? 'Reprendre' : 'Pause'}
              onClick={session.onPause}
            />
          </div>
          <div className="ci-header-audio">{session.audio}</div>
        </>
      )}
      <nav
        ref={tools}
        onKeyDown={(event) => { if (event.key === 'Escape' && panel) { event.stopPropagation(); closePanel() } }}
        className="ci-toolbar ci-header-tools"
        aria-label="Affichage et navigation"
      >
        <IconButton
          icon="contrast"
          label="Contraste"
          aria-pressed={contrast}
          onClick={onContrast}
        />
        <div className="ci-header-option">
          <IconButton icon={mode === 'class' ? 'users' : 'user'} label="Mode de jeu" aria-description={`Mode actuel : ${mode === 'class' ? 'Classe' : 'Solo'}`} aria-expanded={panel === 'mode'} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setPanel(panel === 'mode' ? null : 'mode') }} />
          {panel === 'mode' && <div className="ci-toolbar-options" role="dialog" aria-label="Choisir le mode de jeu">
            <label>Mode de jeu
              <select aria-label="Mode de jeu" autoFocus value={mode} onChange={(event) => { onMode(event.target.value as PlayMode); closePanel() }}>
                <option value="class">Classe</option>
                <option value="solo">Solo</option>
              </select>
            </label>
            <button onClick={closePanel}>Fermer</button>
          </div>}
        </div>
        <div className="ci-header-option">
          <IconButton icon="mascot" label="Mascotte" aria-description={`Mascotte actuelle : ${MASCOTS.find((item) => item.id === mascot)?.label}`} aria-expanded={panel === 'mascot'} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setPanel(panel === 'mascot' ? null : 'mascot') }} />
          {panel === 'mascot' && <div className="ci-toolbar-options" role="dialog" aria-label="Choisir la mascotte">
            <label>Mascotte
              <select aria-label="Mascotte" autoFocus value={mascot} onChange={(event) => { onMascot(event.target.value as MascotKind); closePanel() }}>
                {MASCOTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <button onClick={closePanel}>Fermer</button>
          </div>}
        </div>
        <div className="ci-header-timer-settings">
          <IconButton
            icon="timer"
            label="Régler le minuteur"
            aria-expanded={panel === 'timer'}
            onClick={(event) => { trigger.current = event.currentTarget; setPanel(panel === 'timer' ? null : 'timer') }}
          />
          {panel === 'timer' && (
            <div
              className="ci-timer-options"
              role="dialog"
              aria-label="Réglages du minuteur"
            >
              <label>
                <input
                  type="checkbox"
                  checked={mode === 'solo' || timer.enabled}
                  disabled={mode === 'solo'}
                  onChange={(e) =>
                    onTimer({ ...timer, enabled: e.target.checked })
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
                  value={timer.seconds}
                  onChange={(e) =>
                    onTimer({
                      ...timer,
                      seconds: validSeconds(Number(e.target.value)),
                    })
                  }
                />
              </label>
              <button onClick={closePanel}>
                Fermer les réglages
              </button>
            </div>
          )}
        </div>
        <IconButton icon="expand" label="Plein écran" onClick={onFullscreen} />
        <IconButton icon="folder" label="Mes fiches" onClick={onFiches} />
        {session && (
          <IconButton
            icon="exit"
            label="Quitter la séance"
            onClick={session.onExit}
          />
        )}
      </nav>
    </header>
  )
}

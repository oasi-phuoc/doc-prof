import { useState, type ReactNode } from 'react'
import { IconButton } from './Icons'
import { validSeconds, type TimerSettings } from '../domain/settings'

export type ClassroomHeaderProps = {
  contrast: boolean
  onContrast: () => void
  onFullscreen: () => void
  onFiches: () => void
  timer: TimerSettings
  onTimer: (settings: TimerSettings) => void
}
export function ClassroomHeader({
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
  const [settingsOpen, setSettingsOpen] = useState(false)
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
          Créer des fiches <span aria-hidden="true">→</span>
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
        className="ci-toolbar ci-header-tools"
        aria-label="Affichage et navigation"
      >
        <IconButton
          icon="contrast"
          label="Contraste"
          aria-pressed={contrast}
          onClick={onContrast}
        />
        <div className="ci-header-timer-settings">
          <IconButton
            icon="timer"
            label="Régler le minuteur"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          />
          {settingsOpen && (
            <div
              className="ci-timer-options"
              role="dialog"
              aria-label="Réglages du minuteur"
            >
              <label>
                <input
                  type="checkbox"
                  checked={timer.enabled}
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
              <button onClick={() => setSettingsOpen(false)}>
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

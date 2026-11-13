import { useEffect, useState, type ReactNode } from 'react'
import { IconButton } from '../components/Icons'

export function CompetitionShell({ children, title = 'Compétition', playing = false, onExit }: { children: ReactNode; title?: string; playing?: boolean; onExit: () => void }) {
  const [fullscreen, setFullscreen] = useState(false), [contrast, setContrast] = useState(false)
  useEffect(() => { const changed = () => setFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', changed); return () => document.removeEventListener('fullscreenchange', changed) }, [])
  return <div className={`ci-app ci-competition${playing ? ' ci-competition-playing' : ''}${fullscreen ? ' ci-immersive' : ''}${contrast ? ' ci-high-contrast' : ''}`}>
    <header className="ci-header ci-no-print"><div className="ci-header-start"><a href="/generateur" className="brand" aria-label="ClairFLE"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><span className="ci-competition-heading">{title}</span></div>
      <nav className="ci-toolbar ci-header-tools" aria-label="Affichage de la compétition"><IconButton icon="contrast" label="Contraste" aria-pressed={contrast} onClick={() => setContrast(value => !value)} /><IconButton data-ci-fullscreen icon="expand" label={fullscreen ? 'Quitter le plein écran' : 'Plein écran'} aria-pressed={fullscreen} onClick={() => { setFullscreen(!fullscreen); if (fullscreen && document.fullscreenElement) void document.exitFullscreen().catch(() => {}); else if (!fullscreen) void document.documentElement.requestFullscreen?.().catch(() => {}) }} /><IconButton icon="exit" label="Quitter la compétition" onClick={onExit} /></nav>
    </header>{children}
  </div>
}

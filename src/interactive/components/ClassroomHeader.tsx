import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, IconButton } from './Icons'
import '../clean-play.css'
import { Mascot } from './Mascot'
import { MASCOTS, type MascotKind } from '../domain/mascot'
import type { PlayMode } from '../domain/types'
import { validSeconds, validFeedbackSeconds, type TimerSettings } from '../domain/settings'
import type { ToolbarGuard } from '../domain/teacher'
import { HomeHeader } from './HomeHeader'
import { DisplayThemeButtons } from '../display-theme'

export type ClassroomHeaderProps = {
  compact?: boolean
  homeHref?:string
  mascot: MascotKind
  onMascot: (mascot: MascotKind) => void
  mode: PlayMode
  onMode: (mode: PlayMode) => void
  fullscreen: boolean
  playing: boolean
  onFullscreen: () => void
  onFiches: () => void
  timer: TimerSettings
  onTimer: (settings: TimerSettings) => void
  toolbarGuard?: ToolbarGuard
  teacherBadges?: boolean
  onCompetition?: () => void
}
export function ClassroomHeader({ homeHref='/generateur', compact = false, mascot, onMascot, mode, onMode, fullscreen, playing, onFullscreen, onFiches, timer, onTimer, onCompetition, session }: ClassroomHeaderProps & {
  session?: { progress: string; paused: boolean; canSkip: boolean; onSkip: () => void; onPause: () => void; onExit: () => void; audio?: ReactNode; teacherLocked?: boolean; onNavigate?: () => void; onConsole?: () => void; onMask?: () => void }
}) {
  const locked = !!session?.teacherLocked
  const [panel, setPanel] = useState<'mascot' | 'timer' | null>(null)
  const [optionsOpen,setOptionsOpen]=useState(false)
  const optionsTrigger=useRef<HTMLButtonElement>(null)
  const tools = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const closePanel = () => { setPanel(null);if(playing){setOptionsOpen(false);optionsTrigger.current?.focus()}else trigger.current?.focus() }
  useEffect(() => {
    if (!panel&&!optionsOpen) return
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !tools.current?.contains(event.target)){setPanel(null);setOptionsOpen(false)}
    }
    if (panel === 'mascot') tools.current?.querySelector<HTMLButtonElement>('.ci-mascot-pick[aria-pressed="true"]')?.focus()
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [panel,optionsOpen])
  if (compact && !playing) return <HomeHeader homeHref={homeHref}/>
  return (
    <header className={`ci-header ci-no-print${playing?' ci-clean-header':''}${compact && !playing ? ' ci-setup-home-header' : ''}`} data-ci-toolbar>
      <div className="ci-header-start">
        <a href={homeHref} className="brand" aria-label="ClairFLE" aria-disabled={locked || undefined} tabIndex={locked ? -1 : undefined} onClick={(event) => { if (locked) event.preventDefault() }}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          Clair<span className="brand-accent">FLE</span>
        </a>
        {!playing && <a className="ci-primary ci-create-link" href="/generateur">Créer des fiches</a>}
      </div>
      {session&&<><p className="ci-progress ci-sr-only">{session.progress}</p><div className="ci-header-audio" inert={locked} aria-disabled={locked || undefined}>{session.audio}</div></>}
      {(!compact || playing) && <nav ref={tools} onKeyDown={(event) => { if (event.key === 'Escape' && panel) { event.stopPropagation(); closePanel() } }} className="ci-toolbar ci-header-tools" aria-label="Affichage et navigation">
        {playing&&<button ref={optionsTrigger} type="button" className="ci-icon-button" aria-label="Options du jeu" disabled={locked} aria-expanded={optionsOpen} onClick={()=>{setPanel(null);setOptionsOpen(!optionsOpen)}}><Icon name="options"/></button>}
        {<IconButton data-ci-fullscreen icon="expand" label={fullscreen?'Quitter le plein écran':'Plein écran'} aria-pressed={fullscreen} onClick={()=>{setPanel(null);setOptionsOpen(false);onFullscreen()}}/>}
        <div className={playing?'ci-game-options':'ci-toolbar'} hidden={playing&&!optionsOpen} onKeyDown={event=>{if(event.key==='Escape'&&!panel){event.stopPropagation();setOptionsOpen(false);optionsTrigger.current?.focus()}}}>
        {session?.onNavigate&&<button className="ci-question-navigation ci-icon-button" type="button" aria-label={`Choisir une question · ${session.progress}`} disabled={locked||session.paused} onClick={()=>{setOptionsOpen(false);session.onNavigate?.()}}><Icon name="folder"/></button>}
        {session&&<IconButton icon="skip" label="Passer" disabled={locked||!session.canSkip||session.paused} onClick={()=>{setOptionsOpen(false);session.onSkip()}}/>}
        {session&&(mode==='class'||session.paused)&&<IconButton icon={session.paused?'play':'pause'} label={session.paused?'Reprendre':'Pause'} disabled={locked} onClick={()=>{setOptionsOpen(false);session.onPause()}}/>}
        {session?.onMask && <IconButton icon="screen-off" label="Masquer l’écran" aria-haspopup="dialog" disabled={locked} onClick={session.onMask} />}
        <DisplayThemeButtons disabled={locked} />
        <IconButton icon={mode === 'class' ? 'users' : 'user'} label="Mode de jeu" disabled={locked} aria-description={`Mode actuel : ${mode === 'class' ? 'Classe' : 'Solo'}`} aria-pressed={mode === 'solo'} onClick={() => { setPanel(null); onMode(mode === 'class' ? 'solo' : 'class') }} />
        {!playing && onCompetition && <IconButton icon="trophy" label="Compétition" onClick={onCompetition} />}
        <div className="ci-header-option">
          <IconButton icon="mascot" label="Mascotte" disabled={locked} aria-description={`Mascotte actuelle : ${MASCOTS.find((item) => item.id === mascot)?.label}`} aria-expanded={!locked && panel === 'mascot'} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setPanel(panel === 'mascot' ? null : 'mascot') }} />
          {panel === 'mascot' && !locked && <div className="ci-toolbar-options ci-mascot-picker" role="dialog" aria-label="Choisir la mascotte">
            {MASCOTS.map((item) => <button className="ci-mascot-pick" key={item.id} aria-label={item.label} title={item.label} aria-pressed={mascot === item.id} onClick={() => { onMascot(item.id); closePanel() }}><Mascot kind={item.id} pose="thinking" label={item.label} /></button>)}
          </div>}
        </div>
        <div className="ci-header-timer-settings">
          <IconButton icon="timer" label="Régler le minuteur" disabled={locked} aria-expanded={!locked && panel === 'timer'} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setPanel(panel === 'timer' ? null : 'timer') }} />
          {panel === 'timer' && !locked && <div className="ci-timer-options" role="dialog" aria-label="Réglages du minuteur">
            <label className="ci-timer-enabled"><input type="checkbox" checked={timer.enabled} onChange={(event) => onTimer({ ...timer, enabled: event.target.checked })} />Activer le minuteur</label>
            <label>Temps de réflexion (secondes)<input type="number" min="5" max="600" value={timer.seconds} onChange={(event) => onTimer({ ...timer, seconds: validSeconds(Number(event.target.value)) })} /></label>
            <label>Temps entre les questions (secondes)<input type="number" min="1" max="10" value={timer.feedbackSeconds} onChange={(event) => onTimer({ ...timer, feedbackSeconds: validFeedbackSeconds(Number(event.target.value)) })} /></label>
            <p>En Solo, la correction reste affichée pendant ce battement de 1 à 10 secondes.</p>
            <button onClick={closePanel}>Fermer les réglages</button>
          </div>}
        </div>
        {session?.onConsole && <IconButton icon="console" label="Ouvrir la console enseignant" disabled={locked} onClick={() => { setPanel(null); session.onConsole?.() }} />}
        <IconButton icon="folder" label="Mes fiches" disabled={locked} onClick={onFiches} />
        {session && <IconButton icon="exit" label="Quitter la séance" disabled={locked} onClick={session.onExit} />}
        </div>
      </nav>}
    </header>
  )
}

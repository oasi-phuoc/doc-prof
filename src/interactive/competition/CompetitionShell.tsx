import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../components/Icons'
import { displayThemeClass, DisplayThemeButtons, useDisplayTheme } from '../display-theme'
import {isPhoneViewport,releaseDuelLandscape,requestDuelLandscape} from '../duel/landscape'
import '../clean-play.css'

export function CompetitionShell({ children, title = 'Compétition', playing = false, preferLandscape=false, onExit }: { children: ReactNode; title?: string; playing?: boolean; preferLandscape?:boolean; onExit: () => void }) {
  const [fullscreen, setFullscreen] = useState(false)
  const { theme } = useDisplayTheme()
  const [optionsOpen,setOptionsOpen]=useState(false),tools=useRef<HTMLElement>(null)
  useEffect(()=>{if(!optionsOpen)return;const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!tools.current?.contains(event.target))setOptionsOpen(false)};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[optionsOpen])
  useEffect(() => { const changed = () => {setFullscreen(!!document.fullscreenElement);if(preferLandscape&&!document.fullscreenElement)releaseDuelLandscape(false)}; document.addEventListener('fullscreenchange', changed); return () => {document.removeEventListener('fullscreenchange', changed);if(preferLandscape)releaseDuelLandscape()} }, [preferLandscape])
  const toggleFullscreen=()=>{
    setOptionsOpen(false);setFullscreen(!fullscreen)
    if(fullscreen){if(preferLandscape)releaseDuelLandscape(false);if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{})}
    else if(preferLandscape&&isPhoneViewport())void requestDuelLandscape()
    else void document.documentElement.requestFullscreen?.().catch(()=>{})
  }
  return <div data-ci-duel={preferLandscape||undefined} className={`ci-app ci-competition${playing ? ' ci-competition-playing' : ''}${fullscreen ? ' ci-immersive' : ''}${displayThemeClass(theme)}`}>
    <header className={`ci-header ci-no-print${playing?' ci-clean-header':''}`}><div className="ci-header-start"><a href="/generateur" className="brand" aria-label="ClairFLE"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><span className="ci-competition-heading">{title}</span></div>
      <nav ref={tools} className="ci-toolbar ci-header-tools" aria-label="Affichage de la compétition" onKeyDown={event=>{if(event.key==='Escape'){setOptionsOpen(false);tools.current?.querySelector<HTMLButtonElement>('[aria-label="Options du jeu"]')?.focus()}}}>
        {playing&&<IconButton icon="options" label="Options du jeu" aria-expanded={optionsOpen} onClick={()=>setOptionsOpen(!optionsOpen)}/>}
        {<IconButton data-ci-fullscreen icon="expand" label={fullscreen?'Quitter le plein écran':'Plein écran'} aria-pressed={fullscreen} onClick={toggleFullscreen}/>}
        <div className={playing?'ci-game-options':'ci-toolbar'} hidden={playing&&!optionsOpen}>
        <DisplayThemeButtons />
        <IconButton icon="exit" label="Quitter la compétition" onClick={onExit} />
        </div></nav>
    </header>{children}
  </div>
}

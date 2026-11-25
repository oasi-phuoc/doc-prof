import {lazy,Suspense,type ReactNode} from 'react'
import { navigateTo } from './routing'
const CatalogPageTools=lazy(()=>import('./CatalogNavigation').then(module=>({default:module.CatalogPageTools})))

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
  endSlot,
  onLogout,
}: {
  onCreate: () => void
  generator?: boolean
  showCreate?: boolean
  rightSlot?: ReactNode
  /** Affiché à droite du bouton « Créer une fiche ». */
  endSlot?: ReactNode
  onLogout?: () => void
}) {
  const createVisible = showCreate ?? !generator
  return (
    <header className="topbar no-print">
      <div className="topbar-brand">
        <a className="brand" href={generator || !createVisible ? '/' : '#top'}>
          <><span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          Clair<span className="brand-accent">FLE</span>
          </>
        </a>
        <a className="button small topbar-play" href="/interactif" onClick={event=>{if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigateTo('/interactif');window.dispatchEvent(new PopStateEvent('popstate'))}}>Jouer en classe</a>
        {createVisible ? (
          <button className="button small" type="button" onClick={onCreate}>
            Créer une fiche
          </button>
        ) : null}
      </div>
      <div className="topbar-right">
        {generator && !rightSlot && <Suspense fallback={<span aria-busy="true" aria-label="Chargement du menu" style={{display:'inline-block',width:96,height:44}}/>}><CatalogPageTools onLogout={onLogout} /></Suspense>}
        {rightSlot}
        {endSlot}
      </div>
    </header>
  )
}

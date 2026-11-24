import {lazy,Suspense,type ReactNode} from 'react'
import { navigateTo } from './routing'
import { EPCA_LOGO_SRC, isLogistiqueDomain } from '@/logistique/domains'
import type { Domain } from '@/math/types'
import '@/logistique/branding.css'
const CatalogPageTools=lazy(()=>import('./CatalogNavigation').then(module=>({default:module.CatalogPageTools})))

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
  endSlot,
  afterBrand,
  onLogout,
  domain,
}: {
  onCreate: () => void
  generator?: boolean
  showCreate?: boolean
  rightSlot?: ReactNode
  /** Affiché à droite du bouton « Créer une fiche ». */
  endSlot?: ReactNode
  /** À droite du titre ClairFLE. */
  afterBrand?: ReactNode
  onLogout?: () => void
  domain?: Domain
}) {
  const createVisible = showCreate ?? !generator
  return (
    <header className="topbar no-print">
      <div className="topbar-brand">
        <a className={`brand${isLogistiqueDomain(domain) ? ' brand-epca' : ''}`} href={generator || !createVisible ? '/' : '#top'}>
          {isLogistiqueDomain(domain) ? <img src={EPCA_LOGO_SRC} alt="EPCA" /> : <><span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          Clair<span className="brand-accent">FLE</span>
          </>}
        </a>
        {afterBrand??<a className="button small topbar-play" href="/interactif" onClick={event=>{if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigateTo('/interactif');window.dispatchEvent(new PopStateEvent('popstate'))}}>Jouer en classe</a>}
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

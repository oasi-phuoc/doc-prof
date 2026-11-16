import type { ReactNode } from 'react'
import { CatalogPageTools } from './CatalogNavigation'

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
  endSlot,
  afterBrand,
  onLogout,
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
}) {
  const createVisible = showCreate ?? !generator
  return (
    <header className="topbar no-print">
      <div className="topbar-brand">
        <a className="brand" href={generator || !createVisible ? '/' : '#top'}>
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          Clair<span className="brand-accent">FLE</span>
        </a>
        {afterBrand??<a className="button small topbar-play" href="/interactif" onClick={event=>{if(event.button||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigateTo('/interactif');window.dispatchEvent(new PopStateEvent('popstate'))}}>Jouer en classe</a>}
        {createVisible ? (
          <button className="button small" type="button" onClick={onCreate}>
            Créer une fiche
          </button>
        ) : null}
      </div>
      <div className="topbar-right">
        {generator && !rightSlot && <CatalogPageTools onLogout={onLogout} />}
        {rightSlot}
        {endSlot}
      </div>
    </header>
  )
}

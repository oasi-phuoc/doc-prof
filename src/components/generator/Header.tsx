import type { ReactNode } from 'react'
import { navigateTo } from './routing'

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
  endSlot,
  afterBrand,
}: {
  onCreate: () => void
  generator?: boolean
  showCreate?: boolean
  rightSlot?: ReactNode
  /** Affiché à droite du bouton « Créer une fiche ». */
  endSlot?: ReactNode
  /** À droite du titre ClairFLE. */
  afterBrand?: ReactNode
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
        {afterBrand}
        {createVisible ? (
          <button className="button small" type="button" onClick={onCreate}>
            Créer une fiche
          </button>
        ) : null}
      </div>
      <div className="topbar-right">
        <a
          href="/images"
          className={`topbar-icon-btn${window.location.pathname === '/images' ? ' active' : ''}`}
          aria-label="Galerie d’images"
          title="Galerie d’images"
          aria-current={window.location.pathname === '/images' ? 'page' : undefined}
          onClick={event => {
            if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
            event.preventDefault()
            navigateTo('/images')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>
        </a>
        {rightSlot}
        {endSlot}
      </div>
    </header>
  )
}

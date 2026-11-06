import type { ReactNode } from 'react'

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
  endSlot,
  afterBrand,
  centerSlot,
}: {
  onCreate: () => void
  generator?: boolean
  showCreate?: boolean
  rightSlot?: ReactNode
  /** Affiché à droite du bouton « Créer une fiche ». */
  endSlot?: ReactNode
  /** À droite du titre ClairFLE. */
  afterBrand?: ReactNode
  /** Au centre du menu, en mode jeu. */
  centerSlot?: ReactNode
}) {
  const createVisible = showCreate ?? !generator
  return (
    <header className={`topbar no-print${centerSlot ? ' is-game' : ''}`}>
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
      </div>
      {centerSlot}
      <div className="topbar-right">
        {rightSlot}
        {createVisible ? (
          <button className="button small" type="button" onClick={onCreate}>
            Créer une fiche <span>→</span>
          </button>
        ) : null}
        {endSlot}
      </div>
    </header>
  )
}

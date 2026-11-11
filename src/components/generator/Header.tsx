import type { ReactNode } from 'react'

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
        {rightSlot}
        {endSlot}
      </div>
    </header>
  )
}

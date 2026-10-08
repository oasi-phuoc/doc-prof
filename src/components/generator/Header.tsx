import type { ReactNode } from 'react'

export function Header({
  onCreate,
  generator = false,
  showCreate,
  rightSlot,
}: {
  onCreate: () => void
  generator?: boolean
  showCreate?: boolean
  rightSlot?: ReactNode
}) {
  const createVisible = showCreate ?? !generator
  return (
    <header className="topbar no-print">
      <a className="brand" href={generator || !createVisible ? '/' : '#top'}>
        <span className="brand-mark">
          <i />
          <i />
          <i />
        </span>
        Clair<span className="brand-accent">FLE</span>
      </a>
      <div className="topbar-right">
        {rightSlot}
        {createVisible ? (
          <button className="button small" type="button" onClick={onCreate}>
            Créer une fiche <span>→</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}

import { Children, createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// L’aperçu simple garde ses raccourcis. En mode Libre, le bloc actif les affiche à gauche.
const WorksheetSettingsContext = createContext<HTMLElement | null | undefined>(undefined)

export function WorksheetSettingsScope({ target, children }: { target?: HTMLElement | null; children: ReactNode }) {
  return <WorksheetSettingsContext.Provider value={target}>{children}</WorksheetSettingsContext.Provider>
}

export function WorksheetSettings({ label, children, onlyInPanel }: {
  label: string
  children: ReactNode
  onlyInPanel?: boolean
}) {
  const target = useContext(WorksheetSettingsContext)
  if (target === undefined) return onlyInPanel ? null : children
  const controls = Children.toArray(children)
  if (!target || !controls.length) return null
  return createPortal(
    <div className="worksheet-settings-row" role="group" aria-label={label}>
      <span>{label}</span>
      <div>{controls}</div>
    </div>,
    target,
  )
}

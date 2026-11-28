import { useState } from 'react'
import { TheoryBlockView } from '@/components/item-view/problems'
import type { MathItem, PreviewMode } from '@/math/types'
import { SocieteSupportView } from '@/societe/SupportView'

export function GrammarTheoryReading({ items, mode }: { items: MathItem[]; mode: PreviewMode }) {
  const [open, setOpen] = useState(false)
  return (
    <details className="grammar-theory-reading no-print" onToggle={event => setOpen(event.currentTarget.open)}>
      <summary>Lire la théorie</summary>
      {open && (
        <div className="grammar-theory-reading-content">
          {items.map((item, index) => (
            <div className="grammar-theory-item is-falc" key={item.libreId ?? index}>
              {item.societeSupport
                ? <SocieteSupportView support={item.societeSupport} mode={mode} />
                : <TheoryBlockView item={item} mode={mode} />}
            </div>
          ))}
        </div>
      )}
    </details>
  )
}

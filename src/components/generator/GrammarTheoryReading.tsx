import { useState } from 'react'
import { TheoryBlockView } from '@/components/item-view/problems'
import type { MathItem } from '@/math/types'

export function GrammarTheoryReading({ items }: { items: MathItem[] }) {
  const [open, setOpen] = useState(false)
  return (
    <details className="grammar-theory-reading no-print" onToggle={event => setOpen(event.currentTarget.open)}>
      <summary>Lire la théorie</summary>
      {open && (
        <div className="grammar-theory-reading-content">
          {items.map((item, index) => (
            <div className="grammar-theory-item is-falc" key={item.libreId ?? index}>
              <TheoryBlockView item={item} />
            </div>
          ))}
        </div>
      )}
    </details>
  )
}

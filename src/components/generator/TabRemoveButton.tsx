export function TabRemoveButton({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="tab-remove"
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation()
        onRemove()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        event.stopPropagation()
        onRemove()
      }}
    >
      ×
    </span>
  )
}

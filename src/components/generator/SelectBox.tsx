import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

export type SelectOption = { value: string; label: string; disabled?: boolean }

export function optionsFromChildren(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== 'option') return []
    const el = child as ReactElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>
    return [
      {
        value: String(el.props.value ?? ''),
        label: Children.toArray(el.props.children).join(''),
        disabled: Boolean(el.props.disabled),
      },
    ]
  })
}

export function SelectBox({
  label,
  value,
  multipleValues,
  children,
  onChange,
}: {
  label: string
  value?: string
  multipleValues?: readonly string[]
  children: ReactNode
  onChange: (value: string) => void
}) {
  const options = useMemo(() => optionsFromChildren(children), [children])
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="select-shell" ref={rootRef}>
      <span id={`${listId}-label`}>{label}</span>
      <div className={`select-box ${open ? 'open' : ''}`}>
        <button
          type="button"
          className="select-control"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${listId}-label`}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="select-control-value">{multipleValues
            ? `${multipleValues.length} sélectionné${multipleValues.length === 1 ? '' : 's'}`
            : selected?.label ?? '—'}</span>
          <span className="select-caret" aria-hidden />
        </button>
        {open && (
          <ul className="select-menu" role="listbox" id={listId} aria-labelledby={`${listId}-label`}
            aria-multiselectable={multipleValues ? true : undefined}>
            {options.map((option) => {
              const checked = multipleValues ? multipleValues.includes(option.value) : option.value === value
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    className={`select-option ${checked ? 'selected' : ''}`}
                    aria-selected={checked}
                    disabled={option.disabled}
                    onClick={() => {
                      if (option.disabled) return
                      onChange(option.value)
                      if (!multipleValues) setOpen(false)
                    }}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

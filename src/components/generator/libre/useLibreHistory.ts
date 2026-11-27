import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createHistory, moveInHistory, recordChange, type LibreRevision } from './history'

export function useLibreHistory(
  revision: LibreRevision,
  active: boolean,
  restore: (revision: LibreRevision) => void,
) {
  const [history, setHistory] = useState(createHistory<LibreRevision>)
  const last = useRef({ revision, active })
  const input = useRef<HTMLElement | null>(null)
  const replaying = useRef(false)

  useLayoutEffect(() => {
    const previous = last.current
    last.current = { revision, active }
    if (previous.revision === revision) return
    if (replaying.current) {
      replaying.current = false
      return
    }
    if (!active || !previous.active) {
      input.current = null
      // A re-entry can change only the historical applied-preview pointer.
      if (previous.active === active && previous.revision.pages !== revision.pages) {
        setHistory(createHistory())
      }
      return
    }
    const inputField = input.current
    setHistory((current) => recordChange(current, previous.revision, inputField))
  }, [active, revision])

  function move(direction: 'undo' | 'redo') {
    const step = moveInHistory(history, revision, direction)
    if (!step) return
    replaying.current = true
    input.current = null
    setHistory(step.history)
    restore(step.value)
  }

  function onInputCapture(event: FormEvent) {
    const field = event.target
    input.current =
      field instanceof HTMLTextAreaElement ||
      (field instanceof HTMLInputElement && ['text', 'number', 'search', 'range'].includes(field.type))
        ? field : null
  }

  function stopInputGroup() {
    input.current = null
    if (history.input) setHistory((current) => ({ ...current, input: null }))
  }

  function onKeyDown(event: KeyboardEvent) {
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return
    const key = event.key.toLowerCase()
    if (key === 'z' || (key === 'y' && !event.shiftKey)) {
      event.preventDefault()
      move(key === 'y' || event.shiftKey ? 'redo' : 'undo')
    }
  }

  return {
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undo: () => move('undo'),
    redo: () => move('redo'),
    onInputCapture,
    stopInputGroup,
    onKeyDown,
    clearHistory: () => {
      replaying.current = true
      input.current = null
      setHistory(createHistory())
    },
  }
}

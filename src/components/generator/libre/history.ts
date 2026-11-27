import type { FicheRecipe } from '@/fiches/recipe'

/** The applied document and its legacy preview revision. UI selection is stored separately. */
export type LibreRevision = Required<Pick<FicheRecipe,
  'pages' | 'seed' | 'institutional' | 'evalMode' | 'pointsPerQuestion' |
  'libreSnapshot' | 'sheetFormat' | 'sheetFont' | 'hideChrome' | 'printCorrections' | 'imageOverrides'
>>

type History<T> = {
  past: T[]
  future: T[]
  input: HTMLElement | null
}

export function createHistory<T>(): History<T> {
  return { past: [], future: [], input: null }
}

const HISTORY_LIMIT = 50

export function recordChange<T>(history: History<T>, previous: T, input: HTMLElement | null): History<T> {
  const inProgress = input !== null && history.input === input && history.future.length === 0
  return {
    past: inProgress ? history.past : [...history.past, previous].slice(-HISTORY_LIMIT),
    future: [],
    input,
  }
}

export function moveInHistory<T>(
  history: History<T>,
  current: T,
  direction: 'undo' | 'redo',
): { value: T; history: History<T> } | undefined {
  if (direction === 'undo') {
    const value = history.past.at(-1)
    if (value === undefined) return
    return {
      value,
      history: { past: history.past.slice(0, -1), future: [...history.future, current], input: null },
    }
  }
  const value = history.future.at(-1)
  if (value === undefined) return
  return {
    value,
    history: { past: [...history.past, current], future: history.future.slice(0, -1), input: null },
  }
}

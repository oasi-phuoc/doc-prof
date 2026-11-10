import type { Action, Game, Session } from './types'

export function advanceAction(_game: Game, state: Session): Action | undefined {
  if (state.finished || state.paused || state.mode === 'solo') return
  switch (state.phase) {
    case 'thinking':
      return { type: 'CARDS_UP' }
    case 'cards-up':
      return { type: 'DISCUSS' }
    case 'selected':
      return { type: 'DISCUSS' }
    case 'discussion':
      return { type: 'REVEAL' }
    case 'revealed':
      return { type: 'NEXT' }
  }
}

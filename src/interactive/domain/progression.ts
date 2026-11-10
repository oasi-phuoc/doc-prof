import { questionsForRound } from './plan'
import type { Action, Game, Session } from './types'

export function advanceAction(game: Game, state: Session): Action | undefined {
  if (state.finished || state.paused) return
  switch (state.phase) {
    case 'thinking':
      return { type: 'CARDS_UP' }
    case 'cards-up':
      return questionsForRound(game, state.index).every(
        (q) => q.mode !== 'choice',
      )
        ? { type: 'DISCUSS' }
        : undefined
    case 'selected':
      return { type: 'DISCUSS' }
    case 'discussion':
      return { type: 'REVEAL' }
    case 'revealed':
      return { type: 'NEXT' }
  }
}

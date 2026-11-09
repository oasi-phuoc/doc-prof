import type { Game } from './types'
export const sessionKey = (game: Game) =>
  `clairfle.interactive.session.${game.id}`

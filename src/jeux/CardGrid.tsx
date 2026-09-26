import type { CSSProperties } from 'react'
import type { GameBoard, GameCard } from './types'

function CardFace({ card }: { card: GameCard }) {
  const variant = card.variant ?? 'default'
  const showImageSlot =
    variant === 'default' || variant === 'image' || (variant === 'word' && Boolean(card.imageSrc))
  const showWord = variant !== 'image' && Boolean(card.text)

  if (variant === 'domino') {
    return (
      <div className="game-card is-domino" data-badge={card.badge || undefined}>
        {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
        <div className="game-domino">
          <span className="game-domino-half">{card.text}</span>
          <span className="game-domino-sep" aria-hidden />
          <span className="game-domino-half">{card.textRight}</span>
        </div>
      </div>
    )
  }

  if (variant === 'clue') {
    return (
      <div className="game-card is-clue" data-badge={card.badge || undefined}>
        {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
        <ol className="game-card-clues">
          {(card.lines ?? []).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className={`game-card is-${variant}`} data-badge={card.badge || undefined}>
      {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
      {showImageSlot ? (
        <div className="game-card-image">
          {card.imageSrc ? (
            <img src={card.imageSrc} alt="" />
          ) : (
            <span className="game-card-empty" aria-hidden />
          )}
        </div>
      ) : null}
      {card.lines && card.lines[0] && variant !== 'default' ? (
        <small className="game-card-sub">{card.lines[0]}</small>
      ) : null}
      {showWord ? <div className="game-card-word">{card.text}</div> : null}
      {variant === 'image' && !card.imageSrc ? (
        <div className="game-card-word is-muted">Image</div>
      ) : null}
    </div>
  )
}

export function CardGrid({ board }: { board: GameBoard }) {
  const kind = board.kind ?? 'cards'
  return (
    <div className={`game-board is-${kind}`}>
      {board.title ? <p className="game-board-title">{board.title}</p> : null}
      <div
        className="game-card-grid"
        style={
          {
            '--game-cols': board.cols,
            '--game-rows': board.rows,
          } as CSSProperties
        }
        aria-label={board.title ?? 'Cartes du jeu'}
      >
        {board.cards.map((card) => (
          <CardFace key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

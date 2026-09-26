import type { CSSProperties } from 'react'
import type { GameBoard, GameCard } from './types'

function CardFace({ card }: { card: GameCard }) {
  const variant = card.variant ?? 'default'
  return (
    <div className={`game-card is-${variant}`} data-badge={card.badge || undefined}>
      {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
      {variant === 'domino' ? (
        <div className="game-domino">
          <span className="game-domino-half">{card.text}</span>
          <span className="game-domino-sep" aria-hidden />
          <span className="game-domino-half">{card.textRight}</span>
        </div>
      ) : variant === 'default' || variant === 'image' ? (
        <>
          <div className="game-card-image">
            {card.imageSrc ? (
              <img src={card.imageSrc} alt="" />
            ) : (
              <span className="game-card-empty" aria-hidden />
            )}
          </div>
          {variant === 'default' || card.text ? (
            <div className="game-card-word">{card.text ?? ''}</div>
          ) : null}
        </>
      ) : variant === 'clue' ? (
        <ol className="game-card-clues">
          {(card.lines ?? []).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      ) : (
        <>
          {card.lines && card.lines[0] ? (
            <small className="game-card-sub">{card.lines[0]}</small>
          ) : null}
          <div className="game-card-word">{card.text ?? ''}</div>
        </>
      )}
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

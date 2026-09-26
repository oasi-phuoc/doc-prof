import type { CSSProperties } from 'react'
import type { GameBoard, GameCard, GamePanel } from './types'

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

  if (variant === 'back') {
    const color = card.backColor?.trim()
    return (
      <div
        className={`game-card is-back${color ? ' has-color' : ''}`}
        style={color ? ({ '--game-back': color } as CSSProperties) : undefined}
        aria-label="Dos de carte"
      />
    )
  }

  if (variant === 'scatter') {
    return (
      <div className="game-card is-scatter" data-badge={card.badge || undefined}>
        {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
        <div className="game-scatter" aria-label="Mots de la carte">
          {(card.scatter ?? []).map((word, i) => (
            <span
              key={`${word.text}-${i}`}
              className="game-scatter-word"
              style={
                {
                  left: `${word.x}%`,
                  top: `${word.y}%`,
                  '--scatter-rot': `${word.rotate}deg`,
                } as CSSProperties
              }
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'intrus-answer') {
    const frame = card.frameColor?.trim() || '#0f6b5c'
    return (
      <div
        className="game-card is-intrus-answer"
        data-badge={card.badge || undefined}
        style={{ '--intrus-frame': frame } as CSSProperties}
      >
        {card.badge ? <span className="game-card-badge">{card.badge}</span> : null}
        <div className="game-card-word">{card.text}</div>
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

function PanelGrid({ panel }: { panel: GamePanel }) {
  return (
    <div
      className="game-card-grid"
      style={
        {
          '--game-cols': panel.cols,
          '--game-rows': panel.rows,
        } as CSSProperties
      }
      aria-label={panel.title ?? 'Grille'}
    >
      {panel.cards.map((card) => (
        <CardFace key={card.id} card={card} />
      ))}
    </div>
  )
}

function LotoPanelFace({ panel, mode }: { panel: GamePanel; mode: 'page' | 'back' }) {
  if (mode === 'back') {
    return (
      <div className="loto-panel is-back">
        <div className="loto-panel-theme">
          <span className="loto-panel-theme-kicker">Série</span>
          <strong className="loto-panel-theme-label">{panel.themeLabel ?? 'Loto'}</strong>
          {panel.themeSub ? <small className="loto-panel-theme-sub">{panel.themeSub}</small> : null}
          {panel.title ? <span className="loto-panel-theme-grid">{panel.title}</span> : null}
        </div>
        {panel.cards.length > 0 ? (
          <div className="loto-panel-theme-thumbs" aria-hidden>
            {panel.cards.slice(0, 6).map((card) =>
              card.imageSrc ? (
                <img key={card.id} src={card.imageSrc} alt="" />
              ) : null,
            )}
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="loto-panel">
      {panel.title ? <p className="loto-panel-title">{panel.title}</p> : null}
      <PanelGrid panel={panel} />
    </div>
  )
}

export function CardGrid({ board }: { board: GameBoard }) {
  const kind = board.kind ?? 'cards'

  if (kind === 'loto-page' || kind === 'loto-back') {
    const mode = kind === 'loto-back' ? 'back' : 'page'
    return (
      <div className={`game-board is-${kind}`}>
        {board.title ? <p className="game-board-title">{board.title}</p> : null}
        <div className="loto-panels" aria-label={board.title ?? 'Grilles de loto'}>
          {(board.panels ?? []).map((panel, index) => (
            <LotoPanelFace
              key={`${panel.title ?? 'panel'}-${index}`}
              panel={panel}
              mode={mode}
            />
          ))}
        </div>
      </div>
    )
  }

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

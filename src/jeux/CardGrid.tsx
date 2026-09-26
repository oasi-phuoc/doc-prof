import type { CSSProperties, ReactNode } from 'react'
import { gameBorderSrc } from './borders'
import type { GameBoard, GameCard, GamePanel } from './types'

/** Logo ClairFLE (cercle) + libellé de série — dos identification (Mémory, etc.). */
function SeriesIdentity({
  label,
  sub,
  compact,
}: {
  label?: string
  sub?: string
  compact?: boolean
}) {
  return (
    <div className={`game-series-back${compact ? ' is-compact' : ''}`}>
      <div className="game-series-logo" aria-hidden>
        <span className="game-series-logo-mark">
          <i />
          <i />
          <i />
        </span>
        <span className="game-series-logo-text">ClairFLE</span>
      </div>
      {label ? <strong className="game-series-label">{label}</strong> : null}
      {sub ? <small className="loto-panel-theme-sub">{sub}</small> : null}
    </div>
  )
}

function BorderOverlay({ src }: { src?: string }) {
  if (!src) return null
  return <img className="game-card-border" src={src} alt="" aria-hidden draggable={false} />
}

function cardShell(
  className: string,
  card: GameCard,
  children: ReactNode,
  opts: {
    style?: CSSProperties
    borderSrc?: string
    /** Masquer le badge (bordure perso). */
    hideBadge?: boolean
  } = {},
) {
  const custom = Boolean(opts.borderSrc)
  const showBadge = Boolean(card.badge) && !opts.hideBadge && !custom
  return (
    <div
      className={`${className}${custom ? ' has-custom-border' : ''}`}
      data-badge={showBadge ? card.badge : undefined}
      style={opts.style}
    >
      {showBadge ? <span className="game-card-badge">{card.badge}</span> : null}
      {children}
      {/* Bordure au-dessus du contenu (image) pour ne pas être rognée. */}
      <BorderOverlay src={opts.borderSrc} />
    </div>
  )
}

function CardFace({
  card,
  borderId,
  side,
}: {
  card: GameCard
  borderId?: string
  side?: 'recto' | 'verso'
}) {
  const variant = card.variant ?? 'default'
  const showImageSlot =
    variant === 'default' || variant === 'image' || (variant === 'word' && Boolean(card.imageSrc))
  const showWord = variant !== 'image' && Boolean(card.text)
  const face: 'recto' | 'verso' =
    side ??
    (variant === 'series-back' || variant === 'back' || variant === 'clue' ? 'verso' : 'recto')
  const border = gameBorderSrc(borderId, face)
  const hideBadge = Boolean(border)

  if (variant === 'domino') {
    return cardShell(
      'game-card is-domino',
      card,
      <div className="game-domino">
        <div className={`game-domino-half${card.imageSrc ? ' is-image' : ' is-word'}`}>
          {card.imageSrc ? (
            <img src={card.imageSrc} alt="" />
          ) : (
            <span className="game-domino-label">{card.text}</span>
          )}
        </div>
        <span className="game-domino-sep" aria-hidden />
        <div className="game-domino-half is-word">
          <span className="game-domino-label">{card.textRight}</span>
        </div>
      </div>,
      { borderSrc: border, hideBadge },
    )
  }

  if (variant === 'clue') {
    return cardShell(
      'game-card is-clue is-verso-content',
      card,
      <ol className="game-card-clues">
        {(card.lines ?? []).map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>,
      { borderSrc: border, hideBadge },
    )
  }

  if (variant === 'back') {
    const color = card.backColor?.trim()
    return cardShell(
      `game-card is-back${color ? ' has-color' : ''}`,
      card,
      null,
      {
        style: color && !border ? ({ '--game-back': color } as CSSProperties) : undefined,
        borderSrc: border,
        hideBadge,
      },
    )
  }

  if (variant === 'series-back') {
    return cardShell(
      'game-card is-series-back',
      card,
      <SeriesIdentity label={card.text} />,
      { borderSrc: border, hideBadge },
    )
  }

  if (variant === 'scatter') {
    return cardShell(
      'game-card is-scatter',
      card,
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
      </div>,
      { borderSrc: border, hideBadge },
    )
  }

  if (variant === 'intrus-answer') {
    return cardShell(
      'game-card is-intrus-answer',
      card,
      <div className="game-card-word">{card.text}</div>,
      { borderSrc: border, hideBadge },
    )
  }

  // Verso mot (vocabulaire) : numéro petit en haut, mot centré — sans logo / série.
  if (variant === 'word' && !card.imageSrc && face === 'verso') {
    return cardShell(
      'game-card is-word is-verso-content',
      card,
      <div className="game-card-word">{card.text}</div>,
      { borderSrc: border, hideBadge },
    )
  }

  return cardShell(
    `game-card is-${variant}`,
    card,
    <>
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
    </>,
    { borderSrc: border, hideBadge },
  )
}

function PanelGrid({
  panel,
  borderId,
  side,
}: {
  panel: GamePanel
  borderId?: string
  side?: 'recto' | 'verso'
}) {
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
        <CardFace key={card.id} card={card} borderId={borderId} side={side} />
      ))}
    </div>
  )
}

function LotoPanelFace({
  panel,
  mode,
  borderId,
}: {
  panel: GamePanel
  mode: 'page' | 'back'
  borderId?: string
}) {
  const border = gameBorderSrc(borderId, mode === 'back' ? 'verso' : 'recto')
  if (mode === 'back') {
    return (
      <div className={`loto-panel is-back is-series${border ? ' has-custom-border' : ''}`}>
        <SeriesIdentity label={panel.themeLabel ?? 'Loto'} sub={panel.themeSub} />
        {panel.title ? <span className="loto-panel-theme-grid">{panel.title}</span> : null}
        <BorderOverlay src={border} />
      </div>
    )
  }
  return (
    <div className={`loto-panel${border ? ' has-custom-border' : ''}`}>
      {panel.title ? <p className="loto-panel-title">{panel.title}</p> : null}
      <PanelGrid panel={panel} borderId={borderId} side="recto" />
      <BorderOverlay src={border} />
    </div>
  )
}

export function CardGrid({ board }: { board: GameBoard }) {
  const kind = board.kind ?? 'cards'
  const borderId = board.borderId
  const side = board.side

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
              borderId={borderId}
            />
          ))}
        </div>
      </div>
    )
  }

  const ludic =
    kind === 'memory' ||
    kind === 'intrus' ||
    kind === 'tri' ||
    kind === 'devinettes' ||
    kind === 'dominos' ||
    kind === 'cards'

  return (
    <div className={`game-board is-${kind}${ludic ? ' is-ludic' : ''}`}>
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
          <CardFace key={card.id} card={card} borderId={borderId} side={side} />
        ))}
      </div>
    </div>
  )
}

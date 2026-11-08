import { useEffect, useMemo, useReducer, useState } from 'react'
import { listFiches } from '@/fiches/api'
import { domainsForAccount, readAccessAccount } from '@/access'
import type { FicheRecipe } from '@/fiches/recipe'
import { convertRecipe, hash } from './domain/convert'
import { PALETTE, inkForColor } from './domain/palette'
import { startSession, transition } from './domain/session'
import type { Game, Session } from './domain/types'
import { demoRecipe } from './demo'
import { readInteractiveDraft } from './navigation'
import { QuestionStage } from './components/QuestionStage'
import { PrintCards } from './components/PrintCards'
import './interactive.css'

type Source = { recipe: FicheRecipe; name: string }
function savedIdFromPath(): string | null {
  if (window.location.pathname === '/interactif') return null
  try {
    return (
      decodeURIComponent(
        window.location.pathname.slice('/interactif/'.length),
      ) || null
    )
  } catch {
    return null
  }
}
const defaultColors = PALETTE.map((c) => c.color) as string[]
function loadColors(): string[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem('clairfle.interactive.palette.v1') ?? 'null',
    )
    if (
      Array.isArray(parsed) &&
      parsed.length === 6 &&
      parsed.every((c) => typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c))
    )
      return parsed
  } catch {
    /* Storage is optional. */
  }
  return defaultColors
}
function returnToFiches() {
  window.history.pushState({}, '', '/fiches')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function InteractiveApp() {
  const [source, setSource] = useState<Source | null>(() =>
    window.location.pathname === '/interactif/demo'
      ? { recipe: demoRecipe(), name: 'Les cartes de la classe' }
      : readInteractiveDraft(),
  )
  const [error, setError] = useState(() =>
    !source && !savedIdFromPath()
      ? 'Ouvrez une fiche puis choisissez « Jouer avec la classe ».'
      : '',
  )
  const [loading, setLoading] = useState(!source && !!savedIdFromPath())
  const [colors, setColors] = useState(loadColors)
  const [contrast, setContrast] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [selection, setSelected] = useState<string[] | null>(null)
  useEffect(() => {
    if (source) return
    const id = savedIdFromPath()
    if (!id) return
    let active = true
    listFiches()
      .then((fiches) => {
        if (!active) return
        const fiche = fiches.find((f) => f.id === id)
        if (fiche) setSource({ recipe: fiche.recipe, name: fiche.name })
        else
          setError(
            'Cette fiche est introuvable ou inaccessible pour votre compte.',
          )
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof Error ? e.message : 'La fiche est indisponible.',
          )
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [source])
  const allowed = new Set(domainsForAccount(readAccessAccount()))
  const forbidden = source?.recipe.pages.some(
    (page) => !allowed.has(page.domain),
  )
  const game = useMemo(
    () =>
      source && !forbidden ? convertRecipe(source.recipe, source.name) : null,
    [source, forbidden],
  )
  const selected = useMemo(
    () => selection ?? game?.questions.map((q) => q.id) ?? [],
    [selection, game],
  )
  const activeGame = useMemo(
    () =>
      game
        ? {
            ...game,
            id: `${game.id}-${hash(selected.join(','))}`,
            questions: game.questions.filter((q) => selected.includes(q.id)),
          }
        : null,
    [game, selected],
  )
  let canResume = false
  try {
    canResume =
      !!activeGame &&
      !!sessionStorage.getItem(`clairfle.interactive.session.${activeGame.id}`)
  } catch {
    /* Optional. */
  }
  const changeColor = (index: number, color: string) => {
    const next = colors.map((c, i) => (i === index ? color : c))
    setColors(next)
    try {
      localStorage.setItem(
        'clairfle.interactive.palette.v1',
        JSON.stringify(next),
      )
    } catch {
      /* Optional preference. */
    }
  }
  return (
    <div className={`ci-app${contrast ? ' ci-high-contrast' : ''}`}>
      <header className="ci-header ci-no-print">
        <a href="/generateur" className="ci-brand">
          ClairFLE<span>Le studio de la classe</span>
        </a>
        <span className="ci-prototype">Aperçu · nouvelle expérience</span>
        <div className="ci-toolbar">
          <button
            aria-pressed={contrast}
            onClick={() => setContrast((c) => !c)}
          >
            Contraste
          </button>
          <button
            onClick={() => {
              if (document.fullscreenElement)
                void document.exitFullscreen().catch(() => {})
              else
                void document.documentElement
                  .requestFullscreen()
                  .catch(() => {})
            }}
          >
            Plein écran
          </button>
          <button onClick={returnToFiches}>Mes fiches</button>
        </div>
      </header>
      {loading ? (
        <main className="ci-container">
          <p role="status">Préparation de la séance…</p>
        </main>
      ) : error || forbidden ? (
        <main className="ci-container">
          <h1>Préparer une séance</h1>
          <p role="alert">
            {forbidden
              ? 'Votre compte ne permet pas de jouer cette fiche.'
              : error}
          </p>
          <a className="ci-primary" href="/generateur">
            Ouvrir le générateur
          </a>
        </main>
      ) : (
        game &&
        activeGame && (
          <>
            {playing ? (
              <SessionView
                key={activeGame.id}
                game={activeGame}
                colors={colors}
                onExit={() => setPlaying(false)}
              />
            ) : (
              <main className="ci-container">
                <div className="ci-intro ci-no-print">
                  <div>
                    <p className="ci-eyebrow">ENSEMBLE, EN CLASSE</p>
                    <h1>
                      Une question.
                      <br />
                      Toute la classe participe.
                    </h1>
                    <p className="ci-lead">
                      Chacun réfléchit, puis lève sa carte. Un élève choisit au
                      tableau. Vous gardez la main sur la correction.
                    </p>
                  </div>
                  <div className="ci-mini-cards" aria-hidden="true">
                    {PALETTE.map((c, i) => (
                      <span
                        key={c.letter}
                        style={{
                          background: colors[i],
                          color: inkForColor(colors[i]!),
                        }}
                      >
                        {c.symbol}
                        <b>{c.letter}</b>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ci-setup-grid ci-no-print">
                  <section className="ci-panel">
                    <p className="ci-eyebrow">VOTRE SÉANCE</p>
                    <h2>{game.title}</h2>
                    <p>
                      {selected.length} question{selected.length > 1 ? 's' : ''}{' '}
                      sélectionnée{selected.length > 1 ? 's' : ''} · sans
                      chronomètre · sans classement
                    </p>
                    <div className="ci-question-list">
                      {game.questions.map((q, i) => (
                        <label key={q.id}>
                          <input
                            type="checkbox"
                            checked={selected.includes(q.id)}
                            onChange={(e) =>
                              setSelected((current) =>
                                e.target.checked
                                  ? [...(current ?? selected), q.id]
                                  : (current ?? selected).filter(
                                      (id) => id !== q.id,
                                    ),
                              )
                            }
                          />
                          <span>
                            <b>
                              {i + 1}. {q.prompt}
                            </b>
                            <small>
                              {q.mode === 'choice'
                                ? `${q.choices.length} cartes réponse`
                                : 'Évaluation par l’enseignant'}
                              {q.audio ? ' · audio' : ''}
                            </small>
                          </span>
                        </label>
                      ))}
                    </div>
                    {!game.questions.length && (
                      <p>
                        Aucune question compatible dans ce premier prototype.
                      </p>
                    )}
                    <button
                      className="ci-primary ci-launch"
                      disabled={!selected.length}
                      onClick={() => setPlaying(true)}
                    >
                      {canResume
                        ? 'Reprendre la séance'
                        : 'Commencer la séance'}{' '}
                      <span aria-hidden="true">→</span>
                    </button>
                    {canResume && (
                      <button
                        className="ci-fresh-start"
                        onClick={() => {
                          try {
                            sessionStorage.removeItem(
                              `clairfle.interactive.session.${activeGame.id}`,
                            )
                          } catch {
                            /* Optional. */
                          }
                          setPlaying(true)
                        }}
                      >
                        Recommencer à zéro
                      </button>
                    )}
                  </section>
                  <aside className="ci-panel">
                    <h2>Le rituel en cinq temps</h2>
                    <ol className="ci-ritual">
                      <li>Je réfléchis.</li>
                      <li>Au signal, je lève ma carte.</li>
                      <li>Un élève choisit au tableau.</li>
                      <li>Nous discutons de la réponse.</li>
                      <li>L’enseignant révèle la correction.</li>
                    </ol>
                    <p>
                      Les votes sur cartes ne sont pas enregistrés. Aucun
                      téléphone élève n’est nécessaire.
                    </p>
                    <details>
                      <summary>Palette de la classe</summary>
                      <p>
                        La même palette s’applique à toutes les questions et aux
                        cartes imprimées.
                      </p>
                      <div className="ci-color-settings">
                        {PALETTE.map((c, i) => (
                          <label key={c.letter}>
                            {c.letter} {c.symbol}
                            <input
                              aria-label={`Couleur de la carte ${c.letter}`}
                              type="color"
                              value={colors[i]}
                              onChange={(e) => changeColor(i, e.target.value)}
                            />
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setColors(defaultColors)
                          try {
                            localStorage.removeItem(
                              'clairfle.interactive.palette.v1',
                            )
                          } catch {
                            /* optional */
                          }
                        }}
                      >
                        Rétablir les couleurs
                      </button>
                    </details>
                  </aside>
                </div>
                {!!game.issues.length && (
                  <details className="ci-panel ci-no-print">
                    <summary>
                      {game.issues.length} élément(s) à adapter avant de jouer
                    </summary>
                    <ul>
                      {game.issues.map((issue, i) => (
                        <li key={i}>
                          <b>{issue.source}</b> : {issue.reason}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                <PrintCards colors={colors} />
              </main>
            )}
          </>
        )
      )}
    </div>
  )
}

function restoreSession(game: Game): Session {
  try {
    const parsed: unknown = JSON.parse(
      sessionStorage.getItem(`clairfle.interactive.session.${game.id}`) ??
        'null',
    )
    if (parsed && typeof parsed === 'object') {
      const s = parsed as Session
      if (
        s.gameId === game.id &&
        Number.isInteger(s.index) &&
        s.index >= 0 &&
        s.index < game.questions.length &&
        typeof s.paused === 'boolean' &&
        typeof s.finished === 'boolean' &&
        Array.isArray(s.history) &&
        ['thinking', 'cards-up', 'selected', 'discussion', 'revealed'].includes(
          s.phase,
        )
      ) {
        // Resume at reflection: never expose a correction on reopening the projector.
        return {
          ...startSession(game),
          index: s.index,
          history: s.history.filter((a) =>
            game.questions.some((q) => q.id === a.questionId),
          ),
        }
      }
    }
  } catch {
    /* No persistence when browser storage is unavailable. */
  }
  return startSession(game)
}

function SessionView({
  game,
  colors,
  onExit,
}: {
  game: Game
  colors: string[]
  onExit: () => void
}) {
  const [state, dispatch] = useReducer(
    (s: Session, action: Parameters<typeof transition>[2]) =>
      transition(game, s, action),
    game,
    restoreSession,
  )
  const [retryGame, setRetryGame] = useState<Game | null>(null)
  const q = game.questions[state.index]
  useEffect(() => {
    try {
      sessionStorage.setItem(
        `clairfle.interactive.session.${game.id}`,
        JSON.stringify(state),
      )
    } catch {
      /* Optional resume, no student identity stored. */
    }
  }, [state, game.id])
  const exit = () => onExit()
  if (retryGame)
    return (
      <SessionView
        key={retryGame.id}
        game={retryGame}
        colors={colors}
        onExit={onExit}
      />
    )
  if (state.finished) {
    const answered = state.history.filter((a) => !a.skipped)
    const difficult = state.history
      .filter((a) => a.correct === false || a.manual === 'retry' || a.skipped)
      .map((a) => a.questionId)
    return (
      <main className="ci-container ci-summary">
        <p className="ci-eyebrow">FIN DE SÉANCE</p>
        <h1>Ce que nous avons travaillé</h1>
        <p>
          {answered.length} question(s) abordée(s) au tableau,{' '}
          {state.history.filter((a) => a.skipped).length} passée(s).
        </p>
        <p>
          Ce bilan décrit les actions au tableau. Il ne mesure pas les votes de
          la classe.
        </p>
        <div className="ci-panel">
          {state.history.map((a) => (
            <p key={a.questionId}>
              <b>
                {
                  game.questions.find(
                    (question) => question.id === a.questionId,
                  )?.prompt
                }
              </b>
              <span>
                {a.skipped
                  ? ' · Passée'
                  : a.correct === true
                    ? ' · Réponse au tableau correcte'
                    : a.correct === false
                      ? ' · À retravailler'
                      : a.manual === 'acquired'
                        ? ' · Acquis selon l’enseignant'
                        : a.manual === 'retry'
                          ? ' · À retravailler selon l’enseignant'
                          : ' · Sans évaluation automatique'}
              </span>
            </p>
          ))}
        </div>
        <div className="ci-toolbar">
          <button
            className="ci-primary"
            disabled={!difficult.length}
            onClick={() =>
              setRetryGame({
                ...game,
                id: `${game.id}-retry-${state.history.length}`,
                questions: game.questions.filter((question) =>
                  difficult.includes(question.id),
                ),
              })
            }
          >
            Reprendre les questions difficiles ({difficult.length})
          </button>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem(
                  `clairfle.interactive.session.${game.id}`,
                )
              } catch {
                /* optional */
              }
              exit()
            }}
          >
            Terminer
          </button>
        </div>
      </main>
    )
  }
  if (!q)
    return (
      <main className="ci-container">
        <p>Aucune question sélectionnée.</p>
        <button onClick={exit}>Retour</button>
      </main>
    )
  const reveal = state.phase === 'revealed'
  return (
    <main
      className={`ci-session${q.mode === 'sequence' ? ' ci-sequence-session' : ''}`}
    >
      <div className="ci-session-top">
        <span>{game.title}</span>
        <b>
          Question {state.index + 1} / {game.questions.length}
        </b>
        <div className="ci-toolbar">
          <button
            onClick={() =>
              dispatch({ type: state.paused ? 'RESUME' : 'PAUSE' })
            }
          >
            {state.paused ? 'Reprendre' : 'Pause'}
          </button>
          <button onClick={exit}>Quitter la séance</button>
        </div>
      </div>
      {state.paused ? (
        <section className="ci-pause">
          <p className="ci-eyebrow">LA SÉANCE EST EN PAUSE</p>
          <h1>On reprend dans un instant.</h1>
          <button
            className="ci-primary"
            onClick={() => dispatch({ type: 'RESUME' })}
          >
            Reprendre
          </button>
        </section>
      ) : (
        <>
          <QuestionStage
            q={q}
            phase={state.phase}
            selected={state.selected}
            colors={colors}
            onSelect={(choiceId) => dispatch({ type: 'SELECT', choiceId })}
          />
          {reveal && (
            <section className="ci-reveal" aria-live="polite">
              <p className="ci-eyebrow">CORRECTION · ENSEIGNANT</p>
              {game.corrections[q.id]?.choiceId && (
                <b>
                  Carte{' '}
                  {
                    PALETTE[
                      q.choices.findIndex(
                        (c) => c.id === game.corrections[q.id]?.choiceId,
                      )
                    ]?.letter
                  }
                </b>
              )}
              <p>{game.corrections[q.id]?.text}</p>
              {q.mode !== 'choice' && (
                <div className="ci-toolbar">
                  <button
                    onClick={() =>
                      dispatch({ type: 'ASSESS', value: 'acquired' })
                    }
                  >
                    Acquis
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'ASSESS', value: 'retry' })}
                  >
                    À retravailler
                  </button>
                </div>
              )}
            </section>
          )}
          <footer className="ci-controls">
            <div className="ci-toolbar">
              <button
                disabled={state.index === 0}
                onClick={() => dispatch({ type: 'PREVIOUS' })}
              >
                Précédente
              </button>
              <button
                disabled={reveal}
                onClick={() => dispatch({ type: 'SKIP' })}
              >
                Passer
              </button>
            </div>
            <div className="ci-toolbar">
              {state.phase === 'thinking' && (
                <button
                  className="ci-primary"
                  onClick={() => dispatch({ type: 'CARDS_UP' })}
                >
                  {q.mode === 'choice'
                    ? 'Signal : levez vos cartes'
                    : 'Commencer l’échange'}
                </button>
              )}
              {(state.phase === 'selected' ||
                (q.mode !== 'choice' && state.phase === 'cards-up')) && (
                <button
                  className="ci-primary"
                  onClick={() => dispatch({ type: 'DISCUSS' })}
                >
                  Discuter
                </button>
              )}
              {state.phase === 'cards-up' && q.mode === 'choice' && (
                <span>Un élève choisit au tableau.</span>
              )}
              {state.phase === 'discussion' && (
                <button
                  className="ci-primary"
                  onClick={() => dispatch({ type: 'REVEAL' })}
                >
                  Enseignant : révéler
                </button>
              )}
              {reveal && (
                <button
                  className="ci-primary"
                  onClick={() => dispatch({ type: 'NEXT' })}
                >
                  {state.index === game.questions.length - 1
                    ? 'Voir le bilan'
                    : 'Question suivante'}
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </main>
  )
}

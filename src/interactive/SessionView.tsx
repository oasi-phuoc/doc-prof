import { useEffect, useReducer, useState } from 'react'
import { prepareGame, questionsForRound, roundsFor } from './domain/plan'
import { startSession, transition } from './domain/session'
import type { Game, Session } from './domain/types'
import type { ShapeId } from './domain/palette'
import { QuestionStage } from './components/QuestionStage'
import { CorrectionView } from './components/CorrectionView'
import { PhaseBanner } from './components/PhaseBanner'
import { AudioPlayer, type AudioStatus } from './components/Media'
import { IconButton } from './components/Icons'
import { ReflectionTimer } from './components/ReflectionTimer'
import type { TimerSettings } from './domain/settings'
import { sessionKey } from './domain/persistence'

function restoreSession(game: Game): Session {
  try {
    const value: unknown = JSON.parse(
      sessionStorage.getItem(sessionKey(game)) ?? 'null',
    )
    if (value && typeof value === 'object') {
      const s = value as Session
      if (
        s.gameId === game.id &&
        Number.isInteger(s.index) &&
        s.index >= 0 &&
        s.index < roundsFor(game).length &&
        Array.isArray(s.history)
      ) {
        const history = s.history
          .filter((a) => a && game.questions.some((q) => q.id === a.questionId))
          .map((a) => ({
            questionId: a.questionId,
            selected: typeof a.selected === 'string' ? a.selected : undefined,
            correct: typeof a.correct === 'boolean' ? a.correct : undefined,
            skipped: a.skipped === true,
            manual:
              a.manual === 'acquired' || a.manual === 'retry'
                ? a.manual
                : undefined,
          }))
        // Reopening the projector always requires reflection and a fresh reveal.
        return { ...startSession(game), index: s.index, history }
      }
    }
  } catch {
    /* Browser storage is optional. */
  }
  return startSession(game)
}

export function SessionView({
  game,
  colors,
  shapes,
  timer,
  onTimer,
  onExit,
}: {
  game: Game
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  onTimer: (settings: TimerSettings) => void
  onExit: () => void
}) {
  const [state, dispatch] = useReducer(
    (s: Session, action: Parameters<typeof transition>[2]) =>
      transition(game, s, action),
    game,
    restoreSession,
  )
  const [retryGame, setRetryGame] = useState<Game | null>(null)
  const [hidden, setHidden] = useState(document.hidden)
  const rounds = roundsFor(game)
  const questions = questionsForRound(game, state.index)
  const round = rounds[state.index]
  useEffect(() => {
    try {
      sessionStorage.setItem(sessionKey(game), JSON.stringify(state))
    } catch {
      /* Optional resume. */
    }
  }, [state, game])
  useEffect(() => {
    const changed = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', changed)
    return () => document.removeEventListener('visibilitychange', changed)
  }, [])
  if (retryGame)
    return (
      <SessionView
        key={retryGame.id}
        game={retryGame}
        colors={colors}
        shapes={shapes}
        timer={timer}
        onTimer={onTimer}
        onExit={onExit}
      />
    )
  if (state.finished) {
    const difficult = state.history
      .filter((a) => a.correct === false || a.manual === 'retry' || a.skipped)
      .map((a) => a.questionId)
    return (
      <main className="ci-container ci-summary">
        <p className="ci-eyebrow">Fin de séance</p>
        <h1>Ce que nous avons travaillé</h1>
        <p>
          {state.history.filter((a) => !a.skipped).length} question(s)
          abordée(s) au tableau, {state.history.filter((a) => a.skipped).length}{' '}
          passée(s).
        </p>
        <p>
          Ce bilan décrit les réponses au tableau et les observations de
          l’enseignant. Les votes sur cartes de la classe ne sont pas comptés.
        </p>
        <div className="ci-panel">
          {game.questions.map((q) => {
            const a = state.history.find(
              (attempt) => attempt.questionId === q.id,
            )
            if (!a) return null
            const label = a.skipped
              ? 'Passée'
              : a.correct === true
                ? 'Réponse au tableau correcte'
                : a.correct === false
                  ? 'À retravailler au tableau'
                  : a.manual === 'acquired'
                    ? 'Acquis selon l’enseignant'
                    : a.manual === 'retry'
                      ? 'À retravailler selon l’enseignant'
                      : 'Sans évaluation automatique'
            return (
              <p key={q.id}>
                <b>{q.prompt}</b>
                <span> · {label}</span>
              </p>
            )
          })}
        </div>
        <div className="ci-toolbar">
          <button
            className="ci-primary"
            disabled={!difficult.length}
            onClick={() =>
              setRetryGame(
                prepareGame(
                  { ...game, id: `${game.id}-retry`, rounds: undefined },
                  difficult,
                ),
              )
            }
          >
            Reprendre les questions difficiles ({difficult.length})
          </button>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem(sessionKey(game))
              } catch {
                /* Optional. */
              }
              onExit()
            }}
          >
            Terminer
          </button>
        </div>
      </main>
    )
  }
  if (!round || !questions.length)
    return (
      <main className="ci-container">
        <p>Aucune question sélectionnée.</p>
        <button onClick={onExit}>Retour</button>
      </main>
    )
  const number =
    rounds
      .slice(0, state.index)
      .reduce((total, r) => total + r.questionIds.length, 0) + 1
  const reveal = state.phase === 'revealed'
  return (
    <main
      className={`ci-session${questions[0]?.mode === 'sequence' ? ' ci-sequence-session' : ''}${questions.length === 2 ? ' ci-dual-session' : ''}`}
    >
      <div className="ci-session-top">
        <div className="ci-session-menu">
          <span className="ci-session-title" title={game.title}>
            {game.title}
          </span>
          <div
            className="ci-toolbar ci-session-actions"
            aria-label="Commandes de la séance"
          >
            <IconButton
              icon="skip"
              label="Passer"
              disabled={reveal || state.paused}
              onClick={() => dispatch({ type: 'SKIP' })}
            />
            <IconButton
              icon={state.paused ? 'play' : 'pause'}
              label={state.paused ? 'Reprendre' : 'Pause'}
              onClick={() =>
                dispatch({ type: state.paused ? 'RESUME' : 'PAUSE' })
              }
            />
            <IconButton
              icon="exit"
              label="Quitter la séance"
              onClick={onExit}
            />
          </div>
        </div>
        <p className="ci-progress">
          {questions.length === 2
            ? `Questions ${number} et ${number + 1}`
            : `Question ${number}`}{' '}
          / {game.questions.length}
        </p>
      </div>
      {state.paused && (
        <section className="ci-pause">
          <h1>On reprend dans un instant.</h1>
          <button
            className="ci-primary"
            onClick={() => dispatch({ type: 'RESUME' })}
          >
            Reprendre la séance
          </button>
        </section>
      )}
      <div hidden={state.paused}>
        <RoundView
          key={round.id}
          game={game}
          index={state.index}
          state={state}
          dispatch={dispatch}
          colors={colors}
          shapes={shapes}
          timer={timer}
          onTimer={onTimer}
          suspended={state.paused || hidden}
        />
        <footer className="ci-controls">
          {state.phase === 'thinking' && (
            <button
              className="ci-primary"
              onClick={() => dispatch({ type: 'CARDS_UP' })}
            >
              {questions[0]?.mode === 'choice'
                ? 'Signal : levez vos cartes'
                : 'Commencer l’échange'}
            </button>
          )}
          {(state.phase === 'selected' ||
            (questions[0]?.mode !== 'choice' &&
              state.phase === 'cards-up')) && (
            <button
              className="ci-primary"
              onClick={() => dispatch({ type: 'DISCUSS' })}
            >
              Discuter
            </button>
          )}
          {state.phase === 'cards-up' && questions[0]?.mode === 'choice' && (
            <p>
              {questions.length === 2
                ? 'Choisissez une carte pour chaque question.'
                : 'Un élève choisit au tableau.'}
            </p>
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
              {state.index === rounds.length - 1
                ? 'Voir le bilan'
                : 'Question suivante'}
            </button>
          )}
        </footer>
      </div>
    </main>
  )
}

function RoundView({
  game,
  index,
  state,
  dispatch,
  colors,
  shapes,
  timer,
  onTimer,
  suspended,
}: {
  game: Game
  index: number
  state: Session
  dispatch: (action: Parameters<typeof transition>[2]) => void
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  onTimer: (settings: TimerSettings) => void
  suspended: boolean
}) {
  const questions = questionsForRound(game, index)
  const audio = roundsFor(game)[index]?.audio
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('waiting')
  const [audioOverride, setAudioOverride] = useState(false)
  const [playback, setPlayback] = useState(0)
  const [hintCount, setHintCount] = useState(0)
  const reveal = state.phase === 'revealed'
  return (
    <>
      <PhaseBanner
        phase={state.phase}
        choice={questions[0]?.mode === 'choice'}
      />
      {!reveal && (
        <ReflectionTimer
          key={playback}
          settings={timer}
          running={state.phase === 'thinking' && !suspended}
          waitingForAudio={!!audio && audioStatus !== 'ended' && !audioOverride}
          audioFailed={audioStatus === 'error'}
          onAudioOverride={() => setAudioOverride(true)}
          onChange={onTimer}
        />
      )}
      {audio && !reveal && (
        <AudioPlayer
          key={audio}
          src={audio}
          paused={suspended}
          onStatus={(status) => {
            setAudioStatus(status)
            if (status === 'playing') {
              setAudioOverride(false)
              setPlayback((n) => n + 1)
            }
          }}
        />
      )}
      <div className="ci-round-questions">
        {questions.map((q, i) => (
          <article
            className="ci-round-question"
            key={q.id}
            aria-label={`Question ${i + 1} : ${q.prompt}`}
          >
            {reveal ? (
              <CorrectionView
                question={q}
                correction={game.corrections[q.id]!}
                selected={state.selections[q.id]}
                colors={colors}
                shapes={shapes}
                offset={i * 3}
                assessment={
                  state.history.find((a) => a.questionId === q.id)?.manual
                }
                onAssess={(value) =>
                  dispatch({ type: 'ASSESS', questionId: q.id, value })
                }
              />
            ) : (
              <QuestionStage
                q={q}
                phase={state.phase}
                selected={state.selections[q.id]}
                colors={colors}
                shapes={shapes}
                slotOffset={i * 3}
                onSelect={(choiceId) =>
                  dispatch({ type: 'SELECT', questionId: q.id, choiceId })
                }
              />
            )}
            {!!q.hints?.length && state.phase !== 'thinking' && !reveal && (
              <div className="ci-oral-hints">
                {q.hints.slice(0, hintCount).map((hint, n) => (
                  <p key={n}>{hint}</p>
                ))}
                <button
                  disabled={hintCount >= q.hints.length}
                  onClick={() => setHintCount((n) => n + 1)}
                >
                  Proposer une relance
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  )
}

import { useEffect, useReducer, useState } from 'react'
import { prepareGame, questionsForRound, roundsFor } from './domain/plan'
import { startSession, transition } from './domain/session'
import type { Game, Session } from './domain/types'
import type { ShapeId } from './domain/palette'
import { QuestionStage } from './components/QuestionStage'
import { CorrectionView } from './components/CorrectionView'
import { PhaseBanner } from './components/PhaseBanner'
import {
  ClassroomHeader,
  type ClassroomHeaderProps,
} from './components/ClassroomHeader'
import { advanceAction } from './domain/progression'
import { isLessonEnter } from './keyboard'
import { AudioPlayer, type AudioStatus } from './components/Media'
import { ReflectionTimer } from './components/ReflectionTimer'
import type { TimerSettings } from './domain/settings'
import { sessionKey } from './domain/persistence'
import type { MediaManager } from './media/manager'

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
  onExit,
  mediaManager,
  header,
}: {
  game: Game
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  onExit: () => void
  mediaManager?: MediaManager
  header: ClassroomHeaderProps
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
  useEffect(() => {
    if (!mediaManager || state.finished || state.paused || hidden) return
    const questions = questionsForRound(game, state.index + 1)
    if (!questions.length) return
    const controller = new AbortController()
    void mediaManager.preload(
      { id: `${game.id}:${state.index + 1}`, questions },
      controller.signal,
    )
    return () => controller.abort()
  }, [game, state.index, state.finished, state.paused, hidden, mediaManager])
  if (retryGame)
    return (
      <SessionView
        key={retryGame.id}
        game={retryGame}
        colors={colors}
        shapes={shapes}
        timer={timer}
        onExit={onExit}
        mediaManager={mediaManager}
        header={header}
      />
    )
  if (state.finished) {
    const difficult = state.history
      .filter((a) => a.correct === false || a.manual === 'retry' || a.skipped)
      .map((a) => a.questionId)
    return (
      <>
        <ClassroomHeader {...header} />
        <main className="ci-container ci-summary">
          <p className="ci-eyebrow">Fin de séance</p>
          <h1>Ce que nous avons travaillé</h1>
          <p>
            {state.history.filter((a) => !a.skipped).length} question(s)
            abordée(s) au tableau,{' '}
            {state.history.filter((a) => a.skipped).length} passée(s).
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
      </>
    )
  }
  if (!round || !questions.length)
    return (
      <main className="ci-container">
        <p>Aucune question sélectionnée.</p>
        <button onClick={onExit}>Retour</button>
      </main>
    )
  return (
    <PlayingRound
      key={round.id}
      game={game}
      state={state}
      dispatch={dispatch}
      colors={colors}
      shapes={shapes}
      timer={timer}
      header={header}
      onExit={onExit}
      suspended={state.paused || hidden}
    />
  )
}

function PlayingRound({
  game,
  state,
  dispatch,
  colors,
  shapes,
  timer,
  header,
  onExit,
  suspended,
}: {
  game: Game
  state: Session
  dispatch: (action: Parameters<typeof transition>[2]) => void
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  header: ClassroomHeaderProps
  onExit: () => void
  suspended: boolean
}) {
  const questions = questionsForRound(game, state.index)
  const rounds = roundsFor(game)
  const number =
    rounds
      .slice(0, state.index)
      .reduce((total, round) => total + round.questionIds.length, 0) + 1
  const progress = `${questions.length === 2 ? `Questions ${number} et ${number + 1}` : `Question ${number}`} / ${game.questions.length}`
  const audio = rounds[state.index]?.audio
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('waiting')
  const [audioOverride, setAudioOverride] = useState(false)
  const [playback, setPlayback] = useState(0)
  const [hintCount, setHintCount] = useState(0)
  const reveal = state.phase === 'revealed'
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (!isLessonEnter(event, state.phase !== 'cards-up') || suspended) return
      const action = advanceAction(game, state)
      if (action) {
        event.preventDefault()
        dispatch(action)
      }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [game, state, dispatch, suspended])
  const audioPlayer = audio ? (
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
  ) : undefined
  return (
    <>
      <ClassroomHeader
        {...header}
        session={{
          progress,
          paused: state.paused,
          canSkip: !reveal,
          onSkip: () => dispatch({ type: 'SKIP' }),
          onPause: () => dispatch({ type: state.paused ? 'RESUME' : 'PAUSE' }),
          onExit,
          audio: audioPlayer,
        }}
      />
      <main
        className={`ci-session${questions[0]?.mode === 'sequence' ? ' ci-sequence-session' : ''}${questions.length === 2 ? ' ci-dual-session' : ''}`}
      >
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
          <div className="ci-play-layout">
            <aside
              className="ci-phase-margin ci-margin-left"
              aria-label={
                reveal ? 'Bonnes réponses à revoir' : 'Étape de la séance'
              }
            >
              {!reveal && (
                <PhaseBanner
                  phase={state.phase}
                  choice={questions[0]?.mode === 'choice'}
                  side="left"
                />
              )}
              {state.phase === 'thinking' && (
                <ReflectionTimer
                  key={`${playback}:${timer.seconds}`}
                  settings={timer}
                  running={!suspended}
                  waitingForAudio={
                    !!audio && audioStatus !== 'ended' && !audioOverride
                  }
                  audioFailed={audioStatus === 'error'}
                  onAudioOverride={() => setAudioOverride(true)}
                />
              )}
              {reveal &&
                questions.map((q, i) => (
                  <CorrectionView
                    key={q.id}
                    placement="left"
                    number={questions.length === 2 ? i + 1 : undefined}
                    question={q}
                    correction={game.corrections[q.id]!}
                    selected={state.selections[q.id]}
                    colors={colors}
                    shapes={shapes}
                    offset={i * 3}
                    onAssess={() => {}}
                  />
                ))}
            </aside>
            <div className="ci-round-questions">
              {questions.map((q, i) => (
                <article
                  className={`ci-round-question${reveal ? ' ci-reveal' : ''}`}
                  key={q.id}
                  aria-label={`${reveal ? 'Correction' : 'Question'} ${i + 1} : ${q.prompt}`}
                >
                  <QuestionStage
                    q={q}
                    phase={state.phase}
                    selected={state.selections[q.id]}
                    colors={colors}
                    shapes={shapes}
                    slotOffset={i * 3}
                    number={questions.length === 2 ? i + 1 : undefined}
                    correctChoiceId={
                      reveal ? game.corrections[q.id]?.choiceId : undefined
                    }
                    onSelect={(choiceId) =>
                      dispatch({ type: 'SELECT', questionId: q.id, choiceId })
                    }
                  />
                  {reveal && (
                    <CorrectionView
                      placement="model"
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
                  )}
                  {!!q.hints?.length &&
                    state.phase !== 'thinking' &&
                    !reveal && (
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
            <aside
              className="ci-phase-margin ci-margin-right"
              aria-label={reveal ? 'Résultats au tableau' : 'Action au tableau'}
            >
              {!reveal && (
                <PhaseBanner
                  phase={state.phase}
                  choice={questions[0]?.mode === 'choice'}
                  side="right"
                />
              )}
              {reveal &&
                questions.map((q, i) => (
                  <CorrectionView
                    key={q.id}
                    placement="right"
                    number={questions.length === 2 ? i + 1 : undefined}
                    question={q}
                    correction={game.corrections[q.id]!}
                    selected={state.selections[q.id]}
                    colors={colors}
                    shapes={shapes}
                    offset={i * 3}
                    onAssess={() => {}}
                  />
                ))}
            </aside>
          </div>
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
    </>
  )
}

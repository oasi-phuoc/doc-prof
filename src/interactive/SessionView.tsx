import { useCallback, useEffect, useRef, useState } from 'react'
import { prepareGame, questionsForRound, roundsFor } from './domain/plan'
import { startSession, transition } from './domain/session'
import type { Action, Game, Session } from './domain/types'
import type { ShapeId } from './domain/palette'
import { Mascot } from './components/Mascot'
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
import { useCountdown } from './useCountdown'
import type { TimerSettings } from './domain/settings'
import { loadSession, newRecord, saveSession, deleteSession, STORAGE_WARNING, remainingFor, type Resume, type SavedSession, type SessionClock } from './domain/persistence'
import type { MediaManager } from './media/manager'

export function SessionView(props: Parameters<typeof ActiveSessionView>[0]) {
  const [loaded, setLoaded] = useState<{ resume: Resume | null; warning?: string } | null>(null)
  useEffect(() => {
    let active = true
    void loadSession(props.game, props.header.mode).then(
      (resume) => { if (active) setLoaded({ resume }) },
      (error: unknown) => { if (active) setLoaded({ resume: null, warning: error instanceof Error ? error.message : STORAGE_WARNING }) },
    )
    return () => { active = false }
  }, [props.game, props.header.mode])
  if (!loaded) return <main className="ci-container"><p role="status">Chargement de la séance…</p></main>
  return <ActiveSessionView {...props} resume={loaded.resume} initialWarning={loaded.warning} />
}

function ActiveSessionView({
  game,
  colors,
  shapes,
  timer,
  onExit,
  mediaManager,
  header,
  resume,
  initialWarning,
}: {
  resume?: Resume | null
  initialWarning?: string
  game: Game
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  onExit: () => void
  mediaManager?: MediaManager
  header: ClassroomHeaderProps
}) {
  const [state, setState] = useState(() => resume?.state ?? startSession(game, header.mode))
  const current = useRef(state)
  const [initialRecord] = useState(() => resume ? Promise.resolve(resume.record) : newRecord(game, header.mode))
  const record = useRef<Promise<SavedSession>>(initialRecord)
  const writes = useRef(Promise.resolve())
  const clock = useRef<SessionClock | undefined>(resume?.record.clock)
  const clockSave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [storageWarning, setStorageWarning] = useState(initialWarning ?? '')
  const enabled = useRef(!initialWarning)
  const flushClock = useCallback(() => {
    clearTimeout(clockSave.current)
    clockSave.current = undefined
    if (!enabled.current) return
    const snapshot = clock.current
    writes.current = writes.current.then(async () => {
      const previous = await record.current
      const updated = { ...previous, clock: snapshot, updatedAt: Date.now() }
      await saveSession(updated)
      record.current = Promise.resolve(updated)
    }).catch(() => { enabled.current = false; setStorageWarning(STORAGE_WARNING) })
  }, [])
  const onClock = useCallback((value: SessionClock) => {
    if (roundsFor(game)[current.current.index]?.id !== value.roundId || current.current.phase !== value.phase) return
    if (clock.current?.remainingMs === value.remainingMs && clock.current?.durationMs === value.durationMs && clock.current?.roundId === value.roundId && clock.current?.phase === value.phase) return
    clock.current = value
    if (enabled.current && clockSave.current === undefined) clockSave.current = setTimeout(flushClock, 300)
  }, [game, flushClock])
  useEffect(() => {
    const visibility = () => { if (document.hidden) flushClock() }
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('pagehide', flushClock)
    return () => {
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('pagehide', flushClock)
      flushClock()
    }
  }, [flushClock])
  const dispatch = useCallback((action: Action) => {
    const next = transition(game, current.current, action)
    if (next === current.current) return
    if (next.index !== current.current.index || next.phase !== current.current.phase) clock.current = undefined
    const actionClock = clock.current
    current.current = next
    setState(next)
    if (!enabled.current) return
    // Serialize every accepted action immediately, including pause and selection.
    writes.current = writes.current.then(async () => {
      const previous = await record.current
      if (previous.events.length >= 5000) throw new Error(STORAGE_WARNING)
      const updated: SavedSession = {
        ...previous, updatedAt: Date.now(), clock: actionClock,
        events: [...previous.events, { eventId: crypto.randomUUID(), at: Date.now(), action }],
      }
      await saveSession(updated)
      record.current = Promise.resolve(updated)
    }).catch(() => { enabled.current = false; setStorageWarning(STORAGE_WARNING) })
  }, [game])
  useEffect(() => {
    if (resume || !enabled.current) return
    writes.current = writes.current.then(async () => { await saveSession(await record.current) }).catch(() => {
      enabled.current = false
      setStorageWarning(STORAGE_WARNING)
    })
  }, [resume])
  // Attach a rejection handler even if the browser cannot initialize storage.
  useEffect(() => { void record.current.catch(() => { enabled.current = false; setStorageWarning(STORAGE_WARNING) }) }, [])
  const [retryGame, setRetryGame] = useState<Game | null>(null)
  const [hidden, setHidden] = useState(document.hidden)
  const rounds = roundsFor(game)
  const questions = questionsForRound(game, state.index)
  const round = rounds[state.index]
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
            abordée(s),{' '}
            {state.history.filter((a) => a.skipped).length} passée(s).
          </p>
          <p>
            {state.mode === 'solo' ? 'Ce bilan décrit tes réponses. Une absence de réponse dans le temps compte comme fausse. Les activités ouvertes ne sont pas notées automatiquement.' : 'Ce bilan décrit les activités travaillées collectivement. Les votes sur cartes de la classe ne sont pas comptés ni évalués individuellement.'}
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
                  ? 'Réponse correcte'
                  : a.correct === false
                    ? 'À retravailler'
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
                    state.mode,
                  ),
                )
              }
            >
              Reprendre les questions difficiles ({difficult.length})
            </button>
            <button
              onClick={() => {
                enabled.current = false
                void writes.current.then(() => deleteSession(game)).then(onExit).catch(() => setStorageWarning(STORAGE_WARNING))
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
    <>
    {storageWarning && <p className="ci-notice" role="status">{storageWarning}</p>}
    <PlayingRound
      key={round.id}
      game={game}
      state={state}
      dispatch={dispatch}
      colors={colors}
      shapes={shapes}
      timer={timer}
      header={header}
      onExit={() => { flushClock(); void writes.current.then(onExit) }}
      suspended={state.paused || hidden}
      initialClock={resume?.record.clock}
      onClock={onClock}
    />
    </>
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
  initialClock,
  onClock,
}: {
  initialClock?: SessionClock
  onClock: (clock: SessionClock) => void
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
  const solo = state.mode === 'solo'
  const roundId = rounds[state.index]!.id
  const correctionRemaining = useCountdown({
    durationMs: 5000,
    initialRemainingMs: remainingFor(initialClock, roundId, 'revealed', 5000),
    running: solo && reveal && !suspended,
    onElapsed: () => dispatch({ type: 'NEXT' }),
    onRemaining: (remainingMs) => onClock({ roundId, phase: 'revealed', durationMs: 5000, remainingMs }),
  })
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
        className={`ci-session${solo ? ' ci-solo-session' : ''}${reveal ? ' ci-is-revealed' : ''}${questions[0]?.mode === 'sequence' ? ' ci-sequence-session' : ''}${questions.length === 2 ? ' ci-dual-session' : ''}`}
      >
        {state.paused && (
          <section className="ci-pause">
            <Mascot pose="pause" label="Pause" className="ci-pause-mascot" />
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
                  key={`${solo ? 0 : playback}:${timer.seconds}`}
                  settings={solo ? { ...timer, enabled: true } : timer}
                  running={!suspended}
                  waitingForAudio={
                    !solo && !!audio && audioStatus !== 'ended' && !audioOverride
                  }
                  audioFailed={audioStatus === 'error'}
                  onAudioOverride={() => setAudioOverride(true)}
                  onElapsed={solo ? () => dispatch({ type: 'TIMEOUT' }) : undefined}
                  initialRemainingMs={playback === 0 || solo ? remainingFor(initialClock, roundId, 'thinking', timer.seconds * 1000) : undefined}
                  onRemaining={(remainingMs) => onClock({ roundId, phase: 'thinking', durationMs: timer.seconds * 1000, remainingMs })}
                />
              )}
              {reveal &&
                questions.map((q, i) => (
                  <CorrectionView
                    key={q.id}
                    collective={!solo}
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
                    canSelect={solo && state.phase === 'thinking' && !suspended}
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
              {reveal &&
                questions.map((q, i) => (
                  <CorrectionView
                    key={q.id}
                    collective={!solo}
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
            {!solo && state.phase === 'thinking' && (
              <button
                className="ci-primary"
                onClick={() => dispatch({ type: 'CARDS_UP' })}
              >
                {questions[0]?.mode === 'choice'
                  ? 'Signal : levez vos cartes'
                  : 'Commencer l’échange'}
              </button>
            )}
            {!solo && (state.phase === 'selected' || state.phase === 'cards-up') && (
              <button
                className="ci-primary"
                onClick={() => dispatch({ type: 'DISCUSS' })}
              >
                Discuter
              </button>
            )}
            {!solo && state.phase === 'discussion' && (
              <button
                className="ci-primary"
                onClick={() => dispatch({ type: 'REVEAL' })}
              >
                Enseignant : révéler
              </button>
            )}
            {!solo && reveal && (
              <button
                className="ci-primary"
                onClick={() => dispatch({ type: 'NEXT' })}
              >
                {state.index === rounds.length - 1
                  ? 'Voir le bilan'
                  : 'Question suivante'}
              </button>
            )}
            {solo && <p role="status">{reveal ? `Question suivante dans ${Math.ceil(correctionRemaining / 1000)} s` : questions[0]?.mode === 'choice' ? 'Choisis une réponse avant la fin du temps.' : 'Activité ouverte : compare ta réponse au modèle à la fin du temps.'}</p>}
          </footer>
        </div>
      </main>
    </>
  )
}

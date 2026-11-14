import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { questionsForRound, roundsFor } from './domain/plan'
import { matchingSummary, usedMatchingChoices } from './domain/matching'
import { startSession, transition } from './domain/session'
import type { Action, Game, Session } from './domain/types'
import type { ShapeId } from './domain/palette'
import { Mascot } from './components/Mascot'
import { QuestionStage } from './components/QuestionStage'
import { QuestionNavigator } from './components/QuestionNavigator'
import { questionsForAttempt, runtimeFor } from './domain/round-runtime'
import { CorrectionView } from './components/CorrectionView'
import { PhaseBanner } from './components/PhaseBanner'
import {
  ClassroomHeader,
  type ClassroomHeaderProps,
} from './components/ClassroomHeader'
import { advanceAction } from './domain/progression'
import { isLessonEnter } from './keyboard'
import { AudioPlayer, type AudioStatus } from './components/Media'
import { maxListensFor } from './domain/listening'
import { reviewTranscript } from './domain/transcripts'
import { TextReadingDialog } from './components/TextReadingDialog'
import { GuidedHints } from './components/GuidedHints'
import { ReflectionTimer } from './components/ReflectionTimer'
import { ManualCountPanel, ManualVoteView } from './components/ManualCountPanel'
import { SessionObservations } from './components/SessionObservations'
import { RevealButton, RetractRevealButton, TeacherConfirmation } from './components/TeacherControls'
import { IconButton } from './components/Icons'
import { LoadingScreen } from '@/components/LoadingScreen'
import { manualTotal } from './domain/votes'
import './counting.css'
import { useCountdown } from './useCountdown'
import type { TimerSettings } from './domain/settings'
import { compactSession, loadSession, newRecord, saveSession, STORAGE_WARNING, remainingFor, type Resume, type SavedSession, type SessionClock } from './domain/persistence'
import { makeTransfer, downloadTransfer } from './session-transfer'
import type { MediaManager } from './media/manager'
import { acquireSessionLease, type SessionLease } from './session-lease'
import type { SessionSource } from './domain/source'
import { useTeacherConsole, type TeacherConsoleBridge } from './teacher-console/useTeacherConsole'

export function SessionView(props: Omit<Parameters<typeof ActiveSessionView>[0], 'resume' | 'initialWarning' | 'ownership' | 'registerDrain'>) {
  const [attempt, setAttempt] = useState({ number: 0, takeover: false })
  const key = `${props.game.id}:${props.header.mode}:${attempt.number}`
  const [loaded, setLoaded] = useState<{ key: string; lease: SessionLease; resume: Resume | null; warning?: string } | null>(null)
  const [lostKey, setLostKey] = useState('')
  const drain = useRef<() => Promise<void>>(() => Promise.resolve())
  const registerDrain = useCallback((next: () => Promise<void>) => { drain.current = next }, [])
  useEffect(() => {
    let active = true
    const controller = new AbortController()
    let lease: SessionLease | undefined
    // Start after effect cleanup, so React's development probe cannot compete
    // with the mounted window for its own lock.
    void Promise.resolve().then(() => active ? acquireSessionLease(props.game.id, { signal: controller.signal, takeover: attempt.takeover, onYield: async () => { if (active) setLostKey(key); await drain.current() } }) : null).then(async (value) => {
      if (!value) return
      lease = value
      if (!active) { await value.release(); return }
      if (value.status === 'busy') { setLoaded({ key, lease: value, resume: null }); return }
      try {
        const resume = await loadSession(props.game, props.header.mode)
        if (active) setLoaded({ key, lease: value, resume, ...(value.status === 'unavailable' ? { warning: 'Ce navigateur ne permet pas de protéger la sauvegarde entre onglets. La séance continue sans reprise automatique.' } : {}) })
      } catch (error: unknown) {
        if (active) setLoaded({ key, lease: value, resume: null, warning: error instanceof Error ? error.message : STORAGE_WARNING })
      }
    })
    return () => {
      active = false
      controller.abort()
      void drain.current().finally(() => lease?.release())
    }
  }, [props.game, props.header.mode, attempt, key])
  if (!loaded || loaded.key !== key) return <main className="ci-container ci-session-loading"><LoadingScreen variant="panel" title={attempt.takeover ? 'Attente de l’autre fenêtre' : 'Ouverture de la séance'} description="Votre activité arrive…" /><button onClick={props.onExit}>Retour à la préparation</button></main>
  if (loaded.lease.status === 'busy' || lostKey === key) return <><ClassroomHeader {...props.header} /><main className="ci-container ci-session-busy"><h1>{lostKey === key ? 'La séance est maintenant active dans un autre onglet.' : 'Séance ouverte dans un autre onglet'}</h1><p>Une seule fenêtre pilote cette partie. Prendre la main termine la sauvegarde dans l’autre fenêtre avant de reprendre ici.</p><div className="ci-toolbar"><button className="ci-primary" onClick={() => setAttempt((value) => ({ number: value.number + 1, takeover: true }))}>Prendre la main</button><button onClick={() => setAttempt((value) => ({ number: value.number + 1, takeover: false }))}>Réessayer</button><button onClick={props.onExit}>Retour à la préparation</button></div></main></>
  return <ActiveSessionView key={key} {...props} resume={loaded.resume} initialWarning={loaded.warning} ownership={loaded.lease.isOwner} registerDrain={registerDrain} />
}

function ActiveSessionView({
  game,
  colors,
  shapes,
  timer,
  showTranscripts,
  onExit,
  onFinish,
  onNewPart,
  mediaManager,
  header,
  resume,
  initialWarning,
  ownership,
  registerDrain,
  source,
  onSessionReady,
  onRetryDifficult,
}: {
  resume?: Resume | null
  initialWarning?: string
  ownership: () => boolean
  registerDrain: (drain: () => Promise<void>) => void
  game: Game
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  showTranscripts?: boolean
  onExit: () => void
  onFinish?: () => void
  onNewPart?: () => void
  mediaManager?: MediaManager
  header: ClassroomHeaderProps
  source?: SessionSource
  onSessionReady?: (sessionId: string) => void
  onRetryDifficult?: (questionIds: string[]) => void
}) {
  const [state, setState] = useState(() => resume?.state ?? startSession(game, header.mode))
  const current = useRef(state)
  const [initialRecord] = useState(() => resume ? Promise.resolve(resume.record) : newRecord(game, header.mode, source))
  const context = useRef(source)
  const record = useRef<Promise<SavedSession>>(initialRecord)
  const writes = useRef(Promise.resolve())
  const clock = useRef<SessionClock | undefined>(resume?.record.clock)
  const clocks = useRef<Record<string, SessionClock>>({ ...resume?.record.clocks, ...(resume?.record.clock ? { [resume.record.clock.roundId]: resume.record.clock } : {}) })
  const [viewClock, setViewClock] = useState<SessionClock | undefined>(() => resume?.record.clock ?? resume?.record.clocks?.[roundsFor(game)[resume.state.index]?.id ?? ''])
  const clockSave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const clockDirty = useRef(false)
  const [storageWarning, setStorageWarning] = useState(initialWarning ?? '')
  const enabled = useRef(!initialWarning)
  const flushClock = useCallback(() => {
    clearTimeout(clockSave.current)
    clockSave.current = undefined
    if (!enabled.current || !clockDirty.current) return
    clockDirty.current = false
    const snapshot = clock.current
    const allClocks = { ...clocks.current }
    writes.current = writes.current.then(async () => {
      const previous = await record.current
      if (!ownership()) throw new Error(STORAGE_WARNING)
      const updated = { ...previous, clock: snapshot, clocks: allClocks, source: context.current ?? previous.source, updatedAt: Date.now() }
      record.current = Promise.resolve(await saveSession(updated, previous))
    }).catch((error: unknown) => { enabled.current = false; setStorageWarning(error instanceof Error ? error.message : STORAGE_WARNING) })
  }, [ownership])
  useEffect(() => {
    if (JSON.stringify(context.current) === JSON.stringify(source)) return
    context.current = source
    clockDirty.current = true
    if (enabled.current && clockSave.current === undefined) clockSave.current = setTimeout(flushClock, 300)
  }, [source, flushClock])
  useEffect(() => {
    registerDrain(() => { flushClock(); enabled.current = false; return writes.current })
  }, [registerDrain, flushClock])
  const onClock = useCallback((value: SessionClock) => {
    if (roundsFor(game)[current.current.index]?.id !== value.roundId || current.current.phase !== value.phase) return
    if ((value.attempt ?? 0) !== runtimeFor(game, current.current).attempt) return
    if (clock.current?.remainingMs === value.remainingMs && clock.current?.durationMs === value.durationMs && clock.current?.roundId === value.roundId && clock.current?.phase === value.phase && (clock.current.attempt ?? 0) === (value.attempt ?? 0)) return
    clock.current = value
    clocks.current[value.roundId] = value
    clockDirty.current = true
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
    const at = Date.now()
    const next = transition(game, current.current, action, at)
    if (next === current.current) return
    if (next.index !== current.current.index) clock.current = clocks.current[roundsFor(game)[next.index]?.id ?? '']
    else if (next.phase !== current.current.phase || runtimeFor(game, next).attempt !== runtimeFor(game, current.current).attempt) {
      delete clocks.current[roundsFor(game)[next.index]?.id ?? '']
      clock.current = undefined
    }
    const actionClock = clock.current
    setViewClock(actionClock)
    const actionClocks = { ...clocks.current }
    current.current = next
    setState(next)
    if (!enabled.current) return
    // Serialize every accepted action immediately, including pause and selection.
    writes.current = writes.current.then(async () => {
      const previous = await record.current
      if (!ownership()) throw new Error(STORAGE_WARNING)
      const updated: SavedSession = {
        ...previous, updatedAt: at, clock: actionClock, clocks: actionClocks, source: context.current ?? previous.source,
        events: [...previous.events, { eventId: crypto.randomUUID(), at, action }],
      }
      record.current = Promise.resolve(await saveSession(next.finished || updated.events.length >= 5000 ? compactSession(updated, next) : updated, previous))
    }).catch((error: unknown) => { enabled.current = false; setStorageWarning(error instanceof Error ? error.message : STORAGE_WARNING) })
  }, [game, ownership])
  const teacherConsole = useTeacherConsole({ game, state, getState: () => current.current, dispatch, ownership, guard: header.toolbarGuard ?? 'none', colors, shapes })
  useEffect(() => {
    if (!enabled.current) return
    writes.current = writes.current.then(async () => {
      const value = await record.current
      if (!ownership()) throw new Error(STORAGE_WARNING)
      const saved = await saveSession({ ...value, source: context.current ?? value.source }, resume ? value : undefined)
      record.current = Promise.resolve(saved)
      onSessionReady?.(saved.sessionId)
    }).catch((error: unknown) => {
      enabled.current = false
      setStorageWarning(error instanceof Error ? error.message : STORAGE_WARNING)
    })
  }, [resume, ownership, onSessionReady])
  // Attach a rejection handler even if the browser cannot initialize storage.
  useEffect(() => { void record.current.catch(() => { enabled.current = false; setStorageWarning(STORAGE_WARNING) }) }, [])
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
  if (state.finished) {
    const associations=matchingSummary(game,state)
    const finish = (callback: () => void) => {
      flushClock()
      void writes.current.then(callback).catch((error: unknown) => setStorageWarning(error instanceof Error ? error.message : STORAGE_WARNING))
    }
    const exportSession = () => { flushClock(); void writes.current.then(async () => { const latest = await record.current; const transfer = await makeTransfer(game, { ...latest, source: context.current ?? latest.source }, current.current); downloadTransfer(transfer) }).catch((error: unknown) => setStorageWarning(error instanceof Error ? error.message : 'Export impossible.')) }
    const difficult = [...new Set([...state.history
      .filter((a) => a.correct === false || a.manual === 'retry' || a.skipped)
      .map((a) => a.questionId), ...game.questions.filter((q) => state.teacherMarks[q.id] === 'review' || state.manualVotes[q.id]?.quick === 'majority-review').map((q) => q.id)])]
    return (
      <>
        <ClassroomHeader {...header} />
        {storageWarning && <p className="ci-notice" role="status">{storageWarning}</p>}
        <main className="ci-container ci-summary">
          <p className="ci-eyebrow">Fin de séance</p>
          <h1>Ce que nous avons travaillé</h1>
          <p>
            {state.history.filter((a) => !a.skipped).length} question(s)
            abordée(s),{' '}
            {state.history.filter((a) => a.skipped).length} passée(s).
          </p>
          <p>
            {state.mode === 'solo' ? 'Ce bilan décrit tes réponses. Une absence de réponse dans le temps compte comme fausse. Les activités ouvertes ne sont pas notées automatiquement.' : 'Ce bilan décrit les activités travaillées collectivement. Les éventuels comptages sont saisis par l’enseignant. Aucun résultat individuel n’est déduit des cartes de la classe.'}
          </p>
          {!!associations.length && <section className="ci-panel ci-matching-summary" aria-label="Bilan des associations"><h2>Associations image–mot</h2>{associations.map(group=><p key={group.groupId}><b>{group.title}</b> · Groupe {group.number}/{group.total} · {state.mode==='solo'?`${group.correct} ${group.correct>1?'paires réussies':'paire réussie'} sur ${group.size}`:`${group.completed} ${group.completed>1?'paires abordées':'paire abordée'} sur ${group.size}`}</p>)}</section>}
          <div className="ci-panel ci-summary-questions">
            {game.questions.map((original) => {
              const position = rounds.findIndex((round) => round.questionIds.includes(original.id))
              const q = questionsForAttempt(game, position, runtimeFor(game, state, position).attempt).find((q) => q.id === original.id) ?? original
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
              const vote = state.manualVotes[q.id]
              const round = rounds.find((item) => item.questionIds.includes(q.id))
              const offset = round?.questionIds.length === 2 ? round.questionIds.indexOf(q.id) * 3 : 0
              const voteDetails = vote && <><ManualVoteView question={q} vote={vote} offset={offset} />{!a.skipped && manualTotal(vote) > 0 && game.corrections[q.id]?.choiceId && <p>D’après votre comptage : {vote.counts[game.corrections[q.id]!.choiceId!] ?? 0} vote(s) sur {manualTotal(vote)} sur la bonne carte.</p>}</>
              return (
                <Fragment key={q.id}><p>
                  <b>{q.prompt}</b>
                  <span> · {label}</span>
                </p>
                {vote && (vote.shared ? <section className="ci-vote-summary" aria-label={`Vote compté manuellement : ${q.prompt}`}>{voteDetails}</section> : <details className="ci-vote-summary"><summary>Vote compté manuellement · afficher sur cet écran</summary>{voteDetails}</details>)}
                {state.mode === 'class' && <div className="ci-teacher-marks" role="group" aria-label={`Marque enseignant : ${q.prompt}`}>{([{ value: 'success', label: 'Réussi' }, { value: 'review', label: 'À revoir' }, { value: 'unassessed', label: 'Non évalué' }] as const).map((mark) => <button key={mark.value} aria-pressed={state.teacherMarks[q.id] === mark.value} onClick={() => dispatch({ type: 'TEACHER_MARK_SET', questionId: q.id, value: mark.value })}>{mark.label}</button>)}</div>}
                </Fragment>
              )
            })}
          </div>
          {!!state.previousAttempts?.length && <details className="ci-panel ci-attempt-history"><summary>Tentatives précédentes ({state.previousAttempts.length})</summary>{state.previousAttempts.map((attempt, i) => <section key={`${attempt.roundId}:${attempt.attempt}`}><b>Tentative {attempt.attempt + 1} · écran {rounds.findIndex((round) => round.id === attempt.roundId) + 1}</b><p>{attempt.results.length ? attempt.results.map((result) => `${game.questions.find((q) => q.id === result.questionId)?.prompt} · ${result.skipped ? 'passée' : result.manual === 'retry' ? 'à revoir' : 'corrigée'}`).join(' ; ') : 'Tentative relancée avant correction.'}</p>{Object.keys(attempt.manualVotes).length > 0 && <p>Comptage de cet essai conservé.</p>}<span className="ci-sr-only">Essai archivé {i + 1}</span></section>)}</details>}
          {state.mode === 'class' && <SessionObservations note={state.note} onSave={(note) => dispatch({ type: 'SESSION_NOTE_SET', note })} />}
          <section className="ci-summary-print-only">{state.note && <><h2>Observations</h2><p>{state.note}</p></>}{game.questions.filter((q) => state.manualVotes[q.id]).map((q) => <div key={q.id}><h2>{q.prompt}</h2><ManualVoteView question={q} vote={state.manualVotes[q.id]!} /></div>)}</section>
          <div className="ci-toolbar">
            <button onClick={exportSession}>Exporter la séance</button>
            <button onClick={() => window.requestAnimationFrame(() => window.print())}>Imprimer le bilan</button>
            {state.mode === 'class' && <button onClick={() => dispatch({ type: 'REOPEN', index: 0 })}>Revoir les questions</button>}
            {onNewPart && <button className="ci-primary" onClick={() => finish(onNewPart)}>Nouvelle partie</button>}
            <button
              className="ci-primary"
              disabled={!difficult.length || !onRetryDifficult}
              onClick={() => onRetryDifficult?.(difficult)}
            >
              Reprendre les questions difficiles ({difficult.length})
            </button>
            <button
              onClick={() => finish(onFinish ?? onExit)}
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
    {teacherConsole.error && <p className="ci-notice" role="alert">{teacherConsole.error}</p>}
    <PlayingRound
      key={`${round.id}:${runtimeFor(game, state).attempt}`}
      game={game}
      state={state}
      dispatch={(action) => dispatch({ ...action, roundId: round.id })}
      colors={colors}
      shapes={shapes}
      timer={timer}
      showTranscripts={showTranscripts}
      header={header}
      onExit={() => { flushClock(); void writes.current.then(onExit) }}
      suspended={state.paused || hidden || teacherConsole.dialogOpen}
      initialClock={viewClock}
      onClock={onClock}
      teacherConsole={teacherConsole.bridge}
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
  showTranscripts = true,
  header,
  onExit,
  suspended,
  initialClock,
  onClock,
  teacherConsole,
}: {
  initialClock?: SessionClock
  onClock: (clock: SessionClock) => void
  game: Game
  state: Session
  dispatch: (action: Parameters<typeof transition>[2]) => void
  colors: string[]
  shapes: ShapeId[]
  timer: TimerSettings
  showTranscripts?: boolean
  header: ClassroomHeaderProps
  onExit: () => void
  suspended: boolean
  teacherConsole: TeacherConsoleBridge
}) {
  const runtime = runtimeFor(game, state)
  const questions = questionsForAttempt(game, state.index, runtime.attempt)
  const rounds = roundsFor(game)
  const number =
    rounds
      .slice(0, state.index)
      .reduce((total, round) => total + round.questionIds.length, 0) + 1
  const progress = `${questions.length === 2 ? `Questions ${number} et ${number + 1}` : `Question ${number}`} / ${game.questions.length}`
  const audio = rounds[state.index]?.audio
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(runtime.audioComplete ? 'ended' : 'waiting')
  const [playback, setPlayback] = useState(0)
  const [counting, setCounting] = useState(false)
  const [confirmation, setConfirmation] = useState<'skip' | 'finish' | 'retry' | null>(null)
  const [navigating, setNavigating] = useState(false)
  const [readingTranscript, setReadingTranscript] = useState(false)
  const [readingModel, setReadingModel] = useState<string|null>(null)
  const modelQuestion=state.phase==='revealed'?questions.find(question=>question.id===readingModel&&question.mode!=='choice'):undefined
  const transcript = showTranscripts ? reviewTranscript(game, state) : undefined
  const controls = useRef<HTMLElement>(null)
  const locked = !!state.teacherLocked
  const blocked = suspended || locked || confirmation !== null || navigating || readingTranscript || !!readingModel
  const reveal = state.phase === 'revealed'
  const solo = state.mode === 'solo'
  const roundId = rounds[state.index]!.id
  const guidedOral=questions.length===1&&((questions[0]?.mode==='sequence'&&!questions[0].words)||(questions[0]?.mode==='oral'&&questions[0].images.length>0))
  const consoleBlocked = confirmation !== null || navigating || counting || readingTranscript || !!readingModel
  useLayoutEffect(() => { teacherConsole.setBlocked(consoleBlocked); return () => teacherConsole.setBlocked(true) }, [teacherConsole, consoleBlocked])
  // A withdrawn or suspended review must stay closed when controls return.
  if (readingTranscript && (!transcript || suspended || locked || confirmation !== null || navigating)) setReadingTranscript(false)
  if (readingModel && (!modelQuestion || suspended || locked || confirmation !== null || navigating)) setReadingModel(null)
  useEffect(() => { document.querySelector<HTMLElement>('.ci-question h1')?.focus({ preventScroll: true }) }, [])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (!isLessonEnter(event, state.phase !== 'cards-up') || blocked) return
      const action = advanceAction(game, state)
      if (action) {
        event.preventDefault()
        if (action.type === 'REVEAL' && header.toolbarGuard === 'hold-to-reveal') {
          controls.current?.querySelector<HTMLButtonElement>('.ci-reveal-button')?.focus()
          return
        }
        dispatch(action)
      }
    }
    document.addEventListener('keydown', keydown)
    return () => document.removeEventListener('keydown', keydown)
  }, [game, state, dispatch, blocked, header.toolbarGuard])
  const audioPlayer = audio ? (
    <div className="ci-audio-review">
    <AudioPlayer
      key={audio}
      src={audio}
      parts={rounds[state.index]?.audioParts}
      paused={blocked}
      listens={runtime.audioListens}
      extraListens={runtime.extraListens}
      maxListens={maxListensFor(questions)}
      onListenStarted={() => {
        dispatch({ type: 'AUDIO_LISTEN_STARTED', roundId })
        setPlayback((n) => n + 1)
      }}
      onExtraListen={solo ? undefined : () => dispatch({ type: 'AUDIO_EXTRA_LISTEN_GRANTED', roundId })}
      onStatus={(status) => {
        setAudioStatus(status)
        if (status === 'ended') dispatch({ type: 'AUDIO_STATE', roundId, status: 'ended' })
      }}
    />
    {transcript && <IconButton icon="transcript" label="Lire la transcription" disabled={suspended || locked || confirmation !== null || navigating} aria-haspopup="dialog" onClick={() => setReadingTranscript(true)} />}
    </div>
  ) : undefined
  return (
    <>
      <ClassroomHeader
        {...header}
        session={{
          progress,
          paused: state.paused,
          canSkip: !reveal,
          onSkip: () => { if (solo) dispatch({ type: 'SKIP' }); else setConfirmation('skip') },
          onPause: () => dispatch({ type: state.paused ? 'RESUME' : 'PAUSE' }),
          onExit,
          audio: audioPlayer,
          teacherLocked: locked,
          onNavigate: solo ? undefined : () => setNavigating(true),
          onConsole: solo ? undefined : teacherConsole.open,
        }}
      />
      <main
        className={`ci-session${solo ? ' ci-solo-session' : ''}${reveal ? ' ci-is-revealed' : ''}${questions[0]?.mode === 'sequence' ? ' ci-sequence-session' : ''}${guidedOral?' ci-guided-oral-session':''}${questions[0]?.words ? ' ci-word-session' : ''}${questions.length === 2 ? ' ci-dual-session' : ''}`}
      >
        {state.paused && (
          <section className="ci-pause">
            <Mascot pose="pause" label="Pause" className="ci-pause-mascot" />
            <h1>On reprend dans un instant.</h1>
            <button
              className="ci-primary"
              disabled={locked}
              onClick={() => dispatch({ type: 'RESUME' })}
            >
              Reprendre la séance
            </button>
            {locked && <IconButton icon="unlock" label="Déverrouiller les commandes" onClick={() => dispatch({ type: 'TEACHER_LOCK_SET', locked: false })} />}
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
                  key={`${runtime.attempt}:${solo ? 0 : playback}:${timer.seconds}`}
                  settings={timer}
                  running={!suspended && confirmation === null && !navigating}
                  controlsDisabled={locked}
                  waitingForAudio={
                    !solo && !!audio && !runtime.audioComplete && audioStatus !== 'ended' && !runtime.audioOverride
                  }
                  audioFailed={audioStatus === 'error'}
                  onAudioOverride={() => dispatch({ type: 'AUDIO_STATE', roundId, status: 'override' })}
                  onElapsed={solo ? () => dispatch({ type: 'TIMEOUT' }) : undefined}
                  initialRemainingMs={playback === 0 || solo ? remainingFor(initialClock, roundId, 'thinking', timer.seconds * 1000, runtime.attempt) : undefined}
                  onRemaining={(remainingMs) => onClock({ roundId, phase: 'thinking', durationMs: timer.seconds * 1000, remainingMs, attempt: runtime.attempt })}
                />
              )}
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
                    imageOrder={runtime.imageOrders[q.id]}
                    interactionsDisabled={blocked}
                    unavailableChoiceIds={usedMatchingChoices(game,state,q)}
                    onImageOrder={(order) => dispatch({ type: 'IMAGE_ORDER_SET', questionId: q.id, order })}
                    onSelect={(choiceId) =>
                      dispatch({ type: 'SELECT', questionId: q.id, choiceId })
                    }
                  />
                  {!solo && state.manualVotes[q.id]?.shared && <ManualVoteView question={q} vote={state.manualVotes[q.id]!} offset={i * 3} />}
                  {reveal && q.mode !== 'choice' && (
                    <CorrectionView
                      placement="model"
                      question={q}
                      correction={game.corrections[q.id]!}
                      selected={state.selections[q.id]}
                      assessment={
                        state.history.find((a) => a.questionId === q.id)?.manual
                      }
                      disabled={locked}
                      onAssess={(value) =>
                        dispatch({ type: 'ASSESS', questionId: q.id, value })
                      }
                      onReadModel={()=>setReadingModel(q.id)}
                    />
                  )}
                  {!guidedOral&&!!q.hints?.length&&state.phase!=='thinking'&&!reveal&&<GuidedHints hints={q.hints} count={runtime.hintsShown[q.id]??0} disabled={locked} onNext={()=>dispatch({type:'HINT_SHOW',questionId:q.id})}/>}

                </article>
              ))}
            </div>
            <aside
              className="ci-phase-margin ci-margin-right"
              aria-label={reveal ? 'Résultats au tableau' : guidedOral?'Relances de l’enseignant':'Action au tableau'}
            >
              {guidedOral&&state.phase!=='thinking'&&!reveal&&!!questions[0]?.hints?.length&&<GuidedHints hints={questions[0].hints} count={runtime.hintsShown[questions[0].id]??0} disabled={locked} onNext={()=>dispatch({type:'HINT_SHOW',questionId:questions[0].id})}/>}
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
                    onAssess={() => {}}
                  />
                ))}
            </aside>
          </div>
          <footer ref={controls} className={`ci-controls${!solo ? ' ci-class-controls' : ''}`} role="group" tabIndex={solo ? undefined : 0} aria-label={solo ? 'Suivi de la question' : 'Commandes enseignant'} data-ci-toolbar data-ci-phase-controls>
            {!solo && <div className="ci-control-start"><IconButton className="ci-teacher-action" icon={locked ? 'unlock' : 'lock'} label={locked ? 'Déverrouiller les commandes' : 'Verrouiller les commandes'} aria-pressed={locked} onClick={() => dispatch({ type: 'TEACHER_LOCK_SET', locked: !locked })} />
            {state.phase !== 'thinking' && questions.some((q) => q.mode === 'choice') && <IconButton icon="tally" label="Compter" className="ci-teacher-action ci-count-trigger" disabled={locked} onClick={() => setCounting(true)} />}</div>}
            {!solo && state.phase === 'thinking' && (
              <button
                className="ci-primary"
                disabled={locked}
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
                disabled={locked}
                onClick={() => dispatch({ type: 'DISCUSS' })}
              >
                Discuter
              </button>
            )}
            {!solo && state.phase === 'discussion' && (
              <RevealButton guard={header.toolbarGuard ?? 'none'} disabled={blocked} onReveal={() => dispatch({ type: 'REVEAL' })} />
            )}
            {!solo && reveal && (
              <button
                className="ci-primary"
                disabled={locked}
                onClick={() => dispatch({ type: 'NEXT' })}
              >
                {state.index === rounds.length - 1
                  ? 'Voir le bilan'
                  : 'Question suivante'}
              </button>
            )}
            {!solo && <div className="ci-control-end">{reveal && state.revealedAt !== undefined && <RetractRevealButton key={state.revealedAt} revealedAt={state.revealedAt} disabled={blocked} onRetract={() => dispatch({ type: 'UNREVEAL', roundId })} />}
            <IconButton className="ci-teacher-action" icon="finish" label="Terminer la séance" disabled={locked} onClick={() => setConfirmation('finish')} /></div>}
            {solo && (reveal ? <BetweenQuestionsTimer key={timer.feedbackSeconds} seconds={timer.feedbackSeconds} roundId={roundId} attempt={runtime.attempt} initialClock={initialClock} suspended={suspended || readingTranscript || !!readingModel} onClock={onClock} onNext={() => dispatch({ type: 'NEXT' })} /> : questions[0]?.mode === 'choice' ? <p role="status">{timer.enabled ? 'Choisis une réponse avant la fin du temps.' : 'Choisis une réponse à ton rythme.'}</p> : <><p role="status">{timer.enabled ? 'Activité ouverte : compare ta réponse au modèle à la fin du temps.' : 'Activité ouverte : prépare ta réponse, puis compare-la au modèle.'}</p>{!timer.enabled && <button className="ci-primary" onClick={() => dispatch({ type: 'TIMEOUT' })}>Voir le modèle</button>}</>)}
          </footer>
        </div>
        {readingTranscript && transcript && !suspended && !locked && <TextReadingDialog title="Transcription de l’écoute" text={transcript} onClose={() => setReadingTranscript(false)} />}
        {readingModel && modelQuestion && !suspended && !locked && <TextReadingDialog title="Exemple de réponse" text={game.corrections[modelQuestion.id]!.text} images={modelQuestion.images} onClose={()=>setReadingModel(null)}/>}
        {counting && !state.paused && !locked && <ManualCountPanel questions={questions} votes={state.manualVotes} onSave={(questionId, vote) => dispatch({ type: 'MANUAL_VOTE_SET', questionId, vote })} onClose={() => setCounting(false)} />}
        {navigating && !locked && <QuestionNavigator game={game} state={state} onClose={() => setNavigating(false)} onGo={(index) => { setNavigating(false); dispatch({ type: 'NAVIGATE', index }) }} onRetry={() => { setNavigating(false); setConfirmation('retry') }} />}
        {confirmation && !locked && <TeacherConfirmation action={confirmation} questionCount={questions.length} remaining={game.questions.filter((q) => !state.history.some((attempt) => attempt.questionId === q.id && !attempt.skipped)).length} onCancel={() => setConfirmation(null)} onConfirm={() => { setConfirmation(null); dispatch(confirmation === 'retry' ? { type: 'RETRY_QUESTION', roundId } : { type: confirmation === 'skip' ? 'SKIP' : 'FINISH' }) }} />}
      </main>
    </>
  )
}

function BetweenQuestionsTimer({ seconds, roundId, attempt, initialClock, suspended, onClock, onNext }: { seconds: number; roundId: string; attempt: number; initialClock?: SessionClock; suspended: boolean; onClock: (clock: SessionClock) => void; onNext: () => void }) {
  const durationMs = seconds * 1000
  const remaining = useCountdown({
    durationMs,
    initialRemainingMs: remainingFor(initialClock, roundId, 'revealed', durationMs, attempt),
    running: !suspended,
    onElapsed: onNext,
    onRemaining: (remainingMs) => onClock({ roundId, phase: 'revealed', durationMs, remainingMs, attempt }),
  })
  return <p role="timer" aria-live="off" aria-label="Temps avant la question suivante">Question suivante dans {Math.ceil(remaining / 1000)} s</p>
}

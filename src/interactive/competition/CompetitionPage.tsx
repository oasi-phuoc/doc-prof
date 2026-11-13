import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Game, Question } from '../domain/types'
import type { ShapeId } from '../domain/palette'
import type { TimerSettings } from '../domain/settings'
import { IconButton } from '../components/Icons'
import { QuestionStage } from '../components/QuestionStage'
import { AudioPlayer } from '../components/Media'
import { TextReadingDialog } from '../components/TextReadingDialog'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CompetitionAvatarPicker, CompetitionPortrait } from './Avatar'
import { CompetitionArt } from './artwork'
import type { CompetitionAvatar } from './avatars'
import { competitionQuiz, competitionStep, competitionView, type CompetitionAction, type CompetitionQuiz, type CompetitionSettings, type RoomView } from './core'
import { answerRoom, competitionAvailable, createRoom, joinRoom, readRoom, readRoomCapability, roomCommand, saveRoomCapability, type RoomCapability } from './client'
import { newLocalCompetition, prepareLocalCompetition, readLocalCompetition, writeLocalCompetition } from './local'
import { hasLocalCompetition } from './storage-key'
import './competition.css'

function navigate(path: string) { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }
function CompetitionShell({ children, title = 'Compétition', playing = false, onExit }: { children: ReactNode; title?: string; playing?: boolean; onExit: () => void }) {
  const [fullscreen, setFullscreen] = useState(false), [contrast, setContrast] = useState(false)
  useEffect(() => { const changed = () => setFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', changed); return () => document.removeEventListener('fullscreenchange', changed) }, [])
  return <div className={`ci-app ci-competition${playing ? ' ci-competition-playing' : ''}${fullscreen ? ' ci-immersive' : ''}${contrast ? ' ci-high-contrast' : ''}`}>
    <header className="ci-header ci-no-print"><div className="ci-header-start"><a href="/generateur" className="brand" aria-label="ClairFLE"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>Clair<span className="brand-accent">FLE</span></a><span className="ci-competition-heading">{title}</span></div>
      <nav className="ci-toolbar ci-header-tools" aria-label="Affichage de la compétition"><IconButton icon="contrast" label="Contraste" aria-pressed={contrast} onClick={() => setContrast((value) => !value)} /><IconButton data-ci-fullscreen icon="expand" label={fullscreen ? 'Quitter le plein écran' : 'Plein écran'} aria-pressed={fullscreen} onClick={() => { setFullscreen(!fullscreen); if (fullscreen && document.fullscreenElement) void document.exitFullscreen().catch(() => {}); else if (!fullscreen) void document.documentElement.requestFullscreen?.().catch(() => {}) }} /><IconButton icon="exit" label="Quitter la compétition" onClick={onExit} /></nav>
    </header>{children}
  </div>
}
function Scores({ view, remove }: { view: RoomView; remove?: (id: string) => void }) {
  return <ol className="ci-competition-scores" aria-label="Classement">{view.players.map((player) => <li key={player.id} data-player-id={player.id}>
    <b className="ci-competition-rank">{player.rank}</b><CompetitionPortrait avatarId={player.avatarId} seat={player.seat} outcome={view.phase === 'correction' ? player.lastCorrect : undefined} />
    <span className="ci-competition-score"><b>{player.score.toLocaleString('fr-FR')} points</b>{view.phase === 'correction' && <small>+{player.lastPoints}</small>}</span>
    {remove && <IconButton icon="close" label={`Retirer le joueur ${player.seat}`} onClick={() => remove(player.id)} />}
  </li>)}</ol>
}
function ScoresDialog({ view, close }: { view: RoomView; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const previous = document.activeElement, element = dialog.current; element?.showModal(); return () => { element?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus() } }, [])
  return <dialog ref={dialog} className="ci-competition-dialog" aria-label="Classement" onCancel={(event) => { event.preventDefault(); close() }}><h2>Classement</h2><Scores view={view} /><button onClick={close}>Revenir au jeu</button></dialog>
}
function RoomJoinLink({ code }: { code: string }) {
  const url = new URL(`/interactif/rejoindre/${code}`, location.origin).href
  const [qr, setQr] = useState(''), [copied, setCopied] = useState(false)
  useEffect(() => { let active = true; void import('qrcode').then((module) => module.default.toDataURL(url, { width: 220, margin: 2 })).then((value) => { if (active) setQr(value) }, () => {}); return () => { active = false } }, [url])
  return <div className="ci-competition-join-link">{qr && <img src={qr} width="220" height="220" alt={`Scanner pour rejoindre la salle ${code}`} />}<p><a href={url} target="_blank" rel="noreferrer">Ouvrir la page pour rejoindre</a></p><button onClick={() => { void navigator.clipboard?.writeText(url).then(() => setCopied(true), () => setCopied(false)) }}>{copied ? 'Lien copié' : 'Copier le lien'}</button></div>
}
function RoomGame({ view, host, local = false, busy = false, now, command, answer, addPlayer }: { view: RoomView; host: boolean; local?: boolean; busy?: boolean; now: number; command: (action: string, playerId?: string) => void; answer: (choiceId?: string) => void; addPlayer?: (avatar: CompetitionAvatar) => void }) {
  const [avatar, setAvatar] = useState<CompetitionAvatar>('panda'), [scoresAt, setScoresAt] = useState<number | null>(null), [finishAt, setFinishAt] = useState<number | null>(null)
  const [readingAt, setReadingAt] = useState<number | null>(null)
  const q = view.question, self = view.players.find((player) => player.id === view.self?.id), turn = view.players.find((player) => player.id === view.turnPlayerId)
  const revealed = view.phase === 'correction'
  const transcript = revealed ? view.transcript : undefined
  if (readingAt !== null && (readingAt !== view.index || !transcript || host && !view.paused && !busy)) setReadingAt(null)
  const reviewButton = transcript ? <IconButton key="transcript" icon="transcript" label="Lire la transcription" aria-haspopup="dialog" aria-disabled={busy || undefined} onClick={() => {
    if (busy) return
    if (host && !view.paused) command('pause')
    setReadingAt(view.index)
  }} /> : undefined
  const seconds = view.paused ? Math.ceil((view.remainingMs ?? 0) / 1000) : view.deadline === undefined ? null : Math.max(0, Math.ceil((view.deadline - now) / 1000))
  const publicQuestion = useMemo((): Question | undefined => q ? { ...q, source: { page: 0, block: 0, item: view.index, part: 0, exerciseType: 'competition' }, title: view.title, instruction: '', mode: 'choice', compatibility: 'auto' } : undefined, [q, view.index, view.title])
  useEffect(() => { document.querySelector<HTMLElement>('.ci-competition-main h1')?.focus({ preventScroll: true }) }, [view.phase, q?.id])
  if (view.phase === 'lobby') return <main className="ci-container ci-competition-lobby"><h1 tabIndex={-1}>{local ? 'Défi sur cet appareil' : 'La salle est ouverte'}</h1><p>{view.title} · {view.total} question(s)</p>
    {!local && <><p className="ci-competition-code" aria-label={`Code de salle : ${view.code}`}>{view.code}</p>{host && <RoomJoinLink code={view.code} />}<p>Sur chaque appareil : le code et une mascotte. Aucun nom ni pseudo.</p></>}
    {local && <><p>Choisissez une mascotte par joueur. Vous vous passerez cet appareil à tour de rôle, sans réseau.</p><CompetitionAvatarPicker selected={avatar} onSelect={setAvatar} /><button disabled={busy || view.players.length >= 60} onClick={() => addPlayer?.(avatar)}>Ajouter cette mascotte</button></>}
    {!host && self && <div className="ci-competition-waiting"><CompetitionPortrait avatarId={self.avatarId} seat={self.seat} /><p>Tu es dans la salle. Attends le départ.</p></div>}
    <p role="status">{view.players.length} joueur(s) dans la salle</p><Scores view={view} remove={host ? (id) => command('remove', id) : undefined} />
    {host && <button className="ci-primary ci-competition-start" disabled={!view.players.length || busy} onClick={() => command('start')}>Commencer la compétition</button>}
  </main>
  if (view.phase === 'finished') return <main className="ci-container ci-competition-finished"><h1 tabIndex={-1}>Bravo à tous !</h1><p>{view.title}</p><Scores view={view} /><p>Les égalités gardent le même rang.</p></main>
  if (view.phase === 'handoff' && turn) return <main className="ci-container ci-competition-handoff"><h1 tabIndex={-1}>À toi !</h1><CompetitionPortrait avatarId={turn.avatarId} seat={turn.seat} /><p>Passez l’appareil à cette mascotte.</p><p>Question {view.index + 1} / {view.total}</p><button className="ci-primary" onClick={() => command('begin-turn')}>Je suis prêt</button></main>
  return <main className="ci-competition-main">
    <div className="ci-competition-round-head"><span>Question {view.index + 1} / {view.total}</span><span>{view.answered} / {view.players.length} réponse(s)</span></div>
    {view.paused ? <section className="ci-competition-pause"><h1 tabIndex={-1}>Pause</h1><p>Le temps et les réponses sont suspendus.</p>{host && <button className="ci-primary" onClick={() => command('resume')}>Reprendre</button>}</section> : <>
      {publicQuestion && <div className="ci-competition-question"><QuestionStage q={publicQuestion} phase={revealed ? 'revealed' : 'thinking'} colors={view.colors} shapes={view.shapes} selected={view.self?.selected} canSelect={!host || local ? view.phase === 'question' && !view.self?.answered && !busy : false} correctChoiceId={revealed ? view.correctChoiceId : undefined} unavailableChoiceIds={view.unavailableChoiceIds} onSelect={(id) => answer(id)} /></div>}
      <div className="ci-competition-status">
        {self && <CompetitionPortrait avatarId={self.avatarId} seat={self.seat} outcome={revealed ? view.self?.correct : undefined} />}
        <div>{seconds !== null && <output role="timer" aria-live="off" aria-label={revealed ? 'Temps avant la question suivante' : 'Temps restant'} className="ci-competition-clock">{seconds}</output>}
          {!view.settings.enabled && !revealed && <span>À ton rythme</span>}
          <p role="status">{revealed && view.self ? `${view.self.correct ? 'Félicitations !' : 'À réessayer'} · +${view.self.points ?? 0} points` : view.self?.answered ? 'Réponse envoyée. Attends la correction.' : revealed ? 'Correction' : host && !local ? 'Les joueurs choisissent sur leur appareil.' : 'Choisis une carte.'}</p>
        </div>
        {revealed && <button onClick={() => setScoresAt(view.index)}>Voir le classement</button>}
      </div>
      {q?.audio && <div className="ci-competition-audio"><AudioPlayer key={`${q.id}:${view.turnPlayerId ?? ''}`} src={q.audio} parts={q.audioParts} paused={view.paused || revealed} /></div>}
      {view.self?.correct && revealed && <div className="ci-competition-confetti" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} data-ci-motion style={{ left: `${i * 8}%`, animationDelay: `${i % 4 * -.3}s`, background: view.colors[i % 6] }} />)}</div>}
    </>}
    {host && <div className="ci-toolbar ci-competition-host-controls"><IconButton icon={view.paused ? 'play' : 'pause'} label={view.paused ? 'Reprendre' : 'Pause'} disabled={busy} onClick={() => command(view.paused ? 'resume' : 'pause')} />
      {!view.paused && (revealed || !local) && <button className="ci-primary" disabled={busy} onClick={() => command('next')}>{revealed ? 'Question suivante' : 'Afficher la correction'}</button>}
      {local && !revealed && !view.paused && <button disabled={busy} onClick={() => answer()}>Passer mon tour</button>}
      {reviewButton}
      <IconButton icon="finish" label="Terminer la compétition" disabled={busy} onClick={() => setFinishAt(view.index)} />
    </div>}
    {!host && reviewButton && <div className="ci-competition-review-controls">{reviewButton}</div>}
    {readingAt === view.index && transcript && (!host || view.paused) && <TextReadingDialog title="Transcription de l’écoute" text={transcript} onClose={() => setReadingAt(null)} />}
    {scoresAt === view.index && revealed && <ScoresDialog view={view} close={() => setScoresAt(null)} />}
    {finishAt === view.index && <ConfirmFinish confirm={() => { setFinishAt(null); command('finish') }} close={() => setFinishAt(null)} />}
  </main>
}
function ConfirmFinish({ confirm, close }: { confirm: () => void; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const previous = document.activeElement, element = dialog.current; element?.showModal(); return () => { element?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus() } }, [])
  return <dialog className="ci-competition-dialog" ref={dialog} aria-label="Terminer la compétition" onCancel={(event) => { event.preventDefault(); close() }}><h2>Terminer la compétition ?</h2><p>Le classement gardera les points obtenus.</p><button onClick={close}>Continuer à jouer</button><button onClick={confirm}>Terminer et voir le classement</button></dialog>
}
function LocalGame({ quiz, settings, colors, shapes, onExit, onNewPart }: { quiz: CompetitionQuiz; settings: CompetitionSettings; colors: string[]; shapes: ShapeId[]; onExit: () => void; onNewPart?: () => void }) {
  const [state, setState] = useState(() => readLocalCompetition(quiz, settings, colors, shapes)), current = useRef(state), [now, setNow] = useState(Date.now)
  const dispatch = useCallback((action: CompetitionAction, target?: Pick<RoomView, 'index' | 'phase'>) => {
    const previous = current.current, at = Date.now()
    if (target && (target.index !== previous.room.index || target.phase !== previous.room.phase || !previous.room.paused && previous.room.deadline !== undefined && at >= previous.room.deadline)) return
    try {
      const room = competitionStep(previous.room, action, at)
      if (room === previous.room) return
      const journal = { ...previous.journal, events: [...previous.journal.events, { at, action }] }
      const writable = previous.writable && journal.events.length <= 5000 && writeLocalCompetition(journal)
      const next = { room, journal, writable, warning: previous.warning || (!writable ? 'La compétition continue, mais sa reprise après fermeture n’est pas disponible.' : '') }
      current.current = next; setState(next)
    } catch (error) { const next = { ...previous, warning: error instanceof Error ? error.message : 'Action indisponible.' }; current.current = next; setState(next) }
  }, [])
  useEffect(() => { const timer = setInterval(() => { setNow(Date.now()); dispatch({ type: 'tick' }) }, 200); return () => clearInterval(timer) }, [dispatch])
  useEffect(() => { const hidden = () => { if (document.hidden) dispatch({ type: 'pause' }) }; document.addEventListener('visibilitychange', hidden); return () => document.removeEventListener('visibilitychange', hidden) }, [dispatch])
  const view = competitionView(state.room, now, state.room.players[state.room.turn]?.id)
  const reset = () => { const next = newLocalCompetition(quiz, settings, colors, shapes); writeLocalCompetition(next.journal); current.current = next; setState(next) }
  return <CompetitionShell title="Défi local" playing={!['lobby', 'finished'].includes(view.phase)} onExit={() => { dispatch({ type: 'pause' }); onExit() }}>
    {state.warning && <p className="ci-notice" role="status">{state.warning} <button onClick={reset}>Recommencer le défi local</button></p>}
    <RoomGame view={view} now={now} host local command={(type, playerId) => { if (type === 'remove') dispatch({ type, playerId: playerId! }); else dispatch({ type: type as 'start' | 'begin-turn' | 'pause' | 'resume' | 'next' | 'finish' }, ['pause', 'resume'].includes(type) ? { index: view.index, phase: view.phase } : undefined) }} addPlayer={(avatarId) => dispatch({ type: 'join', avatarId })} answer={(choiceId) => dispatch({ type: 'answer', questionId: view.question!.id, playerId: view.turnPlayerId!, ...(choiceId ? { choiceId } : {}) })} />
    {view.phase === 'finished' && <button className="ci-primary ci-competition-restart" onClick={onNewPart ?? reset}>Nouvelle compétition</button>}
  </CompetitionShell>
}
function LocalPreparation(props: Parameters<typeof LocalGame>[0]) {
  const [loaded, setLoaded] = useState<Awaited<ReturnType<typeof prepareLocalCompetition>> | null>(null), [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController(); let prepared: Awaited<ReturnType<typeof prepareLocalCompetition>> | undefined
    void prepareLocalCompetition(props.quiz, controller.signal).then((result) => { if (controller.signal.aborted) result.dispose(); else { prepared = result; setLoaded(result) } }, (reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Préparation impossible.') })
    return () => { controller.abort(); prepared?.dispose() }
  }, [props.quiz])
  if (!loaded) return <CompetitionShell onExit={props.onExit}><main className="ci-container"><h1>Préparer le défi local</h1>{error ? <p role="alert">{error}</p> : <LoadingScreen variant="panel" title="Préparation du défi" description="Vos questions, audios et mascottes arrivent…" />}<p>Une fois prêt, ce défi continue sur cet appareil sans connexion.</p></main></CompetitionShell>
  return <CompetitionArt value={loaded.artwork}><LocalGame {...props} quiz={loaded.quiz} /></CompetitionArt>
}
function RemoteGame({ access, onExit }: { access: RoomCapability; onExit: () => void }) {
  const [sample, setSample] = useState<{ view: RoomView; receivedAt: number } | null>(null), [warning, setWarning] = useState(''), [busy, setBusy] = useState(false), [clock, setClock] = useState(() => performance.now())
  const latest = useRef<RoomView | null>(null), view = sample?.view
  const accept = useCallback((next: RoomView) => { if (latest.current && (next.revision < latest.current.revision || next.serverNow < latest.current.serverNow)) return; latest.current = next; setSample({ view: next, receivedAt: performance.now() }); setWarning('') }, [])
  useEffect(() => {
    const controller = new AbortController(); let timer: ReturnType<typeof setTimeout>
    const poll = async () => { try { accept((await readRoom(access, controller.signal)).view) } catch (error) { if (!controller.signal.aborted) setWarning(error instanceof Error ? error.message : 'Connexion interrompue.') } finally { if (!controller.signal.aborted) timer = setTimeout(() => { void poll() }, 1000) } }
    void poll(); return () => { controller.abort(); clearTimeout(timer) }
  }, [access, accept])
  useEffect(() => { const timer = setInterval(() => setClock(performance.now()), 200); return () => clearInterval(timer) }, [])
  const mutate = (work: () => ReturnType<typeof readRoom>) => { if (busy) return; setBusy(true); void work().then((reply) => accept(reply.view), (error: unknown) => setWarning(error instanceof Error ? error.message : 'Commande indisponible.')).finally(() => setBusy(false)) }
  return <CompetitionShell title={`Salle ${access.code}`} playing={!!view && !['lobby', 'finished'].includes(view.phase)} onExit={onExit}>
    {warning && <p role="status" className="ci-notice">{warning}</p>}
    {view ? <RoomGame view={view} now={view.serverNow + Math.max(0, clock - sample!.receivedAt)} host={access.role === 'host'} busy={busy || !!warning} command={(action, playerId) => mutate(() => roomCommand(access, action, playerId, { index: view.index, phase: view.phase }))} answer={(choiceId) => { if (choiceId && view.question) mutate(() => answerRoom(access, view.question!.id, choiceId)) }} /> : <main className="ci-container"><LoadingScreen variant="panel" title="Connexion à la salle" description="Votre salle arrive…" /></main>}
  </CompetitionShell>
}

export function CompetitionSetup({ game, timer, colors, shapes, showTranscripts: initialTranscripts = true, onExit, onNewPart }: { game: Game; timer: TimerSettings; colors: string[]; shapes: ShapeId[]; showTranscripts?: boolean; onExit: () => void; onNewPart?: () => void }) {
  const [showTranscripts, setShowTranscripts] = useState(initialTranscripts)
  const hasTranscripts = game.questions.some(q => q.audio && game.corrections[q.id]?.transcript)
  const quiz = useMemo(() => competitionQuiz(game, location.origin, hasTranscripts && showTranscripts), [game, hasTranscripts, showTranscripts])
  const [kind, setKind] = useState<'setup' | 'local'>('setup'), [speedPoints, setSpeedPoints] = useState(true), [teacherKey, setTeacherKey] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('')
  const settings = useMemo(() => ({ ...timer, speedPoints, ...(hasTranscripts ? { showTranscripts } : {}) }), [timer, speedPoints, hasTranscripts, showTranscripts])
  const [availability, setAvailability] = useState<boolean | null>(null)
  useEffect(() => { const controller = new AbortController(); void competitionAvailable(controller.signal).then((ready) => { if (!controller.signal.aborted) setAvailability(ready) }); return () => controller.abort() }, [])
  if (kind === 'local') return <LocalPreparation quiz={quiz} settings={settings} colors={colors} shapes={shapes} onExit={onExit} onNewPart={onNewPart} />
  const online = () => {
    setBusy(true); setError('')
    void createRoom(quiz, settings, colors, shapes, teacherKey).then((reply) => { saveRoomCapability({ code: reply.code, token: reply.token, role: 'host', returnTo: location.pathname + location.search }); setTeacherKey(''); navigate(`/interactif/salle/${reply.code}`) }, (reason: unknown) => setError(reason instanceof Error ? reason.message : 'Création impossible.')).finally(() => setBusy(false))
  }
  return <CompetitionShell onExit={onExit}><main className="ci-container ci-competition-setup"><h1>Jouer en compétition</h1><p>{quiz.title} · {quiz.items.length} question(s)</p>
    {quiz.items.length !== game.questions.length && <p role="status">Les activités guidées restent dans les modes Classe et Solo. La compétition utilise les questions à réponse vérifiable.</p>}
    <p>Une mascotte et un numéro par joueur, sans nom ni pseudo. Une bonne réponse rapporte jusqu’à 1 000 points ; une erreur ou le temps écoulé rapporte 0.</p>
    <label><input type="checkbox" checked={speedPoints} onChange={(event) => setSpeedPoints(event.target.checked)} />Bonus de rapidité</label>
    {hasTranscripts && <div className="ci-competition-transcript-setting"><label><input type="checkbox" checked={showTranscripts} onChange={event => setShowTranscripts(event.target.checked)} />Proposer la transcription après les réponses</label><p>Disponible après toutes les questions d’une écoute. L’enseignant peut ouvrir le texte pour mettre la correction en pause, puis reprendre la partie.</p></div>}
    <p>{timer.enabled ? `${timer.seconds} secondes par question` : 'Sans limite de temps'} · {timer.feedbackSeconds} seconde(s) de correction.</p>
    <div className="ci-competition-modes"><section className="ci-panel"><h2>Salle en ligne</h2><p>Chaque élève rejoint la salle sur son appareil, avec le code et une mascotte. Les réponses et scores sont synchronisés par le serveur.</p>
      {availability ? <><label>Accès enseignant aux salles<input type="password" autoComplete="off" value={teacherKey} onChange={(event) => setTeacherKey(event.target.value)} /></label><button className="ci-primary" disabled={busy || !teacherKey || !quiz.items.length} onClick={online}>{busy ? 'Création de la salle…' : 'Créer la salle'}</button></> : <p role="status">{availability === null ? 'Vérification des salles…' : 'Les salles en ligne ne sont pas encore activées sur ce site.'}</p>}
    </section><section className="ci-panel"><h2>Sur cet appareil</h2><p>Sans réseau entre les appareils : choisissez vos mascottes et passez-vous cet appareil à tour de rôle. Les médias sont chargés avant le départ.</p><button className="ci-primary" disabled={!quiz.items.length || busy} onClick={() => setKind('local')}>{hasLocalCompetition(quiz.id) ? 'Reprendre le défi local' : 'Préparer le défi local'}</button></section></div>
    {error && <p role="alert">{error}</p>}
  </main></CompetitionShell>
}
export default function CompetitionPage({ host = false }: { host?: boolean }) {
  const pathCode = /\/(\d{6})\/?$/.exec(location.pathname)?.[1] ?? ''
  const [code, setCode] = useState(pathCode), [avatar, setAvatar] = useState<CompetitionAvatar>('panda'), [access, setAccess] = useState<RoomCapability | null>(() => readRoomCapability(host ? 'host' : 'player', pathCode)), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const exit = () => navigate(host ? access?.returnTo?.startsWith('/interactif') ? access.returnTo : '/fiches' : '/interactif/rejoindre')
  if (access) return <RemoteGame access={access} onExit={() => { setAccess(null); exit() }} />
  const join = () => {
    setBusy(true); setError('')
    void joinRoom(code, avatar).then((reply) => { const next: RoomCapability = { code, token: reply.token, playerId: reply.playerId, role: 'player' }; saveRoomCapability(next); setAccess(next); history.replaceState({}, '', `/interactif/rejoindre/${code}`) }, (reason: unknown) => setError(reason instanceof Error ? reason.message : 'Connexion impossible.')).finally(() => setBusy(false))
  }
  return <CompetitionShell onExit={() => navigate('/')}><main className="ci-container ci-competition-join"><h1>{host ? 'Reprendre une salle' : 'Rejoins la compétition'}</h1>
    {host ? <p>L’accès enseignant à cette salle n’est pas présent dans cet onglet. Rouvrez-la depuis l’onglet qui l’a créée.</p> : <><label>Code de salle<input aria-label="Code de salle" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="off" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} /></label><p>Choisis ta mascotte. Aucun nom ni pseudo.</p><CompetitionAvatarPicker selected={avatar} onSelect={setAvatar} /><button className="ci-primary" disabled={busy || !/^\d{6}$/.test(code)} onClick={join}>{busy ? 'Connexion…' : 'Rejoindre la salle'}</button></>}
    {error && <p role="alert">{error}</p>}
  </main></CompetitionShell>
}

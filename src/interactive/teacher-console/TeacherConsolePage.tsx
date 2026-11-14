import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { CardBadge } from '../components/CardBadge'
import { SafeImage } from '../components/Media'
import { TeacherConfirmation } from '../components/TeacherControls'
import { inkForColor } from '../domain/palette'
import type { Phase } from '../domain/types'
import { CONSOLE_DISCONNECTED_MS, CONSOLE_HEARTBEAT_MS, consoleAddress, consoleChannel, consoleEnvelope, validConsoleEnvelope, type ConsoleCommand, type ConsoleSnapshot } from './protocol'
import './teacher-console.css'

const phases: Record<Phase, string> = { thinking: 'Réflexion', 'cards-up': 'Cartes levées', selected: 'Réponse proposée', discussion: 'Discussion', revealed: 'Correction' }
type Connection = 'waiting' | 'connected' | 'disconnected' | 'closed' | 'unavailable'

function useConsoleConnection() {
  const [address] = useState(() => consoleAddress(window.location.hash))
  const [snapshot, setSnapshot] = useState<ConsoleSnapshot | null>(null)
  const [connection, setConnection] = useState<Connection>('waiting')
  const [error, setError] = useState('')
  const channel = useRef<BroadcastChannel | undefined>(undefined)
  const current = useRef<ConsoleSnapshot | null>(null), lastSeen = useRef(0), ended = useRef(false)
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Console enseignant — ClairFLE'
    return () => { document.title = previousTitle }
  }, [])
  useEffect(() => {
    if (!address || !('BroadcastChannel' in window)) return
    let messages: BroadcastChannel
    try { messages = new BroadcastChannel(consoleChannel(address)) }
    catch { const failed = window.setTimeout(() => setConnection('unavailable'), 0); return () => clearTimeout(failed) }
    channel.current = messages
    ended.current = false
    const envelope = consoleEnvelope(address.session)
    const hello = () => { if (!ended.current) messages.postMessage({ ...envelope, type: 'hello' }) }
    const goodbye = () => { messages.postMessage({ ...envelope, type: 'bye' }) }
    messages.onmessage = event => {
      const value: unknown = event.data
      if (!validConsoleEnvelope(value, address.session)) return
      if (value.type === 'closed') { ended.current = true; lastSeen.current = 0; setConnection('closed'); return }
      if (ended.current) return
      if (value.type === 'ack') {
        setError(value.accepted === false ? String(value.message ?? 'Cette commande est indisponible.') : ''); return
      }
      if (value.type !== 'snapshot' || !Number.isSafeInteger(value.revision) || Number(value.revision) < 1 || !Array.isArray(value.questions) || !Array.isArray(value.commands) || !Array.isArray(value.navigation) || typeof value.available !== 'boolean') return
      const next = value as unknown as ConsoleSnapshot
      if (current.current && next.revision < current.current.revision) return
      current.current = next; lastSeen.current = Date.now()
      setSnapshot(next); setConnection('connected')
    }
    const heartbeat = setInterval(() => {
      hello()
      if (!ended.current && lastSeen.current && Date.now() - lastSeen.current > CONSOLE_DISCONNECTED_MS) setConnection('disconnected')
    }, CONSOLE_HEARTBEAT_MS)
    window.addEventListener('pagehide', goodbye)
    hello()
    return () => { clearInterval(heartbeat); window.removeEventListener('pagehide', goodbye); goodbye(); messages.close(); channel.current = undefined }
  }, [address])
  const send = useCallback((command: ConsoleCommand) => {
    const value = current.current
    if (!channel.current || !value || ended.current || Date.now() - lastSeen.current > CONSOLE_DISCONNECTED_MS) return false
    channel.current.postMessage({ ...consoleEnvelope(value.session), type: 'command', id: crypto.randomUUID(), revision: value.revision, command })
    return true
  }, [])
  return { address, snapshot, connection, error, send }
}

/** The projection measures the hold; release, blur and leaving the button cancel it. */
function ConsoleReveal({ disabled, send }: { disabled: boolean; send: (command: ConsoleCommand) => boolean }) {
  const [holding, setHolding] = useState(false), active = useRef(false), help = useId()
  const cancel = useCallback(() => {
    if (!active.current) return
    active.current = false; setHolding(false); send({ name: 'reveal-cancel' })
  }, [send])
  useEffect(() => {
    const hide = () => { if (document.hidden) cancel() }
    window.addEventListener('blur', cancel); document.addEventListener('visibilitychange', hide)
    return () => { cancel(); window.removeEventListener('blur', cancel); document.removeEventListener('visibilitychange', hide) }
  }, [cancel, disabled])
  const begin = () => {
    if (disabled || active.current || !send({ name: 'reveal-start' })) return
    active.current = true; setHolding(true)
  }
  return <>
    <button className={`ci-primary ci-reveal-button${holding ? ' ci-holding' : ''}`} disabled={disabled} aria-label="Enseignant : révéler" aria-describedby={help}
      onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); begin() }}
      onPointerUp={cancel} onPointerCancel={cancel} onLostPointerCapture={cancel} onPointerLeave={cancel} onBlur={cancel}
      onKeyDown={event => { if (!['Enter', ' '].includes(event.key)) return; event.preventDefault(); if (!event.repeat) begin() }}
      onKeyUp={event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); cancel() } }}
      onClick={event => event.preventDefault()}>
      <svg className="ci-hold-ring" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength="1"/><circle className="ci-hold-progress" data-ci-motion cx="12" cy="12" r="9" pathLength="1"/></svg>
      Maintenir pour révéler
    </button>
    <span id={help} className="ci-sr-only">Maintenez le bouton, Entrée ou Espace pendant au moins 600 millisecondes. Relâchez pour annuler.</span>
  </>
}

export default function TeacherConsolePage() {
  const { address, snapshot, connection, error, send } = useConsoleConnection()
  const [confirmation, setConfirmation] = useState<{ action: 'skip' | 'finish' | 'retry'; revision: number } | null>(null)
  const connected = connection === 'connected' && !!snapshot?.available
  const allowed = (name: ConsoleCommand['name']) => connected && !!snapshot?.commands.includes(name)
  const ready = connected && snapshot && !snapshot.finished
  const pending = ready && confirmation?.revision === snapshot.revision ? confirmation : null
  const status = !address ? 'Ouvrez cette console depuis une séance en mode Classe.' : connection === 'unavailable' || !('BroadcastChannel' in window) ? 'Ce navigateur ne permet pas la communication entre fenêtres.' : connection === 'closed' ? 'La projection a été fermée ou la séance a été quittée.' : connection === 'disconnected' ? 'La projection ne répond plus. Les commandes sont suspendues.' : connected ? snapshot.finished ? 'Séance terminée. Le bilan est disponible dans la projection.' : snapshot.blocked ? 'Fermez le panneau ouvert sur la projection pour reprendre les commandes.' : snapshot.paused ? 'Séance en pause.' : snapshot.locked ? 'Commandes verrouillées.' : 'Projection connectée.' : 'En attente de la fenêtre de projection…'
  const openConfirmation = (action: 'skip' | 'finish' | 'retry') => { if (snapshot && allowed(action) && send({ name: 'confirm-start', action })) setConfirmation({ action, revision: snapshot.revision }) }
  return <div className="ci-app ci-teacher-console">
    <header className="ci-console-heading">
      <div><p className="ci-console-private">Enseignant — ne pas projeter</p><h1>Console enseignant</h1><p>Placez cette fenêtre sur votre écran et gardez la projection sur l’écran de la classe.</p></div>
      <button onClick={() => window.close()}>Fermer la console</button>
    </header>
    <main className="ci-console-main">
      <p className={`ci-console-status${connected ? ' ci-console-connected' : ''}`} role="status">{status}</p>
      {error && <p className="ci-console-error" role="alert">{error}</p>}
      {!ready && <section className="ci-console-card"><h2>{snapshot?.finished && connected ? 'Fin de séance' : 'Votre séance reste dans la projection'}</h2><p>Fermer cette console ne termine pas la séance. Pour la rouvrir, utilisez l’icône de console dans le menu de la séance en mode Classe. La feuille enseignant reste disponible depuis la préparation.</p></section>}
      {ready && <>
        <div className="ci-console-progress"><h2>{snapshot.title}</h2><p><strong>{snapshot.progress}</strong> · {phases[snapshot.phase]}{snapshot.attempt > 0 ? ` · Tentative ${snapshot.attempt + 1}` : ''}</p></div>
        <div className="ci-console-layout">
          <div className="ci-console-questions">
            {snapshot.questions.map((question, index) => <article className="ci-console-card" key={question.id} aria-label={`Corrigé enseignant ${index + 1}`}>
              <h2>{snapshot.questions.length > 1 ? `${index + 1}. ` : ''}{question.prompt}</h2>
              <p className="ci-console-instruction">{question.instruction}</p>
              {question.context && <details><summary>Document</summary><p>{question.context}</p></details>}
              {question.answer && <div className="ci-console-answer" style={{ backgroundColor: question.answer.color, color: inkForColor(question.answer.color) }} aria-label={`Bonne réponse : carte ${question.answer.letter}`}>
                <CardBadge letter={question.answer.letter} shape={question.answer.shape}/><div><strong>Bonne réponse · carte {question.answer.letter}</strong><p>{question.answer.text}</p>{question.answer.image && <SafeImage src={question.answer.image} alt="Illustration de la bonne réponse"/>}</div>
              </div>}
              <h3>{question.mode === 'choice' ? 'Corrigé' : 'Exemple ou pistes de réponse'}</h3>
              <p className="ci-console-model">{question.model}</p>
              {question.mode !== 'choice' && <div className="ci-console-assessment" role="group" aria-label={`Appréciation : ${question.prompt}`}>
                <button disabled={!allowed('assess')} aria-pressed={question.assessment === 'acquired'} onClick={() => send({ name: 'assess', questionId: question.id, value: 'acquired' })}>Acquis</button>
                <button disabled={!allowed('assess')} aria-pressed={question.assessment === 'retry'} onClick={() => send({ name: 'assess', questionId: question.id, value: 'retry' })}>À retravailler</button>
              </div>}
              {!!question.hints.length && <section className="ci-console-hints"><h3>Relances</h3><ol>{question.hints.map((hint, i) => <li key={i}>{hint}<span>{i < question.shownHints ? ' · affichée' : ' · privée'}</span></li>)}</ol><button disabled={!allowed('hint') || question.shownHints >= question.hints.length} onClick={() => send({ name: 'hint', questionId: question.id })}>Afficher la relance suivante</button></section>}
              {question.transcript && <details className="ci-console-transcript"><summary>Transcription privée</summary><p>{question.transcript}</p></details>}
            </article>)}
          </div>
          <aside className="ci-console-card ci-console-controls" aria-label="Pilotage de la projection">
            <h2>Piloter la séance</h2>
            <div className="ci-console-primary">
              {snapshot.phase === 'thinking' && <button className="ci-primary" disabled={!allowed('cards-up')} onClick={() => send({ name: 'cards-up' })}>{snapshot.questions[0]?.mode === 'choice' ? 'Signal : levez vos cartes' : 'Commencer l’échange'}</button>}
              {(snapshot.phase === 'cards-up' || snapshot.phase === 'selected') && <button className="ci-primary" disabled={!allowed('discuss')} onClick={() => send({ name: 'discuss' })}>Discuter</button>}
              {snapshot.phase === 'discussion' && (snapshot.guard === 'hold-to-reveal' ? <ConsoleReveal key={snapshot.revision} disabled={!allowed('reveal-start')} send={send}/> : <button className="ci-primary" disabled={!allowed('reveal')} onClick={() => send({ name: 'reveal' })}>Enseignant : révéler</button>)}
              {snapshot.phase === 'revealed' && <button className="ci-primary" disabled={!allowed('next')} onClick={() => send({ name: 'next' })}>{snapshot.index === snapshot.navigation.length - 1 ? 'Voir le bilan' : 'Question suivante'}</button>}
            </div>
            <div className="ci-console-secondary"><button disabled={!allowed(snapshot.paused ? 'resume' : 'pause')} onClick={() => send({ name: snapshot.paused ? 'resume' : 'pause' })}>{snapshot.paused ? 'Reprendre' : 'Pause'}</button><button disabled={!allowed(snapshot.locked ? 'unlock' : 'lock')} aria-pressed={snapshot.locked} onClick={() => send({ name: snapshot.locked ? 'unlock' : 'lock' })}>{snapshot.locked ? 'Déverrouiller les commandes' : 'Verrouiller les commandes'}</button></div>
            <label>Choisir une question<select aria-label="Choisir une question" value={snapshot.index} disabled={!allowed('navigate')} onChange={event => send({ name: 'navigate', index: Number(event.target.value) })}>{snapshot.navigation.map(q => <option key={q.index} value={q.index}>{q.label} · {q.status}</option>)}</select></label>
            <div className="ci-console-other">
              <button disabled={!allowed('unreveal')} onClick={() => send({ name: 'unreveal' })}>Masquer à nouveau</button>
              <button disabled={!allowed('retry')} onClick={() => openConfirmation('retry')}>Nouvelle tentative</button>
              <button disabled={!allowed('skip')} onClick={() => openConfirmation('skip')}>Passer</button>
              <button disabled={!allowed('finish')} onClick={() => openConfirmation('finish')}>Terminer la séance</button>
            </div>
            <p>Les commandes s’appliquent à la projection. Les corrigés et relances privées de cette fenêtre restent réservés à l’enseignant jusqu’à leur révélation.</p>
          </aside>
        </div>
        {pending && <TeacherConfirmation action={pending.action} questionCount={snapshot.questions.length} remaining={snapshot.remaining} onCancel={() => { setConfirmation(null); send({ name: 'confirm-cancel' }) }} onConfirm={() => { setConfirmation(null); send({ name: pending.action }) }}/>}
      </>}
    </main>
  </div>
}

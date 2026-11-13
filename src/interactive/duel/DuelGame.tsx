import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { CompetitionShell } from '../competition/CompetitionShell'
import { CompetitionPortrait } from '../competition/Avatar'
import { COMPETITION_AVATARS } from '../competition/avatars'
import type { CompetitionQuestion, CompetitionQuiz } from '../competition/core'
import { PALETTE, inkForColor, type ShapeId } from '../domain/palette'
import type { TimerSettings } from '../domain/settings'
import { CardBadge } from '../components/CardBadge'
import { IconButton } from '../components/Icons'
import { AudioPlayer, SafeImage } from '../components/Media'
import { NumberSequenceView } from '../components/NumberSequenceView'
import { WordClassificationView } from '../components/WordClassificationView'
import { GeometryFigure } from '@/components/math/GeometryFigure'
import { duelRound, duelRoundId, stepDuel, type DuelAction, type DuelConfig, type Fighter, type Side } from './core'
import { newDuelRun, readDuel, writeDuel } from './storage'

type Props = { quiz: CompetitionQuiz; planId: string; config: DuelConfig; timer: TimerSettings; colors: string[]; shapes: ShapeId[]; resume: boolean; onExit: () => void; onRestart: () => void }
const fighterName = (fighter: Fighter) => `${COMPETITION_AVATARS.find(avatar => avatar.id === fighter.avatarId)!.label} ${fighter.seat}`
export function DuelGame(props: Props) {
  const [run, setRun] = useState(() => props.resume ? readDuel(props.quiz, props.planId, props.config, props.timer) : newDuelRun(props.quiz, props.planId, props.config, props.timer))
  const current = useRef(run), [now, setNow] = useState(Date.now), [confirming, setConfirming] = useState(false)
  const { state } = run, pair = state.pairs[state.pairIndex]!, round = duelRound(props.quiz, state)
  const dispatch = useCallback((action: DuelAction) => {
    const previous = current.current, at = Date.now()
    try {
      const nextState = stepDuel(props.quiz, previous.state, action, at)
      if (nextState === previous.state) return
      const journal = { ...previous.journal, events: [...previous.journal.events, { at, action }] }
      const writable = previous.writable && writeDuel(journal)
      const next = { state: nextState, journal, writable, warning: previous.warning || (writable ? '' : 'La partie continue, mais sa reprise après fermeture n’est pas disponible.') }
      current.current = next; setRun(next); setNow(at)
    } catch (error) { const next = { ...previous, warning: error instanceof Error ? error.message : 'Action indisponible.' }; current.current = next; setRun(next) }
  }, [props.quiz])
  const pause = useCallback(() => { const snapshot = current.current.state; dispatch({ type: 'pause', roundId: duelRoundId(snapshot), phase: snapshot.phase }) }, [dispatch])
  useEffect(() => {
    if (!props.resume) writeDuel(current.current.journal)
    const clock = setInterval(() => { setNow(Date.now()); dispatch({ type: 'tick' }) }, 100)
    const hidden = () => { if (document.hidden) pause() }
    document.addEventListener('visibilitychange', hidden); window.addEventListener('pagehide', pause)
    return () => { clearInterval(clock); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('pagehide', pause); pause() }
  }, [dispatch, pause, props.resume])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || document.querySelector('dialog[open]') || event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      const snapshot = current.current.state
      if (snapshot.phase !== 'question' || snapshot.paused) return
      const letter = event.key.toLowerCase(), left = 'abcdef'.indexOf(letter), right = '123456'.indexOf(letter)
      const side = left >= 0 ? 'left' : right >= 0 ? 'right' : undefined, index = left >= 0 ? left : right
      const choice = duelRound(props.quiz, snapshot).item.question.choices[index]
      if (side && choice) { event.preventDefault(); dispatch({ type: 'answer', roundId: duelRoundId(snapshot), side, choiceId: choice.id }) }
    }
    document.addEventListener('keydown', keydown); return () => document.removeEventListener('keydown', keydown)
  }, [dispatch, props.quiz])
  useEffect(() => { document.querySelector<HTMLElement>('.ci-duel-arena h1, .ci-duel-ready h1, .ci-duel-finished h1')?.focus({ preventScroll: true }) }, [state.phase, round.id])
  const resolution = state.resolution, freshImpact = state.phase === 'feedback' && !!resolution?.damage && now - resolution.at >= 0 && now - resolution.at < 1100
  const seconds = state.paused ? state.remainingMs === undefined ? null : Math.ceil(state.remainingMs / 1000) : state.deadline === undefined ? null : Math.max(0, Math.ceil((state.deadline - now) / 1000))
  const message = state.phase === 'question' ? 'Le premier clic décide du coup.' : !resolution?.side ? 'Temps écoulé : aucun dégât.' : `${resolution.correct ? 'Bonne réponse' : 'Mauvaise réponse'} : ${fighterName(pair[resolution.victim!])} perd ${resolution.damage} %.${resolution.winner ? ` ${fighterName(pair[resolution.winner])} remporte le duel !` : ''}`
  return <CompetitionShell title={state.config.mode === 'teams' ? 'Duels par équipes' : 'Duel à deux'} playing={['question', 'feedback'].includes(state.phase)} onExit={() => { pause(); props.onExit() }}>
    {run.warning && <p className="ci-notice" role="status">{run.warning} <button onClick={props.onRestart}>Nouvelle partie</button></p>}
    {state.phase === 'ready' ? <main className="ci-container ci-duel-ready"><h1 tabIndex={-1}>{state.pairIndex ? 'Prochain duel' : 'À vous de jouer !'}</h1><p>Duel {state.pairIndex + 1} / {state.pairs.length}</p>
      <div className="ci-duel-call">{(['left', 'right'] as const).map((side, index) => <section key={side}><h2>{state.config.mode === 'teams' ? `Équipe ${index + 1}` : `Joueur ${index + 1}`}</h2><CompetitionPortrait {...pair[side]} /><p>{fighterName(pair[side])}</p><b>100 %</b></section>)}</div>
      {state.config.mode === 'teams' && <p className="ci-duel-team-score">Équipe 1 : {state.wins.left} · Équipe 2 : {state.wins.right}</p>}
      <button className="ci-primary" onClick={() => dispatch({ type: 'start', pairIndex: state.pairIndex })}>Commencer le duel</button>
    </main> : state.phase === 'finished' ? <main className="ci-container ci-duel-finished"><h1 tabIndex={-1}>{state.aborted ? 'Partie arrêtée' : state.config.mode === 'duel' ? `${fighterName(state.pairs[0]![state.results[0]!.winner])} remporte le duel !` : state.wins.left === state.wins.right ? 'Égalité entre les équipes !' : `L’équipe ${state.wins.left > state.wins.right ? 1 : 2} remporte le tournoi !`}</h1>
      <div className="ci-duel-final-score"><section><h2>Équipe 1</h2><b>{state.wins.left}</b><p>duel(s) remporté(s)</p></section><section><h2>Équipe 2</h2><b>{state.wins.right}</b><p>duel(s) remporté(s)</p></section></div>
      <ol className="ci-duel-results">{state.results.map(result => <li key={result.pairIndex}>Duel {result.pairIndex + 1} : {fighterName(state.pairs[result.pairIndex]![result.winner])} · Équipe {result.winner === 'left' ? 1 : 2}</li>)}</ol>
      <button className="ci-primary" onClick={props.onRestart}>Nouvelle partie</button>
    </main> : <main className={`ci-duel-arena${state.phase === 'feedback' ? ' ci-duel-feedback' : ''}`} data-duel-round={round.id}>
      {state.paused ? <section className="ci-duel-pause"><h1 tabIndex={-1}>Duel en pause</h1><p>Les vies et le temps sont conservés.</p><button className="ci-primary" onClick={() => dispatch({ type: 'resume', roundId: round.id, phase: state.phase })}>Reprendre le duel</button></section> : <>
        <section className="ci-duel-question"><div className="ci-duel-round-meta"><span>Duel {state.pairIndex + 1}/{state.pairs.length} · Question {state.turn + 1}</span><strong data-ci-motion className={round.critical ? 'ci-duel-critical' : 'ci-duel-normal'}>{round.critical ? 'Critique ! 20 %' : '10 % de dégâts'}</strong></div><h1 tabIndex={-1}>{round.item.question.prompt}</h1><DuelSupport question={round.item.question} paused={state.phase !== 'question'} /></section>
        <div className="ci-duel-sides">{(['left', 'right'] as const).map((side, index) => <section key={side} className={`ci-duel-player${freshImpact && resolution?.victim === side ? resolution.critical ? ' ci-duel-hurt ci-duel-super-hurt' : ' ci-duel-hurt' : ''}`} data-side={side} aria-label={`Joueur ${index + 1}`}>
          <div className="ci-duel-fighter"><CompetitionPortrait {...pair[side]} outcome={state.phase === 'feedback' ? resolution?.winner === side ? true : resolution?.victim === side ? false : undefined : undefined} /><div><b>{fighterName(pair[side])}</b><div className="ci-duel-health-row"><progress max="100" value={state.hp[side]} aria-label={`Vie du joueur ${index + 1}`} /><strong className="ci-duel-hp">{state.hp[side]} %</strong></div><small>{state.config.mode === 'teams' ? `Équipe ${index + 1} · ${state.wins[side]} victoire(s)` : index ? 'Clavier : 1–6' : 'Clavier : A–F'}</small></div></div>
          <DuelChoices key={round.id} question={round.item.question} side={side} colors={props.colors} shapes={props.shapes} disabled={state.phase !== 'question'} correctId={state.phase === 'feedback' ? round.item.correctChoiceId : undefined} selected={resolution?.side === side ? resolution.choiceId : undefined} onAnswer={choiceId => dispatch({ type: 'answer', roundId: round.id, side, choiceId })} />
        </section>)}</div>
        {freshImpact && <div key={`${round.id}:${resolution!.at}`} className={`ci-duel-impact${resolution!.critical ? ' ci-duel-double-impact' : ''}`} aria-hidden="true"><svg viewBox="0 0 100 100"><path data-ci-motion className="ci-duel-slash" d="M12 88 88 12" />{resolution!.critical && <path data-ci-motion className="ci-duel-slash ci-duel-second-slash" d="M12 12 88 88" />}</svg></div>}
      </>}
      <footer className="ci-duel-controls"><IconButton icon={state.paused ? 'play' : 'pause'} label={state.paused ? 'Reprendre le duel' : 'Pause'} onClick={() => state.paused ? dispatch({ type: 'resume', roundId: round.id, phase: state.phase }) : pause()} /><p role="status">{state.paused ? 'Pause' : message}</p>{seconds !== null && <output role="timer" aria-live="off" aria-label={state.phase === 'feedback' ? 'Temps de correction' : 'Temps restant'}>{seconds} s</output>}<IconButton icon="finish" label="Arrêter la partie" onClick={() => { pause(); setConfirming(true) }} /></footer>
    </main>}
    {confirming && <FinishDuel onClose={() => setConfirming(false)} onFinish={() => { setConfirming(false); dispatch({ type: 'finish' }) }} />}
  </CompetitionShell>
}
function DuelSupport({ question: q, paused }: { question: CompetitionQuestion; paused: boolean }) {
  return <div className="ci-duel-support">{q.context && <details><summary>Lire le document</summary><p>{q.context}</p></details>}{q.wordClassification && <WordClassificationView classification={q.wordClassification} />}{q.numberSequence && <NumberSequenceView sequence={q.numberSequence} />}{q.figure && <div className="ci-duel-figure"><GeometryFigure type={q.figure.type} dims={q.figure.dims} /></div>}{!!q.images.length && <div className="ci-duel-images">{q.images.map((src, index) => <SafeImage key={src} src={src} alt={`Document ${index + 1}`} zoom />)}</div>}{q.audio && <div className="ci-duel-audio"><AudioPlayer key={q.id} src={q.audio} parts={q.audioParts} paused={paused} /></div>}</div>
}
function DuelChoices({ question, side, colors, shapes, disabled, correctId, selected, onAnswer }: { question: CompetitionQuestion; side: Side; colors: string[]; shapes: ShapeId[]; disabled: boolean; correctId?: string; selected?: string; onAnswer: (id: string) => void }) {
  return <div className="ci-duel-choices" data-count={question.choices.length} role="group" aria-label={side === 'left' ? 'Réponses du joueur 1' : 'Réponses du joueur 2'}>{question.choices.map((choice, index) => <button type="button" key={choice.id} disabled={disabled} className={`ci-duel-answer${correctId ? choice.id === correctId ? ' ci-duel-answer-key' : ' ci-duel-answer-muted' : ''}${selected === choice.id ? ' ci-duel-selected' : ''}`} style={{ '--duel-card': colors[index], '--duel-card-ink': inkForColor(colors[index]!) } as CSSProperties} aria-keyshortcuts={side === 'left' ? PALETTE[index]!.letter : String(index + 1)} aria-pressed={selected === choice.id} onClick={() => onAnswer(choice.id)}>
    <CardBadge letter={PALETTE[index]!.letter} shape={shapes[index]!} /><span className="ci-duel-answer-content">{choice.image && <SafeImage src={choice.image} alt={choice.text || `Proposition ${PALETTE[index]!.letter}`} retryable={false} />}{choice.text}</span>
  </button>)}</div>
}
function FinishDuel({ onClose, onFinish }: { onClose: () => void; onFinish: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const previous = document.activeElement, node = dialog.current; node?.showModal(); return () => { node?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus() } }, [])
  return <dialog ref={dialog} className="ci-competition-dialog" aria-label="Arrêter la partie" onCancel={event => { event.preventDefault(); onClose() }}><h2>Arrêter la partie ?</h2><p>Les duels déjà terminés gardent leurs résultats.</p><button onClick={onClose}>Continuer le duel</button><button onClick={onFinish}>Arrêter la partie</button></dialog>
}

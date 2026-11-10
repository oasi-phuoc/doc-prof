import { useEffect, useId, useRef } from 'react'
import type { Game, Session } from '../domain/types'
import { roundsFor } from '../domain/plan'
import { runtimeFor } from '../domain/round-runtime'

export function QuestionNavigator({ game, state, onGo, onRetry, onClose }: { game: Game; state: Session; onGo: (index: number) => void; onRetry: () => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const title = useId()
  useEffect(() => {
    const previous = document.activeElement
    dialog.current?.showModal()
    dialog.current?.querySelector<HTMLButtonElement>('[aria-current="step"]')?.focus()
    return () => { if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [])
  const rounds = roundsFor(game)
  return <dialog className="ci-teacher-confirm ci-question-navigator" ref={dialog} aria-labelledby={title} onCancel={(event) => { event.preventDefault(); onClose() }}>
    <h2 id={title}>Choisir une question</h2>
    <p>Chaque question retrouve son étape, ses cartes et son temps restant.</p>
    <ol>{rounds.map((round, index) => {
      const first = rounds.slice(0, index).reduce((n, round) => n + round.questionIds.length, 0) + 1
      const number = first + round.questionIds.length - 1
      const runtime = runtimeFor(game, state, index)
      const passed = round.questionIds.every((id) => state.history.some((a) => a.questionId === id && a.skipped))
      const status = passed ? 'Passée' : runtime.phase === 'revealed' ? 'Corrigée' : runtime.phase === 'discussion' ? 'Discussion' : runtime.phase === 'cards-up' || runtime.phase === 'selected' ? 'Cartes levées' : state.roundStates?.[round.id] ? 'Réflexion' : 'Non commencée'
      return <li key={round.id}><button type="button" aria-current={index === state.index ? 'step' : undefined} onClick={() => onGo(index)}><b>{first === number ? `Question ${first}` : `Questions ${first} et ${number}`}</b><span>{round.questionIds.map((id) => game.questions.find((q) => q.id === id)?.prompt).join(' · ')}</span><small>{status}{runtime.attempt ? ` · tentative ${runtime.attempt + 1}` : ''}</small></button></li>
    })}</ol>
    <div className="ci-toolbar"><button type="button" disabled={!['discussion', 'revealed'].includes(state.phase) || (state.previousAttempts?.length ?? 0) >= 5000} onClick={onRetry}>Réessayer cette question</button><button type="button" onClick={onClose}>Revenir à la séance</button></div>
  </dialog>
}

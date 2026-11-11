import { useEffect, useRef, useState } from 'react'
import type { Question } from '../domain/types'
import { manualTotal, QUICK_READINGS, validateManualVote, type ManualVote, type QuickReading } from '../domain/votes'
import { PALETTE } from '../domain/palette'

export function ManualCountPanel({ questions, votes, onSave, onClose }: {
  questions: Question[]
  votes: Record<string, ManualVote>
  onSave: (questionId: string, vote: ManualVote | null) => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const question = questions[index]!
  useEffect(() => {
    const previous = document.activeElement
    const element = dialog.current
    element?.showModal()
    return () => { element?.close(); if (previous instanceof HTMLElement && previous.isConnected) previous.focus() }
  }, [])
  return <dialog className="ci-count-dialog" ref={dialog} aria-labelledby="ci-count-title" onCancel={(event) => { event.preventDefault(); onClose() }}>
    <h2 id="ci-count-title">Comptage saisi par l’enseignant</h2>
    <p>Les cartes levées sont comptées à la main. Ce panneau est visible sur cet écran.</p>
    {questions.length > 1 && <label>Question à compter<select value={index} onChange={(event) => setIndex(Number(event.target.value))}>{questions.map((q, i) => <option key={q.id} value={i}>{i + 1}. {q.prompt}</option>)}</select></label>}
    <ManualCountForm key={question.id} question={question} offset={questions.length === 2 ? index * 3 : 0} initial={votes[question.id]} onSave={(vote) => onSave(question.id, vote)} onClose={onClose} />
  </dialog>
}

function ManualCountForm({ question, offset, initial, onSave, onClose }: { question: Question; offset: number; initial?: ManualVote; onSave: (vote: ManualVote | null) => void; onClose: () => void }) {
  const [counts, setCounts] = useState<Record<string, string>>(() => Object.fromEntries(question.choices.map((choice) => [choice.id, String(initial?.counts[choice.id] ?? 0)])))
  const [present, setPresent] = useState(initial?.present === undefined ? '' : String(initial.present))
  const [quick, setQuick] = useState<QuickReading | undefined>(initial?.quick)
  const [shared, setShared] = useState(initial?.shared ?? false)
  const [error, setError] = useState('')
  const total = Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0)
  return <form noValidate onSubmit={(event) => {
    event.preventDefault()
    const result = validateManualVote(question, { counts: Object.fromEntries(Object.entries(counts).map(([id, value]) => [id, value === '' ? 0 : Number(value)])), ...(present === '' ? {} : { present: Number(present) }), ...(quick ? { quick } : {}), shared })
    if (!result.ok) { setError(result.error); return }
    onSave(result.vote)
    onClose()
  }}>
    <div className="ci-vote-fields">
      {PALETTE.map((card, slot) => {
        const choice = question.choices[slot - offset]
        const active = question.mode === 'choice' && !!choice && slot >= offset
        const value = active ? counts[choice.id]! : '0'
        const number = Number(value || 0)
        const change = (next: string) => { if (active) setCounts((previous) => ({ ...previous, [choice.id]: next })) }
        return <fieldset disabled={!active} key={card.letter}>
          <legend>Carte {card.letter}{!active ? ' · inactive' : ''}</legend>
          <div className="ci-vote-stepper">
            <button type="button" aria-label={`Retirer un vote, carte ${card.letter}`} disabled={number <= 0} onClick={() => change(String(number - 1))}>−</button>
            <input type="number" min="0" max="99" step="1" inputMode="numeric" aria-label={`Nombre de votes, carte ${card.letter}`} value={value} onChange={(event) => change(event.target.value)} />
            <button type="button" aria-label={`Ajouter un vote, carte ${card.letter}`} disabled={number >= 99} onClick={() => change(String(number + 1))}>+</button>
          </div>
        </fieldset>
      })}
    </div>
    <div className="ci-count-total"><label>Présents (facultatif)<input type="number" min="0" max="99" step="1" inputMode="numeric" value={present} onChange={(event) => setPresent(event.target.value)} /></label><p role="status">Total saisi : {Number.isFinite(total) ? total : 'à vérifier'}{present !== '' ? ` / ${present}` : ''}</p></div>
    <fieldset className="ci-quick-reading"><legend>Lecture rapide (facultative)</legend>{QUICK_READINGS.map((reading) => <button key={reading.value} type="button" aria-pressed={quick === reading.value} onClick={() => setQuick(quick === reading.value ? undefined : reading.value)}>{reading.label}</button>)}</fieldset>
    <label className="ci-count-share"><input type="checkbox" checked={shared} onChange={(event) => setShared(event.target.checked)} />Montrer à la classe</label>
    {error && <p role="alert">{error}</p>}
    <div className="ci-toolbar"><button type="submit" className="ci-primary">Valider le comptage</button><button type="button" onClick={onClose}>Annuler</button><button type="button" onClick={() => { onSave(null); onClose() }}>Effacer ce comptage</button></div>
  </form>
}

/** No answer key is accepted by the view used before reveal. */
export function ManualVoteView({ question, vote, offset = 0 }: { question: Question; vote: ManualVote; offset?: number }) {
  const total = manualTotal(vote)
  return <div className="ci-manual-vote">
    <b>Comptage saisi par l’enseignant</b>
    {total > 0 && <><p>{question.choices.map((choice, index) => `${PALETTE[offset + index]!.letter} : ${vote.counts[choice.id] ?? 0}`).join(' · ')}</p><p>Total saisi : {total}{vote.present !== undefined ? ` / ${vote.present} présents` : ''}</p></>}
    {vote.quick && <p>Lecture de l’enseignant : {QUICK_READINGS.find((reading) => reading.value === vote.quick)?.label}</p>}
  </div>
}

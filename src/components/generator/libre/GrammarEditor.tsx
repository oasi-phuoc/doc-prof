import { isGrammarSnapshot } from '@/grammaire/curriculum/validation'
import type { GrammarChoice, GrammarQuestion, GrammarSnapshot } from '@/grammaire/curriculum/types'
import { useState, type ChangeEvent, type ReactNode } from 'react'
import { GrammarStructuralFields, type GrammarField } from './GrammarStructuralFields'

type ChangeQuestion = (question: GrammarQuestion, review?: boolean) => GrammarSnapshot
const choiceKey = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ')

function changeChoice(question: GrammarQuestion, changed: GrammarChoice): GrammarQuestion {
  if (question.unit.kind !== 'completion') return question
  const old = question.unit.options.find(({ id }) => id === changed.id)
  if (!old) return question
  const update = (choices: GrammarChoice[]) => choices.map((choice) => choice.id === changed.id ? changed : choice)
  const answers = question.unit.answers.map((answer) => choiceKey(answer) === choiceKey(old.text) ? changed.text : answer)
  return {
    ...question,
    unit: { ...question.unit, options: update(question.unit.options), answers },
    ...(question.options ? { options: update(question.options) } : {}),
  }
}

export type GrammarEditorProps = {
  selection: GrammarSnapshot
  onChange: (selection: GrammarSnapshot) => void
  activityId: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
}

export function GrammarEditor({ selection, onChange, activityId, fields, writeField }: GrammarEditorProps) {
  const [open, setOpen] = useState<string | null | undefined>(undefined)
  const pending = selection.libreCorrectionsPending ?? []
  function field(question: GrammarQuestion, name: string, value: string, candidate: (value: string, change: ChangeQuestion) => GrammarSnapshot,
    options?: { multiline?: boolean; error?: string }): ReactNode {
    const id = `${activityId}:${question.id}:${name}`
    const raw = fields[id]
    function change(replacement: GrammarQuestion, review = false): GrammarSnapshot {
      return {
        ...selection, editedInLibre: true,
        libreCorrectionsPending: review && !pending.includes(question.id) ? [...pending, question.id] : pending,
        questions: selection.questions.map((current) => current.id === question.id ? replacement : current),
      }
    }
    function apply(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      const text = event.target.value
      const next = candidate(text, change)
      if (isGrammarSnapshot(next)) {
        writeField(id, null)
        onChange(next)
      } else {
        writeField(id, text)
      }
    }
    const props = { className: options?.multiline ? 'libre-line-input is-textarea' : 'libre-line-input',
      value: raw ?? value, 'aria-label': name,
      'aria-invalid': raw !== undefined, 'data-applied-value': value, onChange: apply }
    return (
      <label className="libre-field is-line" key={name}>
        <span>{name}</span>
        {options?.multiline ? <textarea {...props} rows={3} /> : <input {...props} type="text" />}
        {raw !== undefined && <span className="libre-field-error" role="alert">
          {options?.error ?? 'La dernière valeur valide reste affichée. Vérifiez le contenu de ce champ.'}
        </span>}
      </label>
    )
  }

  return (
    <div className="quad-libre-block">
      <b>Exercice de grammaire</b>
      <label className="libre-field is-line">
        <span>Consigne de l’activité</span>
        <input className="libre-line-input" value={fields[`${activityId}:instruction`] ?? selection.instruction}
          aria-invalid={fields[`${activityId}:instruction`] !== undefined} data-applied-value={selection.instruction}
          onChange={(event) => {
            const instruction = event.target.value
            writeField(`${activityId}:instruction`, instruction.trim() ? null : instruction)
            if (instruction.trim()) onChange({ ...selection, editedInLibre: true, instruction })
          }} />
        {fields[`${activityId}:instruction`] !== undefined &&
          <span className="libre-field-error" role="alert">Saisissez une consigne.</span>}
      </label>
      <ul className="libre-item-list" aria-label="Questions de grammaire">
        {selection.questions.map((question, index) => {
          const unit = question.unit
          const edit: GrammarField = (name, value, update, options) => field(question, name, value,
            (text, change) => change(update(text), options?.review), options)
          const correct = unit.kind === 'completion'
            ? unit.options.find(({ text }) => unit.answers.some((answer) => choiceKey(text) === choiceKey(answer)))
            : undefined
          return (
            <li key={question.id} className="libre-item-card">
              <details open={open === undefined ? index === 0 : open === question.id}>
                <summary onClick={(event) => {
                  event.preventDefault()
                  setOpen(event.currentTarget.parentElement?.hasAttribute('open') ? null : question.id)
                }}>
                  {index + 1}. {unit.prompt.replace(/\s+/g, ' ').slice(0, 70)}
                  {pending.includes(question.id) && ' · À vérifier'}
                </summary>
              <div className="libre-item-body" role="group" aria-label={`Question ${index + 1}`}>
                {(unit.kind === 'completion' || unit.kind === 'personal-gap') && edit('Phrase avec une lacune (___)', unit.prompt,
                  (prompt) => ({ ...question, unit: { ...unit, prompt } }), { review: true, error: 'La phrase doit contenir exactement une lacune (___).' })}
                {unit.kind === 'completion' && question.presentation === 'choice' && <>
                  {question.options?.map((choice, position) => field(question, `Choix ${position + 1}`, choice.text,
                    (text, change) => change(changeChoice(question, { ...choice, text }))))}
                  <label className="libre-field is-line">
                    <span>Bonne réponse</span>
                    <select className="libre-line-input" value={correct?.id ?? ''} onChange={(event) => {
                      const answer = unit.options.find(({ id }) => id === event.target.value)
                      if (!answer) return
                      const questions = selection.questions.map((current) => current.id === question.id
                        ? { ...question, unit: { ...unit, answers: [answer.text] } } : current)
                      onChange({ ...selection, editedInLibre: true, questions })
                    }}>
                      {question.options?.map(({ id, text }) => <option key={id} value={id}>{text}</option>)}
                    </select>
                  </label>
                </>}
                {unit.kind === 'completion' && question.presentation === 'gap' && correct &&
                  field(question, 'Réponse attendue', correct.text, (text, change) => change(changeChoice(question, { ...correct, text })))}
                {unit.kind === 'personal-gap' && <>
                  {field(question, 'Information', unit.information, (information, change) => change({ ...question, unit: { ...unit, information } }, true))}
                  {field(question, 'Consigne', unit.task, (task, change) => change({ ...question, unit: { ...unit, task } }, true))}
                  {edit('Exemple de réponse', unit.answers[0] ?? '', (answer) =>
                    ({ ...question, unit: { ...unit, answers: [answer, ...unit.answers.slice(1)] } }))}
                </>}
                <GrammarStructuralFields question={question} edit={edit} />
                {field(question, 'Explication du corrigé', unit.explanation, (explanation, change) => change({ ...question, unit: { ...unit, explanation } }))}
                {pending.includes(question.id) && (
                  <div className="libre-unit-actions">
                    <span>Corrigé à vérifier</span>
                    <button type="button" className="button" onClick={() => onChange({ ...selection,
                      libreCorrectionsPending: pending.filter((id) => id !== question.id),
                    })}>Corrigé vérifié</button>
                  </div>
                )}
              </div>
              </details>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

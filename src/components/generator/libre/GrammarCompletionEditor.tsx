import { isGrammarSnapshot } from '@/grammaire/curriculum/validation'
import type { GrammarChoice, GrammarQuestion, GrammarSnapshot } from '@/grammaire/curriculum/types'

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

export type GrammarCompletionEditorProps = {
  selection: GrammarSnapshot
  onChange: (selection: GrammarSnapshot) => void
  activityId: string
  fields: Record<string, string>
  writeField: (id: string, value: string | null) => void
}

export function GrammarCompletionEditor({ selection, onChange, activityId, fields, writeField }: GrammarCompletionEditorProps) {
  const pending = selection.libreCorrectionsPending ?? []
  function field(question: GrammarQuestion, name: string, value: string, candidate: (value: string, change: ChangeQuestion) => GrammarSnapshot) {
    const id = `${activityId}:${question.id}:${name}`
    const raw = fields[id]
    function change(replacement: GrammarQuestion, review = false): GrammarSnapshot {
      return {
        ...selection, editedInLibre: true,
        libreCorrectionsPending: review && !pending.includes(question.id) ? [...pending, question.id] : pending,
        questions: selection.questions.map((current) => current.id === question.id ? replacement : current),
      }
    }
    return (
      <label className="libre-field is-line" key={name}>
        <span>{name}</span>
        <input className="libre-line-input" type="text" value={raw ?? value}
          aria-label={name} aria-invalid={raw !== undefined} data-applied-value={value}
          onChange={(event) => {
            const text = event.target.value
            const next = candidate(text, change)
            if (isGrammarSnapshot(next)) {
              writeField(id, null)
              onChange(next)
            } else {
              writeField(id, text)
            }
          }} />
        {raw !== undefined && <span className="libre-field-error" role="alert">Vérifiez la lacune et les choix. La dernière valeur valide reste affichée.</span>}
      </label>
    )
  }

  return (
    <div className="quad-libre-block">
      <b>Exercice de grammaire</b>
      <ul className="libre-item-list" aria-label="Questions de grammaire">
        {selection.questions.map((question, index) => {
          const unit = question.unit
          const correct = unit.kind === 'completion'
            ? unit.options.find(({ text }) => unit.answers.some((answer) => choiceKey(text) === choiceKey(answer)))
            : undefined
          return (
            <li key={question.id} className="libre-item-card is-libre-row">
              <span className="libre-item-num is-accent">{index + 1}.</span>
              <div className="libre-item-body" role="group" aria-label={`Question ${index + 1}`}>
                {field(question, 'Phrase avec une lacune (___)', unit.prompt, (prompt, change) => change({ ...question, unit: { ...unit, prompt } }, true))}
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
                </>}
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
            </li>
          )
        })}
      </ul>
    </div>
  )
}

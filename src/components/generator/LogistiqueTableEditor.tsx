import { useState } from 'react'
import { isLogistiqueChartPresentation, validLogistiqueExerciseTable, type LogistiqueDocumentQuestion, type LogistiqueExerciseTable } from '@/logistique/tables'

function move<T>(entries: T[], from: number, to: number): T[] {
  const result = [...entries]
  const [entry] = result.splice(from, 1)
  result.splice(to, 0, entry!)
  return result
}

export function LogistiqueTableEditor({ table, onChange }: {
  table: LogistiqueExerciseTable
  onChange: (table: LogistiqueExerciseTable) => void
}) {
  const [draft, setDraft] = useState<{ basis: LogistiqueExerciseTable; value: LogistiqueExerciseTable }>()
  const value = draft?.basis === table ? draft.value : table
  const isDocument = Boolean(value.questions)
  const mixed = value.presentation === 'cas-mixte'
  const process = value.presentation === 'processus-a-completer'
  const chart = isLogistiqueChartPresentation(value.presentation)
  const valid = validLogistiqueExerciseTable(value)

  function update(next: LogistiqueExerciseTable) {
    if (validLogistiqueExerciseTable(next)) {
      setDraft(undefined)
      onChange(next)
    } else {
      setDraft({ basis: table, value: next })
    }
  }

  function moveColumn(column: number, target: number) {
    update({ ...value, headers: move(value.headers, column, target),
      rows: value.rows.map((row) => move(row, column, target)) })
  }

  function removeColumn(column: number) {
    if (value.rows.some((row) => typeof row[column] !== 'string') &&
      !window.confirm('Retirer cette colonne et les réponses qu’elle contient ?')) return
    update({ ...value, headers: value.headers.toSpliced(column, 1),
      rows: value.rows.map((row) => row.toSpliced(column, 1)) })
  }

  return (
    <details className="logistique-table-editor">
      <summary>{process ? 'Modifier le processus' : chart ? 'Modifier le graphique' : 'Modifier le tableau'}</summary>
      {(value.questions || chart) && <label className="libre-field is-line">
        <span>{chart ? 'Titre du graphique' : 'Titre du document'}</span>
        <input className="libre-line-input" value={value.title ?? ''} maxLength={chart ? 90 : undefined}
          onChange={(event) => update({ ...value, title: event.target.value })} />
      </label>}
      {!process && <fieldset>
        <legend>En-têtes</legend>
        {value.headers.map((header, column) => <div key={column}>
          <label className="libre-field is-line">
            <span>Colonne {column + 1}</span>
            <input className="libre-line-input" aria-label={`En-tête de la colonne ${column + 1}`} value={header}
              onChange={(event) => update({ ...value, headers: value.headers.with(column, event.target.value) })} />
          </label>
          {!chart && <div className="libre-unit-actions">
            <button type="button" className="button small secondary" disabled={column === 0}
              aria-label={`Déplacer la colonne ${column + 1} à gauche`}
              onClick={() => moveColumn(column, column - 1)}>À gauche</button>
            <button type="button" className="button small secondary" disabled={column === value.headers.length - 1}
              aria-label={`Déplacer la colonne ${column + 1} à droite`}
              onClick={() => moveColumn(column, column + 1)}>À droite</button>
            <button type="button" className="button small secondary" disabled={value.headers.length <= 2}
              aria-label={`Supprimer la colonne ${column + 1}`} onClick={() => removeColumn(column)}>Supprimer</button>
          </div>}
        </div>)}
        {!chart && <button type="button" className="button small secondary" onClick={() => update({
          ...value,
          headers: [...value.headers, `Colonne ${value.headers.length + 1}`],
          rows: value.rows.map((row) => [...row, '']),
        })}>Ajouter une colonne</button>}
      </fieldset>}
      {value.rows.map((row, index) => (
        <fieldset key={index}>
          <legend>Ligne {index + 1}</legend>
          {row.map((cell, column) => {
            const given = typeof cell === 'string'
            const label = `${given ? 'Donnée' : 'Réponse'} — ${value.headers[column] || `colonne ${column + 1}`}`
            return (
              <div key={column}>
                <label className="libre-field is-line">
                  <span>{label}</span>
                  <input className="libre-line-input" aria-label={`${label}, ligne ${index + 1}`} value={given ? cell : cell.answer}
                    maxLength={process ? column === 0 ? 58 : 120 : chart ? column === 0 ? 24 : 4 : undefined}
                    inputMode={chart && column === 1 ? 'numeric' : undefined}
                    onChange={(event) => {
                      const text = event.target.value
                      update({ ...value, rows: value.rows.with(index, row.with(column, given ? text : { answer: text })) })
                    }} />
                </label>
                {!chart && !value.questions && (!process || column === 1) && <label className="logistique-bank-question">
                  <input type="checkbox" checked={!given}
                    aria-label={`Cellule à compléter, ligne ${index + 1}, colonne ${column + 1}`}
                    onChange={() => update({ ...value,
                      rows: value.rows.with(index, row.with(column, given ? { answer: cell } : cell.answer)) })} />
                  <span>À compléter</span>
                </label>}
              </div>
            )
          })}
          <div className="libre-unit-actions">
            <button type="button" className="button small secondary" disabled={index === 0}
              aria-label={`Monter la ligne ${index + 1}`}
              onClick={() => update({ ...value, rows: move(value.rows, index, index - 1) })}>Monter</button>
            <button type="button" className="button small secondary" disabled={index === value.rows.length - 1}
              aria-label={`Descendre la ligne ${index + 1}`}
              onClick={() => update({ ...value, rows: move(value.rows, index, index + 1) })}>Descendre</button>
            <button type="button" className="button small secondary" disabled={value.rows.length <= (process ? 3 : chart ? 2 : 1)}
              aria-label={`Supprimer la ligne ${index + 1}`} onClick={() => {
                if (row.some((cell) => typeof cell !== 'string') &&
                  !window.confirm('Retirer cette ligne et les réponses qu’elle contient ?')) return
                update({ ...value, rows: value.rows.toSpliced(index, 1) })
              }}>Supprimer</button>
          </div>
        </fieldset>
      ))}
      {(!(process || chart) || value.rows.length < 6) && <button type="button" className="button small secondary" onClick={() => update({
        ...value, rows: [...value.rows, value.headers.map(() => '')],
      })}>Ajouter une ligne</button>}
      {value.questions?.map((question, index, all) => {
        const setQuestion = (next: LogistiqueDocumentQuestion) => update({ ...value, questions: all.with(index, next) })
        return <fieldset key={index}>
        <legend>Sous-question {index + 1}</legend>
        {mixed && <>
          <label className="libre-field is-line">
            <span>Format de la sous-question {index + 1}</span>
            <select className="libre-line-input" value={question.kind ?? 'redaction'} onChange={(event) => {
              const next = event.target.value
              const { prompt, answer, points } = question
              setQuestion(next === 'calcul' ? { prompt, answer, points, kind: 'calcul', calculation: '' }
                : next === 'choix' ? { prompt, answer: '', points, kind: 'choix', options: ['', '', ''] }
                  : { prompt, answer, points })
            }}>
              <option value="redaction">Rédaction</option>
              <option value="choix">QCM</option>
              <option value="calcul">Calcul</option>
            </select>
          </label>
          <label className="libre-field is-line">
            <span>Points de la sous-question {index + 1}</span>
            <input className="libre-line-input" type="number" min={0.5} max={20} step={0.5}
              value={Number.isNaN(question.points) ? '' : question.points ?? 1}
              onChange={(event) => setQuestion({ ...question, points: event.target.valueAsNumber })} />
          </label>
        </>}
        <label className="libre-field is-line">
          <span>Énoncé {index + 1}</span>
          <textarea className="libre-line-input is-textarea" rows={2} value={question.prompt}
            onChange={(event) => setQuestion({ ...question, prompt: event.target.value })} />
        </label>
        {question.kind === 'choix' && question.options.map((option, position) => <label key={position} className="libre-field is-line">
          <span>Choix {String.fromCharCode(65 + position)} de la sous-question {index + 1}</span>
          <input className="libre-line-input" value={option} onChange={(event) => {
            const text = event.target.value
            setQuestion({ ...question, options: question.options.with(position, text),
              answer: option && option === question.answer ? text : question.answer })
          }} />
        </label>)}
        {question.kind === 'calcul' && <label className="libre-field is-line">
          <span>Calcul du corrigé de la sous-question {index + 1}</span>
          <textarea className="libre-line-input is-textarea" rows={2} value={question.calculation}
            onChange={(event) => setQuestion({ ...question, calculation: event.target.value })} />
        </label>}
        <label className="libre-field is-line">
          <span>Réponse {index + 1}</span>
          {question.kind === 'choix' ? <select className="libre-line-input" value={question.answer}
            onChange={(event) => setQuestion({ ...question, answer: event.target.value })}>
            <option value="">Sélectionner la bonne réponse</option>
            {[...new Set(question.options.filter(Boolean))].map((option) => <option value={option} key={option}>{option}</option>)}
          </select> : <textarea className="libre-line-input is-textarea" rows={2} value={question.answer}
            onChange={(event) => setQuestion({ ...question, answer: event.target.value })} />}
        </label>
        {all.length > 3 && <button type="button" className="button small secondary"
          aria-label={`Retirer la sous-question ${index + 1}`}
          onClick={() => update({ ...value, questions: all.toSpliced(index, 1) })}>Retirer cette sous-question</button>}
      </fieldset>
      })}
      {value.questions && value.questions.length < 8 && <button type="button" className="button small secondary"
        onClick={() => update({ ...value, questions: [...value.questions!, { prompt: '', answer: '', ...(mixed ? { points: 1 } : {}) }] })}>Ajouter une sous-question</button>}
      {!valid && <small role="status" className="access-error">{chart
        ? 'Indiquez un titre, des catégories distinctes et des valeurs entières de 0 à 9 999. La fiche conserve le dernier graphique valide.'
        : process
        ? 'Renseignez chaque étape et laissez au moins une action à compléter. La fiche conserve le dernier processus valide.'
        : isDocument
        ? 'Renseignez le titre, les en-têtes, les sous-questions et leurs réponses. La fiche conserve le dernier document valide.'
        : 'Remplissez les en-têtes et les réponses. La fiche conserve le dernier tableau valide.'}</small>}
    </details>
  )
}

import { useState } from 'react'
import { validLogistiqueExerciseTable, type LogistiqueExerciseTable } from '@/logistique/tables'

export function LogistiqueTableEditor({ table, onChange }: {
  table: LogistiqueExerciseTable
  onChange: (table: LogistiqueExerciseTable) => void
}) {
  const [draft, setDraft] = useState<{ basis: LogistiqueExerciseTable; value: LogistiqueExerciseTable }>()
  const value = draft?.basis === table ? draft.value : table
  const valid = validLogistiqueExerciseTable(value)

  function update(next: LogistiqueExerciseTable) {
    if (validLogistiqueExerciseTable(next)) {
      setDraft(undefined)
      onChange(next)
    } else {
      setDraft({ basis: table, value: next })
    }
  }

  return (
    <details className="logistique-table-editor">
      <summary>Modifier le tableau</summary>
      <fieldset>
        <legend>En-têtes</legend>
        {value.headers.map((header, column) => (
          <label key={column} className="libre-field is-line">
            <span>Colonne {column + 1}</span>
            <input className="libre-line-input" aria-label={`En-tête de la colonne ${column + 1}`} value={header}
              onChange={(event) => update({ ...value, headers: value.headers.with(column, event.target.value) })} />
          </label>
        ))}
      </fieldset>
      {value.rows.map((row, index) => (
        <fieldset key={index}>
          <legend>Ligne {index + 1}</legend>
          {row.map((cell, column) => {
            const given = typeof cell === 'string'
            const label = `${given ? 'Donnée' : 'Réponse'} — ${value.headers[column] || `colonne ${column + 1}`}`
            return (
              <label key={column} className="libre-field is-line">
                <span>{label}</span>
                <input className="libre-line-input" aria-label={`${label}, ligne ${index + 1}`} value={given ? cell : cell.answer}
                  onChange={(event) => {
                    const text = event.target.value
                    update({ ...value, rows: value.rows.with(index, row.with(column, given ? text : { answer: text })) })
                  }} />
              </label>
            )
          })}
        </fieldset>
      ))}
      {!valid && <small role="status" className="access-error">Remplissez les en-têtes et les réponses. La fiche conserve le dernier tableau valide.</small>}
    </details>
  )
}

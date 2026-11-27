import { useState } from 'react'
import { validLogistiqueExerciseTable, type LogistiqueExerciseTable } from '@/logistique/tables'

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
      <summary>Modifier le tableau</summary>
      <fieldset>
        <legend>En-têtes</legend>
        {value.headers.map((header, column) => <div key={column}>
          <label className="libre-field is-line">
            <span>Colonne {column + 1}</span>
            <input className="libre-line-input" aria-label={`En-tête de la colonne ${column + 1}`} value={header}
              onChange={(event) => update({ ...value, headers: value.headers.with(column, event.target.value) })} />
          </label>
          <div className="libre-unit-actions">
            <button type="button" className="button small secondary" disabled={column === 0}
              aria-label={`Déplacer la colonne ${column + 1} à gauche`}
              onClick={() => moveColumn(column, column - 1)}>À gauche</button>
            <button type="button" className="button small secondary" disabled={column === value.headers.length - 1}
              aria-label={`Déplacer la colonne ${column + 1} à droite`}
              onClick={() => moveColumn(column, column + 1)}>À droite</button>
            <button type="button" className="button small secondary" disabled={value.headers.length <= 2}
              aria-label={`Supprimer la colonne ${column + 1}`} onClick={() => removeColumn(column)}>Supprimer</button>
          </div>
        </div>)}
        <button type="button" className="button small secondary" onClick={() => update({
          ...value,
          headers: [...value.headers, `Colonne ${value.headers.length + 1}`],
          rows: value.rows.map((row) => [...row, '']),
        })}>Ajouter une colonne</button>
      </fieldset>
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
                    onChange={(event) => {
                      const text = event.target.value
                      update({ ...value, rows: value.rows.with(index, row.with(column, given ? text : { answer: text })) })
                    }} />
                </label>
                <label className="logistique-bank-question">
                  <input type="checkbox" checked={!given}
                    aria-label={`Cellule à compléter, ligne ${index + 1}, colonne ${column + 1}`}
                    onChange={() => update({ ...value,
                      rows: value.rows.with(index, row.with(column, given ? { answer: cell } : cell.answer)) })} />
                  <span>À compléter</span>
                </label>
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
            <button type="button" className="button small secondary" disabled={value.rows.length === 1}
              aria-label={`Supprimer la ligne ${index + 1}`} onClick={() => {
                if (row.some((cell) => typeof cell !== 'string') &&
                  !window.confirm('Retirer cette ligne et les réponses qu’elle contient ?')) return
                update({ ...value, rows: value.rows.toSpliced(index, 1) })
              }}>Supprimer</button>
          </div>
        </fieldset>
      ))}
      <button type="button" className="button small secondary" onClick={() => update({
        ...value, rows: [...value.rows, value.headers.map(() => '')],
      })}>Ajouter une ligne</button>
      {!valid && <small role="status" className="access-error">Remplissez les en-têtes et les réponses. La fiche conserve le dernier tableau valide.</small>}
    </details>
  )
}

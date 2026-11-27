import type { LogistiqueExerciseTable } from '@/logistique/tables'
import type { PreviewMode } from '@/math/types'

export function LogistiqueTableView({ table, mode }: { table: LogistiqueExerciseTable; mode: PreviewMode }) {
  const corrected = mode === 'answers'
  return (
    <table className="theory-table has-col-head logistique-exercise-table">
      <thead>
        <tr>{table.headers.map((header, col) => <th key={col} scope="col">{header}</th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, col) => (
              <td key={col} className={typeof cell !== 'string' ? 'logistique-table-answer' : undefined}>
                {typeof cell === 'string' ? cell
                  : corrected ? <strong className="filled-answer">{cell.answer}</strong>
                    : <span className="logistique-table-blank" aria-label="Case à compléter">{'\u00a0'}</span>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

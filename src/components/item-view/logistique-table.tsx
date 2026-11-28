import type { LogistiqueExerciseTable, LogistiqueTableCell } from '@/logistique/tables'
import type { PreviewMode } from '@/math/types'

export function LogistiqueTableView({ table, mode, offset = 0 }: { table: LogistiqueExerciseTable; mode: PreviewMode; offset?: number }) {
  const corrected = mode === 'answers'
  const renderCell = (cell: LogistiqueTableCell) => typeof cell === 'string' ? cell
    : corrected ? <strong className="filled-answer">{cell.answer}</strong>
      : <span className="logistique-table-blank" aria-label="Case à compléter">{'\u00a0'}</span>
  if (table.presentation === 'processus-a-completer') {
    return <ol className="logistique-process-flow" aria-label={offset ? 'Suite du processus' : 'Processus à compléter'} start={offset + 1}>
      {table.rows.map(([label, action], index) => <li key={index}>
        <strong>{offset + index + 1}. {renderCell(label!)}</strong>
        <span className="logistique-process-action">{renderCell(action!)}</span>
      </li>)}
    </ol>
  }
  const chronology = table.presentation === 'frise-chronologique'
  return (
    <table className={`theory-table has-col-head logistique-exercise-table${chronology ? ' logistique-timeline' : ''}`}>
      {table.title && <caption>{table.title}</caption>}
      <thead>
        <tr>{table.headers.map((header, col) => <th key={col} scope="col">{header}</th>)}</tr>
      </thead>
      <tbody>
        {table.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, col) => (
              <td key={col} className={typeof cell !== 'string' ? 'logistique-table-answer' : undefined}>
                {renderCell(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

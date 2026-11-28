import type { LogistiqueExerciseTable, LogistiqueTableCell } from '@/logistique/tables'
import type { PreviewMode } from '@/math/types'
import { LogistiqueBarChart } from './logistique-chart'

export function LogistiqueTableView({ table, mode, offset = 0 }: { table: LogistiqueExerciseTable; mode: PreviewMode; offset?: number }) {
  const corrected = mode === 'answers'
  if (table.presentation === 'lire-graphique') return <LogistiqueBarChart table={table} mode={mode} />
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
  if (table.presentation === 'completer-graphique') return <>
    <table className="theory-table has-col-head logistique-exercise-table">
      <thead><tr>
        <th scope="col">{table.headers[0]}</th>
        {table.rows.map(([label]) => <th key={String(label)} scope="col">{String(label)}</th>)}
      </tr></thead>
      <tbody><tr>
        <th scope="row">{table.headers[1]}</th>
        {table.rows.map(([label, value]) => <td key={String(label)}>{String(value)}</td>)}
      </tr></tbody>
    </table>
    <LogistiqueBarChart table={table} mode={mode} />
  </>
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

export type LogistiqueTablePresentation =
  | 'tableau-donnees' | 'tableau-dates' | 'tableau-comparaison' | 'tableau-classement' | 'tableau-ordre'
export type LogistiqueTableCell = string | { answer: string }

export type LogistiqueExerciseTable = {
  presentation: LogistiqueTablePresentation
  headers: string[]
  rows: LogistiqueTableCell[][]
}

export function isLogistiqueTablePresentation(value: unknown): value is LogistiqueTablePresentation {
  return value === 'tableau-donnees' || value === 'tableau-dates' ||
    value === 'tableau-comparaison' || value === 'tableau-classement' || value === 'tableau-ordre'
}

function isLogistiqueTableCell(value: unknown): value is LogistiqueTableCell {
  return typeof value === 'string' || Boolean(value && typeof value === 'object' &&
    'answer' in value && typeof value.answer === 'string' && value.answer.trim())
}

export function validLogistiqueExerciseTable(value: unknown): value is LogistiqueExerciseTable {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const { presentation, headers, rows } = value as Partial<LogistiqueExerciseTable>
  if (!isLogistiqueTablePresentation(presentation) ||
      !Array.isArray(headers) || headers.length < 2 || !headers.every((entry) => typeof entry === 'string' && entry.trim()) ||
      !Array.isArray(rows) || !rows.length ||
      !rows.every((row) => Array.isArray(row) && row.length === headers.length && row.every(isLogistiqueTableCell))) {
    return false
  }
  return rows.some((row) => row.some((cell) => typeof cell !== 'string'))
}

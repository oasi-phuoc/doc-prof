export type LogistiqueTablePresentation =
  | 'tableau-donnees' | 'tableau-dates' | 'tableau-comparaison' | 'tableau-classement' | 'tableau-ordre'
  | 'lire-document' | 'corriger-erreurs'
export type LogistiqueTableCell = string | { answer: string }
export type LogistiqueDocumentQuestion = { prompt: string; answer: string }

export type LogistiqueExerciseTable = {
  presentation: LogistiqueTablePresentation
  headers: string[]
  rows: LogistiqueTableCell[][]
  title?: string
  questions?: LogistiqueDocumentQuestion[]
}

export function isLogistiqueTablePresentation(value: unknown): value is LogistiqueTablePresentation {
  return value === 'tableau-donnees' || value === 'tableau-dates' ||
    value === 'tableau-comparaison' || value === 'tableau-classement' || value === 'tableau-ordre' || isLogistiqueDocumentPresentation(value)
}

export function isLogistiqueDocumentPresentation(value: unknown): value is 'lire-document' | 'corriger-erreurs' {
  return value === 'lire-document' || value === 'corriger-erreurs'
}

function isLogistiqueTableCell(value: unknown): value is LogistiqueTableCell {
  return typeof value === 'string' || Boolean(value && typeof value === 'object' &&
    'answer' in value && typeof value.answer === 'string' && value.answer.trim())
}

export function validLogistiqueExerciseTable(value: unknown): value is LogistiqueExerciseTable {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const { presentation, headers, rows, title, questions } = value as Partial<LogistiqueExerciseTable>
  if (!isLogistiqueTablePresentation(presentation) ||
      !Array.isArray(headers) || headers.length < 2 || !headers.every((entry) => typeof entry === 'string' && entry.trim()) ||
      !Array.isArray(rows) || !rows.length ||
      !rows.every((row) => Array.isArray(row) && row.length === headers.length && row.every(isLogistiqueTableCell))) {
    return false
  }
  if (isLogistiqueDocumentPresentation(presentation)) {
    return typeof title === 'string' && Boolean(title.trim()) && rows.every((row) => row.every((cell) => typeof cell === 'string')) &&
      Array.isArray(questions) && questions.length >= 3 && questions.length <= 8 && questions.every((question) =>
        question && typeof question.prompt === 'string' && Boolean(question.prompt.trim()) &&
        typeof question.answer === 'string' && Boolean(question.answer.trim()))
  }
  return title === undefined && questions === undefined && rows.some((row) => row.some((cell) => typeof cell !== 'string'))
}

export type LogistiqueTablePresentation =
  | 'tableau-donnees' | 'tableau-dates' | 'tableau-comparaison' | 'tableau-classement' | 'tableau-ordre'
  | 'lire-document' | 'corriger-erreurs' | 'justifier-decision' | 'frise-chronologique' | 'cas-mixte' | 'processus-a-completer'
export type LogistiqueTableCell = string | { answer: string }
export type LogistiqueDocumentQuestion = { prompt: string; answer: string; points?: number } & (
  | { kind?: 'redaction' }
  | { kind: 'choix'; options: string[] }
  | { kind: 'calcul'; calculation: string }
)

export type LogistiqueExerciseTable = {
  presentation: LogistiqueTablePresentation
  headers: string[]
  rows: LogistiqueTableCell[][]
  title?: string
  questions?: LogistiqueDocumentQuestion[]
}

export function isLogistiqueTablePresentation(value: unknown): value is LogistiqueTablePresentation {
  return value === 'tableau-donnees' || value === 'tableau-dates' ||
    value === 'tableau-comparaison' || value === 'tableau-classement' || value === 'tableau-ordre' ||
    value === 'frise-chronologique' || value === 'processus-a-completer' || isLogistiqueDocumentPresentation(value)
}

export function isLogistiqueDocumentPresentation(value: unknown): value is 'lire-document' | 'corriger-erreurs' | 'justifier-decision' | 'cas-mixte' {
  return value === 'lire-document' || value === 'corriger-erreurs' || value === 'justifier-decision' || value === 'cas-mixte'
}

export function logistiqueCasePoints(table?: LogistiqueExerciseTable): number | undefined {
  return table?.presentation === 'cas-mixte' ? table.questions?.reduce((total, question) => total + (question.points ?? 0), 0) : undefined
}

function isLogistiqueDocumentQuestion(value: unknown, mixed: boolean): value is LogistiqueDocumentQuestion {
  if (!value || typeof value !== 'object') return false
  const question = value as LogistiqueDocumentQuestion
  if (typeof question.prompt !== 'string' || !question.prompt.trim() || typeof question.answer !== 'string' || !question.answer.trim()) return false
  if (!mixed) return question.kind === undefined && question.points === undefined
  if (typeof question.points !== 'number' || question.points < 0.5 || question.points > 20 || !Number.isInteger(question.points * 2)) return false
  if (question.kind === 'choix') {
    return Array.isArray(question.options) && question.options.length >= 2 && question.options.length <= 4 &&
      question.options.every((option) => typeof option === 'string' && Boolean(option.trim())) &&
      new Set(question.options.map((option) => option.trim())).size === question.options.length && question.options.includes(question.answer)
  }
  if (question.kind === 'calcul') return typeof question.calculation === 'string' && Boolean(question.calculation.trim())
  return question.kind === undefined || question.kind === 'redaction'
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
    const mixed = presentation === 'cas-mixte'
    return typeof title === 'string' && Boolean(title.trim()) && rows.every((row) => row.every((cell) => typeof cell === 'string')) &&
      Array.isArray(questions) && questions.length >= 3 && questions.length <= 8 && questions.every((question) =>
        isLogistiqueDocumentQuestion(question, mixed)) &&
      (!mixed || new Set(questions.map(({ kind }) => kind ?? 'redaction')).size >= 2)
  }
  if (presentation === 'processus-a-completer') {
    return title === undefined && questions === undefined && headers.length === 2 && rows.length >= 3 && rows.length <= 6 &&
      rows.every(([label, action]) => {
        const text = typeof action === 'string' ? action : action?.answer
        return typeof label === 'string' && Boolean(label.trim()) && label.length <= 58 &&
          typeof text === 'string' && Boolean(text.trim()) && text.length <= 120
      }) &&
      rows.some(([, action]) => typeof action !== 'string')
  }
  return title === undefined && questions === undefined && rows.some((row) => row.some((cell) => typeof cell !== 'string'))
}

import type { ExerciseBlock, MathItem } from '@/math/types'

export type LogistiqueWordingMode = 'normal' | 'falc'
export type LogistiqueWording = Readonly<Record<LogistiqueWordingMode, string>>

export function logistiqueWordingMode(block: Pick<ExerciseBlock, 'logistiqueWordingMode'>, diploma: 'CFC' | 'AFP'): LogistiqueWordingMode {
  return block.logistiqueWordingMode ?? (diploma === 'AFP' ? 'falc' : 'normal')
}

export function validLogistiqueWording(value: unknown): value is LogistiqueWording {
  if (!value || typeof value !== 'object' || Array.isArray(value) || !('normal' in value) || !('falc' in value)) return false
  return [value.normal, value.falc].every((text) => typeof text === 'string' && text.trim() && text.length <= 2_000)
}

export function applyLogistiqueWording(item: MathItem, mode: LogistiqueWordingMode): MathItem {
  const choose = (current: string | undefined, wording?: LogistiqueWording) =>
    wording && (current === wording.normal || current === wording.falc) ? wording[mode] : current
  const prompt = choose(item.prompt, item.logistiqueWording)
  const table = item.logistiqueTable
  const questions = table?.questions?.map((question) => {
    const text = choose(question.prompt, question.wording)
    return text && text !== question.prompt ? { ...question, prompt: text } : question
  })
  const changedQuestions = questions?.some((question, index) => question !== table!.questions![index])
  if (prompt === item.prompt && !changedQuestions) return item
  return { ...item, prompt, ...(changedQuestions && table ? { logistiqueTable: { ...table, questions } } : {}) }
}

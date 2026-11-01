import type { TcfExercise, TcfQuestion } from './types'

/** Empreinte stable pour reconnaître une question de banque dans l’édition libre. */
export function tcfQuestionKey(q: TcfQuestion): string {
  return `${q.type_reponse}|${q.enonce.trim()}`
}

/**
 * Limite le nombre de questions CE (ordre de la banque).
 * Sans effet si `count` est absent ou ≥ au total.
 */
export function limitTcfCeQuestions(
  ex: TcfExercise,
  count: number | undefined,
): TcfExercise {
  if (ex.competence !== 'CE') return ex
  if (count == null || !Number.isFinite(count)) return ex
  const n = Math.max(1, Math.min(Math.round(count), ex.questions.length))
  if (n >= ex.questions.length) return ex
  return { ...ex, questions: ex.questions.slice(0, n) }
}

/** Questions de `exercise` qui ne viennent pas de la banque. */
export function tcfFreeQuestions(
  exercise: TcfExercise,
  bank: TcfExercise | undefined,
): TcfQuestion[] {
  if (!bank || bank.competence !== 'CE') return exercise.questions
  const bankKeys = new Set(bank.questions.map(tcfQuestionKey))
  return exercise.questions.filter((q) => !bankKeys.has(tcfQuestionKey(q)))
}

/** Questions de banque présentes dans l’exercice courant (ordre banque). */
export function tcfSelectedBankQuestions(
  exercise: TcfExercise,
  bank: TcfExercise,
): TcfQuestion[] {
  const selected = new Set(exercise.questions.map(tcfQuestionKey))
  return bank.questions.filter((q) => selected.has(tcfQuestionKey(q)))
}

/**
 * Active ou désactive une question de banque ; conserve les questions libres à la fin.
 */
export function toggleTcfBankQuestion(
  exercise: TcfExercise,
  bank: TcfExercise,
  bankQuestion: TcfQuestion,
  enable: boolean,
): TcfQuestion[] {
  const key = tcfQuestionKey(bankQuestion)
  const free = tcfFreeQuestions(exercise, bank)
  const selectedKeys = new Set(
    tcfSelectedBankQuestions(exercise, bank).map(tcfQuestionKey),
  )
  if (enable) selectedKeys.add(key)
  else selectedKeys.delete(key)
  const selected = bank.questions.filter((q) => selectedKeys.has(tcfQuestionKey(q)))
  return [...selected, ...free]
}

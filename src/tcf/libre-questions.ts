import { tcfQuestionKey } from './ce-questions'
import { TCF_QCM_MAX, TCF_QCM_MIN } from './templates'
import type { TcfExercise, TcfQuestion } from './types'

export function identifyTcfQuestions(exercise: TcfExercise, source?: TcfExercise): TcfExercise {
  const sourceKeys = new Set(source?.questions.map(tcfQuestionKey))
  const used = new Set(exercise.questions.flatMap(({ libreId }) => libreId ? [libreId] : []))
  const questions = exercise.questions.map((question, index) => {
    if (question.libreId) return question
    let libreId = `question-${index + 1}`
    while (used.has(libreId)) libreId += '-b'
    used.add(libreId)
    const key = tcfQuestionKey(question)
    return { ...question, libreId, ...(sourceKeys.has(key) ? { libreSourceKey: key } : {}) }
  })
  return { ...exercise, questions }
}

function hasQuestionContent(question: TcfQuestion): boolean {
  if (!question.enonce.trim()) return false
  if (question.type_reponse === 'lignes') return true
  return question.choix.length >= TCF_QCM_MIN && question.choix.length <= TCF_QCM_MAX &&
    question.choix.every((choice) => ('texte' in choice ? choice.texte : choice.image).trim().length > 0)
}

export function isTcfCorrectionComplete(question: TcfQuestion): boolean {
  if (!hasQuestionContent(question)) return false
  if (question.type_reponse === 'lignes') {
    if (question.tableau?.length) return question.tableau.every(({ label, reponse }) => label.trim() && reponse.trim())
    return Boolean(question.reponse_modele?.trim())
  }
  return question.choix.filter(({ correct }) => correct).length === 1
}

function questionPrompt(question: TcfQuestion) {
  return [
    question.enonce, question.image, question.images, question.type_reponse,
    question.type_reponse === 'lignes' ? question.tableau?.map(({ label }) => label)
      : question.choix.map((choice) => [choice.id, 'texte' in choice ? choice.texte : choice.image]),
  ]
}

export function editTcfQuestion(previous: TcfQuestion, next: TcfQuestion): TcfQuestion {
  const promptChanged = JSON.stringify(questionPrompt(previous)) !== JSON.stringify(questionPrompt(next))
  const checkCorrection = promptChanged || !isTcfCorrectionComplete(next)
  return { ...next, correctionARevoir: checkCorrection || previous.correctionARevoir || undefined }
}

export function checkTcfSupport(previous: TcfExercise, next: TcfExercise): TcfExercise {
  if (previous.id !== next.id || previous.type_exercice !== next.type_exercice || previous.support === next.support) return next
  const oldQuestions = new Set(previous.questions.map(({ libreId }) => libreId))
  const changedTracks = previous.type_exercice === 'six_courts' && next.type_exercice === 'six_courts'
    ? new Set(next.support.audios.flatMap((src, index) => src === previous.support.audios[index] ? [] : [index + 1]))
    : null
  return {
    ...next,
    questions: next.questions.map((question) =>
      oldQuestions.has(question.libreId) && (!changedTracks || changedTracks.has(question.audio ?? 1))
        ? { ...question, correctionARevoir: true }
        : question),
  }
}

export function hasTcfCorrectionsToReview(exercise: TcfExercise | undefined): boolean {
  return Boolean(exercise?.questions?.some((question) =>
    question.correctionARevoir || (question.libreId && !isTcfCorrectionComplete(question)),
  ))
}

export function hasTcfLockedQuestions(exercise: TcfExercise | undefined): boolean {
  return Boolean(exercise?.questions?.some(({ libreLocked }) => libreLocked))
}

export function isTcfSubjectIncomplete(exercise: TcfExercise | undefined): boolean {
  if (!exercise?.questions?.some(({ libreId }) => libreId)) return false
  if (exercise.questions.some((question) => !hasQuestionContent(question))) return true
  if (exercise.type_exercice === 'six_courts') {
    return exercise.support.audios.some((audio) => !audio.trim())
  }
  return exercise.competence === 'CE' && !exercise.support.texte.trim()
}

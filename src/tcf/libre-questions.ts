import { tcfQuestionKey } from './ce-questions'
import { TCF_QCM_MAX, TCF_QCM_MIN } from './templates'
import type { TcfExercise, TcfQuestion } from './types'
import { validateTcfExercise } from './validate'

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
    question.enonce, question.image, question.images, question.type_reponse, question.audio,
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
  if (next.competence === 'PE') return { ...next, libreSupportEdited: true, libreSupportReview: true }
  const oldQuestions = new Map(previous.questions.map((question) => [question.libreId, question]))
  const tracksBefore = 'audios' in previous.support ? previous.support.audios : null
  const tracksAfter = 'audios' in next.support ? next.support.audios : null
  return {
    ...next,
    questions: next.questions.map((question) => {
      const old = oldQuestions.get(question.libreId)
      if (!old) return question
      const priorTrack = (old.audio ?? 1) - 1
      const track = (question.audio ?? 1) - 1
      if (tracksBefore && tracksAfter && tracksBefore[priorTrack] === tracksAfter[track]) {
        if (previous.type_exercice !== 'complet' || next.type_exercice !== 'complet' ||
          (previous.support.images?.[priorTrack] ?? previous.support.image) ===
          (next.support.images?.[track] ?? next.support.image)) return question
      }
      return { ...question, correctionARevoir: true }
    }),
  }
}

export function hasTcfCorrectionsToReview(exercise: TcfExercise | undefined): boolean {
  return Boolean(exercise?.libreSupportReview || exercise?.questions?.some((question) =>
    question.correctionARevoir || (question.libreId && !isTcfCorrectionComplete(question)),
  ))
}

export function hasTcfLockedQuestions(exercise: TcfExercise | undefined): boolean {
  return Boolean(exercise?.questions?.some(({ libreLocked }) => libreLocked))
}

export function isTcfSubjectIncomplete(exercise: TcfExercise | undefined): boolean {
  if (exercise?.libreSupportEdited && exercise.competence === 'PE') return validateTcfExercise(exercise).errors.length > 0
  if (!exercise?.questions?.some(({ libreId }) => libreId)) return false
  if (exercise.questions.some((question) => !hasQuestionContent(question))) return true
  if (exercise.type_exercice === 'six_courts' || exercise.type_exercice === 'trois_moyens') {
    return exercise.questions.some((question) => !exercise.support.audios[(question.audio ?? 1) - 1]?.trim())
  }
  if (exercise.type_exercice === 'complet') {
    const tracks = exercise.support.audios?.length ? exercise.support.audios : [exercise.support.audio]
    return exercise.questions.some((question) => !tracks[(question.audio ?? 1) - 1]?.trim())
  }
  if (exercise.type_exercice === 'images_a_reconnaitre') return !exercise.support.audio?.trim()
  return exercise.competence === 'CE' && !exercise.support.texte.trim()
}

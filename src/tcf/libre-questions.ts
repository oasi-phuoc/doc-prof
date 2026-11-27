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

export function usesTcfStructuredCorrection(exercise: TcfExercise): boolean {
  return exercise.competence === 'PE' || exercise.competence === 'PO' ||
    exercise.type_exercice === 'association_images' || exercise.type_exercice === 'images_a_reconnaitre'
}

export function isTcfStructuredCorrectionComplete(exercise: TcfExercise): boolean {
  if (exercise.type_exercice === 'association_images') {
    const assigned = exercise.situations.flatMap(({ dialogue }) => dialogue == null ? [] : [dialogue])
    return assigned.length === exercise.support.nb_dialogues && new Set(assigned).size === assigned.length &&
      assigned.every((value) => Number.isInteger(value) && value >= 1 && value <= exercise.support.nb_dialogues)
  }
  if (exercise.type_exercice === 'images_a_reconnaitre') return exercise.images.some(({ correct }) => correct)
  if (exercise.type_exercice === 'formulaire') return exercise.support.champs.every(({ corrige }) => corrige?.trim())
  return true
}

export function checkTcfSupport(previous: TcfExercise, next: TcfExercise): TcfExercise {
  if (previous.id !== next.id || previous.type_exercice !== next.type_exercice) return next
  const supportChanged = previous.support !== next.support
  const associationChanged = previous.type_exercice === 'association_images' && next.type_exercice === 'association_images' &&
    previous.situations !== next.situations
  const imagesChanged = previous.type_exercice === 'images_a_reconnaitre' && next.type_exercice === 'images_a_reconnaitre' &&
    previous.images !== next.images
  if (usesTcfStructuredCorrection(next) &&
    (supportChanged || associationChanged || imagesChanged || previous.consigne !== next.consigne ||
      previous.consigne_supplementaire !== next.consigne_supplementaire)) {
    return { ...next, libreSupportEdited: true, libreSupportReview: true }
  }
  if (!supportChanged) return next
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
  return Boolean(exercise?.libreSupportReview || (exercise?.libreSupportEdited && !isTcfStructuredCorrectionComplete(exercise)) ||
    exercise?.questions?.some((question) =>
    question.correctionARevoir || (question.libreId && !isTcfCorrectionComplete(question)),
  ))
}

export function hasTcfLockedQuestions(exercise: TcfExercise | undefined): boolean {
  return Boolean(exercise?.questions?.some(({ libreLocked }) => libreLocked))
}

export function isTcfSubjectIncomplete(exercise: TcfExercise | undefined): boolean {
  if (exercise?.libreSupportEdited && exercise.type_exercice === 'association_images') {
    const sounds = exercise.support.audios?.length ? exercise.support.audios : [exercise.support.audio]
    return exercise.situations.length < 2 || exercise.situations.some(({ image }) => !image.trim()) ||
      sounds.some((audio) => !audio?.trim()) || (sounds.length > 1 && sounds.length !== exercise.support.nb_dialogues)
  }
  if (exercise?.libreSupportEdited && usesTcfStructuredCorrection(exercise)) return validateTcfExercise(exercise).errors.length > 0
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

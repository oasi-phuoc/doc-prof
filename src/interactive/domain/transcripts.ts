import { tcfAudioSrc } from '@/tcf/media'
import { audioIdentity } from './audio'
import { questionsForRound } from './plan'
import type { Game, Question, Session } from './types'

const recordingOf = (question: Question) => audioIdentity({ audio: question.audio ? tcfAudioSrc(question.audio) : undefined, audioParts: question.audioParts?.map(tcfAudioSrc) })

/** Copy only the bank text explicitly assigned to the recording being played.
 * Keep empty track positions; a common text cannot be split by guessing. */
export function sourceTranscript(support: Record<string, unknown>, audio?: string, parts?: string[]): string | undefined {
  if (!audio || parts && parts.length > 1) return undefined
  const refs = Array.isArray(support.audios) && support.audios.length
    ? support.audios
    : typeof support.audio === 'string' ? [support.audio] : []
  const matches = refs.flatMap((ref, index) => typeof ref === 'string' && ref.trim() && tcfAudioSrc(ref) === tcfAudioSrc(audio) ? [index] : [])
  if (!matches.length) return undefined
  const texts = matches.map(index => Array.isArray(support.transcription)
    ? support.transcription[index]
    : refs.length === 1 ? support.transcription : undefined)
  if (texts.some(text => typeof text !== 'string' || !text.trim())) return undefined
  const unique = new Set((texts as string[]).map(text => text.trim()))
  return unique.size === 1 ? [...unique][0] : undefined
}

/** A transcript may answer the next question about the same recording. Review
 * opens only after every question retained in this plan has been corrected. */
export function reviewTranscript(game: Game, state: Session): string | undefined {
  if (state.finished || state.phase !== 'revealed') return undefined
  const current = questionsForRound(game, state.index)
  const recording = current[0] && recordingOf(current[0])
  if (!recording || current.some(question => recordingOf(question) !== recording)) return undefined
  const related = game.questions.filter(question => recordingOf(question) === recording)
  if (related.some(question => !state.history.some(attempt => attempt.questionId === question.id && !attempt.skipped))) return undefined
  const texts = new Set(related.flatMap(question => {
    const text = game.corrections[question.id]?.transcript?.trim()
    return text ? [text] : []
  }))
  // Conflicting bank versions for a recording are not reconciled automatically.
  return texts.size === 1 ? [...texts][0] : undefined
}

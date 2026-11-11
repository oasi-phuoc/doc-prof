import type { Question } from './types'

export const MAX_AUDIO_PARTS = 12

/** A shared prefix never makes two spoken numbers the same recording. */
export function audioIdentity(question: Pick<Question, 'audio' | 'audioParts'>): string | undefined {
  if (!question.audio) return undefined
  return question.audioParts && question.audioParts.length > 1 ? JSON.stringify(question.audioParts) : question.audio
}

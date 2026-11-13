import type { Figure, FigureDims } from '@/math/types'
import type { ManualVote } from './votes'
import type { GrammarImageSupport } from '@/grammaire/curriculum/types'

export type PlayMode = 'class' | 'solo'
export type ChoiceOrderPolicy = 'shuffle' | 'fixed' | 'ascending' | 'pin-last'
export type Compatibility = 'auto' | 'assisted' | 'teacher-led' | 'unsupported'
export type Choice = {
  id: string
  text: string
  image?: string
  audio?: string
}
export type NumberSequence = { terms: Array<string | null>; target: number; hint?: string }
export type WordClassification = { tokens: string[]; target: number }
export type MatchingGroup = { groupId: string; number: number; total: number }
/** Projection data never contains the solution or a correctness flag. */
export type Question = {
  id: string
  source: {
    page: number
    block: number
    item: number
    part: number
    exerciseType: string
    documentId?: string
    scenarioId?: string
  }
  title: string
  instruction: string
  prompt: string
  context?: string
  numberSequence?: NumberSequence
  wordClassification?: WordClassification
  matchingGroup?: MatchingGroup
  audio?: string
  /** Ordered source clips forming one recording and one listening allowance. */
  audioParts?: string[]
  audioGrouping?: 'individual'
  audioMaxListens?: number
  images: string[]
  grammarImages?: GrammarImageSupport[]
  words?: string[]
  figure?: { type: Figure; dims?: FigureDims }
  mode: 'choice' | 'oral' | 'sequence'
  choices: Choice[]
  choiceOrderPolicy?: ChoiceOrderPolicy
  compatibility: Exclude<Compatibility, 'unsupported'>
  hints?: string[]
}
export type Correction = { choiceId?: string; text: string; transcript?: string }
export type Issue = { source: string; reason: string }
export type Game = {
  id: string
  seed?: number
  title: string
  questions: Question[]
  corrections: Record<string, Correction>
  issues: Issue[]
  rounds?: Round[]
}
export type Round = { id: string; questionIds: string[]; audio?: string; audioParts?: string[] }
export type Phase =
  | 'thinking'
  | 'cards-up'
  | 'selected'
  | 'discussion'
  | 'revealed'
export type Attempt = {
  questionId: string
  selected?: string
  correct?: boolean
  skipped?: boolean
  manual?: 'acquired' | 'retry'
}
export type RoundRuntime = {
  phase: Phase
  selections: Record<string, string>
  revealedAt?: number
  attempt: number
  hintsShown: Record<string, number>
  imageOrders: Record<string, number[]>
  audioComplete: boolean
  audioOverride: boolean
  audioListens?: number
  extraListens?: number
}
export type PreviousAttempt = {
  roundId: string
  attempt: number
  results: Attempt[]
  manualVotes: Record<string, ManualVote>
  teacherMarks: Record<string, 'success' | 'review' | 'unassessed'>
  audioListens?: number
  extraListens?: number
}
export type Session = {
  gameId: string
  mode: PlayMode
  index: number
  phase: Phase
  selected?: string
  selections: Record<string, string>
  paused: boolean
  finished: boolean
  history: Attempt[]
  manualVotes: Record<string, ManualVote>
  teacherMarks: Record<string, 'success' | 'review' | 'unassessed'>
  note: string
  teacherLocked?: boolean
  revealedAt?: number
  revealRetractions?: Record<string, number>
  roundStates?: Record<string, RoundRuntime>
  previousAttempts?: PreviousAttempt[]
}
export type Action = (
  | { type: 'TIMEOUT' }
  | { type: 'CARDS_UP' }
  | { type: 'SELECT'; choiceId: string; questionId?: string }
  | { type: 'DISCUSS' }
  | { type: 'REVEAL' }
  | { type: 'UNREVEAL'; roundId: string }
  | { type: 'TEACHER_LOCK_SET'; locked: boolean }
  | { type: 'FINISH' }
  | { type: 'NAVIGATE' | 'REOPEN'; index: number }
  | { type: 'RETRY_QUESTION'; roundId: string }
  | { type: 'HINT_SHOW'; questionId: string }
  | { type: 'IMAGE_ORDER_SET'; questionId: string; order: number[] }
  | { type: 'AUDIO_STATE'; roundId: string; status: 'started' | 'ended' | 'override' }
  | { type: 'AUDIO_LISTEN_STARTED' | 'AUDIO_EXTRA_LISTEN_GRANTED'; roundId: string }
  | { type: 'ASSESS'; value: 'acquired' | 'retry'; questionId?: string }
  | { type: 'MANUAL_VOTE_SET'; questionId: string; vote: ManualVote | null }
  | { type: 'TEACHER_MARK_SET'; questionId: string; value: 'success' | 'review' | 'unassessed' }
  | { type: 'SESSION_NOTE_SET'; note: string }
  | { type: 'NEXT' | 'PREVIOUS' | 'SKIP' | 'PAUSE' | 'RESUME' }
) & { roundId?: string }

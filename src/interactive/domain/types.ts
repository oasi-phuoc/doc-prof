import type { Figure, FigureDims } from '@/math/types'

export type PlayMode = 'class' | 'solo'
export type Compatibility = 'auto' | 'assisted' | 'teacher-led' | 'unsupported'
export type Choice = {
  id: string
  text: string
  image?: string
  audio?: string
}
/** Projection data never contains the solution or a correctness flag. */
export type Question = {
  id: string
  source: {
    page: number
    block: number
    item: number
    part: number
    exerciseType: string
  }
  title: string
  instruction: string
  prompt: string
  context?: string
  audio?: string
  images: string[]
  figure?: { type: Figure; dims?: FigureDims }
  mode: 'choice' | 'oral' | 'sequence'
  choices: Choice[]
  compatibility: Exclude<Compatibility, 'unsupported'>
  hints?: string[]
}
export type Correction = { choiceId?: string; text: string }
export type Issue = { source: string; reason: string }
export type Game = {
  id: string
  title: string
  questions: Question[]
  corrections: Record<string, Correction>
  issues: Issue[]
  rounds?: Round[]
}
export type Round = { id: string; questionIds: string[]; audio?: string }
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
}
export type Action =
  | { type: 'TIMEOUT' }
  | { type: 'CARDS_UP' }
  | { type: 'SELECT'; choiceId: string; questionId?: string }
  | { type: 'DISCUSS' }
  | { type: 'REVEAL' }
  | { type: 'ASSESS'; value: 'acquired' | 'retry'; questionId?: string }
  | { type: 'NEXT' | 'PREVIOUS' | 'SKIP' | 'PAUSE' | 'RESUME' }

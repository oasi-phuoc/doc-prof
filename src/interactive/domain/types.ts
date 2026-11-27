import type { Figure, FigureDims, PhraseCategory, PhraseImageClue } from '@/math/types'
import type { ManualVote } from './votes'
import type { GrammarImageSupport } from '@/grammaire/curriculum/types'
import type {ImageStroke,ImageAnnotations} from './image-annotations'
import type { FractionFigure } from './fraction-figure'

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
export type WordClassification = { tokens: string[]; target: number; prefix?:string; ending?:string; joins?:(''|'-'|'-t-')[] }
export type WordSorting = { sentence: Omit<WordClassification, 'target'>; categories: { id: string; label: string }[] }
export type MatchingGroup = { groupId: string; number: number; total: number }
export type MemoryCard={id:string;image?:string;text?:string}
export type MemoryBoardData={cards:MemoryCard[];sourceKeys:string[];group:number;total:number}
export type MemoryRuntime={open:string[];found:string[];turns:number;misses:number;checked:boolean}
export type LotoGoal='line'|'board'
export type LotoBoardData={groupId:string;number:number;total:number;columns:2|3|4|5;goal:LotoGoal;sourceKeys:string[];cells:{id:string;text:string}[];layout?:'extended'}
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
  /** Public roles and goal of an oral scene; never a proposed answer. */
  oralSituation?: string
  numberSequence?: NumberSequence
  wordClassification?: WordClassification
  wordSorting?: WordSorting
  /** One explicit source blank; no expected answer in this display metadata. */
  wordBlank?: {before:string;after:string}
  matchingGroup?: MatchingGroup
  memoryBoard?: MemoryBoardData
  lotoBoard?: LotoBoardData
  audio?: string
  /** Ordered source clips forming one recording and one listening allowance. */
  audioParts?: string[]
  audioGrouping?: 'individual'
  audioMaxListens?: number
  images: string[]
  grammarImages?: GrammarImageSupport[]
  phraseImages?: PhraseImageClue[]
  phraseImagePrefix?:string
  phraseImageLabels?: boolean
  phraseImageShownCategories?: PhraseCategory[]
  grammarCountryGender?: 'masculin' | 'féminin' | 'pluriel'
  words?: string[]
  figure?: { type: Figure; dims?: FigureDims }
  fractionFigure?: FractionFigure
  mode: 'choice' | 'oral' | 'sequence' | 'sorting' | 'memory'
  choices: Choice[]
  choiceOrderPolicy?: ChoiceOrderPolicy
  compatibility: Exclude<Compatibility, 'unsupported'>
  hints?: string[]
}
export type Correction = { choiceId?: string; text: string; transcript?: string; classificationCategory?: { id: string; label: string }; sortingTargets?: string[];memoryPairs?:[string,string][] }
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
  wordSorts?: Record<string, (string | null)[]>
  wordDrops?: Record<string,string>
  imageAnnotations?: Record<string,ImageAnnotations>
  memoryBoards?: Record<string,MemoryRuntime>
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
  teacherBadges?: Record<string, true>
  audioListens?: number
  extraListens?: number
  memoryBoards?: Record<string,MemoryRuntime>
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
  teacherBadges?: Record<string, true>
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
  | { type: 'WORD_SORT_SET'; questionId: string; placements: (string | null)[] }
  | { type: 'WORD_DROP_SET'; questionId: string; choiceId: string | null }
  | { type: 'IMAGE_ANNOTATION_ADD'; questionId: string; imageIndex: number; attempt: number; stroke: ImageStroke }
  | { type: 'IMAGE_ANNOTATION_UNDO' | 'IMAGE_ANNOTATION_CLEAR'; questionId: string; imageIndex: number; attempt: number }
  | {type:'MEMORY_FLIP';questionId:string;cardId:string;attempt:number}
  | {type:'MEMORY_CHECK'|'MEMORY_CANCEL';questionId:string;attempt:number}
  | { type: 'AUDIO_STATE'; roundId: string; status: 'started' | 'ended' | 'override' }
  | { type: 'AUDIO_LISTEN_STARTED' | 'AUDIO_EXTRA_LISTEN_GRANTED'; roundId: string }
  | { type: 'ASSESS'; value: 'acquired' | 'retry'; questionId?: string }
  | { type: 'MANUAL_VOTE_SET'; questionId: string; vote: ManualVote | null }
  | { type: 'TEACHER_MARK_SET'; questionId: string; value: 'success' | 'review' | 'unassessed' }
  | { type: 'TEACHER_BADGE'; questionId: string; badge: 'well-explained'; on: boolean }
  | { type: 'SESSION_NOTE_SET'; note: string }
  | { type: 'NEXT' | 'PREVIOUS' | 'SKIP' | 'PAUSE' | 'RESUME' }
) & { roundId?: string }

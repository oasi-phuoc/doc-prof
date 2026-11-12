import type { ExerciseType, PhraseCategory } from '@/math/types'

export type GrammarLevel = 'A1' | 'A2' | 'B1'
export type GrammarPresentation = 'choice' | 'gap' | 'correct' | 'order' | 'match' | 'transform' | 'document-set' | 'open-written' | 'open-oral'
export const GRAMMAR_PRESENTATIONS: GrammarPresentation[] = ['choice','gap','correct','order','match','transform','document-set','open-written','open-oral']
export type GrammarChoice = { id: string; text: string }
type Source = { path: string; typeId: string; position: number; partition?: string }
type BaseUnit = {
  id: string; prompt: string; answers: string[]; explanation: string; source: Source
  givenVerb?: string
  responseLines?: 1 | 2
  cue?: string
}
export type GrammarReadingQuestion = {
  id: string; prompt: string; answers: string[]; explanation: string; evidence: string[]
  response: 'choice' | 'short'; options?: GrammarChoice[]
}
export type GrammarUnit = BaseUnit & (
  | { kind: 'completion'; options: GrammarChoice[] }
  | { kind: 'correct' }
  | ({ kind: 'transform' } & ({ targetSubject: string; directive?: never } | { directive: string; targetSubject?: never }))
  | { kind: 'order'; tokens: Array<{ id: string; text: string; category: PhraseCategory }> }
  | { kind: 'match'; pairs: Array<{ id: string; left: string; right: string; sourceId: string }> }
  | { kind: 'reading'; genre: string; text: string; questions: GrammarReadingQuestion[] }
  | { kind: 'production'; mode: 'written' | 'oral'; task: string; rubric: Array<{id: string; label: string}>; writeLines: number }
)
export type GrammarBank = {
  schemaVersion: 1
  revision: string
  activityId: string
  subthemeId: string
  topic?: ExerciseType['topic']
  level: GrammarLevel
  label: string
  objective: string
  editorialStatus: 'reviewed' | 'approved'
  review: { reviewer: string; date: string; humanReview: 'pending' | 'approved'; note: string }
  presentations: GrammarPresentation[]
  instructions: Partial<Record<GrammarPresentation, string>>
  units: GrammarUnit[]
}
export type GrammarQuestion = {
  id: string
  presentation: GrammarPresentation
  unit: GrammarUnit
  options?: GrammarChoice[]
  tokens?: Array<{ id: string; text: string; category: PhraseCategory }>
  rightOptions?: GrammarChoice[]
  readingOptions?: Record<string, GrammarChoice[]>
  readingPart?: { kind: 'support'; documentNumber: number; continued?: boolean } | { kind: 'question'; questionId: string; number: number }
}
export type GrammarSnapshot = {
  schemaVersion: 1
  activityId: string
  level: GrammarLevel
  presentation: GrammarPresentation
  bankRevision: string
  seed: number
  requestKey: string
  instruction: string
  pilot: boolean
  questions: GrammarQuestion[]
  groups?: Array<{ id: string; kind: 'document'; supportIds: string[]; questionIds: string[] }>
}

/** Deliberately independent of the older CO detector, which omits nat-co. */
export function isProtectedGrammarCo(typeId: string): boolean {
  return /-(?:co-theme|co-audio|fam-co|nat-co)$/.test(typeId)
}

export class GrammarCurriculumError extends Error {
  readonly code: string
  constructor(code: string, message: string) { super(message); this.code=code }
}

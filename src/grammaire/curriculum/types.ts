import type { ExerciseType, PhraseCategory } from '@/math/types'

export type GrammarLevel = 'A1' | 'A2' | 'B1'
export type GrammarPresentation = 'choice' | 'gap' | 'correct' | 'order' | 'match' | 'transform' | 'document-set' | 'scenario-set' | 'open-written' | 'open-oral'
export const GRAMMAR_PRESENTATIONS: GrammarPresentation[] = ['choice','gap','correct','order','match','transform','document-set','scenario-set','open-written','open-oral']
export type GrammarChoice = { id: string; text: string }
export type GrammarCriterion = { id: string; label: string }
export type GrammarImageSupport = {
  id: string; src: string; sha256: string; alt: string; width: number; height: number
  source: { path: string; manifest: string; rights: 'project-generated' | 'permitted-reuse'; note: string }
}
export type GrammarDialogueQuestion = {
  id: string; response: 'choice' | 'gap'; answers: string[]; explanation: string; options?: GrammarChoice[]
}
type GrammarScenario = {
  kind: 'scenario'; situation: string
  roles: Array<{ id: string; label: string; goal: string }>
  turns: Array<{ id: string; roleId: string; text: string; questionId?: string }>
} & (
  | { contract: 'closed'; questions: GrammarDialogueQuestion[] }
  | { contract: 'open'; task: string; rubric: GrammarCriterion[]; followUps: string[]; writeLines: number }
)
type Source = { path: string; typeId: string; position: number; partition?: string }
type BaseUnit = {
  id: string; prompt: string; answers: string[]; explanation: string; source: Source
  givenVerb?: string
  countryGender?: 'masculin' | 'féminin' | 'pluriel'
  responseLines?: 1 | 2
  cue?: string
  imageSupports?: GrammarImageSupport[]
  reference?: { text: string; gender: 'masculine' | 'feminine'; number: 'singular' | 'plural' }
}
export type GrammarReadingQuestion = {
  id: string; prompt: string; answers: string[]; explanation: string; evidence: string[]
  response: 'choice' | 'short'; options?: GrammarChoice[]
}
export type GrammarUnit = BaseUnit & (
  | { kind: 'completion'; options: GrammarChoice[] }
  | { kind: 'correct'; error?: { segmentId: 'prompt'; start: number; end: number; text: string } }
  | ({ kind: 'transform' } & ({ targetSubject: string; directive?: never } | { directive: string; targetSubject?: never }))
  | { kind: 'order'; tokens: Array<{ id: string; text: string; category: PhraseCategory }> }
  | { kind: 'match'; pairs: Array<{ id: string; left: string; right: string; sourceId: string }> }
  | { kind: 'reading'; genre: string; text: string; questions: GrammarReadingQuestion[] }
  | { kind: 'production'; mode: 'written' | 'oral'; task: string; rubric: Array<{id: string; label: string}>; writeLines: number }
  | GrammarScenario
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
  scenarioOptions?: Record<string, GrammarChoice[]>
  scenarioPart?: { kind: 'support'; scenarioNumber: number; continued?: boolean } | { kind: 'question'; questionId: string; number: number }
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
  groups?: Array<{ id: string; kind: 'document' | 'situation'; supportIds: string[]; questionIds: string[] }>
}

/** Deliberately independent of the older CO detector, which omits nat-co. */
export function isProtectedGrammarCo(typeId: string): boolean {
  return /-(?:co-theme|co-audio|fam-co|nat-co)$/.test(typeId)
}

export class GrammarCurriculumError extends Error {
  readonly code: string
  constructor(code: string, message: string) { super(message); this.code=code }
}

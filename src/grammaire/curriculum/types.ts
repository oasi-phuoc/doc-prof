import type { PhraseCategory } from '@/math/types'

export type GrammarLevel = 'A1' | 'A2' | 'B1'
export type GrammarPresentation = 'choice' | 'gap' | 'correct' | 'order' | 'match'
export type GrammarChoice = { id: string; text: string }
type Source = { path: string; typeId: string; position: number; partition?: string }
type BaseUnit = { id: string; prompt: string; answers: string[]; explanation: string; source: Source }
export type GrammarUnit = BaseUnit & (
  | { kind: 'completion'; options: GrammarChoice[] }
  | { kind: 'correct' }
  | { kind: 'order'; tokens: Array<{ id: string; text: string; category: PhraseCategory }> }
  | { kind: 'match'; pairs: Array<{ id: string; left: string; right: string; sourceId: string }> }
)
export type GrammarBank = {
  schemaVersion: 1
  revision: string
  activityId: string
  subthemeId: string
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
}

/** Deliberately independent of the older CO detector, which omits nat-co. */
export function isProtectedGrammarCo(typeId: string): boolean {
  return /-(?:co-theme|co-audio|fam-co|nat-co)$/.test(typeId)
}

export class GrammarCurriculumError extends Error {
  readonly code: string
  constructor(code: string, message: string) { super(message); this.code=code }
}

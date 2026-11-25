import type { LogistiqueDomain } from './domains'
import type { LogistiqueType, LogistiqueLevel } from './catalog'

export type LogistiqueDifficulty = 'facile' | 'moyen' | 'avance'
export type LogistiqueEditorialStatus =
  | 'imported-unreviewed'
  | 'draft'
  | 'reviewed'
  | 'approved'
  | 'blocked'
  | 'not-applicable'
  | 'retired'
export type LogistiqueSourceKind = 'epcas' | 'original-doc-prof'
export type LogistiqueRights = 'permitted-reuse' | 'project-original' | 'pending'

export type LogistiqueProvenance = {
  origin: LogistiqueSourceKind
  repository?: string
  commit?: string
  path: string
  sourceField?: string
  sourceHash?: string
  rights: LogistiqueRights
  resolution?: 'native-cfc' | 'native-afp' | 'inherited-cfc' | 'adapted' | 'original'
  derivedFrom?: { id: string; revision: string }
  lessonId?: string
  sourcePageId?: string
  sourcePosition?: string
}

export type LogistiqueCorrection =
  | { kind: 'choice'; options: { id: string; text: string }[]; correctIds: string[] }
  | { kind: 'boolean'; answer: boolean; justification: string }
  | { kind: 'open'; model: string; accepted?: string[]; criteria: { description: string; points?: number }[]; explanation?: string }
  | { kind: 'source-markdown'; blocks: { directive: string; markdown: string; startLine: number; endLine: number }[] }
  | { kind: 'numeric'; value: number; unit: string; tolerance: number; precision: string; formula: string; steps: string[] }
  | { kind: 'matching'; pairs: { leftId: string; rightId: string }[] }
  | { kind: 'ordering'; orderedIds: string[]; alternatives?: string[][] }
  | { kind: 'gap'; blanks: { id: string; answers: string[] }[] }

export type LogistiqueQuestionPayload = {
  kind: 'question'
  prompt: string
  format: 'qcm' | 'multi' | 'true_false' | 'open' | 'matching' | 'ordering' | 'fill_blank'
  options?: { id: string; text: string }[]
  responseLines?: number
}

export type LogistiqueMathPayload = {
  kind: 'calculation'
  prompt: string
  unit?: string
  responseLines: number
}

export type LogistiqueScenarioPayload = {
  kind: 'scenario'
  title: string
  context: string
  role: string
  mission: string
  supports: { title: string; content: string }[]
  responseLines: number
}

export type LogistiqueGlossaryPayload = {
  kind: 'glossary'
  term: string
  definition: string
  example?: string
  synonyms?: string[]
  sourceLink?: string
}

export type LogistiqueTheoryPayload = {
  kind: 'theory'
  title: string
  markdown: string
  sectionId: string
}

export type LogistiqueSourceDocumentPayload = {
  kind: 'source-document'
  title: string
  fullMarkdown: string
  summaryMarkdown: string
  objectivesMarkdown?: string
  objectivesSummaryMarkdown?: string
  overviewMarkdown?: string
  overviewSummaryMarkdown?: string
  sourceSlug: string
}

export type LogistiqueSourceQuestionPayload = {
  kind: 'source-question'
  title: string
  sourceSlug: string
  sourcePosition: string
  promptMarkdown: string
  parentHeading?: string
  pageContext?: string
  unsupportedBlocks?: { kind: string; directive: string; rawMarkdown: string }[]
}

export type LogistiquePayload =
  | LogistiqueQuestionPayload
  | LogistiqueMathPayload
  | LogistiqueScenarioPayload
  | LogistiqueGlossaryPayload
  | LogistiqueTheoryPayload
  | LogistiqueSourceDocumentPayload
  | LogistiqueSourceQuestionPayload

export type LogistiqueUnit = {
  id: string
  submoduleCode: string
  type: LogistiqueType
  revision: string
  objectiveIds: string[]
  difficulty?: LogistiqueDifficulty
  sourceDifficulty?: string
  sourceType?: string
  editorialNote?: string
  bloomLevel?: 1 | 2 | 3 | 4 | 5 | 6
  eligibleLevels: LogistiqueLevel[]
  reviewByLevel: Partial<Record<LogistiqueLevel, { status: LogistiqueEditorialStatus; revision: string }>>
  status: LogistiqueEditorialStatus
  payload: LogistiquePayload
  correction?: LogistiqueCorrection
  provenance: LogistiqueProvenance[]
  sourceDuplicateCandidates?: string[]
  tags: string[]
}

export type LogistiqueBank = {
  schemaVersion: 1
  revision: string
  submoduleCode: string
  type: LogistiqueType
  units: LogistiqueUnit[]
  sourcePageIds?: string[]
  sourceUnitCount?: number
}

export type LogistiqueGenerationConfig = {
  domain: LogistiqueDomain
  submoduleId: string
  type: LogistiqueType
  quantity?: number
  difficulty?: LogistiqueDifficulty | 'toutes'
  source?: 'originale' | 'nouvelle' | 'toutes'
  seed: number
  bankRevision?: string
}

export type LogistiqueSnapshot = {
  schemaVersion: 1
  domain: LogistiqueDomain
  diploma: LogistiqueLevel
  submoduleId: string
  submoduleCode: string
  type: LogistiqueType
  bankRevision: string
  seed: number
  units: { id: string; revision: string; payload: LogistiquePayload; correction?: LogistiqueCorrection }[]
}

export type LogistiqueGenerationResult =
  | { status: 'ready'; snapshot: LogistiqueSnapshot; available: number }
  | { status: 'empty'; reason: 'missing-bank' | 'no-approved-units'; available: 0 }
  | { status: 'invalid'; reason: string; available: 0 }

/** Règles CECRL / FALC pour la compréhension écrite (paramètres réutilisables). */
import type { Difficulty } from '@/math/types'
import type { FrChoice } from './francais-banks'

export type ComprehensionLevel = 'a1' | 'a2' | 'b1'

export type ComprehensionEcritedoc = {
  id: string
  level: ComprehensionLevel
  /** Thèmes communicatifs (`fr-presenter`, …) auxquels le texte peut servir. */
  themes: string[]
  /** Genre du document (e-mail, lettre, annonce, narratif…). */
  format?:
    | 'narratif'
    | 'email'
    | 'lettre'
    | 'sms'
    | 'annonce'
    | 'article'
    | 'notice'
    | 'invitation'
    | 'avis'
  title: string
  text: string
  questions: FrChoice[]
}

export type ComprehensionEcritedRules = {
  label: string
  minWords: number
  maxWords: number
  minSentences?: number
  maxSentences?: number
  paragraphs?: number
  allowedTenses: string[]
  maxSubordinates: number
  allowAdjectives: boolean
  allowAdverbs: boolean
  allowPronouns: boolean
  questionStyle: 'literal' | 'link' | 'inference'
}

export const COMPREHENSION_ECRITE_RULES: Record<ComprehensionLevel, ComprehensionEcritedRules> = {
  a1: {
    label: 'A1',
    minWords: 30,
    maxWords: 60,
    minSentences: 4,
    maxSentences: 6,
    allowedTenses: ['présent', 'passé composé basique'],
    maxSubordinates: 0,
    allowAdjectives: false,
    allowAdverbs: false,
    allowPronouns: false,
    questionStyle: 'literal',
  },
  a2: {
    label: 'A2',
    minWords: 60,
    maxWords: 120,
    minSentences: 6,
    maxSentences: 10,
    allowedTenses: ['présent', 'passé composé', 'futur proche'],
    maxSubordinates: 0,
    allowAdjectives: true,
    allowAdverbs: true,
    allowPronouns: false,
    questionStyle: 'link',
  },
  b1: {
    label: 'B1',
    minWords: 120,
    maxWords: 250,
    paragraphs: 3,
    allowedTenses: ['présent', 'passé composé', 'imparfait', 'conditionnel simple', 'futur'],
    maxSubordinates: 2,
    allowAdjectives: true,
    allowAdverbs: true,
    allowPronouns: true,
    questionStyle: 'inference',
  },
}

export function comprehensionLevelFromDifficulty(difficulty: Difficulty | undefined): ComprehensionLevel {
  if (difficulty === 'facile') return 'a1'
  if (difficulty === 'avance') return 'b1'
  return 'a2'
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function assertTextFitsLevel(doc: ComprehensionEcritedoc): string[] {
  const rules = COMPREHENSION_ECRITE_RULES[doc.level]
  const words = countWords(doc.text)
  const issues: string[] = []
  if (words < rules.minWords || words > rules.maxWords) {
    issues.push(`${doc.id}: ${words} mots hors ${rules.minWords}–${rules.maxWords}`)
  }
  if (doc.questions.length < 6) {
    issues.push(`${doc.id}: moins de 6 questions (banque suite auto)`)
  }
  return issues
}

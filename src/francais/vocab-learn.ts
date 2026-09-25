/** Lexique Voc : mots sélectionnés + métadonnées d’exercices. */
import { FR_PRESENTER_VOCAB } from './vocab-banks/fr-presenter'
import type { Difficulty } from '@/math/types'

export type VocabLevel = 'a1' | 'a2' | 'b1'

export type VocabSentenceKind = 'trous' | 'phrase' | 'dictee'

export type VocabWordEntry = {
  id: string
  label: string
  imageSrc?: string
  definition: string
  syllables: string[]
  synonym?: string
  antonym?: string
  masculine?: string
  feminine?: string
  sentences: Record<VocabSentenceKind, Record<VocabLevel, string[]>>
}

/** Alias historique pour le tableau « Mots à apprendre ». */
export type VocabLearnWord = Pick<VocabWordEntry, 'id' | 'label' | 'imageSrc'>

const VOCAB_BY_TOPIC: Record<string, VocabWordEntry[]> = {
  'fr-presenter': FR_PRESENTER_VOCAB,
}

export const VOCAB_EXERCISE_KINDS = [
  'assoc-image',
  'assoc-def',
  'qcm-def',
  'trous',
  'def-ecrire',
  'phrase',
  'dictee',
  'syllabes',
  'syn-ant',
  'genre',
] as const

export type VocabExerciseKind = (typeof VOCAB_EXERCISE_KINDS)[number]

export function vocabLevelFromDifficulty(difficulty: Difficulty | undefined): VocabLevel {
  if (difficulty === 'facile') return 'a1'
  if (difficulty === 'avance') return 'b1'
  return 'a2'
}

export function vocabLearnWordsFor(topic: string): VocabWordEntry[] {
  return VOCAB_BY_TOPIC[topic] ?? []
}

export function isVocabLearnType(typeId: string): boolean {
  return typeId.endsWith('-voc-mots')
}

export function isVocabPoolType(typeId: string): boolean {
  return /-(voc)-(mots|assoc-image|assoc-def|qcm-def|trous|def-ecrire|phrase|dictee|syllabes|syn-ant|genre)$/.test(
    typeId,
  )
}

export function isVocabProductionType(typeId: string): boolean {
  return /-(voc)-(trous|def-ecrire|phrase|dictee)$/.test(typeId)
}

export function parseVocabKind(typeId: string): VocabExerciseKind | 'mots' | null {
  const match = /-voc-([a-z-]+)$/.exec(typeId)
  if (!match) return null
  const kind = match[1]!
  if (kind === 'mots') return 'mots'
  if ((VOCAB_EXERCISE_KINDS as readonly string[]).includes(kind)) return kind as VocabExerciseKind
  return null
}

export function defaultVocabSelected(topic: string, rows = 3, cols = 3): string[] {
  const words = vocabLearnWordsFor(topic)
  const n = Math.max(1, rows) * Math.max(1, cols)
  return words.slice(0, n).map((word) => word.id)
}

export function resolveVocabEntries(
  topic: string,
  selectedIds: string[] | undefined,
  rows: number,
  cols: number,
): VocabLearnWord[] {
  return resolveVocabPool(topic, selectedIds).slice(0, Math.max(1, rows) * Math.max(1, cols))
}

/** Pool de mots cochés pour les exercices Voc (hors capacité tableau). */
export function resolveVocabPool(topic: string, selectedIds: string[] | undefined): VocabWordEntry[] {
  const bank = vocabLearnWordsFor(topic)
  if (bank.length === 0) return []
  const byId = new Map(bank.map((word) => [word.id, word]))
  const ids =
    selectedIds && selectedIds.length > 0
      ? selectedIds.filter((id) => byId.has(id))
      : defaultVocabSelected(topic, 3, 3)
  return ids.map((id) => byId.get(id)!)
}

export function wordHasSynAnt(word: VocabWordEntry): boolean {
  return Boolean(word.synonym || word.antonym)
}

export function wordHasGender(word: VocabWordEntry): boolean {
  return Boolean(word.masculine && word.feminine && word.masculine !== word.feminine)
}

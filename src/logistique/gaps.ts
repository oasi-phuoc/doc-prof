import { createRng, shuffle } from '@/math/rng'
import type { LogistiqueGaps, MathItem } from '@/math/types'
import { countInlineBlanks } from '@/tcf/inline-blank'

export type LogistiqueGapDraft = {
  prompt: string
  answers: string
  distractors: string
  showWords: boolean
}

function normalizedWord(word: string): string {
  return word.normalize('NFC').trim().toLocaleLowerCase('fr-CH')
}

export function logistiqueGapDistractors(gaps: LogistiqueGaps): string[] {
  if (gaps.distractors) return gaps.distractors
  const answers = gaps.answers.map(normalizedWord)
  return (gaps.words ?? []).filter((word) => {
    const answer = answers.indexOf(normalizedWord(word))
    if (answer < 0) return true
    answers.splice(answer, 1)
    return false
  })
}

function logistiqueGapIssue(prompt: string, answers: string[], distractors: string[]): string | undefined {
  const blanks = countInlineBlanks(prompt)
  if (!blanks) return 'Insérez au moins un blanc avec ___.'
  if (blanks !== answers.length) return `${blanks} blanc(s) dans le texte, ${answers.length} réponse(s) indiquée(s).`
  const solutions = new Set(answers.map(normalizedWord))
  const otherWords = new Set(distractors.map(normalizedWord))
  if (otherWords.size !== distractors.length || [...otherWords].some((word) => solutions.has(word))) {
    return 'Chaque mot supplémentaire doit être distinct des réponses et des autres mots supplémentaires.'
  }
}

function sameWords(first: string[], second: string[]) {
  const sorted = first.toSorted()
  return sorted.length === second.length && second.toSorted().every((word, i) => word === sorted[i])
}

function parseLines(value: string): string[] {
  return value.split('\n').map((line) => line.trim()).filter(Boolean)
}

export function editLogistiqueGaps(draft: LogistiqueGapDraft, original: LogistiqueGaps):
  { error: string } | { patch: Pick<MathItem, 'prompt' | 'answer'> & { logistiqueGaps: LogistiqueGaps } } {
  const answers = parseLines(draft.answers)
  const distractors = parseLines(draft.distractors)
  const error = logistiqueGapIssue(draft.prompt, answers, distractors)
  if (error) return { error }
  const pool = [...answers, ...distractors]
  const words = draft.showWords ? original.words && sameWords(original.words, pool)
    ? original.words
    : shuffle(createRng(20261127), pool) : undefined
  return { patch: { prompt: draft.prompt, answer: answers.join(' / '), logistiqueGaps: { answers, words, distractors } } }
}

export function validLogistiqueGaps(prompt: unknown, value: unknown): boolean {
  if (typeof prompt !== 'string' || !value || typeof value !== 'object' || Array.isArray(value)) return false
  const { answers, distractors, words } = value as Partial<LogistiqueGaps>
  const validWords = (list: unknown): list is string[] => Array.isArray(list) && list.every((word) =>
    typeof word === 'string' && Boolean(word.trim()))
  if (!validWords(answers) || (distractors !== undefined && !validWords(distractors)) ||
      (words !== undefined && !validWords(words))) return false
  const extra = logistiqueGapDistractors({ answers, distractors, words })
  return !logistiqueGapIssue(prompt, answers, extra) && (!words || sameWords(words, [...answers, ...extra]))
}

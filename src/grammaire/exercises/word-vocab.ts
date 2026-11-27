import type { ExerciseType, MathItem, PageConfig } from '@/math/types'
import { createRng, shuffle } from '@/math/rng'
import data from '../media/word-vocab/bank.json'
import { gramExerciseTypeId } from './subthemes'

export function wordVocabTypeId(subId: string) {
  return gramExerciseTypeId(subId, 'vocab-illustre')
}

export function wordVocabTypes(): ExerciseType[] {
  return data.map(({ subId, topic, entries }) => ({
    id: wordVocabTypeId(subId), topic, label: 'Vocabulaire illustré',
    description: 'Associer les mots ou expressions à des images.',
    instruction: 'Regardez les images et lisez les mots.',
    visual: 'texte', preferredColumns: 3, preferredCount: Math.min(entries.length, 6),
    maxCount: Math.min(entries.length, 9), supportsNumberRange: false,
  }))
}

export const wordVocabSubthemes = [
  { id: 'meteo-saisons', label: 'Météo et saisons', topic: 'gram-temps', theoryTypeIds: [] as string[] },
  { id: 'a-la-poste', label: 'À la poste', topic: 'gram-demander', theoryTypeIds: [] as string[] },
]

export function buildWordVocab(config: PageConfig, seed: number) {
  const bank = data.find(({ subId }) => wordVocabTypeId(subId) === config.exerciseType)
  if (!bank) return null
  const recall = config.grammarVocabRecall === true
  const selected = shuffle(createRng(seed), bank.entries).slice(0, Math.max(1, Math.min(config.count, 9)))
  const items: MathItem[] = selected.map(({ id, label, image }) => ({
    layout: 'text', hideItemNumber: !recall, answer: label,
    grammarWordVocab: { id, label, image, recall },
  }))
  return {
    instruction: recall ? 'Écrivez le mot ou l’expression sous chaque image.' : 'Regardez les images et lisez les mots ou les expressions.',
    items,
    bankQuestionCap: Math.min(bank.entries.length, 9),
  }
}

export function isWordVocabType(typeId: string) {
  return data.some(({ subId }) => wordVocabTypeId(subId) === typeId)
}

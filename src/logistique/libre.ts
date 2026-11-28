import { createRng, shuffle } from '@/math/rng'
import type { ExerciseBlock, MathItem, PageConfig } from '@/math/types'
import { isLogistiqueDomain, type LogistiqueType } from './catalog'
import { logistiqueVerdicts, validLogistiqueChoice } from './choices'
import { generateLogistique } from './generate'
import { validLogistiqueMatching } from './matching'
import { validLogistiqueExerciseTable } from './tables'

export type LogistiqueQuestionFormat = 'open' | 'qcm' | 'qcm-multiple' | 'vrai-faux' | 'associer-textes'

export function newLogistiqueQuestion(module: string, kind: LogistiqueType['kind'], format: LogistiqueQuestionFormat): MathItem {
  const match = format === 'associer-textes'
  const select = format !== 'open' && !match
  return {
    libreId: `log-question-${crypto.randomUUID()}`,
    logistiqueLocalModule: module,
    logistiqueRetained: true,
    libreCorrectionPending: true,
    layout: match ? 'vocab-match' : select ? 'select' : 'text',
    prompt: '',
    answer: '',
    ...(select ? { options: format === 'vrai-faux' ? [...logistiqueVerdicts] : ['', '', '', ''] } : {}),
    ...(format === 'qcm-multiple' ? { logistiqueChoice: { kind: 'multiple', correct: [] } } : {}),
    ...(format === 'vrai-faux' ? { logistiqueChoice: { kind: 'true-false' } } : {}),
    ...(match ? { logistiqueMatching: true, labels: [], options: [], vocabPairs: [] } : {}),
    ...(kind === 'maths' ? { calcAnswer: '', responseAnswer: '' } : {}),
  }
}

export function completeLogistiquePrompt(item: MathItem): boolean {
  if (!item.prompt?.trim()) return false
  if (item.logistiqueMatching) return Boolean(item.vocabPairs?.length) && validLogistiqueMatching(item)
  if (item.layout !== 'select') return true
  const choices = item.options?.map((option) => option.trim()) ?? []
  return choices.length >= 2 && choices.every(Boolean) && new Set(choices).size === choices.length
}

export function reviewableLogistiqueAnswer(item: MathItem): boolean {
  if (item.logistiqueMatching) return completeLogistiquePrompt(item) && validLogistiqueMatching(item)
  if (item.logistiqueTable && item.calcAnswer === undefined) {
    return completeLogistiquePrompt(item) && validLogistiqueExerciseTable(item.logistiqueTable)
  }
  if (item.logistiqueChoice) {
    const choice = item.logistiqueChoice
    return completeLogistiquePrompt(item) && validLogistiqueChoice(item) && Boolean(item.answer.trim()) &&
      (choice.kind !== 'true-false' || choice.justification === undefined || Boolean(choice.justification.trim()))
  }
  return completeLogistiquePrompt(item) && Boolean(item.answer.trim()) &&
    (item.calcAnswer === undefined || Boolean(item.calcAnswer.trim())) &&
    (item.logistiqueResponseLines?.kind !== 'numbered' || item.logistiqueResponseLines.answers.every((answer) => answer.trim())) &&
    (item.layout !== 'select' || Boolean(item.options?.includes(item.answer)))
}

export function availableLogistiqueQuestions(candidates: readonly MathItem[], existing: readonly MathItem[]): MathItem[] {
  const ids = new Set<string>()
  const legacyPrompts = new Set<string>()
  for (const item of existing) {
    if (item.logistiqueSource) ids.add(item.logistiqueSource.id)
    else if (item.prompt) legacyPrompts.add(item.prompt)
  }
  return candidates.filter((item) => item.logistiqueSource &&
    !ids.has(item.logistiqueSource.id) && !legacyPrompts.has(item.prompt ?? ''))
}

export function selectLogistiqueLot(candidates: MathItem[], count: number, seed: number): MathItem[] {
  return shuffle(createRng(seed), candidates).slice(0, count)
}

export function retainLogistiqueQuestions(config: PageConfig, seed: number, evaluation: boolean): Partial<ExerciseBlock> {
  if (!isLogistiqueDomain(config.domain)) return {}
  const retained = config.libreItems?.filter((item) => item.logistiqueRetained || item.libreLocked)
  if (!retained?.length) return {}
  const excluded = new Set(retained.flatMap((item) => item.logistiqueSource ? [item.logistiqueSource.id] : []))
  const draw = generateLogistique(evaluation ? config : { ...config, logistiqueSelection: undefined, logistiqueEvaluation: undefined }, seed, undefined, excluded)
  return { libreItems: [...draw.items, ...retained], libreInstruction: config.libreInstruction }
}

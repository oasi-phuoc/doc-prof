import type { MathItem, PageConfig } from '@/math/types'
import { int, type Rng } from '@/math/rng'
import { createGrammarQuestion } from '../curriculum/questions'
import type { GrammarUnit } from '../curriculum/types'

export type CompletionFiche = {
  prompt: string
  answer: string
  distractors: readonly [string, string]
  explanation: string
}

export function completionFicheItems(
  entries: readonly CompletionFiche[],
  config: Pick<PageConfig, 'exerciseType' | 'completionPresentation'>,
  sourcePath: string,
  rng: Rng,
): MathItem[] {
  return entries.map(({ prompt, answer, distractors, explanation }, position) => {
    const unit: GrammarUnit = {
      kind: 'completion',
      id: `${config.exerciseType}-question-${position + 1}`,
      prompt,
      answers: [answer],
      options: [answer, ...distractors].map((text, index) => ({ id: String(index + 1), text })),
      explanation,
      source: { path: sourcePath, typeId: config.exerciseType, position },
    }
    return {
      layout: 'grammar',
      prompt,
      answer,
      grammar: createGrammarQuestion(unit, config.completionPresentation === 'gap' ? 'gap' : 'choice', int(rng, 1, 2147483646)),
    }
  })
}

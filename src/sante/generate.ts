import { normalizeTheoryBlocks } from '@/francais/grammar-theory'
import { grammarCoEntries } from '@/grammaire/exercises/co-bank'
import type { Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { tcfExerciseItems } from '@/tcf/generate'
import { tcfExerciseById } from '@/tcf/loader'
import { peEvaluation } from '@/tcf/pe-evaluation'
import { normalizeLegacySanteBlock, santeActivityByType } from './catalog'
import { santeSpecialistQuestions, santeTheory } from './content'

export function tryGenerateSanteBlock(
  config: PageConfig,
  rng: Rng,
): { instruction: string; items: MathItem[] } | null {
  if (config.domain !== 'santé') return null
  const selected = normalizeLegacySanteBlock(config)
  const activity = santeActivityByType.get(selected.exerciseType)
  if (!activity) return null

  const blocks = activity.theory ?? santeTheory[activity.id]
  if (blocks) {
    return {
      instruction: `${activity.label} (${activity.level})`,
      items: normalizeTheoryBlocks(blocks)
        .filter((block) => block.kind !== 'page')
        .map((block, index) => ({
          layout: 'theory',
          prompt: `${activity.id}-${index}`,
          answer: '',
          theoryBlock: block,
          noPoints: true,
        })),
    }
  }

  const grammarSource = activity.grammarCoSource
    ? grammarCoEntries(activity.grammarCoSource, 'A1').find((entry) => entry.exercise.id === activity.sourceId)?.exercise
    : undefined
  const source = activity.exercise ?? (grammarSource
    ? { ...grammarSource, id: activity.id, questions: santeSpecialistQuestions }
    : tcfExerciseById(activity.sourceId))
  if (!source) {
    return {
      instruction: '',
      items: [{ layout: 'text', prompt: 'Le document de cet exercice est indisponible.', answer: '', noPoints: true }],
    }
  }
  const exercise = activity.questionIndexes
    ? { ...source, questions: activity.questionIndexes.flatMap((index) => source.questions.slice(index, index + 1)) }
    : source
  const items = tcfExerciseItems(exercise, rng, config.tcfFormModes).map((item) => ({
    ...item,
    tcfExerciseId: exercise.id,
  }))
  const last = items.at(-1)
  if (last && exercise.competence === 'PE') {
    last.tcfPeEvaluation = peEvaluation(exercise, exercise.points ?? 10, activity.instruction)
  }
  return { instruction: activity.instruction ?? '', items }
}

import { createRng, int, shuffle } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { gramKindById } from './kinds'
import {
  instructionForSingleVerb,
  normalizeGramBank,
  stripParenVerb,
  uniqueSampleVerb,
} from './normalize-items'
import { parseGramExerciseType } from './subthemes'
import { bankForType, lessonForType } from './bank'
import { gramItemsToTcfExercise, grammarExerciseItems } from './to-tcf'
import { isGrammaireExerciseType } from './types'
import { buildImportedGrammarCo } from './co-generate'
import { buildGrammarCommunication, communicationQuestionCap, isCommunicationKind } from './communication'

/** Génère un bloc d’exercices grammaire (déterministe), rendu TCF. */
export function tryGenerateGrammaireExerciseBlock(
  config: PageConfig,
  seed: number,
): { instruction: string; items: MathItem[]; bankQuestionCap?: number } | null {
  const typeId = config.exerciseType
  if (!isGrammaireExerciseType(typeId)) return null
  const parsed = parseGramExerciseType(typeId)
  if (!parsed) return null
  const kind = gramKindById(parsed.kindId)
  if (!kind) return null

  const rng = createRng(seed)
  const importedCo = buildImportedGrammarCo(config,rng)
  if (importedCo) return importedCo
  if (config.tcfExercise) {
    const ex = config.tcfExercise
    return {
      instruction: ex.consigne?.trim() || kind.instruction,
      items: grammarExerciseItems(ex, rng, config.tcfFormModes),
      bankQuestionCap: Math.max(ex.questions.length, 1),
    }
  }

  if (isCommunicationKind(parsed.kindId)) {
    const exercise = buildGrammarCommunication({
      subId: parsed.subId, kindId: parsed.kindId, typeId, rng, count: config.count,
    })
    if (exercise) return {
      instruction: exercise.consigne ?? kind.instruction,
      items: grammarExerciseItems(exercise, rng, config.tcfFormModes),
      bankQuestionCap: communicationQuestionCap(parsed.subId, parsed.kindId),
    }
  }

  const rawBank = bankForType(typeId)
  const bank = normalizeGramBank(rawBank)
  if (!bank.length) {
    return {
      instruction: kind.instruction,
      items: [
        {
          layout: 'text',
          prompt: 'Banque d’exercices à compléter pour ce type.',
          answer: '',
        },
      ],
      bankQuestionCap: 0,
    }
  }

  const count = Math.min(Math.max(1, config.count), bank.length)
  const order = shuffle(
    rng,
    bank.map((_, i) => i),
  ).slice(0, count)
  const sampled = order.map((index) => bank[index]!)

  const lesson = lessonForType(typeId)
  let instruction = lesson?.instruction ?? kind.instruction
  const keepVerbCue = false
  const singleVerb = !keepVerbCue && (parsed.kindId === 'qcm-conj' || parsed.kindId === 'fill-conj')
    ? uniqueSampleVerb(sampled)
    : null
  const items = singleVerb
    ? sampled.map((item) => ({ ...item, prompt: stripParenVerb(item.prompt) }))
    : sampled
  if (singleVerb) instruction = instructionForSingleVerb(instruction, singleVerb)

  const exercise = gramItemsToTcfExercise({
    typeId,
    instruction,
    items,
    kindId: parsed.kindId,
  })

  return {
    instruction,
    items: grammarExerciseItems(exercise, rng, config.tcfFormModes),
    bankQuestionCap: bank.length,
  }
}

/** Tirage déterministe d’un index de banque (tests / debug). */
export function sampleBankIndex(seed: number, size: number): number {
  if (size <= 0) return 0
  return int(createRng(seed), 0, size - 1)
}

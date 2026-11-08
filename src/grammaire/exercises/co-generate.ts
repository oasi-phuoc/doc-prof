import type { Rng } from '@/math/rng'
import type { MathItem, PageConfig } from '@/math/types'
import { grammarCoThemeForType } from './co-themes'
import { defaultGrammarCoLevel, grammarCoEntries, hasGrammarCoTheme, type GrammarCoEntry } from './co-bank'
import { grammarExerciseItems } from './to-tcf'

/** No level fallback: an A2 recipe never draws a currently available A1 recording. */
export function buildImportedGrammarCo(config: PageConfig, rng: Rng, bank?: readonly GrammarCoEntry[]): {
  instruction: string; items: MathItem[]; bankQuestionCap: number
} | null {
  const theme = grammarCoThemeForType(config.exerciseType)
  if (!theme || config.tcfExercise) return null
  if (!config.exerciseType.endsWith('-co-theme') && !bank && !hasGrammarCoTheme(theme.id)) return null
  const level = config.grammarCoLevel ?? defaultGrammarCoLevel(theme.id,bank)
  const entries = grammarCoEntries(theme.id,level,bank)
  if (!entries.length) return {
    instruction:'Compréhension orale',bankQuestionCap:0,
    items:[{layout:'text',prompt:`Les audios ${level} de ce thème ne sont pas encore disponibles.`,answer:''}],
  }
  const entry = entries.find(item=>item.exercise.id===config.grammarCoAudioId)??entries[0]!
  const exercise = {...entry.exercise,questions:entry.exercise.questions.slice(0,Math.max(1,config.count))}
  return {
    instruction:exercise.consigne?.trim()||(exercise.questions.length?'Écoutez et répondez aux questions.':'Écoutez l’enregistrement.'),
    items:grammarExerciseItems(exercise,rng,config.tcfFormModes),
    bankQuestionCap:entry.exercise.questions.length,
  }
}

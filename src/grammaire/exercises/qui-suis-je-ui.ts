import { parseGramExerciseType } from './subthemes'
import { quiSuisJeFormUi, type QuiSuisJeFormUi } from './qui-suis-je'

/** Forme de réponse UI pour un type d’exercice grammaire. */
export function gramExerciseFormUi(exerciseType: string): QuiSuisJeFormUi {
  const parsed = parseGramExerciseType(exerciseType)
  if (!parsed || parsed.subId !== 'a1') return 'none'
  return quiSuisJeFormUi(parsed.kindId)
}

export function isGramDualFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'header2'
}

export function isGramMarginFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'margin3'
}

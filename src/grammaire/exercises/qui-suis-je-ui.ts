import { parseGramExerciseType } from './subthemes'
import { nationaliteFormUi } from './nationalite'
import { provenanceFormUi } from './provenance'
import { familleFormUi } from './famille'
import { quiSuisJeFormUi, type QuiSuisJeFormUi } from './qui-suis-je'

/** Forme de réponse UI pour un type d’exercice grammaire. */
export function gramExerciseFormUi(exerciseType: string): QuiSuisJeFormUi {
  const parsed = parseGramExerciseType(exerciseType)
  if (!parsed) return 'none'
  if (parsed.subId === 'a1') return quiSuisJeFormUi(parsed.kindId)
  if (parsed.subId === 'a3') return nationaliteFormUi(parsed.kindId)
  if (parsed.subId === 'a6') return provenanceFormUi(parsed.kindId)
  if (parsed.subId === 'famille') return familleFormUi(parsed.kindId)
  return 'none'
}

export function isGramDualFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'header2'
}

export function isGramMarginFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'margin3'
}

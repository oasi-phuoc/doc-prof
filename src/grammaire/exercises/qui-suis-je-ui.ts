import { parseGramExerciseType } from './subthemes'
import { nationaliteFormUi } from './nationalite'
import { provenanceFormUi } from './provenance'
import { familleFormUi } from './famille'
import { quiSuisJeFormUi, type QuiSuisJeFormUi } from './qui-suis-je'
import { lessonForType } from './bank'
import { hasGrammarCommunication } from './communication'

/** Forme de réponse UI pour un type d’exercice grammaire. */
export function gramExerciseFormUi(exerciseType: string): QuiSuisJeFormUi {
  const parsed = parseGramExerciseType(exerciseType)
  if (!parsed) return 'none'
  if (parsed.kindId==='co-theme') return 'margin3'
  if (parsed.subId === 'a1') return quiSuisJeFormUi(parsed.kindId)
  if (parsed.subId === 'a3') return nationaliteFormUi(parsed.kindId)
  if (parsed.subId === 'a6') return provenanceFormUi(parsed.kindId)
  if (parsed.subId === 'famille') return familleFormUi(parsed.kindId)
  if (parsed.kindId === 'communication-ce' && hasGrammarCommunication(parsed.subId, parsed.kindId)) return 'header2'
  return lessonForType(exerciseType)?.items.every((item) => item.options?.length === 3)
    ? 'header2'
    : 'none'
}

export function isGramDualFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'header2'
}

export function isGramMarginFormExercise(exerciseType: string): boolean {
  return gramExerciseFormUi(exerciseType) === 'margin3'
}

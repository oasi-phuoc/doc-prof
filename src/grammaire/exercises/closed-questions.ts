/** Métadonnées du menu ; banque graduée exclusivement. */
import type {GramExerciseKindId} from './kinds'
export const CLOSED_QUESTION_KIND_IDS = ["question-est-ce-que","question-inversion","response-affirmative","response-negative","question-reading-ce","question-reading-write"] as const satisfies readonly GramExerciseKindId[]

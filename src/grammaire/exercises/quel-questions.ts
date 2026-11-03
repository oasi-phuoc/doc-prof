import type { GramLesson } from './types'
import type { GramExerciseKindId } from './kinds'
import data from './question-quel-data.json'

export const QUEL_QUESTION_KIND_IDS = [
  'question-quel', 'question-quel-response', 'question-reading-ce', 'question-reading-write',
] as const satisfies readonly GramExerciseKindId[]

export const QUEL_QUESTION_LESSONS: GramLesson[] = [
  {
    subId: 'c3', kindId: 'question-quel', label: 'Poser des questions avec quel',
    instruction: 'Posez une question sur l’information donnée à la fin de la phrase avec [[em]]quel, quelle, quels ou quelles[[/em]].',
    items: data.map(row => ({ prompt: row.prompt, answer: row.question })),
  },
  {
    subId: 'c3', kindId: 'question-quel-response', label: 'Répondre à la question avec quel',
    instruction: 'Répondez aux questions avec [[em]]quel, quelle, quels ou quelles[[/em]] par une phrase complète. Une réponse possible est proposée au corrigé.',
    items: data.map(row => ({ prompt: row.question, answer: row.reply })),
  },
]

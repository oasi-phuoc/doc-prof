import type { GramLesson } from './types'
import type { GramExerciseKindId } from './kinds'
import data from './question-open-transform-data.json'

export const OPEN_QUESTION_KIND_IDS = [
  'question-open-est-ce-que', 'question-open-inversion', 'question-open-response',
  'question-reading-ce', 'question-reading-write',
] as const satisfies readonly GramExerciseKindId[]

export const OPEN_QUESTION_LESSONS: GramLesson[] = [
  {
    subId: 'c2', kindId: 'question-open-est-ce-que', label: 'Pronom interrogatif + est-ce que',
    instruction: 'Posez une question sur l’information donnée à la fin de la phrase. Utilisez un [[em]]mot interrogatif et est-ce que[[/em]].',
    items: data.map(row => ({ prompt: row.prompt, answer: row.estce })),
  },
  {
    subId: 'c2', kindId: 'question-open-inversion', label: 'Pronom interrogatif + inversion',
    instruction: 'Posez une question sur l’information donnée à la fin de la phrase. Utilisez un [[em]]mot interrogatif et l’inversion[[/em]].',
    items: data.map(row => ({ prompt: row.prompt, answer: row.inversion })),
  },
  {
    subId: 'c2', kindId: 'question-open-response', label: 'Répondre à la question',
    instruction: 'Répondez à chaque question ouverte par une phrase complète. Une réponse possible est proposée au corrigé.',
    items: data.map((row, index) => ({ prompt: index % 2 ? row.inversion : row.estce, answer: row.reply })),
  },
]

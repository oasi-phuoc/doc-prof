import type { GramExerciseKindId } from './kinds'
import type { GramLesson } from './types'
import responses from './question-response-data.json'
import readings from './question-reading-data.json'

export const CLOSED_QUESTION_KIND_IDS = [
  'question-est-ce-que',
  'question-inversion',
  'response-affirmative',
  'response-negative',
  'question-reading-ce',
  'question-reading-write',
] as const satisfies readonly GramExerciseKindId[]

export const CLOSED_RESPONSE_LESSONS: GramLesson[] = [
  {
    subId: 'c1', kindId: 'response-affirmative', label: 'Réponse affirmative',
    instruction: 'Répondez [[em]]affirmativement[[/em]] à chaque question par une phrase complète.',
    items: responses.map(row => ({ prompt: row.prompt, answer: row.affirmative })),
  },
  {
    subId: 'c1', kindId: 'response-negative', label: 'Réponse négative',
    instruction: 'Répondez [[em]]négativement[[/em]] à chaque question par une phrase complète.',
    items: responses.map(row => ({ prompt: row.prompt, answer: row.negative })),
  },
]

export const CLOSED_QUESTION_READINGS = readings
export { QUESTION_READING_CAP as CLOSED_QUESTION_READING_CAP, buildClosedQuestionReading } from './question-reading'

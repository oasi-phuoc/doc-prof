import type { GramLesson } from './types'
import data from './question-transform-data.json'

export const QUESTION_TRANSFORM_LESSONS: GramLesson[] = [
  {
    subId: 'c1', kindId: 'question-est-ce-que', label: 'Poser des questions avec est-ce que',
    instruction: 'Posez des questions avec [[em]]est-ce que[[/em]].',
    items: data.map(row => ({ prompt: row.prompt, answer: row.estce })),
  },
  {
    subId: 'c1', kindId: 'question-inversion', label: 'Poser des questions avec l’inversion',
    instruction: 'Posez des questions avec l’[[em]]inversion[[/em]].',
    items: data.map(row => ({ prompt: row.prompt, answer: row.inversion })),
  },
]

import type { GramLesson } from '../types'
import { GRAM_LESSONS_PROTECTED } from './lessons-protected'
import { GRAM_LESSONS_REVISED } from './lessons-revised'

/** Les thèmes d’introduction gardent leurs types ; les autres banques sont remplacées. */
export const GRAM_LESSONS: GramLesson[] = [
  ...GRAM_LESSONS_PROTECTED,
  ...GRAM_LESSONS_REVISED,
]

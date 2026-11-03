import type { GramLesson } from '../types'
import { GRAM_LESSONS_PROTECTED } from './lessons-protected'
import { GRAM_LESSONS_REVISED } from './lessons-revised'
import { PRESENT_SUPPLEMENT_LESSONS } from '../present-supplement'
import { QUESTION_TRANSFORM_LESSONS } from '../question-transforms'
import { CLOSED_RESPONSE_LESSONS } from '../closed-questions'
import { OPEN_QUESTION_LESSONS } from '../open-questions'
import { QUEL_QUESTION_LESSONS } from '../quel-questions'

/** Les thèmes d’introduction gardent leurs types ; les autres banques sont remplacées. */
export const GRAM_LESSONS: GramLesson[] = [
  ...GRAM_LESSONS_PROTECTED,
  ...GRAM_LESSONS_REVISED.filter(lesson => !['c1', 'c2', 'c3'].includes(lesson.subId)),
  ...PRESENT_SUPPLEMENT_LESSONS,
  ...QUESTION_TRANSFORM_LESSONS,
  ...CLOSED_RESPONSE_LESSONS,
  ...OPEN_QUESTION_LESSONS,
  ...QUEL_QUESTION_LESSONS,
]

import type { GramLesson } from '../types'
import { GRAM_LESSONS_PROTECTED } from './lessons-protected'
import { GRAM_LESSONS_REVISED } from './lessons-revised'

/** Only notions not yet replaced by the graded base remain here. */
export const GRAM_LESSONS: GramLesson[] = [
  ...GRAM_LESSONS_PROTECTED,
  ...GRAM_LESSONS_REVISED.filter(lesson => !['c1', 'c2', 'c3'].includes(lesson.subId)),
]

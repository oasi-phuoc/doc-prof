import type { MathSubmoduleLesson } from "./math-a1-types";

import { MATH_A1_1_LESSON } from "./math-a1-1";
import { MATH_A1_2_LESSON } from "./math-a1-2";
import { MATH_A1_3_LESSON } from "./math-a1-3";
import { MATH_A1_4_LESSON } from "./math-a1-4";
import { MATH_A1_5_LESSON } from "./math-a1-5";

export const MATH_A1_LESSONS: MathSubmoduleLesson[] = [
  MATH_A1_1_LESSON,
  MATH_A1_2_LESSON,
  MATH_A1_3_LESSON,
  MATH_A1_4_LESSON,
  MATH_A1_5_LESSON,
];

export function getA1Lesson(submoduleId: string): MathSubmoduleLesson | undefined {
  return MATH_A1_LESSONS.find((l) => l.submoduleId === submoduleId);
}

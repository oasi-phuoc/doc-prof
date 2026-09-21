import type { MathSubmoduleLesson, MathRichBlock } from "./math-a1-types";
import { MATH_G9_1_LESSON } from "./math-g9-1";
import { MATH_G9_4_LESSON } from "./math-g9-4";
import { MATH_G9_5_LESSON } from "./math-g9-5";
import { MATH_G9_6_LESSON } from "./math-g9-6";
import { MATH_G9_7_LESSON } from "./math-g9-7";
import { MATH_G9_8_LESSON } from "./math-g9-8";
import { MATH_G9_9_LESSON } from "./math-g9-9";

function asG5(lesson: MathSubmoduleLesson, code: string, withExercises = true): MathSubmoduleLesson {
  const id = code.replace(/\./g, "-");
  return {
    ...lesson,
    submoduleId: id,
    submoduleCode: code,
    exercises: withExercises
      ? lesson.exercises.map((ex) => ({ ...ex, id: ex.id.replace(/^g9/i, "g5").replace(/^g8/i, "g5") }))
      : [],
    exercisePool: withExercises
      ? lesson.exercisePool?.map((ex) => ({ ...ex, id: ex.id.replace(/^g9/i, "g5").replace(/^g8/i, "g5") }))
      : undefined,
  };
}

const G5_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G5-4",
  submoduleCode: "G5.4",
  theory: {
    title: { fr: "Prisme et pyramide" },
    paragraphs: { fr: [] },
    blocks: [
      ...(MATH_G9_6_LESSON.theory.blocks ?? []),
      { type: "plain", fr: "" } as MathRichBlock,
      ...(MATH_G9_8_LESSON.theory.blocks ?? []),
    ],
  },
  exercises: [
    ...MATH_G9_6_LESSON.exercises.map((ex) => ({ ...ex, id: ex.id.replace(/^g9/i, "g5") })),
    ...MATH_G9_8_LESSON.exercises.map((ex) => ({ ...ex, id: ex.id.replace(/^g9/i, "g5") })),
  ],
};

export const MATH_G5_LESSONS: MathSubmoduleLesson[] = [
  asG5(MATH_G9_1_LESSON, "G5.1", false),
  asG5(MATH_G9_4_LESSON, "G5.2"),
  asG5(MATH_G9_5_LESSON, "G5.3"),
  G5_4_LESSON,
  asG5(MATH_G9_7_LESSON, "G5.5"),
  asG5(MATH_G9_9_LESSON, "G5.6"),
];

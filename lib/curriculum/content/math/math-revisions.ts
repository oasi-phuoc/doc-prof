import type { MathSubmoduleLesson } from "./math-a1-types";

const emptyTitle = (fr: string) => ({ fr });

function revStub(submoduleId: string, submoduleCode: string, titleFr: string, exerciseFr: string, answer: string): MathSubmoduleLesson {
  return {
    submoduleId,
    submoduleCode,
    theory: {
      title: emptyTitle(titleFr),
      blocks: [
        { type: "plain", fr: "Ce module de révision sera bientôt disponible." },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [
      { id: `${submoduleId}-e1`, promptFr: exerciseFr, type: "number", acceptable: [answer] },
    ],
    exercisePool: [],
    poolSize: 1,
  };
}

// ── Révisions géométrie (RG.1 – RG.10) ───────────────────────────────────────
export const MATH_RG_1_LESSON  = revStub("RG-1",  "RG.1",  "Révision G1",  "Un carré a combien de côtés ?",         "4");
export const MATH_RG_2_LESSON  = revStub("RG-2",  "RG.2",  "Révision G2",  "Combien de degrés dans un angle droit ?", "90");
export const MATH_RG_3_LESSON  = revStub("RG-3",  "RG.3",  "Révision G3",  "Périmètre d'un carré de côté 5 ?",      "20");
export const MATH_RG_4_LESSON  = revStub("RG-4",  "RG.4",  "Révision G4",  "Aire d'un carré de côté 4 ?",           "16");
export const MATH_RG_5_LESSON  = revStub("RG-5",  "RG.5",  "Révision G5",  "Dans un triangle rectangle, a²+b²= ?", "c2");
export const MATH_RG_6_LESSON  = revStub("RG-6",  "RG.6",  "Révision G6",  "Combien de degrés dans un triangle ?",  "180");
export const MATH_RG_7_LESSON  = revStub("RG-7",  "RG.7",  "Révision G7",  "Combien de faces a un cube ?",          "6");
export const MATH_RG_8_LESSON  = revStub("RG-8",  "RG.8",  "Révision G8",  "Volume d'un cube de côté 3 ?",          "27");
export const MATH_RG_9_LESSON  = revStub("RG-9",  "RG.9",  "Révision G9",  "Un graphique en bâtons montre quoi ?",  "données");
export const MATH_RG_10_LESSON = revStub("RG-10", "RG.10", "Révision G10", "sin(90°) = ?",                          "1");

export const MATH_RG_LESSONS: MathSubmoduleLesson[] = [
  MATH_RG_1_LESSON,  MATH_RG_2_LESSON,  MATH_RG_3_LESSON,  MATH_RG_4_LESSON,
  MATH_RG_5_LESSON,  MATH_RG_6_LESSON,  MATH_RG_7_LESSON,  MATH_RG_8_LESSON,
  MATH_RG_9_LESSON,  MATH_RG_10_LESSON,
];

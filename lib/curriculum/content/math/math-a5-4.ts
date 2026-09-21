import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "A5-4",
    submoduleCode: "A5.4",
    theory: {
      title: { fr: "Addition et soustraction de décimaux",},
      blocks: [
        {
          type: "add_sub_toggle_cards",
          addColLabels: ["D", "U", ",", "dx"],
          addA: [5, 7, null, 9],
          addB: [null, 2, null, 4],
          addSteps: [
            {
              numFr: "1. On pose les nombres",
              textsFr: ["Aligner les virgules. Dixièmes sous dixièmes, unités sous unités."],
              carries: [null, null, null, null],
              result:  [null, null, null, null],
            },
            {
              numFr: "2. Dixièmes : 9 + 4 = 13",
              textsFr: ["9 + 4 = 13 → pose 3, retient 1"],
              carries: [null, 1, null, null],
              result:  [null, null, null, 3],
            },
            {
              numFr: "3. Unités : 1 + 7 + 2 = 10",
              textsFr: ["1 (retenue) + 7 + 2 = 10 → pose 0, retient 1"],
              carries: [1, null, null, null],
              result:  [null, 0, null, 3],
            },
            {
              numFr: "4. Dizaines : 1 + 5 = 6",
              textsFr: ["1 (retenue) + 5 = 6 → pose 6", "Résultat : 57,9 + 2,4 = 60,3"],
              carries: [null, null, null, null],
              result:  [6, 0, null, 3],
            },
          ],
          addNoteFr: "",
          subColLabels: ["D", "U", ",", "dx"],
          subA: [1, 4, null, 3],
          subB: [null, 5, null, 8],
          subSteps: [
            {
              numFr: "1. On pose les nombres",
              textsFr: ["Aligner les virgules. Dixièmes sous dixièmes, unités sous unités."],
              carries: [null, null, null, null],
              result:  [null, null, null, null],
            },
            {
              numFr: "2. Dixièmes : 3 − 8 impossible → emprunter",
              textsFr: [
                "3 − 8 impossible → emprunter 1 à l'unité.",
                "L'unité est réduite : 4 − 1 = 3. Les dixièmes deviennent **13**.",
                "**13** − 8 = 5 → pose 5.",
              ],
              carries: [null, 1, null, null],
              result:  [null, null, null, 5],
              aDisplay: [null, null, null, "13"],
            },
            {
              numFr: "3. Unités : 3 − 5 impossible → emprunter",
              textsFr: [
                "(4 − 1) = 3. 3 − 5 impossible → emprunter 1 à la dizaine.",
                "La dizaine est réduite : 1 − 1 = 0. Les unités deviennent 13.",
                "13 − 5 = 8 → pose 8.",
              ],
              carries: [1, 1, null, null],
              result:  [null, 8, null, 5],
            },
            {
              numFr: "4. Dizaines : (1 − 1) − 0 = 0",
              textsFr: [
                "1 − 1 (emprunt) = 0. 0 − 0 = 0 → pose 0.",
                "Résultat : 14,3 − 5,8 = 8,5",
              ],
              carries: [1, 1, null, null],
              result:  [0, 8, null, 5],
            },
          ],
          subNoteFr: "",
        },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [],
    exercisePool: [],
    poolSize: 5,
  };

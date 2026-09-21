import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A3_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "A3-4",
  submoduleCode: "A3.4",
  theory: {
    title: {
      fr: "Division en colonnes",
    },
    blocks: [
      {
        type: "plain",
        fr: "La division en colonne permet de diviser de grands nombres en organisant les calculs étape par étape.",
      },
      { type: "highlight", fr: "Principe" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On divise les chiffres du dividende de gauche à droite.",
          "À chaque étape : on cherche combien de fois le diviseur entre dans la valeur courante.",
          "On soustrait le produit et on abaisse le chiffre suivant.",
          "**Rappel :** dividende = diviseur × quotient + reste  (reste < diviseur)",
        ],
      },
      { type: "heading", fr: "Division à 1 chiffre", black: true },
      { type: "highlight", fr: "6 385 ÷ 4" },
      {
        type: "div_step_cards",
        dividend: 6385,
        divisor: 4,
        steps: [
          {
            numFr: "1. On pose les nombres",
            textsFr: [
              "On écrit le dividende 6 385 et le diviseur 4.",
              "On réserve la zone à droite pour le quotient.",
            ],
            stepsComplete: 0,
          },
          {
            numFr: "2. Milliers : 6 ÷ 4 = 1, reste 2",
            textsFr: [
              "6 ÷ 4 = 1 → on écrit 1 dans le quotient.",
              "1 × 4 = 4 → on soustrait : 6 − 4 = 2.",
            ],
            stepsComplete: 1,
          },
          {
            numFr: "3. Centaines : 23 ÷ 4 = 5, reste 3",
            textsFr: [
              "On abaisse le 3 : reste 2 → 23.",
              "23 ÷ 4 = 5 → on écrit 5 dans le quotient.",
              "5 × 4 = 20 → on soustrait : 23 − 20 = 3.",
            ],
            stepsComplete: 2,
          },
          {
            numFr: "4. Dizaines : 38 ÷ 4 = 9, reste 2",
            textsFr: [
              "On abaisse le 8 : reste 3 → 38.",
              "38 ÷ 4 = 9 → on écrit 9 dans le quotient.",
              "9 × 4 = 36 → on soustrait : 38 − 36 = 2.",
            ],
            stepsComplete: 3,
          },
          {
            numFr: "5. Unités : 25 ÷ 4 = 6, reste 1",
            textsFr: [
              "On abaisse le 5 : reste 2 → 25.",
              "25 ÷ 4 = 6 → on écrit 6 dans le quotient.",
              "6 × 4 = 24 → on soustrait : 25 − 24 = 1.",
              "Le reste 1 < 4 (diviseur) → on a terminé.",
              "6 385 ÷ 4 = 1 596, reste 1",
            ],
            stepsComplete: 4,
          },
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

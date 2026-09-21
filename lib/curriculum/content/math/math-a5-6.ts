import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_6_LESSON: MathSubmoduleLesson = {
    submoduleId: "A5-6",
    submoduleCode: "A5.6",
    theory: {
      title: { fr: "Division de décimaux",},
      blocks: [
        { type: "heading", fr: "Vocabulaire", black: true },
        {
          type: "table",
          headersFr: ["Terme", "Rôle", "Exemple"],
          accentHeader: true,
          rows: [
            ["dividende", "le nombre qu'on divise",          "82,5"],
            ["diviseur",  "le nombre par lequel on divise",  "6"],
            ["quotient",  "le résultat",                     "13,75"],
          ],
        },
        { type: "note", fr: "On ne peut PAS échanger dividende et diviseur : 82,5 ÷ 6 ≠ 6 ÷ 82,5" },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Méthode en 3 étapes", black: true },
        {
          type: "section", labelFr: "", itemsFr: [
            "1. Multiplier le dividende pour supprimer la virgule (× 10, × 100…).",
            "2. Diviser comme des entiers.",
            "3. Diviser le quotient par le même facteur → replacer la virgule.",
          ],
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Vérification", black: true },
        {
          type: "section", labelFr: "", itemsFr: [
            "quotient × diviseur = dividende",
            "13,75 × 6 = 82,5 ✓",
          ],
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Astuces pour diviser", black: true },
        {
          type: "table",
          headersFr: ["Diviseur", "Astuce", "Exemple"],
          accentHeader: true,
          rows: [
            ["÷ 0,5",   "× 2",     "20 ÷ 0,5 = 40"],
            ["÷ 0,25",  "× 4",     "20 ÷ 0,25 = 80"],
            ["÷ 0,2",   "× 5",     "7 ÷ 0,2 = 35"],
            ["÷ 0,125", "× 8",     "3 ÷ 0,125 = 24"],
            ["÷ 0,1",   "× 10",    "5 ÷ 0,1 = 50"],
            ["÷ 0,01",  "× 100",   "5 ÷ 0,01 = 500"],
            ["÷ 0,001", "× 1 000", "5 ÷ 0,001 = 5 000"],
          ],
        },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [],
    exercisePool: [],
    poolSize: 5,
  };

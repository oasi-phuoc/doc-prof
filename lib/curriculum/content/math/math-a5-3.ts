import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "A5-3",
    submoduleCode: "A5.3",
    theory: {
      title: { fr: "Arrondir les décimaux",},
      blocks: [
        { type: "heading", fr: "Comment arrondir", black: true },
        { type: "plain", fr: "**1.** Repérer la **position d'arrondi** (unité, dixième, centième…)." },
        { type: "plain", fr: "**2.** Regarder le chiffre **juste après** cette position." },
        {
          type: "section", labelFr: "", itemsFr: [
            "Chiffre **≥ 5** → arrondir vers le **HAUT** (augmenter d'un)",
            "Chiffre **< 5** → arrondir vers le **BAS** (laisser tel quel)",
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "table",
          headersFr: ["Nombre", "Arrondi à", "Chiffre suivant", "Résultat"],
          accentHeader: true,
          rows: [
            ["3,47",  "dixième",  "7 ≥ 5", "→ 3,5"],
            ["3,42",  "dixième",  "2 < 5", "→ 3,4"],
            ["3,479", "centième", "9 ≥ 5", "→ 3,48"],
            ["12,5",  "unité",    "5 ≥ 5", "→ 13"],
            ["12,45", "unité",    "4 < 5", "→ 12"],
          ],
        },
        { type: "highlight", fr: "Astuce" },
        {
          type: "section", labelFr: "", itemsFr: [
            "Après l'arrondi, on supprime les chiffres après la position arrondie.",
          ],
        },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [
      { id: "a5-3-e1", promptFr: "Arrondissez 3,47 au dixième.", type: "short_text", acceptable: ["3,5", "3.5"] },
      { id: "a5-3-e2", promptFr: "Arrondissez 3,42 au dixième.", type: "short_text", acceptable: ["3,4", "3.4"] },
      { id: "a5-3-e3", promptFr: "Arrondissez 5,678 au centième.", type: "short_text", acceptable: ["5,68", "5.68"] },
      { id: "a5-3-e4", promptFr: "Arrondissez 12,351 à l'unité.", type: "number", acceptable: ["12"] },
      { id: "a5-3-e5", promptFr: "Arrondissez 9,95 au dixième.", type: "short_text", acceptable: ["10,0", "10"] },
    ],
  };

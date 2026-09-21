import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_5_LESSON: MathSubmoduleLesson = {
    submoduleId: "G7-5",
    submoduleCode: "G7.5",
    theory: {
      title: {
        fr: "Agrandir et réduire",
      },
      paragraphs: {
        fr: [
          "Agrandir une figure : multiplier toutes ses dimensions par un facteur k > 1. Réduire : multiplier par 0 < k < 1.",
          "Les angles sont conservés. Les longueurs sont multipliées par k. Les aires sont multipliées par k².",
          "Exemple : agrandir une photo 10 cm × 15 cm avec k = 2 → photo 20 cm × 30 cm. Aire : 150 cm² → 600 cm² (× 4 = k²).",
          "En pratique : photocopieuse (%, ex. 150% = agrandir × 1,5 ; 75% = réduire × 0,75).",
        ],
      },
    },
    exercises: [
      { id: "g6-5-e1", promptFr: "k = 3. Côté 4 cm → côté image = ?", type: "number", acceptable: ["12"] },
      { id: "g6-5-e2", promptFr: "k = 0,5. Côté 10 cm → côté image = ?", type: "number", acceptable: ["5"] },
      { id: "g6-5-e3", promptFr: "k = 2. Aire = 9 cm² → aire image = ?", type: "number", acceptable: ["36"] },
      { id: "g6-5-e4", promptFr: "Photocopie à 200%. k = ?", type: "number", acceptable: ["2"] },
      { id: "g6-5-e5", promptFr: "k = 4. Les angles sont-ils conservés ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    ],
  };

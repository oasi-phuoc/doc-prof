import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_7_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-7",
    submoduleCode: "G6.7",
    theory: {
      title: {
        fr: "Homothétie et longueurs",
      },
      paragraphs: {
        fr: [
          "Deux figures semblables ont la même forme mais pas nécessairement la même taille. Elles sont reliées par une homothétie.",
          "Coefficient de similitude k : rapport des longueurs correspondantes. k = longueur image / longueur originale.",
          "Rapport des périmètres : k. Rapport des aires : k². Exemple : k = 3 → périmètres × 3, aires × 9.",
          "Application : plans et maquettes (k < 1 pour une réduction, k > 1 pour un agrandissement).",
        ],
      },
    },
    exercises: [
      { id: "g6-7-e1", promptFr: "Deux figures semblables, k = 4. Un côté de 3 cm → côté image = ?", type: "number", acceptable: ["12"] },
      { id: "g6-7-e2", promptFr: "k = 3. Rapport des aires = ?", type: "number", acceptable: ["9"] },
      { id: "g6-7-e3", promptFr: "k = 2. Périmètre original = 10 cm. Périmètre image = ?", type: "number", acceptable: ["20"] },
      { id: "g6-7-e4", promptFr: "k = 1/3. Un côté de 9 cm → côté image = ?", type: "number", acceptable: ["3"] },
      { id: "g6-7-e5", promptFr: "k = 2. Aire originale = 8 cm². Aire image = ?", type: "number", acceptable: ["32"] },
    ],
  };

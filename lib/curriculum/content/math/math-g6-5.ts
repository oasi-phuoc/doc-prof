import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_5_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-5",
    submoduleCode: "G6.5",
    theory: {
      title: {
        fr: "Homothétie",
      },
      paragraphs: {
        fr: [
          "Une homothétie de centre O et de rapport k associe à chaque point M le point M' tel que OM' = k × OM (sur la même droite).",
          "Si k > 1 : agrandissement. Si 0 < k < 1 : réduction. Si k < 0 : agrandissement avec retournement.",
          "Propriétés : les angles sont conservés, les longueurs sont multipliées par |k|, les aires par k².",
          "Exemple : homothétie de rapport 2 double toutes les distances au centre. Les figures sont semblables.",
        ],
      },
    },
    exercises: [
      { id: "g6-5-e1", promptFr: "Homothétie de rapport 3 : un segment de 4 cm devient ?", type: "number", acceptable: ["12"] },
      { id: "g6-5-e2", promptFr: "Homothétie de rapport 1/2 : un segment de 8 cm devient ?", type: "number", acceptable: ["4"] },
      { id: "g6-5-e3", promptFr: "Homothétie de rapport 2 : une aire de 5 cm² devient ?", type: "number", acceptable: ["20"] },
      { id: "g6-5-e4", promptFr: "L'homothétie conserve-t-elle les angles ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-5-e5", promptFr: "Un rapport k = 1 laisse la figure identique ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    ],
  };

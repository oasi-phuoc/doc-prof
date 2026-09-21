import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "G7-1",
    submoduleCode: "G7.1",
    theory: {
      title: {
        fr: "Notion d'échelle",
      },
      paragraphs: {
        fr: [
          "Une échelle est le rapport entre la mesure sur un plan (ou une carte) et la mesure réelle. Échelle = distance dessinée / distance réelle.",
          "Exemple : échelle 1:100 signifie que 1 cm sur le plan correspond à 100 cm = 1 m en réalité.",
          "Une carte à l'échelle 1:50 000 signifie que 1 cm représente 50 000 cm = 500 m = 0,5 km.",
          "Échelle de réduction : échelle < 1 (ex. plan de maison). Échelle d'agrandissement : échelle > 1 (ex. plan de cellule biologique).",
        ],
      },
    },
    exercises: [
      { id: "g6-1-e1", promptFr: "Échelle 1:100. 3 cm sur le plan = combien de cm en réalité ?", type: "number", acceptable: ["300"] },
      { id: "g6-1-e2", promptFr: "Échelle 1:1000. 5 cm sur la carte = combien de m en réalité ?", type: "number", acceptable: ["50"] },
      { id: "g6-1-e3", promptFr: "Quelle est la signification de l'échelle 1:200 ?", type: "short_text", acceptable: ["1 cm = 200 cm", "1 cm = 2 m"] },
      { id: "g6-1-e4", promptFr: "Une échelle de 1:50 est-elle un agrandissement ou une réduction ?", type: "short_text", acceptable: ["réduction", "reduction"] },
      { id: "g6-1-e5", promptFr: "Échelle 1:500. 4 cm sur le plan = ? m en réalité.", type: "number", acceptable: ["20"] },
    ],
  };

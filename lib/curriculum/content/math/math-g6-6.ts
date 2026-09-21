import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_6_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-6",
    submoduleCode: "G6.6",
    theory: {
      title: {
        fr: "Isométries",
      },
      paragraphs: {
        fr: [
          "Une isométrie est une transformation qui conserve les distances (et donc aussi les angles et les aires). Les figures originale et image sont congruentes (superposables).",
          "Les quatre isométries du plan : translation, rotation, réflexion (symétrie axiale), symétrie glissante (composition d'une réflexion et d'une translation).",
          "Isométries directes (conservent l'orientation) : translation, rotation. Isométries indirectes (inversent l'orientation) : réflexion, symétrie glissante.",
          "L'homothétie (avec k ≠ ±1) n'est PAS une isométrie car elle modifie les distances.",
        ],
      },
    },
    exercises: [
      { id: "g6-6-e1", promptFr: "La translation est-elle une isométrie ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-6-e2", promptFr: "L'homothétie de rapport 2 est-elle une isométrie ? (oui/non)", type: "short_text", acceptable: ["non"] },
      { id: "g6-6-e3", promptFr: "Cite deux isométries directes.", type: "short_text", acceptable: ["translation et rotation", "rotation et translation"] },
      { id: "g6-6-e4", promptFr: "Une isométrie conserve-t-elle les aires ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-6-e5", promptFr: "Combien d'isométries du plan existe-t-il (types fondamentaux) ?", type: "number", acceptable: ["4"] },
    ],
  };

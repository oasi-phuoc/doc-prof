import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-4",
    submoduleCode: "G6.4",
    theory: {
      title: {
        fr: "Rotation",
      },
      paragraphs: {
        fr: [
          "Une rotation de centre O et d'angle α fait tourner chaque point M autour de O d'un angle α (dans le sens positif = antihoraire).",
          "Propriétés : conservation des distances, des angles et des aires. O est le seul point fixe.",
          "Cas particuliers : rotation de 90° (quart de tour) ; 180° (demi-tour = symétrie centrale) ; 360° (tour complet = identité).",
          "Construction : pour une rotation de 90° antihoraire autour de O, le point (x, y) devient (−y, x).",
        ],
      },
    },
    exercises: [
      { id: "g6-4-e1", promptFr: "La rotation conserve-t-elle les distances ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-4-e2", promptFr: "Une rotation de 360° ramène la figure à sa position initiale ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-4-e3", promptFr: "Rotation de 90° antihoraire : le point (3 ; 0) devient ?", type: "short_text", acceptable: ["(0;3)", "(0 ; 3)"] },
      { id: "g6-4-e4", promptFr: "Une rotation de 180° est équivalente à quelle transformation ?", type: "short_text", acceptable: ["symétrie centrale"] },
      { id: "g6-4-e5", promptFr: "Après une rotation, la figure est-elle de même taille ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    ],
  };

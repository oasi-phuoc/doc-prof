import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-3",
    submoduleCode: "G6.3",
    theory: {
      title: {
        fr: "Translation",
      },
      paragraphs: {
        fr: [
          "Une translation est un déplacement de toute la figure dans une direction et d'une distance fixées, sans rotation ni réflexion.",
          "Elle est définie par un vecteur de translation → v = (a ; b). Chaque point M(x, y) devient M'(x+a, y+b).",
          "Propriétés : conservation des distances, des angles et des aires. Les segments MM' sont tous parallèles et de même longueur.",
          "Exemple : translation de vecteur (3 ; −2) : le point (1, 4) devient (1+3, 4+(−2)) = (4, 2).",
        ],
      },
    },
    exercises: [
      { id: "g6-3-e1", promptFr: "Translation de vecteur (2 ; 3). Point (1 ; 1) → ?", type: "short_text", acceptable: ["(3;4)", "(3 ; 4)"] },
      { id: "g6-3-e2", promptFr: "Translation de vecteur (−1 ; 4). Point (5 ; 2) → x-coordonnée = ?", type: "number", acceptable: ["4"] },
      { id: "g6-3-e3", promptFr: "La translation conserve-t-elle les distances ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g6-3-e4", promptFr: "Translation de vecteur (0 ; 5). Le point (3 ; 2) devient (3 ; ?)", type: "number", acceptable: ["7"] },
      { id: "g6-3-e5", promptFr: "Après une translation, la figure image est-elle de même taille ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    ],
  };

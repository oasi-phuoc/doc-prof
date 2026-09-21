import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-1",
    submoduleCode: "G6.1",
    theory: {
      title: {
        fr: "Symétrie axiale",
      },
      paragraphs: {
        fr: [
          "La symétrie axiale (ou réflexion) est une transformation qui associe à chaque point M son symétrique M' par rapport à un axe d, tel que d est la médiatrice de [MM'].",
          "Propriétés : conservation des distances, des angles et des aires. La figure image est le miroir de la figure originale.",
          "Construction : pour trouver le symétrique d'un point M par rapport à une droite d, tracer la perpendiculaire de M à d et reporter la même distance de l'autre côté.",
          "Applications : papier plié, figures décoratives, architecture.",
        ],
      },
    },
    exercises: [
      { id: "g5-1-e1", promptFr: "La symétrie axiale conserve-t-elle les distances ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g5-1-e2", promptFr: "Le symétrique du point (3 ; 2) par rapport à l'axe y est le point (? ; 2).", type: "number", acceptable: ["-3", "−3"] },
      { id: "g5-1-e3", promptFr: "Le symétrique du point (4 ; 5) par rapport à l'axe x est le point (4 ; ?).", type: "number", acceptable: ["-5", "−5"] },
      { id: "g5-1-e4", promptFr: "Une figure et son image par symétrie axiale ont-elles la même aire ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g5-1-e5", promptFr: "Quelle est la figure qui est son propre symétrique par rapport à un axe ?", type: "short_text", acceptable: ["figure symétrique", "figure avec axe de symétrie"] },
    ],
  };

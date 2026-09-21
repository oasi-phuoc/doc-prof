import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "G6-2",
    submoduleCode: "G6.2",
    theory: {
      title: {
        fr: "Symétrie centrale",
      },
      paragraphs: {
        fr: [
          "La symétrie centrale de centre O associe à chaque point M son image M' telle que O est le milieu de [MM']. On effectue une rotation de 180° autour de O.",
          "Propriétés : conservation des distances, des angles et des aires. Le centre O est le milieu de chaque segment [MM'].",
          "Construction : tracer la droite OM, reporter OM de l'autre côté de O pour obtenir M'.",
          "Figures ayant un centre de symétrie : parallélogramme, rectangle, losange, carré, cercle. Pas le triangle (en général).",
        ],
      },
    },
    exercises: [
      { id: "g5-2-e1", promptFr: "La symétrie centrale conserve-t-elle les longueurs ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g5-2-e2", promptFr: "Le symétrique du point (2 ; 3) par rapport à O(0,0) est le point (? ; ?).", type: "short_text", acceptable: ["(-2;-3)", "(−2;−3)", "-2,-3"] },
      { id: "g5-2-e3", promptFr: "Un triangle a-t-il généralement un centre de symétrie ? (oui/non)", type: "short_text", acceptable: ["non"] },
      { id: "g5-2-e4", promptFr: "Un parallélogramme a-t-il un centre de symétrie ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g5-2-e5", promptFr: "La symétrie centrale est équivalente à une rotation de combien de degrés ?", type: "number", acceptable: ["180"] },
    ],
  };

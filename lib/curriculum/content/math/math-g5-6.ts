import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_6_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-6",
    submoduleCode: "G5.6",
    theory: {
      title: {
        fr: "Médiatrice et bissectrice",
      },
      paragraphs: {
        fr: [
          "La médiatrice d'un segment [AB] est la droite perpendiculaire à [AB] passant par son milieu. Tout point de la médiatrice est équidistant de A et de B.",
          "Construction de la médiatrice : tracer deux arcs de même rayon (> AB/2) depuis A et B. La droite passant par leurs intersections est la médiatrice.",
          "La bissectrice d'un angle est la demi-droite qui partage l'angle en deux angles égaux. Tout point de la bissectrice est équidistant des deux côtés de l'angle.",
          "Construction de la bissectrice : tracer un arc depuis le sommet, puis deux arcs de même rayon depuis les intersections sur les côtés.",
        ],
      },
    },
    exercises: [
      { id: "g4-6-e1", promptFr: "La médiatrice de [AB] passe par le milieu de AB ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-6-e2", promptFr: "Un point sur la médiatrice de [AB] est-il équidistant de A et B ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-6-e3", promptFr: "La bissectrice d'un angle de 80° crée deux angles de combien de degrés ?", type: "number", acceptable: ["40"] },
      { id: "g4-6-e4", promptFr: "La médiatrice est-elle perpendiculaire au segment ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-6-e5", promptFr: "Pour construire la médiatrice, quel outil est indispensable ?", type: "short_text", acceptable: ["compas"] },
    ],
  };

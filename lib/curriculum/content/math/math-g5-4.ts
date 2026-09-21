import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-4",
    submoduleCode: "G5.4",
    theory: {
      title: {
        fr: "Carré, rectangle, losange",
      },
      paragraphs: {
        fr: [
          "Construction d'un rectangle ABCD de longueur L et largeur l : (1) tracer AB = L ; (2) tracer des perpendiculaires en A et B ; (3) reporter l sur chaque perpendiculaire pour obtenir D et C ; (4) tracer DC.",
          "Construction d'un carré : même méthode avec L = l, ou utiliser le compas pour reporter la longueur.",
          "Construction d'un losange de côté a et diagonale d₁ : tracer d₁, puis tracer deux arcs de rayon a depuis chaque extrémité.",
          "Vérification : un rectangle a 4 angles droits ; un losange a 4 côtés égaux.",
        ],
      },
    },
    exercises: [
      { id: "g4-4-e1", promptFr: "Pour construire un rectangle, combien d'angles droits doit-on tracer ?", type: "number", acceptable: ["4"] },
      { id: "g4-4-e2", promptFr: "Un losange a tous ses côtés égaux ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-4-e3", promptFr: "Quel outil utilise-t-on pour tracer les perpendiculaires dans la construction d'un rectangle ?", type: "short_text", acceptable: ["équerre", "equerre"] },
      { id: "g4-4-e4", promptFr: "Un carré est-il un losange ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-4-e5", promptFr: "Pour un losange de côté 5 cm, tous les côtés mesurent ?", type: "number", acceptable: ["5"] },
    ],
  };

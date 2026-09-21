import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-3",
    submoduleCode: "G5.3",
    theory: {
      title: {
        fr: "Construction de triangles",
      },
      paragraphs: {
        fr: [
          "On peut construire un triangle de différentes façons selon les éléments connus : CCC (trois côtés), CAC (deux côtés et angle compris), ACA (deux angles et côté).",
          "Méthode CCC (SSS) : tracer un côté BC, puis tracer un arc de rayon AB centré en B et un arc de rayon AC centré en C. Leur intersection est A.",
          "Vérification de l'existence : un triangle existe si et seulement si la somme de deux côtés quelconques est supérieure au troisième (inégalité triangulaire).",
          "Triangle rectangle : l'angle droit peut être construit avec l'équerre.",
        ],
      },
    },
    exercises: [
      { id: "g4-3-e1", promptFr: "Peut-on construire un triangle de côtés 3, 4, 5 cm ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-3-e2", promptFr: "Peut-on construire un triangle de côtés 2, 3, 7 cm ? (oui/non)", type: "short_text", acceptable: ["non"] },
      { id: "g4-3-e3", promptFr: "Combien de triangles différents peut-on construire connaissant les 3 côtés ? (0/1/plusieurs)", type: "short_text", acceptable: ["1"] },
      { id: "g4-3-e4", promptFr: "Quel outil utilise-t-on pour reporter une longueur lors d'une construction ?", type: "short_text", acceptable: ["compas"] },
      { id: "g4-3-e5", promptFr: "Un triangle équilatéral de côté 5 cm : tous les côtés mesurent ?", type: "number", acceptable: ["5"] },
    ],
  };

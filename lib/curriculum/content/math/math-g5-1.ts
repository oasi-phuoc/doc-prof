import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-1",
    submoduleCode: "G5.1",
    theory: {
      title: {
        fr: "Outils de construction : règle, compas, équerre",
      },
      paragraphs: {
        fr: [
          "En géométrie euclidienne, les constructions se font à la règle (droites) et au compas (cercles, distances). L'équerre permet de tracer des angles droits.",
          "Règle : tracer un segment ou une droite, mesurer une longueur. Le rapporteur mesure des angles.",
          "Compas : tracer un cercle ou un arc de cercle d'un rayon donné, reporter une longueur.",
          "Bonnes pratiques : travailler au crayon, tracer des traits fins, garder les constructions intermédiaires visibles.",
        ],
      },
    },
    exercises: [
      { id: "g4-1-e1", promptFr: "Quel outil utilise-t-on pour tracer un angle droit précis ?", type: "short_text", acceptable: ["équerre", "equerre"] },
      { id: "g4-1-e2", promptFr: "Quel outil sert à tracer un cercle ?", type: "short_text", acceptable: ["compas"] },
      { id: "g4-1-e3", promptFr: "Quel outil mesure les angles ?", type: "short_text", acceptable: ["rapporteur"] },
      { id: "g4-1-e4", promptFr: "En combien de degrés est gradué un rapporteur standard ?", type: "number", acceptable: ["180"] },
      { id: "g4-1-e5", promptFr: "Pour tracer une droite on utilise une ___.", type: "short_text", acceptable: ["règle", "regle"] },
    ],
  };

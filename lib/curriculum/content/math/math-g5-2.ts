import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-2",
    submoduleCode: "G5.2",
    theory: {
      title: {
        fr: "Droites perpendiculaires et parallèles",
      },
      paragraphs: {
        fr: [
          "Deux droites sont perpendiculaires si elles se coupent à angle droit (90°). Notation : d₁ ⊥ d₂.",
          "Deux droites sont parallèles si elles ne se coupent jamais (même direction). Notation : d₁ ∥ d₂.",
          "Construction d'une perpendiculaire à une droite par un point : utiliser l'équerre en la faisant glisser le long d'une règle.",
          "Construction d'une parallèle : même technique — deux équerres ou règle + équerre.",
        ],
      },
    },
    exercises: [
      { id: "g4-2-e1", promptFr: "Deux droites se coupent à 90°. Sont-elles perpendiculaires ou parallèles ?", type: "short_text", acceptable: ["perpendiculaires"] },
      { id: "g4-2-e2", promptFr: "Deux droites ne se croisent jamais. Sont-elles perpendiculaires ou parallèles ?", type: "short_text", acceptable: ["parallèles", "paralleles"] },
      { id: "g4-2-e3", promptFr: "Dans un carré, les côtés opposés sont-ils parallèles ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-2-e4", promptFr: "Dans un carré, les côtés adjacents sont-ils perpendiculaires ? (oui/non)", type: "short_text", acceptable: ["oui"] },
      { id: "g4-2-e5", promptFr: "Quel symbole désigne des droites perpendiculaires ?", type: "short_text", acceptable: ["⊥"] },
    ],
  };

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G7-4",
  submoduleCode: "G7.4",
  theory: {
    title: { fr: "Translation" },
    blocks: [
      { type: "heading", fr: "Vecteur de translation", black: true },
      {
        type: "plain",
        fr: "Une translation déplace toute la figure dans une **direction** et d'une **distance** fixées, sans rotation ni retournement.",
      },
      { type: "highlight", fr: "Définition" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Elle est définie par un **vecteur** →v = (a ; b).",
          "Chaque point M(x ; y) a pour image M'(**x + a** ; **y + b**).",
          "Sur le quadrillage, la flèche bleue indique le sens et la longueur du vecteur.",
        ],
      },
      { type: "highlight", fr: "Propriétés" },
      {
        type: "bullets",
        itemsFr: [
          "Conservation des **distances**, des **angles** et des **aires**",
          "Les segments [MM'] sont tous **parallèles** et de **même longueur**",
          "La figure image a la **même taille** et la **même orientation**",
        ],
      },
      {
        type: "note",
        fr: "Exercice : une figure est donnée. Reproduisez son image en suivant la flèche bleue (vecteur de translation).",
      },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [],
};

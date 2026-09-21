import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G7-4",
  submoduleCode: "G7.4",
  theory: {
    title: { fr: "Translation" },
    blocks: [
      { type: "heading", fr: "Déplacer sans tourner", black: true },
      {
        type: "plain",
        fr: "Une **translation** déplace toute la figure dans une direction et d'une distance fixées, **sans rotation ni réflexion**.",
      },
      { type: "highlight", fr: "Vecteur de translation" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Elle est définie par un vecteur →v = (a ; b).",
          "Chaque point M(x ; y) devient M'(x+a ; y+b).",
          "Exemple : vecteur (3 ; −2) : le point (1 ; 4) devient (4 ; 2).",
        ],
      },
      { type: "highlight", fr: "Propriétés" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Conservation des **distances**, des **angles** et des **aires**.",
          "Les segments [MM'] sont tous **parallèles** et de **même longueur**.",
          "La figure image a la **même taille** et la **même orientation**.",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [
    { id: "g7-4-e1", promptFr: "Translation de vecteur (2 ; 3). Point (1 ; 1) → ?", type: "short_text", acceptable: ["(3;4)", "(3 ; 4)"] },
    { id: "g7-4-e2", promptFr: "Translation de vecteur (−1 ; 4). Point (5 ; 2) → x-coordonnée = ?", type: "number", acceptable: ["4"] },
    { id: "g7-4-e3", promptFr: "La translation conserve-t-elle les distances ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    { id: "g7-4-e4", promptFr: "Translation de vecteur (0 ; 5). Le point (3 ; 2) devient (3 ; ?)", type: "number", acceptable: ["7"] },
    { id: "g7-4-e5", promptFr: "Après une translation, la figure image est-elle de même taille ? (oui/non)", type: "short_text", acceptable: ["oui"] },
  ],
};

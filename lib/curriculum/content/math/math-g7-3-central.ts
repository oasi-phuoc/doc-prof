import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "G7-3",
  submoduleCode: "G7.3",
  theory: {
    title: { fr: "Symétrie centrale" },
    blocks: [
      { type: "heading", fr: "Centre de symétrie", black: true },
      {
        type: "plain",
        fr: "La **symétrie centrale** de centre O associe à chaque point M son image M' telle que **O est le milieu** de [MM']. C'est une rotation de **180°** autour de O.",
      },
      { type: "highlight", fr: "Propriétés" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Conservation des **distances**, des **angles** et des **aires**.",
          "Le centre O est le milieu de chaque segment [MM'].",
          "Les figures originale et image sont **superposables** par un demi-tour.",
        ],
      },
      { type: "highlight", fr: "Construction" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Tracer la droite (OM).",
          "Reporter la longueur OM de l'autre côté de O pour obtenir M'.",
          "Sur un quadrillage : si O est l'origine, (x ; y) → (−x ; −y).",
        ],
      },
      { type: "highlight", fr: "Figures avec un centre de symétrie" },
      {
        type: "bullets",
        itemsFr: [
          "Parallélogramme, rectangle, losange, carré, cercle",
          "Pas le triangle en général",
        ],
      },
      {
        type: "note",
        fr: "Exercice : complétez la figure par symétrie centrale autour du point bleu O. Un exemple en pointillés montre M et M'. Cliquez deux intersections pour tracer un segment.",
      },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [],
};

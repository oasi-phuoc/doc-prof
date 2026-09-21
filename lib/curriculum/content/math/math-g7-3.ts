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
        fr: "La symétrie centrale de centre O associe à chaque point M son image M' telle que **O est le milieu** du segment [MM']. C'est une rotation de **180°** autour de O.",
      },
      { type: "highlight", fr: "Construire l'image" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Repérer le **centre O** (point bleu sur le quadrillage).",
          "Pour un point M, tracer la droite (OM) et reporter la même distance de l'autre côté de O → on obtient M'.",
          "Sur le quadrillage : si O = (10 ; 10) et M = (x ; y), alors M' = (**20 − x** ; **20 − y**).",
        ],
      },
      { type: "highlight", fr: "Propriétés" },
      {
        type: "bullets",
        itemsFr: [
          "Conservation des **distances**, des **angles** et des **aires**",
          "Les segments [MM'] passent tous par O (O milieu)",
          "Équivalente à une **rotation de 180°**",
        ],
      },
      {
        type: "note",
        fr: "Exercice : une moitié de figure est donnée. Complétez l'image par symétrie centrale. Un exemple (trait en pointillés) montre comment un point et son image sont alignés avec O.",
      },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A7_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "A7-3",
  submoduleCode: "A7.3",
  theory: {
    title: {
      fr: "Addition et soustraction de nombres relatifs",
    },
    paragraphs: { fr: [] },
    blocks: [
      {
        type: "theory_toggle",
        labelA: "Addition",
        labelB: "Soustraction",
        blocksA: [
          { type: "heading", fr: "Mêmes signes", black: true },
          { type: "plain", fr: "**1.** Additionner les valeurs absolues" },
          { type: "plain", fr: "**2.** Conserver le signe commun." },
          {
            type: "section",
            labelFr: "",
            itemsFr: [
              "(+6) + (+3) = +9",
              "(−6) + (−3) = −9",
            ],
          },
          { type: "plain", fr: "" },
          { type: "heading", fr: "Signes contraires", black: true },
          { type: "plain", fr: "**1.** Soustraire les valeurs absolues" },
          { type: "plain", fr: "**2.** Prendre le signe du nombre ayant la plus grande valeur absolue." },
          {
            type: "section",
            labelFr: "",
            itemsFr: [
              "(**+**6) + (−3) → |6| - |3| = 3 et **|6|** > |3| = signe **+** → **+**3",
              "(**−**6) + (+3) → |6| - |3| = 3 et **|6|** > |3| = signe **−** → **−**3",
            ],
          },
        ],
        blocksB: [
          { type: "plain", fr: "Soustraire un nombre revient à additionner son opposé." },
          { type: "plain", fr: "**1.** Toujours transformer la soustraction en addition de l'opposé" },
          { type: "plain", fr: "**2.** Appliquer la règle d'addition." },
          { type: "plain", fr: "" },
          { type: "heading", fr: "Mêmes signes", black: true },
          {
            type: "section",
            labelFr: "",
            itemsFr: [
              "(+6) **−** (**+**3) → (+6) **+** (**−**3) = +3",
              "(−6) **−** (**−**3) → (−6) **+** (**+**3) = −3",
            ],
          },
          { type: "plain", fr: "" },
          { type: "heading", fr: "Signes contraires", black: true },
          {
            type: "section",
            labelFr: "",
            itemsFr: [
              "(+6) **−** (**−**3) → (+6) **+** (**+**3) = +9",
              "(−6) **−** (**+**3) → (−6) **+** (**−**3) = −9",
            ],
          },
        ],
      },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

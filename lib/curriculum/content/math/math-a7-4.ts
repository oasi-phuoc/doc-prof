import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A7_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "A7-4",
  submoduleCode: "A7.4",
  theory: {
    title: {
      fr: "Multiplication et division",
    },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Règle des signes", black: true },

      { type: "plain", fr: "La même règle des signes s'applique pour la multiplication (**×**) et la division (**÷**)." },

      { type: "plain", fr: "Mêmes signes → résultat **positif** (+)" },
      { type: "plain", fr: "Signes contraires → résultat **négatif** (−)" },

      {
        type: "table",
        headersFr: ["Signes", "Résultat"],
        accentHeader: true,
        rows: [
          ["(**+**) × (**+**)\n(**+**) ÷ (**+**)", "**+** (positif)"],
          ["(**−**) × (**−**)\n(**−**) ÷ (**−**)", "**+** (positif)"],
          ["(**+**) × (**−**)\n(**+**) ÷ (**−**)", "**−** (négatif)"],
          ["(**−**) × (**+**)\n(**−**) ÷ (**+**)", "**−** (négatif)"],
        ],
      },

      { type: "heading", fr: "Multiplication", black: true },

      { type: "highlight", fr: "Mêmes signes → positif" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "(+6) × (+3) = +18   (positif × positif)",
          "(−6) × (−3) = +18   (négatif × négatif)",
        ],
      },

      { type: "highlight", fr: "Signes contraires → négatif" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "(+6) × (−3) = −18",
          "(−6) × (+3) = −18",
        ],
      },

      { type: "heading", fr: "Division", black: true },

      { type: "highlight", fr: "Mêmes signes → positif" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "(+6) ÷ (+3) = +2",
          "(−6) ÷ (−3) = +2",
        ],
      },

      { type: "highlight", fr: "Signes contraires → négatif" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "(+6) ÷ (−3) = −2",
          "(−6) ÷ (+3) = −2",
        ],
      },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

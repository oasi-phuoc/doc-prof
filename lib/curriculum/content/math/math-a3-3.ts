import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A3_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "A3-3",
    submoduleCode: "A3.3",
    theory: {
      title: {
        fr: "Division",
      },
      paragraphs: { fr: [] },
      blocks: [
        { type: "plain", fr: "La division sert à partager ou répartir une quantité. C'est chercher combien de fois un nombre est contenu dans un autre." },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Le signe de la division est « ÷ » **diviser**. ",
            "Le nombre que l'on divise est le **dividende**.",
            "Le nombre par lequel on divise est le **diviseur**.",
            "Le résultat est le **quotient**.",
            "Parfois la division n'est pas exacte et il reste un nombre appelé **reste**.",
          ],
        },
        {
          type: "table",
          headersFr: ["121", "÷", "11", "=", "12"],
          accentHeader: true,
          rows: [["dividende", "diviser", "diviseur", "égale", "quotient"]],
        },
        { type: "heading", fr: "Propriétés de la division", black: true },
        { type: "highlight", fr: "Non-commutativité" },
        {
          type: "section",
          labelFr: "",
          itemsFr: ["L'ordre est important : 8 ÷ 2 = 4, mais 2 ÷ 8 ≠ 4."],
        },
        { type: "highlight", fr: "Division par 0" },
        {
          type: "section",
          labelFr: "",
          itemsFr: ["On ne peut pas diviser par 0. La division par zéro est impossible."],
        },
        { type: "heading", fr: "Table de divisions", black: true },
        { type: "div_table" },
      ],
    },
    exercises: [],
    exercisePool: [
      { id: "a3-3-ep01", promptFr: "56 ÷ 7 = ?", type: "number", acceptable: ["8"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep02", promptFr: "54 ÷ 9 = ?", type: "number", acceptable: ["6"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep03", promptFr: "72 ÷ 8 = ?", type: "number", acceptable: ["9"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep04", promptFr: "48 ÷ 6 = ?", type: "number", acceptable: ["8"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep05", promptFr: "36 ÷ 4 = ?", type: "number", acceptable: ["9"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep06", promptFr: "63 ÷ 7 = ?", type: "number", acceptable: ["9"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep07", promptFr: "44 ÷ 11 = ?", type: "number", acceptable: ["4"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep08", promptFr: "84 ÷ 12 = ?", type: "number", acceptable: ["7"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep09", promptFr: "35 ÷ 5 = ?", type: "number", acceptable: ["7"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep10", promptFr: "66 ÷ 6 = ?", type: "number", acceptable: ["11"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep11", promptFr: "108 ÷ 9 = ?", type: "number", acceptable: ["12"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep12", promptFr: "132 ÷ 11 = ?", type: "number", acceptable: ["12"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep13", promptFr: "144 ÷ 12 = ?", type: "number", acceptable: ["12"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep14", promptFr: "45 ÷ 9 = ?", type: "number", acceptable: ["5"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
      { id: "a3-3-ep15", promptFr: "96 ÷ 8 = ?", type: "number", acceptable: ["12"], hintFr: "Cherche combien de fois le diviseur entre dans le dividende. Vérifie en multipliant."},
    ],
    poolSize: 5,
  };

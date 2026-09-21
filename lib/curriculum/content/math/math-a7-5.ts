import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A7_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "A7-5",
  submoduleCode: "A7.5",
  theory: {
    title: { fr: "Valeur absolue",},
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "La valeur absolue", black: true },
      { type: "highlight", fr: "Définition" },
      { type: "section", labelFr: "", itemsFr: [
        "La valeur absolue d'un nombre est sa **distance à 0** sur la droite numérique.",
        "Elle est **toujours positive** ou nulle.",
        "Notation : |a| (barres verticales autour du nombre).",
      ] },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Exemples" },
      { type: "table",
        headersFr: ["Nombre", "Valeur absolue", "Explication"],
        accentHeader: true,
        rows: [
          ["**−**5", "|**−**5| = 5", "distance à 0 = 5"],
          ["**+**5", "|**+**5| = 5", "distance à 0 = 5"],
          ["**−**3,7", "|**−**3,7| = 3,7", "distance à 0 = 3,7"],
          ["0", "|0| = 0", "distance à 0 = 0"],
        ],
      },
      { type: "plain", fr: "" },
      { type: "note", fr: "−8 et +8 ont la même valeur absolue (8) : ils sont à égale distance de 0. Ce sont des opposés." },
    ],
  },
  exercises: [],
  exercisePool: [
    { id: "a7-5-ep01", promptFr: "Calculez |−5|.", type: "number", acceptable: ["5"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep02", promptFr: "Calculez |+8|.", type: "number", acceptable: ["8"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep03", promptFr: "Calculez |−3,7|.", type: "short_text", acceptable: ["3,7", "3.7"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep04", promptFr: "Quel nombre a la même valeur absolue que −12 ?", type: "number", acceptable: ["12", "+12"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep05", promptFr: "Calculez |0|.", type: "number", acceptable: ["0"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep06", promptFr: "Calculez |−100|.", type: "number", acceptable: ["100"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep07", promptFr: "Calculez |+7|.", type: "number", acceptable: ["7"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep08", promptFr: "Est-ce que |−9| = |+9| ? Répondez oui ou non.", type: "short_text", acceptable: ["oui", "yes"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep09", promptFr: "Calculez |−15|.", type: "number", acceptable: ["15"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep10", promptFr: "Quel nombre entier a la même valeur absolue que −4 ?", type: "number", acceptable: ["4"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep11", promptFr: "Calculez |−2,5|.", type: "short_text", acceptable: ["2,5", "2.5"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
    { id: "a7-5-ep12", promptFr: "La valeur absolue d'un nombre est-elle toujours positive ? (oui/non)", type: "short_text", acceptable: ["oui", "yes"], hintFr: "La valeur absolue |x| est toujours positive : c'est la distance du nombre à zéro."},
  ],
  poolSize: 5,
};

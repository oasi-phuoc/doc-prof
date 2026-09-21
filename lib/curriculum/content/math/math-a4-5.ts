import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "A4-5",
  submoduleCode: "A4.5",

  theory: {
    title: {
      fr: "Multiplication de fractions",
    },

    paragraphs: {
      fr: [
        "Multiplier des fractions consiste à multiplier les numérateurs entre eux et les dénominateurs entre eux.",
      ],
    },

    blocks: [
      {
        type: "plain",
        fr: "Multiplier des fractions consiste à multiplier les numérateurs entre eux et les dénominateurs entre eux.",
      },

      {
        type: "heading",
        fr: "Règle de multiplication",
        black: true,
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On multiplie les numérateurs entre eux.",
          "On multiplie les dénominateurs entre eux.",
          "On simplifie le résultat si possible.",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      {
        type: "plain",
        fr: "[[frac:2/3]] × [[frac:4/5]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On multiplie les numérateurs : 2 × 4 = 8",
          "On multiplie les dénominateurs : 3 × 5 = 15",
          "Résultat : [[frac:8/15]]",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple avec simplification",
      },

      {
        type: "plain",
        fr: "[[frac:3/4]] × [[frac:8/9]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On multiplie : 3 × 8 = 24 et 4 × 9 = 36",
          "On obtient : [[frac:24/36]]",
          "On simplifie : [[frac:24/36]] = [[frac:2/3]]",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple avec simplification avant calcul",
      },

      {
        type: "plain",
        fr: "[[frac:6/10]] × [[frac:5/3]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On simplifie avant de multiplier : 6 et 3 → 2 et 1, 5 et 10 → 1 et 2",
          "On calcule : [[frac:2/2]] × [[frac:1/1]] = [[frac:2/2]]",
          "Résultat : [[frac:1/1]] = 1",
        ],
      },
    ],
  },

  exercises: [],
  exercisePool: [
    { id: "a4-5-ep01", promptFr: "Calculez 1/2 × 3/4. (ex: 3/8)", type: "short_text", acceptable: ["3/8"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep02", promptFr: "Calculez 2/3 × 3/5. (ex: 2/5)", type: "short_text", acceptable: ["6/15", "2/5"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep03", promptFr: "Calculez 4/5 × 5/8. Simplifiez. (ex: 1/2)", type: "short_text", acceptable: ["20/40", "1/2"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep04", promptFr: "Calculez 3/4 × 8/9. Simplifiez. (ex: 2/3)", type: "short_text", acceptable: ["24/36", "2/3"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep05", promptFr: "Calculez 1/3 × 1/3. (ex: 1/9)", type: "short_text", acceptable: ["1/9"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep06", promptFr: "Calculez 5/6 × 12/25. Simplifiez. (ex: 2/5)", type: "short_text", acceptable: ["60/150", "2/5"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep07", promptFr: "Calculez 3/7 × 14/9. Simplifiez. (ex: 2/3)", type: "short_text", acceptable: ["42/63", "2/3"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep08", promptFr: "Calculez 2/5 × 5/4. Simplifiez. (ex: 1/2)", type: "short_text", acceptable: ["10/20", "1/2"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep09", promptFr: "Calculez 7/8 × 4/7. Simplifiez. (ex: 1/2)", type: "short_text", acceptable: ["28/56", "1/2"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
    { id: "a4-5-ep10", promptFr: "Calculez 3/5 × 10/9. Simplifiez. (ex: 2/3)", type: "short_text", acceptable: ["30/45", "2/3"], hintFr: "Multiplication de fractions : numérateur × numérateur, dénominateur × dénominateur. Simplifie si possible."},
  ],
  poolSize: 5,
};
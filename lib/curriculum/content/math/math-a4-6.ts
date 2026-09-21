import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_6_LESSON: MathSubmoduleLesson = {
  submoduleId: "A4-6",
  submoduleCode: "A4.6",

  theory: {
    title: {
      fr: "Division de fractions",
    },

    paragraphs: {
      fr: [
        "Diviser des fractions consiste à multiplier par l’inverse de la deuxième fraction.",
      ],
    },

    blocks: [
      {
        type: "plain",
        fr: "Diviser des fractions consiste à multiplier par l’inverse de la deuxième fraction.",
      },

      {
        type: "heading",
        fr: "Règle de division",
        black: true,
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On garde la première fraction.",
          "On remplace la division par une multiplication.",
          "On inverse la deuxième fraction.",
          "On multiplie comme dans les multiplications de fractions.",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      {
        type: "plain",
        fr: "[[frac:2/3]] ÷ [[frac:4/5]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On transforme la division en multiplication : [[frac:2/3]] × [[frac:5/4]]",
          "On multiplie : 2 × 5 = 10 et 3 × 4 = 12",
          "Résultat : [[frac:10/12]]",
          "On simplifie : [[frac:10/12]] = [[frac:5/6]]",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple avec simplification avant calcul",
      },

      {
        type: "plain",
        fr: "[[frac:6/10]] ÷ [[frac:3/5]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On transforme : [[frac:6/10]] × [[frac:5/3]]",
          "On simplifie avant de calculer : 6 et 3 → 2 et 1, 5 et 10 → 1 et 2",
          "On obtient : [[frac:2/2]] × [[frac:1/1]]",
          "Résultat : 1",
        ],
      },

      {
        type: "highlight",
        fr: "À retenir",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Diviser par une fraction = multiplier par son inverse.",
          "Toujours simplifier si possible avant ou après le calcul.",
        ],
      },
    ],
  },

  exercises: [],
  exercisePool: [
    { id: "a4-6-ep01", promptFr: "Calculez 1/2 ÷ 1/4. (1/2 × 4/1 = ?) (ex: 2/1 ou 2)", type: "short_text", acceptable: ["2", "2/1", "4/2"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep02", promptFr: "Calculez 3/4 ÷ 3/8. (3/4 × 8/3 = ?) Simplifiez. (ex: 2/1 ou 2)", type: "short_text", acceptable: ["2", "2/1", "24/12"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep03", promptFr: "Calculez 2/3 ÷ 4/9. (2/3 × 9/4 = ?) Simplifiez. (ex: 3/2)", type: "short_text", acceptable: ["18/12", "3/2"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep04", promptFr: "Calculez 5/6 ÷ 5/12. (5/6 × 12/5 = ?) Simplifiez. (ex: 2)", type: "short_text", acceptable: ["2", "2/1", "60/30"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep05", promptFr: "Calculez 1/3 ÷ 1/6. (ex: 2)", type: "short_text", acceptable: ["2", "2/1"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep06", promptFr: "L'inverse de 3/7 est ? (ex: 7/3)", type: "short_text", acceptable: ["7/3"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep07", promptFr: "L'inverse de 5/8 est ? (ex: 8/5)", type: "short_text", acceptable: ["8/5"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep08", promptFr: "Calculez 4/5 ÷ 2/5. (4/5 × 5/2 = ?) Simplifiez. (ex: 2)", type: "short_text", acceptable: ["2", "2/1", "20/10"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep09", promptFr: "Calculez 3/8 ÷ 3/4. (3/8 × 4/3 = ?) Simplifiez. (ex: 1/2)", type: "short_text", acceptable: ["1/2", "12/24"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
    { id: "a4-6-ep10", promptFr: "Calculez 7/10 ÷ 7/5. (7/10 × 5/7 = ?) Simplifiez. (ex: 1/2)", type: "short_text", acceptable: ["1/2", "35/70"], hintFr: "Division de fractions : multiplie par l'inverse (retourne) de la fraction diviseur."},
  ],
  poolSize: 5,
};
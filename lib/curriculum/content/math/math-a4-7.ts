import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_7_LESSON: MathSubmoduleLesson = {
  submoduleId: "A4-7",
  submoduleCode: "A4.7",

  theory: {
    title: {
      fr: "Fractions et nombres décimaux",
    },

    paragraphs: {
      fr: [
        "Une fraction et un nombre décimal représentent la même quantité sous deux écritures différentes.",
      ],
    },

    blocks: [
      {
        type: "plain",
        fr: "Une fraction et un nombre décimal représentent la même quantité sous deux écritures différentes.",
      },

      {
        type: "heading",
        fr: "1. Transformer une fraction en nombre décimal",
        black: true,
      },

      {
        type: "plain",
        fr: "Pour transformer une fraction en nombre décimal, on divise le numérateur par le dénominateur.",
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      {
        type: "plain",
        fr: "[[frac:1/2]]",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On calcule : 1 ÷ 2 = 0,5",
          "Donc : [[frac:1/2]] = 0,5",
        ],
      },

      {
        type: "plain",
        fr: "[[frac:3/4]] = 3 ÷ 4 = 0,75",
      },

      {
        type: "heading",
        fr: "2. Transformer un nombre décimal en fraction",
        black: true,
      },

      {
        type: "plain",
        fr: "Pour transformer un nombre décimal en fraction, on l’écrit avec une puissance de 10 puis on simplifie.",
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      {
        type: "plain",
        fr: "0,6",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "0,6 = 6/10",
          "On simplifie : 6/10 = 3/5",
        ],
      },

      {
        type: "plain",
        fr: "0,25",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "0,25 = 25/100",
          "On simplifie : 25/100 = 1/4",
        ],
      },

      {
        type: "heading",
        fr: "3. Fractions et décimaux équivalents",
        black: true,
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Une fraction peut toujours être écrite sous forme décimale si la division est finie.",
          "Certains nombres décimaux peuvent aussi être écrits sous forme de fractions simples.",
        ],
      },

      {
        type: "highlight",
        fr: "Exemples",
      },

      {
        type: "plain",
        fr: "[[frac:1/4]] = 0,25",
      },

      {
        type: "plain",
        fr: "[[frac:2/5]] = 0,4",
      },

      {
        type: "plain",
        fr: "[[frac:3/10]] = 0,3",
      },

      {
        type: "heading",
        fr: "À retenir",
        black: true,
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Fraction → décimal : on divise.",
          "Décimal → fraction : on écrit sur 10, 100, 1000 puis on simplifie.",
          "Les deux formes représentent la même valeur.",
        ],
      },
    ],
  },

  exercises: [],
  exercisePool: [
    { id: "a4-7-ep01", promptFr: "Convertissez 1/2 en nombre décimal. (ex: 0.5)", type: "short_text", acceptable: ["0.5", "0,5"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep02", promptFr: "Convertissez 1/4 en nombre décimal. (ex: 0.25)", type: "short_text", acceptable: ["0.25", "0,25"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep03", promptFr: "Convertissez 3/4 en nombre décimal. (ex: 0.75)", type: "short_text", acceptable: ["0.75", "0,75"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep04", promptFr: "Convertissez 3/10 en nombre décimal. (ex: 0.3)", type: "short_text", acceptable: ["0.3", "0,3"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep05", promptFr: "Convertissez 7/100 en nombre décimal. (ex: 0.07)", type: "short_text", acceptable: ["0.07", "0,07"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep06", promptFr: "Convertissez 0.6 en fraction décimale (sur 10). (ex: 6/10)", type: "short_text", acceptable: ["6/10", "3/5"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep07", promptFr: "Convertissez 0.25 en fraction (sur 100, puis simplifiez). (ex: 1/4)", type: "short_text", acceptable: ["25/100", "1/4"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep08", promptFr: "1/5 = ? décimal. (ex: 0.2)", type: "short_text", acceptable: ["0.2", "0,2"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep09", promptFr: "Convertissez 0.8 en fraction simplifiée. (ex: 4/5)", type: "short_text", acceptable: ["8/10", "4/5"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
    { id: "a4-7-ep10", promptFr: "Convertissez 2/5 en nombre décimal. (ex: 0.4)", type: "short_text", acceptable: ["0.4", "0,4"], hintFr: "Pour convertir en décimal, divise le numérateur par le dénominateur."},
  ],
  poolSize: 5,
};
import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A1_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "A1-3",
  submoduleCode: "A1.3",

  theory: {
    title: {
      fr: "Comparer les nombres",
    },

    blocks: [
      {
        type: "plain",
        fr: "Comparer des nombres consiste à déterminer lequel est le plus **grand**, le plus **petit** ou s'ils sont **égaux**.",
      },

      {
        type: "heading",
        fr: "Les symboles de comparaison",
        black: true,
      },

      {
        type: "plain",
        fr: "La partie de la flèche **>** qui est ouverte est toujours dirigée **vers le plus grand** nombre.",
      },

      {
        type: "table",
        headersFr: ["Comparaison", "Symbole", "Exemple"],
        accentHeader: true,
        rows: [
          ["plus petit que", "**<**", "456 **<** 462"],
          ["plus grand que", "**>**", "902 **>** 890"],
          ["égal à", "**=**", "789 **=** 789"],
        ],
      },
      
      { type: "plain", fr: "" },
      
      {
        type: "highlight",
        fr: "Règle de comparaison",
      },

      {
        type: "plain",
        fr: "Nombres avec un nombre différent de chiffres",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le plus long est le plus grand.",
        ],
      },

      {
        type: "plain",
        fr: "Même nombre de chiffres"
      },
  
          
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Compare chiffre par chiffre depuis la gauche.",
          "Dès qu'un chiffre est différent, on regarde le plus grand chiffre.",
        ],
      },
      
      {
        type: "highlight",
        fr: "Exemple",
      },

      { type: "plain", fr: "On a deux chiffres 3 456 et 3 421" },
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Même nombre de chiffres",
          "Les milliers sont égaux",
          "Les entaines sont égales",
          "Les dizaines : 5 > 2",
          "Donc 3 456 > 3 421",
        ],
      },

      { type: "plain", fr: "" },

      {
        type: "heading",
        fr: "Valeur entre deux bornes",
        black: true,
      },

      {
        type: "highlight",
        fr: "Principe",
      },

      { type: "plain", fr: "Quand une valeur est entre deux nombres, cela veut dire :" },
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La valeur est plus grande que le premier nombre",
          "La valeur est plus petite que le deuxième nombre.",
        ],
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      { type: "plain", fr: "Quels nombres sont entre 3 et 8 ?" },
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On cherche les nombres plus grands que 3 et plus petits que 8. (3 < ? < 8)",
          "Les nombres possibles sont : 4, 5, 6, 7",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],

  exercisePool: [
    { id: "a1-3-ep01", promptFr: "Quel est le plus grand nombre : 347 ou 374 ?", type: "number", acceptable: ["374"], hintFr: "Compare les chiffres de gauche à droite : les centaines sont égales, alors compare les dizaines." },
    { id: "a1-3-ep02", promptFr: "Quel est le plus petit nombre : 2 580 ou 2 508 ?", type: "number", acceptable: ["2508", "2 508"], hintFr: "Compare chiffre par chiffre de gauche à droite." },
    { id: "a1-3-ep03", promptFr: "Parmi ces nombres, lequel est entre 150 et 200 : 148, 178, 205 ?", type: "number", acceptable: ["178"], hintFr: "Un nombre est entre 150 et 200 s'il est plus grand que 150 et plus petit que 200." },
    { id: "a1-3-ep04", promptFr: "Encadrez 73 entre deux dizaines. Quelle est la dizaine supérieure ?", type: "number", acceptable: ["80"], hintFr: "La dizaine supérieure est la première dizaine plus grande que 73." },
    { id: "a1-3-ep05", promptFr: "Encadrez 456 entre deux centaines. Quelle est la centaine supérieure ?", type: "number", acceptable: ["500"], hintFr: "La centaine supérieure est la première centaine plus grande que 456." },
    { id: "a1-3-ep06", promptFr: "Quel est le plus grand nombre : 1 009 ou 1 090 ?", type: "number", acceptable: ["1090", "1 090"], hintFr: "Compare les centaines : 0 centaine contre 9 centaines." },
    { id: "a1-3-ep07", promptFr: "Parmi ces nombres, lequel est entre 500 et 600 : 489, 537, 612 ?", type: "number", acceptable: ["537"], hintFr: "Un nombre est entre 500 et 600 s'il est plus grand que 500 et plus petit que 600." },
    { id: "a1-3-ep08", promptFr: "Encadrez 291 entre deux centaines. Quelle est la centaine inférieure ?", type: "number", acceptable: ["200"], hintFr: "La centaine inférieure est la première centaine plus petite que 291." },
    { id: "a1-3-ep09", promptFr: "Quel est le plus petit nombre : 8 050 ou 8 005 ?", type: "number", acceptable: ["8005", "8 005"], hintFr: "Compare les centaines : 0 centaine contre 0 centaine, puis les dizaines." },
    { id: "a1-3-ep10", promptFr: "Parmi ces nombres, lequel est entre 1 000 et 1 500 : 987, 1 250, 1 600 ?", type: "number", acceptable: ["1250", "1 250"], hintFr: "Vérifie si chaque nombre est > 1 000 et < 1 500." },
    { id: "a1-3-ep11", promptFr: "Encadrez 847 entre deux centaines. Quelle est la centaine supérieure ?", type: "number", acceptable: ["900"], hintFr: "La centaine supérieure est la première centaine plus grande que 847." },
    { id: "a1-3-ep12", promptFr: "Quel est le plus grand nombre : 3 999 ou 4 001 ?", type: "number", acceptable: ["4001", "4 001"], hintFr: "Compare d'abord les milliers : 3 000 contre 4 000." },
  ],

  poolSize: 5,
};

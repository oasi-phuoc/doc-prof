import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A1_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "A1-4",
  submoduleCode: "A1.4",

  theory: {
    title: {
      fr: "Droite numérique",
    },

    blocks: [
      {
        type: "plain",
        fr: "Sur une droite numérique, les nombres sont placés dans l'ordre du plus petit au plus grand, de gauche à droite. L'espacement entre deux nombres consécutifs peut être 1, 2, 5, 10, 100… selon l'échelle.",
      },

      {
        type: "heading",
        fr: "Nombres pairs et impairs",
        black: true,
      },

      {
        type: "plain",
        fr: "Pour savoir si un nombre est **pair** ou **impair**, on regarde seulement le dernier chiffre.",
      },

      {
        type: "highlight",
        fr: "Pair",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Un nombre pair peut être partagé en 2 parts égales.",
          "Il se termine par **0**, **2**, **4**, **6** ou **8**.",
          "4, 12, 38, 100…",
        ],
      },

      {
        type: "highlight",
        fr: "Impair",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Un nombre impair ne peut pas être partagé en 2 parts exactement égales.",
          "Il se termine par **1**, **3**, **5**, **7** ou **9**.",
          "3, 17, 45, 99…",
        ],
      },
    ],

    paragraphs: {
      fr: [
      ],
    },
  },

  exercises: [],

  exercisePool: [
    { id: "a1-4-ep01", promptFr: "Le nombre 84 est-il pair ou impair ? (écrivez P pour pair, I pour impair)", type: "short_text", acceptable: ["P", "p", "pair"], hintFr: "Un nombre est pair s'il se termine par 0, 2, 4, 6 ou 8." },
    { id: "a1-4-ep02", promptFr: "Quel est le prochain nombre pair après 36 ?", type: "number", acceptable: ["38"], hintFr: "Le prochain nombre pair = 36 + 2." },
    { id: "a1-4-ep03", promptFr: "Quel nombre entier se trouve exactement à mi-chemin entre 40 et 50 ?", type: "number", acceptable: ["45"], hintFr: "Mi-chemin = (40 + 50) ÷ 2." },
    { id: "a1-4-ep04", promptFr: "Le nombre 73 est-il pair ou impair ? (écrivez P pour pair, I pour impair)", type: "short_text", acceptable: ["I", "i", "impair"], hintFr: "Un nombre est impair s'il se termine par 1, 3, 5, 7 ou 9." },
    { id: "a1-4-ep05", promptFr: "Quel nombre se trouve à mi-chemin entre 0 et 100 ?", type: "number", acceptable: ["50"], hintFr: "Mi-chemin = (0 + 100) ÷ 2." },
    { id: "a1-4-ep06", promptFr: "Quel est le prochain nombre impair après 29 ?", type: "number", acceptable: ["31"], hintFr: "Le prochain nombre impair = 29 + 2." },
    { id: "a1-4-ep07", promptFr: "Quel nombre entier se trouve à mi-chemin entre 200 et 300 ?", type: "number", acceptable: ["250"], hintFr: "Mi-chemin = (200 + 300) ÷ 2." },
    { id: "a1-4-ep08", promptFr: "Le nombre 100 est-il pair ou impair ? (écrivez P pour pair, I pour impair)", type: "short_text", acceptable: ["P", "p", "pair"], hintFr: "100 se termine par 0, donc il est pair." },
    { id: "a1-4-ep09", promptFr: "Quel nombre se trouve à mi-chemin entre 10 et 20 ?", type: "number", acceptable: ["15"], hintFr: "Mi-chemin = (10 + 20) ÷ 2." },
    { id: "a1-4-ep10", promptFr: "Quel est le prochain nombre pair après 98 ?", type: "number", acceptable: ["100"], hintFr: "Le prochain nombre pair = 98 + 2." },
    { id: "a1-4-ep11", promptFr: "Quel nombre entier se trouve à mi-chemin entre 0 et 1 000 ?", type: "number", acceptable: ["500"], hintFr: "Mi-chemin = (0 + 1000) ÷ 2." },
    { id: "a1-4-ep12", promptFr: "Le nombre 1 007 est-il pair ou impair ? (écrivez P pour pair, I pour impair)", type: "short_text", acceptable: ["I", "i", "impair"], hintFr: "Regarde le dernier chiffre : 7 est impair." },
  ],
  poolSize: 5,
};

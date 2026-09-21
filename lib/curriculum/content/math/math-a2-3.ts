import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A2_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "A2-3",
  submoduleCode: "A2.3",
  theory: {
    title: {
      fr: "Estimation et arrondi",
    },

    blocks: [
      { type: "heading", fr: "Arrondi", black: true },

      {
        type: "plain",
        fr: "L'arrondi consiste à remplacer un nombre par un nombre **proche** mais plus simple.",
      },

      {
        type: "highlight",
        fr: "Règle d'arrondi",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Regarde le chiffre qui suit la position d'arrondi.",
          "Si ce chiffre est **≥ 5** → arrondi vers le **haut**.",
          "Si ce chiffre est **< 5** → arrondi vers le **bas**.",
        ],
      },

      {
        type: "table",
        headersFr: ["Nombre", "Arrondi à la centaine", "Pourquoi ?"],
        accentHeader: true,
        colAligns: ["center", "center", "left"],
        rows: [
          ["347", "300", "chiffre des dizaines = 4 < 5\n→ nombre arrondi **vers le bas**"],
          ["4 682", "4 700", "chiffre des dizaines = 8 ≥ 5\n→ nombre arrondi **vers le haut**"],
        ],
      },

      { type: "heading", fr: "Estimation", black: true },

      {
        type: "plain",
        fr: "Une estimation consiste à trouver une **valeur approximative** d'un nombre ou d'un calcul. On ne cherche pas la réponse exacte, mais une réponse rapide et proche du nombre.",
      },

      {
        type: "highlight",
        fr: "Exemple",
      },

      {
        type: "plain",
        fr: "198 + 305",
      },

      {
        type: "plain",
        fr: "On arrondit :",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: ["198 → 200", "305 → 300"],
      },

      {
        type: "plain",
        fr: "Calcul estimé :",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: ["200 + 300 = 500"],
      },

      {
        type: "plain",
        fr: "La réponse exacte est 503. L'estimation 500 est donc proche.",
      },
    ],

    paragraphs: { fr: [ ] },
  },

  exercises: [],
  exercisePool: [
    { id: "a2-3-ep01", promptFr: "Arrondissez 347 à la centaine la plus proche.", type: "number", acceptable: ["300"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep02", promptFr: "Arrondissez 4 682 à la centaine la plus proche.", type: "number", acceptable: ["4700"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep03", promptFr: "Arrondissez 256 à la dizaine la plus proche.", type: "number", acceptable: ["260"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep04", promptFr: "Arrondissez 8 945 à la dizaine la plus proche.", type: "number", acceptable: ["8950"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep05", promptFr: "Arrondissez 3 149 au millier le plus proche.", type: "number", acceptable: ["3000"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep06", promptFr: "Arrondissez 7 500 au millier le plus proche.", type: "number", acceptable: ["8000"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep07", promptFr: "Estimez 198 + 305 en arrondissant à la centaine. Quel est le résultat estimé ?", type: "number", acceptable: ["500"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep08", promptFr: "Estimez 48 × 51 en arrondissant à la dizaine (50 × 50). Quel est le résultat estimé ?", type: "number", acceptable: ["2500"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep09", promptFr: "Arrondissez 6 754 à la centaine la plus proche.", type: "number", acceptable: ["6800"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep10", promptFr: "Arrondissez 1 450 au millier le plus proche.", type: "number", acceptable: ["1000"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep11", promptFr: "Arrondissez 9 960 à la centaine la plus proche.", type: "number", acceptable: ["10000"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
    { id: "a2-3-ep12", promptFr: "Estimez 397 + 612 en arrondissant (400 + 600). Quel est le résultat estimé ?", type: "number", acceptable: ["1000"], hintFr: "Regarde le chiffre juste après la position d'arrondi : si ≥ 5, arrondis au-dessus ; si < 5, arrondis au-dessous."},
  ],
  poolSize: 5,
};

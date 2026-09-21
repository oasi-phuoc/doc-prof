import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A3_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A3-2",
    submoduleCode: "A3.2",
    theory: {
    title: {
      fr: "Multiplication en colonnes",
    },
    blocks: [
      {
        type: "plain",
        fr: "La multiplication en colonne permet de multiplier des nombres plus grands en organisant les calculs étape par étape.",
      },
      { type: "highlight", fr: "Principe" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On multiplie chaque chiffre du nombre du bas par chaque chiffre du nombre du haut, en commençant par les unités.",
        ],
      },
      { type: "heading", fr: "Multiplication à 1 chiffre", black: true },
      { type: "highlight", fr: "374 × 2" },
      {
        type: "mul_step_cards",
        a: [0, 3, 7, 4],
        b: [0, 0, 0, 2],
        op: "×",
        steps: [
          {
            numFr: "1. On pose les nombres",
            textsFr: [
              "On pose en colonne en alignant les unités, les dizaines, les centaines.",
            ],
            carries: [null, null, null, null],
            result:  [null, null, null, null],
          },
          {
            numFr: "2. Multiplier les unités",
            textsFr: [
              "2 × 4 = 8",
              "On écrit 8 dans la colonne des unités.",
            ],
            carries: [null, null, null, null],
            result:  [null, null, null, 8],
          },
          {
            numFr: "3. Multiplier les dizaines",
            textsFr: [
              "2 × 7 = 14",
              "14 = 1 dizaine et 4 unités.",
              "On écrit 4 dans la colonne des dizaines.",
              "On retient 1 centaine.",
            ],
            carries: [null, 1, null, null],
            result:  [null, null, 4, 8],
          },
          {
            numFr: "4. Multiplier les centaines",
            textsFr: [
              "2 × 3 = 6",
              "On ajoute la retenue :",
              "6 + 1 = 7",
              "On écrit 7 dans la colonne des centaines.",
            ],
            carries: [null, 1, null, null],
            result:  [null, 7, 4, 8],
          },
        ],
      },
      { type: "heading", fr: "Multiplication à 2 chiffres", black: true },
      { type: "highlight", fr: "428 × 36" },
      {
        type: "mul2_step_cards",
        a: [0, 0, 4, 2, 8],
        b: [0, 0, 0, 3, 6],
        result: 15408,
        steps: [
          {
            numFr: "1. On pose les nombres",
            textsFr: [
              "On pose en colonne en alignant les unités, les dizaines, les centaines.",
              "Le deuxième facteur a 2 chiffres : 3 (dizaines) et 6 (unités).",
            ],
            carries1: [null, null, null, null, null],
            carries2: [null, null, null, null, null],
            p1:       [null, null, null, null, null],
            p2shifted:[null, null, null, null, null],
            res:      [null, null, null, null, null],
          },
          {
            numFr: "2. Multiplier par les unités (428 × 6 = 2 568)",
            textsFr: [
              "6 × 8 = 48 → on écrit 8, on retient 4",
              "6 × 2 = 12 + 4 = 16 → on écrit 6, on retient 1",
              "6 × 4 = 24 + 1 = 25 → on écrit 5, on retient 2",
              "On écrit la retenue 2 devant → 1er sous-total : 2 568",
            ],
            carries1: [null, 2, 1, 4, null],
            carries2: [null, null, null, null, null],
            p1:       [null, 2, 5, 6, 8],
            p2shifted:[null, null, null, null, null],
            res:      [null, null, null, null, null],
          },
          {
            numFr: "3. Multiplier par les dizaines (428 × 30 = 12 840)",
            textsFr: [
              "On multiplie 428 × 3 = 1 284",
              "Comme c'est les dizaines, on décale d'une colonne vers la gauche.",
              "2e sous-total : 12 840 (le 0 à droite est ajouté automatiquement)",
            ],
            carries1: [null, 2, 1, 4, null],
            carries2: [null, 1, null, 2, null],
            p1:       [null, 2, 5, 6, 8],
            p2shifted:[1, 2, 8, 4, 0],
            res:      [null, null, null, null, null],
          },
          {
            numFr: "4. Additionner les deux sous-totaux",
            textsFr: [
              "2 568 + 12 840 = 15 408",
              "On additionne les deux sous-totaux pour obtenir le résultat final.",
            ],
            carries1: [null, 2, 1, 4, null],
            carries2: [null, 1, null, 2, null],
            p1:       [null, 2, 5, 6, 8],
            p2shifted:[1, 2, 8, 4, 0],
            res:      [1, 5, 4, 0, 8],
          },
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
  exercisePool: [
    { id: "a3-2-ep01", promptFr: "Calculez 24 × 3.", type: "number", acceptable: ["72"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep02", promptFr: "Calculez 45 × 6.", type: "number", acceptable: ["270"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep03", promptFr: "Calculez 123 × 4.", type: "number", acceptable: ["492"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep04", promptFr: "Calculez 36 × 7.", type: "number", acceptable: ["252"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep05", promptFr: "Calculez 52 × 8.", type: "number", acceptable: ["416"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep06", promptFr: "Calculez 67 × 9.", type: "number", acceptable: ["603"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep07", promptFr: "Calculez 21 × 15.", type: "number", acceptable: ["315"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep08", promptFr: "Calculez 34 × 12.", type: "number", acceptable: ["408"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep09", promptFr: "Calculez 48 × 11.", type: "number", acceptable: ["528"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep10", promptFr: "Calculez 75 × 4.", type: "number", acceptable: ["300"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep11", promptFr: "123 × 0 = ?", type: "number", acceptable: ["0"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
    { id: "a3-2-ep12", promptFr: "5 × 6 × 2 = ? (calculer dans n'importe quel ordre)", type: "number", acceptable: ["60"], hintFr: "Multiplie chaque chiffre du multiplicateur séparément, puis additionne les produits partiels."},
  ],
  poolSize: 5,
};

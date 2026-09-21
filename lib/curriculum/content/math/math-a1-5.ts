import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A1_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "A1-5",
  submoduleCode: "A1.5",
  theory: {
    title: {
      fr: "Suites numériques",
    },
    blocks: [
      {
        type: "plain",
        fr: "Une suite de nombres est une liste ordonnée où chaque terme est obtenu en appliquant la même règle. On **ajoute** ou **enlève** toujours le **même nombre**.",
      },
      {
        type: "plain",
        fr: "Pour comprendre une suite, on regarde ce qui change entre les nombres.",
      },
      {
        type: "highlight",
        fr: "Exemple",
      },

      { type: "plain", fr: "5 ; 8 ; 11 ; 14" },
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On ajoute toujours 3.",
          "La règle pour trouver le nombre suivant est : nombre actuel + **3**",
        ],
      },
      {
        type: "highlight",
        fr: "Suite croissante",
      },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Les nombres augmentent : 1 ; 3 ; 5 ; 7 ."],
      },
      {
        type: "highlight",
        fr: "Suite décroissante",
      },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Les nombres diminuent : 20 ; 15 ; 10 ; 5 ."],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
  exercisePool: [
    { id: "a1-5-ep01", promptFr: "Trouvez le terme suivant : 5, 10, 15, 20, ?", type: "number", acceptable: ["25"], hintFr: "La règle est +5 à chaque fois." },
    { id: "a1-5-ep02", promptFr: "Trouvez le terme suivant : 100, 90, 80, 70, ?", type: "number", acceptable: ["60"], hintFr: "La règle est −10 à chaque fois." },
    { id: "a1-5-ep03", promptFr: "Trouvez le terme suivant : 3, 6, 9, 12, ?", type: "number", acceptable: ["15"], hintFr: "La règle est +3 à chaque fois." },
    { id: "a1-5-ep04", promptFr: "Trouvez le terme suivant : 50, 100, 150, 200, ?", type: "number", acceptable: ["250"], hintFr: "La règle est +50 à chaque fois." },
    { id: "a1-5-ep05", promptFr: "Trouvez le terme suivant : 1 000, 900, 800, 700, ?", type: "number", acceptable: ["600"], hintFr: "La règle est −100 à chaque fois." },
    { id: "a1-5-ep06", promptFr: "Trouvez le terme manquant : 4, 8, ?, 16, 20", type: "number", acceptable: ["12"], hintFr: "La règle est +4 à chaque fois : 8+4=?" },
    { id: "a1-5-ep07", promptFr: "Trouvez le terme suivant : 25, 50, 75, 100, ?", type: "number", acceptable: ["125"], hintFr: "La règle est +25 à chaque fois." },
    { id: "a1-5-ep08", promptFr: "Trouvez le terme manquant : 30, 25, ?, 15, 10", type: "number", acceptable: ["20"], hintFr: "La règle est −5 à chaque fois : 25−5=?" },
    { id: "a1-5-ep09", promptFr: "Trouvez le terme suivant : 2, 4, 8, 16, ?", type: "number", acceptable: ["32"], hintFr: "Chaque terme est multiplié par 2." },
    { id: "a1-5-ep10", promptFr: "Trouvez le terme suivant : 200, 400, 600, 800, ?", type: "number", acceptable: ["1000"], hintFr: "La règle est +200 à chaque fois." },
    { id: "a1-5-ep11", promptFr: "Trouvez le terme manquant : 10, 20, 30, ?, 50", type: "number", acceptable: ["40"], hintFr: "La règle est +10 à chaque fois : 30+10=?" },
    { id: "a1-5-ep12", promptFr: "Trouvez le terme suivant : 7, 14, 21, 28, ?", type: "number", acceptable: ["35"], hintFr: "La règle est +7 à chaque fois (table de 7)." },
  ],
  poolSize: 5,
};

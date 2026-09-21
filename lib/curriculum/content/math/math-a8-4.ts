import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A8_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "A8-4",
    submoduleCode: "A8.4",
    theory: {
      title: {
        fr: "Racine carrée",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Qu'est-ce que la racine carrée ?",
          black: true,
        },
        {
          type: "plain",
          fr: "La racine carrée d'un nombre est le nombre qui, multiplié par lui-même, donne ce nombre.",
        },
        {
          type: "plain",
          fr: "La racine carrée est l'opération inverse de la puissance 2.",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "(√a)² = a",
            "Notation : √a",
          ],
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "√9 = 3 car 3 × 3 = 9",
            "√25 = 5 car 5 × 5 = 25",
          ],
        },
        {
          type: "heading",
          fr: "Qu'est-ce qu'un carré parfait ?",
          black: true,
        },
        {
          type: "plain",
          fr: "Un carré parfait est un nombre obtenu en multipliant un nombre entier par lui-même.",
        },
        {
          type: "table",
          headersFr: ["N", "N²", "√(N²)"],
          accentHeader: true,
          rows: [
            ["1", "1", "1"],
            ["2", "4", "2"],
            ["3", "9", "3"],
            ["4", "16", "4"],
            ["5", "25", "5"],
            ["6", "36", "6"],
            ["7", "49", "7"],
            ["8", "64", "8"],
            ["9", "81", "9"],
            ["10", "100", "10"],
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "heading",
          fr: "Propriété de la racine carrée",
          black: true,
        },
        {
          type: "plain",
          fr: "√(a × b) = √a × √b",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "√(4 × 9) = √4 × √9 = 2 × 3 = 6",
          ],
        },
        { type: "highlight", fr: "Astuce" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Si le nombre sous la racine est un carré parfait, le résultat est un entier.",
            "Les racines carrées de nombres négatifs n'existent pas dans les nombres réels.",
          ],
        },
      ],
    },
    exercises: [],
    exercisePool: [],
    poolSize: 0,
  };

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A1_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "A1-2",
  submoduleCode: "A1.2",

  theory: {
    title: {
      fr: "Valeur positionnelle",
    },

    blocks: [
      {
        type: "plain",
        fr: "Chaque chiffre occupe une **position** précise dans un nombre.",
      },

      {
        type: "table",
        headersFr: ["Nombre", "M", "C", "D", "U"],
        accentHeader: true,
        rows: [
          ["452", "—", "4", "5", "2"],
          ["524", "—", "5", "2", "4"],
          ["2 453", "2", "4", "5", "3"],
          ["9 102", "9", "1", "0", "2"],
        ],
      },

      { type: "plain", fr: " " },
      
      {
        type: "heading",
        fr: "Comment lire la valeur d’un chiffre",
        black: true,
      },

      {
        type: "highlight",
        fr: "Repérer sa position",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Il faut observer la position du chiffre dans le nombre.",
          " **U** = × 1",
          " **D** = × 10",
          " **C** = × 100",
          " **M** = × 1000",
        ],
      },

      {
        type: "highlight",
        fr: "Valeur du chiffre",
      },

      { type: "plain", fr: "Dans le nombre 3 864 :" },
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le chiffre **3** est en position **M** (milliers).",
          "Le chiffre **8** est en position **C** (centaines).",
          "Le chiffre **6** est en position **D** (dizaine).",
          "Le chiffre **4** est en position **U** (unité).",
          "Donc on fait 3 × 1000 = 3000.",

          "3 864 = **3** × 1000 + **8** × 100 + **6** × 10 + **4** × 1",
          "3 864 = **3000** + **800** + **60** + **4**",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [

  ],
};

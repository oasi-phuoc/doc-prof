import type { MathSubmoduleLesson } from "./math-a1-types";
import { A1_COMPTER_EN_FRANCAIS_ROWS } from "./math-a1-readaloud-rows";

export const MATH_A1_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "A1-1",
  submoduleCode: "A1.1",
  theory: {
    title: {
      fr: "Compter en français",
    },

    paragraphs: {
      fr: [
        "Un **nombre** entier s’écrit avec des chiffres (de **0** à **9**).",
        "En français, on sépare souvent les milliers par une espace fine : 125 000.",
        "En Suisse romande, on utilise souvent septante, huitante et nonante pour **70**, **80** et **90**.",
      ],
    },

    readAloud: {
      headingFr: "Enregistrement",

      legendFr: [
        {
          swatch: "red",
          labelFr: "Rouge : un seul son",
        },

        {
          swatch: "text",
          labelFr: "Noir : son",
        },

        {
          swatch: "gray",
          labelFr: "Gris : pas de son",
        },
      ],

      
      rows: A1_COMPTER_EN_FRANCAIS_ROWS,
      audioSrc: "/audio/a1-1-compter-fr.mp4",
    },
  },

  exercises: [
  ],
};

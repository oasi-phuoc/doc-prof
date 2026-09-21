import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A10_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "A10-2",
  submoduleCode: "A10.2",
  theory: {
    title: { fr: "Équations avec fractions" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Résoudre une équation avec fractions", black: true },
      {
        type: "plain",
        fr: "Une équation avec fractions se résout comme une équation normale, mais on commence souvent par **supprimer les dénominateurs**.",
      },
      { type: "highlight", fr: "Méthode" },
      { type: "plain", fr: "**1.** Repérer tous les dénominateurs." },
      { type: "plain", fr: "**2.** Chercher un dénominateur commun, souvent le PPMC." },
      { type: "plain", fr: "**3.** Écrire chaque terme avec ce même dénominateur." },
      { type: "plain", fr: "**4.** Multiplier toute l'équation par ce dénominateur." },
      { type: "plain", fr: "**5.** Réduire, isoler x, puis vérifier la solution." },
      {
        type: "theory_tabs",
        tabs: [
          {
            label: "1 fraction",
            blocks: [
              {
                type: "section",
                labelFr: "Exemple : [[frac:x/2]] + 3 = 7",
                itemsFr: [
                  "Le dénominateur est 2.",
                  "On multiplie tous les termes par 2.",
                  "x + 6 = 14",
                  "x = 8",
                ],
              },
            ],
          },
          {
            label: "2+ fractions",
            blocks: [
              {
                type: "section",
                labelFr: "Exemple : [[frac:x/3]] + [[frac:x/6]] = 5",
                itemsFr: [
                  "Le dénominateur commun de 3 et 6 est 6.",
                  "[[frac:2x/6]] + [[frac:x/6]] = [[frac:30/6]]",
                  "On multiplie tous les termes par 6.",
                  "2x + x = 30",
                  "3x = 30",
                  "x = 10",
                ],
              },
            ],
          },
        ],
      },
      {
        type: "table",
        headersFr: ["Situation", "Action"],
        accentHeader: true,
        rows: [
          ["Un terme entier est présent", "Il faut aussi le multiplier par le dénominateur commun."],
          ["Il y a x dans une fraction", "On enlève d'abord la fraction, puis on résout."],
          ["Il y a une fraction négative", "On garde bien le signe - pendant toute la résolution."],
          ["La solution est une fraction", "On la simplifie si possible."],
        ],
      },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

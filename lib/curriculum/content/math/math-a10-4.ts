import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A10_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "A10-4",
  submoduleCode: "A10.4",
  theory: {
    title: { fr: "Combinaison linéaire" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Qu'est-ce que la combinaison linéaire ?", black: true },
      {
        type: "plain",
        fr: "La méthode de **combinaison linéaire** (ou méthode d'élimination) consiste à multiplier les équations par des facteurs pour obtenir des coefficients opposés pour une des inconnues, puis à additionner ou soustraire les équations membre à membre pour l'éliminer.",
      },
      {
        type: "rule",
        titleFr: "Les 4 étapes",
        itemsFr: [
          "**1.** Écrire les deux équations en forme standard (ax + by = c).",
          "**2.** Multiplier une équation (ou les deux) pour que les coefficients d'une inconnue deviennent opposés.",
          "**3.** Additionner les équations membre à membre pour éliminer cette inconnue.",
          "**4.** Résoudre pour la variable restante, puis substituer pour trouver l'autre.",
        ],
      },
      { type: "heading", fr: "Exemple 1 — élimination directe", black: true },
      {
        type: "section",
        labelFr: "Système",
        itemsFr: [
          "I  : 3x − 2y = 1    │ × 2",
          "II : 8x + 4y = 68",
        ],
      },
      {
        type: "section",
        labelFr: "Résolution",
        itemsFr: [
          "I multiplié par 2 : 6x − 4y = 2",
          "Addition avec II : 6x − 4y + 8x + 4y = 2 + 68",
          "→ 14x = 70  :14  →  **x = 5**",
          "Substitution dans I : 3(5) − 2y = 1  →  2y = 14  →  **y = 7**",
        ],
      },
      { type: "heading", fr: "Exemple 2 — multiplication des deux équations", black: true },
      {
        type: "section",
        labelFr: "Système",
        itemsFr: [
          "I  : −5x + 3y = −1    │ × 3",
          "II : 3x − 5y = 7      │ × 5",
        ],
      },
      {
        type: "section",
        labelFr: "Résolution",
        itemsFr: [
          "I × 3 : −15x + 9y = −3",
          "II × 5 : 15x − 25y = 35",
          "Addition : −16y = 32  : (−16)  →  **y = −2**",
          "Substitution dans II : 3x − 5(−2) = 7  →  3x = −3  →  **x = −1**",
        ],
      },
      {
        type: "note",
        fr: "Si après combinaison on obtient 0 = k (k ≠ 0), le système est **impossible** (aucune solution). Si on obtient 0 = 0, le système a une **infinité de solutions**.",
      },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 4,
};

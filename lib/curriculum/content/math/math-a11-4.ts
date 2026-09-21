import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A11_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "A11-4",
    submoduleCode: "A11.4",
    theory: {
      title: {
        fr: "Linéaire f(x)=ax",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "La fonction linéaire",
          black: true,
        },
        {
          type: "plain",
          fr: "Une fonction linéaire a la forme f(x) = ax, où a est une constante appelée **pente** (ou coefficient directeur). Son graphique est toujours une **droite passant par l'origine (0, 0)**.",
        },
        {
          type: "rule",
          titleFr: "Propriété fondamentale",
          itemsFr: [
            "f(0) = a × 0 = 0  → la droite passe toujours par l'origine",
          ],
        },
        {
          type: "heading",
          fr: "Influence de la pente a",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Valeur de a", "Comportement de la droite", "Exemple"],
          accentHeader: true,
          rows: [
            ["a **>** 0", "Croissante (monte de gauche à droite)", "f(x) = 2x"],
            ["a **<** 0", "Décroissante (descend de gauche à droite)", "f(x) = **−**x"],
            ["a = 0", "Horizontale (droite y = 0)", "f(x) = 0"],
            ["|a| grand", "Droite très inclinée (raide)", "f(x) = 5x"],
            ["|a| petit", "Droite peu inclinée (douce)", "f(x) = 0,5x"],
          ],
        },
        {
          type: "heading",
          fr: "Exemples",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Fonction", "x = 1", "x = 2", "x = **−**1", "Passe par (0,0) ?"],
          accentHeader: true,
          rows: [
            ["f(x) = 2x", "2", "4", "**−**2", "Oui"],
            ["f(x) = **−**x", "**−**1", "**−**2", "1", "Oui"],
            ["f(x) = 0,5x", "0,5", "1", "**−**0,5", "Oui"],
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a11-4-ep01", promptFr: "f(x) = 4x. Calcule f(5).", type: "number", acceptable: ["20"], hintFr: "4 × 5 = ?" },
    { id: "a11-4-ep02", promptFr: "f(x) = −3x. Calcule f(6).", type: "number", acceptable: ["-18"], hintFr: "−3 × 6 = ?" },
    { id: "a11-4-ep03", promptFr: "f(x) = 5x. Calcule f(−4).", type: "number", acceptable: ["-20"], hintFr: "5 × (−4) = ?" },
    { id: "a11-4-ep04", promptFr: "f(x) = 3x. Quel est le coefficient directeur ?", type: "number", acceptable: ["3"], hintFr: "Dans f(x) = ax, le coefficient directeur est a." },
    { id: "a11-4-ep05", promptFr: "f(x) = −7x. Calcule f(3).", type: "number", acceptable: ["-21"], hintFr: "−7 × 3 = ?" },
    { id: "a11-4-ep06", promptFr: "f(x) = 6x. Quel est le coefficient directeur ?", type: "number", acceptable: ["6"], hintFr: "Dans f(x) = ax, le coefficient directeur est a." },
    { id: "a11-4-ep07", promptFr: "f(x) = 8x. Calcule f(4).", type: "number", acceptable: ["32"], hintFr: "8 × 4 = ?" },
    { id: "a11-4-ep08", promptFr: "f(x) = 9x. Calcule f(0).", type: "number", acceptable: ["0"], hintFr: "Toute fonction linéaire passe par l'origine : f(0) = 0." },
    { id: "a11-4-ep09", promptFr: "f(x) = −4x. Calcule f(−5).", type: "number", acceptable: ["20"], hintFr: "−4 × (−5) = ?" },
    { id: "a11-4-ep10", promptFr: "f(x) = 7x. Quel est le coefficient directeur ?", type: "number", acceptable: ["7"], hintFr: "Dans f(x) = ax, le coefficient directeur est a." },
    { id: "a11-4-ep11", promptFr: "f(x) = 2x. Calcule f(12).", type: "number", acceptable: ["24"], hintFr: "2 × 12 = ?" },
    { id: "a11-4-ep12", promptFr: "f(x) = −5x. Calcule f(4).", type: "number", acceptable: ["-20"], hintFr: "−5 × 4 = ?" },
  ],
  poolSize: 5,
};

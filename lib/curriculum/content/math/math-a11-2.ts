import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A11_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A11-2",
    submoduleCode: "A11.2",
    theory: {
      title: {
        fr: "Tableau de valeurs",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Construire un tableau de valeurs",
          black: true,
        },
        {
          type: "plain",
          fr: "Un tableau de valeurs liste plusieurs couples (x, f(x)). On choisit des valeurs régulières de x et on calcule f(x) pour chacune.",
        },
        {
          type: "rule",
          titleFr: "Méthode",
          itemsFr: [
            "1. Choisir des valeurs entières de x (souvent symétriques autour de 0)",
            "2. Calculer f(x) pour chaque valeur de x",
            "3. Remplir le tableau ligne par ligne",
            "4. Utiliser ces points pour tracer le graphique",
          ],
        },
        {
          type: "heading",
          fr: "Exemple : f(x) = 2x + 1",
          black: true,
        },
        {
          type: "table",
          headersFr: ["x", "−2", "−1", "0", "1", "2"],
          accentHeader: true,
          rows: [
            ["Calcul", "2(**−**2)**+**1", "2(**−**1)**+**1", "2(0)**+**1", "2(1)**+**1", "2(2)**+**1"],
            ["f(x)", "**−**3", "**−**1", "1", "3", "5"],
          ],
        },
        {
          type: "heading",
          fr: "Exemple : f(x) = x² − 1",
          black: true,
        },
        {
          type: "table",
          headersFr: ["x", "−2", "−1", "0", "1", "2"],
          accentHeader: true,
          rows: [
            ["Calcul", "(**−**2)²**−**1", "(**−**1)²**−**1", "0²**−**1", "1²**−**1", "2²**−**1"],
            ["f(x)", "3", "0", "**−**1", "0", "3"],
          ],
        },
        {
          type: "note",
          fr: "Conseil : choisir des valeurs symétriques autour de 0 permet de voir la tendance globale de la fonction et de faciliter le tracé du graphique.",
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a11-2-ep01", promptFr: "f(x) = 3x + 1. Calcule f(−3).", type: "number", acceptable: ["-8"], hintFr: "3 × (−3) + 1 = −9 + 1 = ?" },
    { id: "a11-2-ep02", promptFr: "f(x) = 3x + 1. Calcule f(3).", type: "number", acceptable: ["10"], hintFr: "3 × 3 + 1 = 9 + 1 = ?" },
    { id: "a11-2-ep03", promptFr: "f(x) = x² − 4. Calcule f(0).", type: "number", acceptable: ["-4"], hintFr: "0² − 4 = 0 − 4 = ?" },
    { id: "a11-2-ep04", promptFr: "f(x) = x² − 4. Calcule f(4).", type: "number", acceptable: ["12"], hintFr: "4² − 4 = 16 − 4 = ?" },
    { id: "a11-2-ep05", promptFr: "f(x) = 4x − 3. Calcule f(3).", type: "number", acceptable: ["9"], hintFr: "4 × 3 − 3 = 12 − 3 = ?" },
    { id: "a11-2-ep06", promptFr: "f(x) = 4x − 3. Calcule f(−1).", type: "number", acceptable: ["-7"], hintFr: "4 × (−1) − 3 = −4 − 3 = ?" },
    { id: "a11-2-ep07", promptFr: "f(x) = x² + 3x. Calcule f(4).", type: "number", acceptable: ["28"], hintFr: "4² + 3 × 4 = 16 + 12 = ?" },
    { id: "a11-2-ep08", promptFr: "f(x) = x² + 3x. Calcule f(−3).", type: "number", acceptable: ["0"], hintFr: "(−3)² + 3 × (−3) = 9 − 9 = ?" },
    { id: "a11-2-ep09", promptFr: "f(x) = 6 − x. Calcule f(9).", type: "number", acceptable: ["-3"], hintFr: "6 − 9 = ?" },
    { id: "a11-2-ep10", promptFr: "f(x) = 6 − x. Calcule f(0).", type: "number", acceptable: ["6"], hintFr: "6 − 0 = ?" },
    { id: "a11-2-ep11", promptFr: "f(x) = 2x² − 1. Calcule f(3).", type: "number", acceptable: ["17"], hintFr: "2 × 9 − 1 = 18 − 1 = ?" },
    { id: "a11-2-ep12", promptFr: "f(x) = 2x² − 1. Calcule f(−2).", type: "number", acceptable: ["7"], hintFr: "2 × 4 − 1 = 8 − 1 = ?" },
  ],
  poolSize: 5,
};

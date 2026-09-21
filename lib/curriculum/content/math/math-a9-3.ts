import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A9_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "A9-3",
    submoduleCode: "A9.3",
    theory: {
      title: {
        fr: "Évaluer une expression",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "plain",
          fr: "Évaluer une expression algébrique signifie remplacer les variables par des valeurs numériques, puis calculer le résultat en respectant les priorités opératoires.",
        },
        {
          type: "highlight",
          fr: "Méthode",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "1. Repérer toutes les variables dans l'expression",
            "2. Remplacer chaque variable par sa valeur (entre parenthèses)",
            "3. Calculer en respectant l'ordre : parenthèses → puissances → × et ÷ → + et −",
          ],
        },
        {
          type: "heading",
          fr: "Exemples",
          black: true,
        },
        {
          type: "plain",
          fr: "Toujours mettre la valeur entre parenthèses lors de la substitution. Cela évite les erreurs de signe, surtout avec les valeurs négatives.",
        },
        {
          type: "highlight",
          fr: "Avec une variable",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Évalue 3x² **−** 2x **+** 1 pour x = 3",
            "→ 3(3)² **−** 2(3) **+** 1",
            "→ 3 × 9 **−** 6 **+** 1",
            "→ 27 **−** 6 **+** 1 = **22**",
          ],
        },
        {
          type: "highlight",
          fr: "Avec deux variables",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Évalue a² **+** b pour a = 4 et b = **−**3",
            "→ (4)² **+** (**−**3)",
            "→ 16 **+** (**−**3) = **13**",
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a9-3-ep01", promptFr: "Évalue 3x + 2 pour x = 5.", type: "number", acceptable: ["17"], hintFr: "Remplace x par 5 : 3 × 5 + 2 = ?" },
    { id: "a9-3-ep02", promptFr: "Évalue 4a − 7 pour a = 4.", type: "number", acceptable: ["9"], hintFr: "Remplace a par 4 : 4 × 4 − 7 = ?" },
    { id: "a9-3-ep03", promptFr: "Évalue x² + 3 pour x = 4.", type: "number", acceptable: ["19"], hintFr: "Remplace x par 4 : 4² + 3 = 16 + 3 = ?" },
    { id: "a9-3-ep04", promptFr: "Évalue 2n² pour n = 3.", type: "number", acceptable: ["18"], hintFr: "Remplace n par 3 : 2 × 3² = 2 × 9 = ?" },
    { id: "a9-3-ep05", promptFr: "Évalue 5x − x² pour x = 4.", type: "number", acceptable: ["4"], hintFr: "5 × 4 − 4² = 20 − 16 = ?" },
    { id: "a9-3-ep06", promptFr: "Évalue (x + 2)² pour x = 5.", type: "number", acceptable: ["49"], hintFr: "(5 + 2)² = 7² = ?" },
    { id: "a9-3-ep07", promptFr: "Évalue 2x + 3y pour x = 3, y = 2.", type: "number", acceptable: ["12"], hintFr: "2 × 3 + 3 × 2 = 6 + 6 = ?" },
    { id: "a9-3-ep08", promptFr: "Évalue x³ pour x = 3.", type: "number", acceptable: ["27"], hintFr: "3³ = 3 × 3 × 3 = ?" },
    { id: "a9-3-ep09", promptFr: "Évalue 12 − 4t pour t = 3.", type: "number", acceptable: ["0"], hintFr: "12 − 4 × 3 = 12 − 12 = ?" },
    { id: "a9-3-ep10", promptFr: "Évalue 3a + 2b pour a = 4, b = 3.", type: "number", acceptable: ["18"], hintFr: "3 × 4 + 2 × 3 = 12 + 6 = ?" },
    { id: "a9-3-ep11", promptFr: "Évalue x² − 2x + 1 pour x = 5.", type: "number", acceptable: ["16"], hintFr: "5² − 2 × 5 + 1 = 25 − 10 + 1 = ?" },
    { id: "a9-3-ep12", promptFr: "Évalue 4n − 3 pour n = 0.", type: "number", acceptable: ["-3"], hintFr: "4 × 0 − 3 = 0 − 3 = ?" },
  ],
  poolSize: 5,
};

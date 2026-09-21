import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A11_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A11-1",
    submoduleCode: "A11.1",
    theory: {
      title: {
        fr: "Notion de fonction",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Qu'est-ce qu'une fonction ?",
          black: true,
        },
        {
          type: "plain",
          fr: "Une fonction est une règle qui associe à chaque valeur d'entrée x **une et une seule** valeur de sortie y. On note f(x) = expression en x.",
        },
        {
          type: "rule",
          titleFr: "Vocabulaire essentiel",
          itemsFr: [
            "**x** = valeur d'entrée (antécédent)",
            "**f(x)** = valeur de sortie (image de x)",
            "**Domaine** = ensemble des valeurs d'entrée autorisées",
          ],
        },
        {
          type: "heading",
          fr: "Comment utiliser une fonction",
          black: true,
        },
        {
          type: "highlight",
          fr: "Calculer f(x) pour une valeur donnée",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "f(x) = 2x **+** 3",
            "Pour x = 4 : f(4) = 2 × 4 **+** 3 = 8 **+** 3 = **11**",
            "On dit : « l'image de 4 par f est 11 »",
          ],
        },
        {
          type: "heading",
          fr: "Formes de représentation",
          black: true,
        },
        {
          type: "bullets",
          labelFr: "Une fonction peut être représentée par :",
          itemsFr: [
            "Une **formule** : f(x) = 2x **+** 3",
            "Un **tableau de valeurs** : liste de couples (x, f(x))",
            "Un **graphique** : courbe dans un repère cartésien",
          ],
        },
        {
          type: "table",
          headersFr: ["x", "0", "1", "2", "3", "4"],
          accentHeader: true,
          rows: [
            ["f(x) = 2x **+** 3", "3", "5", "7", "9", "11"],
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a11-1-ep01", promptFr: "f(x) = 3x + 2. Calcule f(4).", type: "number", acceptable: ["14"], hintFr: "3 × 4 + 2 = 12 + 2 = ?" },
    { id: "a11-1-ep02", promptFr: "f(x) = 4x − 1. Calcule f(5).", type: "number", acceptable: ["19"], hintFr: "4 × 5 − 1 = 20 − 1 = ?" },
    { id: "a11-1-ep03", promptFr: "f(x) = x². Calcule f(6).", type: "number", acceptable: ["36"], hintFr: "6² = 6 × 6 = ?" },
    { id: "a11-1-ep04", promptFr: "f(x) = 5x + 3. Calcule f(0).", type: "number", acceptable: ["3"], hintFr: "5 × 0 + 3 = 0 + 3 = ?" },
    { id: "a11-1-ep05", promptFr: "f(x) = x + 7. Calcule f(9).", type: "number", acceptable: ["16"], hintFr: "9 + 7 = ?" },
    { id: "a11-1-ep06", promptFr: "f(x) = 6x − 3. Calcule f(4).", type: "number", acceptable: ["21"], hintFr: "6 × 4 − 3 = 24 − 3 = ?" },
    { id: "a11-1-ep07", promptFr: "f(x) = x² + 3. Calcule f(5).", type: "number", acceptable: ["28"], hintFr: "5² + 3 = 25 + 3 = ?" },
    { id: "a11-1-ep08", promptFr: "f(x) = 7x. Calcule f(8).", type: "number", acceptable: ["56"], hintFr: "7 × 8 = ?" },
    { id: "a11-1-ep09", promptFr: "f(x) = 2x + 5. Calcule f(−2).", type: "number", acceptable: ["1"], hintFr: "2 × (−2) + 5 = −4 + 5 = ?" },
    { id: "a11-1-ep10", promptFr: "f(x) = x² − 6. Calcule f(4).", type: "number", acceptable: ["10"], hintFr: "4² − 6 = 16 − 6 = ?" },
    { id: "a11-1-ep11", promptFr: "f(x) = 8x − 4. Calcule f(3).", type: "number", acceptable: ["20"], hintFr: "8 × 3 − 4 = 24 − 4 = ?" },
    { id: "a11-1-ep12", promptFr: "f(x) = 3x² + 1. Calcule f(2).", type: "number", acceptable: ["13"], hintFr: "3 × 4 + 1 = 12 + 1 = ?" },
  ],
  poolSize: 5,
};

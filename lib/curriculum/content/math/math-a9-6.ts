import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A9_6_LESSON: MathSubmoduleLesson = {
    submoduleId: "A9-6",
    submoduleCode: "A9.6",
    theory: {
      title: {
        fr: "Factorisation",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Qu'est-ce que factoriser ?",
          black: true,
        },
        {
          type: "plain",
          fr: "Factoriser est l'opération inverse du développement : on met un facteur commun en évidence. On passe d'une somme à un produit.",
        },
        {
          type: "highlight",
          fr: "Méthode de factorisation",
        },
        {
          type: "plain",
          fr: "**1.** Identifier le plus grand facteur commun (PGCD) de tous les termes",
        },
        {
          type: "plain",
          fr: "**2.** Le placer devant une parenthèse",
        },
        {
          type: "plain",
          fr: "**3.** Écrire à l'intérieur ce qui reste après division par ce facteur",
        },
        {
          type: "plain",
          fr: "**4.** Vérifier en développant",
        },
        {
          type: "heading",
          fr: "Exemples",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Expression", "Facteur commun", "Forme factorisée"],
          accentHeader: true,
          rows: [
            ["6x **+** 9", "3", "3(2x **+** 3)"],
            ["10a **−** 15", "5", "5(2a **−** 3)"],
            ["4x² **+** 8x", "4x", "4x(x **+** 2)"],
            ["12y **−** 18", "6", "6(2y **−** 3)"],
          ],
        },
        {
          type: "plain",
          fr: "3(2x **+** 3) = 6x **+** 9 ✓",
        },
        {
          type: "plain",
          fr: "5(2a **−** 3) = 10a **−** 15 ✓",
        },
        {
          type: "plain",
          fr: "4x(x **+** 2) = 4x² **+** 8x ✓",
        },
        {
          type: "plain",
          fr: "La vérification est indispensable : en développant le résultat factorisé, on doit retrouver exactement l'expression de départ.",
        },
      ],
    },
  exercises: [],
  exercisePool: [],
  poolSize: 5,
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A9_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "A9-4",
    submoduleCode: "A9.4",
    theory: {
      title: {
        fr: "Réduire une expression",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Termes semblables",
          black: true,
        },
        {
          type: "plain",
          fr: "Des termes semblables sont des termes qui ont la même variable. On peut les additionner ou soustraire en regroupant leurs coefficients.",
        },
        {
          type: "highlight",
          fr: "Exemples",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "**5x** et **3x**     (même variable **x**, même exposant 1)",
            "**4a²** et **−**2**a²** (même variable **a**, même exposant 2)",
            "**7** et **−**3**      (deux termes constants)",
          ],
        },
        {
          type: "heading",
          fr: "Termes NON semblables",
          black: true,
        },
        {
          type: "plain",
          fr: "Les termes qui ont des exposants différents ou des variables différentes ne peuvent pas se regrouper.",
        },
        {
          type: "highlight",
          fr: "Exemples",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "**3x** et **3x²**    (exposants différents)",
            "**4x** et **4y**     (variables différentes)",
            "**5a** et **5** (l'un a une variable, l'autre non)",
          ],
        },
        {
          type: "heading",
          fr: "Exemples de réduction",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Expression", "Réduction", "Résultat"],
          accentHeader: true,
          rows: [
            ["3x **+** 5x", "(**+**3 **+** 5)x", "8x"],
            ["7a **−** 2a", "(7 **−** 2)a", "5a"],
            ["4x **+** 3 **+** 2x **−** 1", "(4 **+** 2)x **+** (3 **−** 1)", "6x **+** 2"],
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [],
  poolSize: 5,
};

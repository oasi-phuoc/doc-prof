import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A9_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A9-2",
    submoduleCode: "A9.2",
    theory: {
      title: {
        fr: "Variable et inconnue",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Les lettres en algèbre",
          black: true,
        },
        {
          type: "plain",
          fr: "En algèbre, une lettre peut représenter un nombre. On l'appelle une **variable** ou une **inconnue** selon le contexte.",
        },
        {
          type: "table",
          headersFr: ["Terme", "Définition", "Exemple"],
          accentHeader: true,
          rows: [
            ["Variable", "Nombre qui peut changer de valeur", "x = longueur d'un rectangle"],
            ["Inconnue", "Nombre fixe mais inconnu, à trouver", "x dans 3x **+** 5 = 20"],
          ],
        },
        {
          type: "heading",
          fr: "Différence entre variable et inconnue",
          black: true,
        },
        {
          type: "highlight",
          fr: "Variable",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Dans l'expression 3x **+** 5, x est une **variable** : elle peut prendre n'importe quelle valeur.",
            "On peut calculer la valeur de l'expression pour différentes valeurs de x.",
          ],
        },
        {
          type: "highlight",
          fr: "Inconnue",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Dans l'équation 3x **+** 5 = 20, x est une **inconnue** : il y a une valeur précise à trouver.",
            "Ici, x = 5 est la seule valeur qui vérifie l'équation.",
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [],
  poolSize: 5,
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A5-1",
    submoduleCode: "A5.1",
    theory: {
      title: { fr: "Lire et arrondir les décimaux",},
      blocks: [
        { type: "heading", fr: "Structure d'un nombre décimal", black: true },
        { type: "highlight", fr: "Définition" },
        {
          type: "section", labelFr: "", itemsFr: [
            "Un nombre décimal contient une **virgule**.",
            "Avant la virgule → **partie entière** (milliers, centaines, dizaines, unités)",
            "Après la virgule → **partie décimale** (dixièmes, centièmes, millièmes)",
          ],
        },
        {
          type: "table",
          headersFr: ["M", "C", "D", "U", "", "dx", "cx"],
          accentHeader: true,
          rows: [["4", "3", "2", "1", ",", "9", "8"]],
        },
        { type: "plain", fr: "" },
        {
          type: "section", labelFr: "Valeur de chaque chiffre :", itemsFr: [
            "4 → 4 milliers = 4 000",
            "3 → 3 centaines = 300",
            "2 → 2 dizaines = 20",
            "1 → 1 unité = 1",
            "9 → 9 **dixièmes** = 0,9",
            "8 → 8 **centièmes** = 0,08",
          ],
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Zéros après la virgule", black: true },
        { type: "highlight", fr: "Zéros inutiles" },
        { type: "plain", fr: "On peut ajouter des zéros à droite de la partie décimale sans changer la valeur." },
        {
          type: "section", labelFr: "", itemsFr: [
            "4,2 = 4,2**0** = 4,2**00**",
          ],
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Comparer et ordonner", black: true },
        { type: "highlight", fr: "Méthode" },
        {
          type: "section", labelFr: "", itemsFr: [
            "**1**. Comparer les parties entières en premier.",
            "**2**. Si égales → comparer les dixièmes, puis les centièmes…",
            "**3**. Ajouter des zéros si nécessaire : 3,5 = 3,50",
          ],
        },
        {
          type: "table",
          headersFr: ["Comparaison", "Résultat", "Raison"],
          accentHeader: true,
          rows: [
            ["3,5 et 3,50", "3,5 = 3,50", "mêmes valeurs"],
            ["4,7 et 4,69", "4,7 > 4,69", "dixième : 7 > 6"],
            ["2,04 et 2,40", "2,04 < 2,40", "dixième : 0 < 4"],
          ],
        },
      ],
      paragraphs: { fr: [] },
    },
    exercises: [],
    exercisePool: [],
    poolSize: 5,
  };

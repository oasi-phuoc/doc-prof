import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A8_5_LESSON: MathSubmoduleLesson = {
    submoduleId: "A8-5",
    submoduleCode: "A8.5",
    theory: {
      title: {
        fr: "Priorité des opérations",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Qu'est-ce que la priorité des opérations ?",
          black: true,
        },
        {
          type: "plain",
          fr: "Lorsqu'un calcul contient plusieurs opérations, il faut les effectuer dans un ordre précis.",
        },
        { type: "highlight", fr: "Ordre des priorités" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "**1.** Parenthèses ( ), crochets [ ] et accolades { } — de l'intérieur vers l'extérieur",
            "**2.** Puissances et racines carrées",
            "**3.** Multiplications × et divisions ÷ (de gauche à droite)",
            "**4.** Additions + et soustractions − (de gauche à droite)",
          ],
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Exemples", black: true },
        {
          type: "plain",
          fr: "3 + 4 × 2",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "On effectue d'abord la multiplication : 4 × 2 = 8",
            "Puis l'addition : 3 + 8 = **11**",
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "plain",
          fr: "(3 + 4) × 2",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "On effectue d'abord les parenthèses : 3 + 4 = 7",
            "Puis la multiplication : 7 × 2 = **14**",
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "plain",
          fr: "2² + 3 × 4 − 1",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Puissance : 2² = 4",
            "Multiplication : 3 × 4 = 12",
            "De gauche à droite : 4 + 12 − 1 = **15**",
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "plain",
          fr: "{[2 + (3 × 4)] − 5} × 2",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Parenthèses ( ) : 3 × 4 = 12  →  {[2 + 12] − 5} × 2",
            "Crochets [ ] : 2 + 12 = 14  →  {14 − 5} × 2",
            "Accolades { } : 14 − 5 = 9  →  9 × 2",
            "Multiplication : 9 × 2 = **18**",
          ],
        },
      ],
    },
    exercises: [],
    exercisePool: [],
    poolSize: 0,
  };

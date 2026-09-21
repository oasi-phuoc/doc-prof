import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A8_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A8-2",
    submoduleCode: "A8.2",
    theory: {
      title: {
        fr: "Calcul de puissances",
      },
      paragraphs: { fr: [] },
      blocks: [
        { type: "highlight", fr: "Addition et soustraction" },
        {
          type: "plain",
          fr: "Quand il y a une addition ou une soustraction de puissances, il faut toujours calculer chaque puissance séparément.",
        },
        { type: "plain", fr: "2**³** + 3**²**" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "2**³** = 2 × 2 × 2 = 8",
            "3**²** = 3 × 3 = 9",
            "→ 8 + 9 = 17",
          ],
        },
        { type: "plain", fr: "" },
        { type: "plain", fr: "5**²** − 3**²**" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "5**²** = 5 × 5 = 25",
            "3**²** = 3 × 3 = 9",
            "→ 25 − 9 = 16",
          ],
        },
        { type: "heading", fr: "Multiplication", black: true },
        { type: "plain", fr: "Lorsque l'on multiplie deux puissances qui ont la même base, on conserve la base et on additionne les exposants." },
        { type: "table", headersFr: ["aᵐ × aⁿ = aᵐ⁺ⁿ"], accentHeader: true, rows: [] },
        { type: "plain", fr: "2**³** × 2**²** = 2**³⁺²** = 2**⁵** = 32" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "2**³** = 2 × 2 × 2",
            "2**²** = 2 × 2",
            "(2 × 2 × 2) × (2 × 2)",
            "**→** 2 × 2 × 2 × 2 × 2 = 2**⁵** = 32",
          ],
        },
        { type: "heading", fr: "Division", black: true },
        { type: "plain", fr: "Lorsque l'on divise deux puissances qui ont la même base, on conserve la base et on soustrait les exposants." },
        { type: "table", headersFr: ["aⁿ ÷ aᵐ = aⁿ⁻ᵐ"], accentHeader: true, rows: [] },
        { type: "plain", fr: "2**⁵** ÷ 2**²** = 2**⁵⁻²** = 2**³** = 8" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "2**⁵** = 2 × 2 × 2 × 2 × 2",
            "2**²** = 2 × 2",
            "(2 × 2 × 2 × 2 × 2) ÷ (2 × 2)",
            "**→** 2 × 2 × 2 = 2**³** = 8",
          ],
        },
        { type: "heading", fr: "Puissance d'une puissance", black: true },
        { type: "plain", fr: "Lorsqu'une puissance est elle-même élevée à une autre puissance, on conserve la base et on multiplie les exposants." },
        { type: "table", headersFr: ["(aᵐ)ⁿ = aᵐˣⁿ"], accentHeader: true, rows: [] },
        { type: "plain", fr: "(2**³**)**²**" },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "= (2 × 2 × 2)**²**",
            "= (2 × 2 × 2) × (2 × 2 × 2)",
            "**→** 2 × 2 × 2 × 2 × 2 × 2 = 2**⁶** = 64",
          ],
        },
      ],
    },
    exercises: [],
    exercisePool: [],
    poolSize: 0,
  };

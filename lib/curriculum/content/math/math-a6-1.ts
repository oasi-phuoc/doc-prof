import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A6_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A6-1",
    submoduleCode: "A6.1",
    theory: {
      title: { fr: "Notion de pourcentage",},
      paragraphs: {
        fr: [
          "Un pourcentage est une fraction dont le dénominateur est 100. Le symbole est %. Exemple : 35% = 35/100 = 0,35.",
          "On utilise les pourcentages pour comparer des quantités sur une même base de 100. Exemple : 75% de réussite signifie 75 élèves sur 100 ont réussi.",
          "Conversion : fraction → % : multiplier par 100. Exemple : 3/4 × 100 = 75%. Décimal → % : multiplier par 100. Exemple : 0,6 × 100 = 60%.",
        ],
      },
      blocks: [
        { type: "plain", fr: "Un **pourcentage** exprime une partie sur cent. Le symbole **%** signifie « pour cent ». On utilise les pourcentages pour comparer des quantités sur une même base de 100." },
        { type: "plain", fr: "" },
        { type: "highlight", fr: "Définition" },
        { type: "section", labelFr: "", itemsFr: [
          "**p%** signifie p parties sur 100",
          "**p%** = p/100 (fraction) = p ÷ 100 (décimal)",
          "Exemple : 35% = 35/100 = 0,35",
        ]},
        { type: "plain", fr: "" },
        { type: "heading", fr: "Conversions : pourcentage, fraction, décimal", black: true },
        { type: "table", headersFr: ["Pourcentage", "Fraction", "Décimal"], accentHeader: true,
          rows: [
            ["0%", "0", "0,00"],
            ["10%", "1/10", "0,10"],
            ["25%", "1/4", "0,25"],
            ["50%", "1/2", "0,50"],
            ["75%", "3/4", "0,75"],
            ["100%", "1", "1,00"],
            ["200%", "2", "2,00"],
          ]
        },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Convertir une fraction en pourcentage" },
        { type: "section", labelFr: "", itemsFr: [
          "**1.** Diviser le numérateur par le dénominateur",
          "**2.** Multiplier le résultat par 100",
        ]},
        { type: "section", labelFr: "", itemsFr: [
          "3/4 → 3 ÷ 4 = 0,75 → 0,75 × 100 = 75%",
          "1/5 → 1 ÷ 5 = 0,20 → 0,20 × 100 = 20%",
        ]},
        { type: "plain", fr: "" },
        { type: "heading", fr: "Convertir un décimal en pourcentage" },
        { type: "plain", fr: "Multiplier le nombre décimal par 100" },
        { type: "section", labelFr: "", itemsFr: [
          "0,08 × 100 = 8%",
          "1,2 × 100 = 120%",
        ]},
        { type: "plain", fr: "" },
        { type: "highlight", fr: "Astuce" },
        { type: "section", labelFr: "", itemsFr: [
          "Un pourcentage peut dépasser 100% !",
          "120% signifie 1,2 fois la quantité de départ.",
          "75% de réussite signifie 75 élèves sur 100 ont réussi.",
        ]},
      ],
    },
    exercises: [],
    exercisePool: [],
  };

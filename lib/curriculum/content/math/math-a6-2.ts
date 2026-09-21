import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A6_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A6-2",
    submoduleCode: "A6.2",
    theory: {
      title: { fr: "Pourcentage d'un nombre",},
      paragraphs: {
        fr: [
          "Pour calculer p% d'un nombre N, on multiplie N par p/100 (ou par le décimal équivalent).",
          "Formule : p% de N = N × p/100 = N × (p ÷ 100).",
          "Exemples : 20% de 150 = 150 × 20/100 = 150 × 0,2 = 30. 15% de 80 = 80 × 0,15 = 12.",
        ],
      },
      blocks: [
        { type: "heading", fr: "Comment calculer le pourcentage", black: true },
        { type: "plain", fr: "Pour calculer p% d'un nombre N, on multiplie N par p/100 (ou par le décimal équivalent)." },
        { type: "plain", fr: "" },
        { type: "highlight", fr: "Formule" },
        { type: "section", labelFr: "", itemsFr: [
          "p% de N = N × p ÷ 100",
        ]},
        { type: "plain", fr: "" },
        { type: "heading", fr: "Méthode pas à pas" },
        { type: "section", labelFr: "", itemsFr: [
          "**1.** Multiplier le **nombre** par le **pourcentage**",
          "**2.** Diviser le résultat par **100**",
        ]},
        { type: "plain", fr: "" },
        { type: "section", labelFr: "", itemsFr: [
          "20% de 150 élèves",
          "**150** × **20** = 3000",
          "3000 ÷ **100** = 30 élèves",
        ]},
        { type: "plain", fr: "" },
        { type: "heading", fr: "Raccourcis utiles", black: true },
        { type: "table", accentHeader: true,
          headersFr: ["Pourcentage", "", "Méthode rapide"],
          rows: [
            ["**1%** d'un nombre",  "→", "diviser par 100"],
            ["**5%** d'un nombre",  "→", "prendre 10%, puis diviser par 2"],
            ["**10%** d'un nombre", "→", "diviser par 10"],
            ["**20%** d'un nombre", "→", "diviser par 5"],
            ["**25%** d'un nombre", "→", "diviser par 4"],
            ["**50%** d'un nombre", "→", "diviser par 2"],
          ]
        },
        { type: "plain", fr: "" },
        { type: "table", headersFr: ["Calcul", "Astuce rapide", "Résultat"], accentHeader: true,
          rows: [
            ["**1%** de 340",  "340 ÷ **100**",         "3,40"],
            ["**5%** de 340",  "340 ÷ **10** ÷ **2**",  "17"],
            ["**10%** de 340", "340 ÷ **10**",           "34"],
            ["**20%** de 150", "150 ÷ **5**",            "30"],
            ["**25%** de 200", "200 ÷ **4**",            "50"],
            ["**50%** de 80",  "80 ÷ **2**",             "40"],
          ]
        },
        { type: "plain", fr: "" },
        { type: "highlight", fr: "Vérification" },
        { type: "plain", fr: "Si le pourcentage est **inférieur à 100%**, le résultat doit **toujours** être **plus petit** que le nombre de départ." },
        { type: "plain", fr: "" },
        { type: "heading", fr: "Exprimer une partie en pourcentage", black: true },
        { type: "plain", fr: "Parfois on connaît la partie et le total, et on veut savoir quel pourcentage cela représente." },
        { type: "highlight", fr: "Formule" },
        { type: "section", labelFr: "", itemsFr: [
          "Pourcentage = (partie ÷ total) × 100",
          "Résultat en %",
        ]},
        { type: "plain", fr: "" },
        { type: "heading", fr: "Méthode pas à pas" },
        { type: "plain", fr: "Le pourcentage de 30 élèves sur 120" },
        { type: "section", labelFr: "", itemsFr: [
          "**1.** Diviser la **partie** par le **total**",
          "30 ÷ 120 = 0,25",
          "**2.** Multiplier le résultat par **100**",
          "0,25 × **100** = 25",
          "**3.** Ajouter le symbole **%**",
          "25 + **%** = **25%**",
        ]},
        { type: "plain", fr: "" },
        { type: "highlight", fr: "Vérification" },
        { type: "plain", fr: "Le résultat est **toujours entre 0% et 100%** si la partie est **inférieure ou égale au total**." },
      ],
    },
    exercises: [],
  };

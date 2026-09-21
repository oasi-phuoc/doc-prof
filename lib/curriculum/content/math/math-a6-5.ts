import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A6_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "A6-5",
  submoduleCode: "A6.5",
  theory: {
    title: { fr: "Problèmes",},
    paragraphs: {
      fr: [
        "Dans la vie quotidienne, les problèmes de pourcentage combinent souvent plusieurs opérations : calculer un pourcentage, exprimer une partie en %, appliquer une augmentation ou une réduction.",
        "Il faut identifier quelle opération utiliser selon l'énoncé.",
      ],
    },
    blocks: [
      { type: "heading", fr: "Problèmes mixtes de pourcentage", black: true },
      { type: "plain", fr: "Dans la vie quotidienne, les problèmes de pourcentage combinent souvent plusieurs opérations : calculer un pourcentage, exprimer une partie en %, appliquer une augmentation ou une réduction. Il faut identifier quelle opération utiliser." },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Les 4 types de problèmes" },
      { type: "table", headersFr: ["Type de problème", "Formule", "Exemple"], accentHeader: true,
        rows: [
          ["Calculer p% d'une quantité", "N × p ÷ 100", "20% de 150 = 30"],
          ["Exprimer une partie en %", "(partie ÷ total) × 100", "30 sur 120 = 25%"],
          ["Augmenter de p%", "N × (1 + p/100)", "+15% sur 200 = 230"],
          ["Réduire de p%", "N × (1 − p/100)", "−20% sur 200 = 160"],
        ]
      },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Problème combiné : étapes à suivre" },
      { type: "section", labelFr: "Méthode générale", itemsFr: [
        "**1.** Lire attentivement l'énoncé et identifier ce qu'on cherche",
        "**2.** Choisir la bonne formule (calcul, expression, augmentation ou réduction)",
        "**3.** Effectuer le calcul",
        "**4.** Vérifier que la réponse est cohérente (unité, ordre de grandeur)",
      ]},
      { type: "plain", fr: "" },
      { type: "section", labelFr: "", itemsFr: [
        "Article à 80 CHF soldé −25%, puis −10% supplémentaires :",
        "1er solde : 80 × 0,75 = 60 CHF",
        "Solde final : 60 × 0,90 = 54 CHF",
      ]},
      { type: "plain", fr: "" },
      { type: "note", fr: "Deux réductions successives de 20% et 10% donnent : 1 × 0,80 × 0,90 = 0,72, soit une réduction totale de 28%, et non 30%." },
    ],
  },
  exercises: [
    { id: "a6-5-e1", promptFr: "Calculez 20% de 250.", type: "number", acceptable: ["50"] },
    { id: "a6-5-e2", promptFr: "12 élèves sur 40 sont absents. Quel pourcentage ?", type: "short_text", acceptable: ["30%", "30"] },
    { id: "a6-5-e3", promptFr: "Prix 80 CHF soldé −25%, puis −10%. Prix final ?", type: "number", acceptable: ["54"] },
    { id: "a6-5-e4", promptFr: "Salaire de 2 400 CHF augmenté de 5%. Nouveau salaire ?", type: "number", acceptable: ["2520"] },
    { id: "a6-5-e5", promptFr: "Article 120 CHF avec 15% de réduction. Prix payé ?", type: "number", acceptable: ["102"] },
  ],
};

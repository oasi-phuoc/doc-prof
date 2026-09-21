import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A5_7_LESSON: MathSubmoduleLesson = {
  submoduleId: "A5-7",
  submoduleCode: "A5.7",
  theory: {
    title: { fr: "Problèmes" },
    blocks: [
      { type: "heading", fr: "Résoudre un problème avec des décimaux", black: true },
      { type: "highlight", fr: "Même méthode qu'avec les entiers" },
      { type: "plain", fr: "Avec les nombres décimaux, on choisit l'opération selon la **question**, pas selon les mots de l'énoncé. La seule différence : il faut placer la virgule correctement dans la réponse." },
      { type: "section", labelFr: "Méthode", itemsFr: [
        "**1.** Je lis l'énoncé et je comprends la situation.",
        "**2.** Je repère ce qu'on cherche (total, différence, part, nombre de groupes).",
        "**3.** Je choisis l'opération : +, −, ×, ou ÷.",
        "**4.** Je calcule en posant les décimaux en colonne (virgules alignées).",
        "**5.** Je vérifie que ma réponse est raisonnable.",
      ] },
      { type: "plain", fr: "" },
      { type: "theory_tabs", tabs: [
        {
          label: "+ et −",
          blocks: [
            { type: "heading", fr: "Addition et soustraction de décimaux", black: true },
            { type: "highlight", fr: "Aligner les virgules" },
            { type: "section", labelFr: "Règle", itemsFr: [
              "On pose les nombres en colonne : **les virgules sont alignées**.",
              "On complète avec des zéros si nécessaire.",
              "On additionne ou soustrait colonne par colonne (comme pour les entiers).",
            ] },
            { type: "example", fr: "2,45 + 1,3 = 2,45 + 1,30 = 3,75" },
            { type: "section", labelFr: "Quand additionner ?", itemsFr: [
              "Réunir deux quantités : poids + poids, distance + distance, prix + prix",
              "Trouver un total : dépense du matin + dépense du soir",
            ] },
            { type: "section", labelFr: "Quand soustraire ?", itemsFr: [
              "Trouver ce qui reste : total − partie utilisée",
              "Trouver une différence : la plus grande valeur − la plus petite",
            ] },
          ],
        },
        {
          label: "× et ÷",
          blocks: [
            { type: "heading", fr: "Multiplication et division de décimaux", black: true },
            { type: "highlight", fr: "Choisir selon la question" },
            { type: "section", labelFr: "Quand multiplier ?", itemsFr: [
              "Prix unitaire × quantité → coût total",
              "Vitesse × temps → distance",
              "Poids par pièce × nombre → poids total",
            ] },
            { type: "example", fr: "1,50 fr. × 6 articles = 9,00 fr." },
            { type: "section", labelFr: "Quand diviser ?", itemsFr: [
              "Total ÷ nombre de parts → valeur par part",
              "Total ÷ valeur par part → nombre de parts",
            ] },
            { type: "example", fr: "7,2 m de tissu ÷ 4 morceaux = 1,8 m par morceau" },
            { type: "note", fr: "Le résultat d'une division peut avoir une virgule même si le dividende et le diviseur sont entiers. Ex. : 9 ÷ 4 = 2,25" },
          ],
        },
      ] },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A6_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "A6-4",
  submoduleCode: "A6.4",
  theory: {
    title: { fr: "Problèmes" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Problèmes : proportion, taux et pourcentage", black: true },
      { type: "highlight", fr: "Trois outils, une même logique" },
      { type: "plain", fr: "Proportion, taux et pourcentage permettent tous de comparer ou de transférer une relation entre deux grandeurs. On choisit l'outil selon la situation." },
      { type: "theory_tabs", tabs: [
        {
          label: "Proportion",
          blocks: [
            { type: "heading", fr: "Proportionnalité directe", black: true },
            { type: "highlight", fr: "Si une quantité double, l'autre double aussi" },
            { type: "section", labelFr: "Méthode du produit en croix", itemsFr: [
              "On connaît 3 valeurs et on cherche la 4ème.",
              "On pose : a / b = c / x",
              "On calcule : x = (b × c) / a",
            ] },
            { type: "example", fr: "3 kg coûtent 7,50 fr. Combien coûtent 5 kg ?\n3 / 7,50 = 5 / x → x = (5 × 7,50) / 3 = 12,50 fr." },
            { type: "section", labelFr: "Méthode de l'unité (plus simple)", itemsFr: [
              "**1.** Trouver la valeur pour 1 unité.",
              "**2.** Multiplier par le nombre d'unités cherché.",
              "Exemple : 1 kg coûte 7,50 ÷ 3 = 2,50 fr. → 5 kg coûtent 5 × 2,50 = 12,50 fr.",
            ] },
          ],
        },
        {
          label: "Taux",
          blocks: [
            { type: "heading", fr: "Taux et vitesse", black: true },
            { type: "highlight", fr: "Un taux exprime une quantité par unité" },
            { type: "section", labelFr: "Formule distance", itemsFr: [
              "distance = vitesse × temps",
              "vitesse = distance ÷ temps",
              "temps = distance ÷ vitesse",
            ] },
            { type: "example", fr: "Vitesse : 80 km/h. Temps : 2,5 h. Distance = 80 × 2,5 = 200 km" },
            { type: "section", labelFr: "Autres taux", itemsFr: [
              "Débit d'eau : litres par minute",
              "Production : pièces par heure",
              "Salaire : fr. par heure",
            ] },
          ],
        },
        {
          label: "Pourcentage",
          blocks: [
            { type: "heading", fr: "Calculer avec un pourcentage", black: true },
            { type: "highlight", fr: "p% d'une valeur = valeur × p ÷ 100" },
            { type: "section", labelFr: "Formules clés", itemsFr: [
              "**p% de A** = A × p / 100",
              "**Prix après réduction** = prix × (1 − p/100)",
              "**Prix après augmentation** = prix × (1 + p/100)",
              "**Taux de variation** = (valeur finale − valeur initiale) / valeur initiale × 100",
            ] },
            { type: "example", fr: "Réduction de 20% sur 150 fr. → 150 × (1 − 0,20) = 150 × 0,80 = 120 fr." },
            { type: "note", fr: "La plus grande réduction en % ne garantit pas le prix le plus bas. Toujours calculer le prix final." },
          ],
        },
      ] },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

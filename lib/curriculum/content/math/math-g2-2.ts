import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G2_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "G2-2",
  submoduleCode: "G2.2",
  theory: {
    title: { fr: "Unités de capacité, de masse et de temps" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Unités de capacité (liquides)", black: true },
      {
        type: "plain",
        fr: "Les unités de capacité sont organisées autour du **litre (l)**. Chaque unité est **10 fois** plus grande que la suivante.",
      },
      {
        type: "table",
        headersFr: ["kl", "hl", "dal", "l", "dl", "cl", "ml"],
        accentHeader: true,
        rows: [["1 000", "100", "10", "1", "0,1", "0,01", "0,001"]],
        captionFr: "Lien : 1 l = 1 dm³. 1 ml = 1 cm³.",
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["3,5 l = 35 dl = 350 cl = 3 500 ml"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["3 500 ml = 350 cl = 35 dl = 3,5 l"],
      },

      { type: "heading", fr: "Unités de masse", black: true },
      {
        type: "plain",
        fr: "Les unités de masse sont organisées autour du **gramme (g)**. En pratique, on utilise souvent la tonne (t), le kilogramme (kg) et le gramme (g).",
      },
      {
        type: "table",
        headersFr: ["t", "q", "kg", "hg", "dag", "g", "dg", "cg", "mg"],
        accentHeader: true,
        rows: [["1 000 000", "100 000", "1 000", "100", "10", "1", "0,1", "0,01", "0,001"]],
        captionFr: "t = tonne, q = quintal, kg = kilogramme, g = gramme, mg = milligramme.",
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["2,5 kg = 25 hg = 250 dag = 2 500 g"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["2 500 g = 250 dag = 25 hg = 2,5 kg"],
      },

      { type: "heading", fr: "Unités de temps", black: true },
      {
        type: "plain",
        fr: "Contrairement aux autres unités, le temps **ne se divise pas en 10** mais en 60 (minutes/secondes) et 24 (heures/jours).",
      },
      {
        type: "table",
        headersFr: ["siècle", "décennie", "an", "mois", "semaine", "jour (j)", "heure (h)", "minute (min)", "seconde (s)"],
        accentHeader: true,
        rows: [["100 ans", "10 ans", "12 mois", "4 sem.", "7 jours", "24 h", "60 min", "60 s", "—"]],
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["1 h = 60 min = 3 600 s", "1 jour = 24 h = 1 440 min"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "Exemples",
        itemsFr: ["3 600 s = 60 min = 1 h", "1 440 min = 24 h = 1 jour"],
      },
      {
        type: "note",
        fr: "Attention : on ne peut pas convertir les heures comme les autres unités. On écrit 1 h 30 min, et non 1,30 h.",
      },
    ],
  },
  exercises: [
    {
      id: "g2-2-ex1",
      promptFr: "Convertis : 2 L = _____ mL",
      type: "number",
      acceptable: ["2000"],
      hintFr: "1 L = 1 000 mL → 2 × 1 000 = 2 000",
    },
    {
      id: "g2-2-ex2",
      promptFr: "Convertis : 3,5 kg = _____ g",
      type: "number",
      acceptable: ["3500"],
      hintFr: "1 kg = 1 000 g → 3,5 × 1 000 = 3 500",
    },
    {
      id: "g2-2-ex3",
      promptFr: "Convertis : 2 h = _____ min",
      type: "number",
      acceptable: ["120"],
      hintFr: "1 h = 60 min → 2 × 60 = 120",
    },
    {
      id: "g2-2-ex4",
      promptFr: "Convertis : 500 mL = _____ L",
      type: "short_text",
      acceptable: ["0.5", "0,5"],
      hintFr: "1 000 mL = 1 L → 500 ÷ 1 000 = 0,5",
    },
    {
      id: "g2-2-ex5",
      promptFr: "Convertis : 1 min 30 s = _____ s",
      type: "number",
      acceptable: ["90"],
      hintFr: "1 min = 60 s → 60 + 30 = 90 s",
    },
  ],
  exercisePool: [
    { id: "g2-2-pool1", promptFr: "5 L = _____ cL", type: "number", acceptable: ["500"] },
    { id: "g2-2-pool2", promptFr: "250 cL = _____ L", type: "short_text", acceptable: ["2.5", "2,5"] },
    { id: "g2-2-pool3", promptFr: "4 kg = _____ g", type: "number", acceptable: ["4000"] },
    { id: "g2-2-pool4", promptFr: "2 500 g = _____ kg", type: "short_text", acceptable: ["2.5", "2,5"] },
    { id: "g2-2-pool5", promptFr: "3 h = _____ min", type: "number", acceptable: ["180"] },
    { id: "g2-2-pool6", promptFr: "90 min = _____ h _____ min (écrire les heures)", type: "number", acceptable: ["1"] },
    { id: "g2-2-pool7", promptFr: "1 t = _____ kg", type: "number", acceptable: ["1000"] },
    { id: "g2-2-pool8", promptFr: "3 600 s = _____ h", type: "number", acceptable: ["1"] },
  ],
  poolSize: 5,
};

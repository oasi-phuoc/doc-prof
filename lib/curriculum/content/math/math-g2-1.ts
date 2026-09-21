import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G2_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "G2-1",
  submoduleCode: "G2.1",
  theory: {
    title: { fr: "Unités de longueur, d'aire et de volume" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Unités de longueur", black: true },
      {
        type: "plain",
        fr: "Les unités de longueur sont organisées autour du **mètre (m)**. Chaque unité est **10 fois** plus grande que la suivante.",
      },
      {
        type: "table",
        headersFr: ["km", "hm", "dam", "m"],
        accentHeader: true,
        rows: [["1 000", "100", "10", "1"]],
      },
      {
        type: "table",
        headersFr: ["m", "dm", "cm", "mm"],
        accentHeader: true,
        rows: [["1", "0,1", "0,01", "0,001"]],
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "**× 10**",
        itemsFr: ["Exemple : 3 m = 30 dm = 300 cm = 3 000 mm"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "**÷ 10**",
        itemsFr: ["Exemple : 5 000 m = 500 dam = 50 hm = 5 km"],
      },

      { type: "heading", fr: "Unités d'aire (surface)", black: true },
      {
        type: "plain",
        fr: "Les unités d'aire dérivent du mètre carré **(m²)**. Chaque unité est **100 fois** plus grande que la suivante.",
      },
      {
        type: "table",
        headersFr: ["km²", "hm²", "dam²", "m²"],
        accentHeader: true,
        rows: [["1 000 000", "10 000", "100", "1"]],
        captionFr: "1 hm² = 1 hectare (ha). 1 dam² = 1 are (a).",
      },
      {
        type: "table",
        headersFr: ["m²", "dm²", "cm²", "mm²"],
        accentHeader: true,
        rows: [["1", "0,01", "0,0001", "0,000001"]],
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "**× 100**",
        itemsFr: ["Exemple : 3 m2 = 300 dm2 = 30 000 cm2 = 3 000 000 mm2"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "**÷ 100**",
        itemsFr: ["Exemple : 5 000 000 m2 = 50 000 dam2 = 500 hm2 = 5 km2"],
      },

      { type: "heading", fr: "Unités de volume (solides)", black: true },
      {
        type: "plain",
        fr: "Les unités de volume dérivent du mètre cube **(m³)**. Chaque unité est **1 000 fois** plus grande que la suivante.",
      },
      {
        type: "table",
        headersFr: ["km³", "hm³", "dam³", "m³"],
        accentHeader: true,
        rows: [["1 000 000 000", "1 000 000", "1 000", "1"]],
      },
      {
        type: "table",
        headersFr: ["m³", "dm³", "cm³", "mm³"],
        accentHeader: true,
        rows: [["1", "0,001", "0,000001", "0,000000001"]],
        captionFr: "1 dm³ = 1 litre (L). 1 cm³ = 1 mL.",
      },
      { type: "highlight", fr: "Règle de conversion" },
      { type: "plain", fr: "Vers la **droite**" },
      {
        type: "section",
        labelFr: "**× 1000**",
        itemsFr: ["Exemple : 3 m3 = 3 000 dm3 = 3 000 000 cm3"],
      },
      { type: "plain", fr: "Vers la **gauche**" },
      {
        type: "section",
        labelFr: "**÷ 1000**",
        itemsFr: ["Exemple : 5 000 000 m3 = 5 000 dam3 = 5 hm3"],
      },
      {
        type: "example",
        fr: "Ex. 2 m³ = 2 000 dm³ = 2 000 000 cm³",
      },
      {
        type: "note",
        fr: "Lien important : 1 dm³ = 1 L (litre). Utile pour les conversions entre volume et capacité.",
      },
    ],
  },
  exercises: [
    {
      id: "g2-1-ex1",
      promptFr: "Convertis : 3 km = _____ m",
      type: "number",
      acceptable: ["3000"],
      hintFr: "1 km = 1 000 m → 3 × 1 000 = 3 000",
    },
    {
      id: "g2-1-ex2",
      promptFr: "Convertis : 250 cm = _____ m",
      type: "short_text",
      acceptable: ["2.5", "2,5"],
      hintFr: "100 cm = 1 m → 250 ÷ 100 = 2,5",
    },
    {
      id: "g2-1-ex3",
      promptFr: "Convertis : 4 m² = _____ dm²",
      type: "number",
      acceptable: ["400"],
      hintFr: "1 m² = 100 dm² → 4 × 100 = 400",
    },
    {
      id: "g2-1-ex4",
      promptFr: "Convertis : 5 000 cm² = _____ m²",
      type: "short_text",
      acceptable: ["0.5", "0,5"],
      hintFr: "10 000 cm² = 1 m² → 5 000 ÷ 10 000 = 0,5",
    },
    {
      id: "g2-1-ex5",
      promptFr: "Convertis : 2 m³ = _____ dm³",
      type: "number",
      acceptable: ["2000"],
      hintFr: "1 m³ = 1 000 dm³ → 2 × 1 000 = 2 000",
    },
  ],
  exercisePool: [
    { id: "g2-1-pool1", promptFr: "5 km = _____ m", type: "number", acceptable: ["5000"] },
    { id: "g2-1-pool2", promptFr: "320 cm = _____ m", type: "short_text", acceptable: ["3.2", "3,2"] },
    { id: "g2-1-pool3", promptFr: "1,5 m = _____ cm", type: "number", acceptable: ["150"] },
    { id: "g2-1-pool4", promptFr: "7 m² = _____ dm²", type: "number", acceptable: ["700"] },
    { id: "g2-1-pool5", promptFr: "3 dm³ = _____ cm³", type: "number", acceptable: ["3000"] },
    { id: "g2-1-pool6", promptFr: "45 mm = _____ cm", type: "short_text", acceptable: ["4.5", "4,5"] },
    { id: "g2-1-pool7", promptFr: "2,5 km = _____ m", type: "number", acceptable: ["2500"] },
    { id: "g2-1-pool8", promptFr: "1 ha = _____ m²", type: "number", acceptable: ["10000"] },
  ],
  poolSize: 5,
};

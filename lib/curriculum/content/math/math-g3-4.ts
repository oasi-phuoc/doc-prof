import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G3_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G3-4",
  submoduleCode: "G3.4",
  theory: {
    title: { fr: "Périmètre des polygones réguliers" },
    blocks: [
      { type: "heading", fr: "Polygone régulier", black: true },
      {
        type: "plain",
        fr: "Un polygone régulier a **tous ses côtés de même longueur** (c). Son périmètre est :",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["P = n × c", "(n = nombre de côtés, c = longueur d'un côté)"] },

      {
        type: "table",
        headersFr: ["Polygone", "n", "Exemple (c = 5 cm)", "P"],
        accentHeader: true,
        colAligns: ["left", "center", "left", "center"],
        rows: [
          ["Triangle équilatéral", "3", "3 × 5", "15 cm"],
          ["Carré", "4", "4 × 5", "20 cm"],
          ["Pentagone", "5", "5 × 5", "25 cm"],
          ["Hexagone", "6", "6 × 5", "30 cm"],
          ["Octogone", "8", "8 × 5", "40 cm"],
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,8 72,32 60,70 20,70 8,32' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Pentagone (5 × c)",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,6 68,22 68,56 40,72 12,56 12,22' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Hexagone (6 × c)",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,6 58,12 70,28 70,52 58,68 40,74 22,68 10,52 10,28 22,12' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Octogone (8 × c)",
          },
        ],
      },

      { type: "highlight", fr: "Polygone quelconque" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Pour un polygone non régulier : P = **somme de tous les côtés**."],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g2-4-e1", promptFr: "Périmètre d'un hexagone régulier de côté 5 cm.", type: "number", acceptable: ["30"] },
    { id: "g2-4-e2", promptFr: "Périmètre d'un octogone régulier de côté 3 cm.", type: "number", acceptable: ["24"] },
    { id: "g2-4-e3", promptFr: "Un polygone régulier a un périmètre de 40 cm et des côtés de 8 cm. Combien de côtés ?", type: "number", acceptable: ["5"] },
    { id: "g2-4-e4", promptFr: "Périmètre d'un pentagone régulier de côté 7 cm.", type: "number", acceptable: ["35"] },
    { id: "g2-4-e5", promptFr: "Périmètre d'un triangle équilatéral de côté 9 cm.", type: "number", acceptable: ["27"] },
  ],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G3_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "G3-1",
  submoduleCode: "G3.1",
  theory: {
    title: { fr: "Périmètre du carré" },
    blocks: [
      { type: "heading", fr: "Qu'est-ce que le périmètre ?", black: true },
      {
        type: "plain",
        fr: "Le **périmètre** est la longueur totale du contour d'une figure. On le mesure en unités de longueur (cm, m, km…).",
      },

      { type: "heading", fr: "Carré", black: true },
      {
        type: "plain",
        fr: "Un carré a **4 côtés égaux**. On note c la longueur d'un côté.",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["P = 4 × c"] },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Carré de côté 7 cm :",
          "P = 4 × 7 = **28 cm**",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:180px;display:block;margin:0 auto'>
  <rect x='30' y='30' width='80' height='80' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='3'/>
  <text x='70' y='22' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>c</text>
  <text x='70' y='128' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>c</text>
  <text x='20' y='75' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>c</text>
  <text x='120' y='75' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>c</text>
</svg>`,
        captionFr: "Carré de côté c — P = 4 × c",
      },

      { type: "highlight", fr: "Retrouver le côté" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Si on connaît le périmètre : c = P ÷ 4"],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g2-1-e1", promptFr: "Calcule le périmètre d'un carré de côté 9 cm.", type: "number", acceptable: ["36"] },
    { id: "g2-1-e2", promptFr: "Un carré a un périmètre de 48 cm. Quel est son côté ?", type: "number", acceptable: ["12"] },
    { id: "g2-1-e3", promptFr: "Calcule le périmètre d'un carré de côté 4,5 cm.", type: "number", acceptable: ["18"] },
    { id: "g2-1-e4", promptFr: "Combien de côtés a un carré ?", type: "number", acceptable: ["4"] },
    { id: "g2-1-e5", promptFr: "Un carré de côté 6 m : P = ?", type: "number", acceptable: ["24"] },
  ],
};

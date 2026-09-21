import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_7_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-7",
  submoduleCode: "G4.7",
  theory: {
    title: { fr: "Losange" },
    blocks: [
      { type: "heading", fr: "Losange", black: true },
      {
        type: "plain",
        fr: "Un **losange** est un quadrilatère dont les quatre côtés ont la même longueur. On peut calculer son **périmètre** avec le côté, et son **aire** avec les diagonales.",
      },

      {
        type: "rule",
        titleFr: "Formules",
        itemsFr: ["P = 4 × c", "A = (d₁ × d₂) ÷ 2"],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 240 180' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:320px;display:block;margin:0 auto;overflow:visible'>
  <polygon points='120,25 205,90 120,155 35,90' fill='var(--color-accent-alg)' fill-opacity='0.18' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
  <line x1='35' y1='90' x2='205' y2='90' stroke='#6b7280' stroke-width='1.5' stroke-dasharray='5 4'/>
  <line x1='120' y1='25' x2='120' y2='155' stroke='#6b7280' stroke-width='1.5' stroke-dasharray='5 4'/>
  <text x='120' y='104' text-anchor='middle' font-size='12' fill='var(--color-text-secondary)' font-family='sans-serif'>d₁</text>
  <text x='130' y='92' text-anchor='start' font-size='12' fill='var(--color-text-secondary)' font-family='sans-serif'>d₂</text>
  <text x='70' y='57' text-anchor='middle' font-size='12' fill='var(--color-text-secondary)' font-family='sans-serif'>c</text>
</svg>`,
        captionFr: "Losange : quatre côtés égaux et deux diagonales",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Losange de côté 5 cm, diagonales 6 cm et 8 cm :",
          "P = 4 × 5 = **20 cm**",
          "A = (6 × 8) ÷ 2 = **24 cm²**",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
};

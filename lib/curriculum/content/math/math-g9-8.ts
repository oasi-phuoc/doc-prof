import type { MathSubmoduleLesson } from "./math-a1-types";

const pyramidSvg = `<svg viewBox='0 0 230 175' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:300px;display:block;margin:0 auto'>
  <polygon points='45,130 155,130 195,92 85,92' fill='var(--color-accent-alg)' fill-opacity='.10' stroke='var(--color-accent-alg)' stroke-width='2.4'/>
  <path d='M118 32 L45 130 M118 32 L155 130 M118 32 L195 92 M118 32 L85 92' fill='none' stroke='var(--color-accent-alg)' stroke-width='2.4'/>
  <line x1='118' y1='32' x2='118' y2='112' stroke='var(--color-text-secondary)' stroke-width='1.4' stroke-dasharray='5 5'/>
  <text x='200' y='78' font-size='13' fill='var(--color-text-primary)'>h</text>
  <text x='116' y='151' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>base B</text>
</svg>`;

export const MATH_G9_8_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-8",
  submoduleCode: "G9.8",
  theory: {
    title: { fr: "Volume de la pyramide" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume de la pyramide", black: true },
      { type: "plain", fr: "Une pyramide a une base et des faces triangulaires qui se rejoignent en un sommet." },
      { type: "svg", markup: pyramidSvg, noFrame: true },
      { type: "highlight", fr: "Formule" },
      { type: "section", labelFr: "V = (B × h) ÷ 3", itemsFr: ["B est l'aire de la base.", "h est la hauteur perpendiculaire entre le sommet et la base."] },
      { type: "example", fr: "Base carrée de côté 6 cm : B = 36 cm². Hauteur 9 cm : V = 36 × 9 ÷ 3 = 108 cm³." },
      { type: "note", fr: "Une pyramide a le tiers du volume d'un prisme de même base et de même hauteur." },
    ],
  },
  exercises: [
    { id: "g9-8-e1", promptFr: "Pyramide à base carrée 4 cm, hauteur 6 cm. V = ?", type: "number", acceptable: ["32"] },
    { id: "g9-8-e2", promptFr: "Pyramide à base rectangulaire 6×4 cm, hauteur 9 cm. V = ?", type: "number", acceptable: ["72"] },
    { id: "g9-8-e3", promptFr: "Pyramide B = 30 cm², h = 6 cm. V = ?", type: "number", acceptable: ["60"] },
    { id: "g9-8-e4", promptFr: "Pyramide triangulaire : B = 12 cm², h = 5 cm. V = ?", type: "number", acceptable: ["20"] },
    { id: "g9-8-e5", promptFr: "Si un prisme a V = 90 cm³, la pyramide de même base et hauteur a V = ?", type: "number", acceptable: ["30"] },
  ],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-3",
  submoduleCode: "G4.3",
  theory: {
    title: { fr: "Aire du triangle" },
    blocks: [
      { type: "heading", fr: "Triangle", black: true },
      {
        type: "plain",
        fr: "L'aire d'un triangle dépend de sa **base (b)** et de sa **hauteur (h)**.",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["A = (b × h) ÷ 2"] },

      { type: "highlight", fr: "Qu'est-ce que la hauteur ?" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La **hauteur** est la **distance perpendiculaire** entre la base et le sommet opposé.",
          "Ce n'est pas la longueur du côté oblique — c'est la ligne droite qui tombe à angle droit sur la base.",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 235 115' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:300px;display:block;margin:0 auto'>
  <polygon points='30,90 150,90 90,15' fill='var(--color-accent-alg)' fill-opacity='0.18' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
  <rect x='80' y='80' width='10' height='10' fill='none' stroke='#f97316' stroke-width='1.5'/>
  <line x1='90' y1='15' x2='208' y2='15' stroke='#f97316' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='150' y1='90' x2='208' y2='90' stroke='#f97316' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='211' y1='15' x2='211' y2='90' stroke='#f97316' stroke-width='2'/>
  <line x1='206' y1='15' x2='216' y2='15' stroke='#f97316' stroke-width='2'/>
  <line x1='206' y1='90' x2='216' y2='90' stroke='#f97316' stroke-width='2'/>
  <text x='90' y='110' text-anchor='middle' font-size='13' fill='var(--color-accent-alg)' font-weight='bold' font-family='sans-serif'>b</text>
  <text x='220' y='56' font-size='13' fill='#f97316' font-weight='bold' font-family='sans-serif'>h</text>
</svg>`,
        captionFr: "Base b et hauteur h (mesurée à l'extérieur, perpendiculaire à b)",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Triangle base 10 cm, hauteur 6 cm :",
          "A = (10 × 6) ÷ 2 = **30 cm²**",
        ],
      },

      { type: "highlight", fr: "Intuition" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le triangle occupe exactement **la moitié** du rectangle de même base et hauteur.",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g3-3-e1", promptFr: "Aire d'un triangle : base 8 cm, hauteur 5 cm.", type: "number", acceptable: ["20"] },
    { id: "g3-3-e2", promptFr: "Aire d'un triangle : base 12 cm, hauteur 9 cm.", type: "number", acceptable: ["54"] },
    { id: "g3-3-e3", promptFr: "Triangle d'aire 30 cm² et base 10 cm. Hauteur = ?", type: "number", acceptable: ["6"] },
    { id: "g3-3-e4", promptFr: "Aire d'un triangle rectangle : cathètes 6 et 8 cm.", type: "number", acceptable: ["24"] },
    { id: "g3-3-e5", promptFr: "Triangle équilatéral de côté 6 cm et hauteur 5,2 cm. Aire ≈ ?", type: "number", acceptable: ["15,6", "15.6"] },
  ],
};

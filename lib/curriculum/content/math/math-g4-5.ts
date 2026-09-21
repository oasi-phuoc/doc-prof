import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-5",
  submoduleCode: "G4.5",
  theory: {
    title: { fr: "Aire du trapèze" },
    blocks: [
      { type: "heading", fr: "Trapèze", black: true },
      {
        type: "plain",
        fr: "Un trapèze a **deux bases parallèles** : la grande base B (en bas) et la petite base b (en haut), reliées par une hauteur h.",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["A = (B + b) × h ÷ 2"] },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 255 125' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:330px;display:block;margin:0 auto'>
  <polygon points='20,95 200,95 165,25 55,25' fill='var(--color-accent-alg)' fill-opacity='0.18' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
  <text x='110' y='18' text-anchor='middle' font-size='12' fill='#16a34a' font-weight='bold' font-family='sans-serif'>b (petite base)</text>
  <text x='110' y='114' text-anchor='middle' font-size='12' fill='var(--color-accent-alg)' font-weight='bold' font-family='sans-serif'>B (grande base)</text>
  <line x1='165' y1='25' x2='220' y2='25' stroke='#f97316' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='200' y1='95' x2='220' y2='95' stroke='#f97316' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='223' y1='25' x2='223' y2='95' stroke='#f97316' stroke-width='2'/>
  <line x1='218' y1='25' x2='228' y2='25' stroke='#f97316' stroke-width='2'/>
  <line x1='218' y1='95' x2='228' y2='95' stroke='#f97316' stroke-width='2'/>
  <text x='233' y='63' font-size='13' fill='#f97316' font-weight='bold' font-family='sans-serif'>h</text>
</svg>`,
        captionFr: "Trapèze — grande base B, petite base b, hauteur h à l'extérieur",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "B = 10 cm, b = 6 cm, h = 4 cm :",
          "A = (10 + 6) × 4 ÷ 2 = 16 × 4 ÷ 2 = **32 cm²**",
        ],
      },

      { type: "highlight", fr: "Intuition" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La formule calcule la **moyenne des deux bases** (= base d'un rectangle équivalent) multipliée par la hauteur.",
          "Si b = B, le trapèze devient un **parallélogramme** (A = B × h).",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g3-5-e1", promptFr: "Aire d'un trapèze : B = 8, b = 4, h = 5 cm.", type: "number", acceptable: ["30"] },
    { id: "g3-5-e2", promptFr: "Aire d'un trapèze : B = 12, b = 6, h = 4 cm.", type: "number", acceptable: ["36"] },
    { id: "g3-5-e3", promptFr: "Trapèze d'aire 40 cm², B = 10, b = 6. h = ?", type: "number", acceptable: ["5"] },
    { id: "g3-5-e4", promptFr: "Aire d'un trapèze : B = 9, b = 3, h = 6 cm.", type: "number", acceptable: ["36"] },
    { id: "g3-5-e5", promptFr: "Si b = B (deux bases égales), quelle figure est-ce ?", type: "short_text", acceptable: ["parallélogramme", "rectangle", "parallelogramme"] },
  ],
};

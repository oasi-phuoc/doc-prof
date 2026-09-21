import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-2",
  submoduleCode: "G4.2",
  theory: {
    title: { fr: "Aire du rectangle" },
    blocks: [
      { type: "heading", fr: "Rectangle", black: true },
      {
        type: "plain",
        fr: "Pour un rectangle de longueur L et de largeur l, l'aire est :",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["A = L × l"] },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 200 110' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:280px;display:block;margin:0 auto'>
  <rect x='25' y='20' width='150' height='70' fill='var(--color-accent-alg)' fill-opacity='0.20' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <line x1='55' y1='20' x2='55' y2='90' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <line x1='85' y1='20' x2='85' y2='90' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <line x1='115' y1='20' x2='115' y2='90' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <line x1='145' y1='20' x2='145' y2='90' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <line x1='25' y1='43' x2='175' y2='43' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <line x1='25' y1='66' x2='175' y2='66' stroke='var(--color-accent-alg)' stroke-width='0.6' opacity='0.4'/>
  <text x='100' y='13' text-anchor='middle' font-size='13' fill='#f97316' font-weight='bold' font-family='sans-serif'>L</text>
  <text x='15' y='58' text-anchor='middle' font-size='13' fill='#16a34a' font-weight='bold' font-family='sans-serif'>l</text>
</svg>`,
        captionFr: "Rectangle L × l — A = L × l",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Rectangle 8 cm × 5 cm :", "A = 8 × 5 = **40 cm²**"],
      },

      { type: "heading", fr: "Conversions d'unités", black: true },
      {
        type: "table",
        headersFr: ["Conversion", "Valeur"],
        accentHeader: true,
        colAligns: ["left", "left"],
        rows: [
          ["1 m² = … cm²", "10 000 cm²"],
          ["1 km² = … m²", "1 000 000 m²"],
          ["1 dm² = … cm²", "100 cm²"],
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g3-2-e1", promptFr: "Aire d'un rectangle 9 cm × 4 cm.", type: "number", acceptable: ["36"] },
    { id: "g3-2-e2", promptFr: "Rectangle d'aire 60 cm² et longueur 12 cm. Largeur = ?", type: "number", acceptable: ["5"] },
    { id: "g3-2-e3", promptFr: "Aire d'un rectangle 7 m × 3 m.", type: "number", acceptable: ["21"] },
    { id: "g3-2-e4", promptFr: "1 m² = combien de cm² ?", type: "number", acceptable: ["10000"] },
    { id: "g3-2-e5", promptFr: "Rectangle 15 cm × 6 cm. Aire = ?", type: "number", acceptable: ["90"] },
  ],
};

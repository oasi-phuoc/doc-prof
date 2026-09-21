import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G3_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "G3-2",
  submoduleCode: "G3.2",
  theory: {
    title: { fr: "Périmètre du rectangle" },
    blocks: [
      { type: "heading", fr: "Rectangle", black: true },
      {
        type: "plain",
        fr: "Un rectangle a **deux longueurs L** (côtés horizontaux) et **deux largeurs l** (côtés verticaux).",
      },

      {
        type: "rule",
        titleFr: "Formule",
        itemsFr: ["P = 2L + 2l", "= 2 × (L + l)"],
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Rectangle 8 cm × 5 cm :",
          "P = 2 × (8 + 5) = 2 × 13 = **26 cm**",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 200 110' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:280px;display:block;margin:0 auto'>
  <rect x='25' y='25' width='150' height='60' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='3'/>
  <text x='100' y='17' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>L</text>
  <text x='100' y='104' text-anchor='middle' font-size='14' fill='#f97316' font-weight='bold' font-family='sans-serif'>L</text>
  <text x='15' y='58' text-anchor='middle' font-size='14' fill='#16a34a' font-weight='bold' font-family='sans-serif'>l</text>
  <text x='185' y='58' text-anchor='middle' font-size='14' fill='#16a34a' font-weight='bold' font-family='sans-serif'>l</text>
</svg>`,
        captionFr: "Rectangle L × l — P = 2(L + l)",
      },

      { type: "highlight", fr: "Retrouver la largeur" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["Si on connaît P et L : l = (P ÷ 2) − L"],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g2-2-e1", promptFr: "Calcule le périmètre d'un rectangle 10 cm × 4 cm.", type: "number", acceptable: ["28"] },
    { id: "g2-2-e2", promptFr: "Rectangle de périmètre 30 cm et longueur 10 cm. Largeur = ?", type: "number", acceptable: ["5"] },
    { id: "g2-2-e3", promptFr: "Calcule le périmètre d'un rectangle 7 m × 3 m.", type: "number", acceptable: ["20"] },
    { id: "g2-2-e4", promptFr: "Un rectangle 6 cm × 6 cm est-il un carré ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    { id: "g2-2-e5", promptFr: "Rectangle 12 cm × 5 cm. Calcule P.", type: "number", acceptable: ["34"] },
  ],
};

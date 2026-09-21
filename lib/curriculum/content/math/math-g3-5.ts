import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G3_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "G3-5",
  submoduleCode: "G3.5",
  theory: {
    title: { fr: "Cercle et π" },
    blocks: [
      { type: "heading", fr: "Circonférence du cercle", black: true },
      {
        type: "plain",
        fr: "La **circonférence** (périmètre du cercle) dépend du rayon r ou du diamètre d.",
      },

      {
        type: "rule",
        titleFr: "Formule",
        itemsFr: ["C = 2 × π × r", "C = π × d", "(d = 2r)"],
      },

      { type: "heading", fr: "π (pi)", black: true },
      {
        type: "plain",
        fr: "π est un nombre irrationnel. On utilise l'approximation **π ≈ 3,14**.",
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:220px;display:block;margin:0 auto'>
  <circle cx='80' cy='80' r='60' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='3.5'/>
  <circle cx='80' cy='80' r='3' fill='var(--color-accent-alg)'/>
  <line x1='80' y1='80' x2='140' y2='80' stroke='#f97316' stroke-width='2.5'/>
  <text x='113' y='73' font-size='12' fill='#f97316' font-weight='bold' font-family='sans-serif'>r</text>
  <text x='55' y='42' font-size='11' fill='var(--color-accent-alg)' font-weight='bold' font-family='sans-serif'>C = 2πr</text>
</svg>`,
        captionFr: "Circonférence C = 2πr (contour du cercle)",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Cercle de rayon 5 cm :",
          "C = 2 × 3,14 × 5 = **31,4 cm**",
        ],
      },

      { type: "highlight", fr: "À ne pas confondre" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**Circonférence C** = longueur du contour (périmètre) → C = 2πr",
          "**Aire du disque A** = surface intérieure → A = πr² (vu en G3.6)",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g2-5-e1", promptFr: "Calcule la circonférence d'un cercle de rayon 10 cm (π ≈ 3,14).", type: "number", acceptable: ["62,8", "62.8"] },
    { id: "g2-5-e2", promptFr: "Calcule la circonférence d'un cercle de diamètre 6 cm (π ≈ 3,14).", type: "number", acceptable: ["18,84", "18.84"] },
    { id: "g2-5-e3", promptFr: "Un cercle a une circonférence de 31,4 cm. Quel est son rayon (π ≈ 3,14) ?", type: "number", acceptable: ["5"] },
    { id: "g2-5-e4", promptFr: "π est approximativement égal à ?", type: "short_text", acceptable: ["3,14", "3.14", "3.14159"] },
    { id: "g2-5-e5", promptFr: "Un cercle de rayon 3 cm : C = 2π × 3 ≈ ? (arrondi à l'unité, π ≈ 3,14)", type: "number", acceptable: ["19"] },
  ],
};

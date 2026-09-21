import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_6_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-6",
  submoduleCode: "G4.6",
  theory: {
    title: { fr: "Aire du disque" },
    blocks: [
      { type: "heading", fr: "Disque", black: true },
      {
        type: "plain",
        fr: "Le **disque** est la surface intérieure délimitée par le cercle. Son aire dépend du rayon r.",
      },

      { type: "rule", titleFr: "Formule", itemsFr: ["A = π × r²"] },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:200px;display:block;margin:0 auto'>
  <circle cx='80' cy='80' r='60' fill='var(--color-accent-alg)' fill-opacity='0.25' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <circle cx='80' cy='80' r='3' fill='var(--color-accent-alg)'/>
  <line x1='80' y1='80' x2='140' y2='80' stroke='#f97316' stroke-width='2.5'/>
  <text x='113' y='73' font-size='12' fill='#f97316' font-weight='bold' font-family='sans-serif'>r</text>
  <text x='56' y='86' font-size='11' fill='var(--color-accent-alg)' font-weight='bold' font-family='sans-serif'>A = πr²</text>
</svg>`,
        captionFr: "L'aire du disque est la surface colorée (intérieur du cercle)",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Disque de rayon 5 cm :",
          "A = π × 5² = π × 25 ≈ 3,14 × 25 = **78,5 cm²**",
        ],
      },

      { type: "highlight", fr: "Si on connaît le diamètre" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "r = d ÷ 2, donc A = π × (d ÷ 2)²",
          "Exemple : d = 8 cm → r = 4 cm → A = π × 16 ≈ **50,24 cm²**",
        ],
      },

      { type: "highlight", fr: "À ne pas confondre" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**Aire du disque** A = πr² (surface intérieure)",
          "**Circonférence** C = 2πr (longueur du contour)",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g3-6-e1", promptFr: "Aire d'un disque de rayon 4 cm (π ≈ 3,14).", type: "number", acceptable: ["50,24", "50.24"] },
    { id: "g3-6-e2", promptFr: "Aire d'un disque de rayon 10 cm (π ≈ 3,14).", type: "number", acceptable: ["314"] },
    { id: "g3-6-e3", promptFr: "Aire d'un disque de diamètre 8 cm (π ≈ 3,14).", type: "number", acceptable: ["50,24", "50.24"] },
    { id: "g3-6-e4", promptFr: "Un disque a une aire de 78,5 cm² (π ≈ 3,14). Quel est son rayon ?", type: "number", acceptable: ["5"] },
    { id: "g3-6-e5", promptFr: "Aire d'un disque de rayon 3 cm (π ≈ 3,14).", type: "number", acceptable: ["28,26", "28.26"] },
  ],
};

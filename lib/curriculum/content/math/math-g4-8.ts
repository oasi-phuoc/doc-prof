import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G4_8_LESSON: MathSubmoduleLesson = {
  submoduleId: "G4-8",
  submoduleCode: "G4.8",
  theory: {
    title: { fr: "Figures composées" },
    blocks: [
      { type: "heading", fr: "Figures composées", black: true },
      {
        type: "plain",
        fr: "Une **figure composée** est formée de plusieurs figures simples assemblées. On calcule son aire en **additionnant** les aires de chaque partie.",
      },

      { type: "rule", titleFr: "Méthode", itemsFr: ["A_totale = A₁ + A₂ + A₃ + …"] },

      { type: "highlight", fr: "Démarche" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**1.** Identifier et dessiner les figures simples qui composent la figure.",
          "**2.** Calculer l'aire de chaque partie séparément.",
          "**3.** Additionner toutes les aires.",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 180 165' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:240px;display:block;margin:0 auto'>
  <rect x='30' y='85' width='120' height='70' fill='var(--color-accent-alg)' fill-opacity='0.18' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <polygon points='30,85 150,85 90,20' fill='#f97316' fill-opacity='0.18' stroke='#f97316' stroke-width='2.5' stroke-linejoin='round'/>
  <text x='90' y='130' text-anchor='middle' font-size='11' fill='var(--color-accent-alg)' font-weight='bold' font-family='sans-serif'>Rectangle</text>
  <text x='90' y='62' text-anchor='middle' font-size='11' fill='#f97316' font-weight='bold' font-family='sans-serif'>Triangle</text>
</svg>`,
        captionFr: "Maison = rectangle + triangle → A = A_rect + A_tri",
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Rectangle 6 × 4 cm + triangle base 6, hauteur 3 cm :",
          "A_rect = 6 × 4 = 24 cm²",
          "A_tri = (6 × 3) ÷ 2 = 9 cm²",
          "A_totale = 24 + 9 = **33 cm²**",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
};

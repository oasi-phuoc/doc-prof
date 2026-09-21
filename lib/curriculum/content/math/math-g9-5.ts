import type { MathSubmoduleLesson } from "./math-a1-types";

const cuboidSvg = `<svg viewBox='0 0 265 170' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:330px;display:block;margin:0 auto'>
  <path d='M55 70 h116 v60 H55 Z' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M55 70 L93 38 h116 l-38 32' fill='none' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M209 38 v60 l-38 32' fill='none' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <text x='113' y='148' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>L</text>
  <text x='220' y='72' font-size='13' fill='var(--color-text-primary)'>l</text>
  <text x='38' y='100' text-anchor='end' font-size='13' fill='var(--color-text-primary)'>h</text>
</svg>`;

export const MATH_G9_5_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-5",
  submoduleCode: "G9.5",
  theory: {
    title: { fr: "Pavé droit" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume du pavé droit", black: true },
      { type: "plain", fr: "Un pavé droit est une boîte rectangulaire. On multiplie les **trois dimensions**." },
      { type: "svg", markup: cuboidSvg, noFrame: true },
      { type: "highlight", fr: "Formule" },
      { type: "section", labelFr: "V = L × l × h", itemsFr: ["L = longueur", "l = largeur", "h = hauteur"] },
      { type: "example", fr: "Pavé de 6 cm, 4 cm et 3 cm : V = 6 × 4 × 3 = 72 cm³." },
      { type: "note", fr: "Pour trouver une dimension manquante : on divise le volume par le produit des deux autres dimensions." },
    ],
  },
  exercises: [
    { id: "g9-5-e1", promptFr: "Volume d'un pavé 5 × 3 × 4 cm.", type: "number", acceptable: ["60"] },
    { id: "g9-5-e2", promptFr: "Volume d'un pavé 10 × 6 × 2 cm.", type: "number", acceptable: ["120"] },
    { id: "g9-5-e3", promptFr: "Pavé V = 120 cm³, L = 5, l = 4. h = ?", type: "number", acceptable: ["6"] },
    { id: "g9-5-e4", promptFr: "Volume d'une pièce 4 m × 3 m × 2,5 m (en m³).", type: "number", acceptable: ["30"] },
    { id: "g9-5-e5", promptFr: "Pavé 8 × 8 × 8 cm. C'est un cube ? (oui/non)", type: "short_text", acceptable: ["oui"] },
  ],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

const prismVolumeSvg = `<svg viewBox='0 0 260 170' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:330px;display:block;margin:0 auto'>
  <polygon points='55,118 88,48 124,118' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <polygon points='126,132 159,62 195,132' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M55 118 L126 132 M88 48 L159 62 M124 118 L195 132' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <text x='91' y='138' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>base B</text>
  <text x='124' y='38' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>h</text>
</svg>`;

export const MATH_G9_6_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-6",
  submoduleCode: "G9.6",
  theory: {
    title: { fr: "Volume du prisme" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume du prisme", black: true },
      { type: "plain", fr: "Un prisme a **deux bases identiques et parallèles**. La base peut être un triangle, un rectangle, un pentagone..." },
      { type: "svg", markup: prismVolumeSvg, noFrame: true },
      { type: "highlight", fr: "Formule" },
      { type: "section", labelFr: "V = aire de la base × hauteur = B × h", itemsFr: ["B est l'aire d'une base.", "h est la distance perpendiculaire entre les deux bases."] },
      { type: "example", fr: "Base triangulaire : B = 12 cm² et hauteur du prisme h = 10 cm. V = 12 × 10 = 120 cm³." },
      { type: "note", fr: "Le pavé droit est un prisme particulier : sa base est un rectangle." },
    ],
  },
  exercises: [
    { id: "g9-6-e1", promptFr: "Prisme à base triangulaire (B = 15 cm²), hauteur 8 cm. V = ?", type: "number", acceptable: ["120"] },
    { id: "g9-6-e2", promptFr: "Prisme à base carrée (côté 4 cm), hauteur 6 cm. V = ?", type: "number", acceptable: ["96"] },
    { id: "g9-6-e3", promptFr: "Prisme : B = 20 cm², V = 100 cm³. h = ?", type: "number", acceptable: ["5"] },
    { id: "g9-6-e4", promptFr: "Prisme triangulaire : triangle base 8, hauteur 6 cm ; prisme h = 10 cm. V = ?", type: "number", acceptable: ["240"] },
    { id: "g9-6-e5", promptFr: "Prisme à base hexagonale (B = 24 cm²), hauteur 5 cm. V = ?", type: "number", acceptable: ["120"] },
  ],
};

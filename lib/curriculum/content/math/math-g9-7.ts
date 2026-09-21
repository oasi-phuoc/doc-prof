import type { MathSubmoduleLesson } from "./math-a1-types";

const cylinderSvg = `<svg viewBox='0 0 220 170' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:280px;display:block;margin:0 auto'>
  <ellipse cx='110' cy='45' rx='55' ry='18' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M55 45 v82 M165 45 v82' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <ellipse cx='110' cy='127' rx='55' ry='18' fill='var(--color-accent-alg)' fill-opacity='.08' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <line x1='110' y1='45' x2='165' y2='45' stroke='#f97316' stroke-width='2.2'/>
  <text x='136' y='38' font-size='13' fill='#f97316' font-weight='bold'>r</text>
  <text x='176' y='90' font-size='13' fill='var(--color-text-primary)'>h</text>
</svg>`;

export const MATH_G9_7_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-7",
  submoduleCode: "G9.7",
  theory: {
    title: { fr: "Volume du cylindre" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume du cylindre", black: true },
      { type: "plain", fr: "Un cylindre fonctionne comme un prisme dont la base est un **disque**." },
      { type: "svg", markup: cylinderSvg, noFrame: true },
      { type: "highlight", fr: "Formule" },
      { type: "section", labelFr: "V = π × r² × h", itemsFr: ["π × r² est l'aire de la base.", "h est la hauteur du cylindre."] },
      { type: "example", fr: "Rayon 3 cm et hauteur 10 cm : V = π × 3² × 10 = 90π ≈ 282,6 cm³." },
    ],
  },
  exercises: [
    { id: "g9-7-e1", promptFr: "Cylindre r=2 cm, h=5 cm. V = π×4×5 ≈ ? (π≈3,14)", type: "number", acceptable: ["62,8", "62.8"] },
    { id: "g9-7-e2", promptFr: "Cylindre r=5 cm, h=10 cm. V ≈ ? (π≈3,14)", type: "number", acceptable: ["785"] },
    { id: "g9-7-e3", promptFr: "Cylindre r=3 cm, V = 141,3 cm³ (π≈3,14). h = ?", type: "number", acceptable: ["5"] },
    { id: "g9-7-e4", promptFr: "Cylindre r=1 cm, h=1 cm. V = π ≈ ? (π≈3,14)", type: "number", acceptable: ["3,14", "3.14"] },
    { id: "g9-7-e5", promptFr: "Un cylindre de rayon 4 cm et hauteur 7 cm. V ≈ ? (π≈3,14)", type: "number", acceptable: ["351,68", "351.68"] },
  ],
};

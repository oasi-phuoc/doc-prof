import type { MathSubmoduleLesson } from "./math-a1-types";

const coneSphereSvg = `<svg viewBox='0 0 310 170' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:380px;display:block;margin:0 auto'>
  <g transform='translate(30 8)'>
    <ellipse cx='65' cy='120' rx='52' ry='16' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.3'/>
    <path d='M13 120 L65 25 L117 120' fill='var(--color-accent-alg)' fill-opacity='.08' stroke='var(--color-accent-alg)' stroke-width='2.3'/>
    <line x1='65' y1='25' x2='65' y2='120' stroke='var(--color-text-secondary)' stroke-width='1.3' stroke-dasharray='5 5'/>
    <line x1='65' y1='120' x2='117' y2='120' stroke='#f97316' stroke-width='2'/>
    <text x='72' y='75' font-size='12' fill='var(--color-text-primary)'>h</text>
    <text x='91' y='113' font-size='12' fill='#f97316' font-weight='bold'>r</text>
  </g>
  <g transform='translate(190 14)'>
    <circle cx='45' cy='75' r='55' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.3'/>
    <line x1='45' y1='75' x2='100' y2='75' stroke='#f97316' stroke-width='2'/>
    <ellipse cx='45' cy='75' rx='55' ry='14' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.2' stroke-dasharray='5 5'/>
    <text x='70' y='68' font-size='12' fill='#f97316' font-weight='bold'>r</text>
  </g>
</svg>`;

export const MATH_G9_9_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-9",
  submoduleCode: "G9.9",
  theory: {
    title: { fr: "Cône et sphère" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume du cône et de la sphère", black: true },
      { type: "svg", markup: coneSphereSvg, noFrame: true },
      { type: "highlight", fr: "Cône" },
      { type: "section", labelFr: "V = (π × r² × h) ÷ 3", itemsFr: ["Le cône a le tiers du volume d'un cylindre de même base et de même hauteur.", "r est le rayon de la base, h est la hauteur."] },
      { type: "example", fr: "Cône r = 3 cm, h = 7 cm : V = π × 3² × 7 ÷ 3 = 21π ≈ 65,9 cm³." },
      { type: "highlight", fr: "Sphère" },
      { type: "section", labelFr: "V = (4 × π × r³) ÷ 3", itemsFr: ["r est le rayon de la sphère.", "La formule utilise le rayon au cube : r × r × r."] },
      { type: "example", fr: "Sphère r = 3 cm : V = 4 × π × 3³ ÷ 3 = 36π ≈ 113,1 cm³." },
    ],
  },
  exercises: [
    { id: "g9-9-e1", promptFr: "Cône r=3 cm, h=4 cm. V = (1/3)π×9×4 ≈ ? (π≈3,14)", type: "number", acceptable: ["37,68", "37.68"] },
    { id: "g9-9-e2", promptFr: "Sphère r=1 cm. V = (4/3)π ≈ ? (π≈3,14)", type: "number", acceptable: ["4,19", "4.19"] },
    { id: "g9-9-e3", promptFr: "Si un cylindre a V=90π cm³, le cône de même base et hauteur a V=?π cm³.", type: "number", acceptable: ["30"] },
    { id: "g9-9-e4", promptFr: "Sphère r=2 cm. V = (4/3)π×8 ≈ ? (π≈3,14)", type: "number", acceptable: ["33,49", "33.49"] },
    { id: "g9-9-e5", promptFr: "Cône r=6 cm, h=7 cm. V ≈ ? (π≈3,14)", type: "number", acceptable: ["263,76", "263.76"] },
  ],
};

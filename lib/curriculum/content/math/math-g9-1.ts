import type { MathSubmoduleLesson } from "./math-a1-types";

const cubeSvg = `<svg viewBox='0 0 180 130' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:220px;display:block;margin:0 auto'>
  <path d='M45 45 h62 v58 H45 Z' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M45 45 L70 22 h62 l-25 23 M107 45 l25-23 v58 l-25 23' fill='none' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <text x='88' y='121' text-anchor='middle' font-size='12' fill='var(--color-text-primary)'>Cube</text>
</svg>`;

const prismSvg = `<svg viewBox='0 0 180 130' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:220px;display:block;margin:0 auto'>
  <polygon points='38,85 70,32 102,85' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <polygon points='78,98 110,45 142,98' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M38 85 L78 98 M70 32 L110 45 M102 85 L142 98' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <text x='90' y='121' text-anchor='middle' font-size='12' fill='var(--color-text-primary)'>Prisme</text>
</svg>`;

const roundSvg = `<svg viewBox='0 0 295 135' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:360px;display:block;margin:0 auto'>
  <g transform='translate(18 8)'>
    <ellipse cx='45' cy='22' rx='32' ry='12' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <path d='M13 22 v62 M77 22 v62' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <ellipse cx='45' cy='84' rx='32' ry='12' fill='var(--color-accent-alg)' fill-opacity='.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <text x='45' y='112' text-anchor='middle' font-size='11' fill='var(--color-text-primary)'>Cylindre</text>
  </g>
  <g transform='translate(112 8)'>
    <ellipse cx='45' cy='84' rx='34' ry='12' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <path d='M11 84 L45 18 L79 84' fill='var(--color-accent-alg)' fill-opacity='.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <text x='45' y='112' text-anchor='middle' font-size='11' fill='var(--color-text-primary)'>Cône</text>
  </g>
  <g transform='translate(218 8)'>
    <circle cx='35' cy='55' r='35' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
    <ellipse cx='35' cy='55' rx='35' ry='10' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.4' stroke-dasharray='4 3'/>
    <text x='35' y='112' text-anchor='middle' font-size='11' fill='var(--color-text-primary)'>Sphère</text>
  </g>
</svg>`;

export const MATH_G9_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-1",
  submoduleCode: "G9.1",
  theory: {
    title: { fr: "Reconnaître les solides" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Solides", black: true },
      { type: "plain", fr: "Un solide est une figure en **3 dimensions**. Il possède une longueur, une largeur et une hauteur." },
      { type: "svg_row", items: [{ markup: cubeSvg }, { markup: prismSvg }] },
      { type: "section", labelFr: "Les solides à faces planes", itemsFr: ["Le **cube** a 6 faces carrées égales.", "Le **pavé droit** a 6 faces rectangulaires.", "Le **prisme** a deux bases identiques et parallèles.", "La **pyramide** a une base et des faces triangulaires qui se rejoignent en un sommet."] },
      { type: "svg", markup: roundSvg, noFrame: true },
      { type: "section", labelFr: "Les solides ronds", itemsFr: ["Le **cylindre** a deux bases circulaires.", "Le **cône** a une base circulaire et un sommet.", "La **sphère** est ronde dans toutes les directions."] },
      { type: "highlight", fr: "Pour calculer un volume, on cherche combien de cubes unités remplissent le solide." },
    ],
  },
  exercises: [
    { id: "g9-1-e1", promptFr: "Combien de faces a un cube ?", type: "number", acceptable: ["6"] },
    { id: "g9-1-e2", promptFr: "Quel solide a une base circulaire et un sommet ?", type: "short_text", acceptable: ["cône", "cone"] },
    { id: "g9-1-e3", promptFr: "Combien d'arêtes a un cube ?", type: "number", acceptable: ["12"] },
    { id: "g9-1-e4", promptFr: "Quel solide est rond dans toutes les directions ?", type: "short_text", acceptable: ["sphère", "sphere"] },
    { id: "g9-1-e5", promptFr: "Un prisme triangulaire a combien de bases ?", type: "number", acceptable: ["2"] },
  ],
};

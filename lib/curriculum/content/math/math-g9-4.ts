import type { MathSubmoduleLesson } from "./math-a1-types";

const cubeVolumeSvg = `<svg viewBox='0 0 230 170' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:300px;display:block;margin:0 auto'>
  <path d='M65 62 h76 v76 H65 Z' fill='var(--color-accent-alg)' fill-opacity='.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M65 62 L96 32 h76 l-31 30' fill='none' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <path d='M172 32 v76 l-31 30' fill='none' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
  <text x='103' y='154' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>c</text>
  <text x='48' y='103' text-anchor='end' font-size='13' fill='var(--color-text-primary)'>c</text>
  <text x='134' y='22' text-anchor='middle' font-size='13' fill='var(--color-text-primary)'>c</text>
</svg>`;

export const MATH_G9_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G9-4",
  submoduleCode: "G9.4",
  theory: {
    title: { fr: "Volume du cube" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Volume du cube", black: true },
      { type: "plain", fr: "Un cube a **3 dimensions égales** : longueur = largeur = hauteur = côté." },
      { type: "svg", markup: cubeVolumeSvg, noFrame: true },
      { type: "highlight", fr: "Formule" },
      { type: "section", labelFr: "V = c × c × c = c³", itemsFr: ["c est la mesure du côté.", "L'unité du volume est une unité **cubique** : cm³, dm³, m³..."] },
      { type: "example", fr: "Cube de côté 4 cm : V = 4 × 4 × 4 = 64 cm³." },
      { type: "note", fr: "Si le volume est connu, on cherche le nombre qui multiplié 3 fois par lui-même donne ce volume." },
    ],
  },
  exercises: [
    { id: "g9-4-e1", promptFr: "Volume d'un cube de côté 3 cm.", type: "number", acceptable: ["27"] },
    { id: "g9-4-e2", promptFr: "Volume d'un cube de côté 5 cm.", type: "number", acceptable: ["125"] },
    { id: "g9-4-e3", promptFr: "Un cube de volume 8 cm³. Quel est son côté ?", type: "number", acceptable: ["2"] },
    { id: "g9-4-e4", promptFr: "1 dm³ = combien de cm³ ?", type: "number", acceptable: ["1000"] },
    { id: "g9-4-e5", promptFr: "Volume d'un cube de côté 10 cm en litres.", type: "number", acceptable: ["1"] },
  ],
};

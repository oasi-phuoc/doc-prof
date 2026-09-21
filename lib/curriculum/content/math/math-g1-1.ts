import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G1_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "G1-1",
  submoduleCode: "G1.1",
  theory: {
    title: { fr: "Reconnaissance" },
    blocks: [
      { type: "heading", fr: "Les polygones réguliers", black: true },

      {
        type: "plain",
        fr: "Un **polygone** est une figure plane fermée formée de segments appelés **côtés**. Les points de jonction des côtés sont les **sommets**.",
      },

      {
        type: "table",
        headersFr: ["Nom", "Côtés"],
        accentHeader: true,
        colAligns: ["left", "center"],
        rows: [
          ["Triangle", "3"],
          ["Quadrilatère", "4"],
          ["Pentagone", "5"],
          ["Hexagone", "6"],
        ],
      },

      { type: "plain", fr: "" },

      {
        type: "svg",
        noFrame: true,
        markup: `<svg viewBox='0 0 260 155' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:300px;display:block;margin:0 auto'>
  <!-- Triangle -->
  <polygon points='130,18 220,128 40,128' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
  <!-- Sommet (top vertex) -->
  <circle cx='130' cy='18' r='4.5' fill='#f97316'/>
  <text x='150' y='22' font-size='13' fill='#f97316' font-family='sans-serif' font-weight='bold'>sommet</text>
  <!-- Côté (bottom side) -->
  <path d='M40,139 L220,139' fill='none' stroke='#f97316' stroke-width='2.2' stroke-linecap='round'/>
  <path d='M40,133 L40,139 M220,133 L220,139' fill='none' stroke='#f97316' stroke-width='2.2' stroke-linecap='round'/>
  <text x='130' y='154' text-anchor='middle' font-size='13' fill='#f97316' font-family='sans-serif' font-weight='bold'>côté</text>
</svg>`,
      },

      { type: "plain", fr: "" },

      { type: "heading", fr: "Les formes", black: true },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,8 74,72 6,72' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Triangle",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <rect x='12' y='12' width='56' height='56' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
</svg>`,
            captionFr: "Carré",
          },
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <rect x='4' y='24' width='72' height='32' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
</svg>`,
            captionFr: "Rectangle",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,8 72,40 40,72 8,40' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Losange",
          },
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='10,65 70,65 55,15 25,15' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Trapèze",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='12,65 58,65 68,15 22,15' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Parallélogramme",
          },
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,8 72,32 60,70 20,70 8,32' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Pentagone",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,6 68,22 68,58 40,74 12,58 12,22' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Hexagone",
          },
        ],
      },

      { type: "plain", fr: "" },

      { type: "heading", fr: "Le cercle", black: true },

      {
        type: "plain",
        fr: "Un **cercle** est l'ensemble de tous les points situés à la même distance d'un point fixe appelé **centre** (O).",
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <circle cx='40' cy='40' r='32' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/>
</svg>`,
            captionFr: "Cercle",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <path d='M 8,50 A 32,32 0 0,1 72,50 Z' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Demi-cercle",
          },
        ],
      },

      { type: "plain", fr: "" },

      { type: "highlight", fr: "Vocabulaire du cercle" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**Rayon (r)** : distance du centre à n'importe quel point du cercle.",
          "**Diamètre (d)** : segment passant par le centre ; d = 2 × r.",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox='0 0 220 155' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:280px;display:block;margin:0 auto'>
  <circle cx='110' cy='78' r='55' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <circle cx='110' cy='78' r='3' fill='var(--color-accent-alg)'/>
  <line x1='110' y1='23' x2='110' y2='133' stroke='var(--color-accent-alg)' stroke-width='2' stroke-dasharray='5 4' opacity='0.7'/>
  <text x='101' y='82' font-size='11' fill='var(--color-accent-alg)' opacity='0.9' font-family='sans-serif' font-weight='bold' text-anchor='end'>d</text>
  <line x1='110' y1='78' x2='165' y2='78' stroke='#f97316' stroke-width='2.5'/>
  <text x='133' y='70' font-size='11' fill='#f97316' font-weight='bold' font-family='sans-serif'>r</text>
</svg>`,
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [],
};

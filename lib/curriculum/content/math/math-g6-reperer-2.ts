import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_REPERER_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "G6-2",
  submoduleCode: "G6.2",
  theory: {
    title: { fr: "Repère cartésien" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Repère cartésien", black: true },
      {
        type: "plain",
        fr: "Pour trouver un point sur la grille, on regarde d'abord sur la **ligne horizontale (x)**, puis sur la **ligne verticale (y)**.",
      },

      {
        type: "plain",
        fr: "1. Je regarde, sur la ligne des **X**, la graduation.",
      },
      {
        type: "plain",
        fr: "2. Le point est placé à **2**.",
      },
      {
        type: "plain",
        fr: "3. Je regarde, sur la ligne des **Y**, la graduation.",
      },
      {
        type: "plain",
        fr: "4. Le point est placé à **4**.",
      },
      {
        type: "plain",
        fr: "5. Les coordonnées du point A sont donc **(2 ; 4)**.",
      },

      {
        type: "svg",
        captionFr: "Point A (2 ; 4)",
        markup: `<svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:260px;display:block;margin:0 auto">
  ${[0,1,2,3,4,5].map(i=>`<line x1="${30+i*32}" y1="20" x2="${30+i*32}" y2="170" stroke="#bfdbfe" stroke-width="1"/>`).join("")}
  ${[0,1,2,3,4,5].map(i=>`<line x1="30" y1="${170-i*30}" x2="190" y2="${170-i*30}" stroke="#bfdbfe" stroke-width="1"/>`).join("")}
  <line x1="30" y1="170" x2="190" y2="170" stroke="#334155" stroke-width="2" marker-end="url(#ax)"/>
  <line x1="30" y1="170" x2="30" y2="20" stroke="#334155" stroke-width="2" marker-end="url(#ay)"/>
  <defs><marker id="ax" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker>
  <marker id="ay" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#334155"/></marker></defs>
  ${[1,2,3,4,5].map(n=>`<text x="${30+n*32}" y="186" text-anchor="middle" font-size="10" fill="#64748b">${n}</text>`).join("")}
  ${[1,2,3,4,5].map(n=>`<text x="18" y="${175-n*30}" text-anchor="middle" font-size="10" fill="#64748b">${n}</text>`).join("")}
  <text x="188" y="186" font-size="11" font-weight="bold" fill="#334155">x</text>
  <text x="18" y="24" font-size="11" font-weight="bold" fill="#334155">y</text>
  <circle cx="94" cy="50" r="5" fill="#1e293b"/>
  <text x="102" y="46" font-size="12" font-weight="bold" fill="#1e293b">A</text>
  <line x1="94" y1="50" x2="94" y2="170" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 3"/>
  <line x1="94" y1="50" x2="30" y2="50" stroke="#1e293b" stroke-width="1" stroke-dasharray="4 3"/>
</svg>`,
      },

      { type: "plain", fr: "" },

      { type: "heading", fr: "Le plan et les quadrants", black: true },
      {
        type: "plain",
        fr: "Un **plan** est la représentation graphique vue d'en haut. C'est une grande grille quadrillée avec deux droites perpendiculaires qui forment **quatre quadrants**.",
      },

      { type: "plain", fr: "" },
    ],
  },
  exercises: [],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G6_REPERER_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "G6-1",
  submoduleCode: "G6.1",
  theory: {
    title: { fr: "Se repérer dans le plan" },
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Repérer une position", black: true },
      { type: "plain", fr: "Pour localiser une case sur une grille, on utilise une **colonne** (lettre) et une **ligne** (chiffre)." },
      { type: "plain", fr: "On écrit sa position sous la forme **(colonne ; ligne)**, par exemple **(d ; 1)**." },

      { type: "highlight", fr: "Observer les tableaux" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La case **jaune** est sur l'emplacement **(B ; 3)**.",
          "On lit d'abord la **colonne**, puis la **ligne**.",
        ],
      },

      {
        type: "svg",
        markup: `<svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px;display:block;margin:0 auto">
  <text x="52" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">a</text>
  <text x="92" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">b</text>
  <text x="132" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">c</text>
  <text x="172" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">d</text>
  <text x="212" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">e</text>
  <text x="252" y="18" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">f</text>
  ${[1, 2, 3, 4, 5, 6].map((r, i) => `<text x="18" y="${52 + i * 36}" font-size="11" fill="var(--color-accent-alg)" font-weight="bold">${r}</text>`).join("")}
  ${[0, 1, 2, 3, 4, 5].map(c => [0, 1, 2, 3, 4, 5].map(r => {
    const x = 40 + c * 40, y = 30 + r * 36, fill = (c === 1 ? "#e2e8f0" : "") || (r === 2 ? "#e2e8f0" : "");
    return `<rect x="${x}" y="${y}" width="36" height="32" fill="${fill || "#fff"}" stroke="#cbd5e1" stroke-width="1"/>`;
  }).join("")).join("")}
  <rect x="80" y="102" width="36" height="32" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
</svg>`,
      },
    ],
  },
  exercises: [],
};

import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G3_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "G3-3",
  submoduleCode: "G3.3",
  theory: {
    title: { fr: "Périmètre du triangle" },
    blocks: [
      { type: "heading", fr: "Triangle", black: true },
      {
        type: "plain",
        fr: "Un triangle a **3 côtés**. Son périmètre est la somme des trois côtés, notés a, b, c.",
      },

      { type: "rule", titleFr: "Formule générale", itemsFr: ["P = a + b + c"] },

      { type: "heading", fr: "Types de triangles", black: true },

      {
        type: "table",
        headersFr: ["Type", "Propriété", "Formule"],
        accentHeader: true,
        colAligns: ["left", "left", "left"],
        rows: [
          ["Équilatéral", "3 côtés égaux", "P = 3a"],
          ["Isocèle", "2 côtés égaux (a), base (b)", "P = 2a + b"],
          ["Scalène", "3 côtés différents", "P = a + b + c"],
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='15,70 75,70 55,12' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Scalène",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,10 72,70 8,70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Isocèle",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <polygon points='40,8 74,72 6,72' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/>
</svg>`,
            captionFr: "Équilatéral",
          },
        ],
      },

      { type: "highlight", fr: "Exemple" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Triangle de côtés 5, 7, 9 cm :",
          "P = 5 + 7 + 9 = **21 cm**",
        ],
      },

      { type: "highlight", fr: "Inégalité triangulaire" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La somme de deux côtés quelconques doit être **supérieure** au troisième côté.",
          "Exemple : 2, 3, 7 → 2 + 3 = 5 < 7 → **impossible** !",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    { id: "g2-3-e1", promptFr: "Calcule P : triangle de côtés 3, 4, 5 cm.", type: "number", acceptable: ["12"] },
    { id: "g2-3-e2", promptFr: "Triangle équilatéral de côté 8 cm. P = ?", type: "number", acceptable: ["24"] },
    { id: "g2-3-e3", promptFr: "Triangle isocèle : deux côtés = 6 cm, base = 4 cm. P = ?", type: "number", acceptable: ["16"] },
    { id: "g2-3-e4", promptFr: "P d'un triangle = 30 cm. Deux côtés sont 8 et 11 cm. Troisième côté = ?", type: "number", acceptable: ["11"] },
    { id: "g2-3-e5", promptFr: "Peut-on former un triangle avec les côtés 2, 3, 7 ? (oui/non)", type: "short_text", acceptable: ["non"] },
  ],
};

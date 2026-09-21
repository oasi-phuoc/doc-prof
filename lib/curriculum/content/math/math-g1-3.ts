import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G1_3_LESSON: MathSubmoduleLesson = {
  submoduleId: "G1-3",
  submoduleCode: "G1.3",
  theory: {
    title: {
      fr: "Propriétés des formes",
    },
    blocks: [
      { type: "heading", fr: "Les quadrilatères", black: true },

      {
        type: "plain",
        fr: "Un **quadrilatère** est un polygone à **4 côtés**. La somme de ses angles intérieurs est toujours **360°**.",
      },

      {
        type: "table",
        headersFr: ["Nom", "Propriétés principales"],
        accentHeader: true,
        colAligns: ["left", "left"],
        rows: [
          ["Carré", "4 côtés égaux · 4 angles droits"],
          ["Rectangle", "4 angles droits · côtés opposés égaux"],
          ["Losange", "4 côtés égaux · angles opposés égaux"],
          ["Parallélogramme", "Côtés opposés parallèles et égaux"],
          ["Trapèze", "Une seule paire de côtés parallèles"],
        ],
      },

      { type: "highlight", fr: "Hiérarchie des quadrilatères" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le **carré** est un cas particulier du **rectangle** (rectangle à côtés égaux).",
          "Le **rectangle** et le **losange** sont des cas particuliers du **parallélogramme**.",
          "Le **parallélogramme** est un cas particulier du **trapèze**.",
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'><rect x='15' y='15' width='50' height='50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/></svg>`,
            captionFr: "Carré",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'><rect x='4' y='22' width='72' height='36' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5'/></svg>`,
            captionFr: "Rectangle",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'><polygon points='40,8 72,40 40,72 8,40' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            captionFr: "Losange",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'><polygon points='12,64 56,64 68,16 24,16' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            captionFr: "Parallélogramme",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'><polygon points='16,62 64,62 52,18 28,18' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            captionFr: "Trapèze",
          },
        ],
      },

      { type: "heading", fr: "Diagonales", black: true },

      {
        type: "plain",
        fr: "La **diagonale** d'un quadrilatère est un segment reliant deux sommets non consécutifs.",
      },

      { type: "highlight", fr: "Propriétés des diagonales" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "**Carré** : diagonales égales et **perpendiculaires**.",
          "**Rectangle** : diagonales **égales** mais pas perpendiculaires.",
          "**Losange** : diagonales **perpendiculaires** mais pas égales.",
          "**Parallélogramme** : diagonales se **coupent en leur milieu**.",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    {
      id: "g1-3-e1",
      promptFr: "Quel quadrilatère a 4 côtés égaux ET 4 angles droits ?",
      type: "short_text",
      acceptable: ["carré"],
    },
    {
      id: "g1-3-e2",
      promptFr: "Un losange a-t-il obligatoirement des angles droits ? (oui/non)",
      type: "short_text",
      acceptable: ["non"],
    },
    {
      id: "g1-3-e3",
      promptFr: "Quel quadrilatère a exactement une paire de côtés parallèles ?",
      type: "short_text",
      acceptable: ["trapèze", "trapeze"],
    },
    {
      id: "g1-3-e4",
      promptFr: "Tous les rectangles sont-ils des carrés ? (oui/non)",
      type: "short_text",
      acceptable: ["non"],
    },
    {
      id: "g1-3-e5",
      promptFr: "Tous les carrés sont-ils des rectangles ? (oui/non)",
      type: "short_text",
      acceptable: ["oui"],
    },
  ],
};

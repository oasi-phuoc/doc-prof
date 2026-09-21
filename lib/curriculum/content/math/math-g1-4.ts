import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G1_4_LESSON: MathSubmoduleLesson = {
  submoduleId: "G1-4",
  submoduleCode: "G1.4",
  theory: {
    title: {
      fr: "Angles",
    },
    blocks: [
      { type: "heading", fr: "Qu'est-ce qu'un angle ?", black: true },

      {
        type: "plain",
        fr: "Un **angle** est formé par deux **demi-droites** issues d'un même point appelé **sommet**. On le mesure en **degrés (°)**.",
      },

      {
        type: "rule",
        titleFr: "Repères",
        itemsFr: [
          "Tour complet = 360°",
          "Demi-tour = 180°",
          "Quart de tour = 90°",
        ],
      },

      { type: "heading", fr: "Types d'angles", black: true },

      {
        type: "table",
        headersFr: ["Type", "Mesure"],
        accentHeader: true,
        colAligns: ["left", "left"],
        rows: [
          ["Nul", "0°"],
          ["Aigu", "0° < α < 90°"],
          ["Droit", "α = 90°"],
          ["Obtus", "90° < α < 180°"],
          ["Plat", "α = 180°"],
          ["Rentrant", "180° < α < 360°"],
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <line x1='8' y1='68' x2='70' y2='68' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='8' y1='68' x2='47' y2='22' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <path d='M 28,68 A 20,20 0 0,0 21,51' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
</svg>`,
            captionFr: "Aigu (< 90°)",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <line x1='8' y1='68' x2='70' y2='68' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='8' y1='68' x2='8' y2='12' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <rect x='8' y='58' width='10' height='10' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
</svg>`,
            captionFr: "Droit (= 90°)",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <line x1='40' y1='68' x2='75' y2='68' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='40' y1='68' x2='23' y2='38' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <path d='M 55,68 A 15,15 0 0,0 33,55' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
</svg>`,
            captionFr: "Obtus (> 90°)",
          },
          {
            markup: `<svg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <line x1='5' y1='50' x2='75' y2='50' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linecap='round'/>
  <circle cx='40' cy='50' r='3' fill='var(--color-accent-alg)'/>
  <path d='M 22,50 A 18,18 0 0,1 58,50' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='4,3' opacity='0.6'/>
</svg>`,
            captionFr: "Plat (= 180°)",
          },
        ],
      },

      { type: "heading", fr: "Angles remarquables", black: true },

      { type: "highlight", fr: "Angles complémentaires" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Deux angles sont **complémentaires** si leur somme vaut **90°**.",
          "Exemple : 35° et 55° sont complémentaires (35 + 55 = 90).",
        ],
      },

      { type: "highlight", fr: "Angles supplémentaires" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Deux angles sont **supplémentaires** si leur somme vaut **180°**.",
          "Exemple : 110° et 70° sont supplémentaires (110 + 70 = 180).",
        ],
      },

      { type: "highlight", fr: "Angles opposés par le sommet" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Quand deux droites se croisent, les angles **opposés par le sommet** sont **égaux**.",
        ],
      },
    ],
    paragraphs: { fr: [] },
  },

  exercises: [
    {
      id: "g1-4-e1",
      promptFr: "Un angle de 75° est-il aigu ou obtus ?",
      type: "short_text",
      acceptable: ["aigu"],
    },
    {
      id: "g1-4-e2",
      promptFr: "Deux angles complémentaires : l'un est 35°. Quel est l'autre (en °) ?",
      type: "number",
      acceptable: ["55"],
    },
    {
      id: "g1-4-e3",
      promptFr: "Deux angles supplémentaires : l'un est 110°. Quel est l'autre (en °) ?",
      type: "number",
      acceptable: ["70"],
    },
    {
      id: "g1-4-e4",
      promptFr: "Un angle droit mesure combien de degrés ?",
      type: "number",
      acceptable: ["90"],
    },
    {
      id: "g1-4-e5",
      promptFr: "Deux droites se coupent. Un angle est 40°. L'angle opposé par le sommet mesure ?",
      type: "number",
      acceptable: ["40"],
    },
  ],
};

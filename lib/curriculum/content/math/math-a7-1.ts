import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A7_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "A7-1",
  submoduleCode: "A7.1",
  theory: {
    title: { fr: "Notion de négatif",},
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Définition", black: true },
      { type: "plain", fr: "Un nombre relatif a un signe + ou −." },
      { type: "plain", fr: "" },
      { type: "plain", fr: "Positif" },
      { type: "section", labelFr: "", itemsFr: [
        "plus grand que 0",
        "+3, +15 (le + est souvent omis)",
      ] },
      { type: "plain", fr: "Négatif" },
      { type: "section", labelFr: "", itemsFr: [
        "plus petit que 0",
        "−3, −15",
      ] },
      { type: "plain", fr: "Le zéro (0) n'est ni positif ni négatif." },
      { type: "plain", fr: "" },
      { type: "heading", fr: "La droite numérique", black: true },
      { type: "plain", fr: "Droite numérique de −6 à +6" },
      {
        type: "svg",
        noFrame: true,
        markup: `<svg viewBox="0 0 360 60" xmlns="http://www.w3.org/2000/svg" width="360" height="60">
  <line x1="14" y1="30" x2="346" y2="30" stroke="#0f172a" stroke-width="2"/>
  <polygon points="14,30 24,25 24,35" fill="#0f172a"/>
  <polygon points="346,30 336,25 336,35" fill="#0f172a"/>
  <line x1="36" y1="25" x2="36" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="36" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−6</text>
  <line x1="60" y1="25" x2="60" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="60" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−5</text>
  <line x1="84" y1="25" x2="84" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="84" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−4</text>
  <line x1="108" y1="25" x2="108" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="108" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−3</text>
  <line x1="132" y1="25" x2="132" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="132" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−2</text>
  <line x1="156" y1="25" x2="156" y2="35" stroke="#ef4444" stroke-width="1.5"/>
  <text x="156" y="50" text-anchor="middle" font-size="10" fill="#ef4444">−1</text>
  <line x1="180" y1="22" x2="180" y2="38" stroke="#0f172a" stroke-width="2"/>
  <text x="180" y="50" text-anchor="middle" font-size="10" fill="#0f172a" font-weight="bold">0</text>
  <line x1="204" y1="25" x2="204" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="204" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+1</text>
  <line x1="228" y1="25" x2="228" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="228" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+2</text>
  <line x1="252" y1="25" x2="252" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="252" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+3</text>
  <line x1="276" y1="25" x2="276" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="276" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+4</text>
  <line x1="300" y1="25" x2="300" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="300" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+5</text>
  <line x1="324" y1="25" x2="324" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="324" y="50" text-anchor="middle" font-size="10" fill="#3b82f6">+6</text>
</svg>`,
      },
      { type: "section", labelFr: "", itemsFr: [
        "Les négatifs sont à **gauche** de 0.",
        "Les positifs sont à **droite** de 0.",
        "Plus on va à gauche, plus le nombre est **petit**.",
      ] },
      { type: "plain", fr: "" },
      { type: "heading", fr: "L'opposé d'un nombre", black: true },
      { type: "plain", fr: "L'opposé est le nombre qui a le signe contraire." },
      { type: "table",
        headersFr: ["Nombre", "Opposé"],
        accentHeader: true,
        rows: [
          ["+5", "−5"],
          ["−5", "+5"],
          ["−12", "+12"],
          ["0", "0"],
        ],
      },
      { type: "plain", fr: "" },
      { type: "heading", fr: "La valeur absolue", black: true },
      { type: "plain", fr: "La valeur absolue d'un nombre est sa distance à 0 sur la droite numérique." },
      { type: "plain", fr: "Elle est toujours positive ou nulle." },
      { type: "plain", fr: "Notation : |a| (barres verticales autour du nombre)." },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Exemples" },
      { type: "table",
        headersFr: ["Nombre", "Valeur absolue", "Explication"],
        accentHeader: true,
        rows: [
          ["−5",   "|−5| = 5",   "distance à 0 = 5"],
          ["+5",   "|+5| = 5",   "distance à 0 = 5"],
          ["−3,7", "|−3,7| = 3,7", "distance à 0 = 3,7"],
          ["0",    "|0| = 0",    "distance à 0 = 0"],
        ],
      },
      { type: "note", fr: "−8 et +8 ont la même valeur absolue (8) : ils sont à égale distance de 0. Ce sont des opposés." },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 4,
};

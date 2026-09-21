import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A7_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "A7-2",
  submoduleCode: "A7.2",
  theory: {
    title: { fr: "Comparer les relatifs",},
    paragraphs: { fr: [] },
    blocks: [
      { type: "heading", fr: "Comparer deux nombres relatifs", black: true },
      { type: "plain", fr: "**1.** Tout nombre négatif est toujours plus petit qu'un nombre positif." },
      { type: "plain", fr: "**2.** Entre deux négatifs : le plus grand est le plus proche de 0." },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Exemples" },
      { type: "table",
        headersFr: ["Nombre A", "", "Nombre B", "Raison"],
        accentHeader: true,
        rows: [
          ["**−**2",   "**<**", "+3",     "négatif **<** positif"],
          ["**−**452", "**<**", "+1",     "négatif **<** positif"],
          ["**−**5",   "**<**", "**−**2", "**−**2 est plus proche de 0"],
          ["**−**517", "**<**", "**−**14","**−**14 est plus proche de 0"],
        ],
      },
      { type: "plain", fr: "" },
      { type: "heading", fr: "Sur la droite numérique", black: true },
      {
        type: "svg",
        noFrame: true,
        markup: `<svg viewBox="0 0 360 85" xmlns="http://www.w3.org/2000/svg" width="360" height="85">
  <!-- annotation: plus petit arrow pointing left -->
  <line x1="168" y1="18" x2="52" y2="18" stroke="#ef4444" stroke-width="1.5"/>
  <polygon points="52,18 60,14 60,22" fill="#ef4444"/>
  <text x="110" y="12" text-anchor="middle" font-size="9" fill="#ef4444">plus petit</text>
  <!-- annotation: plus grand arrow pointing right -->
  <line x1="192" y1="18" x2="308" y2="18" stroke="#3b82f6" stroke-width="1.5"/>
  <polygon points="308,18 300,14 300,22" fill="#3b82f6"/>
  <text x="250" y="12" text-anchor="middle" font-size="9" fill="#3b82f6">plus grand</text>
  <!-- dashed connector from annotation to 0 tick -->
  <line x1="180" y1="22" x2="180" y2="52" stroke="#f97316" stroke-width="1.5" stroke-dasharray="3,2"/>
  <!-- number line at y=60 -->
  <line x1="14" y1="60" x2="346" y2="60" stroke="#0f172a" stroke-width="2"/>
  <polygon points="14,60 24,55 24,65" fill="#0f172a"/>
  <polygon points="346,60 336,55 336,65" fill="#0f172a"/>
  <!-- -6 at x=36 -->
  <line x1="36" y1="55" x2="36" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="36" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−6</text>
  <!-- -5 at x=60 -->
  <line x1="60" y1="55" x2="60" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="60" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−5</text>
  <!-- -4 at x=84 -->
  <line x1="84" y1="55" x2="84" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="84" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−4</text>
  <!-- -3 at x=108 -->
  <line x1="108" y1="55" x2="108" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="108" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−3</text>
  <!-- -2 at x=132 -->
  <line x1="132" y1="55" x2="132" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="132" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−2</text>
  <!-- -1 at x=156 -->
  <line x1="156" y1="55" x2="156" y2="65" stroke="#ef4444" stroke-width="1.5"/>
  <text x="156" y="79" text-anchor="middle" font-size="10" fill="#ef4444">−1</text>
  <!-- 0 at x=180 (orange highlight) -->
  <line x1="180" y1="51" x2="180" y2="69" stroke="#f97316" stroke-width="2.5"/>
  <text x="180" y="79" text-anchor="middle" font-size="10" fill="#f97316" font-weight="bold">0</text>
  <!-- +1 at x=204 -->
  <line x1="204" y1="55" x2="204" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="204" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+1</text>
  <!-- +2 at x=228 -->
  <line x1="228" y1="55" x2="228" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="228" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+2</text>
  <!-- +3 at x=252 -->
  <line x1="252" y1="55" x2="252" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="252" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+3</text>
  <!-- +4 at x=276 -->
  <line x1="276" y1="55" x2="276" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="276" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+4</text>
  <!-- +5 at x=300 -->
  <line x1="300" y1="55" x2="300" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="300" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+5</text>
  <!-- +6 at x=324 -->
  <line x1="324" y1="55" x2="324" y2="65" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="324" y="79" text-anchor="middle" font-size="10" fill="#3b82f6">+6</text>
</svg>`,
      },
      { type: "plain", fr: "Un nombre est **plus grand** que tous les nombres à sa gauche." },
      { type: "plain", fr: "Un nombre est **plus petit** que tous les nombres à sa droite." },
    ],
  },
  exercises: [],
  exercisePool: [],
  poolSize: 0,
};

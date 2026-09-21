import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A2_1_LESSON: MathSubmoduleLesson = {
  submoduleId: "A2-1",
  submoduleCode: "A2.1",
  theory: {
    title: {
      fr: "Addition",
    },
    blocks: [
      { type: "plain", fr: "L'addition permet de **réunir** plusieurs quantités **ensemble**." },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le signe de l'addition est le signe « + » **plus**",
          "Les nombres à additionner sont les **termes**.",
          "Le résultat de l'addition est la **somme**.",
        ],
      },
      {
        type: "table",
        headersFr: ["5", "+", "8", "=", "13"],
        accentHeader: true,
        rows: [["terme", "plus", "terme", "égale", "somme"]],
      },
      { type: "heading", fr: "Propriétés de l'addition", black: true },
      { type: "highlight", fr: "Commutativité" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["L'ordre des termes ne change pas la somme."],
      },
      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">57</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">49</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">106</text></svg>`
          },
          {
            markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">49</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">57</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">106</text></svg>`
          },
        ],
      },
      { type: "highlight", fr: "Associativité" },
      {
        type: "section",
        labelFr: "",
        itemsFr: ["On peut additionner plus de deux termes dans l'ordre voulu."],
      },
      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox="0 0 190 128" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-assoc1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="18" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">15</text><text x="50" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="80" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">37</text><text x="112" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="158" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">22</text><line x1="25" y1="28" x2="51" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><line x1="77" y1="28" x2="63" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><text x="56" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">52</text><text x="92" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="128" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">22</text><line x1="64" y1="78" x2="87" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><line x1="120" y1="78" x2="97" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><text x="92" y="122" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">74</text></svg>`
          },
          {
            markup: `<svg viewBox="0 0 190 128" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-assoc2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="18" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">15</text><text x="50" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="80" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">37</text><text x="112" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="158" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">22</text><line x1="88" y1="28" x2="114" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><line x1="151" y1="28" x2="128" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><text x="22" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">15</text><text x="62" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">+</text><text x="120" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">59</text><line x1="30" y1="78" x2="83" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><line x1="112" y1="78" x2="99" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><text x="92" y="122" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">74</text></svg>`
          },
        ],
      },
      { type: "heading", fr: "Addition en colonnes", black: true },
      {
        type: "add_step_cards",
        colLabels: ["M", "C", "D", "U"],
        op: "+",
        carryLabel: "R",
        a: [2, 5, 4, 7],
        b: [1, 3, 8, 6],
        steps: [
          {
            numFr: "1. On pose les nombres",
            textsFr: [
              "Aligner les unités sous les unités, dizaines sous dizaines, centaines sous centaines.",
            ],
            carries: [null, null, null, null],
            result:  [null, null, null, null],
          },
          {
            numFr: "2. Unités : 7 + 6 = 13",
            textsFr: [
              "7 + 6 = 13 → pose 3, retient 1",
            ],
            carries: [null, null, 1, null],
            result:  [null, null, null, 3],
          },
          {
            numFr: "3. Dizaines : 1 + 4 + 8 = 13",
            textsFr: [
              "1 (retenue) + 4 + 8 = 13 → pose 3, retient 1",
            ],
            carries: [null, 1, 1, null],
            result:  [null, null, 3, 3],
          },
          {
            numFr: "4. Centaines : 1 + 5 + 3 = 9",
            textsFr: [
              "1 (retenue) + 5 + 3 = 9 → pose 9",
            ],
            carries: [null, 1, 1, null],
            result:  [null, 9, 3, 3],
          },
          {
            numFr: "5. Milliers : 2 + 1 = 3",
            textsFr: [
              "2 + 1 = 3 → pose 3",
              "Résultat : 2 547 + 1 386 = 3 933",
            ],
            carries: [null, 1, 1, null],
            result:  [3, 9, 3, 3],
          },
        ],
      },
    ],
    paragraphs: { fr: [ ] },
  },
  exercises: [],
  exercisePool: [
    { id: "a2-1-ep01", promptFr: "Calculez : 46 + 37 = ?", type: "number", acceptable: ["83"], hintFr: "Additionne les unités (6+7=13, retiens 1), puis les dizaines (4+3+1=8)." },
    { id: "a2-1-ep02", promptFr: "Calculez : 125 + 248 = ?", type: "number", acceptable: ["373"], hintFr: "Additionne colonne par colonne de droite à gauche." },
    { id: "a2-1-ep03", promptFr: "Calculez : 364 + 179 = ?", type: "number", acceptable: ["543"], hintFr: "Attention aux retenues : 4+9=13, retiens 1 ; 6+7+1=14, retiens 1 ; 3+1+1=5." },
    { id: "a2-1-ep04", promptFr: "Calculez : 507 + 286 = ?", type: "number", acceptable: ["793"], hintFr: "Additionne colonne par colonne de droite à gauche." },
    { id: "a2-1-ep05", promptFr: "Calculez : 1 234 + 567 = ?", type: "number", acceptable: ["1801"], hintFr: "Aligne les chiffres par colonnes (U, D, C, M) puis additionne." },
    { id: "a2-1-ep06", promptFr: "Calculez : 2 458 + 1 375 = ?", type: "number", acceptable: ["3833"], hintFr: "Additionne colonne par colonne de droite à gauche avec les retenues." },
    { id: "a2-1-ep07", promptFr: "Calculez : 89 + 76 = ?", type: "number", acceptable: ["165"], hintFr: "9+6=15, retiens 1 ; 8+7+1=16." },
    { id: "a2-1-ep08", promptFr: "Calculez : 4 736 + 2 189 = ?", type: "number", acceptable: ["6925"], hintFr: "Additionne colonne par colonne de droite à gauche avec les retenues." },
    { id: "a2-1-ep09", promptFr: "Calculez : 308 + 495 = ?", type: "number", acceptable: ["803"], hintFr: "8+5=13, retiens 1 ; 0+9+1=10, retiens 1 ; 3+4+1=8." },
    { id: "a2-1-ep10", promptFr: "Calculez : 1 999 + 1 = ?", type: "number", acceptable: ["2000"], hintFr: "Pense aux retenues en chaîne : 9+1=10, retiens 1…" },
    { id: "a2-1-ep11", promptFr: "Calculez : 673 + 254 = ?", type: "number", acceptable: ["927"], hintFr: "Additionne colonne par colonne de droite à gauche." },
    { id: "a2-1-ep12", promptFr: "Calculez : 3 450 + 2 675 = ?", type: "number", acceptable: ["6125"], hintFr: "Additionne colonne par colonne de droite à gauche avec les retenues." },
  ],
  poolSize: 5,
};

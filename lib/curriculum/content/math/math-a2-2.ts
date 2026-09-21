import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A2_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "A2-2",
  submoduleCode: "A2.2",
  theory: {
    title: {
      fr: "Soustraction",
    },

    blocks: [
      {
        type: "plain",
        fr: "La soustraction permet de **retirer** une quantité d'une autre.",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Le signe de la soustraction est le signe « − » **moins**",
          "Les nombres de la soustraction sont les **termes**.",
          "Le résultat de la soustraction est la **différence**.",
        ],
      },

      {
        type: "table",
        headersFr: ["8", "−", "3", "=", "5"],
        accentHeader: true,
        rows: [["terme", "moins", "terme", "égale", "différence"]],
      },

      { type: "heading", fr: "Propriétés de la soustraction", black: true },

      {
        type: "highlight",
        fr: "Non-commutativité",
      },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La soustraction n'est PAS commutative.",
          "• 57 − 49 **≠** 49 − 57",
        ],
      },

      {
        type: "svg_row",
        items: [
          {
            markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">67</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">-</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">19</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">48</text></svg>`
          },
          {
            markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">19</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">-</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">29</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">??</text></svg>`
          },
        ],
      },

      { type: "heading", fr: "Soustraction en colonnes", black: true },

      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Aligner les unités sous les unités, dizaines sous dizaines.",
          "Si soustraction impossible → faire un **emprunt** à la colonne de gauche.",
          "La colonne empruntée diminue de 1, la colonne courante gagne 10.",
        ],
      },
      {
        type: "add_step_cards",
        colLabels: ["M", "C", "D", "U"],
        op: "−",
        carryLabel: "E",
        a: [5, 3, 4, 2],
        b: [1, 5, 6, 8],
        steps: [
          {
            numFr: "1. On pose les nombres",
            textsFr: [
              "Aligner les unités sous les unités, dizaines sous dizaines.",
            ],
            carries: [null, null, null, null],
            result:  [null, null, null, null],
          },
          {
            numFr: "2. Unités : 2 − 8 impossible → emprunt",
            textsFr: [
              "2 < 8, on emprunte 1 aux dizaines → dizaines passe de 4 à 3.",
              "12 − 8 = 4",
            ],
            carries: [null, null, 3, null],
            result:  [null, null, null, 4],
          },
          {
            numFr: "3. Dizaines : 3 − 6 impossible → emprunt",
            textsFr: [
              "3 (après emprunt) < 6, on emprunte 1 aux centaines → centaines passe de 3 à 2.",
              "13 − 6 = 7",
            ],
            carries: [null, 2, 3, null],
            result:  [null, null, 7, 4],
          },
          {
            numFr: "4. Centaines : 2 − 5 impossible → emprunt",
            textsFr: [
              "2 (après emprunt) < 5, on emprunte 1 aux milliers → milliers passe de 5 à 4.",
              "12 − 5 = 7",
            ],
            carries: [4, 2, 3, null],
            result:  [null, 7, 7, 4],
          },
          {
            numFr: "5. Milliers : 4 − 1 = 3",
            textsFr: [
              "4 (après emprunt) − 1 = 3",
              "Résultat : 5 342 − 1 568 = 3 774",
            ],
            carries: [4, 2, 3, null],
            result:  [3, 7, 7, 4],
          },
        ],
      },
    ],

    paragraphs: { fr: [] },
  },

  exercises: [],
  exercisePool: [
    { id: "a2-2-ep01", promptFr: "Calculez : 83 − 37 = ?", type: "number", acceptable: ["46"], hintFr: "Soustraction colonne par colonne : 3−7 impossible, emprunte ; 13−7=6 ; 7−3=4." },
    { id: "a2-2-ep02", promptFr: "Calculez : 254 − 127 = ?", type: "number", acceptable: ["127"], hintFr: "Soustrait colonne par colonne de droite à gauche, emprunte si nécessaire." },
    { id: "a2-2-ep03", promptFr: "Calculez : 500 − 163 = ?", type: "number", acceptable: ["337"], hintFr: "0−3 impossible, 0 au-dessus → emprunte en chaîne depuis les centaines." },
    { id: "a2-2-ep04", promptFr: "Calculez : 742 − 385 = ?", type: "number", acceptable: ["357"], hintFr: "Soustrait colonne par colonne de droite à gauche, emprunte si nécessaire." },
    { id: "a2-2-ep05", promptFr: "Calculez : 1 000 − 456 = ?", type: "number", acceptable: ["544"], hintFr: "Emprunte en chaîne : 1 000 = 999 + 1." },
    { id: "a2-2-ep06", promptFr: "Calculez : 3 821 − 1 475 = ?", type: "number", acceptable: ["2346"], hintFr: "Soustrait colonne par colonne de droite à gauche avec les emprunts." },
    { id: "a2-2-ep07", promptFr: "Calculez : 605 − 278 = ?", type: "number", acceptable: ["327"], hintFr: "5−8 impossible, emprunte ; 15−8=7 ; 9−7=2 ; 5−2=3." },
    { id: "a2-2-ep08", promptFr: "Calculez : 4 002 − 1 357 = ?", type: "number", acceptable: ["2645"], hintFr: "Emprunte en chaîne depuis les milliers." },
    { id: "a2-2-ep09", promptFr: "Calculez : 916 − 439 = ?", type: "number", acceptable: ["477"], hintFr: "Soustrait colonne par colonne de droite à gauche, emprunte si nécessaire." },
    { id: "a2-2-ep10", promptFr: "Calculez : 7 500 − 3 284 = ?", type: "number", acceptable: ["4216"], hintFr: "Soustrait colonne par colonne de droite à gauche avec les emprunts." },
    { id: "a2-2-ep11", promptFr: "Calculez : 200 − 87 = ?", type: "number", acceptable: ["113"], hintFr: "Emprunte en chaîne depuis les centaines." },
    { id: "a2-2-ep12", promptFr: "Calculez : 5 000 − 2 749 = ?", type: "number", acceptable: ["2251"], hintFr: "Emprunte en chaîne depuis les milliers." },
  ],
  poolSize: 5,
};

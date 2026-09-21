import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A3_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A3-1",
    submoduleCode: "A3.1",
    theory: {
      title: {
        fr: "Multiplication",
      },
      paragraphs: {
        fr: [ "Voici les tables de multiplications de 0 à 12." ],
      },
      blocks: [
        { type: "plain", fr: "Multiplier, c'est additionner plusieurs fois le même nombre." },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Le signe de la multiplication est le signe « × » **fois**",
            "Les nombres à multiplier sont les **facteurs**.",
            "Le résultat de la multiplication est le **produit**.",
          ],
        },
        {
          type: "table",
          headersFr: ["7", "×", "9", "=", "63"],
          accentHeader: true,
          rows: [["facteur", "fois", "facteur", "égale", "produit"]],
        },
        { type: "heading", fr: "Propriétés de la multiplication", black: true },
        { type: "highlight", fr: "Commutativité" },
        {
          type: "section",
          labelFr: "",
          itemsFr: ["L'ordre des facteurs ne change pas le produit."],
        },
        {
          type: "svg_row",
          items: [
            {
              markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">5</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">6</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm1)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">30</text></svg>`
            },
            {
              markup: `<svg viewBox="0 0 170 88" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-comm2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="30" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">6</text><text x="85" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="140" y="27" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">5</text><line x1="42" y1="35" x2="79" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><line x1="128" y1="35" x2="91" y2="63" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-comm2)"/><text x="85" y="83" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">30</text></svg>`
            },
          ],
        },
        { type: "highlight", fr: "Associativité" },
        {
          type: "section",
          labelFr: "",
          itemsFr: ["On peut multiplier plus de deux facteurs dans l'ordre voulu."],
        },
        { type: "highlight", fr: "Fois 0" },
        {
          type: "section",
          labelFr: "",
          itemsFr: ["Un nombre multiplié par 0 donne 0. \n**Exemple :** 123 × 0 = 0."],
        },
        {
          type: "svg_row",
          items: [
            {
              markup: `<svg viewBox="0 0 190 128" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-assoc1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="18" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">2</text><text x="50" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="80" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">10</text><text x="112" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="158" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">8</text><line x1="25" y1="28" x2="51" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><line x1="77" y1="28" x2="63" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><text x="56" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">20</text><text x="92" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="128" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">8</text><line x1="64" y1="78" x2="87" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><line x1="120" y1="78" x2="97" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc1)"/><text x="92" y="122" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">160</text></svg>`
            },
            {
              markup: `<svg viewBox="0 0 190 128" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr-assoc2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0,6 3,0 6" fill="#60a5fa"/></marker></defs><text x="18" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">2</text><text x="50" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="80" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">10</text><text x="112" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="158" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">8</text><line x1="88" y1="28" x2="114" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><line x1="151" y1="28" x2="128" y2="55" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><text x="22" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#60a5fa">2</text><text x="62" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#374151">×</text><text x="120" y="72" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">80</text><line x1="30" y1="78" x2="83" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><line x1="112" y1="78" x2="99" y2="105" stroke="#60a5fa" stroke-width="1" marker-end="url(#arr-assoc2)"/><text x="92" y="122" text-anchor="middle" font-size="20" font-weight="bold" fill="#111827">160</text></svg>`
            },
          ],
        },
        { type: "heading", fr: "Table de multiplications", black: true },
        { type: "mult_table" },
      ],
    },
    exercises: [],
    exercisePool: [
      { id: "a3-1-ep01", promptFr: "7 × 8 = ?", type: "number", acceptable: ["56"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep02", promptFr: "9 × 6 = ?", type: "number", acceptable: ["54"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep03", promptFr: "12 × 11 = ?", type: "number", acceptable: ["132"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep04", promptFr: "6 × 9 = ?", type: "number", acceptable: ["54"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep05", promptFr: "8 × 8 = ?", type: "number", acceptable: ["64"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep06", promptFr: "7 × 7 = ?", type: "number", acceptable: ["49"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep07", promptFr: "12 × 12 = ?", type: "number", acceptable: ["144"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep08", promptFr: "9 × 9 = ?", type: "number", acceptable: ["81"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep09", promptFr: "11 × 8 = ?", type: "number", acceptable: ["88"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep10", promptFr: "6 × 12 = ?", type: "number", acceptable: ["72"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep11", promptFr: "7 × 9 = ?", type: "number", acceptable: ["63"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep12", promptFr: "4 × 11 = ?", type: "number", acceptable: ["44"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep13", promptFr: "8 × 12 = ?", type: "number", acceptable: ["96"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep14", promptFr: "5 × 7 = ?", type: "number", acceptable: ["35"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
      { id: "a3-1-ep15", promptFr: "3 × 9 = ?", type: "number", acceptable: ["27"], hintFr: "Cherche dans la table de multiplication le produit des deux facteurs."},
    ],
    poolSize: 5,
  };

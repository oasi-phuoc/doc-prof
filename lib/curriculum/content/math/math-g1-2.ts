import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G1_2_LESSON: MathSubmoduleLesson = {
  submoduleId: "G1-2",
  submoduleCode: "G1.2",
  theory: {
    title: { fr: "Propriétés des formes" },
    paragraphs: { fr: [] },
    blocks: [
      {
        type: "shape_explorer",
        shapes: [

          // ── 1. CARRÉ ──────────────────────────────────────────────
          {
            id: "carre",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><rect x='8' y='8' width='44' height='44' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  {
                    type: "section",
                    labelFr: "",
                    itemsFr: [
                      "Chaque angle mesure 90°.",
                      "La somme des 4 angles vaut 360°.",
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='70' height='70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M15,27 L27,27 L27,15' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M73,15 L73,27 L85,27' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M15,73 L27,73 L27,85' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M73,85 L73,73 L85,73' fill='none' stroke='#f97316' stroke-width='2'/>
</svg>`,
                      },
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='70' height='70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M15,27 L27,27 L27,15' fill='none' stroke='#f97316' stroke-width='2'/>
  <text x='32' y='35' font-size='10' fill='#f97316' font-family='sans-serif' font-weight='bold'>90°</text>
</svg>`,
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "**1** Le carré a 4 côtés égaux." },
                  { type: "plain", fr: "**2.**Les côtés opposés sont parallèles." },
                  { type: "plain", fr: "**3.** Les diagonales sont égales." },
                  {
                    type: "section",
                    labelFr: "",
                    itemsFr: [
                      "Elles se coupent en leur milieu",
                      "Elles sont perpendiculaires.",
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='70' height='70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <!-- Top side tick (perpendicular = vertical) -->
  <line x1='50' y1='12' x2='50' y2='18' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Bottom side tick -->
  <line x1='50' y1='82' x2='50' y2='88' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Left side tick (perpendicular = horizontal) -->
  <line x1='12' y1='50' x2='18' y2='50' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side tick -->
  <line x1='82' y1='50' x2='88' y2='50' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "4 côtés égaux",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='70' height='70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='15' y1='15' x2='85' y2='85' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='4,3' opacity='0.6'/>
  <line x1='85' y1='15' x2='15' y2='85' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='4,3' opacity='0.6'/>
  <path d='M44,50 L50,44 L56,50 L50,56 Z' fill='none' stroke='#f97316' stroke-width='1.5'/>
  <circle cx='50' cy='50' r='3' fill='#f97316'/>
</svg>`,
                        captionFr: "Diagonales ⊥ en O",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  {
                    type: "section",
                    labelFr: "",
                    itemsFr: [
                      "2 axes médiateurs (horizontal et vertical)",
                      "2 axes diagonaux",
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='70' height='70' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='5' x2='50' y2='95' stroke='#f97316' stroke-width='0.9' stroke-dasharray='3,3'/>
  <line x1='5' y1='50' x2='95' y2='50' stroke='#f97316' stroke-width='0.9' stroke-dasharray='3,3'/>
  <line x1='8' y1='8' x2='92' y2='92' stroke='#f97316' stroke-width='0.8' stroke-dasharray='3,3'/>
  <line x1='92' y1='8' x2='8' y2='92' stroke='#f97316' stroke-width='0.8' stroke-dasharray='3,3'/>
</svg>`,
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 2. TRIANGLE ──────────────────────────────────────────
          {
            id: "triangle",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><polygon points='30,6 56,52 4,52' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "Un triangle a **3 angles**. La somme de ses angles intérieurs est toujours **180°**." },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='18,78 88,70 42,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M42,10 m7,9 A12,12 0 0,1 32,21' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <path d='M18,78 m13,-2 A13,13 0 0,1 24,64' fill='none' stroke='#f97316' stroke-width='1.5'/>
  <path d='M88,70 m-12,-6 A12,12 0 0,0 74,76' fill='none' stroke='#0891b2' stroke-width='1.5'/>
  <text x='29' y='87' font-size='8.5' fill='var(--color-text-secondary)' font-family='sans-serif'>3 angles différents</text>
</svg>`,
                        captionFr: "Quelconque",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 82,78 18,78' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M18,78 m12,-2 A12,12 0 0,1 24,66' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <path d='M82,78 m-12,-2 A12,12 0 0,0 76,66' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <text x='22' y='87' font-size='8.5' fill='var(--color-text-secondary)' font-family='sans-serif'>2 angles de base égaux</text>
</svg>`,
                        captionFr: "Isocèle",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 88,74 12,74' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M50,8 m9,15 A15,15 0 0,1 41,23' fill='none' stroke='#f97316' stroke-width='1.7'/>
  <path d='M12,74 m13,-3 A13,13 0 0,1 20,62' fill='none' stroke='#f97316' stroke-width='1.7'/>
  <path d='M88,74 m-13,-3 A13,13 0 0,0 80,62' fill='none' stroke='#f97316' stroke-width='1.7'/>
  <text x='42' y='43' font-size='9' fill='#f97316' font-family='sans-serif' font-weight='bold'>60°</text>
  <text x='37' y='87' font-size='8.5' fill='var(--color-text-secondary)' font-family='sans-serif'>3 × 60°</text>
</svg>`,
                        captionFr: "Équilatéral",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='12,82 12,18 82,82' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M12,82 L26,82 L26,68' fill='none' stroke='#f97316' stroke-width='2'/>
  <text x='28' y='58' font-size='9' fill='#f97316' font-family='sans-serif'>90°</text>
</svg>`,
                        captionFr: "Rectangle",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  {
                    type: "table",
                    headersFr: ["Type", "Côtés"],
                    accentHeader: true,
                    colAligns: ["left", "left"],
                    rows: [
                      ["Quelconque", "3 côtés différents"],
                      ["Isocèle", "2 côtés égaux"],
                      ["Équilatéral", "3 côtés égaux"],
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <!-- Isosceles triangle: A=(50,8) B=(80,82) C=(20,82) -->
  <polygon points='50,8 80,82 20,82' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Left side: A=(50,8) to C=(20,82). dir=(-30,74) len=79.9. norm=(-0.375,0.925). perp=(-0.925,-0.375). mid=(35,45) -->
  <!-- tick from (35+4.6,45+1.9) to (35-4.6,45-1.9) = (39.6,46.9) to (30.4,43.1) -->
  <line x1='39.6' y1='46.9' x2='30.4' y2='43.1' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side: A=(50,8) to B=(80,82). dir=(30,74) len=79.9. norm=(0.375,0.925). perp=(-0.925,0.375). mid=(65,45) -->
  <!-- tick from (65+4.6,45-1.9) to (65-4.6,45+1.9) = (69.6,43.1) to (60.4,46.9) -->
  <line x1='69.6' y1='43.1' x2='60.4' y2='46.9' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Isocèle : 2 côtés égaux",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <!-- Equilateral: A=(50,8) B=(88,74) C=(12,74) -->
  <polygon points='50,8 88,74 12,74' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Left side A=(50,8) to C=(12,74): dir=(-38,66) len=76.2. norm=(-0.499,0.866). perp=(-0.866,-0.499). mid=(31,41) -->
  <!-- tick: (31+4.3,41+2.5) to (31-4.3,41-2.5) = (35.3,43.5) to (26.7,38.5) -->
  <line x1='35.3' y1='43.5' x2='26.7' y2='38.5' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side A=(50,8) to B=(88,74): dir=(38,66) len=76.2. norm=(0.499,0.866). perp=(-0.866,0.499). mid=(69,41) -->
  <!-- tick: (69+4.3,41-2.5) to (69-4.3,41+2.5) = (73.3,38.5) to (64.7,43.5) -->
  <line x1='73.3' y1='38.5' x2='64.7' y2='43.5' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Bottom side B=(88,74) to C=(12,74): horizontal. perp=vertical. mid=(50,74) -->
  <line x1='50' y1='71' x2='50' y2='77' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Équilatéral : 3 côtés égaux",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  {
                    type: "table",
                    headersFr: ["Type", "Axes de symétrie"],
                    accentHeader: true,
                    colAligns: ["left", "center"],
                    rows: [
                      ["Quelconque", "0"],
                      ["Rectangle", "0"],
                      ["Isocèle", "1"],
                      ["Équilatéral", "3"],
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 80,82 20,82' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='50' y1='2' x2='50' y2='88' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "Isocèle : 1 axe",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 90' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 88,74 12,74' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Axis 1: through A=(50,8) and midpoint of BC=(50,74) — vertical -->
  <line x1='50' y1='2' x2='50' y2='80' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <!-- Axis 2: through B=(88,74) and midpoint of AC=(31,41) — slope=33/57≈0.579 -->
  <line x1='2' y1='24' x2='100' y2='81' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <!-- Axis 3: through C=(12,74) and midpoint of AB=(69,41) — slope=-33/57≈-0.579 -->
  <line x1='2' y1='80' x2='100' y2='23' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "Équilatéral : 3 axes",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 3. TRAPÈZE ────────────────────────────────────────────
          {
            id: "trapeze",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><polygon points='6,50 54,50 44,10 16,10' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "La somme des 4 angles d'un trapèze est **360°**. Les 2 angles d'une **même base** sont supplémentaires (somme = 180°)." },
                  {
                    type: "table",
                    headersFr: ["Type", "Angles particuliers"],
                    accentHeader: true,
                    colAligns: ["left", "left"],
                    rows: [
                      ["Quelconque", "aucun"],
                      ["Rectangle", "2 angles droits (90°)"],
                      ["Isocèle", "angles de base égaux"],
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='10,70 90,70 70,10 30,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- angle arc bottom-left -->
  <path d='M10,70 m10,-3 A10,10 0 0,1 16,58' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <!-- angle arc bottom-right (supplementary) -->
  <path d='M90,70 m-10,-3 A10,10 0 0,0 84,58' fill='none' stroke='#f97316' stroke-width='1.5'/>
  <text x='21' y='63' font-size='8' fill='var(--color-accent-alg)' font-family='sans-serif' font-weight='bold'>α</text>
  <text x='72' y='63' font-size='8' fill='#f97316' font-family='sans-serif' font-weight='bold'>β</text>
  <text x='28' y='78' font-size='8' fill='var(--color-text-secondary)' font-family='sans-serif'>α + β = 180°</text>
</svg>`,
                        captionFr: "Angles de même base",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='15,70 85,70 85,10 40,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M15,70 L29,70 L29,56' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M85,70 L85,56 L71,56' fill='none' stroke='#f97316' stroke-width='2'/>
</svg>`,
                        captionFr: "Rectangle : 2 angles droits",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Le trapèze a **une seule paire de côtés parallèles** (les deux bases). Le trapèze **isocèle** a les deux côtés latéraux égaux." },
                  {
                    type: "table",
                    headersFr: ["Type", "Côtés"],
                    accentHeader: true,
                    colAligns: ["left", "left"],
                    rows: [
                      ["Quelconque", "1 paire parallèle"],
                      ["Rectangle", "1 côté latéral ⊥ bases"],
                      ["Isocèle", "côtés latéraux égaux"],
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='10,70 90,70 70,10 30,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Parallel arrows on top and bottom bases -->
  <path d='M44,6 L50,10 L56,6' fill='none' stroke='#0891b2' stroke-width='2' stroke-linejoin='round'/>
  <path d='M44,74 L50,70 L56,74' fill='none' stroke='#0891b2' stroke-width='2' stroke-linejoin='round'/>
</svg>`,
                        captionFr: "1 paire de côtés parallèles",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <!-- Isosceles trapeze: A=(20,70) B=(80,70) C=(60,10) D=(40,10) -->
  <polygon points='20,70 80,70 60,10 40,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Left side A=(20,70) to D=(40,10): dir=(20,-60) len=63.2. norm=(0.316,-0.949). perp=(0.949,0.316). mid=(30,40) -->
  <!-- tick: (30-4.7,40-1.6) to (30+4.7,40+1.6) = (25.3,38.4) to (34.7,41.6) -->
  <line x1='25.3' y1='38.4' x2='34.7' y2='41.6' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side B=(80,70) to C=(60,10): dir=(-20,-60) len=63.2. norm=(-0.316,-0.949). perp=(0.949,-0.316). mid=(70,40) -->
  <!-- tick: (70-4.7,40+1.6) to (70+4.7,40-1.6) = (65.3,41.6) to (74.7,38.4) -->
  <line x1='65.3' y1='41.6' x2='74.7' y2='38.4' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Isocèle : côtés latéraux égaux",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Seul le **trapèze isocèle** a un axe de symétrie vertical. Les trapèzes quelconque et rectangle n'ont **aucun axe**." },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='20,70 80,70 60,10 40,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='50' y1='2' x2='50' y2='78' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "Isocèle : 1 axe vertical",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='10,70 90,70 70,10 30,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <text x='22' y='50' font-size='9' fill='#dc2626' font-family='sans-serif'>✗ 0 axe</text>
</svg>`,
                        captionFr: "Quelconque : 0 axe",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 4. CERCLE ─────────────────────────────────────────────
          {
            id: "cercle",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><circle cx='30' cy='30' r='24' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "Le cercle n'a pas d'angles de polygone. On définit un **angle au centre**. Un tour complet fait **360°**." },
                  { type: "rule", titleFr: "Angles clés", itemsFr: ["Tour complet = 360°", "Demi-cercle = 180°", "Quart de cercle = 90°"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='50' cy='50' r='38' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M50,50 L50,12 A38,38 0 0,1 82,68 Z' fill='var(--color-accent-alg)' fill-opacity='0.25' stroke='none'/>
  <line x1='50' y1='50' x2='50' y2='12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='50' x2='82' y2='68' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M50,35 A15,15 0 0,1 63,57' fill='none' stroke='#f97316' stroke-width='2'/>
  <circle cx='50' cy='50' r='3' fill='var(--color-accent-alg)'/>
</svg>`,
                        captionFr: "Angle au centre",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='50' cy='50' r='38' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M12,50 A38,38 0 0,1 88,50 Z' fill='var(--color-accent-alg)' fill-opacity='0.25'/>
  <line x1='12' y1='50' x2='88' y2='50' stroke='#f97316' stroke-width='2'/>
  <circle cx='50' cy='50' r='3' fill='#f97316'/>
  <text x='38' y='43' font-size='9' fill='#f97316' font-family='sans-serif' font-weight='bold'>180°</text>
</svg>`,
                        captionFr: "Demi-cercle = 180°",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Le **rayon r** relie le centre à un point du cercle. Le **diamètre d = 2r** traverse le cercle en passant par le centre." },
                  { type: "rule", titleFr: "Éléments", itemsFr: ["Rayon r = centre → bord", "Diamètre d = 2 × r"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='50' cy='50' r='38' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='50' x2='88' y2='50' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <circle cx='50' cy='50' r='3' fill='#f97316'/>
  <text x='62' y='44' font-size='10' fill='#f97316' font-family='sans-serif' font-weight='bold'>r</text>
</svg>`,
                        captionFr: "Rayon r",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='50' cy='50' r='38' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='12' x2='50' y2='88' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
  <circle cx='50' cy='50' r='3' fill='#0891b2'/>
  <text x='55' y='48' font-size='10' fill='#0891b2' font-family='sans-serif' font-weight='bold'>d=2r</text>
</svg>`,
                        captionFr: "Diamètre d = 2r",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Le cercle possède une **infinité d'axes de symétrie**. Tout **diamètre** est un axe de symétrie." },
                  { type: "rule", titleFr: "Symétrie", itemsFr: ["Tout diamètre est un axe", "→ Infinité d'axes"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <circle cx='50' cy='50' r='38' fill='var(--color-accent-alg)' fill-opacity='0.08' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='5' x2='50' y2='95' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
  <line x1='5' y1='50' x2='95' y2='50' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
  <line x1='15' y1='15' x2='85' y2='85' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='85' y1='15' x2='15' y2='85' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <text x='36' y='27' font-size='9' fill='#16a34a' font-family='sans-serif' font-weight='bold'>∞ axes</text>
</svg>`,
                        captionFr: "Infinité d'axes",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 5. RECTANGLE ─────────────────────────────────────────
          {
            id: "rectangle",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><rect x='4' y='14' width='52' height='32' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  {
                    type: "section",
                    labelFr: "",
                    itemsFr: [
                      "Chaque angle mesure 90°.",
                      "La somme des 4 angles vaut 360°.",
                    ],
                  },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 70' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='80' height='50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <path d='M10,10 L24,10 L24,24' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M90,10 L90,24 L76,24' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M90,60 L76,60 L76,46' fill='none' stroke='#f97316' stroke-width='2'/>
  <path d='M10,60 L10,46 L24,46' fill='none' stroke='#f97316' stroke-width='2'/>
</svg>`,
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Un rectangle a **2 longueurs** et **2 largeurs** égales. Les côtés opposés sont **parallèles**. Les diagonales sont **égales** et se coupent en leur milieu." },
                  { type: "rule", titleFr: "Propriétés", itemsFr: ["Longueurs égales (l)", "Largeurs égales (L)", "Diagonales égales"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 70' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='80' height='50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <!-- Top side (horizontal) — single tick: perpendicular = vertical, mid=(50,10) -->
  <line x1='50' y1='7' x2='50' y2='13' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Bottom side tick, mid=(50,60) -->
  <line x1='50' y1='57' x2='50' y2='63' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Left side (vertical) — double tick: perpendicular = horizontal, mid=(10,35) -->
  <line x1='7' y1='32' x2='13' y2='32' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='7' y1='38' x2='13' y2='38' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side double tick, mid=(90,35) -->
  <line x1='87' y1='32' x2='93' y2='32' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
  <line x1='87' y1='38' x2='93' y2='38' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Côtés opposés égaux (|, ||)",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 70' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='80' height='50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='10' y1='10' x2='90' y2='60' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <line x1='90' y1='10' x2='10' y2='60' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <circle cx='50' cy='35' r='4' fill='#f97316'/>
</svg>`,
                        captionFr: "Diagonales égales — milieu O",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Le rectangle possède **2 axes de symétrie** : l'axe horizontal et l'axe vertical passant par les milieux des côtés opposés." },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 70' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='80' height='50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2'/>
  <line x1='50' y1='2' x2='50' y2='68' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
  <line x1='2' y1='35' x2='98' y2='35' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "2 axes de symétrie",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 6. LOSANGE ────────────────────────────────────────────
          {
            id: "losange",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><polygon points='30,6 54,30 30,54 6,30' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "Le losange a **4 angles**. Les angles opposés sont **égaux**. Les angles adjacents sont **supplémentaires** (α + β = 180°)." },
                  { type: "rule", titleFr: "Propriétés", itemsFr: ["Angles opposés égaux (α = α, β = β)", "Angles adjacents : α + β = 180°", "Somme = 360°"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 88,50 50,92 12,50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Angle arc at top (narrow) -->
  <path d='M50,8 m8,14 A14,14 0 0,1 42,22' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.8'/>
  <!-- Angle arc at bottom (narrow, equal to top) -->
  <path d='M50,92 m-8,-14 A14,14 0 0,1 58,78' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.8'/>
  <!-- Angle arc at left (wide) -->
  <path d='M12,50 m12,-8 A12,12 0 0,1 20,58' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <!-- Angle arc at right (wide, equal to left) -->
  <path d='M88,50 m-12,-8 A12,12 0 0,0 80,58' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <text x='45' y='38' font-size='9' fill='var(--color-accent-alg)' font-family='sans-serif' font-weight='bold'>α</text>
  <text x='45' y='68' font-size='9' fill='var(--color-accent-alg)' font-family='sans-serif' font-weight='bold'>α</text>
  <text x='20' y='53' font-size='9' fill='#f97316' font-family='sans-serif' font-weight='bold'>β</text>
  <text x='73' y='53' font-size='9' fill='#f97316' font-family='sans-serif' font-weight='bold'>β</text>
</svg>`,
                        captionFr: "Angles opposés égaux",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Le losange a **4 côtés égaux**. Les côtés opposés sont **parallèles**. Les diagonales se **coupent en leur milieu** et sont **perpendiculaires**." },
                  { type: "rule", titleFr: "Propriétés", itemsFr: ["4 côtés égaux", "Côtés opposés parallèles", "Diagonales ⊥ et se coupent en milieu"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <!-- Losange: A=(50,8) B=(88,50) C=(50,92) D=(12,50) -->
  <polygon points='50,8 88,50 50,92 12,50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- AB: A=(50,8) B=(88,50) dir=(38,42) len=56.6 norm=(0.671,0.742) perp=(-0.742,0.671) mid=(69,29) -->
  <!-- tick from (69+3.7,29-3.4) to (69-3.7,29+3.4) = (72.7,25.6) to (65.3,32.4) -->
  <line x1='72.7' y1='25.6' x2='65.3' y2='32.4' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- BC: B=(88,50) C=(50,92) dir=(-38,42) len=56.6 norm=(-0.671,0.742) perp=(-0.742,-0.671) mid=(69,71) -->
  <!-- tick from (69+3.7,71+3.4) to (69-3.7,71-3.4) = (72.7,74.4) to (65.3,67.6) -->
  <line x1='72.7' y1='74.4' x2='65.3' y2='67.6' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- CD: C=(50,92) D=(12,50) dir=(-38,-42) len=56.6 norm=(-0.671,-0.742) perp=(0.742,-0.671) mid=(31,71) -->
  <!-- tick from (31-3.7,71+3.4) to (31+3.7,71-3.4) = (27.3,74.4) to (34.7,67.6) -->
  <line x1='27.3' y1='74.4' x2='34.7' y2='67.6' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- DA: D=(12,50) A=(50,8) dir=(38,-42) len=56.6 norm=(0.671,-0.742) perp=(0.742,0.671) mid=(31,29) -->
  <!-- tick from (31-3.7,29-3.4) to (31+3.7,29+3.4) = (27.3,25.6) to (34.7,32.4) -->
  <line x1='27.3' y1='25.6' x2='34.7' y2='32.4' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "4 côtés égaux",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 88,50 50,92 12,50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='50' y1='8' x2='50' y2='92' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <line x1='12' y1='50' x2='88' y2='50' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <path d='M44,50 L50,44 L56,50 L50,56 Z' fill='none' stroke='#f97316' stroke-width='1.5'/>
  <circle cx='50' cy='50' r='3' fill='#f97316'/>
</svg>`,
                        captionFr: "Diagonales ⊥ en O",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Le losange possède **2 axes de symétrie** : ses deux diagonales." },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 88,50 50,92 12,50' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='50' y1='2' x2='50' y2='98' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
  <line x1='2' y1='50' x2='98' y2='50' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "2 axes de symétrie",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 7. PARALLÉLOGRAMME ────────────────────────────────────
          {
            id: "parallelogramme",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><polygon points='8,48 48,48 52,12 12,12' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "Le parallélogramme a **4 angles**. Les angles opposés sont **égaux**. Les angles adjacents sont **supplémentaires** (α + β = 180°)." },
                  { type: "rule", titleFr: "Propriétés", itemsFr: ["Angles opposés égaux", "Angles adjacents : α + β = 180°", "Somme = 360°"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <!-- Parallelogram: A=(10,70) B=(80,70) C=(90,10) D=(20,10) -->
  <polygon points='10,70 80,70 90,10 20,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Angle arc at A (acute): A=(10,70), sides go to B=(80,70) and D=(20,10) -->
  <path d='M10,70 m12,-2 A12,12 0 0,1 16,56' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.8'/>
  <!-- Angle arc at C (acute, equal to A): C=(90,10) -->
  <path d='M90,10 m-12,2 A12,12 0 0,1 84,24' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.8'/>
  <!-- Angle arc at B (obtuse): B=(80,70) -->
  <path d='M80,70 m-10,-4 A10,10 0 0,0 74,58' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <!-- Angle arc at D (obtuse, equal to B): D=(20,10) -->
  <path d='M20,10 m10,4 A10,10 0 0,0 26,22' fill='none' stroke='#f97316' stroke-width='1.8'/>
  <text x='16' y='58' font-size='8.5' fill='var(--color-accent-alg)' font-family='sans-serif' font-weight='bold'>α</text>
  <text x='79' y='23' font-size='8.5' fill='var(--color-accent-alg)' font-family='sans-serif' font-weight='bold'>α</text>
  <text x='63' y='58' font-size='8.5' fill='#f97316' font-family='sans-serif' font-weight='bold'>β</text>
  <text x='26' y='23' font-size='8.5' fill='#f97316' font-family='sans-serif' font-weight='bold'>β</text>
</svg>`,
                        captionFr: "Angles opposés égaux",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Dans un parallélogramme, les côtés opposés sont **égaux** et **parallèles**. Les diagonales **se coupent en leur milieu**." },
                  { type: "rule", titleFr: "Propriétés", itemsFr: ["Côtés opposés égaux et parallèles", "Diagonales se coupent en milieu"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <!-- A=(10,70) B=(80,70) C=(90,10) D=(20,10) -->
  <polygon points='10,70 80,70 90,10 20,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Top side DC: D=(20,10) C=(90,10) horizontal, mid=(55,10) — single tick vertical -->
  <line x1='55' y1='7' x2='55' y2='13' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Bottom side AB: A=(10,70) B=(80,70) horizontal, mid=(45,70) — single tick -->
  <line x1='45' y1='67' x2='45' y2='73' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Left side AD: A=(10,70) D=(20,10) dir=(10,-60) len=60.8 norm=(0.164,-0.986) perp=(0.986,0.164) mid=(15,40) -->
  <!-- tick: (15-4.9,40-0.8) to (15+4.9,40+0.8) = (10.1,39.2) to (19.9,40.8) -->
  <line x1='10.1' y1='39.2' x2='19.9' y2='40.8' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
  <!-- Right side BC: B=(80,70) C=(90,10) dir=(10,-60) len=60.8 norm=(0.164,-0.986) perp=(0.986,0.164) mid=(85,40) -->
  <line x1='80.1' y1='39.2' x2='89.9' y2='40.8' stroke='#0891b2' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Côtés opposés égaux et ∥",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='10,70 80,70 90,10 20,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='10' y1='70' x2='90' y2='10' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <line x1='20' y1='10' x2='80' y2='70' stroke='var(--color-accent-alg)' stroke-width='1.5' stroke-dasharray='3,2' opacity='0.6'/>
  <circle cx='50' cy='40' r='4' fill='#f97316'/>
</svg>`,
                        captionFr: "Diagonales — milieu O",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Le parallélogramme quelconque n'a **aucun axe de symétrie axiale**. Il admet une **symétrie centrale** en O (intersection des diagonales)." },
                  { type: "rule", titleFr: "Symétrie", itemsFr: ["0 axe de symétrie axiale", "1 centre de symétrie : O"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='10,70 80,70 90,10 20,10' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='10' y1='70' x2='90' y2='10' stroke='var(--color-accent-alg)' stroke-width='1.2' stroke-dasharray='3,2' opacity='0.5'/>
  <line x1='20' y1='10' x2='80' y2='70' stroke='var(--color-accent-alg)' stroke-width='1.2' stroke-dasharray='3,2' opacity='0.5'/>
  <circle cx='50' cy='40' r='6' fill='none' stroke='#f97316' stroke-width='2'/>
  <circle cx='50' cy='40' r='2.5' fill='#f97316'/>
  <text x='57' y='38' font-size='8' fill='#f97316' font-family='sans-serif' font-weight='bold'>O</text>
</svg>`,
                        captionFr: "Symétrie centrale en O",
                      },
                    ],
                  },
                ],
              },
            ],
          },

          // ── 8. PENTAGONE ──────────────────────────────────────────
          {
            id: "pentagone",
            svg: `<svg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg' style='width:100%;height:100%;display:block'><polygon points='30,6 54,24 46,52 14,52 6,24' fill='var(--color-accent-alg)' fill-opacity='0.14' stroke='var(--color-accent-alg)' stroke-width='2.5' stroke-linejoin='round'/></svg>`,
            tabs: [
              {
                label: "Angles",
                blocks: [
                  { type: "plain", fr: "Un pentagone a **5 angles**. La somme est **(5 − 2) × 180° = 540°**. Dans un pentagone **régulier**, chaque angle mesure **108°**." },
                  { type: "rule", titleFr: "Formule", itemsFr: ["(5 − 2) × 180° = 540°", "Régulier : 5 × 108° = 540°"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 95' xmlns='http://www.w3.org/2000/svg'>
  <!-- Pentagon: A=(50,8) B=(90,36) C=(75,80) D=(25,80) E=(10,36) -->
  <polygon points='50,8 90,36 75,80 25,80 10,36' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- Angle arc at A=(50,8) -->
  <path d='M50,8 m10,14 A14,14 0 0,1 40,22' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <!-- Angle arc at B=(90,36) -->
  <path d='M90,36 m-13,4 A12,12 0 0,1 82,46' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <!-- Angle arc at C=(75,80) -->
  <path d='M75,80 m-8,-9 A10,10 0 0,1 68,72' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <!-- Angle arc at D=(25,80) -->
  <path d='M25,80 m8,-9 A10,10 0 0,0 32,72' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <!-- Angle arc at E=(10,36) -->
  <path d='M10,36 m13,4 A12,12 0 0,0 18,46' fill='none' stroke='var(--color-accent-alg)' stroke-width='1.5'/>
  <text x='35' y='82' font-size='8' fill='var(--color-text-secondary)' font-family='sans-serif'>Somme = 540°</text>
</svg>`,
                        captionFr: "5 angles, somme 540°",
                      },
                      {
                        markup: `<svg viewBox='0 0 100 95' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 90,36 75,80 25,80 10,36' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <path d='M50,8 m12,16 A16,16 0 0,1 38,24' fill='none' stroke='#f97316' stroke-width='2'/>
  <text x='39' y='38' font-size='8.5' fill='#f97316' font-family='sans-serif' font-weight='bold'>108°</text>
</svg>`,
                        captionFr: "Régulier : 108° chacun",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Droites",
                blocks: [
                  { type: "plain", fr: "Un pentagone **régulier** a **5 côtés égaux**. Un pentagone quelconque n'a aucune contrainte sur ses côtés." },
                  { type: "rule", titleFr: "Côtés", itemsFr: ["Régulier : 5 côtés égaux", "Quelconque : côtés libres"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 95' xmlns='http://www.w3.org/2000/svg'>
  <!-- A=(50,8) B=(90,36) C=(75,80) D=(25,80) E=(10,36) -->
  <polygon points='50,8 90,36 75,80 25,80 10,36' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <!-- AB: A=(50,8) B=(90,36) dir=(40,28) len=48.8 norm=(0.820,0.574) perp=(-0.574,0.820) mid=(70,22) -->
  <!-- tick: (70+2.9,22-4.1) to (70-2.9,22+4.1) = (72.9,17.9) to (67.1,26.1) -->
  <line x1='72.9' y1='17.9' x2='67.1' y2='26.1' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- BC: B=(90,36) C=(75,80) dir=(-15,44) len=46.5 norm=(-0.323,0.947) perp=(-0.947,-0.323) mid=(82.5,58) -->
  <!-- tick: (82.5+4.7,58+1.6) to (82.5-4.7,58-1.6) = (87.2,59.6) to (77.8,56.4) -->
  <line x1='87.2' y1='59.6' x2='77.8' y2='56.4' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- CD: C=(75,80) D=(25,80) horizontal, mid=(50,80) — vertical tick -->
  <line x1='50' y1='77' x2='50' y2='83' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- DE: D=(25,80) E=(10,36) dir=(-15,-44) len=46.5 norm=(-0.323,-0.947) perp=(0.947,-0.323) mid=(17.5,58) -->
  <!-- tick: (17.5-4.7,58+1.6) to (17.5+4.7,58-1.6) = (12.8,59.6) to (22.2,56.4) -->
  <line x1='12.8' y1='59.6' x2='22.2' y2='56.4' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
  <!-- EA: E=(10,36) A=(50,8) dir=(40,-28) len=48.8 norm=(0.820,-0.574) perp=(0.574,0.820) mid=(30,22) -->
  <!-- tick: (30-2.9,22-4.1) to (30+2.9,22+4.1) = (27.1,17.9) to (32.9,26.1) -->
  <line x1='27.1' y1='17.9' x2='32.9' y2='26.1' stroke='#f97316' stroke-width='2.5' stroke-linecap='round'/>
</svg>`,
                        captionFr: "Régulier : 5 côtés égaux",
                      },
                    ],
                  },
                ],
              },
              {
                label: "Symétries",
                blocks: [
                  { type: "plain", fr: "Le pentagone **régulier** possède **5 axes de symétrie**. Chaque axe passe par un sommet et le milieu du côté opposé." },
                  { type: "rule", titleFr: "Axes", itemsFr: ["Régulier : 5 axes de symétrie", "Quelconque : 0 axe"] },
                  {
                    type: "svg_row",
                    items: [
                      {
                        markup: `<svg viewBox='0 0 100 95' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='50,8 90,36 75,80 25,80 10,36' fill='var(--color-accent-alg)' fill-opacity='0.12' stroke='var(--color-accent-alg)' stroke-width='2' stroke-linejoin='round'/>
  <line x1='50' y1='2' x2='50' y2='82' stroke='#16a34a' stroke-width='1.8' stroke-dasharray='4,3'/>
  <line x1='2' y1='56' x2='82' y2='24' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='98' y1='56' x2='18' y2='24' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='12' y1='10' x2='78' y2='90' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
  <line x1='88' y1='10' x2='22' y2='90' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='4,3'/>
</svg>`,
                        captionFr: "5 axes de symétrie",
                      },
                    ],
                  },
                ],
              },
            ],
          },

        ],
      },
    ],
  },

  exercises: [
    {
      id: "g1-2-e1",
      promptFr: "Combien d'axes de symétrie a un carré ?",
      type: "number",
      acceptable: ["4"],
    },
    {
      id: "g1-2-e2",
      promptFr: "Quelle est la somme des angles intérieurs d'un triangle (en °) ?",
      type: "number",
      acceptable: ["180"],
    },
    {
      id: "g1-2-e3",
      promptFr: "Combien d'axes de symétrie a un triangle équilatéral ?",
      type: "number",
      acceptable: ["3"],
    },
    {
      id: "g1-2-e4",
      promptFr: "Un losange a combien d'axes de symétrie ?",
      type: "number",
      acceptable: ["2"],
    },
    {
      id: "g1-2-e5",
      promptFr: "Combien d'axes de symétrie a un cercle ? Répondre : infini",
      type: "short_text",
      acceptable: ["infini", "infinité", "∞"],
    },
    {
      id: "g1-2-e6",
      promptFr: "Quelle est la somme des angles d'un pentagone (en °) ?",
      type: "number",
      acceptable: ["540"],
    },
    {
      id: "g1-2-e7",
      promptFr: "Un rectangle a combien d'axes de symétrie ?",
      type: "number",
      acceptable: ["2"],
    },
  ],
};

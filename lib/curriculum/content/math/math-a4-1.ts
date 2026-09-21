import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A4-1",
    submoduleCode: "A4.1",
    theory: {
      title: { fr: "Notion et représentation",},
      paragraphs: {
        fr: [
          "Une fraction représente une ou plusieurs parties d'un tout divisé en parts égales.",
          "Elle est composée d'un numérateur (nombre en haut = parts utilisées) et d'un dénominateur (nombre en bas = nombre total de parts égales).",
          "Les fractions décimales ont pour dénominateur 10 ou 100. Exemples : 3/10, 62/10, 19/100, 184/100.",
          "Un nombre entier s'écrit aussi sous forme de fraction : 3 = 3/1. Et n/n = 1 pour tout n ≠ 0.",
        ],
      },
      blocks: [
        {
          type: "plain",
          fr: "Une fraction représente une ou plusieurs parties d'un tout divisé en parts égales. Elle s'écrit avec deux nombres séparés par une barre de fraction.",
        },
        {
          type: "svg",
          noFrame: true,
          markup: `<svg viewBox='0 0 360 190' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:360px;display:block;margin:0 auto'>
  <defs>
    <marker id='a41mn' markerWidth='7' markerHeight='6' refX='6' refY='3' orient='auto'><path d='M0,0 L7,3 L0,6 Z' fill='#38e1ff'/></marker>
    <marker id='a41md' markerWidth='7' markerHeight='6' refX='6' refY='3' orient='auto'><path d='M0,0 L7,3 L0,6 Z' fill='#fe9a00'/></marker>
  </defs>
  <text x='180' y='75' text-anchor='middle' font-size='60' font-weight='700' fill='#38e1ff' font-family='Poppins, sans-serif'>3</text>
  <line x1='148' y1='95' x2='212' y2='95' stroke='#0f172a' stroke-width='4' stroke-linecap='round'/>
  <text x='180' y='157' text-anchor='middle' font-size='60' font-weight='700' fill='#fe9a00' font-family='Poppins, sans-serif'>4</text>
  <text x='8' y='41' font-size='12' font-weight='700' fill='#38e1ff' font-family='Poppins, sans-serif'>Numérateur</text>
  <text x='8' y='67' font-size='11' fill='#475569' font-family='Poppins, sans-serif'>Parts utilisées</text>
  <line x1='118' y1='54' x2='150' y2='54' stroke='#38e1ff' stroke-width='1.5' marker-end='url(#a41mn)'/>
  <line x1='212' y1='136' x2='242' y2='136' stroke='#fe9a00' stroke-width='1.5' marker-end='url(#a41md)'/>
  <text x='250' y='123' font-size='12' font-weight='700' fill='#fe9a00' font-family='Poppins, sans-serif'>Dénominateur</text>
  <text x='250' y='149' font-size='11' fill='#475569' font-family='Poppins, sans-serif'>Parts totales</text>
</svg>`,
        },
        {
          type: "section",
          labelFr: "Les deux parties d'une fraction",
          itemsFr: [
            "Le numérateur : indique combien de parts sont prises ou utilisées.",
            "Le dénominateur : indique en combien de parts égales l'unité entière est divisée.",
            "La barre de fraction signifie « divisé par » : [[frac:3/4]] = 3 ÷ 4.",
          ],
        },
        { type: "plain", fr: "" },
        {
          type: "section",
          labelFr: "Cas particuliers",
          itemsFr: [
            "Tout nombre entier s'écrit sous forme de fraction avec dénominateur 1 (ex : 3 = [[frac:3/1]]).",
            "Toute fraction n/n est égale à 1 (ex : [[frac:7/7]] = 1, [[frac:100/100]] = 1).",
          ],
        },

        { type: "heading", fr: "Comment lire une fraction", black: true },
        {
          type: "plain",
          fr: "Quand le dénominateur est 10 ou 100, on parle de fractions décimales. L'unité est découpée en 10 ou 100 parts égales.",
        },
        {
          type: "svg",
          markup: `<svg viewBox='0 0 320 125' xmlns='http://www.w3.org/2000/svg' style='width:100%;max-width:320px;display:block;margin:0 auto'>
  <rect x='10' y='10' width='80' height='80' fill='#dbeafe' stroke='#95a7cf' stroke-width='2'/>
  <text x='50' y='57' text-anchor='middle' font-size='22' font-weight='700' fill='#1d4ed8' font-family='system-ui'>1</text>
  <text x='50' y='102' text-anchor='middle' font-size='11' font-weight='600' fill='#1e40af' font-family='system-ui'>1 unité</text>
  <text x='50' y='115' text-anchor='middle' font-size='10' fill='#64748b' font-family='system-ui'>(entier)</text>
  <rect x='120' y='10' width='80' height='80' fill='#f0f9ff' stroke='#2563eb' stroke-width='2'/>
  <line x1='128' y1='10' x2='128' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='136' y1='10' x2='136' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='144' y1='10' x2='144' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='152' y1='10' x2='152' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='160' y1='10' x2='160' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='168' y1='10' x2='168' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='176' y1='10' x2='176' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='184' y1='10' x2='184' y2='90' stroke='#93c5fd' stroke-width='1'/><line x1='192' y1='10' x2='192' y2='90' stroke='#93c5fd' stroke-width='1'/>
  <text x='160' y='102' text-anchor='middle' font-size='11' font-weight='600' fill='#1e40af' font-family='system-ui'>÷ 10 parts</text>
  <text x='160' y='115' text-anchor='middle' font-size='10' fill='#64748b' font-family='system-ui'>dixièmes</text>
  <rect x='230' y='10' width='80' height='80' fill='#f0f9ff' stroke='#2563eb' stroke-width='2'/>
  <line x1='238' y1='10' x2='238' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='246' y1='10' x2='246' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='254' y1='10' x2='254' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='262' y1='10' x2='262' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='270' y1='10' x2='270' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='278' y1='10' x2='278' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='286' y1='10' x2='286' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='294' y1='10' x2='294' y2='90' stroke='#93c5fd' stroke-width='0.5'/><line x1='302' y1='10' x2='302' y2='90' stroke='#93c5fd' stroke-width='0.5'/>
  <line x1='230' y1='18' x2='310' y2='18' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='26' x2='310' y2='26' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='34' x2='310' y2='34' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='42' x2='310' y2='42' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='50' x2='310' y2='50' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='58' x2='310' y2='58' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='66' x2='310' y2='66' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='74' x2='310' y2='74' stroke='#93c5fd' stroke-width='0.5'/><line x1='230' y1='82' x2='310' y2='82' stroke='#93c5fd' stroke-width='0.5'/>
  <text x='270' y='102' text-anchor='middle' font-size='11' font-weight='600' fill='#1e40af' font-family='system-ui'>÷ 100 parts</text>
  <text x='270' y='115' text-anchor='middle' font-size='10' fill='#64748b' font-family='system-ui'>centièmes</text>
</svg>`,
        },
        
        {
          type: "plain",
          fr: "",
        },

        {
          type: "highlight",
          fr: "Exemples avec dixièmes et centièmes",
        },
        {
          type: "svg_row",
          items: [
            {
              markup: `<svg viewBox='0 0 140 105' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <text x='70' y='20' text-anchor='middle' font-size='18' font-weight='700' fill='#1d4ed8' font-family='Century Schoolbook,Georgia,serif'>3</text>
  <line x1='52' y1='25' x2='88' y2='25' stroke='#0f172a' stroke-width='2.5' stroke-linecap='round'/>
  <text x='70' y='42' text-anchor='middle' font-size='18' font-weight='700' fill='#0f172a' font-family='Century Schoolbook,Georgia,serif'>10</text>
  <rect x='10' y='52' width='120' height='40' fill='#eff6ff' stroke='#2563eb' stroke-width='1.5'/>
  <rect x='10' y='52' width='36' height='40' fill='#3b82f6'/>
  <line x1='22' y1='52' x2='22' y2='92' stroke='white' stroke-width='1'/><line x1='34' y1='52' x2='34' y2='92' stroke='white' stroke-width='1'/><line x1='46' y1='52' x2='46' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='58' y1='52' x2='58' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='70' y1='52' x2='70' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='82' y1='52' x2='82' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='94' y1='52' x2='94' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='106' y1='52' x2='106' y2='92' stroke='#93c5fd' stroke-width='1'/><line x1='118' y1='52' x2='118' y2='92' stroke='#93c5fd' stroke-width='1'/>
  <rect x='10' y='52' width='120' height='40' fill='none' stroke='#2563eb' stroke-width='1.5'/>
</svg>`,
            },
            {
              markup: `<svg viewBox='0 0 140 115' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <text x='70' y='20' text-anchor='middle' font-size='18' font-weight='700' fill='#1d4ed8' font-family='Century Schoolbook,Georgia,serif'>19</text>
  <line x1='46' y1='25' x2='94' y2='25' stroke='#0f172a' stroke-width='2.5' stroke-linecap='round'/>
  <text x='70' y='42' text-anchor='middle' font-size='18' font-weight='700' fill='#0f172a' font-family='Century Schoolbook,Georgia,serif'>100</text>
  <rect x='10' y='52' width='120' height='60' fill='#eff6ff' stroke='#2563eb' stroke-width='1.5'/>
  <rect x='10' y='52' width='120' height='6' fill='#3b82f6'/>
  <rect x='10' y='58' width='108' height='6' fill='#3b82f6'/>
  <line x1='22' y1='52' x2='22' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='34' y1='52' x2='34' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='46' y1='52' x2='46' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='58' y1='52' x2='58' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='70' y1='52' x2='70' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='82' y1='52' x2='82' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='94' y1='52' x2='94' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='106' y1='52' x2='106' y2='112' stroke='#93c5fd' stroke-width='0.5'/><line x1='118' y1='52' x2='118' y2='112' stroke='#93c5fd' stroke-width='0.5'/>
  <line x1='10' y1='58' x2='130' y2='58' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='64' x2='130' y2='64' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='70' x2='130' y2='70' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='76' x2='130' y2='76' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='82' x2='130' y2='82' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='88' x2='130' y2='88' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='94' x2='130' y2='94' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='100' x2='130' y2='100' stroke='#93c5fd' stroke-width='0.5'/><line x1='10' y1='106' x2='130' y2='106' stroke='#93c5fd' stroke-width='0.5'/>
  <rect x='10' y='52' width='120' height='60' fill='none' stroke='#2563eb' stroke-width='1.5'/>
</svg>`,
            },
            {
              markup: `<svg viewBox='0 0 140 105' xmlns='http://www.w3.org/2000/svg' style='width:100%;display:block;margin:0 auto'>
  <text x='70' y='20' text-anchor='middle' font-size='18' font-weight='700' fill='#1d4ed8' font-family='Century Schoolbook,Georgia,serif'>62</text>
  <line x1='46' y1='25' x2='94' y2='25' stroke='#0f172a' stroke-width='2.5' stroke-linecap='round'/>
  <text x='70' y='42' text-anchor='middle' font-size='18' font-weight='700' fill='#0f172a' font-family='Century Schoolbook,Georgia,serif'>10</text>
  <rect x='10' y='52' width='120' height='40' fill='#3b82f6' stroke='#2563eb' stroke-width='1.5'/>
  <line x1='22' y1='52' x2='22' y2='92' stroke='white' stroke-width='1'/><line x1='34' y1='52' x2='34' y2='92' stroke='white' stroke-width='1'/><line x1='46' y1='52' x2='46' y2='92' stroke='white' stroke-width='1'/><line x1='58' y1='52' x2='58' y2='92' stroke='white' stroke-width='1'/><line x1='70' y1='52' x2='70' y2='92' stroke='white' stroke-width='1'/><line x1='82' y1='52' x2='82' y2='92' stroke='white' stroke-width='1'/><line x1='94' y1='52' x2='94' y2='92' stroke='white' stroke-width='1'/><line x1='106' y1='52' x2='106' y2='92' stroke='white' stroke-width='1'/><line x1='118' y1='52' x2='118' y2='92' stroke='white' stroke-width='1'/>
  <rect x='10' y='52' width='120' height='40' fill='none' stroke='#2563eb' stroke-width='1.5'/>
  <text x='70' y='100' text-anchor='middle' font-size='9' fill='#1d4ed8' font-family='system-ui'>= 6,2 (plus d'1 unité)</text>
</svg>`,
            },
          ],
        },
      ],
    },


    exercises: [],
    exercisePool: [
      { id: "a4-1-ep01", promptFr: "Quel est le numérateur de la fraction 3/7 ?", type: "number", acceptable: ["3"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep02", promptFr: "Quel est le dénominateur de la fraction 5/8 ?", type: "number", acceptable: ["8"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep03", promptFr: "Quel est le numérateur de la fraction 2/5 ?", type: "number", acceptable: ["2"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep04", promptFr: "Quel est le dénominateur de la fraction 9/11 ?", type: "number", acceptable: ["11"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep05", promptFr: "Si une pizza est coupée en 8 parts et que vous en mangez 3, quelle fraction avez-vous mangée ? Écrivez la fraction (ex: 3/8).", type: "short_text", acceptable: ["3/8"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep06", promptFr: "On partage un gâteau en 4 parts égales. Chaque part représente quelle fraction ? (ex: 1/4)", type: "short_text", acceptable: ["1/4"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep07", promptFr: "3/3 est-il égal à 1 ? Répondez oui ou non.", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep08", promptFr: "Quel entier est égal à 6/1 ?", type: "number", acceptable: ["6"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep09", promptFr: "Écrivez 5 sous forme de fraction avec le dénominateur 1. (ex: 5/1)", type: "short_text", acceptable: ["5/1"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
      { id: "a4-1-ep10", promptFr: "Quel est le numérateur de la fraction 7/10 ?", type: "number", acceptable: ["7"], hintFr: "Le numérateur (en haut) indique les parties prises. Le dénominateur (en bas) indique le total de parts."},
    ],
    poolSize: 5,
  };

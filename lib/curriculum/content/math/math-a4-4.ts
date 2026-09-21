import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_4_LESSON: MathSubmoduleLesson = {
    submoduleId: "A4-4",
    submoduleCode: "A4.4",
    theory: {
      title: { fr: "Addition et soustraction de fractions",},
      paragraphs: {
        fr: [
          "Additionner ou soustraire des fractions consiste à calculer leur somme ou leur différence.",
        ],
      },

      blocks: [
      { type: "plain", fr: "Additionner ou soustraire des fractions consiste à calculer leur somme ou leur différence." },

      { type: "heading", fr: "Même dénominateur", black: true },
      { type: "plain", fr: "Pour additionner ou soustraire des fractions qui ont le même dénominateur"},
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On additionne ou soustrait les numérateurs.",
          "Et on garde le même dénominateur.",
        ],
      },
      
      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr:"[[frac:2/7]] + [[frac:3/7]] = [[frac:5/7]]." },
      { type: "plain", fr:"[[frac:6/11]] - [[frac:4/11]] = [[frac:2/11]]." },

      { type: "heading", fr: "Dénominateur différent", black: true },
      { type: "plain", fr: "Pour additionner ou soustraire des fractions qui ont des dénominateurs différents"},
      
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On met les fractions au même dénominateur (PPMC).",
          "On multiplie le numérateur et le dénominateur de chaque fraction par le dénominateur de l’autre fraction.",
          "On additionne ou soustrait les numérateurs.",
          "On simplifie la fraction si possible.",
        ],
      },

      {
          type: "highlight",
          fr: "Exemple d'addition",
        },

      { type: "plain", fr: "[[frac:9/3]] + [[frac:6/4]]" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "On met au même dénominateur : [[frac:9/3]] = [[frac:36/12]] et [[frac:6/4]] = [[frac:18/12]]",
          "On additionne les numérateurs : [[frac:36/12]] + [[frac:18/12]] = [[frac:54/12]]",
          "On simplifie la fraction : [[frac:54/12]] = [[frac:9/2]].",
        ],
      },
      
      {
        type: "highlight",
        fr: "Exemple de soustraction",
        },

        { type: "plain", fr: "[[frac:7/3]] - [[frac:5/6]]" },

        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "On met au même dénominateur : [[frac:7/3]] = [[frac:14/6]] et [[frac:5/6]] = [[frac:5/6]]",
            "On soustrait les numérateurs : [[frac:14/6]] - [[frac:5/6]] = [[frac:9/6]]",
            "On simplifie la fraction : [[frac:9/6]] = [[frac:3/2]].",
          ],
        },

      ],
    },
    exercises: [],
    exercisePool: [
      { id: "a4-4-ep01", promptFr: "Calculez 1/5 + 2/5. (ex: 3/5)", type: "short_text", acceptable: ["3/5"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep02", promptFr: "Calculez 3/8 + 2/8. (ex: 5/8)", type: "short_text", acceptable: ["5/8"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep03", promptFr: "Calculez 5/7 − 2/7. (ex: 3/7)", type: "short_text", acceptable: ["3/7"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep04", promptFr: "Calculez 1/2 + 1/3. PPCM(2,3)=6 : 3/6 + 2/6 = ? (ex: 5/6)", type: "short_text", acceptable: ["5/6"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep05", promptFr: "Calculez 3/4 − 1/2. PPCM(4,2)=4 : 3/4 − 2/4 = ? (ex: 1/4)", type: "short_text", acceptable: ["1/4"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep06", promptFr: "Calculez 2/3 + 1/6. PPCM(3,6)=6 : 4/6 + 1/6 = ? Simplifiez. (ex: 5/6)", type: "short_text", acceptable: ["5/6"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep07", promptFr: "Calculez 7/8 − 3/8. (ex: 1/2)", type: "short_text", acceptable: ["4/8", "1/2"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep08", promptFr: "Calculez 1/4 + 1/4 + 1/4. (ex: 3/4)", type: "short_text", acceptable: ["3/4"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep09", promptFr: "Calculez 5/6 − 1/3. PPCM(6,3)=6 : 5/6 − 2/6 = ? (ex: 3/6 ou 1/2)", type: "short_text", acceptable: ["3/6", "1/2"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
      { id: "a4-4-ep10", promptFr: "Calculez 1/2 + 1/4. PPCM(2,4)=4 : 2/4 + 1/4 = ? (ex: 3/4)", type: "short_text", acceptable: ["3/4"], hintFr: "Même dénominateur : additionne ou soustrait les numérateurs, garde le dénominateur."},
    ],
    poolSize: 5,
  };

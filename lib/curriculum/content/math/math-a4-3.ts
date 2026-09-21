import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "A4-3",
    submoduleCode: "A4.3",
    theory: {
      title: { fr: "Comparaison de fractions",},
      paragraphs: {
        fr: [
          "Comparer des fractions signifie déterminer si une fraction est plus grande, plus petite ou égale à une autre fraction.",
        ],
      },
      blocks: [
      { type: "plain", fr: "Comparer des fractions signifie déterminer si une fraction est plus grande, plus petite ou égale à une autre fraction." },

      { type: "heading", fr: "Même dénominateur", black: true },
      { type: "plain", fr: "Quand les dénominateurs sont identiques, on compare seulement les numérateurs. La fraction avec le plus grand numérateur est la plus grande." },

      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr: "La fraction [[frac:3/5]] est plus grande que la fraction [[frac:2/5]]." },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "[[frac:3/5]] > [[frac:2/5]] , car 3 > 2.",
          ],
        },
      
      { type: "heading", fr: "Même numérateur", black: true },
      { type: "plain", fr: "Quand les numérateurs sont identiques, on compare seulement les dénominateurs. La fraction avec le plus petit dénominateur est la plus grande." },

      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr: "La fraction [[frac:3/4]] est plus grande que la fraction [[frac:3/6]]." },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "[[frac:3/4]] > [[frac:3/6]] , car 4 < 6.",
          ],
        },
      
      { type: "heading", fr: "Cas général", black: true },
      { type: "plain", fr: "Quand les fractions sont différentes, on utilise le produit en croix. La fraction avec le plus grand produit est la plus grande." },

      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr: "La fraction [[frac:2/3]] est plus grande que la fraction [[frac:3/5]]." },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "[[frac:2/3]] > [[frac:3/6]] , car 2 × 5 = 10 et 3 × 3 = 9.",
          ],
        },
      ],
    },


    exercises: [],
    exercisePool: [
      { id: "a4-3-ep01", promptFr: "Comparez 3/5 et 4/5. Laquelle est plus grande ? (3/5 ou 4/5)", type: "short_text", acceptable: ["4/5"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep02", promptFr: "Comparez 1/4 et 1/3. Laquelle est plus grande ? (1/4 ou 1/3)", type: "short_text", acceptable: ["1/3"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep03", promptFr: "1/2 > 1/3 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep04", promptFr: "Comparez 2/3 et 3/4. Utilisez la multiplication croisée : 2×4=8, 3×3=9. Laquelle est plus grande ? (2/3 ou 3/4)", type: "short_text", acceptable: ["3/4"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep05", promptFr: "5/8 et 3/8 : quelle est la plus petite ?", type: "short_text", acceptable: ["3/8"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep06", promptFr: "7/10 et 3/5 : mettez au même dénominateur (3/5 = 6/10). Laquelle est plus grande ?", type: "short_text", acceptable: ["7/10"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep07", promptFr: "Comparez 2/5 et 1/2. Produit croisé : 2×2=4, 5×1=5. Laquelle est plus petite ?", type: "short_text", acceptable: ["2/5"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep08", promptFr: "3/4 > 2/4 ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep09", promptFr: "1/6 et 1/5 : laquelle est la plus grande ?", type: "short_text", acceptable: ["1/5"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
      { id: "a4-3-ep10", promptFr: "5/6 et 7/8 : produit croisé 5×8=40, 7×6=42. Laquelle est plus grande ?", type: "short_text", acceptable: ["7/8"], hintFr: "Même dénominateur : compare les numérateurs. Dénominateurs différents : réduis au même dénominateur."},
    ],
    poolSize: 5,
  };
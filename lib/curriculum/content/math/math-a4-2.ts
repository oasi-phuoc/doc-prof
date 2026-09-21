import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A4_2_LESSON: MathSubmoduleLesson = {
    submoduleId: "A4-2",
    submoduleCode: "A4.2",
    theory: {
      title: { fr: "Fractions équivalentes",},
      paragraphs: {
        fr: [
          "Deux fractions sont équivalentes lorsqu’elles représentent la même quantité, même si les nombres sont différents.",
        ],
        
      },
      
      blocks: [      
      { type: "plain", fr: "Deux fractions sont équivalentes lorsqu’elles représentent la même quantité, même si les nombres sont différents." },
      { type: "highlight", fr: "Exemple"},

      { type: "plain", fr: "Ces fractions sont différentes, mais elles ont la même valeur." },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "[[frac:1/2]] = [[frac:2/4]] = [[frac:3/6]]",
          ],
        },

      { type: "heading", fr: "Simplifier une fraction", black: true },
      { type: "plain", fr: "Simplifier une fraction signifie écrire une fraction équivalente plus simple." },
      
      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr: "La fraction simplifiée de [[frac:12/18]] = est donc [[frac:2/3]]." },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "[[frac:12/18]] = [[frac:12÷6/18÷6]] = [[frac:2/3]].",
          ],
        },

      { type: "heading", fr: "Vérifier si les fractions sont équivalentes", black: true },
      { type: "plain", fr: "On compare les produits en croix pour vérifier si les fractions sont équivalentes." },
      
      {
          type: "highlight",
          fr: "Exemple",
        },

      { type: "plain", fr: "Les fractions [[frac:12/18]] et [[frac:2/3]] sont équivalentes car : " },

      {
          type: "section",
          labelFr: "",
          itemsFr: [
            "2 × 18 = 36 et 3 × 12 = 36.",
          ],
        },
      ],
    },


    exercises: [],
    exercisePool: [
      { id: "a4-2-ep01", promptFr: "Simplifiez 4/8 en fraction irréductible. (ex: 1/2)", type: "short_text", acceptable: ["1/2"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep02", promptFr: "Simplifiez 6/9 en fraction irréductible. (ex: 2/3)", type: "short_text", acceptable: ["2/3"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep03", promptFr: "Simplifiez 10/15 en fraction irréductible. (ex: 2/3)", type: "short_text", acceptable: ["2/3"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep04", promptFr: "Simplifiez 12/16 en fraction irréductible. (ex: 3/4)", type: "short_text", acceptable: ["3/4"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep05", promptFr: "2/3 et 4/6 sont-elles des fractions équivalentes ? (oui/non)", type: "short_text", acceptable: ["oui", "Oui", "OUI"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep06", promptFr: "Complétez : 1/2 = ?/6. Quelle est la valeur du numérateur manquant ?", type: "number", acceptable: ["3"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep07", promptFr: "Complétez : 3/4 = ?/12. Quelle est la valeur du numérateur manquant ?", type: "number", acceptable: ["9"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep08", promptFr: "Simplifiez 8/12 en fraction irréductible. (ex: 2/3)", type: "short_text", acceptable: ["2/3"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep09", promptFr: "Simplifiez 15/25 en fraction irréductible. (ex: 3/5)", type: "short_text", acceptable: ["3/5"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
      { id: "a4-2-ep10", promptFr: "Complétez : 2/5 = ?/10. Quelle est la valeur du numérateur manquant ?", type: "number", acceptable: ["4"], hintFr: "Trouve le PGCD du numérateur et du dénominateur, puis divise les deux par ce nombre."},
    ],
    poolSize: 5,
  };
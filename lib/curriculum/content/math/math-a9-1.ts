import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A9_1_LESSON: MathSubmoduleLesson = {
    submoduleId: "A9-1",
    submoduleCode: "A9.1",
    theory: {
      title: {
        fr: "Lire et écrire une expression algébrique",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Qu'est-ce qu'une expression algébrique ?",
          black: true,
        },
        {
          type: "plain",
          fr: "Une expression algébrique est une combinaison de nombres, de variables et d'opérations (**+**, **−**, ×, ÷).",
        },
        {
          type: "section",
          labelFr: "Exemples d'expressions",
          itemsFr: [
            "3x **+** 2",
            "5a **−** b",
            "x² **+** 4x **−** 7",
          ],
        },
        {
          type: "heading",
          fr: "Vocabulaire essentiel",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Élément", "Définition", "Exemple avec −6cd²"],
          accentHeader: true,
          autoWidth: true,
          rows: [
            ["Monôme", "Produit d'un nombre et d'une ou plusieurs lettres", "−6cd²"],
            ["Coefficient", "Partie numérique, avec son signe", "−6"],
            ["Partie littérale", "Lettres et exposants du monôme", "cd²"],
            ["Degré", "Somme des exposants de la partie littérale", "1 + 2 = 3"],
          ],
        },
        {
          type: "highlight",
          fr: "Comment reconnaître les trois éléments ?",
        },
        {
          type: "plain",
          fr: "Dans le monôme −6cd² :",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "Le **coefficient** est −6.",
            "La **partie littérale** est cd².",
            "Le **degré** est 3, car c = c¹ et d² : 1 + 2 = 3.",
            "Un nombre sans lettre est un terme constant de degré 0.",
          ],
        },
        {
          type: "plain",
          fr: "",
        },
        {
          type: "heading",
          fr: "Conventions d'écriture",
          black: true,
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "On omet le signe × entre un nombre et une variable : 3x signifie 3 × x",
            "Le coefficient s'écrit toujours **avant** la variable : 5x (pas x5)",
            "Le coefficient 1 est omis : 1x s'écrit simplement x",
            "Le coefficient −1 s'écrit −x (sans le 1)",
          ],
        },
      ],
    },
  exercises: [],
  exercisePool: [],
  poolSize: 5,
};

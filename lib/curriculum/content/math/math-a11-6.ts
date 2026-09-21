import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A11_6_LESSON: MathSubmoduleLesson = {
    submoduleId: "A11-6",
    submoduleCode: "A11.6",
    theory: {
      title: {
        fr: "Pente et ordonnée",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "La pente (coefficient directeur)",
          black: true,
        },
        {
          type: "plain",
          fr: "La pente a mesure la variation de y pour chaque unité d'augmentation de x. Elle indique l'inclinaison et le sens de la droite.",
        },
        {
          type: "rule",
          titleFr: "Formule de la pente",
          itemsFr: [
            "a = Δy / Δx = (y₂ **−** y₁) / (x₂ **−** x₁)",
            "avec deux points distincts A(x₁, y₁) et B(x₂, y₂)",
          ],
        },
        {
          type: "example",
          fr: "Droite passant par A(1, 3) et B(3, 7) :\na = (7 − 3) / (3 − 1) = 4 / 2 = 2",
        },
        {
          type: "heading",
          fr: "Interprétation de la pente",
          black: true,
        },
        {
          type: "table",
          headersFr: ["Signe de a", "Type de droite", "Signification"],
          accentHeader: true,
          rows: [
            ["a **>** 0", "Croissante", "y augmente quand x augmente"],
            ["a **<** 0", "Décroissante", "y diminue quand x augmente"],
            ["a = 0", "Horizontale", "y ne change pas"],
          ],
        },
        {
          type: "heading",
          fr: "L'ordonnée à l'origine",
          black: true,
        },
        {
          type: "plain",
          fr: "L'ordonnée à l'origine b est la valeur de y lorsque x = 0. Elle se lit directement sur le graphique au point d'intersection avec l'axe y.",
        },
        {
          type: "highlight",
          fr: "Trouver a et b depuis deux points",
        },
        {
          type: "section",
          labelFr: "",
          itemsFr: [
            "1. Calculer a = (y₂ **−** y₁) / (x₂ **−** x₁)",
            "2. Écrire f(x) = ax **+** b",
            "3. Substituer un des points pour trouver b : b = y₁ **−** a × x₁",
          ],
        },
        {
          type: "example",
          fr: "Points A(0, 4) et B(3, 7) :\na = (7 − 4) / (3 − 0) = 3/3 = 1\nb = 4 (ordonnée de A, car x₁ = 0)\nDonc : f(x) = x + 4",
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a11-6-ep01", promptFr: "Points A(0 ; 2) et B(3 ; 8). Calcule la pente.", type: "number", acceptable: ["2"], hintFr: "Pente = (8 − 2) ÷ (3 − 0) = 6 ÷ 3 = ?" },
    { id: "a11-6-ep02", promptFr: "Points A(1 ; 4) et B(4 ; 10). Calcule la pente.", type: "number", acceptable: ["2"], hintFr: "Pente = (10 − 4) ÷ (4 − 1) = 6 ÷ 3 = ?" },
    { id: "a11-6-ep03", promptFr: "Points A(0 ; 0) et B(3 ; 9). Calcule la pente.", type: "number", acceptable: ["3"], hintFr: "Pente = (9 − 0) ÷ (3 − 0) = 9 ÷ 3 = ?" },
    { id: "a11-6-ep04", promptFr: "Points A(2 ; 3) et B(5 ; 9). Calcule la pente.", type: "number", acceptable: ["2"], hintFr: "Pente = (9 − 3) ÷ (5 − 2) = 6 ÷ 3 = ?" },
    { id: "a11-6-ep05", promptFr: "Points A(1 ; 8) et B(4 ; 2). Calcule la pente.", type: "number", acceptable: ["-2"], hintFr: "Pente = (2 − 8) ÷ (4 − 1) = −6 ÷ 3 = ?" },
    { id: "a11-6-ep06", promptFr: "Points A(1 ; 2) et B(4 ; 11). Calcule la pente.", type: "number", acceptable: ["3"], hintFr: "Pente = (11 − 2) ÷ (4 − 1) = 9 ÷ 3 = ?" },
    { id: "a11-6-ep07", promptFr: "Points A(0 ; −3) et B(4 ; 5). Calcule la pente.", type: "number", acceptable: ["2"], hintFr: "Pente = (5 − (−3)) ÷ (4 − 0) = 8 ÷ 4 = ?" },
    { id: "a11-6-ep08", promptFr: "f(x) = 4x + 7. Quelle est l'ordonnée à l'origine ?", type: "number", acceptable: ["7"], hintFr: "L'ordonnée à l'origine est b = 7 dans f(x) = ax + b." },
    { id: "a11-6-ep09", promptFr: "f(x) = −5x + 3. Quel est le coefficient directeur ?", type: "number", acceptable: ["-5"], hintFr: "Le coefficient directeur est a = −5." },
    { id: "a11-6-ep10", promptFr: "Points A(0 ; 8) et B(4 ; 0). Calcule la pente.", type: "number", acceptable: ["-2"], hintFr: "Pente = (0 − 8) ÷ (4 − 0) = −8 ÷ 4 = ?" },
    { id: "a11-6-ep11", promptFr: "Points A(2 ; 1) et B(5 ; 7). Calcule la pente.", type: "number", acceptable: ["2"], hintFr: "Pente = (7 − 1) ÷ (5 − 2) = 6 ÷ 3 = ?" },
    { id: "a11-6-ep12", promptFr: "f(x) = 9x − 6. Quelle est l'ordonnée à l'origine ?", type: "number", acceptable: ["-6"], hintFr: "L'ordonnée à l'origine est b = −6." },
  ],
  poolSize: 5,
};

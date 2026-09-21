import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_A11_3_LESSON: MathSubmoduleLesson = {
    submoduleId: "A11-3",
    submoduleCode: "A11.3",
    theory: {
      title: {
        fr: "Graphique dans un repère",
      },
      paragraphs: { fr: [] },
      blocks: [
        {
          type: "heading",
          fr: "Le repère cartésien",
          black: true,
        },
        {
          type: "plain",
          fr: "Le repère cartésien est formé de deux axes perpendiculaires qui se croisent en l'**origine O(0, 0)**.",
        },
        {
          type: "table",
          headersFr: ["Axe", "Direction", "Variable", "Nom"],
          accentHeader: true,
          rows: [
            ["Axe des abscisses", "Horizontal (→)", "x", "Axe x"],
            ["Axe des ordonnées", "Vertical (↑)", "y", "Axe y"],
          ],
        },
        {
          type: "heading",
          fr: "Lire et placer des coordonnées",
          black: true,
        },
        {
          type: "rule",
          titleFr: "Comment placer un point (x ; y)",
          itemsFr: [
            "1. Repérer la valeur x sur l'axe horizontal",
            "2. Depuis ce point, monter (ou descendre) jusqu'à la valeur y",
            "3. Marquer le point à l'intersection",
          ],
        },
        {
          type: "section",
          labelFr: "Exemples de coordonnées",
          itemsFr: [
            "A(3 ; 7) → x = 3, y = 7 (3 vers la droite, 7 vers le haut)",
            "B(**−**2 ; 5) → x = **−**2, y = 5 (2 vers la gauche, 5 vers le haut)",
            "O(0 ; 0) → l'origine, intersection des deux axes",
          ],
        },
        {
          type: "heading",
          fr: "Tracer le graphique d'une fonction",
          black: true,
        },
        {
          type: "rule",
          titleFr: "3 étapes",
          itemsFr: [
            "1. Construire le tableau de valeurs",
            "2. Placer chaque point (x ; f(x)) dans le repère",
            "3. Relier les points par une courbe lisse (ou une droite si la fonction est affine/linéaire)",
          ],
        },
        {
          type: "note",
          fr: "Lecture graphique : pour un x donné → lire y sur la courbe. Pour un y donné → aller horizontalement jusqu'à la courbe, lire x.",
        },
      ],
    },
  exercises: [],
  exercisePool: [
    { id: "a11-3-ep01", promptFr: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", type: "number", acceptable: ["14"], hintFr: "f(4) = 3 × 4 + 2 = 12 + 2 = ?" },
    { id: "a11-3-ep02", promptFr: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", type: "number", acceptable: ["4"], hintFr: "f(7) = 7 − 3 = ?" },
    { id: "a11-3-ep03", promptFr: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", type: "number", acceptable: ["20"], hintFr: "f(5) = 4 × 5 = ?" },
    { id: "a11-3-ep04", promptFr: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", type: "number", acceptable: ["4"], hintFr: "f(3) = −3 + 7 = ?" },
    { id: "a11-3-ep05", promptFr: "Quelle est l'abscisse du point (5 ; 12) ?", type: "number", acceptable: ["5"], hintFr: "Le premier nombre d'un couple (x ; y) est l'abscisse." },
    { id: "a11-3-ep06", promptFr: "Quelle est l'ordonnée du point (5 ; 12) ?", type: "number", acceptable: ["12"], hintFr: "Le second nombre d'un couple (x ; y) est l'ordonnée." },
    { id: "a11-3-ep07", promptFr: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", type: "number", acceptable: ["13"], hintFr: "f(6) = 3 × 6 − 5 = 18 − 5 = ?" },
    { id: "a11-3-ep08", promptFr: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", type: "number", acceptable: ["5"], hintFr: "f(−3) = −3 + 8 = ?" },
    { id: "a11-3-ep09", promptFr: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", type: "number", acceptable: ["13"], hintFr: "f(3) = 5 × 3 − 2 = 15 − 2 = ?" },
    { id: "a11-3-ep10", promptFr: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", type: "number", acceptable: ["4"], hintFr: "f(2) = −3 × 2 + 10 = −6 + 10 = ?" },
    { id: "a11-3-ep11", promptFr: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", type: "number", acceptable: ["7"], hintFr: "f(0) = 2 × 0 + 7 = 7 (ordonnée à l'origine)." },
    { id: "a11-3-ep12", promptFr: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", type: "number", acceptable: ["8"], hintFr: "f(2) = 6 × 2 − 4 = 12 − 4 = ?" },
  ],
  poolSize: 5,
};

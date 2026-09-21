import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G7_5_ROTATION_LESSON: MathSubmoduleLesson = {
  submoduleId: "G7-5",
  submoduleCode: "G7.5",
  theory: {
    title: { fr: "Rotation" },
    blocks: [
      { type: "heading", fr: "Tourner une figure", black: true },
      {
        type: "plain",
        fr: "Une **rotation** fait tourner chaque point autour d'un centre, d'un angle donné. Sur le quadrillage, on repère le sens grâce à un **trait bleu** sur le bord de la grille.",
      },
      { type: "highlight", fr: "Le trait bleu" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "Sur le **modèle**, le trait bleu indique l'orientation de départ (à **gauche** ou à **droite**).",
          "Sur la grille vide, le trait bleu montre l'orientation après rotation.",
          "Il faut redessiner la figure dans ce nouveau sens.",
        ],
      },
      { type: "highlight", fr: "Exercice 1 — départ à gauche" },
      {
        type: "bullets",
        itemsFr: [
          "Modèle : trait **à gauche**",
          "Cible **en haut** → **90°** horaire",
          "Cible **à droite** → **180°**",
          "Cible **en bas** → **270°** horaire",
        ],
      },
      { type: "highlight", fr: "Exercice 2 — départ à droite" },
      {
        type: "bullets",
        itemsFr: [
          "Modèle : trait **à droite**",
          "Cible **en bas** → **90°** horaire",
          "Cible **à gauche** → **180°**",
          "Cible **en haut** → **270°** horaire",
        ],
      },
      { type: "highlight", fr: "Propriétés" },
      {
        type: "section",
        labelFr: "",
        itemsFr: [
          "La rotation conserve les **distances**, les **angles** et les **aires**.",
          "La figure garde la **même taille** ; seule l'orientation change.",
          "Un tour complet (**360°**) ramène la figure à sa position initiale.",
        ],
      },
      {
        type: "note",
        fr: "Cliquez deux intersections pour tracer un segment ; cliquez deux fois le même point pour placer ou retirer un point.",
      },
    ],
    paragraphs: { fr: [] },
  },
  exercises: [],
};

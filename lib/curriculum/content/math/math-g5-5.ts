import type { MathSubmoduleLesson } from "./math-a1-types";

export const MATH_G5_5_LESSON: MathSubmoduleLesson = {
    submoduleId: "G5-5",
    submoduleCode: "G5.5",
    theory: {
      title: {
        fr: "Cercle de rayon donné",
      },
      paragraphs: {
        fr: [
          "Pour tracer un cercle de centre O et de rayon r : (1) placer la pointe du compas en O ; (2) écarter les branches du compas jusqu'à r ; (3) faire tourner le compas à 360°.",
          "Pour tracer un cercle passant par trois points : trouver le centre en construisant les médiatrices de deux côtés du triangle formé par les trois points.",
          "Arc de cercle : partie d'un cercle délimitée par deux points. Pour tracer un arc de r et angle α, utiliser le rapporteur pour les angles.",
          "Application : tracer un cercle inscrit dans un carré (le rayon est la moitié du côté).",
        ],
      },
    },
    exercises: [
      { id: "g4-5-e1", promptFr: "Pour tracer un cercle de rayon 4 cm, quelle écartement du compas faut-il ?", type: "number", acceptable: ["4"] },
      { id: "g4-5-e2", promptFr: "Un cercle inscrit dans un carré de côté 8 cm a un rayon de ?", type: "number", acceptable: ["4"] },
      { id: "g4-5-e3", promptFr: "Quel outil trace un cercle ?", type: "short_text", acceptable: ["compas"] },
      { id: "g4-5-e4", promptFr: "Un demi-cercle correspond à combien de degrés d'arc ?", type: "number", acceptable: ["180"] },
      { id: "g4-5-e5", promptFr: "La médiatrice d'un segment passe-t-elle par le milieu du segment ? (oui/non)", type: "short_text", acceptable: ["oui"] },
    ],
  };

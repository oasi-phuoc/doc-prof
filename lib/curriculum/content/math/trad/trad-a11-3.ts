import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_3: SubmoduleTrad = {
  submoduleId: "A11-3",
  title: {
    fr: "Graphique dans un repère",
    en: "Graph in a coordinate system",
    ar: "الرسم البياني في منظومة إحداثيات",
    fa: "نمودار در دستگاه مختصات",
    ti: "ስዕሊ ኣብ ናይ ቦታ ስርዓት",
    uk: "Графік у системі координат",
  },
  blocks: [
    {
      text: {
        fr: "Le repère cartésien",
      }
    },
    {
      text: {
        fr: "Le repère cartésien est formé de deux axes perpendiculaires qui se croisent en l'**origine O(0, 0)**.",
      }
    },
    {
      headers: {
        fr: ["Axe", "Direction", "Variable", "Nom"],
      }
    },
    {
      text: {
        fr: "Lire et placer des coordonnées",
      }
    },
    {
      text: {
        fr: "Comment placer un point (x ; y)",
      },
      items: {
        fr: [
            "1. Repérer la valeur x sur l'axe horizontal",
            "2. Depuis ce point, monter (ou descendre) jusqu'à la valeur y",
            "3. Marquer le point à l'intersection",
          ],
      }
    },
    {
      label: {
        fr: "Exemples de coordonnées",
      },
      items: {
        fr: [
            "A(3 ; 7) → x = 3, y = 7 (3 vers la droite, 7 vers le haut)",
            "B(**−**2 ; 5) → x = **−**2, y = 5 (2 vers la gauche, 5 vers le haut)",
            "O(0 ; 0) → l'origine, intersection des deux axes",
          ],
      }
    },
    {
      text: {
        fr: "Tracer le graphique d'une fonction",
      }
    },
    {
      text: {
        fr: "3 étapes",
      },
      items: {
        fr: [
            "1. Construire le tableau de valeurs",
            "2. Placer chaque point (x ; f(x)) dans le repère",
            "3. Relier les points par une courbe lisse (ou une droite si la fonction est affine/linéaire)",
          ],
      }
    },
    {
      text: {
        fr: "Lecture graphique : pour un x donné → lire y sur la courbe. Pour un y donné → aller horizontalement jusqu'à la courbe, lire x.",
      }
    },
  ],
  consignes: {
    "a11-3-ep01": { fr: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", en: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", ar: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", fa: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", ti: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", uk: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", pt: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", so: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", tr: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?", ps: "Sur la droite f(x) = 3x + 2, quelle est l'ordonnée du point d'abscisse 4 ?" },
    "a11-3-ep02": { fr: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", en: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", ar: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", fa: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", ti: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", uk: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", pt: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", so: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", tr: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?", ps: "Sur la droite f(x) = x − 3, quelle est l'ordonnée du point d'abscisse 7 ?" },
    "a11-3-ep03": { fr: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", en: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", ar: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", fa: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", ti: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", uk: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", pt: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", so: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", tr: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?", ps: "Sur la droite f(x) = 4x, quelle est l'ordonnée du point d'abscisse 5 ?" },
    "a11-3-ep04": { fr: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", en: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", ar: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", fa: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", ti: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", uk: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", pt: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", so: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", tr: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?", ps: "Sur la droite f(x) = −x + 7, quelle est l'ordonnée du point d'abscisse 3 ?" },
    "a11-3-ep05": { fr: "Quelle est l'abscisse du point (5 ; 12) ?", en: "What is l'abscisse du point (5 ; 12) ?", ar: "ما هي l'abscisse du point (5 ; 12) ?", fa: "چیست l'abscisse du point (5 ; 12) ?", ti: "What is l'abscisse du point (5 ; 12) ?", uk: "Яка l'abscisse du point (5 ; 12) ?", pt: "Qual é l'abscisse du point (5 ; 12) ?", so: "What is l'abscisse du point (5 ; 12) ?", tr: "Nedir l'abscisse du point (5 ; 12) ?", ps: "What is l'abscisse du point (5 ; 12) ?" },
    "a11-3-ep06": { fr: "Quelle est l'ordonnée du point (5 ; 12) ?", en: "What is l'ordonnée du point (5 ; 12) ?", ar: "ما هي l'ordonnée du point (5 ; 12) ?", fa: "چیست l'ordonnée du point (5 ; 12) ?", ti: "What is l'ordonnée du point (5 ; 12) ?", uk: "Яка l'ordonnée du point (5 ; 12) ?", pt: "Qual é l'ordonnée du point (5 ; 12) ?", so: "What is l'ordonnée du point (5 ; 12) ?", tr: "Nedir l'ordonnée du point (5 ; 12) ?", ps: "What is l'ordonnée du point (5 ; 12) ?" },
    "a11-3-ep07": { fr: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", en: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", ar: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", fa: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", ti: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", uk: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", pt: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", so: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", tr: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?", ps: "Sur la droite f(x) = 3x − 5, quelle est l'ordonnée du point d'abscisse 6 ?" },
    "a11-3-ep08": { fr: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", en: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", ar: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", fa: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", ti: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", uk: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", pt: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", so: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", tr: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?", ps: "Sur la droite f(x) = x + 8, quelle est l'ordonnée du point d'abscisse −3 ?" },
    "a11-3-ep09": { fr: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", en: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", ar: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", fa: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", ti: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", uk: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", pt: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", so: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", tr: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?", ps: "Sur la droite f(x) = 5x − 2, quelle est l'ordonnée du point d'abscisse 3 ?" },
    "a11-3-ep10": { fr: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", en: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", ar: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", fa: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", ti: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", uk: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", pt: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", so: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", tr: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?", ps: "Sur la droite f(x) = −3x + 10, quelle est l'ordonnée du point d'abscisse 2 ?" },
    "a11-3-ep11": { fr: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", en: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", ar: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", fa: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", ti: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", uk: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", pt: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", so: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", tr: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?", ps: "Sur la droite f(x) = 2x + 7, quelle est l'ordonnée du point d'abscisse 0 ?" },
    "a11-3-ep12": { fr: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", en: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", ar: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", fa: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", ti: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", uk: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", pt: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", so: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", tr: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?", ps: "Sur la droite f(x) = 6x − 4, quelle est l'ordonnée du point d'abscisse 2 ?" },
  },
};

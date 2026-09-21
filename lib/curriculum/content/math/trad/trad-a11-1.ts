import type { SubmoduleTrad } from "./trad-types";

export const TRAD_A11_1: SubmoduleTrad = {
  submoduleId: "A11-1",
  title: {
    fr: "Notion de fonction",
    en: "Notion of function",
    ar: "مفهوم الدالة",
    fa: "مفهوم تابع",
    ti: "ናይ ስራሕ ሓሳብ",
    uk: "Поняття функції",
  },
  blocks: [
    {
      text: {
        fr: "Qu'est-ce qu'une fonction ?",
      }
    },
    {
      text: {
        fr: "Une fonction est une règle qui associe à chaque valeur d'entrée x **une et une seule** valeur de sortie y. On note f(x) = expression en x.",
      }
    },
    {
      text: {
        fr: "Vocabulaire essentiel",
      },
      items: {
        fr: [
            "**x** = valeur d'entrée (antécédent)",
            "**f(x)** = valeur de sortie (image de x)",
            "**Domaine** = ensemble des valeurs d'entrée autorisées",
          ],
      }
    },
    {
      text: {
        fr: "Comment utiliser une fonction",
      }
    },
    {
      text: {
        fr: "Calculer f(x) pour une valeur donnée",
      }
    },
    {
      items: {
        fr: [
            "f(x) = 2x **+** 3",
            "Pour x = 4 : f(4) = 2 × 4 **+** 3 = 8 **+** 3 = **11**",
            "On dit : « l'image de 4 par f est 11 »",
          ],
      }
    },
    {
      text: {
        fr: "Formes de représentation",
      }
    },
    {
      label: {
        fr: "Une fonction peut être représentée par :",
      },
      items: {
        fr: [
            "Une **formule** : f(x) = 2x **+** 3",
            "Un **tableau de valeurs** : liste de couples (x, f(x))",
            "Un **graphique** : courbe dans un repère cartésien",
          ],
      }
    },
    {
      headers: {
        fr: ["x", "0", "1", "2", "3", "4"],
      }
    },
  ],
  consignes: {
    "a11-1-ep01": { fr: "f(x) = 3x + 2. Calcule f(4).", en: "f(x) = 3x + 2. Calculate f(4).", ar: "f(x) = 3x + 2. احسب f(4).", fa: "f(x) = 3x + 2. حساب کنید f(4).", ti: "f(x) = 3x + 2. Calculate f(4).", uk: "f(x) = 3x + 2. Обчисліть f(4).", pt: "f(x) = 3x + 2. Calcule f(4).", so: "f(x) = 3x + 2. Calculate f(4).", tr: "f(x) = 3x + 2. Hesaplayın f(4).", ps: "f(x) = 3x + 2. Calculate f(4)." },
    "a11-1-ep02": { fr: "f(x) = 4x − 1. Calcule f(5).", en: "f(x) = 4x − 1. Calculate f(5).", ar: "f(x) = 4x − 1. احسب f(5).", fa: "f(x) = 4x − 1. حساب کنید f(5).", ti: "f(x) = 4x − 1. Calculate f(5).", uk: "f(x) = 4x − 1. Обчисліть f(5).", pt: "f(x) = 4x − 1. Calcule f(5).", so: "f(x) = 4x − 1. Calculate f(5).", tr: "f(x) = 4x − 1. Hesaplayın f(5).", ps: "f(x) = 4x − 1. Calculate f(5)." },
    "a11-1-ep03": { fr: "f(x) = x². Calcule f(6).", en: "f(x) = x². Calculate f(6).", ar: "f(x) = x². احسب f(6).", fa: "f(x) = x². حساب کنید f(6).", ti: "f(x) = x². Calculate f(6).", uk: "f(x) = x². Обчисліть f(6).", pt: "f(x) = x². Calcule f(6).", so: "f(x) = x². Calculate f(6).", tr: "f(x) = x². Hesaplayın f(6).", ps: "f(x) = x². Calculate f(6)." },
    "a11-1-ep04": { fr: "f(x) = 5x + 3. Calcule f(0).", en: "f(x) = 5x + 3. Calculate f(0).", ar: "f(x) = 5x + 3. احسب f(0).", fa: "f(x) = 5x + 3. حساب کنید f(0).", ti: "f(x) = 5x + 3. Calculate f(0).", uk: "f(x) = 5x + 3. Обчисліть f(0).", pt: "f(x) = 5x + 3. Calcule f(0).", so: "f(x) = 5x + 3. Calculate f(0).", tr: "f(x) = 5x + 3. Hesaplayın f(0).", ps: "f(x) = 5x + 3. Calculate f(0)." },
    "a11-1-ep05": { fr: "f(x) = x + 7. Calcule f(9).", en: "f(x) = x + 7. Calculate f(9).", ar: "f(x) = x + 7. احسب f(9).", fa: "f(x) = x + 7. حساب کنید f(9).", ti: "f(x) = x + 7. Calculate f(9).", uk: "f(x) = x + 7. Обчисліть f(9).", pt: "f(x) = x + 7. Calcule f(9).", so: "f(x) = x + 7. Calculate f(9).", tr: "f(x) = x + 7. Hesaplayın f(9).", ps: "f(x) = x + 7. Calculate f(9)." },
    "a11-1-ep06": { fr: "f(x) = 6x − 3. Calcule f(4).", en: "f(x) = 6x − 3. Calculate f(4).", ar: "f(x) = 6x − 3. احسب f(4).", fa: "f(x) = 6x − 3. حساب کنید f(4).", ti: "f(x) = 6x − 3. Calculate f(4).", uk: "f(x) = 6x − 3. Обчисліть f(4).", pt: "f(x) = 6x − 3. Calcule f(4).", so: "f(x) = 6x − 3. Calculate f(4).", tr: "f(x) = 6x − 3. Hesaplayın f(4).", ps: "f(x) = 6x − 3. Calculate f(4)." },
    "a11-1-ep07": { fr: "f(x) = x² + 3. Calcule f(5).", en: "f(x) = x² + 3. Calculate f(5).", ar: "f(x) = x² + 3. احسب f(5).", fa: "f(x) = x² + 3. حساب کنید f(5).", ti: "f(x) = x² + 3. Calculate f(5).", uk: "f(x) = x² + 3. Обчисліть f(5).", pt: "f(x) = x² + 3. Calcule f(5).", so: "f(x) = x² + 3. Calculate f(5).", tr: "f(x) = x² + 3. Hesaplayın f(5).", ps: "f(x) = x² + 3. Calculate f(5)." },
    "a11-1-ep08": { fr: "f(x) = 7x. Calcule f(8).", en: "f(x) = 7x. Calculate f(8).", ar: "f(x) = 7x. احسب f(8).", fa: "f(x) = 7x. حساب کنید f(8).", ti: "f(x) = 7x. Calculate f(8).", uk: "f(x) = 7x. Обчисліть f(8).", pt: "f(x) = 7x. Calcule f(8).", so: "f(x) = 7x. Calculate f(8).", tr: "f(x) = 7x. Hesaplayın f(8).", ps: "f(x) = 7x. Calculate f(8)." },
    "a11-1-ep09": { fr: "f(x) = 2x + 5. Calcule f(−2).", en: "f(x) = 2x + 5. Calculate f(−2).", ar: "f(x) = 2x + 5. احسب f(−2).", fa: "f(x) = 2x + 5. حساب کنید f(−2).", ti: "f(x) = 2x + 5. Calculate f(−2).", uk: "f(x) = 2x + 5. Обчисліть f(−2).", pt: "f(x) = 2x + 5. Calcule f(−2).", so: "f(x) = 2x + 5. Calculate f(−2).", tr: "f(x) = 2x + 5. Hesaplayın f(−2).", ps: "f(x) = 2x + 5. Calculate f(−2)." },
    "a11-1-ep10": { fr: "f(x) = x² − 6. Calcule f(4).", en: "f(x) = x² − 6. Calculate f(4).", ar: "f(x) = x² − 6. احسب f(4).", fa: "f(x) = x² − 6. حساب کنید f(4).", ti: "f(x) = x² − 6. Calculate f(4).", uk: "f(x) = x² − 6. Обчисліть f(4).", pt: "f(x) = x² − 6. Calcule f(4).", so: "f(x) = x² − 6. Calculate f(4).", tr: "f(x) = x² − 6. Hesaplayın f(4).", ps: "f(x) = x² − 6. Calculate f(4)." },
    "a11-1-ep11": { fr: "f(x) = 8x − 4. Calcule f(3).", en: "f(x) = 8x − 4. Calculate f(3).", ar: "f(x) = 8x − 4. احسب f(3).", fa: "f(x) = 8x − 4. حساب کنید f(3).", ti: "f(x) = 8x − 4. Calculate f(3).", uk: "f(x) = 8x − 4. Обчисліть f(3).", pt: "f(x) = 8x − 4. Calcule f(3).", so: "f(x) = 8x − 4. Calculate f(3).", tr: "f(x) = 8x − 4. Hesaplayın f(3).", ps: "f(x) = 8x − 4. Calculate f(3)." },
    "a11-1-ep12": { fr: "f(x) = 3x² + 1. Calcule f(2).", en: "f(x) = 3x² + 1. Calculate f(2).", ar: "f(x) = 3x² + 1. احسب f(2).", fa: "f(x) = 3x² + 1. حساب کنید f(2).", ti: "f(x) = 3x² + 1. Calculate f(2).", uk: "f(x) = 3x² + 1. Обчисліть f(2).", pt: "f(x) = 3x² + 1. Calcule f(2).", so: "f(x) = 3x² + 1. Calculate f(2).", tr: "f(x) = 3x² + 1. Hesaplayın f(2).", ps: "f(x) = 3x² + 1. Calculate f(2)." },
  },
};
